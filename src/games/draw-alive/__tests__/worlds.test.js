/**
 * Consistency checks for the Draw Alive world and template data.
 */
import { describe, it, expect } from 'vitest';
import { TEMPLATES, WORLDS, VIEWBOX, SCENE_SIZE, getWorld } from '../worlds';
import { REVEAL } from '../Birth.jsx';

const MOTIONS = ['swim', 'float', 'fly', 'rocket', 'hover', 'flutter', 'walk'];
const FALLS = ['drop', 'sink', 'float'];
const BIRTHS = Object.keys(REVEAL);
const PATH_CHARS = /^[MLCQAZmlcqaz0-9 .,-]+$/;

const templateEntries = Object.entries(TEMPLATES);

describe('shared constants', () => {
  it('SCENE_SIZE is a positive width and height', () => {
    expect(SCENE_SIZE.w).toBeGreaterThan(0);
    expect(SCENE_SIZE.h).toBeGreaterThan(0);
  });

  it('VIEWBOX contains the 200-unit template box', () => {
    expect(VIEWBOX.x).toBeLessThanOrEqual(0);
    expect(VIEWBOX.y).toBeLessThanOrEqual(0);
    expect(VIEWBOX.x + VIEWBOX.size).toBeGreaterThanOrEqual(200);
    expect(VIEWBOX.y + VIEWBOX.size).toBeGreaterThanOrEqual(200);
  });

  it('REVEAL (from Birth.jsx) lists the birth types', () => {
    expect(BIRTHS.length).toBeGreaterThan(0);
  });
});

describe('WORLDS', () => {
  it('has unique ids', () => {
    const ids = WORLDS.map(w => w.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  describe.each(WORLDS.map(w => [w.id, w]))('world "%s"', (id, world) => {
    it('has the required fields', () => {
      expect(typeof world.id).toBe('string');
      expect(world.id.length).toBeGreaterThan(0);
      expect(typeof world.bg).toBe('string');
      expect(world.bg.length).toBeGreaterThan(0);
      expect(MOTIONS).toContain(world.freeMotion);
      expect(world.freeBirth).toBeTruthy();
    });

    it('only references templates that exist', () => {
      expect(Array.isArray(world.templates)).toBe(true);
      expect(world.templates.length).toBeGreaterThan(0);
      for (const t of world.templates) expect(TEMPLATES).toHaveProperty(t);
    });

    it('has a freeBirth that is a known birth type', () => {
      expect(BIRTHS).toContain(world.freeBirth);
    });

    it('has valid food', () => {
      const { food } = world;
      expect(food).toBeTruthy();
      expect(Array.isArray(food.items)).toBe(true);
      expect(food.items.length).toBeGreaterThan(0);
      for (const item of food.items) {
        expect(typeof item).toBe('string');
        expect(item.length).toBeGreaterThan(0);
      }
      expect(FALLS).toContain(food.fall);
      expect(Number.isInteger(food.count)).toBe(true);
      expect(food.count).toBeGreaterThanOrEqual(1);
    });

    it('has zones that are [lo, hi] fractions with 0 ≤ lo < hi ≤ 1', () => {
      expect(world.zones).toBeTruthy();
      const zones = Object.entries(world.zones);
      expect(zones.length).toBeGreaterThan(0);
      for (const [name, zone] of zones) {
        expect(MOTIONS, `zone "${name}"`).toContain(name);
        expect(zone).toHaveLength(2);
        const [lo, hi] = zone;
        expect(lo).toBeGreaterThanOrEqual(0);
        expect(hi).toBeLessThanOrEqual(1);
        expect(lo).toBeLessThan(hi);
      }
    });

    it('has a zone usable for its freeMotion (or a walk/fly fallback)', () => {
      const zone = world.zones[world.freeMotion] || world.zones.walk || world.zones.fly;
      expect(zone).toBeDefined();
    });

    it('has perches inside the scene (when present)', () => {
      if (!world.perches) return;
      expect(Array.isArray(world.perches)).toBe(true);
      for (const p of world.perches) {
        expect(p).toHaveLength(2);
        const [x, y] = p;
        expect(x).toBeGreaterThanOrEqual(0);
        expect(x).toBeLessThanOrEqual(SCENE_SIZE.w);
        expect(y).toBeGreaterThanOrEqual(0);
        expect(y).toBeLessThanOrEqual(SCENE_SIZE.h);
      }
    });
  });
});

describe('TEMPLATES', () => {
  it('has unique ids', () => {
    const ids = Object.values(TEMPLATES).map(t => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every template is used by at least one world', () => {
    const used = new Set(WORLDS.flatMap(w => w.templates));
    for (const key of Object.keys(TEMPLATES)) expect(used, key).toContain(key);
  });

  describe.each(templateEntries)('template "%s"', (key, t) => {
    it('has an id equal to its key', () => {
      expect(t.id).toBe(key);
    });

    it('has a known motion and birth', () => {
      expect(MOTIONS).toContain(t.motion);
      expect(BIRTHS).toContain(t.birth);
    });

    it('has non-empty parts and a details array', () => {
      expect(Array.isArray(t.parts)).toBe(true);
      expect(t.parts.length).toBeGreaterThan(0);
      expect(Array.isArray(t.details)).toBe(true);
    });

    it('has only well-formed SVG path strings', () => {
      for (const d of [...t.parts, ...t.details]) {
        expect(typeof d).toBe('string');
        expect(d, d).toMatch(PATH_CHARS);
        expect(d.trimStart().startsWith('M'), d).toBe(true);
        expect(d, 'no NaN/undefined from helpers').not.toMatch(/NaN|undefined|Infinity/);
      }
    });

    it('has 1–3 eyes inside the 200-unit box', () => {
      expect(Array.isArray(t.eyes)).toBe(true);
      expect(t.eyes.length).toBeGreaterThanOrEqual(1);
      expect(t.eyes.length).toBeLessThanOrEqual(3);
      for (const eye of t.eyes) {
        expect(eye.x).toBeGreaterThanOrEqual(0);
        expect(eye.x).toBeLessThanOrEqual(200);
        expect(eye.y).toBeGreaterThanOrEqual(0);
        expect(eye.y).toBeLessThanOrEqual(200);
        expect(eye.r).toBeGreaterThan(0);
      }
    });
  });
});

describe('getWorld', () => {
  it('returns the sea world for "sea"', () => {
    const sea = getWorld('sea');
    expect(sea).toBeDefined();
    expect(sea.id).toBe('sea');
    expect(sea).toBe(WORLDS.find(w => w.id === 'sea'));
  });

  it('finds every world by id', () => {
    for (const w of WORLDS) expect(getWorld(w.id)).toBe(w);
  });

  it('returns undefined for an unknown id', () => {
    expect(getWorld('nope')).toBeUndefined();
  });
});
