import { SectionWrapper } from '@/components/shared/SectionWrapper';
import { timeline } from '@/config/weddingData';

export function Timeline() {
  return (
    <SectionWrapper className="bg-cream px-6 py-24">
      <h2 className="section-heading mb-12">Program</h2>
      <div className="relative mx-auto max-w-xs">
        <div className="absolute left-[5px] top-1 h-full w-px bg-gold/40" />
        <ul className="space-y-10">
          {timeline.map((item) => (
            <li key={item.label} className="relative pl-6">
              <span className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-gold" />
              <p className="font-display text-lg text-gold">{item.label}</p>
              <p className="font-serif text-sm text-ink/70">{item.time}</p>
            </li>
          ))}
        </ul>
      </div>
    </SectionWrapper>
  );
}
