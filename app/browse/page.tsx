'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { TopTabs } from '@/components/top-tabs'
import { BottomNavigation } from '@/components/bottom-navigation'
import { AuthModal } from '@/components/auth-modal'
import { useAppStore } from '@/lib/store'

const categoryFilters = [
  { id: 'all', name: 'All', emoji: '' },
  { id: 'vehicles', name: 'Vehicles', emoji: '🚗' },
  { id: 'property', name: 'Property', emoji: '🏠' },
  { id: 'electronics', name: 'Electronics', emoji: '📱' },
  { id: 'jobs', name: 'Jobs', emoji: '💼' }
]

const sortFilters = [
  { id: 'newest', name: 'Newest', emoji: '🕐' },
  { id: 'price', name: 'Price', emoji: '💰' },
  { id: 'near', name: 'Near me', emoji: '📍' },
  { id: 'verified', name: 'Verified', emoji: '✓' }
]

export default function BrowsePage() {
  const { listings } = useAppStore()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedSort, setSelectedSort] = useState('newest')

  const filteredListings = listings.filter(l => 
    selectedCategory === 'all' || l.category.toLowerCase() === selectedCategory
  )

  const getBadgeClass = (badge?: string) => {
    switch (badge) {
      case 'HOT': return 'badge-hot'
      case 'NEW': return 'badge-new'
      case 'SALE': return 'badge-sale'
      case 'HIRE': return 'badge-hire'
      case 'FARM': return 'badge-farm'
      case 'FRESH': return 'badge-fresh'
      case 'TOOLS': return 'badge-tools'
      default: return 'bg-gray-500'
    }
  }

  const formatPrice = (listing: typeof listings[0]) => {
    const price = listing.price.toLocaleString()
    switch (listing.priceType) {
      case 'monthly': return `AED ${price}/mo`
      case 'yearly': return `AED ${price}/yr`
      case 'kg': return `AED ${price}/kg`
      default: return `AED ${price}`
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f3ff] pb-20">
      <Header />
      <TopTabs />

      <main className="px-4 py-4">
        {/* Category Filters */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-3">
          {categoryFilters.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border ${
                selectedCategory === cat.id
                  ? 'bg-white border-gray-300 text-gray-900'
                  : 'bg-white border-gray-200 text-gray-600'
              }`}
            >
              {cat.emoji && <span>{cat.emoji}</span>}
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Sort Filters */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-4">
          {sortFilters.map((sort) => (
            <button
              key={sort.id}
              onClick={() => setSelectedSort(sort.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedSort === sort.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600'
              }`}
            >
              <span>{sort.emoji}</span>
              <span>{sort.name}</span>
            </button>
          ))}
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-2 gap-3">
          {filteredListings.map((listing) => (
            <Link
              key={listing.id}
              href={`/listing/${listing.id}`}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden"
            >
              <div className={`relative h-28 flex items-center justify-center ${
                listing.badge === 'HIRE' ? 'bg-orange-50' : 
                listing.badge === 'FARM' || listing.badge === 'FRESH' ? 'bg-green-50' : 'bg-gray-50'
              }`}>
                {listing.badge && (
                  <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-white text-xs font-bold ${getBadgeClass(listing.badge)}`}>
                    {listing.badge}
                  </span>
                )}
                <span className="text-5xl">{listing.emoji}</span>
              </div>
              <div className="p-3">
                <p className="text-purple-600 font-bold">{formatPrice(listing)}</p>
                <p className="text-gray-900 font-medium text-sm truncate">{listing.title}</p>
                <p className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                  <span className="text-red-400">📍</span> {listing.location}
                </p>
                {listing.verified && (
                  <span className="mt-2 inline-block text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded font-medium">
                    ✓ Verified
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </main>

      <BottomNavigation />
      <AuthModal />
    </div>
  )
}
