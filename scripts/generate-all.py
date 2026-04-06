#!/usr/bin/env python3
"""Generate all missing images using OpenAI gpt-image-1 via curl."""
import json, subprocess, base64, os, sys, time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC = os.path.join(ROOT, 'public')
API_KEY = os.environ.get('OPENAI_API_KEY') or os.environ.get('VITE_OPENAI_API_KEY')
if not API_KEY:
    sys.exit('Set OPENAI_API_KEY')

STYLE = (
    "Pixar-quality soft 3D rendered illustration for a children's storybook. "
    "Warm golden-hour lighting, rounded forms, subsurface scattering feel. "
    "Safe, curious, gentle mood. Saturated warm amber palette, shadows lean purple/blue never grey. "
    "No text, no words, no letters, no UI elements."
)

PROMPTS = {
    # Section Heroes
    'sections/games.png': 'A magical playroom filled with soft toys, colourful building blocks, and a friendly bear cub peeking through a toy castle. Warm amber light streams through a window.',
    'sections/art.png': 'A cosy art studio with paintbrushes in jars, splashes of rainbow paint, an easel with a half-finished painting of a rainbow. Crayons and paper scattered on a wooden table.',
    'sections/books.png': 'A magical library nook with a comfy armchair, stacked storybooks with glowing pages, fairy lights, and a friendly owl perched on a bookshelf. Warm candlelight glow.',
    'sections/music.png': 'A whimsical music room with a tiny piano, colourful xylophone, floating musical notes made of gold light, tambourines, and a friendly robin singing on a branch.',
    'sections/videos.png': 'A cosy den with soft cushions arranged in front of a glowing screen showing colourful shapes. Popcorn bowl, fairy lights, warm amber glow from the screen.',

    # Tortoise & Hare
    'tortoise-hare/page-1.png': 'A speedy brown hare showing off, running in circles around woodland animals. Green meadow, blue sky, forest edge.',
    'tortoise-hare/page-2.png': 'A small green tortoise looking up confidently at a laughing hare. Other woodland animals watching. Sunny meadow.',
    'tortoise-hare/page-3.png': 'A race starting line with a hare zooming ahead in a blur and a tortoise taking his first slow step. Cheering woodland animals.',
    'tortoise-hare/page-4.png': 'A hare sleeping peacefully under a shady tree, snoring with a smile. Dappled sunlight, butterflies, peaceful meadow.',
    'tortoise-hare/page-5.png': 'A determined tortoise walking steadily along a country path, one step at a time. Rolling green hills, warm sunshine.',
    'tortoise-hare/page-6.png': 'A tortoise tiptoeing carefully past a sleeping hare under a tree. Quiet peaceful scene.',
    'tortoise-hare/page-7.png': 'A panicked hare waking up and seeing the tortoise near the finish line ribbon in the distance. Shocked expression.',
    'tortoise-hare/page-8.png': 'A happy tortoise crossing a finish line with a gold ribbon, woodland animals cheering. Confetti, celebration.',

    # Lion & Mouse
    'lion-mouse/page-1.png': 'A great golden lion sleeping peacefully in warm sunshine on the African savanna. Tall grass, acacia tree.',
    'lion-mouse/page-2.png': "A tiny brown mouse accidentally running across a sleeping lion's nose. The lion's eyes popping open in surprise.",
    'lion-mouse/page-3.png': 'A big lion holding a tiny mouse gently in his paw. The mouse is pleading with big eyes. Savanna background.',
    'lion-mouse/page-4.png': 'A lion laughing heartily while a tiny mouse walks away proudly. Warm savanna, golden light.',
    'lion-mouse/page-5.png': "A sad lion tangled in a thick rope net, trapped. Dark moody scene with hunters' torches in the distance.",
    'lion-mouse/page-6.png': 'A tiny brave mouse running toward a trapped lion in a net, determined expression. Dramatic lighting.',
    'lion-mouse/page-7.png': 'Close-up of a tiny mouse nibbling through thick ropes of a net with sharp teeth. Focused, determined.',
    'lion-mouse/page-8.png': 'A freed lion nuzzling a tiny mouse sitting on his paw. Both smiling. Warm golden sunset, savanna.',

    # Boy Cried Wolf
    'boy-cried-wolf/page-1.png': 'A little shepherd boy sitting on a big green hill with fluffy white sheep grazing peacefully. Blue sky, wildflowers.',
    'boy-cried-wolf/page-2.png': 'A bored shepherd boy with a mischievous grin, cupping his hands around his mouth to shout.',
    'boy-cried-wolf/page-3.png': 'Villagers running up a green hill with pitchforks and tools, looking worried. The boy laughing. No wolf.',
    'boy-cried-wolf/page-4.png': 'The same shepherd boy shouting again from the hilltop, looking cheeky. Sheep looking unimpressed.',
    'boy-cried-wolf/page-5.png': 'Angry villagers shaking their fists at a giggling boy on a hill. Red faces, crossed arms.',
    'boy-cried-wolf/page-6.png': 'A scary grey wolf creeping out of a dark forest edge toward sheep on a hill. The boy looking terrified.',
    'boy-cried-wolf/page-7.png': 'A scared boy shouting desperately from a hilltop. The village below is ignoring him. Wolf approaching sheep.',
    'boy-cried-wolf/page-8.png': 'A kind farmer chasing a wolf away with a stick. The relieved boy hugging a sheep. Warm sunset.',

    # Ant & Grasshopper
    'ant-grasshopper/page-1.png': 'A tiny ant carrying a big grain of wheat on a hot summer day. Bright sunshine, wildflowers, green grass.',
    'ant-grasshopper/page-2.png': 'A happy green grasshopper singing and dancing on a leaf, playing a tiny fiddle. Bright summer meadow.',
    'ant-grasshopper/page-3.png': 'A grasshopper leaning casually on a flower, talking to a busy ant carrying food. Summer meadow.',
    'ant-grasshopper/page-4.png': "An ant's cosy underground home filled with neatly stacked seeds, berries and grain. Warm interior light.",
    'ant-grasshopper/page-5.png': 'A snowy winter landscape. Bare trees, snowflakes falling, cold blue light. Wind blowing.',
    'ant-grasshopper/page-6.png': 'A shivering, sad grasshopper in the snow, hugging himself. Empty stomach, cold blue tones.',
    'ant-grasshopper/page-7.png': 'A kind ant opening her cosy warm door to a shivering grasshopper. Warm light spilling out into the snow.',
    'ant-grasshopper/page-8.png': 'An ant and grasshopper sharing food together at a tiny table inside a warm cosy burrow. Happy ending.',

    # Fox & Grapes
    'fox-grapes/page-1.png': 'A hungry orange fox walking through a sunny woodland path. Dappled light, green leaves, curious expression.',
    'fox-grapes/page-2.png': 'A fox looking up wide-eyed at big juicy purple grapes hanging high on a vine above. Mouth watering.',
    'fox-grapes/page-3.png': 'A fox jumping high into the air trying to reach purple grapes on a tall vine. Dynamic pose, stretching.',
    'fox-grapes/page-4.png': 'A fox jumping again and again, each time missing the grapes. Getting frustrated.',
    'fox-grapes/page-5.png': 'A fox making one final enormous leap with all his might toward the grapes. Maximum stretch.',
    'fox-grapes/page-6.png': 'A tired, grumpy fox sitting on the ground looking up at the grapes with a scowl. Arms crossed.',
    'fox-grapes/page-7.png': 'A fox walking away with his nose in the air, looking snooty. A little blue bird watching from a branch.',
    'fox-grapes/page-8.png': 'A little blue bird eating a grape happily on the vine. The fox small in the distance walking away.',

    # Town & Country Mouse
    'town-country-mouse/page-1.png': 'A cute brown mouse in a cosy underground home beneath a big oak tree. Simple furniture, acorn cups.',
    'town-country-mouse/page-2.png': 'Two mice cousins greeting each other — one in a country hat, one in a city bowtie. Under the oak tree.',
    'town-country-mouse/page-3.png': 'Country mouse serving seeds and berries on a tiny leaf plate. Town mouse looking unimpressed.',
    'town-country-mouse/page-4.png': 'Two tiny mice looking up in awe at enormous city buildings and bright lights. Night scene, dramatic scale.',
    'town-country-mouse/page-5.png': 'Two mice on a huge dining table with giant cheese wheels, cakes and chocolate. Eyes wide with amazement.',
    'town-country-mouse/page-6.png': 'A big scary ginger cat leaping toward two terrified mice on a table. Dramatic, scary but cartoonish.',
    'town-country-mouse/page-7.png': "Two mice hiding in a tiny crack in a wall, peeking out with big scared eyes. Cat's paw visible outside.",
    'town-country-mouse/page-8.png': 'A happy country mouse back in his cosy burrow under the oak tree, snuggling into bed. Peaceful, safe.',

    # Feelings Monster
    'feelings-monster/page-1.png': 'A cute round fluffy monster with all colours of the rainbow swirled together — muddled and confused. Big googly eyes.',
    'feelings-monster/page-2.png': 'A bright YELLOW fluffy monster jumping joyfully. Sunshine beams, sparkles, happy flowers blooming.',
    'feelings-monster/page-3.png': 'A BLUE fluffy monster sitting in gentle rain, one tear rolling down. Soft, empathetic, not scary.',
    'feelings-monster/page-4.png': 'A RED fluffy monster with steam coming from his ears, fists clenched. Taking a deep breath, calming down.',
    'feelings-monster/page-5.png': 'A small BLACK fluffy monster curled up in a dark corner, looking nervous. A gentle warm light approaching.',
    'feelings-monster/page-6.png': 'A soft GREEN fluffy monster floating peacefully on a cloud. Gentle breeze, leaves drifting, serene sky.',
    'feelings-monster/page-7.png': 'A warm PINK fluffy monster giving a big hug. Hearts floating around, warm rosy glow, cosy.',
    'feelings-monster/page-8.png': 'All the coloured monsters together in a group — yellow, blue, red, black, green, pink — sorted and happy. Rainbow.',

    # When I Feel Big
    'when-i-feel-big/page-1.png': 'A small cute brown bear cub sitting alone, looking overwhelmed. Swirling colourful feelings as auras around him.',
    'when-i-feel-big/page-2.png': 'A bear cub bouncing with excitement, fizzy sparkles in his tummy area. Bright, energetic, yellow sparkles.',
    'when-i-feel-big/page-3.png': 'A frustrated bear cub looking at a toppled tower of building blocks. Furrowed brow, stamping one foot.',
    'when-i-feel-big/page-4.png': 'A worried bear cub with thought bubbles full of question marks. Knotty tummy visual.',
    'when-i-feel-big/page-5.png': 'A proud bear cub puffing out his chest with a big smile, arms on hips. Gold star glow.',
    'when-i-feel-big/page-6.png': 'A shy bear cub hiding behind a bigger mama bear, peeking out with one eye. Gentle, sweet.',
    'when-i-feel-big/page-7.png': 'A sleepy bear cub with droopy eyes doing a big yawn. Stars and moons, bedtime colours, cosy pajamas.',
    'when-i-feel-big/page-8.png': 'A bear cub surrounded by soft glowing orbs of different colours representing all feelings. Warm, loved.',

    # Feelings Friends
    'feelings-friends/page-1.png': 'A group of cute baby animals — bunny, kitten, puppy, hedgehog, duckling, owl — sitting together in a meadow circle.',
    'feelings-friends/page-2.png': 'A happy white bunny hopping joyfully through a flower meadow. Daisies, butterflies, bright sunshine.',
    'feelings-friends/page-3.png': 'A sad grey kitten with big teary eyes looking for a lost toy mouse. Soft, empathetic mood.',
    'feelings-friends/page-4.png': 'An angry brown puppy growling with furrowed brows. A stolen bone nearby. Counting bubbles: 1, 2, 3.',
    'feelings-friends/page-5.png': 'A scared hedgehog curled into a ball in a dark corner. A gentle light approaching. Comforting.',
    'feelings-friends/page-6.png': 'A silly yellow duckling walking backwards with feet in the air, quacking. Other animals giggling.',
    'feelings-friends/page-7.png': 'A warm brown owl with wings spread wide giving a big feathery hug. Hearts, warmth, cosy nest.',
    'feelings-friends/page-8.png': 'All the animal friends together in a warm group cuddle — bunny, kitten, puppy, hedgehog, duckling, owl. Rainbow.',

    # Cinderella
    'disney/cinderella/page-1.png': 'A kind young girl in a simple dress sweeping a grand hallway while two mean stepsisters watch.',
    'disney/cinderella/page-2.png': 'A golden envelope with a royal seal being opened. A sparkling palace visible through a window.',
    'disney/cinderella/page-3.png': 'The stepsisters leaving in a fancy carriage while Cinderella watches sadly from a window. Night sky.',
    'disney/cinderella/page-4.png': 'A beautiful fairy godmother appearing in a burst of sparkles and light. Magic wand, kind smile.',
    'disney/cinderella/page-5.png': 'A large orange pumpkin magically transforming into a golden ornate coach. Sparkles, magic swirls.',
    'disney/cinderella/page-6.png': 'Cinderella in a stunning blue ball gown with sparkling glass slippers. Magical transformation.',
    'disney/cinderella/page-7.png': 'A prince and Cinderella dancing together in a grand ballroom. Chandeliers, golden light.',
    'disney/cinderella/page-8.png': 'Cinderella running down palace steps at midnight, a clock tower showing 12. Glass slipper on the steps.',
    'disney/cinderella/page-9.png': "A prince kneeling, fitting a glass slipper onto Cinderella's foot. Perfect fit, both smiling.",
    'disney/cinderella/page-10.png': 'Cinderella and the Prince in a wedding scene at the palace. Fireworks, happily ever after.',

    # Snow White
    'disney/snow-white/page-1.png': 'A beautiful princess with black hair and a blue-and-yellow dress in a castle garden. Birds and deer.',
    'disney/snow-white/page-2.png': 'An evil queen in a dark crown standing before a glowing ornate magic mirror on a wall.',
    'disney/snow-white/page-3.png': 'A frightened girl running through a dark scary forest. Gnarled trees, shadows, golden light ahead.',
    'disney/snow-white/page-4.png': 'A tiny adorable cottage in a forest clearing. Tiny door, tiny windows, flower boxes. Miniature.',
    'disney/snow-white/page-5.png': 'Seven small cheerful dwarfs marching home from a sparkling diamond mine, carrying picks and lanterns.',
    'disney/snow-white/page-6.png': 'An old woman in a dark cloak offering a shiny red apple. Sinister but cartoonish. Cottage doorstep.',
    'disney/snow-white/page-7.png': 'Snow White asleep on a bed of flowers, the seven dwarfs crying around her. Soft, sad, gentle light.',
    'disney/snow-white/page-8.png': 'A brave prince on a white horse riding through a dark enchanted forest toward a glowing cottage.',
    'disney/snow-white/page-9.png': 'A prince leaning over sleeping Snow White, a magical golden glow as she wakes up. Spell breaking.',
    'disney/snow-white/page-10.png': 'Snow White and the Prince riding away on a white horse. Seven dwarfs waving. Castle on a hill, rainbow.',

    # Winnie the Pooh
    'disney/pooh/page-1.png': 'A small yellow bear in a red shirt waking up and stretching in a cosy treehouse bedroom. Hundred Acre Wood.',
    'disney/pooh/page-2.png': 'A sad yellow bear looking into an empty honey pot, turning it upside down. Not a single drop.',
    'disney/pooh/page-3.png': 'A small yellow bear visiting a very tiny pink piglet outside a tiny house.',
    'disney/pooh/page-4.png': 'A bouncy orange tiger with black stripes bouncing in energetically. Spring-loaded tail, huge grin.',
    'disney/pooh/page-5.png': 'A yellow bear, pink piglet, and tiger looking up at a tall tree buzzing with bees. Honey dripping.',
    'disney/pooh/page-6.png': 'A yellow bear falling from a tree into a mud puddle, bees chasing him. Splashy, funny, cartoonish.',
    'disney/pooh/page-7.png': 'A fussy orange rabbit opening his door to friends. His house is neat and tidy with lots of honey jars.',
    'disney/pooh/page-8.png': "A round yellow bear stuck in a rabbit's round front door, legs dangling outside. Comically stuck.",
    'disney/pooh/page-9.png': 'All the animals pulling the bear out of the door — POP! The bear flying through the air.',
    'disney/pooh/page-10.png': 'All the Hundred Acre Wood friends sitting together sharing honey from a big pot. Warm sunset.',

    # Captain Hook
    'disney/captain-hook/page-1.png': 'A dramatic pirate ship with black sails sailing through turquoise Neverland waters. Skull flag.',
    'disney/captain-hook/page-2.png': 'A theatrical pirate captain with a big hat, red coat, and a hook for a hand. Dramatic pose on his ship.',
    'disney/captain-hook/page-3.png': 'A green crocodile in the water with a clock visible in its belly — tick tock. The captain hiding in terror.',
    'disney/captain-hook/page-4.png': 'A boy in green flying over a pirate ship, casting a shadow. Mischievous grin, fairy dust trail.',
    'disney/captain-hook/page-5.png': 'A pirate captain excitedly unrolling an old treasure map with an X marked on Skull Island.',
    'disney/captain-hook/page-6.png': 'A boy in green and a pirate captain having a dramatic sword fight on the deck of a ship.',
    'disney/captain-hook/page-7.png': 'Children walking a plank on a pirate ship over sparkling water. A flying boy hovering above.',
    'disney/captain-hook/page-8.png': 'A pirate captain falling off his ship into the water. A crocodile waiting with an open mouth. Comedic.',
    'disney/captain-hook/page-9.png': 'A pirate captain running across the water being chased by a clock-ticking crocodile. Comedic chase.',
    'disney/captain-hook/page-10.png': 'A boy in green and his friends celebrating on the pirate ship. Flying, laughing, Neverland sunset.',
}


