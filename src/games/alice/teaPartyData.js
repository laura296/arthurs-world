/**
 * Mad Hatter's Tea Party — puzzle definitions & object catalog.
 *
 * Each puzzle has:
 *   id       — unique key
 *   tier     — 1 (simple), 2 (moderate), 3 (stretch)
 *   pattern  — array of object IDs laid on the table
 *   missing  — indices that start empty (Arthur fills these)
 *   tray     — object IDs available to drag (includes distractors)
 */

// ── Object catalog ───────────────────────────────────────────────────
// Maps object ID → visual metadata used by the SVG renderer
export const OBJECTS = {
  // Teacups
  'cup-white':   { label: 'White Cup',    group: 'cup',     color: '#FFFFFF', rim: '#D4A574', pattern: null,    size: 1 },
  'cup-red':     { label: 'Red Cup',      group: 'cup',     color: '#C0392B', rim: '#922B21', pattern: null,    size: 1 },
  'cup-blue':    { label: 'Blue Cup',     group: 'cup',     color: '#5B9BD5', rim: '#2E75B6', pattern: 'dots',  size: 1 },
  'cup-yellow':  { label: 'Yellow Cup',   group: 'cup',     color: '#F7DC6F', rim: '#D4AC0D', pattern: null,    size: 1 },
  'cup-pink':    { label: 'Pink Cup',     group: 'cup',     color: '#F1948A', rim: '#CD6155', pattern: 'roses', size: 1 },

  // Saucers
  'saucer-white': { label: 'White Saucer', group: 'saucer', color: '#FFFFFF', rim: '#D4A574', pattern: null,    size: 1 },
  'saucer-blue':  { label: 'Blue Saucer',  group: 'saucer', color: '#AED6F1', rim: '#5B9BD5', pattern: 'ring',  size: 1 },
  'saucer-pink':  { label: 'Pink Saucer',  group: 'saucer', color: '#FADBD8', rim: '#F1948A', pattern: null,    size: 1 },

  // Cakes
  'cake-pink':   { label: 'Pink Cake',    group: 'cake',    color: '#F5B7B1', rim: '#E74C3C', pattern: 'cherry', size: 1 },
  'cake-yellow': { label: 'Yellow Cake',  group: 'cake',    color: '#F9E79F', rim: '#F5B041', pattern: 'swirl',  size: 1 },
  'cake-big':    { label: 'Big Cake',     group: 'cake',    color: '#F5B7B1', rim: '#E74C3C', pattern: 'cherry', size: 1.4 },
  'cake-small':  { label: 'Small Cake',   group: 'cake',    color: '#F5B7B1', rim: '#E74C3C', pattern: 'cherry', size: 0.7 },

  // Other items
  'spoon-silver':      { label: 'Spoon',       group: 'spoon',     color: '#BDC3C7', rim: '#95A5A6', pattern: null, size: 1 },
  'sandwich-triangle': { label: 'Sandwich',    group: 'sandwich',  color: '#F5DEB3', rim: '#D4A574', pattern: null, size: 1 },
  'sugar-cube':        { label: 'Sugar Cube',  group: 'sugar',     color: '#FDFEFE', rim: '#D5DBDB', pattern: null, size: 1 },
};

// Pitch multiplier for ceramic clink sound — cups ring higher than cakes
export const OBJECT_PITCH = {
  cup: 1.2,
  saucer: 1.0,
  cake: 0.7,
  spoon: 1.5,
  sandwich: 0.6,
  sugar: 1.3,
};

// ── Puzzle pool ──────────────────────────────────────────────────────

