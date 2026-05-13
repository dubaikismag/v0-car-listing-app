'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { TopTabs } from '@/components/top-tabs'
import { BottomNavigation } from '@/components/bottom-navigation'
import { AuthModal } from '@/components/auth-modal'
import { useAppStore } from '@/lib/store'
import { X, ArrowLeft } from 'lucide-react'

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
  
  // Scratch card state
  const [scratchRevealed, setScratchRevealed] = useState(false)
  const [scratchPrize, setScratchPrize] = useState('')
  
  // Flash auction state
  const [auctionTime, setAuctionTime] = useState(3600)
  const [currentBid, setCurrentBid] = useState(150)
  const [userBid, setUserBid] = useState('')
  
  // Memory game state
  const [memoryCards, setMemoryCards] = useState<{id: number, emoji: string, flipped: boolean, matched: boolean}[]>([])
  const [selectedCards, setSelectedCards] = useState<number[]>([])
  const [memoryMoves, setMemoryMoves] = useState(0)
  
  // Quiz state
  const [quizQuestion, setQuizQuestion] = useState(0)
  const [quizScore, setQuizScore] = useState(0)
  const [quizAnswered, setQuizAnswered] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  
  // Word puzzle state
  const [wordLetters, setWordLetters] = useState<string[]>([])
  const [guessedWord, setGuessedWord] = useState('')
  const [wordHint, setWordHint] = useState('')
  
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

  // Prizes array - index 0 starts at top of wheel when rotation is 0
  // Each segment is 60 degrees (360/6)
  const prizes = ['20 Coins', 'AED 50', '5 Coins', 'Spin Again!', 'AED 10', 'Free Boost']
  const segmentAngle = 360 / prizes.length // 60 degrees
  
  const quizQuestions = [
    { q: 'What is the capital of UAE?', options: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman'], correct: 1 },
    { q: 'Which emirate is the largest by area?', options: ['Dubai', 'Abu Dhabi', 'Sharjah', 'RAK'], correct: 1 },
    { q: 'What is the currency of UAE?', options: ['Riyal', 'Dinar', 'Dirham', 'Dollar'], correct: 2 },
    { q: 'Burj Khalifa is in which city?', options: ['Abu Dhabi', 'Sharjah', 'Dubai', 'Ajman'], correct: 2 },
    { q: 'How many emirates are in UAE?', options: ['5', '6', '7', '8'], correct: 2 },
  ]

  const scratchPrizes = ['5 Coins', '10 Coins', 'AED 5 Voucher', 'Free Ad Boost', '20 Coins', 'Try Again']
  
  const words = [
    { word: 'DUBAI', hint: 'Famous UAE city' },
    { word: 'BURJ', hint: 'Tall building prefix' },
    { word: 'DESERT', hint: 'Sandy landscape' },
    { word: 'OASIS', hint: 'Water in desert' },
    { word: 'CAMEL', hint: 'Desert animal' },
  ]

  // Initialize memory game
  const initMemoryGame = () => {
    const emojis = ['🚗', '🏠', '💼', '📱', '🛋️', '🌾', '👷', '💎']
    const cards = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }))
    setMemoryCards(cards)
    setSelectedCards([])
    setMemoryMoves(0)
  }

  // Initialize word puzzle
  const initWordPuzzle = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)]
    setWordLetters(randomWord.word.split('').sort(() => Math.random() - 0.5))
    setWordHint(randomWord.hint)
    setGuessedWord('')
  }

  const handleSpin = () => {
    if (isSpinning) return
    setIsSpinning(true)
    setSpinResult(null)
    
    // Pick a random prize index
    const winningIndex = Math.floor(Math.random() * prizes.length)
    
    // The wheel rotates clockwise. Pointer is fixed at top (12 o'clock).
    // When wheel rotation is 0, segment 0 (20 Coins) is at top.
    // To make segment N land at top, we need to rotate the wheel so segment N is under pointer.
    // Since segment N starts at N*60 degrees from top (clockwise),
    // we need to rotate 360 - (N*60) + offset to center the segment under pointer.
    
    const baseSpins = 360 * 5 // 5 full rotations for dramatic effect
    const segmentStart = winningIndex * segmentAngle
    const segmentCenter = segmentStart + (segmentAngle / 2)
    // Rotate wheel so this segment's center lands at top (360 - segmentCenter)
    const stopAngle = 360 - segmentCenter
    const totalRotation = baseSpins + stopAngle
    
    setSpinRotation(prev => prev + totalRotation)
    
    setTimeout(() => {
      setSpinResult(prizes[winningIndex])
      setIsSpinning(false)
      if (prizes[winningIndex].includes('Coins')) {
        const coinAmount = parseInt(prizes[winningIndex])
        addCoins(coinAmount)
      }
    }, 4000)
  }

  const handleScratch = () => {
    if (!scratchRevealed) {
      const prize = scratchPrizes[Math.floor(Math.random() * scratchPrizes.length)]
      setScratchPrize(prize)
      setScratchRevealed(true)
      if (prize.includes('Coins')) {
        addCoins(parseInt(prize))
      }
    }
  }

  const handleBid = () => {
    const bid = parseInt(userBid)
    if (bid > currentBid) {
      setCurrentBid(bid)
      setUserBid('')
    }
  }

  const handleMemoryClick = (cardId: number) => {
    if (selectedCards.length === 2) return
    if (memoryCards[cardId].matched || memoryCards[cardId].flipped) return

    const newCards = memoryCards.map((c, i) => 
      i === cardId ? { ...c, flipped: true } : c
    )
    setMemoryCards(newCards)
    
    const newSelected = [...selectedCards, cardId]
    setSelectedCards(newSelected)

    if (newSelected.length === 2) {
      setMemoryMoves(m => m + 1)
      setTimeout(() => {
        const [first, second] = newSelected
        if (newCards[first].emoji === newCards[second].emoji) {
          setMemoryCards(cards => cards.map((c, i) =>
            i === first || i === second ? { ...c, matched: true } : c
          ))
        } else {
          setMemoryCards(cards => cards.map((c, i) =>
            i === first || i === second ? { ...c, flipped: false } : c
          ))
        }
        setSelectedCards([])
      }, 1000)
    }
  }

  const handleQuizAnswer = (index: number) => {
    if (quizAnswered) return
    setSelectedAnswer(index)
    setQuizAnswered(true)
    if (index === quizQuestions[quizQuestion].correct) {
      setQuizScore(s => s + 10)
      addCoins(10)
    }
  }

  const nextQuestion = () => {
    if (quizQuestion < quizQuestions.length - 1) {
      setQuizQuestion(q => q + 1)
      setQuizAnswered(false)
      setSelectedAnswer(null)
    } else {
      setActiveGame(null)
      setQuizQuestion(0)
      setQuizScore(0)
      setQuizAnswered(false)
      setSelectedAnswer(null)
    }
  }

  const handleLetterClick = (letter: string, index: number) => {
    setGuessedWord(g => g + letter)
    setWordLetters(letters => letters.filter((_, i) => i !== index))
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

  // Auction countdown
  useEffect(() => {
    if (activeGame === 'auction') {
      const interval = setInterval(() => {
        setAuctionTime(t => t > 0 ? t - 1 : 0)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [activeGame])

  // Simulate farm growth
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

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const closeGame = () => {
    setActiveGame(null)
    setScratchRevealed(false)
    setScratchPrize('')
    setSpinResult(null)
  }

  return (
    <div className="min-h-screen bg-[#f5f3ff] pb-20">
      <Header />
      <TopTabs onTabChange={(tab) => {
        if (tab === 'Fun') return
      }} />

      <main className="px-4 py-4">
        {/* Fun Zone Header */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span>🎮</span> Fun Zone
          </h2>
          <span className="text-amber-500 font-semibold text-sm">Win AED Prizes!</span>
        </div>

        <p className="text-gray-600 text-xs mb-4">Play & win ad credits, AED vouchers, coins - daily prizes!</p>

        {/* Daily Check-in */}
        <div className="bg-gradient-to-r from-amber-400 to-amber-500 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-2 text-amber-900 text-xs font-medium mb-1">
            <span>⚡</span> DAILY CHECK-IN
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Claim your 5 coins today!</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={() => !dailyCheckedIn && claimDaily()}
              disabled={dailyCheckedIn}
              className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                dailyCheckedIn
                  ? 'bg-white/50 text-amber-700'
                  : 'bg-white text-amber-600 hover:bg-white/90'
              }`}
            >
              {dailyCheckedIn ? 'Claimed' : 'Claim Now'}
            </button>
            <div className="flex items-center gap-1.5 bg-white/30 px-3 py-1.5 rounded-lg">
              <span>🪙</span>
              <span className="font-bold text-white text-sm">{coins} Coins</span>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Spin & Win */}
          <button
            onClick={() => setActiveGame('spin')}
            className="bg-white rounded-xl p-3 text-center border border-gray-100 hover:border-purple-200 transition-colors"
          >
            <span className="text-3xl block mb-1">🎡</span>
            <p className="font-bold text-gray-900 text-sm">Spin & Win</p>
            <p className="text-xs text-gray-500 mb-2">Win AED vouchers & boosts</p>
            <span className="inline-block px-2.5 py-1 bg-amber-100/80 text-amber-700 rounded-full text-xs font-medium backdrop-blur-sm">
              Play Free
            </span>
          </button>

          {/* UAE Quiz */}
          <button
            onClick={() => setActiveGame('quiz')}
            className="bg-white rounded-xl p-3 text-center border border-gray-100 hover:border-purple-200 transition-colors"
          >
            <span className="text-3xl block mb-1">🧠</span>
            <p className="font-bold text-gray-900 text-sm">UAE Quiz</p>
            <p className="text-xs text-gray-500 mb-2">5 questions, earn coins</p>
            <span className="inline-block px-2.5 py-1 bg-purple-100/80 text-purple-700 rounded-full text-xs font-medium backdrop-blur-sm">
              +10 Coins each
            </span>
          </button>

          {/* Scratch Card */}
          <button
            onClick={() => setActiveGame('scratch')}
            className="bg-white rounded-xl p-3 text-center border border-gray-100 hover:border-purple-200 transition-colors"
          >
            <span className="text-3xl block mb-1">🎟️</span>
            <p className="font-bold text-gray-900 text-sm">Scratch Card</p>
            <p className="text-xs text-gray-500 mb-2">Reveal daily prizes</p>
            <span className="inline-block px-2.5 py-1 bg-pink-100/80 text-pink-700 rounded-full text-xs font-medium backdrop-blur-sm">
              Daily Free
            </span>
          </button>

          {/* Flash Auction */}
          <button
            onClick={() => setActiveGame('auction')}
            className="bg-white rounded-xl p-3 text-center border border-gray-100 hover:border-purple-200 transition-colors"
          >
            <span className="text-3xl block mb-1">⚒️</span>
            <p className="font-bold text-gray-900 text-sm">Flash Auction</p>
            <p className="text-xs text-gray-500 mb-2">Bid at huge discounts!</p>
            <span className="inline-block px-2.5 py-1 bg-red-100/80 text-red-700 rounded-full text-xs font-medium backdrop-blur-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span> Live Now
            </span>
          </button>

          {/* Memory Game */}
          <button
            onClick={() => { initMemoryGame(); setActiveGame('memory') }}
            className="bg-white rounded-xl p-3 text-center border border-gray-100 hover:border-purple-200 transition-colors"
          >
            <span className="text-3xl block mb-1">🃏</span>
            <p className="font-bold text-gray-900 text-sm">Memory Match</p>
            <p className="text-xs text-gray-500 mb-2">Find matching pairs</p>
            <span className="inline-block px-2.5 py-1 bg-blue-100/80 text-blue-700 rounded-full text-xs font-medium backdrop-blur-sm">
              Brain Game
            </span>
          </button>

          {/* Word Puzzle */}
          <button
            onClick={() => { initWordPuzzle(); setActiveGame('word') }}
            className="bg-white rounded-xl p-3 text-center border border-gray-100 hover:border-purple-200 transition-colors"
          >
            <span className="text-3xl block mb-1">🔤</span>
            <p className="font-bold text-gray-900 text-sm">Word Puzzle</p>
            <p className="text-xs text-gray-500 mb-2">Unscramble the word</p>
            <span className="inline-block px-2.5 py-1 bg-green-100/80 text-green-700 rounded-full text-xs font-medium backdrop-blur-sm">
              +15 Coins
            </span>
          </button>

          {/* Farm Game */}
          <button
            onClick={() => setActiveGame('farm')}
            className="bg-white rounded-xl p-3 text-center border border-gray-100 hover:border-purple-200 transition-colors"
          >
            <span className="text-3xl block mb-1">🌾</span>
            <p className="font-bold text-gray-900 text-sm">Farm Game</p>
            <p className="text-xs text-gray-500 mb-2">Grow & earn credits</p>
            <span className="inline-block px-2.5 py-1 bg-green-100/80 text-green-700 rounded-full text-xs font-medium backdrop-blur-sm">
              Play Now
            </span>
          </button>

          {/* Leaderboard */}
          <button
            onClick={() => setActiveGame('leaderboard')}
            className="bg-white rounded-xl p-3 text-center border border-gray-100 hover:border-purple-200 transition-colors"
          >
            <span className="text-3xl block mb-1">🏆</span>
            <p className="font-bold text-gray-900 text-sm">Leaderboard</p>
            <p className="text-xs text-gray-500 mb-2">Top sellers win cash</p>
            <span className="inline-block px-2.5 py-1 bg-amber-100/80 text-amber-700 rounded-full text-xs font-medium backdrop-blur-sm">
              Monthly
            </span>
          </button>
        </div>
      </main>

      {/* Spin Wheel Modal */}
      {activeGame === 'spin' && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50">
          <div className="w-full max-w-lg bg-white rounded-t-3xl max-h-[90vh] overflow-auto animate-in slide-in-from-bottom">
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>
            <div className="px-5 pb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <span>🎡</span> Spin & Win
                </h2>
                <button onClick={closeGame} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="relative flex justify-center mb-6">
                {/* Pointer at top - pointing down at wheel */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10">
                  <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent border-t-purple-700 drop-shadow-lg"></div>
                </div>
                
                {/* Wheel with SVG for precise segment labels */}
                <div 
                  className="w-64 h-64 relative"
                  style={{ 
                    transform: `rotate(${spinRotation}deg)`,
                    transition: isSpinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
                  }}
                >
                  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl">
                    {/* Wheel segments */}
                    {prizes.map((prize, i) => {
                      const startAngle = i * 60 - 90 // Start from top (-90deg)
                      const endAngle = startAngle + 60
                      const startRad = (startAngle * Math.PI) / 180
                      const endRad = (endAngle * Math.PI) / 180
                      const x1 = 100 + 92 * Math.cos(startRad)
                      const y1 = 100 + 92 * Math.sin(startRad)
                      const x2 = 100 + 92 * Math.cos(endRad)
                      const y2 = 100 + 92 * Math.sin(endRad)
                      const colors = ['#3b82f6', '#ec4899', '#f59e0b', '#eab308', '#10b981', '#ef4444']
                      return (
                        <path
                          key={i}
                          d={`M 100 100 L ${x1} ${y1} A 92 92 0 0 1 ${x2} ${y2} Z`}
                          fill={colors[i]}
                          stroke="#e9d5ff"
                          strokeWidth="3"
                        />
                      )
                    })}
                    
                    {/* Prize labels - text along radius, reading outward */}
                    {prizes.map((prize, i) => {
                      const midAngle = i * 60 - 90 + 30 // Center of segment
                      const midRad = (midAngle * Math.PI) / 180
                      const textRadius = 62
                      const tx = 100 + textRadius * Math.cos(midRad)
                      const ty = 100 + textRadius * Math.sin(midRad)
                      // Rotate text to be readable (pointing outward from center)
                      const textRotation = midAngle + 90
                      return (
                        <text
                          key={i}
                          x={tx}
                          y={ty}
                          fill="white"
                          fontSize="9"
                          fontWeight="bold"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          transform={`rotate(${textRotation}, ${tx}, ${ty})`}
                        >
                          {prize}
                        </text>
                      )
                    })}
                    
                    {/* Center circle */}
                    <circle cx="100" cy="100" r="22" fill="white" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))" />
                  </svg>
                  
                  {/* Center gift icon */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl">
                    🎁
                  </div>
                </div>
              </div>

              {spinResult && (
                <div className="text-center mb-4 p-3 bg-green-50 rounded-xl">
                  <p className="text-lg font-bold text-green-700">You won: {spinResult}!</p>
                </div>
              )}
              
              <button
                onClick={handleSpin}
                disabled={isSpinning}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-xl disabled:opacity-50"
              >
                {isSpinning ? 'Spinning...' : 'SPIN NOW!'}
              </button>
              
              <p className="text-center text-gray-500 text-xs mt-3">AED vouchers - Free boosts - Coins!</p>
            </div>
          </div>
        </div>
      )}

      {/* Scratch Card Modal */}
      {activeGame === 'scratch' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <span>🎟️</span> Scratch Card
              </h2>
              <button onClick={closeGame} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div 
              onClick={handleScratch}
              className={`aspect-video rounded-xl flex items-center justify-center cursor-pointer transition-all ${
                scratchRevealed 
                  ? 'bg-gradient-to-br from-amber-400 to-amber-500' 
                  : 'bg-gradient-to-br from-gray-300 to-gray-400'
              }`}
            >
              {scratchRevealed ? (
                <div className="text-center">
                  <span className="text-4xl block mb-2">🎉</span>
                  <p className="text-xl font-bold text-white">{scratchPrize}</p>
                </div>
              ) : (
                <div className="text-center">
                  <span className="text-4xl block mb-2">✨</span>
                  <p className="text-white font-semibold">Tap to Scratch!</p>
                </div>
              )}
            </div>
            
            <p className="text-center text-gray-500 text-sm mt-4">
              {scratchRevealed ? 'Come back tomorrow for another scratch!' : 'Scratch to reveal your daily prize'}
            </p>
          </div>
        </div>
      )}

      {/* Flash Auction Modal */}
      {activeGame === 'auction' && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50">
          <div className="w-full max-w-lg bg-white rounded-t-3xl max-h-[90vh] overflow-auto animate-in slide-in-from-bottom">
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>
            <div className="px-5 pb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <span>⚒️</span> Flash Auction
                </h2>
                <button onClick={closeGame} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Auction Item */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-red-500 font-bold text-sm flex items-center gap-1">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    LIVE AUCTION
                  </span>
                  <span className="text-purple-700 font-bold">{formatTime(auctionTime)}</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="text-5xl">📱</span>
                  <div>
                    <p className="font-bold text-gray-900">iPhone 14 Pro Max 256GB</p>
                    <p className="text-sm text-gray-500">Retail: AED 4,500</p>
                    <p className="text-purple-600 font-bold text-xl mt-1">Current: AED {currentBid}</p>
                  </div>
                </div>
              </div>

              {/* Bid Input */}
              <div className="flex gap-2 mb-4">
                <input
                  type="number"
                  placeholder="Enter your bid"
                  value={userBid}
                  onChange={(e) => setUserBid(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl"
                />
                <button
                  onClick={handleBid}
                  className="px-6 py-3 bg-purple-600 text-white font-bold rounded-xl"
                >
                  Bid
                </button>
              </div>

              {/* Recent Bids */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="font-semibold text-gray-900 mb-2">Recent Bids</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ahmed S.</span>
                    <span className="font-medium">AED {currentBid}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ravi K.</span>
                    <span className="font-medium">AED {currentBid - 10}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Maria C.</span>
                    <span className="font-medium">AED {currentBid - 25}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Memory Game Modal */}
      {activeGame === 'memory' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <span>🃏</span> Memory Match
              </h2>
              <button onClick={closeGame} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <p className="text-sm text-gray-500 mb-3">Moves: {memoryMoves}</p>
            
            <div className="grid grid-cols-4 gap-2">
              {memoryCards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => handleMemoryClick(card.id)}
                  className={`aspect-square rounded-lg flex items-center justify-center text-2xl transition-all ${
                    card.flipped || card.matched
                      ? 'bg-purple-100'
                      : 'bg-purple-600'
                  }`}
                >
                  {(card.flipped || card.matched) ? card.emoji : '?'}
                </button>
              ))}
            </div>
            
            {memoryCards.every(c => c.matched) && (
              <div className="mt-4 p-3 bg-green-50 rounded-xl text-center">
                <p className="font-bold text-green-700">Completed in {memoryMoves} moves!</p>
                <button 
                  onClick={initMemoryGame}
                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium"
                >
                  Play Again
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Word Puzzle Modal */}
      {activeGame === 'word' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <span>🔤</span> Word Puzzle
              </h2>
              <button onClick={closeGame} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <p className="text-sm text-gray-500 mb-4">Hint: {wordHint}</p>
            
            {/* Guessed Word Display */}
            <div className="flex justify-center gap-2 mb-6">
              {guessedWord.split('').map((letter, i) => (
                <div key={i} className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center font-bold text-purple-700">
                  {letter}
                </div>
              ))}
              {Array(5 - guessedWord.length).fill('').map((_, i) => (
                <div key={`empty-${i}`} className="w-10 h-10 border-2 border-dashed border-gray-300 rounded-lg"></div>
              ))}
            </div>
            
            {/* Available Letters */}
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {wordLetters.map((letter, i) => (
                <button
                  key={i}
                  onClick={() => handleLetterClick(letter, i)}
                  className="w-10 h-10 bg-amber-400 rounded-lg flex items-center justify-center font-bold text-amber-900 hover:bg-amber-500"
                >
                  {letter}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setGuessedWord('')}
              className="w-full py-2 border border-gray-300 rounded-lg text-gray-600 text-sm"
            >
              Clear
            </button>
            
            {wordLetters.length === 0 && guessedWord.length > 0 && (
              <div className="mt-4 p-3 bg-green-50 rounded-xl text-center">
                <p className="font-bold text-green-700">Correct! +15 Coins</p>
                <button 
                  onClick={() => { addCoins(15); initWordPuzzle() }}
                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium"
                >
                  Play Again
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quiz Modal */}
      {activeGame === 'quiz' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <span>🧠</span> UAE Quiz
              </h2>
              <button onClick={closeGame} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500">Question {quizQuestion + 1} of {quizQuestions.length}</p>
              <p className="text-sm font-bold text-purple-600">Score: {quizScore}</p>
            </div>
            
            <p className="text-base font-semibold text-gray-900 mb-4">{quizQuestions[quizQuestion].q}</p>
            
            <div className="space-y-2">
              {quizQuestions[quizQuestion].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleQuizAnswer(i)}
                  disabled={quizAnswered}
                  className={`w-full p-3 border rounded-xl text-left transition-colors text-sm ${
                    quizAnswered
                      ? i === quizQuestions[quizQuestion].correct
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : i === selectedAnswer
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-200 text-gray-600'
                      : 'border-gray-200 hover:border-purple-400 hover:bg-purple-50/50'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            
            {quizAnswered && (
              <button
                onClick={nextQuestion}
                className="w-full mt-4 py-3 bg-purple-600 text-white font-semibold rounded-xl"
              >
                {quizQuestion < quizQuestions.length - 1 ? 'Next Question' : 'Finish'}
              </button>
            )}
            
            <p className="text-center text-gray-500 text-xs mt-3">Earn 10 coins for each correct answer!</p>
          </div>
        </div>
      )}

      {/* Farm Game Modal */}
      {activeGame === 'farm' && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50">
          <div className="w-full max-w-lg bg-white rounded-t-3xl max-h-[90vh] overflow-auto animate-in slide-in-from-bottom">
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>
            <div className="px-5 pb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <span>🌾</span> UAE Farm Game
                </h2>
                <button onClick={closeGame} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="flex items-center justify-between mb-3 text-sm text-gray-600">
                <span>Tap empty to plant - Tap crops to harvest</span>
                <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                  <span>🪙</span>
                  <span className="font-bold">{coins}</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-4">
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
                        <span className="text-2xl">+</span>
                        <span className="text-[10px] text-amber-800">Plant</span>
                      </>
                    )}
                    {plot.state === 'planted' && <span className="text-2xl">🌱</span>}
                    {plot.state === 'growing' && (
                      <>
                        <span className="text-2xl">🌿</span>
                        <div className="absolute bottom-1 left-1 right-1 h-1 bg-green-700/50 rounded-full">
                          <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${plot.progress}%` }}></div>
                        </div>
                      </>
                    )}
                    {plot.state === 'ready' && (
                      <>
                        <span className="text-2xl">🥬</span>
                        <span className="text-[10px] text-green-900 font-bold">Harvest!</span>
                      </>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-xl">
                <span className="text-2xl">💧</span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">Water Tank</p>
                  <div className="h-2 bg-blue-200 rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-blue-500" style={{ width: `${waterTank}%` }}></div>
                  </div>
                </div>
                <button 
                  onClick={() => setWaterTank(100)}
                  className="px-3 py-1.5 bg-blue-500 text-white rounded-lg font-medium text-sm"
                >
                  Refill
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Modal */}
      {activeGame === 'leaderboard' && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50">
          <div className="w-full max-w-lg bg-white rounded-t-3xl max-h-[90vh] overflow-auto animate-in slide-in-from-bottom">
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>
            <div className="px-5 pb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <span>🏆</span> Leaderboard
                </h2>
                <button onClick={closeGame} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-2">
                {[
                  { rank: 1, name: 'Ahmed S.', coins: 2450, emoji: '🥇' },
                  { rank: 2, name: 'Maria C.', coins: 2100, emoji: '🥈' },
                  { rank: 3, name: 'Ravi K.', coins: 1850, emoji: '🥉' },
                  { rank: 4, name: 'John D.', coins: 1500, emoji: '4' },
                  { rank: 5, name: 'Sara M.', coins: 1200, emoji: '5' },
                ].map((player) => (
                  <div key={player.rank} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <span className="text-xl w-8 text-center">{player.emoji}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{player.name}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>🪙</span>
                      <span className="font-bold text-purple-600">{player.coins}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <p className="text-center text-gray-500 text-sm mt-4">Top 3 win AED 500, 300, 100 monthly!</p>
            </div>
          </div>
        </div>
      )}

      <BottomNavigation />
      <AuthModal />
    </div>
  )
}
