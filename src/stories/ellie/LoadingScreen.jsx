import { useState, useEffect, useRef } from 'react';
import { generateImage, generateWithReference, hasApiKey } from '../../lib/imageGen';
import { putImage, getImage, hasAllImages, blobToUrl } from '../../lib/imageCache';
import {
  VERSION, CHARACTER_SHEET_PROMPT, SCENE_PROMPTS, GAME_BG_PROMPTS,
  ANIMAL_NAMES, ANIMAL_SPRITE_PROMPTS, FOLK_NAMES, FOLK_SPRITE_PROMPTS,
  getAllImageKeys,
} from './storyData';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);
  const [charSheetUrl, setCharSheetUrl] = useState(null);
  const running = useRef(false);

  async function generate() {
    if (running.current) return;
    running.current = true;
    setError(null);

    try {
      const allKeys = getAllImageKeys();
      setTotal(allKeys.length);

      // Check if already cached
      const cached = await hasAllImages(allKeys);
      if (cached) {
        setProgress(allKeys.length);
        onComplete();
        return;
      }

      let completed = 0;
      const update = () => { completed++; setProgress(completed); };

      // 1. Character sheet
      const csKey = `${VERSION}-character-sheet`;
      let charSheet = await getImage(csKey);
      if (!charSheet) {
        charSheet = await generateImage(CHARACTER_SHEET_PROMPT);
        await putImage(csKey, charSheet);
      }
      update();
      setCharSheetUrl(blobToUrl(charSheet));

      // 2. Scene images (with reference)
      for (let i = 0; i < SCENE_PROMPTS.length; i++) {
        const key = `${VERSION}-scene-${i + 1}`;
        const existing = await getImage(key);
        if (!existing) {
          const blob = await generateWithReference(charSheet, SCENE_PROMPTS[i]);
          await putImage(key, blob);
        }
        update();
      }

      // 3. Game backgrounds (no reference needed — no Ellie in them)
      for (let i = 0; i < GAME_BG_PROMPTS.length; i++) {
        const key = `${VERSION}-game-bg-${i + 1}`;
        const existing = await getImage(key);
        if (!existing) {
          const blob = await generateImage(GAME_BG_PROMPTS[i]);
          await putImage(key, blob);
        }
        update();
      }

      // 4. Animal sprites
      for (let i = 0; i < ANIMAL_SPRITE_PROMPTS.length; i++) {
        const key = `${VERSION}-animal-${ANIMAL_NAMES[i]}`;
        const existing = await getImage(key);
        if (!existing) {
          const blob = await generateImage(ANIMAL_SPRITE_PROMPTS[i]);
          await putImage(key, blob);
        }
        update();
      }

      // 5. Tiny Folk sprites
      for (let i = 0; i < FOLK_SPRITE_PROMPTS.length; i++) {
        const key = `${VERSION}-folk-${FOLK_NAMES[i]}`;
        const existing = await getImage(key);
        if (!existing) {
          const blob = await generateImage(FOLK_SPRITE_PROMPTS[i]);
          await putImage(key, blob);
        }
        update();
      }

      onComplete();
    } catch (e) {
      setError(e.message);
      running.current = false;
    }
  }

  useEffect(() => { generate(); }, []);

  if (!hasApiKey()) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-night gap-4 p-8">
        <span className="text-6xl">🐘</span>
        <p className="text-xl font-heading text-sun text-center">
          Ellie needs a drawing key!
        </p>
        <p className="text-sm font-body text-white/60 text-center max-w-xs">
          Set VITE_OPENAI_API_KEY in your .env.local file and restart the dev server.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-night gap-6 p-8">
      {/* Character sheet preview (once generated) */}
      {charSheetUrl && (
        <img
          src={charSheetUrl}
          alt="Ellie"
          className="w-48 h-auto rounded-2xl shadow-xl border-2 border-sun/30 animate-ellie-fade-in"
        />
      )}

      {!charSheetUrl && (
        <span className="text-7xl animate-float">🐘</span>
      )}

      <h2 className="text-2xl font-heading text-sun text-center">
        Drawing the pictures...
      </h2>

      {/* Progress bar */}
      {total > 0 && (
        <div className="w-64 max-w-full">
          <div className="h-4 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-400 to-sun rounded-full transition-all duration-500"
              style={{ width: `${(progress / total) * 100}%` }}
            />
          </div>
          <p className="text-sm font-body text-white/60 text-center mt-2">
            {progress} of {total}
          </p>
        </div>
      )}

      {/* Progress dots */}
      {total > 0 && (
        <div className="flex flex-wrap justify-center gap-1.5 max-w-xs">
          {Array.from({ length: total }, (_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i < progress ? 'bg-sun scale-100' : 'bg-white/20 scale-75'
              }`}
            />
          ))}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="text-center">
          <p className="text-lg font-body text-red-300 mb-3">
            Couldn't draw the pictures right now
          </p>
          <p className="text-sm font-body text-white/50 mb-4 max-w-xs">
            {error}
          </p>
          <button
            onClick={() => { running.current = false; generate(); }}
            className="px-6 py-3 bg-sun text-night font-heading rounded-full shadow-lg
                       active:scale-95 transition-transform"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
