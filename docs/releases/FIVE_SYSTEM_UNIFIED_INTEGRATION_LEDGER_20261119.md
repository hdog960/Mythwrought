# Five-System Unified Home Screen Release — Protected Integration Ledger

Master issue: #283. **This is a draft, unpublished integration candidate. Do not merge or deploy without fresh explicit creator permission.**

## Verified starting point (2026-11-19)
- Production main: `64245c76a9e265f17bf387e3fd209bbfc9f6d950`.
- Existing V6 source and recorder entered production via merged #281 and #278 respectively. Do not replace with older PRs.
- Cave source: #243 `00edfc0276a4ee9ec43eb9fbe22fa944b278e58b` (source issue #240). Current exact-head physical native and offline green; live WebGL2 **fails** at Rift Terraces deep sky leak, and V6 browser **fails** at video height 368.
- Sky: #277 `401fd9c04d3277d3f1dad928398d749b8db69a56` (original protected #269). Most exact-head checks green; 3-resolution physical walks pending at audit.
- PWA repair: #282 `391a52ecf4029154df5e6d9b42998565a6bff1d3`; same-install recovery and other gates pending at audit. Recorder already in main.
- Mob foundation: #274 `3640979523b924bc4d5be09668890fc19c816c72`; 40-roster branch #280 `d4f033fecaff2bc0f4eeb5df17d0a98a4fd14326`. #280 is stacked atop #274; standalone staging success is not in-game acceptance.

## Import strategy (no branch overwrites)
1. Use the **verified production head** as the only integration base.
2. Derive immutable Git blob source provenance for every added source module.
3. Preserve existing main versions of `src/main.mjs`, `index.html`, `sw-m5.js`, and acceptance runners until manually reconciled.
4. Integrate additive sky modules, cave voxel/runtime producers, and combined mob foundation/roster modules using source-exact copies; never import #280 without its #274 ancestry.
5. Add the host wiring only after inspecting actual production interfaces: V6 biome queries, chunk/voxel collision, render scheduling, world saves, camera, controls, PWA, and video recorder.
6. Patch only proven source defects; maintain all inherited tests unchanged unless tests themselves contain a demonstrated source-independent mistake (document before any change).
7. Produce one final offline import-graph manifest; test *in-place* original PWA updates under old cache-first workers, no uninstall/storage clear.
8. Keep this PR draft, report exact-head test evidence, and request distinct creator release approval before merging.

## Shared-file conflict ledger
| Files | Owners | Resolution rule |
|---|---|---|
| `src/main.mjs` | main V6+REC, Caves, Sky, PWA | hand-reconcile on current main; never overwrite |
| `index.html` | Caves, Sky, PWA | retain REC and original PWA UI; reconcile additions |
| `sw-m5.js` | current production, Sky, PWA | safe update + final import graph |
| `scripts/ci/manual-biomes-m5-offline-pwa-webgl2.mjs` | Sky, PWA | reconcile physical offline and upgrade tests |
| `scripts/ci/manual-v6-live-webgl2.mjs` | Sky, PWA | preserve strict V6/REC checks |
| Mob `src/mobs/*` | #274 foundation / #280 roster | inherit the cumulative #280 tree where owned by both |
| `src/gpu-pipeline.mjs` | Sky and current production | inspect and retain depth/five-pack contracts |

## Strict completion criteria
- All five systems present in **one original Home Screen game**; all 40 mobs registered and interact in real voxel gameplay.
- Native, all 12 CI contracts, full 20-script real Chromium/WebGL2 suite, inherited five-system and depth/pack checks on final **same head**.
- Real 3s/10s decodable video and authentic multi-resolution PNG evidence; screen capture and in-game interaction.
- Old-world byte-preservation, Schema-1 saves, no migration; offline cold load and original Home Screen same-install worker update.
- FPS/p50/p95, GPU memory, per-chunk budgets, physical collision and creature counts verified.
- Final source matrix/sha/ZIP/dimensions and creator-controlled iPhone acceptance.

## Active blockers
- Caves current-head #44613455584: secondary Rift Terraces source-world sky leak, 586 pixels at 667x375.
- Caves current-head #44613455463: WebGL2 + recorder compatibility unexpected video resolution (actual 368).
- Sky exact-head real walk #44613037494 in progress at initial audit.
- PWA exact-head same-install recovery #44614136659 queued at initial audit.
- No five-way exact-head integration acceptance yet.

**Status:** Phase 1 staging, release **BLOCKED**. Do not treat this ledger as approval to publish.
