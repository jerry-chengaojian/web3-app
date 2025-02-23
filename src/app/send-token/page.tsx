'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import MyTokenABI from '@/contracts/MyToken.json';

export default function SendToken() {
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setTransactionHash('');
    setLoading(true);

    try {
      // 连接到本地区块链
      const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
      
      // 使用测试私钥 - Hardhat 默认第一个账户
      const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
      const wallet = new ethers.Wallet(privateKey, provider);

      // 创建合约实例
      const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
      const contract = new ethers.Contract(contractAddress, MyTokenABI.abi, wallet);

      // 获取代币精度
      const decimals = await contract.decimals();
      
      // 转换金额为正确的精度
      const tokenAmount = ethers.utils.parseUnits(amount, decimals);

      // 发送代币转账交易
      const transaction = await contract.transfer(recipientAddress, tokenAmount);
      setTransactionHash(transaction.hash);
      
      // 等待交易确认
      const receipt = await transaction.wait();
      console.log('Transaction confirmed:', receipt);
    } catch (err) {
      console.error('Error sending tokens:', err);
      setError(err instanceof Error ? err.message : 'Failed to send tokens');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">发送代币</h1>

      <form onSubmit={handleSendToken} className="space-y-6 max-w-md">
        <div>
          <label htmlFor="recipient" className="block text-sm font-medium mb-2">
            接收地址
          </label>
          <input
            id="recipient"
            type="text"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="0x..."
            required
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium mb-2">
            代币数量
          </label>
          <input
            id="amount"
            type="number"
            step="0.000000000000000001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="100"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded ${
            loading
              ? 'bg-gray-400'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white font-medium`}
        >
          {loading ? '交易处理中...' : '发送代币'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {transactionHash && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
          <p>交易已发送！</p>
          <p className="break-all">
            交易哈希: {transactionHash}
          </p>
        </div>
      )}
    </main>
  );
} 