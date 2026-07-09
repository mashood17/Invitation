import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import { SectionWrapper } from '@/components/shared/SectionWrapper';
import { galleryImages } from '@/config/weddingData';

export function Gallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Lock body scroll while the lightbox is open — without this the page
  // behind it scrolls underneath, which breaks the "fullscreen moment" feel.
  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightboxIndex]);

  return (
    <SectionWrapper className="bg-ivory px-6 py-24">
      <h2 className="section-heading mb-10">Our Moments</h2>

      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="mx-auto max-w-md overflow-hidden rounded-2xl shadow-xl [&_.swiper-pagination-bullet-active]:bg-gold"
      >
        {galleryImages.map((src, i) => (
          <SwiperSlide key={src}>
            <button
              type="button"
              onClick={() => setLightboxIndex(i)}
              className="block w-full cursor-zoom-in"
              aria-label="Open photo fullscreen"
            >
              <img
                src={src}
                alt=""
                loading="lazy"
                className="aspect-[3/4] w-full object-cover"
              />
            </button>
          </SwiperSlide>
        ))}
      </Swiper>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            startIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </SectionWrapper>
  );
}

interface LightboxProps {
  startIndex: number;
  onClose: () => void;
}

/**
 * Separate component, not just a conditional block inside Gallery —
 * keeps its own Swiper instance isolated from the small preview carousel
 * above, so autoplay/pagination state never leaks between the two.
 */
function Lightbox({ startIndex, onClose }: LightboxProps) {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-emerald/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose} // tap the backdrop to dismiss
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-5 top-5 z-10 rounded-full bg-ivory/10 p-2 text-ivory transition hover:bg-ivory/20"
      >
        <X size={22} />
      </button>

      <motion.div
        className="w-full max-w-lg px-4"
        onClick={(e) => e.stopPropagation()} // don't close when tapping the image itself
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <Swiper
          initialSlide={startIndex}
          onSwiper={setSwiper}
          modules={[Pagination]}
          pagination={{ clickable: true }}
          className="rounded-xl [&_.swiper-pagination-bullet-active]:bg-gold"
        >
          {galleryImages.map((src) => (
            <SwiperSlide key={src}>
              <img src={src} alt="" className="max-h-[80vh] w-full object-contain" />
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    </motion.div>
  );
}