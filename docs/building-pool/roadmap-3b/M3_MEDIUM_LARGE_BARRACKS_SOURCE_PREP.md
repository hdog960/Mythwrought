# Builder 3B M3 — Independent medium and large barracks source-authoring preparation

**Source architecture SPECIFICATION ONLY, NOT TEN IMPLEMENTED BLUEPRINTS.** Canonical draft PR #181 remains unmerged, uninstalled and unapproved. The 205 existing theoretical source objects (120 industry, 75 watchtowers, 10 small barracks) remain byte-for-byte protected by this additive document. Nothing below changes the built census, produces gameplay objects, establishes final Pack mesh shape approval, or clears v0.11.

## Allocation and acceptance semantics

The registry allocates 4 variants × 5 biomes × 3 sizes = **60 barracks**, of which 10 small variants are currently source-authored. Next tranche reserves exactly ten *proposed*, **not yet source-authored**, variant-1 slots: five medium and five large. Do not report 215/360 or 20/60 until their complete source coordinates, supported roof voxels, collision-clear rooms, source test and six authentic WebGL2 images per new structure all pass on the same exact HEAD.

All rectangles below use inclusive ground-space **[x0,x1,z0,z1]** within the corresponding width × depth. A “region” is a possible true ground-bearing polygon piece, not permission to fill one enormous rectangular base; cutouts are unoccupied open air from foundation all the way to the skyline. Corridor and doorway connections must be built as real grounded cells and proven by floodwalk. Every structure needs separate accessible bunks, mess, armory, duty, infirmary and drill/storage spaces. Preserve two contiguous floor-supported walk columns with two-clear-high headroom throughout every designated route. Nonrectangular U/L/T/staggered external silhouettes must come from source modules, never a preview shader or decorative text.

## Medium cohort — five original, physically distinct proposed compositions

### 1. `r3:barracks:temperate:medium:1` — River-Reach Open L-Gallery
- Envelope **51×53**, south gate at x=24–25, z=52; long east-west-facing inner parade ground crossing the two-column north-south spine x=24–25
- Ground-bearing region proposals: [20,29,0,52], [1,20,0,17], [29,50,12,34], [3,21,34,51], [31,44,39,51], [7,17,20,30]
- Literal possible courtyards inside wings: [38,42,19,25] and [8,12,40,44], cut through all structural layers
- Bunks in west-north L wing, mess in east-central hammerhead, armory in southwest tail, duty in southeast gallery; infirmary in northwest annex and drill/storage along the central cross-axis
- Supported roof concept: forked **north-south 6-high timber ridge**, **east-west 3-high mess gable**, detached-looking overhangs forbidden; lateral south gallery cap max 2 high with source-bearing corner piers

### 2. `r3:barracks:desert:medium:1` — Ochre U-Arcade Guard
- Envelope **56×49**, south gate x=26–27 z=48; axial central passage x=26–27 and an open eastern caravan courtyard
- Ground regions: [22,31,0,48], [0,22,20,47], [5,20,0,11], [31,55,1,24], [38,55,33,48], [28,41,37,40]
- Courts: [8,14,27,34] and [43,49,9,14] **outside designated two-column patrol paths**
- West dormitory surrounds west court; east mess/well wing surrounds east court; armory north-west, duty south-east, infirmary beside the western arcade, equipment/drill near the south spine
- Roof: low 1–2-step adobe sun terrace over west armory, uneven 4-step shade pitch over mess, distinct 6-high south-east guard vent supported by a true full-height carrier, **no repetitive red perimeter ring**

### 3. `r3:barracks:snow:medium:1` — Whitebreak Deep T-Shelter
- Envelope **49×59**, north-south central spine x=22–23; grounded entry x=22–23 z=58
- Ground regions: [18,27,0,58], [0,18,3,29], [3,18,42,58], [27,48,18,42], [34,47,0,12], [34,47,47,58], [25,39,6,10]
- Courts: [6,11,13,18] and [36,41,25,31] forming true daylight and snow-collection voids, not roof texture
- Main bunk refuge west north, warm mess east center, rescue armory west south, signal duty east north; infirmary east south and drill/storage in the crossover
- Roof: asymmetric **high 7-step pitched northern snow break** and lower 2–4-step south cross-gable; every eave/cross rib must remain face-connected to actual foundation-supported roofing

### 4. `r3:barracks:enchanted-forest:medium:1` — Fern-Crescent Split Pod Fort
- Envelope **58×55**, south gate x=29–30 z=54 and a deliberately *offset* source corridor x=29–30; differing north, east and west elevations
- Ground regions: [25,34,0,54], [2,25,0,21], [34,57,11,36], [0,24,36,53], [41,55,44,54], [40,51,0,7], [31,44,2,6]
- Courts: [10,15,8,12] and [43,47,19,25]; genuine foliage light wells with empty ground, walls and roofs
- West-near bunk hall, east-mid lantern mess, northwest supply/armory, southeast duty; infirmary in the south-west crescent and drill room along offset center
- Roof: west organic 6-high x-ridge, east slender 3-high z-ridge, southern low sawtooth, real independent pillar-supported corner caps; **no floating moss crown** or faux alpha approval

