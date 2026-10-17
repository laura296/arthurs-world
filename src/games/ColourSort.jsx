import { useState, useCallback, useEffect, useRef } from 'react';
import BackButton from '../components/BackButton';
import LevelSelect from '../components/LevelSelect';
import { playPop, playSuccess, playBoing, playSparkle, playFanfare, playCollectPing } from '../hooks/useSound';
import { useParticleBurst } from '../components/ParticleBurst';
import { useArthurPeek } from '../components/ArthurPeek';
import { useCelebration } from '../components/CelebrationOverlay';
import { useLevelProgression } from '../hooks/useLevelProgression';

/* ── Colour definitions ── */
const COLOURS = [
  { id: 'red',    fill: '#ef4444', light: '#fca5a5', label: '🔴' },
  { id: 'blue',   fill: '#3b82f6', light: '#93c5fd', label: '🔵' },
  { id: 'green',  fill: '#22c55e', light: '#86efac', label: '🟢' },
  { id: 'yellow', fill: '#eab308', light: '#fde68a', label: '🟡' },
  { id: 'purple', fill: '#a855f7', light: '#d8b4fe', label: '🟣' },
  { id: 'orange', fill: '#f97316', light: '#fdba74', label: '🟠' },
];

/* ── Items to sort ── */
const ITEM_SHAPES = ['⭐', '❤️', '🔶', '🌸', '🎈', '🍎', '🦋', '🐟', '🍓', '🌺', '🌻', '🍄'];

/* ── Level definitions — 8 levels ── */
const LEVELS = [
  { id: 1, label: '🔴', colours: 2, items: 6,  title: '2 Colours' },
  { id: 2, label: '🟢', colours: 3, items: 8,  title: '3 Colours' },
  { id: 3, label: '🔵', colours: 3, items: 10, title: 'More Items' },
  { id: 4, label: '🟡', colours: 4, items: 10, title: '4 Colours' },
  { id: 5, label: '🟣', colours: 4, items: 12, title: 'Getting Harder' },
  { id: 6, label: '🟠', colours: 5, items: 14, title: '5 Colours' },
  { id: 7, label: '⭐', colours: 5, items: 16, title: 'Speed Sort' },
  { id: 8, label: '🏆', colours: 6, items: 18, title: 'All Colours!' },
];

const LEVEL_LABELS = LEVELS.map(l => l.label);

/* ── backward compat ── */
const ROUNDS = LEVELS;

let uidCounter = 0;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateItems(roundIdx, levelOverride) {
  const config = levelOverride || ROUNDS[Math.min(roundIdx, ROUNDS.length - 1)];
  const roundColours = COLOURS.slice(0, config.colours);
  const items = [];
  // Ensure at least 2 of each colour
  for (const c of roundColours) {
    items.push({ colour: c, shape: ITEM_SHAPES[Math.floor(Math.random() * ITEM_SHAPES.length)] });
    items.push({ colour: c, shape: ITEM_SHAPES[Math.floor(Math.random() * ITEM_SHAPES.length)] });
  }
  // Fill remaining with random
  while (items.length < config.items) {
    const c = roundColours[Math.floor(Math.random() * roundColours.length)];
    items.push({ colour: c, shape: ITEM_SHAPES[Math.floor(Math.random() * ITEM_SHAPES.length)] });
  }
  return shuffle(items).map((item, i) => ({
    ...item,
    id: ++uidCounter,
    sorted: false,
    wrong: false,
  }));
}

