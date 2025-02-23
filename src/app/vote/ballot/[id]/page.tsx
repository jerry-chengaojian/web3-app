'use client'

import { useState } from 'react'

// Mock data
const MOCK_BALLOT = {
  id: '1',
  chairperson: '0x123...',
  proposals: [
    { name: 'Proposal A', voteCount: 5 },
    { name: 'Proposal B', voteCount: 3 },
  ],
  voterCount: 10,
  status: 'active',
  endTime: Date.now() + 86400000,
}

export default function BallotDetailPage({ params }: { params: { id: string } }) {
  const [delegateAddress, setDelegateAddress] = useState('')
  const ballot = MOCK_BALLOT

  const handleVote = async (proposalIndex: number) => {
    // Mock vote transaction
    console.log('Voting for proposal', proposalIndex)
  }

  const handleDelegate = async () => {
    // Mock delegate transaction
    console.log('Delegating to', delegateAddress)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left Column */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Ballot Info</h2>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="text-gray-500">Creator:</span>
              <br />
              {ballot.chairperson}
            </p>
            <p className="text-sm">
              <span className="text-gray-500">Total Voters:</span>
              <br />
              {ballot.voterCount}
            </p>
            <p className="text-sm">
              <span className="text-gray-500">Status:</span>
              <br />
              <span className="capitalize">{ballot.status}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Middle Column */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Proposals</h2>
          <div className="space-y-4">
            {ballot.proposals.map((proposal, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>{proposal.name}</span>
                  <button
                    onClick={() => handleVote(index)}
                    className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Vote
                  </button>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600"
                    style={{
                      width: `${(proposal.voteCount / ballot.voterCount) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  {proposal.voteCount} votes
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Delegate Vote</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={delegateAddress}
              onChange={(e) => setDelegateAddress(e.target.value)}
              placeholder="Enter address"
              className="flex-1 px-4 py-2 border rounded"
            />
            <button
              onClick={handleDelegate}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Delegate
            </button>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Your Status</h2>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="text-gray-500">Voting Weight:</span>
              <br />1
            </p>
            <p className="text-sm">
              <span className="text-gray-500">Voted:</span>
              <br />No
            </p>
            <p className="text-sm">
              <span className="text-gray-500">Delegated To:</span>
              <br />None
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 