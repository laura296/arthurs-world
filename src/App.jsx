import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { setGlobalMute } from './hooks/useSound';
import { SectionProvider } from './contexts/SectionContext';
import ArthurBear from './components/ArthurBear';

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
    <div className="w-full h-full flex flex-col items-center justify-center bg-night gap-4">
      <ArthurBear expression="happy" size={100} className="animate-float" />
      <span className="text-xl font-heading text-sun/80 animate-pulse">Loading...</span>
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
        <Route path="/games/:mode/:section" element={<MuteByMode><SectionProvider><GameGrid /></SectionProvider></MuteByMode>} />

        {/* Individual games/stories — wrapped in SectionProvider for theme context */}
        <Route path="/games/:mode/:section/bubble-pop" element={<MuteByMode><SectionProvider><BubblePop /></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/feed-animals" element={<MuteByMode><SectionProvider><FeedAnimals /></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/pop-critters" element={<MuteByMode><SectionProvider><PopCritters /></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/colouring" element={<MuteByMode><SectionProvider><Colouring /></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/music-pad" element={<MuteByMode><SectionProvider><MusicPad /></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/memory-match" element={<MuteByMode><SectionProvider><MemoryMatch /></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/farm-book" element={<MuteByMode><SectionProvider><FarmBook /></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/three-pigs" element={<MuteByMode><SectionProvider><ThreeLittlePigs /></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/goldilocks" element={<MuteByMode><SectionProvider><Goldilocks /></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/red-riding" element={<MuteByMode><SectionProvider><RedRidingHood /></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/whale-throat" element={<MuteByMode><SectionProvider><WhaleThroat /></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/camel-hump" element={<MuteByMode><SectionProvider><CamelHump /></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/rhino-skin" element={<MuteByMode><SectionProvider><RhinoSkin /></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/leopard-spots" element={<MuteByMode><SectionProvider><LeopardSpots /></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/elephant-child" element={<MuteByMode><SectionProvider><ElephantChild /></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/old-man-kangaroo" element={<MuteByMode><SectionProvider><OldManKangaroo /></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/armadillos" element={<MuteByMode><SectionProvider><Armadillos /></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/first-letter" element={<MuteByMode><SectionProvider><FirstLetter /></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/alphabet-made" element={<MuteByMode><SectionProvider><AlphabetMade /></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/crab-sea" element={<MuteByMode><SectionProvider><CrabSea /></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/cat-walked" element={<MuteByMode><SectionProvider><CatWalked /></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/butterfly-stamped" element={<MuteByMode><SectionProvider><ButterflyStamped /></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/build-a-scene" element={<MuteByMode><SectionProvider><BuildAScene /></SectionProvider></MuteByMode>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
