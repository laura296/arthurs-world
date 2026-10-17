/**
 * Draw Alive — dress-up accessories (crowns, hats, glasses…) that stick
 * onto a creature before it goes into its world.
 *
 * Each accessory draws itself with the Canvas 2D API in a 100×100 unit
 * box centred on (50, 50), in the game's chunky toy style: bright fills,
 * a thick warm-brown OUTLINE and a soft white shine. Keeping them on a
 * canvas means they can be composited straight into the creature sprite.
 *
 * `place` hints where it sits by default:
 *   top (hats/crowns) | eyes (glasses) | face (moustache) | neck (bow tie) | side (flower, bow)
 */
import { OUTLINE } from './sprite';

const LINE = 5;
const SHINE = 'rgba(255,255,255,0.45)';

function begin(ctx) {
  ctx.save();
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.strokeStyle = OUTLINE;
  ctx.lineWidth = LINE;
}

/** Fill a path, then outline it. */
function ink(ctx, path, fill, width = LINE) {
  ctx.fillStyle = fill;
  ctx.fill(path);
  ctx.strokeStyle = OUTLINE;
  ctx.lineWidth = width;
  ctx.stroke(path);
}

/** Top-lit vertical gradient: light at y0, base colour at y1. */
function shade(ctx, y0, y1, light, base) {
  const g = ctx.createLinearGradient(0, y0, 0, y1);
  g.addColorStop(0, light);
  g.addColorStop(1, base);
  return g;
}

/** Soft white highlight blob for a glossy toy look. */
function shine(ctx, x, y, rx, ry, rot = -0.5, colour = SHINE) {
  ctx.save();
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function circle(cx, cy, r) {
  const p = new Path2D();
  p.arc(cx, cy, r, 0, Math.PI * 2);
  return p;
}

function ellipse(cx, cy, rx, ry, rot = 0) {
  const p = new Path2D();
  p.ellipse(cx, cy, rx, ry, rot, 0, Math.PI * 2);
  return p;
}

/** Round heart centred on (cx, cy), roughly 2s wide. */
function heart(cx, cy, s) {
  return new Path2D(
    `M ${cx} ${cy + s * 0.95}` +
    ` C ${cx - s * 0.5} ${cy + s * 0.6} ${cx - s * 1.05} ${cy + s * 0.15} ${cx - s * 1.05} ${cy - s * 0.3}` +
    ` C ${cx - s * 1.05} ${cy - s * 0.95} ${cx - s * 0.2} ${cy - s * 1.1} ${cx} ${cy - s * 0.45}` +
    ` C ${cx + s * 0.2} ${cy - s * 1.1} ${cx + s * 1.05} ${cy - s * 0.95} ${cx + s * 1.05} ${cy - s * 0.3}` +
    ` C ${cx + s * 1.05} ${cy + s * 0.15} ${cx + s * 0.5} ${cy + s * 0.6} ${cx} ${cy + s * 0.95} Z`,
  );
}

/** Draw `fn` once as-is and once mirrored across x = 50. */
function mirrored(ctx, fn) {
  fn();
  ctx.save();
  ctx.translate(100, 0);
  ctx.scale(-1, 1);
  fn();
  ctx.restore();
}

function crown(ctx) {
  begin(ctx);
  const body = new Path2D(
    'M 16 82 L 13 40 L 33 58 L 50 30 L 67 58 L 87 40 L 84 82 Q 50 88 16 82 Z',
  );
  // Balls on the tips go behind so the body's outline reads cleanly.
  ink(ctx, circle(13, 36, 7), '#FFD84D');
  ink(ctx, circle(50, 25, 7.5), '#FFD84D');
  ink(ctx, circle(87, 36, 7), '#FFD84D');
  ink(ctx, body, shade(ctx, 30, 86, '#FFE680', '#F7B52C'));
  const band = new Path2D('M 15 66 Q 50 72 85 66 L 84 82 Q 50 88 16 82 Z');
  ink(ctx, band, '#F29A1F');
  ink(ctx, ellipse(30, 75, 5.5, 6), '#3D8BFF', 3.5);
  ink(ctx, ellipse(50, 77, 7, 7.5), '#FF3B5C', 3.5);
  ink(ctx, ellipse(70, 75, 5.5, 6), '#34C759', 3.5);
  shine(ctx, 26, 56, 4, 9, -0.25);
  shine(ctx, 48, 75, 2.4, 2.4, 0, 'rgba(255,255,255,0.75)');
  shine(ctx, 11, 34, 2.4, 2.4, 0);
  shine(ctx, 48, 23, 2.6, 2.6, 0);
  shine(ctx, 85, 34, 2.4, 2.4, 0);
  ctx.restore();
}

function partyhat(ctx) {
  begin(ctx);
  const cone = new Path2D('M 50 24 C 58 40 72 66 80 84 Q 50 96 20 84 C 28 66 42 40 50 24 Z');
  ctx.fillStyle = shade(ctx, 24, 92, '#8C7BFF', '#6A4DF0');
  ctx.fill(cone);
  ctx.save();
  ctx.clip(cone);
  // Wavy stripes going round the cone.
  ctx.lineWidth = 7;
  ctx.strokeStyle = '#FFD84D';
  for (const y of [44, 64, 84]) {
    ctx.beginPath();
    ctx.moveTo(10, y + 2);
    ctx.quadraticCurveTo(50, y + 10, 90, y + 2);
    ctx.stroke();
  }
  [[44, 54], [58, 56], [36, 74], [52, 75], [66, 74]].forEach(([x, y]) => {
    ctx.fillStyle = '#FF6FB5';
    ctx.beginPath();
    ctx.arc(x, y, 3.6, 0, Math.PI * 2);
    ctx.fill();
  });
  shine(ctx, 40, 58, 3.5, 16, 0.42);
  ctx.restore();
  ctx.strokeStyle = OUTLINE;
  ctx.lineWidth = LINE;
  ctx.stroke(cone);
  // Fluffy pom-pom.
  const pom = new Path2D();
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    pom.moveTo(50 + Math.cos(a) * 6 + 4.5, 17 + Math.sin(a) * 6);
    pom.arc(50 + Math.cos(a) * 6, 17 + Math.sin(a) * 6, 4.5, 0, Math.PI * 2);
  }
  pom.moveTo(57, 17);
  pom.arc(50, 17, 7, 0, Math.PI * 2);
  ctx.strokeStyle = OUTLINE;
  ctx.lineWidth = LINE * 2;
  ctx.stroke(pom);
  ctx.fillStyle = '#FF6FB5';
  ctx.fill(pom, 'nonzero');
  shine(ctx, 46, 13, 3.4, 2.6, -0.5);
  ctx.restore();
}

