import React from 'react';
import StoryBook from '../components/StoryBook';

const storyData = {
  title: "The Elephant's Child",
  audioDir: '/arthurs-world/audio/elephant-child',
  pages: [

    // ── Page 1: Once upon a time — curious baby elephant ──
    {
      bg: 'from-amber-300 to-emerald-500',
      image: '/arthurs-world/images/elephant-child/page-1.webp',
      text: 'Once upon a time, elephants had little stubby noses! But this baby elephant was SO SO curious!',
      elements: [
        { id: 'baby-elephant', x: 50, y: 50, hotspot: true, w: 140, h: 120, z: 3 },
        { id: 'mama-elephant', x: 20, y: 46, hotspot: true, w: 130, h: 110, z: 2 },
        { id: 'butterfly', x: 72, y: 25, hotspot: true, w: 80, h: 70, z: 4 },
        { id: 'flower-1', x: 85, y: 62, hotspot: true, w: 70, h: 60, z: 1 },
        { id: 'hidden-ladybird', x: 12, y: 68, hotspot: true, w: 50, h: 50, z: 1 },
      ],
      interactions: [
        { id: 'i1', targetId: 'baby-elephant', type: 'character-speak', data: { say: 'Why why WHY? I have SO many questions!' } },
        { id: 'i2', targetId: 'mama-elephant', type: 'character-speak', data: { say: 'Oh my curious little one!' } },
        { id: 'i3', targetId: 'butterfly', type: 'flap-reveal', data: { revealContent: 'Hello!' } },
        { id: 'i4', targetId: 'flower-1', type: 'tap-sparkle', data: {} },
        { id: 'i5', targetId: 'hidden-ladybird', type: 'peek-a-boo', data: {} },
      ],
    },

    // ── Page 2: The elephant asks EVERYONE ──
    {
      bg: 'from-green-400 to-amber-400',
      image: '/arthurs-world/images/elephant-child/page-2.webp',
      text: '"What does the Crocodile have for dinner?" he asked. But NOBODY would tell him!',
      elements: [
        { id: 'baby-q', x: 50, y: 48, hotspot: true, w: 130, h: 110, z: 4 },
        { id: 'hippo', x: 18, y: 50, hotspot: true, w: 120, h: 100, z: 3 },
        { id: 'giraffe', x: 82, y: 35, hotspot: true, w: 110, h: 100, z: 2 },
        { id: 'bird', x: 65, y: 20, hotspot: true, w: 80, h: 70, z: 2 },
        { id: 'hidden-frog', x: 35, y: 70, hotspot: true, w: 50, h: 50, z: 1 },
      ],
      interactions: [
        { id: 'i1', targetId: 'baby-q', type: 'character-speak', data: { say: 'What does the Crocodile eat? Please please PLEASE tell me!' } },
        { id: 'i2', targetId: 'hippo', type: 'character-speak', data: { say: 'Shh! We do not talk about that!' } },
        { id: 'i3', targetId: 'giraffe', type: 'character-speak', data: { say: 'Do not ask ME!' } },
        { id: 'i4', targetId: 'bird', type: 'flap-reveal', data: { revealContent: 'Go and see!' } },
        { id: 'i5', targetId: 'hidden-frog', type: 'peek-a-boo', data: {} },
      ],
    },

    // ── Page 3: Setting off on the journey ──
    {
      bg: 'from-sky-400 to-amber-400',
      image: '/arthurs-world/images/elephant-child/page-3.webp',
      text: 'So the brave little elephant set off to find the great grey-green Crocodile. Off he went!',
      elements: [
        { id: 'baby-go', x: 65, y: 48, hotspot: true, w: 130, h: 110, z: 4 },
        { id: 'mama-wave', x: 22, y: 46, hotspot: true, w: 120, h: 100, z: 3 },
        { id: 'footprints', x: 50, y: 68, hotspot: true, w: 100, h: 80, z: 1 },
        { id: 'adventure-bag', x: 80, y: 32, hotspot: true, w: 70, h: 60, z: 2 },
        { id: 'hidden-snail', x: 40, y: 72, hotspot: true, w: 50, h: 50, z: 1 },
      ],
      interactions: [
        { id: 'i1', targetId: 'baby-go', type: 'character-speak', data: { say: 'Goodbye everybody! I will find out!' } },
        { id: 'i2', targetId: 'mama-wave', type: 'character-speak', data: { say: 'Be careful, little one!' } },
        { id: 'i3', targetId: 'footprints', type: 'scene-transform', data: { transformId: 'footprints', value: true } },
        { id: 'i4', targetId: 'adventure-bag', type: 'tap-jump', data: {} },
        { id: 'i5', targetId: 'hidden-snail', type: 'peek-a-boo', data: {} },
      ],
    },

    // ── Page 4: Arriving at the great river ──
    {
      bg: 'from-emerald-500 to-teal-500',
      image: '/arthurs-world/images/elephant-child/page-4.webp',
      text: 'He came to the great grey-green greasy Limpopo River. It was big and wide and full of surprises!',
      elements: [
        { id: 'baby-river', x: 22, y: 45, hotspot: true, w: 130, h: 110, z: 4 },
        { id: 'croc-eyes', x: 58, y: 52, hotspot: true, w: 100, h: 80, z: 3 },
        { id: 'reeds', x: 82, y: 42, hotspot: true, w: 80, h: 80, z: 2 },
        { id: 'dragonfly', x: 42, y: 22, hotspot: true, w: 70, h: 60, z: 2 },
        { id: 'lily-pad', x: 68, y: 68, hotspot: true, w: 70, h: 60, z: 1 },
      ],
      interactions: [
        { id: 'i1', targetId: 'baby-river', type: 'character-speak', data: { say: 'Is this where the Crocodile lives?' } },
        { id: 'i2', targetId: 'croc-eyes', type: 'peek-a-boo', data: {} },
        { id: 'i3', targetId: 'reeds', type: 'tap-shake', data: {} },
        { id: 'i4', targetId: 'dragonfly', type: 'tap-sparkle', data: {} },
        { id: 'i5', targetId: 'lily-pad', type: 'tap-jump', data: {} },
      ],
    },

    // ── Page 5: The Crocodile appears ──
    {
      bg: 'from-teal-500 to-emerald-700',
      image: '/arthurs-world/images/elephant-child/page-5.webp',
      text: '"Come closer, little one," said a sneaky voice. "I am the Crocodile!" He had BIG teeth and a BIG smile!',
      elements: [
        { id: 'baby-nervous', x: 22, y: 48, hotspot: true, w: 130, h: 110, z: 4 },
        { id: 'croc-smile', x: 62, y: 50, hotspot: true, w: 150, h: 120, z: 3 },
        { id: 'bubbles', x: 50, y: 70, hotspot: true, w: 80, h: 60, z: 1 },
        { id: 'hidden-fish', x: 85, y: 60, hotspot: true, w: 50, h: 50, z: 1 },
      ],
      interactions: [
        { id: 'i1', targetId: 'baby-nervous', type: 'character-speak', data: { say: 'Are you r-really the Crocodile?' } },
        { id: 'i2', targetId: 'croc-smile', type: 'character-speak', data: { say: 'Come closer, little one! I will tell you a SECRET!' } },
        { id: 'i3', targetId: 'bubbles', type: 'tap-sparkle', data: {} },
        { id: 'i4', targetId: 'hidden-fish', type: 'peek-a-boo', data: {} },
      ],
    },

    // ── Page 6: SNAP! The crocodile grabs the nose! ──
    {
      bg: 'from-red-400 to-emerald-600',
      image: '/arthurs-world/images/elephant-child/page-6.webp',
      text: 'SNAP! The naughty Crocodile grabbed the elephant by his little nose! "Today I will have elephant for dinner!"',
      elements: [
        { id: 'baby-snap', x: 28, y: 46, hotspot: true, w: 130, h: 110, z: 4 },
        { id: 'croc-bite', x: 58, y: 48, hotspot: true, w: 150, h: 120, z: 5 },
        { id: 'splash', x: 50, y: 68, hotspot: true, w: 100, h: 80, z: 2 },
        { id: 'snap-fx', x: 44, y: 28, hotspot: true, w: 90, h: 80, z: 6 },
        { id: 'worried-bird', x: 88, y: 22, hotspot: true, w: 60, h: 60, z: 1 },
      ],
      interactions: [
        { id: 'i1', targetId: 'snap-fx', type: 'tap-shake', data: {} },
        { id: 'i2', targetId: 'splash', type: 'scene-transform', data: { transformId: 'splash', value: true } },
        { id: 'i3', targetId: 'baby-snap', type: 'character-speak', data: { say: 'Let GO! You are hurting me!' } },
        { id: 'i4', targetId: 'croc-bite', type: 'character-speak', data: { say: 'I think today I will have elephant for dinner!' } },
        { id: 'i5', targetId: 'worried-bird', type: 'tap-jump', data: {} },
      ],
    },

    // ── Page 7: Tug of war — the nose STRETCHES! ──
    {
      bg: 'from-amber-400 to-teal-500',
      image: '/arthurs-world/images/elephant-child/page-7.webp',
      text: 'The elephant PULLED and the crocodile PULLED. His nose stretched and stretched and STRETCHED!',
      elements: [
        { id: 'baby-pull', x: 20, y: 44, hotspot: true, w: 130, h: 110, z: 4 },
        { id: 'croc-pull', x: 65, y: 48, hotspot: true, w: 140, h: 110, z: 5 },
        { id: 'stretchy-nose', x: 42, y: 50, hotspot: true, w: 120, h: 80, z: 3 },
        { id: 'pull-count', x: 50, y: 22, hotspot: true, w: 90, h: 80, z: 6 },
        { id: 'cheering-frog', x: 88, y: 65, hotspot: true, w: 50, h: 50, z: 1 },
      ],
      interactions: [
        { id: 'i1', targetId: 'pull-count', type: 'tap-count', data: { max: 5, say: 'PULL! PULL! PULL!' } },
        { id: 'i2', targetId: 'baby-pull', type: 'character-speak', data: { say: 'This is too much for me!' } },
        { id: 'i3', targetId: 'croc-pull', type: 'character-speak', data: { say: 'I will NOT let go!' } },
        { id: 'i4', targetId: 'stretchy-nose', type: 'tap-grow', data: {} },
        { id: 'i5', targetId: 'cheering-frog', type: 'tap-jump', data: {} },
      ],
    },

    // ── Page 8: POP! The crocodile lets go ──
    {
      bg: 'from-sky-400 to-green-400',
      image: '/arthurs-world/images/elephant-child/page-8.webp',
      text: 'POP! The Crocodile let go at last! But oh my! The elephant\'s nose had stretched into a lovely long trunk!',
      elements: [
        { id: 'baby-free', x: 45, y: 45, hotspot: true, w: 140, h: 120, z: 4 },
        { id: 'croc-splash', x: 82, y: 55, hotspot: true, w: 100, h: 90, z: 2 },
        { id: 'pop-fx', x: 45, y: 20, hotspot: true, w: 90, h: 80, z: 5 },
        { id: 'surprised-fish', x: 15, y: 60, hotspot: true, w: 60, h: 60, z: 1 },
      ],
      interactions: [
        { id: 'i1', targetId: 'baby-free', type: 'character-speak', data: { say: 'My nose! It is SO long now!' } },
        { id: 'i2', targetId: 'pop-fx', type: 'tap-sound', data: { say: 'POP!' } },
        { id: 'i3', targetId: 'croc-splash', type: 'tap-animate', data: { animation: 'animate-fly', duration: 1000 } },
        { id: 'i4', targetId: 'surprised-fish', type: 'tap-jump', data: {} },
      ],
    },

    // ── Page 9: Discovering the trunk is wonderful! ──
    {
      bg: 'from-green-400 to-amber-400',
      image: '/arthurs-world/images/elephant-child/page-9.webp',
      text: 'But wait — the long trunk was WONDERFUL! He could pick fruit, spray water, and swat flies!',
      elements: [
        { id: 'baby-play', x: 45, y: 45, hotspot: true, w: 140, h: 120, z: 4 },
        { id: 'fruit-1', x: 22, y: 28, hotspot: true, w: 70, h: 60, z: 3 },
        { id: 'fruit-2', x: 72, y: 25, hotspot: true, w: 70, h: 60, z: 3 },
        { id: 'fruit-3', x: 80, y: 38, hotspot: true, w: 70, h: 60, z: 3 },
        { id: 'water-spray', x: 18, y: 58, hotspot: true, w: 80, h: 70, z: 2 },
      ],
      interactions: [
        { id: 'i1', targetId: 'fruit-1', type: 'collect', data: { target: 'fruit', max: 3 } },
        { id: 'i2', targetId: 'fruit-2', type: 'collect', data: { target: 'fruit', max: 3 } },
        { id: 'i3', targetId: 'fruit-3', type: 'collect', data: { target: 'fruit', max: 3 } },
        { id: 'i4', targetId: 'water-spray', type: 'scene-transform', data: { transformId: 'fountain', value: true } },
        { id: 'i5', targetId: 'baby-play', type: 'character-speak', data: { say: 'This trunk is AMAZING!' } },
      ],
    },

    // ── Page 10: All elephants want long trunks! ──
    {
      bg: 'from-amber-400 to-pink-400',
      image: '/arthurs-world/images/elephant-child/page-10.webp',
      text: 'And from that day, ALL elephants had long wonderful trunks! The End!',
      elements: [
        { id: 'baby-proud', x: 50, y: 45, hotspot: true, w: 140, h: 120, z: 4 },
        { id: 'mama-proud', x: 20, y: 44, hotspot: true, w: 130, h: 110, z: 3 },
        { id: 'star-1', x: 35, y: 18, hotspot: true, w: 70, h: 70, z: 2 },
        { id: 'star-2', x: 65, y: 15, hotspot: true, w: 70, h: 70, z: 2 },
        { id: 'hearts', x: 50, y: 72, hotspot: true, w: 80, h: 70, z: 2 },
        { id: 'the-end', x: 85, y: 68, hotspot: true, w: 80, h: 80, z: 5 },
      ],
      interactions: [
        { id: 'i1', targetId: 'baby-proud', type: 'character-speak', data: { say: 'I love my new trunk!' } },
        { id: 'i2', targetId: 'mama-proud', type: 'character-speak', data: { say: 'You are SO brave, my little one!' } },
        { id: 'i3', targetId: 'star-1', type: 'tap-sparkle', data: {} },
        { id: 'i4', targetId: 'star-2', type: 'tap-sparkle', data: {} },
        { id: 'i5', targetId: 'hearts', type: 'tap-color', data: { colors: ['#EF4444', '#EC4899', '#F59E0B', '#8B5CF6', '#10B981'] } },
        { id: 'i6', targetId: 'the-end', type: 'tap-animate', data: { animation: 'animate-dance', duration: 1000 } },
      ],
    },
  ],
};

export default function ElephantChild() {
  return <StoryBook story={storyData} />;
}
