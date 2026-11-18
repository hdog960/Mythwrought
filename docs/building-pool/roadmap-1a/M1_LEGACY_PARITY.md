# Builder 1A M1 — exact-source legacy migration (30/30)

**Source baseline:** original [PR #121](https://github.com/hdog960/Mythwrought/pull/121) exact head `88a9e410a0eda7cf961cb6b624241666eb3a48a1`, still DRAFT and unmerged.

## Exact inherited source
- Original generator blob `7187753ae344217d7fa81da296b9122b68f3ca97`, original design matrix blob `f9d45b0b17cbc217fd24cba5f684eb54aa572cd5`, schema blob `ea1cb53b48dd7f4c51c8da69bf59531d1226aad2`, multi-cell footprint blob `0a0401d88a491b8b1fba4edf7d3a23f5673633f7`.
- The unchanged original code was executed and **only house + tavern** records selected. The new 1A-only generator removes the stable layout, stable furniture, stable design rows and stable iteration without editing the old original. Evaluating the original and migrated generators yielded exact serialized object equality **30/30** and **33,555 3D placement anchors**. This validation was performed in an isolated JavaScript execution environment, NOT native Node.
- `legacy-reference.json` stores 30 per-ID baselines generated on the **untouched original** source BEFORE extraction. FNV-1a-64 (UTF-16 code units) fingerprints cover full stable serialized candidate data and independent structural geometry, together with footprint/room/walk counts. Actual Node native tests now assert these immutable original-derived references; inspect exact HEAD CI result separately.
- Preserve original `r1:house:<biome>:<size>:001–003` and `r1:tavern:<biome>:<size>:001–003` IDs. The four roots `schema/designs/buildings/footprints` are now 1A-only; no Builder 1B stables are imported.

## Status
| Type | Target | 1A actual geometry | Newly authored outside PR #121 | Creator accepted | Integrated |
|---|---:|---:|---:|---:|---:|
| House | 300 | 15 | 0 | 0 | 0 |
| Tavern | 75 | 15 | 0 | 0 | 0 |
| Inn | 75 | 0 | 0 | 0 | 0 |
| **Total** | **450** | **30** | **0** | **0** | **0** |

- The enchanted-forest medium house daylight cell **[8,6,6]** and enchanted-forest small tavern **[5,7,6]** were physically open in original PR and remain unchanged. Both have `daylightApproved:false` and `weatherSealApproved:false`. The original stable aperture belongs to Builder 1B.
- The merged 96-family/106-variant five-pack catalog exists on main, but this source-exact migration does NOT prove actual final Pack1–5 collision AABB, roof seam support, glass/door yaw state or roof load. Legacy unresolved candidate occupancy remains explicitly provisional, not actual production physical fit.
- True 1A authored building WebGL2 review at 667×375, 844×390, 932×430, creator art acceptance, physical iPhone testing, schema-1 sidecar checks and final settlement integration are **NOT complete**. Browser smoke on the general CI lane is not evidence of an authored building preview.
- Entire change is under 1A-owned source/test/doc prefixes. Main and PR #121–124, seven sibling builders, five automations, asset packs, saved worlds, Gate A and locked v0.11 remain untouched. Do not merge or deploy.

**Next:** inspect fresh exact-HEAD CI, fix actual evidenced failures only inside 1A; then build a full original Inn exemplar, source-authentic Pack ABI preflight, and genuine source-driven WebGL2 three-viewport cutaways.
