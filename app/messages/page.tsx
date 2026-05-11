'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { BottomNavigation } from '@/components/bottom-navigation'
import { useAppStore } from '@/lib/store'
import { ArrowLeft, Search, Check, CheckCheck } from 'lucide-react'

const sampleMessages = [
  {
    id: 'm1',
    name: 'Ahmed Hassan',
    avatar: '👨',
    lastMessage: 'Is the car still available?',
    time: '2m ago',
    unread: 2,
    listing: 'Toyota Camry 2020'
  },
  {
    id: 'm2',
    name: 'Sara Ali',
    avatar: '👩',
    lastMessage: 'Can you share more photos?',
    time: '1h ago',
    unread: 0,
    listing: '1 BHK Furnished'
  },
  {
    id: 'm3',
    name: 'Mohammed Khan',
    avatar: '👨‍💼',
    lastMessage: 'Thank you, I will visit tomorrow',
    time: '3h ago',
    unread: 0,
    listing: 'iPhone 14 Pro'
  }
]

export default function MessagesPage() {
  const { isAuthenticated, setShowAuthModal } = useAppStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedChat, setSelectedChat] = useState<string | null>(null)

  const filteredMessages = sampleMessages.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.listing.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f5f3ff] pb-20">
        <Header />
        <main className="px-4 py-8">
          <div className="text-center py-12">
            <span className="text-5xl block mb-4">🔐</span>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Login Required</h2>
            <p className="text-gray-500 mb-6">Please login to view messages</p>
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
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/more" className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">Messages</h1>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>
      </div>

      <main>
        {filteredMessages.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredMessages.map((message) => (
              <button
                key={message.id}
                onClick={() => setSelectedChat(message.id)}
                className="w-full flex items-center gap-4 p-4 bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-2xl flex-shrink-0">
                  {message.avatar}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900">{message.name}</h3>
                    <span className="text-xs text-gray-400">{message.time}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{message.lastMessage}</p>
                  <p className="text-xs text-purple-600 mt-0.5">Re: {message.listing}</p>
                </div>
                {message.unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center">
                    {message.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-4">
            <span className="text-5xl block mb-4">💬</span>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Messages</h2>
            <p className="text-gray-500 mb-6">Start a conversation by contacting a seller</p>
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold"
            >
              Browse Ads
            </Link>
          </div>
        )}
      </main>

      {/* Chat Modal */}
      {selectedChat && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col">
          {/* Chat Header */}
          <div className="flex items-center gap-4 p-4 border-b border-gray-100">
            <button onClick={() => setSelectedChat(null)} className="p-2 -ml-2">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-xl">
              {sampleMessages.find(m => m.id === selectedChat)?.avatar}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {sampleMessages.find(m => m.id === selectedChat)?.name}
              </h3>
              <p className="text-xs text-green-600">Online</p>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-auto bg-gray-50">
            <div className="space-y-4">
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-tl-none px-4 py-2 max-w-[80%] shadow-sm">
                  <p className="text-gray-800">{sampleMessages.find(m => m.id === selectedChat)?.lastMessage}</p>
                  <p className="text-xs text-gray-400 mt-1">10:30 AM</p>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-purple-600 text-white rounded-2xl rounded-tr-none px-4 py-2 max-w-[80%]">
                  <p>Yes, it is still available!</p>
                  <p className="text-xs text-purple-200 mt-1 flex items-center justify-end gap-1">
                    10:32 AM <CheckCheck className="w-3 h-3" />
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 bg-gray-100 rounded-full text-sm focus:outline-none"
              />
              <button className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  )
}
