/**
 * Image generation prompts for all missing images.
 * Each key is the image path (relative to /arthurs-world/).
 * Visual style prefix is prepended automatically by the generator.
 */

const STYLE_PREFIX =
  'Pixar-quality soft 3D rendered illustration for a children\'s storybook. ' +
  'Warm golden-hour lighting, rounded forms, subsurface scattering feel. ' +
  'Safe, curious, gentle mood. Saturated warm amber palette, shadows lean purple/blue never grey. ' +
  'No text, no words, no letters, no UI elements.';

const CARD_STYLE =
  'Pixar-quality soft 3D rendered card art, square composition, single focal subject centered. ' +
  'Warm golden-hour lighting, vibrant saturated colours, rounded forms. ' +
  'No text, no words, no letters.';

// ── Section Heroes (2732×2048 iPad landscape) ──

const sectionHeroes = {
  '/images/sections/games.webp':
    'A magical playroom filled with soft toys, colourful building blocks, and a friendly bear cub peeking through a toy castle. Warm amber light streams through a window.',

  '/images/sections/art.webp':
    'A cosy art studio with paintbrushes in jars, splashes of rainbow paint, an easel with a half-finished painting of a rainbow. Crayons and paper scattered on a wooden table.',

  '/images/sections/books.webp':
    'A magical library nook with a comfy armchair, stacked storybooks with glowing pages, fairy lights, and a friendly owl perched on a bookshelf. Warm candlelight glow.',

  '/images/sections/music.webp':
    'A whimsical music room with a tiny piano, colourful xylophone, floating musical notes made of gold light, tambourines, and a friendly robin singing on a branch.',

  '/images/sections/videos.webp':
    'A cosy den with soft cushions arranged in front of a glowing screen showing colourful shapes. Popcorn bowl, fairy lights, warm amber glow from the screen.',
};

// ── Aesop's Fables ──

const tortoiseHare = {
  '/images/tortoise-hare/page-1.webp':
    'A speedy brown hare showing off, running in circles around woodland animals. Green meadow, blue sky, forest edge.',
  '/images/tortoise-hare/page-2.webp':
    'A small green tortoise looking up confidently at a laughing hare. Other woodland animals watching. Sunny meadow.',
  '/images/tortoise-hare/page-3.webp':
    'A race starting line with a hare zooming ahead in a blur and a tortoise taking his first slow step. Cheering woodland animals on the sidelines.',
  '/images/tortoise-hare/page-4.webp':
    'A hare sleeping peacefully under a shady tree, snoring with a smile. Dappled sunlight, butterflies, peaceful meadow.',
  '/images/tortoise-hare/page-5.webp':
    'A determined tortoise walking steadily along a country path, one step at a time. Rolling green hills, warm sunshine.',
  '/images/tortoise-hare/page-6.webp':
    'A tortoise tiptoeing carefully past a sleeping hare under a tree. Finger-to-lips gesture, quiet peaceful scene.',
  '/images/tortoise-hare/page-7.webp':
    'A panicked hare waking up and seeing the tortoise near the finish line ribbon in the distance. Shocked expression.',
  '/images/tortoise-hare/page-8.webp':
    'A happy tortoise crossing a finish line with a gold ribbon, woodland animals cheering. Confetti, celebration, blue sky.',
};

const lionMouse = {
  '/images/lion-mouse/page-1.webp':
    'A great golden lion sleeping peacefully in warm sunshine on the African savanna. Tall grass, acacia tree.',
  '/images/lion-mouse/page-2.webp':
    'A tiny brown mouse accidentally running across a sleeping lion\'s nose. The lion\'s eyes popping open in surprise.',
  '/images/lion-mouse/page-3.webp':
    'A big lion holding a tiny mouse gently in his paw. The mouse is pleading with big eyes. Savanna background.',
  '/images/lion-mouse/page-4.webp':
    'A lion laughing heartily while a tiny mouse walks away proudly. Warm savanna, golden light.',
  '/images/lion-mouse/page-5.webp':
    'A sad lion tangled in a thick rope net, trapped. Dark moody scene with hunters\' torches in the distance.',
  '/images/lion-mouse/page-6.webp':
    'A tiny brave mouse running toward a trapped lion in a net, determined expression. Dramatic lighting.',
  '/images/lion-mouse/page-7.webp':
    'Close-up of a tiny mouse nibbling through thick ropes of a net with sharp teeth. Focused, determined.',
  '/images/lion-mouse/page-8.webp':
    'A freed lion nuzzling a tiny mouse sitting on his paw. Both smiling. Warm golden sunset, savanna.',
};

