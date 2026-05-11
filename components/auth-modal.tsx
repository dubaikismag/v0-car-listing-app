'use client'

import { useState } from 'react'
import { X, Phone, Mail, ArrowLeft } from 'lucide-react'
import { useAppStore, ADMIN_EMAIL } from '@/lib/store'

type Step = 'method' | 'input' | 'otp' | 'name'

export function AuthModal() {
  const { showAuthModal, setShowAuthModal, setUser, setAuthenticated } = useAppStore()
  const [step, setStep] = useState<Step>('method')
  const [method, setMethod] = useState<'phone' | 'email'>('phone')
  const [inputValue, setInputValue] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (!showAuthModal) return null

  const handleSendOtp = () => {
    if (!inputValue) return
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setStep('otp')
    }, 1000)
  }

  const handleVerifyOtp = () => {
    const otpValue = otp.join('')
    if (otpValue.length !== 6) return
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setStep('name')
    }, 1000)
  }

  const handleComplete = () => {
    if (!name.trim()) return
    
    // Check if user is admin
    const isAdminUser = method === 'email' && inputValue.toLowerCase() === ADMIN_EMAIL
    
    setUser({
      id: Date.now().toString(),
      name: name.trim(),
      phone: method === 'phone' ? inputValue : undefined,
      email: method === 'email' ? inputValue : undefined,
      location: 'Dubai, UAE',
      memberSince: new Date().getFullYear().toString(),
      verified: isAdminUser,
      activeAds: 0,
      coins: 45,
      rating: 0,
      sold: 0,
      isAdmin: isAdminUser
    })
    setAuthenticated(true)
    setShowAuthModal(false)
    resetForm()
  }

  const resetForm = () => {
    setStep('method')
    setMethod('phone')
    setInputValue('')
    setOtp(['', '', '', '', '', ''])
    setName('')
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50">
      <div className="w-full max-w-lg bg-white rounded-t-3xl animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        <div className="flex items-center justify-between px-4 pb-4">
          {step !== 'method' ? (
            <button onClick={() => setStep(step === 'otp' ? 'input' : step === 'name' ? 'otp' : 'method')}>
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
          ) : (
            <div className="w-6" />
          )}
          <h2 className="text-lg font-bold text-gray-900">
            {step === 'method' && 'Sign In / Register'}
            {step === 'input' && (method === 'phone' ? 'Enter Phone Number' : 'Enter Email')}
            {step === 'otp' && 'Verify OTP'}
            {step === 'name' && 'Your Name'}
          </h2>
          <button onClick={() => { setShowAuthModal(false); resetForm() }}>
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="px-6 pb-8">
          {step === 'method' && (
            <div className="space-y-4">
              <p className="text-gray-600 text-center mb-6">Choose how you want to sign in</p>
              <button
                onClick={() => { setMethod('phone'); setStep('input') }}
                className="w-full flex items-center gap-4 p-4 bg-purple-50 rounded-xl border-2 border-purple-200 hover:border-purple-400"
              >
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Mobile Number</p>
                  <p className="text-sm text-gray-500">Receive OTP via SMS</p>
                </div>
              </button>
              <button
                onClick={() => { setMethod('email'); setStep('input') }}
                className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-gray-400"
              >
                <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Email Address</p>
                  <p className="text-sm text-gray-500">Receive OTP via Email</p>
                </div>
              </button>
            </div>
          )}

          {step === 'input' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {method === 'phone' ? 'Phone Number' : 'Email Address'}
                </label>
                <input
                  type={method === 'phone' ? 'tel' : 'email'}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={method === 'phone' ? '+971 50 000 0000' : 'you@example.com'}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-lg"
                />
              </div>
              <button
                onClick={handleSendOtp}
                disabled={!inputValue || isLoading}
                className="w-full py-4 bg-purple-600 text-white font-semibold rounded-xl disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : 'Send OTP'}
              </button>
            </div>
          )}

          {step === 'otp' && (
            <div className="space-y-6">
              <p className="text-gray-600 text-center">
                Enter the 6-digit code sent to<br />
                <span className="font-semibold text-gray-900">{inputValue}</span>
              </p>
              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="w-12 h-14 border-2 border-gray-200 rounded-xl text-center text-xl font-bold focus:border-purple-500 focus:outline-none"
                  />
                ))}
              </div>
              <button
                onClick={handleVerifyOtp}
                disabled={otp.join('').length !== 6 || isLoading}
                className="w-full py-4 bg-purple-600 text-white font-semibold rounded-xl disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <p className="text-center text-gray-400 text-sm">Demo: Use any 6 digits</p>
            </div>
          )}

          {step === 'name' && (
            <div className="space-y-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-3xl">✓</span>
                </div>
                <p className="text-green-600 font-semibold">Verified!</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">What should we call you?</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-lg"
                />
              </div>
              <button
                onClick={handleComplete}
                disabled={!name.trim()}
                className="w-full py-4 bg-purple-600 text-white font-semibold rounded-xl disabled:opacity-50"
              >
                Complete Sign Up
              </button>
              {method === 'email' && inputValue.toLowerCase() === ADMIN_EMAIL && (
                <p className="text-center text-amber-600 text-sm">Admin account detected</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
