/**
 * Three Little Pigs — 10 illustrated SVG storybook scenes.
 * Warm, cute style inspired by Julia Donaldson / Axel Scheffler.
 * Each scene is a full-page background with characters.
 */

/* ───────────────────────────────────────────
   SCENE 1 — Three pigs set off on an adventure
   ─────────────────────────────────────────── */
export function PigScene1({ className = '' }) {
  return (
    <svg viewBox="0 0 800 600" className={`absolute inset-0 w-full h-full ${className}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="ps1-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4aa3df" />
          <stop offset="60%" stopColor="#87ceeb" />
          <stop offset="100%" stopColor="#b8e4f0" />
        </linearGradient>
        <linearGradient id="ps1-hill1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4da64d" />
          <stop offset="100%" stopColor="#3d8a40" />
        </linearGradient>
        <linearGradient id="ps1-hill2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5cb85c" />
          <stop offset="100%" stopColor="#4da64d" />
        </linearGradient>
        <linearGradient id="ps1-hill3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6ecf6e" />
          <stop offset="100%" stopColor="#5cb85c" />
        </linearGradient>
        <linearGradient id="ps1-path" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d4a843" />
          <stop offset="100%" stopColor="#b8923a" />
        </linearGradient>
        <radialGradient id="ps1-sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#fff7a0" />
          <stop offset="50%" stopColor="#ffe44d" />
          <stop offset="100%" stopColor="#ffc800" />
        </radialGradient>
        <linearGradient id="ps1-pigBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fcc4cc" />
          <stop offset="100%" stopColor="#f8b4be" />
        </linearGradient>
        <radialGradient id="ps1-cheek" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ff9999" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ff9999" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect width="800" height="600" fill="url(#ps1-sky)" />

      {/* Sun */}
      <circle cx="680" cy="80" r="55" fill="url(#ps1-sun)" />
      <g stroke="#ffe44d" strokeWidth="3" strokeLinecap="round" opacity="0.7">
        <line x1="680" y1="10" x2="680" y2="0" />
        <line x1="730" y1="30" x2="740" y2="20" />
        <line x1="750" y1="80" x2="760" y2="80" />
        <line x1="730" y1="130" x2="740" y2="140" />
        <line x1="680" y1="150" x2="680" y2="160" />
        <line x1="630" y1="130" x2="620" y2="140" />
        <line x1="610" y1="80" x2="600" y2="80" />
        <line x1="630" y1="30" x2="620" y2="20" />
      </g>

      {/* Clouds */}
      <g opacity="0.9">
        <ellipse cx="150" cy="80" rx="60" ry="25" fill="white" />
        <ellipse cx="120" cy="75" rx="40" ry="20" fill="white" />
        <ellipse cx="180" cy="75" rx="35" ry="18" fill="white" />
        <ellipse cx="150" cy="70" rx="30" ry="18" fill="#f0f8ff" />
      </g>
      <g opacity="0.8">
        <ellipse cx="420" cy="55" rx="50" ry="20" fill="white" />
        <ellipse cx="395" cy="50" rx="35" ry="18" fill="white" />
        <ellipse cx="445" cy="50" rx="30" ry="16" fill="white" />
      </g>
      <g opacity="0.7">
        <ellipse cx="580" cy="120" rx="40" ry="16" fill="white" />
        <ellipse cx="560" cy="116" rx="28" ry="14" fill="white" />
        <ellipse cx="600" cy="116" rx="24" ry="12" fill="white" />
      </g>

      {/* Far hills */}
      <path d="M0 350 Q200 250 400 320 Q600 250 800 340 L800 600 L0 600Z" fill="url(#ps1-hill1)" />
      {/* Mid hills */}
      <path d="M0 400 Q150 340 300 380 Q500 330 650 370 Q750 350 800 380 L800 600 L0 600Z" fill="url(#ps1-hill2)" />
      {/* Near hill */}
      <path d="M0 440 Q200 390 400 430 Q600 400 800 440 L800 600 L0 600Z" fill="url(#ps1-hill3)" />

      {/* Winding path */}
      <path d="M350 600 Q340 560 360 520 Q390 480 370 450 Q350 420 380 390 Q420 350 400 320" fill="none" stroke="url(#ps1-path)" strokeWidth="40" strokeLinecap="round" opacity="0.7" />
      <path d="M350 600 Q340 560 360 520 Q390 480 370 450 Q350 420 380 390 Q420 350 400 320" fill="none" stroke="#d4a843" strokeWidth="36" strokeLinecap="round" opacity="0.3" />

      {/* Grass tufts on near hill */}
      {[80, 160, 250, 500, 600, 700, 750].map((x, i) => (
        <g key={i} transform={`translate(${x}, ${450 + Math.sin(i) * 10})`}>
          <path d="M0 0 Q-3 -12 -1 -18 M0 0 Q1 -14 3 -20 M0 0 Q4 -10 7 -16" fill="none" stroke="#3d8a40" strokeWidth="2" strokeLinecap="round" />
        </g>
      ))}

      {/* Wildflowers */}
      {[
        [60, 470, '#ff6b8a'], [140, 460, '#ffd700'], [220, 475, '#ff6b8a'],
        [520, 455, '#9b59b6'], [620, 468, '#ffd700'], [710, 462, '#ff6b8a'],
        [300, 480, '#ffd700'], [450, 445, '#9b59b6'],
      ].map(([x, y, c], i) => (
        <g key={i} transform={`translate(${x}, ${y})`}>
          <line x1="0" y1="0" x2="0" y2="12" stroke="#3d8a40" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="3.5" fill={c} />
          <circle cx="0" cy="0" r="1.5" fill="#fff4a0" />
        </g>
      ))}

      {/* Butterfly 1 */}
      <g transform="translate(200, 360)">
        <path d="M0 0 Q-8 -10 -5 -16 Q-2 -20 0 -14 Q2 -20 5 -16 Q8 -10 0 0Z" fill="#ff6b8a" opacity="0.8">
          <animateTransform attributeName="transform" type="rotate" values="-10 0 -8;10 0 -8;-10 0 -8" dur="1.2s" repeatCount="indefinite" />
        </path>
        <line x1="0" y1="-4" x2="-2" y2="-18" stroke="#333" strokeWidth="0.5" />
        <line x1="0" y1="-4" x2="2" y2="-18" stroke="#333" strokeWidth="0.5" />
      </g>

      {/* Butterfly 2 */}
      <g transform="translate(550, 380)">
        <path d="M0 0 Q-7 -9 -4 -14 Q-1 -17 0 -12 Q1 -17 4 -14 Q7 -9 0 0Z" fill="#9b59b6" opacity="0.8">
          <animateTransform attributeName="transform" type="rotate" values="10 0 -7;-10 0 -7;10 0 -7" dur="1.5s" repeatCount="indefinite" />
        </path>
      </g>

      {/* Ladybird on grass */}
      <g transform="translate(490, 448)">
        <ellipse cx="0" cy="0" rx="4" ry="3" fill="#e74c3c" />
        <line x1="0" y1="-3" x2="0" y2="3" stroke="#333" strokeWidth="0.8" />
        <circle cx="-1.5" cy="-0.5" r="0.8" fill="#333" />
        <circle cx="1.5" cy="1" r="0.8" fill="#333" />
        <circle cx="0" cy="-3" r="1.5" fill="#333" />
      </g>

      {/* ── PIG 1 (front, slightly right) ── */}
      <g transform="translate(420, 415)">
        {/* Bundle on stick */}
        <line x1="-20" y1="-45" x2="8" y2="-70" stroke="#8b5e3c" strokeWidth="3" strokeLinecap="round" />
        <path d="M2 -68 Q10 -82 18 -72 Q22 -62 12 -60 Q2 -58 2 -68Z" fill="#e74c3c" />
        {/* Body */}
        <ellipse cx="0" cy="-10" rx="22" ry="20" fill="url(#ps1-pigBody)" stroke="#e8a0a8" strokeWidth="1.5" />
        {/* Belly highlight */}
        <ellipse cx="-2" cy="-6" rx="12" ry="10" fill="#fcc4cc" opacity="0.5" />
        {/* Legs */}
        <rect x="-14" y="6" width="7" height="14" rx="3" fill="#f8b4be" stroke="#e8a0a8" strokeWidth="1" />
        <rect x="7" y="6" width="7" height="14" rx="3" fill="#f8b4be" stroke="#e8a0a8" strokeWidth="1" />
        {/* Trotters */}
        <ellipse cx="-10.5" cy="21" rx="5" ry="3" fill="#e8a0a8" />
        <ellipse cx="10.5" cy="21" rx="5" ry="3" fill="#e8a0a8" />
        {/* Head */}
        <ellipse cx="0" cy="-32" rx="16" ry="14" fill="#f8b4be" stroke="#e8a0a8" strokeWidth="1.5" />
        {/* Ears */}
        <path d="M-10 -44 Q-14 -56 -6 -50" fill="#fcc4cc" stroke="#e8a0a8" strokeWidth="1" />
        <path d="M10 -44 Q14 -56 6 -50" fill="#fcc4cc" stroke="#e8a0a8" strokeWidth="1" />
        <path d="M-9 -46 Q-11 -52 -7 -49" fill="#f2949e" opacity="0.5" />
        <path d="M9 -46 Q11 -52 7 -49" fill="#f2949e" opacity="0.5" />
        {/* Eyes */}
        <ellipse cx="-6" cy="-35" rx="4" ry="4.5" fill="white" />
        <ellipse cx="6" cy="-35" rx="4" ry="4.5" fill="white" />
        <circle cx="-5" cy="-34" r="2.5" fill="#2c1810" />
        <circle cx="7" cy="-34" r="2.5" fill="#2c1810" />
        <circle cx="-4.5" cy="-35.5" r="1" fill="white" />
        <circle cx="7.5" cy="-35.5" r="1" fill="white" />
        {/* Snout */}
        <ellipse cx="0" cy="-27" rx="8" ry="5.5" fill="#fcc4cc" stroke="#e8a0a8" strokeWidth="1" />
        <circle cx="-2.5" cy="-27" r="1.5" fill="#e8a0a8" />
        <circle cx="2.5" cy="-27" r="1.5" fill="#e8a0a8" />
        {/* Mouth */}
        <path d="M-3 -23 Q0 -21 3 -23" fill="none" stroke="#e8a0a8" strokeWidth="0.8" />
        {/* Cheeks */}
        <circle cx="-12" cy="-30" r="4" fill="url(#ps1-cheek)" />
        <circle cx="12" cy="-30" r="4" fill="url(#ps1-cheek)" />
        {/* Curly tail */}
        <path d="M18 -8 Q28 -12 26 -4 Q24 4 30 0" fill="none" stroke="#f8b4be" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* ── PIG 2 (middle, centre) ── */}
      <g transform="translate(340, 405)">
        {/* Bundle on stick */}
        <line x1="-18" y1="-42" x2="10" y2="-68" stroke="#8b5e3c" strokeWidth="3" strokeLinecap="round" />
        <path d="M4 -66 Q12 -80 20 -70 Q24 -60 14 -58 Q4 -56 4 -66Z" fill="#3498db" />
        {/* Body */}
        <ellipse cx="0" cy="-8" rx="20" ry="18" fill="url(#ps1-pigBody)" stroke="#e8a0a8" strokeWidth="1.5" />
        <ellipse cx="-2" cy="-4" rx="11" ry="9" fill="#fcc4cc" opacity="0.5" />
        {/* Legs */}
        <rect x="-12" y="6" width="6.5" height="13" rx="3" fill="#f8b4be" stroke="#e8a0a8" strokeWidth="1" />
        <rect x="6" y="6" width="6.5" height="13" rx="3" fill="#f8b4be" stroke="#e8a0a8" strokeWidth="1" />
        <ellipse cx="-8.5" cy="20" rx="4.5" ry="2.8" fill="#e8a0a8" />
        <ellipse cx="9.5" cy="20" rx="4.5" ry="2.8" fill="#e8a0a8" />
        {/* Head */}
        <ellipse cx="0" cy="-28" rx="14.5" ry="13" fill="#f8b4be" stroke="#e8a0a8" strokeWidth="1.5" />
        {/* Ears */}
        <path d="M-9 -39 Q-13 -51 -5 -45" fill="#fcc4cc" stroke="#e8a0a8" strokeWidth="1" />
        <path d="M9 -39 Q13 -51 5 -45" fill="#fcc4cc" stroke="#e8a0a8" strokeWidth="1" />
        {/* Eyes */}
        <ellipse cx="-5" cy="-31" rx="3.5" ry="4" fill="white" />
        <ellipse cx="5" cy="-31" rx="3.5" ry="4" fill="white" />
        <circle cx="-4" cy="-30" r="2.2" fill="#2c1810" />
        <circle cx="6" cy="-30" r="2.2" fill="#2c1810" />
        <circle cx="-3.5" cy="-31.5" r="0.9" fill="white" />
        <circle cx="6.5" cy="-31.5" r="0.9" fill="white" />
        {/* Snout */}
        <ellipse cx="0" cy="-23" rx="7" ry="5" fill="#fcc4cc" stroke="#e8a0a8" strokeWidth="1" />
        <circle cx="-2" cy="-23" r="1.3" fill="#e8a0a8" />
        <circle cx="2" cy="-23" r="1.3" fill="#e8a0a8" />
        <path d="M-2.5 -19.5 Q0 -17.5 2.5 -19.5" fill="none" stroke="#e8a0a8" strokeWidth="0.8" />
        {/* Cheeks */}
        <circle cx="-11" cy="-26" r="3.5" fill="url(#ps1-cheek)" />
        <circle cx="11" cy="-26" r="3.5" fill="url(#ps1-cheek)" />
        {/* Curly tail */}
        <path d="M16 -6 Q26 -10 24 -2 Q22 6 28 2" fill="none" stroke="#f8b4be" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* ── PIG 3 (back, slightly left) ── */}
      <g transform="translate(270, 395)">
        {/* Bundle on stick */}
        <line x1="-16" y1="-40" x2="8" y2="-64" stroke="#8b5e3c" strokeWidth="3" strokeLinecap="round" />
        <path d="M2 -62 Q10 -76 18 -66 Q22 -56 12 -54 Q2 -52 2 -62Z" fill="#2ecc71" />
        {/* Body */}
        <ellipse cx="0" cy="-6" rx="18" ry="16" fill="url(#ps1-pigBody)" stroke="#e8a0a8" strokeWidth="1.5" />
        <ellipse cx="-2" cy="-3" rx="10" ry="8" fill="#fcc4cc" opacity="0.5" />
        {/* Legs */}
        <rect x="-10" y="6" width="6" height="12" rx="3" fill="#f8b4be" stroke="#e8a0a8" strokeWidth="1" />
        <rect x="5" y="6" width="6" height="12" rx="3" fill="#f8b4be" stroke="#e8a0a8" strokeWidth="1" />
        <ellipse cx="-7" cy="19" rx="4" ry="2.5" fill="#e8a0a8" />
        <ellipse cx="8" cy="19" rx="4" ry="2.5" fill="#e8a0a8" />
        {/* Head */}
        <ellipse cx="0" cy="-24" rx="13" ry="12" fill="#f8b4be" stroke="#e8a0a8" strokeWidth="1.5" />
        {/* Ears */}
        <path d="M-8 -34 Q-12 -46 -4 -40" fill="#fcc4cc" stroke="#e8a0a8" strokeWidth="1" />
        <path d="M8 -34 Q12 -46 4 -40" fill="#fcc4cc" stroke="#e8a0a8" strokeWidth="1" />
        {/* Eyes */}
        <ellipse cx="-4.5" cy="-27" rx="3.2" ry="3.8" fill="white" />
        <ellipse cx="4.5" cy="-27" rx="3.2" ry="3.8" fill="white" />
        <circle cx="-3.5" cy="-26" r="2" fill="#2c1810" />
        <circle cx="5.5" cy="-26" r="2" fill="#2c1810" />
        <circle cx="-3" cy="-27.5" r="0.8" fill="white" />
        <circle cx="6" cy="-27.5" r="0.8" fill="white" />
        {/* Snout */}
        <ellipse cx="0" cy="-20" rx="6.5" ry="4.5" fill="#fcc4cc" stroke="#e8a0a8" strokeWidth="1" />
        <circle cx="-2" cy="-20" r="1.2" fill="#e8a0a8" />
        <circle cx="2" cy="-20" r="1.2" fill="#e8a0a8" />
        <path d="M-2 -16.5 Q0 -14.5 2 -16.5" fill="none" stroke="#e8a0a8" strokeWidth="0.8" />
        {/* Cheeks */}
        <circle cx="-10" cy="-23" r="3" fill="url(#ps1-cheek)" />
        <circle cx="10" cy="-23" r="3" fill="url(#ps1-cheek)" />
        {/* Curly tail */}
        <path d="M14 -4 Q24 -8 22 0 Q20 8 26 4" fill="none" stroke="#f8b4be" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Foreground grass */}
      <path d="M0 580 Q100 560 200 575 Q300 555 400 570 Q500 555 600 568 Q700 558 800 575 L800 600 L0 600Z" fill="#3d8a40" />
    </svg>
  );
}

/* ───────────────────────────────────────────
   SCENE 2 — The first pig builds a straw house
   ─────────────────────────────────────────── */
export function PigScene2({ className = '' }) {
  return (
    <svg viewBox="0 0 800 600" className={`absolute inset-0 w-full h-full ${className}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="ps2-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4aa3df" />
          <stop offset="70%" stopColor="#87ceeb" />
          <stop offset="100%" stopColor="#c4e8f5" />
        </linearGradient>
        <linearGradient id="ps2-grass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5cb85c" />
          <stop offset="100%" stopColor="#4da64d" />
        </linearGradient>
        <linearGradient id="ps2-straw" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8c252" />
          <stop offset="100%" stopColor="#d4a843" />
        </linearGradient>
        <linearGradient id="ps2-pigBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fcc4cc" />
          <stop offset="100%" stopColor="#f8b4be" />
        </linearGradient>
        <radialGradient id="ps2-cheek" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ff9999" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ff9999" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect width="800" height="600" fill="url(#ps2-sky)" />

      {/* Sun */}
      <circle cx="650" cy="90" r="50" fill="#ffe44d" />
      <g stroke="#ffe44d" strokeWidth="3" opacity="0.5">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
          <line key={i} x1={650 + Math.cos(a * Math.PI / 180) * 58} y1={90 + Math.sin(a * Math.PI / 180) * 58} x2={650 + Math.cos(a * Math.PI / 180) * 72} y2={90 + Math.sin(a * Math.PI / 180) * 72} />
        ))}
      </g>

      {/* Clouds */}
      <g opacity="0.85">
        <ellipse cx="180" cy="70" rx="55" ry="22" fill="white" />
        <ellipse cx="150" cy="65" rx="35" ry="18" fill="white" />
        <ellipse cx="210" cy="65" rx="30" ry="15" fill="white" />
      </g>
      <g opacity="0.7">
        <ellipse cx="500" cy="100" rx="45" ry="18" fill="white" />
        <ellipse cx="475" cy="96" rx="30" ry="14" fill="white" />
      </g>

      {/* Far hill */}
      <path d="M0 380 Q200 310 400 360 Q600 310 800 370 L800 600 L0 600Z" fill="#4da64d" />
      {/* Near ground */}
      <path d="M0 430 Q200 400 400 420 Q600 400 800 430 L800 600 L0 600Z" fill="url(#ps2-grass)" />

      {/* ── STRAW HOUSE ── */}
      <g transform="translate(460, 310)">
        {/* House base — straw bundles */}
        <rect x="-60" y="0" width="120" height="100" rx="4" fill="url(#ps2-straw)" stroke="#b8923a" strokeWidth="1.5" />
        {/* Straw texture lines */}
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1={-55 + i * 10} y1="5" x2={-55 + i * 10 + (i % 2 ? 3 : -3)} y2="95" stroke="#b8923a" strokeWidth="0.8" opacity="0.5" />
        ))}
        {/* Horizontal straw bands */}
        <line x1="-60" y1="25" x2="60" y2="25" stroke="#b8923a" strokeWidth="1" opacity="0.4" />
        <line x1="-60" y1="50" x2="60" y2="50" stroke="#b8923a" strokeWidth="1" opacity="0.4" />
        <line x1="-60" y1="75" x2="60" y2="75" stroke="#b8923a" strokeWidth="1" opacity="0.4" />
        {/* Wonky roof — thatch */}
        <path d="M-80 5 L0 -55 L80 5 Z" fill="#d4a843" stroke="#b8923a" strokeWidth="1.5" />
        <path d="M-75 3 L0 -48 L75 3 Z" fill="#e8c252" opacity="0.5" />
        {/* Thatch detail lines */}
        {Array.from({ length: 8 }, (_, i) => {
          const x = -60 + i * 18;
          return <line key={i} x1={x} y1={5 - (i < 4 ? i * 6 : (8 - i) * 6)} x2={x + 2} y2={5 - (i < 4 ? i * 6 : (8 - i) * 6) - 10} stroke="#b8923a" strokeWidth="1" opacity="0.5" />;
        })}
        {/* Door */}
        <rect x="-12" y="55" width="24" height="45" rx="10" fill="#8b5e3c" stroke="#6b4830" strokeWidth="1.5" />
        <circle cx="8" cy="78" r="2" fill="#d4a843" />
        {/* Window */}
        <rect x="25" y="20" width="20" height="18" rx="2" fill="#87ceeb" stroke="#b8923a" strokeWidth="1.5" />
        <line x1="35" y1="20" x2="35" y2="38" stroke="#b8923a" strokeWidth="1" />
        <line x1="25" y1="29" x2="45" y2="29" stroke="#b8923a" strokeWidth="1" />
        {/* Loose straw pieces around */}
        <path d="M-70 100 L-80 90 L-72 95" fill="none" stroke="#d4a843" strokeWidth="2" strokeLinecap="round" />
        <path d="M70 95 L82 85 L78 92" fill="none" stroke="#d4a843" strokeWidth="2" strokeLinecap="round" />
        <path d="M-50 105 L-62 102" fill="none" stroke="#d4a843" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M55 108 L68 100" fill="none" stroke="#d4a843" strokeWidth="1.5" strokeLinecap="round" />
        {/* Straw wisps on ground */}
        {[-90, -65, 70, 85, 95].map((sx, i) => (
          <path key={i} d={`M${sx} ${100 + i * 2} Q${sx + 5} ${95 + i * 2} ${sx + 12} ${98 + i * 2}`} fill="none" stroke="#d4a843" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        ))}
      </g>

      {/* ── PIG 1 (standing proudly next to house) ── */}
      <g transform="translate(320, 388)">
        {/* Body */}
        <ellipse cx="0" cy="-8" rx="24" ry="22" fill="url(#ps2-pigBody)" stroke="#e8a0a8" strokeWidth="1.5" />
        <ellipse cx="-2" cy="-4" rx="14" ry="12" fill="#fcc4cc" opacity="0.5" />
        {/* Arms raised proudly */}
        <path d="M-18 -16 Q-30 -30 -25 -38" fill="none" stroke="#f8b4be" strokeWidth="7" strokeLinecap="round" />
        <ellipse cx="-25" cy="-40" rx="5" ry="4" fill="#e8a0a8" />
        <path d="M18 -16 Q30 -30 25 -38" fill="none" stroke="#f8b4be" strokeWidth="7" strokeLinecap="round" />
        <ellipse cx="25" cy="-40" rx="5" ry="4" fill="#e8a0a8" />
        {/* Legs */}
        <rect x="-14" y="10" width="8" height="16" rx="4" fill="#f8b4be" stroke="#e8a0a8" strokeWidth="1" />
        <rect x="6" y="10" width="8" height="16" rx="4" fill="#f8b4be" stroke="#e8a0a8" strokeWidth="1" />
        <ellipse cx="-10" cy="27" rx="6" ry="3" fill="#e8a0a8" />
        <ellipse cx="10" cy="27" rx="6" ry="3" fill="#e8a0a8" />
        {/* Head */}
        <ellipse cx="0" cy="-34" rx="18" ry="16" fill="#f8b4be" stroke="#e8a0a8" strokeWidth="1.5" />
        {/* Ears */}
        <path d="M-12 -48 Q-16 -62 -6 -54" fill="#fcc4cc" stroke="#e8a0a8" strokeWidth="1" />
        <path d="M12 -48 Q16 -62 6 -54" fill="#fcc4cc" stroke="#e8a0a8" strokeWidth="1" />
        <path d="M-11 -50 Q-13 -56 -7 -53" fill="#f2949e" opacity="0.5" />
        <path d="M11 -50 Q13 -56 7 -53" fill="#f2949e" opacity="0.5" />
        {/* Eyes — happy/proud squint */}
        <ellipse cx="-6" cy="-37" rx="4.5" ry="5" fill="white" />
        <ellipse cx="6" cy="-37" rx="4.5" ry="5" fill="white" />
        <circle cx="-5" cy="-36" r="2.8" fill="#2c1810" />
        <circle cx="7" cy="-36" r="2.8" fill="#2c1810" />
        <circle cx="-4" cy="-37.5" r="1.1" fill="white" />
        <circle cx="8" cy="-37.5" r="1.1" fill="white" />
        {/* Snout */}
        <ellipse cx="0" cy="-28" rx="9" ry="6" fill="#fcc4cc" stroke="#e8a0a8" strokeWidth="1" />
        <circle cx="-3" cy="-28" r="1.5" fill="#e8a0a8" />
        <circle cx="3" cy="-28" r="1.5" fill="#e8a0a8" />
        {/* Big happy smile */}
        <path d="M-5 -23 Q0 -19 5 -23" fill="none" stroke="#e8a0a8" strokeWidth="1" />
        {/* Cheeks */}
        <circle cx="-14" cy="-32" r="4.5" fill="url(#ps2-cheek)" />
        <circle cx="14" cy="-32" r="4.5" fill="url(#ps2-cheek)" />
        {/* Curly tail */}
        <path d="M20 -6 Q32 -10 30 -2 Q28 6 34 2" fill="none" stroke="#f8b4be" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* Scattered straw pieces on ground */}
      {[180, 240, 280, 560, 600, 640].map((x, i) => (
        <path key={i} d={`M${x} ${440 + i * 3} L${x + 15} ${435 + i * 3}`} stroke="#d4a843" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      ))}

      {/* Wildflowers */}
      {[[100, 455, '#ff6b8a'], [200, 448, '#ffd700'], [650, 442, '#9b59b6'], [720, 450, '#ff6b8a']].map(([x, y, c], i) => (
        <g key={i} transform={`translate(${x}, ${y})`}>
          <line x1="0" y1="0" x2="0" y2="12" stroke="#3d8a40" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="3.5" fill={c} />
          <circle cx="0" cy="0" r="1.5" fill="#fff4a0" />
        </g>
      ))}

      {/* Foreground grass */}
      <path d="M0 580 Q200 565 400 575 Q600 560 800 580 L800 600 L0 600Z" fill="#3d8a40" />
    </svg>
  );
}

