import { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';

import { SectionWrapper } from '@/components/shared/SectionWrapper';
import { InvitationAtmosphere } from './InvitationAtmosphere';
import './invitation.css';

const luxuryEase = [0.16, 1, 0.3, 1] as const;

const paperVariant: Variants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1.4, ease: luxuryEase },
  },
};

const ornamentVariant: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, delay: 0.5, ease: luxuryEase },
  },
};

const lineVariant: Variants = {
  hidden: { opacity: 0, y: 10, filter: 'blur(3px)' },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, delay, ease: luxuryEase },
  }),
};

const lightBloomVariant: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.8, ease: luxuryEase } },
};

/** Small corner flourish — quiet Islamic geometric motif, not a heavy border. */
function CornerFlourish({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={`h-8 w-8 text-[#C49A54]/60 ${className}`} fill="none">
      <path d="M2 20c0-10 8-18 18-18" stroke="currentColor" strokeWidth="0.75" />
      <path d="M2 12c0-5.5 4.5-10 10-10" stroke="currentColor" strokeWidth="0.6" opacity="0.6" />
      <circle cx="2" cy="20" r="1.4" fill="currentColor" />
    </svg>
  );
}

/** Slim crescent motif that sits above the quote as a quiet Islamic signature. */
function CrescentMotif() {
  return (
    <svg viewBox="0 0 32 32" className="h-5 w-5 text-[#C49A54]/70" fill="none">
      <path
        d="M20 4a12 12 0 1 0 0 24 9.5 9.5 0 0 1 0-24z"
        fill="currentColor"
        opacity="0.75"
      />
    </svg>
  );
}

const QUOTE_LINES = [
  'We are honoured to invite you and your beloved family',
  'to celebrate the blessed union of our hearts.',
  'Your presence, prayers, and blessings will make this joyous occasion',
  'even more meaningful as we begin our beautiful journey together',
  'under the mercy of Allah.',
];

export function InvitationMessage() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <SectionWrapper className="relative overflow-hidden bg-ivory px-6 pt-10 pb-10">
      {/* Seam bridge — dissolves the Hero's darkness into ivory instead of cutting to it */}
      <div className="pointer-events-none absolute inset-x-0 -top-1 h-40" aria-hidden="true">
        <div className="invitation-bridge h-full w-full" />
      </div>

      {/* Continued atmosphere: same particles / light / grain language as the Hero */}
      <motion.div variants={lightBloomVariant} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
        <InvitationAtmosphere />
      </motion.div>

      <div ref={ref} className="relative z-10 mx-auto flex max-w-2xl flex-col items-center">
        <motion.div
          className="invitation-paper invitation-paper-glow group relative w-full max-w-xl px-10 py-14 transition-shadow duration-500 md:px-16 md:py-20 lg:hover:-translate-y-[2px] lg:hover:shadow-[0_30px_70px_-18px_rgba(60,44,24,0.32)]"
          variants={paperVariant}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <div className="invitation-paper-fiber" aria-hidden="true" />
          <div className="invitation-paper-emboss" aria-hidden="true" />

          <CornerFlourish className="absolute left-4 top-4" />
          <CornerFlourish className="absolute right-4 top-4 -scale-x-100" />
          <CornerFlourish className="absolute bottom-4 left-4 -scale-y-100" />
          <CornerFlourish className="absolute bottom-4 right-4 -rotate-180" />

          <div className="relative flex flex-col items-center gap-6 text-center">
            <motion.div variants={ornamentVariant} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
              <CrescentMotif />
            </motion.div>

            <motion.div
              className="invitation-divider h-px w-16"
              variants={ornamentVariant}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
            />

            <p className="invitation-quote-line max-w-md text-[1.35rem] italic leading-[2.1] tracking-[0.01em] text-ink/85 md:text-[1.5rem]">
              {QUOTE_LINES.map((line, i) => (
                <motion.span
                  key={i}
                  className="block"
                  variants={lineVariant}
                  initial="hidden"
                  animate={inView ? 'visible' : 'hidden'}
                  custom={0.9 + i * 0.18}
                >
                  {line}
                </motion.span>
              ))}
            </p>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}