import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, type MotionValue } from 'framer-motion';

import { heroMedia } from '@/config/weddingData';
import './hero.css';

const GRADE_FILTER = 'saturate(0.92) contrast(1.06) brightness(0.89) sepia(0.06) blur(0.3px)';

interface HeroVideoProps {
  /** Scroll-driven parallax, slower than the text layer above it. Omit to disable. */
  parallaxY?: MotionValue<number>;
}

/**
 * HeroVideo — progressive loading, imperceptible cinematic drift, and a
 * cinema-leaning grade shared by the poster and video so the swap between
 * them is invisible.
 *
 * Loading sequence (#21–23):
 *  1. The poster paints immediately (eager, high fetch priority) — the Hero
 *     is never blank.
 *  2. The video element mounts at the same time and starts fetching/decoding
 *     in the background (preload="auto"); it is not gated behind any timer
 *     or loader.
 *  3. Once the video reports `loadeddata`, it cross-fades over the poster
 *     using a plain CSS opacity transition (cheaper than a Framer Motion
 *     tween for a one-shot swap). The poster stays mounted underneath so a
 *     stall/buffer never produces a blank frame.
 *  4. The drift/parallax transforms only ever touch `transform` — no
 *     layout-affecting properties — so this stays GPU-accelerated and does
 *     not fight the video decoder for main-thread time.
 */
export function HeroVideo({ parallaxY }: HeroVideoProps) {
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const useVideo = heroMedia.videoSrc && !videoFailed;

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    // If the video is already decodable by mount (cache hit), skip the fade.
    if (el.readyState >= 2) {
      setVideoReady(true);
      return;
    }
    const onReady = () => setVideoReady(true);
    el.addEventListener('loadeddata', onReady);
    return () => el.removeEventListener('loadeddata', onReady);
  }, [useVideo]);

  const driftAnimation = !prefersReducedMotion ? { scale: [1.05, 1.085], y: [0, -10] } : undefined;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Scroll parallax layer — moves slower than the text above it */}
      <motion.div className="absolute inset-0" style={{ y: parallaxY }}>
        {/* Drift layer — near-imperceptible life, independent of scroll */}
        <motion.div
          className="absolute inset-0"
          animate={driftAnimation}
          transition={{ duration: 22, ease: 'linear', repeat: Infinity, repeatType: 'reverse' }}
        >
          {/* Poster — paints first, stays mounted as a safety net under the video */}
          <img
            src={heroMedia.imageSrc}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            loading="eager"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ filter: GRADE_FILTER }}
          />

          {useVideo && (
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out"
              style={{ filter: GRADE_FILTER, opacity: videoReady ? 1 : 0 }}
              src={heroMedia.videoSrc}
              poster={heroMedia.imageSrc}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              onError={() => setVideoFailed(true)}
            />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}