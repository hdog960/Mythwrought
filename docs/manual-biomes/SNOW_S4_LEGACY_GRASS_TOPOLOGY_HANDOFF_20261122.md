# Snow S4 legacy-grass topology: isolated research handoff (2026-11-22)

## Ownership and immutable refs

- Production `main` was independently compared with `7016e14cd6289f45eaf7fc6a79a362b47996df65`: identical.
- Protected OPEN DRAFT PR #358 remained at `59e449be7e73b25f259c4c72855cfb638a056517`: identical.
- This source-only research branch was created from existing isolated commit `ad75fc94b22f1f9fc420fcf2231e3e242811b065`.
- All new writes belong ONLY to `research/snow-s4-legacy-grass-topology-isolated-20261122`. No merge, deployment, production game import or protected ref movement is authorized.

## Engineering added

- `src/manual-biomes/snowy-s4-legacy-grass-islands.mjs`: read-only, 2–128-column rectangular connected-component census derived from genuine `inspectSnowS4Transect` S4 source provenance.
- `tests/snowy-s4-legacy-grass-islands.test.mjs`: six focused Node tests with explicitly synthetic terrain/cave fixtures.
- `tests/snowy-s3-s5-real-m7-gate.test.mjs`: small additive integration assertion for the 36-column x=13..18, z=508..513 original M7 two-seed smoke. Not a new broad CI job.

The census reports retained legacy-grass components, exact sampled cell coordinates, 2D bounds, fill ratio, original 16x16 chunk crossings (negative coordinates included), authored snow contact edges, protected cave/edit/legacy contacts, and unknown exterior edges. A component that touches the observation rectangle boundary is explicitly OPEN: it cannot be misreported as a fully observed island.

Original authored snow, protected historical groves, saved player edits and cave AIR remain untouched. A bounded before/after witness checks each sampled original column plan, cave overrides for Y=1..19 and schema-1 save source; this is NOT a whole-world proof. The module is never imported by production `main.mjs`, a terrain generator or a renderer. It does NOT recolor grass, guarantee an aesthetically repaired snow biome or authorize replacing historical vegetation.

## Evidence and remaining blockers

Focused isolated Node 22.16.0 test result: **6/6 PASS**, no broad CI run created; standalone code syntax check passed. New code and test files were independently fetched back from GitHub and their Git blob IDs matched local `git hash-object` byte-for-byte.

The two preexisting original-world tests did not reach gameplay assertions in the previous partial local checkout because `src/manual-biomes/profile-world.mjs` and its import tree were absent locally. GitHub fetch at the pinned isolated source commit confirms `src/manual-biomes/profile-world.mjs` exists remotely (Git blob `a8d236ae0ea5ed383ddd8f8542714fc9136d8f30`). This is a local source-availability blocker, **not** evidence the actual original M7 test passes or fails. Do not weaken these full-game tests or claim original-world, WebGL2, iPhone or Home Screen acceptance.

## Next original-world gate (do not duplicate existing CI)

In a real full original-source checkout pinned to the exact isolated branch HEAD:

1. Run `node --test tests/snowy-s4-legacy-grass-islands.test.mjs` if the SHA differs from the independently verified fixture result.
2. Run the already-authored `node --test tests/snowy-s3-s5-real-m7-gate.test.mjs` once against the real `FourRegionWorld`, original cave reader, `voxel.collides` and S4 sources. This reuses the existing two-seed native gate rather than creating another expensive Actions workflow.
3. Use the census results to distinguish safe-to-review authored-snow seams from cave, protected grove and player-edited areas. Do not blindly erase grass patches or expand world-generation writes.
4. Preserve S1 glacier tint source, S2 cap investigations, S3 trees, S4 seam evidence, S5 existing non-block scenes and the other 12 developers' independent work. Any subsequent visual fix must still pass actual WebGL2 and iPhone Home Screen performance/visual acceptance before creator-approved merge or release.

This checkpoint is **research evidence only**, not production snow overhaul acceptance.
