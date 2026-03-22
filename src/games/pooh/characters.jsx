/**
 * Hundred Acre Wood character SVGs — warm Shepard-style illustrations.
 * All characters use viewBox="0 0 80 100" and accept a `size` prop.
 */

/* ── Tigger ── */
export function Tigger({ size = 80, className = '', bounce = false }) {
  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 80 100"
      className={`select-none ${className}`}
      style={bounce ? { animation: 'tigger-bounce 0.6s ease-out' } : undefined}>
      {/* Tail */}
      <path d="M64 60 Q78 50 72 38 Q66 28 74 20" fill="none" stroke="#e8943a" strokeWidth="5" strokeLinecap="round" />
      <path d="M66 56 Q74 48 70 40" fill="none" stroke="#3d2414" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      {/* Body */}
      <ellipse cx="40" cy="60" rx="22" ry="24" fill="#f0a030" />
      <ellipse cx="40" cy="60" rx="22" ry="24" fill="none" stroke="#c47820" strokeWidth="1.2" />
      {/* Belly */}
      <ellipse cx="40" cy="62" rx="14" ry="16" fill="#fcd88a" />
      {/* Stripes */}
      <path d="M24 50 Q30 48 36 50" fill="none" stroke="#3d2414" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M44 50 Q50 48 56 50" fill="none" stroke="#3d2414" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M22 58 Q28 56 34 58" fill="none" stroke="#3d2414" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M46 58 Q52 56 58 58" fill="none" stroke="#3d2414" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M24 66 Q30 64 36 66" fill="none" stroke="#3d2414" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M44 66 Q50 64 56 66" fill="none" stroke="#3d2414" strokeWidth="2.5" strokeLinecap="round" />
      {/* Head */}
      <circle cx="40" cy="28" r="18" fill="#f0a030" stroke="#c47820" strokeWidth="1.2" />
      {/* Ears */}
      <ellipse cx="26" cy="14" rx="6" ry="8" fill="#f0a030" stroke="#c47820" strokeWidth="1" />
      <ellipse cx="26" cy="14" rx="3" ry="5" fill="#fcd88a" />
      <ellipse cx="54" cy="14" rx="6" ry="8" fill="#f0a030" stroke="#c47820" strokeWidth="1" />
      <ellipse cx="54" cy="14" rx="3" ry="5" fill="#fcd88a" />
      {/* Face */}
      <ellipse cx="40" cy="32" rx="10" ry="7" fill="#fcd88a" />
      {/* Eyes */}
      <circle cx="34" cy="26" r="3" fill="#3d2414" />
      <circle cx="35" cy="25" r="1" fill="white" />
      <circle cx="46" cy="26" r="3" fill="#3d2414" />
      <circle cx="47" cy="25" r="1" fill="white" />
      {/* Nose */}
      <ellipse cx="40" cy="30" rx="3.5" ry="2.5" fill="#3d2414" />
      {/* Big grin */}
      <path d="M32 34 Q40 42 48 34" fill="none" stroke="#3d2414" strokeWidth="1.8" strokeLinecap="round" />
      {/* Eyebrows (excited) */}
      <path d="M30 21 Q34 18 38 21" fill="none" stroke="#3d2414" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M42 21 Q46 18 50 21" fill="none" stroke="#3d2414" strokeWidth="1.2" strokeLinecap="round" />
      {/* Spring legs */}
      <path d="M30 82 Q28 88 32 90 Q36 92 34 96" fill="none" stroke="#c47820" strokeWidth="3" strokeLinecap="round" />
      <path d="M50 82 Q52 88 48 90 Q44 92 46 96" fill="none" stroke="#c47820" strokeWidth="3" strokeLinecap="round" />
      {/* Feet */}
      <ellipse cx="34" cy="97" rx="8" ry="4" fill="#f0a030" stroke="#c47820" strokeWidth="1" />
      <ellipse cx="46" cy="97" rx="8" ry="4" fill="#f0a030" stroke="#c47820" strokeWidth="1" />
    </svg>
  );
}

