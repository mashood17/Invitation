import type { Variants } from 'framer-motion';

/** The single easing curve used across the entire Hero for a coherent feel. */
export const luxuryEase = [0.16, 1, 0.3, 1] as const;

/** Generic fade + gentle upward settle. Pass a delay via custom prop. */
export const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: luxuryEase },
  }),
};

/** Plain fade, no movement — used for wrappers/groups. */
export const fadeVariant: Variants = {
  hidden: { opacity: 0 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.7, delay, ease: luxuryEase },
  }),
};

/** Arabic invocation: opacity + blur in, a brief gold highlight, then settle. */
export const arabicVariant: Variants = {
  hidden: { opacity: 0 },
  glow: {
    opacity: 1,
    textShadow: '0 0 22px rgba(240,206,126,0.65), 0 1px 3px rgba(0,0,0,0.6)',
    transition: { duration: 0.9, ease: luxuryEase },
  },
  settle: {
    textShadow: '0 0 14px rgba(240,206,126,0.4), 0 1px 3px rgba(0,0,0,0.6)',
    transition: { duration: 0.6, ease: luxuryEase },
  },
};

/** Divider hairlines: extend from the center. */
export const dividerVariant: Variants = {
  hidden: { width: 0 },
  visible: (delay: number = 0) => ({
    width: 28,
    transition: { duration: 0.9, delay, ease: luxuryEase },
  }),
};

/** Divider center glow — appears first, fades as the lines finish extending. */
export const dividerGlowVariant: Variants = {
  hidden: { opacity: 0, scale: 0.4 },
  visible: (delay: number = 0) => ({
    opacity: [0, 1, 0.4],
    scale: [0.4, 1.8, 1],
    transition: { duration: 1.1, delay, ease: luxuryEase },
  }),
};

/** The small diamond mark at the center of the divider / ornaments. */
export const diamondVariant: Variants = {
  hidden: { scale: 0, rotate: 0, opacity: 0 },
  visible: (delay: number = 0) => ({
    scale: 1,
    rotate: 45,
    opacity: 1,
    transition: { duration: 0.5, delay, ease: luxuryEase },
  }),
};

/** Ornament hairlines flanking the ampersand. */
export const ornamentVariant: Variants = {
  hidden: { opacity: 0 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.9, delay, ease: luxuryEase },
  }),
};

/** The ampersand glyph — settles in, then catches light once as its "wow" beat. */
export const ampersandVariant: Variants = {
  hidden: { opacity: 0, rotate: -12, scale: 0.75 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: { duration: 0.7, delay, ease: luxuryEase },
  }),
  catchLight: {
    filter: [
      'drop-shadow(0 0 0px rgba(240,206,126,0))',
      'drop-shadow(0 0 12px rgba(240,206,126,0.95))',
      'drop-shadow(0 0 0px rgba(240,206,126,0))',
    ],
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

/** Per-character reveal used by WriteOnText. */
export const writeCharVariant: Variants = {
  hidden: { opacity: 0, letterSpacing: '0.12em', y: 8 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    letterSpacing: '0em',
    y: 0,
    transition: { duration: 0.32, delay, ease: luxuryEase },
  }),
};

/** Scroll indicator's breathing line. */
export const scrollLineVariant: Variants = {
  animate: {
    opacity: [0.3, 0.8, 0.3],
    transition: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' },
  },
};