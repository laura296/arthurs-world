/**
 * Mad Hatter's Tea Party — Pattern Sequencing Game
 *
 * Arthur drags tea party objects to fill missing slots in patterns.
 * 5 puzzles per session: 2 Tier 1, 2 Tier 2, 1 Tier 3.
 * The Mad Hatter guides with escalating non-verbal hints.
 * Each completed pattern triggers a tea-pouring reward.
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import BackButton from '../../components/BackButton';
import { useCelebration } from '../../components/CelebrationOverlay';
import { useParticleBurst } from '../../components/ParticleBurst';
import { playBoing, playSuccess, playSparkle } from '../../hooks/useSound';
import { OBJECTS, OBJECT_PITCH, pickSession, getCorrectAnswer } from './teaPartyData';
import {
  playCeramicClink, playCeramicSlide, playTeaPour,
  playPatternChord, playHatterCelebrate, startAmbient, stopAmbient,
} from './teaPartySounds';
import { MadHatter, MarchHare, Dormouse } from './TeaPartyCharacters';

// ── Colour palette ───────────────────────────────────────────────────
const COLORS = {
  tablewood: '#C4A265',
  tablecloth: '#FDF5E6',
  amber: '#F5B041',
  cream: '#FFF8F0',
  gold: '#D4AC0D',
  slotGlow: 'rgba(245, 176, 65, 0.4)',
  slotGoldGlow: 'rgba(245, 176, 65, 0.8)',
};

// ── SVG tea party object renderer ────────────────────────────────────

function TeaObject({ objectId, size = 60, ghost = false, glowing = false }) {
  const obj = OBJECTS[objectId];
  if (!obj) return null;

  const s = size * obj.size;
  const half = s / 2;
  const opacity = ghost ? 0.7 : 1;

  return (
    <svg width={s} height={s} viewBox="0 0 60 60" style={{ opacity, filter: glowing ? 'drop-shadow(0 0 8px #F5B041)' : undefined }}>
      {obj.group === 'cup' && (
        <g>
          {/* Cup body */}
          <path d={`M12 18 Q10 50 18 52 L42 52 Q50 50 48 18 Z`} fill={obj.color} stroke={obj.rim} strokeWidth="1.5" />
          {/* Rim */}
          <ellipse cx="30" cy="18" rx="18" ry="4" fill={obj.color} stroke={obj.rim} strokeWidth="1" />
          {/* Handle */}
          <path d="M48 24 Q58 28 58 36 Q58 44 48 44" fill="none" stroke={obj.rim} strokeWidth="2" strokeLinecap="round" />
          {/* Pattern decoration */}
          {obj.pattern === 'dots' && (
            <>
              <circle cx="22" cy="35" r="2" fill={obj.rim} opacity="0.4" />
              <circle cx="30" cy="38" r="2" fill={obj.rim} opacity="0.4" />
              <circle cx="38" cy="35" r="2" fill={obj.rim} opacity="0.4" />
            </>
          )}
          {obj.pattern === 'roses' && (
            <circle cx="30" cy="35" r="5" fill="none" stroke={obj.rim} strokeWidth="1" opacity="0.3" />
          )}
          {/* Inner shadow */}
          <ellipse cx="30" cy="20" rx="14" ry="2.5" fill="rgba(0,0,0,0.05)" />
        </g>
      )}

      {obj.group === 'saucer' && (
        <g>
          {/* Saucer — flat oval */}
          <ellipse cx="30" cy="40" rx="26" ry="8" fill={obj.color} stroke={obj.rim} strokeWidth="1.5" />
          <ellipse cx="30" cy="38" rx="20" ry="5" fill={obj.color} stroke={obj.rim} strokeWidth="0.5" opacity="0.5" />
          {obj.pattern === 'ring' && (
            <ellipse cx="30" cy="39" rx="14" ry="3.5" fill="none" stroke={obj.rim} strokeWidth="1" opacity="0.3" />
          )}
        </g>
      )}

      {obj.group === 'cake' && (
        <g>
          {/* Cake base */}
          <rect x="14" y="28" width="32" height="24" rx="4" fill={obj.color} stroke={obj.rim} strokeWidth="1" />
          {/* Frosting top */}
          <path d="M14 30 Q22 22 30 26 Q38 22 46 30" fill={obj.rim} opacity="0.5" />
          {/* Cherry */}
          {obj.pattern === 'cherry' && <circle cx="30" cy="22" r="4" fill="#C0392B" />}
          {/* Swirl */}
          {obj.pattern === 'swirl' && (
            <path d="M25 36 Q30 30 35 36 Q40 42 30 40" fill="none" stroke={obj.rim} strokeWidth="1" opacity="0.4" />
          )}
        </g>
      )}

      {obj.group === 'spoon' && (
        <g>
          {/* Spoon bowl */}
          <ellipse cx="30" cy="20" rx="8" ry="10" fill={obj.color} stroke={obj.rim} strokeWidth="1" />
          {/* Handle */}
          <rect x="28" y="28" width="4" height="26" rx="2" fill={obj.color} stroke={obj.rim} strokeWidth="0.8" />
          {/* Shine */}
          <ellipse cx="28" cy="18" rx="3" ry="5" fill="white" opacity="0.2" />
        </g>
      )}

      {obj.group === 'sandwich' && (
        <g>
          {/* Triangle sandwich */}
          <polygon points="30,14 8,48 52,48" fill={obj.color} stroke={obj.rim} strokeWidth="1.5" />
          {/* Filling line */}
          <line x1="15" y1="40" x2="45" y2="40" stroke="#90EE90" strokeWidth="2" opacity="0.6" />
          <line x1="14" y1="42" x2="46" y2="42" stroke="#F5B7B1" strokeWidth="1.5" opacity="0.5" />
        </g>
      )}

      {obj.group === 'sugar' && (
        <g>
          {/* Sugar cube */}
          <rect x="16" y="20" width="28" height="24" rx="3" fill={obj.color} stroke={obj.rim} strokeWidth="1" />
          {/* Top face (3D effect) */}
          <path d="M16 22 L22 16 L50 16 L44 22 Z" fill="white" stroke={obj.rim} strokeWidth="0.5" opacity="0.6" />
          {/* Sparkle */}
          <circle cx="28" cy="28" r="1" fill="white" opacity="0.5" />
          <circle cx="36" cy="34" r="0.8" fill="white" opacity="0.4" />
        </g>
      )}
    </svg>
  );
}

