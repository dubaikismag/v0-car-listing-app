'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore, ADMIN_EMAIL } from '@/lib/store'
import { ArrowLeft, Trash2, AlertTriangle, Users, FileText, Flag, Shield, X } from 'lucide-react'

export default function AdminPage() {
  const router = useRouter()
  const { isAdmin, user, listings, deleteListing, pendingCommunities, approveCommunity } = useAppStore()
  const [selectedTab, setSelectedTab] = useState<'listings' | 'pending' | 'reports'>('listings')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  // Redirect if not admin
  if (!isAdmin()) {
    return (
      <div className="min-h-screen bg-[#f5f3ff] flex items-center justify-center p-4">
        <div className="text-center">
          <span className="text-6xl block mb-4">🔒</span>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-500 mb-4">You need admin privileges to access this page.</p>
          <p className="text-gray-400 text-sm mb-4">Admin email: {ADMIN_EMAIL}</p>
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

  const handleDelete = (id: string) => {
    deleteListing(id)
    setShowDeleteConfirm(null)
  }

  const tabs = [
    { id: 'listings', name: 'All Listings', icon: FileText, count: listings.length },
    { id: 'pending', name: 'Pending', icon: Flag, count: pendingCommunities.length },
    { id: 'reports', name: 'Reports', icon: AlertTriangle, count: 0 },
  ]

  return (
    <div className="min-h-screen bg-[#f5f3ff]">
      {/* Header */}
      <div className="gradient-header text-white px-4 py-4 flex items-center justify-between sticky top-0 z-50">
        <button onClick={() => router.back()} className="p-2 -ml-2 flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>
        <h1 className="font-bold flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Admin Panel
        </h1>
        <button onClick={() => router.push('/')} className="p-2">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Admin Info */}
      <div className="p-4 bg-purple-700 text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-amber-400 flex items-center justify-center">
            <span className="text-2xl">👑</span>
          </div>
          <div>
            <p className="font-bold">{user?.name || 'Admin'}</p>
            <p className="text-purple-200 text-sm">{user?.email || ADMIN_EMAIL}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as typeof selectedTab)}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors ${
              selectedTab === tab.id
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.name}
            {tab.count > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                selectedTab === tab.id ? 'bg-purple-100' : 'bg-gray-100'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <main className="p-4">
        {/* Listings Tab */}
        {selectedTab === 'listings' && (
          <div className="space-y-3">
            <p className="text-gray-500 text-sm mb-2">Manage all listings. Delete inappropriate content.</p>
            {listings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-4">
                <span className="text-3xl">{listing.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{listing.title}</p>
                  <p className="text-sm text-gray-500">AED {listing.price.toLocaleString()} - {listing.location}</p>
                  <p className="text-xs text-gray-400">{listing.timeAgo || 'Recent'}</p>
                </div>
                <button
                  onClick={() => setShowDeleteConfirm(listing.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Pending Tab */}
        {selectedTab === 'pending' && (
          <div className="space-y-3">
            <p className="text-gray-500 text-sm mb-2">Approve or reject pending community requests.</p>
            {pendingCommunities.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-4xl block mb-2">✅</span>
                <p className="text-gray-500">No pending requests</p>
              </div>
            ) : (
              pendingCommunities.map((group) => (
                <div key={group.id} className="bg-white rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{group.flag}</span>
                    <div>
                      <p className="font-bold text-gray-900">{group.name}</p>
                      <p className="text-gray-500 text-sm">{group.country} - {group.activity}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => approveCommunity(group.id)}
                      className="flex-1 py-2 bg-green-500 text-white rounded-lg font-semibold text-sm"
                    >
                      Approve
                    </button>
                    <button className="flex-1 py-2 bg-red-100 text-red-600 rounded-lg font-semibold text-sm">
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Reports Tab */}
        {selectedTab === 'reports' && (
          <div className="text-center py-12">
            <span className="text-4xl block mb-2">📊</span>
            <p className="text-gray-500">No reports at this time</p>
            <p className="text-gray-400 text-sm mt-2">User reports for inappropriate content will appear here</p>
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Delete Listing?</h3>
              <p className="text-gray-500 text-sm mt-2">This action cannot be undone. The listing will be permanently removed.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 py-3 border border-gray-200 rounded-xl font-semibold text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
