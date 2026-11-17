# Mythwrought Builder 3A — M1 Regional Extension, source and browser acceptance
**Date:** 2026-11-15. **Status:** Theoretical source only. Draft, unmerged, undeployed, no creator art/hardware signoff.

## Exact source provenance / CI
- Independent Builder 3A branch: `building-roadmap-3a-m0-20261115`, draft PR [#183](https://github.com/hdog960/Mythwrought/pull/183).
- Verified working main: `e6bd7c173a4531ba7efc153e5f2eb89870c3b9db`, integration checkpoint 009. Original draft [#122](https://github.com/hdog960/Mythwrought/pull/122) source at `e35b8eca644f6de06e76ab946103ce64a6b7fb91` remains unchanged.
- **Tested source PR head:** `4ea535e314ad30ec05094bde3a75fe1b4491d09b` with [GitHub Actions #43773665614](https://github.com/hdog960/Mythwrought/actions/runs/43773665614), **SUCCESS**: 735/735 root Node tests, 32/32 Builder 3A nested native tests, focused production WebGL2 smoke/layout passed; 12/12 CI scope checks passed. The full 20-script integrated gate was **skipped** in isolated mode.
- The pull-request workflow runs on a synthetic PR merge ref (`a4dcf57d0f683f0da6e70370fb8246286c0db0a6` for that run); the exact 3A-owned generator, original four workshop module, legacy blacksmith module, regional viewer, cutaway and browser-runner Git blob SHA-1 values were **independently matched** to the candidate PR head. No claim is made about a physical iPhone test.
- **Future docs-only commits change the PR head** without altering the validated source. Always inspect its new exact-head CI before claiming it passed.

## Authored census: 31 / 345; creator approved 0; integrated 0
| Type | Authored | Quota | Remaining |
|---|---:|---:|---:|
| Blacksmith | 15 inherited, source exact | 75 | 60 |
| Armorer | 4 (1 Temperate Small, 3 new regional) | 75 | 71 |
| Carpenter | 4 (1 Temperate Small, 3 new regional) | 75 | 71 |
| Stonemason | 4 (1 Temperate Small, 3 new regional) | 60 | 56 |
| Mining workshop | 4 (1 Temperate Small, 3 new regional) | 60 | 56 |
| **Total** | **31** | **345** | **314** |

The 31 models contain **79,226 actual authored voxel-coordinate cells**. These are NOT active game voxels or objects in the world. The 15 original blacksmiths retain 28,651 coordinate cells and matching full source objects/fingerprints, and the original four Temperate/Small workshops remain byte-identical. Twelve regional designs are in `src/building-pool/roadmap-3a/m1-regional-workshops.mjs`:

- **Armorer:** Desert Medium shade-arcade; Snow Large insulated double-forge hall; Mountain Medium terraced plate-armor workshop.
- **Carpenter:** Enchanted Forest Medium root-frame joinery; Mountain Large cliffside timber-drying hall; Desert Large open-air furniture yard.
- **Stonemason:** Desert Large colonnaded cutting court; Snow Medium frost-quarry gallery; Mountain Medium cliffstone atelier.
- **Mining Workshop:** Snow Medium insulated ore sorting; Enchanted Forest Large aetherstone wash-house; Mountain Large cliffside ore-transfer station.

Each has a deterministic coordinate blueprint with a distinct envelope, profile/roof equation, cut/courtyard, pier and stock-bay rhythm, named work areas, true two-wide/three-high unobstructed access, fixture cells, dependencies and explicit world-inactive state. Distinctness tests compare actual occupied physical coordinates under translations, rotations and reflections across **all 31** designs. No mirrored, recolored or title-only designs count as additional candidates. M1 has not yet created an exhaustive 5 biome × 3 size coverage **per category**, and is not complete.

## Genuine browser evidence / inspection
- Independent **72/72** real Chromium WebGL2 diagnostic captures from exact CI-exported 3A source, across 12 new architectures × exterior and roof-removed cutaway × 667×375, 844×390, 932×430.
- Source manifest: **21 byte-exact exported source files**. Six key PR-head Git blobs independently cross-checked. Each screenshot had nonzero foreground, WebGL2 context active, `gl.finish()`, `gl.getError()===0`, no browser page errors, correct model ID and correct requested view. 72 PNGs + SHA provenance + contact sheet are available as a separate conversation evidence ZIP, **not** in the PR or Pages deployment.
- Reviewer inspection: architecture visibly distinguishes roof/courtyard arrangements, and cutaways show interiors/support posts. The shapes remain **plain diagnostic cube-envelope meshes**, NOT real Pack 1–5 partial-shape WebGL2, finished premium artwork, production gameplay, iPhone FPS, thermals, mobile controls, final collision or weatherproofing approval. Large structures' face-counts are diagnostic, not GPU performance budgets.
- Prior **90 inherited blacksmith + 24 original workshop = 114** genuine source-driven WebGL2 diagnostic captures remain separately documented in `M1_ACCEPTANCE.md`, totaling **186** across sessions. These are not production meshes.

## Physical-family and construction blockers
- Verified `src/builder-assets/manual-five-pack.mjs` exposes **96 family symbols / 106 physical variants**. All 11 currently referenced manual source families have compatible symbol definitions and source-resolvable geometry/selection, but final oriented fixture occupancy, roof attachment, weather, load, save compatibility and all tested building-wide physical intersections remain open. `pack4:057` crates and `pack5:088` anvils in new designs carry explicit cardinal orientation (and anvil variant) plus native checks of source offsets.
- Existing `biome130:006` has registered physical definition; `biome130:094`, `096`, `098`, `104` remain **unregistered symbolic dependencies**. No substitute IDs, final dimensions or fictional collision proof are assigned.
- `legacy-physical-support-audit.mjs` source-derived geometry check reports **30 missing Pack 4 mounts** in 15 original blacksmiths: 15 fireplace rear-face anchors, 15 chimney floor supports. To preserve exact original geometry, `legacy-mount-repair-options.mjs` provides **15 unplaced, collision-free provisional masonry backings** (Pack 1 heat approval required), and **15 blocked hollow chimney conflicts**: a solid block at the direct support position would plug the intended flue. These proposals do **not** repair the source, authorize heat safety or reduce the 30 remaining unresolved support points. The central integrator and creator must review safe hollow support/redesign before physical placement.
- Further blocked: construction-wide Pack 1/3 partial shape intersections, final doorway physical collision and roof/span load/weather proof, tall-world budget, schema-1 save/orientation, physical iPhone usability, creator art approval. No crafting/machine/AI/mob additions.

## Isolation and next work
- Paths allowed ONLY under `src/building-pool/roadmap-3a/`, `tests/building-pool/roadmap-3a/`, `docs/building-pool/roadmap-3a/`. All seven sibling builder PRs #179/#180/#181/#182/#184/#185/#187 checked, zero overlap with 3A. The original PR #122, all five block packs and five automations are read-only.
- **Next M1:** review structurally suspect roof overhang/court weather joins; produce actual physical-family source-fit prototypes in 3A-owned test harness without altering underlying inherited 15 shapes; continue M1 into more biome-size representative 3D workshop plans. **Do not** merge, deploy, register production IDs, change live saves, unlock v0.11 or mark creator signoff. Gate A stays OPEN.
