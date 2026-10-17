/**
 * Tests for the magic-bucket flood fill (floodRegion) in Draw Alive.
 * Images are built synthetically as RGBA arrays, like ImageData.data.
 */
import { describe, it, expect } from 'vitest';
import { floodRegion } from '../fill';

/** A w×h RGBA image, every pixel set to [r, g, b, a]. */
function image(w, h, [r, g, b, a] = [0, 0, 0, 0]) {
  const data = new Uint8ClampedArray(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    data[i * 4] = r;
    data[i * 4 + 1] = g;
    data[i * 4 + 2] = b;
    data[i * 4 + 3] = a;
  }
  return data;
}

function setPixel(data, w, x, y, [r, g, b, a]) {
  const i = (y * w + x) * 4;
  data[i] = r;
  data[i + 1] = g;
  data[i + 2] = b;
  data[i + 3] = a;
}

/** Walls forming the outline of the box [x0..x1] × [y0..y1] (inclusive). */
function ringWalls(w, h, x0, y0, x1, y1) {
  const walls = new Uint8Array(w * h);
  for (let x = x0; x <= x1; x++) {
    walls[y0 * w + x] = 1;
    walls[y1 * w + x] = 1;
  }
  for (let y = y0; y <= y1; y++) {
    walls[y * w + x0] = 1;
    walls[y * w + x1] = 1;
  }
  return walls;
}

function maskCount(mask) {
  let n = 0;
  for (let i = 0; i < mask.length; i++) n += mask[i];
  return n;
}

