import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';

/**
 * Lenis gives the "heavy, expensive" scroll feel the brief asks for
 * instead of the default browser scroll. We drive it off GSAP's ticker
 * (not its own requestAnimationFrame loop) so it never fights with
 * ScrollTrigger-based animations later — this is the #1 cause of janky
 * scroll-linked animation in real projects and it's a one-line fix if
 * you set it up right from day one.
 */
export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 3), // ease-out cubic
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
    }
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);
}
