# Roadmap 1 — Homes & Regional Life (independent building blueprint pool)

**Status:** M0 initial isolated contract. 0 of 885 authored blueprints. NOT integrated, placed, merged, or deployed.

## Locked quotas

Each number below is **per size, per biome**, across 3 sizes and 5 biomes.

| Category | Each size/biome | Total |
|---|---:|---:|
| Houses | 20 | 300 |
| Taverns | 5 | 75 |
| Inns | 5 | 75 |
| Public bathhouses | 4 | 60 |
| Stables (no animals) | 5 | 75 |
| Farms/barns | 4 | 60 |
| Greenhouses | 4 | 60 |
| Fishing lodges | 4 | 60 |
| Harbor offices | 4 | 60 |
| Lighthouses | 4 | 60 |
| **Total** | **59** | **885** |

Biomes: Temperate, Desert, Snow, Enchanted Forest, Mountain. Sizes: small, medium, large. Identical building IDs may never repeat inside one settlement. Each candidate must have independent structural layout, not a recolor, mirror, or renaming.

## Coordinate contract

Local voxel coordinates [x,y,z], with x=east, y=up, z=south. Footprints use [width,height,depth] extents. Each authored placement supplies [x,y,z], structural role, symbolic physical asset ref, explicit orientation and occupancy. Full/partial occupancy requires local normalized 6-number AABB; unknown family dimensions require {kind:'unresolved',bounds:null,reason:...} plus an unresolved dependency record. No implicit final bounds, orientation, IDs or live integration. No shared engine imports.

References: live:stone/wood/etc are the **actual currently registered ID 1–8 families**; pack1:001 through pack5:096 use their proper pack family roster positions (subject to source manifest lookup before use); biome130:001–130 is the automated catalog. These are **symbolic identities, never assigned numeric persistent IDs**. A future substitution needs occupancy, orientation, collision, selection, mount/support, alpha and save-ABI validation. Plan with unresolved values rather than pretending a candidate has live dimensions.

Rooms are bounded [min,max] local volumes, portals are explicit room/exterior connections at walkable cells, and walkable cells form a continuous voxel-cell path. The M0 validator checks unique coordinates, occupancy metadata, connected circulation and reachable room labels; **it does not yet prove headroom, stair slope, door swing or actual physical-iPhone traversal**. These remain M1/M5 requirements. Compound and multi-cell specialty parts must be decomposed or explicitly deferred; occupancy overlap is rejected until safe layered geometry semantics are authored. The material-agnostic fingerprint catches exact painted copies; mirrored, rotated and near-duplicate structure detection and creator review are outstanding M1–M5 work.

## Milestones

M0 schema, manifest, coordination and Node tests, draft PR; M1 representative houses/taverns/stables in all 5 biomes × 3 sizes (counted only when genuinely authored); M2 all 300 houses; M3 210 taverns/inns/bathhouses; M4 375 stables and regional-life structures; M5 review all 885 with unique layouts, regional logic, real occupancy, accessibility, deterministic interchange, independent previews and genuine Chromium/WebGL2 screenshots (667×375, 844×390, 932×430). No NPCs, animals, harvesting, merchants, business functionality or world generation.

Owned paths only: src/building-pool/roadmap-1/, tests/building-pool/roadmap-1/, docs/building-pool/roadmap-1/. Never edit shared code, manual packs, auto catalog, checkpoints, CI, saves, world generation, or deploy. Gate A remains open and v0.11 locked.
