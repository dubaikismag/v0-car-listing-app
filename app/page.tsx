'use client'

import { Header } from '@/components/header'
import { TopTabs } from '@/components/top-tabs'
import { BottomNavigation } from '@/components/bottom-navigation'
import { AuthModal } from '@/components/auth-modal'
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
    <div className="min-h-screen bg-[#f5f3ff] pb-20">
      <Header />
      <TopTabs />
      
      <main>
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

      <BottomNavigation />
      <AuthModal />
    </div>
  )
}
