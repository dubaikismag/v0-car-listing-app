'use client'

export const dynamic = 'force-dynamic'

import { useState, Suspense } from 'react'
import { Header } from '@/components/header'
import { TopTabs } from '@/components/top-tabs'
import { BottomNavigation } from '@/components/bottom-navigation'
import { useAppStore } from '@/lib/store'
import { Gamepad2, Trophy, Users, Zap, Play, Star } from 'lucide-react'

// 1. Clean Main Entry Point with Suspense Boundary Fix
export default function FunPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f5f3ff] flex items-center justify-center">
        <p className="text-purple-600 font-medium">Loading fun zone...</p>
      </div>
    }>
      <FunContent />
    </Suspense>
  )
}

// 2. The Actual Page Component Logic
function FunContent() {
  const store = useAppStore()
  const isAuthenticated = store?.isAuthenticated || false
  const user = store?.user

  // Sample static game items matching your clean mobile-app style layout
  const games = [
    {
      id: 'g1',
      title: 'Spin & Win',
      description: 'Spin the daily wheel to win points and active tokens.',
      icon: '🎡',
      category: 'Luck',
      plays: '14.2k',
      rating: 4.8
    },
    {
      id: 'g2',
      title: 'Trivia Challenge',
      description: 'Test your knowledge about cars, communities, and tech.',
      icon: '🧠',
      category: 'Quiz',
      plays: '9.5k',
      rating: 4.6
    },
    {
      id: 'g3',
      title: 'Scratch Card',
      description: 'Reveal matching cards to claim exclusive community rewards.',
      icon: '🎫',
      category: 'Rewards',
      plays: '22.1k',
      rating: 4.9
    }
  ]

  return (
    <div className="min-h-screen bg-[#f5f3ff] pb-20">
      <Header />
      <TopTabs />

      <main className="px-4 pt-[160px] pb-4">
        {/* Banner Section */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-5 text-white mb-6 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Gamepad2 className="w-6 h-6" /> Fun Zone
            </h2>
            <span className="bg-white/20 text-xs px-2 py-1 rounded-full font-medium backdrop-blur-sm">
              ⚡ Live Rewards
            </span>
          </div>
          <p className="text-purple-100 text-sm mb-4">
            Play quick mini-games, compete with other users, and collect points.
          </p>
          <div className="bg-white/10 rounded-xl p-3 flex justify-between items-center backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm">
              <Trophy className="w-4 h-4 text-amber-300" />
              <span>Your Points: <strong>{user?.points || 0} pts</strong></span>
            </div>
            <button className="text-xs bg-white text-purple-600 font-bold px-3 py-1.5 rounded-lg hover:bg-purple-50 transition-colors">
              Leaderboard
            </button>
          </div>
        </div>

        {/* Section Title */}
        <h3 className="font-bold text-gray-900 text-lg mb-3 flex items-center gap-2">
          <span>🎮</span> Popular Mini-Games
        </h3>

        {/* Games List Container */}
        <div className="space-y-4">
          {games.map((game) => (
            <div 
              key={game.id} 
              className="bg-white rounded-2xl p-4 border border-purple-100 shadow-sm flex gap-4 hover:border-purple-300 transition-all"
            >
              <div className="w-16 h-16 bg-purple-50 rounded-xl flex items-center justify-center text-3xl shadow-inner shrink-0">
                {game.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                    {game.category}
                  </span>
                  <div className="flex items-center text-xs text-amber-500 gap-0.5 ml-auto">
                    <Star className="w-3 h-3 fill-amber-500" />
                    <span className="font-semibold text-gray-700">{game.rating}</span>
                  </div>
                </div>
                
                <h4 className="font-bold text-gray-900 text-base mb-1 truncate">{game.title}</h4>
                <p className="text-gray-500 text-xs line-clamp-2 mb-3 leading-relaxed">{game.description}</p>
                
                <div className="flex items-center justify-between pt-1 border-t border-gray-50">
                  <span className="text-[11px] text-gray-400 flex items-center gap-1">
                    <Users className="w-3 h-3" /> {game.plays} plays today
                  </span>
                  <button 
                    onClick={() => alert(`Launching ${game.title}! Let's play!`)}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-1.5 rounded-xl flex items-center gap-1 shadow-sm transition-colors"
                  >
                    <Play className="w-3 h-3 fill-white" /> Play
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <BottomNavigation />
    </div>
  )
}
