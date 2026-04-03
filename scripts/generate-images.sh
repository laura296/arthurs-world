#!/bin/bash
#
# Unattended image generation for all missing story pages.
# Uses OpenAI gpt-image-1 via curl. Run with: bash scripts/generate-images.sh
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(dirname "$SCRIPT_DIR")"
IMAGES_DIR="$ROOT/public/images"
API_KEY="$(grep VITE_OPENAI_API_KEY "$ROOT/.env" | cut -d= -f2-)"

if [ -z "$API_KEY" ]; then echo "❌ No API key in .env"; exit 1; fi

GENERATED=0
SKIPPED=0
FAILED=0

STYLE="Whimsical children's picture-book illustration. Soft watercolour style with warm golden-hour lighting. Rounded friendly forms, gentle saturated colours, amber and golden tones. Safe, curious, gentle mood. No text, no letters, no words anywhere in the image. Designed for a 3-year-old child."

generate_image() {
  local story_id="$1"
  local page_num="$2"
  local prompt="$3"
  local dir="$IMAGES_DIR/$story_id"
  local output="$dir/page-${page_num}.png"

  mkdir -p "$dir"

  # Skip if already exists and is non-trivial
  if [ -f "$output" ] && [ "$(stat -c%s "$output" 2>/dev/null || stat -f%z "$output" 2>/dev/null)" -gt 1000 ]; then
    echo "  ✅ page-${page_num}.png already exists"
    SKIPPED=$((SKIPPED + 1))
    return 0
  fi

  local full_prompt="${prompt}\n\nStyle: ${STYLE}"
  local json_body
  json_body=$(node -e "console.log(JSON.stringify({model:'gpt-image-1',prompt:process.argv[1],n:1,size:'1536x1024',quality:'medium'}))" "$full_prompt")

  for attempt in 1 2 3; do
    local tmpfile
    tmpfile=$(mktemp)

    local http_code
    http_code=$(curl -s -w "%{http_code}" --max-time 120 -X POST \
      "https://api.openai.com/v1/images/generations" \
      -H "Authorization: Bearer $API_KEY" \
      -H "Content-Type: application/json" \
      -d "$json_body" \
      -o "$tmpfile" 2>/dev/null) || http_code="000"

    if [ "$http_code" = "429" ]; then
      local wait=$((attempt * 10))
      echo "  ⏳ Rate limited, waiting ${wait}s..."
      sleep "$wait"
      rm -f "$tmpfile"
      continue
    fi

    if [ "$http_code" != "200" ]; then
      echo "  ⚠️  HTTP $http_code on attempt $attempt"
      cat "$tmpfile" 2>/dev/null | head -c 200
      echo
      rm -f "$tmpfile"
      if [ "$attempt" -lt 3 ]; then sleep $((attempt * 5)); continue; fi
      FAILED=$((FAILED + 1))
      return 1
    fi

    # Extract b64_json and decode to PNG
    local b64
    b64=$(node -e "
      const d = JSON.parse(require('fs').readFileSync('$tmpfile','utf-8'));
      if (d.data?.[0]?.b64_json) {
        require('fs').writeFileSync('$output', Buffer.from(d.data[0].b64_json,'base64'));
        console.log('ok');
      } else { console.log('no_data'); }
    " 2>/dev/null)

    rm -f "$tmpfile"

    if [ "$b64" = "ok" ]; then
      local size
      size=$(stat -c%s "$output" 2>/dev/null || stat -f%z "$output" 2>/dev/null)
      echo "  ✅ page-${page_num}.png saved ($(( size / 1024 ))KB)"
      GENERATED=$((GENERATED + 1))
      return 0
    else
      echo "  ⚠️  No image data on attempt $attempt"
      if [ "$attempt" -lt 3 ]; then sleep $((attempt * 5)); continue; fi
      FAILED=$((FAILED + 1))
      return 1
    fi
  done
}

echo ""
echo "🎨 Starting image generation..."
echo ""

# ═══════════════════════════════════════
# AESOP'S FABLES (6 stories × 8 pages)
# ═══════════════════════════════════════

echo "📖 ant-grasshopper (8 pages)"
generate_image "ant-grasshopper" 1 "A little ant carrying food on a sunny summer day, walking along a path near her cosy ant hill, bright green grass and flowers"
generate_image "ant-grasshopper" 2 "A happy grasshopper singing and dancing in sunshine with musical notes around him, green meadow"
generate_image "ant-grasshopper" 3 "The grasshopper talking to the busy ant, grasshopper relaxed and playful, ant carrying a berry"
generate_image "ant-grasshopper" 4 "The ant storing berries and seeds inside her cosy underground home, jars of food on shelves"
generate_image "ant-grasshopper" 5 "A snowy winter scene, cold wind blowing, bare trees, snowflakes falling, grey sky"
generate_image "ant-grasshopper" 6 "The grasshopper shivering in the cold snow, looking hungry and sad, no food around"
generate_image "ant-grasshopper" 7 "The kind ant opening her door to the cold grasshopper, warm light from inside, food visible"
generate_image "ant-grasshopper" 8 "The ant and grasshopper sharing food together inside the cosy warm home, both smiling happily"

echo "📖 boy-cried-wolf (8 pages)"
generate_image "boy-cried-wolf" 1 "A little shepherd boy sitting on a green hill with fluffy white sheep, peaceful countryside"
generate_image "boy-cried-wolf" 2 "The boy shouting with hands cupped around mouth, sheep in background, mischievous grin"
generate_image "boy-cried-wolf" 3 "Villagers running up a hill looking worried, the boy laughing, sheep grazing peacefully"
generate_image "boy-cried-wolf" 4 "The boy shouting again from the hilltop, waving arms dramatically"
generate_image "boy-cried-wolf" 5 "Angry villagers shaking their heads and walking away from the boy on the hill"
generate_image "boy-cried-wolf" 6 "A sneaky grey wolf creeping out from dark forest trees, the boy looking terrified"
generate_image "boy-cried-wolf" 7 "The boy crying for help on the hilltop, wolf approaching sheep, empty village below"
generate_image "boy-cried-wolf" 8 "A kind farmer chasing the wolf away, the boy looking relieved and sorry"

echo "📖 fox-grapes (8 pages)"
generate_image "fox-grapes" 1 "A hungry orange fox walking through a sunny forest, looking around for food"
generate_image "fox-grapes" 2 "The fox gazing up at beautiful big purple grapes hanging high on a vine, drooling"
generate_image "fox-grapes" 3 "The fox jumping up high trying to reach the grapes, stretching his paws up"
generate_image "fox-grapes" 4 "The fox jumping again with more effort, grapes still too high, determined expression"
generate_image "fox-grapes" 5 "The fox making one huge leap with all his might, grapes just out of reach"
generate_image "fox-grapes" 6 "The fox walking away with nose in the air looking grumpy, grapes behind him"
generate_image "fox-grapes" 7 "A little bird on a branch watching the fox walk away, amused expression"
generate_image "fox-grapes" 8 "The fox walking into the distance through the forest, purple grapes glowing on the vine"

echo "📖 lion-mouse (8 pages)"
generate_image "lion-mouse" 1 "A big golden lion sleeping peacefully in warm sunshine under a tree in the savanna"
generate_image "lion-mouse" 2 "A tiny brown mouse running across the lion's nose, the lion waking up surprised"
generate_image "lion-mouse" 3 "The lion holding the tiny mouse in his big paw, the mouse looking up pleadingly"
generate_image "lion-mouse" 4 "The lion laughing and letting the tiny mouse go free, mouse scurrying away happily"
generate_image "lion-mouse" 5 "The lion tangled in a big rope net in the forest, looking sad and trapped"
generate_image "lion-mouse" 6 "The tiny mouse running towards the trapped lion with a determined face"
generate_image "lion-mouse" 7 "The mouse nibbling through the rope net with her tiny teeth, strands breaking"
generate_image "lion-mouse" 8 "The lion free and happy, the tiny mouse sitting on his paw, both smiling as friends"

echo "📖 tortoise-hare (8 pages)"
generate_image "tortoise-hare" 1 "A boastful hare running super fast showing off, dust clouds behind, forest animals watching"
generate_image "tortoise-hare" 2 "A small tortoise challenging the hare to a race, the hare laughing, woodland setting"
generate_image "tortoise-hare" 3 "Race starting — hare zooming ahead in a blur, tortoise taking first slow step"
generate_image "tortoise-hare" 4 "The hare sleeping under a shady tree, snoring with Zzz, peaceful countryside"
generate_image "tortoise-hare" 5 "The tortoise walking steadily along the race path, determined face, one step at a time"
generate_image "tortoise-hare" 6 "The tortoise tiptoeing past the sleeping hare, quiet and careful"
generate_image "tortoise-hare" 7 "The hare waking up shocked, seeing the tortoise near the finish line ribbon ahead"
generate_image "tortoise-hare" 8 "The tortoise crossing the finish line first, woodland animals cheering, celebratory scene"

echo "📖 town-country-mouse (8 pages)"
generate_image "town-country-mouse" 1 "A little brown mouse in a cosy hole under a big oak tree, countryside with flowers"
generate_image "town-country-mouse" 2 "Two mice greeting each other — a country mouse and a fancy town mouse with a little hat"
generate_image "town-country-mouse" 3 "Country mouse serving simple seeds and berries on a leaf plate, town mouse looking disappointed"
generate_image "town-country-mouse" 4 "Two small mice gazing up at big city buildings and bright lights, looking amazed"
generate_image "town-country-mouse" 5 "Two mice in a fancy house eating cheese, cake and chocolate on a big table"
generate_image "town-country-mouse" 6 "A big scary cat jumping out, two tiny mice running away terrified"
generate_image "town-country-mouse" 7 "Two mice hiding in a tiny crack in the wall, the cat's eye peering in"
generate_image "town-country-mouse" 8 "The country mouse happily back home in his cosy hole, simple food, peaceful and safe"

# ═══════════════════════════════════════
# FEELINGS STORIES (3 stories × 8 pages)
# ═══════════════════════════════════════

echo "📖 feelings-monster (8 pages)"
generate_image "feelings-monster" 1 "A cute fluffy monster with all different colours muddled together — red, blue, yellow, green, purple — looking confused"
generate_image "feelings-monster" 2 "A bright yellow happy monster jumping with joy, sunshine and rainbows around, warm scene"
generate_image "feelings-monster" 3 "A blue sad monster with rain drops, looking down gently, soft comforting scene"
generate_image "feelings-monster" 4 "A red angry monster with steam, then taking a deep calming breath"
generate_image "feelings-monster" 5 "A small dark purple scared monster looking nervous, then getting a warm hug"
generate_image "feelings-monster" 6 "A soft green calm monster floating peacefully like a gentle breeze, serene scene"
generate_image "feelings-monster" 7 "A pink monster surrounded by hearts, giving warm cuddles, loving gentle scene"
generate_image "feelings-monster" 8 "All the coloured feeling monsters together in a row — yellow, blue, red, purple, green, pink — all smiling"

echo "📖 feelings-friends (8 pages)"
generate_image "feelings-friends" 1 "A group of cute animal friends — bunny, kitten, puppy, hedgehog, duckling, owl — all together waving"
generate_image "feelings-friends" 2 "A happy bunny hopping joyfully through a meadow with flowers, big smile"
generate_image "feelings-friends" 3 "A sad little kitten looking for a lost toy, tearful eyes, needing a cuddle"
generate_image "feelings-friends" 4 "A grumpy puppy growling over a missing bone, learning to count to three to calm down"
generate_image "feelings-friends" 5 "A scared hedgehog curled up tight in a ball, gentle encouraging scene"
generate_image "feelings-friends" 6 "A silly duckling walking backwards and quacking, being wonderfully goofy and fun"
generate_image "feelings-friends" 7 "A wise owl giving warm cuddles with big soft wings, hearts floating around"
generate_image "feelings-friends" 8 "All the animal friends gathered together in a circle, hugging and smiling, warm group scene"

echo "📖 when-i-feel-big (8 pages)"
generate_image "when-i-feel-big" 1 "A small cute brown bear cub with very big colourful feelings swirling around him"
generate_image "when-i-feel-big" 2 "Little Bear bouncing excitedly with fizzy sparkles in his tummy, happy energetic scene"
generate_image "when-i-feel-big" 3 "Little Bear frustrated with a fallen-down block tower, wanting to stamp his feet"
generate_image "when-i-feel-big" 4 "Little Bear looking worried with swirly thoughts above his head, knotty tummy feeling"
generate_image "when-i-feel-big" 5 "Little Bear standing proud with puffed-up chest, having done something by himself, gold star"
generate_image "when-i-feel-big" 6 "Little Bear peeking shyly from behind his mummy bear, one eye showing"
generate_image "when-i-feel-big" 7 "Little Bear yawning sleepily with droopy eyes, cosy bedtime scene, moonlight"
generate_image "when-i-feel-big" 8 "Little Bear surrounded by all his feelings like colourful friends, being hugged and loved"

# ═══════════════════════════════════════
# DISNEY STORIES (4 stories × 10 pages)
# ═══════════════════════════════════════

echo "📖 captain-hook (10 pages)"
generate_image "captain-hook" 1 "Captain Hook on his pirate ship in Neverland, skull and crossbones flag, stormy sea"
generate_image "captain-hook" 2 "Captain Hook looking fearsome with his hook hand, but scared of something"
generate_image "captain-hook" 3 "A green crocodile with a ticking clock in its belly, tick-tock sound waves, Captain Hook terrified"
generate_image "captain-hook" 4 "Peter Pan flying over the pirate ship, playing tricks, green outfit, mischievous grin"
generate_image "captain-hook" 5 "Captain Hook holding a treasure map with X marks the spot, Skull Island in background"
generate_image "captain-hook" 6 "Peter Pan and Captain Hook having a sword fight on the ship deck, exciting action scene"
generate_image "captain-hook" 7 "Children on a plank over the sea, a flying boy swooping in to save them"
generate_image "captain-hook" 8 "Captain Hook falling off the ship into the water, the crocodile waiting below with open mouth"
generate_image "captain-hook" 9 "Captain Hook running away across the water, crocodile chasing him, tick-tock sounds"
generate_image "captain-hook" 10 "A flying boy and his friends celebrating on a tropical island, happy party scene"

echo "📖 cinderella (10 pages)"
generate_image "cinderella" 1 "A kind girl in a simple dress cleaning the floor while her mean stepsisters boss her around"
generate_image "cinderella" 2 "A golden royal invitation arriving at the door, sparkles, fancy palace in the distance"
generate_image "cinderella" 3 "A sad girl alone by the fireplace while stepsisters leave in fancy dresses"
generate_image "cinderella" 4 "A magical Fairy Godmother appearing in sparkles and light, waving a magic wand"
generate_image "cinderella" 5 "A pumpkin transforming into a beautiful golden carriage with magic sparkles"
generate_image "cinderella" 6 "A girl in a gorgeous sparkling ball gown with glass slippers, magical transformation"
generate_image "cinderella" 7 "A girl and a Prince dancing together in a beautiful palace ballroom, chandeliers"
generate_image "cinderella" 8 "A girl running down palace steps at midnight, losing a glass slipper, clock striking twelve"
generate_image "cinderella" 9 "The Prince holding a glass slipper, trying it on a girl's foot, perfect fit"
generate_image "cinderella" 10 "A girl and the Prince together at the palace, happily ever after, surrounded by flowers"

echo "📖 snow-white (10 pages)"
generate_image "snow-white" 1 "A beautiful princess with black hair and fair skin in a forest with friendly woodland animals"
generate_image "snow-white" 2 "An Evil Queen looking into her ornate magic mirror on the wall, dark castle"
generate_image "snow-white" 3 "A princess running through a dark scary forest with tall twisted trees"
generate_image "snow-white" 4 "A princess finding a tiny cute cottage in a woodland clearing, flowers around the door"
generate_image "snow-white" 5 "Seven cheerful little dwarfs with different coloured hats working in a sparkly diamond mine"
generate_image "snow-white" 6 "An evil queen disguised as an old woman offering a shiny red apple"
generate_image "snow-white" 7 "A princess asleep on a bed of flowers, seven little dwarfs gathered around her sadly"
generate_image "snow-white" 8 "A brave prince on a white horse riding through the enchanted forest"
generate_image "snow-white" 9 "A prince waking a sleeping princess with golden light and magical sparkles"
generate_image "snow-white" 10 "A princess, a prince, and seven dwarfs celebrating together in the forest, happily ever after"

echo "📖 pooh (10 pages)"
generate_image "pooh" 1 "A cute round yellow bear in a red shirt waking up in his tree house, stretching and yawning"
generate_image "pooh" 2 "A cute bear looking sadly into an empty honey pot turned upside down, dripping the last drop"
generate_image "pooh" 3 "A yellow bear visiting a tiny pink piglet at a small cosy house, both smiling"
generate_image "pooh" 4 "An orange stripy bouncy tiger bouncing in energetically, spring in his tail"
generate_image "pooh" 5 "A yellow bear climbing up a big tree with a beehive, bees buzzing around, honey dripping"
generate_image "pooh" 6 "A yellow bear falling into a mud puddle with bees chasing him, funny splashy scene"
generate_image "pooh" 7 "A yellow bear and friends at a rabbit's tidy house, rabbit showing shelves full of honey pots"
generate_image "pooh" 8 "A round yellow bear stuck in a rabbit's front door, too full of honey, bottom sticking out"
generate_image "pooh" 9 "Friends pulling a stuck bear — POP — he flies out through the air, funny scene"
generate_image "pooh" 10 "A yellow bear and all his animal friends sharing honey together under a big tree, warm scene"

echo ""
echo "✨ Done! Generated: $GENERATED, Skipped: $SKIPPED, Failed: $FAILED"
echo ""
