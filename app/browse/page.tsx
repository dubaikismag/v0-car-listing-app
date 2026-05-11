"use client"

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/header'
import { BottomNavigation } from '@/components/bottom-navigation'
import { ListingCard } from '@/components/listing-card'
import { AuthModal } from '@/components/auth-modal'
import { AuthProvider } from '@/lib/auth-context'
import { useStore, categories } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Search,
  SlidersHorizontal,
  Grid3X3,
  List,
  Crown,
  MapPin,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

const locations = [
  'All Locations',
  'Dubai Marina',
  'Downtown Dubai',
  'Palm Jumeirah',
  'JBR',
  'Business Bay',
  'DIFC',
  'JLT',
  'Emirates Hills',
  'Al Barsha'
]

function BrowseContent() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('category') || ''

  const getSortedListings = useStore((state) => state.getSortedListings)
  const allListings = getSortedListings()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [selectedLocation, setSelectedLocation] = useState('')
  const [priceRange, setPriceRange] = useState([0, 10000000])
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)
  const [sortBy, setSortBy] = useState('relevance')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const filteredListings = useMemo(() => {
    return allListings.filter((listing) => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          listing.title.toLowerCase().includes(query) ||
          listing.description.toLowerCase().includes(query) ||
          listing.category.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }

      // Category filter
      if (selectedCategory) {
        const category = categories.find((c) => c.id === selectedCategory)
        if (category && listing.category.toLowerCase() !== category.name.toLowerCase()) {
          return false
        }
      }

      // Location filter
      if (selectedLocation && selectedLocation !== 'All Locations') {
        if (listing.location !== selectedLocation) return false
      }

      // Price range
      if (listing.price < priceRange[0] || listing.price > priceRange[1]) {
        return false
      }

      // Featured only
      if (showFeaturedOnly) {
        const isPaidActive = listing.isPaid && listing.paidUntil && new Date(listing.paidUntil) > new Date()
        if (!isPaidActive) return false
      }

      return true
    }).sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'views':
          return b.views - a.views
        default:
          return 0
      }
    })
  }, [allListings, searchQuery, selectedCategory, selectedLocation, priceRange, showFeaturedOnly, sortBy])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setSelectedLocation('')
    setPriceRange([0, 10000000])
    setShowFeaturedOnly(false)
    setSortBy('relevance')
  }

  const activeFiltersCount = [
    selectedCategory,
    selectedLocation && selectedLocation !== 'All Locations',
    showFeaturedOnly,
    priceRange[0] > 0 || priceRange[1] < 10000000
  ].filter(Boolean).length

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <main className="container mx-auto px-4 py-6">
        {/* Search and Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search listings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Quick Category Select */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Filters Button */}
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="h-5 w-5 p-0 flex items-center justify-center bg-amber-500">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Refine your search results
                </SheetDescription>
              </SheetHeader>
              
              <div className="space-y-6 py-6">
                {/* Location */}
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc} value={loc}>
                          {loc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="space-y-4">
                  <Label>Price Range (AED)</Label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={10000000}
                    step={10000}
                    className="py-4"
                  />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{priceRange[0].toLocaleString()} AED</span>
                    <span>{priceRange[1].toLocaleString()} AED</span>
                  </div>
                </div>

                {/* Featured Only */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={showFeaturedOnly}
                    onCheckedChange={(checked) => setShowFeaturedOnly(checked === true)}
                  />
                  <Label htmlFor="featured" className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-amber-500" />
                    Featured listings only
                  </Label>
                </div>

                {/* Sort By */}
                <div className="space-y-2">
                  <Label>Sort By</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="views">Most Viewed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1" onClick={clearFilters}>
                    Clear All
                  </Button>
                  <Button className="flex-1 bg-amber-500 hover:bg-amber-600" onClick={() => setIsFilterOpen(false)}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* View Mode Toggle */}
          <div className="flex border rounded-lg">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode('grid')}
              className={cn(viewMode === 'grid' && "bg-muted")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode('list')}
              className={cn(viewMode === 'list' && "bg-muted")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedCategory && (
              <Badge variant="secondary" className="gap-1">
                {categories.find((c) => c.id === selectedCategory)?.name}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCategory('')} />
              </Badge>
            )}
            {selectedLocation && selectedLocation !== 'All Locations' && (
              <Badge variant="secondary" className="gap-1">
                <MapPin className="h-3 w-3" />
                {selectedLocation}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedLocation('')} />
              </Badge>
            )}
            {showFeaturedOnly && (
              <Badge variant="secondary" className="gap-1">
                <Crown className="h-3 w-3" />
                Featured
                <X className="h-3 w-3 cursor-pointer" onClick={() => setShowFeaturedOnly(false)} />
              </Badge>
            )}
          </div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredListings.length} listings found
          </p>
        </div>

        {/* Listings Grid */}
        {filteredListings.length > 0 ? (
          <div className={cn(
            "grid gap-4",
            viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
          )}>
            {filteredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No listings found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search query
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        )}
      </main>

      <BottomNavigation />
      <AuthModal />
    </div>
  )
}

export default function BrowsePage() {
  return (
    <AuthProvider>
      <BrowseContent />
    </AuthProvider>
  )
}
