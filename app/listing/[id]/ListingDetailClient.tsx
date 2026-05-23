'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/header'
import { TopTabs } from '@/components/top-tabs'
import { BottomNavigation } from '@/components/bottom-navigation'
import { AuthModal } from '@/components/auth-modal'
import { ChevronLeft, Heart, Share2, Phone, MessageCircle, MapPin, Clock, Eye, Star, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react'

interface ListingDetailClientProps {
  params: Promise<{ id: string }> | { id: string }
}

export default function ListingDetailClient({ params }: ListingDetailClientProps) {
  const router = useRouter()
  const resolvedParams = 'then' in params ? use(params) : params
  const { listings: localListings, toggleSavedAd, savedAds, toggleLikedAd, likedAds, shareListing } = useAppStore()
  
  const [listing, setListing] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showImageGallery, setShowImageGallery] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  
  const isSaved = savedAds.includes(resolvedParams.id)
  const isLiked = likedAds.includes(resolvedParams.id)

  useEffect(() => {
    const fetchListing = async () => {
      setIsLoading(true)
      
      // First try to find in local store
      const localListing = localListings.find(l => l.id === resolvedParams.id)
      if (localListing) {
        setListing(localListing)
        setIsLoading(false)
        return
      }
      
      // Then try database
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('id', resolvedParams.id)
          .single()
        
        if (data) {
          setListing(data)
        }
      } catch (error) {
        console.error('Error fetching listing:', error)
      }
      
      setIsLoading(false)
    }
    
    fetchListing()
  }, [resolvedParams.id, localListings])

  const formatPrice = (price: number, priceType?: string) => {
    const formatted = price?.toLocaleString() || '0'
    if (priceType === 'monthly') return `AED ${formatted}/mo`
    if (priceType === 'yearly') return `AED ${formatted}/yr`
    if (priceType === 'kg') return `AED ${formatted}/kg`
    return `AED ${formatted}`
  }

  const handleWhatsApp = () => {
    const phone = listing?.whatsapp || listing?.phone || ''
    const message = encodeURIComponent(`Hi, I'm interested in: ${listing?.title} - ${formatPrice(listing?.price, listing?.priceType || listing?.price_type)}`)
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${message}`, '_blank')
  }

  const handleCall = () => {
    const phone = listing?.phone || listing?.whatsapp || ''
    window.location.href = `tel:${phone}`
  }

  const handleShare = async () => {
    shareListing(resolvedParams.id)
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing?.title,
          text: `Check out: ${listing?.title} - ${formatPrice(listing?.price, listing?.priceType || listing?.price_type)}`,
          url: window.location.href
        })
      } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const images = listing?.images || listing?.image_urls || []
  const hasImages = images.length > 0

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f3ff] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-[#f5f3ff] flex flex-col items-center justify-center p-4">
        <span className="text-6xl mb-4">🔍</span>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Listing Not Found</h2>
        <p className="text-gray-600 mb-4 text-center">This listing may have been removed or is no longer available.</p>
        <button 
          onClick={() => router.push('/')}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold"
        >
          Go Home
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5f3ff] pb-24">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 gradient-header">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white font-semibold text-sm truncate max-w-[200px]">Listing Details</h1>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleShare}
              className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center"
            >
              <Share2 className="w-4 h-4 text-white" />
            </button>
            <button 
              onClick={() => toggleSavedAd(resolvedParams.id)}
              className={`w-9 h-9 rounded-full flex items-center justify-center ${isSaved ? 'bg-red-500' : 'bg-white/20'}`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'text-white fill-white' : 'text-white'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="pt-14">
        <div 
          className="relative h-64 bg-white flex items-center justify-center cursor-pointer"
          onClick={() => hasImages && setShowImageGallery(true)}
        >
          {hasImages ? (
            <>
              <div className="relative w-full h-full">
                <img 
                  src={images[currentImageIndex]} 
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
                {/* Watermark */}
                <div className="absolute bottom-2 right-2 bg-black/50 px-2 py-1 rounded text-white text-xs font-medium">
                  dubaikismag.com
                </div>
              </div>
              {images.length > 1 && (
                <>
                  <button 
                    onClick={(e) => { e.stopPropagation(); prevImage() }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center"
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); nextImage() }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center"
                  >
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_: string, i: number) => (
                      <button
                        key={i}
                        onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i) }}
                        className={`w-2 h-2 rounded-full transition-all ${i === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="text-6xl">{listing.emoji || '📦'}</div>
          )}
        </div>
      </div>

      {/* Content */}
      <main className="px-4 py-4">
        {/* Title and Price */}
        <div className="bg-white rounded-2xl p-4 mb-3">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              {listing.badge && (
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold mb-2 ${
                  listing.badge === 'HOT' ? 'bg-red-100 text-red-600' :
                  listing.badge === 'NEW' ? 'bg-green-100 text-green-600' :
                  'bg-amber-100 text-amber-600'
                }`}>
                  {listing.badge}
                </span>
              )}
              <h1 className="text-lg font-bold text-gray-900">{listing.title}</h1>
            </div>
            <span className="text-xl">{listing.emoji || '📦'}</span>
          </div>
          <p className="text-2xl font-bold text-purple-600 mb-3">
            {formatPrice(listing.price, listing.priceType || listing.price_type)}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {listing.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {listing.timeAgo || listing.created_at ? new Date(listing.created_at).toLocaleDateString() : 'Recently'}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {listing.views || 0} views
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5" />
              {listing.likes || 0} likes
            </span>
            {listing.verified && (
              <span className="flex items-center gap-1 text-green-600">
                <Star className="w-3.5 h-3.5 fill-current" />
                Verified
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl p-4 mb-3">
          <h2 className="font-bold text-gray-900 mb-2">Description</h2>
          <p className="text-gray-600 text-sm whitespace-pre-wrap">{listing.description || 'No description provided.'}</p>
        </div>

        {/* Specs */}
        {listing.specs && Object.keys(listing.specs).length > 0 && (
          <div className="bg-white rounded-2xl p-4 mb-3">
            <h2 className="font-bold text-gray-900 mb-3">Details</h2>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(listing.specs).map(([key, value]) => (
                <div key={key} className="flex flex-col">
                  <span className="text-xs text-gray-400">{key}</span>
                  <span className="text-sm font-medium text-gray-900">{value as string}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {listing.tags && listing.tags.length > 0 && (
          <div className="bg-white rounded-2xl p-4 mb-3">
            <h2 className="font-bold text-gray-900 mb-2">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {listing.tags.map((tag: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Fixed Bottom Contact Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-3 flex gap-2 z-40">
        <button 
          onClick={handleCall}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-purple-600 text-white rounded-xl font-semibold"
        >
          <Phone className="w-5 h-5" />
          Call
        </button>
        <button 
          onClick={handleWhatsApp}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl font-semibold"
        >
          <MessageCircle className="w-5 h-5" />
          WhatsApp
        </button>
      </div>

      {/* Full Screen Image Gallery */}
      {showImageGallery && hasImages && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col">
          <div className="flex items-center justify-between p-4">
            <button 
              onClick={() => setShowImageGallery(false)}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <span className="text-white font-medium">{currentImageIndex + 1} / {images.length}</span>
            <div className="flex gap-2">
              <button 
                onClick={() => setZoomLevel(z => Math.max(1, z - 0.5))}
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
              >
                <ZoomOut className="w-5 h-5 text-white" />
              </button>
              <button 
                onClick={() => setZoomLevel(z => Math.min(3, z + 0.5))}
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
              >
                <ZoomIn className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center overflow-auto p-4">
            <img 
              src={images[currentImageIndex]} 
              alt={listing.title}
              className="max-w-full max-h-full object-contain transition-transform"
              style={{ transform: `scale(${zoomLevel})` }}
            />
          </div>
          {/* Watermark */}
          <div className="absolute bottom-20 right-4 bg-black/50 px-3 py-1.5 rounded text-white text-sm font-medium">
            dubaikismag.com
          </div>
          <div className="flex items-center justify-center gap-4 p-4">
            <button 
              onClick={prevImage}
              className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <div className="flex gap-2 overflow-x-auto max-w-[200px]">
              {images.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setCurrentImageIndex(i)}
                  className={`w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border-2 ${i === currentImageIndex ? 'border-white' : 'border-transparent'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <button 
              onClick={nextImage}
              className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      )}

      <BottomNavigation />
      <AuthModal />
    </div>
  )
}