function tophat(ctx) {
  begin(ctx);
  const tall = new Path2D(
    'M 29 78 L 26 24 Q 26 17 33 17 L 67 17 Q 74 17 74 24 L 71 78 Z',
  );
  ink(ctx, tall, shade(ctx, 17, 78, '#4A4560', '#26222F'));
  const band = new Path2D('M 28 58 L 72 58 L 71 74 L 29 74 Z');
  ink(ctx, band, '#E8384F');
  shine(ctx, 36, 66, 3, 3.5, 0, 'rgba(255,255,255,0.35)');
  const brim = new Path2D(
    'M 10 78 C 10 70 26 72 50 72 C 74 72 90 70 90 78 C 90 88 70 88 50 88 C 30 88 10 88 10 78 Z',
  );
  ink(ctx, brim, shade(ctx, 70, 88, '#4A4560', '#26222F'));
  shine(ctx, 36, 36, 3.2, 13, 0, 'rgba(255,255,255,0.3)');
  shine(ctx, 26, 78, 9, 2.2, -0.08, 'rgba(255,255,255,0.3)');
  ctx.restore();
}

function cowboy(ctx) {
  begin(ctx);
  const top = new Path2D(
    'M 29 70 C 27 46 30 28 40 26 C 45 25 47 32 50 32 C 53 32 55 25 60 26 C 70 28 73 46 71 70 Z',
  );
  ink(ctx, top, shade(ctx, 26, 70, '#D99A5B', '#B0692F'));
  const band = new Path2D('M 29 56 Q 50 61 71 56 L 71 68 Q 50 72 29 68 Z');
  ink(ctx, band, '#6B3B1B', 4);
  ink(ctx, circle(50, 63, 3.6), '#FFD84D', 3);
  const brim = new Path2D(
    'M 6 50 C 9 74 30 86 50 86 C 70 86 91 74 94 50 C 90 62 78 68 50 68 C 22 68 10 62 6 50 Z',
  );
  ink(ctx, brim, shade(ctx, 50, 86, '#D99A5B', '#A65F28'));
  shine(ctx, 38, 42, 3, 9, 0.15);
  shine(ctx, 22, 74, 7, 2.6, 0.45);
  ctx.restore();
}

