import { useRef, useCallback, useState, useEffect } from 'react';

const MUTE_STORAGE_KEY = 'invitation-muted';
const DEFAULT_VOLUME = 0.5;

export function useAudio(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeId = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(DEFAULT_VOLUME);
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(MUTE_STORAGE_KEY) === 'true';
  });

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio(src);
      audio.loop = true;
      audio.volume = 0;
      audio.preload = 'auto';
      audioRef.current = audio;
    }
    return audioRef.current;
  }, [src]);

  // Volume fading works on Android/desktop but iOS Safari ignores
  // audio.volume entirely — this is harmless there, not the actual
  // mute mechanism, just a nicer transition where the platform allows it.
  const fadeVolume = useCallback((target: number, duration = 800) => {
    const audio = audioRef.current;
    if (!audio) return;

    const myFadeId = ++fadeId.current;
    const start = audio.volume;
    const startTime = performance.now();
    const clampedTarget = Math.min(1, Math.max(0, target));

    function step(now: number) {
      if (myFadeId !== fadeId.current) return;
      const progress = Math.min((now - startTime) / duration, 1);
      const value = start + (clampedTarget - start) * progress;
      audio!.volume = Math.min(1, Math.max(0, value));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, []);

  const applyMuteState = useCallback((muted: boolean) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = muted; // the actual mechanism — respected on iOS AND Android
  }, []);

  const unlock = useCallback(async () => {
    const audio = getAudio();
    audio.muted = isMuted;
    try {
      await audio.play();
      setIsPlaying(true);
      if (!isMuted) fadeVolume(volume);
    } catch (err) {
      console.warn('Audio playback was blocked or failed:', err);
    }
  }, [getAudio, fadeVolume, volume, isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      localStorage.setItem(MUTE_STORAGE_KEY, String(next));
      applyMuteState(next);
      fadeVolume(next ? 0 : volume, 400);
      return next;
    });
  }, [applyMuteState, fadeVolume, volume]);

  const setVolume = useCallback(
    (v: number) => {
      const clamped = Math.min(1, Math.max(0, v));
      setVolumeState(clamped);
      if (!isMuted && audioRef.current) {
        audioRef.current.volume = clamped; // no-op on iOS, works on Android/desktop
      }
    },
    [isMuted],
  );

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  return { unlock, toggleMute, setVolume, isPlaying, isMuted, volume };
}