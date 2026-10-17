import { useRef, useEffect, useMemo } from 'react';
import RoundBack from './RoundBack';
import CreatureArt from './CreatureArt';
import { WORLDS } from './worlds';
import { loadCreatures } from './sprite';
import { playVoice } from './voice';
import { playCreatureSound } from './creatureSounds';
import { playXylophone } from '../../hooks/useSound';

const BG = '/arthurs-world/images/scenes/theme-park/bg.webp';
const CONFETTI = ['#f472b6', '#facc15', '#38bdf8', '#a78bfa', '#4ade80', '#fb923c'];

// "When the Saints Go Marching In", in note frequencies (0 = rest)
const C4 = 261.6, E4 = 329.6, F4 = 349.2, G4 = 392, D4 = 293.7;
const MARCH = [C4, E4, F4, G4, 0, 0, C4, E4, F4, G4, 0, 0, C4, E4, F4, G4, E4, C4, E4, D4, 0, 0];

/**
 * Every creature Arthur has drawn, from every world, marching across the
 * fairground to a tune. Tap one to hear its sound.
 *
 * Props:
 *   onBack — back to the world picker
 */
export default function Parade({ onBack }) {
  const stageRef = useRef(null);
  const els = useRef(new Map());
  const jumps = useRef(new Map());

  const marchers = useMemo(() => WORLDS.flatMap(w => loadCreatures(w.id)).sort((a, b) => a.born - b.born), []);
  const confetti = useMemo(() => Array.from({ length: 36 }, (_, i) => ({
    left: Math.random() * 100,
    delay: -Math.random() * 6,
    duration: 4 + Math.random() * 4,
    colour: CONFETTI[i % CONFETTI.length],
    w: 6 + Math.random() * 6,
  })), []);

  /* March: everyone walks left to right in a line and loops round */
  useEffect(() => {
    let raf;
    const loop = (now) => {
      const t = now / 1000;
      const stage = stageRef.current;
      if (stage) {
        const W = stage.clientWidth, H = stage.clientHeight;
        const size = Math.min(W, H) * 0.24;
        const gap = size * 1.15;
        const lane = Math.max(W + gap, marchers.length * gap);
        marchers.forEach((c, i) => {
          const el = els.current.get(c.id);
          if (!el) return;
          const w = c.aspect >= 1 ? size : size * c.aspect;
          const h = w / c.aspect;
          const x = ((t * 70 + (marchers.length - i) * gap) % lane) - gap * 0.6;
          const flying = ['fly', 'hover', 'flutter', 'rocket', 'float'].includes(c.motion);
          const groundY = H * 0.86 - h / 2;
          let y = flying ? groundY - H * 0.16 + Math.sin(t * 2.4 + i) * 12 : groundY - Math.abs(Math.sin(t * 6 + i)) * 14;
          const j = jumps.current.get(c.id);
          if (j != null) {
            const p = (t - j) / 0.7;
            if (p >= 1) jumps.current.delete(c.id); else y -= Math.sin(p * Math.PI) * 90;
          }
          const angle = c.flame ? 90 : Math.sin(t * 6 + i) * 5;
          el.style.width = `${w}px`;
          el.style.height = `${h}px`;
          el.style.transform = `translate3d(${x - w / 2}px, ${y}px, 0) rotate(${angle}deg)`;
          if (c.motion === 'flutter') el.firstChild.style.transform = `scaleX(${0.3 + 0.7 * Math.abs(Math.cos(t * 13 + i))})`;
        });
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [marchers]);

  /* The band plays */
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      const f = MARCH[i++ % MARCH.length];
      if (f) playXylophone(f * 2);
    }, 260);
    return () => clearInterval(id);
  }, []);

  const tap = (c) => {
    jumps.current.set(c.id, performance.now() / 1000);
    if (c.voice) playVoice(c.voice); else playCreatureSound(c.kind, c.motion);
  };

  return (
    <div className="absolute inset-0 overflow-hidden select-none">
      <div ref={stageRef} className="absolute inset-0 isolate">
        <img src={BG} alt="" draggable={false}
             className="absolute inset-0 w-full h-full object-cover pointer-events-none"
             style={{ animation: 'drawAliveDrift 40s ease-in-out infinite alternate' }} />
        {confetti.map((p, i) => (
          <div key={i} className="absolute top-0 pointer-events-none rounded-sm"
               style={{
                 left: `${p.left}%`, width: p.w, height: p.w * 1.6, background: p.colour,
                 animation: `drawAliveConfetti ${p.duration}s linear ${p.delay}s infinite`,
               }} />
        ))}
        {marchers.map(c => (
          <div key={c.id}
               ref={el => { if (el) els.current.set(c.id, el); else els.current.delete(c.id); }}
               className="absolute left-0 top-0 will-change-transform"
               onPointerDown={() => tap(c)}>
            <div className="relative w-full h-full" style={{ filter: 'drop-shadow(0 10px 10px rgba(76, 29, 149, 0.3))' }}>
              <CreatureArt creature={c} />
            </div>
          </div>
        ))}
      </div>
      <RoundBack onBack={onBack} />
    </div>
  );
}
