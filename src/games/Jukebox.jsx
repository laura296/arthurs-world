import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import BackButton from '../components/BackButton';
import { playPop } from '../hooks/useSound';

/**
 * Jukebox — Arthur's song player.
 * A grid of illustrated song cards. Tap one to play the real song
 * via an embedded YouTube player. Visual feedback while playing.
 * All card illustrations are SVG — no emoji.
 */

/* ── Song data with YouTube video IDs ── */
const SONGS = [
  {
    id: 'baby-shark',
    title: 'Baby Shark',
    colour: '#38bdf8',
    accentColour: '#0ea5e9',
    youtubeId: 'XqZsoesa55w',
  },
  {
    id: 'sleeping-bunnies',
    title: 'Sleeping Bunnies',
    colour: '#c084fc',
    accentColour: '#a855f7',
    youtubeId: 'wYrNcWrnQa0',
  },
  {
    id: 'let-it-go',
    title: 'Let It Go',
    colour: '#a5f3fc',
    accentColour: '#22d3ee',
    youtubeId: 'L0MK7qz13bU',
  },
  {
    id: 'yo-ho-pirate',
    title: 'Yo Ho Pirate Song',
    colour: '#fbbf24',
    accentColour: '#f59e0b',
    youtubeId: 'ifu4c4P-bak',
  },
  {
    id: 'bluey-intro',
    title: 'Bluey',
    colour: '#60a5fa',
    accentColour: '#3b82f6',
    youtubeId: 'uyJMydFeM0Q',
  },
  {
    id: 'wheels-on-bus',
    title: 'Wheels on the Bus',
    colour: '#fb923c',
    accentColour: '#f97316',
    youtubeId: 'e_04ZrNroTo',
  },
  {
    id: 'twinkle-twinkle',
    title: 'Twinkle Twinkle',
    colour: '#fde68a',
    accentColour: '#d97706',
    youtubeId: 'yCjJyiqpAuU',
  },
  {
    id: 'frere-jacques',
    title: 'Frere Jacques',
    colour: '#86efac',
    accentColour: '#16a34a',
    youtubeId: 'Lxrzmg-dnmc',
  },
  {
    id: 'happy-and-you-know-it',
    title: 'If You\'re Happy',
    colour: '#fca5a5',
    accentColour: '#ef4444',
    youtubeId: 'l4WNrvVjiTw',
  },
  {
    id: 'head-shoulders',
    title: 'Head Shoulders',
    colour: '#93c5fd',
    accentColour: '#3b82f6',
    youtubeId: 'WX8HmogNyCY',
  },
  {
    id: 'baa-baa-black-sheep',
    title: 'Baa Baa Black Sheep',
    colour: '#a3a3a3',
    accentColour: '#525252',
    youtubeId: 'MR5XSOdjKMA',
  },
  {
    id: 'alphabet-song',
    title: 'Alphabet Song',
    colour: '#d8b4fe',
    accentColour: '#9333ea',
    youtubeId: 'hq3yfQnllfQ',
  },
  {
    id: 'teddy-bears-picnic',
    title: 'Teddy Bears\' Picnic',
    colour: '#a16207',
    accentColour: '#854d0e',
    youtubeId: 'dZANKFxrcKU',
  },
  {
    id: 'incy-wincy-spider',
    title: 'Incy Wincy Spider',
    colour: '#6b7280',
    accentColour: '#374151',
    youtubeId: 'jzA3WE2bLVE',
  },
  {
    id: 'im-a-little-teapot',
    title: 'I\'m a Little Teapot',
    colour: '#f9a8d4',
    accentColour: '#ec4899',
    youtubeId: 'jAd3qdSLDxg',
  },
];

/* ─── SVG Song Illustrations ─── */

function SharkIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <ellipse cx="50" cy="52" rx="36" ry="24" fill="#38bdf8" />
      <ellipse cx="50" cy="54" rx="32" ry="20" fill="#7dd3fc" opacity="0.4" />
      <path d="M50,28 L55,42 L45,42 Z" fill="#38bdf8" />
      <path d="M14,52 L26,44 L22,56 Z" fill="#38bdf8" />
      <circle cx="38" cy="48" r="4" fill="white" />
      <circle cx="38" cy="48" r="2.5" fill="#1e293b" />
      <circle cx="39" cy="47" r="1" fill="white" />
      <path d="M40,60 Q50,66 60,60" fill="white" stroke="#1e293b" strokeWidth="1" />
      <ellipse cx="32" cy="56" rx="4" ry="2.5" fill="#f9a8d4" opacity="0.3" />
    </svg>
  );
}

function BunnyIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <ellipse cx="50" cy="60" rx="24" ry="22" fill="#e8daef" />
      <ellipse cx="50" cy="60" rx="20" ry="18" fill="#f3e8ff" opacity="0.4" />
      <ellipse cx="38" cy="26" rx="8" ry="20" fill="#e8daef" />
      <ellipse cx="62" cy="26" rx="8" ry="20" fill="#e8daef" />
      <ellipse cx="38" cy="26" rx="5" ry="14" fill="#f9a8d4" opacity="0.3" />
      <ellipse cx="62" cy="26" rx="5" ry="14" fill="#f9a8d4" opacity="0.3" />
      <path d="M42,56 Q44,54 46,56" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M54,56 Q56,54 58,56" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <ellipse cx="50" cy="64" rx="4" ry="3" fill="#f9a8d4" opacity="0.5" />
      <path d="M46,64 Q50,68 54,64" fill="none" stroke="#1e293b" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function SnowflakeIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="40" fill="#e0f2fe" opacity="0.3" />
      <g stroke="#67e8f9" strokeWidth="3" strokeLinecap="round">
        <line x1="50" y1="14" x2="50" y2="86" />
        <line x1="18" y1="32" x2="82" y2="68" />
        <line x1="18" y1="68" x2="82" y2="32" />
      </g>
      <g stroke="#a5f3fc" strokeWidth="2" strokeLinecap="round">
        <line x1="50" y1="22" x2="42" y2="28" />
        <line x1="50" y1="22" x2="58" y2="28" />
        <line x1="50" y1="78" x2="42" y2="72" />
        <line x1="50" y1="78" x2="58" y2="72" />
        <line x1="26" y1="36" x2="26" y2="46" />
        <line x1="74" y1="54" x2="74" y2="64" />
        <line x1="26" y1="64" x2="26" y2="54" />
        <line x1="74" y1="46" x2="74" y2="36" />
      </g>
      <circle cx="50" cy="50" r="6" fill="#67e8f9" />
      <circle cx="50" cy="50" r="3" fill="white" />
    </svg>
  );
}

function PirateIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="52" r="22" fill="#FDDCB5" />
      <path d="M28,42 Q50,28 72,42 L70,38 Q50,24 30,38 Z" fill="#1e293b" />
      <rect x="30" y="36" width="40" height="6" rx="2" fill="#1e293b" />
      <circle cx="50" cy="36" r="5" fill="#fbbf24" />
      <path d="M46,36 L50,30 L54,36 Z" fill="#1e293b" />
      <circle cx="40" cy="50" r="3.5" fill="#1e293b" />
      <circle cx="41" cy="49" r="1.2" fill="white" />
      <ellipse cx="60" cy="50" rx="6" ry="6" fill="#1e293b" />
      <line x1="54" y1="44" x2="66" y2="56" stroke="#1e293b" strokeWidth="2" />
      <path d="M42,62 Q50,68 58,62" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="34" cy="56" rx="4" ry="2.5" fill="#fda4af" opacity="0.3" />
    </svg>
  );
}

function BlueyIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <ellipse cx="50" cy="58" rx="26" ry="24" fill="#60a5fa" />
      <ellipse cx="50" cy="58" rx="22" ry="20" fill="#93c5fd" opacity="0.3" />
      <ellipse cx="34" cy="30" rx="10" ry="16" fill="#60a5fa" />
      <ellipse cx="66" cy="30" rx="10" ry="16" fill="#60a5fa" />
      <ellipse cx="34" cy="30" rx="7" ry="12" fill="#93c5fd" opacity="0.3" />
      <ellipse cx="66" cy="30" rx="7" ry="12" fill="#93c5fd" opacity="0.3" />
      <circle cx="40" cy="52" r="5" fill="white" />
      <circle cx="60" cy="52" r="5" fill="white" />
      <circle cx="40" cy="52" r="3" fill="#1e293b" />
      <circle cx="60" cy="52" r="3" fill="#1e293b" />
      <circle cx="41" cy="51" r="1.2" fill="white" />
      <circle cx="61" cy="51" r="1.2" fill="white" />
      <ellipse cx="50" cy="62" rx="5" ry="3.5" fill="#1e293b" />
      <circle cx="50" cy="60" r="2.5" fill="#2d2d2d" />
      <path d="M44,68 Q50,74 56,68" fill="none" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function BusIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect x="12" y="30" width="76" height="40" rx="8" fill="#fb923c" />
      <rect x="14" y="32" width="72" height="12" rx="4" fill="#fdba74" opacity="0.4" />
      <rect x="18" y="36" width="16" height="14" rx="3" fill="#bae6fd" />
      <rect x="42" y="36" width="16" height="14" rx="3" fill="#bae6fd" />
      <rect x="66" y="36" width="16" height="14" rx="3" fill="#bae6fd" />
      <rect x="12" y="56" width="76" height="6" rx="2" fill="#ea580c" />
      <circle cx="30" cy="72" r="8" fill="#374151" />
      <circle cx="30" cy="72" r="4" fill="#9ca3af" />
      <circle cx="70" cy="72" r="8" fill="#374151" />
      <circle cx="70" cy="72" r="4" fill="#9ca3af" />
      <circle cx="86" cy="44" r="4" fill="#fde68a" />
    </svg>
  );
}

function StarNightIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="42" fill="#1e1b4b" />
      <path d="M50,18 L54,38 L72,38 L57,48 L62,68 L50,55 L38,68 L43,48 L28,38 L46,38 Z" fill="#fde68a" />
      <path d="M50,24 L53,38 L47,38 Z" fill="#fef9c3" opacity="0.6" />
      {[20, 30, 72, 78, 25, 70].map((x, i) => (
        <circle key={i} cx={x} cy={[24, 75, 22, 72, 50, 48][i]} r="1.5" fill="#fde68a" opacity="0.6" />
      ))}
    </svg>
  );
}

function FrogIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <ellipse cx="50" cy="58" rx="30" ry="24" fill="#4ade80" />
      <ellipse cx="50" cy="60" rx="26" ry="20" fill="#86efac" opacity="0.3" />
      <circle cx="36" cy="36" r="12" fill="#4ade80" />
      <circle cx="64" cy="36" r="12" fill="#4ade80" />
      <circle cx="36" cy="34" r="7" fill="white" />
      <circle cx="64" cy="34" r="7" fill="white" />
      <circle cx="36" cy="34" r="4" fill="#1e293b" />
      <circle cx="64" cy="34" r="4" fill="#1e293b" />
      <circle cx="37" cy="33" r="1.5" fill="white" />
      <circle cx="65" cy="33" r="1.5" fill="white" />
      <path d="M38,64 Q50,74 62,64" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="30" cy="62" rx="4" ry="2.5" fill="#fda4af" opacity="0.3" />
      <ellipse cx="70" cy="62" rx="4" ry="2.5" fill="#fda4af" opacity="0.3" />
    </svg>
  );
}

function ClapIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <path d="M35,65 Q30,50 35,38 Q38,32 44,35 L48,42" fill="#FDDCB5" stroke="#d4a574" strokeWidth="1" />
      <path d="M65,65 Q70,50 65,38 Q62,32 56,35 L52,42" fill="#FDDCB5" stroke="#d4a574" strokeWidth="1" />
      <ellipse cx="50" cy="46" rx="8" ry="4" fill="#fda4af" opacity="0.4" />
      {[35, 50, 65].map((x, i) => (
        <g key={i}>
          <line x1={x} y1={28 - i * 2} x2={x + [-4, 0, 4][i]} y2={18 - i * 2}
            stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      ))}
      {[30, 70].map((x, i) => (
        <circle key={i} cx={x} cy={22} r="3" fill="#fbbf24" opacity="0.6" />
      ))}
    </svg>
  );
}

function BodyIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="22" r="12" fill="#FDDCB5" />
      <circle cx="46" cy="20" r="2" fill="#1e293b" />
      <circle cx="54" cy="20" r="2" fill="#1e293b" />
      <path d="M47,26 Q50,29 53,26" fill="none" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="40" y="34" width="20" height="26" rx="6" fill="#60a5fa" />
      <line x1="40" y1="42" x2="24" y2="52" stroke="#FDDCB5" strokeWidth="6" strokeLinecap="round" />
      <line x1="60" y1="42" x2="76" y2="52" stroke="#FDDCB5" strokeWidth="6" strokeLinecap="round" />
      <line x1="44" y1="60" x2="38" y2="82" stroke="#60a5fa" strokeWidth="7" strokeLinecap="round" />
      <line x1="56" y1="60" x2="62" y2="82" stroke="#60a5fa" strokeWidth="7" strokeLinecap="round" />
      <circle cx="38" cy="84" r="4" fill="#f97316" />
      <circle cx="62" cy="84" r="4" fill="#f97316" />
      <circle cx="24" cy="16" r="3" fill="#fbbf24" />
      <circle cx="76" cy="16" r="3" fill="#fbbf24" />
    </svg>
  );
}

function SheepIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <ellipse cx="50" cy="58" rx="30" ry="22" fill="#e5e7eb" />
      {[30, 42, 58, 70, 36, 64, 50].map((x, i) => (
        <circle key={i} cx={x} cy={[46, 42, 42, 46, 54, 54, 38][i]}
          r={[8, 9, 9, 8, 8, 8, 8][i]} fill="#f3f4f6" />
      ))}
      <ellipse cx="50" cy="38" rx="14" ry="12" fill="#1e293b" />
      <circle cx="44" cy="36" r="3" fill="white" />
      <circle cx="56" cy="36" r="3" fill="white" />
      <circle cx="44" cy="36" r="1.8" fill="#1e293b" />
      <circle cx="56" cy="36" r="1.8" fill="#1e293b" />
      <path d="M47,42 Q50,45 53,42" fill="none" stroke="#4b5563" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="38" y1="76" x2="38" y2="86" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
      <line x1="62" y1="76" x2="62" y2="86" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function ABCIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect x="10" y="20" width="80" height="60" rx="10" fill="#ede9fe" />
      <rect x="14" y="24" width="72" height="52" rx="8" fill="#f5f3ff" opacity="0.5" />
      <text x="22" y="62" fontSize="28" fontWeight="bold" fill="#7c3aed" fontFamily="Fredoka One, sans-serif">A</text>
      <text x="42" y="62" fontSize="28" fontWeight="bold" fill="#a855f7" fontFamily="Fredoka One, sans-serif">B</text>
      <text x="62" y="62" fontSize="28" fontWeight="bold" fill="#c084fc" fontFamily="Fredoka One, sans-serif">C</text>
      <circle cx="82" cy="28" r="4" fill="#fbbf24" />
      <circle cx="14" cy="72" r="3" fill="#f472b6" />
    </svg>
  );
}

function TeddyBearIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="30" cy="24" r="12" fill="#a16207" />
      <circle cx="70" cy="24" r="12" fill="#a16207" />
      <circle cx="30" cy="24" r="7" fill="#ca8a04" opacity="0.4" />
      <circle cx="70" cy="24" r="7" fill="#ca8a04" opacity="0.4" />
      <circle cx="50" cy="44" r="22" fill="#a16207" />
      <circle cx="50" cy="44" r="18" fill="#ca8a04" opacity="0.2" />
      <ellipse cx="50" cy="64" rx="18" ry="22" fill="#a16207" />
      <ellipse cx="50" cy="68" rx="12" ry="14" fill="#ca8a04" opacity="0.3" />
      <circle cx="42" cy="40" r="3.5" fill="#1e293b" />
      <circle cx="58" cy="40" r="3.5" fill="#1e293b" />
      <circle cx="43" cy="39" r="1.2" fill="white" />
      <circle cx="59" cy="39" r="1.2" fill="white" />
      <ellipse cx="50" cy="48" rx="4" ry="3" fill="#854d0e" />
      <path d="M45,52 Q50,57 55,52" fill="none" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SpiderIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <line x1="50" y1="6" x2="50" y2="30" stroke="#9ca3af" strokeWidth="2" />
      <ellipse cx="50" cy="48" rx="18" ry="20" fill="#374151" />
      <ellipse cx="50" cy="48" rx="14" ry="16" fill="#4b5563" opacity="0.3" />
      <circle cx="50" cy="34" r="12" fill="#374151" />
      <circle cx="44" cy="32" r="4" fill="white" />
      <circle cx="56" cy="32" r="4" fill="white" />
      <circle cx="44" cy="32" r="2.5" fill="#1e293b" />
      <circle cx="56" cy="32" r="2.5" fill="#1e293b" />
      <circle cx="45" cy="31" r="1" fill="white" />
      <circle cx="57" cy="31" r="1" fill="white" />
      <path d="M46,40 Q50,43 54,40" fill="none" stroke="#1e293b" strokeWidth="1.2" strokeLinecap="round" />
      {[-1, 1].map(side => [0, 1, 2, 3].map(i => (
        <path key={`${side}-${i}`}
          d={`M${50 + side * 14},${38 + i * 8} Q${50 + side * 30},${30 + i * 8} ${50 + side * 36},${38 + i * 10}`}
          fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" />
      )))}
    </svg>
  );
}

function TeapotIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <ellipse cx="50" cy="60" rx="28" ry="24" fill="#f9a8d4" />
      <ellipse cx="50" cy="60" rx="24" ry="20" fill="#fbcfe8" opacity="0.3" />
      <rect x="34" y="36" width="32" height="8" rx="4" fill="#f472b6" />
      <path d="M50,36 Q50,24 50,20" stroke="#f472b6" strokeWidth="4" strokeLinecap="round" />
      <circle cx="50" cy="18" r="5" fill="#f472b6" />
      <circle cx="50" cy="18" r="3" fill="#f9a8d4" />
      <path d="M22,52 Q10,44 14,34" fill="none" stroke="#f472b6" strokeWidth="4" strokeLinecap="round" />
      <path d="M78,46 Q92,50 90,62 Q88,72 78,70" fill="none" stroke="#f472b6" strokeWidth="4" strokeLinecap="round" />
      <path d="M16,32 Q12,26 16,20" fill="none" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <path d="M22,28 Q18,22 22,16" fill="none" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <ellipse cx="50" cy="82" rx="22" ry="4" fill="#ec4899" opacity="0.3" />
    </svg>
  );
}

const SONG_ICONS = {
  'baby-shark': SharkIcon,
  'sleeping-bunnies': BunnyIcon,
  'let-it-go': SnowflakeIcon,
  'yo-ho-pirate': PirateIcon,
  'bluey-intro': BlueyIcon,
  'wheels-on-bus': BusIcon,
  'twinkle-twinkle': StarNightIcon,
  'frere-jacques': FrogIcon,
  'happy-and-you-know-it': ClapIcon,
  'head-shoulders': BodyIcon,
  'baa-baa-black-sheep': SheepIcon,
  'alphabet-song': ABCIcon,
  'teddy-bears-picnic': TeddyBearIcon,
  'incy-wincy-spider': SpiderIcon,
  'im-a-little-teapot': TeapotIcon,
};

