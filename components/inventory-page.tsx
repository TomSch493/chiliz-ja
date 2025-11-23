"use client"

import { useState } from "react"
import Image from "next/image"

export default function InventoryPage() {
  const [selectedTab, setSelectedTab] = useState("all")

  const cards = [
    {
      id: 1,
      name: "ETH New Delhi",
      image: "/images/eth-new-delhi.png",
    },
    {
      id: 2,
      name: "ETH Global New York",
      image: "/images/eth-global-new-york.png",
    },
    {
      id: 3,
      name: "ETH Buenos Aires",
      image: "/images/eth-buenos-aires.png",
    },
  ]

  const CardDisplay = ({ card }: { card: (typeof cards)[0] }) => (
    <div className="rounded-lg overflow-hidden shadow-2xl hover:shadow-3xl transition-all hover:scale-105 cursor-pointer">
      <Image
        src={card.image || "/placeholder.svg"}
        alt={card.name}
        width={300}
        height={420}
        className="w-full h-auto"
      />
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 pt-6 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          <span className="text-white">My </span>
          <span className="text-lime-400 font-black">Memories</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Here are your {cards.length} memories of the amazing events you attended. Show them with pride as it's part of
          your crypto bro journey 🔥
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 space-y-0">
        {cards.map((card) => (
          <CardDisplay key={card.id} card={card} />
        ))}
      </div>
    </div>
  )
}