const boyCriedWolf = {
  '/images/boy-cried-wolf/page-1.webp':
    'A little shepherd boy sitting on a big green hill with fluffy white sheep grazing peacefully. Blue sky, wildflowers.',
  '/images/boy-cried-wolf/page-2.webp':
    'A bored shepherd boy with a mischievous grin, cupping his hands around his mouth to shout. Sheep grazing behind him.',
  '/images/boy-cried-wolf/page-3.webp':
    'Villagers running up a green hill with pitchforks and tools, looking worried. The boy laughing. No wolf anywhere.',
  '/images/boy-cried-wolf/page-4.webp':
    'The same shepherd boy shouting again from the hilltop, looking cheeky. Sheep looking unimpressed.',
  '/images/boy-cried-wolf/page-5.webp':
    'Angry villagers shaking their fists at a giggling boy on a hill. Red faces, crossed arms. Sunny day.',
  '/images/boy-cried-wolf/page-6.webp':
    'A scary grey wolf creeping out of a dark forest edge toward sheep on a hill. The boy looking terrified.',
  '/images/boy-cried-wolf/page-7.webp':
    'A scared boy shouting desperately from a hilltop. The village below is ignoring him. Wolf approaching sheep.',
  '/images/boy-cried-wolf/page-8.webp':
    'A kind farmer chasing a wolf away with a stick. The relieved boy hugging a sheep. Warm sunset.',
};

const antGrasshopper = {
  '/images/ant-grasshopper/page-1.webp':
    'A tiny ant carrying a big grain of wheat on a hot summer day. Bright sunshine, wildflowers, green grass.',
  '/images/ant-grasshopper/page-2.webp':
    'A happy green grasshopper singing and dancing on a leaf, playing a tiny fiddle. Bright summer meadow.',
  '/images/ant-grasshopper/page-3.webp':
    'A grasshopper leaning casually on a flower, talking to a busy ant carrying food. Summer meadow.',
  '/images/ant-grasshopper/page-4.webp':
    'An ant\'s cosy underground home filled with neatly stacked seeds, berries and grain. Warm interior light.',
  '/images/ant-grasshopper/page-5.webp':
    'A snowy winter landscape. Bare trees, snowflakes falling, cold blue light. Wind blowing.',
  '/images/ant-grasshopper/page-6.webp':
    'A shivering, sad grasshopper in the snow, hugging himself. Empty stomach, cold blue tones.',
  '/images/ant-grasshopper/page-7.webp':
    'A kind ant opening her cosy warm door to a shivering grasshopper. Warm light spilling out into the snow.',
  '/images/ant-grasshopper/page-8.webp':
    'An ant and grasshopper sharing food together at a tiny table inside a warm cosy burrow. Happy ending.',
};

const foxGrapes = {
  '/images/fox-grapes/page-1.webp':
    'A hungry orange fox walking through a sunny woodland path. Dappled light, green leaves, curious expression.',
  '/images/fox-grapes/page-2.webp':
    'A fox looking up wide-eyed at big juicy purple grapes hanging high on a vine above. Mouth watering.',
  '/images/fox-grapes/page-3.webp':
    'A fox jumping high into the air trying to reach purple grapes on a tall vine. Dynamic pose, stretching.',
  '/images/fox-grapes/page-4.webp':
    'A fox jumping again and again, each time missing the grapes. Multiple jump poses, getting frustrated.',
  '/images/fox-grapes/page-5.webp':
    'A fox making one final enormous leap with all his might toward the grapes. Maximum stretch, dramatic.',
  '/images/fox-grapes/page-6.webp':
    'A tired, grumpy fox sitting on the ground looking up at the grapes with a scowl. Arms crossed.',
  '/images/fox-grapes/page-7.webp':
    'A fox walking away with his nose in the air, looking snooty. A little blue bird watching from a branch.',
  '/images/fox-grapes/page-8.webp':
    'A little blue bird eating a grape happily on the vine. The fox small in the distance walking away. Moral moment.',
};

