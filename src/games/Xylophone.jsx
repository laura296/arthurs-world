import { useState, useCallback, useRef, useEffect } from 'react';
import BackButton from '../components/BackButton';
import LevelSelect from '../components/LevelSelect';
import { playXylophone, playCelebrate, playSuccess, playBoing } from '../hooks/useSound';
import { useParticleBurst } from '../components/ParticleBurst';
import { useArthurPeek } from '../components/ArthurPeek';
import { useCelebration } from '../components/CelebrationOverlay';
import { useLevelProgression } from '../hooks/useLevelProgression';

/* Rainbow xylophone bars — C major scale */
const BARS = [
  { note: 'C',  freq: 261.63, colour: '#ef4444', label: '🔴', idx: 0 },
  { note: 'D',  freq: 293.66, colour: '#f97316', label: '🟠', idx: 1 },
  { note: 'E',  freq: 329.63, colour: '#facc15', label: '🟡', idx: 2 },
  { note: 'F',  freq: 349.23, colour: '#22c55e', label: '🟢', idx: 3 },
  { note: 'G',  freq: 392.00, colour: '#38bdf8', label: '🔵', idx: 4 },
  { note: 'A',  freq: 440.00, colour: '#8b5cf6', label: '🟣', idx: 5 },
  { note: 'B',  freq: 493.88, colour: '#ec4899', label: '💗', idx: 6 },
  { note: 'C2', freq: 523.25, colour: '#f43f5e', label: '❤️', idx: 7 },
];

/* ── Song definitions — sequences of bar indices ── */
const SONGS = [
  { name: 'Two Notes',         notes: [0, 2], tempo: 800 },
  { name: 'Three Notes',       notes: [0, 2, 4], tempo: 800 },
  { name: 'Up the Scale',      notes: [0, 1, 2, 3], tempo: 700 },
  { name: 'Down the Scale',    notes: [7, 6, 5, 4], tempo: 700 },
  { name: 'Hot Cross Buns',    notes: [2, 1, 0, 2, 1, 0, 0, 0, 1, 1, 2, 1, 0], tempo: 500 },
  { name: 'Mary Had a Lamb',   notes: [2, 1, 0, 1, 2, 2, 2, 1, 1, 1, 2, 4, 4], tempo: 450 },
  { name: 'Twinkle Twinkle',   notes: [0, 0, 4, 4, 5, 5, 4, 3, 3, 2, 2, 1, 1, 0], tempo: 500 },
  { name: 'Old MacDonald',     notes: [0, 0, 0, 4, 5, 5, 4, 2, 2, 1, 1, 0], tempo: 450 },
  { name: 'Full Scale Up',     notes: [0, 1, 2, 3, 4, 5, 6, 7], tempo: 500 },
  { name: 'Full Scale Down',   notes: [7, 6, 5, 4, 3, 2, 1, 0], tempo: 500 },
  { name: 'Ode to Joy',        notes: [2, 2, 3, 4, 4, 3, 2, 1, 0, 0, 1, 2, 2, 1, 1], tempo: 400 },
  { name: 'Free Play!',        notes: [], tempo: 0 },
];

const LEVEL_LABELS = ['🎵','🎵','⬆️','⬇️','🌭','🐑','⭐','🐄','🎹','🎹','🎶','🆓'];

/* ── Level definitions ── */
const LEVELS = SONGS.map((song, i) => ({
  id: i + 1,
  label: LEVEL_LABELS[i],
  song,
  isFreePlay: song.notes.length === 0,
}));

/* ── Shared background ── */
function StageBackground() {
  return (
    <div className="absolute inset-0"
      style={{ background: 'linear-gradient(180deg, #312e81 0%, #4338ca 40%, #3730a3 100%)' }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: '140%', height: '50%',
          background: 'conic-gradient(from 180deg at 50% 0%, transparent 30%, rgba(139,92,246,0.06) 45%, rgba(139,92,246,0.12) 50%, rgba(139,92,246,0.06) 55%, transparent 70%)',
        }} />
      <div className="absolute bottom-0 left-0 right-0 h-1/4 z-0"
        style={{ background: 'linear-gradient(to top, rgba(139,92,246,0.1) 0%, transparent 100%)' }} />
    </div>
  );
}

