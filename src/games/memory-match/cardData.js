// ---------------------------------------------------------------------------
// Memory Match — card data for every themed board
// 20 characters × 6 themes + 3 secrets each
// ---------------------------------------------------------------------------

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
  space:        { id: 'robot',      label: 'Robot',      sound: 'bleep' },
  sea:          { id: 'crab',       label: 'Crab',       sound: 'bubble' },
  jungle:       { id: 'monkey',     label: 'Monkey',     sound: 'squawk' },
  farm:         { id: 'chick',      label: 'Chick',      sound: 'cluck' },
  dinosaurs:    { id: 'baby-t-rex', label: 'Baby T-Rex', sound: 'roar' },
  'theme-park': { id: 'clown',      label: 'Clown',      sound: 'pop' },
};

/** Helper to reduce per-card verbosity */
const card = (id, label, sound) => ({ id, label, sound });

// ===== THEMES ================================================================

export const THEMES = {
  // -------------------------------------------------------------------
  // SPACE
  // -------------------------------------------------------------------
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

  // -------------------------------------------------------------------
  // SEA
  // -------------------------------------------------------------------
  sea: {
    id: 'sea',
    label: 'Sea',
    emoji: '\u{1F30A}',
    bg: 'from-cyan-700 to-blue-950',
    bgImage: '/arthurs-world/images/scenes/sea/bg.png',
    cards: [
      card('clownfish',       'Clownfish',    'splash'),
      card('great-white',     'Shark',        'splash'),
      card('octopus',         'Octopus',      'splash'),
      card('jellyfish',       'Jellyfish',    'splash'),
      card('seahorse',        'Seahorse',     'bubble'),
      card('blue-whale',      'Whale',        'splash'),
      card('sea-turtle',      'Turtle',       'splash'),
      card('crab',            'Crab',         'bubble'),
      card('lobster',         'Lobster',      'bubble'),
      card('starfish',        'Starfish',     'bubble'),
      card('pufferfish',      'Pufferfish',   'bubble'),
      card('dolphin',         'Dolphin',      'splash'),
      card('narwhal',         'Narwhal',      'splash'),
      card('mermaid',         'Mermaid',      'splash'),
      card('diver',           'Diver',        'bubble'),
      card('submarine',       'Submarine',    'whoosh'),
      card('clam-pearl',      'Clam',         'bubble'),
      card('anglerfish',      'Anglerfish',   'splash'),
      card('manta-ray',       'Manta Ray',    'splash'),
      card('seahorse-bow-tie','Seahorse',     'bubble'),
    ],
    secrets: [
      card('narwhal-sunglasses',  'Narwhal with Sunglasses',  'splash'),
      card('baby-octopus-teacup', 'Baby Octopus in a Teacup', 'bubble'),
      card('mermaid-waving',      'Mermaid Waving',           'splash'),
    ],
  },

  // -------------------------------------------------------------------
  // JUNGLE
  // -------------------------------------------------------------------
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
      card('sloth-hammock',    'Sloth in a Hammock',    'bleep'),
      card('frog-umbrella',    'Frog with an Umbrella', 'ribbit'),
      card('parrot-party-hat', 'Parrot in a Party Hat', 'squawk'),
    ],
  },

  // -------------------------------------------------------------------
  // FARM
  // -------------------------------------------------------------------
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
      card('pig-mud-bath', 'Pig in a Mud Bath',      'oink'),
      card('sheep-jumper', 'Sheep Wearing a Jumper',  'baa'),
      card('cow-flowers',  'Cow with Flowers',        'moo'),
    ],
  },

  // -------------------------------------------------------------------
  // DINOSAURS
  // -------------------------------------------------------------------
  dinosaurs: {
    id: 'dinosaurs',
    label: 'Dinosaurs',
    emoji: '\u{1F996}',
    bg: 'from-amber-800 to-orange-950',
    bgImage: '/arthurs-world/images/scenes/dinosaurs/bg.png',
    cards: [
      card('t-rex',              'T-Rex',              'roar'),
      card('triceratops',        'Triceratops',        'roar'),
      card('brachiosaurus',      'Brachiosaurus',      'trumpet'),
      card('stegosaurus',        'Stegosaurus',        'roar'),
      card('pterodactyl',        'Pterodactyl',        'squawk'),
      card('ankylosaurus',       'Ankylosaurus',       'roar'),
      card('diplodocus',         'Diplodocus',         'trumpet'),
      card('velociraptor',       'Velociraptor',       'hiss'),
      card('spinosaurus',        'Spinosaurus',        'roar'),
      card('baby-t-rex',         'Baby T-Rex',         'roar'),
      card('dino-egg-unhatched', 'Dino Egg',           'crunch'),
      card('caveman',            'Caveman',            'roar'),
      card('mammoth',            'Mammoth',            'trumpet'),
      card('sabre-tooth',        'Sabre-tooth Tiger',  'roar'),
      card('giant-dragonfly',    'Dragonfly',          'whoosh'),
      card('fossil-rock',        'Fossil',             'crunch'),
      card('meteor-incoming',    'Meteor',             'whoosh'),
      card('baby-dino-hatching', 'Baby Dino',          'crunch'),
      card('pachycephalosaurus', 'Pachycephalosaurus', 'roar'),
      card('dino-nest',          'Dino Nest',          'crunch'),
    ],
    secrets: [
      card('caveman-riding-dino', 'Caveman Riding a Dino',    'roar'),
      card('triceratops-bow-tie', 'Triceratops with Bow Tie', 'roar'),
      card('baby-t-rex-egg',      'Baby T-Rex in an Egg',     'roar'),
    ],
  },

  // -------------------------------------------------------------------
  // THEME PARK
  // -------------------------------------------------------------------
  'theme-park': {
    id: 'theme-park',
    label: 'Theme Park',
    emoji: '\u{1F3A0}',
    bg: 'from-rose-700 to-pink-950',
    bgImage: '/arthurs-world/images/scenes/theme-park/bg.png',
    cards: [
      card('balloon-bunch',      'Balloon',        'pop'),
      card('candy-floss',        'Candy Floss',    'crunch'),
      card('ice-cream-cone',     'Ice Cream',      'crunch'),
      card('carousel-horse',     'Carousel Horse', 'whoosh'),
      card('clown',              'Clown',          'pop'),
      card('magician',           'Magician',       'sting'),
      card('popcorn-box',        'Popcorn',        'crunch'),
      card('bumper-car',         'Bumper Car',     'whoosh'),
      card('goldfish-bag',       'Goldfish',       'bubble'),
      card('teddy-bear-prize',   'Teddy Bear',     'bleep'),
      card('juggler',            'Juggler',        'whoosh'),
      card('acrobat',            'Acrobat',        'whoosh'),
      card('roller-coaster-car', 'Roller Coaster', 'whoosh'),
      card('ferris-wheel',       'Ferris Wheel',   'whoosh'),
      card('confetti-cannon',    'Confetti Cannon','pop'),
      card('toffee-apple',       'Toffee Apple',   'crunch'),
      card('rubber-duck',        'Rubber Duck',    'bubble'),
      card('strongman-bell',     'Strongman Bell',  'crunch'),
      card('party-hat',          'Party Hat',      'pop'),
      card('firework-burst',     'Firework',       'whoosh'),
    ],
    secrets: [
      card('clown-unicycle',       'Clown on a Unicycle',      'pop'),
      card('magician-rabbit',      'Magician Pulling Rabbit',  'sting'),
      card('bear-winning-goldfish','Bear Winning Goldfish',    'bleep'),
    ],
  },
};

