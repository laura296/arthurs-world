/**
 * SVG clothing illustrations for the Getting Dressed game.
 * Warm, rounded, Pixar-feel inline SVGs with gradients and highlights.
 */

export function SVGUnderwear() {
  return (
    <svg viewBox="0 0 120 100" width="100%" height="100%">
      <defs>
        <linearGradient id="uw-g" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
      </defs>
      <path d="M30 20 Q30 14 60 14 Q90 14 90 20 L92 50 Q90 58 76 60 L68 60 Q62 50 60 50 Q58 50 52 60 L44 60 Q30 58 28 50Z"
            fill="url(#uw-g)" stroke="#3b82f6" strokeWidth="1.5" />
      <rect x="30" y="14" width="60" height="10" rx="5" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1" />
      <path d="M42 22 Q50 20 58 22" stroke="#fff" strokeWidth="1.5" fill="none" opacity="0.4" strokeLinecap="round" />
    </svg>
  );
}

export function SVGSocks() {
  return (
    <svg viewBox="0 0 120 100" width="100%" height="100%">
      <defs>
        <linearGradient id="sock-g" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fdba74" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>
      {/* Left sock */}
      <path d="M24 12 Q22 12 22 16 L20 52 Q20 60 28 62 L42 62 Q50 62 50 54 L50 46 Q46 40 44 40 L44 16 Q44 12 42 12Z"
            fill="url(#sock-g)" stroke="#ea580c" strokeWidth="1" />
      <rect x="22" y="12" width="22" height="8" rx="3" fill="#fed7aa" />
      <line x1="24" y1="20" x2="42" y2="20" stroke="#ea580c" strokeWidth="0.8" opacity="0.3" />
      <line x1="24" y1="24" x2="42" y2="24" stroke="#ea580c" strokeWidth="0.8" opacity="0.3" />
      {/* Right sock */}
      <path d="M76 12 Q74 12 74 16 L72 52 Q72 60 80 62 L94 62 Q102 62 102 54 L102 46 Q98 40 96 40 L96 16 Q96 12 94 12Z"
            fill="url(#sock-g)" stroke="#ea580c" strokeWidth="1" />
      <rect x="74" y="12" width="22" height="8" rx="3" fill="#fed7aa" />
      <line x1="76" y1="20" x2="94" y2="20" stroke="#ea580c" strokeWidth="0.8" opacity="0.3" />
    </svg>
  );
}

export function SVGTShirt() {
  return (
    <svg viewBox="0 0 120 100" width="100%" height="100%">
      <defs>
        <linearGradient id="tee-g" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
      </defs>
      {/* Body + sleeves */}
      <path d="M40 18 L28 22 L14 32 L18 42 L30 38 L30 80 Q30 84 34 84 L86 84 Q90 84 90 80 L90 38 L102 42 L106 32 L92 22 L80 18 Q72 12 60 12 Q48 12 40 18Z"
            fill="url(#tee-g)" stroke="#16a34a" strokeWidth="1.5" />
      {/* Collar */}
      <path d="M44 18 Q52 24 60 24 Q68 24 76 18" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
      {/* Star motif */}
      <path d="M60 46 L62 52 L68 52 L63 56 L65 62 L60 58 L55 62 L57 56 L52 52 L58 52Z"
            fill="#facc15" opacity="0.7" />
      {/* Highlight */}
      <path d="M36 28 Q40 22 50 20" stroke="#fff" strokeWidth="2" fill="none" opacity="0.25" strokeLinecap="round" />
    </svg>
  );
}

