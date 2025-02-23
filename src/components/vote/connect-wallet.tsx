'use client'

import { useState } from 'react'

export function ConnectWallet() {
  const [address, setAddress] = useState<string | null>(null)

  const connectWallet = async () => {
    // Mock wallet connection
    setAddress('0x1234...5678')
  }

  return (
    <button
      onClick={connectWallet}
      className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
    >
      {address ? address : 'Connect Wallet'}
    </button>
  )
} 