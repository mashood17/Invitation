import { useEffect, useState } from 'react';
import { Loader } from '@/components/Loader/Loader';
import { TapToOpen } from '@/components/TapToOpen/TapToOpen';
import { OpeningSequence } from '@/components/OpeningSequence/OpeningSequence';
import { Hero } from '@/components/Hero/Hero';
import { InvitationMessage } from '@/components/InvitationMessage/InvitationMessage';
import { ScratchReveal } from '@/components/ScratchReveal/ScratchReveal';
import { Countdown } from '@/components/Countdown/Countdown';
import { Timeline } from '@/components/Timeline/Timeline';
import { Venue } from '@/components/Venue/Venue';
import { RSVP } from '@/components/RSVP/RSVP';
import { Closing } from '@/components/Closing/Closing';
import { MusicControl } from '@/components/shared/MusicControl';
import { useAudio } from '@/hooks/useAudio';
import { audio } from '@/config/weddingData';

type Stage = 'loading' | 'sealed' | 'opening' | 'revealed';

function App() {
  const [stage, setStage] = useState<Stage>('loading');
  const { unlock, toggleMute, setVolume, isMuted, volume } = useAudio(audio.src);

  useEffect(() => {
    const t = setTimeout(() => setStage('sealed'), 900);
    return () => clearTimeout(t);
  }, []);

  const handleSealTap = () => {
    unlock();
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
        <>
          <MusicControl
            isMuted={isMuted}
            volume={volume}
            onToggleMute={toggleMute}
            onVolumeChange={setVolume}
          />
          <main>
            <InvitationMessage />
            <ScratchReveal />
            <Countdown />
            <Timeline />
            <Venue />
            <RSVP />
            <Closing />
          </main>
        </>
      )}
    </>
  );
}

export default App;