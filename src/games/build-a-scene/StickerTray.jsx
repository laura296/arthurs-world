import { playTap, playSparkle, playSuccess } from '../../hooks/useSound';

export default function StickerTray({
  scene,
  trayStickers,
  onStickerSelect,
  onSurprise,
  onReshuffle,
  isAnimating,
}) {
  return (
    <div
      className={`absolute bottom-0 inset-x-0 z-40 transition-transform duration-300
                 ${isAnimating ? 'translate-y-full' : 'translate-y-0'}`}
    >
      {/* Reshuffle button */}
      <div className="flex justify-center mb-1">
        <button
          onClick={() => { playTap(); onReshuffle(); }}
          className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs
                     font-heading text-white/70 hover:text-white transition-colors"
        >
          New stickers
        </button>
      </div>

      {/* Tray bar */}
      <div className="bg-night/80 backdrop-blur-md border-t border-white/10 px-2 py-2">
        <div className="flex gap-2 overflow-x-auto no-scrollbar items-center">
          {trayStickers.map((sticker) => (
            <StickerThumb
              key={sticker.id}
              sticker={sticker}
              scene={scene}
              onSelect={onStickerSelect}
            />
          ))}

          {/* Surprise Me button */}
          <button
            onClick={() => {
              const result = onSurprise();
              if (result?.isSecret) {
                playSuccess();
              } else {
                playSparkle();
              }
            }}
            className="flex-shrink-0 w-[70px] h-[70px] rounded-xl
                       bg-gradient-to-br from-yellow-400 to-amber-500
                       border-2 border-sun flex flex-col items-center justify-center
                       gap-0.5 animate-pulse active:scale-90 transition-transform"
          >
            <span className="text-2xl">⭐</span>
            <span className="text-[9px] font-heading text-white leading-none">Surprise!</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function StickerThumb({ sticker, scene, onSelect }) {
  return (
    <button
      onClick={() => { playTap(); onSelect(sticker); }}
      className="flex-shrink-0 w-[70px] h-[70px] rounded-xl bg-white/10
                 border-2 border-white/20 overflow-hidden flex items-center justify-center
                 active:scale-90 transition-transform"
    >
      <img
        src={`/arthurs-world/images/scenes/${scene}/stickers/${sticker.id}.png`}
        alt={sticker.label}
        className="w-full h-full object-contain p-1"
        draggable={false}
        onError={(e) => { e.target.style.display = 'none'; }}
      />
      {/* Fallback text visible when image hidden */}
      <span className="text-[10px] font-heading text-white/60 absolute">
        {sticker.label}
      </span>
    </button>
  );
}
