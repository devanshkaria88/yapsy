'use client';

import { Marquee } from '@/components/animations';

const testimonials = [
  {
    quote: "Simple, voice-first, and super powerful",
    name: 'Sarah K.',
    role: 'Beta Tester',
  },
  {
    quote: "The best AI companion app I've seen",
    name: 'Raj M.',
    role: 'Early User',
  },
  {
    quote: "Nothing short of magical",
    name: 'Alex T.',
    role: 'Waitlist Member',
  },
  {
    quote: "Three minutes before bed — and everything is captured",
    name: 'Priya S.',
    role: 'Beta Tester',
  },
  {
    quote: "Like a therapist, assistant, and diary in one",
    name: 'James L.',
    role: 'Early User',
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-8 md:py-12 border-y border-[#191919]/5 bg-[#FFF4EA] overflow-hidden">
      <Marquee speed={50} pauseOnHover>
        {testimonials.map((t, i) => (
          <div key={i} className="flex items-center gap-6 flex-shrink-0 px-4">
            <p className="text-[#191919]/70 text-base md:text-lg italic whitespace-nowrap">
              &ldquo;{t.quote}&rdquo;
            </p>
            <span className="text-[#191919]/30 text-sm font-medium whitespace-nowrap">
              — {t.name}, {t.role}
            </span>
            <span className="text-[#B153D7]/30 text-lg">|</span>
          </div>
        ))}
      </Marquee>
    </section>
  );
}
