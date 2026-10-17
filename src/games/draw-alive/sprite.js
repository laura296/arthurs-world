/**
 * Draw Alive — turns a drawing into a creature sprite, and remembers
 * each world's creatures between visits.
 */
import { VIEWBOX } from './worlds';

export const OUTLINE = '#4a2c1a';
const SPRITE_SIZE = 360;
const MAX_PER_WORLD = 8;

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
  // Safari can't encode WebP and silently returns PNG — either is fine.
  const webp = canvas.toDataURL('image/webp', 0.86);
  return webp.startsWith('data:image/webp') ? webp : canvas.toDataURL('image/png');
}

/**
 * Build a creature from the drawing.
 * @param {HTMLCanvasElement} strokes  the child's drawing (covers VIEWBOX)
 * @param {object|null} template       TEMPLATES entry, or null for free drawing
 * @param {string} baseColor           bucket fill colour for templates
 * @returns {{ src, aspect, eyes, motion?, flame? } | null}
 */
export function buildSprite(strokes, template, baseColor) {
  const S = SPRITE_SIZE;
  const unit = S / VIEWBOX.size;
  const sheet = document.createElement('canvas');
  sheet.width = S;
  sheet.height = S;
  const ctx = sheet.getContext('2d');
  const toPx = (u, o) => (u - o) * unit;

  if (template) {
    const parts = template.parts.map(d => new Path2D(d));
    ctx.setTransform(unit, 0, 0, unit, -VIEWBOX.x * unit, -VIEWBOX.y * unit);
    ctx.fillStyle = baseColor;
    parts.forEach(p => ctx.fill(p));

    // Child's colouring, kept inside the body
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = 'source-atop';
    ctx.drawImage(strokes, 0, 0, S, S);
    ctx.restore();

    ctx.strokeStyle = OUTLINE;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 3.5;
    ctx.globalAlpha = 0.85;
    template.details.forEach(d => ctx.stroke(new Path2D(d)));
    ctx.globalAlpha = 1;
    drawOutline(ctx, parts, 5);

    const box = contentBounds(sheet);
    const { canvas, offX, offY, scale } = cropTo(sheet, box, 4, 300);
    const eyes = template.eyes.map(e => ({
      x: ((toPx(e.x, VIEWBOX.x) - offX) * scale) / canvas.width,
      y: ((toPx(e.y, VIEWBOX.y) - offY) * scale) / canvas.height,
      r: (e.r * unit * scale) / canvas.width,
    }));
    return {
      src: toDataUrl(canvas),
      aspect: canvas.width / canvas.height,
      eyes,
      motion: template.motion,
      flame: !!template.flame,
    };
  }

  ctx.drawImage(strokes, 0, 0, S, S);
  const box = contentBounds(sheet);
  if (!box) return null;
  const cropped = cropTo(sheet, box, 2, 280).canvas;
  const canvas = stickerBorder(cropped, 7);
  const w = canvas.width, h = canvas.height;
  // Googly eyes near the top, towards the front (creatures face right)
  const r = Math.min(0.11, (0.09 * Math.min(w, h)) / w);
  const ey = Math.min(0.32, 0.18 + 0.1 * (w / h));
  return {
    src: toDataUrl(canvas),
    aspect: w / h,
    eyes: [
      { x: 0.62, y: ey, r },
      { x: 0.62 + r * 2.3, y: ey, r },
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

/** Save, dropping the oldest creatures if the list is full or storage is tight. */
export function saveCreatures(worldId, list) {
  let keep = list.slice(-MAX_PER_WORLD);
  while (keep.length) {
    try {
      localStorage.setItem(key(worldId), JSON.stringify(keep));
      return keep;
    } catch {
      keep = keep.slice(1);
    }
  }
  return keep;
}

export { MAX_PER_WORLD };
