'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { TopTabs } from '@/components/top-tabs'
import { BottomNavigation } from '@/components/bottom-navigation'
import { AuthModal } from '@/components/auth-modal'
import { ArrowLeft, X } from 'lucide-react'

// Sample reels data
const sampleReels = [
  { id: '1', title: 'Quick Room Tour - JBR', emoji: '🏠', views: '12K', user: 'Ahmed R.' },
  { id: '2', title: 'Toyota Camry Review', emoji: '🚗', views: '8K', user: 'Ravi K.' },
  { id: '3', title: 'Best Electronics Deals', emoji: '📱', views: '5K', user: 'Sara M.' },
  { id: '4', title: 'Farm Fresh Produce', emoji: '🌾', views: '3K', user: 'Hassan A.' },
  { id: '5', title: 'Job Tips in UAE', emoji: '💼', views: '15K', user: 'Mohammed S.' },
  { id: '6', title: 'Furniture Shopping Guide', emoji: '🛋️', views: '7K', user: 'Fatima J.' },
]

export default function ReelsPage() {
  const router = useRouter()
  const [selectedReel, setSelectedReel] = useState<typeof sampleReels[0] | null>(null)

  return (
    <div className="min-h-screen bg-[#f5f3ff] pb-20">
      <Header />
      <TopTabs />

      <main className="px-4 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>🎬</span> Reels
          </h2>
          <span className="text-purple-600 text-sm font-medium">Coming Soon!</span>
        </div>

        <p className="text-gray-500 text-sm mb-6">Short videos showcasing products and services in UAE</p>

        {/* Reels Grid */}
        <div className="grid grid-cols-2 gap-3">
          {sampleReels.map((reel) => (
            <button
              key={reel.id}
              onClick={() => setSelectedReel(reel)}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden text-left"
            >
              <div className="aspect-[9/16] bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center relative">
                <span className="text-6xl">{reel.emoji}</span>
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-gray-900 font-medium text-sm truncate">{reel.title}</p>
                  <p className="text-gray-500 text-xs">{reel.views} views</p>
                </div>
                <div className="absolute top-2 right-2 bg-black/50 px-2 py-1 rounded text-white text-xs">
                  🎬
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Coming Soon Banner */}
        <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-xl text-center">
          <span className="text-4xl block mb-2">🎥</span>
          <h3 className="font-bold text-purple-900 mb-1">Video Reels Coming Soon!</h3>
          <p className="text-purple-700 text-sm">Upload short videos of your products and services to get more views</p>
        </div>
      </main>

      {/* Reel Preview Modal */}
      {selectedReel && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4">
          <div className="relative w-full max-w-sm">
            {/* Close Button */}
            <button
              onClick={() => setSelectedReel(null)}
              className="absolute top-4 right-4 p-2 bg-white/20 rounded-full z-10"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Reel Content */}
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-3xl aspect-[9/16] flex flex-col items-center justify-center p-6">
              <span className="text-8xl mb-6">{selectedReel.emoji}</span>
              <h3 className="text-white text-xl font-bold text-center mb-2">{selectedReel.title}</h3>
              <p className="text-purple-200 text-sm mb-4">by {selectedReel.user}</p>
              <p className="text-purple-300 text-sm">{selectedReel.views} views</p>
              
              <div className="mt-8 text-center">
                <span className="text-4xl block mb-2">🎬</span>
                <p className="text-purple-200 text-sm">Video feature coming soon!</p>
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
