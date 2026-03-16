/**
 * StackBricks — "Stack It!" block stacking game.
 *
 * Tap anywhere to drop the moving block onto the tower.
 * Blocks that overhang get trimmed; perfectly aligned drops
 * trigger sparkle celebrations. Tower grows, background shifts
 * from warm amber through sunset to starry night.
 *
 * Performance: moving block uses ref-based DOM updates (no React
 * re-renders at 60fps). State only syncs on drop.
 *
 * @component
 * @route /games/:mode/:section/stack-bricks
 */
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import BackButton from '../components/BackButton';
import { playPop, playSuccess, playBoing, playSparkle, playCelebrate, playThud, playError } from '../hooks/useSound';
import { useParticleBurst } from '../components/ParticleBurst';
import { useArthurPeek } from '../components/ArthurPeek';
import { useCelebration } from '../components/CelebrationOverlay';

/* ── Constants ── */

const BLOCK_COLORS = [
  '#F5B041', '#E74C3C', '#3498DB', '#2ECC71',
  '#9B59B6', '#E67E22', '#1ABC9C', '#EC4899',
];

const BLOCK_HEIGHT = 36;
const PERFECT_THRESHOLD = 5;
const INITIAL_WIDTH_RATIO = 0.6;
const MIN_WIDTH = 40;
const BASE_SPEED = 2.8;
const SPEED_INCREMENT = 0.12;
const MAX_SPEED = 7;
const SWAY_AMOUNT = 1.2;

const STORAGE_KEY = 'stackBricks_best';

/* ── Helpers ── */

function getBlockColor(index) {
  return BLOCK_COLORS[index % BLOCK_COLORS.length];
}

function darkenColor(hex, amount) {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.max(0, (num >> 16) - amount);
  const g = Math.max(0, ((num >> 8) & 0xFF) - amount);
  const b = Math.max(0, (num & 0xFF) - amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function lightenColor(hex, amount) {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0xFF) + amount);
  const b = Math.min(255, (num & 0xFF) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

/** Background gradient that shifts as tower grows */
function getBgGradient(height) {
  if (height < 5) {
    return 'linear-gradient(180deg, #FDEBD0 0%, #F5CBA7 40%, #F0B27A 100%)';
  }
  if (height < 10) {
    return 'linear-gradient(180deg, #F5CBA7 0%, #E59866 30%, #D68910 100%)';
  }
  if (height < 15) {
    return 'linear-gradient(180deg, #E59866 0%, #C0392B 40%, #7D3C98 100%)';
  }
  if (height < 20) {
    return 'linear-gradient(180deg, #8E44AD 0%, #2C3E50 50%, #1B2631 100%)';
  }
  return 'linear-gradient(180deg, #1B2631 0%, #0B0E11 40%, #0A0A1A 100%)';
}

/** Tiny stars that appear when height >= 15 */
function Stars({ count }) {
  const stars = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${5 + Math.random() * 90}%`,
      top: `${3 + Math.random() * 30}%`,
      size: 1.5 + Math.random() * 2.5,
      delay: Math.random() * 3,
      twinkleDur: 2 + Math.random() * 2,
      opacity: 0.6 + Math.random() * 0.4,
    })),
  [count]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {stars.map(s => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            animation: `sb-twinkle ${s.twinkleDur}s ease-in-out ${s.delay}s infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Falling piece component ── */
function FallingPiece({ piece }) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: piece.x,
        bottom: piece.y,
        width: piece.width,
        height: BLOCK_HEIGHT,
        background: `linear-gradient(180deg, ${piece.color} 0%, ${piece.colorDark} 100%)`,
        borderRadius: 8,
        animation: `sb-fallOff-${piece.rotDir} 0.8s ease-in forwards`,
        transformOrigin: piece.side === 'right' ? 'left bottom' : 'right bottom',
        boxShadow: '0 4px 12px rgba(80, 40, 20, 0.25)',
      }}
    />
  );
}

/** Perfect sparkle burst — emoji-only, no text */
function PerfectBurst({ show }) {
  if (!show) return null;
  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
      style={{ animation: 'sb-perfectPop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' }}
    >
      <span className="text-7xl drop-shadow-lg">✨</span>
    </div>
  );
}