/* ── Free play mode (original xylophone) ── */
function FreePlayLevel({ onBack }) {
  const [activeIdx, setActiveIdx] = useState(null);
  const [noteCount, setNoteCount] = useState(0);
  const [floatingNotes, setFloatingNotes] = useState([]);
  const nextNoteId = useRef(0);
  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();

  const tapBar = useCallback((bar, idx, e) => {
    playXylophone(bar.freq);
    setActiveIdx(idx);
    setTimeout(() => setActiveIdx(null), 200);

    if (e?.clientX) {
      burst(e.clientX, e.clientY, { count: 6, spread: 35, colors: [bar.colour, '#facc15', '#fff'], shapes: ['circle', 'star'] });
    }

    setNoteCount(n => {
      const next = n + 1;
      if (next % 16 === 0) { playCelebrate(); peek('excited'); }
      else if (next % 8 === 0) { playSuccess(); peek('happy'); }
      return next;
    });

    const rect = e?.currentTarget?.getBoundingClientRect();
    if (rect) {
      const id = nextNoteId.current++;
      setFloatingNotes(prev => [...prev.slice(-12), { id, x: rect.left + rect.width / 2, y: rect.top, colour: bar.colour }]);
      setTimeout(() => setFloatingNotes(prev => prev.filter(n => n.id !== id)), 1500);
    }
  }, [burst, peek]);

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center">
      <StageBackground />
      <button onPointerDown={onBack}
        className="fixed top-3 left-3 z-50 w-14 h-14 rounded-full bg-white/20 backdrop-blur-md
                   flex items-center justify-center border border-white/30 active:scale-90 transition-transform"
        style={{ touchAction: 'none' }}>
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <path d="M15 18l-6-6 6-6" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <h2 className="font-heading text-white/80 text-lg mb-2 z-10">🆓 Free Play!</h2>
      {noteCount > 0 && (
        <div className="absolute top-4 right-4 z-20 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1
                        font-heading text-white text-sm border border-white/10">
          ♪ {noteCount}
        </div>
      )}

      <XylophoneBars activeIdx={activeIdx} onTap={tapBar} />

      {floatingNotes.map(n => (
        <div key={n.id} className="fixed pointer-events-none text-2xl z-30"
          style={{ left: n.x - 12, top: n.y, color: n.colour,
            animation: 'float-note 1.5s ease-out forwards', textShadow: `0 0 10px ${n.colour}` }}>
          {['♪', '♫', '♬'][n.id % 3]}
        </div>
      ))}

      <ParticleLayer />
      <ArthurPeekLayer />
    </div>
  );
}

