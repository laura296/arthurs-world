import React from 'react';
import StoryBook from '../../components/StoryBook';

const storyData = {
  title: 'The Tortoise and the Hare',
  audioDir: '/arthurs-world/audio/tortoise-hare',
  pages: [
    // ── Page 1: Introduction ──
    {
      bg: 'from-green-300 to-emerald-500',
      image: '/arthurs-world/images/tortoise-hare/page-1.png',
      text: 'Once upon a time, a speedy hare loved to show off how fast he could run!',
      elements: [
        { id: 'hare', x: 65, y: 45, hotspot: true, w: 130, h: 130, z: 2 },
        { id: 'tortoise', x: 25, y: 60, hotspot: true, w: 120, h: 120, z: 2 },
        { id: 'tree', x: 85, y: 30, hotspot: true, w: 100, h: 100, z: 1 },
        { id: 'flowers', x: 15, y: 72, hotspot: true, w: 80, h: 80, z: 1 },
      ],
      interactions: [
        { id: 'hare-sound', type: 'tap-sound', targetId: 'hare', data: { say: 'I am the fastest!' } },
        { id: 'hare-jump', type: 'tap-jump', targetId: 'hare', data: {} },
        { id: 'tortoise-wiggle', type: 'tap-wiggle', targetId: 'tortoise', data: {} },
        { id: 'tree-shake', type: 'tap-shake', targetId: 'tree', data: {} },
        { id: 'flowers-color', type: 'tap-color', targetId: 'flowers', data: { colors: ['#f472b6', '#fbbf24', '#a78bfa'] } },
      ],
    },

    // ── Page 2: The Challenge ──
    {
      bg: 'from-amber-200 to-orange-400',
      image: '/arthurs-world/images/tortoise-hare/page-2.png',
      text: 'The little tortoise said, "I bet I can beat you in a race!" The hare laughed and laughed!',
      elements: [
        { id: 'tortoise-brave', x: 40, y: 55, hotspot: true, w: 120, h: 120, z: 2 },
        { id: 'hare-laugh', x: 65, y: 40, hotspot: true, w: 130, h: 130, z: 2 },
        { id: 'signpost', x: 85, y: 45, hotspot: true, w: 90, h: 90, z: 1 },
        { id: 'butterfly', x: 20, y: 25, hotspot: true, w: 70, h: 70, z: 1 },
      ],
      interactions: [
        { id: 'tortoise-sound', type: 'tap-sound', targetId: 'tortoise-brave', data: { say: 'I can do it!' } },
        { id: 'hare-laugh-shake', type: 'tap-shake', targetId: 'hare-laugh', data: {} },
        { id: 'signpost-wiggle', type: 'tap-wiggle', targetId: 'signpost', data: {} },
        { id: 'butterfly-spin', type: 'tap-spin', targetId: 'butterfly', data: {} },
      ],
    },

    // ── Page 3: The Race Begins ──
    {
      bg: 'from-sky-300 to-green-400',
      image: '/arthurs-world/images/tortoise-hare/page-3.png',
      text: 'Ready, set, GO! The hare zoomed ahead! The tortoise walked slowly, one step at a time.',
      elements: [
        { id: 'hare-run', x: 75, y: 45, hotspot: true, w: 130, h: 130, z: 2 },
        { id: 'tortoise-walk', x: 20, y: 60, hotspot: true, w: 110, h: 110, z: 2 },
        { id: 'start-line', x: 10, y: 70, hotspot: true, w: 100, h: 80, z: 1 },
        { id: 'dust-cloud', x: 60, y: 65, hotspot: true, w: 80, h: 80, z: 1 },
      ],
      interactions: [
        { id: 'hare-run-animate', type: 'tap-animate', targetId: 'hare-run', data: { animation: 'animate-dance', duration: 800 } },
        { id: 'tortoise-walk-wiggle', type: 'tap-wiggle', targetId: 'tortoise-walk', data: {} },
        { id: 'start-sparkle', type: 'tap-sparkle', targetId: 'start-line', data: {} },
        { id: 'dust-spin', type: 'tap-spin', targetId: 'dust-cloud', data: {} },
      ],
    },

    // ── Page 4: The Hare Naps ──
    {
      bg: 'from-green-400 to-teal-500',
      image: '/arthurs-world/images/tortoise-hare/page-4.png',
      text: 'The hare was SO far ahead that he lay down under a tree. He fell fast asleep! Zzzzz...',
      elements: [
        { id: 'hare-sleep', x: 55, y: 55, hotspot: true, w: 140, h: 140, z: 2 },
        { id: 'zzz', x: 65, y: 30, hotspot: true, w: 80, h: 80, z: 2 },
        { id: 'shady-tree', x: 50, y: 20, hotspot: true, w: 130, h: 130, z: 1 },
        { id: 'bird', x: 40, y: 15, hotspot: true, w: 70, h: 70, z: 1 },
      ],
      interactions: [
        { id: 'hare-sleep-sound', type: 'tap-sound', targetId: 'hare-sleep', data: { say: 'Zzzzzzz' } },
        { id: 'zzz-grow', type: 'tap-grow', targetId: 'zzz', data: {} },
        { id: 'tree-shake', type: 'tap-shake', targetId: 'shady-tree', data: {} },
        { id: 'bird-jump', type: 'tap-jump', targetId: 'bird', data: {} },
      ],
    },

    // ── Page 5: Tortoise Keeps Going ──
    {
      bg: 'from-amber-300 to-green-400',
      image: '/arthurs-world/images/tortoise-hare/page-5.png',
      text: 'The tortoise kept going — slow and steady, one step at a time. He never stopped!',
      elements: [
        { id: 'tortoise-steady', x: 50, y: 55, hotspot: true, w: 130, h: 130, z: 2 },
        { id: 'path', x: 50, y: 72, hotspot: true, w: 150, h: 80, z: 1 },
        { id: 'sun', x: 80, y: 15, hotspot: true, w: 90, h: 90, z: 1 },
        { id: 'cheer-bird', x: 20, y: 30, hotspot: true, w: 70, h: 70, z: 1 },
      ],
      interactions: [
        { id: 'tortoise-sound', type: 'tap-sound', targetId: 'tortoise-steady', data: { say: 'Slow and steady!' } },
        { id: 'tortoise-wiggle', type: 'tap-wiggle', targetId: 'tortoise-steady', data: {} },
        { id: 'sun-spin', type: 'tap-spin', targetId: 'sun', data: {} },
        { id: 'sun-color', type: 'tap-color', targetId: 'sun', data: { colors: ['#fbbf24', '#f97316', '#facc15'] } },
        { id: 'bird-jump', type: 'tap-jump', targetId: 'cheer-bird', data: {} },
      ],
    },

    // ── Page 6: Tortoise Passes Hare ──
    {
      bg: 'from-orange-300 to-amber-400',
      image: '/arthurs-world/images/tortoise-hare/page-6.png',
      text: 'The tortoise tiptoed past the sleeping hare! Shhh! Quiet, quiet!',
      elements: [
        { id: 'tortoise-sneak', x: 60, y: 55, hotspot: true, w: 120, h: 120, z: 2 },
        { id: 'hare-still-asleep', x: 30, y: 58, hotspot: true, w: 130, h: 130, z: 2 },
        { id: 'shh', x: 70, y: 30, hotspot: true, w: 80, h: 80, z: 2 },
        { id: 'hidden-snail', x: 85, y: 72, hotspot: true, w: 60, h: 60, z: 1 },
      ],
      interactions: [
        { id: 'tortoise-sneak-wiggle', type: 'tap-wiggle', targetId: 'tortoise-sneak', data: {} },
        { id: 'hare-sound', type: 'tap-sound', targetId: 'hare-still-asleep', data: { say: 'Zzzzz...' } },
        { id: 'shh-grow', type: 'tap-grow', targetId: 'shh', data: {} },
        { id: 'snail-reveal', type: 'tap-reveal', targetId: 'hidden-snail', data: { content: 'Go tortoise!' } },
      ],
    },

    // ── Page 7: Hare Wakes Up ──
    {
      bg: 'from-red-300 to-orange-500',
      image: '/arthurs-world/images/tortoise-hare/page-7.png',
      text: 'The hare woke up! Oh no! The tortoise was almost at the finish line!',
      elements: [
        { id: 'hare-panic', x: 35, y: 50, hotspot: true, w: 130, h: 130, z: 2 },
        { id: 'tortoise-close', x: 75, y: 55, hotspot: true, w: 120, h: 120, z: 2 },
        { id: 'finish-line', x: 90, y: 50, hotspot: true, w: 80, h: 120, z: 1 },
        { id: 'exclamation', x: 30, y: 25, hotspot: true, w: 70, h: 70, z: 2 },
      ],
      interactions: [
        { id: 'hare-panic-shake', type: 'tap-shake', targetId: 'hare-panic', data: {} },
        { id: 'hare-sound', type: 'tap-sound', targetId: 'hare-panic', data: { say: 'Oh no! Wait!' } },
        { id: 'tortoise-wiggle', type: 'tap-wiggle', targetId: 'tortoise-close', data: {} },
        { id: 'finish-sparkle', type: 'tap-sparkle', targetId: 'finish-line', data: {} },
      ],
    },

    // ── Page 8: Tortoise Wins ──
    {
      bg: 'from-yellow-300 to-amber-400',
      image: '/arthurs-world/images/tortoise-hare/page-8.png',
      text: 'The tortoise crossed the finish line first! He WON the race! Hooray!',
      elements: [
        { id: 'tortoise-winner', x: 50, y: 45, hotspot: true, w: 140, h: 140, z: 3 },
        { id: 'trophy', x: 50, y: 15, hotspot: true, w: 100, h: 100, z: 2 },
        { id: 'confetti-left', x: 20, y: 25, hotspot: true, w: 80, h: 80, z: 1 },
        { id: 'confetti-right', x: 80, y: 25, hotspot: true, w: 80, h: 80, z: 1 },
        { id: 'hare-sad', x: 75, y: 65, hotspot: true, w: 110, h: 110, z: 2 },
      ],
      interactions: [
        { id: 'tortoise-sparkle', type: 'tap-sparkle', targetId: 'tortoise-winner', data: {} },
        { id: 'tortoise-jump', type: 'tap-jump', targetId: 'tortoise-winner', data: {} },
        { id: 'trophy-spin', type: 'tap-spin', targetId: 'trophy', data: {} },
        { id: 'trophy-sparkle', type: 'tap-sparkle', targetId: 'trophy', data: {} },
        { id: 'confetti-color', type: 'tap-color', targetId: 'confetti-left', data: { colors: ['#f43f5e', '#fbbf24', '#a78bfa', '#34d399'] } },
        { id: 'hare-sound', type: 'tap-sound', targetId: 'hare-sad', data: { say: 'You beat me!' } },
      ],
    },
  ],
};

export default function TortoiseAndHare() {
  return <StoryBook story={storyData} />;
}
