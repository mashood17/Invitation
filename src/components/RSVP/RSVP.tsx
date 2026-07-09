import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MessageCircle, Phone } from 'lucide-react';
import { SectionWrapper } from '@/components/shared/SectionWrapper';
import { rsvp } from '@/config/weddingData';

const luxuryEase = [0.16, 1, 0.3, 1] as const;

export function RSVP() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <SectionWrapper className="bg-cream px-6 py-20 text-center">
      <div ref={ref} className="mx-auto max-w-sm">
        <motion.div
          className="rounded-2xl bg-ivory p-8 shadow-[0_20px_50px_-20px_rgba(43,38,32,0.25)]"
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: luxuryEase }}
        >
          <motion.h2
            className="section-heading"
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: luxuryEase }}
          >
            Kindly Bless Us With Your Presence
          </motion.h2>

          <motion.p
            className="mt-3 font-serif text-sm italic text-ink/55"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: luxuryEase }}
          >
            We'd love to know you're coming.
          </motion.p>

          <motion.div
            className="mt-7 flex flex-col gap-3"
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6, ease: luxuryEase }}
          >
            <a
              href={`https://wa.me/${rsvp.whatsappNumber}?text=${rsvp.whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-gold-light to-gold-dark px-6 py-3 font-sans text-sm uppercase tracking-widest text-ivory shadow-sm transition hover:brightness-105"
            >
              <MessageCircle size={16} />
              RSVP on WhatsApp
            </a>
            <a
              href={`tel:${rsvp.callNumber}`}
              className="flex items-center justify-center gap-2 rounded-full border border-gold px-6 py-3 font-sans text-sm uppercase tracking-widest text-gold-dark transition hover:bg-gold hover:text-ivory"
            >
              <Phone size={15} />
              Call Us
            </a>
          </motion.div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}