// ===== PERSISTENCE ===========================================================

const PROGRESS_KEY = 'memory-match-progress';
const SECRETS_KEY = 'memory-match-secrets';

export function loadProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

export function saveProgress(progress) {
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress)); }
  catch { /* ignore */ }
}

export function loadSecrets() {
  try {
    const raw = localStorage.getItem(SECRETS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

export function saveSecrets(secrets) {
  try { localStorage.setItem(SECRETS_KEY, JSON.stringify(secrets)); }
  catch { /* ignore */ }
}

// ===== HELPERS ===============================================================

/** Get current level for a theme based on stored level index */
export function getLevelForTheme(themeId, progress) {
  const levelIndex = progress[themeId]?.levelIndex || 0;
  return LEVELS[Math.min(levelIndex, LEVELS.length - 1)];
}

/** Get the next level (or null if already at max) */
export function getNextLevel(currentLevel) {
  const idx = LEVELS.findIndex(l => l.id === currentLevel.id);
  return idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
}

/** Bump a theme's stored level to the next one */
export function levelUpTheme(themeId) {
  const progress = loadProgress();
  if (!progress[themeId]) progress[themeId] = { completions: 0, levelIndex: 0 };
  const current = progress[themeId].levelIndex || 0;
  if (current < LEVELS.length - 1) {
    progress[themeId].levelIndex = current + 1;
  }
  saveProgress(progress);
  return getLevelForTheme(themeId, progress);
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
