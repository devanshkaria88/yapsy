'use client';

import { ScrollReveal, CountUp, StaggerChildren, StaggerItem } from '@/components/animations';
import { GradientButton } from '@/components/ui/GradientButton';
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { useGeo } from '@/lib/geo-context';
import { motion, AnimatePresence } from 'framer-motion';

const featureList = [
  { emoji: '✨', text: 'Unlimited voice check-ins' },
  { emoji: '📊', text: 'Full mood & productivity insights' },
  { emoji: '✅', text: 'Smart task management' },
  { emoji: '📖', text: 'AI-written daily journal' },
  { emoji: '🔥', text: 'Streaks & weekly reports' },
  { emoji: '🔒', text: 'Private & encrypted' },
];

export function PricingSection() {
  const { isIndia, loading } = useGeo();

  return (
    <SectionWrapper id="pricing" className="bg-white">
      <div className="text-center mb-12 md:mb-16">
        <ScrollReveal>
          <span className="inline-block text-sm font-semibold tracking-widest uppercase mb-4 text-[#B153D7]">
            Pricing
          </span>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <h2
            className="text-[28px] md:text-[44px] font-bold mb-4 text-[#191919]"
            style={{ fontFamily: 'var(--font-heading), sans-serif' }}
          >
            Simple pricing. Start free.
          </h2>
        </ScrollReveal>
      </div>

      <ScrollReveal>
        <div className="max-w-xl mx-auto">
          <div
            className="relative rounded-3xl p-8 md:p-12 transition-all duration-300 hover:-translate-y-1"
            style={{
              background: '#FFF4EA',
              border: '1px solid rgba(177, 83, 215, 0.1)',
              boxShadow: '0 4px 24px rgba(177, 83, 215, 0.08)',
            }}
          >
            {/* Badge */}
            <div className="flex items-center gap-2 mb-6">
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: 'linear-gradient(135deg, #FCB0F3, #3D05DD)' }}
              />
              <span
                className="text-sm font-bold tracking-wider uppercase text-[#B153D7]"
                style={{ fontFamily: 'var(--font-heading), sans-serif' }}
              >
                Yapsy Pro
              </span>
            </div>

            {/* Geo-aware Price */}
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mb-8"
                >
                  <div className="h-14 w-48 rounded-2xl bg-[#191919]/5 animate-pulse" />
                </motion.div>
              ) : (
                <motion.div
                  key={isIndia ? 'india' : 'global'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="mb-8"
                >
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl mr-1">{isIndia ? '🇮🇳' : '🇬🇧'}</span>
                    <span
                      className="text-5xl md:text-6xl font-bold text-[#191919]"
                      style={{ fontFamily: 'var(--font-heading), sans-serif' }}
                    >
                      {isIndia ? '₹' : '£'}
                      <CountUp target={isIndia ? 99 : 5} duration={1.5} />
                    </span>
                    <span className="text-[#191919]/50 text-lg">/month</span>
                  </div>
                  {isIndia && (
                    <p className="text-[#191919]/40 text-xs mt-2">
                      Pricing for India
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-[#191919]/50 text-sm mb-8">
              14-day free trial · No credit card needed
            </p>

            <div className="w-full h-px bg-[#191919]/8 mb-8" />

            <StaggerChildren staggerDelay={0.08} className="space-y-4 mb-10">
              {featureList.map((f) => (
                <StaggerItem key={f.text}>
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{f.emoji}</span>
                    <span className="text-[#191919]/80 text-base">{f.text}</span>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>

            <div className="text-center">
              <GradientButton href="#waitlist" size="lg">
                Join the Waitlist →
              </GradientButton>
              <p className="mt-4 text-sm font-semibold text-[#B153D7]">
                Waitlist members get 1st month completely FREE
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </SectionWrapper>
  );
}
