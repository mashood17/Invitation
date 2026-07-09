import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

const COLORS = ['#EFDCA8', '#C6A15B', '#FBF7EF', '#9C7B3E'];

interface Piece {
  id: number;
  left: number;
  width: number;
  height: number;
  rotate: number;
  duration: number;
  delay: number;
  drift: number;
  color: string;
}

function usePieces(count: number): Piece[] {
  return useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        width: 6 + Math.random() * 5,
        height: 10 + Math.random() * 8,
        rotate: Math.random() * 360,
        duration: 2.6 + Math.random() * 1.6,
        delay: Math.random() * 0.7,
        drift: (Math.random() - 0.5) * 140,
        color: COLORS[i % COLORS.length],
      })),
    [count],
  );
}

export function PageCelebration() {
  const pieces = usePieces(30);

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-[2px] shadow-sm"
          style={{
            left: `${p.left}%`,
            top: '-6%',
            width: p.width,
            height: p.height,
            backgroundColor: p.color,
          }}
          initial={{ y: 0, x: 0, rotate: 0, opacity: 0.95 }}
          animate={{ y: '110vh', x: p.drift, rotate: p.rotate, opacity: 0 }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
        />
      ))}
    </div>,
    document.body,
  );
}