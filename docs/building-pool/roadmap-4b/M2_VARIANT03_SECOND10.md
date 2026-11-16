# Builder 4B M2 — ten further independent 03-variant buildings

Draft-only, unmerged, worldPlaced=false, 0 creator-approved, 0 integrated. This checkpoint appends ten coordinate-authored original silhouettes to the existing 73, with five healers and five libraries across temperate, desert, snow, enchanted forest and mountain biomes. No prior source object is replaced. The new layouts include irregular wings, open-air courtyard voids, differentiated supported roof ridges, real two-cell-clear portals, functional rooms and authored walkable floors.

| Original 4B design | Stable ID | Architectural distinction |
|---|---|---|
| Cedar Bend Triage Hall | `r4:healers-house:temperate:small:03` | cedar asymmetric three wing hips |
| Saffron Separated Ward Courts | `r4:healers-house:desert:large:03` | saffron offset quadri wing sky courts |
| Winterbridge Rehabilitation Annex | `r4:healers-house:snow:medium:03` | winterbridge offset frost sheds |
| Mothlight Crescent Apothecary | `r4:healers-house:enchanted-forest:small:03` | mothlight interlocking willow lenses |
| Highpass Broken-Ridge Hospital | `r4:healers-house:mountain:large:03` | highpass offset crag belvederes |
| Oakmeadow Crooked-Court Library | `r4:library:temperate:medium:03` | oakmeadow crooked gabled gallery |
| Copperwind Triple-Stack Scriptorium | `r4:library:desert:small:03` | copperwind misaligned sun shelves |
| Aurora Five-Lantern Knowledge Hall | `r4:library:snow:large:03` | aurora staggered five lantern trusses |
| Iridescent Three-Lens Lorehouse | `r4:library:enchanted-forest:medium:03` | iridescent three lens canopy ridge |
| Cairnloop Cliffside Reading Cell | `r4:library:mountain:small:03` | cairnloop zigzag ridge ventilation |

## Hard verification gates

- Source-derived geometry fingerprints must remain unique under D4 rotation/reflection/translation/material; floorplan D4 normalized IoU must remain below 0.89 against previous 73 and the other new 03-variants.
- Dedicated native Node tests must reject blocked entrances, missing supported roof tiers, nonexistent room floors, invalid Pack4 physical-family symbols, missing navigation and prior-object mutation.
- Genuine source-specific headless Chromium software-WebGL2 diagnostic cube-proxy captures must cover 10 building IDs × exterior/cutaway × 667×375, 844×390, 932×430 = 60 additional PNGs. Including the previous unaccepted 03 batch, 120 03 images and 498 all-cohort PNGs require acceptance. No synthetic screenshots or claims of final Pack physical geometry.
- Candidate-only exact-source families and AABBs for Pack1–5 remain **provisional**; doors (Pack2), windows and furnishings (Pack4), actual geometry, support, rotation, collision, picking, transparency, schema-1 persistence, physical iPhone and creator artwork must be verified separately.

**Census:** 83/285 total drafted; healer houses 40/75; libraries 40/60; schoolhouses 1/60; research institutes 1/45; academies 1/45; 202 total unauthored. The separate automated biome130 catalog remains outside ownership. Only 4B src/tests/docs owned paths may change. Never merge/deploy/register world assets or unlock v0.11 without explicit creator approval.


## 2026-11-16 exact-branch CI scope reconciliation

- Run [#43874705278](https://github.com/hdog960/Mythwrought/actions/runs/43874705278) on `c150beb4` was **cancelled at the 45-minute limit** after a 25-minute variant-02 genuine Chromium test timeout; its artifact contains 430 of 498 Builder 4B captures plus 23 unrelated Pack 2 PNGs. Partial artifact evidence is **not** technical acceptance.
- Source-only performance fix through `e7d773fa0af62c883a3edbac5a5a5a7716b14f29` retains source coordinates, WebGL2, both views, PNG assertions and all three landscape dimensions. All eight preview/test pairs passed JavaScript syntax checks, but not yet full native/browser execution.
- Exact PR-head run [#43895629516](https://github.com/hdog960/Mythwrought/actions/runs/43895629516) selected `full` rather than `isolated/roadmap-4b`, and **skipped dedicated 4B tests**, despite all 48 PR paths being 4B-owned. The shared selector computes its diff from the PR event base SHA to checkout HEAD; main advanced independently while this PR's base metadata remained at `e6bd7c17`. A stale event base / synthetic merge checkout is a plausible explanation, **not yet a confirmed root cause**. Do not modify the shared workflow or count general CI as 4B acceptance.
- Current safety response: request a fresh PR synchronize verification on a 4B documentation-only change, then review its actual scope/steps and all 498 source-driven captures if isolated. Do not merge, rebase, change main, register assets, change saves or unlock v0.11. Remain at 83/285 authored, 63 previously accepted, 20 unaccepted variant-03 designs until a genuine exact-head focused verification completes.


## Proven synthetic-merge scope mismatch (commit-level evidence)

The synthetic merge ref `refs/pull/185/merge` was `5e2bee8939e0c735c73cc966be2c940efad19e78`, with **parent 1 = `bd35f1d9f64780a92d99cc9c59aad7aad1806fc2`** and parent 2 = the isolated 4B branch HEAD `e7d773fa0af62c883a3edbac5a5a5a7716b14f29`. Its GitHub Actions workflow event supplied **`GITHUB_BASE_SHA=e6bd7c173a4531ba7efc153e5f2eb89870c3b9db`**. Thus `git diff e6bd7c...HEAD` against the synthetic checkout necessarily included main's unrelated `e6bd7c...bd35f1d` changes, explaining `mode=full` despite 48/48 builder-owned PR file paths. Prior [general workflow #43895629516](https://github.com/hdog960/Mythwrought/actions/runs/43895629516) passed but its 4B lane was *skipped*. No native/browser technical acceptance should be claimed. A 4B-only source or docs push may request a new sync event but **does not guarantee** a fresh event base; if GitHub keeps the old base SHA, independently isolated verification remains blocked unless scope is safely corrected by the infrastructure owner. Do not alter shared workflow, rebase, merge or change production source for this builder.


### Base metadata refreshed without branch or content merge

The existing PR base branch `main` was explicitly refreshed in GitHub PR metadata; its base SHA is now `440ab01a942bb3378d6ac2ff07945f4a9fb9861d`. The Builder 4B feature branch remains independent and unchanged, with the 83 existing source-authored buildings preserved. This scoped docs-only commit requests a fresh synchronization verification. A general-workflow success or an unverified browser suite is insufficient; acceptance still requires exact-head native 4B and all 498 genuine source-driven Chromium captures. No shared workflow changes, rebase, merge, deploy, production/saves edits, registration or v0.11 advancement.
