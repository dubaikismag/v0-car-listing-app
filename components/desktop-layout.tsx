'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { Home, Search, Plus, Gamepad2, User, Bookmark, MessageCircle, Gift, Globe, LogOut, Settings, Users, HelpCircle, Crown } from 'lucide-react'

const sidebarItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/browse', label: 'Browse', icon: Search },
  { href: '/post', label: 'Post Ad', icon: Plus, highlight: true },
  { href: '/fun', label: 'Fun Zone', icon: Gamepad2 },
  { href: '/groups', label: 'Communities', icon: Users },
  { href: '/wanted', label: 'Wanted', icon: HelpCircle },
]

const accountItems = [
  { href: '/my-listings', label: 'My Listings', icon: User },
  { href: '/saved', label: 'Saved Ads', icon: Bookmark },
  { href: '/messages', label: 'Messages', icon: MessageCircle },
  { href: '/rewards', label: 'Coins & Rewards', icon: Gift },
  { href: '/communities', label: 'My Communities', icon: Globe },
]

export function DesktopSidebar() {
  const pathname = usePathname()
  const { user, isAuthenticated, setShowAuthModal, logout, isAdmin } = useAppStore()

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center overflow-hidden border-2 border-amber-400">
            <img 
              src="/logo.png" 
              alt="DubaiKismag" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-xl font-bold">
            <span className="text-purple-700">Dubai</span>
            <span className="text-amber-500">Kismag</span>
          </span>
        </Link>
      </div>

      {/* User Section */}
      <div className="p-4 border-b border-gray-100">
        {isAuthenticated && user ? (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center overflow-hidden">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500">{user.coins || 0} coins</p>
            </div>
            {isAdmin() && (
              <span className="px-2 py-0.5 bg-amber-400 rounded text-xs font-bold text-purple-900">
                ADMIN
              </span>
            )}
          </div>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
          >
            Sign In / Register
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href === '/browse' && pathname.startsWith('/browse'))
            const Icon = item.icon
            
            if (item.highlight) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              )
            }
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-purple-100/80 text-purple-700 font-semibold' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-purple-700' : 'text-gray-500'}`} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Account Section */}
        {isAuthenticated && (
          <>
            <div className="mt-6 mb-2">
              <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Account</p>
            </div>
            <div className="space-y-1">
              {accountItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors ${
                      isActive 
                        ? 'bg-purple-100/80 text-purple-700 font-semibold' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-purple-700' : 'text-gray-500'}`} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </>
        )}
      </nav>

      {/* VIP Banner */}
      <div className="p-4 border-t border-gray-100">
        <Link
          href="/more"
          className="block p-4 bg-gradient-to-r from-amber-100 to-amber-50 rounded-xl border border-amber-200"
        >
          <div className="flex items-center gap-3">
            <Crown className="w-8 h-8 text-amber-500" />
            <div>
              <p className="font-bold text-gray-900 text-sm">Go VIP</p>
              <p className="text-xs text-gray-600">Get 10x more views</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Logout */}
      {isAuthenticated && (
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2.5 w-full text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5 text-gray-500" />
            <span>Log Out</span>
          </button>
        </div>
      )}
    </aside>
  )
}

export function DesktopRightSidebar() {
  const { listings } = useAppStore()
  const featuredListings = listings.filter(l => l.badge === 'HOT').slice(0, 3)

  return (
    <aside className="hidden xl:block w-72 bg-white border-l border-gray-200 h-screen sticky top-0 overflow-y-auto">
      {/* Quick Stats */}
      <div className="p-6 border-b border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4">Marketplace Stats</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-purple-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-purple-700">48K+</p>
            <p className="text-xs text-gray-600">Listings</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-amber-600">12K+</p>
            <p className="text-xs text-gray-600">Members</p>
          </div>
          <div className="bg-green-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-green-600">180+</p>
            <p className="text-xs text-gray-600">Countries</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-blue-600">98%</p>
            <p className="text-xs text-gray-600">Verified</p>
          </div>
        </div>
      </div>

      {/* Hot Listings */}
      <div className="p-6 border-b border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-lg">🔥</span> Hot Deals
        </h3>
        <div className="space-y-3">
          {featuredListings.map((listing) => (
            <Link
              key={listing.id}
              href={`/listing/${listing.id}`}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <span className="text-3xl">{listing.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">{listing.title}</p>
                <p className="text-purple-600 font-bold text-sm">
                  AED {listing.price.toLocaleString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="p-6">
        <h3 className="font-bold text-gray-900 mb-4">Quick Links</h3>
        <div className="space-y-2">
          <Link href="/browse?category=Vehicles" className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600">
            <span>🚗</span> Vehicles
          </Link>
          <Link href="/browse?category=Property" className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600">
            <span>🏠</span> Property
          </Link>
          <Link href="/browse?category=Jobs" className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600">
            <span>💼</span> Jobs
          </Link>
          <Link href="/browse?category=Electronics" className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600">
            <span>📱</span> Electronics
          </Link>
          <Link href="/browse?category=Labour" className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600">
            <span>👷</span> Labour
          </Link>
        </div>
      </div>

      {/* App Download */}
      <div className="p-6 border-t border-gray-100">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-4 text-white text-center">
          <p className="font-bold mb-1">Download App</p>
          <p className="text-xs text-purple-200 mb-3">Get the best experience</p>
          <div className="flex gap-2 justify-center">
            <button className="px-3 py-1.5 bg-white/20 rounded-lg text-xs font-medium hover:bg-white/30 transition-colors">
              iOS
            </button>
            <button className="px-3 py-1.5 bg-white/20 rounded-lg text-xs font-medium hover:bg-white/30 transition-colors">
              Android
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