const townCountryMouse = {
  '/images/town-country-mouse/page-1.webp':
    'A cute brown mouse in a cosy underground home beneath a big oak tree. Simple furniture, acorn cups, warm.',
  '/images/town-country-mouse/page-2.webp':
    'Two mice cousins greeting each other — one in a country hat, one in a city bowtie. Under the oak tree.',
  '/images/town-country-mouse/page-3.webp':
    'Country mouse serving seeds and berries on a tiny leaf plate. Town mouse looking unimpressed. Simple burrow.',
  '/images/town-country-mouse/page-4.webp':
    'Two tiny mice looking up in awe at enormous city buildings and bright lights. Night scene, dramatic scale.',
  '/images/town-country-mouse/page-5.webp':
    'Two mice on a huge dining table with giant cheese wheels, cakes and chocolate. Eyes wide with amazement.',
  '/images/town-country-mouse/page-6.webp':
    'A big scary ginger cat leaping toward two terrified mice on a table. Dramatic, scary but cartoonish.',
  '/images/town-country-mouse/page-7.webp':
    'Two mice hiding in a tiny crack in a wall, peeking out with big scared eyes. Cat\'s paw visible outside.',
  '/images/town-country-mouse/page-8.webp':
    'A happy country mouse back in his cosy burrow under the oak tree, snuggling into bed. Peaceful, safe.',
};

// ── Feelings Books ──

const feelingsMonster = {
  '/images/feelings-monster/page-1.webp':
    'A cute round fluffy monster with all colours of the rainbow swirled together — muddled and confused. Big googly eyes.',
  '/images/feelings-monster/page-2.webp':
    'A bright YELLOW fluffy monster jumping joyfully. Sunshine beams, sparkles, happy flowers blooming around him.',
  '/images/feelings-monster/page-3.webp':
    'A BLUE fluffy monster sitting in gentle rain, one tear rolling down. Soft, empathetic, not scary. Rainclouds.',
  '/images/feelings-monster/page-4.webp':
    'A RED fluffy monster with steam coming from his ears, fists clenched. Then taking a deep breath, calming down.',
  '/images/feelings-monster/page-5.webp':
    'A small BLACK fluffy monster curled up in a dark corner, looking nervous. A gentle warm light approaching.',
  '/images/feelings-monster/page-6.webp':
    'A soft GREEN fluffy monster floating peacefully on a cloud. Gentle breeze, leaves drifting, serene sky.',
  '/images/feelings-monster/page-7.webp':
    'A warm PINK fluffy monster giving a big hug. Hearts floating around, warm rosy glow, cosy.',
  '/images/feelings-monster/page-8.webp':
    'All the coloured monsters together in a group — yellow, blue, red, black, green, pink — sorted and happy. Rainbow.',
};

const whenIFeelBig = {
  '/images/when-i-feel-big/page-1.webp':
    'A small cute brown bear cub sitting alone, looking overwhelmed. Swirling colourful feelings visible as auras around him.',
  '/images/when-i-feel-big/page-2.webp':
    'A bear cub bouncing with excitement, fizzy sparkles in his tummy area. Bright, energetic, yellow sparkles.',
  '/images/when-i-feel-big/page-3.webp':
    'A frustrated bear cub looking at a toppled tower of building blocks. Furrowed brow, stamping one foot.',
  '/images/when-i-feel-big/page-4.webp':
    'A worried bear cub with thought bubbles full of question marks and "what if" swirls. Knotty tummy visual.',
  '/images/when-i-feel-big/page-5.webp':
    'A proud bear cub puffing out his chest with a big smile, arms on hips. Gold star glow, accomplished feeling.',
  '/images/when-i-feel-big/page-6.webp':
    'A shy bear cub hiding behind a bigger mama bear, peeking out with one eye. Gentle, sweet, soft light.',
  '/images/when-i-feel-big/page-7.webp':
    'A sleepy bear cub with droopy eyes doing a big yawn. Stars and moons, bedtime colours, cosy pajamas.',
  '/images/when-i-feel-big/page-8.webp':
    'A bear cub surrounded by soft glowing orbs of different colours representing all feelings. Warm, accepting, loved.',
};

