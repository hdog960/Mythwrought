# MYTHWROUGHT — MANUAL FOUR-BIOME ROADMAP: CANDIDATE TO LIVE GAME

Date: November 17, 2026. Owner: creator-directed MANUAL biome development, separate from the hourly automations. Status: ROADMAP ONLY — no biome code integrated or deployed by creating this document.

## End state (not merely a PR or opt-in demo)

After M8 is accepted, a normal player using the published Mythwrought GitHub Pages build can create/load a **verified biome-enabled new world**, reach the Desert, Snow, Mountains and Enchanted Forest without a development console, see their real distinct terrain and natural features across many chunks, walk/jump and mine/place blocks normally, save/reload/export/restore the world with biome edits preserved, and revisit every biome. A safe existing legacy world remains visually and byte-for-byte equivalent to its prior generator/save. The experience works within the v0.10 Gate A iPhone landscape controls and active WebGL2 budget. **Completion requires a successfully published and independently verified public Pages build**, not just a green CI check, merged module, render-only preview or manual-incorporation handoff. Physical iPhone acceptance and creator visual sign-off are separately recorded; v0.11 remains LOCKED unless explicitly unlocked.

## Fixed starting checkpoint

- Target repo: https://github.com/hdog960/Mythwrought ; playable URL: https://hdog960.github.io/Mythwrought/
- Latest main inspected when this roadmap was authored: 104e57ff678a0c58593d1e3c85c13c6c112da992. Recheck current main on every implementation session; do not assume this SHA stays current.
- Existing candidate: draft https://github.com/hdog960/Mythwrought/pull/172 ; branch lane-24-surface-four-regions-20261115 ; exact candidate HEAD 19db446458a61075be5103e1490fb16637ce641a. Preserve its seven changed files and authored work. PR #172 is unmerged and undeployed. Its source is NOT the live game.
- Verified candidate source: src/surface-regions/regions.mjs ; tests/surface-regions/regions.test.mjs, relief-profiles, geological-bands, multichunk-acceptance, edit-persistence-acceptance, four-region-engine-acceptance. Seed 179 candidate centers: desert X=512 Z=0; snow X=0 Z=512; mountains X=-512 Z=0; enchanted forest X=0 Z=-512. Region width/transition are algorithmic, not four exclusive single-chunk fixtures.
- Current design uses registered biome130 block IDs from main, not newly allocated IDs. The generator has height plans, veneer/column plans and an opt-in cached read-only createSurfaceBiomeWorldView. It is not a live authoritative edit/save/runtime connection.
- Last observed PR #172 Actions #44169188130 SUCCESS for generic verification, including full 20-script WebGL2; dedicated biome-focused tests and visual acceptance were not proven by that success. No genuine four-biome live screenshots or physical iPhone traversal certified.
- Live engine currently loads a VoxelWorld through loadWorldSafe and Pack2LiveWorld, and gameplay mesh/collision/raycast/edit/save paths use the authoritative world object. VoxelWorld.set compares against naturalAndLandmarkBlock, saveWorldSafe stores schema-1 edit deltas plus verified journal/backups, with other pack sidecars. Deep Y range is -210..19 (legacy surface from -3..19). Surface meshing uses meshChunk; lower vertical sections use meshDepthSection. Existing upper-right exploration minimap has its own seed-specific discovery state.
- Known hard blocker: newly raised biome shelves are read through a candidate view that cannot be edited/saved authoritatively. Current view can fall back to original terrain for an edited column, causing visible terrain changes or resurfacing unless generation profile, touched history, base/edit comparison and cache invalidation are made coherent. Do not ship that behavior.
- Separate hourly lanes NOW own :24 shallow caves, :36 deep caves, :12 cave integration support and :48 non-block vegetation. They MUST NOT reown these four manual biomes. Preserve cave PRs #156, #173, #228 and other producer work.

## Implementation rules and release authority

