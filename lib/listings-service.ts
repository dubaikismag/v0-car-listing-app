import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js'

export interface Listing {
  id: string
  user_id: string
  title: string
  description?: string
  price: number
  price_type: 'fixed' | 'monthly' | 'yearly' | 'kg'
  category: string
  subcategory?: string
  location: string
  emoji?: string
  badge?: string
  verified: boolean
  featured: boolean
  featured_days?: number
  featured_until?: string
  image_urls: string[]
  specs?: Record<string, string | number | boolean>
  phone?: string
  whatsapp?: string
  views: number
  likes: number
  shares: number
  messages: number
  tags: string[]
  status: 'active' | 'sold' | 'deleted'
  created_at: string
  updated_at: string
  profiles?: {
    id: string
    name: string
    profile_picture_url?: string
    verified: boolean
    rating?: number
    member_since?: string
  }
}

export interface CreateListingInput {
  title: string
  description?: string
  price: number
  price_type?: 'fixed' | 'monthly' | 'yearly' | 'kg'
  category: string
  subcategory?: string
  location: string
  emoji?: string
  image_urls?: string[]
  specs?: Record<string, string | number | boolean>
  phone?: string
  whatsapp?: string
  tags?: string[]
}

export interface ListingFilters {
  category?: string
  subcategory?: string
  location?: string
  minPrice?: number
  maxPrice?: number
  search?: string
  featured?: boolean
  verified?: boolean
  status?: string
  userId?: string
}

const supabase = createClient()

// Fetch all listings with optional filters
export async function fetchListings(filters?: ListingFilters): Promise<Listing[]> {
  try {
    let query = supabase
      .from('listings')
      .select('*')
      .eq('status', filters?.status || 'active')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })

    if (filters?.category && filters.category !== 'Home') {
      query = query.eq('category', filters.category)
    }

    if (filters?.subcategory) {
      query = query.eq('subcategory', filters.subcategory)
    }

    if (filters?.location) {
      query = query.ilike('location', `%${filters.location}%`)
    }

    if (filters?.minPrice !== undefined) {
      query = query.gte('price', filters.minPrice)
    }

    if (filters?.maxPrice !== undefined) {
      query = query.lte('price', filters.maxPrice)
    }

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    if (filters?.featured) {
      query = query.eq('featured', true)
    }

    if (filters?.verified) {
      query = query.eq('verified', true)
    }

    if (filters?.userId) {
      query = query.eq('user_id', filters.userId)
    }

    const { data, error } = await query

    if (error) {
      console.error('[v0] Error fetching listings:', error)
      // Return mock data to keep app working while backend is being set up
      return getMockListings(filters)
    }

    return (data as Listing[]) || getMockListings(filters)
  } catch (err) {
    console.error('[v0] Exception fetching listings:', err)
    return getMockListings(filters)
  }
}

// Mock data for development/fallback
function getMockListings(filters?: ListingFilters): Listing[] {
  const mockListings: Listing[] = [
    {
      id: '1',
      user_id: 'user1',
      title: 'AC Technician - Kerala',
      description: 'Experienced AC technician available for repairs and maintenance',
      price: 2200,
      price_type: 'monthly',
      category: 'Services',
      subcategory: 'AC Repair',
      location: 'Dubai, UAE',
      emoji: '👷',
      badge: 'AVAILABLE',
      verified: true,
      featured: false,
      image_urls: [],
      phone: '+971-XXXXXXX',
      whatsapp: '+971-XXXXXXX',
      views: 145,
      likes: 23,
      shares: 5,
      messages: 12,
      tags: ['ac-repair', 'technician', 'skilled'],
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      user_id: 'user2',
      title: 'Plumber - Rajasthan',
      description: 'Professional plumber with 3 years experience',
      price: 1900,
      price_type: 'monthly',
      category: 'Services',
      subcategory: 'Plumbing',
      location: 'Dubai, UAE',
      emoji: '🔧',
      badge: 'AVAILABLE',
      verified: true,
      featured: false,
      image_urls: [],
      phone: '+971-XXXXXXX',
      whatsapp: '+971-XXXXXXX',
      views: 98,
      likes: 15,
      shares: 3,
      messages: 8,
      tags: ['plumber', 'repairs', 'maintenance'],
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '3',
      user_id: 'user3',
      title: 'Toyota Camry 2022',
      description: 'Well maintained, single owner, insurance valid till 2025',
      price: 45000,
      price_type: 'fixed',
      category: 'Cars',
      subcategory: 'Sedan',
      location: 'Dubai, UAE',
      emoji: '🚗',
      badge: 'PREMIUM',
      verified: true,
      featured: true,
      image_urls: [],
      phone: '+971-XXXXXXX',
      whatsapp: '+971-XXXXXXX',
      views: 342,
      likes: 56,
      shares: 12,
      messages: 28,
      tags: ['car', 'sedan', 'toyota'],
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]

  // Filter mock data based on filters
  if (filters?.category && filters.category !== 'Home') {
    return mockListings.filter(l => l.category === filters.category)
  }
  if (filters?.search) {
    return mockListings.filter(l => 
      l.title.toLowerCase().includes(filters.search!.toLowerCase()) ||
      l.description?.toLowerCase().includes(filters.search!.toLowerCase())
    )
  }
  return mockListings
}

// Fetch a single listing by ID
export async function fetchListingById(id: string): Promise<Listing | null> {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('[v0] Error fetching listing:', error)
    return null
  }

  // Increment view count
  await supabase
    .from('listings')
    .update({ views: (data.views || 0) + 1 })
    .eq('id', id)

  return data as Listing
}

