import React from 'react';
import StoryBook from '../components/StoryBook';

const storyData = {
  title: 'The Cat That Walked by Himself',
  audioDir: '/arthurs-world/audio/cat-walked',
  pages: [
    // ── Page 1: All animals were wild ──
    {
      bg: 'from-slate-500 to-indigo-700',
      image: '/arthurs-world/images/cat-walked/page-1.png',
      text: 'Once upon a time, all the animals were wild. The wildest of all was the Cat, who walked by himself.',
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
          id: 'cat-walk-wiggle',
          type: 'tap-wiggle',
          targetId: 'wild-cat',
          data: {},
        },
        {
          id: 'cat-meow-sound',
          type: 'tap-sound',
          targetId: 'wild-cat',
          data: { say: 'I walk by myself!' },
        },
        {
          id: 'dog-shake',
          type: 'tap-shake',
          targetId: 'wild-dog',
          data: {},
        },
        {
          id: 'horse-grow',
          type: 'tap-grow',
          targetId: 'wild-horse',
          data: {},
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
      image: '/arthurs-world/images/cat-walked/page-2.png',
      text: 'The Woman made a warm cave home. She said to the Dog \u2014 "Come be my friend!"',
      elements: [
        { id: 'woman', x: 35, y: 38, hotspot: true, w: 120, h: 120, z: 3 },
        { id: 'cave-fire', x: 55, y: 52, hotspot: true, w: 100, h: 90, z: 2 },
        { id: 'waiting-dog', x: 78, y: 42, hotspot: true, w: 100, h: 90, z: 2 },
        { id: 'cave-entrance', x: 20, y: 30, hotspot: true, w: 100, h: 100, z: 1 },
        { id: 'hidden-bone', x: 88, y: 65, hotspot: true, w: 60, h: 50, z: 1 },
      ],
      interactions: [
        {
          id: 'woman-invite-sound',
          type: 'tap-sound',
          targetId: 'woman',
          data: { say: 'Come be my friend!' },
        },
        {
          id: 'fire-sparkle',
          type: 'tap-sparkle',
          targetId: 'cave-fire',
          data: {},
        },
        {
          id: 'dog-wiggle-excited',
          type: 'tap-wiggle',
          targetId: 'waiting-dog',
          data: {},
        },
        {
          id: 'bone-reveal',
          type: 'tap-reveal',
          targetId: 'hidden-bone',
          data: { content: 'A bone!' },
        },
        {
          id: 'cave-color',
          type: 'tap-color',
          targetId: 'cave-entrance',
          data: { colors: ['#78716c', '#a8a29e', '#d6d3d1', '#57534e', '#44403c'] },
        },
      ],
    },

    // ── Page 3: Dog becomes tame ──
    {
      bg: 'from-amber-600 to-stone-700',
      image: '/arthurs-world/images/cat-walked/page-3.png',
      text: 'The Dog said "Yes! I\'ll guard the cave!" So the Dog became tame and got warm food.',
      elements: [
        { id: 'happy-dog', x: 45, y: 38, hotspot: true, w: 130, h: 120, z: 3 },
        { id: 'dog-bowl', x: 60, y: 58, hotspot: true, w: 80, h: 70, z: 2 },
        { id: 'guard-shield', x: 25, y: 35, hotspot: true, w: 90, h: 80, z: 2 },
        { id: 'warm-fire-3', x: 80, y: 50, hotspot: true, w: 80, h: 80, z: 1 },
        { id: 'happy-heart', x: 52, y: 22, hotspot: true, w: 60, h: 60, z: 2 },
      ],
      interactions: [
        {
          id: 'dog-bark-sound',
          type: 'tap-sound',
          targetId: 'happy-dog',
          data: { say: 'Woof woof! I\'ll guard you!' },
        },
        {
          id: 'dog-happy-spin',
          type: 'tap-spin',
          targetId: 'happy-dog',
          data: {},
        },
        {
          id: 'bowl-count',
          type: 'tap-count',
          targetId: 'dog-bowl',
          data: { max: 3 },
        },
        {
          id: 'heart-grow',
          type: 'tap-grow',
          targetId: 'happy-heart',
          data: {},
        },
        {
          id: 'fire-wiggle',
          type: 'tap-wiggle',
          targetId: 'warm-fire-3',
          data: {},
        },
      ],
    },

    // ── Page 4: Horse becomes tame ──
    {
      bg: 'from-stone-500 to-amber-700',
      image: '/arthurs-world/images/cat-walked/page-4.png',
      text: 'The Horse came too! "I\'ll carry things for you!" The Horse became tame and got sweet hay.',
      elements: [
        { id: 'tame-horse', x: 50, y: 35, hotspot: true, w: 140, h: 130, z: 3 },
        { id: 'hay-bale', x: 75, y: 55, hotspot: true, w: 90, h: 80, z: 2 },
        { id: 'woman-happy', x: 22, y: 42, hotspot: true, w: 100, h: 100, z: 2 },
        { id: 'horseshoe', x: 38, y: 60, hotspot: true, w: 70, h: 60, z: 1 },
        { id: 'sparkle-star', x: 85, y: 18, hotspot: true, w: 50, h: 50, z: 1 },
      ],
      interactions: [
        {
          id: 'horse-neigh-sound',
          type: 'tap-sound',
          targetId: 'tame-horse',
          data: { say: 'Neigh! I\'ll help you!', sfx: 'horse' },
        },
        {
          id: 'horse-shake',
          type: 'tap-shake',
          targetId: 'tame-horse',
          data: {},
        },
        {
          id: 'hay-sparkle',
          type: 'tap-sparkle',
          targetId: 'hay-bale',
          data: {},
        },
        {
          id: 'horseshoe-spin',
          type: 'tap-spin',
          targetId: 'horseshoe',
          data: {},
        },
        {
          id: 'star-reveal',
          type: 'tap-reveal',
          targetId: 'sparkle-star',
          data: { content: 'Good horse!' },
        },
      ],
    },

    // ── Page 5: Cow becomes tame ──
    {
      bg: 'from-slate-400 to-stone-600',
      image: '/arthurs-world/images/cat-walked/page-5.png',
      text: 'The Cow came next! "I\'ll give you milk!" The Cow became tame and got a cosy barn.',
      elements: [
        { id: 'tame-cow', x: 48, y: 38, hotspot: true, w: 130, h: 120, z: 3 },
        { id: 'milk-glass', x: 72, y: 55, hotspot: true, w: 80, h: 80, z: 2 },
        { id: 'cosy-barn', x: 20, y: 30, hotspot: true, w: 100, h: 90, z: 1 },
        { id: 'bell', x: 55, y: 22, hotspot: true, w: 70, h: 60, z: 2 },
        { id: 'hidden-flower', x: 88, y: 62, hotspot: true, w: 50, h: 50, z: 1 },
      ],
      interactions: [
        {
          id: 'cow-moo-sound',
          type: 'tap-sound',
          targetId: 'tame-cow',
          data: { say: 'Moo! Here\'s some milk!', sfx: 'cow' },
        },
        {
          id: 'cow-wiggle',
          type: 'tap-wiggle',
          targetId: 'tame-cow',
          data: {},
        },
        {
          id: 'milk-count',
          type: 'tap-count',
          targetId: 'milk-glass',
          data: { max: 4 },
        },
        {
          id: 'bell-shake',
          type: 'tap-shake',
          targetId: 'bell',
          data: {},
        },
        {
          id: 'flower-reveal',
          type: 'tap-reveal',
          targetId: 'hidden-flower',
          data: { content: 'Pretty!' },
        },
      ],
    },

    // ── Page 6: Cat refuses ──
    {
      bg: 'from-indigo-600 to-slate-800',
      image: '/arthurs-world/images/cat-walked/page-6.png',
      text: 'But the Cat said "I am the Cat who walks by himself! I don\'t need anyone!"',
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
          id: 'cat-proud-sound',
          type: 'tap-sound',
          targetId: 'proud-cat',
          data: { say: 'I walk by myself!' },
        },
        {
          id: 'cat-spin-away',
          type: 'tap-spin',
          targetId: 'proud-cat',
          data: {},
        },
        {
          id: 'huff-hide',
          type: 'tap-hide',
          targetId: 'nose-up',
          data: {},
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
      image: '/arthurs-world/images/cat-walked/page-7.png',
      text: 'Then the Cat heard the Baby crying. He crept in and purred and purred. The Baby smiled!',
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
          id: 'cat-purr-sound',
          type: 'tap-sound',
          targetId: 'purring-cat',
          data: { say: 'Purrrr purrrr purrrr' },
        },
        {
          id: 'cat-purr-animate',
          type: 'tap-animate',
          targetId: 'purring-cat',
          data: { animation: 'animate-wiggle', duration: 800 },
        },
        {
          id: 'baby-swap-smile',
          type: 'tap-swap',
          targetId: 'baby',
          data: { altContent: 'Happy!' },
        },
        {
          id: 'hearts-sparkle',
          type: 'tap-sparkle',
          targetId: 'purr-hearts',
          data: {},
        },
        {
          id: 'hearts-grow',
          type: 'tap-grow',
          targetId: 'purr-hearts',
          data: {},
        },
        {
          id: 'mouse-reveal',
          type: 'tap-reveal',
          targetId: 'hidden-mouse',
          data: { content: 'Squeak!' },
        },
        {
          id: 'fire-wiggle',
          type: 'tap-wiggle',
          targetId: 'warm-fire-7',
          data: {},
        },
      ],
    },

    // ── Page 8: Woman makes a deal ──
    {
      bg: 'from-amber-500 to-slate-600',
      image: '/arthurs-world/images/cat-walked/page-8.png',
      text: 'The Woman said "You may come by the fire. But you must catch mice AND purr for the Baby."',
      elements: [
        { id: 'deal-woman', x: 30, y: 38, hotspot: true, w: 110, h: 110, z: 3 },
        { id: 'deal-cat', x: 65, y: 42, hotspot: true, w: 110, h: 100, z: 3 },
        { id: 'fire-target', x: 48, y: 58, hotspot: true, w: 100, h: 90, z: 2 },
        { id: 'mouse-catch', x: 82, y: 60, hotspot: true, w: 60, h: 60, z: 2 },
        { id: 'handshake', x: 48, y: 28, hotspot: true, w: 70, h: 70, z: 2 },
      ],
      interactions: [
        {
          id: 'woman-deal-sound',
          type: 'tap-sound',
          targetId: 'deal-woman',
          data: { say: 'You must catch mice and purr for the Baby!' },
        },
        {
          id: 'cat-thinking-animate',
          type: 'tap-animate',
          targetId: 'deal-cat',
          data: { animation: 'animate-bounce', duration: 800 },
        },
        {
          id: 'fire-color',
          type: 'tap-color',
          targetId: 'fire-target',
          data: { colors: ['#ef4444', '#f97316', '#eab308', '#dc2626', '#f59e0b'] },
        },
        {
          id: 'mouse-wiggle',
          type: 'tap-wiggle',
          targetId: 'mouse-catch',
          data: {},
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
      image: '/arthurs-world/images/cat-walked/page-9.png',
      text: 'The Cat agreed! But he STILL walks by himself whenever he wants. That\'s just how cats are!',
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
          id: 'paw-count',
          type: 'tap-count',
          targetId: 'paw-prints',
          data: { max: 5 },
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
        {
          id: 'path-shake',
          type: 'tap-shake',
          targetId: 'outdoor-path',
          data: {},
        },
      ],
    },

    // ── Page 10: The End ──
    {
      bg: 'from-indigo-400 to-amber-500',
      image: '/arthurs-world/images/cat-walked/page-10.png',
      text: 'And that is why cats sit by the fire but still go out alone! The end!',
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
          id: 'cat-end-sound',
          type: 'tap-sound',
          targetId: 'fireside-cat',
          data: { say: 'Purr... but I still walk by myself!' },
        },
        {
          id: 'cat-end-animate',
          type: 'tap-animate',
          targetId: 'fireside-cat',
          data: { animation: 'animate-dance', duration: 1000 },
        },
        {
          id: 'fire-end-sparkle',
          type: 'tap-sparkle',
          targetId: 'cosy-fire-end',
          data: {},
        },
        {
          id: 'dog-end-wiggle',
          type: 'tap-wiggle',
          targetId: 'happy-dog-end',
          data: {},
        },
        {
          id: 'horse-end-swap',
          type: 'tap-swap',
          targetId: 'happy-horse-end',
          data: { altContent: 'Happy!' },
        },
        {
          id: 'cow-end-shake',
          type: 'tap-shake',
          targetId: 'happy-cow-end',
          data: {},
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
