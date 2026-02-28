import { useRef, useCallback, useState } from 'react';
import { SNAP_THRESHOLD, SCENES } from './sceneData';
import { playStickerSound } from '../../hooks/useSound';

const STICKER_SIZE = 80; // px display size
const LONG_PRESS_MS = 500;
const MOVE_THRESHOLD = 10; // px before cancelling long press

export default function SceneCanvas({
  scene,
  placedStickers,
  onStickerPlace,
  onStickerRemove,
  isAnimating,
  dragSticker,
  onDragEnd,
}) {
  const canvasRef = useRef(null);
  const [dragging, setDragging] = useState(null); // { uid, offsetX, offsetY, x, y }
  const longPressTimer = useRef(null);
  const pointerStart = useRef(null);

  const sceneData = SCENES[scene];

  // Convert pixel position to percentage
  const toPercent = useCallback((px, py) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 50, y: 50 };
    return {
      x: Math.max(5, Math.min(95, ((px - rect.left) / rect.width) * 100)),
      y: Math.max(5, Math.min(95, ((py - rect.top) / rect.height) * 100)),
    };
  }, []);

  // Magnetic snap — nudge if close to another sticker
  const applySnap = useCallback((x, y, excludeUid) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x, y };
    const pxX = (x / 100) * rect.width;
    const pxY = (y / 100) * rect.height;

    for (const placed of placedStickers) {
      if (placed.uid === excludeUid) continue;
      const otherPxX = (placed.x / 100) * rect.width;
      const otherPxY = (placed.y / 100) * rect.height;
      const dx = pxX - otherPxX;
      const dy = pxY - otherPxY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < SNAP_THRESHOLD + STICKER_SIZE) {
        // Too close — offset to avoid overlap
        if (dist < STICKER_SIZE * 0.5) {
          return {
            x: x + (20 / rect.width) * 100,
            y: y + (10 / rect.height) * 100,
          };
        }
      }
    }
    return { x, y };
  }, [placedStickers]);

  // Handle dropping a new sticker from tray onto canvas
  const handleCanvasPointerUp = useCallback((e) => {
    if (dragSticker && !dragging) {
      const pos = toPercent(e.clientX, e.clientY);
      const snapped = applySnap(pos.x, pos.y, null);
      onStickerPlace(dragSticker.id, snapped.x, snapped.y);
      onDragEnd();
    }
  }, [dragSticker, dragging, toPercent, applySnap, onStickerPlace, onDragEnd]);

  // Handle dragging a placed sticker
  const handleStickerPointerDown = useCallback((e, sticker) => {
    e.stopPropagation();
    if (isAnimating) {
      // In animate mode, tap plays sound
      const stickerDef = sceneData.stickers.find(s => s.id === sticker.stickerId);
      if (stickerDef) playStickerSound(stickerDef.sound);
      return;
    }

    pointerStart.current = { x: e.clientX, y: e.clientY };

    // Start long press timer for removal
    longPressTimer.current = setTimeout(() => {
      onStickerRemove(sticker.uid);
      longPressTimer.current = null;
    }, LONG_PRESS_MS);

    setDragging({
      uid: sticker.uid,
      x: sticker.x,
      y: sticker.y,
    });

    e.target.setPointerCapture?.(e.pointerId);
  }, [isAnimating, sceneData, onStickerRemove]);

  const handleStickerPointerMove = useCallback((e) => {
    if (!dragging) return;

    // Cancel long press if moved beyond threshold
    if (longPressTimer.current && pointerStart.current) {
      const dx = e.clientX - pointerStart.current.x;
      const dy = e.clientY - pointerStart.current.y;
      if (Math.sqrt(dx * dx + dy * dy) > MOVE_THRESHOLD) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
    }

    const pos = toPercent(e.clientX, e.clientY);
    setDragging(prev => prev ? { ...prev, x: pos.x, y: pos.y } : null);
  }, [dragging, toPercent]);

  const handleStickerPointerUp = useCallback((e) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    if (dragging) {
      const pos = toPercent(e.clientX, e.clientY);
      const snapped = applySnap(pos.x, pos.y, dragging.uid);
      onStickerPlace(dragging.uid, snapped.x, snapped.y, true); // true = reposition
      setDragging(null);
    }
  }, [dragging, toPercent, applySnap, onStickerPlace]);

  // Get animation class for a sticker in animate mode
  const getAnimClass = (stickerId) => {
    if (!isAnimating) return '';
    const def = sceneData.stickers.find(s => s.id === stickerId);
    if (!def) return 'animate-wobble';
    const type = def.animate?.type || 'wobble';
    // Map to Tailwind animation classes
    const map = {
      walk: 'animate-scene-walk',
      float: 'animate-float',
      swim: 'animate-scene-swim',
      fly: 'animate-scene-fly',
      bounce: 'animate-scene-bounce',
      wobble: 'animate-wiggle',
      spin: 'animate-spin360',
      pulse: 'animate-scene-pulse',
      scuttle: 'animate-scene-scuttle',
      flap: 'animate-scene-flap',
    };
    return map[type] || 'animate-wiggle';
  };

  return (
    <div
      ref={canvasRef}
      className="absolute inset-0 touch-none"
      onPointerUp={handleCanvasPointerUp}
    >
      {/* Scene background */}
      <img
        src={sceneData.bgImage}
        alt={sceneData.label}
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
        onError={(e) => { e.target.style.display = 'none'; }}
      />

      {/* Fallback gradient if image missing */}
      <div className={`absolute inset-0 bg-gradient-to-b ${sceneData.bg} -z-10`} />

      {/* Placed stickers */}
      {placedStickers.map((sticker) => {
        const isDragging = dragging?.uid === sticker.uid;
        const x = isDragging ? dragging.x : sticker.x;
        const y = isDragging ? dragging.y : sticker.y;

        return (
          <div
            key={sticker.uid}
            className={`absolute touch-none select-none transition-transform duration-100
                       ${isDragging ? 'scale-110 opacity-80' : ''}
                       ${getAnimClass(sticker.stickerId)}`}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: isDragging ? 9999 : sticker.zIndex,
              width: STICKER_SIZE,
              height: STICKER_SIZE,
            }}
            onPointerDown={(e) => handleStickerPointerDown(e, sticker)}
            onPointerMove={handleStickerPointerMove}
            onPointerUp={handleStickerPointerUp}
          >
            <img
              src={`/arthurs-world/images/scenes/${scene}/stickers/${sticker.stickerId}.png`}
              alt={sticker.stickerId}
              className="w-full h-full object-contain pointer-events-none rounded-xl"
              style={{ mixBlendMode: 'multiply' }}
              draggable={false}
            />
          </div>
        );
      })}

      {/* Drop indicator when dragging from tray */}
      {dragSticker && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-24 h-24 border-4 border-dashed border-sun/50 rounded-full animate-pulse" />
        </div>
      )}
    </div>
  );
}
