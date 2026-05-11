"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { useAuth } from '@/lib/auth-context'
import { Phone, Mail, ArrowLeft, Shield, CheckCircle2 } from 'lucide-react'

export function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authStep,
    setAuthStep,
    authMethod,
    setAuthMethod,
    authValue,
    setAuthValue,
    login
  } = useAuth()

  const [otp, setOtp] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+?[1-9]\d{9,14}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSendOTP = async () => {
    setError('')
    
    if (authMethod === 'phone' && !validatePhone(authValue)) {
      setError('Please enter a valid phone number (e.g., +971501234567)')
      return
    }
    
    if (authMethod === 'email' && !validateEmail(authValue)) {
      setError('Please enter a valid email address')
      return
    }

    setIsLoading(true)
    // Simulate OTP sending
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
    setAuthStep('otp')
  }

  const handleVerifyOTP = async () => {
    setError('')
    
    if (otp.length !== 6) {
      setError('Please enter the complete 6-digit OTP')
      return
    }

    setIsLoading(true)
    // Simulate OTP verification (accept any 6-digit code for demo)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    setAuthStep('name')
  }

  const handleComplete = () => {
    if (!name.trim()) {
      setError('Please enter your name')
      return
    }
    login(name.trim())
  }

  const handleBack = () => {
    setError('')
    if (authStep === 'otp') {
      setAuthStep('input')
      setOtp('')
    } else if (authStep === 'name') {
      setAuthStep('otp')
      setName('')
    } else {
      setAuthMethod(null)
      setAuthValue('')
    }
  }

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={(open) => !open && closeAuthModal()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {authStep !== 'input' && (
              <Button variant="ghost" size="icon" onClick={handleBack} className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <span>
              {authStep === 'input' && 'Sign In to DubaiKisMag'}
              {authStep === 'otp' && 'Verify OTP'}
              {authStep === 'name' && 'Complete Profile'}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {authStep === 'input' && !authMethod && (
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm text-center">
                Choose how you want to sign in
              </p>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full h-14 justify-start gap-4"
                  onClick={() => setAuthMethod('phone')}
                >
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Continue with Phone</div>
                    <div className="text-xs text-muted-foreground">We&apos;ll send you an OTP</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-14 justify-start gap-4"
                  onClick={() => setAuthMethod('email')}
                >
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Continue with Email</div>
                    <div className="text-xs text-muted-foreground">Get OTP on your email</div>
                  </div>
                </Button>
              </div>
            </div>
          )}

          {authStep === 'input' && authMethod && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="auth-input">
                  {authMethod === 'phone' ? 'Phone Number' : 'Email Address'}
                </Label>
                <Input
                  id="auth-input"
                  type={authMethod === 'phone' ? 'tel' : 'email'}
                  placeholder={authMethod === 'phone' ? '+971 50 123 4567' : 'your@email.com'}
                  value={authValue}
                  onChange={(e) => setAuthValue(e.target.value)}
                  className="h-12"
                />
                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>
              <Button 
                className="w-full h-12" 
                onClick={handleSendOTP}
                disabled={isLoading || !authValue}
              >
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => setAuthMethod(null)}>
                Use different method
              </Button>
            </div>
          )}

          {authStep === 'otp' && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit code sent to
                  <br />
                  <span className="font-medium text-foreground">{authValue}</span>
                </p>
              </div>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              {error && <p className="text-sm text-destructive text-center">{error}</p>}
              <Button 
                className="w-full h-12" 
                onClick={handleVerifyOTP}
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Didn&apos;t receive the code?{' '}
                <Button variant="link" className="px-0 h-auto" onClick={handleSendOTP}>
                  Resend
                </Button>
              </p>
            </div>
          )}

          {authStep === 'name' && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Verified successfully! Enter your name to complete
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12"
                />
                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>
              <Button 
                className="w-full h-12" 
                onClick={handleComplete}
                disabled={!name.trim()}
              >
                Complete Sign In
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
