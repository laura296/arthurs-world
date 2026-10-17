/**
 * Draw Alive — turns a drawing into a creature sprite, and remembers
 * each world's creatures between visits.
 */
import { VIEWBOX } from './worlds';

export const OUTLINE = '#4a2c1a';
const SPRITE_SIZE = 360;
const MAX_PER_WORLD = 8;

/** Speckled paper grain, made once: used for the waxy crayon look. */
let grain = null;
export function grainCanvas() {
  if (grain) return grain;
  grain = document.createElement('canvas');
  grain.width = 160;
  grain.height = 160;
  const g = grain.getContext('2d');
  const img = g.createImageData(160, 160);
  for (let i = 0; i < img.data.length; i += 4) {
    img.data[i] = 110;
    img.data[i + 1] = 70;
    img.data[i + 2] = 40;
    img.data[i + 3] = Math.random() < 0.5 ? Math.random() * 90 : 0;
  }
  g.putImageData(img, 0, 0);
  return grain;
}

/** Crayon strokes let a little paper show through, like wax on paper. */
function waxy(strokes) {
  const c = document.createElement('canvas');
  c.width = strokes.width;
  c.height = strokes.height;
  const ctx = c.getContext('2d');
  ctx.drawImage(strokes, 0, 0);
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = ctx.createPattern(grainCanvas(), 'repeat');
  ctx.fillRect(0, 0, c.width, c.height);
  return c;
}

/** Outer outline of a union of shapes: fat stroke, then punch the fill out. */
function drawOutline(ctx, paths, width) {
  const c = document.createElement('canvas');
  c.width = ctx.canvas.width;
  c.height = ctx.canvas.height;
  const o = c.getContext('2d');
  o.setTransform(ctx.getTransform());
  o.strokeStyle = OUTLINE;
  o.lineWidth = width * 2;
  o.lineJoin = 'round';
  paths.forEach(p => o.stroke(p));
  o.globalCompositeOperation = 'destination-out';
  paths.forEach(p => o.fill(p));
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.drawImage(c, 0, 0);
  ctx.restore();
}

/** Bounding box of non-transparent pixels, or null when empty. */
function contentBounds(canvas) {
  const { width, height } = canvas;
  const data = canvas.getContext('2d').getImageData(0, 0, width, height).data;
  let minX = width, minY = height, maxX = -1, maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > 16) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return null;
  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
}

/** Copy a region into a new canvas scaled so its longest side is `max`. */
function cropTo(canvas, box, pad, max) {
  const bx = Math.max(0, box.x - pad);
  const by = Math.max(0, box.y - pad);
  const bw = Math.min(canvas.width - bx, box.w + pad * 2);
  const bh = Math.min(canvas.height - by, box.h + pad * 2);
  const scale = max / Math.max(bw, bh);
  const out = document.createElement('canvas');
  out.width = Math.round(bw * scale);
  out.height = Math.round(bh * scale);
  out.getContext('2d').drawImage(canvas, bx, by, bw, bh, 0, 0, out.width, out.height);
  return { canvas: out, offX: bx, offY: by, scale };
}

/** White sticker border around a free drawing so it pops off any background. */
function stickerBorder(src, radius) {
  const pad = Math.ceil(radius) + 2;
  const out = document.createElement('canvas');
  out.width = src.width + pad * 2;
  out.height = src.height + pad * 2;
  const ctx = out.getContext('2d');
  const white = document.createElement('canvas');
  white.width = src.width;
  white.height = src.height;
  const w = white.getContext('2d');
  w.drawImage(src, 0, 0);
  w.globalCompositeOperation = 'source-in';
  w.fillStyle = '#ffffff';
  w.fillRect(0, 0, white.width, white.height);
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
    ctx.drawImage(white, pad + Math.cos(a) * radius, pad + Math.sin(a) * radius);
  }
  ctx.drawImage(src, pad, pad);
  return out;
}

function toDataUrl(canvas) {
  // Safari can't encode WebP and quietly returns a PNG instead — either is fine.
  return canvas.toDataURL('image/webp', 0.86);
}

/**
 * Build a creature from the drawing.
 * @param {HTMLCanvasElement} strokes  the child's drawing (covers VIEWBOX)
 * @param {object|null} template       TEMPLATES entry, or null for free drawing
 * @param {string} baseColor           bucket fill colour for templates
 * @param {Array}  accessories         [{ canvas, x, y, size, place }] in paper units, stuck on top
 * @returns {{ src, aspect, eyes, kind?, motion?, birth?, flame? } | null}
 */