/* ── Follow-along song level ── */
function SongLevel({ level, onComplete, onBack }) {
  const { song } = level;
  const [phase, setPhase] = useState('demo'); // demo | play | correct | wrong | won
  const [demoIdx, setDemoIdx] = useState(0);
  const [playIdx, setPlayIdx] = useState(0);
  const [activeIdx, setActiveIdx] = useState(null);
  const [highlightIdx, setHighlightIdx] = useState(null);
  const [mistakes, setMistakes] = useState(0);
  const [floatingNotes, setFloatingNotes] = useState([]);
  const nextNoteId = useRef(0);
  const { burst, ParticleLayer } = useParticleBurst();
  const { peek, ArthurPeekLayer } = useArthurPeek();
  const { celebrate, CelebrationLayer } = useCelebration();

  // Demo playback
  useEffect(() => {
    if (phase !== 'demo') return;
    if (demoIdx >= song.notes.length) {
      // Demo finished, now player's turn
      setTimeout(() => {
        setPhase('play');
        setPlayIdx(0);
        setHighlightIdx(song.notes[0]);
      }, 500);
      return;
    }

    const barIdx = song.notes[demoIdx];
    const timer = setTimeout(() => {
      playXylophone(BARS[barIdx].freq);
      setActiveIdx(barIdx);
      setTimeout(() => setActiveIdx(null), 300);
      setDemoIdx(d => d + 1);
    }, demoIdx === 0 ? 600 : song.tempo);

    return () => clearTimeout(timer);
  }, [phase, demoIdx, song]);

  // Show hint for current note
  useEffect(() => {
    if (phase === 'play' && playIdx < song.notes.length) {
      setHighlightIdx(song.notes[playIdx]);
    } else {
      setHighlightIdx(null);
    }
  }, [phase, playIdx, song.notes]);

  const tapBar = useCallback((bar, idx, e) => {
    if (phase !== 'play') return;

    playXylophone(bar.freq);
    setActiveIdx(idx);
    setTimeout(() => setActiveIdx(null), 200);

    // Floating note
    const rect = e?.currentTarget?.getBoundingClientRect();
    if (rect) {
      const id = nextNoteId.current++;
      setFloatingNotes(prev => [...prev.slice(-12), { id, x: rect.left + rect.width / 2, y: rect.top, colour: bar.colour }]);
      setTimeout(() => setFloatingNotes(prev => prev.filter(n => n.id !== id)), 1500);
    }

    const expected = song.notes[playIdx];
    if (idx === expected) {
      // Correct note!
      if (e?.clientX) {
        burst(e.clientX, e.clientY, { count: 6, spread: 30, colors: [bar.colour, '#facc15'], shapes: ['star'] });
      }

      const nextIdx = playIdx + 1;
      if (nextIdx >= song.notes.length) {
        // Song complete!
        setPhase('won');
        playSuccess();
        const starsEarned = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
        celebrate({ duration: 3000 });
        peek('excited');
        setTimeout(() => onComplete(starsEarned), 3200);
      } else {
        setPlayIdx(nextIdx);
      }
    } else {
      // Wrong note
      playBoing();
      setMistakes(m => m + 1);
      setPhase('wrong');
      setTimeout(() => setPhase('play'), 400);
    }
  }, [phase, playIdx, song.notes, mistakes, burst, peek, celebrate, onComplete]);

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center">
      <StageBackground />

      <button onPointerDown={onBack}
        className="fixed top-3 left-3 z-50 w-14 h-14 rounded-full bg-white/20 backdrop-blur-md
                   flex items-center justify-center border border-white/30 active:scale-90 transition-transform"
        style={{ touchAction: 'none' }}>
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <path d="M15 18l-6-6 6-6" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Song title */}
      <h2 className="font-heading text-white/80 text-lg mb-1 z-10">
        🎵 {song.name}
      </h2>

      {/* Phase indicator */}
      <div className="z-10 mb-2">
        {phase === 'demo' && (
          <div className="bg-amber-400/20 backdrop-blur-sm rounded-full px-4 py-1 border border-amber-400/30">
            <span className="font-heading text-amber-200 text-sm animate-pulse">👀 Watch & Listen...</span>
          </div>
        )}
        {phase === 'play' && (
          <div className="bg-green-400/20 backdrop-blur-sm rounded-full px-4 py-1 border border-green-400/30">
            <span className="font-heading text-green-200 text-sm">🎹 Your turn! ({playIdx + 1}/{song.notes.length})</span>
          </div>
        )}
      </div>

      {/* Replay demo button */}
      {phase === 'play' && (
        <button onPointerDown={() => { setPhase('demo'); setDemoIdx(0); }}
          className="absolute top-4 right-4 z-20 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1
                     font-heading text-white text-sm border border-white/10 active:scale-90 transition-transform">
          🔄
        </button>
      )}

      <XylophoneBars activeIdx={activeIdx} highlightIdx={highlightIdx} onTap={tapBar} />

      {/* Progress bar for song */}
      {phase === 'play' && (
        <div className="relative z-10 w-full max-w-2xl mx-4 mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-300 bg-gradient-to-r from-amber-400 to-green-400"
            style={{ width: `${(playIdx / song.notes.length) * 100}%` }} />
        </div>
      )}

      {floatingNotes.map(n => (
        <div key={n.id} className="fixed pointer-events-none text-2xl z-30"
          style={{ left: n.x - 12, top: n.y, color: n.colour,
            animation: 'float-note 1.5s ease-out forwards', textShadow: `0 0 10px ${n.colour}` }}>
          {['♪', '♫', '♬'][n.id % 3]}
        </div>
      ))}

      <ParticleLayer />
      <ArthurPeekLayer />
      <CelebrationLayer />
    </div>
  );
}

