# Memory Match Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the simple emoji-based Memory Match with a fully themed 6-board memory game featuring card parades, peek mode, progressive difficulty, sidekick characters, and secret cards.

**Architecture:** Orchestrator pattern (matching BuildAScene). `MemoryMatch.jsx` manages game phase/state and renders sub-components: ThemePicker, CardParade, GameBoard (with Card, Sidekick), WinCelebration. Card data lives in `cardData.js`. Progression persisted to localStorage.

**Tech Stack:** React 18, Vite, Tailwind CSS (custom animations), Web Audio API (existing useSound.js)

**Design doc:** `docs/plans/2026-02-28-memory-match-design.md`

---

### Task 1: Card Data Module

**Files:**
- Create: `src/games/memory-match/cardData.js`

**Step 1: Create the card data file**

This maps Laura's 20 characters per theme to existing sticker PNG filenames, plus 3 secrets per theme, difficulty levels, and sidekick definitions.

```js
// src/games/memory-match/cardData.js

// Difficulty levels — grid dimensions and unlock thresholds
export const LEVELS = [
  { id: 'tiny',     label: 'Tiny',     cols: 2, rows: 2, pairs: 2,  unlockAt: 0 },
  { id: 'little',   label: 'Little',   cols: 3, rows: 2, pairs: 3,  unlockAt: 5 },
  { id: 'growing',  label: 'Growing',  cols: 4, rows: 3, pairs: 6,  unlockAt: 10 },
  { id: 'big',      label: 'Big',      cols: 4, rows: 4, pairs: 8,  unlockAt: 15 },
  { id: 'champion', label: 'Champion', cols: 5, rows: 4, pairs: 10, unlockAt: 20 },
];

// Sidekick character per theme (uses existing sticker PNGs)
export const SIDEKICKS = {
  space:       { id: 'robot',     label: 'Robot',     sound: 'bleep' },
  sea:         { id: 'crab',      label: 'Crab',      sound: 'bubble' },
  jungle:      { id: 'monkey',    label: 'Monkey',    sound: 'squawk' },
  farm:        { id: 'chick',     label: 'Chick',     sound: 'cluck' },
  dinosaurs:   { id: 'baby-t-rex',label: 'Baby T-Rex',sound: 'roar' },
  'theme-park':{ id: 'clown',     label: 'Clown',     sound: 'pop' },
};

// Card character pools — id maps to sticker filename (without .png)
// sound maps to playStickerSound key
const card = (id, label, sound) => ({ id, label, sound });

export const THEMES = {
  space: {
    id: 'space',
    label: 'Space',
    emoji: '\u{1F680}',
    bg: 'from-indigo-900 to-purple-950',
    bgImage: '/arthurs-world/images/scenes/space/bg.png',
    cards: [
      card('rocket',              'Rocket',              'whoosh'),
      card('astronaut',           'Astronaut',           'bleep'),
      card('alien',               'Alien',               'bleep'),
      card('ufo',                 'UFO',                 'whoosh'),
      card('moon',                'Moon',                'whoosh'),
      card('earth',               'Earth',               'whoosh'),
      card('saturn',              'Saturn',              'whoosh'),
      card('comet',               'Comet',               'whoosh'),
      card('space-dog',           'Space Dog',           'bleep'),
      card('robot',               'Robot',               'bleep'),
      card('shooting-star',       'Shooting Star',       'whoosh'),
      card('satellite',           'Satellite',           'bleep'),
      card('baby-alien',          'Baby Alien',          'bleep'),
      card('meteor',              'Meteor',              'whoosh'),
      card('sun',                 'Sun',                 'whoosh'),
      card('lunar-lander',        'Lunar Lander',        'whoosh'),
      card('spacewalk-astronaut', 'Spacewalk Astronaut', 'bleep'),
      card('telescope',           'Telescope',           'bleep'),
      card('space-station',       'Space Station',       'bleep'),
      card('space-cat-helmet',    'Space Cat',           'bleep'),
    ],
    secrets: [
      card('space-cat-helmet',    'Space Cat in a Helmet',     'bleep'),
      card('alien-riding-rocket', 'Alien Riding a Rocket',     'whoosh'),
      card('astronaut-thumbs-up', 'Astronaut Thumbs Up',       'bleep'),
    ],
  },
  sea: {
    id: 'sea',
    label: 'Sea',
    emoji: '\u{1F30A}',
    bg: 'from-cyan-700 to-blue-950',
    bgImage: '/arthurs-world/images/scenes/sea/bg.png',
    cards: [
      card('clownfish',    'Clownfish',    'splash'),
      card('great-white',  'Shark',        'splash'),
      card('octopus',      'Octopus',      'splash'),
      card('jellyfish',    'Jellyfish',    'splash'),
      card('seahorse',     'Seahorse',     'bubble'),
      card('blue-whale',   'Whale',        'splash'),
      card('sea-turtle',   'Turtle',       'splash'),
      card('crab',         'Crab',         'bubble'),
      card('lobster',      'Lobster',      'bubble'),
      card('starfish',     'Starfish',     'bubble'),
      card('pufferfish',   'Pufferfish',   'bubble'),
      card('dolphin',      'Dolphin',      'splash'),
      card('narwhal',      'Narwhal',      'splash'),
      card('mermaid',      'Mermaid',      'splash'),
      card('diver',        'Diver',        'bubble'),
      card('submarine',    'Submarine',    'whoosh'),
      card('clam-pearl',   'Clam',         'bubble'),
      card('anglerfish',   'Anglerfish',   'splash'),
      card('manta-ray',    'Manta Ray',    'splash'),
      card('seahorse-bow-tie','Seahorse',  'bubble'),
    ],
    secrets: [
      card('narwhal-sunglasses',   'Narwhal with Sunglasses',   'splash'),
      card('baby-octopus-teacup',  'Baby Octopus in a Teacup',  'bubble'),
      card('mermaid-waving',       'Mermaid Waving',            'splash'),
    ],
  },
  jungle: {
    id: 'jungle',
    label: 'Jungle',
    emoji: '\u{1F33F}',
    bg: 'from-green-800 to-emerald-950',
    bgImage: '/arthurs-world/images/scenes/jungle/bg.png',
    cards: [
      card('lion',       'Lion',       'roar'),
      card('tiger',      'Tiger',      'roar'),
      card('elephant',   'Elephant',   'trumpet'),
      card('monkey',     'Monkey',     'squawk'),
      card('parrot',     'Parrot',     'squawk'),
      card('toucan',     'Toucan',     'squawk'),
      card('frog',       'Frog',       'ribbit'),
      card('chameleon',  'Chameleon',  'hiss'),
      card('snake',      'Snake',      'hiss'),
      card('crocodile',  'Crocodile',  'hiss'),
      card('hippo',      'Hippo',      'splash'),
      card('giraffe',    'Giraffe',    'trumpet'),
      card('sloth',      'Sloth',      'bleep'),
      card('flamingo',   'Flamingo',   'squawk'),
      card('lemur',      'Lemur',      'squawk'),
      card('butterfly',  'Butterfly',  'whoosh'),
      card('explorer',   'Explorer',   'bleep'),
      card('gorilla',    'Gorilla',    'roar'),
      card('macaw',      'Macaw',      'squawk'),
      card('firefly',    'Firefly',    'bleep'),
    ],
    secrets: [
      card('sloth-hammock',    'Sloth in a Hammock',       'bleep'),
      card('frog-umbrella',    'Frog with an Umbrella',    'ribbit'),
      card('parrot-party-hat', 'Parrot in a Party Hat',    'squawk'),
    ],
  },
  farm: {
    id: 'farm',
    label: 'Farm',
    emoji: '\u{1F33E}',
    bg: 'from-yellow-700 to-amber-900',
    bgImage: '/arthurs-world/images/scenes/farm/bg.png',
    cards: [
      card('cow',         'Cow',        'moo'),
      card('pig',         'Pig',        'oink'),
      card('sheep',       'Sheep',      'baa'),
      card('horse',       'Horse',      'neigh'),
      card('chicken',     'Chicken',    'cluck'),
      card('duck',        'Duck',       'squawk'),
      card('sheepdog',    'Dog',        'bleep'),
      card('barn-cat',    'Cat',        'bleep'),
      card('goat',        'Goat',       'baa'),
      card('rabbit',      'Rabbit',     'bleep'),
      card('donkey',      'Donkey',     'neigh'),
      card('rooster',     'Rooster',    'cluck'),
      card('tractor',     'Tractor',    'whoosh'),
      card('scarecrow',   'Scarecrow',  'whoosh'),
      card('farmer-male', 'Farmer',     'bleep'),
      card('windmill',    'Windmill',   'whoosh'),
      card('barn-owl',    'Barn Owl',   'squawk'),
      card('hedgehog',    'Hedgehog',   'bleep'),
      card('fox',         'Fox',        'bleep'),
      card('chick',       'Chick',      'cluck'),
    ],
    secrets: [
      card('pig-mud-bath',  'Pig in a Mud Bath',       'oink'),
      card('sheep-jumper',  'Sheep Wearing a Jumper',   'baa'),
      card('cow-flowers',   'Cow with Flowers',         'moo'),
    ],
  },
  dinosaurs: {
    id: 'dinosaurs',
    label: 'Dinosaurs',
    emoji: '\u{1F996}',
    bg: 'from-amber-800 to-orange-950',
    bgImage: '/arthurs-world/images/scenes/dinosaurs/bg.png',
    cards: [
      card('t-rex',             'T-Rex',             'roar'),
      card('triceratops',       'Triceratops',       'roar'),
      card('brachiosaurus',     'Brachiosaurus',     'trumpet'),
      card('stegosaurus',       'Stegosaurus',       'roar'),
      card('pterodactyl',       'Pterodactyl',       'squawk'),
      card('ankylosaurus',      'Ankylosaurus',      'roar'),
      card('diplodocus',        'Diplodocus',        'trumpet'),
      card('velociraptor',      'Velociraptor',      'hiss'),
      card('spinosaurus',       'Spinosaurus',       'roar'),
      card('baby-t-rex',        'Baby T-Rex',        'roar'),
      card('dino-egg-unhatched','Dino Egg',          'crunch'),
      card('caveman',           'Caveman',           'roar'),
      card('mammoth',           'Mammoth',           'trumpet'),
      card('sabre-tooth',       'Sabre-tooth Tiger',  'roar'),
      card('giant-dragonfly',   'Dragonfly',         'whoosh'),
      card('fossil-rock',       'Fossil',            'crunch'),
      card('meteor-incoming',   'Meteor',            'whoosh'),
      card('baby-dino-hatching','Baby Dino',         'crunch'),
      card('pachycephalosaurus','Pachycephalosaurus', 'roar'),
      card('dino-nest',         'Dino Nest',         'crunch'),
    ],
    secrets: [
      card('caveman-riding-dino',  'Caveman Riding a Dino',   'roar'),
      card('triceratops-bow-tie',  'Triceratops with Bow Tie','roar'),
      card('baby-t-rex-egg',       'Baby T-Rex in an Egg',    'roar'),
    ],
  },
  'theme-park': {
    id: 'theme-park',
    label: 'Theme Park',
    emoji: '\u{1F3A0}',
    bg: 'from-rose-700 to-pink-950',
    bgImage: '/arthurs-world/images/scenes/theme-park/bg.png',
    cards: [
      card('balloon-bunch',      'Balloon',         'pop'),
      card('candy-floss',        'Candy Floss',     'crunch'),
      card('ice-cream-cone',     'Ice Cream',       'crunch'),
      card('carousel-horse',     'Carousel Horse',  'whoosh'),
      card('clown',              'Clown',           'pop'),
      card('magician',           'Magician',        'sting'),
      card('popcorn-box',        'Popcorn',         'crunch'),
      card('bumper-car',         'Bumper Car',      'whoosh'),
      card('goldfish-bag',       'Goldfish',        'bubble'),
      card('teddy-bear-prize',   'Teddy Bear',      'bleep'),
      card('juggler',            'Juggler',         'whoosh'),
      card('acrobat',            'Acrobat',         'whoosh'),
      card('roller-coaster-car', 'Roller Coaster',  'whoosh'),
      card('ferris-wheel',       'Ferris Wheel',    'whoosh'),
      card('confetti-cannon',    'Confetti Cannon', 'pop'),
      card('toffee-apple',       'Toffee Apple',    'crunch'),
      card('rubber-duck',        'Rubber Duck',     'bubble'),
      card('strongman-bell',     'Strongman Bell',  'crunch'),
      card('party-hat',          'Party Hat',       'pop'),
      card('firework-burst',     'Firework',        'whoosh'),
    ],
    secrets: [
      card('clown-unicycle',     'Clown on a Unicycle',     'pop'),
      card('magician-rabbit',    'Magician Pulling Rabbit', 'sting'),
      card('bear-winning-goldfish','Bear Winning Goldfish', 'bleep'),
    ],
  },
};

// Storage keys
const PROGRESS_KEY = 'memory-match-progress';
const SECRETS_KEY = 'memory-match-secrets';

/** Load saved progression from localStorage */
export function loadProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

/** Save progression to localStorage */
export function saveProgress(progress) {
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress)); }
  catch { /* ignore */ }
}

/** Load discovered secrets from localStorage */
export function loadSecrets() {
  try {
    const raw = localStorage.getItem(SECRETS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

/** Save discovered secrets to localStorage */
export function saveSecrets(secrets) {
  try { localStorage.setItem(SECRETS_KEY, JSON.stringify(secrets)); }
  catch { /* ignore */ }
}

/** Get current level for a theme based on completions */
export function getLevelForTheme(themeId, progress) {
  const completions = progress[themeId]?.completions || 0;
  let level = LEVELS[0];
  for (const l of LEVELS) {
    if (completions >= l.unlockAt) level = l;
  }
  return level;
}

/** Shuffle array (Fisher-Yates) */
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Build a deck of cards for a game session */
export function buildDeck(themeId, level) {
  const theme = THEMES[themeId];
  if (!theme) return [];

  const pool = [...theme.cards];
  const { pairs } = level;

  // 1-in-4 chance of a secret card replacing one regular card
  let hasSecret = false;
  let secretCard = null;
  if (Math.random() < 0.25 && theme.secrets.length > 0) {
    secretCard = theme.secrets[Math.floor(Math.random() * theme.secrets.length)];
    hasSecret = true;
  }

  // Pick random characters
  const shuffledPool = shuffle(pool);
  const selected = shuffledPool.slice(0, hasSecret ? pairs - 1 : pairs);

  if (hasSecret && secretCard) {
    selected.push(secretCard);
  }

  // Create pairs
  let cardId = 0;
  const deck = [];
  for (const char of selected) {
    const isSecret = hasSecret && char.id === secretCard?.id;
    deck.push({ id: cardId++, characterId: char.id, label: char.label, sound: char.sound, flipped: false, matched: false, isSecret });
    deck.push({ id: cardId++, characterId: char.id, label: char.label, sound: char.sound, flipped: false, matched: false, isSecret });
  }

  return shuffle(deck);
}

/** Sticker image path helper */
export function stickerPath(themeId, stickerId) {
  return `/arthurs-world/images/scenes/${themeId}/stickers/${stickerId}.png`;
}
```

