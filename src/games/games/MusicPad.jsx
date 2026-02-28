import { useCallback, useState } from 'react';
import BackButton from '../components/BackButton';
import { playPiano, playHarp, playDrum, playXylophone } from '../hooks/useSound';

const INSTRUMENTS = [
  { id: 'piano',      emoji: '🎹', label: 'Piano',      play: playPiano },
  { id: 'harp',       emoji: '🪕', label: 'Harp',       play: playHarp },
  { id: 'drums',      emoji: '🥁', label: 'Drums',      play: playDrum },
  { id: 'xylophone',  emoji: '🎵', label: 'Xylophone',  play: playXylophone },
];

// C major scale + high C
const PADS = [
  { note: 'C',  freq: 261.63, color: 'from-red-400 to-red-600' },
  { note: 'D',  freq: 293.66, color: 'from-orange-400 to-orange-600' },
  { note: 'E',  freq: 329.63, color: 'from-yellow-400 to-yellow-600' },
  { note: 'F',  freq: 349.23, color: 'from-green-400 to-green-600' },
  { note: 'G',  freq: 392.00, color: 'from-sky to-blue-600' },
  { note: 'A',  freq: 440.00, color: 'from-indigo-400 to-indigo-600' },
  { note: 'B',  freq: 493.88, color: 'from-purple-400 to-purple-600' },
  { note: 'C2', freq: 523.25, color: 'from-pink-400 to-pink-600' },
];

export default function MusicPad() {
  const [active, setActive] = useState(null);
  const [instrument, setInstrument] = useState('piano');

  const currentInstrument = INSTRUMENTS.find(i => i.id === instrument);

  const tap = useCallback((pad) => {
    currentInstrument.play(pad.freq);
    setActive(pad.note);
    setTimeout(() => setActive(null), 300);
  }, [currentInstrument]);

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-purple-900 to-night flex flex-col overflow-hidden">
      <BackButton />

      {/* Instrument picker */}
      <div className="relative z-10 flex justify-center gap-2 px-4 pt-16 pb-2">
        {INSTRUMENTS.map(inst => (
          <button
            key={inst.id}
            onClick={() => setInstrument(inst.id)}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all
                       ${instrument === inst.id
                         ? 'bg-white/20 ring-2 ring-sun scale-105 shadow-lg shadow-sun/30'
                         : 'bg-white/5 opacity-70'}`}
          >
            <span className="text-3xl">{inst.emoji}</span>
            <span className="text-xs font-heading text-white">{inst.label}</span>
          </button>
        ))}
      </div>

      {/* Pads */}
      <div className="flex-1 grid grid-cols-2 gap-3 p-4">
        {PADS.map(pad => (
          <button
            key={pad.note}
            onPointerDown={() => tap(pad)}
            className={`game-card bg-gradient-to-br ${pad.color} flex items-center justify-center
                       text-5xl transition-all duration-150
                       ${active === pad.note ? 'scale-95 brightness-125 shadow-2xl' : ''}`}
          >
            {currentInstrument.emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
