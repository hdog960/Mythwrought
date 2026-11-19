# Mob Foundation verification

## Run the isolated preview

From the repository root, run:

```sh
python3 -m http.server 4176 --bind 127.0.0.1
```

Open `http://127.0.0.1:4176/mob-preview/` and select a creature. The preview
uses an in-memory seeded voxel world with disposable fixtures. It shares
production terrain, shape and collision definitions. The controls belong to
this preview and the production game entry point remains unchanged.

- **Deer**. Approach, watch the deer flee and go around the clearing's geometry,
  then step away and observe it calm down.
- **Goblin**. Open the approved test door, start an encounter, watch for the
  change in pose during windup and check target health. Leave and watch the
  Goblin disengage and return to its territory.
- **Glownewt**. Move nearby and befriend it. Move the guide, select Stay and
  move the guide again. Select Follow, simulate an injury, move nearby and use
  Rescue after the inactivity window. Switching preview tabs retains the bond
  and entity ID for the session.

## Run automated verification

```sh
node --test tests/mobs/*.test.mjs
npm install --no-save --no-audit --no-fund playwright@1.58.2 pngjs@7.0.0
npx playwright install chromium
MOB_EVIDENCE=/path/to/evidence node tests/mobs/browser.mjs
```

The browser script expects the local preview server to be running. Set
`CHROMIUM_PATH` to use an installed Chromium executable. With the tracked
preview source committed, the default run captures eight PNGs per viewport
at 667×375, 844×390, 932×430 and 956×440. `manifest.json` records the source
SHA, camera framing measured by a fixed-camera comparison with the creature
hidden, dimensions, PNG hashes, WebGL state, and scenario assertions.
It also records a context-loss/restore test, explicit GPU teardown, and a
same-camera no-mob and 16-active/8-dormant stress comparison. SwiftShader
software rendering, frame scheduling, and coarse JavaScript timing limit
comparisons with phone hardware. The isolated Mob Foundation Actions job
collects the same evidence from the draft PR head and uploads it for review.

The existing production check is `npm test` and the 20 Chromium scripts
listed in `.github/workflows/ci.yml`. In a low-core environment the Pack 2
producer and the G2B consumer require separate Node workers to overlap:

```sh
node --test --test-concurrency=2 tests/pack2-live-webgl.test.mjs tests/creative-integration-g2b.test.mjs
```

The original production baseline ran 925 tests with a G2B prerequisite
timing failure. Keep the full run, the paired rerun, and the preview results
distinct when reporting verification. Review the exact branch diff before
a draft PR. A test failure or missing required gate keeps publication blocked.

## Creator-owned physical iPhone checks

Record model, operating system, mode, source SHA, playback duration and
observations. Use a disposable seed or a backup export for save checks.

1. Open a creator-controlled HTTPS staging build on iPhone in landscape Safari.
   Check both landscape rotations, safe-area insets, legibility, model framing,
   and touch reachability. Repeat in Home Screen mode when hosted through the
   intended app shell.
2. Run all three preview scenarios. Check that movement stays grounded around
   slabs and doors and that Goblin windup, target loss, and Glownewt downing and
   rescue remain readable without relying on the diagnostics.
3. Run an extended session with repeated encounters and a representative
   population. Sample frame stability, heat, memory pressure and recovery
   after backgrounding with a device performance trace if available.
4. Check the separate production entrance on the same staging origin. Exercise
   both landscape thumb pads concurrently, block edits, reload, export/import,
   and recovery after network loss. Check the preview and production game
   separately for offline behavior. The standalone preview adds no service
   worker or precache dependencies. Reopening an uncached preview offline
   can fail until a later PWA integration is approved.
5. Compare the original seed bytes and exported edits before and after using
   the preview. Recheck the original Home Screen save slot and restore from
   the disposable backup only through existing production controls.

## Remaining integration work

The registry defines 40 species. Deer, Goblin and Glownewt have playable preview
models and behaviors. The other 37 still need implementations, models,
animations, tuning and acceptance evidence. Swimming, flight, climbing,
jumping and crawling are registry capability contracts. Full breeding and
mounted travel remain deferred. Habitat and object observations in the preview
are fixture-owned. Production needs reviewed streamed residency and terrain
revision wiring, world profile authority, an approved object interface,
a mob draw pass and UI, and an independently versioned persistence design.
A future companion reunion should reactivate a retained identity when its
original area is resident or route it through valid space to a reachable reunion
point. Session teardown currently ends the in-memory preview. It creates no
persistent companion storage.