// ── Empty slot (pulsing outline) ─────────────────────────────────────

function EmptySlot({ objectId, size = 60, hintLevel = 0, slotRef }) {
  const obj = OBJECTS[objectId];
  if (!obj) return null;

  const isGold = hintLevel >= 3;
  const isPulsing = hintLevel >= 1;

  return (
    <div
      ref={slotRef}
      className="flex items-center justify-center rounded-xl"
      style={{
        width: size * obj.size,
        height: size * obj.size,
        border: `3px dashed ${isGold ? COLORS.gold : COLORS.amber}`,
        background: isGold ? COLORS.slotGoldGlow : COLORS.slotGlow,
        animation: isPulsing
          ? `slot-pulse ${isGold ? '0.6s' : '1.2s'} ease-in-out infinite`
          : undefined,
      }}
    >
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 20 20" opacity="0.3">
        <text x="10" y="15" textAnchor="middle" fontSize="16" fill={COLORS.amber}>?</text>
      </svg>
    </div>
  );
}

// ── Progress dots ────────────────────────────────────────────────────

function ProgressDots({ current, total = 5 }) {
  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-300"
          style={{
            width: i === current ? 14 : 10,
            height: i === current ? 14 : 10,
            background: i < current ? COLORS.gold : i === current ? COLORS.amber : 'rgba(255,255,255,0.3)',
            boxShadow: i === current ? `0 0 8px ${COLORS.amber}` : undefined,
          }}
        />
      ))}
    </div>
  );
}