/** Block highlight stripe — reused on tower blocks and moving block */
function BlockHighlight() {
  return (
    <div
      className="absolute rounded-full"
      style={{
        top: 6,
        left: '10%',
        width: '40%',
        height: 4,
        background: 'rgba(255,255,255,0.35)',
        borderRadius: 2,
      }}
    />
  );
}

/** Game-over overlay — visual score with mini tower + best badge */
function GameOverOverlay({ score, bestScore, isNewBest, onReplay }) {
  const towerBlocks = useMemo(() =>
    Array.from({ length: Math.min(score, 12) }, (_, i) => ({
      color: getBlockColor(i),
      colorDark: darkenColor(getBlockColor(i), 25),
    })),
  [score]);

  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Mini tower visual */}
      <div
        className="relative z-10 flex flex-col-reverse items-center mb-4"
        style={{ animation: 'sb-popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      >
        {towerBlocks.map((b, i) => (
          <div
            key={i}
            className="rounded-lg"
            style={{
              width: 60 - i * 2,
              height: 14,
              marginBottom: 2,
              background: `linear-gradient(180deg, ${b.color} 0%, ${b.colorDark} 100%)`,
              boxShadow: 'inset 0 2px 3px rgba(255,255,255,0.3), inset 0 -2px 3px rgba(0,0,0,0.15)',
              animation: `sb-popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 80}ms both`,
            }}
          />
        ))}
      </div>

      {/* Score as big number with star */}
      <div
        className="relative z-10 flex items-center gap-3 mb-3"
        style={{ animation: 'sb-popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s both' }}
      >
        <span className="text-5xl">⭐</span>
        <span className="text-7xl font-heading text-white drop-shadow-lg">{score}</span>
      </div>

      {/* New best badge */}
      {isNewBest && (
        <div
          className="relative z-10 flex items-center gap-2 bg-amber-400/80 rounded-full px-6 py-2 border-2 border-amber-300/60 shadow-lg mb-4"
          style={{ animation: 'sb-popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.7s both' }}
        >
          <span className="text-3xl">🏆</span>
          <span className="text-3xl">✨</span>
        </div>
      )}

      {/* Best score (when not new best) */}
      {!isNewBest && bestScore > 0 && (
        <div
          className="relative z-10 flex items-center gap-2 bg-white/20 rounded-full px-5 py-2 mb-4"
          style={{ animation: 'sb-popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.7s both' }}
        >
          <span className="text-2xl">🏆</span>
          <span className="text-2xl font-heading text-white/70">{bestScore}</span>
        </div>
      )}

      {/* Replay button */}
      <button
        onClick={onReplay}
        className="relative z-10 w-28 h-28 rounded-full bg-amber-400 shadow-xl shadow-amber-500/40
                   flex items-center justify-center active:scale-90 transition-transform
                   border-4 border-amber-300/60"
        style={{ animation: 'sb-popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 1s both' }}
      >
        <span className="text-5xl">🔄</span>
      </button>
    </div>
  );
}

