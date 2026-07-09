import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SectionWrapper } from '@/components/shared/SectionWrapper';
import { CountdownCard } from '@/components/Countdown/CountdownCard';
import { event } from '@/config/weddingData';

const luxuryEase = [0.16, 1, 0.3, 1] as const;

function getTimeLeft(targetISO: string) {
  const diff = new Date(targetISO).getTime() - Date.now();
  return {
    diff,
    days: Math.max(0, Math.floor(diff / 86_400_000)),
    hours: Math.max(0, Math.floor((diff / 3_600_000) % 24)),
    minutes: Math.max(0, Math.floor((diff / 60_000) % 60)),
    seconds: Math.max(0, Math.floor((diff / 1000) % 60)),
  };
}

export function Countdown() {
  const [time, setTime] = useState(() => getTimeLeft(event.dateISO));

  useEffect(() => {
    let timeoutId: number;

    const tick = () => {
      setTime(getTimeLeft(event.dateISO));
      const msToNextSecond = 1000 - (Date.now() % 1000);
      timeoutId = window.setTimeout(tick, msToNextSecond);
    };

    tick();
    return () => window.clearTimeout(timeoutId);
  }, []);

  const hasArrived = time.diff <= 0;

  const units = [
    { label: 'Days', value: time.days },
    { label: 'Hours', value: time.hours },
    { label: 'Minutes', value: time.minutes },
    { label: 'Seconds', value: time.seconds },
  ];

  return (
    <SectionWrapper className="relative overflow-hidden bg-cream pt-20 pb-5 text-center">
      <motion.div
        className="pointer-events-none absolute left-1/2 top-10 h-64 w-64 -translate-x-1/2 rounded-full opacity-0"
        style={{ background: 'radial-gradient(circle, rgba(198,161,91,0.14) 0%, transparent 70%)' }}
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 md:px-10 lg:px-14">
        <h2 className="section-heading">Counting Down To Forever</h2>

        <div className="divider mx-auto mt-3 w-20" />

        {hasArrived ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: luxuryEase }}
            className="mt-10 flex flex-col items-center gap-2"
          >
            <p className="font-display text-3xl text-gold-dark">﷽</p>
            <p className="font-script text-2xl text-ink">Today is our special day</p>
          </motion.div>
        ) : (
          <>
            <div className="mx-auto mt-10 grid max-w-md grid-cols-4 gap-4 max-[360px]:gap-2.5">
              {units.map((u) => (
                <CountdownCard key={u.label} value={u.value} label={u.label} />
              ))}
            </div>

            <p className="mt-6 font-serif text-sm italic text-ink/55">
              Until we begin our forever.
            </p>
          </>
        )}
      </div>
    </SectionWrapper>
  );
}