export function buildSprite(strokes, template, baseColor, accessories = []) {
  const S = SPRITE_SIZE;
  const unit = S / VIEWBOX.size;
  const sheet = document.createElement('canvas');
  sheet.width = S;
  sheet.height = S;
  const ctx = sheet.getContext('2d');
  const toPx = (u, o) => (u - o) * unit;
  const dressUp = () => {
    ctx.save();
    ctx.setTransform(unit, 0, 0, unit, -VIEWBOX.x * unit, -VIEWBOX.y * unit);
    accessories.forEach(a => ctx.drawImage(a.canvas, a.x - a.size / 2, a.y - a.size / 2, a.size, a.size));
    ctx.restore();
  };
  const glasses = accessories.filter(a => a.place === 'eyes');
  // Sunglasses cover the eyes, so those eyes don't blink on top of them
  const uncovered = e => !glasses.some(a => Math.abs(e.x - a.x) < a.size * 0.45 && Math.abs(e.y - a.y) < a.size * 0.3);

  if (template) {
    const parts = template.parts.map(d => new Path2D(d));
    ctx.setTransform(unit, 0, 0, unit, -VIEWBOX.x * unit, -VIEWBOX.y * unit);
    ctx.fillStyle = baseColor;
    parts.forEach(p => ctx.fill(p));

    // Child's colouring, kept inside the body
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = 'source-atop';
    ctx.drawImage(waxy(strokes), 0, 0, S, S);
    ctx.restore();

    // Interior lines, kept inside the body
    const lines = document.createElement('canvas');
    lines.width = S;
    lines.height = S;
    const lc = lines.getContext('2d');
    lc.setTransform(ctx.getTransform());
    lc.strokeStyle = OUTLINE;
    lc.lineCap = 'round';
    lc.lineJoin = 'round';
    lc.lineWidth = 3.5;
    template.details.forEach(d => lc.stroke(new Path2D(d)));
    lc.globalCompositeOperation = 'destination-in';
    parts.forEach(p => lc.fill(p));
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 0.85;
    ctx.drawImage(lines, 0, 0);
    ctx.restore();
    drawOutline(ctx, parts, 5);
    dressUp();

    const box = contentBounds(sheet);
    const { canvas, offX, offY, scale } = cropTo(sheet, box, 4, 240);
    const eyes = template.eyes.filter(uncovered).map(e => ({
      x: ((toPx(e.x, VIEWBOX.x) - offX) * scale) / canvas.width,
      y: ((toPx(e.y, VIEWBOX.y) - offY) * scale) / canvas.height,
      r: (e.r * unit * scale) / canvas.width,
    }));
    return {
      src: toDataUrl(canvas),
      aspect: canvas.width / canvas.height,
      eyes,
      kind: template.id,
      motion: template.motion,
      birth: template.birth,
      flame: !!template.flame,
    };
  }

  ctx.drawImage(waxy(strokes), 0, 0, S, S);
  const body = contentBounds(sheet); // the drawing alone, before any hat goes on
  if (!body) return null;
  dressUp();
  const crop = cropTo(sheet, contentBounds(sheet), 2, 220);
  const BORDER = 7;
  const pad = Math.ceil(BORDER) + 2; // stickerBorder's padding
  const canvas = stickerBorder(crop.canvas, BORDER);
  const w = canvas.width, h = canvas.height;
  // Googly eyes near the top of the drawing, towards the front (creatures face right)
  const bw = body.w * crop.scale, bh = body.h * crop.scale;
  const rPx = Math.min(0.11 * bw, 0.09 * Math.min(bw, bh));
  const exPx = (body.x - crop.offX) * crop.scale + pad + bw * 0.62;
  const eyPx = (body.y - crop.offY) * crop.scale + pad + bh * Math.min(0.32, 0.18 + 0.1 * (bw / bh));
  return {
    src: toDataUrl(canvas),
    aspect: w / h,
    eyes: glasses.length ? [] : [
      { x: exPx / w, y: eyPx / h, r: rPx / w },
      { x: (exPx + rPx * 2.3) / w, y: eyPx / h, r: rPx / w },
    ],
  };
}

/* ── Saved creatures, one list per world ── */

const key = worldId => `aw-draw-alive:${worldId}`;

export function loadCreatures(worldId) {
  try {
    const list = JSON.parse(localStorage.getItem(key(worldId)) || '[]');
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

/**
 * Save a world's creatures. If storage is tight, recorded voices go first,
 * then the oldest creatures. The newest creature always stays on screen,
 * even if it can't be remembered.
 */
export function saveCreatures(worldId, list) {
  let keep = list.slice(-MAX_PER_WORLD);
  for (;;) {
    try {
      localStorage.setItem(key(worldId), JSON.stringify(keep));
      return keep;
    } catch {
      const i = keep.findIndex(c => c.voice);
      if (i !== -1) {
        keep = keep.map((c, j) => (j === i ? { ...c, voice: undefined } : c));
      } else if (keep.length > 1) {
        keep = keep.slice(1);
      } else {
        return list.slice(-MAX_PER_WORLD);
      }
    }
  }
}

export { MAX_PER_WORLD };
