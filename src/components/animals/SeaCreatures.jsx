/**
 * Illustrated sea creatures for BubblePop game.
 * Cute storybook-style SVGs matching Shark.jsx aesthetic:
 * big sparkly eyes, rosy cheeks, soft gradients.
 */

export const FISH_VARIANT_NAMES = [
  'clownfish', 'bluefish', 'pufferfish', 'crab', 'octopus', 'turtle', 'jellyfish',
];

export const VARIANT_COLORS = {
  clownfish: '#ff6b35',
  bluefish: '#3b82f6',
  pufferfish: '#84cc16',
  crab: '#ef4444',
  octopus: '#a855f7',
  turtle: '#22c55e',
  jellyfish: '#ec4899',
};

/* ── Side-view creatures (facing right, flippable) ──────────── */

function Clownfish() {
  return (
    <g>
      {/* Tail fin */}
      <path d="M12 42 C4 32, 2 28, 6 20 L16 35Z" fill="#ff8c42" />
      <path d="M12 58 C4 68, 2 72, 6 80 L16 65Z" fill="#ff8c42" />
      {/* Body */}
      <ellipse cx="52" cy="50" rx="38" ry="24" fill="#ff6b35" />
      {/* Body highlight */}
      <ellipse cx="48" cy="42" rx="24" ry="12" fill="#ff9f66" opacity="0.4" />
      {/* White stripes with soft edges */}
      <path d="M28 28 C30 42, 30 58, 28 72" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M50 26 C52 42, 52 58, 50 74" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M70 32 C72 42, 72 58, 70 68" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Stripe outlines */}
      <path d="M28 28 C30 42, 30 58, 28 72" stroke="#e65100" strokeWidth="1" fill="none" opacity="0.15" />
      <path d="M50 26 C52 42, 52 58, 50 74" stroke="#e65100" strokeWidth="1" fill="none" opacity="0.15" />
      {/* Dorsal fin */}
      <path d="M42 28 C44 18, 52 14, 56 18 C58 22, 56 26, 52 28" fill="#ff8c42" />
      {/* Pectoral fin */}
      <path d="M44 60 C40 68, 36 72, 34 70 C34 66, 38 62, 42 58" fill="#ff8c42" />
      {/* Eye — big and sparkly */}
      <ellipse cx="72" cy="44" rx="9" ry="10" fill="white" stroke="#4a3520" strokeWidth="0.8" />
      <circle cx="74" cy="45" r="6" fill="#1a1a1a" />
      <circle cx="76" cy="42" r="2.5" fill="white" />
      <circle cx="72" cy="47" r="1.5" fill="white" opacity="0.6" />
      {/* Smile */}
      <path d="M76 54 C78 57, 82 58, 86 56" fill="none" stroke="#4a3520" strokeWidth="1.5" strokeLinecap="round" />
      {/* Cheek blush */}
      <circle cx="68" cy="54" r="5" fill="#ff4444" opacity="0.25" />
    </g>
  );
}

function BlueFish() {
  return (
    <g>
      {/* Tail fin — bright yellow */}
      <path d="M14 40 C4 30, 2 22, 8 16 L20 36Z" fill="#fbbf24" />
      <path d="M14 60 C4 70, 2 78, 8 84 L20 64Z" fill="#fbbf24" />
      {/* Body */}
      <ellipse cx="52" cy="50" rx="36" ry="26" fill="#3b82f6" />
      {/* Body shimmer */}
      <ellipse cx="48" cy="42" rx="26" ry="14" fill="#60a5fa" opacity="0.5" />
      {/* Dark marking on lower body */}
      <path d="M22 46 C28 52, 38 58, 48 58 C42 62, 30 60, 22 54Z" fill="#1e3a5f" opacity="0.4" />
      {/* Dorsal fin */}
      <path d="M40 26 C42 16, 50 12, 54 16 C56 20, 54 24, 50 26" fill="#2563eb" />
      {/* Pectoral fin */}
      <path d="M42 62 C38 70, 34 74, 32 72 C32 68, 36 64, 40 60" fill="#2563eb" />
      {/* Eye */}
      <ellipse cx="70" cy="44" rx="9" ry="10" fill="white" stroke="#1e3a5f" strokeWidth="0.8" />
      <circle cx="72" cy="45" r="6" fill="#1a1a1a" />
      <circle cx="74" cy="42" r="2.5" fill="white" />
      <circle cx="70" cy="47" r="1.5" fill="white" opacity="0.6" />
      {/* Smile */}
      <path d="M74 54 C76 58, 80 60, 84 58" fill="none" stroke="#1e3a5f" strokeWidth="1.5" strokeLinecap="round" />
      {/* Cheek blush */}
      <circle cx="66" cy="55" r="5" fill="#ff6b8a" opacity="0.25" />
    </g>
  );
}