**Step 2: Commit**

```bash
git add src/games/memory-match/cardData.js
git commit -m "feat(memory-match): add card data module with 6 themes, levels, and deck builder"
```

---

### Task 2: New Sound — playFanfare

**Files:**
- Modify: `src/hooks/useSound.js` (add after `playStickerSound` around line 272)

**Step 1: Add playFanfare function**

Add this after the `playStickerSound` function:

```js
/** Fanfare — celebratory ascending arpeggio for board completion (3s) */
export function playFanfare() {
  if (globalMuted) return;
  const ctx = getCtx();
  // C major ascending: C4 E4 G4 C5 E5 G5 C6
  const notes = [262, 330, 392, 523, 659, 784, 1047];
  notes.forEach((freq, i) => {
    const t = ctx.currentTime + i * 0.15;
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc2.type = 'triangle';
    osc.frequency.value = freq;
    osc2.frequency.value = freq * 1.002; // slight detune for richness
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc2.start(t);
    osc.stop(t + 0.55);
    osc2.stop(t + 0.55);
  });
}
```

**Step 2: Commit**

```bash
git add src/hooks/useSound.js
git commit -m "feat(memory-match): add playFanfare celebratory sound"
```

---

### Task 3: Tailwind Animations for Memory Match

**Files:**
- Modify: `tailwind.config.js`

