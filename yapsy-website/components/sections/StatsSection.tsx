'use client';

import { Marquee, CountUp } from '@/components/animations';

const stats = [
  { value: 200, suffix: '+', label: 'People on the waitlist' },
  { value: 4, suffix: '', label: 'AI-powered features' },
  { value: 3, suffix: ' min', label: 'Per nightly check-in' },
  { value: 1, suffix: '', label: 'Voice conversation' },
];

export function StatsSection() {
  return (
    <section className="py-16 md:py-20 bg-[#191919] overflow-hidden">
      <Marquee speed={35}>
        {stats.map((stat, i) => (
          <div key={i} className="flex items-center gap-8 flex-shrink-0 px-8">
            <div className="flex items-baseline gap-1">
              <span
                className="text-4xl md:text-5xl font-bold"
                style={{
                  fontFamily: 'var(--font-heading), sans-serif',
                  background: 'linear-gradient(90deg, #FCB0F3, #B153D7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                <CountUp target={stat.value} duration={2} />
                {stat.suffix}
              </span>
            </div>
            <span className="text-[#FFF4EA]/40 text-sm font-medium whitespace-nowrap">
              {stat.label}
            </span>
            {/* Separator dot */}
            <div className="w-1.5 h-1.5 rounded-full bg-[#B153D7]/30" />
          </div>
        ))}
      </Marquee>
    </section>
  );
}
