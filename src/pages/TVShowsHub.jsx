import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BackButton from '../components/BackButton';
import TiltCard from '../components/TiltCard';
import { shows } from '../data/videoData';
import { playNavigate } from '../hooks/useSound';

/* ── Inline SVG illustrations for each show ── */

function PeppaIllustration() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))' }}>
      {/* Peppa's head — side profile pig shape */}
      <ellipse cx="60" cy="55" rx="30" ry="28" fill="#f9a8d4" />
      {/* Snout */}
      <ellipse cx="85" cy="52" rx="12" ry="10" fill="#fbb6ce" />
      <circle cx="83" cy="50" r="2.5" fill="#e879a0" />
      <circle cx="89" cy="50" r="2.5" fill="#e879a0" />
      {/* Eyes */}
      <circle cx="62" cy="42" r="5" fill="white" />
      <circle cx="72" cy="42" r="5" fill="white" />
      <circle cx="63" cy="42" r="2.5" fill="#1e1b4b" />
      <circle cx="73" cy="42" r="2.5" fill="#1e1b4b" />
      <circle cx="62" cy="41" r="1" fill="white" />
      <circle cx="72" cy="41" r="1" fill="white" />
      {/* Mouth */}
      <path d="M72 58 Q78 64, 84 60" fill="none" stroke="#e879a0" strokeWidth="2" strokeLinecap="round" />
      {/* Ears */}
      <ellipse cx="48" cy="30" rx="6" ry="10" fill="#f9a8d4" transform="rotate(-15 48 30)" />
      <ellipse cx="65" cy="28" rx="6" ry="10" fill="#f9a8d4" transform="rotate(5 65 28)" />
      {/* Blush */}
      <ellipse cx="55" cy="56" rx="5" ry="3" fill="#fda4af" opacity="0.5" />
      {/* Body — red dress */}
      <path d="M42 75 Q38 95, 34 110 L86 110 Q82 95, 78 75 Q60 82, 42 75 Z" fill="#ef4444" />
      {/* Arms */}
      <line x1="42" y1="80" x2="30" y2="95" stroke="#f9a8d4" strokeWidth="4" strokeLinecap="round" />
      <line x1="78" y1="80" x2="90" y2="95" stroke="#f9a8d4" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function MorphleIllustration() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))' }}>
      {/* Morphle body — blobby red shape */}
      <ellipse cx="60" cy="65" rx="35" ry="38" fill="#ef4444" />
      {/* Inner belly */}
      <ellipse cx="60" cy="72" rx="20" ry="22" fill="#fca5a5" opacity="0.6" />
      {/* Eyes — big and cute */}
      <ellipse cx="48" cy="50" rx="10" ry="11" fill="white" />
      <ellipse cx="72" cy="50" rx="10" ry="11" fill="white" />
      <circle cx="50" cy="50" r="5" fill="#1e1b4b" />
      <circle cx="74" cy="50" r="5" fill="#1e1b4b" />
      <circle cx="48" cy="48" r="2" fill="white" />
      <circle cx="72" cy="48" r="2" fill="white" />
      {/* Happy mouth */}
      <path d="M50 65 Q60 78, 70 65" fill="none" stroke="#991b1b" strokeWidth="2.5" strokeLinecap="round" />
      {/* Little ears/antenna */}
      <ellipse cx="42" cy="30" rx="6" ry="10" fill="#ef4444" />
      <ellipse cx="78" cy="30" rx="6" ry="10" fill="#ef4444" />
      <circle cx="42" cy="22" r="4" fill="#fbbf24" />
      <circle cx="78" cy="22" r="4" fill="#fbbf24" />
      {/* Feet */}
      <ellipse cx="45" cy="100" rx="10" ry="5" fill="#dc2626" />
      <ellipse cx="75" cy="100" rx="10" ry="5" fill="#dc2626" />
    </svg>
  );
}

