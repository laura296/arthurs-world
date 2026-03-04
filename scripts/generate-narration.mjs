#!/usr/bin/env node
/**
 * Generate narration audio using ElevenLabs Text-to-Speech API.
 *
 * Usage:
 *   node scripts/generate-narration.mjs
 *
 * Environment:
 *   ELEVENLABS_API_KEY  — your ElevenLabs API key (required)
 *   ELEVENLABS_VOICE_ID — voice ID to use (optional, defaults to a warm British female voice)
 *
 * This script reads all story narration texts and generates MP3 files
 * in public/audio/{storyId}/page-{n}.mp3
 *
 * The generated files are then served as static assets and picked up
 * by the StoryBook component automatically.
 */

import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PUBLIC_AUDIO = join(ROOT, 'public', 'audio');

// ─── Story narration texts ───────────────────────────────────────

const stories = {
  'three-pigs': [
    'Once upon a time, three little pigs set off to build their very own houses!',
    'The first little pig built a house of straw. It was quick and easy!',
    'The second little pig built a house of sticks. Tap tap tap!',
    'The third little pig built a house of bricks. Strong and sturdy!',
    'Along came the Big Bad Wolf! He was very hungry.',
    'The wolf went to the straw house. He huffed and he puffed and he blew it down!',
    'The wolf went to the stick house. He huffed and he puffed and he blew it down!',
    'The three little pigs ran to the brick house. The wolf followed!',
    'The wolf huffed and puffed but he could NOT blow the brick house down!',
    'The three little pigs lived happily ever after in their strong brick house!',
  ],
  'goldilocks': [
    'Once upon a time, a little girl called Goldilocks went for a walk in the forest.',
    'She found a little cottage in the woods. Who lives here?',
    'Inside she found three bowls of porridge. Big, medium and small!',
    'Goldilocks ate up all the little bowl of porridge. Yum yum!',
    'Then she found three chairs. Big, medium and small!',
    'Oh no! The little chair broke! CRASH!',
    'Goldilocks felt sleepy. She found three beds upstairs.',
    'She fell fast asleep in the little bed. Zzzzz...',
    "The three bears came home! Who's been eating my porridge?",
    'Goldilocks woke up and ran all the way home! The end!',
  ],
  'red-riding': [
    'Once upon a time, there was a little girl who wore a red hood.',
    "Her mummy gave her a basket of yummy food to take to Grandma's house.",
    'Little Red Riding Hood skipped through the big forest.',
    'She met a silly wolf in the forest. Hello Mr Wolf!',
    "The silly wolf ran ahead to Grandma's house.",
    "The wolf knocked on Grandma's door. Knock knock knock!",
    'The silly wolf dressed up as Grandma. What a funny wolf!',
    'What big eyes you have! What big ears you have!',
    'A friendly woodcutter heard the noise and came to help!',
    'They all had tea and cakes together. Grandma was safe and happy!',
  ],
  'whale-throat': [
    'Once upon a time, there was a very big whale who lived in the deep blue sea.',
    'The whale was SO hungry. He ate all the fish he could find! Gobble gobble!',
    'Soon there was only one tiny clever fish left in the whole sea.',
    'The clever fish said: Why don\'t you eat the man on the raft?',
    'The whale swam and swam to find the man. SPLASH!',
    'The big whale opened his ENORMOUS mouth and swallowed the man whole!',
    'But the clever man had a plan! He built a grating inside the whale!',
    'The whale coughed and spluttered! The grating was stuck in his throat!',
    'The man jumped out and sailed away on his raft. Hooray!',
    'And from that day, the whale could only eat tiny tiny fish. The end!',
  ],
  'camel-hump': [
    'Once upon a time, there was a very lazy camel who lived in the desert.',
    'The horse asked the camel to help. The camel just said HUMPH!',
    'The dog asked the camel to help. The camel just said HUMPH!',
    'The ox asked the camel to help. The camel just said HUMPH!',
    'All the animals had to do extra work because the lazy camel wouldn\'t help!',
    'A magic genie appeared from the desert! Whoooosh!',
    'The genie said: Camel, why won\'t you work? The camel said HUMPH again!',
    'The genie waved his hands and POOF! A big hump grew on the camel\'s back!',
    'Now the camel could carry water in his hump and work for days and days!',
    'And that is how the camel got his hump! The end!',
  ],
  'rhino-skin': [
    'Once upon a time, a man lived on an island. He made the most yummy cake!',
    'A big rhinoceros came along. His skin was smooth and shiny and fitted like a button!',
    'The cheeky rhinoceros ate ALL the man\'s cake! Every last crumb!',
    'The man was very cross! He wanted his yummy cake back!',
    'One very hot day, the rhinoceros took off his smooth skin to go swimming!',
    'The man found the skin on the beach! He had a sneaky idea...',
    'He filled the rhino skin with itchy scratchy cake crumbs! So many crumbs!',
    'The rhinoceros put his skin back on. OH NO! It was SO itchy!',
    'He scratched and scratched and rubbed against trees! His skin got all wrinkly and baggy!',
    'And that is how the rhinoceros got his wrinkly skin! The end!',
  ],
  'leopard-spots': [
    'In the beginning, the leopard was all sandy-yellow, just like the sandy desert where he lived.',
    'The leopard had a friend called Ethiopian. They hunted together every day.',
    'All the animals ran away to a big, dark forest full of stripy, spotty shadows.',
    'The leopard couldn\'t find ANY animals in the forest! They were hidden in the shadows.',
    'A wise baboon said Try going different! So Ethiopian changed his skin to beautiful dark brown.',
    'The Ethiopian said Now YOU need spots to match the forest shadows!',
    'He dipped his fingers in dark paint and pressed them all over the leopard. Press, press, press!',
    'Now the leopard had beautiful spots all over! He looked at himself and said WOW!',
    'With his new spotty coat, the leopard could sneak through the forest shadows. The animals couldn\'t see him!',
    'And that is how the leopard got his beautiful spots! The end!',
  ],
  'elephant-child': [
    'Once upon a time, elephants had short, stubby noses. This little elephant was VERY curious!',
    'He asked everyone questions! What does the crocodile eat for dinner? Nobody would tell him!',
    'His aunty hippo said Go to the river and find out yourself! So off he went on a big adventure.',
    'At the great grey-green river, the little elephant met a crocodile! Hello! said the elephant.',
    'The crocodile whispered Come closer, and I\'ll tell you what I eat for dinner!',
    'SNAP! The crocodile grabbed his nose and pulled and pulled! Let go! cried the elephant.',
    'The elephant pulled back SO hard! His nose stretched and stretched and STRETCHED!',
    'POP! He got free! But his nose was now very, very long! Oh no, my nose! he said.',
    'But wait, his long trunk was AMAZING! He could pick fruit, spray water, and give big hugs!',
    'And that is how elephants got their long trunks! The end!',
  ],
  'old-man-kangaroo': [
    'A long time ago, Kangaroo had four short legs, all the same size. He walked slowly like everyone else.',
    'Kangaroo was a bit boastful. He said I want to be DIFFERENT from all the other animals!',
    'He went to the big god Nqong and said Make me special! Make me famous by five o\'clock today!',
    'Nqong pointed to a big yellow dog called Dingo and said Dingo! Chase that kangaroo!',
    'Dingo chased Kangaroo across the sandy desert! Run, run, run!',
    'Dingo chased him through the tall grasslands! Hop, hop, hop! Kangaroo started jumping to go faster!',
    'Dingo chased him over the rocky mountains! JUMP! JUMP! JUMP! His back legs grew bigger and stronger!',
    'By the time Dingo stopped chasing, Kangaroo\'s back legs were HUGE and his front legs were tiny!',
    'Now Kangaroo could HOP so high and so far! He was the bounciest animal in the whole world!',
    'And that is how the kangaroo got his strong jumping legs! The end!',
  ],
  'armadillos': [
    'Once upon a time, there was a prickly hedgehog and a slow tortoise. They were best friends!',
    'A hungry jaguar came along! He wanted to eat them for dinner!',
    'The hedgehog curled into a prickly ball! Ouch! said the jaguar. Too prickly!',
    'The tortoise hid inside her hard shell! I can\'t bite through that! said the jaguar.',
    'The jaguar\'s mother said If it curls up, it\'s a hedgehog. If it has a shell, it\'s a tortoise.',
    'But clever hedgehog learned to swim like tortoise! And tortoise learned to curl up like hedgehog!',
    'The jaguar was SO confused! Which one is which? I can\'t tell!',
    'They mixed up so much that they turned into something NEW, an armadillo!',
    'The armadillo had a hard shell AND could curl into a ball! The jaguar couldn\'t catch him at all!',
    'And that is how armadillos began! They\'re part hedgehog and part tortoise! The end!',
  ],
  'first-letter': [
    'Once upon a time, a little girl called Taffy went fishing with her daddy by the river.',
    'Oh no! Daddy\'s fishing spear broke! He needed a new one from home.',
    'Taffy had a great idea! She found a piece of bark and drew a picture on it!',
    'She drew Daddy, the broken spear, and their home. It was the very first letter ever!',
    'A stranger came by and Taffy gave him the picture to take to Mummy.',
    'But the stranger didn\'t understand the picture! He thought it meant something different!',
    'He brought ALL the people from the village! Everyone was very confused!',
    'Mummy came too and saw the silly mix-up. Everyone laughed and laughed!',
    'Taffy said Next time, I\'ll draw BETTER pictures so everyone understands!',
    'And that is how the very first letter was written! Now we can all write to each other! The end!',
  ],
  'alphabet-made': [
    'After the funny mix-up with the first letter, Taffy wanted to do BETTER!',
    'She said to Daddy Let\'s make shapes for SOUNDS! Then everyone will understand!',
    'Taffy opened her mouth wide and said AAAH! Daddy drew a mouth shape, that became the letter A!',
    'Then she made a Buh buh sound with her lips. Daddy drew lips together, that became B!',
    'She made a Sssss sound like a snake! Daddy drew a wiggly snake, that became S!',
    'They kept going! Every sound got its own special shape! O was a round mouth saying Ooooh!',
    'Soon they had LOTS of letters! A, B, C, D, E, F, G... so many shapes!',
    'Now Taffy could write WORDS! She wrote her name: T-A-F-F-Y!',
    'She taught all her friends the alphabet. Now everyone could read and write!',
    'And that is how the alphabet was made! Now YOU can learn your letters too! The end!',
  ],
  'crab-sea': [
    'In the very beginning, the Eldest Magician was making the world. He told all the animals to play!',
    'The elephant played at being an elephant. The cow played at being a cow. Everyone was happy!',
    'But one little crab went down to the sea and started playing with the water, splash, splash!',
    'The crab was SO big and strong! When he went IN the water, it rose up high!',
    'When the crab came OUT of the water, it went down low! In and out, up and down!',
    'The Eldest Magician said Who is playing with my sea? The water keeps going up and down!',
    'Little girl Doris said It\'s the big crab, Mr Magician! He\'s making the water go whoosh!',
    'The Magician made the crab small with his magic! Now the crab was tiny!',
    'But the little crab STILL plays with the sea! In and out, in and out, that\'s the TIDES!',
    'And that is why the sea goes up and down every day! The crab is still playing! The end!',
  ],
  'cat-walked': [
    'Once upon a time, all the animals were wild. The wildest of all was the Cat, who walked by himself.',
    'The Woman made a warm cave home. She said to the Dog, Come be my friend!',
    'The Dog said Yes! I\'ll guard the cave! So the Dog became tame and got warm food.',
    'The Horse came too! I\'ll carry things for you! The Horse became tame and got sweet hay.',
    'The Cow came next! I\'ll give you milk! The Cow became tame and got a cosy barn.',
    'But the Cat said I am the Cat who walks by himself! I don\'t need anyone!',
    'Then the Cat heard the Baby crying. He crept in and purred and purred. The Baby smiled!',
    'The Woman said You may come by the fire. But you must catch mice AND purr for the Baby.',
    'The Cat agreed! But he STILL walks by himself whenever he wants. That\'s just how cats are!',
    'And that is why cats sit by the fire but still go out alone! The end!',
  ],
  'butterfly-stamped': [
    'King Solomon was the wisest king in the whole world. He could talk to ALL the animals!',
    'He had a beautiful butterfly friend. But the butterfly liked to show off to his wife!',
    'The butterfly said to his wife I am SO powerful! Watch, if I stamp my foot, the palace will disappear!',
    'His wife laughed! You\'re just a tiny butterfly! You can\'t make a palace disappear!',
    'The butterfly was worried. He\'d been showing off and now he was stuck! He went to ask King Solomon for help.',
    'Kind King Solomon said Don\'t worry little friend! When you stamp, I\'ll use MY magic!',
    'The butterfly stamped his tiny foot, STAMP! And King Solomon made the palace shimmer and shake!',
    'The butterfly\'s wife was AMAZED! Wow! You really ARE powerful! she said.',
    'But the butterfly learned his lesson. It\'s not nice to show off. Being kind is better than being powerful!',
    'And that is the story of the butterfly that stamped! Even tiny creatures can do big things! The end!',
  ],
};

