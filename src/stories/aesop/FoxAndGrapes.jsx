import React from 'react';
import StoryBook from '../../components/StoryBook';

const storyData = {
  title: 'The Fox and the Grapes',
  audioDir: '/arthurs-world/audio/fox-grapes',
  pages: [
    // ── Page 1: Hungry Fox ──
    {
      bg: 'from-green-300 to-emerald-500',
      image: '/arthurs-world/images/fox-grapes/page-1.png',
      text: 'Once upon a time, a hungry fox was walking through the woods on a sunny day.',
      elements: [
        { id: 'fox', x: 40, y: 55, hotspot: true, w: 130, h: 130, z: 2 },
        { id: 'trees', x: 80, y: 30, hotspot: true, w: 120, h: 120, z: 1 },
        { id: 'bird', x: 70, y: 20, hotspot: true, w: 70, h: 70, z: 1 },
        { id: 'mushroom', x: 15, y: 70, hotspot: true, w: 60, h: 60, z: 1 },
      ],
      interactions: [
        { id: 'fox-sound', type: 'tap-sound', targetId: 'fox', data: { say: 'I am SO hungry!' } },
        { id: 'fox-wiggle', type: 'tap-wiggle', targetId: 'fox', data: {} },
        { id: 'bird-jump', type: 'tap-jump', targetId: 'bird', data: {} },
        { id: 'mushroom-color', type: 'tap-color', targetId: 'mushroom', data: { colors: ['#ef4444', '#fbbf24', '#8b5cf6'] } },
      ],
    },

    // ── Page 2: Spots Grapes ──
    {
      bg: 'from-purple-300 to-green-400',
      image: '/arthurs-world/images/fox-grapes/page-2.png',
      text: 'The fox saw big, juicy purple grapes hanging high up on a vine! Yummy!',
      elements: [
        { id: 'grapes', x: 50, y: 20, hotspot: true, w: 120, h: 120, z: 2 },
        { id: 'vine', x: 50, y: 35, hotspot: true, w: 140, h: 100, z: 1 },
        { id: 'fox-look', x: 40, y: 60, hotspot: true, w: 130, h: 130, z: 2 },
        { id: 'sparkle', x: 55, y: 15, hotspot: true, w: 60, h: 60, z: 2 },
      ],
      interactions: [
        { id: 'grapes-sparkle', type: 'tap-sparkle', targetId: 'grapes', data: {} },
        { id: 'grapes-color', type: 'tap-color', targetId: 'grapes', data: { colors: ['#7c3aed', '#a855f7', '#6d28d9'] } },
        { id: 'fox-sound', type: 'tap-sound', targetId: 'fox-look', data: { say: 'Ooh! Those grapes look yummy!' } },
        { id: 'sparkle-spin', type: 'tap-spin', targetId: 'sparkle', data: {} },
      ],
    },

    // ── Page 3: First Jump ──
    {
      bg: 'from-sky-300 to-green-400',
      image: '/arthurs-world/images/fox-grapes/page-3.png',
      text: 'The fox jumped up as high as he could! But he could not reach the grapes!',
      elements: [
        { id: 'fox-jump', x: 45, y: 40, hotspot: true, w: 130, h: 130, z: 2 },
        { id: 'grapes-high', x: 50, y: 12, hotspot: true, w: 110, h: 100, z: 2 },
        { id: 'dust', x: 45, y: 70, hotspot: true, w: 80, h: 60, z: 1 },
        { id: 'leaf', x: 75, y: 55, hotspot: true, w: 60, h: 60, z: 1 },
      ],
      interactions: [
        { id: 'fox-jump-action', type: 'tap-jump', targetId: 'fox-jump', data: {} },
        { id: 'fox-sound', type: 'tap-sound', targetId: 'fox-jump', data: { say: 'Almost got them!' } },
        { id: 'grapes-wiggle', type: 'tap-wiggle', targetId: 'grapes-high', data: {} },
        { id: 'dust-spin', type: 'tap-spin', targetId: 'dust', data: {} },
      ],
    },

    // ── Page 4: Second Jump ──
    {
      bg: 'from-amber-300 to-green-400',
      image: '/arthurs-world/images/fox-grapes/page-4.png',
      text: 'He tried again! He jumped and jumped! But the grapes were just too high up!',
      elements: [
        { id: 'fox-try', x: 45, y: 38, hotspot: true, w: 130, h: 130, z: 2 },
        { id: 'grapes-still-high', x: 50, y: 10, hotspot: true, w: 110, h: 100, z: 2 },
        { id: 'sweat', x: 55, y: 35, hotspot: true, w: 50, h: 50, z: 3 },
        { id: 'butterfly', x: 80, y: 40, hotspot: true, w: 60, h: 60, z: 1 },
      ],
      interactions: [
        { id: 'fox-jump2', type: 'tap-jump', targetId: 'fox-try', data: {} },
        { id: 'fox-shake', type: 'tap-shake', targetId: 'fox-try', data: {} },
        { id: 'sweat-grow', type: 'tap-grow', targetId: 'sweat', data: {} },
        { id: 'butterfly-spin', type: 'tap-spin', targetId: 'butterfly', data: {} },
      ],
    },

    // ── Page 5: Third Jump ──
    {
      bg: 'from-orange-300 to-red-400',
      image: '/arthurs-world/images/fox-grapes/page-5.png',
      text: 'One more try! The fox jumped with ALL his might! But he still could not reach them!',
      elements: [
        { id: 'fox-big-jump', x: 45, y: 35, hotspot: true, w: 140, h: 140, z: 2 },
        { id: 'grapes-far', x: 50, y: 8, hotspot: true, w: 110, h: 100, z: 2 },
        { id: 'paws', x: 50, y: 25, hotspot: true, w: 80, h: 60, z: 3 },
        { id: 'impact-star', x: 40, y: 65, hotspot: true, w: 80, h: 80, z: 1 },
      ],
      interactions: [
        { id: 'fox-jump3', type: 'tap-jump', targetId: 'fox-big-jump', data: {} },
        { id: 'fox-sound', type: 'tap-sound', targetId: 'fox-big-jump', data: { say: 'So close!' } },
        { id: 'grapes-shake', type: 'tap-shake', targetId: 'grapes-far', data: {} },
        { id: 'star-sparkle', type: 'tap-sparkle', targetId: 'impact-star', data: {} },
      ],
    },

    // ── Page 6: Fox Gives Up ──
    {
      bg: 'from-amber-300 to-orange-400',
      image: '/arthurs-world/images/fox-grapes/page-6.png',
      text: 'The fox was tired and cross. "Those grapes are probably sour anyway!" he said.',
      elements: [
        { id: 'fox-grumpy', x: 45, y: 55, hotspot: true, w: 130, h: 130, z: 2 },
        { id: 'grapes-above', x: 55, y: 15, hotspot: true, w: 100, h: 90, z: 2 },
        { id: 'hmph', x: 30, y: 35, hotspot: true, w: 80, h: 70, z: 2 },
        { id: 'snail', x: 80, y: 70, hotspot: true, w: 55, h: 55, z: 1 },
      ],
      interactions: [
        { id: 'fox-sound', type: 'tap-sound', targetId: 'fox-grumpy', data: { say: 'Hmph! I bet they are sour!' } },
        { id: 'fox-shake', type: 'tap-shake', targetId: 'fox-grumpy', data: {} },
        { id: 'hmph-grow', type: 'tap-grow', targetId: 'hmph', data: {} },
        { id: 'snail-wiggle', type: 'tap-wiggle', targetId: 'snail', data: {} },
      ],
    },

    // ── Page 7: Fox Walks Away ──
    {
      bg: 'from-green-300 to-teal-400',
      image: '/arthurs-world/images/fox-grapes/page-7.png',
      text: 'The fox walked away with his nose in the air. But a little bird saw what happened!',
      elements: [
        { id: 'fox-walk', x: 30, y: 55, hotspot: true, w: 120, h: 120, z: 2 },
        { id: 'bird-watch', x: 70, y: 25, hotspot: true, w: 80, h: 80, z: 2 },
        { id: 'grapes-vine', x: 65, y: 12, hotspot: true, w: 100, h: 90, z: 1 },
        { id: 'path', x: 40, y: 72, hotspot: true, w: 130, h: 60, z: 1 },
      ],
      interactions: [
        { id: 'fox-wiggle', type: 'tap-wiggle', targetId: 'fox-walk', data: {} },
        { id: 'bird-sound', type: 'tap-sound', targetId: 'bird-watch', data: { say: 'They are not sour at all!' } },
        { id: 'grapes-sparkle', type: 'tap-sparkle', targetId: 'grapes-vine', data: {} },
        { id: 'bird-jump', type: 'tap-jump', targetId: 'bird-watch', data: {} },
      ],
    },

    // ── Page 8: The Lesson ──
    {
      bg: 'from-yellow-300 to-amber-400',
      image: '/arthurs-world/images/fox-grapes/page-8.png',
      text: 'Sometimes when we cannot get what we want, we pretend we never wanted it! The end!',
      elements: [
        { id: 'fox-think', x: 45, y: 48, hotspot: true, w: 130, h: 130, z: 2 },
        { id: 'thought-bubble', x: 55, y: 18, hotspot: true, w: 100, h: 80, z: 2 },
        { id: 'star-left', x: 15, y: 25, hotspot: true, w: 70, h: 70, z: 1 },
        { id: 'star-right', x: 85, y: 25, hotspot: true, w: 70, h: 70, z: 1 },
        { id: 'heart', x: 50, y: 75, hotspot: true, w: 80, h: 80, z: 1 },
      ],
      interactions: [
        { id: 'fox-sparkle', type: 'tap-sparkle', targetId: 'fox-think', data: {} },
        { id: 'bubble-spin', type: 'tap-spin', targetId: 'thought-bubble', data: {} },
        { id: 'star-left-spin', type: 'tap-spin', targetId: 'star-left', data: {} },
        { id: 'star-right-color', type: 'tap-color', targetId: 'star-right', data: { colors: ['#fbbf24', '#f0abfc', '#60a5fa'] } },
        { id: 'heart-sound', type: 'tap-sound', targetId: 'heart', data: { say: 'The End!' } },
      ],
    },
  ],
};

export default function FoxAndGrapes() {
  return <StoryBook story={storyData} />;
}
