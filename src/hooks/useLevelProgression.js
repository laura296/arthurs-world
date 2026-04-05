import { useState, useCallback } from 'react';

const STORAGE_KEY = 'aw-level-progress';

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch { return {}; }
}

function saveProgress(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

/**
 * useLevelProgression — persistent level/star tracking per game.
 *
 * @param {string} gameId  — unique game identifier (e.g. 'bubble-pop')
 * @param {number} totalLevels — number of levels in the game
 * @returns {{ currentLevel, stars, highestUnlocked, setLevel, completeLevel, resetProgress }}
 */
export function useLevelProgression(gameId, totalLevels) {
  const [progress, setProgress] = useState(() => {
    const all = loadProgress();
    return all[gameId] || { highestUnlocked: 1, stars: {} };
  });
  const [currentLevel, setCurrentLevel] = useState(null); // null = level select screen

  const persist = useCallback((next) => {
    const all = loadProgress();
    all[gameId] = next;
    saveProgress(all);
  }, [gameId]);

  const setLevel = useCallback((lvl) => {
    if (lvl <= progress.highestUnlocked) {
      setCurrentLevel(lvl);
    }
  }, [progress.highestUnlocked]);

  const completeLevel = useCallback((level, starsEarned) => {
    setProgress(prev => {
      const next = {
        highestUnlocked: Math.max(prev.highestUnlocked, Math.min(level + 1, totalLevels)),
        stars: {
          ...prev.stars,
          [level]: Math.max(prev.stars[level] || 0, starsEarned),
        },
      };
      persist(next);
      return next;
    });
    // Advance to the next level immediately — use the level arg directly
    // rather than reading from stale progress state
    if (level < totalLevels) {
      setCurrentLevel(level + 1);
    }
  }, [totalLevels, persist]);

  const backToLevels = useCallback(() => setCurrentLevel(null), []);

  const resetProgress = useCallback(() => {
    const fresh = { highestUnlocked: 1, stars: {} };
    setProgress(fresh);
    setCurrentLevel(null);
    persist(fresh);
  }, [persist]);

  return {
    currentLevel,
    stars: progress.stars,
    highestUnlocked: progress.highestUnlocked,
    totalLevels,
    setLevel,
    completeLevel,
    backToLevels,
    resetProgress,
  };
}
