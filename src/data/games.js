/**
 * Game registry — each game's metadata.
 * `category`: 'games' | 'puzzles' | 'art' | 'books' | 'music'
 * `path`: route segment under /games/:mode/:section/
 * `cover`: optional image path for book cover cards
 * `group`: optional sub-grouping label for visual dividers in GameGrid
 */
const games = [
  // ── Games ──
  { id: 'bubble-pop',    emoji: '🫧', title: 'Bubble Pop',    path: 'bubble-pop',    category: 'games', group: '🎮 Games', bg: 'from-sky to-blue-500',           cover: '/arthurs-world/images/cards/bubble-pop.webp' },
  { id: 'feed-animals',  emoji: '🐄', title: 'Feed Animals',  path: 'feed-animals',  category: 'games', group: '🎮 Games', bg: 'from-leaf to-green-700',         cover: '/arthurs-world/images/cards/feed-animals.webp' },
  { id: 'pop-critters',  emoji: '🐹', title: 'Pop Critters',  path: 'pop-critters',  category: 'games', group: '🎮 Games', bg: 'from-amber-400 to-orange-500',   cover: '/arthurs-world/images/cards/pop-critters.webp' },
  { id: 'build-a-scene', emoji: '🎭', title: 'Build a Scene', path: 'build-a-scene', category: 'games', group: '🎮 Games', bg: 'from-amber-400 to-orange-600',   cover: '/arthurs-world/images/cards/build-a-scene.webp' },
  { id: 'stack-bricks',  emoji: '🧱', title: 'Bricks',        path: 'stack-bricks',  category: 'games', group: '🎮 Games', bg: 'from-orange-400 to-red-500' },
  { id: 'odd-one-picks', emoji: '🔍', title: 'Picks',         path: 'odd-one-picks', category: 'games', group: '🧩 Puzzles', bg: 'from-violet-400 to-fuchsia-500' },

  // ── Puzzles & Learning ──
  { id: 'memory-match',    emoji: '🧠', title: 'Memory',        path: 'memory-match',    category: 'games', group: '🧩 Puzzles', bg: 'from-teal-400 to-cyan-600',    cover: '/arthurs-world/images/cards/memory-match.webp' },
  { id: 'shape-match',     emoji: '🔷', title: 'Shape Match',   path: 'shape-match',     category: 'games', group: '🧩 Puzzles', bg: 'from-cyan-400 to-teal-600' },
  { id: 'counting-garden', emoji: '🌸', title: 'Counting',      path: 'counting-garden', category: 'games', group: '🧩 Puzzles', bg: 'from-green-300 to-emerald-500' },
  { id: 'colour-sort',     emoji: '🎨', title: 'Colour Sort',   path: 'colour-sort',     category: 'games', group: '🧩 Puzzles', bg: 'from-pink-300 to-amber-400' },
  { id: 'abc-adventure',   emoji: '🔤', title: 'ABC Adventure', path: 'abc-adventure',   category: 'games', group: '🧩 Puzzles', bg: 'from-amber-300 to-yellow-500' },
  { id: 'number-line',     emoji: '🔢', title: 'Number Line',   path: 'number-line',     category: 'games', group: '🧩 Puzzles', bg: 'from-blue-300 to-indigo-500' },

  // ── Art ──
  { id: 'colouring-book', emoji: '🖍️', title: 'Colour In',     path: 'colouring-book', category: 'art', bg: 'from-amber-300 to-pink-500' },
  { id: 'free-art',       emoji: '🎨', title: 'Free Art',      path: 'free-art',       category: 'art', bg: 'from-candy to-pink-700',           cover: '/arthurs-world/images/cards/colouring.webp' },
  { id: 'dot-art',        emoji: '🔴', title: 'Dot Art',       path: 'dot-art',        category: 'art', bg: 'from-sky-300 to-purple-500' },
  { id: 'stamp-art',      emoji: '🌟', title: 'Stamps',        path: 'stamp-art',      category: 'art', bg: 'from-emerald-300 to-teal-500' },

  // ── Music ──
  { id: 'music-pad',     emoji: '🎵', title: 'Music',         path: 'music-pad',     category: 'music', bg: 'from-purple-500 to-violet-700',  cover: '/arthurs-world/images/cards/music-pad.webp' },
  { id: 'xylophone',     emoji: '🎶', title: 'Xylophone',     path: 'xylophone',     category: 'music', bg: 'from-sky-400 to-indigo-600' },
  { id: 'drum-pad',      emoji: '🥁', title: 'Drum Pad',      path: 'drum-pad',      category: 'music', bg: 'from-red-500 to-rose-700' },
  { id: 'animal-sounds', emoji: '🐄', title: 'Animal Sounds', path: 'animal-sounds', category: 'music', bg: 'from-green-400 to-emerald-600' },

  // ── Books: Feelings ──
  { id: 'feelings-monster',   emoji: '🎨', title: 'Feelings Monster',   path: 'feelings-monster',   category: 'books', group: '💛 Feelings', bg: 'from-purple-300 to-pink-400' },
  { id: 'when-i-feel-big',    emoji: '🐻', title: 'When I Feel Big',    path: 'when-i-feel-big',    category: 'books', group: '💛 Feelings', bg: 'from-amber-300 to-orange-400' },
  { id: 'feelings-friends',   emoji: '🐰', title: 'Feelings Friends',   path: 'feelings-friends',   category: 'books', group: '💛 Feelings', bg: 'from-sky-200 to-amber-200' },

  // ── Books: Fairy Tales ──
  { id: 'ellie-tiny-folk', emoji: '🐘', title: "Ellie's Story", path: 'ellie-tiny-folk', category: 'books', group: '🏰 Fairy Tales', bg: 'from-purple-300 to-pink-400', cover: '/arthurs-world/images/ellie/character-sheet.webp' },
  { id: 'farm-book',     emoji: '🌙', title: 'Goodnight Farm', path: 'farm-book',     category: 'books', group: '🏰 Fairy Tales', bg: 'from-indigo-400 to-purple-600', cover: '/arthurs-world/images/farm-book/page-1.webp' },
  { id: 'three-pigs',    emoji: '🐷', title: '3 Little Pigs', path: 'three-pigs',    category: 'books', group: '🏰 Fairy Tales', bg: 'from-pink-400 to-rose-500',    cover: '/arthurs-world/images/three-pigs/page-1.webp' },
  { id: 'goldilocks',    emoji: '🐻', title: 'Goldilocks',    path: 'goldilocks',    category: 'books', group: '🏰 Fairy Tales', bg: 'from-amber-400 to-yellow-600', cover: '/arthurs-world/images/goldilocks/page-1.webp' },
  { id: 'red-riding',    emoji: '🧒', title: 'Red Riding Hood', path: 'red-riding',  category: 'books', group: '🏰 Fairy Tales', bg: 'from-red-400 to-rose-600',     cover: '/arthurs-world/images/red-riding/page-1.webp' },

  // ── Books: Just So Stories (Kipling) ──
  { id: 'whale-throat',      emoji: '🐋', title: "Whale's Throat",     path: 'whale-throat',      category: 'books', group: '📖 Just So Stories', bg: 'from-blue-400 to-blue-700',    cover: '/arthurs-world/images/whale-throat/page-1.webp' },
  { id: 'camel-hump',        emoji: '🐫', title: "Camel's Hump",       path: 'camel-hump',        category: 'books', group: '📖 Just So Stories', bg: 'from-amber-300 to-orange-500',  cover: '/arthurs-world/images/camel-hump/page-1.webp' },
  { id: 'rhino-skin',        emoji: '🦏', title: "Rhino's Skin",       path: 'rhino-skin',        category: 'books', group: '📖 Just So Stories', bg: 'from-sky-300 to-emerald-400',   cover: '/arthurs-world/images/rhino-skin/page-1.webp' },
  { id: 'leopard-spots',     emoji: '🐆', title: "Leopard's Spots",    path: 'leopard-spots',     category: 'books', group: '📖 Just So Stories', bg: 'from-green-400 to-yellow-600',  cover: '/arthurs-world/images/leopard-spots/page-1.webp' },
  { id: 'elephant-child',    emoji: '🐘', title: "Elephant's Child",   path: 'elephant-child',    category: 'books', group: '📖 Just So Stories', bg: 'from-green-400 to-emerald-600', cover: '/arthurs-world/images/elephant-child/page-1.webp' },
  { id: 'old-man-kangaroo',  emoji: '🦘', title: 'Old Man Kangaroo',   path: 'old-man-kangaroo',  category: 'books', group: '📖 Just So Stories', bg: 'from-orange-300 to-red-500',    cover: '/arthurs-world/images/old-man-kangaroo/page-1.webp' },
  { id: 'armadillos',        emoji: '🦔', title: 'The Armadillos',     path: 'armadillos',        category: 'books', group: '📖 Just So Stories', bg: 'from-green-400 to-lime-600',    cover: '/arthurs-world/images/armadillos/page-1.webp' },
  { id: 'first-letter',      emoji: '✏️', title: 'First Letter',       path: 'first-letter',      category: 'books', group: '📖 Just So Stories', bg: 'from-amber-200 to-orange-400',  cover: '/arthurs-world/images/first-letter/page-1.webp' },
  { id: 'alphabet-made',     emoji: '🔤', title: 'The Alphabet',       path: 'alphabet-made',     category: 'books', group: '📖 Just So Stories', bg: 'from-purple-300 to-indigo-500', cover: '/arthurs-world/images/alphabet-made/page-1.webp' },
  { id: 'crab-sea',          emoji: '🦀', title: 'Crab & the Sea',     path: 'crab-sea',          category: 'books', group: '📖 Just So Stories', bg: 'from-cyan-400 to-blue-600',     cover: '/arthurs-world/images/crab-sea/page-1.webp' },
  { id: 'cat-walked',        emoji: '🐈', title: 'Cat Who Walked',     path: 'cat-walked',        category: 'books', group: '📖 Just So Stories', bg: 'from-slate-400 to-indigo-600',  cover: '/arthurs-world/images/cat-walked/page-1.webp' },
  { id: 'butterfly-stamped', emoji: '🦋', title: 'Butterfly Stamped',  path: 'butterfly-stamped', category: 'books', group: '📖 Just So Stories', bg: 'from-pink-300 to-purple-500',   cover: '/arthurs-world/images/butterfly-stamped/page-1.webp' },

  // ── Books: Aesop's Fables ──
  { id: 'tortoise-hare',       emoji: '🐢', title: 'Tortoise & Hare',     path: 'tortoise-hare',       category: 'books', group: '🦊 Aesop\'s Fables', bg: 'from-green-300 to-amber-400' },
  { id: 'lion-mouse',          emoji: '🦁', title: 'Lion & Mouse',        path: 'lion-mouse',          category: 'books', group: '🦊 Aesop\'s Fables', bg: 'from-amber-300 to-orange-500' },
  { id: 'boy-cried-wolf',      emoji: '🐺', title: 'Boy Cried Wolf',      path: 'boy-cried-wolf',      category: 'books', group: '🦊 Aesop\'s Fables', bg: 'from-green-300 to-sky-400' },
  { id: 'ant-grasshopper',     emoji: '🐜', title: 'Ant & Grasshopper',   path: 'ant-grasshopper',     category: 'books', group: '🦊 Aesop\'s Fables', bg: 'from-green-300 to-yellow-400' },
  { id: 'fox-grapes',          emoji: '🦊', title: 'Fox & the Grapes',    path: 'fox-grapes',          category: 'books', group: '🦊 Aesop\'s Fables', bg: 'from-purple-300 to-green-400' },
  { id: 'town-country-mouse',  emoji: '🐭', title: 'Town & Country Mouse', path: 'town-country-mouse', category: 'books', group: '🦊 Aesop\'s Fables', bg: 'from-green-300 to-blue-400' },

  // ── Books: Classic Tales (public domain) ──
  { id: 'cinderella',       emoji: '👠', title: 'Cinderella',        path: 'cinderella',       category: 'books', group: '🏰 Fairy Tales', bg: 'from-blue-300 to-indigo-400',    cover: '/arthurs-world/images/disney/cinderella/page-1.webp' },
  { id: 'snow-white',       emoji: '🍎', title: 'Snow White',        path: 'snow-white',       category: 'books', group: '🏰 Fairy Tales', bg: 'from-yellow-300 to-red-400',     cover: '/arthurs-world/images/disney/snow-white/page-1.webp' },
  { id: 'bramble-bear',     emoji: '🍯', title: "Bramble's Honey Day", path: 'bramble-bear',   category: 'books', group: '🏰 Fairy Tales', bg: 'from-amber-300 to-yellow-500' },
  { id: 'captain-hook',     emoji: '🏴‍☠️', title: 'Peter & the Pirate', path: 'captain-hook',   category: 'books', group: '🏰 Fairy Tales', bg: 'from-red-600 to-gray-800',       cover: '/arthurs-world/images/disney/captain-hook/page-1.webp' },

  // ── Adventures ──
  { id: 'fairy-dust',       emoji: '✨', title: 'Fairy Dust',        path: 'fairy-dust',       category: 'games', group: '✨ Adventures', bg: 'from-pink-300 to-purple-400' },
  { id: 'honey-hunt',       emoji: '🐝', title: 'Honey Hunt',       path: 'honey-hunt',       category: 'games', group: '✨ Adventures', bg: 'from-amber-400 to-orange-500' },
  { id: 'puppy-wash',        emoji: '🐾', title: 'Puppy Wash',       path: 'puppy-wash',       category: 'games', group: '✨ Adventures', bg: 'from-pink-200 to-amber-100' },

  // ── Aesop's Fables — Games ──
  { id: 'tortoise-hare-race', emoji: '🏁', title: 'Tortoise Race', path: 'tortoise-hare-race', category: 'games', group: '✨ Adventures', bg: 'from-green-300 to-amber-400' },

  // ── Tea Party (pattern game) ──
  { id: 'mad-hatter-tea-party', emoji: '🎩', title: 'Tea Party', path: 'mad-hatter-tea-party', category: 'games', group: '✨ Adventures', bg: 'from-amber-300 to-rose-400' },

  // ── Self-Care ──
  { id: 'morning-routine',   emoji: '👕', title: 'Getting Dressed', path: 'morning-routine',   category: 'games', group: '🧸 Self-Care', bg: 'from-amber-300 to-orange-400' },
  { id: 'sparkle-teeth',     emoji: '🪥', title: 'Sparkle Teeth',  path: 'sparkle-teeth',     category: 'games', group: '🧸 Self-Care', bg: 'from-sky-300 to-blue-500' },
  { id: 'arthurs-lunchbox',  emoji: '🥗', title: 'Lunchbox',       path: 'arthurs-lunchbox',  category: 'games', group: '🧸 Self-Care', bg: 'from-green-300 to-emerald-500' },
];

export default games;
