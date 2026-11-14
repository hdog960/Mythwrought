# Milestone 1 acceptance ledger (45 authored candidates; final architectural approval OPEN)

| Evidence | Status |
|---|---|
| Latest live main | caf47776b723a36684edc1a72749e49268ccc688 |
| Latest recorded integration | checkpoint 007 (automation-only) |
| Issues #109/#117 | inspected; 255 sentinel, widened IDs uninstalled |
| Pack 1–5 manifests | inspected at latest PR heads, not altered |
| Biome130 | 12 symbolic candidates incorporated as opt-in source, not live asset ID registration |
| M0 schema / dedicated draft PR | complete; PR #121 remains draft |
| M0 original exact-head CI | SUCCESS at commit f57d4a6543ba4907d02bf86b1d8c47ac58e6c37a |
| Source-authored M1 candidates | 45/885; 15 house + 15 tavern + 15 empty stable |
| Actual authored voxel coordinates | 47,696 across 45 candidates |
| Native local Node tests | 39/39 PASS (16 M0 + 12 M1 + 2 uniqueness); PR-head source-specific rerun pending |
| Chromium schematic previews | 36 authentic Canvas2D exterior/cutaway screenshots at 3 landscape sizes |
| Native WebGL2 geometry gallery | Not certified: software GL unavailable in testing environment |
| Candidate physical asset substitution | BLOCKED on exact family dimensions, collision, orientation, support and widened-ID registry |
| Mirror/rotation + near-duplicate acceptance | OPEN |
| Creator art review / real iPhone / live world | NOT RUN / NOT APPROVED |
| Merges / deploys / shared code | NONE |

### Prototype caveats

These candidates have true coordinate-level slab/wall/roof/partitions, walkable cells and room graph, **not final collision-ready building assets**. All pack placeholders have unresolved occupancy and explicit dependencies. An open-stowed door occupies a neighboring wall cell while its two-cell doorway remains vacant; this is not a fully implemented hinged door. The standalone schematic previews use simple cube envelopes rather than approved physical mesh shapes. The individual blueprint IDs must not repeat in a future settlement. M1 architectural variety and creator acceptance still require future inspection.

### Review samples

- r1:house:temperate:small:001 — Foxglove Croft
- r1:tavern:desert:medium:002 — Caravan Shade Tavern
- r1:stable:snow:large:003 — Whitepine Winter Stable
- r1:house:enchanted-forest:large:003 — Elderbough Gathering House
- r1:tavern:mountain:small:001 — Quarry Cup Tavern
- r1:stable:desert:medium:002 — Sandway Covered Pens

Images generated locally under working artifact review directory, not committed to the repository; never claim remote screenshot artifact until actually attached and verified. Dedicated gallery source/testing tools remain separate from production app.

## Added D4 uniqueness regression

A standalone M1-only orientation-invariant structural signature compares four quarter-turn rotations and their mirrors, ignoring material/repaint and room labels. All 45 candidates are pairwise distinct under this test (39/39 native local focused tests pass overall). The second dedicated test constructs a deliberately renamed, recolored mirror of an authored house and verifies its rejection. This does **not** substitute for creator appraisal of meaningful architectural differences or near-duplicate geometry.

### Follow-up M1 refinement and real accessibility audit (2026-11-14)

- Latest verified main caf47776, automation-only incorporation checkpoint 007. Issues #109/#117 and each current manual Pack 1–5 manifest rechecked before changes; biome130 remains opt-in symbolic source without live registry adoption.
- Existing count **45/885** preserved. The 45 actual coordinate-authored candidates now encode **47,696 placed voxel cells**; new interior furniture and stable rails are real authored cells, not a diagram annotation. Individual generator and architectural names/footprints remain deterministic.
- Authored non-cosmetic, biome-specific **physical exterior support and weather profiles** across all candidates; added stable *left and right* stall-edge partitions and four deliberately empty bays, plus room-specific bed, cabinet, bar, kitchen, and tack-area furnishings. These placements retain symbolic unresolved physical assets and are **not live world content**.
- New independent M1-only validator audits all 45 for entry-to-room flood-fill reachability, passable two-high thresholds, foundation under every declared standing voxel, spatial adjacency of named portals to the actual source/target rooms, proper furniture location, physical regional features, and use of exact roster **symbolic asset families** from all five packs. Negative tests catch omitted floor, misleading portal labels, nonexistent roster refs, missing architectural supports, and missing tavern counters.
- **Native local Node 22.16.0: 39/39 tests PASSED** across the complete owned test suites (16 M0 / 12 M1 / 2 D4 / 9 deep acceptance). Exact new PR-head GitHub CI **pending after commit**, not claimed.
- **Genuine Chromium:** 36 new Canvas2D schematic exterior/cutaway screenshots rendered at 667×375, 844×390 and 932×430, six sampled IDs. Local HTTP page navigation was blocked by administrator; browser source was bundled into a real Chromium about:blank page. WebGL2 test attempted and returned **"no WebGL2 context"** in this environment. A true WebGL2 source-served 3D gallery and final asset geometry remain outstanding.
- **Remaining:** hand-fitting unresolved multi-voxel Pack meshes, support/mount and rotation ABI, head/collision/door swing with actual target engine APIs, real rendered WebGL2 when supported, stronger visually meaningful near-duplicate creator acceptance, and all unstarted 840 designs. No user art sign-off or physical-iPhone approval has been asserted.
- **Scope:** only Roadmap 1 source/test/docs; draft PR #121 unchanged in its draft/unmerged status. No world placement, registry updates, save schema, other roadmaps, merges, deployments or v0.11 unlock.

### Late concurrent-main compatibility recheck (checkpoint 008)

After the M1 refinement commit, `main` advanced from `caf47776` to `ac263720` while PR #121 remained draft. Reviewed the exact two-commit diff: `src/live-voxel-world.mjs`, `src/voxel.mjs`, the live-world browser and Node tests, `.github/workflows/ci.yml` and integration/release ledgers. **No manual Block Pack or any of four building-roadmap owned paths changed.** Checkpoint **008** introduces live physical trees, caves and an optional pilgrim court through automation-owned generation, but does not register any of the 12 symbolic `biome130` desert families as live IDs. This is outside Roadmap 1 and cannot be reused as a blueprint merge permission.

The new Roadmap 1 39 native Node tests passed locally on exact authored source blobs. **CI coverage caveat:** current central Actions workflow invokes `npm test` which uses `tests/*.test.mjs`, not nested `tests/building-pool/roadmap-1/*.test.mjs`. Therefore even a green PR #121 CI run checks shared baseline integration but does **not** certify Roadmap 1's dedicated 39 tests. Do not claim exact-head dedicated Node certification until an authorized existing test runner or genuine standalone checkout executes them. Local Chromium did execute actual candidate rendering with Canvas2D; WebGL2 and physical iPhone remain open.