**Step 1: Add new animation/keyframe entries**

Add these to the `animation` object (after the Build-a-Scene animations):

```js
// Memory Match animations
'card-flip': 'cardFlip 0.3s ease-in-out forwards',
'card-unflip': 'cardUnflip 0.3s ease-in-out forwards',
'starburst': 'starburst 0.5s ease-out forwards',
'parade-enter': 'paradeEnter 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
'parade-exit': 'paradeExit 0.4s ease-in forwards',
'deal-card': 'dealCard 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) backwards',
'gold-shimmer': 'goldShimmer 0.8s ease-in-out',
'sidekick-jump': 'sidekickJump 0.5s ease-out',
'confetti-fall': 'confettiFall 2s linear forwards',
'peek-wave': 'peekWave 0.3s ease-in-out forwards',
```

Add these to the `keyframes` object:

```js
// Memory Match keyframes
cardFlip: {
  '0%': { transform: 'rotateY(0deg)' },
  '100%': { transform: 'rotateY(180deg)' },
},
cardUnflip: {
  '0%': { transform: 'rotateY(180deg)' },
  '100%': { transform: 'rotateY(0deg)' },
},
starburst: {
  '0%': { transform: 'scale(0)', opacity: '1' },
  '50%': { transform: 'scale(1.5)', opacity: '0.8' },
  '100%': { transform: 'scale(2)', opacity: '0' },
},
paradeEnter: {
  '0%': { transform: 'translateX(100vw) scale(0.5)', opacity: '0' },
  '100%': { transform: 'translateX(0) scale(1)', opacity: '1' },
},
paradeExit: {
  '0%': { transform: 'translateX(0) scale(1)', opacity: '1' },
  '100%': { transform: 'translateX(-100vw) scale(0.5)', opacity: '0' },
},
dealCard: {
  '0%': { transform: 'scale(0) rotate(-10deg)', opacity: '0' },
  '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
},
goldShimmer: {
  '0%': { backgroundPosition: '-200% 0' },
  '100%': { backgroundPosition: '200% 0' },
},
sidekickJump: {
  '0%, 100%': { transform: 'translateY(0) scale(1)' },
  '30%': { transform: 'translateY(-20px) scale(1.1)' },
  '60%': { transform: 'translateY(-5px) scale(1.05)' },
},
confettiFall: {
  '0%': { transform: 'translateY(-20px) rotate(0deg)', opacity: '1' },
  '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
},
peekWave: {
  '0%': { transform: 'rotateY(180deg)' },
  '100%': { transform: 'rotateY(0deg)' },
},
```

