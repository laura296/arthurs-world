# Music Pad Instrument Visuals — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform MusicPad from generic colored pads into 4 visually distinct instrument layouts (piano keys, harp strings, drum circles, xylophone bars) with matching backgrounds and tap animations.

**Architecture:** Each instrument gets its own layout component in `src/games/music-pad/`. The parent `MusicPad.jsx` orchestrates instrument selection and renders the active layout. Shared note data, sound functions, and particle system are passed as props. New CSS keyframes for instrument-specific animations (string wobble, key press, bar bounce) go in `index.css`.

**Tech Stack:** React, Tailwind CSS, Web Audio API (existing `useSound.js`), `useParticleBurst` hook.

---

### Task 1: Scaffold music-pad folder and extract note data

**Files:**
- Create: `src/games/music-pad/noteData.js`
- Modify: `src/games/MusicPad.jsx`

**Step 1: Create `src/games/music-pad/noteData.js`**

This file holds all note definitions shared across instruments plus piano-specific sharps.

```js
// C major scale (shared by all instruments)
export const NATURAL_NOTES = [
  { note: 'C',  freq: 261.63, color: 'from-red-400 to-red-600',    hex: '#f87171' },
  { note: 'D',  freq: 293.66, color: 'from-orange-400 to-orange-600', hex: '#fb923c' },
  { note: 'E',  freq: 329.63, color: 'from-yellow-400 to-yellow-600', hex: '#facc15' },
  { note: 'F',  freq: 349.23, color: 'from-green-400 to-green-600',  hex: '#4ade80' },
  { note: 'G',  freq: 392.00, color: 'from-sky to-blue-600',        hex: '#38bdf8' },
  { note: 'A',  freq: 440.00, color: 'from-indigo-400 to-indigo-600', hex: '#818cf8' },
  { note: 'B',  freq: 493.88, color: 'from-purple-400 to-purple-600', hex: '#a78bfa' },
  { note: 'C2', freq: 523.25, color: 'from-pink-400 to-pink-600',   hex: '#f472b6' },
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
```

**Step 2: Verify MusicPad still renders**

Run: `npm run dev` and navigate to music pad to confirm it still loads (no changes to MusicPad.jsx yet — just data extraction).

**Step 3: Commit**

```bash
git add src/games/music-pad/noteData.js
git commit -m "feat(music-pad): extract note data to shared module"
```

---

### Task 2: Build the Piano layout component

**Files:**
- Create: `src/games/music-pad/PianoLayout.jsx`

**Step 1: Create `src/games/music-pad/PianoLayout.jsx`**

Piano renders a classic keyboard: 8 white keys spanning full width, 5 black keys overlaid.

