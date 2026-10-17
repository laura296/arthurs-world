import { OUTLINE } from './sprite';

/**
 * A creature's picture: the coloured sprite, rocket flame, and blinking
 * eyes (which close at night via the `da-eye` class).
 *
 * Props:
 *   creature — saved creature ({ src, eyes, flame?, born })
 */
export default function CreatureArt({ creature }) {
  return (
    <>
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
          <div className="da-eye absolute inset-0 rounded-full bg-white overflow-hidden"
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
    </>
  );
}
