/**
 * Draw Alive — the magic bucket and special paints.
 *
 * The bucket fills just the area Arthur taps: on a template, the outline
 * and its interior lines are walls; on blank paper, his own lines are.
 */
import { VIEWBOX } from './worlds';

/** 1 where paint can't flow: outside the body, or on one of its lines. */
export function buildWalls(template, size) {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, size, size);
  const unit = size / VIEWBOX.size;
  ctx.setTransform(unit, 0, 0, unit, -VIEWBOX.x * unit, -VIEWBOX.y * unit);
  ctx.fillStyle = '#fff';
  template.parts.forEach(d => ctx.fill(new Path2D(d)));
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2.6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  template.details.forEach(d => ctx.stroke(new Path2D(d)));
  const data = ctx.getImageData(0, 0, size, size).data;
  const walls = new Uint8Array(size * size);
  for (let i = 0; i < walls.length; i++) walls[i] = data[i * 4] < 128 ? 1 : 0;
  return walls;
}

/**
 * The connected area around (sx, sy) whose colour matches the tapped pixel
 * (drawing composited over white paper), stopping at walls.
 */
export function floodRegion(data, walls, w, h, sx, sy, tolerance = 46) {
  const start = sy * w + sx;
  if (walls && walls[start]) return null;
  const rgb = (i) => {
    const a = data[i * 4 + 3] / 255;
    return [
      data[i * 4] * a + 255 * (1 - a),
      data[i * 4 + 1] * a + 255 * (1 - a),
      data[i * 4 + 2] * a + 255 * (1 - a),
    ];
  };
  const [sr, sg, sb] = rgb(start);
  const limit = tolerance * tolerance * 3;
  const mask = new Uint8Array(w * h);
  const matches = (i) => {
    if (mask[i] || (walls && walls[i])) return false;
    const [r, g, b] = rgb(i);
    return (r - sr) ** 2 + (g - sg) ** 2 + (b - sb) ** 2 <= limit;
  };

  let minX = sx, maxX = sx, minY = sy, maxY = sy, count = 0;
  const stack = [sx, sy];
  while (stack.length) {
    const y = stack.pop();
    let x = stack.pop();
    while (x > 0 && matches(y * w + x - 1)) x--;
    let up = false, down = false;
    for (; x < w && matches(y * w + x); x++) {
      mask[y * w + x] = 1;
      count++;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      if (y > 0) {
        const m = matches((y - 1) * w + x);
        if (m && !up) stack.push(x, y - 1);
        up = m;
      }
      if (y < h - 1) {
        const m = matches((y + 1) * w + x);
        if (m && !down) stack.push(x, y + 1);
        down = m;
      }
    }
  }
  if (!count) return null;
  return {
    mask, minX, minY, maxX, maxY, count,
    touchesEdge: minX === 0 || minY === 0 || maxX === w - 1 || maxY === h - 1,
  };
}

let scratch = null;

/**
 * Paint the area, spreading a few pixels under its lines so no white gaps
 * show. With `protectInk`, the spread never paints over drawn lines (blank
 * paper, where the lines are Arthur's own).
 */
export function paintRegion(canvas, region, makeStyle, spread, protectInk = false) {
  const W = canvas.width, H = canvas.height;
  const pad = spread + 1;
  const bx = Math.max(0, region.minX - pad), by = Math.max(0, region.minY - pad);
  const bw = Math.min(W, region.maxX + pad + 1) - bx, bh = Math.min(H, region.maxY + pad + 1) - by;

  // Grow the mask by `spread` pixels (box dilation, rows then columns)
  const local = new Uint8Array(bw * bh);
  for (let y = 0; y < bh; y++) {
    for (let x = 0; x < bw; x++) local[y * bw + x] = region.mask[(by + y) * W + bx + x];
  }
  const rows = new Uint8Array(bw * bh);
  for (let y = 0; y < bh; y++) {
    let run = -1e9;
    for (let x = 0; x < bw; x++) {
      if (local[y * bw + x]) run = x;
      if (x - run <= spread) rows[y * bw + x] = 1;
    }
    run = 1e9;
    for (let x = bw - 1; x >= 0; x--) {
      if (local[y * bw + x]) run = x;
      if (run - x <= spread) rows[y * bw + x] = 1;
    }
  }
  const grown = new Uint8Array(bw * bh);
  for (let x = 0; x < bw; x++) {
    let run = -1e9;
    for (let y = 0; y < bh; y++) {
      if (rows[y * bw + x]) run = y;
      if (y - run <= spread) grown[y * bw + x] = 1;
    }
    run = 1e9;
    for (let y = bh - 1; y >= 0; y--) {
      if (rows[y * bw + x]) run = y;
      if (run - y <= spread) grown[y * bw + x] = 1;
    }
  }

  // One reused scratch canvas: Safari is slow to free canvas memory
  scratch = scratch || document.createElement('canvas');
  scratch.width = bw;
  scratch.height = bh;
  const t = scratch.getContext('2d', { willReadFrequently: true });
  t.translate(-bx, -by);
  t.fillStyle = makeStyle(t, region);
  t.fillRect(bx, by, bw, bh);
  const src = t.getImageData(0, 0, bw, bh).data;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const dst = ctx.getImageData(bx, by, bw, bh);
  const d = dst.data;
  for (let i = 0; i < grown.length; i++) {
    if (!grown[i]) continue;
    if (protectInk && d[i * 4 + 3] > 200 && !region.mask[(by + ((i / bw) | 0)) * W + bx + (i % bw)]) continue;
    d[i * 4] = src[i * 4];
    d[i * 4 + 1] = src[i * 4 + 1];
    d[i * 4 + 2] = src[i * 4 + 2];
    d[i * 4 + 3] = 255;
  }
  ctx.putImageData(dst, bx, by);
}

