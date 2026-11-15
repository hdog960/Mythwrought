# MYTHWROUGHT — Block Pack 5 / Milestone 5 isolated candidate source acceptance

**Date:** November 14, 2026. **Decision:** All three M5 symbolic families have genuine authored 3D voxel candidates with isolated native Node and Chromium WebGL2 acceptance. **This is not final creator artwork approval, production incorporation, published-game certification or permission to merge.**

## Coordination and boundaries
- Rechecked main `ac263720b60641c65b02330348dd76d0ef9cb75e`, incorporation checkpoint **008**, manual Pack coordination [Issue #109](https://github.com/hdog960/Mythwrought/issues/109), automated biome130 [Issue #117](https://github.com/hdog960/Mythwrought/issues/117), latest separate draft heads and candidate manifests of manual Packs 1–4 and the :12 biome catalog. Checkpoints 007/008 explicitly excluded manual Pack 5 from playable game integration.
- All changes exclusively within `src/block-packs/pack-5/**` and `tests/block-packs/pack-5/**`. No shared registry/physics/rendering/CI/asset atlas/world generation/automation or other manual packs/buildings changed.
- Asset IDs `pack5:094`–`pack5:096` are **symbolic roster keys ONLY**. 0 newly allocated persistent numeric IDs; engine live 0–8 immutable, 255 reserved cache sentinel; biome130 256–385 future-wide-ID placeholders not changed.
- Preserve v0.10 Gate A OPEN, v0.11 LOCKED; production schema-1 saves, user preferences, runtime two-thumb iPhone controls, PWA offline, seed and world content untouched.

## Six original physical authored variants

| Symbolic family | Original variant | Actual geometry, support and physical role | Source preview budget |
| --- | --- | --- | --- |
| 094 Heavy Gates & Portcullis Panels | `citadel-ironbound-leaves` | Actual **two adjacent occupied floor cells** spanning a heavy opaque wood-and-iron pair, separate plank volumes, crossbraces, exposed rivets and middle seam; no opening gameplay | 23 boxes/cell, 46 total, **552 uncullled triangles** |
| 094 | `falling-portcullis-grille` | Distinct two-cell static steel portcullis with **real empty slots** between independently targetable vertical bars, shaped heads and crossmembers; no gate animation or open-state logic | 22 boxes/cell, 44 total, **528 triangles** |
| 095 Chandeliers | `suncrown-eightarm` | **Ceiling-attached** suspended two nested square halos with a physical center chain and separate unlit candle/socket pieces; ceiling support checked independently of floor | 25 boxes, **300 triangles** |
| 095 | `prismatic-starrack` | Ceiling-supported branching steel-and-crystal hanging frame, four physical crystal drops and separate decorative central piece; no dynamic lights | 19 boxes, **228 triangles** |
| 096 Stable Stall Partitions & Troughs | `oak-stall-divider` | Real **two-cell** supported stall division with tall posts, open upper rails, **opaque lower kickboard** and bracing, distinct from Pack 2's ordinary fences; remove from either cell atomically | 22 boxes/cell, 44 total, **528 triangles** |
| 096 | `stone-feed-trough` | Physically **hollow, dry** raised basin with base, side walls, metal rim, exterior cedar weatherboards and iron straps. Empty center retains truthful partial collision and ray selection. No water/animal/feeding systems | 34 boxes, **408 triangles** |

All six have source-authored material palettes and individually modeled physical AABB geometry, orientation 0–3, fixture-only ray targeting/removal and deterministic reversible variant snapshots. For ceiling models a real block immediately above the anchor is required. Multi-cell floor-supported gate/divider candidates require support under **every** occupied cell and remove atomically. No fabricated full-cube hitboxes, renderer-only decorations, generated buildings, lighting, fluids, trades, NPCs, loot, mechanics or cooking.

## Defects found and corrected through actual source and screenshot testing

1. First screenshot review exposed stable partition indistinguishable from a generic fence. Added physically collidable lower kickboards, close-set lower reinforcements and short braces, retaining real open upper air gaps.
2. Dry stone trough looked like a plain cube. Added actual external wooden weatherboards, iron rails, rim brackets; the basin's middle stays empty and its bottom remains solid.
3. **Found an actual degenerate underside quad in the original new M5 authored WebGL2 preview mesh.** Corrected its fourth vertex to restore a planar rectangle and added a genuine source-geometry test checking **both triangles**, all six axes and all four rotations. No shared production renderer changed.

## Genuine source exact evidence

- Existing M0–M4 native Node 22.16.0 **120/120 PASS** (0 skipped/failures). New **12 M5 focused regression tests** committed in `tests/block-packs/pack-5/fixture.test.mjs`, bringing **committed-branch-equivalent source-exact Node to 132/132 PASS**, zero skips and failures. The additional **12 deeper local-only M5 checks** ran separately with the verified source and passed (**144/144 local tests**); they have **not** been counted as committed tests or CI.
- Exact source Git blob: `src/block-packs/pack-5/fortified-specialties.mjs` **`06a4a5893761b1cc4cd3f4381630d6d17f7c72f8`**. Exact focused test blob: `tests/block-packs/pack-5/fixture.test.mjs` **`0a9c8660340079d287b9fb805ea8ad9d4b07ceb5`**. Existing candidate source files 079–093 remain unchanged.
- Native Node M5 checks cover genuine two-cell gate-support and rotated occupancy, solid gate vs. open portcullis gaps, ceiling support without floor/lighting, physically distinct chandelier arms, actual stall kickboard and open rail void, trough colliders and downward basin targeting, all M5 source box budgets and outward face triangle winding, multi-family isolated variant snapshot/atomic rollback, no persistent block IDs.
- **6/6 genuine Chromium native ES-module WebGL2 M5 screenshots PASS:** actual authored geometry imported with native JS `import`/`export` through `data:` URLs, software OpenGL/Xvfb Chromium WebGL2, true GPU framebuffer readback and nonblank per-card fingerprints. Checked each at **667×375, 844×390 and 932×430 CSS px**, two preview rotations (0/1); all six distinct candidate assets visible in every view. Reproduce:
  `LIBGL_ALWAYS_SOFTWARE=1 EGL_PLATFORM=x11 xvfb-run -a python tests/block-packs/pack-5/esm-webgl-browser.py m5 <output-folder>`
- All six **unculled source triangle costs** listed above stay <=768 **per occupied cell** and <=64 box/cell. This is a synthetic source preview budget only; NOT hardware GPU cost or Safari FPS.
- All earlier five galleries `m1,m2,m3,m3b,m4` independently reran this session: **30/30 genuine Chromium WebGL2 views PASS**. With M5 the total this session is **36/36** authentic source-preview screenshots.
- Browser administrator continues to block actual localhost HTTP-served module navigation with `ERR_BLOCKED_BY_ADMINISTRATOR`. The native offline ES-module data URL graph is a valid isolated syntax/render test but **not** true HTTP-served Pages verification, production runtime integration, physical iPhone performance testing or creator artwork signoff.
- Repository root CI `npm test` by default does not discover these nested `tests/block-packs/pack-5/*.test.mjs` checks; separately executed native tests establish focused source QA. Only exact PR-head GitHub Actions run status is valid for root CI and must be checked independently; queued != green.

## Decision / remaining hard gates

**All 18/18 planned physical family roster entries are now CANDIDATE**, spread across M1–M5, **0 INTEGRATED, 0 persistent numeric IDs**, and none belongs to the playable world. M5 isolated source QA and geometry previews PASS; creator premium art review, original HTTP-served browser, actual iPhone GPU/control sign-off and all centralized registry/save/engine integration remain OPEN. No v0.11 unlock.

**M6 is final cross-family integration-readiness acceptance, NOT permission to integrate.** It should audit originality, material/mesh cost, mixed adjacent placement, cross-family physical selection, ceiling and multi-cell safety, default production save compatibility requirements, and creator review. Any defect fix must remain Pack 5-owned on the draft branch. Never merge, deploy, allocate production IDs or change shared engine/CI/other lanes without separate explicit authorization.
