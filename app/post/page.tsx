"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { BottomNavigation } from '@/components/bottom-navigation'
import { PostAdForm } from '@/components/post-ad-form'
import { AuthModal } from '@/components/auth-modal'
import { AuthProvider, useAuth } from '@/lib/auth-context'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

function PostPageContent() {
  const router = useRouter()
  const { user, openAuthModal } = useAuth()

  useEffect(() => {
    if (!user) {
      openAuthModal()
    }
  }, [user, openAuthModal])

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Post Your Ad</h1>
            <p className="text-muted-foreground text-sm">
              Fill in the details to list your item
            </p>
          </div>
        </div>

        {user ? (
          <PostAdForm />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              Please sign in to post an ad
            </p>
            <Button onClick={openAuthModal} className="bg-amber-500 hover:bg-amber-600">
              Sign In
            </Button>
          </div>
        )}
      </main>

      <BottomNavigation />
      <AuthModal />
    </div>
  )
}

export default function PostPage() {
  return (
    <AuthProvider>
      <PostPageContent />
    </AuthProvider>
  )
}
