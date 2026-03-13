import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import TiltCard from '../components/TiltCard';
import DisneyForestScene from '../components/backgrounds/DisneyForestScene';
import { playNavigate } from '../hooks/useSound';
import { SECTION_THEMES } from '../data/sectionThemes';

/* ── Inline SVG character illustrations for each subsection card ── */

function PrincessIllustration() {
  return (
    <svg viewBox="0 0 120 140" className="w-full h-full" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }}>
      {/* Tiara */}
      <path d="M42 38 L48 24 L52 32 L56 20 L60 32 L64 18 L68 32 L72 24 L78 38" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="56" cy="20" r="2.5" fill="#f472b6" />
      <circle cx="64" cy="18" r="2.5" fill="#c084fc" />
      <circle cx="48" cy="24" r="2" fill="#38bdf8" />
      <circle cx="72" cy="24" r="2" fill="#38bdf8" />
      {/* Hair */}
      <path d="M40 42 C38 55, 34 75, 38 90 Q42 82, 46 78 L46 50 Z" fill="#fbbf24" opacity="0.9" />
      <path d="M80 42 C82 55, 86 75, 82 90 Q78 82, 74 78 L74 50 Z" fill="#fbbf24" opacity="0.9" />
      {/* Face */}
      <ellipse cx="60" cy="52" rx="16" ry="18" fill="#fce4b8" />
      {/* Eyes */}
      <ellipse cx="53" cy="50" rx="3" ry="3.5" fill="#6366f1" />
      <ellipse cx="67" cy="50" rx="3" ry="3.5" fill="#6366f1" />
      <circle cx="52" cy="49" r="1" fill="white" />
      <circle cx="66" cy="49" r="1" fill="white" />
      {/* Blush & smile */}
      <ellipse cx="50" cy="56" rx="3" ry="1.5" fill="#f9a8d4" opacity="0.5" />
      <ellipse cx="70" cy="56" rx="3" ry="1.5" fill="#f9a8d4" opacity="0.5" />
      <path d="M55 58 Q60 63, 65 58" fill="none" stroke="#e879a0" strokeWidth="1.5" strokeLinecap="round" />
      {/* Gown */}
      <path d="M46 70 L42 72 Q30 100, 24 130 L96 130 Q90 100, 78 72 L74 70 Q60 76, 46 70 Z" fill="url(#princessGown)" />
      <path d="M46 70 Q60 76, 74 70" fill="none" stroke="#d8b4fe" strokeWidth="1" opacity="0.6" />
      {/* Sparkles on gown */}
      <circle cx="40" cy="110" r="1.5" fill="white" opacity="0.7" />
      <circle cx="55" cy="95" r="1" fill="white" opacity="0.6" />
      <circle cx="75" cy="105" r="1.5" fill="white" opacity="0.7" />
      <circle cx="65" cy="118" r="1" fill="white" opacity="0.5" />
      <circle cx="45" cy="122" r="1" fill="white" opacity="0.6" />
      {/* Glass slipper peek */}
      <ellipse cx="38" cy="132" rx="8" ry="3" fill="#bfdbfe" opacity="0.7" />
      <defs>
        <linearGradient id="princessGown" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function VillainIllustration() {
  return (
    <svg viewBox="0 0 120 140" className="w-full h-full" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))' }}>
      {/* Hat */}
      <path d="M30 50 L60 8 L90 50 Z" fill="#1e1b4b" stroke="#7c3aed" strokeWidth="1" />
      <path d="M35 50 L60 14 L85 50" fill="none" stroke="#a855f7" strokeWidth="0.5" opacity="0.5" />
      {/* Feather */}
      <path d="M70 22 Q85 18, 92 28 Q86 24, 78 28 Q88 30, 90 38" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
      {/* Face */}
      <ellipse cx="60" cy="62" rx="18" ry="16" fill="#d1d5db" />
      {/* Evil eyes */}
      <path d="M48 58 L52 55 L56 58" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
      <path d="M64 58 L68 55 L72 58" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
      <circle cx="52" cy="59" r="2" fill="#dc2626" />
      <circle cx="68" cy="59" r="2" fill="#dc2626" />
      {/* Sinister grin */}
      <path d="M50 68 Q55 75, 60 72 Q65 75, 70 68" fill="none" stroke="#4c1d95" strokeWidth="2" strokeLinecap="round" />
      {/* Curly mustache */}
      <path d="M52 66 Q48 70, 42 68" fill="none" stroke="#1e1b4b" strokeWidth="2" strokeLinecap="round" />
      <path d="M68 66 Q72 70, 78 68" fill="none" stroke="#1e1b4b" strokeWidth="2" strokeLinecap="round" />
      {/* Cape / coat */}
      <path d="M40 78 L32 130 L60 125 L88 130 L80 78 Q60 85, 40 78 Z" fill="url(#villainCape)" />
      {/* Hook hand */}
      <path d="M86 95 L94 98 Q100 102, 96 108 Q92 112, 88 108" fill="none" stroke="#d4d4d8" strokeWidth="3" strokeLinecap="round" />
      <circle cx="86" cy="95" r="3" fill="#a1a1aa" />
      {/* Skull emblem */}
      <circle cx="60" cy="88" r="5" fill="none" stroke="#a855f7" strokeWidth="1.5" />
      <circle cx="58" cy="87" r="1" fill="#a855f7" />
      <circle cx="62" cy="87" r="1" fill="#a855f7" />
      <path d="M58 90 L62 90" stroke="#a855f7" strokeWidth="1" />
      <defs>
        <linearGradient id="villainCape" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#581c87" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function PoohIllustration() {
  return (
    <svg viewBox="0 0 120 140" className="w-full h-full" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.25))' }}>
      {/* Ears */}
      <circle cx="40" cy="30" r="12" fill="#f59e0b" />
      <circle cx="40" cy="30" r="7" fill="#d97706" />
      <circle cx="80" cy="30" r="12" fill="#f59e0b" />
      <circle cx="80" cy="30" r="7" fill="#d97706" />
      {/* Head */}
      <ellipse cx="60" cy="48" rx="24" ry="22" fill="#f59e0b" />
      {/* Face patch */}
      <ellipse cx="60" cy="52" rx="16" ry="14" fill="#fbbf24" />
      {/* Eyes — closed/happy */}
      <path d="M50 46 Q52 42, 54 46" fill="none" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
      <path d="M66 46 Q68 42, 70 46" fill="none" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
      {/* Nose */}
      <ellipse cx="60" cy="52" rx="4" ry="3" fill="#78350f" />
      {/* Smile */}
      <path d="M52 56 Q60 64, 68 56" fill="none" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" />
      {/* Body (red shirt) */}
      <ellipse cx="60" cy="90" rx="28" ry="30" fill="#f59e0b" />
      <path d="M36 78 Q36 72, 42 70 L78 70 Q84 72, 84 78 L84 100 Q84 110, 60 112 Q36 110, 36 100 Z" fill="#dc2626" />
      {/* Shirt collar */}
      <path d="M42 70 Q60 74, 78 70" fill="none" stroke="#b91c1c" strokeWidth="1" />
      {/* Arms */}
      <ellipse cx="30" cy="88" rx="8" ry="14" fill="#f59e0b" transform="rotate(-15 30 88)" />
      <ellipse cx="90" cy="88" rx="8" ry="14" fill="#f59e0b" transform="rotate(15 90 88)" />
      {/* Feet */}
      <ellipse cx="46" cy="118" rx="10" ry="6" fill="#f59e0b" />
      <ellipse cx="74" cy="118" rx="10" ry="6" fill="#f59e0b" />
      {/* Honey pot */}
      <ellipse cx="94" cy="110" rx="14" ry="12" fill="#92400e" />
      <ellipse cx="94" cy="104" rx="14" ry="4" fill="#78350f" />
      <text x="88" y="114" fontSize="8" fill="#fbbf24" fontWeight="bold">Hunny</text>
      {/* Honey drip */}
      <path d="M86 104 Q84 108, 86 112" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
      {/* Cheek blush */}
      <ellipse cx="48" cy="54" rx="4" ry="2" fill="#fca5a5" opacity="0.4" />
      <ellipse cx="72" cy="54" rx="4" ry="2" fill="#fca5a5" opacity="0.4" />
    </svg>
  );
}

