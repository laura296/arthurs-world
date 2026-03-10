import React from 'react';
import StoryBook from '../components/StoryBook';

const IMG = '/arthurs-world/images/farm-book';

/**
 * "Goodnight, Farm!" — A bedtime counting story.
 *
 * The farmer puts each group of animals to bed.
 * Counting progression: 1 → 2 → 3 → 4 → 5.
 * Tap zones are large so they work regardless of exact AI image layout.
 */
const storyData = {
  title: 'Goodnight Farm',
  audioDir: '/arthurs-world/audio/farm-book',
  pages: [
    // ── Page 1: The sun is setting ──
    {
      bg: 'from-orange-300 to-pink-400',
      image: `${IMG}/page-1.png`,
      text: 'The sun is setting on the farm. Farmer Joe yawns — time to put all the animals to bed!',
      elements: [
        { id: 'farmer', x: 50, y: 45, hotspot: true, w: 150, h: 150, z: 2 },
      ],
      interactions: [
        { id: 'farmer-wave', type: 'tap-wiggle', targetId: 'farmer', data: {} },
      ],
    },

    // ── Page 2: ONE rooster ──
    {
      bg: 'from-orange-400 to-amber-600',
      image: `${IMG}/page-2.png`,
      text: 'ONE rooster does one last cock-a-doodle-doo! Tap him to hear!',
      elements: [
        { id: 'rooster', x: 50, y: 40, hotspot: true, w: 180, h: 160, z: 2 },
      ],
      interactions: [
        { id: 'rooster-sound', type: 'tap-sound', targetId: 'rooster', data: { sfx: 'rooster', say: 'Cock-a-doodle-doo!' } },
      ],
    },

    // ── Page 3: TWO horses ──
    {
      bg: 'from-purple-300 to-indigo-400',
      image: `${IMG}/page-3.png`,
      text: 'TWO horses trot into the cozy stable. Tap each horse — one, two!',
      elements: [
        { id: 'horse1', x: 28, y: 42, hotspot: true, w: 150, h: 140, z: 2 },
        { id: 'horse2', x: 72, y: 42, hotspot: true, w: 150, h: 140, z: 2 },
      ],
      interactions: [
        { id: 'horse1-count', type: 'tap-count', targetId: 'horse1', data: { label: '1', sfx: 'horse' } },
        { id: 'horse2-count', type: 'tap-count', targetId: 'horse2', data: { label: '2', sfx: 'horse' } },
      ],
    },

    // ── Page 4: THREE piglets ──
    {
      bg: 'from-pink-300 to-rose-400',
      image: `${IMG}/page-4.png`,
      text: 'THREE little piglets snuggle in the straw. Tap each one — one, two, three!',
      elements: [
        { id: 'pig1', x: 20, y: 42, hotspot: true, w: 120, h: 120, z: 2 },
        { id: 'pig2', x: 50, y: 42, hotspot: true, w: 120, h: 120, z: 2 },
        { id: 'pig3', x: 80, y: 42, hotspot: true, w: 120, h: 120, z: 2 },
      ],
      interactions: [
        { id: 'pig1-count', type: 'tap-count', targetId: 'pig1', data: { label: '1', sfx: 'pig' } },
        { id: 'pig2-count', type: 'tap-count', targetId: 'pig2', data: { label: '2', sfx: 'pig' } },
        { id: 'pig3-count', type: 'tap-count', targetId: 'pig3', data: { label: '3', sfx: 'pig' } },
      ],
    },

    // ── Page 5: FOUR cows ──
    {
      bg: 'from-green-300 to-emerald-500',
      image: `${IMG}/page-5.png`,
      text: 'FOUR sleepy cows walk into the big red barn. Tap each cow — one, two, three, four!',
      elements: [
        { id: 'cow1', x: 14, y: 42, hotspot: true, w: 100, h: 120, z: 2 },
        { id: 'cow2', x: 38, y: 42, hotspot: true, w: 100, h: 120, z: 2 },
        { id: 'cow3', x: 62, y: 42, hotspot: true, w: 100, h: 120, z: 2 },
        { id: 'cow4', x: 86, y: 42, hotspot: true, w: 100, h: 120, z: 2 },
      ],
      interactions: [
        { id: 'cow1-count', type: 'tap-count', targetId: 'cow1', data: { label: '1', sfx: 'cow' } },
        { id: 'cow2-count', type: 'tap-count', targetId: 'cow2', data: { label: '2', sfx: 'cow' } },
        { id: 'cow3-count', type: 'tap-count', targetId: 'cow3', data: { label: '3', sfx: 'cow' } },
        { id: 'cow4-count', type: 'tap-count', targetId: 'cow4', data: { label: '4', sfx: 'cow' } },
      ],
    },

    // ── Page 6: FIVE sheep ──
    {
      bg: 'from-green-400 to-teal-500',
      image: `${IMG}/page-6.png`,
      text: 'FIVE fluffy sheep lie down on the hill. Tap each sheep — one, two, three, four, five!',
      elements: [
        { id: 'sheep1', x: 10, y: 42, hotspot: true, w: 80, h: 110, z: 2 },
        { id: 'sheep2', x: 30, y: 42, hotspot: true, w: 80, h: 110, z: 2 },
        { id: 'sheep3', x: 50, y: 42, hotspot: true, w: 80, h: 110, z: 2 },
        { id: 'sheep4', x: 70, y: 42, hotspot: true, w: 80, h: 110, z: 2 },
        { id: 'sheep5', x: 90, y: 42, hotspot: true, w: 80, h: 110, z: 2 },
      ],
      interactions: [
        { id: 'sheep1-count', type: 'tap-count', targetId: 'sheep1', data: { label: '1', sfx: 'sheep' } },
        { id: 'sheep2-count', type: 'tap-count', targetId: 'sheep2', data: { label: '2', sfx: 'sheep' } },
        { id: 'sheep3-count', type: 'tap-count', targetId: 'sheep3', data: { label: '3', sfx: 'sheep' } },
        { id: 'sheep4-count', type: 'tap-count', targetId: 'sheep4', data: { label: '4', sfx: 'sheep' } },
        { id: 'sheep5-count', type: 'tap-count', targetId: 'sheep5', data: { label: '5', sfx: 'sheep' } },
      ],
    },

    // ── Page 7: Hen and chicks ──
    {
      bg: 'from-amber-300 to-yellow-500',
      image: `${IMG}/page-7.png`,
      text: 'Mama hen tucks her little chicks under her warm wings. Goodnight, chickens!',
      elements: [
        { id: 'hen', x: 50, y: 40, hotspot: true, w: 160, h: 140, z: 2 },
        { id: 'chick-left', x: 25, y: 55, hotspot: true, w: 80, h: 80, z: 2 },
        { id: 'chick-right', x: 75, y: 55, hotspot: true, w: 80, h: 80, z: 2 },
      ],
      interactions: [
        { id: 'hen-sound', type: 'tap-sound', targetId: 'hen', data: { sfx: 'hen', say: 'Bawk bawk!' } },
        { id: 'chick-left-wiggle', type: 'tap-wiggle', targetId: 'chick-left', data: {} },
        { id: 'chick-right-wiggle', type: 'tap-wiggle', targetId: 'chick-right', data: {} },
      ],
    },

    // ── Page 8: Goodnight, Farm! ──
    {
      bg: 'from-indigo-500 to-purple-800',
      image: `${IMG}/page-8.png`,
      text: 'Shhh! The whole farm is fast asleep. Goodnight, farm! Sweet dreams!',
      elements: [
        { id: 'moon', x: 50, y: 15, hotspot: true, w: 90, h: 90, z: 1 },
        { id: 'barn', x: 50, y: 50, hotspot: true, w: 160, h: 160, z: 1 },
      ],
      interactions: [
        { id: 'moon-sparkle', type: 'tap-sparkle', targetId: 'moon', data: {} },
        { id: 'barn-sound', type: 'tap-sound', targetId: 'barn', data: { say: 'Shhh... sweet dreams!' } },
      ],
    },
  ],
};

export default function FarmBook() {
  return <StoryBook story={storyData} />;
}
