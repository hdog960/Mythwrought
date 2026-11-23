# MYTHWROUGHT — Enchanted Forest Phase 2: Original M7 Physics States, Real Climate Corridors and Seed -88 Standing Gap

**Isolated source-only engineering checkpoint. November 22, 2026 local / November 23 UTC. This is neither a release nor physical iPhone/PWA acceptance.**

## Exact protected starting state and source identity

- Original working branch `research/enchanted-p2-physical-root-safety-20261121`, entry HEAD `da7cf27fd42e654071e7801fe9b1920adc770735`. The required preceding handoff `docs/enchanted-forest/PHASE2_ORIGINAL_STEPPLAYER_ADMITTED_ROUTES_20261122.md` was read first (Git blob `3d1b308ce0da51a2925f36e6c7d4ae9429431124`).
- Production `main` confirmed `7016e14cd6289f45eaf7fc6a79a362b47996df65`; protected parent `dev/enchanted-forest-overhaul-20261121-phase0` confirmed `db8cad02387050579c75cbdcdea3e94a9f6d6bee`. Neither was touched.
- Accepted original geometric helper `src/manual-biomes/enchanted-original-pedestrian-search.mjs` Git blob `49fa84146656d895638126c7766675188a13fa80` remains unchanged and is authenticated by isolated workflow.
- Changed **research-only** `src/manual-biomes/enchanted-original-physics-route.mjs`, exact final Git blob **`9658a21e6b3a85f395db43bc73b2d2043bcb8f9e`**. Original `stepPlayer`, original world generator, cave/landmark source, terrain, player saves, existing trees and rendering were NOT modified. No integration into production/PWA.
- New source-native tests `tests/manual-biomes/enchanted-original-physics-arrival-state-real-m7.test.mjs` (Git blob `7fcf5943535803c9d0cea5bb81116f310a2792f8`) and `tests/manual-biomes/enchanted-original-physics-corridor-real-m7.test.mjs` (Git blob `6f20703cffe1af445c31f0637e95069b58b77304`), and changed isolated `.github/workflows/enchanted-phase2-physical-native.yml`. One documentation checkpoint.

## Substantive source engineering

### 1. Explicitly bounded alternative physics-state arrivals

The previous physically admitted original M7 source BFS recorded only the first arrival to each ground `x,z`. That discards a later arrival to the **same cell with different genuine incoming momentum**. The new optional `maxArrivalsPerCell:2` permits at most two distinct original `stepPlayer`-successful incoming headings per cell. Each queued node holds its own real player position, feet, velocity, onGround/coyote/jump state, and uninterrupted parent chain. No teleport, state merge, velocity reset, or synthetic source. The original single-arrival option is **still the default (`maxArrivalsPerCell:1`)** and exact source output equality was validated. Invalid capacity values are rejected.

All hard per-search limits remain intact: original source radius<=16, visits<=192, path steps<=24, accepted routes<=3, actual stepPlayer attempts<=512, total genuine 25ms physics ticks<=8192, and<=48 ticks per attempted edge. Arrival slots are recorded **only after real original player physics reaches the next supported original-source standing cell**, and the source still checks original ground, AIR/headroom, slope, collision and diagonal corners. All accepted routes undergo independent real original-M7 replay before any optional candidate comparison.

### 2. Optional original-biome-directed **FIFO corridor**, not priority search

An experimental read-only search option `corridor:{direction:'west'|'east'|'north'|'south',width:1..12,backtrack:0..4}` restricts which original standing-source *neighbors are considered*, based on an actual V6 warped-biome boundary direction. It **does not reorder the FIFO queue**, apply an A* heuristic or invent traversable ground. It prevents the bounded research search from exhausting its budget in unrelated directions, and all admitted edges still execute unchanged original `stepPlayer`. The option defaults to null and does not affect previous accepted default results.

Tests use actual `v6BiomeAt` to locate Plains/Desert boundary direction and real `originalM7PedestrianCap` to admit source-ground start cells, rather than guessing that a coordinate has a given biome.

## Three focused original-repository native Actions — exact evidence

### [#45109852257](https://github.com/hdog960/Mythwrought/actions/runs/45109852257)

- Exact tested source commit `a6ae220f20f7024aa3b2aa5e472345fbbc1f9815`; genuine Node22 native **9/9 PASS, 0 fail** across the changed physics-state source and earlier directly affected original walking tests.
- Original seed7919 **single-arrival default was exactly unchanged**: 3 actual Enchanted→Desert routes, 82 visited, 1,528 original physics ticks.
- Two-arrival mode admitted **269 alternate physically successful arrival states** across the three existing true Enchanted→Desert source starts and completed **nine historical/experimental route replay checks** (some routes share endpoints; do **not** claim nine novel unique destinations). All candidate replays succeeded.
- Extended physically admitted source seed -88, five real historically grounded starts `[-266,-588]`, `[-264,-592]`, `[252,-600]`, `[250,-596]`, `[-266,-584]`: **530 alternate state admissions** across five bounded 160-visit searches, and **zero real original Enchanted→Plains crossing proposals**. All five used the full 160-visit budget. This is not an impassability proof.
- Cave original reader/opt-in reader provenance checked **6,615 nearby original-world voxel samples** across seeds 179,7919,-88, with **zero cave overrides in those exact source neighborhoods**. This is NOT a cave-mouth walking proof or global cave audit.

