'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Plus, Menu, Search } from 'lucide-react'

const navItems = [
  { href: '/', label: 'Home', emoji: '🏠' },
  { href: '/browse', label: 'Browse', icon: 'search' },
  { href: '/post', label: '', isCenter: true },
  { href: '/fun', label: 'Fun', emoji: '🎮' },
  { href: '/more', label: 'More', icon: 'menu' }
]

export function BottomNavigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-lg">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href === '/browse' && pathname.startsWith('/browse')) ||
            (item.href === '/more' && pathname.startsWith('/more'))
          
          if (item.isCenter) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative -mt-5"
              >
                <div className="w-14 h-14 rounded-full bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-300">
                  <Plus className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
              </Link>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[60px] py-1 transition-colors ${
                isActive ? 'text-purple-700' : 'text-purple-500'
              }`}
            >
              {item.icon === 'search' ? (
                <Search className={`w-6 h-6 ${isActive ? 'text-purple-700' : 'text-purple-500'}`} />
              ) : item.icon === 'menu' ? (
                <div className="flex flex-col gap-1">
                  <div className={`w-5 h-0.5 rounded ${isActive ? 'bg-purple-700' : 'bg-purple-500'}`} />
                  <div className={`w-5 h-0.5 rounded ${isActive ? 'bg-purple-700' : 'bg-purple-500'}`} />
                  <div className={`w-5 h-0.5 rounded ${isActive ? 'bg-purple-700' : 'bg-purple-500'}`} />
                </div>
              ) : (
                <span className="text-2xl">{item.emoji}</span>
              )}
              <span className={`text-xs font-medium ${isActive ? 'text-purple-700' : 'text-purple-500'}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
      {/* Safe area padding for iOS */}
      <div className="h-safe-area-inset-bottom bg-white" />
    </nav>
  )
}
