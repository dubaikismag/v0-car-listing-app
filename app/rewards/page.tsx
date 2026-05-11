'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { BottomNavigation } from '@/components/bottom-navigation'
import { useAppStore } from '@/lib/store'
import { ArrowLeft, Gift, Star, Zap, Trophy, ChevronRight } from 'lucide-react'

const earnMethods = [
  { icon: '📝', title: 'Post an Ad', coins: 10, description: 'Earn coins for each new listing' },
  { icon: '🔗', title: 'Share App', coins: 20, description: 'Invite friends and earn rewards' },
  { icon: '⭐', title: 'Rate Us', coins: 15, description: 'Leave a review on app store' },
  { icon: '📸', title: 'Complete Profile', coins: 25, description: 'Add photo and verify phone' },
  { icon: '🎮', title: 'Play Games', coins: 5, description: 'Win coins in Fun Zone' },
  { icon: '👁️', title: 'Daily Login', coins: 2, description: 'Login daily for bonus coins' }
]

const redeemOptions = [
  { icon: '🚀', title: 'Boost Listing', coins: 50, description: 'Get 3x more views for 24 hours' },
  { icon: '⭐', title: 'Featured Ad', coins: 100, description: 'Appear in Featured section' },
  { icon: '✅', title: 'Verified Badge', coins: 200, description: 'Get verified tick on profile' },
  { icon: '👑', title: 'VIP for 1 Week', coins: 500, description: 'All premium benefits' }
]

const history = [
  { type: 'earn', title: 'Posted a new ad', coins: 10, date: 'Today' },
  { type: 'earn', title: 'Daily login bonus', coins: 2, date: 'Today' },
  { type: 'spend', title: 'Boosted listing', coins: -50, date: 'Yesterday' },
  { type: 'earn', title: 'Played Spin & Win', coins: 25, date: '2 days ago' }
]

export default function RewardsPage() {
  const { coins, addCoins, isAuthenticated, setShowAuthModal } = useAppStore()
  const [activeTab, setActiveTab] = useState<'earn' | 'redeem' | 'history'>('earn')
  const [showSuccess, setShowSuccess] = useState(false)

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f5f3ff] pb-20">
        <Header />
        <main className="px-4 py-8">
          <div className="text-center py-12">
            <span className="text-5xl block mb-4">🔐</span>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Login Required</h2>
            <p className="text-gray-500 mb-6">Please login to access rewards</p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-8 py-3 bg-purple-600 text-white rounded-xl font-semibold"
            >
              Login / Sign Up
            </button>
          </div>
        </main>
        <BottomNavigation />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5f3ff] pb-20">
      {/* Header */}
      <div className="gradient-purple px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/more" className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <h1 className="text-lg font-bold text-white">Coins & Rewards</h1>
        </div>

        {/* Coin Balance */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
          <p className="text-purple-200 text-sm mb-2">Your Balance</p>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-4xl">🪙</span>
            <span className="text-5xl font-bold text-white">{coins}</span>
          </div>
          <p className="text-purple-200 text-sm">Coins</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white px-4 py-2 flex gap-2 border-b border-gray-100 sticky top-0 z-10">
        {[
          { id: 'earn', label: 'Earn Coins', icon: Zap },
          { id: 'redeem', label: 'Redeem', icon: Gift },
          { id: 'history', label: 'History', icon: Trophy }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-purple-100/80 text-purple-700 backdrop-blur-sm'
                : 'text-gray-500'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <main className="px-4 py-4">
        {activeTab === 'earn' && (
          <div className="space-y-3">
            {earnMethods.map((method, i) => (
              <button
                key={i}
                onClick={() => {
                  addCoins(method.coins)
                  setShowSuccess(true)
                  setTimeout(() => setShowSuccess(false), 2000)
                }}
                className="w-full flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-2xl">
                  {method.icon}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-gray-900">{method.title}</h3>
                  <p className="text-sm text-gray-500">{method.description}</p>
                </div>
                <div className="flex items-center gap-1 text-amber-600 font-bold">
                  +{method.coins} 🪙
                </div>
              </button>
            ))}
          </div>
        )}

        {activeTab === 'redeem' && (
          <div className="space-y-3">
            {redeemOptions.map((option, i) => (
              <button
                key={i}
                disabled={coins < option.coins}
                className={`w-full flex items-center gap-4 p-4 bg-white rounded-xl border ${
                  coins >= option.coins ? 'border-gray-100' : 'border-gray-100 opacity-50'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-2xl">
                  {option.icon}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-gray-900">{option.title}</h3>
                  <p className="text-sm text-gray-500">{option.description}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-purple-600 font-bold mb-1">
                    {option.coins} 🪙
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    coins >= option.coins
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {coins >= option.coins ? 'Redeem' : 'Need more'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3">
            {history.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  item.type === 'earn' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {item.type === 'earn' ? '⬆️' : '⬇️'}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.title}</h3>
                  <p className="text-xs text-gray-500">{item.date}</p>
                </div>
                <span className={`font-bold ${
                  item.type === 'earn' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {item.coins > 0 ? '+' : ''}{item.coins} 🪙
                </span>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg z-[100] animate-bounce">
          Coins added! 🎉
        </div>
      )}

      <BottomNavigation />
    </div>
  )
}
