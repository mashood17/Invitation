import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface OpeningSequenceProps {
  play: boolean;
  onComplete: () => void;
  children: React.ReactNode;
  /** Optional <audio> element ref if you want the score to fade in with the doors (see #10) */
  audioRef?: React.RefObject<HTMLAudioElement>;
}

export function OpeningSequence({ play, onComplete, children, audioRef }: OpeningSequenceProps) {
  const leftDoor = useRef<HTMLDivElement>(null);
  const rightDoor = useRef<HTMLDivElement>(null);
  const leftDoorShadow = useRef<HTMLDivElement>(null);
  const rightDoorShadow = useRef<HTMLDivElement>(null);
  const seamLight = useRef<HTMLDivElement>(null);
  const heroWrap = useRef<HTMLDivElement>(null);
  const curtainWrap = useRef<HTMLDivElement>(null);
  const [showCurtains, setShowCurtains] = useState(false);

  useEffect(() => {
    if (!play) return;

    const tl = gsap.timeline({
      onComplete: () => {
        // #9 — small breathing room before we tell the parent we're done,
        // instead of firing the instant the last tween resolves.
        gsap.delayedCall(0.2, onComplete);
      },
    });

    // ---- #14 / #7 — seam feels important before anything moves, then the
    // sliver of light between the doors grows as they separate ----
    tl.set(seamLight.current, { opacity: 1 })
      .to(seamLight.current, { opacity: 0, duration: 1.6, ease: 'power1.in' }, 0.1);

    // ---- #8 — Hero gradually brightens/reveals instead of sitting fully
    // visible behind the doors the whole time ----
    tl.fromTo(
      heroWrap.current,
      { opacity: 0.96, filter: 'brightness(0.96)' },
      { opacity: 1, filter: 'brightness(1)', duration: 1.7, ease: 'sine.inOut' },
      0.15
    );

    // ---- #1 — hesitate, begin slowly, gain momentum, ease off. The 0.1s
    // offset is the "hesitation", power4.inOut gives the slow→fast→slow
    // physical feel without touching the overall shape of the motion ----
    tl.to(leftDoor.current, { xPercent: -100, duration: 1.8, ease: 'power4.inOut' }, 0.1)
      .to(rightDoor.current, { xPercent: 100, duration: 1.8, ease: 'power4.inOut' }, 0.1);

    // ---- #11 / #12 — shadow softens and fades as the doors move away from
    // the viewer, rather than sitting there as a flat static drop-shadow ----
    tl.to([leftDoorShadow.current, rightDoorShadow.current], {
      opacity: 0,
      duration: 1.8,
      ease: 'power2.in',
    }, 0.1);

    // ---- #4 — tiny overshoot then settle, so the stop reads as physical
    // weight rather than an animation just hitting its end value ----
    tl.to(leftDoor.current, { xPercent: -100, duration: 0.12, ease: 'power1.out' }, 1.9)
      .to(rightDoor.current, { xPercent: 100, duration: 0.12, ease: 'power1.out' }, 1.9)
      .to(leftDoor.current, { xPercent: -100, duration: 0.18, ease: 'power2.out' }, 2.02)
      .to(rightDoor.current, { xPercent: 100, duration: 0.18, ease: 'power2.out' }, 2.02);

    // ---- #2 — curtains start emerging while the doors are still ~72%
    // open (0.1 + 1.8*0.72), so the two beats overlap instead of chaining ----
    const curtainStart = 0.1 + 1.8 * 0.72;
    tl.call(() => setShowCurtains(true), undefined, curtainStart);
    tl.to(curtainWrap.current, { opacity: 1, duration: 0.9, ease: 'sine.out' }, curtainStart);

    // ---- #10 — audio (if provided) ramps in over ~2.5s rather than
    // snapping to full volume the moment playback starts ----
    if (audioRef?.current) {
      gsap.fromTo(
        audioRef.current,
        { volume: 0 },
        { volume: 1, duration: 2.5, ease: 'sine.in', delay: 0.1 }
      );
    }

    return () => {
      tl.kill();
    };
  }, [play, onComplete, audioRef]);

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-ivory">
      <div ref={heroWrap} className="absolute inset-0">
        {children}
      </div>

      {/* #14 / #7 — seam highlight, the focal point before separation */}
      <div
        ref={seamLight}
        className="pointer-events-none absolute inset-y-0 left-1/2 z-20 w-px -translate-x-1/2 opacity-0"
        style={{
          boxShadow: '0 0 24px 2px rgba(214, 188, 128, 0.55)',
          background:
            'linear-gradient(to bottom, rgba(214,188,128,0) 0%, rgba(214,188,128,0.9) 50%, rgba(214,188,128,0) 100%)',
        }}
      />

      {/* #3 — doors get texture/gradient/inner shadow instead of flat bg-ivory */}
      <div
        ref={leftDoor}
        className="door-panel absolute inset-y-0 left-0 w-1/2"
        style={{
          background:
            'linear-gradient(to right, #f7f3ea 0%, #f3ede0 55%, #ece3d0 100%)',
          boxShadow: 'inset -14px 0 24px -18px rgba(60,45,20,0.35), inset 1px 0 0 rgba(255,255,255,0.6)',
          borderRight: '1px solid rgba(214, 188, 128, 0.25)',
        }}
      >
        <div
          ref={leftDoorShadow}
          className="pointer-events-none absolute inset-y-0 right-0 w-6 -mr-6"
          style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.16), transparent)' }}
        />
      </div>
      <div
        ref={rightDoor}
        className="door-panel absolute inset-y-0 right-0 w-1/2"
        style={{
          background:
            'linear-gradient(to left, #f7f3ea 0%, #f3ede0 55%, #ece3d0 100%)',
          boxShadow: 'inset 14px 0 24px -18px rgba(60,45,20,0.35), inset -1px 0 0 rgba(255,255,255,0.6)',
          borderLeft: '1px solid rgba(214, 188, 128, 0.25)',
        }}
      >
        <div
          ref={rightDoorShadow}
          className="pointer-events-none absolute inset-y-0 left-0 w-6 -ml-6"
          style={{ background: 'linear-gradient(to left, rgba(0,0,0,0.16), transparent)' }}
        />
      </div>

      <div ref={curtainWrap} className="pointer-events-none absolute inset-0 opacity-0">
        <div
          className={`absolute inset-y-0 left-0 w-[22%] origin-left bg-cover bg-right bg-no-repeat will-change-transform ${
            showCurtains ? 'animate-curtainSettle' : ''
          }`}
          style={{
            backgroundImage: "url('/images/curtain-left.png')",
            // #12 — much softer drop-shadow so curtains blend into the Hero
            filter: 'drop-shadow(3px 0 10px rgba(0,0,0,0.14))',
          }}
        />
        <div
          className={`absolute inset-y-0 right-0 w-[22%] origin-right bg-cover bg-left bg-no-repeat will-change-transform ${
            showCurtains ? 'animate-curtainSettle' : ''
          }`}
          style={{
            backgroundImage: "url('/images/curtain-right.png')",
            filter: 'drop-shadow(-3px 0 10px rgba(0,0,0,0.14))',
            animationDelay: '0.15s',
          }}
        />
      </div>

      {/*
        #5 / #6 / #13 — curtain motion, restrained.
        Sequence per curtain: fade in (handled above) → hold still ~0.8s →
        one gentle 2–4px / 1–2° wave → settle → a barely-there 12s idle
        drift instead of looping forever. Move this block to your global
        CSS / tailwind.config if you don't want it inline.
      */}
      <style jsx global>{`
        @keyframes curtainSettle {
          0%, 21% {
            transform: translateX(0) rotate(0deg);
          }
          27% {
            transform: translateX(3px) rotate(1.4deg);
          }
          33% {
            transform: translateX(-2px) rotate(-0.8deg);
          }
          40%, 100% {
            transform: translateX(0) rotate(0deg);
          }
        }
        @keyframes curtainIdle {
          0%, 100% {
            transform: translateX(0) rotate(0deg);
          }
          50% {
            transform: translateX(1.5px) rotate(0.4deg);
          }
        }
        .animate-curtainSettle {
          animation:
            curtainSettle 3.8s cubic-bezier(0.36, 0.07, 0.19, 0.97) 1 forwards,
            curtainIdle 13s ease-in-out 3.8s infinite alternate;
        }
        .door-panel {
          transition: box-shadow 0.3s ease;
        }
      `}</style>
    </div>
  );
}