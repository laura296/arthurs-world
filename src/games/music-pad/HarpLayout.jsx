import React, { useRef, useCallback, useState } from 'react';
import { NATURAL_NOTES } from './noteData';

const N = NATURAL_NOTES.length;

// Warm gold-to-silver string colours
const STRING_COLORS = [
  '#fbbf24', '#e8bf3a', '#d4bf50', '#c0bf66',
  '#b0b87c', '#a4b090', '#b0b0a8', '#c0c0c0',
];

export default function HarpLayout({ active, onTap }) {
  const containerRef = useRef(null);
  const lastStringRef = useRef(-1);
  const isSwipingRef = useRef(false);
  const [touched, setTouched] = useState(false);

  const getStringIndex = useCallback((clientX) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return -1;
    const left = rect.width * 0.22;
    const right = rect.width * 0.88;
    const rel = clientX - rect.left - left;
    const idx = Math.floor((rel / (right - left)) * N);
    return Math.max(0, Math.min(N - 1, idx));
  }, []);

  const pluckString = useCallback((idx) => {
    if (idx < 0 || idx >= N) return;
    if (idx === lastStringRef.current) return;
    lastStringRef.current = idx;
    onTap(NATURAL_NOTES[idx], null);
  }, [onTap]);

  const handlePointerDown = useCallback((e) => {
    e.preventDefault();
    setTouched(true);
    isSwipingRef.current = true;
    lastStringRef.current = -1;
    containerRef.current?.setPointerCapture(e.pointerId);
    pluckString(getStringIndex(e.clientX));
  }, [getStringIndex, pluckString]);

  const handlePointerMove = useCallback((e) => {
    if (!isSwipingRef.current) return;
    pluckString(getStringIndex(e.clientX));
  }, [getStringIndex, pluckString]);

  const handlePointerUp = useCallback((e) => {
    isSwipingRef.current = false;
    lastStringRef.current = -1;
    containerRef.current?.releasePointerCapture(e.pointerId);
  }, []);

  // String geometry within the SVG viewBox (200×120 landscape)
  const strings = NATURAL_NOTES.map((note, i) => {
    const t = i / (N - 1);
    const x = 40 + t * 140;          // 40..180
    const topY = 14 + t * t * 42;    // neck curve: 14..56
    const botY = 100;
    return { note, x, topY, botY, color: STRING_COLORS[i] };
  });

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden rounded-2xl touch-none select-none"
      style={{ background: 'radial-gradient(ellipse at 30% 40%, #1e1b4b 0%, #0f172a 60%, #020617 100%)' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Subtle vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)',
      }} />

      <svg viewBox="0 0 200 120" className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          {/* Rich wood gradients */}
          <linearGradient id="hw1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="25%" stopColor="#d97706" />
            <stop offset="50%" stopColor="#b45309" />
            <stop offset="75%" stopColor="#92400e" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
          <linearGradient id="hw2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>
          <linearGradient id="hwBody" x1="0.2" y1="0" x2="0.8" y2="1">
            <stop offset="0%" stopColor="#b45309" />
            <stop offset="30%" stopColor="#92400e" />
            <stop offset="60%" stopColor="#78350f" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>
          <linearGradient id="hwHighlight" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
          </linearGradient>
          {/* Glow for active strings */}
          <filter id="sg">
            <feGaussianBlur stdDeviation="1.2" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* Soft shadow */}
          <filter id="shadow">
            <feDropShadow dx="1.5" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* === HARP BODY (soundboard / resonator) === */}
        <path
          d="M 28 102 L 185 102 L 185 58 Q 120 75, 28 102 Z"
          fill="url(#hwBody)"
          filter="url(#shadow)"
        />
        {/* Soundboard face highlight */}
        <path
          d="M 30 101 L 183 101 L 183 60 Q 120 76, 30 101 Z"
          fill="url(#hwHighlight)"
        />
        {/* Sound holes */}
        {[60, 100, 140].map(cx => (
          <ellipse key={cx} cx={cx} cy={96} rx="4" ry="2.2" fill="#451a03" opacity="0.5" />
        ))}

        {/* === PILLAR (curved column) === */}
        <path
          d="M 28 105 C 16 80, 12 45, 22 10"
          fill="none"
          stroke="url(#hw2)"
          strokeWidth="5"
          strokeLinecap="round"
          filter="url(#shadow)"
        />
        {/* Pillar highlight */}
        <path
          d="M 27 103 C 15.5 79, 11.5 44, 21.5 11"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.3"
        />

        {/* === NECK (curved top piece) === */}
        <path
          d="M 22 10 C 50 2, 100 8, 145 30 Q 165 40, 186 54"
          fill="none"
          stroke="url(#hw1)"
          strokeWidth="4.5"
          strokeLinecap="round"
          filter="url(#shadow)"
        />
        {/* Neck highlight */}
        <path
          d="M 23 9 C 50 1, 100 7, 145 29 Q 165 39, 185 53"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="0.6"
          strokeLinecap="round"
          opacity="0.25"
        />

        {/* === DECORATIVE ELEMENTS === */}
        {/* Crown/scroll at top of pillar */}
        <circle cx="22" cy="9" r="4" fill="url(#hw2)" filter="url(#shadow)" />
        <circle cx="22" cy="9" r="2.5" fill="#78350f" />
        <circle cx="22" cy="9" r="1" fill="#fbbf24" opacity="0.35" />
        {/* Spiral detail */}
        <path
          d="M 20 6 Q 18 4, 20 3 Q 23 2, 24 5"
          fill="none" stroke="#d97706" strokeWidth="0.8" opacity="0.6"
        />

        {/* Foot at base of pillar */}
        <ellipse cx="28" cy="106" rx="5" ry="2.5" fill="url(#hw1)" />
        <ellipse cx="28" cy="106" rx="3.5" ry="1.5" fill="#78350f" opacity="0.5" />

        {/* === TUNING PEGS === */}
        {strings.map((s, i) => (
          <g key={`peg-${i}`}>
            <circle cx={s.x} cy={s.topY - 2} r="1.8" fill="#5c3a1e" stroke="#92400e" strokeWidth="0.4" />
            <circle cx={s.x} cy={s.topY - 2} r="0.6" fill="#d97706" opacity="0.5" />
          </g>
        ))}

        {/* === STRINGS === */}
        {strings.map((s, i) => {
          const isActive = active === s.note.note;
          return (
            <g key={s.note.note}>
              {/* String shadow */}
              <line
                x1={s.x + 0.3} y1={s.topY} x2={s.x + 0.3} y2={s.botY}
                stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"
              />
              {/* String */}
              <line
                x1={s.x} y1={s.topY} x2={s.x} y2={s.botY}
                stroke={s.color}
                strokeWidth={isActive ? 0.9 : 0.4}
                opacity={isActive ? 1 : 0.75}
                filter={isActive ? 'url(#sg)' : undefined}
              >
                {isActive && (
                  <animate
                    attributeName="x1"
                    values={`${s.x};${s.x - 0.8};${s.x + 0.6};${s.x - 0.3};${s.x}`}
                    dur="0.3s"
                    repeatCount="1"
                  />
                )}
              </line>
            </g>
          );
        })}

        {/* String anchor points on soundboard */}
        {strings.map((s, i) => (
          <circle key={`anchor-${i}`} cx={s.x} cy={s.botY + 0.5} r="0.7" fill="#451a03" opacity="0.5" />
        ))}
      </svg>

      {/* Note labels */}
      <div className="absolute bottom-0.5 pointer-events-none flex" style={{ left: '20%', right: '6%' }}>
        {NATURAL_NOTES.map((noteObj, i) => {
          const isActive = active === noteObj.note;
          return (
            <span
              key={noteObj.note}
              className="flex-1 text-center text-[9px] font-bold"
              style={{
                color: isActive ? STRING_COLORS[i] : 'rgba(255,255,255,0.4)',
                textShadow: isActive ? `0 0 6px ${STRING_COLORS[i]}` : 'none',
                transition: 'color 0.15s',
              }}
            >
              {noteObj.note}
            </span>
          );
        })}
      </div>

      {/* Swipe hint — fades after first touch */}
      {!touched && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-white/30 text-xs font-medium animate-pulse drop-shadow">
            Swipe the strings ♪
          </span>
        </div>
      )}
    </div>
  );
}
