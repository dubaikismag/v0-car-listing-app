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
  badge?: 'HOT' | 'NEW' | 'SALE' | 'HIRE' | 'FARM' | 'FRESH' | 'TOOLS' | 'LABOUR'
  verified?: boolean
  timeAgo?: string
  phone: string
  whatsapp: string
  description: string
  images: string[]
  specs?: Record<string, string>
  isFeatured?: boolean
  featured?: boolean
  vip?: boolean
  featuredDays?: number
  views?: number
  likes?: number
  shares?: number
  messages?: number
  contact?: string
  tags?: string[]
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
  pending?: boolean
}

export interface WhatsAppActive {
  id: string
  title: string
  emoji: string
  activeTime: string
}

export interface Notification {
  id: string
  title: string
  message: string
  icon: string
  time: string
  read: boolean
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
  profilePicture?: string
  isAdmin?: boolean
}

// UAE Locations
export const uaeLocations = [
  'Dubai Marina', 'Deira', 'Bur Dubai', 'JBR', 'Downtown Dubai', 'Business Bay',
  'Al Barsha', 'Jumeirah', 'Al Quoz', 'Dubai Silicon Oasis', 'International City',
  'Al Nahda', 'Karama', 'Satwa', 'Dubai Investment Park', 'DIFC', 'Palm Jumeirah',
  'Sharjah', 'Al Majaz', 'Al Nahda Sharjah', 'Industrial Area Sharjah',
  'Abu Dhabi City', 'Al Reem Island', 'Khalifa City', 'Mussafah', 'Al Ain',
  'Ajman', 'Al Nuaimiya', 'Ajman Industrial',
  'Ras Al Khaimah', 'RAK City', 'Al Nakheel RAK',
  'Fujairah', 'Fujairah City', 'Dibba',
  'Umm Al Quwain'
]

// Admin email
export const ADMIN_EMAIL = 'dubaikismag@gmail.com'

interface AppState {
  user: User | null
  isAuthenticated: boolean
  listings: Listing[]
  labourProfiles: LabourProfile[]
  wantedPosts: WantedPost[]
  communityGroups: CommunityGroup[]
  whatsappActive: WhatsAppActive[]
  savedAds: string[]
  likedAds: string[]
  currentTab: string
  showAuthModal: boolean
  coins: number
  dailyCheckedIn: boolean
  selectedLocation: string
  searchQuery: string
  pendingCommunities: CommunityGroup[]
  notifications: Notification[]
  
