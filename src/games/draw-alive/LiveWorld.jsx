import { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import RoundBack from './RoundBack';
import Birth, { REVEAL } from './Birth';
import CreatureArt from './CreatureArt';
import { OUTLINE } from './sprite';
import { SCENE_SIZE } from './worlds';
import { playVoice } from './voice';
import {
  playBoing, playSplash, playPop, playChomp, playCelebrate, playThud, playNote, playSparkle,
} from '../../hooks/useSound';

const SPEED = { swim: 62, float: 28, fly: 125, rocket: 170, hover: 55, flutter: 85, walk: 44 };
const SEEKERS = new Set(['float', 'fly', 'rocket', 'hover', 'flutter']);
const POP_TIME = 0.45;
const JUMP_TIME = 0.75;
const CHOMP_TIME = 0.6;
const STOMP_TIME = 0.9;
const MAX_FOOD = 14;
const FOOD_LIFE = 30;
const FLAKES = ['#f59e0b', '#ef4444', '#fde047', '#fb923c'];

const rand = (a, b) => a + Math.random() * (b - a);
const pick = list => list[Math.floor(Math.random() * list.length)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const easeOutBack = p => 1 + 2.7 * Math.pow(p - 1, 3) + 1.7 * Math.pow(p - 1, 2);

function zoneFor(world, motion) {
  return world.zones[motion] || world.zones.walk || world.zones.fly || [0.3, 0.8];
}

function groundZone(world) {
  return world.zones.walk || [0.84, 0.92];
}

/** Display box for a creature on a stage of this size. */
function boxFor(c, W, H) {
  const base = Math.min(W, H) * 0.23;
  const w = c.aspect >= 1 ? base * 1.15 : base * 1.15 * c.aspect;
  return { w, h: w / c.aspect };
}

/** Where a birth happens: on the ground, mid-water, mid-sky or hanging from above. */
function birthSpot(type, world, W, H, box) {
  const x = rand(0.32, 0.62) * W;
  if (type === 'bubble') return { x, y: 0.58 * H, rise: 0.9 * H - 0.58 * H };
  if (type === 'portal') return { x, y: 0.4 * H };
  if (type === 'cocoon') return { x, y: 0.34 * H };
  const [g0, g1] = groundZone(world);
  return { x, y: ((g0 + g1) / 2) * H - box.h * 0.2 };
}

/** Map a point on the painted background to the stage (the image is object-cover). */
function sceneToStage(px, py, W, H) {
  const k = Math.max(W / SCENE_SIZE.w, H / SCENE_SIZE.h);
  return [(W - SCENE_SIZE.w * k) / 2 + px * k, (H - SCENE_SIZE.h * k) / 2 + py * k];
}

function newTarget(st, W, H) {
  st.tx = rand(0.1, 0.9) * W;
  st.ty = rand(st.z0, st.z1) * H;
}

function spawn(creature, world, W, H, at) {
  const motion = creature.motion || world.freeMotion;
  const [z0, z1] = zoneFor(world, motion);
  const st = {
    motion, z0, z1,
    x: at ? at.x : rand(0.15, 0.85) * W,
    y: at ? at.y : rand(z0, z1) * H,
    vx: 0, vy: 0,
    dir: Math.random() < 0.5 ? -1 : 1,
    lane: rand(z0, z1),
    phase: rand(0, 10),
    speed: SPEED[motion] * rand(0.8, 1.2),
    pauseUntil: 0,
    birth: at ? { t: 0, reveal: at.reveal } : null,
    jump: -1,
    chomp: -1,
    chasing: false,
    loveUntil: 0,
    stomp: -1,
    perch: null,
    perched: false,
    sleeping: false,
    nextPerch: performance.now() / 1000 + rand(4, 9),
    nextBubble: performance.now() / 1000 + rand(1, 4),
    nextStomp: performance.now() / 1000 + rand(4, 9),
  };
  newTarget(st, W, H);
  return st;
}

/** Steer towards a piece of food. */
function chase(st, f, H, box) {
  st.chasing = true;
  st.pauseUntil = 0;
  if (SEEKERS.has(st.motion)) {
    st.tx = f.x;
    st.ty = f.y;
  } else {
    if (Math.abs(f.x - st.x) > 8) st.dir = f.x > st.x ? 1 : -1;
    st.lane = st.motion === 'walk'
      ? clamp((f.y - box.h * 0.3) / H, st.z0, st.z1)
      : clamp(f.y / H, 0.3, 0.9);
  }
}

/** One frame of behaviour. Returns what the renderer needs. */
function step(st, t, dt, W, H, margin) {
  const ph = st.phase;
  let yOff = 0, angle = 0, scale = 1, inner = '';

  if (st.birth) {
    st.birth.t += dt;
    const since = st.birth.t - st.birth.reveal;
    if (since < 0) return { hidden: true };
    const p = Math.min(1, since / POP_TIME);
    scale = 0.2 + 0.8 * easeOutBack(p);
    yOff = -Math.sin(p * Math.PI) * 40;
    if (p >= 1) st.birth = null;
    return { yOff, angle, scale, inner, glow: true };
  }

  const m = st.motion;
  const boost = st.chasing ? 1.35 : st.sleeping && !st.perch ? 0.15 : 1;

  if (m === 'swim' || m === 'walk') {
    const walking = m === 'walk';
    const paused = t < st.pauseUntil || (walking && (st.sleeping || st.stomp >= 0));
    if (!paused) st.x += st.dir * st.speed * boost * dt;
    if ((st.x < margin && st.dir < 0) || (st.x > W - margin && st.dir > 0)) {
      st.dir *= -1;
      if (!walking && !st.chasing) st.lane = rand(st.z0, st.z1);
    }
    if (!st.chasing) {
      if (walking && !paused && Math.random() < dt * 0.12) st.pauseUntil = t + rand(0.8, 2.2);
      if (!walking && Math.random() < dt * 0.15) st.lane = rand(st.z0, st.z1);
    }
    const wantY = st.lane * H + (walking ? 0 : Math.sin(t * 1.6 + ph) * 14);
    st.y += (wantY - st.y) * Math.min(1, dt * (walking ? 4 : 1.5));
    if (walking) {
      const hop = paused ? 0 : Math.abs(Math.sin(t * 6 + ph));
      const squash = paused ? 0 : Math.max(0, 1 - hop * 4);
      yOff = -hop * 10;
      scale = 0.78 + 0.34 * clamp((st.y / H - st.z0) / Math.max(0.01, st.z1 - st.z0), 0, 1);
      inner = st.sleeping
        ? `scale(1, ${1 + Math.sin(t * 1.6 + ph) * 0.03})`
        : `rotate(${paused ? 0 : Math.sin(t * 6 + ph) * 5}deg) scale(${1 + squash * 0.07}, ${1 - squash * 0.07})`;
    } else {
      inner = `rotate(${Math.sin(t * 2.4 + ph) * 5}deg) skewY(${Math.sin(t * 7 + ph) * 3}deg)`;
    }
  } else {
    // Birds settle on a perch for a while
    if (st.perch) {
      st.tx = st.perch.x;
      st.ty = st.perch.y;
      if (!st.perched && Math.hypot(st.tx - st.x, st.ty - st.y) < 20) st.perched = true;
      if (st.perched) {
        if (t > st.perch.until) {
          st.perch = null;
          st.perched = false;
          st.nextPerch = t + rand(8, 14);
          newTarget(st, W, H);
        } else {
          st.x = st.tx;
          st.y = st.ty;
          st.vx = st.vy = 0;
          return { yOff: 0, angle: 0, scale: 1, inner: `scaleY(${1 + Math.sin(t * 2 + ph) * 0.025})` };
        }
      }
    }

    // Seekers wander between random targets
    const dx = st.tx - st.x, dy = st.ty - st.y;
    const d = Math.hypot(dx, dy) || 1;
    const paused = t < st.pauseUntil;
    if (d < 30 && !paused && !st.chasing && !st.perch) {
      if (m === 'hover' || m === 'float') st.pauseUntil = t + rand(0.6, 2);
      newTarget(st, W, H);
    }
    // Ease in when landing on a perch, so birds settle instead of circling
    const sp = (paused ? 0 : st.speed * boost) * (st.perch ? Math.min(1, 0.25 + d / 90) : 1);
    const k = Math.min(1, dt * (m === 'flutter' ? 3 : m === 'rocket' ? 1.4 : 2));
    st.vx += ((dx / d) * sp - st.vx) * k;
    st.vy += ((dy / d) * sp - st.vy) * k;
    st.x += st.vx * dt;
    st.y += st.vy * dt;
    if (Math.abs(st.vx) > 12 && m !== 'flutter' && m !== 'float' && m !== 'rocket') {
      st.dir = st.vx > 0 ? 1 : -1;
    }

    if (m === 'rocket') {
      angle = (Math.atan2(st.vy, st.vx) * 180) / Math.PI + 90;
      if (Math.hypot(st.vx, st.vy) < 20) angle = Math.sin(t * 2 + ph) * 6;
      inner = `translateX(${Math.sin(t * 30) * 1.2}px)`;
    } else if (m === 'hover') {
      yOff = Math.sin(t * 2.4 + ph) * 9;
      inner = `rotate(${Math.sin(t * 2 + ph) * 7}deg)`;
    } else if (m === 'flutter') {
      yOff = Math.sin(t * 3 + ph) * 14;
      inner = st.sleeping
        ? `scaleX(${0.85 + 0.15 * Math.abs(Math.cos(t * 1.5 + ph))})`
        : `scaleX(${0.3 + 0.7 * Math.abs(Math.cos(t * 13 + ph))})`;
    } else if (m === 'float') {
      const pulse = Math.sin(t * 2.6 + ph);
      yOff = pulse * 6;
      inner = `scale(${1 + pulse * 0.06}, ${1 - pulse * 0.08})`;
    } else {
      yOff = Math.sin(t * 2.2 + ph) * 8;
      inner = `rotate(${clamp(st.vy * 0.1, -16, 16) * st.dir}deg) scaleY(${1 + Math.sin(t * 11 + ph) * 0.05})`;
    }
  }

  // Tapped: happy jump (and a twirl for anything that flies or swims)
  if (st.jump >= 0) {
    st.jump += dt;
    const p = Math.min(1, st.jump / JUMP_TIME);
    yOff -= Math.sin(p * Math.PI) * 80;
    if (SEEKERS.has(m) || m === 'swim') angle += p * 360;
    scale *= 1 + Math.sin(p * Math.PI) * 0.15;
    if (p >= 1) st.jump = -1;
  }

  // Dinosaur stomp: rear up, then slam down
  let stomped = false;
  if (st.stomp >= 0) {
    st.stomp += dt;
    const p = Math.min(1, st.stomp / STOMP_TIME);
    if (p < 0.45) {
      const q = p / 0.45;
      yOff -= Math.sin(q * Math.PI / 2) * 34;
      angle -= q * 12 * st.dir;
    } else if (p < 0.55) {
      const q = (p - 0.45) / 0.1;
      yOff -= (1 - q) * 34;
      angle -= (1 - q) * 12 * st.dir;
      if (q >= 0.6 && !st.stompLanded) { st.stompLanded = true; stomped = true; }
    } else {
      inner += ` scale(${1 + (1 - p) * 0.15}, ${1 - (1 - p) * 0.15})`;
    }
    if (p >= 1) { st.stomp = -1; st.stompLanded = false; }
  }

  // Munching
  if (st.chomp >= 0) {
    st.chomp += dt;
    const p = Math.min(1, st.chomp / CHOMP_TIME);
    const s = Math.sin(p * Math.PI * 6) * 0.12 * (1 - p);
    inner += ` scale(${1 + s}, ${1 - s})`;
    if (p >= 1) st.chomp = -1;
  }

  st.x = clamp(st.x, 0, W);
  st.y = clamp(st.y, 0, H);
  return { yOff, angle, scale, inner, walking: m === 'walk', stomped };
}

/* ── Ambient life on top of the painting ── */
function Ambient({ kind }) {
  const bits = useMemo(() => Array.from({ length: kind === 'twinkles' ? 26 : 16 }, () => ({
    left: rand(2, 98),
    top: rand(4, 92),
    size: kind === 'bubbles' ? rand(8, 22) : kind === 'twinkles' ? rand(3, 7) : rand(4, 9),
    delay: -rand(0, 12),
    duration: kind === 'bubbles' ? rand(7, 13) : rand(3, 8),
  })), [kind]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {bits.map((b, i) => {
        if (kind === 'bubbles') {
          return (
            <div key={i} className="absolute rounded-full border-2 border-white/60"
              style={{
                left: `${b.left}%`, bottom: -30, width: b.size, height: b.size,
                background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(255,255,255,0.08) 60%)',
                animation: `drawAliveBubble ${b.duration}s linear ${b.delay}s infinite`,
              }} />
          );
        }
        const glow = kind === 'twinkles' ? '#fff7d6' : '#ffe9a8';
        return (
          <div key={i} className="absolute rounded-full"
            style={{
              left: `${b.left}%`, top: `${b.top}%`, width: b.size, height: b.size,
              background: glow, boxShadow: `0 0 ${b.size * 2}px ${b.size / 2}px ${glow}`,
              animation: kind === 'twinkles'
                ? `drawAliveTwinkle ${b.duration}s ease-in-out ${b.delay}s infinite`
                : `drawAliveMote ${b.duration * 2}s ease-in-out ${b.delay}s infinite`,
            }} />
        );
      })}
    </div>
  );
}

/* ── One creature: a ground shadow, an outer box moved by the engine, an inner box that wiggles ── */
function Creature({ creature, register, onTap }) {
  return (
    <>
      <div ref={el => register(creature.id, 'shadow', el)}
           className="absolute left-0 top-0 rounded-[50%] pointer-events-none will-change-transform"
           style={{ background: 'radial-gradient(ellipse, rgba(76, 29, 149, 0.32) 0%, rgba(76, 29, 149, 0) 70%)', opacity: 0 }} />
      <div
        ref={el => register(creature.id, 'box', el)}
        className="absolute left-0 top-0 will-change-transform"
        style={{ touchAction: 'none', opacity: 0 }}
        onPointerDown={(e) => { e.stopPropagation(); onTap(creature.id, e); }}
      >
        <div className="relative w-full h-full will-change-transform"
             style={{ filter: 'drop-shadow(0 10px 10px rgba(76, 29, 149, 0.3))' }}>
          <CreatureArt creature={creature} />
        </div>
      </div>
      <div ref={el => register(creature.id, 'zzz', el)} className="da-zzz absolute left-0 top-0 pointer-events-none">
        {[0, 1, 2].map(i => (
          <span key={i} className="absolute font-heading text-white"
                style={{ fontSize: 22 + i * 8, left: i * 16, animationDelay: `${i * 0.7}s` }}>z</span>
        ))}
      </div>
    </>
  );
}

/* ── Food dropped in by a tap ── */
function Food({ food, register }) {
  return (
    <div ref={el => register(food.id, el)}
         className="absolute left-0 top-0 pointer-events-none select-none flex items-center justify-center will-change-transform"
         style={{ fontSize: 'clamp(30px, 5.2vmin, 54px)', lineHeight: 1, transition: 'opacity 0.25s' }}>
      {food.item === 'flake' ? (
        <div className="rounded-[3px]" style={{ width: 13, height: 8, background: food.color, border: `1.5px solid ${OUTLINE}` }} />
      ) : (
        <span style={{ filter: 'drop-shadow(0 4px 4px rgba(76, 29, 149, 0.3))' }}>{food.item}</span>
      )}
    </div>
  );
}

/**
 * A painted world where the child's drawings live, move and eat.
 *
 * Props:
 *   world      — WORLDS entry
 *   creatures  — saved creatures for this world
 *   newcomerId — id of the creature that has just been drawn (plays its birth)
 *   onBorn     — called when the newcomer appears
 *   onDraw     — open the drawing paper
 *   onBack     — back to the world picker
 *   burst      — particle burst from useParticleBurst
 */
export default function LiveWorld({ world, creatures, newcomerId, onBorn, onDraw, onBack, burst }) {
  const stageRef = useRef(null);
  const els = useRef(new Map());
  const states = useRef(new Map());
  const foodEls = useRef(new Map());
  const foodState = useRef(new Map());
  const listRef = useRef(creatures);
  const newcomerRef = useRef(newcomerId);
  const fxRef = useRef(null);
  const [foods, setFoods] = useState([]);
  const [birth, setBirth] = useState(null);
  const [night, setNight] = useState(false);
  const nightRef = useRef(false);
  listRef.current = creatures;
  nightRef.current = night;

  const register = useCallback((id, part, el) => {
    const entry = els.current.get(id) || {};
    entry[part] = el;
    if (entry.box || entry.shadow || entry.zzz) els.current.set(id, entry);
    else els.current.delete(id);
  }, []);

  const registerFood = useCallback((id, el) => {
    if (el) foodEls.current.set(id, el);
    else foodEls.current.delete(id);
  }, []);

  const removeFood = useCallback((id) => {
    foodState.current.delete(id);
    setFoods(prev => prev.filter(f => f.id !== id));
  }, []);

  const toClient = (x, y) => {
    const rect = stageRef.current?.getBoundingClientRect();
    return rect ? [rect.left + x, rect.top + y] : [x, y];
  };

  /* A newly drawn creature is born: egg, bubble, portal, cocoon, flower or puddle */
  useEffect(() => {
    newcomerRef.current = newcomerId;
    const c = creatures.find(cr => cr.id === newcomerId);
    const stage = stageRef.current;
    if (!c || !stage || states.current.has(c.id)) return;
    const W = stage.clientWidth, H = stage.clientHeight;
    const box = boxFor(c, W, H);
    const type = c.birth || world.freeBirth;
    const spot = birthSpot(type, world, W, H, box);
    states.current.set(c.id, spawn(c, world, W, H, { ...spot, reveal: REVEAL[type] }));
    setBirth({ id: c.id, type, ...spot, size: Math.max(box.w, box.h), src: c.src });

    const timer = setTimeout(() => {
      const [cx, cy] = toClient(spot.x, spot.y);
      playCelebrate();
      if (c.voice) setTimeout(() => playVoice(c.voice), 450);
      burst(cx, cy, {
        count: 22, spread: 160, colors: ['#facc15', '#ffffff', world.tint, '#ec4899', '#38bdf8'],
        shapes: ['star', 'heart', 'circle', 'diamond'], spin: true,
      });
      onBorn?.();
    }, REVEAL[type] * 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newcomerId]);

  /* The animation loop */
  useEffect(() => {
    let raf;
    let last = performance.now();
    let nextLove = 0;
    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = now / 1000;
      const stage = stageRef.current;
      if (stage) {
        const W = stage.clientWidth, H = stage.clientHeight;

        // Food falls, sinks or floats
        for (const f of foodState.current.values()) {
          const el = foodEls.current.get(f.id);
          if (f.eaten) continue;
          if (t - f.born > FOOD_LIFE) {
            f.eaten = true;
            if (el) el.style.opacity = '0';
            setTimeout(() => removeFood(f.id), 300);
            continue;
          }
          let bob = 0;
          if (f.fall === 'drop' && !f.landed) {
            f.vy += 1400 * dt;
            f.y += f.vy * dt;
            if (f.y >= f.landY) {
              f.y = f.landY;
              if (f.vy > 260) f.vy = -f.vy * 0.35; else { f.vy = 0; f.landed = true; }
            }
          } else if (f.fall === 'sink' && f.y < f.landY) {
            f.y = Math.min(f.landY, f.y + 38 * dt);
            f.x += Math.sin(t * 2.4 + f.ph) * 14 * dt;
          } else if (f.fall === 'float') {
            bob = Math.sin(t * 2.2 + f.ph) * 6;
          }
          if (el) {
            el.style.zIndex = Math.round(f.y) - 30;
            el.style.transform = `translate3d(${f.x}px, ${f.y + bob}px, 0) translate(-50%, -50%) rotate(${Math.sin(t * 2 + f.ph) * 8}deg)`;
          }
        }
        const sleeping = nightRef.current;
        const menu = sleeping ? [] : [...foodState.current.values()].filter(f => !f.eaten);

        for (const c of listRef.current) {
          const parts = els.current.get(c.id);
          if (!parts?.box) continue;
          let st = states.current.get(c.id);
          if (!st) {
            if (c.id === newcomerRef.current) continue; // its birth sets it up
            st = spawn(c, world, W, H, null);
            states.current.set(c.id, st);
          }
          const box = boxFor(c, W, H);
          const { w, h } = box;
          st.sleeping = sleeping;

          // Hungry? Head for the nearest food
          let meal = null;
          st.chasing = false;
          if (!st.birth && st.jump < 0 && menu.length) {
            let best = Infinity;
            for (const f of menu) {
              const d = Math.hypot(f.x - st.x, f.y - st.y);
              if (d < best) { best = d; meal = f; }
            }
            if (meal) chase(st, meal, H, box);
          }

          // Birds perch now and then, and roost at night
          if (st.motion === 'fly' && world.perches && !st.birth) {
            if (st.chasing && st.perch) { st.perch = null; st.perched = false; }
            if (!st.perch && !st.chasing && (sleeping || t > st.nextPerch)) {
              const [px, py] = sceneToStage(...pick(world.perches), W, H);
              st.perch = { x: px, y: py - h * 0.38, until: sleeping ? Infinity : t + rand(3, 6) };
            }
            if (st.perch && !sleeping && st.perch.until === Infinity) st.perch.until = t;
          }

          // Dinosaurs stomp every so often
          if (c.kind === 'dino' && !sleeping && !st.birth && !st.chasing && st.stomp < 0 && t > st.nextStomp) {
            st.stomp = 0;
            st.nextStomp = t + rand(7, 13);
          }

          const r = step(st, t, dt, W, H, w * 0.4);
          if (st.motion === 'walk') st.y = Math.min(st.y, H - h * 0.62); // keep tall walkers' feet on screen
          const el = parts.box;
          if (r.hidden) {
            el.style.opacity = '0';
            if (parts.shadow) parts.shadow.style.opacity = '0';
            continue;
          }

          // Close enough to eat?
          if (meal && !meal.eaten) {
            const dx = Math.abs(meal.x - st.x), dy = Math.abs(meal.y - st.y);
            const reach = st.motion === 'walk' ? dx < w * 0.42 && dy < h * 0.9 : Math.hypot(dx, dy) < Math.max(w, h) * 0.4;
            if (reach) {
              meal.eaten = true;
              st.chomp = 0;
              st.chasing = false;
              if (SEEKERS.has(st.motion)) newTarget(st, W, H);
              const fel = foodEls.current.get(meal.id);
              if (fel) fel.style.opacity = '0';
              setTimeout(() => removeFood(meal.id), 300);
              playChomp();
              const [cx, cy] = toClient(meal.x, meal.y);
              burst(cx, cy, { count: 6, spread: 50, colors: ['#ec4899', '#f472b6', '#fde047'], shapes: ['heart'] });
            }
          }

          const flip = st.motion === 'rocket' || st.motion === 'flutter' || st.motion === 'float' ? 1 : st.dir;
          el.style.opacity = '1';
          el.style.width = `${w}px`;
          el.style.height = `${h}px`;
          el.style.zIndex = r.glow ? 950 : Math.round(st.y);
          el.style.transform =
            `translate3d(${st.x - w / 2}px, ${st.y - h / 2 + r.yOff}px, 0) rotate(${r.angle}deg) scale(${r.scale * flip}, ${r.scale})`;
          el.style.filter = r.glow ? 'drop-shadow(0 0 24px rgba(253, 224, 71, 0.9))' : '';
          el.firstChild.style.transform = r.inner;

          const sh = parts.shadow;
          if (sh) {
            if (r.walking) {
              const sw = w * 0.75 * r.scale;
              sh.style.opacity = '1';
              sh.style.width = `${sw}px`;
              sh.style.height = `${sw * 0.22}px`;
              sh.style.zIndex = Math.round(st.y) - 1;
              sh.style.transform =
                `translate3d(${st.x - sw / 2}px, ${st.y + h * 0.4 * r.scale}px, 0) scale(${1 + r.yOff / 90})`;
            } else {
              sh.style.opacity = '0';
            }
          }

          if (parts.zzz) {
            parts.zzz.style.zIndex = Math.round(st.y) + 1;
            parts.zzz.style.transform = `translate3d(${st.x + w * 0.2}px, ${st.y - h * 0.75}px, 0)`;
          }

          // Fish blow bubbles
          if (st.motion === 'swim' && t > st.nextBubble) {
            st.nextBubble = t + rand(3, 7);
            blowBubbles(st.x + st.dir * w * 0.48, st.y - h * 0.08);
          }

          // Stomp lands: the ground shakes
          if (r.stomped) {
            playThud();
            const stageEl = stageRef.current;
            stageEl.classList.remove('da-shake');
            void stageEl.offsetWidth;
            stageEl.classList.add('da-shake');
            const [cx, cy] = toClient(st.x, st.y + h * 0.45);
            burst(cx, cy, { count: 8, spread: 70, colors: ['#a16207', '#d6a76c', '#fde68a'], shapes: ['circle'] });
          }
        }

        // Friends say hello when they meet
        if (t > nextLove) {
          nextLove = t + 0.6;
          const live = (sleeping ? [] : listRef.current)
            .map(c => ({ c, st: states.current.get(c.id) }))
            .filter(({ st }) => st && !st.birth);
          for (let i = 0; i < live.length; i++) {
            for (let j = i + 1; j < live.length; j++) {
              const a = live[i].st, b = live[j].st;
              if (t < a.loveUntil || t < b.loveUntil) continue;
              const reach = (boxFor(live[i].c, W, H).w + boxFor(live[j].c, W, H).w) * 0.3;
              if (Math.hypot(a.x - b.x, a.y - b.y) < reach) {
                a.loveUntil = b.loveUntil = t + 9;
                const [cx, cy] = toClient((a.x + b.x) / 2, Math.min(a.y, b.y) - 30);
                burst(cx, cy, { count: 3, spread: 40, colors: ['#f472b6', '#ec4899'], shapes: ['heart'] });
              }
            }
          }
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [world, burst, removeFood]);

  const blowBubbles = (x, y) => {
    const layer = fxRef.current;
    if (!layer) return;
    for (let i = 0; i < 3; i++) {
      const b = document.createElement('div');
      const d = 12 + i * 6;
      b.className = 'da-fish-bubble';
      Object.assign(b.style, { left: `${x}px`, top: `${y}px`, width: `${d}px`, height: `${d}px`, animationDelay: `${i * 0.2}s` });
      b.addEventListener('animationend', () => b.remove());
      layer.appendChild(b);
    }
  };

  const toggleNight = () => {
    const toNight = !night;
    setNight(toNight);
    const notes = toNight ? [523, 440, 349] : [349, 440, 523];
    notes.forEach((f, i) => setTimeout(() => playNote(f, 0.5), i * 220));
    if (!toNight) setTimeout(playSparkle, 700);
  };

  const tapCreature = (id, e) => {
    const st = states.current.get(id);
    if (!st || st.birth) return;
    st.jump = 0;
    const c = listRef.current.find(cr => cr.id === id);
    if (c?.voice) playVoice(c.voice); else playBoing();
    burst(e.clientX, e.clientY, {
      count: 10, spread: 70, colors: ['#facc15', '#fff', world.tint, '#ec4899'], shapes: ['star', 'heart', 'circle'],
    });
  };

  /* Tap the world to drop in some food */
  const tapWorld = (e) => {
    const rect = stageRef.current.getBoundingClientRect();
    const W = rect.width, H = rect.height;
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const { items, fall, count } = world.food;
    const [g0, g1] = groundZone(world);
    const added = [];
    for (let i = 0; i < count && foodState.current.size < MAX_FOOD; i++) {
      const id = `f-${performance.now()}-${i}`;
      const item = pick(items);
      const fx = clamp(x + (count > 1 ? rand(-45, 45) : 0), 0.08 * W, 0.92 * W);
      const fy = y + (count > 1 ? rand(-20, 20) : 0);
      const landY = fall === 'float' ? fy : clamp(Math.max(fy, rand(g0, g1) * H), g0 * H, g1 * H);
      foodState.current.set(id, {
        id, fall, x: fx, y: Math.min(fy, landY), vy: 0, landY,
        ph: rand(0, 10), born: performance.now() / 1000, eaten: false, landed: false,
      });
      added.push({ id, item, color: pick(FLAKES) });
    }
    if (!added.length) return;
    setFoods(prev => [...prev, ...added]);
    if (fall === 'sink') playSplash(); else playPop();
  };

  const clearBirth = useCallback(() => setBirth(null), []);
  const empty = creatures.length === 0;

  return (
    <div className="absolute inset-0 overflow-hidden select-none">
      <div ref={stageRef} className={`absolute inset-0 isolate ${night ? 'da-night' : ''}`} onPointerDown={tapWorld}>
        <img src={world.bg} alt="" draggable={false}
             className="absolute inset-0 w-full h-full object-cover pointer-events-none"
             style={{ animation: 'drawAliveDrift 40s ease-in-out infinite alternate' }} />
        <Ambient kind={world.ambient} />

        {/* Night falls: the sky darkens, the moon and stars come out */}
        <div className="absolute inset-0 pointer-events-none transition-opacity duration-[1500ms]"
             style={{ opacity: night ? 1 : 0, zIndex: 1 }}>
          <div className="absolute inset-0"
               style={{ background: 'linear-gradient(180deg, rgba(23, 20, 74, 0.78) 0%, rgba(49, 28, 99, 0.62) 60%, rgba(30, 27, 75, 0.7) 100%)', mixBlendMode: 'multiply' }} />
          <div className="absolute rounded-full"
               style={{ left: '12%', top: '8%', width: 90, height: 90, background: '#fef9c3',
                        boxShadow: '0 0 60px 24px rgba(254, 249, 195, 0.45)' }} />
          {night && <Ambient kind="twinkles" />}
        </div>

        {foods.map(f => <Food key={f.id} food={f} register={registerFood} />)}
        {creatures.map(c => (
          <Creature key={c.id} creature={c} register={register} onTap={tapCreature} />
        ))}
        <div ref={fxRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 960 }} />
        {birth && (
          <Birth key={birth.id} type={birth.type} x={birth.x} y={birth.y} size={birth.size}
                 src={birth.src} rise={birth.rise} tint={world.tint} onDone={clearBirth} />
        )}
      </div>

      <RoundBack onBack={onBack} />

      {/* Day and night */}
      <motion.button
        onClick={toggleNight}
        aria-label={night ? 'Morning' : 'Bedtime'}
        className="absolute top-3 right-3 z-50 w-20 h-20 rounded-full bg-white/30 backdrop-blur-sm border-2 border-white/40
                   shadow-lg flex items-center justify-center text-4xl"
        whileTap={{ scale: 0.88 }}
      >
        <motion.span key={night ? 'sun' : 'moon'} initial={{ rotate: -90, scale: 0 }} animate={{ rotate: 0, scale: 1 }}>
          {night ? '☀️' : '🌙'}
        </motion.span>
      </motion.button>

      {/* Draw something new */}
      <motion.button
        onClick={onDraw}
        aria-label="Draw"
        className="absolute bottom-5 right-5 z-50 w-32 h-32 rounded-full bg-[#FFFDF7] border-[6px] border-white
                   shadow-aw-lg flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: empty ? [1, 1.12, 1] : 1 }}
        transition={empty
          ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }
          : { type: 'spring', stiffness: 300, damping: 18 }}
        whileTap={{ scale: 0.88 }}
      >
        {empty && (
          <span className="absolute inset-0 rounded-full border-4 border-aw-gold"
                style={{ animation: 'radiateRing 1.6s ease-out infinite' }} />
        )}
        <svg viewBox="0 0 64 64" className="w-20 h-20" aria-hidden="true">
          <g transform="rotate(-40 32 32)">
            <rect x="24" y="6" width="16" height="40" rx="4" fill={world.tint} stroke={OUTLINE} strokeWidth="3" />
            <rect x="24" y="14" width="16" height="6" fill="#ffffff" opacity="0.6" />
            <path d="M24 46 L32 60 L40 46 Z" fill="#fde7c4" stroke={OUTLINE} strokeWidth="3" strokeLinejoin="round" />
            <path d="M29.5 55 L32 60 L34.5 55 Z" fill={world.tint} />
          </g>
          <path d="M8 56 C 16 50, 22 60, 30 54" fill="none" stroke={world.tint} strokeWidth="4" strokeLinecap="round" />
        </svg>
      </motion.button>
    </div>
  );
}
