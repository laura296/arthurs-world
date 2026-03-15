import { useState, useCallback, useEffect } from 'react';
import BackButton from '../components/BackButton';
import ArthurBear from '../components/ArthurBear';
import { playPop, playSuccess, playBoing, playBuzz, playFanfare, playSparkle } from '../hooks/useSound';
import { useParticleBurst } from '../components/ParticleBurst';
import { useArthurPeek } from '../components/ArthurPeek';
import { useCelebration } from '../components/CelebrationOverlay';

/* ── Clothing items in correct dressing order ── */
const CLOTHES = [
  { id: 'underwear', emoji: '🩲', label: 'Pants',     color: '#38bdf8', order: 0 },
  { id: 'socks',     emoji: '🧦', label: 'Socks',     color: '#f97316', order: 1 },
  { id: 'tshirt',    emoji: '👕', label: 'T-Shirt',   color: '#22c55e', order: 2 },
  { id: 'trousers',  emoji: '👖', label: 'Trousers',  color: '#3b82f6', order: 3 },
  { id: 'jumper',    emoji: '🧥', label: 'Jumper',    color: '#a855f7', order: 4 },
  { id: 'shoes',     emoji: '👟', label: 'Shoes',     color: '#ef4444', order: 5 },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ── Bedroom background ── */
function BedroomScene() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Wall */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, #FFF8F0 0%, #FFECD2 60%, #E8D5B8 100%)' }} />

      {/* Window */}
      <div className="absolute top-[8%] right-[10%] w-24 h-28 rounded-t-full overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #87CEEB 0%, #FFF8DC 80%)',
          border: '4px solid #C4A265',
          boxShadow: 'inset 0 0 20px rgba(255,248,240,0.5)',
        }}>
        {/* Curtains */}
        <div className="absolute left-0 top-0 w-4 h-full"
          style={{ background: 'linear-gradient(90deg, #E88D6D, #D4623A)' }} />
        <div className="absolute right-0 top-0 w-4 h-full"
          style={{ background: 'linear-gradient(270deg, #E88D6D, #D4623A)' }} />
        {/* Sun */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-yellow-300"
          style={{ boxShadow: '0 0 20px #facc15' }} />
      </div>

      {/* Rug */}
      <div className="absolute bottom-0 left-[10%] right-[10%] h-[20%] rounded-t-[50%]"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, #C4A265 0%, #D4B876 60%, transparent 100%)',
          opacity: 0.4,
        }} />

      {/* Wardrobe */}
      <div className="absolute left-[5%] top-[20%] w-16 h-[55%] rounded-lg"
        style={{
          background: 'linear-gradient(180deg, #8B6F47, #6B5135)',
          boxShadow: '2px 2px 8px rgba(0,0,0,0.2)',
        }}>
        <div className="absolute top-1/2 right-1 w-2 h-4 bg-amber-300 rounded-full" />
      </div>

      {/* Floor */}
      <div className="absolute bottom-0 left-0 right-0 h-[15%]"
        style={{ background: 'linear-gradient(180deg, #D4A865 0%, #C49255 100%)' }} />
    </div>
  );
}

