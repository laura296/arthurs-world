import { useState, useCallback } from 'react';
import BackButton from '../../components/BackButton';
import LoadingScreen from './LoadingScreen';
import TitleScreen from './TitleScreen';
import StoryScreen from './StoryScreen';
import GameScreen from './GameScreen';
import CelebrationScreen from './CelebrationScreen';
import FindTheSpeck from './games/FindTheSpeck';
import ShooAnimals from './games/ShooAnimals';
import NoiseMeter from './games/NoiseMeter';
import PopTinyFolk from './games/PopTinyFolk';
import { SCREENS } from './storyData';

const GAME_COMPONENTS = [FindTheSpeck, ShooAnimals, NoiseMeter, PopTinyFolk];

export default function EllieStorybook() {
  // 'loading' | 'title' | 'playing' | 'celebration'
  const [phase, setPhase] = useState('loading');
  const [screenIndex, setScreenIndex] = useState(0);

  const handleLoadComplete = useCallback(() => setPhase('title'), []);
  const handleStart = useCallback(() => {
    setScreenIndex(0);
    setPhase('playing');
  }, []);

  const handleAdvance = useCallback(() => {
    const next = screenIndex + 1;
    if (next >= SCREENS.length) {
      setPhase('celebration');
    } else {
      setScreenIndex(next);
    }
  }, [screenIndex]);

  const handleReplay = useCallback(() => {
    setScreenIndex(0);
    setPhase('title');
  }, []);

  const current = SCREENS[screenIndex];

  return (
    <div className="w-full h-full relative overflow-hidden bg-night">
      <BackButton />

      {phase === 'loading' && (
        <LoadingScreen onComplete={handleLoadComplete} />
      )}

      {phase === 'title' && (
        <TitleScreen onStart={handleStart} />
      )}

      {phase === 'playing' && current.type === 'story' && (
        <StoryScreen
          key={`story-${current.chapter}`}
          chapter={current.chapter}
          onAdvance={handleAdvance}
        />
      )}

      {phase === 'playing' && current.type === 'game' && (
        <GameScreen
          key={`game-${current.chapter}`}
          chapter={current.chapter}
          GameComponent={GAME_COMPONENTS[current.chapter]}
          onComplete={handleAdvance}
        />
      )}

      {phase === 'celebration' && (
        <CelebrationScreen onReplay={handleReplay} />
      )}
    </div>
  );
}