  setUser: (user: User | null) => void
  setAuthenticated: (val: boolean) => void
  addListing: (listing: Listing) => void
  deleteListing: (id: string) => void
  toggleSavedAd: (id: string) => void
  removeFavorite: (id: string) => void
  leaveGroup: (groupId: string) => void
  toggleLikedAd: (id: string) => void
  shareListing: (id: string) => void
  setCurrentTab: (tab: string) => void
  setShowAuthModal: (show: boolean) => void
  addCoins: (amount: number) => void
  joinGroup: (groupId: string) => void
  claimDaily: () => void
  setSelectedLocation: (location: string) => void
  setSearchQuery: (query: string) => void
  requestCommunity: (group: Omit<CommunityGroup, 'id' | 'pending'>) => void
  approveCommunity: (id: string) => void
  getFilteredListings: (category?: string, sort?: string, searchQuery?: string, location?: string) => Listing[]
  isAdmin: () => boolean
  addNotification: (notification: Omit<Notification, 'id' | 'read'>) => void
  markNotificationRead: (id: string) => void
  clearNotifications: () => void
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
    views: 234,
    likes: 45,
    shares: 12,
    tags: ['Verified', 'Inspected', 'Warranty']
  },
  {
    id: '2',
    title: '1 BHK Furnished',
    price: 3500,
    priceType: 'monthly',
    category: 'Property',
    subcategory: 'Apartments',
    location: 'Deira',
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
    views: 156,
    likes: 32,
    shares: 8,
    tags: ['Verified', 'Metro Nearby']
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
    views: 89,
    likes: 22,
    shares: 5,
    tags: ['Verified', 'With Warranty']
  },
  {
    id: '4',
    title: 'Driver Wanted Dubai',
    price: 4500,
    priceType: 'monthly',
    category: 'Jobs',
    subcategory: 'Driver',
    location: 'Downtown Dubai',
    emoji: '💼',
    badge: 'HIRE',
    phone: '+971504567890',
    whatsapp: '+971504567890',
    description: 'Looking for experienced driver with UAE license. Family driver position.',
    images: [],
    specs: { Type: 'Full-time', License: 'Required', Experience: '3+ years' },
    views: 67,
    likes: 15,
    shares: 3,
    tags: ['Urgent', 'Full-time']
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
    views: 45,
    likes: 18,
    shares: 2,
    tags: ['Low KM']
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
    views: 112,
    likes: 25,
    shares: 7,
    tags: ['Water Available', 'Ready to Farm']
  },
  {
    id: '7',
    title: 'Organic Dates - Direct',
    price: 120,
    priceType: 'kg',
    category: 'Farmland',
    location: 'Ras Al Khaimah',
    emoji: '🥦',
    badge: 'FRESH',
    phone: '+971507890123',
    whatsapp: '+971507890123',
    description: 'Fresh organic dates directly from farm. Premium quality.',
    images: [],
    specs: { Type: 'Medjool', Origin: 'RAK', Organic: 'Yes' },
    views: 78,
    likes: 35,
    shares: 10,
    tags: ['Organic', 'Fresh', 'Direct from Farm']
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
    views: 34,
    likes: 8,
    shares: 2,
    tags: ['Working Condition']
  },
  {
    id: '9',
    title: 'Studio in JBR',
    price: 5500,
    priceType: 'monthly',
    category: 'Property',
    subcategory: 'Apartments',
    location: 'JBR',
    emoji: '🏠',
    badge: 'NEW',
    verified: true,
    timeAgo: '3h',
    phone: '+971509012345',
    whatsapp: '+971509012345',
    description: 'Beautiful studio apartment in JBR with sea view.',
    images: [],
    specs: { Bedrooms: 'Studio', Bathrooms: '1', Size: '450 sqft', View: 'Sea View' },
    views: 198,
    likes: 55,
    shares: 15,
    tags: ['Verified', 'Sea View', 'Furnished']
  },
  {
    id: '10',
    title: 'Samsung 65" QLED TV',
    price: 2800,
    category: 'Electronics',
    subcategory: 'TVs',
    location: 'Abu Dhabi',
    emoji: '📺',
    badge: 'SALE',
    verified: true,
    phone: '+971509123456',
    whatsapp: '+971509123456',
    description: 'Samsung 65 inch QLED 4K Smart TV. 1 year old with warranty.',
    images: [],
    specs: { Size: '65 inch', Type: 'QLED', Resolution: '4K', Smart: 'Yes' },
    views: 67,
    likes: 12,
    shares: 4,
    tags: ['Verified', 'Under Warranty']
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
  // South Asia
  { id: 'g1', name: 'Indians in Dubai', members: 3420, activity: 'Active daily', country: 'India', flag: '🇮🇳', joined: true },
  { id: 'g2', name: 'Kerala Community UAE', members: 2100, activity: 'Jobs & support', country: 'India', flag: '🇮🇳' },
  { id: 'g3', name: 'Tamil Nadu in Abu Dhabi', members: 980, activity: 'Tamil culture', country: 'India', flag: '🇮🇳' },
  { id: 'g4', name: 'Pakistani Community UAE', members: 2150, activity: 'Very active', country: 'Pakistan', flag: '🇵🇰' },
  { id: 'g5', name: 'Lahore Expats Dubai', members: 670, activity: 'City connections', country: 'Pakistan', flag: '🇵🇰' },
  { id: 'g6', name: 'Bangladesh Community', members: 1800, activity: 'Jobs & support', country: 'Bangladesh', flag: '🇧🇩' },
  { id: 'g7', name: 'Sri Lankans Dubai', members: 1200, activity: 'Active weekly', country: 'Sri Lanka', flag: '🇱🇰' },
  { id: 'g8', name: 'Nepali Community UAE', members: 950, activity: 'Growing fast', country: 'Nepal', flag: '🇳🇵' },
  { id: 'g9', name: 'Afghans in UAE', members: 720, activity: 'Support network', country: 'Afghanistan', flag: '🇦🇫' },
  { id: 'g10', name: 'Maldivians Dubai', members: 280, activity: 'Small but active', country: 'Maldives', flag: '🇲🇻' },
  // Southeast Asia
  { id: 'g11', name: 'Filipinos in UAE', members: 4500, activity: 'Very active', country: 'Philippines', flag: '🇵🇭' },
  { id: 'g12', name: 'Indonesians Dubai', members: 900, activity: 'Active weekly', country: 'Indonesia', flag: '🇮🇩' },
  { id: 'g13', name: 'Malaysians in UAE', members: 450, activity: 'Social group', country: 'Malaysia', flag: '🇲🇾' },
  { id: 'g14', name: 'Vietnamese in Dubai', members: 380, activity: 'Growing', country: 'Vietnam', flag: '🇻🇳' },
  { id: 'g15', name: 'Thai Community UAE', members: 520, activity: 'Cultural events', country: 'Thailand', flag: '🇹🇭' },
  { id: 'g16', name: 'Myanmar Expats Dubai', members: 340, activity: 'Support group', country: 'Myanmar', flag: '🇲🇲' },
  { id: 'g17', name: 'Singaporeans in UAE', members: 180, activity: 'Business network', country: 'Singapore', flag: '🇸🇬' },
  // Middle East
  { id: 'g18', name: 'Emiratis Connect', members: 5000, activity: 'Local community', country: 'UAE', flag: '🇦🇪' },
  { id: 'g19', name: 'Saudis in UAE', members: 1800, activity: 'Active daily', country: 'Saudi Arabia', flag: '🇸🇦' },
  { id: 'g20', name: 'Egyptians in Dubai', members: 2300, activity: 'Very active', country: 'Egypt', flag: '🇪🇬' },
  { id: 'g21', name: 'Lebanese in UAE', members: 1100, activity: 'Business network', country: 'Lebanon', flag: '🇱🇧' },
  { id: 'g22', name: 'Jordanians Dubai', members: 800, activity: 'Active daily', country: 'Jordan', flag: '🇯🇴' },
  { id: 'g23', name: 'Syrians in UAE', members: 650, activity: 'Support group', country: 'Syria', flag: '🇸🇾' },
  { id: 'g24', name: 'Iranians in Dubai', members: 3100, activity: 'Active daily', country: 'Iran', flag: '🇮🇷' },
  { id: 'g25', name: 'Iraqis in UAE', members: 890, activity: 'Growing community', country: 'Iraq', flag: '🇮🇶' },
  { id: 'g26', name: 'Palestinians Dubai', members: 720, activity: 'Support network', country: 'Palestine', flag: '🇵🇸' },
  { id: 'g27', name: 'Yemenis in UAE', members: 560, activity: 'Active weekly', country: 'Yemen', flag: '🇾🇪' },
  { id: 'g28', name: 'Omanis in Dubai', members: 420, activity: 'Neighbors connect', country: 'Oman', flag: '🇴🇲' },
  { id: 'g29', name: 'Kuwaitis in UAE', members: 380, activity: 'Business focus', country: 'Kuwait', flag: '🇰🇼' },
  { id: 'g30', name: 'Bahrainis Dubai', members: 290, activity: 'Social events', country: 'Bahrain', flag: '🇧🇭' },
  { id: 'g31', name: 'Qataris in UAE', members: 220, activity: 'Networking', country: 'Qatar', flag: '🇶🇦' },
  // Europe
  { id: 'g32', name: 'British Expats Dubai', members: 1500, activity: 'Social events', country: 'UK', flag: '🇬🇧' },
  { id: 'g33', name: 'French Community Dubai', members: 700, activity: 'Cultural events', country: 'France', flag: '🇫🇷' },
  { id: 'g34', name: 'Germans in UAE', members: 550, activity: 'Business focus', country: 'Germany', flag: '🇩🇪' },
  { id: 'g35', name: 'Russians in Dubai', members: 1800, activity: 'Very active', country: 'Russia', flag: '🇷🇺' },
  { id: 'g36', name: 'Italians in UAE', members: 480, activity: 'Food & culture', country: 'Italy', flag: '🇮🇹' },
  { id: 'g37', name: 'Spanish Community Dubai', members: 420, activity: 'Social events', country: 'Spain', flag: '🇪🇸' },
  { id: 'g38', name: 'Dutch in UAE', members: 360, activity: 'Business network', country: 'Netherlands', flag: '🇳🇱' },
  { id: 'g39', name: 'Ukrainians Dubai', members: 680, activity: 'Support group', country: 'Ukraine', flag: '🇺🇦' },
  { id: 'g40', name: 'Polish in UAE', members: 320, activity: 'Growing', country: 'Poland', flag: '🇵🇱' },
  { id: 'g41', name: 'Romanians Dubai', members: 280, activity: 'Active weekly', country: 'Romania', flag: '🇷🇴' },
  { id: 'g42', name: 'Greeks in UAE', members: 240, activity: 'Cultural events', country: 'Greece', flag: '���🇷' },
  { id: 'g43', name: 'Irish in Dubai', members: 380, activity: 'Social events', country: 'Ireland', flag: '🇮🇪' },
  { id: 'g44', name: 'Scandinavians UAE', members: 420, activity: 'Expat network', country: 'Sweden', flag: '🇸🇪' },
  // Americas
  { id: 'g45', name: 'Americans in UAE', members: 1200, activity: 'Networking', country: 'USA', flag: '🇺🇸' },
  { id: 'g46', name: 'Canadians in Dubai', members: 580, activity: 'Social events', country: 'Canada', flag: '🇨🇦' },
  { id: 'g47', name: 'Brazilians in UAE', members: 450, activity: 'Vibrant community', country: 'Brazil', flag: '🇧🇷' },
  { id: 'g48', name: 'Mexicans Dubai', members: 180, activity: 'Growing', country: 'Mexico', flag: '🇲🇽' },
  { id: 'g49', name: 'Argentinians UAE', members: 150, activity: 'Social group', country: 'Argentina', flag: '🇦🇷' },
  { id: 'g50', name: 'Colombians in Dubai', members: 220, activity: 'Active weekly', country: 'Colombia', flag: '🇨🇴' },
  // Africa
  { id: 'g51', name: 'Africans in UAE', members: 1600, activity: 'Growing community', country: 'Africa', flag: '🌍' },
  { id: 'g52', name: 'Nigerians in Dubai', members: 890, activity: 'Very active', country: 'Nigeria', flag: '🇳🇬' },
  { id: 'g53', name: 'South Africans UAE', members: 620, activity: 'Business network', country: 'South Africa', flag: '🇿🇦' },
  { id: 'g54', name: 'Kenyans in Dubai', members: 480, activity: 'Active weekly', country: 'Kenya', flag: '🇰🇪' },
  { id: 'g55', name: 'Ethiopians UAE', members: 380, activity: 'Support group', country: 'Ethiopia', flag: '🇪🇹' },
  { id: 'g56', name: 'Moroccans in Dubai', members: 520, activity: 'Cultural events', country: 'Morocco', flag: '🇲🇦' },
  { id: 'g57', name: 'Tunisians UAE', members: 290, activity: 'Growing', country: 'Tunisia', flag: '🇹🇳' },
  { id: 'g58', name: 'Algerians in Dubai', members: 340, activity: 'Active weekly', country: 'Algeria', flag: '🇩🇿' },
  { id: 'g59', name: 'Ugandans UAE', members: 220, activity: 'Support network', country: 'Uganda', flag: '🇺🇬' },
  { id: 'g60', name: 'Ghanaians in Dubai', members: 280, activity: 'Growing', country: 'Ghana', flag: '🇬🇭' },
  // East Asia
  { id: 'g61', name: 'Chinese Community UAE', members: 2200, activity: 'Business & social', country: 'China', flag: '🇨🇳' },
  { id: 'g62', name: 'Japanese in Dubai', members: 420, activity: 'Business network', country: 'Japan', flag: '🇯🇵' },
  { id: 'g63', name: 'Koreans in UAE', members: 380, activity: 'K-culture events', country: 'South Korea', flag: '🇰🇷' },
  // Oceania
  { id: 'g64', name: 'Australians in Dubai', members: 680, activity: 'Social events', country: 'Australia', flag: '🇦🇺' },
  { id: 'g65', name: 'New Zealanders UAE', members: 180, activity: 'Small but active', country: 'New Zealand', flag: '🇳🇿' },
  // Central Asia
  { id: 'g66', name: 'Kazakhs in Dubai', members: 240, activity: 'Growing', country: 'Kazakhstan', flag: '🇰🇿' },
  { id: 'g67', name: 'Uzbeks in UAE', members: 320, activity: 'Active weekly', country: 'Uzbekistan', flag: '🇺🇿' },
  { id: 'g68', name: 'Turkmen Dubai', members: 150, activity: 'Small community', country: 'Turkmenistan', flag: '🇹🇲' }
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
      likedAds: [],
      currentTab: 'Home',
      showAuthModal: false,
      coins: 45,
      dailyCheckedIn: false,
  selectedLocation: 'Dubai, UAE',
  searchQuery: '',
  pendingCommunities: [],
  notifications: [
    { id: 'n1', title: 'Welcome to DubaiKismag!', message: 'Start posting ads and exploring the marketplace', icon: '👋', time: 'Just now', read: false },
    { id: 'n2', title: 'Your ad got 5 views', message: 'Toyota Camry 2020 is getting attention!', icon: '👁️', time: '2h ago', read: false },
    { id: 'n3', title: 'New feature: VIP Ads', message: 'Boost your ads to get 10x more views', icon: '⭐', time: '1d ago', read: true },
  ],
  
  setUser: (user) => set({ user, isAuthenticated: !!user }),
      setAuthenticated: (val) => set({ isAuthenticated: val }),
      addListing: (listing) => set((state) => ({ listings: [listing, ...state.listings] })),
      deleteListing: (id) => set((state) => ({ listings: state.listings.filter(l => l.id !== id) })),
      toggleSavedAd: (id) => set((state) => ({
        savedAds: state.savedAds.includes(id) 
          ? state.savedAds.filter(savedId => savedId !== id)
          : [...state.savedAds, id]
      })),
      removeFavorite: (id) => set((state) => ({
        savedAds: state.savedAds.filter(savedId => savedId !== id)
      })),
      leaveGroup: (groupId) => set((state) => ({
        communityGroups: state.communityGroups.map(g => 
          g.id === groupId ? { ...g, joined: false } : g
        )
      })),
      toggleLikedAd: (id) => set((state) => ({
        likedAds: state.likedAds.includes(id) 
          ? state.likedAds.filter(likedId => likedId !== id)
          : [...state.likedAds, id],
        listings: state.listings.map(l => 
          l.id === id ? { ...l, likes: (l.likes || 0) + (state.likedAds.includes(id) ? -1 : 1) } : l
        )
      })),
      shareListing: (id) => set((state) => ({
        listings: state.listings.map(l => 
          l.id === id ? { ...l, shares: (l.shares || 0) + 1 } : l
        )
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
      setSelectedLocation: (location) => set({ selectedLocation: location }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      requestCommunity: (group) => set((state) => ({
        pendingCommunities: [...state.pendingCommunities, { ...group, id: `pending-${Date.now()}`, pending: true }]
      })),
      approveCommunity: (id) => set((state) => {
        const pending = state.pendingCommunities.find(g => g.id === id)
        if (!pending) return state
        return {
          pendingCommunities: state.pendingCommunities.filter(g => g.id !== id),
          communityGroups: [...state.communityGroups, { ...pending, id: `g${state.communityGroups.length + 1}`, pending: false }]
        }
      }),
      getFilteredListings: (category, sort, searchQuery, location) => {
        let filtered = get().listings
        
        // Filter by category
        if (category && category !== 'All') {
          filtered = filtered.filter(l => l.category === category)
        }
        
        // Filter by search query
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          filtered = filtered.filter(l => 
            l.title.toLowerCase().includes(query) ||
            l.description.toLowerCase().includes(query) ||
            l.category.toLowerCase().includes(query) ||
            l.location.toLowerCase().includes(query)
          )
        }
        
        // Filter by location (nearby)
        if (location && location !== 'Dubai, UAE' && location !== 'All UAE') {
          filtered = filtered.filter(l => 
            l.location.toLowerCase().includes(location.toLowerCase().replace(', uae', '').replace('dubai, ', ''))
          )
        }
        
        // Sort
        switch (sort) {
          case 'Price':
            filtered = [...filtered].sort((a, b) => a.price - b.price)
            break
          case 'Verified':
            filtered = [...filtered].sort((a, b) => (b.verified ? 1 : 0) - (a.verified ? 1 : 0))
            break
          case 'Near me':
            // For now, just filter by selected location
            break
          default: // Newest
            filtered = [...filtered].sort((a, b) => {
              if (a.isFeatured && !b.isFeatured) return -1
              if (!a.isFeatured && b.isFeatured) return 1
              return (b.featuredDays || 0) - (a.featuredDays || 0)
            })
        }
        
        return filtered
      },
  isAdmin: () => {
  const user = get().user
  return user?.email === ADMIN_EMAIL || user?.isAdmin === true
  },
  addNotification: (notification) => set((state) => ({
    notifications: [
      { ...notification, id: `n${Date.now()}`, read: false },
      ...state.notifications
    ]
  })),
  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    )
  })),
  clearNotifications: () => set({ notifications: [] })
  }),
    { name: 'dubaikismag-storage' }
  )
)

