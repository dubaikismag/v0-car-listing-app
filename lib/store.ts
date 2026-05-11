import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  phone?: string
  email?: string
  name: string
  verified: boolean
}

export interface Listing {
  id: string
  title: string
  description: string
  price: number
  currency: string
  category: string
  subcategory: string
  images: string[]
  isPaid: boolean
  paidUntil?: Date
  priorityLevel: number // Higher = more priority
  createdAt: Date
  userId: string
  userPhone: string
  userWhatsApp: string
  location: string
  specifications: Record<string, string | number>
  views: number
}

interface AppState {
  user: User | null
  listings: Listing[]
  setUser: (user: User | null) => void
  addListing: (listing: Listing) => void
  getListingById: (id: string) => Listing | undefined
  getSortedListings: (category?: string) => Listing[]
}

// Sample listings data
const sampleListings: Listing[] = [
  {
    id: '1',
    title: '2023 Mercedes-Benz S-Class S500',
    description: 'Immaculate condition, full service history, under warranty. Features include panoramic sunroof, massage seats, Burmester sound system, and night vision assist.',
    price: 485000,
    currency: 'AED',
    category: 'Motors',
    subcategory: 'Cars',
    images: ['/listings/mercedes-s-class.jpg'],
    isPaid: true,
    paidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    priorityLevel: 100,
    createdAt: new Date(),
    userId: 'user1',
    userPhone: '+971501234567',
    userWhatsApp: '+971501234567',
    location: 'Dubai Marina',
    specifications: {
      'Brand': 'Mercedes-Benz',
      'Model': 'S-Class S500',
      'Year': 2023,
      'Kilometers': '12,000 km',
      'Color': 'Obsidian Black',
      'Fuel Type': 'Petrol',
      'Transmission': 'Automatic',
      'Body Type': 'Sedan',
      'Doors': 4,
      'Seats': 5,
      'Engine Size': '3.0L V6 Turbo',
      'Horsepower': '449 HP',
      'Warranty': 'Valid until 2026',
      'Service Contract': 'Included'
    },
    views: 1250
  },
  {
    id: '2',
    title: 'Luxury 3BR Apartment - Palm Jumeirah',
    description: 'Stunning sea-view apartment with private beach access. High-end finishes throughout, smart home system, and 24/7 concierge service.',
    price: 15000,
    currency: 'AED/month',
    category: 'Property',
    subcategory: 'Apartments',
    images: ['/listings/palm-apartment.jpg'],
    isPaid: true,
    paidUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    priorityLevel: 90,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    userId: 'user2',
    userPhone: '+971502345678',
    userWhatsApp: '+971502345678',
    location: 'Palm Jumeirah',
    specifications: {
      'Property Type': 'Apartment',
      'Bedrooms': 3,
      'Bathrooms': 4,
      'Size': '2,800 sq.ft',
      'Floor': '25th Floor',
      'Parking': '2 Spaces',
      'View': 'Full Sea View',
      'Furnishing': 'Fully Furnished',
      'Building': 'Luxury Tower',
      'Amenities': 'Pool, Gym, Beach',
      'Move-in Date': 'Immediate',
      'Contract': '1 Year Minimum'
    },
    views: 890
  },
  {
    id: '3',
    title: 'iPhone 15 Pro Max 256GB - Sealed',
    description: 'Brand new, sealed in box with Apple warranty. Natural Titanium color. Purchased from official Apple Store Dubai Mall.',
    price: 4999,
    currency: 'AED',
    category: 'Electronics',
    subcategory: 'Mobiles',
    images: ['/listings/iphone15.jpg'],
    isPaid: true,
    paidUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    priorityLevel: 80,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    userId: 'user3',
    userPhone: '+971503456789',
    userWhatsApp: '+971503456789',
    location: 'Business Bay',
    specifications: {
      'Brand': 'Apple',
      'Model': 'iPhone 15 Pro Max',
      'Storage': '256GB',
      'Color': 'Natural Titanium',
      'Condition': 'Brand New Sealed',
      'Warranty': 'Apple 1 Year',
      'Purchased From': 'Apple Store Dubai',
      'Accessories': 'All Original',
      'SIM': 'Physical + eSIM',
      'Region': 'UAE Version'
    },
    views: 456
  },
  {
    id: '4',
    title: 'BMW X7 M60i 2024 - Brand New',
    description: 'Zero km, full option with M Sport package. Individual colors, B&W Diamond sound, executive lounge seating.',
    price: 699000,
    currency: 'AED',
    category: 'Motors',
    subcategory: 'Cars',
    images: ['/listings/bmw-x7.jpg'],
    isPaid: true,
    paidUntil: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    priorityLevel: 95,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    userId: 'user4',
    userPhone: '+971504567890',
    userWhatsApp: '+971504567890',
    location: 'Downtown Dubai',
    specifications: {
      'Brand': 'BMW',
      'Model': 'X7 M60i',
      'Year': 2024,
      'Kilometers': '0 km',
      'Color': 'Frozen Marina Bay Blue',
      'Interior': 'Tartufo Merino Leather',
      'Fuel Type': 'Petrol',
      'Transmission': 'Automatic',
      'Body Type': 'SUV',
      'Doors': 5,
      'Seats': 7,
      'Engine Size': '4.4L V8 Twin-Turbo',
      'Horsepower': '530 HP',
      'Drive': 'xDrive AWD',
      'Warranty': '5 Years / Unlimited KM'
    },
    views: 2100
  },
  {
    id: '5',
    title: 'Designer Sofa Set - Italian Leather',
    description: 'Genuine Italian leather sofa set from Natuzzi. 3-seater, 2-seater, and single chair. Excellent condition, only 1 year old.',
    price: 28000,
    currency: 'AED',
    category: 'Furniture',
    subcategory: 'Living Room',
    images: ['/listings/sofa.jpg'],
    isPaid: false,
    priorityLevel: 10,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    userId: 'user5',
    userPhone: '+971505678901',
    userWhatsApp: '+971505678901',
    location: 'JBR',
    specifications: {
      'Brand': 'Natuzzi',
      'Material': 'Italian Leather',
      'Color': 'Cognac Brown',
      'Set Includes': '3+2+1 Seater',
      'Condition': 'Like New',
      'Age': '1 Year',
      'Original Price': 'AED 65,000',
      'Reason for Sale': 'Relocating'
    },
    views: 234
  },
  {
    id: '6',
    title: 'Rolex Submariner Date 126610LN',
    description: 'Unworn with box and papers. 2024 card. Investment piece with immediate availability.',
    price: 62000,
    currency: 'AED',
    category: 'Fashion',
    subcategory: 'Watches',
    images: ['/listings/rolex.jpg'],
    isPaid: true,
    paidUntil: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    priorityLevel: 85,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    userId: 'user6',
    userPhone: '+971506789012',
    userWhatsApp: '+971506789012',
    location: 'DIFC',
    specifications: {
      'Brand': 'Rolex',
      'Model': 'Submariner Date',
      'Reference': '126610LN',
      'Year': 2024,
      'Condition': 'Unworn',
      'Case Size': '41mm',
      'Material': 'Oystersteel',
      'Dial': 'Black',
      'Box': 'Yes',
      'Papers': 'Yes (2024)',
      'Movement': 'Automatic',
      'Water Resistance': '300m'
    },
    views: 678
  },
  {
    id: '7',
    title: 'Villa 5BR - Emirates Hills',
    description: 'Prestigious Emirates Hills villa with golf course views. Private pool, landscaped garden, smart home technology.',
    price: 45000000,
    currency: 'AED',
    category: 'Property',
    subcategory: 'Villas',
    images: ['/listings/villa.jpg'],
    isPaid: true,
    paidUntil: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    priorityLevel: 92,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    userId: 'user7',
    userPhone: '+971507890123',
    userWhatsApp: '+971507890123',
    location: 'Emirates Hills',
    specifications: {
      'Property Type': 'Villa',
      'Bedrooms': 5,
      'Bathrooms': 7,
      'Size': '12,500 sq.ft',
      'Plot Size': '18,000 sq.ft',
      'Parking': '4 Car Garage',
      'View': 'Golf Course',
      'Pool': 'Private Infinity Pool',
      'Garden': 'Landscaped',
      'Maid Room': '2',
      'Built Year': 2020,
      'Developer': 'Emaar'
    },
    views: 1560
  },
  {
    id: '8',
    title: 'MacBook Pro 16" M3 Max 48GB',
    description: 'Top spec MacBook Pro with M3 Max chip, 48GB RAM, 1TB SSD. AppleCare+ until 2027. Perfect for professionals.',
    price: 16500,
    currency: 'AED',
    category: 'Electronics',
    subcategory: 'Computers',
    images: ['/listings/macbook.jpg'],
    isPaid: false,
    priorityLevel: 15,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    userId: 'user8',
    userPhone: '+971508901234',
    userWhatsApp: '+971508901234',
    location: 'Dubai Marina',
    specifications: {
      'Brand': 'Apple',
      'Model': 'MacBook Pro 16"',
      'Chip': 'M3 Max',
      'CPU Cores': '14-Core',
      'GPU Cores': '30-Core',
      'RAM': '48GB',
      'Storage': '1TB SSD',
      'Display': 'Liquid Retina XDR',
      'Color': 'Space Black',
      'Battery Cycles': 45,
      'AppleCare+': 'Until 2027',
      'Condition': 'Excellent'
    },
    views: 312
  },
  {
    id: '9',
    title: 'Yamaha YZF-R1 2023',
    description: 'Superbike in pristine condition. Only 3,000 km. Full Akrapovic exhaust system, quick shifter.',
    price: 85000,
    currency: 'AED',
    category: 'Motors',
    subcategory: 'Motorcycles',
    images: ['/listings/yamaha-r1.jpg'],
    isPaid: true,
    paidUntil: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    priorityLevel: 75,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    userId: 'user9',
    userPhone: '+971509012345',
    userWhatsApp: '+971509012345',
    location: 'Al Quoz',
    specifications: {
      'Brand': 'Yamaha',
      'Model': 'YZF-R1',
      'Year': 2023,
      'Kilometers': '3,000 km',
      'Color': 'Team Yamaha Blue',
      'Engine': '998cc Inline-4',
      'Horsepower': '200 HP',
      'Exhaust': 'Akrapovic Full System',
      'Quick Shifter': 'Yes',
      'ABS': 'Yes',
      'Traction Control': 'Yes',
      'Service History': 'Full'
    },
    views: 445
  },
  {
    id: '10',
    title: 'Golden Visa Assistance Service',
    description: 'Professional assistance for UAE Golden Visa applications. 10-year residency for investors, entrepreneurs, and professionals.',
    price: 5000,
    currency: 'AED',
    category: 'Services',
    subcategory: 'Legal Services',
    images: ['/listings/visa.jpg'],
    isPaid: true,
    paidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    priorityLevel: 70,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    userId: 'user10',
    userPhone: '+971500123456',
    userWhatsApp: '+971500123456',
    location: 'Business Bay',
    specifications: {
      'Service Type': 'Visa Assistance',
      'Visa Type': 'Golden Visa',
      'Duration': '10 Years',
      'Processing Time': '2-4 Weeks',
      'Documents Required': 'Passport, Emirates ID',
      'Success Rate': '98%',
      'Languages': 'English, Arabic, Hindi',
      'Support': '24/7 Available'
    },
    views: 890
  },
  {
    id: '11',
    title: 'Persian Carpet - Antique Silk',
    description: 'Authentic handwoven Persian silk carpet from Isfahan. Museum quality piece, over 100 years old with certificate.',
    price: 120000,
    currency: 'AED',
    category: 'Furniture',
    subcategory: 'Carpets',
    images: ['/listings/carpet.jpg'],
    isPaid: false,
    priorityLevel: 8,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    userId: 'user11',
    userPhone: '+971501234000',
    userWhatsApp: '+971501234000',
    location: 'Al Karama',
    specifications: {
      'Origin': 'Isfahan, Persia',
      'Material': '100% Silk',
      'Age': 'Over 100 Years',
      'Size': '10ft x 14ft',
      'Knot Density': '900 KPSI',
      'Pattern': 'Medallion',
      'Colors': 'Natural Dyes',
      'Certificate': 'Included',
      'Condition': 'Excellent'
    },
    views: 156
  },
  {
    id: '12',
    title: 'Porsche 911 GT3 RS 2024',
    description: 'Brand new GT3 RS, factory allocation. Weissach Package, front axle lift, full PPF applied.',
    price: 1850000,
    currency: 'AED',
    category: 'Motors',
    subcategory: 'Cars',
    images: ['/listings/porsche-gt3.jpg'],
    isPaid: true,
    paidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    priorityLevel: 100,
    createdAt: new Date(),
    userId: 'user12',
    userPhone: '+971509876543',
    userWhatsApp: '+971509876543',
    location: 'Downtown Dubai',
    specifications: {
      'Brand': 'Porsche',
      'Model': '911 GT3 RS',
      'Year': 2024,
      'Kilometers': '500 km',
      'Color': 'Python Green',
      'Interior': 'Black/Green Alcantara',
      'Engine': '4.0L Flat-6',
      'Horsepower': '518 HP',
      'Transmission': '7-Speed PDK',
      'Package': 'Weissach',
      'Front Axle Lift': 'Yes',
      'PPF': 'Full Body',
      'Warranty': '2 Years'
    },
    views: 3200
  }
]

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      listings: sampleListings,
      setUser: (user) => set({ user }),
      addListing: (listing) =>
        set((state) => ({ listings: [listing, ...state.listings] })),
      getListingById: (id) => get().listings.find((l) => l.id === id),
      getSortedListings: (category) => {
        const now = new Date()
        return get()
          .listings
          .filter((l) => !category || l.category === category)
          .sort((a, b) => {
            // Paid listings with valid date get priority
            const aIsPaidActive = a.isPaid && a.paidUntil && new Date(a.paidUntil) > now
            const bIsPaidActive = b.isPaid && b.paidUntil && new Date(b.paidUntil) > now

            if (aIsPaidActive && !bIsPaidActive) return -1
            if (!aIsPaidActive && bIsPaidActive) return 1

            // Among paid listings, sort by priority level
            if (aIsPaidActive && bIsPaidActive) {
              return b.priorityLevel - a.priorityLevel
            }

            // Free listings sorted by date
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          })
      }
    }),
    {
      name: 'dubai-kismag-storage'
    }
  )
)

export const categories = [
  { id: 'motors', name: 'Motors', icon: 'car', subcategories: ['Cars', 'Motorcycles', 'Boats', 'Heavy Vehicles'] },
  { id: 'property', name: 'Property', icon: 'home', subcategories: ['Apartments', 'Villas', 'Commercial', 'Land'] },
  { id: 'electronics', name: 'Electronics', icon: 'smartphone', subcategories: ['Mobiles', 'Computers', 'Gaming', 'Cameras'] },
  { id: 'furniture', name: 'Furniture', icon: 'sofa', subcategories: ['Living Room', 'Bedroom', 'Kitchen', 'Carpets'] },
  { id: 'fashion', name: 'Fashion', icon: 'shirt', subcategories: ['Clothing', 'Watches', 'Bags', 'Jewelry'] },
  { id: 'services', name: 'Services', icon: 'briefcase', subcategories: ['Legal Services', 'Home Services', 'Business', 'Education'] },
  { id: 'jobs', name: 'Jobs', icon: 'building', subcategories: ['Full Time', 'Part Time', 'Freelance', 'Internship'] },
  { id: 'community', name: 'Community', icon: 'users', subcategories: ['Events', 'Activities', 'Lost & Found', 'Volunteers'] }
]
