import { create } from 'zustand';
import { ethers } from 'ethers';

interface WalletState {
  signer: ethers.Signer | null;
  isConnected: boolean;
  error: string;
  connectWallet: () => Promise<void>;
}

export const useWalletStore = create<WalletState>((set) => ({
  signer: null,
  isConnected: false,
  error: '',
  connectWallet: async () => {
    try {
      if (!window.ethereum) {
        throw new Error('请安装 MetaMask');
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      
      set({ signer, isConnected: true, error: '' });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : '连接钱包失败' });
    }
  },
})); 