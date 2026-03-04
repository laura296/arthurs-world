#!/usr/bin/env node
/**
 * Generate storybook page illustrations using OpenAI DALL-E 3 API.
 *
 * Usage:
 *   node scripts/generate-illustrations.mjs
 *
 * Environment:
 *   OPENAI_API_KEY — your OpenAI API key (required)
 *
 * Two art styles:
 *   - Fairy tales  → bright cartoon watercolour
 *   - Kipling      → pen-and-ink inspired by Kipling's original illustrations
 *
 * This script generates a landscape PNG illustration for every page of
 * every story and saves them in public/images/{storyId}/page-{n}.png
 */

import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PUBLIC_IMAGES = join(ROOT, 'public', 'images');

// ─── Style prefixes ─────────────────────────────────────────────

// Axel Scheffler / Julia Donaldson style — bold, chunky, consistent
const STYLE_CARTOON = `Children's picture book illustration in the style of Axel Scheffler (illustrator of The Gruffalo). STRICT VISUAL RULES: Thick black ink outlines (3-4px weight) around every shape. Flat gouache colour fills — no gradients within shapes, no airbrush. Colours are bright and saturated: grass green (#4CAF50), sky blue (#64B5F6), warm yellow (#FFD54F), rosy pink (#F48FB1), brown (#8D6E63), red (#EF5350). Characters have large round eyes with black pupils and white highlights, small dot noses, rosy cheek circles. Proportions are chunky and slightly squat — big heads (1/3 of body height), short limbs, rounded bodies. Backgrounds are layered planes: sky at top, hills in middle, ground at bottom, with simple textured brushstrokes visible. Trees are rounded blobs on brown trunks. Grass is short green dashes. The overall feel is warm, friendly, hand-painted. Consistent thick outlines on EVERYTHING. No text. No UI elements. Landscape format 16:9.`;

// Kipling ink drawings with warm watercolour washes
const STYLE_KIPLING = `Children's book illustration: black Indian ink line drawing on cream-coloured paper, with soft transparent watercolour washes added. STRICT VISUAL RULES: All outlines and details drawn in black ink with visible pen strokes and crosshatching for shadows. Watercolour washes are transparent and loose — warm sepia (#D4A574), burnt sienna (#A0522D), ochre yellow (#C8A951), dusty sage green (#8FBC8F), and soft sky blue (#87CEEB). The paper texture shows through the washes. Ink lines are confident and slightly scratchy, like a steel nib dip pen. Animals are drawn naturalistically but with slightly exaggerated expressive eyes and poses. Backgrounds have loose wash landscapes with ink detail only on key elements. Thin decorative ink border around the edges with small leaf/vine motifs. The overall feel is classic, warm, handcrafted — like a Victorian naturalist's sketchbook coloured in. No text. Landscape format 16:9.`;

// ─── Style mapping ───────────────────────────────────────────────

const KIPLING_STORIES = new Set([
  'whale-throat', 'camel-hump', 'rhino-skin', 'leopard-spots',
  'elephant-child', 'old-man-kangaroo', 'armadillos', 'first-letter',
  'alphabet-made', 'crab-sea', 'cat-walked', 'butterfly-stamped',
]);

function getStyle(storyId) {
  return KIPLING_STORIES.has(storyId) ? STYLE_KIPLING : STYLE_CARTOON;
}

// ─── Per-story character descriptions ────────────────────────────

