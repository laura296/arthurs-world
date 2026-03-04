// C major scale (shared by all instruments)
export const NATURAL_NOTES = [
  { note: 'C',  freq: 261.63, color: 'from-red-400 to-red-600',       hex: '#f87171' },
  { note: 'D',  freq: 293.66, color: 'from-orange-400 to-orange-600', hex: '#fb923c' },
  { note: 'E',  freq: 329.63, color: 'from-yellow-400 to-yellow-600', hex: '#facc15' },
  { note: 'F',  freq: 349.23, color: 'from-green-400 to-green-600',   hex: '#4ade80' },
  { note: 'G',  freq: 392.00, color: 'from-sky to-blue-600',          hex: '#38bdf8' },
  { note: 'A',  freq: 440.00, color: 'from-indigo-400 to-indigo-600', hex: '#818cf8' },
  { note: 'B',  freq: 493.88, color: 'from-purple-400 to-purple-600', hex: '#a78bfa' },
  { note: 'C2', freq: 523.25, color: 'from-pink-400 to-pink-600',     hex: '#f472b6' },
];

// Piano sharps/flats (between natural keys)
export const SHARP_NOTES = [
  { note: 'C#', freq: 277.18, position: 0 },  // between C and D
  { note: 'D#', freq: 311.13, position: 1 },  // between D and E
  // no sharp between E and F
  { note: 'F#', freq: 369.99, position: 3 },  // between F and G
  { note: 'G#', freq: 415.30, position: 4 },  // between G and A
  { note: 'A#', freq: 466.16, position: 5 },  // between A and B
];
