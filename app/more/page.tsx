'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { TopTabs } from '@/components/top-tabs'
import { BottomNavigation } from '@/components/bottom-navigation'
import { AuthModal } from '@/components/auth-modal'
import { useAppStore } from '@/lib/store'
import { ChevronRight, X } from 'lucide-react'

export default function MorePage() {
  const { user, isAuthenticated, coins, setShowAuthModal } = useAppStore()
  const [showVIP, setShowVIP] = useState(false)
  const [selectedVIP, setSelectedVIP] = useState('pro')

  const menuItems = [
    { emoji: '📋', label: 'My Listings', href: '/my-listings' },
    { emoji: '📌', label: 'Saved Ads', href: '/saved' },
    { emoji: '💬', label: 'Messages', href: '/messages' },
    { emoji: '🪙', label: 'Coins & Rewards', href: '/rewards' },
    { emoji: '🎮', label: 'Fun Zone', href: '/fun' },
    { emoji: '🌍', label: 'My Communities', href: '/communities' },
    { emoji: '⚙️', label: 'Admin Panel', badge: 'ADMIN', href: '/admin' },
    { emoji: '🌐', label: 'Language / لغة', href: '/language' },
    { emoji: '🚪', label: 'Log Out', href: '#', isLogout: true },
  ]

  const vipPlans = [
    { id: 'basic', name: 'BASIC', price: 25, duration: '1 Month' },
    { id: 'pro', name: 'PRO', price: 60, duration: '3 Months', popular: true },
    { id: 'elite', name: 'ELITE', price: 150, duration: '1 Year', icon: '💎' },
  ]

  const vipBenefits = [
    'Gold VIP badge on all listings',
    'Top placement in search results',
    'Verified tick on profile',
    '10x more views & WhatsApp clicks',
    'Unlimited free ads posting',
    'Priority customer support',
  ]

  return (
    <div className="min-h-screen bg-[#f8f7fc] pb-20">
      <Header />
      <TopTabs />

      <main>
        {/* Profile Header */}
        <div className="gradient-purple px-4 py-8 text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-purple-400/50 flex items-center justify-center mb-4 border-4 border-purple-300/50">
            <span className="text-5xl text-purple-200">👤</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">
            {isAuthenticated && user ? user.name : 'Mohammed Al Rashid'}
          </h2>
          <p className="text-purple-200 flex items-center justify-center gap-2 mb-3">
            <span>📍</span> Dubai, UAE - Member since 2024
          </p>
          <span className="inline-flex items-center gap-1 px-4 py-1.5 bg-green-500/20 text-green-300 rounded-full text-sm font-medium">
            <span>✓</span> Verified User
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 px-4 py-4 bg-purple-700 text-center">
          <div>
            <p className="text-2xl font-bold text-purple-200">12</p>
            <p className="text-xs text-purple-300">Active Ads</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-2xl font-bold text-purple-200 flex items-center gap-1">
              <span className="text-lg">🪙</span> {coins}
            </p>
            <p className="text-xs text-purple-300">Coins</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-amber-400 flex items-center justify-center gap-0.5">
              4.9 <span className="text-lg">⭐</span>
            </p>
            <p className="text-xs text-purple-300">Rating</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-200">86</p>
            <p className="text-xs text-purple-300">Sold</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="px-4 py-4 space-y-2">
          {menuItems.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              onClick={(e) => {
                if (item.isLogout) {
                  e.preventDefault()
                  // Handle logout
                }
              }}
              className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-xl">{item.emoji}</span>
              </div>
              <span className="flex-1 font-medium text-gray-900">{item.label}</span>
              {item.badge && (
                <span className="px-2 py-0.5 bg-purple-600 text-white text-xs font-bold rounded">
                  {item.badge}
                </span>
              )}
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
          ))}
        </div>

        {/* Go VIP Button */}
        <div className="px-4 pb-4">
          <button
            onClick={() => setShowVIP(true)}
            className="w-full p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">👑</span>
              <div className="text-left">
                <p className="font-bold text-gray-900">Go VIP - Get 10x More Views</p>
                <p className="text-sm text-gray-600">Featured badge - Priority listing - Verified tick</p>
              </div>
            </div>
            <span className="px-4 py-2 bg-amber-400 rounded-lg text-purple-900 font-semibold text-sm">
              Upgrade
            </span>
          </button>
        </div>
      </main>

      {/* VIP Modal */}
      {showVIP && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50">
          <div className="w-full max-w-lg bg-white rounded-t-3xl max-h-[90vh] overflow-auto">
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>
            <div className="px-5 pb-8">
              <div className="text-center mb-6">
                <span className="text-5xl block mb-2">👑</span>
                <h2 className="text-2xl font-bold text-gray-900">Go VIP</h2>
                <p className="text-gray-500">Get verified, stand out, sell faster</p>
              </div>

              {/* VIP Plans */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {vipPlans.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedVIP(plan.id)}
                    className={`p-4 rounded-xl border-2 text-center transition-colors ${
                      selectedVIP === plan.id
                        ? 'border-amber-400 bg-amber-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <p className="text-xs text-gray-500 font-medium mb-1 flex items-center justify-center gap-1">
                      {plan.icon && <span>{plan.icon}</span>}
                      {plan.popular && <span className="text-amber-500">⭐</span>}
                      {plan.name}
                    </p>
                    <p className="text-2xl font-bold text-purple-600">AED {plan.price}</p>
                    <p className="text-xs text-gray-400">{plan.duration}</p>
                  </button>
                ))}
              </div>

              {/* Benefits */}
              <div className="space-y-3 mb-6">
                {vipBenefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-green-500 text-lg">✅</span>
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Payment */}
              <p className="text-sm text-gray-500 mb-3">Pay via UPI / QR / Bank Transfer</p>
              <div className="border-2 border-dashed border-purple-200 rounded-xl p-6 text-center bg-purple-50 mb-4">
                <span className="text-3xl block mb-2">📸</span>
                <p className="text-gray-600 text-sm">Upload payment screenshot for activation</p>
              </div>

              <button className="w-full py-4 bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl text-purple-900 font-bold text-lg flex items-center justify-center gap-2">
                <span>👑</span> Activate VIP Now
              </button>
              
              <button
                onClick={() => setShowVIP(false)}
                className="w-full py-3 mt-3 text-gray-500 font-medium"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNavigation />
      <AuthModal />
    </div>
  )
}