const CHARACTER_BLOCKS = {
  // ── Fairy Tales ──
  'three-pigs': `Three small pink pigs with curly tails and rosy cheeks, wearing colourful waistcoats (red, blue, green). The wolf is grey with sharp ears, bushy tail, wearing a tattered brown coat, looking mischievous not scary.`,

  'goldilocks': `Goldilocks is a small girl with bouncy golden curly hair, wearing a blue dress with white apron. Papa Bear is large and brown, Mama Bear is medium and lighter brown, Baby Bear is small and golden-brown. All bears wear clothes and stand upright. Their cottage is cozy with a thatched roof.`,

  'red-riding': `Little Red Riding Hood is a small girl with brown hair, wearing a bright red hooded cape and blue dress, carrying a wicker basket. The wolf is grey with pointy ears and a long snout, mischievous expression. Grandma has white hair, glasses, and a shawl. The woodcutter is a friendly man with a brown hat and vest.`,

  // ── Kipling Just So Stories ──
  'whale-throat': `A massive blue whale with a cavernous mouth, small friendly eyes, and barnacles on his skin. A tiny clever silver fish with a knowing expression. A small bearded man in a ragged tunic sitting on a wooden raft with a single sail. The sea is deep blue-green.`,

  'camel-hump': `A tall camel with a grumpy expression and droopy eyelids, sandy-coloured with long lashes. A sturdy brown horse wearing a harness. A shaggy brown dog. A strong grey ox. A magical genie made of swirling desert sand and smoke, with wise ancient eyes.`,

  'rhino-skin': `A large rhinoceros with initially smooth, tight-fitting grey skin (later wrinkly and baggy). A small dark-haired man wearing a tall hat and long coat, living on a tropical island. Palm trees and blue sea in the background.`,

  'leopard-spots': `A leopard — initially plain sandy-yellow all over, later covered in beautiful dark rosette spots. An Ethiopian hunter, tall and dark-skinned, wearing simple cloth wraps. A wise old baboon sitting in a tree. Giraffes and zebras in the distance.`,

  'elephant-child': `A small baby elephant with an initially short stubby nose (later stretched into a long trunk). A large green crocodile with a wide toothy grin lurking in a grey-green river. A round hippo aunt. Lush African riverside with reeds and papyrus.`,

  'old-man-kangaroo': `A kangaroo — initially with four equal-length legs, later with huge powerful hind legs and small forelegs. A tall imposing figure representing the god Nqong. A lean yellow dingo dog with sharp ears. Australian outback landscape.`,

  'armadillos': `A small round hedgehog with brown spines. A green tortoise with a patterned shell. A large spotted jaguar with golden fur and black rosettes. Later, an armadillo — small armoured creature with banded shell. South American jungle setting.`,

  'first-letter': `A small prehistoric girl called Taffy with tangled dark hair, wearing animal skins, about 8 years old. Her father Doris is a tall bearded man in furs carrying a fishing spear. Her mother is a kind woman tending a cave home. Prehistoric river landscape with birch trees.`,

  'alphabet-made': `The same small prehistoric girl Taffy with tangled dark hair in animal skins, sitting with her father by a fire. They scratch letters on birch bark and flat stones. Simple prehistoric dwelling with furs and pottery nearby.`,

  'crab-sea': `A huge ancient crab, initially enormous and later magically shrunk to tiny size. The Eldest Magician, a tall robed figure with a long beard and staff, surrounded by starlight. A small girl called Doris. The primordial sea with waves and coral.`,

  'cat-walked': `A sleek grey cat with green eyes and an independent proud expression. A prehistoric Woman tending a cave fire with a baby. A loyal brown dog. A strong brown horse. A gentle white-and-brown cow. The setting is a warm cave home with firelight.`,

  'butterfly-stamped': `A beautiful ornate butterfly with iridescent blue and gold wings. His smaller wife butterfly. King Solomon, a regal bearded king wearing robes and a crown, sitting on an elaborate golden throne. An oriental palace with domes and minarets.`,
};

// ─── Per-page scene descriptions ─────────────────────────────────