/* ── Shared xylophone bars component ── */
function XylophoneBars({ activeIdx, highlightIdx, onTap }) {
  return (
    <>
      <div className="relative z-10 flex items-end justify-center gap-1.5 sm:gap-2 px-4 w-full max-w-2xl"
        style={{ height: '65vh' }}>
        {BARS.map((bar, i) => {
          const isActive = activeIdx === i;
          const isHighlighted = highlightIdx === i;
          const heightPct = 100 - (i * 7);

          return (
            <button key={bar.note} onPointerDown={(e) => onTap(bar, i, e)}
              className="flex-1 rounded-t-2xl rounded-b-lg relative overflow-hidden transition-all
                         shadow-lg border-2 border-white/10 cursor-pointer"
              style={{
                height: `${heightPct}%`,
                backgroundColor: bar.colour,
                transform: isActive ? 'scaleY(0.95)' : 'scaleY(1)',
                transformOrigin: 'bottom',
                filter: isActive ? 'brightness(1.3)' : isHighlighted ? 'brightness(1.15)' : 'brightness(1)',
                boxShadow: isActive
                  ? `0 0 30px ${bar.colour}80, 0 0 60px ${bar.colour}40, inset 0 2px 20px rgba(255,255,255,0.3)`
                  : isHighlighted
                    ? `0 0 20px ${bar.colour}60, 0 0 40px ${bar.colour}30, inset 0 2px 12px rgba(255,255,255,0.2)`
                    : `0 4px 12px rgba(0,0,0,0.3), inset 0 2px 8px rgba(255,255,255,0.15)`,
                touchAction: 'none',
                animation: isHighlighted ? 'hint-glow 1s ease-in-out infinite' : 'none',
              }}>
              <div className="absolute top-0 left-0 right-0 h-1/3 rounded-t-2xl"
                style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%)' }} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 flex flex-col gap-1.5 opacity-20">
                <div className="h-0.5 bg-white rounded-full" />
                <div className="h-0.5 bg-white rounded-full mx-1" />
                <div className="h-0.5 bg-white rounded-full mx-2" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Xylophone frame base */}
      <div className="relative z-10 w-full max-w-2xl mx-4 h-3 bg-amber-800 rounded-b-xl shadow-xl"
        style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.5), inset 0 -1px 3px rgba(0,0,0,0.3)' }}>
        <div className="absolute inset-x-0 top-0 h-1 bg-amber-600 rounded-t-sm" />
      </div>
    </>
  );
}

/* ── Main export with level selection ── */
export default function Xylophone() {
  const {
    currentLevel, stars, highestUnlocked, totalLevels,
    setLevel, completeLevel, backToLevels,
  } = useLevelProgression('xylophone', LEVELS.length);

  const handleComplete = useCallback((starsEarned) => {
    completeLevel(currentLevel, starsEarned);
    if (currentLevel >= totalLevels) {
      backToLevels();
    }
  }, [currentLevel, totalLevels, completeLevel, backToLevels]);

  if (currentLevel === null) {
    return (
      <LevelSelect
        title="🎵 Xylophone"
        totalLevels={totalLevels}
        highestUnlocked={highestUnlocked}
        stars={stars}
        onSelect={setLevel}
        bg="linear-gradient(180deg, #312e81 0%, #4338ca 50%, #3730a3 100%)"
        levelLabels={LEVEL_LABELS}
      />
    );
  }

  const level = LEVELS[currentLevel - 1];

  if (level.isFreePlay) {
    return <FreePlayLevel key={currentLevel} onBack={backToLevels} />;
  }

  return (
    <SongLevel
      key={currentLevel}
      level={level}
      onComplete={handleComplete}
      onBack={backToLevels}
    />
  );
}
