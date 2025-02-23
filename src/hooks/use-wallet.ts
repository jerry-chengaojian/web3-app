'use client';

import { useWalletStore } from '@/stores/wallet-store';

declare global {
  interface Window {
    ethereum: any; // or a more specific type if known
  }
}

export function useWallet() {
  const { signer, isConnected, error, connectWallet } = useWalletStore();
  return { signer, isConnected, error, connectWallet };
} 