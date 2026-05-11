'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { TopTabs } from '@/components/top-tabs'
import { BottomNavigation } from '@/components/bottom-navigation'
import { AuthModal } from '@/components/auth-modal'
import { useAppStore } from '@/lib/store'

const filters = ['All', 'Property', 'Jobs', 'Items', 'Services']

export default function WantedPage() {
  const { wantedPosts } = useAppStore()
  const [selectedFilter, setSelectedFilter] = useState('All')

  return (
    <div className="min-h-screen bg-[#f8f7fc] pb-20">
      <Header />
      <TopTabs />

      <main className="px-4 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>🤝</span> Wanted & Required
          </h2>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold text-sm">
            + Post
          </button>
        </div>

        {/* Filters */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-4">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedFilter === filter
                  ? 'bg-purple-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-700'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Wanted Posts */}
        <div className="space-y-3">
          {wantedPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl p-4 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-1">{post.title}</h3>
              <p className="text-gray-600 text-sm mb-3">
                Budget: {post.budget} - {post.description}
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>

              {/* User & Contact */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{post.userFlag}</span>
                  <span className="text-gray-600 text-sm">{post.userName} - {post.userCountry}</span>
                </div>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold text-sm">
                  Contact
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <BottomNavigation />
      <AuthModal />
    </div>
  )
}
