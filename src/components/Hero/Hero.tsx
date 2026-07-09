import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { couple } from '@/config/weddingData';

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.18, delayChildren: 1.4 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

export function Hero() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-7 overflow-hidden px-6 text-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero-balcony.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/65 via-ink/30 to-ink/65" />

      <motion.div
        className="relative z-10 flex flex-col items-center gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.p variants={fadeUp} className="font-display text-4xl text-gold-light drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
          ﷽
        </motion.p>

        <motion.p variants={fadeUp} className="max-w-xs font-serif text-base italic text-ivory drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
          In the Name of Allah, The Most Gracious, The Most Merciful
        </motion.p>

        <motion.div variants={fadeUp} className="divider">
          <Heart size={13} className="fill-gold-light text-gold-light drop-shadow" />
        </motion.div>

        <motion.p variants={fadeUp} className="max-w-sm font-serif text-base italic text-ivory/95 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
          We are honoured to welcome you to the wedding ceremony of
        </motion.p>

        <motion.div variants={fadeUp} className="flex flex-col items-center gap-2">
          <h1 className="font-display text-5xl italic leading-tight text-ivory drop-shadow-[0_3px_10px_rgba(0,0,0,0.75)] md:text-6xl">
            {couple.brideName}
          </h1>
          <p className="font-sans text-xs font-medium uppercase tracking-[0.25em] text-gold-light drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
            {couple.brideParents}
          </p>
        </motion.div>

        <motion.span variants={fadeUp} className="font-script text-4xl text-gold-light drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
          &amp;
        </motion.span>

        <motion.div variants={fadeUp} className="flex flex-col items-center gap-2">
          <h1 className="font-display text-5xl italic leading-tight text-ivory drop-shadow-[0_3px_10px_rgba(0,0,0,0.75)] md:text-6xl">
            {couple.groomName}
          </h1>
          <p className="font-sans text-xs font-medium uppercase tracking-[0.25em] text-gold-light drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
            {couple.groomParents}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}