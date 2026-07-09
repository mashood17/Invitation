import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, type Variants } from 'framer-motion';
import { PageCelebration } from '@/components/shared/PageCelebration';
import { SectionWrapper } from '@/components/shared/SectionWrapper';
import { event } from '@/config/weddingData';
import '@/components/InvitationMessage/invitation.css';

const luxuryEase = [0.16, 1, 0.3, 1] as const;

const REVEAL_THRESHOLD = 0.32;
const SCRATCH_RADIUS = 30;
const SAMPLE_STRIDE = 16;
const DISSOLVE_DURATION_MS = 900;

type Phase = 'idle' | 'scratching' | 'dissolving' | 'revealed';

/* ----------------------------------------------------------------------- */
/* useScratchCanvas                                                         */
/* ----------------------------------------------------------------------- */

function useScratchCanvas(active: boolean, onThreshold: () => void) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const drawing = useRef(false);
  const rafPending = useRef(false);
  const thresholdFired = useRef(false);

  const paintFoil = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    if (w === 0 || h === 0) return;
    ctx.clearRect(0, 0, w, h);

    const metal = ctx.createLinearGradient(0, 0, w, h);
    metal.addColorStop(0, '#EFDCA8');
    metal.addColorStop(0.3, '#DCB96C');
    metal.addColorStop(0.6, '#C6A15B');
    metal.addColorStop(1, '#9C7B3E');
    ctx.fillStyle = metal;
    ctx.fillRect(0, 0, w, h);

    // Faint brushed grain — quiet, not a repeating pattern.
    ctx.save();
    ctx.globalAlpha = 0.05;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 0.6;
    for (let i = 0; i < w + h; i += 4) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i - h, h);
      ctx.stroke();
    }
    ctx.restore();

    // Soft inner sheen, like light catching pressed foil.
    const sheen = ctx.createRadialGradient(w * 0.28, h * 0.22, 0, w * 0.28, h * 0.22, w * 0.65);
    sheen.addColorStop(0, 'rgba(255,250,230,0.25)');
    sheen.addColorStop(1, 'rgba(255,250,230,0)');
    ctx.fillStyle = sheen;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = 'rgba(255,252,242,0.92)';
    ctx.font = '600 13px "Poppins", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✦  Scratch to Reveal  ✦', w / 2, h / 2);
  }, []);

  // ResizeObserver replaces a single mount-time getBoundingClientRect() read,
  // which could fire before layout (fonts, motion wrappers) had settled and
  // leave the canvas painted at 0×0 — i.e. permanently invisible.
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const paint = (width: number, height: number) => {
      if (width === 0 || height === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paintFoil(ctx, width, height);
    };

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      paint(width, height);
    });
    observer.observe(container);

    requestAnimationFrame(() => {
    const rect = container.getBoundingClientRect();
    paint(rect.width, rect.height);
});

    return () => observer.disconnect();
  }, [paintFoil]);

  const measureProgress = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || thresholdFired.current) return;

    const { width, height } = canvas;
    if (width === 0 || height === 0) return;
    const data = ctx.getImageData(0, 0, width, height).data;
    let cleared = 0;
    let total = 0;
    const stride = SAMPLE_STRIDE * 4;
    for (let i = 3; i < data.length; i += stride) {
      total++;
      if (data[i] === 0) cleared++;
    }

    if (total > 0 && cleared / total >= REVEAL_THRESHOLD) {
      thresholdFired.current = true;
      onThreshold();
    }
  }, [onThreshold]);

  const scheduleMeasure = useCallback(() => {
    if (rafPending.current || thresholdFired.current) return;
    rafPending.current = true;
    requestAnimationFrame(() => {
      rafPending.current = false;
      measureProgress();
    });
  }, [measureProgress]);

  const scratchTo = useCallback((x: number, y: number) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.globalCompositeOperation = 'destination-out';

    const prev = lastPoint.current;
    if (prev) {
      const dist = Math.hypot(x - prev.x, y - prev.y);
      const steps = Math.max(1, Math.ceil(dist / (SCRATCH_RADIUS * 0.35)));
      for (let i = 1; i <= steps; i++) {
        const ix = prev.x + ((x - prev.x) * i) / steps;
        const iy = prev.y + ((y - prev.y) * i) / steps;
        ctx.beginPath();
        ctx.arc(ix, iy, SCRATCH_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      ctx.beginPath();
      ctx.arc(x, y, SCRATCH_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }
    lastPoint.current = { x, y };
  }, []);

  const getPos = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!active) return;
      drawing.current = true;
      const { x, y } = getPos(e);
      scratchTo(x, y);
      scheduleMeasure();
    },
    [active, getPos, scratchTo, scheduleMeasure],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!active || !drawing.current) return;
      const { x, y } = getPos(e);
      scratchTo(x, y);
      scheduleMeasure();
    },
    [active, getPos, scratchTo, scheduleMeasure],
  );

  const onPointerUp = useCallback(() => {
    drawing.current = false;
    lastPoint.current = null;
    scheduleMeasure();
  }, [scheduleMeasure]);

  return { canvasRef, containerRef, onPointerDown, onPointerMove, onPointerUp };
}