function PuppyIllustration() {
  return (
    <svg viewBox="0 0 120 140" className="w-full h-full" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))' }}>
      {/* Floppy ears */}
      <ellipse cx="34" cy="48" rx="14" ry="20" fill="#f1f5f9" transform="rotate(-20 34 48)" />
      <ellipse cx="34" cy="48" rx="10" ry="16" fill="#fecdd3" transform="rotate(-20 34 48)" />
      <ellipse cx="86" cy="48" rx="14" ry="20" fill="#f1f5f9" transform="rotate(20 86 48)" />
      <ellipse cx="86" cy="48" rx="10" ry="16" fill="#fecdd3" transform="rotate(20 86 48)" />
      {/* Head */}
      <ellipse cx="60" cy="46" rx="22" ry="20" fill="white" />
      {/* Spots */}
      <circle cx="48" cy="38" r="6" fill="#1e293b" />
      <circle cx="72" cy="42" r="5" fill="#1e293b" />
      <circle cx="55" cy="30" r="3" fill="#1e293b" />
      {/* Eyes */}
      <circle cx="50" cy="44" r="4" fill="#1e293b" />
      <circle cx="70" cy="44" r="4" fill="#1e293b" />
      <circle cx="49" cy="43" r="1.5" fill="white" />
      <circle cx="69" cy="43" r="1.5" fill="white" />
      {/* Nose & mouth */}
      <ellipse cx="60" cy="52" rx="5" ry="3.5" fill="#1e293b" />
      <circle cx="60" cy="50" r="1" fill="#f8fafc" opacity="0.6" />
      <path d="M60 55 L60 58 M56 60 Q60 64, 64 60" fill="none" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
      {/* Tongue */}
      <ellipse cx="62" cy="62" rx="3" ry="4" fill="#f87171" />
      {/* Body */}
      <ellipse cx="60" cy="90" rx="24" ry="28" fill="white" />
      {/* More spots on body */}
      <circle cx="46" cy="82" r="7" fill="#1e293b" />
      <circle cx="72" cy="88" r="6" fill="#1e293b" />
      <circle cx="55" cy="100" r="5" fill="#1e293b" />
      {/* Red collar */}
      <rect x="40" y="66" width="40" height="6" rx="3" fill="#ef4444" />
      <circle cx="60" cy="72" r="4" fill="#fbbf24" />
      {/* Front paws */}
      <ellipse cx="44" cy="116" rx="8" ry="5" fill="white" />
      <ellipse cx="76" cy="116" rx="8" ry="5" fill="white" />
      {/* Tail */}
      <path d="M84 80 Q96 70, 100 78 Q102 84, 96 82" fill="white" stroke="#e2e8f0" strokeWidth="1" />
      <circle cx="100" cy="78" r="2" fill="#1e293b" />
      {/* Cheek blush */}
      <ellipse cx="44" cy="52" rx="4" ry="2" fill="#fecdd3" opacity="0.6" />
      <ellipse cx="76" cy="52" rx="4" ry="2" fill="#fecdd3" opacity="0.6" />
    </svg>
  );
}

