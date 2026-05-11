"use client"

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { RotateCcw, Trophy, Zap, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react'
import confetti from 'canvas-confetti'

export function NumberPuzzle() {
  const [tiles, setTiles] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [bestMoves, setBestMoves] = useState<number | null>(null)
  const [isComplete, setIsComplete] = useState(false)

  const goal = [1, 2, 3, 4, 5, 6, 7, 8, 0]

  const initializeGame = useCallback(() => {
    let newTiles: number[]
    do {
      newTiles = [1, 2, 3, 4, 5, 6, 7, 8, 0].sort(() => Math.random() - 0.5)
    } while (!isSolvable(newTiles) || arraysEqual(newTiles, goal))

    setTiles(newTiles)
    setMoves(0)
    setIsComplete(false)
  }, [])

  // Check if puzzle is solvable
  function isSolvable(tiles: number[]): boolean {
    let inversions = 0
    for (let i = 0; i < tiles.length - 1; i++) {
      for (let j = i + 1; j < tiles.length; j++) {
        if (tiles[i] && tiles[j] && tiles[i] > tiles[j]) {
          inversions++
        }
      }
    }
    return inversions % 2 === 0
  }

  function arraysEqual(a: number[], b: number[]): boolean {
    return a.every((val, idx) => val === b[idx])
  }

  useEffect(() => {
    initializeGame()
    const saved = localStorage.getItem('puzzle-best-moves')
    if (saved) setBestMoves(parseInt(saved))
  }, [initializeGame])

  useEffect(() => {
    if (tiles.length > 0 && arraysEqual(tiles, goal)) {
      setIsComplete(true)
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })

      if (!bestMoves || moves < bestMoves) {
        setBestMoves(moves)
        localStorage.setItem('puzzle-best-moves', moves.toString())
      }
    }
  }, [tiles, moves, bestMoves])

  const getEmptyIndex = () => tiles.indexOf(0)

  const canMove = (index: number): boolean => {
    const emptyIndex = getEmptyIndex()
    const row = Math.floor(index / 3)
    const col = index % 3
    const emptyRow = Math.floor(emptyIndex / 3)
    const emptyCol = emptyIndex % 3

    return (
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow)
    )
  }

  const moveTile = (index: number) => {
    if (!canMove(index) || isComplete) return

    const emptyIndex = getEmptyIndex()
    const newTiles = [...tiles]
    newTiles[emptyIndex] = tiles[index]
    newTiles[index] = 0
    setTiles(newTiles)
    setMoves((m) => m + 1)
  }

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isComplete) return

      const emptyIndex = getEmptyIndex()
      const emptyRow = Math.floor(emptyIndex / 3)
      const emptyCol = emptyIndex % 3

      let targetIndex = -1

      switch (e.key) {
        case 'ArrowUp':
          if (emptyRow < 2) targetIndex = emptyIndex + 3
          break
        case 'ArrowDown':
          if (emptyRow > 0) targetIndex = emptyIndex - 3
          break
        case 'ArrowLeft':
          if (emptyCol < 2) targetIndex = emptyIndex + 1
          break
        case 'ArrowRight':
          if (emptyCol > 0) targetIndex = emptyIndex - 1
          break
      }

      if (targetIndex >= 0 && targetIndex < 9) {
        moveTile(targetIndex)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [tiles, isComplete])

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="flex items-center justify-between">
        <Badge variant="secondary" className="gap-1">
          <Zap className="h-3 w-3" />
          Moves: {moves}
        </Badge>
        <Button variant="outline" size="sm" onClick={initializeGame}>
          <RotateCcw className="h-4 w-4 mr-1" />
          Reset
        </Button>
      </div>

      {/* Best Score */}
      {bestMoves && (
        <div className="text-center text-sm text-muted-foreground">
          <Trophy className="h-4 w-4 inline mr-1 text-amber-500" />
          Best: {bestMoves} moves
        </div>
      )}

      {/* Puzzle Grid */}
      <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto">
        {tiles.map((tile, index) => (
          <Button
            key={index}
            variant="outline"
            className={cn(
              "aspect-square text-2xl font-bold h-auto transition-all",
              tile === 0 && "invisible",
              canMove(index) && !isComplete && "hover:bg-amber-500/20 hover:border-amber-500",
              tile !== 0 && (tile === index + 1 || (tile === 0 && index === 8)) && "bg-green-500/10 border-green-500"
            )}
            onClick={() => moveTile(index)}
            disabled={tile === 0 || isComplete}
          >
            {tile !== 0 && tile}
          </Button>
        ))}
      </div>

      {/* Controls Hint */}
      <div className="flex justify-center gap-4 text-muted-foreground">
        <div className="flex flex-col items-center gap-1">
          <div className="flex gap-1">
            <span className="p-1 bg-muted rounded text-xs"><ArrowUp className="h-3 w-3" /></span>
          </div>
          <div className="flex gap-1">
            <span className="p-1 bg-muted rounded text-xs"><ArrowLeft className="h-3 w-3" /></span>
            <span className="p-1 bg-muted rounded text-xs"><ArrowDown className="h-3 w-3" /></span>
            <span className="p-1 bg-muted rounded text-xs"><ArrowRight className="h-3 w-3" /></span>
          </div>
        </div>
        <span className="text-xs self-center">or tap tiles</span>
      </div>

      {/* Win Message */}
      {isComplete && (
        <div className="text-center py-4 bg-green-500/10 rounded-lg">
          <h3 className="text-xl font-bold text-green-600">Puzzle Solved!</h3>
          <p className="text-muted-foreground">
            Completed in {moves} moves
          </p>
          <Button onClick={initializeGame} className="mt-2" variant="outline">
            Play Again
          </Button>
        </div>
      )}
    </div>
  )
}
