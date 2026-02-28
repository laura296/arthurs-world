// src/games/pop-critters/difficultyConfig.js

export const DIFFICULTIES = {
  gentle: {
    label: 'Gentle Garden',
    emoji: '🌱',
    animals: ['mole', 'hedgehog'],
    visibleTime: { min: 4000, max: 5000 },
    spawnInterval: 2500,
    maxVisible: 2,
    riseSpeed: 600,    // ms
    foxMoves: false,
  },
  busy: {
    label: 'Busy Garden',
    emoji: '🌻',
    animals: ['mole', 'hedgehog', 'rabbit', 'mouse'],
    visibleTime: { min: 2500, max: 3000 },
    spawnInterval: 1800,
    maxVisible: 3,
    riseSpeed: 400,
    foxMoves: false,
  },
  wild: {
    label: 'Wild Garden',
    emoji: '🦊',
    animals: ['mole', 'hedgehog', 'rabbit', 'mouse', 'fox', 'owl'],
    visibleTime: { min: 1500, max: 2000 },
    spawnInterval: 1200,
    maxVisible: 4,
    riseSpeed: 300,
    foxMoves: true,
  },
};

export const ANIMAL_POINTS = {
  mole: 1,
  hedgehog: 1,
  rabbit: 1,
  mouse: 1,
  fox: 2,
  owl: 1,
};

export const GRID = { cols: 3, rows: 3, total: 9 };
