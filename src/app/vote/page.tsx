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
  const [voterAddresses, setVoterAddresses] = useState<string[]>([])
  const [isChairperson, setIsChairperson] = useState(false)

  useEffect(() => {
    loadBallotData()
  }, [signer])

  async function loadBallotData() {
    try {
      setLoading(true)
      const [chairperson, proposals] = await Promise.all([
        ballotService.getChairperson(),
        ballotService.getProposals()
      ])

      setBallot({
        id: '1',
        chairperson,
        proposals,
        voterCount: 0,
        status: 'active',
        endTime: Date.now() + 7 * 24 * 60 * 60 * 1000
      })

      if (signer) {
        const address = await signer.getAddress()
        const voter = await ballotService.getVoterInfo(address)
        console.log('Voter info:', voter)
        setVoterInfo(voter)
        setIsChairperson(address.toLowerCase() === chairperson.toLowerCase())
      } else {
        setVoterInfo(null)
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
      if (!voterInfo?.weight || voterInfo.weight <= 0) {
        setError('You do not have voting rights')
        return
      }
      
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

  const handleGiveVotingRights = async () => {
    if (!signer || !isChairperson || !voterAddresses.length) return

    try {
      await ballotService.giveRightToVote(voterAddresses, signer)
      setVoterAddresses([]) // Clear input after successful operation
      await loadBallotData() // Refresh data
    } catch (err) {
      console.error('Failed to give voting rights:', err)
      setError('Failed to give voting rights')
    }
  }

  const voterInfoDisplay = (
    <div className="space-y-2">
      <p className="text-sm">
        <span className="text-gray-500">Voting Weight:</span>
        <br />
        {voterInfo && typeof voterInfo.weight !== 'undefined' 
          ? voterInfo.weight.toString() 
          : '0'}
      </p>
      <p className="text-sm">
        <span className="text-gray-500">Voted:</span>
        <br />
        {voterInfo && typeof voterInfo.voted !== 'undefined' 
          ? (voterInfo.voted ? 'Yes' : 'No')
          : 'No'}
      </p>
      <p className="text-sm">
        <span className="text-gray-500">Delegated To:</span>
        <br />
        {voterInfo?.delegate && 
         voterInfo.delegate !== '0x0000000000000000000000000000000000000000'
          ? voterInfo.delegate
          : 'None'}
      </p>
    </div>
  )

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

        {isChairperson && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Give Voting Rights</h2>
            <div className="space-y-4">
              <textarea
                value={voterAddresses.join('\n')}
                onChange={(e) => setVoterAddresses(e.target.value.split('\n').filter(addr => addr.trim()))}
                placeholder="Enter voter addresses (one per line)"
                className="w-full px-4 py-2 border rounded min-h-[100px]"
              />
              <button
                onClick={handleGiveVotingRights}
                disabled={!voterAddresses.length}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Give Voting Rights
              </button>
            </div>
          </div>
        )}
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
                    disabled={!isConnected || 
                             voterInfo?.voted || 
                             !voterInfo?.weight || 
                             voterInfo.weight <= 0}
                    className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    title={!voterInfo?.weight || voterInfo.weight <= 0 ? 
                          'You do not have voting rights' : 
                          voterInfo?.voted ? 
                          'You have already voted' : 
                          'Click to vote'}
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
              disabled={!isConnected || 
                       voterInfo?.voted || 
                       !voterInfo?.weight || 
                       voterInfo.weight <= 0}
            />
            <button
              onClick={handleDelegate}
              disabled={!isConnected || 
                       !delegateAddress || 
                       voterInfo?.voted || 
                       !voterInfo?.weight || 
                       voterInfo.weight <= 0}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              title={!voterInfo?.weight || voterInfo.weight <= 0 ? 
                    'You do not have voting rights' : 
                    voterInfo?.voted ? 
                    'You have already voted' : 
                    'Click to delegate'}
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
          {!isConnected || !signer ? (
            <button
              onClick={connectWallet}
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Connect Wallet
            </button>
          ) : (
            voterInfoDisplay
          )}
        </div>
      </div>
    </div>
  )
} 