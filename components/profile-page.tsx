"use client"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ProfilePage() {
  const userStats = {
    username: "Player_Elite",
    level: 45,
    totalXP: 15250,
    rank: "Gold II",
    wins: 342,
    losses: 128,
  }

  const achievements = [
    { id: 1, name: "First Victory", icon: "🏆", date: "2024-01-15" },
    { id: 2, name: "Legendary Collector", icon: "💎", date: "2024-02-20" },
    { id: 3, name: "Win Streak 10+", icon: "🔥", date: "2024-03-10" },
    { id: 4, name: "Challenger", icon: "⚡", date: "2024-04-05" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 pt-6 pb-20">
      {/* Profile Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-blue-600 flex items-center justify-center text-3xl">
            👤
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">{userStats.username}</h1>
            <p className="text-sm text-slate-400">Level {userStats.level}</p>
          </div>
        </div>

        {/* Rank Badge */}
        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold mb-4">
          {userStats.rank}
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card className="bg-slate-800/50 border-slate-700 p-4">
          <p className="text-sm text-slate-400 mb-1">Total XP</p>
          <p className="text-2xl font-bold text-lime-400">{userStats.totalXP.toLocaleString()}</p>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700 p-4">
          <p className="text-sm text-slate-400 mb-1">Win Rate</p>
          <p className="text-2xl font-bold text-cyan-400">
            {((userStats.wins / (userStats.wins + userStats.losses)) * 100).toFixed(1)}%
          </p>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700 p-4">
          <p className="text-sm text-slate-400 mb-1">Total Wins</p>
          <p className="text-2xl font-bold text-emerald-400">{userStats.wins}</p>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700 p-4">
          <p className="text-sm text-slate-400 mb-1">Total Losses</p>
          <p className="text-2xl font-bold text-red-400">{userStats.losses}</p>
        </Card>
      </div>

      {/* Achievements Section */}
      <div>
        <h2 className="text-lg font-bold text-white mb-3">Achievements</h2>
        <div className="grid grid-cols-2 gap-3">
          {achievements.map((achievement) => (
            <Card
              key={achievement.id}
              className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 p-4 hover:border-slate-600 transition-all"
            >
              <p className="text-3xl mb-2">{achievement.icon}</p>
              <p className="font-semibold text-white text-sm">{achievement.name}</p>
              <p className="text-xs text-slate-500 mt-1">{achievement.date}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
