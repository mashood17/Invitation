import type { Config } from 'tailwindcss';

// DESIGN TOKENS — single source of truth for the whole visual identity.
// Change a value here, it changes everywhere. Never hardcode a hex value
// inside a component — if you need a color that isn't here, that's a sign
// to add it here first, not to freehand it in the component.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#FBF7EF',       // primary background
        cream: '#F4EEE1',       // secondary section background
        emerald: {
          DEFAULT: '#0D2B24',   // deep emerald - seal/door section
          light: '#123A30',
        },
       gold: {
        DEFAULT: '#C6A15B',
        light: '#F0CE7E',
        dark: '#9C7B3E',
      },
        ink: '#2B2620',          // body text on light backgrounds
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],   // headings, names
        serif: ['"Cormorant Garamond"', 'serif'],    // body copy
        script: ['"Great Vibes"', 'cursive'],        // signature/accent lines
        sans: ['"Poppins"', 'sans-serif'],           // UI labels, buttons
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.16, 1, 0.3, 1)', // signature "heavy door" ease
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.03)' },
        },
        curtainWave: {
          '0%, 100%': { transform: 'rotate(0deg) translateX(0)' },
          '50%': { transform: 'rotate(0.6deg) translateX(4px)' },
        },
      },
      animation: {
        breathe: 'breathe 4s ease-in-out infinite',
        curtainWave: 'curtainWave 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
