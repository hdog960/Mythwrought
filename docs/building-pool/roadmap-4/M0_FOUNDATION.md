# Roadmap 4 M0 — coordination and isolated schema

**Status: M0 foundation candidate; no actual authored structures yet.** Base main `f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84`, integration checkpoint **006** (read live at start of next development session). Gate A open; v0.11 locked. Do not imply that this PR is approved, merged, deployed, live or reviewed on a physical iPhone.

## Verified external ownership (2026-11-14)
- Seven authoritative documents `docs/01_VISION_AND_SCOPE.md` through `docs/07_ROADMAP.md`, `docs/RELEASE_LEDGER.md`, and `docs/INTEGRATION_CHECKPOINTS.md` checked on main. iPhone landscape side grips, untouched center-world controls (except creator-approved upper-right minimap), seed deterministic schema-1 saves, world continuity, offline PWA, user art gate are all protected.
- [Issue #109](https://github.com/hdog960/Mythwrought/issues/109): manual Packs 1–4, 78 candidate families, reservation bands 9–208 (not live registry). Independent branches [#113](https://github.com/hdog960/Mythwrought/pull/113), [#114](https://github.com/hdog960/Mythwrought/pull/114), [#112](https://github.com/hdog960/Mythwrought/pull/112), [#115](https://github.com/hdog960/Mythwrought/pull/115); all draft candidates.
- Pack 5 [#119](https://github.com/hdog960/Mythwrought/pull/119): roster positions 79–96 and symbolic `pack5:079` etc; 3 families / 6 variants candidate only at inspection.
- [Issue #117](https://github.com/hdog960/Mythwrought/issues/117): automated :12 130 families, symbolic `biome130:001` through `biome130:130`; forward proposed 256–385 needs a safe widened-ID system. See draft [#118](https://github.com/hdog960/Mythwrought/pull/118), four desert candidate families at inspection.
- Shared :00 interaction, :12 shape prototypes [#108](https://github.com/hdog960/Mythwrought/pull/108), :24 terrain, :36 structures, :48 flora, and candidate incorporation [#120](https://github.com/hdog960/Mythwrought/pull/120) are *other owners*. PR #120 is a **non-draft integration candidate** present in open PRs; Roadmap 4 must never merge or alter it.
- `src/voxel.mjs` confirms live registered IDs **0–8** only, `VoxelWorld.set` allows 0–8, current vertical limit -3..19. These future theoretical blueprints can exceed live height bounds; that is an **integration blocker**, not approval to raise world limits.
- `package.json` currently runs `node --test tests/*.test.mjs`. Dedicated nested Roadmap 4 tests require a separate explicit Node invocation; do not call ordinary main CI success proof of their execution.
- No `src/building-pool/`, `tests/building-pool/` or `docs/building-pool/` directories existed on inspected main. Other building roadmap teams remain untouched; if they open PRs, recheck path ownership immediately.

## M0 contract and non-claims
1. Stable IDs `r4:<type>:<biome>:<size>:<two-digit-variant>`. 11 distinct programs × 5 biomes × 3 sizes = 600 planned; M2=225, M3=195, M4=180.
2. 3D authored bounds, unique occupied cell coordinates with material and oriented architectural role, void openings, room access and floor footprints, required space types, walkable clearance/support graph, entrance reachability and multi-floor stair requirements.
3. Dependencies reference existing `base:...` IDs or catalog symbols `pack1:`, `pack2:`, `pack3:`, `pack4:`, `pack5:` or `biome130:` with exact roster number. Every future asset declares state, intended footprint class, orientation, attachment and **nonempty unresolved requirements**; no invented persistent numeric IDs.
4. Canonical serialization and shape-level uniqueness compare ignore palette-only changes (no counting 600 recolors). Required scene/building geometry is M1–M4 work, not represented as done by sample Node fixtures.
5. M0 fixture verifies validator invariants only. Interior navigation here is a discrete theoretical check, **not real physics or collision of unmerged partial pieces**. Explicit future acceptance: room-to-room path validation with real attached doors/windows/stairs, structural non-overlap including multi-cell shapes, entrance/roof silhouette, actual render budget and real browser images in 667×375, 844×390, 932×430.
6. Branch and PR stay draft/unmerged. No incorporation, gameplay, NPC, magic system, guards, settlement assembly, registry, shared CI, live-save, minmap, engine or deployment changes.

## Milestone gates
- **M0:** schema + manifest + dedicated Node validation suite + ownership/readiness dossier + dedicated draft PR. M0 cannot be called fully accepted until exact-head dedicated Node tests have really run and PR state/changed paths are checked.
- **M1:** 30 *real individually authored structures* (civic hall and castle/palace, 1 each biome × size), not generated exterior shells. Include functional rooms and biomes with architecture differences.
- **M2:** 225 civic hall/guildhall/embassy/castle structures.
- **M3:** 195 healer/library/school structures.
- **M4:** 180 institute/academy/observatory/archive structures.
- **M5:** validate all 600 unique in 3D, dependencies, real navigation/geometry and measured mobile preview, genuine screenshots and creator decision.

## Commands and test honesty
Run `node --test tests/building-pool/roadmap-4/*.test.mjs` from exact committed branch sources. Existing root `npm test` does **not** traverse these nested suites. Run genuine Chromium/WebGL2 only after an isolated Roadmap 4 preview is authored (none in M0). Record screenshots if actually captured; there are none from this Roadmap 4 at M0. Next session first re-fetch main, checkpoint, Issues 109/117, other Pack 1–5/biome manifests, PRs and exact-head CI.
