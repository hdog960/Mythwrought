# MYTHWROUGHT Builder D — D20 authentic roof foundation paths and non-overlapping colored windows

**Source-only isolated development checkpoint (November 22, 2026).** Based on protected baseline and previous isolated branch HEAD `9f83bde02656390f01a5bac4cb1c7eb81bd46a59`. Exact D20 source/test HEAD before this documentation commit: `a9c1172428d47566ffb1cb1f805da9a7631cca30`. Production `main` HEAD verified once `7016e14cd6289f45eaf7fc6a79a362b47996df65`; protected OPEN DRAFT PR #405 `a3ed511def857f612393b3bd2a7d32e91280ed44`, #402 `a6f4b3be7196998150b641a03ed3e260e995c755`, #399 `88e9f9c45ebcca43576bb2031b2ff1b1c1c82d4f` unchanged. **No authorized merge, deployment, release, production or protected PR code changes.** All new work is in the Builder D isolated child branch; all prior W1–W17 authored building-source IDs remain unchanged. No deliberate Actions rerun, cancellation, new workflow, browser suite or new PR. Push-triggered CI was NOT audited; do not claim zero workflows.

## Genuine defects discovered and fixed

**1. D19 roof truss false load paths through original windows.** The previous 95 short trusses / 695 beam cell proposal only checked roof-height wall endpoints. Authentic original 4B source check showed **20/95** proposed spans had an endpoint above Y=3 `window`, not an uninterrupted wall. D20 updates the existing D19 planner to inspect every original structural course **Y=6→0 at BOTH bearings**, explicitly rejecting window, door, AIR or wrong-role gaps and retaining the source-only, fail-closed support contract. The re-selected original candidates now comprise **90 short spans / 676 proposed Pack2 ID61 source cells** across 16 original W16/W17 buildings. Every selected endpoint independently passed all 14 (2×7) source-bearing checks, and the exact original Pack2 ID61 X=north, Z=east axis remains certified. **Zero source voxels overwritten or placed.** This proves proposed original vertical bearing continuity only; physical beam-to-roof contact, live structural loads, snow/cave/terrain safety, real player collisions, iPhone FPS and full unsupported roof-plane coverage still **NOT accepted**. The earlier D19 95/695 numbers are superseded.

**2. Unsupported side-jamb plan rejected, rather than inventing floating pillars.** Authentic source: **1,233** original W16/W17 windows, **1,040 both jambs, 130 one, 63 no jamb**. Exactly **193** need structural side review. An independent original-source survey of **241 missing side-jamb cells** found **zero** with direct Y=2 wall load-bearing, **155** on mapped navigation/floor space and **86** outside the mapped navigation region. Side-cell new pillars are not defensible without new supports and clearance analysis, so **no new wall/column placement is claimed**. The original y=3 window cells do have original wall below and lintel beam above, but this does not replace side-jamb load paths.

## Source-authentic D20 physical colored-window composition

New isolated source files:
- `src/building-pool/roadmap-d/d20-original-culled-cornice-glazing.mjs`
- `src/building-pool/roadmap-d/d20-original-physical-window-mesh.mjs`
- `tests/building-pool/roadmap-d/d20-original-window-cornice-mesh.test.mjs`

The actual original Pack3 **ID121 full open arch** intersects original Pack4 glass: source ID121 has **24 visible AABB intersections per rotation** with clear glass ID159. Fully clipping the arch against Pack4 clear/sun/moon meshes required **756–2,604 opaque triangles**, exceeding the bounded original sample policy of **320 triangles per combined preview**, so it was REJECTED. No original Pack3 full arch or standalone frame is layered on the existing glass.

Instead, D20 uses only the **actual original Pack3 ID120 decorative cornice physical parts** (original palette and source AABBs). It drops each part that intersects **ANY** actual original Pack4 glazing visible, selection or collision AABB. Real original glass IDs **159/160/161** are mutually exclusive D19 source replacements, never stacked. This retains **10–13 of the 15 genuine original Pack3 ID120 parts** per source candidate, leaves zero source AABB overlaps, and does **NOT** fabricate a new existing Pack3 numeric asset. The new candidate is an unregistered **derived composite material-preview proposal**, requiring a later explicitly reviewed renderer/targeting/selection integration. It is **not a structural jamb fix**.

