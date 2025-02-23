'use client'

import { useRouter } from "next/navigation"
import { ConnectWallet } from "@/components/vote/connect-wallet"

export function Header() {
  const router = useRouter()

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <h1 
          onClick={() => router.push('/vote')}
          className="text-xl font-bold cursor-pointer hover:text-gray-700 transition-colors"
        >
          Voting System
        </h1>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/vote/create')}
            className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors"
          >
            Create New Vote
          </button>
          <ConnectWallet />
        </div>
      </div>
    </header>
  )
} 