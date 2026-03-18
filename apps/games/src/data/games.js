/**
 * Arthur's Games — content registry.
 * Games, puzzles, art, self-care, Disney games, seasonal games.
 */
const games = [
  // ── Action Games ──
  { id: 'bubble-pop',    emoji: '🫧', title: 'Bubble Pop',    path: 'bubble-pop',    group: 'Games', bg: 'from-sky to-blue-500',           cover: '/arthurs-games/images/cards/bubble-pop.png' },
  { id: 'feed-animals',  emoji: '🐄', title: 'Feed Animals',  path: 'feed-animals',  group: 'Games', bg: 'from-leaf to-green-700',         cover: '/arthurs-games/images/cards/feed-animals.png' },
  { id: 'pop-critters',  emoji: '🐹', title: 'Pop Critters',  path: 'pop-critters',  group: 'Games', bg: 'from-amber-400 to-orange-500',   cover: '/arthurs-games/images/cards/pop-critters.png' },
  { id: 'build-a-scene', emoji: '🎭', title: 'Build a Scene', path: 'build-a-scene', group: 'Games', bg: 'from-amber-400 to-orange-600',   cover: '/arthurs-games/images/cards/build-a-scene.png' },
  { id: 'stack-bricks',  emoji: '🧱', title: 'Bricks',        path: 'stack-bricks',  group: 'Games', bg: 'from-orange-400 to-red-500' },
  { id: 'odd-one-picks', emoji: '🔍', title: 'Picks',         path: 'odd-one-picks', group: 'Puzzles', bg: 'from-violet-400 to-fuchsia-500' },

  // ── Puzzles & Learning ──
  { id: 'memory-match',    emoji: '🧠', title: 'Memory',        path: 'memory-match',    group: 'Puzzles', bg: 'from-teal-400 to-cyan-600',    cover: '/arthurs-games/images/cards/memory-match.png' },
  { id: 'shape-match',     emoji: '🔷', title: 'Shape Match',   path: 'shape-match',     group: 'Puzzles', bg: 'from-cyan-400 to-teal-600' },
  { id: 'counting-garden', emoji: '🌸', title: 'Counting',      path: 'counting-garden', group: 'Puzzles', bg: 'from-green-300 to-emerald-500' },
  { id: 'colour-sort',     emoji: '🎨', title: 'Colour Sort',   path: 'colour-sort',     group: 'Puzzles', bg: 'from-pink-300 to-amber-400' },
  { id: 'abc-adventure',   emoji: '🔤', title: 'ABC Adventure', path: 'abc-adventure',   group: 'Puzzles', bg: 'from-amber-300 to-yellow-500' },
  { id: 'number-line',     emoji: '🔢', title: 'Number Line',   path: 'number-line',     group: 'Puzzles', bg: 'from-blue-300 to-indigo-500' },

  // ── Art ──
  { id: 'colouring-book', emoji: '🖍️', title: 'Colour In',     path: 'colouring-book', group: 'Art', bg: 'from-amber-300 to-pink-500' },
  { id: 'free-art',       emoji: '🎨', title: 'Free Art',      path: 'free-art',       group: 'Art', bg: 'from-candy to-pink-700',           cover: '/arthurs-games/images/cards/colouring.png' },
  { id: 'dot-art',        emoji: '🔴', title: 'Dot Art',       path: 'dot-art',        group: 'Art', bg: 'from-sky-300 to-purple-500' },
  { id: 'stamp-art',      emoji: '🌟', title: 'Stamps',        path: 'stamp-art',      group: 'Art', bg: 'from-emerald-300 to-teal-500' },

  // ── Disney Adventures ──
  { id: 'fairy-dust',       emoji: '✨', title: 'Fairy Dust',        path: 'fairy-dust',       group: 'Adventures', bg: 'from-pink-300 to-purple-400' },
  { id: 'hades-river-styx', emoji: '🔥', title: 'River Styx',       path: 'hades-river-styx', group: 'Adventures', bg: 'from-purple-800 to-indigo-950',  cover: '/arthurs-games/images/disney/hades/bg.png' },
  { id: 'ursula-potions',   emoji: '🧪', title: "Ursula's Potions", path: 'ursula-potions',   group: 'Adventures', bg: 'from-purple-700 to-fuchsia-900', cover: '/arthurs-games/images/disney/ursula/bg.png' },
  { id: 'honey-hunt',       emoji: '🐝', title: 'Honey Hunt',       path: 'honey-hunt',       group: 'Adventures', bg: 'from-amber-400 to-orange-500' },
  { id: 'inside-out-hub',            emoji: '🧠', title: 'Headquarters',    path: 'inside-out-hub',            group: 'Adventures', bg: 'from-violet-600 to-indigo-900' },
  { id: 'control-panel-meltdown',    emoji: '🎛️', title: 'Control Panel',   path: 'control-panel-meltdown',    group: 'Adventures', bg: 'from-yellow-400 to-amber-600' },
  { id: 'anger-cool-down',           emoji: '🔥', title: 'Cool Down!',      path: 'anger-cool-down',           group: 'Adventures', bg: 'from-red-500 to-orange-600' },
  { id: 'alarm-avalanche',           emoji: '🚨', title: 'Alarm Sort',      path: 'alarm-avalanche',           group: 'Adventures', bg: 'from-teal-400 to-orange-500' },
  { id: 'chain-reaction-crisis',     emoji: '⚡', title: 'Chain Reaction',  path: 'chain-reaction-crisis',     group: 'Adventures', bg: 'from-red-600 to-purple-800' },
  { id: 'puppy-wash',        emoji: '🐾', title: 'Puppy',            path: 'puppy-wash',       group: 'Adventures', bg: 'from-pink-200 to-amber-100', cover: '/arthurs-games/images/disney/puppy-wash/puppy-happy.png' },
  { id: 'tortoise-hare-race', emoji: '🏁', title: 'Tortoise Race', path: 'tortoise-hare-race', group: 'Adventures', bg: 'from-green-300 to-amber-400' },
  { id: 'mad-hatter-tea-party', emoji: '🎩', title: 'Tea Party', path: 'mad-hatter-tea-party', group: 'Adventures', bg: 'from-amber-300 to-rose-400' },

  // ── Self-Care ──
  { id: 'morning-routine',   emoji: '👕', title: 'Getting Dressed', path: 'morning-routine',   group: 'Self-Care', bg: 'from-amber-300 to-orange-400' },
  { id: 'sparkle-teeth',     emoji: '🪥', title: 'Sparkle Teeth',  path: 'sparkle-teeth',     group: 'Self-Care', bg: 'from-sky-300 to-blue-500' },
  { id: 'arthurs-lunchbox',  emoji: '🥗', title: 'Lunchbox',       path: 'arthurs-lunchbox',  group: 'Self-Care', bg: 'from-green-300 to-emerald-500' },

  // ── Halloween ──
  { id: 'pumpkin-patch',    emoji: '🎃', title: 'Pumpkin Patch',    path: 'pumpkin-patch',    group: 'Halloween', bg: 'from-orange-500 to-amber-600' },
  { id: 'ghost-peekaboo',   emoji: '👻', title: 'Ghost Peekaboo',   path: 'ghost-peekaboo',   group: 'Halloween', bg: 'from-purple-600 to-indigo-800' },
  { id: 'trick-or-treat',   emoji: '🍬', title: 'Trick or Treat',   path: 'trick-or-treat',   group: 'Halloween', bg: 'from-violet-600 to-purple-900' },
  { id: 'spooky-sounds',    emoji: '🦇', title: 'Spooky Sounds',    path: 'spooky-sounds',    group: 'Halloween', bg: 'from-gray-800 to-purple-900' },
  { id: 'witch-flight',     emoji: '🧙‍♀️', title: 'Witch Flight',    path: 'witch-flight',     group: 'Halloween', bg: 'from-purple-800 to-indigo-900' },

  // ── Easter ──
  { id: 'easter-egg-hunt',    emoji: '🥚', title: 'Egg Hunt',       path: 'easter-egg-hunt',    group: 'Easter', bg: 'from-pink-200 to-green-200' },
  { id: 'bunny-hop',          emoji: '🐰', title: 'Bunny Hop',      path: 'bunny-hop',          group: 'Easter', bg: 'from-green-200 to-yellow-200' },
  { id: 'hatching-chicks',    emoji: '🐥', title: 'Hatching Chicks', path: 'hatching-chicks',   group: 'Easter', bg: 'from-amber-100 to-yellow-200' },
  { id: 'paint-easter-eggs',  emoji: '🎨', title: 'Paint Eggs',     path: 'paint-easter-eggs',  group: 'Easter', bg: 'from-purple-200 to-pink-200' },
];

export default games;
