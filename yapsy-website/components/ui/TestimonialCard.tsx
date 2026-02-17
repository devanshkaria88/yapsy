'use client';

import { motion } from 'framer-motion';

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  className?: string;
}

export function TestimonialCard({ quote, name, role, className }: TestimonialCardProps) {
  return (
    <motion.div
      className={`
        relative flex-shrink-0 w-[360px]
        rounded-[24px] p-8
        ${className || ''}
      `}
      style={{
        background: 'rgba(255, 244, 234, 0.08)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 244, 234, 0.12)',
      }}
      whileHover={{
        rotateX: 2,
        rotateY: -2,
        scale: 1.02,
      }}
      transition={{ duration: 0.3 }}
      style-perspective="1000px"
    >
      {/* Quote mark */}
      <div
        className="text-5xl leading-none mb-4 font-heading"
        style={{
          background: 'linear-gradient(90deg, #FCB0F3 0%, #3D05DD 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        &ldquo;
      </div>

      <p className="text-[#191919] text-base leading-relaxed mb-6 font-normal">
        {quote}
      </p>

      <div className="flex items-center gap-3">
        {/* Avatar placeholder */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-[#FFF4EA]"
          style={{ background: 'linear-gradient(135deg, #FCB0F3, #3D05DD)' }}
        >
          {name.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-[#191919] text-sm">{name}</p>
          <p className="text-[#191919]/50 text-xs">{role}</p>
        </div>
      </div>
    </motion.div>
  );
}