1. Preserve exact seeded legacy worlds, schema-1 records, player edits, Pack 1–5 sidecars, original 130-block registry IDs, existing caves/landmarks/trees, explored map, spawn, minimap reserve, two-thumb iPhone rails, offline PWA, and current version gate. No silently changing an existing seed based only on an empty edits map.
2. Manual biome work is owned by an independently named branch and draft PR (or sequenced small draft PRs) based on newly verified main. Treat PR #172 as the source-of-truth candidate; selectively port/reconcile verified source into the MANUAL implementation branch without rewriting its immutable history. Do not push directly to main until explicit creator-authorized release integration.
3. Keep named source/test/doc ownership for the biome implementation, with narrow explicit manual changes in shared engine/save/UI only when accepted at the corresponding milestone. Never modify :24/:36/:12/:48 branches or their owned files; coordinate read-only entrance/vegetation contracts. All shared-file changes must be separately reviewed, not silently hidden in a candidate.
4. Use no outside paid services, Codex, ChatGPT Work or Vercel. GitHub, Actions, Pages and existing free tools only.
5. At the end of EVERY M milestone, record branch, exact HEAD, diff scope, tests ACTUALLY EXECUTED versus only written, authentic screenshots, confirmed blockers, state of main/live, and a creator-usable next development step. Keep draft/unmerged until creator explicitly authorizes integration. Fail closed on inadequate evidence.

## Milestones (strict order, with independently usable stopping points)

### M0 — Preserve, audit and reproduce the candidate

- Freeze a source-exact inventory of all seven changed PR #172 files, registered terrain materials, seed-179 anchors, current main HEAD and recent CI. Reconcile against updated main without overwriting sibling edits.
- Run all focused tests against the exact candidate or faithful integration branch head, not just generic workflow success. Confirm geological bands, chunk transitions, three-seed composition, cache invalidation and edit/save regression. If there are failures, fix within the manual biome source/test scope first.
- Write baseline screenshot/terrain samples for five reference seeds including 179, 7, 2201 and at least one existing saved/edited world. Save old-world byte/hash snapshots and protected monument/cave/landmark coordinates for comparison.
- **Exit:** preserved source+baseline, exact-head focused Node run with explicit results, hard blockers and initial screenshot references. No runtime deployment.

### M1 — Authoritative generation-profile and save design

- Choose one durable, versioned, per-seed **biome-enabled world generation profile**. Existing seeds/saves with no verified profile load their legacy terrain unchanged. Enable for a clearly chosen NEW world; never infer consent/freshness from zero current edits or a seed number. Surface it through the existing Create/Load World experience without cluttering landscape controls.
- Implement/verify profile metadata persistence and integrity/backup/restore with fail-closed corruption and partial-write behavior. Record generator version or terrain-layout identity so future changes cannot silently remap generated worlds. Keep canonical schema-1 edit format valid, and ensure JSON export/import and device mirror/vault workflows can preserve or explicitly and safely represent all required biome-profile metadata. Never permit silent profile loss that regenerates different terrain.
- Design canonical precedence: saved player edits and rotations > protected placed objects/structures and user history > canonical biome-enabled natural terrain for eligible fresh columns > preserved legacy natural terrain elsewhere. World.get, VoxelWorld.set, baseline comparisons, meshing, collision/raycast, unload/reload and save/load must agree about the same generated cell, including newly raised air-to-solid shelves. Do not build permanent authority on a read-only wrapper.
- Regression: mine freshly generated biome top and shelf, place different block, restore old *legacy* natural block, restore *biome* natural block, save/reload/export/import and visit another chunk; no ghost blocks, cache resurrection, deleted edits or altered old saves. Unknown touched-cell state or damaged profile must fail closed.
- **Exit:** validated source-level save/profile strategy and actual focused implementation tests, including schema-1 legacy byte parity and crash/corruption cases. No production main changes yet.

### M2 — Connect true voxel generation to the game engine

- Reconcile PR #172 surfaceBiomeAt/Height/Block/FreshColumn plan into a safe, deterministic canonical terrain reader for a biome-enabled new profile. Apply complete columns atomically or derive a consistent canonical generated baseline; never leave unsupported floating shelves, build over protected structures, fill cave AIR, erase an entrance, or overwrite an edited cell. Preserve the Y<=19 ceiling, Y=-3 legacy layer and depth engine contracts.
- Validate caller consistency across live VoxelWorld, Pack2LiveWorld and other player-owned physical packs. Ensure all gameplay paths (render mesh, collision, raycast, dig/place, rotated block handling, item selection, save/load, chunk cache invalidation and adjacent vertical edits) see the SAME voxels. No unbounded new per-frame scans.
- Keep biome seed queries, region transitions, raised-shelf top, spawn/respawn and natural landmark placement coherent. Preserve old seed-179 landmarks; on new profiles, source-exact protected-structure checks precede a surface overwrite. Do not allow a new profile to violate the cave entrance contract.
- **Exit:** at least one fully meshed and editable biome region demonstrably uses the production game engine with real state/save tests, rather than an isolated read-only demo.