**Step 2: Commit**

```bash
git add tailwind.config.js
git commit -m "feat(memory-match): add card flip, parade, and celebration animations"
```

---

### Task 4: Card Component

**Files:**
- Create: `src/games/memory-match/Card.jsx`

**Step 1: Create the Card component**

This is the individual memory card with 3D flip animation, themed card back patterns, and sticker image fronts.

```jsx
// src/games/memory-match/Card.jsx
import { stickerPath } from './cardData';

// CSS patterns for each theme's card back
const CARD_BACKS = {
  space: 'bg-[#0f1b3d] bg-[radial-gradient(circle,_#fff_1px,_transparent_1px)] bg-[size:12px_12px]',
  sea: 'bg-[#1565C0] bg-[repeating-linear-gradient(45deg,transparent,transparent_8px,rgba(255,255,255,0.1)_8px,rgba(255,255,255,0.1)_16px)]',
  jungle: 'bg-[#1B5E20] bg-[repeating-linear-gradient(120deg,transparent,transparent_10px,rgba(255,255,255,0.05)_10px,rgba(255,255,255,0.05)_20px)]',
  farm: 'bg-[#FFF8E1] bg-[repeating-conic-gradient(#e8d5b7_0%_25%,#FFF8E1_0%_50%)] bg-[size:20px_20px]',
  dinosaurs: 'bg-[#5D4037] bg-[radial-gradient(circle,_rgba(255,235,180,0.3)_2px,_transparent_2px)] bg-[size:16px_16px]',
  'theme-park': 'bg-[#C62828] bg-[repeating-linear-gradient(90deg,transparent,transparent_12px,rgba(255,255,255,0.2)_12px,rgba(255,255,255,0.2)_24px)]',
};

export default function Card({ card, theme, onClick, dealDelay = 0 }) {
  const { flipped, matched, isSecret, characterId } = card;
  const faceUp = flipped || matched;
  const backPattern = CARD_BACKS[theme] || CARD_BACKS.space;

  return (
    <button
      onClick={onClick}
      disabled={faceUp}
      className="animate-deal-card"
      style={{
        animationDelay: `${dealDelay}ms`,
        perspective: '600px',
      }}
    >
      <div
        className={`relative w-full aspect-square transition-transform duration-300 ${faceUp ? '[transform:rotateY(180deg)]' : ''}`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Card Back (face-down) */}
        <div
          className={`absolute inset-0 rounded-2xl ${backPattern} border-2 border-white/20
                      flex items-center justify-center shadow-lg backface-hidden`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="text-2xl opacity-40">?</span>
        </div>

        {/* Card Front (face-up) */}
        <div
          className={`absolute inset-0 rounded-2xl bg-white shadow-lg flex items-center justify-center p-2
                      ${matched ? 'ring-4 ring-sun' : ''} ${isSecret && matched ? 'ring-4 ring-amber-400' : ''}`}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <img
            src={stickerPath(theme, characterId)}
            alt={card.label}
            className={`w-full h-full object-contain ${matched ? 'animate-scene-bounce' : ''}`}
            draggable={false}
          />
          {/* Secret gold shimmer overlay */}
          {isSecret && matched && (
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-amber-300/40 to-transparent animate-gold-shimmer bg-[size:200%_100%]" />
          )}
        </div>
      </div>

      {/* Starburst on match */}
      {matched && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 rounded-full bg-sun/30 animate-starburst" />
        </div>
      )}
    </button>
  );
}
```

