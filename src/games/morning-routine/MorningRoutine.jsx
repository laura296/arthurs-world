import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../../components/BackButton';
import ArthurBear from '../../components/ArthurBear';
import { playPop, playSnap, playSuccess, playBoing, playFanfare, playSparkle, playCollectPing, playTone } from '../../hooks/useSound';
import { useParticleBurst } from '../../components/ParticleBurst';
import { useArthurPeek } from '../../components/ArthurPeek';
import { useCelebration } from '../../components/CelebrationOverlay';
import { CLOTHING_SVGS } from './ClothingSVGs';

/* ── Clothing items in correct dressing order ── */
const CLOTHES = [
  { id: 'underwear', color: '#60a5fa', order: 0 },
  { id: 'socks',     color: '#f97316', order: 1 },
  { id: 'tshirt',    color: '#22c55e', order: 2 },
  { id: 'trousers',  color: '#3b82f6', order: 3 },
  { id: 'jumper',    color: '#a855f7', order: 4 },
  { id: 'shoes',     color: '#ef4444', order: 5 },
];

/* ── Weather & festive clothing ── */
const BEACH_CLOTHES = [
  { id: 'swimsuit',   color: '#0ea5e9', order: 0 },
  { id: 'sunhat',     color: '#fde68a', order: 1 },
  { id: 'sunglasses', color: '#334155', order: 2 },
  { id: 'flipflops',  color: '#f59e0b', order: 3 },
];

const SNOW_CLOTHES = [
  { id: 'socks',       color: '#f97316', order: 0 },
  { id: 'trousers',    color: '#3b82f6', order: 1 },
  { id: 'wintercoat',  color: '#dc2626', order: 2 },
  { id: 'scarf',       color: '#22c55e', order: 3 },
  { id: 'woollyhat',   color: '#3b82f6', order: 4 },
  { id: 'winterboots', color: '#78350f', order: 5 },
];

const FESTIVE_EASTER = [
  { id: 'tshirt',    color: '#22c55e', order: 0 },
  { id: 'trousers',  color: '#3b82f6', order: 1 },
  { id: 'bunnyears', color: '#f472b6', order: 2 },
  { id: 'shoes',     color: '#ef4444', order: 3 },
];

const FESTIVE_HALLOWEEN = [
  { id: 'tshirt',        color: '#22c55e', order: 0 },
  { id: 'trousers',      color: '#3b82f6', order: 1 },
  { id: 'halloweencape', color: '#581c87', order: 2 },
  { id: 'shoes',         color: '#ef4444', order: 3 },
];

const FESTIVE_CHRISTMAS = [
  { id: 'socks',           color: '#f97316', order: 0 },
  { id: 'trousers',        color: '#3b82f6', order: 1 },
  { id: 'christmasjumper', color: '#dc2626', order: 2 },
  { id: 'woollyhat',       color: '#3b82f6', order: 3 },
  { id: 'shoes',           color: '#ef4444', order: 4 },
];

/* ── Scene types ── */
const SCENE_BEDROOM = 'bedroom';
const SCENE_BEACH = 'beach';
const SCENE_SNOW = 'snow';
const SCENE_EASTER = 'easter';
const SCENE_HALLOWEEN = 'halloween';
const SCENE_CHRISTMAS = 'christmas';

/* ── Round configs (progressive difficulty then themed) ── */
const ROUNDS = [
  { clothesList: null, items: [0, 2, 5], scene: SCENE_BEDROOM },
  { clothesList: null, items: [0, 1, 2, 3, 5], scene: SCENE_BEDROOM },
  { clothesList: null, items: [0, 1, 2, 3, 4, 5], scene: SCENE_BEDROOM },
  { clothesList: BEACH_CLOTHES, items: [0, 1, 2, 3], scene: SCENE_BEACH },
  { clothesList: SNOW_CLOTHES, items: [0, 1, 2, 3, 4, 5], scene: SCENE_SNOW },
  { clothesList: FESTIVE_EASTER, items: [0, 1, 2, 3], scene: SCENE_EASTER },
  { clothesList: FESTIVE_HALLOWEEN, items: [0, 1, 2, 3], scene: SCENE_HALLOWEEN },
  { clothesList: FESTIVE_CHRISTMAS, items: [0, 1, 2, 3, 4], scene: SCENE_CHRISTMAS },
];

