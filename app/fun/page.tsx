'use client'

import { useState, useRef, useEffect } from 'react'
import { Header } from '@/components/header'
import { TopTabs } from '@/components/top-tabs'
import { BottomNavigation } from '@/components/bottom-navigation'
import { AuthModal } from '@/components/auth-modal'
import { useAppStore } from '@/lib/store'
import { X } from 'lucide-react'

interface FarmPlot {
  id: number
  state: 'empty' | 'planted' | 'growing' | 'ready'
  progress: number
}

export default function FunPage() {
  const { coins, dailyCheckedIn, claimDaily, addCoins } = useAppStore()
  const [activeGame, setActiveGame] = useState<string | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [spinRotation, setSpinRotation] = useState(0)
  const [spinResult, setSpinResult] = useState<string | null>(null)
  
  // Farm game state
  const [farmPlots, setFarmPlots] = useState<FarmPlot[]>([
    { id: 1, state: 'ready', progress: 100 },
    { id: 2, state: 'empty', progress: 0 },
    { id: 3, state: 'ready', progress: 100 },
    { id: 4, state: 'growing', progress: 60 },
    { id: 5, state: 'empty', progress: 0 },
    { id: 6, state: 'ready', progress: 100 },
    { id: 7, state: 'growing', progress: 40 },
    { id: 8, state: 'empty', progress: 0 },
  ])
  const [waterTank, setWaterTank] = useState(70)

  const prizes = ['5 Coins', 'Spin Again!', 'AED 10 Voucher', 'Free Ad Boost 7d', '20 Coins', 'AED 50 Voucher']
  const prizeColors = ['#f59e0b', '#8b5cf6', '#f59e0b', '#8b5cf6', '#3b82f6', '#f59e0b']

  const handleSpin = () => {
    if (isSpinning) return
    setIsSpinning(true)
    setSpinResult(null)
    
    const randomIndex = Math.floor(Math.random() * prizes.length)
    const segmentAngle = 360 / prizes.length
    const targetAngle = 360 * 5 + (randomIndex * segmentAngle) + (segmentAngle / 2)
    
    setSpinRotation(prev => prev + targetAngle)
    
    setTimeout(() => {
      setSpinResult(prizes[randomIndex])
      setIsSpinning(false)
      if (prizes[randomIndex].includes('Coins')) {
        const coinAmount = parseInt(prizes[randomIndex])
        addCoins(coinAmount)
      }
    }, 3000)
  }

  const handlePlotClick = (plotId: number) => {
    setFarmPlots(plots => plots.map(plot => {
      if (plot.id === plotId) {
        if (plot.state === 'empty' && waterTank >= 10) {
          setWaterTank(w => w - 10)
          return { ...plot, state: 'planted' as const, progress: 0 }
        }
        if (plot.state === 'ready') {
          addCoins(5)
          return { ...plot, state: 'empty' as const, progress: 0 }
        }
      }
      return plot
    }))
  }

  // Simulate growth
  useEffect(() => {
    const interval = setInterval(() => {
      setFarmPlots(plots => plots.map(plot => {
        if (plot.state === 'planted' || plot.state === 'growing') {
          const newProgress = Math.min(plot.progress + 5, 100)
          return {
            ...plot,
            state: newProgress < 50 ? 'planted' : newProgress < 100 ? 'growing' : 'ready',
            progress: newProgress
          }
        }
        return plot
      }))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-[#f8f7fc] pb-20">
      <Header />
      <TopTabs onTabChange={(tab) => {
        if (tab === 'Fun') return
      }} />

      <main className="px-4 py-4">
        {/* Fun Zone Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>🎮</span> Fun Zone
          </h2>
          <span className="text-amber-500 font-semibold">Win AED Prizes!</span>
        </div>

        <p className="text-gray-600 text-sm mb-4">Play & win ad credits, AED vouchers, coins - daily prizes!</p>

        {/* Daily Check-in */}
        <div className="bg-gradient-to-r from-amber-400 to-amber-500 rounded-2xl p-5 mb-4">
          <div className="flex items-center gap-2 text-amber-900 text-sm font-medium mb-1">
            <span>⚡</span> DAILY CHECK-IN
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Claim your 5 coins today!</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={() => !dailyCheckedIn && claimDaily()}
              disabled={dailyCheckedIn}
              className={`px-5 py-2.5 rounded-lg font-semibold text-sm ${
                dailyCheckedIn
                  ? 'bg-white/50 text-amber-700'
                  : 'bg-white text-amber-600'
              }`}
            >
              {dailyCheckedIn ? 'Claimed' : 'Claim Now'}
            </button>
            <div className="flex items-center gap-1.5 bg-white/30 px-3 py-2 rounded-lg">
              <span>🪙</span>
              <span className="font-bold text-white">{coins} Coins</span>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Spin & Win */}
          <button
            onClick={() => setActiveGame('spin')}
            className="bg-white rounded-xl p-4 text-center border border-gray-100"
          >
            <span className="text-4xl block mb-2">🎡</span>
            <p className="font-bold text-gray-900">Spin & Win</p>
            <p className="text-xs text-gray-500 mb-2">Win AED vouchers & free ad boosts</p>
            <span className="inline-block px-3 py-1 bg-amber-400 text-amber-900 rounded-full text-xs font-semibold">
              Play Free
            </span>
          </button>

          {/* UAE Quiz */}
          <button
            onClick={() => setActiveGame('quiz')}
            className="bg-white rounded-xl p-4 text-center border border-gray-100"
          >
            <span className="text-4xl block mb-2">🧠</span>
            <p className="font-bold text-gray-900">UAE Quiz</p>
            <p className="text-xs text-gray-500 mb-2">5 questions, earn up to 50 coins</p>
            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
              +10 Coins each
            </span>
          </button>

          {/* Scratch Card */}
          <button
            onClick={() => setActiveGame('scratch')}
            className="bg-white rounded-xl p-4 text-center border border-gray-100"
          >
            <span className="text-4xl block mb-2">🎟️</span>
            <p className="font-bold text-gray-900">Scratch Card</p>
            <p className="text-xs text-gray-500 mb-2">Scratch & reveal daily prizes</p>
            <span className="inline-block px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-semibold">
              Daily Free
            </span>
          </button>

          {/* Flash Auction */}
          <button
            onClick={() => setActiveGame('auction')}
            className="bg-white rounded-xl p-4 text-center border border-gray-100"
          >
            <span className="text-4xl block mb-2">⚒️</span>
            <p className="font-bold text-gray-900">Flash Auction</p>
            <p className="text-xs text-gray-500 mb-2">Bid on listings at huge discounts!</p>
            <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold flex items-center gap-1">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span> Live Now
            </span>
          </button>

          {/* Farm Game */}
          <button
            onClick={() => setActiveGame('farm')}
            className="bg-white rounded-xl p-4 text-center border border-gray-100"
          >
            <span className="text-4xl block mb-2">🌾</span>
            <p className="font-bold text-gray-900">Farm Game</p>
            <p className="text-xs text-gray-500 mb-2">Grow your UAE farm, earn credits</p>
            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
              Play Now
            </span>
          </button>

          {/* Leaderboard */}
          <button
            onClick={() => setActiveGame('leaderboard')}
            className="bg-white rounded-xl p-4 text-center border border-gray-100"
          >
            <span className="text-4xl block mb-2">🏆</span>
            <p className="font-bold text-gray-900">Leaderboard</p>
            <p className="text-xs text-gray-500 mb-2">Top sellers win monthly cash</p>
            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
              Monthly
            </span>
          </button>
        </div>
      </main>

      {/* Spin Wheel Modal */}
      {activeGame === 'spin' && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50">
          <div className="w-full max-w-lg bg-white rounded-t-3xl max-h-[90vh] overflow-auto">
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>
            <div className="px-5 pb-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span>🎡</span> Spin & Win
              </h2>
              
              <div className="relative flex justify-center mb-6">
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
                  <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-gray-900"></div>
                </div>
                
                {/* Wheel */}
                <div 
                  className="w-64 h-64 rounded-full border-4 border-gray-200 relative overflow-hidden"
                  style={{ 
                    transform: `rotate(${spinRotation}deg)`,
                    transition: isSpinning ? 'transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none'
                  }}
                >
                  {prizes.map((prize, i) => {
                    const angle = (360 / prizes.length) * i
                    return (
                      <div
                        key={i}
                        className="absolute w-full h-full"
                        style={{
                          transform: `rotate(${angle}deg)`,
                          clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%)',
                          backgroundColor: prizeColors[i],
                        }}
                      >
                        <span 
                          className="absolute text-white text-xs font-bold whitespace-nowrap"
                          style={{
                            top: '20%',
                            left: '60%',
                            transform: 'rotate(30deg)',
                          }}
                        >
                          {prize}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {spinResult && (
                <div className="text-center mb-4 p-4 bg-green-50 rounded-xl">
                  <p className="text-lg font-bold text-green-700">You won: {spinResult}!</p>
                </div>
              )}
              
              <button
                onClick={handleSpin}
                disabled={isSpinning}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-xl disabled:opacity-50 text-lg"
              >
                {isSpinning ? 'Spinning...' : 'SPIN NOW!'}
              </button>
              
              <p className="text-center text-gray-500 text-sm mt-3">AED vouchers - Free boosts - Coins!</p>
              
              <button
                onClick={() => { setActiveGame(null); setSpinResult(null) }}
                className="w-full py-3 mt-4 text-gray-500 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Farm Game Modal */}
      {activeGame === 'farm' && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50">
          <div className="w-full max-w-lg bg-white rounded-t-3xl max-h-[90vh] overflow-auto">
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>
            <div className="px-5 pb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span>🌾</span> UAE Farm Game
                  <span className="text-sm font-normal text-gray-500">- Earn ad credits!</span>
                </h2>
              </div>
              
              <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                <span>Tap empty plots to plant - Tap crops to harvest</span>
                <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                  <span>🪙</span>
                  <span className="font-bold">{coins}</span>
                </div>
              </div>

              {/* Farm Grid */}
              <div className="grid grid-cols-4 gap-2 mb-6">
                {farmPlots.map((plot) => (
                  <button
                    key={plot.id}
                    onClick={() => handlePlotClick(plot.id)}
                    className={`aspect-square rounded-xl flex flex-col items-center justify-center relative ${
                      plot.state === 'empty' ? 'bg-amber-200' :
                      plot.state === 'planted' ? 'bg-green-300' :
                      plot.state === 'growing' ? 'bg-green-400' :
                      'bg-green-500'
                    }`}
                  >
                    {plot.state === 'empty' && (
                      <>
                        <span className="text-3xl">+</span>
                        <span className="text-xs text-amber-800">Plant</span>
                      </>
                    )}
                    {plot.state === 'planted' && (
                      <>
                        <span className="text-3xl">🌱</span>
                        <span className="text-xs text-green-800">Growing</span>
                      </>
                    )}
                    {plot.state === 'growing' && (
                      <>
                        <span className="text-3xl">🌿</span>
                        <span className="text-xs text-green-800">Growing</span>
                        <div className="absolute bottom-1 left-1 right-1 h-1 bg-green-700 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400" style={{ width: `${plot.progress}%` }}></div>
                        </div>
                      </>
                    )}
                    {plot.state === 'ready' && (
                      <>
                        <span className="text-3xl">🥬</span>
                        <span className="text-xs text-green-900 font-bold">Harvest!</span>
                      </>
                    )}
                  </button>
                ))}
              </div>

              {/* Water Tank */}
              <div className="flex items-center gap-4 bg-blue-50 p-4 rounded-xl">
                <span className="text-3xl">💧</span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Water Tank</p>
                  <div className="h-3 bg-blue-200 rounded-full overflow-hidden mt-1">
                    <div 
                      className="h-full bg-blue-500 transition-all"
                      style={{ width: `${waterTank}%` }}
                    ></div>
                  </div>
                </div>
                <button 
                  onClick={() => setWaterTank(100)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold text-sm"
                >
                  Refill
                </button>
              </div>
              
              <button
                onClick={() => setActiveGame(null)}
                className="w-full py-3 mt-4 text-gray-500 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Modal */}
      {activeGame === 'quiz' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span>🧠</span> UAE Quiz
              </h2>
              <button onClick={() => setActiveGame(null)}>
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Question 1 of 5</p>
              <p className="text-lg font-semibold text-gray-900">What is the capital of UAE?</p>
            </div>
            
            <div className="space-y-3">
              {['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman'].map((opt, i) => (
                <button
                  key={i}
                  className="w-full p-4 border border-gray-200 rounded-xl text-left hover:border-purple-400 hover:bg-purple-50 transition-colors"
                >
                  {opt}
                </button>
              ))}
            </div>
            
            <p className="text-center text-gray-500 text-sm mt-4">Earn 10 coins for each correct answer!</p>
          </div>
        </div>
      )}

      <BottomNavigation />
      <AuthModal />
    </div>
  )
}
