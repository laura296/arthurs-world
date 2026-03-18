/**
 * Arthur's Music — content registry.
 * Instruments, sound play, and music videos.
 */
const games = [
  // ── Instruments ──
  { id: 'music-pad',     emoji: '🎵', title: 'Music',         path: 'music-pad',     group: 'Instruments', bg: 'from-purple-500 to-violet-700',  cover: '/arthurs-music/images/cards/music-pad.png' },
  { id: 'xylophone',     emoji: '🎶', title: 'Xylophone',     path: 'xylophone',     group: 'Instruments', bg: 'from-sky-400 to-indigo-600' },
  { id: 'drum-pad',      emoji: '🥁', title: 'Drum Pad',      path: 'drum-pad',      group: 'Instruments', bg: 'from-red-500 to-rose-700' },

  // ── Sound Play ──
  { id: 'animal-sounds', emoji: '🐄', title: 'Animal Sounds', path: 'animal-sounds', group: 'Sound Play', bg: 'from-green-400 to-emerald-600' },
  { id: 'jukebox',       emoji: '🎵', title: 'Jukebox',       path: 'jukebox',       group: 'Sound Play', bg: 'from-indigo-500 to-purple-700' },

  // ── Music Videos ──
  { id: 'baby-shark',        emoji: '🦈', title: 'Baby Shark',         path: 'video/baby-shark',        group: 'Videos', bg: 'from-yellow-400 to-orange-500',  cover: '/arthurs-music/videos/baby-shark.webp' },
  { id: 'wheels-on-bus',     emoji: '🚌', title: 'Wheels on the Bus',  path: 'video/wheels-on-bus',     group: 'Videos', bg: 'from-red-400 to-rose-600',       cover: '/arthurs-music/videos/wheels-on-bus.webp' },
  { id: 'let-it-go',         emoji: '❄️', title: 'Let It Go',          path: 'video/let-it-go',         group: 'Videos', bg: 'from-sky-300 to-blue-600',       cover: '/arthurs-music/videos/let-it-go.webp' },
  { id: 'old-macdonald',     emoji: '🐄', title: 'Old MacDonald',      path: 'video/old-macdonald',     group: 'Videos', bg: 'from-green-400 to-emerald-600',  cover: '/arthurs-music/videos/old-macdonald.webp' },
  { id: 'bath-song',         emoji: '🛁', title: 'Bath Song',          path: 'video/bath-song',         group: 'Videos', bg: 'from-cyan-400 to-blue-500',      cover: '/arthurs-music/videos/bath-song.webp' },
  { id: 'head-shoulders',     emoji: '🙆', title: 'Head Shoulders',     path: 'video/head-shoulders',     group: 'Videos', bg: 'from-amber-400 to-yellow-600',   cover: '/arthurs-music/videos/head-shoulders.webp' },
  { id: 'twinkle-star',       emoji: '⭐', title: 'Twinkle Twinkle',    path: 'video/twinkle-star',       group: 'Videos', bg: 'from-indigo-400 to-purple-600',  cover: '/arthurs-music/videos/twinkle-star.webp' },
  { id: 'itsy-bitsy-spider',  emoji: '🕷️', title: 'Itsy Bitsy Spider',  path: 'video/itsy-bitsy-spider',  group: 'Videos', bg: 'from-pink-400 to-rose-600',      cover: '/arthurs-music/videos/itsy-bitsy-spider.webp' },
  { id: 'if-youre-happy',     emoji: '😊', title: "If You're Happy",    path: 'video/if-youre-happy',     group: 'Videos', bg: 'from-fuchsia-400 to-pink-600',   cover: '/arthurs-music/videos/if-youre-happy.webp' },
  { id: 'five-little-ducks',  emoji: '🦆', title: 'Five Little Ducks',  path: 'video/five-little-ducks',  group: 'Videos', bg: 'from-violet-400 to-purple-600',  cover: '/arthurs-music/videos/five-little-ducks.webp' },
  { id: 'yes-yes-vegetables', emoji: '🥕', title: 'Yes Yes Vegetables', path: 'video/yes-yes-vegetables', group: 'Videos', bg: 'from-lime-400 to-green-600',   cover: '/arthurs-music/videos/yes-yes-vegetables.webp' },
  { id: 'dinosaur-dance',    emoji: '🦕', title: 'Dinosaur Dance',    path: 'video/dinosaur-dance',    group: 'Videos', bg: 'from-emerald-400 to-teal-600', cover: '/arthurs-music/videos/dinosaur-dance.webp' },
  { id: 'youre-welcome',     emoji: '🪝', title: "You're Welcome",   path: 'video/youre-welcome',     group: 'Videos', bg: 'from-teal-400 to-cyan-600',    cover: '/arthurs-music/videos/youre-welcome.webp' },
];

export default games;