/* ── Piglet ── */
export function Piglet({ size = 60, className = '' }) {
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 60 72"
      className={`select-none ${className}`}>
      {/* Body */}
      <ellipse cx="30" cy="44" rx="16" ry="18" fill="#f9c0d0" />
      <ellipse cx="30" cy="44" rx="16" ry="18" fill="none" stroke="#d4789a" strokeWidth="1" />
      {/* Shirt stripes */}
      <path d="M18 38 L42 38" fill="none" stroke="#e090a8" strokeWidth="2" opacity="0.6" />
      <path d="M16 44 L44 44" fill="none" stroke="#e090a8" strokeWidth="2" opacity="0.6" />
      <path d="M18 50 L42 50" fill="none" stroke="#e090a8" strokeWidth="2" opacity="0.6" />
      {/* Head */}
      <circle cx="30" cy="20" r="14" fill="#f9c0d0" stroke="#d4789a" strokeWidth="1" />
      {/* Ears */}
      <ellipse cx="18" cy="9" rx="5" ry="7" fill="#f9c0d0" stroke="#d4789a" strokeWidth="1" />
      <ellipse cx="18" cy="9" rx="2.5" ry="4" fill="#f0a0b8" />
      <ellipse cx="42" cy="9" rx="5" ry="7" fill="#f9c0d0" stroke="#d4789a" strokeWidth="1" />
      <ellipse cx="42" cy="9" rx="2.5" ry="4" fill="#f0a0b8" />
      {/* Eyes */}
      <circle cx="25" cy="18" r="2" fill="#3d2414" />
      <circle cx="25.5" cy="17.5" r="0.7" fill="white" />
      <circle cx="35" cy="18" r="2" fill="#3d2414" />
      <circle cx="35.5" cy="17.5" r="0.7" fill="white" />
      {/* Snout */}
      <ellipse cx="30" cy="24" rx="5" ry="3" fill="#f0a0b8" />
      <circle cx="28" cy="24" r="1" fill="#d4789a" />
      <circle cx="32" cy="24" r="1" fill="#d4789a" />
      {/* Gentle smile */}
      <path d="M26 27 Q30 30 34 27" fill="none" stroke="#d4789a" strokeWidth="1" strokeLinecap="round" />
      {/* Cheeks */}
      <circle cx="20" cy="22" r="3" fill="#f0a0b8" opacity="0.4" />
      <circle cx="40" cy="22" r="3" fill="#f0a0b8" opacity="0.4" />
      {/* Legs */}
      <ellipse cx="24" cy="62" rx="6" ry="4" fill="#f9c0d0" stroke="#d4789a" strokeWidth="0.8" />
      <ellipse cx="36" cy="62" rx="6" ry="4" fill="#f9c0d0" stroke="#d4789a" strokeWidth="0.8" />
    </svg>
  );
}

