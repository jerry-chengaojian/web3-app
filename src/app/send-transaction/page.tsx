'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import { wallet } from '@/utils/ethereum';

export default function SendTransaction() {
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setTransactionHash('');
    setLoading(true);

    try {
      const tx = {
        to: recipientAddress,
        value: ethers.utils.parseEther(amount),
      };

      const transaction = await wallet.sendTransaction(tx);
      setTransactionHash(transaction.hash);
      
      const receipt = await transaction.wait();
      console.log('Transaction confirmed:', receipt);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">发送交易</h1>

      <form onSubmit={handleSendTransaction} className="space-y-6 max-w-md">
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
            金额 (ETH)
          </label>
          <input
            id="amount"
            type="number"
            step="0.0001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="0.1"
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
          {loading ? '交易处理中...' : '发送交易'}
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