'use client'

import Link from 'next/link'
import { Header } from '@/components/header'
import { BottomNavigation } from '@/components/bottom-navigation'
import { useAppStore } from '@/lib/store'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { ListingCard } from '@/components/listing-card'

export default function SavedPage() {
  const { savedAds, listings, isAuthenticated, setShowAuthModal, removeFavorite } = useAppStore()

  const savedListings = listings.filter(l => savedAds.includes(l.id))

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f5f3ff] pb-20">
        <Header />
        <main className="px-4 py-8">
          <div className="text-center py-12">
            <span className="text-5xl block mb-4">🔐</span>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Login Required</h2>
            <p className="text-gray-500 mb-6">Please login to view saved ads</p>
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
      <div className="bg-white px-4 py-4 flex items-center gap-4 border-b border-gray-100">
        <Link href="/more" className="p-2 -ml-2">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <h1 className="text-lg font-bold text-gray-900">Saved Ads</h1>
        <span className="text-sm text-gray-500">({savedListings.length})</span>
      </div>

      <main className="px-4 py-4">
        {savedListings.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {savedListings.map((listing) => (
              <div key={listing.id} className="relative">
                <ListingCard listing={listing} />
                <button
                  onClick={() => removeFavorite(listing.id)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md z-10"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <span className="text-5xl block mb-4">📌</span>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Saved Ads</h2>
            <p className="text-gray-500 mb-6">Tap the bookmark icon on any ad to save it</p>
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold"
            >
              Browse Ads
            </Link>
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  )
}