/* ── Eeyore ── */
export function Eeyore({ size = 80, className = '' }) {
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 80 88"
      className={`select-none ${className}`}>
      {/* Body */}
      <ellipse cx="40" cy="50" rx="26" ry="22" fill="#8898b0" />
      <ellipse cx="40" cy="50" rx="26" ry="22" fill="none" stroke="#6878a0" strokeWidth="1.2" />
      {/* Belly */}
      <ellipse cx="40" cy="52" rx="16" ry="14" fill="#a0b0c8" opacity="0.5" />
      {/* Head */}
      <ellipse cx="40" cy="26" rx="16" ry="14" fill="#8898b0" stroke="#6878a0" strokeWidth="1.2" />
      {/* Mane tuft */}
      <path d="M34 14 Q36 8 40 12 Q44 8 46 14" fill="#5a6888" stroke="#4a5878" strokeWidth="0.8" />
      {/* Ears (droopy) */}
      <path d="M26 20 Q18 14 16 22" fill="#8898b0" stroke="#6878a0" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M54 20 Q62 14 64 22" fill="#8898b0" stroke="#6878a0" strokeWidth="1.2" strokeLinecap="round" />
      {/* Eyes (droopy/sad but loveable) */}
      <circle cx="34" cy="24" r="2.5" fill="#3d2414" />
      <circle cx="34.5" cy="23.5" r="0.8" fill="white" />
      <circle cx="46" cy="24" r="2.5" fill="#3d2414" />
      <circle cx="46.5" cy="23.5" r="0.8" fill="white" />
      {/* Droopy eyebrows */}
      <path d="M30 20 Q34 19 38 21" fill="none" stroke="#5a6888" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M42 21 Q46 19 50 20" fill="none" stroke="#5a6888" strokeWidth="1.2" strokeLinecap="round" />
      {/* Nose */}
      <ellipse cx="40" cy="30" rx="4" ry="2.5" fill="#5a6888" />
      {/* Small smile (trying his best) */}
      <path d="M36 34 Q40 36 44 34" fill="none" stroke="#5a6888" strokeWidth="1.2" strokeLinecap="round" />
      {/* Legs */}
      <rect x="26" y="68" width="6" height="12" rx="3" fill="#8898b0" stroke="#6878a0" strokeWidth="0.8" />
      <rect x="48" y="68" width="6" height="12" rx="3" fill="#8898b0" stroke="#6878a0" strokeWidth="0.8" />
      {/* Tail with bow */}
      <path d="M14 50 Q8 48 6 52 Q4 56 10 55" fill="none" stroke="#8898b0" strokeWidth="2" strokeLinecap="round" />
      <path d="M7 50 L5 48 M7 50 L9 48 M7 50 L7 53" fill="none" stroke="#e090a8" strokeWidth="1.5" strokeLinecap="round" />
      {/* Pink bow on tail */}
      <circle cx="7" cy="50" r="2" fill="#f0a0b8" />
    </svg>
  );
}

