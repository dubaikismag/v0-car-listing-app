"use client"

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { BottomNavigation } from '@/components/bottom-navigation'
import { AuthModal } from '@/components/auth-modal'
import { AuthProvider } from '@/lib/auth-context'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Eye,
  Calendar,
  Crown,
  Phone,
  MessageCircle,
  Shield,
  Flag,
  ChevronLeft,
  ChevronRight,
  Car,
  Home,
  Smartphone,
  Watch,
  Tag
} from 'lucide-react'
import { cn } from '@/lib/utils'

function ListingDetailContent({ id }: { id: string }) {
  const router = useRouter()
  const getListingById = useAppStore((state) => state.getListingById)
  const listing = getListingById(id)
  const [isLiked, setIsLiked] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!listing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Listing Not Found</h1>
          <p className="text-muted-foreground mb-4">This listing may have been removed</p>
          <Button onClick={() => router.push('/')}>Go Home</Button>
        </div>
      </div>
    )
  }

  const isPaidActive = listing.isPaid && listing.paidUntil && new Date(listing.paidUntil) > new Date()
  
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'decimal',
      maximumFractionDigits: 0
    }).format(price) + ' ' + currency
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-AE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date(date))
  }

  const handleCall = () => {
    window.location.href = `tel:${listing.userPhone}`
  }

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Hi, I'm interested in your listing: ${listing.title}`)
    window.open(`https://wa.me/${listing.userWhatsApp.replace(/[^0-9]/g, '')}?text=${message}`, '_blank')
  }

  const getCategoryIcon = () => {
    switch (listing.category) {
      case 'Motors': return Car
      case 'Property': return Home
      case 'Electronics': return Smartphone
      case 'Fashion': return Watch
      default: return Tag
    }
  }

  const CategoryIcon = getCategoryIcon()

  return (
    <div className="min-h-screen bg-background pb-32">
      <Header />

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative aspect-[4/3] bg-muted">
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                  <CategoryIcon className="h-24 w-24 text-slate-300" />
                </div>
                
                {/* Watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-white/20 text-4xl font-bold rotate-[-15deg] select-none">
                    dubaikismag.com
                  </span>
                </div>

                {/* Featured Badge */}
                {isPaidActive && (
                  <Badge className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0 gap-1 text-sm py-1">
                    <Crown className="h-4 w-4" />
                    Featured Listing
                  </Badge>
                )}

                {/* Image Navigation */}
                {listing.images.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2"
                      onClick={() => setCurrentImageIndex((i) => i > 0 ? i - 1 : listing.images.length - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setCurrentImageIndex((i) => i < listing.images.length - 1 ? i + 1 : 0)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                      {listing.images.map((_, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            "h-2 w-2 rounded-full transition-colors",
                            idx === currentImageIndex ? "bg-white" : "bg-white/50"
                          )}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Actions */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart className={cn("h-4 w-4", isLiked && "fill-red-500 text-red-500")} />
                  </Button>
                  <Button variant="secondary" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Title & Price */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">{listing.title}</h1>
                  <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                    <Badge variant="secondary">{listing.category}</Badge>
                    <span>•</span>
                    <Badge variant="outline">{listing.subcategory}</Badge>
                  </div>
                </div>
              </div>
              <p className="text-3xl md:text-4xl font-bold text-amber-600 mt-4">
                {formatPrice(listing.price, listing.currency)}
              </p>
            </div>

            {/* Quick Info */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {listing.location}
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {listing.views} views
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Posted {formatDate(listing.createdAt)}
              </div>
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {listing.description}
                </p>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(listing.specifications).map(([key, value]) => (
                    <div 
                      key={key}
                      className="bg-muted/50 rounded-lg p-3"
                    >
                      <p className="text-xs text-muted-foreground">{key}</p>
                      <p className="font-semibold">{String(value)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Seller & Actions */}
          <div className="space-y-6">
            {/* Seller Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-14 w-14">
                    <AvatarFallback className="bg-amber-500 text-white text-lg">
                      S
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">Seller</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Shield className="h-3 w-3 text-green-500" />
                      Verified
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full gap-2 bg-green-600 hover:bg-green-700"
                    onClick={handleWhatsApp}
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </Button>
                  <Button
                    className="w-full gap-2 bg-amber-500 hover:bg-amber-600"
                    onClick={handleCall}
                  >
                    <Phone className="h-4 w-4" />
                    Call Now
                  </Button>
                </div>

                <Separator className="my-4" />

                <div className="text-center">
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Flag className="h-4 w-4 mr-1" />
                    Report this ad
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Safety Tips */}
            <Card className="bg-amber-500/5 border-amber-500/20">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Shield className="h-4 w-4 text-amber-500" />
                  Safety Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-2">
                <p>• Meet in a safe, public place</p>
                <p>• Check the item before paying</p>
                <p>• Pay only after collecting the item</p>
                <p>• Beware of unrealistic offers</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-16 left-0 right-0 bg-background border-t p-4 z-40">
        <div className="container mx-auto max-w-4xl flex gap-3">
          <Button
            variant="outline"
            className="flex-1 gap-2 border-green-500 text-green-600 hover:bg-green-50"
            onClick={handleWhatsApp}
          >
            <MessageCircle className="h-5 w-5" />
            WhatsApp
          </Button>
          <Button
            className="flex-1 gap-2 bg-amber-500 hover:bg-amber-600"
            onClick={handleCall}
          >
            <Phone className="h-5 w-5" />
            Call
          </Button>
        </div>
      </div>

      <BottomNavigation />
      <AuthModal />
    </div>
  )
}

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  
  return (
    <AuthProvider>
      <ListingDetailContent id={resolvedParams.id} />
    </AuthProvider>
  )
}
