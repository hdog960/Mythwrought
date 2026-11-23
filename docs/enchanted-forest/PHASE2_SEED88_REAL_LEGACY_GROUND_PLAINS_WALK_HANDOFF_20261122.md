# MYTHWROUGHT — Enchanted Forest Phase 2: Source-Authentic Seed -88 Enchanted–Plains Walking Breakthrough

**Research-only isolated checkpoint: November 22 local / November 23, 2026 UTC. NOT production, a generator-version migration, a deployment, an iPhone/PWA performance result or a claim about cave-mouth traversal.**

## Exact protected and initial refs

- Isolated branch `research/enchanted-p2-physical-root-safety-20261121` entry HEAD `0ffe90bb2b927a534a3d6d799c02c60d2d157b81`.
- Required exact source handoff `docs/enchanted-forest/PHASE2_SEED88_ORIGINAL_GROUND_ADMISSION_AND_PHYSICS_STATES_20261122.md` was read first (Git blob `2fa07d1db2c20f10910fda9dd0fb035c5e944688`).
- Protected production `main` independently verified `7016e14cd6289f45eaf7fc6a79a362b47996df65`; protected parent `dev/enchanted-forest-overhaul-20261121-phase0` verified `db8cad02387050579c75cbdcdea3e94a9f6d6bee`.
- Preexisting accepted source-only geometric helper `src/manual-biomes/enchanted-original-pedestrian-search.mjs` remains **byte-for-byte unchanged** Git blob `49fa84146656d895638126c7766675188a13fa80`. No modification to `src/voxel.mjs`, `src/physics.mjs`, `src/manual-biomes/profile-world.mjs`, `src/manual-biomes/environment-v7.mjs`, caves, biomes, player, saves, renderer, `src/main.mjs`, PWA or other developers.
- Final research diagnostic source `src/manual-biomes/enchanted-original-standing-diagnostic.mjs` exact Git blob `f9c9b7fc300cf9ea3a04d2cf54fecb3ce1ee8fb7`.
- Final separate read-only physics route helper `src/manual-biomes/enchanted-original-physics-route.mjs` exact Git blob `21f368cc0532a124e7d2ba0f3e55548386c2682f`. Its prior default original overlay admission, bounded FIFO, optional max two physically successful incoming-heading states, and optional biome-grounded corridor remain intact. The new `groundMode:'physical'` must be explicitly selected and is NOT wired into gameplay.
- Native test source `tests/manual-biomes/enchanted-original-standing-diagnostic-real-m7.test.mjs` blob `5fc409e2fd326dc245bf331bdc0be1679bc39695`; `tests/manual-biomes/enchanted-original-physical-ground-crossing-real-m7.test.mjs` blob `49ceababe3ea120c258c38977ca53803b7fba990`.

## Root cause — corrected previous source-ground interpretation

The earlier source-near seed -88 survey concluded correctly that **52/52 sampled positions failed the existing research-only `originalM7PedestrianCap` admission**. It did **not** establish that these positions lacked physical original terrain.

The accepted older helper requires a nonempty `world._columnPlan(x,z)` environmental-overlay Map before it examines historical ground. The actual original M7 `planEnvironmentalColumn` can intentionally return an empty Map where the biome shoulder has no changes to author, or fail-closed protected-source policy writes nothing. **A missing environmental overlay is not missing physical original terrain.** At these seed -88 Enchanted/Plains edges, the original legacy VoxelWorld still has real GRASS blocks under original player positions.

New read-only `diagnoseOriginalM7Standing` reproduces every prior old-helper rejection guard in exact order, then separately probes actual original `world.get` legacy terrain with the unchanged real `collides`/ground-contact checks. It is restricted to historic M7, not the experimental world.

