'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { BottomNavigation } from '@/components/bottom-navigation'
import { AuthModal } from '@/components/auth-modal'
import { useAppStore } from '@/lib/store'
import { ArrowLeft, Heart, Share2 } from 'lucide-react'

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { listings, toggleSavedAd, savedAds } = useAppStore()
  
  const listing = listings.find(l => l.id === resolvedParams.id)
  const isSaved = savedAds.includes(resolvedParams.id)
  
  const [activeTab, setActiveTab] = useState<'details' | 'specs'>('details')

  if (!listing) {
    return (
      <div className="min-h-screen bg-[#f8f7fc] flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl block mb-4">🔍</span>
          <h1 className="text-xl font-bold mb-2">Listing Not Found</h1>
          <p className="text-gray-500 mb-4">This listing may have been removed</p>
          <button 
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  const formatPrice = () => {
    const price = listing.price.toLocaleString()
    switch (listing.priceType) {
      case 'monthly': return `AED ${price}/mo`
      case 'yearly': return `AED ${price}/yr`
      case 'kg': return `AED ${price}/kg`
      default: return `AED ${price}`
    }
  }

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Hi, I'm interested in: ${listing.title}`)
    window.open(`https://wa.me/${listing.whatsapp.replace(/[^0-9]/g, '')}?text=${message}`, '_blank')
  }

  const handleCall = () => {
    window.location.href = `tel:${listing.phone}`
  }

  const getBadgeClass = (badge?: string) => {
    switch (badge) {
      case 'HOT': return 'bg-gradient-to-r from-amber-500 to-orange-500'
      case 'NEW': return 'bg-gradient-to-r from-purple-500 to-violet-500'
      case 'SALE': return 'bg-gradient-to-r from-green-500 to-emerald-500'
      case 'HIRE': return 'bg-gradient-to-r from-orange-500 to-red-500'
      case 'FARM': return 'bg-gradient-to-r from-green-500 to-teal-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f7fc] pb-32">
      {/* Custom Header */}
      <div className="gradient-header text-white px-4 py-4 flex items-center justify-between sticky top-0 z-50">
        <button onClick={() => router.back()} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-bold">Listing Details</h1>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => toggleSavedAd(listing.id)}
            className="p-2"
          >
            <Heart className={`w-6 h-6 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
          <button className="p-2">
            <Share2 className="w-6 h-6" />
          </button>
        </div>
      </div>

      <main className="px-4 py-4">
        {/* Image Area */}
        <div className="relative h-64 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 overflow-hidden">
          {listing.badge && (
            <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-white text-sm font-bold ${getBadgeClass(listing.badge)}`}>
              {listing.badge}
            </span>
          )}
          <span className="text-8xl">{listing.emoji}</span>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-black/5 text-2xl font-bold rotate-[-15deg]">dubaikismag.com</span>
          </div>
        </div>

        {/* Price & Title */}
        <div className="mb-4">
          <p className="text-3xl font-bold text-purple-600">{formatPrice()}</p>
          <h2 className="text-xl font-bold text-gray-900 mt-1">{listing.title}</h2>
          <p className="text-gray-500 flex items-center gap-1 mt-2">
            <span className="text-red-400">📍</span> {listing.location}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-4 mb-4">
          {listing.verified && (
            <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium flex items-center gap-1">
              ✓ Verified
            </span>
          )}
          {listing.views && (
            <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm">
              👁️ {listing.views} views
            </span>
          )}
          {listing.timeAgo && (
            <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm">
              🕐 {listing.timeAgo}
            </span>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-3 rounded-xl font-semibold text-sm ${
              activeTab === 'details'
                ? 'bg-purple-600 text-white'
                : 'bg-white border border-gray-200 text-gray-700'
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`flex-1 py-3 rounded-xl font-semibold text-sm ${
              activeTab === 'specs'
                ? 'bg-purple-600 text-white'
                : 'bg-white border border-gray-200 text-gray-700'
            }`}
          >
            Specifications
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'details' && (
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">{listing.description}</p>
          </div>
        )}

        {activeTab === 'specs' && listing.specs && (
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-3">Specifications</h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(listing.specs).map(([key, value]) => (
                <div key={key} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">{key}</p>
                  <p className="font-semibold text-gray-900">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Featured Badge */}
        {listing.isFeatured && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
            <span className="text-2xl">👑</span>
            <div>
              <p className="font-bold text-amber-900">Featured Listing</p>
              <p className="text-sm text-amber-700">This is a premium ad with priority placement</p>
            </div>
          </div>
        )}
      </main>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-100 p-4 z-40">
        <div className="flex gap-3 max-w-lg mx-auto">
          <button
            onClick={handleWhatsApp}
            className="flex-1 py-4 bg-green-500 text-white rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <span>💬</span> WhatsApp
          </button>
          <button
            onClick={handleCall}
            className="flex-1 py-4 bg-purple-600 text-white rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <span>📞</span> Call
          </button>
        </div>
      </div>

      <BottomNavigation />
      <AuthModal />
    </div>
  )
}
