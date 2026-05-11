"use client"

import { useState } from 'react'
import { Header } from '@/components/header'
import { BottomNavigation } from '@/components/bottom-navigation'
import { AuthModal } from '@/components/auth-modal'
import { AuthProvider } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { MemoryGame } from '@/components/games/memory-game'
import { WordGuessGame } from '@/components/games/word-guess'
import { QuizGame } from '@/components/games/quiz-game'
import { SpinWheel } from '@/components/games/spin-wheel'
import { NumberPuzzle } from '@/components/games/number-puzzle'
import { 
  Gamepad2, 
  Grid3X3, 
  Type, 
  HelpCircle, 
  Gift,
  Puzzle,
  Trophy,
  Users,
  Sparkles
} from 'lucide-react'

const games = [
  {
    id: 'memory',
    name: 'Memory Match',
    description: 'Match pairs of cards',
    icon: Grid3X3,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    players: '1,245'
  },
  {
    id: 'word',
    name: 'Word Guess',
    description: 'Guess the Dubai word',
    icon: Type,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    players: '892'
  },
  {
    id: 'quiz',
    name: 'Dubai Quiz',
    description: 'Test your knowledge',
    icon: HelpCircle,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    players: '2,156'
  },
  {
    id: 'spin',
    name: 'Spin & Win',
    description: 'Win exciting prizes',
    icon: Gift,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    players: '3,421'
  },
  {
    id: 'puzzle',
    name: 'Number Puzzle',
    description: 'Slide tiles to solve',
    icon: Puzzle,
    color: 'text-pink-500',
    bg: 'bg-pink-500/10',
    players: '678'
  }
]

function FunContent() {
  const [activeGame, setActiveGame] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 mb-4">
            <Gamepad2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Fun Zone</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Take a break and play some games! Win prizes and compete with other users.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Trophy className="h-6 w-6 mx-auto mb-2 text-amber-500" />
              <div className="text-2xl font-bold">15K+</div>
              <p className="text-xs text-muted-foreground">Games Played</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="h-6 w-6 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">5.2K</div>
              <p className="text-xs text-muted-foreground">Active Players</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Sparkles className="h-6 w-6 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">892</div>
              <p className="text-xs text-muted-foreground">Prizes Won</p>
            </CardContent>
          </Card>
        </div>

        {/* Game Selection or Active Game */}
        {!activeGame ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {games.map((game) => {
              const Icon = game.icon
              return (
                <Card
                  key={game.id}
                  className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
                  onClick={() => setActiveGame(game.id)}
                >
                  <CardContent className="pt-6 text-center">
                    <div className={`inline-flex items-center justify-center h-14 w-14 rounded-2xl ${game.bg} mb-3`}>
                      <Icon className={`h-7 w-7 ${game.color}`} />
                    </div>
                    <h3 className="font-semibold mb-1">{game.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{game.description}</p>
                    <Badge variant="secondary" className="text-[10px]">
                      <Users className="h-2.5 w-2.5 mr-1" />
                      {game.players} playing
                    </Badge>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {(() => {
                    const game = games.find((g) => g.id === activeGame)
                    if (!game) return null
                    const Icon = game.icon
                    return (
                      <>
                        <div className={`h-10 w-10 rounded-xl ${game.bg} flex items-center justify-center`}>
                          <Icon className={`h-5 w-5 ${game.color}`} />
                        </div>
                        <div>
                          <CardTitle>{game.name}</CardTitle>
                          <CardDescription>{game.description}</CardDescription>
                        </div>
                      </>
                    )
                  })()}
                </div>
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => setActiveGame(null)}
                >
                  All Games
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {activeGame === 'memory' && <MemoryGame />}
              {activeGame === 'word' && <WordGuessGame />}
              {activeGame === 'quiz' && <QuizGame />}
              {activeGame === 'spin' && <SpinWheel />}
              {activeGame === 'puzzle' && <NumberPuzzle />}
            </CardContent>
          </Card>
        )}

        {/* Daily Challenge Section */}
        <Card className="mt-8 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shrink-0">
                <Trophy className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">Daily Challenge</h3>
                <p className="text-sm text-muted-foreground">
                  Complete all games today to win a free featured listing!
                </p>
                <div className="flex gap-2 mt-2">
                  {games.map((game) => (
                    <div
                      key={game.id}
                      className="h-2 w-2 rounded-full bg-muted-foreground/30"
                    />
                  ))}
                </div>
              </div>
              <Badge className="bg-amber-500 shrink-0">
                0/5
              </Badge>
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNavigation />
      <AuthModal />
    </div>
  )
}

export default function FunPage() {
  return (
    <AuthProvider>
      <FunContent />
    </AuthProvider>
  )
}
