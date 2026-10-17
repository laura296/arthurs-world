/**
 * Draw Alive — worlds and colour-in creature templates.
 *
 * Every template is drawn in a 200×200 unit box. `parts` are filled
 * shapes whose union is the creature's body (overlapping is fine);
 * `details` are interior lines drawn on top (gills, wings, smiles).
 * `eyes` are drawn as live, blinking DOM eyes once the creature is alive.
 *
 * Motions: swim | float | fly | rocket | hover | flutter | walk
 * Births:  egg | cocoon | bubble | portal | flower | puddle | present
 *
 * Each world's `food` is what a tap drops in: `fall` is how it moves
 * (drop to the ground, sink through water, or float in place).
 */

const BASE = '/arthurs-world/images/scenes';

/** Every world background is painted at this size; perches use its pixels. */
export const SCENE_SIZE = { w: 1792, h: 1024 };

/** Ellipse as an SVG path (consistent winding so parts union cleanly). */
function E(cx, cy, rx, ry = rx) {
  return `M ${cx - rx} ${cy} a ${rx} ${ry} 0 1 0 ${rx * 2} 0 a ${rx} ${ry} 0 1 0 ${-rx * 2} 0 Z`;
}

/** Rounded leg/post hanging down from (x, y). */
function leg(x, y, w, h) {
  const r = w / 2;
  return `M ${x} ${y} L ${x} ${y + h - r} a ${r} ${r} 0 0 0 ${w} 0 L ${x + w} ${y} Z`;
}

/** Wavy jellyfish tentacle centred on x. */
function tentacle(x, top, len) {
  const b = top + len;
  return `M ${x - 8} ${top} C ${x - 20} ${top + len * 0.35} ${x + 4} ${top + len * 0.6} ${x - 6} ${b - 6} Q ${x} ${b + 4} ${x + 7} ${b - 6} C ${x + 16} ${top + len * 0.6} ${x - 4} ${top + len * 0.35} ${x + 8} ${top} Z`;
}