/* ── Background scene ── */
function SortingRoomScene() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Warm room background */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, #FFF8F0 0%, #FFF5E6 60%, #E8D5B8 100%)' }} />

      {/* Wall pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 48px, #C4A265 48px, #C4A265 50px)',
        }} />

      {/* Shelf at top */}
      <div className="absolute left-[5%] right-[5%] top-[6%] h-2"
        style={{
          background: 'linear-gradient(180deg, #D4A865, #C4A265)',
          borderRadius: '2px',
          boxShadow: '0 2px 4px rgba(196,162,101,0.3)',
        }} />

      {/* Toys on shelf */}
      {['🧸', '🎲', '🪀', '🧩'].map((toy, i) => (
        <div key={i} className="absolute" style={{
          left: `${15 + i * 22}%`,
          top: 'calc(6% - 6px)',
          fontSize: 20,
          transform: `translateY(-100%) rotate(${(i * 11 - 15) % 20}deg)`,
          opacity: 0.5,
        }}>
          {toy}
        </div>
      ))}

      {/* Baseboard */}
      <div className="absolute left-0 right-0 bottom-[30%] h-2"
        style={{ background: '#C4A265', opacity: 0.4 }} />

      {/* Floor */}
      <div className="absolute left-0 right-0 bottom-0 h-[30%]"
        style={{ background: 'linear-gradient(180deg, #E8D5B8, #D4C0A0)' }} />

      {/* Rug */}
      <div className="absolute left-[10%] right-[10%] bottom-[2%] h-[25%] rounded-[50%]"
        style={{
          background: 'radial-gradient(ellipse, rgba(196,162,101,0.15) 0%, transparent 70%)',
        }} />

      {/* Bunting */}
      <svg className="absolute left-0 right-0 top-0" height="30" viewBox="0 0 800 30" preserveAspectRatio="none" style={{ opacity: 0.35 }}>
        <path d="M0 6 Q400 -3 800 6" stroke="#C4A265" strokeWidth="1.5" fill="none" />
        {Array.from({ length: 14 }, (_, i) => {
          const x = 20 + i * 55;
          const colors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7', '#f97316'];
          return <polygon key={i} points={`${x - 8},6 ${x + 8},6 ${x},22`} fill={colors[i % colors.length]} opacity="0.5" />;
        })}
      </svg>
    </div>
  );
}

