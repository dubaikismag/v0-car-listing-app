'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useAppStore } from '@/lib/store'

const tabs = [
  { id: 'Home', emoji: '🏠', href: '/' },
  { id: 'Jobs', emoji: '💼', href: '/browse?category=jobs' },
  { id: 'Rooms', emoji: '🏘️', href: '/browse?category=property' },
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
  const { currentTab, setCurrentTab } = useAppStore()

  const handleTabClick = (tab: typeof tabs[0]) => {
    setCurrentTab(tab.id)
    onTabChange?.(tab.id)
    router.push(tab.href)
  }

  const getActiveTab = () => {
    if (pathname === '/') return 'Home'
    if (pathname === '/browse') return 'Ads'
    if (pathname === '/wanted') return 'Wanted'
    if (pathname === '/groups') return 'Groups'
    if (pathname === '/fun') return 'Fun'
    if (pathname === '/post') return '+ Post'
    return currentTab
  }

  const activeTab = getActiveTab()

  return (
    <div className="bg-white border-b border-gray-100 sticky top-[140px] z-40">
      <div className="flex overflow-x-auto hide-scrollbar px-2 py-2 gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-purple-700 bg-purple-50'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab.emoji && <span>{tab.emoji}</span>}
            <span>{tab.id}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
