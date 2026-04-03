#!/bin/bash
# Hundred Acre Wood story images — generic woodland bear and friends
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(dirname "$SCRIPT_DIR")"
IMAGES_DIR="$ROOT/public/images"
API_KEY="$(grep VITE_OPENAI_API_KEY "$ROOT/.env" | cut -d= -f2-)"
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
  if [ -f "$output" ] && [ "$(stat -c%s "$output" 2>/dev/null || stat -f%z "$output" 2>/dev/null)" -gt 1000 ]; then
    echo "  ✅ page-${page_num}.png exists"
    SKIPPED=$((SKIPPED+1))
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
      -H "Authorization: Bearer $API_KEY" -H "Content-Type: application/json" \
      -d "$json_body" -o "$tmpfile" 2>/dev/null) || http_code="000"
    if [ "$http_code" = "429" ]; then sleep $((attempt*10)); rm -f "$tmpfile"; continue; fi
    if [ "$http_code" != "200" ]; then
      echo "  ⚠️  HTTP $http_code attempt $attempt"
      cat "$tmpfile" 2>/dev/null | head -c 200; echo
      rm -f "$tmpfile"
      if [ "$attempt" -lt 3 ]; then sleep $((attempt*5)); continue; fi
      FAILED=$((FAILED+1)); return 1
    fi
    local b64
    b64=$(node -e "
      const d=JSON.parse(require('fs').readFileSync('$tmpfile','utf-8'));
      if(d.data?.[0]?.b64_json){require('fs').writeFileSync('$output',Buffer.from(d.data[0].b64_json,'base64'));console.log('ok');}
      else console.log('no_data');" 2>/dev/null)
    rm -f "$tmpfile"
    if [ "$b64" = "ok" ]; then
      local size
      size=$(stat -c%s "$output" 2>/dev/null || stat -f%z "$output" 2>/dev/null)
      echo "  ✅ page-${page_num}.png saved ($((size/1024))KB)"
      GENERATED=$((GENERATED+1)); return 0
    else
      echo "  ⚠️  No data attempt $attempt"
      if [ "$attempt" -lt 3 ]; then sleep $((attempt*5)); continue; fi
      FAILED=$((FAILED+1)); return 1
    fi
  done
}

echo "🎨 Generating Hundred Acre Wood story (10 pages)..."
echo ""
echo "📖 pooh (10 pages)"
generate_image "pooh" 1 "A chubby friendly honey-coloured teddy bear waking up stretching in a cosy treehouse bedroom with a little round door"
generate_image "pooh" 2 "A honey-coloured teddy bear tipping an empty clay honey pot upside down, looking disappointed, last drop of honey dripping"
generate_image "pooh" 3 "A friendly bear visiting a tiny pink piglet friend at a small round green door in a tree trunk"
generate_image "pooh" 4 "A cheerful bouncy striped orange and black cat-like creature bouncing into a woodland scene with great energy"
generate_image "pooh" 5 "A teddy bear climbing a tall old oak tree reaching for a beehive with golden honey dripping, friendly bees buzzing around"
generate_image "pooh" 6 "A round teddy bear sitting in a mud puddle laughing while friendly bees circle around him in a meadow"
generate_image "pooh" 7 "Woodland animal friends inside a neat tidy burrow home looking at shelves stacked with honey pots"
generate_image "pooh" 8 "A round chubby bear stuck in a small round doorway, tummy too full, legs dangling, funny silly scene"
generate_image "pooh" 9 "Woodland animals pulling a stuck teddy bear who pops out of a round hole and tumbles through the air, comical"
generate_image "pooh" 10 "Woodland animal friends — a bear, a piglet, a striped bouncy creature, a rabbit, a donkey — all sharing honey under an oak tree"

echo ""
echo "✨ Done! Generated: $GENERATED, Skipped: $SKIPPED, Failed: $FAILED"