function SpideyIllustration() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))' }}>
      {/* Head — red mask */}
      <circle cx="60" cy="48" r="26" fill="#dc2626" />
      {/* Web pattern on mask */}
      <path d="M60 22 L60 74" stroke="#991b1b" strokeWidth="1" opacity="0.4" />
      <path d="M34 48 L86 48" stroke="#991b1b" strokeWidth="1" opacity="0.4" />
      <path d="M40 28 L80 68" stroke="#991b1b" strokeWidth="1" opacity="0.4" />
      <path d="M80 28 L40 68" stroke="#991b1b" strokeWidth="1" opacity="0.4" />
      {/* Eyes — big white spider-eyes */}
      <path d="M42 42 Q44 34, 52 36 Q58 38, 56 46 Q54 52, 46 50 Q40 48, 42 42 Z" fill="white" />
      <path d="M78 42 Q76 34, 68 36 Q62 38, 64 46 Q66 52, 74 50 Q80 48, 78 42 Z" fill="white" />
      {/* Black eye outlines */}
      <path d="M42 42 Q44 34, 52 36 Q58 38, 56 46 Q54 52, 46 50 Q40 48, 42 42 Z" fill="none" stroke="#1e1b4b" strokeWidth="1.5" />
      <path d="M78 42 Q76 34, 68 36 Q62 38, 64 46 Q66 52, 74 50 Q80 48, 78 42 Z" fill="none" stroke="#1e1b4b" strokeWidth="1.5" />
      {/* Body — blue suit */}
      <path d="M44 72 L40 78 Q34 100, 30 112 L90 112 Q86 100, 80 78 L76 72 Q60 80, 44 72 Z" fill="#2563eb" />
      {/* Red on chest */}
      <path d="M48 72 Q60 80, 72 72 L68 88 Q60 92, 52 88 Z" fill="#dc2626" />
      {/* Spider emblem */}
      <circle cx="60" cy="80" r="3" fill="#1e1b4b" />
      <line x1="57" y1="80" x2="52" y2="76" stroke="#1e1b4b" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="63" y1="80" x2="68" y2="76" stroke="#1e1b4b" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="57" y1="81" x2="52" y2="85" stroke="#1e1b4b" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="63" y1="81" x2="68" y2="85" stroke="#1e1b4b" strokeWidth="1.5" strokeLinecap="round" />
      {/* Arms */}
      <line x1="44" y1="78" x2="28" y2="90" stroke="#dc2626" strokeWidth="5" strokeLinecap="round" />
      <line x1="76" y1="78" x2="92" y2="90" stroke="#dc2626" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

const ILLUSTRATIONS = {
  peppa: PeppaIllustration,
  morphle: MorphleIllustration,
  spidey: SpideyIllustration,
};

export default function TVShowsHub() {
  const { mode } = useParams();
  const navigate = useNavigate();

  const handleShowTap = (showId) => {
    playNavigate();
    navigate(`/games/${mode}/tv-shows/${showId}`);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden"
         style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #1e3a5f 100%)' }}>
      <BackButton />

      {/* Title */}
      <motion.div
        className="mt-6 mb-6"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <h1 className="text-3xl font-heading text-white drop-shadow-lg">TV Shows</h1>
      </motion.div>

      {/* Show cards */}
      <div className="flex flex-wrap items-center justify-center gap-6 px-6 max-w-3xl">
        {shows.map((show, i) => {
          const Illustration = ILLUSTRATIONS[show.illustration] || PeppaIllustration;
          return (
            <motion.div
              key={show.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
                delay: i * 0.12,
              }}
            >
              <TiltCard
                onClick={() => handleShowTap(show.id)}
                className={`relative w-44 h-56 rounded-3xl overflow-hidden bg-gradient-to-br ${show.bg} shadow-xl`}
              >
                {/* Character illustration */}
                <div className="w-32 h-32 mx-auto mt-3">
                  <Illustration />
                </div>

                {/* Title area */}
                <div className="absolute bottom-0 inset-x-0 bg-black/30 backdrop-blur-sm py-3 px-2">
                  <p className="text-white text-center font-heading text-lg leading-tight drop-shadow">
                    {show.title}
                  </p>
                  {show.episodeCount > 0 && (
                    <p className="text-white/70 text-center text-xs mt-0.5">
                      {show.episodeCount} episodes
                    </p>
                  )}
                </div>
              </TiltCard>
            </motion.div>
          );
        })}
      </div>

      {/* Decorative floating dots */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full opacity-20 animate-float"
          style={{
            width: 6 + Math.random() * 10,
            height: 6 + Math.random() * 10,
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
            background: ['#f472b6', '#ef4444', '#3b82f6', '#fbbf24'][i % 4],
            animationDelay: `${i * 0.7}s`,
          }}
        />
      ))}
    </div>
  );
}
