'use client'

import { useState } from 'react'
import { Search, User, ChevronDown } from 'lucide-react'
import { useAppStore, uaeLocations } from '@/lib/store'

interface HeaderProps {
  showSearch?: boolean
  onSearch?: (query: string) => void
  onFilter?: () => void
}

export function Header({ showSearch = true, onSearch, onFilter }: HeaderProps) {
  const { setShowAuthModal, isAuthenticated, user, selectedLocation, setSelectedLocation, searchQuery, setSearchQuery, isAdmin } = useAppStore()
  const [showLocationPicker, setShowLocationPicker] = useState(false)

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    onSearch?.(value)
  }

  return (
    <div className="gradient-header sticky top-0 z-50">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2.5">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center overflow-hidden border-2 border-amber-400/50">
            <img 
              src="/logo.png" 
              alt="DubaiKismag" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-lg font-bold">
            <span className="text-white">Dubai</span>
            <span className="text-amber-400">Kismag</span>
          </span>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-2">
          {/* Gold Bell Icon */}
          <button className="relative p-1.5">
            <div className="w-7 h-7 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                <defs>
                  <linearGradient id="bellGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                </defs>
                <path 
                  d="M18 8A6 6 0 1 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" 
                  stroke="url(#bellGradient)" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  fill="url(#bellGradient)"
                  fillOpacity="0.3"
                />
              </svg>
            </div>
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full border border-purple-700" />
          </button>
          
          {/* Admin badge - only for admin users */}
          {isAdmin() && (
            <button className="flex items-center gap-1 px-2.5 py-1 bg-amber-400 rounded-full text-purple-900 text-xs font-semibold">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              <span>ADMIN</span>
            </button>
          )}

          {/* User button with name or icon */}
          <button 
            onClick={() => !isAuthenticated && setShowAuthModal(true)}
            className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center overflow-hidden"
          >
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-4 h-4 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Search Bar - reduced height */}
      {showSearch && (
        <div className="px-4 pb-2">
          <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow-sm">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search jobs, cars, property in UAE..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 outline-none text-sm"
            />
            <button 
              onClick={onFilter}
              className="px-3 py-1 bg-amber-400 rounded-lg text-purple-900 font-semibold text-xs"
            >
              Filter
            </button>
          </div>
        </div>
      )}

      {/* Location Bar - with subtle shadow separation */}
      <div className="flex items-center justify-between px-4 py-1.5 text-white text-sm bg-gradient-to-b from-transparent to-purple-900/20">
        <button 
          onClick={() => setShowLocationPicker(!showLocationPicker)}
          className="flex items-center gap-1"
        >
          <span className="text-red-400">📍</span>
          <span className="text-sm">{selectedLocation}</span>
          <ChevronDown className="w-3 h-3 text-white/70" />
        </button>
        <button 
          onClick={() => setShowLocationPicker(!showLocationPicker)}
          className="text-amber-400 font-medium text-sm"
        >
          Change &rsaquo;
        </button>
      </div>

      {/* Location Picker Dropdown */}
      {showLocationPicker && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg max-h-64 overflow-y-auto z-50">
          <div className="p-2">
            <button
              onClick={() => {
                setSelectedLocation('Dubai, UAE')
                setShowLocationPicker(false)
              }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-purple-50 rounded-lg text-gray-800"
            >
              📍 All Dubai, UAE
            </button>
            {uaeLocations.map((loc) => (
              <button
                key={loc}
                onClick={() => {
                  setSelectedLocation(loc)
                  setShowLocationPicker(false)
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-purple-50 rounded-lg text-gray-800"
              >
                📍 {loc}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
