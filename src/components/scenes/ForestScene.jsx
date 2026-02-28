/**
 * Rich enchanted forest scene — tall layered trees, dappled sunlight,
 * winding path, mushrooms, ferns, and wildflowers.
 * Warm storybook palette inspired by Julia Donaldson / Gruffalo illustrations.
 */
export default function ForestScene({ className = '' }) {
  return (
    <svg viewBox="0 0 800 600" className={`absolute inset-0 w-full h-full ${className}`} preserveAspectRatio="xMidYMax slice">
      <defs>
        {/* Sky peeking through canopy */}
        <linearGradient id="forestSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a8d8ea" />
          <stop offset="40%" stopColor="#88c4a8" />
          <stop offset="100%" stopColor="#4a7c59" />
        </linearGradient>

        {/* Sunbeam gradient for light rays */}
        <linearGradient id="forestSunbeam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffe680" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ffe680" stopOpacity="0" />
        </linearGradient>

        {/* Bark texture gradient */}
        <linearGradient id="forestBarkOak" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5c3d2e" />
          <stop offset="50%" stopColor="#6b4830" />
          <stop offset="100%" stopColor="#4e3322" />
        </linearGradient>
        <linearGradient id="forestBarkBirch" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#d8d0c0" />
          <stop offset="50%" stopColor="#e8e0d0" />
          <stop offset="100%" stopColor="#c8c0b0" />
        </linearGradient>
        <linearGradient id="forestBarkPine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3d2b1a" />
          <stop offset="50%" stopColor="#4a3420" />
          <stop offset="100%" stopColor="#332210" />
        </linearGradient>

        {/* Ground gradient */}
        <linearGradient id="forestFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a5a2a" />
          <stop offset="100%" stopColor="#2e4a20" />
        </linearGradient>

        {/* Path gradient */}
        <linearGradient id="forestPath" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c4a265" />
          <stop offset="100%" stopColor="#a88845" />
        </linearGradient>

        {/* Canopy dapple pattern — radial patches of light */}
        <radialGradient id="forestDapple" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffe680" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#ffe680" stopOpacity="0" />
        </radialGradient>

        {/* Mushroom cap gradients */}
        <radialGradient id="forestMushroomRed" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#e04040" />
          <stop offset="100%" stopColor="#b02020" />
        </radialGradient>
        <radialGradient id="forestMushroomBrown" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#a07040" />
          <stop offset="100%" stopColor="#6b4a28" />
        </radialGradient>
      </defs>

      {/* ── Sky visible through canopy ── */}
      <rect width="800" height="600" fill="url(#forestSky)" />

      {/* ── Distant tree layer (far background) ── */}
      <g opacity="0.5">
        {/* Far pine silhouettes */}
        <path d="M-10 280 L20 120 L50 280 Z" fill="#2a4a28" />
        <path d="M60 290 L85 150 L110 290 Z" fill="#264822" />
        <path d="M130 275 L160 100 L190 275 Z" fill="#2a4a28" />
        <path d="M210 285 L240 130 L270 285 Z" fill="#224020" />
        <path d="M300 270 L335 90 L370 270 Z" fill="#2a4a28" />
        <path d="M390 280 L415 140 L440 280 Z" fill="#264822" />
        <path d="M460 275 L495 110 L530 275 Z" fill="#2a4a28" />
        <path d="M550 285 L580 135 L610 285 Z" fill="#224020" />
        <path d="M630 270 L665 95 L700 270 Z" fill="#2a4a28" />
        <path d="M720 280 L750 145 L780 280 Z" fill="#264822" />
        <path d="M770 275 L800 120 L830 275 Z" fill="#2a4a28" />
      </g>

      {/* ── Mid-distance tree layer ── */}
      <g opacity="0.65">
        <path d="M30 310 L55 160 L80 310 Z" fill="#1e4020" />
        <path d="M35 280 L55 130 L75 280 Z" fill="#2a5028" />
        <path d="M160 300 L195 110 L230 300 Z" fill="#1e4020" />
        <path d="M168 260 L195 80 L222 260 Z" fill="#2a5028" />
        <path d="M370 310 L400 130 L430 310 Z" fill="#1e4020" />
        <path d="M378 270 L400 100 L422 270 Z" fill="#2a5028" />
        <path d="M560 305 L590 120 L620 305 Z" fill="#1e4020" />
        <path d="M568 265 L590 90 L612 265 Z" fill="#2a5028" />
        <path d="M710 310 L740 155 L770 310 Z" fill="#1e4020" />
      </g>

      {/* ── Sunlight beams filtering through canopy ── */}
      <g>
        <polygon points="180,0 220,600 140,600" fill="url(#forestSunbeam)" opacity="0.7">
          <animate attributeName="opacity" values="0.7;0.4;0.7" dur="6s" repeatCount="indefinite" />
        </polygon>
        <polygon points="420,0 470,600 380,600" fill="url(#forestSunbeam)" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.3;0.5" dur="7s" repeatCount="indefinite" />
        </polygon>
        <polygon points="620,0 670,600 580,600" fill="url(#forestSunbeam)" opacity="0.6">
          <animate attributeName="opacity" values="0.6;0.35;0.6" dur="5.5s" repeatCount="indefinite" />
        </polygon>
        <polygon points="50,0 80,400 20,400" fill="url(#forestSunbeam)" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.15;0.3" dur="8s" repeatCount="indefinite" />
        </polygon>
        <polygon points="750,0 790,500 720,500" fill="url(#forestSunbeam)" opacity="0.4">
          <animate attributeName="opacity" values="0.4;0.2;0.4" dur="6.5s" repeatCount="indefinite" />
        </polygon>
      </g>

      {/* ── Forest floor base ── */}
      <path d="M0 420 Q100 400 200 415 Q400 395 600 410 Q700 400 800 420 L800 600 L0 600 Z" fill="url(#forestFloor)" />
      {/* Mossy layer */}
      <path d="M0 440 Q150 425 300 438 Q500 420 700 435 Q760 428 800 442 L800 600 L0 600 Z" fill="#2e4a20" />
      {/* Dark loam */}
      <path d="M0 470 Q200 458 400 468 Q600 455 800 470 L800 600 L0 600 Z" fill="#263e18" />

      {/* ── Winding path ── */}
      <path
        d="M350 600 Q330 570 340 540 Q360 510 345 480 Q320 450 340 425 Q370 400 355 370 Q330 340 350 310"
        fill="none"
        stroke="url(#forestPath)"
        strokeWidth="40"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      />
      {/* Path edge highlights */}
      <path
        d="M350 600 Q330 570 340 540 Q360 510 345 480 Q320 450 340 425 Q370 400 355 370 Q330 340 350 310"
        fill="none"
        stroke="#8a6830"
        strokeWidth="44"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.25"
      />
      {/* Pebbles on path */}
      <g fill="#b09060" opacity="0.5">
        <ellipse cx="340" cy="580" rx="4" ry="3" />
        <ellipse cx="355" cy="560" rx="3" ry="2" />
        <ellipse cx="338" cy="535" rx="3.5" ry="2.5" />
        <ellipse cx="350" cy="510" rx="3" ry="2" />
        <ellipse cx="342" cy="485" rx="4" ry="2.5" />
        <ellipse cx="335" cy="455" rx="3" ry="2" />
        <ellipse cx="348" cy="430" rx="3.5" ry="2" />
        <ellipse cx="358" cy="400" rx="3" ry="2" />
        <ellipse cx="350" cy="375" rx="2.5" ry="2" />
        <ellipse cx="340" cy="345" rx="3" ry="2" />
      </g>

      {/* ── Left large oak tree ── */}
      <g>
        {/* Trunk */}
        <path d="M80 600 Q70 500 75 420 Q80 350 85 300 L115 300 Q120 350 125 420 Q130 500 120 600 Z" fill="url(#forestBarkOak)" />
        {/* Bark detail lines */}
        <g stroke="#4a2e18" strokeWidth="1.5" opacity="0.4">
          <path d="M88 580 Q86 520 90 460" fill="none" />
          <path d="M100 590 Q98 510 102 430" fill="none" />
          <path d="M112 585 Q110 500 108 420" fill="none" />
        </g>
        {/* Roots */}
        <path d="M75 600 Q50 580 30 590 Q55 570 75 560" fill="#5c3d2e" opacity="0.7" />
        <path d="M120 600 Q145 580 160 595 Q140 575 120 560" fill="#5c3d2e" opacity="0.7" />
        {/* Major branches */}
        <path d="M85 300 Q50 260 20 220 Q15 215 10 210" fill="none" stroke="#5c3d2e" strokeWidth="12" strokeLinecap="round" />
        <path d="M95 310 Q60 270 40 250" fill="none" stroke="#5c3d2e" strokeWidth="8" strokeLinecap="round" />
        <path d="M115 300 Q150 250 180 210" fill="none" stroke="#5c3d2e" strokeWidth="10" strokeLinecap="round" />
        <path d="M110 320 Q145 280 170 260" fill="none" stroke="#5c3d2e" strokeWidth="7" strokeLinecap="round" />
        {/* Oak canopy — layered organic blobs */}
        <g>
          <path d="M-20 230 Q0 180 50 170 Q80 160 110 175 Q150 160 180 180 Q210 200 200 230 Q190 260 150 265 Q100 280 50 270 Q10 260 -20 230 Z" fill="#2a6630">
            <animate attributeName="d" values="M-20 230 Q0 180 50 170 Q80 160 110 175 Q150 160 180 180 Q210 200 200 230 Q190 260 150 265 Q100 280 50 270 Q10 260 -20 230 Z;M-18 228 Q2 178 52 168 Q82 162 112 177 Q148 158 178 178 Q208 198 198 232 Q188 262 148 267 Q98 278 48 268 Q12 258 -18 228 Z;M-20 230 Q0 180 50 170 Q80 160 110 175 Q150 160 180 180 Q210 200 200 230 Q190 260 150 265 Q100 280 50 270 Q10 260 -20 230 Z" dur="5s" repeatCount="indefinite" />
          </path>
          <path d="M-10 210 Q20 165 60 155 Q100 145 130 165 Q160 155 185 175 Q200 195 190 220 Q170 245 130 250 Q80 260 40 245 Q5 235 -10 210 Z" fill="#347a38" />
          <path d="M10 195 Q40 158 80 150 Q110 145 135 160 Q165 152 180 168 Q192 185 182 205 Q165 230 125 235 Q80 242 50 225 Q20 215 10 195 Z" fill="#3d8a40" />
          {/* Dappled light spots on canopy */}
          <circle cx="60" cy="190" r="12" fill="#4da050" opacity="0.5" />
          <circle cx="120" cy="180" r="10" fill="#4da050" opacity="0.4" />
          <circle cx="40" cy="215" r="8" fill="#4da050" opacity="0.3" />
        </g>
      </g>

      {/* ── Right tall pine tree ── */}
      <g>
        {/* Trunk */}
        <rect x="670" y="240" width="18" height="360" rx="3" fill="url(#forestBarkPine)" />
        {/* Pine layers — triangular with organic wobble */}
        <path d="M679 260 L630 330 Q650 325 660 330 L620 380 Q645 372 658 378 L610 430 Q640 420 665 425 L679 425 L693 425 Q718 420 748 430 L700 378 Q713 372 735 380 L698 330 Q708 325 728 330 Z" fill="#1e5028">
          <animate attributeName="d" values="M679 260 L630 330 Q650 325 660 330 L620 380 Q645 372 658 378 L610 430 Q640 420 665 425 L679 425 L693 425 Q718 420 748 430 L700 378 Q713 372 735 380 L698 330 Q708 325 728 330 Z;M679 258 L632 328 Q652 323 662 328 L622 378 Q647 370 660 376 L612 428 Q642 418 667 423 L679 423 L691 423 Q716 418 746 428 L698 376 Q711 370 733 378 L696 328 Q706 323 726 328 Z;M679 260 L630 330 Q650 325 660 330 L620 380 Q645 372 658 378 L610 430 Q640 420 665 425 L679 425 L693 425 Q718 420 748 430 L700 378 Q713 372 735 380 L698 330 Q708 325 728 330 Z" dur="4.5s" repeatCount="indefinite" />
        </path>
        {/* Lighter pine highlight layer */}
        <path d="M679 275 L645 330 Q660 326 668 330 L638 372 Q655 366 665 370 L635 415 Q658 408 670 412 L679 412 L688 412 Q700 408 723 415 L693 370 Q703 366 720 372 L690 330 Q698 326 713 330 Z" fill="#2a6832" />
      </g>

      {/* ── Centre birch tree (slender, white bark) ── */}
      <g>
        {/* Trunk */}
        <path d="M430 600 Q428 520 432 450 Q430 380 434 320 L446 320 Q448 380 445 450 Q448 520 446 600 Z" fill="url(#forestBarkBirch)" />
        {/* Birch bark marks */}
        <g fill="#555" opacity="0.35">
          <ellipse cx="438" cy="580" rx="5" ry="2" />
          <ellipse cx="440" cy="540" rx="6" ry="2.5" />
          <ellipse cx="437" cy="500" rx="4" ry="2" />
          <ellipse cx="439" cy="460" rx="5.5" ry="2" />
          <ellipse cx="441" cy="420" rx="4" ry="1.5" />
          <ellipse cx="438" cy="380" rx="5" ry="2" />
          <ellipse cx="440" cy="350" rx="4.5" ry="1.5" />
        </g>
        {/* Birch branches */}
        <path d="M434 330 Q410 300 385 280" fill="none" stroke="#c8c0b0" strokeWidth="4" strokeLinecap="round" />
        <path d="M446 325 Q470 295 495 275" fill="none" stroke="#c8c0b0" strokeWidth="4" strokeLinecap="round" />
        <path d="M436 350 Q415 325 400 310" fill="none" stroke="#c8c0b0" strokeWidth="3" strokeLinecap="round" />
        <path d="M444 345 Q465 320 480 305" fill="none" stroke="#c8c0b0" strokeWidth="3" strokeLinecap="round" />
        {/* Birch leaf clusters */}
        <g>
          <ellipse cx="380" cy="270" rx="25" ry="18" fill="#5ca050">
            <animate attributeName="rx" values="25;27;25" dur="4s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="400" cy="260" rx="20" ry="15" fill="#6ab858" />
          <ellipse cx="500" cy="268" rx="22" ry="16" fill="#5ca050">
            <animate attributeName="rx" values="22;24;22" dur="3.5s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="485" cy="258" rx="18" ry="14" fill="#6ab858" />
          <ellipse cx="395" cy="300" rx="18" ry="12" fill="#4e9045" />
          <ellipse cx="475" cy="298" rx="16" ry="11" fill="#4e9045" />
          {/* Light dapples on birch leaves */}
          <circle cx="390" cy="265" r="6" fill="#7cc868" opacity="0.5" />
          <circle cx="495" cy="262" r="5" fill="#7cc868" opacity="0.4" />
        </g>
      </g>

      {/* ── Smaller background trees filling gaps ── */}
      {/* Left mid pine */}
      <g opacity="0.75">
        <rect x="235" y="310" width="12" height="290" rx="2" fill="#4a3420" />
        <path d="M241 320 L210 370 Q225 366 233 370 L200 410 Q220 404 237 408 L241 408 L245 408 Q258 404 278 410 L249 370 Q257 366 272 370 Z" fill="#1e5028" />
        <path d="M241 330 L218 368 Q230 364 238 368 L215 400 Q230 395 240 398 L242 398 Q252 395 267 400 L248 368 Q256 364 264 368 Z" fill="#2a6832" />
      </g>
      {/* Right background broadleaf */}
      <g opacity="0.7">
        <rect x="570" y="350" width="10" height="250" rx="2" fill="#5c3d2e" />
        <ellipse cx="575" cy="335" rx="28" ry="22" fill="#2a6630" />
        <ellipse cx="575" cy="325" rx="22" ry="18" fill="#347a38" />
        <circle cx="580" cy="322" r="6" fill="#4da050" opacity="0.4" />
      </g>

      {/* ── Ferns on forest floor ── */}
      <g>
        {/* Left fern cluster */}
        <path d="M50 480 Q40 460 35 445 Q30 440 28 435" fill="none" stroke="#3a7a30" strokeWidth="3" strokeLinecap="round">
          <animate attributeName="d" values="M50 480 Q40 460 35 445 Q30 440 28 435;M50 480 Q42 460 38 445 Q34 440 33 435;M50 480 Q40 460 35 445 Q30 440 28 435" dur="3.5s" repeatCount="indefinite" />
        </path>
        <path d="M55 478 Q50 455 52 440" fill="none" stroke="#4a8a3a" strokeWidth="2.5" strokeLinecap="round">
          <animate attributeName="d" values="M55 478 Q50 455 52 440;M55 478 Q52 455 55 440;M55 478 Q50 455 52 440" dur="4s" repeatCount="indefinite" />
        </path>
        <path d="M58 482 Q68 462 72 448" fill="none" stroke="#3a7a30" strokeWidth="2.5" strokeLinecap="round">
          <animate attributeName="d" values="M58 482 Q68 462 72 448;M58 482 Q66 462 68 448;M58 482 Q68 462 72 448" dur="3s" repeatCount="indefinite" />
        </path>
        {/* Fern frond details (small leaflets) */}
        <g stroke="#4a8a3a" strokeWidth="1.5" fill="none" opacity="0.6">
          <path d="M40 458 Q35 455 32 450" />
          <path d="M42 452 Q38 448 35 442" />
          <path d="M55 460 Q60 456 63 450" />
          <path d="M52 453 Q56 448 58 442" />
        </g>

        {/* Right fern cluster */}
        <path d="M720 475 Q710 455 705 440" fill="none" stroke="#3a7a30" strokeWidth="3" strokeLinecap="round">
          <animate attributeName="d" values="M720 475 Q710 455 705 440;M720 475 Q712 455 708 440;M720 475 Q710 455 705 440" dur="3.8s" repeatCount="indefinite" />
        </path>
        <path d="M726 478 Q736 458 740 442" fill="none" stroke="#4a8a3a" strokeWidth="2.5" strokeLinecap="round">
          <animate attributeName="d" values="M726 478 Q736 458 740 442;M726 478 Q734 458 736 442;M726 478 Q736 458 740 442" dur="4.2s" repeatCount="indefinite" />
        </path>

        {/* Path-side fern */}
        <path d="M310 465 Q298 445 292 430" fill="none" stroke="#3a7a30" strokeWidth="2.5" strokeLinecap="round">
          <animate attributeName="d" values="M310 465 Q298 445 292 430;M310 465 Q300 445 296 430;M310 465 Q298 445 292 430" dur="3.2s" repeatCount="indefinite" />
        </path>
        <path d="M315 468 Q325 450 330 435" fill="none" stroke="#4a8a3a" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* ── Mushrooms ── */}
      <g>
        {/* Red spotted toadstool (left of path) */}
        <rect x="270" cy="490" y="482" width="6" height="14" rx="2" fill="#e8dcc0" />
        <ellipse cx="273" cy="482" rx="12" ry="8" fill="url(#forestMushroomRed)" />
        <circle cx="268" cy="480" r="2" fill="white" opacity="0.7" />
        <circle cx="276" cy="478" r="1.5" fill="white" opacity="0.7" />
        <circle cx="272" cy="476" r="1.5" fill="white" opacity="0.6" />

        {/* Brown mushroom cluster (right of path) */}
        <rect x="396" y="488" width="4" height="10" rx="1.5" fill="#d8c8a0" />
        <ellipse cx="398" cy="488" rx="8" ry="5.5" fill="url(#forestMushroomBrown)" />
        <rect x="406" y="491" width="3.5" height="8" rx="1.5" fill="#d8c8a0" />
        <ellipse cx="407.5" cy="491" rx="6.5" ry="4.5" fill="#8a6038" />

        {/* Small mushroom near right fern */}
        <rect x="735" y="486" width="3" height="8" rx="1" fill="#e8dcc0" />
        <ellipse cx="736.5" cy="486" rx="6" ry="4" fill="url(#forestMushroomRed)" />
        <circle cx="734" cy="484" r="1.2" fill="white" opacity="0.6" />
        <circle cx="738" cy="483" r="1" fill="white" opacity="0.6" />

        {/* Tiny brown mushroom pair */}
        <rect x="155" y="490" width="3" height="7" rx="1" fill="#d8c8a0" />
        <ellipse cx="156.5" cy="490" rx="5" ry="3.5" fill="#8a6838" />
        <rect x="163" y="492" width="2.5" height="6" rx="1" fill="#d8c8a0" />
        <ellipse cx="164" cy="492" rx="4.5" ry="3" fill="#7a5a30" />
      </g>

      {/* ── Wildflowers ── */}
      <g>
        {/* Bluebells */}
        <g>
          <path d="M180 475 Q178 468 180 462" fill="none" stroke="#4a8a3a" strokeWidth="1.5" />
          <ellipse cx="180" cy="460" rx="3" ry="4" fill="#6688cc" />
          <path d="M190 478 Q188 470 190 464" fill="none" stroke="#4a8a3a" strokeWidth="1.5" />
          <ellipse cx="190" cy="462" rx="2.5" ry="3.5" fill="#7799dd" />
          <path d="M186 476 Q184 467 186 460" fill="none" stroke="#4a8a3a" strokeWidth="1.5" />
          <ellipse cx="186" cy="458" rx="2.8" ry="3.8" fill="#5577bb" />
        </g>

        {/* Yellow wildflowers */}
        <g>
          <path d="M480 473 Q479 466 480 460" fill="none" stroke="#4a8a3a" strokeWidth="1.5" />
          <circle cx="480" cy="458" r="3.5" fill="#ffdd44" />
          <circle cx="480" cy="458" r="1.5" fill="#cc9900" />
          <path d="M490 476 Q489 468 490 462" fill="none" stroke="#4a8a3a" strokeWidth="1.5" />
          <circle cx="490" cy="460" r="3" fill="#ffcc33" />
          <circle cx="490" cy="460" r="1.2" fill="#cc9900" />
        </g>

        {/* Pink wildflowers */}
        <g>
          <path d="M620 478 Q619 470 620 463" fill="none" stroke="#4a8a3a" strokeWidth="1.5" />
          <circle cx="620" cy="461" r="3.5" fill="#ee88aa" />
          <circle cx="620" cy="461" r="1.5" fill="#cc5577" />
          <path d="M630 480 Q629 473 630 467" fill="none" stroke="#4a8a3a" strokeWidth="1.5" />
          <circle cx="630" cy="465" r="2.8" fill="#ff99bb" />
          <circle cx="630" cy="465" r="1.2" fill="#cc5577" />
        </g>

        {/* White wood anemones */}
        <g opacity="0.85">
          <path d="M520 480 Q519 474 520 468" fill="none" stroke="#5a9a4a" strokeWidth="1.2" />
          <circle cx="520" cy="466" r="3" fill="#f0eee8" />
          <circle cx="520" cy="466" r="1" fill="#eedd44" />
          <path d="M528 482 Q527 476 528 470" fill="none" stroke="#5a9a4a" strokeWidth="1.2" />
          <circle cx="528" cy="468" r="2.5" fill="#f0eee8" />
          <circle cx="528" cy="468" r="0.8" fill="#eedd44" />
        </g>
      </g>

      {/* ── Fallen leaves and ground detail ── */}
      <g opacity="0.4">
        <ellipse cx="140" cy="498" rx="5" ry="2.5" fill="#8a6020" transform="rotate(-15 140 498)" />
        <ellipse cx="460" cy="495" rx="4" ry="2" fill="#7a5518" transform="rotate(10 460 495)" />
        <ellipse cx="600" cy="492" rx="5" ry="2.5" fill="#9a7028" transform="rotate(-8 600 492)" />
        <ellipse cx="230" cy="500" rx="4.5" ry="2" fill="#6a4a15" transform="rotate(20 230 500)" />
        <ellipse cx="680" cy="497" rx="4" ry="2" fill="#8a6520" transform="rotate(-25 680 497)" />
      </g>

      {/* ── Moss patches ── */}
      <g opacity="0.35">
        <ellipse cx="90" cy="510" rx="18" ry="5" fill="#5a9a40" />
        <ellipse cx="650" cy="505" rx="15" ry="4" fill="#4a8a35" />
        <ellipse cx="500" cy="515" rx="12" ry="3.5" fill="#5a9a40" />
      </g>

      {/* ── Overhanging canopy at top (darkens upper region) ── */}
      <g>
        {/* Dense leaf canopy across the top */}
        <path d="M0 0 L800 0 L800 160 Q700 180 600 150 Q500 130 400 160 Q300 180 200 140 Q100 120 0 155 Z" fill="#1a4020" opacity="0.65" />
        <path d="M0 0 L800 0 L800 120 Q680 150 550 120 Q420 90 300 130 Q180 155 80 110 Q30 95 0 120 Z" fill="#143518" opacity="0.5" />
        {/* Hanging leaf edges (organic scallop) */}
        <path d="M0 155 Q30 140 60 155 Q90 170 120 150 Q150 130 180 148 Q210 165 240 145 Q270 125 300 150 Q330 175 360 148 Q390 122 420 152 Q450 178 480 150 Q510 125 540 155 Q570 180 600 148 Q630 120 660 155 Q690 182 720 152 Q750 128 780 158 Q800 170 800 160" fill="none" stroke="#1e4a22" strokeWidth="6" opacity="0.45" />
      </g>

      {/* ── Dappled light spots on forest floor ── */}
      {[
        [120, 460, 18], [250, 470, 14], [420, 455, 16], [530, 465, 12],
        [650, 458, 15], [180, 490, 10], [380, 480, 11], [580, 485, 13],
        [300, 510, 9], [700, 490, 11],
      ].map(([x, y, r], i) => (
        <circle key={`dap-${i}`} cx={x} cy={y} r={r} fill="url(#forestDapple)">
          <animate
            attributeName="opacity"
            values={`${0.5 + (i % 3) * 0.15};${0.25 + (i % 3) * 0.1};${0.5 + (i % 3) * 0.15}`}
            dur={`${4 + (i % 4) * 1.2}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}

      {/* ── Floating dust motes / pollen in sunbeams ── */}
      {[
        [175, 200, 1.5], [185, 350, 1.2], [195, 280, 1],
        [425, 250, 1.5], [435, 380, 1.2], [415, 310, 1],
        [625, 220, 1.3], [615, 340, 1], [635, 280, 1.2],
      ].map(([x, y, r], i) => (
        <circle key={`mote-${i}`} cx={x} cy={y} r={r} fill="#ffe880" opacity="0.4">
          <animate attributeName="cy" values={`${y};${y - 25};${y}`} dur={`${3 + i * 0.6}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0.15;0.4" dur={`${3 + i * 0.6}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* ── Tiny foreground grass tufts ── */}
      <g stroke="#2d6a22" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6">
        <path d="M20 510 Q22 498 18 488" />
        <path d="M25 510 Q28 496 30 486" />
        <path d="M460 505 Q462 493 458 482" />
        <path d="M465 505 Q468 492 472 484" />
        <path d="M750 508 Q752 496 748 486" />
        <path d="M755 508 Q758 494 762 485" />
        <path d="M200 512 Q202 500 198 490" />
        <path d="M560 510 Q562 498 558 488" />
        <path d="M565 510 Q568 496 572 487" />
      </g>
    </svg>
  );
}
