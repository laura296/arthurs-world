import { useCallback, useRef, useState, useEffect } from 'react';
import BackButton from '../components/BackButton';
import { playPiano, playHarp, playDrum, playXylophone } from '../hooks/useSound';
import { useParticleBurst } from '../components/ParticleBurst';
import { useArthurPeek } from '../components/ArthurPeek';
import InstrumentIcon from './music-pad/InstrumentIcon';
import PianoLayout from './music-pad/PianoLayout';
import HarpLayout from './music-pad/HarpLayout';
import DrumsLayout from './music-pad/DrumsLayout';
import XylophoneLayout from './music-pad/XylophoneLayout';
import { NATURAL_NOTES } from './music-pad/noteData';

const INSTRUMENTS = [
  { id: 'piano',      label: 'Piano',      play: playPiano },
  { id: 'harp',       label: 'Harp',       play: playHarp },
  { id: 'drums',      label: 'Drums',      play: playDrum },
  { id: 'xylophone',  label: 'Xylophone',  play: playXylophone },
];

const LAYOUT_MAP = {
  piano: PianoLayout,
  harp: HarpLayout,
  drums: DrumsLayout,
  xylophone: XylophoneLayout,
};

const PARTICLE_THEMES = {
  piano:     { colors: ['#ffffff', '#facc15', '#8b5cf6'], shapes: ['star', 'circle'] },
  harp:      { colors: ['#fbbf24', '#f59e0b', '#fef3c7'], shapes: ['star', 'diamond'] },
  drums:     { colors: ['#ef4444', '#f97316', '#eab308'], shapes: ['circle', 'star'] },
  xylophone: { colors: ['#38bdf8', '#a78bfa', '#f472b6'], shapes: ['circle', 'diamond'] },
};

const STAGE_THEMES = {
  piano:     { from: '#1a1035', via: '#2d1b69', to: '#0f0a1f', spotlight: '#8b5cf6' },
  harp:      { from: '#1a1505', via: '#2d2510', to: '#0f0c02', spotlight: '#fbbf24' },
  drums:     { from: '#1f0a0a', via: '#3d1515', to: '#100505', spotlight: '#ef4444' },
  xylophone: { from: '#0a1520', via: '#152535', to: '#050a10', spotlight: '#38bdf8' },
};

// Twinkle Twinkle Little Star
const DEMO_MELODY = [0, 0, 4, 4, 5, 5, 4, -1, 3, 3, 2, 2, 1, 1, 0];

/* ── Stage background with warm lighting ── */
function StageScene({ instrument }) {
  const theme = STAGE_THEMES[instrument];
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Gradient backdrop */}
      <div
        className="absolute inset-0 transition-colors duration-700"
        style={{
          background: `radial-gradient(ellipse at 50% 20%, ${theme.via} 0%, ${theme.from} 40%, ${theme.to} 100%)`,
        }}
      />
      {/* Stage spotlight cone */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 transition-all duration-700"
        style={{
          width: '140%',
          height: '60%',
          background: `conic-gradient(from 180deg at 50% 0%, transparent 30%, ${theme.spotlight}08 45%, ${theme.spotlight}15 50%, ${theme.spotlight}08 55%, transparent 70%)`,
        }}
      />
      {/* Floor reflection */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1/3 transition-colors duration-700"
        style={{
          background: `linear-gradient(to top, ${theme.spotlight}10 0%, transparent 100%)`,
        }}
      />
      {/* Floating dust particles */}
      <StageDust color={theme.spotlight} />
      {/* Stage edge wooden strip */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-900/40 via-amber-700/50 to-amber-900/40" />
    </div>
  );
}

/* ── Floating stage dust motes ── */
function StageDust({ color }) {
  const motes = useRef(
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: `${8 + Math.random() * 84}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${6 + Math.random() * 6}s`,
      size: 1.5 + Math.random() * 2.5,
    }))
  ).current;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {motes.map(m => (
        <div
          key={m.id}
          className="absolute rounded-full animate-float-up"
          style={{
            left: m.left,
            bottom: '-5%',
            width: m.size,
            height: m.size,
            background: color,
            opacity: 0.15 + Math.random() * 0.15,
            animationDelay: m.delay,
            animationDuration: m.duration,
          }}
        />
      ))}
    </div>
  );
}

