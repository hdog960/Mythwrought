# MYTHWROUGHT — Enchanted Forest Phase 2: Real Physics-Admitted Routes, Verified Enchanted → Desert

**Standalone research checkpoint November 22, 2026 local / November 23 UTC. Not production, live PWA, physical iPhone evidence, renderer change, user save migration or a merge.**

## Exact protected refs and new experimental source

- Starting isolated branch `research/enchanted-p2-physical-root-safety-20261121` HEAD `07be5742351eb19b374382d6b6b963cb23ab9314`.
- Protected production `main` `7016e14cd6289f45eaf7fc6a79a362b47996df65` and protected Enchanted parent `dev/enchanted-forest-overhaul-20261121-phase0` `db8cad02387050579c75cbdcdea3e94a9f6d6bee`, independently verified **unchanged**.
- Required pre-read source checkpoint `docs/enchanted-forest/PHASE2_REAL_M7_BOUNDED_BIOME_PEDESTRIAN_GRAPH_20261122.md` exact Git blob `cbc134d9a1270608ca62868b30a42903e77a8085`.
- Existing bounded **geometric proposal-only** BFS `src/manual-biomes/enchanted-original-pedestrian-search.mjs` Git blob `49fa84146656d895638126c7766675188a13fa80` is **untouched**, as are `src/physics.mjs`, `src/voxel.mjs`, `src/manual-biomes/profile-world.mjs`, all environmental terrain/caves/biomes, all save/world generator identities and production `src/main.mjs`.
- New separated read-only research helper `src/manual-biomes/enchanted-original-physics-route.mjs`: a deterministic *physics-admission-aware* BFS. New native tests `tests/manual-biomes/enchanted-original-physics-route-real-m7.test.mjs`, changed-only isolated `.github/workflows/enchanted-phase2-physical-native.yml`. No gameplay wiring; all inputs are detached source-authentic original `FourRegionWorld` instances.

## Genuine implementation improvement

The previous source-only BFS validated original static surfaces/AABB and later replayed a few graph proposals. A graph edge could still reach a valid-looking ground cell but not be traversable with the actual real `stepPlayer` control law; the earlier target-directed heuristic lost an accepted Desert route and was **correctly withdrawn**.

New `searchOriginalM7PhysicsAdmittedRoutes` is distinct from and does **not modify** the verified old BFS. Each graph queue node holds the actual original player `x,z,feet,vX,vY,vZ,onGround,coyote,jumpBuffer,yaw` state and the predecessor edge. For each adjacent candidate:
1. Require an actual original-M7 `originalM7PedestrianCap`, genuine supported original ground, two original cave/landmark AIR/headroom layers, original player-body collision, a <=1-block original rise, and diagonal side-support vetoes.
2. **Run the real, unchanged `stepPlayer`** for up to 48 original 25ms ticks, steering toward the center of the physically adjacent waypoint. Reject actual `hitWall`, ceiling, full-body collisions and waypoints not reached within 48 ticks. **Only physics-successful state transitions enter the queue**.
3. Clone the current full physical player state into each candidate branch, retaining the actual momentum/history of the winning branch, with no interleg teleport or velocity reset.
4. On a cross-biome target with minimum real displacement, reconstruct the full route and **replay from the genuine original spawn** as an independent full original-physics check. `originalM7PhysicsRouteReplay` can also run against the experimental world, which must independently pass. Deliberate physical candidate bark is not deleted or bypassed.
5. Hard search budgets: radius at most **16**, visits **192**, depth **24**, accepted routes **3**, real edge attempts **512**, total original physics ticks **8,192**, per-edge ticks **48**. Options cannot raise these limits. Additional read-only per-search diagnostics count node, edge, rejected original physics, budget/queue and result counts. Search refuses experimental world input; original-M7 identity is required. No persistent cache, world edit, saved or external state, deployment, PWA, physics override or fake cave floor.

This is intentionally a *bounded, incomplete* source research search, **not a production pathfinder** and not proof that absent routes are impossible.

## Critical correction to historical biome direction

The earlier checkpoint mistakenly described two known physically verified routes around `[225,-592]` as **Desert → Enchanted**. The original `v6BiomeAt(x,z,7919)` instead classifies `[225,-592]`, `[225,-595]`, and `[226,-592]` as **Enchanted**; `[229,-596]` and `[229,-598]` are **Desert**. These are genuine **Enchanted → Desert** crossings. The original physical walking evidence was correct, but the direction in the prose was reversed; do not reuse the mislabeling. This session's source tests assert the actual start and end classification and fail if inverted.

Authentic known historical route `[225,-592]` → `[229,-596]` (four consecutive diagonal footsteps) revalidated **54/54 original/experimental `stepPlayer` ticks** on the new `originalM7PhysicsRouteReplay`, with no inter-leg teleport. The test itself exercises original physical source ground at all five points.

