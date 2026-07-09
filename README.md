# Ayshath Afra & Muhammad Ibrahim Swafwan — Wedding Invitation

## Status: verified scaffold, not a finished site

This has been `npm install`'d, type-checked (`tsc -b`), and production-built
(`vite build`) successfully — so what you're getting actually runs, not just
"looks right in a chat window." What's real right now:

- ✅ Loader → Wax Seal (tap-to-open) → Door/Curtain reveal → Hero — fully wired, working state machine
- ✅ Smooth scroll (Lenis), audio unlock pattern that will actually survive iOS Safari's autoplay block
- ✅ Design token system in `tailwind.config.ts` — the whole palette/type system lives in one file
- 🚧 Sections 4–10 (Scratch Reveal, Gallery, Countdown, Timeline, Venue, RSVP, Closing) are **structurally wired
  and render correctly**, but visually plain — they're placeholders proving the architecture, not the final polish
  the brief asks for. The Scratch Reveal in particular needs real canvas logic (see the comment in that file).

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build to /dist
```

## What YOU need to supply (I can't fake these well)

1. `/public/audio/bismillah.mp3` — the actual track, licensed/purchased if this goes public
2. `/public/images/hero-balcony.jpg` — the palace/balcony/sky background for the Hero. This is the single
   highest-leverage image in the whole site; source or commission a real one, don't let AI hallucinate it
3. `/public/images/gallery-1.jpg` through `gallery-4.jpg` — your actual couple photos, pre-compressed to
   under ~300KB each (I did NOT build automatic image resizing — that's a build-time responsibility, not runtime)
4. Real numbers in `src/config/weddingData.ts` → `rsvp.whatsappNumber` and `rsvp.callNumber`
5. A decision on the wax seal: current version is an SVG/gradient approximation. If you want the literal
   photoreal wax-drip look from the brief, that's a sourced/rendered image asset, not CSS

## Build order from here (do NOT skip ahead — this is the brief's own instruction, and it's correct)

1. Scratch Reveal — canvas-based scratch mechanic + confetti trigger at 70%
2. Gallery — swap placeholder images, add fullscreen lightbox + swipe
3. Countdown — add the flip-card animation (currently plain number swap)
4. Timeline — scroll-driven "growing line" (currently static)
5. Venue — floating pin micro-animation
6. RSVP — polish, test the WhatsApp deep link on an actual phone
7. Closing — particle fade-out
8. Full pass: Lighthouse audit, reduced-motion audit, real-device test (this is where "95+" gets earned or doesn't)

## Honest scope notes

- Dropped `react-scratch-card` and `react-countdown` from the original tech list — both are thin,
  semi-maintained wrappers around things ~30-100 lines of hand-written code does better and lighter.
- Google Maps is an `<iframe>` embed, not the full JS SDK — much lighter for a single pin.
- "Realistic wax seal" and "physically simulated silk curtains" are approximated with CSS/SVG, not
  literal photorealism or cloth physics — see comments in `TapToOpen.tsx` and `OpeningSequence.tsx` for why.