/* ── Arthur Bear dancing mascot ── */
function DancingBear({ noteCount, instrument }) {
  // Mood progresses: calm → grooving → ecstatic
  const mood = noteCount >= 20 ? 'ecstatic' : noteCount >= 8 ? 'happy' : 'curious';
  const bobSpeed = mood === 'ecstatic' ? '0.4s' : mood === 'happy' ? '0.7s' : '1.2s';
  const bodyTilt = mood === 'ecstatic' ? 8 : mood === 'happy' ? 4 : 0;

  // Instrument-specific accent color for the glow
  const glowColor = STAGE_THEMES[instrument]?.spotlight || '#facc15';

  return (
    <div className="absolute bottom-3 left-3 z-20 pointer-events-none">
      <div
        className="relative"
        style={{
          animation: `bear-dance ${bobSpeed} ease-in-out infinite alternate`,
          transformOrigin: 'bottom center',
        }}
      >
        {/* Glow behind bear */}
        <div
          className="absolute -inset-3 rounded-full blur-xl transition-all duration-500"
          style={{ background: glowColor, opacity: mood === 'ecstatic' ? 0.25 : mood === 'happy' ? 0.12 : 0.05 }}
        />
        {/* Bear body */}
        <svg viewBox="0 0 80 90" width="64" height="72">
          {/* Ears */}
          <circle cx="22" cy="12" r="12" fill="#8B6F47" />
          <circle cx="58" cy="12" r="12" fill="#8B6F47" />
          <circle cx="22" cy="12" r="7" fill="#D4A574" />
          <circle cx="58" cy="12" r="7" fill="#D4A574" />

          {/* Head */}
          <ellipse cx="40" cy="28" rx="22" ry="20" fill="#A0845C" />
          <ellipse cx="40" cy="28" rx="20" ry="18" fill="#B8956A" />

          {/* Eyes — sparkle when ecstatic */}
          {mood === 'ecstatic' ? (
            <>
              <path d="M30,24 L32,22 L34,24 L32,26 Z" fill="#2C1810" />
              <path d="M46,24 L48,22 L50,24 L48,26 Z" fill="#2C1810" />
            </>
          ) : (
            <>
              <ellipse cx="32" cy="25" rx="3" ry={mood === 'happy' ? 2.5 : 3} fill="#2C1810" />
              <ellipse cx="48" cy="25" rx="3" ry={mood === 'happy' ? 2.5 : 3} fill="#2C1810" />
              <circle cx="33.5" cy="24" r="1" fill="white" opacity="0.8" />
              <circle cx="49.5" cy="24" r="1" fill="white" opacity="0.8" />
            </>
          )}

          {/* Nose */}
          <ellipse cx="40" cy="32" rx="5" ry="3" fill="#5C3A1E" />
          <ellipse cx="41" cy="31.5" r="1.5" fill="#8B6F47" opacity="0.4" />

          {/* Mouth — wider smile as mood increases */}
          <path
            d={mood === 'ecstatic'
              ? 'M34,35 Q40,42 46,35'
              : mood === 'happy'
              ? 'M35,35 Q40,40 45,35'
              : 'M36,35 Q40,38 44,35'}
            fill="none" stroke="#5C3A1E" strokeWidth="1.5" strokeLinecap="round"
          />

          {/* Rosy cheeks when happy+ */}
          {mood !== 'curious' && (
            <>
              <circle cx="26" cy="32" r="4" fill="#E8967C" opacity={mood === 'ecstatic' ? 0.6 : 0.3} />
              <circle cx="54" cy="32" r="4" fill="#E8967C" opacity={mood === 'ecstatic' ? 0.6 : 0.3} />
            </>
          )}

          {/* Body */}
          <ellipse cx="40" cy="62" rx="20" ry="22" fill="#A0845C" />
          <ellipse cx="40" cy="60" rx="14" ry="16" fill="#C4A574" />

          {/* Arms — wave when happy, dance when ecstatic */}
          <g style={{ transformOrigin: '20px 55px', transform: `rotate(${mood === 'ecstatic' ? -35 : mood === 'happy' ? -20 : -10}deg)` }}>
            <ellipse cx="14" cy="58" rx="7" ry="12" fill="#A0845C"
              style={mood !== 'curious' ? { animation: `bear-wave ${bobSpeed} ease-in-out infinite alternate` } : undefined}
            />
          </g>
          <g style={{ transformOrigin: '60px 55px', transform: `rotate(${mood === 'ecstatic' ? 35 : mood === 'happy' ? 20 : 10}deg)` }}>
            <ellipse cx="66" cy="58" rx="7" ry="12" fill="#A0845C"
              style={mood !== 'curious' ? { animation: `bear-wave ${bobSpeed} ease-in-out infinite alternate-reverse` } : undefined}
            />
          </g>

          {/* Feet */}
          <ellipse cx="30" cy="82" rx="8" ry="5" fill="#8B6F47" />
          <ellipse cx="50" cy="82" rx="8" ry="5" fill="#8B6F47" />

          {/* Musical notes floating up when playing */}
          {noteCount > 0 && (
            <>
              <text x="65" y="15" fontSize="10" fill={glowColor} opacity="0.7"
                style={{ animation: 'float-note 2s ease-out infinite', animationDelay: '0s' }}>♪</text>
              {noteCount >= 8 && (
                <text x="10" y="10" fontSize="8" fill={glowColor} opacity="0.5"
                  style={{ animation: 'float-note 2.5s ease-out infinite', animationDelay: '0.8s' }}>♫</text>
              )}
              {noteCount >= 20 && (
                <text x="55" y="5" fontSize="12" fill={glowColor} opacity="0.6"
                  style={{ animation: 'float-note 1.8s ease-out infinite', animationDelay: '0.4s' }}>♬</text>
              )}
            </>
          )}
        </svg>
      </div>
    </div>
  );
}