function getRoundClothes(roundCfg) {
  const source = roundCfg.clothesList || CLOTHES;
  return roundCfg.items.map(i => source[i]);
}

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
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, #FFF8F0 0%, #FFECD2 60%, #E8D5B8 100%)' }} />
      {/* Window with morning sun */}
      <div className="absolute top-[6%] right-[8%] w-24 h-28 rounded-t-full overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #87CEEB 0%, #FFF8DC 80%)', border: '4px solid #C4A265',
                 boxShadow: 'inset 0 0 20px rgba(255,248,240,0.5)' }}>
        <div className="absolute left-0 top-0 w-5 h-full" style={{ background: 'linear-gradient(90deg, #E88D6D, #D4623A)' }} />
        <div className="absolute right-0 top-0 w-5 h-full" style={{ background: 'linear-gradient(270deg, #E88D6D, #D4623A)' }} />
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-yellow-300"
          style={{ boxShadow: '0 0 24px #facc15' }} />
      </div>
      {/* Sunbeam */}
      <div className="absolute top-[34%] right-[2%] w-28 h-44 opacity-[0.05]"
        style={{ background: 'linear-gradient(200deg, #facc15 0%, transparent 100%)', transform: 'skewX(-12deg)' }} />
      {/* Wardrobe */}
      <div className="absolute left-[4%] top-[18%] w-18 h-[55%] rounded-lg"
        style={{ background: 'linear-gradient(180deg, #8B6F47, #6B5135)', boxShadow: '2px 2px 8px rgba(0,0,0,0.2)' }}>
        <div className="absolute top-1/2 right-1.5 w-2 h-4 bg-amber-300 rounded-full" />
        <div className="absolute top-[30%] left-2 right-2 h-0.5 bg-amber-900/20" />
        <div className="absolute top-[60%] left-2 right-2 h-0.5 bg-amber-900/20" />
      </div>
      {/* Rug */}
      <div className="absolute bottom-[15%] left-[15%] right-[15%] h-[12%] rounded-[50%]"
        style={{ background: 'radial-gradient(ellipse at 50% 100%, #C4A265 0%, #D4B876 60%, transparent 100%)', opacity: 0.35 }} />
      {/* Floor */}
      <div className="absolute bottom-0 left-0 right-0 h-[15%]"
        style={{ background: 'linear-gradient(180deg, #D4A865 0%, #C49255 100%)' }} />
      {/* Dust motes */}
      {[0,1,2].map(i => (
        <div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-amber-300/30"
          style={{ left: `${25 + i * 20}%`, top: `${20 + i * 10}%`,
                   animation: `float ${3 + i}s ease-in-out ${i * 0.7}s infinite` }} />
      ))}
    </div>
  );
}

/* ── Beach background ── */
function BeachScene() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Sky */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, #38bdf8 0%, #7dd3fc 40%, #fde68a 85%, #fbbf24 100%)' }} />
      {/* Sun */}
      <div className="absolute top-[8%] right-[12%] w-20 h-20 rounded-full bg-yellow-300"
        style={{ boxShadow: '0 0 40px #facc15, 0 0 80px rgba(250,204,21,0.3)' }} />
      {/* Sea */}
      <div className="absolute bottom-[28%] left-0 right-0 h-[20%]"
        style={{ background: 'linear-gradient(180deg, #0ea5e9 0%, #38bdf8 50%, #7dd3fc 100%)' }} />
      {/* Waves */}
      {[0,1,2].map(i => (
        <div key={i} className="absolute left-0 right-0 h-3"
          style={{ bottom: `${28 + i * 2}%`, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                   animation: `float ${4 + i}s ease-in-out ${i * 0.5}s infinite` }} />
      ))}
      {/* Sand */}
      <div className="absolute bottom-0 left-0 right-0 h-[30%]"
        style={{ background: 'linear-gradient(180deg, #fde68a 0%, #fbbf24 100%)' }} />
      {/* Sand texture dots */}
      {[0,1,2,3,4].map(i => (
        <div key={i} className="absolute w-1 h-1 rounded-full bg-amber-600/15"
          style={{ left: `${10 + i * 18}%`, bottom: `${8 + (i % 3) * 6}%` }} />
      ))}
      {/* Seashell */}
      <div className="absolute bottom-[10%] left-[15%] w-4 h-3 rounded-t-full bg-pink-200 border border-pink-300/50" />
      {/* Palm tree */}
      <div className="absolute bottom-[28%] left-[75%]">
        <div className="w-3 h-28 bg-amber-700 rounded-sm" style={{ transform: 'rotate(3deg)' }} />
        {[-30, -10, 15, 35].map((rot, i) => (
          <div key={i} className="absolute -top-2 left-1/2 w-16 h-3 bg-green-500 rounded-full origin-left"
            style={{ transform: `translateX(-2px) rotate(${rot}deg)`, opacity: 0.7 + i * 0.08 }} />
        ))}
      </div>
    </div>
  );
}

