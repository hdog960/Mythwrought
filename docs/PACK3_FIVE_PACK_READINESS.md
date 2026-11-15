# Pack 3 readiness ledger for coordinated five-pack integration

**Status: NOT YET READY for the final five-pack production integration.** This
ledger tracks only manual Block Pack 3 and makes no readiness assertion for the
other four manual Block Packs.

## Source and ownership
- Approved immutable source families: IDs **109–125**, 17 distinct physical
  assets, corresponding to the symbolic building dependencies
  `pack3:023–029` and `pack3:069–078`.
- 56 certified orientation combinations: IDs 109–112 north-only; IDs 113–125
  support north, east, south, west. Undefined yaws must fail closed.
- Original geometry and palette are byte-identical to the Pack 3 source merge
  PR #149 at `44926349`; runtime development must not redefine assets or borrow
  IDs, symbolic namespaces, save data or builder ownership from Packs 1, 2, 4, 5.
- Source catalog and architecture symbol resolver are already merged. Do not
  repeat their integration or merge the older draft source PR #112 as a duplicate.

## Current isolated candidate
- PR #153 contains Stage A's true AABB surface meshing and shape probes plus
  Stage B's actual live gameplay overlay, WebGL2 buffer integration, targeting,
  collision, placement/removal, accessible settings palette, yaw persistence
  and device-specific section/chunk reuse.
- `VoxelWorld` legacy IDs 0–8 and `schema:1` payload are **not** extended.
  Physical construction is saved under its own per-seed key
  `mythwrought-pack3-construction-v1:<seed>`; this is an explicit dependency
  for the final coordinated five-pack save/restore design.
- The candidate now verifies a source-compatible `:previous-good` copy before
  overwriting an existing verified physical sidecar. If a second tab changes the
  saved construction, the old session refuses to overwrite it. Invalid sidecars
  are preserved and editing is read-only; there is **no automatic repair**.
- The browser uses original iPhone two-thumb controls; Pack 3 materials live
  inside settings rather than adding controls over the 3D world.
- Chunk addition cap is 12,000 physical vertices per 16×16×section GPU buffer;
  4,096 total physically placed cells per world. Construction chunk meshing
  now precomputes exact vertex length, allocates one Float32Array and writes
  source tones directly, avoiding per-vertex temporary typed-array slices.
  Exact pre/post vertex parity is independently asserted by a native test.
  Do not infer phone FPS from software Chromium times or CPU tests.
- Source-exact all-17 live-game browser PASS from #43719949693:
  all 17 physical IDs placed, rendered, reloaded and removed at 667×375,
  844×390 and 932×430, 8,028 added vertices, no 25-chunk budget increase,
  unchanged schema-1 bytes, genuine screenshots artifact #14164455730.
  The old software-Chromium p95 edit costs were 223.7/333.0/287.5ms;
  these are not physical iPhone frame-time metrics and do not satisfy the
  hardware signoff requirement.

## Existing tested evidence (before this acceptance expansion)
- PR #153 head `6195628d`: dedicated live-game Chromium/WebGL2 run
  #43680812878 PASS (three viewport sizes, ID116 with yaw1 place, save/reload,
  remove, genuine screenshot artifact #14148237386); 13/13 focused runtime
  Node tests PASS. Depth run #43680812856 and root run #43680812901 PASS.
- All 17 candidate geometry families were independently approved and validated
  with source-exact Chromium Canvas2D evidence via infrastructure PR #145
  (#43675629863). This does **not** replace real in-game WebGL2 acceptance.

## Acceptance requirements before announcing READY
1. New source-exact production Node suite validates **all 17 IDs** in physical
   runtime with per-ID placement and reload, **all 56** supported orientations,
   exact geometry, collisions, two-tab write conflict rejection, bounded GPU
   construction meshes, schema-1 preservation and seed isolation.
2. Dedicated *actual game* Chromium WebGL2 at 667×375, 844×390 and 932×430:
   17 shapes constructed, 17 reloaded, 17 safely removed; screenshots,
   screenshot pixel checks, 25-surface-chunk budget and latency evidence; keep
   existing normal PLACE-button ID116 acceptance. No claim of physical iPhone
   testing based on Chromium.
3. Pass both full-game and depth exact-head GitHub Actions, including original
   per-viewport grip/controls, world saves, terrain and cave regressions. Validate
   current main compatibility **without rewriting** other pack files.
4. Verify symbolic blueprint compatibility: future settlement builders consume
   Pack 3's `pack3:NNN` symbols and exact AABB occupancy, not provisional
   overlapping numeric IDs, and do not place unfinished settlements.
5. Coordinate cross-pack production registration and sidecar export/import
   ownership during the **single final five-pack integration**. Any outstanding
   device-level iPhone frame pacing/physical-controls approval is a blocker, not
   evidence to infer or claim.
6. Keep this PR **DRAFT, UNMERGED, UNDEPLOYED** until the user explicitly
   authorizes the five-pack coordinated final integration. Gate A and v0.11
   remain untouched.

No creator-final-ready declaration has yet been issued for Pack 3.
