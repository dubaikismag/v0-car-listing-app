'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useAppStore } from '@/lib/store'

const tabs = [
  { id: 'Home', emoji: '🏠', href: '/' },
  { id: 'Jobs', emoji: '💼', href: '/browse?category=Jobs' },
  { id: 'Rooms', emoji: '🏠', href: '/browse?category=Rooms' },
  { id: 'Cars', emoji: '🚗', href: '/browse?category=Cars' },
  { id: 'Services', emoji: '🛠', href: '/browse?category=Services' },
  { id: 'Buy & Sell', emoji: '🛒', href: '/browse?category=Buy & Sell' },
  { id: 'Community', emoji: '👥', href: '/browse?category=Community' },
  { id: 'Fun', emoji: '🎮', href: '/fun' },
  { id: 'More', emoji: '☰', href: '/more' }
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
      if (category === 'Rooms') return 'Rooms'
      if (category === 'Cars') return 'Cars'
      if (category === 'Services') return 'Services'
      if (category === 'Buy & Sell') return 'Buy & Sell'
      if (category === 'Community') return 'Community'
      return 'Home'
    }
    if (pathname === '/fun') return 'Fun'
    if (pathname === '/more') return 'More'
    return currentTab
  }

  const activeTab = getActiveTab()

  return (
    <div className="bg-white border-b border-gray-100 sticky top-[116px] z-40 shadow-sm">
      <div className="flex overflow-x-auto hide-scrollbar px-2 py-2 gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap text-sm font-medium transition-all ${
                isActive
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