export const TEMPLATES = {
  fish: {
    id: 'fish',
    birth: 'bubble',
    motion: 'swim',
    parts: [
      E(108, 100, 58, 44),
      'M 66 100 C 48 82 34 60 20 60 C 10 60 9 72 14 82 L 26 100 L 14 118 C 9 128 10 140 20 140 C 34 140 48 118 66 100 Z',
      'M 78 66 C 84 38 118 30 134 62 Z',
      'M 98 138 C 102 158 120 160 126 138 Z',
    ],
    details: [
      'M 84 74 C 96 90 96 110 84 126',
      'M 150 114 Q 157 121 164 113',
    ],
    eyes: [{ x: 136, y: 88, r: 11 }],
  },
  jellyfish: {
    id: 'jellyfish',
    birth: 'bubble',
    motion: 'float',
    parts: [
      'M 34 104 C 34 52 66 26 100 26 C 134 26 166 52 166 104 C 166 116 34 116 34 104 Z',
      tentacle(56, 100, 76),
      tentacle(85, 100, 88),
      tentacle(115, 100, 88),
      tentacle(144, 100, 76),
    ],
    details: [
      'M 86 84 Q 100 96 114 84',
      'M 44 102 Q 100 92 156 102',
    ],
    eyes: [{ x: 80, y: 68, r: 10 }, { x: 120, y: 68, r: 10 }],
  },
  rocket: {
    id: 'rocket',
    birth: 'portal',
    motion: 'rocket',
    flame: true,
    parts: [
      'M 100 10 C 134 36 140 84 134 146 L 66 146 C 60 84 66 36 100 10 Z',
      'M 70 100 L 36 148 C 32 158 40 164 48 158 L 72 142 Z',
      'M 130 100 L 164 148 C 168 158 160 164 152 158 L 128 142 Z',
      'M 78 144 L 122 144 L 116 162 L 84 162 Z',
    ],
    details: [
      E(100, 78, 22),
      'M 70 122 L 130 122',
      'M 82 36 Q 100 30 118 36',
    ],
    eyes: [{ x: 91, y: 78, r: 7 }, { x: 109, y: 78, r: 7 }],
  },
  ufo: {
    id: 'ufo',
    birth: 'portal',
    motion: 'hover',
    parts: [
      E(100, 84, 38, 38),
      E(100, 112, 80, 26),
      leg(66, 128, 12, 30),
      leg(122, 128, 12, 30),
    ],
    details: [
      'M 30 108 Q 100 128 170 108',
      E(62, 122, 6), E(100, 128, 6), E(138, 122, 6),
    ],
    eyes: [{ x: 87, y: 80, r: 10 }, { x: 113, y: 80, r: 10 }],
  },
  butterfly: {
    id: 'butterfly',
    birth: 'cocoon',
    motion: 'flutter',
    parts: [
      E(60, 76, 46, 40),
      E(140, 76, 46, 40),
      E(68, 132, 34, 30),
      E(132, 132, 34, 30),
      E(100, 112, 13, 50),
      E(100, 58, 17),
      E(74, 22, 6), E(126, 22, 6),
    ],
    details: [
      'M 94 46 C 88 34 82 28 76 24',
      'M 106 46 C 112 34 118 28 124 24',
      E(56, 76, 16), E(144, 76, 16),
      E(68, 134, 10), E(132, 134, 10),
    ],
    eyes: [{ x: 93, y: 56, r: 6 }, { x: 107, y: 56, r: 6 }],
  },
  parrot: {
    id: 'parrot',
    birth: 'egg',
    motion: 'fly',
    parts: [
      E(94, 110, 54, 42),
      E(138, 74, 32),
      'M 156 58 C 186 50 198 82 178 104 C 178 90 172 82 160 82 Z',
      'M 50 114 L 14 142 C 6 150 14 158 24 152 L 62 130 Z',
      'M 120 50 C 112 30 128 22 132 40 C 136 22 154 26 146 46 Z',
    ],
    details: [
      'M 62 100 C 82 80 118 88 124 112 C 104 132 76 128 62 100 Z',
      'M 88 150 L 86 166', 'M 108 150 L 110 166',
    ],
    eyes: [{ x: 144, y: 68, r: 9 }],
  },
  pig: {
    id: 'pig',
    birth: 'puddle',
    motion: 'walk',
    parts: [
      E(92, 114, 62, 44),
      E(148, 94, 34, 32),
      E(178, 100, 14, 16),
      'M 130 70 C 122 50 134 42 150 62 Z',
      'M 152 62 C 160 44 174 48 168 72 Z',
      leg(52, 140, 18, 34),
      leg(78, 144, 18, 30),
      leg(108, 144, 18, 30),
      leg(132, 140, 18, 34),
    ],
    details: [
      'M 32 104 C 18 96 22 82 32 88 C 40 94 28 104 22 96',
      E(174, 96, 2.5), E(182, 96, 2.5),
      'M 152 114 Q 160 120 168 114',
    ],
    eyes: [{ x: 152, y: 86, r: 8 }],
  },
  hen: {
    id: 'hen',
    birth: 'egg',
    motion: 'walk',
    parts: [
      E(94, 114, 56, 46),
      E(134, 70, 30),
      'M 158 64 L 182 74 L 158 84 Z',
      'M 118 48 C 112 26 130 22 132 38 C 134 20 154 24 148 46 Z',
      'M 52 100 C 30 76 28 54 44 60 C 50 70 54 74 60 76 C 52 54 62 46 70 60 L 74 92 Z',
      'M 154 88 C 164 92 164 104 156 106 Z',
    ],
    details: [
      'M 70 106 C 88 92 112 98 118 118 C 100 134 80 130 70 106 Z',
      'M 88 158 L 86 178 M 78 178 L 94 178',
      'M 108 158 L 110 178 M 102 178 L 118 178',
    ],
    eyes: [{ x: 140, y: 64, r: 8 }],
  },
  dino: {
    id: 'dino',
    birth: 'egg',
    motion: 'walk',
    parts: [
      E(88, 120, 58, 38),
      'M 118 108 C 132 84 138 56 146 40 L 170 46 C 164 70 154 98 142 124 Z',
      E(164, 40, 22, 16),
      'M 38 112 C 18 120 6 138 2 150 C 20 144 34 138 50 134 Z',
      leg(52, 140, 18, 32),
      leg(76, 146, 18, 26),
      leg(100, 146, 18, 26),
      leg(122, 140, 18, 32),
    ],
    details: [
      E(72, 108, 7), E(96, 100, 6), E(104, 124, 8), E(78, 132, 5),
      'M 170 48 Q 178 50 184 44',
    ],
    eyes: [{ x: 168, y: 34, r: 7 }],
  },
  ptero: {
    id: 'ptero',
    birth: 'egg',
    motion: 'fly',
    parts: [
      E(98, 108, 32, 20),
      'M 120 96 C 136 82 156 82 176 92 L 190 100 L 152 106 C 142 108 128 108 120 104 Z',
      'M 134 88 L 104 64 L 146 84 Z',
      'M 92 98 C 82 64 54 34 16 26 C 30 66 52 100 86 118 Z',
      'M 106 98 C 116 64 134 40 160 28 C 156 64 140 96 112 116 Z',
    ],
    details: [
      'M 40 48 C 52 64 66 82 84 104',
      'M 150 44 C 140 64 128 84 112 106',
    ],
    eyes: [{ x: 148, y: 92, r: 6 }],
  },
  balloon: {
    id: 'balloon',
    birth: 'present',
    motion: 'hover',
    parts: [
      E(100, 82, 58, 68),
      'M 90 148 L 110 148 L 100 162 Z',
    ],
    details: [
      'M 100 162 C 90 174 110 184 100 198',
      'M 66 52 Q 74 34 92 30',
      'M 112 112 Q 100 120 88 112',
    ],
    eyes: [{ x: 82, y: 82, r: 10 }, { x: 118, y: 82, r: 10 }],
  },
  teddy: {
    id: 'teddy',
    birth: 'present',
    motion: 'walk',
    parts: [
      E(66, 30, 15), E(134, 30, 15),
      E(100, 62, 38),
      E(100, 132, 42, 44),
      E(58, 118, 15, 24), E(142, 118, 15, 24),
      E(76, 172, 20, 17), E(124, 172, 20, 17),
    ],
    details: [
      E(66, 30, 7), E(134, 30, 7),
      E(100, 76, 16, 12),
      E(100, 136, 22, 24),
      'M 94 82 Q 100 88 106 82',
    ],
    eyes: [{ x: 86, y: 56, r: 7.5 }, { x: 114, y: 56, r: 7.5 }],
  },
};

