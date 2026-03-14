import React from 'react';
import StoryBook from '../../components/StoryBook';

const storyData = {
  title: 'The Ant and the Grasshopper',
  audioDir: '/arthurs-world/audio/ant-grasshopper',
  pages: [
    // ── Page 1: Summer Day ──
    {
      bg: 'from-green-300 to-yellow-400',
      image: '/arthurs-world/images/ant-grasshopper/page-1.png',
      text: 'It was a hot summer day! A little ant was working very hard, carrying food to her home.',
      elements: [
        { id: 'ant', x: 40, y: 60, hotspot: true, w: 90, h: 90, z: 2 },
        { id: 'food-crumb', x: 45, y: 55, hotspot: true, w: 60, h: 60, z: 3 },
        { id: 'sun', x: 75, y: 12, hotspot: true, w: 100, h: 100, z: 1 },
        { id: 'anthill', x: 80, y: 65, hotspot: true, w: 100, h: 100, z: 1 },
        { id: 'flower', x: 15, y: 55, hotspot: true, w: 70, h: 70, z: 1 },
      ],
      interactions: [
        { id: 'ant-sound', type: 'tap-sound', targetId: 'ant', data: { say: 'Must keep working!' } },
        { id: 'ant-wiggle', type: 'tap-wiggle', targetId: 'ant', data: {} },
        { id: 'food-grow', type: 'tap-grow', targetId: 'food-crumb', data: {} },
        { id: 'sun-spin', type: 'tap-spin', targetId: 'sun', data: {} },
        { id: 'flower-color', type: 'tap-color', targetId: 'flower', data: { colors: ['#f472b6', '#fbbf24', '#a78bfa'] } },
      ],
    },

    // ── Page 2: Grasshopper Plays ──
    {
      bg: 'from-lime-300 to-green-500',
      image: '/arthurs-world/images/ant-grasshopper/page-2.png',
      text: 'A grasshopper was singing and dancing in the sunshine! He was having SO much fun!',
      elements: [
        { id: 'grasshopper', x: 50, y: 42, hotspot: true, w: 130, h: 130, z: 2 },
        { id: 'music-note1', x: 35, y: 22, hotspot: true, w: 60, h: 60, z: 2 },
        { id: 'music-note2', x: 65, y: 18, hotspot: true, w: 60, h: 60, z: 2 },
        { id: 'daisy', x: 80, y: 65, hotspot: true, w: 70, h: 70, z: 1 },
      ],
      interactions: [
        { id: 'grasshopper-dance', type: 'tap-animate', targetId: 'grasshopper', data: { animation: 'animate-dance', duration: 1200 } },
        { id: 'grasshopper-sound', type: 'tap-sound', targetId: 'grasshopper', data: { say: 'La la la! What a lovely day!' } },
        { id: 'note1-spin', type: 'tap-spin', targetId: 'music-note1', data: {} },
        { id: 'note2-spin', type: 'tap-spin', targetId: 'music-note2', data: {} },
      ],
    },

    // ── Page 3: Grasshopper Teases ──
    {
      bg: 'from-amber-200 to-green-400',
      image: '/arthurs-world/images/ant-grasshopper/page-3.png',
      text: '"Why are you working so hard?" said the grasshopper. "Come and play with me!"',
      elements: [
        { id: 'grasshopper-ask', x: 55, y: 40, hotspot: true, w: 130, h: 130, z: 2 },
        { id: 'ant-busy', x: 30, y: 60, hotspot: true, w: 90, h: 90, z: 2 },
        { id: 'food-pile', x: 80, y: 65, hotspot: true, w: 90, h: 90, z: 1 },
        { id: 'leaf', x: 15, y: 30, hotspot: true, w: 70, h: 70, z: 1 },
      ],
      interactions: [
        { id: 'grasshopper-sound', type: 'tap-sound', targetId: 'grasshopper-ask', data: { say: 'Come play! It is summer!' } },
        { id: 'ant-sound', type: 'tap-sound', targetId: 'ant-busy', data: { say: 'I must save food for winter!' } },
        { id: 'food-grow', type: 'tap-grow', targetId: 'food-pile', data: {} },
        { id: 'leaf-wiggle', type: 'tap-wiggle', targetId: 'leaf', data: {} },
      ],
    },

    // ── Page 4: Ant Keeps Working ──
    {
      bg: 'from-orange-300 to-amber-400',
      image: '/arthurs-world/images/ant-grasshopper/page-4.png',
      text: 'The ant kept working all summer long. She stored food, berries and seeds in her cosy home!',
      elements: [
        { id: 'ant-carry', x: 40, y: 55, hotspot: true, w: 90, h: 90, z: 2 },
        { id: 'berry', x: 30, y: 65, hotspot: true, w: 60, h: 60, z: 2 },
        { id: 'seed', x: 55, y: 68, hotspot: true, w: 60, h: 60, z: 2 },
        { id: 'anthill-full', x: 80, y: 55, hotspot: true, w: 110, h: 110, z: 1 },
        { id: 'hidden-ladybird', x: 15, y: 70, hotspot: true, w: 50, h: 50, z: 1 },
      ],
      interactions: [
        { id: 'ant-wiggle', type: 'tap-wiggle', targetId: 'ant-carry', data: {} },
        { id: 'berry-color', type: 'tap-color', targetId: 'berry', data: { colors: ['#ef4444', '#7c3aed', '#2563eb'] } },
        { id: 'seed-spin', type: 'tap-spin', targetId: 'seed', data: {} },
        { id: 'anthill-sparkle', type: 'tap-sparkle', targetId: 'anthill-full', data: {} },
        { id: 'ladybird-reveal', type: 'tap-reveal', targetId: 'hidden-ladybird', data: { content: 'Hello!' } },
      ],
    },

    // ── Page 5: Winter Comes ──
    {
      bg: 'from-blue-300 to-indigo-500',
      image: '/arthurs-world/images/ant-grasshopper/page-5.png',
      text: 'Then winter came! It was cold and snowy. The wind blew and blew! Brrrrr!',
      elements: [
        { id: 'snow', x: 50, y: 20, hotspot: true, w: 150, h: 100, z: 1 },
        { id: 'bare-tree', x: 75, y: 35, hotspot: true, w: 110, h: 120, z: 1 },
        { id: 'snowflake1', x: 25, y: 30, hotspot: true, w: 60, h: 60, z: 2 },
        { id: 'snowflake2', x: 70, y: 15, hotspot: true, w: 60, h: 60, z: 2 },
      ],
      interactions: [
        { id: 'snow-shake', type: 'tap-shake', targetId: 'snow', data: {} },
        { id: 'tree-shake', type: 'tap-shake', targetId: 'bare-tree', data: {} },
        { id: 'flake1-spin', type: 'tap-spin', targetId: 'snowflake1', data: {} },
        { id: 'flake2-color', type: 'tap-color', targetId: 'snowflake2', data: { colors: ['#bfdbfe', '#e0e7ff', '#ddd6fe'] } },
      ],
    },

    // ── Page 6: Grasshopper Cold ──
    {
      bg: 'from-gray-400 to-blue-600',
      image: '/arthurs-world/images/ant-grasshopper/page-6.png',
      text: 'The grasshopper was SO cold and hungry! He had no food because he played all summer!',
      elements: [
        { id: 'grasshopper-cold', x: 50, y: 50, hotspot: true, w: 130, h: 130, z: 2 },
        { id: 'empty-tummy', x: 55, y: 62, hotspot: true, w: 70, h: 70, z: 2 },
        { id: 'snowflakes', x: 30, y: 25, hotspot: true, w: 100, h: 80, z: 1 },
        { id: 'tear', x: 55, y: 42, hotspot: true, w: 50, h: 50, z: 3 },
      ],
      interactions: [
        { id: 'grasshopper-sound', type: 'tap-sound', targetId: 'grasshopper-cold', data: { say: 'Brrrr! I am so cold and hungry!' } },
        { id: 'grasshopper-shake', type: 'tap-shake', targetId: 'grasshopper-cold', data: {} },
        { id: 'tummy-wiggle', type: 'tap-wiggle', targetId: 'empty-tummy', data: {} },
        { id: 'tear-grow', type: 'tap-grow', targetId: 'tear', data: {} },
      ],
    },

    // ── Page 7: Ant Helps ──
    {
      bg: 'from-amber-300 to-orange-400',
      image: '/arthurs-world/images/ant-grasshopper/page-7.png',
      text: 'The kind ant opened her door. "Come in!" she said. "I have plenty of food to share!"',
      elements: [
        { id: 'ant-kind', x: 35, y: 50, hotspot: true, w: 90, h: 90, z: 2 },
        { id: 'grasshopper-grateful', x: 60, y: 48, hotspot: true, w: 120, h: 120, z: 2 },
        { id: 'door', x: 20, y: 45, hotspot: true, w: 90, h: 110, z: 1 },
        { id: 'food-spread', x: 45, y: 70, hotspot: true, w: 120, h: 80, z: 1 },
      ],
      interactions: [
        { id: 'ant-sound', type: 'tap-sound', targetId: 'ant-kind', data: { say: 'Come in friend! Have some food!' } },
        { id: 'grasshopper-sound', type: 'tap-sound', targetId: 'grasshopper-grateful', data: { say: 'Thank you! You are so kind!' } },
        { id: 'door-sparkle', type: 'tap-sparkle', targetId: 'door', data: {} },
        { id: 'food-sparkle', type: 'tap-sparkle', targetId: 'food-spread', data: {} },
      ],
    },

    // ── Page 8: The Lesson ──
    {
      bg: 'from-yellow-300 to-amber-400',
      image: '/arthurs-world/images/ant-grasshopper/page-8.png',
      text: 'The grasshopper learned — work hard AND have fun! And always help your friends! The end!',
      elements: [
        { id: 'friends', x: 50, y: 48, hotspot: true, w: 150, h: 140, z: 2 },
        { id: 'heart', x: 50, y: 15, hotspot: true, w: 90, h: 80, z: 1 },
        { id: 'star-left', x: 15, y: 22, hotspot: true, w: 70, h: 70, z: 1 },
        { id: 'star-right', x: 85, y: 22, hotspot: true, w: 70, h: 70, z: 1 },
      ],
      interactions: [
        { id: 'friends-sparkle', type: 'tap-sparkle', targetId: 'friends', data: {} },
        { id: 'friends-dance', type: 'tap-animate', targetId: 'friends', data: { animation: 'animate-dance', duration: 1200 } },
        { id: 'heart-color', type: 'tap-color', targetId: 'heart', data: { colors: ['#f43f5e', '#ec4899', '#f472b6'] } },
        { id: 'star-left-spin', type: 'tap-spin', targetId: 'star-left', data: {} },
        { id: 'star-right-sparkle', type: 'tap-sparkle', targetId: 'star-right', data: {} },
      ],
    },
  ],
};

export default function AntAndGrasshopper() {
  return <StoryBook story={storyData} />;
}
