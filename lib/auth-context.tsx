"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { useStore, type User } from './store'

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
  login: (name: string) => void
  logout: () => void
  user: User | null
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authStep, setAuthStep] = useState<'input' | 'otp' | 'name'>('input')
  const [authMethod, setAuthMethod] = useState<'phone' | 'email' | null>(null)
  const [authValue, setAuthValue] = useState('')
  
  const { user, setUser } = useStore()

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

  const login = useCallback((name: string) => {
    const newUser: User = {
      id: Math.random().toString(36).substring(7),
      phone: authMethod === 'phone' ? authValue : undefined,
      email: authMethod === 'email' ? authValue : undefined,
      name,
      verified: true
    }
    setUser(newUser)
    closeAuthModal()
  }, [authMethod, authValue, setUser, closeAuthModal])

  const logout = useCallback(() => {
    setUser(null)
  }, [setUser])

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
        logout,
        user
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
