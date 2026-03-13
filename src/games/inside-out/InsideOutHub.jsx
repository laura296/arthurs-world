import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import { playPop, playSuccess, playBoing, playNavigate } from '../../hooks/useSound';
import { useParticleBurst } from '../../components/ParticleBurst';
import { Joy, Sadness, Anger, Anxiety, MemoryOrb } from './Characters';
import {
  ROOMS, EMOTION_COLORS, RESTORATION_LEVELS,
  loadProgress, refreshAlerts,
} from './insideOutData';

const ROOM_CHARACTERS = {
  'control-room': { Component: Joy, label: 'Joy' },
  'anger-reactor': { Component: Anger, label: 'Anger' },
  'anxiety-dome': { Component: Anxiety, label: 'Anxiety' },
  'memory-vault': { Component: Sadness, label: 'Sadness' },
};

// ─── HQ Background — layered architectural SVG ──────────
function HQBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Stars in the deep background */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div key={i} className="absolute rounded-full bg-white"
             style={{
               width: 1 + Math.random() * 2, height: 1 + Math.random() * 2,
               left: `${Math.random() * 100}%`, top: `${Math.random() * 50}%`,
               opacity: 0.15 + Math.random() * 0.35,
               animation: `ioGlowPulse ${2 + Math.random() * 3}s ease-in-out infinite`,
               animationDelay: `${Math.random() * 3}s`,
             }} />
      ))}

      {/* HQ architectural elements — SVG */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="hq-wall-l" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1e1b4b" /><stop offset="100%" stopColor="#2e1065" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="hq-wall-r" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor="#1e1b4b" /><stop offset="100%" stopColor="#2e1065" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="hq-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.6" /><stop offset="100%" stopColor="#0a0720" />
          </linearGradient>
          <linearGradient id="hq-window" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#312e81" /><stop offset="50%" stopColor="#4c1d95" /><stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>
          <radialGradient id="hq-console-glow" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#facc15" stopOpacity="0.15" /><stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* Left wall panel */}
        <polygon points="0,0 90,40 90,750 0,800" fill="url(#hq-wall-l)" />
        {/* Right wall panel */}
        <polygon points="400,0 310,40 310,750 400,800" fill="url(#hq-wall-r)" />

        {/* Window — curved arch showing mindscape */}
        <path d="M120,30 Q200,-20 280,30 L280,160 Q200,180 120,160 Z" fill="url(#hq-window)" opacity="0.5" />
        {/* Mindscape hills through window */}
        <path d="M130,120 Q160,90 190,110 Q220,80 250,100 Q270,90 280,110 L280,160 Q200,180 120,160 Z" fill="#5b21b6" opacity="0.2" />
        <path d="M130,135 Q165,115 195,130 Q225,110 260,125 L280,160 Q200,180 120,160 Z" fill="#7c3aed" opacity="0.15" />
        {/* Floating islands in window */}
        <ellipse cx="170" cy="95" rx="15" ry="5" fill="#a78bfa" opacity="0.15" />
        <ellipse cx="230" cy="85" rx="10" ry="3" fill="#c084fc" opacity="0.12" />
        {/* Window frame */}
        <path d="M120,30 Q200,-20 280,30 L280,160 Q200,180 120,160 Z" fill="none" stroke="#a78bfa" strokeWidth="1.5" opacity="0.3" />

        {/* Wall trim lines — glowing */}
        <line x1="85" y1="40" x2="85" y2="750" stroke="#7c3aed" strokeWidth="1" opacity="0.2" />
        <line x1="315" y1="40" x2="315" y2="750" stroke="#7c3aed" strokeWidth="1" opacity="0.2" />
        {/* Horizontal trim */}
        <line x1="85" y1="200" x2="315" y2="200" stroke="#7c3aed" strokeWidth="0.5" opacity="0.15" />

        {/* Floor reflection */}
        <rect x="85" y="700" width="230" height="100" fill="url(#hq-floor)" />

        {/* Console glow on floor */}
        <ellipse cx="200" cy="650" rx="120" ry="40" fill="url(#hq-console-glow)">
          <animate attributeName="opacity" values="0.3;0.5;0.3" dur="4s" repeatCount="indefinite" />
        </ellipse>
      </svg>

      {/* Memory orb conveyor tracks */}
      <div className="absolute top-[22%] left-0 right-0 h-6">
        <div className="relative h-full">
          {/* Track lines */}
          <div className="absolute inset-y-2 left-[8%] right-[8%] border-t border-b border-purple-500/10" />
          {/* Rolling orbs */}
          {[EMOTION_COLORS.joy, EMOTION_COLORS.sadness, EMOTION_COLORS.anger, EMOTION_COLORS.fear, EMOTION_COLORS.disgust].map((color, i) => (
            <div key={i} className="absolute top-0"
                 style={{
                   animation: `ioOrbRoll ${10 + i * 2}s linear infinite`,
                   animationDelay: `${i * -2}s`,
                 }}>
              <MemoryOrb color={color} size={20} glow={false} />
            </div>
          ))}
        </div>
      </div>

      {/* Second orb track — lower */}
      <div className="absolute top-[65%] left-0 right-0 h-5 opacity-60">
        <div className="relative h-full">
          <div className="absolute inset-y-2 left-[12%] right-[12%] border-t border-purple-500/8" />
          {[EMOTION_COLORS.anxiety, EMOTION_COLORS.joy, EMOTION_COLORS.sadness].map((color, i) => (
            <div key={i} className="absolute top-0"
                 style={{
                   animation: `ioOrbRoll ${12 + i * 3}s linear infinite reverse`,
                   animationDelay: `${i * -3}s`,
                 }}>
              <MemoryOrb color={color} size={16} glow={false} />
            </div>
          ))}
        </div>
      </div>

      {/* Floating ambient orbs */}
      {[
        { color: EMOTION_COLORS.joy, x: 10, y: 35, s: 22, d: 0 },
        { color: EMOTION_COLORS.fear, x: 85, y: 42, s: 18, d: 1.5 },
        { color: EMOTION_COLORS.sadness, x: 20, y: 75, s: 16, d: 3 },
        { color: EMOTION_COLORS.anger, x: 78, y: 80, s: 20, d: 2 },
        { color: EMOTION_COLORS.disgust, x: 50, y: 30, s: 14, d: 4 },
      ].map((orb, i) => (
        <div key={i} className="absolute opacity-20"
             style={{
               left: `${orb.x}%`, top: `${orb.y}%`,
               animation: `ioFloatDrift ${6 + i}s ease-in-out infinite`,
               animationDelay: `${orb.d}s`,
             }}>
          <MemoryOrb color={orb.color} size={orb.s} glow={false} />
        </div>
      ))}

      {/* Scanline overlay */}
      <div className="absolute inset-0 overflow-hidden opacity-[0.02]">
        <div className="w-full h-1 bg-white" style={{ animation: 'scanline 5s linear infinite' }} />
      </div>
    </div>
  );
}