/* ── Snow background ── */
function SnowScene() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Sky */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, #94a3b8 0%, #cbd5e1 40%, #e2e8f0 80%, #f1f5f9 100%)' }} />
      {/* Distant hills */}
      <div className="absolute bottom-[30%] left-0 right-0 h-[20%]"
        style={{ background: 'radial-gradient(ellipse at 30% 100%, #e2e8f0 0%, transparent 70%), radial-gradient(ellipse at 70% 100%, #dbeafe 0%, transparent 60%)' }} />
      {/* Snow ground */}
      <div className="absolute bottom-0 left-0 right-0 h-[35%]"
        style={{ background: 'linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%)' }} />
      {/* Snow mounds */}
      <div className="absolute bottom-[30%] left-[5%] w-32 h-12 rounded-full bg-white/60" />
      <div className="absolute bottom-[28%] right-[10%] w-24 h-10 rounded-full bg-white/50" />
      {/* Snowman */}
      <div className="absolute bottom-[32%] right-[20%]">
        <div className="w-10 h-10 rounded-full bg-white border border-gray-200" style={{ boxShadow: 'inset 0 -3px 6px rgba(0,0,0,0.05)' }}>
          <div className="absolute top-2 left-2.5 w-1 h-1 rounded-full bg-gray-700" />
          <div className="absolute top-2 right-2.5 w-1 h-1 rounded-full bg-gray-700" />
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-2 h-1.5 rounded-full bg-orange-400" />
        </div>
        <div className="w-14 h-14 rounded-full bg-white border border-gray-200 -mt-2 -ml-2" style={{ boxShadow: 'inset 0 -4px 8px rgba(0,0,0,0.05)' }} />
      </div>
      {/* Bare tree */}
      <div className="absolute bottom-[32%] left-[12%]">
        <div className="w-2 h-20 bg-amber-800 rounded-sm" />
        <div className="absolute top-0 left-1 w-8 h-0.5 bg-amber-800 origin-left" style={{ transform: 'rotate(-30deg)' }} />
        <div className="absolute top-4 left-1 w-6 h-0.5 bg-amber-800 origin-left" style={{ transform: 'rotate(25deg)' }} />
      </div>
      {/* Falling snowflakes */}
      {[0,1,2,3,4,5,6].map(i => (
        <div key={i} className="absolute w-2 h-2 rounded-full bg-white"
          style={{ left: `${8 + i * 13}%`, top: `${5 + (i * 17) % 40}%`, opacity: 0.6 + (i % 3) * 0.15,
                   animation: `float ${3 + i % 3}s ease-in-out ${i * 0.4}s infinite` }} />
      ))}
    </div>
  );
}

