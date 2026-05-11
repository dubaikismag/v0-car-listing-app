'use client'

import { useAppStore } from '@/lib/store'

const tabs = [
  { id: 'Home', emoji: '🏠' },
  { id: 'Jobs', emoji: '💼' },
  { id: 'Rooms', emoji: '🏘️' },
  { id: 'Ads', emoji: '📋' },
  { id: 'Wanted', emoji: '🤝' },
  { id: 'Groups', emoji: '🌍' },
  { id: 'Fun', emoji: '🎮' },
  { id: '+ Post', emoji: '' }
]

interface TopTabsProps {
  onTabChange?: (tab: string) => void
}

export function TopTabs({ onTabChange }: TopTabsProps) {
  const { currentTab, setCurrentTab } = useAppStore()

  const handleTabClick = (tabId: string) => {
    setCurrentTab(tabId)
    onTabChange?.(tabId)
  }

  return (
    <div className="bg-white border-b border-gray-100 sticky top-[140px] z-40">
      <div className="flex overflow-x-auto hide-scrollbar px-2 py-2 gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap text-sm font-medium transition-colors ${
              currentTab === tab.id
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