**Step 2: Commit**

```bash
git add src/games/memory-match/Card.jsx
git commit -m "feat(memory-match): add Card component with 3D flip and themed backs"
```

---

### Task 5: Sidekick Component

**Files:**
- Create: `src/games/memory-match/Sidekick.jsx`

**Step 1: Create the Sidekick component**

Animated companion character that reacts to game events.

```jsx
// src/games/memory-match/Sidekick.jsx
import { useState, useEffect } from 'react';
import { SIDEKICKS, stickerPath } from './cardData';

export default function Sidekick({ theme, event }) {
  const [animClass, setAnimClass] = useState('');
  const sidekick = SIDEKICKS[theme];

  useEffect(() => {
    if (!event) return;

    const anims = {
      flip: 'animate-pop',
      match: 'animate-sidekick-jump',
      noMatch: 'animate-wiggle',
      secret: 'animate-dance',
      win: 'animate-dance',
      idle: 'animate-wiggle',
    };

    setAnimClass(anims[event] || '');
    const timer = setTimeout(() => setAnimClass(''), 1000);
    return () => clearTimeout(timer);
  }, [event]);

  if (!sidekick) return null;

  return (
    <div className={`w-16 h-16 ${animClass} transition-all`}>
      <img
        src={stickerPath(theme, sidekick.id)}
        alt={sidekick.label}
        className="w-full h-full object-contain drop-shadow-lg"
        draggable={false}
      />
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/games/memory-match/Sidekick.jsx
git commit -m "feat(memory-match): add Sidekick companion component"
```

---

### Task 6: ThemePicker Component

**Files:**
- Create: `src/games/memory-match/ThemePicker.jsx`

**Step 1: Create the ThemePicker**

2x3 grid of themed board cards, matching the BuildAScene ScenePicker style.

```jsx
// src/games/memory-match/ThemePicker.jsx
import { THEMES, SIDEKICKS, stickerPath, loadProgress, getLevelForTheme } from './cardData';
import Starfield from '../../components/Starfield';
import { playBoing } from '../../hooks/useSound';

const themeList = Object.values(THEMES);

export default function ThemePicker({ onSelectTheme }) {
  const progress = loadProgress();

  return (
    <div className="relative w-full h-full bg-night overflow-y-auto no-scrollbar">
      <Starfield />

      <div className="relative z-10 p-6 pt-12">
        <h2 className="text-3xl font-heading text-sun text-center mb-6 drop-shadow">
          Pick a board!
        </h2>

        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pb-8">
          {themeList.map((theme, i) => {
            const level = getLevelForTheme(theme.id, progress);
            const sidekick = SIDEKICKS[theme.id];
            return (
              <button
                key={theme.id}
                onClick={() => { playBoing(); onSelectTheme(theme.id); }}
                className={`game-card overflow-hidden bg-gradient-to-br ${theme.bg} flex flex-col
                           items-center justify-end min-h-[140px] animate-bounce-in p-0 relative`}
                style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'backwards' }}
              >
                {/* Background preview */}
                <img
                  src={theme.bgImage}
                  alt={theme.label}
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                {/* Sidekick in corner */}
                {sidekick && (
                  <img
                    src={stickerPath(theme.id, sidekick.id)}
                    alt={sidekick.label}
                    className="absolute top-2 right-2 w-10 h-10 object-contain animate-float drop-shadow-lg"
                  />
                )}
                {/* Label overlay */}
                <div className="relative z-10 w-full bg-gradient-to-t from-black/70 to-transparent p-3">
                  <span className="text-lg font-heading text-white drop-shadow flex items-center justify-center gap-2">
                    {theme.emoji} {theme.label}
                  </span>
                  <span className="text-xs text-white/60 font-body">{level.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/games/memory-match/ThemePicker.jsx
git commit -m "feat(memory-match): add ThemePicker with 2x3 themed board grid"
```

---

### Task 7: CardParade Component

**Files:**
- Create: `src/games/memory-match/CardParade.jsx`

**Step 1: Create the CardParade**

Pre-game character introduction — each character bounces across the screen one by one with sound.

