import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../../components/BackButton';
import { useParticleBurst } from '../../components/ParticleBurst';
import { useCelebration } from '../../components/CelebrationOverlay';
import { playPop, playSuccess, playBoing, playSparkle, playCollectPing, playTone } from '../../hooks/useSound';

const COLORS = ['#f9a8d4', '#c4b5fd', '#86efac', '#fde68a', '#93c5fd', '#fdba74'];
const PATTERNS = ['solid', 'spots', 'stripes', 'zigzag', 'stars'];

const INITIAL_BANDS = () => [
  { color: '#ffffff', pattern: 'solid' },
  { color: '#ffffff', pattern: 'solid' },
  { color: '#ffffff', pattern: 'solid' },
];

/** Render pattern fill inside a band */
function PatternFill({ pattern, color, y, height, clipId }) {
  const w = 180;
  if (pattern === 'solid') return null;

  const elements = [];
  if (pattern === 'spots') {
    const rows = Math.floor(height / 28);
    for (let r = 0; r < rows; r++) {
      const cols = r % 2 === 0 ? 3 : 2;
      const offsetX = r % 2 === 0 ? 30 : 50;
      for (let c = 0; c < cols; c++) {
        elements.push(
          <circle
            key={`${r}-${c}`}
            cx={offsetX + c * 45}
            cy={y + 16 + r * 28}
            r={8}
            fill="rgba(255,255,255,0.45)"
          />
        );
      }
    }
  } else if (pattern === 'stripes') {
    const count = Math.floor(height / 16);
    for (let i = 0; i < count; i++) {
      elements.push(
        <rect
          key={i}
          x={10}
          y={y + 4 + i * 16}
          width={w - 20}
          height={6}
          rx={3}
          fill="rgba(255,255,255,0.4)"
        />
      );
    }
  } else if (pattern === 'zigzag') {
    const step = 20;
    const amp = 10;
    let d = `M 10 ${y + 12}`;
    for (let x = 10; x < w - 10; x += step) {
      const yOff = ((x / step) % 2 === 0) ? -amp : amp;
      d += ` L ${x + step / 2} ${y + 12 + yOff} L ${x + step} ${y + 12}`;
    }
    const rows = Math.floor(height / 26);
    for (let r = 0; r < rows; r++) {
      const shift = r * 26;
      elements.push(
        <path
          key={r}
          d={d.replace(new RegExp(`${y + 12}`, 'g'), String(y + 12 + shift))}
          fill="none"
          stroke="rgba(255,255,255,0.45)"
          strokeWidth={4}
          strokeLinecap="round"
        />
      );
    }
  } else if (pattern === 'stars') {
    const starPath = (cx, cy, r) => {
      let d = '';
      for (let i = 0; i < 5; i++) {
        const angle = (i * 72 - 90) * Math.PI / 180;
        const inner = (i * 72 + 36 - 90) * Math.PI / 180;
        d += `${i === 0 ? 'M' : 'L'} ${cx + r * Math.cos(angle)} ${cy + r * Math.sin(angle)} `;
        d += `L ${cx + r * 0.4 * Math.cos(inner)} ${cy + r * 0.4 * Math.sin(inner)} `;
      }
      return d + 'Z';
    };
    const rows = Math.floor(height / 30);
    for (let r = 0; r < rows; r++) {
      const cols = r % 2 === 0 ? 3 : 2;
      const offsetX = r % 2 === 0 ? 30 : 55;
      for (let c = 0; c < cols; c++) {
        elements.push(
          <path
            key={`${r}-${c}`}
            d={starPath(offsetX + c * 50, y + 16 + r * 30, 9)}
            fill="rgba(255,255,255,0.45)"
          />
        );
      }
    }
  }

  return <g clipPath={`url(#${clipId})`}>{elements}</g>;
}

