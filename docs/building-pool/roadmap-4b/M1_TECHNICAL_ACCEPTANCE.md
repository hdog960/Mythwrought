# Mythwrought Builder 4B — M1 first-five technical acceptance

**Classification:** 5 original, coordinate-authored *theoretical* candidate structures, not live-integrated buildings, physical-family final meshes, approved art or a playable-iPhone demonstration. This report is attached to draft [PR #185](https://github.com/hdog960/Mythwrought/pull/185) and cannot authorize a merge, runtime placement or v0.11.

## Verified immutable evidence

- Underlying reviewed **source/preview PR head**: 242e189a96037f8bb1a76005f1a0964276f62925.
- Exact-head [GitHub Actions #43771739057](https://github.com/hdog960/Mythwrought/actions/runs/43771739057): **SUCCESS**. Focused 4B nested native Node suite **40/40 pass, 0 fail, 0 skip**; original production-game Chromium WebGL2 smoke and landscape layout both pass. Shared full 20-script gate correctly skipped for this strictly isolated 4B PR.
- The 4B-owned native suite executed a genuine Chrome DevTools Protocol Chromium browser, real WebGL2 context, shader compilation/draw/finish, verified **0 GL errors, 0 context losses, 1 draw call per scene**, and saved **30/30** actual screenshots (5 distinct models × 2 views × 3 viewports). The output is an authentic *cube-proxy* WebGL2 diagnostic, **not** final material mesh shapes or in-game rendering.
- Source-exact coordinate authored source SHA-256 `e5ee3c6cdc793bfc93854dd0171c765252b5263dcc4f0d8de611c95f00f85530`. GitHub screenshot artifact: [#14184861292](https://github.com/hdog960/Mythwrought/actions/runs/43771739057/artifacts/14184861292). Screenshot evidence contains source ID, screenshot dimensions, reported triangle/cell counts and renderer classification.
- Three actual viewport sets **667×375**, **844×390**, **932×430**; every design captured both `exterior` and `section`. We independently inspected the 30 downloaded images at all three landscape sizes; no missing/blank frame, cropped major building or distorted layout observed after camera repair.
- The first 30-shot run [#43771145904](https://github.com/hdog960/Mythwrought/actions/runs/43771145904) technically passed but visual inspection exposed an **underside camera-depth defect**. The 4B-owned `m1-preview.html` camera-depth fix made roofs and interior section geometry readable on all views. Never cite the first 30 images as completed visual acceptance.
- Existing merged main baseline `e6bd7c173a4531ba7efc153e5f2eb89870c3b9db`; no changes to main or original draft PRs, sibling builders, manual packs, automation source, core voxel IDs or saves.

## Actual candidate census and architecture

| ID suffix / category | Biome and size | Coordinate cells | Walk nodes | Named functional rooms |
|---|---|---:|---:|---:|
| healers-house:temperate:small:01 | Temperate Small | 1,027 | 158 | 4 (treatment, recovery, waiting, herb-storage) |
| library:snow:medium:01 | Snow Medium | 1,266 | 203 | 3 (reading, collections, catalogue) |
| schoolhouse:desert:small:01 | Desert Small | 1,413 | 231 | 3 (classroom, teaching, shared-study) |
| magical-research-institute:enchanted-forest:medium:01 | Enchanted Medium | 1,367 | 212 | 3 (research-hall, repository, instrument bay) |
| arcane-academy:mountain:large:01 | Mountain Large | 2,234 | 353 | 4 (lecture, study, practice, archive) |
| **Five originals** | **Five distinct biome-size cells** | **7,307** | **1,157** | **17** |

No category-matching legacy PR #123 candidates were imported. All five original IDs retain the `r4:` family prefix; none duplicates 4A. Quota **5 source-authored / 280 unauthored / 0 creator-approved / 0 live integrated**. Five *candidate-native technically validated* is not five creator-accepted buildings.

## Scope-specific repaired defects and verified limits

- Repaired M1 test import paths, directional roof/ridge metadata, overlapping clinic waiting-room footprints, a library bench colliding with a partition, and two initially non-traversable rear passages in the schoolhouse and research institute.
- Actual named room footprint access is present, walk nodes are supported by authored floor voxels and flood-connected to clear exterior doors, all five models have exact integer facade/wall/roof/beam/fixture cells, realistic initial footprint changes, source-symbolic window/furnishing dependencies and no overlapping occupied cells.
- The exterior is still **cube proxies with blocky flat weather planes and schematic colored glazing**. It does not demonstrate true physical Pack 1–5 variants, oriented doors/stairs, pane transparency, structural load-bearing based on true mesh AABBs, live collision/selection/placement, nor premium original artwork. Interpret this as **first-five M1 candidate technical acceptance only**, not final building design acceptance.
- Runtime world-height bounds, rotated save-state ABI, high-ID handling, live frame rate/thermal, physical-iPhone landscape controls, actual world placement, creator-art approval and city/town/village assembly are open future integration gates.

## Next lane-only development

Proceed to M2 theoretical design work only on explicit Continue Development. Distinct quota still needed: **74 healers' houses + 59 libraries**, including all remaining biome-size combinations; continue other categories in later milestones. Preserve independent ownership `src/tests/docs/building-pool/roadmap-4b/`, leave draft PR unmerged and undeployed, keep schema-1 and Gate A, v0.11 locked. No Codex, Work, Vercel or paid services.
