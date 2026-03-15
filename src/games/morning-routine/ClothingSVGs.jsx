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

/* ── Beach outfit ── */

export function SVGSwimsuit() {
  return (
    <svg viewBox="0 0 120 100" width="100%" height="100%">
      <defs>
        <linearGradient id="swim-g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>
      </defs>
      {/* Swim trunks */}
      <path d="M32 20 Q32 14 60 14 Q88 14 88 20 L90 48 Q88 56 76 58 L68 58 Q62 48 60 48 Q58 48 52 58 L44 58 Q32 56 30 48Z"
            fill="url(#swim-g)" stroke="#0284c7" strokeWidth="1.5" />
      <rect x="32" y="14" width="56" height="8" rx="4" fill="#7dd3fc" />
      {/* Flower pattern */}
      <circle cx="50" cy="36" r="4" fill="#facc15" opacity="0.6" />
      <circle cx="70" cy="32" r="3" fill="#fb923c" opacity="0.5" />
      <circle cx="60" cy="44" r="3.5" fill="#facc15" opacity="0.5" />
      <path d="M38 20 Q48 18 56 20" stroke="#fff" strokeWidth="1.5" fill="none" opacity="0.3" strokeLinecap="round" />
    </svg>
  );
}

export function SVGFlipFlops() {
  return (
    <svg viewBox="0 0 120 100" width="100%" height="100%">
      <defs>
        <linearGradient id="flip-g" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      {/* Left flip flop */}
      <ellipse cx="32" cy="50" rx="18" ry="26" fill="url(#flip-g)" stroke="#d97706" strokeWidth="1.5" />
      <path d="M32 30 L24 44 M32 30 L40 44" stroke="#d97706" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <ellipse cx="32" cy="50" rx="14" ry="22" fill="none" stroke="#fde68a" strokeWidth="0.8" opacity="0.4" />
      {/* Right flip flop */}
      <ellipse cx="88" cy="50" rx="18" ry="26" fill="url(#flip-g)" stroke="#d97706" strokeWidth="1.5" />
      <path d="M88 30 L80 44 M88 30 L96 44" stroke="#d97706" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <ellipse cx="88" cy="50" rx="14" ry="22" fill="none" stroke="#fde68a" strokeWidth="0.8" opacity="0.4" />
    </svg>
  );
}

export function SVGSunHat() {
  return (
    <svg viewBox="0 0 120 100" width="100%" height="100%">
      <defs>
        <linearGradient id="sunhat-g" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#fde68a" />
        </linearGradient>
      </defs>
      {/* Wide brim */}
      <ellipse cx="60" cy="58" rx="50" ry="14" fill="url(#sunhat-g)" stroke="#d97706" strokeWidth="1.5" />
      {/* Crown */}
      <path d="M34 58 Q34 24 60 24 Q86 24 86 58" fill="#fde68a" stroke="#d97706" strokeWidth="1.5" />
      {/* Ribbon */}
      <rect x="34" y="48" width="52" height="8" rx="2" fill="#f472b6" />
      <path d="M82 48 L92 42 L88 56 L82 56Z" fill="#ec4899" />
      {/* Straw texture */}
      <path d="M42 34 Q50 32 58 34" stroke="#d97706" strokeWidth="0.6" fill="none" opacity="0.3" />
      <path d="M46 40 Q54 38 62 40" stroke="#d97706" strokeWidth="0.6" fill="none" opacity="0.3" />
      <path d="M38 28 Q46 24 54 28" stroke="#fff" strokeWidth="1.5" fill="none" opacity="0.2" strokeLinecap="round" />
    </svg>
  );
}

