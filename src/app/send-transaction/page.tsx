'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import { TransactionForm } from '@/components/transaction-form';
import { useWallet } from '@/hooks/use-wallet';

export default function SendTransaction() {
  const { signer, isConnected, connectWallet, error: walletError } = useWallet();
  const [transactionHash, setTransactionHash] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendTransaction = async (recipientAddress: string, amount: string) => {
    if (!signer) return;
    
    setError('');
    setTransactionHash('');
    setLoading(true);

    try {
      const tx = {
        to: recipientAddress,
        value: ethers.utils.parseEther(amount),
      };

      const transaction = await signer.sendTransaction(tx);
      setTransactionHash(transaction.hash);
      
      await transaction.wait();
    } catch (err) {
      setError(err instanceof Error ? err.message : '交易失败');
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="p-8">
        <button
          onClick={connectWallet}
          className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          连接钱包
        </button>
        {walletError && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
            {walletError}
          </div>
        )}
      </div>
    );
  }

  return (
    <TransactionForm
      onSubmit={handleSendTransaction}
      title="发送交易"
      amountLabel="金额 (ETH)"
      submitButtonText="发送交易"
      loading={loading}
      error={error}
      transactionHash={transactionHash}
    />
  );
} 