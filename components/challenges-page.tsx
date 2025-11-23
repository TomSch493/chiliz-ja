"use client"
import { useState } from "react"
import { Card } from "@/components/ui/card"

export default function ChallengesPage() {
  const initialChallenges = [
    {
      id: 3,
      name: "ETH Global GOAT",
      description: "Attend 3 ETH Global events as a Hacker",
      progress: 1,
      total: 1,
      reward: 200,
      active: false,
    },
    {
      id: 1,
      name: "We have a Winner",
      description: "Win a prize at a ETH Global Hackathon with an amazing project",
      progress: 0,
      total: 1,
      reward: 300,
      active: true,
    },
    {
      id: 2,
      name: "ETH Global Expert",
      description: "Attend 5 ETH Global events as a Hacker",
      progress: 4,
      total: 5,
      reward: 300,
      active: true,
    },
    {
      id: 4,
      name: "Serial Winner",
      description: "Win 5 prize at a ETH Global Hackathon with different projects",
      progress: 0,
      total: 1,
      reward: 500,
      active: true,
    },
  ]

  const [xp, setXp] = useState(300)
  const [challenges, setChallenges] = useState(initialChallenges)
  const [claimedChallenges, setClaimedChallenges] = useState<number[]>([])

  const handleClaimReward = (challengeId: number) => {
    const challenge = challenges.find((c) => c.id === challengeId)
    if (challenge) {
      setXp(xp + challenge.reward)
      setClaimedChallenges([...claimedChallenges, challengeId])

      // Move the claimed challenge to the end
      const updatedChallenges = challenges.filter((c) => c.id !== challengeId)
      setChallenges([...updatedChallenges, challenge])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 pt-6 pb-20">
      <div className="mb-8 text-center">
        <p className="text-slate-400 text-lg font-bold mb-2">XP Balance</p>
        <p className="text-5xl font-black text-lime-400">{xp}</p>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          <span className="text-white">Complete </span>
          <span className="text-lime-400 font-black">Challenges</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">Earn XP by completing challenges</p>
      </div>

      <div className="space-y-3">
        {challenges.map((challenge) => (
          <Card
            key={challenge.id}
            className={`p-4 transition-all cursor-pointer border ${
              challenge.active
                ? "border-purple-500/50 bg-slate-800/50 hover:border-purple-400/70"
                : "border-slate-700/30 bg-slate-800/30"
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <p className="font-bold text-white">{challenge.name}</p>
                <p className="text-sm text-slate-400">{challenge.description}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lime-400 text-lg">+{challenge.reward}</p>
                <p className="text-xs text-slate-400">xp</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Progress</span>
                <span className="font-semibold text-white">
                  {challenge.progress}/{challenge.total}
                </span>
              </div>
              <div className="w-full bg-slate-700/30 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-lime-400 to-lime-300 h-2 rounded-full transition-all"
                  style={{
                    width: `${(challenge.progress / challenge.total) * 100}%`,
                  }}
                />
              </div>
            </div>

            {challenge.progress === challenge.total && !claimedChallenges.includes(challenge.id) && (
              <button
                onClick={() => handleClaimReward(challenge.id)}
                className="w-full mt-3 bg-lime-400 text-slate-900 hover:bg-lime-300 font-bold py-2 rounded-lg transition"
              >
                Claim Reward
              </button>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
