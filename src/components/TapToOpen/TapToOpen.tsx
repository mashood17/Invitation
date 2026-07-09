import { motion } from 'framer-motion';
import { couple } from '@/config/weddingData';

interface TapToOpenProps {
  onOpen: () => void;
}

export function TapToOpen({ onOpen }: TapToOpenProps) {
  const handleTap = () => {
    if (navigator.vibrate) navigator.vibrate(15);
    onOpen();
  };

  return (
    <div className="relative flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-ivory">
      <div className="pointer-events-none absolute inset-0 flex justify-center">
        <div className="h-full w-px bg-gold/30" />
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(circle_at_50%_45%,rgba(198,161,91,0.12),transparent_60%)]" />

      <motion.button
        type="button"
        onClick={handleTap}
        aria-label="Tap to open the invitation"
        className="group relative flex h-40 w-40 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        whileTap={{ scale: 0.92 }}
      >
        <span className="absolute inset-0 rounded-full border border-gold/60" />
        <span
          className="absolute inset-2 rounded-full"
          style={{
            background:
              'radial-gradient(circle at 35% 30%, #F3E6C8 0%, #D9B876 45%, #B8934F 100%)',
            boxShadow:
              'inset 0 2px 6px rgba(255,255,255,0.5), inset 0 -6px 14px rgba(120,90,40,0.25), 0 8px 24px rgba(160,120,60,0.25)',
          }}
        />
        <motion.span
          className="absolute inset-2 rounded-full opacity-0 group-hover:opacity-100"
          style={{
            background:
              'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)',
          }}
          animate={{ backgroundPosition: ['0% 0%', '200% 0%'] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
        />

        <span className="relative z-10 flex flex-col items-center gap-1">
          <span className="font-display text-2xl text-ink">{couple.initials}</span>
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-ink/70">
            Tap to Open
          </span>
        </span>
      </motion.button>
    </div>
  );
}