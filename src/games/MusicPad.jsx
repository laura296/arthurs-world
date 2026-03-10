import { useCallback, useRef, useState } from 'react';
import BackButton from '../components/BackButton';
import { playPiano, playHarp, playDrum, playXylophone } from '../hooks/useSound';
import { useParticleBurst } from '../components/ParticleBurst';
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

// Simple melodies as note indices into NATURAL_NOTES (C=0, D=1, E=2, F=3, G=4, A=5, B=6, C2=7)
// Twinkle Twinkle Little Star
const DEMO_MELODY = [0, 0, 4, 4, 5, 5, 4, -1, 3, 3, 2, 2, 1, 1, 0];

export default function MusicPad() {
  const [active, setActive] = useState(null);
  const [instrument, setInstrument] = useState('piano');
  const [playing, setPlaying] = useState(false);
  const demoRef = useRef(null);
  const { burst, ParticleLayer } = useParticleBurst();

  const currentInstrument = INSTRUMENTS.find(i => i.id === instrument);

  const tap = useCallback((pad, e) => {
    currentInstrument.play(pad.freq);
    setActive(pad.note);
    setTimeout(() => setActive(null), 300);
    if (e?.clientX) {
      const theme = PARTICLE_THEMES[instrument];
      burst(e.clientX, e.clientY, {
        count: 6, spread: 35,
        ...theme,
      });
    }
  }, [currentInstrument, instrument, burst]);

  const playDemo = useCallback(() => {
    if (playing) {
      // Stop current demo
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
        return;
      }
      const noteIdx = DEMO_MELODY[i];
      if (noteIdx >= 0) {
        const note = NATURAL_NOTES[noteIdx];
        inst.play(note.freq);
        setActive(note.note);
        setTimeout(() => setActive(null), 250);
      }
      i++;
      demoRef.current = setTimeout(playNext, 350);
    };
    playNext();
  }, [instrument, playing]);

  const Layout = LAYOUT_MAP[instrument];

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      <BackButton />

      {/* Instrument picker + demo button */}
      <div className="relative z-10 flex justify-center items-end gap-2 px-4 pt-16 pb-2
                      bg-gradient-to-b from-black/40 to-transparent">
        {INSTRUMENTS.map(inst => (
          <button
            key={inst.id}
            onClick={() => { setInstrument(inst.id); if (playing) { clearTimeout(demoRef.current); setPlaying(false); setActive(null); } }}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all
                       ${instrument === inst.id
                         ? 'bg-white/20 ring-2 ring-sun scale-105 shadow-lg shadow-sun/30'
                         : 'bg-white/5 opacity-70'}`}
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
    </div>
  );
}
