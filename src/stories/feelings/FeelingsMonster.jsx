import React from 'react';
import StoryBook from '../../components/StoryBook';

const storyData = {
  title: 'The Feelings Monster',
  endMessage: 'Every feeling is special!',
  pages: [
    // ── Page 1: Meet the Monster ──
    {
      bg: 'from-purple-300 to-pink-300',
      image: '/arthurs-world/images/feelings-monster/page-1.png',
      text: 'This is the Feelings Monster! Today all his colours are muddled up. Can you help him sort them out?',
      elements: [
        { id: 'monster', x: 50, y: 45, hotspot: true, w: 180, h: 180, z: 3 },
        { id: 'swirl-1', x: 30, y: 30, hotspot: true, w: 80, h: 80, z: 2 },
        { id: 'swirl-2', x: 70, y: 35, hotspot: true, w: 80, h: 80, z: 2 },
        { id: 'swirl-3', x: 40, y: 70, hotspot: true, w: 80, h: 80, z: 2 },
        { id: 'hidden-star', x: 85, y: 75, hotspot: true, w: 60, h: 60, z: 1 },
      ],
      interactions: [
        { id: 'monster-speak', type: 'character-speak', targetId: 'monster', data: { say: 'My colours are all mixed up! Help me!', character: 'feelings-monster' } },
        { id: 'monster-shake', type: 'tap-shake', targetId: 'monster', data: {} },
        { id: 'swirl-spin-1', type: 'tap-spin', targetId: 'swirl-1', data: {} },
        { id: 'swirl-spin-2', type: 'tap-spin', targetId: 'swirl-2', data: {} },
        { id: 'swirl-spin-3', type: 'tap-spin', targetId: 'swirl-3', data: {} },
        { id: 'star-reveal', type: 'tap-reveal', targetId: 'hidden-star', data: { content: <span>✨</span> } },
      ],
    },

    // ── Page 2: Happy is Yellow ──
    {
      bg: 'from-yellow-300 to-amber-400',
      image: '/arthurs-world/images/feelings-monster/page-2.png',
      text: 'HAPPY feels like sunshine! When you are happy, you want to jump and dance and laugh!',
      elements: [
        { id: 'happy-monster', x: 45, y: 45, hotspot: true, w: 160, h: 160, z: 3 },
        { id: 'sun', x: 78, y: 18, hotspot: true, w: 100, h: 100, z: 2 },
        { id: 'flower-1', x: 20, y: 70, hotspot: true, w: 80, h: 80, z: 2 },
        { id: 'flower-2', x: 75, y: 72, hotspot: true, w: 80, h: 80, z: 2 },
        { id: 'butterfly', x: 65, y: 30, hotspot: true, w: 70, h: 70, z: 2 },
      ],
      interactions: [
        { id: 'happy-say', type: 'character-speak', targetId: 'happy-monster', data: { say: 'I feel so happy! Ha ha ha!', character: 'happy-monster' } },
        { id: 'happy-jump', type: 'tap-jump', targetId: 'happy-monster', data: {} },
        { id: 'sun-spin', type: 'tap-spin', targetId: 'sun', data: {} },
        { id: 'flower-grow-1', type: 'tap-grow', targetId: 'flower-1', data: {} },
        { id: 'flower-color', type: 'tap-color', targetId: 'flower-2', data: { colors: ['#fde047', '#facc15', '#f59e0b', '#fbbf24'] } },
        { id: 'butterfly-fly', type: 'tap-animate', targetId: 'butterfly', data: { animation: 'animate-fly', duration: 1200 } },
      ],
    },

    // ── Page 3: Sad is Blue ──
    {
      bg: 'from-blue-300 to-indigo-400',
      image: '/arthurs-world/images/feelings-monster/page-3.png',
      text: 'SAD feels like rain. When you feel sad, it is okay to cry. Sadness needs a big cuddle.',
      elements: [
        { id: 'sad-monster', x: 45, y: 50, hotspot: true, w: 160, h: 160, z: 3 },
        { id: 'cloud', x: 50, y: 15, hotspot: true, w: 120, h: 80, z: 2 },
        { id: 'tear-1', x: 38, y: 55, hotspot: true, w: 50, h: 50, z: 4 },
        { id: 'tear-2', x: 52, y: 58, hotspot: true, w: 50, h: 50, z: 4 },
        { id: 'hidden-rainbow', x: 80, y: 25, hotspot: true, w: 80, h: 60, z: 1 },
      ],
      interactions: [
        { id: 'sad-say', type: 'character-speak', targetId: 'sad-monster', data: { say: 'I feel a bit sad today.', character: 'sad-monster' } },
        { id: 'sad-wiggle', type: 'tap-wiggle', targetId: 'sad-monster', data: {} },
        { id: 'cloud-shake', type: 'tap-shake', targetId: 'cloud', data: {} },
        { id: 'tear-color-1', type: 'tap-color', targetId: 'tear-1', data: { colors: ['#60a5fa', '#93c5fd', '#3b82f6'] } },
        { id: 'tear-color-2', type: 'tap-color', targetId: 'tear-2', data: { colors: ['#93c5fd', '#60a5fa', '#3b82f6'] } },
        { id: 'rainbow-reveal', type: 'tap-reveal', targetId: 'hidden-rainbow', data: { content: <span>🌈 A rainbow!</span> } },
      ],
    },

    // ── Page 4: Angry is Red ──
    {
      bg: 'from-red-400 to-orange-500',
      image: '/arthurs-world/images/feelings-monster/page-4.png',
      text: 'ANGRY feels hot like a fire! When you are angry, take a deep breath. In… and out… That is better!',
      elements: [
        { id: 'angry-monster', x: 45, y: 45, hotspot: true, w: 170, h: 170, z: 3 },
        { id: 'flame-1', x: 25, y: 60, hotspot: true, w: 80, h: 80, z: 2 },
        { id: 'flame-2', x: 70, y: 55, hotspot: true, w: 80, h: 80, z: 2 },
        { id: 'stomp', x: 45, y: 75, hotspot: true, w: 100, h: 60, z: 2 },
        { id: 'hidden-heart', x: 82, y: 20, hotspot: true, w: 60, h: 60, z: 1 },
      ],
      interactions: [
        { id: 'angry-say', type: 'character-speak', targetId: 'angry-monster', data: { say: 'GRRR! I am so cross!', character: 'angry-monster' } },
        { id: 'angry-shake', type: 'tap-shake', targetId: 'angry-monster', data: {} },
        { id: 'flame-grow-1', type: 'tap-grow', targetId: 'flame-1', data: {} },
        { id: 'flame-color', type: 'tap-color', targetId: 'flame-2', data: { colors: ['#ef4444', '#f97316', '#eab308', '#dc2626'] } },
        { id: 'stomp-shake', type: 'tap-shake', targetId: 'stomp', data: {} },
        { id: 'heart-reveal', type: 'tap-reveal', targetId: 'hidden-heart', data: { content: <span>❤️ Breathe...</span> } },
      ],
    },

    // ── Page 5: Scared is Dark ──
    {
      bg: 'from-gray-600 to-slate-800',
      image: '/arthurs-world/images/feelings-monster/page-5.png',
      text: 'SCARED feels small and dark. Everyone feels scared sometimes. A brave hug makes it better!',
      elements: [
        { id: 'scared-monster', x: 45, y: 50, hotspot: true, w: 140, h: 140, z: 3 },
        { id: 'shadow-1', x: 20, y: 40, hotspot: true, w: 90, h: 90, z: 2 },
        { id: 'shadow-2', x: 75, y: 35, hotspot: true, w: 90, h: 90, z: 2 },
        { id: 'eyes', x: 30, y: 60, hotspot: true, w: 60, h: 40, z: 2 },
        { id: 'hidden-light', x: 50, y: 20, hotspot: true, w: 80, h: 80, z: 1 },
      ],
      interactions: [
        { id: 'scared-say', type: 'character-speak', targetId: 'scared-monster', data: { say: 'I am a little bit scared.', character: 'scared-monster' } },
        { id: 'scared-wiggle', type: 'tap-wiggle', targetId: 'scared-monster', data: {} },
        { id: 'shadow-hide-1', type: 'tap-hide', targetId: 'shadow-1', data: {} },
        { id: 'shadow-hide-2', type: 'tap-hide', targetId: 'shadow-2', data: {} },
        { id: 'eyes-sparkle', type: 'tap-sparkle', targetId: 'eyes', data: {} },
        { id: 'light-reveal', type: 'tap-reveal', targetId: 'hidden-light', data: { content: <span>⭐ You are brave!</span> } },
      ],
    },

    // ── Page 6: Calm is Green ──
    {
      bg: 'from-green-300 to-emerald-400',
      image: '/arthurs-world/images/feelings-monster/page-6.png',
      text: 'CALM feels like a gentle breeze. When you feel calm, everything feels soft and peaceful.',
      elements: [
        { id: 'calm-monster', x: 45, y: 45, hotspot: true, w: 160, h: 160, z: 3 },
        { id: 'leaf-1', x: 25, y: 30, hotspot: true, w: 70, h: 70, z: 2 },
        { id: 'leaf-2', x: 72, y: 35, hotspot: true, w: 70, h: 70, z: 2 },
        { id: 'pond', x: 50, y: 72, hotspot: true, w: 130, h: 80, z: 2 },
        { id: 'dragonfly', x: 65, y: 25, hotspot: true, w: 65, h: 65, z: 2 },
      ],
      interactions: [
        { id: 'calm-say', type: 'character-speak', targetId: 'calm-monster', data: { say: 'Ahhhh, I feel so calm and peaceful.', character: 'calm-monster' } },
        { id: 'calm-grow', type: 'tap-grow', targetId: 'calm-monster', data: {} },
        { id: 'leaf-fly-1', type: 'tap-animate', targetId: 'leaf-1', data: { animation: 'animate-fly', duration: 1500 } },
        { id: 'leaf-fly-2', type: 'tap-animate', targetId: 'leaf-2', data: { animation: 'animate-fly', duration: 1200 } },
        { id: 'pond-sparkle', type: 'tap-sparkle', targetId: 'pond', data: {} },
        { id: 'dragonfly-fly', type: 'tap-animate', targetId: 'dragonfly', data: { animation: 'animate-fly', duration: 1000 } },
      ],
    },

    // ── Page 7: Love is Pink ──
    {
      bg: 'from-pink-300 to-rose-400',
      image: '/arthurs-world/images/feelings-monster/page-7.png',
      text: 'LOVE feels warm and cuddly! Love is hugs, and kisses, and being with the people you love most.',
      elements: [
        { id: 'love-monster', x: 45, y: 45, hotspot: true, w: 160, h: 160, z: 3 },
        { id: 'heart-1', x: 25, y: 30, hotspot: true, w: 80, h: 80, z: 2 },
        { id: 'heart-2', x: 70, y: 25, hotspot: true, w: 80, h: 80, z: 2 },
        { id: 'heart-3', x: 50, y: 18, hotspot: true, w: 70, h: 70, z: 2 },
        { id: 'sparkle-zone', x: 45, y: 70, hotspot: true, w: 100, h: 60, z: 2 },
      ],
      interactions: [
        { id: 'love-say', type: 'character-speak', targetId: 'love-monster', data: { say: 'I love you SO much!', character: 'love-monster' } },
        { id: 'love-jump', type: 'tap-jump', targetId: 'love-monster', data: {} },
        { id: 'heart-grow-1', type: 'tap-grow', targetId: 'heart-1', data: {} },
        { id: 'heart-color', type: 'tap-color', targetId: 'heart-2', data: { colors: ['#f9a8d4', '#fb7185', '#ec4899', '#f472b6'] } },
        { id: 'heart-spin', type: 'tap-spin', targetId: 'heart-3', data: {} },
        { id: 'sparkle', type: 'tap-sparkle', targetId: 'sparkle-zone', data: {} },
      ],
    },

    // ── Page 8: All Sorted! ──
    {
      bg: 'from-amber-200 to-pink-300',
      image: '/arthurs-world/images/feelings-monster/page-8.png',
      text: 'Well done! You helped the Feelings Monster sort all his colours! Every feeling is special and important.',
      elements: [
        { id: 'sorted-monster', x: 50, y: 40, hotspot: true, w: 170, h: 170, z: 3 },
        { id: 'jar-yellow', x: 15, y: 68, hotspot: true, w: 70, h: 80, z: 2 },
        { id: 'jar-blue', x: 30, y: 68, hotspot: true, w: 70, h: 80, z: 2 },
        { id: 'jar-red', x: 55, y: 68, hotspot: true, w: 70, h: 80, z: 2 },
        { id: 'jar-green', x: 70, y: 68, hotspot: true, w: 70, h: 80, z: 2 },
        { id: 'jar-pink', x: 85, y: 68, hotspot: true, w: 70, h: 80, z: 2 },
      ],
      interactions: [
        { id: 'sorted-say', type: 'character-speak', targetId: 'sorted-monster', data: { say: 'Thank you! All my feelings are sorted!', character: 'feelings-monster' } },
        { id: 'sorted-jump', type: 'tap-jump', targetId: 'sorted-monster', data: {} },
        { id: 'jar-sparkle-1', type: 'tap-sparkle', targetId: 'jar-yellow', data: {} },
        { id: 'jar-sparkle-2', type: 'tap-sparkle', targetId: 'jar-blue', data: {} },
        { id: 'jar-sparkle-3', type: 'tap-sparkle', targetId: 'jar-red', data: {} },
        { id: 'jar-sparkle-4', type: 'tap-sparkle', targetId: 'jar-green', data: {} },
        { id: 'jar-sparkle-5', type: 'tap-sparkle', targetId: 'jar-pink', data: {} },
      ],
    },
  ],
};

export default function FeelingsMonster() {
  return <StoryBook story={storyData} />;
}
