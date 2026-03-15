/**
 * SVG food illustrations for Arthur's Lunchbox game.
 * Each is a rich inline SVG with gradients, highlights, and soft shadows.
 * viewBox="0 0 80 80" — designed for ~72-80px touch targets.
 */

export function SVGApple() {
  return (
    <svg viewBox="0 0 80 80" width="100%" height="100%">
      <defs>
        <radialGradient id="apple-g" cx="40%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="80%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#b91c1c" />
        </radialGradient>
        <radialGradient id="apple-shine" cx="30%" cy="25%" r="30%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="40" cy="70" rx="18" ry="3" fill="#000" opacity="0.08" />
      <path d="M40 18 C28 18 16 30 16 48 C16 62 26 72 40 72 C54 72 64 62 64 48 C64 30 52 18 40 18Z" fill="url(#apple-g)" />
      <path d="M40 18 C28 18 16 30 16 48 C16 62 26 72 40 72 C54 72 64 62 64 48 C64 30 52 18 40 18Z" fill="url(#apple-shine)" />
      <path d="M38 12 Q40 6 44 10" stroke="#8B6F47" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M44 10 Q50 8 48 14 Q46 12 42 14" fill="#22c55e" />
    </svg>
  );
}

export function SVGBanana() {
  return (
    <svg viewBox="0 0 80 80" width="100%" height="100%">
      <defs>
        <linearGradient id="banana-g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="60%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#eab308" />
        </linearGradient>
      </defs>
      <ellipse cx="40" cy="70" rx="20" ry="3" fill="#000" opacity="0.06" />
      <path d="M20 55 Q15 35 25 22 Q35 10 50 15 Q58 18 60 25 Q55 20 45 18 Q32 16 25 30 Q18 44 24 55Z" fill="url(#banana-g)" stroke="#d4a20a" strokeWidth="1" />
      <path d="M25 25 Q30 18 42 18" stroke="#fff" strokeWidth="2" fill="none" opacity="0.3" strokeLinecap="round" />
      <circle cx="22" cy="54" r="2" fill="#92400e" opacity="0.4" />
      <circle cx="60" cy="24" r="1.5" fill="#92400e" opacity="0.3" />
    </svg>
  );
}

export function SVGCarrot() {
  return (
    <svg viewBox="0 0 80 80" width="100%" height="100%">
      <defs>
        <linearGradient id="carrot-g" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
      </defs>
      <ellipse cx="40" cy="72" rx="10" ry="2.5" fill="#000" opacity="0.06" />
      <path d="M40 20 Q48 20 50 35 Q52 50 46 70 Q44 74 40 74 Q36 74 34 70 Q28 50 30 35 Q32 20 40 20Z" fill="url(#carrot-g)" />
      <line x1="36" y1="35" x2="44" y2="34" stroke="#c2410c" strokeWidth="0.8" opacity="0.4" />
      <line x1="35" y1="45" x2="45" y2="44" stroke="#c2410c" strokeWidth="0.8" opacity="0.4" />
      <line x1="36" y1="55" x2="44" y2="54" stroke="#c2410c" strokeWidth="0.8" opacity="0.4" />
      <path d="M40 20 Q35 12 30 8" stroke="#16a34a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M40 20 Q40 10 42 6" stroke="#22c55e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M40 20 Q45 12 50 10" stroke="#16a34a" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="35" cy="30" rx="3" ry="8" fill="#fff" opacity="0.15" />
    </svg>
  );
}

export function SVGBroccoli() {
  return (
    <svg viewBox="0 0 80 80" width="100%" height="100%">
      <defs>
        <radialGradient id="broc-g" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#16a34a" />
        </radialGradient>
      </defs>
      <ellipse cx="40" cy="72" rx="12" ry="2.5" fill="#000" opacity="0.06" />
      <rect x="36" y="52" width="8" height="22" rx="4" fill="#65a30d" />
      <circle cx="30" cy="38" r="14" fill="url(#broc-g)" />
      <circle cx="45" cy="34" r="13" fill="url(#broc-g)" />
      <circle cx="38" cy="26" r="12" fill="#4ade80" />
      <circle cx="50" cy="42" r="10" fill="url(#broc-g)" />
      <circle cx="32" cy="30" r="4" fill="#86efac" opacity="0.5" />
      <circle cx="46" cy="28" r="3" fill="#86efac" opacity="0.4" />
    </svg>
  );
}