const SCENES = {
  // ══════════════════════════════════════════════════════════════
  // FAIRY TALES (cartoon style)
  // ══════════════════════════════════════════════════════════════

  'three-pigs': [
    'Three small pink pigs walking along a winding path through a sunny meadow with rolling green hills, blue sky with fluffy clouds, wildflowers and butterflies. They carry small bundles on sticks, looking excited and adventurous.',
    'The first little pig happily building a small straw house in a sunny field. Straw bundles everywhere, the house looks wonky and charming. Bright warm sunshine.',
    'The second little pig in a forest clearing, hammering sticks together to build a wooden house. Wood shavings on the ground, a robin perched on the half-built roof.',
    'The third little pig carefully laying red bricks to build a sturdy house with a chimney. A garden with flowers starting to grow. Hard hat on the pig. Neat and solid construction.',
    'A big grey wolf lurking at the edge of a dark forest, moonlight filtering through twisted trees. The wolf has a goofy grin and his tongue is hanging out. Atmospheric but comical, not scary.',
    'The wolf with hugely puffed-out cheeks blowing at the straw house. Straw flying everywhere in swirls. One small pig running away with big scared eyes. Wind lines in the air. Comical and dramatic.',
    'The wolf with even more puffed-out cheeks and bulging eyes blowing at the stick house. Sticks and planks flying everywhere. Two small pigs running away together. The wolf looks ridiculous with effort.',
    'A solid red brick house with three small pink pigs peeking out of the windows with cheeky grins. The grey wolf stands outside looking frustrated with arms crossed. Chimney smoke, flower boxes in windows, warm and cozy.',
    'The exhausted wolf huffing and puffing at the brick house but it won\'t budge. The wolf looks dizzy with stars circling his head, red-faced and sweating. The brick house stands perfectly solid. Very comical.',
    'Three happy pigs dancing and celebrating outside their brick house on a beautiful sunny day. Rainbow in the sky, hearts and confetti floating. Flowers in full bloom. The tiny wolf walks away defeated in the far background.',
  ],

  'goldilocks': [
    'A small girl with golden curly hair walking through a sunlit enchanted forest. Dappled light, wildflowers, butterflies fluttering around her. She looks curious and happy.',
    'Goldilocks discovering a charming thatched-roof cottage in a forest clearing. The cottage has a red door, flower boxes, and a winding stone path. She looks surprised and delighted.',
    'Three bowls of porridge on a rustic wooden table in a cozy cottage kitchen. Big bowl, medium bowl, and small bowl. Steam rising from them. Warm morning light through the window.',
    'Goldilocks sitting at the table happily eating from the smallest bowl with a wooden spoon. The big and medium bowls are pushed aside. She looks content and satisfied.',
    'Three chairs of different sizes in a cozy cottage living room by a brick fireplace. A huge armchair, a medium rocking chair, and a tiny wooden chair. Warm rug on the floor.',
    'Goldilocks looking surprised as the tiny chair breaks underneath her. Splinters and chair legs flying. Stars and exclamation marks around her head. Funny and dramatic.',
    'Three beds of different sizes in a cozy bedroom upstairs. A huge four-poster bed, a medium bed with quilts, and a tiny bed with a teddy bear on it. Moonlight through curtains.',
    'Goldilocks sleeping peacefully in the smallest bed, curled up under a patchwork quilt. Zzz letters floating above. Moonlight and stars through the window. Peaceful and dreamy.',
    'Three surprised bears standing in their kitchen doorway. Papa Bear is big and looking at his empty bowl, Mama Bear points at the broken chair, Baby Bear has tears looking at his bed. They wear clothes and stand upright.',
    'Goldilocks running through the forest back home, her golden curls bouncing. The three bears wave from their cottage doorstep, looking relieved rather than angry. Sunny day, flowers everywhere.',
  ],

  'red-riding': [
    'A small girl in a bright red hooded cape standing in a sunny flower-filled meadow outside a cozy cottage. She looks cheerful and sweet. Warm golden sunshine, daisies and poppies.',
    'A mother at a cottage door handing a wicker basket covered with a cloth to the girl in the red hood. The basket has bread and fruit peeking out. Warm and loving scene.',
    'Little Red Riding Hood skipping happily along a winding path through a beautiful sunlit forest. Birds singing in the trees, squirrels watching from branches, wildflowers along the path.',
    'Little Red Riding Hood meeting the grey wolf on the forest path. The wolf stands upright wearing a waistcoat, trying to look friendly with a big grin. She talks to him innocently. Forest clearing with sunbeams.',
    'The grey wolf running sneakily through the forest, leaving footprints behind. He has a mischievous scheming expression, tongue out. Trees blur with his speed. Dynamic and funny.',
    'The wolf at Grandma\'s cottage door, knocking politely. The cottage is quaint with climbing roses and a welcome mat. Grandma peeks through the curtain inside. Afternoon light.',
    'The wolf sitting up in Grandma\'s bed wearing a frilly nightcap and round glasses, looking absolutely ridiculous under a patchwork quilt. The bedroom is cozy with doilies and photos on the wall.',
    'Little Red Riding Hood standing by the bed looking at the wolf in disguise. The wolf has comically big eyes and ears visible under the nightcap. She looks curious. Classic bedroom scene.',
    'A friendly woodcutter arriving at the cottage door, the wolf running away scared with his tail between his legs. Grandma safe in the corner. Dynamic action scene, sunshine streaming in.',
    'Little Red Riding Hood, Grandma, and the woodcutter having a cozy tea party at a table outside the cottage. Cakes, teapot, flowers. Everyone smiling and happy. Beautiful sunny afternoon.',
  ],

  // ══════════════════════════════════════════════════════════════
  // KIPLING JUST SO STORIES (pen-and-ink style)
  // ══════════════════════════════════════════════════════════════

  'whale-throat': [
    'A vast deep blue ocean stretching to the horizon. An enormous whale swimming through the water with his mouth wide open, swallowing schools of fish. Sunlight filtering through the waves above. Coral and seaweed below.',
    'The whale gobbling up fish frantically, mouth wide, water splashing. Fish scattering in all directions. The whale looks greedy and happy. Bubbles rising everywhere. The sea is teeming with life being devoured.',
    'A single tiny silver fish swimming alone in an empty ocean. The fish looks clever and determined with a knowing glint in its eye. The rest of the sea is eerily empty. Shafts of light from the surface.',
    'The tiny clever fish swimming next to the whale\'s enormous head, whispering into his ear. In the far distance, a small man sits on a wooden raft with a tiny sail. The fish points with a fin towards the raft.',
    'The whale swimming at speed through the ocean towards a small wooden raft. Enormous wake and waves behind the whale. The man on the raft looks tiny. Dramatic sense of scale. Spray and foam.',
    'The whale\'s enormous mouth wide open, the small man tumbling inside. The interior of the whale\'s mouth is like a cavern — pink, ribbed, enormous. The man looks startled but determined. Fish bones scattered around.',
    'Inside the whale\'s belly — the man is building a wooden criss-cross grating from driftwood and his raft pieces. He hammers and ties with rope. The interior is dark and cavernous with a warm glow from a small lantern.',
    'The whale from outside, looking distressed with bulging eyes and puffed cheeks. He coughs and splutters, water spraying from his blowhole. The grating is visible wedged in his throat. Waves crash around him.',
    'The man sailing away triumphantly on his rebuilt raft, waving goodbye. The whale watches sadly from a distance, unable to open his mouth wide. Beautiful sunset over the ocean, golden sky reflected in calm water.',
    'The whale swimming peacefully in the ocean, mouth slightly open but with the grating visible, only tiny krill and small fish able to pass through. Other sea creatures swim nearby safely. Calm, beautiful underwater scene.',
  ],

  'camel-hump': [
    'A vast sandy desert landscape with rolling golden dunes under a bright sun. A tall camel stands in the middle looking bored and grumpy, eyes half-closed, completely idle. Heat haze shimmers. A lone palm tree in the distance.',
    'A strong brown horse pulling a heavy wooden plough through a field next to the desert edge. The horse approaches the lazy camel and asks for help. The camel has his nose in the air with a dismissive expression.',
    'A panting shaggy dog carrying a stick in his mouth, fetching things for the humans. The dog looks at the camel pleadingly. The camel turns away with his eyes closed, lips pursed in a "humph" expression.',
    'A muscular grey ox pulling a heavy cart loaded with goods. The ox looks exhausted and sweaty. The camel stands nearby completely unbothered, yawning. Harsh midday sun beating down.',
    'The horse, dog, and ox gathered together looking tired and frustrated, with double loads of work around them. They glare at the lazy camel in the background who lounges under a palm tree. Sunset colours.',
    'A swirling column of magical golden desert sand forming into a genie figure. The genie has wise ancient eyes and flowing robes made of sand. Stars and sparkles surround him. The desert glows with magic. Dramatic and mystical.',
    'The genie floating before the camel, arms crossed, looking stern but fair. The camel sits stubbornly on the sand, mouth open saying "humph." Magic sparkles crackle between the genie\'s fingers. Tense moment.',
    'A dramatic magical moment — golden light swirling around the camel as a large hump grows on his back! The camel looks shocked, the genie waves his hands. Sand and magic particles spiral upward. Dynamic energy.',
    'The camel now with his large hump, walking across the desert carrying supplies. He looks determined and able. The horse, dog, and ox watch approvingly from the field\'s edge. Long shadows in late afternoon light.',
    'All four animals together — horse, dog, ox, and the humped camel — working side by side in a golden landscape. Everyone looks content. The desert stretches behind the camel, green fields before the others. Harmonious.',
  ],

  'rhino-skin': [
    'A small tropical island with palm trees, white sandy beach, and turquoise sea. A small man in a tall hat and long coat stands outside a tiny stone oven, baking a large magnificent cake. Smoke curls from the oven. Colourful tropical flowers.',
    'A huge rhinoceros approaching the island from the sea. His skin is perfectly smooth, tight, and shiny like polished leather — no wrinkles at all. He looks sleek and proud. Three buttons visible on his belly where the skin fastens.',
    'The rhinoceros greedily eating the entire beautiful cake in one go! Crumbs flying, frosting on his nose. The man stands behind a palm tree looking horrified with his hands on his cheeks. The empty cake plate sits on the ground.',
    'The man standing on the beach, fists clenched, looking furiously at the empty plate where his cake was. The rhinoceros waddles away in the background looking smug and satisfied. Sun setting, dramatic sky.',
    'A blazing hot day — the sun beats down fiercely. The rhinoceros stands at the edge of the sea, unbuttoning his smooth skin and stepping out of it like taking off a suit. He leaves it folded on the beach and wades into the cool water.',
    'The man sneaking across the beach towards the rhinoceros\'s folded skin. He carries a bucket of old dry cake crumbs with a mischievous grin. The rhino splashes happily in the water in the background, unaware.',
    'The man vigorously rubbing and filling the inside of the rhinoceros skin with cake crumbs, stale currants, and burned raisins. Crumbs fly everywhere. He looks delighted with his revenge. Close-up detail of the crumby skin.',
    'The rhinoceros trying to put his skin back on, looking uncomfortable. His skin is lumpy and ill-fitting. He winces and scratches. Crumbs fall out of the edges. He looks confused and itchy.',
    'The rhinoceros desperately rubbing against a palm tree, scratching and rolling on the ground. His once-smooth skin is stretching into deep wrinkles and folds. Sand and crumbs everywhere. He looks miserable. Very detailed wrinkles forming.',
    'The rhinoceros with his now permanently wrinkly, baggy, folded grey skin, standing on the beach looking resigned. The man waves cheekily from his island hut in the background. Beautiful tropical sunset. Detailed texture on the rhino\'s new wrinkly skin.',
  ],

  'leopard-spots': [
    'A vast sandy African plain under a blazing sun. A large leopard lies on a rock, his coat entirely plain sandy-yellow — blending perfectly with the yellow-brown landscape. Dried grass, scattered acacia trees, heat haze.',
    'The sandy-yellow leopard and his tall Ethiopian friend crouching together behind a rock, hunting. Zebras and giraffes graze in the grassland ahead. Both hunters are the same sandy colour as the landscape. African savanna.',
    'A dark, dense African forest with thick canopy. Shafts of light create stripy, spotty patterns of shadow on the forest floor. The outlines of giraffes and zebras are barely visible, perfectly camouflaged in the dappled shadows.',
    'The plain sandy-yellow leopard standing at the edge of the dark forest, squinting and confused. He cannot see any animals at all. The forest is full of shadow patterns. Leaves and branches create complex patterns of light and dark.',
    'A wise old baboon sitting in a tree branch, pointing and gesturing to the Ethiopian hunter and the leopard below. Magical light glows around the baboon. The Ethiopian is beginning to change, his skin becoming rich dark brown.',
    'The Ethiopian, now with beautiful dark brown skin, kneeling next to the leopard and dipping his fingertips in a pot of dark paint. The leopard looks up expectantly. Forest edge with dappled light. The contrast between the plain leopard and dark forest is clear.',
    'Close-up of the Ethiopian pressing his five fingertips onto the leopard\'s coat, leaving perfect dark rosette spots. Multiple handprints becoming spots all over the leopard\'s body. Dark paint pot nearby. Beautiful detail of the spot pattern forming.',
    'The leopard now covered in beautiful dark rosette spots, looking at his reflection in a forest pool with delight. His spots match the dappled forest shadows perfectly. The Ethiopian stands behind him smiling proudly. Magical reflections in the water.',
    'The newly-spotted leopard crouching in the dappled forest, perfectly camouflaged among the shadows. Nearby animals don\'t notice him. His spots blend with the light-and-shadow patterns. Masterful camouflage scene.',
    'The beautiful spotted leopard and the dark-skinned Ethiopian walking together through the forest, content and proud. Dappled sunlight falls on them both. Animals peek from behind trees. Peaceful, golden light. The end of a journey.',
  ],

  'elephant-child': [
    'A small baby elephant with a short stubby nose (no trunk — just a round bulgy nose like a boot) standing in an African grassland. Other elephants nearby also have short noses. The baby elephant has big curious eyes, head tilted questioningly.',
    'The curious baby elephant asking questions to different animals — a tall giraffe, a large hippo, a colourful bird. Each animal turns away or covers their ears. The baby elephant looks eager with his short nose raised. Speech-like gestures.',
    'A wide African river landscape with papyrus reeds and water lilies. A large round hippo stands in shallow water pointing downstream with her foot. The small elephant walks away determinedly along the riverbank on his adventure.',
    'The baby elephant standing at the edge of a great grey-green river. A large crocodile is half-submerged with just eyes and snout visible above the waterline. The crocodile grins showing teeth. Reeds and river mud. Tense atmosphere.',
    'The crocodile\'s head close to the elephant\'s face, whispering. The crocodile has a sly expression. The innocent elephant leans in trustingly, his short nose very close to the crocodile\'s jaws. Water lily pads, dragonflies.',
    'Dramatic action scene — the crocodile has clamped onto the elephant\'s nose and is pulling! The elephant braces his legs and leans backwards. Water splashes everywhere. The nose is beginning to stretch. Reeds bend in the struggle.',
    'The elephant pulling backwards with all his might, legs digging into the mud. His nose has stretched to a ridiculous length between him and the crocodile in the water. Mud sprays, water splashes. Comic and dramatic tension.',
    'The elephant sitting back on the riverbank, free from the crocodile. His nose is now enormously long and droopy, hanging down like a trunk. He looks at it cross-eyed with surprise. The crocodile slinks away underwater. Funny and touching.',
    'The elephant happily using his wonderful new long trunk — spraying water like a shower, picking fruit from a high tree, and swatting a fly. Multiple vignettes of trunk activities. He looks delighted. Lush African landscape.',
    'The elephant walking proudly back to his family, showing off his trunk. Other elephants gather around admiringly. Baby elephant sprays water joyfully. Beautiful African sunset, acacia trees silhouetted, warm golden light.',
  ],

  'old-man-kangaroo': [
    'An ancient Australian landscape. A kangaroo with four equal-length legs walks awkwardly on all fours, looking just like any other four-legged animal. Eucalyptus trees, red earth, other animals grazing. Flat, unremarkable.',
    'The kangaroo standing proudly on a rock, puffing out his chest with a vain expression. Other animals — wombat, emu, platypus — look unimpressed below. Bright Australian bushland. The kangaroo strikes a showy pose.',
    'A majestic elevated rocky outcrop with an imposing seated figure representing the god Nqong — ancient, wise, surrounded by clouds and starlight. The small kangaroo stands below looking up pleadingly. Dramatic scale and lighting.',
    'Nqong pointing dramatically from his rock at a lean yellow dingo dog who perks up his ears excitedly. The kangaroo suddenly looks worried. The Australian outback stretches behind them. Dust motes in golden light. Dynamic tension.',
    'The dingo chasing the kangaroo across flat red sandy desert! Both running at full speed, kicking up red dust clouds. The kangaroo runs on all fours. Long afternoon shadows. Sense of speed and motion. Vast empty landscape.',
    'The chase through tall golden grassland. The kangaroo is now trying to hop to go faster, back legs pushing harder. The dingo bounds behind, tongue out. Grass bends and parts around them. Dynamic motion lines.',
    'Rocky mountain terrain — the kangaroo leaps across boulders with increasingly powerful back legs, which are visibly growing larger. The dingo scrambles behind. Dramatic cliff edges, wide Australian vista below.',
    'The kangaroo standing still, panting. His back legs are now enormous and powerful, his front legs small. The exhausted dingo lies flat on the ground far behind. The kangaroo looks down at his transformed body with astonishment.',
    'The kangaroo bouncing joyously across the Australian outback in huge magnificent leaps! His powerful legs launch him high above the treetops. A joey peeks from a pouch. Blue sky, eucalyptus trees, red earth below.',
    'Sunset over the Australian outback. The kangaroo sits contentedly on a hill, silhouetted against an orange sky. His powerful legs stretch before him. Other kangaroos hop in the background. Peaceful, beautiful, iconic.',
  ],

  'armadillos': [
    'A lush South American jungle setting. A small round hedgehog with brown spines sits next to a green tortoise with a beautiful patterned shell. They look at each other fondly. Tropical flowers, vines, bright parrots. Warm and friendly.',
    'A large spotted jaguar creeping through the jungle undergrowth, eyes gleaming hungrily. His spotted coat gleams. In the foreground, the hedgehog and tortoise notice him and look alarmed. Dramatic jungle shadows. Tense.',
    'The hedgehog rolled into a perfect tight spiky ball on the jungle floor. The jaguar reaches out a paw but pulls it back with a pained expression, a spine stuck in his pad. Stars of pain around the paw. Comic and dynamic.',
    'The tortoise withdrawn completely inside her shell on the ground. The jaguar bites and gnaws at the shell but his teeth slide off. He looks frustrated and confused. Hard shell gleams, impenetrable. Jungle floor detail.',
    'An older, wiser mother jaguar sitting on a tree branch above, lecturing the young jaguar below. She uses her paws to gesture: "ball shape = hedgehog, shell shape = tortoise." Teaching moment. Dappled jungle light.',
    'Split scene — on one side the hedgehog is learning to swim in a jungle pool like the tortoise, on the other side the tortoise is practicing curling up into a ball like the hedgehog. Both look determined. Funny and endearing.',
    'The confused jaguar looking back and forth between two creatures that look identical — both can curl up AND have hard shells. Question marks float above the jaguar\'s head. The two creatures look smugly at each other. Comic confusion.',
    'A magical transformation scene — swirling jungle magic as the hedgehog and tortoise merge into a new creature: an armadillo! Sparkles and leaf swirls surround the transformation. The new armadillo emerges looking surprised but pleased.',
    'The proud armadillo demonstrating both abilities — curled into a perfect armoured ball that the jaguar cannot bite, scratch, or open. The frustrated jaguar walks away defeated. The armadillo\'s banded shell gleams. Triumphant.',
    'The armadillo walking confidently through the jungle. Behind him, a line of baby armadillos follows. The jaguar watches from a distant tree, defeated. Beautiful jungle sunset with parrots and butterflies. Happy ending.',
  ],

  'first-letter': [
    'A prehistoric river scene. A small girl in animal skins sits on a rock next to her tall bearded father, both holding fishing spears. Clear river, birch trees, ferns. Smoke from a distant cave home. Peaceful Stone Age morning.',
    'Close-up of the father\'s fishing spear snapping in half as he tries to catch a fish. He looks dismayed, holding both broken pieces. The girl watches with concern. River water splashes. Stone Age detail in the tools.',
    'The clever girl finding a flat piece of birch bark on the ground. She picks it up excitedly, holding a sharp stone as a drawing tool. An idea lightbulb moment — her eyes light up. Forest floor with mushrooms and ferns.',
    'The girl scratching a picture on the bark with her sharp stone — a stick figure of her father, a broken spear, and an arrow pointing to their cave home. The drawing is childlike and charming. Close-up detail of the primitive picture-letter.',
    'A bewildered stranger in different tribal clothing standing on the path. The girl hands him the piece of bark, pointing urgently towards the village. The stranger scratches his head looking confused at the drawing.',
    'The stranger holding the bark picture upside down, looking at it with completely the wrong interpretation. His confused expression shows he thinks it\'s a warning or battle scene. Comic misunderstanding. Other travellers look on curiously.',
    'A whole crowd of villagers following the stranger back to the river, carrying weapons and looking alarmed. The man is waving the bark picture and shouting. Everyone is confused and marching in the wrong direction. Chaotic and funny.',
    'The mother arriving at the river, laughing at the enormous silly mix-up. The crowd of villagers look sheepish. The father stands with his broken spear. The girl shrugs with a "well, I tried" expression. Everyone is amused.',
    'The girl sitting by the fire in their cave, determinedly scratching new improved pictures on fresh bark. She has piles of bark around her with different attempts. Firelight glows on her concentrated face. The beginning of writing.',
    'The girl proudly showing her improved picture-writing to a group of fascinated children and adults. They point and nod with understanding. Dawn light streams into the cave. The very beginning of written communication.',
  ],

  'alphabet-made': [
    'Taffy and her father sitting together by a stream, the girl looking determined and excited. She gestures wildly with her hands. Birch bark and scratching stones are scattered around them. Warm morning light, prehistoric landscape.',
    'The girl and father facing each other excitedly. She cups her hands around her mouth to make sounds. He holds a piece of bark ready to draw. The air between them seems to vibrate with the excitement of their idea. Sunlit clearing.',
    'The girl opening her mouth very wide saying "AAAH!" Her father draws a wide-open mouth shape on bark — it looks like the letter A. The sound seems to come alive in the air. Dramatic moment of invention. Firelight.',
    'The girl pressing her lips together making a "buh buh" sound, puffing her cheeks. Her father draws two bumps together on bark — it looks like the letter B. Small puffs of air visible. Charming moment of discovery.',
    'The girl making an "sssss" sound with a snake-like wiggling gesture. Her father draws a wiggly line that looks like the letter S (and a snake). A real small snake watches curiously from nearby grass. Playful and clever.',
    'Both of them excited, surrounded by pieces of bark with different letter shapes scratched on them. The girl makes a round "O" mouth shape. Bark pieces with A, B, S, and now O are spread on the ground. Growing alphabet.',
    'A proud display of many bark pieces arranged in a row, each with a letter shape. The girl and father stand back admiringly looking at their creation. The letters are rough but recognisable. Prehistoric alphabet on display. Golden light.',
    'The girl carefully scratching T-A-F-F-Y onto a special piece of bark, her tongue poking out in concentration. Her father watches proudly. The completed name glows with importance. She holds it up triumphantly.',
    'A group of prehistoric children and adults sitting in a circle around Taffy as she teaches them the alphabet. She points to bark letters spread on the ground. Engaged faces, some children practising on their own bark. Community learning.',
    'A beautiful wide landscape shot — the sun rises over the prehistoric settlement. In the foreground, bark pieces with alphabet letters are arranged. Children everywhere are drawing and scratching letters. The dawn of literacy. Hopeful and golden.',
  ],

  'crab-sea': [
    'A vast primordial landscape being created — the Eldest Magician stands tall with his staff, directing swirling cosmic energy. The world is half-formed: mountains rise, rivers flow, seas fill. Stars and nebulae overhead. Epic creation scene.',
    'Various animals happily playing at being themselves in a new world — an elephant trumpets, a cow grazes, birds fly. Everything is fresh and new. Rolling green hills under a bright blue sky. Joyful and alive. Each animal in its element.',
    'A huge ancient crab wading into the primordial sea from a rocky shore. He clacks his enormous claws playfully. Water splashes around his massive shell. The sea is shallow and bright turquoise. Playful energy, waves beginning.',
    'The enormous crab walking deeper into the sea. As he enters, the water dramatically rises around him, flooding the shore. Trees and rocks become submerged. The crab looks happy and unaware. Dramatic rising water. Massive scale.',
    'The crab walking back out of the sea. The water level drops dramatically, revealing seabed, stranded fish, and shells. In-out rhythm of the water. The crab keeps playing. Rocky coastline and tidal pools form.',
    'The Eldest Magician on a cliff above the sea, looking annoyed and puzzled, scratching his beard. The water rises and falls chaotically below. His robes blow in the wind. He searches for the cause. Dramatic cliff edge.',
    'A small girl pointing down at the sea from the cliff edge, showing the Magician the enormous crab playing in the waves. The crab is clearly visible splashing. The girl is excited and helpful. Wide ocean vista.',
    'The Magician extending his staff over the crab, magic energy spiralling down. The crab shrinks dramatically in a burst of sparkles and swirling water, from enormous to tiny. Before-and-after scale contrast. Magical energy everywhere.',
    'A tiny crab on a beautiful beach with tidal pools, still making the water go in and out — but now only in miniature tidal pool scale. The tide gently comes in and out on the beach beyond. The crab is happy and small. Gentle waves.',
    'Wide view of a beautiful coastline at sunset. The tide comes in gently. If you look very closely, a tiny crab can be seen at the water\'s edge, still playing. Moon rising over the sea, affecting the tides. Peaceful and eternal.',
  ],

  'cat-walked': [
    'A wild primordial landscape under moonlight. Various wild animals lurk in the shadows — wild dog, wild horse, wild cow. In the centre, a sleek grey cat sits proudly alone on a rock, tail curled, completely independent. Blue moonlight.',
    'A warm glowing cave mouth with a woman tending a fire inside. The cave is being made homely — animal skins on the floor, a baby in a cradle. Outside, the wild dog peers in from the darkness, attracted by the warmth and food smell.',
    'The dog sitting loyally by the cave fire, now wearing a simple collar. The woman pats him. A bone and a bowl of food sit nearby. The dog guards the cave entrance. Warm firelight contrasts with the dark wild world outside.',
    'A strong horse standing in a simple corral near the cave, munching sweet hay. The woman strokes his mane. The horse looks content and well-fed. A simple wooden fence and shelter. Morning light. Domestication scene.',
    'A gentle cow in a cozy shelter attached to the cave, being milked by the woman. A bucket of white milk. The cow looks content. Baby plays nearby. Warm, domestic, comfortable scene. Smoke from the cave fire.',
    'The cat sitting on a moonlit wall outside the cave, looking in at the warm domestic scene with the dog, horse, and cow — but staying firmly outside. His tail is high, expression proud and disdainful. "I don\'t need that." Independent spirit.',
    'The cat sneaking into the cave, drawn by the sound of a crying baby. The baby lies in a fur cradle. The cat approaches softly, beginning to purr. Gentle firelight. The woman watches from the shadows. Tender moment.',
    'The cat curled up next to the sleeping baby, purring. The baby smiles peacefully. The woman stands over them with a warm but firm expression, laying down the rules with her finger raised. Mice scurry in the corner. Firelit negotiation.',
    'Split scene — half shows the cat sitting proudly by the fire inside the cave, catching a mouse; the other half shows the same cat walking freely under the moonlight outside, tail high, completely wild again. Duality of cat nature.',
    'A beautiful twilight scene — the cat walks along a wall silhouetted against an orange and purple sky, heading out alone. Behind him, the warm cave glows with firelight where the dog, horse, cow, and baby sleep. The cat is forever between two worlds.',
  ],

  'butterfly-stamped': [
    'An opulent Eastern palace with golden domes and minarets. King Solomon sits on an elaborate throne in a beautiful garden, surrounded by animals of every kind — lions, birds, fish in fountains. He speaks to them all. Majestic and magical.',
    'A beautiful ornate butterfly with iridescent blue and gold wings perched on King Solomon\'s finger. Nearby, a smaller butterfly (his wife) watches. The butterfly puffs up proudly, showing off. Palace garden with roses and fountains.',
    'The butterfly hovering before his wife, wings spread wide, boasting dramatically. He gestures grandly at the palace behind him. His wife has a sceptical expression with crossed arms (legs). The palace gleams. Comic bravado.',
    'The wife butterfly laughing, nearly falling off her flower. She holds her sides. The boastful butterfly looks embarrassed, wilting slightly. Flower petals fall around them. Comedy and embarrassment in a garden setting.',
    'The worried butterfly flying quickly through palace corridors towards King Solomon\'s throne room. His wings droop with anxiety. Long ornate hallways with arches and mosaics. He looks small against the grand architecture.',
    'King Solomon leaning down kindly to listen to the tiny butterfly on his fingertip. The king has a warm wise smile. He whispers conspiratorially. Soft golden light, throne room with rich tapestries. A private kind moment.',
    'The dramatic climax — the tiny butterfly stamps his foot on a leaf! Simultaneously, King Solomon makes a hidden magical gesture and the entire palace shimmers, glows, and seems to shake! Magic sparkles everywhere. The wife butterfly gasps in the foreground.',
    'The wife butterfly swooning with amazement, eyes wide. The palace has stopped shimmering but sparkles still linger. The boastful butterfly looks relieved and pleased. King Solomon winks from his throne in the background. Magical aftermath.',
    'The butterfly sitting quietly on a flower next to his wife, wings folded humbly. Soft gentle scene — they are at peace. A heart shape formed by their wings together. The palace is calm. Lesson learned. Tender moment.',
    'King Solomon in his garden at sunset, the butterfly couple flying happily together above him. Other animals at peace around the garden. Golden evening light, the palace glowing. A world where even tiny creatures matter. Beautiful and serene.',
  ],
};