def generate(key, desc):
    """Generate one image via curl and save to disk."""
    out_path = os.path.join(PUBLIC, 'images', key)
    if os.path.exists(out_path):
        return 'skip'

    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    is_section = key.startswith('sections/')
    size = '1536x1024' if is_section else '1024x1024'
    prompt = f"{STYLE} {desc}"

    payload = json.dumps({
        "model": "gpt-image-1",
        "prompt": prompt,
        "n": 1,
        "size": size,
        "quality": "high",
    })

    for attempt in range(3):
        try:
            result = subprocess.run([
                'curl', '-s',
                'https://api.openai.com/v1/images/generations',
                '-H', 'Content-Type: application/json',
                '-H', f'Authorization: Bearer {API_KEY}',
                '-d', payload,
                '--max-time', '120',
            ], capture_output=True, text=True, timeout=150)

            data = json.loads(result.stdout)
            if 'error' in data:
                raise Exception(data['error'].get('message', str(data['error'])))

            b64 = data['data'][0].get('b64_json')
            if b64:
                img_bytes = base64.b64decode(b64)
                with open(out_path, 'wb') as f:
                    f.write(img_bytes)
                return f'OK ({len(img_bytes)//1024}KB)'

            raise Exception('No b64_json in response')

        except Exception as e:
            if attempt < 2:
                wait = (attempt + 1) * 5
                print(f'  retry in {wait}s ({e})')
                time.sleep(wait)
            else:
                return f'FAILED: {e}'

    return 'FAILED'


def main():
    # Filter to missing only
    missing = [(k, v) for k, v in PROMPTS.items()
               if not os.path.exists(os.path.join(PUBLIC, 'images', k))]

    print(f'Found {len(missing)} missing images out of {len(PROMPTS)} total\n')
    if not missing:
        print('All images exist!')
        return

    done = 0
    errors = 0

    for i, (key, desc) in enumerate(missing):
        label = f'[{i+1}/{len(missing)}] {key}'
        sys.stdout.write(f'{label} ... ')
        sys.stdout.flush()

        result = generate(key, desc)
        print(result)

        if result.startswith('FAILED'):
            errors += 1
        elif result != 'skip':
            done += 1

        # Small delay between requests
        if i < len(missing) - 1:
            time.sleep(1)

    print(f'\nDone! Generated: {done}, Errors: {errors}')


if __name__ == '__main__':
    main()
