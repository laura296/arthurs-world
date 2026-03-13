import { useState, useCallback } from 'react';

/**
 * Lightweight particle emitter.
 * Emits SVG shapes from a point, animated via CSS.
 *
 * Usage:
 *   const { burst, ParticleLayer } = useParticleBurst();
 *   burst(x, y, { colors, shapes, count });
 *   return <><ParticleLayer /><rest of UI /></>;
 *
 * Physics options (all opt-in, backwards compatible):
 *   gravity: true      — particles arc downward (particleFlyGravity)
 *   spin: true         — particles rotate during flight (particleFlySpin)
 *   sizeDecay: 'pulse' — scale up then shrink (particleFlyPulse)
 *   opacityCurve: 'late' — stay visible 60% then fade (particleFlyLate)
 *
 * Combine: { gravity: true, spin: true } picks the first matching variant.
 */

const SHAPE_PATHS = {
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14 2 9.27l6.91-1.01z',
  circle: null,
  heart: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z',
  diamond: 'M12 2L22 12L12 22L2 12z',
};

/** Pick a CSS keyframe name based on physics options */
function pickAnimation({ gravity, spin, sizeDecay, opacityCurve }) {
  if (gravity && spin) return 'particleFlyGravity';
  if (gravity) return 'particleFlyGravity';
  if (spin) return 'particleFlySpin';
  if (sizeDecay === 'pulse') return 'particleFlyPulse';
  if (opacityCurve === 'late') return 'particleFlyLate';
  return 'particleFly';
}

let burstIdCounter = 0;

export function useParticleBurst() {
  const [bursts, setBursts] = useState([]);

  const burst = useCallback((xOrOpts, y, options = {}) => {
    let x;
    if (typeof xOrOpts === 'object' && xOrOpts !== null) {
      ({ x, y, ...options } = xOrOpts);
    } else {
      x = xOrOpts;
    }
    const {
      count = 10,
      colors = ['#facc15', '#38bdf8', '#ec4899'],
      shapes = ['star', 'circle'],
      spread = 80,
      duration = 600,
      gravity = false,
      spin = false,
      sizeDecay,
      opacityCurve,
    } = options;

    const animName = pickAnimation({ gravity, spin, sizeDecay, opacityCurve });
    const id = ++burstIdCounter;
    const particles = Array.from({ length: count }, (_, i) => {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const dist = spread * (0.5 + Math.random() * 0.5);
      return {
        id: `${id}-${i}`,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        tx: Math.cos(angle) * dist,
        ty: Math.sin(angle) * dist,
        size: 8 + Math.random() * 10,
        rotation: Math.random() * 360,
        delay: Math.random() * 100,
      };
    });

    setBursts(prev => [...prev, { id, x, y, particles, duration, animName }]);

    setTimeout(() => {
      setBursts(prev => prev.filter(b => b.id !== id));
    }, duration + 200);
  }, []);

  const ParticleLayer = useCallback(() => (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      {bursts.map(b => (
        <div key={b.id} className="absolute" style={{ left: b.x, top: b.y }}>
          {b.particles.map(p => (
            <div
              key={p.id}
              className="absolute"
              style={{
                animation: `${b.animName} ${b.duration}ms ease-out ${p.delay}ms forwards`,
                '--particle-tx': `${p.tx}px`,
                '--particle-ty': `${p.ty}px`,
              }}
            >
              {p.shape === 'circle' ? (
                <svg width={p.size} height={p.size} viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" fill={p.color} />
                </svg>
              ) : (
                <svg width={p.size} height={p.size} viewBox="0 0 24 24" style={{ transform: `rotate(${p.rotation}deg)` }}>
                  <path d={SHAPE_PATHS[p.shape]} fill={p.color} />
                </svg>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  ), [bursts]);

  return { burst, ParticleLayer };
}