### 5. `r3:barracks:mountain:medium:1` — Quarry-Span Triple Terrace
- Envelope **53×62**, gate x=25–26 z=61; source-backed vertical passage x=25–26 with west and east terraced masses
- Ground regions: [21,31,0,61], [0,21,17,43], [7,21,0,12], [31,52,1,24], [32,52,37,61], [8,22,51,61], [19,36,54,57]
- Courts: [5,10,26,33] and [42,47,44,51]
- Bunks western ridge, mess eastern northeast mass, armory south-east terrace, duty north-west, infirmary west-south and drill at a ground-connected waist
- Roof: split 3/5/7-high stepped quarry ridges with different x/z axes and true six-neighbor bearing; no unsupported high bridge and no physically inaccessible tier

## Large cohort — independent non-scaled proposals

### 6. `r3:barracks:temperate:large:1` — Southfork Quad-Drill Campus
- Envelope **71×68**; horizontal two-wide south gate approach with central north-south cross, four independent quadrants rather than a scaled medium L
- Regions: [0,70,29,38], [32,40,0,67], [0,25,0,26], [44,70,1,23], [4,29,42,67], [43,68,44,66]
- Courts: [11,19,10,17], [53,59,8,15], [10,16,55,60]; six functional rooms in four quadrants plus training yard
- Roof: true 8-high western north gable, 3-high southeast hospitality cap, unequal opposite-direction east main wing, cross-supported central watch roof

### 7. `r3:barracks:desert:large:1` — Saffron Caravan Bastion
- Envelope **74×62**, offset U-chain with a low long arcade and a raised southeast guard hall, unlike the broad four-quadrant temperate campus
- Regions: [26,36,0,61], [0,26,0,20], [2,25,34,61], [36,73,2,28], [47,70,38,60], [18,55,27,36]
- Courts: [7,16,43,50], [47,56,12,20], [57,64,47,53]
- Room separation: 3 two-width independent gallery branches, staff dining and dormitories on different sides of the desert sun court
- Roof: flat **only over planned shaded arcade**, genuinely pitched 3/5/8-high stone-and-brace masses elsewhere, no universal flat-red perimeter band

### 8. `r3:barracks:snow:large:1` — Rimegate Cross Refuge
- Envelope **64×74**, deep narrow north face, multiple staggered cross-wings, and a wide supported emergency rally spine
- Regions: [27,38,0,73], [0,27,2,30], [1,23,51,72], [38,61,0,17], [38,63,28,52], [44,63,59,73], [20,45,35,40]
- Courts: [9,16,12,21], [50,56,37,45], [8,15,59,64]
- Roof: tall 8-high unequal pitched snow ridge, south gable 6 high, east wing 2 high, physically grounded loft braces; source-defined eave vents rather than screenshot shading

### 9. `r3:barracks:enchanted-forest:large:1` — Starroot Offset Octagon Yard
- Envelope **75×72** with asymmetric garden center and crescent-style southwest interior, never a symmetric four-square fort
- Regions: [0,74,29,40], [30,42,0,71], [2,20,4,22], [49,74,5,28], [0,27,40,71], [55,74,37,68], [24,35,50,62]
- Courts: [11,18,12,18], [54,62,10,16], [58,65,54,62]
- Roof: six physically authored alternating organic and peaked segment heights (7/2/5/3/6/4); real struts, no fake crown silhouette or non-physical cutaway fills

### 10. `r3:barracks:mountain:large:1` — Flintspire High Pass Compound
- Envelope **69×78**, axial cliff access with staggered irregular left wings, two heavy right fortification wings and actual roof-bearing cross gallery
- Regions: [25,39,0,77], [0,24,1,24], [7,25,30,54], [0,23,62,77], [39,68,10,35], [43,67,47,76], [18,51,37,45]
- Courts: [9,15,10,17], [52,59,18,24], [50,55,58,64]
- Roof: independent 8/6/3/5 tiers with true source-support footprint and clear cross-axis circulation, not a hollow-looking distant annex

## Required implementation contract (not passed by this document)

1. Independently coordinate-author source cells in Builder 3B-owned `src/` only. Preserve every earlier complete blueprint and full-source fingerprint; **no replacing roof geometry to make a render look better**.
2. Real two-wide, grounded and two-high-clear physical floodwalk to each room, plus a real six-neighbor graph from foundation through every high roof voxel and each decorative support.
3. Reject D4-normalized 24×24 eight-orientation Jaccard **≥0.89** against the complete existing pool **and** all newly authored candidates. Validate whole-volume source identity, not only conceptual footprint and colors.
4. Read-only producer family occupancy checks for all 96 Manual Five-Pack families/106 variants; unresolved per-cell numeric variant, yaw/state, rotated occupied offsets, collision/selection boxes, support/mounting and multi-cell reservation remain explicit blockers. Pack4 supply cells must actually be placed in non-circulation corners.
5. For each source accepted, capture authentic CDP Chromium software-WebGL2 **exterior + cutaway × 667×375, 844×390, 932×430** with original ID, manifest, PNG dimension, nonblank GPU readback, unique hash and independent image review. Cube envelopes cannot stand in for final producer physical meshes.
6. Keep accepted production restrictions: PR #181 draft; no merge, deploy, live structure registration, world placement, save schema edits, shared CI/runtime, sibling builder edits, Pack edits, biome130/automation edits, Creative edits, v0.10 Gate A change or v0.11 unlock.

## Open inherited visual issues

Large desert and enchanted-forest fifth-variation watchtowers have distant remote annexes that read as disconnected in authentic Chromium source screenshots. Repetitive central keep massing and red/gray proxy roof bands also remain open art issues. This future barracks plan does **not** certify or repair those existing sources.
