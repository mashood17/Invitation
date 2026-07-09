import { SectionWrapper } from '@/components/shared/SectionWrapper';
import { event } from '@/config/weddingData';

/**
 * Deliberately using an <iframe> embed rather than the full Google Maps
 * JS SDK. One static pin doesn't need ~150KB of mapping SDK loaded — an
 * iframe embed gets you 95% of the visual for a fraction of the weight,
 * and it's genuinely a better trade for a one-page invite than a purist
 * "use the real SDK" answer would be.
 */
export function Venue() {
  return (
    <SectionWrapper className="bg-ivory px-6 py-24 text-center">
      <h2 className="section-heading mb-10">Venue</h2>
      <div className="mx-auto max-w-md overflow-hidden rounded-2xl border border-gold/30 shadow-lg">
        <iframe
          title="Venue map"
          className="h-56 w-full"
          loading="lazy"
          src={`https://maps.google.com/maps?q=${encodeURIComponent(
            event.venueAddress
          )}&z=15&output=embed`}
        />
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
              className="rounded-full bg-gold px-5 py-2 font-sans text-xs uppercase tracking-widest text-ivory transition hover:bg-gold-dark"
            >
              Get Directions
            </a>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