/* ── Easter background ── */
function EasterScene() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Springtime sky */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, #93c5fd 0%, #bfdbfe 40%, #dbeafe 70%, #ecfdf5 100%)' }} />
      {/* Sun */}
      <div className="absolute top-[8%] right-[15%] w-16 h-16 rounded-full bg-yellow-200"
        style={{ boxShadow: '0 0 30px #fde68a' }} />
      {/* Rolling green hills */}
      <div className="absolute bottom-[20%] left-0 right-0 h-[30%]"
        style={{ background: 'radial-gradient(ellipse at 25% 100%, #86efac 0%, transparent 60%), radial-gradient(ellipse at 75% 100%, #4ade80 0%, transparent 50%)' }} />
      {/* Grass */}
      <div className="absolute bottom-0 left-0 right-0 h-[25%]"
        style={{ background: 'linear-gradient(180deg, #4ade80 0%, #22c55e 100%)' }} />
      {/* Flowers */}
      {[0,1,2,3,4].map(i => (
        <div key={i} className="absolute" style={{ left: `${10 + i * 20}%`, bottom: `${22 + (i % 2) * 4}%` }}>
          <div className="w-3 h-6 bg-green-600 rounded-sm" />
          <div className="w-4 h-4 rounded-full -mt-2 -ml-0.5"
            style={{ background: ['#f472b6', '#facc15', '#a78bfa', '#fb923c', '#f472b6'][i] }} />
        </div>
      ))}
      {/* Easter eggs in grass */}
      {[0,1,2].map(i => (
        <div key={i} className="absolute w-4 h-5 rounded-full"
          style={{ left: `${20 + i * 25}%`, bottom: `${18 + i}%`,
                   background: ['linear-gradient(135deg, #f472b6, #ec4899)', 'linear-gradient(135deg, #a78bfa, #8b5cf6)', 'linear-gradient(135deg, #fbbf24, #f59e0b)'][i],
                   border: '1px solid rgba(255,255,255,0.3)' }} />
      ))}
      {/* Butterfly */}
      <div className="absolute top-[25%] left-[30%]" style={{ animation: 'float 4s ease-in-out infinite' }}>
        <div className="w-3 h-2 rounded-full bg-yellow-300 border border-yellow-400" style={{ transform: 'rotate(-20deg)' }} />
        <div className="w-3 h-2 rounded-full bg-yellow-300 border border-yellow-400 -mt-1 ml-1" style={{ transform: 'rotate(20deg)' }} />
      </div>
    </div>
  );
}

/* ── Halloween background ── */
function HalloweenScene() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Twilight sky */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 30%, #4c1d95 50%, #f97316 85%, #ea580c 100%)' }} />
      {/* Moon */}
      <div className="absolute top-[8%] right-[15%] w-18 h-18 rounded-full bg-amber-100"
        style={{ boxShadow: '0 0 30px rgba(251,191,36,0.4)' }}>
        <div className="absolute top-2 left-3 w-3 h-3 rounded-full bg-amber-200/30" />
        <div className="absolute bottom-3 right-2 w-2 h-2 rounded-full bg-amber-200/20" />
      </div>
      {/* Stars */}
      {[0,1,2,3,4].map(i => (
        <div key={i} className="absolute w-1 h-1 rounded-full bg-white"
          style={{ left: `${10 + i * 18}%`, top: `${8 + (i * 13) % 25}%`, opacity: 0.4 + (i % 3) * 0.2,
                   animation: `pulse ${2 + i % 2}s ease-in-out ${i * 0.3}s infinite` }} />
      ))}
      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-[18%]"
        style={{ background: 'linear-gradient(180deg, #1c1917 0%, #0c0a09 100%)' }} />
      {/* Pumpkin */}
      <div className="absolute bottom-[16%] left-[20%]">
        <div className="w-10 h-8 rounded-full bg-orange-500 border border-orange-600">
          <div className="absolute top-1.5 left-2 w-1.5 h-1.5 bg-yellow-300" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
          <div className="absolute top-1.5 right-2 w-1.5 h-1.5 bg-yellow-300" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-1.5 bg-yellow-300 rounded-b-full" />
        </div>
        <div className="w-1.5 h-3 bg-green-700 rounded-t-full mx-auto -mt-1" />
      </div>
      {/* Bats */}
      {[0,1].map(i => (
        <div key={i} className="absolute text-gray-900 text-lg"
          style={{ left: `${40 + i * 25}%`, top: `${15 + i * 8}%`, animation: `float ${3 + i}s ease-in-out ${i}s infinite` }}>
          🦇
        </div>
      ))}
    </div>
  );
}