/** Viewbox the drawing paper shows around the 200-unit template box. */
export const VIEWBOX = { x: -10, y: -10, size: 220 };

export const WORLDS = [
  {
    id: 'sea',
    bg: `${BASE}/sea/bg.webp`,
    templates: ['fish', 'jellyfish'],
    freeMotion: 'swim',
    freeBirth: 'bubble',
    food: { items: ['flake'], fall: 'sink', count: 5 },
    ambient: 'bubbles',
    // Zones are fractions of the screen height
    zones: { swim: [0.42, 0.8], float: [0.38, 0.78], walk: [0.84, 0.92] },
    tint: '#38bdf8',
  },
  {
    id: 'space',
    bg: `${BASE}/space/bg.webp`,
    templates: ['rocket', 'ufo'],
    freeMotion: 'hover',
    freeBirth: 'portal',
    food: { items: ['⭐', '🌟'], fall: 'float', count: 1 },
    ambient: 'twinkles',
    zones: { fly: [0.1, 0.7], rocket: [0.1, 0.72], hover: [0.12, 0.7] },
    tint: '#8b5cf6',
  },
  {
    id: 'jungle',
    bg: `${BASE}/jungle/bg.webp`,
    templates: ['butterfly', 'parrot'],
    freeMotion: 'walk',
    freeBirth: 'flower',
    food: { items: ['🍓', '🍌', '🫐'], fall: 'drop', count: 1 },
    perches: [[1290, 795], [700, 885], [330, 765]],
    ambient: 'motes',
    zones: { fly: [0.1, 0.5], flutter: [0.18, 0.62], walk: [0.74, 0.9] },
    tint: '#22c55e',
  },
  {
    id: 'farm',
    bg: `${BASE}/farm/bg.webp`,
    templates: ['pig', 'hen'],
    freeMotion: 'walk',
    freeBirth: 'egg',
    food: { items: ['🌽', '🥕', '🍎'], fall: 'drop', count: 1 },
    ambient: 'motes',
    zones: { fly: [0.08, 0.4], walk: [0.7, 0.9] },
    tint: '#facc15',
  },
  {
    id: 'dinosaurs',
    bg: `${BASE}/dinosaurs/bg.webp`,
    templates: ['dino', 'ptero'],
    freeMotion: 'walk',
    freeBirth: 'egg',
    food: { items: ['🌿', '🍉', '🥬'], fall: 'drop', count: 1 },
    perches: [[235, 672], [455, 830], [1250, 880]],
    ambient: 'motes',
    zones: { fly: [0.08, 0.42], walk: [0.7, 0.88] },
    tint: '#f97316',
  },
  {
    id: 'fair',
    bg: `${BASE}/theme-park/bg.webp`,
    templates: ['balloon', 'teddy'],
    freeMotion: 'walk',
    freeBirth: 'present',
    food: { items: ['🍭', '🧁', '🍦', '🍪'], fall: 'drop', count: 1 },
    ambient: 'motes',
    zones: { hover: [0.12, 0.5], fly: [0.1, 0.45], walk: [0.76, 0.88] },
    tint: '#ec4899',
  },
];

export function getWorld(id) {
  return WORLDS.find(w => w.id === id);
}