export const categories = [
  { id: 'vehicles', name: 'Vehicles', emoji: '🚗', subcategories: ['Cars', 'Motorcycles', 'Trucks', 'Boats', 'Parts'] },
  { id: 'property', name: 'Property', emoji: '🏠', subcategories: ['Apartments', 'Villas', 'Rooms', 'Commercial', 'Land'] },
  { id: 'jobs', name: 'Jobs', emoji: '💼', subcategories: ['Full-time', 'Part-time', 'Remote', 'Freelance', 'Internship'] },
  { id: 'labour', name: 'Labour', emoji: '👷', subcategories: ['Electrician', 'Plumber', 'Painter', 'AC Tech', 'Driver', 'Cleaner'] },
  { id: 'electronics', name: 'Electronics', emoji: '📱', subcategories: ['Phones', 'Laptops', 'TVs', 'Cameras', 'Gaming', 'Accessories'] },
  { id: 'furniture', name: 'Furniture', emoji: '🛋️', subcategories: ['Sofas', 'Beds', 'Tables', 'Chairs', 'Storage', 'Outdoor'] },
  { id: 'farmland', name: 'Farmland', emoji: '🌾', subcategories: ['Land', 'Equipment', 'Seeds', 'Livestock', 'Produce'] },
  { id: 'more', name: 'More...', emoji: '📦', subcategories: ['Fashion', 'Sports', 'Books', 'Toys', 'Art', 'Other'] }
]

