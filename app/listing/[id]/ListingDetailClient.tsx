'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ListingDetailClient({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLiked, setIsLiked] = useState(false)

  const listing = {
    title: "Premium Listing",
    price: "Contact for Price",
    location: "Canada",
    description: "Details loading...",
    emoji: "🚗",
    phone: "0000000000"
  }

  return (
    <div style={{ minHeight: '100 screen', backgroundColor: '#f5f3ff', paddingBottom: '80px', fontFamily: 'sans-serif' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#7c3aed', color: 'white', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' }}>←</button>
        <b style={{ fontSize: '14px' }}>Listing Details</b>
        <button onClick={() => setIsLiked(!isLiked)} style={{ background: 'none', border: 'none', color: isLiked ? 'red' : 'white', fontSize: '20px' }}>{isLiked ? '❤️' : '♡'}</button>
      </div>

      <main style={{ padding: '20px' }}>
        {/* Image Placeholder */}
        <div style={{ height: '200px', backgroundColor: 'white', borderRadius: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px', border: '1px solid #ddd' }}>
          <span style={{ fontSize: '60px' }}>{listing.emoji}</span>
        </div>

        <h2 style={{ margin: '0 0 5px 0' }}>{listing.title}</h2>
        <p style={{ color: '#666', margin: '0 0 20px 0' }}>📍 {listing.location}</p>

        <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '12px', border: '1px solid #eee' }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Description</h3>
          <p style={{ color: '#444', lineHeight: '1.5' }}>{listing.description}</p>
        </div>
      </main>

      {/* Fixed Bottom Bar */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'white', padding: '15px', borderTop: '1px solid #eee', display: 'flex', gap: '10px' }}>
        <button 
          onClick={() => window.open(`https://wa.me/${listing.phone}`, '_blank')}
          style={{ flex: 1, padding: '15px', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold' }}
        >
          WhatsApp
        </button>
        <button 
          onClick={() => window.location.href = `tel:${listing.phone}`}
          style={{ flex: 1, padding: '15px', backgroundColor: '#7c3aed', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold' }}
        >
          Call
        </button>
      </div>
    </div>
  )
}
