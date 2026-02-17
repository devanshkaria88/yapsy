'use client';

import { ScrollReveal, StaggerChildren, StaggerItem } from '@/components/animations';
import { SectionWrapper } from '@/components/layout/SectionWrapper';

const steps = [
  {
    number: '01',
    title: 'Yap about your day',
    description:
      'Open Yapsy before bed. Talk naturally about what happened, what you did, how you feel. No prompts, no structure — just talk.',
    icon: '🗣️',
  },
  {
    number: '02',
    title: 'Yapsy does the rest',
    description:
      'AI processes your check-in instantly. Tasks are extracted, mood is tracked, patterns are analyzed, and your journal entry is written.',
    icon: '🧠',
  },
  {
    number: '03',
    title: 'Wake up smarter',
    description:
      'Start tomorrow with a clear dashboard. Your tasks are prioritized, insights are ready, and your streak keeps growing.',
    icon: '✨',
  },
];

export function HowItWorksSection() {
  return (
    <SectionWrapper id="how-it-works" className="bg-[#FFF4EA]">
      <div className="text-center mb-16 md:mb-20">
        <ScrollReveal>
          <span
            className="inline-block text-sm font-semibold tracking-widest uppercase mb-4"
            style={{ color: '#B153D7' }}
          >
            How it works
          </span>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <h2
            className="text-[28px] md:text-[44px] font-bold mb-4"
            style={{
              fontFamily: 'var(--font-heading), sans-serif',
              color: '#191919',
            }}
          >
            3 minutes. Every night.
            <br />
            That&apos;s all it takes.
          </h2>
        </ScrollReveal>
      </div>

      <StaggerChildren staggerDelay={0.15} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step) => (
          <StaggerItem key={step.number}>
            <div
              className="text-center rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1"
              style={{
                background: 'white',
                border: '1px solid rgba(177, 83, 215, 0.08)',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
              }}
            >
              {/* Icon */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mb-6 mx-auto"
                style={{
                  background: 'linear-gradient(135deg, #FCB0F3, #3D05DD)',
                  boxShadow: '0 4px 16px rgba(177, 83, 215, 0.2)',
                }}
              >
                {step.icon}
              </div>

              <p
                className="text-xs font-bold tracking-widest uppercase mb-3"
                style={{ color: '#B153D7' }}
              >
                Step {step.number}
              </p>

              <h3
                className="text-xl font-bold mb-3"
                style={{
                  fontFamily: 'var(--font-heading), sans-serif',
                  color: '#191919',
                }}
              >
                {step.title}
              </h3>

              <p className="text-[#191919]/50 text-base leading-relaxed">
                {step.description}
              </p>
            </div>
          </StaggerItem>
        ))}
      </StaggerChildren>
    </SectionWrapper>
  );
}
