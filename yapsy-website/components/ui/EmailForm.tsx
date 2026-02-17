'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Confetti } from '@/components/animations/Confetti';
import { useGeo } from '@/lib/geo-context';

export function EmailForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [showConfetti, setShowConfetti] = useState(false);
  const { country } = useGeo();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('loading');

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const res = await fetch(`${apiBase}/api/v1/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, country }),
      });

      if (res.ok || res.status === 409) {
        setStatus('success');
        setShowConfetti(true);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <Confetti trigger={showConfetti} />
      <div className="w-full max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <motion.div
                className="text-5xl mb-4"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
              >
                🎉
              </motion.div>
              <h3
                className="text-2xl font-bold mb-2"
                style={{ fontFamily: 'var(--font-heading), sans-serif', color: '#FFF4EA' }}
              >
                You&apos;re on the list!
              </h3>
              <p className="text-[#FFF4EA]/70 mb-6">
                We&apos;ll let you know as soon as Yapsy is ready.
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <ShareButton
                  icon="𝕏"
                  label="Share on X"
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('Just joined the @yapsy_app waitlist! Your AI daily companion for mood tracking, smart tasks & voice check-ins. Join me → yapsy.app')}`}
                />
                <ShareButton
                  icon="in"
                  label="LinkedIn"
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://yapsy.app')}`}
                />
                <ShareButton
                  icon="💬"
                  label="WhatsApp"
                  href={`https://wa.me/?text=${encodeURIComponent('Check out Yapsy — an AI daily companion app! yapsy.app')}`}
                />
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  placeholder="your@email.com"
                  className="
                    w-full px-6 py-4 rounded-2xl
                    bg-[#FFF4EA] text-[#191919]
                    placeholder:text-[#191919]/40
                    text-base font-medium
                    outline-none
                    transition-shadow duration-300
                    focus:shadow-[0_0_0_3px_rgba(177,83,215,0.4)]
                  "
                  required
                />
              </div>
              <motion.button
                type="submit"
                disabled={status === 'loading'}
                className="
                  px-8 py-4 rounded-2xl
                  text-[#FFF4EA] font-semibold text-base
                  cursor-pointer
                  whitespace-nowrap
                  disabled:opacity-50
                "
                style={{
                  background: '#191919',
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {status === 'loading' ? (
                  <span className="flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="inline-block w-4 h-4 border-2 border-[#FFF4EA]/30 border-t-[#FFF4EA] rounded-full"
                    />
                    Joining...
                  </span>
                ) : (
                  'Join Waitlist →'
                )}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
        {status === 'error' && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 text-sm mt-3 text-center"
          >
            Something went wrong. Please try again.
          </motion.p>
        )}
      </div>
    </>
  );
}

function ShareButton({ icon, label, href }: { icon: string; label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="
        inline-flex items-center gap-2
        px-4 py-2 rounded-full
        bg-[#FFF4EA]/10 text-[#FFF4EA]
        text-sm font-medium
        hover:bg-[#FFF4EA]/20
        transition-colors duration-200
        border border-[#FFF4EA]/15
      "
    >
      <span>{icon}</span>
      <span>{label}</span>
    </a>
  );
}
