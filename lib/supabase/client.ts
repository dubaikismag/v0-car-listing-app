import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn('[v0] Supabase credentials not available')
    // Return a complete stub for build time and runtime without credentials
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        signInWithPassword: async () => ({ 
          data: { user: null, session: null },
          error: { message: 'Supabase not configured' }
        }),
        signUp: async () => ({ 
          data: { user: null, session: null },
          error: { message: 'Supabase not configured' }
        }),
        signOut: async () => ({ error: null }),
        onAuthStateChange: () => ({ 
          data: { subscription: { unsubscribe: () => {} } },
          error: null
        }),
      },
      from: () => ({
        select: () => ({ eq: () => ({ order: () => ({ data: [] }) }) }),
        insert: () => ({ data: null, error: null }),
        update: () => ({ data: null, error: null }),
        delete: () => ({ data: null, error: null }),
      }),
    } as any
  }

  return createBrowserClient(supabaseUrl, supabaseKey)
}
