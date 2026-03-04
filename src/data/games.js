/**
 * Game registry — each game's metadata.
 * `category`: 'games' | 'puzzles' | 'art' | 'books' | 'music' | 'videos'
 * `path`: route segment under /games/:mode/:section/
 * `cover`: optional image path for book cover cards
 */
const games = [
  // ── Games ──
  { id: 'bubble-pop',    emoji: '🫧', title: 'Bubble Pop',    path: 'bubble-pop',    category: 'games', bg: 'from-sky to-blue-500',           cover: '/arthurs-world/images/cards/bubble-pop.png' },
  { id: 'feed-animals',  emoji: '🐄', title: 'Feed Animals',  path: 'feed-animals',  category: 'games', bg: 'from-leaf to-green-700',         cover: '/arthurs-world/images/cards/feed-animals.png' },
  { id: 'pop-critters',  emoji: '🐹', title: 'Pop Critters',  path: 'pop-critters',  category: 'games', bg: 'from-amber-400 to-orange-500',   cover: '/arthurs-world/images/cards/pop-critters.png' },
  { id: 'build-a-scene', emoji: '🎭', title: 'Build a Scene', path: 'build-a-scene', category: 'games', bg: 'from-amber-400 to-orange-600',   cover: '/arthurs-world/images/cards/build-a-scene.png' },

  // ── Videos ──
  { id: 'youtube-kids',  emoji: '📺', title: 'YouTube Kids',  path: 'youtube-kids',  category: 'videos', bg: 'from-red-500 to-red-700', external: 'https://www.youtubekids.com' },

  // ── Puzzles ──
  { id: 'memory-match',  emoji: '🧠', title: 'Memory',        path: 'memory-match',  category: 'puzzles', bg: 'from-teal-400 to-cyan-600',    cover: '/arthurs-world/images/cards/memory-match.png' },

  // ── Art ──
  { id: 'colouring',     emoji: '🎨', title: 'Colouring',     path: 'colouring',     category: 'art', bg: 'from-candy to-pink-700',           cover: '/arthurs-world/images/cards/colouring.png' },

  // ── Music ──
  { id: 'music-pad',     emoji: '🎵', title: 'Music',         path: 'music-pad',     category: 'music', bg: 'from-purple-500 to-violet-700',  cover: '/arthurs-world/images/cards/music-pad.png' },

  // ── Books ──
  { id: 'farm-book',     emoji: '📖', title: 'Farm Book',     path: 'farm-book',     category: 'books', bg: 'from-yellow-400 to-amber-600' },
  { id: 'three-pigs',    emoji: '🐷', title: '3 Little Pigs', path: 'three-pigs',    category: 'books', bg: 'from-pink-400 to-rose-500',    cover: '/arthurs-world/images/three-pigs/page-1.png' },
  { id: 'goldilocks',    emoji: '🐻', title: 'Goldilocks',    path: 'goldilocks',    category: 'books', bg: 'from-amber-400 to-yellow-600', cover: '/arthurs-world/images/goldilocks/page-1.png' },
  { id: 'red-riding',    emoji: '🧒', title: 'Red Riding Hood', path: 'red-riding',  category: 'books', bg: 'from-red-400 to-rose-600',     cover: '/arthurs-world/images/red-riding/page-1.png' },
  { id: 'whale-throat',      emoji: '🐋', title: "Whale's Throat",     path: 'whale-throat',      category: 'books', bg: 'from-blue-400 to-blue-700',    cover: '/arthurs-world/images/whale-throat/page-1.png' },
  { id: 'camel-hump',        emoji: '🐫', title: "Camel's Hump",       path: 'camel-hump',        category: 'books', bg: 'from-amber-300 to-orange-500',  cover: '/arthurs-world/images/camel-hump/page-1.png' },
  { id: 'rhino-skin',        emoji: '🦏', title: "Rhino's Skin",       path: 'rhino-skin',        category: 'books', bg: 'from-sky-300 to-emerald-400',   cover: '/arthurs-world/images/rhino-skin/page-1.png' },
  { id: 'leopard-spots',     emoji: '🐆', title: "Leopard's Spots",    path: 'leopard-spots',     category: 'books', bg: 'from-green-400 to-yellow-600',  cover: '/arthurs-world/images/leopard-spots/page-1.png' },
  { id: 'elephant-child',    emoji: '🐘', title: "Elephant's Child",   path: 'elephant-child',    category: 'books', bg: 'from-green-400 to-emerald-600', cover: '/arthurs-world/images/elephant-child/page-1.png' },
  { id: 'old-man-kangaroo',  emoji: '🦘', title: 'Old Man Kangaroo',   path: 'old-man-kangaroo',  category: 'books', bg: 'from-orange-300 to-red-500',    cover: '/arthurs-world/images/old-man-kangaroo/page-1.png' },
  { id: 'armadillos',        emoji: '🦔', title: 'The Armadillos',     path: 'armadillos',        category: 'books', bg: 'from-green-400 to-lime-600',    cover: '/arthurs-world/images/armadillos/page-1.png' },
  { id: 'first-letter',      emoji: '✏️', title: 'First Letter',       path: 'first-letter',      category: 'books', bg: 'from-amber-200 to-orange-400',  cover: '/arthurs-world/images/first-letter/page-1.png' },
  { id: 'alphabet-made',     emoji: '🔤', title: 'The Alphabet',       path: 'alphabet-made',     category: 'books', bg: 'from-purple-300 to-indigo-500', cover: '/arthurs-world/images/alphabet-made/page-1.png' },
  { id: 'crab-sea',          emoji: '🦀', title: 'Crab & the Sea',     path: 'crab-sea',          category: 'books', bg: 'from-cyan-400 to-blue-600',     cover: '/arthurs-world/images/crab-sea/page-1.png' },
  { id: 'cat-walked',        emoji: '🐈', title: 'Cat Who Walked',     path: 'cat-walked',        category: 'books', bg: 'from-slate-400 to-indigo-600',  cover: '/arthurs-world/images/cat-walked/page-1.png' },
  { id: 'butterfly-stamped', emoji: '🦋', title: 'Butterfly Stamped',  path: 'butterfly-stamped', category: 'books', bg: 'from-pink-300 to-purple-500',   cover: '/arthurs-world/images/butterfly-stamped/page-1.png' },
];

export default games;
