'use client';

import { ScrollReveal, ParticleField } from '@/components/animations';
import { EmailForm } from '@/components/ui/EmailForm';

export function WaitlistSection() {
  return (
    <section
      id="waitlist"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, #FCB0F3 0%, #B153D7 40%, #3D05DD 100%)',
      }}
    >
      <ParticleField count={30} color="rgba(255, 244, 234, 0.15)" />

      <div className="relative z-10 max-w-[1280px] mx-auto px-5 md:px-8 lg:px-12">
        <div className="text-center max-w-2xl mx-auto">
          <ScrollReveal>
            <h2
              className="text-[32px] md:text-[48px] font-bold mb-4 text-[#FFF4EA]"
              style={{ fontFamily: 'var(--font-heading), sans-serif' }}
            >
              Ready to meet Yapsy?
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <p className="text-lg text-[#FFF4EA]/70 mb-10 max-w-md mx-auto">
              Join the waitlist. First month free for early birds.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <EmailForm />
          </ScrollReveal>

          <ScrollReveal delay={0.45}>
            <div className="mt-8 flex flex-col items-center gap-3">
              <p className="text-[#FFF4EA]/50 text-sm flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                No spam. Unsubscribe anytime.
              </p>
              <p className="text-[#FFF4EA]/40 text-sm">
                Join 200+ people already on the list
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
