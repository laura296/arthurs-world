import { useState } from 'react';
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
          className="px-4 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-xs
                     font-heading text-white/80 active:scale-95 transition-all
                     border border-white/20 shadow-lg"
        >
          🔀 New stickers
        </button>
      </div>

      {/* Tray bar */}
      <div className="bg-night/80 backdrop-blur-md border-t border-white/10 px-2 py-2.5">
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar items-center">
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
            className="flex-shrink-0 w-[76px] h-[76px] rounded-2xl
                       bg-gradient-to-br from-yellow-400 to-amber-500
                       border-2 border-sun/60 flex items-center justify-center
                       animate-pulse active:scale-90 transition-transform
                       shadow-lg shadow-amber-500/30"
          >
            <span className="text-3xl">⭐</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function StickerThumb({ sticker, scene, onSelect }) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <button
      onClick={() => { playTap(); onSelect(sticker); }}
      className="relative flex-shrink-0 w-[76px] h-[76px] rounded-2xl bg-white/10
                 border-2 border-white/20 overflow-hidden flex items-center justify-center
                 active:scale-90 transition-transform shadow-md"
    >
      {!imgFailed ? (
        <img
          src={`/arthurs-world/images/scenes/${scene}/stickers/${sticker.id}.png`}
          alt={sticker.label}
          className="w-full h-full object-contain p-1.5"
          draggable={false}
          onError={() => setImgFailed(true)}
        />
      ) : (
        <span className="text-3xl">{sticker.emoji || '🎨'}</span>
      )}
    </button>
  );
}