export function SVGSunglasses() {
  return (
    <svg viewBox="0 0 120 100" width="100%" height="100%">
      {/* Left lens */}
      <rect x="12" y="32" width="38" height="30" rx="10" fill="#1e293b" stroke="#334155" strokeWidth="2" />
      <rect x="16" y="36" width="30" height="22" rx="7" fill="#0f172a" opacity="0.8" />
      {/* Right lens */}
      <rect x="70" y="32" width="38" height="30" rx="10" fill="#1e293b" stroke="#334155" strokeWidth="2" />
      <rect x="74" y="36" width="30" height="22" rx="7" fill="#0f172a" opacity="0.8" />
      {/* Bridge */}
      <path d="M50 44 Q60 38 70 44" stroke="#334155" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Arms */}
      <line x1="12" y1="40" x2="4" y2="36" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="108" y1="40" x2="116" y2="36" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
      {/* Lens shine */}
      <path d="M22 40 Q26 36 32 38" stroke="#fff" strokeWidth="1.5" fill="none" opacity="0.3" strokeLinecap="round" />
      <path d="M80 40 Q84 36 90 38" stroke="#fff" strokeWidth="1.5" fill="none" opacity="0.3" strokeLinecap="round" />
    </svg>
  );
}

/* ── Snow outfit ── */

export function SVGWinterCoat() {
  return (
    <svg viewBox="0 0 120 100" width="100%" height="100%">
      <defs>
        <linearGradient id="coat-g" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>
      </defs>
      {/* Body + sleeves */}
      <path d="M38 20 L24 24 L10 34 L14 46 L26 42 L26 84 Q26 88 30 88 L90 88 Q94 88 94 84 L94 42 L106 46 L110 34 L96 24 L82 20 Q72 14 60 14 Q48 14 38 20Z"
            fill="url(#coat-g)" stroke="#991b1b" strokeWidth="1.5" />
      {/* Fur collar */}
      <path d="M40 20 Q50 26 60 26 Q70 26 80 20" fill="#fef3c7" stroke="#fbbf24" strokeWidth="1" />
      <path d="M40 20 Q50 28 60 28 Q70 28 80 20" fill="none" stroke="#fde68a" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      {/* Zipper */}
      <line x1="60" y1="26" x2="60" y2="86" stroke="#fbbf24" strokeWidth="2" />
      {/* Buttons */}
      <circle cx="60" cy="40" r="3" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" />
      <circle cx="60" cy="56" r="3" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" />
      <circle cx="60" cy="72" r="3" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" />
      {/* Highlight */}
      <path d="M32 30 Q40 22 50 20" stroke="#fff" strokeWidth="2" fill="none" opacity="0.2" strokeLinecap="round" />
    </svg>
  );
}

export function SVGWoollyHat() {
  return (
    <svg viewBox="0 0 120 100" width="100%" height="100%">
      <defs>
        <linearGradient id="wh-g" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      {/* Hat body */}
      <path d="M26 62 Q26 24 60 20 Q94 24 94 62Z" fill="url(#wh-g)" stroke="#2563eb" strokeWidth="1.5" />
      {/* Brim fold */}
      <path d="M22 62 Q22 54 60 52 Q98 54 98 62 Q98 72 60 70 Q22 72 22 62Z"
            fill="#93c5fd" stroke="#2563eb" strokeWidth="1.5" />
      {/* Bobble */}
      <circle cx="60" cy="16" r="10" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
      <circle cx="57" cy="13" r="3" fill="#fde68a" opacity="0.5" />
      {/* Stripe */}
      <path d="M30 40 Q60 36 90 40" stroke="#fff" strokeWidth="3" fill="none" opacity="0.3" strokeLinecap="round" />
      <path d="M28 48 Q60 44 92 48" stroke="#fff" strokeWidth="3" fill="none" opacity="0.3" strokeLinecap="round" />
      {/* Knit texture highlight */}
      <path d="M36 30 Q46 26 56 28" stroke="#fff" strokeWidth="1.5" fill="none" opacity="0.15" strokeLinecap="round" />
    </svg>
  );
}

