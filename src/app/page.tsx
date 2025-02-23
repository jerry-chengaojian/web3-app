'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { provider } from '@/utils/ethereum';

export default function Home() {
  const [balance, setBalance] = useState<string>('');
  const [blockInfo, setBlockInfo] = useState<any>(null);
  
  // 测试用的钱包地址
  const testAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'; // 这是 Hardhat 的默认第一个账户
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const balance = await provider.getBalance(testAddress);
        setBalance(ethers.utils.formatEther(balance));
        
        const block = await provider.getBlock('latest');
        setBlockInfo(block);
      } catch (error) {
        console.error('Error fetching blockchain data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">区块链数据读取</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">钱包余额</h2>
          <p>{balance ? `${balance} ETH` : '加载中...'}</p>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">最新区块信息</h2>
          {blockInfo ? (
            <div className="space-y-2">
              <p>区块号: {blockInfo.number}</p>
              <p>时间戳: {new Date(blockInfo.timestamp * 1000).toLocaleString()}</p>
              <p>交易数量: {blockInfo.transactions.length}</p>
              <p>Gas Limit: {blockInfo.gasLimit.toString()}</p>
              <p>Gas Used: {blockInfo.gasUsed.toString()}</p>
            </div>
          ) : (
            <p>加载中...</p>
          )}
        </div>
      </div>
    </main>
  );
}
