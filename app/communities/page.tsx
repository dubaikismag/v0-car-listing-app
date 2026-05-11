'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BottomNavigation } from '@/components/bottom-navigation'
import { useAppStore } from '@/lib/store'
import { ArrowLeft, Search, Users, Check } from 'lucide-react'

export default function MyCommunitiesPage() {
  const { communityGroups, joinGroup, leaveGroup, isAuthenticated, setShowAuthModal } = useAppStore()
  const [searchQuery, setSearchQuery] = useState('')

  const joinedGroups = communityGroups.filter(g => g.joined)
  const filteredGroups = joinedGroups.filter(g =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.country.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f5f3ff] pb-20">
        <div className="bg-white px-4 py-4 flex items-center gap-4 border-b border-gray-100">
          <Link href="/more" className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">My Communities</h1>
        </div>
        <main className="px-4 py-8">
          <div className="text-center py-12">
            <span className="text-5xl block mb-4">🔐</span>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Login Required</h2>
            <p className="text-gray-500 mb-6">Please login to view your communities</p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-8 py-3 bg-purple-600 text-white rounded-xl font-semibold"
            >
              Login / Sign Up
            </button>
          </div>
        </main>
        <BottomNavigation />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5f3ff] pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/more" className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">My Communities</h1>
          <span className="text-sm text-gray-500">({joinedGroups.length})</span>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search your communities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>
      </div>

      <main className="px-4 py-4">
        {filteredGroups.length > 0 ? (
          <div className="space-y-3">
            {filteredGroups.map((group) => (
              <div
                key={group.id}
                className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100"
              >
                <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-2xl">
                  {group.flag}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{group.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>{group.members.toLocaleString()} members</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">{group.activity}</p>
                </div>
                <button
                  onClick={() => leaveGroup(group.id)}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium flex items-center gap-1"
                >
                  <Check className="w-4 h-4" />
                  Joined
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <span className="text-5xl block mb-4">🌍</span>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Communities Joined</h2>
            <p className="text-gray-500 mb-6">Join communities to connect with people</p>
            <Link
              href="/groups"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold"
            >
              Explore Communities
            </Link>
          </div>
        )}

        {/* Explore More Link */}
        {filteredGroups.length > 0 && (
          <Link
            href="/groups"
            className="block mt-6 text-center py-4 bg-purple-50 rounded-xl text-purple-600 font-semibold"
          >
            Explore More Communities
          </Link>
        )}
      </main>

      <BottomNavigation />
    </div>
  )
}
