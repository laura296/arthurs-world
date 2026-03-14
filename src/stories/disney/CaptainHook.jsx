import React from 'react';
import StoryBook from '../../components/StoryBook';

const storyData = {
  title: 'Captain Hook',
  audioDir: '/arthurs-world/audio/captain-hook',
  pages: [
    // ── Page 1: Neverland ──
    {
      bg: 'from-blue-400 to-teal-600',
      image: '/arthurs-world/images/disney/captain-hook/page-1.png',
      text: 'Far away in Neverland, the mean Captain Hook sailed his pirate ship!',
      elements: [
        { id: 'ship', x: 50, y: 45, hotspot: true, w: 160, h: 160, z: 2 },
        { id: 'flag', x: 55, y: 18, hotspot: true, w: 80, h: 80, z: 3 },
        { id: 'waves', x: 50, y: 75, hotspot: true, w: 150, h: 100, z: 1 },
        { id: 'parrot', x: 18, y: 30, hotspot: true, w: 80, h: 80, z: 2 },
        { id: 'hidden-fish', x: 82, y: 70, hotspot: true, w: 60, h: 60, z: 1 },
      ],
      interactions: [
        { id: 'ship-wiggle', type: 'tap-wiggle', targetId: 'ship', data: {} },
        { id: 'flag-shake', type: 'tap-shake', targetId: 'flag', data: {} },
        { id: 'waves-animate', type: 'tap-animate', targetId: 'waves', data: { animation: 'animate-float', duration: 1500 } },
        { id: 'parrot-sound', type: 'tap-sound', targetId: 'parrot', data: { say: 'Squawk! Walk the plank!', sfx: 'parrot' } },
        { id: 'fish-reveal', type: 'tap-reveal', targetId: 'hidden-fish', data: { content: 'Splash!' } },
      ],
    },

    // ── Page 2: Captain Hook ──
    {
      bg: 'from-red-600 to-gray-800',
      image: '/arthurs-world/images/disney/captain-hook/page-2.png',
      text: 'Captain Hook was a fearsome pirate! But he was very scared of one thing...',
      elements: [
        { id: 'hook', x: 50, y: 48, hotspot: true, w: 140, h: 140, z: 2 },
        { id: 'hook-hand', x: 60, y: 55, hotspot: true, w: 80, h: 80, z: 3 },
        { id: 'hat', x: 50, y: 25, hotspot: true, w: 90, h: 90, z: 3 },
        { id: 'smee', x: 20, y: 58, hotspot: true, w: 110, h: 110, z: 2 },
        { id: 'sword', x: 75, y: 55, hotspot: true, w: 80, h: 80, z: 2 },
      ],
      interactions: [
        { id: 'hook-sound', type: 'tap-sound', targetId: 'hook', data: { say: 'I am Captain Hook! Fear me!' } },
        { id: 'hook-hand-sparkle', type: 'tap-sparkle', targetId: 'hook-hand', data: {} },
        { id: 'hat-spin', type: 'tap-spin', targetId: 'hat', data: {} },
        { id: 'smee-sound', type: 'tap-sound', targetId: 'smee', data: { say: 'Yes, Captain!' } },
        { id: 'sword-wiggle', type: 'tap-wiggle', targetId: 'sword', data: {} },
      ],
    },

    // ── Page 3: The Crocodile ──
    {
      bg: 'from-green-500 to-teal-700',
      image: '/arthurs-world/images/disney/captain-hook/page-3.png',
      text: 'A crocodile had swallowed a clock! Tick tock tick tock! Captain Hook was terrified!',
      elements: [
        { id: 'croc', x: 50, y: 55, hotspot: true, w: 160, h: 160, z: 2 },
        { id: 'clock-croc', x: 50, y: 55, hotspot: true, w: 80, h: 80, z: 3 },
        { id: 'hook-scared', x: 20, y: 45, hotspot: true, w: 120, h: 120, z: 2 },
        { id: 'water', x: 50, y: 78, hotspot: true, w: 150, h: 80, z: 1 },
      ],
      interactions: [
        { id: 'croc-shake', type: 'tap-shake', targetId: 'croc', data: {} },
        { id: 'croc-sound', type: 'tap-sound', targetId: 'croc', data: { say: 'Tick tock tick tock!' } },
        { id: 'clock-spin', type: 'tap-spin', targetId: 'clock-croc', data: {} },
        { id: 'hook-scared-sound', type: 'tap-sound', targetId: 'hook-scared', data: { say: 'SMEE! The crocodile!' } },
        { id: 'hook-scared-shake', type: 'tap-shake', targetId: 'hook-scared', data: {} },
      ],
    },

    // ── Page 4: Peter Pan Arrives ──
    {
      bg: 'from-sky-400 to-indigo-500',
      image: '/arthurs-world/images/disney/captain-hook/page-4.png',
      text: 'Peter Pan flew over the ship! He was always playing tricks on Captain Hook.',
      elements: [
        { id: 'peter-pan', x: 50, y: 25, hotspot: true, w: 130, h: 130, z: 3 },
        { id: 'tinkerbell', x: 70, y: 20, hotspot: true, w: 70, h: 70, z: 3 },
        { id: 'hook-angry', x: 40, y: 58, hotspot: true, w: 120, h: 120, z: 2 },
        { id: 'clouds', x: 25, y: 15, hotspot: true, w: 100, h: 100, z: 1 },
      ],
      interactions: [
        { id: 'peter-pan-animate', type: 'tap-animate', targetId: 'peter-pan', data: { animation: 'animate-fly', duration: 1200 } },
        { id: 'peter-pan-sound', type: 'tap-sound', targetId: 'peter-pan', data: { say: 'Catch me if you can, Hook!' } },
        { id: 'tinkerbell-sparkle', type: 'tap-sparkle', targetId: 'tinkerbell', data: {} },
        { id: 'hook-angry-sound', type: 'tap-sound', targetId: 'hook-angry', data: { say: 'I\'ll get you, Pan!' } },
        { id: 'clouds-wiggle', type: 'tap-wiggle', targetId: 'clouds', data: {} },
      ],
    },

    // ── Page 5: Treasure Map ──
    {
      bg: 'from-amber-400 to-orange-600',
      image: '/arthurs-world/images/disney/captain-hook/page-5.png',
      text: 'Captain Hook found a treasure map! X marks the spot on Skull Island!',
      elements: [
        { id: 'map', x: 50, y: 45, hotspot: true, w: 140, h: 140, z: 2 },
        { id: 'x-mark', x: 60, y: 50, hotspot: true, w: 70, h: 70, z: 3 },
        { id: 'compass', x: 20, y: 35, hotspot: true, w: 80, h: 80, z: 2 },
        { id: 'hook-map', x: 75, y: 55, hotspot: true, w: 120, h: 120, z: 2 },
        { id: 'hidden-gem', x: 85, y: 72, hotspot: true, w: 60, h: 60, z: 1 },
      ],
      interactions: [
        { id: 'map-grow', type: 'tap-grow', targetId: 'map', data: {} },
        { id: 'x-mark-sparkle', type: 'tap-sparkle', targetId: 'x-mark', data: {} },
        { id: 'compass-spin', type: 'tap-spin', targetId: 'compass', data: {} },
        { id: 'hook-map-sound', type: 'tap-sound', targetId: 'hook-map', data: { say: 'The treasure is mine!' } },
        { id: 'gem-reveal', type: 'tap-reveal', targetId: 'hidden-gem', data: { content: 'Shiny!' } },
      ],
    },

    // ── Page 6: The Sword Fight ──
    {
      bg: 'from-orange-400 to-red-600',
      image: '/arthurs-world/images/disney/captain-hook/page-6.png',
      text: 'Peter Pan and Captain Hook had a sword fight on the ship!',
      elements: [
        { id: 'peter-fight', x: 35, y: 48, hotspot: true, w: 130, h: 130, z: 2 },
        { id: 'hook-fight', x: 65, y: 48, hotspot: true, w: 130, h: 130, z: 2 },
        { id: 'swords', x: 50, y: 45, hotspot: true, w: 90, h: 90, z: 3 },
        { id: 'ship-mast', x: 50, y: 15, hotspot: true, w: 80, h: 80, z: 1 },
      ],
      interactions: [
        { id: 'peter-fight-animate', type: 'tap-animate', targetId: 'peter-fight', data: { animation: 'animate-dance', duration: 800 } },
        { id: 'hook-fight-shake', type: 'tap-shake', targetId: 'hook-fight', data: {} },
        { id: 'swords-sound', type: 'tap-sound', targetId: 'swords', data: { say: 'Clang! Clang!' } },
        { id: 'swords-sparkle', type: 'tap-sparkle', targetId: 'swords', data: {} },
        { id: 'mast-wiggle', type: 'tap-wiggle', targetId: 'ship-mast', data: {} },
      ],
    },

    // ── Page 7: Walk the Plank ──
    {
      bg: 'from-blue-500 to-blue-800',
      image: '/arthurs-world/images/disney/captain-hook/page-7.png',
      text: 'Captain Hook made the Lost Boys walk the plank! But Peter Pan had a plan.',
      elements: [
        { id: 'plank', x: 50, y: 50, hotspot: true, w: 140, h: 100, z: 2 },
        { id: 'lost-boys', x: 55, y: 45, hotspot: true, w: 120, h: 120, z: 2 },
        { id: 'hook-plank', x: 25, y: 48, hotspot: true, w: 120, h: 120, z: 2 },
        { id: 'ocean', x: 50, y: 78, hotspot: true, w: 150, h: 80, z: 1 },
      ],
      interactions: [
        { id: 'plank-wiggle', type: 'tap-wiggle', targetId: 'plank', data: {} },
        { id: 'lost-boys-sound', type: 'tap-sound', targetId: 'lost-boys', data: { say: 'Peter, help us!' } },
        { id: 'hook-plank-sound', type: 'tap-sound', targetId: 'hook-plank', data: { say: 'Walk the plank!' } },
        { id: 'ocean-animate', type: 'tap-animate', targetId: 'ocean', data: { animation: 'animate-float', duration: 1200 } },
      ],
    },

    // ── Page 8: Hook Falls ──
    {
      bg: 'from-teal-400 to-blue-700',
      image: '/arthurs-world/images/disney/captain-hook/page-8.png',
      text: 'Peter Pan tricked Captain Hook — and Hook fell into the water with the crocodile!',
      elements: [
        { id: 'hook-fall', x: 50, y: 45, hotspot: true, w: 140, h: 140, z: 2 },
        { id: 'croc-water', x: 50, y: 70, hotspot: true, w: 130, h: 130, z: 2 },
        { id: 'splash', x: 50, y: 60, hotspot: true, w: 100, h: 100, z: 3 },
        { id: 'peter-laugh', x: 25, y: 25, hotspot: true, w: 100, h: 100, z: 2 },
      ],
      interactions: [
        { id: 'hook-fall-animate', type: 'tap-animate', targetId: 'hook-fall', data: { animation: 'animate-dance', duration: 800 } },
        { id: 'hook-fall-sound', type: 'tap-sound', targetId: 'hook-fall', data: { say: 'SMEE! SMEEEEE!' } },
        { id: 'croc-shake', type: 'tap-shake', targetId: 'croc-water', data: {} },
        { id: 'splash-sparkle', type: 'tap-sparkle', targetId: 'splash', data: {} },
        { id: 'peter-laugh-sound', type: 'tap-sound', targetId: 'peter-laugh', data: { say: 'Ha ha! Goodbye Hook!' } },
      ],
    },

    // ── Page 9: Hook Runs Away ──
    {
      bg: 'from-green-500 to-teal-600',
      image: '/arthurs-world/images/disney/captain-hook/page-9.png',
      text: 'Captain Hook ran away as fast as he could! The crocodile chased him — tick tock tick tock!',
      elements: [
        { id: 'hook-run', x: 30, y: 50, hotspot: true, w: 130, h: 130, z: 2 },
        { id: 'croc-chase', x: 65, y: 55, hotspot: true, w: 140, h: 140, z: 2 },
        { id: 'dust-cloud', x: 20, y: 65, hotspot: true, w: 80, h: 80, z: 1 },
        { id: 'clock-sound', x: 60, y: 35, hotspot: true, w: 70, h: 70, z: 2 },
      ],
      interactions: [
        { id: 'hook-run-animate', type: 'tap-animate', targetId: 'hook-run', data: { animation: 'animate-dance', duration: 600 } },
        { id: 'hook-run-sound', type: 'tap-sound', targetId: 'hook-run', data: { say: 'Help! Help!' } },
        { id: 'croc-chase-shake', type: 'tap-shake', targetId: 'croc-chase', data: {} },
        { id: 'dust-spin', type: 'tap-spin', targetId: 'dust-cloud', data: {} },
        { id: 'clock-sound-sound', type: 'tap-sound', targetId: 'clock-sound', data: { say: 'Tick tock tick tock!' } },
      ],
    },

    // ── Page 10: Neverland is Safe ──
    {
      bg: 'from-sky-300 to-amber-300',
      image: '/arthurs-world/images/disney/captain-hook/page-10.png',
      text: 'Neverland was safe again! Peter Pan and the Lost Boys celebrated together!',
      elements: [
        { id: 'peter-celebrate', x: 50, y: 40, hotspot: true, w: 140, h: 140, z: 2 },
        { id: 'lost-boys-dance', x: 25, y: 58, hotspot: true, w: 120, h: 120, z: 2 },
        { id: 'tink-celebrate', x: 70, y: 22, hotspot: true, w: 70, h: 70, z: 3 },
        { id: 'star-neverland', x: 50, y: 12, hotspot: true, w: 90, h: 90, z: 1 },
        { id: 'heart-end', x: 50, y: 72, hotspot: true, w: 100, h: 100, z: 1 },
      ],
      interactions: [
        { id: 'peter-celebrate-animate', type: 'tap-animate', targetId: 'peter-celebrate', data: { animation: 'animate-dance', duration: 1500 } },
        { id: 'peter-celebrate-sound', type: 'tap-sound', targetId: 'peter-celebrate', data: { say: 'To Neverland!' } },
        { id: 'lost-boys-dance-animate', type: 'tap-animate', targetId: 'lost-boys-dance', data: { animation: 'animate-dance', duration: 1200 } },
        { id: 'tink-sparkle', type: 'tap-sparkle', targetId: 'tink-celebrate', data: {} },
        { id: 'star-neverland-spin', type: 'tap-spin', targetId: 'star-neverland', data: {} },
        { id: 'heart-end-sound', type: 'tap-sound', targetId: 'heart-end', data: { say: 'The End!' } },
      ],
    },
  ],
};

export default function CaptainHook() {
  return <StoryBook story={storyData} />;
}
