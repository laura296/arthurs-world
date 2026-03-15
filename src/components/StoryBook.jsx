import React, { useState, useCallback, useEffect, useRef, cloneElement } from 'react';
import BackButton from './BackButton';
import {
  playTap, playSuccess, playBoing, playPop,
  playSparkle, playWhoosh, playPoof, playSnap,
  playFlap, playPageTurn, playCollectPing, playSplash,
} from '../hooks/useSound';
import { useCelebration } from './CelebrationOverlay';
import { useParticleBurst } from './ParticleBurst';
import { speakText as speakNarration, stopSpeaking } from '../hooks/useNarration';
import { playAnimalSound } from '../hooks/useAnimalSounds';

/**
 * Interactive StoryBook engine.
 *
 * Props:
 *   story: {
 *     title: string,
 *     audioDir: string (optional, e.g. '/arthurs-world/audio/three-pigs'),
 *     pages: [{
 *       bg: string (tailwind gradient fallback),
 *       scene: React node (SVG background),
 *       image: string (AI-generated illustration URL),
 *       text: string (narration text),
 *       elements: [{ id, x, y, content, size, bg, rounded, w, h, pad, z }],
 *       interactions: [{
 *         id: string,
 *         type: 'tap-reveal' | 'tap-color' | 'tap-grow' | 'tap-sound' | 'tap-count' |
 *               'tap-wiggle' | 'tap-shake' | 'tap-sparkle' | 'tap-spin' |
 *               'drag-to-target' | 'tap-animate' | 'tap-swap' | 'tap-hide',
 *         targetId: string,
 *         data: any,
 *       }],
 *     }]
 *   }
 */

// ─── Audio playback ──────────────────────────────────────────────

let currentAudio = null;

function stopNarration() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  stopSpeaking();
}

function speak(text, audioSrc) {
  stopNarration();
  if (audioSrc) {
    const audio = new Audio(audioSrc);
    currentAudio = audio;
    audio.play().catch(() => {
      currentAudio = null;
      speakNarration(text);
    });
  } else {
    speakNarration(text);
  }
}

// ─── Sparkle particles ──────────────────────────────────────────

