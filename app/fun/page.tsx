'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { BottomNavigation } from '@/components/bottom-navigation'
import { AuthModal } from '@/components/auth-modal'
import { useAppStore } from '@/lib/store'
import { X } from 'lucide-react'

const games = [
  { id: 'spin', name: 'Spin Wheel', emoji: '🎰', desc: 'Spin to win coins & prizes', players: '3.4K' },
  { id: 'quiz', name: 'UAE Quiz', emoji: '🧠', desc: 'Test your UAE knowledge', players: '2.1K' },
  { id: 'memory', name: 'Memory Match', emoji: '🎴', desc: 'Match the pairs', players: '1.2K' },
  { id: 'puzzle', name: 'Number Puzzle', emoji: '🧩', desc: 'Slide to solve', players: '890' },
  { id: 'word', name: 'Word Guess', emoji: '📝', desc: 'Guess Dubai words', players: '1.5K' }
]

const rewards = [
  { coins: 5, label: 'Daily Check-in', claimed: false },
  { coins: 10, label: 'First Ad Post', claimed: true },
  { coins: 20, label: 'Verify Phone', claimed: true },
  { coins: 50, label: 'Refer a Friend', claimed: false }
]

export default function FunPage() {
  const { coins, dailyCheckedIn, claimDaily } = useAppStore()
  const [activeGame, setActiveGame] = useState<string | null>(null)
  const [spinResult, setSpinResult] = useState<number | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)

  const handleSpin = () => {
    if (isSpinning) return
    setIsSpinning(true)
    setSpinResult(null)
    setTimeout(() => {
      const prizes = [5, 10, 15, 20, 25, 50]
      const result = prizes[Math.floor(Math.random() * prizes.length)]
      setSpinResult(result)
      setIsSpinning(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header showSearch={false} />

      <main className="px-4 py-4">
        {/* Coins Balance */}
        <div className="bg-gradient-to-r from-amber-400 to-amber-500 rounded-2xl p-5 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-900 text-sm font-medium">Your Balance</p>
              <p className="text-3xl font-bold text-white flex items-center gap-2">
                <span>🪙</span> {coins} Coins
              </p>
            </div>
            <button className="px-4 py-2 bg-white rounded-lg text-amber-600 font-semibold text-sm">
              + Buy Coins
            </button>
          </div>
        </div>

        {/* Daily Check-in */}
        <div className="bg-white rounded-xl p-4 mb-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📅</span>
              <div>
                <p className="font-semibold text-gray-900">Daily Check-in</p>
                <p className="text-sm text-gray-500">+5 coins every day</p>
              </div>
            </div>
            <button
              onClick={() => !dailyCheckedIn && claimDaily()}
              disabled={dailyCheckedIn}
              className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                dailyCheckedIn
                  ? 'bg-gray-100 text-gray-400'
                  : 'bg-purple-600 text-white'
              }`}
            >
              {dailyCheckedIn ? 'Claimed ✓' : 'Claim'}
            </button>
          </div>
        </div>

        {/* Games Section */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span>🎮</span> Play & Earn
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {games.map((game) => (
              <button
                key={game.id}
                onClick={() => setActiveGame(game.id)}
                className="bg-white rounded-xl p-4 text-left border border-gray-100 hover:border-purple-200 transition-colors"
              >
                <span className="text-4xl block mb-2">{game.emoji}</span>
                <p className="font-semibold text-gray-900">{game.name}</p>
                <p className="text-xs text-gray-500 mb-2">{game.desc}</p>
                <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded font-medium">
                  {game.players} playing
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Rewards Section */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span>🎁</span> Earn More Coins
          </h3>
          <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
            {rewards.map((reward, i) => (
              <div key={i} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🪙</span>
                  <div>
                    <p className="font-medium text-gray-900">+{reward.coins} coins</p>
                    <p className="text-sm text-gray-500">{reward.label}</p>
                  </div>
                </div>
                {reward.claimed ? (
                  <span className="text-green-600 text-sm font-medium">Done ✓</span>
                ) : (
                  <button className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm font-medium">
                    Go
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard Preview */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-white flex items-center gap-2">
              <span>🏆</span> Weekly Leaderboard
            </h3>
            <button className="text-amber-400 text-sm font-medium">View All &rsaquo;</button>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {['🥇', '🥈', '🥉'].map((medal, i) => (
                <div key={i} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center border-2 border-purple-500">
                  <span className="text-lg">{medal}</span>
                </div>
              ))}
            </div>
            <div className="flex-1">
              <p className="text-white text-sm">Top players win 500 coins!</p>
              <p className="text-purple-200 text-xs">5 days remaining</p>
            </div>
          </div>
        </div>
      </main>

      {/* Game Modal - Spin Wheel */}
      {activeGame === 'spin' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">🎰 Spin Wheel</h2>
              <button onClick={() => { setActiveGame(null); setSpinResult(null) }}>
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            
            <div className="text-center py-8">
              <div className={`w-48 h-48 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-amber-400 flex items-center justify-center mb-6 ${isSpinning ? 'animate-spin' : ''}`}>
                <div className="w-40 h-40 rounded-full bg-white flex items-center justify-center">
                  <span className="text-5xl">{isSpinning ? '🎰' : spinResult ? '🎉' : '🪙'}</span>
                </div>
              </div>
              
              {spinResult && (
                <div className="mb-4">
                  <p className="text-2xl font-bold text-purple-600">You won {spinResult} coins!</p>
                </div>
              )}
              
              <button
                onClick={handleSpin}
                disabled={isSpinning}
                className="w-full py-4 bg-purple-600 text-white font-bold rounded-xl disabled:opacity-50"
              >
                {isSpinning ? 'Spinning...' : spinResult ? 'Spin Again (5 coins)' : 'Spin Now (Free)'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simple Quiz Game Modal */}
      {activeGame === 'quiz' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">🧠 UAE Quiz</h2>
              <button onClick={() => setActiveGame(null)}>
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            
            <div className="py-4">
              <p className="text-gray-600 mb-4">What is the capital of UAE?</p>
              <div className="space-y-3">
                {['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman'].map((opt, i) => (
                  <button
                    key={i}
                    className="w-full p-4 border border-gray-200 rounded-xl text-left hover:border-purple-400 hover:bg-purple-50"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNavigation />
      <AuthModal />
    </div>
  )
}
