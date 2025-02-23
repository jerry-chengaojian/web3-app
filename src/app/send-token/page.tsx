'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import MyTokenABI from '@/contracts/MyToken.json';
import { TransactionForm } from '@/components/transaction-form';
import { useWallet } from '@/hooks/use-wallet';

export default function SendToken() {
  const { signer, isConnected, connectWallet, error: walletError } = useWallet();
  const [transactionHash, setTransactionHash] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendToken = async (recipientAddress: string, amount: string) => {
    if (!signer) return;
    
    setError('');
    setTransactionHash('');
    setLoading(true);

    try {
      const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
      const contract = new ethers.Contract(contractAddress, MyTokenABI.abi, signer);
      const decimals = await contract.decimals();
      const tokenAmount = ethers.utils.parseUnits(amount, decimals);

      const transaction = await contract.transfer(recipientAddress, tokenAmount);
      setTransactionHash(transaction.hash);
      
      await transaction.wait();
    } catch (err) {
      setError(err instanceof Error ? err.message : '发送代币失败');
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
      onSubmit={handleSendToken}
      title="发送代币"
      amountLabel="代币数量"
      submitButtonText="发送代币"
      loading={loading}
      error={error}
      transactionHash={transactionHash}
    />
  );
} 