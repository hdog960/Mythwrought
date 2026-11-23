# Roadmap A — exact original R3 real-game triangle-only edge physical precision autopsy

## Source of truth and exact authenticated actual-game witness

The user-approved original game disposable WebGL2 test [Actions #45092582089](https://github.com/hdog960/Mythwrought/actions/runs/45092582089), R3 Chromium SwiftShader, completed **SUCCESS 8/8 native + genuine actual-game edge MINE** on CI-only HEAD \`ac1c2d96b4f37141a841da0611158c0bccd6f24a\`. Its original uploaded [artifact #14782385585](https://github.com/hdog960/Mythwrought/actions/runs/45092582089/artifacts/14782385585) was **actually downloaded and the original JSON inspected** in this session, not merely inferred from log summaries. Authentic original evidence JSON SHA256 \`62708fb82618278225cbc1b092ba68e4ff204ced436fed2fa30f2de2e6d5103d\`.

Exact measured original-game source shape/ray sample:

- Original Pack5 physical symbol \`pack5:080\`, existing source-authored \`kiln-soldier-course\` test-only variant, yaw2. In disposable game placed at **[3,14,0]** through unchanged original five-pack builder (verified schema1 and seed-scoped private sidecar); *this is not an A5 building material or orientation decision*.
- **Original real-game player eye [0.5, 13.55, 0.5]**; original camera yaw \`1.757786033928741\`, pitch \`0.5099378275702837\` radians. Original test-only target relative to the brick \`[0,0.972998,0.027]\`.
- Original **Float32 GPU staged mesh triangle ray hit \`2.915244810989979\` world block units**, original **detailed physical AABB selection null**, and **actual original in-game MINE button at this exact edge retained the brick**, with real game message \`No Pack 5 shaped object targeted\`.
- Original real game rendered the brick into a 540×335 actual canvas with **1,908 GPU vertices, 68,688 resident bytes, 1 GPU draw call**, and measured 37 strongly changed screenshot pixels within the 9×9 crosshair-near region. This does NOT mean a GPU pixel exactly at the mathematical center ray was observed. After returning to the brick center original game MINE removed it; temporary private-sidecar reload confirmed absence.
- The previous R3 source grid tested 2,430 rays, with 2 original source-triangle-only cases, 146 hit-distance comparisons and zero selection-only; separate 12/14/88 historical source grid warnings remain distinct.

## New genuine original-source, zero-production-mutation engineering

\`src/building-pool/roadmap-2a/roadmap-a-pack5-exact-r3-edge-precision-autopsy.mjs\` replays **the exact authenticated original-game ray**, from the *existing* original \`forwardVector()\`, using the *existing* original \`PACK5_BUILDER_FAMILIES\`, \`makePack5Fixture()\`, \`resolvePack5BuilderAsset('pack5:080','kiln-soldier-course')\`, \`orientedParts()\`, \`pack5TerrainVertices()\`, and original source \`sourceRayTriangleDistance()\`. Source makes **no changes** to original game \`main.mjs\`, production AABB/raycast, mesh, shader, selection, collision, save, or sidecar.

It independently calculates four **separately identified** physical ray categories:

1. **Unchanged fixture detailed AABB selection** (authoritative on-screen player MINE control, with normal world occlusion in the real game). Model separately reimplements exact original double-precision three-axis slab test against unchanged original rotated authored selection boxes to guard against hidden fixture changes. It must reproduce **NULL** at the original R3 miss.
2. **Float32-quantized source AABB** — same original physical boxes only, with their coordinate endpoints rounded using JavaScript \`Math.fround\` as the original GPU source mesh vertices are; for forensic comparison ONLY, no production hitbox/selection padding or GPU selection claim. If it admits the ray while authored boxes miss, the source precision change is a plausible contributor, not proof that a GPU fragment was rasterized.
3. **Original source-authored Float32 triangle ray with the already-existing \`sourceRayTriangleDistance()\` barycentric slack** \`u>=-1e-7,v>=-1e-7,u+v<=1+1e-7\`; it must reproduce authentic original R3 hit distance **2.915244810989979** within 2e-6. That original helper is SOURCE RESEARCH ONLY, not the actual original live player selection implementation. The relaxed barycentric epsilon may admit rays that are mathematically outside the triangle by an extremely small amount; do not equate it with true GPU pixel coverage.
4. **Independent STRICT triangle barycentric intersection** with no permissive edge inequalities, from the exact same genuine original Float32 staged triangle positions, identifying whether the relaxed source ray hit survives a stricter mathematical interpretation. If it does not, the earlier source "triangle-only" category is inherently an uncertain near-edge analytic artifact, even while the original game definitely rendered adjacent pixels and the original MINE missed.

For the exact R3 ray, independently report nearest actual authored box, Float32 quantized box, strict/tolerant triangle distances and triangle barycentric margins, reconstructed world hitpoint and geometric distance from that point to the original authored selection-box union. Repeat the exact original input at **seven authored face-Y perturbations** [-1e-5,-2e-6,-1e-6,0,+1e-6,+2e-6,+1e-5] without moving an actual game/player/world; classify every valid independent comparison and report a bounded JSON native diagnostic.

The two forensic alternate models are read-only *ideas*, **NOT production repairs or authorizations**: picking the nearest actual triangle could hit internal hidden faces or bypass original terrain occlusion, original six-block reach, original shape/collision ownership and mobile CPU budget. Snapping source AABB coordinates to Float32 could introduce empty-space hits and change support/collision expectations. Neither can be merged as a "fix" without new source and true-game RED/GREEN acceptance proving no new incorrect picks. **Never pad hitboxes into empty air or weaken original checks to make tests pass.**

## Targeted original-repository tests

\`tests/building-pool/roadmap-2a/roadmap-a-pack5-exact-r3-edge-precision-autopsy.test.mjs\` (eight NEW native tests):
- Fail closed on unchanged original fixture / barycentric helper / Float32 mesh code drift.
- Verify exact authenticated artifact SHA, original camera and original in-game R3 source witness all reproduce with existing original repository source.
- Verify exactly 1,908 genuine Float32 stage vertices, 636 original render triangles and actual original authored box count.
- Explicitly distinguish strict triangle mathematical hit vs original tolerant triangle hit and original authored box vs Float32 source-box.
- Original independent signed ray/box slab unit examples, pathological NaN/zero rays.
- Independent mathematical triangle barycentric interior/outside/parallel cases.
- Seven original near-edge authored face-Y shifts and no silent selection changes.
- Strict guarantee no original gameplay/save/iPhone/production/source-building changes or structural acceptance.

Run **only** one exact native Node 22.16.0 original checkout on a dedicated CI-only child branch; compile/syntax-check only the two new files and run the eight new tests. Reuse the fully verified previous genuine game [#45092582089], initial real default game [#45089024663], prior native warnings [#45084143116], [#45078516025], [#45076761838], [#45073277516], [#45061280438], [#45057409771], [#45055300060], [#45049471293], [#45044721507] and historical original Pack5/footprint/V8 evidence; DO NOT rerun them. Native source-only autopsy never claims a new actual game/GPU/iPhone run.

## Protected ownership / remaining Roadmap A gates

Production main stays exact \`7016e14cd6289f45eaf7fc6a79a362b47996df65\`; protected OPEN DRAFT PR406 code HEAD \`1d71f5e37891280a21c777e5189f0762014ed8a9\`. Only own-lane new research source, tests and document; no shared workflow edits (CI-only child owns a unique workflow), other builders, five hourly automations, schema1 saves, installed PWA, locked v0.11 or original world mutation, no merge/deployment/cancellation.

Roadmap A remains **207/420 SOURCE ONLY with 213 unwritten**; historical 128 commerce/345 industrial/315 government unchanged, original 79 A5 candidates and final art/structural choices still reserved. Next engineering step depends on exact native classification: investigate the source-authenticated cause, prepare *isolated* alternative non-padding ray ownership with full terrain occlusion/6-block reach/CPU boundedness, then if warranted one further disposable **original game** real on/off-pixel/MINE RED/GREEN test. iPhone Safari installed PWA and actual mixed Pack1–5 structural loading remain separate acceptance gates.

## Exact authentic native R1 autopsy result — 2026-11-22 local / 2026-11-23 UTC

The first new exact native original-repository [Actions #45097712195](https://github.com/hdog960/Mythwrought/actions/runs/45097712195) ran the actual authored original Pack5 code under Node 22.16.0. **Seven of eight targeted new tests passed; one negative-input unit test failed ONLY because its error-regex expected \`/precision/\` whereas the producer intentionally emits \`Roadmap A original exact R3 shape/mesh edge diagnosis: ...\`.** The real source geometry and witness validations, source original vs quantized boxes, barycentric, original strict triangle and seven micro-shift grid all PASSED, and the actual native diagnostic printed the exact numerical finding before test failure:

\`\`\`json
{
 "classification":"relaxed-barycentric-original-source-only-hit",
 "relaxedOriginalSourceTriangleDistance":2.915244810989979,
 "exactTriangleDistance":null,
 "float32BoxDistance":null,
 "originalSelectionBoxDistance":null,
 "relaxedTriangleMinimumBarycentric":-3.367090616210211e-9,
 "originalSourcePoint":[3,14.972998,0.026999999999999802],
 "originalBoxUnionSeparation":2.220446049250313e-16,
 "float32BoxUnionSeparation":7.003547741746274e-10
}
\`\`\`

**Substantial root-cause correction to the preceding R3 interpretation:** The original research \`sourceRayTriangleDistance\` allows up to **1e-7** negative barycentric margin. The R3 recovered exact ray has **-3.367090616210211e-9** minimum barycentric coordinate; it is **strictly outside the original Float32 triangle** while the original permissive source helper calls it a triangle hit. Original detailed selection AABB **misses** and Float32-quantized original AABB **also misses**. Repeating the exact eye-ray aim at seven original face-Y offsets from -1e-5 to +1e-5 gave source-helper hits over six positions but **zero strict triangle hits at all seven**. The "2 triangle-only source" R3 count is thus not, by itself, evidence of real original GPU pixel coverage at either exact ray. The native result reconciles the real original player MINE miss with strict geometry, without falsely declaring the game’s selection hitboxes defective or modifying production.

The 37 actual changed nearby pixels in the earlier real game screenshot cannot isolate exact mathematical center-raster coverage. **Withdraw the stronger previous claim that this exact R3 ray demonstrated a confirmed original renderer-versus-selection gameplay defect.** R3 remains a genuine real-game check of a near-edge scene and MINE behavior; its source helper's non-strict hit interpretation was misleading. Other 146 R3 differing-distance warnings, independent earlier 12/14/88 source-only counts, and real iPhone pixel/target behavior are separate open questions. No automatic hitbox padding, disabled occlusion or production triangle picker is justified by this witness.

The isolated native test correction changes only its NEGATIVE-INPUT expected error-text regex and adds a new **ninth fail-closed real-witness regression test** which now asserts the observed strict triangle null, original authored AABB null, Float32-quantized AABB null, and **negative but admitted barycentric margin**. This is not a weakened game acceptance; it preserves a sharper, more cautious physical proof. Re-run only these nine new native original-source tests on a separate CI-only child; do not repeat any prior broad CI or Chromium runs.

## Additional exact game-source fidelity boundary: TWO float32 roundings (full-grid planned)

Further inspection of unchanged original \`src/pack5-integration/construction-layer.mjs\` establishes the **live game** mesh source executes:

\`\`\`js
translated[i]=result.positions[i]+record.anchor[i%3];
\`\`\`

where \`translated\` is specifically a **Float32Array**, and \`result.positions\` is **already** the original mesh local Float32Array. The R3 original research browser script by contrast used \`stage[k*9]+cell[i]\` in JavaScript Number arithmetic. That *research-space double addition* can differ from the **actual renderer world-space Float32 triangle vertex**; it is important not to conflate them. The original game's actual \`pack5TerrainVertices(layer.meshAt(...))\` positions are subsequently stored in yet another Float32 staging array. None of this necessarily means the real source selection ray should change; it means the previous source-math replay was missing one authentic quantization boundary.

The new source autopsy now contains a separately authenticated **non-production true GPU world Float32 staging emulator** \`originalR3ActualGpuWorldFloat32Staging\`, with exactly the same local Float32 plus anchor then new Float32 assignment. The original box-coordinate quantization model has likewise been corrected to quantize the local authored coordinate FIRST and world anchor addition SECOND. The original R3 **research-double** witness is preserved separately and must still pass its exact old source classification; the new actual renderer-space triangle representation must be reported independently rather than silently rewriting old original evidence. New original-source contract check verifies the unchanged \`construction-layer.mjs\` Float32 translation line.

A new bounded \`auditOriginalR3CompletePlayerPoseSeamGrid()\` reproduces the **ENTIRE** original exact R3 *2,430* source-ray probe grid, including **all** original source warnings, instead of extrapolating from only the first recovered triangle-only witness. It computes, for each ray, original detailed AABB selection, original tolerant *research-double* triangle intersection, strict research-double triangle, **strict actual world-GPU Float32 triangle**, tolerant actual-GPU Float32 triangle and double-quantized original authored box model. This specifically answers whether **both** R3 "triangle-only source" cases were permissible numerical research hits and whether the *genuine renderer world Float32 geometry* mathematically intersects some original source selection-miss rays. It does NOT read actual WebGL pixel coverage, run a browser or change any production source.

An expanded **11 new focused native tests** demand exact 2,430 grid counts matching authentic prior R3 output (2 source-triangle-only, 146 different hit-distance, 2301 both hits, 127 both miss), plus independently log **true-GPU Float32 world strict/relaxed counts**. The new counts are intentionally **not guessed in advance**: they will be sourced from a new native original repository run and may change the final diagnosis. This distinction is critical for avoiding false claims of production correctness or defects. Continue to prohibit automatic hitbox padding, user-world edits, migration or unsafe selection replacement.

## Authentic first full-grid CI check, and exact normalization repair

The original full-grid Node CI [Actions #45098096521](https://github.com/hdog960/Mythwrought/actions/runs/45098096521) ran the expanded source code and passed **10/11 new focused cases**. All original exact R3 single-witness tests passed and measured **2,988 actual world-space Float32 coordinate values that differed from research-space double translation** over the 1,908 staged original source vertices. At the exact selected original R3 ray the strict research-space triangle and strict actual renderer-space Float32 triangle BOTH returned NULL; the source research epsilon test returned distance \`2.915244810989979\`, the actual world-Float32 epsilon test \`2.9152448109899796\`. The original detailed AABB and independently quantized Float32 AABB also returned NULL. This supports the **narrow exact R3 relaxed-barycentric explanation** even after adding authentic game-world Float32 vertex translation.

The **one failed case** was the expanded full 2,430-ray ledger: some original camera \`forwardVector\` outputs are only nearly unit length, not bitwise unit length. The unchanged \`makePack5Fixture().raycast\` calculates \`length=Math.hypot(...direction)\` then \`unit=direction.map(v=>v/length)\` BEFORE original slab ray intersection. The new independent box comparator had used the raw near-unit vector; at floating-point grazing boundaries its comparisons could legitimately differ from the real original fixture. This is a **forensic test model fidelity bug**, not proof of a production hitbox bug. The isolated comparator has been corrected to copy this exact normalization, and the source drift guard explicitly checks the unchanged original normalization line. The expanded eleven tests will be executed on a separate CI-only exact child. No original raycaster, selection AABB, shader, renderer, world or A5 source has been edited; no artificial tolerance added.

**Do not claim the full 2,430 strict-vs-GPU Float32 classification is validated before that new native check passes.** The prior 9/9 original exact R3 single-witness native test [#45097845630](https://github.com/hdog960/Mythwrought/actions/runs/45097845630) remains independently genuine/green. Previous real-game R3 WebGL2 [#45092582089](https://github.com/hdog960/Mythwrought/actions/runs/45092582089) stays authentic. Full original game browser/iPhone is not rerun by this source-only diagnostic.

## Exact full 2430-source-ray reconciliation: two tolerance artifacts, zero strict triangle-only gaps

Actions [#45098391774](https://github.com/hdog960/Mythwrought/actions/runs/45098391774) executed the expanded authentic native Node original repository source audit, and gave **10/11 new cases PASS**. The remaining test was the original Chromium vs Node hard-threshold **count equality** assertion, not a mesh/selection integrity failure. The native source produced exact hit/miss agreement with authentic original Chromium R3 Actions #45092582089:

| Metric | R3 Chromium research source | Expanded exact original Node source |
|---|---:|---:|
| Rays | 2,430 | 2,430 |
| Original relaxed-triangle-only hits / selection misses | 2 | 2 |
| Original original selection-only hits | 0 | 0 |
| Both hit | 2,301 | 2,301 |
| Both miss | 127 | 127 |
| Both hit but > 2e-7 distance tolerance | **146** | **147** |
| Strict-triangle-only original research mesh | not measured | **0** |
| Strict-triangle-only actual renderer world-space Float32 | not measured | **0** |
| Both relaxed-only hits with NEGATIVE barycentric margin | not measured | **2** |
| Float32-quantized original selection box hit on these 2 cases | not measured | **0** |

The original R3 Chromium source 146 and newer original Node 147 **must both remain recorded**. Exactly ONE warning straddles a tight 2e-7 measured distance comparator when reconstructed across the two execution environments or their calculations. Its exact cause is NOT yet isolated, and this is not evidence of one distinct gameplay bug. Do not weaken reach/occlusion/selection or falsely report identical numbers. The Native audit acceptance has been corrected to **require** its exact measured 147, preserve the original independent browser 146 and label the gap explicitly, while fail-closing on all 2,430 original hit/miss partitions.

The source-diagnostic's **two complete rare triangle-only witnesses** both have strictly negative triangle barycentric margins within the old source helper's permissive 1e-7 tolerance:

1. Target local \`[0, 0.972998, 0.027]\`, yaw \`1.757786033928741\`, pitch \`0.5099378275702837\`: relaxed source hit \`2.915244810989979\`, **strict research triangle null**, **strict true-world GPU Float32 triangle null**, original authored AABB null and original float32-quantized box null; barycentric margin \`-3.367090616210211e-9\`.
2. Target local \`[0, 0.973, 0.027]\`, yaw \`1.757786033928741\`, pitch \`0.5099384263361656\`: relaxed source hit \`2.9152457872364725\`, **strict research triangle null**, **strict true-world GPU Float32 triangle null**, original authored AABB null and Float32 box null; barycentric margin \`-2.5808197690047052e-8\`. The second actual world-GPU Float32 *relaxed* source intersection is itself NULL.

Original actual-world vertex translation makes **2,988** Float32 coordinate values differ from naive JavaScript double addition over 1,908 source vertices, but does NOT create strict triangle-only selection gaps on the 2,430 original fixed player-pose samples. Original renderer-world positions produce **2,298** strict mathematical source triangle intersections in that grid, and **zero** strictly rendered-triangle-only original selection misses. Actual WebGL raster fragment coverage near the mathematical center is STILL NOT measured; neither count proves all gameplay edge cases on other variants or viewports.

**Consequence:** The original R3 screenshot/MINE observation is genuine, but the two original "triangle-only" analytic classifications were **permissive triangle-helper tolerance artifacts**, not an established production picker error. A production hitbox padding or triangle-picking patch is NOT warranted from these two cases alone. Preserve the real game original selection geometry as-is pending more specific geometric proof. All original authored game source, user worlds, source A5 building variants, schema1, PWA and protected refs remain unchanged.

The corrected 11th test is the same narrow source-only targeted native suite, no browser or duplicate historical broad CI. Once exact new CI completes green, report that complete result and update this checkpoint; do not report this previous 10/11 run as a PASS.
