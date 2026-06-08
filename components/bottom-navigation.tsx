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
      <div className="flex items-end justify-around h-16 max-w-lg mx-auto px-2 pb-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href === '/browse' && pathname.startsWith('/browse')) ||
            (item.href === '/more' && pathname.startsWith('/more'))
          
          if (item.isCenter) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative -mb-1"
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
              className={`flex flex-col items-center justify-end min-w-[60px] h-12 transition-colors ${
                isActive ? 'text-purple-700' : 'text-purple-500'
              }`}
            >
              <div className="h-6 flex items-center justify-center">
                {item.icon === 'search' ? (
                  <Search className={`w-6 h-6 ${isActive ? 'text-purple-700' : 'text-purple-500'}`} />
                ) : item.icon === 'menu' ? (
                  <div className="flex flex-col gap-[3px]">
                    <div className={`w-5 h-[2px] rounded ${isActive ? 'bg-purple-700' : 'bg-purple-500'}`} />
                    <div className={`w-5 h-[2px] rounded ${isActive ? 'bg-purple-700' : 'bg-purple-500'}`} />
                    <div className={`w-5 h-[2px] rounded ${isActive ? 'bg-purple-700' : 'bg-purple-500'}`} />
                  </div>
                ) : (
                  <span className="text-2xl leading-none">{item.emoji}</span>
                )}
              </div>
              <span className={`text-[10px] font-medium mt-0.5 ${isActive ? 'text-purple-700' : 'text-purple-500'}`}>
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
