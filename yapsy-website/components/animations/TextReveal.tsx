'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface TextRevealProps {
  text: string;
  delay?: number;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

export function TextReveal({
  text,
  delay = 0,
  className,
  as: Tag = 'h1',
}: TextRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const lines = text.split('\n');

  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            className="block"
            initial={{ y: '100%', opacity: 0 }}
            animate={isInView ? { y: '0%', opacity: 1 } : undefined}
            transition={{
              duration: 0.6,
              delay: delay + i * 0.15,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
