/**
 * Tortoise & Hare Race — A Simple Tap-to-Race Game
 *
 * The player taps anywhere to move the tortoise forward.
 * Every tap = full progress. No penalties, no fail states.
 * Steady tapping earns cosmetic sparkles (golden trail).
 * The hare sprints in bursts then gets distracted and always loses.
 *
 * Art style: Gouache on kraft paper (matte, earthy, pastoral).
 * Designed for a ~3.5 year old — forgiving, joyful, impossible to lose.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import BackButton from '../components/BackButton';
import { useCelebration } from '../components/CelebrationOverlay';
import { useParticleBurst } from '../components/ParticleBurst';
import { useArthurPeek } from '../components/ArthurPeek';

// ── Palette (Gouache on Kraft) ──────────────────────────────────────
const C = {
  kraft:      '#C4A882',
  grass:      '#5C7A4B',
  grassDark:  '#4A6A3B',
  buttercup:  '#D4A843',
  earth:      '#6B4E3D',
  sky:        '#8AAEC4',
  skyPale:    '#B8D4E3',
  purple:     '#8B5E83',
  pink:       '#C4788A',
  cream:      '#F5E6D0',
  shell:      '#5A7A4A',
  shellLight: '#7A9A6A',
  hareFur:    '#C4A060',
  hareDark:   '#8B7340',
  sun:        '#E8D070',
};

// ── Game Constants ──────────────────────────────────────────────────
const TAPS_TO_FINISH  = 50;  // taps to complete (reduced for toddler)
const BASE_INCREMENT  = 1 / TAPS_TO_FINISH;
const STEADY_LOW  = 0.4;     // cosmetic: steady range lower (seconds)
const STEADY_HIGH = 1.5;     // cosmetic: steady range upper
const HARE_WAKE_DELAY = 3;   // seconds without tap before hare catches up
const HARE_CATCH_SPEED = 0.12; // hare progress per second when catching up

// ── Hare Distractions (Phase 1: 3 of 10) ───────────────────────────
const DISTRACTIONS = [
  { id: 'D1', name: 'Napping',   duration: 6000 },
  { id: 'D2', name: 'Carrot',    duration: 5000 },
  { id: 'D4', name: 'Butterfly', duration: 5000 },
];

// ═══════════════════════════════════════════════════════════════════
//  AUDIO ENGINE  (Web Audio API — no file dependencies)
// ═══════════════════════════════════════════════════════════════════

const audioRef = { ctx: null };
function ctx() {
  if (!audioRef.ctx) audioRef.ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioRef.ctx.state === 'suspended') audioRef.ctx.resume();
  return audioRef.ctx;
}
function muted() { return !!window.__arthurMuted; }

/** Soft hand-drum hit — the constant rhythm reference */
function playDrum() {
  if (muted()) return;
  const c = ctx(), t = c.currentTime;
  const n = c.sampleRate * 0.08;
  const buf = c.createBuffer(1, n, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
  const src = c.createBufferSource(); src.buffer = buf;
  const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 200; bp.Q.value = 1;
  const g = c.createGain();
  g.gain.setValueAtTime(0.15, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
  src.connect(bp).connect(g).connect(c.destination);
  src.start(t); src.stop(t + 0.15);
}

/** Tortoise footstep — cheerful thump on every tap */
function playFootstep() {
  if (muted()) return;
  const c = ctx(), t = c.currentTime;
  const osc = c.createOscillator(), g = c.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(120, t);
  osc.frequency.exponentialRampToValueAtTime(60, t + 0.1);
  g.gain.setValueAtTime(0.25, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
  osc.connect(g).connect(c.destination);
  osc.start(t); osc.stop(t + 0.15);
}

/** Hare rapid footsteps */
function playHareSprint() {
  if (muted()) return;
  const c = ctx(), t = c.currentTime;
  for (let i = 0; i < 4; i++) {
    const o = c.createOscillator(), g = c.createGain();
    o.type = 'triangle'; o.frequency.value = 500 + Math.random() * 200;
    g.gain.setValueAtTime(0.08, t + i * 0.06);
    g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.06 + 0.04);
    o.connect(g).connect(c.destination);
    o.start(t + i * 0.06); o.stop(t + i * 0.06 + 0.05);
  }
}

/** Finish ribbon snap */
function playRibbonSnap() {
  if (muted()) return;
  const c = ctx(), t = c.currentTime;
  const n = c.sampleRate * 0.05;
  const buf = c.createBuffer(1, n, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 3);
  const src = c.createBufferSource(); src.buffer = buf;
  const g = c.createGain();
  g.gain.setValueAtTime(0.4, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
  src.connect(g).connect(c.destination);
  src.start(t); src.stop(t + 0.08);
}

/** Warm bell — sportsmanship moment */
function playBell() {
  if (muted()) return;
  const c = ctx(), t = c.currentTime;
  const o = c.createOscillator(), g = c.createGain();
  o.type = 'sine'; o.frequency.value = 523;
  g.gain.setValueAtTime(0.2, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 1.5);
  o.connect(g).connect(c.destination);
  o.start(t); o.stop(t + 1.5);
}

// ── Drum Loop ───────────────────────────────────────────────────────
class DrumLoop {
  constructor() { this.iv = null; this.bpm = 65; }
  start() {
    this.stop();
    const ms = (60 / this.bpm) * 1000;
    playDrum();
    this.iv = setInterval(() => playDrum(), ms);
  }
  stop() { if (this.iv) { clearInterval(this.iv); this.iv = null; } }
}

// ═══════════════════════════════════════════════════════════════════
//  CHARACTER SPRITES (generated cartoon images)
// ═══════════════════════════════════════════════════════════════════

const SPRITE_BASE = '/arthurs-world/assets/characters/tortoise-hare-race';
const HARE_IMAGES = {
  sleeping:    `${SPRITE_BASE}/hare-sleeping.webp`,
  distraction: `${SPRITE_BASE}/hare-sleeping.webp`,
  sprinting:   `${SPRITE_BASE}/hare-running.webp`,
  chasing:     `${SPRITE_BASE}/hare-panic.webp`,
  panic:       `${SPRITE_BASE}/hare-panic.webp`,
};

function TortoiseSprite({ size = 80, winner = false }) {
  return (
    <img
      src={winner ? `${SPRITE_BASE}/tortoise-winner.webp` : `${SPRITE_BASE}/tortoise-walking.webp`}
      alt="Tortoise"
      width={size}
      height={size}
      className="select-none pointer-events-none"
      style={{ objectFit: 'contain' }}
      draggable={false}
    />
  );
}

function HareSprite({ hareState = 'sprinting', size = 70 }) {
  const src = HARE_IMAGES[hareState] || `${SPRITE_BASE}/hare-running.webp`;
  return (
    <img
      src={src}
      alt="Hare"
      width={size}
      height={size}
      className="select-none pointer-events-none"
      style={{ objectFit: 'contain' }}
      draggable={false}
    />
  );
}

// ═══════════════════════════════════════════════════════════════════
//  MEADOW ENVIRONMENT (4-layer parallax)
// ═══════════════════════════════════════════════════════════════════

function MeadowBackground({ scrollX }) {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: C.kraft }}>
      {/* Generated background (slow parallax) */}
      <img
        src={`${SPRITE_BASE}/race-background.webp`}
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
        style={{ transform: `translateX(${-scrollX * 0.15}px) scale(1.2)`, transformOrigin: 'left center' }}
        draggable={false}
      />

      {/* Sky gradient overlay for depth */}
      <div className="absolute inset-0" style={{
        transform: `translateX(${-scrollX * 0.1}px)`, width: '200%',
        background: `linear-gradient(180deg, transparent 0%, transparent 40%, ${C.kraft}40 75%)`,
      }} />

      {/* Sun */}
      <div className="absolute" style={{
        left: `${300 - scrollX * 0.08}px`, top: '30px',
        width: '80px', height: '80px', borderRadius: '50%',
        background: `radial-gradient(circle, ${C.sun} 40%, ${C.buttercup})`,
        opacity: 0.9, filter: 'blur(1px)',
      }} />

      {/* Distant hills (0.1x) */}
      <svg className="absolute bottom-0" style={{ transform: `translateX(${-scrollX * 0.1}px)`, width: '250%' }}
        height="300" viewBox="0 0 2500 300" preserveAspectRatio="none">
        <path d="M0 250 Q200 140 400 200 Q600 120 900 190 Q1100 100 1400 180 Q1600 90 1900 170 Q2100 130 2500 200 L2500 300 L0 300Z"
          fill={C.grass} opacity="0.3" />
      </svg>

      {/* Midground trees (0.4x) */}
      <div className="absolute bottom-0" style={{ transform: `translateX(${-scrollX * 0.4}px)`, width: '300%' }}>
        {[100, 400, 700, 1050, 1400, 1800, 2200].map((x, i) => {
          const canopyW = 50 + (i % 3) * 15;
          const canopyH = 40 + (i % 2) * 20;
          return (
          <div key={i} className="absolute" style={{ left: `${x}px`, bottom: '120px' }}>
            {/* Canopy (on top) */}
            <div style={{
              width: `${canopyW}px`, height: `${canopyH}px`,
              background: i % 2 === 0 ? C.grass : C.grassDark,
              borderRadius: '50% 50% 40% 40%',
              marginLeft: `${-canopyW / 2 + 6}px`, opacity: 0.8,
            }} />
            {/* Trunk (below) */}
            <div style={{ width: '12px', height: '40px', background: C.earth, borderRadius: '2px', marginLeft: 'auto', marginRight: 'auto', marginTop: '-10px' }} />
          </div>
          );
        })}
        {/* Stone walls */}
        {[250, 850, 1600].map((x, i) => (
          <div key={`w${i}`} className="absolute" style={{
            left: `${x}px`, bottom: '100px', width: '120px', height: '20px',
            background: 'linear-gradient(90deg, #9B9B8A, #8B8B7A, #9B9B8A)',
            borderRadius: '2px', opacity: 0.6,
          }} />
        ))}
      </div>

      {/* Rolling hills / path layer (0.8x) */}
      <svg className="absolute bottom-0" style={{ transform: `translateX(${-scrollX * 0.8}px)`, width: '400%' }}
        height="200" viewBox="0 0 4000 200" preserveAspectRatio="none">
        <path d="M0 150 Q200 100 500 130 Q800 80 1100 120 Q1400 70 1700 110 Q2000 60 2300 100 Q2600 70 2900 110 Q3200 80 3500 120 L4000 130 L4000 200 L0 200Z"
          fill={C.grass} opacity="0.6" />
      </svg>

      {/* Dirt path */}
      <div className="absolute bottom-0 left-0" style={{
        transform: `translateX(${-scrollX * 0.8}px)`, width: '400%', height: '60px',
        background: `linear-gradient(180deg, ${C.earth}80, ${C.kraft}90, ${C.earth}60)`,
        borderTop: `2px solid ${C.earth}40`,
      }} />

      {/* Foreground flowers + grass (1.0x) */}
      <div className="absolute bottom-0" style={{ transform: `translateX(${-scrollX}px)`, width: '500%' }}>
        {Array.from({ length: 30 }, (_, i) => {
          const x = i * 170 + (i * 47 % 60);
          const bottom = i % 2 === 0 ? 55 : 62;
          const colors = [C.buttercup, C.pink, C.purple, C.cream, '#E8A0A0'];
          return (
            <div key={i} className="absolute" style={{ left: `${x}px`, bottom: `${bottom}px` }}>
              <div style={{ width: '2px', height: '16px', background: C.grass, margin: '0 auto' }} />
              <div style={{
                width: `${8 + (i % 3) * 3}px`, height: `${8 + (i % 3) * 3}px`,
                borderRadius: '50%', background: colors[i % colors.length],
                marginTop: '-3px', marginLeft: '-4px',
              }} />
            </div>
          );
        })}
        {Array.from({ length: 20 }, (_, i) => (
          <div key={`g${i}`} className="absolute" style={{
            left: `${i * 250 + 80}px`, bottom: '50px', width: '30px', height: '25px',
            borderRadius: '50% 50% 0 0',
            background: `linear-gradient(0deg, ${C.grass}, ${C.grassDark})`, opacity: 0.5,
          }} />
        ))}
      </div>

      {/* Clouds */}
      {[80, 350, 650, 950].map((x, i) => (
        <div key={`c${i}`} className="absolute" style={{
          left: `${x - scrollX * 0.05 + i * 20}px`, top: `${20 + (i % 3) * 25}px`,
          width: `${60 + i * 15}px`, height: `${25 + i * 5}px`,
          borderRadius: '50%', background: 'rgba(255,255,255,0.6)', filter: 'blur(2px)',
        }} />
      ))}
    </div>
  );
}