function InsideOutIllustration() {
  return (
    <svg viewBox="0 0 120 140" className="w-full h-full" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }}>
      {/* Joy — yellow glow orb */}
      <circle cx="40" cy="50" r="18" fill="#fbbf24" opacity="0.2" />
      <circle cx="40" cy="50" r="12" fill="#fbbf24" />
      <circle cx="36" cy="46" r="2" fill="#1e293b" />
      <circle cx="44" cy="46" r="2" fill="#1e293b" />
      <path d="M35 53 Q40 58, 45 53" fill="none" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" />
      {/* Hair spike */}
      <path d="M36 38 L34 28 L42 36 L44 26 L48 38" fill="#3b82f6" />
      {/* Sadness — blue orb */}
      <circle cx="80" cy="55" r="16" fill="#60a5fa" opacity="0.2" />
      <circle cx="80" cy="55" r="11" fill="#60a5fa" />
      <circle cx="76" cy="52" r="2" fill="white" />
      <circle cx="84" cy="52" r="2" fill="white" />
      <circle cx="76" cy="52" r="1" fill="#1e3a5f" />
      <circle cx="84" cy="52" r="1" fill="#1e3a5f" />
      <path d="M76 58 Q80 55, 84 58" fill="none" stroke="#1e3a5f" strokeWidth="1.5" strokeLinecap="round" />
      {/* Glasses */}
      <circle cx="76" cy="52" r="4" fill="none" stroke="#1e3a5f" strokeWidth="1" />
      <circle cx="84" cy="52" r="4" fill="none" stroke="#1e3a5f" strokeWidth="1" />
      <path d="M80 52 L80 52" stroke="#1e3a5f" strokeWidth="1" />
      {/* Anger — red block */}
      <rect x="22" y="80" width="22" height="20" rx="4" fill="#dc2626" />
      <rect x="26" y="76" width="14" height="4" rx="2" fill="#fbbf24" />
      <circle cx="29" cy="88" r="1.5" fill="white" />
      <circle cx="37" cy="88" r="1.5" fill="white" />
      <path d="M28 93 L38 93" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      {/* Flame on top */}
      <path d="M30 76 Q28 68, 33 72 Q31 64, 36 70 Q38 64, 38 72 Q40 68, 36 76" fill="#f97316" />
      {/* Disgust — green */}
      <ellipse cx="60" cy="100" rx="10" ry="12" fill="#22c55e" />
      <circle cx="56" cy="96" r="2" fill="white" />
      <circle cx="64" cy="96" r="2" fill="white" />
      <circle cx="56" cy="96" r="1" fill="#166534" />
      <circle cx="64" cy="96" r="1" fill="#166534" />
      <path d="M57 102 Q60 100, 63 102" fill="none" stroke="#166534" strokeWidth="1" strokeLinecap="round" />
      {/* Eyelashes */}
      <path d="M54 94 L52 92 M56 93 L55 91 M64 93 L65 91 M66 94 L68 92" stroke="#166534" strokeWidth="0.8" strokeLinecap="round" />
      {/* Fear — purple */}
      <ellipse cx="86" cy="98" rx="8" ry="14" fill="#a78bfa" />
      <circle cx="83" cy="94" r="2.5" fill="white" />
      <circle cx="89" cy="94" r="2.5" fill="white" />
      <circle cx="83" cy="94" r="1.2" fill="#4c1d95" />
      <circle cx="89" cy="94" r="1.2" fill="#4c1d95" />
      <path d="M83 102 Q86 105, 89 102" fill="none" stroke="#4c1d95" strokeWidth="1" strokeLinecap="round" />
      {/* Memory orbs floating */}
      <circle cx="20" cy="120" r="6" fill="#fbbf24" opacity="0.4" />
      <circle cx="50" cy="125" r="5" fill="#60a5fa" opacity="0.4" />
      <circle cx="80" cy="122" r="6" fill="#22c55e" opacity="0.4" />
      <circle cx="100" cy="128" r="5" fill="#dc2626" opacity="0.4" />
      <circle cx="35" cy="130" r="4" fill="#a78bfa" opacity="0.4" />
    </svg>
  );
}