const PUZZLES = [
  // ─── Tier 1: AB patterns, 1 missing at end, 2 tray choices ───
  {
    id: 't1-ab-cup-saucer',
    tier: 1,
    pattern: ['cup-white', 'saucer-blue', 'cup-white', 'saucer-blue', 'cup-white', 'saucer-blue'],
    missing: [5],
    tray: ['saucer-blue', 'cup-white'],
  },
  {
    id: 't1-ab-cake-spoon',
    tier: 1,
    pattern: ['cake-pink', 'spoon-silver', 'cake-pink', 'spoon-silver', 'cake-pink', 'spoon-silver'],
    missing: [5],
    tray: ['spoon-silver', 'cake-pink'],
  },
  {
    id: 't1-ab-sandwich-sugar',
    tier: 1,
    pattern: ['sandwich-triangle', 'sugar-cube', 'sandwich-triangle', 'sugar-cube', 'sandwich-triangle', 'sugar-cube'],
    missing: [5],
    tray: ['sugar-cube', 'sandwich-triangle'],
  },
  {
    id: 't1-ab-red-blue-cup',
    tier: 1,
    pattern: ['cup-red', 'cup-blue', 'cup-red', 'cup-blue', 'cup-red', 'cup-blue'],
    missing: [5],
    tray: ['cup-blue', 'cup-red'],
  },
  {
    id: 't1-ab-cake-cup',
    tier: 1,
    pattern: ['cake-yellow', 'cup-yellow', 'cake-yellow', 'cup-yellow', 'cake-yellow', 'cup-yellow'],
    missing: [5],
    tray: ['cup-yellow', 'cake-yellow'],
  },
  {
    id: 't1-ab-saucer-spoon',
    tier: 1,
    pattern: ['saucer-pink', 'spoon-silver', 'saucer-pink', 'spoon-silver', 'saucer-pink', 'spoon-silver'],
    missing: [5],
    tray: ['spoon-silver', 'saucer-pink'],
  },
  {
    id: 't1-ab-pink-white',
    tier: 1,
    pattern: ['cup-pink', 'cup-white', 'cup-pink', 'cup-white', 'cup-pink', 'cup-white'],
    missing: [5],
    tray: ['cup-white', 'cup-pink'],
  },

  // ─── Tier 2: ABC / AAB / colour / size, 1 missing mid-pattern, 3 tray ───
  {
    id: 't2-abc-cup-saucer-spoon',
    tier: 2,
    pattern: ['cup-white', 'saucer-blue', 'spoon-silver', 'cup-white', 'saucer-blue', 'spoon-silver'],
    missing: [4],
    tray: ['saucer-blue', 'cup-white', 'spoon-silver'],
  },
  {
    id: 't2-abc-cake-sandwich-sugar',
    tier: 2,
    pattern: ['cake-pink', 'sandwich-triangle', 'sugar-cube', 'cake-pink', 'sandwich-triangle', 'sugar-cube'],
    missing: [3],
    tray: ['cake-pink', 'sugar-cube', 'sandwich-triangle'],
  },
  {
    id: 't2-aab-cup-cup-cake',
    tier: 2,
    pattern: ['cup-red', 'cup-red', 'cake-yellow', 'cup-red', 'cup-red', 'cake-yellow'],
    missing: [4],
    tray: ['cup-red', 'cake-yellow', 'spoon-silver'],
  },
  {
    id: 't2-aab-saucer-saucer-spoon',
    tier: 2,
    pattern: ['saucer-blue', 'saucer-blue', 'spoon-silver', 'saucer-blue', 'saucer-blue', 'spoon-silver'],
    missing: [2],
    tray: ['spoon-silver', 'saucer-blue', 'sugar-cube'],
  },
  {
    id: 't2-colour-red-blue-yellow',
    tier: 2,
    pattern: ['cup-red', 'cup-blue', 'cup-yellow', 'cup-red', 'cup-blue', 'cup-yellow'],
    missing: [4],
    tray: ['cup-blue', 'cup-red', 'cup-yellow'],
  },
  {
    id: 't2-size-big-small',
    tier: 2,
    pattern: ['cake-big', 'cake-small', 'cake-big', 'cake-small', 'cake-big', 'cake-small'],
    missing: [3],
    tray: ['cake-small', 'cake-big', 'cake-pink'],
  },
  {
    id: 't2-abc-pink-blue-white',
    tier: 2,
    pattern: ['cup-pink', 'cup-blue', 'cup-white', 'cup-pink', 'cup-blue', 'cup-white'],
    missing: [1],
    tray: ['cup-blue', 'cup-pink', 'cup-white'],
  },

  // ─── Tier 3: AABB / dual-attribute, 2 missing, 3-4 tray ───
  {
    id: 't3-aabb-cup-saucer',
    tier: 3,
    pattern: ['cup-white', 'cup-white', 'saucer-blue', 'saucer-blue', 'cup-white', 'cup-white', 'saucer-blue', 'saucer-blue'],
    missing: [3, 6],
    tray: ['saucer-blue', 'cup-white', 'spoon-silver'],
  },
  {
    id: 't3-aabb-cake-sandwich',
    tier: 3,
    pattern: ['cake-pink', 'cake-pink', 'sandwich-triangle', 'sandwich-triangle', 'cake-pink', 'cake-pink', 'sandwich-triangle', 'sandwich-triangle'],
    missing: [1, 7],
    tray: ['cake-pink', 'sandwich-triangle', 'sugar-cube'],
  },
  {
    id: 't3-dual-red-cup-blue-saucer',
    tier: 3,
    pattern: ['cup-red', 'saucer-blue', 'cup-red', 'saucer-blue', 'cup-red', 'saucer-blue'],
    missing: [2, 5],
    tray: ['cup-red', 'saucer-blue', 'cup-blue', 'saucer-pink'],
  },
  {
    id: 't3-dual-pink-cake-yellow-cup',
    tier: 3,
    pattern: ['cake-pink', 'cup-yellow', 'cake-pink', 'cup-yellow', 'cake-pink', 'cup-yellow'],
    missing: [1, 4],
    tray: ['cup-yellow', 'cake-pink', 'cake-yellow', 'cup-pink'],
  },
  {
    id: 't3-aabb-red-blue',
    tier: 3,
    pattern: ['cup-red', 'cup-red', 'cup-blue', 'cup-blue', 'cup-red', 'cup-red', 'cup-blue', 'cup-blue'],
    missing: [2, 5],
    tray: ['cup-blue', 'cup-red', 'cup-yellow'],
  },
  {
    id: 't3-complex-size-colour',
    tier: 3,
    pattern: ['cake-big', 'cake-small', 'cake-big', 'cake-small', 'cake-big', 'cake-small'],
    missing: [1, 4],
    tray: ['cake-small', 'cake-big', 'cake-pink', 'cake-yellow'],
  },
];

// ── Shuffle-bag session picker ───────────────────────────────────────

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Pick 5 puzzles for a session: 2 from Tier 1, 2 from Tier 2, 1 from Tier 3.
 * Returns them in order (easy → hard).
 */
export function pickSession() {
  const tier1 = shuffle(PUZZLES.filter(p => p.tier === 1)).slice(0, 2);
  const tier2 = shuffle(PUZZLES.filter(p => p.tier === 2)).slice(0, 2);
  const tier3 = shuffle(PUZZLES.filter(p => p.tier === 3)).slice(0, 1);
  return [...tier1, ...tier2, ...tier3];
}

/**
 * For a given puzzle & missing index, return the correct object ID.
 */
export function getCorrectAnswer(puzzle, missingIdx) {
  return puzzle.pattern[missingIdx];
}

export default PUZZLES;
