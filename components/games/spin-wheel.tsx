"use client"

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Gift, Sparkles } from 'lucide-react'
import confetti from 'canvas-confetti'

const prizes = [
  { label: '10% Off', color: '#f59e0b', textColor: '#ffffff' },
  { label: 'Free Post', color: '#10b981', textColor: '#ffffff' },
  { label: 'Try Again', color: '#6b7280', textColor: '#ffffff' },
  { label: '5% Off', color: '#3b82f6', textColor: '#ffffff' },
  { label: 'Featured!', color: '#ec4899', textColor: '#ffffff' },
  { label: 'Try Again', color: '#6b7280', textColor: '#ffffff' },
  { label: '15% Off', color: '#8b5cf6', textColor: '#ffffff' },
  { label: 'Bonus!', color: '#ef4444', textColor: '#ffffff' },
]

export function SpinWheel() {
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [spinsLeft, setSpinsLeft] = useState(3)
  const wheelRef = useRef<HTMLDivElement>(null)

  const spin = () => {
    if (isSpinning || spinsLeft <= 0) return

    setIsSpinning(true)
    setResult(null)
    setSpinsLeft((s) => s - 1)

    // Random rotation (3-5 full spins + random segment)
    const newRotation = rotation + 1080 + Math.random() * 720 + Math.random() * 360

    setRotation(newRotation)

    setTimeout(() => {
      // Calculate which prize was landed on
      const normalizedRotation = newRotation % 360
      const segmentAngle = 360 / prizes.length
      const prizeIndex = Math.floor((360 - normalizedRotation + segmentAngle / 2) / segmentAngle) % prizes.length
      const prize = prizes[prizeIndex]

      setResult(prize.label)
      setIsSpinning(false)

      if (prize.label !== 'Try Again') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        })
      }
    }, 4000)
  }

  const resetSpins = () => {
    setSpinsLeft(3)
    setResult(null)
  }

  const segmentAngle = 360 / prizes.length

  return (
    <div className="space-y-6">
      {/* Spins Left */}
      <div className="flex items-center justify-between">
        <Badge variant="secondary" className="gap-1">
          <Gift className="h-3 w-3" />
          Spins Left: {spinsLeft}
        </Badge>
        {spinsLeft === 0 && (
          <Button variant="outline" size="sm" onClick={resetSpins}>
            Get More Spins
          </Button>
        )}
      </div>

      {/* Wheel Container */}
      <div className="relative flex flex-col items-center">
        {/* Pointer */}
        <div className="absolute top-0 z-10 transform -translate-y-2">
          <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[25px] border-t-amber-500" />
        </div>

        {/* Wheel */}
        <div
          ref={wheelRef}
          className="relative w-64 h-64 rounded-full shadow-xl overflow-hidden"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none'
          }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {prizes.map((prize, index) => {
              const startAngle = index * segmentAngle - 90
              const endAngle = (index + 1) * segmentAngle - 90

              const startRad = (startAngle * Math.PI) / 180
              const endRad = (endAngle * Math.PI) / 180

              const x1 = 100 + 100 * Math.cos(startRad)
              const y1 = 100 + 100 * Math.sin(startRad)
              const x2 = 100 + 100 * Math.cos(endRad)
              const y2 = 100 + 100 * Math.sin(endRad)

              const largeArc = segmentAngle > 180 ? 1 : 0

              const path = `M 100 100 L ${x1} ${y1} A 100 100 0 ${largeArc} 1 ${x2} ${y2} Z`

              // Text position
              const midAngle = (startAngle + endAngle) / 2
              const midRad = (midAngle * Math.PI) / 180
              const textX = 100 + 60 * Math.cos(midRad)
              const textY = 100 + 60 * Math.sin(midRad)

              return (
                <g key={index}>
                  <path d={path} fill={prize.color} stroke="#ffffff" strokeWidth="2" />
                  <text
                    x={textX}
                    y={textY}
                    fill={prize.textColor}
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${midAngle + 90}, ${textX}, ${textY})`}
                  >
                    {prize.label}
                  </text>
                </g>
              )
            })}
            {/* Center circle */}
            <circle cx="100" cy="100" r="20" fill="#ffffff" stroke="#e5e7eb" strokeWidth="3" />
            <circle cx="100" cy="100" r="15" fill="#f59e0b" />
          </svg>
        </div>

        {/* Spin Button */}
        <Button
          onClick={spin}
          disabled={isSpinning || spinsLeft <= 0}
          className={cn(
            "mt-6 h-14 px-8 text-lg bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700",
            isSpinning && "animate-pulse"
          )}
        >
          <Sparkles className="h-5 w-5 mr-2" />
          {isSpinning ? 'Spinning...' : 'SPIN!'}
        </Button>
      </div>

      {/* Result */}
      {result && (
        <Card className={cn(
          "p-4 text-center",
          result !== 'Try Again' ? "bg-green-500/10 border-green-500" : "bg-muted"
        )}>
          <h3 className={cn(
            "text-xl font-bold",
            result !== 'Try Again' ? "text-green-600" : "text-muted-foreground"
          )}>
            {result !== 'Try Again' ? `You Won: ${result}!` : 'Better luck next time!'}
          </h3>
          {result !== 'Try Again' && (
            <p className="text-sm text-muted-foreground mt-1">
              Use this on your next listing!
            </p>
          )}
        </Card>
      )}
    </div>
  )
}