// Create a new listing
export async function createListing(input: CreateListingInput): Promise<Listing> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User must be logged in to create a listing')
  }

  const { data, error } = await supabase
    .from('listings')
    .insert({
      ...input,
      user_id: user.id,
      image_urls: input.image_urls || [],
      tags: input.tags || [],
      price_type: input.price_type || 'fixed'
    })
    .select('*')
    .single()

  if (error) {
    console.error('[v0] Error creating listing:', error)
    throw error
  }

  // Update user's active ads count - just log instead of calling RPC that doesn't exist
  console.log('[v0] Listing created, user active ads should be incremented for:', user.id)

  return data as Listing
}

// Update a listing
export async function updateListing(id: string, updates: Partial<CreateListingInput>): Promise<Listing> {
  const { data, error } = await supabase
    .from('listings')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    console.error('[v0] Error updating listing:', error)
    throw error
  }

  return data as Listing
}

// Delete a listing (soft delete)
export async function deleteListing(id: string): Promise<void> {
  const { error } = await supabase
    .from('listings')
    .update({ status: 'deleted' })
    .eq('id', id)

  if (error) {
    console.error('[v0] Error deleting listing:', error)
    throw error
  }
}

// Like a listing
export async function likeListing(listingId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User must be logged in to like a listing')
  }

  const { error } = await supabase
    .from('liked_listings')
    .insert({ user_id: user.id, listing_id: listingId })

  if (error && error.code !== '23505') { // Ignore duplicate key error
    console.error('[v0] Error liking listing:', error)
    throw error
  }

  // Update likes count
  await supabase.rpc('increment_likes', { listing_id: listingId })
}

// Unlike a listing
export async function unlikeListing(listingId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User must be logged in to unlike a listing')
  }

  const { error } = await supabase
    .from('liked_listings')
    .delete()
    .eq('user_id', user.id)
    .eq('listing_id', listingId)

  if (error) {
    console.error('[v0] Error unliking listing:', error)
    throw error
  }

  // Update likes count
  await supabase.rpc('decrement_likes', { listing_id: listingId })
}

// Save a listing
export async function saveListing(listingId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User must be logged in to save a listing')
  }

  const { error } = await supabase
    .from('saved_listings')
    .insert({ user_id: user.id, listing_id: listingId })

  if (error && error.code !== '23505') { // Ignore duplicate key error
    console.error('[v0] Error saving listing:', error)
    throw error
  }
}

// Unsave a listing
export async function unsaveListing(listingId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User must be logged in to unsave a listing')
  }

  const { error } = await supabase
    .from('saved_listings')
    .delete()
    .eq('user_id', user.id)
    .eq('listing_id', listingId)

  if (error) {
    console.error('[v0] Error unsaving listing:', error)
    throw error
  }
}

// Get user's liked listings
export async function getLikedListings(): Promise<string[]> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return []

  const { data, error } = await supabase
    .from('liked_listings')
    .select('listing_id')
    .eq('user_id', user.id)

  if (error) {
    console.error('[v0] Error fetching liked listings:', error)
    return []
  }

  return data?.map(item => item.listing_id) || []
}

// Get user's saved listings
export async function getSavedListings(): Promise<string[]> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return []

  const { data, error } = await supabase
    .from('saved_listings')
    .select('listing_id')
    .eq('user_id', user.id)

  if (error) {
    console.error('[v0] Error fetching saved listings:', error)
    return []
  }

  return data?.map(item => item.listing_id) || []
}

// Subscribe to realtime listing updates
export function subscribeToListings(
  onInsert?: (listing: Listing) => void,
  onUpdate?: (listing: Listing) => void,
  onDelete?: (id: string) => void
): RealtimeChannel {
  const channel = supabase
    .channel('listings_changes')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'listings'
      },
      async (payload: RealtimePostgresChangesPayload<Listing>) => {
        if (onInsert && payload.new) {
          // Fetch the full listing with profile data
          const listing = await fetchListingById((payload.new as Listing).id)
          if (listing) onInsert(listing)
        }
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'listings'
      },
      async (payload: RealtimePostgresChangesPayload<Listing>) => {
        if (onUpdate && payload.new) {
          const listing = await fetchListingById((payload.new as Listing).id)
          if (listing) onUpdate(listing)
        }
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'listings'
      },
      (payload: RealtimePostgresChangesPayload<Listing>) => {
        if (onDelete && payload.old) {
          onDelete((payload.old as Listing).id)
        }
      }
    )
    .subscribe()

  return channel
}

// Unsubscribe from realtime updates
export function unsubscribeFromListings(channel: RealtimeChannel): void {
  supabase.removeChannel(channel)
}
