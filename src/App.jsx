import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Lazy load all game routes
const ModePicker = lazy(() => import('./pages/ModePicker'));
const GameGrid = lazy(() => import('./pages/GameGrid'));
const BubblePop = lazy(() => import('./games/BubblePop'));
const FeedAnimals = lazy(() => import('./games/FeedAnimals'));
const PopCritters = lazy(() => import('./games/PopCritters'));
const Colouring = lazy(() => import('./games/Colouring'));
const MusicPad = lazy(() => import('./games/MusicPad'));
const MemoryMatch = lazy(() => import('./games/MemoryMatch'));
const FarmBook = lazy(() => import('./games/FarmBook'));

function Loading() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-night">
      <span className="text-6xl animate-bounce">🌟</span>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<ModePicker />} />
        <Route path="/games/:mode" element={<GameGrid />} />
        <Route path="/games/:mode/bubble-pop" element={<BubblePop />} />
        <Route path="/games/:mode/feed-animals" element={<FeedAnimals />} />
        <Route path="/games/:mode/pop-critters" element={<PopCritters />} />
        <Route path="/games/:mode/colouring" element={<Colouring />} />
        <Route path="/games/:mode/music-pad" element={<MusicPad />} />
        <Route path="/games/:mode/memory-match" element={<MemoryMatch />} />
        <Route path="/games/:mode/farm-book" element={<FarmBook />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
