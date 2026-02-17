'use client';

import { motion } from 'framer-motion';

interface GradientButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  pulse?: boolean;
}

export function GradientButton({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  className,
  type = 'button',
  disabled = false,
  pulse = false,
}: GradientButtonProps) {
  const sizeClasses = {
    sm: 'px-5 py-2.5 text-sm',
    md: 'px-7 py-3.5 text-base',
    lg: 'px-10 py-4.5 text-lg',
  };

  const variantStyles = {
    primary: {
      background: 'linear-gradient(90deg, #FCB0F3 0%, #3D05DD 100%)',
      color: '#FFF4EA',
    },
    dark: {
      background: '#191919',
      color: '#FFF4EA',
    },
  };

  const baseClasses = `
    inline-flex items-center justify-center gap-2
    rounded-full font-semibold
    cursor-pointer select-none
    transition-shadow duration-300
    ${sizeClasses[size]}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${pulse ? 'animate-[pulse-glow_3s_ease-in-out_infinite]' : ''}
    ${className || ''}
  `.trim();

  const content = (
    <motion.span
      className={baseClasses}
      style={{
        ...variantStyles[variant],
        boxShadow: '0 8px 32px rgba(177, 83, 215, 0.3)',
      }}
      whileHover={
        disabled
          ? undefined
          : {
              scale: 1.05,
              boxShadow: '0 12px 40px rgba(177, 83, 215, 0.5)',
            }
      }
      whileTap={disabled ? undefined : { scale: 0.97 }}
    >
      {children}
    </motion.span>
  );

  if (href) {
    return (
      <a href={href} className="inline-block">
        {content}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className="inline-block">
      {content}
    </button>
  );
}
