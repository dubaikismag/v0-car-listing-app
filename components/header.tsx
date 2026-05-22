'use client'

import { useState } from 'react'
import { Search, User, ChevronDown, X, Bell } from 'lucide-react'
import { useAppStore, uaeLocations } from '@/lib/store'

interface HeaderProps {
  showSearch?: boolean
  onSearch?: (query: string) => void
  onFilter?: () => void
}

export function Header({ showSearch = true, onSearch, onFilter }: HeaderProps) {
  const { setShowAuthModal, isAuthenticated, user, selectedLocation, setSelectedLocation, searchQuery, setSearchQuery, isAdmin, notifications, markNotificationRead, clearNotifications } = useAppStore()
  const [showLocationPicker, setShowLocationPicker] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const unreadCount = notifications.filter(n => !n.read).length

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    onSearch?.(value)
  }

  return (
    <div className="gradient-header fixed top-0 left-0 right-0 z-50 w-full">
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
          {/* Gold Bell Icon with Notification Badge */}
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-1.5"
          >
            <div className="w-7 h-7 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                <defs>
                  <linearGradient id="bellGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fcd34d" />
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
                  fillOpacity="0.4"
                />
              </svg>
            </div>
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 min-w-[16px] h-4 flex items-center justify-center px-1 bg-red-500 rounded-full text-[10px] font-bold text-white border border-purple-700">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
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
        <div className="fixed top-[135px] left-4 right-4 bg-white shadow-lg rounded-xl max-h-64 overflow-y-auto z-50">
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

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="fixed top-[50px] right-4 w-80 bg-white rounded-xl shadow-xl max-h-96 overflow-hidden z-50">
          <div className="flex items-center justify-between p-3 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">Notifications</h3>
            <div className="flex items-center gap-2">
              {notifications.length > 0 && (
                <button 
                  onClick={() => {
                    notifications.forEach(n => markNotificationRead(n.id))
                  }}
                  className="text-xs text-purple-600 hover:underline"
                >
                  Mark all as read
                </button>
              )}
              {notifications.length > 0 && (
                <button 
                  onClick={clearNotifications}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  Clear all
                </button>
              )}
              <button onClick={() => setShowNotifications(false)}>
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Bell className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => markNotificationRead(notification.id)}
                  className={`w-full text-left p-3 border-b border-gray-50 hover:bg-gray-50 ${
                    !notification.read ? 'bg-purple-50/50' : ''
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-xl">{notification.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                      <p className="text-xs text-gray-500 truncate">{notification.message}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{notification.time}</p>
                    </div>
                    {!notification.read && (
                      <span className="w-2 h-2 bg-purple-600 rounded-full flex-shrink-0 mt-1" />
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
