# Builder 3A — M1 Representative Coverage Acceptance (75 source-authored candidates)

**Status:** M1 representative category × biome × size coverage complete in DRAFT SOURCE. All production placement, physical block-shape acceptance, creator artwork approval, and iPhone hardware gates OPEN. **Unmerged and undeployed.** Date: 2026-11-15.

## Repository and source provenance
- Repository `hdog960/Mythwrought`; dedicated owner: `src/building-pool/roadmap-3a/`, `tests/building-pool/roadmap-3a/`, `docs/building-pool/roadmap-3a/`.
- Original read-only PR #122 `e35b8eca644f6de06e76ab946103ce64a6b7fb91`, all 15 inherited blacksmith exact geometry fingerprints, source-origin identities, and 28,651 voxel coordinates preserved.
- Current main at verified preflight `e6bd7c173a4531ba7efc153e5f2eb89870c3b9db`, integration checkpoint 009. PR #178 infrastructure and PR #174 manual physical-pack integration remain merged. No edits outside 3A.
- New source-bearing PR #183 HEAD `ee68ea35cd1ca3cec744511aa0ab438fa208fc17`. [Exact-head Actions #43777054689](https://github.com/hdog960/Mythwrought/actions/runs/43777054689) **SUCCESS:** 735/735 root Node, 41/41 3A-native tests across 13 nested test files, 12/12 CI scope contracts, focused production Chromium WebGL2 smoke/layout passes. The shared full 20-script browser integration gate was skipped by the isolated ownership scheduler, **not** falsely reported passed.
- Subsequent changes confined to this documentation-only handoff require their OWN exact-head docs-only CI confirmation.

## Source census (NOT runtime buildings)
| Type | Existing / newly authored source | Target quota | Uncreated |
|---|---:|---:|---:|
| Blacksmith | 15 inherited, 0 new | 75 | 60 |
| Armorer | 15 (1 first exemplar + 3 regional + 11 completion) | 75 | 60 |
| Carpenter | 15 (1 first exemplar + 3 regional + 11 completion) | 75 | 60 |
| Stonemason | 15 (1 first exemplar + 3 regional + 11 completion) | 60 | 45 |
| Mining workshop | 15 (1 first exemplar + 3 regional + 11 completion) | 60 | 45 |
| **Total** | **75** | **345** | **270** |

- Previously 31/345 coordinate-authored candidates. This session added **44** explicit separately specified nonrectangular regional/size floor programmes plus their integer-coordinate physical foundations, floors, wall/openings, distinct roof massing, roof beams/piers, accessible partitions, inventory bays and unpowered workshop fixtures.
- Exact CI-generated census: **242,504 authored voxel positions** total, **163,278 source positions in the 44 new designs**. These numbers are geometric source cells, not game-placed blocks.
- `m1-coverage-specs.mjs` declares exactly 44 separate missing region/size architecture briefs; `m1-coverage-workshops.mjs` creates full deterministic coordinates from each. `m1-coverage-workshops.test.mjs` checks all 60 non-blacksmith M1 representatives exist exactly once, plus 15 legacy blacksmiths; 75 unique occupied-cell masses under translation, all cardinal 90° rotations, and reflection; real two-wide/three-high clear navigation and named rooms; zero source-collision placement; source-aware physical family variant/attachment metadata.
- No one per-combination design is counted as an entire quota. The other **270 genuine variants remain unauthored**, and the roadmap cannot be declared fully built or production accepted.

## Genuine Chromium WebGL2 candidate render checks
- **264/264 real Chromium Xvfb/Mesa software WebGL2 screenshots** independently executed for 44 new models × exterior/cutaway × `667×375`, `844×390`, `932×430`, with `gl.finish()`, `readPixels()`, zero GL errors, nonblank frame proof (minimum 809 sampled foreground pixels), correct source ID and correct view.
- Existing 90 blacksmith, 24 first workshop and 72 earlier region reviews add **186** older genuine diagnostic views: **450 cumulative**, all using source-derived **unit cube proxies**. These do **not** show the final manual five-pack partial/rotated meshes, gameplay collision, premium art, world placement, or physical-iPhone controls.
- Source chain: 27 original source files verified by SHA-256 from successful CI [#43776289299](https://github.com/hdog960/Mythwrought/actions/runs/43776289299) at source head `0a504d281a46007af1fec3acd0b5b45048e54258`; independent browser capture used ONLY two subsequent viewer-only fixes (Temperate + Small dropdowns and correct coverage mesh call). Both corrected file bytes were independently verified against PR Git blobs: `8a49cda9e036e903cc9dbaf1f817558e32829125` (HTML) and `f9a9e0808c430d7d6f798078255f0d7cbcf7bca4` (viewer JS). Latest exact-head CI #43777054689 green with both fixes.
- Separate conversation artifact, not deployed/committed: `Mythwrought_Builder3A_M1_Coverage_WebGL2_Review.zip` contains 264 PNGs, four category contact sheets and per-capture/PR-source verification. Do not claim those screenshots are production-asset renderings.
- Reviewer found several color- and silhouette-readable variations from actual gables, saw roofs, notched plans and courtyard openings. Several exteriors still look rectilinear / basic due to diagnostic cubes; roof physical flashing, load support and future premium art remain unapproved.

## Actual physical-family and legacy blockers
- Integrated `src/builder-assets/manual-five-pack.mjs` read-only interface has **96 family symbols / 106 physical variants**. Native tests check source-resolvable orientations/variants and asserted occupied floor supporting mounts for explicit Pack 4 crates and Pack 5 anvils. This is NOT full 75-building physical-family shape fitting, multi-cell collision signoff or live world placement.
- Four unregistered `biome130:094/096/098/104` entries remain future symbolic dependencies in original source plans, never fabricated as numeric block IDs. `biome130:006` registered definition is not enough to certify all materials.
- Original blacksmith source still reports **30 missing Pack 4 support mounts**: 15 unplaced conditional fireplace backing proposals (material heat/collision approval required) and 15 chimney sources that would close the original hollow flue if supported by solid voxels. No patch to original 15 source blueprints or fingerprint; repair options remain `appliedModifications:0`, not world-ready. A future creator-approved hollow chimney transition and explicit rear mounting are needed.
- Unapproved acceptance: true manual-family partial shapes/AABBs, oriented collision and physical supports, shared-world performance/chunk budgets, windows/roof materials, chimney heat, actual settlement integration, save schema-1 design compatibility, visual creator review, real iPhone touch controls and battery/thermal measurements.

## Ownership / next development milestone
- DRAFT PR #183 only; original #122, all seven builder sibling PRs, manual Block Packs 1–5, biome130, all five automations, shared runtime, CI, saves and GitHub Pages untouched. **No merge, integration, deploy, premium-art approval or v0.11 unlock.**
- M1 representative coverage complete for 5 biomes ×3 sizes ×5 categories. Continue authentic physical-family fixture integration experiments solely in 3A-owned test code, resolve evidenced 3A-only defects, then M2 source authoring on **additional unique variants** (especially 60 blacksmith +60 armorer remaining) while preserving legacy parity.
- v0.10 Gate A OPEN; v0.11 LOCKED. Creator approval remains a separate mandatory gate.