/* ───────────────────────────────────────────
   SCENE 3 — The second pig builds a stick house
   ─────────────────────────────────────────── */
export function PigScene3({ className = '' }) {
  return (
    <svg viewBox="0 0 800 600" className={`absolute inset-0 w-full h-full ${className}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="ps3-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5bafde" />
          <stop offset="100%" stopColor="#a8dce8" />
        </linearGradient>
        <linearGradient id="ps3-pigBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fcc4cc" />
          <stop offset="100%" stopColor="#f8b4be" />
        </linearGradient>
        <radialGradient id="ps3-cheek" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ff9999" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ff9999" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ps3-wood" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a07828" />
          <stop offset="50%" stopColor="#8b6914" />
          <stop offset="100%" stopColor="#7a5c10" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="800" height="600" fill="url(#ps3-sky)" />

      {/* Clouds */}
      <g opacity="0.8">
        <ellipse cx="600" cy="65" rx="50" ry="20" fill="white" />
        <ellipse cx="575" cy="60" rx="33" ry="16" fill="white" />
        <ellipse cx="630" cy="60" rx="28" ry="14" fill="white" />
      </g>

      {/* Background trees */}
      {[60, 150, 680, 750].map((tx, i) => (
        <g key={i} transform={`translate(${tx}, 300)`}>
          <rect x="-6" y="0" width="12" height="70" rx="3" fill="#6b4830" />
          <ellipse cx="0" cy="-15" rx="35" ry="45" fill={i % 2 === 0 ? '#3d8a40' : '#4da64d'} />
          <ellipse cx="-8" cy="-20" rx="18" ry="28" fill={i % 2 === 0 ? '#4da64d' : '#5cb85c'} opacity="0.6" />
        </g>
      ))}

      {/* Far hill */}
      <path d="M0 370 Q200 320 400 355 Q600 320 800 365 L800 600 L0 600Z" fill="#4da64d" />
      {/* Near ground */}
      <path d="M0 420 Q200 395 400 415 Q600 395 800 420 L800 600 L0 600Z" fill="#5cb85c" />

      {/* ── STICK HOUSE ── */}
      <g transform="translate(470, 290)">
        {/* House walls — log construction */}
        <rect x="-55" y="5" width="110" height="90" rx="2" fill="#8b6914" stroke="#6b4830" strokeWidth="1.5" />
        {/* Horizontal log lines */}
        {Array.from({ length: 6 }, (_, i) => (
          <g key={i}>
            <line x1="-55" y1={18 + i * 14} x2="55" y2={18 + i * 14} stroke="#6b4830" strokeWidth="1" opacity="0.6" />
            <line x1="-55" y1={14 + i * 14} x2="55" y2={14 + i * 14} stroke="#a07828" strokeWidth="0.5" opacity="0.3" />
          </g>
        ))}
        {/* Cross-beams / visible structure */}
        <line x1="-55" y1="5" x2="-55" y2="95" stroke="#6b4830" strokeWidth="3" />
        <line x1="55" y1="5" x2="55" y2="95" stroke="#6b4830" strokeWidth="3" />
        <line x1="0" y1="5" x2="0" y2="30" stroke="#6b4830" strokeWidth="2" />
        {/* Roof — stick frame with cross-beams */}
        <path d="M-70 8 L0 -45 L70 8 Z" fill="#a07828" stroke="#6b4830" strokeWidth="2" />
        <path d="M-65 6 L0 -40 L65 6 Z" fill="#8b6914" opacity="0.6" />
        {/* Roof cross sticks */}
        <line x1="-35" y1="-18" x2="35" y2="-18" stroke="#6b4830" strokeWidth="1.5" />
        <line x1="-50" y1="-5" x2="50" y2="-5" stroke="#6b4830" strokeWidth="1.5" />
        {/* Door */}
        <rect x="-10" y="52" width="20" height="43" rx="8" fill="#6b4830" stroke="#5a3e10" strokeWidth="1.5" />
        <circle cx="6" cy="74" r="2" fill="#d4a843" />
        {/* Window */}
        <rect x="22" y="25" width="22" height="20" rx="2" fill="#87ceeb" stroke="#6b4830" strokeWidth="1.5" />
        <line x1="33" y1="25" x2="33" y2="45" stroke="#6b4830" strokeWidth="1" />
        <line x1="22" y1="35" x2="44" y2="35" stroke="#6b4830" strokeWidth="1" />

        {/* Bird on roof */}
        <g transform="translate(20, -38)">
          <ellipse cx="0" cy="0" rx="6" ry="5" fill="#e67e22" />
          <circle cx="4" cy="-3" r="3.5" fill="#e67e22" />
          <circle cx="5.5" cy="-4" r="1.2" fill="white" />
          <circle cx="6" cy="-3.8" r="0.6" fill="#2c1810" />
          <path d="M7.5 -3 L10 -3.5 L7.5 -2" fill="#d4a843" />
          <path d="M-4 3 L-3 6 M2 4 L3 7" stroke="#6b4830" strokeWidth="1" strokeLinecap="round" />
          {/* Wing */}
          <path d="M-2 -1 Q-8 -5 -5 2" fill="#c0702e" />
        </g>

        {/* Wood chips and sawdust */}
        {[[-75, 98], [-68, 102], [-80, 95], [65, 100], [72, 96], [78, 103], [-60, 105], [60, 108]].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width={3 + i % 3} height={1.5} rx="0.5" fill="#d4a843" opacity="0.6" transform={`rotate(${i * 30} ${x} ${y})`} />
        ))}
      </g>

      {/* ── PIG 2 (hammering sticks) ── */}
      <g transform="translate(310, 385)">
        {/* Body */}
        <ellipse cx="0" cy="-8" rx="22" ry="20" fill="url(#ps3-pigBody)" stroke="#e8a0a8" strokeWidth="1.5" />
        <ellipse cx="-2" cy="-4" rx="12" ry="10" fill="#fcc4cc" opacity="0.5" />
        {/* Arm with hammer */}
        <path d="M16 -18 Q28 -28 32 -36" fill="none" stroke="#f8b4be" strokeWidth="7" strokeLinecap="round" />
        <ellipse cx="32" cy="-38" rx="4.5" ry="3.5" fill="#e8a0a8" />
        {/* Hammer */}
        <line x1="32" y1="-38" x2="40" y2="-52" stroke="#8b5e3c" strokeWidth="3" strokeLinecap="round" />
        <rect x="34" y="-60" width="14" height="10" rx="2" fill="#888" stroke="#666" strokeWidth="1" />
        {/* Other arm */}
        <path d="M-16 -14 Q-24 -8 -28 0" fill="none" stroke="#f8b4be" strokeWidth="7" strokeLinecap="round" />
        <ellipse cx="-28" cy="2" rx="4.5" ry="3.5" fill="#e8a0a8" />
        {/* Legs */}
        <rect x="-12" y="8" width="7" height="15" rx="3.5" fill="#f8b4be" stroke="#e8a0a8" strokeWidth="1" />
        <rect x="5" y="8" width="7" height="15" rx="3.5" fill="#f8b4be" stroke="#e8a0a8" strokeWidth="1" />
        <ellipse cx="-8.5" cy="24" rx="5" ry="3" fill="#e8a0a8" />
        <ellipse cx="8.5" cy="24" rx="5" ry="3" fill="#e8a0a8" />
        {/* Head */}
        <ellipse cx="0" cy="-32" rx="17" ry="15" fill="#f8b4be" stroke="#e8a0a8" strokeWidth="1.5" />
        {/* Ears */}
        <path d="M-11 -45 Q-15 -58 -5 -51" fill="#fcc4cc" stroke="#e8a0a8" strokeWidth="1" />
        <path d="M11 -45 Q15 -58 5 -51" fill="#fcc4cc" stroke="#e8a0a8" strokeWidth="1" />
        <path d="M-10 -47 Q-12 -53 -6 -50" fill="#f2949e" opacity="0.5" />
        <path d="M10 -47 Q12 -53 6 -50" fill="#f2949e" opacity="0.5" />
        {/* Eyes — focused look */}
        <ellipse cx="-6" cy="-35" rx="4" ry="4.5" fill="white" />
        <ellipse cx="6" cy="-35" rx="4" ry="4.5" fill="white" />
        <circle cx="-4.5" cy="-34" r="2.5" fill="#2c1810" />
        <circle cx="7.5" cy="-34" r="2.5" fill="#2c1810" />
        <circle cx="-4" cy="-35.5" r="1" fill="white" />
        <circle cx="8" cy="-35.5" r="1" fill="white" />
        {/* Snout */}
        <ellipse cx="0" cy="-26" rx="8.5" ry="5.5" fill="#fcc4cc" stroke="#e8a0a8" strokeWidth="1" />
        <circle cx="-2.5" cy="-26" r="1.5" fill="#e8a0a8" />
        <circle cx="2.5" cy="-26" r="1.5" fill="#e8a0a8" />
        {/* Mouth — concentrating */}
        <path d="M-3 -22 Q0 -20 3 -22" fill="none" stroke="#e8a0a8" strokeWidth="0.8" />
        {/* Cheeks */}
        <circle cx="-13" cy="-30" r="4" fill="url(#ps3-cheek)" />
        <circle cx="13" cy="-30" r="4" fill="url(#ps3-cheek)" />
        {/* Curly tail */}
        <path d="M-18 -6 Q-28 -10 -26 -2 Q-24 6 -30 2" fill="none" stroke="#f8b4be" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* Ferns and grass at forest edge */}
      {[30, 90, 120, 710, 760].map((x, i) => (
        <g key={i} transform={`translate(${x}, ${430 + Math.sin(i) * 5})`}>
          <path d={`M0 0 Q${-5 - i} ${-15 - i * 2} ${-8 - i} ${-25 - i * 2}`} fill="none" stroke="#3d8a40" strokeWidth="2" strokeLinecap="round" />
          <path d={`M0 0 Q${3 + i} ${-12 - i * 2} ${5 + i} ${-22 - i * 2}`} fill="none" stroke="#4da64d" strokeWidth="2" strokeLinecap="round" />
        </g>
      ))}

      {/* Foreground grass */}
      <path d="M0 580 Q200 565 400 575 Q600 562 800 578 L800 600 L0 600Z" fill="#3d8a40" />
    </svg>
  );
}

/* ───────────────────────────────────────────
   SCENE 4 — The third pig builds a brick house
   ─────────────────────────────────────────── */
export function PigScene4({ className = '' }) {
  return (
    <svg viewBox="0 0 800 600" className={`absolute inset-0 w-full h-full ${className}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="ps4-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4aa3df" />
          <stop offset="100%" stopColor="#87ceeb" />
        </linearGradient>
        <linearGradient id="ps4-pigBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fcc4cc" />
          <stop offset="100%" stopColor="#f8b4be" />
        </linearGradient>
        <radialGradient id="ps4-cheek" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ff9999" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ff9999" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect width="800" height="600" fill="url(#ps4-sky)" />

      {/* Clouds */}
      <g opacity="0.85">
        <ellipse cx="200" cy="80" rx="55" ry="22" fill="white" />
        <ellipse cx="170" cy="75" rx="35" ry="17" fill="white" />
        <ellipse cx="230" cy="74" rx="30" ry="15" fill="white" />
      </g>
      <g opacity="0.7">
        <ellipse cx="550" cy="60" rx="40" ry="16" fill="white" />
        <ellipse cx="530" cy="56" rx="25" ry="13" fill="white" />
      </g>

      {/* Sun */}
      <circle cx="700" cy="80" r="48" fill="#ffe44d" />

      {/* Far hill */}
      <path d="M0 370 Q200 320 400 350 Q600 310 800 360 L800 600 L0 600Z" fill="#4da64d" />
      {/* Near ground */}
      <path d="M0 420 Q200 395 400 415 Q600 390 800 415 L800 600 L0 600Z" fill="#5cb85c" />

      {/* ── BRICK HOUSE ── */}
      <g transform="translate(460, 270)">
        {/* House base */}
        <rect x="-65" y="5" width="130" height="110" fill="#c0392b" stroke="#922b21" strokeWidth="1.5" />
        {/* Brick pattern */}
        {Array.from({ length: 7 }, (_, row) =>
          Array.from({ length: 5 }, (_, col) => {
            const offset = row % 2 === 0 ? 0 : 13;
            const x = -62 + col * 26 + offset;
            const y = 8 + row * 15;
            return (
              <g key={`${row}-${col}`}>
                <rect x={x} y={y} width="24" height="13" rx="1" fill="#c0392b" stroke="#a8a8a8" strokeWidth="0.6" opacity="0.8" />
                <rect x={x + 1} y={y + 1} width="22" height="4" rx="0.5" fill="#d44b3e" opacity="0.3" />
              </g>
            );
          })
        )}
        {/* Roof */}
        <path d="M-80 8 L0 -50 L80 8 Z" fill="#8b4513" stroke="#6b3410" strokeWidth="2" />
        <path d="M-75 6 L0 -45 L75 6 Z" fill="#a0522d" opacity="0.4" />
        {/* Roof tiles suggestion */}
        {Array.from({ length: 5 }, (_, i) => (
          <path key={i} d={`M${-65 + i * 30} ${6 - i * (i < 3 ? 8 : -8) + (i < 3 ? 0 : 32)} Q${-50 + i * 30} ${2 - i * (i < 3 ? 8 : -8) + (i < 3 ? 0 : 32)} ${-35 + i * 30} ${6 - i * (i < 3 ? 8 : -8) + (i < 3 ? 0 : 32)}`} fill="none" stroke="#6b3410" strokeWidth="0.8" opacity="0.4" />
        ))}
        {/* Chimney */}
        <rect x="30" y="-55" width="18" height="35" fill="#c0392b" stroke="#922b21" strokeWidth="1.5" />
        {/* Chimney bricks */}
        <line x1="30" y1="-45" x2="48" y2="-45" stroke="#a8a8a8" strokeWidth="0.5" />
        <line x1="30" y1="-35" x2="48" y2="-35" stroke="#a8a8a8" strokeWidth="0.5" />
        <line x1="39" y1="-55" x2="39" y2="-45" stroke="#a8a8a8" strokeWidth="0.5" />
        <line x1="36" y1="-45" x2="36" y2="-35" stroke="#a8a8a8" strokeWidth="0.5" />
        <line x1="42" y1="-35" x2="42" y2="-25" stroke="#a8a8a8" strokeWidth="0.5" />
        {/* Chimney cap */}
        <rect x="27" y="-58" width="24" height="5" rx="1" fill="#922b21" />
        {/* Door */}
        <rect x="-12" y="60" width="24" height="55" rx="10" fill="#5d3a1a" stroke="#4a2e14" strokeWidth="1.5" />
        <circle cx="8" cy="88" r="2.5" fill="#d4a843" />
        {/* Door frame */}
        <rect x="-14" y="58" width="28" height="3" fill="#4a2e14" />
        {/* Windows */}
        <rect x="-50" y="30" width="24" height="24" rx="2" fill="#87ceeb" stroke="#4a2e14" strokeWidth="2" />
        <line x1="-38" y1="30" x2="-38" y2="54" stroke="#4a2e14" strokeWidth="1.5" />
        <line x1="-50" y1="42" x2="-26" y2="42" stroke="#4a2e14" strokeWidth="1.5" />
        <rect x="26" y="30" width="24" height="24" rx="2" fill="#87ceeb" stroke="#4a2e14" strokeWidth="2" />
        <line x1="38" y1="30" x2="38" y2="54" stroke="#4a2e14" strokeWidth="1.5" />
        <line x1="26" y1="42" x2="50" y2="42" stroke="#4a2e14" strokeWidth="1.5" />
        {/* Window curtains */}
        <path d="M-49 31 Q-44 36 -39 31" fill="#ff9999" opacity="0.5" />
        <path d="M-37 31 Q-32 36 -27 31" fill="#ff9999" opacity="0.5" />
        <path d="M27 31 Q32 36 37 31" fill="#ff9999" opacity="0.5" />
        <path d="M39 31 Q44 36 49 31" fill="#ff9999" opacity="0.5" />
      </g>

      {/* Garden flowers around house */}
      {[
        [360, 395, '#ff6b8a'], [370, 398, '#ffd700'], [380, 393, '#9b59b6'],
        [540, 390, '#ff6b8a'], [555, 394, '#ffd700'], [570, 388, '#9b59b6'],
        [580, 396, '#ff6b8a'],
      ].map(([x, y, c], i) => (
        <g key={i} transform={`translate(${x}, ${y})`}>
          <line x1="0" y1="0" x2="0" y2="14" stroke="#3d8a40" strokeWidth="1.5" />
          <path d="M0 2 Q-4 -2 0 -4 Q4 -2 0 2 Q-2 -5 0 -6 Q2 -5 0 2" fill={c} />
          <circle cx="0" cy="-1" r="1.5" fill="#fff4a0" />
        </g>
      ))}

      {/* ── PIG 3 (hardworking, with hard hat, laying bricks) ── */}
      <g transform="translate(330, 370)">
        {/* Body */}
        <ellipse cx="0" cy="-8" rx="22" ry="20" fill="url(#ps4-pigBody)" stroke="#e8a0a8" strokeWidth="1.5" />
        <ellipse cx="-2" cy="-4" rx="12" ry="10" fill="#fcc4cc" opacity="0.5" />
        {/* Arm holding brick */}
        <path d="M16 -14 Q26 -22 30 -28" fill="none" stroke="#f8b4be" strokeWidth="7" strokeLinecap="round" />
        <ellipse cx="30" cy="-30" rx="4.5" ry="3.5" fill="#e8a0a8" />
        {/* Brick in hand */}
        <rect x="24" y="-40" width="16" height="8" rx="1" fill="#c0392b" stroke="#922b21" strokeWidth="1" />
        {/* Other arm with trowel */}
        <path d="M-16 -12 Q-26 -18 -30 -24" fill="none" stroke="#f8b4be" strokeWidth="7" strokeLinecap="round" />
        <ellipse cx="-30" cy="-26" rx="4.5" ry="3.5" fill="#e8a0a8" />
        {/* Trowel */}
        <line x1="-30" y1="-26" x2="-34" y2="-36" stroke="#8b5e3c" strokeWidth="2" strokeLinecap="round" />
        <path d="M-38 -38 L-30 -38 L-32 -34 L-40 -34 Z" fill="#aaa" stroke="#888" strokeWidth="0.8" />
        {/* Legs */}
        <rect x="-12" y="8" width="7" height="15" rx="3.5" fill="#f8b4be" stroke="#e8a0a8" strokeWidth="1" />
        <rect x="5" y="8" width="7" height="15" rx="3.5" fill="#f8b4be" stroke="#e8a0a8" strokeWidth="1" />
        <ellipse cx="-8.5" cy="24" rx="5" ry="3" fill="#e8a0a8" />
        <ellipse cx="8.5" cy="24" rx="5" ry="3" fill="#e8a0a8" />
        {/* Head */}
        <ellipse cx="0" cy="-32" rx="17" ry="15" fill="#f8b4be" stroke="#e8a0a8" strokeWidth="1.5" />
        {/* Hard hat */}
        <path d="M-16 -42 Q-18 -54 0 -56 Q18 -54 16 -42" fill="#f1c40f" stroke="#d4a843" strokeWidth="1.5" />
        <rect x="-20" y="-43" width="40" height="4" rx="2" fill="#f1c40f" stroke="#d4a843" strokeWidth="1" />
        {/* Ears (peeking from under hat) */}
        <path d="M-14 -42 Q-18 -48 -12 -46" fill="#fcc4cc" stroke="#e8a0a8" strokeWidth="1" />
        <path d="M14 -42 Q18 -48 12 -46" fill="#fcc4cc" stroke="#e8a0a8" strokeWidth="1" />
        {/* Eyes — determined look */}
        <ellipse cx="-6" cy="-35" rx="4" ry="4.5" fill="white" />
        <ellipse cx="6" cy="-35" rx="4" ry="4.5" fill="white" />
        <circle cx="-5" cy="-34" r="2.5" fill="#2c1810" />
        <circle cx="7" cy="-34" r="2.5" fill="#2c1810" />
        <circle cx="-4" cy="-35.5" r="1" fill="white" />
        <circle cx="8" cy="-35.5" r="1" fill="white" />
        {/* Determined eyebrows */}
        <path d="M-10 -40 Q-7 -41.5 -3 -40" fill="none" stroke="#e8a0a8" strokeWidth="1.2" />
        <path d="M3 -40 Q7 -41.5 10 -40" fill="none" stroke="#e8a0a8" strokeWidth="1.2" />
        {/* Snout */}
        <ellipse cx="0" cy="-27" rx="8.5" ry="5.5" fill="#fcc4cc" stroke="#e8a0a8" strokeWidth="1" />
        <circle cx="-2.5" cy="-27" r="1.5" fill="#e8a0a8" />
        <circle cx="2.5" cy="-27" r="1.5" fill="#e8a0a8" />
        {/* Mouth — slight smile of satisfaction */}
        <path d="M-4 -22.5 Q0 -20 4 -22.5" fill="none" stroke="#e8a0a8" strokeWidth="0.8" />
        {/* Cheeks */}
        <circle cx="-13" cy="-30" r="4" fill="url(#ps4-cheek)" />
        <circle cx="13" cy="-30" r="4" fill="url(#ps4-cheek)" />
        {/* Curly tail */}
        <path d="M-18 -6 Q-28 -10 -26 -2 Q-24 6 -30 2" fill="none" stroke="#f8b4be" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* Brick pile on ground */}
      {Array.from({ length: 4 }, (_, i) => (
        <rect key={i} x={545 + i * 18} y={395 - i * 2} width="16" height="8" rx="1" fill="#c0392b" stroke="#922b21" strokeWidth="0.8" />
      ))}
      {Array.from({ length: 3 }, (_, i) => (
        <rect key={i} x={553 + i * 18} y={386 - i * 2} width="16" height="8" rx="1" fill="#d44b3e" stroke="#922b21" strokeWidth="0.8" />
      ))}

      {/* Foreground grass */}
      <path d="M0 580 Q200 568 400 575 Q600 565 800 578 L800 600 L0 600Z" fill="#3d8a40" />
    </svg>
  );
}