```jsx
import { NATURAL_NOTES, SHARP_NOTES } from './noteData';

export default function PianoLayout({ active, onTap, playFn }) {
  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-amber-950 to-stone-900 relative">
      {/* White keys row */}
      <div className="flex-1 flex gap-[2px] px-1 pb-2 pt-4 relative">
        {NATURAL_NOTES.map((note, i) => (
          <button
            key={note.note}
            onPointerDown={(e) => onTap(note, e)}
            className={`flex-1 bg-gradient-to-b from-white to-gray-100 rounded-b-xl
                       flex items-end justify-center pb-3 transition-all duration-100
                       shadow-md border border-gray-200
                       ${active === note.note
                         ? 'translate-y-1 from-gray-200 to-gray-300 shadow-inner'
                         : 'hover:from-gray-50'}`}
          >
            <span className={`text-sm font-heading transition-colors
                            ${active === note.note ? 'text-purple-600' : 'text-gray-400'}`}>
              {note.note}
            </span>
          </button>
        ))}

        {/* Black keys overlaid */}
        <div className="absolute inset-x-1 top-4 bottom-[40%] flex pointer-events-none">
          {NATURAL_NOTES.slice(0, -1).map((_, i) => {
            const sharp = SHARP_NOTES.find(s => s.position === i);
            if (!sharp) return <div key={i} className="flex-1" />;
            return (
              <div key={sharp.note} className="flex-1 flex justify-end">
                <button
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    onTap(sharp, e);
                  }}
                  className={`pointer-events-auto w-[65%] bg-gradient-to-b from-gray-800 to-gray-950
                             rounded-b-lg shadow-lg transition-all duration-100 z-10
                             ${active === sharp.note
                               ? 'translate-y-1 from-gray-700 to-gray-800'
                               : ''}`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Verify by temporarily importing in MusicPad**

Visually check the piano renders correctly.

**Step 3: Commit**

```bash
git add src/games/music-pad/PianoLayout.jsx
git commit -m "feat(music-pad): add piano keyboard layout component"
```

---

### Task 3: Build the Harp layout component

**Files:**
- Create: `src/games/music-pad/HarpLayout.jsx`
- Modify: `src/index.css` (add string wobble keyframe)

**Step 1: Add string wobble keyframe to `src/index.css`**

After the existing `@keyframes rippleExpand` block, add:

```css
@keyframes stringWobble {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-4px); }
  40% { transform: translateX(3px); }
  60% { transform: translateX(-2px); }
  80% { transform: translateX(1px); }
}
```

**Step 2: Create `src/games/music-pad/HarpLayout.jsx`**

Harp: vertical strings on a midnight blue background, graduated length, gold-to-silver gradient.

```jsx
import { useState } from 'react';
import { NATURAL_NOTES } from './noteData';

const STRING_COLORS = [
  '#fbbf24', '#f59e0b', '#d4a574', '#c9b896',
  '#b8c4c8', '#a8b4c0', '#98a8b8', '#c0c0c0',
];

export default function HarpLayout({ active, onTap }) {
  return (
    <div className="flex-1 flex items-end gap-1 px-6 pb-6 pt-4 relative
                    bg-gradient-to-b from-indigo-950 to-slate-950">
      {/* Curved frame hint — left arc */}
      <div className="absolute left-2 top-8 bottom-8 w-3 rounded-full
                      bg-gradient-to-b from-amber-700 to-amber-900 opacity-60" />

      {NATURAL_NOTES.map((note, i) => {
        const heightPct = 95 - i * 8;  // tallest on left
        const isActive = active === note.note;
        return (
          <button
            key={note.note}
            onPointerDown={(e) => onTap(note, e)}
            className="flex-1 flex flex-col items-center justify-end gap-2 relative"
            style={{ height: `${heightPct}%` }}
          >
            {/* String */}
            <div
              className="w-[3px] flex-1 rounded-full transition-all duration-100"
              style={{
                backgroundColor: STRING_COLORS[i],
                boxShadow: isActive ? `0 0 12px ${STRING_COLORS[i]}` : 'none',
                animation: isActive ? 'stringWobble 0.4s ease-in-out' : 'none',
              }}
            />
            {/* Note label */}
            <span className={`text-xs font-heading transition-colors
                            ${isActive ? 'text-amber-300' : 'text-white/50'}`}>
              {note.note}
            </span>
          </button>
        );
      })}
    </div>
  );
}
```

**Step 3: Commit**

```bash
git add src/games/music-pad/HarpLayout.jsx src/index.css
git commit -m "feat(music-pad): add harp strings layout component"
```

---

### Task 4: Build the Drums layout component

**Files:**
- Create: `src/games/music-pad/DrumsLayout.jsx`

**Step 1: Create `src/games/music-pad/DrumsLayout.jsx`**

Drums: circular pads in a kit-like arrangement on a dark wood stage.

```jsx
import { NATURAL_NOTES } from './noteData';