/** Flower pulses at sweet-spot tempo */
function FlowerPulses({ scrollX, pulsePhase }) {
  const s = 1 + Math.sin(pulsePhase) * 0.15;
  return (
    <div className="absolute bottom-0 pointer-events-none"
      style={{ transform: `translateX(${-scrollX}px)`, width: '500%' }}>
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="absolute" style={{
          left: `${100 + i * 500}px`, bottom: '65px',
          width: '20px', height: '20px', borderRadius: '50%',
          background: i % 2 === 0 ? C.buttercup : C.pink,
          transform: `scale(${s})`, opacity: 0.7,
          transition: 'transform 0.15s ease-out',
        }} />
      ))}
    </div>
  );
}

/** Golden dust trail — sweet spot only */
function GoldenTrail({ particles }) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map(p => (
        <div key={p.id} className="absolute rounded-full" style={{
          left: `${p.x}px`, top: `${p.y}px`,
          width: `${p.size}px`, height: `${p.size}px`,
          background: `radial-gradient(circle, ${C.buttercup}, ${C.sun})`,
          opacity: p.opacity, transform: `translateY(${p.dy}px)`,
          transition: 'opacity 0.3s, transform 0.3s',
        }} />
      ))}
    </div>
  );
}

// ── Small UI components ─────────────────────────────────────────────

