'use client'

import { useState } from 'react'
import { X, Mail, ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

type Step = 'method' | 'login' | 'signup'

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, signUp, isLoading: authLoading } = useAuth()
  const [step, setStep] = useState<Step>('method')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  if (!isAuthModalOpen) return null

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }
    
    setIsLoading(true)
    setError('')
    
    const result = await login(email, password)
    
    if (result.error) {
      setError(result.error)
    }
    
    setIsLoading(false)
  }

  const handleSignUp = async () => {
    if (!email || !password || !name) {
      setError('Please fill in all fields')
      return
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    
    setIsLoading(true)
    setError('')
    
    const result = await signUp(email, password, name)
    
    if (result.error) {
      setError(result.error)
    } else {
      setSuccess('Account created! Please check your email to verify your account.')
    }
    
    setIsLoading(false)
  }

  const resetForm = () => {
    setStep('method')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setName('')
    setError('')
    setSuccess('')
    setShowPassword(false)
  }

  const handleClose = () => {
    closeAuthModal()
    resetForm()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50">
      <div className="w-full max-w-lg bg-white rounded-t-3xl animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        <div className="flex items-center justify-between px-4 pb-4">
          {step !== 'method' ? (
            <button onClick={() => { setStep('method'); setError(''); setSuccess('') }}>
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
          ) : (
            <div className="w-6" />
          )}
          <h2 className="text-lg font-bold text-gray-900">
            {step === 'method' && 'Welcome'}
            {step === 'login' && 'Sign In'}
            {step === 'signup' && 'Create Account'}
          </h2>
          <button onClick={handleClose}>
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="px-6 pb-8">
          {step === 'method' && (
            <div className="space-y-4">
              <p className="text-gray-600 text-center mb-6">Sign in to post ads, save favorites, and connect with others</p>
              <button
                onClick={() => setStep('login')}
                className="w-full flex items-center gap-4 p-4 bg-purple-50 rounded-xl border-2 border-purple-200 hover:border-purple-400"
              >
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Sign In</p>
                  <p className="text-sm text-gray-500">Already have an account</p>
                </div>
              </button>
              <button
                onClick={() => setStep('signup')}
                className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-gray-400"
              >
                <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">+</span>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Create Account</p>
                  <p className="text-sm text-gray-500">New to Dubai Kismag</p>
                </div>
              </button>
            </div>
          )}

          {step === 'login' && (
            <div className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleLogin}
                disabled={isLoading || authLoading}
                className="w-full py-4 bg-purple-600 text-white font-semibold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
              
              <p className="text-center text-gray-500 text-sm">
                {"Don't have an account?"}{' '}
                <button onClick={() => { setStep('signup'); setError('') }} className="text-purple-600 font-semibold">
                  Create one
                </button>
              </p>
            </div>
          )}

          {step === 'signup' && (
            <div className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">
                  {success}
                </div>
              )}
              
              {!success && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={handleSignUp}
                    disabled={isLoading || authLoading}
                    className="w-full py-4 bg-purple-600 text-white font-semibold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </>
              )}
              
              <p className="text-center text-gray-500 text-sm">
                Already have an account?{' '}
                <button onClick={() => { setStep('login'); setError(''); setSuccess('') }} className="text-purple-600 font-semibold">
                  Sign in
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
