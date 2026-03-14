import Mole from './animals/Mole';
import Hedgehog from './animals/Hedgehog';
import Rabbit from './animals/Rabbit';
import Mouse from './animals/Mouse';
import Fox from './animals/Fox';
import Owl from './animals/Owl';

const ANIMALS = { mole: Mole, hedgehog: Hedgehog, rabbit: Rabbit, mouse: Mouse, fox: Fox, owl: Owl };

/**
 * Renders the correct animal SVG with rise/sink animation.
 * @param {string} type - animal key ('mole', 'hedgehog', etc.)
 * @param {boolean} visible - whether the animal is currently up
 * @param {number} riseSpeed - transition duration in ms
 * @param {function} onTap - called when animal is tapped
 * @param {boolean} tapped - whether this animal was just tapped (triggers squish)
 */
export default function AnimalSprite({ type, visible, riseSpeed = 400, onTap, tapped }) {
  const Animal = ANIMALS[type];
  if (!Animal) return null;

  return (
    <div
      className="absolute inset-0 flex items-end justify-center pointer-events-none"
      style={{
        transform: visible ? 'translateY(0%)' : 'translateY(100%)',
        transition: `transform ${riseSpeed}ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
      }}
    >
      <button
        onClick={(e) => onTap(e)}
        disabled={!visible}
        className={`pointer-events-auto active:scale-90 transition-transform w-full h-full ${
          tapped ? 'animate-pop' : ''
        }`}
      >
        <Animal className="w-full h-full" />
      </button>
    </div>
  );
}
