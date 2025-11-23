"use client"

import { useState } from "react"
import { Sword, Trophy, User } from "lucide-react"
import LeaderboardPage from "@/components/leaderboard-page"
import InventoryPage from "@/components/inventory-page"
import ChallengesPage from "@/components/challenges-page"
import ProfilePage from "@/components/profile-page"

export default function Page() {
  const [activePage, setActivePage] = useState("leaderboard")

  const renderPage = () => {
    switch (activePage) {
      case "leaderboard":
        return <LeaderboardPage />
      case "inventory":
        return <InventoryPage />
      case "challenges":
        return <ChallengesPage />
      case "profile":
        return <ProfilePage />
      default:
        return <LeaderboardPage />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* Mobile App Container */}
      <div className="flex-1 max-w-md mx-auto w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 shadow-lg overflow-hidden flex flex-col">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto pb-20">{renderPage()}</div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 max-w-md w-full shadow-2xl">
          <div className="flex justify-around items-center py-3 px-2 bg-slate-900">
            <NavButton
              icon={<Trophy size={24} />}
              label="Leaderboard"
              isActive={activePage === "leaderboard"}
              onClick={() => setActivePage("leaderboard")}
            />
            <NavButton
              icon={<Sword size={24} />}
              label="My Memories"
              isActive={activePage === "inventory"}
              onClick={() => setActivePage("inventory")}
            />
            <NavButton
              icon={<Trophy size={24} />}
              label="Challenges"
              isActive={activePage === "challenges"}
              onClick={() => setActivePage("challenges")}
            />
            <NavButton
              icon={<User size={24} />}
              label="Profile"
              isActive={activePage === "profile"}
              onClick={() => setActivePage("profile")}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function NavButton({ icon, label, isActive, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all ${
        isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
  )
}
