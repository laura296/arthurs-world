import AnimalSprite from './AnimalSprite';

/**
 * A single burrow hole. Contains the animal sprite with overflow:hidden
 * so the animal is hidden below ground until it rises.
 * The dirt rim SVG sits ON TOP of the animal (z-index) to create the
 * illusion of emerging from the ground.
 *
 * @param {object} critter - { id, type, visible, tapped } or null
 * @param {number} riseSpeed - ms
 * @param {function} onTap - fn(critterId)
 */
export default function GameHole({ critter, riseSpeed, onTap }) {
  return (
    <div className="relative w-[5.5rem] h-[6.5rem] sm:w-28 sm:h-32 md:w-32 md:h-36">
      {/* Animal container — clipped to hole area */}
      <div className="absolute inset-x-0 bottom-2 h-3/4 overflow-hidden rounded-b-full">
        {critter && (
          <AnimalSprite
            type={critter.type}
            visible={critter.visible}
            riseSpeed={riseSpeed}
            tapped={critter.tapped}
            onTap={(e) => onTap(critter.id, e)}
          />
        )}
      </div>

      {/* Dirt rim — sits on top of the animal */}
      <svg viewBox="0 0 100 30" className="absolute bottom-0 inset-x-0 w-full pointer-events-none z-10">
        {/* Hole opening */}
        <ellipse cx="50" cy="18" rx="45" ry="12" fill="#3D2817" />
        {/* Dirt rim */}
        <ellipse cx="50" cy="15" rx="48" ry="10" fill="#6B5242" />
        <ellipse cx="50" cy="14" rx="46" ry="8" fill="#7A6352" />
        {/* Grass tufts on rim */}
        <path d="M8,14 Q10,6 12,14" fill="#3d9b3d" />
        <path d="M12,14 Q15,4 18,14" fill="#4ab84a" />
        <path d="M82,14 Q85,4 88,14" fill="#3d9b3d" />
        <path d="M86,14 Q89,6 92,14" fill="#4ab84a" />
        {/* Extra grass tufts for richer look */}
        <path d="M25,13 Q27,6 29,13" fill="#3d9b3d" opacity="0.7" />
        <path d="M70,13 Q73,5 76,13" fill="#4ab84a" opacity="0.7" />
      </svg>
    </div>
  );
}
