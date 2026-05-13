'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Heart, Share2, X, MapPin, MessageCircle, Phone } from 'lucide-react'

export default function ListingDetailClient({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLiked, setIsLiked] = useState(false)

  // This is a placeholder since we are making sure the build passes first
  const listing = {
    title: "Premium Vehicle",
    price: "0",
    location: "Dubai, UAE",
    description: "Loading details...",
    emoji: "🚗",
    whatsapp: "971000000000",
    phone: "971000000000"
  }

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${listing.whatsapp}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-[#f5f3ff] pb-32">
      <div className="bg-purple-600 text-white px-4 py-4 flex items-center justify-between sticky top-0 z-50">
        <button onClick={() => router.back()} className="p-2 flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-bold">Listing Details</h1>
        <div className="flex gap-1">
          <button onClick={() => setIsLiked(!isLiked)} className="p-2">
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
          <button onClick={() => router.push('/')} className="p-2">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <main className="px-4 py-4">
        <div className="relative h-56 bg-white rounded-2xl flex items-center justify-center mb-4 border shadow-sm">
          <span className="text-7xl">{listing.emoji}</span>
        </div>

        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{listing.title}</h2>
          <p className="text-gray-500 flex items-center gap-1 mt-2">
            <MapPin className="w-4 h-4" /> {listing.location}
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 border shadow-sm">
          <h3 className="font-bold mb-2">Description</h3>
          <p className="text-gray-600">{listing.description}</p>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex gap-3">
        <button onClick={handleWhatsApp} className="flex-1 py-4 bg-green-500 text-white rounded-xl font-bold flex items-center justify-center gap-2">
          <MessageCircle className="w-5 h-5" /> WhatsApp
        </button>
        <button onClick={() => window.location.href=`tel:${listing.phone}`} className="flex-1 py-4 bg-purple-600 text-white rounded-xl font-bold flex items-center justify-center gap-2">
          <Phone className="w-5 h-5" /> Call
        </button>
      </div>
    </div>
  )
}