export function SVGScarf() {
  return (
    <svg viewBox="0 0 120 100" width="100%" height="100%">
      <defs>
        <linearGradient id="scarf-g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
      </defs>
      {/* Wrapped part */}
      <path d="M20 28 Q20 18 60 16 Q100 18 100 28 Q100 38 60 40 Q20 38 20 28Z"
            fill="url(#scarf-g)" stroke="#16a34a" strokeWidth="1.5" />
      {/* Hanging end */}
      <path d="M70 36 L74 78 Q74 84 68 84 L58 84 Q52 84 52 78 L48 44"
            fill="#22c55e" stroke="#16a34a" strokeWidth="1.5" />
      {/* Stripes */}
      <path d="M26 24 Q60 20 94 24" stroke="#fff" strokeWidth="2.5" fill="none" opacity="0.3" strokeLinecap="round" />
      <path d="M24 32 Q60 28 96 32" stroke="#dc2626" strokeWidth="2.5" fill="none" opacity="0.4" strokeLinecap="round" />
      {/* Fringe on hanging end */}
      <line x1="54" y1="82" x2="54" y2="92" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="58" y1="83" x2="58" y2="93" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="62" y1="84" x2="62" y2="94" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="66" y1="83" x2="66" y2="93" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="70" y1="82" x2="70" y2="92" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function SVGWinterBoots() {
  return (
    <svg viewBox="0 0 120 100" width="100%" height="100%">
      <defs>
        <linearGradient id="wboot-g" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#92400e" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
      </defs>
      {/* Left boot */}
      <path d="M12 60 L12 28 Q12 16 24 16 L34 16 Q40 16 40 22 L40 60 Q40 70 30 72 L6 72 Q2 72 2 68 L2 64 Q2 60 12 60Z"
            fill="url(#wboot-g)" stroke="#451a03" strokeWidth="1.5" />
      {/* Left fur trim */}
      <path d="M12 18 Q24 12 40 18" fill="#fef3c7" stroke="#fbbf24" strokeWidth="1" />
      <rect x="10" y="16" width="32" height="6" rx="3" fill="#fde68a" opacity="0.7" />
      <rect x="2" y="66" width="40" height="8" rx="3" fill="#451a03" />
      {/* Right boot */}
      <path d="M80 60 L80 28 Q80 16 92 16 L102 16 Q108 16 108 22 L108 60 Q108 70 98 72 L74 72 Q70 72 70 68 L70 64 Q70 60 80 60Z"
            fill="url(#wboot-g)" stroke="#451a03" strokeWidth="1.5" />
      {/* Right fur trim */}
      <path d="M80 18 Q92 12 108 18" fill="#fef3c7" stroke="#fbbf24" strokeWidth="1" />
      <rect x="78" y="16" width="32" height="6" rx="3" fill="#fde68a" opacity="0.7" />
      <rect x="70" y="66" width="40" height="8" rx="3" fill="#451a03" />
    </svg>
  );
}

/* ── Festive outfits ── */

export function SVGBunnyEars() {
  return (
    <svg viewBox="0 0 120 100" width="100%" height="100%">
      {/* Headband */}
      <path d="M20 68 Q20 58 60 56 Q100 58 100 68 Q100 74 60 72 Q20 74 20 68Z"
            fill="#f472b6" stroke="#ec4899" strokeWidth="1.5" />
      {/* Left ear */}
      <path d="M38 58 Q32 8 36 6 Q42 4 48 8 Q54 14 48 58"
            fill="#fce7f3" stroke="#ec4899" strokeWidth="1.5" />
      <path d="M40 52 Q36 16 40 12 Q44 10 46 14 Q50 20 46 52"
            fill="#fda4af" opacity="0.6" />
      {/* Right ear */}
      <path d="M72 58 Q66 8 70 6 Q76 4 82 8 Q88 14 82 58"
            fill="#fce7f3" stroke="#ec4899" strokeWidth="1.5" />
      <path d="M74 52 Q70 16 74 12 Q78 10 80 14 Q84 20 80 52"
            fill="#fda4af" opacity="0.6" />
      {/* Bow */}
      <circle cx="60" cy="66" r="4" fill="#ec4899" />
      <path d="M52 66 Q56 60 60 66 Q64 60 68 66 Q64 72 60 66 Q56 72 52 66Z"
            fill="#f472b6" stroke="#ec4899" strokeWidth="0.8" />
    </svg>
  );
}

export function SVGHalloweenCape() {
  return (
    <svg viewBox="0 0 120 100" width="100%" height="100%">
      <defs>
        <linearGradient id="cape-g" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#581c87" />
          <stop offset="100%" stopColor="#3b0764" />
        </linearGradient>
      </defs>
      {/* Cape body */}
      <path d="M34 14 Q34 10 60 10 Q86 10 86 14 L96 80 Q96 90 80 92 L60 94 L40 92 Q24 90 24 80Z"
            fill="url(#cape-g)" stroke="#6b21a8" strokeWidth="1.5" />
      {/* Collar */}
      <path d="M34 14 L28 28 Q38 22 60 22 Q82 22 92 28 L86 14"
            fill="#7c3aed" stroke="#6b21a8" strokeWidth="1" />
      {/* Clasp */}
      <circle cx="60" cy="14" r="5" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
      <circle cx="60" cy="14" r="2" fill="#fde68a" />
      {/* Stars on cape */}
      <path d="M44 50 L45 53 L48 53 L46 55 L47 58 L44 56 L41 58 L42 55 L40 53 L43 53Z"
            fill="#fbbf24" opacity="0.6" />
      <path d="M76 44 L77 47 L80 47 L78 49 L79 52 L76 50 L73 52 L74 49 L72 47 L75 47Z"
            fill="#fbbf24" opacity="0.5" />
      <path d="M58 68 L59 71 L62 71 L60 73 L61 76 L58 74 L55 76 L56 73 L54 71 L57 71Z"
            fill="#fbbf24" opacity="0.4" />
      {/* Inner lining hint */}
      <path d="M30 70 Q38 60 42 80" stroke="#dc2626" strokeWidth="1" fill="none" opacity="0.3" />
      <path d="M90 70 Q82 60 78 80" stroke="#dc2626" strokeWidth="1" fill="none" opacity="0.3" />
    </svg>
  );
}

export function SVGChristmasJumper() {
  return (
    <svg viewBox="0 0 120 100" width="100%" height="100%">
      <defs>
        <linearGradient id="xmas-g" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>
      </defs>
      {/* Body + sleeves */}
      <path d="M40 20 L28 24 L14 34 L18 44 L30 40 L30 82 Q30 86 34 86 L86 86 Q90 86 90 82 L90 40 L102 44 L106 34 L92 24 L80 20 Q72 14 60 14 Q48 14 40 20Z"
            fill="url(#xmas-g)" stroke="#991b1b" strokeWidth="1.5" />
      {/* Collar */}
      <path d="M44 20 Q52 26 60 26 Q68 26 76 20" fill="#fef3c7" stroke="#fbbf24" strokeWidth="1.5" />
      {/* Snowflake pattern */}
      <line x1="60" y1="40" x2="60" y2="56" stroke="#fff" strokeWidth="1.5" opacity="0.5" />
      <line x1="52" y1="48" x2="68" y2="48" stroke="#fff" strokeWidth="1.5" opacity="0.5" />
      <line x1="54" y1="42" x2="66" y2="54" stroke="#fff" strokeWidth="1" opacity="0.3" />
      <line x1="66" y1="42" x2="54" y2="54" stroke="#fff" strokeWidth="1" opacity="0.3" />
      {/* Tree motif */}
      <path d="M60 60 L52 72 L68 72Z" fill="#22c55e" opacity="0.7" />
      <path d="M60 56 L54 66 L66 66Z" fill="#22c55e" opacity="0.6" />
      <rect x="58" y="72" width="4" height="4" rx="1" fill="#92400e" opacity="0.6" />
      <circle cx="60" cy="56" r="2" fill="#fbbf24" opacity="0.7" />
      {/* Cuff stripes */}
      <path d="M14 34 Q16 38 18 38" stroke="#fff" strokeWidth="2" fill="none" opacity="0.3" />
      <path d="M106 34 Q104 38 102 38" stroke="#fff" strokeWidth="2" fill="none" opacity="0.3" />
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
  swimsuit: SVGSwimsuit,
  flipflops: SVGFlipFlops,
  sunhat: SVGSunHat,
  sunglasses: SVGSunglasses,
  wintercoat: SVGWinterCoat,
  woollyhat: SVGWoollyHat,
  scarf: SVGScarf,
  winterboots: SVGWinterBoots,
  bunnyears: SVGBunnyEars,
  halloweencape: SVGHalloweenCape,
  christmasjumper: SVGChristmasJumper,
};
