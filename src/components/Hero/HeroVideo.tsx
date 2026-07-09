import { useState } from 'react';
import { heroMedia } from '@/config/weddingData';

export function HeroVideo() {
  const [videoFailed, setVideoFailed] = useState(false);
  const useVideo = heroMedia.videoSrc && !videoFailed;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {useVideo ? (
        <video
          className="absolute inset-0 h-full w-full scale-105 object-cover"
          style={{ filter: 'saturate(1.05) brightness(0.9) blur(0.3px)' }}
          src={heroMedia.videoSrc}
          poster={heroMedia.imageSrc}
          autoPlay
          loop
          muted
          playsInline
          onError={() => setVideoFailed(true)}
        />
      ) : (
        <div
          className="absolute inset-0 scale-105 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroMedia.imageSrc})` }}
        />
      )}
    </div>
  );
}