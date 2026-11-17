# Builder 3A M5 — Source Acceptance Readiness, Visual & Physical Audit

**Status: 345/345 independently authored theoretical source blueprints, creator approval 0, live production registration 0, deployed/placed 0.** This report is about testable *source-authoring* readiness only. It is **NOT** premium-art approval, structural engineering approval, producer physical-mesh registration or authorization to use `incorporate now`.

## Governance / immutable scope

- Development PR **#183** and independent exact-branch CI-only PR **#203** remain **OPEN/DRAFT** and must not merge. CI-only PR targets the earlier historical base to avoid unrelated later-main CI-scope drift; main remains independently advanced. No rebases or shared workflow edits.
- All Builder 3A edits must stay strictly within `src/building-pool/roadmap-3a/`, `tests/building-pool/roadmap-3a/`, `docs/building-pool/roadmap-3a/`. No changes to sibling builder branches, manual Packs 1–5, biome130 producers, automations, game runtime, controller rails, saves/schema1 or v0.11.
- Preserve 345 original source-authored slots (75 blacksmith, 75 armorer, 75 carpenter, 60 stonemason, 60 mining-workshop). M5 modifies only the **five large mining-workshop variant-4 NE wings**; other **340 blueprints are untouched**.

## M5 visual diagnosis and source-geometry correction

Inspect [Actions #43918967239](https://github.com/hdog960/Mythwrought/actions/runs/43918967239) genuine Chromium/WebGL2 original fourth-variant captures: 15 buildings × exterior/cutaway × 667×375, 844×390 and 932×430, 90 records and SHA256 hashes for 7 checked-out source modules. The mountain-large and enchanted-forest-large **far-right camera-facing structures** looked like isolated inverted cones.

**Root cause:** the source-preview camera is at elevated +X/+Z (southeast) and camera screen-right corresponds to high **X and LOW Z**. The far-right building is therefore the **NORTHEAST** diagonal orework, **not the southeast wing**. An earlier M4 adjustment widened the southeast base but did not alter the offending northeast taper. This is source geometry, not a browser screenshot or camera rendering bug.

**M5 source fix:** for just the five large variant-4 original mining designs, set a **biome/source-brief-specific fixed-width northeast outer masonry/floor/roof bay across the entire original northeast Z span**, replacing the taper whose ungrounded *appearance* caused the wedge. Keep west wings and southeast source chevrons original, hoist tower 2×2 sky aperture, 2-wide × 3-high clearance and other source commissions. New native regression checks **each x/z source-cell row** of the affected northeast wing at ground foundation Y=0, walk deck Y=1, genuine roof and the exact external wall façade Y=2. Do not substitute labels, native camera math or mock images for source geometry.

**Updated independent source QA before GitHub CI:** 15 original fourth-variant candidates, **141,787 actual authored source voxel cells** (up from 139,073), **255** normalized D4 mining comparison pairs against variants 1–3 and fourth same-size peers, maximum floor IoU **0.9176262179 <0.94**, zero nominal two-wide/three-high circulation obstructions, and **0 of 5,341** sampled roof positions lacking local source bearing witnesses. Exact-head CI and new genuine PNG inspection remain mandatory and may change acceptance status.

## Physical producer audit — evidence and limitation

The archived **real producer Pack 1–5** shape resolver is applied by Builder 3A's physical AABB suites to fixtures, their support and occupied offsets, nearby source-authored neighbors and nominated clearance paths; this is **not** full Pack partial-mesh collision certification at settlement scale. The previous green M4 fourth report found: 15 models, zero fixture AABB collisions, zero absent fixture supports, zero occupied multi-cell conflicts, zero sampled corridor intrusions and 30 inherited legacy mount blockers. Rerun after the revised physical source.

### Historical unresolved support warnings (do not silently clear)

| Protected source family | Earlier archived sampled roof witnesses lacking nearby support |
|---|---:|
| M2 fourth metalworking | 33 / 6,008 |
| M2 fifth metalworking | 118 / 7,123 |
| M3 second artisans | 83 / 7,525 |
| M3 third crafts | 40 / 7,232 |
| **Total open historical sample gaps** | **274** |

M3 fourth (0/6,400), M3 fifth carpenters (0/4,510), M4 second mining (0/3,983) and M4 third mining (0/7,258) are individually green in the previous exact source artifact. **Thirty original PR #122 blacksmith Pack4 fireplace/chimney mount blockers remain unresolved.** Do not edit inherited source geometries or claim legacy engineering pass. A roof-purlin *proximity witness* is **not proof of structurally supported load/span, wind/snow rating, waterproofness, water diversion or actual real-world safety**.

### Still-open creator and integration gates

- Aesthetic approval of true original premium block/roof art, all-biome silhouettes at physical iPhone scale and non-placeholder world placement. Diagnostic Chromium software-WebGL2 **unit-cube envelopes** are not final Pack textures, meshes, microvariants or full runtime lighting.
- Actual cross-pack physical geometry: producer revision pinning, variant/yaw shape and collision AABB consistency, full mesh roof adjacency/stacking, clear door/portal circulation, construction asset palette and numeric persistent IDs; all undefined until creator-authorized implementation.
- Performance, voxel streaming/chunk budgets, editor selection and placement, collision/physics, save-schema 1 compatibility and rollback. No changes to shared runtime or saves until separately approved.
- Inherited 30 fireplace/chimney support blockers and 274 older sampled roof-witness gaps, independent engineering/physical fit, climate/drainage/fire engineering, working mining equipment and interactive harvesting/crafting. These are not authoring failures to quietly erase.
- Distinguish source-authoring technical **M5 acceptance** from both **creator visual acceptance** and **live integration approval**. Source acceptance is conditional on exact same SHA CI, source-specific Chromium artifacts inspected and strict Builder 3A ownership.

## Evidence / source anchors

- Original green M4 checkpoint: [isolated GitHub Actions #43918967239](https://github.com/hdog960/Mythwrought/actions/runs/43918967239), 735/735 root Node, 135/135 dedicated Builder 3A tests, 90/90 fourth mining real Chromium PNGs.
- Updated source: `src/building-pool/roadmap-3a/m4-mining-fourth-variants.mjs`.
- Regression: `tests/building-pool/roadmap-3a/m4-mining-fourth-variants.test.mjs`.
- Physical audit: `src/building-pool/roadmap-3a/m4-mining-fourth-physical-aabb-audit.mjs` and focused test.
- Real browser: `tests/building-pool/roadmap-3a/m4-fourth-source-cdp.mjs`, `m4-fourth-cdp.test.mjs`; manifest includes temporary PR-merge `GITHUB_SHA`, distinguish from actual branch source HEAD.

**Release authority: manual only; this roadmap does not approve any runtime integration, deployment, merge or unlocking of v0.11.**