const CARD_ILLUSTRATIONS = {
  'disney-princesses': PrincessIllustration,
  'disney-villains': VillainIllustration,
  'disney-pooh': PoohIllustration,
  'disney-dalmatians': PuppyIllustration,
  'disney-insideout': InsideOutIllustration,
};

const subsections = [
  {
    id: 'disney-princesses',
    label: 'Princesses',
    grad: ['#f0abfc', '#a855f7'],
  },
  {
    id: 'disney-villains',
    label: 'Villains',
    grad: ['#a855f7', '#1f2937'],
  },
  {
    id: 'disney-pooh',
    label: 'Pooh',
    grad: ['#fbbf24', '#f59e0b'],
  },
  {
    id: 'disney-dalmatians',
    label: 'Puppies',
    grad: ['#fecdd3', '#f9a8d4'],
  },
  {
    id: 'disney-insideout',
    label: 'Inside Out',
    grad: ['#7c3aed', '#312e81'],
  },
];

export default function DisneyHub() {
  const { mode } = useParams();
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-full overflow-y-auto no-scrollbar">
      {/* Enchanted forest background */}
      <DisneyForestScene />

      <BackButton />

      <div className="relative z-10 p-6 pt-20">
        <h2 className="text-3xl font-heading text-center mb-2 drop-shadow animate-spring-in"
            style={{ color: '#fbbf24' }}>
          🏰 Disney World
        </h2>
        <p className="text-center text-white/60 text-sm mb-6 animate-spring-in"
           style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}>
          Choose your adventure!
        </p>

        <div className="flex flex-col gap-4 max-w-sm mx-auto pb-8">
          {subsections.map((s, i) => {
            const theme = SECTION_THEMES[s.id];
            const accent = theme?.palette?.primary || '#fff';
            const Illustration = CARD_ILLUSTRATIONS[s.id];
            return (
              <TiltCard
                key={s.id}
                onClick={() => {
                  playNavigate();
                  navigate(`/games/${mode}/${s.id}`);
                }}
                className="game-card tap-ripple overflow-hidden rounded-3xl animate-spring-in p-0"
                style={{
                  background: `linear-gradient(135deg, ${s.grad[0]}, ${s.grad[1]})`,
                  animationDelay: `${i * 0.12}s`,
                  animationFillMode: 'backwards',
                  borderBottom: `3px solid ${accent}`,
                }}
              >
                <div className="relative w-full min-h-[130px] flex items-center">
                  {/* Character illustration */}
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 w-[80px] h-[100px] z-[1] opacity-90">
                    {Illustration && <Illustration />}
                  </div>
                  {/* Title */}
                  <div className="relative z-[2] w-full flex items-center justify-center pl-16">
                    <span className="text-2xl font-heading text-white drop-shadow-lg">{s.label}</span>
                  </div>
                </div>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
