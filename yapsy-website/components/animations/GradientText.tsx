'use client';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
}

export function GradientText({
  children,
  className,
  gradient = 'linear-gradient(90deg, #FCB0F3 0%, #3D05DD 100%)',
}: GradientTextProps) {
  return (
    <span
      className={className}
      style={{
        background: gradient,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      {children}
    </span>
  );
}