/* ───────────────────────────────────────────
   SCENE 5 — The Big Bad Wolf arrives
   ─────────────────────────────────────────── */
export function PigScene5({ className = '' }) {
  return (
    <svg viewBox="0 0 800 600" className={`absolute inset-0 w-full h-full ${className}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="ps5-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2c3e6e" />
          <stop offset="50%" stopColor="#4a6fa5" />
          <stop offset="100%" stopColor="#7ba3c9" />
        </linearGradient>
        <linearGradient id="ps5-wolfBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7b8694" />
          <stop offset="100%" stopColor="#6b7280" />
        </linearGradient>
        <radialGradient id="ps5-moon" cx="0.4" cy="0.4" r="0.5">
          <stop offset="0%" stopColor="#fff8dc" />
          <stop offset="100%" stopColor="#f0e68c" />
        </radialGradient>
      </defs>

      {/* Sky — dramatic dusk */}
      <rect width="800" height="600" fill="url(#ps5-sky)" />

      {/* Moon */}
      <circle cx="680" cy="100" r="40" fill="url(#ps5-moon)" />
      <circle cx="695" cy="90" r="35" fill="url(#ps5-sky)" opacity="0.3" />

      {/* Stars */}
      {[[100, 60], [250, 40], [400, 80], [550, 30], [720, 50], [150, 110], [350, 30]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={1 + i % 2} fill="white" opacity={0.4 + (i % 3) * 0.2}>
          <animate attributeName="opacity" values={`${0.3 + i * 0.05};${0.7 + i * 0.03};${0.3 + i * 0.05}`} dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* Dark twisted trees */}
      {[
        [50, 280, -10], [140, 300, 5], [650, 290, 8], [740, 270, -5],
      ].map(([tx, ty, rot], i) => (
        <g key={i} transform={`translate(${tx}, ${ty}) rotate(${rot})`}>
          {/* Twisted trunk */}
          <path d={`M0 0 Q${-8 + i * 3} -40 ${-5 + i * 2} -80 Q${-10 + i * 4} -120 ${i * 2} -140`} fill="none" stroke="#3d2b1a" strokeWidth={12 - i} strokeLinecap="round" />
          {/* Branches */}
          <path d={`M${-5 + i * 2} -100 Q${-30 + i * 5} -120 ${-40 + i * 5} -110`} fill="none" stroke="#3d2b1a" strokeWidth={4} strokeLinecap="round" />
          <path d={`M${-3 + i * 2} -80 Q${20 - i * 3} -100 ${30 - i * 3} -95`} fill="none" stroke="#3d2b1a" strokeWidth={3} strokeLinecap="round" />
          {/* Dark canopy */}
          <ellipse cx={i * 2} cy="-140" rx={30 + i * 3} ry={40 + i * 2} fill="#2a4a2a" opacity="0.8" />
          <ellipse cx={-10 + i * 3} cy="-130" rx={22 + i * 2} ry={30 + i} fill="#1a3a1a" opacity="0.6" />
        </g>
      ))}

      {/* Ground — dark moody */}
      <path d="M0 400 Q200 370 400 390 Q600 360 800 395 L800 600 L0 600Z" fill="#2a5a2a" />
      <path d="M0 440 Q200 420 400 435 Q600 415 800 440 L800 600 L0 600Z" fill="#3d6a3d" />

      {/* Shadows / atmosphere */}
      <rect x="0" y="350" width="800" height="250" fill="#1a1a2e" opacity="0.15" />

      {/* ── THE WOLF ── */}
      <g transform="translate(400, 360)">
        {/* Bushy tail */}
        <path d="M-30 10 Q-55 -5 -60 -20 Q-65 -35 -50 -28 Q-45 -22 -40 -10 Q-35 0 -30 5" fill="#6b7280" stroke="#4b5563" strokeWidth="1" />
        <path d="M-55 -18 Q-58 -28 -48 -25" fill="#9ca3af" opacity="0.4" />
        {/* Body */}
        <ellipse cx="0" cy="0" rx="35" ry="28" fill="url(#ps5-wolfBody)" stroke="#4b5563" strokeWidth="1.5" />
        {/* Belly */}
        <ellipse cx="3" cy="6" rx="18" ry="14" fill="#9ca3af" opacity="0.4" />
        {/* Dark back patch */}
        <path d="M-20 -15 Q0 -28 20 -15" fill="#4b5563" opacity="0.3" />
        {/* Back legs */}
        <rect x="-22" y="22" width="10" height="22" rx="4" fill="#6b7280" stroke="#4b5563" strokeWidth="1" />
        <rect x="12" y="22" width="10" height="22" rx="4" fill="#6b7280" stroke="#4b5563" strokeWidth="1" />
        {/* Paws */}
        <ellipse cx="-17" cy="46" rx="7" ry="4" fill="#4b5563" />
        <ellipse cx="17" cy="46" rx="7" ry="4" fill="#4b5563" />
        {/* Front legs */}
        <rect x="-10" y="20" width="9" height="24" rx="4" fill="#7b8694" stroke="#4b5563" strokeWidth="1" />
        <rect x="4" y="20" width="9" height="24" rx="4" fill="#7b8694" stroke="#4b5563" strokeWidth="1" />
        <ellipse cx="-5.5" cy="46" rx="6.5" ry="3.5" fill="#4b5563" />
        <ellipse cx="8.5" cy="46" rx="6.5" ry="3.5" fill="#4b5563" />
        {/* Head */}
        <ellipse cx="12" cy="-22" rx="22" ry="18" fill="#6b7280" stroke="#4b5563" strokeWidth="1.5" />
        {/* Face lighter area */}
        <ellipse cx="16" cy="-18" rx="12" ry="10" fill="#9ca3af" opacity="0.3" />
        {/* Big pointy ears */}
        <path d="M0 -38 Q-6 -62 2 -56 Q6 -50 4 -38" fill="#6b7280" stroke="#4b5563" strokeWidth="1" />
        <path d="M1 -40 Q-2 -54 3 -50" fill="#9ca3af" opacity="0.4" />
        <path d="M20 -38 Q18 -64 24 -56 Q28 -48 24 -38" fill="#6b7280" stroke="#4b5563" strokeWidth="1" />
        <path d="M21 -40 Q20 -56 25 -50" fill="#9ca3af" opacity="0.4" />
        {/* Long snout */}
        <ellipse cx="30" cy="-16" rx="14" ry="10" fill="#7b8694" stroke="#4b5563" strokeWidth="1" />
        <ellipse cx="33" cy="-14" rx="8" ry="6" fill="#9ca3af" opacity="0.3" />
        {/* Nose */}
        <ellipse cx="42" cy="-18" rx="4" ry="3" fill="#2c2c2c" />
        {/* Eyes — big and yellow, goofy */}
        <ellipse cx="8" cy="-28" rx="6" ry="7" fill="white" />
        <ellipse cx="22" cy="-28" rx="5.5" ry="6.5" fill="white" />
        <circle cx="9" cy="-27" r="3.5" fill="#d4a017" />
        <circle cx="23" cy="-27" r="3.2" fill="#d4a017" />
        <circle cx="9" cy="-27" r="1.8" fill="#2c1810" />
        <circle cx="23" cy="-27" r="1.6" fill="#2c1810" />
        <circle cx="10.5" cy="-29" r="1.2" fill="white" />
        <circle cx="24" cy="-29" r="1" fill="white" />
        {/* Big goofy grin */}
        <path d="M26 -10 Q34 -4 42 -10" fill="none" stroke="#4b5563" strokeWidth="1.5" />
        {/* Tongue sticking out */}
        <path d="M32 -7 Q34 0 36 -2 Q38 -6 34 -8" fill="#e8787a" stroke="#d06060" strokeWidth="0.8" />
        {/* Teeth showing in grin */}
        <path d="M28 -10 L30 -7 L32 -10" fill="white" stroke="#ddd" strokeWidth="0.5" />
        <path d="M36 -10 L38 -7 L40 -10" fill="white" stroke="#ddd" strokeWidth="0.5" />
      </g>

      {/* Mushrooms */}
      {[[250, 445], [550, 440], [620, 448]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x}, ${y})`}>
          <rect x="-2" y="0" width="4" height="8" rx="1" fill="#f5f0e0" />
          <ellipse cx="0" cy="0" rx="7" ry="5" fill={i % 2 === 0 ? '#e74c3c' : '#e67e22'} />
          <circle cx="-2" cy="-1" r="1.2" fill="white" opacity="0.7" />
          <circle cx="3" cy="0" r="0.8" fill="white" opacity="0.7" />
        </g>
      ))}

      {/* Foreground dark grass */}
      <path d="M0 575 Q200 560 400 570 Q600 558 800 575 L800 600 L0 600Z" fill="#1a3a1a" />
    </svg>
  );
}

