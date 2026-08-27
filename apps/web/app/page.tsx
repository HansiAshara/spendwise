// ============================================
// Landing Page
// ============================================
// Public marketing page shown at "/"
// ============================================

import MarketingNavbar from '@/components/marketing/MarketingNavbar'
import Hero            from '@/components/marketing/Hero'
import FeatureGrid      from '@/components/marketing/FeatureGrid'
import HowItWorks        from '@/components/marketing/HowItWorks'
import CTASection         from '@/components/marketing/CTASection'
import Footer              from '@/components/marketing/Footer'

export default function LandingPage() {
  return (
    <div style={{ background: 'white' }}>
      <MarketingNavbar />
      <Hero />
      <FeatureGrid />
      <HowItWorks />
      <CTASection />
      <Footer />
    </div>
  )
}