// Category-specific specifications
export const categorySpecs: Record<string, string[]> = {
  'Vehicles': ['Year', 'KM', 'Color', 'Doors', 'Seats', 'Engine', 'Transmission', 'Fuel Type', 'Body Type'],
  'Property': ['Bedrooms', 'Bathrooms', 'Size', 'Furnished', 'Parking', 'View', 'Floor', 'Building Age'],
  'Jobs': ['Type', 'Experience Required', 'Salary Range', 'Working Hours', 'Benefits', 'Visa Provided'],
  'Labour': ['Experience', 'Skills', 'Availability', 'Languages', 'Certifications'],
  'Electronics': ['Brand', 'Model', 'Storage', 'Color', 'Warranty', 'Condition', 'Accessories'],
  'Furniture': ['Material', 'Color', 'Dimensions', 'Condition', 'Assembly Required', 'Brand'],
  'Farmland': ['Size', 'Water Supply', 'Soil Type', 'Fencing', 'Electricity', 'Road Access'],
  'More': ['Condition', 'Brand', 'Size', 'Color', 'Material']
}

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

// Country filters for communities
export const countryFilters = [
  { id: 'all', name: 'All UAE', flag: '🇦🇪' },
  // South Asia
  { id: 'india', name: 'India', flag: '🇮🇳' },
  { id: 'pakistan', name: 'Pakistan', flag: '🇵🇰' },
  { id: 'bangladesh', name: 'Bangladesh', flag: '🇧🇩' },
  { id: 'srilanka', name: 'Sri Lanka', flag: '🇱🇰' },
  { id: 'nepal', name: 'Nepal', flag: '🇳🇵' },
  { id: 'afghanistan', name: 'Afghanistan', flag: '🇦🇫' },
  { id: 'maldives', name: 'Maldives', flag: '🇲🇻' },
  // Southeast Asia
  { id: 'philippines', name: 'Philippines', flag: '🇵🇭' },
  { id: 'indonesia', name: 'Indonesia', flag: '🇮🇩' },
  { id: 'malaysia', name: 'Malaysia', flag: '🇲🇾' },
  { id: 'vietnam', name: 'Vietnam', flag: '🇻🇳' },
  { id: 'thailand', name: 'Thailand', flag: '🇹🇭' },
  { id: 'myanmar', name: 'Myanmar', flag: '🇲🇲' },
  { id: 'singapore', name: 'Singapore', flag: '🇸🇬' },
  // Middle East
  { id: 'uae', name: 'UAE', flag: '🇦🇪' },
  { id: 'saudi', name: 'Saudi Arabia', flag: '🇸🇦' },
  { id: 'egypt', name: 'Egypt', flag: '🇪🇬' },
  { id: 'lebanon', name: 'Lebanon', flag: '🇱🇧' },
  { id: 'jordan', name: 'Jordan', flag: '🇯🇴' },
  { id: 'syria', name: 'Syria', flag: '🇸🇾' },
  { id: 'iran', name: 'Iran', flag: '🇮🇷' },
  { id: 'iraq', name: 'Iraq', flag: '🇮🇶' },
  { id: 'palestine', name: 'Palestine', flag: '🇵🇸' },
  { id: 'yemen', name: 'Yemen', flag: '🇾🇪' },
  { id: 'oman', name: 'Oman', flag: '🇴🇲' },
  { id: 'kuwait', name: 'Kuwait', flag: '🇰🇼' },
  { id: 'bahrain', name: 'Bahrain', flag: '🇧🇭' },
  { id: 'qatar', name: 'Qatar', flag: '🇶🇦' },
  // Europe
  { id: 'uk', name: 'UK', flag: '🇬🇧' },
  { id: 'france', name: 'France', flag: '🇫🇷' },
  { id: 'germany', name: 'Germany', flag: '🇩🇪' },
  { id: 'russia', name: 'Russia', flag: '🇷🇺' },
  { id: 'italy', name: 'Italy', flag: '🇮🇹' },
  { id: 'spain', name: 'Spain', flag: '🇪🇸' },
  { id: 'netherlands', name: 'Netherlands', flag: '🇳🇱' },
  { id: 'ukraine', name: 'Ukraine', flag: '🇺🇦' },
  { id: 'poland', name: 'Poland', flag: '🇵🇱' },
  { id: 'romania', name: 'Romania', flag: '🇷🇴' },
  { id: 'greece', name: 'Greece', flag: '🇬🇷' },
  { id: 'ireland', name: 'Ireland', flag: '🇮🇪' },
  { id: 'sweden', name: 'Sweden', flag: '🇸🇪' },
  // Americas
  { id: 'usa', name: 'USA', flag: '🇺🇸' },
  { id: 'canada', name: 'Canada', flag: '🇨🇦' },
  { id: 'brazil', name: 'Brazil', flag: '🇧🇷' },
  { id: 'mexico', name: 'Mexico', flag: '🇲🇽' },
  { id: 'argentina', name: 'Argentina', flag: '🇦🇷' },
  { id: 'colombia', name: 'Colombia', flag: '🇨🇴' },
  // Africa
  { id: 'africa', name: 'Africa', flag: '🌍' },
  { id: 'nigeria', name: 'Nigeria', flag: '🇳🇬' },
  { id: 'southafrica', name: 'South Africa', flag: '🇿🇦' },
  { id: 'kenya', name: 'Kenya', flag: '🇰🇪' },
  { id: 'ethiopia', name: 'Ethiopia', flag: '🇪🇹' },
  { id: 'morocco', name: 'Morocco', flag: '🇲🇦' },
  { id: 'tunisia', name: 'Tunisia', flag: '🇹🇳' },
  { id: 'algeria', name: 'Algeria', flag: '🇩🇿' },
  { id: 'uganda', name: 'Uganda', flag: '🇺🇬' },
  { id: 'ghana', name: 'Ghana', flag: '🇬🇭' },
  // East Asia
  { id: 'china', name: 'China', flag: '🇨🇳' },
  { id: 'japan', name: 'Japan', flag: '🇯🇵' },
  { id: 'korea', name: 'South Korea', flag: '🇰🇷' },
  // Oceania
  { id: 'australia', name: 'Australia', flag: '🇦🇺' },
  { id: 'newzealand', name: 'New Zealand', flag: '🇳🇿' },
  // Central Asia
  { id: 'kazakhstan', name: 'Kazakhstan', flag: '🇰🇿' },
  { id: 'uzbekistan', name: 'Uzbekistan', flag: '🇺🇿' },
  { id: 'turkmenistan', name: 'Turkmenistan', flag: '🇹🇲' }
]
