'use client'

export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import { Header } from '@/components/header'
import { BottomNavigation } from '@/components/bottom-navigation'
import { useAppStore } from '@/lib/store'
import { 
  User, 
  Settings, 
  HelpCircle, 
  Shield, 
  LogOut, 
  ChevronRight, 
  Bell, 
  Moon,
  Car
} from 'lucide-react'

// 1. This main entry point wraps everything in Suspense to fix the build error
export default function MorePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f5f3ff] flex items-center justify-center">
        <p className="text-purple-600 font-medium">Loading settings...</p>
      </div>
    }>
      <MoreContent />
    </Suspense>
  )
}

// 2. This function contains your original UI logic
function MoreContent() {
  const store = useAppStore()
  const user = store?.user
  const logout = store?.logout || (() => {})

  const menuItems = [
    { icon: <User className="w-5 h-5" />, label: 'My Profile', color: 'text-blue-600' },
    { icon: <Car className="w-5 h-5" />, label: 'My Listings', color: 'text-green-600' },
    { icon: <Bell className="w-5 h-5" />, label: 'Notifications', color: 'text-amber-600' },
    { icon: <Moon className="w-5 h-5" />, label: 'Dark Mode', color: 'text-purple-600', isToggle: true },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', color: 'text-gray-600' },
    { icon: <HelpCircle className="w-5 h-5" />, label: 'Help & Support', color: 'text-indigo-600' },
    { icon: <Shield className="w-5 h-5" />, label: 'Privacy Policy', color: 'text-teal-600' },
  ]

  return (
    <div className="min-h-screen bg-[#f5f3ff] pb-20">
      <Header />
      
      <main className="px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">More</h1>

        {/* User Profile Card */}
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-purple-100 flex items-center gap-4">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-xl">
            {user?.name?.[0] || 'G'}
          </div>
          <div>
            <h2 className="font-bold text-lg text-gray-900">{user?.name || 'Guest User'}</h2>
            <p className="text-gray-500 text-sm">{user?.email || 'Sign in to manage your account'}</p>
          </div>
        </div>

        {/* Settings Menu */}
        <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden mb-6">
          {menuItems.map((item, index) => (
            <button 
              key={index}
              className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`${item.color}`}>{item.icon}</div>
                <span className="font-medium text-gray-700">{item.label}</span>
              </div>
              {item.isToggle ? (
                <div className="w-10 h-5 bg-gray-200 rounded-full relative">
                  <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                </div>
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-300" />
              )}
            </button>
          ))}
        </div>

        {/* Logout Button */}
        <button 
          onClick={logout}
          className="w-full bg-white rounded-2xl p-4 shadow-sm border border-red-100 flex items-center justify-center gap-2 text-red-600 font-bold hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </main>

      <BottomNavigation />
    </div>
  )
}