### M3 — Desert end-to-end vertical slice

- Complete Desert first as the reusable proof for all regions: multi-chunk dunes/ground, sandstone/hardpan bands, sparse natural xeric shapes using registered assets, strong distant silhouette and smooth normal-land transition. No newly invented block IDs or fake cactus/lighting claims.
- On an explicitly new biome-enabled world, travel from a known safe starting zone to Desert; confirm collision, jumping, headroom, mining, placing, save/reload, region exit/reentry and stable chunk streaming. Add real source-specific 3D captures and deterministic seed/coordinate replay.
- Verify editing raised ground does not collapse a whole cached neighboring ridge, cause floating fragments, resurrect an edited voxel or lose support after reload. Record a fallback if the original PR #172 read-only overlay cannot meet this.
- **Exit:** Desert is actually playable in a gated candidate runtime under verified edit/persistence tests. Generalize the engine solution before proceeding to other three.

### M4 — Finish Snow, Mountains and Enchanted Forest in the SAME world

- Snow: recognizable snowpack/drift contours, ice/frozen subsoil and sparse compatible frozen features; no generic green-ground recolor, no unsupported water/freezing simulation.
- Mountains: meaningful traversable crest, ridges, cliff/strata contrast and ledges without unreachable routes, unsafe instant drops or breaches of WORLD_MAX_Y=19. If the height ceiling prevents creator-acceptable mountains, STOP and propose a separately approved depth/height-engine design; do not silently change world limits/saves.
- Enchanted Forest: distinctive glades, ground/geology and natural magical woodland silhouette with real registered tree/root/flora assets. Only consume approved :48 geometry/vegetation interfaces if available; do not edit :48 branches, fake emissive lighting or expand unrelated render passes.
- All four appear **simultaneously** in at least three new profile seeds, retain regional identity across multiple chunks, use registered materials, preserve old-world seed parity, and support the same edit/save rules. Proof must show actual source-specific exterior and cutaway views, not static concepts or test fixtures.
- **Exit:** all four can be explored and edited in one real candidate runtime, distinct enough for creator visual review.

### M5 — World coherence, discovery and interaction

- Test region feathering and normal-to-desert/snow/mountain/enchanted transitions across chunk and world-coordinate boundaries, with no one-cell cliff seam, floating surface, clipping terrain, generation flicker, sudden unrelated landmarks, cave obstruction or permanent blocked routes.
- Integrate honest discovery with current explored minimap/fog-of-war without pre-revealing unseen regions or overlapping the upper-right HUD/landscape rails. Ensure biome world creation, map/seed switching, spawn/respawn and walking discoverability are usable on a phone. Localhost-only teleport may speed automated capture but must NOT be the only way to experience a biome.
- Validate protection across current live districts/landmarks, old caves, new :24/:36 cave-entrance proposals (read-only contractual compatibility only), Pack 1–5 placed objects, 130 registered materials and opted-in non-block vegetation. No direct changes to automation branches or future settlements.
- **Exit:** a player can discover all four naturally; existing feature sources and protected saved geography remain correct.

### M6 — Exact-head regression, graphics and mobile budget gate

- On the final candidate integration HEAD: focused four-biome native tests and all repository native/contract tests actually executed; full genuine Chromium WebGL2 scripts and dedicated biome traversal/terrain-edit/reload tests, not just generic green CI.
- Save source-accurate screenshot artifacts for Desert, Snow, Mountains, Enchanted, four boundary transitions, overview vs cutaway as useful, using 667x375, 844x390 and 932x430 landscape viewports. Inspect screenshots, manifests, image dimensions, hashes, actual framing, clipped controls, seed/coordinate identity and any context loss.
- Stress 25-chunk surface streaming budget (and correct independent deep-section budget), 60FPS target on device, chunk and mesh cache bounds, GPU memory/mesh upload spikes, rapid mining, long travel, rotation, offline PWA reload, context loss/recovery, map, two-thumb rails and existing creative-flight controls. Desktop simulation is NOT proof of iPhone hardware performance.
- Test old save bitwise/semantic parity, damaged journal/backup, repaired save, exported/imported profile, new seed switching, quit/reopen, no profile metadata loss, no shifted landmarks. Fix failures; do not waive them.
- **Exit:** exact candidate HEAD has comprehensive verified native + browser evidence, genuine visual contact sheets, creator-review-ready screenshots, and an explicit phone-test checklist.