/* ── Christmas background ── */
function ChristmasScene() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Night sky */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, #1e3a5f 0%, #2d4a7a 40%, #3b5998 70%, #e2e8f0 100%)' }} />
      {/* Stars */}
      {[0,1,2,3,4,5].map(i => (
        <div key={i} className="absolute w-1 h-1 rounded-full bg-white"
          style={{ left: `${5 + i * 16}%`, top: `${5 + (i * 11) % 30}%`, opacity: 0.5 + (i % 3) * 0.2 }} />
      ))}
      {/* Snow ground */}
      <div className="absolute bottom-0 left-0 right-0 h-[30%]"
        style={{ background: 'linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%)' }} />
      {/* Snow mound */}
      <div className="absolute bottom-[26%] left-[10%] w-40 h-10 rounded-full bg-white/50" />
      {/* Christmas tree */}
      <div className="absolute bottom-[28%] right-[15%]">
        <div className="w-0 h-0 border-l-[16px] border-r-[16px] border-b-[20px] border-transparent border-b-green-700 -mb-2" />
        <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-b-[24px] border-transparent border-b-green-600 -ml-1 -mb-2" />
        <div className="w-0 h-0 border-l-[24px] border-r-[24px] border-b-[28px] border-transparent border-b-green-500 -ml-2" />
        <div className="w-4 h-6 bg-amber-800 mx-auto" />
        {/* Star topper */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-3 h-3 bg-yellow-300 rounded-sm"
          style={{ transform: 'translateX(-50%) rotate(45deg)', boxShadow: '0 0 8px #facc15' }} />
        {/* Baubles */}
        <div className="absolute top-5 left-2 w-2 h-2 rounded-full bg-red-500" />
        <div className="absolute top-9 right-3 w-2 h-2 rounded-full bg-blue-400" />
        <div className="absolute top-7 left-5 w-2 h-2 rounded-full bg-yellow-400" />
      </div>
      {/* Snowflakes falling */}
      {[0,1,2,3,4,5].map(i => (
        <div key={i} className="absolute w-2 h-2 rounded-full bg-white"
          style={{ left: `${5 + i * 15}%`, top: `${5 + (i * 19) % 45}%`, opacity: 0.5 + (i % 3) * 0.15,
                   animation: `float ${3 + i % 3}s ease-in-out ${i * 0.3}s infinite` }} />
      ))}
      {/* Presents */}
      <div className="absolute bottom-[28%] left-[25%]">
        <div className="w-6 h-5 bg-red-500 rounded-sm border border-red-600" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-yellow-300" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-yellow-300 mt-2" />
      </div>
    </div>
  );
}

/* ── Scene picker ── */
const SCENE_COMPONENTS = {
  bedroom: BedroomScene,
  beach: BeachScene,
  snow: SnowScene,
  easter: EasterScene,
  halloween: HalloweenScene,
  christmas: ChristmasScene,
};

/* ── Scene emoji icons for intro ── */
const SCENE_ICONS = {
  bedroom: '🏠',
  beach: '🏖️',
  snow: '⛄',
  easter: '🐰',
  halloween: '🎃',
  christmas: '🎄',
};