### [#45110157768](https://github.com/hdog960/Mythwrought/actions/runs/45110157768)

- Exact tested source commit `8689d6399a3cc2651e78f29b67955a063d48fe8f`; changed-source original Node22 native **8/8 PASS, 0 fail**.
- Explicit FIFO Enchanted→Desert physical corridor, seed7919 starting `[225,-592]`: **3 genuine original/experimental matched physics routes**, including `[229,-595]` 50/50 ticks, `[229,-596]` 54/54 ticks, and `[230,-592]` 47/47 ticks. Original classifier confirms starts are Enchanted, endpoints Desert. Corridor discarded 27 irrelevant neighbor candidates, explored 64 original physical states, admitted all three without truncation.
- Five seed -88 source-correct corridors aimed west from x≈-266 and east from x≈250–252; the original real Plains biome begins **9–10 x-blocks** farther along those sampled latitudes. Across the five bounded source paths: only **98** original physically visited states total, **181** irrelevant candidate neighbors rejected, **zero** target Plains states visited and **zero** genuine original M7 route found. Each local physically connected search exhausted its available admitted nodes without hitting its 192-visit budget. Do NOT claim a world-wide barrier or a candidate-tree defect.

### [#45110354373](https://github.com/hdog960/Mythwrought/actions/runs/45110354373)

- Exact focused test commit `ffc99a77efa58f5f885d460dae0bc0d0a82c123d`, with **unchanged tested original physics-route source from #45110157768**. One **NEW** source-near original seed -88 standing survey only: **1/1 PASS, 0 fail**. The previously accepted 8 tests were **not** rerun.
- The survey independently follows real warped V6 latitude rows on both sides of seed -88's Enchanted↔Plains border. It considers source positions only **1–4 blocks from the real Plains boundary**, across seven negative-X and six positive-X sampled latitude rows.
- **52 actual original M7 source standing positions** examined; **0 satisfied the original complete standing-ground/headroom/collision admission**. Negative-X site: 28 checked / 28 rejected; positive-X: 24/24 rejected. The experimental tree pipeline was not involved in this original-source rejection. Because there were **zero original valid standing starts** in this sampled near-boundary grid, **zero physical searches were launched from those positions** (correct fail-closed behavior).
- Crucial limitation: `originalM7PedestrianCap` rejects positions for several possible genuine source reasons (missing terrain cap, original headroom AIR, original whole-body collision or missing physical ground contact). This test has **not yet differentiated the rejection causes**. Do not assert that all 52 are cliffs, caves, or blocked everywhere; do not alter original terrain to force entry.

## Source and release protection

- Original M7 historical generator identity and default tree profile unchanged. Experimental trees are still disabled by default and **cannot be saved as historical M7 schema-1 worlds**. Tests call historical `save()` and confirm the original schema-1 shape; experimental `save()` fails closed.
- The optional arrival-state and search corridor helpers are **research-only and are not wired to the live browser**, so they neither change world visuals nor justify another Chromium/WebGL2 screenshot suite.
- Existing authentic 288-chunk exact tree voxel source, 1024-entry bounded canopy cache, 128-entry immutable site classification cache, original physical walking, six-chunk GPU budget and Moonwillow original-engine matched WebGL2 evidence remain accepted for unchanged source.
- GLOBAL REDUCE REDUNDANT TESTING: **Executed exactly three narrowly scoped native Actions** to validate changed source and newly added source-ground research, each successful (9/9, 8/8, 1/1). Reused previously verified exact-commit results, and avoided broad CI, redundant screenshot captures, repeat unchanged tests in the final run, unrelated developer checks, merges, deployments, cancellation and shared infrastructure changes.
- Production main and protected parent remain unchanged. All other developer branches, five hourly automations, Codex, builders, settlements, cave/other-biome source, user saves and installed iPhone PWA remain untouched.

## Outstanding and recommended next original engineering

1. **Diagnose source-standing rejection at the actual seed -88 Enchanted/Plains transition**, preserving original terrain. For each of the 52 bounded near-edge positions, distinguish missing authoritative terrain cap, true cave/landmark AIR, upper/headroom occlusion, standing-body collider, or lack of physical support. Do not assume the fix is the candidate tree or relax real player physics.
2. Search authentic original M7 cave-mouth/landmark-adjacent known geometry, then require uninterrupted `stepPlayer` traversal before any cave entrance claim. Nearby 6,615 above-ground cave source probes did not yet find relevant cave geometry.
3. Physical iPhone 17 Pro Max **installed Home Screen PWA** gameplay FPS/frame-p95, resident GPU and JS heap, streaming/thermal acceptance and separately authorized generator version/save migration are **unmeasured/unapproved**. No production enabling of experimental trees until these gates are satisfied.

**Research conclusion:** The isolated original M7 physics search now safely supports at most two actual alternate arrival headings per cell and optional source-biome-aligned FIFO corridor exploration. All 18 focused native tests passed across three exact source checkpoints; none supports a claim of an admitted seed -88 Plains or cave-mouth walk. The near-boundary source cap is the next concrete original-world obstacle to investigate.