/** Floating petal decoration */
function FloatingPetals() {
  const petals = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    left: `${10 + Math.random() * 80}%`,
    delay: Math.random() * 6,
    duration: 8 + Math.random() * 6,
    size: 10 + Math.random() * 10,
    color: COLORS[i % COLORS.length],
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full opacity-40"
          style={{
            left: p.left,
            top: -20,
            width: p.size,
            height: p.size * 1.4,
            backgroundColor: p.color,
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
          }}
          animate={{
            y: ['0vh', '105vh'],
            x: [0, Math.sin(p.id) * 40, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

/**
 * PaintEasterEggs — Easter egg decorating game.
 * Tap colours, tap egg bands to paint patterns. Tap star to celebrate and start fresh.
 */
export default function PaintEasterEggs() {
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [bands, setBands] = useState(INITIAL_BANDS);
  const [eggCount, setEggCount] = useState(0);
  const [eggKey, setEggKey] = useState(0);
  const { burst, ParticleLayer } = useParticleBurst();
  const { celebrate, CelebrationOverlay } = useCelebration();

  const handleColorSelect = useCallback((color) => {
    setSelectedColor(color);
    playPop();
  }, []);

  const handleBandTap = useCallback((index, e) => {
    setBands((prev) => {
      const next = [...prev];
      const band = { ...next[index] };
      const patIdx = PATTERNS.indexOf(band.pattern);
      band.pattern = PATTERNS[(patIdx + 1) % PATTERNS.length];
      band.color = selectedColor;
      next[index] = band;
      return next;
    });
    playTone(300 + index * 120, 0.12, 'triangle');
    playCollectPing();
    const rect = e.currentTarget.getBoundingClientRect();
    burst(rect.left + rect.width / 2, rect.top + rect.height / 2, {
      colors: [selectedColor, '#ffffff'],
      count: 6,
    });
  }, [selectedColor, burst]);

  const handleFinish = useCallback(() => {
    playSuccess();
    playSparkle();
    celebrate();
    setEggCount((c) => c + 1);
    setTimeout(() => {
      setBands(INITIAL_BANDS());
      setEggKey((k) => k + 1);
      playBoing();
    }, 1800);
  }, [celebrate]);

  const eggH = 260;
  const eggW = 180;
  const bandH = eggH / 3;

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-pink-100 via-yellow-50 to-green-100 overflow-hidden">
      <BackButton />
      <ParticleLayer />
      <CelebrationOverlay />
      <FloatingPetals />

      {/* Egg counter */}
      {eggCount > 0 && (
        <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/60 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-md">
          <span className="text-2xl">🥚</span>
          <span className="text-xl font-heading text-amber-600">{eggCount}</span>
        </div>
      )}

      {/* Egg */}
      <div className="flex items-center justify-center" style={{ height: 'calc(100% - 120px)', paddingTop: 40 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={eggKey}
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          >
            <svg
              width={eggW}
              height={eggH}
              viewBox={`0 0 ${eggW} ${eggH}`}
              className="drop-shadow-xl"
              style={{ filter: 'drop-shadow(0 8px 24px rgba(180,120,60,0.25))' }}
            >
              <defs>
                {/* Egg outline clip */}
                <clipPath id="eggClip">
                  <ellipse cx={eggW / 2} cy={eggH * 0.54} rx={eggW / 2 - 4} ry={eggH * 0.46} />
                </clipPath>
                {/* Band clips */}
                {bands.map((_, i) => (
                  <clipPath key={i} id={`bandClip${i}`}>
                    <rect x={0} y={i * bandH + 12} width={eggW} height={bandH} />
                  </clipPath>
                ))}
                {/* 3D shading overlay */}
                <radialGradient id="eggShine" cx="40%" cy="35%" r="55%">
                  <stop offset="0%" stopColor="white" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="eggShadow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="black" stopOpacity="0" />
                  <stop offset="85%" stopColor="black" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="black" stopOpacity="0.15" />
                </linearGradient>
              </defs>

              {/* White egg base */}
              <g clipPath="url(#eggClip)">
                <ellipse cx={eggW / 2} cy={eggH * 0.54} rx={eggW / 2 - 4} ry={eggH * 0.46} fill="#fff" />

                {/* Coloured bands */}
                {bands.map((band, i) => (
                  <g key={i}>
                    <rect
                      x={0}
                      y={i * bandH + 12}
                      width={eggW}
                      height={bandH}
                      fill={band.color}
                      style={{ cursor: 'pointer' }}
                      onClick={(e) => handleBandTap(i, e)}
                    />
                    <PatternFill
                      pattern={band.pattern}
                      color={band.color}
                      y={i * bandH + 12}
                      height={bandH}
                      clipId={`bandClip${i}`}
                    />
                    {/* Invisible tap target on top */}
                    <rect
                      x={0}
                      y={i * bandH + 12}
                      width={eggW}
                      height={bandH}
                      fill="transparent"
                      style={{ cursor: 'pointer' }}
                      onClick={(e) => handleBandTap(i, e)}
                    />
                  </g>
                ))}

                {/* 3D shading */}
                <ellipse cx={eggW / 2} cy={eggH * 0.54} rx={eggW / 2 - 4} ry={eggH * 0.46} fill="url(#eggShine)" />
                <ellipse cx={eggW / 2} cy={eggH * 0.54} rx={eggW / 2 - 4} ry={eggH * 0.46} fill="url(#eggShadow)" />
              </g>

              {/* Egg outline */}
              <ellipse
                cx={eggW / 2}
                cy={eggH * 0.54}
                rx={eggW / 2 - 4}
                ry={eggH * 0.46}
                fill="none"
                stroke="#e8d5b8"
                strokeWidth={3}
              />
            </svg>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom toolbar: colour palette + star button */}
      <div className="absolute bottom-0 left-0 right-0 h-[110px] flex items-center justify-center gap-4 pb-4">
        {/* Colour palette */}
        <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-full px-5 py-3 shadow-lg">
          {COLORS.map((color) => (
            <motion.button
              key={color}
              onClick={() => handleColorSelect(color)}
              whileTap={{ scale: 0.85 }}
              animate={selectedColor === color ? { scale: 1.15 } : { scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="relative w-14 h-14 rounded-full border-4 focus:outline-none"
              style={{
                backgroundColor: color,
                borderColor: selectedColor === color ? '#7c3aed' : 'rgba(255,255,255,0.7)',
                boxShadow: selectedColor === color
                  ? `0 0 0 3px rgba(124,58,237,0.3), 0 4px 12px ${color}80`
                  : `0 2px 6px rgba(0,0,0,0.1)`,
              }}
            >
              {selectedColor === color && (
                <motion.div
                  layoutId="colorRing"
                  className="absolute inset-[-6px] rounded-full border-[3px] border-purple-400"
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Star (finish) button */}
        <motion.button
          onClick={handleFinish}
          whileTap={{ scale: 0.85 }}
          whileHover={{ scale: 1.1 }}
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ rotate: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 to-amber-400 shadow-lg flex items-center justify-center border-4 border-yellow-200 focus:outline-none"
        >
          <span className="text-3xl">⭐</span>
        </motion.button>
      </div>
    </div>
  );
}
