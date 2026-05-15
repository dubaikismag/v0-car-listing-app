'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { Header } from '@/components/header'
import { TopTabs } from '@/components/top-tabs'
import { BottomNavigation } from '@/components/bottom-navigation'
import { AuthModal } from '@/components/auth-modal'
import { useAppStore, countryFilters } from '@/lib/store'
import { X, ArrowLeft, Users } from 'lucide-react'

export default function GroupsPage() {
  const store = useAppStore()

  const [selectedCountry, setSelectedCountry] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showPendingModal, setShowPendingModal] = useState(false)
  const [newGroup, setNewGroup] = useState({
    name: '',
    country: 'India',
    flag: '🇮🇳',
    activity: ''
  })

  // SAFE STORE ACCESS (prevents build crash)
  const communityGroups = store?.communityGroups || []
  const joinGroup = store?.joinGroup || (() => {})
  const requestCommunity = store?.requestCommunity || (() => {})
  const isAuthenticated = store?.isAuthenticated || false
  const setShowAuthModal = store?.setShowAuthModal || (() => {})
  const pendingCommunities = store?.pendingCommunities || []
  const isAdmin = store?.isAdmin || (() => false)
  const approveCommunity = store?.approveCommunity || (() => {})

  const countryList = countryFilters || []

  const filteredGroups = communityGroups.filter(g =>
    selectedCountry === 'all' || g.country?.toLowerCase() === selectedCountry
  )

  const handleCreateGroup = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }

    if (!newGroup.name.trim() || !newGroup.activity.trim()) {
      alert('Please fill in all fields')
      return
    }

    requestCommunity({
      name: newGroup.name,
      members: 1,
      activity: newGroup.activity,
      country: newGroup.country,
      flag: newGroup.flag,
      joined: true
    })

    setShowCreateModal(false)
    setNewGroup({ name: '', country: 'India', flag: '🇮🇳', activity: '' })
    alert('Your community request has been submitted for admin approval!')
  }

  const handleCountryChange = (countryId) => {
    const country = countryList.find(c => c.id === countryId)
    if (country) {
      setNewGroup(prev => ({
        ...prev,
        country: country.name,
        flag: country.flag
      }))
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f3ff] pb-20">
      <Header />
      <TopTabs />

      <main className="px-4 py-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>🌍</span> Community Groups
          </h2>

          <div className="flex items-center gap-2">
            {isAdmin() && pendingCommunities.length > 0 && (
              <button
                onClick={() => setShowPendingModal(true)}
                className="text-amber-600 font-semibold text-sm flex items-center gap-1"
              >
                ⏳ {pendingCommunities.length} Pending
              </button>
            )}

            <button
              onClick={() => setShowCreateModal(true)}
              className="text-purple-600 font-semibold text-sm"
            >
              + Create
            </button>
          </div>
        </div>

        <p className="text-gray-500 text-sm mb-4">
          Connect with your community - share jobs, find help, chat free
        </p>

        {/* Country Filters */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-4 pb-1">
          {countryList.map((country) => (
            <button
              key={country.id}
              onClick={() => setSelectedCountry(country.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedCountry === country.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-700'
              }`}
            >
              <span>{country.flag}</span>
              <span>{country.name}</span>
            </button>
          ))}
        </div>

        <p className="text-gray-400 text-sm mb-3">
          {filteredGroups.length} communities found
        </p>

        {/* Groups */}
        <div className="space-y-3">
          {filteredGroups.map((group) => (
            <div key={group.id} className="bg-white rounded-xl p-4 border flex items-center gap-4">
              <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center">
                <span className="text-3xl">{group.flag}</span>
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{group.name}</h3>
                <p className="text-gray-500 text-sm flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {group.members} members - {group.activity}
                </p>
              </div>

              <button
                onClick={() => joinGroup(group.id)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm ${
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
      </main>

      <BottomNavigation />
      <AuthModal />

      {/* MODALS (unchanged UI logic kept safe) */}

      {showCreateModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-5">

            <div className="flex justify-between mb-3">
              <button onClick={() => setShowCreateModal(false)}>
                <ArrowLeft />
              </button>
              <h2 className="font-bold">Create Community</h2>
              <button onClick={() => setShowCreateModal(false)}>
                <X />
              </button>
            </div>

            <input
              className="w-full p-3 border rounded mb-3"
              placeholder="Community Name"
              value={newGroup.name}
              onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
            />

            <input
              className="w-full p-3 border rounded mb-3"
              placeholder="Activity"
              value={newGroup.activity}
              onChange={(e) => setNewGroup({ ...newGroup, activity: e.target.value })}
            />

            <button
              onClick={handleCreateGroup}
              className="w-full bg-purple-600 text-white py-3 rounded"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