/* ----------------------------------------------------------------------- */
/* Small presentational pieces                                             */
/* ----------------------------------------------------------------------- */

const writeCharVariant: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, delay, ease: luxuryEase },
  }),
};

function WriteOnHeading({ text, delay = 0 }: { text: string; delay?: number }) {
  let i = 0;
  return (
    <span>
      {text.split(' ').map((word, wi) => (
        <span key={wi} className="mr-[0.28em] inline-block whitespace-nowrap">
          {word.split('').map((char, ci) => {
            const idx = i++;
            return (
              <motion.span
                key={ci}
                className="inline-block"
                variants={writeCharVariant}
                initial="hidden"
                animate="visible"
                custom={delay + idx * 0.025}
              >
                {char}
              </motion.span>
            );
          })}
        </span>
      ))}
    </span>
  );
}

function CrescentMotif() {
  return (
    <svg viewBox="0 0 32 32" className="h-5 w-5 text-[#C49A54]/70" fill="none">
      <path d="M20 4a12 12 0 1 0 0 24 9.5 9.5 0 0 1 0-24z" fill="currentColor" opacity="0.75" />
    </svg>
  );
}

/** Restrained champagne celebration — a dozen soft particles drifting
 *  upward, gone in under two seconds. No party colors, no burst. */