export function SVGStrawberry() {
  return (
    <svg viewBox="0 0 80 80" width="100%" height="100%">
      <defs>
        <radialGradient id="straw-g" cx="40%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="80%" stopColor="#e11d48" />
          <stop offset="100%" stopColor="#be123c" />
        </radialGradient>
      </defs>
      <ellipse cx="40" cy="72" rx="14" ry="2.5" fill="#000" opacity="0.06" />
      <path d="M40 24 Q54 30 56 48 Q56 64 40 72 Q24 64 24 48 Q26 30 40 24Z" fill="url(#straw-g)" />
      {/* Seeds */}
      {[[34,36],[46,38],[38,46],[44,50],[40,58],[34,54],[48,44]].map(([x,y],i) => (
        <ellipse key={i} cx={x} cy={y} rx="1.2" ry="1.8" fill="#fecdd3" opacity="0.6" />
      ))}
      <path d="M33 22 Q40 18 47 22" fill="#22c55e" />
      <path d="M36 20 Q40 14 44 20" fill="#16a34a" />
      <ellipse cx="34" cy="35" rx="4" ry="6" fill="#fff" opacity="0.12" />
    </svg>
  );
}

export function SVGGrapes() {
  return (
    <svg viewBox="0 0 80 80" width="100%" height="100%">
      <defs>
        <radialGradient id="grape-g" cx="40%" cy="35%" r="50%">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#7c3aed" />
        </radialGradient>
      </defs>
      <ellipse cx="40" cy="72" rx="14" ry="2.5" fill="#000" opacity="0.06" />
      <line x1="40" y1="12" x2="40" y2="28" stroke="#65a30d" strokeWidth="2" />
      <path d="M40 14 Q46 10 48 14" fill="#22c55e" />
      {/* Grape cluster */}
      {[[32,34],[48,34],[28,44],[40,42],[52,44],[32,54],[44,52],[38,62]].map(([x,y],i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="9" fill="url(#grape-g)" />
          <circle cx={x-2} cy={y-3} r="3" fill="#fff" opacity="0.2" />
        </g>
      ))}
    </svg>
  );
}

export function SVGOrange() {
  return (
    <svg viewBox="0 0 80 80" width="100%" height="100%">
      <defs>
        <radialGradient id="orange-g" cx="40%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#fdba74" />
          <stop offset="70%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ea580c" />
        </radialGradient>
        <radialGradient id="orange-shine" cx="30%" cy="25%" r="30%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="40" cy="70" rx="18" ry="3" fill="#000" opacity="0.06" />
      <circle cx="40" cy="42" r="24" fill="url(#orange-g)" />
      <circle cx="40" cy="42" r="24" fill="url(#orange-shine)" />
      <circle cx="40" cy="20" r="3" fill="#92400e" opacity="0.3" />
      <path d="M42 18 Q46 14 48 16" fill="#16a34a" />
    </svg>
  );
}

export function SVGPeas() {
  return (
    <svg viewBox="0 0 80 80" width="100%" height="100%">
      <defs>
        <radialGradient id="pea-g" cx="40%" cy="35%" r="50%">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="100%" stopColor="#16a34a" />
        </radialGradient>
      </defs>
      <ellipse cx="40" cy="70" rx="20" ry="2.5" fill="#000" opacity="0.06" />
      {/* Pod */}
      <path d="M12 42 Q10 30 25 24 Q40 20 58 24 Q68 28 68 42 Q66 50 55 52 Q40 54 25 52 Q14 50 12 42Z" fill="#22c55e" />
      <path d="M14 40 Q20 28 40 25 Q58 28 64 40" fill="#4ade80" stroke="#16a34a" strokeWidth="1" />
      {/* Peas visible inside */}
      {[28, 40, 52].map((x, i) => (
        <g key={i}>
          <circle cx={x} cy="38" r="8" fill="url(#pea-g)" />
          <circle cx={x-2} cy={35} r="2.5" fill="#fff" opacity="0.3" />
        </g>
      ))}
    </svg>
  );
}

