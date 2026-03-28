import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/home/HeroSection'
import { MarqueeSection, StatsBar, CommunitySection, ProfileSection, CTASection } from '@/components/home/HomeSections'
import { PostsSection, TrendingSection } from '@/components/home/PostsAndTrending'
import { Suspense } from 'react'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <MarqueeSection />
        <StatsBar />
        <Suspense fallback={<div style={{ height:600 }} />}>
          <PostsSection />
        </Suspense>
        <CommunitySection />
        <ProfileSection />
        <TrendingSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