function Pufferfish() {
  return (
    <g>
      {/* Small tail */}
      <path d="M14 44 C8 38, 6 32, 10 28 L18 40Z" fill="#a3e635" />
      <path d="M14 56 C8 62, 6 68, 10 72 L18 60Z" fill="#a3e635" />
      {/* Body — very round */}
      <circle cx="50" cy="50" r="30" fill="#84cc16" />
      {/* Belly */}
      <ellipse cx="52" cy="58" rx="22" ry="16" fill="#ecfccb" opacity="0.6" />
      {/* Body highlight */}
      <ellipse cx="44" cy="40" rx="16" ry="12" fill="#a3e635" opacity="0.4" />
      {/* Spines — small bumps around edge */}
      <circle cx="50" cy="18" r="3" fill="#65a30d" />
      <circle cx="70" cy="24" r="3" fill="#65a30d" />
      <circle cx="78" cy="42" r="3" fill="#65a30d" />
      <circle cx="76" cy="62" r="3" fill="#65a30d" />
      <circle cx="66" cy="76" r="3" fill="#65a30d" />
      <circle cx="34" cy="76" r="3" fill="#65a30d" />
      <circle cx="24" cy="62" r="3" fill="#65a30d" />
      <circle cx="22" cy="42" r="3" fill="#65a30d" />
      <circle cx="30" cy="24" r="3" fill="#65a30d" />
      {/* Spots */}
      <circle cx="40" cy="44" r="4" fill="#65a30d" opacity="0.25" />
      <circle cx="56" cy="40" r="3" fill="#65a30d" opacity="0.25" />
      {/* Eye — big and surprised */}
      <ellipse cx="62" cy="42" rx="10" ry="11" fill="white" stroke="#333" strokeWidth="0.8" />
      <circle cx="64" cy="43" r="6" fill="#1a1a1a" />
      <circle cx="66" cy="40" r="2.5" fill="white" />
      <circle cx="62" cy="46" r="1.5" fill="white" opacity="0.6" />
      {/* Surprised O mouth */}
      <ellipse cx="70" cy="58" rx="5" ry="4" fill="#c44060" opacity="0.6" stroke="#333" strokeWidth="0.8" />
      {/* Cheek blush */}
      <circle cx="54" cy="54" r="5" fill="#ff6b8a" opacity="0.2" />
      {/* Small dorsal fin */}
      <path d="M46 20 C48 14, 52 14, 54 20" fill="#65a30d" />
    </g>
  );
}

function Turtle() {
  return (
    <g>
      {/* Back flippers */}
      <ellipse cx="22" cy="40" rx="8" ry="5" fill="#16a34a" transform="rotate(-25 22 40)" />
      <ellipse cx="22" cy="62" rx="8" ry="5" fill="#16a34a" transform="rotate(25 22 62)" />
      {/* Front flippers */}
      <path d="M58 34 C66 26, 76 24, 80 28 C78 32, 70 34, 62 36" fill="#16a34a" />
      <path d="M58 66 C66 74, 76 76, 80 72 C78 68, 70 66, 62 64" fill="#16a34a" />
      {/* Tail nub */}
      <path d="M16 50 C10 48, 8 50, 10 52 L16 52Z" fill="#16a34a" />
      {/* Shell */}
      <ellipse cx="42" cy="50" rx="26" ry="20" fill="#22c55e" />
      {/* Shell pattern — hexagonal */}
      <path d="M30 38 L42 32 L54 38 L56 50 L54 62 L42 68 L30 62 L28 50Z" fill="none" stroke="#15803d" strokeWidth="1.5" opacity="0.35" />
      <line x1="42" y1="32" x2="42" y2="68" stroke="#15803d" strokeWidth="1.2" opacity="0.3" />
      <line x1="28" y1="50" x2="56" y2="50" stroke="#15803d" strokeWidth="1.2" opacity="0.3" />
      {/* Shell highlight */}
      <ellipse cx="38" cy="44" rx="14" ry="10" fill="#4ade80" opacity="0.35" />
      {/* Shell rim light */}
      <path d="M20 40 C28 30, 42 26, 56 30" fill="none" stroke="#86efac" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
      {/* Head */}
      <ellipse cx="72" cy="50" rx="12" ry="10" fill="#16a34a" />
      {/* Head highlight */}
      <ellipse cx="70" cy="46" rx="8" ry="5" fill="#22c55e" opacity="0.4" />
      {/* Eye */}
      <circle cx="78" cy="46" r="5" fill="white" stroke="#333" strokeWidth="0.6" />
      <circle cx="79" cy="46" r="3" fill="#1a1a1a" />
      <circle cx="80" cy="44" r="1.5" fill="white" />
      {/* Smile */}
      <path d="M78 52 C80 55, 82 55, 84 53" fill="none" stroke="#0a5c2a" strokeWidth="1.2" strokeLinecap="round" />
      {/* Cheek blush */}
      <circle cx="74" cy="54" r="4" fill="#ff6b8a" opacity="0.2" />
    </g>
  );
}