// ─── Mini Console decoration ─────────────────────────────
function MiniConsole() {
  return (
    <div className="flex justify-center mb-3">
      <svg viewBox="0 0 240 50" width="200" height="42">
        <defs>
          <linearGradient id="mc-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#374151" /><stop offset="100%" stopColor="#1f2937" />
          </linearGradient>
        </defs>
        {/* Console desk */}
        <rect x="10" y="15" width="220" height="30" rx="8" fill="url(#mc-bg)" />
        <rect x="10" y="15" width="220" height="15" rx="8" fill="white" opacity="0.05" />
        {/* Buttons */}
        {[
          { cx: 45, color: EMOTION_COLORS.joy },
          { cx: 85, color: EMOTION_COLORS.sadness },
          { cx: 125, color: EMOTION_COLORS.anger },
          { cx: 165, color: EMOTION_COLORS.fear },
          { cx: 205, color: EMOTION_COLORS.disgust },
        ].map((btn, i) => (
          <g key={i}>
            <circle cx={btn.cx} cy="30" r="8" fill={btn.color} opacity="0.6">
              <animate attributeName="opacity" values="0.3;0.7;0.3" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.4}s`} />
            </circle>
            <circle cx={btn.cx} cy="30" r="4" fill={btn.color} opacity="0.9" />
          </g>
        ))}
        {/* Screen waveform */}
        <path d="M15,22 L25,22 L28,19 L32,25 L36,22 L40,22" fill="none" stroke="#22c55e" strokeWidth="1" opacity="0.3">
          <animate attributeName="d" values="M15,22 L25,22 L28,19 L32,25 L36,22 L40,22;M15,22 L25,22 L28,25 L32,19 L36,22 L40,22;M15,22 L25,22 L28,19 L32,25 L36,22 L40,22" dur="1.5s" repeatCount="indefinite" />
        </path>
      </svg>
    </div>
  );
}

// ─── Room Panel — portal/doorway style ───────────────────
function RoomPanel({ room, roomProgress, hasAlert, onPlay }) {
  const level = roomProgress?.level || 0;
  const levelName = RESTORATION_LEVELS[level] || 'Destroyed';
  const isLocked = !room.gamePath;
  const char = ROOM_CHARACTERS[room.id];

  return (
    <button
      onClick={() => !isLocked && onPlay(room)}
      disabled={isLocked}
      className={`relative w-full rounded-2xl overflow-hidden transition-all duration-300
        ${isLocked ? 'opacity-40 grayscale' : 'active:scale-[0.97]'}
        ${hasAlert ? 'ring-2 ring-red-400/60 ring-offset-2 ring-offset-transparent' : ''}`}
      style={{
        background: `linear-gradient(145deg, ${room.gradFrom}12, ${room.gradTo}20)`,
        border: `1.5px solid ${room.color}33`,
      }}
    >
      {/* Doorframe arch — top */}
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
           style={{ background: `linear-gradient(to right, transparent, ${room.color}40, transparent)` }} />

      {/* Alert effects */}
      {hasAlert && (
        <div className="absolute inset-0 rounded-2xl pointer-events-none">
          <div className="absolute inset-0 rounded-2xl"
               style={{ boxShadow: `inset 0 0 30px ${room.color}22` }} />
          {/* Alert lights */}
          <div className="absolute top-1.5 right-2 flex gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500 shadow-lg shadow-red-500/50">
              <div className="absolute inset-0 rounded-full bg-red-400 animate-ping" />
            </div>
          </div>
          {/* Side glow bars */}
          <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full"
               style={{ background: room.color, opacity: 0.3, animation: 'ioGlowPulse 1s ease-in-out infinite' }} />
          <div className="absolute right-0 top-2 bottom-2 w-0.5 rounded-full"
               style={{ background: room.color, opacity: 0.3, animation: 'ioGlowPulse 1s ease-in-out infinite', animationDelay: '0.5s' }} />
        </div>
      )}

      <div className="flex items-center gap-3 p-3">
        {/* Character portal */}
        <div className="relative flex-shrink-0 w-[68px] h-[68px] rounded-xl flex items-center justify-center overflow-hidden"
             style={{ background: `linear-gradient(135deg, ${room.gradFrom}18, ${room.gradTo}28)` }}>
          {/* Portal inner glow */}
          <div className="absolute inset-0 rounded-xl"
               style={{ boxShadow: `inset 0 0 20px ${room.color}15` }} />
          {char && <char.Component size={52} animate={hasAlert} />}
          {isLocked && (
            <div className="absolute inset-0 rounded-xl bg-black/60 flex items-center justify-center">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="white" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 text-left">
          <h3 className="font-heading text-white text-sm leading-tight">{room.name}</h3>
          <p className="text-white/35 text-[11px] leading-tight mt-0.5">{room.description}</p>
          {/* Level bar */}
          <div className="mt-1.5">
            <div className="h-2 rounded-full bg-white/8 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700 relative"
                   style={{
                     width: `${Math.max(5, (level / 4) * 100)}%`,
                     background: `linear-gradient(to right, ${room.gradFrom}, ${room.gradTo})`,
                   }}>
                {/* Animated shimmer on bar */}
                <div className="absolute inset-0 rounded-full"
                     style={{
                       background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                       animation: 'goldShimmer 2s ease-in-out infinite',
                     }} />
              </div>
            </div>
            <span className="text-[9px] text-white/25 mt-0.5 block">{levelName}</span>
          </div>
        </div>

        {/* Play button */}
        {!isLocked && (
          <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
               style={{ background: `${room.color}25`, border: `1px solid ${room.color}30` }}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="white" opacity="0.8">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}
      </div>
    </button>
  );
}

// ─── Main Hub ────────────────────────────────────────────
export default function InsideOutHub() {
  const { mode, section } = useParams();
  const navigate = useNavigate();
  const { burst, ParticleLayer } = useParticleBurst();
  const [progress, setProgress] = useState(() => refreshAlerts());

  useEffect(() => {
    setProgress(refreshAlerts());
  }, []);

  const handlePlay = (room) => {
    playNavigate();
    burst({ x: window.innerWidth / 2, y: window.innerHeight / 2, colors: [room.color, '#fff'] });
    navigate(`/games/${mode}/${section}/${room.gamePath}`);
  };

  const handleBoss = () => {
    playBoing();
    burst({ x: window.innerWidth / 2, y: 200, colors: ['#ef4444', '#facc15', '#3b82f6', '#22c55e'] });
    navigate(`/games/${mode}/${section}/chain-reaction-crisis`);
  };

  const totalStars = progress.stars;
  const totalOrbs = progress.orbs;
  const streak = progress.streak;
  const recentOrbs = (progress.orbCollection || []).slice(-5);

  return (
    <div className="relative w-full h-full overflow-y-auto no-scrollbar"
         style={{ background: 'linear-gradient(180deg, #1a103d 0%, #0f0a2a 50%, #0a0720 100%)' }}>
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes goldShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      <HQBackground />
      <BackButton />
      <ParticleLayer />

      <div className="relative z-10 p-4 pt-14 pb-10 max-w-md mx-auto">
        {/* Console header with Joy */}
        <div className="relative text-center mb-4 animate-spring-in">
          <div className="flex justify-center mb-2">
            <Joy size={80} expression={totalStars > 5 ? 'happy' : 'worried'} glow />
          </div>
          <h1 className="text-xl font-heading text-white tracking-wide">
            Headquarters
          </h1>
          <p className="text-white/35 text-xs mt-0.5">Riley's emotions need your help!</p>
        </div>

        {/* Mini console decoration */}
        <div className="animate-spring-in" style={{ animationDelay: '0.05s', animationFillMode: 'backwards' }}>
          <MiniConsole />
        </div>

        {/* Stats console — holographic HUD style */}
        <div className="rounded-xl p-3 mb-5 animate-spring-in"
             style={{
               animationDelay: '0.08s', animationFillMode: 'backwards',
               background: 'linear-gradient(135deg, #312e8112, #7c3aed08)',
               border: '1px solid #7c3aed18',
               boxShadow: 'inset 0 1px 0 #7c3aed10, 0 4px 24px #00000040',
             }}>
          {/* Scanning line effect */}
          <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
            <div className="w-full h-px bg-purple-400/10"
                 style={{ animation: 'scanline 3s linear infinite' }} />
          </div>

          <div className="relative flex items-center justify-between gap-2">
            {/* Stars */}
            <div className="flex-1 text-center">
              <div className="flex items-center justify-center gap-1">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="#facc15">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="text-white font-heading text-xl">{totalStars}</span>
              </div>
              <span className="text-white/25 text-[9px] uppercase tracking-wider">Stars</span>
            </div>

            <div className="w-px h-9 bg-purple-500/10" />

            {/* Orbs */}
            <div className="flex-1 text-center">
              <div className="flex items-center justify-center gap-1">
                <MemoryOrb color="#a78bfa" size={20} glow={false} />
                <span className="text-white font-heading text-xl">{totalOrbs}</span>
              </div>
              <span className="text-white/25 text-[9px] uppercase tracking-wider">Orbs</span>
            </div>

            <div className="w-px h-9 bg-purple-500/10" />

            {/* Streak */}
            <div className="flex-1 text-center">
              <div className="flex items-center justify-center gap-1">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="#f97316">
                  <path d="M12 23c-3.5 0-8-2.6-8-8.3C4 9.1 10 2 12 0c2 2 8 9.1 8 14.7 0 5.7-4.5 8.3-8 8.3z" />
                </svg>
                <span className="text-white font-heading text-xl">{streak}</span>
              </div>
              <span className="text-white/25 text-[9px] uppercase tracking-wider">Streak</span>
            </div>
          </div>

          {/* Memory orb collection preview */}
          {recentOrbs.length > 0 && (
            <div className="flex items-center justify-center gap-1.5 mt-2.5 pt-2 border-t border-purple-500/8">
              <span className="text-white/15 text-[9px] mr-1">Recent:</span>
              {recentOrbs.map((orb, i) => (
                <div key={i} style={{ animation: `ioFloatDrift 3s ease-in-out infinite`, animationDelay: `${i * 0.3}s` }}>
                  <MemoryOrb color={orb.color} size={24} glow={false} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Room panels */}
        <div className="space-y-2.5 mb-5">
          {ROOMS.map((room, i) => (
            <div key={room.id} className="animate-spring-in"
                 style={{ animationDelay: `${0.15 + i * 0.06}s`, animationFillMode: 'backwards' }}>
              <RoomPanel
                room={room}
                roomProgress={progress.rooms[room.id]}
                hasAlert={!!progress.alerts[room.id]}
                onPlay={handlePlay}
              />
            </div>
          ))}
        </div>

        {/* Boss event */}
        <div className="animate-spring-in" style={{ animationDelay: '0.45s', animationFillMode: 'backwards' }}>
          {progress.bossUnlocked ? (
            <button
              onClick={handleBoss}
              className="w-full rounded-2xl overflow-hidden active:scale-[0.97] transition-all duration-200"
              style={{
                background: progress.bossCompleted
                  ? 'linear-gradient(135deg, #22c55e08, #14b8a610)'
                  : 'linear-gradient(135deg, #ef444412, #7c3aed12)',
                border: `1.5px solid ${progress.bossCompleted ? '#22c55e33' : '#ef444433'}`,
              }}
            >
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-13 h-13 rounded-xl flex items-center justify-center"
                       style={{
                         background: progress.bossCompleted
                           ? 'linear-gradient(135deg, #22c55e25, #14b8a625)'
                           : 'linear-gradient(135deg, #ef444425, #7c3aed25)',
                       }}>
                    <svg viewBox="0 0 24 24" width="26" height="26" fill={progress.bossCompleted ? '#22c55e' : '#ef4444'}>
                      <path d="M13 1L3 14h7l-2 9 10-13h-7l2-9z" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-heading text-white text-sm">
                      {progress.bossCompleted ? 'Chain Reaction — Complete!' : 'Chain Reaction Crisis!'}
                    </h3>
                    <p className="text-white/35 text-[11px]">
                      {progress.bossCompleted ? 'Play again for more stars' : 'All rooms need help at once!'}
                    </p>
                  </div>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="white" opacity="0.3">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </button>
          ) : (
            <div className="w-full rounded-2xl p-4 text-center"
                 style={{ background: '#ffffff05', border: '1px solid #ffffff08' }}>
              <div className="flex items-center justify-center gap-2 mb-1.5">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#ffffff25" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                <span className="text-white/25 text-xs font-heading">Boss Event Locked</span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden max-w-[200px] mx-auto">
                <div className="h-full rounded-full transition-all duration-700 relative"
                     style={{
                       width: `${Math.min(100, (totalStars / 10) * 100)}%`,
                       background: 'linear-gradient(to right, #eab308, #f97316)',
                     }}>
                  <div className="absolute inset-0 rounded-full"
                       style={{
                         background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                         animation: 'goldShimmer 2s ease-in-out infinite',
                       }} />
                </div>
              </div>
              <span className="text-white/15 text-[10px] mt-1 block">{totalStars}/10 stars to unlock</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
