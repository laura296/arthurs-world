// ---------------------------------------------------------------------------
// Build-a-Scene -- sticker data for every scene
// Each scene: 6 hero + 24 standard + 6 secret = 36 stickers
// ---------------------------------------------------------------------------

/** Helper to reduce per-sticker verbosity */
const sticker = (id, label, tier, category, animateType, animateDuration, sound) => ({
  id,
  label,
  tier,
  category,
  animate: { type: animateType, duration: animateDuration },
  sound,
});

// ===== SCENES ==============================================================

export const SCENES = {
  // -----------------------------------------------------------------------
  // SPACE
  // -----------------------------------------------------------------------
  space: {
    id: 'space',
    label: 'Space',
    emoji: '\u{1F680}',
    bg: 'from-indigo-900 to-purple-950',
    bgImage: '/arthurs-world/images/scenes/space/bg.png',
    stickers: [
      // Hero (6)
      sticker('rocket',           'Rocket',                     'hero', 'vehicle',  'float',  '3s',   'whoosh'),
      sticker('astronaut',        'Astronaut',                  'hero', 'character','wobble', '3s',   'bleep'),
      sticker('alien',            'Alien (friendly)',            'hero', 'character','wobble', '2.5s', 'bleep'),
      sticker('ufo',              'UFO',                        'hero', 'vehicle',  'float',  '4s',   'whoosh'),
      sticker('space-dog',        'Space dog (Laika-style)',     'hero', 'animal',   'float',  '3s',   'bleep'),
      sticker('robot',            'Robot',                       'hero', 'character','wobble', '2.5s', 'bleep'),

      // Standard (24)
      sticker('earth',            'Earth',                       'standard', 'object',  'spin',  '8s',   'whoosh'),
      sticker('moon',             'Moon',                        'standard', 'object',  'float', '5s',   'whoosh'),
      sticker('saturn',           'Saturn',                      'standard', 'object',  'spin',  '10s',  'whoosh'),
      sticker('comet',            'Comet',                       'standard', 'object',  'float', '3s',   'whoosh'),
      sticker('shooting-star',    'Shooting star',               'standard', 'object',  'float', '2s',   'whoosh'),
      sticker('satellite',        'Satellite',                   'standard', 'object',  'float', '4s',   'bleep'),
      sticker('telescope',        'Telescope',                   'standard', 'object',  'wobble','3s',   'bleep'),
      sticker('meteor',           'Meteor',                      'standard', 'object',  'float', '2.5s', 'whoosh'),
      sticker('space-suit',       'Space suit (empty)',           'standard', 'object',  'float', '4s',   'bleep'),
      sticker('black-hole',       'Black hole',                  'standard', 'object',  'spin',  '6s',   'whoosh'),
      sticker('constellation',    'Constellation',               'standard', 'object',  'pulse', '4s',   'bleep'),
      sticker('space-station',    'Space station',               'standard', 'object',  'float', '5s',   'bleep'),
      sticker('sun',              'Sun (cartoon)',                'standard', 'object',  'pulse', '3s',   'whoosh'),
      sticker('nebula-cloud',     'Nebula cloud',                'standard', 'object',  'pulse', '5s',   'whoosh'),
      sticker('baby-alien',       'Baby alien',                  'standard', 'character','wobble','2.5s', 'bleep'),
      sticker('lunar-lander',     'Lunar lander',                'standard', 'vehicle', 'float', '4s',   'whoosh'),
      sticker('asteroid',         'Asteroid',                    'standard', 'object',  'spin',  '7s',   'whoosh'),
      sticker('galaxy-swirl',     'Galaxy swirl',                'standard', 'object',  'spin',  '10s',  'whoosh'),
      sticker('astronaut-helmet', 'Astronaut helmet',            'standard', 'object',  'float', '3s',   'bleep'),
      sticker('planet-with-face', 'Planet with face',            'standard', 'object',  'spin',  '8s',   'bleep'),
      sticker('toy-rocket',       'Rocket (small/toy)',           'standard', 'object',  'float', '2.5s', 'whoosh'),
      sticker('star-cluster',     'Star cluster',                'standard', 'object',  'pulse', '4s',   'bleep'),
      sticker('spacewalk-astronaut','Spacewalk astronaut',       'standard', 'character','float', '4s',   'bleep'),
      sticker('mars',              'Mars',                        'standard', 'object',  'spin',  '9s',   'whoosh'),

      // Secret (6)
      sticker('space-cat-helmet',       'Space cat in a helmet',       'secret', 'animal',   'float',  '3s',   'bleep'),
      sticker('alien-riding-rocket',    'Alien riding a rocket',       'secret', 'character','float',  '3s',   'whoosh'),
      sticker('sleepy-planet',          'Planet with a sleepy face',   'secret', 'object',   'spin',   '8s',   'bleep'),
      sticker('astronaut-thumbs-up',    'Astronaut doing a thumbs up', 'secret', 'character','wobble', '2.5s', 'bleep'),
      sticker('robot-dancing',          'Robot dancing',               'secret', 'character','wobble', '2s',   'bleep'),
      sticker('ufo-disco',             'UFO with disco lights',        'secret', 'vehicle',  'float',  '3s',   'whoosh'),
    ],
  },

  // -----------------------------------------------------------------------
  // SEA
  // -----------------------------------------------------------------------
  sea: {
    id: 'sea',
    label: 'Sea',
    emoji: '\u{1F30A}',
    bg: 'from-cyan-700 to-blue-950',
    bgImage: '/arthurs-world/images/scenes/sea/bg.png',
    stickers: [
      // Hero (6)
      sticker('clownfish',    'Clownfish',        'hero', 'animal', 'swim',   '3s',   'bubble'),
      sticker('great-white',  'Great white shark', 'hero', 'animal', 'swim',   '4s',   'splash'),
      sticker('octopus',      'Octopus',           'hero', 'animal', 'swim',   '3.5s', 'bubble'),
      sticker('jellyfish',    'Jellyfish',         'hero', 'animal', 'float',  '4s',   'bubble'),
      sticker('seahorse',     'Seahorse',          'hero', 'animal', 'float',  '3s',   'bubble'),
      sticker('blue-whale',   'Blue whale',        'hero', 'animal', 'swim',   '5s',   'splash'),

      // Standard (24)
      sticker('sea-turtle',     'Sea turtle',        'standard', 'animal',  'swim',   '4s',   'splash'),
      sticker('crab',           'Crab',              'standard', 'animal',  'scuttle','2s',   'bubble'),
      sticker('lobster',        'Lobster',           'standard', 'animal',  'scuttle','2.5s', 'bubble'),
      sticker('starfish',       'Starfish',          'standard', 'animal',  'pulse',  '4s',   'bubble'),
      sticker('pufferfish',     'Pufferfish',        'standard', 'animal',  'pulse',  '2s',   'bubble'),
      sticker('manta-ray',      'Manta ray',         'standard', 'animal',  'swim',   '4s',   'splash'),
      sticker('dolphin',        'Dolphin',           'standard', 'animal',  'swim',   '3s',   'splash'),
      sticker('anglerfish',     'Anglerfish',        'standard', 'animal',  'swim',   '3.5s', 'bubble'),
      sticker('narwhal',        'Narwhal',           'standard', 'animal',  'swim',   '4s',   'splash'),
      sticker('clam-pearl',     'Clam with pearl',   'standard', 'animal',  'pulse',  '4s',   'bubble'),
      sticker('treasure-chest', 'Treasure chest',    'standard', 'object',  'wobble', '3s',   'pop'),
      sticker('anchor',         'Anchor',            'standard', 'object',  'wobble', '4s',   'splash'),
      sticker('submarine',      'Submarine',         'standard', 'vehicle', 'float',  '4s',   'whoosh'),
      sticker('diver',          'Diver',             'standard', 'character','swim',  '3s',   'bubble'),
      sticker('pirate-ship',    'Pirate ship (small)','standard','vehicle', 'float',  '5s',   'splash'),
      sticker('mermaid',        'Mermaid',           'standard', 'character','swim',  '3.5s', 'bubble'),
      sticker('sea-snail',      'Sea snail',         'standard', 'animal',  'scuttle','3s',   'bubble'),
      sticker('hermit-crab',    'Hermit crab',       'standard', 'animal',  'scuttle','2.5s', 'bubble'),
      sticker('coral-reef',     'Coral reef',        'standard', 'plant',   'pulse',  '5s',   'bubble'),
      sticker('seaweed',        'Seaweed',           'standard', 'plant',   'pulse',  '4s',   'bubble'),
      sticker('swordfish',      'Swordfish',         'standard', 'animal',  'swim',   '3s',   'splash'),
      sticker('sea-urchin',     'Sea urchin',        'standard', 'animal',  'pulse',  '3s',   'bubble'),
      sticker('shipwreck',      'Shipwreck',         'standard', 'object',  'wobble', '5s',   'splash'),
      sticker('bubble-trail',   'Bubble trail',      'standard', 'object',  'float',  '3s',   'bubble'),

      // Secret (6)
      sticker('narwhal-sunglasses',  'Narwhal with sunglasses',       'secret', 'animal',   'swim',   '4s',   'splash'),
      sticker('crab-balloons',       'Crab holding balloons',         'secret', 'animal',   'scuttle','2.5s', 'pop'),
      sticker('mermaid-waving',      'Mermaid waving',                'secret', 'character','swim',   '3s',   'bubble'),
      sticker('baby-octopus-teacup', 'Baby octopus in a teacup',      'secret', 'animal',   'float',  '3s',   'bubble'),
      sticker('shark-party-hat',     'Shark with a party hat',        'secret', 'animal',   'swim',   '4s',   'splash'),
      sticker('seahorse-bow-tie',    'Seahorse wearing a bow tie',    'secret', 'animal',   'float',  '3s',   'bubble'),
    ],
  },

  // -----------------------------------------------------------------------
  // JUNGLE
  // -----------------------------------------------------------------------
  jungle: {
    id: 'jungle',
    label: 'Jungle',
    emoji: '\u{1F334}',
    bg: 'from-green-800 to-emerald-950',
    bgImage: '/arthurs-world/images/scenes/jungle/bg.png',
    stickers: [
      // Hero (6)
      sticker('lion',     'Lion',     'hero', 'animal',   'walk',   '4s',   'roar'),
      sticker('tiger',    'Tiger',    'hero', 'animal',   'walk',   '4s',   'roar'),
      sticker('elephant', 'Elephant', 'hero', 'animal',   'walk',   '5s',   'trumpet'),
      sticker('gorilla',  'Gorilla',  'hero', 'animal',   'walk',   '4s',   'roar'),
      sticker('monkey',   'Monkey',   'hero', 'animal',   'bounce', '2s',   'squawk'),
      sticker('parrot',   'Parrot',   'hero', 'animal',   'flap',   '2s',   'squawk'),

      // Standard (24)
      sticker('toucan',          'Toucan',            'standard', 'animal',  'flap',   '2.5s', 'squawk'),
      sticker('frog',            'Frog',              'standard', 'animal',  'bounce', '1.5s', 'ribbit'),
      sticker('chameleon',       'Chameleon',         'standard', 'animal',  'walk',   '5s',   'pop'),
      sticker('snake',           'Snake',             'standard', 'animal',  'swim',   '3s',   'hiss'),
      sticker('crocodile',       'Crocodile',         'standard', 'animal',  'walk',   '5s',   'roar'),
      sticker('hippo',           'Hippo',             'standard', 'animal',  'walk',   '5s',   'roar'),
      sticker('giraffe',         'Giraffe',           'standard', 'animal',  'walk',   '5s',   'pop'),
      sticker('jaguar',          'Jaguar',            'standard', 'animal',  'walk',   '3.5s', 'roar'),
      sticker('sloth',           'Sloth',             'standard', 'animal',  'wobble', '6s',   'pop'),
      sticker('flamingo',        'Flamingo',          'standard', 'animal',  'wobble', '3s',   'squawk'),
      sticker('macaw',           'Macaw',             'standard', 'animal',  'flap',   '2s',   'squawk'),
      sticker('lemur',           'Lemur',             'standard', 'animal',  'bounce', '2.5s', 'squawk'),
      sticker('mandrill',        'Mandrill',          'standard', 'animal',  'walk',   '4s',   'roar'),
      sticker('butterfly',       'Butterfly',         'standard', 'animal',  'flap',   '2s',   'pop'),
      sticker('tropical-flower', 'Tropical flower',   'standard', 'plant',   'pulse',  '4s',   'pop'),
      sticker('giant-mushroom',  'Giant mushroom',    'standard', 'plant',   'pulse',  '4s',   'pop'),
      sticker('waterfall',       'Waterfall',         'standard', 'object',  'pulse',  '5s',   'splash'),
      sticker('vine',            'Vine',              'standard', 'plant',   'wobble', '4s',   'pop'),
      sticker('explorer',        'Explorer',          'standard', 'character','wobble','3s',   'pop'),
      sticker('tribal-drum',     'Tribal drum',       'standard', 'object',  'wobble', '2s',   'pop'),
      sticker('ancient-ruin',    'Ancient ruin stone','standard', 'object',  'wobble', '5s',   'pop'),
      sticker('tree-frog',       'Tree frog (tiny)',   'standard', 'animal',  'bounce', '1.5s', 'ribbit'),
      sticker('firefly',         'Firefly',           'standard', 'animal',  'flap',   '2s',   'bleep'),
      sticker('piranha',         'Piranha',           'standard', 'animal',  'swim',   '2s',   'splash'),

      // Secret (6)
      sticker('sloth-hammock',         'Sloth in a hammock',                        'secret', 'animal',   'wobble', '5s',   'pop'),
      sticker('frog-umbrella',         'Frog with a tiny umbrella',                 'secret', 'animal',   'bounce', '2s',   'ribbit'),
      sticker('parrot-party-hat',      'Parrot wearing a party hat',               'secret', 'animal',   'flap',   '2s',   'squawk'),
      sticker('explorer-map',          'Explorer with a map and magnifying glass',  'secret', 'character','wobble', '3s',   'pop'),
      sticker('monkey-banana',         'Monkey eating a banana',                    'secret', 'animal',   'bounce', '2s',   'crunch'),
      sticker('tiger-flower-crown',    'Tiger with a flower crown',                'secret', 'animal',   'walk',   '4s',   'roar'),
    ],
  },

  // -----------------------------------------------------------------------
  // FARM
  // -----------------------------------------------------------------------
  farm: {
    id: 'farm',
    label: 'Farm',
    emoji: '\u{1F33E}',
    bg: 'from-green-500 to-yellow-300',
    bgImage: '/arthurs-world/images/scenes/farm/bg.png',
    stickers: [
      // Hero (6)
      sticker('cow',     'Cow',           'hero', 'animal', 'walk',   '4s', 'moo'),
      sticker('pig',     'Pig',           'hero', 'animal', 'walk',   '3.5s','oink'),
      sticker('sheep',   'Sheep',         'hero', 'animal', 'walk',   '4s', 'baa'),
      sticker('horse',   'Horse',         'hero', 'animal', 'walk',   '3.5s','neigh'),
      sticker('chicken', 'Chicken',       'hero', 'animal', 'walk',   '3s', 'cluck'),
      sticker('chick',   'Chick (baby)',   'hero', 'animal', 'bounce', '2s', 'cluck'),

      // Standard (24)
      sticker('duck',             'Duck',              'standard', 'animal',   'walk',   '3.5s', 'squawk'),
      sticker('duckling',         'Duckling',          'standard', 'animal',   'walk',   '3s',   'squawk'),
      sticker('goat',             'Goat',              'standard', 'animal',   'walk',   '4s',   'baa'),
      sticker('rabbit',           'Rabbit',            'standard', 'animal',   'bounce', '2s',   'pop'),
      sticker('sheepdog',         'Dog (sheepdog)',     'standard', 'animal',   'walk',   '3s',   'pop'),
      sticker('barn-cat',         'Cat (barn)',         'standard', 'animal',   'walk',   '4s',   'pop'),
      sticker('donkey',           'Donkey',            'standard', 'animal',   'walk',   '4.5s', 'neigh'),
      sticker('rooster',          'Rooster',           'standard', 'animal',   'walk',   '3s',   'cluck'),
      sticker('turkey',           'Turkey',            'standard', 'animal',   'walk',   '3.5s', 'squawk'),
      sticker('tractor',          'Tractor',           'standard', 'vehicle',  'walk',   '5s',   'whoosh'),
      sticker('wheelbarrow',      'Wheelbarrow',       'standard', 'object',   'wobble', '3s',   'pop'),
      sticker('hay-bale',         'Hay bale',          'standard', 'object',   'wobble', '4s',   'pop'),
      sticker('watering-can',     'Watering can',      'standard', 'object',   'wobble', '3s',   'splash'),
      sticker('sunflower',        'Sunflower',         'standard', 'plant',    'pulse',  '4s',   'pop'),
      sticker('apple-tree',       'Apple tree',        'standard', 'plant',    'pulse',  '5s',   'pop'),
      sticker('scarecrow',        'Scarecrow',         'standard', 'character','wobble', '3s',   'pop'),
      sticker('farmer-male',      'Farmer (male)',      'standard', 'character','wobble', '3s',   'pop'),
      sticker('farmer-female',    'Farmer (female)',    'standard', 'character','wobble', '3s',   'pop'),
      sticker('windmill',         'Windmill',          'standard', 'object',   'spin',   '6s',   'whoosh'),
      sticker('barn-owl',         'Barn owl',          'standard', 'animal',   'flap',   '2.5s', 'squawk'),
      sticker('hedgehog',         'Hedgehog',          'standard', 'animal',   'walk',   '3s',   'pop'),
      sticker('fox',              'Fox',               'standard', 'animal',   'walk',   '3.5s', 'pop'),
      sticker('beehive',          'Beehive',           'standard', 'object',   'pulse',  '3s',   'pop'),
      sticker('vegetable-basket', 'Vegetable basket',  'standard', 'object',   'wobble', '3s',   'pop'),

      // Secret (6)
      sticker('pig-mud-bath',       'Pig in a mud bath',            'secret', 'animal',   'wobble', '3s',   'oink'),
      sticker('sheep-jumper',       'Sheep wearing a jumper',       'secret', 'animal',   'walk',   '4s',   'baa'),
      sticker('cow-flowers',        'Cow with flowers on its head', 'secret', 'animal',   'walk',   '4s',   'moo'),
      sticker('farmer-dancing',     'Farmer doing a silly dance',   'secret', 'character','wobble', '2s',   'pop'),
      sticker('chicken-boots',      'Chicken wearing boots',        'secret', 'animal',   'walk',   '3s',   'cluck'),
      sticker('horse-top-hat',      'Horse with a top hat',         'secret', 'animal',   'walk',   '3.5s', 'neigh'),
    ],
  },

  // -----------------------------------------------------------------------
  // DINOSAURS
  // -----------------------------------------------------------------------
  dinosaurs: {
    id: 'dinosaurs',
    label: 'Dinosaurs',
    emoji: '\u{1F995}',
    bg: 'from-orange-800 to-stone-900',
    bgImage: '/arthurs-world/images/scenes/dinosaurs/bg.png',
    stickers: [
      // Hero (6)
      sticker('t-rex',         'T-Rex',         'hero', 'dinosaur', 'walk', '4s',   'roar'),
      sticker('triceratops',   'Triceratops',   'hero', 'dinosaur', 'walk', '5s',   'roar'),
      sticker('brachiosaurus', 'Brachiosaurus', 'hero', 'dinosaur', 'walk', '6s',   'roar'),
      sticker('stegosaurus',   'Stegosaurus',   'hero', 'dinosaur', 'walk', '5s',   'roar'),
      sticker('pterodactyl',   'Pterodactyl',   'hero', 'dinosaur', 'fly',  '3s',   'squawk'),
      sticker('ankylosaurus',  'Ankylosaurus',  'hero', 'dinosaur', 'walk', '5s',   'roar'),

      // Standard (24)
      sticker('diplodocus',         'Diplodocus',            'standard', 'dinosaur',  'walk',   '6s',   'roar'),
      sticker('spinosaurus',        'Spinosaurus',           'standard', 'dinosaur',  'walk',   '4.5s', 'roar'),
      sticker('velociraptor',       'Velociraptor',          'standard', 'dinosaur',  'walk',   '2.5s', 'roar'),
      sticker('pachycephalosaurus', 'Pachycephalosaurus',    'standard', 'dinosaur',  'walk',   '4s',   'roar'),
      sticker('baby-t-rex',         'Baby T-Rex',            'standard', 'dinosaur',  'walk',   '3s',   'roar'),
      sticker('dino-egg-cracking',  'Dino egg (cracking)',    'standard', 'object',    'wobble', '2s',   'pop'),
      sticker('dino-egg-unhatched', 'Dino egg (unhatched)',   'standard', 'object',    'wobble', '3s',   'pop'),
      sticker('baby-dino-hatching', 'Baby dino (hatching)',   'standard', 'dinosaur',  'bounce', '2s',   'pop'),
      sticker('caveman',            'Caveman (friendly)',     'standard', 'character', 'wobble', '3s',   'pop'),
      sticker('cavewoman',          'Cavewoman',             'standard', 'character', 'wobble', '3s',   'pop'),
      sticker('cave',               'Cave',                  'standard', 'object',    'wobble', '5s',   'pop'),
      sticker('volcano',            'Volcano',               'standard', 'object',    'pulse',  '4s',   'roar'),
      sticker('ancient-fern',       'Ancient fern (big)',     'standard', 'plant',     'pulse',  '4s',   'pop'),
      sticker('fossil-rock',        'Fossil in rock',        'standard', 'object',    'wobble', '5s',   'pop'),
      sticker('giant-dragonfly',    'Dragonfly (giant)',      'standard', 'animal',    'flap',   '2s',   'pop'),
      sticker('mammoth',            'Mammoth',               'standard', 'animal',    'walk',   '5s',   'roar'),
      sticker('sabre-tooth',        'Sabre-tooth tiger',     'standard', 'animal',    'walk',   '4s',   'roar'),
      sticker('meteor-incoming',    'Meteor (incoming)',       'standard', 'object',    'float',  '3s',   'whoosh'),
      sticker('tar-pit-bubbles',    'Tar pit bubbles',       'standard', 'object',    'pulse',  '3s',   'bubble'),
      sticker('dino-footprint',     'Dino footprint',        'standard', 'object',    'wobble', '4s',   'pop'),
      sticker('prehistoric-fish',   'Prehistoric fish',      'standard', 'animal',    'swim',   '3s',   'splash'),
      sticker('giant-beetle',       'Giant beetle',          'standard', 'animal',    'scuttle','2s',   'pop'),
      sticker('dinosaur-skull',     'Dinosaur skull',        'standard', 'object',    'wobble', '4s',   'pop'),
      sticker('dino-nest',          'Dino nest (eggs)',       'standard', 'object',    'wobble', '4s',   'pop'),

      // Secret (6)
      sticker('baby-t-rex-egg',        'Baby T-Rex in an egg',         'secret', 'dinosaur',  'bounce', '2s',   'pop'),
      sticker('triceratops-bow-tie',   'Triceratops with a bow tie',   'secret', 'dinosaur',  'walk',   '5s',   'roar'),
      sticker('pterodactyl-fish',      'Pterodactyl carrying a fish',  'secret', 'dinosaur',  'fly',    '3s',   'squawk'),
      sticker('caveman-riding-dino',   'Caveman riding a dino',        'secret', 'character', 'walk',   '4s',   'roar'),
      sticker('stegosaurus-sunglasses','Stegosaurus with sunglasses',  'secret', 'dinosaur',  'walk',   '5s',   'roar'),
      sticker('volcano-party-hat',     'Volcano wearing a party hat',  'secret', 'object',    'pulse',  '4s',   'roar'),
    ],
  },

  // -----------------------------------------------------------------------
  // THEME PARK
  // -----------------------------------------------------------------------
  themePark: {
    id: 'themePark',
    label: 'Theme Park',
    emoji: '\u{1F3A0}',
    bg: 'from-pink-500 to-yellow-400',
    bgImage: '/arthurs-world/images/scenes/theme-park/bg.png',
    stickers: [
      // Hero (6)
      sticker('balloon-red',        'Balloon (red)',         'hero', 'object',    'float',  '4s',   'pop'),
      sticker('candy-floss',        'Candy floss',           'hero', 'food',      'wobble', '3s',   'crunch'),
      sticker('ice-cream-cone',     'Ice cream cone',        'hero', 'food',      'wobble', '3s',   'crunch'),
      sticker('carousel-horse',     'Carousel horse',        'hero', 'object',    'bounce', '3s',   'pop'),
      sticker('roller-coaster-car', 'Roller coaster car',    'hero', 'vehicle',   'float',  '2.5s', 'whoosh'),
      sticker('clown',              'Clown (friendly)',       'hero', 'character', 'wobble', '2.5s', 'pop'),

      // Standard (24)
      sticker('balloon-bunch',      'Balloon (bunch)',        'standard', 'object',    'float',  '4s',   'pop'),
      sticker('popcorn-box',        'Popcorn box',           'standard', 'food',      'wobble', '3s',   'crunch'),
      sticker('hot-dog',            'Hot dog',               'standard', 'food',      'wobble', '3s',   'crunch'),
      sticker('toffee-apple',       'Toffee apple',          'standard', 'food',      'wobble', '3s',   'crunch'),
      sticker('bumper-car',         'Bumper car',            'standard', 'vehicle',   'walk',   '3s',   'whoosh'),
      sticker('magician',           'Magician',              'standard', 'character', 'wobble', '3s',   'sting'),
      sticker('juggler',            'Juggler',               'standard', 'character', 'wobble', '2.5s', 'pop'),
      sticker('tightrope-walker',   'Tightrope walker',      'standard', 'character', 'wobble', '3s',   'pop'),
      sticker('goldfish-bag',       'Goldfish in bag',       'standard', 'animal',    'wobble', '3s',   'bubble'),
      sticker('teddy-bear-prize',   'Teddy bear prize',      'standard', 'object',    'wobble', '3s',   'pop'),
      sticker('rubber-duck',        'Rubber duck',           'standard', 'object',    'float',  '3s',   'pop'),
      sticker('dart-board',         'Dart board',            'standard', 'object',    'wobble', '3s',   'sting'),
      sticker('strongman-bell',     'Strongman bell',        'standard', 'object',    'wobble', '2s',   'sting'),
      sticker('ticket-booth',       'Ticket booth',          'standard', 'object',    'wobble', '4s',   'pop'),
      sticker('ferris-wheel',       'Ferris wheel (small)',   'standard', 'object',    'spin',   '8s',   'pop'),
      sticker('merry-go-round',     'Merry-go-round',        'standard', 'object',    'spin',   '6s',   'pop'),
      sticker('confetti-cannon',    'Confetti cannon',       'standard', 'object',    'wobble', '2s',   'pop'),
      sticker('star-banner',        'Star banner',           'standard', 'object',    'pulse',  '3s',   'pop'),
      sticker('firework-burst',     'Firework (burst)',       'standard', 'object',    'pulse',  '2s',   'pop'),
      sticker('party-hat',          'Party hat',             'standard', 'object',    'wobble', '3s',   'pop'),
      sticker('fairy-lights',       'Fairy lights string',   'standard', 'object',    'pulse',  '3s',   'bleep'),
      sticker('ghost-train-car',    'Ghost train car',       'standard', 'vehicle',   'walk',   '4s',   'whoosh'),
      sticker('funhouse-mirror',    'Mirror (funhouse)',      'standard', 'object',    'wobble', '3s',   'pop'),
      sticker('acrobat',            'Acrobat',               'standard', 'character', 'bounce', '2s',   'pop'),

      // Secret (6)
      sticker('clown-unicycle',       'Clown riding a unicycle',                'secret', 'character', 'walk',   '3s',   'pop'),
      sticker('bear-winning-goldfish','Bear winning a goldfish',                'secret', 'animal',    'wobble', '3s',   'pop'),
      sticker('magician-rabbit',      'Magician pulling a rabbit from a hat',   'secret', 'character', 'wobble', '3s',   'sting'),
      sticker('acrobat-ball',         'Acrobat balancing on a ball',            'secret', 'character', 'bounce', '2.5s', 'pop'),
      sticker('balloon-animal-dog',   'Balloon animal dog',                    'secret', 'object',    'float',  '3s',   'pop'),
      sticker('ice-cream-face',       'Ice cream with a face',                 'secret', 'food',      'wobble', '3s',   'crunch'),
    ],
  },
};

