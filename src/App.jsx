import { lazy, Suspense, useEffect, useState, createContext, useContext } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { setGlobalMute } from './hooks/useSound';
import { SectionProvider } from './contexts/SectionContext';
import ArthurBear from './components/ArthurBear';
import GameErrorBoundary from './components/GameErrorBoundary';
import PageTransition from './components/PageTransition';
import OfflineIndicator from './components/OfflineIndicator';
import { useSessionTimer } from './components/SessionTimer';

export const SessionTimerContext = createContext(null);

// Lazy load all routes
const ModePicker = lazy(() => import('./pages/ModePicker'));
const SectionPicker = lazy(() => import('./pages/SectionPicker'));
const GameGrid = lazy(() => import('./pages/GameGrid'));
const BubblePop = lazy(() => import('./games/BubblePop'));
const FeedAnimals = lazy(() => import('./games/FeedAnimals'));
const PopCritters = lazy(() => import('./games/PopCritters'));
const Colouring = lazy(() => import('./games/Colouring'));
const ColouringBook = lazy(() => import('./games/ColouringBook'));
const DotArt = lazy(() => import('./games/DotArt'));
const StampArt = lazy(() => import('./games/StampArt'));
const MusicPad = lazy(() => import('./games/MusicPad'));
const Xylophone = lazy(() => import('./games/Xylophone'));
const DrumPad = lazy(() => import('./games/DrumPad'));
const AnimalSounds = lazy(() => import('./games/AnimalSounds'));
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
// Aesop's Fables
const TortoiseAndHare = lazy(() => import('./stories/aesop/TortoiseAndHare'));
const LionAndMouse = lazy(() => import('./stories/aesop/LionAndMouse'));
const BoyWhoCriedWolf = lazy(() => import('./stories/aesop/BoyWhoCriedWolf'));
const AntAndGrasshopper = lazy(() => import('./stories/aesop/AntAndGrasshopper'));
const FoxAndGrapes = lazy(() => import('./stories/aesop/FoxAndGrapes'));
const TownMouseCountryMouse = lazy(() => import('./stories/aesop/TownMouseCountryMouse'));
// DisneyHub removed — Disney content integrated into main categories
const Cinderella = lazy(() => import('./stories/disney/Cinderella'));
const SnowWhite = lazy(() => import('./stories/disney/SnowWhite'));
const CaptainHook = lazy(() => import('./stories/disney/CaptainHook'));
const WinnieThePooh = lazy(() => import('./stories/disney/WinnieThePooh'));
const FairyDust = lazy(() => import('./games/FairyDust'));
const HoneyHunt = lazy(() => import('./games/HoneyHunt'));
const HadesRiverStyx = lazy(() => import('./games/HadesRiverStyx'));
const UrsulaPotions = lazy(() => import('./games/UrsulaPotions'));
const PuppyWash = lazy(() => import('./games/PuppyWash'));
const InsideOutHub = lazy(() => import('./games/inside-out/InsideOutHub'));
const ControlPanelMeltdown = lazy(() => import('./games/inside-out/ControlPanelMeltdown'));
const AngerCoolDown = lazy(() => import('./games/inside-out/AngerCoolDown'));
const AlarmAvalanche = lazy(() => import('./games/inside-out/AlarmAvalanche'));
const ChainReactionCrisis = lazy(() => import('./games/inside-out/ChainReactionCrisis'));
const MadHatterTeaParty = lazy(() => import('./games/alice/MadHatterTeaParty'));
const TortoiseHareRace = lazy(() => import('./games/TortoiseHareRace'));
const CountingGarden = lazy(() => import('./games/CountingGarden'));
const ColourSort = lazy(() => import('./games/ColourSort'));
const MorningRoutine = lazy(() => import('./games/morning-routine/MorningRoutine'));
const SparkleTeeth = lazy(() => import('./games/sparkle-teeth/SparkleTeeth'));
const ArthursLunchbox = lazy(() => import('./games/lunchbox/ArthursLunchbox'));

// ── Enhanced Loading Screen ──────────────────────────────────────────
const LOADING_MESSAGES = [
  'Getting ready...',
  'Sprinkling magic...',
  'Almost there...',
  'Loading adventures...',
];

const SPARKLE_POSITIONS = [
  { angle: 0,   rx: 56, ry: 40, size: 6,  delay: 0 },
  { angle: 45,  rx: 50, ry: 36, size: 5,  delay: 0.3 },
  { angle: 90,  rx: 58, ry: 42, size: 7,  delay: 0.6 },
  { angle: 135, rx: 52, ry: 38, size: 4,  delay: 0.9 },
  { angle: 180, rx: 54, ry: 40, size: 6,  delay: 1.2 },
  { angle: 225, rx: 48, ry: 34, size: 5,  delay: 1.5 },
  { angle: 270, rx: 56, ry: 44, size: 7,  delay: 1.8 },
  { angle: 315, rx: 50, ry: 38, size: 4,  delay: 2.1 },
];

