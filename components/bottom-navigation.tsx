"use client"

import { usePathname, useRouter } from 'next/navigation'
import { Home, Search, Plus, Gamepad2, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Browse', href: '/browse', icon: Search },
  { name: 'Post', href: '/post', icon: Plus, isCenter: true },
  { name: 'Fun', href: '/fun', icon: Gamepad2 },
  { name: 'More', href: '/more', icon: Menu },
]

export function BottomNavigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, openAuthModal } = useAuth()

  const handleNavigation = (href: string, requiresAuth: boolean = false) => {
    if (requiresAuth && !user) {
      openAuthModal()
      return
    }
    router.push(href)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border safe-area-pb">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          if (item.isCenter) {
            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href, true)}
                className="relative -mt-6"
              >
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30 active:scale-95 transition-transform">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-medium text-muted-foreground">
                  {item.name}
                </span>
              </button>
            )
          }

          return (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.href)}
              className={cn(
                "flex flex-col items-center justify-center w-16 h-full gap-0.5 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "text-amber-500")} />
              <span className={cn(
                "text-[10px] font-medium",
                isActive && "text-amber-500"
              )}>
                {item.name}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
