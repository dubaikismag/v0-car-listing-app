'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { BottomNavigation } from '@/components/bottom-navigation'
import { useAppStore } from '@/lib/store'
import { ArrowLeft, Plus, MoreVertical, Eye, MessageSquare, Heart, Trash2, Edit, X } from 'lucide-react'

export default function MyListingsPage() {
  const { user, listings, isAuthenticated, setShowAuthModal, deleteListing } = useAppStore()
  const [showMenu, setShowMenu] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  // Get user's listings (mock: filter by a user email if available)
  const myListings = isAuthenticated && user 
    ? listings.filter(l => l.contact?.includes(user.phone || '') || l.id.startsWith('l'))
    : []

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f5f3ff] pb-20">
        <Header />
        <main className="px-4 py-8">
          <div className="text-center py-12">
            <span className="text-5xl block mb-4">🔐</span>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Login Required</h2>
            <p className="text-gray-500 mb-6">Please login to view your listings</p>
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
        <h1 className="text-lg font-bold text-gray-900">My Listings</h1>
      </div>

      <main className="px-4 py-4">
        {myListings.length > 0 ? (
          <div className="space-y-3">
            {myListings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-xl p-4 border border-gray-100 relative">
                {/* Menu Button */}
                <button
                  onClick={() => setShowMenu(showMenu === listing.id ? null : listing.id)}
                  className="absolute top-3 right-3 p-1"
                >
                  <MoreVertical className="w-5 h-5 text-gray-400" />
                </button>

                {/* Menu Dropdown */}
                {showMenu === listing.id && (
                  <div className="absolute top-10 right-3 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10 min-w-[140px]">
                    <Link
                      href={`/listing/${listing.id}`}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50"
                    >
                      <Eye className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">View</span>
                    </Link>
                    <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50">
                      <Edit className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">Edit</span>
                    </button>
                    <button 
                      onClick={() => { setShowMenu(null); setShowDeleteConfirm(listing.id); }}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-red-600">Delete</span>
                    </button>
                  </div>
                )}

                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-4xl">{listing.emoji}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate pr-6">{listing.title}</h3>
                    <p className="text-purple-600 font-bold text-sm">
                      AED {listing.price.toLocaleString()}
                      {listing.priceType === 'monthly' && '/mo'}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">{listing.location}</p>
                    
                    {/* Stats */}
                    <div className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Eye className="w-3 h-3" /> {listing.views || 0}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Heart className="w-3 h-3" /> {listing.likes || 0}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <MessageSquare className="w-3 h-3" /> {listing.messages || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mt-3 flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    listing.verified 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {listing.verified ? 'Active' : 'Pending Review'}
                  </span>
                  <span className="text-xs text-gray-400">{listing.timeAgo}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <span className="text-5xl block mb-4">📋</span>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Listings Yet</h2>
            <p className="text-gray-500 mb-6">Start selling by posting your first ad</p>
            <Link
              href="/post"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold"
            >
              <Plus className="w-5 h-5" />
              Post Your First Ad
            </Link>
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <div className="text-center">
              <span className="text-5xl block mb-4">🗑️</span>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Listing?</h3>
              <p className="text-gray-500 text-sm mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    deleteListing(showDeleteConfirm)
                    setShowDeleteConfirm(null)
                  }}
                  className="flex-1 py-3 bg-red-600 text-white rounded-xl font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  )
}