export function SVGCorn() {
  return (
    <svg viewBox="0 0 80 80" width="100%" height="100%">
      <defs>
        <linearGradient id="corn-g" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#eab308" />
        </linearGradient>
      </defs>
      <ellipse cx="40" cy="74" rx="14" ry="2.5" fill="#000" opacity="0.06" />
      {/* Husk */}
      <path d="M26 30 Q20 20 18 10" stroke="#65a30d" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M54 30 Q58 18 62 12" stroke="#4ade80" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Corn body */}
      <path d="M30 24 Q28 40 30 60 Q32 70 40 72 Q48 70 50 60 Q52 40 50 24 Q46 18 40 18 Q34 18 30 24Z" fill="url(#corn-g)" />
      {/* Kernel rows */}
      {[28, 36, 44, 52, 60].map((y, i) => (
        <g key={i}>
          {[34, 38, 42, 46].map((x, j) => (
            <circle key={j} cx={x} cy={y} r="2.5" fill="#ca8a04" opacity="0.3" />
          ))}
        </g>
      ))}
      <ellipse cx="36" cy="32" rx="4" ry="10" fill="#fff" opacity="0.1" />
    </svg>
  );
}

export function SVGWatermelon() {
  return (
    <svg viewBox="0 0 80 80" width="100%" height="100%">
      <defs>
        <linearGradient id="melon-rind" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
        <radialGradient id="melon-flesh" cx="50%" cy="60%" r="50%">
          <stop offset="0%" stopColor="#fca5a5" />
          <stop offset="80%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#dc2626" />
        </radialGradient>
      </defs>
      <ellipse cx="40" cy="70" rx="20" ry="3" fill="#000" opacity="0.06" />
      {/* Rind */}
      <path d="M12 50 Q40 80 68 50 L68 54 Q40 84 12 54Z" fill="url(#melon-rind)" />
      {/* Flesh */}
      <path d="M12 50 Q40 80 68 50 Q68 22 40 14 Q12 22 12 50Z" fill="url(#melon-flesh)" />
      {/* Seeds */}
      {[[30,40],[50,42],[36,52],[46,54],[40,34]].map(([x,y],i) => (
        <ellipse key={i} cx={x} cy={y} rx="1.5" ry="2.5" fill="#1c1917" opacity="0.7" transform={`rotate(${20+i*15} ${x} ${y})`} />
      ))}
      <path d="M20 35 Q30 28 38 30" stroke="#fff" strokeWidth="1.5" fill="none" opacity="0.15" strokeLinecap="round" />
    </svg>
  );
}

/* ── Treat Foods ── */

export function SVGCookie() {
  return (
    <svg viewBox="0 0 80 80" width="100%" height="100%">
      <defs>
        <radialGradient id="cookie-g" cx="45%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#f5d0a9" />
          <stop offset="100%" stopColor="#d97706" />
        </radialGradient>
      </defs>
      <ellipse cx="40" cy="68" rx="18" ry="3" fill="#000" opacity="0.06" />
      <circle cx="40" cy="42" r="22" fill="url(#cookie-g)" />
      {/* Chocolate chips */}
      {[[32,34],[48,38],[36,48],[50,50],[42,36],[30,44]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="#78350f" opacity="0.7" />
      ))}
    </svg>
  );
}

