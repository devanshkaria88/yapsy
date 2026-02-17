import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { StatsSection } from '@/components/sections/StatsSection';
import { HowItWorksSection } from '@/components/sections/HowItWorksSection';
import { PricingSection } from '@/components/sections/PricingSection';
import { WaitlistSection } from '@/components/sections/WaitlistSection';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <TestimonialsSection />
        <FeaturesSection />
        <StatsSection />
        <HowItWorksSection />
        <PricingSection />
        <WaitlistSection />
      </main>
      <Footer />
    </>
  );
}
