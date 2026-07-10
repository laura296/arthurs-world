# Arthur's World — App Review & Path to a Sellable Product

*Review date: July 2026. Covers the full codebase (54+ routes, 30+ games, 27 narrated stories) plus asset payload, PWA configuration, and commercial readiness.*

---

## Part 1 — What was broken (and is now fixed)

### 1. "It does not move from level to level" — root cause found

Every levelled game (Shape Match, Bubble Pop, Colour Sort, ABC Adventure,
Xylophone, Counting Garden, Number Line, Animal Sounds) shares
`useLevelProgression`. Completing a level did this:

```js
completeLevel(currentLevel, stars);   // updates highestUnlocked (async)
setLevel(currentLevel + 1);           // guard reads the OLD highestUnlocked
```

React state updates don't apply until the next render, so on a **first
playthrough** the guard `lvl <= highestUnlocked` still saw the old value,
silently refused, and the game froze on the win screen forever. Replays
worked (the level was already unlocked from storage), which made the bug
look random. Verified by driving the real app in a browser: old build
freezes with the spinning stars; fixed build advances straight into level 2.

**Fix:** the hook now mirrors `highestUnlocked` in a ref that updates
synchronously, so the advance is never blocked. One fix repairs all 8 games.

### 2. "The voices are poor" — three separate causes

1. **Worst-possible voice selection on iPad.** When browser text-to-speech
   was used, the fallback picked the *first English voice alphabetically* —
   on iOS that's Apple's novelty voices ("Albert", "Bad News", "Bells"…).
   The picker now scores voices: novelty voices are banned, Enhanced/
   Premium/Natural variants and warm en-GB voices are preferred.
2. **Recorded narration often never played on iPad.** iOS Safari only
   allows audio started directly from a user tap. Stories auto-narrate
   from a timer after the page turns — iOS blocked it, the story opened
   silent, and taps of the 🔊 button were the only voice. Narration now
   routes through a single audio element that is "unlocked" during the
   child's first tap, which iOS then trusts for the rest of the session.
3. **Three Feelings books always used robot TTS.** Their `audioDir` points
   at audio folders that don't exist (`feelings-monster`, `when-i-feel-big`,
   `feelings-friends`), so every page silently fell back to TTS. **Still
   open** — needs ~24 pages of recorded audio (see roadmap).

Note: the 27 stories with recorded MP3s (250 files) were always fine once
they actually played — the silent-start bug above is why they often didn't.

### 3. Other bugs found in the full sweep (fixed)

| Bug | Impact |
|---|---|
| **Fairy Dust froze after round 1** — a stale-state guard meant the round-change reset never re-entered "playing"; no seeds ever spawned again | Game-breaking dead end |
| **Tortoise & Hare: winning had no "Race Again"** (losing did!) | Winning felt more broken than losing |
| **Mad Hatter Tea Party: no replay after the finale** | Dead end after the 5th puzzle |
| **1.1GB of orphaned PNGs shipped in the build** — 403 duplicate originals of the WebP images actually used | Deploys ~4× larger than needed; the same payload class that once crashed the iPad service worker |
| **Offline audio cache capped at 100 entries with 250 narration MP3s** | "Downloaded" stories silently lost their voices offline |
| **"Download for offline" fetched 111MB of video** into iPad Safari's small cache quota | Quota errors, eviction of story narration |
| **Download button said "Ready for offline!" even when up to half the files failed** | Misleading; now only claims success when everything cached |
| **Quiet mode still played ambient drones** (hum/breeze/rain/wind bypassed the mute) | "Quiet" wasn't quiet |

### Still open (minor)

- **PopCritters** dirt-poof particle is dead code (cosmetic only).
- **DisneyHub page is unreachable** dead code — remove or wire up (moot; see Part 2, IP).
- **AngerCoolDown** has an unreachable fail state (dead code, not player-facing).

---

## Part 2 — The path to a sellable app

### ⚠️ First, the blocker: third-party IP must go

This is the most important commercial fact about the current app.
**A sellable app cannot contain:**