describe('floodRegion', () => {
  describe('empty canvas', () => {
    it('fills everything on a transparent 20×20 canvas with no walls', () => {
      const r = floodRegion(image(20, 20), null, 20, 20, 7, 11);
      expect(r).not.toBeNull();
      expect(r.count).toBe(400);
      expect(r.touchesEdge).toBe(true);
      expect(r).toMatchObject({ minX: 0, minY: 0, maxX: 19, maxY: 19 });
      expect(r.mask).toBeInstanceOf(Uint8Array);
      expect(r.mask.length).toBe(400);
      expect(maskCount(r.mask)).toBe(400);
    });

    it('works from a corner start pixel', () => {
      const r = floodRegion(image(20, 20), null, 20, 20, 19, 19);
      expect(r.count).toBe(400);
    });

    it('accepts an all-zero walls array the same as null', () => {
      const r = floodRegion(image(20, 20), new Uint8Array(400), 20, 20, 3, 3);
      expect(r.count).toBe(400);
    });
  });

  describe('walls', () => {
    // A 10×10 wall ring at x,y 5..14: 36 wall pixels, 8×8 = 64 inside, 300 outside.
    const W = 20, H = 20;
    const walls = ringWalls(W, H, 5, 5, 14, 14);

    it('tapping inside the ring fills only the inside', () => {
      const r = floodRegion(image(W, H), walls, W, H, 9, 9);
      expect(r.count).toBe(64);
      expect(r).toMatchObject({ minX: 6, minY: 6, maxX: 13, maxY: 13 });
      expect(r.touchesEdge).toBe(false);
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const inside = x >= 6 && x <= 13 && y >= 6 && y <= 13;
          expect(r.mask[y * W + x]).toBe(inside ? 1 : 0);
        }
      }
    });

    it('tapping outside the ring fills only the outside', () => {
      const r = floodRegion(image(W, H), walls, W, H, 1, 1);
      expect(r.count).toBe(300);
      expect(r.touchesEdge).toBe(true);
      expect(r).toMatchObject({ minX: 0, minY: 0, maxX: 19, maxY: 19 });
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const inBox = x >= 5 && x <= 14 && y >= 5 && y <= 14;
          expect(r.mask[y * W + x]).toBe(inBox ? 0 : 1);
        }
      }
    });

    it('never paints a wall pixel', () => {
      const r = floodRegion(image(W, H), walls, W, H, 0, 0);
      for (let i = 0; i < walls.length; i++) {
        if (walls[i]) expect(r.mask[i]).toBe(0);
      }
    });

    it('returns null when tapping on a wall', () => {
      expect(floodRegion(image(W, H), walls, W, H, 5, 5)).toBeNull();
      expect(floodRegion(image(W, H), walls, W, H, 10, 14)).toBeNull();
    });

    it('is 4-connected: a diagonal wall line blocks the fill', () => {
      const w = new Uint8Array(W * H);
      for (let x = 0; x < W; x++) w[(H - 1 - x) * W + x] = 1; // x + y = 19
      const r = floodRegion(image(W, H), w, W, H, 0, 0);
      // Pixels with x + y < 19: 1 + 2 + … + 19
      expect(r.count).toBe(190);
      expect(r.mask[(H - 1) * W + (W - 1)]).toBe(0);
    });
  });

  describe('colour similarity', () => {
    const W = 20, H = 20;
    const RED = [255, 0, 0, 255];
    const BLUE = [0, 0, 255, 255];

    function halves(left, right) {
      const data = image(W, H);
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) setPixel(data, W, x, y, x < 10 ? left : right);
      }
      return data;
    }

    it('tapping the red half fills only the red half', () => {
      const r = floodRegion(halves(RED, BLUE), null, W, H, 3, 8);
      expect(r.count).toBe(200);
      expect(r).toMatchObject({ minX: 0, maxX: 9, minY: 0, maxY: 19 });
    });

    it('tapping the blue half fills only the blue half', () => {
      const r = floodRegion(halves(RED, BLUE), null, W, H, 15, 8);
      expect(r.count).toBe(200);
      expect(r).toMatchObject({ minX: 10, maxX: 19 });
    });

    it('merges similar colours within the tolerance and splits them below it', () => {
      // Each channel differs by 30: squared distance 2700, default limit 46² × 3 = 6348.
      const data = halves([200, 100, 50, 255], [230, 130, 80, 255]);
      expect(floodRegion(data, null, W, H, 2, 2).count).toBe(400);
      expect(floodRegion(data, null, W, H, 2, 2, 20).count).toBe(200);
    });

    it('a single stray dot of a different colour is left out', () => {
      const data = image(W, H, [255, 255, 255, 255]);
      setPixel(data, W, 10, 10, [0, 0, 0, 255]);
      const r = floodRegion(data, null, W, H, 0, 0);
      expect(r.count).toBe(399);
      expect(r.mask[10 * W + 10]).toBe(0);
    });
  });

  describe('transparency (composited over white paper)', () => {
    const W = 20, H = 20;

    it('a fully transparent pixel behaves like white, whatever its RGB', () => {
      // Left: transparent black (0,0,0,0). Right: opaque white.
      const data = image(W, H, [0, 0, 0, 0]);
      for (let y = 0; y < H; y++) {
        for (let x = 10; x < W; x++) setPixel(data, W, x, y, [255, 255, 255, 255]);
      }
      expect(floodRegion(data, null, W, H, 2, 2).count).toBe(400);
      expect(floodRegion(data, null, W, H, 17, 2).count).toBe(400);
    });

    it('transparent paper is separated from opaque black ink', () => {
      const data = image(W, H, [0, 0, 0, 0]);
      for (let y = 0; y < H; y++) setPixel(data, W, 10, y, [0, 0, 0, 255]);
      const r = floodRegion(data, null, W, H, 2, 2);
      expect(r.count).toBe(200);
      expect(r.maxX).toBe(9);
    });

    it('half-transparent red matches the opaque pink it composites to', () => {
      // (255, 0, 0) at alpha 128/255 over white ≈ (255, 127, 127)
      const data = image(W, H, [255, 0, 0, 128]);
      for (let y = 0; y < H; y++) {
        for (let x = 10; x < W; x++) setPixel(data, W, x, y, [255, 127, 127, 255]);
      }
      expect(floodRegion(data, null, W, H, 2, 2, 5).count).toBe(400);
    });

    it('half-transparent black (mid grey) is separate from paper', () => {
      const data = image(W, H, [0, 0, 0, 0]);
      for (let y = 0; y < H; y++) {
        for (let x = 10; x < W; x++) setPixel(data, W, x, y, [0, 0, 0, 128]);
      }
      expect(floodRegion(data, null, W, H, 2, 2).count).toBe(200);
      expect(floodRegion(data, null, W, H, 15, 2).count).toBe(200);
    });
  });

  describe('performance', () => {
    it('fills a 600×600 open area quickly', () => {
      const W = 600, H = 600;
      const data = image(W, H);
      const t0 = performance.now();
      const r = floodRegion(data, null, W, H, 300, 300);
      const ms = performance.now() - t0;
      expect(r.count).toBe(W * H);
      expect(ms).toBeLessThan(500);
    });

    it('fills a 600×600 serpentine maze completely', () => {
      // Wall columns at every odd x, each with a one-pixel gap alternating
      // between the bottom and top row, so the open area is one long snake.
      const W = 600, H = 600;
      const walls = new Uint8Array(W * H);
      let wallPixels = 0;
      for (let x = 1; x < W - 1; x += 2) {
        const gap = ((x - 1) / 2) % 2 === 0 ? H - 1 : 0;
        for (let y = 0; y < H; y++) {
          if (y === gap) continue;
          walls[y * W + x] = 1;
          wallPixels++;
        }
      }
      const t0 = performance.now();
      const r = floodRegion(image(W, H), walls, W, H, 0, 0);
      const ms = performance.now() - t0;
      expect(r.count).toBe(W * H - wallPixels);
      expect(ms).toBeLessThan(1500);
    });
  });
});
