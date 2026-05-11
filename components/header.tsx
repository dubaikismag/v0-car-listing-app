'use client'

import { useState } from 'react'
import { Bell, Search, User, Settings } from 'lucide-react'
import { useAppStore } from '@/lib/store'

interface HeaderProps {
  showSearch?: boolean
}

export function Header({ showSearch = true }: HeaderProps) {
  const { setShowAuthModal, isAuthenticated } = useAppStore()
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="gradient-header sticky top-0 z-50">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
            <img 
              src="/logo.png" 
              alt="DubaiKismag" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-xl font-bold">
            <span className="text-white">Dubai</span>
            <span className="text-amber-400">Kismag</span>
          </span>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-2">
          <button className="relative p-2">
            <Bell className="w-6 h-6 text-amber-400 fill-amber-400" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-purple-700" />
          </button>
          
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 rounded-full text-purple-900 text-sm font-semibold">
            <Settings className="w-4 h-4" />
            <span>ADMIN</span>
          </button>

          <button 
            onClick={() => !isAuthenticated && setShowAuthModal(true)}
            className="w-9 h-9 rounded-full bg-teal-500 flex items-center justify-center"
          >
            <User className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-3">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs, cars, property in UAE..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 outline-none text-sm"
            />
            <button className="px-4 py-1.5 bg-amber-400 rounded-lg text-purple-900 font-semibold text-sm">
              Filter
            </button>
          </div>
        </div>
      )}

      {/* Location Bar */}
      <div className="flex items-center justify-between px-4 pb-2 text-white text-sm">
        <div className="flex items-center gap-1">
          <span className="text-red-400">📍</span>
          <span>Dubai, UAE</span>
        </div>
        <button className="text-amber-400 font-medium">Change &rsaquo;</button>
      </div>
    </div>
  )
}
