import { useState, useCallback } from 'react';
import BackButton from '../components/BackButton';
import ThemePicker from './memory-match/ThemePicker';
import CardParade from './memory-match/CardParade';
import GameBoard from './memory-match/GameBoard';
import WinCelebration from './memory-match/WinCelebration';
import {
  buildDeck, getLevelForTheme, getNextLevel, levelUpTheme,
  loadProgress, saveProgress, loadSecrets, saveSecrets,
} from './memory-match/cardData';

export default function MemoryMatch() {
  const [phase, setPhase] = useState('pick-theme'); // pick-theme | parade | playing | won
  const [theme, setTheme] = useState(null);
  const [cards, setCards] = useState([]);
  const [level, setLevel] = useState(null);
  const [paradeChars, setParadeChars] = useState([]);

  const startGame = useCallback((themeId) => {
    const progress = loadProgress();
    const lvl = getLevelForTheme(themeId, progress);
    const deck = buildDeck(themeId, lvl);

    // Get unique characters for parade (one per pair)
    const seen = new Set();
    const chars = [];
    for (const card of deck) {
      if (!seen.has(card.characterId)) {
        seen.add(card.characterId);
        chars.push(card);
      }
    }

    setTheme(themeId);
    setLevel(lvl);
    setCards(deck);
    setParadeChars(chars);
    setPhase('parade');
  }, []);

  const handleParadeComplete = useCallback(() => {
    setPhase('playing');
  }, []);

  const handleWin = useCallback((secretIds) => {
    // Update progress
    const progress = loadProgress();
    if (!progress[theme]) progress[theme] = { completions: 0 };
    progress[theme].completions += 1;
    saveProgress(progress);

    // Record secret discoveries
    if (secretIds.length > 0) {
      const secrets = loadSecrets();
      if (!secrets[theme]) secrets[theme] = [];
      for (const id of secretIds) {
        if (!secrets[theme].includes(id)) {
          secrets[theme].push(id);
        }
      }
      saveSecrets(secrets);
    }

    setPhase('won');
  }, [theme]);

  const handlePlayAgain = useCallback(() => {
    startGame(theme);
  }, [theme, startGame]);

  const handleLevelUp = useCallback(() => {
    const newLevel = levelUpTheme(theme);
    const deck = buildDeck(theme, newLevel);
    const seen = new Set();
    const chars = [];
    for (const c of deck) {
      if (!seen.has(c.characterId)) { seen.add(c.characterId); chars.push(c); }
    }
    setLevel(newLevel);
    setCards(deck);
    setParadeChars(chars);
    setPhase('parade');
  }, [theme]);

  const handleNewTheme = useCallback(() => {
    setPhase('pick-theme');
    setTheme(null);
  }, []);

  // Phase: Pick theme
  if (phase === 'pick-theme') {
    return (
      <div className="relative w-full h-full">
        <BackButton />
        <ThemePicker onSelectTheme={startGame} />
      </div>
    );
  }

  // Phase: Card parade
  if (phase === 'parade') {
    return (
      <CardParade
        theme={theme}
        characters={paradeChars}
        onComplete={handleParadeComplete}
      />
    );
  }

  // Phase: Playing (and won overlay)
  return (
    <div className="relative w-full h-full">
      <GameBoard
        theme={theme}
        cards={cards}
        level={level}
        onWin={handleWin}
        onBack={handleNewTheme}
      />
      {phase === 'won' && (
        <WinCelebration
          theme={theme}
          nextLevel={getNextLevel(level)}
          onPlayAgain={handlePlayAgain}
          onLevelUp={handleLevelUp}
          onNewTheme={handleNewTheme}
        />
      )}
    </div>
  );
}
