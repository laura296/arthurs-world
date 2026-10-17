/**
 * Draw Alive — worlds and colour-in creature templates.
 *
 * Every template is drawn in a 200×200 unit box. `parts` are filled
 * shapes whose union is the creature's body (overlapping is fine);
 * `details` are interior lines, clipped to the body, that split it into
 * lots of small areas to colour (scales, stripes, patches, plates).
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
      'M 62 66 Q 48 100 62 134',
      'M 74 70 Q 104 54 140 66',
      'M 92 144 Q 112 150 132 140',
      'M 90 50 Q 78 100 90 150',
      'M 118 52 Q 104 100 118 150',
      'M 10 64 L 54 94', 'M 10 136 L 54 106',
      'M 100 42 L 108 60', 'M 116 38 L 120 58',
      E(104, 78, 6), E(104, 122, 6), E(146, 118, 5),
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
      'M 24 82 Q 100 58 176 82',
      'M 34 102 Q 100 92 166 102',
      'M 20 136 L 180 136', 'M 20 160 L 180 160',
      E(62, 58, 7), E(138, 58, 7), E(100, 40, 7), E(56, 86, 5), E(144, 86, 5),
      'M 86 84 Q 100 96 114 84',
    ],
    eyes: [{ x: 80, y: 68, r: 10 }, { x: 120, y: 68, r: 10 }],
  },
  turtle: {
    id: 'turtle',
    birth: 'egg',
    motion: 'swim',
    parts: [
      E(100, 96, 62, 46),
      E(172, 96, 20, 16),
      'M 136 122 C 158 140 168 160 150 166 C 136 152 126 140 122 128 Z',
      'M 64 124 C 48 142 36 158 50 164 C 64 154 74 142 80 130 Z',
      'M 134 66 C 152 46 166 36 152 30 C 136 40 126 52 120 62 Z',
      'M 66 66 C 50 46 40 36 52 32 C 66 40 74 52 80 62 Z',
      'M 40 92 L 22 100 L 40 108 Z',
    ],
    details: [
      E(100, 96, 52, 37),
      'M 86 80 L 114 80 L 124 96 L 114 112 L 86 112 L 76 96 Z',
      'M 86 80 L 76 61', 'M 114 80 L 124 61', 'M 124 96 L 152 96',
      'M 114 112 L 124 131', 'M 86 112 L 76 131', 'M 76 96 L 48 96',
      'M 150 70 L 146 104 Q 152 120 166 110',
      'M 140 126 L 154 152', 'M 70 126 L 52 152',
      'M 178 104 Q 184 108 188 102',
    ],
    eyes: [{ x: 176, y: 91, r: 6.5 }],
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
      'M 60 46 Q 100 34 140 46',
      E(100, 78, 28), E(100, 78, 20),
      'M 56 108 L 144 108', 'M 56 124 L 144 124',
      'M 72 98 L 67 146', 'M 128 98 L 133 146',
      'M 40 156 L 66 124', 'M 160 156 L 134 124',
      E(84, 116, 4), E(100, 116, 4), E(116, 116, 4),
      'M 70 146 L 130 146', 'M 82 153 L 118 153',
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
      E(100, 40, 6),
    ],
    details: [
      'M 56 100 Q 100 90 144 100',
      'M 20 110 Q 100 132 180 110',
      'M 40 136 L 160 136',
      'M 100 46 L 100 50',
      E(48, 114, 6), E(76, 122, 6), E(100, 124, 6), E(124, 122, 6), E(152, 114, 6),
      'M 76 58 Q 84 50 96 50',
    ],
    eyes: [{ x: 87, y: 80, r: 10 }, { x: 113, y: 80, r: 10 }],
  },
  alien: {
    id: 'alien',
    birth: 'portal',
    motion: 'hover',
    parts: [
      E(100, 70, 46, 40),
      'M 74 40 L 62 14 L 70 10 L 84 36 Z', E(64, 10, 9),
      'M 126 40 L 138 14 L 130 10 L 116 36 Z', E(136, 10, 9),
      E(100, 140, 36, 36),
      E(58, 130, 13, 24), E(142, 130, 13, 24),
      leg(80, 164, 16, 28), leg(104, 164, 16, 28),
    ],
    details: [
      E(64, 10, 4), E(136, 10, 4),
      'M 60 96 Q 100 114 140 96',
      E(70, 56, 6), E(132, 56, 7), E(100, 38, 5), E(130, 86, 4),
      'M 86 90 Q 100 100 114 90',
      E(100, 144, 18, 20), E(100, 144, 8),
      'M 40 136 L 76 136', 'M 124 136 L 160 136',
      'M 70 178 L 130 178',
    ],
    eyes: [{ x: 80, y: 68, r: 9 }, { x: 100, y: 60, r: 10 }, { x: 120, y: 68, r: 9 }],
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
      E(100, 112, 13, 50), E(100, 58, 17),
      'M 86 96 L 114 96', 'M 86 116 L 114 116', 'M 86 136 L 114 136',
      'M 20 110 L 88 106', 'M 180 110 L 112 106',
      E(56, 76, 18), E(56, 76, 8), E(144, 76, 18), E(144, 76, 8),
      E(24, 62, 6), E(176, 62, 6), E(40, 44, 5), E(160, 44, 5),
      E(68, 136, 11), E(132, 136, 11),
      E(46, 150, 5), E(154, 150, 5),
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
      'M 78 92 Q 84 108 76 122', 'M 96 88 Q 104 108 96 126',
      'M 112 50 Q 106 84 150 122',
      'M 114 44 Q 132 38 152 44',
      'M 160 56 Q 164 70 160 84',
      'M 50 136 Q 94 162 148 132',
      'M 22 132 L 40 150', 'M 34 122 L 50 140',
      E(150, 92, 7),
      'M 88 150 L 86 166', 'M 108 150 L 110 166',
    ],
    eyes: [{ x: 144, y: 68, r: 9 }],
  },
  lion: {
    id: 'lion',
    birth: 'flower',
    motion: 'walk',
    parts: [
      E(134, 50, 18), E(162, 60, 18), E(172, 86, 18), E(162, 112, 18), E(134, 120, 18),
      E(106, 112, 18), E(96, 86, 18), E(106, 60, 18),
      E(134, 84, 32),
      E(84, 136, 56, 32),
      leg(42, 148, 18, 32), leg(66, 154, 18, 26), leg(100, 154, 18, 26), leg(124, 148, 18, 32),
      'M 30 128 C 12 120 6 100 14 92 C 20 100 24 114 36 120 Z', E(14, 90, 9),
    ],
    details: [
      E(134, 84, 32),
      'M 134 52 L 134 34', 'M 157 61 L 170 48', 'M 166 84 L 186 84', 'M 157 107 L 170 120',
      'M 134 116 L 134 136', 'M 111 107 L 98 120', 'M 102 84 L 82 84', 'M 111 61 L 98 48',
      E(134, 100, 14, 10),
      'M 128 92 L 140 92 L 134 98 Z',
      E(112, 64, 6), E(156, 64, 6),
      'M 30 166 L 150 166',
      'M 40 126 Q 84 146 124 122',
      E(14, 90, 4),
    ],
    eyes: [{ x: 124, y: 80, r: 6 }, { x: 144, y: 80, r: 6 }],
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
      E(148, 94, 34, 32),
      E(178, 100, 14, 16),
      E(174, 96, 2.5), E(182, 96, 2.5),
      'M 133 64 C 130 54 136 52 144 60', 'M 156 62 C 160 54 166 56 164 66',
      E(70, 100, 11), E(100, 92, 7), E(86, 126, 8), E(112, 118, 5),
      'M 40 164 L 160 164',
      'M 50 140 Q 92 156 132 140',
      'M 32 104 C 18 96 22 82 32 88 C 40 94 28 104 22 96',
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
      'M 82 104 Q 92 112 86 124', 'M 98 104 Q 106 114 100 128',
      'M 112 44 Q 132 38 154 44',
      'M 158 62 L 158 86',
      'M 152 88 L 156 104',
      E(134, 70, 30),
      'M 50 110 L 82 82',
      'M 46 80 L 66 94', 'M 56 66 L 72 86',
      'M 36 132 Q 94 166 150 132',
      'M 88 158 L 86 178 M 78 178 L 94 178',
      'M 108 158 L 110 178 M 102 178 L 118 178',
    ],
    eyes: [{ x: 140, y: 64, r: 8 }],
  },
  cow: {
    id: 'cow',
    birth: 'puddle',
    motion: 'walk',
    parts: [
      E(92, 108, 60, 38),
      E(156, 86, 28, 30),
      E(162, 112, 22, 15),
      'M 140 60 L 134 42 L 148 54 Z', 'M 168 58 L 176 42 L 176 62 Z',
      E(128, 70, 11, 7), E(186, 70, 11, 7),
      leg(46, 130, 18, 42), leg(70, 136, 18, 36), leg(106, 136, 18, 36), leg(130, 130, 18, 42),
      E(96, 146, 14, 9),
      'M 32 98 C 18 108 16 130 20 142 L 26 142 C 24 128 28 114 36 106 Z', E(22, 144, 6),
    ],
    details: [
      'M 56 82 C 72 74 88 86 82 100 C 74 112 54 104 56 82 Z',
      'M 102 110 C 118 102 132 114 124 128 C 112 138 96 128 102 110 Z',
      'M 106 74 C 116 70 126 78 120 88 C 112 92 102 84 106 74 Z',
      'M 150 66 C 160 62 172 70 166 80 C 158 84 148 76 150 66 Z',
      E(162, 112, 22, 15),
      E(155, 112, 3), E(169, 112, 3),
      E(156, 86, 28, 30),
      'M 36 160 L 156 160',
      E(96, 146, 14, 9),
      'M 136 50 L 146 56', 'M 172 50 L 170 60',
    ],
    eyes: [{ x: 148, y: 84, r: 6 }, { x: 168, y: 84, r: 6 }],
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
      E(72, 108, 7), E(96, 100, 6), E(104, 124, 8), E(78, 132, 5), E(56, 120, 4),
      'M 36 136 Q 88 160 144 130',
      'M 130 92 L 156 100', 'M 136 72 L 162 78', 'M 140 56 L 164 60',
      'M 16 138 L 30 124', 'M 26 144 L 40 128',
      'M 44 162 L 146 162',
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
      'M 22 36 C 40 60 56 92 76 114',
      'M 150 44 C 140 64 128 84 112 106',
      'M 156 34 C 148 70 132 96 112 114',
      'M 124 86 Q 114 102 124 116',
      'M 78 94 L 96 126', 'M 104 90 L 120 120',
      'M 138 88 L 120 76',
      E(98, 112, 16, 8),
      'M 160 98 L 190 100',
    ],
    eyes: [{ x: 148, y: 92, r: 6 }],
  },
  stego: {
    id: 'stego',
    birth: 'egg',
    motion: 'walk',
    parts: [
      E(96, 120, 58, 32),
      'M 50 100 L 58 70 L 74 94 Z',
      'M 70 92 L 82 56 L 98 88 Z',
      'M 94 88 L 108 50 L 122 90 Z',
      'M 118 92 L 134 62 L 142 100 Z',
      'M 140 110 L 160 110 L 160 126 L 140 128 Z', E(168, 118, 18, 12),
      'M 42 114 C 24 118 12 126 6 134 C 20 136 34 132 46 128 Z',
      'M 14 128 L 6 112 L 22 126 Z', 'M 24 126 L 18 108 L 30 124 Z',
      leg(54, 138, 18, 30), leg(76, 142, 18, 26), leg(106, 142, 18, 26), leg(128, 138, 18, 30),
    ],
    details: [
      'M 66 97 L 58 70', 'M 84 90 L 82 56', 'M 108 89 L 108 50', 'M 130 96 L 134 62',
      'M 46 102 Q 96 84 146 106',
      'M 40 130 Q 96 152 150 128',
      E(80, 116, 7), E(104, 112, 6), E(122, 122, 5), E(64, 124, 5),
      'M 46 162 L 150 162',
      'M 174 124 Q 180 126 184 122',
    ],
    eyes: [{ x: 172, y: 114, r: 5.5 }],
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
      'M 100 8 L 100 152',
      'M 70 18 Q 52 82 78 148', 'M 130 18 Q 148 82 122 148',
      'M 36 64 Q 100 76 164 64',
      'M 84 150 L 116 150',
      'M 100 162 C 90 174 110 184 100 198',
      'M 112 112 Q 100 120 88 112',
    ],
    eyes: [{ x: 84, y: 92, r: 9 }, { x: 116, y: 92, r: 9 }],
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
      'M 70 94 Q 100 106 130 94',
      'M 84 92 L 100 100 L 84 108 Z', 'M 116 92 L 100 100 L 116 108 Z', E(100, 100, 4),
      E(100, 140, 22, 24),
      'M 70 100 Q 62 120 72 142', 'M 130 100 Q 138 120 128 142',
      'M 56 160 Q 100 170 144 160',
      E(76, 176, 9, 6), E(124, 176, 9, 6),
      'M 94 82 Q 100 88 106 82',
    ],
    eyes: [{ x: 86, y: 56, r: 7.5 }, { x: 114, y: 56, r: 7.5 }],
  },
  icecream: {
    id: 'icecream',
    birth: 'present',
    motion: 'hover',
    parts: [
      'M 68 110 L 132 110 L 100 196 Z',
      E(100, 98, 36, 22),
      E(76, 72, 25, 21), E(124, 72, 25, 21),
      E(100, 46, 27, 23),
      E(100, 16, 9),
      'M 72 112 C 70 124 80 126 80 116 Z', 'M 124 114 C 124 128 134 128 132 112 Z',
    ],
    details: [
      'M 72 110 L 106 196', 'M 90 110 L 114 172', 'M 108 110 L 122 146',
      'M 128 110 L 94 196', 'M 110 110 L 86 172', 'M 92 110 L 78 146',
      'M 62 108 Q 100 122 138 108',
      E(76, 72, 25, 21), E(124, 72, 25, 21), E(100, 46, 27, 23),
      'M 100 6 Q 106 0 112 2',
      E(86, 40, 3), E(112, 34, 3), E(108, 56, 3), E(66, 66, 3), E(132, 64, 3), E(80, 84, 3), E(140, 80, 3),
      'M 92 104 Q 100 110 108 104',
    ],
    eyes: [{ x: 88, y: 96, r: 7 }, { x: 112, y: 96, r: 7 }],
  },
};

/** Viewbox the drawing paper shows around the 200-unit template box. */
export const VIEWBOX = { x: -10, y: -10, size: 220 };

export const WORLDS = [
  {
    id: 'sea',
    bg: `${BASE}/sea/bg.webp`,
    templates: ['fish', 'jellyfish', 'turtle'],
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
    templates: ['rocket', 'ufo', 'alien'],
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
    templates: ['butterfly', 'parrot', 'lion'],
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
    templates: ['pig', 'hen', 'cow'],
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
    templates: ['dino', 'ptero', 'stego'],
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
    templates: ['balloon', 'teddy', 'icecream'],
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
