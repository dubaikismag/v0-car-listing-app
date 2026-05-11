import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Listing {
  id: string
  title: string
  price: number
  priceType?: 'fixed' | 'monthly' | 'yearly' | 'kg'
  category: string
  subcategory?: string
  location: string
  emoji: string
  badge?: 'HOT' | 'NEW' | 'SALE' | 'HIRE' | 'FARM' | 'FRESH' | 'TOOLS'
  verified?: boolean
  timeAgo?: string
  phone: string
  whatsapp: string
  description: string
  images: string[]
  specs?: Record<string, string>
  isFeatured?: boolean
  featuredDays?: number
  views?: number
}

export interface LabourProfile {
  id: string
  title: string
  price: number
  emoji: string
  location: string
  experience: string
  description: string
  available: boolean
  phone: string
  whatsapp: string
  origin?: string
}

export interface WantedPost {
  id: string
  title: string
  budget: string
  description: string
  category: string
  tags: string[]
  userName: string
  userCountry: string
  userFlag: string
}

export interface CommunityGroup {
  id: string
  name: string
  members: number
  activity: string
  country: string
  flag: string
  joined?: boolean
}

export interface WhatsAppActive {
  id: string
  title: string
  emoji: string
  activeTime: string
}

export interface User {
  id: string
  name: string
  email?: string
  phone?: string
  location?: string
  memberSince?: string
  verified?: boolean
  activeAds?: number
  coins?: number
  rating?: number
  sold?: number
}

interface AppState {
  user: User | null
  isAuthenticated: boolean
  listings: Listing[]
  labourProfiles: LabourProfile[]
  wantedPosts: WantedPost[]
  communityGroups: CommunityGroup[]
  whatsappActive: WhatsAppActive[]
  savedAds: string[]
  currentTab: string
  showAuthModal: boolean
  coins: number
  dailyCheckedIn: boolean
  
  setUser: (user: User | null) => void
  setAuthenticated: (val: boolean) => void
  addListing: (listing: Listing) => void
  toggleSavedAd: (id: string) => void
  setCurrentTab: (tab: string) => void
  setShowAuthModal: (show: boolean) => void
  addCoins: (amount: number) => void
  joinGroup: (groupId: string) => void
  claimDaily: () => void
  getSortedListings: (category?: string) => Listing[]
}

