"use client"

import { Header } from '@/components/header'
import { BottomNavigation } from '@/components/bottom-navigation'
import { AuthModal } from '@/components/auth-modal'
import { AuthProvider, useAuth } from '@/lib/auth-context'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  User,
  FileText,
  Heart,
  Settings,
  HelpCircle,
  Shield,
  Bell,
  CreditCard,
  Star,
  ChevronRight,
  LogOut,
  Crown,
  MessageCircle,
  Share2,
  Info,
  Globe
} from 'lucide-react'

const menuItems = [
  {
    title: 'Account',
    items: [
      { icon: FileText, label: 'My Listings', badge: '3', href: '/my-listings' },
      { icon: Heart, label: 'Favorites', href: '/favorites' },
      { icon: Bell, label: 'Notifications', badge: '5', href: '/notifications' },
      { icon: MessageCircle, label: 'Messages', badge: '2', href: '/messages' },
    ]
  },
  {
    title: 'Promote',
    items: [
      { icon: Crown, label: 'Feature Your Ad', premium: true, href: '/promote' },
      { icon: CreditCard, label: 'Payment History', href: '/payments' },
      { icon: Star, label: 'Premium Plans', premium: true, href: '/premium' },
    ]
  },
  {
    title: 'Support',
    items: [
      { icon: HelpCircle, label: 'Help Center', href: '/help' },
      { icon: Shield, label: 'Safety Tips', href: '/safety' },
      { icon: Info, label: 'About Us', href: '/about' },
    ]
  },
  {
    title: 'Settings',
    items: [
      { icon: Settings, label: 'App Settings', href: '/settings' },
      { icon: Globe, label: 'Language', value: 'English', href: '/language' },
      { icon: Share2, label: 'Share App', href: '/share' },
    ]
  }
]

function MoreContent() {
  const { user, openAuthModal, logout } = useAuth()

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        {/* User Profile Card */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            {user ? (
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-amber-500 text-white text-xl">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">{user.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {user.email || user.phone}
                  </p>
                  <Badge variant="secondary" className="mt-1">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                </div>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <Avatar className="h-16 w-16 mx-auto mb-4">
                  <AvatarFallback className="bg-muted">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-lg font-semibold mb-2">Welcome to DubaiKisMag</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Sign in to manage your listings and favorites
                </p>
                <Button onClick={openAuthModal} className="bg-amber-500 hover:bg-amber-600">
                  Sign In
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats (for logged in users) */}
        {user && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card className="text-center">
              <CardContent className="pt-4 pb-4">
                <div className="text-2xl font-bold text-amber-500">3</div>
                <p className="text-xs text-muted-foreground">Active Ads</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-4 pb-4">
                <div className="text-2xl font-bold text-amber-500">127</div>
                <p className="text-xs text-muted-foreground">Views</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-4 pb-4">
                <div className="text-2xl font-bold text-amber-500">8</div>
                <p className="text-xs text-muted-foreground">Favorites</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Menu Sections */}
        <div className="space-y-6">
          {menuItems.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-medium text-muted-foreground mb-2 px-1">
                {section.title}
              </h3>
              <Card>
                <CardContent className="p-0">
                  {section.items.map((item, index) => {
                    const Icon = item.icon
                    return (
                      <div key={item.label}>
                        <button
                          className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors text-left"
                          onClick={() => {
                            if (!user && ['My Listings', 'Favorites', 'Notifications', 'Messages'].includes(item.label)) {
                              openAuthModal()
                            }
                          }}
                        >
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            item.premium ? 'bg-amber-500/10' : 'bg-muted'
                          }`}>
                            <Icon className={`h-5 w-5 ${item.premium ? 'text-amber-500' : 'text-muted-foreground'}`} />
                          </div>
                          <span className="flex-1 font-medium">{item.label}</span>
                          {item.badge && (
                            <Badge className="bg-amber-500">{item.badge}</Badge>
                          )}
                          {item.value && (
                            <span className="text-sm text-muted-foreground">{item.value}</span>
                          )}
                          {item.premium && (
                            <Badge variant="outline" className="text-amber-500 border-amber-500">
                              Premium
                            </Badge>
                          )}
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </button>
                        {index < section.items.length - 1 && <Separator />}
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Logout Button */}
        {user && (
          <Button
            variant="outline"
            className="w-full mt-6 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={logout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        )}

        {/* App Version */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          DubaiKisMag v1.0.0
        </p>
      </main>

      <BottomNavigation />
      <AuthModal />
    </div>
  )
}

export default function MorePage() {
  return (
    <AuthProvider>
      <MoreContent />
    </AuthProvider>
  )
}
