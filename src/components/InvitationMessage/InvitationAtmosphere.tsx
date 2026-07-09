import { useMemo } from 'react';
import './invitation.css';

interface Particle {
  id: number;
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
}

function useRandomParticles(count: number, sizeRange: [number, number]): Particle[] {
  return useMemo(
    () =>
      Array.from({ length: count }).map((_, id) => ({
        id,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
        duration: 10 + Math.random() * 10,
        delay: Math.random() * 6,
      })),
    [count],
  );
}

export function InvitationAtmosphere() {
  const dust = useRandomParticles(14, [1, 2]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 invitation-radial-light" />
      <div className="absolute inset-0 invitation-vignette" />

      <svg className="absolute inset-0 h-full w-full opacity-[0.03] mix-blend-multiply">
        <filter id="invitation-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#invitation-grain)" />
      </svg>

      {dust.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full bg-[#C49A54]"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            top: `${p.top}%`,
            opacity: 0.16,
            animation: `invitation-dust-drift ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}

      <style>{`
        @keyframes invitation-dust-drift {
          0%, 100% { transform: translate(0, 0); opacity: 0.08; }
          50% { transform: translate(5px, -9px); opacity: 0.2; }
        }
        @media (prefers-reduced-motion: reduce) {
          span { animation: none !important; }
        }
      `}</style>
    </div>
  );
}