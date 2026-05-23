'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { TopTabs } from '@/components/top-tabs'
import { BottomNavigation } from '@/components/bottom-navigation'
import { AuthModal } from '@/components/auth-modal'
import { useAppStore } from '@/lib/store'
import { ChevronRight, Zap, Phone, Gift, Crown, MapPin } from 'lucide-react'

// Featured Ads Data
const featuredAds = [
  { id: '1', badge: 'HOT', emoji: '🚗', price: 'AED 28,000', title: 'Toyota Camry 2020', location: 'Dubai Marina', verified: true, time: '1h ago', bgColor: 'bg-gray-50' },
  { id: '2', badge: 'NEW', emoji: '🏠', price: 'AED 3,500/mo', title: '1 BHK Furnished', location: 'Deira, Dubai', verified: true, time: '2h', bgColor: 'bg-blue-50' },
  { id: '3', badge: 'SALE', emoji: '📱', price: 'AED 1,200', title: 'iPhone 14 Pro 256GB', location: 'Sharjah', verified: true, time: '3h', bgColor: 'bg-purple-50' },
]

// Labour Services Data
const labourServices = [
  { id: '1', emoji: '👷', price: 'AED 2,200/mo', title: 'AC Technician', origin: 'Kerala', status: 'Available', experience: '5yr', bgColor: 'bg-amber-50' },
  { id: '2', emoji: '🔧', price: 'AED 1,900/mo', title: 'Plumber', origin: 'Rajasthan', status: 'Available', experience: '3yr', bgColor: 'bg-orange-50' },
]

// Farmland Data
const farmlandAds = [
  { id: '1', badge: 'FARM', emoji: '🌾', price: 'AED 45,000/yr', title: 'Farm Plot 2 acres', location: 'Al Ain', status: 'Available', bgColor: 'bg-green-50' },
  { id: '2', badge: 'FRESH', emoji: '🥦', price: 'AED 120/kg', title: 'Organic Dates - Direct', location: 'RAK', status: 'Fresh', bgColor: 'bg-lime-50' },
  { id: '3', badge: 'TOOLS', emoji: '🚜', price: 'AED 8,500', title: 'Mini Tractor - Used', location: 'Fujairah', status: 'Used', bgColor: 'bg-yellow-50' },
]

// WhatsApp Active Data
const whatsappActive = [
  { id: '1', emoji: '👷', title: 'Electrician Needed', time: 'Active 5 min ago', bgColor: 'bg-green-50' },
  { id: '2', emoji: '🏠', title: 'Room Deira AED 900', time: 'Active 12 min ago', bgColor: 'bg-green-50' },
  { id: '3', emoji: '🚗', title: 'Driver Hiring Now', time: 'Active 1h ago', bgColor: 'bg-green-50' },
]

// Browse Categories
const browseCategories = [
  { id: 'vehicles', name: 'Vehicles', emoji: '🚗', href: '/browse?category=Cars' },
  { id: 'realestate', name: 'Real Estate', emoji: '🏢', href: '/browse?category=Rooms' },
  { id: 'jobs', name: 'Jobs', emoji: '💼', href: '/browse?category=Jobs' },
  { id: 'services', name: 'Services', emoji: '🛠️', href: '/browse?category=Services' },
  { id: 'electronics', name: 'Electronics', emoji: '📱', href: '/browse?category=Buy & Sell' },
  { id: 'furniture', name: 'Furniture', emoji: '🛋️', href: '/browse?category=Buy & Sell' },
  { id: 'community', name: 'Community', emoji: '👥', href: '/browse?category=Community' },
  { id: 'more', name: 'More...', emoji: '📦', href: '/browse' },
]

// Services Chips (updated)
const serviceChips = ['All', 'Electrician', 'Plumber', 'Painter', 'AC Tech', 'Tutors', 'Movers', 'Cleaning', 'IT Support']

// Trending Motors Data (replaces Farmland)
const trendingMotors = [
  { id: '1', badge: 'GCC', emoji: '🚗', price: 'AED 45,000', title: 'Toyota Camry 2022', location: 'Al Ain', status: 'Premium', bgColor: 'bg-blue-50' },
  { id: '2', badge: 'SUV', emoji: '🚙', price: 'AED 120,000', title: 'Nissan Patrol', location: 'Dubai', status: 'Clean', bgColor: 'bg-gray-50' },
  { id: '3', badge: 'LUXURY', emoji: '🏎️', price: 'AED 250,000', title: 'BMW X7', location: 'Dubai Marina', status: 'Verified', bgColor: 'bg-purple-50' },
]

