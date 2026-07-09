import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { SectionWrapper } from '@/components/shared/SectionWrapper';
import { WavyDivider } from '@/components/InvitationMessage/WavyDivider';

const luxuryEase = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: luxuryEase } },
};

export function Closing() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <SectionWrapper className="relative overflow-hidden bg-cream px-6 pb-24 pt-1 text-center text-ink">
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-gold/40"
            style={{
              left: `${(i * 43) % 100}%`,
              top: `${(i * 31) % 100}%`,
              animation: `breathe ${4 + (i % 3)}s ease-in-out ${i * 0.3}s infinite`,
            }}
          />
        ))}
      </div>

      <div ref={ref} className="relative z-10 mx-auto flex max-w-sm flex-col items-center gap-6">
        

        <motion.div initial="hidden" animate={inView ? 'show' : 'hidden'} variants={fadeUp}>
          <WavyDivider />
        </motion.div>

        <motion.p
          className="font-display text-2xl leading-relaxed text-ink"
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          variants={fadeUp}
          transition={{ delay: 0.2 }}
        >
          We can't wait to celebrate this beautiful beginning with you.
        </motion.p>

        <motion.p
          className="max-w-xs font-serif text-sm italic text-ink/70"
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          variants={fadeUp}
          transition={{ delay: 0.4 }}
        >
          May Allah bless this union with endless love, peace, mercy, and happiness.
        </motion.p>

        <motion.div
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          variants={fadeUp}
          transition={{ delay: 0.6 }}
        >
          <WavyDivider />
        </motion.div>

        <motion.div
          className="mt-2 flex flex-col items-center gap-1"
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          variants={fadeUp}
          transition={{ delay: 0.8 }}
        >
          <p className="font-script text-3xl text-gold-dark">Best Wishes</p>
          <p className="font-sans text-xs uppercase tracking-[0.25em] text-ink/45">
            MMK Family
          </p>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}