'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { TopTabs } from '@/components/top-tabs'
import { BottomNavigation } from '@/components/bottom-navigation'
import { AuthModal } from '@/components/auth-modal'
import { useAppStore } from '@/lib/store'

const countryFilters = [
  { id: 'all', name: 'All UAE', flag: '🇦🇪' },
  { id: 'india', name: 'India', flag: '🇮🇳' },
  { id: 'pakistan', name: 'Pakistan', flag: '🇵🇰' },
  { id: 'philippines', name: 'Philippines', flag: '🇵🇭' },
]

export default function GroupsPage() {
  const { communityGroups, joinGroup } = useAppStore()
  const [selectedCountry, setSelectedCountry] = useState('all')

  const filteredGroups = communityGroups.filter(g => 
    selectedCountry === 'all' || g.country.toLowerCase() === selectedCountry
  )

  return (
    <div className="min-h-screen bg-[#f5f3ff] pb-20">
      <Header />
      <TopTabs />

      <main className="px-4 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>🌍</span> Community Groups
          </h2>
          <button className="text-purple-600 font-semibold text-sm">+ Create</button>
        </div>
        <p className="text-gray-500 text-sm mb-4">Connect with your community - share jobs, find help, chat free</p>

        {/* Country Filters */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-4">
          {countryFilters.map((country) => (
            <button
              key={country.id}
              onClick={() => setSelectedCountry(country.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedCountry === country.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-700'
              }`}
            >
              <span>{country.flag}</span>
              <span>{country.name}</span>
            </button>
          ))}
        </div>

        {/* Groups List */}
        <div className="space-y-3">
          {filteredGroups.map((group) => (
            <div key={group.id} className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center">
                <span className="text-3xl">{group.flag}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{group.name}</h3>
                <p className="text-gray-500 text-sm">{group.members.toLocaleString()} members - {group.activity}</p>
              </div>
              <button
                onClick={() => joinGroup(group.id)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                  group.joined
                    ? 'bg-purple-100 text-purple-600 border border-purple-200'
                    : 'bg-purple-600 text-white'
                }`}
              >
                {group.joined ? 'Joined' : 'Join'}
              </button>
            </div>
          ))}
        </div>
      </main>

      <BottomNavigation />
      <AuthModal />
    </div>
  )
}
