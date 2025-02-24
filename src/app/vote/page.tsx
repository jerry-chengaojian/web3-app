'use client'

import { useEffect, useState } from 'react'
import { BallotCard } from "@/components/vote/ballot-card"
import { ballotService, type Ballot } from '@/services/ballot-service'

export default function VotePage() {
  const [ballot, setBallot] = useState<Ballot | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadBallot() {
      try {
        const chairperson = await ballotService.getChairperson()
        const proposals = await ballotService.getProposals()
        
        setBallot({
          id: '1', // Using single ballot for now
          chairperson,
          proposals,
          voterCount: 0 // This would need a separate counter in the contract
        })
      } catch (err) {
        setError('Failed to load ballot')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadBallot()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!ballot) return <div>No ballot found</div>

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <BallotCard ballot={ballot} />
    </div>
  )
} 