// ─── OpenAI DALL-E 3 API ─────────────────────────────────────────

const API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_URL = 'https://api.openai.com/v1/images/generations';

async function generateImage(prompt) {
  const res = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1792x1024',
      quality: 'hd',
      response_format: 'b64_json',
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API error (${res.status}): ${err}`);
  }

  const json = await res.json();
  return Buffer.from(json.data[0].b64_json, 'base64');
}

// ─── Main ────────────────────────────────────────────────────────

async function main() {
  if (!API_KEY) {
    console.error('❌ Set OPENAI_API_KEY environment variable first.');
    console.error('');
    console.error('  Get an API key at: https://platform.openai.com/api-keys');
    console.error('  Then run:');
    console.error('');
    console.error('    OPENAI_API_KEY=your_key_here node scripts/generate-illustrations.mjs');
    console.error('');
    process.exit(1);
  }

  const storyIds = Object.keys(SCENES);
  const totalPages = storyIds.reduce((sum, id) => sum + SCENES[id].length, 0);

  console.log('🎨 Generating storybook illustrations with DALL-E 3...');
  console.log(`   Size: 1792x1024 (landscape HD)`);
  console.log(`   Stories: ${storyIds.length} (${totalPages} pages total)`);
  console.log(`   Cartoon style: three-pigs, goldilocks, red-riding`);
  console.log(`   Kipling pen-and-ink style: ${[...KIPLING_STORIES].join(', ')}`);
  console.log('');

  let totalGenerated = 0;
  let totalSkipped = 0;

  for (const storyId of storyIds) {
    const scenes = SCENES[storyId];
    const dir = join(PUBLIC_IMAGES, storyId);
    await mkdir(dir, { recursive: true });

    const style = getStyle(storyId);
    const styleLabel = KIPLING_STORIES.has(storyId) ? 'pen-and-ink' : 'cartoon';
    console.log(`📖 ${storyId} (${scenes.length} pages, ${styleLabel} style)`);

    for (let i = 0; i < scenes.length; i++) {
      const filename = `page-${i + 1}.png`;
      const filepath = join(dir, filename);

      // Skip if already generated
      if (existsSync(filepath)) {
        console.log(`   ⏭️  page ${i + 1} — already exists, skipping`);
        totalSkipped++;
        continue;
      }

      // Assemble the full prompt: style + characters + scene
      const fullPrompt = `${style}\n\n${CHARACTER_BLOCKS[storyId]}\n\n${scenes[i]}`;
      console.log(`   🖌️  page ${i + 1} — "${scenes[i].slice(0, 60)}..."`);

      try {
        const image = await generateImage(fullPrompt);
        await writeFile(filepath, image);
        totalGenerated++;

        // 12-second delay to respect DALL-E 3 rate limits
        const isLast = (i === scenes.length - 1) && (storyId === storyIds.at(-1));
        if (!isLast) {
          console.log(`   ⏳ waiting 12s (rate limit)...`);
          await new Promise(r => setTimeout(r, 12000));
        }
      } catch (err) {
        console.error(`   ❌ page ${i + 1} failed: ${err.message}`);
        // Wait even on failure to avoid rate limit issues
        await new Promise(r => setTimeout(r, 5000));
      }
    }

    console.log('');
  }

  console.log('✅ Done!');
  console.log(`   Generated: ${totalGenerated} files`);
  console.log(`   Skipped: ${totalSkipped} files (already existed)`);
  console.log(`   Location: public/images/`);
  console.log('');
  console.log('The illustrations will be automatically used by the StoryBook component.');
}

main();
