'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useAppStore } from '@/lib/store'

const tabs = [
  { id: 'Home', emoji: '🏠', href: '/' },
  { id: 'Jobs', emoji: '💼', href: '/browse?category=Jobs' },
  { id: 'Rooms', emoji: '🏘️', href: '/browse?category=Property' },
  { id: 'Ads', emoji: '📋', href: '/browse' },
  { id: 'Wanted', emoji: '🤝', href: '/wanted' },
  { id: 'Groups', emoji: '🌍', href: '/groups' },
  { id: 'Fun', emoji: '🎮', href: '/fun' },
  { id: '+ Post', emoji: '', href: '/post' }
]

interface TopTabsProps {
  onTabChange?: (tab: string) => void
}

export function TopTabs({ onTabChange }: TopTabsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { currentTab, setCurrentTab } = useAppStore()

  const handleTabClick = (tab: typeof tabs[0]) => {
    setCurrentTab(tab.id)
    onTabChange?.(tab.id)
    router.push(tab.href)
  }

  const getActiveTab = () => {
    if (pathname === '/') return 'Home'
    if (pathname === '/browse') {
      const category = searchParams.get('category')
      if (category === 'Jobs') return 'Jobs'
      if (category === 'Property') return 'Rooms'
      return 'Ads'
    }
    if (pathname === '/wanted') return 'Wanted'
    if (pathname === '/groups') return 'Groups'
    if (pathname === '/fun') return 'Fun'
    if (pathname === '/post') return '+ Post'
    return currentTab
  }

  const activeTab = getActiveTab()

  return (
    <div className="bg-white border-b border-gray-100 sticky top-[116px] z-40 shadow-sm">
      <div className="flex overflow-x-auto hide-scrollbar px-2 py-2 gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          const isPostTab = tab.id === '+ Post'
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap text-sm font-medium transition-all ${
                isPostTab
                  ? 'bg-purple-600 text-white'
                  : isActive
                    ? 'bg-purple-100/80 text-purple-700 backdrop-blur-sm border border-purple-200/50'
                    : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.emoji && <span>{tab.emoji}</span>}
              <span>{tab.id}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
