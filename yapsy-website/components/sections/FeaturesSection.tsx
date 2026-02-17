'use client';

import { ScrollReveal } from '@/components/animations';
import { SectionWrapper } from '@/components/layout/SectionWrapper';

const features = [
  {
    eyebrow: 'Voice-first',
    title: 'Talk, don\u2019t type',
    description:
      'Just speak naturally at the end of your day. Yapsy listens, understands, and captures everything \u2014 your tasks, moods, wins, and worries. No typing, no friction.',
    screen: <VoiceScreen />,
  },
  {
    eyebrow: 'Insights',
    title: 'Patterns you\u2019d miss',
    description:
      'Yapsy tracks your mood, energy, and productivity over time. It surfaces insights you\u2019d never notice on your own \u2014 like what makes your good days good.',
    screen: <DashboardScreen />,
  },
  {
    eyebrow: 'Smart tasks',
    title: 'Tasks that think',
    description:
      'Mention something you need to do and Yapsy creates a smart task. Missed it? It rolls forward automatically. No guilt, no forgotten to-dos.',
    screen: <TasksScreen />,
  },
  {
    eyebrow: 'AI journal',
    title: 'Your story, written for you',
    description:
      'Every conversation becomes a beautifully written journal entry. Yapsy captures the emotion, context, and meaning \u2014 so you never have to stare at a blank page.',
    screen: <JournalScreen />,
  },
];

export function FeaturesSection() {
  return (
    <div id="features">
      {features.map((feature, i) => (
        <FeatureRow key={feature.title} feature={feature} index={i} />
      ))}
    </div>
  );
}

function FeatureRow({
  feature,
  index,
}: {
  feature: (typeof features)[number];
  index: number;
}) {
  const isReversed = index % 2 !== 0;

  return (
    <SectionWrapper
      className={index % 2 === 0 ? 'bg-[#FFF4EA]' : 'bg-white'}
    >
      <div
        className={`
          grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center
          ${isReversed ? 'lg:direction-rtl' : ''}
        `}
      >
        {/* Text column */}
        <div className={`${isReversed ? 'lg:order-2' : 'lg:order-1'}`}>
          <ScrollReveal direction={isReversed ? 'right' : 'left'}>
            <span
              className="inline-block text-sm font-semibold tracking-widest uppercase mb-4"
              style={{ color: '#B153D7' }}
            >
              {feature.eyebrow}
            </span>
            <h2
              className="text-[28px] md:text-[40px] font-bold mb-5 leading-tight"
              style={{
                fontFamily: 'var(--font-heading), sans-serif',
                color: '#191919',
              }}
            >
              {feature.title}
            </h2>
            <p className="text-[#191919]/60 text-lg leading-relaxed max-w-md">
              {feature.description}
            </p>
          </ScrollReveal>
        </div>

        {/* Phone mockup column */}
        <div className={`flex justify-center ${isReversed ? 'lg:order-1' : 'lg:order-2'}`}>
          <ScrollReveal direction={isReversed ? 'left' : 'right'} delay={0.15}>
            <div className="relative">
              {/* Subtle glow */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[400px] pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle, rgba(177, 83, 215, 0.12) 0%, transparent 70%)',
                  filter: 'blur(40px)',
                }}
              />
              {/* Phone frame */}
              <div
                className="relative z-10 mx-auto rounded-[40px] overflow-hidden"
                style={{
                  width: '260px',
                  height: '540px',
                  background: '#191919',
                  padding: '10px',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.12)',
                }}
              >
                {/* Notch */}
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 z-20"
                  style={{
                    width: '100px',
                    height: '24px',
                    background: '#191919',
                    borderRadius: '0 0 16px 16px',
                  }}
                />
                <div className="relative w-full h-full rounded-[30px] overflow-hidden">
                  {feature.screen}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </SectionWrapper>
  );
}

/* Phone screen content components (moved from AppPreviewSection) */

function VoiceScreen() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center" style={{ background: 'linear-gradient(180deg, #191919 0%, #2a1a3a 100%)' }}>
      <p className="text-[#FFF4EA]/50 text-xs mb-6">Listening...</p>
      <div className="relative">
        <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FCB0F3, #3D05DD)', boxShadow: '0 0 40px rgba(177, 83, 215, 0.5)' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFF4EA" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>
        </div>
        <div className="absolute inset-0 rounded-full animate-ping" style={{ background: 'rgba(177, 83, 215, 0.15)', animationDuration: '2s' }} />
      </div>
      <p className="text-[#FFF4EA] text-sm mt-6 max-w-[180px] text-center leading-relaxed">&ldquo;Today was pretty good, I finished the presentation...&rdquo;</p>
    </div>
  );
}

