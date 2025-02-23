'use client';

import Link from "next/link";
import { useEffect } from 'react';
import { useWalletStore } from '@/stores/wallet-store';

export function NavBar() {
  const connectWallet = useWalletStore(state => state.connectWallet);

  useEffect(() => {
    if (window.ethereum) {
      // 检查是否已经授权
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            connectWallet();
          }
        });
    }
  }, [connectWallet]);

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-30 top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link 
                href="/" 
                className="text-xl font-bold text-gray-900 hover:text-gray-700"
              >
                区块链浏览器
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300"
              >
                区块信息
              </Link>
              <Link
                href="/event-listening"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300"
              >
                事件监听
              </Link>
              <Link
                href="/event-monitor"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300"
              >
                事件监控
              </Link>
              <Link
                href="/send-transaction"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300"
              >
                发送交易
              </Link>
              <Link
                href="/read-contract"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300"
              >
                合约读取
              </Link>
              <Link
                href="/send-token"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300"
              >
                发送代币
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 