// Goldilocks and the Three Bears - 10 Storybook Scene Components
// Style: Warm, cute storybook (Julia Donaldson / Gruffalo inspired)
// Big expressive eyes, organic shapes, warm colours

import React from 'react';

/* ============================================================
   SCENE 1 — "Goldilocks goes for a walk in the forest"
   ============================================================ */
export function GoldilocksScene1({ className = '' }) {
  return (
    <svg viewBox="0 0 800 600" className={`absolute inset-0 w-full h-full ${className}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="s1-sun" cx="75%" cy="10%" r="40%">
          <stop offset="0%" stopColor="#fff8dc" />
          <stop offset="40%" stopColor="#ffeaa0" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ffeaa0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="s1-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#87CEEB" />
          <stop offset="60%" stopColor="#b8e6b8" />
          <stop offset="100%" stopColor="#6b9b3a" />
        </linearGradient>
        <filter id="s1-glow">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <linearGradient id="s1-path" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d4a574" />
          <stop offset="100%" stopColor="#b8875a" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="800" height="600" fill="url(#s1-sky)" />
      <rect width="800" height="600" fill="url(#s1-sun)" />

      {/* Sunbeams */}
      <g opacity="0.18">
        <polygon points="600,0 520,300 560,300" fill="#fff8dc" />
        <polygon points="650,0 590,280 630,280" fill="#fff8dc" />
        <polygon points="700,0 640,250 680,250" fill="#fff8dc" />
        <polygon points="550,0 470,320 510,320" fill="#fff8dc" />
      </g>

      {/* Background trees (far) */}
      <g opacity="0.5">
        <ellipse cx="100" cy="200" rx="60" ry="100" fill="#2d6b2d" />
        <ellipse cx="200" cy="180" rx="50" ry="110" fill="#2a5e2a" />
        <ellipse cx="700" cy="190" rx="65" ry="105" fill="#2d6b2d" />
        <ellipse cx="600" cy="200" rx="55" ry="95" fill="#2a5e2a" />
      </g>

      {/* Mid-ground foliage */}
      <ellipse cx="50" cy="320" rx="90" ry="130" fill="#3a7a3a" />
      <ellipse cx="160" cy="330" rx="80" ry="120" fill="#3d8040" />
      <ellipse cx="650" cy="310" rx="95" ry="135" fill="#3a7a3a" />
      <ellipse cx="770" cy="330" rx="85" ry="120" fill="#357035" />

      {/* Ground */}
      <ellipse cx="400" cy="620" rx="500" ry="200" fill="#5a9a3a" />
      <ellipse cx="400" cy="640" rx="480" ry="180" fill="#4d8a30" />

      {/* Path */}
      <path d="M300,600 Q320,520 350,470 Q380,420 400,380 Q430,340 500,300" stroke="url(#s1-path)" strokeWidth="50" fill="none" strokeLinecap="round" />
      <path d="M300,600 Q320,520 350,470 Q380,420 400,380 Q430,340 500,300" stroke="#c49a64" strokeWidth="40" fill="none" strokeLinecap="round" />
      {/* Path texture dots */}
      <circle cx="340" cy="490" r="3" fill="#b8875a" opacity="0.4" />
      <circle cx="365" cy="455" r="2.5" fill="#b8875a" opacity="0.4" />
      <circle cx="390" cy="410" r="3" fill="#b8875a" opacity="0.4" />
      <circle cx="420" cy="370" r="2" fill="#b8875a" opacity="0.4" />

      {/* Left foreground tree trunk */}
      <rect x="60" y="200" width="40" height="300" rx="8" fill="#6b4226" />
      <rect x="65" y="200" width="10" height="300" fill="#7a5030" opacity="0.5" />
      {/* Tree canopy */}
      <ellipse cx="80" cy="180" rx="80" ry="90" fill="#2d7a2d" />
      <ellipse cx="60" cy="160" rx="60" ry="70" fill="#3a8a3a" />
      <ellipse cx="100" cy="170" rx="55" ry="65" fill="#348534" />
      <ellipse cx="80" cy="140" rx="45" ry="50" fill="#40904a" />

      {/* Right foreground tree trunk */}
      <rect x="680" y="180" width="45" height="320" rx="8" fill="#5a3820" />
      <rect x="688" y="180" width="12" height="320" fill="#6b4528" opacity="0.5" />
      {/* Tree canopy */}
      <ellipse cx="702" cy="160" rx="85" ry="95" fill="#2d7a2d" />
      <ellipse cx="680" cy="140" rx="65" ry="75" fill="#3a8a3a" />
      <ellipse cx="725" cy="150" rx="60" ry="70" fill="#348534" />
      <ellipse cx="702" cy="120" rx="50" ry="55" fill="#40904a" />

      {/* Wildflowers on the ground */}
      {/* Red flowers */}
      <circle cx="200" cy="510" r="6" fill="#e84040" />
      <circle cx="197" cy="507" r="6" fill="#ff5050" />
      <circle cx="203" cy="507" r="6" fill="#ff5050" />
      <circle cx="200" cy="504" r="4" fill="#ff6060" />
      <circle cx="200" cy="508" r="2.5" fill="#ffee00" />
      <line x1="200" y1="510" x2="200" y2="530" stroke="#3a7a30" strokeWidth="2" />

      {/* Yellow flowers */}
      <circle cx="280" cy="520" r="5" fill="#ffcc00" />
      <circle cx="277" cy="517" r="5" fill="#ffdd30" />
      <circle cx="283" cy="517" r="5" fill="#ffdd30" />
      <circle cx="280" cy="515" r="3.5" fill="#ffe860" />
      <circle cx="280" cy="518" r="2" fill="#ff9900" />
      <line x1="280" y1="520" x2="280" y2="538" stroke="#3a7a30" strokeWidth="2" />

      {/* Blue flowers */}
      <circle cx="500" cy="400" r="5" fill="#6688dd" />
      <circle cx="497" cy="397" r="5" fill="#7799ee" />
      <circle cx="503" cy="397" r="5" fill="#7799ee" />
      <circle cx="500" cy="395" r="3.5" fill="#88aaff" />
      <circle cx="500" cy="398" r="2" fill="#ffee00" />
      <line x1="500" y1="400" x2="500" y2="416" stroke="#3a7a30" strokeWidth="1.5" />

      {/* Purple flowers */}
      <circle cx="550" cy="370" r="4" fill="#9955cc" />
      <circle cx="548" cy="367" r="4" fill="#aa66dd" />
      <circle cx="553" cy="367" r="4" fill="#aa66dd" />
      <circle cx="550" cy="365" r="3" fill="#bb77ee" />
      <circle cx="550" cy="368" r="1.8" fill="#ffee00" />
      <line x1="550" y1="370" x2="550" y2="384" stroke="#3a7a30" strokeWidth="1.5" />

      {/* More flowers scattered */}
      <circle cx="150" cy="530" r="4" fill="#ff7799" />
      <circle cx="148" cy="528" r="4" fill="#ff88aa" />
      <circle cx="153" cy="528" r="4" fill="#ff88aa" />
      <line x1="150" y1="530" x2="150" y2="545" stroke="#3a7a30" strokeWidth="1.5" />

      <circle cx="600" cy="440" r="3.5" fill="#ffaa00" />
      <circle cx="598" cy="437" r="3.5" fill="#ffbb30" />
      <circle cx="603" cy="437" r="3.5" fill="#ffbb30" />
      <line x1="600" y1="440" x2="600" y2="452" stroke="#3a7a30" strokeWidth="1.5" />

      {/* Mushrooms */}
      <rect x="228" y="528" width="6" height="12" rx="2" fill="#f0e0c0" />
      <ellipse cx="231" cy="528" rx="10" ry="7" fill="#cc3030" />
      <circle cx="227" cy="526" r="2" fill="#ffffff" opacity="0.8" />
      <circle cx="234" cy="524" r="1.5" fill="#ffffff" opacity="0.8" />
      <circle cx="230" cy="522" r="1.8" fill="#ffffff" opacity="0.8" />

      <rect x="578" cy="418" width="5" height="10" rx="2" fill="#f0e0c0" transform="translate(578,418)" />
      <ellipse cx="580" cy="418" rx="8" ry="6" fill="#cc3030" />
      <circle cx="577" cy="416" r="1.5" fill="#ffffff" opacity="0.8" />
      <circle cx="583" cy="415" r="1.2" fill="#ffffff" opacity="0.8" />

      {/* Rabbit peeking from behind left tree */}
      <g transform="translate(120, 430)">
        {/* Body */}
        <ellipse cx="0" cy="10" rx="12" ry="15" fill="#d4b896" />
        {/* Head */}
        <circle cx="0" cy="-8" r="11" fill="#d4b896" />
        {/* Inner face */}
        <circle cx="0" cy="-6" r="8" fill="#e8d4bc" />
        {/* Ears */}
        <ellipse cx="-5" cy="-26" rx="4" ry="12" fill="#d4b896" />
        <ellipse cx="5" cy="-28" rx="4" ry="12" fill="#d4b896" />
        <ellipse cx="-5" cy="-26" rx="2.5" ry="9" fill="#f0b8b0" />
        <ellipse cx="5" cy="-28" rx="2.5" ry="9" fill="#f0b8b0" />
        {/* Eyes */}
        <circle cx="-4" cy="-10" r="3.5" fill="#2a1a0a" />
        <circle cx="4" cy="-10" r="3.5" fill="#2a1a0a" />
        <circle cx="-3" cy="-11" r="1.2" fill="#ffffff" />
        <circle cx="5" cy="-11" r="1.2" fill="#ffffff" />
        {/* Nose */}
        <ellipse cx="0" cy="-5" rx="2" ry="1.5" fill="#ff9090" />
        {/* Whiskers */}
        <line x1="-3" y1="-5" x2="-14" y2="-7" stroke="#b8a080" strokeWidth="0.8" />
        <line x1="-3" y1="-4" x2="-14" y2="-3" stroke="#b8a080" strokeWidth="0.8" />
        <line x1="3" y1="-5" x2="14" y2="-7" stroke="#b8a080" strokeWidth="0.8" />
        <line x1="3" y1="-4" x2="14" y2="-3" stroke="#b8a080" strokeWidth="0.8" />
      </g>

      {/* === GOLDILOCKS === */}
      <g transform="translate(370, 390)">
        {/* Shadow */}
        <ellipse cx="0" cy="85" rx="25" ry="6" fill="#2a5a20" opacity="0.3" />

        {/* Dress */}
        <path d="M-18,30 Q-22,55 -25,80 Q0,90 25,80 Q22,55 18,30 Z" fill="#e03050" />
        <path d="M-18,30 Q-22,55 -25,80 Q0,90 25,80 Q22,55 18,30 Z" fill="#cc2040" opacity="0.3" />
        {/* Dress highlight */}
        <path d="M-5,35 Q-2,55 -3,75 Q3,75 5,35 Z" fill="#ff4060" opacity="0.3" />
        {/* Dress white collar */}
        <path d="M-12,28 Q0,35 12,28 Q0,32 -12,28 Z" fill="#ffffff" opacity="0.8" />

        {/* Legs */}
        <rect x="-12" y="75" width="8" height="18" rx="3" fill="#fce4c8" />
        <rect x="4" y="75" width="8" height="18" rx="3" fill="#fce4c8" />

        {/* Shoes */}
        <ellipse cx="-8" cy="93" rx="7" ry="4" fill="#5a2a1a" />
        <ellipse cx="8" cy="93" rx="7" ry="4" fill="#5a2a1a" />
        <ellipse cx="-8" cy="92" rx="5" ry="2.5" fill="#7a3a28" />
        <ellipse cx="8" cy="92" rx="5" ry="2.5" fill="#7a3a28" />

        {/* Arms */}
        <path d="M-18,35 Q-30,45 -28,55" stroke="#fce4c8" strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d="M18,35 Q30,45 28,55" stroke="#fce4c8" strokeWidth="8" fill="none" strokeLinecap="round" />
        {/* Hands */}
        <circle cx="-28" cy="55" r="5" fill="#fce4c8" />
        <circle cx="28" cy="55" r="5" fill="#fce4c8" />

        {/* Head */}
        <circle cx="0" cy="8" r="22" fill="#fce4c8" />

        {/* Golden curly hair - multiple overlapping layers */}
        <ellipse cx="0" cy="-8" rx="28" ry="22" fill="#f0c030" />
        <ellipse cx="-18" cy="0" rx="14" ry="18" fill="#ffd700" />
        <ellipse cx="18" cy="0" rx="14" ry="18" fill="#ffd700" />
        <ellipse cx="-12" cy="-12" rx="16" ry="14" fill="#ffdd40" />
        <ellipse cx="12" cy="-12" rx="16" ry="14" fill="#ffdd40" />
        <ellipse cx="0" cy="-16" rx="20" ry="12" fill="#f0c030" />
        {/* Hair curls - side ringlets */}
        <circle cx="-22" cy="12" r="8" fill="#ffd700" />
        <circle cx="22" cy="12" r="8" fill="#ffd700" />
        <circle cx="-20" cy="20" r="7" fill="#f0c030" />
        <circle cx="20" cy="20" r="7" fill="#f0c030" />
        <circle cx="-17" cy="27" r="6" fill="#ffd700" />
        <circle cx="17" cy="27" r="6" fill="#ffd700" />
        {/* Hair highlight */}
        <ellipse cx="-5" cy="-14" rx="8" ry="5" fill="#ffe870" opacity="0.6" />
        <ellipse cx="8" cy="-10" rx="6" ry="4" fill="#ffe870" opacity="0.5" />

        {/* Face */}
        {/* Eyes */}
        <ellipse cx="-7" cy="5" rx="4.5" ry="5" fill="#ffffff" />
        <ellipse cx="7" cy="5" rx="4.5" ry="5" fill="#ffffff" />
        <circle cx="-7" cy="6" r="3.2" fill="#4488cc" />
        <circle cx="7" cy="6" r="3.2" fill="#4488cc" />
        <circle cx="-7" cy="6" r="2" fill="#2255aa" />
        <circle cx="7" cy="6" r="2" fill="#2255aa" />
        <circle cx="-7" cy="7" r="1" fill="#111122" />
        <circle cx="7" cy="7" r="1" fill="#111122" />
        {/* Eye sparkles */}
        <circle cx="-8.5" cy="4.5" r="1.3" fill="#ffffff" />
        <circle cx="5.5" cy="4.5" r="1.3" fill="#ffffff" />
        <circle cx="-6" cy="7" r="0.7" fill="#ffffff" />
        <circle cx="8" cy="7" r="0.7" fill="#ffffff" />
        {/* Eyelashes */}
        <path d="M-11,3 Q-12,1 -11,0" stroke="#3a2a1a" strokeWidth="0.8" fill="none" />
        <path d="M-3,3 Q-2,1 -3,0" stroke="#3a2a1a" strokeWidth="0.8" fill="none" />
        <path d="M3,3 Q2,1 3,0" stroke="#3a2a1a" strokeWidth="0.8" fill="none" />
        <path d="M11,3 Q12,1 11,0" stroke="#3a2a1a" strokeWidth="0.8" fill="none" />

        {/* Rosy cheeks */}
        <circle cx="-12" cy="12" r="4" fill="#ffb0a0" opacity="0.5" />
        <circle cx="12" cy="12" r="4" fill="#ffb0a0" opacity="0.5" />

        {/* Button nose */}
        <ellipse cx="0" cy="11" rx="2.2" ry="1.8" fill="#f0b8a0" />

        {/* Mouth - happy smile */}
        <path d="M-5,16 Q0,21 5,16" stroke="#cc4455" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </g>

      {/* Butterflies */}
      <g transform="translate(300, 250)">
        <animateTransform attributeName="transform" type="translate" values="300,250;310,240;305,255;295,245;300,250" dur="6s" repeatCount="indefinite" />
        <path d="M0,0 Q-10,-8 -6,-16 Q-2,-8 0,0" fill="#ff88cc" opacity="0.8" />
        <path d="M0,0 Q10,-8 6,-16 Q2,-8 0,0" fill="#ff88cc" opacity="0.8" />
        <path d="M0,0 Q-8,6 -5,12 Q-1,6 0,0" fill="#ff66aa" opacity="0.7" />
        <path d="M0,0 Q8,6 5,12 Q1,6 0,0" fill="#ff66aa" opacity="0.7" />
        <line x1="0" y1="0" x2="0" y2="4" stroke="#553344" strokeWidth="0.8" />
      </g>

      <g transform="translate(520, 280)">
        <animateTransform attributeName="transform" type="translate" values="520,280;530,270;525,285;515,275;520,280" dur="8s" repeatCount="indefinite" />
        <path d="M0,0 Q-8,-6 -5,-13 Q-1,-6 0,0" fill="#aaccff" opacity="0.8" />
        <path d="M0,0 Q8,-6 5,-13 Q1,-6 0,0" fill="#aaccff" opacity="0.8" />
        <path d="M0,0 Q-6,5 -4,10 Q-1,5 0,0" fill="#88aaee" opacity="0.7" />
        <path d="M0,0 Q6,5 4,10 Q1,5 0,0" fill="#88aaee" opacity="0.7" />
        <line x1="0" y1="0" x2="0" y2="3" stroke="#334455" strokeWidth="0.8" />
      </g>

      {/* Birds */}
      <path d="M480,120 Q490,110 500,120" stroke="#4a3520" strokeWidth="2" fill="none" />
      <path d="M500,120 Q510,110 520,120" stroke="#4a3520" strokeWidth="2" fill="none" />
      <path d="M440,90 Q448,82 456,90" stroke="#4a3520" strokeWidth="1.5" fill="none" />
      <path d="M456,90 Q464,82 472,90" stroke="#4a3520" strokeWidth="1.5" fill="none" />

      {/* Spider web in corner of right tree */}
      <g transform="translate(660, 230)" opacity="0.3">
        <line x1="0" y1="0" x2="30" y2="0" stroke="#ffffff" strokeWidth="0.5" />
        <line x1="0" y1="0" x2="25" y2="18" stroke="#ffffff" strokeWidth="0.5" />
        <line x1="0" y1="0" x2="15" y2="28" stroke="#ffffff" strokeWidth="0.5" />
        <line x1="0" y1="0" x2="0" y2="30" stroke="#ffffff" strokeWidth="0.5" />
        <path d="M10,0 Q10,3 8,6" stroke="#ffffff" strokeWidth="0.4" fill="none" />
        <path d="M20,0 Q18,6 15,12" stroke="#ffffff" strokeWidth="0.4" fill="none" />
        <path d="M8,6 Q5,8 5,10" stroke="#ffffff" strokeWidth="0.4" fill="none" />
      </g>

      {/* Foreground grass blades */}
      <path d="M0,580 Q10,550 5,520" stroke="#4a8a30" strokeWidth="3" fill="none" />
      <path d="M20,585 Q25,560 18,535" stroke="#3d7a28" strokeWidth="2.5" fill="none" />
      <path d="M780,575 Q770,545 775,515" stroke="#4a8a30" strokeWidth="3" fill="none" />
      <path d="M760,580 Q755,555 762,530" stroke="#3d7a28" strokeWidth="2.5" fill="none" />
    </svg>
  );
}

/* ============================================================
   SCENE 2 — "She finds a cottage in the woods"
   ============================================================ */
export function GoldilocksScene2({ className = '' }) {
  return (
    <svg viewBox="0 0 800 600" className={`absolute inset-0 w-full h-full ${className}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="s2-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#87CEEB" />
          <stop offset="70%" stopColor="#aadcaa" />
          <stop offset="100%" stopColor="#6b9b3a" />
        </linearGradient>
        <linearGradient id="s2-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5e6c8" />
          <stop offset="100%" stopColor="#d4c4a0" />
        </linearGradient>
        <linearGradient id="s2-roof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c4a050" />
          <stop offset="100%" stopColor="#a08030" />
        </linearGradient>
        <radialGradient id="s2-window-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffe880" />
          <stop offset="100%" stopColor="#ffcc40" />
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect width="800" height="600" fill="url(#s2-sky)" />

      {/* Clouds */}
      <g opacity="0.7">
        <ellipse cx="150" cy="80" rx="60" ry="25" fill="#ffffff" />
        <ellipse cx="180" cy="70" rx="50" ry="22" fill="#ffffff" />
        <ellipse cx="120" cy="75" rx="40" ry="20" fill="#f8f8ff" />
        <ellipse cx="600" cy="60" rx="55" ry="22" fill="#ffffff" />
        <ellipse cx="630" cy="55" rx="45" ry="20" fill="#f8f8ff" />
      </g>

      {/* Background trees */}
      <ellipse cx="50" cy="280" rx="70" ry="120" fill="#2d6b2d" />
      <ellipse cx="150" cy="290" rx="60" ry="100" fill="#2a5e2a" />
      <ellipse cx="700" cy="270" rx="80" ry="130" fill="#2d6b2d" />
      <ellipse cx="780" cy="290" rx="65" ry="110" fill="#2a5e2a" />

      {/* Ground */}
      <ellipse cx="400" cy="630" rx="500" ry="210" fill="#5a9a3a" />
      <ellipse cx="400" cy="650" rx="480" ry="200" fill="#4d8a30" />

      {/* Garden path leading to cottage */}
      <path d="M250,580 Q300,500 370,440 Q400,420 420,410" stroke="#d4a574" strokeWidth="40" fill="none" strokeLinecap="round" />
      <path d="M250,580 Q300,500 370,440 Q400,420 420,410" stroke="#c49a64" strokeWidth="30" fill="none" strokeLinecap="round" />

      {/* Garden fence / gate */}
      <g transform="translate(280, 430)">
        {/* Gate posts */}
        <rect x="-5" y="-30" width="8" height="60" rx="2" fill="#8b7355" />
        <rect x="55" y="-30" width="8" height="60" rx="2" fill="#8b7355" />
        {/* Gate top */}
        <ellipse cx="29" cy="-30" rx="32" ry="8" fill="#8b7355" />
        {/* Gate bars */}
        <rect x="8" y="-25" width="4" height="50" rx="1" fill="#7a6245" />
        <rect x="22" y="-25" width="4" height="50" rx="1" fill="#7a6245" />
        <rect x="36" y="-25" width="4" height="50" rx="1" fill="#7a6245" />
        <rect x="50" y="-25" width="4" height="50" rx="1" fill="#7a6245" />
        {/* Cross bars */}
        <rect x="5" y="-15" width="50" height="4" rx="1" fill="#7a6245" />
        <rect x="5" y="10" width="50" height="4" rx="1" fill="#7a6245" />
        {/* Sign on gate */}
        <rect x="10" y="-10" width="40" height="18" rx="3" fill="#f0e0c0" stroke="#8b7355" strokeWidth="1" />
        <text x="30" y="4" textAnchor="middle" fontSize="8" fill="#5a3a1a" fontFamily="serif" fontWeight="bold">The Bears</text>
      </g>

      {/* === COTTAGE === */}
      <g transform="translate(400, 200)">
        {/* Cottage body - stone walls */}
        <rect x="-100" y="50" width="200" height="160" rx="4" fill="url(#s2-wall)" />
        {/* Stone texture */}
        <rect x="-95" y="55" width="35" height="22" rx="3" fill="#e8d8b8" stroke="#c8b898" strokeWidth="0.8" />
        <rect x="-55" y="55" width="40" height="22" rx="3" fill="#ecdcc0" stroke="#c8b898" strokeWidth="0.8" />
        <rect x="-10" y="55" width="38" height="22" rx="3" fill="#e5d5b5" stroke="#c8b898" strokeWidth="0.8" />
        <rect x="33" y="55" width="32" height="22" rx="3" fill="#e8d8b8" stroke="#c8b898" strokeWidth="0.8" />
        <rect x="70" y="55" width="25" height="22" rx="3" fill="#ecdcc0" stroke="#c8b898" strokeWidth="0.8" />
        <rect x="-95" y="82" width="28" height="24" rx="3" fill="#ecdcc0" stroke="#c8b898" strokeWidth="0.8" />
        <rect x="-62" y="82" width="42" height="24" rx="3" fill="#e5d5b5" stroke="#c8b898" strokeWidth="0.8" />
        <rect x="-15" y="82" width="30" height="24" rx="3" fill="#e8d8b8" stroke="#c8b898" strokeWidth="0.8" />
        <rect x="20" y="82" width="38" height="24" rx="3" fill="#ecdcc0" stroke="#c8b898" strokeWidth="0.8" />
        <rect x="63" y="82" width="32" height="24" rx="3" fill="#e5d5b5" stroke="#c8b898" strokeWidth="0.8" />

        {/* Thatched roof */}
        <path d="M-130,55 L0,-40 L130,55 Z" fill="url(#s2-roof)" />
        <path d="M-125,55 L0,-35 L125,55 Z" fill="#b89040" />
        {/* Thatch texture lines */}
        <path d="M-100,45 L0,-20 L100,45" stroke="#a08030" strokeWidth="1" fill="none" />
        <path d="M-110,50 L0,-28 L110,50" stroke="#a08030" strokeWidth="1" fill="none" />
        <path d="M-80,38 L0,-10 L80,38" stroke="#c8a050" strokeWidth="0.8" fill="none" />
        {/* Thatch edge (scalloped) */}
        <path d="M-130,55 Q-120,62 -110,55 Q-100,62 -90,55 Q-80,62 -70,55 Q-60,62 -50,55 Q-40,62 -30,55 Q-20,62 -10,55 Q0,62 10,55 Q20,62 30,55 Q40,62 50,55 Q60,62 70,55 Q80,62 90,55 Q100,62 110,55 Q120,62 130,55" stroke="#b89040" strokeWidth="3" fill="none" />

        {/* Chimney */}
        <rect x="50" y="-35" width="25" height="50" rx="2" fill="#b0756a" />
        <rect x="47" y="-40" width="31" height="8" rx="2" fill="#c08878" />
        {/* Smoke from chimney */}
        <g opacity="0.4">
          <circle cx="62" cy="-55" r="6" fill="#cccccc">
            <animate attributeName="cy" values="-55;-75;-95" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0.2;0" dur="4s" repeatCount="indefinite" />
            <animate attributeName="r" values="6;9;12" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="65" cy="-65" r="8" fill="#cccccc">
            <animate attributeName="cy" values="-65;-90;-115" dur="5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0.15;0" dur="5s" repeatCount="indefinite" />
            <animate attributeName="r" values="8;12;16" dur="5s" repeatCount="indefinite" />
          </circle>
          <circle cx="58" cy="-80" r="10" fill="#cccccc">
            <animate attributeName="cy" values="-80;-110;-140" dur="6s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.25;0.1;0" dur="6s" repeatCount="indefinite" />
            <animate attributeName="r" values="10;15;20" dur="6s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Door */}
        <rect x="-18" y="130" width="36" height="80" rx="18 18 0 0" fill="#6b3a1a" />
        <rect x="-14" y="134" width="28" height="72" rx="14 14 0 0" fill="#7a4528" />
        {/* Door handle */}
        <circle cx="8" cy="170" r="3" fill="#d4a030" />
        <circle cx="8" cy="170" r="1.5" fill="#e8b840" />
        {/* Door arch detail */}
        <path d="M-14,155 Q0,138 14,155" stroke="#5a2a10" strokeWidth="1.5" fill="none" />

        {/* Windows */}
        {/* Left window */}
        <rect x="-80" y="100" width="40" height="40" rx="3" fill="#5a3a1a" />
        <rect x="-77" y="103" width="34" height="34" rx="2" fill="url(#s2-window-glow)" />
        <line x1="-60" y1="103" x2="-60" y2="137" stroke="#5a3a1a" strokeWidth="2" />
        <line x1="-77" y1="120" x2="-43" y2="120" stroke="#5a3a1a" strokeWidth="2" />
        {/* Curtain suggestion */}
        <path d="M-77,103 Q-68,110 -63,103" fill="#ff9999" opacity="0.4" />
        <path d="M-57,103 Q-52,110 -43,103" fill="#ff9999" opacity="0.4" />

        {/* Right window */}
        <rect x="40" y="100" width="40" height="40" rx="3" fill="#5a3a1a" />
        <rect x="43" y="103" width="34" height="34" rx="2" fill="url(#s2-window-glow)" />
        <line x1="60" y1="103" x2="60" y2="137" stroke="#5a3a1a" strokeWidth="2" />
        <line x1="43" y1="120" x2="77" y2="120" stroke="#5a3a1a" strokeWidth="2" />
        <path d="M43,103 Q52,110 57,103" fill="#ff9999" opacity="0.4" />
        <path d="M63,103 Q68,110 77,103" fill="#ff9999" opacity="0.4" />

        {/* Roses growing up the wall */}
        <path d="M-100,210 Q-95,180 -90,150 Q-88,130 -85,110" stroke="#3a7a30" strokeWidth="2.5" fill="none" />
        <path d="M-88,130 Q-80,125 -75,130" stroke="#3a7a30" strokeWidth="2" fill="none" />
        <circle cx="-90" cy="150" r="5" fill="#ff4466" />
        <circle cx="-90" cy="148" r="3" fill="#ff6688" />
        <circle cx="-85" cy="120" r="4.5" fill="#ff4466" />
        <circle cx="-85" cy="118" r="2.8" fill="#ff6688" />
        <circle cx="-78" cy="130" r="4" fill="#ff5577" />
        <circle cx="-78" cy="128" r="2.5" fill="#ff7799" />
        {/* Rose leaves */}
        <ellipse cx="-93" cy="140" rx="4" ry="2.5" fill="#3a8a30" transform="rotate(-20,-93,140)" />
        <ellipse cx="-82" cy="125" rx="3.5" ry="2" fill="#3a8a30" transform="rotate(15,-82,125)" />

        {/* Right side roses */}
        <path d="M100,210 Q95,175 92,145 Q90,125 88,105" stroke="#3a7a30" strokeWidth="2.5" fill="none" />
        <circle cx="92" cy="145" r="5" fill="#ff4466" />
        <circle cx="92" cy="143" r="3" fill="#ff6688" />
        <circle cx="88" cy="115" r="4" fill="#ff5577" />
        <circle cx="88" cy="113" r="2.5" fill="#ff7799" />
        <ellipse cx="95" cy="135" rx="4" ry="2.5" fill="#3a8a30" transform="rotate(20,95,135)" />
      </g>

      {/* === GOLDILOCKS approaching door === */}
      <g transform="translate(310, 340)">
        {/* Shadow */}
        <ellipse cx="0" cy="85" rx="22" ry="5" fill="#2a5a20" opacity="0.3" />

        {/* Dress */}
        <path d="M-16,30 Q-20,55 -22,78 Q0,86 22,78 Q20,55 16,30 Z" fill="#e03050" />
        <path d="M-4,35 Q-1,55 -2,73 Q2,73 4,35 Z" fill="#ff4060" opacity="0.3" />
        <path d="M-10,28 Q0,34 10,28 Q0,31 -10,28 Z" fill="#ffffff" opacity="0.8" />

        {/* Legs */}
        <rect x="-10" y="73" width="7" height="16" rx="3" fill="#fce4c8" />
        <rect x="3" y="73" width="7" height="16" rx="3" fill="#fce4c8" />
        {/* Shoes */}
        <ellipse cx="-7" cy="89" rx="6" ry="3.5" fill="#5a2a1a" />
        <ellipse cx="6" cy="89" rx="6" ry="3.5" fill="#5a2a1a" />

        {/* Arms - right arm reaching forward toward door */}
        <path d="M-16,35 Q-26,42 -24,52" stroke="#fce4c8" strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M16,34 Q30,30 40,25" stroke="#fce4c8" strokeWidth="7" fill="none" strokeLinecap="round" />
        <circle cx="-24" cy="52" r="4.5" fill="#fce4c8" />
        <circle cx="40" cy="25" r="4.5" fill="#fce4c8" />

        {/* Head */}
        <circle cx="0" cy="8" r="20" fill="#fce4c8" />

        {/* Golden curly hair */}
        <ellipse cx="0" cy="-6" rx="26" ry="20" fill="#f0c030" />
        <ellipse cx="-16" cy="2" rx="13" ry="16" fill="#ffd700" />
        <ellipse cx="16" cy="2" rx="13" ry="16" fill="#ffd700" />
        <ellipse cx="-10" cy="-10" rx="14" ry="13" fill="#ffdd40" />
        <ellipse cx="10" cy="-10" rx="14" ry="13" fill="#ffdd40" />
        <ellipse cx="0" cy="-14" rx="18" ry="11" fill="#f0c030" />
        <circle cx="-20" cy="12" r="7" fill="#ffd700" />
        <circle cx="20" cy="12" r="7" fill="#ffd700" />
        <circle cx="-18" cy="20" r="6" fill="#f0c030" />
        <circle cx="18" cy="20" r="6" fill="#f0c030" />
        <circle cx="-15" cy="26" r="5" fill="#ffd700" />
        <circle cx="15" cy="26" r="5" fill="#ffd700" />
        <ellipse cx="-4" cy="-12" rx="7" ry="4" fill="#ffe870" opacity="0.5" />

        {/* Eyes - looking toward the door */}
        <ellipse cx="-6" cy="5" rx="4" ry="4.5" fill="#ffffff" />
        <ellipse cx="6" cy="5" rx="4" ry="4.5" fill="#ffffff" />
        <circle cx="-4" cy="6" r="3" fill="#4488cc" />
        <circle cx="8" cy="6" r="3" fill="#4488cc" />
        <circle cx="-4" cy="6" r="1.8" fill="#2255aa" />
        <circle cx="8" cy="6" r="1.8" fill="#2255aa" />
        <circle cx="-4" cy="7" r="0.9" fill="#111122" />
        <circle cx="8" cy="7" r="0.9" fill="#111122" />
        {/* Sparkles */}
        <circle cx="-5.5" cy="4.5" r="1.2" fill="#ffffff" />
        <circle cx="6.5" cy="4.5" r="1.2" fill="#ffffff" />
        {/* Cheeks */}
        <circle cx="-11" cy="11" r="3.5" fill="#ffb0a0" opacity="0.5" />
        <circle cx="11" cy="11" r="3.5" fill="#ffb0a0" opacity="0.5" />
        {/* Nose */}
        <ellipse cx="0" cy="10" rx="2" ry="1.6" fill="#f0b8a0" />
        {/* Mouth - curious/excited "o" */}
        <ellipse cx="0" cy="15" rx="3" ry="2.5" fill="#cc4455" />
        <ellipse cx="0" cy="14.5" rx="2" ry="1.5" fill="#dd6070" />
      </g>

      {/* Garden flowers */}
      <circle cx="350" cy="470" r="5" fill="#ffcc00" />
      <circle cx="348" cy="467" r="5" fill="#ffdd30" />
      <circle cx="353" cy="467" r="5" fill="#ffdd30" />
      <line x1="350" y1="470" x2="350" y2="488" stroke="#3a7a30" strokeWidth="2" />

      <circle cx="460" cy="450" r="4" fill="#ff5577" />
      <circle cx="458" cy="448" r="4" fill="#ff6688" />
      <circle cx="463" cy="448" r="4" fill="#ff6688" />
      <line x1="460" y1="450" x2="460" y2="465" stroke="#3a7a30" strokeWidth="1.5" />

      <circle cx="520" cy="460" r="4.5" fill="#9966cc" />
      <circle cx="518" cy="457" r="4.5" fill="#aa77dd" />
      <circle cx="523" cy="457" r="4.5" fill="#aa77dd" />
      <line x1="520" y1="460" x2="520" y2="476" stroke="#3a7a30" strokeWidth="1.5" />

      {/* Small mouse near cottage base */}
      <g transform="translate(520, 400)">
        <ellipse cx="0" cy="0" rx="6" ry="4" fill="#a0887a" />
        <circle cx="7" cy="-2" r="3.5" fill="#a0887a" />
        <circle cx="10" cy="-5" r="2.5" fill="#b09888" />
        <circle cx="10" cy="-5" r="1.5" fill="#d0b8b0" />
        <circle cx="8.5" cy="-3" r="1" fill="#221111" />
        <circle cx="9" cy="-3.5" r="0.4" fill="#ffffff" />
        <ellipse cx="9" cy="-1" rx="1" ry="0.6" fill="#ffaaaa" />
        <path d="M-6,0 Q-14,4 -18,8" stroke="#a08878" strokeWidth="1" fill="none" />
      </g>
    </svg>
  );
}

/* ============================================================
   SCENE 3 — "Three bowls of porridge"
   ============================================================ */
export function GoldilocksScene3({ className = '' }) {
  return (
    <svg viewBox="0 0 800 600" className={`absolute inset-0 w-full h-full ${className}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="s3-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5e0b0" />
          <stop offset="100%" stopColor="#e0c890" />
        </linearGradient>
        <linearGradient id="s3-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c49a64" />
          <stop offset="100%" stopColor="#a0784a" />
        </linearGradient>
        <radialGradient id="s3-warm" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#fff8e0" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#ffcc80" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="s3-bowl-big" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6688bb" />
          <stop offset="100%" stopColor="#4466aa" />
        </linearGradient>
        <linearGradient id="s3-bowl-med" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#66aa66" />
          <stop offset="100%" stopColor="#448844" />
        </linearGradient>
        <linearGradient id="s3-bowl-sm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dd8844" />
          <stop offset="100%" stopColor="#bb6622" />
        </linearGradient>
      </defs>

      {/* Wall */}
      <rect width="800" height="380" fill="url(#s3-wall)" />
      {/* Warm ambient glow */}
      <rect width="800" height="600" fill="url(#s3-warm)" />
      {/* Wainscoting / lower wall panel */}
      <rect x="0" y="280" width="800" height="100" fill="#d4b080" />
      <line x1="0" y1="280" x2="800" y2="280" stroke="#c0a068" strokeWidth="3" />
      <line x1="0" y1="300" x2="800" y2="300" stroke="#c8a870" strokeWidth="1" />
      {/* Panel details */}
      <rect x="20" y="305" width="120" height="65" rx="3" fill="#d8b888" stroke="#c0a068" strokeWidth="1.5" />
      <rect x="160" y="305" width="120" height="65" rx="3" fill="#d8b888" stroke="#c0a068" strokeWidth="1.5" />
      <rect x="520" y="305" width="120" height="65" rx="3" fill="#d8b888" stroke="#c0a068" strokeWidth="1.5" />
      <rect x="660" y="305" width="120" height="65" rx="3" fill="#d8b888" stroke="#c0a068" strokeWidth="1.5" />

      {/* Floor */}
      <rect x="0" y="380" width="800" height="220" fill="url(#s3-floor)" />
      {/* Floorboard lines */}
      <line x1="0" y1="420" x2="800" y2="420" stroke="#b08858" strokeWidth="0.8" opacity="0.4" />
      <line x1="0" y1="460" x2="800" y2="460" stroke="#b08858" strokeWidth="0.8" opacity="0.4" />
      <line x1="0" y1="500" x2="800" y2="500" stroke="#b08858" strokeWidth="0.8" opacity="0.4" />
      <line x1="0" y1="540" x2="800" y2="540" stroke="#b08858" strokeWidth="0.8" opacity="0.4" />

      {/* Hanging pots on wall */}
      <g transform="translate(650, 100)">
        <line x1="0" y1="0" x2="0" y2="20" stroke="#5a3a20" strokeWidth="2" />
        <ellipse cx="0" cy="30" rx="18" ry="12" fill="#4a3a2a" />
        <ellipse cx="0" cy="25" rx="18" ry="5" fill="#5a4a38" />
        <path d="M-18,25 Q-22,15 -15,10 Q-8,25 -18,25" fill="#4a3a2a" />
        <path d="M18,25 Q22,15 15,10 Q8,25 18,25" fill="#4a3a2a" />
      </g>
      <g transform="translate(700, 120)">
        <line x1="0" y1="0" x2="0" y2="15" stroke="#5a3a20" strokeWidth="2" />
        <ellipse cx="0" cy="22" rx="14" ry="10" fill="#6a4a30" />
        <ellipse cx="0" cy="18" rx="14" ry="4" fill="#7a5a40" />
      </g>

      {/* Window on back wall with sunlight */}
      <rect x="580" y="80" width="80" height="100" rx="3" fill="#5a3a1a" />
      <rect x="585" y="85" width="70" height="90" rx="2" fill="#b8e0f8" />
      <line x1="620" y1="85" x2="620" y2="175" stroke="#5a3a1a" strokeWidth="2.5" />
      <line x1="585" y1="130" x2="655" y2="130" stroke="#5a3a1a" strokeWidth="2.5" />
      {/* Curtains */}
      <path d="M585,85 Q595,100 590,120 L585,120 Z" fill="#cc4444" opacity="0.6" />
      <path d="M655,85 Q645,100 650,120 L655,120 Z" fill="#cc4444" opacity="0.6" />

      {/* === TABLE === */}
      <g transform="translate(400, 300)">
        {/* Checked tablecloth */}
        <path d="M-200,-20 Q-210,0 -205,10 L205,10 Q210,0 200,-20 Z" fill="#dd4444" />
        {/* Checker pattern */}
        <clipPath id="s3-cloth-clip">
          <path d="M-200,-20 Q-210,0 -205,10 L205,10 Q210,0 200,-20 Z" />
        </clipPath>
        <g clipPath="url(#s3-cloth-clip)" opacity="0.4">
          <rect x="-200" y="-20" width="20" height="15" fill="#ffffff" />
          <rect x="-160" y="-20" width="20" height="15" fill="#ffffff" />
          <rect x="-120" y="-20" width="20" height="15" fill="#ffffff" />
          <rect x="-80" y="-20" width="20" height="15" fill="#ffffff" />
          <rect x="-40" y="-20" width="20" height="15" fill="#ffffff" />
          <rect x="0" y="-20" width="20" height="15" fill="#ffffff" />
          <rect x="40" y="-20" width="20" height="15" fill="#ffffff" />
          <rect x="80" y="-20" width="20" height="15" fill="#ffffff" />
          <rect x="120" y="-20" width="20" height="15" fill="#ffffff" />
          <rect x="160" y="-20" width="20" height="15" fill="#ffffff" />
          <rect x="-180" y="-5" width="20" height="15" fill="#ffffff" />
          <rect x="-140" y="-5" width="20" height="15" fill="#ffffff" />
          <rect x="-100" y="-5" width="20" height="15" fill="#ffffff" />
          <rect x="-60" y="-5" width="20" height="15" fill="#ffffff" />
          <rect x="-20" y="-5" width="20" height="15" fill="#ffffff" />
          <rect x="20" y="-5" width="20" height="15" fill="#ffffff" />
          <rect x="60" y="-5" width="20" height="15" fill="#ffffff" />
          <rect x="100" y="-5" width="20" height="15" fill="#ffffff" />
          <rect x="140" y="-5" width="20" height="15" fill="#ffffff" />
          <rect x="180" y="-5" width="20" height="15" fill="#ffffff" />
        </g>

        {/* Table surface */}
        <rect x="-190" y="-25" width="380" height="10" rx="3" fill="#8b6540" />
        <rect x="-185" y="-23" width="370" height="6" rx="2" fill="#9b7550" />

        {/* Table legs */}
        <rect x="-170" y="10" width="12" height="90" rx="3" fill="#7a5530" />
        <rect x="158" y="10" width="12" height="90" rx="3" fill="#7a5530" />
      </g>

      {/* === BIG BOWL (Papa's) === */}
      <g transform="translate(250, 250)">
        <ellipse cx="0" cy="15" rx="45" ry="22" fill="url(#s3-bowl-big)" />
        <ellipse cx="0" cy="0" rx="45" ry="15" fill="#7799cc" />
        <ellipse cx="0" cy="0" rx="38" ry="11" fill="#f5e8c8" />
        {/* Porridge */}
        <ellipse cx="0" cy="-2" rx="35" ry="9" fill="#e8d8a8" />
        <ellipse cx="0" cy="-3" rx="30" ry="7" fill="#f0e0b0" />
        {/* Steam */}
        <g opacity="0.5">
          <path d="M-10,-10 Q-12,-20 -8,-28 Q-4,-20 -6,-10" fill="none" stroke="#ffffff" strokeWidth="1.5">
            <animate attributeName="d" values="M-10,-10 Q-12,-20 -8,-28 Q-4,-20 -6,-10;M-10,-12 Q-14,-24 -8,-32 Q-2,-22 -6,-12;M-10,-10 Q-12,-20 -8,-28 Q-4,-20 -6,-10" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0.2;0.5" dur="3s" repeatCount="indefinite" />
          </path>
          <path d="M5,-10 Q7,-22 3,-30 Q-1,-20 1,-10" fill="none" stroke="#ffffff" strokeWidth="1.5">
            <animate attributeName="d" values="M5,-10 Q7,-22 3,-30 Q-1,-20 1,-10;M5,-12 Q9,-26 3,-34 Q-3,-22 1,-12;M5,-10 Q7,-22 3,-30 Q-1,-20 1,-10" dur="3.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0.15;0.4" dur="3.5s" repeatCount="indefinite" />
          </path>
        </g>
        {/* Spoon */}
        <line x1="25" y1="-5" x2="50" y2="-25" stroke="#c0a880" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="52" cy="-27" rx="6" ry="4" fill="#c8b090" transform="rotate(-40,52,-27)" />
        {/* Bowl decoration */}
        <path d="M-40,5 Q-30,12 -20,5 Q-10,12 0,5 Q10,12 20,5 Q30,12 40,5" stroke="#5577aa" strokeWidth="1.5" fill="none" />
      </g>

      {/* === MEDIUM BOWL (Mama's) === */}
      <g transform="translate(420, 255)">
        <ellipse cx="0" cy="12" rx="38" ry="18" fill="url(#s3-bowl-med)" />
        <ellipse cx="0" cy="0" rx="38" ry="12" fill="#77bb77" />
        <ellipse cx="0" cy="0" rx="32" ry="9" fill="#f5e8c8" />
        {/* Porridge */}
        <ellipse cx="0" cy="-2" rx="29" ry="7" fill="#e8d8a8" />
        <ellipse cx="0" cy="-3" rx="24" ry="5.5" fill="#f0e0b0" />
        {/* Steam */}
        <g opacity="0.45">
          <path d="M-8,-8 Q-10,-16 -6,-24 Q-2,-16 -4,-8" fill="none" stroke="#ffffff" strokeWidth="1.3">
            <animate attributeName="opacity" values="0.45;0.15;0.45" dur="3.2s" repeatCount="indefinite" />
          </path>
          <path d="M6,-8 Q8,-18 4,-26 Q0,-16 2,-8" fill="none" stroke="#ffffff" strokeWidth="1.3">
            <animate attributeName="opacity" values="0.35;0.1;0.35" dur="3.8s" repeatCount="indefinite" />
          </path>
        </g>
        {/* Spoon */}
        <line x1="22" y1="-3" x2="42" y2="-20" stroke="#c0a880" strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="44" cy="-22" rx="5" ry="3.5" fill="#c8b090" transform="rotate(-40,44,-22)" />
        {/* Bowl decoration - flowers */}
        <circle cx="-20" cy="5" r="3" fill="#ffcc44" opacity="0.6" />
        <circle cx="0" cy="8" r="3" fill="#ffcc44" opacity="0.6" />
        <circle cx="20" cy="5" r="3" fill="#ffcc44" opacity="0.6" />
      </g>

      {/* === SMALL BOWL (Baby's) === */}
      <g transform="translate(560, 258)">
        <ellipse cx="0" cy="10" rx="28" ry="14" fill="url(#s3-bowl-sm)" />
        <ellipse cx="0" cy="0" rx="28" ry="9" fill="#ee9955" />
        <ellipse cx="0" cy="0" rx="22" ry="6.5" fill="#f5e8c8" />
        {/* Porridge */}
        <ellipse cx="0" cy="-1" rx="20" ry="5" fill="#e8d8a8" />
        <ellipse cx="0" cy="-2" rx="16" ry="4" fill="#f0e0b0" />
        {/* Steam */}
        <g opacity="0.4">
          <path d="M-5,-6 Q-7,-14 -3,-20 Q1,-12 -1,-6" fill="none" stroke="#ffffff" strokeWidth="1.2">
            <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2.8s" repeatCount="indefinite" />
          </path>
        </g>
        {/* Spoon */}
        <line x1="16" y1="-2" x2="32" y2="-16" stroke="#c0a880" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="34" cy="-18" rx="4.5" ry="3" fill="#c8b090" transform="rotate(-40,34,-18)" />
        {/* Bowl decoration - hearts */}
        <path d="M-12,4 Q-14,0 -10,0 Q-8,0 -8,4 Q-8,0 -4,0 Q-2,0 -4,4 L-8,8 Z" fill="#ffaaaa" opacity="0.5" transform="scale(0.6)" />
      </g>

      {/* Chairs visible behind table */}
      {/* Big chair hint */}
      <path d="M150,240 L150,380 M130,260 L170,260 M130,260 Q150,240 170,260" stroke="#6b4226" strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* Medium chair hint */}
      <path d="M680,250 L680,380 M665,268 L695,268 M665,268 Q680,252 695,268" stroke="#6b4226" strokeWidth="4" fill="none" strokeLinecap="round" />

      {/* === GOLDILOCKS standing to the side, looking curious === */}
      <g transform="translate(100, 330)">
        {/* Shadow */}
        <ellipse cx="0" cy="85" rx="20" ry="5" fill="#a08050" opacity="0.3" />
        {/* Dress */}
        <path d="M-15,30 Q-18,52 -20,75 Q0,83 20,75 Q18,52 15,30 Z" fill="#e03050" />
        <path d="M-3,34 Q0,52 -1,70 Q3,70 4,34 Z" fill="#ff4060" opacity="0.3" />
        <path d="M-9,28 Q0,33 9,28 Q0,30 -9,28 Z" fill="#ffffff" opacity="0.8" />
        {/* Legs */}
        <rect x="-9" y="70" width="7" height="16" rx="3" fill="#fce4c8" />
        <rect x="3" y="70" width="7" height="16" rx="3" fill="#fce4c8" />
        <ellipse cx="-6" cy="86" rx="6" ry="3.5" fill="#5a2a1a" />
        <ellipse cx="6" cy="86" rx="6" ry="3.5" fill="#5a2a1a" />
        {/* Arms - one hand on chin (curious) */}
        <path d="M-15,34 Q-24,40 -22,50" stroke="#fce4c8" strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M15,34 Q22,28 18,14" stroke="#fce4c8" strokeWidth="7" fill="none" strokeLinecap="round" />
        <circle cx="-22" cy="50" r="4" fill="#fce4c8" />
        <circle cx="18" cy="14" r="4" fill="#fce4c8" />
        {/* Head */}
        <circle cx="0" cy="8" r="19" fill="#fce4c8" />
        {/* Hair */}
        <ellipse cx="0" cy="-5" rx="24" ry="19" fill="#f0c030" />
        <ellipse cx="-15" cy="2" rx="12" ry="15" fill="#ffd700" />
        <ellipse cx="15" cy="2" rx="12" ry="15" fill="#ffd700" />
        <ellipse cx="-9" cy="-9" rx="13" ry="12" fill="#ffdd40" />
        <ellipse cx="9" cy="-9" rx="13" ry="12" fill="#ffdd40" />
        <ellipse cx="0" cy="-13" rx="17" ry="10" fill="#f0c030" />
        <circle cx="-19" cy="11" r="6.5" fill="#ffd700" />
        <circle cx="19" cy="11" r="6.5" fill="#ffd700" />
        <circle cx="-17" cy="18" r="5.5" fill="#f0c030" />
        <circle cx="17" cy="18" r="5.5" fill="#f0c030" />
        <circle cx="-14" cy="24" r="5" fill="#ffd700" />
        <circle cx="14" cy="24" r="5" fill="#ffd700" />
        <ellipse cx="-3" cy="-11" rx="6" ry="4" fill="#ffe870" opacity="0.5" />
        {/* Eyes - looking toward porridge, wide and curious */}
        <ellipse cx="-6" cy="5" rx="4" ry="4.5" fill="#ffffff" />
        <ellipse cx="6" cy="5" rx="4" ry="4.5" fill="#ffffff" />
        <circle cx="-4" cy="6" r="3" fill="#4488cc" />
        <circle cx="8" cy="6" r="3" fill="#4488cc" />
        <circle cx="-4" cy="6" r="1.8" fill="#2255aa" />
        <circle cx="8" cy="6" r="1.8" fill="#2255aa" />
        <circle cx="-4" cy="7" r="0.8" fill="#111122" />
        <circle cx="8" cy="7" r="0.8" fill="#111122" />
        <circle cx="-5" cy="4.5" r="1.1" fill="#ffffff" />
        <circle cx="7" cy="4.5" r="1.1" fill="#ffffff" />
        {/* Cheeks */}
        <circle cx="-10" cy="11" r="3.5" fill="#ffb0a0" opacity="0.5" />
        <circle cx="10" cy="11" r="3.5" fill="#ffb0a0" opacity="0.5" />
        {/* Nose */}
        <ellipse cx="0" cy="10" rx="1.8" ry="1.5" fill="#f0b8a0" />
        {/* Mouth - curious */}
        <ellipse cx="1" cy="15" rx="2.5" ry="2" fill="#cc4455" />
      </g>

      {/* Small mouse under the table */}
      <g transform="translate(400, 455)">
        <ellipse cx="0" cy="0" rx="5" ry="3.5" fill="#a0887a" />
        <circle cx="6" cy="-2" r="3" fill="#a0887a" />
        <circle cx="8" cy="-4" r="2" fill="#b09888" />
        <circle cx="8" cy="-4" r="1.2" fill="#d0b8b0" />
        <circle cx="7.5" cy="-2.5" r="0.8" fill="#221111" />
        <ellipse cx="7.5" cy="-1" rx="0.8" ry="0.5" fill="#ffaaaa" />
        <path d="M-5,0 Q-10,3 -13,6" stroke="#a08878" strokeWidth="0.8" fill="none" />
      </g>
    </svg>
  );
}

/* ============================================================
   SCENE 4 — "Eating the little bowl — yum!"
   ============================================================ */
export function GoldilocksScene4({ className = '' }) {
  return (
    <svg viewBox="0 0 800 600" className={`absolute inset-0 w-full h-full ${className}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="s4-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5e0b0" />
          <stop offset="100%" stopColor="#e0c890" />
        </linearGradient>
        <radialGradient id="s4-warm" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#fff8d0" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ffcc80" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Wall background */}
      <rect width="800" height="380" fill="url(#s4-wall)" />
      <rect width="800" height="600" fill="url(#s4-warm)" />
      {/* Wainscoting */}
      <rect x="0" y="280" width="800" height="100" fill="#d4b080" />
      <line x1="0" y1="280" x2="800" y2="280" stroke="#c0a068" strokeWidth="3" />

      {/* Floor */}
      <rect x="0" y="380" width="800" height="220" fill="#c49a64" />
      <line x1="0" y1="420" x2="800" y2="420" stroke="#b08858" strokeWidth="0.8" opacity="0.4" />
      <line x1="0" y1="460" x2="800" y2="460" stroke="#b08858" strokeWidth="0.8" opacity="0.4" />
      <line x1="0" y1="500" x2="800" y2="500" stroke="#b08858" strokeWidth="0.8" opacity="0.4" />

      {/* Window background */}
      <rect x="600" y="80" width="80" height="100" rx="3" fill="#5a3a1a" />
      <rect x="605" y="85" width="70" height="90" rx="2" fill="#b8e0f8" />
      <line x1="640" y1="85" x2="640" y2="175" stroke="#5a3a1a" strokeWidth="2.5" />
      <line x1="605" y1="130" x2="675" y2="130" stroke="#5a3a1a" strokeWidth="2.5" />

      {/* Table section */}
      <g transform="translate(400, 310)">
        {/* Table surface */}
        <rect x="-200" y="-25" width="400" height="10" rx="3" fill="#8b6540" />
        <rect x="-195" y="-23" width="390" height="6" rx="2" fill="#9b7550" />
        {/* Checked tablecloth edge */}
        <path d="M-200,-20 Q-210,0 -205,10 L205,10 Q210,0 200,-20 Z" fill="#dd4444" opacity="0.7" />
        {/* Table legs */}
        <rect x="-180" y="10" width="12" height="85" rx="3" fill="#7a5530" />
        <rect x="168" y="10" width="12" height="85" rx="3" fill="#7a5530" />
      </g>

      {/* Empty big bowl pushed to the left */}
      <g transform="translate(150, 260)">
        <ellipse cx="0" cy="12" rx="42" ry="20" fill="#4466aa" />
        <ellipse cx="0" cy="0" rx="42" ry="14" fill="#6688bb" />
        <ellipse cx="0" cy="0" rx="35" ry="10" fill="#f5e8c8" />
        {/* Empty — just residue */}
        <ellipse cx="0" cy="0" rx="28" ry="7" fill="#f0e0c0" />
        {/* Spoon laid across */}
        <line x1="-30" y1="-5" x2="30" y2="-5" stroke="#c0a880" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* Empty medium bowl */}
      <g transform="translate(310, 263)">
        <ellipse cx="0" cy="10" rx="35" ry="17" fill="#448844" />
        <ellipse cx="0" cy="0" rx="35" ry="11" fill="#66aa66" />
        <ellipse cx="0" cy="0" rx="28" ry="8" fill="#f5e8c8" />
        <ellipse cx="0" cy="0" rx="22" ry="6" fill="#f0e0c0" />
        <line x1="-25" y1="-3" x2="25" y2="-3" stroke="#c0a880" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* === GOLDILOCKS eating from the small bowl - CENTER FOCUS === */}
      <g transform="translate(500, 200)">
        {/* Chair she's sitting in */}
        <rect x="-25" y="60" width="50" height="8" rx="3" fill="#8b6540" />
        <rect x="-22" y="68" width="8" height="50" rx="2" fill="#7a5530" />
        <rect x="14" y="68" width="8" height="50" rx="2" fill="#7a5530" />
        <rect x="-25" y="20" width="50" height="45" rx="5" fill="#8b6540" />
        <rect x="-22" y="23" width="44" height="38" rx="3" fill="#9b7550" />

        {/* Body / Dress */}
        <path d="M-15,35 Q-18,48 -20,65 Q0,72 20,65 Q18,48 15,35 Z" fill="#e03050" />
        <path d="M-3,38 Q0,50 -1,62 Q3,62 4,38 Z" fill="#ff4060" opacity="0.3" />

        {/* Arms holding small bowl */}
        <path d="M-15,40 Q-22,50 -15,58" stroke="#fce4c8" strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M15,40 Q22,50 15,58" stroke="#fce4c8" strokeWidth="7" fill="none" strokeLinecap="round" />
        <circle cx="-15" cy="58" r="4" fill="#fce4c8" />
        <circle cx="15" cy="58" r="4" fill="#fce4c8" />

        {/* Small bowl in her hands */}
        <ellipse cx="0" cy="65" rx="25" ry="12" fill="#bb6622" />
        <ellipse cx="0" cy="58" rx="25" ry="8" fill="#dd8844" />
        <ellipse cx="0" cy="58" rx="20" ry="5.5" fill="#f5e8c8" />
        {/* Porridge in bowl */}
        <ellipse cx="0" cy="57" rx="17" ry="4" fill="#f0e0b0" />
        {/* Spoon */}
        <line x1="12" y1="55" x2="28" y2="42" stroke="#c0a880" strokeWidth="2.5" strokeLinecap="round" />

        {/* Head - tilted slightly with joyful expression */}
        <circle cx="0" cy="10" r="22" fill="#fce4c8" />

        {/* Golden curly hair */}
        <ellipse cx="0" cy="-4" rx="28" ry="22" fill="#f0c030" />
        <ellipse cx="-18" cy="4" rx="14" ry="17" fill="#ffd700" />
        <ellipse cx="18" cy="4" rx="14" ry="17" fill="#ffd700" />
        <ellipse cx="-12" cy="-8" rx="15" ry="14" fill="#ffdd40" />
        <ellipse cx="12" cy="-8" rx="15" ry="14" fill="#ffdd40" />
        <ellipse cx="0" cy="-12" rx="20" ry="12" fill="#f0c030" />
        <circle cx="-22" cy="14" r="7.5" fill="#ffd700" />
        <circle cx="22" cy="14" r="7.5" fill="#ffd700" />
        <circle cx="-20" cy="22" r="6.5" fill="#f0c030" />
        <circle cx="20" cy="22" r="6.5" fill="#f0c030" />
        <circle cx="-17" cy="28" r="5.5" fill="#ffd700" />
        <circle cx="17" cy="28" r="5.5" fill="#ffd700" />
        <ellipse cx="-5" cy="-10" rx="8" ry="5" fill="#ffe870" opacity="0.5" />

        {/* Eyes - closed in enjoyment (happy arcs) */}
        <path d="M-10,7 Q-7,3 -3,7" stroke="#3a2a1a" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M3,7 Q7,3 10,7" stroke="#3a2a1a" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Eyelashes on closed eyes */}
        <line x1="-10" y1="7" x2="-11" y2="4" stroke="#3a2a1a" strokeWidth="1" />
        <line x1="-3" y1="7" x2="-2" y2="4" stroke="#3a2a1a" strokeWidth="1" />
        <line x1="3" y1="7" x2="2" y2="4" stroke="#3a2a1a" strokeWidth="1" />
        <line x1="10" y1="7" x2="11" y2="4" stroke="#3a2a1a" strokeWidth="1" />

        {/* Rosy cheeks - extra rosy from happiness */}
        <circle cx="-13" cy="14" r="5" fill="#ffb0a0" opacity="0.6" />
        <circle cx="13" cy="14" r="5" fill="#ffb0a0" opacity="0.6" />

        {/* Nose */}
        <ellipse cx="0" cy="12" rx="2" ry="1.7" fill="#f0b8a0" />

        {/* Big happy smile */}
        <path d="M-8,18 Q0,26 8,18" stroke="#cc4455" strokeWidth="2" fill="#dd5566" strokeLinecap="round" />
        <path d="M-5,19 Q0,22 5,19" fill="#ffffff" opacity="0.6" />

        {/* Joy sparkles around */}
        <text x="-35" y="-15" fontSize="14" fill="#ffcc00" opacity="0.7">*</text>
        <text x="30" y="-10" fontSize="12" fill="#ffcc00" opacity="0.6">*</text>
        <text x="-30" y="30" fontSize="10" fill="#ffcc00" opacity="0.5">*</text>
        <text x="35" y="25" fontSize="11" fill="#ffcc00" opacity="0.6">*</text>
      </g>

      {/* Cute detail: crumbs on table */}
      <circle cx="350" cy="286" r="1.5" fill="#d4c4a0" />
      <circle cx="370" cy="288" r="1" fill="#d4c4a0" />
      <circle cx="440" cy="284" r="1.2" fill="#d4c4a0" />
    </svg>
  );
}