/* ───────────────────────────────────────────
   SCENE 6 — The wolf blows down the straw house
   ─────────────────────────────────────────── */
export function PigScene6({ className = '' }) {
  return (
    <svg viewBox="0 0 800 600" className={`absolute inset-0 w-full h-full ${className}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="ps6-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5bafde" />
          <stop offset="100%" stopColor="#a8dce8" />
        </linearGradient>
        <linearGradient id="ps6-wolfBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7b8694" />
          <stop offset="100%" stopColor="#6b7280" />
        </linearGradient>
        <linearGradient id="ps6-pigBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fcc4cc" />
          <stop offset="100%" stopColor="#f8b4be" />
        </linearGradient>
        <radialGradient id="ps6-cheek" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ff9999" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ff9999" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect width="800" height="600" fill="url(#ps6-sky)" />

      {/* Clouds being blown */}
      <g opacity="0.7">
        <ellipse cx="500" cy="70" rx="45" ry="18" fill="white" />
        <ellipse cx="550" cy="100" rx="35" ry="14" fill="white" />
      </g>

      {/* Ground */}
      <path d="M0 400 Q200 380 400 395 Q600 375 800 400 L800 600 L0 600Z" fill="#4da64d" />
      <path d="M0 440 Q200 425 400 435 Q600 420 800 440 L800 600 L0 600Z" fill="#5cb85c" />

      {/* ── COLLAPSING STRAW HOUSE ── */}
      <g transform="translate(520, 320)">
        {/* Remaining base — falling apart */}
        <path d="M-40 0 L-50 80 L50 80 L40 0 Z" fill="#d4a843" stroke="#b8923a" strokeWidth="1" opacity="0.6" />
        {/* Half-collapsed walls */}
        <path d="M-50 80 Q-60 40 -55 10 L-30 5" fill="none" stroke="#b8923a" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
        {/* Roof fragment tilting */}
        <path d="M-30 -10 L10 -40 L50 -5" fill="#d4a843" stroke="#b8923a" strokeWidth="1.5" opacity="0.5" transform="rotate(15 10 -20)" />
      </g>

      {/* ── FLYING STRAW PIECES ── */}
      {[
        [380, 200, 30, '#e8c252'], [420, 160, -15, '#d4a843'], [460, 180, 45, '#e8c252'],
        [500, 140, -30, '#d4a843'], [540, 220, 60, '#e8c252'], [350, 250, 20, '#d4a843'],
        [440, 120, -45, '#e8c252'], [520, 260, 35, '#d4a843'], [480, 300, -20, '#e8c252'],
        [560, 170, 50, '#d4a843'], [400, 280, -10, '#e8c252'], [530, 130, 25, '#d4a843'],
        [600, 200, -35, '#e8c252'], [470, 240, 40, '#d4a843'], [360, 180, -25, '#e8c252'],
      ].map(([x, y, rot, c], i) => (
        <rect key={i} x={x} y={y} width={12 + i % 5 * 3} height={2.5} rx="1" fill={c} opacity={0.6 + (i % 3) * 0.1} transform={`rotate(${rot} ${x + 6} ${y + 1})`}>
          <animateTransform attributeName="transform" type="translate" values={`0 0;${10 + i * 3} ${-5 + i * 2};${20 + i * 5} ${i * 3}`} dur={`${2 + i * 0.2}s`} repeatCount="indefinite" additive="sum" />
        </rect>
      ))}

      {/* ── WIND LINES ── */}
      {[
        [220, 280], [230, 310], [240, 340], [250, 260], [200, 350],
        [260, 290], [210, 320],
      ].map(([x, y], i) => (
        <path key={i} d={`M${x} ${y} Q${x + 40} ${y - 5} ${x + 80} ${y + 3} Q${x + 120} ${y - 3} ${x + 160} ${y}`} fill="none" stroke="#87ceeb" strokeWidth={1.5 + i % 2} opacity={0.3 + i * 0.05} strokeLinecap="round" />
      ))}

      {/* Wind swirls */}
      <path d="M300 280 Q320 260 340 270 Q360 280 350 290" fill="none" stroke="#87ceeb" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
      <path d="M280 320 Q300 305 315 315 Q325 325 315 330" fill="none" stroke="#87ceeb" strokeWidth="1.5" opacity="0.25" strokeLinecap="round" />

      {/* ── THE WOLF (puffed cheeks, blowing) ── */}
      <g transform="translate(180, 340)">
        {/* Bushy tail */}
        <path d="M-30 15 Q-55 0 -58 -15 Q-62 -30 -48 -24 Q-40 -18 -35 -5 Q-32 5 -28 10" fill="#6b7280" stroke="#4b5563" strokeWidth="1" />
        <path d="M-53 -14 Q-56 -24 -46 -20" fill="#9ca3af" opacity="0.4" />
        {/* Body — leaning forward */}
        <ellipse cx="5" cy="5" rx="32" ry="26" fill="url(#ps6-wolfBody)" stroke="#4b5563" strokeWidth="1.5" />
        <ellipse cx="8" cy="10" rx="16" ry="12" fill="#9ca3af" opacity="0.3" />
        <path d="M-15 -10 Q5 -24 25 -10" fill="#4b5563" opacity="0.3" />
        {/* Legs */}
        <rect x="-18" y="26" width="10" height="20" rx="4" fill="#6b7280" stroke="#4b5563" strokeWidth="1" />
        <rect x="14" y="26" width="10" height="20" rx="4" fill="#6b7280" stroke="#4b5563" strokeWidth="1" />
        <ellipse cx="-13" cy="48" rx="7" ry="3.5" fill="#4b5563" />
        <ellipse cx="19" cy="48" rx="7" ry="3.5" fill="#4b5563" />
        {/* Head — turned toward house */}
        <ellipse cx="22" cy="-16" rx="20" ry="17" fill="#6b7280" stroke="#4b5563" strokeWidth="1.5" />
        <ellipse cx="26" cy="-12" rx="11" ry="9" fill="#9ca3af" opacity="0.3" />
        {/* Ears */}
        <path d="M8 -32 Q4 -52 12 -46 Q16 -40 14 -32" fill="#6b7280" stroke="#4b5563" strokeWidth="1" />
        <path d="M9 -34 Q7 -46 13 -42" fill="#9ca3af" opacity="0.4" />
        <path d="M28 -32 Q26 -54 34 -46 Q38 -38 32 -32" fill="#6b7280" stroke="#4b5563" strokeWidth="1" />
        {/* HUGELY puffed cheeks! */}
        <ellipse cx="38" cy="-8" rx="16" ry="14" fill="#7b8694" stroke="#4b5563" strokeWidth="1" />
        <ellipse cx="42" cy="-6" rx="10" ry="8" fill="#e8787a" opacity="0.3" />
        {/* Snout extended */}
        <ellipse cx="50" cy="-14" rx="12" ry="8" fill="#7b8694" stroke="#4b5563" strokeWidth="1" />
        {/* Mouth — wide open blowing */}
        <ellipse cx="60" cy="-12" rx="6" ry="4" fill="#4b1a1a" />
        {/* Nose */}
        <ellipse cx="60" cy="-18" rx="3.5" ry="2.5" fill="#2c2c2c" />
        {/* Eyes — strained from effort */}
        <ellipse cx="16" cy="-22" rx="5" ry="5.5" fill="white" />
        <ellipse cx="30" cy="-22" rx="4.5" ry="5" fill="white" />
        <circle cx="17" cy="-21" r="3" fill="#d4a017" />
        <circle cx="31" cy="-21" r="2.8" fill="#d4a017" />
        <circle cx="17" cy="-21" r="1.5" fill="#2c1810" />
        <circle cx="31" cy="-21" r="1.4" fill="#2c1810" />
        <circle cx="18.5" cy="-23" r="1" fill="white" />
        <circle cx="32" cy="-23" r="0.9" fill="white" />
        {/* Strain lines around eyes */}
        <path d="M10 -22 L7 -22" stroke="#4b5563" strokeWidth="0.8" />
        <path d="M10 -20 L7 -19" stroke="#4b5563" strokeWidth="0.8" />
      </g>

      {/* ── PIG running away (one pig, scared) ── */}
      <g transform="translate(650, 380)">
        {/* Body */}
        <ellipse cx="0" cy="-6" rx="20" ry="18" fill="url(#ps6-pigBody)" stroke="#e8a0a8" strokeWidth="1.5" />
        <ellipse cx="-2" cy="-3" rx="11" ry="9" fill="#fcc4cc" opacity="0.5" />
        {/* Legs — running */}
        <rect x="-14" y="8" width="7" height="14" rx="3" fill="#f8b4be" stroke="#e8a0a8" strokeWidth="1" transform="rotate(-15 -10 15)" />
        <rect x="5" y="8" width="7" height="14" rx="3" fill="#f8b4be" stroke="#e8a0a8" strokeWidth="1" transform="rotate(15 9 15)" />
        <ellipse cx="-14" cy="22" rx="5" ry="2.8" fill="#e8a0a8" />
        <ellipse cx="14" cy="22" rx="5" ry="2.8" fill="#e8a0a8" />
        {/* Arms flailing */}
        <path d="M-16 -12 Q-26 -24 -22 -30" fill="none" stroke="#f8b4be" strokeWidth="6" strokeLinecap="round" />
        <path d="M16 -12 Q26 -24 22 -30" fill="none" stroke="#f8b4be" strokeWidth="6" strokeLinecap="round" />
        {/* Head */}
        <ellipse cx="0" cy="-26" rx="15" ry="13" fill="#f8b4be" stroke="#e8a0a8" strokeWidth="1.5" />
        {/* Ears — flapping back from running */}
        <path d="M-10 -37 Q-16 -48 -6 -43" fill="#fcc4cc" stroke="#e8a0a8" strokeWidth="1" />
        <path d="M10 -37 Q16 -48 6 -43" fill="#fcc4cc" stroke="#e8a0a8" strokeWidth="1" />
        {/* Big scared eyes! */}
        <ellipse cx="-5" cy="-29" rx="5" ry="6" fill="white" />
        <ellipse cx="5" cy="-29" rx="5" ry="6" fill="white" />
        <circle cx="-4" cy="-28" r="3" fill="#2c1810" />
        <circle cx="6" cy="-28" r="3" fill="#2c1810" />
        <circle cx="-3" cy="-30" r="1.2" fill="white" />
        <circle cx="7" cy="-30" r="1.2" fill="white" />
        {/* Scared eyebrows */}
        <path d="M-10 -36 Q-6 -38 -2 -36" fill="none" stroke="#e8a0a8" strokeWidth="1.2" />
        <path d="M2 -36 Q6 -38 10 -36" fill="none" stroke="#e8a0a8" strokeWidth="1.2" />
        {/* Open mouth — "Eek!" */}
        <ellipse cx="0" cy="-20" rx="5" ry="4" fill="#e85858" />
        {/* Snout */}
        <ellipse cx="0" cy="-24" rx="7.5" ry="4.5" fill="#fcc4cc" stroke="#e8a0a8" strokeWidth="1" />
        <circle cx="-2" cy="-24" r="1.3" fill="#e8a0a8" />
        <circle cx="2" cy="-24" r="1.3" fill="#e8a0a8" />
        {/* Cheeks */}
        <circle cx="-11" cy="-25" r="3.5" fill="url(#ps6-cheek)" />
        <circle cx="11" cy="-25" r="3.5" fill="url(#ps6-cheek)" />
        {/* Curly tail — bouncing */}
        <path d="M-16 -4 Q-26 -8 -24 0 Q-22 8 -28 4" fill="none" stroke="#f8b4be" strokeWidth="2.5" strokeLinecap="round" />
        {/* Motion lines behind pig */}
        <line x1="24" y1="-30" x2="34" y2="-30" stroke="#ccc" strokeWidth="1" opacity="0.5" />
        <line x1="22" y1="-22" x2="36" y2="-22" stroke="#ccc" strokeWidth="1" opacity="0.5" />
        <line x1="24" y1="-14" x2="32" y2="-14" stroke="#ccc" strokeWidth="1" opacity="0.5" />
      </g>

      {/* Foreground grass */}
      <path d="M0 580 Q200 565 400 575 Q600 560 800 578 L800 600 L0 600Z" fill="#3d8a40" />
    </svg>
  );
}

/* ───────────────────────────────────────────
   SCENE 7 — The wolf blows down the stick house
   ─────────────────────────────────────────── */
export function PigScene7({ className = '' }) {
  return (
    <svg viewBox="0 0 800 600" className={`absolute inset-0 w-full h-full ${className}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="ps7-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a8ec4" />
          <stop offset="100%" stopColor="#8ec4e8" />
        </linearGradient>
        <linearGradient id="ps7-wolfBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7b8694" />
          <stop offset="100%" stopColor="#6b7280" />
        </linearGradient>
        <linearGradient id="ps7-pigBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fcc4cc" />
          <stop offset="100%" stopColor="#f8b4be" />
        </linearGradient>
        <radialGradient id="ps7-cheek" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ff9999" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ff9999" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect width="800" height="600" fill="url(#ps7-sky)" />

      {/* Trees in background */}
      {[60, 720].map((tx, i) => (
        <g key={i} transform={`translate(${tx}, 310)`}>
          <rect x="-5" y="0" width="10" height="60" rx="3" fill="#6b4830" />
          <ellipse cx="0" cy="-15" rx="28" ry="38" fill="#3d8a40" />
        </g>
      ))}

      {/* Ground */}
      <path d="M0 400 Q200 380 400 395 Q600 375 800 400 L800 600 L0 600Z" fill="#4da64d" />
      <path d="M0 440 Q200 420 400 435 Q600 415 800 440 L800 600 L0 600Z" fill="#5cb85c" />

      {/* ── COLLAPSING STICK HOUSE ── */}
      <g transform="translate(500, 310)">
        {/* Base remains */}
        <rect x="-30" y="30" width="60" height="50" fill="#8b6914" stroke="#6b4830" strokeWidth="1" opacity="0.5" />
        {/* Tilting wall fragment */}
        <rect x="-45" y="10" width="30" height="60" fill="#a07828" stroke="#6b4830" strokeWidth="1.5" opacity="0.6" transform="rotate(-20 -30 40)" />
      </g>

      {/* ── FLYING STICKS AND PLANKS ── */}
      {[
        [350, 180, 40, 20, 3], [400, 140, -25, 18, 2.5], [440, 200, 55, 22, 3],
        [480, 150, -35, 16, 2], [520, 230, 30, 24, 3.5], [380, 260, -15, 14, 2],
        [460, 120, 45, 20, 2.5], [540, 180, -40, 18, 3], [360, 220, 25, 16, 2],
        [510, 270, -20, 22, 3], [420, 300, 50, 14, 2], [560, 160, -30, 20, 2.5],
        [390, 160, 35, 12, 2], [470, 250, -45, 18, 2.5],
      ].map(([x, y, rot, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} rx="1" fill={i % 2 === 0 ? '#8b6914' : '#a07828'} stroke="#6b4830" strokeWidth="0.5" opacity={0.5 + (i % 3) * 0.15} transform={`rotate(${rot} ${x + w / 2} ${y + h / 2})`}>
          <animateTransform attributeName="transform" type="translate" values={`0 0;${8 + i * 2} ${-3 + i};${15 + i * 4} ${i * 2}`} dur={`${2.5 + i * 0.15}s`} repeatCount="indefinite" additive="sum" />
        </rect>
      ))}

      {/* ── DRAMATIC WIND LINES ── */}
      {[
        [200, 260], [210, 290], [220, 320], [230, 350], [195, 240],
        [240, 280], [250, 310], [215, 370],
      ].map(([x, y], i) => (
        <path key={i} d={`M${x} ${y} Q${x + 50} ${y - 8} ${x + 100} ${y} Q${x + 150} ${y + 8} ${x + 200} ${y - 3}`} fill="none" stroke="#87ceeb" strokeWidth={2 + i % 2} opacity={0.25 + i * 0.04} strokeLinecap="round" />
      ))}

      {/* Wind swirls — more dramatic */}
      <path d="M310 260 Q340 235 360 250 Q375 265 355 275 Q340 280 330 270" fill="none" stroke="#87ceeb" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
      <path d="M280 330 Q310 310 325 325 Q335 340 315 345" fill="none" stroke="#87ceeb" strokeWidth="1.5" opacity="0.25" strokeLinecap="round" />

      {/* ── THE WOLF (even more ridiculous, eyes bulging) ── */}
      <g transform="translate(160, 340)">
        {/* Bushy tail — puffed up */}
        <path d="M-32 15 Q-58 -5 -62 -22 Q-68 -40 -50 -30 Q-42 -22 -38 -8 Q-34 2 -30 10" fill="#6b7280" stroke="#4b5563" strokeWidth="1" />
        <path d="M-56 -20 Q-60 -32 -48 -26" fill="#9ca3af" opacity="0.4" />
        {/* Body — really leaning forward */}
        <ellipse cx="8" cy="5" rx="34" ry="27" fill="url(#ps7-wolfBody)" stroke="#4b5563" strokeWidth="1.5" />
        <ellipse cx="12" cy="10" rx="17" ry="13" fill="#9ca3af" opacity="0.3" />
        <path d="M-12 -10 Q8 -26 28 -10" fill="#4b5563" opacity="0.3" />
        {/* Legs — braced */}
        <rect x="-18" y="26" width="10" height="22" rx="4" fill="#6b7280" stroke="#4b5563" strokeWidth="1" />
        <rect x="16" y="26" width="10" height="22" rx="4" fill="#6b7280" stroke="#4b5563" strokeWidth="1" />
        <ellipse cx="-13" cy="50" rx="7" ry="4" fill="#4b5563" />
        <ellipse cx="21" cy="50" rx="7" ry="4" fill="#4b5563" />
        {/* Head */}
        <ellipse cx="26" cy="-16" rx="22" ry="18" fill="#6b7280" stroke="#4b5563" strokeWidth="1.5" />
        <ellipse cx="30" cy="-12" rx="12" ry="10" fill="#9ca3af" opacity="0.3" />
        {/* Ears — blown back */}
        <path d="M10 -32 Q4 -54 14 -46 Q20 -40 16 -32" fill="#6b7280" stroke="#4b5563" strokeWidth="1" />
        <path d="M32 -32 Q28 -56 38 -48 Q42 -40 36 -32" fill="#6b7280" stroke="#4b5563" strokeWidth="1" />
        {/* MASSIVELY puffed cheeks — red from effort */}
        <ellipse cx="44" cy="-6" rx="18" ry="16" fill="#7b8694" stroke="#4b5563" strokeWidth="1" />
        <ellipse cx="48" cy="-4" rx="12" ry="10" fill="#e8787a" opacity="0.4" />
        {/* Snout */}
        <ellipse cx="56" cy="-14" rx="13" ry="9" fill="#7b8694" stroke="#4b5563" strokeWidth="1" />
        {/* Mouth — straining open */}
        <ellipse cx="66" cy="-10" rx="7" ry="5" fill="#4b1a1a" />
        {/* Nose */}
        <ellipse cx="66" cy="-18" rx="4" ry="2.8" fill="#2c2c2c" />
        {/* BULGING eyes */}
        <ellipse cx="18" cy="-24" rx="6.5" ry="7.5" fill="white" />
        <ellipse cx="34" cy="-24" rx="6" ry="7" fill="white" />
        <circle cx="19" cy="-23" r="3.5" fill="#d4a017" />
        <circle cx="35" cy="-23" r="3.2" fill="#d4a017" />
        <circle cx="19" cy="-23" r="1.8" fill="#2c1810" />
        <circle cx="35" cy="-23" r="1.6" fill="#2c1810" />
        <circle cx="21" cy="-25.5" r="1.2" fill="white" />
        <circle cx="36.5" cy="-25.5" r="1" fill="white" />
        {/* Veins / strain marks */}
        <path d="M12 -30 L8 -34" stroke="#e8787a" strokeWidth="0.8" opacity="0.5" />
        <path d="M40 -30 L44 -34" stroke="#e8787a" strokeWidth="0.8" opacity="0.5" />
        {/* Forehead sweat drop */}
        <path d="M25 -36 Q26 -40 27 -36 Q26 -34 25 -36Z" fill="#87ceeb" opacity="0.6" />
      </g>

      {/* ── TWO PIGS running away together ── */}
      {/* Pig A */}
      <g transform="translate(620, 375)">
        <ellipse cx="0" cy="-6" rx="18" ry="16" fill="url(#ps7-pigBody)" stroke="#e8a0a8" strokeWidth="1.5" />
        <ellipse cx="-1" cy="-3" rx="10" ry="8" fill="#fcc4cc" opacity="0.5" />
        <rect x="-12" y="6" width="6" height="13" rx="3" fill="#f8b4be" stroke="#e8a0a8" strokeWidth="1" transform="rotate(-12 -9 12)" />
        <rect x="4" y="6" width="6" height="13" rx="3" fill="#f8b4be" stroke="#e8a0a8" strokeWidth="1" transform="rotate(12 7 12)" />
        <ellipse cx="-12" cy="19" rx="4.5" ry="2.5" fill="#e8a0a8" />
        <ellipse cx="12" cy="19" rx="4.5" ry="2.5" fill="#e8a0a8" />
        <path d="M-14 -10 Q-22 -20 -20 -26" fill="none" stroke="#f8b4be" strokeWidth="5" strokeLinecap="round" />
        <path d="M14 -10 Q22 -20 20 -26" fill="none" stroke="#f8b4be" strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="0" cy="-24" rx="13.5" ry="12" fill="#f8b4be" stroke="#e8a0a8" strokeWidth="1.5" />
        <path d="M-9 -34 Q-13 -44 -5 -39" fill="#fcc4cc" stroke="#e8a0a8" strokeWidth="1" />
        <path d="M9 -34 Q13 -44 5 -39" fill="#fcc4cc" stroke="#e8a0a8" strokeWidth="1" />
        <ellipse cx="-4.5" cy="-27" rx="4.5" ry="5.5" fill="white" />
        <ellipse cx="4.5" cy="-27" rx="4.5" ry="5.5" fill="white" />
        <circle cx="-3.5" cy="-26" r="2.8" fill="#2c1810" />
        <circle cx="5.5" cy="-26" r="2.8" fill="#2c1810" />
        <circle cx="-2.5" cy="-28" r="1.1" fill="white" />
        <circle cx="6.5" cy="-28" r="1.1" fill="white" />
        <ellipse cx="0" cy="-18" rx="4" ry="3.5" fill="#e85858" />
        <ellipse cx="0" cy="-22" rx="7" ry="4.2" fill="#fcc4cc" stroke="#e8a0a8" strokeWidth="1" />
        <circle cx="-2" cy="-22" r="1.2" fill="#e8a0a8" />
        <circle cx="2" cy="-22" r="1.2" fill="#e8a0a8" />
        <circle cx="-10" cy="-23" r="3" fill="url(#ps7-cheek)" />
        <circle cx="10" cy="-23" r="3" fill="url(#ps7-cheek)" />
        <path d="M-14 -4 Q-24 -8 -22 0 Q-20 6 -26 4" fill="none" stroke="#f8b4be" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Pig B */}
      <g transform="translate(680, 370)">
        <ellipse cx="0" cy="-5" rx="16" ry="14.5" fill="url(#ps7-pigBody)" stroke="#e8a0a8" strokeWidth="1.5" />
        <ellipse cx="-1" cy="-2" rx="9" ry="7" fill="#fcc4cc" opacity="0.5" />
        <rect x="-10" y="6" width="5.5" height="12" rx="2.5" fill="#f8b4be" stroke="#e8a0a8" strokeWidth="1" transform="rotate(-10 -7 12)" />
        <rect x="4" y="6" width="5.5" height="12" rx="2.5" fill="#f8b4be" stroke="#e8a0a8" strokeWidth="1" transform="rotate(10 7 12)" />
        <ellipse cx="-10" cy="18" rx="4" ry="2.2" fill="#e8a0a8" />
        <ellipse cx="10" cy="18" rx="4" ry="2.2" fill="#e8a0a8" />
        <path d="M-12 -8 Q-20 -18 -18 -24" fill="none" stroke="#f8b4be" strokeWidth="5" strokeLinecap="round" />
        <path d="M12 -8 Q20 -18 18 -24" fill="none" stroke="#f8b4be" strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="0" cy="-21" rx="12" ry="11" fill="#f8b4be" stroke="#e8a0a8" strokeWidth="1.5" />
        <path d="M-8 -30 Q-11 -40 -4 -35" fill="#fcc4cc" stroke="#e8a0a8" strokeWidth="1" />
        <path d="M8 -30 Q11 -40 4 -35" fill="#fcc4cc" stroke="#e8a0a8" strokeWidth="1" />
        <ellipse cx="-4" cy="-24" rx="4" ry="5" fill="white" />
        <ellipse cx="4" cy="-24" rx="4" ry="5" fill="white" />
        <circle cx="-3" cy="-23" r="2.5" fill="#2c1810" />
        <circle cx="5" cy="-23" r="2.5" fill="#2c1810" />
        <circle cx="-2" cy="-25" r="1" fill="white" />
        <circle cx="6" cy="-25" r="1" fill="white" />
        <ellipse cx="0" cy="-15.5" rx="3.5" ry="3" fill="#e85858" />
        <ellipse cx="0" cy="-18.5" rx="6.5" ry="3.8" fill="#fcc4cc" stroke="#e8a0a8" strokeWidth="1" />
        <circle cx="-1.8" cy="-18.5" r="1.1" fill="#e8a0a8" />
        <circle cx="1.8" cy="-18.5" r="1.1" fill="#e8a0a8" />
        <circle cx="-9" cy="-20" r="2.8" fill="url(#ps7-cheek)" />
        <circle cx="9" cy="-20" r="2.8" fill="url(#ps7-cheek)" />
        <path d="M-12 -3 Q-22 -7 -20 1 Q-18 7 -24 3" fill="none" stroke="#f8b4be" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Motion lines behind pigs */}
      {[[700, 345], [708, 355], [705, 365], [712, 375]].map(([x, y], i) => (
        <line key={i} x1={x} y1={y} x2={x + 10 + i * 2} y2={y} stroke="#ccc" strokeWidth="1" opacity="0.4" />
      ))}

      {/* Foreground grass */}
      <path d="M0 580 Q200 565 400 575 Q600 560 800 578 L800 600 L0 600Z" fill="#3d8a40" />
    </svg>
  );
}

