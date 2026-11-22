# MYTHWROUGHT Enchanted Forest — Phase 2 Native Acceptance and Original-Renderer Candidate Gate

**Source-authenticated checkpoint, November 21 2026 (GitHub UTC November 22). All work isolated and draft-only. No merge or deployment.**

## Protected references

- Production `main` verified unchanged at `7016e14cd6289f45eaf7fc6a79a362b47996df65`.
- Previous isolated source checkpoint `ea43945eb17ac26e1f06da3f812a8f5621c54a89` confirmed exact at beginning of continuation.
- Historical M7 (non-prototype) must preserve original tree site roll, original unchanged generator ID, WORLD_MAX_Y=19, original saves and player edits; no global Y change.
- Three actual physical candidate species remain **explicitly opt-in**, source-only, disabled in production gameplay and fail-closed when anyone attempts to `save()` an opted-in M7 world under its historical generator identity.

## Exact-head native Phase 2 SUCCESS

[GitHub Actions #44965659979](https://github.com/hdog960/Mythwrought/actions/runs/44965659979), exact source HEAD `bebdbe7ff74ac59f256735ab3119f202bf81dec7`, job `137033980503`, completed **SUCCESS**. All actual job logs read.

- **8/8** new strict source native tree tests: three distinct immutable Starspire/Moonwillow/Ancient-Giant physical silhouettes, Y19/radius/240-voxel bounds, no clipped canopies, default historical source/tree/save equality, strict in-memory only M7 opt-in, deterministic seam/source-reader parity, original other-biome tree comparison, real six-chunk mesh GPU budget, mineable temporary edits, save fail-closed.
- **19/19** actual repo world/biome/profile/save tests.
- **7/7** retained Phase 1 enchanted grass/caves and moss-pocket tests.
- **34/34 total** native tests, zero failures. An experimental world `save()` attempt is explicitly rejected rather than serializing changes under historical M7.
- Genuine source mesh `meshChunk` across six chunks (seed 7919): historical 963,360 aggregate bytes; opt-in trees 1,010,664 bytes, ratio **1.049**; each chunk obeyed untouched `MAX_CHUNK_UPLOAD_BYTES=8388608`. This is native per-chunk upload/vertex-budget evidence, **not** an iPhone frame timing benchmark.
- Genuine source-only 3-seed site census using current M7 caves/landmarks/terrain and current original 8×8 site rule:
  - 363 potential climate-eligible sites; 254 passed the existing density roll.
  - 61 rejected by hard Y19 ceiling, 4 rejected by genuine multi-root support checks, 2 by physical collision/occupied AIR checks, **174 accepted**.
  - Among those **12 Ancient Giants**, **85 Starspires**, **77 Moonwillows**; they are accepted candidate placements, not player-facing launched worlds.
  - Sample chunks across three seeds: 8,824 historical physical tree voxels vs 15,245 opt-in candidate voxels; zero generated cells above Y19. The increased total physical geometry remains a potential iPhone frame-cost risk despite sample GPU bytes passing.
- Original world `src/main.mjs`, original service worker, saved schema-1 data, all non-enchanted biomes and all automations remained unchanged. The native test succeeded without weakening previous Phase 1 protection.

### Independent authentic artifact

[Artifact 14731942147](https://github.com/hdog960/Mythwrought/actions/runs/44965659979/artifacts/14731942147) downloaded independently from GitHub, ZIP SHA256 **`1c2dda95724bb9877562b464b88715fd215df2dcfcd6bd077e4d22befd7d847a`**, matches GitHub digest. ZIP CRC PASS for genuine JSON `phase2-tree-feasibility.json`, exact `head=bebdbe7ff74ac59f256735ab3119f202bf81dec7` and tree blobs:
- `src/manual-biomes/environment-v7.mjs` blob `f35c10bab419a9fb83816520050a5f1dda13b51d`.
- `src/manual-biomes/enchanted-tree-candidates.mjs` blob `86b91fe467107b0fa28c4770c265caaf0044c731`.

## Next, genuine renderer visual acceptance (pending)

New isolated original-engine comparison script `scripts/ci/enchanted-trees-phase2-instrumented-webgl2.mjs` and independent workflow `.github/workflows/enchanted-forest-phase2-real-webgl2.yml` registered in **[Actions #44972193017](https://github.com/hdog960/Mythwrought/actions/runs/44972193017)**, source commit `69a1e3bcbe199ee222736bab9119eadf278dfd1a`.

- Runner **QUEUED** at registration. Nothing about its screenshots or live GPU/JavaScript status may be claimed PASS until its exact-job logs and downloaded authentic artifact verify them.
- This is a **disposable test-only original game renderer comparison**, NOT an unchanged-source original-game screenshot or installed PWA. Uses true project `index.html`, `src/main.mjs`, WebGL2/Chromium, original `meshChunk`, seed profiles and camera, real block-ID reads.
- The test server temporarily substitutes **one** module response string solely when serving `src/manual-biomes/profile-world.mjs` from localhost. The substitution is `{experimentalEnchantedTrees:this.experimentalEnchantedTrees}` → `{experimentalEnchantedTrees:true}` at the original source tree planner call. It does **not** modify any repo blob or production `src/main.mjs`, does not enable opt-in for user worlds, and changes no source `save()` function. This is a renderer instrument only, *not* a claim about normal M7 behavior. Every source and modified-response SHA256 is recorded in the manifest.
- Compares baseline original source and test-only enabled tree view in distinct fresh ephemeral browser contexts. Scans original M7 source to find genuine naturally eligible instances for **each of 3 named species**. At 932×430 and 844×390, it tests actual game voxel witness IDs, saves unchanged within the transient contexts, 0 page/GPU faults, real loaded chunks, original game camera, PNG dimensions/CRCs and SHA256, distinct real images, and nontrivial before/after visible pixel changes.
- Native source `FourRegionWorld(seed,profile,{experimentalEnchantedTrees:true})` itself remains save-blocked; the instrumented browser does NOT prove durable save compatibility or an actual creator iPhone Home Screen rollout.
- The renderer visual comparison is independent of the already accepted unmodified original-game WebGL2 Phase 1 terrain screenshots (run `44962003550`) and does not replace their evidence.

## Outstanding Phase 2 gates and risks

1. Read full job logs and authentic ZIP/PNG artifacts of `44972193017`. Diagnose only real failures. Do not silently count instrumentation as a shipping game build.
2. Review three species under actual original-game camera for unmistakably distinct silhouettes, oversaturation/understory crowding, leaf clipping and z-buffer artifacts, iPhone-size chunk streaming, player collision/accessibility, and mobile GPU p95. Existing measured six-chunk +4.9% aggregate is **not** a complete mobile performance guarantee.
3. Formal versioned tree-generator migration / save-generation-profile strategy before any default opt-in; retain previously authored edits and old M7 worlds. No historical profile reinterpretation, no user saves modified.
4. Native iPhone 17 Pro Max Home Screen PWA behavior and landscape two-thumb controls are **not** tested by headless Chromium.
5. No alterations to five hourly automations, production main, Codex, other biomes, builders or settlements; no merge or deployment.
