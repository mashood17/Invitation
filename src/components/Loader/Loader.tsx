import { motion, AnimatePresence } from 'framer-motion';
import { couple } from '@/config/weddingData';

interface LoaderProps {
  isVisible: boolean;
}

export function Loader({ isVisible }: LoaderProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ivory"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {Array.from({ length: 10 }).map((_, i) => (
              <span
                key={i}
                className="absolute h-1 w-1 rounded-full bg-gold/50"
                style={{
                  left: `${(i * 37) % 100}%`,
                  top: `${(i * 53) % 100}%`,
                  animation: `breathe ${3 + (i % 3)}s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="font-display text-3xl tracking-widest text-ink">
              {couple.initials}
            </p>
            <div className="mx-auto mt-3 h-px w-10 bg-gold" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}