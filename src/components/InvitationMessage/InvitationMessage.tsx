import { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { SectionWrapper } from '@/components/shared/SectionWrapper';
import { WavyDivider } from './WavyDivider';

const luxuryEase = [0.16, 1, 0.3, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: luxuryEase } },
};

const dividerVariant: Variants = {
  hidden: { opacity: 0, scaleX: 0.6 },
  visible: { opacity: 1, scaleX: 1, transition: { duration: 1, ease: luxuryEase } },
};

export function InvitationMessage() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <SectionWrapper className="relative bg-ivory px-6 py-16">
      <div
        ref={ref}
        className="mx-auto flex max-w-md flex-col items-center gap-8 text-center"
      >
        <motion.div variants={dividerVariant} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          <WavyDivider />
        </motion.div>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          transition={{ delay: 0.3 }}
          className="font-serif text-lg italic leading-loose text-ink/85"
        >
          We are honoured to invite you and your beloved family to celebrate the blessed
          union of our hearts. Your presence, prayers, and blessings will make this
          joyous occasion even more meaningful as we begin our beautiful journey
          together under the mercy of Allah.
        </motion.p>

        <motion.div
          variants={dividerVariant}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          transition={{ delay: 0.6 }}
        >
          <WavyDivider />
        </motion.div>

       
      </div>
    </SectionWrapper>
  );
}