import { useEffect } from 'react';
import { STATIC_ASSETS, FOLK_NAMES } from './storyData';
import { playFanfare } from '../../hooks/useSound';
import { useCelebration } from '../../components/CelebrationOverlay';

export default function CelebrationScreen({ onReplay }) {
  const heroUrl = STATIC_ASSETS.scene(4);
  const folkUrls = FOLK_NAMES.map(name => STATIC_ASSETS.folk(name));
  const { celebrate, CelebrationLayer } = useCelebration();

  useEffect(() => {
    playFanfare();
    setTimeout(() => {
      celebrate({ message: 'The End!', duration: 5000 });
    }, 800);
  }, [celebrate]);

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Background */}
      <img src={heroUrl} alt="" className="absolute inset-0 w-full h-full object-cover" draggable={false} />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Folk parade at bottom */}
      <div className="absolute bottom-24 left-0 right-0 z-20 flex justify-center gap-3 overflow-hidden">
        {folkUrls.map((url, i) => (
          <div
            key={i}
            className="w-14 h-14 rounded-xl overflow-hidden animate-parade-enter shadow-lg"
            style={{ animationDelay: `${0.5 + i * 0.2}s` }}
          >
            <img src={url} alt="" className="w-full h-full object-contain" draggable={false} />
          </div>
        ))}
      </div>

      {/* Message */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-30 gap-4">
        <h1 className="text-5xl font-heading text-sun drop-shadow-xl animate-celebration-text">
          The End!
        </h1>
        <p className="text-xl font-body text-white drop-shadow-lg animate-ellie-fade-in"
           style={{ animationDelay: '1s' }}>
          A person's a person, no matter how small.
        </p>
      </div>

      {/* Replay button */}
      <div className="absolute bottom-6 left-0 right-0 z-40 flex justify-center">
        <button
          onClick={onReplay}
          className="px-8 py-3 bg-sun text-night text-lg font-heading rounded-full
                     shadow-xl active:scale-95 transition-transform animate-bounce"
          style={{ animationDelay: '2s' }}
        >
          Play Again
        </button>
      </div>

      <CelebrationLayer />
    </div>
  );
}
