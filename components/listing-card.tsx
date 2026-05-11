"use client"

import { useState } from 'react'
import Link from 'next/link'
import { type Listing, useAppStore } from '@/lib/store'
import { Heart, MapPin, Check, MessageCircle, Phone } from 'lucide-react'

interface ListingCardProps {
  listing: Listing
  variant?: 'grid' | 'horizontal'
}

export function ListingCard({ listing, variant = 'grid' }: ListingCardProps) {
  const { savedAds, toggleSavedAd } = useAppStore()
  const isSaved = savedAds.includes(listing.id)

  const formatPrice = (price: number, priceType?: string) => {
    const formatted = price.toLocaleString()
    if (priceType === 'monthly') return `AED ${formatted}/mo`
    if (priceType === 'yearly') return `AED ${formatted}/yr`
    if (priceType === 'kg') return `AED ${formatted}/kg`
    return `AED ${formatted}`
  }

  const badgeColors: Record<string, string> = {
    HOT: 'bg-orange-500 text-white',
    NEW: 'bg-blue-500 text-white',
    SALE: 'bg-red-500 text-white',
    HIRE: 'bg-amber-100 text-amber-800',
    FARM: 'bg-green-500 text-white',
    FRESH: 'bg-emerald-500 text-white',
    TOOLS: 'bg-gray-500 text-white'
  }

  const bgColors: Record<string, string> = {
    HOT: 'bg-white',
    NEW: 'bg-blue-50',
    SALE: 'bg-white',
    HIRE: 'bg-amber-50',
    FARM: 'bg-green-50',
    FRESH: 'bg-green-50',
    TOOLS: 'bg-gray-50'
  }

  if (variant === 'horizontal') {
    return (
      <Link href={`/listing/${listing.id}`} className="block">
        <div className={`rounded-xl overflow-hidden border border-gray-100 ${listing.badge ? bgColors[listing.badge] || 'bg-white' : 'bg-white'}`}>
          {/* Image Section */}
          <div className="relative h-32 flex items-center justify-center">
            {listing.badge && (
              <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-bold ${badgeColors[listing.badge]}`}>
                {listing.badge}
              </span>
            )}
            {listing.isFeatured && (
              <span className="absolute top-2 right-2 bg-purple-100 p-1 rounded">
                <svg className="w-4 h-4 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
              </span>
            )}
            <span className="text-5xl">{listing.emoji}</span>
          </div>
          
          {/* Content */}
          <div className="p-3">
            <p className="text-purple-600 font-bold text-lg">{formatPrice(listing.price, listing.priceType)}</p>
            <p className="text-gray-900 font-medium text-sm truncate">{listing.title}</p>
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3 text-red-500" />
              <span className="text-gray-500 text-xs">{listing.location}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              {listing.verified && (
                <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">
                  <Check className="w-3 h-3" />
                  Verified
                </span>
              )}
              {listing.timeAgo && (
                <span className="text-gray-400 text-xs">{listing.timeAgo}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/listing/${listing.id}`} className="block">
      <div className={`rounded-xl overflow-hidden border border-gray-100 ${listing.badge ? bgColors[listing.badge] || 'bg-white' : 'bg-white'}`}>
        {/* Image Section */}
        <div className="relative aspect-square flex items-center justify-center">
          {listing.badge && (
            <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-bold ${badgeColors[listing.badge]}`}>
              {listing.badge}
            </span>
          )}
          <button
            onClick={(e) => {
              e.preventDefault()
              toggleSavedAd(listing.id)
            }}
            className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm"
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
          </button>
          <span className="text-6xl">{listing.emoji}</span>
        </div>
        
        {/* Content */}
        <div className="p-3">
          <p className="text-purple-600 font-bold text-lg">{formatPrice(listing.price, listing.priceType)}</p>
          <p className="text-gray-900 font-medium text-sm truncate">{listing.title}</p>
          <div className="flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 text-red-500" />
            <span className="text-gray-500 text-xs">{listing.location}</span>
          </div>
          {listing.verified && (
            <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded mt-2">
              <Check className="w-3 h-3" />
              Verified
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

// Listing Detail Sheet/Modal Component
export function ListingDetailSheet({ listing, onClose }: { listing: Listing; onClose: () => void }) {
  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Hi, I'm interested in: ${listing.title}`)
    window.open(`https://wa.me/${listing.whatsapp.replace(/[^0-9]/g, '')}?text=${message}`, '_blank')
  }

  const handleCall = () => {
    window.location.href = `tel:${listing.phone}`
  }

  const { savedAds, toggleSavedAd } = useAppStore()
  const isSaved = savedAds.includes(listing.id)

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose}>
      <div 
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        <div className="px-4 pb-8">
          {/* Emoji Icon */}
          <div className="flex justify-center py-4">
            <span className="text-6xl">{listing.emoji}</span>
          </div>

          {/* Price */}
          <p className="text-center text-purple-600 font-bold text-2xl">
            AED {listing.price.toLocaleString()}{listing.priceType === 'monthly' ? '/mo' : ''}
          </p>
          
          {/* Title */}
          <h2 className="text-center text-xl font-bold text-gray-900 mt-1">{listing.title}</h2>
          
          {/* Location */}
          <div className="flex items-center justify-center gap-1 mt-2">
            <MapPin className="w-4 h-4 text-red-500" />
            <span className="text-gray-500">{listing.location}</span>
          </div>

          {/* Description */}
          <div className="mt-4 p-4 bg-gray-50 rounded-xl">
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Description</h3>
            <p className="text-gray-700 text-sm">{listing.description}</p>
          </div>

          {/* Specifications */}
          {listing.specs && Object.keys(listing.specs).length > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl">
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Specifications</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(listing.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-gray-500">{key}</span>
                    <span className="text-gray-900 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleWhatsApp}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl font-semibold"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </button>
            <button
              onClick={handleCall}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-purple-600 text-white rounded-xl font-semibold"
            >
              <Phone className="w-5 h-5" />
              Call
            </button>
          </div>

          {/* Save Button */}
          <button
            onClick={() => toggleSavedAd(listing.id)}
            className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl mt-3 text-gray-600"
          >
            <span>{isSaved ? '💕' : '📌'}</span>
            {isSaved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
