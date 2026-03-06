import { useState, useEffect } from 'react';
import { getImage, blobToUrl } from '../../lib/imageCache';
import { VERSION } from './storyData';
import { playTone } from '../../hooks/useSound';

export default function TitleScreen({ onStart }) {
  const [heroUrl, setHeroUrl] = useState(null);

  useEffect(() => {
    getImage(`${VERSION}-character-sheet`).then(blob => {
      if (blob) setHeroUrl(blobToUrl(blob));
    });
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-purple-900 via-indigo-900 to-night gap-6 p-8">
      {/* Stars */}
      {Array.from({ length: 20 }, (_, i) => (
        <div
          key={i}
          className="absolute animate-sparkle text-yellow-200"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 60}%`,
            fontSize: `${8 + Math.random() * 12}px`,
            animationDelay: `${Math.random() * 3}s`,
            opacity: 0.4 + Math.random() * 0.4,
          }}
        >
          *
        </div>
      ))}

      {/* Hero image */}
      {heroUrl ? (
        <img
          src={heroUrl}
          alt="Ellie the Elephant"
          className="w-56 h-auto rounded-3xl shadow-2xl border-3 border-sun/30 animate-ellie-fade-in"
        />
      ) : (
        <span className="text-8xl animate-float">🐘</span>
      )}

      {/* Title */}
      <div className="text-center animate-ellie-fade-in" style={{ animationDelay: '0.3s' }}>
        <h1 className="text-4xl font-heading text-sun drop-shadow-lg">
          Ellie & the Tiny Folk
        </h1>
        <p className="text-lg font-body text-purple-200/70 mt-1">
          An interactive story
        </p>
      </div>

      {/* Play button */}
      <button
        onClick={() => { playTone(523, 0.2, 'triangle'); onStart(); }}
        className="mt-4 px-10 py-4 bg-sun text-night text-2xl font-heading rounded-full
                   shadow-xl shadow-yellow-400/30 active:scale-95 transition-transform
                   animate-bounce"
        style={{ animationDelay: '0.6s' }}
      >
        Play
      </button>
    </div>
  );
}
