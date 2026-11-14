# M1 physical asset fit & near-duplicate handoff — 2026-11-14
Status: **OPEN**; 45/885 authored theoretical candidates; zero creator-accepted or placed buildings. Source: PR #121 at review refresh, main checkpoint 008.
All contract observations below come from open manual Pack candidate modules and are **NOT** live engine compatibility claims.

## Physical asset contract audit

| Blueprint reference | Manual candidate origin | Actual current candidate property | Roadmap 1 action / unresolved gate |
|---|---|---|---|
| `pack2:015` | Pack 2 definitions, roster 15; candidate ID 61 not installed | Physical horizontal timber beam, axis x; only four Y-axis quarter turns; thin multi-box cross-section | Crossbeams use `orientation:east`. **Beam strength, safe roof span, anchor attachment, collision and rotation-state adapter NOT approved**; no automatic registry write |
| `pack2:022` | Pack 2 definitions, roster 22; candidate ID 62 not installed | Physical vertical timber support post, axis y, *not rotatable* | Roof tie posts now use `orientation:none`; historical `pack2:015/up` mismatch corrected with negative regression |
| `pack2:020` | Pack 2 joinery, roster 20 | Hinged physical door with open/closed state, rotation encoded as integers 0..3 in isolated candidate fixture | 2-high free portal uses adjacent open-stowed hinge placeholder; `north/south` are blueprint semantics only. Multi-cell height and swing envelope, actual rotation/state sidecar, save and collision unapproved |
| `pack3:023/024/025` | Pack 3 roofing materials | Single-cell partial box unions; actual physical tile mesh occupies a fraction of each unit cell, NOT a solid slab | Blueprint stepped roof shell is authored but **waterproofing / no-gap slope seams / support under tile shapes NOT verified**; future physical placement requires per-tile mesh/rotation adapter |
| `pack5:096` | Pack 5 Interiors roster 96 | Unmerged stall partitions/troughs; family is not live or accepted in all variants | Stable bays are physically open and flanked by authored rails; exact full footprint, mounting, multi-cell offsets, contact and aisle clearance unresolved |
| `pack4:058/059/064`, `pack5:082/085/086/090` | Pack 4/5 interior components | Candidate physical shape/furnishing, various collision and mounting needs | Room-specific authored anchor cells exist, not final bounding envelopes. Validate adjacency, support below each occupied subcell and selection/collision after assets are incorporated |

Source notes: `src/block-packs/pack-2/definitions.mjs` has horizontal beam `axis:x,rotatable:true` and fixed vertical post `axis:y,rotatable:false`; `joinery.mjs` represents doors with state/rotation; `src/block-packs/pack-3/roofing-materials.mjs` uses thin tile AABB box unions; Pack 5 `fixture.mjs` models rotated multi-cell offsets, attachments and floor-supported cells. No numeric block IDs are used by this Roadmap 1 blueprint pool.

## Findings and repairs
- Previous candidate stables silently declared four **hinged** bay portals without door leaves. Real physical gap remains, now labeled `open-stall-bay` with real partition on both flanks; **60** stall bay openings across the 15 stables. Hinged entrances remain explicitly labeled `hinged-leaf`.
- Roof shell had almost no actual structural members between walls and varying roof heights. Added **2,883** actual beam/post cell placements (included in total **50,331** voxel placements), with an unresolved span/strength approval rather than claiming final structural viability.
- Original vertical roof ties incorrectly referenced horizontal `pack2:015/up` (unsupported under Pack 2's available rotation contract). Corrected to fixed upright `pack2:022/none`, with a dedicated negative test.
- Changed six per-design architectural briefs and the regional stable tack-room/stall divider geometry. The earlier **93.84%** nearest normalized same-category resemblance (Desert large Stable versus Mountain large Stable) no longer leads the list.

## Ranked reviewer flags, NOT a pass/fail acceptance threshold

1. Enchanted Forest large House / Mountain large House: **82.20%** normalized structural cell similarity.
2. Snow large Tavern / Mountain large Tavern: **79.25%**.
3. Temperate large Stable / Enchanted Forest large Stable: **76.40%**.

The independent `m1-near-duplicate-review.mjs` normalizes coordinates into 12×12 bins and compares occupancy roles, roof heights and room boundaries while ignoring material colors and blueprint naming. This deliberately flags resized or recolored designs; it is approximate and **cannot certify creator-perceived architectural distinction**. Exact D4 mirror/rotation uniqueness is a separate check (45 distinct candidates).

## Evidence and next gate
- **50/50 native Node 22.16.0 focused cases passed locally** against exact source/test blobs independently verified in PR #121.
- **36 genuine Chromium Canvas2D** exterior/interior screenshots at 667×375, 844×390, 932×430 using a schematic, source-derived renderer. This is **NOT WebGL2 production preview** and images are local, not committed into PR.
- Central GitHub Actions `npm test` runs root `tests/*.test.mjs`, **not** nested Roadmap 1 tests; green Actions cannot be reported as 50-case certification.
- M1 remains **OPEN** for actual WebGL2, physical Pack substitution/rotation/clearance, creator visual uniqueness and physical-iPhone controller acceptance. Main checkpoint 008; no merge, deployment, engine change, world placement, save migration or v0.11 unlock.

## M1 latest material-fit and creative uniqueness addendum

New Mountain **three-aisle** large house and tavern alter walls, doors, room partitions and circulation; no placeholder-only prose design. Desert medium and large stables now use genuinely different internal rear/forward stall dimensions. Enchanted large stable physically changes the roof from monitor to butterfly, without claiming safe water drainage, tile continuity or live physics. Recheck eventual Pack 3 roof family availability and the Pack 2 horizontal-beam/vertical-post interface for these new roof forms.

Physical AABBs remain **explicitly unresolved** for all non-live symbolic parts, which now fails schema validation if somebody pretends they are final or duplicates/omits an asset dependency. Rotation, hinge state, multi-cell support and save-state integration remain BLOCKED until those independent packs are accepted. This session made no changes to manual packs, the biome130 library or common voxel systems.

Nine actual model candidates / 54 Chromium Canvas2D exterior/cutaway samples (3 landscape viewports) produced locally. Visual approval and native WebGL2 still OPEN. Normalized reviewer top similarity now **71.99%**, down from **82.20%**. **56/56 local Node passed, exact PR-head 56-case native reproduction still open**; root Actions does not execute this nested suite.
