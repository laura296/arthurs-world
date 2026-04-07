import React from 'react';
import StoryBook from '../components/StoryBook';

const storyData = {
  title: 'The Cat That Walked by Himself',
  audioDir: '/arthurs-world/audio/cat-walked',
  pages: [
    // ── Page 1: All animals were wild ──
    {
      bg: 'from-slate-500 to-indigo-700',
      image: '/arthurs-world/images/cat-walked/page-1.webp',
      text: 'Long long ago, all the animals were WILD. Dog was wild. Horse was wild. Cow was wild. But the wildest of all? The Cat!',
      elements: [
        { id: 'wild-cat', x: 50, y: 35, hotspot: true, w: 140, h: 130, z: 3 },
        { id: 'wild-dog', x: 18, y: 45, hotspot: true, w: 100, h: 90, z: 2 },
        { id: 'wild-horse', x: 82, y: 42, hotspot: true, w: 110, h: 100, z: 2 },
        { id: 'wild-cow', x: 30, y: 55, hotspot: true, w: 100, h: 90, z: 1 },
        { id: 'forest-tree', x: 10, y: 25, hotspot: true, w: 90, h: 100, z: 1 },
        { id: 'moon', x: 88, y: 12, hotspot: true, w: 80, h: 80, z: 1 },
      ],
      interactions: [
        {
          id: 'cat-speak',
          type: 'character-speak',
          targetId: 'wild-cat',
          data: { say: 'I walk by MYSELF!' },
        },
        {
          id: 'dog-speak',
          type: 'character-speak',
          targetId: 'wild-dog',
          data: { say: 'Woof woof!' },
        },
        {
          id: 'horse-speak',
          type: 'character-speak',
          targetId: 'wild-horse',
          data: { say: 'Neeeigh!' },
        },
        {
          id: 'cow-speak',
          type: 'character-speak',
          targetId: 'wild-cow',
          data: { say: 'Mooooo!' },
        },
        {
          id: 'moon-sparkle',
          type: 'tap-sparkle',
          targetId: 'moon',
          data: {},
        },
      ],
    },

    // ── Page 2: Woman makes a cave home ──
    {
      bg: 'from-amber-700 to-slate-600',
      image: '/arthurs-world/images/cat-walked/page-2.webp',
      text: 'A kind Woman made a warm cave. She lit a big fire. Crackle crackle! "Who wants to come in?" she called.',
      elements: [
        { id: 'woman', x: 35, y: 38, hotspot: true, w: 120, h: 120, z: 3 },
        { id: 'cave-fire', x: 55, y: 52, hotspot: true, w: 100, h: 90, z: 2 },
        { id: 'waiting-dog', x: 78, y: 42, hotspot: true, w: 100, h: 90, z: 2 },
        { id: 'cave-entrance', x: 20, y: 30, hotspot: true, w: 100, h: 100, z: 1 },
        { id: 'hidden-bone', x: 88, y: 65, hotspot: true, w: 60, h: 50, z: 1 },
      ],
      interactions: [
        {
          id: 'woman-speak',
          type: 'character-speak',
          targetId: 'woman',
          data: { say: 'Come in! Come in where it is warm!' },
        },
        {
          id: 'fire-color',
          type: 'tap-color',
          targetId: 'cave-fire',
          data: { colors: ['#ef4444', '#f97316', '#eab308', '#dc2626', '#f59e0b'] },
        },
        {
          id: 'dog-peek',
          type: 'peek-a-boo',
          targetId: 'waiting-dog',
          data: { say: 'Woof? Can I come in?' },
        },
        {
          id: 'cave-scene',
          type: 'scene-transform',
          targetId: 'cave-entrance',
          data: { to: 'warm-glow' },
        },
        {
          id: 'bone-reveal',
          type: 'tap-reveal',
          targetId: 'hidden-bone',
          data: { content: 'A yummy bone!' },
        },
      ],
    },

    // ── Page 3: Dog becomes tame ──
    {
      bg: 'from-amber-600 to-stone-700',
      image: '/arthurs-world/images/cat-walked/page-3.webp',
      text: 'Dog ran right in! "Woof woof! I will guard you! I will keep you safe!" Good Dog! Have some dinner!',
      elements: [
        { id: 'happy-dog', x: 45, y: 38, hotspot: true, w: 130, h: 120, z: 3 },
        { id: 'dog-bowl', x: 60, y: 58, hotspot: true, w: 80, h: 70, z: 2 },
        { id: 'guard-shield', x: 25, y: 35, hotspot: true, w: 90, h: 80, z: 2 },
        { id: 'warm-fire-3', x: 80, y: 50, hotspot: true, w: 80, h: 80, z: 1 },
        { id: 'happy-heart', x: 52, y: 22, hotspot: true, w: 60, h: 60, z: 2 },
      ],
      interactions: [
        {
          id: 'dog-speak',
          type: 'character-speak',
          targetId: 'happy-dog',
          data: { say: 'Woof woof! I am a GOOD dog!' },
        },
        {
          id: 'bowl-count',
          type: 'tap-count',
          targetId: 'dog-bowl',
          data: { max: 3, label: 'yummy bites' },
        },
        {
          id: 'dog-collect-bones',
          type: 'collect',
          targetId: 'guard-shield',
          data: { item: 'bone', total: 3 },
        },
        {
          id: 'heart-grow',
          type: 'tap-grow',
          targetId: 'happy-heart',
          data: {},
        },
        {
          id: 'fire-sparkle',
          type: 'tap-sparkle',
          targetId: 'warm-fire-3',
          data: {},
        },
      ],
    },

    // ── Page 4: Horse becomes tame ──
    {
      bg: 'from-stone-500 to-amber-700',
      image: '/arthurs-world/images/cat-walked/page-4.webp',
      text: 'Then Horse clip-clopped in! "Neeeigh! I will carry things for you!" Good Horse! Have some sweet hay!',
      elements: [
        { id: 'tame-horse', x: 50, y: 35, hotspot: true, w: 140, h: 130, z: 3 },
        { id: 'hay-bale', x: 75, y: 55, hotspot: true, w: 90, h: 80, z: 2 },
        { id: 'woman-happy', x: 22, y: 42, hotspot: true, w: 100, h: 100, z: 2 },
        { id: 'horseshoe', x: 38, y: 60, hotspot: true, w: 70, h: 60, z: 1 },
        { id: 'sparkle-star', x: 85, y: 18, hotspot: true, w: 50, h: 50, z: 1 },
      ],
      interactions: [
        {
          id: 'horse-speak',
          type: 'character-speak',
          targetId: 'tame-horse',
          data: { say: 'Neeeigh! Clip clop clip clop!' },
        },
        {
          id: 'hay-count',
          type: 'tap-count',
          targetId: 'hay-bale',
          data: { max: 4, label: 'bundles of hay' },
        },
        {
          id: 'woman-speak',
          type: 'character-speak',
          targetId: 'woman-happy',
          data: { say: 'Good Horse! Eat up!' },
        },
        {
          id: 'horseshoe-collect',
          type: 'collect',
          targetId: 'horseshoe',
          data: { item: 'horseshoe', total: 4 },
        },
        {
          id: 'star-sparkle',
          type: 'tap-sparkle',
          targetId: 'sparkle-star',
          data: {},
        },
      ],
    },

    // ── Page 5: Cow becomes tame ──
    {
      bg: 'from-slate-400 to-stone-600',
      image: '/arthurs-world/images/cat-walked/page-5.webp',
      text: 'And Cow came too! "Moo moo MOO! I will give you milk every day!" Good Cow! Have a cosy barn!',
      elements: [
        { id: 'tame-cow', x: 48, y: 38, hotspot: true, w: 130, h: 120, z: 3 },
        { id: 'milk-glass', x: 72, y: 55, hotspot: true, w: 80, h: 80, z: 2 },
        { id: 'cosy-barn', x: 20, y: 30, hotspot: true, w: 100, h: 90, z: 1 },
        { id: 'bell', x: 55, y: 22, hotspot: true, w: 70, h: 60, z: 2 },
        { id: 'hidden-flower', x: 88, y: 62, hotspot: true, w: 50, h: 50, z: 1 },
      ],
      interactions: [
        {
          id: 'cow-speak',
          type: 'character-speak',
          targetId: 'tame-cow',
          data: { say: 'Moo moo MOO! Here is your milk!' },
        },
        {
          id: 'milk-count',
          type: 'tap-count',
          targetId: 'milk-glass',
          data: { max: 5, label: 'cups of milk' },
        },
        {
          id: 'bell-sound',
          type: 'tap-sound',
          targetId: 'bell',
          data: { say: 'Ding dong! Ding dong!' },
        },
        {
          id: 'barn-peek',
          type: 'peek-a-boo',
          targetId: 'cosy-barn',
          data: { say: 'A cosy barn for Cow!' },
        },
        {
          id: 'flower-reveal',
          type: 'tap-reveal',
          targetId: 'hidden-flower',
          data: { content: 'A pretty flower!' },
        },
      ],
    },

    // ── Page 6: Cat refuses ──
    {
      bg: 'from-indigo-600 to-slate-800',
      image: '/arthurs-world/images/cat-walked/page-6.webp',
      text: 'But NOT the Cat. Oh no no no! "I am the Cat who walks by himself! All places are the same to me!" And off he went. Swish swish swish went his tail.',
      elements: [
        { id: 'proud-cat', x: 50, y: 32, hotspot: true, w: 150, h: 140, z: 3 },
        { id: 'nose-up', x: 60, y: 18, hotspot: true, w: 60, h: 60, z: 2 },
        { id: 'lonely-path', x: 25, y: 55, hotspot: true, w: 80, h: 70, z: 1 },
        { id: 'night-star-1', x: 15, y: 15, hotspot: true, w: 50, h: 50, z: 1 },
        { id: 'night-star-2', x: 85, y: 20, hotspot: true, w: 50, h: 50, z: 1 },
        { id: 'night-moon', x: 75, y: 10, hotspot: true, w: 80, h: 80, z: 1 },
      ],
      interactions: [
        {
          id: 'cat-proud-speak',
          type: 'character-speak',
          targetId: 'proud-cat',
          data: { say: 'I walk by MYSELF! Hmph!' },
        },
        {
          id: 'cat-tail-swish',
          type: 'tap-animate',
          targetId: 'proud-cat',
          data: { animation: 'animate-wiggle', duration: 800 },
        },
        {
          id: 'nose-flap',
          type: 'flap-reveal',
          targetId: 'nose-up',
          data: { say: 'Hmph! Hmph! HMPH!' },
        },
        {
          id: 'star-1-sparkle',
          type: 'tap-sparkle',
          targetId: 'night-star-1',
          data: {},
        },
        {
          id: 'star-2-sparkle',
          type: 'tap-sparkle',
          targetId: 'night-star-2',
          data: {},
        },
        {
          id: 'moon-color',
          type: 'tap-color',
          targetId: 'night-moon',
          data: { colors: ['#fef08a', '#fde68a', '#fcd34d', '#fbbf24', '#f59e0b'] },
        },
      ],
    },

    // ── Page 7: Cat hears baby crying (KEY PAGE) ──
    {
      bg: 'from-indigo-500 to-amber-600',
      image: '/arthurs-world/images/cat-walked/page-7.webp',
      text: 'But then... Cat heard a little Baby crying. Waaah waaah! Cat crept in, soft soft soft. And he purred. Purr purr PURRRR! The Baby stopped crying and smiled!',
      elements: [
        { id: 'purring-cat', x: 40, y: 42, hotspot: true, w: 120, h: 110, z: 3 },
        { id: 'baby', x: 60, y: 40, hotspot: true, w: 110, h: 110, z: 3 },
        { id: 'purr-hearts', x: 50, y: 22, hotspot: true, w: 80, h: 70, z: 2 },
        { id: 'cradle', x: 60, y: 55, hotspot: true, w: 80, h: 80, z: 1 },
        { id: 'hidden-mouse', x: 12, y: 65, hotspot: true, w: 50, h: 50, z: 1 },
        { id: 'warm-fire-7', x: 85, y: 50, hotspot: true, w: 80, h: 80, z: 1 },
      ],
      interactions: [
        {
          id: 'cat-purr-speak',
          type: 'character-speak',
          targetId: 'purring-cat',
          data: { say: 'Purr purr PURRRR!' },
        },
        {
          id: 'baby-peek',
          type: 'peek-a-boo',
          targetId: 'baby',
          data: { say: 'Peek-a-boo Baby!' },
        },
        {
          id: 'hearts-collect',
          type: 'collect',
          targetId: 'purr-hearts',
          data: { item: 'heart', total: 5 },
        },
        {
          id: 'cradle-sound',
          type: 'tap-sound',
          targetId: 'cradle',
          data: { say: 'Rock rock rock...' },
        },
        {
          id: 'mouse-peek',
          type: 'peek-a-boo',
          targetId: 'hidden-mouse',
          data: { say: 'Squeak squeak!' },
        },
        {
          id: 'fire-sparkle',
          type: 'tap-sparkle',
          targetId: 'warm-fire-7',
          data: {},
        },
      ],
    },

    // ── Page 8: Woman makes a deal ──
    {
      bg: 'from-amber-500 to-slate-600',
      image: '/arthurs-world/images/cat-walked/page-8.webp',
      text: 'The Woman looked at Cat. "All right Cat. You can sit by the fire. You can have warm milk. BUT! You must catch mice. And you must purr for the Baby. Deal?"',
      elements: [
        { id: 'deal-woman', x: 30, y: 38, hotspot: true, w: 110, h: 110, z: 3 },
        { id: 'deal-cat', x: 65, y: 42, hotspot: true, w: 110, h: 100, z: 3 },
        { id: 'fire-target', x: 48, y: 58, hotspot: true, w: 100, h: 90, z: 2 },
        { id: 'mouse-catch', x: 82, y: 60, hotspot: true, w: 60, h: 60, z: 2 },
        { id: 'handshake', x: 48, y: 28, hotspot: true, w: 70, h: 70, z: 2 },
      ],
      interactions: [
        {
          id: 'woman-deal-speak',
          type: 'character-speak',
          targetId: 'deal-woman',
          data: { say: 'Catch mice AND purr for Baby. Deal?' },
        },
        {
          id: 'cat-deal-speak',
          type: 'character-speak',
          targetId: 'deal-cat',
          data: { say: 'Hmm... Deal!' },
        },
        {
          id: 'fire-color',
          type: 'tap-color',
          targetId: 'fire-target',
          data: { colors: ['#ef4444', '#f97316', '#eab308', '#dc2626', '#f59e0b'] },
        },
        {
          id: 'mouse-collect',
          type: 'collect',
          targetId: 'mouse-catch',
          data: { item: 'mouse', total: 3 },
        },
        {
          id: 'handshake-sparkle',
          type: 'tap-sparkle',
          targetId: 'handshake',
          data: {},
        },
      ],
    },

    // ── Page 9: Cat agrees but still walks alone ──
    {
      bg: 'from-slate-400 to-indigo-600',
      image: '/arthurs-world/images/cat-walked/page-9.webp',
      text: 'So Cat came inside. He sat by the warm fire. Purr purr purr. He drank warm milk. Lap lap lap. But when the moon came up? Off he went! Out into the night!',
      elements: [
        { id: 'free-cat', x: 22, y: 35, hotspot: true, w: 110, h: 110, z: 3 },
        { id: 'outdoor-path', x: 50, y: 55, hotspot: true, w: 80, h: 70, z: 1 },
        { id: 'cosy-fire-drop', x: 78, y: 50, hotspot: true, w: 100, h: 90, z: 2 },
        { id: 'paw-prints', x: 38, y: 62, hotspot: true, w: 70, h: 60, z: 2 },
        { id: 'free-stars', x: 15, y: 15, hotspot: true, w: 60, h: 60, z: 1 },
        { id: 'free-moon', x: 85, y: 12, hotspot: true, w: 80, h: 70, z: 1 },
      ],
      interactions: [
        {
          id: 'cat-drag-to-fire',
          type: 'drag-to-target',
          targetId: 'free-cat',
          data: { dropZone: { x: 78, y: 50, radius: 45 }, onDrop: 'snap' },
        },
        {
          id: 'cat-speak',
          type: 'character-speak',
          targetId: 'free-cat',
          data: { say: 'Purr purr... time to go OUT!' },
        },
        {
          id: 'paw-count',
          type: 'tap-count',
          targetId: 'paw-prints',
          data: { max: 5, label: 'paw prints' },
        },
        {
          id: 'stars-sparkle',
          type: 'tap-sparkle',
          targetId: 'free-stars',
          data: {},
        },
        {
          id: 'moon-grow',
          type: 'tap-grow',
          targetId: 'free-moon',
          data: {},
        },
      ],
    },

    // ── Page 10: The End ──
    {
      bg: 'from-indigo-400 to-amber-500',
      image: '/arthurs-world/images/cat-walked/page-10.webp',
      text: 'And that is why! Dog says "Woof!" by the door. Horse says "Neigh!" in the field. Cow says "Moo!" in the barn. But Cat? Cat sits by the fire and purrs... then walks off by himself! Because he is the Cat who walks by himself. The end!',
      elements: [
        { id: 'fireside-cat', x: 45, y: 40, hotspot: true, w: 130, h: 120, z: 3 },
        { id: 'cosy-fire-end', x: 62, y: 52, hotspot: true, w: 100, h: 90, z: 2 },
        { id: 'happy-dog-end', x: 18, y: 48, hotspot: true, w: 80, h: 80, z: 2 },
        { id: 'happy-horse-end', x: 82, y: 45, hotspot: true, w: 90, h: 80, z: 2 },
        { id: 'happy-cow-end', x: 30, y: 60, hotspot: true, w: 80, h: 70, z: 1 },
        { id: 'the-end-star', x: 50, y: 15, hotspot: true, w: 80, h: 80, z: 2 },
      ],
      interactions: [
        {
          id: 'cat-end-speak',
          type: 'character-speak',
          targetId: 'fireside-cat',
          data: { say: 'Purr purr... but I STILL walk by myself!' },
        },
        {
          id: 'fire-end-sparkle',
          type: 'tap-sparkle',
          targetId: 'cosy-fire-end',
          data: {},
        },
        {
          id: 'dog-end-speak',
          type: 'character-speak',
          targetId: 'happy-dog-end',
          data: { say: 'Woof woof! Good boy!' },
        },
        {
          id: 'horse-end-speak',
          type: 'character-speak',
          targetId: 'happy-horse-end',
          data: { say: 'Neeeigh! Clip clop!' },
        },
        {
          id: 'cow-end-speak',
          type: 'character-speak',
          targetId: 'happy-cow-end',
          data: { say: 'Moo moo MOO!' },
        },
        {
          id: 'star-end-spin',
          type: 'tap-spin',
          targetId: 'the-end-star',
          data: {},
        },
      ],
    },
  ],
};

export default function CatWalked() {
  return <StoryBook story={storyData} />;
}
