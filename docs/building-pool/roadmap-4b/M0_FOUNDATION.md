# Mythwrought Builder 4B — M0 Safe Lane Setup

**Status:** Initial isolated, unmerged theoretical-design candidate. No live game assets or structures created. Do not treat this note as creator acceptance.

## Source-exact startup audit — 2026-11-15

- Infrastructure prerequisite: merged PR [#178](https://github.com/hdog960/Mythwrought/pull/178), candidate head 7f7431f97a137c89d900735758b3cd2d183ea47b; merged main baseline e6bd7c173a4531ba7efc153e5f2eb89870c3b9db. PR-head verification run 43762245025 completed successfully, including full browser regression; this is not evidence for 4B's own new PR.
- Governance source: docs/INTEGRATION_CHECKPOINTS.md; latest documented incorporation checkpoint at audit: **009**. Also read Issues [#109](https://github.com/hdog960/Mythwrought/issues/109) and [#117](https://github.com/hdog960/Mythwrought/issues/117), docs/building-pool/EIGHT_LANE_ROSTER.json, docs/building-pool/EIGHT_LANE_CONTRACT.md and docs/building-pool/roadmap-4b/PRELAUNCH.md.
- Original four draft building PRs remain unmerged: [#121](https://github.com/hdog960/Mythwrought/pull/121) 88a9e410, [#124](https://github.com/hdog960/Mythwrought/pull/124) 07c45d27, [#122](https://github.com/hdog960/Mythwrought/pull/122) e35b8eca, and original Roadmap 4 [#123](https://github.com/hdog960/Mythwrought/pull/123) 56433063. No source paths from these PRs are copied or modified. Sibling 1A–4A owns disjoint categories and paths in the merged roster.
- Legacy Roadmap 4 PR #123's M1 category-matching migration set is **empty**: 30 original authored structures are civic hall/castle-palace and belong in 4A, not 4B. The explicit zero-inheritance source record counts exactly **0** inherited. No schema fixture or sample is counted as a building.
- Manual Pack 1–5 integration exists on main from PR #174 and exposes **96 family symbols / 106 physical variants** in src/builder-assets/manual-five-pack.mjs. The dry-run builder ABI is not world placement authorization. Automated biome130 is independently managed; asset availability and source-exact dimensions, rotation, mounting, transparency, collision, save orientation and live world height remain per-design acceptance dependencies.

## Exclusive immutable allocation

| Category | Per biome × size | Total |
|---|---:|---:|
| Healers House | 5 | 75 |
| Library | 4 | 60 |
| Schoolhouse | 4 | 60 |
| Magical Research Institute | 3 | 45 |
| Arcane Academy | 3 | 45 |
| **Total** | **19** | **285** |

All five categories cover temperate/desert/snow/enchanted-forest/mountain and small/medium/large. Isolated source contract schema.mjs generates and validates all 285 stable original-category IDs (r4:...), tests actual integer coordinate geometry, two-cell entrance headroom, walkable support, room footprints, connected navigation and typed unresolved material dependencies; rejects palette/translation/mirror/turn duplicate architecture. The candidate manifest records actual authored/approved/integrated counts separately. Nested native tests exercise this contract; they do **not** constitute finished buildings.

## Scope and immutable gates

Exclusive writable trees: src/building-pool/roadmap-4b/, tests/building-pool/roadmap-4b/, docs/building-pool/roadmap-4b/. No changes to runtime, world generation, other builders, original PRs, five Block Packs, biome130, automations, schema-1, saved worlds, GitHub Pages, CI or integration checkpoint. **No merge or deployment.** Gate A v0.10 remains open; v0.11 locked. Physical-iPhone controls/artwork and creator acceptance not claimed.

## Native / browser evidence

The new draft PR's required exact-head CI must run the lane native Node tests and focused actual Chromium smoke/layout. At M0 there are **0 real 4B building candidates**, so no 4B candidate WebGL2 exterior/cutaway screenshots exist or are claimed; fixture validation is not a rendered candidate. Record exact-head workflow results once available. Legacy Roadmap 4's WebGL2 captures do not count as Builder 4B coverage.

## Next controlled milestone

**M1:** Author first genuinely distinct 4B geometry with complete interior room placement, structural support, weather-facing roof, actual walk route, proper doors, typed physically sourced asset dependencies. Then inspect current-source exterior and cutaway at 667×375, 844×390 and 932×430. Keep all candidate geometry under the new dedicated draft PR. Do not advance M2–M4 quotas by renaming or mirroring fixtures.
