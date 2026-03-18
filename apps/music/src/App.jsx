import { lazy, Suspense, useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ArthurBear from '@shared/components/ArthurBear';
import GameErrorBoundary from '@shared/components/GameErrorBoundary';
import PageTransition from '@shared/components/PageTransition';

// Home
const HomeGrid = lazy(() => import('./pages/HomeGrid'));

// Instruments
const MusicPad = lazy(() => import('@shared/games/MusicPad'));
const Xylophone = lazy(() => import('@shared/games/Xylophone'));
const DrumPad = lazy(() => import('@shared/games/DrumPad'));

// Sound Play
const AnimalSounds = lazy(() => import('@shared/games/AnimalSounds'));
const Jukebox = lazy(() => import('@shared/games/Jukebox'));

// Video Player
const VideoPlayer = lazy(() => import('@shared/games/VideoPlayer'));

// ── Loading Screen ──
const LOADING_MESSAGES = ['Tuning up...', 'Finding the beat...', 'Almost ready...'];

function Loading() {
  const [msgIdx, setMsgIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setMsgIdx(i => (i + 1) % LOADING_MESSAGES.length), 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-night gap-4">
      <ArthurBear expression="happy" size={80} className="animate-float" />
      <span className="text-xl font-heading text-sun/80">{LOADING_MESSAGES[msgIdx]}</span>
    </div>
  );
}

// ── Route wrappers ──
const E = ({ children }) => <GameErrorBoundary>{children}</GameErrorBoundary>;
const P = ({ children }) => <PageTransition>{children}</PageTransition>;
const W = ({ children }) => <E><P>{children}</P></E>;

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<P><HomeGrid /></P>} />

      {/* Instruments */}
      <Route path="/music-pad" element={<W><MusicPad /></W>} />
      <Route path="/xylophone" element={<W><Xylophone /></W>} />
      <Route path="/drum-pad" element={<W><DrumPad /></W>} />

      {/* Sound Play */}
      <Route path="/animal-sounds" element={<W><AnimalSounds /></W>} />
      <Route path="/jukebox" element={<W><Jukebox /></W>} />

      {/* Videos */}
      <Route path="/video/:videoId" element={<W><VideoPlayer /></W>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <AppRoutes />
    </Suspense>
  );
}
