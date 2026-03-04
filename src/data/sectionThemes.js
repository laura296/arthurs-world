/**
 * Section theme definitions.
 * Each section has: palette, particle config, tap sound ID, and ambient config.
 */
export const SECTION_THEMES = {
  games: {
    id: 'games',
    label: 'Games',
    palette: {
      primary: '#38bdf8',
      secondary: '#22c55e',
      accent: '#facc15',
      bg: 'from-sky-400 to-blue-500',
      cardBg: 'from-sky-400/20 to-blue-500/20',
    },
    particles: { shapes: ['star', 'circle'], colors: ['#38bdf8', '#22c55e', '#facc15'] },
    tapSound: 'boing',
    ambient: 'birds',
    animationVibe: 'bouncy',
  },
  puzzles: {
    id: 'puzzles',
    label: 'Puzzles',
    palette: {
      primary: '#2dd4bf',
      secondary: '#f87171',
      accent: '#c4b5fd',
      bg: 'from-teal-400 to-cyan-600',
      cardBg: 'from-teal-400/20 to-cyan-600/20',
    },
    particles: { shapes: ['circle', 'diamond'], colors: ['#2dd4bf', '#f87171', '#c4b5fd'] },
    tapSound: 'click',
    ambient: 'wind',
    animationVibe: 'smooth',
  },
  art: {
    id: 'art',
    label: 'Art',
    palette: {
      primary: '#ec4899',
      secondary: '#f59e0b',
      accent: '#8b5cf6',
      bg: 'from-pink-400 to-rose-500',
      cardBg: 'from-pink-400/20 to-rose-500/20',
    },
    particles: { shapes: ['circle', 'heart'], colors: ['#ec4899', '#f59e0b', '#8b5cf6', '#22c55e'] },
    tapSound: 'splat',
    ambient: 'rain',
    animationVibe: 'painterly',
  },
  books: {
    id: 'books',
    label: 'Books',
    palette: {
      primary: '#f59e0b',
      secondary: '#92400e',
      accent: '#fef3c7',
      bg: 'from-amber-400 to-orange-500',
      cardBg: 'from-amber-400/20 to-orange-500/20',
    },
    particles: { shapes: ['star', 'heart'], colors: ['#f59e0b', '#fef3c7', '#fbbf24'] },
    tapSound: 'page',
    ambient: 'cozy',
    animationVibe: 'gentle',
  },
  music: {
    id: 'music',
    label: 'Music',
    palette: {
      primary: '#8b5cf6',
      secondary: '#facc15',
      accent: '#dc2626',
      bg: 'from-purple-500 to-violet-700',
      cardBg: 'from-purple-500/20 to-violet-700/20',
    },
    particles: { shapes: ['star', 'circle'], colors: ['#8b5cf6', '#facc15', '#dc2626'] },
    tapSound: 'tick',
    ambient: 'crowd',
    animationVibe: 'rhythmic',
  },
  videos: {
    id: 'videos',
    label: 'Videos',
    palette: {
      primary: '#ef4444',
      secondary: '#ffffff',
      accent: '#1e293b',
      bg: 'from-red-500 to-red-700',
      cardBg: 'from-red-500/20 to-red-700/20',
    },
    particles: { shapes: ['star'], colors: ['#ef4444', '#ffffff'] },
    tapSound: 'boing',
    ambient: null,
    animationVibe: 'bouncy',
  },
};

/** Get theme for a section, with fallback */
export function getTheme(section) {
  return SECTION_THEMES[section] || SECTION_THEMES.games;
}
