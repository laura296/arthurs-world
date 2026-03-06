import { useState, useEffect, useCallback } from 'react';
import { getImage, blobToUrl } from '../../lib/imageCache';
import { CHAPTERS } from './storyData';
import { useCelebration } from '../../components/CelebrationOverlay';
import { useParticleBurst } from '../../components/ParticleBurst';
import { playSuccess } from '../../hooks/useSound';

export default function GameScreen({ chapter, GameComponent, onComplete }) {
  const [bgUrl, setBgUrl] = useState(null);
  const { celebrate, CelebrationLayer } = useCelebration();
  const { burst, ParticleLayer } = useParticleBurst();
  const [done, setDone] = useState(false);
  const data = CHAPTERS[chapter];

  useEffect(() => {
    getImage(data.gameBgKey).then(blob => {
      if (blob) setBgUrl(blobToUrl(blob));
    });
  }, [data.gameBgKey]);

  const handleComplete = useCallback(() => {
    if (done) return;
    setDone(true);
    playSuccess();
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    burst(cx, cy, {
      count: 16,
      spread: 100,
      colors: ['#facc15', '#ec4899', '#38bdf8', '#a78bfa'],
      shapes: ['star', 'heart', 'circle'],
    });
    celebrate({ message: 'Well done!' });
    setTimeout(() => onComplete(), 3500);
  }, [done, burst, celebrate, onComplete]);

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Background */}
      {bgUrl && (
        <img
          src={bgUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
      )}
      {!bgUrl && (
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-800 to-purple-900" />
      )}

      {/* Game title */}
      <div className="absolute top-4 left-0 right-0 z-20 text-center">
        <span className="inline-block bg-black/40 backdrop-blur-sm rounded-full px-5 py-1.5
                         text-sm font-heading text-sun/90">
          {data.gameTitle}
        </span>
      </div>

      {/* Game component */}
      <div className="absolute inset-0 z-10">
        <GameComponent onComplete={handleComplete} burst={burst} />
      </div>

      <CelebrationLayer />
      <ParticleLayer />
    </div>
  );
}
