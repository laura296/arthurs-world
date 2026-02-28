import { useState, useEffect, useCallback } from 'react';
import { stickerPath, THEMES } from './cardData';
import { playStickerSound } from '../../hooks/useSound';

export default function CardParade({ theme, characters, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [phase, setPhase] = useState('waiting'); // waiting | entering | center | exiting | done
  const themeData = THEMES[theme];

  // Start first character after a brief pause
  useEffect(() => {
    const startTimer = setTimeout(() => {
      setCurrentIndex(0);
      setPhase('entering');
    }, 500);
    return () => clearTimeout(startTimer);
  }, []);

  // Advance through characters
  useEffect(() => {
    if (currentIndex < 0 || currentIndex >= characters.length) return;

    if (phase === 'entering') {
      const timer = setTimeout(() => {
        setPhase('center');
        playStickerSound(characters[currentIndex].sound);
      }, 600);
      return () => clearTimeout(timer);
    }

    if (phase === 'center') {
      const timer = setTimeout(() => setPhase('exiting'), 1500);
      return () => clearTimeout(timer);
    }

    if (phase === 'exiting') {
      const timer = setTimeout(() => {
        if (currentIndex + 1 >= characters.length) {
          setPhase('done');
        } else {
          setCurrentIndex(i => i + 1);
          setPhase('entering');
        }
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, phase, characters]);

  // Tap character to replay sound
  const handleTap = useCallback(() => {
    if (phase === 'center' && currentIndex >= 0 && currentIndex < characters.length) {
      playStickerSound(characters[currentIndex].sound);
    }
  }, [phase, currentIndex, characters]);

  const handleSkip = useCallback(() => {
    onComplete();
  }, [onComplete]);

  // Done — notify parent
  useEffect(() => {
    if (phase === 'done') {
      const timer = setTimeout(onComplete, 800);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  const current = currentIndex >= 0 && currentIndex < characters.length ? characters[currentIndex] : null;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      {/* Theme background */}
      <img
        src={themeData?.bgImage}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />

      {/* Skip button */}
      <button
        onClick={handleSkip}
        className="absolute top-4 right-4 z-50 px-3 py-1 bg-white/20 backdrop-blur-sm
                   rounded-full text-sm text-white/60 font-body active:scale-90 transition-transform"
      >
        Skip
      </button>

      {/* Character display */}
      {current && (
        <button
          onClick={handleTap}
          className={`relative z-10 w-40 h-40 ${
            phase === 'entering' ? 'animate-parade-enter' :
            phase === 'exiting' ? 'animate-parade-exit' :
            phase === 'center' ? 'animate-float' : ''
          }`}
        >
          <img
            src={stickerPath(theme, current.characterId)}
            alt={current.label}
            className="w-full h-full object-contain drop-shadow-2xl"
            draggable={false}
          />
        </button>
      )}

      {/* Character name */}
      {current && phase === 'center' && (
        <p className="relative z-10 mt-4 text-2xl font-heading text-white drop-shadow-lg animate-bounce-in">
          {current.label}
        </p>
      )}

      {/* "Ready to play?" at end */}
      {phase === 'done' && (
        <p className="relative z-10 text-3xl font-heading text-sun drop-shadow-lg animate-bounce-in">
          Ready to play?
        </p>
      )}

      {/* Progress dots */}
      <div className="absolute bottom-8 flex gap-2">
        {characters.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${
              i <= currentIndex ? 'bg-sun scale-110' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