const feelingsFriends = {
  '/images/feelings-friends/page-1.webp':
    'A group of cute baby animals — bunny, kitten, puppy, hedgehog, duckling, owl — sitting together in a meadow circle.',
  '/images/feelings-friends/page-2.webp':
    'A happy white bunny hopping joyfully through a flower meadow. Daisies, butterflies, bright sunshine.',
  '/images/feelings-friends/page-3.webp':
    'A sad grey kitten with big teary eyes looking for a lost toy mouse. Soft, empathetic mood.',
  '/images/feelings-friends/page-4.webp':
    'An angry brown puppy growling with furrowed brows. A stolen bone nearby. Counting bubbles: 1, 2, 3.',
  '/images/feelings-friends/page-5.webp':
    'A scared hedgehog curled into a ball in a dark corner. A gentle light approaching. Protective, comforting.',
  '/images/feelings-friends/page-6.webp':
    'A silly yellow duckling walking backwards with feet in the air, quacking. Other animals giggling. Playful.',
  '/images/feelings-friends/page-7.webp':
    'A warm brown owl with wings spread wide giving a big feathery hug. Hearts, warmth, cosy nest.',
  '/images/feelings-friends/page-8.webp':
    'All the animal friends together in a warm group cuddle — bunny, kitten, puppy, hedgehog, duckling, owl. Rainbow above.',
};

// ── Disney Stories ──

const cinderella = {
  '/images/disney/cinderella/page-1.webp':
    'A kind young girl in a simple dress sweeping a grand hallway while two mean stepsisters watch. Classic fairy tale manor.',
  '/images/disney/cinderella/page-2.webp':
    'A golden envelope with a royal seal being opened. A sparkling palace visible through a window in the distance.',
  '/images/disney/cinderella/page-3.webp':
    'The stepsisters leaving in a fancy carriage while Cinderella watches sadly from a window. Night sky, stars.',
  '/images/disney/cinderella/page-4.webp':
    'A beautiful fairy godmother appearing in a burst of sparkles and light. Magic wand, kind smile, glowing.',
  '/images/disney/cinderella/page-5.webp':
    'A large orange pumpkin magically transforming into a golden ornate coach. Sparkles, magic swirls, mice watching.',
  '/images/disney/cinderella/page-6.webp':
    'Cinderella in a stunning blue ball gown with sparkling glass slippers. Magical transformation moment, sparkles.',
  '/images/disney/cinderella/page-7.webp':
    'A prince and Cinderella dancing together in a grand ballroom. Chandeliers, golden light, other guests watching.',
  '/images/disney/cinderella/page-8.webp':
    'Cinderella running down palace steps at midnight, a clock tower showing 12. One glass slipper left on the steps.',
  '/images/disney/cinderella/page-9.webp':
    'A prince kneeling, fitting a glass slipper onto Cinderella\'s foot. Perfect fit, both smiling. Hopeful scene.',
  '/images/disney/cinderella/page-10.webp':
    'Cinderella and the Prince in a wedding scene at the palace. Fireworks, celebration, happily ever after.',
};

const snowWhite = {
  '/images/disney/snow-white/page-1.webp':
    'A beautiful princess with black hair and a blue-and-yellow dress in a castle garden. Birds and deer around her.',
  '/images/disney/snow-white/page-2.webp':
    'An evil queen in a dark crown standing before a glowing ornate magic mirror on a wall. Dark castle interior.',
  '/images/disney/snow-white/page-3.webp':
    'A frightened girl running through a dark scary forest. Gnarled trees, shadows, but golden light ahead.',
  '/images/disney/snow-white/page-4.webp':
    'A tiny adorable cottage in a forest clearing. Tiny door, tiny windows, flower boxes. Charming and miniature.',
  '/images/disney/snow-white/page-5.webp':
    'Seven small cheerful dwarfs marching home from a sparkling diamond mine, carrying picks and lanterns. Singing.',
  '/images/disney/snow-white/page-6.webp':
    'An old woman in a dark cloak offering a shiny red apple. Sinister but cartoonish. Forest cottage doorstep.',
  '/images/disney/snow-white/page-7.webp':
    'Snow White asleep on a bed of flowers, the seven dwarfs crying around her. Soft, sad, gentle light.',
  '/images/disney/snow-white/page-8.webp':
    'A brave prince on a white horse riding through a dark enchanted forest toward a glowing cottage.',
  '/images/disney/snow-white/page-9.webp':
    'A prince leaning over sleeping Snow White, a magical golden glow as she wakes up. Spell breaking, joyful.',
  '/images/disney/snow-white/page-10.webp':
    'Snow White and the Prince riding away on a white horse. The seven dwarfs waving. Castle on a hill, rainbow.',
};

