'use client'

import { useRouter } from "next/navigation"

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
    </div>
    </header>
  )
} 