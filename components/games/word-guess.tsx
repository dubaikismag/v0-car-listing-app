"use client"

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { RotateCcw, Heart, Trophy, Lightbulb } from 'lucide-react'
import confetti from 'canvas-confetti'

const words = [
  { word: 'DUBAI', hint: 'Famous city in UAE' },
  { word: 'BURJ', hint: 'Tallest building prefix' },
  { word: 'MARINA', hint: 'Popular waterfront area' },
  { word: 'PALM', hint: 'Man-made island shape' },
  { word: 'DESERT', hint: 'Sandy landscape' },
  { word: 'LUXURY', hint: 'High-end living' },
  { word: 'TOWER', hint: 'Tall building' },
  { word: 'METRO', hint: 'City transport' },
  { word: 'GOLD', hint: 'Precious metal' },
  { word: 'MALL', hint: 'Shopping center' },
  { word: 'BEACH', hint: 'Sandy shore' },
  { word: 'VILLA', hint: 'Luxury house type' }
]

const KEYBOARD = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
]

export function WordGuessGame() {
  const [currentWord, setCurrentWord] = useState({ word: '', hint: '' })
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set())
  const [wrongGuesses, setWrongGuesses] = useState(0)
  const [gamesWon, setGamesWon] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const maxWrong = 6

  const initializeGame = useCallback(() => {
    const randomWord = words[Math.floor(Math.random() * words.length)]
    setCurrentWord(randomWord)
    setGuessedLetters(new Set())
    setWrongGuesses(0)
    setShowHint(false)
  }, [])

  useEffect(() => {
    initializeGame()
  }, [initializeGame])

  const isWon = currentWord.word.split('').every((letter) => guessedLetters.has(letter))
  const isLost = wrongGuesses >= maxWrong

  useEffect(() => {
    if (isWon && currentWord.word) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      })
      setGamesWon((g) => g + 1)
    }
  }, [isWon, currentWord.word])

  const handleGuess = (letter: string) => {
    if (isWon || isLost || guessedLetters.has(letter)) return

    const newGuessed = new Set(guessedLetters)
    newGuessed.add(letter)
    setGuessedLetters(newGuessed)

    if (!currentWord.word.includes(letter)) {
      setWrongGuesses((w) => w + 1)
    }
  }

  const getLetterStatus = (letter: string) => {
    if (!guessedLetters.has(letter)) return 'unused'
    if (currentWord.word.includes(letter)) return 'correct'
    return 'wrong'
  }

  const displayWord = currentWord.word
    .split('')
    .map((letter) => (guessedLetters.has(letter) || isLost ? letter : '_'))
    .join(' ')

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Array.from({ length: maxWrong }).map((_, i) => (
            <Heart
              key={i}
              className={cn(
                "h-5 w-5",
                i < maxWrong - wrongGuesses
                  ? "fill-red-500 text-red-500"
                  : "text-muted-foreground/30"
              )}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Trophy className="h-3 w-3 text-amber-500" />
            Won: {gamesWon}
          </Badge>
          <Button variant="outline" size="sm" onClick={initializeGame}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Word Display */}
      <div className="text-center py-6">
        <div className="text-4xl font-mono font-bold tracking-[0.5em] mb-4">
          {displayWord}
        </div>
        
        {/* Hint Button */}
        {!showHint && !isWon && !isLost && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHint(true)}
            className="text-amber-600"
          >
            <Lightbulb className="h-4 w-4 mr-1" />
            Show Hint
          </Button>
        )}
        
        {showHint && (
          <p className="text-sm text-muted-foreground">
            Hint: {currentWord.hint}
          </p>
        )}
      </div>

      {/* Game Status */}
      {(isWon || isLost) && (
        <div className={cn(
          "text-center py-4 rounded-lg",
          isWon ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
        )}>
          <p className="font-bold text-lg">
            {isWon ? 'You Won!' : `Game Over! The word was: ${currentWord.word}`}
          </p>
          <Button
            onClick={initializeGame}
            className="mt-2"
            variant="outline"
          >
            Play Again
          </Button>
        </div>
      )}

      {/* Keyboard */}
      <div className="space-y-2">
        {KEYBOARD.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1">
            {row.map((letter) => {
              const status = getLetterStatus(letter)
              return (
                <Button
                  key={letter}
                  variant="outline"
                  size="sm"
                  onClick={() => handleGuess(letter)}
                  disabled={guessedLetters.has(letter) || isWon || isLost}
                  className={cn(
                    "w-8 h-10 p-0 font-semibold",
                    status === 'correct' && "bg-green-500 text-white border-green-500",
                    status === 'wrong' && "bg-red-500/20 text-red-500 border-red-500/50"
                  )}
                >
                  {letter}
                </Button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
