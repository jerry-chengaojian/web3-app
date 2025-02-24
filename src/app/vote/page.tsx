'use client'

import { useState, useEffect } from 'react'
import { useWalletStore } from '@/stores/wallet-store'
import { ballotService, type Ballot } from '@/services/ballot-service'

export default function VotePage() {
  const { signer, isConnected, connectWallet } = useWalletStore()
  const [delegateAddress, setDelegateAddress] = useState('')
  const [ballot, setBallot] = useState<Ballot | null>(null)
  const [voterInfo, setVoterInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadBallotData()
  }, [])

  async function loadBallotData() {
    try {
      const [chairperson, proposals] = await Promise.all([
        ballotService.getChairperson(),
        ballotService.getProposals()
      ])

      setBallot({
        id: '1', // Using single ballot for now
        chairperson,
        proposals,
        voterCount: 0,
        status: 'active',
        endTime: Date.now() + 7 * 24 * 60 * 60 * 1000
      })

      if (signer) {
        const address = await signer.getAddress()
        const voter = await ballotService.getVoterInfo(address)
        setVoterInfo(voter)
      }
    } catch (err) {
      setError('Failed to load ballot data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (proposalIndex: number) => {
    if (!signer) {
      await connectWallet()
      return
    }

    try {
      await ballotService.vote(proposalIndex, signer)
      await loadBallotData() // Refresh data
    } catch (err) {
      console.error('Failed to vote:', err)
      setError('Failed to vote')
    }
  }

  const handleDelegate = async () => {
    if (!signer || !delegateAddress) return

    try {
      await ballotService.delegate(delegateAddress, signer)
      await loadBallotData() // Refresh data
      setDelegateAddress('')
    } catch (err) {
      console.error('Failed to delegate:', err)
      setError('Failed to delegate')
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!ballot) return <div>No ballot found</div>

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
          </div>
        </div>
      </div>

      {/* Middle Column */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Proposals</h2>
          <div className="space-y-4">
            {ballot.proposals.map((proposal: any, index: number) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>{proposal.name}</span>
                  <button
                    onClick={() => handleVote(index)}
                    disabled={!isConnected || voterInfo?.voted}
                    className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    Vote
                  </button>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600"
                    style={{
                      width: `${(proposal.voteCount / (ballot.voterCount || 1)) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  {proposal.voteCount.toString()} votes
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
              disabled={!isConnected || voterInfo?.voted}
            />
            <button
              onClick={handleDelegate}
              disabled={!isConnected || !delegateAddress || voterInfo?.voted}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
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
          {!isConnected ? (
            <button
              onClick={connectWallet}
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Connect Wallet
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-sm">
                <span className="text-gray-500">Voting Weight:</span>
                <br />
                {voterInfo?.weight.toString() || '0'}
              </p>
              <p className="text-sm">
                <span className="text-gray-500">Voted:</span>
                <br />
                {voterInfo?.voted ? 'Yes' : 'No'}
              </p>
              <p className="text-sm">
                <span className="text-gray-500">Delegated To:</span>
                <br />
                {voterInfo?.delegate !== '0x0000000000000000000000000000000000000000'
                  ? voterInfo?.delegate
                  : 'None'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 