import GamesBackground from './GamesBackground';
import PuzzlesBackground from './PuzzlesBackground';
import ArtBackground from './ArtBackground';
import BooksBackground from './BooksBackground';
import MusicBackground from './MusicBackground';

const BACKGROUNDS = {
  games: GamesBackground,
  puzzles: PuzzlesBackground,
  art: ArtBackground,
  books: BooksBackground,
  music: MusicBackground,
};

export default function SectionBackground({ section }) {
  const Bg = BACKGROUNDS[section];
  if (!Bg) return <div className="absolute inset-0 bg-night" />;
  return <Bg />;
}
