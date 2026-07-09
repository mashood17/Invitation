import { useRef, useCallback, useState } from 'react';

/**
 * Every mobile browser BLOCKS autoplay with sound until a real user
 * gesture happens. The brief says "music starts only after interaction" —
 * that's not just a design choice, it's the only way this will actually
 * work on iOS Safari. This hook exposes `unlock()`, which you call from
 * inside the seal's onClick/onTap handler — nowhere else.
 */
export function useAudio(src: string, defaultVolume = 0.5) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(defaultVolume);

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio(src);
      audio.loop = true;
      audio.volume = defaultVolume;
      audio.preload = 'auto';
      audioRef.current = audio;
    }
    return audioRef.current;
  }, [src, defaultVolume]);

  // Call this from a click/tap handler ONLY. This is the one moment
  // browsers consider a legitimate "user gesture" to permit sound.
  const unlock = useCallback(async () => {
    const audio = getAudio();
    try {
      await audio.play();
      setIsPlaying(true);
    } catch (err) {
      // Playback can still fail (e.g. silent mode on iOS) — fail
      // quietly, never block the invitation from opening because of it.
      console.warn('Audio playback was blocked or failed:', err);
    }
  }, [getAudio]);

  const toggle = useCallback(() => {
    const audio = getAudio();
    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, [getAudio]);

  const setVolumeLevel = useCallback(
    (v: number) => {
      const audio = getAudio();
      audio.volume = v;
      setVolume(v);
    },
    [getAudio]
  );

  return { unlock, toggle, isPlaying, volume, setVolume: setVolumeLevel };
}
