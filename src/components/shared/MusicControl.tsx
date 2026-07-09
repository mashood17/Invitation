import { Volume2, VolumeX } from 'lucide-react';

interface MusicControlProps {
  isMuted: boolean;
  onToggle: () => void;
}

export function MusicControl({ isMuted, onToggle }: MusicControlProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isMuted ? 'Unmute music' : 'Mute music'}
      className="fixed right-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 bg-ivory/70 text-gold-dark backdrop-blur-sm transition hover:bg-ivory"
    >
      {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
    </button>
  );
}