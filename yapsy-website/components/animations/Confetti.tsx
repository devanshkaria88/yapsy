'use client';

import { useSyncExternalStore } from 'react';

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

interface ConfettiState {
  show: boolean;
  pieces: Piece[];
}

const COLORS = ['#FCB0F3', '#3D05DD', '#B153D7', '#6EEE87', '#FFF4EA', '#C798E8'];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

let triggerCount = 0;

function generatePieces(): Piece[] {
  triggerCount += 1;
  const rand = seededRandom(triggerCount * 7919);
  return Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: rand() * 100,
    color: COLORS[Math.floor(rand() * COLORS.length)],
    delay: rand() * 0.5,
    rotation: rand() * 360,
    size: rand() * 8 + 4,
  }));
}

let state: ConfettiState = { show: false, pieces: [] };
let prevTrigger = false;
let hideTimer: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

function subscribeFn(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

function getSnapshotFn(): ConfettiState {
  return state;
}

function getServerSnapshotFn(): ConfettiState {
  return { show: false, pieces: [] };
}

function processConfettiTrigger(trigger: boolean) {
  if (trigger && !prevTrigger) {
    if (hideTimer) clearTimeout(hideTimer);
    state = { show: true, pieces: generatePieces() };
    hideTimer = setTimeout(() => {
      state = { ...state, show: false };
      notify();
    }, 3000);
  }
  prevTrigger = trigger;
}

export function Confetti({ trigger, className }: ConfettiProps) {
  processConfettiTrigger(trigger);

  const { show, pieces } = useSyncExternalStore(subscribeFn, getSnapshotFn, getServerSnapshotFn);

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