/* ── Front-view creatures (symmetrical) ─────────────────────── */

function Crab() {
  return (
    <g>
      {/* Legs */}
      <path d="M24 56 C18 62, 12 66, 8 64" stroke="#dc2626" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M28 62 C22 70, 16 74, 12 72" stroke="#dc2626" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M76 56 C82 62, 88 66, 92 64" stroke="#dc2626" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M72 62 C78 70, 84 74, 88 72" stroke="#dc2626" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Arms */}
      <path d="M28 44 C22 40, 18 36, 20 34" stroke="#dc2626" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M72 44 C78 40, 82 36, 80 34" stroke="#dc2626" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Claws */}
      <ellipse cx="14" cy="34" rx="10" ry="8" fill="#ef4444" />
      <path d="M8 28 C4 24, 2 28, 6 32" stroke="#ef4444" strokeWidth="3" fill="none" />
      <ellipse cx="86" cy="34" rx="10" ry="8" fill="#ef4444" />
      <path d="M92 28 C96 24, 98 28, 94 32" stroke="#ef4444" strokeWidth="3" fill="none" />
      {/* Claw highlights */}
      <ellipse cx="12" cy="32" rx="5" ry="4" fill="#f87171" opacity="0.4" />
      <ellipse cx="88" cy="32" rx="5" ry="4" fill="#f87171" opacity="0.4" />
      {/* Body */}
      <ellipse cx="50" cy="52" rx="28" ry="20" fill="#ef4444" />
      {/* Shell highlight */}
      <ellipse cx="46" cy="46" rx="18" ry="10" fill="#f87171" opacity="0.5" />
      {/* Eyes on stalks */}
      <path d="M38 36 L36 26" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
      <path d="M62 36 L64 26" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
      <circle cx="36" cy="22" r="6" fill="white" stroke="#333" strokeWidth="0.8" />
      <circle cx="64" cy="22" r="6" fill="white" stroke="#333" strokeWidth="0.8" />
      <circle cx="37" cy="22" r="4" fill="#1a1a1a" />
      <circle cx="65" cy="22" r="4" fill="#1a1a1a" />
      <circle cx="38" cy="20" r="1.8" fill="white" />
      <circle cx="66" cy="20" r="1.8" fill="white" />
      {/* Smile */}
      <path d="M42 58 C46 62, 54 62, 58 58" fill="none" stroke="#7f1d1d" strokeWidth="1.5" strokeLinecap="round" />
      {/* Cheek blush */}
      <circle cx="38" cy="54" r="5" fill="#ff9999" opacity="0.3" />
      <circle cx="62" cy="54" r="5" fill="#ff9999" opacity="0.3" />
    </g>
  );
}

