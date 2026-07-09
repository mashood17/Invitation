import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { SectionWrapper } from '@/components/shared/SectionWrapper';
import { event } from '@/config/weddingData';

const luxuryEase = [0.16, 1, 0.3, 1] as const;

export function Venue() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [mapActive, setMapActive] = useState(false);

  return (
    <SectionWrapper className="bg-ivory px-6 py-20 text-center">
      <div ref={ref}>
        <motion.h2
          className="section-heading"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: luxuryEase }}
        >
          Venue
        </motion.h2>

        <motion.div
          className="divider mx-auto mt-3 w-20"
          initial={{ opacity: 0, scaleX: 0.6 }}
          animate={inView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.2, ease: luxuryEase }}
        />

        <motion.div
          className="mx-auto mt-10 max-w-md overflow-hidden rounded-2xl border border-gold/30 shadow-[0_20px_50px_-20px_rgba(43,38,32,0.25)]"
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.35, ease: luxuryEase }}
        >
          <button
            type="button"
            onClick={() => setMapActive(true)}
            className="group relative block h-56 w-full overflow-hidden"
            aria-label="Activate interactive map"
          >
            <iframe
              title="Venue map"
              tabIndex={mapActive ? 0 : -1}
              className="h-full w-full transition-all duration-700"
              style={{
                filter: mapActive ? 'none' : 'grayscale(1) sepia(0.35) contrast(1.05)',
                pointerEvents: mapActive ? 'auto' : 'none',
              }}
              loading="lazy"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                event.venueAddress
              )}&z=15&output=embed`}
            />

            {!mapActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-ink/10 backdrop-blur-[1px] transition group-hover:bg-ink/5">
                <span className="flex items-center gap-2 rounded-full border border-gold/50 bg-ivory/90 px-4 py-2 font-sans text-[10px] uppercase tracking-[0.25em] text-gold-dark shadow-sm">
                  <MapPin size={12} />
                  Tap to Explore
                </span>
              </div>
            )}
          </button>

          <div className="space-y-4 bg-cream p-6">
            <p className="font-display text-xl text-ink">{event.venueName}</p>
            <p className="font-serif text-sm uppercase tracking-widest text-ink/60">
              {event.venueAddress}
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <a
                href={event.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-gold px-5 py-2 font-sans text-xs uppercase tracking-widest text-gold-dark transition hover:bg-gold hover:text-ivory"
              >
                Open Maps
              </a>
              <a
                href={event.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-gradient-to-b from-gold-light to-gold-dark px-5 py-2 font-sans text-xs uppercase tracking-widest text-ivory shadow-sm transition hover:brightness-105"
              >
                Get Directions
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}