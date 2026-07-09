import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

import { couple } from '@/config/weddingData';
import { HeroVideo } from './HeroVideo';
import { HeroAtmosphere } from './HeroAtmosphere';
import {
  fadeUpVariant,
  arabicVariant,
  dividerVariant,
  dividerGlowVariant,
  diamondVariant,
  ornamentVariant,
  ampersandVariant,
  writeCharVariant,
  scrollLineVariant,
} from './heroVariants';
import './hero.css';

/* ----------------------------------------------------------------------- */
/* WriteOnText — luxury calligraphy reveal, driven by the shared variant.  */
/* ----------------------------------------------------------------------- */

function WriteOnText({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className: string;
  delay?: number;
}) {
  const words = text.split(' ');
  let letterIndex = 0;

  return (
    <span className={className}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.25em]">
          {word.split('').map((char, i) => {
            const currentIndex = letterIndex++;
            return (
              <motion.span
                key={i}
                className="inline-block"
                variants={writeCharVariant}
                initial="hidden"
                animate="visible"
                custom={delay + currentIndex * 0.02}
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

/* ----------------------------------------------------------------------- */
/* OrnamentGlyph — hairline + diamond, flanking the ampersand.             */
/* ----------------------------------------------------------------------- */

function OrnamentGlyph({ flip = false, delay = 0 }: { flip?: boolean; delay?: number }) {
  return (
    <motion.span
      className={`inline-flex items-center gap-1.5 ${flip ? 'flex-row-reverse' : ''}`}
      variants={ornamentVariant}
      initial="hidden"
      animate="visible"
      custom={delay}
    >
      <span className="h-px w-6 bg-gradient-to-r from-transparent via-gold/50 to-gold/70" />
      <span className="h-1 w-1 rotate-45 bg-gold/70" />
    </motion.span>
  );
}

/* ----------------------------------------------------------------------- */
/* AmpersandMotif — a small floral/Islamic frame with the ampersand set    */
/* in the display face, rather than a bare HTML "&".                      */
/* ----------------------------------------------------------------------- */

function AmpersandMotif({
  delay = 0,
  wow = false,
}: {
  delay?: number;
  wow?: boolean;
}) {
  return (
    <motion.svg
      viewBox="0 0 72 72"
      className="h-14 w-14 text-gold-light hero-ampersand-glow"
      variants={ampersandVariant}
      initial="hidden"
      animate={wow ? ['visible', 'catchLight'] : 'visible'}
      custom={delay}
    >
      {/* four petal strokes forming a quiet floral frame */}
      <g stroke="currentColor" strokeWidth="0.6" opacity="0.55" fill="none">
        <path d="M36 6c5 6 5 14 0 20-5-6-5-14 0-20z" />
        <path d="M36 66c5-6 5-14 0-20 -5 6-5 14 0 20z" />
        <path d="M6 36c6-5 14-5 20 0-6 5-14 5-20 0z" />
        <path d="M66 36c-6-5-14-5-20 0 6 5 14 5 20 0z" />
      </g>
      <circle cx="36" cy="36" r="26" stroke="currentColor" strokeWidth="0.5" opacity="0.3" fill="none" />
      <text
        x="36"
        y="46"
        textAnchor="middle"
        fontSize="30"
        fontStyle="italic"
        className="font-script"
        fill="currentColor"
      >
        &amp;
      </text>
    </motion.svg>
  );
}

/* ----------------------------------------------------------------------- */
/* Hero                                                                     */
/* ----------------------------------------------------------------------- */

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [brideWritten, setBrideWritten] = useState(false);

  // The bride's name finishes writing roughly 2.15s (start) + longest char
  // offset + settle duration after mount — the ampersand's "wow" beat waits
  // for that moment, then never repeats.
  useEffect(() => {
    const t = setTimeout(() => setBrideWritten(true), 3350);
    return () => clearTimeout(t);
  }, []);

  /* ---------------- Scroll choreography (#20) ---------------- */
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const arabicOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);
  const translationOpacity = useTransform(scrollYProgress, [0.04, 0.32], [1, 0]);
  const translationY = useTransform(scrollYProgress, [0, 0.32], [0, -18]);
  const dividerOpacity = useTransform(scrollYProgress, [0.08, 0.38], [1, 0]);
  const namesOpacity = useTransform(scrollYProgress, [0.3, 0.8], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -48]);
  const videoParallaxY = useTransform(scrollYProgress, [0, 1], [0, -20]);
  const lightOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.35]);

  return (
    <div
      ref={heroRef}
      className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      <HeroVideo parallaxY={prefersReducedMotion ? undefined : videoParallaxY} />
      <HeroAtmosphere />

      {/* Soft radial warmth, off-center like lantern light — fades gently on scroll */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full hero-radial-light"
        style={{ opacity: prefersReducedMotion ? 1 : lightOpacity }}
      />

      <motion.div
        className="hero-content-width relative z-10 flex flex-col items-center hero-vspace"
        style={{ y: prefersReducedMotion ? 0 : contentY }}
      >
        {/* Arabic invocation — blur in, gold highlight, settle, then perpetual breathing */}
        <motion.p
          className="font-display text-3xl text-gold-light hero-arabic-breathe md:text-4xl"
          variants={arabicVariant}
          initial="hidden"
          animate={['glow', 'settle']}
          style={{ opacity: prefersReducedMotion ? 1 : arabicOpacity }}
        >
          ﷽
        </motion.p>

        {/* Translation */}
        <motion.p
          className="mt-3 max-w-xs font-serif text-sm italic text-ivory/85 hero-small"
          variants={fadeUpVariant}
          initial="hidden"
          animate="visible"
          custom={0.85}
          style={{
            opacity: prefersReducedMotion ? undefined : translationOpacity,
            y: prefersReducedMotion ? undefined : translationY,
          }}
        >
          In the Name of Allah, The Most Gracious, The Most Merciful
        </motion.p>

        {/* Divider — center glow, diamond appears, lines extend, glow fades. Shimmers forever after. */}
        <motion.div
          className="mt-7 flex items-center gap-2"
          style={{ opacity: prefersReducedMotion ? 1 : dividerOpacity }}
        >
          <motion.span
            className="h-px bg-gradient-to-r from-transparent to-gold/70"
            variants={dividerVariant}
            initial="hidden"
            animate="visible"
            custom={1.35}
          />
          <span className="relative flex h-1.5 w-1.5 items-center justify-center">
            <motion.span
              className="absolute h-3 w-3 rounded-full bg-gold/40 blur-[3px]"
              variants={dividerGlowVariant}
              initial="hidden"
              animate="visible"
              custom={1.2}
            />
            <motion.span
              className="h-1.5 w-1.5 rotate-45 bg-gold/80 hero-divider-shimmer"
              variants={diamondVariant}
              initial="hidden"
              animate="visible"
              custom={1.5}
            />
          </span>
          <motion.span
            className="h-px bg-gradient-to-l from-transparent to-gold/70"
            variants={dividerVariant}
            initial="hidden"
            animate="visible"
            custom={1.35}
          />
        </motion.div>

        {/* Invitation line */}
        <motion.p
          className="mt-7 max-w-sm font-serif text-sm italic text-ivory/70 hero-small"
          variants={fadeUpVariant}
          initial="hidden"
          animate="visible"
          custom={1.7}
        >
          We are honoured to welcome you to the wedding ceremony of
        </motion.p>

        {/* Bride — warmer, very slightly larger: the composition's first focal point */}
        <motion.div
          className="mt-9 flex flex-col items-center hero-gap-md"
          style={{ opacity: prefersReducedMotion ? 1 : namesOpacity }}
        >
          <h1 className="font-display text-[clamp(2.85rem,9.2vw,4.4rem)] italic leading-[1.15] tracking-[0.005em] text-ivory hero-heading">
            <WriteOnText text={couple.brideName} className="" delay={2.15} />
          </h1>
          <motion.p
            className="font-sans text-[10px] font-medium uppercase tracking-[0.34em] text-gold-light hero-caption"
            variants={fadeUpVariant}
            initial="hidden"
            animate="visible"
            custom={3.05}
          >
            D/O Mr. &amp; Mrs. Abdul Kunhi K
          </motion.p>
        </motion.div>

        {/* Ampersand — floral motif, catches light once as the bride's name finishes */}
        <div className="mt-6 flex items-center gap-3">
          <OrnamentGlyph delay={3.4} />
          <AmpersandMotif delay={3.55} wow={brideWritten} />
          <OrnamentGlyph flip delay={3.4} />
        </div>

        {/* Groom — calmer, a touch darker: optical counterweight to the bride */}
        <motion.div
          className="mt-6 flex flex-col items-center hero-gap-md"
          style={{ opacity: prefersReducedMotion ? 1 : namesOpacity }}
        >
          <h1 className="font-display italic leading-[1.15] tracking-[0.005em] text-[clamp(2.7rem,8.7vw,4.15rem)] text-ivory hero-heading">
            <WriteOnText text="Muhammad" className="" delay={3.75} />
            <br />
            <WriteOnText text="Ibrahim Swafwan" className="" delay={4.0} />
          </h1>
          <motion.p
            className="font-sans text-[10px] font-medium uppercase tracking-[0.34em] text-gold-light hero-caption"
            variants={fadeUpVariant}
            initial="hidden"
            animate="visible"
            custom={5.1}
          >
            S/O Abdul Hameed Madani
          </motion.p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="mt-12 flex flex-col items-center gap-2"
          variants={fadeUpVariant}
          initial="hidden"
          animate="visible"
          custom={5.7}
        >
          <span className="font-sans text-[9px] font-medium uppercase tracking-[0.35em] text-ivory/40">
            Scroll
          </span>
          <motion.span
            className="h-8 w-px bg-gradient-to-b from-gold/50 to-transparent"
            variants={scrollLineVariant}
            animate="animate"
          />
        </motion.div>
      </motion.div>

      {/* Whole-Hero perpetual breathing — ~0.3% scale, imperceptible but alive */}
      <div className="hero-breathe pointer-events-none absolute inset-0" aria-hidden="true" />
    </div>
  );
}