/* ── Colour bucket ── */
function Bucket({ colour, isTarget, onTap, sortedCount }) {
  return (
    <button
      onPointerDown={() => onTap(colour.id)}
      className={`relative flex flex-col items-center gap-1 transition-all duration-200 cursor-pointer
        ${isTarget ? 'scale-110' : 'active:scale-95'}`}
      style={{ touchAction: 'none' }}
    >
      {/* Bucket SVG */}
      <svg width="64" height="56" viewBox="0 0 64 56">
        <defs>
          <linearGradient id={`bucket-${colour.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colour.light} />
            <stop offset="100%" stopColor={colour.fill} />
          </linearGradient>
        </defs>
        {/* Bucket body — trapezoid */}
        <path d="M8 16 L4 52 Q4 56 8 56 L56 56 Q60 56 60 52 L56 16 Z"
          fill={`url(#bucket-${colour.id})`}
          stroke={colour.fill}
          strokeWidth="2"
        />
        {/* Bucket rim */}
        <rect x="4" y="12" width="56" height="8" rx="4" fill={colour.fill} />
        {/* Shine */}
        <rect x="12" y="20" width="8" height="24" rx="4" fill="white" opacity="0.2" />
        {/* Handle */}
        <path d="M20 8 Q32 -4 44 8" stroke={colour.fill} strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>

      {/* Count badge */}
      {sortedCount > 0 && (
        <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white shadow-md
                        flex items-center justify-center border-2"
          style={{ borderColor: colour.fill }}
        >
          <span className="text-sm font-heading" style={{ color: colour.fill }}>{sortedCount}</span>
        </div>
      )}

      {/* Glow when targeted */}
      {isTarget && (
        <div className="absolute inset-0 rounded-2xl"
          style={{
            background: `radial-gradient(circle, ${colour.fill}30 0%, transparent 70%)`,
            animation: 'hint-glow 1s ease-in-out infinite',
          }}
        />
      )}
    </button>
  );
}

/* ── Item card to sort ── */
function SortItem({ item, isSelected, onTap, isLeaving }) {
  return (
    <button
      onPointerDown={() => onTap(item.id)}
      className={`relative rounded-2xl border-4 flex items-center justify-center
        transition-all duration-200 cursor-pointer
        ${isSelected
          ? 'scale-110 ring-4 ring-white shadow-xl z-10'
          : isLeaving
            ? 'scale-0 opacity-0'
            : 'active:scale-95'
        }
        ${item.wrong ? 'animate-wiggle' : ''}`}
      style={{
        width: 72,
        height: 72,
        background: `linear-gradient(135deg, ${item.colour.light}, ${item.colour.fill}40)`,
        borderColor: isSelected ? item.colour.fill : `${item.colour.fill}80`,
        boxShadow: isSelected
          ? `0 0 20px ${item.colour.fill}60`
          : `0 4px 8px rgba(0,0,0,0.1)`,
        touchAction: 'none',
      }}
    >
      <span className="text-3xl" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}>
        {item.shape}
      </span>
      {/* Colour dot indicator */}
      <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white/80"
        style={{ background: item.colour.fill }} />
    </button>
  );
}

/* ── Single level component ── */
function ColourSortLevel({ levelConfig, onComplete, onBack }) {
  const [items, setItems] = useState(() => generateItems(0, levelConfig));
  const [selectedId, setSelectedId] = useState(null);
  const [leavingId, setLeavingId] = useState(null);
  const [phase, setPhase] = useState('playing');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [sortedCounts, setSortedCounts] = useState({});

  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();
  const { celebrate, CelebrationLayer } = useCelebration();

  const roundColours = COLOURS.slice(0, levelConfig.colours);
  const unsortedItems = items.filter(i => !i.sorted);
  const selectedItem = items.find(i => i.id === selectedId);

  // Check level completion
  useEffect(() => {
    if (phase !== 'playing') return;
    if (items.length > 0 && unsortedItems.length === 0) {
      setPhase('won');
      playFanfare();
      const starsEarned = mistakes === 0 ? 3 : mistakes <= 3 ? 2 : 1;
      celebrate({ duration: 3000 });
      peek('excited');
      setTimeout(() => onComplete(starsEarned), 3200);
    }
  }, [unsortedItems.length, items.length, phase]);

  const tapItem = useCallback((id) => {
    if (phase !== 'playing') return;
    setSelectedId(prev => prev === id ? null : id);
    playPop();
  }, [phase]);

  const tapBucket = useCallback((colourId) => {
    if (phase !== 'playing' || !selectedItem) return;

    if (selectedItem.colour.id === colourId) {
      playSuccess();
      const newStreak = streak + 1;
      setStreak(newStreak);
      const bonus = newStreak >= 3 ? 5 : 0;
      setScore(s => s + 10 + bonus);
      if (bonus > 0) playCollectPing();

      setLeavingId(selectedItem.id);
      setSortedCounts(prev => ({ ...prev, [colourId]: (prev[colourId] || 0) + 1 }));

      burst(window.innerWidth / 2, window.innerHeight * 0.75, {
        count: 10, spread: 50,
        colors: [selectedItem.colour.fill, selectedItem.colour.light, '#facc15'],
        shapes: ['star', 'circle'],
      });

      if (newStreak === 3) peek('happy');
      if (newStreak === 5) peek('excited');

      setTimeout(() => {
        setItems(prev => prev.map(i => i.id === selectedItem.id ? { ...i, sorted: true } : i));
        setSelectedId(null);
        setLeavingId(null);
      }, 300);
    } else {
      playBoing();
      setStreak(0);
      setMistakes(m => m + 1);
      setItems(prev => prev.map(i => i.id === selectedItem.id ? { ...i, wrong: true } : i));
      setTimeout(() => {
        setItems(prev => prev.map(i => i.id === selectedItem.id ? { ...i, wrong: false } : i));
      }, 400);
    }
  }, [phase, selectedItem, streak, burst, peek]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <SortingRoomScene />

      <button onPointerDown={onBack}
        className="fixed top-3 left-3 z-50 w-14 h-14 rounded-full bg-white/20 backdrop-blur-md
                   flex items-center justify-center border border-white/30 active:scale-90 transition-transform"
        style={{ touchAction: 'none' }}>
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <path d="M15 18l-6-6 6-6" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="absolute top-4 right-4 z-30 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2
                      shadow-lg border-2 border-amber-200/60 flex items-center gap-2">
        <span className="text-lg font-heading text-amber-800">⭐ {score}</span>
        {streak >= 3 && <span className="text-lg animate-bounce">🔥{streak}</span>}
      </div>

      <div className="absolute top-4 left-20 z-30 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2
                      shadow-lg border-2 border-amber-200/60">
        <span className="text-lg font-heading text-amber-800">{levelConfig.label} {levelConfig.title}</span>
      </div>

      {!selectedId && unsortedItems.length > 0 && (
        <div className="absolute top-16 left-0 right-0 flex justify-center z-20">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl px-4 py-1 shadow border border-amber-200/40">
            <span className="text-base font-heading text-amber-700">Tap an item, then tap its bucket!</span>
          </div>
        </div>
      )}

      <div className="absolute top-24 left-0 right-0 z-10 flex flex-wrap gap-2 justify-center px-4"
        style={{ maxHeight: '45%', overflowY: 'auto' }}>
        {unsortedItems.map((item) => (
          <SortItem key={item.id} item={item}
            isSelected={selectedId === item.id}
            isLeaving={leavingId === item.id}
            onTap={tapItem} />
        ))}
      </div>

      {unsortedItems.length > 0 && (
        <div className="absolute z-20 left-0 right-0 flex justify-center" style={{ bottom: '32%' }}>
          <div className="bg-white/60 backdrop-blur-sm rounded-full px-3 py-1 shadow">
            <span className="text-sm font-heading text-amber-700">{unsortedItems.length} left</span>
          </div>
        </div>
      )}

      <div className="absolute bottom-8 left-0 right-0 z-20 flex gap-3 items-end justify-center px-4">
        {roundColours.map(colour => (
          <Bucket key={colour.id} colour={colour}
            isTarget={selectedItem?.colour.id === colour.id}
            onTap={tapBucket}
            sortedCount={sortedCounts[colour.id] || 0} />
        ))}
      </div>

      {phase === 'won' && (
        <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
          <div className="flex gap-3">
            {[0, 1, 2].map(i => (
              <svg key={i} width={52} height={52} viewBox="0 0 22 22"
                style={{ animationDelay: `${i * 150}ms` }} className="animate-spin-slow drop-shadow-lg">
                <polygon points="11,1 14,8 21,8 15.5,13 17.5,20 11,16 4.5,20 6.5,13 1,8 8,8"
                  fill="#eab308" stroke="#ca8a04" strokeWidth={1} />
              </svg>
            ))}
          </div>
        </div>
      )}

      <ParticleLayer />
      <ArthurPeekLayer />
      <CelebrationLayer />
    </div>
  );
}

/* ── Main export with level selection ── */
export default function ColourSort() {
  const {
    currentLevel, stars, highestUnlocked, totalLevels,
    setLevel, completeLevel, backToLevels,
  } = useLevelProgression('colour-sort', LEVELS.length);

  const handleComplete = useCallback((starsEarned) => {
    completeLevel(currentLevel, starsEarned);
    if (currentLevel >= totalLevels) {
      backToLevels();
    }
  }, [currentLevel, totalLevels, completeLevel, backToLevels]);

  if (currentLevel === null) {
    return (
      <LevelSelect
        title="🎨 Colour Sort"
        totalLevels={totalLevels}
        highestUnlocked={highestUnlocked}
        stars={stars}
        onSelect={setLevel}
        bg="linear-gradient(180deg, #FFF8F0 0%, #E8D5B8 100%)"
        levelLabels={LEVEL_LABELS}
      />
    );
  }

  const levelConfig = LEVELS[currentLevel - 1];
  return (
    <ColourSortLevel
      key={currentLevel}
      levelConfig={levelConfig}
      onComplete={handleComplete}
      onBack={backToLevels}
    />
  );
}
