import { useMemo } from 'react';
import './hero.css';

interface Particle {
  id: number;
  left: number;
  top: number;
  size?: number;
  duration: number;
  delay: number;
}

function useRandomParticles(count: number, sizeRange?: [number, number]): Particle[] {
  return useMemo(
    () =>
      Array.from({ length: count }).map((_, id) => ({
        id,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: sizeRange ? sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]) : undefined,
        duration: 8 + Math.random() * 10,
        delay: Math.random() * 6,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [count],
  );
}

/**
 * HeroAtmosphere — layered depth that is felt rather than seen.
 * Order: top darkness → warm light → neutral vignette → bottom vignette
 *        → grain texture (near-invisible) → dust → bokeh → occasional sparkle.
 * Particle positions are randomized once (useMemo) so no mathematical
 * pattern is visible, and everything keeps drifting through scroll —
 * nothing here reacts to or stops on scroll.
 */
export function HeroAtmosphere() {
  const dust = useRandomParticles(22, [1, 2]);
  const bokeh = useRandomParticles(5, [42, 96]);
  const sparkle = useRandomParticles(4);

  return (
    <div className="pointer-events-none absolute inset-0">
      {/* Four-layer background overlay */}
      <div className="absolute inset-0 hero-overlay-top" />
      <div className="absolute inset-0 hero-overlay-warm" />
      <div className="absolute inset-0 hero-overlay-neutral" />
      <div className="absolute inset-0 hero-overlay-bottom" />

      {/* Grain — texture overlay, not live SVG turbulence */}
      <div className="absolute inset-0 hero-grain" />

      {/* Layer 1 — tiny dust, slow drift, very low opacity */}
      {dust.map((p) => (
        <span
          key={`dust-${p.id}`}
          className="absolute rounded-full bg-[#F6E6B4]"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            top: `${p.top}%`,
            opacity: 0.18,
            animation: `dust-drift ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}

      {/* Layer 2 — warm blurred bokeh, few particles, large blur */}
      {bokeh.map((p) => (
        <span
          key={`bokeh-${p.id}`}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            top: `${p.top}%`,
            background:
              'radial-gradient(circle, rgba(240,206,126,0.16) 0%, rgba(240,206,126,0.05) 55%, transparent 75%)',
            filter: 'blur(6px)',
            animation: `breathe ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}

      {/* Layer 3 — occasional sparkle: appears, glows, disappears */}
      {sparkle.map((p) => (
        <span
          key={`sparkle-${p.id}`}
          className="absolute h-[3px] w-[3px] rounded-full bg-white"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            boxShadow: '0 0 6px 1px rgba(255,255,255,0.6)',
            animation: `sparkle 6s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}

      <style>{`
        @keyframes dust-drift {
          0%, 100% { transform: translate(0, 0); opacity: 0.1; }
          50% { transform: translate(6px, -10px); opacity: 0.22; }
        }
        @keyframes breathe {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.08); }
        }
        @keyframes sparkle {
          0%, 88%, 100% { opacity: 0; transform: scale(0.6); }
          92% { opacity: 1; transform: scale(1.3); }
          96% { opacity: 0.4; transform: scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          span { animation: none !important; }
        }
      `}</style>
    </div>
  );
}