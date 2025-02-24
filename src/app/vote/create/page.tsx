'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWalletStore } from '@/stores/wallet-store'
import { ballotService } from '@/services/ballot-service'

interface Proposal {
  name: string
}

interface Voter {
  address: string
}

export default function CreateBallotPage() {
  const router = useRouter()
  const { signer, isConnected, connectWallet } = useWalletStore()
  const [step, setStep] = useState(1)
  const [proposals, setProposals] = useState<Proposal[]>([{ name: '' }])
  const [voters, setVoters] = useState<Voter[]>([{ address: '' }])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const addProposal = () => {
    setProposals([...proposals, { name: '' }])
  }

  const updateProposal = (index: number, name: string) => {
    const newProposals = [...proposals]
    newProposals[index].name = name
    setProposals(newProposals)
  }

  const addVoter = () => {
    setVoters([...voters, { address: '' }])
  }

  const updateVoter = (index: number, address: string) => {
    const newVoters = [...voters]
    newVoters[index].address = address
    setVoters(newVoters)
  }

  const handleSubmit = async () => {
    if (!isConnected) {
      await connectWallet()
      return
    }

    try {
      setLoading(true)
      setError('')

      // Deploy new ballot contract
      const proposalNames = proposals.map(p => p.name)
      const ballotAddress = await ballotService.createBallot(proposalNames)

      // Give right to vote to all voters
      const voterAddresses = voters.map(v => v.address)
      await ballotService.giveRightToVote(voterAddresses)

      router.push('/vote')
    } catch (err) {
      console.error('Failed to create ballot:', err)
      setError('Failed to create ballot')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step indicator */}
      <div className="flex justify-between mb-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-1/3 text-center ${
              step === i ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
                step === i ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              {i}
            </div>
            <span>
              {i === 1 ? 'Proposals' : i === 2 ? 'Voters' : 'Confirm'}
            </span>
          </div>
        ))}
      </div>

      {/* Step 1: Proposals */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Add Proposals</h2>
          {proposals.map((proposal, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={proposal.name}
                onChange={(e) => updateProposal(index, e.target.value)}
                placeholder="Proposal name"
                className="flex-1 px-4 py-2 border rounded-lg"
              />
            </div>
          ))}
          <button
            onClick={addProposal}
            className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400"
          >
            Add Proposal
          </button>
          <button
            onClick={() => setStep(2)}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Next
          </button>
        </div>
      )}

      {/* Step 2: Voters */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Add Voters</h2>
          {voters.map((voter, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={voter.address}
                onChange={(e) => updateVoter(index, e.target.value)}
                placeholder="Voter address"
                className="flex-1 px-4 py-2 border rounded-lg"
              />
            </div>
          ))}
          <button
            onClick={addVoter}
            className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400"
          >
            Add Voter
          </button>
          <div className="flex gap-4">
            <button
              onClick={() => setStep(1)}
              className="w-full py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirm */}
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Confirm Ballot</h2>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Proposals ({proposals.length})</h3>
            <ul className="list-disc list-inside">
              {proposals.map((p, i) => (
                <li key={i}>{p.name}</li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Voters ({voters.length})</h3>
            <ul className="list-disc list-inside">
              {voters.map((v, i) => (
                <li key={i}>{v.address}</li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Estimated Gas</h3>
            <p>0.005 ETH</p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setStep(2)}
              className="w-full py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Deploying...' : 'Deploy Ballot'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 