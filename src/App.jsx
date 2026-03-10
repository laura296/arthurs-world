import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { setGlobalMute } from './hooks/useSound';
import { SectionProvider } from './contexts/SectionContext';
import ArthurBear from './components/ArthurBear';
import GameErrorBoundary from './components/GameErrorBoundary';

// Lazy load all routes
const ModePicker = lazy(() => import('./pages/ModePicker'));
const SectionPicker = lazy(() => import('./pages/SectionPicker'));
const GameGrid = lazy(() => import('./pages/GameGrid'));
const BubblePop = lazy(() => import('./games/BubblePop'));
const FeedAnimals = lazy(() => import('./games/FeedAnimals'));
const PopCritters = lazy(() => import('./games/PopCritters'));
const Colouring = lazy(() => import('./games/Colouring'));
const ColouringBook = lazy(() => import('./games/ColouringBook'));
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
const ShapeMatch = lazy(() => import('./games/ShapeMatch'));
const EllieStorybook = lazy(() => import('./stories/ellie/EllieStorybook'));
const VideoPlayer = lazy(() => import('./games/VideoPlayer'));
const DisneyHub = lazy(() => import('./pages/DisneyHub'));
const Cinderella = lazy(() => import('./stories/disney/Cinderella'));
const SnowWhite = lazy(() => import('./stories/disney/SnowWhite'));
const CaptainHook = lazy(() => import('./stories/disney/CaptainHook'));
const WinnieThePooh = lazy(() => import('./stories/disney/WinnieThePooh'));
const FairyDust = lazy(() => import('./games/FairyDust'));
const HoneyHunt = lazy(() => import('./games/HoneyHunt'));
const HadesRiverStyx = lazy(() => import('./games/HadesRiverStyx'));
const UrsulaPotions = lazy(() => import('./games/UrsulaPotions'));
const PuppyWash = lazy(() => import('./games/PuppyWash'));

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
        {/* Disney Hub — must be before :section so it matches first */}
        <Route path="/games/:mode/disney" element={<MuteByMode><DisneyHub /></MuteByMode>} />
        <Route path="/games/:mode/:section" element={<MuteByMode><SectionProvider><GameGrid /></SectionProvider></MuteByMode>} />

        {/* Individual games/stories — wrapped in SectionProvider + ErrorBoundary */}
        <Route path="/games/:mode/:section/bubble-pop" element={<MuteByMode><SectionProvider><GameErrorBoundary><BubblePop /></GameErrorBoundary></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/feed-animals" element={<MuteByMode><SectionProvider><GameErrorBoundary><FeedAnimals /></GameErrorBoundary></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/pop-critters" element={<MuteByMode><SectionProvider><GameErrorBoundary><PopCritters /></GameErrorBoundary></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/colouring-book" element={<MuteByMode><SectionProvider><GameErrorBoundary><ColouringBook /></GameErrorBoundary></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/free-art" element={<MuteByMode><SectionProvider><GameErrorBoundary><Colouring /></GameErrorBoundary></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/music-pad" element={<MuteByMode><SectionProvider><GameErrorBoundary><MusicPad /></GameErrorBoundary></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/memory-match" element={<MuteByMode><SectionProvider><GameErrorBoundary><MemoryMatch /></GameErrorBoundary></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/farm-book" element={<MuteByMode><SectionProvider><GameErrorBoundary><FarmBook /></GameErrorBoundary></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/three-pigs" element={<MuteByMode><SectionProvider><GameErrorBoundary><ThreeLittlePigs /></GameErrorBoundary></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/goldilocks" element={<MuteByMode><SectionProvider><GameErrorBoundary><Goldilocks /></GameErrorBoundary></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/red-riding" element={<MuteByMode><SectionProvider><GameErrorBoundary><RedRidingHood /></GameErrorBoundary></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/whale-throat" element={<MuteByMode><SectionProvider><GameErrorBoundary><WhaleThroat /></GameErrorBoundary></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/camel-hump" element={<MuteByMode><SectionProvider><GameErrorBoundary><CamelHump /></GameErrorBoundary></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/rhino-skin" element={<MuteByMode><SectionProvider><GameErrorBoundary><RhinoSkin /></GameErrorBoundary></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/leopard-spots" element={<MuteByMode><SectionProvider><GameErrorBoundary><LeopardSpots /></GameErrorBoundary></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/elephant-child" element={<MuteByMode><SectionProvider><GameErrorBoundary><ElephantChild /></GameErrorBoundary></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/old-man-kangaroo" element={<MuteByMode><SectionProvider><GameErrorBoundary><OldManKangaroo /></GameErrorBoundary></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/armadillos" element={<MuteByMode><SectionProvider><GameErrorBoundary><Armadillos /></GameErrorBoundary></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/first-letter" element={<MuteByMode><SectionProvider><GameErrorBoundary><FirstLetter /></GameErrorBoundary></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/alphabet-made" element={<MuteByMode><SectionProvider><GameErrorBoundary><AlphabetMade /></GameErrorBoundary></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/crab-sea" element={<MuteByMode><SectionProvider><GameErrorBoundary><CrabSea /></GameErrorBoundary></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/cat-walked" element={<MuteByMode><SectionProvider><GameErrorBoundary><CatWalked /></GameErrorBoundary></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/butterfly-stamped" element={<MuteByMode><SectionProvider><GameErrorBoundary><ButterflyStamped /></GameErrorBoundary></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/build-a-scene" element={<MuteByMode><SectionProvider><GameErrorBoundary><BuildAScene /></GameErrorBoundary></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/shape-match" element={<MuteByMode><SectionProvider><GameErrorBoundary><ShapeMatch /></GameErrorBoundary></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/ellie-tiny-folk" element={<MuteByMode><SectionProvider><GameErrorBoundary><EllieStorybook /></GameErrorBoundary></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/video/:videoId" element={<MuteByMode><SectionProvider><GameErrorBoundary><VideoPlayer /></GameErrorBoundary></SectionProvider></MuteByMode>} />

        {/* Disney: Princesses */}
        <Route path="/games/:mode/:section/cinderella" element={<MuteByMode><SectionProvider><GameErrorBoundary><Cinderella /></GameErrorBoundary></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/snow-white" element={<MuteByMode><SectionProvider><GameErrorBoundary><SnowWhite /></GameErrorBoundary></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/fairy-dust" element={<MuteByMode><SectionProvider><GameErrorBoundary><FairyDust /></GameErrorBoundary></SectionProvider></MuteByMode>} />

        {/* Disney: Villains */}
        <Route path="/games/:mode/:section/captain-hook" element={<MuteByMode><SectionProvider><GameErrorBoundary><CaptainHook /></GameErrorBoundary></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/hades-river-styx" element={<MuteByMode><SectionProvider><GameErrorBoundary><HadesRiverStyx /></GameErrorBoundary></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/ursula-potions" element={<MuteByMode><SectionProvider><GameErrorBoundary><UrsulaPotions /></GameErrorBoundary></SectionProvider></MuteByMode>} />

        {/* Disney: Pooh */}
        <Route path="/games/:mode/:section/winnie-the-pooh" element={<MuteByMode><SectionProvider><GameErrorBoundary><WinnieThePooh /></GameErrorBoundary></SectionProvider></MuteByMode>} />
        <Route path="/games/:mode/:section/honey-hunt" element={<MuteByMode><SectionProvider><GameErrorBoundary><HoneyHunt /></GameErrorBoundary></SectionProvider></MuteByMode>} />

        {/* Disney: Dalmatians */}
        <Route path="/games/:mode/:section/puppy-wash" element={<MuteByMode><SectionProvider><GameErrorBoundary><PuppyWash /></GameErrorBoundary></SectionProvider></MuteByMode>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
