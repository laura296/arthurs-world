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
  { id: 'baby-shark',        emoji: '🦈', title: 'Baby Shark',         path: 'video/baby-shark',        category: 'videos', bg: 'from-yellow-400 to-orange-500',  cover: '/arthurs-world/videos/baby-shark.webp' },
  { id: 'wheels-on-bus',     emoji: '🚌', title: 'Wheels on the Bus',  path: 'video/wheels-on-bus',     category: 'videos', bg: 'from-red-400 to-rose-600',       cover: '/arthurs-world/videos/wheels-on-bus.webp' },
  { id: 'let-it-go',         emoji: '❄️', title: 'Let It Go',          path: 'video/let-it-go',         category: 'videos', bg: 'from-sky-300 to-blue-600',       cover: '/arthurs-world/videos/let-it-go.webp' },
  { id: 'old-macdonald',     emoji: '🐄', title: 'Old MacDonald',      path: 'video/old-macdonald',     category: 'videos', bg: 'from-green-400 to-emerald-600',  cover: '/arthurs-world/videos/old-macdonald.webp' },
  { id: 'bath-song',         emoji: '🛁', title: 'Bath Song',          path: 'video/bath-song',         category: 'videos', bg: 'from-cyan-400 to-blue-500',      cover: '/arthurs-world/videos/bath-song.webp' },
  { id: 'head-shoulders',     emoji: '🙆', title: 'Head Shoulders',     path: 'video/head-shoulders',     category: 'videos', bg: 'from-amber-400 to-yellow-600',   cover: '/arthurs-world/videos/head-shoulders.webp' },
  { id: 'twinkle-star',       emoji: '⭐', title: 'Twinkle Twinkle',    path: 'video/twinkle-star',       category: 'videos', bg: 'from-indigo-400 to-purple-600',  cover: '/arthurs-world/videos/twinkle-star.webp' },
  { id: 'itsy-bitsy-spider',  emoji: '🕷️', title: 'Itsy Bitsy Spider',  path: 'video/itsy-bitsy-spider',  category: 'videos', bg: 'from-pink-400 to-rose-600',      cover: '/arthurs-world/videos/itsy-bitsy-spider.webp' },
  { id: 'if-youre-happy',     emoji: '😊', title: "If You're Happy",    path: 'video/if-youre-happy',     category: 'videos', bg: 'from-fuchsia-400 to-pink-600',   cover: '/arthurs-world/videos/if-youre-happy.webp' },
  { id: 'five-little-ducks',  emoji: '🦆', title: 'Five Little Ducks',  path: 'video/five-little-ducks',  category: 'videos', bg: 'from-violet-400 to-purple-600',  cover: '/arthurs-world/videos/five-little-ducks.webp' },
  { id: 'yes-yes-vegetables', emoji: '🥕', title: 'Yes Yes Vegetables', path: 'video/yes-yes-vegetables', category: 'videos', bg: 'from-lime-400 to-green-600',   cover: '/arthurs-world/videos/yes-yes-vegetables.webp' },
  { id: 'dinosaur-dance',    emoji: '🦕', title: 'Dinosaur Dance',    path: 'video/dinosaur-dance',    category: 'videos', bg: 'from-emerald-400 to-teal-600', cover: '/arthurs-world/videos/dinosaur-dance.webp' },
  { id: 'youre-welcome',     emoji: '🪝', title: "You're Welcome",   path: 'video/youre-welcome',     category: 'videos', bg: 'from-teal-400 to-cyan-600',    cover: '/arthurs-world/videos/youre-welcome.webp' },

  // ── Puzzles ──
  { id: 'memory-match',  emoji: '🧠', title: 'Memory',        path: 'memory-match',  category: 'puzzles', bg: 'from-teal-400 to-cyan-600',    cover: '/arthurs-world/images/cards/memory-match.png' },
  { id: 'shape-match',   emoji: '🔷', title: 'Shape Match',   path: 'shape-match',   category: 'puzzles', bg: 'from-cyan-400 to-teal-600' },

  // ── Art ──
  { id: 'colouring-book', emoji: '🖍️', title: 'Colour In',     path: 'colouring-book', category: 'art', bg: 'from-amber-300 to-pink-500' },
  { id: 'free-art',       emoji: '🎨', title: 'Free Art',      path: 'free-art',       category: 'art', bg: 'from-candy to-pink-700',           cover: '/arthurs-world/images/cards/colouring.png' },

  // ── Music ──
  { id: 'music-pad',     emoji: '🎵', title: 'Music',         path: 'music-pad',     category: 'music', bg: 'from-purple-500 to-violet-700',  cover: '/arthurs-world/images/cards/music-pad.png' },

  // ── Books ──
  { id: 'ellie-tiny-folk', emoji: '🐘', title: "Ellie's Story", path: 'ellie-tiny-folk', category: 'books', bg: 'from-purple-300 to-pink-400', cover: '/arthurs-world/images/ellie/character-sheet.png' },
  { id: 'farm-book',     emoji: '🌙', title: 'Goodnight Farm', path: 'farm-book',     category: 'books', bg: 'from-indigo-400 to-purple-600', cover: '/arthurs-world/images/farm-book/page-1.png' },
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

  // ── Disney: Princesses ──
  { id: 'cinderella',       emoji: '👠', title: 'Cinderella',        path: 'cinderella',       category: 'disney-princesses', bg: 'from-blue-300 to-indigo-400',    cover: '/arthurs-world/images/disney/cinderella/page-1.png' },
  { id: 'snow-white',       emoji: '🍎', title: 'Snow White',        path: 'snow-white',       category: 'disney-princesses', bg: 'from-yellow-300 to-red-400',     cover: '/arthurs-world/images/disney/snow-white/page-1.png' },
  { id: 'fairy-dust',       emoji: '✨', title: 'Fairy Dust',        path: 'fairy-dust',       category: 'disney-princesses', bg: 'from-pink-300 to-purple-400' },

  // ── Disney: Villains ──
  { id: 'captain-hook',     emoji: '🏴‍☠️', title: 'Captain Hook',     path: 'captain-hook',     category: 'disney-villains', bg: 'from-red-600 to-gray-800',       cover: '/arthurs-world/images/disney/captain-hook/page-1.png' },
  { id: 'hades-river-styx', emoji: '🔥', title: 'River Styx',       path: 'hades-river-styx', category: 'disney-villains', bg: 'from-purple-800 to-indigo-950',  cover: '/arthurs-world/images/disney/hades/bg.png' },
  { id: 'ursula-potions',   emoji: '🧪', title: "Ursula's Potions", path: 'ursula-potions',   category: 'disney-villains', bg: 'from-purple-700 to-fuchsia-900', cover: '/arthurs-world/images/disney/ursula/bg.png' },

  // ── Disney: Pooh ──
  { id: 'winnie-the-pooh',  emoji: '🍯', title: 'Winnie the Pooh',  path: 'winnie-the-pooh',  category: 'disney-pooh', bg: 'from-amber-300 to-yellow-500',      cover: '/arthurs-world/images/disney/pooh/page-1.png' },
  { id: 'honey-hunt',       emoji: '🐝', title: 'Honey Hunt',       path: 'honey-hunt',       category: 'disney-pooh', bg: 'from-amber-400 to-orange-500' },

  // ── Disney: Dalmatians ──
  { id: 'puppy-wash',        emoji: '🐾', title: 'Puppy Wash Day',   path: 'puppy-wash',       category: 'disney-dalmatians', bg: 'from-pink-200 to-amber-100', cover: '/arthurs-world/images/disney/puppy-wash/puppy-happy.png' },
];

export default games;
