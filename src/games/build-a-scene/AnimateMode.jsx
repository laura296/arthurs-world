import { useState, useEffect } from 'react';
import { playDrumroll } from '../../hooks/useSound';

export default function AnimateMode({
  isAnimating,
  onStartAnimate,
  onStopAnimate,
  placedCount,
}) {
  const [showSparkles, setShowSparkles] = useState(false);

  const handleMagic = () => {
    if (placedCount === 0) return;
    playDrumroll();
    setShowSparkles(true);

    // After drumroll (1.5s), start animations
    setTimeout(() => {
      onStartAnimate();
    }, 1500);

    // Clear sparkles after sweep completes
    setTimeout(() => {
      setShowSparkles(false);
    }, 3000);
  };

  // Clean up sparkles when stopping
  useEffect(() => {
    if (!isAnimating) setShowSparkles(false);
  }, [isAnimating]);

  return (
    <>
      {/* Sparkle sweep overlay */}
      {showSparkles && (
        <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-sparkle-sweep"
              style={{
                top: `${Math.random() * 100}%`,
                left: 0,
                animationDelay: `${Math.random() * 0.8}s`,
                fontSize: `${16 + Math.random() * 20}px`,
              }}
            >
              ✨
            </div>
          ))}
        </div>
      )}

      {/* Magic / Stop button */}
      <div className="absolute bottom-28 right-4 z-50">
        {isAnimating ? (
          <button
            onClick={onStopAnimate}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-700
                       flex items-center justify-center shadow-lg shadow-red-500/30
                       active:scale-90 transition-transform border-2 border-red-400"
          >
            <span className="text-2xl">⏹️</span>
          </button>
        ) : (
          <button
            onClick={handleMagic}
            disabled={placedCount === 0}
            className={`w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500
                       flex items-center justify-center shadow-lg
                       active:scale-90 transition-transform border-2 border-sun
                       ${placedCount === 0
                         ? 'opacity-30 cursor-not-allowed'
                         : 'animate-magic-glow'}`}
          >
            <span className="text-2xl">🪄</span>
          </button>
        )}
      </div>
    </>
  );
}
