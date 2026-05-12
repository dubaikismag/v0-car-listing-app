'use client'

import { Header } from '@/components/header'
import { TopTabs } from '@/components/top-tabs'
import { BottomNavigation } from '@/components/bottom-navigation'
import { AuthModal } from '@/components/auth-modal'
import { DesktopSidebar, DesktopRightSidebar } from '@/components/desktop-layout'
import {
  StatsBar,
  HeroBanner,
  LabourBanner,
  BrowseCategories,
  FeaturedAds,
  LabourServices,
  FarmlandSection,
  AIRecommended,
  WhatsAppActiveSection,
  EmergencyHelpBanner,
  ReferEarnBanner,
  GoVIPBanner,
  WantedPreview,
  GroupsPreview
} from '@/components/home-sections'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f5f3ff] flex">
      {/* Desktop Left Sidebar */}
      <DesktopSidebar />
      
      {/* Main Content */}
      <div className="flex-1 lg:pb-0 pb-20">
        <Header />
        <TopTabs />
        
        <main className="lg:max-w-4xl lg:mx-auto">
          <StatsBar />
          <HeroBanner />
          <LabourBanner />
          <BrowseCategories />
          <FeaturedAds />
          <LabourServices />
          <FarmlandSection />
          <AIRecommended />
          <WhatsAppActiveSection />
          <WantedPreview />
          <GroupsPreview />
          <EmergencyHelpBanner />
          <ReferEarnBanner />
          <GoVIPBanner />
        </main>

        {/* Mobile Bottom Navigation - hidden on desktop */}
        <div className="lg:hidden">
          <BottomNavigation />
        </div>
      </div>

      {/* Desktop Right Sidebar */}
      <DesktopRightSidebar />
      
      <AuthModal />
    </div>
  )
}