/* ── Main Component ── */
export default function StackBricks() {
  const containerRef = useRef(null);
  const movingBlockRef = useRef(null);
  const dropGuideRef = useRef(null);
  const animFrameRef = useRef(null);
  const blockPosRef = useRef(0);
  const blockDirRef = useRef(1);
  const gameAreaRef = useRef({ w: 0, h: 0 });

  /* State */
  const [phase, setPhase] = useState('ready'); // ready | playing | dropping | landed | gameover
  const [tower, setTower] = useState([]);
  const [currentBlock, setCurrentBlock] = useState(null); // { width, color, colorDark } — no x (DOM-managed)
  const [fallingPieces, setFallingPieces] = useState([]);
  const [perfectShow, setPerfectShow] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    try { return parseInt(localStorage.getItem(STORAGE_KEY)) || 0; } catch { return 0; }
  });
  const [isNewBest, setIsNewBest] = useState(false);
  const [misses, setMisses] = useState(0);
  const [landAnim, setLandAnim] = useState(null);

  /* Hooks */
  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();
  const { celebrate, CelebrationLayer } = useCelebration();

  /* Derived */
  const height = tower.length;
  const speed = Math.min(BASE_SPEED + height * SPEED_INCREMENT, MAX_SPEED);

  /* ── Measure game area ── */
  useEffect(() => {
    function measure() {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        gameAreaRef.current = { w: rect.width, h: rect.height };
      }
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  /* ── Save best score ── */
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      setIsNewBest(true);
      try { localStorage.setItem(STORAGE_KEY, String(score)); } catch {}
    }
  }, [score, bestScore]);

  /* ── Spawn a new moving block ── */
  const spawnBlock = useCallback((prevBlock) => {
    const { w } = gameAreaRef.current;
    if (!w) return;

    const width = prevBlock
      ? prevBlock.width
      : Math.round(w * INITIAL_WIDTH_RATIO);
    const color = getBlockColor(tower.length);
    const colorDark = darkenColor(color, 25);

    blockPosRef.current = 0;
    blockDirRef.current = 1;
    setCurrentBlock({
      width: Math.max(width, MIN_WIDTH),
      color,
      colorDark,
    });
    setPhase('playing');
  }, [tower.length]);

  /* ── Animation loop — direct DOM updates, no React state ── */
  useEffect(() => {
    if (phase !== 'playing' || !currentBlock) return;

    const { w } = gameAreaRef.current;
    if (!w) return;

    const blockWidth = currentBlock.width;

    function animate() {
      const maxX = w - blockWidth;
      blockPosRef.current += blockDirRef.current * speed;

      if (blockPosRef.current >= maxX) {
        blockPosRef.current = maxX;
        blockDirRef.current = -1;
      } else if (blockPosRef.current <= 0) {
        blockPosRef.current = 0;
        blockDirRef.current = 1;
      }

      // Direct DOM update — no re-render
      const pos = `${blockPosRef.current}px`;
      if (movingBlockRef.current) movingBlockRef.current.style.left = pos;
      if (dropGuideRef.current) dropGuideRef.current.style.left = pos;

      animFrameRef.current = requestAnimationFrame(animate);
    }

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [phase, currentBlock?.width, speed]);

  /* ── Drop the block ── */
  const dropBlock = useCallback(() => {
    if (phase !== 'playing' || !currentBlock) return;

    setPhase('dropping');

    const dropX = blockPosRef.current;
    const dropWidth = currentBlock.width;
    const { color, colorDark } = currentBlock;

    if (tower.length === 0) {
      const newBlock = { x: dropX, width: dropWidth, color, colorDark, settled: true };
      setTower([newBlock]);
      setScore(1);
      setLandAnim({ index: 0 });
      playThud();
      burstAtBlock(dropX, dropWidth, 0, color);
      setTimeout(() => {
        setLandAnim(null);
        setPhase('landed');
        spawnNext(newBlock);
      }, 250);
      return;
    }

    const topBlock = tower[tower.length - 1];
    const overlapStart = Math.max(dropX, topBlock.x);
    const overlapEnd = Math.min(dropX + dropWidth, topBlock.x + topBlock.width);
    const overlapWidth = overlapEnd - overlapStart;

    if (overlapWidth <= 0) {
      // Complete miss
      playError();
      const rotDir = Math.random() > 0.5 ? 'cw' : 'ccw';
      setFallingPieces(prev => [...prev, {
        id: Date.now(),
        x: dropX,
        y: tower.length * BLOCK_HEIGHT,
        width: dropWidth,
        color,
        colorDark,
        side: dropX > topBlock.x ? 'right' : 'left',
        rotDir,
      }]);
      setMisses(prev => {
        const next = prev + 1;
        if (next >= 3) {
          // Game over — show score screen
          setTimeout(() => setPhase('gameover'), 500);
        }
        return next;
      });
      if (misses + 1 < 3) {
        setTimeout(() => {
          setPhase('landed');
          spawnBlock(topBlock);
        }, 400);
      }
      return;
    }

    const isPerfect = Math.abs(dropX - topBlock.x) <= PERFECT_THRESHOLD;
    let newX, newWidth;

    if (isPerfect) {
      newX = topBlock.x;
      newWidth = topBlock.width;
    } else {
      newX = overlapStart;
      newWidth = Math.round(overlapWidth);
    }

    const newBlock = { x: newX, width: newWidth, color, colorDark, settled: true };
    const newTower = [...tower, newBlock];
    const newHeight = newTower.length;

    setTower(newTower);
    setScore(newHeight);
    setLandAnim({ index: newHeight - 1 });
    playThud();

    burstAtBlock(newX, newWidth, newHeight - 1, color);

    // Handle excess falling off
    if (!isPerfect) {
      const excessLeft = dropX < topBlock.x;
      const excessWidth = dropWidth - newWidth;
      if (excessWidth > 3) {
        const excessX = excessLeft ? dropX : newX + newWidth;
        const rotDir = excessLeft ? 'ccw' : 'cw';
        setFallingPieces(prev => [...prev, {
          id: Date.now() + 1,
          x: excessX,
          y: (newHeight - 1) * BLOCK_HEIGHT,
          width: excessWidth,
          color,
          colorDark,
          side: excessLeft ? 'left' : 'right',
          rotDir,
        }]);
        setTimeout(() => playPop(), 150);
      }
    }

    // Perfect bonus
    if (isPerfect) {
      playSparkle();
      setPerfectShow(true);
      setTimeout(() => setPerfectShow(false), 700);
      const { h } = gameAreaRef.current;
      burst(newX + newWidth / 2, h - (newHeight * BLOCK_HEIGHT) - BLOCK_HEIGHT, {
        count: 12,
        colors: ['#FFD700', '#FFF8DC', '#FFFACD', '#F5B041'],
        shapes: ['star', 'circle'],
      });
    }

    // Arthur peek every 3 blocks
    if (newHeight % 3 === 0 && newHeight > 0) {
      setTimeout(() => peek('excited'), 200);
    }

    // Milestone celebrations (emoji-only messages)
    if (newHeight === 5) {
      setTimeout(() => { playSuccess(); peek('happy'); }, 300);
    } else if (newHeight === 10) {
      setTimeout(() => {
        celebrate({ message: '🎉🌟🎉' });
      }, 400);
    } else if (newHeight === 15) {
      setTimeout(() => { playSuccess(); peek('excited'); }, 300);
    } else if (newHeight === 20) {
      setTimeout(() => {
        celebrate({ message: '🏆✨🏆' });
      }, 400);
    }

    setTimeout(() => {
      setLandAnim(null);
      setPhase('landed');
      spawnNext(newBlock);
    }, 250);
  }, [phase, currentBlock, tower, misses, burst, peek, celebrate, spawnBlock]);

  /* Helper: burst particles at block position */
  function burstAtBlock(x, width, index, color) {
    const { h } = gameAreaRef.current;
    const cy = h - ((index + 1) * BLOCK_HEIGHT);
    burst(x + width / 2, cy, {
      count: 6,
      colors: [color, '#FFFFFF', lightenColor(color, 40)],
      shapes: ['circle', 'star'],
    });
  }

  /* Helper: spawn the next block after a short delay */
  function spawnNext(prevBlock) {
    setTimeout(() => spawnBlock(prevBlock), 200);
  }

  /* ── Start / restart ── */
  const startGame = useCallback(() => {
    setTower([]);
    setScore(0);
    setMisses(0);
    setIsNewBest(false);
    setFallingPieces([]);
    setPerfectShow(false);
    setLandAnim(null);
    playBoing();
    setTimeout(() => {
      spawnBlock(null);
    }, 300);
  }, [spawnBlock]);

  /* ── Tap handler ── */
  const handleTap = useCallback(() => {
    if (phase === 'ready') {
      startGame();
    } else if (phase === 'playing') {
      dropBlock();
    }
  }, [phase, startGame, dropBlock]);

  /* ── Clean up old falling pieces ── */
  useEffect(() => {
    if (fallingPieces.length === 0) return;
    const timer = setTimeout(() => {
      setFallingPieces([]);
    }, 900);
    return () => clearTimeout(timer);
  }, [fallingPieces]);

  /* ── Tower rendering ── */
  const { h: areaH } = gameAreaRef.current;
  const viewOffset = Math.max(0, (height * BLOCK_HEIGHT) - (areaH ? areaH * 0.6 : 300));
  const movingBlockTop = Math.max(30, areaH ? areaH - 60 - ((height + 1) * BLOCK_HEIGHT) + viewOffset : 80);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden select-none"
      style={{
        background: getBgGradient(height),
        transition: 'background 2s ease',
        touchAction: 'manipulation',
      }}
      onClick={handleTap}
    >
      {/* Stars for high towers */}
      {height >= 15 && <Stars count={height >= 20 ? 40 : 20} />}

      {/* Ground */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: 60,
          background: 'linear-gradient(180deg, #8B7355 0%, #6B5340 100%)',
          borderTop: '3px solid #A0886A',
        }}
      >
        <div className="absolute -top-2 left-0 right-0 h-4" style={{
          background: 'repeating-linear-gradient(90deg, transparent, transparent 20px, #6B8E5A 20px, #6B8E5A 24px, transparent 24px, transparent 40px)',
          opacity: 0.6,
          maskImage: 'linear-gradient(180deg, black 0%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(180deg, black 0%, transparent 100%)',
        }} />
      </div>

      {/* Tower container */}
      <div
        className="absolute left-0 right-0"
        style={{
          bottom: 60,
          transform: `translateY(${viewOffset}px)`,
          transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
      <div
        style={{
          animation: height > 3 ? `sb-towerSway ${3 + height * 0.1}s ease-in-out infinite` : 'none',
        }}
      >
        {/* Settled tower blocks */}
        {tower.map((block, i) => {
          const isSquishing = landAnim?.index === i;
          return (
            <div
              key={i}
              className="absolute"
              style={{
                left: block.x,
                bottom: i * BLOCK_HEIGHT,
                width: block.width,
                height: BLOCK_HEIGHT,
                background: `linear-gradient(180deg, ${block.color} 0%, ${block.colorDark} 100%)`,
                borderRadius: 8,
                boxShadow: `
                  0 4px 8px rgba(80, 40, 20, 0.2),
                  inset 0 2px 4px rgba(255, 255, 255, 0.3),
                  inset 0 -2px 4px rgba(0, 0, 0, 0.15)
                `,
                transform: isSquishing
                  ? 'scaleY(0.85) scaleX(1.06)'
                  : 'scaleY(1) scaleX(1)',
                transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transformOrigin: 'bottom center',
                zIndex: i,
              }}
            >
              <BlockHighlight />
            </div>
          );
        })}

        {/* Falling excess pieces */}
        {fallingPieces.map(piece => (
          <FallingPiece key={piece.id} piece={piece} />
        ))}
      </div>
      </div>

      {/* Moving block — positioned via ref, not state */}
      {currentBlock && phase === 'playing' && (
        <div
          ref={movingBlockRef}
          className="absolute"
          style={{
            left: 0,
            top: movingBlockTop,
            width: currentBlock.width,
            height: BLOCK_HEIGHT,
            background: `linear-gradient(180deg, ${currentBlock.color} 0%, ${currentBlock.colorDark} 100%)`,
            borderRadius: 8,
            boxShadow: `
              0 4px 12px rgba(80, 40, 20, 0.3),
              0 0 20px ${currentBlock.color}44,
              inset 0 2px 4px rgba(255, 255, 255, 0.3),
              inset 0 -2px 4px rgba(0, 0, 0, 0.15)
            `,
            zIndex: 50,
            animation: 'sb-blockGlow 1.2s ease-in-out infinite alternate',
          }}
        >
          <BlockHighlight />
        </div>
      )}

      {/* Drop guide line */}
      {currentBlock && phase === 'playing' && height > 0 && (
        <div
          ref={dropGuideRef}
          className="absolute pointer-events-none"
          style={{
            left: 0,
            top: movingBlockTop + BLOCK_HEIGHT,
            width: currentBlock.width,
            height: areaH || 400,
            borderLeft: '1px dashed rgba(255,255,255,0.15)',
            borderRight: '1px dashed rgba(255,255,255,0.15)',
            zIndex: 10,
          }}
        />
      )}

      {/* Perfect sparkle burst */}
      <PerfectBurst show={perfectShow} />

      {/* Ready state — visual-only, no text */}
      {phase === 'ready' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-40">
          <div
            className="text-center"
            style={{ animation: 'sb-floatGentle 2s ease-in-out infinite' }}
          >
            <div className="text-8xl mb-6">🧱</div>
            <div
              className="w-28 h-28 rounded-full bg-white/30 backdrop-blur-sm border-2 border-white/30
                         shadow-xl flex items-center justify-center active:scale-90 transition-transform"
              style={{ animation: 'sb-pulseGlow 2s ease-in-out infinite' }}
            >
              <span className="text-5xl">▶️</span>
            </div>
          </div>
          {bestScore > 0 && (
            <div className="mt-6 bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl px-5 py-2 flex items-center gap-2">
              <span className="text-xl">🏆</span>
              <span className="font-heading text-2xl text-white/80">{bestScore}</span>
            </div>
          )}
        </div>
      )}

      {/* Score badge — number + star icon, no words */}
      {phase !== 'ready' && phase !== 'gameover' && (
        <div className="absolute top-4 right-4 z-50 bg-white/30 backdrop-blur-sm border border-white/30 rounded-2xl px-5 py-2.5 flex items-center gap-2">
          <span className="text-xl">⭐</span>
          <span className="font-heading text-2xl text-white drop-shadow">
            {score}
          </span>
        </div>
      )}

      {/* Best score badge (when playing and have a previous best) */}
      {phase !== 'ready' && phase !== 'gameover' && bestScore > score && (
        <div className="absolute top-16 right-4 z-50 bg-white/15 backdrop-blur-sm border border-white/15 rounded-xl px-4 py-1.5 flex items-center gap-1.5">
          <span className="text-sm">🏆</span>
          <span className="font-heading text-lg text-white/60">
            {bestScore}
          </span>
        </div>
      )}

      {/* Misses indicator — gentle visual pips */}
      {phase !== 'ready' && phase !== 'gameover' && misses > 0 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex gap-2">
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className={`w-5 h-5 rounded-full transition-all duration-300 ${
                i < misses
                  ? 'bg-red-400/60 scale-110'
                  : 'bg-white/20 border border-white/20'
              }`}
            />
          ))}
        </div>
      )}

      {/* Game Over overlay */}
      {phase === 'gameover' && (
        <GameOverOverlay
          score={score}
          bestScore={bestScore}
          isNewBest={isNewBest}
          onReplay={(e) => {
            e.stopPropagation();
            startGame();
          }}
        />
      )}

      {/* Back button */}
      <BackButton />

      {/* Overlay layers */}
      <ParticleLayer />
      <ArthurPeekLayer />
      <CelebrationLayer />

      {/* Scoped keyframes — prefixed to avoid collisions */}
      <style>{`
        @keyframes sb-fallOff-cw {
          0%   { opacity: 1; transform: translateY(0) rotate(0deg); }
          100% { opacity: 0; transform: translateY(300px) rotate(45deg); }
        }
        @keyframes sb-fallOff-ccw {
          0%   { opacity: 1; transform: translateY(0) rotate(0deg); }
          100% { opacity: 0; transform: translateY(300px) rotate(-45deg); }
        }
        @keyframes sb-towerSway {
          0%, 100% { transform: translateX(0); }
          25%  { transform: translateX(${SWAY_AMOUNT}px); }
          75%  { transform: translateX(-${SWAY_AMOUNT}px); }
        }
        @keyframes sb-blockGlow {
          0%   { filter: brightness(1); }
          100% { filter: brightness(1.15); }
        }
        @keyframes sb-perfectPop {
          0%   { opacity: 0; transform: scale(0.3) translateY(20px); }
          50%  { opacity: 1; transform: scale(1.3) translateY(-10px); }
          70%  { transform: scale(0.95) translateY(0); }
          85%  { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.2) translateY(-40px); }
        }
        @keyframes sb-floatGentle {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }
        @keyframes sb-pulseGlow {
          0%, 100% { box-shadow: 0 0 10px rgba(245,176,65,0.3); }
          50%      { box-shadow: 0 0 25px rgba(245,176,65,0.6); }
        }
        @keyframes sb-twinkle {
          0%   { opacity: 0.3; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes sb-popIn {
          0%   { opacity: 0; transform: scale(0); }
          60%  { transform: scale(1.15); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
