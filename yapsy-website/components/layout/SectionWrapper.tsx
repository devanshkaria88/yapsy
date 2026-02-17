'use client';

interface SectionWrapperProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  dark?: boolean;
  fullWidth?: boolean;
  noPadding?: boolean;
  fullScreen?: boolean;
}

export function SectionWrapper({
  children,
  id,
  className,
  dark = false,
  fullWidth = false,
  noPadding = false,
  fullScreen = false,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`
        relative
        ${noPadding ? '' : 'py-20 md:py-32'}
        ${fullScreen ? 'min-h-screen flex flex-col justify-center' : ''}
        ${dark ? 'bg-[#191919] text-[#FFF4EA]' : ''}
        ${className || ''}
      `}
    >
      <div
        className={`
          relative z-10 w-full
          ${fullWidth ? 'w-full' : 'max-w-[1280px] mx-auto px-5 md:px-8 lg:px-12'}
        `}
      >
        {children}
      </div>
    </section>
  );
}