function ChampagneCelebration() {
  const palette = ['#D9B872', '#C6A15B', '#FBF7EF', '#EFE6D3'];
  const pieces = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        left: 32 + Math.random() * 36,
        size: 4 + Math.random() * 5,
        drift: (Math.random() - 0.5) * 50,
        rise: 130 + Math.random() * 70,
        duration: 1.6 + Math.random() * 0.6,
        delay: Math.random() * 0.2,
        color: palette[i % palette.length],
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <div className="
        absolute
        left-1/2
        top-1/2
        -translate-x-1/2
        -translate-y-1/2
        pointer-events-none
        overflow-visible
">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full"
          style={{ left: `${p.left}%`, top: '55%', width: p.size, height: p.size, backgroundColor: p.color }}
          initial={{ opacity: 0.9, y: 0, x: 0 }}
          animate={{ opacity: 0, y: -p.rise, x: p.drift }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/* ScratchReveal                                                            */
/* ----------------------------------------------------------------------- */

export function ScratchReveal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-100px' });

  const [phase, setPhase] = useState<Phase>('idle');
  const [celebrationKey, setCelebrationKey] = useState(0);
  const [showPageCelebration, setShowPageCelebration] = useState(false);


  const handleThreshold = useCallback(() => {
  setPhase('dissolving');
  setCelebrationKey((k) => k + 1);
  window.setTimeout(() => setPhase('revealed'), DISSOLVE_DURATION_MS);
  setShowPageCelebration(true);
  window.setTimeout(() => setShowPageCelebration(false), 4200);
}, []);

  const { canvasRef, containerRef, onPointerDown, onPointerMove, onPointerUp } = useScratchCanvas(
    phase === 'idle' || phase === 'scratching',
    handleThreshold,
  );

  const handleFirstTouch = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (phase === 'idle') setPhase('scratching');
      onPointerDown(e);
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [phase, onPointerDown],
  );

  return (
    <SectionWrapper className="relative overflow-hidden bg-ivory px-6 pt-8 pb-10">
      <div ref={sectionRef} className="relative w-full">
        {/* Seam bridge — softens the cut from Invitation Message instead of a hard edge */}
        <div className="pointer-events-none absolute inset-x-0 -top-1 h-24" aria-hidden="true">
          <div className="h-full w-full bg-gradient-to-b from-[#F3E9D6]/1 to-transparent" />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1.6, ease: luxuryEase }}
        >
          
        </motion.div>

       <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center">
          <h2 className="font-script text-3xl text-gold-dark md:text-4xl">
            <WriteOnHeading text="Unveil the Celebration" delay={0.1} />
          </h2>

          <motion.div
            className="invitation-divider mt-4 h-px w-20"
            initial={{ width: 0, opacity: 0 }}
            animate={inView ? { width: 80, opacity: 1 } : { width: 0, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: luxuryEase }}
          />

          <motion.p
            className="mt-2 font-serif text-sm italic text-ink/60"
            initial={{ opacity: 0, y: 6 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
            transition={{ duration: 0.5, delay: 0.5, ease: luxuryEase }}
          >
            Gently reveal your invitation
          </motion.p>

          <motion.div
            className="relative mt-6 w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.6, ease: luxuryEase }}
          >
            <motion.div
              ref={containerRef}
              animate={
              phase==="revealed"
              
              ?{
              y:-4,
              scale:1,
              }
              :{
              y:0,
              scale:.985
              }
              }
              transition={{
              duration:.7,
              ease:luxuryEase
              }}
              className="
                invitation-paper
                relative
                isolate
                mx-auto
                w-full
                max-w-lg
                h-64
                overflow-hidden
                rounded-2xl
                "
            >
              <div className="invitation-paper-fiber" aria-hidden="true" />
              <div className="invitation-paper-emboss" aria-hidden="true" />

              <div className="relative flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
                <CrescentMotif />
                <p className="font-script text-2xl text-gold-dark">You're Invited</p>
                <div className="invitation-divider h-px w-16" />
                <p className="font-display text-2xl text-ink">
                  {event.dayName}, {event.dateDisplay}
                </p>
                <p className="font-serif text-lg text-ink/70">Nikah · {event.nikahTime}</p>
                <p className="font-sans text-[12px] uppercase tracking-[0.2em] text-ink/50">
                  {event.venueName}, {event.venueAddress}
                </p>
              </div>

              <AnimatePresence>
                {phase !== 'revealed' && (
                  <motion.canvas
                    ref={canvasRef}
                    className="
                      absolute
                      inset-0
                      z-30
                      h-full
                      w-full
                      touch-none
                      cursor-pointer
"
                    style={{ pointerEvents: phase === 'idle' || phase === 'scratching' ? 'auto' : 'none' }}
                    exit={{ opacity: 0 }}
                    animate={
                      phase === 'dissolving'
                        ? { opacity: 0,  }
                        : { opacity: 1, }
                    }
                    transition={{ duration: DISSOLVE_DURATION_MS / 1000, ease: luxuryEase }}
                    onPointerDown={handleFirstTouch}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerLeave={onPointerUp}
                  />
                )}
              </AnimatePresence>

              {phase === 'revealed' && (
                <motion.div
                  className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-[linear-gradient(100deg,transparent,rgba(255,248,224,0.5),transparent)]"
                  initial={{ x: '0%' }}
                  animate={{ x: '400%' }}
                  transition={{ duration: 1, ease: luxuryEase }}
                />
              )}
            </motion.div>

            {phase !== 'idle' && phase !== 'scratching' && <ChampagneCelebration key={celebrationKey} />}
          </motion.div>

          <AnimatePresence>
            {(phase === 'idle' || phase === 'scratching') && (
              <motion.p
                className="mt-2 font-sans text-[10px] uppercase tracking-[0.25em] text-ink/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                Drag gently to unveil
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        {showPageCelebration && <PageCelebration />}
      </div>
    </SectionWrapper>
  );
}