// ── Tea pouring animation ────────────────────────────────────────────

function TeaPourAnimation({ cupCount, onComplete }) {
  const [pouringCup, setPouringCup] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (pouringCup < cupCount) {
      playTeaPour(pouringCup, cupCount);
      const timer = setTimeout(() => setPouringCup(c => c + 1), 700);
      return () => clearTimeout(timer);
    } else {
      playPatternChord();
      setDone(true);
      const timer = setTimeout(onComplete, 1800);
      return () => clearTimeout(timer);
    }
  }, [pouringCup, cupCount, onComplete]);

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
      {/* Teapot */}
      <div
        className="absolute"
        style={{
          top: '15%',
          left: '50%',
          transform: `translateX(-50%) rotate(${pouringCup < cupCount ? -30 : 0}deg)`,
          transition: 'transform 0.4s ease-in-out',
        }}
      >
        <svg width="80" height="60" viewBox="0 0 80 60">
          <ellipse cx="40" cy="35" rx="25" ry="18" fill="#C4A265" stroke="#8B6914" strokeWidth="1.5" />
          <ellipse cx="40" cy="20" rx="12" ry="4" fill="#D4A574" stroke="#8B6914" strokeWidth="1" />
          <circle cx="40" cy="16" r="4" fill="#8B6914" />
          <path d="M65 32 Q75 26 72 18" fill="none" stroke="#8B6914" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M15 28 Q5 35 15 42" fill="none" stroke="#8B6914" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Pour stream */}
      {pouringCup < cupCount && (
        <div
          className="absolute"
          style={{
            top: '28%',
            left: '50%',
            width: 4,
            height: '12%',
            background: 'linear-gradient(to bottom, #F5B041, #D4AC0D)',
            borderRadius: 2,
            transform: 'translateX(-50%)',
            animation: 'tea-stream 0.5s ease-in-out',
            opacity: 0.8,
          }}
        />
      )}

      {/* Completion glow */}
      {done && (
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, rgba(245,176,65,0.15) 0%, transparent 60%)',
            animation: 'fadeIn 0.5s ease-out',
          }}
        />
      )}
    </div>
  );
}

// ── Table background ─────────────────────────────────────────────────

function TableBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Sky / room background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, #87CEEB 0%, #B0D9EC 30%, #E8D5B7 60%, #C4A265 70%, #A0854A 100%)',
        }}
      />

      {/* Tablecloth */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: '42%',
          height: '58%',
          background: `linear-gradient(to bottom, ${COLORS.tablecloth} 0%, #F5E6D3 40%, ${COLORS.tablewood} 40%, #B8955A 100%)`,
        }}
      />

      {/* Tablecloth edge scallops */}
      <div className="absolute left-0 right-0" style={{ top: '57%' }}>
        <svg width="100%" height="16" viewBox="0 0 400 16" preserveAspectRatio="none">
          <path
            d="M0 0 Q10 14 20 0 Q30 14 40 0 Q50 14 60 0 Q70 14 80 0 Q90 14 100 0 Q110 14 120 0 Q130 14 140 0 Q150 14 160 0 Q170 14 180 0 Q190 14 200 0 Q210 14 220 0 Q230 14 240 0 Q250 14 260 0 Q270 14 280 0 Q290 14 300 0 Q310 14 320 0 Q330 14 340 0 Q350 14 360 0 Q370 14 380 0 Q390 14 400 0"
            fill="none" stroke="#E8D5B7" strokeWidth="2"
          />
        </svg>
      </div>

      {/* Scattered crumbs */}
      {[
        { x: '15%', y: '65%', s: 3 }, { x: '25%', y: '72%', s: 2 }, { x: '55%', y: '68%', s: 2.5 },
        { x: '70%', y: '75%', s: 2 }, { x: '85%', y: '70%', s: 3 }, { x: '40%', y: '78%', s: 1.5 },
      ].map((c, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{ left: c.x, top: c.y, width: c.s, height: c.s, background: '#D4A574', opacity: 0.4 }}
        />
      ))}

      {/* Steam curls */}
      <div className="absolute" style={{ left: '20%', top: '35%', animation: 'steam-rise 3s ease-in-out infinite', opacity: 0.2 }}>
        <svg width="20" height="30" viewBox="0 0 20 30">
          <path d="M10 30 Q5 20 10 15 Q15 10 10 0" fill="none" stroke="white" strokeWidth="1.5" />
        </svg>
      </div>
      <div className="absolute" style={{ left: '75%', top: '33%', animation: 'steam-rise 3.5s ease-in-out infinite 1s', opacity: 0.15 }}>
        <svg width="16" height="25" viewBox="0 0 16 25">
          <path d="M8 25 Q3 16 8 12 Q13 8 8 0" fill="none" stroke="white" strokeWidth="1.5" />
        </svg>
      </div>
    </div>
  );
}

