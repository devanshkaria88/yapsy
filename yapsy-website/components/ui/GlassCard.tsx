'use client';

import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: string;
}

export function GlassCard({
  children,
  className,
  hover = true,
  padding = 'p-8',
}: GlassCardProps) {
  return (
    <motion.div
      className={`
        relative overflow-hidden
        rounded-[24px]
        ${padding}
        ${className || ''}
      `}
      style={{
        background: 'rgba(255, 244, 234, 0.12)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 244, 234, 0.18)',
        boxShadow: '0 8px 32px rgba(177, 83, 215, 0.1)',
      }}
      whileHover={
        hover
          ? {
              y: -8,
              boxShadow: '0 16px 48px rgba(177, 83, 215, 0.25)',
            }
          : undefined
      }
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