// Kit arrangement: label, size class, grid position
const DRUM_KIT = [
  { idx: 0, label: 'Hi-Hat',  size: 'w-20 h-20', row: 0, col: 0 },
  { idx: 1, label: 'Crash',   size: 'w-20 h-20', row: 0, col: 1 },
  { idx: 2, label: 'Ride',    size: 'w-20 h-20', row: 0, col: 2 },
  { idx: 3, label: 'Tom 1',   size: 'w-24 h-24', row: 1, col: 0 },
  { idx: 4, label: 'Snare',   size: 'w-24 h-24', row: 1, col: 1 },
  { idx: 5, label: 'Tom 2',   size: 'w-24 h-24', row: 1, col: 2 },
  { idx: 6, label: 'Bass',    size: 'w-28 h-28', row: 2, col: 0 },
  { idx: 7, label: 'Floor',   size: 'w-28 h-28', row: 2, col: 1 },
];

const DRUM_COLORS = [
  ['#eab308', '#ca8a04'], // hi-hat — gold
  ['#f97316', '#ea580c'], // crash — orange
  ['#eab308', '#a16207'], // ride — dark gold
  ['#ef4444', '#dc2626'], // tom 1 — red
  ['#f8fafc', '#cbd5e1'], // snare — white/silver
  ['#3b82f6', '#2563eb'], // tom 2 — blue
  ['#7c3aed', '#6d28d9'], // bass — purple
  ['#22c55e', '#16a34a'], // floor — green
];

