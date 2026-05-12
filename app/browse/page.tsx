'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/header'
import { TopTabs } from '@/components/top-tabs'
import { BottomNavigation } from '@/components/bottom-navigation'
import { AuthModal } from '@/components/auth-modal'
import { DesktopSidebar, DesktopRightSidebar } from '@/components/desktop-layout'
import { useAppStore, categories as storeCategories } from '@/lib/store'
import { ListingCard } from '@/components/listing-card'
import { Filter, X, MapPin, Check } from 'lucide-react'

const categoryFilters = [
  { id: 'All', name: 'All', emoji: '📋' },
  ...storeCategories.map(c => ({ id: c.name, name: c.name, emoji: c.emoji }))
]

const sortFilters = [
  { id: 'Newest', name: 'Newest', emoji: '🕐' },
  { id: 'Price', name: 'Price', emoji: '💰' },
  { id: 'Near me', name: 'Near me', emoji: '📍' },
  { id: 'Verified', name: 'Verified', emoji: '✓' }
]

function BrowseContent() {
  const searchParams = useSearchParams()
  const { getFilteredListings, searchQuery, selectedLocation, setSearchQuery } = useAppStore()
  
  const initialCategory = searchParams.get('category') || 'All'
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [selectedSort, setSelectedSort] = useState('Newest')
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [localSearch, setLocalSearch] = useState(searchQuery)

  useEffect(() => {
    const category = searchParams.get('category')
    if (category) {
      setSelectedCategory(category)
    }
  }, [searchParams])

  const handleSearch = (query: string) => {
    setLocalSearch(query)
    setSearchQuery(query)
  }

  const filteredListings = getFilteredListings(
    selectedCategory === 'All' ? undefined : selectedCategory,
    selectedSort,
    localSearch,
    selectedSort === 'Near me' ? selectedLocation : undefined
  )

  return (
    <div className="min-h-screen bg-[#f5f3ff] flex">
      <DesktopSidebar />
      
      <div className="flex-1 lg:pb-0 pb-20">
        <Header 
          onSearch={handleSearch}
          onFilter={() => setShowFilterModal(true)}
        />
        <TopTabs />

        <main className="px-4 py-4 lg:max-w-4xl lg:mx-auto">
        {/* Category Filters */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-3 pb-1">
          {categoryFilters.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-all ${
                selectedCategory === cat.id
                  ? 'bg-purple-100/80 text-purple-700 border-purple-300/60 backdrop-blur-sm shadow-sm'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat.emoji && <span>{cat.emoji}</span>}
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Sort Filters */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-4 pb-1">
          {sortFilters.map((sort) => (
            <button
              key={sort.id}
              onClick={() => setSelectedSort(sort.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedSort === sort.id
                  ? 'bg-amber-100/80 text-amber-700 border border-amber-300/60 backdrop-blur-sm shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>{sort.emoji}</span>
              <span>{sort.name}</span>
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-gray-500 text-sm">{filteredListings.length} listings found</p>
          {localSearch && (
            <button 
              onClick={() => { setLocalSearch(''); setSearchQuery(''); }}
              className="text-purple-600 text-sm flex items-center gap-1"
            >
              Clear search <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Location indicator if "Near me" is active */}
        {selectedSort === 'Near me' && (
          <div className="mb-4 p-3 bg-purple-50 rounded-xl flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-purple-600" />
            <span className="text-purple-700">Showing listings near: <strong>{selectedLocation}</strong></span>
          </div>
        )}

        {/* Listings Grid - 2 cols mobile, 3 cols tablet, 4 cols desktop */}
        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <span className="text-5xl block mb-4">🔍</span>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No listings found</h3>
            <p className="text-gray-500 text-sm mb-4">Try adjusting your filters or search terms</p>
            <button 
              onClick={() => { setSelectedCategory('All'); setSelectedSort('Newest'); setLocalSearch(''); setSearchQuery(''); }}
              className="px-6 py-2 bg-purple-600 text-white rounded-full font-semibold text-sm"
            >
              Clear Filters
            </button>
          </div>
        )}
      </main>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50">
          <div className="w-full max-w-lg bg-white rounded-t-3xl max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>
              <button onClick={() => setShowFilterModal(false)} className="p-2">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="px-4 py-4">
              {/* Category Selection */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Category</h3>
                <div className="flex flex-wrap gap-2">
                  {categoryFilters.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium ${
                        selectedCategory === cat.id
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {cat.emoji} {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Selection */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Sort By</h3>
                <div className="space-y-2">
                  {sortFilters.map((sort) => (
                    <button
                      key={sort.id}
                      onClick={() => setSelectedSort(sort.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border ${
                        selectedSort === sort.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{sort.emoji}</span>
                        <span className="font-medium text-gray-900">{sort.name}</span>
                      </span>
                      {selectedSort === sort.id && <Check className="w-5 h-5 text-purple-600" />}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowFilterModal(false)}
                className="w-full py-4 bg-purple-600 text-white font-bold rounded-xl"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden">
          <BottomNavigation />
        </div>
      </div>
      
      <DesktopRightSidebar />
      <AuthModal />
    </div>
  )
}

export default function BrowsePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f5f3ff] flex items-center justify-center">
        <div className="text-center">
          <span className="text-4xl animate-pulse">🔍</span>
          <p className="text-gray-500 mt-2">Loading...</p>
        </div>
      </div>
    }>
      <BrowseContent />
    </Suspense>
  )
}
