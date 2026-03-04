import React from 'react';
import StoryBook from '../components/StoryBook';
import MeadowScene from '../components/scenes/MeadowScene';

const storyData = {
  title: 'The Sing-Song of Old Man Kangaroo',
  audioDir: '/arthurs-world/audio/old-man-kangaroo',
  pages: [
    // ── Page 1: Four Short Legs ──
    {
      bg: 'from-amber-200 to-orange-400',
      image: '/arthurs-world/images/old-man-kangaroo/page-1.png',
      scene: <MeadowScene />,
      text: 'A long time ago, Kangaroo had four short legs, all the same size. He walked slowly like everyone else.',
      elements: [
        { id: 'kangaroo-walking', x: 50, y: 52, hotspot: true, w: 90, h: 90, label: 'Kangaroo', z: 3 },
        { id: 'sun-outback', x: 82, y: 12, hotspot: true, w: 60, h: 60, label: 'Sun', z: 1 },
        { id: 'tree-left', x: 14, y: 40, hotspot: true, w: 70, h: 90, label: 'Tree', z: 2 },
        { id: 'turtle-slow', x: 72, y: 62, hotspot: true, w: 60, h: 60, label: 'Turtle', z: 2 },
        { id: 'hidden-worm', x: 30, y: 72, hotspot: true, w: 50, h: 50, label: 'Worm', z: 1 },
      ],
      interactions: [
        { id: 'kangaroo-walk-jump', type: 'tap-jump', targetId: 'kangaroo-walking', data: {} },
        { id: 'sun-spin', type: 'tap-spin', targetId: 'sun-outback', data: {} },
        { id: 'tree-shake', type: 'tap-shake', targetId: 'tree-left', data: {} },
        { id: 'turtle-slow-wiggle', type: 'tap-wiggle', targetId: 'turtle-slow', data: {} },
        { id: 'worm-reveal', type: 'tap-reveal', targetId: 'hidden-worm', data: { content: 'A worm! \uD83E\uDEB1' } },
      ],
    },

    // ── Page 2: Boastful Kangaroo ──
    {
      bg: 'from-yellow-300 to-orange-500',
      image: '/arthurs-world/images/old-man-kangaroo/page-2.png',
      scene: <MeadowScene />,
      text: 'Kangaroo was a bit boastful. He said "I want to be DIFFERENT from all the other animals!"',
      elements: [
        { id: 'proud-kangaroo', x: 50, y: 42, hotspot: true, w: 90, h: 90, label: 'Kangaroo', z: 3 },
        { id: 'speech-bubble', x: 50, y: 14, hotspot: true, w: 60, h: 50, label: 'Speech', z: 2 },
        { id: 'zebra-watching', x: 15, y: 50, hotspot: true, w: 60, h: 70, label: 'Zebra', z: 2 },
        { id: 'elephant-watching', x: 85, y: 46, hotspot: true, w: 60, h: 70, label: 'Elephant', z: 2 },
        { id: 'star-special', x: 32, y: 18, hotspot: true, w: 50, h: 50, label: 'Star', z: 1 },
      ],
      interactions: [
        { id: 'kangaroo-boast-grow', type: 'tap-grow', targetId: 'proud-kangaroo', data: {} },
        { id: 'kangaroo-boast-sound', type: 'character-speak', targetId: 'proud-kangaroo', data: { say: 'I want to be different!' } },
        { id: 'speech-sparkle', type: 'tap-sparkle', targetId: 'speech-bubble', data: {} },
        { id: 'zebra-wiggle', type: 'tap-wiggle', targetId: 'zebra-watching', data: {} },
        { id: 'star-sparkle', type: 'tap-sparkle', targetId: 'star-special', data: {} },
      ],
    },

    // ── Page 3: Asks Nqong ──
    {
      bg: 'from-orange-300 to-red-400',
      image: '/arthurs-world/images/old-man-kangaroo/page-3.png',
      scene: <MeadowScene />,
      text: 'He went to the big god Nqong and said "Make me special! Make me famous by five o\'clock today!"',
      elements: [
        { id: 'nqong-god', x: 30, y: 35, hotspot: true, w: 90, h: 100, label: 'Nqong', z: 3 },
        { id: 'begging-kangaroo', x: 70, y: 48, hotspot: true, w: 80, h: 80, label: 'Kangaroo', z: 3 },
        { id: 'magic-sparkles', x: 30, y: 12, hotspot: true, w: 50, h: 50, label: 'Sparkles', z: 2 },
        { id: 'clock-five', x: 88, y: 14, hotspot: true, w: 50, h: 50, label: 'Clock', z: 2 },
        { id: 'hidden-spider', x: 14, y: 68, hotspot: true, w: 50, h: 50, label: 'Spider', z: 1 },
      ],
      interactions: [
        { id: 'nqong-sparkle', type: 'tap-sparkle', targetId: 'nqong-god', data: {} },
        { id: 'nqong-grow', type: 'tap-grow', targetId: 'nqong-god', data: {} },
        { id: 'kangaroo-beg-sound', type: 'character-speak', targetId: 'begging-kangaroo', data: { say: 'Make me special!' } },
        { id: 'clock-spin', type: 'tap-spin', targetId: 'clock-five', data: {} },
        { id: 'spider-reveal', type: 'tap-reveal', targetId: 'hidden-spider', data: { content: 'A spider! \uD83D\uDD77\uFE0F' } },
      ],
    },

    // ── Page 4: Dingo Summoned ──
    {
      bg: 'from-red-300 to-orange-500',
      image: '/arthurs-world/images/old-man-kangaroo/page-4.png',
      scene: <MeadowScene />,
      text: 'Nqong pointed to a big yellow dog called Dingo and said "Dingo! Chase that kangaroo!"',
      elements: [
        { id: 'nqong-pointing', x: 20, y: 35, hotspot: true, w: 80, h: 90, label: 'Nqong', z: 3 },
        { id: 'dingo-dog', x: 50, y: 48, hotspot: true, w: 80, h: 80, label: 'Dingo', z: 3 },
        { id: 'scared-kangaroo', x: 80, y: 44, hotspot: true, w: 80, h: 80, label: 'Kangaroo', z: 3 },
      ],
      interactions: [
        { id: 'nqong-command-sound', type: 'character-speak', targetId: 'nqong-pointing', data: { say: 'Dingo! Chase that kangaroo!' } },
        { id: 'dingo-shake', type: 'tap-shake', targetId: 'dingo-dog', data: {} },
        { id: 'kangaroo-scared-jump', type: 'tap-jump', targetId: 'scared-kangaroo', data: {} },
      ],
    },

    // ── Page 5: Desert Chase ──
    {
      bg: 'from-yellow-400 to-orange-600',
      image: '/arthurs-world/images/old-man-kangaroo/page-5.png',
      scene: <MeadowScene />,
      text: 'Dingo chased Kangaroo across the sandy desert! Run, run, run!',
      elements: [
        { id: 'running-kangaroo', x: 70, y: 42, hotspot: true, w: 90, h: 90, label: 'Kangaroo', z: 3 },
        { id: 'chasing-dingo', x: 30, y: 48, hotspot: true, w: 80, h: 80, label: 'Dingo', z: 3 },
        { id: 'cactus-desert', x: 12, y: 52, hotspot: true, w: 60, h: 80, label: 'Cactus', z: 1 },
        { id: 'hot-sun', x: 85, y: 12, hotspot: true, w: 60, h: 60, label: 'Sun', z: 1 },
      ],
      interactions: [
        { id: 'kangaroo-run-jump', type: 'tap-jump', targetId: 'running-kangaroo', data: {} },
        { id: 'kangaroo-run-sound', type: 'character-speak', targetId: 'running-kangaroo', data: { say: 'Run run run!' } },
        { id: 'dingo-chase-shake', type: 'tap-shake', targetId: 'chasing-dingo', data: {} },
        { id: 'cactus-wiggle', type: 'tap-wiggle', targetId: 'cactus-desert', data: {} },
        { id: 'sun-spin', type: 'tap-spin', targetId: 'hot-sun', data: {} },
      ],
    },

    // ── Page 6: Grassland Chase ──
    {
      bg: 'from-orange-400 to-yellow-600',
      image: '/arthurs-world/images/old-man-kangaroo/page-6.png',
      scene: <MeadowScene />,
      text: 'Dingo chased him through the tall grasslands! Hop, hop, hop! Kangaroo started jumping to go faster!',
      elements: [
        { id: 'hopping-kangaroo', x: 65, y: 38, hotspot: true, w: 90, h: 90, label: 'Kangaroo', z: 3 },
        { id: 'dingo-grass', x: 25, y: 50, hotspot: true, w: 80, h: 80, label: 'Dingo', z: 3 },
        { id: 'grass-tall', x: 45, y: 62, hotspot: true, w: 70, h: 60, label: 'Grass', z: 2 },
        { id: 'hidden-snake', x: 88, y: 66, hotspot: true, w: 50, h: 50, label: 'Snake', z: 1 },
        { id: 'bird-watching', x: 14, y: 16, hotspot: true, w: 50, h: 50, label: 'Bird', z: 1 },
      ],
      interactions: [
        { id: 'kangaroo-hop-jump', type: 'tap-jump', targetId: 'hopping-kangaroo', data: {} },
        { id: 'kangaroo-hop-sound', type: 'character-speak', targetId: 'hopping-kangaroo', data: { say: 'Hop hop hop!' } },
        { id: 'dingo-grass-shake', type: 'tap-shake', targetId: 'dingo-grass', data: {} },
        { id: 'grass-wiggle', type: 'tap-wiggle', targetId: 'grass-tall', data: {} },
        { id: 'snake-reveal', type: 'tap-reveal', targetId: 'hidden-snake', data: { content: 'A snake! \uD83D\uDC0D' } },
        { id: 'bird-spin', type: 'tap-spin', targetId: 'bird-watching', data: {} },
      ],
    },

    // ── Page 7: Mountain Chase ──
    {
      bg: 'from-red-400 to-orange-600',
      image: '/arthurs-world/images/old-man-kangaroo/page-7.png',
      scene: <MeadowScene />,
      text: 'Dingo chased him over the rocky mountains! JUMP! JUMP! JUMP! His back legs grew bigger and stronger!',
      elements: [
        { id: 'jumping-kangaroo', x: 60, y: 32, hotspot: true, w: 90, h: 90, label: 'Kangaroo', z: 3 },
        { id: 'dingo-mountain', x: 22, y: 52, hotspot: true, w: 70, h: 80, label: 'Dingo', z: 3 },
        { id: 'mountain-peak', x: 50, y: 18, hotspot: true, w: 70, h: 60, label: 'Mountain', z: 1 },
      ],
      interactions: [
        { id: 'kangaroo-jump-jump', type: 'tap-jump', targetId: 'jumping-kangaroo', data: {} },
        { id: 'kangaroo-jump-sound', type: 'character-speak', targetId: 'jumping-kangaroo', data: { say: 'JUMP! JUMP! JUMP!' } },
        { id: 'dingo-mountain-shake', type: 'tap-shake', targetId: 'dingo-mountain', data: {} },
        { id: 'mountain-sparkle', type: 'tap-sparkle', targetId: 'mountain-peak', data: {} },
      ],
    },

    // ── Page 8: New Legs ──
    {
      bg: 'from-amber-400 to-red-500',
      image: '/arthurs-world/images/old-man-kangaroo/page-8.png',
      scene: <MeadowScene />,
      text: 'By the time Dingo stopped chasing, Kangaroo\'s back legs were HUGE and his front legs were tiny!',
      elements: [
        { id: 'changed-kangaroo', x: 50, y: 40, hotspot: true, w: 100, h: 100, label: 'Kangaroo', z: 3 },
        { id: 'tired-dingo', x: 18, y: 52, hotspot: true, w: 70, h: 70, label: 'Dingo', z: 2 },
      ],
      interactions: [
        { id: 'kangaroo-changed-grow', type: 'tap-grow', targetId: 'changed-kangaroo', data: {} },
        { id: 'kangaroo-changed-sparkle', type: 'tap-sparkle', targetId: 'changed-kangaroo', data: {} },
        { id: 'dingo-tired-wiggle', type: 'tap-wiggle', targetId: 'tired-dingo', data: {} },
      ],
    },

    // ── Page 9: Bouncy Kangaroo ──
    {
      bg: 'from-yellow-300 to-amber-500',
      image: '/arthurs-world/images/old-man-kangaroo/page-9.png',
      scene: <MeadowScene />,
      text: 'Now Kangaroo could HOP so high and so far! He was the bounciest animal in the whole world!',
      elements: [
        { id: 'bouncy-kangaroo', x: 50, y: 36, hotspot: true, w: 100, h: 100, label: 'Kangaroo', z: 3 },
        { id: 'cloud-high', x: 30, y: 12, hotspot: true, w: 60, h: 50, label: 'Cloud', z: 1 },
        { id: 'rainbow-arc', x: 75, y: 14, hotspot: true, w: 60, h: 50, label: 'Rainbow', z: 1 },
      ],
      interactions: [
        { id: 'kangaroo-bounce-jump', type: 'tap-jump', targetId: 'bouncy-kangaroo', data: {} },
        { id: 'kangaroo-bounce-sound', type: 'character-speak', targetId: 'bouncy-kangaroo', data: { say: 'Boing! Boing! Boing!' } },
        { id: 'cloud-spin', type: 'tap-spin', targetId: 'cloud-high', data: {} },
        { id: 'rainbow-sparkle', type: 'tap-sparkle', targetId: 'rainbow-arc', data: {} },
      ],
    },

    // ── Page 10: The End ──
    {
      bg: 'from-orange-300 to-red-500',
      image: '/arthurs-world/images/old-man-kangaroo/page-10.png',
      scene: <MeadowScene />,
      text: 'And that is how the kangaroo got his strong jumping legs! The end!',
      elements: [
        { id: 'happy-kangaroo', x: 50, y: 38, hotspot: true, w: 100, h: 100, label: 'Kangaroo', z: 3 },
        { id: 'dingo-friend', x: 82, y: 52, hotspot: true, w: 70, h: 70, label: 'Dingo', z: 2 },
        { id: 'hidden-lizard', x: 25, y: 66, hotspot: true, w: 50, h: 50, label: 'Lizard', z: 1 },
      ],
      interactions: [
        { id: 'kangaroo-end-jump', type: 'tap-jump', targetId: 'happy-kangaroo', data: {} },
        { id: 'kangaroo-end-sound', type: 'character-speak', targetId: 'happy-kangaroo', data: { say: 'The end!' } },
        { id: 'dingo-friend-wiggle', type: 'tap-wiggle', targetId: 'dingo-friend', data: {} },
        { id: 'lizard-reveal', type: 'tap-reveal', targetId: 'hidden-lizard', data: { content: 'A lizard! \uD83E\uDD8E' } },
      ],
    },
  ],
};

export default function OldManKangaroo() {
  return <StoryBook story={storyData} />;
}