export default function DrumsLayout({ active, onTap }) {
  const rows = [
    DRUM_KIT.filter(d => d.row === 0),
    DRUM_KIT.filter(d => d.row === 1),
    DRUM_KIT.filter(d => d.row === 2),
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 px-4
                    bg-gradient-to-b from-stone-800 to-stone-950">
      {rows.map((row, ri) => (
        <div key={ri} className="flex justify-center gap-3">
          {row.map(drum => {
            const note = NATURAL_NOTES[drum.idx];
            const [c1, c2] = DRUM_COLORS[drum.idx];
            const isActive = active === note.note;
            return (
              <button
                key={drum.idx}
                onPointerDown={(e) => onTap(note, e)}
                className={`${drum.size} rounded-full flex items-center justify-center
                           transition-all duration-100 shadow-lg
                           ${isActive ? 'scale-90 brightness-125' : ''}`}
                style={{
                  background: `radial-gradient(circle at 40% 35%, ${c1}, ${c2})`,
                  boxShadow: isActive
                    ? `0 0 20px ${c1}80, inset 0 0 10px rgba(0,0,0,0.3)`
                    : `0 4px 8px rgba(0,0,0,0.3), inset 0 0 10px rgba(0,0,0,0.2)`,
                }}
              >
                <span className="text-[10px] font-heading text-white/70 drop-shadow">
                  {drum.label}
                </span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/games/music-pad/DrumsLayout.jsx
git commit -m "feat(music-pad): add drum kit layout component"
```

---

### Task 5: Build the Xylophone layout component

**Files:**
- Create: `src/games/music-pad/XylophoneLayout.jsx`

**Step 1: Create `src/games/music-pad/XylophoneLayout.jsx`**

Xylophone: horizontal graduated bars with rainbow colors, mounting dots at ends.

```jsx
import { NATURAL_NOTES } from './noteData';

const BAR_COLORS = [
  'bg-red-500', 'bg-orange-500', 'bg-yellow-400', 'bg-green-500',
  'bg-sky-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500',
];

export default function XylophoneLayout({ active, onTap }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-2 px-4 py-4
                    bg-gradient-to-b from-amber-100 to-amber-200">
      {NATURAL_NOTES.map((note, i) => {
        const widthPct = 100 - i * 7; // widest at top (low note), narrowest at bottom
        const isActive = active === note.note;
        return (
          <button
            key={note.note}
            onPointerDown={(e) => onTap(note, e)}
            className="flex items-center gap-2 w-full"
            style={{ maxWidth: `${widthPct}%` }}
          >
            {/* Left mount */}
            <div className="w-3 h-3 rounded-full bg-gray-400 shrink-0 shadow-inner" />

            {/* Bar */}
            <div
              className={`flex-1 h-10 rounded-lg ${BAR_COLORS[i]} flex items-center justify-center
                         shadow-md transition-all duration-100
                         ${isActive ? '-translate-y-1 brightness-125 shadow-lg' : ''}`}
              style={{
                backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
              }}
            >
              <span className={`text-sm font-heading drop-shadow transition-all
                              ${isActive ? 'text-white scale-110' : 'text-white/80'}`}>
                {note.note}
              </span>
            </div>

            {/* Right mount */}
            <div className="w-3 h-3 rounded-full bg-gray-400 shrink-0 shadow-inner" />
          </button>
        );
      })}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/games/music-pad/XylophoneLayout.jsx
git commit -m "feat(music-pad): add xylophone bars layout component"
```

---

### Task 6: Build mini instrument icons for the picker

**Files:**
- Create: `src/games/music-pad/InstrumentIcon.jsx`

**Step 1: Create `src/games/music-pad/InstrumentIcon.jsx`**

Tiny CSS icons replacing the emojis in the instrument picker.

```jsx
export default function InstrumentIcon({ id }) {
  switch (id) {
    case 'piano':
      return (
        <div className="flex gap-[1px] h-7 w-10 items-end">
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} className={`flex-1 rounded-b-sm
              ${i === 1 || i === 3
                ? 'bg-gray-800 h-[60%] z-10 -mx-[2px] rounded-b-md'
                : 'bg-white h-full'}`}
            />
          ))}
        </div>
      );
    case 'harp':
      return (
        <div className="relative h-7 w-9 flex items-end justify-center gap-[3px]">
          <div className="absolute left-0 top-0 bottom-1 w-[2px] rounded-full bg-amber-600" />
          <div className="absolute left-0 bottom-0 right-1 h-[2px] rounded-full bg-amber-600" />
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="w-[1.5px] bg-amber-400 rounded-full"
                 style={{ height: `${90 - i * 15}%` }} />
          ))}
        </div>
      );
    case 'drums':
      return (
        <div className="relative h-7 w-10 flex items-center justify-center">
          <div className="w-5 h-5 rounded-full bg-gray-300 border-2 border-gray-500 absolute" />
          <div className="w-3 h-3 rounded-full bg-red-400 border border-red-600 absolute -top-0.5 -right-0.5" />
          {/* Sticks */}
          <div className="absolute w-[1.5px] h-5 bg-amber-700 rotate-[35deg] -top-0.5 -right-1" />
          <div className="absolute w-[1.5px] h-5 bg-amber-700 -rotate-[35deg] -top-0.5 -left-1" />
        </div>
      );
    case 'xylophone':
      return (
        <div className="flex flex-col items-center gap-[2px] h-7 w-10 justify-center">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="h-[3px] rounded-full"
                 style={{
                   width: `${100 - i * 15}%`,
                   backgroundColor: ['#f87171', '#facc15', '#38bdf8', '#a78bfa'][i],
                 }} />
          ))}
        </div>
      );
    default:
      return null;
  }
}
```

**Step 2: Commit**

```bash
git add src/games/music-pad/InstrumentIcon.jsx
git commit -m "feat(music-pad): add mini CSS instrument icons for picker"
```

---

### Task 7: Wire everything together in MusicPad.jsx

**Files:**
- Modify: `src/games/MusicPad.jsx`

**Step 1: Rewrite `src/games/MusicPad.jsx`**

Replace the flat pad grid with instrument-specific layouts. The parent component manages state and delegates rendering.

```jsx
import { useCallback, useState } from 'react';
import BackButton from '../components/BackButton';
import { playPiano, playHarp, playDrum, playXylophone } from '../hooks/useSound';
import { useParticleBurst } from '../components/ParticleBurst';
import InstrumentIcon from './music-pad/InstrumentIcon';
import PianoLayout from './music-pad/PianoLayout';
import HarpLayout from './music-pad/HarpLayout';
import DrumsLayout from './music-pad/DrumsLayout';
import XylophoneLayout from './music-pad/XylophoneLayout';

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