// ── Main game component ──────────────────────────────────────────────

const GAME_STATES = { INTRO: 'intro', PLAYING: 'playing', TEA_POUR: 'tea_pour', FINALE: 'finale' };
const HINT_DELAY_1 = 5000;
const HINT_DELAY_2 = 10000;
const HINT_DELAY_3 = 15000;

export default function MadHatterTeaParty() {
  // ── Session state ──
  const puzzles = useMemo(() => pickSession(), []);
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [gameState, setGameState] = useState(GAME_STATES.INTRO);

  // ── Puzzle state ──
  const puzzle = puzzles[puzzleIdx];
  const [filledSlots, setFilledSlots] = useState({}); // { missingIdx: objectId }
  const [hintLevel, setHintLevel] = useState(0);
  const hintTimerRef = useRef(null);

  // ── Drag state ──
  const [dragging, setDragging] = useState(null); // { objectId, startX, startY }
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const slotRefs = useRef({});
  const trayRefs = useRef({});
  const containerRef = useRef(null);

  // ── Character reactions ──
  const [hatterReaction, setHatterReaction] = useState('idle');
  const [hareReaction, setHareReaction] = useState('idle');
  const [dormouseReaction, setDormouseReaction] = useState('idle');

  // ── Rewards ──
  const { celebrate, CelebrationLayer } = useCelebration();
  const { burst, ParticleLayer } = useParticleBurst();

  // ── Remaining missing slots ──
  const remainingMissing = useMemo(() => {
    if (!puzzle) return [];
    return puzzle.missing.filter(idx => !filledSlots[idx]);
  }, [puzzle, filledSlots]);

  // ── Intro timer ──
  useEffect(() => {
    const t = setTimeout(() => setGameState(GAME_STATES.PLAYING), 1500);
    startAmbient();
    return () => { clearTimeout(t); stopAmbient(); };
  }, []);

  // ── Hint timer ──
  const resetHints = useCallback(() => {
    setHintLevel(0);
    clearTimeout(hintTimerRef.current);

    hintTimerRef.current = setTimeout(() => {
      setHintLevel(1);
      setHatterReaction('tap-hint');
      hintTimerRef.current = setTimeout(() => {
        setHintLevel(2);
        setHatterReaction('wave-item');
        hintTimerRef.current = setTimeout(() => {
          setHintLevel(3);
          setHatterReaction('idle');
        }, HINT_DELAY_3 - HINT_DELAY_2);
      }, HINT_DELAY_2 - HINT_DELAY_1);
    }, HINT_DELAY_1);
  }, []);

  // Reset hints when puzzle changes
  useEffect(() => {
    if (gameState === GAME_STATES.PLAYING) {
      resetHints();
    }
    return () => clearTimeout(hintTimerRef.current);
  }, [puzzleIdx, gameState, resetHints]);

  // ── Get position relative to container ──
  const getRelPos = useCallback((clientX, clientY) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: clientX, y: clientY };
    return { x: clientX - rect.left, y: clientY - rect.top };
  }, []);

  // ── Check if drag is over a slot ──
  const checkSlotHit = useCallback((x, y) => {
    for (const idx of remainingMissing) {
      const el = slotRefs.current[idx];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      if (dist < 55) return idx; // generous hit zone for little fingers
    }
    return null;
  }, [remainingMissing]);

  // ── Handle correct placement ──
  const handleCorrect = useCallback((slotIdx, objectId) => {
    const obj = OBJECTS[objectId];
    const pitchMul = OBJECT_PITCH[obj?.group] || 1.0;
    playCeramicClink(pitchMul);

    setFilledSlots(prev => ({ ...prev, [slotIdx]: objectId }));
    setHatterReaction('celebrate');
    setHareReaction('celebrate');
    setDormouseReaction('celebrate');

    // Particle burst at slot position
    const el = slotRefs.current[slotIdx];
    if (el) {
      const rect = el.getBoundingClientRect();
      burst(rect.left + rect.width / 2, rect.top + rect.height / 2, {
        count: 12,
        colors: ['#F5B041', '#FDF5E6', '#E74C3C', '#5B9BD5'],
        shapes: ['star', 'circle'],
        spread: 60,
      });
    }

    playSuccess();
    resetHints();

    // Reset reactions after brief celebration
    setTimeout(() => {
      setHatterReaction('idle');
      setHareReaction('idle');
      setDormouseReaction('idle');
    }, 1200);
  }, [burst, resetHints]);

  // ── Handle wrong placement ──
  const handleWrong = useCallback(() => {
    playBoing();
    setHatterReaction('wrong');
    setHareReaction('wrong');

    setTimeout(() => {
      setHatterReaction('idle');
      setHareReaction('idle');
    }, 800);
    resetHints();
  }, [resetHints]);

  // ── Check if pattern is complete ──
  useEffect(() => {
    if (!puzzle || gameState !== GAME_STATES.PLAYING) return;
    if (remainingMissing.length === 0 && Object.keys(filledSlots).length > 0) {
      // Pattern complete — transition to tea pour
      clearTimeout(hintTimerRef.current);
      setTimeout(() => setGameState(GAME_STATES.TEA_POUR), 600);
    }
  }, [remainingMissing, filledSlots, puzzle, gameState]);

  // ── Handle tea pour complete ──
  const handleTeaPourComplete = useCallback(() => {
    if (puzzleIdx >= puzzles.length - 1) {
      // Final puzzle — big celebration
      setGameState(GAME_STATES.FINALE);
      playHatterCelebrate();
      celebrate({
        message: 'Tea Time!',
        colors: ['#F5B041', '#C0392B', '#5B9BD5', '#FDF5E6'],
        duration: 4000,
      });
    } else {
      // Next puzzle
      setPuzzleIdx(i => i + 1);
      setFilledSlots({});
      setHintLevel(0);
      setGameState(GAME_STATES.PLAYING);
    }
  }, [puzzleIdx, puzzles.length, celebrate]);

  // ── Touch / mouse drag handlers ──
  const handleDragStart = useCallback((objectId, clientX, clientY) => {
    if (gameState !== GAME_STATES.PLAYING) return;
    playCeramicSlide();
    setDragging({ objectId });
    setDragPos(getRelPos(clientX, clientY));
    resetHints();
  }, [gameState, getRelPos, resetHints]);

  const handleDragMove = useCallback((clientX, clientY) => {
    if (!dragging) return;
    setDragPos(getRelPos(clientX, clientY));
  }, [dragging, getRelPos]);

  const handleDragEnd = useCallback((clientX, clientY) => {
    if (!dragging) return;

    const hitIdx = checkSlotHit(clientX, clientY);
    if (hitIdx !== null) {
      const correct = getCorrectAnswer(puzzle, hitIdx);
      if (dragging.objectId === correct) {
        handleCorrect(hitIdx, dragging.objectId);
      } else {
        handleWrong();
      }
    }
    setDragging(null);
  }, [dragging, checkSlotHit, puzzle, handleCorrect, handleWrong]);

  // Touch events
  const onTouchStart = useCallback((objectId) => (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleDragStart(objectId, touch.clientX, touch.clientY);
  }, [handleDragStart]);

  const onTouchMove = useCallback((e) => {
    if (!dragging) return;
    e.preventDefault();
    const touch = e.touches[0];
    handleDragMove(touch.clientX, touch.clientY);
  }, [dragging, handleDragMove]);

  const onTouchEnd = useCallback((e) => {
    if (!dragging) return;
    const touch = e.changedTouches[0];
    handleDragEnd(touch.clientX, touch.clientY);
  }, [dragging, handleDragEnd]);

  // Mouse events (dev/fallback)
  const onMouseDown = useCallback((objectId) => (e) => {
    e.preventDefault();
    handleDragStart(objectId, e.clientX, e.clientY);
  }, [handleDragStart]);

  const onMouseMove = useCallback((e) => {
    if (!dragging) return;
    handleDragMove(e.clientX, e.clientY);
  }, [dragging, handleDragMove]);

  const onMouseUp = useCallback((e) => {
    if (!dragging) return;
    handleDragEnd(e.clientX, e.clientY);
  }, [dragging, handleDragEnd]);

  // ── Find correct answer for first remaining slot (for hints) ──
  const hintCorrectId = remainingMissing.length > 0 ? getCorrectAnswer(puzzle, remainingMissing[0]) : null;

  // ── Render ──
  if (!puzzle) return null;

  const patternItems = puzzle.pattern.map((objectId, idx) => {
    const isMissing = puzzle.missing.includes(idx);
    const isFilled = filledSlots[idx];
    return { objectId, idx, isMissing, isFilled };
  });

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none"
      style={{ touchAction: 'none' }}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <TableBackground />
      <BackButton />

      {/* Progress dots */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
        <ProgressDots current={puzzleIdx} total={puzzles.length} />
      </div>

      {/* Characters — positioned left and right of table */}
      <div className="absolute z-10" style={{ left: '2%', top: '8%' }}>
        <MadHatter reaction={hatterReaction} />
      </div>
      <div className="absolute z-10" style={{ right: '3%', top: '18%' }}>
        <MarchHare reaction={hareReaction} />
      </div>
      <div className="absolute z-10" style={{ right: '12%', top: '36%' }}>
        <Dormouse reaction={dormouseReaction} />
      </div>

      {/* Pattern row — objects on the table */}
      <div
        className="absolute left-0 right-0 flex items-center justify-center gap-3 z-10 px-4"
        style={{ top: '44%', transform: 'translateY(-50%)' }}
      >
        {patternItems.map(({ objectId, idx, isMissing, isFilled }) => {
          if (isMissing && !isFilled) {
            // Show empty slot
            const isHintTarget = hintLevel >= 1 && idx === remainingMissing[0];
            return (
              <div key={idx} className="flex-shrink-0">
                <EmptySlot
                  objectId={objectId}
                  size={60}
                  hintLevel={isHintTarget ? hintLevel : 0}
                  slotRef={el => { slotRefs.current[idx] = el; }}
                />
              </div>
            );
          }
          // Show placed object (or originally present)
          const displayId = isFilled || objectId;
          return (
            <div
              key={idx}
              className="flex-shrink-0"
              style={{
                animation: isFilled ? 'item-place 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' : undefined,
              }}
            >
              <TeaObject objectId={displayId} size={60} />
            </div>
          );
        })}
      </div>

      {/* Drag tray — below the table */}
      <div
        className="absolute left-0 right-0 flex items-center justify-center gap-6 z-10 px-8"
        style={{ bottom: '8%' }}
      >
        {puzzle.tray.map((objectId, i) => {
          const isHintGlow = hintLevel >= 2 && objectId === hintCorrectId;
          const isGold = hintLevel >= 3 && objectId === hintCorrectId;
          return (
            <div
              key={`${objectId}-${i}`}
              ref={el => { trayRefs.current[`${objectId}-${i}`] = el; }}
              className="p-2 rounded-2xl cursor-grab active:cursor-grabbing"
              style={{
                background: 'rgba(255,248,240,0.8)',
                boxShadow: isGold
                  ? '0 0 16px rgba(245,176,65,0.8)'
                  : isHintGlow
                  ? '0 0 12px rgba(245,176,65,0.5)'
                  : '0 2px 8px rgba(120,80,40,0.15)',
                animation: isHintGlow ? 'tray-glow 0.8s ease-in-out infinite' : undefined,
                touchAction: 'none',
              }}
              onTouchStart={onTouchStart(objectId)}
              onMouseDown={onMouseDown(objectId)}
            >
              <TeaObject objectId={objectId} size={70} />
            </div>
          );
        })}
      </div>

      {/* Drag ghost — follows finger */}
      {dragging && (
        <div
          className="fixed pointer-events-none z-50"
          style={{
            left: dragPos.x - 35,
            top: dragPos.y - 35,
            transform: 'scale(1.15) rotate(-3deg)',
            opacity: 0.85,
            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))',
          }}
        >
          <TeaObject objectId={dragging.objectId} size={70} ghost />
        </div>
      )}

      {/* Tea pour animation */}
      {gameState === GAME_STATES.TEA_POUR && (
        <TeaPourAnimation
          cupCount={puzzle.pattern.filter((_, i) => !puzzle.missing.includes(i) || filledSlots[i]).length}
          onComplete={handleTeaPourComplete}
        />
      )}

      {/* Intro overlay */}
      {gameState === GAME_STATES.INTRO && (
        <div
          className="absolute inset-0 z-30 flex items-center justify-center"
          style={{ animation: 'fadeIn 0.5s ease-out' }}
        >
          <div
            className="px-8 py-4 rounded-3xl"
            style={{
              background: 'rgba(255,248,240,0.9)',
              boxShadow: '0 4px 20px rgba(120,80,40,0.2)',
              animation: 'intro-pop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <span className="text-4xl">🎩</span>
            <span className="text-4xl ml-2">☕</span>
          </div>
        </div>
      )}

      <CelebrationLayer />
      <ParticleLayer />

      {/* CSS animations (scoped via style tag) */}
      <style>{`
        @keyframes slot-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.7; }
        }
        @keyframes item-place {
          0% { transform: scale(0.5); opacity: 0.5; }
          60% { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes tray-glow {
          0%, 100% { box-shadow: 0 0 8px rgba(245,176,65,0.3); }
          50% { box-shadow: 0 0 20px rgba(245,176,65,0.7); }
        }
        @keyframes hatter-idle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes hatter-bounce {
          0%, 100% { transform: translateY(0); }
          25% { transform: translateY(-12px); }
          50% { transform: translateY(-2px); }
          75% { transform: translateY(-8px); }
        }
        @keyframes hatter-tilt {
          0%, 100% { transform: rotate(0deg); }
          30% { transform: rotate(-8deg); }
          70% { transform: rotate(5deg); }
        }
        @keyframes hatter-wave {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(15deg); }
        }
        @keyframes hat-jump {
          0% { transform: translateY(0) rotate(0deg); }
          40% { transform: translateY(-20px) rotate(-10deg); }
          70% { transform: translateY(-12px) rotate(5deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
        @keyframes hare-doze {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(2px) rotate(2deg); }
        }
        @keyframes hare-jolt {
          0% { transform: translateY(0); }
          20% { transform: translateY(-8px); }
          100% { transform: translateY(0); }
        }
        @keyframes hare-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        @keyframes dormouse-zzz {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(-4px); opacity: 0.3; }
        }
        @keyframes tea-stream {
          0% { height: 0; opacity: 0; }
          30% { opacity: 0.8; }
          100% { height: 12%; opacity: 0.8; }
        }
        @keyframes steam-rise {
          0% { transform: translateY(0) scaleX(1); opacity: 0.2; }
          50% { transform: translateY(-10px) scaleX(1.3); opacity: 0.1; }
          100% { transform: translateY(-20px) scaleX(0.8); opacity: 0; }
        }
        @keyframes intro-pop {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