/* ── Intro overlay ── */
function IntroOverlay({ items, scene, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [onDone]);

  const icon = SCENE_ICONS[scene];
  const isThemed = scene !== 'bedroom';

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      {/* Scene icon for themed rounds */}
      {isThemed && (
        <motion.div
          initial={{ scale: 0, y: -20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          className="text-5xl mb-2"
        >
          {icon}
        </motion.div>
      )}
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15, delay: isThemed ? 0.15 : 0 }}>
        <ArthurBear expression="curious" size={100} />
      </motion.div>
      <div className="flex gap-2 mt-4">
        {items.map((item, i) => {
          const SVG = CLOTHING_SVGS[item.id];
          return (
            <motion.div key={item.id} className="w-10 h-10"
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15, delay: (isThemed ? 0.4 : 0.3) + i * 0.1 }}>
              <SVG />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ── Draggable clothing item ── */
function DraggableClothing({ item, dressed, isNext, onDragEnd, onTap, wrongWobble, index }) {
  const SVG = CLOTHING_SVGS[item.id];
  const dragRef = useRef({ startX: 0, startY: 0, dragging: false });
  const elRef = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = useCallback((e) => {
    if (dressed) return;
    e.preventDefault();
    e.target.setPointerCapture?.(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, dragging: false };
    setIsDragging(true);
  }, [dressed]);

  const handlePointerMove = useCallback((e) => {
    if (!isDragging || dressed) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) dragRef.current.dragging = true;
    setPos({ x: dx, y: dy });
  }, [isDragging, dressed]);

  const handlePointerUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragRef.current.dragging) {
      const el = elRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        onDragEnd(item, rect.left + rect.width / 2, rect.top + rect.height / 2);
      }
    } else {
      onTap(item);
    }
    setPos({ x: 0, y: 0 });
  }, [isDragging, item, onDragEnd, onTap]);

  if (dressed) return <div className="w-20 h-20 opacity-20 flex items-center justify-center p-2 rounded-2xl bg-gray-200/30"><SVG /></div>;

  return (
    <motion.div
      ref={elRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      animate={{
        x: isDragging ? pos.x : wrongWobble ? [0, -10, 10, -6, 6, 0] : 0,
        y: isDragging ? pos.y : 0,
        scale: isDragging ? 1.15 : 1,
        rotate: isDragging ? [-2, 2] : wrongWobble ? [0, 6, -6, 3, -3, 0] : 0,
      }}
      transition={isDragging ? { type: 'tween', duration: 0 } : { type: 'spring', stiffness: 300, damping: 15 }}
      className="relative touch-none select-none"
      style={{
        zIndex: isDragging ? 50 : 1,
        filter: isDragging ? 'drop-shadow(0 8px 16px rgba(0,0,0,0.2))' : 'none',
      }}
    >
      <div className="w-20 h-20 rounded-2xl flex items-center justify-center p-2"
        style={{
          background: `linear-gradient(135deg, ${item.color}20, ${item.color}08)`,
          border: `3px solid ${item.color}50`,
          boxShadow: `0 4px 12px ${item.color}15`,
        }}>
        <SVG />
      </div>
      {/* Pulse glow on next-in-order item */}
      {isNext && !isDragging && (
        <motion.div
          className="absolute inset-[-4px] rounded-2xl pointer-events-none"
          animate={{ boxShadow: ['0 0 0px #facc15', '0 0 16px #facc15', '0 0 0px #facc15'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </motion.div>
  );
}

/* ── Arthur's body showing dressed items ── */
function ArthurDressing({ dressedItems, allItems }) {
  const count = dressedItems.length;
  const total = allItems.length;
  const expression = count === total ? 'excited' : count > total / 2 ? 'happy' : 'curious';

  return (
    <div className="relative flex flex-col items-center">
      <ArthurBear expression={expression} size={100} />
      {/* Dressed items displayed below bear */}
      <div className="flex flex-wrap justify-center gap-1 mt-1 max-w-[180px]">
        {dressedItems.map((item, i) => {
          const SVG = CLOTHING_SVGS[item.id];
          return (
            <motion.div key={item.id} className="w-8 h-8"
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 12 }}>
              <SVG />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Main component ── */
export default function MorningRoutine() {
  const [showIntro, setShowIntro] = useState(true);
  const [round, setRound] = useState(0);
  const roundCfg = ROUNDS[Math.min(round, ROUNDS.length - 1)];
  const [shuffledItems, setShuffledItems] = useState(() => shuffle(getRoundClothes(roundCfg)));
  const [dressedItems, setDressedItems] = useState([]);
  const [wrongItem, setWrongItem] = useState(null);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const bearRef = useRef(null);
  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();
  const { celebrate, CelebrationLayer } = useCelebration();

  const currentItems = getRoundClothes(roundCfg);
  const currentScene = roundCfg.scene;
  const nextOrder = dressedItems.length;
  const nextItem = currentItems[nextOrder];
  const isComplete = dressedItems.length === currentItems.length;

  const SceneComponent = SCENE_COMPONENTS[currentScene] || BedroomScene;

  // Reset when round changes
  useEffect(() => {
    const cfg = ROUNDS[Math.min(round, ROUNDS.length - 1)];
    setShuffledItems(shuffle(getRoundClothes(cfg)));
    setDressedItems([]);
    setWrongItem(null);
    setWrongAttempts(0);
    setShowIntro(true);
  }, [round]);

  const playDressTone = useCallback((count) => {
    const tones = [523, 587, 659, 698, 784, 880];
    playTone(tones[Math.min(count, tones.length - 1)], 0.15);
  }, []);

  const dressItem = useCallback((item, x, y) => {
    if (isComplete) return;

    if (item.id === nextItem?.id) {
      playSnap();
      playSparkle();
      playDressTone(nextOrder);
      setDressedItems(prev => [...prev, item]);
      setWrongItem(null);
      burst(x, y, { count: 10, colors: ['#facc15', item.color, '#fff'], spread: 60 });

      const newCount = nextOrder + 1;
      if (newCount === currentItems.length) {
        setTimeout(() => {
          playFanfare();
          celebrate();
          peek('excited');
        }, 400);
      } else if (newCount === Math.ceil(currentItems.length / 2)) {
        playSuccess();
        peek('happy');
      }
    } else {
      playBoing();
      setWrongItem(item.id);
      setWrongAttempts(prev => prev + 1);
      setTimeout(() => setWrongItem(null), 500);
    }
  }, [isComplete, nextItem, nextOrder, currentItems.length, burst, celebrate, peek, playDressTone]);

  const handleDragEnd = useCallback((item, x, y) => {
    const bearRect = bearRef.current?.getBoundingClientRect();
    if (bearRect && y < bearRect.bottom + 40 && y > bearRect.top - 40 && x > bearRect.left - 40 && x < bearRect.right + 40) {
      dressItem(item, x, y);
    } else {
      playPop();
    }
  }, [dressItem]);

  const handleTap = useCallback((item) => {
    if (isComplete) return;
    const bearRect = bearRef.current?.getBoundingClientRect();
    const cx = bearRect ? bearRect.left + bearRect.width / 2 : 160;
    const cy = bearRect ? bearRect.top + bearRect.height / 2 : 200;
    dressItem(item, cx, cy);
  }, [isComplete, dressItem]);

  const handleNextRound = useCallback(() => setRound(r => r + 1), []);
  const handlePlayAgain = useCallback(() => setRound(0), []);

  const stars = wrongAttempts === 0 ? 3 : wrongAttempts <= 2 ? 2 : 1;

  return (
    <div className="relative w-full h-full overflow-hidden">
      <SceneComponent />
      <BackButton />

      <AnimatePresence>
        {showIntro && <IntroOverlay items={currentItems} scene={currentScene} onDone={() => setShowIntro(false)} />}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col items-center justify-between h-full py-14 px-4">
        {/* Arthur in the middle — drop zone */}
        <div ref={bearRef}>
          <ArthurDressing dressedItems={dressedItems} allItems={currentItems} />
        </div>

        {/* Progress dots */}
        {!isComplete && dressedItems.length > 0 && (
          <div className="flex gap-1.5">
            {currentItems.map((item, i) => (
              <motion.div key={item.id}
                className={`w-3 h-3 rounded-full ${i < dressedItems.length ? 'bg-sun' : 'bg-amber-200/40'}`}
                animate={i < dressedItems.length ? { scale: [1, 1.2, 1] } : { opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
                style={i < dressedItems.length ? { boxShadow: '0 0 6px #facc15' } : {}}
              />
            ))}
          </div>
        )}

        {/* Round indicator — scene icon + dots */}
        <div className="flex items-center gap-1.5">
          <span className="text-sm opacity-70">{SCENE_ICONS[currentScene]}</span>
          {ROUNDS.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300
              ${i === round ? 'bg-sun scale-125' : i < round ? 'bg-sun/60 scale-100' : 'bg-amber-200/30'}`}
              style={i <= round ? { boxShadow: '0 0 4px rgba(250,204,21,0.4)' } : {}} />
          ))}
        </div>

        {/* Clothing choices */}
        {!isComplete && (
          <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
            {shuffledItems.map((item, i) => (
              <div key={item.id} className="flex justify-center">
                <DraggableClothing
                  item={item}
                  index={i}
                  dressed={dressedItems.some(d => d.id === item.id)}
                  isNext={item.id === nextItem?.id}
                  onDragEnd={handleDragEnd}
                  onTap={handleTap}
                  wrongWobble={wrongItem === item.id}
                />
              </div>
            ))}
          </div>
        )}

        {/* Completion */}
        {isComplete && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-3">
            <div className="flex gap-2">
              {[1,2,3].map(s => (
                <motion.div key={s}
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: s <= stars ? 1 : 0.5, rotate: 0, opacity: s <= stars ? 1 : 0.2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 12, delay: 0.3 + s * 0.15 }}>
                  <svg width="32" height="32" viewBox="0 0 20 20" fill={s <= stars ? '#facc15' : '#94a3b8'}>
                    <path d="M10 0l2.4 7.2H20l-6 4.8 2.4 7.2L10 14.4 3.6 19.2 6 12 0 7.2h7.6z" />
                  </svg>
                </motion.div>
              ))}
            </div>
            <div className="flex gap-3">
              {round < ROUNDS.length - 1 && (
                <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.5 }}
                  onClick={handleNextRound}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-sun to-amber-500 flex items-center justify-center shadow-xl">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="#1c1917"><path d="M5 3l14 9-14 9V3z" /></svg>
                </motion.button>
              )}
              <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.65 }}
                onClick={handlePlayAgain}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-xl">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M1 4v6h6" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>

      <ParticleLayer />
      <ArthurPeekLayer />
      <CelebrationLayer />
    </div>
  );
}
