/**
 * Little Red Riding Hood — 10 illustrated SVG storybook scenes.
 * Warm, cute storybook style (Julia Donaldson / Gruffalo inspired).
 * Big expressive eyes, organic shapes, warm colours throughout.
 */

/* ================================================================
   SCENE 1 — "A little girl in a red hood"
   Sunny cottage garden, Red Riding Hood, mummy waving, flowers
   ================================================================ */
export function RidingScene1({ className = '' }) {
  return (
    <svg viewBox="0 0 800 600" className={`absolute inset-0 w-full h-full ${className}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="rs1Sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#87CEEB" />
          <stop offset="60%" stopColor="#b6e3f4" />
          <stop offset="100%" stopColor="#d4f0fc" />
        </linearGradient>
        <radialGradient id="rs1Sun" cx="85%" cy="12%" r="12%">
          <stop offset="0%" stopColor="#fff7ae" />
          <stop offset="60%" stopColor="#ffe066" />
          <stop offset="100%" stopColor="#ffd700" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="rs1Grass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5dba3b" />
          <stop offset="100%" stopColor="#3a8a28" />
        </linearGradient>
        <linearGradient id="rs1CapeGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>
        <radialGradient id="rs1Sunburst" cx="85%" cy="10%" r="35%">
          <stop offset="0%" stopColor="#fff7ae" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#fff7ae" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect width="800" height="600" fill="url(#rs1Sky)" />
      <rect width="800" height="600" fill="url(#rs1Sunburst)" />

      {/* Sun */}
      <circle cx="680" cy="72" r="48" fill="#ffe066" />
      <circle cx="680" cy="72" r="40" fill="#fff7ae" />
      {/* Sun rays */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
        <line
          key={i}
          x1={680 + 52 * Math.cos((angle * Math.PI) / 180)}
          y1={72 + 52 * Math.sin((angle * Math.PI) / 180)}
          x2={680 + 68 * Math.cos((angle * Math.PI) / 180)}
          y2={72 + 68 * Math.sin((angle * Math.PI) / 180)}
          stroke="#ffe066"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.7"
        />
      ))}

      {/* Fluffy clouds */}
      <g opacity="0.85">
        <ellipse cx="150" cy="80" rx="60" ry="25" fill="white" />
        <ellipse cx="120" cy="75" rx="40" ry="20" fill="white" />
        <ellipse cx="180" cy="78" rx="35" ry="18" fill="white" />
      </g>
      <g opacity="0.7">
        <ellipse cx="450" cy="55" rx="50" ry="20" fill="white" />
        <ellipse cx="420" cy="50" rx="35" ry="16" fill="white" />
        <ellipse cx="480" cy="52" rx="30" ry="14" fill="white" />
      </g>

      {/* Distant rolling hills */}
      <ellipse cx="400" cy="360" rx="500" ry="80" fill="#78c458" />
      <ellipse cx="200" cy="370" rx="300" ry="60" fill="#6ab648" />
      <ellipse cx="650" cy="365" rx="250" ry="55" fill="#6ab648" />

      {/* Main ground */}
      <rect x="0" y="380" width="800" height="220" fill="url(#rs1Grass)" />

      {/* Garden path — winding stone path */}
      <path d="M300,600 Q320,520 350,460 Q380,420 420,400" fill="none" stroke="#c4a265" strokeWidth="35" strokeLinecap="round" />
      <path d="M300,600 Q320,520 350,460 Q380,420 420,400" fill="none" stroke="#d4b275" strokeWidth="28" strokeLinecap="round" />
      {/* Path stones */}
      {[[310, 570], [325, 530], [340, 490], [355, 460], [375, 435], [400, 415]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="12" ry="6" fill="#b8976a" opacity="0.5" transform={`rotate(${i * 15}, ${x}, ${y})`} />
      ))}

      {/* White picket fence */}
      <rect x="30" y="365" width="250" height="5" fill="white" rx="2" />
      <rect x="30" y="390" width="250" height="5" fill="white" rx="2" />
      {[40, 65, 90, 115, 140, 165, 190, 215, 240, 265].map((x, i) => (
        <g key={i}>
          <rect x={x} y="345" width="8" height="60" fill="white" rx="2" />
          <polygon points={`${x},345 ${x + 4},335 ${x + 8},345`} fill="white" />
        </g>
      ))}
      {/* Fence shadow */}
      <rect x="30" y="395" width="250" height="3" fill="#3a8a28" opacity="0.3" rx="1" />

      {/* Cottage */}
      <g transform="translate(520, 240)">
        {/* Cottage body */}
        <rect x="0" y="40" width="180" height="120" fill="#f5e6c8" rx="4" />
        <rect x="0" y="40" width="180" height="120" fill="#edd9b5" rx="4" />
        {/* Stone texture accents */}
        <rect x="5" y="50" width="20" height="12" rx="3" fill="#e8d0a8" opacity="0.6" />
        <rect x="30" y="80" width="18" height="10" rx="3" fill="#e8d0a8" opacity="0.6" />
        <rect x="155" y="55" width="16" height="11" rx="3" fill="#e8d0a8" opacity="0.6" />
        <rect x="140" y="100" width="22" height="10" rx="3" fill="#e8d0a8" opacity="0.6" />
        {/* Roof — thatched */}
        <polygon points="-15,42 90,-15 195,42" fill="#b8860b" />
        <polygon points="-10,42 90,-10 190,42" fill="#d4a030" />
        {/* Thatch texture lines */}
        <line x1="20" y1="38" x2="50" y2="15" stroke="#c4942a" strokeWidth="2" />
        <line x1="60" y1="38" x2="80" y2="5" stroke="#c4942a" strokeWidth="2" />
        <line x1="120" y1="38" x2="100" y2="5" stroke="#c4942a" strokeWidth="2" />
        <line x1="160" y1="38" x2="130" y2="15" stroke="#c4942a" strokeWidth="2" />
        {/* Chimney */}
        <rect x="130" y="-10" width="25" height="40" fill="#a0522d" rx="2" />
        <rect x="126" y="-14" width="33" height="8" fill="#8b4513" rx="2" />
        {/* Chimney smoke */}
        <g opacity="0.3">
          <circle cx="143" cy="-25" r="6" fill="#d3d3d3">
            <animate attributeName="cy" values="-25;-55" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="148" cy="-35" r="8" fill="#d3d3d3">
            <animate attributeName="cy" values="-35;-70" dur="5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.25;0" dur="5s" repeatCount="indefinite" />
          </circle>
        </g>
        {/* Door */}
        <rect x="70" y="85" width="40" height="75" fill="#8b4513" rx="20 20 0 0" />
        <rect x="74" y="89" width="32" height="71" fill="#a0622d" rx="16 16 0 0" />
        <circle cx="98" cy="125" r="3" fill="#d4a030" />
        {/* Windows */}
        <g>
          <rect x="15" y="65" width="35" height="30" fill="#87CEEB" rx="3" stroke="#8b4513" strokeWidth="3" />
          <line x1="32" y1="65" x2="32" y2="95" stroke="#8b4513" strokeWidth="2" />
          <line x1="15" y1="80" x2="50" y2="80" stroke="#8b4513" strokeWidth="2" />
          {/* Checked curtains */}
          <path d="M17,67 Q25,75 17,82" fill="#dc2626" opacity="0.5" />
          <path d="M48,67 Q40,75 48,82" fill="#dc2626" opacity="0.5" />
        </g>
        <g>
          <rect x="130" y="65" width="35" height="30" fill="#87CEEB" rx="3" stroke="#8b4513" strokeWidth="3" />
          <line x1="147" y1="65" x2="147" y2="95" stroke="#8b4513" strokeWidth="2" />
          <line x1="130" y1="80" x2="165" y2="80" stroke="#8b4513" strokeWidth="2" />
          <path d="M132,67 Q140,75 132,82" fill="#dc2626" opacity="0.5" />
          <path d="M163,67 Q155,75 163,82" fill="#dc2626" opacity="0.5" />
        </g>

        {/* Mummy in doorway */}
        <g transform="translate(90, 95)">
          {/* Dress */}
          <path d="M-12,20 Q-15,45 -18,60 L18,60 Q15,45 12,20 Z" fill="#5b8cb8" />
          {/* Apron */}
          <path d="M-8,22 L-10,55 L10,55 L8,22 Z" fill="white" opacity="0.8" />
          {/* Head */}
          <circle cx="0" cy="8" r="14" fill="#fce4c8" />
          {/* Hair */}
          <path d="M-14,4 Q-15,-8 -5,-12 Q5,-14 14,-8 Q16,0 14,4" fill="#8b5e3c" />
          {/* Eyes */}
          <ellipse cx="-5" cy="6" rx="2.5" ry="3" fill="#5c3317" />
          <ellipse cx="5" cy="6" rx="2.5" ry="3" fill="#5c3317" />
          <circle cx="-4" cy="5" r="1" fill="white" />
          <circle cx="6" cy="5" r="1" fill="white" />
          {/* Smile */}
          <path d="M-5,12 Q0,17 5,12" fill="none" stroke="#c47a5a" strokeWidth="1.5" strokeLinecap="round" />
          {/* Rosy cheeks */}
          <circle cx="-9" cy="10" r="3" fill="#f0a0a0" opacity="0.5" />
          <circle cx="9" cy="10" r="3" fill="#f0a0a0" opacity="0.5" />
          {/* Waving arm */}
          <path d="M12,22 Q25,10 30,0 Q32,-4 28,-2" fill="none" stroke="#fce4c8" strokeWidth="5" strokeLinecap="round" />
          <circle cx="29" cy="-1" r="4" fill="#fce4c8" />
        </g>
      </g>

      {/* Garden flowers — clusters */}
      {/* Tulips */}
      {[[80, 430], [120, 445], [160, 435], [70, 460], [200, 450]].map(([x, y], i) => (
        <g key={`tulip${i}`}>
          <line x1={x} y1={y} x2={x} y2={y + 25} stroke="#3a7a28" strokeWidth="2" />
          <ellipse cx={x - 3} cy={y + 12} rx="6" ry="3" fill="#4a9a38" transform={`rotate(-30, ${x - 3}, ${y + 12})`} />
          <path d={`M${x - 6},${y + 2} Q${x},${y - 8} ${x + 6},${y + 2} Q${x},${y + 5} ${x - 6},${y + 2}`} fill={['#ff6b8a', '#ff85a2', '#e05577', '#ff6b8a', '#ff85a2'][i]} />
        </g>
      ))}
      {/* Daisies */}
      {[[420, 395], [460, 410], [380, 420], [500, 405], [440, 430]].map(([x, y], i) => (
        <g key={`daisy${i}`}>
          <line x1={x} y1={y} x2={x} y2={y + 20} stroke="#3a7a28" strokeWidth="1.5" />
          {[0, 60, 120, 180, 240, 300].map((a, j) => (
            <ellipse
              key={j}
              cx={x + 7 * Math.cos((a * Math.PI) / 180)}
              cy={y + 7 * Math.sin((a * Math.PI) / 180)}
              rx="5" ry="2.5"
              fill="white"
              transform={`rotate(${a}, ${x + 7 * Math.cos((a * Math.PI) / 180)}, ${y + 7 * Math.sin((a * Math.PI) / 180)})`}
            />
          ))}
          <circle cx={x} cy={y} r="4" fill="#ffd700" />
        </g>
      ))}
      {/* Sunflowers near fence */}
      {[[50, 350], [270, 348]].map(([x, y], i) => (
        <g key={`sunf${i}`}>
          <line x1={x} y1={y + 5} x2={x} y2={y + 50} stroke="#3a7a28" strokeWidth="3" />
          <ellipse cx={x - 10} cy={y + 25} rx="10" ry="5" fill="#4a9a38" transform={`rotate(-20, ${x - 10}, ${y + 25})`} />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a, j) => (
            <ellipse
              key={j}
              cx={x + 12 * Math.cos((a * Math.PI) / 180)}
              cy={y + 12 * Math.sin((a * Math.PI) / 180)}
              rx="7" ry="3"
              fill="#ffc107"
              transform={`rotate(${a}, ${x + 12 * Math.cos((a * Math.PI) / 180)}, ${y + 12 * Math.sin((a * Math.PI) / 180)})`}
            />
          ))}
          <circle cx={x} cy={y} r="8" fill="#8b5e3c" />
        </g>
      ))}

      {/* RED RIDING HOOD — main character */}
      <g transform="translate(320, 370)">
        {/* Shadow on ground */}
        <ellipse cx="0" cy="85" rx="30" ry="8" fill="#2a6a18" opacity="0.3" />

        {/* Cape — flowing red */}
        <path d="M-5,-30 Q-30,-20 -35,20 Q-38,50 -30,80 L30,80 Q38,50 35,20 Q30,-20 5,-30 Z" fill="#dc2626" />
        <path d="M-5,-30 Q-25,-18 -30,20 Q-32,48 -25,75 L-10,78 Q-15,45 -12,15 Q-8,-10 -5,-30 Z" fill="#ef4444" opacity="0.6" />
        <path d="M5,-30 Q25,-18 30,20 Q32,48 25,75 L10,78 Q15,45 12,15 Q8,-10 5,-30 Z" fill="#b91c1c" opacity="0.4" />
        {/* Cape ripple at bottom */}
        <path d="M-30,75 Q-20,82 -10,75 Q0,82 10,75 Q20,82 30,75 L30,80 Q20,87 10,80 Q0,87 -10,80 Q-20,87 -30,80 Z" fill="#dc2626" />

        {/* Dress peeking under cape */}
        <path d="M-15,55 L-20,80 L20,80 L15,55 Z" fill="#f8b4c8" />

        {/* Shoes */}
        <ellipse cx="-12" cy="82" rx="8" ry="4" fill="#4a3520" />
        <ellipse cx="12" cy="82" rx="8" ry="4" fill="#4a3520" />

        {/* Arms */}
        <path d="M-20,25 Q-35,35 -30,45" fill="none" stroke="#fce4c8" strokeWidth="6" strokeLinecap="round" />
        <path d="M20,25 Q35,35 30,45" fill="none" stroke="#fce4c8" strokeWidth="6" strokeLinecap="round" />

        {/* Basket in right hand */}
        <g transform="translate(30, 42)">
          <path d="M-10,0 Q0,-12 10,0" fill="none" stroke="#8b5e3c" strokeWidth="2.5" />
          <rect x="-10" y="0" width="20" height="12" fill="#d4a030" rx="2" />
          <rect x="-10" y="0" width="20" height="12" fill="none" stroke="#8b5e3c" strokeWidth="1.5" rx="2" />
          {/* Weave lines */}
          <line x1="-8" y1="4" x2="8" y2="4" stroke="#c4942a" strokeWidth="0.8" />
          <line x1="-8" y1="8" x2="8" y2="8" stroke="#c4942a" strokeWidth="0.8" />
          {/* Cloth on top */}
          <path d="M-11,-1 Q0,-5 11,-1" fill="#ff6b8a" opacity="0.6" />
        </g>

        {/* Hood */}
        <path d="M0,-50 Q-22,-48 -25,-30 Q-28,-15 -22,-5 Q-15,5 0,8 Q15,5 22,-5 Q28,-15 25,-30 Q22,-48 0,-50 Z" fill="#dc2626" />
        <path d="M0,-50 Q-18,-46 -20,-30 Q-22,-18 -18,-8 Q-10,2 0,5 Q-5,-5 -8,-20 Q-5,-40 0,-50 Z" fill="#ef4444" opacity="0.5" />

        {/* Face */}
        <ellipse cx="0" cy="-20" rx="16" ry="18" fill="#fce4c8" />

        {/* Pigtails peeking from hood */}
        <path d="M-18,-15 Q-25,-12 -28,-5 Q-30,0 -26,5" fill="none" stroke="#8b5e3c" strokeWidth="5" strokeLinecap="round" />
        <path d="M18,-15 Q25,-12 28,-5 Q30,0 26,5" fill="none" stroke="#8b5e3c" strokeWidth="5" strokeLinecap="round" />
        {/* Pigtail bows */}
        <path d="M-28,2 Q-33,-2 -32,4 Q-28,3 -28,2 Z" fill="#dc2626" />
        <path d="M-28,2 Q-23,-2 -24,4 Q-28,3 -28,2 Z" fill="#dc2626" />
        <path d="M28,2 Q33,-2 32,4 Q28,3 28,2 Z" fill="#dc2626" />
        <path d="M28,2 Q23,-2 24,4 Q28,3 28,2 Z" fill="#dc2626" />

        {/* Big eyes */}
        <ellipse cx="-6" cy="-22" rx="5" ry="5.5" fill="white" />
        <ellipse cx="6" cy="-22" rx="5" ry="5.5" fill="white" />
        <ellipse cx="-5" cy="-21" rx="3.5" ry="4" fill="#5c3317" />
        <ellipse cx="7" cy="-21" rx="3.5" ry="4" fill="#5c3317" />
        <circle cx="-4" cy="-22" r="1.5" fill="white" />
        <circle cx="8" cy="-22" r="1.5" fill="white" />
        <circle cx="-6" cy="-20" r="0.8" fill="white" />
        <circle cx="6" cy="-20" r="0.8" fill="white" />
        {/* Eyelashes */}
        <path d="M-10,-24 L-12,-27" stroke="#5c3317" strokeWidth="1" strokeLinecap="round" />
        <path d="M-8,-26 L-9,-29" stroke="#5c3317" strokeWidth="1" strokeLinecap="round" />
        <path d="M10,-24 L12,-27" stroke="#5c3317" strokeWidth="1" strokeLinecap="round" />
        <path d="M8,-26 L9,-29" stroke="#5c3317" strokeWidth="1" strokeLinecap="round" />

        {/* Button nose */}
        <ellipse cx="0" cy="-16" rx="2" ry="1.5" fill="#f0b8a0" />

        {/* Sweet smile */}
        <path d="M-6,-11 Q0,-6 6,-11" fill="none" stroke="#c47a5a" strokeWidth="1.5" strokeLinecap="round" />

        {/* Rosy cheeks */}
        <circle cx="-11" cy="-16" r="4" fill="#f0a0a0" opacity="0.45" />
        <circle cx="11" cy="-16" r="4" fill="#f0a0a0" opacity="0.45" />
      </g>

      {/* Butterflies */}
      <g opacity="0.85">
        <g transform="translate(250, 320)">
          <path d="M0,0 Q-8,-10 -5,-15 Q-2,-18 0,-12 Q2,-18 5,-15 Q8,-10 0,0 Z" fill="#ff85a2" />
          <path d="M0,0 Q-6,8 -4,12 Q-1,14 0,8 Q1,14 4,12 Q6,8 0,0 Z" fill="#ffb3c6" />
          <line x1="0" y1="-4" x2="-2" y2="-10" stroke="#333" strokeWidth="0.5" />
          <line x1="0" y1="-4" x2="2" y2="-10" stroke="#333" strokeWidth="0.5" />
          <animateTransform attributeName="transform" type="translate" values="250,320;260,310;255,325;250,320" dur="6s" repeatCount="indefinite" />
        </g>
        <g transform="translate(480, 350)">
          <path d="M0,0 Q-7,-9 -4,-13 Q-1,-16 0,-10 Q1,-16 4,-13 Q7,-9 0,0 Z" fill="#a78bfa" />
          <path d="M0,0 Q-5,7 -3,10 Q-1,12 0,7 Q1,12 3,10 Q5,7 0,0 Z" fill="#c4b5fd" />
          <line x1="0" y1="-3" x2="-2" y2="-9" stroke="#333" strokeWidth="0.5" />
          <line x1="0" y1="-3" x2="2" y2="-9" stroke="#333" strokeWidth="0.5" />
          <animateTransform attributeName="transform" type="translate" values="480,350;470,340;475,355;480,350" dur="7s" repeatCount="indefinite" />
        </g>
      </g>

      {/* Bees */}
      {[[180, 380], [300, 340]].map(([x, y], i) => (
        <g key={`bee${i}`}>
          <ellipse cx={x} cy={y} rx="5" ry="4" fill="#ffd700" />
          <line x1={x - 2} y1={y - 2} x2={x - 2} y2={y + 2} stroke="#333" strokeWidth="1" />
          <line x1={x + 2} y1={y - 2} x2={x + 2} y2={y + 2} stroke="#333" strokeWidth="1" />
          <ellipse cx={x - 3} cy={y - 4} rx="3" ry="2" fill="white" opacity="0.7" transform={`rotate(-20, ${x - 3}, ${y - 4})`} />
          <ellipse cx={x + 3} cy={y - 4} rx="3" ry="2" fill="white" opacity="0.7" transform={`rotate(20, ${x + 3}, ${y - 4})`} />
          <animateTransform attributeName="transform" type="translate" values={`0,0;${5 + i * 3},${-3 - i * 2};${-2 + i},${4 - i};0,0`} dur={`${4 + i}s`} repeatCount="indefinite" />
        </g>
      ))}

      {/* Ladybird on fence */}
      <g transform="translate(160, 360)">
        <ellipse cx="0" cy="0" rx="5" ry="4" fill="#dc2626" />
        <line x1="0" y1="-4" x2="0" y2="4" stroke="#333" strokeWidth="0.8" />
        <circle cx="-2" cy="-1" r="1" fill="#333" />
        <circle cx="2" cy="1" r="1" fill="#333" />
        <circle cx="0" cy="-4" r="2" fill="#333" />
      </g>

      {/* Small bird on fence */}
      <g transform="translate(220, 335)">
        <ellipse cx="0" cy="0" rx="8" ry="6" fill="#e07040" />
        <circle cx="7" cy="-3" r="5" fill="#e07040" />
        <circle cx="7" cy="-3" r="4" fill="#f0a070" />
        <ellipse cx="10" cy="-3" rx="2" ry="1" fill="#ffd700" />
        <circle cx="9" cy="-4" r="1.2" fill="#333" />
        <circle cx="9.5" cy="-4.5" r="0.5" fill="white" />
        <path d="M-5,3 Q-10,0 -12,4" fill="none" stroke="#c06030" strokeWidth="2" strokeLinecap="round" />
        <line x1="-2" y1="6" x2="-3" y2="10" stroke="#8b5e3c" strokeWidth="1.5" />
        <line x1="2" y1="6" x2="3" y2="10" stroke="#8b5e3c" strokeWidth="1.5" />
      </g>

      {/* Foreground grass tufts */}
      {[30, 100, 200, 350, 500, 600, 700, 750].map((x, i) => (
        <g key={`grass${i}`}>
          <path d={`M${x},600 Q${x - 3},${575 - (i % 3) * 5} ${x - 5},${570 - (i % 3) * 5}`} fill="none" stroke="#2a7a18" strokeWidth="2" />
          <path d={`M${x},600 Q${x + 2},${578 - (i % 2) * 8} ${x + 1},${572 - (i % 2) * 8}`} fill="none" stroke="#3a8a28" strokeWidth="2" />
          <path d={`M${x},600 Q${x + 6},${576 - (i % 3) * 4} ${x + 8},${568 - (i % 3) * 4}`} fill="none" stroke="#2a7a18" strokeWidth="2" />
        </g>
      ))}
    </svg>
  );
}


/* ================================================================
   SCENE 2 — "Mummy gives her a basket of goodies"
   Close-up of mummy handing basket to Red, kitchen doorstep
   ================================================================ */
export function RidingScene2({ className = '' }) {
  return (
    <svg viewBox="0 0 800 600" className={`absolute inset-0 w-full h-full ${className}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="rs2Wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5e6c8" />
          <stop offset="100%" stopColor="#edd9b5" />
        </linearGradient>
        <linearGradient id="rs2Floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c4a265" />
          <stop offset="100%" stopColor="#a88845" />
        </linearGradient>
      </defs>

      {/* Indoor / doorstep background */}
      <rect width="800" height="600" fill="url(#rs2Wall)" />

      {/* Doorframe */}
      <rect x="250" y="30" width="300" height="520" fill="#87CEEB" rx="4" />
      <rect x="250" y="30" width="300" height="520" fill="#b6e3f4" rx="4" />
      {/* Garden visible through door */}
      <rect x="255" y="430" width="290" height="120" fill="#5dba3b" />
      <ellipse cx="400" cy="430" rx="180" ry="30" fill="#6ab648" />
      {/* Sky through door */}
      <rect x="255" y="35" width="290" height="400" fill="#87CEEB" />
      {/* Clouds through door */}
      <ellipse cx="350" cy="80" rx="30" ry="12" fill="white" opacity="0.7" />
      <ellipse cx="450" cy="100" rx="25" ry="10" fill="white" opacity="0.6" />

      {/* Door frame wood */}
      <rect x="240" y="20" width="20" height="540" fill="#8b4513" />
      <rect x="540" y="20" width="20" height="540" fill="#8b4513" />
      <rect x="240" y="20" width="320" height="20" fill="#8b4513" />

      {/* Indoor wall details — left side */}
      <rect x="0" y="0" width="250" height="600" fill="url(#rs2Wall)" />
      {/* Checked curtain — left */}
      <path d="M240,25 Q200,100 210,200 L240,200 L240,25 Z" fill="#dc2626" opacity="0.3" />
      <path d="M240,25 Q220,60 230,120 L240,120 Z" fill="#ef4444" opacity="0.2" />

      {/* Indoor wall details — right side */}
      <rect x="550" y="0" width="250" height="600" fill="url(#rs2Wall)" />
      {/* Checked curtain — right */}
      <path d="M560,25 Q600,100 590,200 L560,200 L560,25 Z" fill="#dc2626" opacity="0.3" />

      {/* Floor — stone doorstep */}
      <rect x="0" y="480" width="800" height="120" fill="url(#rs2Floor)" />
      <rect x="260" y="475" width="280" height="20" fill="#a0896a" rx="3" />

      {/* Kitchen shelf with items on left wall */}
      <rect x="30" y="120" width="150" height="8" fill="#8b5e3c" />
      {/* Jar */}
      <rect x="50" y="88" width="20" height="30" fill="#e8d4b0" rx="2" stroke="#c4942a" strokeWidth="1" />
      <rect x="48" y="85" width="24" height="6" fill="#8b5e3c" rx="2" />
      {/* Cup */}
      <path d="M100,100 L95,125 L115,125 L110,100 Z" fill="#87CEEB" stroke="#5ba0c8" strokeWidth="1" />
      <path d="M115,107 Q122,107 122,112 Q122,117 115,117" fill="none" stroke="#5ba0c8" strokeWidth="1.5" />
      {/* Spice jar */}
      <rect x="140" y="95" width="15" height="23" fill="#e07040" rx="2" />
      <rect x="138" y="92" width="19" height="6" fill="#c06030" rx="2" />

      {/* Picture frame on right wall */}
      <rect x="600" y="100" width="60" height="50" fill="#fff8e0" stroke="#8b5e3c" strokeWidth="3" rx="2" />
      <circle cx="630" cy="118" r="8" fill="#fce4c8" />
      <path d="M625,128 L635,128 L638,140 L622,140 Z" fill="#5b8cb8" />

      {/* MUMMY — left side */}
      <g transform="translate(310, 260)">
        {/* Dress */}
        <path d="M-20,40 Q-28,80 -32,140 L32,140 Q28,80 20,40 Z" fill="#5b8cb8" />
        {/* Dress pattern */}
        <circle cx="-10" cy="70" r="3" fill="#7ba8d0" opacity="0.5" />
        <circle cx="8" cy="90" r="3" fill="#7ba8d0" opacity="0.5" />
        <circle cx="-5" cy="110" r="3" fill="#7ba8d0" opacity="0.5" />
        {/* Apron */}
        <path d="M-15,45 L-18,135 L18,135 L15,45 Z" fill="white" opacity="0.7" />
        <path d="M-15,45 Q0,42 15,45" fill="none" stroke="white" strokeWidth="2" />
        {/* Apron ties */}
        <path d="M-18,50 Q-30,55 -28,65" fill="none" stroke="white" strokeWidth="2" />
        <path d="M18,50 Q30,55 28,65" fill="none" stroke="white" strokeWidth="2" />

        {/* Head */}
        <circle cx="0" cy="15" r="22" fill="#fce4c8" />
        {/* Hair */}
        <path d="M-22,10 Q-24,-5 -15,-15 Q-5,-22 5,-22 Q15,-18 22,-8 Q25,2 22,10" fill="#8b5e3c" />
        <path d="M-20,10 Q-18,5 -10,8 Q0,12 10,8 Q18,5 20,10" fill="#8b5e3c" opacity="0.3" />
        {/* Hair bun */}
        <circle cx="0" cy="-18" r="8" fill="#8b5e3c" />

        {/* Eyes */}
        <ellipse cx="-7" cy="12" rx="4" ry="4.5" fill="white" />
        <ellipse cx="7" cy="12" rx="4" ry="4.5" fill="white" />
        <ellipse cx="-6" cy="13" rx="2.8" ry="3.2" fill="#5c3317" />
        <ellipse cx="8" cy="13" rx="2.8" ry="3.2" fill="#5c3317" />
        <circle cx="-5" cy="12" r="1.2" fill="white" />
        <circle cx="9" cy="12" r="1.2" fill="white" />

        {/* Loving smile */}
        <path d="M-8,22 Q0,30 8,22" fill="none" stroke="#c47a5a" strokeWidth="2" strokeLinecap="round" />

        {/* Rosy cheeks */}
        <circle cx="-14" cy="18" r="4" fill="#f0a0a0" opacity="0.4" />
        <circle cx="14" cy="18" r="4" fill="#f0a0a0" opacity="0.4" />

        {/* Arms reaching down with basket */}
        <path d="M20,45 Q35,70 40,95" fill="none" stroke="#fce4c8" strokeWidth="8" strokeLinecap="round" />
        <path d="M-20,45 Q-30,65 -25,85" fill="none" stroke="#fce4c8" strokeWidth="8" strokeLinecap="round" />
      </g>

      {/* THE BASKET — centre of scene */}
      <g transform="translate(370, 380)">
        {/* Basket body */}
        <path d="M-40,0 Q-45,25 -40,45 L40,45 Q45,25 40,0 Z" fill="#d4a030" />
        <path d="M-40,0 Q-45,25 -40,45 L40,45 Q45,25 40,0 Z" fill="none" stroke="#8b5e3c" strokeWidth="2" />
        {/* Weave pattern */}
        {[-30, -15, 0, 15, 30].map((x, i) => (
          <line key={i} x1={x} y1="2" x2={x} y2="43" stroke="#c4942a" strokeWidth="1" opacity="0.5" />
        ))}
        {[10, 20, 30].map((y, i) => (
          <path key={i} d={`M-38,${y} L38,${y}`} stroke="#c4942a" strokeWidth="1" opacity="0.5" />
        ))}
        {/* Handle */}
        <path d="M-30,-2 Q0,-35 30,-2" fill="none" stroke="#8b5e3c" strokeWidth="4" strokeLinecap="round" />

        {/* Goodies inside basket */}
        {/* Cloth napkin */}
        <path d="M-38,0 Q-20,-8 0,-3 Q20,-8 38,0" fill="#ff85a2" opacity="0.6" />
        {/* Cupcake */}
        <g transform="translate(-18, -10)">
          <rect x="-6" y="0" width="12" height="10" fill="#d4a060" rx="1" />
          <circle cx="0" cy="-2" r="8" fill="#ff85a2" />
          <circle cx="0" cy="-5" r="3" fill="#dc2626" />
        </g>
        {/* Bread loaf */}
        <g transform="translate(8, -5)">
          <ellipse cx="0" cy="2" rx="12" ry="7" fill="#d4a030" />
          <ellipse cx="0" cy="-1" rx="10" ry="5" fill="#e8c060" />
        </g>
        {/* Jam jar */}
        <g transform="translate(25, -10)">
          <rect x="-6" y="-2" width="12" height="14" fill="#dc2626" opacity="0.7" rx="2" />
          <rect x="-6" y="-2" width="12" height="14" fill="none" stroke="#8b5e3c" strokeWidth="1" rx="2" />
          <rect x="-7" y="-5" width="14" height="5" fill="#f5e6c8" rx="1" />
          <rect x="-4" y="2" width="8" height="4" fill="white" opacity="0.3" rx="1" />
        </g>
        {/* Fruit — apple */}
        <g transform="translate(-8, -18)">
          <circle cx="0" cy="0" r="6" fill="#4caf50" />
          <circle cx="-2" cy="-2" r="2" fill="#66cc66" opacity="0.5" />
          <path d="M0,-6 Q2,-10 4,-8" fill="none" stroke="#5c3d1e" strokeWidth="1" />
          <ellipse cx="3" cy="-9" rx="3" ry="1.5" fill="#4caf50" transform="rotate(-30, 3, -9)" />
        </g>
      </g>

      {/* RED RIDING HOOD — right side, reaching for basket */}
      <g transform="translate(480, 310)">
        {/* Cape */}
        <path d="M-5,-35 Q-25,-25 -28,10 Q-30,40 -25,80 L20,80 Q28,40 25,10 Q22,-25 5,-35 Z" fill="#dc2626" />
        <path d="M-5,-35 Q-20,-23 -22,10 Q-24,38 -20,70 L-8,75 Q-12,40 -10,10 Q-8,-15 -5,-35 Z" fill="#ef4444" opacity="0.5" />

        {/* Dress */}
        <path d="M-12,45 L-16,78 L16,78 L12,45 Z" fill="#f8b4c8" />

        {/* Shoes */}
        <ellipse cx="-10" cy="80" rx="7" ry="3.5" fill="#4a3520" />
        <ellipse cx="10" cy="80" rx="7" ry="3.5" fill="#4a3520" />

        {/* Arms reaching toward basket */}
        <path d="M-18,20 Q-40,40 -55,55" fill="none" stroke="#fce4c8" strokeWidth="6" strokeLinecap="round" />
        <circle cx="-56" cy="56" r="4" fill="#fce4c8" />
        <path d="M-10,20 Q-30,45 -50,55" fill="none" stroke="#fce4c8" strokeWidth="6" strokeLinecap="round" />

        {/* Hood */}
        <path d="M0,-52 Q-20,-50 -22,-35 Q-25,-20 -20,-10 Q-12,0 0,3 Q12,0 20,-10 Q25,-20 22,-35 Q20,-50 0,-52 Z" fill="#dc2626" />
        <path d="M0,-52 Q-16,-48 -18,-33 Q-20,-22 -16,-12 Q-8,-2 0,1 Q-4,-10 -6,-25 Q-4,-42 0,-52 Z" fill="#ef4444" opacity="0.5" />

        {/* Face */}
        <ellipse cx="0" cy="-25" rx="14" ry="16" fill="#fce4c8" />

        {/* Pigtails */}
        <path d="M-16,-20 Q-22,-16 -24,-8 Q-25,-3 -22,2" fill="none" stroke="#8b5e3c" strokeWidth="5" strokeLinecap="round" />
        <path d="M16,-20 Q22,-16 24,-8 Q25,-3 22,2" fill="none" stroke="#8b5e3c" strokeWidth="5" strokeLinecap="round" />

        {/* BIG excited eyes */}
        <ellipse cx="-5" cy="-27" rx="5" ry="6" fill="white" />
        <ellipse cx="5" cy="-27" rx="5" ry="6" fill="white" />
        <ellipse cx="-4" cy="-26" rx="3.5" ry="4.5" fill="#5c3317" />
        <ellipse cx="6" cy="-26" rx="3.5" ry="4.5" fill="#5c3317" />
        {/* Sparkle eyes — excited */}
        <circle cx="-3" cy="-28" r="1.8" fill="white" />
        <circle cx="7" cy="-28" r="1.8" fill="white" />
        <circle cx="-5" cy="-25" r="0.8" fill="white" />
        <circle cx="5" cy="-25" r="0.8" fill="white" />
        {/* Star sparkles in eyes */}
        <path d="M-3,-28 L-2,-29 L-3,-30 L-4,-29 Z" fill="white" opacity="0.8" />
        <path d="M7,-28 L8,-29 L7,-30 L6,-29 Z" fill="white" opacity="0.8" />

        {/* Excited open mouth smile */}
        <ellipse cx="0" cy="-15" rx="6" ry="4" fill="#c47a5a" />
        <ellipse cx="0" cy="-16" rx="5" ry="2" fill="white" />

        {/* Rosy cheeks */}
        <circle cx="-10" cy="-20" r="4" fill="#f0a0a0" opacity="0.45" />
        <circle cx="10" cy="-20" r="4" fill="#f0a0a0" opacity="0.45" />

        {/* Button nose */}
        <ellipse cx="0" cy="-20" rx="2" ry="1.5" fill="#f0b8a0" />
      </g>

      {/* Small mouse in corner */}
      <g transform="translate(100, 510)">
        <ellipse cx="0" cy="0" rx="8" ry="5" fill="#b0a090" />
        <circle cx="8" cy="-3" r="4" fill="#b0a090" />
        <circle cx="6" cy="-6" r="3" fill="#c8b8a8" />
        <circle cx="10" cy="-6" r="3" fill="#c8b8a8" />
        <circle cx="10" cy="-4" r="1" fill="#333" />
        <ellipse cx="11" cy="-2" rx="1.5" ry="1" fill="#ff85a2" />
        <path d="M-8,0 Q-18,5 -20,0" fill="none" stroke="#b0a090" strokeWidth="1.5" />
      </g>

      {/* Warm golden light overlay */}
      <rect width="800" height="600" fill="#ffe680" opacity="0.06" />
    </svg>
  );
}


/* ================================================================
   SCENE 3 — "Skipping through the forest"
   Beautiful forest, dappled sunlight, Red skipping, forest creatures
   ================================================================ */
export function RidingScene3({ className = '' }) {
  return (
    <svg viewBox="0 0 800 600" className={`absolute inset-0 w-full h-full ${className}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="rs3Sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a8d8ea" />
          <stop offset="50%" stopColor="#88c4a8" />
          <stop offset="100%" stopColor="#4a7c59" />
        </linearGradient>
        <linearGradient id="rs3Sunbeam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffe680" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ffe680" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="rs3Bark" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5c3d2e" />
          <stop offset="50%" stopColor="#6b4830" />
          <stop offset="100%" stopColor="#4e3322" />
        </linearGradient>
        <linearGradient id="rs3Path" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c4a265" />
          <stop offset="100%" stopColor="#a88845" />
        </linearGradient>
        <radialGradient id="rs3Dapple" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffe680" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#ffe680" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sky through canopy */}
      <rect width="800" height="600" fill="url(#rs3Sky)" />

      {/* Background trees — far layer */}
      {[50, 180, 350, 520, 680].map((x, i) => (
        <g key={`bgtree${i}`} opacity="0.4">
          <rect x={x - 8} y={120 + i * 5} width="16" height={280 - i * 5} fill="#3a5a2a" />
          <ellipse cx={x} cy={120 + i * 5} rx={40 + i * 5} ry={60 + i * 3} fill="#3a6a2a" />
        </g>
      ))}

      {/* Mid-ground trees */}
      {[100, 300, 550, 720].map((x, i) => (
        <g key={`midtree${i}`} opacity="0.6">
          <rect x={x - 12} y={150 + i * 8} width="24" height={300 - i * 8} fill="#5c3d2e" />
          <ellipse cx={x} cy={150 + i * 8} rx={50 + i * 8} ry={70 + i * 5} fill="#4a8a38" />
          <ellipse cx={x - 10} cy={160 + i * 8} rx={35 + i * 5} ry={50 + i * 3} fill="#5a9a48" opacity="0.6" />
        </g>
      ))}

      {/* Forest floor */}
      <path d="M0,420 Q200,400 400,410 Q600,420 800,405 L800,600 L0,600 Z" fill="#3a5a2a" />
      <path d="M0,440 Q200,425 400,435 Q600,445 800,430 L800,600 L0,600 Z" fill="#2e4a20" />

      {/* Winding path */}
      <path d="M-20,600 Q100,520 200,480 Q350,440 500,450 Q650,460 820,500" fill="none" stroke="#c4a265" strokeWidth="45" strokeLinecap="round" />
      <path d="M-20,600 Q100,520 200,480 Q350,440 500,450 Q650,460 820,500" fill="none" stroke="#d4b275" strokeWidth="35" strokeLinecap="round" />
      {/* Path dappled light spots */}
      {[[150, 500], [280, 465], [400, 448], [530, 458], [650, 475]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="15" ry="6" fill="#ffe680" opacity="0.15" />
      ))}

      {/* Foreground trees — left */}
      <g>
        <rect x="20" y="100" width="40" height="500" fill="url(#rs3Bark)" />
        <rect x="25" y="100" width="10" height="500" fill="#6b4830" opacity="0.3" />
        {/* Tree texture */}
        {[200, 280, 360, 440].map((y, i) => (
          <path key={i} d={`M22,${y} Q40,${y + 5} 58,${y}`} fill="none" stroke="#4e3322" strokeWidth="1" opacity="0.4" />
        ))}
        <ellipse cx="40" cy="90" rx="80" ry="100" fill="#3a7a28" />
        <ellipse cx="20" cy="110" rx="55" ry="70" fill="#4a8a38" opacity="0.7" />
        <ellipse cx="60" cy="100" rx="50" ry="65" fill="#5a9a48" opacity="0.5" />
      </g>

      {/* Foreground tree — right */}
      <g>
        <rect x="700" y="80" width="45" height="520" fill="url(#rs3Bark)" />
        <rect x="708" y="80" width="12" height="520" fill="#6b4830" opacity="0.3" />
        <ellipse cx="722" cy="70" rx="90" ry="110" fill="#3a7a28" />
        <ellipse cx="740" cy="90" rx="60" ry="75" fill="#4a8a38" opacity="0.7" />
        <ellipse cx="700" cy="85" rx="55" ry="70" fill="#5a9a48" opacity="0.5" />
        {/* Branch extending */}
        <path d="M710,200 Q620,180 560,190" fill="none" stroke="#5c3d2e" strokeWidth="10" strokeLinecap="round" />
        <ellipse cx="570" cy="175" rx="40" ry="30" fill="#4a8a38" />
      </g>

      {/* Sunbeams through canopy */}
      <polygon points="300,0 280,350 320,350" fill="url(#rs3Sunbeam)" opacity="0.5" />
      <polygon points="500,0 475,300 525,300" fill="url(#rs3Sunbeam)" opacity="0.4" />
      <polygon points="650,0 640,250 680,250" fill="url(#rs3Sunbeam)" opacity="0.3" />

      {/* Dappled light spots on ground */}
      {[[180, 430], [320, 420], [480, 435], [600, 425], [250, 450], [420, 445]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx={20 + i * 3} ry={10 + i * 2} fill="url(#rs3Dapple)" />
      ))}

      {/* Wildflowers — bluebells */}
      {[[120, 460], [180, 475], [580, 450], [650, 465], [520, 470]].map(([x, y], i) => (
        <g key={`bell${i}`}>
          <line x1={x} y1={y} x2={x} y2={y + 15} stroke="#3a7a28" strokeWidth="1.5" />
          <path d={`M${x - 3},${y} Q${x},${y - 5} ${x + 3},${y} Q${x},${y + 3} ${x - 3},${y}`} fill="#6366f1" />
          <path d={`M${x - 2},${y + 5} Q${x + 1},${y} ${x + 4},${y + 5} Q${x + 1},${y + 8} ${x - 2},${y + 5}`} fill="#818cf8" />
        </g>
      ))}

      {/* Foxgloves */}
      {[[150, 430], [620, 440]].map(([x, y], i) => (
        <g key={`fox${i}`}>
          <line x1={x} y1={y} x2={x} y2={y + 40} stroke="#3a7a28" strokeWidth="2" />
          {[0, 8, 16, 24].map((dy, j) => (
            <ellipse key={j} cx={x + (j % 2 === 0 ? 4 : -4)} cy={y + dy} rx="5" ry="4" fill={j < 2 ? '#c084fc' : '#a855f7'} />
          ))}
        </g>
      ))}

      {/* Mushrooms */}
      {[[80, 455], [660, 448], [330, 470]].map(([x, y], i) => (
        <g key={`mush${i}`}>
          <rect x={x - 3} y={y} width="6" height="10" fill="#f5e6c8" rx="2" />
          <ellipse cx={x} cy={y} rx="10" ry="6" fill={i === 0 ? '#dc2626' : '#e07040'} />
          {i === 0 && <>
            <circle cx={x - 4} cy={y - 1} r="1.5" fill="white" />
            <circle cx={x + 3} cy={y - 2} r="1.5" fill="white" />
            <circle cx={x} cy={y + 2} r="1" fill="white" />
          </>}
        </g>
      ))}

      {/* RED RIDING HOOD — skipping along the path */}
      <g transform="translate(350, 395)">
        {/* Shadow */}
        <ellipse cx="0" cy="65" rx="25" ry="7" fill="#2a5a18" opacity="0.3" />

        {/* Cape flying behind — motion! */}
        <path d="M5,-30 Q30,-15 40,10 Q45,35 38,60 Q30,50 20,55 Q10,40 5,20 Z" fill="#dc2626" />
        <path d="M5,-30 Q28,-12 35,12 Q38,30 35,45 Q28,40 22,45 Q15,32 10,15 Z" fill="#ef4444" opacity="0.5" />
        {/* Cape flutter at edge */}
        <path d="M35,45 Q42,50 38,60 Q32,55 35,45 Z" fill="#b91c1c" opacity="0.6" />

        {/* Front of cape */}
        <path d="M-5,-30 Q-15,-20 -18,0 Q-20,20 -15,50 L5,50 Q8,20 5,0 Q3,-15 -5,-30 Z" fill="#dc2626" />

        {/* Dress */}
        <path d="M-10,35 L-14,58 L14,58 L10,35 Z" fill="#f8b4c8" />

        {/* Skipping legs — one forward, one back */}
        <path d="M-8,55 L-18,45 L-20,48" fill="none" stroke="#fce4c8" strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="-20" cy="50" rx="6" ry="3" fill="#4a3520" />
        <path d="M8,55 L20,60 L22,63" fill="none" stroke="#fce4c8" strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="22" cy="65" rx="6" ry="3" fill="#4a3520" />

        {/* Arms — one up, one swinging */}
        <path d="M-15,10 Q-30,0 -28,-10" fill="none" stroke="#fce4c8" strokeWidth="5" strokeLinecap="round" />
        <path d="M15,15 Q25,25 28,35" fill="none" stroke="#fce4c8" strokeWidth="5" strokeLinecap="round" />

        {/* Basket swinging */}
        <g transform="translate(28, 32) rotate(10)">
          <path d="M-8,0 Q0,-10 8,0" fill="none" stroke="#8b5e3c" strokeWidth="2" />
          <rect x="-8" y="0" width="16" height="10" fill="#d4a030" rx="2" stroke="#8b5e3c" strokeWidth="1" />
          <path d="M-9,-1 Q0,-4 9,-1" fill="#ff85a2" opacity="0.5" />
        </g>

        {/* Hood */}
        <path d="M0,-48 Q-18,-46 -20,-32 Q-22,-20 -18,-10 Q-10,0 0,3 Q10,0 18,-10 Q22,-20 20,-32 Q18,-46 0,-48 Z" fill="#dc2626" />
        <path d="M0,-48 Q-14,-44 -16,-32 Q-18,-22 -14,-12 Q-8,-2 0,1 Q-4,-10 -5,-22 Q-4,-38 0,-48 Z" fill="#ef4444" opacity="0.5" />

        {/* Face */}
        <ellipse cx="0" cy="-22" rx="14" ry="16" fill="#fce4c8" />

        {/* Pigtails flying */}
        <path d="M-14,-18 Q-24,-10 -28,0 Q-30,8 -26,12" fill="none" stroke="#8b5e3c" strokeWidth="5" strokeLinecap="round" />
        <path d="M14,-18 Q24,-10 28,0 Q30,8 26,12" fill="none" stroke="#8b5e3c" strokeWidth="5" strokeLinecap="round" />

        {/* Happy eyes — slightly closed from smiling */}
        <path d="M-9,-24 Q-5,-28 -1,-24" fill="none" stroke="#5c3317" strokeWidth="2" strokeLinecap="round" />
        <path d="M1,-24 Q5,-28 9,-24" fill="none" stroke="#5c3317" strokeWidth="2" strokeLinecap="round" />

        {/* Big happy smile */}
        <path d="M-7,-14 Q0,-8 7,-14" fill="#c47a5a" />
        <path d="M-5,-14 Q0,-10 5,-14" fill="white" opacity="0.8" />

        {/* Rosy cheeks */}
        <circle cx="-10" cy="-17" r="4" fill="#f0a0a0" opacity="0.5" />
        <circle cx="10" cy="-17" r="4" fill="#f0a0a0" opacity="0.5" />

        {/* Nose */}
        <ellipse cx="0" cy="-19" rx="2" ry="1.5" fill="#f0b8a0" />

        {/* Motion lines behind */}
        <path d="M45,10 L60,8" stroke="#8b5e3c" strokeWidth="1.5" opacity="0.3" strokeLinecap="round" />
        <path d="M42,20 L58,22" stroke="#8b5e3c" strokeWidth="1.5" opacity="0.3" strokeLinecap="round" />
        <path d="M44,30 L55,32" stroke="#8b5e3c" strokeWidth="1" opacity="0.2" strokeLinecap="round" />
      </g>

      {/* Robin on a branch */}
      <g transform="translate(580, 185)">
        <ellipse cx="0" cy="0" rx="9" ry="7" fill="#8b5e3c" />
        <circle cx="8" cy="-4" r="6" fill="#8b5e3c" />
        <ellipse cx="5" cy="2" rx="7" ry="5" fill="#dc2626" />
        <ellipse cx="11" cy="-4" rx="2.5" ry="1.2" fill="#ffd700" />
        <circle cx="10" cy="-5" r="1.5" fill="#333" />
        <circle cx="10.5" cy="-5.5" r="0.6" fill="white" />
        <path d="M-7,4 Q-12,2 -14,5" fill="none" stroke="#6b4830" strokeWidth="2" strokeLinecap="round" />
        <line x1="-2" y1="7" x2="-3" y2="12" stroke="#6b4830" strokeWidth="1.5" />
        <line x1="3" y1="7" x2="4" y2="12" stroke="#6b4830" strokeWidth="1.5" />
      </g>

      {/* Squirrel on tree */}
      <g transform="translate(70, 320)">
        <ellipse cx="0" cy="0" rx="8" ry="10" fill="#c07830" />
        <circle cx="4" cy="-12" r="7" fill="#c07830" />
        <ellipse cx="0" cy="-16" rx="3" ry="4" fill="#d09040" />
        <ellipse cx="8" cy="-16" rx="3" ry="4" fill="#d09040" />
        <circle cx="7" cy="-13" r="1.8" fill="#333" />
        <circle cx="7.5" cy="-13.5" r="0.7" fill="white" />
        <ellipse cx="1" cy="-13" rx="1.8" ry="1.5" fill="#333" />
        <path d="M-8,5 Q-15,0 -18,-10 Q-16,-18 -10,-15" fill="#c07830" stroke="#a06020" strokeWidth="1" />
        {/* Acorn in paws */}
        <ellipse cx="8" cy="-5" rx="3" ry="4" fill="#8b5e3c" />
        <ellipse cx="8" cy="-8" rx="3.5" ry="2" fill="#6b4830" />
      </g>

      {/* Rabbit in grass */}
      <g transform="translate(500, 455)">
        <ellipse cx="0" cy="5" rx="10" ry="8" fill="#d8c8b0" />
        <circle cx="5" cy="-5" r="7" fill="#d8c8b0" />
        <ellipse cx="2" cy="-18" rx="3" ry="8" fill="#d8c8b0" />
        <ellipse cx="8" cy="-16" rx="3" ry="7" fill="#d8c8b0" />
        <ellipse cx="2" cy="-17" rx="2" ry="5" fill="#ffb8c0" opacity="0.5" />
        <ellipse cx="8" cy="-15" rx="2" ry="4" fill="#ffb8c0" opacity="0.5" />
        <circle cx="8" cy="-6" r="2" fill="#333" />
        <circle cx="8.5" cy="-6.5" r="0.8" fill="white" />
        <ellipse cx="10" cy="-3" rx="1.5" ry="1" fill="#ffb8c0" />
        <ellipse cx="-8" cy="10" rx="5" ry="4" fill="#d8c8b0" />
        {/* Cute cotton tail */}
        <circle cx="-8" cy="10" r="4" fill="white" />
      </g>

      {/* Canopy overlay at top */}
      <path d="M0,0 L800,0 L800,80 Q600,120 400,90 Q200,60 0,100 Z" fill="#2a5a1a" opacity="0.5" />
      <path d="M0,0 L800,0 L800,50 Q650,80 500,60 Q300,40 100,70 Q50,75 0,65 Z" fill="#3a6a28" opacity="0.4" />

      {/* Fern fronds at bottom edges */}
      <g transform="translate(0, 520)" opacity="0.7">
        <path d="M0,80 Q20,40 10,20 Q5,10 0,0" fill="none" stroke="#3a7a28" strokeWidth="3" />
        {[10, 20, 30, 40, 50].map((y, i) => (
          <path key={i} d={`M${5 + i},${80 - y} Q${15 + i * 2},${70 - y} ${10 + i * 3},${65 - y}`} fill="none" stroke="#4a8a38" strokeWidth="2" />
        ))}
      </g>
      <g transform="translate(800, 510) scale(-1, 1)" opacity="0.7">
        <path d="M0,90 Q20,50 10,25 Q5,12 0,0" fill="none" stroke="#3a7a28" strokeWidth="3" />
        {[10, 20, 30, 40, 50].map((y, i) => (
          <path key={i} d={`M${5 + i},${90 - y} Q${15 + i * 2},${80 - y} ${10 + i * 3},${75 - y}`} fill="none" stroke="#4a8a38" strokeWidth="2" />
        ))}
      </g>
    </svg>
  );
}


/* ================================================================
   SCENE 4 — "She meets the silly wolf"
   Forest clearing, the wolf posing ridiculously, Red curious
   ================================================================ */
export function RidingScene4({ className = '' }) {
  return (
    <svg viewBox="0 0 800 600" className={`absolute inset-0 w-full h-full ${className}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="rs4Sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a8d8ea" />
          <stop offset="60%" stopColor="#88c4a8" />
          <stop offset="100%" stopColor="#5a8a48" />
        </linearGradient>
        <radialGradient id="rs4Light" cx="50%" cy="20%" r="50%">
          <stop offset="0%" stopColor="#ffe680" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#ffe680" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sky / canopy light */}
      <rect width="800" height="600" fill="url(#rs4Sky)" />
      <rect width="800" height="600" fill="url(#rs4Light)" />

      {/* Background forest */}
      {[80, 220, 400, 580, 720].map((x, i) => (
        <g key={`bt4${i}`} opacity="0.45">
          <rect x={x - 10} y={100 + i * 6} width="20" height={350 - i * 6} fill="#4a3520" />
          <ellipse cx={x} cy={100 + i * 6} rx={45 + i * 4} ry={65 + i * 4} fill="#3a6a2a" />
        </g>
      ))}

      {/* Clearing ground */}
      <ellipse cx="400" cy="460" rx="350" ry="100" fill="#5dba3b" />
      <ellipse cx="400" cy="470" rx="300" ry="80" fill="#4a9a38" />
      <path d="M0,450 Q200,420 400,430 Q600,440 800,425 L800,600 L0,600 Z" fill="#3a7a28" />

      {/* Dappled sunlight on clearing */}
      {[[300, 440], [450, 435], [500, 450], [350, 460], [250, 455]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="25" ry="10" fill="#ffe680" opacity="0.12" />
      ))}

      {/* Tree on left that wolf leans against */}
      <rect x="130" y="120" width="35" height="400" fill="#5c3d2e" />
      <rect x="137" y="120" width="10" height="400" fill="#6b4830" opacity="0.3" />
      <ellipse cx="148" cy="110" rx="70" ry="90" fill="#3a7a28" />
      <ellipse cx="130" cy="125" rx="50" ry="65" fill="#4a8a38" opacity="0.6" />
      <ellipse cx="165" cy="118" rx="45" ry="60" fill="#5a9a48" opacity="0.4" />

      {/* Foreground tree right */}
      <rect x="680" y="100" width="40" height="500" fill="#5c3d2e" />
      <ellipse cx="700" cy="90" rx="75" ry="95" fill="#3a7a28" />
      <ellipse cx="715" cy="105" rx="50" ry="65" fill="#4a8a38" opacity="0.6" />

      {/* Wildflowers in clearing */}
      {[[250, 480], [350, 490], [450, 485], [550, 488], [300, 500], [500, 495]].map(([x, y], i) => (
        <g key={`f4${i}`}>
          <line x1={x} y1={y} x2={x} y2={y + 12} stroke="#3a7a28" strokeWidth="1.5" />
          {[0, 72, 144, 216, 288].map((a, j) => (
            <ellipse
              key={j}
              cx={x + 5 * Math.cos((a * Math.PI) / 180)}
              cy={y + 5 * Math.sin((a * Math.PI) / 180)}
              rx="3" ry="1.5"
              fill={['#ffd700', 'white', '#ff85a2', '#a78bfa', '#ffd700', 'white'][i]}
              transform={`rotate(${a}, ${x + 5 * Math.cos((a * Math.PI) / 180)}, ${y + 5 * Math.sin((a * Math.PI) / 180)})`}
            />
          ))}
          <circle cx={x} cy={y} r="2.5" fill="#ffd700" />
        </g>
      ))}

      {/* THE WOLF — leaning against the tree, trying to look cool */}
      <g transform="translate(220, 310)">
        {/* Shadow */}
        <ellipse cx="10" cy="140" rx="40" ry="10" fill="#2a5a18" opacity="0.3" />

        {/* Tail — big and bushy, wagging */}
        <path d="M-20,80 Q-50,60 -60,40 Q-65,25 -55,20 Q-45,18 -40,30 Q-35,45 -20,65" fill="#6b7280" />
        <path d="M-55,22 Q-50,20 -45,25 Q-40,35 -35,40" fill="#9ca3af" opacity="0.5" />

        {/* Body — leaning back */}
        <ellipse cx="0" cy="80" rx="30" ry="40" fill="#6b7280" />
        <ellipse cx="-5" cy="75" rx="22" ry="30" fill="#9ca3af" opacity="0.3" />
        {/* Belly */}
        <ellipse cx="5" cy="90" rx="18" ry="25" fill="#d1d5db" opacity="0.5" />

        {/* Back legs */}
        <path d="M-15,110 L-20,135 L-12,138" fill="none" stroke="#6b7280" strokeWidth="10" strokeLinecap="round" />
        <ellipse cx="-14" cy="140" rx="8" ry="4" fill="#4b5563" />
        <path d="M15,110 L20,135 L12,138" fill="none" stroke="#6b7280" strokeWidth="10" strokeLinecap="round" />
        <ellipse cx="14" cy="140" rx="8" ry="4" fill="#4b5563" />

        {/* Front leg — leaning on tree casually */}
        <path d="M-15,55 Q-35,40 -40,30" fill="none" stroke="#6b7280" strokeWidth="9" strokeLinecap="round" />
        {/* Other front leg — at hip, trying to be cool */}
        <path d="M15,55 Q25,65 20,80" fill="none" stroke="#6b7280" strokeWidth="9" strokeLinecap="round" />

        {/* Head */}
        <g transform="translate(5, 20) rotate(-5)">
          {/* Snout */}
          <ellipse cx="0" cy="0" rx="25" ry="22" fill="#6b7280" />
          <ellipse cx="5" cy="5" rx="18" ry="15" fill="#9ca3af" opacity="0.4" />
          {/* Snout/muzzle */}
          <ellipse cx="15" cy="8" rx="15" ry="10" fill="#9ca3af" />
          <ellipse cx="18" cy="6" rx="8" ry="5" fill="#6b7280" />
          {/* Nose */}
          <ellipse cx="25" cy="5" rx="5" ry="4" fill="#333" />
          <ellipse cx="24" cy="3" rx="2" ry="1.5" fill="#666" opacity="0.5" />

          {/* GOOFY grin */}
          <path d="M10,14 Q18,22 28,14" fill="none" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" />
          <path d="M12,15 Q18,20 26,15" fill="#e57373" opacity="0.4" />
          {/* Tongue hanging out */}
          <path d="M20,16 Q22,28 18,32 Q14,30 16,20" fill="#f06292" />
          <path d="M18,20 Q20,26 17,29" fill="#e57373" opacity="0.5" />
          {/* Tooth poking out */}
          <path d="M14,14 L13,18 L16,15" fill="white" />

          {/* BIG goofy eyes */}
          <ellipse cx="-5" cy="-6" rx="8" ry="9" fill="white" />
          <ellipse cx="8" cy="-6" rx="7" ry="8" fill="white" />
          <ellipse cx="-3" cy="-5" rx="5" ry="6" fill="#5c3317" />
          <ellipse cx="10" cy="-5" rx="4.5" ry="5.5" fill="#5c3317" />
          <circle cx="-2" cy="-7" r="2.5" fill="white" />
          <circle cx="11" cy="-7" r="2" fill="white" />
          {/* Raised eyebrow — trying to be suave */}
          <path d="M-14,-12 Q-8,-18 0,-14" fill="none" stroke="#4b5563" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M4,-12 Q10,-16 16,-11" fill="none" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" />

          {/* Ears — one up, one flopped */}
          <path d="M-15,-15 Q-20,-35 -10,-38 Q-5,-35 -8,-18" fill="#6b7280" />
          <path d="M-13,-18 Q-17,-32 -10,-34 Q-7,-32 -9,-20" fill="#d1d5db" opacity="0.4" />
          {/* Floppy ear */}
          <path d="M10,-15 Q18,-30 25,-25 Q28,-18 22,-15" fill="#6b7280" />
          <path d="M12,-16 Q18,-26 22,-22 Q24,-18 20,-16" fill="#d1d5db" opacity="0.4" />
        </g>
      </g>

      {/* RED RIDING HOOD — looking curious */}
      <g transform="translate(520, 350)">
        {/* Shadow */}
        <ellipse cx="0" cy="85" rx="25" ry="7" fill="#2a5a18" opacity="0.3" />

        {/* Cape */}
        <path d="M-5,-32 Q-25,-22 -28,10 Q-30,40 -25,80 L25,80 Q30,40 28,10 Q25,-22 5,-32 Z" fill="#dc2626" />
        <path d="M-5,-32 Q-20,-20 -22,10 Q-24,38 -20,70 L-8,75 Q-12,38 -10,10 Q-8,-12 -5,-32 Z" fill="#ef4444" opacity="0.5" />

        {/* Dress */}
        <path d="M-12,50 L-16,78 L16,78 L12,50 Z" fill="#f8b4c8" />

        {/* Shoes */}
        <ellipse cx="-10" cy="82" rx="7" ry="3.5" fill="#4a3520" />
        <ellipse cx="10" cy="82" rx="7" ry="3.5" fill="#4a3520" />

        {/* Arm — finger to chin, curious pose */}
        <path d="M-18,20 Q-28,15 -25,5" fill="none" stroke="#fce4c8" strokeWidth="6" strokeLinecap="round" />
        <path d="M18,20 Q28,30 25,40" fill="none" stroke="#fce4c8" strokeWidth="6" strokeLinecap="round" />

        {/* Basket */}
        <g transform="translate(26, 38)">
          <path d="M-8,0 Q0,-10 8,0" fill="none" stroke="#8b5e3c" strokeWidth="2" />
          <rect x="-8" y="0" width="16" height="10" fill="#d4a030" rx="2" stroke="#8b5e3c" strokeWidth="1" />
        </g>

        {/* Hood */}
        <path d="M0,-50 Q-20,-48 -22,-34 Q-25,-20 -20,-10 Q-12,0 0,3 Q12,0 20,-10 Q25,-20 22,-34 Q20,-48 0,-50 Z" fill="#dc2626" />
        <path d="M0,-50 Q-16,-46 -18,-34 Q-20,-22 -16,-12 Q-8,-2 0,1 Q-4,-10 -6,-24 Q-4,-40 0,-50 Z" fill="#ef4444" opacity="0.5" />

        {/* Face */}
        <ellipse cx="0" cy="-22" rx="14" ry="16" fill="#fce4c8" />

        {/* Pigtails */}
        <path d="M-16,-18 Q-22,-14 -24,-6 Q-25,0 -22,5" fill="none" stroke="#8b5e3c" strokeWidth="5" strokeLinecap="round" />
        <path d="M16,-18 Q22,-14 24,-6 Q25,0 22,5" fill="none" stroke="#8b5e3c" strokeWidth="5" strokeLinecap="round" />

        {/* Curious big eyes — looking toward wolf */}
        <ellipse cx="-6" cy="-24" rx="5" ry="5.5" fill="white" />
        <ellipse cx="5" cy="-24" rx="5" ry="5.5" fill="white" />
        {/* Pupils looking left toward wolf */}
        <ellipse cx="-8" cy="-23" rx="3.5" ry="4" fill="#5c3317" />
        <ellipse cx="3" cy="-23" rx="3.5" ry="4" fill="#5c3317" />
        <circle cx="-7" cy="-24" r="1.5" fill="white" />
        <circle cx="4" cy="-24" r="1.5" fill="white" />

        {/* Curious little smile */}
        <path d="M-4,-12 Q0,-9 4,-12" fill="none" stroke="#c47a5a" strokeWidth="1.5" strokeLinecap="round" />

        {/* Rosy cheeks */}
        <circle cx="-10" cy="-17" r="4" fill="#f0a0a0" opacity="0.45" />
        <circle cx="10" cy="-17" r="4" fill="#f0a0a0" opacity="0.45" />

        {/* Nose */}
        <ellipse cx="0" cy="-19" rx="2" ry="1.5" fill="#f0b8a0" />

        {/* ? thought bubble */}
        <circle cx="20" cy="-55" r="2" fill="#6b7280" opacity="0.4" />
        <circle cx="25" cy="-63" r="3" fill="#6b7280" opacity="0.4" />
        <circle cx="30" cy="-74" r="12" fill="white" opacity="0.7" stroke="#6b7280" strokeWidth="1" />
        <text x="26" y="-69" fontSize="14" fill="#6b7280" fontWeight="bold">?</text>
      </g>

      {/* Butterfly */}
      <g>
        <path d="M400,380 Q393,372 396,365 Q399,360 400,368 Q401,360 404,365 Q407,372 400,380 Z" fill="#fbbf24" opacity="0.8" />
        <animateTransform attributeName="transform" type="translate" values="0,0;10,-15;-5,-10;0,0" dur="5s" repeatCount="indefinite" />
      </g>

      {/* Canopy overlay */}
      <path d="M0,0 L800,0 L800,70 Q600,110 400,80 Q200,50 0,90 Z" fill="#2a5a1a" opacity="0.45" />
    </svg>
  );
}


/* ================================================================
   SCENE 5 — "The wolf runs ahead"
   Wolf running comically through forest, speed lines, dust
   ================================================================ */
export function RidingScene5({ className = '' }) {
  return (
    <svg viewBox="0 0 800 600" className={`absolute inset-0 w-full h-full ${className}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="rs5Sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a8d8ea" />
          <stop offset="50%" stopColor="#7ab898" />
          <stop offset="100%" stopColor="#4a7c59" />
        </linearGradient>
        <linearGradient id="rs5Blur" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5c3d2e" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#5c3d2e" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="800" height="600" fill="url(#rs5Sky)" />

      {/* Blurred trees — showing speed! */}
      {[50, 150, 280, 420, 560, 680, 780].map((x, i) => (
        <g key={`blur${i}`} opacity={0.3 + (i % 3) * 0.1}>
          {/* Blurred trunk - horizontal streak to show speed */}
          <rect x={x - 15} y={130 + i * 8} width="30" height={320 - i * 8} fill="#5c3d2e" opacity="0.5" />
          {/* Speed-blurred canopy */}
          <ellipse cx={x} cy={130 + i * 8} rx={40 + i * 5} ry={55 + i * 5} fill="#3a6a2a" opacity="0.6" />
        </g>
      ))}

      {/* Ground — with motion streaks */}
      <path d="M0,430 Q200,415 400,425 Q600,435 800,420 L800,600 L0,600 Z" fill="#3a7a28" />
      <path d="M0,450 Q200,440 400,448 Q600,455 800,445 L800,600 L0,600 Z" fill="#2e5a20" />

      {/* Speed lines on ground */}
      {[440, 455, 465, 478, 490, 505, 520].map((y, i) => (
        <line
          key={i}
          x1={450 + i * 20}
          y1={y}
          x2={700 + i * 15}
          y2={y + 2}
          stroke="#5dba3b"
          strokeWidth={1.5 - i * 0.1}
          opacity={0.4 - i * 0.04}
          strokeDasharray="15,10"
        />
      ))}

      {/* Dust cloud behind wolf */}
      <g opacity="0.4">
        <circle cx="520" cy="440" r="25" fill="#d4c4a0">
          <animate attributeName="r" values="25;35;25" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0.15;0.4" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="560" cy="430" r="20" fill="#d4c4a0">
          <animate attributeName="r" values="20;30;20" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="590" cy="445" r="18" fill="#d4c4a0">
          <animate attributeName="r" values="18;28;18" dur="1.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="620" cy="435" r="15" fill="#d4c4a0" opacity="0.3" />
        <circle cx="650" cy="442" r="12" fill="#d4c4a0" opacity="0.2" />
      </g>

      {/* Paw prints behind wolf */}
      {[[580, 460], [620, 455], [660, 462], [700, 458], [740, 465]].map(([x, y], i) => (
        <g key={`paw${i}`} opacity={0.4 - i * 0.06}>
          {/* Main pad */}
          <ellipse cx={x} cy={y} rx="5" ry="4" fill="#4b5563" />
          {/* Toes */}
          <circle cx={x - 4} cy={y - 4} r="2" fill="#4b5563" />
          <circle cx={x} cy={y - 5} r="2" fill="#4b5563" />
          <circle cx={x + 4} cy={y - 4} r="2" fill="#4b5563" />
        </g>
      ))}

      {/* Scattered leaves behind wolf */}
      {[[530, 410], [560, 395], [590, 415], [510, 425], [545, 400]].map(([x, y], i) => (
        <g key={`leaf${i}`}>
          <ellipse cx={x} cy={y} rx="6" ry="3" fill={['#4a8a38', '#d4a030', '#c07830', '#5a9a48', '#e8c060'][i]} transform={`rotate(${i * 40 + 20}, ${x}, ${y})`}>
            <animateTransform attributeName="transform" type="rotate" values={`${i * 40},${x},${y};${i * 40 + 360},${x},${y}`} dur={`${3 + i}s`} repeatCount="indefinite" />
          </ellipse>
        </g>
      ))}

      {/* THE WOLF — running comically */}
      <g transform="translate(350, 340)">
        {/* Shadow */}
        <ellipse cx="0" cy="100" rx="50" ry="10" fill="#2a5a18" opacity="0.25" />

        {/* Tail — streaming behind */}
        <path d="M40,30 Q70,15 85,0 Q95,-15 90,-20 Q80,-18 75,-5 Q65,10 45,25" fill="#6b7280" />
        <path d="M85,-5 Q90,-15 88,-20 Q82,-16 78,-5" fill="#9ca3af" opacity="0.5" />

        {/* Body — stretched out running */}
        <ellipse cx="0" cy="40" rx="45" ry="25" fill="#6b7280" transform="rotate(-10, 0, 40)" />
        <ellipse cx="-5" cy="38" rx="35" ry="18" fill="#9ca3af" opacity="0.25" />
        {/* Belly */}
        <ellipse cx="0" cy="50" rx="25" ry="15" fill="#d1d5db" opacity="0.4" />

        {/* BACK LEGS — blur of running */}
        <path d="M25,55 Q40,70 50,85 Q55,95 45,100" fill="none" stroke="#6b7280" strokeWidth="10" strokeLinecap="round" />
        <path d="M30,50 Q50,55 60,70 Q65,80 58,88" fill="none" stroke="#6b7280" strokeWidth="9" strokeLinecap="round" />
        {/* Paws */}
        <ellipse cx="45" cy="100" rx="7" ry="4" fill="#4b5563" />
        <ellipse cx="58" cy="88" rx="7" ry="4" fill="#4b5563" />

        {/* FRONT LEGS — stretched forward */}
        <path d="M-25,35 Q-50,20 -60,30 Q-65,40 -55,45" fill="none" stroke="#6b7280" strokeWidth="10" strokeLinecap="round" />
        <path d="M-20,40 Q-40,35 -55,50 Q-60,60 -50,62" fill="none" stroke="#6b7280" strokeWidth="9" strokeLinecap="round" />
        <ellipse cx="-55" cy="45" rx="7" ry="4" fill="#4b5563" />
        <ellipse cx="-50" cy="62" rx="7" ry="4" fill="#4b5563" />

        {/* Motion blur on legs */}
        <path d="M50,85 Q60,80 70,85" stroke="#6b7280" strokeWidth="3" opacity="0.3" fill="none" />
        <path d="M55,75 Q65,70 75,75" stroke="#6b7280" strokeWidth="2" opacity="0.2" fill="none" />

        {/* Head — determined but silly */}
        <g transform="translate(-35, 10) rotate(-15)">
          <ellipse cx="0" cy="0" rx="22" ry="20" fill="#6b7280" />
          <ellipse cx="3" cy="3" rx="16" ry="13" fill="#9ca3af" opacity="0.3" />

          {/* Snout - pointed forward */}
          <ellipse cx="-18" cy="5" rx="14" ry="9" fill="#9ca3af" />
          <ellipse cx="-22" cy="3" rx="6" ry="4" fill="#6b7280" />
          {/* Nose */}
          <ellipse cx="-28" cy="3" rx="5" ry="4" fill="#333" />

          {/* Tongue flapping out */}
          <path d="M-20,12 Q-28,20 -32,28 Q-36,32 -30,30 Q-25,25 -18,16" fill="#f06292" />
          <path d="M-22,15 Q-28,22 -30,27" fill="#e57373" opacity="0.5" />

          {/* Wild eyes — determined */}
          <ellipse cx="-5" cy="-6" rx="7" ry="8" fill="white" />
          <ellipse cx="8" cy="-5" rx="6" ry="7" fill="white" />
          <ellipse cx="-7" cy="-5" rx="4.5" ry="5.5" fill="#5c3317" />
          <ellipse cx="6" cy="-4" rx="4" ry="5" fill="#5c3317" />
          <circle cx="-6" cy="-7" r="2" fill="white" />
          <circle cx="7" cy="-6" r="1.8" fill="white" />

          {/* Ears — one up, one blown back */}
          <path d="M-5,-18 Q-10,-35 -2,-38 Q3,-35 0,-20" fill="#6b7280" />
          <path d="M-3,-20 Q-7,-32 -2,-34 Q1,-32 0,-22" fill="#d1d5db" opacity="0.4" />
          {/* Ear blown backward */}
          <path d="M10,-14 Q25,-25 30,-18 Q28,-12 18,-12" fill="#6b7280" />
          <path d="M12,-14 Q22,-22 26,-17 Q24,-13 18,-13" fill="#d1d5db" opacity="0.4" />
        </g>
      </g>

      {/* Speed lines behind wolf */}
      {[[-10, 320], [0, 345], [-5, 370], [5, 395], [-8, 355]].map(([xOff, y], i) => (
        <line
          key={`speed${i}`}
          x1={420 + xOff}
          y1={y}
          x2={500 + i * 20}
          y2={y + 2}
          stroke="#4b5563"
          strokeWidth={2.5 - i * 0.3}
          opacity={0.4 - i * 0.06}
          strokeLinecap="round"
        />
      ))}

      {/* Big motion lines across scene */}
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={`bigspeed${i}`}
          x1={500 + i * 30}
          y1={350 + i * 25}
          x2={750 + i * 20}
          y2={348 + i * 25}
          stroke="#3a7a28"
          strokeWidth={3 - i * 0.4}
          opacity={0.2 - i * 0.03}
          strokeLinecap="round"
          strokeDasharray="20,15"
        />
      ))}

      {/* Canopy top */}
      <path d="M0,0 L800,0 L800,80 Q600,120 400,80 Q200,50 0,100 Z" fill="#2a5a1a" opacity="0.5" />
      <path d="M0,0 L800,0 L800,50 Q600,75 400,55 Q200,35 0,65 Z" fill="#3a6a28" opacity="0.3" />
    </svg>
  );
}


/* ================================================================
   SCENE 6 — "Knock knock at Grandma's door"
   Grandma's cozy cottage, wolf at door trying to look innocent
   ================================================================ */
export function RidingScene6({ className = '' }) {
  return (
    <svg viewBox="0 0 800 600" className={`absolute inset-0 w-full h-full ${className}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="rs6Sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#87CEEB" />
          <stop offset="80%" stopColor="#b6e3f4" />
          <stop offset="100%" stopColor="#d4f0fc" />
        </linearGradient>
        <linearGradient id="rs6Stone" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#b0a090" />
          <stop offset="100%" stopColor="#968878" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="800" height="600" fill="url(#rs6Sky)" />

      {/* Distant trees */}
      {[50, 150, 650, 750].map((x, i) => (
        <g key={`dt6${i}`} opacity="0.5">
          <rect x={x - 8} y={180} width="16" height={250} fill="#5c3d2e" />
          <ellipse cx={x} cy={180} rx={35} ry={55} fill="#3a7a28" />
        </g>
      ))}

      {/* Ground */}
      <rect x="0" y="420" width="800" height="180" fill="#5dba3b" />
      <ellipse cx="400" cy="420" rx="450" ry="30" fill="#6ab648" />

      {/* Garden path to door */}
      <path d="M400,600 L380,480 L420,480 L400,600 Z" fill="#c4a265" />
      <path d="M390,600 L385,490 L415,490 L410,600 Z" fill="#d4b275" />

      {/* GRANDMA'S COTTAGE */}
      <g transform="translate(200, 150)">
        {/* Stone walls */}
        <rect x="0" y="80" width="400" height="200" fill="url(#rs6Stone)" rx="4" />
        {/* Stone texture */}
        {[[10, 90, 45, 25], [60, 120, 40, 22], [110, 155, 50, 20], [170, 95, 42, 24], [230, 130, 48, 22], [290, 95, 40, 20], [340, 150, 45, 22], [20, 200, 50, 24], [180, 180, 42, 20], [300, 200, 48, 22], [100, 240, 40, 20], [250, 240, 45, 22]].map(([x, y, w, h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} rx="4" fill="#a09080" opacity="0.3" stroke="#908070" strokeWidth="0.5" />
        ))}

        {/* Thatched roof */}
        <polygon points="-30,82 200,0 430,82" fill="#b8860b" />
        <polygon points="-20,82 200,10 420,82" fill="#d4a030" />
        {/* Thatch texture */}
        {[[-10, 78, 80, 40], [100, 78, 160, 30], [220, 78, 300, 30], [330, 78, 400, 40]].map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#c4942a" strokeWidth="2" opacity="0.5" />
        ))}
        {/* Thatch edge detail */}
        <path d="M-30,82 Q-20,88 -10,82 Q0,88 10,82 Q20,88 30,82 Q40,88 50,82 Q60,88 70,82 Q80,88 90,82 Q100,88 110,82 Q120,88 130,82 Q140,88 150,82 Q160,88 170,82 Q180,88 190,82 Q200,88 210,82 Q220,88 230,82 Q240,88 250,82 Q260,88 270,82 Q280,88 290,82 Q300,88 310,82 Q320,88 330,82 Q340,88 350,82 Q360,88 370,82 Q380,88 390,82 Q400,88 410,82 Q420,88 430,82" fill="none" stroke="#b8860b" strokeWidth="3" />

        {/* Chimney */}
        <rect x="300" y="10" width="35" height="55" fill="#8b6050" rx="2" />
        <rect x="296" y="6" width="43" height="8" fill="#7a5040" rx="2" />
        {/* Smoke */}
        <g opacity="0.25">
          <circle cx="318" cy="-5" r="7" fill="#ccc">
            <animate attributeName="cy" values="-5;-35" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="322" cy="-15" r="9" fill="#ccc">
            <animate attributeName="cy" values="-15;-50" dur="5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.25;0" dur="5s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* DOOR — centre */}
        <rect x="165" y="155" width="70" height="125" fill="#8b4513" rx="35 35 0 0" />
        <rect x="170" y="160" width="60" height="120" fill="#a0622d" rx="30 30 0 0" />
        {/* Door panels */}
        <rect x="178" y="175" width="44" height="35" rx="5" fill="#8b4513" opacity="0.3" />
        <rect x="178" y="220" width="44" height="35" rx="5" fill="#8b4513" opacity="0.3" />
        {/* Door knocker */}
        <circle cx="218" cy="215" r="5" fill="#d4a030" stroke="#b8860b" strokeWidth="1.5" />
        <circle cx="218" cy="215" r="2" fill="#b8860b" />

        {/* Windows */}
        {/* Left window */}
        <g>
          <rect x="40" y="120" width="60" height="50" fill="#ffeeaa" rx="3" stroke="#8b4513" strokeWidth="3" />
          <line x1="70" y1="120" x2="70" y2="170" stroke="#8b4513" strokeWidth="2" />
          <line x1="40" y1="145" x2="100" y2="145" stroke="#8b4513" strokeWidth="2" />
          {/* Curtains */}
          <path d="M43,122 Q52,135 43,148" fill="#ff85a2" opacity="0.4" />
          <path d="M97,122 Q88,135 97,148" fill="#ff85a2" opacity="0.4" />

          {/* GRANDMA visible through window! */}
          <g transform="translate(70, 140)">
            <circle cx="0" cy="0" r="8" fill="#fce4c8" />
            {/* Glasses */}
            <circle cx="-3" cy="-1" r="3" fill="none" stroke="#8b5e3c" strokeWidth="0.8" />
            <circle cx="3" cy="-1" r="3" fill="none" stroke="#8b5e3c" strokeWidth="0.8" />
            <line x1="0" y1="-1" x2="0" y2="-1" stroke="#8b5e3c" strokeWidth="0.5" />
            {/* White hair */}
            <path d="M-8,-2 Q-8,-8 -3,-9 Q3,-10 8,-6 Q9,-2 8,0" fill="#e0d8d0" />
            {/* Surprised expression */}
            <ellipse cx="0" cy="3" rx="2.5" ry="2" fill="#c47a5a" />
          </g>
        </g>

        {/* Right window */}
        <rect x="300" y="120" width="60" height="50" fill="#ffeeaa" rx="3" stroke="#8b4513" strokeWidth="3" />
        <line x1="330" y1="120" x2="330" y2="170" stroke="#8b4513" strokeWidth="2" />
        <line x1="300" y1="145" x2="360" y2="145" stroke="#8b4513" strokeWidth="2" />
        <path d="M303,122 Q312,135 303,148" fill="#ff85a2" opacity="0.4" />
        <path d="M357,122 Q348,135 357,148" fill="#ff85a2" opacity="0.4" />

        {/* Roses around door */}
        {[[140, 165], [145, 200], [148, 235], [252, 165], [248, 200], [245, 235]].map(([x, y], i) => (
          <g key={`rose${i}`}>
            <line x1={x} y1={y} x2={x + (i < 3 ? -15 : 15)} y2={y - 5} stroke="#3a7a28" strokeWidth="1.5" />
            <circle cx={x} cy={y} r="5" fill="#dc2626" />
            <circle cx={x} cy={y} r="3" fill="#ef4444" opacity="0.6" />
            <circle cx={x - 1} cy={y - 1} r="1" fill="#ff85a2" opacity="0.5" />
          </g>
        ))}
        {/* Rose vines */}
        <path d="M148,155 Q140,160 145,170 Q150,180 148,190 Q142,200 145,210 Q150,220 148,230 Q142,240 145,260" fill="none" stroke="#3a7a28" strokeWidth="2" />
        <path d="M252,155 Q260,160 255,170 Q250,180 252,190 Q258,200 255,210 Q250,220 252,230 Q258,240 255,260" fill="none" stroke="#3a7a28" strokeWidth="2" />

        {/* Welcome doormat */}
        <rect x="172" y="275" width="56" height="18" fill="#c07830" rx="2" />
        <rect x="174" y="277" width="52" height="14" fill="#a06820" rx="1" />
        <text x="200" y="289" fontSize="8" fill="#d4a030" textAnchor="middle" fontFamily="serif">WELCOME</text>
      </g>

      {/* THE WOLF at the door — standing upright, trying to look innocent */}
      <g transform="translate(430, 280)">
        {/* Shadow */}
        <ellipse cx="0" cy="140" rx="30" ry="8" fill="#4a8a38" opacity="0.3" />

        {/* Tail behind — trying to hide it */}
        <path d="M15,80 Q35,65 40,50 Q42,38 35,35 Q28,38 30,50 Q25,65 15,75" fill="#6b7280" />

        {/* Body — standing up awkwardly */}
        <ellipse cx="0" cy="70" rx="28" ry="45" fill="#6b7280" />
        <ellipse cx="-3" cy="65" rx="20" ry="35" fill="#9ca3af" opacity="0.25" />
        {/* Belly */}
        <ellipse cx="0" cy="80" rx="18" ry="28" fill="#d1d5db" opacity="0.4" />

        {/* Back legs */}
        <path d="M-12,110 L-15,132 L-8,138" fill="none" stroke="#6b7280" strokeWidth="10" strokeLinecap="round" />
        <ellipse cx="-8" cy="138" rx="8" ry="4" fill="#4b5563" />
        <path d="M12,110 L15,132 L8,138" fill="none" stroke="#6b7280" strokeWidth="10" strokeLinecap="round" />
        <ellipse cx="8" cy="138" rx="8" ry="4" fill="#4b5563" />

        {/* Front paw — raised to knock */}
        <path d="M-15,45 Q-30,30 -35,15 Q-36,8 -28,12" fill="none" stroke="#6b7280" strokeWidth="9" strokeLinecap="round" />
        <ellipse cx="-30" cy="10" rx="6" ry="5" fill="#4b5563" />
        {/* Other paw behind back */}
        <path d="M15,50 Q25,55 20,70" fill="none" stroke="#6b7280" strokeWidth="9" strokeLinecap="round" />

        {/* Head */}
        <g transform="translate(-5, 10)">
          <ellipse cx="0" cy="0" rx="22" ry="20" fill="#6b7280" />
          <ellipse cx="3" cy="3" rx="16" ry="13" fill="#9ca3af" opacity="0.3" />

          {/* Snout */}
          <ellipse cx="-15" cy="5" rx="13" ry="9" fill="#9ca3af" />
          {/* Nose */}
          <ellipse cx="-24" cy="3" rx="4.5" ry="3.5" fill="#333" />
          <ellipse cx="-23" cy="2" rx="1.5" ry="1" fill="#666" opacity="0.5" />

          {/* Innocent smile — forced */}
          <path d="M-10,12 Q-16,18 -24,12" fill="none" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" />
          {/* Showing teeth — trying not to */}
          <path d="M-14,13 L-13,16 L-16,14" fill="white" opacity="0.6" />
          <path d="M-20,13 L-19,16 L-22,14" fill="white" opacity="0.6" />

          {/* Shifty innocent eyes */}
          <ellipse cx="-4" cy="-6" rx="7" ry="8" fill="white" />
          <ellipse cx="8" cy="-5" rx="6" ry="7" fill="white" />
          {/* Pupils looking to the side — shifty */}
          <ellipse cx="-7" cy="-5" rx="4" ry="5" fill="#5c3317" />
          <ellipse cx="5" cy="-4" rx="3.5" ry="4.5" fill="#5c3317" />
          <circle cx="-6" cy="-7" r="2" fill="white" />
          <circle cx="6" cy="-6" r="1.5" fill="white" />

          {/* "Innocent" eyebrows raised */}
          <path d="M-12,-12 Q-6,-18 2,-13" fill="none" stroke="#4b5563" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M4,-11 Q10,-15 14,-10" fill="none" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" />

          {/* Ears */}
          <path d="M-8,-18 Q-12,-35 -4,-38 Q0,-35 -2,-20" fill="#6b7280" />
          <path d="M-6,-20 Q-10,-32 -4,-34 Q-1,-32 -3,-22" fill="#d1d5db" opacity="0.4" />
          <path d="M10,-15 Q16,-30 22,-26 Q24,-20 18,-16" fill="#6b7280" />
          <path d="M12,-16 Q16,-26 20,-24 Q22,-20 18,-17" fill="#d1d5db" opacity="0.4" />

          {/* Sweat drop — nervous */}
          <path d="M15,-8 Q17,-14 19,-8 Q17,-6 15,-8 Z" fill="#87CEEB" opacity="0.6" />
        </g>
      </g>

      {/* Garden flowers */}
      {[[100, 460], [150, 470], [650, 455], [700, 465], [300, 475], [550, 470]].map(([x, y], i) => (
        <g key={`gf6${i}`}>
          <line x1={x} y1={y} x2={x} y2={y + 15} stroke="#3a7a28" strokeWidth="1.5" />
          <circle cx={x} cy={y} r="4" fill={['#ffd700', '#ff85a2', '#a78bfa', '#ffd700', '#ff6b8a', '#ff85a2'][i]} />
          <circle cx={x} cy={y} r="2" fill="#ffd700" />
        </g>
      ))}

      {/* Spider on web near roof */}
      <g transform="translate(160, 280)" opacity="0.5">
        <line x1="0" y1="-30" x2="0" y2="0" stroke="#999" strokeWidth="0.5" />
        <ellipse cx="0" cy="2" rx="3" ry="4" fill="#333" />
        <circle cx="0" cy="-1" r="2.5" fill="#333" />
        {/* Legs */}
        {[-1, 1].map((side) => (
          [0, 3, 6].map((dy, j) => (
            <path key={`${side}${j}`} d={`M${side * 2},${dy} Q${side * 8},${dy - 2} ${side * 10},${dy + 2}`} fill="none" stroke="#333" strokeWidth="0.5" />
          ))
        ))}
      </g>
    </svg>
  );
}


