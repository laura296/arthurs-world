/**
 * Arthur Bear — the app mascot.
 * Uses generated gouache-style character images.
 *
 * Props:
 *   expression: 'happy' | 'excited' | 'sleepy' | 'curious'
 *   size: number (width in px, default 120)
 *   className: additional CSS classes
 *   mode: 'full' (head + body) | 'face' (head only, default)
 */

const BASE = '/arthurs-world/assets/characters/arthur-bear';

const FACE_IMAGES = {
  happy:   `${BASE}/happy-face.png`,
  excited: `${BASE}/excited-face.png`,
  sleepy:  `${BASE}/sleepy-face.png`,
  curious: `${BASE}/curious-face.png`,
};

const FULL_IMAGES = {
  happy:   `${BASE}/happy-full.png`,
  excited: `${BASE}/excited-full.png`,
  // Fallback to excited-full for states without a full-body variant
  sleepy:  `${BASE}/excited-full.png`,
  curious: `${BASE}/excited-full.png`,
};

export default function ArthurBear({ expression = 'happy', size = 120, className = '', mode = 'face' }) {
  const src = mode === 'full'
    ? (FULL_IMAGES[expression] || FULL_IMAGES.happy)
    : (FACE_IMAGES[expression] || FACE_IMAGES.happy);

  const height = mode === 'full' ? size * 1.4 : size;

  return (
    <img
      src={src}
      alt="Arthur Bear"
      width={size}
      height={height}
      className={`select-none pointer-events-none ${className}`}
      style={{ objectFit: 'contain' }}
      draggable={false}
    />
  );
}