function FinishLine({ visible, broken, screenX }) {
  if (!visible) return null;
  return (
    <div className="absolute" style={{ left: `${screenX}px`, bottom: '30px', width: '100px', height: '160px', transition: 'left 0.1s linear' }}>
      {/* Left post */}
      <div className="absolute left-0 bottom-0" style={{
        width: '10px', height: '140px', borderRadius: '3px',
        background: `repeating-linear-gradient(0deg, #E84040, #E84040 10px, ${C.cream} 10px, ${C.cream} 20px)`,
      }} />
      {/* Right post */}
      <div className="absolute right-0 bottom-0" style={{
        width: '10px', height: '140px', borderRadius: '3px',
        background: `repeating-linear-gradient(0deg, #E84040, #E84040 10px, ${C.cream} 10px, ${C.cream} 20px)`,
      }} />
      {/* Banner */}
      {!broken && (
        <div className="absolute" style={{
          left: '5px', right: '5px', top: '0px', height: '30px', borderRadius: '4px',
          background: `repeating-linear-gradient(90deg, ${C.cream}, ${C.cream} 8px, #E84040 8px, #E84040 16px)`,
          border: `2px solid #E84040`,
          boxShadow: '0 3px 8px rgba(0,0,0,0.15)',
        }} />
      )}
      {broken && (
        <>
          <div className="absolute" style={{
            left: '-15px', top: '5px', width: '45px', height: '14px',
            background: `repeating-linear-gradient(90deg, ${C.cream}, ${C.cream} 6px, #E84040 6px, #E84040 12px)`,
            borderRadius: '3px', transform: 'rotate(-25deg)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
          }} />
          <div className="absolute" style={{
            right: '-15px', top: '5px', width: '45px', height: '14px',
            background: `repeating-linear-gradient(90deg, ${C.cream}, ${C.cream} 6px, #E84040 6px, #E84040 12px)`,
            borderRadius: '3px', transform: 'rotate(25deg)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
          }} />
        </>
      )}
      {/* Top ornaments */}
      <div className="absolute" style={{
        left: '-3px', top: '-10px', width: '16px', height: '16px',
        borderRadius: '50%', background: C.buttercup, border: `2px solid ${C.earth}`,
      }} />
      <div className="absolute" style={{
        right: '-3px', top: '-10px', width: '16px', height: '16px',
        borderRadius: '50%', background: C.buttercup, border: `2px solid ${C.earth}`,
      }} />
    </div>
  );
}

