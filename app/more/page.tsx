'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { TopTabs } from '@/components/top-tabs'
import { BottomNavigation } from '@/components/bottom-navigation'
import { AuthModal } from '@/components/auth-modal'
import { useAppStore, ADMIN_EMAIL } from '@/lib/store'
import { ChevronRight, X, Camera, ArrowLeft, Edit2 } from 'lucide-react'

export default function MorePage() {
  const { user, isAuthenticated, coins, setShowAuthModal, setUser, isAdmin } = useAppStore()
  const [showVIP, setShowVIP] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [selectedVIP, setSelectedVIP] = useState('pro')
  const [profilePicture, setProfilePicture] = useState<string | null>(user?.profilePicture || null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Edit profile state
  const [editName, setEditName] = useState(user?.name || 'Guest User')
  const [editPhone, setEditPhone] = useState(user?.phone || '')
  const [editLocation, setEditLocation] = useState(user?.location || 'Dubai, UAE')

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setProfilePicture(result)
        if (user) {
          setUser({ ...user, profilePicture: result })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = () => {
    if (user) {
      setUser({
        ...user,
        name: editName,
        phone: editPhone,
        location: editLocation,
        profilePicture: profilePicture || undefined
      })
    }
    setShowEditProfile(false)
  }

  // Account Section
  const accountItems = [
    { emoji: '👤', label: 'Profile', href: '/profile' },
    { emoji: '📢', label: 'My Ads', href: '/my-listings' },
    { emoji: '❤️', label: 'Saved Ads', href: '/saved' },
    { emoji: '💬', label: 'Messages', href: '/messages' },
    { emoji: '💳', label: 'Wallet / Credits', href: '/rewards' },
    { emoji: '⭐', label: 'My Boosted Ads', href: '/boosted' },
  ]

  // Extra Categories
  const extraCategories = [
    { emoji: '📱', label: 'Electronics', href: '/browse?category=Buy & Sell' },
    { emoji: '🛋', label: 'Furniture', href: '/browse?category=Buy & Sell' },
    { emoji: '🏖', label: 'Vacation Rentals', href: '/browse?category=Rooms' },
    { emoji: '💼', label: 'Business Services', href: '/browse?category=Services' },
    { emoji: '🐾', label: 'Pets', href: '/browse?category=Buy & Sell' },
    { emoji: '🎓', label: 'Education', href: '/browse?category=Services' },
  ]

  // Rewards & Community
  const rewardsItems = [
    { emoji: '🎁', label: 'Daily Rewards', href: '/fun' },
    { emoji: '🏆', label: 'Leaderboard', href: '/fun' },
    { emoji: '🤝', label: 'Refer & Earn', href: '/referral' },
    { emoji: '🎯', label: 'Challenges', href: '/fun' },
  ]

  // Settings & Support
  const settingsItems = [
    { emoji: '🌐', label: 'Language', href: '/language' },
    { emoji: '🌙', label: 'Dark Mode', href: '#', isToggle: true },
    { emoji: '🔔', label: 'Notifications', href: '/notifications' },
    { emoji: '⚙', label: 'Settings', href: '/settings' },
    { emoji: '❓', label: 'Help Center', href: '/help' },
    { emoji: '📞', label: 'Contact Us', href: '/contact' },
    { emoji: '🛡', label: 'Safety Tips', href: '/safety' },
    ...(isAdmin() ? [{ emoji: '⚙️', label: 'Admin Panel', badge: 'ADMIN', href: '/admin' }] : []),
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
    <div className="min-h-screen bg-[#f5f3ff] pb-20">
      <Header />
      <TopTabs />

      <main className="pt-[192px]">
        {/* Profile Header */}
        <div className="gradient-purple px-4 py-8 text-center relative">
          {/* Edit Profile Button */}
          <button
            onClick={() => setShowEditProfile(true)}
            className="absolute top-4 right-4 p-2 bg-white/20 rounded-full"
          >
            <Edit2 className="w-5 h-5 text-white" />
          </button>

          <div 
            className="w-24 h-24 mx-auto rounded-full bg-purple-400/50 flex items-center justify-center mb-4 border-4 border-purple-300/50 relative overflow-hidden cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {profilePicture ? (
              <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-5xl text-purple-200">👤</span>
            )}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleProfilePictureChange}
            className="hidden"
          />

          <h2 className="text-2xl font-bold text-white mb-1">
            {isAuthenticated && user ? user.name : 'Guest User'}
          </h2>
          <p className="text-purple-200 flex items-center justify-center gap-2 mb-3">
            <span>📍</span> {user?.location || 'Dubai, UAE'} - Member since {user?.memberSince || '2024'}
          </p>
          <span className="inline-flex items-center gap-1 px-4 py-1.5 bg-green-500/20 text-green-300 rounded-full text-sm font-medium">
            <span>✓</span> {user?.verified ? 'Verified User' : 'Regular User'}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 px-4 py-4 bg-purple-700 text-center">
          <div>
            <p className="text-2xl font-bold text-purple-200">{user?.activeAds || 0}</p>
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
              {user?.rating || 0} <span className="text-lg">⭐</span>
            </p>
            <p className="text-xs text-purple-300">Rating</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-200">{user?.sold || 0}</p>
            <p className="text-xs text-purple-300">Sold</p>
          </div>
        </div>

        {/* Account Section */}
        <div className="px-4 py-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-1">Account</h3>
          <div className="space-y-2">
            {accountItems.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="flex items-center gap-4 p-3 bg-white rounded-xl border border-gray-100"
              >
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-lg">{item.emoji}</span>
                </div>
                <span className="flex-1 font-medium text-gray-900 text-sm">{item.label}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Link>
            ))}
          </div>
        </div>

        {/* Rewards & Community */}
        <div className="px-4 pb-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-1">Rewards & Community</h3>
          <div className="space-y-2">
            {rewardsItems.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="flex items-center gap-4 p-3 bg-white rounded-xl border border-gray-100"
              >
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-lg">{item.emoji}</span>
                </div>
                <span className="flex-1 font-medium text-gray-900 text-sm">{item.label}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Link>
            ))}
          </div>
        </div>

        {/* Extra Categories */}
        <div className="px-4 pb-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-1">Extra Categories</h3>
          <div className="grid grid-cols-3 gap-2">
            {extraCategories.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="flex flex-col items-center gap-1 p-3 bg-white rounded-xl border border-gray-100"
              >
                <span className="text-2xl">{item.emoji}</span>
                <span className="text-xs font-medium text-gray-700 text-center">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Settings & Support */}
        <div className="px-4 pb-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-1">Settings & Support</h3>
          <div className="space-y-2">
            {settingsItems.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                onClick={(e) => {
                  if (item.isLogout) {
                    e.preventDefault()
                    setUser(null)
                  }
                }}
                className="flex items-center gap-4 p-3 bg-white rounded-xl border border-gray-100"
              >
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-lg">{item.emoji}</span>
                </div>
                <span className="flex-1 font-medium text-gray-900 text-sm">{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 bg-purple-600 text-white text-xs font-bold rounded">
                    {item.badge}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Link>
            ))}
          </div>
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

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50">
          <div className="w-full max-w-lg bg-white rounded-t-3xl max-h-[90vh] overflow-auto">
            {/* Header with back button */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
              <button onClick={() => setShowEditProfile(false)} className="p-2">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h2 className="text-lg font-bold text-gray-900">Edit Profile</h2>
              <button onClick={() => setShowEditProfile(false)} className="p-2">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="px-5 pb-8 pt-4">
              {/* Profile Picture */}
              <div className="flex justify-center mb-6">
                <div 
                  className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center border-4 border-purple-200 relative overflow-hidden cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {profilePicture ? (
                    <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-5xl">👤</span>
                  )}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400"
                    placeholder="+971 50 123 4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400"
                    placeholder="Dubai, UAE"
                  />
                </div>
              </div>

              <button 
                onClick={handleSaveProfile}
                className="w-full py-4 bg-purple-600 text-white font-bold rounded-xl mt-6"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIP Modal */}
      {showVIP && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50">
          <div className="w-full max-w-lg bg-white rounded-t-3xl max-h-[90vh] overflow-auto">
            {/* Close button */}
            <div className="flex items-center justify-between px-4 py-3">
              <div className="w-8" />
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
              <button onClick={() => setShowVIP(false)} className="p-2">
                <X className="w-5 h-5 text-gray-400" />
              </button>
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