export function SVGTrousers() {
  return (
    <svg viewBox="0 0 120 100" width="100%" height="100%">
      <defs>
        <linearGradient id="trs-g" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <path d="M32 8 L88 8 Q90 8 90 12 L92 42 L82 88 Q80 92 76 92 L68 92 Q64 92 64 88 L62 52 L58 52 L56 88 Q56 92 52 92 L44 92 Q40 92 38 88 L28 42 L30 12 Q30 8 32 8Z"
            fill="url(#trs-g)" stroke="#2563eb" strokeWidth="1.5" />
      {/* Waistband */}
      <rect x="32" y="8" width="56" height="8" rx="3" fill="#bfdbfe" />
      {/* Pockets */}
      <path d="M38 18 L38 30 Q42 32 48 30 L48 18" fill="none" stroke="#2563eb" strokeWidth="1" opacity="0.4" />
      <path d="M72 18 L72 30 Q76 32 82 30 L82 18" fill="none" stroke="#2563eb" strokeWidth="1" opacity="0.4" />
      <path d="M36 14 Q44 12 52 14" stroke="#fff" strokeWidth="1.5" fill="none" opacity="0.2" strokeLinecap="round" />
    </svg>
  );
}

export function SVGJumper() {
  return (
    <svg viewBox="0 0 120 100" width="100%" height="100%">
      <defs>
        <linearGradient id="jmp-g" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#d8b4fe" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      {/* Body + hood outline + sleeves */}
      <path d="M40 22 L26 26 L12 36 L16 46 L28 42 L28 82 Q28 86 32 86 L88 86 Q92 86 92 82 L92 42 L104 46 L108 36 L94 26 L80 22 Q72 16 60 16 Q48 16 40 22Z"
            fill="url(#jmp-g)" stroke="#9333ea" strokeWidth="1.5" />
      {/* Hood */}
      <path d="M42 22 Q46 8 60 8 Q74 8 78 22" fill="#c084fc" stroke="#9333ea" strokeWidth="1.5" />
      {/* Drawstrings */}
      <line x1="54" y1="22" x2="52" y2="32" stroke="#e9d5ff" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="66" y1="22" x2="68" y2="32" stroke="#e9d5ff" strokeWidth="1.5" strokeLinecap="round" />
      {/* Kangaroo pocket */}
      <path d="M42 58 Q42 52 60 52 Q78 52 78 58 L78 70 Q78 74 60 74 Q42 74 42 70Z"
            fill="#9333ea" opacity="0.25" stroke="#9333ea" strokeWidth="1" />
      <path d="M34 28 Q42 22 52 22" stroke="#fff" strokeWidth="2" fill="none" opacity="0.2" strokeLinecap="round" />
    </svg>
  );
}

export function SVGShoes() {
  return (
    <svg viewBox="0 0 120 100" width="100%" height="100%">
      <defs>
        <linearGradient id="shoe-g" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#fca5a5" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>
      {/* Left shoe */}
      <path d="M10 44 L10 36 Q10 24 22 24 L34 24 Q38 24 38 28 L38 44 Q38 54 28 56 L8 56 Q4 56 4 52 L4 48 Q4 44 10 44Z"
            fill="url(#shoe-g)" stroke="#dc2626" strokeWidth="1.5" />
      <rect x="4" y="50" width="36" height="8" rx="3" fill="#fefefe" />
      {/* Laces */}
      <circle cx="22" cy="30" r="1.5" fill="#fff" />
      <circle cx="28" cy="30" r="1.5" fill="#fff" />
      {/* Right shoe */}
      <path d="M82 44 L82 36 Q82 24 94 24 L106 24 Q110 24 110 28 L110 44 Q110 54 100 56 L80 56 Q76 56 76 52 L76 48 Q76 44 82 44Z"
            fill="url(#shoe-g)" stroke="#dc2626" strokeWidth="1.5" />
      <rect x="76" y="50" width="36" height="8" rx="3" fill="#fefefe" />
      <circle cx="94" cy="30" r="1.5" fill="#fff" />
      <circle cx="100" cy="30" r="1.5" fill="#fff" />
    </svg>
  );
}

export const CLOTHING_SVGS = {
  underwear: SVGUnderwear,
  socks: SVGSocks,
  tshirt: SVGTShirt,
  trousers: SVGTrousers,
  jumper: SVGJumper,
  shoes: SVGShoes,
};