function bow(ctx) {
  begin(ctx);
  const pink = shade(ctx, 22, 80, '#FF9ACB', '#F25AA2');
  const tails = new Path2D(
    'M 46 54 L 32 84 L 41 81 L 46 89 L 53 58 Z M 54 54 L 68 84 L 59 81 L 54 89 L 47 58 Z',
  );
  ink(ctx, tails, '#E8489A');
  const loops = new Path2D(
    'M 50 50 C 38 28 10 20 8 40 C 6 56 12 70 24 70 C 36 70 44 60 50 50 Z' +
    'M 50 50 C 62 28 90 20 92 40 C 94 56 88 70 76 70 C 64 70 56 60 50 50 Z',
  );
  ink(ctx, loops, pink);
  // Folds inside each loop.
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(42, 50);
  ctx.quadraticCurveTo(28, 40, 20, 46);
  ctx.moveTo(58, 50);
  ctx.quadraticCurveTo(72, 40, 80, 46);
  ctx.stroke();
  const knot = new Path2D('M 41 42 Q 50 37 59 42 Q 62 50 59 58 Q 50 63 41 58 Q 38 50 41 42 Z');
  ink(ctx, knot, '#E8489A');
  shine(ctx, 19, 37, 4, 7, 0.6);
  shine(ctx, 81, 37, 4, 7, -0.6);
  shine(ctx, 46, 46, 2.4, 3, 0.3);
  ctx.restore();
}

function sunglasses(ctx) {
  begin(ctx);
  const lens = new Path2D(
    'M 10 40 L 46 40 C 47 58 41 72 27 72 C 14 72 9 60 8 46 Q 8 40 10 40 Z',
  );
  const glass = ctx.createLinearGradient(0, 40, 0, 72);
  glass.addColorStop(0, '#7A4BB5');
  glass.addColorStop(0.5, '#33205A');
  glass.addColorStop(1, '#160B26');
  mirrored(ctx, () => {
    ink(ctx, lens, glass);
    ctx.save();
    ctx.clip(lens);
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.moveTo(14, 66);
    ctx.lineTo(30, 46);
    ctx.stroke();
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(22, 70);
    ctx.lineTo(37, 51);
    ctx.stroke();
    ctx.restore();
  });
  // One chunky brow bar across both lenses, curving up over the nose.
  const bar = new Path2D(
    'M 6 37 Q 6 32 12 32 L 40 32 Q 50 26 60 32 L 88 32 Q 94 32 94 37 L 94 41' +
    ' Q 94 45 89 45 L 60 45 Q 50 38 40 45 L 11 45 Q 6 45 6 41 Z',
  );
  ink(ctx, bar, shade(ctx, 28, 45, '#5C3B8C', '#2A1A45'));
  shine(ctx, 22, 36, 8, 1.6, 0, 'rgba(255,255,255,0.4)');
  shine(ctx, 78, 36, 8, 1.6, 0, 'rgba(255,255,255,0.4)');
  ctx.restore();
}

function heartglasses(ctx) {
  begin(ctx);
  // Bridge between the hearts.
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.moveTo(42, 46);
  ctx.quadraticCurveTo(50, 38, 58, 46);
  ctx.stroke();
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#E8384F';
  ctx.stroke();
  mirrored(ctx, () => {
    ink(ctx, heart(27, 52, 22), shade(ctx, 30, 74, '#FF6B7E', '#E3243F'));
    const lens = ctx.createLinearGradient(0, 36, 0, 70);
    lens.addColorStop(0, '#FFD3DE');
    lens.addColorStop(1, '#FF8FAE');
    ink(ctx, heart(27, 53, 14.5), lens, 3);
    shine(ctx, 20, 47, 3, 5, 0.6, 'rgba(255,255,255,0.75)');
    shine(ctx, 13, 42, 2.6, 4.5, 0.5);
  });
  ctx.restore();
}

function moustache(ctx) {
  begin(ctx);
  // One half, mirrored: a plump lobe sweeping out into an upturned curly tip.
  const half = new Path2D(
    'M 50 46 C 56 36 68 36 74 44 C 78 50 84 52 88 46 C 90 43 89 38 85 37' +
    ' C 92 34 97 44 93 53 C 87 65 72 66 62 62 C 56 60 52 58 50 58 Z',
  );
  const fur = shade(ctx, 34, 66, '#A8713F', '#7A4A22');
  mirrored(ctx, () => {
    ctx.strokeStyle = OUTLINE;
    ctx.lineWidth = LINE * 2;
    ctx.stroke(half);
  });
  mirrored(ctx, () => {
    ctx.fillStyle = fur;
    ctx.fill(half);
  });
  // Soft hair strokes and a centre parting.
  ctx.strokeStyle = OUTLINE;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(50, 48);
  ctx.lineTo(50, 56);
  mirrored(ctx, () => {
    ctx.moveTo(60, 56);
    ctx.quadraticCurveTo(68, 58, 74, 55);
  });
  ctx.stroke();
  mirrored(ctx, () => shine(ctx, 61, 44, 6, 2.6, -0.25));
  ctx.restore();
}

