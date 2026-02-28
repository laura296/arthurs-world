import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { setGlobalMute } from './hooks/useSound';

// Lazy load all routes
const ModePicker = lazy(() => import('./pages/ModePicker'));
const SectionPicker = lazy(() => import('./pages/SectionPicker'));
const GameGrid = lazy(() => import('./pages/GameGrid'));
const BubblePop = lazy(() => import('./games/BubblePop'));
const FeedAnimals = lazy(() => import('./games/FeedAnimals'));
const PopCritters = lazy(() => import('./games/PopCritters'));
const Colouring = lazy(() => import('./games/Colouring'));
const MusicPad = lazy(() => import('./games/MusicPad'));
const MemoryMatch = lazy(() => import('./games/MemoryMatch'));
const FarmBook = lazy(() => import('./games/FarmBook'));
const ThreeLittlePigs = lazy(() => import('./stories/ThreeLittlePigs'));
const Goldilocks = lazy(() => import('./stories/Goldilocks'));
const RedRidingHood = lazy(() => import('./stories/RedRidingHood'));
const WhaleThroat = lazy(() => import('./stories/WhaleThroat'));
const CamelHump = lazy(() => import('./stories/CamelHump'));
const RhinoSkin = lazy(() => import('./stories/RhinoSkin'));
const LeopardSpots = lazy(() => import('./stories/LeopardSpots'));
const ElephantChild = lazy(() => import('./stories/ElephantChild'));
const OldManKangaroo = lazy(() => import('./stories/OldManKangaroo'));
const Armadillos = lazy(() => import('./stories/Armadillos'));
const FirstLetter = lazy(() => import('./stories/FirstLetter'));
const AlphabetMade = lazy(() => import('./stories/AlphabetMade'));
const CrabSea = lazy(() => import('./stories/CrabSea'));
const CatWalked = lazy(() => import('./stories/CatWalked'));
const ButterflyStamped = lazy(() => import('./stories/ButterflyStamped'));
const BuildAScene = lazy(() => import('./games/BuildAScene'));

function Loading() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-night">
      <span className="text-6xl animate-bounce">🌟</span>
    </div>
  );
}

/** Reads :mode param and sets global mute accordingly */
function MuteByMode({ children }) {
  const { mode } = useParams();

  useEffect(() => {
    setGlobalMute(mode === 'quiet');
  }, [mode]);

  return children;
}

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<ModePicker />} />

        {/* All mode-aware routes wrapped in MuteByMode */}
        <Route path="/games/:mode" element={<MuteByMode><SectionPicker /></MuteByMode>} />
        <Route path="/games/:mode/:section" element={<MuteByMode><GameGrid /></MuteByMode>} />

        {/* Individual games/stories */}
        <Route path="/games/:mode/:section/bubble-pop" element={<MuteByMode><BubblePop /></MuteByMode>} />
        <Route path="/games/:mode/:section/feed-animals" element={<MuteByMode><FeedAnimals /></MuteByMode>} />
        <Route path="/games/:mode/:section/pop-critters" element={<MuteByMode><PopCritters /></MuteByMode>} />
        <Route path="/games/:mode/:section/colouring" element={<MuteByMode><Colouring /></MuteByMode>} />
        <Route path="/games/:mode/:section/music-pad" element={<MuteByMode><MusicPad /></MuteByMode>} />
        <Route path="/games/:mode/:section/memory-match" element={<MuteByMode><MemoryMatch /></MuteByMode>} />
        <Route path="/games/:mode/:section/farm-book" element={<MuteByMode><FarmBook /></MuteByMode>} />
        <Route path="/games/:mode/:section/three-pigs" element={<MuteByMode><ThreeLittlePigs /></MuteByMode>} />
        <Route path="/games/:mode/:section/goldilocks" element={<MuteByMode><Goldilocks /></MuteByMode>} />
        <Route path="/games/:mode/:section/red-riding" element={<MuteByMode><RedRidingHood /></MuteByMode>} />
        <Route path="/games/:mode/:section/whale-throat" element={<MuteByMode><WhaleThroat /></MuteByMode>} />
        <Route path="/games/:mode/:section/camel-hump" element={<MuteByMode><CamelHump /></MuteByMode>} />
        <Route path="/games/:mode/:section/rhino-skin" element={<MuteByMode><RhinoSkin /></MuteByMode>} />
        <Route path="/games/:mode/:section/leopard-spots" element={<MuteByMode><LeopardSpots /></MuteByMode>} />
        <Route path="/games/:mode/:section/elephant-child" element={<MuteByMode><ElephantChild /></MuteByMode>} />
        <Route path="/games/:mode/:section/old-man-kangaroo" element={<MuteByMode><OldManKangaroo /></MuteByMode>} />
        <Route path="/games/:mode/:section/armadillos" element={<MuteByMode><Armadillos /></MuteByMode>} />
        <Route path="/games/:mode/:section/first-letter" element={<MuteByMode><FirstLetter /></MuteByMode>} />
        <Route path="/games/:mode/:section/alphabet-made" element={<MuteByMode><AlphabetMade /></MuteByMode>} />
        <Route path="/games/:mode/:section/crab-sea" element={<MuteByMode><CrabSea /></MuteByMode>} />
        <Route path="/games/:mode/:section/cat-walked" element={<MuteByMode><CatWalked /></MuteByMode>} />
        <Route path="/games/:mode/:section/butterfly-stamped" element={<MuteByMode><ButterflyStamped /></MuteByMode>} />
        <Route path="/games/:mode/:section/build-a-scene" element={<MuteByMode><BuildAScene /></MuteByMode>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