export default function HomePage() {
  const { listings, isAuthenticated } = useAppStore()
  const [selectedServiceChip, setSelectedServiceChip] = useState('All')
  const [listingCount, setListingCount] = useState(27)
  const [memberCount, setMemberCount] = useState(22)

  return (
    <div className="min-h-screen bg-[#f5f3ff] pb-32">
      <Header />
      <TopTabs />

      <main className="px-4 pt-[160px] pb-4 space-y-6">
        {/* Stats Row */}
        <div className="flex justify-between text-center py-3">
          <div>
            <p className="text-purple-600 font-bold text-lg">{listingCount}+</p>
            <p className="text-gray-500 text-xs">Active Listings</p>
          </div>
          <div>
            <p className="text-purple-600 font-bold text-lg">{memberCount}+</p>
            <p className="text-gray-500 text-xs">Members</p>
          </div>
          <div>
            <p className="text-purple-600 font-bold text-lg">190+</p>
            <p className="text-gray-500 text-xs">Countries</p>
          </div>
          <div>
            <p className="text-amber-500 font-bold text-lg">92%</p>
            <p className="text-gray-500 text-xs">Verified</p>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-5 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-purple-400/20 rounded-full -mr-10 -mt-10" />
          <div className="absolute right-10 bottom-0 w-20 h-20 bg-purple-400/20 rounded-full -mb-5" />
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-medium mb-3">
            🇦🇪 POST YOUR AD FREE
          </span>
          <h2 className="text-xl font-bold mb-1">Buy, Sell, Hire &</h2>
          <h2 className="text-xl font-bold mb-2">Connect Across Dubai</h2>
          <p className="text-purple-100 text-sm mb-4">Connect instantly with active buyers, renters, job seekers, and UAE communities.</p>
          <Link href="/post" className="inline-block bg-amber-400 text-purple-900 px-5 py-2.5 rounded-full font-bold text-sm">
            Post Free Ad &rsaquo;
          </Link>
        </div>

        {/* Verified Professionals Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <Zap className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-amber-700 text-sm">
            <span className="font-semibold text-amber-800">New:</span> Verified Professionals - hire trusted verified professionals instantly across Dubai
          </p>
        </div>

        {/* Browse Categories */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900">Browse Categories</h3>
            <Link href="/browse" className="text-purple-600 text-sm font-medium flex items-center">
              All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {browseCategories.map((cat) => (
              <Link
                key={cat.id}
                href={cat.href}
                className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl border border-gray-100"
              >
                <span className="text-2xl">{cat.emoji}</span>
                <span className="text-xs font-medium text-gray-700 text-center">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Ads */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <span className="text-lg">⭐</span> Featured Ads
            </h3>
            <Link href="/browse" className="text-purple-600 text-sm font-medium flex items-center">
              All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex overflow-x-auto hide-scrollbar gap-3 pb-2 -mx-4 px-4">
            {featuredAds.map((ad) => (
              <Link key={ad.id} href={`/listing/${ad.id}`} className="flex-shrink-0 w-44">
                <div className={`${ad.bgColor} rounded-xl border border-gray-100 overflow-hidden`}>
                  <div className="relative h-24 flex items-center justify-center">
                    <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold text-white ${
                      ad.badge === 'HOT' ? 'bg-red-500' : ad.badge === 'NEW' ? 'bg-purple-500' : 'bg-green-500'
                    }`}>
                      {ad.badge}
                    </span>
                    <div className="absolute top-2 right-2 w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-xs">🏷️</span>
                    </div>
                    <span className="text-4xl">{ad.emoji}</span>
                  </div>
                  <div className="p-3">
                    <p className="text-purple-600 font-bold text-sm">{ad.price}</p>
                    <p className="text-gray-900 font-medium text-xs truncate">{ad.title}</p>
                    <p className="text-gray-500 text-[10px] flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" /> {ad.location}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      {ad.verified && (
                        <span className="text-green-600 text-[10px] font-medium flex items-center gap-0.5">
                          ✓ Verified
                        </span>
                      )}
                      <span className="text-gray-400 text-[10px]">{ad.time}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Labour & Services */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <span className="text-lg">🛠️</span> Services
            </h3>
            <Link href="/browse?category=Services" className="text-purple-600 text-sm font-medium flex items-center">
              All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <p className="text-gray-500 text-xs mb-3">Moving, maintenance, cleaning, tutoring & more</p>
          
          {/* Service Chips */}
          <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-3 pb-1">
            {serviceChips.map((chip) => (
              <button
                key={chip}
                onClick={() => setSelectedServiceChip(chip)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all ${
                  selectedServiceChip === chip
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-700 border-gray-200'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Service Cards */}
          <div className="grid grid-cols-2 gap-3">
            {labourServices.map((service) => (
              <Link key={service.id} href={`/listing/${service.id}`}>
                <div className={`${service.bgColor} rounded-xl border border-gray-100 p-3`}>
                  <div className="h-20 flex items-center justify-center mb-2">
                    <span className="text-4xl">{service.emoji}</span>
                  </div>
                  <p className="text-purple-600 font-bold text-sm">{service.price}</p>
                  <p className="text-gray-900 font-medium text-xs">{service.title} &bull; {service.origin}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-green-600 text-[10px] font-medium bg-green-50 px-2 py-0.5 rounded">
                      {service.status}
                    </span>
                    <span className="text-gray-500 text-[10px] bg-gray-100 px-2 py-0.5 rounded">
                      {service.experience}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Trending Motors (replaces Farmland) */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <span className="text-lg">🏎️</span> Trending Motors
            </h3>
            <Link href="/browse?category=Cars" className="text-purple-600 text-sm font-medium flex items-center">
              All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex overflow-x-auto hide-scrollbar gap-3 pb-2 -mx-4 px-4">
            {trendingMotors.map((ad) => (
              <Link key={ad.id} href={`/listing/${ad.id}`} className="flex-shrink-0 w-40">
                <div className={`${ad.bgColor} rounded-xl border border-gray-100 overflow-hidden`}>
                  <div className="relative h-24 flex items-center justify-center">
                    <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold text-white ${
                      ad.badge === 'GCC' ? 'bg-blue-600' : ad.badge === 'SUV' ? 'bg-gray-600' : 'bg-purple-600'
                    }`}>
                      {ad.badge}
                    </span>
                    <span className="text-4xl">{ad.emoji}</span>
                  </div>
                  <div className="p-3">
                    <p className="text-purple-600 font-bold text-sm">{ad.price}</p>
                    <p className="text-gray-900 font-medium text-xs truncate">{ad.title}</p>
                    <p className="text-gray-500 text-[10px] flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" /> {ad.location}
                    </p>
                    <span className={`inline-block mt-2 text-[10px] font-medium px-2 py-0.5 rounded ${
                      ad.status === 'Premium' ? 'bg-blue-100 text-blue-700' : 
                      ad.status === 'Clean' ? 'bg-gray-100 text-gray-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {ad.status}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* AI Recommended Banner */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-4 flex items-center gap-3">
          <span className="text-2xl">🤖</span>
          <p className="text-white font-medium text-sm">AI - RECOMMENDED FOR YOU</p>
        </div>

        {/* Live & Online */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <span className="text-lg">💬</span> Live & Online
            </h3>
            <Link href="/browse" className="text-purple-600 text-sm font-medium flex items-center">
              All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex overflow-x-auto hide-scrollbar gap-3 pb-2 -mx-4 px-4">
            {whatsappActive.map((item) => (
              <Link key={item.id} href={`/listing/${item.id}`} className="flex-shrink-0 w-40">
                <div className={`${item.bgColor} rounded-xl border border-green-200 p-3 relative`}>
                  <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">💬</span>
                  </div>
                  <div className="h-16 flex items-center justify-center mb-2">
                    <span className="text-3xl">{item.emoji}</span>
                  </div>
                  <p className="text-gray-900 font-semibold text-xs">{item.title}</p>
                  <p className="text-gray-500 text-[10px] mt-1">{item.time}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Emergency Help Banner */}
        <Link href="/help" className="block">
          <div className="bg-red-600 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">SOS</span>
            </div>
            <div className="flex-1">
              <p className="text-white font-bold">Emergency Help</p>
              <p className="text-red-100 text-xs">Labour rights, lost documents, medical help in UAE</p>
            </div>
            <ChevronRight className="w-5 h-5 text-white" />
          </div>
        </Link>

        {/* Refer & Earn Banner */}
        <div className="bg-purple-600 rounded-xl p-4 flex items-center gap-3">
          <div className="flex-1">
            <p className="text-white font-bold">Refer & Earn</p>
            <p className="text-purple-200 text-xs mb-2">Invite friends, earn 50 coins each!</p>
            <div className="inline-block px-3 py-1.5 border border-dashed border-purple-300 rounded text-purple-100 text-xs font-mono">
              KISMAG2025
            </div>
          </div>
          <span className="text-4xl">🎁</span>
        </div>

        {/* Go VIP Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <span className="text-2xl">👑</span>
          <div className="flex-1">
            <p className="text-gray-900 font-bold">Go VIP - Get 10x More Views</p>
            <p className="text-gray-600 text-xs">Featured badge &bull; Priority listing &bull; Verified tick</p>
          </div>
          <Link href="/rewards" className="px-4 py-2 bg-amber-500 text-white rounded-full font-bold text-sm">
            Upgrade
          </Link>
        </div>
      </main>

      <BottomNavigation />
      <AuthModal />
    </div>
  )
}