/* ───────────────────────────────────────────
   SCENE 8 — Three pigs safe in the brick house
   ─────────────────────────────────────────── */
export function PigScene8({ className = '' }) {
  return (
    <svg viewBox="0 0 800 600" className={`absolute inset-0 w-full h-full ${className}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="ps8-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a7ec4" />
          <stop offset="100%" stopColor="#87b4e8" />
        </linearGradient>
        <linearGradient id="ps8-pigBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fcc4cc" />
          <stop offset="100%" stopColor="#f8b4be" />
        </linearGradient>
        <radialGradient id="ps8-cheek" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ff9999" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ff9999" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ps8-wolfBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7b8694" />
          <stop offset="100%" stopColor="#6b7280" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="800" height="600" fill="url(#ps8-sky)" />

      {/* Sun */}
      <circle cx="120" cy="90" r="45" fill="#ffe44d" />

      {/* Clouds */}
      <g opacity="0.8">
        <ellipse cx="350" cy="60" rx="50" ry="20" fill="white" />
        <ellipse cx="325" cy="55" rx="32" ry="16" fill="white" />
        <ellipse cx="380" cy="55" rx="28" ry="14" fill="white" />
      </g>
      <g opacity="0.7">
        <ellipse cx="620" cy="80" rx="42" ry="17" fill="white" />
        <ellipse cx="600" cy="76" rx="28" ry="13" fill="white" />
      </g>

      {/* Hills */}
      <path d="M0 380 Q200 340 400 370 Q600 340 800 375 L800 600 L0 600Z" fill="#4da64d" />
      <path d="M0 430 Q200 410 400 425 Q600 405 800 430 L800 600 L0 600Z" fill="#5cb85c" />

      {/* ── BRICK HOUSE — strong and proud ── */}
      <g transform="translate(400, 260)">
        {/* House base */}
        <rect x="-75" y="5" width="150" height="120" fill="#c0392b" stroke="#922b21" strokeWidth="2" />
        {/* Brick pattern */}
        {Array.from({ length: 8 }, (_, row) =>
          Array.from({ length: 6 }, (_, col) => {
            const offset = row % 2 === 0 ? 0 : 12;
            const x = -72 + col * 25 + offset;
            const y = 8 + row * 14;
            return <rect key={`${row}-${col}`} x={x} y={y} width="23" height="12" rx="1" fill="#c0392b" stroke="#a8a8a8" strokeWidth="0.5" opacity="0.7" />;
          })
        )}
        {/* Roof */}
        <path d="M-90 8 L0 -55 L90 8 Z" fill="#8b4513" stroke="#6b3410" strokeWidth="2" />
        <path d="M-85 6 L0 -50 L85 6 Z" fill="#a0522d" opacity="0.4" />
        {/* Chimney with smoke */}
        <rect x="35" y="-60" width="20" height="40" fill="#c0392b" stroke="#922b21" strokeWidth="1.5" />
        <rect x="32" y="-63" width="26" height="5" rx="1" fill="#922b21" />
        {/* Smoke puffs */}
        <g opacity="0.4">
          <ellipse cx="50" cy="-80" rx="8" ry="6" fill="#ddd">
            <animate attributeName="cy" values="-80;-100;-120" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0.2;0" dur="4s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="55" cy="-95" rx="10" ry="7" fill="#ccc">
            <animate attributeName="cy" values="-95;-115;-135" dur="4.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.35;0.15;0" dur="4.5s" repeatCount="indefinite" />
          </ellipse>
        </g>
        {/* Door */}
        <rect x="-12" y="68" width="24" height="57" rx="10" fill="#5d3a1a" stroke="#4a2e14" strokeWidth="2" />
        <circle cx="8" cy="98" r="2.5" fill="#d4a843" />
        {/* Left window */}
        <rect x="-58" y="30" width="30" height="28" rx="2" fill="#87ceeb" stroke="#4a2e14" strokeWidth="2" />
        <line x1="-43" y1="30" x2="-43" y2="58" stroke="#4a2e14" strokeWidth="1.5" />
        <line x1="-58" y1="44" x2="-28" y2="44" stroke="#4a2e14" strokeWidth="1.5" />
        {/* Right window */}
        <rect x="28" y="30" width="30" height="28" rx="2" fill="#87ceeb" stroke="#4a2e14" strokeWidth="2" />
        <line x1="43" y1="30" x2="43" y2="58" stroke="#4a2e14" strokeWidth="1.5" />
        <line x1="28" y1="44" x2="58" y2="44" stroke="#4a2e14" strokeWidth="1.5" />

        {/* Window box flowers */}
        {[-43, 43].map((wx, i) => (
          <g key={i}>
            <rect x={wx - 16} y="58" width="32" height="6" rx="2" fill="#8b5e3c" stroke="#6b4830" strokeWidth="0.8" />
            {[-8, 0, 8].map((fx, j) => (
              <g key={j} transform={`translate(${wx + fx}, 56)`}>
                <line x1="0" y1="0" x2="0" y2="-6" stroke="#3d8a40" strokeWidth="1" />
                <circle cx="0" cy="-7" r="2.5" fill={['#ff6b8a', '#ffd700', '#9b59b6'][j]} />
              </g>
            ))}
          </g>
        ))}

        {/* ── PIG in left window (cheeky face) ── */}
        <g transform="translate(-43, 38)">
          <ellipse cx="0" cy="0" rx="10" ry="9" fill="#f8b4be" />
          <ellipse cx="-3.5" cy="-2" rx="3" ry="3.5" fill="white" />
          <ellipse cx="3.5" cy="-2" rx="3" ry="3.5" fill="white" />
          <circle cx="-2.5" cy="-1.5" r="2" fill="#2c1810" />
          <circle cx="4.5" cy="-1.5" r="2" fill="#2c1810" />
          <circle cx="-2" cy="-2.5" r="0.8" fill="white" />
          <circle cx="5" cy="-2.5" r="0.8" fill="white" />
          <ellipse cx="0" cy="3" rx="5.5" ry="3.5" fill="#fcc4cc" stroke="#e8a0a8" strokeWidth="0.8" />
          <circle cx="-1.5" cy="3" r="1" fill="#e8a0a8" />
          <circle cx="1.5" cy="3" r="1" fill="#e8a0a8" />
          <path d="M-2 5.5 Q0 7 2 5.5" fill="none" stroke="#e8a0a8" strokeWidth="0.6" />
          <circle cx="-8" cy="1" r="2.5" fill="url(#ps8-cheek)" />
          <circle cx="8" cy="1" r="2.5" fill="url(#ps8-cheek)" />
          <path d="M-7 -7 Q-10 -14 -4 -11" fill="#fcc4cc" stroke="#e8a0a8" strokeWidth="0.8" />
          <path d="M7 -7 Q10 -14 4 -11" fill="#fcc4cc" stroke="#e8a0a8" strokeWidth="0.8" />
        </g>

        {/* ── PIG in right window ── */}
        <g transform="translate(43, 38)">
          <ellipse cx="0" cy="0" rx="10" ry="9" fill="#f8b4be" />
          <ellipse cx="-3.5" cy="-2" rx="3" ry="3.5" fill="white" />
          <ellipse cx="3.5" cy="-2" rx="3" ry="3.5" fill="white" />
          <circle cx="-2.5" cy="-1.5" r="2" fill="#2c1810" />
          <circle cx="4.5" cy="-1.5" r="2" fill="#2c1810" />
          <circle cx="-2" cy="-2.5" r="0.8" fill="white" />
          <circle cx="5" cy="-2.5" r="0.8" fill="white" />
          <ellipse cx="0" cy="3" rx="5.5" ry="3.5" fill="#fcc4cc" stroke="#e8a0a8" strokeWidth="0.8" />
          <circle cx="-1.5" cy="3" r="1" fill="#e8a0a8" />
          <circle cx="1.5" cy="3" r="1" fill="#e8a0a8" />
          <path d="M-2 5.5 Q0 7 2 5.5" fill="none" stroke="#e8a0a8" strokeWidth="0.6" />
          <circle cx="-8" cy="1" r="2.5" fill="url(#ps8-cheek)" />
          <circle cx="8" cy="1" r="2.5" fill="url(#ps8-cheek)" />
          <path d="M-7 -7 Q-10 -14 -4 -11" fill="#fcc4cc" stroke="#e8a0a8" strokeWidth="0.8" />
          <path d="M7 -7 Q10 -14 4 -11" fill="#fcc4cc" stroke="#e8a0a8" strokeWidth="0.8" />
        </g>

        {/* ── PIG peeking above door ── */}
        <g transform="translate(0, 58)">
          <ellipse cx="0" cy="0" rx="9" ry="8" fill="#f8b4be" />
          <ellipse cx="-3" cy="-2" rx="2.8" ry="3.2" fill="white" />
          <ellipse cx="3" cy="-2" rx="2.8" ry="3.2" fill="white" />
          <circle cx="-2" cy="-1.5" r="1.8" fill="#2c1810" />
          <circle cx="4" cy="-1.5" r="1.8" fill="#2c1810" />
          <circle cx="-1.5" cy="-2.5" r="0.7" fill="white" />
          <circle cx="4.5" cy="-2.5" r="0.7" fill="white" />
          <ellipse cx="0" cy="2.5" rx="5" ry="3.2" fill="#fcc4cc" stroke="#e8a0a8" strokeWidth="0.8" />
          <circle cx="-1.5" cy="2.5" r="1" fill="#e8a0a8" />
          <circle cx="1.5" cy="2.5" r="1" fill="#e8a0a8" />
          <path d="M-1 5 Q0 7.5 1 5" fill="#e8787a" stroke="#d06060" strokeWidth="0.5" />
          <circle cx="-7" cy="0.5" r="2.2" fill="url(#ps8-cheek)" />
          <circle cx="7" cy="0.5" r="2.2" fill="url(#ps8-cheek)" />
          <path d="M-6 -6 Q-8 -12 -3 -9" fill="#fcc4cc" stroke="#e8a0a8" strokeWidth="0.8" />
          <path d="M6 -6 Q8 -12 3 -9" fill="#fcc4cc" stroke="#e8a0a8" strokeWidth="0.8" />
        </g>
      </g>

      {/* ── WOLF outside, frustrated ── */}
      <g transform="translate(620, 380)">
        {/* Tail droopy */}
        <path d="M22 10 Q42 0 45 -10 Q48 -20 38 -15 Q32 -10 28 0" fill="#6b7280" stroke="#4b5563" strokeWidth="1" />
        {/* Body */}
        <ellipse cx="0" cy="0" rx="28" ry="22" fill="url(#ps8-wolfBody)" stroke="#4b5563" strokeWidth="1.5" />
        <ellipse cx="2" cy="4" rx="14" ry="10" fill="#9ca3af" opacity="0.3" />
        {/* Arms crossed */}
        <path d="M-20 -6 Q-10 6 8 -4" fill="none" stroke="#6b7280" strokeWidth="8" strokeLinecap="round" />
        <path d="M20 -6 Q10 6 -8 -4" fill="none" stroke="#7b8694" strokeWidth="8" strokeLinecap="round" />
        <ellipse cx="-22" cy="-6" rx="5" ry="4" fill="#4b5563" />
        <ellipse cx="22" cy="-6" rx="5" ry="4" fill="#4b5563" />
        {/* Legs */}
        <rect x="-16" y="18" width="9" height="18" rx="4" fill="#6b7280" stroke="#4b5563" strokeWidth="1" />
        <rect x="8" y="18" width="9" height="18" rx="4" fill="#6b7280" stroke="#4b5563" strokeWidth="1" />
        <ellipse cx="-11.5" cy="38" rx="6" ry="3.5" fill="#4b5563" />
        <ellipse cx="12.5" cy="38" rx="6" ry="3.5" fill="#4b5563" />
        {/* Head grumpy */}
        <ellipse cx="-4" cy="-20" rx="18" ry="16" fill="#6b7280" stroke="#4b5563" strokeWidth="1.5" />
        <ellipse cx="-2" cy="-16" rx="10" ry="8" fill="#9ca3af" opacity="0.3" />
        {/* Ears */}
        <path d="M-16 -34 Q-20 -52 -12 -44" fill="#6b7280" stroke="#4b5563" strokeWidth="1" />
        <path d="M4 -34 Q2 -52 10 -44" fill="#6b7280" stroke="#4b5563" strokeWidth="1" />
        {/* Snout */}
        <ellipse cx="-14" cy="-14" rx="11" ry="7" fill="#7b8694" stroke="#4b5563" strokeWidth="1" />
        <ellipse cx="-22" cy="-16" rx="3.5" ry="2.5" fill="#2c2c2c" />
        {/* Half-lidded grumpy eyes */}
        <ellipse cx="-10" cy="-24" rx="5" ry="4" fill="white" />
        <ellipse cx="4" cy="-24" rx="4.5" ry="3.5" fill="white" />
        <circle cx="-9" cy="-23" r="2.5" fill="#d4a017" />
        <circle cx="5" cy="-23" r="2.3" fill="#d4a017" />
        <circle cx="-9" cy="-23" r="1.3" fill="#2c1810" />
        <circle cx="5" cy="-23" r="1.2" fill="#2c1810" />
        <path d="M-16 -26 Q-10 -24 -5 -26" fill="#6b7280" opacity="0.6" />
        <path d="M0 -26 Q4 -24 9 -26" fill="#6b7280" opacity="0.6" />
        {/* Frown */}
        <path d="M-20 -10 Q-14 -7 -8 -10" fill="none" stroke="#4b5563" strokeWidth="1.2" />
      </g>

      {/* Garden flowers */}
      {[
        [280, 430, '#ff6b8a'], [300, 435, '#ffd700'], [500, 428, '#9b59b6'],
        [520, 433, '#ff6b8a'], [540, 427, '#ffd700'],
      ].map(([x, y, c], i) => (
        <g key={i} transform={`translate(${x}, ${y})`}>
          <line x1="0" y1="0" x2="0" y2="12" stroke="#3d8a40" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="3.5" fill={c} />
          <circle cx="0" cy="0" r="1.5" fill="#fff4a0" />
        </g>
      ))}

      {/* Foreground */}
      <path d="M0 580 Q200 565 400 575 Q600 562 800 578 L800 600 L0 600Z" fill="#3d8a40" />
    </svg>
  );
}

/* ───────────────────────────────────────────
   SCENE 9 — The wolf huffs and puffs but can't blow it down
   ─────────────────────────────────────────── */
export function PigScene9({ className = '' }) {
  return (
    <svg viewBox="0 0 800 600" className={`absolute inset-0 w-full h-full ${className}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="ps9-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5b9fd4" />
          <stop offset="100%" stopColor="#8ec4e8" />
        </linearGradient>
        <linearGradient id="ps9-wolfBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7b8694" />
          <stop offset="100%" stopColor="#6b7280" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="800" height="600" fill="url(#ps9-sky)" />

      {/* Sun */}
      <circle cx="700" cy="80" r="45" fill="#ffe44d" />

      {/* Clouds */}
      <g opacity="0.8">
        <ellipse cx="200" cy="70" rx="50" ry="20" fill="white" />
        <ellipse cx="175" cy="65" rx="32" ry="16" fill="white" />
        <ellipse cx="230" cy="65" rx="28" ry="14" fill="white" />
      </g>

      {/* Hills */}
      <path d="M0 390 Q200 350 400 380 Q600 345 800 385 L800 600 L0 600Z" fill="#4da64d" />
      <path d="M0 440 Q200 420 400 435 Q600 415 800 440 L800 600 L0 600Z" fill="#5cb85c" />

      {/* ── BRICK HOUSE — solid as rock ── */}
      <g transform="translate(500, 270)">
        {/* House */}
        <rect x="-70" y="5" width="140" height="110" fill="#c0392b" stroke="#922b21" strokeWidth="2" />
        {Array.from({ length: 7 }, (_, row) =>
          Array.from({ length: 5 }, (_, col) => {
            const offset = row % 2 === 0 ? 0 : 14;
            const x = -67 + col * 28 + offset;
            const y = 8 + row * 15;
            return <rect key={`${row}-${col}`} x={x} y={y} width="26" height="13" rx="1" fill="#c0392b" stroke="#a8a8a8" strokeWidth="0.5" opacity="0.7" />;
          })
        )}
        {/* Roof */}
        <path d="M-85 8 L0 -50 L85 8 Z" fill="#8b4513" stroke="#6b3410" strokeWidth="2" />
        {/* Chimney */}
        <rect x="32" y="-55" width="18" height="35" fill="#c0392b" stroke="#922b21" strokeWidth="1.5" />
        <rect x="29" y="-58" width="24" height="5" rx="1" fill="#922b21" />
        {/* Door */}
        <rect x="-10" y="62" width="20" height="53" rx="8" fill="#5d3a1a" stroke="#4a2e14" strokeWidth="2" />
        <circle cx="6" cy="90" r="2" fill="#d4a843" />
        {/* Windows */}
        <rect x="-54" y="28" width="26" height="24" rx="2" fill="#87ceeb" stroke="#4a2e14" strokeWidth="2" />
        <rect x="28" y="28" width="26" height="24" rx="2" fill="#87ceeb" stroke="#4a2e14" strokeWidth="2" />
        {/* Solid-looking extra details */}
        <rect x="-72" y="112" width="144" height="6" fill="#922b21" />
      </g>

      {/* ── EXHAUSTED WOLF ── */}
      <g transform="translate(240, 380)">
        {/* Tail — limp */}
        <path d="M-28 10 Q-48 5 -50 -5 Q-52 -12 -44 -8 Q-38 -4 -35 2" fill="#6b7280" stroke="#4b5563" strokeWidth="1" />
        {/* Body — hunched, exhausted */}
        <ellipse cx="0" cy="5" rx="32" ry="24" fill="url(#ps9-wolfBody)" stroke="#4b5563" strokeWidth="1.5" />
        <ellipse cx="3" cy="10" rx="16" ry="11" fill="#9ca3af" opacity="0.3" />
        {/* Legs — wobbly, splayed */}
        <rect x="-22" y="24" width="10" height="20" rx="4" fill="#6b7280" stroke="#4b5563" strokeWidth="1" transform="rotate(-8 -17 34)" />
        <rect x="14" y="24" width="10" height="20" rx="4" fill="#6b7280" stroke="#4b5563" strokeWidth="1" transform="rotate(8 19 34)" />
        <ellipse cx="-17" cy="46" rx="7" ry="3.5" fill="#4b5563" />
        <ellipse cx="19" cy="46" rx="7" ry="3.5" fill="#4b5563" />
        {/* Arms hanging limp */}
        <path d="M-24 0 Q-32 12 -28 20" fill="none" stroke="#6b7280" strokeWidth="7" strokeLinecap="round" />
        <path d="M24 0 Q32 12 28 20" fill="none" stroke="#7b8694" strokeWidth="7" strokeLinecap="round" />
        <ellipse cx="-28" cy="22" rx="5" ry="4" fill="#4b5563" />
        <ellipse cx="28" cy="22" rx="5" ry="4" fill="#4b5563" />
        {/* Head — dizzy, red-faced */}
        <ellipse cx="4" cy="-16" rx="22" ry="18" fill="#6b7280" stroke="#4b5563" strokeWidth="1.5" />
        {/* Red face from effort */}
        <ellipse cx="6" cy="-12" rx="14" ry="12" fill="#e8787a" opacity="0.2" />
        <ellipse cx="8" cy="-10" rx="10" ry="8" fill="#9ca3af" opacity="0.2" />
        {/* Ears — droopy */}
        <path d="M-12 -32 Q-18 -48 -8 -42 Q-4 -38 -8 -32" fill="#6b7280" stroke="#4b5563" strokeWidth="1" />
        <path d="M16 -32 Q14 -50 22 -42 Q26 -36 20 -32" fill="#6b7280" stroke="#4b5563" strokeWidth="1" />
        {/* Snout — tongue hanging out */}
        <ellipse cx="20" cy="-10" rx="12" ry="8" fill="#7b8694" stroke="#4b5563" strokeWidth="1" />
        <ellipse cx="30" cy="-12" rx="4" ry="2.8" fill="#2c2c2c" />
        {/* Mouth open, panting */}
        <path d="M16 -5 Q22 2 28 -3" fill="#4b1a1a" />
        {/* Tongue hanging out */}
        <path d="M20 -2 Q22 8 26 10 Q28 8 26 2" fill="#e8787a" stroke="#d06060" strokeWidth="0.8" />
        {/* Dizzy eyes — spirals! */}
        <ellipse cx="-2" cy="-22" rx="6" ry="6.5" fill="white" />
        <ellipse cx="14" cy="-22" rx="5.5" ry="6" fill="white" />
        {/* Spiral in eyes */}
        <path d="M-2 -22 Q0 -25 2 -22 Q0 -19 -3 -21 Q-1 -26 3 -23 Q1 -18 -4 -20" fill="none" stroke="#d4a017" strokeWidth="0.8" />
        <path d="M14 -22 Q16 -25 18 -22 Q16 -19 13 -21 Q15 -26 19 -23 Q17 -18 12 -20" fill="none" stroke="#d4a017" strokeWidth="0.8" />

        {/* Stars circling dizzy head */}
        {[0, 72, 144, 216, 288].map((angle, i) => {
          const r = 30;
          const cx = 4 + r * Math.cos((angle * Math.PI) / 180);
          const cy = -35 + r * Math.sin((angle * Math.PI) / 180) * 0.4;
          return (
            <g key={i} transform={`translate(${cx}, ${cy})`}>
              <path d="M0 -4 L1.2 -1.2 L4 0 L1.2 1.2 L0 4 L-1.2 1.2 L-4 0 L-1.2 -1.2 Z" fill="#ffd700" opacity="0.8">
                <animateTransform attributeName="transform" type="rotate" values="0;360" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
              </path>
            </g>
          );
        })}

        {/* Steam from ears */}
        <g>
          <path d="M-16 -38 Q-22 -48 -18 -52 Q-14 -56 -20 -60" fill="none" stroke="#ddd" strokeWidth="2" strokeLinecap="round" opacity="0.5">
            <animate attributeName="opacity" values="0.5;0.2;0.5" dur="1.5s" repeatCount="indefinite" />
          </path>
          <path d="M24 -38 Q30 -48 26 -52 Q22 -56 28 -60" fill="none" stroke="#ddd" strokeWidth="2" strokeLinecap="round" opacity="0.5">
            <animate attributeName="opacity" values="0.5;0.2;0.5" dur="1.8s" repeatCount="indefinite" />
          </path>
        </g>

        {/* Red face effect */}
        <circle cx="-8" cy="-14" r="5" fill="#e8787a" opacity="0.3" />
        <circle cx="20" cy="-14" r="5" fill="#e8787a" opacity="0.3" />
      </g>

      {/* Cracks in the GROUND around the wolf (from effort!) */}
      {[
        'M180 430 L170 445 L165 460',
        'M195 435 L200 450 L195 465',
        'M300 430 L310 445 L315 458',
        'M280 438 L285 455',
        'M210 440 Q215 455 208 465',
      ].map((d, i) => (
        <path key={i} d={d} fill="none" stroke="#3d6a20" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
      ))}

      {/* Small dust/debris around wolf's feet */}
      {[[200, 430], [210, 435], [270, 432], [280, 438]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={1.5 + i * 0.3} fill="#b8923a" opacity="0.3" />
      ))}

      {/* Foreground */}
      <path d="M0 578 Q200 565 400 572 Q600 560 800 575 L800 600 L0 600Z" fill="#3d8a40" />
    </svg>
  );
}

