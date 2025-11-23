"use client"
import { Card } from "@/components/ui/card"

export default function ShopPage() {
  const items = [
    {
      id: 1,
      name: "Token Pack",
      description: "500 XP",
      price: 100,
      icon: "⭐",
      color: "from-blue-400 to-blue-600",
    },
    {
      id: 2,
      name: "Epic Booster",
      description: "Guaranteed Epic Card",
      price: 250,
      icon: "🎁",
      color: "from-purple-400 to-purple-600",
    },
    {
      id: 3,
      name: "Legendary Chest",
      description: "Guaranteed Legendary Card",
      price: 500,
      icon: "👑",
      color: "from-yellow-400 to-orange-600",
    },
    {
      id: 4,
      name: "Mega Bundle",
      description: "1000 XP + 3 Boosters",
      price: 800,
      icon: "🚀",
      color: "from-green-400 to-emerald-600",
    },
    {
      id: 5,
      name: "Limited Edition",
      description: "5 Exclusive Cards",
      price: 600,
      icon: "💎",
      color: "from-pink-400 to-rose-600",
    },
    {
      id: 6,
      name: "Battle Pass",
      description: "Unlock Premium Rewards",
      price: 400,
      icon: "🎯",
      color: "from-indigo-400 to-indigo-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 pt-6 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          <span className="text-white">Boost Your </span>
          <span className="text-lime-400 font-black">Game</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">Purchase boosters and exclusive items</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <Card
            key={item.id}
            className={`bg-gradient-to-br ${item.color} p-4 cursor-pointer hover:shadow-xl transition-all hover:scale-105 border border-slate-700/30`}
          >
            <div className="flex flex-col h-full justify-between">
              <div>
                <p className="text-3xl mb-2">{item.icon}</p>
                <p className="font-bold text-white text-sm">{item.name}</p>
                <p className="text-white/80 text-xs mt-1">{item.description}</p>
              </div>
              <div className="mt-3">
                <p className="font-bold text-white text-sm">{item.price} XP</p>
                <button className="w-full mt-2 bg-white text-slate-900 hover:bg-white/90 font-bold py-2 rounded-lg transition text-xs">
                  Buy
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