/* ── Note count sparkle badge ── */
function NoteCounter({ count }) {
  if (count === 0) return null;
  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-white/10 backdrop-blur-sm
                    rounded-full px-4 py-2 border border-white/20 shadow-lg transition-all duration-300">
      <span className="text-lg">♪</span>
      <span className="text-lg font-heading text-white">{count}</span>
    </div>
  );
}

export default function MusicPad() {
  const [active, setActive] = useState(null);
  const [instrument, setInstrument] = useState('piano');
  const [playing, setPlaying] = useState(false);
  const [noteCount, setNoteCount] = useState(0);
  const demoRef = useRef(null);
  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();

  const currentInstrument = INSTRUMENTS.find(i => i.id === instrument);

  const tap = useCallback((pad, e) => {
    currentInstrument.play(pad.freq);
    setActive(pad.note);
    setTimeout(() => setActive(null), 300);

    // Increment note count
    setNoteCount(n => {
      const next = n + 1;
      // ArthurPeek milestones
      if (next === 10) peek('happy');
      if (next === 25) peek('excited');
      if (next === 50) peek('excited', 'bottom-center');
      return next;
    });

    if (e?.clientX) {
      const theme = PARTICLE_THEMES[instrument];
      burst(e.clientX, e.clientY, {
        count: 8, spread: 40,
        ...theme,
      });
    }
  }, [currentInstrument, instrument, burst, peek]);

  const playDemo = useCallback(() => {
    if (playing) {
      if (demoRef.current) clearTimeout(demoRef.current);
      setPlaying(false);
      setActive(null);
      return;
    }
    setPlaying(true);
    const inst = INSTRUMENTS.find(i => i.id === instrument);
    let i = 0;
    const playNext = () => {
      if (i >= DEMO_MELODY.length) {
        setPlaying(false);
        setActive(null);
        peek('excited');
        return;
      }
      const noteIdx = DEMO_MELODY[i];
      if (noteIdx >= 0) {
        const note = NATURAL_NOTES[noteIdx];
        inst.play(note.freq);
        setActive(note.note);
        setNoteCount(n => n + 1);
        setTimeout(() => setActive(null), 250);
      }
      i++;
      demoRef.current = setTimeout(playNext, 350);
    };
    playNext();
  }, [instrument, playing, peek]);

  // Reset note count when switching instruments
  const switchInstrument = useCallback((id) => {
    setInstrument(id);
    setNoteCount(0);
    if (playing) {
      clearTimeout(demoRef.current);
      setPlaying(false);
      setActive(null);
    }
  }, [playing]);

  const Layout = LAYOUT_MAP[instrument];

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      {/* Warm stage background */}
      <StageScene instrument={instrument} />

      <BackButton />

      {/* Note counter */}
      <NoteCounter count={noteCount} />

      {/* Dancing bear mascot */}
      <DancingBear noteCount={noteCount} instrument={instrument} />

      {/* Instrument picker + demo button */}
      <div className="relative z-10 flex justify-center items-end gap-2 px-4 pt-16 pb-2
                      bg-gradient-to-b from-black/40 to-transparent">
        {INSTRUMENTS.map(inst => (
          <button
            key={inst.id}
            onClick={() => switchInstrument(inst.id)}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all
                       ${instrument === inst.id
                         ? 'bg-white/20 ring-2 ring-sun scale-105 shadow-lg shadow-sun/30'
                         : 'bg-white/5 opacity-70 hover:opacity-90'}`}
          >
            <InstrumentIcon id={inst.id} />
            <span className="text-xs font-heading text-white">{inst.label}</span>
          </button>
        ))}

        {/* Demo button */}
        <button
          onClick={playDemo}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all ml-2
                     ${playing
                       ? 'bg-sun/30 ring-2 ring-sun animate-pulse'
                       : 'bg-white/10 hover:bg-white/20'}`}
        >
          <span className="text-2xl">{playing ? '⏹' : '▶️'}</span>
          <span className="text-xs font-heading text-white">Demo</span>
        </button>
      </div>

      {/* Active instrument layout */}
      <Layout active={active} onTap={tap} />

      <ParticleLayer />
      <ArthurPeekLayer />
    </div>
  );
}
