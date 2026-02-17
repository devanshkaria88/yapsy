'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PhoneMockupProps {
  screens?: string[];
  autoPlay?: boolean;
  interval?: number;
  className?: string;
  children?: React.ReactNode;
}

export function PhoneMockup({
  screens,
  autoPlay = false,
  interval = 4000,
  className,
  children,
}: PhoneMockupProps) {
  const [currentScreen, setCurrentScreen] = useState(0);

  useEffect(() => {
    if (!autoPlay || !screens || screens.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentScreen((prev) => (prev + 1) % screens.length);
    }, interval);
    return () => clearInterval(timer);
  }, [autoPlay, screens, interval]);

  return (
    <div className={`relative ${className || ''}`}>
      {/* Phone frame */}
      <div
        className="relative mx-auto rounded-[48px] overflow-hidden"
        style={{
          width: '280px',
          height: '580px',
          background: '#191919',
          padding: '12px',
          boxShadow: '0 32px 80px rgba(177, 83, 215, 0.3), 0 0 0 1px rgba(255,244,234,0.1)',
        }}
      >
        {/* Notch */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 z-10"
          style={{
            width: '120px',
            height: '28px',
            background: '#191919',
            borderRadius: '0 0 20px 20px',
          }}
        />

        {/* Screen area */}
        <div
          className="relative w-full h-full rounded-[36px] overflow-hidden"
          style={{ background: '#FFF4EA' }}
        >
          {children ? (
            children
          ) : screens ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentScreen}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #F6C4ED 0%, #C798E8 100%)' }}
              >
                <span className="text-[#191919]/40 text-sm font-medium">
                  {screens[currentScreen]}
                </span>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #F6C4ED 0%, #C798E8 100%)' }}
            >
              <span className="text-[#191919]/40 text-sm">Yapsy</span>
            </div>
          )}
        </div>
      </div>

      {/* Screen dots indicator */}
      {screens && screens.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {screens.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentScreen(i)}
              className={`
                w-2 h-2 rounded-full transition-all duration-300
                ${i === currentScreen ? 'bg-accent w-6' : 'bg-[#FFF4EA]/30'}
              `}
            />
          ))}
        </div>
      )}
    </div>
  );
}
