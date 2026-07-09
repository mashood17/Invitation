import { motion } from 'framer-motion';
import { couple } from '@/config/weddingData';
import { HeroVideo } from './HeroVideo';
import { HeroAtmosphere } from './HeroAtmosphere';

const luxuryEase = [0.16, 1, 0.3, 1] as const;

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
      <span
        key={wordIndex}
        className="inline-block whitespace-nowrap mr-[0.25em]"
      >
        {word.split('').map((char, i) => {
          const currentIndex = letterIndex++;

          return (
            <motion.span
              key={i}
              className="inline-block"
              initial={{
                opacity: 0,
                filter: 'blur(4px)',
                letterSpacing: '0.3em',
              }}
              animate={{
                opacity: 1,
                filter: 'blur(0px)',
                letterSpacing: '0em',
              }}
              transition={{
                duration: 0.4,
                delay: delay + currentIndex * 0.025,
                ease: luxuryEase,
              }}
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

export function Hero() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-8 overflow-hidden px-6 text-center">
      <HeroVideo />
      <HeroAtmosphere />

      <div className="relative z-10 flex flex-col items-center gap-7">
        <motion.p
          className="font-display text-4xl text-gold-light"
          style={{ textShadow: '0 0 18px rgba(240,206,126,0.55), 0 2px 6px rgba(0,0,0,0.7)' }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: luxuryEase }}
        >
          ﷽
        </motion.p>

        <motion.p
          className="max-w-xs font-serif text-base italic text-ivory drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.1, ease: luxuryEase }}
        >
          In the Name of Allah, The Most Gracious, The Most Merciful
        </motion.p>

        <motion.div
          className="h-px bg-gold/60"
          initial={{ width: 0 }}
          animate={{ width: 64 }}
          transition={{ duration: 1, delay: 1.7, ease: luxuryEase }}
        />

        <motion.p
          className="max-w-sm font-serif text-base italic text-ivory/95 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 2.1, ease: luxuryEase }}
        >
          We are honoured to welcome you to the wedding ceremony of
        </motion.p>

        <div className="flex flex-col items-center gap-2 pt-2">
          <h1 className="font-display text-5xl italic leading-tight text-ivory drop-shadow-[0_3px_10px_rgba(0,0,0,0.75)] md:text-6xl">
            <WriteOnText text={couple.brideName} className="" delay={2.7} />
          </h1>
          <motion.p
            className="font-sans text-xs font-medium uppercase tracking-[0.25em] text-gold-light drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 3.6, ease: luxuryEase }}
          >
            {couple.brideParents}
          </motion.p>
        </div>

        <motion.span
          className="font-script text-4xl text-gold-light"
          style={{ textShadow: '0 0 14px rgba(240,206,126,0.5)' }}
          initial={{ opacity: 0, rotate: -25, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 4.0, ease: luxuryEase }}
        >
          &amp;
        </motion.span>

        <div className="flex flex-col items-center gap-2">
          <h1 className="
font-display
italic
leading-[1.2]
tracking-normal
text-[clamp(2.45rem,8vw,4rem)]
text-ivory
drop-shadow-[0_3px_10px_rgba(0,0,0,0.75)]
">
            <WriteOnText text="Muhammad" className="" delay={3.8} />
            <br />
            <WriteOnText text="Ibrahim Swafwan" className="" delay={4.1} />
          </h1>
          <motion.p
            className="font-sans text-xs font-medium uppercase tracking-[0.25em] text-gold-light drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 5.6, ease: luxuryEase }}
          >
            {couple.groomParents}
          </motion.p>
        </div>
      </div>
    </div>
  );
}