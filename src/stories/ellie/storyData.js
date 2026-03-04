// src/stories/ellie/storyData.js

export const VERSION = 'ellie-v1';

// ── Style anchors (from spec Section 4) ──

export const STYLE_ANCHOR = 'Whimsical mid-century American children\'s picture book style. Bold black ink outlines. Flat saturated colours. No gradients. Wobbly imperfect curved lines. Impossible tall wiggly trees. Striped or patterned sky. Expressive cartoon faces. No text. No letters. No words.';

export const ELLIE_ANCHOR = 'Ellie the lavender-purple elephant with large round kind eyes, a warm smile, a gently upward-curling trunk, rounded chubby body, large ears with pink inner ear, and a small tuft of hair on her head.';

// ── Character Sheet Prompt (spec Section 3.2 — exact) ──

export const CHARACTER_SHEET_PROMPT = 'A single character design sheet of an original cartoon elephant character named Ellie. She is lavender-purple with slightly darker purple outlines. Large round kind eyes with long eyelashes and a warm expression. Rounded chubby body proportions — she is gentle and soft-looking, not fierce. Her trunk curls upward at the tip in a friendly way. Large round ears with a soft pink inner ear. Short stubby legs. A small tuft of light hair on the top of her head. She stands facing three-quarters toward the viewer, smiling warmly. Clean white background. The art style is a mid-century American children\'s picture book: bold black ink outlines, flat saturated colours, no gradients, slightly wobbly imperfect lines, expressive and charming. No text. No words. No labels.';

// ── Scene Prompts (spec Section 4) ──

export const SCENE_PROMPTS = [
  // Scene 1 — Ellie Hears the Speck
  `${ELLIE_ANCHOR} stands in a magical jungle, looking surprised and delighted. She holds a large glowing pink flower in her curled trunk. A tiny golden speck of light floats in the air right in front of her eye. Tall wobbly striped trees and enormous round leaves surround her. Warm morning sky with horizontal orange and yellow stripes. ${STYLE_ANCHOR}`,
  // Scene 2 — The Animals Want the Flower
  `${ELLIE_ANCHOR} protectively cradles a glowing pink flower against her chest, looking brave and determined. Surrounding her are grumpy cartoon animals: a kangaroo with arms crossed and a scowl, a bossy eagle with ruffled feathers, a cheeky monkey pointing and laughing. Sunset orange and red striped sky. Tall wobbly jungle trees. ${STYLE_ANCHOR}`,
  // Scene 3 — Make Noise!
  `${ELLIE_ANCHOR} stands with one large ear tilted forward, straining to listen, her eyes closed in concentration. In the foreground, microscopic tiny colourful people stand on a giant pink flower petal, shouting upward with arms waving and mouths wide open. Curvy sound wave lines radiate upward. Deep purple and indigo striped sky with large cartoon stars. ${STYLE_ANCHOR}`,
  // Scene 4 — They Hear Us!
  `${ELLIE_ANCHOR} smiling with closed eyes and rosy cheeks, holding a pink flower aloft in joy. Tiny colourful people — a wizard in a tall hat, a queen with a crown, a baby, a chef, a musician — dance and wave on the flower petals around her. Warm golden sunrise sky with yellow and cream stripes. Confetti and stars fill the air. ${STYLE_ANCHOR}`,
];

// ── Game Background Prompts (spec Section 4) ──

export const GAME_BG_PROMPTS = [
  // Game 1 Background — Open Sky
  `A wide open blue sky with horizontal white cloud stripes and fluffy impossible cloud shapes. At the bottom, rolling bright green hills with tiny wobbly trees. A single small glowing golden speck of light floats in the centre of the blue sky. Lots of open space. No characters. ${STYLE_ANCHOR}`,
  // Game 2 Background — Jungle Clearing
  `A sunny jungle clearing with a large glowing pink flower on a long stem in the centre. Soft green ground with round hills. Blue and white striped sky. Tall wiggly colourful trees at the edges with plenty of open space between them. No characters — space for animals to appear from the edges. ${STYLE_ANCHOR}`,
  // Game 3 Background — Night Sky
  `A deep purple night sky filled with large cartoon stars and swirling sound wave lines radiating across the entire scene. A large lavender elephant ear at the right edge, straining forward to listen. A tiny glowing flower in the lower centre. Magical glowing atmosphere. No full characters — just the ear at edge. ${STYLE_ANCHOR}`,
  // Game 4 Background — The Giant Flower
  `A giant magical pink flower fills the lower two-thirds of the scene against a bright happy green background with blue and yellow striped sky. The flower has many large open petals, each with a tiny glowing doorway or hiding spot in it. Joyful celebratory atmosphere. Floating stars and sparkles. No characters — space in the petals for the Tiny Folk to appear. ${STYLE_ANCHOR}`,
];

