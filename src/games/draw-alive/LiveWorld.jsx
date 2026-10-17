import { useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import RoundBack from './RoundBack';
import { OUTLINE } from './sprite';
import { playBoing, playSplash, playSparkle } from '../../hooks/useSound';

const SPEED = { swim: 62, float: 28, fly: 125, rocket: 170, hover: 55, flutter: 85, walk: 44 };
const SEEKERS = new Set(['float', 'fly', 'rocket', 'hover', 'flutter']);
const ENTER_TIME = 1.2;
const JUMP_TIME = 0.75;

const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const easeOutBack = p => 1 + 2.7 * Math.pow(p - 1, 3) + 1.7 * Math.pow(p - 1, 2);

function zoneFor(world, motion) {
  return world.zones[motion] || world.zones.walk || world.zones.fly || [0.3, 0.8];
}

function newTarget(st, W, H) {
  st.tx = rand(0.1, 0.9) * W;
  st.ty = rand(st.z0, st.z1) * H;
}

function spawn(creature, world, W, H, entering) {
  const motion = creature.motion || world.freeMotion;
  const [z0, z1] = zoneFor(world, motion);
  const st = {
    motion, z0, z1,
    x: entering ? W / 2 : rand(0.15, 0.85) * W,
    y: entering ? H / 2 : rand(z0, z1) * H,
    vx: 0, vy: 0,
    dir: Math.random() < 0.5 ? -1 : 1,
    lane: rand(z0, z1),
    phase: rand(0, 10),
    speed: SPEED[motion] * rand(0.8, 1.2),
    pauseUntil: 0,
    enter: entering ? 0 : -1,
    jump: -1,
  };
  newTarget(st, W, H);
  return st;
}

/** One frame of behaviour. Returns { yOff, angle, scale, inner } for rendering. */
function step(st, t, dt, W, H, margin) {
  const ph = st.phase;
  let yOff = 0, angle = 0, scale = 1, inner = '';

  if (st.enter >= 0) {
    st.enter += dt;
    const p = Math.min(1, st.enter / ENTER_TIME);
    const e = easeOutBack(p);
    scale = 2.6 - 1.6 * e;
    angle = (1 - p) * Math.sin(p * 18) * 14;
    if (p >= 1) st.enter = -1;
    return { yOff, angle, scale, inner, entering: true };
  }

  const m = st.motion;

  if (m === 'swim' || m === 'walk') {
    const walking = m === 'walk';
    const paused = t < st.pauseUntil;
    if (!paused) st.x += st.dir * st.speed * dt;
    if ((st.x < margin && st.dir < 0) || (st.x > W - margin && st.dir > 0)) {
      st.dir *= -1;
      if (!walking) st.lane = rand(st.z0, st.z1);
    }
    if (walking && !paused && Math.random() < dt * 0.12) st.pauseUntil = t + rand(0.8, 2.2);
    if (!walking && Math.random() < dt * 0.15) st.lane = rand(st.z0, st.z1);
    const wantY = st.lane * H + (walking ? 0 : Math.sin(t * 1.6 + ph) * 14);
    st.y += (wantY - st.y) * Math.min(1, dt * (walking ? 4 : 1.5));
    if (walking) {
      const hop = paused ? 0 : Math.abs(Math.sin(t * 6 + ph));
      yOff = -hop * 10;
      scale = 0.78 + 0.34 * clamp((st.y / H - st.z0) / Math.max(0.01, st.z1 - st.z0), 0, 1);
      inner = `rotate(${paused ? 0 : Math.sin(t * 6 + ph) * 5}deg)`;
    } else {
      inner = `rotate(${Math.sin(t * 2.4 + ph) * 5}deg) skewY(${Math.sin(t * 7 + ph) * 3}deg)`;
    }
  } else {
    // Seekers wander between random targets
    const dx = st.tx - st.x, dy = st.ty - st.y;
    const d = Math.hypot(dx, dy) || 1;
    const paused = t < st.pauseUntil;
    if (d < 30 && !paused) {
      if (m === 'hover' || m === 'float') st.pauseUntil = t + rand(0.6, 2);
      newTarget(st, W, H);
    }
    const sp = paused ? 0 : st.speed;
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
      inner = `scaleX(${0.3 + 0.7 * Math.abs(Math.cos(t * 13 + ph))})`;
    } else if (m === 'float') {
      const pulse = Math.sin(t * 2.6 + ph);
      yOff = pulse * 6;
      inner = `scale(${1 + pulse * 0.06}, ${1 - pulse * 0.08})`;
    } else {
      yOff = Math.sin(t * 2.2 + ph) * 8;
      inner = `rotate(${clamp(st.vy * 0.1, -16, 16) * st.dir}deg) scaleY(${1 + Math.sin(t * 11 + ph) * 0.05})`;
    }
  }

  // Tapped: happy jump (and a twirl for anything that flies)
  if (st.jump >= 0) {
    st.jump += dt;
    const p = Math.min(1, st.jump / JUMP_TIME);
    yOff -= Math.sin(p * Math.PI) * 80;
    if (SEEKERS.has(m) || m === 'swim') angle += p * 360;
    scale *= 1 + Math.sin(p * Math.PI) * 0.15;
    if (p >= 1) st.jump = -1;
  }

  st.x = clamp(st.x, 0, W);
  st.y = clamp(st.y, 0, H);
  return { yOff, angle, scale, inner };
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

/* ── One creature: outer box is moved by the engine, inner box wiggles ── */
function Creature({ creature, register, onTap }) {
  return (
    <div
      ref={el => register(creature.id, el)}
      className="absolute left-0 top-0 will-change-transform"
      style={{ touchAction: 'none' }}
      onPointerDown={(e) => { e.stopPropagation(); onTap(creature.id, e); }}
    >
      <div data-inner className="relative w-full h-full will-change-transform"
           style={{ filter: 'drop-shadow(0 10px 10px rgba(76, 29, 149, 0.3))' }}>
        {creature.flame && (
          <div className="absolute left-1/2 top-[88%] w-[26%] h-[34%] -translate-x-1/2 origin-top"
               style={{
                 borderRadius: '50% 50% 50% 50% / 30% 30% 70% 70%',
                 background: 'radial-gradient(ellipse at 50% 20%, #fffbe6 0%, #fde047 35%, #f97316 70%, rgba(239,68,68,0) 100%)',
                 animation: 'drawAliveFlame 0.18s ease-in-out infinite alternate',
               }} />
        )}
        <img src={creature.src} alt="" draggable={false} className="relative w-full h-full pointer-events-none" />
        {creature.eyes.map((e, i) => (
          <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2"
               style={{ left: `${e.x * 100}%`, top: `${e.y * 100}%`, width: `${e.r * 200}%`, aspectRatio: '1' }}>
            <div className="absolute inset-0 rounded-full bg-white overflow-hidden"
                 style={{
                   border: `2px solid ${OUTLINE}`,
                   animation: `drawAliveBlink 5s ease-in-out ${-((creature.born || 0) % 5000) / 1000 - i * 0.05}s infinite`,
                 }}>
              <div className="absolute rounded-full"
                   style={{ width: '56%', height: '56%', left: '30%', top: '28%', background: '#1e1b2e' }} />
              <div className="absolute rounded-full bg-white" style={{ width: '20%', height: '20%', left: '38%', top: '30%' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * A painted world where the child's drawings live and move.
 *
 * Props:
 *   world      — WORLDS entry
 *   creatures  — saved creatures for this world
 *   newcomerId — id of the creature that has just arrived (plays its entrance)
 *   onDraw     — open the drawing paper
 *   onBack     — back to the world picker
 *   burst      — particle burst from useParticleBurst
 */
export default function LiveWorld({ world, creatures, newcomerId, onDraw, onBack, burst }) {
  const stageRef = useRef(null);
  const els = useRef(new Map());
  const states = useRef(new Map());
  const listRef = useRef(creatures);
  listRef.current = creatures;

  const register = (id, el) => {
    if (el) els.current.set(id, el);
    else els.current.delete(id);
  };

  useEffect(() => {
    let raf;
    let last = performance.now();
    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = now / 1000;
      const stage = stageRef.current;
      if (stage) {
        const W = stage.clientWidth, H = stage.clientHeight;
        const base = Math.min(W, H) * 0.23;
        for (const c of listRef.current) {
          const el = els.current.get(c.id);
          if (!el) continue;
          let st = states.current.get(c.id);
          if (!st) {
            st = spawn(c, world, W, H, c.id === newcomerId);
            states.current.set(c.id, st);
          }
          const w = c.aspect >= 1 ? base * 1.15 : base * 1.15 * c.aspect;
          const h = w / c.aspect;
          const r = step(st, t, dt, W, H, w * 0.4);
          const flip = st.motion === 'rocket' || st.motion === 'flutter' || st.motion === 'float' ? 1 : st.dir;
          el.style.width = `${w}px`;
          el.style.height = `${h}px`;
          el.style.zIndex = r.entering ? 40 : Math.round(st.y);
          el.style.transform =
            `translate3d(${st.x - w / 2}px, ${st.y - h / 2 + r.yOff}px, 0) rotate(${r.angle}deg) scale(${r.scale * flip}, ${r.scale})`;
          el.style.filter = r.entering ? 'drop-shadow(0 0 24px rgba(253, 224, 71, 0.9))' : '';
          el.firstChild.style.transform = r.inner;
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [world, newcomerId]);

  const tapCreature = (id, e) => {
    const st = states.current.get(id);
    if (!st || st.enter >= 0) return;
    st.jump = 0;
    playBoing();
    burst(e.clientX, e.clientY, {
      count: 10, spread: 70, colors: ['#facc15', '#fff', world.tint, '#ec4899'], shapes: ['star', 'heart', 'circle'],
    });
  };

  const tapWorld = (e) => {
    const rect = stageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    for (const st of states.current.values()) {
      if (SEEKERS.has(st.motion)) {
        st.tx = x + rand(-60, 60);
        st.ty = clamp(y, st.z0 * rect.height, st.z1 * rect.height);
        st.pauseUntil = 0;
      } else {
        st.dir = x > st.x ? 1 : -1;
        st.pauseUntil = 0;
      }
    }
    if (world.ambient === 'bubbles') playSplash(); else playSparkle();
    burst(e.clientX, e.clientY, world.ambient === 'bubbles'
      ? { count: 8, spread: 50, colors: ['#ffffff', '#bae6fd'], shapes: ['circle'] }
      : { count: 8, spread: 50, colors: ['#fde68a', '#ffffff', world.tint], shapes: ['star', 'circle'] });
  };

  const empty = creatures.length === 0;

  return (
    <div className="absolute inset-0 overflow-hidden select-none">
      <div ref={stageRef} className="absolute inset-0 isolate" onPointerDown={tapWorld}>
        <img src={world.bg} alt="" draggable={false}
             className="absolute inset-0 w-full h-full object-cover pointer-events-none"
             style={{ animation: 'drawAliveDrift 40s ease-in-out infinite alternate' }} />
        <Ambient kind={world.ambient} />
        {creatures.map(c => (
          <Creature key={c.id} creature={c} register={register} onTap={tapCreature} />
        ))}
      </div>

      <RoundBack onBack={onBack} />

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
