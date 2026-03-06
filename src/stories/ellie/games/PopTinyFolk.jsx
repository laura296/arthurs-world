import { useState, useEffect, useCallback, useRef } from 'react';
import { getImage, blobToUrl } from '../../../lib/imageCache';
import { VERSION, FOLK_NAMES } from '../storyData';
import { playSparkle, playTone } from '../../../hooks/useSound';

const TARGET_POPS = 8;

function randomPositions() {
  // Generate 8 non-overlapping positions
  const positions = [];
  for (let i = 0; i < TARGET_POPS; i++) {
    let x, y, attempts = 0;
    do {
      x = 12 + Math.random() * 76;
      y = 18 + Math.random() * 55;
      attempts++;
    } while (
      attempts < 20 &&
      positions.some(p => Math.abs(p.x - x) < 14 && Math.abs(p.y - y) < 14)
    );
    positions.push({ x, y });
  }
  return positions;
}

export default function PopTinyFolk({ onComplete, burst }) {
  const [folk, setFolk] = useState([]);
  const [popped, setPopped] = useState(0);
  const completed = useRef(false);

  // Initialize folk with positions and sprite URLs
  useEffect(() => {
    const positions = randomPositions();
    Promise.all(
      FOLK_NAMES.map(async (name, i) => {
        const blob = await getImage(`${VERSION}-folk-${name}`);
        return {
          id: i,
          name,
          x: positions[i].x,
          y: positions[i].y,
          url: blob ? blobToUrl(blob) : null,
          popped: false,
        };
      })
    ).then(setFolk);
  }, []);

  const handlePop = useCallback((id) => {
    playSparkle();
    const next = popped + 1;
    const freq = 400 + (next / TARGET_POPS) * 500;
    playTone(freq, 0.12, 'sine');

    setFolk(prev => prev.map(f => f.id === id ? { ...f, popped: true } : f));
    setPopped(next);

    if (next >= TARGET_POPS && !completed.current) {
      completed.current = true;
      onComplete();
    }
  }, [popped, onComplete]);

  return (
    <div className="w-full h-full relative">
      {/* Progress dots */}
      <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center gap-2">
        {Array.from({ length: TARGET_POPS }, (_, i) => (
          <div
            key={i}
            className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
              i < popped ? 'bg-sun scale-110' : 'bg-white/30'
            }`}
          />
        ))}
      </div>

      {/* Tiny Folk characters */}
      {folk.map(f => (
        <button
          key={f.id}
          onClick={() => !f.popped && handlePop(f.id)}
          className={`absolute w-20 h-20 z-20 rounded-2xl overflow-hidden
                     ${f.popped ? 'animate-ellie-spin-away pointer-events-none' : 'animate-ellie-bob active:scale-90'}
                     transition-transform`}
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            transform: 'translate(-50%, -50%)',
            animationDelay: `${f.id * 0.15}s`,
          }}
        >
          {/* Glow ring */}
          {!f.popped && (
            <div className="absolute inset-0 rounded-2xl animate-ellie-glow opacity-30 pointer-events-none"
                 style={{ boxShadow: '0 0 15px #a78bfa, 0 0 30px #a78bfa' }} />
          )}
          {f.url ? (
            <img
              src={f.url}
              alt={f.name}
              className="w-full h-full object-contain relative z-10"
              draggable={false}
            />
          ) : (
            <span className="text-4xl relative z-10">✨</span>
          )}
        </button>
      ))}

      {/* Hint */}
      {popped === 0 && folk.length > 0 && (
        <div className="absolute top-20 left-0 right-0 text-center z-20 animate-ellie-fade-in">
          <span className="bg-black/40 backdrop-blur-sm rounded-full px-4 py-2
                           text-base font-body text-white/80">
            Tap the Tiny Folk!
          </span>
        </div>
      )}
    </div>
  );
}