function SleepZs() {
  return (
    <div className="absolute -top-8 -right-2 pointer-events-none">
      {[0, 1, 2].map(i => (
        <span key={i} className="absolute font-heading" style={{
          color: C.buttercup, fontSize: `${14 - i * 2}px`,
          opacity: 0.6 - i * 0.15,
          top: `${-i * 12}px`, left: `${i * 8}px`,
          animation: `float ${2 + i * 0.3}s ease-in-out infinite`,
          animationDelay: `${i * 0.4}s`,
        }}>Z</span>
      ))}
    </div>
  );
}

function DustClouds({ active }) {
  if (!active) return null;
  return (
    <div className="absolute -left-6 bottom-0 pointer-events-none">
      {[0, 1, 2].map(i => (
        <div key={i} className="absolute rounded-full" style={{
          width: `${10 + i * 4}px`, height: `${8 + i * 3}px`,
          background: C.kraft, opacity: 0.5 - i * 0.12,
          left: `${-i * 8}px`, bottom: `${2 + i * 6}px`,
          animation: `thr-dustPuff 0.6s ease-out ${i * 0.1}s infinite`,
        }} />
      ))}
    </div>
  );
}

function ConfettiBurst({ active }) {
  if (!active) return null;
  const colors = [C.buttercup, C.pink, C.purple, C.sky, C.grass, '#E84040', C.cream];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
      {Array.from({ length: 30 }, (_, i) => (
        <div key={i} className="absolute" style={{
          width: `${6 + (i % 4) * 3}px`, height: `${6 + (i % 3) * 3}px`,
          background: colors[i % colors.length],
          left: `${30 + (i * 37 % 40)}%`, top: '-10px',
          animation: `thr-confettiFall ${1.5 + (i % 5) * 0.3}s ease-in ${i * 0.05}s forwards`,
          borderRadius: i % 3 === 0 ? '50%' : '2px',
        }} />
      ))}
    </div>
  );
}

