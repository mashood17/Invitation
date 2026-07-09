import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionWrapper } from '@/components/shared/SectionWrapper';
import { event } from '@/config/weddingData';

/**
 * Real scratch mechanic: a <canvas> painted gold sits ON TOP of the
 * revealed content underneath. Pointer-move events with globalCompositeOperation
 * 'destination-out' erase the gold layer wherever the finger/mouse drags —
 * that's the actual trick every scratch-card implementation uses, there's
 * no shortcut library doing anything smarter than this.
 *
 * We sample pixel alpha data every few strokes to compute % scratched.
 * Past 70%, we fire the confetti burst and fade the canvas out entirely
 * so the reveal reads as fully clean, not "half scratched forever."
 */
export function ScratchReveal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDrawing = useRef(false);
  const [revealed, setRevealed] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      paintGoldLayer(ctx, rect.width, rect.height);
    };

    function paintGoldLayer(c: CanvasRenderingContext2D, w: number, h: number) {
      const gradient = c.createLinearGradient(0, 0, w, h);
      gradient.addColorStop(0, '#E4CE9E');
      gradient.addColorStop(0.5, '#C6A15B');
      gradient.addColorStop(1, '#9C7B3E');
      c.fillStyle = gradient;
      c.fillRect(0, 0, w, h);

      c.fillStyle = 'rgba(255,255,255,0.9)';
      c.font = '600 14px Poppins, sans-serif';
      c.textAlign = 'center';
      c.fillText('✦ Scratch to Reveal ✦', w / 2, h / 2);
    }

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const scratch = (x: number, y: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 28, 0, Math.PI * 2);
    ctx.fill();
  };

  const checkProgress = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || revealed) return;

    // Sample every 4th pixel for performance — full-resolution alpha
    // scanning on every stroke would be needlessly expensive.
    const { width, height } = canvas;
    const data = ctx.getImageData(0, 0, width, height).data;
    let cleared = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += 4 * 4) {
      total++;
      if (data[i] === 0) cleared++;
    }

    if (total > 0 && cleared / total > 0.7) {
      setRevealed(true);
      setConfettiKey((k) => k + 1);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    const { x, y } = getPos(e);
    scratch(x, y);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const { x, y } = getPos(e);
    scratch(x, y);
  };

  const handlePointerUp = () => {
    isDrawing.current = false;
    checkProgress();
  };

  return (
    <SectionWrapper className="bg-cream px-6 py-24 text-center">
      <h2 className="section-heading mb-8">Scratch to Reveal</h2>

      <div
        ref={containerRef}
        className="relative mx-auto h-40 w-full max-w-sm overflow-hidden rounded-xl shadow-lg"
      >
        {/* Content underneath — always in the DOM, revealed as canvas erases */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-ivory">
          <p className="font-script text-xl text-gold-dark">You're Invited</p>
          <p className="font-display text-lg text-ink">
            {event.dayName}, {event.dateDisplay}
          </p>
          <p className="font-serif text-sm text-ink/70">Nikah · {event.nikahTime}</p>
          <p className="font-sans text-xs uppercase tracking-widest text-ink/50">
            {event.venueName}, {event.venueAddress}
          </p>
        </div>

        {/* Gold scratch layer, fades away once threshold is crossed */}
        <AnimatePresence>
          {!revealed && (
            <motion.canvas
              ref={canvasRef}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 h-full w-full touch-none"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            />
          )}
        </AnimatePresence>
      </div>

      {revealed && <ConfettiBurst key={confettiKey} />}
    </SectionWrapper>
  );
}

/**
 * Lightweight confetti — plain divs animated with Framer Motion, no
 * canvas-confetti dependency needed for ~24 particles. Cleans itself
 * up after the animation via `onAnimationComplete` isn't wired here on
 * purpose: leaving the burst mounted is cheap, and removing it risks a
 * layout flash. If you want it to fully unmount later, lift `revealed`
 * state up and gate this on a `showConfetti` timeout instead.
 */
function ConfettiBurst() {
  const pieces = Array.from({ length: 24 });
  const colors = ['#C6A15B', '#E4CE9E', '#0D2B24', '#FBF7EF'];

  return (
    <div className="pointer-events-none absolute inset-0 mx-auto max-w-sm overflow-visible">
      {pieces.map((_, i) => {
        const startX = 50 + (Math.random() * 40 - 20);
        const endX = startX + (Math.random() * 60 - 30);
        const rotate = Math.random() * 360;
        return (
          <motion.span
            key={i}
            className="absolute h-2 w-2 rounded-sm"
            style={{
              left: `${startX}%`,
              top: '40%',
              backgroundColor: colors[i % colors.length],
            }}
            initial={{ opacity: 1, y: 0, rotate: 0 }}
            animate={{
              opacity: 0,
              y: 220 + Math.random() * 80,
              x: `${endX - startX}%`,
              rotate,
            }}
            transition={{ duration: 1.4 + Math.random() * 0.6, ease: 'easeOut' }}
          />
        );
      })}
    </div>
  );
}