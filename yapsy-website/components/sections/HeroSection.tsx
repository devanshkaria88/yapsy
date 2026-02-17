'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ScrollReveal } from '@/components/animations';
import { GradientButton } from '@/components/ui/GradientButton';

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden"
      style={{ background: '#FFF4EA' }}
    >
      {/* Subtle purple radial glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse, rgba(199, 152, 232, 0.2) 0%, rgba(246, 196, 237, 0.1) 40%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-5 md:px-8 lg:px-12">
        {/* Centered copy */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <ScrollReveal delay={0}>
            <span
              className="inline-block text-sm font-semibold tracking-widest uppercase mb-6"
              style={{ color: '#B153D7' }}
            >
              Your AI daily companion
            </span>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <h1
              className="text-[44px] md:text-[64px] lg:text-[80px] font-bold leading-[1.05] mb-6"
              style={{
                fontFamily: 'var(--font-heading), sans-serif',
                color: '#191919',
              }}
            >
              Yap about your day.{' '}
              <span
                style={{
                  background: 'linear-gradient(90deg, #B153D7, #3D05DD)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Yapsy handles the rest.
              </span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <p className="text-lg md:text-xl text-[#191919]/60 max-w-xl mx-auto mb-10 leading-relaxed">
              Talk to Yapsy at the end of your day. It captures your mood, manages
              tasks, spots patterns, and writes your journal — all from one voice conversation.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.45}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <GradientButton href="#waitlist" size="lg">
                Join the Waitlist →
              </GradientButton>
            </div>
            <p className="text-[#191919]/40 text-sm">
              14-day free trial · No credit card required
            </p>
          </ScrollReveal>

          {/* Social proof */}
          <ScrollReveal delay={0.6}>
            <div className="flex items-center justify-center gap-3 mt-8">
              <div className="flex -space-x-2">
                {['#FCB0F3', '#B153D7', '#3D05DD', '#C798E8'].map((color, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-[#FFF4EA] flex items-center justify-center text-[10px] font-bold text-[#FFF4EA]"
                    style={{ background: color }}
                  >
                    {['S', 'R', 'A', 'P'][i]}
                  </div>
                ))}
              </div>
              <span className="text-[#191919]/50 text-sm font-medium">
                200+ people already waiting
              </span>
            </div>
          </ScrollReveal>
        </div>

        {/* Large centered app screenshot */}
        <ScrollReveal delay={0.5}>
          <div className="relative flex justify-center">
            {/* Purple glow under phone */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse, rgba(177, 83, 215, 0.25) 0%, transparent 70%)',
                filter: 'blur(60px)',
              }}
            />

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative w-[280px] md:w-[340px] lg:w-[380px]"
            >
              <Image
                src="/images/yapsy-preview.webp"
                alt="Yapsy app dashboard showing mood tracking, tasks, and daily streaks"
                width={380}
                height={780}
                className="w-full h-auto"
                priority
                style={{
                  filter: 'drop-shadow(0 24px 48px rgba(177, 83, 215, 0.2))',
                }}
              />
            </motion.div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
