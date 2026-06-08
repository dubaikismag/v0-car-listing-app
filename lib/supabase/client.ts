import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn('[v0] Supabase credentials not available')
    // Return a stub for build time
    return {
      auth: { getUser: async () => ({ data: { user: null }, error: null }) },
      from: () => ({
        select: () => ({ eq: () => ({ order: () => ({ data: [] }) }) }),
      }),
    } as any
  }

  return createBrowserClient(supabaseUrl, supabaseKey)
}
