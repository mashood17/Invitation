import { SectionWrapper } from '@/components/shared/SectionWrapper';
import { rsvp } from '@/config/weddingData';

export function RSVP() {
  return (
    <SectionWrapper className="bg-cream px-6 py-24 text-center">
      <div className="mx-auto max-w-sm rounded-2xl bg-ivory p-8 shadow-lg">
        <h2 className="section-heading mb-6">Kindly Bless Us With Your Presence</h2>
        <div className="flex flex-col gap-3">
          <a
            href={`https://wa.me/${rsvp.whatsappNumber}?text=${rsvp.whatsappMessage}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-gold px-6 py-3 font-sans text-sm uppercase tracking-widest text-ivory transition hover:bg-gold-dark"
          >
            RSVP on WhatsApp
          </a>
          <a
            href={`tel:${rsvp.callNumber}`}
            className="rounded-full border border-gold px-6 py-3 font-sans text-sm uppercase tracking-widest text-gold-dark transition hover:bg-gold hover:text-ivory"
          >
            Call Us
          </a>
        </div>
      </div>
    </SectionWrapper>
  );
}