export function SVGCake() {
  return (
    <svg viewBox="0 0 80 80" width="100%" height="100%">
      <defs>
        <linearGradient id="cake-g" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#fecdd3" />
          <stop offset="100%" stopColor="#fda4af" />
        </linearGradient>
      </defs>
      <ellipse cx="40" cy="72" rx="18" ry="3" fill="#000" opacity="0.06" />
      {/* Cake slice */}
      <path d="M20 40 L60 40 L56 68 L24 68Z" fill="#fef3c7" />
      <path d="M20 40 L60 40 L60 48 L20 48Z" fill="url(#cake-g)" />
      <path d="M20 40 Q30 34 40 36 Q50 34 60 40" fill="#f9a8d4" />
      {/* Cherry */}
      <circle cx="40" cy="30" r="5" fill="#e11d48" />
      <circle cx="38" cy="28" r="1.5" fill="#fff" opacity="0.4" />
      <line x1="40" y1="25" x2="42" y2="20" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function SVGCandy() {
  return (
    <svg viewBox="0 0 80 80" width="100%" height="100%">
      <ellipse cx="40" cy="68" rx="16" ry="2.5" fill="#000" opacity="0.06" />
      {/* Wrapper ends */}
      <path d="M14 40 Q10 34 8 30 Q12 32 16 34" fill="#e9d5ff" stroke="#c084fc" strokeWidth="1" />
      <path d="M66 40 Q70 34 72 30 Q68 32 64 34" fill="#e9d5ff" stroke="#c084fc" strokeWidth="1" />
      {/* Body */}
      <ellipse cx="40" cy="40" rx="24" ry="14" fill="#c084fc" />
      {/* Stripes */}
      <path d="M28 30 Q32 44 28 50" stroke="#a855f7" strokeWidth="3" fill="none" opacity="0.5" />
      <path d="M40 28 Q44 42 40 52" stroke="#a855f7" strokeWidth="3" fill="none" opacity="0.5" />
      <path d="M52 30 Q56 44 52 50" stroke="#a855f7" strokeWidth="3" fill="none" opacity="0.5" />
      <ellipse cx="34" cy="34" rx="6" ry="4" fill="#fff" opacity="0.2" />
    </svg>
  );
}

export function SVGIceCream() {
  return (
    <svg viewBox="0 0 80 80" width="100%" height="100%">
      <defs>
        <linearGradient id="cone-g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f5d0a9" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <radialGradient id="scoop-g" cx="40%" cy="30%" r="55%">
          <stop offset="0%" stopColor="#fdf2f8" />
          <stop offset="60%" stopColor="#fbcfe8" />
          <stop offset="100%" stopColor="#f9a8d4" />
        </radialGradient>
      </defs>
      <ellipse cx="40" cy="74" rx="10" ry="2" fill="#000" opacity="0.06" />
      {/* Cone */}
      <path d="M28 44 L40 74 L52 44Z" fill="url(#cone-g)" />
      <line x1="30" y1="48" x2="48" y2="62" stroke="#92400e" strokeWidth="0.8" opacity="0.2" />
      <line x1="50" y1="48" x2="32" y2="62" stroke="#92400e" strokeWidth="0.8" opacity="0.2" />
      {/* Scoop */}
      <circle cx="40" cy="34" r="16" fill="url(#scoop-g)" />
      <circle cx="34" cy="28" r="4" fill="#fff" opacity="0.3" />
      {/* Drip */}
      <path d="M30 40 Q28 48 30 44" fill="#fbcfe8" />
    </svg>
  );
}

/** Map of food id to SVG component */
export const FOOD_SVGS = {
  apple: SVGApple,
  banana: SVGBanana,
  carrot: SVGCarrot,
  broccoli: SVGBroccoli,
  strawberry: SVGStrawberry,
  grapes: SVGGrapes,
  orange: SVGOrange,
  peas: SVGPeas,
  corn: SVGCorn,
  watermelon: SVGWatermelon,
  cookie: SVGCookie,
  cake: SVGCake,
  candy: SVGCandy,
  icecream: SVGIceCream,
};
