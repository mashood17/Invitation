import { useEffect, useState } from 'react';
import { SectionWrapper } from '@/components/shared/SectionWrapper';
import { event } from '@/config/weddingData';

function getTimeLeft(targetISO: string) {
  const diff = Math.max(0, new Date(targetISO).getTime() - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

/**
 * "react-countdown" is one more dependency for something 20 lines of
 * useEffect does perfectly well, with full control over the flip
 * animation. Fewer deps = smaller bundle = the Lighthouse score you
 * actually want. Flip-card animation left as a follow-up (currently a
 * plain number swap) — that's a nice CSS-only 3D transform we can add
 * in the next pass.
 */
export function Countdown() {
  const [time, setTime] = useState(() => getTimeLeft(event.dateISO));

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft(event.dateISO)), 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { label: 'Days', value: time.days },
    { label: 'Hours', value: time.hours },
    { label: 'Minutes', value: time.minutes },
    { label: 'Seconds', value: time.seconds },
  ];

  return (
    <SectionWrapper className="bg-cream px-6 py-24 text-center">
      <h2 className="section-heading mb-10">Counting Down To Forever</h2>
      <div className="mx-auto grid max-w-md grid-cols-4 gap-3">
        {units.map((u) => (
          <div
            key={u.label}
            className="rounded-lg border border-gold/40 bg-ivory/60 py-4 backdrop-blur-sm"
          >
            <p className="font-display text-2xl text-ink">{String(u.value).padStart(2, '0')}</p>
            <p className="mt-1 font-sans text-[10px] uppercase tracking-widest text-ink/50">
              {u.label}
            </p>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
