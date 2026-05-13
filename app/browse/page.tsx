'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/header'
import { TopTabs } from '@/components/top-tabs'
import { BottomNavigation } from '@/components/bottom-navigation'
import { AuthModal } from '@/components/auth-modal'
import { useAppStore, smartFilters, uaeLocationChips } from '@/lib/store'
import { ListingCard } from '@/components/listing-card'
import { Filter, X, MapPin, Check } from 'lucide-react'



function BrowseContent() {
  const searchParams = useSearchParams()
  const { getFilteredListings, searchQuery, selectedLocation, setSearchQuery, setSelectedLocation } = useAppStore()
  
  const initialCategory = searchParams.get('category') || 'All'
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [activeFilters, setActiveFilters] = useState<string[]>(['newest'])
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [localSearch, setLocalSearch] = useState(searchQuery)
  const [selectedLocationChip, setSelectedLocationChip] = useState('dubai')

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

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
  }

  const handleLocationChipClick = (locationId: string) => {
    setSelectedLocationChip(locationId)
    const location = uaeLocationChips.find(l => l.id === locationId)
    if (location) {
      setSelectedLocation(location.name)
    }
  }

  const toggleFilter = (filterId: string) => {
    setActiveFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId]
    )
  }

  // Determine sort based on active filters
  const sortFilter = activeFilters.includes('newest') ? 'Newest' 
    : activeFilters.includes('price') ? 'Price'
    : activeFilters.includes('nearme') ? 'Near me'
    : 'Newest'

  const filteredListings = getFilteredListings(
    selectedCategory === 'All' ? undefined : selectedCategory,
    sortFilter,
    localSearch,
    activeFilters.includes('nearme') ? selectedLocation : undefined
  ).filter(listing => {
    // Filter by active smart filters
    if (activeFilters.includes('verified') && !listing.verified) return false
    if (activeFilters.includes('featured') && !listing.isFeatured) return false
    if (activeFilters.includes('withphotos') && (!listing.images || listing.images.length === 0)) return false
    return true
  })

  return (
    <div className="min-h-screen bg-[#f5f3ff] pb-20">
      <Header 
        onSearch={handleSearch}
        onFilter={() => setShowFilterModal(true)}
      />
      <TopTabs />

      <main className="px-4 py-4">
        {/* UAE Location Chips */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-3 pb-1">
          {uaeLocationChips.map((loc) => (
            <button
              key={loc.id}
              onClick={() => handleLocationChipClick(loc.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedLocationChip === loc.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>{loc.flag}</span>
              <span>{loc.name}</span>
            </button>
          ))}
        </div>

        {/* Smart Filter Chips - Clean, minimal filters (only show most important ones) */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-4 pb-1">
          {smartFilters.slice(0, 6).map((filter) => (
            <button
              key={filter.id}
              onClick={() => toggleFilter(filter.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                activeFilters.includes(filter.id)
                  ? 'bg-amber-100/80 text-amber-700 border border-amber-300/60'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="text-xs">{filter.emoji}</span>
              <span>{filter.name}</span>
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-gray-500 text-sm">{filteredListings.length} listings found</p>
          {(localSearch || activeFilters.length > 1) && (
            <button 
              onClick={() => { 
                setLocalSearch(''); 
                setSearchQuery(''); 
                setActiveFilters(['newest']);
              }}
              className="text-purple-600 text-sm flex items-center gap-1"
            >
              Clear filters <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Location indicator if "Near me" is active */}
        {activeFilters.includes('nearme') && (
          <div className="mb-4 p-3 bg-purple-50 rounded-xl flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-purple-600" />
            <span className="text-purple-700">Showing listings near: <strong>{selectedLocation}</strong></span>
          </div>
        )}

        {/* Listings Grid */}
        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
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
              onClick={() => { 
                setSelectedCategory('All'); 
                setActiveFilters(['newest']); 
                setLocalSearch(''); 
                setSearchQuery(''); 
              }}
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
              {/* Location Selection */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Location</h3>
                <div className="flex flex-wrap gap-2">
                  {uaeLocationChips.map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => handleLocationChipClick(loc.id)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium ${
                        selectedLocationChip === loc.id
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {loc.flag} {loc.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Smart Filters */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Quick Filters</h3>
                <div className="space-y-2">
                  {smartFilters.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => toggleFilter(filter.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border ${
                        activeFilters.includes(filter.id)
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{filter.emoji}</span>
                        <span className="font-medium text-gray-900">{filter.name}</span>
                      </span>
                      {activeFilters.includes(filter.id) && <Check className="w-5 h-5 text-purple-600" />}
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

      <BottomNavigation />
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
