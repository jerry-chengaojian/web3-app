'use client'

import { useRouter } from "next/navigation"

interface BallotCardProps {
  ballot: {
    id: string
    chairperson: string
    proposals: Array<{ name: string, voteCount: number }>
    voterCount: number
    status: 'active' | 'ended'
    endTime: number
  }
}

export function BallotCard({ ballot }: BallotCardProps) {
  const router = useRouter()
  const totalVotes = ballot.proposals.reduce((acc, p) => acc + p.voteCount, 0)
  const leadingProposal = ballot.proposals.reduce((a, b) => 
    a.voteCount > b.voteCount ? a : b
  )

  return (
    <div className="rounded-lg border bg-white hover:shadow-lg transition-shadow">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">
            {ballot.proposals.length} Proposals
          </h3>
          <span className={`px-2 py-1 rounded-full text-sm ${
            ballot.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100'
          }`}>
            {ballot.status === 'active' ? 'Active' : 'Ended'}
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Leading Proposal</p>
            <p className="font-medium">{leadingProposal.name}</p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${(leadingProposal.voteCount / totalVotes) * 100}%` }}
              />
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <span>Voters: {ballot.voterCount}</span>
            <span>Total Votes: {totalVotes}</span>
          </div>
        </div>
      </div>
      <div className="p-6 border-t">
        <button 
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          onClick={() => router.push(`/vote/ballot/${ballot.id}`)}
        >
          View Details
        </button>
      </div>
    </div>
  )
} 