// ── Animal Sprite Prompts (for Game 2: Shoo the Animals) ──

export const ANIMAL_NAMES = ['kangaroo', 'eagle', 'monkey', 'parrot', 'snake', 'lizard', 'frog', 'toucan'];

export const ANIMAL_SPRITE_PROMPTS = [
  `A grumpy cartoon kangaroo with arms crossed and a scowl, looking bossy and sceptical. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A bossy cartoon eagle with ruffled feathers, puffed-up chest, and an annoyed expression. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A cheeky cartoon monkey pointing and laughing, mischievous expression, swinging tail. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A colourful cartoon parrot with a big beak, squawking with wings spread, looking indignant. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A silly cartoon snake coiled up with a smirk, tongue sticking out playfully. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A small cartoon lizard with big eyes, looking curious and a bit sneaky, bright green with spots. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A round cartoon frog with big bulging eyes and a wide grin, sitting on its haunches. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A colourful cartoon toucan with an enormous bright beak, looking proud and silly. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
];

// ── Tiny Folk Sprite Prompts (for Game 4: Pop the Tiny Folk) ──

export const FOLK_NAMES = ['wizard', 'queen', 'baby', 'chef', 'musician', 'knight', 'painter', 'dancer'];

export const FOLK_SPRITE_PROMPTS = [
  `A tiny cartoon wizard in a tall pointy hat with stars, holding a magic wand, cheerful expression, long robe. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A tiny cartoon queen with a golden crown, flowing robe, waving regally with a warm smile. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A tiny cartoon baby with a nappy, big round eyes, giggling with arms up, rosy cheeks. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A tiny cartoon chef with a tall white hat, holding a wooden spoon, jolly round face. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A tiny cartoon musician playing a trumpet, cheeks puffed out, musical notes around. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A tiny cartoon knight in shining armour with a small shield and sword, friendly face visible through helmet. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A tiny cartoon painter with a beret, holding a paintbrush and palette, splashes of colour on apron. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
  `A tiny cartoon dancer in a flowing dress, mid-twirl with arms outstretched, joyful expression. Single character on a clean white background. No other elements. ${STYLE_ANCHOR}`,
];

// ── Narration Text (spec Section 2) ──

export const CHAPTERS = [
  {
    title: 'Ellie Hears Something',
    narration: '"On a warm sunny morning, Ellie the Elephant was splashing in the jungle pool \u2014 when she heard something tiny. A little voice, on a little speck, floating past on the breeze..."',
    sceneKey: `${VERSION}-scene-1`,
    gameBgKey: `${VERSION}-game-bg-1`,
    gameTitle: 'Find the Speck',
  },
  {
    title: 'Ellie Protects the Flower',
    narration: '"I hear you!" said Ellie, catching the speck on a flower. "I\'ll keep you safe!" But the other animals didn\'t believe her \u2014 and they wanted to take the flower away! "Shoo!" said Ellie. "Leave my friends alone!"',
    sceneKey: `${VERSION}-scene-2`,
    gameBgKey: `${VERSION}-game-bg-2`,
    gameTitle: 'Shoo the Animals',
  },
  {
    title: 'Make Some Noise!',
    narration: '"The animals still didn\'t believe! "Unless we make enough noise," said the tiniest one, "no one will know we\'re here! Everyone \u2014 make the BIGGEST noise you can!""',
    sceneKey: `${VERSION}-scene-3`,
    gameBgKey: `${VERSION}-game-bg-3`,
    gameTitle: 'Noise Meter',
  },
  {
    title: 'They Hear Us!',
    narration: '"And Ellie heard them all! The Tiny Folk came dancing out \u2014 waving and spinning and singing hello! "A person\'s a person, no matter how small," smiled Ellie. "I hear every one of you!""',
    sceneKey: `${VERSION}-scene-4`,
    gameBgKey: `${VERSION}-game-bg-4`,
    gameTitle: 'Pop the Tiny Folk',
  },
];

// ── Screen Sequence ──

export const SCREENS = [
  { type: 'story', chapter: 0 },
  { type: 'game',  chapter: 0 },
  { type: 'story', chapter: 1 },
  { type: 'game',  chapter: 1 },
  { type: 'story', chapter: 2 },
  { type: 'game',  chapter: 2 },
  { type: 'story', chapter: 3 },
  { type: 'game',  chapter: 3 },
];

// ── All image keys (for cache checks) ──

export function getAllImageKeys() {
  const keys = [`${VERSION}-character-sheet`];
  for (let i = 1; i <= 4; i++) {
    keys.push(`${VERSION}-scene-${i}`);
    keys.push(`${VERSION}-game-bg-${i}`);
  }
  ANIMAL_NAMES.forEach(name => keys.push(`${VERSION}-animal-${name}`));
  FOLK_NAMES.forEach(name => keys.push(`${VERSION}-folk-${name}`));
  return keys;
}
