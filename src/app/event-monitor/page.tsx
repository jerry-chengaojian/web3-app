'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import MyTokenABI from '@/contracts/MyToken.json';
import { provider } from '@/utils/ethereum';

interface TransferEvent {
  from: string;
  to: string;
  amount: string;
  timestamp: number;
  transactionHash: string;
}

export default function EventMonitor() {
  const [events, setEvents] = useState<TransferEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
    let contract: ethers.Contract;

    const setupEventListener = async () => {
      try {
        contract = new ethers.Contract(contractAddress, MyTokenABI.abi, provider);
        setIsConnected(true);

        // 使用 Set 来跟踪已处理的交易哈希
        const processedTxHashes = new Set<string>();

        // 监听 Transfer 事件
        contract.on('Transfer', async (from, to, amount, event) => {
          // 检查是否已处理过该交易
          if (processedTxHashes.has(event.transactionHash)) {
            return;
          }

          const block = await provider.getBlock(event.blockNumber);
          const newEvent: TransferEvent = {
            from,
            to,
            amount: ethers.utils.formatUnits(amount, 18),
            timestamp: block.timestamp,
            transactionHash: event.transactionHash,
          };

          processedTxHashes.add(event.transactionHash);
          setEvents(prev => {
            // 检查是否已存在相同的交易哈希
            if (prev.some(e => e.transactionHash === event.transactionHash)) {
              return prev;
            }
            return [newEvent, ...prev].slice(0, 10);
          });
        });

        // 获取历史事件
        const filter = contract.filters.Transfer();
        const pastEvents = await contract.queryFilter(filter, -1000);

        const formattedPastEvents = await Promise.all(
          pastEvents.map(async (event: any) => {
            const block = await provider.getBlock(event.blockNumber);
            processedTxHashes.add(event.transactionHash);
            return {
              from: event.args.from,
              to: event.args.to,
              amount: ethers.utils.formatUnits(event.args.value, 18),
              timestamp: block.timestamp,
              transactionHash: event.transactionHash,
            };
          })
        );

        // 去重并只保留最新的10条记录
        const uniqueEvents = formattedPastEvents.filter((event, index, self) =>
          index === self.findIndex(e => e.transactionHash === event.transactionHash)
        );

        setEvents(uniqueEvents.reverse().slice(0, 10));
      } catch (err) {
        console.error('Error setting up event listener:', err);
        setError('Failed to connect to the contract');
        setIsConnected(false);
      }
    };

    setupEventListener();

    return () => {
      if (contract) {
        contract.removeAllListeners();
      }
    };
  }, []);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Token Transfer Events Monitor</h1>
      
      <div className="mb-4">
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
          isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium">Recent Transfer Events</h3>
        </div>
        
        <div className="border-t border-gray-200">
          {events.length === 0 ? (
            <div className="p-4 text-gray-500 text-center">
              No transfer events found
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {events.map((event, index) => (
                <li key={`${event.transactionHash}-${index}`} className="p-4">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {formatTimestamp(event.timestamp)}
                      </span>
                      <span className="text-sm font-medium text-blue-600">
                        {event.amount} Tokens
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">From: </span>
                      <span className="font-mono">{formatAddress(event.from)}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">To: </span>
                      <span className="font-mono">{formatAddress(event.to)}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      <a
                        href={`https://etherscan.io/tx/${event.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-600"
                      >
                        View on Etherscan ↗
                      </a>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
} 