// ===== CONSTANTS ===========================================================

export const SNAP_THRESHOLD = 15;
export const TRAY_SIZE = 12;
export const HERO_MIN = 2;
export const ANIMAL_MIN = 5;
export const SECRET_CHANCE = 0.25;

// ===== HELPERS =============================================================

/** Build a random tray of 12 stickers for a scene */
export function buildTray(sceneId) {
  const scene = SCENES[sceneId];
  const heroes = scene.stickers.filter(s => s.tier === 'hero');
  const standard = scene.stickers.filter(s => s.tier === 'standard');
  const animals = [...heroes, ...standard].filter(s =>
    s.category === 'animal' || s.category === 'character' || s.category === 'dinosaur'
  );

  const tray = [];

  // Add 2+ heroes
  const shuffledHeroes = [...heroes].sort(() => Math.random() - 0.5);
  tray.push(...shuffledHeroes.slice(0, HERO_MIN));

  // Ensure 5+ animals (that aren't already in tray)
  const remainingAnimals = animals.filter(a => !tray.find(t => t.id === a.id));
  const shuffledAnimals = [...remainingAnimals].sort(() => Math.random() - 0.5);
  const animalsNeeded = Math.max(0, ANIMAL_MIN - tray.filter(t =>
    t.category === 'animal' || t.category === 'character' || t.category === 'dinosaur'
  ).length);
  tray.push(...shuffledAnimals.slice(0, animalsNeeded));

  // Fill remaining from standard pool (not already in tray)
  const remaining = standard.filter(s => !tray.find(t => t.id === s.id));
  const shuffled = [...remaining].sort(() => Math.random() - 0.5);
  const needed = TRAY_SIZE - tray.length;
  tray.push(...shuffled.slice(0, needed));

  // Shuffle final tray
  return tray.sort(() => Math.random() - 0.5);
}

/** Get a surprise sticker not in the current tray */
export function getSurprise(sceneId, currentTrayIds, discoveredSecrets) {
  const scene = SCENES[sceneId];
  const isSecret = Math.random() < SECRET_CHANCE;

  if (isSecret) {
    const secrets = scene.stickers.filter(
      s => s.tier === 'secret' && !currentTrayIds.includes(s.id)
    );
    if (secrets.length > 0) {
      const pick = secrets[Math.floor(Math.random() * secrets.length)];
      return { sticker: pick, isSecret: true };
    }
  }

  // Fall back to standard/hero not in tray
  const available = scene.stickers.filter(
    s => s.tier !== 'secret' && !currentTrayIds.includes(s.id)
  );
  if (available.length === 0) return null;
  const pick = available[Math.floor(Math.random() * available.length)];
  return { sticker: pick, isSecret: false };
}