const sampleListings: Listing[] = [
  {
    id: '1',
    title: 'Toyota Camry 2020',
    price: 28000,
    category: 'Vehicles',
    subcategory: 'Cars',
    location: 'Dubai Marina',
    emoji: '🚗',
    badge: 'HOT',
    verified: true,
    timeAgo: '1h ago',
    phone: '+971501234567',
    whatsapp: '+971501234567',
    description: 'Well maintained Toyota Camry 2020 model. Single owner, full service history.',
    images: [],
    specs: { Year: '2020', KM: '45,000', Color: 'White', Doors: '4', Seats: '5', Engine: '2.5L' },
    isFeatured: true,
    featuredDays: 7,
    views: 234
  },
  {
    id: '2',
    title: '1 BHK Furnished',
    price: 3500,
    priceType: 'monthly',
    category: 'Property',
    subcategory: 'Apartments',
    location: 'Deira, Dubai',
    emoji: '🏠',
    badge: 'NEW',
    verified: true,
    timeAgo: '2h',
    phone: '+971502345678',
    whatsapp: '+971502345678',
    description: 'Fully furnished 1 BHK apartment in Deira. Close to metro station.',
    images: [],
    specs: { Bedrooms: '1', Bathrooms: '1', Size: '650 sqft', Furnished: 'Yes' },
    isFeatured: true,
    featuredDays: 14,
    views: 156
  },
  {
    id: '3',
    title: 'iPhone 14 Pro Max',
    price: 1200,
    category: 'Electronics',
    subcategory: 'Phones',
    location: 'Sharjah',
    emoji: '📱',
    badge: 'SALE',
    verified: true,
    phone: '+971503456789',
    whatsapp: '+971503456789',
    description: 'iPhone 14 Pro 256GB Deep Purple. 6 months old, with warranty.',
    images: [],
    specs: { Storage: '256GB', Color: 'Deep Purple', Warranty: '6 months' },
    views: 89
  },
  {
    id: '4',
    title: 'Driver Wanted Dubai',
    price: 4500,
    priceType: 'monthly',
    category: 'Jobs',
    subcategory: 'Driver',
    location: 'Dubai',
    emoji: '💼',
    badge: 'HIRE',
    phone: '+971504567890',
    whatsapp: '+971504567890',
    description: 'Looking for experienced driver with UAE license. Family driver position.',
    images: [],
    specs: { Type: 'Full-time', License: 'Required', Experience: '3+ years' },
    views: 67
  },
  {
    id: '5',
    title: 'Honda CBR 150 2022',
    price: 8500,
    category: 'Vehicles',
    subcategory: 'Motorcycles',
    location: 'Sharjah',
    emoji: '🏍️',
    phone: '+971505678901',
    whatsapp: '+971505678901',
    description: 'Honda CBR 150 in excellent condition. Low mileage.',
    images: [],
    specs: { Year: '2022', KM: '8,000', Color: 'Red/Black' },
    views: 45
  },
  {
    id: '6',
    title: 'Farm Plot 2 acres',
    price: 45000,
    priceType: 'yearly',
    category: 'Farmland',
    location: 'Al Ain',
    emoji: '🌾',
    badge: 'FARM',
    phone: '+971506789012',
    whatsapp: '+971506789012',
    description: 'Fertile farmland with water supply. Suitable for vegetables.',
    images: [],
    specs: { Size: '2 acres', Water: 'Available', Soil: 'Fertile' },
    views: 112
  },
  {
    id: '7',
    title: 'Organic Dates - Direct',
    price: 120,
    priceType: 'kg',
    category: 'Farmland',
    location: 'RAK',
    emoji: '🥦',
    badge: 'FRESH',
    phone: '+971507890123',
    whatsapp: '+971507890123',
    description: 'Fresh organic dates directly from farm. Premium quality.',
    images: [],
    specs: { Type: 'Medjool', Origin: 'RAK', Organic: 'Yes' },
    views: 78
  },
  {
    id: '8',
    title: 'Mini Tractor - Used',
    price: 8500,
    category: 'Farmland',
    location: 'Fujairah',
    emoji: '🚜',
    badge: 'TOOLS',
    phone: '+971508901234',
    whatsapp: '+971508901234',
    description: 'Mini tractor in good working condition. Ideal for small farms.',
    images: [],
    specs: { Brand: 'Kubota', Hours: '500', Condition: 'Good' },
    views: 34
  }
]

const sampleLabourProfiles: LabourProfile[] = [
  {
    id: 'l1',
    title: 'AC Technician',
    price: 2200,
    emoji: '👷',
    location: 'Dubai',
    experience: '5yr',
    origin: 'Kerala',
    description: 'Professional AC technician from Kerala with 5 years UAE experience. Expert in split AC, central AC, duct cleaning, and preventive maintenance. Available for immediate start.',
    available: true,
    phone: '+971509012345',
    whatsapp: '+971509012345'
  },
  {
    id: 'l2',
    title: 'Plumber',
    price: 1900,
    emoji: '🔧',
    location: 'Dubai',
    experience: '3yr',
    origin: 'Rajasthan',
    description: 'Experienced plumber from Rajasthan. Expert in all plumbing works.',
    available: true,
    phone: '+971509123456',
    whatsapp: '+971509123456'
  }
]

const sampleWantedPosts: WantedPost[] = [
  {
    id: 'w1',
    title: 'Looking for 2BHK Flat - Deira or Karama',
    budget: 'AED 4,000-5,000/mo',
    description: 'Furnished preferred',
    category: 'Property',
    tags: ['Property', 'Rental', 'Dubai'],
    userName: 'Ravi K.',
    userCountry: 'India',
    userFlag: '🇮🇳'
  },
  {
    id: 'w2',
    title: 'Need Electrician - Villa in Mirdif',
    budget: 'Short-term 3-day job',
    description: 'good pay, immediate',
    category: 'Labour',
    tags: ['Labour', 'Electrical', 'Mirdif'],
    userName: 'Ahmed S.',
    userCountry: 'Pakistan',
    userFlag: '🇵🇰'
  },
  {
    id: 'w3',
    title: 'Wanted: Used Samsung TV 50 inch+',
    budget: 'AED 400-700',
    description: 'Good condition only',
    category: 'Electronics',
    tags: ['Electronics', 'Used'],
    userName: 'Maria C.',
    userCountry: 'Philippines',
    userFlag: '🇵🇭'
  }
]

