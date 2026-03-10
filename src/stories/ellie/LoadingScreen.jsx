import { useState, useEffect, useRef } from 'react';
import { STATIC_ASSETS, ANIMAL_NAMES, FOLK_NAMES } from './storyData';

function preloadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const running = useRef(false);

  const allSrcs = [
    STATIC_ASSETS.characterSheet,
    ...Array.from({ length: 4 }, (_, i) => STATIC_ASSETS.scene(i + 1)),
    ...Array.from({ length: 4 }, (_, i) => STATIC_ASSETS.gameBg(i + 1)),
    ...ANIMAL_NAMES.map(n => STATIC_ASSETS.animal(n)),
    ...FOLK_NAMES.map(n => STATIC_ASSETS.folk(n)),
  ];
  const total = allSrcs.length;

  useEffect(() => {
    if (running.current) return;
    running.current = true;

    let loaded = 0;
    allSrcs.forEach(src => {
      preloadImage(src).then(() => {
        loaded++;
        setProgress(loaded);
        if (loaded >= total) onComplete();
      });
    });
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-night gap-6 p-8">
      <img
        src={STATIC_ASSETS.characterSheet}
        alt="Ellie"
        className="w-48 h-auto rounded-2xl shadow-xl border-2 border-sun/30 animate-ellie-fade-in"
      />

      <h2 className="text-2xl font-heading text-sun text-center">
        Getting ready...
      </h2>

      {total > 0 && (
        <div className="w-64 max-w-full">
          <div className="h-4 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-400 to-sun rounded-full transition-all duration-500"
              style={{ width: `${(progress / total) * 100}%` }}
            />
          </div>
          <p className="text-sm font-body text-white/60 text-center mt-2">
            {progress} of {total}
          </p>
        </div>
      )}
    </div>
  );
}
