'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { TopTabs } from '@/components/top-tabs'
import { BottomNavigation } from '@/components/bottom-navigation'
import { AuthModal } from '@/components/auth-modal'
import { useAppStore, countryFilters } from '@/lib/store'
import { X, ArrowLeft, Users } from 'lucide-react'

export default function GroupsPage() {
  const { communityGroups, joinGroup, requestCommunity, isAuthenticated, setShowAuthModal, pendingCommunities, isAdmin, approveCommunity } = useAppStore()
  const [selectedCountry, setSelectedCountry] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showPendingModal, setShowPendingModal] = useState(false)
  const [newGroup, setNewGroup] = useState({
    name: '',
    country: 'India',
    flag: '🇮🇳',
    activity: ''
  })

  const filteredGroups = communityGroups.filter(g => 
    selectedCountry === 'all' || g.country.toLowerCase() === selectedCountry
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

  const handleCountryChange = (countryId: string) => {
    const country = countryFilters.find(c => c.id === countryId)
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
        <p className="text-gray-500 text-sm mb-4">Connect with your community - share jobs, find help, chat free</p>

        {/* Country Filters */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-4 pb-1">
          {countryFilters.map((country) => (
            <button
              key={country.id}
              onClick={() => setSelectedCountry(country.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
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

        {/* Groups Count */}
        <p className="text-gray-400 text-sm mb-3">{filteredGroups.length} communities found</p>

        {/* Groups List */}
        <div className="space-y-3">
          {filteredGroups.map((group) => (
            <div key={group.id} className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center">
                <span className="text-3xl">{group.flag}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{group.name}</h3>
                <p className="text-gray-500 text-sm flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {group.members.toLocaleString()} members - {group.activity}
                </p>
              </div>
              <button
                onClick={() => joinGroup(group.id)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                  group.joined
                    ? 'bg-purple-100 text-purple-600 border border-purple-200'
                    : 'bg-purple-600 text-white'
                }`}
              >
                {group.joined ? 'Joined' : 'Join'}
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Create Community Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50">
          <div className="w-full max-w-lg bg-white rounded-t-3xl max-h-[90vh] overflow-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
              <button onClick={() => setShowCreateModal(false)} className="p-2">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h2 className="text-lg font-bold text-gray-900">Create Community</h2>
              <button onClick={() => setShowCreateModal(false)} className="p-2">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="px-5 pb-8 pt-4">
              <p className="text-gray-500 text-sm mb-4">Your community will be reviewed by admin before being published.</p>

              {/* Community Name */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Community Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Punjabis in Dubai"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                  className="w-full p-4 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400"
                />
              </div>

              {/* Country */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Country *</label>
                <select
                  value={countryFilters.find(c => c.name === newGroup.country)?.id || 'india'}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="w-full p-4 bg-white border border-gray-200 rounded-xl text-gray-900"
                >
                  {countryFilters.filter(c => c.id !== 'all').map((country) => (
                    <option key={country.id} value={country.id}>{country.flag} {country.name}</option>
                  ))}
                </select>
              </div>

              {/* Activity/Description */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Activity / Description *</label>
                <input
                  type="text"
                  placeholder="e.g. Jobs & support, Cultural events"
                  value={newGroup.activity}
                  onChange={(e) => setNewGroup({ ...newGroup, activity: e.target.value })}
                  className="w-full p-4 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400"
                />
              </div>

              <button
                onClick={handleCreateGroup}
                className="w-full py-4 bg-purple-600 text-white font-bold rounded-xl"
              >
                Submit for Approval
              </button>

              <p className="text-center text-gray-400 text-xs mt-3">Admin will review and approve within 24 hours</p>
            </div>
          </div>
        </div>
      )}

      {/* Admin Pending Communities Modal */}
      {showPendingModal && isAdmin() && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50">
          <div className="w-full max-w-lg bg-white rounded-t-3xl max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
              <button onClick={() => setShowPendingModal(false)} className="p-2">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h2 className="text-lg font-bold text-gray-900">Pending Approvals</h2>
              <button onClick={() => setShowPendingModal(false)} className="p-2">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="px-4 py-4">
              {pendingCommunities.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No pending communities</p>
              ) : (
                <div className="space-y-3">
                  {pendingCommunities.map((group) => (
                    <div key={group.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{group.flag}</span>
                        <div>
                          <h3 className="font-bold text-gray-900">{group.name}</h3>
                          <p className="text-gray-500 text-sm">{group.country} - {group.activity}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          approveCommunity(group.id)
                          if (pendingCommunities.length === 1) {
                            setShowPendingModal(false)
                          }
                        }}
                        className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg"
                      >
                        Approve Community
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <BottomNavigation />
      <AuthModal />
    </div>
  )
}
