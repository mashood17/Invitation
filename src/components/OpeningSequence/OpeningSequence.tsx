import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface OpeningSequenceProps {
  play: boolean;
  onComplete: () => void;
  children: React.ReactNode;
}

export function OpeningSequence({ play, onComplete, children }: OpeningSequenceProps) {
  const leftDoor = useRef<HTMLDivElement>(null);
  const rightDoor = useRef<HTMLDivElement>(null);
  const curtainWrap = useRef<HTMLDivElement>(null);
  const [showCurtains, setShowCurtains] = useState(false);

  useEffect(() => {
    if (!play) return;

    const tl = gsap.timeline({
      defaults: { ease: 'expo.inOut' },
      onComplete: () => {
        setShowCurtains(true);
        onComplete();
      },
    });

    tl.to(leftDoor.current, { xPercent: -100, duration: 1.4 }, 0.1)
      .to(rightDoor.current, { xPercent: 100, duration: 1.4 }, 0.1)
      .to(curtainWrap.current, { opacity: 1, duration: 0.8 }, 0.9);

    return () => {
      tl.kill();
    };
  }, [play, onComplete]);

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-ivory">
      <div className="absolute inset-0">{children}</div>

      <div ref={leftDoor} className="absolute inset-y-0 left-0 w-1/2 bg-ivory" />
      <div ref={rightDoor} className="absolute inset-y-0 right-0 w-1/2 bg-ivory" />

      <div ref={curtainWrap} className="pointer-events-none absolute inset-0 opacity-0">
        <div
          className={`absolute inset-y-0 left-0 w-[18%] origin-top bg-gradient-to-r from-gold-light/40 to-transparent ${
            showCurtains ? 'animate-curtainWave' : ''
          }`}
        />
        <div
          className={`absolute inset-y-0 right-0 w-[18%] origin-top bg-gradient-to-l from-gold-light/40 to-transparent ${
            showCurtains ? 'animate-curtainWave' : ''
          }`}
          style={{ animationDelay: '0.6s' }}
        />
      </div>
    </div>
  );
}