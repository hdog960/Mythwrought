# Builder 1B — M1 initiated: legacy runtime parity + first community bathhouse

## Starting technical evidence
- Base `main` `e6bd7c173a4531ba7efc153e5f2eb89870c3b9db`, incorporation checkpoint **009**, infrastructure #178 merged.
- M0 PR #184 at `4fa2a5478e9163db06d8e17a94feb73c06e2614a` passed exact-head CI [#43767265277](https://github.com/hdog960/Mythwrought/actions/runs/43767265277): **6/6 Builder 1B native**, **735/735 root Node**, **12/12 CI contract**, and **real existing-game Chromium smoke/layout**. This browser result is NOT a render of any Builder 1B candidate building.
- Original read-only PR #121 current exact HEAD `88a9e410a0eda7cf961cb6b624241666eb3a48a1`, open, draft. Its 15 historic stable IDs and original geometry are unchanged in this lane.

## M1 independent original-vs-migrated source-run parity
The new nested native `m1-parity.test.mjs` fetches **unaltered original source** through `git show 88a9e410a0eda7cf961cb6b624241666eb3a48a1:src/building-pool/roadmap-1/…` on the CI clone; checks exact SHA-1 Git blobs against the pinned inheritance ledger; uses a separate temporary directory and **real Node ESM import** to run the original 45-building generator; filters ONLY 15 stable identities; compares all 15 full deterministic serialized coordinate placements, rooms, portals, walkable cells, unresolved physical dependency references and geometry fingerprints against the new Builder 1B outputs. If Git objects are unavailable, fail closed. No original files/PR writes. Result is pending exact new PR-head CI, not yet claimed passed.

## Original M1 exemplar: Thimblebrook Public Baths
- New owned `m1-bathhouse-temperate-small.mjs`: **one actually authored, distinct 15×9×17 physical coordinate candidate**, ID `r1:bathhouse:temperate:small:001`.
- Explicit full stone base, four-block-high perimeter, two-cell public entry, eight real glazing cell anchors, internal separating masonry/timber partitions, five named functional spaces, independent physical circulation/room portal graph, timber roof deck and raised passive lantern, supported ceiling beam anchors, benches, supply fixtures and fully coordinate-authored stone-rimmed empty basin.
- No fake functional water, steam, plumbing, gameplay interaction, working heating, livestock or NPCs. Symbolic `pack4:030` pane shapes/rotation/transparency require exact physical source-level compatibility and save ABI review, so they stay unresolved in the blueprint dependency ledger.
- `m1-bathhouse.test.mjs` includes real native source execution, structural/physical cells, physical headroom checks, actual room/portal connectivity, deterministic serialization and quota census. Source code is not a render; M1 visual acceptance still requires genuine candidate WebGL2/physical family preview at **667×375, 844×390, 932×430**, exterior/cutaway. Existing CI browser smoke of the game is not this preview.

## Exact counts (on source commit, pending CI acceptance)
- Stables 15 inherited of 75; bathhouses **1** authored of 60, **59** remaining; farm-barn 0/60; greenhouse 0/60; fishing lodge 0/60; harbor office 0/60; lighthouse 0/60.
- Total **16/435 authored candidates**, including **15 inherited, 1 newly authored**, **419 unauthored**, **0 creator-approved**, **0 integrated or world-placed**.
- Weather seals, roof structural spans, actual physical support, glass orientation/collision and all production substitutions remain unresolved. Next milestones need additional genuine distinct coordinate-authored exemplars and full 5-biome × 3-size category quotas.

**Only Builder 1B source/test/docs paths changed.** PR #184 remains draft; original #121 unaffected; no world, engine, save, CI, Block Pack, biome130, sibling, Gate A, v0.11, merge or deployment changes.

## Native connectivity preflight correction (before M1 acceptance)
A conceptual 2D reachability model of all standing cells found the initial design disconnected: the interior door was blocked at `(7,1,2)`, the main basin access at `(7,1,10)` was isolated by a partition, and both basin-side walkways were sealed at `z=11`. The Builder 1B-only correction opens **(7,2), (7,10), (2,11), (12,11)** as physical two-high clear passages; the original public entry and 5-space plan remain unchanged. Added explicit regression checks for those coordinates. An independent grid BFS with occupancy fixtures modeled now visits **98/98 standing cells**; this is a model preflight, not a native-source or PR-head CI pass. Dedicated native Node `validateBlueprint()` checks must independently confirm.

## Source-authentic roster correction
Read current integrated `src/builder-assets/manual-five-pack.mjs` and Pack 5 roster before candidate acceptance: `pack5:090` is **Ovens & Cooking Ranges**, not suitable for bathhouse linen storage. Two candidate towel/wash supply fixtures are now real, plain `live:wood` full-cell counter anchors instead of false oven family IDs. Clear glass `pack4:030` remains an unresolved physical window/rotation/attachment adapter. There is **no** invented towel-storage gameplay, no water/steam simulation, and no Pack5 oven in the bathhouse. Test acceptance for this correction still requires latest PR-head CI.
