"use client"

import { useState, useEffect } from "react"
import { Volume2, HelpCircle, Home, Zap, Gift, SquareChevronLeft as SquareChartGantt, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const [timeRemaining, setTimeRemaining] = useState(17 * 60 * 60 + 13 * 60 + 58) // 17:13:58
  const [boosterState, setBoosterState] = useState("locked") // locked or available
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col">
      {/* Top Bar */}
      <div className="flex justify-between items-center px-6 py-4">
        <div></div>
        <div className="flex items-center gap-2 bg-slate-700/50 px-4 py-2 rounded-full">
          <Volume2 size={18} className="text-white" />
          <span className="text-white font-semibold">0</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 pt-8 pb-24 flex flex-col">
        <h1 className="text-5xl font-bold mb-2 text-background">
          READY TO
          <br />
          <span className="text-lime-400">PLAY ?</span>
        </h1>

        <div className="mt-8 space-y-4 flex-1">
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-purple-500/50 p-6 hover:border-purple-400/70 transition">
            <h2 className="text-white font-bold text-lg mb-4">PREMIUM</h2>

            {/* Card Preview Box */}
            <div className="flex justify-center mb-6">
              <div className="w-28 h-36 bg-slate-700/50 rounded-lg flex items-center justify-center border border-slate-600">
                <HelpCircle size={48} className="text-slate-500" />
              </div>
            </div>

            {/* Booster Description */}
            <div className="mb-4">
              <h3 className="text-white font-bold">CHOISIR UN BOOSTER</h3>
              <p className="text-slate-300 text-sm">Récupérer des Cosmos</p>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-slate-900 px-8 py-2 font-bold rounded-full"
              >
                OBTENIR
              </Button>
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-600/50 p-6 hover:border-slate-500/70 transition">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center justify-between w-full">
                <div className="relative w-12 h-12">
                  {/* Cube visualization using layers */}
                  <div className="absolute inset-0 bg-gradient-to-br from-lime-400 to-lime-500 rounded opacity-90"></div>
                  <div className="absolute inset-1 bg-gradient-to-tr from-lime-300 to-lime-400 rounded"></div>
                </div>

                <div>
                  <h3 className="text-white font-bold">BOOSTER GRATUIT</h3>
                  <div className="flex items-center gap-1 text-slate-300 text-sm">
                    <span>Disponible dans</span>
                    <span className="font-mono font-bold text-lime-400">{formatTime(timeRemaining)}</span>
                  </div>
                </div>
              </div>

              <Button
                disabled
                className="bg-transparent border-2 border-slate-600 text-slate-400 cursor-not-allowed px-6 py-2 font-bold rounded-full"
              >
                VERROUILLÉ
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-slate-950 border-2 border-purple-500/50 rounded-2xl p-8 w-full max-w-sm relative">
            {/* Close button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-lime-400 transition"
            >
              <X size={28} />
            </button>

            {/* Modal content */}
            <div className="flex flex-col items-center gap-6 pt-4">
              <div className="text-center">
                <p className="text-slate-400 text-sm font-bold tracking-wider">CHOISIS</p>
                <h2 className="text-white text-3xl font-bold">TON BOOSTER</h2>
              </div>

              {/* Card Preview Box */}
              <div className="w-32 h-40 bg-slate-800/50 rounded-lg flex items-center justify-center border border-slate-600">
                <HelpCircle size={56} className="text-slate-500" />
              </div>

              {/* Booster Details */}
              <div className="text-center w-full">
                <h3 className="text-white text-xl font-bold mb-4">BOOSTER</h3>
                <div className="flex items-center justify-center gap-8 mb-6">
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative w-8 h-8">
                      <div className="absolute inset-0 bg-gradient-to-br from-lime-400 to-lime-500 rounded opacity-90"></div>
                    </div>
                    <div className="text-center">
                      <p className="text-white font-bold text-sm">1 CARTES</p>
                    </div>
                  </div>
                  <div className="w-px h-12 bg-slate-600"></div>
                  <div className="text-center">
                    <p className="text-cyan-400 font-bold text-2xl">0</p>
                    <p className="text-white font-bold text-sm">10 XP</p>
                  </div>
                </div>
              </div>

              {/* Purchase button */}
              <Button
                onClick={() => setIsModalOpen(false)}
                className="bg-slate-900 border-2 border-slate-700 text-white hover:border-lime-400 hover:text-lime-400 px-8 py-3 font-bold rounded-full flex items-center gap-2 transition w-full justify-center"
              >
                1€ ACHETER
                <span className="text-xl">›</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 border-t border-slate-700/50 px-6 py-4 flex justify-around items-center">
        <button className="text-slate-400 hover:text-lime-400 transition">
          <Home size={24} />
        </button>
        <button className="text-slate-400 hover:text-lime-400 transition">
          <Zap size={24} />
        </button>
        <button className="text-slate-400 hover:text-lime-400 transition">
          <Gift size={24} />
        </button>
        <button className="text-slate-400 hover:text-lime-400 transition">
          <SquareChartGantt size={24} />
        </button>
      </div>
    </div>
  )
}