**Original source-native diagnosis:** 52 original near-boundary positions across 13 sampled latitude rows and both X signs:
- **52/52 original `_columnPlan` Map sizes = 0; all 52 rejected by the original research helper exclusively at its `if (!col?.size) return null` prerequisite.** No other rejection reason was reached.
- **52/52 original real GRASS (material ID 1)** at `terrainHeight`, **52/52 true full original-body clearance**, **52/52 genuine ground probe**, supported original feet 5–7.
- **0** original cave overrides at the actual tested support cells. This is a local source fact, not a full cave study.
- Negative-X sample: 28/28; positive-X: 24/24; source coordinates and each reason/material/ground probe logged individually by focused native Actions.
- **Interpretation:** The older research helper was too conservative at an unchanged original terrain shoulder. No game-world terrain/biome/cave defect was established, so none was changed.

## Isolated safe accessor and real original physical paths

New exported `originalM7PhysicalGroundCap(world,x,z)` is a **separate optional source-authentic accessor**:
- If the M7 environmental overlay is nonempty, it delegates **exactly** to the previously accepted conservative `originalM7PedestrianCap`; it may not bypass a failed authored overlay, cave or landmark veto.
- If the overlay is empty, it reads the **actual original legacy `terrainHeight` and `world.get` source**, requires original `_environmentBaseline` solid surface and two genuine authored AIR headroom cells (no cave/landmark overwrite), original `collides` free real player body and original support probe. It returns the genuine physical `{x,z,surface,feet}` only on all those conditions.
- The isolated physics-admitted BFS and full replay support `groundMode:'physical'` **only by explicit opt-in**. Every original physics edge still runs the unchanged `stepPlayer`, preserves real momentum and respects the same hard original research budgets; historical default `groundMode:'overlay'` behavior is not changed. Experimental worlds independently replay the same actual historical physical paths.
- This does not author terrain, build a bridge, make caves solid, move the avatar, change existing editable blocks or migrate a schema-1 world.

### Verified seed -88 Enchanted → Plains routes — ten authentic physical replay witnesses

Source-authentic **original M7** and opt-in prototype worlds both completed these real paths, with equal physics ticks and continuous player state, no fabricated floor or inter-leg teleport.

