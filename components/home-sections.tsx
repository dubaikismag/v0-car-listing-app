'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, X } from 'lucide-react'
import { useAppStore, categories } from '@/lib/store'

// Stats Bar
export function StatsBar() {
  return (
    <div className="grid grid-cols-4 gap-2 px-4 py-3 bg-white">
      {[
        { value: '48K+', label: 'Listings', color: 'text-purple-600' },
        { value: '12K+', label: 'Members', color: 'text-purple-600' },
        { value: '180+', label: 'Countries', color: 'text-purple-600' },
        { value: '98%', label: 'Verified', color: 'text-purple-600' }
      ].map((stat) => (
        <div key={stat.label} className="text-center">
          <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
          <p className="text-xs text-gray-500">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}

// Hero Banner
export function HeroBanner() {
  return (
    <div className="mx-4 my-3 p-5 rounded-2xl gradient-purple relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10" />
      <div className="absolute bottom-0 right-10 w-20 h-20 bg-white/10 rounded-full mb-5" />
      
      <div className="relative z-10">
        <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-white text-xs font-medium mb-3">
          🇦🇪 DUBAI #1 CLASSIFIEDS
        </div>
        <h2 className="text-2xl font-bold text-white mb-1">Buy, Sell & Connect</h2>
        <h3 className="text-xl font-bold text-white mb-2">Instantly in UAE</h3>
        <p className="text-white/80 text-sm mb-4">Post your first ad FREE — 12,000+ active buyers</p>
        <Link
          href="/post"
          className="inline-block px-5 py-2.5 bg-amber-400 rounded-lg text-purple-900 font-semibold text-sm"
        >
          Post Free Ad &rsaquo;
        </Link>
      </div>
    </div>
  )
}

// New Labour Profiles Banner
export function LabourBanner() {
  return (
    <div className="mx-4 my-2 p-4 rounded-xl bg-amber-50 border border-amber-200">
      <div className="flex items-start gap-3">
        <span className="text-2xl">⚡</span>
        <p className="text-sm text-amber-800">
          <span className="font-semibold text-purple-700">New: Verified Labour Profiles</span> — hire trusted workers instantly in Dubai
        </p>
      </div>
    </div>
  )
}

// Browse Categories
export function BrowseCategories() {
  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Browse Categories</h3>
        <Link href="/browse" className="text-purple-600 text-sm font-medium">All &rsaquo;</Link>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/browse?category=${cat.id}`}
            className="flex flex-col items-center p-3 bg-white rounded-xl border border-gray-100"
          >
            <span className="text-3xl mb-2">{cat.emoji}</span>
            <span className="text-xs text-gray-700 text-center font-medium">{cat.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

// Featured Ads
export function FeaturedAds() {
  const { listings } = useAppStore()
  const featured = listings.filter(l => l.isFeatured).slice(0, 6)

  const getBadgeClass = (badge?: string) => {
    switch (badge) {
      case 'HOT': return 'badge-hot'
      case 'NEW': return 'badge-new'
      case 'SALE': return 'badge-sale'
      case 'HIRE': return 'badge-hire'
      case 'FARM': return 'badge-farm'
      case 'FRESH': return 'badge-fresh'
      case 'TOOLS': return 'badge-tools'
      default: return 'bg-gray-500'
    }
  }

  const formatPrice = (listing: typeof listings[0]) => {
    const price = listing.price.toLocaleString()
    switch (listing.priceType) {
      case 'monthly': return `AED ${price}/mo`
      case 'yearly': return `AED ${price}/yr`
      case 'kg': return `AED ${price}/kg`
      default: return `AED ${price}`
    }
  }

  return (
    <div className="py-4">
      <div className="flex items-center justify-between px-4 mb-3">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span>⭐</span> Featured Ads
        </h3>
        <Link href="/browse" className="text-purple-600 text-sm font-medium">All &rsaquo;</Link>
      </div>
      <div className="flex overflow-x-auto hide-scrollbar gap-3 px-4">
        {featured.map((listing) => (
          <Link
            key={listing.id}
            href={`/listing/${listing.id}`}
            className="flex-shrink-0 w-40 bg-white rounded-xl border border-gray-100 overflow-hidden"
          >
            <div className="relative h-24 bg-gray-50 flex items-center justify-center">
              {listing.badge && (
                <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-white text-xs font-bold ${getBadgeClass(listing.badge)}`}>
                  {listing.badge}
                </span>
              )}
              <span className="text-4xl">{listing.emoji}</span>
            </div>
            <div className="p-3">
              <p className="text-purple-600 font-bold text-sm">{formatPrice(listing)}</p>
              <p className="text-gray-900 text-sm font-medium truncate">{listing.title}</p>
              <p className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                <span className="text-red-400">📍</span> {listing.location}
              </p>
              <div className="flex items-center justify-between mt-2">
                {listing.verified && (
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded font-medium">✓ Verified</span>
                )}
                {listing.timeAgo && (
                  <span className="text-xs text-gray-400">{listing.timeAgo}</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

// Labour & Services Section
export function LabourServices() {
  const { labourProfiles } = useAppStore()
  const [selectedFilter, setSelectedFilter] = useState('All')
  const [showDetail, setShowDetail] = useState<string | null>(null)
  
  const filters = ['All', 'Electrician', 'Plumber', 'Painter', 'AC Tech', 'Driver']
  const selectedProfile = labourProfiles.find(p => p.id === showDetail)

  return (
    <div className="py-4">
      <div className="flex items-center justify-between px-4 mb-2">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span>👷</span> Labour & Services
        </h3>
        <Link href="/browse?category=labour" className="text-purple-600 text-sm font-medium">All &rsaquo;</Link>
      </div>
      <p className="text-gray-500 text-sm px-4 mb-3">Plumbing, electrical, painting, cleaning & more</p>
      
      {/* Filters */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 px-4 mb-4">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
              selectedFilter === filter
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Labour Cards */}
      <div className="grid grid-cols-2 gap-3 px-4">
        {labourProfiles.slice(0, 2).map((profile) => (
          <button
            key={profile.id}
            onClick={() => setShowDetail(profile.id)}
            className="bg-green-50 rounded-xl p-4 text-left border border-green-100"
          >
            <span className="text-4xl block mb-2">{profile.emoji}</span>
            <p className="text-purple-600 font-bold">AED {profile.price.toLocaleString()}/mo</p>
            <p className="text-gray-900 font-medium text-sm">{profile.title} • {profile.origin}</p>
            <div className="flex gap-2 mt-2">
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Available</span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{profile.experience}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Detail Modal */}
      {showDetail && selectedProfile && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50">
          <div className="w-full max-w-lg bg-white rounded-t-3xl max-h-[80vh] overflow-auto">
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>
            <div className="px-5 pb-6">
              <div className="text-center mb-4">
                <span className="text-5xl">{selectedProfile.emoji}</span>
                <p className="text-2xl font-bold text-purple-600 mt-2">AED {selectedProfile.price.toLocaleString()}/mo</p>
                <p className="text-xl font-semibold text-gray-900">{selectedProfile.title} {selectedProfile.origin}</p>
                <p className="text-gray-500 flex items-center justify-center gap-1">
                  <span className="text-red-400">📍</span> {selectedProfile.location}
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-2">DESCRIPTION</p>
                <p className="text-gray-700 text-sm">{selectedProfile.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <a
                  href={`https://wa.me/${selectedProfile.whatsapp.replace(/[^0-9]/g, '')}`}
                  className="flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl font-semibold"
                >
                  <span>💬</span> WhatsApp
                </a>
                <a
                  href={`tel:${selectedProfile.phone}`}
                  className="flex items-center justify-center gap-2 py-3 bg-purple-600 text-white rounded-xl font-semibold"
                >
                  <span>📞</span> Call
                </a>
              </div>
              
              <button
                onClick={() => setShowDetail(null)}
                className="w-full py-3 border border-gray-200 rounded-xl text-gray-600 font-medium flex items-center justify-center gap-2"
              >
                <span>📌</span> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Farmland Section
export function FarmlandSection() {
  const { listings } = useAppStore()
  const farmListings = listings.filter(l => l.category === 'Farmland').slice(0, 3)

  const getBadgeClass = (badge?: string) => {
    switch (badge) {
      case 'FARM': return 'badge-farm'
      case 'FRESH': return 'badge-fresh'
      case 'TOOLS': return 'badge-tools'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="py-4">
      <div className="flex items-center justify-between px-4 mb-3">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span>🌾</span> Farmland & Agriculture
        </h3>
        <Link href="/browse?category=farmland" className="text-purple-600 text-sm font-medium">All &rsaquo;</Link>
      </div>
      <div className="flex overflow-x-auto hide-scrollbar gap-3 px-4">
        {farmListings.map((listing) => (
          <Link
            key={listing.id}
            href={`/listing/${listing.id}`}
            className="flex-shrink-0 w-40 bg-green-50 rounded-xl border border-green-100 overflow-hidden"
          >
            <div className="relative h-20 flex items-center justify-center">
              {listing.badge && (
                <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-white text-xs font-bold ${getBadgeClass(listing.badge)}`}>
                  {listing.badge}
                </span>
              )}
              <span className="text-4xl">{listing.emoji}</span>
            </div>
            <div className="p-3 bg-white">
              <p className="text-purple-600 font-bold text-sm">
                AED {listing.price.toLocaleString()}{listing.priceType === 'yearly' ? '/yr' : listing.priceType === 'kg' ? '/kg' : ''}
              </p>
              <p className="text-gray-900 text-sm font-medium truncate">{listing.title}</p>
              <p className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                <span className="text-red-400">📍</span> {listing.location}
              </p>
              <span className={`mt-2 inline-block text-xs px-2 py-0.5 rounded font-medium ${
                listing.badge === 'FRESH' ? 'bg-teal-100 text-teal-700' : 
                listing.badge === 'FARM' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {listing.badge === 'FRESH' ? 'Fresh' : listing.badge === 'FARM' ? 'Available' : 'Used'}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

// AI Recommended Banner
export function AIRecommended() {
  return (
    <div className="mx-4 my-3 p-4 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900">
      <p className="text-white text-sm flex items-center gap-2">
        <span>🤖</span> AI — RECOMMENDED FOR YOU
      </p>
    </div>
  )
}

// WhatsApp Active Section
export function WhatsAppActiveSection() {
  const { whatsappActive } = useAppStore()

  return (
    <div className="py-4">
      <div className="flex items-center justify-between px-4 mb-3">
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <span>💬</span> WhatsApp Active
        </h3>
        <Link href="/browse" className="text-purple-600 text-sm font-medium">All &rsaquo;</Link>
      </div>
      <div className="flex overflow-x-auto hide-scrollbar gap-3 px-4">
        {whatsappActive.map((item) => (
          <div
            key={item.id}
            className="flex-shrink-0 w-40 bg-green-50 rounded-xl p-4 border border-green-100 relative"
          >
            <div className="absolute top-3 right-3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">💬</span>
            </div>
            <span className="text-4xl block mb-2">{item.emoji}</span>
            <p className="text-gray-900 font-semibold text-sm">{item.title}</p>
            <p className="text-gray-500 text-xs mt-1">{item.activeTime}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// Emergency Help Banner
export function EmergencyHelpBanner() {
  const [showHelp, setShowHelp] = useState(false)

  const helplines = [
    { icon: '👷', name: 'Labour Rights Helpline', number: '800 60' },
    { icon: '🚨', name: 'Police Emergency', number: '999' },
    { icon: '🚑', name: 'Ambulance', number: '998' },
    { icon: '🔥', name: 'Fire Department', number: '997' },
    { icon: '📄', name: 'Lost Documents / Passport Help', number: '' },
    { icon: '💰', name: 'Unpaid Salary Complaint', number: '' },
    { icon: '🏠', name: 'Accommodation Emergency', number: '' }
  ]

  return (
    <>
      <button
        onClick={() => setShowHelp(true)}
        className="mx-4 my-3 p-4 rounded-xl gradient-red flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">SOS</span>
          </div>
          <div className="text-left">
            <p className="text-white font-bold">Emergency Help</p>
            <p className="text-white/80 text-sm">Labour rights, lost documents, medical help in UAE</p>
          </div>
        </div>
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {showHelp && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50">
          <div className="w-full max-w-lg bg-white rounded-t-3xl max-h-[80vh] overflow-auto">
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>
            <div className="px-5 pb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <span className="bg-red-500 text-white px-2 py-0.5 rounded text-sm">SOS</span>
                  Emergency Help UAE
                </h2>
                <button onClick={() => setShowHelp(false)}>
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>
              
              <div className="space-y-1">
                {helplines.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-gray-900">{item.name}</span>
                    </div>
                    {item.number && (
                      <a href={`tel:${item.number}`} className="text-purple-600 font-bold">{item.number}</a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Refer & Earn Banner
export function ReferEarnBanner() {
  return (
    <div className="mx-4 my-3 p-4 rounded-xl gradient-purple">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white font-bold text-lg">Refer & Earn</p>
          <p className="text-white/80 text-sm">Invite friends, earn 50 coins each!</p>
          <div className="mt-2 inline-block px-3 py-1.5 bg-gray-900/50 rounded border border-dashed border-white/50">
            <span className="text-white font-mono text-sm">KISMAG2025</span>
          </div>
        </div>
        <span className="text-5xl">🎁</span>
      </div>
    </div>
  )
}

// Go VIP Banner
export function GoVIPBanner() {
  return (
    <div className="mx-4 my-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-900 font-bold flex items-center gap-2">
            <span>👑</span> Go VIP — Get 10x More Views
          </p>
          <p className="text-gray-600 text-sm">Featured badge • Priority listing • Verified tick</p>
        </div>
        <button className="px-4 py-2 bg-amber-400 rounded-lg text-purple-900 font-semibold text-sm">
          Upgrade
        </button>
      </div>
    </div>
  )
}

// Wanted Preview Section
export function WantedPreview() {
  const { wantedPosts } = useAppStore()
  
  return (
    <div className="py-4">
      <div className="flex items-center justify-between px-4 mb-3">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span>🤝</span> Wanted & Required
        </h3>
        <Link href="/wanted" className="text-purple-600 text-sm font-medium">All &rsaquo;</Link>
      </div>
      <div className="px-4 space-y-3">
        {wantedPosts.slice(0, 2).map((post) => (
          <div key={post.id} className="bg-white rounded-xl p-4 border border-gray-100">
            <h4 className="font-semibold text-gray-900 mb-1">{post.title}</h4>
            <p className="text-gray-500 text-sm mb-2">{post.budget} - {post.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>{post.userFlag}</span>
                <span className="text-sm text-gray-600">{post.userName}</span>
              </div>
              <button className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm font-medium">
                Contact
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Community Groups Preview
export function GroupsPreview() {
  const { communityGroups, joinGroup } = useAppStore()
  
  return (
    <div className="py-4">
      <div className="flex items-center justify-between px-4 mb-3">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span>🌍</span> Community Groups
        </h3>
        <Link href="/groups" className="text-purple-600 text-sm font-medium">All &rsaquo;</Link>
      </div>
      <div className="px-4 space-y-2">
        {communityGroups.slice(0, 3).map((group) => (
          <div key={group.id} className="bg-white rounded-xl p-3 border border-gray-100 flex items-center gap-3">
            <span className="text-2xl">{group.flag}</span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{group.name}</p>
              <p className="text-xs text-gray-500">{group.members.toLocaleString()} members</p>
            </div>
            <button
              onClick={() => joinGroup(group.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                group.joined
                  ? 'bg-purple-100 text-purple-600'
                  : 'bg-purple-600 text-white'
              }`}
            >
              {group.joined ? 'Joined' : 'Join'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