/* ── Owl (Wise) ── */
export function WiseOwl({ size = 60, className = '' }) {
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 60 69"
      className={`select-none ${className}`}>
      {/* Body */}
      <ellipse cx="30" cy="42" rx="18" ry="22" fill="#a08060" />
      <ellipse cx="30" cy="42" rx="18" ry="22" fill="none" stroke="#806040" strokeWidth="1" />
      {/* Belly feathers */}
      <ellipse cx="30" cy="46" rx="12" ry="14" fill="#c8a878" />
      <path d="M22 40 Q26 42 30 40 Q34 42 38 40" fill="none" stroke="#a08060" strokeWidth="0.8" />
      <path d="M20 46 Q26 48 30 46 Q34 48 40 46" fill="none" stroke="#a08060" strokeWidth="0.8" />
      {/* Head */}
      <circle cx="30" cy="18" r="14" fill="#a08060" stroke="#806040" strokeWidth="1" />
      {/* Ear tufts */}
      <path d="M20 8 L16 2 L22 6" fill="#806040" />
      <path d="M40 8 L44 2 L38 6" fill="#806040" />
      {/* Eye circles */}
      <circle cx="24" cy="16" r="6" fill="#f0e8d0" stroke="#806040" strokeWidth="0.8" />
      <circle cx="36" cy="16" r="6" fill="#f0e8d0" stroke="#806040" strokeWidth="0.8" />
      {/* Eyes */}
      <circle cx="24" cy="16" r="3" fill="#3d2414" />
      <circle cx="24.5" cy="15.5" r="1" fill="white" />
      <circle cx="36" cy="16" r="3" fill="#3d2414" />
      <circle cx="36.5" cy="15.5" r="1" fill="white" />
      {/* Beak */}
      <path d="M27 22 L30 28 L33 22" fill="#d4943a" stroke="#b07828" strokeWidth="0.8" />
      {/* Spectacles (wise owl!) */}
      <circle cx="24" cy="16" r="7" fill="none" stroke="#806040" strokeWidth="1" />
      <circle cx="36" cy="16" r="7" fill="none" stroke="#806040" strokeWidth="1" />
      <path d="M31 16 L29 16" fill="none" stroke="#806040" strokeWidth="1" />
      {/* Feet */}
      <path d="M24 62 L20 66 M24 62 L24 66 M24 62 L28 66" fill="none" stroke="#d4943a" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M36 62 L32 66 M36 62 L36 66 M36 62 L40 66" fill="none" stroke="#d4943a" strokeWidth="1.5" strokeLinecap="round" />
      {/* Wings (tucked) */}
      <path d="M12 36 Q8 44 14 52" fill="none" stroke="#806040" strokeWidth="2" strokeLinecap="round" />
      <path d="M48 36 Q52 44 46 52" fill="none" stroke="#806040" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ── Rabbit ── */
export function HundredAcreRabbit({ size = 60, className = '' }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 60 78"
      className={`select-none ${className}`}>
      {/* Ears */}
      <ellipse cx="22" cy="12" rx="5" ry="16" fill="#c8a878" stroke="#a08060" strokeWidth="1" />
      <ellipse cx="22" cy="12" rx="2.5" ry="12" fill="#f0c8a0" />
      <ellipse cx="38" cy="12" rx="5" ry="16" fill="#c8a878" stroke="#a08060" strokeWidth="1" />
      <ellipse cx="38" cy="12" rx="2.5" ry="12" fill="#f0c8a0" />
      {/* Head */}
      <circle cx="30" cy="30" r="14" fill="#c8a878" stroke="#a08060" strokeWidth="1" />
      {/* Body */}
      <ellipse cx="30" cy="52" rx="14" ry="16" fill="#c8a878" stroke="#a08060" strokeWidth="1" />
      {/* Belly */}
      <ellipse cx="30" cy="54" rx="9" ry="10" fill="#e8d0b0" />
      {/* Eyes */}
      <circle cx="25" cy="28" r="2" fill="#3d2414" />
      <circle cx="35" cy="28" r="2" fill="#3d2414" />
      {/* Nose */}
      <ellipse cx="30" cy="33" rx="2" ry="1.5" fill="#d4789a" />
      {/* Whiskers */}
      <path d="M20 33 L10 31 M20 34 L10 35" fill="none" stroke="#a08060" strokeWidth="0.6" />
      <path d="M40 33 L50 31 M40 34 L50 35" fill="none" stroke="#a08060" strokeWidth="0.6" />
      {/* Mouth */}
      <path d="M28 35 Q30 37 32 35" fill="none" stroke="#a08060" strokeWidth="0.8" strokeLinecap="round" />
      {/* Feet */}
      <ellipse cx="24" cy="68" rx="7" ry="4" fill="#c8a878" stroke="#a08060" strokeWidth="0.8" />
      <ellipse cx="36" cy="68" rx="7" ry="4" fill="#c8a878" stroke="#a08060" strokeWidth="0.8" />
      {/* Fluffy tail */}
      <circle cx="30" cy="66" r="5" fill="#f0e8d0" />
    </svg>
  );
}

/* ── Small Pooh (for game HUD / icons) ── */
export function PoohSmall({ size = 40, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={`select-none ${className}`}>
      {/* Head */}
      <circle cx="20" cy="18" r="14" fill="#e8c97a" stroke="#c4943a" strokeWidth="1.2" />
      {/* Ears */}
      <circle cx="9" cy="8" r="5" fill="#e8c97a" stroke="#c4943a" strokeWidth="1" />
      <circle cx="9" cy="8" r="2.5" fill="#d4a54a" />
      <circle cx="31" cy="8" r="5" fill="#e8c97a" stroke="#c4943a" strokeWidth="1" />
      <circle cx="31" cy="8" r="2.5" fill="#d4a54a" />
      {/* Eyes */}
      <circle cx="16" cy="16" r="2" fill="#3d2414" />
      <circle cx="24" cy="16" r="2" fill="#3d2414" />
      {/* Nose */}
      <ellipse cx="20" cy="21" rx="2.5" ry="1.5" fill="#3d2414" />
      {/* Smile */}
      <path d="M16 24 Q20 28 24 24" fill="none" stroke="#3d2414" strokeWidth="1.2" strokeLinecap="round" />
      {/* Red shirt peek */}
      <path d="M8 30 Q20 36 32 30" fill="#c0392b" stroke="#962d22" strokeWidth="0.8" />
    </svg>
  );
}
