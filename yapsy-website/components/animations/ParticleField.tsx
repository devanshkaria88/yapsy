'use client';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

interface ParticleFieldProps {
  count?: number;
  className?: string;
  color?: string;
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateParticles(count: number): Particle[] {
  const rand = seededRandom(42);
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: rand() * 100,
    y: rand() * 100,
    size: rand() * 4 + 2,
    duration: rand() * 20 + 15,
    delay: rand() * 10,
  }));
}

export function ParticleField({
  count = 30,
  className,
  color = 'rgba(255, 244, 234, 0.3)',
}: ParticleFieldProps) {
  const particles = generateParticles(count);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className || ''}`}>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: color,
            animation: `drift ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
            opacity: 0.6,
          }}
        />
      ))}
    </div>
  );
}
