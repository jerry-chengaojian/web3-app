import { create } from 'zustand';
import { ethers } from 'ethers';

interface WalletState {
  signer: ethers.Signer | null;
  address: string | null;
  isConnected: boolean;
  error: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  signer: null,
  address: null,
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
      const address = await signer.getAddress();
      
      // 监听钱包切换事件
      window.ethereum.on('accountsChanged', async (accounts: string[]) => {
        if (accounts.length === 0) {
          set({ signer: null, address: null, isConnected: false });
        } else {
          const newSigner = provider.getSigner();
          const newAddress = await newSigner.getAddress();
          set({ signer: newSigner, address: newAddress, isConnected: true });
        }
      });

      set({ signer, address, isConnected: true, error: '' });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : '连接钱包失败' });
    }
  },
  disconnectWallet: () => {
    set({ signer: null, address: null, isConnected: false, error: '' });
  },
})); 