'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface TransactionInfo {
  hash: string;
  from?: string;
  to?: string;
  value?: string;
  status?: 'pending' | 'confirmed' | 'failed';
}

interface BlockTransaction {
  hash: string;
  from: string;
  to: string;
  value: ethers.BigNumber;
}

export default function EventListening() {
  const [pendingTxs, setPendingTxs] = useState<TransactionInfo[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let provider: ethers.providers.JsonRpcProvider;

    const setupEventListening = async () => {
      try {
        provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
        setIsConnected(true);
        
        provider.on('block', async (blockNumber) => {
          try {
            const block = await provider.getBlock(blockNumber);
            const transactions = await Promise.all(
              block.transactions.map(async (txHash) => {
                // 获取交易收据来确认状态
                const receipt = await provider.getTransactionReceipt(txHash);
                const tx = await provider.getTransaction(txHash);
                return { tx, receipt };
              })
            );

            for (const { tx, receipt } of transactions) {
              if (!tx) continue;
              
              const txInfo: TransactionInfo = {
                hash: tx.hash,
                from: tx.from,
                to: tx.to || 'Contract Creation',
                value: tx.value ? ethers.utils.formatEther(tx.value) + ' ETH' : '0 ETH',
                // 如果有收据，根据收据状态设置，否则为待确认
                status: receipt ? (receipt.status === 1 ? 'confirmed' : 'failed') : 'pending'
              };

              setPendingTxs(prev => {
                if (!prev.some(t => t.hash === tx.hash)) {
                  const newTxs = [txInfo, ...prev];
                  return newTxs.slice(0, 10);
                }
                // 更新现有交易的状态
                return prev.map(t => 
                  t.hash === tx.hash ? txInfo : t
                );
              });
            }
          } catch (err) {
            console.error('Error processing block:', err);
          }
        });

      } catch (err) {
        setError(err instanceof Error ? err.message : '连接失败');
        setIsConnected(false);
      }
    };

    setupEventListening();

    return () => {
      if (provider) {
        provider.removeAllListeners();
      }
    };
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">区块链事件监听</h1>

      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">连接状态</h2>
          <p className={isConnected ? 'text-green-600' : 'text-red-600'}>
            {isConnected ? '已连接' : '未连接'}
          </p>
          {error && (
            <p className="text-red-600 mt-2">{error}</p>
          )}
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">待处理交易</h2>
          {pendingTxs.length > 0 ? (
            <ul className="space-y-4">
              {pendingTxs.map((tx, index) => (
                <li key={tx.hash} className="border-b pb-2 last:border-b-0">
                  <div className="break-all">
                    <p><strong>交易哈希:</strong> {tx.hash}</p>
                    <p><strong>发送方:</strong> {tx.from}</p>
                    <p><strong>接收方:</strong> {tx.to}</p>
                    <p><strong>金额:</strong> {tx.value}</p>
                    <p><strong>状态:</strong> 
                      <span className={`ml-2 ${
                        tx.status === 'confirmed' ? 'text-green-600' :
                        tx.status === 'failed' ? 'text-red-600' :
                        'text-yellow-600'
                      }`}>
                        {tx.status === 'confirmed' ? '已确认' :
                         tx.status === 'failed' ? '失败' : 
                         '待确认'}
                      </span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>等待新的交易...</p>
          )}
        </div>
      </div>
    </main>
  );
} 