D20 source owner parity fail-closes if the independent original Pack4 `windowShape` visible, selection or collision AABBs differ from its exact original `pack4BuilderAsset` shape, or if the original Pack3 `pack3OrnamentalById(120,rotation)` part AABBs differ from its own declared source boxes. Neither Pack source module was edited.

D20 generates actual **Float32Array** world-vertex buffers, stride **10** (world XYZ, face normal XYZ, authored original tone-color RGBA) for each retained Pack3 physical source part: **12 correctly outward-wound triangles per colored AABB**. Glass opaque/translucent vertices are copied unmodified from the original Pack4 candidate source and translated to the same world cell. It validates source RGBA, normals (including NaN fail-closed), original local [0,1] bounds, whole triangles, total **≤320 per window composition**, and bounded **≤48 KiB per composed window** and **≤256 KiB per source building**. Original material color/shape provenance is retained. Transparency sorting, real GPU upload, alpha blending, collision/picking gameplay correctness, world mounts, screen-space quality and performance remain explicitly **NOT accepted**.

### Actual source-level tests executed (in isolated V8, NOT native Node CI)

- Reexecuted the original `buildDistinctive4B` and `validateBlueprint` for **all 16 exact-source W16/W17 buildings**, using the actual unchanged original source. D19 **90/90 foundation-continuous truss spans**, **676 true unoccupied proposal coordinates**, no original sources overwritten.
- Independently audited all 1,233 windows (jamb counts **1,040/130/63**) and 241 missing-side site candidates (no supported Y=2 pillar proposals). No bypass or fake foundation.
- Executed the actual original Pack3 ID120 ornamental original parts, original Pack4 window shapes, original Pack4 `pack4BuilderAsset`, D19 original single-glazing plan and new D20 preview for **16 buildings**: **193 structurally flagged windows**, **126 physically composed sample sites** and **3,444,480 genuine typed-source preview bytes in aggregate across all 16 buildings**, with **each building ≤256 KiB**. All source AABB selection/collision intersections from retained parts **zero**.
- Focused original Pack3/Pack4 full source case: one clear-glass cell ID159 plus 13 retained colored Pack3 cornice parts generated **156 correctly outward-wound cornice triangles + 60 original glass triangles**, **25,920 actual Float32Array preview bytes**, zero inverted triangle winding; forged NaN normal rejected.
- Two new D20 source modules and D20 targeted test, plus corrected D19 source/test, passed JS source-syntax parsing. **Do not call this native `node --test` execution.** The source links must still be native-imported and tested on a real checkout.

**Previously verified code left untouched and reused**: 285 canonical 4B ID ownership (153 historical accepted, 132 provisional new); original same-category D4 historical strict `<0.89` (complete 3,644-pair final acceptance is still pending), earlier targeted D4 preflights and authentic W11–W13 screenshots at their own source heads. No expensive broad/full CI repeated.

## Exact outstanding gates and handoff

Focused NATIVE Node tests still **NOT RUN**: corrected W14, W15, W16, W17 with strict full D4, existing true Pack1–4 material preview, corrected D19 truss source/test and new D20 physical geometry/negative/source-normal tests. Authored targeted commands:

```bash
node --test tests/building-pool/roadmap-d/d19-original-supported-roof-truss-plan.test.mjs tests/building-pool/roadmap-d/d19-original-exclusive-window-variants.test.mjs tests/building-pool/roadmap-d/d20-original-window-cornice-mesh.test.mjs
```

Native Node is installed in the model's working container but the GitHub repo checkout is not available and github.com DNS cannot resolve; connected MSI is offline per prior one-time check. No native result fabricated or broad CI launched to simulate it.

Still required for release: root 3,644 genuine strict historical/peer D4 pairs, original game WebGL2 667×375 / 844×390 / 932×430 landscape screenshot forensics, finished Manual Five-Pack physical art across all 285 sources, full window side-jamb **193-site** structural remediation and roof spans (only 90 localized source proposals now foundation-safe), original physics/selection, cave/landmark veto, world mount, save and installed iPhone Home Screen PWA/offline/FPS acceptance. **Never merge or deploy without explicit creator approval.**

**Working estimate: 12–24+ focused sessions**, chiefly structural/facade physical production, real original-game acceptance, and authorized integration. Source ownership 285/285 is complete; all 132 newer sources remain provisional.