```jsx
// src/games/memory-match/CardParade.jsx
import { useState, useEffect, useCallback } from 'react';
import { stickerPath, THEMES } from './cardData';
import { playStickerSound, playBoing } from '../../hooks/useSound';

export default function CardParade({ theme, characters, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [phase, setPhase] = useState('waiting'); // waiting | entering | center | exiting | done
  const themeData = THEMES[theme];

  // Advance through characters
  useEffect(() => {
    // Start first character after a brief pause
    const startTimer = setTimeout(() => {
      setCurrentIndex(0);
      setPhase('entering');
    }, 500);
    return () => clearTimeout(startTimer);
  }, []);

  useEffect(() => {
    if (currentIndex < 0 || currentIndex >= characters.length) return;

    if (phase === 'entering') {
      // After enter animation, move to center
      const timer = setTimeout(() => {
        setPhase('center');
        playStickerSound(characters[currentIndex].sound);
      }, 600);
      return () => clearTimeout(timer);
    }

    if (phase === 'center') {
      // Stay center for 1.5s then exit
      const timer = setTimeout(() => setPhase('exiting'), 1500);
      return () => clearTimeout(timer);
    }

    if (phase === 'exiting') {
      // After exit, advance to next or finish
      const timer = setTimeout(() => {
        if (currentIndex + 1 >= characters.length) {
          setPhase('done');
        } else {
          setCurrentIndex(i => i + 1);
          setPhase('entering');
        }
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, phase, characters]);

  const handleTap = useCallback(() => {
    if (phase === 'center' && currentIndex >= 0 && currentIndex < characters.length) {
      playStickerSound(characters[currentIndex].sound);
    }
  }, [phase, currentIndex, characters]);

  const handleSkip = useCallback(() => {
    onComplete();
  }, [onComplete]);

  // Done — notify parent
  useEffect(() => {
    if (phase === 'done') {
      const timer = setTimeout(onComplete, 800);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  const current = currentIndex >= 0 && currentIndex < characters.length ? characters[currentIndex] : null;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      {/* Theme background */}
      <img
        src={themeData?.bgImage}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />

      {/* Skip button */}
      <button
        onClick={handleSkip}
        className="absolute top-4 right-4 z-50 px-3 py-1 bg-white/20 backdrop-blur-sm
                   rounded-full text-sm text-white/60 font-body active:scale-90 transition-transform"
      >
        Skip
      </button>

      {/* Character display */}
      {current && (
        <button
          onClick={handleTap}
          className={`relative z-10 w-40 h-40 ${
            phase === 'entering' ? 'animate-parade-enter' :
            phase === 'exiting' ? 'animate-parade-exit' :
            phase === 'center' ? 'animate-float' : ''
          }`}
        >
          <img
            src={stickerPath(theme, current.characterId)}
            alt={current.label}
            className="w-full h-full object-contain drop-shadow-2xl"
            draggable={false}
          />
        </button>
      )}

      {/* Character name */}
      {current && phase === 'center' && (
        <p className="relative z-10 mt-4 text-2xl font-heading text-white drop-shadow-lg animate-bounce-in">
          {current.label}
        </p>
      )}

      {/* "Ready to play?" at end */}
      {phase === 'done' && (
        <p className="relative z-10 text-3xl font-heading text-sun drop-shadow-lg animate-bounce-in">
          Ready to play?
        </p>
      )}

      {/* Progress dots */}
      <div className="absolute bottom-8 flex gap-2">
        {characters.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${
              i <= currentIndex ? 'bg-sun scale-110' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/games/memory-match/CardParade.jsx
git commit -m "feat(memory-match): add CardParade pre-game character introduction"
```

---

### Task 8: GameBoard Component

**Files:**
- Create: `src/games/memory-match/GameBoard.jsx`

**Step 1: Create the GameBoard**

The main gameplay component — card grid, peek mode, sidekick, and game logic.

