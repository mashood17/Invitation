import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface OpeningSequenceProps {
  play: boolean;
  onComplete: () => void;
  children: React.ReactNode;
}

export function OpeningSequence({ play, onComplete, children }: OpeningSequenceProps) {
  const leftDoor = useRef<HTMLDivElement>(null);
  const rightDoor = useRef<HTMLDivElement>(null);
  const seam = useRef<HTMLDivElement>(null);
  const heroWrap = useRef<HTMLDivElement>(null);
  const curtainWrap = useRef<HTMLDivElement>(null);
  const leftCurtain = useRef<HTMLDivElement>(null);
  const rightCurtain = useRef<HTMLDivElement>(null);
  const idleTl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!play) return;

    const DOOR_DELAY = 0.1;
    const DOOR_DUR = 1.8;
    const DOOR_END = DOOR_DELAY + DOOR_DUR;

    const tl = gsap.timeline({
      defaults: { ease: 'expo.inOut' },
      onComplete: () => {
        // brief pause after everything settles before signalling completion
        gsap.delayedCall(0.2, () => {
          onComplete();
          startIdleDrift();
        });
      },
    });

    // seam highlight — visible while doors are closed, fades as they part
    tl.set(seam.current, { opacity: 0.9 })
      .to(seam.current, { opacity: 0, duration: DOOR_DUR * 0.6, ease: 'sine.out' }, DOOR_DELAY);

    // doors open with a heavier, hesitant start
    tl.to(leftDoor.current, { xPercent: -100, duration: DOOR_DUR }, DOOR_DELAY)
      .to(rightDoor.current, { xPercent: 100, duration: DOOR_DUR }, DOOR_DELAY)
      // shadow softens as they move away
      .to(
        [leftDoor.current, rightDoor.current],
        { boxShadow: '0 0 0 rgba(0,0,0,0)', duration: DOOR_DUR, ease: 'sine.out' },
        DOOR_DELAY
      )
      // hero gently brightens/reveals underneath
      .to(
        heroWrap.current,
        { opacity: 1, filter: 'brightness(1)', duration: DOOR_DUR, ease: 'sine.out' },
        DOOR_DELAY
      );

    // tiny overshoot + settle once each door reaches its edge
    tl.to(leftDoor.current, { x: -2, duration: 0.12, ease: 'power1.out' }, DOOR_END)
      .to(leftDoor.current, { x: 0, duration: 0.22, ease: 'power1.inOut' }, DOOR_END + 0.12)
      .to(rightDoor.current, { x: 2, duration: 0.12, ease: 'power1.out' }, DOOR_END)
      .to(rightDoor.current, { x: 0, duration: 0.22, ease: 'power1.inOut' }, DOOR_END + 0.12);

    // curtains begin emerging once doors are ~75% open, overlapping the finish
    const curtainStart = DOOR_DELAY + DOOR_DUR * 0.75;
    tl.to(curtainWrap.current, { opacity: 1, duration: 0.7, ease: 'sine.out' }, curtainStart);

    // curtains hold still, then one soft, restrained wave, then rest
    const waveStart = curtainStart + 0.7 + 0.8; // settle time after fade-in
    tl.to(
      [leftCurtain.current, rightCurtain.current],
      { x: 3, rotate: 1, duration: 1.1, ease: 'sine.inOut' },
      waveStart
    ).to(
      [leftCurtain.current, rightCurtain.current],
      { x: 0, rotate: 0, duration: 1.3, ease: 'sine.inOut' },
      waveStart + 1.1
    );

    function startIdleDrift() {
      idleTl.current = gsap.timeline({ repeat: -1, yoyo: true });
      idleTl.current.to([leftCurtain.current, rightCurtain.current], {
        x: 1.5,
        rotate: 0.4,
        duration: 12,
        ease: 'sine.inOut',
      });
    }

    return () => {
      tl.kill();
      idleTl.current?.kill();
    };
  }, [play, onComplete]);

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-ivory">
      <div ref={heroWrap} className="absolute inset-0 opacity-[0.96]" style={{ filter: 'brightness(0.96)' }}>
        {children}
      </div>

      {/* center seam highlight */}
      <div
        ref={seam}
        className="pointer-events-none absolute inset-y-0 left-1/2 z-20 w-px -translate-x-1/2 opacity-0"
        style={{
          background:
            'linear-gradient(to bottom, transparent, rgba(214,188,138,0.6) 20%, rgba(214,188,138,0.6) 80%, transparent)',
          boxShadow: '0 0 12px 2px rgba(214,188,138,0.35)',
        }}
      />

      <div
        ref={leftDoor}
        className="absolute inset-y-0 left-0 z-10 w-1/2 bg-ivory"
        style={{
          backgroundImage:
            'linear-gradient(to bottom, rgba(0,0,0,0.02), transparent 30%, transparent 70%, rgba(0,0,0,0.03))',
          boxShadow: 'inset -6px 0 14px -6px rgba(0,0,0,0.18), inset 1px 0 0 rgba(255,255,255,0.5)',
        }}
      />
      <div
        ref={rightDoor}
        className="absolute inset-y-0 right-0 z-10 w-1/2 bg-ivory"
        style={{
          backgroundImage:
            'linear-gradient(to bottom, rgba(0,0,0,0.02), transparent 30%, transparent 70%, rgba(0,0,0,0.03))',
          boxShadow: 'inset 6px 0 14px -6px rgba(0,0,0,0.18), inset -1px 0 0 rgba(255,255,255,0.5)',
        }}
      />

      <div ref={curtainWrap} className="pointer-events-none absolute inset-0 z-30 opacity-0">
        <div
          ref={leftCurtain}
          className="absolute inset-y-0 left-0 w-[22%] origin-left bg-cover bg-right bg-no-repeat will-change-transform"
          style={{
            backgroundImage: "url('/images/curtain-left.png')",
            filter: 'drop-shadow(3px 0 10px rgba(0,0,0,0.14))',
          }}
        />
        <div
          ref={rightCurtain}
          className="absolute inset-y-0 right-0 w-[22%] origin-right bg-cover bg-left bg-no-repeat will-change-transform"
          style={{
            backgroundImage: "url('/images/curtain-right.png')",
            filter: 'drop-shadow(-3px 0 10px rgba(0,0,0,0.14))',
          }}
        />
      </div>
    </div>
  );
}