const winnieThePooh = {
  '/images/disney/pooh/page-1.webp':
    'A small yellow bear in a red shirt waking up and stretching in a cosy treehouse bedroom. Hundred Acre Wood.',
  '/images/disney/pooh/page-2.webp':
    'A sad yellow bear looking into an empty honey pot, turning it upside down. Not a single drop. Treehouse.',
  '/images/disney/pooh/page-3.webp':
    'A small yellow bear visiting a very tiny pink piglet outside a tiny house with a "TRESPASSERS WILL" sign.',
  '/images/disney/pooh/page-4.webp':
    'A bouncy orange tiger with black stripes bouncing in energetically. Spring-loaded tail, huge grin. Forest path.',
  '/images/disney/pooh/page-5.webp':
    'A yellow bear, pink piglet, and tiger looking up at a tall tree buzzing with bees. Honey dripping.',
  '/images/disney/pooh/page-6.webp':
    'A yellow bear falling from a tree into a mud puddle, bees chasing him. Splashy, funny, cartoonish.',
  '/images/disney/pooh/page-7.webp':
    'A fussy orange rabbit opening his door to friends. His house is neat and tidy with lots of honey jars.',
  '/images/disney/pooh/page-8.webp':
    'A round yellow bear stuck in a rabbit\'s round front door, legs dangling outside. Comically stuck. Honey on face.',
  '/images/disney/pooh/page-9.webp':
    'All the animals pulling the bear out of the door — POP! The bear flying through the air. Dramatic, funny.',
  '/images/disney/pooh/page-10.webp':
    'All the Hundred Acre Wood friends sitting together sharing honey from a big pot. Warm sunset, friendship.',
};

const captainHook = {
  '/images/disney/captain-hook/page-1.webp':
    'A dramatic pirate ship with black sails sailing through turquoise Neverland waters. Skull flag, dramatic clouds.',
  '/images/disney/captain-hook/page-2.webp':
    'A theatrical pirate captain with a big hat, red coat, and a hook for a hand. Dramatic pose on his ship.',
  '/images/disney/captain-hook/page-3.webp':
    'A green crocodile in the water with a clock visible in its belly — tick tock. The captain hiding in terror.',
  '/images/disney/captain-hook/page-4.webp':
    'A boy in green flying over a pirate ship, casting a shadow. Mischievous grin, fairy dust trail. Neverland sky.',
  '/images/disney/captain-hook/page-5.webp':
    'A pirate captain excitedly unrolling an old treasure map with an X marked on Skull Island. Treasure gleam.',
  '/images/disney/captain-hook/page-6.webp':
    'A boy in green and a pirate captain having a dramatic sword fight on the deck of a ship. Action-packed.',
  '/images/disney/captain-hook/page-7.webp':
    'Children walking a plank on a pirate ship over sparkling water. A flying boy secretly hovering above, ready to save them.',
  '/images/disney/captain-hook/page-8.webp':
    'A pirate captain falling off his ship into the water. A crocodile waiting with an open mouth. Comedic.',
  '/images/disney/captain-hook/page-9.webp':
    'A pirate captain running across the water being chased by a clock-ticking crocodile. Comedic chase scene.',
  '/images/disney/captain-hook/page-10.webp':
    'A boy in green and his friends celebrating on the pirate ship. Flying, laughing, Neverland sunset.',
};

// ── Combine all prompts ──

const ALL_PROMPTS = {
  ...sectionHeroes,
  ...tortoiseHare,
  ...lionMouse,
  ...boyCriedWolf,
  ...antGrasshopper,
  ...foxGrapes,
  ...townCountryMouse,
  ...feelingsMonster,
  ...whenIFeelBig,
  ...feelingsFriends,
  ...cinderella,
  ...snowWhite,
  ...winnieThePooh,
  ...captainHook,
};

/**
 * Get the full generation prompt for an image path.
 * @param {string} imagePath — path relative to /arthurs-world/ e.g. '/images/sections/games.webp'
 * @returns {{ prompt: string, size: string } | null}
 */
export function getImagePrompt(imagePath) {
  // Strip the base path prefix if present
  const key = imagePath.replace(/^\/arthurs-world/, '');
  const desc = ALL_PROMPTS[key];
  if (!desc) return null;

  const isSection = key.startsWith('/images/sections/');
  const isCard = key.startsWith('/images/cards/');

  const style = isCard ? CARD_STYLE : STYLE_PREFIX;
  const size = isSection ? '1536x1024' : '1024x1024';

  return {
    prompt: `${style} ${desc}`,
    size,
  };
}

/**
 * Check if a prompt exists for a given image path.
 */
export function hasPrompt(imagePath) {
  const key = imagePath.replace(/^\/arthurs-world/, '');
  return key in ALL_PROMPTS;
}

export default ALL_PROMPTS;