```jsx
// src/games/memory-match/GameBoard.jsx
import { useState, useCallback, useRef, useEffect } from 'react';
import Card from './Card';
import Sidekick from './Sidekick';
import { stickerPath } from './cardData';
import { playTap, playSuccess, playBoing, playSparkle, playSnap, playStickerSound } from '../../hooks/useSound';

export default function GameBoard({ theme, cards: initialCards, level, onWin, onBack }) {
  const [cards, setCards] = useState(initialCards);
  const [sidekickEvent, setSidekickEvent] = useState(null);
  const [peekActive, setPeekActive] = useState(false);
  const [matchCount, setMatchCount] = useState(0);
  const locked = useRef(false);
  const idleTimer = useRef(null);

  // Reset idle timer on any interaction
  const resetIdle = useCallback(() => {
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      setSidekickEvent('idle');
    }, 10000);
  }, []);

  useEffect(() => {
    resetIdle();
    return () => clearTimeout(idleTimer.current);
  }, [resetIdle]);

  const handleCardTap = useCallback((cardId) => {
    if (locked.current || peekActive) return;
    resetIdle();

    setCards(prev => {
      const card = prev.find(c => c.id === cardId);
      if (!card || card.flipped || card.matched) return prev;

      playTap();
      playStickerSound(card.sound);
      setSidekickEvent('flip');

      const updated = prev.map(c => c.id === cardId ? { ...c, flipped: true } : c);
      const flippedNow = updated.filter(c => c.flipped && !c.matched);

      if (flippedNow.length === 2) {
        locked.current = true;
        const [a, b] = flippedNow;

        if (a.characterId === b.characterId) {
          // Match!
          setTimeout(() => {
            if (a.isSecret) {
              playSparkle();
              setTimeout(() => playSuccess(), 200);
              setSidekickEvent('secret');
            } else {
              playSuccess();
              setSidekickEvent('match');
            }
            setCards(p => {
              const next = p.map(c =>
                c.id === a.id || c.id === b.id ? { ...c, matched: true } : c
              );
              if (next.every(c => c.matched)) {
                setTimeout(() => onWin(a.isSecret ? [a.characterId] : []), 800);
              }
              return next;
            });
            setMatchCount(m => m + 1);
            locked.current = false;
          }, 400);
        } else {
          // No match — flip back after 1.5s
          setTimeout(() => {
            playBoing();
            setSidekickEvent('noMatch');
            setCards(p => p.map(c =>
              c.id === a.id || c.id === b.id ? { ...c, flipped: false } : c
            ));
            locked.current = false;
          }, 1500);
        }
      }

      return updated;
    });
  }, [peekActive, onWin, resetIdle]);

  // Peek mode
  const handlePeek = useCallback(() => {
    if (locked.current || peekActive) return;
    locked.current = true;
    setPeekActive(true);
    playSparkle();

    // Show all cards
    setCards(prev => prev.map(c => c.matched ? c : { ...c, flipped: true }));

    // Flip back after 3 seconds with stagger
    setTimeout(() => {
      setCards(prev => prev.map((c, i) => {
        if (c.matched) return c;
        // Stagger the flip-back
        setTimeout(() => {
          setCards(p => p.map(card =>
            card.id === c.id && !card.matched ? { ...card, flipped: false } : card
          ));
        }, i * 50);
        return c;
      }));

      // Unlock after all cards have flipped back
      const totalDelay = initialCards.length * 50 + 300;
      setTimeout(() => {
        setPeekActive(false);
        locked.current = false;
      }, totalDelay);
    }, 3000);
  }, [peekActive, initialCards.length]);

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      {/* Background */}
      <img
        src={`/arthurs-world/images/scenes/${theme}/bg.png`}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />

      {/* Top bar: back button + peek */}
      <div className="relative z-20 flex items-center justify-between p-4 pt-4">
        <button
          onClick={onBack}
          className="w-12 h-12 bg-night/60 backdrop-blur-sm rounded-full flex items-center
                     justify-center text-2xl active:scale-90 transition-transform"
        >
          ◀️
        </button>

        <button
          onClick={handlePeek}
          className={`w-12 h-12 bg-night/60 backdrop-blur-sm rounded-full flex items-center
                     justify-center text-2xl active:scale-90 transition-transform
                     ${peekActive ? 'ring-2 ring-sun' : ''}`}
          title="Peek"
        >
          👁️
        </button>
      </div>

      {/* Card grid */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-4">
        <div
          className="grid gap-2 max-w-lg w-full"
          style={{
            gridTemplateColumns: `repeat(${level.cols}, 1fr)`,
          }}
        >
          {cards.map((card, i) => (
            <Card
              key={card.id}
              card={card}
              theme={theme}
              onClick={() => handleCardTap(card.id)}
              dealDelay={i * 80}
            />
          ))}
        </div>
      </div>

      {/* Sidekick */}
      <div className="absolute bottom-4 left-4 z-20">
        <Sidekick theme={theme} event={sidekickEvent} />
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/games/memory-match/GameBoard.jsx
git commit -m "feat(memory-match): add GameBoard with grid, peek mode, and sidekick"
```

---

### Task 9: WinCelebration Component

**Files:**
- Create: `src/games/memory-match/WinCelebration.jsx`

**Step 1: Create the WinCelebration overlay**

Full-screen celebration with confetti, fanfare, and replay options.

```jsx
// src/games/memory-match/WinCelebration.jsx
import { useEffect, useState } from 'react';
import { playFanfare } from '../../hooks/useSound';
import Sidekick from './Sidekick';

// Generate random confetti pieces
function makeConfetti(count = 30) {
  const colors = ['#facc15', '#ef4444', '#22c55e', '#38bdf8', '#ec4899', '#a855f7'];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    left: Math.random() * 100,
    delay: Math.random() * 1.5,
    size: 6 + Math.random() * 8,
  }));
}

export default function WinCelebration({ theme, onPlayAgain, onNewTheme }) {
  const [confetti] = useState(() => makeConfetti());
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    playFanfare();
    // Show buttons after celebration
    const timer = setTimeout(() => setShowButtons(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/60">
      {/* Confetti */}
      {confetti.map(c => (
        <div
          key={c.id}
          className="absolute animate-confetti-fall"
          style={{
            left: `${c.left}%`,
            top: '-20px',
            width: `${c.size}px`,
            height: `${c.size}px`,
            backgroundColor: c.color,
            borderRadius: c.size > 10 ? '50%' : '2px',
            animationDelay: `${c.delay}s`,
            animationDuration: `${1.5 + Math.random()}s`,
          }}
        />
      ))}

      {/* Star emoji */}
      <div className="text-7xl animate-bounce mb-2">⭐</div>

      {/* Sidekick celebrating */}
      <Sidekick theme={theme} event="win" />

      <p className="text-3xl font-heading text-sun drop-shadow-lg mt-4 animate-bounce-in">
        Amazing!
      </p>

      {/* Buttons */}
      {showButtons && (
        <div className="flex gap-4 mt-6 animate-bounce-in">
          <button
            onClick={onPlayAgain}
            className="px-8 py-4 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl
                       font-heading text-xl text-white shadow-lg active:scale-95 transition-transform"
          >
            Again!
          </button>
          <button
            onClick={onNewTheme}
            className="px-8 py-4 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl
                       font-heading text-xl text-white shadow-lg active:scale-95 transition-transform"
          >
            New Board
          </button>
        </div>
      )}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/games/memory-match/WinCelebration.jsx
git commit -m "feat(memory-match): add WinCelebration with confetti and fanfare"
```