/* ───────────────────────────────────────────
   SCENE 10 — Happily ever after
   ─────────────────────────────────────────── */
export function PigScene10({ className = '' }) {
  return (
    <svg viewBox="0 0 800 600" className={`absolute inset-0 w-full h-full ${className}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="ps10-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a8fd4" />
          <stop offset="60%" stopColor="#6db8e8" />
          <stop offset="100%" stopColor="#a8d8f0" />
        </linearGradient>
        <linearGradient id="ps10-pigBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fcc4cc" />
          <stop offset="100%" stopColor="#f8b4be" />
        </linearGradient>
        <radialGradient id="ps10-cheek" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ff9999" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ff9999" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ps10-rainbow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e74c3c" stopOpacity="0.5" />
          <stop offset="16%" stopColor="#e67e22" stopOpacity="0.5" />
          <stop offset="33%" stopColor="#f1c40f" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#2ecc71" stopOpacity="0.5" />
          <stop offset="66%" stopColor="#3498db" stopOpacity="0.5" />
          <stop offset="83%" stopColor="#2980b9" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#8e44ad" stopOpacity="0.5" />
        </linearGradient>
        <radialGradient id="ps10-sun" cx="0.4" cy="0.4" r="0.5">
          <stop offset="0%" stopColor="#fff8a0" />
          <stop offset="60%" stopColor="#ffe44d" />
          <stop offset="100%" stopColor="#ffc800" />
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect width="800" height="600" fill="url(#ps10-sky)" />

      {/* Big warm sun */}
      <circle cx="650" cy="90" r="55" fill="url(#ps10-sun)" />
      <g stroke="#ffe44d" strokeWidth="3" opacity="0.6" strokeLinecap="round">
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a, i) => (
          <line key={i} x1={650 + Math.cos(a * Math.PI / 180) * 62} y1={90 + Math.sin(a * Math.PI / 180) * 62} x2={650 + Math.cos(a * Math.PI / 180) * 78} y2={90 + Math.sin(a * Math.PI / 180) * 78} />
        ))}
      </g>

      {/* Rainbow */}
      <path d="M50 400 Q200 100 500 100 Q750 100 780 350" fill="none" stroke="url(#ps10-rainbow)" strokeWidth="30" opacity="0.5" />
      <path d="M60 400 Q210 120 500 120 Q740 120 770 350" fill="none" stroke="url(#ps10-rainbow)" strokeWidth="14" opacity="0.3" />

      {/* Fluffy clouds */}
      <g opacity="0.85">
        <ellipse cx="150" cy="70" rx="55" ry="22" fill="white" />
        <ellipse cx="120" cy="65" rx="35" ry="18" fill="white" />
        <ellipse cx="180" cy="64" rx="30" ry="16" fill="white" />
      </g>
      <g opacity="0.7">
        <ellipse cx="420" cy="55" rx="48" ry="19" fill="white" />
        <ellipse cx="400" cy="50" rx="30" ry="15" fill="white" />
        <ellipse cx="450" cy="50" rx="26" ry="13" fill="white" />
      </g>

      {/* Hills */}
      <path d="M0 370 Q200 320 400 355 Q600 320 800 360 L800 600 L0 600Z" fill="#4da64d" />
      <path d="M0 420 Q200 395 400 415 Q600 390 800 420 L800 600 L0 600Z" fill="#5cb85c" />

      {/* ── BRICK HOUSE in background ── */}
      <g transform="translate(550, 280)">
        <rect x="-55" y="5" width="110" height="90" fill="#c0392b" stroke="#922b21" strokeWidth="1.5" />
        {Array.from({ length: 6 }, (_, row) =>
          Array.from({ length: 4 }, (_, col) => {
            const offset = row % 2 === 0 ? 0 : 14;
            const x = -52 + col * 27 + offset;
            const y = 8 + row * 14;
            return <rect key={`${row}-${col}`} x={x} y={y} width="25" height="12" rx="1" fill="#c0392b" stroke="#a8a8a8" strokeWidth="0.4" opacity="0.6" />;
          })
        )}
        <path d="M-68 8 L0 -40 L68 8 Z" fill="#8b4513" stroke="#6b3410" strokeWidth="1.5" />
        <rect x="28" y="-45" width="16" height="30" fill="#c0392b" stroke="#922b21" strokeWidth="1" />
        <rect x="25" y="-48" width="22" height="4" rx="1" fill="#922b21" />
        {/* Smoke */}
        <ellipse cx="40" cy="-60" rx="7" ry="5" fill="#ddd" opacity="0.3">
          <animate attributeName="cy" values="-60;-80;-100" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0.1;0" dur="4s" repeatCount="indefinite" />
        </ellipse>
        <rect x="-8" y="50" width="16" height="45" rx="7" fill="#5d3a1a" stroke="#4a2e14" strokeWidth="1.5" />
        <circle cx="4" cy="74" r="1.8" fill="#d4a843" />
        <rect x="-44" y="28" width="22" height="20" rx="2" fill="#87ceeb" stroke="#4a2e14" strokeWidth="1.5" />
        <rect x="22" y="28" width="22" height="20" rx="2" fill="#87ceeb" stroke="#4a2e14" strokeWidth="1.5" />
      </g>

      {/* ── Garden flowers in bloom ── */}
      {[
        [80, 440, '#ff6b8a', 5], [110, 445, '#ffd700', 4], [140, 438, '#9b59b6', 5],
        [170, 442, '#ff6b8a', 3], [200, 436, '#ffd700', 5], [230, 444, '#e74c3c', 4],
        [460, 435, '#ff6b8a', 5], [490, 440, '#ffd700', 4], [520, 432, '#9b59b6', 4],
        [620, 430, '#ff6b8a', 5], [650, 436, '#ffd700', 3], [680, 428, '#9b59b6', 5],
        [710, 434, '#ff6b8a', 4], [740, 438, '#ffd700', 4],
      ].map(([x, y, c, r], i) => (
        <g key={i} transform={`translate(${x}, ${y})`}>
          <line x1="0" y1="0" x2="0" y2={10 + r} stroke="#3d8a40" strokeWidth="1.5" />
          {r > 4 ? (
            <g>
              {[0, 72, 144, 216, 288].map((a, j) => (
                <ellipse key={j} cx={Math.cos(a * Math.PI / 180) * 3} cy={Math.sin(a * Math.PI / 180) * 3} rx="2.5" ry="3.5" fill={c} opacity="0.8" transform={`rotate(${a} 0 0)`} />
              ))}
              <circle cx="0" cy="0" r="2" fill="#fff4a0" />
            </g>
          ) : (
            <g>
              <circle cx="0" cy="0" r={r} fill={c} />
              <circle cx="0" cy="0" r={r * 0.4} fill="#fff4a0" />
            </g>
          )}
        </g>
      ))}

      {/* ── PIG 1 — dancing, left ── */}
      <g transform="translate(290, 390)">
        {/* Body */}
        <ellipse cx="0" cy="-8" rx="22" ry="20" fill="url(#ps10-pigBody)" stroke="#e8a0a8" strokeWidth="1.5" />
        <ellipse cx="-2" cy="-4" rx="12" ry="10" fill="#fcc4cc" opacity="0.5" />
        {/* Arms up celebrating */}
        <path d="M-16 -16 Q-28 -36 -20 -44" fill="none" stroke="#f8b4be" strokeWidth="7" strokeLinecap="round" />
        <ellipse cx="-20" cy="-46" rx="5" ry="4" fill="#e8a0a8" />
        <path d="M16 -16 Q28 -36 20 -44" fill="none" stroke="#f8b4be" strokeWidth="7" strokeLinecap="round" />
        <ellipse cx="20" cy="-46" rx="5" ry="4" fill="#e8a0a8" />
        {/* Legs — one up, dancing */}
        <rect x="-12" y="8" width="7" height="15" rx="3.5" fill="#f8b4be" stroke="#e8a0a8" strokeWidth="1" />
        <rect x="6" y="6" width="7" height="15" rx="3.5" fill="#f8b4be" stroke="#e8a0a8" strokeWidth="1" transform="rotate(-20 9 14)" />
        <ellipse cx="-8.5" cy="24" rx="5" ry="3" fill="#e8a0a8" />
        <ellipse cx="12" cy="20" rx="5" ry="3" fill="#e8a0a8" transform="rotate(-20 12 20)" />
        {/* Head */}
        <ellipse cx="0" cy="-32" rx="17" ry="15" fill="#f8b4be" stroke="#e8a0a8" strokeWidth="1.5" />
        {/* Ears */}
        <path d="M-11 -45 Q-15 -58 -5 -51" fill="#fcc4cc" stroke="#e8a0a8" strokeWidth="1" />
        <path d="M11 -45 Q15 -58 5 -51" fill="#fcc4cc" stroke="#e8a0a8" strokeWidth="1" />
        <path d="M-10 -47 Q-12 -53 -6 -50" fill="#f2949e" opacity="0.5" />
        <path d="M10 -47 Q12 -53 6 -50" fill="#f2949e" opacity="0.5" />
        {/* Happy eyes — slightly closed with joy */}
        <path d="M-9 -35 Q-6 -32 -3 -35" fill="none" stroke="#2c1810" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M3 -35 Q6 -32 9 -35" fill="none" stroke="#2c1810" strokeWidth="1.8" strokeLinecap="round" />
        {/* Snout */}
        <ellipse cx="0" cy="-27" rx="8.5" ry="5.5" fill="#fcc4cc" stroke="#e8a0a8" strokeWidth="1" />
        <circle cx="-2.5" cy="-27" r="1.5" fill="#e8a0a8" />
        <circle cx="2.5" cy="-27" r="1.5" fill="#e8a0a8" />
        {/* Big happy smile */}
        <path d="M-6 -22 Q0 -17 6 -22" fill="none" stroke="#e8a0a8" strokeWidth="1.2" />
        {/* Cheeks */}
        <circle cx="-13" cy="-30" r="4.5" fill="url(#ps10-cheek)" />
        <circle cx="13" cy="-30" r="4.5" fill="url(#ps10-cheek)" />
        {/* Curly tail */}
        <path d="M18 -6 Q28 -10 26 -2 Q24 6 30 2" fill="none" stroke="#f8b4be" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* ── PIG 2 — dancing, centre ── */}
      <g transform="translate(370, 385)">
        {/* Body */}
        <ellipse cx="0" cy="-10" rx="24" ry="22" fill="url(#ps10-pigBody)" stroke="#e8a0a8" strokeWidth="1.5" />
        <ellipse cx="-2" cy="-6" rx="14" ry="12" fill="#fcc4cc" opacity="0.5" />
        {/* Arms — one up, one out */}
        <path d="M-18 -18 Q-30 -40 -22 -48" fill="none" stroke="#f8b4be" strokeWidth="7" strokeLinecap="round" />
        <ellipse cx="-22" cy="-50" rx="5" ry="4" fill="#e8a0a8" />
        <path d="M18 -18 Q34 -20 38 -14" fill="none" stroke="#f8b4be" strokeWidth="7" strokeLinecap="round" />
        <ellipse cx="40" cy="-14" rx="5" ry="4" fill="#e8a0a8" />
        {/* Legs — both up (jumping!) */}
        <rect x="-14" y="6" width="8" height="16" rx="4" fill="#f8b4be" stroke="#e8a0a8" strokeWidth="1" transform="rotate(15 -10 14)" />
        <rect x="6" y="6" width="8" height="16" rx="4" fill="#f8b4be" stroke="#e8a0a8" strokeWidth="1" transform="rotate(-15 10 14)" />
        <ellipse cx="-14" cy="22" rx="5.5" ry="3" fill="#e8a0a8" />
        <ellipse cx="14" cy="22" rx="5.5" ry="3" fill="#e8a0a8" />
        {/* Head */}
        <ellipse cx="0" cy="-36" rx="18" ry="16" fill="#f8b4be" stroke="#e8a0a8" strokeWidth="1.5" />
        {/* Ears */}
        <path d="M-12 -50 Q-16 -64 -6 -56" fill="#fcc4cc" stroke="#e8a0a8" strokeWidth="1" />
        <path d="M12 -50 Q16 -64 6 -56" fill="#fcc4cc" stroke="#e8a0a8" strokeWidth="1" />
        <path d="M-11 -52 Q-13 -58 -7 -55" fill="#f2949e" opacity="0.5" />
        <path d="M11 -52 Q13 -58 7 -55" fill="#f2949e" opacity="0.5" />
        {/* Big open happy eyes */}
        <ellipse cx="-6" cy="-39" rx="5" ry="5.5" fill="white" />
        <ellipse cx="6" cy="-39" rx="5" ry="5.5" fill="white" />
        <circle cx="-5" cy="-38" r="3" fill="#2c1810" />
        <circle cx="7" cy="-38" r="3" fill="#2c1810" />
        <circle cx="-4" cy="-39.5" r="1.2" fill="white" />
        <circle cx="8" cy="-39.5" r="1.2" fill="white" />
        {/* Snout */}
        <ellipse cx="0" cy="-30" rx="9" ry="6" fill="#fcc4cc" stroke="#e8a0a8" strokeWidth="1" />
        <circle cx="-3" cy="-30" r="1.5" fill="#e8a0a8" />
        <circle cx="3" cy="-30" r="1.5" fill="#e8a0a8" />
        {/* Huge smile */}
        <path d="M-7 -25 Q0 -18 7 -25" fill="#e85858" opacity="0.4" />
        <path d="M-7 -25 Q0 -19 7 -25" fill="none" stroke="#e8a0a8" strokeWidth="1.2" />
        {/* Cheeks */}
        <circle cx="-14" cy="-34" r="5" fill="url(#ps10-cheek)" />
        <circle cx="14" cy="-34" r="5" fill="url(#ps10-cheek)" />
        {/* Curly tail */}
        <path d="M-20 -8 Q-30 -12 -28 -4 Q-26 4 -32 0" fill="none" stroke="#f8b4be" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* ── PIG 3 — dancing, right ── */}
      <g transform="translate(440, 392)">
        {/* Body */}
        <ellipse cx="0" cy="-8" rx="20" ry="18" fill="url(#ps10-pigBody)" stroke="#e8a0a8" strokeWidth="1.5" />
        <ellipse cx="-2" cy="-4" rx="11" ry="9" fill="#fcc4cc" opacity="0.5" />
        {/* Arms celebrating */}
        <path d="M-14 -14 Q-24 -32 -18 -40" fill="none" stroke="#f8b4be" strokeWidth="6" strokeLinecap="round" />
        <ellipse cx="-18" cy="-42" rx="4.5" ry="3.5" fill="#e8a0a8" />
        <path d="M14 -14 Q24 -32 18 -40" fill="none" stroke="#f8b4be" strokeWidth="6" strokeLinecap="round" />
        <ellipse cx="18" cy="-42" rx="4.5" ry="3.5" fill="#e8a0a8" />
        {/* Legs — one up */}
        <rect x="-10" y="6" width="6.5" height="14" rx="3" fill="#f8b4be" stroke="#e8a0a8" strokeWidth="1" />
        <rect x="4" y="4" width="6.5" height="14" rx="3" fill="#f8b4be" stroke="#e8a0a8" strokeWidth="1" transform="rotate(20 7 11)" />
        <ellipse cx="-6.5" cy="21" rx="4.5" ry="2.5" fill="#e8a0a8" />
        <ellipse cx="11" cy="17" rx="4.5" ry="2.5" fill="#e8a0a8" />
        {/* Head */}
        <ellipse cx="0" cy="-28" rx="15" ry="13.5" fill="#f8b4be" stroke="#e8a0a8" strokeWidth="1.5" />
        {/* Ears */}
        <path d="M-10 -39 Q-14 -52 -4 -45" fill="#fcc4cc" stroke="#e8a0a8" strokeWidth="1" />
        <path d="M10 -39 Q14 -52 4 -45" fill="#fcc4cc" stroke="#e8a0a8" strokeWidth="1" />
        {/* Joy eyes — closed arcs */}
        <path d="M-8 -31 Q-5 -28 -2 -31" fill="none" stroke="#2c1810" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M2 -31 Q5 -28 8 -31" fill="none" stroke="#2c1810" strokeWidth="1.6" strokeLinecap="round" />
        {/* Snout */}
        <ellipse cx="0" cy="-23" rx="7.5" ry="5" fill="#fcc4cc" stroke="#e8a0a8" strokeWidth="1" />
        <circle cx="-2" cy="-23" r="1.3" fill="#e8a0a8" />
        <circle cx="2" cy="-23" r="1.3" fill="#e8a0a8" />
        {/* Smile */}
        <path d="M-5 -19 Q0 -15 5 -19" fill="none" stroke="#e8a0a8" strokeWidth="1" />
        {/* Cheeks */}
        <circle cx="-11" cy="-26" r="3.5" fill="url(#ps10-cheek)" />
        <circle cx="11" cy="-26" r="3.5" fill="url(#ps10-cheek)" />
        {/* Curly tail */}
        <path d="M16 -6 Q26 -10 24 -2 Q22 6 28 2" fill="none" stroke="#f8b4be" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* ── Floating hearts ── */}
      {[
        [310, 310, 8], [360, 290, 10], [420, 300, 7], [380, 340, 6],
        [260, 340, 7], [450, 330, 8],
      ].map(([x, y, s], i) => (
        <path key={i} d={`M${x} ${y} Q${x - s} ${y - s * 1.5} ${x} ${y - s * 0.8} Q${x + s} ${y - s * 1.5} ${x} ${y}`} fill="#ff6b8a" opacity={0.4 + i * 0.05}>
          <animate attributeName="opacity" values={`${0.4 + i * 0.05};${0.2};${0.4 + i * 0.05}`} dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
          <animateTransform attributeName="transform" type="translate" values="0 0;0 -8;0 0" dur={`${2.5 + i * 0.2}s`} repeatCount="indefinite" />
        </path>
      ))}

      {/* ── Floating stars ── */}
      {[
        [280, 280], [340, 260], [400, 270], [460, 280], [320, 320], [440, 310],
      ].map(([x, y], i) => (
        <path key={i} d={`M${x} ${y - 4} L${x + 1.5} ${y - 1} L${x + 4.5} ${y} L${x + 2} ${y + 1.5} L${x + 3} ${y + 4.5} L${x} ${y + 2.5} L${x - 3} ${y + 4.5} L${x - 2} ${y + 1.5} L${x - 4.5} ${y} L${x - 1.5} ${y - 1} Z`} fill="#ffd700" opacity="0.6">
          <animate attributeName="opacity" values="0.6;0.3;0.6" dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" />
        </path>
      ))}

      {/* ── Confetti ── */}
      {[
        [250, 350, '#e74c3c'], [280, 330, '#3498db'], [310, 355, '#f1c40f'],
        [350, 320, '#2ecc71'], [390, 345, '#e74c3c'], [410, 325, '#9b59b6'],
        [440, 350, '#3498db'], [460, 335, '#f1c40f'], [320, 360, '#e74c3c'],
        [380, 360, '#2ecc71'], [430, 360, '#9b59b6'],
      ].map(([x, y, c], i) => (
        <rect key={i} x={x} y={y} width={4} height={2} rx="0.5" fill={c} opacity="0.7" transform={`rotate(${i * 30} ${x + 2} ${y + 1})`}>
          <animateTransform attributeName="transform" type="translate" values="0 0;0 5;0 10" dur={`${2 + i * 0.15}s`} repeatCount="indefinite" additive="sum" />
          <animateTransform attributeName="transform" type="rotate" values={`${i * 30};${i * 30 + 180};${i * 30 + 360}`} dur={`${1.5 + i * 0.1}s`} repeatCount="indefinite" additive="sum" />
        </rect>
      ))}

      {/* ── Tiny wolf walking away in background ── */}
      <g transform="translate(80, 400) scale(0.35)">
        {/* Tiny body */}
        <ellipse cx="0" cy="0" rx="22" ry="16" fill="#6b7280" stroke="#4b5563" strokeWidth="1" />
        {/* Tiny head — looking down/dejected */}
        <ellipse cx="-16" cy="-6" rx="12" ry="10" fill="#6b7280" stroke="#4b5563" strokeWidth="1" />
        {/* Tiny droopy ears */}
        <path d="M-22 -14 Q-26 -22 -20 -18" fill="#6b7280" stroke="#4b5563" strokeWidth="0.8" />
        <path d="M-12 -14 Q-10 -24 -8 -18" fill="#6b7280" stroke="#4b5563" strokeWidth="0.8" />
        {/* Tiny tail drooping */}
        <path d="M18 2 Q28 6 26 10" fill="none" stroke="#6b7280" strokeWidth="3" strokeLinecap="round" />
        {/* Tiny legs walking */}
        <line x1="-8" y1="14" x2="-10" y2="24" stroke="#4b5563" strokeWidth="3" strokeLinecap="round" />
        <line x1="8" y1="14" x2="6" y2="24" stroke="#4b5563" strokeWidth="3" strokeLinecap="round" />
        {/* Sad posture lines */}
        <path d="M-26 -8 L-30 -6" stroke="#4b5563" strokeWidth="1" opacity="0.5" />
      </g>

      {/* Butterflies celebrating */}
      <g transform="translate(250, 360)">
        <path d="M0 0 Q-8 -10 -5 -16 Q-2 -20 0 -14 Q2 -20 5 -16 Q8 -10 0 0Z" fill="#ff6b8a" opacity="0.7">
          <animateTransform attributeName="transform" type="rotate" values="-10 0 -8;10 0 -8;-10 0 -8" dur="1.2s" repeatCount="indefinite" />
        </path>
      </g>
      <g transform="translate(460, 340)">
        <path d="M0 0 Q-7 -8 -4 -13 Q-1 -16 0 -11 Q1 -16 4 -13 Q7 -8 0 0Z" fill="#9b59b6" opacity="0.7">
          <animateTransform attributeName="transform" type="rotate" values="10 0 -6;-10 0 -6;10 0 -6" dur="1.4s" repeatCount="indefinite" />
        </path>
      </g>

      {/* Foreground lush grass */}
      <path d="M0 575 Q200 560 400 570 Q600 556 800 572 L800 600 L0 600Z" fill="#3d8a40" />

      {/* Extra foreground flowers */}
      {[[50, 578], [150, 575], [350, 572], [550, 570], [750, 574]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x}, ${y})`}>
          <line x1="0" y1="0" x2="0" y2="-10" stroke="#2e7a2e" strokeWidth="1.5" />
          <circle cx="0" cy="-11" r="3" fill={['#ff6b8a', '#ffd700', '#9b59b6', '#ff6b8a', '#ffd700'][i]} />
          <circle cx="0" cy="-11" r="1.2" fill="#fff4a0" />
        </g>
      ))}
    </svg>
  );
}
