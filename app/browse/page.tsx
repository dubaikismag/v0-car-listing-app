'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/header'
import { TopTabs } from '@/components/top-tabs'
import { BottomNavigation } from '@/components/bottom-navigation'
import { AuthModal } from '@/components/auth-modal'
import { useAppStore } from '@/lib/store'
import { useListings } from '@/lib/hooks/use-listings'
import { ListingCard } from '@/components/listing-card'
import { Filter, X, MapPin, Check, Loader2 } from 'lucide-react'

// Main categories for Line 1
const mainCategories = [
  { id: 'Jobs', name: 'Jobs', emoji: '💼' },
  { id: 'Rooms', name: 'Real Estate', emoji: '🏠' },
  { id: 'Cars', name: 'Cars', emoji: '🚗' },
  { id: 'Services', name: 'Services', emoji: '🛠' },
  { id: 'Buy & Sell', name: 'Buy & Sell', emoji: '🛒' },
  { id: 'Wanted', name: 'Wanted', emoji: '❤️' },
  { id: 'Community', name: 'Community', emoji: '👥' },
]

// Dynamic subcategories based on main category (Line 2)
const subcategoryMap: Record<string, string[]> = {
  'Jobs': ['All', 'Driver', 'Labour', 'Delivery', 'Admin', 'Sales', 'IT', 'Restaurant', 'Construction', 'Security', 'Cleaner', 'Hotel', 'Part Time', 'Other'],
  'Rooms': ['All', 'Bed Space', 'Partition', 'Family Room', 'Studio', '1 BHK', '2 BHK', 'Villa', 'Sharing', 'Monthly', 'Near Metro', 'Other'],
  'Cars': ['All', 'Used Cars', 'SUV', 'Sedan', 'Luxury', 'Sports', 'Bike', 'Electric', 'Commercial', 'Accessories', 'Number Plate', 'Other'],
  'Services': ['All', 'Cleaning', 'AC Repair', 'Beauty', 'Tuition', 'Movers', 'Digital', 'Repair', 'Visa', 'Photography', 'Events', 'Other'],
  'Buy & Sell': ['All', 'Mobiles', 'Furniture', 'Electronics', 'Fashion', 'Gaming', 'Appliances', 'Baby Items', 'Books', 'Sports', 'Pets', 'Other'],
  'Wanted': ['All', 'Wanted Jobs', 'Wanted Rooms', 'Wanted Cars', 'Wanted Services', 'Wanted Electronics', 'Wanted Furniture', 'Wanted Pets', 'Wanted Car Lift', 'Wanted Part Time', 'Wanted Business', 'Other Wanted'],
  'Community': ['All', 'Events', 'Meetups', 'Travel', 'Classes', 'Cricket', 'Food', 'Business', 'Local Groups', 'Volunteers', 'Other'],
}

// Map URL categories to database categories
const categoryMapping: Record<string, string> = {
  'Jobs': 'Jobs',
  'Rooms': 'Real Estate',
  'Cars': 'Cars',
  'Services': 'Services',
  'Buy & Sell': 'Buy & Sell',
  'Wanted': 'Wanted',
  'Community': 'Community',
}

// Smart filter chips (Line 3)
const smartFilters = [
  { id: 'Newest', name: 'Newest', emoji: '🕒' },
  { id: 'Urgent', name: 'Urgent', emoji: '🔥' },
  { id: 'Featured', name: 'Featured', emoji: '⭐' },
  { id: 'Verified', name: 'Verified', emoji: '✔' },
  { id: 'Near me', name: 'Near Me', emoji: '📍' },
  { id: 'With Photos', name: 'With Photos', emoji: '📷' },
  { id: 'Price', name: 'Price', emoji: '💰' },
  { id: 'Today', name: 'Today', emoji: '📅' },
  { id: 'Boosted', name: 'Boosted', emoji: '🚀' },
  { id: 'Popular', name: 'Popular', emoji: '🎯' },
]