// ── Intro ───────────────────────────────────────────────────────────

function IntroScreen({ onStart }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-[60]"
      style={{ background: C.kraft }}
      onPointerDown={e => e.stopPropagation()}>
      {/* Full-bleed intro scene image */}
      <img
        src={`${SPRITE_BASE}/intro-scene.webp`}
        alt="Tortoise and Hare at the starting line"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.85 }}
        draggable={false}
      />
      {/* Overlay card */}
      <div className="relative p-8 rounded-3xl z-10" style={{
        background: `${C.cream}E8`,
        boxShadow: `0 8px 32px ${C.earth}40`,
        border: `3px solid ${C.earth}40`,
        maxWidth: '400px',
        backdropFilter: 'blur(8px)',
      }}>
        <h1 className="font-heading text-center mb-4" style={{ color: C.earth, fontSize: '28px' }}>
          Tortoise & Hare
        </h1>
        <div className="flex items-end justify-center gap-6 mb-6">
          <TortoiseSprite size={90} />
          <HareSprite hareState="sprinting" size={70} />
        </div>
        <button onPointerDown={(e) => { e.stopPropagation(); onStart(); }}
          className="w-full py-5 rounded-2xl font-heading text-xl active:scale-95 transition-transform"
          style={{
            background: `linear-gradient(135deg, ${C.grass}, ${C.grassDark})`,
            color: C.cream, boxShadow: `0 4px 12px ${C.grass}60`, border: 'none',
          }}>
          Tap to Race!
        </button>
      </div>
    </div>
  );
}

