'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum: any; // or a more specific type if known
  }
}

export interface WalletState {
  address: string;
  isConnected: boolean;
  chainId: number | null;
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
}

export function useWallet() {
  const [walletState, setWalletState] = useState<WalletState>({
    address: '',
    isConnected: false,
    chainId: null,
    provider: null,
    signer: null,
  });
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (typeof window.ethereum === 'undefined') {
      setError('请安装 MetaMask 钱包');
      return;
    }

    // 监听账户变化
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    // 监听链变化
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, []);

  const handleAccountsChanged = async (accounts: string[]) => {
    if (accounts.length === 0) {
      setWalletState({
        address: '',
        isConnected: false,
        chainId: null,
        provider: null,
        signer: null,
      });
    } else {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const network = await provider.getNetwork();
      
      setWalletState({
        address: accounts[0],
        isConnected: true,
        chainId: network.chainId,
        provider,
        signer,
      });
    }
  };

  const handleChainChanged = (chainId: string) => {
    window.location.reload();
  };

  const connectWallet = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const network = await provider.getNetwork();

      setWalletState({
        address: accounts[0],
        isConnected: true,
        chainId: network.chainId,
        provider,
        signer,
      });
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : '连接钱包失败');
    }
  };

  return {
    ...walletState,
    error,
    connectWallet,
  };
} 