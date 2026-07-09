import { useEffect, useState } from 'react';
import { Loader } from '@/components/Loader/Loader';
import { TapToOpen } from '@/components/TapToOpen/TapToOpen';
import { OpeningSequence } from '@/components/OpeningSequence/OpeningSequence';
import { Hero } from '@/components/Hero/Hero';
import { InvitationMessage } from '@/components/InvitationMessage/InvitationMessage';
import { ScratchReveal } from '@/components/ScratchReveal/ScratchReveal';
import { Gallery } from '@/components/Gallery/Gallery';
import { Countdown } from '@/components/Countdown/Countdown';
import { Timeline } from '@/components/Timeline/Timeline';
import { Venue } from '@/components/Venue/Venue';
import { RSVP } from '@/components/RSVP/RSVP';
import { Closing } from '@/components/Closing/Closing';
import { useAudio } from '@/hooks/useAudio';
import { audio } from '@/config/weddingData';

// App state machine — this is the whole "story" of the page in one type.
// Every screen the guest sees maps to exactly one of these states.
type Stage = 'loading' | 'sealed' | 'opening' | 'revealed';

function App() {
  const [stage, setStage] = useState<Stage>('loading');
  const { unlock } = useAudio(audio.src, audio.defaultVolume);

  useEffect(() => {
    const t = setTimeout(() => setStage('sealed'), 900); // loader is capped under 1s per brief
    return () => clearTimeout(t);
  }, []);

  const handleSealTap = () => {
    unlock(); // must run inside this synchronous click handler — see useAudio.ts
    setStage('opening');
  };

  return (
    <>
      <Loader isVisible={stage === 'loading'} />

      {stage === 'sealed' && <TapToOpen onOpen={handleSealTap} />}

      {(stage === 'opening' || stage === 'revealed') && (
        <OpeningSequence play={stage === 'opening'} onComplete={() => setStage('revealed')}>
          <Hero />
        </OpeningSequence>
      )}

      {stage === 'revealed' && (
        <main>
          <InvitationMessage />
          <ScratchReveal />
          <Gallery />
          <Countdown />
          <Timeline />
          <Venue />
          <RSVP />
          <Closing />
        </main>
      )}
    </>
  );
}

export default App;
