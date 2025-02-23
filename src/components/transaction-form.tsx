'use client';

import { useState } from 'react';
import { ethers } from 'ethers';

interface TransactionFormProps {
  onSubmit: (recipient: string, amount: string) => Promise<void>;
  title: string;
  amountLabel: string;
  submitButtonText: string;
  loading: boolean;
  error?: string;
  transactionHash?: string;
}

export function TransactionForm({
  onSubmit,
  title,
  amountLabel,
  submitButtonText,
  loading,
  error,
  transactionHash,
}: TransactionFormProps) {
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(recipientAddress, amount);
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">{title}</h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
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
            {amountLabel}
          </label>
          <input
            id="amount"
            type="number"
            step="0.000000000000000001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded ${
            loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          } text-white font-medium`}
        >
          {loading ? '交易处理中...' : submitButtonText}
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
          <p className="break-all">交易哈希: {transactionHash}</p>
        </div>
      )}
    </main>
  );
} 