/* ── Special paints: polka dots, stripes, glitter, rainbow ── */

const RAINBOW = ['#ef4444', '#f97316', '#facc15', '#22c55e', '#38bdf8', '#8b5cf6', '#ec4899'];
const tiles = new Map();

function tile(effect, colour, k) {
  const key = `${effect}|${colour}|${k.toFixed(2)}`;
  if (tiles.has(key)) return tiles.get(key);
  const c = document.createElement('canvas');
  const g = c.getContext('2d');
  if (effect === 'dots') {
    const s = Math.round(30 * k);
    c.width = c.height = s;
    g.fillStyle = colour;
    g.fillRect(0, 0, s, s);
    g.fillStyle = 'rgba(255,255,255,0.9)';
    [[0.25, 0.25], [0.75, 0.75]].forEach(([x, y]) => {
      g.beginPath();
      g.arc(x * s, y * s, s * 0.15, 0, Math.PI * 2);
      g.fill();
    });
  } else if (effect === 'stripes') {
    const s = Math.round(26 * k);
    c.width = c.height = s;
    g.fillStyle = colour;
    g.fillRect(0, 0, s, s);
    g.strokeStyle = 'rgba(255,255,255,0.6)';
    g.lineWidth = s * 0.28;
    [-s, 0, s].forEach(o => {
      g.beginPath();
      g.moveTo(o, s);
      g.lineTo(o + s, 0);
      g.stroke();
    });
  } else {
    // glitter
    const s = Math.round(70 * k);
    c.width = c.height = s;
    g.fillStyle = colour;
    g.fillRect(0, 0, s, s);
    const sparkle = ['#ffffff', '#fef08a', '#fde68a', '#fbcfe8'];
    for (let i = 0; i < 70; i++) {
      g.globalAlpha = 0.55 + Math.random() * 0.45;
      g.fillStyle = sparkle[i % sparkle.length];
      g.beginPath();
      g.arc(Math.random() * s, Math.random() * s, (0.6 + Math.random() * 1.6) * k, 0, Math.PI * 2);
      g.fill();
    }
    g.globalAlpha = 1;
    g.fillStyle = '#ffffff';
    for (let i = 0; i < 4; i++) {
      const x = Math.random() * s, y = Math.random() * s, r = (3 + Math.random() * 3) * k;
      g.beginPath();
      g.moveTo(x, y - r); g.lineTo(x + r * 0.25, y - r * 0.25); g.lineTo(x + r, y);
      g.lineTo(x + r * 0.25, y + r * 0.25); g.lineTo(x, y + r); g.lineTo(x - r * 0.25, y + r * 0.25);
      g.lineTo(x - r, y); g.lineTo(x - r * 0.25, y - r * 0.25);
      g.closePath();
      g.fill();
    }
  }
  tiles.set(key, c);
  return c;
}

/**
 * A fill/stroke style for a colour and effect.
 * `k` scales patterns to the canvas; `box` spans a rainbow across a filled area.
 */
export function paintStyle(ctx, colour, effect, k, box) {
  if (effect === 'rainbow') {
    const x0 = box ? box.minX : 0;
    const x1 = box ? box.maxX + 1 : ctx.canvas.width;
    const grad = ctx.createLinearGradient(x0, 0, x1, 0);
    RAINBOW.forEach((c, i) => grad.addColorStop(i / (RAINBOW.length - 1), c));
    return grad;
  }
  if (effect === 'dots' || effect === 'stripes' || effect === 'glitter') {
    return ctx.createPattern(tile(effect, colour, k), 'repeat');
  }
  return colour;
}
