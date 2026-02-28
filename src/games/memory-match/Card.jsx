import { stickerPath } from './cardData';

// CSS patterns for each theme's card back
const CARD_BACKS = {
  space: 'bg-[#0f1b3d] bg-[radial-gradient(circle,_#fff_1px,_transparent_1px)] bg-[size:12px_12px]',
  sea: 'bg-[#1565C0] bg-[repeating-linear-gradient(45deg,transparent,transparent_8px,rgba(255,255,255,0.1)_8px,rgba(255,255,255,0.1)_16px)]',
  jungle: 'bg-[#1B5E20] bg-[repeating-linear-gradient(120deg,transparent,transparent_10px,rgba(255,255,255,0.05)_10px,rgba(255,255,255,0.05)_20px)]',
  farm: 'bg-[#FFF8E1] bg-[repeating-conic-gradient(#e8d5b7_0%_25%,#FFF8E1_0%_50%)] bg-[size:20px_20px]',
  dinosaurs: 'bg-[#5D4037] bg-[radial-gradient(circle,_rgba(255,235,180,0.3)_2px,_transparent_2px)] bg-[size:16px_16px]',
  'theme-park': 'bg-[#C62828] bg-[repeating-linear-gradient(90deg,transparent,transparent_12px,rgba(255,255,255,0.2)_12px,rgba(255,255,255,0.2)_24px)]',
};

export default function Card({ card, theme, onClick, dealDelay = 0 }) {
  const { flipped, matched, isSecret, characterId } = card;
  const faceUp = flipped || matched;
  const backPattern = CARD_BACKS[theme] || CARD_BACKS.space;

  return (
    <button
      onClick={onClick}
      disabled={faceUp}
      className="animate-deal-card relative"
      style={{
        animationDelay: `${dealDelay}ms`,
        perspective: '600px',
      }}
    >
      <div
        className={`relative w-full aspect-square transition-transform duration-300 ${faceUp ? '[transform:rotateY(180deg)]' : ''}`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Card Back (face-down) */}
        <div
          className={`absolute inset-0 rounded-2xl ${backPattern} border-2 border-white/20
                      flex items-center justify-center shadow-lg`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="text-2xl opacity-40">?</span>
        </div>

        {/* Card Front (face-up) */}
        <div
          className={`absolute inset-0 rounded-2xl bg-white shadow-lg flex items-center justify-center p-2
                      ${matched ? 'ring-4 ring-sun' : ''} ${isSecret && matched ? 'ring-4 ring-amber-400' : ''}`}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <img
            src={stickerPath(theme, characterId)}
            alt={card.label}
            className={`w-full h-full object-contain ${matched ? 'animate-scene-bounce' : ''}`}
            draggable={false}
          />
          {/* Secret gold shimmer overlay */}
          {isSecret && matched && (
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-amber-300/40 to-transparent animate-gold-shimmer bg-[size:200%_100%]" />
          )}
        </div>
      </div>

      {/* Starburst on match */}
      {matched && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-sun/30 animate-starburst" />
        </div>
      )}
    </button>
  );
}