function DashboardScreen() {
  return (
    <div className="w-full h-full p-4 flex flex-col gap-2.5" style={{ background: 'linear-gradient(180deg, #F6C4ED 0%, #FFF4EA 100%)' }}>
      <div className="mt-7">
        <p className="text-[10px] text-[#191919]/50">Good evening</p>
        <p className="text-base font-bold text-[#191919]" style={{ fontFamily: 'var(--font-heading)' }}>Dashboard</p>
      </div>
      <div className="rounded-xl p-3 bg-[#FFF4EA]/80 border border-[#FFF4EA]/50">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-[#191919]/50">Weekly mood</span>
          <span className="text-[10px] font-semibold text-[#B153D7]">+12%</span>
        </div>
        <div className="flex items-end gap-0.5 h-10">
          {[4, 6, 5, 7, 8, 7, 9].map((v, i) => (
            <div key={i} className="flex-1 rounded-t-sm" style={{
              height: `${v * 10}%`,
              background: i === 6 ? 'linear-gradient(180deg, #B153D7, #3D05DD)' : 'rgba(177,83,215,0.15)',
            }} />
          ))}
        </div>
      </div>
      <div className="rounded-xl p-3 bg-[#FFF4EA]/80 border border-[#FFF4EA]/50">
        <div className="flex items-center gap-2">
          <span className="text-xl">🔥</span>
          <div>
            <p className="text-xs font-bold text-[#191919]">12 day streak</p>
            <p className="text-[9px] text-[#191919]/40">Keep it going!</p>
          </div>
        </div>
      </div>
      <div className="rounded-xl p-3 bg-[#FFF4EA]/80 border border-[#FFF4EA]/50 flex-1">
        <p className="text-[10px] text-[#191919]/50 mb-1">Today&apos;s insight</p>
        <p className="text-xs text-[#191919]/70 leading-relaxed">You feel most productive on Tuesdays. Schedule important tasks then.</p>
      </div>
    </div>
  );
}

function TasksScreen() {
  return (
    <div className="w-full h-full p-4 flex flex-col gap-2.5" style={{ background: 'linear-gradient(180deg, #E8D5F5 0%, #FFF4EA 100%)' }}>
      <div className="mt-7">
        <p className="text-[10px] text-[#191919]/50">Today</p>
        <p className="text-base font-bold text-[#191919]" style={{ fontFamily: 'var(--font-heading)' }}>Tasks</p>
      </div>
      {[
        { text: 'Review Q1 presentation', done: true },
        { text: 'Call dentist to reschedule', done: true },
        { text: 'Send project update email', done: true },
        { text: 'Finish expense report', done: false },
        { text: 'Research holiday flights', done: false },
      ].map((task, i) => (
        <div key={i} className="flex items-center gap-2.5 rounded-xl p-2.5 bg-[#FFF4EA]/80 border border-[#FFF4EA]/50">
          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${task.done ? '' : 'border-2 border-[#191919]/15'}`}
            style={task.done ? { background: 'linear-gradient(135deg, #6EEE87, #18C63A)' } : undefined}>
            {task.done && <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M2 5L4.5 7.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>}
          </div>
          <span className={`text-xs ${task.done ? 'text-[#191919]/40 line-through' : 'text-[#191919]'}`}>{task.text}</span>
        </div>
      ))}
    </div>
  );
}

function JournalScreen() {
  return (
    <div className="w-full h-full p-4 flex flex-col gap-2.5" style={{ background: 'linear-gradient(180deg, #FFF4EA 0%, #F6E8D8 100%)' }}>
      <div className="mt-7">
        <p className="text-[10px] text-[#191919]/50">February 15, 2026</p>
        <p className="text-base font-bold text-[#191919]" style={{ fontFamily: 'var(--font-heading)' }}>Journal</p>
      </div>
      <div className="rounded-xl p-3 bg-[#FFF4EA]/90 border border-[#191919]/5 flex-1">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-xs">😊</span>
          <span className="text-[10px] font-semibold text-[#B153D7]">Good day</span>
        </div>
        <p className="text-xs text-[#191919]/70 leading-relaxed">
          Today was productive. You completed the Q1 presentation — a real win.
          You mentioned feeling relieved, which suggests deadline-driven stress.
          <br /><br />
          Small tasks like the dentist call lift your mood by 15% based on your patterns.
        </p>
      </div>
      <div className="text-center pb-1">
        <p className="text-[9px] text-[#191919]/30">Written by Yapsy AI</p>
      </div>
    </div>
  );
}