// ─── ElevenLabs API ──────────────────────────────────────────────

const API_KEY = process.env.ELEVENLABS_API_KEY;
// Default: "Charlotte" — warm, clear, British female. Great for children's stories.
// Other good options:
//   "pFZP5JQG7iQjIQuC4Bku" — Lily (warm British)
//   "EXAVITQu4vr4xnSDxMaL" — Sarah (warm American)
//   "jBpfuIE2acCO8z3wKNLl" — Gigi (young, playful)
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'XB0fDUnXU5powFXDhCwa'; // Charlotte

const ELEVENLABS_URL = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;

async function generateAudio(text) {
  const res = await fetch(ELEVENLABS_URL, {
    method: 'POST',
    headers: {
      'xi-api-key': API_KEY,
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg',
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_turbo_v2_5',
      voice_settings: {
        stability: 0.75,
        similarity_boost: 0.75,
        style: 0.4,
        use_speaker_boost: true,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs API error (${res.status}): ${err}`);
  }

  return Buffer.from(await res.arrayBuffer());
}

// ─── Main ────────────────────────────────────────────────────────

async function main() {
  if (!API_KEY) {
    console.error('❌ Set ELEVENLABS_API_KEY environment variable first.');
    console.error('');
    console.error('  Get a free API key at: https://elevenlabs.io');
    console.error('  Then run:');
    console.error('');
    console.error('    ELEVENLABS_API_KEY=your_key_here node scripts/generate-narration.mjs');
    console.error('');
    process.exit(1);
  }

  console.log('🎙️  Generating narration audio with ElevenLabs...');
  console.log(`   Voice ID: ${VOICE_ID}`);
  console.log('');

  let totalGenerated = 0;
  let totalSkipped = 0;

  for (const [storyId, pages] of Object.entries(stories)) {
    const dir = join(PUBLIC_AUDIO, storyId);
    await mkdir(dir, { recursive: true });

    console.log(`📖 ${storyId} (${pages.length} pages)`);

    for (let i = 0; i < pages.length; i++) {
      const filename = `page-${i + 1}.mp3`;
      const filepath = join(dir, filename);

      // Skip if already generated
      if (existsSync(filepath)) {
        console.log(`   ⏭️  page ${i + 1} — already exists, skipping`);
        totalSkipped++;
        continue;
      }

      const text = pages[i];
      console.log(`   🔊 page ${i + 1} — "${text.slice(0, 50)}..."`);

      try {
        const audio = await generateAudio(text);
        await writeFile(filepath, audio);
        totalGenerated++;

        // Small delay to respect rate limits on free tier
        await new Promise(r => setTimeout(r, 500));
      } catch (err) {
        console.error(`   ❌ page ${i + 1} failed: ${err.message}`);
      }
    }

    console.log('');
  }

  console.log('✅ Done!');
  console.log(`   Generated: ${totalGenerated} files`);
  console.log(`   Skipped: ${totalSkipped} files (already existed)`);
  console.log(`   Location: public/audio/`);
  console.log('');
  console.log('The audio will be automatically used by the StoryBook component.');
}

main();
