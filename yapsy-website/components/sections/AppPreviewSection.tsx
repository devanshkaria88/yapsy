'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollReveal, FloatingElement } from '@/components/animations';
import { SectionWrapper } from '@/components/layout/SectionWrapper';

const screens = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    content: <DashboardScreen />,
  },
  {
    id: 'tasks',
    title: 'Tasks',
    content: <TasksScreen />,
  },
  {
    id: 'voice',
    title: 'Voice',
    content: <VoiceScreen />,
  },
  {
    id: 'journal',
    title: 'Journal',
    content: <JournalScreen />,
  },
];

export function AppPreviewSection() {
  const [currentScreen, setCurrentScreen] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentScreen((prev) => (prev + 1) % screens.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <SectionWrapper id="app-preview" dark className="overflow-hidden dot-grid grain-overlay grain-overlay-dark">
      {/* Light leak effect */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse, rgba(177, 83, 215, 0.15) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="grain-content text-center mb-12 md:mb-16">
        <ScrollReveal>
          <span className="inline-block text-sm font-semibold tracking-widest uppercase mb-4 text-[#B153D7]">
            App Preview
          </span>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <h2
            className="text-[32px] md:text-[48px] font-bold mb-4 text-[#FFF4EA]"
            style={{ fontFamily: 'var(--font-heading), sans-serif' }}
          >
            See Yapsy in action
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <p className="text-lg text-[#FFF4EA]/50 max-w-lg mx-auto">
            Beautiful, focused screens designed to help you reflect and grow.
          </p>
        </ScrollReveal>
      </div>

      <div className="grain-content relative flex flex-col items-center">
        {/* Phone */}
        <div className="relative">
          {/* Glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[500px]"
            style={{
              background:
                'radial-gradient(circle, rgba(177, 83, 215, 0.3) 0%, transparent 60%)',
              filter: 'blur(60px)',
            }}
          />

          {/* Phone frame */}
          <div
            className="relative z-10 mx-auto rounded-[48px] overflow-hidden"
            style={{
              width: '300px',
              height: '620px',
              background: '#0a0a0a',
              padding: '12px',
              boxShadow:
                '0 32px 80px rgba(177, 83, 215, 0.3), 0 0 0 1px rgba(255,244,234,0.08)',
            }}
          >
            {/* Notch */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 z-20"
              style={{
                width: '120px',
                height: '28px',
                background: '#0a0a0a',
                borderRadius: '0 0 20px 20px',
              }}
            />

            {/* Screen */}
            <div className="relative w-full h-full rounded-[36px] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentScreen}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0"
                >
                  {screens[currentScreen].content}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Floating annotation cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            viewport={{ once: true }}
            className="absolute -right-8 md:-right-32 top-16 hidden md:block z-20"
          >
            <FloatingElement amplitude={5} duration={3.5}>
              <AnnotationCard emoji="🔥" label="12 day streak" sublabel="Personal best!" />
            </FloatingElement>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 }}
            viewport={{ once: true }}
            className="absolute -left-8 md:-left-32 top-1/3 hidden md:block z-20"
          >
            <FloatingElement amplitude={6} duration={4} delay={0.5}>
              <AnnotationCard emoji="😊" label="Mood: 7/10" sublabel="Trending up" />
            </FloatingElement>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            viewport={{ once: true }}
            className="absolute -right-4 md:-right-24 bottom-32 hidden md:block z-20"
          >
            <FloatingElement amplitude={4} duration={3} delay={1}>
              <AnnotationCard emoji="✅" label="3 tasks done" sublabel="2 remaining" />
            </FloatingElement>
          </motion.div>
        </div>

        {/* Screen dots */}
        <div className="flex justify-center gap-3 mt-8 z-10">
          {screens.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setCurrentScreen(i)}
              className={`
                h-2 rounded-full transition-all duration-300
                ${i === currentScreen ? 'w-8 bg-[#B153D7]' : 'w-2 bg-[#FFF4EA]/20'}
              `}
              aria-label={`Show ${s.title} screen`}
            />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

function AnnotationCard({
  emoji,
  label,
  sublabel,
}: {
  emoji: string;
  label: string;
  sublabel: string;
}) {
  return (
    <div
      className="rounded-2xl px-5 py-3"
      style={{
        background: 'rgba(255, 244, 234, 0.12)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 244, 234, 0.15)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      }}
    >
      <div className="flex items-center gap-2.5">
        <span className="text-xl">{emoji}</span>
        <div>
          <p className="text-sm font-semibold text-[#FFF4EA]">{label}</p>
          <p className="text-[10px] text-[#FFF4EA]/40">{sublabel}</p>
        </div>
      </div>
    </div>
  );
}

/* Phone screen content components */
function DashboardScreen() {
  return (
    <div className="w-full h-full p-5 flex flex-col gap-3" style={{ background: 'linear-gradient(180deg, #F6C4ED 0%, #FFF4EA 100%)' }}>
      <div className="mt-8">
        <p className="text-xs text-[#191919]/50">Good evening</p>
        <p className="text-lg font-bold text-[#191919]" style={{ fontFamily: 'var(--font-heading)' }}>Dashboard</p>
      </div>
      <div className="rounded-2xl p-4 bg-[#FFF4EA]/80 border border-[#FFF4EA]/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[#191919]/50">Weekly mood</span>
          <span className="text-xs font-semibold text-[#B153D7]">↑ 12%</span>
        </div>
        <div className="flex items-end gap-1 h-12">
          {[4, 6, 5, 7, 8, 7, 9].map((v, i) => (
            <div key={i} className="flex-1 rounded-t-sm" style={{
              height: `${v * 10}%`,
              background: i === 6 ? 'linear-gradient(180deg, #B153D7, #3D05DD)' : '#B153D7/20',
              opacity: i === 6 ? 1 : 0.2,
            }} />
          ))}
        </div>
      </div>
      <div className="rounded-2xl p-4 bg-[#FFF4EA]/80 border border-[#FFF4EA]/50">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          <div>
            <p className="text-sm font-bold text-[#191919]">12 day streak</p>
            <p className="text-[10px] text-[#191919]/40">Keep it going!</p>
          </div>
        </div>
      </div>
      <div className="rounded-2xl p-4 bg-[#FFF4EA]/80 border border-[#FFF4EA]/50 flex-1">
        <p className="text-xs text-[#191919]/50 mb-2">Today&apos;s insight</p>
        <p className="text-sm text-[#191919]/70 leading-relaxed">You tend to feel most productive on Tuesdays. Consider scheduling important tasks then.</p>
      </div>
    </div>
  );
}

function TasksScreen() {
  return (
    <div className="w-full h-full p-5 flex flex-col gap-3" style={{ background: 'linear-gradient(180deg, #E8D5F5 0%, #FFF4EA 100%)' }}>
      <div className="mt-8">
        <p className="text-xs text-[#191919]/50">Today</p>
        <p className="text-lg font-bold text-[#191919]" style={{ fontFamily: 'var(--font-heading)' }}>Tasks</p>
      </div>
      {[
        { text: 'Review Q1 presentation', done: true },
        { text: 'Call dentist to reschedule', done: true },
        { text: 'Send project update email', done: true },
        { text: 'Finish expense report', done: false },
        { text: 'Research holiday flights', done: false },
      ].map((task, i) => (
        <div key={i} className="flex items-center gap-3 rounded-2xl p-3 bg-[#FFF4EA]/80 border border-[#FFF4EA]/50">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${task.done ? '' : 'border-2 border-[#191919]/15'}`}
            style={task.done ? { background: 'linear-gradient(135deg, #6EEE87, #18C63A)' } : undefined}>
            {task.done && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5L4.5 7.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>}
          </div>
          <span className={`text-sm ${task.done ? 'text-[#191919]/40 line-through' : 'text-[#191919]'}`}>{task.text}</span>
        </div>
      ))}
    </div>
  );
}

function VoiceScreen() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center" style={{ background: 'linear-gradient(180deg, #191919 0%, #2a1a3a 100%)' }}>
      <p className="text-[#FFF4EA]/50 text-sm mb-8">Listening...</p>
      <div className="relative">
        <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FCB0F3, #3D05DD)', boxShadow: '0 0 60px rgba(177, 83, 215, 0.5)' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FFF4EA" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>
        </div>
        <div className="absolute inset-0 rounded-full animate-ping" style={{ background: 'rgba(177, 83, 215, 0.2)', animationDuration: '2s' }} />
        <div className="absolute -inset-4 rounded-full animate-ping" style={{ background: 'rgba(177, 83, 215, 0.1)', animationDuration: '2.5s' }} />
      </div>
      <p className="text-[#FFF4EA] text-base mt-8 max-w-[200px] text-center leading-relaxed">&ldquo;Today was pretty good, I finished the presentation and...&rdquo;</p>
    </div>
  );
}

function JournalScreen() {
  return (
    <div className="w-full h-full p-5 flex flex-col gap-3" style={{ background: 'linear-gradient(180deg, #FFF4EA 0%, #F6E8D8 100%)' }}>
      <div className="mt-8">
        <p className="text-xs text-[#191919]/50">February 15, 2026</p>
        <p className="text-lg font-bold text-[#191919]" style={{ fontFamily: 'var(--font-heading)' }}>Journal</p>
      </div>
      <div className="rounded-2xl p-4 bg-[#FFF4EA]/90 border border-[#191919]/5 flex-1">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm">😊</span>
          <span className="text-xs font-semibold text-[#B153D7]">Good day</span>
        </div>
        <p className="text-sm text-[#191919]/70 leading-relaxed">
          Today was productive. You completed the Q1 presentation that had been weighing on you — a real win.
          You mentioned feeling relieved after finishing it, which suggests deadline-driven stress has been building up.
          <br /><br />
          The call with the dentist went smoothly. Small tasks like these, when completed, tend to lift your overall mood by 15% based on your patterns.
        </p>
      </div>
      <div className="text-center">
        <p className="text-[10px] text-[#191919]/30">Written by Yapsy AI</p>
      </div>
    </div>
  );
}
