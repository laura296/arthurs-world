import React from 'react';
import StoryBook from '../../components/StoryBook';

const storyData = {
  title: 'The Lion and the Mouse',
  audioDir: '/arthurs-world/audio/lion-mouse',
  pages: [
    // ── Page 1: The Big Lion ──
    {
      bg: 'from-amber-300 to-orange-500',
      image: '/arthurs-world/images/lion-mouse/page-1.png',
      text: 'Once upon a time, a great big lion was having a nap in the warm sunshine.',
      elements: [
        { id: 'lion', x: 50, y: 50, hotspot: true, w: 160, h: 160, z: 2 },
        { id: 'sun', x: 80, y: 15, hotspot: true, w: 90, h: 90, z: 1 },
        { id: 'grass', x: 30, y: 72, hotspot: true, w: 120, h: 80, z: 1 },
        { id: 'zzz', x: 60, y: 28, hotspot: true, w: 70, h: 70, z: 2 },
      ],
      interactions: [
        { id: 'lion-sound', type: 'tap-sound', targetId: 'lion', data: { say: 'Zzzzz...' } },
        { id: 'lion-wiggle', type: 'tap-wiggle', targetId: 'lion', data: {} },
        { id: 'sun-spin', type: 'tap-spin', targetId: 'sun', data: {} },
        { id: 'zzz-grow', type: 'tap-grow', targetId: 'zzz', data: {} },
      ],
    },

    // ── Page 2: Mouse Wakes Lion ──
    {
      bg: 'from-green-300 to-amber-400',
      image: '/arthurs-world/images/lion-mouse/page-2.png',
      text: 'A tiny little mouse ran across the lion\'s nose! The lion woke up — ROAR!',
      elements: [
        { id: 'lion-angry', x: 50, y: 45, hotspot: true, w: 150, h: 150, z: 2 },
        { id: 'mouse-tiny', x: 55, y: 38, hotspot: true, w: 60, h: 60, z: 3 },
        { id: 'paw', x: 35, y: 65, hotspot: true, w: 100, h: 100, z: 2 },
        { id: 'hidden-bug', x: 85, y: 70, hotspot: true, w: 50, h: 50, z: 1 },
      ],
      interactions: [
        { id: 'lion-roar', type: 'tap-sound', targetId: 'lion-angry', data: { say: 'ROAR! Who woke me up?' } },
        { id: 'lion-shake', type: 'tap-shake', targetId: 'lion-angry', data: {} },
        { id: 'mouse-jump', type: 'tap-jump', targetId: 'mouse-tiny', data: {} },
        { id: 'bug-reveal', type: 'tap-reveal', targetId: 'hidden-bug', data: { content: 'Eek!' } },
      ],
    },

    // ── Page 3: Mouse Begs ──
    {
      bg: 'from-amber-200 to-yellow-400',
      image: '/arthurs-world/images/lion-mouse/page-3.png',
      text: 'The lion caught the mouse! "Please let me go!" squeaked the mouse. "One day I\'ll help YOU!"',
      elements: [
        { id: 'lion-hold', x: 40, y: 45, hotspot: true, w: 150, h: 150, z: 2 },
        { id: 'mouse-beg', x: 45, y: 50, hotspot: true, w: 70, h: 70, z: 3 },
        { id: 'tear', x: 50, y: 58, hotspot: true, w: 50, h: 50, z: 3 },
        { id: 'flower', x: 80, y: 70, hotspot: true, w: 70, h: 70, z: 1 },
      ],
      interactions: [
        { id: 'mouse-sound', type: 'tap-sound', targetId: 'mouse-beg', data: { say: 'Please! I will help you!' } },
        { id: 'mouse-wiggle', type: 'tap-wiggle', targetId: 'mouse-beg', data: {} },
        { id: 'tear-color', type: 'tap-color', targetId: 'tear', data: { colors: ['#60a5fa', '#93c5fd'] } },
        { id: 'flower-spin', type: 'tap-spin', targetId: 'flower', data: {} },
      ],
    },

    // ── Page 4: Lion Laughs ──
    {
      bg: 'from-green-400 to-emerald-500',
      image: '/arthurs-world/images/lion-mouse/page-4.png',
      text: 'The lion laughed! "You? Help ME? You are so tiny!" But he let the little mouse go.',
      elements: [
        { id: 'lion-laugh', x: 45, y: 45, hotspot: true, w: 150, h: 150, z: 2 },
        { id: 'mouse-free', x: 70, y: 62, hotspot: true, w: 70, h: 70, z: 2 },
        { id: 'ha-ha', x: 55, y: 22, hotspot: true, w: 80, h: 80, z: 2 },
        { id: 'bird', x: 20, y: 25, hotspot: true, w: 70, h: 70, z: 1 },
      ],
      interactions: [
        { id: 'lion-laugh-sound', type: 'tap-sound', targetId: 'lion-laugh', data: { say: 'Ha ha ha! Off you go!' } },
        { id: 'lion-shake', type: 'tap-shake', targetId: 'lion-laugh', data: {} },
        { id: 'mouse-jump', type: 'tap-jump', targetId: 'mouse-free', data: {} },
        { id: 'ha-grow', type: 'tap-grow', targetId: 'ha-ha', data: {} },
      ],
    },

    // ── Page 5: Lion Trapped ──
    {
      bg: 'from-gray-400 to-green-600',
      image: '/arthurs-world/images/lion-mouse/page-5.png',
      text: 'One day, hunters caught the lion in a big net! He was stuck! He roared and roared!',
      elements: [
        { id: 'lion-trapped', x: 50, y: 50, hotspot: true, w: 150, h: 150, z: 2 },
        { id: 'net', x: 50, y: 45, hotspot: true, w: 170, h: 140, z: 3 },
        { id: 'tree-post', x: 15, y: 35, hotspot: true, w: 80, h: 100, z: 1 },
        { id: 'roar-text', x: 60, y: 18, hotspot: true, w: 90, h: 80, z: 2 },
      ],
      interactions: [
        { id: 'lion-roar', type: 'tap-sound', targetId: 'lion-trapped', data: { say: 'ROAR! Help me!' } },
        { id: 'lion-shake', type: 'tap-shake', targetId: 'lion-trapped', data: {} },
        { id: 'net-wiggle', type: 'tap-wiggle', targetId: 'net', data: {} },
        { id: 'roar-grow', type: 'tap-grow', targetId: 'roar-text', data: {} },
      ],
    },

    // ── Page 6: Mouse Hears ──
    {
      bg: 'from-emerald-300 to-teal-500',
      image: '/arthurs-world/images/lion-mouse/page-6.png',
      text: 'The little mouse heard the lion roaring! "I\'m coming!" she squeaked, and ran to help!',
      elements: [
        { id: 'mouse-running', x: 30, y: 58, hotspot: true, w: 80, h: 80, z: 2 },
        { id: 'sound-waves', x: 65, y: 30, hotspot: true, w: 90, h: 90, z: 1 },
        { id: 'path', x: 50, y: 72, hotspot: true, w: 140, h: 60, z: 1 },
        { id: 'leaf', x: 80, y: 65, hotspot: true, w: 60, h: 60, z: 1 },
      ],
      interactions: [
        { id: 'mouse-sound', type: 'tap-sound', targetId: 'mouse-running', data: { say: 'Hold on! I am coming!' } },
        { id: 'mouse-animate', type: 'tap-animate', targetId: 'mouse-running', data: { animation: 'animate-dance', duration: 600 } },
        { id: 'waves-spin', type: 'tap-spin', targetId: 'sound-waves', data: {} },
        { id: 'leaf-wiggle', type: 'tap-wiggle', targetId: 'leaf', data: {} },
      ],
    },

    // ── Page 7: Mouse Chews ──
    {
      bg: 'from-amber-300 to-green-400',
      image: '/arthurs-world/images/lion-mouse/page-7.png',
      text: 'The mouse nibbled and nibbled and NIBBLED through the net with her tiny sharp teeth!',
      elements: [
        { id: 'mouse-chew', x: 45, y: 45, hotspot: true, w: 80, h: 80, z: 3 },
        { id: 'net-breaking', x: 50, y: 50, hotspot: true, w: 160, h: 140, z: 2 },
        { id: 'lion-hopeful', x: 50, y: 55, hotspot: true, w: 140, h: 140, z: 1 },
        { id: 'nibble-bits', x: 55, y: 65, hotspot: true, w: 70, h: 70, z: 2 },
      ],
      interactions: [
        { id: 'mouse-sound', type: 'tap-sound', targetId: 'mouse-chew', data: { say: 'Nibble nibble nibble!' } },
        { id: 'mouse-wiggle', type: 'tap-wiggle', targetId: 'mouse-chew', data: {} },
        { id: 'net-shake', type: 'tap-shake', targetId: 'net-breaking', data: {} },
        { id: 'bits-spin', type: 'tap-spin', targetId: 'nibble-bits', data: {} },
      ],
    },

    // ── Page 8: Lion is Free ──
    {
      bg: 'from-yellow-300 to-amber-400',
      image: '/arthurs-world/images/lion-mouse/page-8.png',
      text: 'The lion was FREE! "Thank you, little mouse! Even tiny friends can do BIG things!"',
      elements: [
        { id: 'lion-happy', x: 45, y: 45, hotspot: true, w: 150, h: 150, z: 2 },
        { id: 'mouse-proud', x: 55, y: 35, hotspot: true, w: 70, h: 70, z: 3 },
        { id: 'hearts', x: 50, y: 15, hotspot: true, w: 90, h: 80, z: 1 },
        { id: 'star-left', x: 15, y: 25, hotspot: true, w: 70, h: 70, z: 1 },
        { id: 'star-right', x: 85, y: 25, hotspot: true, w: 70, h: 70, z: 1 },
      ],
      interactions: [
        { id: 'lion-sound', type: 'tap-sound', targetId: 'lion-happy', data: { say: 'Thank you little friend!' } },
        { id: 'lion-sparkle', type: 'tap-sparkle', targetId: 'lion-happy', data: {} },
        { id: 'mouse-jump', type: 'tap-jump', targetId: 'mouse-proud', data: {} },
        { id: 'hearts-color', type: 'tap-color', targetId: 'hearts', data: { colors: ['#f43f5e', '#ec4899', '#f472b6'] } },
        { id: 'star-spin', type: 'tap-spin', targetId: 'star-left', data: {} },
        { id: 'star-sparkle', type: 'tap-sparkle', targetId: 'star-right', data: {} },
      ],
    },
  ],
};

export default function LionAndMouse() {
  return <StoryBook story={storyData} />;
}