## Focused native results and genuinely new accepted routes

**Latest exact changed-source original physics admission** [GitHub Actions #45097918015](https://github.com/hdog960/Mythwrought/actions/runs/45097918015) tested commit `c4ac5ba1f282f4070a04bd003b705972776f365a` — **SUCCESS, 1/1 corrected targeted source test**. Nine genuine original-world physics-admitted **Enchanted → Desert** routes across three distinct historical source-ground starts, all with equal original and experimental tick counts:

| Historical start | Physical end | Legs | Original ticks | Experimental ticks | Chunk edge crossed |
|---|---|---:|---:|---:|---|
| `[225,-592]` | `[229,-595]` | 4 | 50 | 50 | yes |
| `[225,-592]` | `[229,-596]` | 4 | 54 | 54 | yes |
| `[225,-592]` | `[230,-592]` | 5 | 47 | 47 | no |
| `[225,-595]` | `[228,-598]` | 3 | 40 | 40 | no |
| `[225,-595]` | `[229,-595]` | 4 | 38 | 38 | no |
| `[225,-595]` | `[229,-596]` | 4 | 42 | 42 | no |
| `[226,-592]` | `[230,-592]` | 4 | 38 | 38 | no |
| `[226,-592]` | `[230,-593]` | 4 | 42 | 42 | yes |
| `[226,-592]` | `[230,-594]` | 4 | 46 | 46 | yes |

- The same run recorded original per-edge BFS workloads by start: **82/52/53 actually visited states**, **122/84/87 actual edge attempts**, **1,528/1,066/1,074 original physics ticks**, **3 accepted routes per start**. All are strictly beneath hard source limits. Zero per-search budget truncations for these positive witnesses.
- All accepted routes are replayed in the historical M7 world and then in the candidate Enchanted tree world with unchanged physics, no fabricated terrain, no user edits and unchanged historical schema-1 save shape.
- In the first new native source run [#45097608418](https://github.com/hdog960/Mythwrought/actions/runs/45097608418), **2/5 tests passed**: the isolated seed -88 bounded survey and original in-memory voxel obstruction veto. Other tests failed because they *incorrectly labeled original Enchanted ground as Desert*.
- On corrected biome orientation [#45097825385](https://github.com/hdog960/Mythwrought/actions/runs/45097825385), **2/3 changed source tests passed**: strict input/source limits and the physical 4-diagonal 54/54 route replay. The third had a test-only **incorrect four-leg minimum**, even though a genuine three-diagonal route covered the correct >=4-block physical displacement. The test was strengthened to require actual distance instead of arbitrary leg count and passed on #45097918015.
- This series is deliberately **NOT** misrepresented as a single 5/5 run. The two seed-88/obstruction cases passed on identical new runtime helper source, the 2 corrected other cases passed on changed-fixture source, and the final new route-discovery body passed separately. No repeated broad CI.
- Retained old source-only BFS and previously native-certified 14-leg Enchanted–Snow, 288-chunk voxel/seams, 128-entry site cache, 1024-entry canopy source cache, original GPU/three-moon/WebGL2 proofs were reused only where unchanged.

## Seed -88, cave/landmark and remaining explicit research limitations

Five source-authentic genuine original Enchanted standing starts on seed `-88`: `[-266,-588]`, `[-264,-592]`, `[252,-600]`, `[250,-596]`, `[-266,-584]`. The same read-only physics search visited **64 states** from each; actual edge attempts **89,91,93,92,87**, real physics ticks **1,113,1,114,1,126,1,115,1,092** respectively. **Zero cross-biome routes found** inside these restricted caps; all five exhausted the visit budget. This does **not prove impassability**, only identifies a physically grounded search gap. Do not claim verified seed -88 Plains travel.

A separate disposable-world test added a true original in-memory `BLOCK.STONE` obstruction to a previously valid headroom voxel; physical replay properly refused that standing source rather than teleporting past it. The test-only edit is not an actual user world, never persisted or sent to production. Original source-air/cave/landmark provenance continues to be demanded by every node. **Specific cave-mouth pedestrian acceptance remains outstanding**; the presence of source-level AIR veto alone is not an authentic cave-entrance walk.

No evidence was produced for Enchanted↔Mountain or Plains walking, actual browser live chunk streaming, physical iPhone 17 Pro Max installed Home Screen PWA FPS/frame-p95, resident JS heap bytes/GPU buffers or thermal behavior. Experimental trees remain opt-in and cannot be saved as historical M7; generator-version migration requires separate user release authorization. No changes to other developers, settlement work, Codex, the five hourly automations, caves, other biomes, production, shared infrastructure or user saves.

**Research result:** New physics-admitted original-M7 source search is verified against nine matching Enchanted-to-Desert original/experimental continuous pedestrian routes; ineligible/unverified climate coverage is explicitly not claimed.
