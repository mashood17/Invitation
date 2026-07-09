import { AnimatePresence, motion } from 'framer-motion';
import '@/components/Countdown/countdown.css';

const luxuryEase = [0.16, 1, 0.3, 1] as const;

interface CountdownCardProps {
  value: number;
  label: string;
}

export function CountdownCard({ value, label }: CountdownCardProps) {
  const display = String(value).padStart(2, '0');

  return (
    <div className="countdown-card rounded-xl px-3 py-5 max-[360px]:px-2 max-[360px]:py-4">
      <div className="countdown-card-emboss" />
      <div className="relative h-9 overflow-hidden max-[360px]:h-7">
        <AnimatePresence mode="popLayout">
          <motion.p
            key={display}
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={{ duration: 0.45, ease: luxuryEase }}
            className="absolute inset-x-0 font-display text-3xl font-medium text-ink md:text-4xl max-[360px]:text-2xl"
            >
            {display}
          </motion.p>
        </AnimatePresence>
      </div>
      <p className="mt-2 font-sans text-[9px] uppercase tracking-[0.25em] text-ink/45 max-[360px]:text-[8px] max-[360px]:tracking-[0.18em]">
        {label}
      </p>
    </div>
  );
}