/**
 * Inside Out: Headquarters Hero — game data, room definitions, and persistence.
 */

// ── Emotion colors ──
export const EMOTION_COLORS = {
  joy:           '#facc15',
  sadness:       '#3b82f6',
  anger:         '#ef4444',
  fear:          '#7c3aed',
  disgust:       '#22c55e',
  anxiety:       '#14b8a6',
  embarrassment: '#f9a8d4',
  envy:          '#0d9488',
  ennui:         '#a78bfa',
};

// ── Room definitions ──
export const ROOMS = [
  {
    id: 'control-room',
    name: 'Control Room',
    emoji: '🎛️',
    emotion: 'joy',
    color: EMOTION_COLORS.joy,
    gradFrom: '#facc15',
    gradTo: '#f59e0b',
    gamePath: 'control-panel-meltdown',
    description: 'Main console is haywire!',
    position: { x: 50, y: 50 },   // % position on map
  },
  {
    id: 'anger-reactor',
    name: 'Anger Reactor',
    emoji: '🔥',
    emotion: 'anger',
    color: EMOTION_COLORS.anger,
    gradFrom: '#ef4444',
    gradTo: '#ea580c',
    gamePath: 'anger-cool-down',
    description: 'Reactor overheating!',
    position: { x: 25, y: 75 },
  },
  {
    id: 'anxiety-dome',
    name: 'Anxiety Dome',
    emoji: '🚨',
    emotion: 'anxiety',
    color: EMOTION_COLORS.anxiety,
    gradFrom: '#14b8a6',
    gradTo: '#f97316',
    gamePath: 'alarm-avalanche',
    description: 'Alarms spiraling!',
    position: { x: 75, y: 25 },
  },
  {
    id: 'memory-vault',
    name: 'Memory Vault',
    emoji: '💎',
    emotion: 'sadness',
    color: EMOTION_COLORS.sadness,
    gradFrom: '#3b82f6',
    gradTo: '#8b5cf6',
    gamePath: null, // Not yet built — coming in V2
    description: 'Memories scattered!',
    position: { x: 25, y: 25 },
  },
];

// ── Chain reactions: fixing room A can trigger room B ──
export const CHAIN_REACTIONS = [
  { from: 'anger-reactor', to: 'control-room', chance: 0.4 },
  { from: 'control-room', to: 'anxiety-dome', chance: 0.35 },
  { from: 'anxiety-dome', to: 'anger-reactor', chance: 0.3 },
];

// ── Persistence ──
const STORAGE_KEY = 'inside-out-progress';

const DEFAULT_PROGRESS = {
  stars: 0,
  orbs: 0,
  streak: 0,
  lastPlayDate: null,
  rooms: {
    'control-room':   { level: 0, played: 0, bestStars: 0 },
    'anger-reactor':  { level: 0, played: 0, bestStars: 0 },
    'anxiety-dome':   { level: 0, played: 0, bestStars: 0 },
    'memory-vault':   { level: 0, played: 0, bestStars: 0 },
  },
  alerts: {},        // roomId → true if emergency is active
  bossUnlocked: false,
  bossCompleted: false,
  orbCollection: [], // array of { color, timestamp }
};

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch { /* ignore */ }
}

/** Award stars and orbs after a mini-game win */
export function recordWin(roomId, starsEarned) {
  const p = loadProgress();
  p.stars += starsEarned;
  p.orbs += 1;

  // Update room stats
  if (p.rooms[roomId]) {
    p.rooms[roomId].played += 1;
    p.rooms[roomId].bestStars = Math.max(p.rooms[roomId].bestStars, starsEarned);
    // Level up every 3 plays
    if (p.rooms[roomId].played % 3 === 0 && p.rooms[roomId].level < 4) {
      p.rooms[roomId].level += 1;
    }
  }

  // Add orb to collection
  const room = ROOMS.find(r => r.id === roomId);
  p.orbCollection.push({ color: room?.color || '#facc15', timestamp: Date.now() });

  // Unlock boss after 10 total stars
  if (p.stars >= 10) p.bossUnlocked = true;

  // Update streak
  const today = new Date().toDateString();
  if (p.lastPlayDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    p.streak = p.lastPlayDate === yesterday ? p.streak + 1 : 1;
    p.lastPlayDate = today;
  }

  // Trigger chain reactions
  const newAlerts = { ...p.alerts };
  delete newAlerts[roomId]; // clear this room's alert
  CHAIN_REACTIONS.forEach(cr => {
    if (cr.from === roomId && Math.random() < cr.chance) {
      newAlerts[cr.to] = true;
    }
  });
  p.alerts = newAlerts;

  saveProgress(p);
  return p;
}

/** Generate daily alerts for rooms */
export function refreshAlerts() {
  const p = loadProgress();
  const today = new Date().toDateString();
  if (p.lastPlayDate === today && Object.keys(p.alerts).length > 0) return p;

  // Seed 1-2 random alerts
  const available = ROOMS.filter(r => r.gamePath);
  const count = 1 + Math.floor(Math.random() * 2);
  const alerts = {};
  const shuffled = available.sort(() => Math.random() - 0.5);
  for (let i = 0; i < Math.min(count, shuffled.length); i++) {
    alerts[shuffled[i].id] = true;
  }
  p.alerts = alerts;
  saveProgress(p);
  return p;
}

// ── Restoration level names ──
export const RESTORATION_LEVELS = [
  'Destroyed',
  'Damaged',
  'Functional',
  'Polished',
  'Spectacular',
];