---

### Task 10: MemoryMatch Orchestrator

**Files:**
- Modify: `src/games/MemoryMatch.jsx` (replace entire file)

**Step 1: Rewrite the orchestrator**

Replace the existing simple MemoryMatch with the full themed orchestrator.

```jsx
// src/games/MemoryMatch.jsx
import { useState, useCallback, useEffect } from 'react';
import BackButton from '../components/BackButton';
import ThemePicker from './memory-match/ThemePicker';
import CardParade from './memory-match/CardParade';
import GameBoard from './memory-match/GameBoard';
import WinCelebration from './memory-match/WinCelebration';
import {
  THEMES, buildDeck, getLevelForTheme,
  loadProgress, saveProgress, loadSecrets, saveSecrets,
} from './memory-match/cardData';

export default function MemoryMatch() {
  const [phase, setPhase] = useState('pick-theme'); // pick-theme | parade | playing | won
  const [theme, setTheme] = useState(null);
  const [cards, setCards] = useState([]);
  const [level, setLevel] = useState(null);
  const [paradeChars, setParadeChars] = useState([]);

  const startGame = useCallback((themeId) => {
    const progress = loadProgress();
    const lvl = getLevelForTheme(themeId, progress);
    const deck = buildDeck(themeId, lvl);

    // Get unique characters for parade (one per pair)
    const seen = new Set();
    const chars = [];
    for (const card of deck) {
      if (!seen.has(card.characterId)) {
        seen.add(card.characterId);
        chars.push(card);
      }
    }

    setTheme(themeId);
    setLevel(lvl);
    setCards(deck);
    setParadeChars(chars);
    setPhase('parade');
  }, []);

  const handleParadeComplete = useCallback(() => {
    setPhase('playing');
  }, []);

  const handleWin = useCallback((secretIds) => {
    // Update progress
    const progress = loadProgress();
    if (!progress[theme]) progress[theme] = { completions: 0 };
    progress[theme].completions += 1;
    saveProgress(progress);

    // Record secret discoveries
    if (secretIds.length > 0) {
      const secrets = loadSecrets();
      if (!secrets[theme]) secrets[theme] = [];
      for (const id of secretIds) {
        if (!secrets[theme].includes(id)) {
          secrets[theme].push(id);
        }
      }
      saveSecrets(secrets);
    }

    setPhase('won');
  }, [theme]);

  const handlePlayAgain = useCallback(() => {
    startGame(theme);
  }, [theme, startGame]);

  const handleNewTheme = useCallback(() => {
    setPhase('pick-theme');
    setTheme(null);
  }, []);

  // Pick theme
  if (phase === 'pick-theme') {
    return (
      <div className="relative w-full h-full">
        <BackButton />
        <ThemePicker onSelectTheme={startGame} />
      </div>
    );
  }

  // Card parade
  if (phase === 'parade') {
    return (
      <CardParade
        theme={theme}
        characters={paradeChars}
        onComplete={handleParadeComplete}
      />
    );
  }

  // Playing
  return (
    <div className="relative w-full h-full">
      <GameBoard
        theme={theme}
        cards={cards}
        level={level}
        onWin={handleWin}
        onBack={handleNewTheme}
      />
      {phase === 'won' && (
        <WinCelebration
          theme={theme}
          onPlayAgain={handlePlayAgain}
          onNewTheme={handleNewTheme}
        />
      )}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/games/MemoryMatch.jsx
git commit -m "feat(memory-match): replace simple game with full themed orchestrator"
```

---

### Task 11: Verify Build and Test in Browser

**Step 1: Run the dev server**

```bash
npm run dev
```

**Step 2: Test each game phase**

Navigate to Memory Match in the app:
1. **ThemePicker** — verify 2x3 grid shows all 6 themes with backgrounds and sidekicks
2. **CardParade** — select a theme, verify characters parade with sounds, skip button works
3. **GameBoard** — cards deal with stagger animation, tap to flip, match/no-match logic
4. **Peek mode** — tap eye icon, verify all cards show for 3s, wave flip-back
5. **Sidekick** — verify reactions to flip/match/no-match events
6. **WinCelebration** — match all cards, verify confetti + fanfare + buttons
7. **Progression** — play again, check difficulty stays (localStorage)
8. **Multiple themes** — test at least 2 different themes

**Step 3: Fix any issues found during testing**

**Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix(memory-match): address issues found during testing"
```

---

### Task 12: Polish and Final Commit

**Step 1: Ensure card back CSS patterns render correctly across themes**

Check each theme's card backs look distinct and themed.

**Step 2: Verify responsive layout**

Test on mobile viewport (375px wide) — cards should fill the grid without overflow.

**Step 3: Check sound integration**

- Quiet mode (`:mode` = quiet) should mute all sounds
- Noisy mode should play all sounds

**Step 4: Run production build**

```bash
npm run build
```

Verify no build errors.

**Step 5: Final commit**

```bash
git add -A
git commit -m "feat(memory-match): complete Memory Match game with 6 themed boards

Replaces the simple emoji-based memory game with Laura's full design:
- 6 themed boards (Space, Sea, Jungle, Farm, Dinosaurs, Theme Park)
- Card parade learning mechanic before each game
- Peek mode for confidence building
- Progressive difficulty (Tiny -> Champion) tracked per theme
- Secret cards with gold shimmer effects
- Sidekick companions with reactive animations
- Win celebration with confetti and fanfare
- Full asset reuse from BuildAScene sticker library"
```
