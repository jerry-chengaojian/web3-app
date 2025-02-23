import { BallotCard } from "@/components/vote/ballot-card"

// Mock data based on Ballot.sol structure
const MOCK_BALLOTS = [
  {
    id: "1",
    chairperson: "0x123...",
    proposals: [
      { name: "Proposal A", voteCount: 5 },
      { name: "Proposal B", voteCount: 3 },
    ],
    voterCount: 10,
    status: "active",
    endTime: Date.now() + 86400000, // 24 hours from now
  },
  // ... more mock ballots
]

export default function VotePage() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {MOCK_BALLOTS.map((ballot) => (
        <BallotCard key={ballot.id} ballot={ballot} />
      ))}
    </div>
  )
} 