- **Disney characters and films**: Hades, Ursula, Stitch, Inside Out,
  Captain Hook/Peter Pan, Snow White, Cinderella, Frozen ("Let It Go"
  video), Winnie the Pooh (Disney's design), Disney's Alice styling.
  Disney enforces aggressively; Apple/Google reject on IP grounds too.
- **The nursery-rhyme videos** (`baby-shark.mp4` etc.) — Baby Shark is
  Pinkfong's; the other videos' provenance is unknown and almost
  certainly not licensed for redistribution.

**Safe to keep:** Kipling's Just So Stories, Aesop's fables, classic fairy
tales (Goldilocks, Three Pigs, Red Riding Hood — the *stories*, with your
own art), and everything original (Arthur Bear, Hazel, Pip, Ellie, all the
original games).

**Recommended move:** re-theme the Disney games onto original characters —
the *mechanics* are yours and they're good. "Ursula's potions" becomes a
friendly woods-witch brewing game; "Hades' River Styx" becomes a firefly-
catching night game; Inside Out's emotions hub becomes Arthur's own
feelings corner (pairs beautifully with the Feelings books). Replace videos
with original animation or drop the section.

### 1. Voices: record once, ship everywhere (fixes "poor voices" for good)

Browser TTS should never be the product voice — it's now a *decent*
fallback, but the sellable answer is recorded audio for everything:

- **Pick one narrator voice** (a warm British female voice suits the
  existing recordings) and generate every page + character line through
  ElevenLabs or a similar service (~£5–20/month tier covers the whole
  library; a human voice actor is the premium option later).
- **Coverage needed:** the 3 Feelings books (24 pages), every
  `character-speak` and `tap-sound` speech bubble in the storybook engine
  (currently always TTS), game instructions/encouragement ("Well done!",
  "Find the red one!") — pre-literate children need voice, not text.
- The storybook engine already prefers MP3 over TTS per page, so new
  audio drops straight in: `public/audio/{story-id}/page-{n}.mp3`.
- Extend the same pattern to speech bubbles: add optional `audio` fields
  to interaction data, falling back to TTS only in development.

### 2. Package for the App Store (where children's apps are actually bought)

A PWA on GitHub Pages can't be sold. Parents buy children's apps on the
App Store/Play Store, and iPad is your target device anyway.

- **Capacitor** wraps the existing React app with minimal change and gives
  you offline bundling for free (no more 233MB download button — assets
  ship inside the app).
- **Apple Kids Category** requirements to design for now:
  no third-party ads/analytics, a **parental gate** in front of any
  external link or purchase, a privacy policy, COPPA/GDPR-K compliance
  (collect nothing — the current app already stores everything locally,
  which is the right instinct; keep it that way).
- Ship the web PWA as the free demo; the store app is the paid product.

### 3. Business model

- **Paid up-front (£3.99–£7.99)** is the honest, parent-friendly model and
  fits a hand-crafted app. Alternatively free with a one-time "unlock
  everything" purchase behind a parental gate (lets parents try 5–6 games
  first — usually converts better).
- **No ads, no subscriptions, no consumables** — this is both a selling
  point ("made by a parent, nothing to trick your child into tapping")
  and required positioning for the Kids Category.
- Trademark check the name before investing in branding ("Arthur" collides
  with the PBS aardvark brand in the children's space — "Arthur Bear's
  World" or a rename may be safer; get a quick legal opinion).

### 4. Product polish that sells (in priority order)

1. **Consistent art direction.** The strongest games already have it; the
   CLAUDE.md Midjourney/WebP pipeline is the right plan — finish migrating
   the CSS-gradient games so screenshots look like one product.
2. **Session shape for a 3-year-old:** a gentle "all done" moment after
   ~20 minutes (parents love time-boxing), and a parent corner (behind a
   gate) with progress stars per game.
3. **Real-device QA loop.** The level bug survived because it only appears
   on first playthrough. Add a Playwright smoke suite (one exists now in
   scratch form: complete level 1 → assert level 2 starts; open each route
   → assert no crash) and run it in CI on every push.
4. **Error visibility.** A tiny local error logger (screen + localStorage,
   no network) so testing on the actual iPad surfaces crashes.
5. **Performance guardrails** you already follow — keep the 8MB workbox
   cap, WebP everywhere, and the new build-time check ideas (no PNG with a
   WebP sibling) to stop the 1.1GB regression class.

### 5. Suggested order of work

| Phase | What | Outcome |
|---|---|---|
| 1 (done) | Fix progression freezes, silent narration, voice picking, payload | App works for Arthur |
| 2 | Record missing audio; voice the speech bubbles; re-theme Disney games; drop videos | App is *yours* and sounds professional |
| 3 | Capacitor wrap, parental gate, privacy policy, Kids Category compliance | Submittable |
| 4 | Art consistency pass, parent corner, CI smoke tests | Sellable & maintainable |
| 5 | Store listing (screenshots, preview video), soft launch UK, gather reviews | Launched |

---

*Everything in Part 1 marked as fixed was verified by driving the built app
in a browser (fresh-profile first playthrough, story narration flow, quiet
mode, and an A/B against the pre-fix build). TTS voice quality and the
first-tap audio unlock still deserve a hands-on check on a real iPad —
browser automation can't hear.*
