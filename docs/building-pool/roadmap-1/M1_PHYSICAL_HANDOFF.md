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

## 2026-11-14 physical bed footprint correction — confirmed against latest Pack5

**Critical cross-pack feasibility finding:** Current Pack 5 source `src/block-packs/pack-5/residential-furnishings.mjs` (blob `7e7ffa78176f9f8a806c7274b93df6f4963a23ab`, PR #119) defines candidate bed `pack5:082` with distinct head part `[0,0,0]` and foot part `[0,0,1]`. Prior Roadmap 1 only reserved a single anchor while marking its adjacent bed-foot cell walkable in all 15 houses. The newly introduced `m1-candidate-footprints.mjs` creates an explicit *planning reservation* for the second cell, and `m1-acceptance.mjs` checks actual support, room containment, exact candidate offset, collision avoidance and no walkable overlap. No synthetic live bed is spawned; no new block ID assigned.

- **15/15 residential bed anchors** preserve their original location and symbolic `pack5:082` identity.
- **15 additional cell reservations** prevent planned player circulation through bed feet. They are **not** countable additional physical placement anchors, and are not an approved 3D collision envelope.
- Corresponding fixture is planned **north / Pack5 rotation 0** only. The isolated Pack5 descriptor's other rotation/variant sidecar, complete box unions and safe schema-1 persistence are still not adopted or validated against the live engine.
- The same footprint-reservation audit is not yet generalized to other proposed Pack5 and shaped Pack3 families; any non-unit family must be checked before final M1 integration.
- Exact-source **62/62 native Node** passed in a clean standalone Roadmap 1 reconstruction. **54 Chromium Canvas2D** review captures include purple reserved candidate bed cells; WebGL2 unavailable in this browser context. Still **zero creator-accepted or merged buildings**; 45 candidate IDs and 50,331 authored placement anchors remain unchanged.

## M1 material-accurate exterior and stable-gate update (2026-11-14)

**Pack 2 candidate distinction:** At current #114, `pack2:013` (planed oak plank block) has full-cell AABB `[0,0,0,1,1,1]`. `pack2:014` stripped log has two intersecting *partial* horizontal box unions; `pack2:015` heartwood beam has a narrow horizontal profile. The latter two are structurally **not** complete weather-sealing wall cubes. Roadmap 1 now uses full-volume plank `pack2:013` for the Enchanted exterior wall core and real registered `live:wood` for Snow, keeping log/beam profile as architectural accents/support members instead of pretending every cell is a solid wall.

**Pack 5 candidate distinction:** At current #119, `pack5:079` stucco is a shallow facing with collision only along a thin Z slice. It should be mounted against a genuine structural backing after proper attachment orientation/rotation is approved, NOT used alone as a wall. `pack5:080` fired-brick masonry has a full unit-cube collision envelope, so the Desert candidate wall cores now use 080. A full collision envelope from an **unmerged** candidate still does not count as approved live physics, artistic sign-off or weather sealing.

**Stable gate correction:** Pack 5 manifest `pack5:096` is **NOT STARTED**. Previously Roadmap 1 used its future symbolic placeholder as if it were a physical stall rail. All 60 open-bay passages now have **120 actual live-wood gate-edge block anchors**; each stable preserves four `pack5:096` symbolic future fixture anchors for later dependency resolution. This prevents falsely certifying missing future colliders as installed railings while keeping the planned specialty asset references.

**Independent numeric geometry audit:** 45 unique theoretical candidates, **13,227** physical full-volume wall-core cells, **180** unresolved window apertures, **45** symbolic hinged-door leaf cells, 90 entrance standing cells. The 68-case local native Node regression and 54 genuine Chromium Canvas2D reviewer captures cover these repaired candidate geometries. **Pack 3 roof tile seam sealing/support, Pack 4 actual window AABBs/mount, Pack 2 hinged-door sweep, and Pack 5 bed variant/rotation sidecars remain unresolved**. No live registry edits or saves modified.

## M1 candidate glass yaw, skylight and stepped roof remediation (2026-11-14)

**Pack 4** window source `windows.mjs` at candidate PR #115 (unmerged) has one-cell window assemblies with Y yaw **0–3**, no `up` option. An open frame `pack4:032` does **not** include rain/air sealing glass; `pack4:033` shutters mount on a wall face and are not free-standing window infill. Across 45 proposed building schematics, 180 facade cells now consistently use `pack4:030` clear or `pack4:031` stained panes, oriented per actual wall side. Three former `pack4:030/up` invalid flat skylights have become structurally framed *vertical pane roof lantern candidates*, but the roof remains uncut under each and actual daylight passage, glazing/seal/rotation-state/saves are NOT approved.

**Pack 3** roofing surface source at candidate PR #112 has physical 0.125-unit underlay plus shallow tile detail, not a full solid cell. The Roadmap's roof-step scanner observed **2,519** gaps beneath higher roof courses; **2,309** are backed with existing registered solid `live:wood` or `live:stone` cells. **210** candidate Pack2 horizontal beam or tie-post occupied intersections are **not** overwritten or treated as solid; they remain cell-level dependency entries for real mesh/collision substitution. Courtyards retain their intended open-air roofs. **Safe span, waterproof seams, actual load transfer and roof physical tile meshing remain unapproved**, not silently green.

The source-exact isolated Roadmap 1 nested Node suite now tests **80/80 PASS**. Genuine Chromium Canvas2D diagrams regenerated **54** screenshots at all three mobile viewports; no WebGL2 source-backed model or physical iPhone proof. New total **52,652** authored cell placements, **45 unmerged candidates**, 15 bed-foot footprint reservations, 120 live-wood stall boundary blocks. No shared game/other pack/other building work changed.
