import React from 'react';
import StoryBook from '../../components/StoryBook';

const storyData = {
  title: 'Town Mouse and Country Mouse',
  audioDir: '/arthurs-world/audio/town-country-mouse',
  pages: [
    // ── Page 1: Country Mouse ──
    {
      bg: 'from-green-300 to-amber-400',
      image: '/arthurs-world/images/town-country-mouse/page-1.png',
      text: 'Once upon a time, a little country mouse lived in a cosy hole under a big oak tree.',
      elements: [
        { id: 'country-mouse', x: 45, y: 55, hotspot: true, w: 110, h: 110, z: 2 },
        { id: 'oak-tree', x: 50, y: 20, hotspot: true, w: 140, h: 130, z: 1 },
        { id: 'mouse-hole', x: 45, y: 70, hotspot: true, w: 90, h: 80, z: 1 },
        { id: 'ladybird', x: 80, y: 60, hotspot: true, w: 50, h: 50, z: 1 },
        { id: 'wheat', x: 15, y: 55, hotspot: true, w: 70, h: 90, z: 1 },
      ],
      interactions: [
        { id: 'mouse-sound', type: 'tap-sound', targetId: 'country-mouse', data: { say: 'I love my little home!' } },
        { id: 'mouse-wiggle', type: 'tap-wiggle', targetId: 'country-mouse', data: {} },
        { id: 'tree-shake', type: 'tap-shake', targetId: 'oak-tree', data: {} },
        { id: 'ladybird-jump', type: 'tap-jump', targetId: 'ladybird', data: {} },
        { id: 'wheat-wiggle', type: 'tap-wiggle', targetId: 'wheat', data: {} },
      ],
    },

    // ── Page 2: Town Mouse Visits ──
    {
      bg: 'from-amber-200 to-green-400',
      image: '/arthurs-world/images/town-country-mouse/page-2.png',
      text: 'One day, his cousin the town mouse came to visit! "Hello cousin!" he said.',
      elements: [
        { id: 'town-mouse', x: 60, y: 48, hotspot: true, w: 110, h: 110, z: 2 },
        { id: 'country-mouse2', x: 35, y: 52, hotspot: true, w: 110, h: 110, z: 2 },
        { id: 'suitcase', x: 72, y: 65, hotspot: true, w: 80, h: 80, z: 2 },
        { id: 'flower', x: 15, y: 60, hotspot: true, w: 70, h: 70, z: 1 },
      ],
      interactions: [
        { id: 'town-sound', type: 'tap-sound', targetId: 'town-mouse', data: { say: 'Hello cousin! I am from the big city!' } },
        { id: 'country-sound', type: 'tap-sound', targetId: 'country-mouse2', data: { say: 'Welcome! Come inside!' } },
        { id: 'suitcase-wiggle', type: 'tap-wiggle', targetId: 'suitcase', data: {} },
        { id: 'flower-color', type: 'tap-color', targetId: 'flower', data: { colors: ['#f472b6', '#fbbf24', '#a78bfa'] } },
      ],
    },

    // ── Page 3: Simple Food ──
    {
      bg: 'from-amber-300 to-orange-300',
      image: '/arthurs-world/images/town-country-mouse/page-3.png',
      text: 'Country mouse served seeds and berries. "Is this ALL you eat?" said town mouse.',
      elements: [
        { id: 'seeds', x: 40, y: 58, hotspot: true, w: 80, h: 70, z: 2 },
        { id: 'berries', x: 55, y: 55, hotspot: true, w: 80, h: 70, z: 2 },
        { id: 'town-mouse-frown', x: 65, y: 40, hotspot: true, w: 110, h: 110, z: 2 },
        { id: 'country-mouse-proud', x: 30, y: 42, hotspot: true, w: 110, h: 110, z: 2 },
      ],
      interactions: [
        { id: 'seeds-grow', type: 'tap-grow', targetId: 'seeds', data: {} },
        { id: 'berries-color', type: 'tap-color', targetId: 'berries', data: { colors: ['#ef4444', '#7c3aed', '#2563eb'] } },
        { id: 'town-sound', type: 'tap-sound', targetId: 'town-mouse-frown', data: { say: 'Come to my house! The food is much better!' } },
        { id: 'country-wiggle', type: 'tap-wiggle', targetId: 'country-mouse-proud', data: {} },
      ],
    },

    // ── Page 4: The Big City ──
    {
      bg: 'from-blue-300 to-purple-500',
      image: '/arthurs-world/images/town-country-mouse/page-4.png',
      text: 'They went to the big city! Country mouse had never seen such tall buildings!',
      elements: [
        { id: 'buildings', x: 50, y: 25, hotspot: true, w: 160, h: 140, z: 1 },
        { id: 'both-mice', x: 45, y: 65, hotspot: true, w: 120, h: 100, z: 2 },
        { id: 'car', x: 80, y: 68, hotspot: true, w: 90, h: 70, z: 2 },
        { id: 'street-light', x: 15, y: 35, hotspot: true, w: 60, h: 100, z: 1 },
      ],
      interactions: [
        { id: 'buildings-sparkle', type: 'tap-sparkle', targetId: 'buildings', data: {} },
        { id: 'mice-sound', type: 'tap-sound', targetId: 'both-mice', data: { say: 'WOW! Everything is so big!' } },
        { id: 'car-wiggle', type: 'tap-wiggle', targetId: 'car', data: {} },
        { id: 'light-color', type: 'tap-color', targetId: 'street-light', data: { colors: ['#fbbf24', '#ef4444', '#22c55e'] } },
      ],
    },

    // ── Page 5: Fancy Feast ──
    {
      bg: 'from-amber-300 to-rose-400',
      image: '/arthurs-world/images/town-country-mouse/page-5.png',
      text: 'The town house had amazing food! Cheese, cake, chocolate! Country mouse was amazed!',
      elements: [
        { id: 'cheese', x: 30, y: 50, hotspot: true, w: 90, h: 90, z: 2 },
        { id: 'cake', x: 55, y: 45, hotspot: true, w: 100, h: 100, z: 2 },
        { id: 'chocolate', x: 75, y: 55, hotspot: true, w: 80, h: 80, z: 2 },
        { id: 'country-mouse-wow', x: 45, y: 68, hotspot: true, w: 100, h: 100, z: 2 },
      ],
      interactions: [
        { id: 'cheese-sparkle', type: 'tap-sparkle', targetId: 'cheese', data: {} },
        { id: 'cake-grow', type: 'tap-grow', targetId: 'cake', data: {} },
        { id: 'chocolate-color', type: 'tap-color', targetId: 'chocolate', data: { colors: ['#92400e', '#78350f', '#451a03'] } },
        { id: 'mouse-sound', type: 'tap-sound', targetId: 'country-mouse-wow', data: { say: 'YUM! This is amazing!' } },
      ],
    },

    // ── Page 6: The Cat! ──
    {
      bg: 'from-gray-500 to-red-600',
      image: '/arthurs-world/images/town-country-mouse/page-6.png',
      text: 'Suddenly — MEOW! A big scary cat jumped out! The mice ran for their lives!',
      elements: [
        { id: 'cat', x: 50, y: 40, hotspot: true, w: 150, h: 150, z: 2 },
        { id: 'mouse-run1', x: 25, y: 65, hotspot: true, w: 80, h: 80, z: 2 },
        { id: 'mouse-run2', x: 75, y: 62, hotspot: true, w: 80, h: 80, z: 2 },
        { id: 'meow-text', x: 55, y: 15, hotspot: true, w: 90, h: 70, z: 2 },
      ],
      interactions: [
        { id: 'cat-sound', type: 'tap-sound', targetId: 'cat', data: { say: 'MEOW!' } },
        { id: 'cat-shake', type: 'tap-shake', targetId: 'cat', data: {} },
        { id: 'mouse1-jump', type: 'tap-jump', targetId: 'mouse-run1', data: {} },
        { id: 'mouse2-jump', type: 'tap-jump', targetId: 'mouse-run2', data: {} },
        { id: 'meow-grow', type: 'tap-grow', targetId: 'meow-text', data: {} },
      ],
    },

    // ── Page 7: Too Scary! ──
    {
      bg: 'from-amber-300 to-orange-400',
      image: '/arthurs-world/images/town-country-mouse/page-7.png',
      text: 'They hid in a tiny crack in the wall! "That was TOO scary!" said country mouse.',
      elements: [
        { id: 'crack', x: 50, y: 50, hotspot: true, w: 100, h: 120, z: 1 },
        { id: 'mice-hiding', x: 50, y: 55, hotspot: true, w: 100, h: 90, z: 2 },
        { id: 'cat-shadow', x: 80, y: 45, hotspot: true, w: 100, h: 100, z: 1 },
        { id: 'shaking-line', x: 35, y: 40, hotspot: true, w: 60, h: 60, z: 2 },
      ],
      interactions: [
        { id: 'mice-sound', type: 'tap-sound', targetId: 'mice-hiding', data: { say: 'That was too scary!' } },
        { id: 'mice-shake', type: 'tap-shake', targetId: 'mice-hiding', data: {} },
        { id: 'shadow-wiggle', type: 'tap-wiggle', targetId: 'cat-shadow', data: {} },
        { id: 'shake-grow', type: 'tap-grow', targetId: 'shaking-line', data: {} },
      ],
    },

    // ── Page 8: Home Sweet Home ──
    {
      bg: 'from-green-300 to-amber-300',
      image: '/arthurs-world/images/town-country-mouse/page-8.png',
      text: 'Country mouse went home. "Simple food and a safe home is better than fancy food and danger!" The end!',
      elements: [
        { id: 'country-mouse-home', x: 45, y: 50, hotspot: true, w: 120, h: 120, z: 2 },
        { id: 'cosy-hole', x: 45, y: 68, hotspot: true, w: 100, h: 80, z: 1 },
        { id: 'oak-tree2', x: 50, y: 20, hotspot: true, w: 130, h: 120, z: 1 },
        { id: 'heart', x: 50, y: 12, hotspot: true, w: 80, h: 70, z: 2 },
        { id: 'star', x: 80, y: 18, hotspot: true, w: 60, h: 60, z: 1 },
      ],
      interactions: [
        { id: 'mouse-sound', type: 'tap-sound', targetId: 'country-mouse-home', data: { say: 'Home sweet home!' } },
        { id: 'mouse-sparkle', type: 'tap-sparkle', targetId: 'country-mouse-home', data: {} },
        { id: 'hole-sparkle', type: 'tap-sparkle', targetId: 'cosy-hole', data: {} },
        { id: 'heart-color', type: 'tap-color', targetId: 'heart', data: { colors: ['#f43f5e', '#ec4899', '#f472b6'] } },
        { id: 'star-spin', type: 'tap-spin', targetId: 'star', data: {} },
      ],
    },
  ],
};

export default function TownMouseCountryMouse() {
  return <StoryBook story={storyData} />;
}