function BrowseContent() {
  const searchParams = useSearchParams()
  const { searchQuery, selectedLocation, setSearchQuery, listings: localListings } = useAppStore()
  
  const initialCategory = searchParams.get('category') || 'Jobs'
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [selectedSubcategory, setSelectedSubcategory] = useState('All')
  const [selectedFilter, setSelectedFilter] = useState('Newest')
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [localSearch, setLocalSearch] = useState(searchQuery)

  // Get the database category name
  const dbCategory = categoryMapping[selectedCategory] || selectedCategory

  // Fetch listings from database with realtime updates
  const { listings: dbListings, isLoading, error } = useListings({
    category: dbCategory,
    search: localSearch || undefined,
  })

  // Combine database listings with local sample listings for fallback
  const allListings = dbListings.length > 0 ? dbListings : localListings

  // Get subcategories for current main category
  const currentSubcategories = subcategoryMap[selectedCategory] || ['All']

  useEffect(() => {
    const category = searchParams.get('category')
    if (category && mainCategories.find(c => c.id === category)) {
      setSelectedCategory(category)
      setSelectedSubcategory('All')
    }
  }, [searchParams])

  const handleSearch = (query: string) => {
    setLocalSearch(query)
    setSearchQuery(query)
  }

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setSelectedSubcategory('All')
  }

  // Filter and sort listings
  const getFilteredResults = () => {
    let results = [...allListings]

    // Filter by subcategory
    if (selectedSubcategory !== 'All') {
      results = results.filter(listing => {
        const title = listing.title?.toLowerCase() || ''
        const desc = listing.description?.toLowerCase() || ''
        const subcat = selectedSubcategory.toLowerCase()
        const listingSubcat = 'subcategory' in listing ? (listing.subcategory as string)?.toLowerCase() : ''
        return title.includes(subcat) || desc.includes(subcat) || listingSubcat?.includes(subcat)
      })
    }

    // Apply smart filters
    if (selectedFilter === 'Verified') {
      results = results.filter(listing => listing.verified)
    }
    if (selectedFilter === 'Featured') {
      results = results.filter(listing => {
        const isFeatured = 'featured' in listing ? listing.featured : ('isFeatured' in listing ? listing.isFeatured : false)
        const badge = 'badge' in listing ? listing.badge : undefined
        return isFeatured || badge === 'HOT'
      })
    }
    if (selectedFilter === 'Near me') {
      results = results.filter(listing => listing.location?.includes(selectedLocation.split(',')[0]))
    }
    if (selectedFilter === 'Urgent') {
      results = results.filter(listing => {
        const badge = 'badge' in listing ? listing.badge : undefined
        return badge === 'HOT' || badge === 'NEW'
      })
    }
    if (selectedFilter === 'With Photos') {
      results = results.filter(listing => {
        const images = 'image_urls' in listing ? listing.image_urls : ('images' in listing ? listing.images : [])
        return images && images.length > 0
      })
    }
    if (selectedFilter === 'Price') {
      results = results.sort((a, b) => (a.price || 0) - (b.price || 0))
    }

    return results
  }

  const filteredListings = getFilteredResults()

  return (
    <div className="min-h-screen bg-[#f5f3ff] pb-20">
      <Header 
        onSearch={handleSearch}
        onFilter={() => setShowFilterModal(true)}
      />
      <TopTabs />

      <main className="px-4 pt-[160px] pb-4">
        {/* LINE 2: Dynamic Subcategory Chips */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-3 pb-1">
          {currentSubcategories.map((subcat) => (
            <button
              key={subcat}
              onClick={() => setSelectedSubcategory(subcat)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-all ${
                selectedSubcategory === subcat
                  ? 'bg-purple-100/80 text-purple-700 border-purple-300/60 backdrop-blur-sm shadow-sm'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>{subcat}</span>
            </button>
          ))}
        </div>

        {/* LINE 3: Smart Filter Chips */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-4 pb-1">
          {smartFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedFilter === filter.id
                  ? 'bg-amber-100/80 text-amber-700 border border-amber-300/60 backdrop-blur-sm shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>{filter.emoji}</span>
              <span>{filter.name}</span>
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-gray-500 text-sm">
            {isLoading ? 'Loading...' : `${filteredListings.length} listings found`}
          </p>
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
        {selectedFilter === 'Near me' && (
          <div className="mb-4 p-3 bg-purple-50 rounded-xl flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-purple-600" />
            <span className="text-purple-700">Showing listings near: <strong>{selectedLocation}</strong></span>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <span className="text-5xl block mb-4">⚠️</span>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Error loading listings</h3>
            <p className="text-gray-500 text-sm mb-4">Please try again later</p>
          </div>
        )}

        {/* Listings Grid */}
        {!isLoading && !error && filteredListings.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {filteredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing as any} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredListings.length === 0 && (
          <div className="text-center py-12">
            <span className="text-5xl block mb-4">🔍</span>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No listings found</h3>
            <p className="text-gray-500 text-sm mb-4">Try adjusting your filters or search terms</p>
            <button 
              onClick={() => { setSelectedSubcategory('All'); setSelectedFilter('Newest'); setLocalSearch(''); setSearchQuery(''); }}
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
              {/* Subcategory Selection */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Subcategory</h3>
                <div className="flex flex-wrap gap-2">
                  {currentSubcategories.map((subcat) => (
                    <button
                      key={subcat}
                      onClick={() => setSelectedSubcategory(subcat)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium ${
                        selectedSubcategory === subcat
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {subcat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Selection */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Sort By</h3>
                <div className="space-y-2">
                  {smartFilters.slice(0, 6).map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setSelectedFilter(filter.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border ${
                        selectedFilter === filter.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{filter.emoji}</span>
                        <span className="font-medium text-gray-900">{filter.name}</span>
                      </span>
                      {selectedFilter === filter.id && <Check className="w-5 h-5 text-purple-600" />}
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
          <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto" />
          <p className="text-gray-500 mt-2">Loading...</p>
        </div>
      </div>
    }>
      <BrowseContent />
    </Suspense>
  )
}
