# Mythwrought Block Pack 4 — five-pack coordinated integration handoff

**Status: DRAFT PREPARATION, NOT REGISTERED OR DEPLOYED.** Canonical source: [Pack 4 PR #115](https://github.com/hdog960/Mythwrought/pull/115), use its **latest actual head** rather than an older acceptance SHA. This is Pack 4-only documentation, not a creator Gate A, artwork, physical-iPhone or v0.11 approval.

## Exact identities and ownership
- 22 unique families, 23 physical candidate IDs **159–181** within reserved exclusive band **159–208**; **182–208 remain unassigned**. Stained glass roster `pack4:031` has independent IDs 160/161. Four quarter-turn orientations are saved state **not additional IDs**.
- Other manual bands: Pack 1 9–58, Pack 2 59–108, Pack 3 109–158. Pack 5's 18 original symbolic families `pack5:079`–`pack5:096` are already source-merged via #119; preserve them, do not reimport. Future persistent Pack 5 IDs require central coordination. Existing game IDs 0–8 and sentinel 255 remain protected.
- Canonical original geometry: `windows.mjs`, `lighting.mjs`, `furnishings.mjs`, `hearth-civic.mjs`, `manifest.json`. No fake full cubes, duplicate IDs, or material substitutions.

## Physical and save interfaces already authored
- `builder-handoff.mjs`: `PACK4_BUILDER_CATALOG`, `pack4BuilderAsset`, `pack4BuilderPlacement`, `resolvePack4BuilderBlueprint` resolve original visible geometry, collisions, selections, support offsets and opaque/translucent typed WebGL2 mesh streams. All four existing building roadmaps have source-authentic opt-in consumers; no structures have been installed.
- `interaction-handoff.mjs`: `pack4ShapeHandoff` enforces the current-main <=32 local AABB contract for both collision and selection; maintain real hollow windows, chimney courses, fireplace, well rims and fountain.
- `pack4SidecarHandoff`, `pack4ReviewSidecar`, `pack4FixtureToSidecarSnapshot`, `pack4SidecarToFixtureSnapshot` supply **candidate only** orientation handoff. Missing/truncated rotation now fails closed; preserve exact `{cell,blockId,turns}` states, reject duplicate/stale/invalid IDs and malformed recovery. The standalone Pack 4 fixture format is NOT schema-1 production save storage. The final integrator owns atomic persistence, backup/recovery, seed isolation and rollback, without changing legacy saves.
- Transparent windows need the integrated alpha/depth render pass and accurate partial-cell occlusion. Lantern illumination, fire, smoke, water, moving pulleys, inventory and harvesting are **not** functioning features: visual/material metadata only.

## Verified historical evidence (must not be confused with latest-head testing)
[Dedicated Actions #43676479676](https://github.com/hdog960/Mythwrought/actions/runs/43676479676) **PASSED** on Pack 4 head `863aafa5f6fb6ed75c85207dcafe3759ff918e08`: 181/181 core native Node cases, 12/12 Pack 4 builder native cases, 17/17 builder-roadmap native cases, authentic Chromium WebGL2 23 assets × 4 turns × 3 landscape viewports and 12 screenshots. Pinned builders resolved 1,249 original Pack 4 physical cells (325/679/156/89) across the four roadmaps with zero missing neighboring support cells and zero default-preview orientations at that point. Not a finished five-pack settlement, physical-iPhone run or production registration.

## New mobile GPU staging budget preparation
- `gpu-residency-budget.mjs`: **inspection-only**, never allocates GPU buffers, places cells, modifies saves or claims actual FPS. Computes original Pack 4 10-float opaque/translucent mesh bytes in a deterministic viewer-distance order. Proposed review caps: 4096 candidate cells, 256 selected, 2 MiB resident bytes, 384 KiB per page, up to 8 pages. Every excluded candidate is explicitly reported and remains outside this read-only display plan.
- `tests/block-packs/pack-4/builder/gpu-residency-budget.test.mjs`: 256 **actual original** Pack 4 candidate meshes under input permutation, byte accounting, overflow and malformed-ID/rotation/geometry guards. A local **mock-mesh-only** Node 22 prototype passed 2/2 cases before the committed real-source tests. Do not cite that mock pass as Pack 4 native acceptance. New latest-head Actions evidence is required.
- These caps are proposed staging constraints, not measured iPhone memory, draw count or frame-time. Production 25/34/27 chunk bounds, 60 FPS and physical iPhone Safari / two-thumb controls remain independent gates.

## Coordinator-owned final incorporation requirements
1. Pin exact heads of main and Packs 1–5; audit ID bands and symbolic dependencies, preserving already merged Pack 5 originals. No duplicates or unreviewed changes.
2. Atomically register all 23 original Pack 4 candidate IDs, real rotated AABBs, selection, support checks, opaque/translucent material handling, model mesh streaming and construction palette/blueprint references. Do not alter default gameplay to install this draft.
3. Verify schema-1 legacy world reload and protected IDs, orientation sidecar replay, interrupted-write rollback, stale/corrupt records, save export/import, seeds and physical selection in mixed-pack construction. The Pack 4 adapter does not itself install production saves.
4. Validate the latest building roadmap source heads and real sub-box contact across mixed Pack 1–5 supports, including Roadmap 3 fireplace/chimney contact. Roadmap 2 wall-sconce alternatives to originally unsupported floor lanterns require the creator's visual selection; do not silently substitute them.
5. Require final exact-head dedicated native/WebGL2 acceptance after the save fix and GPU-budget additions, full-game regressions, genuine dense mixed scene screenshots, physical iPhone frame-time/controls and creator art approvals. Report hardware verification separately from software Chromium.
6. Keep PR #115 **draft, unmerged and undeployed**, Gate A open and v0.11 locked. Merge and Pages deployment only after a single creator-authorized five-pack integration.

**Until current-head tests and technical readiness are demonstrated, DO NOT DECLARE PACK 4 READY FOR FINAL INTEGRATION.**