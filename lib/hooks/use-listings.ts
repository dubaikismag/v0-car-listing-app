"use client"

import useSWR from 'swr'
import { useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  fetchListings, 
  fetchListingById, 
  subscribeToListings, 
  unsubscribeFromListings,
  getLikedListings,
  getSavedListings,
  type Listing, 
  type ListingFilters 
} from '@/lib/listings-service'
import type { RealtimeChannel } from '@supabase/supabase-js'

const supabase = createClient()

// Fetcher function for SWR
const listingsFetcher = async (key: string): Promise<Listing[]> => {
  // Parse the key to get filters
  const [, filtersStr] = key.split('?')
  const filters: ListingFilters = {}
  
  if (filtersStr) {
    const params = new URLSearchParams(filtersStr)
    if (params.get('category')) filters.category = params.get('category')!
    if (params.get('location')) filters.location = params.get('location')!
    if (params.get('search')) filters.search = params.get('search')!
    if (params.get('minPrice')) filters.minPrice = Number(params.get('minPrice'))
    if (params.get('maxPrice')) filters.maxPrice = Number(params.get('maxPrice'))
    if (params.get('featured')) filters.featured = params.get('featured') === 'true'
    if (params.get('userId')) filters.userId = params.get('userId')!
  }
  
  return fetchListings(filters)
}

const singleListingFetcher = async (key: string): Promise<Listing | null> => {
  const id = key.split('/').pop()
  if (!id) return null
  return fetchListingById(id)
}

// Hook for fetching listings with realtime updates
export function useListings(filters?: ListingFilters) {
  const filterStr = filters 
    ? '?' + new URLSearchParams(
        Object.entries(filters)
          .filter(([, v]) => v !== undefined && v !== null)
          .map(([k, v]) => [k, String(v)])
      ).toString()
    : ''
  
  const swrKey = `listings${filterStr}`
  
  const { data, error, isLoading, mutate } = useSWR<Listing[]>(
    swrKey,
    listingsFetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  )

  // Set up realtime subscription
  useEffect(() => {
    let channel: RealtimeChannel | null = null

    const setupRealtime = () => {
      channel = subscribeToListings(
        // On insert
        (newListing) => {
          mutate((currentData) => {
            if (!currentData) return [newListing]
            // Check if it matches current filters
            if (filters?.category && filters.category !== 'Home' && newListing.category !== filters.category) {
              return currentData
            }
            return [newListing, ...currentData]
          }, false)
        },
        // On update
        (updatedListing) => {
          mutate((currentData) => {
            if (!currentData) return currentData
            return currentData.map(listing => 
              listing.id === updatedListing.id ? updatedListing : listing
            )
          }, false)
        },
        // On delete
        (deletedId) => {
          mutate((currentData) => {
            if (!currentData) return currentData
            return currentData.filter(listing => listing.id !== deletedId)
          }, false)
        }
      )
    }

    setupRealtime()

    return () => {
      if (channel) {
        unsubscribeFromListings(channel)
      }
    }
  }, [mutate, filters?.category])

  return {
    listings: data || [],
    isLoading,
    error,
    refresh: () => mutate()
  }
}

// Hook for fetching a single listing
export function useListing(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Listing | null>(
    id ? `listing/${id}` : null,
    singleListingFetcher,
    {
      revalidateOnFocus: false,
    }
  )

  return {
    listing: data,
    isLoading,
    error,
    refresh: () => mutate()
  }
}

// Hook for featured listings
export function useFeaturedListings() {
  return useListings({ featured: true })
}

// Hook for listings by category
export function useListingsByCategory(category: string) {
  return useListings({ category })
}

// Hook for user's listings
export function useMyListings(userId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Listing[]>(
    userId ? `my-listings/${userId}` : null,
    () => userId ? fetchListings({ userId }) : Promise.resolve([]),
    {
      revalidateOnFocus: false,
    }
  )

  return {
    listings: data || [],
    isLoading,
    error,
    refresh: () => mutate()
  }
}

// Hook for liked listings IDs
export function useLikedListingIds() {
  const { data, error, isLoading, mutate } = useSWR<string[]>(
    'liked-listings',
    getLikedListings,
    {
      revalidateOnFocus: false,
    }
  )

  return {
    likedIds: data || [],
    isLoading,
    error,
    refresh: () => mutate()
  }
}

// Hook for saved listings IDs
export function useSavedListingIds() {
  const { data, error, isLoading, mutate } = useSWR<string[]>(
    'saved-listings',
    getSavedListings,
    {
      revalidateOnFocus: false,
    }
  )

  return {
    savedIds: data || [],
    isLoading,
    error,
    refresh: () => mutate()
  }
}

// Hook for categories from database
export function useCategories() {
  const fetcher = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data || []
  }

  const { data, error, isLoading } = useSWR('categories', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // Cache for 1 minute
  })

  return {
    categories: data || [],
    isLoading,
    error
  }
}

// Hook for stats (listings count, etc)
export function useStats() {
  const fetcher = async () => {
    const [listingsResult, profilesResult] = await Promise.all([
      supabase.from('listings').select('id', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('profiles').select('id', { count: 'exact', head: true })
    ])
    
    return {
      listingsCount: listingsResult.count || 0,
      membersCount: profilesResult.count || 0
    }
  }

  const { data, error, isLoading } = useSWR('stats', fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 30000, // Refresh every 30 seconds
  })

  return {
    stats: data || { listingsCount: 0, membersCount: 0 },
    isLoading,
    error
  }
}
