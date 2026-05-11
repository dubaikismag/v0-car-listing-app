"use client"

import { Header } from '@/components/header'
import { BottomNavigation } from '@/components/bottom-navigation'
import { Categories } from '@/components/categories'
import { ListingCard } from '@/components/listing-card'
import { AuthModal } from '@/components/auth-modal'
import { useStore } from '@/lib/store'
import { AuthProvider } from '@/lib/auth-context'
import { Badge } from '@/components/ui/badge'
import { Crown, TrendingUp } from 'lucide-react'

function HomeContent() {
  const getSortedListings = useStore((state) => state.getSortedListings)
  const listings = getSortedListings()

  const featuredListings = listings.filter(
    (l) => l.isPaid && l.paidUntil && new Date(l.paidUntil) > new Date()
  )
  const regularListings = listings.filter(
    (l) => !l.isPaid || !l.paidUntil || new Date(l.paidUntil) <= new Date()
  )

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="container mx-auto px-4">
        {/* Categories */}
        <Categories />

        {/* Featured Listings */}
        {featuredListings.length > 0 && (
          <section className="py-6">
            <div className="flex items-center gap-2 mb-4">
              <Crown className="h-5 w-5 text-amber-500" />
              <h2 className="text-lg font-semibold">Featured Listings</h2>
              <Badge variant="secondary" className="bg-amber-500/10 text-amber-600">
                Premium
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </section>
        )}

        {/* Regular Listings */}
        <section className="py-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Recent Listings</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regularListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>
      </main>

      <BottomNavigation />
      <AuthModal />
    </div>
  )
}

export default function HomePage() {
  return (
    <AuthProvider>
      <HomeContent />
    </AuthProvider>
  )
}
