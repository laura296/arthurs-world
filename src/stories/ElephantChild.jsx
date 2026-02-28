import React from 'react';
import StoryBook from '../components/StoryBook';
import SavannaScene from '../components/scenes/elephant-child/SavannaScene';
import WaterholeScene from '../components/scenes/elephant-child/WaterholeScene';
import RiverbankScene from '../components/scenes/elephant-child/RiverbankScene';
import ClearingScene from '../components/scenes/elephant-child/ClearingScene';
import BabyElephant from '../components/animals/elephant-child/BabyElephant';
import MamaElephant from '../components/animals/elephant-child/MamaElephant';
import Hippo from '../components/animals/elephant-child/Hippo';

const storyData = {
  title: "The Elephant's Child",
  audioDir: '/arthurs-world/audio/elephant-child',
  pages: [

    // ── Page 1: Once upon a time — curious baby elephant ──
    {
      scene: <SavannaScene variant="home" timeOfDay="morning" characters={[]} />,
      text: 'Once upon a time, elephants had short, stubby noses. This little elephant was VERY curious!',
      elements: [
        {
          id: 'baby-elephant',
          x: 50, y: 55,
          content: <BabyElephant size={100} expression="curious" noseLength="short" />,
          z: 3,
        },
        {
          id: 'mama-elephant',
          x: 22, y: 50,
          content: <MamaElephant size={120} expression="loving" />,
          z: 2,
        },
        {
          id: 'butterfly',
          x: 65, y: 30,
          content: '🦋',
          size: 36,
          z: 4,
        },
      ],
      interactions: [
        { id: 'i1', targetId: 'baby-elephant', type: 'character-speak', data: { say: 'I have so many questions!' } },
        { id: 'i2', targetId: 'mama-elephant', type: 'character-speak', data: { say: 'Oh my dear child...' } },
        { id: 'i3', targetId: 'butterfly', type: 'flap-reveal', data: { revealContent: '✨' } },
      ],
    },

    // ── Page 2: The elephant asks EVERYONE ──
    {
      scene: <SavannaScene variant="gathering" timeOfDay="afternoon" characters={[]} />,
      text: '"What does the Crocodile have for dinner?" he asked everyone. But nobody would tell him!',
      elements: [
        {
          id: 'baby-q',
          x: 50, y: 52,
          content: <BabyElephant size={90} expression="curious" noseLength="short" />,
          z: 4,
        },
        {
          id: 'hippo',
          x: 20, y: 50,
          content: <Hippo size={100} expression="friendly" />,
          z: 3,
        },
        {
          id: 'bird',
          x: 78, y: 25,
          content: '🐦',
          size: 32,
          z: 2,
        },
        {
          id: 'bush',
          x: 82, y: 55,
          content: '🌿',
          size: 40,
          z: 2,
        },
      ],
      interactions: [
        { id: 'i1', targetId: 'baby-q', type: 'character-speak', data: { say: 'What does the Crocodile eat?' } },
        { id: 'i2', targetId: 'hippo', type: 'character-speak', data: { say: "Hush! Don't ask such things!" } },
        { id: 'i3', targetId: 'bird', type: 'character-speak', data: { say: "Don't ask me!" } },
        { id: 'i4', targetId: 'bush', type: 'flap-reveal', data: { revealContent: '🐍' } },
      ],
    },

    // ── Page 3: Setting off — departure at waterhole ──
    {
      scene: <WaterholeScene characters={[]} />,
      text: 'So the curious little elephant set off on a journey to find the great grey-green Crocodile.',
      elements: [
        {
          id: 'baby-go',
          x: 60, y: 52,
          content: <BabyElephant size={85} expression="happy" noseLength="short" />,
          z: 4,
        },
        {
          id: 'hippo-wave',
          x: 25, y: 48,
          content: <Hippo size={90} expression="pointing" />,
          z: 3,
        },
        {
          id: 'footprints',
          x: 75, y: 68,
          content: '👣',
          size: 28,
          z: 1,
        },
      ],
      interactions: [
        { id: 'i1', targetId: 'baby-go', type: 'character-speak', data: { say: 'Goodbye! I will find out!' } },
        { id: 'i2', targetId: 'hippo-wave', type: 'character-speak', data: { say: 'Be careful, little one!' } },
        { id: 'i3', targetId: 'footprints', type: 'scene-transform', data: { transformId: 'footprints', value: true } },
      ],
    },

    // ── Page 4: Arriving at the river — crocodile peek-a-boo ──
    {
      scene: <RiverbankScene mood="peaceful" characters={[]} />,
      text: 'He came to the edge of the great, grey-green, greasy Limpopo River.',
      elements: [
        {
          id: 'baby-river',
          x: 25, y: 48,
          content: <BabyElephant size={80} expression="curious" noseLength="short" />,
          z: 4,
        },
        {
          id: 'croc-eyes',
          x: 55, y: 52,
          content: '👀',
          size: 32,
          z: 3,
        },
        {
          id: 'reeds',
          x: 80, y: 45,
          content: '🌾',
          size: 36,
          z: 2,
        },
        {
          id: 'dragonfly',
          x: 40, y: 28,
          content: '🪰',
          size: 24,
          z: 1,
        },
      ],
      interactions: [
        { id: 'i1', targetId: 'baby-river', type: 'character-speak', data: { say: 'Is this where the Crocodile lives?' } },
        { id: 'i2', targetId: 'croc-eyes', type: 'peek-a-boo', data: {} },
        { id: 'i3', targetId: 'reeds', type: 'flap-reveal', data: { revealContent: '🐸' } },
        { id: 'i4', targetId: 'dragonfly', type: 'tap-sparkle', data: {} },
      ],
    },

    // ── Page 5: The crocodile appears — tense! ──
    {
      scene: <RiverbankScene mood="tense" characters={[]} />,
      text: '"Come closer, little one," said a voice from the water. "I am the Crocodile."',
      elements: [
        {
          id: 'baby-scared',
          x: 25, y: 50,
          content: <BabyElephant size={80} expression="scared" noseLength="short" />,
          z: 4,
        },
        {
          id: 'croc-log',
          x: 58, y: 55,
          content: '🐊',
          size: 56,
          z: 3,
        },
        {
          id: 'water-dark',
          x: 50, y: 70,
          content: '🌊',
          size: 32,
          z: 1,
        },
      ],
      interactions: [
        { id: 'i1', targetId: 'baby-scared', type: 'character-speak', data: { say: "Are you r-really the Crocodile?" } },
        { id: 'i2', targetId: 'croc-log', type: 'character-speak', data: { say: "Come hither, little one..." } },
        { id: 'i3', targetId: 'water-dark', type: 'scene-transform', data: { transformId: 'darken', value: true } },
      ],
    },

    // ── Page 6: SNAP! — the crocodile bites the nose! ──
    {
      scene: <RiverbankScene mood="dramatic" waterLevel="splashing" characters={[]} />,
      text: 'SNAP! The Crocodile caught the elephant by his little nose!',
      elements: [
        {
          id: 'baby-snap',
          x: 30, y: 48,
          content: <BabyElephant size={85} expression="surprised" noseLength="short" />,
          z: 4,
        },
        {
          id: 'croc-bite',
          x: 55, y: 50,
          content: '🐊',
          size: 64,
          z: 5,
        },
        {
          id: 'splash',
          x: 50, y: 68,
          content: '💦',
          size: 40,
          z: 2,
        },
        {
          id: 'snap-fx',
          x: 44, y: 38,
          content: '💥',
          size: 48,
          z: 6,
        },
      ],
      interactions: [
        { id: 'i1', targetId: 'snap-fx', type: 'tap-shake', data: {} },
        { id: 'i2', targetId: 'splash', type: 'scene-transform', data: { transformId: 'splash', value: true } },
        { id: 'i3', targetId: 'baby-snap', type: 'character-speak', data: { say: 'LET GO! You are hurting me!' } },
        { id: 'i4', targetId: 'croc-bite', type: 'character-speak', data: { say: "I think today I'll have elephant for dinner!" } },
      ],
    },

    // ── Page 7: Tug-of-war — the nose STRETCHES! ──
    {
      scene: <RiverbankScene mood="action" waterLevel="splashing" characters={[]} />,
      text: 'The elephant PULLED and the crocodile PULLED. His nose stretched and stretched and STRETCHED!',
      elements: [
        {
          id: 'baby-pull',
          x: 22, y: 46,
          content: <BabyElephant size={90} expression="scared" noseLength="short" />,
          z: 4,
        },
        {
          id: 'croc-pull',
          x: 62, y: 50,
          content: '🐊',
          size: 60,
          z: 5,
        },
        {
          id: 'stretch-1',
          x: 38, y: 52,
          content: '〰️',
          size: 36,
          z: 3,
        },
        {
          id: 'pull-count',
          x: 50, y: 28,
          content: '💪',
          size: 40,
          z: 6,
        },
      ],
      interactions: [
        { id: 'i1', targetId: 'pull-count', type: 'tap-count', data: { max: 5, say: 'PULL! PULL! PULL!' } },
        { id: 'i2', targetId: 'baby-pull', type: 'character-speak', data: { say: 'This is too much for me!' } },
        { id: 'i3', targetId: 'croc-pull', type: 'character-speak', data: { say: 'Come here, little one!' } },
        { id: 'i4', targetId: 'stretch-1', type: 'tap-grow', data: {} },
      ],
    },

    // ── Page 8: POP! Relief — the croc lets go ──
    {
      scene: <ClearingScene mood="wonder" characters={[]} />,
      text: 'POP! The crocodile let go! But the elephant\'s nose had stretched into a LONG trunk!',
      elements: [
        {
          id: 'baby-free',
          x: 50, y: 48,
          content: <BabyElephant size={100} expression="surprised" noseLength="long" />,
          z: 4,
        },
        {
          id: 'croc-flee',
          x: 82, y: 60,
          content: '🐊',
          size: 36,
          z: 2,
        },
        {
          id: 'pop-fx',
          x: 50, y: 28,
          content: '💫',
          size: 48,
          z: 5,
        },
      ],
      interactions: [
        { id: 'i1', targetId: 'baby-free', type: 'character-speak', data: { say: 'My nose! It is SO long now!' } },
        { id: 'i2', targetId: 'pop-fx', type: 'tap-sparkle', data: {} },
        { id: 'i3', targetId: 'croc-flee', type: 'tap-animate', data: { animation: 'animate-fly', duration: 1000 } },
      ],
    },

    // ── Page 9: Discovering the trunk is useful! ──
    {
      scene: <ClearingScene mood="discovery" characters={[]} />,
      text: 'But wait — the long trunk was WONDERFUL! He could pick fruit, spray water, and swat flies!',
      elements: [
        {
          id: 'baby-play',
          x: 45, y: 48,
          content: <BabyElephant size={95} expression="happy" noseLength="long" />,
          z: 4,
        },
        {
          id: 'fruit-1',
          x: 28, y: 32,
          content: '🍎',
          size: 32,
          z: 3,
        },
        {
          id: 'fruit-2',
          x: 68, y: 35,
          content: '🍌',
          size: 32,
          z: 3,
        },
        {
          id: 'fruit-3',
          x: 75, y: 28,
          content: '🥭',
          size: 32,
          z: 3,
        },
        {
          id: 'water-spray',
          x: 20, y: 58,
          content: '💧',
          size: 28,
          z: 2,
        },
      ],
      interactions: [
        { id: 'i1', targetId: 'fruit-1', type: 'collect', data: { target: 'fruit', max: 3 } },
        { id: 'i2', targetId: 'fruit-2', type: 'collect', data: { target: 'fruit', max: 3 } },
        { id: 'i3', targetId: 'fruit-3', type: 'collect', data: { target: 'fruit', max: 3 } },
        { id: 'i4', targetId: 'water-spray', type: 'scene-transform', data: { transformId: 'fountain', value: true } },
        { id: 'i5', targetId: 'baby-play', type: 'character-speak', data: { say: 'This trunk is AMAZING!' } },
      ],
    },

    // ── Page 10: Celebration — all elephants want long trunks! ──
    {
      scene: <SavannaScene variant="celebration" timeOfDay="golden-hour" characters={[]} />,
      text: 'And from that day on, ALL elephants had long, wonderful trunks! The End.',
      elements: [
        {
          id: 'baby-proud',
          x: 50, y: 50,
          content: <BabyElephant size={100} expression="proud" noseLength="long" />,
          z: 4,
        },
        {
          id: 'mama-proud',
          x: 22, y: 46,
          content: <MamaElephant size={110} expression="waving" />,
          z: 3,
        },
        {
          id: 'star-1',
          x: 35, y: 22,
          content: '⭐',
          size: 28,
          z: 2,
        },
        {
          id: 'star-2',
          x: 65, y: 18,
          content: '🌟',
          size: 32,
          z: 2,
        },
        {
          id: 'the-end',
          x: 50, y: 78,
          content: '🎉',
          size: 48,
          z: 5,
        },
      ],
      interactions: [
        { id: 'i1', targetId: 'baby-proud', type: 'character-speak', data: { say: "I love my new trunk!" } },
        { id: 'i2', targetId: 'mama-proud', type: 'character-speak', data: { say: "You are so brave, my dear!" } },
        { id: 'i3', targetId: 'star-1', type: 'tap-sparkle', data: {} },
        { id: 'i4', targetId: 'star-2', type: 'tap-sparkle', data: {} },
        { id: 'i5', targetId: 'the-end', type: 'tap-animate', data: { animation: 'animate-dance', duration: 1000 } },
      ],
    },
  ],
};

export default function ElephantChild() {
  return <StoryBook story={storyData} />;
}
