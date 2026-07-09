import { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface MusicControlProps {
  isMuted: boolean;
  volume: number;
  onToggleMute: () => void;
  onVolumeChange: (v: number) => void;
}

const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

export function MusicControl({ isMuted, volume, onToggleMute, onVolumeChange }: MusicControlProps) {
  const [expanded, setExpanded] = useState(false);
  const showSlider = expanded && !isIOS;

  return (
    <div
      className="fixed right-4 top-4 z-40 flex items-center gap-2 rounded-full border border-gold/40 bg-ivory/95 px-2 py-1.5 shadow-sm transition-all"
      style={{ width: showSlider ? 148 : 40 }}
    >
      <button
        type="button"
        onClick={onToggleMute}
        onDoubleClick={() => !isIOS && setExpanded((e) => !e)}
        aria-label={isMuted ? 'Unmute music' : 'Mute music'}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gold-dark"
      >
        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>

      {showSlider && (
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={isMuted ? 0 : volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          className="h-1 w-full accent-gold-dark"
          aria-label="Music volume"
        />
      )}

      {!isIOS && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="shrink-0 font-sans text-[9px] uppercase tracking-widest text-gold-dark/70"
          aria-label={expanded ? 'Hide volume slider' : 'Show volume slider'}
        >
          {expanded ? '‹' : '›'}
        </button>
      )}
    </div>
  );
}