/* ================================================================
   SCENE 7 — "The wolf in Grandma's clothes"
   Wolf in bed wearing grandma's nightcap, glasses, nightgown
   ================================================================ */
export function RidingScene7({ className = '' }) {
  return (
    <svg viewBox="0 0 800 600" className={`absolute inset-0 w-full h-full ${className}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="rs7Wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5e6c8" />
          <stop offset="100%" stopColor="#edd9b5" />
        </linearGradient>
        <linearGradient id="rs7Quilt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff85a2" />
          <stop offset="100%" stopColor="#e05577" />
        </linearGradient>
      </defs>

      {/* Bedroom wall */}
      <rect width="800" height="600" fill="url(#rs7Wall)" />

      {/* Wallpaper pattern — subtle flowers */}
      {Array.from({ length: 8 }, (_, row) =>
        Array.from({ length: 10 }, (_, col) => (
          <g key={`wp${row}${col}`} opacity="0.1">
            <circle cx={40 + col * 80} cy={40 + row * 75} r="3" fill="#c07830" />
            <circle cx={40 + col * 80 - 5} cy={40 + row * 75 + 3} r="2" fill="#3a7a28" />
            <circle cx={40 + col * 80 + 5} cy={40 + row * 75 + 3} r="2" fill="#3a7a28" />
          </g>
        ))
      )}

      {/* Floor */}
      <rect x="0" y="460" width="800" height="140" fill="#a0825a" />
      {/* Floorboard lines */}
      {[475, 490, 510, 530, 550, 570].map((y, i) => (
        <line key={i} x1="0" y1={y} x2="800" y2={y} stroke="#8b7040" strokeWidth="1" opacity="0.3" />
      ))}

      {/* Skirting board */}
      <rect x="0" y="455" width="800" height="10" fill="#8b5e3c" />

      {/* Picture on wall — landscape */}
      <rect x="100" y="80" width="80" height="60" fill="#87CEEB" stroke="#8b5e3c" strokeWidth="4" rx="2" />
      <ellipse cx="140" cy="120" rx="30" ry="10" fill="#5dba3b" />
      <circle cx="155" cy="95" r="8" fill="#ffd700" />

      {/* Picture on wall — cat portrait */}
      <rect x="600" y="70" width="65" height="75" fill="#f5e6c8" stroke="#8b5e3c" strokeWidth="4" rx="2" />
      <ellipse cx="632" cy="100" rx="15" ry="18" fill="#c07830" />
      <path d="M620,85 L617,72 L625,82" fill="#c07830" />
      <path d="M644,85 L647,72 L639,82" fill="#c07830" />
      <circle cx="627" cy="96" r="2" fill="#333" />
      <circle cx="637" cy="96" r="2" fill="#333" />

      {/* Bedside table — left */}
      <rect x="40" y="330" width="80" height="130" fill="#8b5e3c" rx="3" />
      <rect x="38" y="325" width="84" height="8" fill="#7a4e32" rx="2" />
      {/* Drawer */}
      <rect x="50" y="370" width="60" height="30" fill="#7a4e32" rx="2" />
      <circle cx="80" cy="385" r="3" fill="#d4a030" />
      {/* Lamp */}
      <rect x="70" y="280" width="8" height="45" fill="#d4a030" />
      <path d="M50,280 Q74,255 98,280 Z" fill="#fff3b0" />
      <ellipse cx="74" cy="282" rx="26" ry="5" fill="#e8d490" />
      {/* Lamp glow */}
      <ellipse cx="74" cy="280" rx="40" ry="30" fill="#ffe680" opacity="0.15" />

      {/* THE BED */}
      {/* Headboard */}
      <rect x="160" y="200" width="420" height="25" fill="#8b5e3c" rx="5" />
      <rect x="170" y="170" width="400" height="40" fill="#a06a3a" rx="8" />
      <rect x="180" y="175" width="380" height="30" fill="#8b5e3c" rx="5" />

      {/* Mattress/bed body */}
      <rect x="155" y="225" width="430" height="180" fill="white" rx="5" />
      <rect x="155" y="225" width="430" height="180" fill="#fff5ee" rx="5" />

      {/* Pillow */}
      <ellipse cx="280" cy="260" rx="80" ry="25" fill="white" />
      <ellipse cx="280" cy="258" rx="75" ry="22" fill="#fff8f0" />

      {/* Quilt / blanket */}
      <path d="M155,310 L585,310 L585,405 Q370,420 155,405 Z" fill="url(#rs7Quilt)" />
      {/* Quilt pattern — patchwork squares */}
      {Array.from({ length: 3 }, (_, row) =>
        Array.from({ length: 6 }, (_, col) => (
          <rect
            key={`q${row}${col}`}
            x={160 + col * 70}
            y={312 + row * 30}
            width="68"
            height="28"
            fill={(row + col) % 2 === 0 ? '#ff6b8a' : '#ff85a2'}
            opacity="0.3"
            stroke="#e05577"
            strokeWidth="0.5"
            rx="2"
          />
        ))
      )}
      {/* Quilt edge with frills */}
      <path d="M155,405 Q175,415 195,405 Q215,415 235,405 Q255,415 275,405 Q295,415 315,405 Q335,415 355,405 Q375,415 395,405 Q415,415 435,405 Q455,415 475,405 Q495,415 515,405 Q535,415 555,405 Q575,415 585,408" fill="none" stroke="#e05577" strokeWidth="2" />

      {/* THE WOLF IN BED — wearing Grandma's clothes */}
      <g transform="translate(350, 230)">
        {/* Body under quilt — just head and shoulders visible */}

        {/* Nightgown visible at shoulders */}
        <path d="M-45,30 Q-50,45 -45,60 L45,60 Q50,45 45,30 Z" fill="#ffb8c0" />
        {/* Floral pattern on nightgown */}
        <circle cx="-30" cy="45" r="3" fill="#ff6b8a" opacity="0.4" />
        <circle cx="-10" cy="42" r="2" fill="#ff6b8a" opacity="0.4" />
        <circle cx="15" cy="48" r="3" fill="#ff6b8a" opacity="0.4" />
        <circle cx="35" cy="43" r="2" fill="#ff6b8a" opacity="0.4" />
        {/* Lace collar */}
        <path d="M-35,30 Q-25,38 -15,30 Q-5,38 5,30 Q15,38 25,30 Q35,38 45,30" fill="none" stroke="white" strokeWidth="2" opacity="0.7" />

        {/* Wolf head — RIDICULOUS in grandma disguise */}
        <g transform="translate(0, -10)">
          {/* Head */}
          <ellipse cx="0" cy="0" rx="30" ry="28" fill="#6b7280" />
          <ellipse cx="3" cy="3" rx="22" ry="20" fill="#9ca3af" opacity="0.25" />

          {/* Muzzle — long wolf snout */}
          <ellipse cx="25" cy="8" rx="20" ry="14" fill="#9ca3af" />
          <ellipse cx="30" cy="5" rx="12" ry="8" fill="#6b7280" opacity="0.3" />
          {/* Nose */}
          <ellipse cx="40" cy="5" rx="5" ry="4" fill="#333" />
          <ellipse cx="39" cy="4" rx="2" ry="1.5" fill="#666" opacity="0.5" />

          {/* Grandma's GLASSES — way too small, perched on snout */}
          <circle cx="18" cy="0" rx="10" ry="9" fill="none" stroke="#8b5e3c" strokeWidth="2" />
          <circle cx="35" cy="2" rx="8" ry="7" fill="none" stroke="#8b5e3c" strokeWidth="2" />
          <line x1="28" y1="1" x2="27" y2="1" stroke="#8b5e3c" strokeWidth="2" />
          {/* Arms of glasses */}
          <path d="M8,0 Q-5,-5 -15,-2" fill="none" stroke="#8b5e3c" strokeWidth="1.5" />
          <path d="M43,2 Q50,0 55,3" fill="none" stroke="#8b5e3c" strokeWidth="1.5" />
          {/* Glasses glint */}
          <ellipse cx="14" cy="-3" rx="3" ry="2" fill="white" opacity="0.3" transform="rotate(-20, 14, -3)" />

          {/* Big eyes behind glasses */}
          <ellipse cx="18" cy="-2" rx="6" ry="7" fill="white" />
          <ellipse cx="35" cy="0" rx="5" ry="6" fill="white" />
          <ellipse cx="19" cy="-1" rx="4" ry="5" fill="#5c3317" />
          <ellipse cx="36" cy="1" rx="3.5" ry="4.5" fill="#5c3317" />
          <circle cx="20" cy="-3" r="2" fill="white" />
          <circle cx="37" cy="-1" r="1.5" fill="white" />

          {/* Goofy grin */}
          <path d="M20,16 Q30,24 42,16" fill="none" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" />
          {/* Teeth poking */}
          <path d="M25,16 L24,20 L28,17" fill="white" />
          <path d="M35,16 L34,20 L38,17" fill="white" />

          {/* NIGHTCAP — frilly, way too small */}
          <path d="M-20,-15 Q-25,-30 -10,-35 Q5,-38 20,-32 Q30,-25 25,-15" fill="white" />
          <path d="M-20,-15 Q-25,-30 -10,-35 Q5,-38 20,-32 Q30,-25 25,-15" fill="#ffb8c0" opacity="0.4" />
          {/* Cap frill */}
          <path d="M-22,-14 Q-18,-18 -14,-14 Q-10,-18 -6,-14 Q-2,-18 2,-14 Q6,-18 10,-14 Q14,-18 18,-14 Q22,-18 26,-14" fill="none" stroke="#ff85a2" strokeWidth="2" />
          {/* Cap ribbon/bow */}
          <path d="M-12,-15 Q-18,-20 -15,-25 Q-12,-22 -12,-15 Z" fill="#ff6b8a" />
          <path d="M-12,-15 Q-6,-20 -9,-25 Q-12,-22 -12,-15 Z" fill="#ff6b8a" />
          {/* Pom pom on top */}
          <circle cx="5" cy="-36" r="5" fill="white" />

          {/* EARS poking through the cap!!! */}
          <path d="M-15,-25 Q-22,-45 -12,-48 Q-8,-45 -10,-30" fill="#6b7280" />
          <path d="M-13,-30 Q-18,-42 -12,-44 Q-9,-42 -11,-32" fill="#d1d5db" opacity="0.4" />
          <path d="M18,-22 Q28,-40 32,-35 Q34,-28 24,-22" fill="#6b7280" />
          <path d="M20,-23 Q26,-36 30,-32 Q31,-28 24,-23" fill="#d1d5db" opacity="0.4" />
        </g>

        {/* Paws visible on quilt — furry grey, NOT grandma hands */}
        <path d="M-35,60 Q-42,70 -40,80" fill="none" stroke="#6b7280" strokeWidth="8" strokeLinecap="round" />
        <ellipse cx="-40" cy="82" rx="7" ry="5" fill="#4b5563" />
        <path d="M35,60 Q42,70 40,80" fill="none" stroke="#6b7280" strokeWidth="8" strokeLinecap="round" />
        <ellipse cx="40" cy="82" rx="7" ry="5" fill="#4b5563" />
      </g>

      {/* Bedside table right */}
      <rect x="620" y="330" width="80" height="130" fill="#8b5e3c" rx="3" />
      <rect x="618" y="325" width="84" height="8" fill="#7a4e32" rx="2" />
      {/* Glass of water */}
      <path d="M645,295 L642,322 L658,322 L655,295 Z" fill="#87CEEB" opacity="0.5" stroke="#5ba0c8" strokeWidth="1" />
      {/* Book */}
      <rect x="665" y="305" width="25" height="18" fill="#dc2626" rx="2" transform="rotate(5, 677, 314)" />
      <rect x="667" y="307" width="21" height="14" fill="#f5e6c8" rx="1" transform="rotate(5, 677, 314)" />

      {/* Rug on floor */}
      <ellipse cx="400" cy="490" rx="150" ry="25" fill="#c07830" opacity="0.5" />
      <ellipse cx="400" cy="490" rx="130" ry="20" fill="#d4a030" opacity="0.4" />

      {/* Grandma's slippers on floor */}
      <g transform="translate(360, 500)">
        <ellipse cx="0" cy="0" rx="12" ry="6" fill="#ff85a2" />
        <ellipse cx="-2" cy="-2" rx="5" ry="4" fill="#ffb8c0" />
        <ellipse cx="30" cy="3" rx="12" ry="6" fill="#ff85a2" transform="rotate(10, 30, 3)" />
        <ellipse cx="28" cy="1" rx="5" ry="4" fill="#ffb8c0" transform="rotate(10, 28, 1)" />
      </g>

      {/* Warm lamp glow overlay */}
      <radialGradient id="rs7Glow" cx="10%" cy="50%" r="30%">
        <stop offset="0%" stopColor="#ffe680" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#ffe680" stopOpacity="0" />
      </radialGradient>
      <rect width="800" height="600" fill="url(#rs7Glow)" />
    </svg>
  );
}


/* ================================================================
   SCENE 8 — "What big eyes you have!"
   Red at bedside looking up at wolf, close-up of wolf's features
   ================================================================ */
export function RidingScene8({ className = '' }) {
  return (
    <svg viewBox="0 0 800 600" className={`absolute inset-0 w-full h-full ${className}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="rs8Wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5e6c8" />
          <stop offset="100%" stopColor="#edd9b5" />
        </linearGradient>
        <radialGradient id="rs8Glow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#ffe680" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#ffe680" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Bedroom wall */}
      <rect width="800" height="600" fill="url(#rs8Wall)" />
      <rect width="800" height="600" fill="url(#rs8Glow)" />

      {/* Wallpaper dots */}
      {Array.from({ length: 6 }, (_, row) =>
        Array.from({ length: 8 }, (_, col) => (
          <circle key={`d${row}${col}`} cx={50 + col * 100} cy={50 + row * 100} r="2" fill="#c4a265" opacity="0.15" />
        ))
      )}

      {/* Headboard visible */}
      <rect x="350" y="100" width="460" height="30" fill="#8b5e3c" rx="5" />
      <rect x="360" y="70" width="440" height="40" fill="#a06a3a" rx="8" />

      {/* Bed visible — right portion */}
      <rect x="350" y="130" width="460" height="300" fill="#fff5ee" rx="5" />
      {/* Pillow */}
      <ellipse cx="500" cy="175" rx="90" ry="30" fill="white" />
      <ellipse cx="500" cy="173" rx="85" ry="27" fill="#fff8f0" />

      {/* Quilt */}
      <path d="M350,250 L810,250 L810,430 Q580,445 350,430 Z" fill="#ff85a2" />
      {/* Quilt pattern */}
      {Array.from({ length: 2 }, (_, row) =>
        Array.from({ length: 7 }, (_, col) => (
          <rect key={`qp${row}${col}`} x={355 + col * 65} y={255 + row * 35} width="63" height="33" fill={(row + col) % 2 === 0 ? '#ff6b8a' : '#ffb8c0'} opacity="0.3" rx="2" />
        ))
      )}

      {/* THE WOLF — big close-up, in bed with grandma clothes */}
      <g transform="translate(560, 150)">
        {/* Nightgown */}
        <path d="M-50,60 Q-55,80 -50,110 L50,110 Q55,80 50,60 Z" fill="#ffb8c0" />
        <path d="M-40,60 Q-30,68 -20,60 Q-10,68 0,60 Q10,68 20,60 Q30,68 40,60" fill="none" stroke="white" strokeWidth="2" opacity="0.6" />

        {/* Wolf head — HUGE for close-up */}
        <g transform="translate(0, 0)">
          <ellipse cx="0" cy="10" rx="55" ry="50" fill="#6b7280" />
          <ellipse cx="5" cy="15" rx="40" ry="35" fill="#9ca3af" opacity="0.2" />

          {/* Long snout */}
          <ellipse cx="40" cy="22" rx="32" ry="22" fill="#9ca3af" />
          <ellipse cx="48" cy="18" rx="18" ry="12" fill="#6b7280" opacity="0.3" />
          {/* BIG NOSE */}
          <ellipse cx="65" cy="18" rx="8" ry="6" fill="#333" />
          <ellipse cx="63" cy="16" rx="3" ry="2" fill="#666" opacity="0.5" />

          {/* WHAT BIG EYES — enormous, bulging behind tiny glasses */}
          <ellipse cx="-5" cy="-5" rx="16" ry="18" fill="white" />
          <ellipse cx="20" cy="-2" rx="14" ry="16" fill="white" />
          {/* Pupils */}
          <ellipse cx="-3" cy="-3" rx="10" ry="12" fill="#5c3317" />
          <ellipse cx="22" cy="0" rx="9" ry="11" fill="#5c3317" />
          {/* Sparkles */}
          <circle cx="-1" cy="-8" r="4" fill="white" />
          <circle cx="24" cy="-5" r="3.5" fill="white" />
          <circle cx="-6" cy="0" r="2" fill="white" />
          <circle cx="19" cy="3" r="1.5" fill="white" />

          {/* Tiny glasses — comically small on big face */}
          <ellipse cx="-5" cy="-5" rx="16" ry="18" fill="none" stroke="#8b5e3c" strokeWidth="2.5" />
          <ellipse cx="20" cy="-2" rx="14" ry="16" fill="none" stroke="#8b5e3c" strokeWidth="2.5" />
          <line x1="11" y1="-4" x2="6" y2="-4" stroke="#8b5e3c" strokeWidth="2" />
          <path d="M-21,-5 Q-30,-10 -35,-5" fill="none" stroke="#8b5e3c" strokeWidth="2" />
          <path d="M34,-2 Q42,-5 48,0" fill="none" stroke="#8b5e3c" strokeWidth="2" />

          {/* WHAT BIG EARS — poking through bonnet */}
          <path d="M-30,-30 Q-45,-65 -25,-75 Q-15,-70 -18,-40" fill="#6b7280" />
          <path d="M-25,-40 Q-38,-60 -25,-68 Q-18,-64 -20,-45" fill="#d1d5db" opacity="0.4" />
          <path d="M25,-28 Q45,-60 55,-50 Q60,-38 40,-28" fill="#6b7280" />
          <path d="M28,-30 Q42,-52 50,-45 Q54,-38 38,-30" fill="#d1d5db" opacity="0.4" />

          {/* Nightcap — too small, stretched */}
          <path d="M-35,-20 Q-40,-40 -20,-50 Q0,-55 25,-48 Q40,-38 38,-20" fill="white" />
          <path d="M-35,-20 Q-40,-40 -20,-50 Q0,-55 25,-48 Q40,-38 38,-20" fill="#ffb8c0" opacity="0.3" />
          {/* Cap frill */}
          <path d="M-37,-18 Q-32,-24 -27,-18 Q-22,-24 -17,-18 Q-12,-24 -7,-18 Q-2,-24 3,-18 Q8,-24 13,-18 Q18,-24 23,-18 Q28,-24 33,-18 Q38,-24 40,-20" fill="none" stroke="#ff85a2" strokeWidth="2.5" />

          {/* Goofy worried grin — knows the jig might be up */}
          <path d="M30,32 Q45,42 62,32" fill="none" stroke="#4b5563" strokeWidth="2.5" strokeLinecap="round" />
          {/* Teeth */}
          <path d="M38,33 L37,38 L41,34" fill="white" />
          <path d="M48,34 L47,39 L51,35" fill="white" />
          <path d="M56,33 L55,38 L59,34" fill="white" />
        </g>
      </g>

      {/* Visual emphasis circles — "What big eyes!" */}
      <circle cx="555" cy="145" r="45" fill="none" stroke="#fbbf24" strokeWidth="2" opacity="0.4" strokeDasharray="5,5">
        <animate attributeName="r" values="45;50;45" dur="2s" repeatCount="indefinite" />
      </circle>
      {/* "What big ears!" */}
      <circle cx="530" cy="100" r="30" fill="none" stroke="#fbbf24" strokeWidth="2" opacity="0.3" strokeDasharray="5,5">
        <animate attributeName="r" values="30;35;30" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="615" cy="105" r="25" fill="none" stroke="#fbbf24" strokeWidth="2" opacity="0.3" strokeDasharray="5,5">
        <animate attributeName="r" values="25;30;25" dur="2.3s" repeatCount="indefinite" />
      </circle>

      {/* RED RIDING HOOD — standing at bedside, looking up */}
      <g transform="translate(200, 280)">
        {/* Shadow */}
        <ellipse cx="0" cy="170" rx="28" ry="7" fill="#c4a265" opacity="0.2" />

        {/* Cape */}
        <path d="M-5,-50 Q-28,-40 -32,0 Q-35,50 -28,160 L28,160 Q35,50 32,0 Q28,-40 5,-50 Z" fill="#dc2626" />
        <path d="M-5,-50 Q-22,-38 -26,0 Q-28,45 -22,140 L-10,150 Q-15,48 -12,5 Q-8,-25 -5,-50 Z" fill="#ef4444" opacity="0.5" />

        {/* Dress */}
        <path d="M-14,100 L-20,158 L20,158 L14,100 Z" fill="#f8b4c8" />

        {/* Shoes */}
        <ellipse cx="-12" cy="162" rx="8" ry="4" fill="#4a3520" />
        <ellipse cx="12" cy="162" rx="8" ry="4" fill="#4a3520" />

        {/* Arms */}
        <path d="M-22,40 Q-35,30 -30,20" fill="none" stroke="#fce4c8" strokeWidth="6" strokeLinecap="round" />
        <path d="M22,40 Q35,50 30,60" fill="none" stroke="#fce4c8" strokeWidth="6" strokeLinecap="round" />

        {/* Basket at her feet */}
        <g transform="translate(35, 140)">
          <path d="M-8,0 Q0,-10 8,0" fill="none" stroke="#8b5e3c" strokeWidth="2" />
          <rect x="-8" y="0" width="16" height="10" fill="#d4a030" rx="2" stroke="#8b5e3c" strokeWidth="1" />
        </g>

        {/* Hood */}
        <path d="M0,-68 Q-22,-65 -24,-48 Q-28,-32 -22,-18 Q-14,-5 0,0 Q14,-5 22,-18 Q28,-32 24,-48 Q22,-65 0,-68 Z" fill="#dc2626" />
        <path d="M0,-68 Q-18,-63 -20,-48 Q-22,-35 -18,-22 Q-10,-8 0,-3 Q-5,-15 -8,-35 Q-5,-55 0,-68 Z" fill="#ef4444" opacity="0.5" />

        {/* Face — looking UP at wolf */}
        <ellipse cx="0" cy="-38" rx="16" ry="18" fill="#fce4c8" />

        {/* Pigtails */}
        <path d="M-18,-32 Q-25,-28 -28,-20 Q-30,-14 -26,-8" fill="none" stroke="#8b5e3c" strokeWidth="5" strokeLinecap="round" />
        <path d="M18,-32 Q25,-28 28,-20 Q30,-14 26,-8" fill="none" stroke="#8b5e3c" strokeWidth="5" strokeLinecap="round" />

        {/* Eyes — looking UP, curious/amused */}
        <ellipse cx="-6" cy="-42" rx="5" ry="6" fill="white" />
        <ellipse cx="6" cy="-42" rx="5" ry="6" fill="white" />
        {/* Pupils looking up */}
        <ellipse cx="-5" cy="-44" rx="3.5" ry="4.5" fill="#5c3317" />
        <ellipse cx="7" cy="-44" rx="3.5" ry="4.5" fill="#5c3317" />
        <circle cx="-4" cy="-46" r="1.5" fill="white" />
        <circle cx="8" cy="-46" r="1.5" fill="white" />

        {/* Curious/amused smile */}
        <path d="M-5,-28 Q0,-24 5,-28" fill="none" stroke="#c47a5a" strokeWidth="1.5" strokeLinecap="round" />

        {/* Rosy cheeks */}
        <circle cx="-11" cy="-33" r="4" fill="#f0a0a0" opacity="0.45" />
        <circle cx="11" cy="-33" r="4" fill="#f0a0a0" opacity="0.45" />

        {/* Nose */}
        <ellipse cx="0" cy="-35" rx="2" ry="1.5" fill="#f0b8a0" />
      </g>

      {/* Thought/speech emphasis */}
      <g transform="translate(120, 120)" opacity="0.6">
        <text x="0" y="0" fontSize="18" fill="#dc2626" fontFamily="serif" fontStyle="italic" fontWeight="bold">What big</text>
        <text x="0" y="22" fontSize="22" fill="#dc2626" fontFamily="serif" fontStyle="italic" fontWeight="bold">EYES</text>
        <text x="0" y="42" fontSize="16" fill="#dc2626" fontFamily="serif" fontStyle="italic">you have!</text>
      </g>

      {/* Mouse peeking from under bed */}
      <g transform="translate(420, 430)">
        <circle cx="0" cy="0" r="5" fill="#b0a090" />
        <ellipse cx="-2" cy="-4" rx="3" ry="2.5" fill="#c8b8a8" />
        <ellipse cx="3" cy="-4" rx="3" ry="2.5" fill="#c8b8a8" />
        <circle cx="2" cy="-1" r="1.2" fill="#333" />
        <ellipse cx="4" cy="1" rx="1.5" ry="1" fill="#ff85a2" />
      </g>

      {/* Floor visible at bottom */}
      <rect x="0" y="460" width="350" height="140" fill="#a0825a" />
      {[475, 495, 515, 535, 555].map((y, i) => (
        <line key={i} x1="0" y1={y} x2="350" y2={y} stroke="#8b7040" strokeWidth="1" opacity="0.3" />
      ))}
      <rect x="0" y="455" width="350" height="10" fill="#8b5e3c" />
    </svg>
  );
}


/* ================================================================
   SCENE 9 — "The woodcutter comes to help"
   Woodcutter bursting through door, wolf startled, Red & Grandma safe
   ================================================================ */
export function RidingScene9({ className = '' }) {
  return (
    <svg viewBox="0 0 800 600" className={`absolute inset-0 w-full h-full ${className}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="rs9Wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5e6c8" />
          <stop offset="100%" stopColor="#edd9b5" />
        </linearGradient>
        <radialGradient id="rs9Burst" cx="15%" cy="50%" r="40%">
          <stop offset="0%" stopColor="#ffe680" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#ffe680" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Bedroom wall */}
      <rect width="800" height="600" fill="url(#rs9Wall)" />
      <rect width="800" height="600" fill="url(#rs9Burst)" />

      {/* Floor */}
      <rect x="0" y="460" width="800" height="140" fill="#a0825a" />
      {[475, 495, 515, 535, 555].map((y, i) => (
        <line key={i} x1="0" y1={y} x2="800" y2={y} stroke="#8b7040" strokeWidth="1" opacity="0.3" />
      ))}
      <rect x="0" y="455" width="800" height="10" fill="#8b5e3c" />

      {/* Bed — further back right */}
      <rect x="400" y="230" width="350" height="20" fill="#8b5e3c" rx="5" />
      <rect x="400" y="200" width="350" height="35" fill="#a06a3a" rx="8" />
      <rect x="400" y="250" width="350" height="160" fill="#fff5ee" rx="5" />
      <ellipse cx="530" cy="275" rx="70" ry="20" fill="white" />
      <path d="M400,320 L750,320 L750,410 Q575,425 400,410 Z" fill="#ff85a2" />
      <path d="M400,410 Q420,418 440,410 Q460,418 480,410 Q500,418 520,410 Q540,418 560,410 Q580,418 600,410 Q620,418 640,410 Q660,418 680,410 Q700,418 720,410 Q740,418 750,412" fill="none" stroke="#e05577" strokeWidth="2" />

      {/* Doorway — burst open left side */}
      <rect x="10" y="80" width="140" height="380" fill="#87CEEB" rx="4" />
      {/* Door swung open */}
      <g transform="translate(150, 80)">
        <rect x="-5" y="0" width="70" height="380" fill="#8b4513" rx="3" transform="rotate(20, -5, 0)" />
        <rect x="0" y="5" width="60" height="370" fill="#a0622d" rx="2" transform="rotate(20, -5, 0)" />
      </g>
      {/* Door frame */}
      <rect x="0" y="70" width="18" height="400" fill="#8b4513" />
      <rect x="150" y="70" width="18" height="400" fill="#8b4513" />
      <rect x="0" y="70" width="168" height="18" fill="#8b4513" />

      {/* Action burst lines around door */}
      {[0, 20, 40, -20, -40].map((angle, i) => (
        <line
          key={i}
          x1={170}
          y1={280 + angle}
          x2={220 + i * 5}
          y2={270 + angle}
          stroke="#fbbf24"
          strokeWidth={3 - i * 0.3}
          opacity={0.5 - i * 0.08}
          strokeLinecap="round"
        />
      ))}

      {/* THE WOODCUTTER — bursting through */}
      <g transform="translate(120, 200)">
        {/* Shadow */}
        <ellipse cx="30" cy="270" rx="40" ry="10" fill="#8b7040" opacity="0.2" />

        {/* Big sturdy body */}
        {/* Checked shirt */}
        <path d="M-15,60 Q-25,120 -30,200 L70,200 Q65,120 55,60 Z" fill="#dc2626" />
        {/* Check pattern */}
        {[70, 95, 120, 145, 170, 195].map((y, i) => (
          <line key={`h${i}`} x1="-25" y1={y} x2="65" y2={y} stroke="#b91c1c" strokeWidth="1" opacity="0.3" />
        ))}
        {[-15, 0, 15, 30, 45].map((x, i) => (
          <line key={`v${i}`} x1={x} y1="65" x2={x - 3} y2="198" stroke="#b91c1c" strokeWidth="1" opacity="0.3" />
        ))}

        {/* Trousers */}
        <path d="M-28,195 L-35,260 L-10,262 L10,198" fill="#5c3d2e" />
        <path d="M30,198 L25,260 L50,262 L55,195" fill="#5c3d2e" />
        {/* Boots */}
        <ellipse cx="-22" cy="264" rx="14" ry="6" fill="#3d2b1a" />
        <ellipse cx="38" cy="264" rx="14" ry="6" fill="#3d2b1a" />

        {/* Strong arms */}
        {/* Left arm — holding axe overhead */}
        <path d="M-15,65 Q-40,40 -35,10 Q-30,-10 -20,-20" fill="none" stroke="#fce4c8" strokeWidth="12" strokeLinecap="round" />
        {/* Right arm — also on axe */}
        <path d="M55,65 Q60,40 50,15 Q40,-5 -15,-15" fill="none" stroke="#fce4c8" strokeWidth="12" strokeLinecap="round" />

        {/* AXE — over shoulder */}
        <line x1="-20" y1="-20" x2="40" y2="-60" stroke="#8b5e3c" strokeWidth="5" strokeLinecap="round" />
        <path d="M35,-65 Q50,-75 55,-60 Q55,-50 40,-55 Z" fill="#9ca3af" />
        <path d="M38,-63 Q48,-70 52,-60 Q50,-54 42,-57 Z" fill="#b0b8c8" opacity="0.5" />

        {/* Head */}
        <circle cx="20" cy="35" r="28" fill="#fce4c8" />
        {/* Bushy brown beard */}
        <path d="M-5,42 Q0,55 5,60 Q15,65 25,62 Q35,55 40,42 Q38,50 30,55 Q20,58 10,55 Q0,50 -5,42 Z" fill="#8b5e3c" />
        <path d="M-3,44 Q5,52 15,55 Q25,52 33,44" fill="#6b4830" opacity="0.3" />
        {/* Mustache */}
        <path d="M10,42 Q5,48 0,44 M30,42 Q35,48 40,44" fill="none" stroke="#8b5e3c" strokeWidth="3" strokeLinecap="round" />

        {/* Hair — brown, messy */}
        <path d="M-8,20 Q-10,5 0,0 Q10,-5 25,-4 Q38,0 45,10 Q48,20 45,25" fill="#8b5e3c" />
        <path d="M-5,18 Q-3,8 5,4 Q15,0 25,2 Q35,6 40,15" fill="#6b4830" opacity="0.4" />

        {/* Kind eyes */}
        <ellipse cx="10" cy="30" rx="5" ry="5.5" fill="white" />
        <ellipse cx="30" cy="30" rx="5" ry="5.5" fill="white" />
        <ellipse cx="11" cy="31" rx="3.5" ry="4" fill="#5c3317" />
        <ellipse cx="31" cy="31" rx="3.5" ry="4" fill="#5c3317" />
        <circle cx="12" cy="29" r="1.5" fill="white" />
        <circle cx="32" cy="29" r="1.5" fill="white" />
        {/* Bushy eyebrows — kind but determined */}
        <path d="M3,24 Q8,20 16,23" fill="none" stroke="#6b4830" strokeWidth="3" strokeLinecap="round" />
        <path d="M25,23 Q32,20 38,24" fill="none" stroke="#6b4830" strokeWidth="3" strokeLinecap="round" />

        {/* Determined smile */}
        <path d="M10,46 Q20,42 30,46" fill="none" stroke="#c47a5a" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="5" cy="38" r="4" fill="#f0a0a0" opacity="0.35" />
        <circle cx="38" cy="38" r="4" fill="#f0a0a0" opacity="0.35" />
      </g>

      {/* THE WOLF — leaping up in surprise */}
      <g transform="translate(530, 220)">
        {/* Wolf jumping out of bed */}
        {/* Body */}
        <ellipse cx="0" cy="40" rx="25" ry="35" fill="#6b7280" />
        <ellipse cx="0" cy="50" rx="16" ry="20" fill="#d1d5db" opacity="0.4" />

        {/* Legs flailing */}
        <path d="M-15,70 Q-25,85 -30,95" fill="none" stroke="#6b7280" strokeWidth="8" strokeLinecap="round" />
        <path d="M15,70 Q25,85 30,95" fill="none" stroke="#6b7280" strokeWidth="8" strokeLinecap="round" />
        <path d="M-12,20 Q-25,10 -30,0" fill="none" stroke="#6b7280" strokeWidth="8" strokeLinecap="round" />
        <path d="M12,20 Q25,10 30,0" fill="none" stroke="#6b7280" strokeWidth="8" strokeLinecap="round" />

        {/* Nightgown still partly on, disheveled */}
        <path d="M-20,30 Q-25,50 -20,70 L20,70 Q25,50 20,30 Z" fill="#ffb8c0" opacity="0.6" />

        {/* Head — shocked expression */}
        <g transform="translate(0, -5)">
          <ellipse cx="0" cy="0" rx="22" ry="20" fill="#6b7280" />
          <ellipse cx="12" cy="5" rx="14" ry="10" fill="#9ca3af" />
          <ellipse cx="20" cy="3" rx="5" ry="4" fill="#333" />

          {/* HUGE shocked eyes */}
          <ellipse cx="-6" cy="-5" rx="8" ry="10" fill="white" />
          <ellipse cx="6" cy="-4" rx="7" ry="9" fill="white" />
          {/* Tiny pupils — shocked */}
          <circle cx="-6" cy="-4" r="3" fill="#5c3317" />
          <circle cx="6" cy="-3" r="2.5" fill="#5c3317" />
          <circle cx="-5" cy="-6" r="1.5" fill="white" />
          <circle cx="7" cy="-5" r="1.2" fill="white" />

          {/* Shocked open mouth */}
          <ellipse cx="8" cy="10" rx="8" ry="6" fill="#4b5563" />
          <ellipse cx="8" cy="9" rx="6" ry="4" fill="#333" />

          {/* Ears straight up — alarm! */}
          <path d="M-12,-15 Q-18,-38 -8,-42 Q-3,-38 -5,-20" fill="#6b7280" />
          <path d="M10,-14 Q16,-38 22,-35 Q25,-28 18,-18" fill="#6b7280" />

          {/* Glasses flying off — askew */}
          <circle cx="20" cy="-15" r="8" fill="none" stroke="#8b5e3c" strokeWidth="2" opacity="0.7" transform="rotate(30, 20, -15)" />
          <circle cx="35" cy="-20" r="7" fill="none" stroke="#8b5e3c" strokeWidth="2" opacity="0.7" transform="rotate(30, 35, -20)" />

          {/* Bonnet flying off! */}
          <g transform="translate(25, -35) rotate(25)">
            <ellipse cx="0" cy="0" rx="18" ry="10" fill="white" />
            <ellipse cx="0" cy="0" rx="18" ry="10" fill="#ffb8c0" opacity="0.3" />
            <path d="M-18,0 Q-14,-5 -10,0 Q-6,-5 -2,0 Q2,-5 6,0 Q10,-5 14,0 Q18,-5 18,1" fill="none" stroke="#ff85a2" strokeWidth="1.5" />
          </g>
        </g>

        {/* Shock lines around wolf */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <line
            key={i}
            x1={35 * Math.cos((angle * Math.PI) / 180)}
            y1={20 + 35 * Math.sin((angle * Math.PI) / 180)}
            x2={48 * Math.cos((angle * Math.PI) / 180)}
            y2={20 + 48 * Math.sin((angle * Math.PI) / 180)}
            stroke="#fbbf24"
            strokeWidth="2"
            opacity="0.5"
            strokeLinecap="round"
          />
        ))}
      </g>

      {/* RED RIDING HOOD — relieved, behind woodcutter */}
      <g transform="translate(250, 330)">
        {/* Cape */}
        <path d="M-4,-25 Q-18,-18 -20,5 Q-22,25 -18,60 L18,60 Q22,25 20,5 Q18,-18 4,-25 Z" fill="#dc2626" />
        <path d="M-4,-25 Q-14,-16 -16,5 Q-18,22 -14,50 L-5,55 Q-10,25 -8,5 Q-6,-10 -4,-25 Z" fill="#ef4444" opacity="0.5" />

        {/* Dress */}
        <path d="M-10,35 L-13,58 L13,58 L10,35 Z" fill="#f8b4c8" />
        <ellipse cx="-8" cy="60" rx="6" ry="3" fill="#4a3520" />
        <ellipse cx="8" cy="60" rx="6" ry="3" fill="#4a3520" />

        {/* Hood */}
        <path d="M0,-40 Q-16,-38 -18,-26 Q-20,-16 -16,-8 Q-10,0 0,2 Q10,0 16,-8 Q20,-16 18,-26 Q16,-38 0,-40 Z" fill="#dc2626" />

        {/* Face */}
        <ellipse cx="0" cy="-18" rx="12" ry="14" fill="#fce4c8" />
        {/* Happy relieved eyes */}
        <path d="M-7,-20 Q-4,-24 -1,-20" fill="none" stroke="#5c3317" strokeWidth="2" strokeLinecap="round" />
        <path d="M1,-20 Q4,-24 7,-20" fill="none" stroke="#5c3317" strokeWidth="2" strokeLinecap="round" />
        {/* Big happy smile */}
        <path d="M-5,-11 Q0,-6 5,-11" fill="#c47a5a" />
        <circle cx="-8" cy="-14" r="3" fill="#f0a0a0" opacity="0.45" />
        <circle cx="8" cy="-14" r="3" fill="#f0a0a0" opacity="0.45" />
        {/* Pigtails */}
        <path d="M-14,-14 Q-18,-10 -19,-4" fill="none" stroke="#8b5e3c" strokeWidth="4" strokeLinecap="round" />
        <path d="M14,-14 Q18,-10 19,-4" fill="none" stroke="#8b5e3c" strokeWidth="4" strokeLinecap="round" />
      </g>

      {/* GRANDMA — peeking from behind wardrobe/curtain */}
      <g transform="translate(700, 280)">
        {/* Wardrobe edge */}
        <rect x="20" y="-60" width="90" height="250" fill="#8b5e3c" rx="3" />
        <rect x="25" y="-55" width="38" height="240" fill="#7a4e32" rx="2" />
        <circle cx="58" cy="60" r="3" fill="#d4a030" />

        {/* Grandma peeking */}
        <circle cx="10" cy="20" r="18" fill="#fce4c8" />
        {/* White hair */}
        <path d="M-8,12 Q-10,2 -5,-5 Q5,-10 15,-6 Q22,0 20,12" fill="#e0d8d0" />
        <circle cx="5" cy="-5" r="6" fill="#e0d8d0" />
        {/* Glasses */}
        <circle cx="5" cy="17" r="6" fill="none" stroke="#8b5e3c" strokeWidth="1.5" />
        <circle cx="16" cy="18" r="5.5" fill="none" stroke="#8b5e3c" strokeWidth="1.5" />
        <line x1="11" y1="17" x2="11" y2="18" stroke="#8b5e3c" strokeWidth="1" />
        {/* Eyes — relieved */}
        <ellipse cx="5" cy="16" rx="3" ry="3.5" fill="white" />
        <ellipse cx="16" cy="17" rx="3" ry="3.5" fill="white" />
        <ellipse cx="6" cy="17" rx="2" ry="2.5" fill="#5c3317" />
        <ellipse cx="17" cy="18" rx="2" ry="2.5" fill="#5c3317" />
        <circle cx="7" cy="16" r="1" fill="white" />
        <circle cx="18" cy="17" r="1" fill="white" />
        {/* Happy relieved smile */}
        <path d="M4,24 Q10,29 16,24" fill="none" stroke="#c47a5a" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="0" cy="22" r="3" fill="#f0a0a0" opacity="0.4" />
        <circle cx="22" cy="22" r="3" fill="#f0a0a0" opacity="0.4" />
        {/* Pink shawl */}
        <path d="M-8,30 Q-15,35 -12,50 L30,50 Q33,35 28,30 Z" fill="#ff85a2" opacity="0.7" />
      </g>
    </svg>
  );
}


/* ================================================================
   SCENE 10 — "Tea and cakes together — the end!"
   Garden tea party: Grandma, Red, Woodcutter, even the wolf
   ================================================================ */
export function RidingScene10({ className = '' }) {
  return (
    <svg viewBox="0 0 800 600" className={`absolute inset-0 w-full h-full ${className}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="rs10Sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#87CEEB" />
          <stop offset="50%" stopColor="#a8d8ea" />
          <stop offset="100%" stopColor="#d4f0fc" />
        </linearGradient>
        <linearGradient id="rs10Grass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5dba3b" />
          <stop offset="100%" stopColor="#3a8a28" />
        </linearGradient>
        <radialGradient id="rs10Warm" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#ffe680" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#ffe680" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Beautiful sky */}
      <rect width="800" height="600" fill="url(#rs10Sky)" />
      <rect width="800" height="600" fill="url(#rs10Warm)" />

      {/* Sun */}
      <circle cx="650" cy="70" r="45" fill="#ffe066" />
      <circle cx="650" cy="70" r="38" fill="#fff7ae" />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
        <line
          key={i}
          x1={650 + 50 * Math.cos((angle * Math.PI) / 180)}
          y1={70 + 50 * Math.sin((angle * Math.PI) / 180)}
          x2={650 + 65 * Math.cos((angle * Math.PI) / 180)}
          y2={70 + 65 * Math.sin((angle * Math.PI) / 180)}
          stroke="#ffe066"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.6"
        />
      ))}

      {/* RAINBOW */}
      <g opacity="0.4">
        {[
          ['#dc2626', 160],
          ['#f97316', 152],
          ['#fbbf24', 144],
          ['#22c55e', 136],
          ['#3b82f6', 128],
          ['#6366f1', 120],
          ['#a855f7', 112],
        ].map(([color, r], i) => (
          <path
            key={i}
            d={`M80,350 A${r},${r} 0 0,1 ${80 + Number(r) * 2},350`}
            fill="none"
            stroke={color}
            strokeWidth="6"
          />
        ))}
      </g>

      {/* Fluffy clouds */}
      <g opacity="0.8">
        <ellipse cx="120" cy="70" rx="50" ry="22" fill="white" />
        <ellipse cx="95" cy="65" rx="35" ry="18" fill="white" />
        <ellipse cx="150" cy="68" rx="30" ry="15" fill="white" />
      </g>
      <g opacity="0.6">
        <ellipse cx="400" cy="45" rx="45" ry="18" fill="white" />
        <ellipse cx="375" cy="40" rx="30" ry="14" fill="white" />
        <ellipse cx="430" cy="42" rx="28" ry="12" fill="white" />
      </g>

      {/* Grandma's cottage in background */}
      <g transform="translate(550, 180) scale(0.6)">
        <rect x="0" y="80" width="200" height="130" fill="#b0a090" rx="4" />
        <polygon points="-20,82 100,10 220,82" fill="#d4a030" />
        <rect x="75" y="120" width="50" height="90" fill="#8b4513" rx="25 25 0 0" />
        <rect x="15" y="110" width="40" height="35" fill="#ffeeaa" stroke="#8b4513" strokeWidth="2" />
        <rect x="145" y="110" width="40" height="35" fill="#ffeeaa" stroke="#8b4513" strokeWidth="2" />
        {/* Roses */}
        {[[65, 130], [135, 130], [70, 165], [130, 165]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="4" fill="#dc2626" />
        ))}
      </g>

      {/* Rolling green hills */}
      <ellipse cx="400" cy="360" rx="500" ry="60" fill="#6ab648" />
      <ellipse cx="200" cy="365" rx="300" ry="45" fill="#78c458" />

      {/* Main ground */}
      <rect x="0" y="370" width="800" height="230" fill="url(#rs10Grass)" />

      {/* THE TEA TABLE */}
      <g transform="translate(400, 380)">
        {/* Table legs */}
        <rect x="-170" y="30" width="8" height="60" fill="#8b5e3c" />
        <rect x="162" y="30" width="8" height="60" fill="#8b5e3c" />

        {/* Table top */}
        <rect x="-180" y="20" width="360" height="15" fill="#a06a3a" rx="3" />
        <rect x="-178" y="22" width="356" height="10" fill="#b8834a" rx="2" />

        {/* Tablecloth */}
        <path d="M-185,20 Q-185,35 -178,35 L178,35 Q185,35 185,20 Z" fill="white" />
        <path d="M-185,20 Q-185,35 -178,35 L178,35 Q185,35 185,20 Z" fill="#dc2626" opacity="0.15" />
        {/* Tablecloth drape with checks */}
        <path d="M-185,35 Q-170,42 -155,35 Q-140,42 -125,35 Q-110,42 -95,35 Q-80,42 -65,35 Q-50,42 -35,35 Q-20,42 -5,35 Q10,42 25,35 Q40,42 55,35 Q70,42 85,35 Q100,42 115,35 Q130,42 145,35 Q160,42 175,35 Q185,38 185,35" fill="none" stroke="#dc2626" strokeWidth="1" opacity="0.3" />

        {/* TEAPOT — centre */}
        <g transform="translate(0, -5)">
          <ellipse cx="0" cy="0" rx="18" ry="14" fill="#5ba0c8" />
          <ellipse cx="0" cy="-2" rx="15" ry="10" fill="#7ab8d0" opacity="0.5" />
          <rect x="-8" y="-14" width="16" height="5" fill="#5ba0c8" rx="2" />
          <circle cx="0" cy="-16" r="4" fill="#87CEEB" />
          <path d="M18,0 Q28,-5 25,5 Q22,10 18,5" fill="#5ba0c8" />
          <path d="M-18,-2 Q-28,-8 -28,0" fill="none" stroke="#5ba0c8" strokeWidth="3" strokeLinecap="round" />
          {/* Steam */}
          <path d="M-2,-18 Q-4,-28 0,-30 Q4,-28 2,-18" fill="none" stroke="#ccc" strokeWidth="1" opacity="0.4">
            <animate attributeName="d" values="M-2,-18 Q-4,-28 0,-30 Q4,-28 2,-18;M-2,-18 Q-6,-30 0,-34 Q6,-30 2,-18;M-2,-18 Q-4,-28 0,-30 Q4,-28 2,-18" dur="3s" repeatCount="indefinite" />
          </path>
        </g>

        {/* Teacups */}
        {[-120, -50, 50, 130].map((x, i) => (
          <g key={`cup${i}`} transform={`translate(${x}, 0)`}>
            <path d={`M-6,0 L-8,12 L8,12 L6,0 Z`} fill={['#ff85a2', '#87CEEB', '#fbbf24', '#a78bfa'][i]} />
            <path d={`M8,3 Q13,3 13,6 Q13,9 8,9`} fill="none" stroke={['#ff85a2', '#87CEEB', '#fbbf24', '#a78bfa'][i]} strokeWidth="1.5" />
            <ellipse cx="0" cy="1" rx="7" ry="2" fill={['#ff6b8a', '#5ba0c8', '#e8a820', '#8b5cf6'][i]} opacity="0.3" />
          </g>
        ))}

        {/* Cupcakes on plate */}
        <g transform="translate(-80, -5)">
          <ellipse cx="0" cy="5" rx="15" ry="4" fill="white" stroke="#ddd" strokeWidth="0.5" />
          <rect x="-5" y="-3" width="10" height="8" fill="#d4a060" rx="1" />
          <circle cx="0" cy="-5" r="6" fill="#ff85a2" />
          <circle cx="0" cy="-8" r="2.5" fill="#dc2626" />
        </g>
        <g transform="translate(80, -5)">
          <ellipse cx="0" cy="5" rx="15" ry="4" fill="white" stroke="#ddd" strokeWidth="0.5" />
          <rect x="-5" y="-3" width="10" height="8" fill="#d4a060" rx="1" />
          <circle cx="0" cy="-5" r="6" fill="#a78bfa" />
          <circle cx="0" cy="-8" r="2.5" fill="#dc2626" />
        </g>

        {/* Sandwiches on a plate */}
        <g transform="translate(30, -3)">
          <ellipse cx="0" cy="4" rx="12" ry="3.5" fill="white" stroke="#ddd" strokeWidth="0.5" />
          <path d="M-6,0 L0,-5 L6,0 Z" fill="#f5e6c8" />
          <path d="M-5,0 L0,-3 L5,0 Z" fill="#ffd700" opacity="0.5" />
          <path d="M-3,0 L3,0 L3,2 L-3,2 Z" fill="#5dba3b" opacity="0.4" />
        </g>
      </g>

      {/* GRANDMA — seated left */}
      <g transform="translate(220, 310)">
        {/* Pink shawl / body */}
        <path d="M-15,20 Q-22,40 -20,70 L20,70 Q22,40 15,20 Z" fill="#ff85a2" />
        <path d="M-12,22 Q-18,38 -16,65 L-5,68 Q-10,40 -8,25 Z" fill="#ffb8c0" opacity="0.4" />

        {/* Head */}
        <circle cx="0" cy="5" r="16" fill="#fce4c8" />
        {/* White hair in bun */}
        <path d="M-16,0 Q-18,-10 -10,-15 Q0,-18 10,-14 Q18,-8 16,0" fill="#e0d8d0" />
        <circle cx="0" cy="-14" r="7" fill="#e0d8d0" />
        {/* Hairpin */}
        <line x1="-3" y1="-18" x2="3" y2="-12" stroke="#8b5e3c" strokeWidth="1" />

        {/* Glasses */}
        <circle cx="-5" cy="3" r="5" fill="none" stroke="#8b5e3c" strokeWidth="1.5" />
        <circle cx="5" cy="3" r="5" fill="none" stroke="#8b5e3c" strokeWidth="1.5" />
        <line x1="0" y1="3" x2="0" y2="3" stroke="#8b5e3c" strokeWidth="1" />
        {/* Eyes */}
        <ellipse cx="-5" cy="3" rx="2.5" ry="3" fill="white" />
        <ellipse cx="5" cy="3" rx="2.5" ry="3" fill="white" />
        <ellipse cx="-4" cy="4" rx="1.8" ry="2.2" fill="#5c3317" />
        <ellipse cx="6" cy="4" rx="1.8" ry="2.2" fill="#5c3317" />
        <circle cx="-3" cy="3" r="0.8" fill="white" />
        <circle cx="7" cy="3" r="0.8" fill="white" />

        {/* Warm kind smile */}
        <path d="M-6,10 Q0,15 6,10" fill="none" stroke="#c47a5a" strokeWidth="1.5" strokeLinecap="round" />
        {/* Rosy cheeks */}
        <circle cx="-10" cy="7" r="3" fill="#f0a0a0" opacity="0.45" />
        <circle cx="10" cy="7" r="3" fill="#f0a0a0" opacity="0.45" />

        {/* Arms — holding teacup */}
        <path d="M-15,25 Q-22,35 -20,45" fill="none" stroke="#fce4c8" strokeWidth="5" strokeLinecap="round" />
        <path d="M15,25 Q22,35 20,45" fill="none" stroke="#fce4c8" strokeWidth="5" strokeLinecap="round" />
      </g>

      {/* RED RIDING HOOD — seated centre-left */}
      <g transform="translate(330, 320)">
        {/* Cape */}
        <path d="M-4,-28 Q-18,-22 -20,0 Q-22,20 -18,60 L18,60 Q22,20 20,0 Q18,-22 4,-28 Z" fill="#dc2626" />
        <path d="M-4,-28 Q-14,-20 -16,0 Q-18,18 -14,50 L-5,55 Q-10,20 -8,2 Q-6,-12 -4,-28 Z" fill="#ef4444" opacity="0.5" />

        {/* Hood */}
        <path d="M0,-44 Q-15,-42 -17,-30 Q-19,-20 -15,-12 Q-10,-4 0,-1 Q10,-4 15,-12 Q19,-20 17,-30 Q15,-42 0,-44 Z" fill="#dc2626" />

        {/* Face */}
        <ellipse cx="0" cy="-20" rx="12" ry="14" fill="#fce4c8" />
        {/* Pigtails */}
        <path d="M-14,-16 Q-18,-12 -19,-6" fill="none" stroke="#8b5e3c" strokeWidth="4" strokeLinecap="round" />
        <path d="M14,-16 Q18,-12 19,-6" fill="none" stroke="#8b5e3c" strokeWidth="4" strokeLinecap="round" />
        {/* Happy closed eyes */}
        <path d="M-7,-22 Q-4,-26 -1,-22" fill="none" stroke="#5c3317" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M1,-22 Q4,-26 7,-22" fill="none" stroke="#5c3317" strokeWidth="1.5" strokeLinecap="round" />
        {/* Big happy smile */}
        <path d="M-5,-13 Q0,-8 5,-13" fill="#c47a5a" />
        <path d="M-4,-13 Q0,-10 4,-13" fill="white" opacity="0.7" />
        <circle cx="-8" cy="-16" r="3" fill="#f0a0a0" opacity="0.45" />
        <circle cx="8" cy="-16" r="3" fill="#f0a0a0" opacity="0.45" />
        <ellipse cx="0" cy="-19" rx="1.5" ry="1" fill="#f0b8a0" />
      </g>

      {/* WOODCUTTER — seated centre-right */}
      <g transform="translate(480, 310)">
        {/* Checked shirt body */}
        <path d="M-15,15 Q-22,35 -20,70 L20,70 Q22,35 15,15 Z" fill="#dc2626" />
        {/* Check pattern */}
        {[25, 35, 45, 55, 65].map((y, i) => (
          <line key={i} x1="-18" y1={y} x2="18" y2={y} stroke="#b91c1c" strokeWidth="0.8" opacity="0.3" />
        ))}

        {/* Head */}
        <circle cx="0" cy="0" r="18" fill="#fce4c8" />
        {/* Beard */}
        <path d="M-10,8 Q0,20 10,8 Q8,16 0,18 Q-8,16 -10,8 Z" fill="#8b5e3c" />
        {/* Mustache */}
        <path d="M-3,7 Q-8,10 -10,7" fill="none" stroke="#8b5e3c" strokeWidth="2" strokeLinecap="round" />
        <path d="M3,7 Q8,10 10,7" fill="none" stroke="#8b5e3c" strokeWidth="2" strokeLinecap="round" />
        {/* Hair */}
        <path d="M-18,-3 Q-18,-12 -10,-16 Q0,-18 10,-15 Q18,-10 18,-2" fill="#8b5e3c" />
        {/* Kind eyes */}
        <ellipse cx="-6" cy="-2" rx="3.5" ry="4" fill="white" />
        <ellipse cx="6" cy="-2" rx="3.5" ry="4" fill="white" />
        <ellipse cx="-5" cy="-1" rx="2.2" ry="2.8" fill="#5c3317" />
        <ellipse cx="7" cy="-1" rx="2.2" ry="2.8" fill="#5c3317" />
        <circle cx="-4" cy="-2" r="1" fill="white" />
        <circle cx="8" cy="-2" r="1" fill="white" />
        {/* Happy smile */}
        <path d="M-5,10 Q0,6 5,10" fill="none" stroke="#c47a5a" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="-11" cy="4" r="3" fill="#f0a0a0" opacity="0.35" />
        <circle cx="11" cy="4" r="3" fill="#f0a0a0" opacity="0.35" />

        {/* Arms */}
        <path d="M-15,20 Q-25,30 -22,40" fill="none" stroke="#fce4c8" strokeWidth="6" strokeLinecap="round" />
        <path d="M15,20 Q25,30 22,40" fill="none" stroke="#fce4c8" strokeWidth="6" strokeLinecap="round" />
      </g>

      {/* THE WOLF — sheepishly at the end of the table */}
      <g transform="translate(600, 315)">
        {/* Body sitting */}
        <ellipse cx="0" cy="35" rx="20" ry="30" fill="#6b7280" />
        <ellipse cx="0" cy="40" rx="14" ry="18" fill="#d1d5db" opacity="0.4" />

        {/* Napkin tucked in! — eating politely */}
        <path d="M-12,15 L-14,50 L14,50 L12,15 Z" fill="white" />
        <rect x="-12" y="15" width="24" height="3" fill="white" stroke="#ddd" strokeWidth="0.5" />

        {/* Paws on table */}
        <path d="M-12,15 Q-18,10 -20,5" fill="none" stroke="#6b7280" strokeWidth="6" strokeLinecap="round" />
        <ellipse cx="-20" cy="4" rx="5" ry="3.5" fill="#4b5563" />
        <path d="M12,15 Q18,10 20,5" fill="none" stroke="#6b7280" strokeWidth="6" strokeLinecap="round" />
        <ellipse cx="20" cy="4" rx="5" ry="3.5" fill="#4b5563" />

        {/* Head — sheepish, embarrassed but happy */}
        <g transform="translate(0, -10)">
          <ellipse cx="0" cy="0" rx="18" ry="16" fill="#6b7280" />
          <ellipse cx="2" cy="2" rx="13" ry="10" fill="#9ca3af" opacity="0.25" />

          {/* Snout */}
          <ellipse cx="12" cy="5" rx="10" ry="7" fill="#9ca3af" />
          <ellipse cx="18" cy="3" rx="4" ry="3" fill="#333" />

          {/* Sheepish smile */}
          <path d="M6,10 Q12,15 20,10" fill="none" stroke="#4b5563" strokeWidth="1.5" strokeLinecap="round" />

          {/* Eyes — looking down sheepishly */}
          <ellipse cx="-4" cy="-3" rx="5" ry="6" fill="white" />
          <ellipse cx="6" cy="-2" rx="4.5" ry="5.5" fill="white" />
          <ellipse cx="-5" cy="-1" rx="3" ry="4" fill="#5c3317" />
          <ellipse cx="5" cy="0" rx="2.8" ry="3.8" fill="#5c3317" />
          <circle cx="-4" cy="-3" r="1.5" fill="white" />
          <circle cx="6" cy="-2" r="1.2" fill="white" />
          {/* Downcast eyebrows — embarrassed */}
          <path d="M-10,-7 Q-6,-10 -1,-8" fill="none" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" />
          <path d="M3,-7 Q7,-9 11,-6" fill="none" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" />

          {/* Ears drooping — sheepish */}
          <path d="M-10,-12 Q-16,-25 -10,-28 Q-6,-26 -7,-15" fill="#6b7280" />
          <path d="M8,-11 Q14,-22 18,-18 Q19,-14 14,-12" fill="#6b7280" />

          {/* Blush on cheeks — embarrassed! */}
          <circle cx="-10" cy="3" r="3" fill="#f0a0a0" opacity="0.4" />
          <circle cx="16" cy="5" r="3" fill="#f0a0a0" opacity="0.4" />
        </g>

        {/* Tail behind, wagging happily */}
        <path d="M10,50 Q25,40 30,30 Q32,22 28,20 Q24,22 25,30 Q22,40 12,48" fill="#6b7280" />
      </g>

      {/* GARDEN FLOWERS everywhere */}
      {[[50, 430], [100, 445], [170, 440], [680, 435], [730, 450], [760, 440], [50, 470], [130, 480], [680, 475], [750, 478], [400, 500], [450, 495]].map(([x, y], i) => (
        <g key={`gf10${i}`}>
          <line x1={x} y1={y} x2={x} y2={y + 15} stroke="#3a7a28" strokeWidth="1.5" />
          {[0, 72, 144, 216, 288].map((a, j) => (
            <ellipse
              key={j}
              cx={x + 4 * Math.cos((a * Math.PI) / 180)}
              cy={y + 4 * Math.sin((a * Math.PI) / 180)}
              rx="3" ry="1.5"
              fill={['#ffd700', 'white', '#ff85a2', '#a78bfa', '#ff6b8a', '#ffd700', '#ff85a2', 'white', '#fbbf24', '#a78bfa', '#ff6b8a', 'white'][i]}
              transform={`rotate(${a}, ${x + 4 * Math.cos((a * Math.PI) / 180)}, ${y + 4 * Math.sin((a * Math.PI) / 180)})`}
            />
          ))}
          <circle cx={x} cy={y} r="2" fill="#ffd700" />
        </g>
      ))}

      {/* Floating hearts */}
      {[[150, 280], [350, 260], [550, 275], [250, 290], [450, 255]].map(([x, y], i) => (
        <g key={`heart${i}`} opacity={0.4 - i * 0.05}>
          <path
            d={`M${x},${y + 3} Q${x - 5},${y - 5} ${x},${y - 2} Q${x + 5},${y - 5} ${x},${y + 3} Z`}
            fill="#dc2626"
          >
            <animateTransform attributeName="transform" type="translate" values={`0,0;0,-${8 + i * 2};0,0`} dur={`${3 + i}s`} repeatCount="indefinite" />
          </path>
        </g>
      ))}

      {/* Floating stars */}
      {[[200, 240], [500, 230], [650, 250], [300, 220]].map(([x, y], i) => (
        <g key={`star${i}`} opacity={0.35 - i * 0.05}>
          <path d={`M${x},${y - 5} L${x + 2},${y - 1} L${x + 6},${y - 1} L${x + 3},${y + 2} L${x + 4},${y + 6} L${x},${y + 3} L${x - 4},${y + 6} L${x - 3},${y + 2} L${x - 6},${y - 1} L${x - 2},${y - 1} Z`} fill="#fbbf24">
            <animate attributeName="opacity" values="0.3;0.5;0.3" dur={`${2 + i * 0.5}s`} repeatCount="indefinite" />
          </path>
        </g>
      ))}

      {/* Butterflies */}
      <g>
        <g transform="translate(100, 350)">
          <path d="M0,0 Q-6,-8 -4,-12 Q-1,-14 0,-9 Q1,-14 4,-12 Q6,-8 0,0 Z" fill="#ff85a2" />
          <path d="M0,0 Q-4,6 -3,9 Q-1,10 0,6 Q1,10 3,9 Q4,6 0,0 Z" fill="#ffb8c6" />
          <animateTransform attributeName="transform" type="translate" values="100,350;110,340;105,355;100,350" dur="5s" repeatCount="indefinite" />
        </g>
        <g transform="translate(700, 380)">
          <path d="M0,0 Q-5,-7 -3,-10 Q-1,-12 0,-8 Q1,-12 3,-10 Q5,-7 0,0 Z" fill="#a78bfa" />
          <path d="M0,0 Q-3,5 -2,8 Q0,9 0,5 Q0,9 2,8 Q3,5 0,0 Z" fill="#c4b5fd" />
          <animateTransform attributeName="transform" type="translate" values="700,380;690,370;695,385;700,380" dur="6s" repeatCount="indefinite" />
        </g>
      </g>

      {/* Ladybird on table */}
      <g transform="translate(370, 370)">
        <ellipse cx="0" cy="0" rx="4" ry="3" fill="#dc2626" />
        <line x1="0" y1="-3" x2="0" y2="3" stroke="#333" strokeWidth="0.5" />
        <circle cx="-1.5" cy="-0.5" r="0.8" fill="#333" />
        <circle cx="1.5" cy="0.5" r="0.8" fill="#333" />
        <circle cx="0" cy="-3" r="1.5" fill="#333" />
      </g>

      {/* Bird singing on a branch nearby */}
      <g transform="translate(50, 300)">
        <ellipse cx="0" cy="0" rx="7" ry="5" fill="#fbbf24" />
        <circle cx="6" cy="-3" r="4.5" fill="#fbbf24" />
        <circle cx="6" cy="-3" r="3.5" fill="#ffe066" />
        <ellipse cx="9" cy="-3" rx="2" ry="1" fill="#e07040" />
        <circle cx="8" cy="-4" r="1.2" fill="#333" />
        <circle cx="8.5" cy="-4.5" r="0.5" fill="white" />
        <path d="M-5,3 Q-9,1 -10,4" fill="none" stroke="#c07830" strokeWidth="1.5" strokeLinecap="round" />
        {/* Musical notes */}
        <g opacity="0.5">
          <text x="15" y="-10" fontSize="10" fill="#333">&#9834;</text>
          <text x="22" y="-18" fontSize="8" fill="#333">&#9835;</text>
        </g>
      </g>

      {/* Foreground grass tufts */}
      {[30, 80, 200, 400, 550, 650, 750].map((x, i) => (
        <g key={`ft10${i}`}>
          <path d={`M${x},600 Q${x - 3},${580 - (i % 3) * 4} ${x - 5},${575 - (i % 3) * 4}`} fill="none" stroke="#2a7a18" strokeWidth="2" />
          <path d={`M${x},600 Q${x + 4},${582 - (i % 2) * 6} ${x + 6},${576 - (i % 2) * 6}`} fill="none" stroke="#3a8a28" strokeWidth="2" />
        </g>
      ))}

      {/* "THE END" sparkle effect */}
      <g transform="translate(400, 550)" opacity="0.3">
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <line
            key={i}
            x1={15 * Math.cos((angle * Math.PI) / 180)}
            y1={15 * Math.sin((angle * Math.PI) / 180)}
            x2={22 * Math.cos((angle * Math.PI) / 180)}
            y2={22 * Math.sin((angle * Math.PI) / 180)}
            stroke="#fbbf24"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <animate attributeName="opacity" values="0.3;0.6;0.3" dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" />
          </line>
        ))}
      </g>
    </svg>
  );
}