# Builder 1A — M3 Hospitality Wave 4: ten individual source-authored taverns and inns

Source-only [draft PR #180](https://github.com/hdog960/Mythwrought/pull/180); exact previous 214-object green checkpoint `ec6c74fa942876a75cee3ab61a1365f76f35fd33` (Actions [#43984440893](https://github.com/hdog960/Mythwrought/actions/runs/43984440893): 12 CI contracts, 837 repository tests, 297 native tests, 1,116 Chromium source-cell and 840 Pack visibleBox AABB captures). This Wave 4 remains draft-only without production runtime integration.

## Ten original independent regional buildings

Source: `src/building-pool/roadmap-1a/m3-hospitality-wave4.mjs`. Each building has distinct literal integer-coordinate input specifying actual foundation/notched open-air exterior, wall and partition segments, room bounds, reachable two-high door openings, physical producer Pack furnishings and optional reserved beds, supported differentiated roof wings, and walls facing the concave exterior voids. The audited source compiler produces 3D blocks from these fixed individual coordinates, not palette swaps or differently skinned building copies.

| Category | Region and size | Authored building | Source massing and interior program |
|---|---|---|---|
| Tavern | Temperate small | Cedarwick Cider Lantern Tavern | Irregular east-return L pavilion, kitchen/bar, public stage, rear brewery and reserved sleeping quarter |
| Tavern | Temperate large | Hearthwick Westgate Festival Hall | Long T-shaped front feast hall with separate wide guest and staff galleries, stepped rear roofline |
| Tavern | Snow small | Frostknoll Sledsong Tavern | Narrow T-like winter gathering hall, central tavern service, a cask route and small staff bed |
| Tavern | Enchanted-forest small | Dewfire Willowglow Brew Den | Genuine central open-air U courtyard, opposed brewing and performance returns |
| Inn | Temperate small | Dapplewood Four Bridges Guesthouse | West-cut L frontage, separate bedrooms around reception and linen hallway |
| Inn | Temperate large | Whiteoak Harvest Crown Inn | Wide U-shaped courtyard with independently roofed guest-wing returns and reception space |
| Inn | Desert large | Cinnabar Starlight Crossing Inn | True long T-shaped dry caravan front and rear guest family hall |
| Inn | Snow small | Snowcrest Hearthpine Waystation | U courtyard and two distinct rear winter sleeping wings |
| Inn | Enchanted-forest small | Glowroot Foxfire Guesthouse | Recessed L-shaped reception house with multiple physical guest suites |
| Inn | Mountain small | Cobblestep Cloudvale Wayhouse | East-return stone-and-timber guest lodge with linen hall and family sleeping room |

**New source-derived physical metrics:** 92,724 integer-coordinate occupied placement cells; 6,334 truly absent outdoor perimeter columns; 53 bounded functional rooms; 24 Pack5 real source-grounded two-cell bed reservations. Ten of 29 considered candidates passed full source compilation, physically contained fixtures, separate strict 16×16 normalized interior partition Jaccard IoU <0.88 and exterior silhouette Jaccard IoU <0.975 against **all prior 214 objects and newly selected peers**; 19 did not and were **not** counted.

**Protected source history:** `tests/building-pool/roadmap-1a/m3-hospitality-baseline214.json` locks the serialized full source length and FNV fingerprint of all 214 old objects, including all prior 205/191/171 historical cohorts. Wave 4 adds `tests/building-pool/roadmap-1a/m3-hospitality-wave4.test.mjs` to enforce preservation, 224 full source IDs, zero D4 duplicates, physical exterior walls/roof supports, producer Pack source AABB dependencies, connected paths and bed clearance. No previous blueprint geometry is edited.

**Current source inventory:** 224/450 coordinate-authored proposals: 150 houses, 42 taverns, 32 inns. **Remaining:** 226 total = 150 additional house quota, 33 taverns, 43 inns. The first M2 150-house milestone is complete; the further 150 houses remain in the overall plan.

## Mandatory exact-head native and Chromium evidence

- Dedicated `CI_LANES: roadmap-1a` focused source and producer physical tests, including new Wave 4 full 214-source conservation tests.
- Genuine three-size Chromium software WebGL2 source-cell cube diagnostic **1,176 captures**: 196 source-building gallery objects × two exterior/cutaway views × 667×375, 844×390 and 932×430.
- Genuine three-size Chromium software WebGL2 physical Pack1–5 `visibleBoxes` producer AABB diagnostic **900 captures**: 150 source-building gallery objects × two views × the three sizes.
- Review exact-head GitHub Actions job state, logs and ZIP screenshot artifact; independently inspect manifests, PNG dimensions and image validity. Diagnostic GPU geometry is not approved final game-texture art or actual physical-iPhone touch play.

## Hard gate preservation

Candidate blueprints **0 creator approved, 0 runtime registered, 0 world placed, 0 integrated and 0 deployed**. Only Builder 1A-owned `src/`, `tests/`, `docs/building-pool/roadmap-1a/` paths modified. No change to main, sibling builders, shared CI, runtime input, manual packs, biome integrations, saves or Pages. Outstanding independent Pack2 door rotation/hinges/schema1, Pack3 roof weather/load, Pack4 glazing/weather, Pack5 physical bed collision/occupancy/restore, premium art approval, physical iPhone rails testing and user-authorized final integration. Keep **v0.10 Gate A** and **v0.11 LOCKED**.
