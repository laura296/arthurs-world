import React from 'react';
import StoryBook from '../../components/StoryBook';

const storyData = {
  title: 'When I Feel Big',
  audioDir: '/arthurs-world/audio/when-i-feel-big',
  pages: [
    // ── Page 1: Little Bear, Big Feelings ──
    {
      bg: 'from-amber-300 to-orange-400',
      image: '/arthurs-world/images/when-i-feel-big/page-1.png',
      text: 'Little Bear sometimes has very BIG feelings inside. They feel too big for such a little bear!',
      elements: [
        { id: 'bear', x: 50, y: 50, hotspot: true, w: 160, h: 160, z: 3 },
        { id: 'feeling-cloud', x: 50, y: 20, hotspot: true, w: 120, h: 80, z: 2 },
        { id: 'tree', x: 15, y: 40, hotspot: true, w: 100, h: 120, z: 1 },
        { id: 'bird', x: 82, y: 25, hotspot: true, w: 65, h: 65, z: 2 },
      ],
      interactions: [
        { id: 'bear-say', type: 'tap-sound', targetId: 'bear', data: { say: 'Sometimes my feelings feel SO big!' } },
        { id: 'bear-wiggle', type: 'tap-wiggle', targetId: 'bear', data: {} },
        { id: 'cloud-grow', type: 'tap-grow', targetId: 'feeling-cloud', data: {} },
        { id: 'tree-shake', type: 'tap-shake', targetId: 'tree', data: {} },
        { id: 'bird-fly', type: 'tap-animate', targetId: 'bird', data: { animation: 'animate-fly', duration: 1100 } },
      ],
    },

    // ── Page 2: Excited! ──
    {
      bg: 'from-yellow-300 to-orange-300',
      image: '/arthurs-world/images/when-i-feel-big/page-2.png',
      text: 'Sometimes Little Bear feels EXCITED! His tummy goes fizzy and he wants to bounce and bounce!',
      elements: [
        { id: 'excited-bear', x: 45, y: 45, hotspot: true, w: 160, h: 160, z: 3 },
        { id: 'bounce-1', x: 30, y: 65, hotspot: true, w: 70, h: 70, z: 2 },
        { id: 'bounce-2', x: 65, y: 60, hotspot: true, w: 70, h: 70, z: 2 },
        { id: 'sparkle-zone', x: 50, y: 20, hotspot: true, w: 100, h: 60, z: 2 },
        { id: 'hidden-present', x: 85, y: 70, hotspot: true, w: 70, h: 70, z: 1 },
      ],
      interactions: [
        { id: 'excited-say', type: 'tap-sound', targetId: 'excited-bear', data: { say: 'I am SO excited! Wheee!' } },
        { id: 'excited-jump', type: 'tap-jump', targetId: 'excited-bear', data: {} },
        { id: 'bounce-jump-1', type: 'tap-jump', targetId: 'bounce-1', data: {} },
        { id: 'bounce-jump-2', type: 'tap-jump', targetId: 'bounce-2', data: {} },
        { id: 'sparkle', type: 'tap-sparkle', targetId: 'sparkle-zone', data: {} },
        { id: 'present-reveal', type: 'tap-reveal', targetId: 'hidden-present', data: { content: <span>🎁 A present!</span> } },
      ],
    },

    // ── Page 3: Frustrated ──
    {
      bg: 'from-orange-400 to-red-400',
      image: '/arthurs-world/images/when-i-feel-big/page-3.png',
      text: 'Sometimes Little Bear feels FRUSTRATED. His tower keeps falling down! He wants to stamp his feet!',
      elements: [
        { id: 'frustrated-bear', x: 40, y: 48, hotspot: true, w: 150, h: 150, z: 3 },
        { id: 'tower-block-1', x: 65, y: 55, hotspot: true, w: 80, h: 80, z: 2 },
        { id: 'tower-block-2', x: 65, y: 40, hotspot: true, w: 60, h: 60, z: 2 },
        { id: 'fallen-block', x: 78, y: 72, hotspot: true, w: 60, h: 60, z: 2 },
        { id: 'hidden-star', x: 20, y: 20, hotspot: true, w: 60, h: 60, z: 1 },
      ],
      interactions: [
        { id: 'frust-say', type: 'tap-sound', targetId: 'frustrated-bear', data: { say: 'Oh no! It fell down AGAIN!' } },
        { id: 'frust-shake', type: 'tap-shake', targetId: 'frustrated-bear', data: {} },
        { id: 'tower-wobble', type: 'tap-wiggle', targetId: 'tower-block-1', data: {} },
        { id: 'tower-spin', type: 'tap-spin', targetId: 'tower-block-2', data: {} },
        { id: 'fallen-jump', type: 'tap-jump', targetId: 'fallen-block', data: {} },
        { id: 'star-reveal', type: 'tap-reveal', targetId: 'hidden-star', data: { content: <span>⭐ Try again!</span> } },
      ],
    },

    // ── Page 4: Worried ──
    {
      bg: 'from-purple-300 to-indigo-400',
      image: '/arthurs-world/images/when-i-feel-big/page-4.png',
      text: 'Sometimes Little Bear feels WORRIED. His tummy feels knotty and his head is full of "what ifs".',
      elements: [
        { id: 'worried-bear', x: 45, y: 50, hotspot: true, w: 150, h: 150, z: 3 },
        { id: 'thought-bubble', x: 55, y: 18, hotspot: true, w: 110, h: 70, z: 2 },
        { id: 'knot', x: 45, y: 68, hotspot: true, w: 70, h: 60, z: 2 },
        { id: 'teddy', x: 80, y: 60, hotspot: true, w: 70, h: 70, z: 2 },
        { id: 'hidden-hug', x: 15, y: 70, hotspot: true, w: 70, h: 70, z: 1 },
      ],
      interactions: [
        { id: 'worried-say', type: 'tap-sound', targetId: 'worried-bear', data: { say: 'What if something goes wrong?' } },
        { id: 'worried-wiggle', type: 'tap-wiggle', targetId: 'worried-bear', data: {} },
        { id: 'thought-grow', type: 'tap-grow', targetId: 'thought-bubble', data: {} },
        { id: 'knot-spin', type: 'tap-spin', targetId: 'knot', data: {} },
        { id: 'teddy-jump', type: 'tap-jump', targetId: 'teddy', data: {} },
        { id: 'hug-reveal', type: 'tap-reveal', targetId: 'hidden-hug', data: { content: <span>🤗 A big hug!</span> } },
      ],
    },

    // ── Page 5: Proud ──
    {
      bg: 'from-amber-300 to-yellow-400',
      image: '/arthurs-world/images/when-i-feel-big/page-5.png',
      text: 'Sometimes Little Bear feels PROUD! He did something all by himself! His chest puffs up big!',
      elements: [
        { id: 'proud-bear', x: 45, y: 45, hotspot: true, w: 160, h: 160, z: 3 },
        { id: 'trophy', x: 75, y: 40, hotspot: true, w: 80, h: 80, z: 2 },
        { id: 'star-1', x: 25, y: 22, hotspot: true, w: 60, h: 60, z: 2 },
        { id: 'star-2', x: 65, y: 18, hotspot: true, w: 60, h: 60, z: 2 },
        { id: 'sparkle-zone', x: 45, y: 70, hotspot: true, w: 120, h: 60, z: 2 },
      ],
      interactions: [
        { id: 'proud-say', type: 'tap-sound', targetId: 'proud-bear', data: { say: 'I did it all by myself! Look!' } },
        { id: 'proud-grow', type: 'tap-grow', targetId: 'proud-bear', data: {} },
        { id: 'trophy-spin', type: 'tap-spin', targetId: 'trophy', data: {} },
        { id: 'star-sparkle-1', type: 'tap-sparkle', targetId: 'star-1', data: {} },
        { id: 'star-sparkle-2', type: 'tap-sparkle', targetId: 'star-2', data: {} },
        { id: 'sparkle', type: 'tap-sparkle', targetId: 'sparkle-zone', data: {} },
      ],
    },

    // ── Page 6: Shy ──
    {
      bg: 'from-sky-200 to-blue-300',
      image: '/arthurs-world/images/when-i-feel-big/page-6.png',
      text: 'Sometimes Little Bear feels SHY. He hides behind Mummy and peeks out with one little eye.',
      elements: [
        { id: 'shy-bear', x: 55, y: 55, hotspot: true, w: 120, h: 120, z: 3 },
        { id: 'mummy-bear', x: 40, y: 45, hotspot: true, w: 160, h: 160, z: 2 },
        { id: 'peek-eye', x: 55, y: 45, hotspot: true, w: 50, h: 50, z: 4 },
        { id: 'friend', x: 80, y: 55, hotspot: true, w: 100, h: 100, z: 2 },
        { id: 'hidden-wave', x: 20, y: 70, hotspot: true, w: 60, h: 60, z: 1 },
      ],
      interactions: [
        { id: 'shy-say', type: 'tap-sound', targetId: 'shy-bear', data: { say: 'I feel a bit shy...' } },
        { id: 'shy-wiggle', type: 'tap-wiggle', targetId: 'shy-bear', data: {} },
        { id: 'mummy-say', type: 'tap-sound', targetId: 'mummy-bear', data: { say: 'It is okay, I am right here.' } },
        { id: 'peek-sparkle', type: 'tap-sparkle', targetId: 'peek-eye', data: {} },
        { id: 'friend-jump', type: 'tap-jump', targetId: 'friend', data: {} },
        { id: 'wave-reveal', type: 'tap-reveal', targetId: 'hidden-wave', data: { content: <span>👋 Hello!</span> } },
      ],
    },

    // ── Page 7: Sleepy ──
    {
      bg: 'from-indigo-300 to-purple-500',
      image: '/arthurs-world/images/when-i-feel-big/page-7.png',
      text: 'Sometimes Little Bear feels SLEEPY. His eyes go droopy and he does big yawns. Time for bed!',
      elements: [
        { id: 'sleepy-bear', x: 45, y: 50, hotspot: true, w: 160, h: 160, z: 3 },
        { id: 'moon', x: 75, y: 18, hotspot: true, w: 90, h: 90, z: 2 },
        { id: 'star-1', x: 25, y: 20, hotspot: true, w: 55, h: 55, z: 2 },
        { id: 'star-2', x: 60, y: 12, hotspot: true, w: 50, h: 50, z: 2 },
        { id: 'zzz', x: 58, y: 35, hotspot: true, w: 70, h: 50, z: 4 },
      ],
      interactions: [
        { id: 'sleepy-say', type: 'tap-sound', targetId: 'sleepy-bear', data: { say: 'Yaaaawn! I am so sleepy.' } },
        { id: 'sleepy-wiggle', type: 'tap-wiggle', targetId: 'sleepy-bear', data: {} },
        { id: 'moon-spin', type: 'tap-spin', targetId: 'moon', data: {} },
        { id: 'star-sparkle-1', type: 'tap-sparkle', targetId: 'star-1', data: {} },
        { id: 'star-sparkle-2', type: 'tap-sparkle', targetId: 'star-2', data: {} },
        { id: 'zzz-grow', type: 'tap-grow', targetId: 'zzz', data: {} },
      ],
    },

    // ── Page 8: All Feelings Are Okay ──
    {
      bg: 'from-amber-200 to-rose-300',
      image: '/arthurs-world/images/when-i-feel-big/page-8.png',
      text: 'ALL of Little Bear\'s feelings are okay. Big or small, happy or sad — every feeling matters. You are wonderful just as you are!',
      elements: [
        { id: 'happy-bear', x: 50, y: 40, hotspot: true, w: 170, h: 170, z: 3 },
        { id: 'rainbow', x: 50, y: 15, hotspot: true, w: 150, h: 60, z: 2 },
        { id: 'heart-1', x: 20, y: 55, hotspot: true, w: 70, h: 70, z: 2 },
        { id: 'heart-2', x: 80, y: 55, hotspot: true, w: 70, h: 70, z: 2 },
        { id: 'star', x: 50, y: 72, hotspot: true, w: 80, h: 80, z: 2 },
      ],
      interactions: [
        { id: 'bear-say', type: 'tap-sound', targetId: 'happy-bear', data: { say: 'All my feelings are important! I love you!' } },
        { id: 'bear-jump', type: 'tap-jump', targetId: 'happy-bear', data: {} },
        { id: 'rainbow-sparkle', type: 'tap-sparkle', targetId: 'rainbow', data: {} },
        { id: 'heart-grow-1', type: 'tap-grow', targetId: 'heart-1', data: {} },
        { id: 'heart-grow-2', type: 'tap-grow', targetId: 'heart-2', data: {} },
        { id: 'star-spin', type: 'tap-spin', targetId: 'star', data: {} },
      ],
    },
  ],
};

export default function WhenIFeelBig() {
  return <StoryBook story={storyData} />;
}
