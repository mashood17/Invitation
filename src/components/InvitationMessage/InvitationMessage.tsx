import { SectionWrapper } from '@/components/shared/SectionWrapper';

export function InvitationMessage() {
  return (
    <SectionWrapper className="flex justify-center bg-ivory px-6 py-24">
      <div className="max-w-md rounded-2xl bg-cream p-8 text-center shadow-[0_20px_60px_-15px_rgba(43,38,32,0.15)]">
        <p className="font-serif text-lg italic leading-relaxed text-ink/90">
          "We are honoured to invite you and your beloved family to celebrate the blessed
          union of our hearts. Your presence, prayers, and blessings will make this joyous
          occasion even more meaningful as we begin our beautiful journey together under
          the mercy of Allah."
        </p>
      </div>
    </SectionWrapper>
  );
}
