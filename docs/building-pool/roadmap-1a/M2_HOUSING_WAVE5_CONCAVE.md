# Builder 1A — M2 fifth wave: genuine L/U concave houses

**Draft/isolated only:** PR #180, main checkpoint 009, prior exact HEAD `d502c5c41eeeeb942f04ba349f43f5005ecdf83f`, original source PR #121 `88a9e410`; no sibling, manual pack, biome130, automation, runtime, save, CI or deployment changes.

## Architectural source contribution
15 entirely new biome × size unique houses built from literal integer-coordinate room, partition, hinged-door portal, AABB-family symbolic placement and roof-wing descriptors. New `exteriorNotches` is **opt-in** to these 15 designs and cuts a real exterior-facing geometric opening out of the foundation, all 4-high perimeter walls, y4 roof backing, pitched roof and source walkable mask. Source-authored exposed notch edges have true new walls; genuine outdoor L/U rear courts have **no hidden floor or roof voxels**. Not merely a rectangular shell with a different roof.

New wave = **52,722 authored 3D voxel placement anchors** and **2,455 genuinely removed exterior footprint cells**. 15 house blueprints validated independently; revised Enchanted Medium now has six distinct interconnected rooms after a source-measured near-duplicate comparison. Maximum normalized floorplan intersection-over-union among all newly authored previous 60 houses and wave5 is **0.654**, below 0.88 reject threshold.

Protected earlier **99/99** complete blueprint JSON objects compared byte-for-byte before compiler commit; the **99-object fixed full-serialization regression fixture** is now included in native tests. Original 30 legacy designs and seven sibling builder branches left untouched.

**Exact candidate counters:** **114/450** = **93 Houses**, **17 Taverns**, **4 Inns**. 30 inherited + 84 new. **336 remaining:** 207 Houses, 58 Taverns, 71 Inns. M2 house 150 milestone **93/150**, 57 houses remain. **0 creator approved, 0 integrated, 0 placed, 0 deployed**.

## Native / visual verification (not yet certified at current HEAD)
Per-building tests: all 114 IDs and D4/reflected unique geometry; 99-old complete JSON parity; real footprint concavity and exposed outer wall heights, removed all 3D cells in void, supported roof risers, full connectivity from entrance to rooms, bed AABB double-cell reservations, source Pack 1–5 96 family/106 variant producer audit, and genuine roof family shape support. Target genuine Chromium SW-WebGL2 source-cube **86 candidates × 2 exteriors/cutaways × 3 iPhone landscape-size viewports = 516 captures**. Producer-defined physical `visibleBoxes` source AABB **40 candidates × 2 × 3 = 240 captures**. Keep these renderer modes clearly distinct from final premium material and integrated game-world visuals. **Do not claim passed until exact-head GitHub Actions and artifacts are checked.**

Remaining gates: pack producer inventory is still `productionRegistered:false`; no physical iPhone acceptance, roof load/weather approval, Pack2 hinge swept volume/save sidecar, Pack4 glass transmission, Pack5 bed world collider/variant restoration, nor creator approval. PR remains draft/unmerged/undeployed; v0.10 Gate A open, v0.11 locked.