function SparkleParticles({ active }) {
  if (!active) return null;
  const particles = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    const dist = 30 + Math.random() * 20;
    return {
      key: i,
      tx: Math.cos(angle) * dist,
      ty: Math.sin(angle) * dist,
      color: ['#facc15', '#ec4899', '#38bdf8', '#22c55e', '#a78bfa', '#fb923c', '#ef4444', '#fbbf24'][i],
      size: 6 + Math.random() * 6,
    };
  });

  return (
    <div className="absolute inset-0 pointer-events-none z-50">
      {particles.map(p => (
        <div
          key={p.key}
          className="absolute left-1/2 top-1/2 rounded-full animate-sparkle-particle"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            '--tx': `${p.tx}px`,
            '--ty': `${p.ty}px`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Flap reveal — paper lift animation ─────────────────────────
function FlapReveal({ flapContent, revealContent, isOpen, onToggle }) {
  return (
    <div className="relative cursor-pointer" onClick={onToggle} style={{ perspective: '600px' }}>
      {/* Hidden content underneath */}
      <div className={`transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
        {revealContent}
      </div>
      {/* Flap on top */}
      <div
        className={`absolute inset-0 ${isOpen ? 'animate-flap-open' : 'animate-flap-close'}`}
        style={{
          transformOrigin: 'top center',
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden',
          filter: isOpen ? undefined : 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))',
        }}
      >
        {flapContent}
      </div>
    </div>
  );
}

// ─── Speech bubble — bouncy pop-in ──────────────────────────────
function SpeechBubble({ text, visible }) {
  if (!visible) return null;
  return (
    <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-speech-pop">
      <div className="bg-white rounded-2xl px-4 py-2 shadow-lg border-2 border-amber-200/60
                      relative max-w-[180px] text-center">
        <p className="text-base font-body text-gray-800 leading-snug">{text}</p>
        {/* Triangle pointer */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4
                        bg-white border-r-2 border-b-2 border-amber-200/60
                        rotate-45 -mb-1" />
      </div>
    </div>
  );
}

// ─── Drop zone indicator ─────────────────────────────────────────

function DropZone({ zone, active }) {
  if (!active) return null;
  return (
    <div
      className="absolute border-3 border-dashed border-white/50 rounded-full animate-pulse pointer-events-none z-5"
      style={{
        left: `${zone.x}%`,
        top: `${zone.y}%`,
        width: zone.radius * 2,
        height: zone.radius * 2,
        transform: 'translate(-50%, -50%)',
      }}
    />
  );
}

// ─── Interactive element ─────────────────────────────────────────

function InteractiveElement({ el, interactions, pageState, setPageState, containerRef }) {
  const myInteractions = interactions.filter(i => i.targetId === el.id);
  const state = pageState[el.id] || {};
  const dragRef = useRef(null);
  const [dragOffset, setDragOffset] = useState(null);
  const [pressed, setPressed] = useState(false);

  // Check if this element has a drag interaction
  const dragInteraction = myInteractions.find(i => i.type === 'drag-to-target');
  const isDraggable = dragInteraction && !state.dropped;

  const handleTap = useCallback(() => {
    // Skip tap handling if element is being dragged
    if (isDraggable) return;

    myInteractions.forEach(inter => {
      switch (inter.type) {
        case 'tap-reveal': {
          playPop();
          setPageState(prev => ({
            ...prev,
            [el.id]: { ...prev[el.id], revealed: true, revealContent: inter.data.content },
          }));
          break;
        }
        case 'tap-color': {
          playTap();
          const colors = inter.data.colors;
          const currentIdx = (state.colorIdx || 0);
          const nextIdx = (currentIdx + 1) % colors.length;
          setPageState(prev => ({
            ...prev,
            [el.id]: { ...prev[el.id], colorIdx: nextIdx, color: colors[nextIdx] },
          }));
          break;
        }
        case 'tap-grow': {
          playBoing();
          setPageState(prev => ({
            ...prev,
            [el.id]: { ...prev[el.id], grown: !(prev[el.id]?.grown) },
          }));
          break;
        }
        case 'tap-sound': {
          // Prefer synthesised SFX, fall back to TTS
          if (inter.data.sfx && playAnimalSound(inter.data.sfx)) {
            playBoing();
          } else {
            playBoing();
            speak(inter.data.say);
          }
          setPageState(prev => ({
            ...prev,
            [el.id]: { ...prev[el.id], animating: true },
          }));
          setTimeout(() => {
            setPageState(prev => ({
              ...prev,
              [el.id]: { ...prev[el.id], animating: false },
            }));
          }, 600);
          break;
        }
        case 'tap-count': {
          // Play animal SFX if provided, otherwise default pop
          if (inter.data.sfx) {
            playAnimalSound(inter.data.sfx);
          } else {
            playPop();
          }
          const max = inter.data.max || 5;
          const count = (state.count || 0) + 1;
          if (count >= max) playSuccess();
          setPageState(prev => ({
            ...prev,
            [el.id]: { ...prev[el.id], count: Math.min(count, max) },
          }));
          break;
        }
        case 'tap-wiggle': {
          playBoing();
          setPageState(prev => ({
            ...prev,
            [el.id]: { ...prev[el.id], wiggling: true },
          }));
          setTimeout(() => {
            setPageState(prev => ({
              ...prev,
              [el.id]: { ...prev[el.id], wiggling: false },
            }));
          }, 500);
          break;
        }
        case 'tap-shake': {
          playBoing();
          setPageState(prev => ({
            ...prev,
            [el.id]: { ...prev[el.id], shaking: true },
          }));
          setTimeout(() => {
            setPageState(prev => ({
              ...prev,
              [el.id]: { ...prev[el.id], shaking: false },
            }));
          }, 800);
          break;
        }
        case 'tap-sparkle': {
          playSparkle();
          setPageState(prev => ({
            ...prev,
            [el.id]: { ...prev[el.id], sparkleKey: (prev[el.id]?.sparkleKey || 0) + 1 },
          }));
          setTimeout(() => {
            setPageState(prev => ({
              ...prev,
              [el.id]: { ...prev[el.id], sparkleKey: 0 },
            }));
          }, 700);
          break;
        }
        case 'tap-spin': {
          playWhoosh();
          setPageState(prev => ({
            ...prev,
            [el.id]: { ...prev[el.id], spinning: true },
          }));
          setTimeout(() => {
            setPageState(prev => ({
              ...prev,
              [el.id]: { ...prev[el.id], spinning: false },
            }));
          }, 700);
          break;
        }
        case 'tap-swap': {
          playPop();
          setPageState(prev => ({
            ...prev,
            [el.id]: { ...prev[el.id], swapped: !(prev[el.id]?.swapped) },
          }));
          break;
        }
        case 'tap-hide': {
          playPoof();
          setPageState(prev => ({
            ...prev,
            [el.id]: { ...prev[el.id], hiding: true },
          }));
          setTimeout(() => {
            setPageState(prev => ({
              ...prev,
              [el.id]: { ...prev[el.id], hidden: true },
            }));
          }, 400);
          break;
        }
        case 'tap-jump': {
          playBoing();
          setPageState(prev => ({
            ...prev,
            [el.id]: { ...prev[el.id], jumping: true },
          }));
          setTimeout(() => {
            setPageState(prev => ({
              ...prev,
              [el.id]: { ...prev[el.id], jumping: false },
            }));
          }, 850);
          break;
        }
        case 'tap-animate': {
          playBoing();
          setPageState(prev => ({
            ...prev,
            [el.id]: { ...prev[el.id], customAnim: inter.data.animation, customAnimating: true },
          }));
          setTimeout(() => {
            setPageState(prev => ({
              ...prev,
              [el.id]: { ...prev[el.id], customAnimating: false },
            }));
          }, inter.data.duration || 1000);
          break;
        }
        case 'flap-reveal': {
          playFlap();
          if (navigator.vibrate) navigator.vibrate(10);
          setPageState(prev => ({
            ...prev,
            [el.id]: { ...prev[el.id], flapOpen: !(prev[el.id]?.flapOpen) },
          }));
          break;
        }
        case 'character-speak': {
          playBoing();
          speak(inter.data.say);
          setPageState(prev => ({
            ...prev,
            [el.id]: {
              ...prev[el.id],
              speaking: true,
              speechText: inter.data.say,
              animating: true,
            },
          }));
          setTimeout(() => {
            setPageState(prev => ({
              ...prev,
              [el.id]: { ...prev[el.id], animating: false },
            }));
          }, 600);
          setTimeout(() => {
            setPageState(prev => ({
              ...prev,
              [el.id]: { ...prev[el.id], speaking: false },
            }));
          }, 3000);
          break;
        }
        case 'scene-transform': {
          playSplash();
          setPageState(prev => ({
            ...prev,
            [el.id]: { ...prev[el.id], transformed: true },
            _sceneTransform: {
              ...(prev._sceneTransform || {}),
              [inter.data.transformId || el.id]: inter.data.value || true,
            },
          }));
          break;
        }
        case 'peek-a-boo': {
          playPop();
          setPageState(prev => ({
            ...prev,
            [el.id]: { ...prev[el.id], peeked: true },
          }));
          setTimeout(() => {
            setPageState(prev => ({
              ...prev,
              [el.id]: { ...prev[el.id], peekDone: true },
            }));
          }, 400);
          break;
        }
        case 'collect': {
          playCollectPing();
          const target = inter.data.target;
          const collectKey = `_collect_${target}`;
          const count = (pageState[collectKey]?.count || 0) + 1;
          const max = inter.data.max || 3;
          if (count >= max) {
            setTimeout(() => playSuccess(), 200);
          }
          setPageState(prev => ({
            ...prev,
            [el.id]: { ...prev[el.id], collected: true, collecting: true },
            [collectKey]: { count: Math.min(count, max) },
          }));
          setTimeout(() => {
            setPageState(prev => ({
              ...prev,
              [el.id]: { ...prev[el.id], collecting: false, hidden: true },
            }));
          }, 600);
          break;
        }
        default:
          break;
      }
    });

    if (myInteractions.length === 0) {
      playTap();
    }
  }, [myInteractions, state, el.id, setPageState, isDraggable, pageState]);

  // ── Drag handlers ──
  const onPointerDown = useCallback((e) => {
    if (!isDraggable) return;
    e.preventDefault();
    e.stopPropagation();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      elX: el.x,
      elY: el.y,
      containerW: rect.width,
      containerH: rect.height,
    };
    setDragOffset({ dx: 0, dy: 0 });
  }, [isDraggable, el.x, el.y, containerRef]);

  const onPointerMove = useCallback((e) => {
    if (!dragRef.current) return;
    e.preventDefault();
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setDragOffset({ dx, dy });
  }, []);

  const onPointerUp = useCallback((e) => {
    if (!dragRef.current || !dragInteraction) return;
    e.preventDefault();
    const { containerW, containerH } = dragRef.current;
    const { dx, dy } = dragOffset || { dx: 0, dy: 0 };

    // Current position in percentage
    const currentPctX = el.x + (dx / containerW) * 100;
    const currentPctY = el.y + (dy / containerH) * 100;

    // Check if within drop zone
    const zone = dragInteraction.data.dropZone;
    const distX = (currentPctX - zone.x) * containerW / 100;
    const distY = (currentPctY - zone.y) * containerH / 100;
    const dist = Math.sqrt(distX * distX + distY * distY);

    if (dist < zone.radius) {
      // Success!
      playSnap();
      playSuccess();
      setPageState(prev => ({
        ...prev,
        [el.id]: {
          ...prev[el.id],
          dropped: true,
          dropX: zone.x,
          dropY: zone.y,
        },
      }));
    } else {
      // Snap back
      playTap();
    }

    dragRef.current = null;
    setDragOffset(null);
  }, [dragInteraction, dragOffset, el.x, el.y, el.id, setPageState]);

  // Attach move/up listeners to window when dragging
  useEffect(() => {
    if (!dragOffset) return;
    const move = (e) => onPointerMove(e);
    const up = (e) => onPointerUp(e);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [dragOffset, onPointerMove, onPointerUp]);

  // Hidden elements don't render
  if (state.hidden) return null;

  const isInteractive = myInteractions.length > 0;
  const isHotspot = el.hotspot;
  const scale = state.grown ? 1.4 : 1;

  // Build animation class string
  let animClass = '';
  if (state.jumping) animClass = 'animate-hop-bounce';
  else if (state.wiggling) animClass = 'animate-wiggle';
  else if (state.shaking) animClass = 'animate-shake';
  else if (state.spinning) animClass = 'animate-spin360';
  else if (state.hiding) animClass = 'animate-poof';
  else if (state.animating) animClass = 'animate-bounce';
  else if (state.peeked && !state.peekDone) animClass = 'animate-peek-reveal';
  else if (state.collecting) animClass = 'animate-collect-fly';
  else if (state.customAnimating && state.customAnim) animClass = state.customAnim;

  const bg = state.color || el.bg || '';

  // Swap content
  const swapInter = myInteractions.find(i => i.type === 'tap-swap');
  let displayContent = el.content;
  if (state.revealed && state.revealContent) {
    displayContent = state.revealContent;
  } else if (swapInter && state.swapped) {
    displayContent = swapInter.data.altContent;
  }

  // Position — use drop position if dropped, or drag offset if dragging
  let posX = state.dropped ? state.dropX : el.x;
  let posY = state.dropped ? state.dropY : el.y;
  let dragTranslate = '';
  if (dragOffset && !state.dropped) {
    dragTranslate = `translate(${dragOffset.dx}px, ${dragOffset.dy}px)`;
  }

  return (
    <button
      onClick={handleTap}
      onPointerDown={(e) => {
        if (isDraggable) {
          onPointerDown(e);
        } else {
          setPressed(true);
          if (navigator.vibrate) navigator.vibrate(8);
        }
      }}
      onPointerUp={() => { if (!isDraggable) setPressed(false); }}
      onPointerLeave={() => { if (!isDraggable) setPressed(false); }}
      aria-label={el.label || undefined}
      className={`absolute transition-all duration-300 ${animClass}
                 ${pressed && !isDraggable ? 'scale-95' : ''}
                 ${isInteractive ? 'cursor-pointer' : ''}
                 ${isDraggable ? 'cursor-grab active:cursor-grabbing touch-none' : ''}
                 ${isHotspot ? 'rounded-full' : el.rounded ? 'rounded-full' : 'rounded-2xl'}`}
      style={{
        left: `${posX}%`,
        top: `${posY}%`,
        transform: `translate(-50%, -50%) scale(${scale}) ${dragTranslate}`,
        fontSize: isHotspot ? undefined : (el.size || 48),
        backgroundColor: isHotspot ? 'transparent' : bg,
        width: el.w || (isHotspot ? 60 : 'auto'),
        height: el.h || (isHotspot ? 60 : 'auto'),
        padding: isHotspot ? 0 : (el.pad || undefined),
        zIndex: dragOffset ? 100 : (el.z || 10),
        boxShadow: isHotspot ? undefined :
          (isInteractive ? '0 3px 8px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.1)' : undefined),
      }}
    >
      {isHotspot ? (
        /* Hotspot: show pulsing indicator or revealed content */
        state.revealed && state.revealContent ? (
          <span className="bg-white/90 backdrop-blur-sm rounded-2xl px-3 py-1.5
                          text-base font-body text-gray-800 shadow-lg border border-amber-200/50
                          whitespace-nowrap animate-speech-pop">
            {state.revealContent}
          </span>
        ) : (
          <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="w-5 h-5 rounded-full animate-hotspot-pulse
                            bg-gradient-to-br from-yellow-300/60 to-amber-400/50
                            shadow-lg shadow-yellow-400/30 border border-yellow-300/40" />
          </span>
        )
      ) : (
        displayContent
      )}
      {state.count > 0 && (
        <span className="absolute -top-2 -right-2 bg-sun text-night text-lg font-heading
                         w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
          {state.count}
        </span>
      )}
      {!isHotspot && isInteractive && !state.revealed && !state.dropped && (
        <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-sun animate-sparkle
                         shadow shadow-yellow-400" />
      )}
      <SparkleParticles active={state.sparkleKey > 0} />
      <SpeechBubble text={state.speechText} visible={state.speaking} />
    </button>
  );
}

// ─── Main StoryBook component ────────────────────────────────────

export default function StoryBook({ story, onComplete }) {
  const [page, setPage] = useState(0);
  const [pageState, setPageState] = useState({});
  const [turning, setTurning] = useState(false);
  const [turnDir, setTurnDir] = useState(1); // 1 = forward, -1 = back
  const [autoRead, setAutoRead] = useState(true);
  const [imgFailed, setImgFailed] = useState(false);
  const touchStart = useRef(null);
  const containerRef = useRef(null);
  const celebratedRef = useRef(false);
  const { celebrate, CelebrationLayer } = useCelebration();
  const { burst, ParticleLayer } = useParticleBurst();

  const current = story.pages[page];
  const isFirst = page === 0;
  const isLast = page === story.pages.length - 1;

  // Celebrate on reaching the last page
  useEffect(() => {
    if (isLast && !celebratedRef.current) {
      celebratedRef.current = true;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2 - 60;
      burst(cx, cy, { count: 16, spread: 90, colors: ['#facc15', '#ec4899', '#38bdf8', '#22c55e'], shapes: ['star', 'heart', 'circle'] });
      setTimeout(() => {
        celebrate({ message: 'The End! 🎉' });
        onComplete?.();
      }, 400);
    }
  }, [isLast, celebrate, burst, onComplete]);

  // Build audio source path for current page
  const audioSrc = story.audioDir ? `${story.audioDir}/page-${page + 1}.mp3` : null;

  // Auto-narrate on page change
  useEffect(() => {
    if (autoRead && current.text) {
      const timer = setTimeout(() => speak(current.text, audioSrc), 400);
      return () => {
        clearTimeout(timer);
        stopNarration();
      };
    }
  }, [page, autoRead, current.text, audioSrc]);

  // Reset page state on page turn
  useEffect(() => {
    setPageState({});
    setImgFailed(false);
  }, [page]);

  const turnPage = useCallback((dir) => {
    if (turning) return;
    const next = page + dir;
    if (next < 0 || next >= story.pages.length) return;
    playPageTurn();
    setTurnDir(dir);
    setTurning(true);
    if (navigator.vibrate) navigator.vibrate(10);
    setTimeout(() => {
      setPage(next);
      setTurning(false);
    }, 600);
  }, [page, turning, story.pages.length]);

  // Swipe support
  const onTouchStart = useCallback((e) => {
    touchStart.current = e.touches[0].clientX;
  }, []);

  const onTouchEnd = useCallback((e) => {
    if (touchStart.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(diff) > 60) {
      turnPage(diff < 0 ? 1 : -1);
    }
    touchStart.current = null;
  }, [turnPage]);

  // Collect all active drop zones for current page
  const dropZones = (current.interactions || [])
    .filter(i => i.type === 'drag-to-target' && !pageState[i.targetId]?.dropped)
    .map(i => ({ id: i.id, zone: i.data.dropZone }));

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Background — priority: image (if loads) > scene > gradient */}
      {current.image && !imgFailed && (
        <img
          src={current.image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
          onError={() => setImgFailed(true)}
        />
      )}
      {current.scene && (!current.image || imgFailed) && (
        typeof current.scene.type === 'function'
          ? cloneElement(current.scene, { transforms: pageState._sceneTransform || {} })
          : current.scene
      )}
      {current.bg && !current.scene && (!current.image || imgFailed) && (
        <div className={`absolute inset-0 bg-gradient-to-b ${current.bg}`} />
      )}

      {/* Paper texture overlay — subtle grain for tactile feel */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-[60]" style={{ mixBlendMode: 'multiply', opacity: 0.04 }}>
        <defs>
          <filter id="paper-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" seed="2" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#paper-grain)" fill="#f5e6d0" />
      </svg>

      <BackButton />

      {/* Page content with page-curl transition */}
      <div
        className={`absolute inset-0 ${
          turning
            ? turnDir > 0 ? 'animate-page-curl-out' : 'animate-page-curl-out'
            : ''
        }`}
        style={{
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden',
        }}
      >
        {/* Drop zone indicators */}
        {dropZones.map(dz => (
          <DropZone key={dz.id} zone={dz.zone} active />
        ))}

        {/* Interactive elements */}
        {(current.elements || []).map(el => (
          <InteractiveElement
            key={el.id}
            el={el}
            interactions={current.interactions || []}
            pageState={pageState}
            setPageState={setPageState}
            containerRef={containerRef}
          />
        ))}
      </div>

      {/* Text area — bottom third */}
      <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none">
        <div className={`mx-4 mb-20 bg-white/85 backdrop-blur-md rounded-3xl p-5 shadow-xl
                        border-2 border-amber-200/50 pointer-events-auto
                        transition-all duration-350 ${turning ? 'opacity-0 translate-y-4' : 'opacity-100'}`}>
          <p className="text-xl font-body text-gray-800 leading-relaxed text-center">
            {current.text}
          </p>
          {/* Read aloud button */}
          <button
            onClick={() => speak(current.text, audioSrc)}
            className="absolute -top-4 right-4 w-10 h-10 rounded-full bg-sun shadow-lg
                       flex items-center justify-center text-xl active:scale-90 transition-transform"
          >
            🔊
          </button>
        </div>
      </div>

      {/* Page indicator */}
      <div className="absolute top-4 right-16 z-50 bg-white/70 backdrop-blur-sm rounded-full
                      px-3 py-1.5 text-sm font-heading text-gray-700 shadow">
        {page + 1} / {story.pages.length}
      </div>

      {/* Navigation arrows */}
      <div className="absolute bottom-5 left-0 right-0 z-40 flex justify-between px-6 pointer-events-none">
        {!isFirst ? (
          <button
            onClick={() => turnPage(-1)}
            className="pointer-events-auto w-14 h-14 rounded-full bg-white/70 backdrop-blur-sm shadow-lg
                       flex items-center justify-center text-2xl active:scale-90 transition-transform"
          >
            ◀️
          </button>
        ) : <div className="w-14" />}

        {!isLast ? (
          <button
            onClick={() => turnPage(1)}
            className="pointer-events-auto w-14 h-14 rounded-full bg-white/70 backdrop-blur-sm shadow-lg
                       flex items-center justify-center text-2xl active:scale-90 transition-transform
                       animate-pulse"
          >
            ▶️
          </button>
        ) : (
          <button
            onClick={() => { setPage(0); celebratedRef.current = false; playSuccess(); }}
            className="pointer-events-auto w-14 h-14 rounded-full bg-sun/80 backdrop-blur-sm shadow-lg
                       flex items-center justify-center text-2xl active:scale-90 transition-transform
                       animate-bounce"
          >
            🔄
          </button>
        )}
      </div>

      <CelebrationLayer />
      <ParticleLayer />
    </div>
  );
}