const sampleCommunityGroups: CommunityGroup[] = [
  { id: 'g1', name: 'Indians in Dubai', members: 3420, activity: 'Active daily', country: 'India', flag: '🇮🇳', joined: true },
  { id: 'g2', name: 'Kerala Community UAE', members: 2100, activity: 'Jobs & support', country: 'India', flag: '🇮🇳' },
  { id: 'g3', name: 'Tamil Nadu in Abu Dhabi', members: 980, activity: 'Tamil culture', country: 'India', flag: '🇮🇳' },
  { id: 'g4', name: 'Pakistani Community UAE', members: 2150, activity: 'Very active', country: 'Pakistan', flag: '🇵🇰' },
  { id: 'g5', name: 'Lahore Expats Dubai', members: 670, activity: 'City connections', country: 'Pakistan', flag: '🇵🇰' }
]

const sampleWhatsAppActive: WhatsAppActive[] = [
  { id: 'wa1', title: 'Electrician Needed', emoji: '👷', activeTime: 'Active 5 min ago' },
  { id: 'wa2', title: 'Room Deira AED 900', emoji: '🏠', activeTime: 'Active 12 min ago' },
  { id: 'wa3', title: 'Driver Hiring Now', emoji: '🚗', activeTime: 'Active 1h ago' }
]

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      listings: sampleListings,
      labourProfiles: sampleLabourProfiles,
      wantedPosts: sampleWantedPosts,
      communityGroups: sampleCommunityGroups,
      whatsappActive: sampleWhatsAppActive,
      savedAds: [],
      currentTab: 'Home',
      showAuthModal: false,
      coins: 45,
      dailyCheckedIn: false,
      
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setAuthenticated: (val) => set({ isAuthenticated: val }),
      addListing: (listing) => set((state) => ({ listings: [listing, ...state.listings] })),
      toggleSavedAd: (id) => set((state) => ({
        savedAds: state.savedAds.includes(id) 
          ? state.savedAds.filter(savedId => savedId !== id)
          : [...state.savedAds, id]
      })),
      setCurrentTab: (tab) => set({ currentTab: tab }),
      setShowAuthModal: (show) => set({ showAuthModal: show }),
      addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
      joinGroup: (groupId) => set((state) => ({
        communityGroups: state.communityGroups.map(g => 
          g.id === groupId ? { ...g, joined: !g.joined } : g
        )
      })),
      claimDaily: () => set((state) => ({ dailyCheckedIn: true, coins: state.coins + 5 })),
      getSortedListings: (category) => {
        return get().listings
          .filter((l) => !category || l.category === category)
          .sort((a, b) => {
            if (a.isFeatured && !b.isFeatured) return -1
            if (!a.isFeatured && b.isFeatured) return 1
            return (b.featuredDays || 0) - (a.featuredDays || 0)
          })
      }
    }),
    { name: 'dubaikismag-storage' }
  )
)

export const categories = [
  { id: 'vehicles', name: 'Vehicles', emoji: '🚗' },
  { id: 'property', name: 'Property', emoji: '🏠' },
  { id: 'jobs', name: 'Jobs', emoji: '💼' },
  { id: 'labour', name: 'Labour', emoji: '👷' },
  { id: 'electronics', name: 'Electronics', emoji: '📱' },
  { id: 'furniture', name: 'Furniture', emoji: '🛋️' },
  { id: 'farmland', name: 'Farmland', emoji: '🌾' },
  { id: 'more', name: 'More...', emoji: '📦' }
]

export const topTabs = [
  { id: 'home', name: 'Home', emoji: '🏠' },
  { id: 'jobs', name: 'Jobs', emoji: '💼' },
  { id: 'rooms', name: 'Rooms', emoji: '🏘️' },
  { id: 'ads', name: 'Ads', emoji: '📋' },
  { id: 'reels', name: 'Reels', emoji: '🎬' },
  { id: 'wanted', name: 'Wanted', emoji: '🤝' },
  { id: 'groups', name: 'Groups', emoji: '🌍' },
  { id: 'fun', name: 'Fun', emoji: '🎮' },
  { id: 'post', name: '+ Post', emoji: '' }
]
