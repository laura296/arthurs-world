import React from 'react';
import StoryBook from '../../components/StoryBook';

const storyData = {
  title: 'My Feelings Friends',
  endMessage: 'Every feeling is your friend! 🐰🐱🐶💛',
  pages: [
    // ── Page 1: Meet the Friends ──
    {
      bg: 'from-sky-200 to-amber-200',
      image: '/arthurs-world/images/feelings-friends/page-1.png',
      text: 'Did you know? Every feeling has a little animal friend! Let us meet them all!',
      elements: [
        { id: 'bunny', x: 25, y: 50, hotspot: true, w: 100, h: 100, z: 2 },
        { id: 'kitten', x: 50, y: 45, hotspot: true, w: 100, h: 100, z: 2 },
        { id: 'puppy', x: 75, y: 50, hotspot: true, w: 100, h: 100, z: 2 },
        { id: 'sun', x: 50, y: 15, hotspot: true, w: 90, h: 90, z: 1 },
        { id: 'hidden-butterfly', x: 85, y: 25, hotspot: true, w: 60, h: 60, z: 1 },
      ],
      interactions: [
        { id: 'bunny-jump', type: 'tap-jump', targetId: 'bunny', data: {} },
        { id: 'bunny-say', type: 'character-speak', targetId: 'bunny', data: { say: 'Hello! I am Bunny!', character: 'bunny' } },
        { id: 'kitten-say', type: 'character-speak', targetId: 'kitten', data: { say: 'Miaow! I am Kitten!', character: 'kitten' } },
        { id: 'kitten-wiggle', type: 'tap-wiggle', targetId: 'kitten', data: {} },
        { id: 'puppy-say', type: 'character-speak', targetId: 'puppy', data: { say: 'Woof! I am Puppy!', character: 'puppy' } },
        { id: 'sun-spin', type: 'tap-spin', targetId: 'sun', data: {} },
        { id: 'butterfly-reveal', type: 'tap-reveal', targetId: 'hidden-butterfly', data: { content: <span>🦋</span> } },
      ],
    },

    // ── Page 2: Happy Bunny ──
    {
      bg: 'from-yellow-200 to-amber-300',
      image: '/arthurs-world/images/feelings-friends/page-2.png',
      text: 'Happy Bunny hops and hops! When YOU feel happy, what makes you want to hop?',
      elements: [
        { id: 'happy-bunny', x: 45, y: 45, hotspot: true, w: 160, h: 160, z: 3 },
        { id: 'flower-1', x: 20, y: 68, hotspot: true, w: 75, h: 75, z: 2 },
        { id: 'flower-2', x: 75, y: 65, hotspot: true, w: 75, h: 75, z: 2 },
        { id: 'carrot', x: 70, y: 40, hotspot: true, w: 70, h: 70, z: 2 },
        { id: 'sunshine', x: 80, y: 15, hotspot: true, w: 90, h: 90, z: 1 },
      ],
      interactions: [
        { id: 'bunny-say', type: 'character-speak', targetId: 'happy-bunny', data: { say: 'I am so happy! Boing boing boing!', character: 'bunny' } },
        { id: 'bunny-jump', type: 'tap-jump', targetId: 'happy-bunny', data: {} },
        { id: 'flower-grow-1', type: 'tap-grow', targetId: 'flower-1', data: {} },
        { id: 'flower-color', type: 'tap-color', targetId: 'flower-2', data: { colors: ['#fde047', '#a78bfa', '#f9a8d4', '#34d399'] } },
        { id: 'carrot-wiggle', type: 'tap-wiggle', targetId: 'carrot', data: {} },
        { id: 'sun-sparkle', type: 'tap-sparkle', targetId: 'sunshine', data: {} },
      ],
    },

    // ── Page 3: Sad Kitten ──
    {
      bg: 'from-blue-200 to-slate-300',
      image: '/arthurs-world/images/feelings-friends/page-3.png',
      text: 'Sad Kitten has lost her toy. When you feel sad, it helps to tell someone. Can you give Kitten a cuddle?',
      elements: [
        { id: 'sad-kitten', x: 45, y: 50, hotspot: true, w: 150, h: 150, z: 3 },
        { id: 'tear', x: 40, y: 52, hotspot: true, w: 45, h: 45, z: 4 },
        { id: 'rain-cloud', x: 45, y: 15, hotspot: true, w: 110, h: 70, z: 2 },
        { id: 'lost-toy', x: 78, y: 65, hotspot: true, w: 70, h: 70, z: 1 },
        { id: 'hidden-sun', x: 15, y: 18, hotspot: true, w: 70, h: 70, z: 1 },
      ],
      interactions: [
        { id: 'kitten-say', type: 'character-speak', targetId: 'sad-kitten', data: { say: 'Miaow... I cannot find my toy.', character: 'kitten' } },
        { id: 'kitten-wiggle', type: 'tap-wiggle', targetId: 'sad-kitten', data: {} },
        { id: 'tear-color', type: 'tap-color', targetId: 'tear', data: { colors: ['#60a5fa', '#93c5fd', '#3b82f6'] } },
        { id: 'cloud-shake', type: 'tap-shake', targetId: 'rain-cloud', data: {} },
        { id: 'toy-reveal', type: 'tap-reveal', targetId: 'lost-toy', data: { content: <span>🧸 Found it!</span> } },
        { id: 'sun-reveal', type: 'tap-reveal', targetId: 'hidden-sun', data: { content: <span>☀️</span> } },
      ],
    },

    // ── Page 4: Angry Puppy ──
    {
      bg: 'from-red-300 to-orange-400',
      image: '/arthurs-world/images/feelings-friends/page-4.png',
      text: 'Angry Puppy is growling! Someone took his bone! When you feel angry, try counting to three. One… two… three!',
      elements: [
        { id: 'angry-puppy', x: 45, y: 48, hotspot: true, w: 160, h: 160, z: 3 },
        { id: 'bone', x: 75, y: 35, hotspot: true, w: 70, h: 70, z: 2 },
        { id: 'stomp-1', x: 30, y: 72, hotspot: true, w: 80, h: 60, z: 2 },
        { id: 'count-bubble', x: 55, y: 18, hotspot: true, w: 100, h: 60, z: 2 },
        { id: 'hidden-treat', x: 18, y: 60, hotspot: true, w: 60, h: 60, z: 1 },
      ],
      interactions: [
        { id: 'puppy-say', type: 'character-speak', targetId: 'angry-puppy', data: { say: 'GRRR! That is MY bone!', character: 'puppy' } },
        { id: 'puppy-shake', type: 'tap-shake', targetId: 'angry-puppy', data: {} },
        { id: 'bone-spin', type: 'tap-spin', targetId: 'bone', data: {} },
        { id: 'stomp-shake', type: 'tap-shake', targetId: 'stomp-1', data: {} },
        { id: 'count-say', type: 'character-speak', targetId: 'count-bubble', data: { say: 'One... two... three! I feel better.', character: 'puppy' } },
        { id: 'treat-reveal', type: 'tap-reveal', targetId: 'hidden-treat', data: { content: <span>🦴 A new bone!</span> } },
      ],
    },

    // ── Page 5: Scared Hedgehog ──
    {
      bg: 'from-slate-400 to-indigo-500',
      image: '/arthurs-world/images/feelings-friends/page-5.png',
      text: 'Scared Hedgehog curls up tight! A loud noise frightened him. It is okay — you can be brave together!',
      elements: [
        { id: 'hedgehog', x: 45, y: 55, hotspot: true, w: 130, h: 130, z: 3 },
        { id: 'shadow', x: 70, y: 40, hotspot: true, w: 100, h: 100, z: 2 },
        { id: 'leaf-rustle', x: 25, y: 35, hotspot: true, w: 80, h: 80, z: 2 },
        { id: 'firefly', x: 80, y: 25, hotspot: true, w: 55, h: 55, z: 2 },
        { id: 'hidden-friend', x: 15, y: 65, hotspot: true, w: 70, h: 70, z: 1 },
      ],
      interactions: [
        { id: 'hedgehog-say', type: 'character-speak', targetId: 'hedgehog', data: { say: 'What was that noise? I am scared!', character: 'hedgehog' } },
        { id: 'hedgehog-wiggle', type: 'tap-wiggle', targetId: 'hedgehog', data: {} },
        { id: 'shadow-hide', type: 'tap-hide', targetId: 'shadow', data: {} },
        { id: 'leaf-shake', type: 'tap-shake', targetId: 'leaf-rustle', data: {} },
        { id: 'firefly-sparkle', type: 'tap-sparkle', targetId: 'firefly', data: {} },
        { id: 'friend-reveal', type: 'tap-reveal', targetId: 'hidden-friend', data: { content: <span>🐿️ A friend!</span> } },
      ],
    },

    // ── Page 6: Silly Duckling ──
    {
      bg: 'from-lime-300 to-cyan-300',
      image: '/arthurs-world/images/feelings-friends/page-6.png',
      text: 'Silly Duckling is being SO silly! She is walking backwards and quacking upside down! Sometimes being silly feels wonderful!',
      elements: [
        { id: 'silly-duck', x: 45, y: 45, hotspot: true, w: 150, h: 150, z: 3 },
        { id: 'puddle', x: 55, y: 70, hotspot: true, w: 120, h: 60, z: 2 },
        { id: 'quack-1', x: 30, y: 25, hotspot: true, w: 70, h: 50, z: 2 },
        { id: 'quack-2', x: 65, y: 20, hotspot: true, w: 70, h: 50, z: 2 },
        { id: 'hidden-frog', x: 82, y: 68, hotspot: true, w: 60, h: 60, z: 1 },
      ],
      interactions: [
        { id: 'duck-say', type: 'character-speak', targetId: 'silly-duck', data: { say: 'QUACK QUACK QUACK! I am so silly!', character: 'duckling' } },
        { id: 'duck-spin', type: 'tap-spin', targetId: 'silly-duck', data: {} },
        { id: 'puddle-sparkle', type: 'tap-sparkle', targetId: 'puddle', data: {} },
        { id: 'quack-grow-1', type: 'tap-grow', targetId: 'quack-1', data: {} },
        { id: 'quack-jump', type: 'tap-jump', targetId: 'quack-2', data: {} },
        { id: 'frog-reveal', type: 'tap-reveal', targetId: 'hidden-frog', data: { content: <span>🐸 Ribbit!</span> } },
      ],
    },

    // ── Page 7: Loving Owl ──
    {
      bg: 'from-pink-200 to-rose-300',
      image: '/arthurs-world/images/feelings-friends/page-7.png',
      text: 'Loving Owl gives the BEST cuddles! Love makes everything warm and cosy. Who do YOU love?',
      elements: [
        { id: 'owl', x: 45, y: 42, hotspot: true, w: 160, h: 160, z: 3 },
        { id: 'baby-owl', x: 48, y: 55, hotspot: true, w: 80, h: 80, z: 4 },
        { id: 'heart-1', x: 25, y: 30, hotspot: true, w: 70, h: 70, z: 2 },
        { id: 'heart-2', x: 72, y: 28, hotspot: true, w: 70, h: 70, z: 2 },
        { id: 'star', x: 50, y: 12, hotspot: true, w: 60, h: 60, z: 2 },
      ],
      interactions: [
        { id: 'owl-say', type: 'character-speak', targetId: 'owl', data: { say: 'I love you to the moon and back!', character: 'owl' } },
        { id: 'owl-grow', type: 'tap-grow', targetId: 'owl', data: {} },
        { id: 'baby-say', type: 'character-speak', targetId: 'baby-owl', data: { say: 'Love you, Mummy!', character: 'baby-owl' } },
        { id: 'heart-grow-1', type: 'tap-grow', targetId: 'heart-1', data: {} },
        { id: 'heart-color', type: 'tap-color', targetId: 'heart-2', data: { colors: ['#f9a8d4', '#fb7185', '#ec4899', '#f472b6'] } },
        { id: 'star-sparkle', type: 'tap-sparkle', targetId: 'star', data: {} },
      ],
    },

    // ── Page 8: All Friends Together ──
    {
      bg: 'from-amber-200 to-sky-200',
      image: '/arthurs-world/images/feelings-friends/page-8.png',
      text: 'All the feelings friends are here together! Every feeling is your friend. You are loved just the way you are!',
      elements: [
        { id: 'bunny-final', x: 18, y: 50, hotspot: true, w: 90, h: 90, z: 2 },
        { id: 'kitten-final', x: 35, y: 48, hotspot: true, w: 90, h: 90, z: 2 },
        { id: 'puppy-final', x: 52, y: 50, hotspot: true, w: 90, h: 90, z: 2 },
        { id: 'hedgehog-final', x: 68, y: 48, hotspot: true, w: 90, h: 90, z: 2 },
        { id: 'owl-final', x: 83, y: 50, hotspot: true, w: 90, h: 90, z: 2 },
        { id: 'rainbow', x: 50, y: 15, hotspot: true, w: 160, h: 60, z: 1 },
      ],
      interactions: [
        { id: 'bunny-jump', type: 'tap-jump', targetId: 'bunny-final', data: {} },
        { id: 'kitten-wiggle', type: 'tap-wiggle', targetId: 'kitten-final', data: {} },
        { id: 'puppy-jump', type: 'tap-jump', targetId: 'puppy-final', data: {} },
        { id: 'hedgehog-sparkle', type: 'tap-sparkle', targetId: 'hedgehog-final', data: {} },
        { id: 'owl-grow', type: 'tap-grow', targetId: 'owl-final', data: {} },
        { id: 'rainbow-sparkle', type: 'tap-sparkle', targetId: 'rainbow', data: {} },
      ],
    },
  ],
};

export default function MyFeelingsFriends() {
  return <StoryBook story={storyData} />;
}
