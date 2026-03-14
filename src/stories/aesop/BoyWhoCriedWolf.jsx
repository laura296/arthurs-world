import React from 'react';
import StoryBook from '../../components/StoryBook';

const storyData = {
  title: 'The Boy Who Cried Wolf',
  audioDir: '/arthurs-world/audio/boy-cried-wolf',
  pages: [
    // ── Page 1: The Shepherd Boy ──
    {
      bg: 'from-green-300 to-sky-400',
      image: '/arthurs-world/images/boy-cried-wolf/page-1.png',
      text: 'Once upon a time, a little boy looked after sheep on a big green hill.',
      elements: [
        { id: 'boy', x: 45, y: 45, hotspot: true, w: 120, h: 120, z: 2 },
        { id: 'sheep1', x: 25, y: 60, hotspot: true, w: 100, h: 100, z: 2 },
        { id: 'sheep2', x: 70, y: 58, hotspot: true, w: 100, h: 100, z: 2 },
        { id: 'sun', x: 80, y: 12, hotspot: true, w: 90, h: 90, z: 1 },
        { id: 'flowers', x: 15, y: 72, hotspot: true, w: 80, h: 80, z: 1 },
      ],
      interactions: [
        { id: 'boy-sound', type: 'tap-sound', targetId: 'boy', data: { say: 'What a boring day!' } },
        { id: 'sheep1-sound', type: 'tap-sound', targetId: 'sheep1', data: { say: 'Baa!' } },
        { id: 'sheep2-wiggle', type: 'tap-wiggle', targetId: 'sheep2', data: {} },
        { id: 'sun-spin', type: 'tap-spin', targetId: 'sun', data: {} },
        { id: 'flowers-color', type: 'tap-color', targetId: 'flowers', data: { colors: ['#f472b6', '#fbbf24', '#a78bfa'] } },
      ],
    },

    // ── Page 2: Boy Gets Bored ──
    {
      bg: 'from-amber-200 to-green-400',
      image: '/arthurs-world/images/boy-cried-wolf/page-2.png',
      text: 'The boy was SO bored! He had a naughty idea. He shouted "WOLF! WOLF!"',
      elements: [
        { id: 'boy-shout', x: 45, y: 42, hotspot: true, w: 130, h: 130, z: 2 },
        { id: 'wolf-text', x: 55, y: 18, hotspot: true, w: 100, h: 80, z: 2 },
        { id: 'sheep-scared', x: 70, y: 62, hotspot: true, w: 100, h: 100, z: 2 },
        { id: 'cloud', x: 20, y: 15, hotspot: true, w: 90, h: 70, z: 1 },
      ],
      interactions: [
        { id: 'boy-shout-sound', type: 'tap-sound', targetId: 'boy-shout', data: { say: 'WOLF! WOLF!' } },
        { id: 'boy-shake', type: 'tap-shake', targetId: 'boy-shout', data: {} },
        { id: 'wolf-grow', type: 'tap-grow', targetId: 'wolf-text', data: {} },
        { id: 'sheep-jump', type: 'tap-jump', targetId: 'sheep-scared', data: {} },
      ],
    },

    // ── Page 3: Villagers Come ──
    {
      bg: 'from-orange-300 to-amber-400',
      image: '/arthurs-world/images/boy-cried-wolf/page-3.png',
      text: 'All the villagers came running up the hill! But there was NO wolf! The boy laughed!',
      elements: [
        { id: 'villager1', x: 25, y: 55, hotspot: true, w: 100, h: 100, z: 2 },
        { id: 'villager2', x: 55, y: 52, hotspot: true, w: 100, h: 100, z: 2 },
        { id: 'villager3', x: 80, y: 58, hotspot: true, w: 100, h: 100, z: 2 },
        { id: 'boy-laugh', x: 50, y: 35, hotspot: true, w: 120, h: 120, z: 2 },
      ],
      interactions: [
        { id: 'villager1-sound', type: 'tap-sound', targetId: 'villager1', data: { say: 'Where is the wolf?' } },
        { id: 'villager2-shake', type: 'tap-shake', targetId: 'villager2', data: {} },
        { id: 'villager3-wiggle', type: 'tap-wiggle', targetId: 'villager3', data: {} },
        { id: 'boy-laugh-sound', type: 'tap-sound', targetId: 'boy-laugh', data: { say: 'Ha ha! I tricked you!' } },
      ],
    },

    // ── Page 4: Second Time ──
    {
      bg: 'from-green-300 to-teal-400',
      image: '/arthurs-world/images/boy-cried-wolf/page-4.png',
      text: 'The next day, the naughty boy did it again! "WOLF! WOLF!" he cried.',
      elements: [
        { id: 'boy-again', x: 45, y: 42, hotspot: true, w: 130, h: 130, z: 2 },
        { id: 'wolf-text2', x: 55, y: 15, hotspot: true, w: 100, h: 80, z: 2 },
        { id: 'sheep-group', x: 70, y: 65, hotspot: true, w: 120, h: 100, z: 2 },
        { id: 'butterfly', x: 15, y: 25, hotspot: true, w: 60, h: 60, z: 1 },
      ],
      interactions: [
        { id: 'boy-shout2', type: 'tap-sound', targetId: 'boy-again', data: { say: 'WOLF! WOLF! Come quick!' } },
        { id: 'boy-shake', type: 'tap-shake', targetId: 'boy-again', data: {} },
        { id: 'wolf-grow2', type: 'tap-grow', targetId: 'wolf-text2', data: {} },
        { id: 'butterfly-spin', type: 'tap-spin', targetId: 'butterfly', data: {} },
      ],
    },

    // ── Page 5: Villagers Angry ──
    {
      bg: 'from-red-300 to-orange-400',
      image: '/arthurs-world/images/boy-cried-wolf/page-5.png',
      text: 'The villagers came running again! No wolf! They were very cross with the boy.',
      elements: [
        { id: 'angry-villager1', x: 30, y: 50, hotspot: true, w: 110, h: 110, z: 2 },
        { id: 'angry-villager2', x: 65, y: 48, hotspot: true, w: 110, h: 110, z: 2 },
        { id: 'boy-giggle', x: 50, y: 30, hotspot: true, w: 120, h: 120, z: 2 },
        { id: 'cross-mark', x: 82, y: 22, hotspot: true, w: 70, h: 70, z: 2 },
      ],
      interactions: [
        { id: 'villager1-sound', type: 'tap-sound', targetId: 'angry-villager1', data: { say: 'You tricked us again!' } },
        { id: 'villager2-shake', type: 'tap-shake', targetId: 'angry-villager2', data: {} },
        { id: 'boy-giggle-sound', type: 'tap-sound', targetId: 'boy-giggle', data: { say: 'Hee hee!' } },
        { id: 'cross-color', type: 'tap-color', targetId: 'cross-mark', data: { colors: ['#ef4444', '#f97316'] } },
      ],
    },

    // ── Page 6: Real Wolf Comes ──
    {
      bg: 'from-gray-500 to-indigo-700',
      image: '/arthurs-world/images/boy-cried-wolf/page-6.png',
      text: 'Then one day, a REAL wolf came creeping out of the forest! The boy was so scared!',
      elements: [
        { id: 'real-wolf', x: 30, y: 50, hotspot: true, w: 140, h: 140, z: 2 },
        { id: 'boy-scared', x: 65, y: 45, hotspot: true, w: 120, h: 120, z: 2 },
        { id: 'dark-trees', x: 15, y: 30, hotspot: true, w: 120, h: 120, z: 1 },
        { id: 'scared-sheep', x: 80, y: 65, hotspot: true, w: 100, h: 100, z: 2 },
      ],
      interactions: [
        { id: 'wolf-sound', type: 'tap-sound', targetId: 'real-wolf', data: { say: 'Grrrrr!' } },
        { id: 'wolf-shake', type: 'tap-shake', targetId: 'real-wolf', data: {} },
        { id: 'boy-sound', type: 'tap-sound', targetId: 'boy-scared', data: { say: 'WOLF! REAL WOLF!' } },
        { id: 'sheep-jump', type: 'tap-jump', targetId: 'scared-sheep', data: {} },
      ],
    },

    // ── Page 7: Nobody Comes ──
    {
      bg: 'from-indigo-500 to-gray-700',
      image: '/arthurs-world/images/boy-cried-wolf/page-7.png',
      text: '"WOLF! WOLF!" cried the boy. But nobody came to help! They thought he was tricking them again.',
      elements: [
        { id: 'boy-alone', x: 50, y: 45, hotspot: true, w: 130, h: 130, z: 2 },
        { id: 'empty-path', x: 20, y: 65, hotspot: true, w: 120, h: 80, z: 1 },
        { id: 'wolf-closer', x: 80, y: 55, hotspot: true, w: 120, h: 120, z: 2 },
        { id: 'tear', x: 55, y: 55, hotspot: true, w: 50, h: 50, z: 3 },
      ],
      interactions: [
        { id: 'boy-cry', type: 'tap-sound', targetId: 'boy-alone', data: { say: 'Please help! This time it is real!' } },
        { id: 'boy-shake', type: 'tap-shake', targetId: 'boy-alone', data: {} },
        { id: 'wolf-wiggle', type: 'tap-wiggle', targetId: 'wolf-closer', data: {} },
        { id: 'tear-color', type: 'tap-color', targetId: 'tear', data: { colors: ['#60a5fa', '#93c5fd'] } },
      ],
    },

    // ── Page 8: The Lesson ──
    {
      bg: 'from-amber-300 to-green-400',
      image: '/arthurs-world/images/boy-cried-wolf/page-8.png',
      text: 'A kind farmer chased the wolf away! The boy learned his lesson — always tell the truth!',
      elements: [
        { id: 'farmer', x: 35, y: 45, hotspot: true, w: 130, h: 130, z: 2 },
        { id: 'wolf-running', x: 80, y: 55, hotspot: true, w: 120, h: 120, z: 2 },
        { id: 'boy-sorry', x: 50, y: 60, hotspot: true, w: 110, h: 110, z: 2 },
        { id: 'heart', x: 50, y: 18, hotspot: true, w: 80, h: 80, z: 1 },
        { id: 'sheep-safe', x: 20, y: 68, hotspot: true, w: 90, h: 90, z: 1 },
      ],
      interactions: [
        { id: 'farmer-sound', type: 'tap-sound', targetId: 'farmer', data: { say: 'Shoo! Go away wolf!' } },
        { id: 'wolf-animate', type: 'tap-animate', targetId: 'wolf-running', data: { animation: 'animate-dance', duration: 800 } },
        { id: 'boy-sound', type: 'tap-sound', targetId: 'boy-sorry', data: { say: 'I am sorry. I will always tell the truth!' } },
        { id: 'heart-sparkle', type: 'tap-sparkle', targetId: 'heart', data: {} },
        { id: 'sheep-wiggle', type: 'tap-wiggle', targetId: 'sheep-safe', data: {} },
      ],
    },
  ],
};

export default function BoyWhoCriedWolf() {
  return <StoryBook story={storyData} />;
}
