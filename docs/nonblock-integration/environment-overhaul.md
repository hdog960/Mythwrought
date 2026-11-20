# Environmental overhaul

This work continues draft PR #285 from the RC11 reconciliation at `28c329f56d2873be2fd33c882f74c89aef2f280b`. The complete non-block catalog and its interaction evidence remain the existing inventory. The combined release also needs the repaired biomes and deterministic habitat placement. [Catalog and interaction evidence](catalog.md) · [RC11 reconciliation](release-hold.md#published-rc11-baseline)

## Creator footage

All six November 20 clips were inspected across their full ten-second spans. The filenames identify the original recordings by UTC timestamp.

| Recording | Visible defect |
| --- | --- |
| `18-19-39-252Z` | Enchanted ground alternates dark, pink and mint cells. Large gray depressions interrupt the floor. |
| `18-23-24-041Z` | The enchanted–mountain boundary reads as two checker patterns. Temperate trees sit on rectangular grass islands. |
| `18-24-58-379Z` | Mountain color changes at individual block faces. The stepped secondary boxes repeat across broad ridges and around gray cutouts. |
| `18-25-39-444Z` | Sand and red dune caps alternate like paving. Temperate canopies and green ground reach into dry terrain. |
| `18-27-26-281Z` | Grass forms a narrow bright strip and scattered isolated cells between special biomes. The desert approach has a steep gray opening. |
| `18-30-40-467Z` | Snow and ice take on a repeated blue checker pattern. Broadleaf trees stand on green patches around an exposed depression. |

The live biome mesh previously chose one authored swatch for the entire face from a coordinate hash. In pale dune sand the chosen swatches span RGB `(189,160,110)` through `(249,232,188)`. Mountain cliffstone spans `(52,60,72)` through `(201,192,169)`. The profile renderer now uses continuous world-space tint on natural biome terrain. Player-placed blocks still use the authored swatches. The face mesher also culls faces covered by opaque full cubes and keeps a stone wall visible beside a partial neighboring shape.

The older terrain writer protected tree and landmark volumes by rejecting the entire column. That left legacy grass and lower ground around many trees. Several mountain and enchanted ground IDs used partial shapes. The combined profile resolves ordinary tree provenance independently from authored landmarks and uses solid terrain IDs for complete ground cells.

## Combined release work

The V7 generator uses existing desert and snow cubes, six solid mountain and woodland ground materials, and five full-block canopy and bark materials. The ordinary LOAD / CREATE action and a fresh install choose V7 for unused seeds. Previously selected, explored, or saved worlds open under their stored identity. V7 composes the existing four verified entrances, deep vaults, east gallery, and surface transition into the same world as the five surface biomes. Creature ecology and the sky read that same world. The vault and mirror retain the generation profile with Schema-1 edits and Pack 2 state.

The live scenery planner adds at most 27 local surface or cave placements. It verifies actual solid attachments, waits for their terrain chunks to be resident, and retains stable anchors when an edit or physical build blocks them. Existing removal records preserve a mined object's absence. The first matched 932×430 WebGL2 captures cover all five biomes on seed 179, and a real MINE tap followed by reload preserved the streamed clover-patch removal without changing Schema-1 bytes. These captures used diagnostic camera positioning. The separate 844×390 browser check opened both fresh and previously saved seeds through the ordinary flow and exercised the new world's night sky and device backups.

1. Capture matched views in the actual game and verify the renderer against ordinary terrain, edits, and cave openings.
2. Give physically changed terrain an explicit generation profile. Keep the existing profiles as the authority for older saved edits. Select continuous solid surfaces, keep decorative shapes for actual outcrops, and use deterministic climate-aware trees while protecting legitimate cave and landmark cells.
3. Extend the existing staging habitat rules into bounded world streaming. Reuse world-scoped instance IDs, authoritative mounts, removal tombstones and physical ownership. Test ordinary and cave saves separately.
4. Repeat ground-level and Creative views across seeds and landscape sizes. Check transitions, face continuity, chunk crossings, collisions, mining, reload, and performance before preparing the original Home Screen update. Both workstreams enter the same release only after the combined gates pass.