### M7 — Controlled integration-ready release PR

- Reverify current main and protected live version before integration. Assemble a single reviewed **manual four-biome implementation PR** or a clearly documented ordered pair of safe dependencies, with exact source ancestry from #172, separately approved shared engine/save/UI edits, rollback steps, and producer conflicts. Keep PR draft until creator expressly authorizes its incorporation.
- Re-run exact-head full tests at the final rebase/merge candidate after reconciling main drift. Verify no overlap with :24/:36 cave PRs, :12 adapter PR, :48 non-block objects, manual geometry cleanup, building roadmaps or Creative Mode; do not merge them implicitly.
- Lock generator profile version and initial seed/landmark fingerprints so a future release cannot silently remodel newly saved biome worlds. Prepare safe rollback compatible with any new biome-created saves; refuse rollback that loses user edits or leaves metadata unreadable.
- **Exit:** accepted code and genuine evidence ready for creator authorization, with no uncontrolled deployment. M7 alone is NOT roadmap completion.

### M8 — Merge, publish, verify live biomes and device acceptance

- Only after explicit creator release instruction: manual integrator merges the accepted implementation, checks merged-main SHA and CI, publishes through existing GitHub Actions/Pages, and independently verifies the public HTML/JS bytes correspond to that approved release (not stale cache, stale Pages or another branch). Preserve v0.10 Gate A/v0.11 lock.
- From the actual public https://hdog960.github.io/Mythwrought/ site: create a verified biome-enabled new world in ordinary UI, visit each of four candidate region anchors with real movement, check distinct terrain/materials, transitions, mine/place, save, hard reload, export/import, close/reopen, offline PWA, old-seed legacy save and minimap; record source exact public build and reproducible screenshot/debug evidence.
- Request creator physical-iPhone landscape playtest (two-thumb controls, biome discovery, dig/place/save, performance, Home Screen PWA where available). Explicitly label device checks not performed until the creator reports evidence; do not claim a phone test from Chromium.
- **EXIT / DEFINITION OF DONE:** all four are real, player-visible, reachable, editable, persistent and verified in the published game; existing worlds safe; release SHA/deploy URL documented; creator visual and device feedback addressed or explicitly remains a gated release blocker. If any biome is merely an optional module, fixture, read-only view, failed Pages deploy or unverified old save, the roadmap is NOT complete.

## Priority sequence and status ledger

| Step | Current status at roadmap creation | Hard gate |
|---|---|---|
| M0 Preserve/reproduce PR #172 | NOT STARTED in manual work | exact-head focused tests and intake |
| M1 Profile/edit/save | BLOCKED by authoritative baseline | genuine schema-1-safe persistent profile |
| M2 Engine worldgen connection | NOT STARTED | same blocks in world.get/set/mesh/collision |
| M3 Desert end-to-end | NOT STARTED | genuine editable/desert candidate runtime |
| M4 All four regions | NOT STARTED | four distinct playable terrains simultaneously |
| M5 Discovery / coexistence | NOT STARTED | walkable routes, protected saves/features |
| M6 full acceptance | NOT STARTED | exact-head Node + WebGL2 + mobile review |
| M7 ready-to-merge PR | NOT STARTED | creator-approved integration candidate |
| M8 public deployment | NOT STARTED | actual published game+verification |

### Exact first action when creator says BEGIN

Start M0 and M1 on a NEW manual biome branch/draft PR without changing #172. Snapshot current main; verify #172 source fingerprints and focused tests, then implement the smallest authoritative new-profile/edit/save seam with regression cases (mine/place/revert/restore old/new profiles). Preserve the current live game and every automation branch. Report exact HEAD, test evidence, blockers and a CONTINUE DEVELOPMENT action. Do not jump directly to merging the old read-only prototype.