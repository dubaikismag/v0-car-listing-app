"use client"

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { RotateCcw, Trophy, Timer, Zap } from 'lucide-react'
import confetti from 'canvas-confetti'

const cardSymbols = ['🚗', '🏠', '📱', '⌚', '👔', '💼', '🎮', '📷']

interface MemoryCard {
  id: number
  symbol: string
  isFlipped: boolean
  isMatched: boolean
}

export function MemoryGame() {
  const [cards, setCards] = useState<MemoryCard[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [timer, setTimer] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [bestScore, setBestScore] = useState<number | null>(null)

  const initializeGame = useCallback(() => {
    const shuffledSymbols = [...cardSymbols, ...cardSymbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
        isMatched: false
      }))
    setCards(shuffledSymbols)
    setFlippedCards([])
    setMoves(0)
    setMatches(0)
    setTimer(0)
    setIsPlaying(true)
  }, [])

  useEffect(() => {
    initializeGame()
    const saved = localStorage.getItem('memory-best-score')
    if (saved) setBestScore(parseInt(saved))
  }, [initializeGame])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && matches < 8) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, matches])

  useEffect(() => {
    if (matches === 8 && isPlaying) {
      setIsPlaying(false)
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
      
      if (!bestScore || moves < bestScore) {
        setBestScore(moves)
        localStorage.setItem('memory-best-score', moves.toString())
      }
    }
  }, [matches, isPlaying, moves, bestScore])

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2) return
    if (cards[id].isFlipped || cards[id].isMatched) return

    const newCards = [...cards]
    newCards[id].isFlipped = true
    setCards(newCards)
    setFlippedCards([...flippedCards, id])

    if (flippedCards.length === 1) {
      setMoves((m) => m + 1)
      const firstCard = cards[flippedCards[0]]
      const secondCard = newCards[id]

      if (firstCard.symbol === secondCard.symbol) {
        setTimeout(() => {
          setCards((prev) => {
            const updated = [...prev]
            updated[flippedCards[0]].isMatched = true
            updated[id].isMatched = true
            return updated
          })
          setMatches((m) => m + 1)
          setFlippedCards([])
        }, 500)
      } else {
        setTimeout(() => {
          setCards((prev) => {
            const updated = [...prev]
            updated[flippedCards[0]].isFlipped = false
            updated[id].isFlipped = false
            return updated
          })
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-4">
      {/* Stats Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="gap-1">
            <Zap className="h-3 w-3" />
            Moves: {moves}
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <Timer className="h-3 w-3" />
            {formatTime(timer)}
          </Badge>
        </div>
        <Button variant="outline" size="sm" onClick={initializeGame}>
          <RotateCcw className="h-4 w-4 mr-1" />
          Restart
        </Button>
      </div>

      {/* Best Score */}
      {bestScore && (
        <div className="text-center text-sm text-muted-foreground">
          <Trophy className="h-4 w-4 inline mr-1 text-amber-500" />
          Best: {bestScore} moves
        </div>
      )}

      {/* Game Board */}
      <div className="grid grid-cols-4 gap-2">
        {cards.map((card) => (
          <Card
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={cn(
              "aspect-square flex items-center justify-center cursor-pointer transition-all duration-300 text-3xl",
              card.isFlipped || card.isMatched
                ? "bg-amber-500 text-white"
                : "bg-muted hover:bg-muted/80",
              card.isMatched && "bg-green-500"
            )}
          >
            {card.isFlipped || card.isMatched ? card.symbol : '?'}
          </Card>
        ))}
      </div>

      {/* Win Message */}
      {matches === 8 && (
        <div className="text-center py-4">
          <h3 className="text-xl font-bold text-green-500">Congratulations!</h3>
          <p className="text-muted-foreground">
            You won in {moves} moves and {formatTime(timer)}!
          </p>
        </div>
      )}
    </div>
  )
}
