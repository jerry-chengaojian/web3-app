'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import MyTokenABI from '@/contracts/MyToken.json';
import { getReadOnlyContract } from '@/utils/ethereum';

export default function ReadContract() {
  const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [tokenData, setTokenData] = useState({
    name: '',
    symbol: '',
    totalSupply: '0',
    decimals: 0
  });
  const [accountBalance, setAccountBalance] = useState('0');
  const [accountAddress, setAccountAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContractData = async () => {
      try {
        const contractInstance = getReadOnlyContract(CONTRACT_ADDRESS, MyTokenABI.abi);
        setContract(contractInstance);

        const [name, symbol, totalSupply, decimals] = await Promise.all([
          contractInstance.name(),
          contractInstance.symbol(),
          contractInstance.totalSupply(),
          contractInstance.decimals()
        ]);

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

  const handleCheckBalance = async () => {
    if (!accountAddress || !contract) {
      setError('Please enter an account address');
      return;
    }

    try {
      const balance = await contract.balanceOf(accountAddress);
      setAccountBalance(ethers.utils.formatUnits(balance, tokenData.decimals));
      setError(null);
    } catch (err) {
      console.error('Error checking balance:', err);
      setError('Failed to check balance. Please verify the address is correct.');
    }
  };

  if (loading) {
    return <div className="p-4">Loading contract data...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Token Contract Information</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="space-y-4">
          <div className="flex items-center">
            <span className="w-32 font-semibold text-gray-700">Name:</span>
            <span className="text-gray-800">{tokenData.name}</span>
          </div>
          <div className="flex items-center">
            <span className="w-32 font-semibold text-gray-700">Symbol:</span>
            <span className="text-gray-800">{tokenData.symbol}</span>
          </div>
          <div className="flex items-center">
            <span className="w-32 font-semibold text-gray-700">Total Supply:</span>
            <span className="text-gray-800">{tokenData.totalSupply} {tokenData.symbol}</span>
          </div>
          <div className="flex items-center">
            <span className="w-32 font-semibold text-gray-700">Decimals:</span>
            <span className="text-gray-800">{tokenData.decimals}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Check Account Balance</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Enter account address"
              value={accountAddress}
              onChange={(e) => setAccountAddress(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleCheckBalance}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Check Balance
            </button>
          </div>
          
          {accountBalance !== '0' && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <p className="text-gray-800">
                <span className="font-semibold">Balance:</span>{' '}
                {accountBalance} {tokenData.symbol}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 