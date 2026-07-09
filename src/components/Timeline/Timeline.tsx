import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { SectionWrapper } from '@/components/shared/SectionWrapper';
import { timeline } from '@/config/weddingData';
import '@/components/Timeline/timeline.css';

const luxuryEase = [0.16, 1, 0.3, 1] as const;

export function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: '-80px' });

  return (
    <SectionWrapper className="bg-cream px-6 pt-10 pb-24 text-center">
      <h2 className="section-heading">Program</h2>

      <div className="divider mx-auto mt-3 w-20" />

      <p className="mx-auto mt-3 max-w-xs font-serif text-sm italic text-ink/55">
        A day thoughtfully prepared to celebrate our union.
      </p>

      <div ref={containerRef} className="relative mx-auto mt-14 w-full max-w-lg text-left">
        <div className="absolute bottom-3 left-3 top-3 w-px bg-gradient-to-b from-transparent via-gold/45 to-transparent" />

        <ul className="space-y-12">
          {timeline.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.li
                key={item.label}
                className="timeline-item relative pl-10"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.35, ease: luxuryEase }}
              >
                <span
                  className={`timeline-dot-ring absolute left-0 top-1 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full ${
                    item.emphasis ? 'bg-gold text-ivory' : 'bg-ivory text-gold-dark'
                  }`}
                >
                  <Icon />
                </span>

                {item.emphasis && (
                  <div className="mb-2 h-px w-10 bg-gold/50" />
                )}

                <p
                  className={`timeline-title font-display transition-transform duration-300 ${
                    item.emphasis ? 'text-xl text-gold-dark' : 'text-lg text-ink'
                  }`}
                >
                  {item.label}
                </p>
                <p className="timeline-time mt-1.5 font-sans text-xs uppercase tracking-[0.15em] text-ink/50 opacity-70 transition-opacity duration-300">
                  {item.time}
                </p>

                {item.emphasis && (
                  <div className="mt-2 h-px w-10 bg-gold/50" />
                )}
              </motion.li>
            );
          })}
        </ul>
      </div>
    </SectionWrapper>
  );
}