**Negative-X boundary**: [focused Actions #45114104400](https://github.com/hdog960/Mythwrought/actions/runs/45114104400), exact native source commit `c1c25024765d89712bf789db830642c9d0ae7d22`, **2/2 PASS**, covering 52 real original-source physical cells and six source-grounded paths:

| Original start | Genuine Plains end | Legs | Original / candidate stepPlayer ticks |
|---|---|---:|---:|
| `[-273,-588]` | `[-275,-588]` | 2 | 19 / 19 |
| `[-273,-588]` | `[-275,-587]` | 2 | 23 / 23 |
| `[-272,-588]` | `[-275,-588]` | 3 | 28 / 28 |
| `[-272,-588]` | `[-275,-587]` | 3 | 32 / 32 |
| `[-271,-588]` | `[-274,-591]` | 3 | 40 / 40 |
| `[-271,-588]` | `[-275,-588]` | 4 | 38 / 38 |

**Positive-X boundary**: [focused Actions #45114256380](https://github.com/hdog960/Mythwrought/actions/runs/45114256380), exact native source/test commit `1a4a3c41e3e67dfd5df30b3c7948874f5af5539e`, **2/2 PASS**:

| Original start | Genuine Plains end | Legs | Original / candidate stepPlayer ticks |
|---|---|---:|---:|
| `[260,-600]` | `[262,-600]` | 2 | 19 / 19 |
| `[260,-600]` | `[262,-599]` | 2 | 23 / 23 |
| `[259,-600]` | `[261,-598]` | 2 | 27 / 27 |
| `[259,-600]` | `[262,-600]` | 3 | 28 / 28 |

Also in the second job, the established seed7919 original **Enchanted → Desert** search returned exactly **three** prior accepted default `groundMode:'overlay'` routes, **82** visits and **1,528** original physics ticks. Explicit overlay mode output was structurally identical to omitted/default mode; the new research option does not affect known historic behavior.

## Original user-edit and source-cave protections

A final targeted [Actions #45114381719](https://github.com/hdog960/Mythwrought/actions/runs/45114381719), exact test/workflow source commit `4381c4e6cdb075a4b2d28cf9c0f212a7abc3948d`, **1/1 PASS**, exercised two separate **disposable** authentic M7 worlds at `[-273,-588]`:
- Real original `world.set` mines the GRASS support to AIR; physical-ground accessor returns **null**, not invented support.
- Independent real original `world.set` places STONE in player headroom; the accessor returns **null**, not an override of occupied original terrain.
- A third unchanged seed world remained physically supported and returned exact original schema-1 empty saved-world shape. These are local detached test edits only; no user save or production world was altered.

The broader prior local audit over 6,615 sample original-cave source cells had zero cave overrides near earlier walking positions; this checkpoint verified no cave override at the 52 real legacy support cells. **Neither fact proves an actually traversed cave mouth**, which remains a separate explicit research gate.

## Native CI and honest test recovery

- First [Actions #45113787441](https://github.com/hdog960/Mythwrought/actions/runs/45113787441) failed **1/2**, because the new diagnostic correctly refuses experimental-world inputs but the test mistakenly invoked it on a candidate world. Certified original-walking reference checks passed. Corrected the test to compare independent original `_columnPlan` data from the candidate without weakening the historical-only diagnostic.
- Repaired changed-test-only [Actions #45113899041](https://github.com/hdog960/Mythwrought/actions/runs/45113899041) **1/1 PASS**, exact commit `5a61c31f57d0b7489f3c9bd6d05f74c396d5c7af`; identified the full 52/52 original empty-overlay false-negative reason and 52/52 actual legacy grass/support.
- New original-source physical-ground crossing [#45114104400](https://github.com/hdog960/Mythwrought/actions/runs/45114104400) **2/2 PASS**.
- New opposite-side and old-default invariant [#45114256380](https://github.com/hdog960/Mythwrought/actions/runs/45114256380) **2/2 PASS**.
- New changed-only authoritative AIR and headroom player-edit veto [#45114381719](https://github.com/hdog960/Mythwrought/actions/runs/45114381719) **1/1 PASS**.
- Previously verified native #45109852257 (9/9), #45110157768 (8/8), #45110354373 (1/1), matched original-engine Moonwillow WebGL2 #45057456018, historical tree and GPU checks were **reused**, not redundantly executed on unchanged production source. No Chromium, broad test suites or other developers' jobs were touched.
- The working changes remain only on the isolated child branch, with one child workflow edited to run focused tests. **No merge, deployment, CI cancellation, save mutation, PWA change, gameplay world write, protected-ref move, settlement, cave, other-biome or five-automation interference.**

## Outstanding gates and next recommended task

1. Establish a **longer original `stepPlayer` connected route** across these newly verified Enchanted–Plains boundaries, ideally including authentic mixed overlay/legacy source transitions, multiple ground-height differences and 16-block chunk seams. Ten 2–4-leg routes are genuine, but not a long-distance crossing or cave-mouth walk.
2. Seek a **real authored cave-mouth source** independently from actual `environmentCaves.get` original-world provenance, not a convenient above-ground AIR patch; only claim walkability after original M7 and experimental source physics truly traverse it. Do not change cave code/terrain to force success.
3. Preserve failed original standing admissions for actual occupied or carved source cells. Do not silently replace the original default helper in production: this is an explicitly opted-in research-only historical-physical accessor, not a new generator or save identity.
4. Physical iPhone 17 Pro Max installed Home Screen PWA **FPS, frame p95, JS heap, GPU resident memory and thermals**, as well as a separately approved distinct generator version and user-save migration, remain **UNVERIFIED**.

**Accepted conclusion:** Source-authentic original legacy ground was hidden by an empty-overlay prerequisite in the isolated research pathfinder, **not by a real M7 terrain hole**. With an explicit original-voxel physical admission mode, seed -88 has **ten native-verified Enchanted→Plains original/experimental walking paths across two distinct border areas**, with all old source/edit safeguards intact. The original game code is unchanged.