function HareWinsOverlay({ onRetry }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-[60]"
      style={{ background: 'rgba(0,0,0,0.25)' }}
      onPointerDown={e => e.stopPropagation()}>
      <div className="p-8 rounded-3xl text-center" style={{
        background: `linear-gradient(135deg, ${C.cream}, ${C.kraft})`,
        boxShadow: `0 8px 32px ${C.earth}40`,
        border: `3px solid ${C.earth}40`,
        maxWidth: '380px',
      }}>
        <div className="flex items-end justify-center gap-6 mb-4">
          <HareSprite hareState="sprinting" size={65} />
          <TortoiseSprite size={70} />
        </div>
        <p className="font-heading text-xl mb-2" style={{ color: C.earth }}>
          The hare won!
        </p>
        <p className="font-body text-sm mb-5" style={{ color: C.earth, opacity: 0.7 }}>
          Keep tapping next time!
        </p>
        <button onPointerDown={(e) => { e.stopPropagation(); onRetry(); }}
          className="w-full py-4 rounded-2xl font-heading text-lg active:scale-95 transition-transform"
          style={{
            background: `linear-gradient(135deg, ${C.grass}, ${C.grassDark})`,
            color: C.cream, boxShadow: `0 4px 12px ${C.grass}60`, border: 'none',
          }}>
          Race Again!
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════

const KEYFRAMES = `
@keyframes thr-dustPuff {
  0% { transform: scale(1) translateX(0); opacity: 0.5; }
  100% { transform: scale(1.5) translateX(-12px); opacity: 0; }
}
@keyframes thr-confettiFall {
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(80vh) rotate(720deg); opacity: 0.3; }
}
@keyframes thr-walk {
  0%,100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-2px) rotate(-1deg); }
  75% { transform: translateY(-2px) rotate(1deg); }
}
@keyframes thr-sprint {
  0%,100% { transform: translateX(0) translateY(0); }
  25% { transform: translateX(3px) translateY(-2px); }
  75% { transform: translateX(3px) translateY(-1px); }
}
@keyframes thr-breathe {
  0%,100% { transform: scaleY(1); }
  50% { transform: scaleY(1.03); }
}
`;

export default function TortoiseHareRace() {
  // ── State ─────────────────────────────────────────────────────
  const [phase, setPhase]           = useState('intro');
  const [tortoisePos, setTortoisePos] = useState(0);
  const [harePos, setHarePos]       = useState(0);
  const [hareState, setHareState]   = useState('sprinting');
  const [ribbonBroken, setRibbonBroken] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [trailState, setTrailState] = useState([]);
  const [pulseVal, setPulseVal]     = useState(0);
  const [isSteady, setIsSteady]     = useState(false); // cosmetic sparkle state
  const [hareWaking, setHareWaking] = useState(false); // warning: hare is about to catch up

  // Refs (non-rendered values kept in sync for rAF / timer closures)
  const lastTapTime      = useRef(0);
  const inactivityTimer  = useRef(0);
  const drumLoopRef      = useRef(null);
  const frameRef         = useRef(null);
  const tortRef          = useRef(0);
  const hareRef          = useRef(0);
  const hsRef            = useRef('sprinting');
  const phRef            = useRef('intro');
  const trailParts       = useRef([]);
  const nextPid          = useRef(0);
  const pulseRef         = useRef(0);
  const hareTimer        = useRef(null);
  const distrIdx         = useRef(0);
  const tapCount         = useRef(0);
  const { celebrate, CelebrationLayer } = useCelebration();
  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();

  // Sync refs
  useEffect(() => { phRef.current = phase; },       [phase]);
  useEffect(() => { tortRef.current = tortoisePos; },[tortoisePos]);
  useEffect(() => { hareRef.current = harePos; },   [harePos]);
  useEffect(() => { hsRef.current = hareState; },    [hareState]);

  // ── Inject keyframes ──────────────────────────────────────────
  useEffect(() => {
    const id = 'thr-keyframes';
    if (!document.getElementById(id)) {
      const s = document.createElement('style'); s.id = id; s.textContent = KEYFRAMES;
      document.head.appendChild(s);
    }
    return () => { const el = document.getElementById(id); if (el) el.remove(); };
  }, []);

  // ── Drum loop ─────────────────────────────────────────────────
  useEffect(() => {
    if (phase === 'racing') {
      if (!drumLoopRef.current) drumLoopRef.current = new DrumLoop();
      drumLoopRef.current.start();
    } else {
      drumLoopRef.current?.stop();
    }
    return () => drumLoopRef.current?.stop();
  }, [phase]);

  // ── Game loop (rAF) ───────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'racing') return;
    let last = performance.now();

    function loop(now) {
      const dt = (now - last) / 1000;
      last = now;

      // Track inactivity
      if (lastTapTime.current > 0) {
        inactivityTimer.current += dt;
      }

      // Flower pulse (65 BPM cycle)
      pulseRef.current += dt * (2 * Math.PI) / (60 / 65);
      setPulseVal(pulseRef.current);

      // Hare position — depends on whether child is tapping
      const tp = tortRef.current, hp = hareRef.current, hs = hsRef.current;
      const inactive = inactivityTimer.current >= HARE_WAKE_DELAY;
      // Show warning at 2 seconds (1 second before hare wakes)
      setHareWaking(inactivityTimer.current >= 2 && lastTapTime.current > 0);

      if (inactive) {
        // Hare wakes up and catches up when child stops tapping!
        if (hs !== 'chasing' && hs !== 'sprinting') {
          setHareState('chasing'); hsRef.current = 'chasing';
          playHareSprint();
        }
        setHarePos(Math.min(hp + HARE_CATCH_SPEED * dt, 1.0));
      } else if (tp < 0.66) {
        // Normal: hare leads by a bit (sprinting/distracted)
        const lead = hs === 'sprinting' ? 0.28 : 0.15;
        const target = tp + lead;
        setHarePos(Math.min(hp + (target - hp) * dt * 0.5, 0.95));
      } else if (hs === 'chasing') {
        // Final third: hare chases but can't quite catch up if child is tapping
        const target = tp - 0.05;
        setHarePos(Math.max(hp + (target - hp) * dt * 0.8, hp));
      }

      // Trail particles fade
      if (trailParts.current.length > 0) {
        trailParts.current = trailParts.current
          .map(p => ({ ...p, opacity: p.opacity - dt * 0.8, dy: p.dy - dt * 30 }))
          .filter(p => p.opacity > 0);
        setTrailState([...trailParts.current]);
      }

      // Finish check — tortoise wins or hare overtakes
      if (tp >= 1.0) { setPhase('finish'); return; }
      if (hp >= 1.0) { setPhase('hare-wins'); return; }

      frameRef.current = requestAnimationFrame(loop);
    }
    frameRef.current = requestAnimationFrame(loop);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [phase]);

  // ── Hare behaviour script ─────────────────────────────────────
  useEffect(() => {
    if (phase !== 'racing') return;

    function run() {
      if (tortRef.current >= 0.6) {
        // Final third: sleep then wake when tortoise passes
        setHareState('sleeping'); hsRef.current = 'sleeping';
        const check = setInterval(() => {
          if (tortRef.current > hareRef.current - 0.02) {
            clearInterval(check);
            setHareState('chasing'); hsRef.current = 'chasing';
            playHareSprint();
          }
        }, 300);
        hareTimer.current = check;
        return;
      }

      // Sprint
      setHareState('sprinting'); hsRef.current = 'sprinting';
      playHareSprint();
      const sprintMs = 2000 + Math.random() * 1000;

      hareTimer.current = setTimeout(() => {
        // Distraction
        const d = DISTRACTIONS[distrIdx.current % DISTRACTIONS.length];
        distrIdx.current++;
        setHareState('distraction'); hsRef.current = 'distraction';
        const dur = d.duration;

        hareTimer.current = setTimeout(() => {
          if (phRef.current === 'racing') run();
        }, dur);
      }, sprintMs);
    }

    const t = setTimeout(run, 500);
    return () => {
      clearTimeout(t);
      if (hareTimer.current) { clearTimeout(hareTimer.current); clearInterval(hareTimer.current); }
    };
  }, [phase]);

  // ── Finish sequence (tortoise wins!) ─────────────────────────
  useEffect(() => {
    if (phase !== 'finish') return;
    playRibbonSnap();
    setRibbonBroken(true);
    setTimeout(() => setShowConfetti(true), 200);
    setHareState('panic');
    peek('excited');
    // Burst at centre screen
    burst(window.innerWidth / 2, window.innerHeight * 0.5, {
      count: 20, spread: 100,
      colors: [C.buttercup, C.grass, C.pink, C.sky],
      shapes: ['star', 'heart'],
    });
    setTimeout(() => {
      setPhase('celebration');
      celebrate({ message: 'Slow and Steady Wins!', colors: [C.buttercup, C.grass, C.pink, C.sky] });
    }, 1500);
    setTimeout(playBell, 2500);
  }, [phase, celebrate, peek, burst]);

  // ── Hare wins sequence ──────────────────────────────────────
  useEffect(() => {
    if (phase !== 'hare-wins') return;
    playHareSprint();
    setRibbonBroken(true);
    setHareState('sprinting');
  }, [phase]);

  // ── Tap handler (every tap = full progress!) ──────────────────
  const handleTap = useCallback(() => {
    if (phRef.current !== 'racing') return;

    const now = performance.now();
    inactivityTimer.current = 0;
    setHareWaking(false);
    tapCount.current++;

    // Check if tapping is roughly steady (cosmetic only — sparkles!)
    if (lastTapTime.current > 0) {
      const interval = (now - lastTapTime.current) / 1000;
      setIsSteady(interval >= STEADY_LOW && interval <= STEADY_HIGH);
    }
    lastTapTime.current = now;

    // Every tap = same progress, always!
    playFootstep();
    setTortoisePos(p => Math.min(p + BASE_INCREMENT, 1));

    // Sparkle trail (always spawns, bigger when steady)
    spawnTrail();

    // Arthur peek at milestones
    if (tapCount.current === 15) peek('happy');
    if (tapCount.current === 35) peek('excited');
  }, [peek]);

  function spawnTrail() {
    trailParts.current.push({
      id: nextPid.current++,
      x: 140 + Math.random() * 20,
      y: window.innerHeight * 0.68 + Math.random() * 10,
      size: 4 + Math.random() * 4,
      opacity: 0.8, dy: 0,
    });
    if (trailParts.current.length > 30) trailParts.current.shift();
  }

  // ── Start / resume ────────────────────────────────────────────
  const startRace = useCallback(() => {
    setPhase('racing');
    setTortoisePos(0); setHarePos(0.15);
    setHareState('sprinting'); setIsSteady(false); setHareWaking(false);
    inactivityTimer.current = 0; lastTapTime.current = 0;
    tapCount.current = 0;
    trailParts.current = []; distrIdx.current = 0;
    setRibbonBroken(false); setShowConfetti(false);
  }, []);

  const resumeRace = useCallback(() => {
    setPhase('racing');
    inactivityTimer.current = 0;
  }, []);

  // ── Derived layout ────────────────────────────────────────────
  const maxScroll = 3000;
  const scrollX = tortoisePos * maxScroll;
  // Tortoise slides rightward as it approaches finish (last 15%)
  const finishSlide = tortoisePos > 0.85 ? (tortoisePos - 0.85) / 0.15 : 0;
  const tortoiseScreenX = 140 + finishSlide * 200;
  const hareScreenX = tortoiseScreenX + (harePos - tortoisePos) * 800;
  // Finish line is at a fixed world position — scrolls into view
  const finishWorldX = maxScroll + 200; // just past the end of the course
  const finishScreenX = finishWorldX - scrollX;

  // Rolling hills — compound wave for natural-feeling terrain
  function hillY(pos) {
    return Math.sin(pos * Math.PI * 4) * 25
         + Math.sin(pos * Math.PI * 7 + 1) * 12
         + Math.sin(pos * Math.PI * 2.5) * 15;
  }
  const pathY = hillY(tortoisePos);
  const harePathY = hillY(harePos);

  const tortAnim = phase === 'racing' ? 'thr-walk 0.9s ease-in-out infinite' : '';

  let hareAnim = '';
  if (hareState === 'sprinting' || hareState === 'chasing' || hareState === 'panic')
    hareAnim = 'thr-sprint 0.25s ease-in-out infinite';
  else if (hareState === 'sleeping' || hareState === 'distraction')
    hareAnim = 'thr-breathe 2s ease-in-out infinite';

  const showFinish = tortoisePos > 0.7;

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="w-full h-full relative overflow-hidden select-none"
      style={{ background: C.kraft, touchAction: 'manipulation' }}
      onPointerDown={phase === 'racing' ? handleTap : undefined}>

      <BackButton />
      <CelebrationLayer />
      <ParticleLayer />
      <ArthurPeekLayer />

      {phase === 'intro' && <IntroScreen onStart={startRace} />}

      {(phase === 'racing' || phase === 'finish' || phase === 'celebration' || phase === 'hare-wins') && (
        <>
          <MeadowBackground scrollX={scrollX} />
          <FlowerPulses scrollX={scrollX} pulsePhase={pulseVal} />
          <GoldenTrail particles={trailState} />
          <FinishLine visible={showFinish} broken={ribbonBroken} screenX={finishScreenX} />
          <ConfettiBurst active={showConfetti} />

          {/* Characters */}
          <div className="absolute left-0 right-0" style={{ bottom: '50px' }}>
            {/* Hare */}
            <div className="absolute" style={{
              left: `${Math.max(hareScreenX, -100)}px`,
              bottom: `${10 + harePathY}px`,
              animation: hareAnim, transition: 'left 0.3s ease-out',
            }}>
              <div className="relative">
                <HareSprite hareState={hareState} size={75} />
                {(hareState === 'sleeping' || hareState === 'distraction') && <SleepZs />}
                <DustClouds active={hareState === 'sprinting' || hareState === 'chasing'} />
              </div>
            </div>
            {/* Tortoise */}
            <div className="absolute" style={{
              left: `${tortoiseScreenX}px`,
              bottom: `${8 + pathY}px`,
              animation: tortAnim,
            }}>
              <TortoiseSprite size={90} />
            </div>
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{
              background: `${C.kraft}CC`, backdropFilter: 'blur(4px)',
              border: `2px solid ${C.grass}60`,
            }}>
              <span style={{ fontSize: '18px' }}>🐢</span>
              <div style={{
                width: '120px', height: '8px',
                background: `${C.earth}30`, borderRadius: '4px', overflow: 'hidden',
              }}>
                <div style={{
                  width: `${tortoisePos * 100}%`, height: '100%',
                  background: `linear-gradient(90deg, ${C.grass}, ${C.buttercup})`,
                  borderRadius: '4px', transition: 'width 0.2s ease-out',
                }} />
              </div>
              <span style={{ fontSize: '18px' }}>🏁</span>
            </div>
          </div>

          {/* Tap prompt (start) or "Keep tapping!" warning */}
          {phase === 'racing' && (tortoisePos < 0.05 && tapCount.current === 0) && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <div className="px-6 py-4 rounded-2xl animate-pulse" style={{
                background: `${C.kraft}E0`, border: `2px solid ${C.buttercup}60`,
              }}>
                <span className="font-heading text-lg" style={{ color: C.earth }}>
                  Tap! Tap! Tap!
                </span>
              </div>
            </div>
          )}
          {phase === 'racing' && hareWaking && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-none z-20">
              <div className="px-5 py-3 rounded-2xl animate-bounce" style={{
                background: `${C.hareFur}E0`, border: `2px solid #E84040`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}>
                <span className="font-heading text-base" style={{ color: '#E84040' }}>
                  🐰 Keep tapping!
                </span>
              </div>
            </div>
          )}
        </>
      )}

      {phase === 'hare-wins' && <HareWinsOverlay onRetry={startRace} />}
    </div>
  );
}
