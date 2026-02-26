/**
 * Game registry — each game's metadata.
 * `mode`: 'quiet' | 'noisy' | 'both'
 * `path`: route segment under /games/:mode/
 */
const games = [
  { id: 'bubble-pop',    emoji: '🫧', title: 'Bubble Pop',    path: 'bubble-pop',    mode: 'noisy',  bg: 'from-sky to-blue-500' },
  { id: 'feed-animals',  emoji: '🐄', title: 'Feed Animals',  path: 'feed-animals',  mode: 'both',   bg: 'from-leaf to-green-700' },
  { id: 'pop-critters',  emoji: '🐹', title: 'Pop Critters',  path: 'pop-critters',  mode: 'noisy',  bg: 'from-amber-400 to-orange-500' },
  { id: 'colouring',     emoji: '🎨', title: 'Colouring',     path: 'colouring',     mode: 'quiet',  bg: 'from-candy to-pink-700' },
  { id: 'music-pad',     emoji: '🎵', title: 'Music',         path: 'music-pad',     mode: 'noisy',  bg: 'from-purple-500 to-violet-700' },
  { id: 'memory-match',  emoji: '🧠', title: 'Memory',        path: 'memory-match',  mode: 'quiet',  bg: 'from-teal-400 to-cyan-600' },
  { id: 'farm-book',     emoji: '📖', title: 'Farm Book',     path: 'farm-book',     mode: 'quiet',  bg: 'from-yellow-400 to-amber-600' },
  { id: 'youtube-kids',  emoji: '📺', title: 'YouTube Kids',  path: 'youtube-kids',  mode: 'both',   bg: 'from-red-500 to-red-700', external: 'https://www.youtubekids.com' },
];

export default games;
