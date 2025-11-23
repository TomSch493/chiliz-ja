"use client"

import { Card } from "@/components/ui/card"

export default function LeaderboardPage() {
  const topPlayers = [
    { rank: 2, name: "Shadow", xp: 8500 },
    { rank: 1, name: "CryptoKing", xp: 9200 },
    { rank: 3, name: "NovaHacker", xp: 7800 },
  ]

  const players = [
    { rank: 4, name: "EthWizard", xp: 7200 },
    { rank: 5, name: "BlockchainPro", xp: 6900 },
    { rank: 6, name: "DeFiMaster", xp: 6500 },
    { rank: 7, name: "SmartDev", xp: 6100 },
    { rank: 8, name: "Web3Ninja", xp: 5800 },
    { rank: 9, name: "TokenTrader", xp: 5400 },
    { rank: 10, name: "HackAttack", xp: 5000 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col">
      {/* Header */}
      <div className="px-6 py-6">
        <h1 className="text-4xl font-bold text-white mb-1">LEADERBOARD</h1>
        <p className="text-slate-400 text-sm">Top Players</p>
      </div>

      {/* Podium */}
      <div className="px-6 pb-8">
        <div className="flex items-flex-end justify-center gap-6 mb-8">
          {/* Second Place */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-20 bg-gradient-to-b from-slate-400 to-slate-500 rounded-lg flex flex-col items-center justify-center border-2 border-slate-300 shadow-lg">
              <span className="text-3xl font-bold text-white">2</span>
              <span className="text-xs font-bold text-slate-700">nd</span>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-sm">{topPlayers[0].name}</p>
              <p className="text-lime-400 font-bold text-xs">{topPlayers[0].xp.toLocaleString()} XP</p>
            </div>
          </div>

          {/* First Place */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-24 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-lg flex flex-col items-center justify-center border-2 border-yellow-300 shadow-xl">
              <span className="text-4xl font-bold text-white">1</span>
              <span className="text-xs font-bold text-yellow-700">st</span>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-sm">{topPlayers[1].name}</p>
              <p className="text-lime-400 font-bold text-xs">{topPlayers[1].xp.toLocaleString()} XP</p>
            </div>
          </div>

          {/* Third Place */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-20 bg-gradient-to-b from-orange-400 to-orange-600 rounded-lg flex flex-col items-center justify-center border-2 border-orange-300 shadow-lg">
              <span className="text-3xl font-bold text-white">3</span>
              <span className="text-xs font-bold text-orange-700">rd</span>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-sm">{topPlayers[2].name}</p>
              <p className="text-lime-400 font-bold text-xs">{topPlayers[2].xp.toLocaleString()} XP</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rankings List */}
      <div className="flex-1 px-6 pb-24 space-y-2">
        <p className="text-slate-500 text-xs font-bold mb-4">TOP 10</p>
        {players.map((player) => (
          <Card
            key={player.rank}
            className="bg-gradient-to-r from-slate-800 to-slate-900 border-slate-700/50 p-4 flex justify-between items-center hover:border-lime-400/30 transition"
          >
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">{player.rank}</span>
              </div>
              <span className="text-white font-semibold">{player.name}</span>
            </div>
            <span className="text-lime-400 font-bold">{player.xp.toLocaleString()} XP</span>
          </Card>
        ))}
      </div>
    </div>
  )
}