/* ─── Music note SVG for decoration ─── */
function MusicNoteSVG({ style }) {
  return (
    <svg viewBox="0 0 24 32" style={style}>
      <ellipse cx="8" cy="26" rx="7" ry="5" fill="currentColor" />
      <rect x="14" y="4" width="3" height="23" rx="1.5" fill="currentColor" />
      <path d="M15,4 Q20,2 24,6 Q20,4 17,8" fill="currentColor" />
    </svg>
  );
}

/* ─── Stop button SVG ─── */
function StopIcon() {
  return (
    <svg viewBox="0 0 40 40" className="w-8 h-8">
      <circle cx="20" cy="20" r="18" fill="rgba(0,0,0,0.4)" />
      <rect x="13" y="13" width="14" height="14" rx="2" fill="white" />
    </svg>
  );
}

/* ─── Song Card Component ─── */
function SongCard({ song, isPlaying, onPress }) {
  const Icon = SONG_ICONS[song.id];

  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onPointerDown={onPress}
      className="relative flex flex-col items-center rounded-3xl overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${song.colour}30 0%, ${song.colour}60 100%)`,
        border: isPlaying ? `3px solid ${song.colour}` : '3px solid transparent',
        boxShadow: isPlaying
          ? `0 0 20px ${song.colour}60, 0 4px 12px rgba(0,0,0,0.15)`
          : '0 4px 12px rgba(0,0,0,0.1)',
        padding: '0.75rem',
        minHeight: '10rem',
        width: '100%',
      }}
    >
      {/* Playing indicator — pulsing ring */}
      {isPlaying && (
        <motion.div
          className="absolute inset-0 rounded-3xl"
          animate={{ opacity: [0.4, 0.1, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          style={{ border: `3px solid ${song.colour}`, pointerEvents: 'none' }}
        />
      )}

      {/* Icon */}
      <div className="relative" style={{ width: '6rem', height: '6rem' }}>
        <motion.div
          animate={isPlaying ? { scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] } : {}}
          transition={isPlaying ? { duration: 1.5, repeat: Infinity } : {}}
          className="w-full h-full"
        >
          {Icon && <Icon />}
        </motion.div>

        {/* Animated dots while playing */}
        {isPlaying && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                className="rounded-full"
                style={{ width: 5, height: 5, background: song.accentColour }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Title */}
      <span className="mt-2 text-sm font-heading font-bold text-center leading-tight"
        style={{ color: song.accentColour }}>
        {song.title}
      </span>
    </motion.button>
  );
}

/* ─── Main Jukebox Component ─── */
export default function Jukebox() {
  const [playingSong, setPlayingSong] = useState(null);
  const iframeRef = useRef(null);
  const playerRef = useRef(null);
  const apiLoadedRef = useRef(false);

  // Load YouTube IFrame API
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      apiLoadedRef.current = true;
      return;
    }

    const existing = document.getElementById('yt-iframe-api');
    if (existing) {
      // Script already loading — wait for it
      const check = setInterval(() => {
        if (window.YT && window.YT.Player) {
          apiLoadedRef.current = true;
          clearInterval(check);
        }
      }, 100);
      return () => clearInterval(check);
    }

    const tag = document.createElement('script');
    tag.id = 'yt-iframe-api';
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      apiLoadedRef.current = true;
    };

    return () => {
      // Don't remove the script — other instances may use it
    };
  }, []);

  const waitForApi = useCallback(() => {
    return new Promise((resolve) => {
      if (apiLoadedRef.current) { resolve(); return; }
      const check = setInterval(() => {
        if (window.YT && window.YT.Player) {
          apiLoadedRef.current = true;
          clearInterval(check);
          resolve();
        }
      }, 100);
    });
  }, []);

  const playSong = useCallback(async (song) => {
    playPop();
    setPlayingSong(song.id);

    await waitForApi();

    // Destroy previous player if exists
    if (playerRef.current) {
      try { playerRef.current.destroy(); } catch (_) { /* ignore */ }
      playerRef.current = null;
    }

    playerRef.current = new window.YT.Player(iframeRef.current, {
      height: '1',
      width: '1',
      videoId: song.youtubeId,
      playerVars: {
        autoplay: 1,
        playsinline: 1,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        rel: 0,
      },
      events: {
        onStateChange: (event) => {
          // YT.PlayerState.ENDED === 0
          if (event.data === 0) {
            setPlayingSong(null);
          }
        },
        onError: () => {
          setPlayingSong(null);
        },
      },
    });
  }, [waitForApi]);

  const stopPlaying = useCallback(() => {
    if (playerRef.current) {
      try { playerRef.current.stopVideo(); } catch (_) { /* ignore */ }
      try { playerRef.current.destroy(); } catch (_) { /* ignore */ }
      playerRef.current = null;
    }
    setPlayingSong(null);
  }, []);

  const handlePress = useCallback((song) => {
    if (playingSong === song.id) {
      stopPlaying();
    } else {
      playSong(song);
    }
  }, [playingSong, playSong, stopPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch (_) { /* ignore */ }
      }
    };
  }, []);

  const currentSong = SONGS.find(s => s.id === playingSong);

  return (
    <div className="relative w-full h-full overflow-hidden select-none"
      style={{
        background: 'linear-gradient(160deg, #312e81 0%, #4338ca 30%, #6366f1 60%, #4338ca 100%)',
      }}
    >
      <BackButton />

      {/* Hidden YouTube player container */}
      <div style={{ position: 'absolute', top: -9999, left: -9999, width: 1, height: 1, overflow: 'hidden' }}>
        <div ref={iframeRef} />
      </div>

      {/* Floating music notes decoration */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          animate={{
            y: [0, -30, 0],
            x: [0, 10 * (i % 2 === 0 ? 1 : -1), 0],
            opacity: [0.15, 0.3, 0.15],
            rotate: [0, 15 * (i % 2 === 0 ? 1 : -1), 0],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.8,
          }}
          style={{
            left: `${8 + i * 16}%`,
            top: `${5 + (i % 3) * 4}%`,
          }}
        >
          <MusicNoteSVG style={{ width: 20, height: 28, color: `rgba(255,255,255,${0.1 + (i % 3) * 0.05})` }} />
        </motion.div>
      ))}

      {/* Now-playing bar */}
      {currentSong && (
        <motion.div
          initial={{ y: -60 }}
          animate={{ y: 0 }}
          exit={{ y: -60 }}
          className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center gap-3 px-20 py-3"
          style={{
            background: `linear-gradient(90deg, ${currentSong.colour}80, ${currentSong.colour}40)`,
            backdropFilter: 'blur(12px)',
          }}
        >
          {/* Animated equaliser bars */}
          <div className="flex items-end gap-0.5 h-6">
            {[0, 1, 2, 3, 4].map(i => (
              <motion.div
                key={i}
                animate={{ height: ['40%', '100%', '60%', '90%', '30%'] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1, ease: 'easeInOut' }}
                className="rounded-full"
                style={{ width: 4, background: 'white', minHeight: 4 }}
              />
            ))}
          </div>
          <span className="text-white font-heading font-bold text-base truncate">
            {currentSong.title}
          </span>
          <button onPointerDown={stopPlaying} className="ml-2 flex-shrink-0">
            <StopIcon />
          </button>
        </motion.div>
      )}

      {/* Scrollable card grid */}
      <div className="absolute inset-0 pb-6 px-4 overflow-y-auto"
        style={{
          paddingTop: playingSong ? '5.5rem' : '5rem',
          WebkitOverflowScrolling: 'touch',
        }}>
        <div className="grid grid-cols-3 gap-3 max-w-2xl mx-auto">
          {SONGS.map(song => (
            <SongCard
              key={song.id}
              song={song}
              isPlaying={playingSong === song.id}
              onPress={() => handlePress(song)}
            />
          ))}
        </div>
        <div className="h-8" />
      </div>
    </div>
  );
}