function Loading() {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setMsgIdx(i => (i + 1) % LOADING_MESSAGES.length), 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-night gap-4 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: 'radial-gradient(ellipse at 50% 45%, rgba(250,204,21,0.08) 0%, transparent 60%)' }} />

      {/* Orbiting sparkles */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {SPARKLE_POSITIONS.map((sp, i) => (
            <div key={i} className="absolute loading-orbit-sparkle"
                 style={{
                   '--orbit-rx': `${sp.rx}px`,
                   '--orbit-ry': `${sp.ry}px`,
                   '--orbit-start': `${sp.angle}deg`,
                   animationDelay: `${sp.delay}s`,
                 }}>
              <svg width={sp.size} height={sp.size} viewBox="0 0 20 20">
                <path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z"
                      fill="#facc15" opacity="0.8" />
              </svg>
            </div>
          ))}
        </div>

        {/* Pulse glow behind bear */}
        <div className="absolute inset-[-30%] rounded-full animate-pulse"
             style={{ background: 'radial-gradient(circle, rgba(250,204,21,0.12) 0%, transparent 70%)' }} />

        <ArthurBear expression="happy" size={100} className="animate-float relative z-10" />
      </div>

      <span className="text-xl font-heading text-sun/80 transition-opacity duration-500"
            key={msgIdx}
            style={{ animation: 'gentleIn 0.5s ease-out' }}>
        {LOADING_MESSAGES[msgIdx]}
      </span>

      {/* Tiny progress dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map(i => (
          <div key={i} className="w-2 h-2 rounded-full bg-sun/40"
               style={{ animation: `loadingDot 1.2s ease-in-out ${i * 0.2}s infinite` }} />
        ))}
      </div>
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

// ── Shorthand wrappers ──────────────────────────────────────────────
const M = ({ children }) => <MuteByMode>{children}</MuteByMode>;
const S = ({ children }) => <SectionProvider>{children}</SectionProvider>;
const E = ({ children }) => <GameErrorBoundary>{children}</GameErrorBoundary>;

/** Page route: wraps in PageTransition for entrance animation */
const P = ({ children, variant }) => <PageTransition variant={variant}>{children}</PageTransition>;
/** Game route: MuteByMode + SectionProvider + ErrorBoundary + PageTransition */
const G = ({ children }) => <M><S><E><P>{children}</P></E></S></M>;

// ── Routes ──────────────────────────────────────────────────────────
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<P><ModePicker /></P>} />

      {/* Mode-aware hub routes */}
      <Route path="/games/:mode" element={<M><P><SectionPicker /></P></M>} />
      <Route path="/games/:mode/:section" element={<M><S><P><GameGrid /></P></S></M>} />

        {/* Individual games/stories */}
        <Route path="/games/:mode/:section/bubble-pop" element={<G><BubblePop /></G>} />
        <Route path="/games/:mode/:section/feed-animals" element={<G><FeedAnimals /></G>} />
        <Route path="/games/:mode/:section/pop-critters" element={<G><PopCritters /></G>} />
        <Route path="/games/:mode/:section/colouring-book" element={<G><ColouringBook /></G>} />
        <Route path="/games/:mode/:section/free-art" element={<G><Colouring /></G>} />
        <Route path="/games/:mode/:section/dot-art" element={<G><DotArt /></G>} />
        <Route path="/games/:mode/:section/stamp-art" element={<G><StampArt /></G>} />
        <Route path="/games/:mode/:section/music-pad" element={<G><MusicPad /></G>} />
        <Route path="/games/:mode/:section/xylophone" element={<G><Xylophone /></G>} />
        <Route path="/games/:mode/:section/drum-pad" element={<G><DrumPad /></G>} />
        <Route path="/games/:mode/:section/animal-sounds" element={<G><AnimalSounds /></G>} />
        <Route path="/games/:mode/:section/memory-match" element={<G><MemoryMatch /></G>} />
        <Route path="/games/:mode/:section/farm-book" element={<G><FarmBook /></G>} />
        <Route path="/games/:mode/:section/three-pigs" element={<G><ThreeLittlePigs /></G>} />
        <Route path="/games/:mode/:section/goldilocks" element={<G><Goldilocks /></G>} />
        <Route path="/games/:mode/:section/red-riding" element={<G><RedRidingHood /></G>} />
        <Route path="/games/:mode/:section/whale-throat" element={<G><WhaleThroat /></G>} />
        <Route path="/games/:mode/:section/camel-hump" element={<G><CamelHump /></G>} />
        <Route path="/games/:mode/:section/rhino-skin" element={<G><RhinoSkin /></G>} />
        <Route path="/games/:mode/:section/leopard-spots" element={<G><LeopardSpots /></G>} />
        <Route path="/games/:mode/:section/elephant-child" element={<G><ElephantChild /></G>} />
        <Route path="/games/:mode/:section/old-man-kangaroo" element={<G><OldManKangaroo /></G>} />
        <Route path="/games/:mode/:section/armadillos" element={<G><Armadillos /></G>} />
        <Route path="/games/:mode/:section/first-letter" element={<G><FirstLetter /></G>} />
        <Route path="/games/:mode/:section/alphabet-made" element={<G><AlphabetMade /></G>} />
        <Route path="/games/:mode/:section/crab-sea" element={<G><CrabSea /></G>} />
        <Route path="/games/:mode/:section/cat-walked" element={<G><CatWalked /></G>} />
        <Route path="/games/:mode/:section/butterfly-stamped" element={<G><ButterflyStamped /></G>} />
        <Route path="/games/:mode/:section/build-a-scene" element={<G><BuildAScene /></G>} />
        <Route path="/games/:mode/:section/shape-match" element={<G><ShapeMatch /></G>} />
        <Route path="/games/:mode/:section/ellie-tiny-folk" element={<G><EllieStorybook /></G>} />
        <Route path="/games/:mode/:section/video/:videoId" element={<G><VideoPlayer /></G>} />

        {/* Aesop's Fables */}
        <Route path="/games/:mode/:section/tortoise-hare" element={<G><TortoiseAndHare /></G>} />
        <Route path="/games/:mode/:section/lion-mouse" element={<G><LionAndMouse /></G>} />
        <Route path="/games/:mode/:section/boy-cried-wolf" element={<G><BoyWhoCriedWolf /></G>} />
        <Route path="/games/:mode/:section/ant-grasshopper" element={<G><AntAndGrasshopper /></G>} />
        <Route path="/games/:mode/:section/fox-grapes" element={<G><FoxAndGrapes /></G>} />
        <Route path="/games/:mode/:section/town-country-mouse" element={<G><TownMouseCountryMouse /></G>} />

        {/* Disney-origin content (now in games/books) */}
        <Route path="/games/:mode/:section/cinderella" element={<G><Cinderella /></G>} />
        <Route path="/games/:mode/:section/snow-white" element={<G><SnowWhite /></G>} />
        <Route path="/games/:mode/:section/captain-hook" element={<G><CaptainHook /></G>} />
        <Route path="/games/:mode/:section/winnie-the-pooh" element={<G><WinnieThePooh /></G>} />
        <Route path="/games/:mode/:section/fairy-dust" element={<G><FairyDust /></G>} />
        <Route path="/games/:mode/:section/hades-river-styx" element={<G><HadesRiverStyx /></G>} />
        <Route path="/games/:mode/:section/ursula-potions" element={<G><UrsulaPotions /></G>} />
        <Route path="/games/:mode/:section/honey-hunt" element={<G><HoneyHunt /></G>} />
        <Route path="/games/:mode/:section/inside-out-hub" element={<G><InsideOutHub /></G>} />
        <Route path="/games/:mode/:section/control-panel-meltdown" element={<G><ControlPanelMeltdown /></G>} />
        <Route path="/games/:mode/:section/anger-cool-down" element={<G><AngerCoolDown /></G>} />
        <Route path="/games/:mode/:section/alarm-avalanche" element={<G><AlarmAvalanche /></G>} />
        <Route path="/games/:mode/:section/chain-reaction-crisis" element={<G><ChainReactionCrisis /></G>} />
        <Route path="/games/:mode/:section/puppy-wash" element={<G><PuppyWash /></G>} />

        {/* Educational games */}
        <Route path="/games/:mode/:section/counting-garden" element={<G><CountingGarden /></G>} />
        <Route path="/games/:mode/:section/colour-sort" element={<G><ColourSort /></G>} />

        {/* Aesop's Fables — Games */}
        <Route path="/games/:mode/:section/tortoise-hare-race" element={<G><TortoiseHareRace /></G>} />

        {/* Alice in Wonderland */}
        <Route path="/games/:mode/:section/mad-hatter-tea-party" element={<G><MadHatterTeaParty /></G>} />

        {/* Self-Care */}
        <Route path="/games/:mode/:section/morning-routine" element={<G><MorningRoutine /></G>} />
        <Route path="/games/:mode/:section/sparkle-teeth" element={<G><SparkleTeeth /></G>} />
        <Route path="/games/:mode/:section/arthurs-lunchbox" element={<G><ArthursLunchbox /></G>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  );
}

export default function App() {
  const sessionTimer = useSessionTimer();

  return (
    <SessionTimerContext.Provider value={sessionTimer}>
      <Suspense fallback={<Loading />}>
        <AppRoutes />
      </Suspense>
      <sessionTimer.SessionTimerUI />
      <OfflineIndicator />
    </SessionTimerContext.Provider>
  );
}