function Octopus() {
  return (
    <g>
      {/* Tentacles — wavy and cute */}
      <path d="M30 58 C26 68, 20 78, 16 84 C14 86, 18 82, 20 78" stroke="#9333ea" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M36 62 C34 74, 28 84, 24 90 C22 92, 26 88, 28 84" stroke="#9333ea" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M50 64 C50 76, 48 86, 46 92 C44 94, 48 90, 50 86" stroke="#9333ea" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M64 62 C66 74, 72 84, 76 90 C78 92, 74 88, 72 84" stroke="#9333ea" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M70 58 C74 68, 80 78, 84 84 C86 86, 82 82, 80 78" stroke="#9333ea" strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* Sucker dots */}
      <circle cx="22" cy="74" r="2" fill="#c084fc" opacity="0.5" />
      <circle cx="30" cy="80" r="2" fill="#c084fc" opacity="0.5" />
      <circle cx="50" cy="80" r="2" fill="#c084fc" opacity="0.5" />
      <circle cx="70" cy="80" r="2" fill="#c084fc" opacity="0.5" />
      <circle cx="78" cy="74" r="2" fill="#c084fc" opacity="0.5" />
      {/* Head */}
      <ellipse cx="50" cy="40" rx="28" ry="26" fill="#a855f7" />
      {/* Head highlight */}
      <ellipse cx="46" cy="32" rx="18" ry="14" fill="#c084fc" opacity="0.4" />
      {/* Eyes */}
      <ellipse cx="38" cy="38" rx="10" ry="11" fill="white" stroke="#4c1d95" strokeWidth="0.8" />
      <ellipse cx="62" cy="38" rx="10" ry="11" fill="white" stroke="#4c1d95" strokeWidth="0.8" />
      <circle cx="40" cy="39" r="6" fill="#1a1a1a" />
      <circle cx="64" cy="39" r="6" fill="#1a1a1a" />
      <circle cx="42" cy="36" r="2.5" fill="white" />
      <circle cx="66" cy="36" r="2.5" fill="white" />
      <circle cx="38" cy="42" r="1.5" fill="white" opacity="0.6" />
      <circle cx="62" cy="42" r="1.5" fill="white" opacity="0.6" />
      {/* Smile */}
      <path d="M42 50 C46 54, 54 54, 58 50" fill="none" stroke="#4c1d95" strokeWidth="1.5" strokeLinecap="round" />
      {/* Cheek blush */}
      <circle cx="32" cy="48" r="5" fill="#ff6b8a" opacity="0.25" />
      <circle cx="68" cy="48" r="5" fill="#ff6b8a" opacity="0.25" />
      {/* Little star sparkle */}
      <path d="M74 22 L75.5 18 L77 22 L81 22 L78 24.5 L79 28 L75.5 26 L72 28 L73 24.5 L70 22Z" fill="#f8d878" opacity="0.5" />
    </g>
  );
}

function Jellyfish() {
  return (
    <g>
      {/* Tentacles — flowing wavy lines */}
      <path d="M30 56 C28 64, 32 72, 28 80 C26 84, 30 82, 32 78" stroke="#f472b6" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.55" />
      <path d="M40 58 C38 68, 42 76, 38 84 C36 88, 40 86, 42 82" stroke="#f472b6" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.55" />
      <path d="M50 60 C48 70, 52 78, 48 86 C46 90, 50 88, 52 84" stroke="#f472b6" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.55" />
      <path d="M60 58 C58 68, 62 76, 58 84 C56 88, 60 86, 62 82" stroke="#f472b6" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.55" />
      <path d="M70 56 C68 64, 72 72, 68 80 C66 84, 70 82, 72 78" stroke="#f472b6" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.55" />
      {/* Bell — dome shape */}
      <path d="M24 54 C24 28, 36 14, 50 14 C64 14, 76 28, 76 54Z" fill="#ec4899" opacity="0.7" />
      {/* Bell highlight */}
      <path d="M32 48 C32 30, 40 20, 50 20 C56 20, 62 24, 66 32" fill="#f9a8d4" opacity="0.4" />
      {/* Inner glow */}
      <ellipse cx="50" cy="38" rx="14" ry="12" fill="#fbcfe8" opacity="0.3" />
      {/* Rim */}
      <path d="M24 54 C32 58, 44 60, 50 60 C56 60, 68 58, 76 54" fill="none" stroke="#db2777" strokeWidth="2" opacity="0.4" />
      {/* Eyes — simple cute dots */}
      <circle cx="40" cy="36" r="5" fill="#831843" opacity="0.8" />
      <circle cx="60" cy="36" r="5" fill="#831843" opacity="0.8" />
      <circle cx="42" cy="34" r="2" fill="white" opacity="0.8" />
      <circle cx="62" cy="34" r="2" fill="white" opacity="0.8" />
      {/* Smile */}
      <path d="M44 44 C47 47, 53 47, 56 44" fill="none" stroke="#831843" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      {/* Cheek blush */}
      <circle cx="34" cy="42" r="4" fill="#ff6b8a" opacity="0.2" />
      <circle cx="66" cy="42" r="4" fill="#ff6b8a" opacity="0.2" />
    </g>
  );
}

/* ── Main component ─────────────────────────────────────────── */

const variants = {
  clownfish: Clownfish,
  bluefish: BlueFish,
  pufferfish: Pufferfish,
  crab: Crab,
  octopus: Octopus,
  turtle: Turtle,
  jellyfish: Jellyfish,
};

export default function SeaCreature({ variant = 'clownfish', size = 60, className = '' }) {
  const Creature = variants[variant];
  if (!Creature) return null;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      <Creature />
    </svg>
  );
}
