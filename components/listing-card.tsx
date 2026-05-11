"use client"

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { type Listing } from '@/lib/store'
import { 
  Heart, 
  Eye, 
  MapPin, 
  Crown,
  Phone,
  MessageCircle,
  ChevronRight,
  Car,
  Gauge,
  Calendar,
  Palette,
  DoorOpen,
  Users,
  Fuel,
  Settings2,
  Home,
  BedDouble,
  Bath,
  Maximize,
  Building,
  Smartphone,
  HardDrive,
  Cpu,
  Watch,
  Tag
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ListingCardProps {
  listing: Listing
  variant?: 'default' | 'compact'
}

const categoryIcons: Record<string, Record<string, React.ElementType>> = {
  Motors: {
    'Brand': Car,
    'Model': Car,
    'Year': Calendar,
    'Kilometers': Gauge,
    'Color': Palette,
    'Doors': DoorOpen,
    'Seats': Users,
    'Fuel Type': Fuel,
    'Transmission': Settings2,
    'Engine Size': Gauge,
    'Horsepower': Gauge
  },
  Property: {
    'Bedrooms': BedDouble,
    'Bathrooms': Bath,
    'Size': Maximize,
    'Property Type': Home,
    'Floor': Building,
    'Parking': Car,
    'View': Eye
  },
  Electronics: {
    'Brand': Smartphone,
    'Model': Smartphone,
    'Storage': HardDrive,
    'RAM': Cpu,
    'Chip': Cpu
  },
  Fashion: {
    'Brand': Tag,
    'Model': Watch,
    'Reference': Tag
  }
}

export function ListingCard({ listing, variant = 'default' }: ListingCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const router = useRouter()
  
  const isPaidActive = listing.isPaid && listing.paidUntil && new Date(listing.paidUntil) > new Date()
  
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'decimal',
      maximumFractionDigits: 0
    }).format(price) + ' ' + currency
  }

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.location.href = `tel:${listing.userPhone}`
  }

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation()
    const message = encodeURIComponent(`Hi, I'm interested in your listing: ${listing.title}`)
    window.open(`https://wa.me/${listing.userWhatsApp.replace(/[^0-9]/g, '')}?text=${message}`, '_blank')
  }

  const getIconForSpec = (category: string, specKey: string) => {
    return categoryIcons[category]?.[specKey] || Tag
  }

  // Get main specs to show (max 6 for preview)
  const mainSpecs = Object.entries(listing.specifications).slice(0, 6)
  const allSpecs = Object.entries(listing.specifications)

  return (
    <Card 
      className={cn(
        "overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-xl",
        isPaidActive && "ring-2 ring-amber-500/50 shadow-amber-500/10"
      )}
      onClick={() => router.push(`/listing/${listing.id}`)}
    >
      {/* Image Section */}
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
          {listing.category === 'Motors' && <Car className="h-16 w-16 text-slate-400" />}
          {listing.category === 'Property' && <Home className="h-16 w-16 text-slate-400" />}
          {listing.category === 'Electronics' && <Smartphone className="h-16 w-16 text-slate-400" />}
          {listing.category === 'Fashion' && <Watch className="h-16 w-16 text-slate-400" />}
          {!['Motors', 'Property', 'Electronics', 'Fashion'].includes(listing.category) && (
            <Tag className="h-16 w-16 text-slate-400" />
          )}
        </div>
        
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-white/30 text-2xl font-bold rotate-[-15deg] select-none">
            dubaikismag.com
          </span>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isPaidActive && (
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0 gap-1">
              <Crown className="h-3 w-3" />
              Featured
            </Badge>
          )}
          <Badge variant="secondary" className="bg-black/60 text-white border-0">
            {listing.category}
          </Badge>
        </div>

        {/* Like Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsLiked(!isLiked)
          }}
          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 flex items-center justify-center shadow-md transition-transform hover:scale-110"
        >
          <Heart 
            className={cn(
              "h-4 w-4 transition-colors",
              isLiked ? "fill-red-500 text-red-500" : "text-gray-600"
            )} 
          />
        </button>

        {/* Views */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
          <Eye className="h-3 w-3" />
          {listing.views}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Title & Price */}
        <div>
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-amber-600 transition-colors">
            {listing.title}
          </h3>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            {formatPrice(listing.price, listing.currency)}
          </p>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {listing.location}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {listing.description}
        </p>

        {/* Specifications Grid */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {mainSpecs.map(([key, value]) => {
              const Icon = getIconForSpec(listing.category, key)
              return (
                <div 
                  key={key}
                  className="flex items-center gap-2 text-xs bg-slate-50 dark:bg-slate-900 rounded-lg px-2 py-1.5"
                >
                  <Icon className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-muted-foreground">{key}:</span>
                    <span className="font-medium ml-1 truncate">{String(value)}</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Expandable Full Specs */}
          {allSpecs.length > 6 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsExpanded(!isExpanded)
                }}
              >
                {isExpanded ? 'Show Less' : `View All ${allSpecs.length} Specifications`}
                <ChevronRight className={cn(
                  "h-4 w-4 ml-1 transition-transform",
                  isExpanded && "rotate-90"
                )} />
              </Button>

              {isExpanded && (
                <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                  {allSpecs.slice(6).map(([key, value]) => {
                    const Icon = getIconForSpec(listing.category, key)
                    return (
                      <div 
                        key={key}
                        className="flex items-center gap-2 text-xs bg-slate-50 dark:bg-slate-900 rounded-lg px-2 py-1.5"
                      >
                        <Icon className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                        <div className="min-w-0">
                          <span className="text-muted-foreground">{key}:</span>
                          <span className="font-medium ml-1 truncate">{String(value)}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            className="flex-1 gap-2 border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
            onClick={handleWhatsApp}
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </Button>
          <Button
            className="flex-1 gap-2 bg-amber-500 hover:bg-amber-600"
            onClick={handleCall}
          >
            <Phone className="h-4 w-4" />
            Call
          </Button>
        </div>
      </div>
    </Card>
  )
}