/* ── Intro overlay ── */
function IntroOverlay({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  const emojis = ['🩲', '🧦', '👕', '👖', '🧥', '👟'];
  return (
    <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex gap-2 mb-4">
        {emojis.map((e, i) => (
          <span key={i} className="text-3xl"
            style={{ animation: `pop-in 0.35s cubic-bezier(0.34,1.56,0.64,1) ${i * 80}ms both` }}>
            {e}
          </span>
        ))}
      </div>
      <h2 className="text-3xl font-heading text-white drop-shadow-lg"
          style={{ animation: 'pop-in 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.5s both' }}>
        👕 Getting Dressed!
      </h2>
      <p className="text-lg font-heading text-amber-200 mt-2 opacity-80"
         style={{ animation: 'pop-in 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.7s both' }}>
        Help Arthur get ready!
      </p>
    </div>
  );
}

/* ── Clothing item button ── */
function ClothingItem({ item, onTap, disabled, dressed, wrong }) {
  return (
    <button
      onPointerDown={() => !disabled && !dressed && onTap(item)}
      className={`relative flex flex-col items-center justify-center rounded-2xl p-3 transition-all
                  ${dressed ? 'opacity-30 scale-90' : 'active:scale-90 cursor-pointer'}
                  ${wrong ? 'animate-[wiggle_0.3s_ease-in-out]' : ''}`}
      style={{
        background: dressed
          ? '#e5e7eb'
          : `linear-gradient(135deg, ${item.color}30, ${item.color}15)`,
        border: `3px solid ${dressed ? '#d1d5db' : item.color}50`,
        boxShadow: dressed ? 'none' : `0 4px 12px ${item.color}25`,
        touchAction: 'none',
        minWidth: 80,
        minHeight: 80,
      }}
      disabled={disabled || dressed}
    >
      <span className="text-4xl">{item.emoji}</span>
      {dressed && (
        <span className="absolute top-1 right-1 text-lg">✅</span>
      )}
    </button>
  );
}

/* ── Arthur in various states of dress ── */
function ArthurDressing({ dressedItems }) {
  const count = dressedItems.length;
  const expression = count === CLOTHES.length ? 'excited' : count > 3 ? 'happy' : 'curious';

  return (
    <div className="relative flex flex-col items-center">
      <ArthurBear expression={expression} size={120} />

      {/* Show dressed items stacked on Arthur */}
      <div className="flex flex-wrap justify-center gap-1 mt-2 max-w-[160px]">
        {dressedItems.map((item, i) => (
          <span key={item.id} className="text-2xl"
            style={{ animation: `pop-in 0.4s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.1}s both` }}>
            {item.emoji}
          </span>
        ))}
      </div>

      {/* Speech bubble hint */}
      {count === 0 && (
        <div className="absolute -top-2 right-0 bg-white rounded-xl px-3 py-1.5 shadow-lg
                        text-sm font-heading text-amber-700 animate-bounce"
             style={{ animation: 'pop-in 0.5s ease-out 1s both' }}>
          What goes on first?
        </div>
      )}
    </div>
  );
}

export default function MorningRoutine() {
  const [showIntro, setShowIntro] = useState(true);
  const [dressedItems, setDressedItems] = useState([]);
  const [wrongItem, setWrongItem] = useState(null);
  const [shuffledClothes] = useState(() => shuffle(CLOTHES));
  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();
  const { celebrate, CelebrationLayer } = useCelebration();

  const nextOrder = dressedItems.length;
  const isComplete = dressedItems.length === CLOTHES.length;

  const handleTap = useCallback((item) => {
    if (item.order === nextOrder) {
      // Correct! Dress this item
      playPop();
      playSparkle();
      setDressedItems(prev => [...prev, item]);
      setWrongItem(null);

      if (item.order === CLOTHES.length - 1) {
        // All dressed!
        setTimeout(() => {
          playFanfare();
          celebrate();
          peek('excited');
        }, 400);
      } else if (item.order === 2 || item.order === 4) {
        playSuccess();
        peek('happy');
      }
    } else {
      // Wrong order — gentle wobble
      playBoing();
      setWrongItem(item.id);
      setTimeout(() => setWrongItem(null), 500);
    }
  }, [nextOrder, celebrate, peek]);

  const handlePlayAgain = useCallback(() => {
    setDressedItems([]);
    setWrongItem(null);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <BedroomScene />
      <BackButton />

      {showIntro && <IntroOverlay onDone={() => setShowIntro(false)} />}

      <div className="relative z-10 flex flex-col items-center justify-between h-full py-16 px-4">
        {/* Title */}
        <h2 className="font-heading text-amber-800/80 text-lg">
          👕 Getting Dressed
        </h2>

        {/* Arthur in the middle */}
        <ArthurDressing dressedItems={dressedItems} />

        {/* Hint about what's next */}
        {!isComplete && nextOrder > 0 && (
          <p className="text-sm font-heading text-amber-700/60 animate-pulse">
            {nextOrder === 1 ? '🧦 Now what?' :
             nextOrder === 2 ? '👕 What goes on next?' :
             nextOrder === 3 ? '👖 Nearly there!' :
             nextOrder === 4 ? '🧥 Almost dressed!' :
             '👟 Last one!'}
          </p>
        )}

        {/* Clothing choices */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
          {shuffledClothes.map(item => (
            <ClothingItem
              key={item.id}
              item={item}
              onTap={handleTap}
              disabled={isComplete}
              dressed={dressedItems.some(d => d.id === item.id)}
              wrong={wrongItem === item.id}
            />
          ))}
        </div>

        {/* Play again after completion */}
        {isComplete && (
          <button onClick={handlePlayAgain}
            className="mt-4 px-8 py-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-500
                       text-white font-heading text-lg active:scale-95 transition-transform shadow-lg"
            style={{ animation: 'pop-in 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.5s both' }}>
            Play Again! 👕
          </button>
        )}
      </div>

      <ParticleLayer />
      <ArthurPeekLayer />
      <CelebrationLayer />
    </div>
  );
}