function bowtie(ctx) {
  begin(ctx);
  const wings = new Path2D(
    'M 50 50 C 38 38 26 26 15 28 C 7 30 6 70 15 72 C 26 74 38 62 50 50 Z' +
    'M 50 50 C 62 38 74 26 85 28 C 93 30 94 70 85 72 C 74 74 62 62 50 50 Z',
  );
  ctx.fillStyle = shade(ctx, 26, 74, '#FF5A6E', '#D91F3A');
  ctx.fill(wings);
  ctx.save();
  ctx.clip(wings);
  ctx.fillStyle = '#FFFFFF';
  [[16, 38], [28, 46], [16, 58], [28, 60], [38, 52], [84, 38], [72, 46], [84, 58], [72, 60], [62, 52]]
    .forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 3.6, 0, Math.PI * 2);
      ctx.fill();
    });
  ctx.restore();
  ctx.strokeStyle = OUTLINE;
  ctx.lineWidth = LINE;
  ctx.stroke(wings);
  const knot = new Path2D('M 41 41 Q 50 36 59 41 Q 62 50 59 59 Q 50 64 41 59 Q 38 50 41 41 Z');
  ink(ctx, knot, '#C8182F');
  shine(ctx, 14, 44, 2.6, 6, 0.1);
  shine(ctx, 86, 44, 2.6, 6, -0.1);
  shine(ctx, 46, 45, 2.4, 3, 0.3);
  ctx.restore();
}

function flower(ctx) {
  begin(ctx);
  const n = 8;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    const petal = ellipse(50 + Math.cos(a) * 23, 50 + Math.sin(a) * 23, 16, 9.5, a);
    ink(ctx, petal, '#FFFFFF');
    ctx.save();
    ctx.clip(petal);
    ctx.fillStyle = 'rgba(255,170,200,0.35)';
    ctx.beginPath();
    ctx.arc(50, 50, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.lineWidth = LINE;
    ctx.stroke(petal);
  }
  const centre = circle(50, 50, 15);
  const g = ctx.createRadialGradient(45, 44, 2, 50, 50, 16);
  g.addColorStop(0, '#FFE680');
  g.addColorStop(1, '#F7A81B');
  ink(ctx, centre, g);
  ctx.fillStyle = 'rgba(200,110,20,0.55)';
  [[54, 55], [44, 56], [57, 47], [50, 60]].forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 1.8, 0, Math.PI * 2);
    ctx.fill();
  });
  shine(ctx, 44, 44, 4.5, 3, -0.6);
  ctx.restore();
}

/** id, a draw function working in a 100×100 unit box centred on (50, 50), and where it usually sits. */
export const ACCESSORIES = [
  { id: 'crown', draw: crown, place: 'top' },
  { id: 'partyhat', draw: partyhat, place: 'top' },
  { id: 'tophat', draw: tophat, place: 'top' },
  { id: 'cowboy', draw: cowboy, place: 'top' },
  { id: 'bow', draw: bow, place: 'side' },
  { id: 'sunglasses', draw: sunglasses, place: 'eyes' },
  { id: 'heartglasses', draw: heartglasses, place: 'eyes' },
  { id: 'moustache', draw: moustache, place: 'face' },
  { id: 'bowtie', draw: bowtie, place: 'neck' },
  { id: 'flower', draw: flower, place: 'side' },
];

const canvases = new Map();
const urls = new Map();

/** A cached canvas (px × px) with the accessory drawn on a transparent background. */
export function accessoryCanvas(id, px = 256) {
  const key = `${id}|${px}`;
  if (canvases.has(key)) return canvases.get(key);
  const c = document.createElement('canvas');
  c.width = px;
  c.height = px;
  const acc = ACCESSORIES.find(a => a.id === id);
  if (acc) {
    const ctx = c.getContext('2d');
    ctx.scale(px / 100, px / 100);
    acc.draw(ctx);
  }
  canvases.set(key, c);
  return c;
}

/** Cached PNG data URL of accessoryCanvas(id, 160), for <img> previews and buttons. */
export function accessoryUrl(id) {
  const key = `${id}|160`;
  if (!urls.has(key)) urls.set(key, accessoryCanvas(id, 160).toDataURL('image/png'));
  return urls.get(key);
}