export default function MusicPad() {
  const [active, setActive] = useState(null);
  const [instrument, setInstrument] = useState('piano');
  const { burst, ParticleLayer } = useParticleBurst();

  const currentInstrument = INSTRUMENTS.find(i => i.id === instrument);

  const tap = useCallback((pad, e) => {
    currentInstrument.play(pad.freq);
    setActive(pad.note);
    setTimeout(() => setActive(null), 300);
    if (e?.clientX) {
      burst(e.clientX, e.clientY, {
        count: 6, spread: 35,
        colors: ['#8b5cf6', '#facc15', '#ec4899'],
        shapes: ['star', 'circle'],
      });
    }
  }, [currentInstrument, burst]);

  const Layout = LAYOUT_MAP[instrument];

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      <BackButton />

      {/* Instrument picker */}
      <div className="relative z-10 flex justify-center gap-2 px-4 pt-16 pb-2
                      bg-gradient-to-b from-black/40 to-transparent">
        {INSTRUMENTS.map(inst => (
          <button
            key={inst.id}
            onClick={() => setInstrument(inst.id)}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all
                       ${instrument === inst.id
                         ? 'bg-white/20 ring-2 ring-sun scale-105 shadow-lg shadow-sun/30'
                         : 'bg-white/5 opacity-70'}`}
          >
            <InstrumentIcon id={inst.id} />
            <span className="text-xs font-heading text-white">{inst.label}</span>
          </button>
        ))}
      </div>

      {/* Active instrument layout */}
      <Layout active={active} onTap={tap} />

      <ParticleLayer />
    </div>
  );
}
```

**Step 2: Run dev server and test all 4 instruments**

- Navigate to Music section
- Tap each instrument in picker — layout should change
- Tap notes — sound plays, particles burst, active state animates
- Verify piano black keys work (stop propagation)

**Step 3: Commit**

```bash
git add src/games/MusicPad.jsx
git commit -m "feat(music-pad): wire instrument layouts into MusicPad"
```

---

### Task 8: Visual polish and responsive tuning

**Files:**
- Modify: `src/games/music-pad/PianoLayout.jsx` (responsive sizing)
- Modify: `src/games/music-pad/DrumsLayout.jsx` (responsive sizing)
- Modify: `src/games/music-pad/HarpLayout.jsx` (touch target sizing)
- Modify: `src/games/music-pad/XylophoneLayout.jsx` (bar heights)

**Step 1: Test on mobile viewport (375px wide)**

Open dev tools, switch to mobile. Check each instrument for:
- Touch targets large enough (min 44px)
- No horizontal overflow
- Labels readable
- Drum circles don't overlap

**Step 2: Adjust sizing as needed**

Fix any responsive issues found. Drum circles may need size classes adjusted for small screens (e.g., `w-16 h-16 sm:w-20 sm:h-20`). Piano black keys may need width tuning. Harp string tap targets may need wider invisible hit zones.

**Step 3: Commit**

```bash
git add src/games/music-pad/
git commit -m "fix(music-pad): responsive tuning for mobile viewports"
```

---

### Task 9: Add instrument-specific particle colors

**Files:**
- Modify: `src/games/MusicPad.jsx`

**Step 1: Update particle colors per instrument**

In the `tap` callback, use instrument-specific particle colors:

```js
const PARTICLE_THEMES = {
  piano:     { colors: ['#ffffff', '#facc15', '#8b5cf6'], shapes: ['star', 'circle'] },
  harp:      { colors: ['#fbbf24', '#f59e0b', '#fef3c7'], shapes: ['star', 'diamond'] },
  drums:     { colors: ['#ef4444', '#f97316', '#eab308'], shapes: ['circle', 'star'] },
  xylophone: { colors: ['#38bdf8', '#a78bfa', '#f472b6'], shapes: ['circle', 'diamond'] },
};
```

Use `PARTICLE_THEMES[instrument]` in the burst call instead of the hardcoded colors.

**Step 2: Test — each instrument should burst different colored particles**

**Step 3: Commit**

```bash
git add src/games/MusicPad.jsx
git commit -m "feat(music-pad): instrument-specific particle colors"
```
