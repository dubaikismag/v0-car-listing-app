"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export interface User {
  id: string
  email?: string
  phone?: string
  name: string
  verified: boolean
  profile_picture_url?: string
  location?: string
  active_ads?: number
  rating?: number
  sold?: number
  member_since?: string
}

interface AuthContextType {
  isAuthModalOpen: boolean
  openAuthModal: () => void
  closeAuthModal: () => void
  authStep: 'input' | 'otp' | 'name'
  setAuthStep: (step: 'input' | 'otp' | 'name') => void
  authMethod: 'phone' | 'email' | null
  setAuthMethod: (method: 'phone' | 'email' | null) => void
  authValue: string
  setAuthValue: (value: string) => void
  login: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string, name: string) => Promise<{ error?: string }>
  logout: () => Promise<void>
  user: User | null
  supabaseUser: SupabaseUser | null
  isLoading: boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authStep, setAuthStep] = useState<'input' | 'otp' | 'name'>('input')
  const [authMethod, setAuthMethod] = useState<'phone' | 'email' | null>(null)
  const [authValue, setAuthValue] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createClient()

  const fetchUserProfile = useCallback(async (supabaseUser: SupabaseUser) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .single()

    if (profile) {
      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email,
        phone: supabaseUser.phone,
        name: profile.name || supabaseUser.email?.split('@')[0] || 'User',
        verified: profile.verified || false,
        profile_picture_url: profile.profile_picture_url,
        location: profile.location,
        active_ads: profile.active_ads,
        rating: profile.rating,
        sold: profile.sold,
        member_since: profile.member_since
      })
    } else {
      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email,
        phone: supabaseUser.phone,
        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
        verified: false
      })
    }
  }, [supabase])

  const refreshUser = useCallback(async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (currentUser) {
      setSupabaseUser(currentUser)
      await fetchUserProfile(currentUser)
    }
  }, [supabase, fetchUserProfile])

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true)
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      
      if (currentUser) {
        setSupabaseUser(currentUser)
        await fetchUserProfile(currentUser)
      }
      setIsLoading(false)
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setSupabaseUser(session.user)
        await fetchUserProfile(session.user)
      } else {
        setSupabaseUser(null)
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, fetchUserProfile])

  const openAuthModal = useCallback(() => {
    setIsAuthModalOpen(true)
    setAuthStep('input')
    setAuthMethod(null)
    setAuthValue('')
  }, [])

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false)
    setAuthStep('input')
    setAuthMethod(null)
    setAuthValue('')
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      console.log('[v0] Attempting login with email:', email)
      
      // Use API route to avoid CORS issues
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('[v0] Login error:', data.error)
        return { error: data.error || 'Failed to sign in. Please check your credentials.' }
      }

      console.log('[v0] Login successful:', data.user?.id)
      closeAuthModal()
      return {}
    } catch (err) {
      console.error('[v0] Login exception:', err)
      return { error: 'Network error. Please check your connection and try again.' }
    }
  }, [closeAuthModal])

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? 
          `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
        data: {
          name
        }
      }
    })

    if (error) {
      return { error: error.message }
    }

    // Create profile after signup
    try {
      await fetch('/api/auth/profile', { method: 'POST' })
    } catch (err) {
      console.error('[v0] Profile creation failed:', err)
    }

    closeAuthModal()
    return {}
  }, [supabase, closeAuthModal])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSupabaseUser(null)
  }, [supabase])

  return (
    <AuthContext.Provider
      value={{
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authStep,
        setAuthStep,
        authMethod,
        setAuthMethod,
        authValue,
        setAuthValue,
        login,
        signUp,
        logout,
        user,
        supabaseUser,
        isLoading,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
