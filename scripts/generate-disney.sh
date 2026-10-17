#!/bin/bash
# Disney story images with safety-filter-safe prompts
# No copyrighted character names, no weapons, no scary descriptions
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(dirname "$SCRIPT_DIR")"
IMAGES_DIR="$ROOT/public/images"
API_KEY="$(grep VITE_OPENAI_API_KEY "$ROOT/.env" | cut -d= -f2-)"
GENERATED=0; SKIPPED=0; FAILED=0

STYLE="Whimsical children's picture-book illustration. Soft watercolour style with warm golden-hour lighting. Rounded friendly forms, gentle saturated colours, amber and golden tones. Safe, curious, gentle mood. No text, no letters, no words anywhere in the image. Designed for a 3-year-old child."

generate_image() {
  local story_id="$1"
  local page_num="$2"
  local prompt="$3"
  local dir="$IMAGES_DIR/$story_id"
  local output="$dir/page-${page_num}.png"
  mkdir -p "$dir"
  if [ -f "$output" ] && [ "$(stat -c%s "$output" 2>/dev/null || stat -f%z "$output" 2>/dev/null)" -gt 1000 ]; then
    echo "  ✅ page-${page_num}.png exists"; SKIPPED=$((SKIPPED+1)); return 0; fi
  local full_prompt="${prompt}\n\nStyle: ${STYLE}"
  local json_body; json_body=$(node -e "console.log(JSON.stringify({model:'gpt-image-1',prompt:process.argv[1],n:1,size:'1536x1024',quality:'medium'}))" "$full_prompt")
  for attempt in 1 2 3; do
    local tmpfile; tmpfile=$(mktemp)
    local http_code; http_code=$(curl -s -w "%{http_code}" --max-time 120 -X POST \
      "https://api.openai.com/v1/images/generations" \
      -H "Authorization: Bearer $API_KEY" -H "Content-Type: application/json" \
      -d "$json_body" -o "$tmpfile" 2>/dev/null) || http_code="000"
    if [ "$http_code" = "429" ]; then sleep $((attempt*10)); rm -f "$tmpfile"; continue; fi
    if [ "$http_code" != "200" ]; then
      echo "  ⚠️  HTTP $http_code attempt $attempt"; cat "$tmpfile" 2>/dev/null | head -c 200; echo
      rm -f "$tmpfile"; if [ "$attempt" -lt 3 ]; then sleep $((attempt*5)); continue; fi
      FAILED=$((FAILED+1)); return 1; fi
    local b64; b64=$(node -e "
      const d=JSON.parse(require('fs').readFileSync('$tmpfile','utf-8'));
      if(d.data?.[0]?.b64_json){require('fs').writeFileSync('$output',Buffer.from(d.data[0].b64_json,'base64'));console.log('ok');}
      else console.log('no_data');" 2>/dev/null)
    rm -f "$tmpfile"
    if [ "$b64" = "ok" ]; then
      local size; size=$(stat -c%s "$output" 2>/dev/null || stat -f%z "$output" 2>/dev/null)
      echo "  ✅ page-${page_num}.png saved ($((size/1024))KB)"; GENERATED=$((GENERATED+1)); return 0
    else echo "  ⚠️  No data attempt $attempt"; if [ "$attempt" -lt 3 ]; then sleep $((attempt*5)); continue; fi
      FAILED=$((FAILED+1)); return 1; fi
  done
}

echo "🎨 Generating Disney story images (safety-filtered prompts)..."
echo ""

echo "📖 captain-hook (10 pages)"
generate_image "captain-hook" 1 "A silly pirate captain standing on a grand wooden ship sailing through a magical island bay, colourful tropical scenery"
generate_image "captain-hook" 2 "A funny pirate captain with a big feathered hat looking nervous and jumpy on his ship deck"
generate_image "captain-hook" 3 "A friendly green crocodile swimming happily in turquoise water near a pirate ship, tropical island"
generate_image "captain-hook" 4 "A magical boy flying through a starry sky above a grand sailing ship, wearing a green outfit"
generate_image "captain-hook" 5 "A pirate captain excitedly studying an old treasure map with a big red X, tropical island behind"
generate_image "captain-hook" 6 "Two characters playfully chasing each other around a ship deck in a fun adventure game"
generate_image "captain-hook" 7 "Children standing bravely on a ship as a flying boy swoops down from the sky to join them"
generate_image "captain-hook" 8 "A silly pirate captain splashing into sparkling ocean water, looking surprised and funny"
generate_image "captain-hook" 9 "A pirate captain running comically along the beach while a friendly crocodile follows behind"
generate_image "captain-hook" 10 "A group of happy children celebrating on a beautiful tropical island with palm trees and fireflies"

echo "📖 cinderella (10 pages)"
generate_image "cinderella" 1 "A kind young girl in a simple blue dress sweeping the floor of an old kitchen, dreaming"
generate_image "cinderella" 2 "A sparkling golden envelope arriving at a cottage door, a grand palace glowing in the distance"
generate_image "cinderella" 3 "A kind girl sitting alone by a fireplace looking sad, two fancy figures leaving through the door"
generate_image "cinderella" 4 "A magical fairy appearing in a burst of sparkling light and stars, waving a glowing wand"
generate_image "cinderella" 5 "A large orange pumpkin magically transforming into a golden carriage with sparkles and swirls of light"
generate_image "cinderella" 6 "A girl magically dressed in a shimmering ball gown with sparkling shoes, surrounded by golden light"
generate_image "cinderella" 7 "A young couple dancing in a magnificent golden ballroom with crystal chandeliers and candlelight"
generate_image "cinderella" 8 "A girl running down grand palace steps under moonlight, one sparkling shoe left behind on the steps"
generate_image "cinderella" 9 "A young prince kneeling to place a sparkling glass shoe on a girl's foot, it fits perfectly"
generate_image "cinderella" 10 "A happy couple standing together in a beautiful palace garden surrounded by roses and butterflies"

echo "📖 snow-white (10 pages)"
generate_image "snow-white" 1 "A beautiful princess with short black hair and rosy cheeks in a sunny forest with deer and rabbits"
generate_image "snow-white" 2 "A vain queen looking at her reflection in an ornate golden mirror in a dark castle room"
generate_image "snow-white" 3 "A young girl running through a mystical dark forest with tall curving trees and glowing mushrooms"
generate_image "snow-white" 4 "A girl discovering a tiny adorable cottage in a sunny forest clearing, flowers and butterflies"
generate_image "snow-white" 5 "Seven cheerful tiny people in colourful hats whistling happily as they walk through a sparkly cave"
generate_image "snow-white" 6 "An old woman in a cloak offering a shiny red apple to a girl at a cottage door"
generate_image "snow-white" 7 "A princess lying peacefully asleep among flowers, seven small sad friends gathered around her"
generate_image "snow-white" 8 "A young prince on a white horse riding through a magical sunlit enchanted forest"
generate_image "snow-white" 9 "A princess waking up surrounded by golden magical sparkles and light, joyful scene"
generate_image "snow-white" 10 "A princess and prince celebrating with seven tiny friends in a sunny forest meadow, flowers and birds"

echo "📖 pooh (10 pages)"
generate_image "pooh" 1 "A cute round yellow bear in a small red shirt stretching and yawning in his cosy tree-house bedroom"
generate_image "pooh" 2 "A round yellow bear in a red shirt looking sadly into an empty honey pot turned upside down"
generate_image "pooh" 3 "A yellow bear visiting a tiny pink piglet at a small cosy house with a green round door"
generate_image "pooh" 4 "A cheerful bouncy orange tiger with black stripes bouncing into a scene with a spring-like tail"
generate_image "pooh" 5 "A yellow bear climbing a tall tree trunk reaching for a beehive dripping with golden honey, bees buzzing"
generate_image "pooh" 6 "A round yellow bear sitting in a mud puddle laughing while bees fly around him"
generate_image "pooh" 7 "A yellow bear and animal friends inside a tidy rabbit's house, shelves full of honey pots"
generate_image "pooh" 8 "A round yellow bear stuck in a small round doorway, his tummy too full, looking silly"
generate_image "pooh" 9 "Animal friends pulling a stuck bear who pops out of a doorway and flies through the air, funny"
generate_image "pooh" 10 "A yellow bear and all his animal friends — a piglet, tiger, rabbit, donkey — sharing honey under a tree"

echo ""
echo "✨ Done! Generated: $GENERATED, Skipped: $SKIPPED, Failed: $FAILED"
