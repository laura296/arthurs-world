const moods = {
  peaceful: {
    sky: ['#81d4fa', '#b3e5fc'],
    water: ['#4fc3f7', '#29b6f6'],
    bank: '#c8b078',
    foliage: '#66bb6a',
    foliageDark: '#388e3c',
  },
  tense: {
    sky: ['#4db6ac', '#80cbc4'],
    water: ['#00897b', '#00695c'],
    bank: '#a89868',
    foliage: '#2e7d32',
    foliageDark: '#1b5e20',
  },
  dramatic: {
    sky: ['#ff7043', '#ff8a65'],
    water: ['#455a64', '#37474f'],
    bank: '#8a7858',
    foliage: '#33691e',
    foliageDark: '#1a3a0e',
  },
  action: {
    sky: ['#ef5350', '#ff8a65'],
    water: ['#546e7a', '#455a64'],
    bank: '#9a8868',
    foliage: '#2e7d32',
    foliageDark: '#1b5e20',
  },
};

export default function RiverbankScene({
  mood = 'peaceful',
  waterLevel = 'calm',
  characters = [],
  transforms = {},
  className = '',
}) {
  const m = moods[mood] || moods.peaceful;
  const isSplashing = waterLevel === 'splashing';
  const isAction = mood === 'action';
  const isDramatic = mood === 'dramatic';

  return (
    <svg
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMax slice"
      className={`absolute inset-0 w-full h-full ${className}`}
    >
      <defs>
        <linearGradient id="rb-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={m.sky[0]} />
          <stop offset="100%" stopColor={m.sky[1]} />
        </linearGradient>
        <linearGradient id="rb-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={m.water[0]} />
          <stop offset="100%" stopColor={m.water[1]} />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="800" height="600" fill="url(#rb-sky)" />

      {/* Background tropical trees */}
      {[80, 200, 600, 720].map((x, i) => (
        <g key={i}>
          <path d={`M${x} 220 L${x - 2} 160 L${x + 2} 160Z`} fill="#6d4c2a" />
          <ellipse cx={x} cy="150" rx="30" ry="22" fill={m.foliageDark} opacity="0.6" />
          <ellipse cx={x - 8} cy="145" rx="20" ry="16" fill={m.foliage} opacity="0.5" />
        </g>
      ))}

      {/* Overhanging tropical plants — top frame */}
      <g>
        <path d="M0 0 C20 40, 60 80, 30 120 C10 90, -10 50, 0 0Z" fill={m.foliage} opacity="0.7" />
        <path d="M50 0 C70 50, 90 90, 60 130 C40 95, 30 50, 50 0Z" fill={m.foliageDark} opacity="0.5" />
        <path d="M750 0 C730 40, 710 90, 740 130 C760 90, 770 50, 750 0Z" fill={m.foliage} opacity="0.7" />
        <path d="M800 0 C780 50, 770 80, 790 110 C800 80, 810 40, 800 0Z" fill={m.foliageDark} opacity="0.5" />
      </g>

      {/* Left riverbank */}
      <path d="M0 280 C80 260, 160 270, 200 290 L200 600 L0 600Z" fill={m.bank} />
      <path d="M0 285 C70 268, 140 276, 190 292" fill="none" stroke={m.foliage} strokeWidth="3" opacity="0.4" />

      {/* Right riverbank */}
      <path d="M600 290 C640 270, 720 260, 800 280 L800 600 L600 600Z" fill={m.bank} />
      <path d="M610 292 C660 276, 730 268, 800 285" fill="none" stroke={m.foliage} strokeWidth="3" opacity="0.4" />

      {/* River — wide flowing water */}
      <path d="M200 280 C280 300, 400 310, 600 280 L600 600 L200 600Z" fill="url(#rb-water)" />

      {/* Water ripples */}
      {[260, 340, 420, 500, 560].map((x, i) => (
        <ellipse key={i} cx={x} cy={320 + i * 15} rx="30" ry="3" fill="white" opacity="0.15">
          <animate attributeName="rx" values="30;40;30" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.15;0.05;0.15" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
        </ellipse>
      ))}

      {/* Sparkle dots on water — peaceful only */}
      {mood === 'peaceful' && [280, 380, 480, 550].map((x, i) => (
        <circle key={i} cx={x} cy={310 + i * 12} r="2" fill="white" opacity="0.4">
          <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* Reeds on left bank */}
      {[30, 60, 90, 140, 175].map((x, i) => (
        <g key={i}>
          <path d={`M${x} 290 Q${x + 2} 250 ${x - 3} 220`} fill="none" stroke="#5a7a3a" strokeWidth="3" strokeLinecap="round">
            <animateTransform attributeName="transform" type="rotate" values={`0 ${x} 290;2 ${x} 290;0 ${x} 290;-2 ${x} 290;0 ${x} 290`} dur="3s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
          </path>
          {i % 2 === 0 && <ellipse cx={x - 2} cy="218" rx="4" ry="8" fill="#8d6e4a" opacity="0.6" />}
        </g>
      ))}

      {/* Reeds on right bank */}
      {[620, 660, 700, 740, 770].map((x, i) => (
        <g key={i}>
          <path d={`M${x} 290 Q${x - 2} 252 ${x + 3} 224`} fill="none" stroke="#5a7a3a" strokeWidth="3" strokeLinecap="round">
            <animateTransform attributeName="transform" type="rotate" values={`0 ${x} 290;-2 ${x} 290;0 ${x} 290;2 ${x} 290;0 ${x} 290`} dur="2.8s" begin={`${i * 0.35}s`} repeatCount="indefinite" />
          </path>
        </g>
      ))}

      {/* Lily pads */}
      {mood !== 'action' && (
        <g>
          <ellipse cx="320" cy="380" rx="18" ry="10" fill="#66bb6a" opacity="0.7" />
          <circle cx="326" cy="376" r="4" fill="#f48fb1" opacity="0.5" />
          <ellipse cx="470" cy="400" rx="15" ry="8" fill="#66bb6a" opacity="0.6" />
          <ellipse cx="380" cy="440" rx="12" ry="7" fill="#66bb6a" opacity="0.5" />
        </g>
      )}

      {/* Dragonflies — peaceful only */}
      {mood === 'peaceful' && (
        <g>
          <g>
            <circle cx="0" cy="0" r="2" fill="#81d4fa" />
            <line x1="-4" y1="-2" x2="4" y2="-2" stroke="#81d4fa" strokeWidth="0.8" opacity="0.6" />
            <animateMotion path="M250,260 C270,240 300,250 290,270 C280,280 260,275 250,260" dur="4s" repeatCount="indefinite" />
          </g>
          <g>
            <circle cx="0" cy="0" r="2" fill="#ce93d8" />
            <line x1="-4" y1="-2" x2="4" y2="-2" stroke="#ce93d8" strokeWidth="0.8" opacity="0.6" />
            <animateMotion path="M520,270 C540,250 560,260 550,280 C540,290 520,285 520,270" dur="5s" begin="1s" repeatCount="indefinite" />
          </g>
        </g>
      )}

      {/* Tense mood shadows */}
      {mood === 'tense' && (
        <g>
          <rect width="800" height="600" fill="#1a2a2a" opacity="0.15" />
        </g>
      )}

      {/* Dramatic splash particles */}
      {isDramatic && (
        <g>
          {[350, 400, 450].map((x, i) => (
            <g key={i}>
              <circle cx={x} cy={300 + i * 5} r="5" fill="white" opacity="0.4">
                <animate attributeName="cy" values={`${300 + i * 5};${260 + i * 5};${300 + i * 5}`} dur="0.8s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.4;0.1;0.4" dur="0.8s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
              </circle>
            </g>
          ))}
          {/* Impact star */}
          <path d="M400 310 L404 296 L408 310 L420 306 L410 314 L420 322 L408 318 L404 332 L400 318 L388 322 L398 314 L388 306Z" fill="#fff9c4" opacity="0.5">
            <animate attributeName="opacity" values="0.5;0.2;0.5" dur="0.6s" repeatCount="indefinite" />
          </path>
        </g>
      )}

      {/* Action splash effects */}
      {isAction && (
        <g>
          {[300, 370, 440, 510].map((x, i) => (
            <g key={i}>
              <path d={`M${x} 300 Q${x + 5} 280 ${x + 10} 300`} fill="none" stroke="white" strokeWidth="2" opacity="0.5">
                <animate attributeName="opacity" values="0.5;0;0.5" dur={`${0.5 + i * 0.1}s`} repeatCount="indefinite" />
              </path>
              <circle cx={x + 5} cy={285} r="3" fill="white" opacity="0.3">
                <animate attributeName="cy" values="285;265;285" dur={`${0.6 + i * 0.1}s`} repeatCount="indefinite" />
              </circle>
            </g>
          ))}
          {/* Effort lines */}
          <g stroke="#ff8a65" strokeWidth="2" strokeLinecap="round" opacity="0.4">
            <line x1="350" y1="260" x2="340" y2="250" />
            <line x1="380" y1="255" x2="380" y2="242" />
            <line x1="420" y1="258" x2="430" y2="248" />
          </g>
        </g>
      )}

      {/* Extra splash when waterLevel is splashing */}
      {isSplashing && (
        <g>
          {[320, 380, 440, 500].map((x, i) => (
            <circle key={i} cx={x} cy={290} r={4 + i} fill="white" opacity="0.3">
              <animate attributeName="cy" values="290;260;290" dur={`${0.4 + i * 0.1}s`} begin={`${i * 0.15}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;0;0.3" dur={`${0.4 + i * 0.1}s`} begin={`${i * 0.15}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </g>
      )}

      {/* Foreground grass on banks */}
      <path d="M0 500 C60 480, 120 490, 200 510 L200 600 L0 600Z" fill={m.foliage} opacity="0.6" />
      <path d="M600 510 C680 490, 740 480, 800 500 L800 600 L600 600Z" fill={m.foliage} opacity="0.6" />

      {/* Characters */}
      {characters.map((char, i) => {
        const Comp = char.component;
        return (
          <foreignObject key={i} x={char.x} y={char.y} width={char.size} height={char.size}>
            <div xmlns="http://www.w3.org/1999/xhtml">
              <Comp size={char.size} {...(char.props || {})} />
            </div>
          </foreignObject>
        );
      })}
    </svg>
  );
}
