"use client"

import { useState } from 'react'
import Link from 'next/link'
import { type Listing, useAppStore } from '@/lib/store'
import { Heart, MapPin, Check, MessageCircle, Phone, Share2, X } from 'lucide-react'

interface ListingCardProps {
  listing: Listing
  variant?: 'grid' | 'horizontal'
}

export function ListingCard({ listing, variant = 'grid' }: ListingCardProps) {
  const { savedAds, toggleSavedAd, likedAds, toggleLikedAd, shareListing } = useAppStore()
  const isSaved = savedAds.includes(listing.id)
  const isLiked = likedAds.includes(listing.id)

  const formatPrice = (price: number, priceType?: string) => {
    const formatted = price.toLocaleString()
    if (priceType === 'monthly') return `AED ${formatted}/mo`
    if (priceType === 'yearly') return `AED ${formatted}/yr`
    if (priceType === 'kg') return `AED ${formatted}/kg`
    return `AED ${formatted}`
  }

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const message = encodeURIComponent(`Hi, I'm interested in: ${listing.title} - ${formatPrice(listing.price, listing.priceType)}`)
    window.open(`https://wa.me/${listing.whatsapp.replace(/[^0-9]/g, '')}?text=${message}`, '_blank')
  }

  const handleCall = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    window.location.href = `tel:${listing.phone}`
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    shareListing(listing.id)
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing.title,
          text: `Check out: ${listing.title} - ${formatPrice(listing.price, listing.priceType)}`,
          url: window.location.origin + `/listing/${listing.id}`
        })
      } catch {
        // User cancelled or error
      }
    } else {
      navigator.clipboard.writeText(window.location.origin + `/listing/${listing.id}`)
    }
  }

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleLikedAd(listing.id)
  }

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleSavedAd(listing.id)
  }

  const badgeColors: Record<string, string> = {
    HOT: 'bg-amber-400/90 text-amber-900 backdrop-blur-sm border border-amber-300/50',
    NEW: 'bg-purple-400/90 text-purple-900 backdrop-blur-sm border border-purple-300/50',
    SALE: 'bg-green-400/90 text-green-900 backdrop-blur-sm border border-green-300/50',
    HIRE: 'bg-orange-400/90 text-orange-900 backdrop-blur-sm border border-orange-300/50',
    FARM: 'bg-green-400/90 text-green-900 backdrop-blur-sm border border-green-300/50',
    FRESH: 'bg-teal-400/90 text-teal-900 backdrop-blur-sm border border-teal-300/50',
    TOOLS: 'bg-indigo-400/90 text-indigo-900 backdrop-blur-sm border border-indigo-300/50',
    LABOUR: 'bg-purple-400/90 text-purple-900 backdrop-blur-sm border border-purple-300/50'
  }

  // Check if listing is premium/featured for special animation
  const isPremium = listing.badge === 'HOT' || listing.featured || listing.vip

  const bgColors: Record<string, string> = {
    HOT: 'bg-amber-50',
    NEW: 'bg-purple-50',
    SALE: 'bg-pink-50',
    HIRE: 'bg-orange-50',
    FARM: 'bg-green-50',
    FRESH: 'bg-green-50',
    TOOLS: 'bg-gray-50',
    LABOUR: 'bg-amber-50'
  }

  // Tag icon SVG component matching the reference image
  const TagIcon = ({ saved }: { saved: boolean }) => (
    <svg 
      viewBox="0 0 24 24" 
      className={`w-5 h-5 ${saved ? 'text-purple-600' : 'text-gray-400'}`}
      fill={saved ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M7 2h10a2 2 0 012 2v16l-7-3-7 3V4a2 2 0 012-2z" />
      {!saved && (
        <path d="M12 6v6M9 9h6" strokeLinecap="round" />
      )}
    </svg>
  )

  if (variant === 'horizontal') {
    return (
      <Link href={`/listing/${listing.id}`} className="block">
        <div className={`rounded-xl overflow-hidden border border-gray-100 shadow-sm h-[180px] flex flex-col ${listing.badge ? bgColors[listing.badge] || 'bg-white' : 'bg-white'}`}>
          {/* Image Section - Fixed height */}
          <div className="relative h-24 flex items-center justify-center flex-shrink-0">
            {listing.badge && (
              <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold ${badgeColors[listing.badge]}`}>
                {listing.badge}
              </span>
            )}
            {/* Tag/Bookmark Icon */}
            <button
              onClick={handleSave}
              className="absolute top-2 right-2 p-1 rounded-full bg-white/90 shadow-sm"
            >
              <TagIcon saved={isSaved} />
            </button>
            <span className="text-4xl">{listing.emoji}</span>
          </div>
          
          {/* Content - Flex grow */}
          <div className="p-2 flex-1 flex flex-col justify-between">
            <div>
              <p className="text-purple-600 font-bold text-sm">{formatPrice(listing.price, listing.priceType)}</p>
              <p className="text-gray-900 font-medium text-xs truncate">{listing.title}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin className="w-2.5 h-2.5 text-red-500 flex-shrink-0" />
                <span className="text-gray-500 text-[10px] truncate">{listing.location}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              {listing.verified && (
                <span className="flex items-center gap-0.5 text-[10px] text-green-600 bg-green-100 px-1.5 py-0.5 rounded">
                  <Check className="w-2.5 h-2.5" />
                  Verified
                </span>
              )}
              {listing.timeAgo && (
                <span className="text-gray-400 text-[10px]">{listing.timeAgo}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/listing/${listing.id}`} className="block">
      <div className={`rounded-xl overflow-hidden border border-gray-100 shadow-sm h-[280px] flex flex-col ${listing.badge ? bgColors[listing.badge] || 'bg-white' : 'bg-white'} ${isPremium ? 'premium-card' : ''}`}>
        {/* Image Section - Fixed height */}
        <div className="relative h-28 flex items-center justify-center flex-shrink-0">
          {/* Premium Star Indicator */}
          {isPremium && (
            <span className="absolute top-2 left-2 sparkle-star text-lg z-10">
              ⭐
            </span>
          )}
          {/* Tag/Bookmark Icon - matching reference design */}
          <button
            onClick={handleSave}
            className="absolute top-2 right-2 p-1 rounded-full bg-white/90 shadow-sm"
          >
            <TagIcon saved={isSaved} />
          </button>
          {/* Emoji with Badge centered together */}
          <div className="flex items-center justify-center gap-1">
            {listing.badge && (
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${badgeColors[listing.badge]} ${isPremium ? 'premium-badge' : ''}`}>
                {listing.badge}
              </span>
            )}
            <span className="text-5xl">{listing.emoji}</span>
          </div>
        </div>
        
        {/* Content - Flex grow */}
        <div className="p-2.5 flex-1 flex flex-col">
          <p className="text-purple-600 font-bold text-base">{formatPrice(listing.price, listing.priceType)}</p>
          <p className="text-gray-900 font-medium text-xs truncate">{listing.title}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-red-500 flex-shrink-0" />
            <span className="text-gray-500 text-[11px] truncate">{listing.location}</span>
          </div>
          
          {/* Tags & Verified */}
          <div className="flex flex-wrap items-center gap-1 mt-1.5 flex-1">
            {listing.verified && (
              <span className="flex items-center gap-0.5 text-[10px] text-green-600 bg-green-100 px-1.5 py-0.5 rounded">
                <Check className="w-2.5 h-2.5" />
                Verified
              </span>
            )}
            {listing.tags?.slice(0, 1).map((tag) => (
              <span key={tag} className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                {tag}
              </span>
            ))}
            {listing.timeAgo && (
              <span className="text-gray-400 text-[10px] ml-auto">{listing.timeAgo}</span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1.5">
              <button onClick={handleLike} className="flex items-center gap-0.5 text-[10px] text-gray-500">
                <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                <span>{listing.likes || 0}</span>
              </button>
              <button onClick={handleShare} className="text-gray-500">
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={handleWhatsApp}
                className="p-1.5 bg-green-500 rounded-lg"
              >
                <MessageCircle className="w-3.5 h-3.5 text-white" />
              </button>
              <button 
                onClick={handleCall}
                className="p-1.5 bg-purple-600 rounded-lg"
              >
                <Phone className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

// Listing Detail Sheet/Modal Component
export function ListingDetailSheet({ listing, onClose }: { listing: Listing; onClose: () => void }) {
  const { savedAds, toggleSavedAd, likedAds, toggleLikedAd, shareListing } = useAppStore()
  const isSaved = savedAds.includes(listing.id)
  const isLiked = likedAds.includes(listing.id)

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Hi, I'm interested in: ${listing.title}`)
    window.open(`https://wa.me/${listing.whatsapp.replace(/[^0-9]/g, '')}?text=${message}`, '_blank')
  }

  const handleCall = () => {
    window.location.href = `tel:${listing.phone}`
  }

  const handleShare = async () => {
    shareListing(listing.id)
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing.title,
          text: `Check out: ${listing.title}`,
          url: window.location.origin + `/listing/${listing.id}`
        })
      } catch {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.origin + `/listing/${listing.id}`)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose}>
      <div 
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full z-10"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        <div className="px-4 pb-8">
          {/* Emoji Icon */}
          <div className="flex justify-center py-4">
            <span className="text-7xl">{listing.emoji}</span>
          </div>

          {/* Price */}
          <p className="text-center text-purple-600 font-bold text-2xl">
            AED {listing.price.toLocaleString()}{listing.priceType === 'monthly' ? '/mo' : listing.priceType === 'yearly' ? '/yr' : listing.priceType === 'kg' ? '/kg' : ''}
          </p>
          
          {/* Title */}
          <h2 className="text-center text-xl font-bold text-gray-900 mt-1">{listing.title}</h2>
          
          {/* Location */}
          <div className="flex items-center justify-center gap-1 mt-2">
            <MapPin className="w-4 h-4 text-red-500" />
            <span className="text-gray-500">{listing.location}</span>
          </div>

          {/* Tags */}
          {listing.tags && listing.tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              {listing.verified && (
                <span className="flex items-center gap-1 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  <Check className="w-3 h-3" />
                  Verified
                </span>
              )}
              {listing.tags.map((tag) => (
                <span key={tag} className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          <div className="mt-4 p-4 bg-gray-50 rounded-xl">
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Description</h3>
            <p className="text-gray-700 text-sm leading-relaxed">{listing.description}</p>
          </div>

          {/* Specifications */}
          {listing.specs && Object.keys(listing.specs).length > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl">
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Specifications</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(listing.specs).map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <span className="text-gray-400 text-xs">{key}</span>
                    <span className="text-gray-900 font-medium text-sm">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-center gap-6 mt-4 py-3 border-y border-gray-100">
            <div className="flex items-center gap-1 text-gray-500">
              <span className="text-lg">👁️</span>
              <span className="text-sm">{listing.views || 0} views</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              <span className="text-sm">{listing.likes || 0} likes</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <Share2 className="w-5 h-5" />
              <span className="text-sm">{listing.shares || 0} shares</span>
            </div>
          </div>

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

          {/* Secondary Actions */}
          <div className="flex gap-3 mt-3">
            <button
              onClick={() => toggleLikedAd(listing.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 border rounded-xl ${isLiked ? 'border-red-200 bg-red-50 text-red-600' : 'border-gray-200 text-gray-600'}`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500' : ''}`} />
              {isLiked ? 'Liked' : 'Like'}
            </button>
            <button
              onClick={() => toggleSavedAd(listing.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 border rounded-xl ${isSaved ? 'border-purple-200 bg-purple-50 text-purple-600' : 'border-gray-200 text-gray-600'}`}
            >
              <span>{isSaved ? '💕' : '📌'}</span>
              {isSaved ? 'Saved' : 'Save'}
            </button>
            <button
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl text-gray-600"
            >
              <Share2 className="w-5 h-5" />
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
