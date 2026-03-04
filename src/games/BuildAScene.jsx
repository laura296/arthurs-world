import { useState, useEffect, useCallback, useRef } from 'react';
import BackButton from '../components/BackButton';
import ScenePicker from './build-a-scene/ScenePicker';
import SceneCanvas from './build-a-scene/SceneCanvas';
import StickerTray from './build-a-scene/StickerTray';
import AnimateMode from './build-a-scene/AnimateMode';
import { SCENES, buildTray, getSurprise } from './build-a-scene/sceneData';
import { playThud, playPoof, playBoing, playSparkle } from '../hooks/useSound';
import { useArthurPeek } from '../components/ArthurPeek';
import { useParticleBurst } from '../components/ParticleBurst';

const STORAGE_KEY = 'build-a-scene-state';
let uidCounter = 0;
function uid() { return `s-${Date.now()}-${++uidCounter}`; }

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
}

export default function BuildAScene() {
  const [currentScene, setCurrentScene] = useState(null);
  const [trayStickers, setTrayStickers] = useState([]);
  const [placedStickers, setPlacedStickers] = useState([]);
  const [undoStack, setUndoStack] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [discoveredSecrets, setDiscoveredSecrets] = useState(() => {
    try {
      const raw = localStorage.getItem('build-a-scene-secrets');
      return new Set(raw ? JSON.parse(raw) : []);
    } catch { return new Set(); }
  });
  const [dragSticker, setDragSticker] = useState(null);
  const [showResume, setShowResume] = useState(false);
  const nextZ = useRef(1);
  const placedCount = useRef(0);
  const { peek, ArthurPeekLayer } = useArthurPeek();
  const { burst, ParticleLayer } = useParticleBurst();

  // Check for saved state on mount
  useEffect(() => {
    const saved = loadSaved();
    if (saved?.scene) {
      setShowResume(true);
    }
  }, []);

  // Save secrets to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('build-a-scene-secrets', JSON.stringify([...discoveredSecrets]));
    } catch { /* ignore */ }
  }, [discoveredSecrets]);

  // Auto-save before unload
  useEffect(() => {
    const handler = () => {
      if (currentScene && placedStickers.length > 0) {
        saveState({
          scene: currentScene,
          placed: placedStickers,
          nextZ: nextZ.current,
        });
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [currentScene, placedStickers]);

  const handleSelectScene = useCallback((sceneId) => {
    setCurrentScene(sceneId);
    setTrayStickers(buildTray(sceneId));
    setPlacedStickers([]);
    setUndoStack([]);
    setIsAnimating(false);
    setDragSticker(null);
    nextZ.current = 1;
    setShowResume(false);
  }, []);

  const handleResume = useCallback(() => {
    const saved = loadSaved();
    if (saved?.scene && SCENES[saved.scene]) {
      setCurrentScene(saved.scene);
      setTrayStickers(buildTray(saved.scene));
      setPlacedStickers(saved.placed || []);
      nextZ.current = saved.nextZ || (saved.placed?.length || 0) + 1;
    }
    setShowResume(false);
  }, []);

  const handleStickerPlace = useCallback((idOrUid, x, y, isReposition = false) => {
    if (isReposition) {
      // Repositioning an existing sticker
      setPlacedStickers(prev =>
        prev.map(s => s.uid === idOrUid ? { ...s, x, y } : s)
      );
    } else {
      // Placing a new sticker
      const newSticker = {
        uid: uid(),
        stickerId: idOrUid,
        x, y,
        zIndex: nextZ.current++,
      };
      setPlacedStickers(prev => [...prev, newSticker]);
      setUndoStack(prev => [...prev.slice(-4), newSticker.uid]);
      playThud();
      placedCount.current++;
      if (placedCount.current % 5 === 0) {
        peek('happy');
      }
    }
  }, [peek]);

  const handleStickerRemove = useCallback((stickerUid) => {
    setPlacedStickers(prev => prev.filter(s => s.uid !== stickerUid));
    playPoof();
  }, []);

  const handleUndo = useCallback(() => {
    setUndoStack(prev => {
      if (prev.length === 0) return prev;
      const lastUid = prev[prev.length - 1];
      setPlacedStickers(p => p.filter(s => s.uid !== lastUid));
      playPoof();
      return prev.slice(0, -1);
    });
  }, []);

  const handleStickerSelect = useCallback((sticker) => {
    // Place the sticker in the center of the canvas
    const newSticker = {
      uid: uid(),
      stickerId: sticker.id,
      x: 45 + Math.random() * 10,
      y: 35 + Math.random() * 10,
      zIndex: nextZ.current++,
    };
    setPlacedStickers(prev => [...prev, newSticker]);
    setUndoStack(prev => [...prev.slice(-4), newSticker.uid]);
    playThud();
  }, []);

  const handleSurprise = useCallback(() => {
    if (!currentScene) return null;
    const currentIds = trayStickers.map(s => s.id);
    const result = getSurprise(currentScene, currentIds, discoveredSecrets);
    if (!result) return null;

    // Add to tray (replace a random non-hero sticker)
    setTrayStickers(prev => {
      const nonHero = prev.filter(s => s.tier !== 'hero');
      if (nonHero.length === 0) return [...prev, result.sticker];
      const replaceIdx = prev.indexOf(nonHero[Math.floor(Math.random() * nonHero.length)]);
      const next = [...prev];
      next[replaceIdx] = result.sticker;
      return next;
    });

    if (result.isSecret) {
      setDiscoveredSecrets(prev => new Set([...prev, result.sticker.id]));
      playSparkle();
      peek('excited');
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      burst(cx, cy, { count: 12, spread: 70, colors: ['#facc15', '#ec4899', '#a78bfa'], shapes: ['star', 'circle'] });
    }

    return result;
  }, [currentScene, trayStickers, discoveredSecrets]);

  const handleReshuffle = useCallback(() => {
    if (!currentScene) return;
    setTrayStickers(buildTray(currentScene));
  }, [currentScene]);

  const handleBackToScenes = useCallback(() => {
    // Auto-save current scene
    if (currentScene && placedStickers.length > 0) {
      saveState({
        scene: currentScene,
        placed: placedStickers,
        nextZ: nextZ.current,
      });
    }
    playBoing();
    setCurrentScene(null);
    setIsAnimating(false);
  }, [currentScene, placedStickers]);

  // Scene picker
  if (!currentScene) {
    return (
      <div className="relative w-full h-full">
        <BackButton />
        {showResume && (
          <div className="absolute inset-0 z-50 bg-night/90 flex flex-col items-center justify-center gap-4 p-8">
            <p className="text-2xl font-heading text-sun text-center">Keep building?</p>
            <div className="flex gap-4">
              <button
                onClick={handleResume}
                className="px-8 py-4 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl
                           font-heading text-xl text-white shadow-lg active:scale-95 transition-transform"
              >
                Yes!
              </button>
              <button
                onClick={() => { setShowResume(false); localStorage.removeItem(STORAGE_KEY); }}
                className="px-8 py-4 bg-gradient-to-br from-gray-500 to-gray-700 rounded-2xl
                           font-heading text-xl text-white shadow-lg active:scale-95 transition-transform"
              >
                Start fresh
              </button>
            </div>
          </div>
        )}
        <ScenePicker onSelectScene={handleSelectScene} />
      </div>
    );
  }

  // Active scene
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Back button */}
      <button
        onClick={handleBackToScenes}
        className="absolute top-4 left-4 z-50 w-12 h-12 bg-night/60 backdrop-blur-sm
                   rounded-full flex items-center justify-center text-2xl
                   active:scale-90 transition-transform"
      >
        ◀️
      </button>

      {/* Undo button */}
      {!isAnimating && undoStack.length > 0 && (
        <button
          onClick={handleUndo}
          className="absolute top-4 right-4 z-50 w-12 h-12 bg-night/60 backdrop-blur-sm
                     rounded-full flex items-center justify-center text-2xl
                     active:scale-90 transition-transform"
        >
          ↩️
        </button>
      )}

      <SceneCanvas
        scene={currentScene}
        placedStickers={placedStickers}
        onStickerPlace={handleStickerPlace}
        onStickerRemove={handleStickerRemove}
        isAnimating={isAnimating}
        dragSticker={dragSticker}
        onDragEnd={() => setDragSticker(null)}
      />

      <StickerTray
        scene={currentScene}
        trayStickers={trayStickers}
        onStickerSelect={handleStickerSelect}
        onSurprise={handleSurprise}
        onReshuffle={handleReshuffle}
        isAnimating={isAnimating}
      />

      <AnimateMode
        isAnimating={isAnimating}
        onStartAnimate={() => setIsAnimating(true)}
        onStopAnimate={() => setIsAnimating(false)}
        placedCount={placedStickers.length}
      />

      <ArthurPeekLayer />
      <ParticleLayer />
    </div>
  );
}
