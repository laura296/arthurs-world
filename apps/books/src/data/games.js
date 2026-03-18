/**
 * Arthur's Books — content registry.
 * Books only: fairy tales, Kipling, Aesop, Disney stories, feelings, Easter story.
 */
const games = [
  // ── Feelings ──
  { id: 'feelings-monster',   emoji: '🎨', title: 'Feelings Monster',   path: 'feelings-monster',   group: 'Feelings', bg: 'from-purple-300 to-pink-400', cover: '/arthurs-books/images/feelings-monster/page-1.png' },
  { id: 'when-i-feel-big',    emoji: '🐻', title: 'When I Feel Big',    path: 'when-i-feel-big',    group: 'Feelings', bg: 'from-amber-300 to-orange-400', cover: '/arthurs-books/images/when-i-feel-big/page-1.png' },
  { id: 'feelings-friends',   emoji: '🐰', title: 'Feelings Friends',   path: 'feelings-friends',   group: 'Feelings', bg: 'from-sky-200 to-amber-200',    cover: '/arthurs-books/images/feelings-friends/page-1.png' },

  // ── Fairy Tales ──
  { id: 'ellie-tiny-folk', emoji: '🐘', title: "Ellie's Story", path: 'ellie-tiny-folk', group: 'Fairy Tales', bg: 'from-purple-300 to-pink-400', cover: '/arthurs-books/images/ellie/character-sheet.png' },
  { id: 'farm-book',     emoji: '🌙', title: 'Goodnight Farm', path: 'farm-book',     group: 'Fairy Tales', bg: 'from-indigo-400 to-purple-600', cover: '/arthurs-books/images/farm-book/page-1.png' },
  { id: 'three-pigs',    emoji: '🐷', title: '3 Little Pigs', path: 'three-pigs',    group: 'Fairy Tales', bg: 'from-pink-400 to-rose-500',    cover: '/arthurs-books/images/three-pigs/page-1.png' },
  { id: 'goldilocks',    emoji: '🐻', title: 'Goldilocks',    path: 'goldilocks',    group: 'Fairy Tales', bg: 'from-amber-400 to-yellow-600', cover: '/arthurs-books/images/goldilocks/page-1.png' },
  { id: 'red-riding',    emoji: '🧒', title: 'Red Riding Hood', path: 'red-riding',  group: 'Fairy Tales', bg: 'from-red-400 to-rose-600',     cover: '/arthurs-books/images/red-riding/page-1.png' },

  // ── Just So Stories (Kipling) ──
  { id: 'whale-throat',      emoji: '🐋', title: "Whale's Throat",     path: 'whale-throat',      group: 'Just So Stories', bg: 'from-blue-400 to-blue-700',    cover: '/arthurs-books/images/whale-throat/page-1.png' },
  { id: 'camel-hump',        emoji: '🐫', title: "Camel's Hump",       path: 'camel-hump',        group: 'Just So Stories', bg: 'from-amber-300 to-orange-500',  cover: '/arthurs-books/images/camel-hump/page-1.png' },
  { id: 'rhino-skin',        emoji: '🦏', title: "Rhino's Skin",       path: 'rhino-skin',        group: 'Just So Stories', bg: 'from-sky-300 to-emerald-400',   cover: '/arthurs-books/images/rhino-skin/page-1.png' },
  { id: 'leopard-spots',     emoji: '🐆', title: "Leopard's Spots",    path: 'leopard-spots',     group: 'Just So Stories', bg: 'from-green-400 to-yellow-600',  cover: '/arthurs-books/images/leopard-spots/page-1.png' },
  { id: 'elephant-child',    emoji: '🐘', title: "Elephant's Child",   path: 'elephant-child',    group: 'Just So Stories', bg: 'from-green-400 to-emerald-600', cover: '/arthurs-books/images/elephant-child/page-1.png' },
  { id: 'old-man-kangaroo',  emoji: '🦘', title: 'Old Man Kangaroo',   path: 'old-man-kangaroo',  group: 'Just So Stories', bg: 'from-orange-300 to-red-500',    cover: '/arthurs-books/images/old-man-kangaroo/page-1.png' },
  { id: 'armadillos',        emoji: '🦔', title: 'The Armadillos',     path: 'armadillos',        group: 'Just So Stories', bg: 'from-green-400 to-lime-600',    cover: '/arthurs-books/images/armadillos/page-1.png' },
  { id: 'first-letter',      emoji: '✏️', title: 'First Letter',       path: 'first-letter',      group: 'Just So Stories', bg: 'from-amber-200 to-orange-400',  cover: '/arthurs-books/images/first-letter/page-1.png' },
  { id: 'alphabet-made',     emoji: '🔤', title: 'The Alphabet',       path: 'alphabet-made',     group: 'Just So Stories', bg: 'from-purple-300 to-indigo-500', cover: '/arthurs-books/images/alphabet-made/page-1.png' },
  { id: 'crab-sea',          emoji: '🦀', title: 'Crab & the Sea',     path: 'crab-sea',          group: 'Just So Stories', bg: 'from-cyan-400 to-blue-600',     cover: '/arthurs-books/images/crab-sea/page-1.png' },
  { id: 'cat-walked',        emoji: '🐈', title: 'Cat Who Walked',     path: 'cat-walked',        group: 'Just So Stories', bg: 'from-slate-400 to-indigo-600',  cover: '/arthurs-books/images/cat-walked/page-1.png' },
  { id: 'butterfly-stamped', emoji: '🦋', title: 'Butterfly Stamped',  path: 'butterfly-stamped', group: 'Just So Stories', bg: 'from-pink-300 to-purple-500',   cover: '/arthurs-books/images/butterfly-stamped/page-1.png' },

  // ── Aesop's Fables ──
  { id: 'tortoise-hare',       emoji: '🐢', title: 'Tortoise & Hare',     path: 'tortoise-hare',       group: "Aesop's Fables", bg: 'from-green-300 to-amber-400',   cover: '/arthurs-books/images/tortoise-hare/page-1.png' },
  { id: 'lion-mouse',          emoji: '🦁', title: 'Lion & Mouse',        path: 'lion-mouse',          group: "Aesop's Fables", bg: 'from-amber-300 to-orange-500',  cover: '/arthurs-books/images/lion-mouse/page-1.png' },
  { id: 'boy-cried-wolf',      emoji: '🐺', title: 'Boy Cried Wolf',      path: 'boy-cried-wolf',      group: "Aesop's Fables", bg: 'from-green-300 to-sky-400',     cover: '/arthurs-books/images/boy-cried-wolf/page-1.png' },
  { id: 'ant-grasshopper',     emoji: '🐜', title: 'Ant & Grasshopper',   path: 'ant-grasshopper',     group: "Aesop's Fables", bg: 'from-green-300 to-yellow-400',  cover: '/arthurs-books/images/ant-grasshopper/page-1.png' },
  { id: 'fox-grapes',          emoji: '🦊', title: 'Fox & the Grapes',    path: 'fox-grapes',          group: "Aesop's Fables", bg: 'from-purple-300 to-green-400',  cover: '/arthurs-books/images/fox-grapes/page-1.png' },
  { id: 'town-country-mouse',  emoji: '🐭', title: 'Town & Country Mouse', path: 'town-country-mouse', group: "Aesop's Fables", bg: 'from-green-300 to-blue-400',   cover: '/arthurs-books/images/town-country-mouse/page-1.png' },

  // ── Disney ──
  { id: 'cinderella',       emoji: '👠', title: 'Cinderella',        path: 'cinderella',       group: 'Disney', bg: 'from-blue-300 to-indigo-400',    cover: '/arthurs-books/images/disney/cinderella/page-1.png' },
  { id: 'snow-white',       emoji: '🍎', title: 'Snow White',        path: 'snow-white',       group: 'Disney', bg: 'from-yellow-300 to-red-400',     cover: '/arthurs-books/images/disney/snow-white/page-1.png' },
  { id: 'winnie-the-pooh',  emoji: '🍯', title: 'Winnie the Pooh',  path: 'winnie-the-pooh',  group: 'Disney', bg: 'from-amber-300 to-yellow-500',   cover: '/arthurs-books/images/disney/pooh/page-1.png' },
  { id: 'captain-hook',     emoji: '🏴‍☠️', title: 'Captain Hook',     path: 'captain-hook',     group: 'Disney', bg: 'from-red-600 to-gray-800',       cover: '/arthurs-books/images/disney/captain-hook/page-1.png' },

  // ── Easter ──
  { id: 'spring-egg-hunt',    emoji: '📖', title: 'Rosie\'s Egg Hunt', path: 'spring-egg-hunt', group: 'Easter', bg: 'from-sky-100 to-green-100' },
];

export default games;
