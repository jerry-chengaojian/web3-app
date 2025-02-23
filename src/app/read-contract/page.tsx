'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import MyTokenABI from '@/contracts/MyToken.json';

export default function ReadContract() {
  const [tokenData, setTokenData] = useState({
    name: '',
    symbol: '',
    totalSupply: '0',
    decimals: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContractData = async () => {
      try {
        // 连接到本地区块链
        const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
        
        // 创建合约实例
        const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
        const contract = new ethers.Contract(contractAddress, MyTokenABI.abi, provider);

        // 读取合约数据
        const [name, symbol, totalSupply, decimals] = await Promise.all([
          contract.name(),
          contract.symbol(),
          contract.totalSupply(),
          contract.decimals()
        ]);

        // 更新状态
        setTokenData({
          name,
          symbol,
          totalSupply: ethers.utils.formatUnits(totalSupply, decimals),
          decimals
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching contract data:', err);
        setError('Failed to fetch contract data');
        setLoading(false);
      }
    };

    fetchContractData();
  }, []);

  if (loading) {
    return <div className="p-4">Loading contract data...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Token Contract Information</h1>
      <div className="space-y-2">
        <p><span className="font-semibold">Name:</span> {tokenData.name}</p>
        <p><span className="font-semibold">Symbol:</span> {tokenData.symbol}</p>
        <p><span className="font-semibold">Total Supply:</span> {tokenData.totalSupply} {tokenData.symbol}</p>
        <p><span className="font-semibold">Decimals:</span> {tokenData.decimals}</p>
      </div>
    </div>
  );
} 