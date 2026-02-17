'use client';

import { useEffect, useMemo, useState } from 'react';

interface ConfettiProps {
  trigger: boolean;
  className?: string;
}

interface Piece {
  id: number;
  x: number;
  color: string;
  delay: number;
  rotation: number;
  size: number;
}

export function Confetti({ trigger, className }: ConfettiProps) {
  const [show, setShow] = useState(false);

  const pieces = useMemo<Piece[]>(() => {
    const colors = ['#FCB0F3', '#3D05DD', '#B153D7', '#6EEE87', '#FFF4EA', '#C798E8'];
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.5,
      rotation: Math.random() * 360,
      size: Math.random() * 8 + 4,
    }));
  }, []);

  useEffect(() => {
    if (trigger) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  if (!show) return null;

  return (
    <div className={`fixed inset-0 pointer-events-none z-[100] ${className || ''}`}>
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute"
          style={{
            left: `${piece.x}%`,
            top: '-10px',
            width: piece.size,
            height: piece.size * 0.6,
            background: piece.color,
            borderRadius: '2px',
            transform: `rotate(${piece.rotation}deg)`,
            animation: `confetti-fall 2.5s ease-in forwards`,
            animationDelay: `${piece.delay}s`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