/* ============================================================
   SCENE 5 — "Three chairs"
   ============================================================ */
export function GoldilocksScene5({ className = '' }) {
  return (
    <svg viewBox="0 0 800 600" className={`absolute inset-0 w-full h-full ${className}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="s5-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0ddb0" />
          <stop offset="100%" stopColor="#dcc898" />
        </linearGradient>
        <radialGradient id="s5-fire" cx="50%" cy="80%" r="50%">
          <stop offset="0%" stopColor="#ff8830" stopOpacity="0.4" />
          <stop offset="60%" stopColor="#ff6600" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#ff4400" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Wall */}
      <rect width="800" height="400" fill="url(#s5-wall)" />
      {/* Warm fireplace glow */}
      <rect width="800" height="600" fill="url(#s5-fire)" />

      {/* Wainscoting */}
      <rect x="0" y="300" width="800" height="100" fill="#d4b080" />
      <line x1="0" y1="300" x2="800" y2="300" stroke="#c0a068" strokeWidth="3" />

      {/* Floor */}
      <rect x="0" y="400" width="800" height="200" fill="#b08858" />
      <line x1="0" y1="440" x2="800" y2="440" stroke="#a07848" strokeWidth="0.8" opacity="0.4" />
      <line x1="0" y1="480" x2="800" y2="480" stroke="#a07848" strokeWidth="0.8" opacity="0.4" />
      <line x1="0" y1="520" x2="800" y2="520" stroke="#a07848" strokeWidth="0.8" opacity="0.4" />

      {/* Rug */}
      <ellipse cx="400" cy="480" rx="250" ry="60" fill="#994433" />
      <ellipse cx="400" cy="480" rx="230" ry="50" fill="#aa5544" />
      <ellipse cx="400" cy="480" rx="200" ry="38" fill="#bb6655" />
      {/* Rug pattern */}
      <ellipse cx="400" cy="480" rx="170" ry="28" fill="none" stroke="#ddaa88" strokeWidth="2" />
      <ellipse cx="400" cy="480" rx="130" ry="20" fill="none" stroke="#ddaa88" strokeWidth="1.5" />

      {/* Fireplace */}
      <g transform="translate(400, 180)">
        <rect x="-90" y="-50" width="180" height="170" rx="5" fill="#8b6540" />
        <rect x="-80" y="-40" width="160" height="140" rx="3" fill="#3a2a1a" />
        {/* Mantel */}
        <rect x="-100" y="-60" width="200" height="15" rx="4" fill="#9b7550" />
        {/* Fire */}
        <g>
          <ellipse cx="0" cy="80" rx="50" ry="20" fill="#ff4400" opacity="0.6">
            <animate attributeName="rx" values="50;55;48;52;50" dur="2s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="-15" cy="60" rx="20" ry="35" fill="#ff6600" opacity="0.8">
            <animate attributeName="ry" values="35;40;33;38;35" dur="1.5s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="10" cy="55" rx="18" ry="40" fill="#ff8800" opacity="0.7">
            <animate attributeName="ry" values="40;35;42;37;40" dur="1.8s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="0" cy="50" rx="12" ry="30" fill="#ffaa00" opacity="0.6">
            <animate attributeName="ry" values="30;35;28;33;30" dur="1.3s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="-5" cy="45" rx="8" ry="20" fill="#ffcc44" opacity="0.5">
            <animate attributeName="ry" values="20;25;18;22;20" dur="1.6s" repeatCount="indefinite" />
          </ellipse>
          {/* Logs */}
          <rect x="-40" y="85" width="35" height="10" rx="5" fill="#5a3a20" />
          <rect x="5" y="88" width="38" height="10" rx="5" fill="#4a2a15" />
        </g>
      </g>

      {/* Pictures on wall */}
      <rect x="80" y="100" width="50" height="40" rx="2" fill="#7a5530" />
      <rect x="84" y="104" width="42" height="32" rx="1" fill="#c8e8c8" />
      <circle cx="105" cy="115" r="8" fill="#5a9a5a" />
      <rect x="95" y="120" width="20" height="12" fill="#7aba7a" />

      <rect x="650" y="90" width="55" height="45" rx="2" fill="#7a5530" />
      <rect x="654" y="94" width="47" height="37" rx="1" fill="#e8d8c8" />
      {/* Little bear portrait */}
      <circle cx="677" cy="108" r="8" fill="#9b6b3a" />
      <circle cx="672" cy="103" r="3" fill="#9b6b3a" />
      <circle cx="682" cy="103" r="3" fill="#9b6b3a" />

      {/* Bookshelf */}
      <g transform="translate(700, 220)">
        <rect x="-30" y="0" width="60" height="80" fill="#7a5530" />
        <rect x="-27" y="3" width="54" height="36" fill="#5a3a20" />
        <rect x="-27" y="42" width="54" height="35" fill="#5a3a20" />
        {/* Books */}
        <rect x="-24" y="5" width="8" height="32" rx="1" fill="#cc4444" />
        <rect x="-14" y="8" width="7" height="29" rx="1" fill="#4488cc" />
        <rect x="-5" y="6" width="9" height="31" rx="1" fill="#44aa44" />
        <rect x="6" y="10" width="6" height="27" rx="1" fill="#ddaa44" />
        <rect x="14" y="7" width="8" height="30" rx="1" fill="#aa44aa" />
        <rect x="-24" y="44" width="10" height="30" rx="1" fill="#dd8844" />
        <rect x="-12" y="47" width="7" height="27" rx="1" fill="#6688aa" />
        <rect x="-3" y="45" width="8" height="29" rx="1" fill="#aa6644" />
        <rect x="7" y="48" width="9" height="26" rx="1" fill="#44aaaa" />
      </g>

      {/* === BIG ARMCHAIR (Papa's) === */}
      <g transform="translate(180, 310)">
        {/* Chair back */}
        <path d="M-55,-80 Q-60,-90 -55,-100 Q0,-115 55,-100 Q60,-90 55,-80 L55,20 L-55,20 Z" fill="#6b3a1a" />
        <path d="M-48,-75 Q0,-95 48,-75 L48,15 L-48,15 Z" fill="#884422" />
        {/* Seat cushion */}
        <ellipse cx="0" cy="20" rx="60" ry="18" fill="#7a4428" />
        <ellipse cx="0" cy="15" rx="55" ry="14" fill="#994830" />
        {/* Armrests */}
        <path d="M-55,-30 Q-70,-25 -70,0 Q-70,15 -58,20" fill="#6b3a1a" />
        <path d="M55,-30 Q70,-25 70,0 Q70,15 58,20" fill="#6b3a1a" />
        <ellipse cx="-65" cy="-5" rx="12" ry="20" fill="#7a4428" />
        <ellipse cx="65" cy="-5" rx="12" ry="20" fill="#7a4428" />
        {/* Legs */}
        <rect x="-50" y="30" width="10" height="35" rx="3" fill="#5a2a10" />
        <rect x="40" y="30" width="10" height="35" rx="3" fill="#5a2a10" />
        {/* Button detail */}
        <circle cx="0" cy="-40" r="3" fill="#5a2a10" />
        <circle cx="-20" cy="-30" r="2.5" fill="#5a2a10" />
        <circle cx="20" cy="-30" r="2.5" fill="#5a2a10" />
      </g>

      {/* === MEDIUM ROCKING CHAIR (Mama's) === */}
      <g transform="translate(450, 340)">
        {/* Rocking base */}
        <path d="M-50,50 Q0,60 50,50" stroke="#5a3a1a" strokeWidth="5" fill="none" strokeLinecap="round" />
        {/* Chair back */}
        <path d="M-30,-55 Q0,-65 30,-55 L30,5 L-30,5 Z" fill="#7a5530" />
        <path d="M-25,-50 Q0,-58 25,-50 L25,0 L-25,0 Z" fill="#8b6540" />
        {/* Vertical slats */}
        <rect x="-15" y="-48" width="4" height="46" rx="1" fill="#7a5530" />
        <rect x="5" y="-48" width="4" height="46" rx="1" fill="#7a5530" />
        {/* Seat */}
        <ellipse cx="0" cy="10" rx="38" ry="12" fill="#8b6540" />
        <ellipse cx="0" cy="6" rx="35" ry="10" fill="#9b7550" />
        {/* Seat cushion */}
        <ellipse cx="0" cy="5" rx="30" ry="8" fill="#cc6666" />
        {/* Legs */}
        <rect x="-30" y="15" width="7" height="35" rx="2" fill="#6b4226" />
        <rect x="23" y="15" width="7" height="35" rx="2" fill="#6b4226" />
      </g>

      {/* === SMALL WOODEN CHAIR (Baby's) === */}
      <g transform="translate(630, 370)">
        {/* Chair back */}
        <rect x="-18" y="-35" width="36" height="40" rx="4" fill="#c49a64" />
        <rect x="-14" y="-31" width="28" height="32" rx="3" fill="#d4aa74" />
        {/* Heart cutout in back */}
        <path d="M0,-22 Q-6,-30 -10,-22 Q-10,-16 0,-10 Q10,-16 10,-22 Q6,-30 0,-22 Z" fill="#c49a64" />
        {/* Seat */}
        <rect x="-22" y="5" width="44" height="8" rx="3" fill="#c49a64" />
        <rect x="-20" y="6" width="40" height="5" rx="2" fill="#d4aa74" />
        {/* Legs */}
        <rect x="-18" y="13" width="5" height="30" rx="2" fill="#b08858" />
        <rect x="13" y="13" width="5" height="30" rx="2" fill="#b08858" />
        {/* Small cushion */}
        <ellipse cx="0" cy="5" rx="16" ry="5" fill="#6699cc" />
      </g>

      {/* === GOLDILOCKS trying the big chair === */}
      <g transform="translate(180, 250)">
        {/* She's climbing up - legs dangling */}
        {/* Dress */}
        <path d="M-14,28 Q-17,45 -19,62 Q0,68 19,62 Q17,45 14,28 Z" fill="#e03050" />
        <path d="M-8,26 Q0,30 8,26 Q0,29 -8,26 Z" fill="#ffffff" opacity="0.8" />
        {/* Legs dangling */}
        <rect x="-10" y="58" width="7" height="22" rx="3" fill="#fce4c8" />
        <rect x="3" y="60" width="7" height="20" rx="3" fill="#fce4c8" />
        <ellipse cx="-7" cy="80" rx="5.5" ry="3" fill="#5a2a1a" />
        <ellipse cx="6" cy="80" rx="5.5" ry="3" fill="#5a2a1a" />
        {/* Arms gripping armrest */}
        <path d="M-14,32 Q-28,28 -35,22" stroke="#fce4c8" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M14,32 Q28,28 35,22" stroke="#fce4c8" strokeWidth="6" fill="none" strokeLinecap="round" />
        <circle cx="-35" cy="22" r="4" fill="#fce4c8" />
        <circle cx="35" cy="22" r="4" fill="#fce4c8" />
        {/* Head */}
        <circle cx="0" cy="8" r="18" fill="#fce4c8" />
        {/* Hair */}
        <ellipse cx="0" cy="-3" rx="23" ry="18" fill="#f0c030" />
        <ellipse cx="-14" cy="3" rx="11" ry="14" fill="#ffd700" />
        <ellipse cx="14" cy="3" rx="11" ry="14" fill="#ffd700" />
        <ellipse cx="-8" cy="-7" rx="12" ry="11" fill="#ffdd40" />
        <ellipse cx="8" cy="-7" rx="12" ry="11" fill="#ffdd40" />
        <ellipse cx="0" cy="-11" rx="16" ry="10" fill="#f0c030" />
        <circle cx="-18" cy="12" r="6" fill="#ffd700" />
        <circle cx="18" cy="12" r="6" fill="#ffd700" />
        <circle cx="-16" cy="19" r="5" fill="#f0c030" />
        <circle cx="16" cy="19" r="5" fill="#f0c030" />
        <ellipse cx="-4" cy="-9" rx="6" ry="3.5" fill="#ffe870" opacity="0.5" />
        {/* Eyes - wide, "this is too big!" */}
        <ellipse cx="-5" cy="5" rx="3.5" ry="4" fill="#ffffff" />
        <ellipse cx="5" cy="5" rx="3.5" ry="4" fill="#ffffff" />
        <circle cx="-5" cy="6" r="2.5" fill="#4488cc" />
        <circle cx="5" cy="6" r="2.5" fill="#4488cc" />
        <circle cx="-5" cy="6" r="1.5" fill="#2255aa" />
        <circle cx="5" cy="6" r="1.5" fill="#2255aa" />
        <circle cx="-6" cy="4.5" r="1" fill="#ffffff" />
        <circle cx="4" cy="4.5" r="1" fill="#ffffff" />
        {/* Cheeks */}
        <circle cx="-9" cy="10" r="3" fill="#ffb0a0" opacity="0.5" />
        <circle cx="9" cy="10" r="3" fill="#ffb0a0" opacity="0.5" />
        {/* Nose */}
        <ellipse cx="0" cy="9" rx="1.8" ry="1.4" fill="#f0b8a0" />
        {/* Mouth - uncertain frown */}
        <path d="M-4,14 Q0,12 4,14" stroke="#cc4455" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/* ============================================================
   SCENE 6 — "Oh no! The chair broke!"
   ============================================================ */
export function GoldilocksScene6({ className = '' }) {
  return (
    <svg viewBox="0 0 800 600" className={`absolute inset-0 w-full h-full ${className}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="s6-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0ddb0" />
          <stop offset="100%" stopColor="#dcc898" />
        </linearGradient>
        <radialGradient id="s6-fire" cx="30%" cy="60%" r="50%">
          <stop offset="0%" stopColor="#ff8830" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#ff6600" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Wall */}
      <rect width="800" height="400" fill="url(#s6-wall)" />
      <rect width="800" height="600" fill="url(#s6-fire)" />
      <rect x="0" y="300" width="800" height="100" fill="#d4b080" />
      <line x1="0" y1="300" x2="800" y2="300" stroke="#c0a068" strokeWidth="3" />

      {/* Floor */}
      <rect x="0" y="400" width="800" height="200" fill="#b08858" />
      <line x1="0" y1="440" x2="800" y2="440" stroke="#a07848" strokeWidth="0.8" opacity="0.4" />
      <line x1="0" y1="480" x2="800" y2="480" stroke="#a07848" strokeWidth="0.8" opacity="0.4" />

      {/* Rug */}
      <ellipse cx="400" cy="490" rx="220" ry="55" fill="#994433" />
      <ellipse cx="400" cy="490" rx="200" ry="45" fill="#aa5544" />
      <ellipse cx="400" cy="490" rx="170" ry="32" fill="#bb6655" />

      {/* Big armchair in background (left) */}
      <g transform="translate(120, 320)" opacity="0.8">
        <path d="M-50,-70 Q0,-85 50,-70 L50,15 L-50,15 Z" fill="#6b3a1a" />
        <path d="M-43,-65 Q0,-78 43,-65 L43,10 L-43,10 Z" fill="#884422" />
        <ellipse cx="0" cy="15" rx="55" ry="16" fill="#7a4428" />
        <path d="M-50,-25 Q-65,-20 -65,0 Q-65,12 -53,15" fill="#6b3a1a" />
        <path d="M50,-25 Q65,-20 65,0 Q65,12 53,15" fill="#6b3a1a" />
        <rect x="-45" y="25" width="9" height="30" rx="3" fill="#5a2a10" />
        <rect x="36" y="25" width="9" height="30" rx="3" fill="#5a2a10" />
      </g>

      {/* Medium rocking chair in background (right) */}
      <g transform="translate(650, 340)" opacity="0.8">
        <path d="M-45,45 Q0,55 45,45" stroke="#5a3a1a" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M-28,-50 Q0,-58 28,-50 L28,3 L-28,3 Z" fill="#7a5530" />
        <path d="M-23,-45 Q0,-52 23,-45 L23,-2 L-23,-2 Z" fill="#8b6540" />
        <ellipse cx="0" cy="6" rx="34" ry="10" fill="#8b6540" />
        <ellipse cx="0" cy="3" rx="28" ry="7" fill="#cc6666" />
        <rect x="-28" y="12" width="6" height="30" rx="2" fill="#6b4226" />
        <rect x="22" y="12" width="6" height="30" rx="2" fill="#6b4226" />
      </g>

      {/* === BROKEN SMALL CHAIR PIECES === */}
      <g transform="translate(400, 440)">
        {/* Seat piece - tilted */}
        <rect x="-25" y="-5" width="44" height="8" rx="3" fill="#c49a64" transform="rotate(-15,0,0)" />
        {/* Back piece - fallen to the side */}
        <rect x="30" y="-30" width="32" height="8" rx="3" fill="#d4aa74" transform="rotate(70,30,-30)" />
        <rect x="20" y="-50" width="28" height="6" rx="3" fill="#c49a64" transform="rotate(65,20,-50)" />
        {/* Heart from back (broken off) */}
        <path d="M55,-35 Q52,-40 48,-35 Q48,-32 55,-27 Q62,-32 62,-35 Q58,-40 55,-35 Z" fill="#c49a64" transform="rotate(20,55,-35)" />
        {/* Leg pieces scattered */}
        <rect x="-40" y="10" width="5" height="25" rx="2" fill="#b08858" transform="rotate(-30,-40,10)" />
        <rect x="20" y="15" width="5" height="22" rx="2" fill="#b08858" transform="rotate(45,20,15)" />
        <rect x="-15" y="5" width="5" height="20" rx="2" fill="#b08858" transform="rotate(10,-15,5)" />
        <rect x="40" y="10" width="5" height="18" rx="2" fill="#b08858" transform="rotate(-60,40,10)" />
        {/* Small cushion fallen off */}
        <ellipse cx="-30" cy="20" rx="14" ry="5" fill="#6699cc" transform="rotate(-10,-30,20)" />
        {/* Splinter bits */}
        <rect x="5" y="8" width="8" height="2" rx="1" fill="#c49a64" transform="rotate(25,5,8)" />
        <rect x="-10" y="15" width="6" height="2" rx="1" fill="#d4aa74" transform="rotate(-40,-10,15)" />

        {/* Motion lines / impact stars */}
        <g opacity="0.6">
          <line x1="-15" y1="-20" x2="-30" y2="-35" stroke="#ffcc00" strokeWidth="2" strokeLinecap="round" />
          <line x1="15" y1="-20" x2="30" y2="-35" stroke="#ffcc00" strokeWidth="2" strokeLinecap="round" />
          <line x1="0" y1="-25" x2="0" y2="-42" stroke="#ffcc00" strokeWidth="2" strokeLinecap="round" />
          <line x1="-25" y1="-10" x2="-42" y2="-15" stroke="#ffcc00" strokeWidth="2" strokeLinecap="round" />
          <line x1="25" y1="-10" x2="42" y2="-15" stroke="#ffcc00" strokeWidth="2" strokeLinecap="round" />
        </g>
        {/* Stars */}
        <text x="-40" y="-30" fontSize="16" fill="#ffcc00">*</text>
        <text x="30" y="-40" fontSize="14" fill="#ffcc00">*</text>
        <text x="5" y="-45" fontSize="12" fill="#ffdd44">*</text>
        <text x="-50" y="-5" fontSize="10" fill="#ffdd44">*</text>
      </g>

      {/* === GOLDILOCKS on the floor - surprised "oops!" === */}
      <g transform="translate(380, 390)">
        {/* Shadow */}
        <ellipse cx="0" cy="60" rx="30" ry="8" fill="#8a6838" opacity="0.3" />

        {/* Dress (sitting on floor, spread out) */}
        <path d="M-20,20 Q-30,40 -35,55 Q0,65 35,55 Q30,40 20,20 Z" fill="#e03050" />
        <path d="M-5,22 Q0,38 -2,50 Q4,50 5,22 Z" fill="#ff4060" opacity="0.3" />

        {/* Legs sticking out front */}
        <rect x="-18" y="45" width="7" height="20" rx="3" fill="#fce4c8" transform="rotate(-20,-14,45)" />
        <rect x="10" y="45" width="7" height="20" rx="3" fill="#fce4c8" transform="rotate(20,14,45)" />
        <ellipse cx="-22" cy="63" rx="6" ry="3.5" fill="#5a2a1a" transform="rotate(-20,-22,63)" />
        <ellipse cx="18" cy="63" rx="6" ry="3.5" fill="#5a2a1a" transform="rotate(20,18,63)" />

        {/* Arms thrown up in surprise */}
        <path d="M-16,22 Q-30,10 -35,0" stroke="#fce4c8" strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M16,22 Q30,10 35,0" stroke="#fce4c8" strokeWidth="7" fill="none" strokeLinecap="round" />
        <circle cx="-35" cy="0" r="4.5" fill="#fce4c8" />
        <circle cx="35" cy="0" r="4.5" fill="#fce4c8" />

        {/* Head */}
        <circle cx="0" cy="-2" r="20" fill="#fce4c8" />

        {/* Hair - slightly disheveled */}
        <ellipse cx="0" cy="-14" rx="26" ry="20" fill="#f0c030" />
        <ellipse cx="-17" cy="-4" rx="13" ry="16" fill="#ffd700" />
        <ellipse cx="17" cy="-4" rx="13" ry="16" fill="#ffd700" />
        <ellipse cx="-10" cy="-16" rx="14" ry="12" fill="#ffdd40" />
        <ellipse cx="10" cy="-16" rx="14" ry="12" fill="#ffdd40" />
        <ellipse cx="0" cy="-20" rx="18" ry="11" fill="#f0c030" />
        <circle cx="-21" cy="6" r="7" fill="#ffd700" />
        <circle cx="21" cy="6" r="7" fill="#ffd700" />
        <circle cx="-19" cy="14" r="6" fill="#f0c030" />
        <circle cx="19" cy="14" r="6" fill="#f0c030" />
        {/* Extra messy curl sticking up */}
        <ellipse cx="5" cy="-28" rx="5" ry="8" fill="#ffd700" transform="rotate(15,5,-28)" />
        <ellipse cx="-8" cy="-26" rx="4" ry="7" fill="#ffdd40" transform="rotate(-10,-8,-26)" />

        {/* Eyes - wide surprised circles */}
        <ellipse cx="-7" cy="-5" rx="5" ry="5.5" fill="#ffffff" />
        <ellipse cx="7" cy="-5" rx="5" ry="5.5" fill="#ffffff" />
        <circle cx="-7" cy="-4" r="3.5" fill="#4488cc" />
        <circle cx="7" cy="-4" r="3.5" fill="#4488cc" />
        <circle cx="-7" cy="-4" r="2.2" fill="#2255aa" />
        <circle cx="7" cy="-4" r="2.2" fill="#2255aa" />
        <circle cx="-7" cy="-3" r="1.2" fill="#111122" />
        <circle cx="7" cy="-3" r="1.2" fill="#111122" />
        {/* Big sparkle highlights */}
        <circle cx="-9" cy="-6" r="1.5" fill="#ffffff" />
        <circle cx="5" cy="-6" r="1.5" fill="#ffffff" />
        <circle cx="-6" cy="-2" r="0.8" fill="#ffffff" />
        <circle cx="8" cy="-2" r="0.8" fill="#ffffff" />

        {/* Cheeks */}
        <circle cx="-12" cy="3" r="4" fill="#ffb0a0" opacity="0.6" />
        <circle cx="12" cy="3" r="4" fill="#ffb0a0" opacity="0.6" />

        {/* Nose */}
        <ellipse cx="0" cy="1" rx="2" ry="1.6" fill="#f0b8a0" />

        {/* Mouth - big surprised "O" */}
        <ellipse cx="0" cy="8" rx="5" ry="6" fill="#cc4455" />
        <ellipse cx="0" cy="7" rx="3.5" ry="4" fill="#dd6070" />
      </g>

      {/* Fireplace in background (left) */}
      <g transform="translate(120, 200)">
        <rect x="-70" y="-40" width="140" height="130" rx="4" fill="#8b6540" />
        <rect x="-60" y="-30" width="120" height="110" rx="3" fill="#3a2a1a" />
        <rect x="-78" y="-48" width="156" height="12" rx="3" fill="#9b7550" />
        {/* Dim fire */}
        <ellipse cx="0" cy="60" rx="35" ry="15" fill="#ff6600" opacity="0.4" />
        <ellipse cx="0" cy="50" rx="20" ry="25" fill="#ff8800" opacity="0.3" />
      </g>
    </svg>
  );
}

/* ============================================================
   SCENE 7 — "Three beds upstairs"
   ============================================================ */
export function GoldilocksScene7({ className = '' }) {
  return (
    <svg viewBox="0 0 800 600" className={`absolute inset-0 w-full h-full ${className}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="s7-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3060" />
          <stop offset="100%" stopColor="#504080" />
        </linearGradient>
        <radialGradient id="s7-moon" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fffff0" />
          <stop offset="70%" stopColor="#ffeecc" />
          <stop offset="100%" stopColor="#ffddaa" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="s7-moonlight" cx="85%" cy="20%" r="40%">
          <stop offset="0%" stopColor="#eeeeff" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#8888cc" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Dark wall - nighttime palette */}
      <rect width="800" height="400" fill="url(#s7-wall)" />
      <rect width="800" height="600" fill="url(#s7-moonlight)" />

      {/* Floor */}
      <rect x="0" y="400" width="800" height="200" fill="#4a3860" />
      <line x1="0" y1="430" x2="800" y2="430" stroke="#3a2850" strokeWidth="0.8" opacity="0.3" />
      <line x1="0" y1="460" x2="800" y2="460" stroke="#3a2850" strokeWidth="0.8" opacity="0.3" />

      {/* Wainscoting - dark */}
      <rect x="0" y="310" width="800" height="90" fill="#453868" />
      <line x1="0" y1="310" x2="800" y2="310" stroke="#3a3060" strokeWidth="2" />

      {/* Window with moonlight */}
      <g transform="translate(680, 100)">
        <rect x="-35" y="-45" width="70" height="90" rx="3" fill="#3a2850" />
        <rect x="-30" y="-40" width="60" height="80" rx="2" fill="#1a1a40" />
        <line x1="0" y1="-40" x2="0" y2="40" stroke="#3a2850" strokeWidth="2" />
        <line x1="-30" y1="0" x2="30" y2="0" stroke="#3a2850" strokeWidth="2" />
        {/* Moon visible through window */}
        <circle cx="15" cy="-15" r="12" fill="url(#s7-moon)" />
        {/* Stars through window */}
        <circle cx="-15" cy="-25" r="1.5" fill="#ffffff" opacity="0.8" />
        <circle cx="-20" cy="15" r="1" fill="#ffffff" opacity="0.6" />
        <circle cx="5" cy="25" r="1.2" fill="#ffffff" opacity="0.7" />
        {/* Curtains */}
        <path d="M-30,-40 Q-22,-25 -28,-10 L-30,-10 Z" fill="#6a4488" opacity="0.7" />
        <path d="M30,-40 Q22,-25 28,-10 L30,-10 Z" fill="#6a4488" opacity="0.7" />
      </g>

      {/* === BIG BED (Papa's) - four poster === */}
      <g transform="translate(130, 280)">
        {/* Bedposts */}
        <rect x="-70" y="-120" width="10" height="200" rx="3" fill="#5a3a20" />
        <rect x="60" y="-120" width="10" height="200" rx="3" fill="#5a3a20" />
        {/* Post finials */}
        <circle cx="-65" cy="-125" r="8" fill="#6b4528" />
        <circle cx="65" cy="-125" r="8" fill="#6b4528" />
        {/* Canopy top bar */}
        <rect x="-70" y="-128" width="140" height="6" rx="2" fill="#5a3a20" />
        {/* Headboard */}
        <path d="M-60,-100 Q0,-120 60,-100 L60,-20 L-60,-20 Z" fill="#6b4528" />
        <path d="M-50,-95 Q0,-112 50,-95 L50,-25 L-50,-25 Z" fill="#7a5535" />
        {/* Mattress */}
        <rect x="-65" y="-20" width="130" height="40" rx="5" fill="#ffffff" />
        <rect x="-63" y="-18" width="126" height="36" rx="4" fill="#e8e0d8" />
        {/* Blanket */}
        <rect x="-65" y="-5" width="130" height="30" rx="5" fill="#445588" />
        <rect x="-62" y="-2" width="124" height="24" rx="4" fill="#5566aa" />
        {/* Pillow */}
        <ellipse cx="0" cy="-12" rx="40" ry="10" fill="#f0ebe0" />
        <ellipse cx="0" cy="-13" rx="35" ry="8" fill="#f8f4ec" />
        {/* Bed legs */}
        <rect x="-65" y="20" width="8" height="25" rx="2" fill="#5a3a20" />
        <rect x="57" y="20" width="8" height="25" rx="2" fill="#5a3a20" />
      </g>

      {/* === MEDIUM BED (Mama's) - quilted cover === */}
      <g transform="translate(400, 310)">
        {/* Headboard */}
        <path d="M-50,-80 Q0,-95 50,-80 L50,-15 L-50,-15 Z" fill="#7a5535" />
        <path d="M-42,-75 Q0,-88 42,-75 L42,-20 L-42,-20 Z" fill="#8b6545" />
        {/* Mattress */}
        <rect x="-55" y="-15" width="110" height="35" rx="4" fill="#e8e0d8" />
        {/* Quilted blanket */}
        <rect x="-55" y="0" width="110" height="25" rx="4" fill="#88445a" />
        <rect x="-52" y="3" width="104" height="19" rx="3" fill="#aa5570" />
        {/* Quilt pattern - diamond shapes */}
        <path d="M-40,12 L-25,5 L-10,12 L-25,19 Z" fill="#995060" opacity="0.5" />
        <path d="M-10,12 L5,5 L20,12 L5,19 Z" fill="#995060" opacity="0.5" />
        <path d="M20,12 L35,5 L50,12 L35,19 Z" fill="#995060" opacity="0.5" />
        {/* Pillow */}
        <ellipse cx="0" cy="-8" rx="35" ry="8" fill="#f0ebe0" />
        <ellipse cx="0" cy="-9" rx="30" ry="6.5" fill="#f8f4ec" />
        {/* Bed legs */}
        <rect x="-52" y="22" width="7" height="22" rx="2" fill="#6b4226" />
        <rect x="45" y="22" width="7" height="22" rx="2" fill="#6b4226" />
      </g>

      {/* === SMALL BED (Baby's) - with teddy === */}
      <g transform="translate(630, 340)">
        {/* Headboard */}
        <path d="M-35,-60 Q0,-72 35,-60 L35,-10 L-35,-10 Z" fill="#c49a64" />
        <path d="M-28,-55 Q0,-65 28,-55 L28,-15 L-28,-15 Z" fill="#d4aa74" />
        {/* Heart cutout */}
        <path d="M0,-45 Q-6,-52 -10,-45 Q-10,-40 0,-34 Q10,-40 10,-45 Q6,-52 0,-45 Z" fill="#c49a64" />
        {/* Mattress */}
        <rect x="-40" y="-10" width="80" height="28" rx="4" fill="#e8e0d8" />
        {/* Blanket - cozy patchwork */}
        <rect x="-40" y="2" width="80" height="20" rx="4" fill="#5588aa" />
        <rect x="-37" y="5" width="74" height="14" rx="3" fill="#6699bb" />
        {/* Stars on blanket */}
        <text x="-25" y="16" fontSize="8" fill="#aaccee" opacity="0.6">*</text>
        <text x="-5" y="14" fontSize="6" fill="#aaccee" opacity="0.5">*</text>
        <text x="15" y="16" fontSize="7" fill="#aaccee" opacity="0.6">*</text>
        {/* Pillow */}
        <ellipse cx="0" cy="-5" rx="25" ry="7" fill="#f0ebe0" />
        <ellipse cx="0" cy="-6" rx="20" ry="5.5" fill="#f8f4ec" />
        {/* Teddy bear on the bed */}
        <g transform="translate(20, -5)">
          <ellipse cx="0" cy="3" rx="6" ry="7" fill="#c4956a" />
          <circle cx="0" cy="-5" r="5" fill="#c4956a" />
          <circle cx="-4" cy="-9" r="2" fill="#c4956a" />
          <circle cx="4" cy="-9" r="2" fill="#c4956a" />
          <circle cx="-4" cy="-9" r="1" fill="#d4a57a" />
          <circle cx="4" cy="-9" r="1" fill="#d4a57a" />
          <circle cx="-2" cy="-6" r="1" fill="#2a1a0a" />
          <circle cx="2" cy="-6" r="1" fill="#2a1a0a" />
          <ellipse cx="0" cy="-3.5" rx="1.2" ry="0.8" fill="#2a1a0a" />
        </g>
        {/* Bed legs */}
        <rect x="-38" y="20" width="6" height="18" rx="2" fill="#b08858" />
        <rect x="32" y="20" width="6" height="18" rx="2" fill="#b08858" />
      </g>

      {/* === GOLDILOCKS feeling the big bed === */}
      <g transform="translate(180, 230)">
        {/* Dress */}
        <path d="M-14,28 Q-17,45 -19,62 Q0,68 19,62 Q17,45 14,28 Z" fill="#e03050" />
        <path d="M-8,26 Q0,30 8,26 Q0,29 -8,26 Z" fill="#ffffff" opacity="0.8" />
        {/* Legs */}
        <rect x="-9" y="58" width="7" height="18" rx="3" fill="#fce4c8" />
        <rect x="3" y="58" width="7" height="18" rx="3" fill="#fce4c8" />
        <ellipse cx="-6" cy="76" rx="5.5" ry="3" fill="#5a2a1a" />
        <ellipse cx="6" cy="76" rx="5.5" ry="3" fill="#5a2a1a" />
        {/* Right arm pressing on mattress */}
        <path d="M-14,32 Q-24,28 -26,20" stroke="#fce4c8" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M14,32 Q30,25 45,20" stroke="#fce4c8" strokeWidth="6" fill="none" strokeLinecap="round" />
        <circle cx="-26" cy="20" r="4" fill="#fce4c8" />
        <circle cx="45" cy="20" r="4" fill="#fce4c8" />
        {/* Head */}
        <circle cx="0" cy="8" r="18" fill="#fce4c8" />
        {/* Hair */}
        <ellipse cx="0" cy="-4" rx="24" ry="18" fill="#f0c030" />
        <ellipse cx="-15" cy="2" rx="12" ry="15" fill="#ffd700" />
        <ellipse cx="15" cy="2" rx="12" ry="15" fill="#ffd700" />
        <ellipse cx="-9" cy="-8" rx="13" ry="11" fill="#ffdd40" />
        <ellipse cx="9" cy="-8" rx="13" ry="11" fill="#ffdd40" />
        <ellipse cx="0" cy="-12" rx="16" ry="10" fill="#f0c030" />
        <circle cx="-18" cy="12" r="6" fill="#ffd700" />
        <circle cx="18" cy="12" r="6" fill="#ffd700" />
        <circle cx="-16" cy="19" r="5" fill="#f0c030" />
        <circle cx="16" cy="19" r="5" fill="#f0c030" />
        <ellipse cx="-3" cy="-9" rx="6" ry="3.5" fill="#ffe870" opacity="0.5" />
        {/* Eyes - scrunched "not right" face */}
        <ellipse cx="-6" cy="4" rx="3.5" ry="4" fill="#ffffff" />
        <ellipse cx="6" cy="4" rx="3.5" ry="4" fill="#ffffff" />
        <circle cx="-6" cy="5" r="2.5" fill="#4488cc" />
        <circle cx="6" cy="5" r="2.5" fill="#4488cc" />
        <circle cx="-6" cy="5" r="1.5" fill="#2255aa" />
        <circle cx="6" cy="5" r="1.5" fill="#2255aa" />
        <circle cx="-7" cy="3.5" r="1" fill="#ffffff" />
        <circle cx="5" cy="3.5" r="1" fill="#ffffff" />
        {/* Scrunched eyebrows */}
        <path d="M-9,0 Q-6,-2 -3,0" stroke="#8a6a3a" strokeWidth="1.2" fill="none" />
        <path d="M3,0 Q6,-2 9,0" stroke="#8a6a3a" strokeWidth="1.2" fill="none" />
        {/* Cheeks */}
        <circle cx="-10" cy="10" r="3" fill="#ffb0a0" opacity="0.5" />
        <circle cx="10" cy="10" r="3" fill="#ffb0a0" opacity="0.5" />
        {/* Nose */}
        <ellipse cx="0" cy="9" rx="1.8" ry="1.4" fill="#f0b8a0" />
        {/* Mouth - "not right" squiggle */}
        <path d="M-4,14 Q-2,12 0,14 Q2,12 4,14" stroke="#cc4455" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/* ============================================================
   SCENE 8 — "Fast asleep in the little bed"
   ============================================================ */
export function GoldilocksScene8({ className = '' }) {
  return (
    <svg viewBox="0 0 800 600" className={`absolute inset-0 w-full h-full ${className}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="s8-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2050" />
          <stop offset="100%" stopColor="#3a2860" />
        </linearGradient>
        <radialGradient id="s8-moonbeam" cx="80%" cy="15%" r="45%">
          <stop offset="0%" stopColor="#eeeeff" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#6666aa" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="s8-moon" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fffff0" />
          <stop offset="80%" stopColor="#ffeecc" />
          <stop offset="100%" stopColor="#ffddaa" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Dark bedroom wall */}
      <rect width="800" height="400" fill="url(#s8-wall)" />
      <rect width="800" height="600" fill="url(#s8-moonbeam)" />

      {/* Floor - dark */}
      <rect x="0" y="400" width="800" height="200" fill="#3a2850" />
      <rect x="0" y="310" width="800" height="90" fill="#352460" />
      <line x1="0" y1="310" x2="800" y2="310" stroke="#2a1e50" strokeWidth="2" />

      {/* Bedroom rug */}
      <ellipse cx="400" cy="480" rx="200" ry="50" fill="#4a3068" />
      <ellipse cx="400" cy="480" rx="180" ry="40" fill="#5a3878" />

      {/* Window with moon and stars */}
      <g transform="translate(650, 100)">
        <rect x="-40" y="-50" width="80" height="100" rx="4" fill="#2a1e50" />
        <rect x="-35" y="-45" width="70" height="90" rx="3" fill="#0a0a20" />
        <line x1="0" y1="-45" x2="0" y2="45" stroke="#2a1e50" strokeWidth="2.5" />
        <line x1="-35" y1="0" x2="35" y2="0" stroke="#2a1e50" strokeWidth="2.5" />
        {/* Moon */}
        <circle cx="18" cy="-20" r="14" fill="url(#s8-moon)" />
        {/* Stars through window */}
        <circle cx="-20" cy="-30" r="1.8" fill="#ffffff" opacity="0.9" />
        <circle cx="-10" cy="20" r="1.2" fill="#ffffff" opacity="0.7" />
        <circle cx="10" cy="30" r="1.5" fill="#ffffff" opacity="0.8" />
        <circle cx="-25" cy="10" r="1" fill="#ffffff" opacity="0.6" />
        <circle cx="25" cy="-5" r="1.3" fill="#ffffff" opacity="0.7" />
        {/* Curtains */}
        <path d="M-35,-45 Q-25,-25 -32,-5 L-35,-5 Z" fill="#5a3878" opacity="0.8" />
        <path d="M35,-45 Q25,-25 32,-5 L35,-5 Z" fill="#5a3878" opacity="0.8" />
        {/* Moonbeam ray */}
        <polygon points="35,0 200,200 280,200 35,20" fill="#ccccff" opacity="0.06" />
      </g>

      {/* Stars on wall (wallpaper) */}
      <circle cx="100" cy="80" r="2" fill="#8888bb" opacity="0.3" />
      <circle cx="250" cy="120" r="1.5" fill="#8888bb" opacity="0.25" />
      <circle cx="400" cy="60" r="2" fill="#8888bb" opacity="0.3" />
      <circle cx="500" cy="150" r="1.5" fill="#8888bb" opacity="0.2" />
      <circle cx="150" cy="200" r="1.8" fill="#8888bb" opacity="0.25" />

      {/* === THE SMALL BED with GOLDILOCKS ASLEEP === */}
      <g transform="translate(380, 320)">
        {/* Headboard */}
        <path d="M-80,-80 Q0,-100 80,-80 L80,-10 L-80,-10 Z" fill="#c49a64" />
        <path d="M-70,-75 Q0,-92 70,-75 L70,-15 L-70,-15 Z" fill="#d4aa74" />
        {/* Heart in headboard */}
        <path d="M0,-60 Q-10,-72 -16,-60 Q-16,-50 0,-40 Q16,-50 16,-60 Q10,-72 0,-60 Z" fill="#c49a64" />

        {/* Footboard */}
        <path d="M-80,-40 Q0,-50 80,-40 L80,-10 L-80,-10 Z" fill="#c49a64" transform="translate(0,0)" />

        {/* Mattress */}
        <rect x="-90" y="-15" width="180" height="40" rx="6" fill="#e8e0d8" />

        {/* Blanket - cozy blue with stars */}
        <rect x="-90" y="0" width="180" height="30" rx="5" fill="#4477aa" />
        <rect x="-85" y="3" width="170" height="24" rx="4" fill="#5588bb" />
        {/* Star pattern on blanket */}
        <text x="-60" y="20" fontSize="8" fill="#aaccee" opacity="0.5">*</text>
        <text x="-30" y="16" fontSize="6" fill="#88aadd" opacity="0.4">*</text>
        <text x="0" y="22" fontSize="7" fill="#aaccee" opacity="0.5">*</text>
        <text x="30" y="18" fontSize="5" fill="#88aadd" opacity="0.4">*</text>
        <text x="55" y="20" fontSize="8" fill="#aaccee" opacity="0.5">*</text>

        {/* Goldilocks sleeping */}
        {/* Hair spread on pillow - lush golden spread */}
        <ellipse cx="-20" cy="-14" rx="55" ry="18" fill="#f0c030" />
        <ellipse cx="-40" cy="-10" rx="25" ry="14" fill="#ffd700" />
        <ellipse cx="0" cy="-12" rx="30" ry="15" fill="#ffd700" />
        <ellipse cx="-20" cy="-20" rx="35" ry="12" fill="#ffdd40" />
        <ellipse cx="-50" cy="-5" rx="15" ry="10" fill="#f0c030" />
        <ellipse cx="20" cy="-8" rx="18" ry="12" fill="#ffdd40" />
        <circle cx="-55" cy="0" r="8" fill="#ffd700" />
        <circle cx="30" cy="-4" r="7" fill="#ffd700" />
        <circle cx="35" cy="2" r="6" fill="#f0c030" />
        <ellipse cx="-10" cy="-22" rx="20" ry="6" fill="#ffe870" opacity="0.4" />

        {/* Pillow */}
        <ellipse cx="-15" cy="-6" rx="40" ry="10" fill="#f0ebe0" />
        <ellipse cx="-15" cy="-7" rx="35" ry="8" fill="#f8f4ec" />

        {/* Face - peaceful sleeping */}
        <circle cx="-15" cy="-2" r="16" fill="#fce4c8" />

        {/* Closed eyes - peaceful */}
        <path d="M-22,-4 Q-19,-7 -16,-4" stroke="#5a4030" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M-14,-4 Q-11,-7 -8,-4" stroke="#5a4030" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Eyelashes */}
        <line x1="-22" y1="-4" x2="-23" y2="-7" stroke="#5a4030" strokeWidth="0.8" />
        <line x1="-8" y1="-4" x2="-7" y2="-7" stroke="#5a4030" strokeWidth="0.8" />

        {/* Rosy cheeks */}
        <circle cx="-24" cy="2" r="3.5" fill="#ffb0a0" opacity="0.5" />
        <circle cx="-6" cy="2" r="3.5" fill="#ffb0a0" opacity="0.5" />

        {/* Button nose */}
        <ellipse cx="-15" cy="0" rx="1.8" ry="1.4" fill="#f0b8a0" />

        {/* Peaceful smile */}
        <path d="M-19,4 Q-15,7 -11,4" stroke="#cc6677" strokeWidth="1.2" fill="none" strokeLinecap="round" />

        {/* Hands peeking over blanket */}
        <circle cx="40" cy="2" r="5" fill="#fce4c8" />
        <circle cx="-60" cy="4" r="4.5" fill="#fce4c8" />

        {/* Bed legs */}
        <rect x="-85" y="28" width="7" height="25" rx="2" fill="#b08858" />
        <rect x="78" y="28" width="7" height="25" rx="2" fill="#b08858" />
      </g>

      {/* Zzz floating - animated */}
      <g>
        <text fontSize="18" fill="#aabbdd" opacity="0.7" fontFamily="serif" fontStyle="italic">
          <tspan x="420" y="240">
            z
            <animate attributeName="y" values="240;220;200" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.7;0.4;0.1" dur="4s" repeatCount="indefinite" />
          </tspan>
        </text>
        <text fontSize="22" fill="#aabbdd" opacity="0.5" fontFamily="serif" fontStyle="italic">
          <tspan x="440" y="210">
            z
            <animate attributeName="y" values="210;185;160" dur="4.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0.3;0.05" dur="4.5s" repeatCount="indefinite" />
          </tspan>
        </text>
        <text fontSize="28" fill="#aabbdd" opacity="0.35" fontFamily="serif" fontStyle="italic">
          <tspan x="465" y="175">
            z
            <animate attributeName="y" values="175;145;115" dur="5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.35;0.15;0" dur="5s" repeatCount="indefinite" />
          </tspan>
        </text>
      </g>

      {/* Teddy bear fallen on the floor */}
      <g transform="translate(520, 430)">
        <ellipse cx="0" cy="3" rx="8" ry="10" fill="#c4956a" transform="rotate(-20,0,3)" />
        <circle cx="-2" cy="-8" r="7" fill="#c4956a" />
        <circle cx="-7" cy="-13" r="3" fill="#c4956a" />
        <circle cx="3" cy="-14" r="3" fill="#c4956a" />
        <circle cx="-7" cy="-13" r="1.5" fill="#d4a57a" />
        <circle cx="3" cy="-14" r="1.5" fill="#d4a57a" />
        <circle cx="-4" cy="-9" r="1.2" fill="#2a1a0a" />
        <circle cx="1" cy="-10" r="1.2" fill="#2a1a0a" />
        <ellipse cx="-1" cy="-6" rx="1.5" ry="1" fill="#2a1a0a" />
        {/* Arms */}
        <path d="M-6,-2 Q-14,0 -16,5" stroke="#c4956a" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M6,-2 Q12,2 14,7" stroke="#c4956a" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>

      {/* Extra dreamy sparkles in the moonlight */}
      <circle cx="500" cy="200" r="1.5" fill="#ddddff" opacity="0.4">
        <animate attributeName="opacity" values="0.4;0.1;0.4" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="550" cy="250" r="1" fill="#ddddff" opacity="0.3">
        <animate attributeName="opacity" values="0.3;0.1;0.3" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="480" cy="280" r="1.2" fill="#ddddff" opacity="0.35">
        <animate attributeName="opacity" values="0.35;0.1;0.35" dur="3.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

/* ============================================================
   SCENE 9 — "The three bears come home!"
   ============================================================ */
export function GoldilocksScene9({ className = '' }) {
  return (
    <svg viewBox="0 0 800 600" className={`absolute inset-0 w-full h-full ${className}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="s9-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5e0b0" />
          <stop offset="100%" stopColor="#e0c890" />
        </linearGradient>
        <radialGradient id="s9-warm" cx="40%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff8e0" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#ffcc80" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Wall */}
      <rect width="800" height="400" fill="url(#s9-wall)" />
      <rect width="800" height="600" fill="url(#s9-warm)" />
      <rect x="0" y="300" width="800" height="100" fill="#d4b080" />
      <line x1="0" y1="300" x2="800" y2="300" stroke="#c0a068" strokeWidth="3" />

      {/* Floor */}
      <rect x="0" y="400" width="800" height="200" fill="#b08858" />

      {/* Door frame - they're standing in the doorway */}
      <g transform="translate(400, 80)">
        {/* Door frame */}
        <rect x="-130" y="0" width="260" height="340" rx="5" fill="#5a3a1a" />
        <rect x="-120" y="5" width="240" height="330" rx="3" fill="#7a5535" />
        {/* Door opening */}
        <rect x="-110" y="10" width="220" height="320" fill="#aadcaa" />
        {/* Sunlight coming through door */}
        <rect x="-110" y="10" width="220" height="320" fill="#ffe880" opacity="0.15" />
        {/* Outside visible through door */}
        <ellipse cx="0" cy="30" rx="80" ry="60" fill="#6b9b3a" opacity="0.3" />
        <rect x="-110" y="250" width="220" height="80" fill="#5a9a3a" opacity="0.4" />
      </g>

      {/* Table visible inside with empty porridge bowl */}
      <g transform="translate(650, 320)">
        <rect x="-50" y="-10" width="100" height="6" rx="2" fill="#8b6540" />
        <rect x="-40" y="-4" width="6" height="40" rx="2" fill="#7a5530" />
        <rect x="34" y="-4" width="6" height="40" rx="2" fill="#7a5530" />
        {/* Empty small bowl on table */}
        <ellipse cx="0" cy="-16" rx="18" ry="8" fill="#bb6622" />
        <ellipse cx="0" cy="-20" rx="18" ry="6" fill="#dd8844" />
        <ellipse cx="0" cy="-20" rx="14" ry="4" fill="#f5e8c8" />
      </g>

      {/* === PAPA BEAR — biggest, in the back === */}
      <g transform="translate(400, 140)">
        {/* Body */}
        <ellipse cx="0" cy="120" rx="65" ry="80" fill="#6b3410" />
        <ellipse cx="0" cy="115" rx="60" ry="75" fill="#8B4513" />
        <ellipse cx="0" cy="110" rx="50" ry="65" fill="#a0623a" opacity="0.4" />

        {/* Waistcoat */}
        <path d="M-35,70 L-30,140 Q0,155 30,140 L35,70 Z" fill="#334488" />
        <path d="M-30,70 L-25,135 Q0,148 25,135 L30,70 Z" fill="#445599" />
        <line x1="0" y1="72" x2="0" y2="140" stroke="#334488" strokeWidth="2" />
        {/* Buttons */}
        <circle cx="0" cy="85" r="2.5" fill="#ddaa44" />
        <circle cx="0" cy="105" r="2.5" fill="#ddaa44" />
        <circle cx="0" cy="125" r="2.5" fill="#ddaa44" />

        {/* Bowtie */}
        <path d="M-12,68 L0,73 L12,68 L0,78 Z" fill="#cc3333" />
        <circle cx="0" cy="73" r="3" fill="#dd4444" />

        {/* Arms - up in surprise */}
        <path d="M-50,90 Q-75,60 -80,40" stroke="#8B4513" strokeWidth="22" fill="none" strokeLinecap="round" />
        <path d="M50,90 Q75,60 80,40" stroke="#8B4513" strokeWidth="22" fill="none" strokeLinecap="round" />
        {/* Paws */}
        <circle cx="-80" cy="40" r="14" fill="#6b3410" />
        <circle cx="80" cy="40" r="14" fill="#6b3410" />
        {/* Paw pads */}
        <ellipse cx="-80" cy="42" rx="8" ry="6" fill="#d4956a" />
        <circle cx="-84" cy="36" r="3" fill="#d4956a" />
        <circle cx="-76" cy="36" r="3" fill="#d4956a" />
        <ellipse cx="80" cy="42" rx="8" ry="6" fill="#d4956a" />
        <circle cx="84" cy="36" r="3" fill="#d4956a" />
        <circle cx="76" cy="36" r="3" fill="#d4956a" />

        {/* Head */}
        <circle cx="0" cy="40" r="35" fill="#8B4513" />
        <circle cx="0" cy="42" r="30" fill="#a0623a" opacity="0.5" />

        {/* Ears */}
        <circle cx="-28" cy="18" r="12" fill="#8B4513" />
        <circle cx="28" cy="18" r="12" fill="#8B4513" />
        <circle cx="-28" cy="18" r="7" fill="#d4956a" />
        <circle cx="28" cy="18" r="7" fill="#d4956a" />

        {/* Snout */}
        <ellipse cx="0" cy="50" rx="16" ry="12" fill="#c4956a" />
        {/* Nose */}
        <ellipse cx="0" cy="46" rx="6" ry="4.5" fill="#1a1a1a" />
        <ellipse cx="-2" cy="44" rx="2" ry="1.5" fill="#444444" />

        {/* Eyes - shocked wide */}
        <ellipse cx="-12" cy="35" rx="7" ry="8" fill="#ffffff" />
        <ellipse cx="12" cy="35" rx="7" ry="8" fill="#ffffff" />
        <circle cx="-12" cy="36" r="5" fill="#3a2210" />
        <circle cx="12" cy="36" r="5" fill="#3a2210" />
        <circle cx="-12" cy="37" r="2.5" fill="#1a1008" />
        <circle cx="12" cy="37" r="2.5" fill="#1a1008" />
        {/* Eye sparkles */}
        <circle cx="-14" cy="34" r="2" fill="#ffffff" />
        <circle cx="10" cy="34" r="2" fill="#ffffff" />
        <circle cx="-10" cy="38" r="1" fill="#ffffff" />
        <circle cx="14" cy="38" r="1" fill="#ffffff" />

        {/* Eyebrows raised in shock */}
        <path d="M-18,26 Q-12,22 -6,26" stroke="#5a2a10" strokeWidth="2.5" fill="none" />
        <path d="M6,26 Q12,22 18,26" stroke="#5a2a10" strokeWidth="2.5" fill="none" />

        {/* Mouth - open shocked */}
        <ellipse cx="0" cy="56" rx="10" ry="8" fill="#4a2010" />
        <ellipse cx="0" cy="54" rx="7" ry="5" fill="#6a3020" />

        {/* Cheeks */}
        <circle cx="-20" cy="48" r="5" fill="#d4756a" opacity="0.4" />
        <circle cx="20" cy="48" r="5" fill="#d4756a" opacity="0.4" />
      </g>

      {/* === MAMA BEAR — medium, in the middle === */}
      <g transform="translate(340, 200)">
        {/* Body */}
        <ellipse cx="0" cy="110" rx="48" ry="65" fill="#7a5530" />
        <ellipse cx="0" cy="108" rx="44" ry="60" fill="#9b6b3a" />
        <ellipse cx="0" cy="105" rx="36" ry="52" fill="#b07a4a" opacity="0.3" />

        {/* Apron */}
        <path d="M-25,70 L-28,130 Q0,140 28,130 L25,70 Z" fill="#ffffff" opacity="0.85" />
        <path d="M-22,72 L-25,128 Q0,136 25,128 L22,72 Z" fill="#f0f0f0" />
        {/* Apron strings */}
        <path d="M-25,70 Q-35,65 -40,70" stroke="#e0e0e0" strokeWidth="2" fill="none" />
        <path d="M25,70 Q35,65 40,70" stroke="#e0e0e0" strokeWidth="2" fill="none" />
        {/* Apron pocket */}
        <rect x="-10" y="95" width="20" height="15" rx="3" fill="#e8e8e8" />

        {/* Bonnet */}
        <ellipse cx="0" cy="22" rx="30" ry="10" fill="#ffffff" opacity="0.8" />
        <path d="M-28,22 Q-30,15 -25,10 Q0,0 25,10 Q30,15 28,22" fill="#f8f0f0" />
        {/* Bonnet frill */}
        <path d="M-28,22 Q-24,26 -20,22 Q-16,26 -12,22 Q-8,26 -4,22 Q0,26 4,22 Q8,26 12,22 Q16,26 20,22 Q24,26 28,22" stroke="#dddddd" strokeWidth="1.5" fill="none" />

        {/* Arms - paws on cheeks in surprise */}
        <path d="M-38,85 Q-52,65 -48,48" stroke="#9b6b3a" strokeWidth="18" fill="none" strokeLinecap="round" />
        <path d="M38,85 Q52,65 48,48" stroke="#9b6b3a" strokeWidth="18" fill="none" strokeLinecap="round" />
        {/* Paws on cheeks */}
        <circle cx="-48" cy="48" r="11" fill="#7a5530" />
        <circle cx="48" cy="48" r="11" fill="#7a5530" />
        <ellipse cx="-48" cy="50" rx="6" ry="5" fill="#d4956a" />
        <ellipse cx="48" cy="50" rx="6" ry="5" fill="#d4956a" />

        {/* Head */}
        <circle cx="0" cy="38" r="28" fill="#9b6b3a" />
        <circle cx="0" cy="40" r="24" fill="#b07a4a" opacity="0.4" />

        {/* Ears */}
        <circle cx="-22" cy="18" r="10" fill="#9b6b3a" />
        <circle cx="22" cy="18" r="10" fill="#9b6b3a" />
        <circle cx="-22" cy="18" r="6" fill="#d4956a" />
        <circle cx="22" cy="18" r="6" fill="#d4956a" />

        {/* Snout */}
        <ellipse cx="0" cy="47" rx="13" ry="10" fill="#c4a07a" />
        <ellipse cx="0" cy="44" rx="5" ry="3.5" fill="#1a1a1a" />
        <ellipse cx="-1.5" cy="42.5" rx="1.5" ry="1" fill="#444444" />

        {/* Eyes - surprised */}
        <ellipse cx="-10" cy="34" rx="6" ry="6.5" fill="#ffffff" />
        <ellipse cx="10" cy="34" rx="6" ry="6.5" fill="#ffffff" />
        <circle cx="-10" cy="35" r="4" fill="#3a2210" />
        <circle cx="10" cy="35" r="4" fill="#3a2210" />
        <circle cx="-10" cy="36" r="2" fill="#1a1008" />
        <circle cx="10" cy="36" r="2" fill="#1a1008" />
        <circle cx="-12" cy="33" r="1.5" fill="#ffffff" />
        <circle cx="8" cy="33" r="1.5" fill="#ffffff" />
        <circle cx="-9" cy="37" r="0.8" fill="#ffffff" />
        <circle cx="11" cy="37" r="0.8" fill="#ffffff" />

        {/* Kind eyebrows raised */}
        <path d="M-15,26 Q-10,23 -5,26" stroke="#6b4226" strokeWidth="2" fill="none" />
        <path d="M5,26 Q10,23 15,26" stroke="#6b4226" strokeWidth="2" fill="none" />

        {/* Mouth - surprised "oh!" */}
        <ellipse cx="0" cy="52" rx="7" ry="6" fill="#5a3020" />
        <ellipse cx="0" cy="51" rx="5" ry="4" fill="#7a4030" />

        {/* Cheeks */}
        <circle cx="-16" cy="44" r="4" fill="#d4756a" opacity="0.4" />
        <circle cx="16" cy="44" r="4" fill="#d4756a" opacity="0.4" />
      </g>

      {/* === BABY BEAR — smallest, in front, pointing === */}
      <g transform="translate(460, 300)">
        {/* Body */}
        <ellipse cx="0" cy="70" rx="30" ry="42" fill="#a07a58" />
        <ellipse cx="0" cy="68" rx="27" ry="38" fill="#c4956a" />
        <ellipse cx="0" cy="66" rx="22" ry="32" fill="#d4a57a" opacity="0.3" />

        {/* Little scarf */}
        <path d="M-15,38 Q0,42 15,38 Q12,45 8,50 L-8,50 Q-12,45 -15,38 Z" fill="#44aa44" />
        <rect x="8" y="42" width="6" height="18" rx="2" fill="#44aa44" />
        <rect x="-14" y="44" width="6" height="15" rx="2" fill="#3d9a3d" />

        {/* Little cap */}
        <ellipse cx="0" cy="14" rx="22" ry="6" fill="#44aa44" />
        <path d="M-18,14 Q-20,5 -12,0 Q0,-6 12,0 Q20,5 18,14" fill="#3d9a3d" />
        <circle cx="0" cy="-6" r="3" fill="#55bb55" />

        {/* Arms - one pointing at empty bowl */}
        <path d="M-24,58 Q-38,48 -42,38" stroke="#c4956a" strokeWidth="12" fill="none" strokeLinecap="round" />
        <path d="M24,55 Q40,35 60,25" stroke="#c4956a" strokeWidth="12" fill="none" strokeLinecap="round" />
        {/* Pointing paw */}
        <circle cx="-42" cy="38" r="8" fill="#a07a58" />
        <ellipse cx="-42" cy="40" rx="5" ry="4" fill="#d4b08a" />
        {/* Right paw pointing */}
        <circle cx="60" cy="25" r="8" fill="#a07a58" />
        <ellipse cx="60" cy="27" rx="5" ry="4" fill="#d4b08a" />
        {/* Pointing finger shape */}
        <ellipse cx="68" cy="22" rx="6" ry="3" fill="#a07a58" transform="rotate(-20,68,22)" />

        {/* Legs */}
        <ellipse cx="-12" cy="105" rx="10" ry="8" fill="#a07a58" />
        <ellipse cx="12" cy="105" rx="10" ry="8" fill="#a07a58" />
        <ellipse cx="-12" cy="107" rx="6" ry="4" fill="#d4b08a" />
        <ellipse cx="12" cy="107" rx="6" ry="4" fill="#d4b08a" />

        {/* Head */}
        <circle cx="0" cy="22" r="22" fill="#c4956a" />
        <circle cx="0" cy="24" r="18" fill="#d4a57a" opacity="0.4" />

        {/* Ears */}
        <circle cx="-17" cy="8" r="8" fill="#c4956a" />
        <circle cx="17" cy="8" r="8" fill="#c4956a" />
        <circle cx="-17" cy="8" r="5" fill="#d4b08a" />
        <circle cx="17" cy="8" r="5" fill="#d4b08a" />

        {/* Snout */}
        <ellipse cx="0" cy="30" rx="10" ry="8" fill="#dcc0a0" />
        <ellipse cx="0" cy="28" rx="4" ry="3" fill="#1a1a1a" />
        <ellipse cx="-1" cy="27" rx="1.2" ry="0.8" fill="#444444" />

        {/* Eyes - BIGGEST and most expressive, super shocked */}
        <ellipse cx="-8" cy="20" rx="6.5" ry="7.5" fill="#ffffff" />
        <ellipse cx="8" cy="20" rx="6.5" ry="7.5" fill="#ffffff" />
        <circle cx="-8" cy="21" r="4.5" fill="#3a2210" />
        <circle cx="8" cy="21" r="4.5" fill="#3a2210" />
        <circle cx="-8" cy="22" r="2.5" fill="#1a1008" />
        <circle cx="8" cy="22" r="2.5" fill="#1a1008" />
        {/* Big sparkles */}
        <circle cx="-10" cy="18.5" r="2" fill="#ffffff" />
        <circle cx="6" cy="18.5" r="2" fill="#ffffff" />
        <circle cx="-7" cy="23" r="1" fill="#ffffff" />
        <circle cx="9" cy="23" r="1" fill="#ffffff" />

        {/* Eyebrows way up */}
        <path d="M-14,12 Q-8,8 -2,12" stroke="#8a6a3a" strokeWidth="2" fill="none" />
        <path d="M2,12 Q8,8 14,12" stroke="#8a6a3a" strokeWidth="2" fill="none" />

        {/* Mouth - big shocked open mouth */}
        <ellipse cx="0" cy="36" rx="8" ry="7" fill="#5a3020" />
        <ellipse cx="0" cy="35" rx="6" ry="5" fill="#7a4030" />

        {/* Extra rosy cheeks */}
        <circle cx="-14" cy="28" r="4.5" fill="#ff9988" opacity="0.5" />
        <circle cx="14" cy="28" r="4.5" fill="#ff9988" opacity="0.5" />
      </g>

      {/* Exclamation marks above bears */}
      <text x="380" y="100" fontSize="28" fill="#cc3333" fontWeight="bold" fontFamily="serif">!</text>
      <text x="320" y="170" fontSize="22" fill="#cc3333" fontWeight="bold" fontFamily="serif">!</text>
      <text x="470" y="260" fontSize="20" fill="#cc3333" fontWeight="bold" fontFamily="serif">!</text>
    </svg>
  );
}

/* ============================================================
   SCENE 10 — "Goldilocks runs home! The end!"
   ============================================================ */
export function GoldilocksScene10({ className = '' }) {
  return (
    <svg viewBox="0 0 800 600" className={`absolute inset-0 w-full h-full ${className}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="s10-sun" cx="50%" cy="15%" r="50%">
          <stop offset="0%" stopColor="#fff8dc" />
          <stop offset="30%" stopColor="#ffeaa0" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffeaa0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="s10-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#70c8f0" />
          <stop offset="60%" stopColor="#a8e0a8" />
          <stop offset="100%" stopColor="#5a9a3a" />
        </linearGradient>
      </defs>

      {/* Bright sunny sky */}
      <rect width="800" height="600" fill="url(#s10-sky)" />
      <rect width="800" height="600" fill="url(#s10-sun)" />

      {/* Sun */}
      <circle cx="400" cy="60" r="40" fill="#fff8dc" />
      <circle cx="400" cy="60" r="35" fill="#ffee88" />
      {/* Sun rays */}
      <g opacity="0.3">
        <line x1="400" y1="10" x2="400" y2="-10" stroke="#ffdd44" strokeWidth="4" strokeLinecap="round" />
        <line x1="435" y1="20" x2="450" y2="5" stroke="#ffdd44" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="450" y1="50" x2="470" y2="45" stroke="#ffdd44" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="365" y1="20" x2="350" y2="5" stroke="#ffdd44" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="350" y1="50" x2="330" y2="45" stroke="#ffdd44" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="435" y1="95" x2="450" y2="110" stroke="#ffdd44" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="365" y1="95" x2="350" y2="110" stroke="#ffdd44" strokeWidth="3.5" strokeLinecap="round" />
      </g>

      {/* Clouds */}
      <g opacity="0.6">
        <ellipse cx="150" cy="80" rx="55" ry="22" fill="#ffffff" />
        <ellipse cx="175" cy="72" rx="40" ry="18" fill="#ffffff" />
        <ellipse cx="650" cy="70" rx="50" ry="20" fill="#ffffff" />
        <ellipse cx="675" cy="63" rx="38" ry="16" fill="#ffffff" />
      </g>

      {/* Background trees */}
      <ellipse cx="100" cy="240" rx="70" ry="110" fill="#2d7a2d" opacity="0.6" />
      <ellipse cx="200" cy="250" rx="55" ry="100" fill="#2a6a2a" opacity="0.6" />
      <ellipse cx="700" cy="230" rx="75" ry="120" fill="#2d7a2d" opacity="0.6" />

      {/* Midground trees */}
      <rect x="60" y="200" width="30" height="250" rx="6" fill="#6b4226" />
      <ellipse cx="75" cy="180" rx="55" ry="70" fill="#3a8a3a" />
      <ellipse cx="60" cy="160" rx="40" ry="55" fill="#40904a" />
      <ellipse cx="90" cy="170" rx="35" ry="50" fill="#358535" />

      <rect x="720" y="190" width="30" height="260" rx="6" fill="#5a3820" />
      <ellipse cx="735" cy="170" rx="60" ry="75" fill="#3a8a3a" />
      <ellipse cx="720" cy="155" rx="45" ry="58" fill="#40904a" />

      {/* Ground */}
      <ellipse cx="400" cy="620" rx="520" ry="210" fill="#5a9a3a" />
      <ellipse cx="400" cy="640" rx="500" ry="200" fill="#4d8a30" />

      {/* Forest path */}
      <path d="M100,550 Q200,500 350,460 Q500,430 650,450" stroke="#c49a64" strokeWidth="45" fill="none" strokeLinecap="round" />
      <path d="M100,550 Q200,500 350,460 Q500,430 650,450" stroke="#d4aa74" strokeWidth="35" fill="none" strokeLinecap="round" />

      {/* Cottage in background (right side) */}
      <g transform="translate(640, 280)" opacity="0.9">
        {/* Small cottage */}
        <rect x="-40" y="10" width="80" height="65" rx="3" fill="#f5e6c8" />
        {/* Roof */}
        <path d="M-55,13 L0,-20 L55,13 Z" fill="#b89040" />
        <path d="M-50,13 L0,-15 L50,13 Z" fill="#a08030" />
        {/* Door */}
        <rect x="-8" y="40" width="16" height="35" rx="8 8 0 0" fill="#6b3a1a" />
        {/* Windows */}
        <rect x="-32" y="28" width="16" height="16" rx="2" fill="#ffe880" />
        <rect x="16" y="28" width="16" height="16" rx="2" fill="#ffe880" />
      </g>

      {/* === THREE BEARS at cottage door, waving === */}

      {/* Papa Bear - in doorway, waving */}
      <g transform="translate(660, 260)">
        {/* Body */}
        <ellipse cx="0" cy="45" rx="22" ry="30" fill="#8B4513" />
        {/* Waistcoat */}
        <path d="M-12,25 L-10,55 Q0,60 10,55 L12,25 Z" fill="#334488" />
        {/* Arm waving */}
        <path d="M-18,35 Q-28,20 -22,8" stroke="#8B4513" strokeWidth="10" fill="none" strokeLinecap="round" />
        <circle cx="-22" cy="8" r="6" fill="#6b3410" />
        <ellipse cx="-22" cy="10" rx="4" ry="3" fill="#d4956a" />
        {/* Other arm */}
        <path d="M18,35 Q25,42 22,50" stroke="#8B4513" strokeWidth="10" fill="none" strokeLinecap="round" />
        {/* Head */}
        <circle cx="0" cy="10" r="16" fill="#8B4513" />
        <circle cx="-12" cy="0" r="5" fill="#8B4513" />
        <circle cx="12" cy="0" r="5" fill="#8B4513" />
        <circle cx="-12" cy="0" r="3" fill="#d4956a" />
        <circle cx="12" cy="0" r="3" fill="#d4956a" />
        <ellipse cx="0" cy="16" rx="7" ry="5" fill="#c4956a" />
        <ellipse cx="0" cy="14" rx="3" ry="2" fill="#1a1a1a" />
        {/* Friendly eyes */}
        <circle cx="-5" cy="8" r="3" fill="#ffffff" />
        <circle cx="5" cy="8" r="3" fill="#ffffff" />
        <circle cx="-5" cy="9" r="2" fill="#3a2210" />
        <circle cx="5" cy="9" r="2" fill="#3a2210" />
        <circle cx="-6" cy="8" r="0.8" fill="#ffffff" />
        <circle cx="4" cy="8" r="0.8" fill="#ffffff" />
        {/* Friendly smile */}
        <path d="M-4,18 Q0,22 4,18" stroke="#5a2a10" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      </g>

      {/* Mama Bear - next to Papa, waving */}
      <g transform="translate(690, 278)">
        <ellipse cx="0" cy="38" rx="18" ry="25" fill="#9b6b3a" />
        {/* Apron */}
        <path d="M-10,22 L-11,48 Q0,52 11,48 L10,22 Z" fill="#ffffff" opacity="0.8" />
        {/* Arm waving */}
        <path d="M-14,30 Q-22,18 -18,6" stroke="#9b6b3a" strokeWidth="8" fill="none" strokeLinecap="round" />
        <circle cx="-18" cy="6" r="5" fill="#7a5530" />
        <ellipse cx="-18" cy="8" rx="3" ry="2.5" fill="#d4956a" />
        {/* Head */}
        <circle cx="0" cy="8" r="13" fill="#9b6b3a" />
        <circle cx="-10" cy="-1" r="4.5" fill="#9b6b3a" />
        <circle cx="10" cy="-1" r="4.5" fill="#9b6b3a" />
        <circle cx="-10" cy="-1" r="2.5" fill="#d4956a" />
        <circle cx="10" cy="-1" r="2.5" fill="#d4956a" />
        <ellipse cx="0" cy="14" rx="6" ry="4.5" fill="#c4a07a" />
        <ellipse cx="0" cy="12" rx="2.5" ry="1.8" fill="#1a1a1a" />
        {/* Eyes */}
        <circle cx="-5" cy="6" r="2.5" fill="#ffffff" />
        <circle cx="5" cy="6" r="2.5" fill="#ffffff" />
        <circle cx="-5" cy="7" r="1.5" fill="#3a2210" />
        <circle cx="5" cy="7" r="1.5" fill="#3a2210" />
        <circle cx="-6" cy="5.5" r="0.7" fill="#ffffff" />
        <circle cx="4" cy="5.5" r="0.7" fill="#ffffff" />
        <path d="M-3,16 Q0,19 3,16" stroke="#5a3020" strokeWidth="1" fill="none" strokeLinecap="round" />
        {/* Bonnet */}
        <ellipse cx="0" cy="0" rx="14" ry="5" fill="#f8f0f0" />
      </g>

      {/* Baby Bear - in front, waving EXTRA enthusiastically with both paws */}
      <g transform="translate(670, 310)">
        <ellipse cx="0" cy="30" rx="13" ry="18" fill="#c4956a" />
        {/* Scarf */}
        <path d="M-8,16 Q0,19 8,16 Q6,22 4,26 L-4,26 Q-6,22 -8,16 Z" fill="#44aa44" />
        {/* Both arms waving high */}
        <path d="M-10,22 Q-20,8 -16,-5" stroke="#c4956a" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M10,22 Q20,8 16,-5" stroke="#c4956a" strokeWidth="6" fill="none" strokeLinecap="round" />
        <circle cx="-16" cy="-5" r="4" fill="#a07a58" />
        <circle cx="16" cy="-5" r="4" fill="#a07a58" />
        <ellipse cx="-16" cy="-3.5" rx="2.5" ry="2" fill="#d4b08a" />
        <ellipse cx="16" cy="-3.5" rx="2.5" ry="2" fill="#d4b08a" />
        {/* Head */}
        <circle cx="0" cy="6" r="11" fill="#c4956a" />
        <circle cx="-8" cy="-1" r="4" fill="#c4956a" />
        <circle cx="8" cy="-1" r="4" fill="#c4956a" />
        <circle cx="-8" cy="-1" r="2.5" fill="#d4b08a" />
        <circle cx="8" cy="-1" r="2.5" fill="#d4b08a" />
        <ellipse cx="0" cy="11" rx="5" ry="3.5" fill="#dcc0a0" />
        <ellipse cx="0" cy="9.5" rx="2" ry="1.5" fill="#1a1a1a" />
        {/* Big happy eyes */}
        <ellipse cx="-4" cy="4" rx="3" ry="3.5" fill="#ffffff" />
        <ellipse cx="4" cy="4" rx="3" ry="3.5" fill="#ffffff" />
        <circle cx="-4" cy="5" r="2.2" fill="#3a2210" />
        <circle cx="4" cy="5" r="2.2" fill="#3a2210" />
        <circle cx="-5" cy="3.5" r="0.8" fill="#ffffff" />
        <circle cx="3" cy="3.5" r="0.8" fill="#ffffff" />
        {/* Big happy smile */}
        <path d="M-4,13 Q0,17 4,13" stroke="#5a3020" strokeWidth="1.2" fill="#7a4030" strokeLinecap="round" />
        {/* Extra rosy cheeks */}
        <circle cx="-7" cy="9" r="2.5" fill="#ff9988" opacity="0.5" />
        <circle cx="7" cy="9" r="2.5" fill="#ff9988" opacity="0.5" />
        {/* Cap */}
        <ellipse cx="0" cy="0" rx="12" ry="4" fill="#44aa44" />
        <path d="M-10,0 Q-11,-4 -6,-7 Q0,-10 6,-7 Q11,-4 10,0" fill="#3d9a3d" />
        <circle cx="0" cy="-10" r="2.5" fill="#55bb55" />
      </g>

      {/* === GOLDILOCKS RUNNING through the forest === */}
      <g transform="translate(250, 350)">
        {/* Shadow */}
        <ellipse cx="5" cy="95" rx="28" ry="6" fill="#2a5a20" opacity="0.3" />

        {/* Dress - in motion, flowing */}
        <path d="M-10,30 Q-18,52 -28,78 Q0,88 18,78 Q20,52 15,30 Z" fill="#e03050" />
        <path d="M-2,33 Q-4,52 -8,72 Q2,72 5,33 Z" fill="#ff4060" opacity="0.3" />
        {/* Dress flowing back */}
        <path d="M-28,78 Q-35,82 -38,88" fill="#cc2040" />
        <path d="M-8,26 Q0,30 8,26 Q0,29 -8,26 Z" fill="#ffffff" opacity="0.8" />

        {/* Legs - running pose */}
        <path d="M-8,74 Q-18,82 -25,90" stroke="#fce4c8" strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M8,74 Q15,82 20,88" stroke="#fce4c8" strokeWidth="7" fill="none" strokeLinecap="round" />
        {/* Shoes */}
        <ellipse cx="-26" cy="92" rx="7" ry="4" fill="#5a2a1a" transform="rotate(-15,-26,92)" />
        <ellipse cx="22" cy="90" rx="7" ry="4" fill="#5a2a1a" transform="rotate(10,22,90)" />

        {/* Arms - running pumping motion */}
        <path d="M-12,34 Q-28,28 -32,20" stroke="#fce4c8" strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M12,34 Q20,42 26,48" stroke="#fce4c8" strokeWidth="7" fill="none" strokeLinecap="round" />
        <circle cx="-32" cy="20" r="4.5" fill="#fce4c8" />
        <circle cx="26" cy="48" r="4.5" fill="#fce4c8" />

        {/* Head */}
        <circle cx="0" cy="8" r="20" fill="#fce4c8" />

        {/* Golden curly hair - FLYING behind her */}
        <ellipse cx="0" cy="-6" rx="26" ry="20" fill="#f0c030" />
        <ellipse cx="-16" cy="2" rx="14" ry="17" fill="#ffd700" />
        <ellipse cx="16" cy="2" rx="12" ry="15" fill="#ffd700" />
        <ellipse cx="-10" cy="-10" rx="15" ry="13" fill="#ffdd40" />
        <ellipse cx="10" cy="-10" rx="14" ry="12" fill="#ffdd40" />
        <ellipse cx="0" cy="-14" rx="20" ry="12" fill="#f0c030" />
        {/* Hair flying back (right side = behind her as she runs left) */}
        <ellipse cx="25" cy="0" rx="15" ry="10" fill="#ffd700" />
        <ellipse cx="35" cy="5" rx="14" ry="9" fill="#f0c030" />
        <ellipse cx="42" cy="10" rx="12" ry="8" fill="#ffd700" />
        <ellipse cx="48" cy="16" rx="10" ry="7" fill="#ffdd40" />
        <ellipse cx="52" cy="22" rx="8" ry="6" fill="#ffd700" />
        <circle cx="55" cy="28" r="5" fill="#f0c030" />
        <circle cx="56" cy="34" r="4" fill="#ffd700" />
        {/* Left side curls */}
        <circle cx="-20" cy="12" r="7" fill="#ffd700" />
        <circle cx="-18" cy="20" r="6" fill="#f0c030" />
        <circle cx="-15" cy="26" r="5" fill="#ffd700" />
        {/* Hair highlights */}
        <ellipse cx="-5" cy="-12" rx="8" ry="5" fill="#ffe870" opacity="0.5" />
        <ellipse cx="30" cy="2" rx="5" ry="3" fill="#ffe870" opacity="0.4" />

        {/* Face - happy/excited running */}
        {/* Eyes */}
        <ellipse cx="-7" cy="5" rx="4" ry="4.5" fill="#ffffff" />
        <ellipse cx="5" cy="5" rx="4" ry="4.5" fill="#ffffff" />
        <circle cx="-8" cy="6" r="3" fill="#4488cc" />
        <circle cx="4" cy="6" r="3" fill="#4488cc" />
        <circle cx="-8" cy="6" r="1.8" fill="#2255aa" />
        <circle cx="4" cy="6" r="1.8" fill="#2255aa" />
        <circle cx="-8" cy="7" r="0.9" fill="#111122" />
        <circle cx="4" cy="7" r="0.9" fill="#111122" />
        <circle cx="-9.5" cy="4.5" r="1.2" fill="#ffffff" />
        <circle cx="2.5" cy="4.5" r="1.2" fill="#ffffff" />

        {/* Cheeks - extra rosy from running */}
        <circle cx="-12" cy="12" r="4.5" fill="#ffb0a0" opacity="0.6" />
        <circle cx="10" cy="12" r="4.5" fill="#ffb0a0" opacity="0.6" />

        {/* Nose */}
        <ellipse cx="-1" cy="11" rx="2" ry="1.6" fill="#f0b8a0" />

        {/* Happy excited smile */}
        <path d="M-6,16 Q-1,22 4,16" stroke="#cc4455" strokeWidth="1.8" fill="#dd5566" strokeLinecap="round" />
        <path d="M-4,17 Q-1,19 2,17" fill="#ffffff" opacity="0.5" />
      </g>

      {/* Motion lines behind Goldilocks */}
      <g opacity="0.3">
        <line x1="310" y1="370" x2="340" y2="370" stroke="#8a6838" strokeWidth="2" strokeLinecap="round" />
        <line x1="315" y1="380" x2="350" y2="380" stroke="#8a6838" strokeWidth="2" strokeLinecap="round" />
        <line x1="320" y1="390" x2="355" y2="390" stroke="#8a6838" strokeWidth="2" strokeLinecap="round" />
        <line x1="310" y1="400" x2="345" y2="400" stroke="#8a6838" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Hearts floating around */}
      <g>
        <path d="M180,300 Q175,292 170,300 Q170,306 180,314 Q190,306 190,300 Q185,292 180,300 Z" fill="#ff6688" opacity="0.6">
          <animate attributeName="opacity" values="0.6;0.3;0.6" dur="3s" repeatCount="indefinite" />
        </path>
        <path d="M320,280 Q316,274 312,280 Q312,285 320,291 Q328,285 328,280 Q324,274 320,280 Z" fill="#ff88aa" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.2;0.5" dur="3.5s" repeatCount="indefinite" />
        </path>
        <path d="M500,350 Q497,345 494,350 Q494,354 500,358 Q506,354 506,350 Q503,345 500,350 Z" fill="#ff6688" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.25;0.5" dur="4s" repeatCount="indefinite" />
        </path>
        <path d="M150,380 Q148,376 146,380 Q146,383 150,386 Q154,383 154,380 Q152,376 150,380 Z" fill="#ffaacc" opacity="0.4" />
        <path d="M560,300 Q557,295 554,300 Q554,304 560,308 Q566,304 566,300 Q563,295 560,300 Z" fill="#ff88aa" opacity="0.45" />
      </g>

      {/* Flowers on the ground */}
      <circle cx="150" cy="490" r="5" fill="#ff5577" />
      <circle cx="148" cy="487" r="5" fill="#ff6688" />
      <circle cx="153" cy="487" r="5" fill="#ff6688" />
      <line x1="150" y1="490" x2="150" y2="508" stroke="#3a7a30" strokeWidth="2" />

      <circle cx="350" cy="480" r="4.5" fill="#ffcc00" />
      <circle cx="348" cy="477" r="4.5" fill="#ffdd30" />
      <circle cx="353" cy="477" r="4.5" fill="#ffdd30" />
      <line x1="350" y1="480" x2="350" y2="496" stroke="#3a7a30" strokeWidth="1.5" />

      <circle cx="500" cy="470" r="4" fill="#9955cc" />
      <circle cx="498" cy="467" r="4" fill="#aa66dd" />
      <circle cx="503" cy="467" r="4" fill="#aa66dd" />
      <line x1="500" y1="470" x2="500" y2="484" stroke="#3a7a30" strokeWidth="1.5" />

      <circle cx="250" cy="500" r="4" fill="#6688dd" />
      <circle cx="248" cy="497" r="4" fill="#7799ee" />
      <circle cx="253" cy="497" r="4" fill="#7799ee" />
      <line x1="250" y1="500" x2="250" y2="514" stroke="#3a7a30" strokeWidth="1.5" />

      <circle cx="450" cy="490" r="3.5" fill="#ff9944" />
      <circle cx="448" cy="487" r="3.5" fill="#ffaa55" />
      <circle cx="453" cy="487" r="3.5" fill="#ffaa55" />
      <line x1="450" y1="490" x2="450" y2="502" stroke="#3a7a30" strokeWidth="1.5" />

      {/* Butterflies */}
      <g transform="translate(200, 280)">
        <animateTransform attributeName="transform" type="translate" values="200,280;210,270;205,285;195,275;200,280" dur="7s" repeatCount="indefinite" />
        <path d="M0,0 Q-8,-6 -5,-13 Q-1,-6 0,0" fill="#ff88cc" opacity="0.7" />
        <path d="M0,0 Q8,-6 5,-13 Q1,-6 0,0" fill="#ff88cc" opacity="0.7" />
        <path d="M0,0 Q-6,4 -4,9 Q-1,4 0,0" fill="#ff66aa" opacity="0.6" />
        <path d="M0,0 Q6,4 4,9 Q1,4 0,0" fill="#ff66aa" opacity="0.6" />
      </g>

      <g transform="translate(450, 300)">
        <animateTransform attributeName="transform" type="translate" values="450,300;458,290;452,305;445,295;450,300" dur="6s" repeatCount="indefinite" />
        <path d="M0,0 Q-7,-5 -4,-11 Q-1,-5 0,0" fill="#aaccff" opacity="0.7" />
        <path d="M0,0 Q7,-5 4,-11 Q1,-5 0,0" fill="#aaccff" opacity="0.7" />
        <path d="M0,0 Q-5,4 -3,8 Q-1,4 0,0" fill="#88aaee" opacity="0.6" />
        <path d="M0,0 Q5,4 3,8 Q1,4 0,0" fill="#88aaee" opacity="0.6" />
      </g>

      {/* Birds in the sky */}
      <path d="M300,130 Q308,122 316,130" stroke="#4a3520" strokeWidth="2" fill="none" />
      <path d="M316,130 Q324,122 332,130" stroke="#4a3520" strokeWidth="2" fill="none" />
      <path d="M250,100 Q256,94 262,100" stroke="#4a3520" strokeWidth="1.5" fill="none" />
      <path d="M262,100 Q268,94 274,100" stroke="#4a3520" strokeWidth="1.5" fill="none" />

      {/* Mushrooms */}
      <g transform="translate(420, 490)">
        <rect x="-3" y="0" width="6" height="10" rx="2" fill="#f0e0c0" />
        <ellipse cx="0" cy="0" rx="9" ry="6" fill="#cc3030" />
        <circle cx="-3" cy="-2" r="1.5" fill="#ffffff" opacity="0.8" />
        <circle cx="3" cy="-3" r="1.2" fill="#ffffff" opacity="0.8" />
      </g>

      {/* Spider web in tree */}
      <g transform="translate(50, 230)" opacity="0.25">
        <line x1="0" y1="0" x2="25" y2="0" stroke="#ffffff" strokeWidth="0.5" />
        <line x1="0" y1="0" x2="20" y2="15" stroke="#ffffff" strokeWidth="0.5" />
        <line x1="0" y1="0" x2="10" y2="22" stroke="#ffffff" strokeWidth="0.5" />
        <path d="M8,0 Q8,3 7,5" stroke="#ffffff" strokeWidth="0.4" fill="none" />
        <path d="M16,0 Q14,5 12,10" stroke="#ffffff" strokeWidth="0.4" fill="none" />
      </g>
    </svg>
  );
}