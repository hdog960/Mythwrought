# Roadmap A Pack5 — creator-authorized original-game rotated brick edge/pick test

This research continues only from exact isolated previous source HEAD \`68f83033163bed63a1c9fe5056bfe2ba32a5a891\`. Production main \`7016e14cd6289f45eaf7fc6a79a362b47996df65\` and OPEN DRAFT PR406 code HEAD \`1d71f5e37891280a21c777e5189f0762014ed8a9\` are protected and must remain unchanged.

## What this actually tests

The creator authorized a disposable original-game browser fixture test and earlier original source-only tests. Previous authentic [Actions #45089024663](https://github.com/hdog960/Mythwrought/actions/runs/45089024663) already demonstrated genuine original running game WebGL2 render and original MINE for a single default pack5:080 brick: 1512 GPU vertices, 54432 resident bytes, actual 540×335 scene canvas, 11557 strongly changed pixels, original source ray 2.62235316 blocks, MINE aim-away negative and aim-center positive, and temporary sidecar reload deletion. It did NOT cover a nondefault original brick variant/yaw, edge rays, or iPhone.

New **test-only original-game rotated brick** acceptance selects the already-authored original source family \`pack5:080\`, **existing variant \`kiln-soldier-course\`**, **rotation 2**, solely inside one fresh **844×390/DPR1**, service-worker-blocked Chromium SwiftShader local context. Those choices are NOT assignments to any of the 79 Roadmap A A5 building candidates, and do not authorize load-bearing/composition approval. It uses the existing unchanged real \`window.__mythwroughtTest.placeBuilderAsset({asset:'pack5:080', at,orientation:2,variant:'kiln-soldier-course'})\` which delegates through the ORIGINAL \`createManualFivePackLiveBuilder.place\` into the ORIGINAL source-authentic Pack5 geometry, collision, sidecar save and GPU refresh.

Before placement, in the same real original running game and from the **actual game player's sampled eye position**, import unchanged original \`src/camera.mjs\`, \`src/block-packs/pack-5/fixture.mjs\`, \`src/pack5-integration/catalog.mjs\`, \`src/pack5-integration/terrain-buffer.mjs\` and existing original-source-only triangle-ray evaluator. Build a pure in-page research-only original variant/yaw preview (NO game object at this stage) and scan deterministic source-authored brick face edges at ±0.000002 unit offsets. Classify rays into real source-triangle-only, selection-only, both-hit/different-distance or both-miss outcomes. An actual source **triangle-only** ray, if found from this real player pose, becomes the chosen authentic original camera aim. The **actual game's MINE button** must leave the real placed brick intact at such a source-predicted selection miss. If this exact original player pose cannot yield a source triangle-only ray, do not invent one: record the count and skip that particular edge-MINE assertion while preserving other real-game acceptance.

Capture genuine original \`#scene\` canvas PNG images before and after the rotated brick is placed, decode with \`pngjs\`, require >=100 strong RGB-difference pixels AND >=40 strongly changed central pixels, require original GPU resident vertices and bytes, no pending pages, no excessive draw calls. Compare the real image near the central nine-by-nine pixels and report the real count, but do NOT confuse actual image differences with a proven exact raster-edge hit. The real game camera uses unchanged \`setOrientation\` source debug input and its genuine runtime \`eye() / facing()\` for the actual original #dig MINE interaction. Verify aim-away fails to remove the source object; aim at the center removes it; reload the temporary private context and verify removed state and Pack5 editing OFF.

**No actual user-world data or browser profile is accessed**; all test-only Pack5 sidecar writes belong to that newly created private Chromium context, which is closed/destroyed in \`finally\`. No \`src/main.mjs\`, original renderer/shader, original Pack5 families, save format, PWA, original manual five-pack builder nor shared workflow file is changed.

## Test and artifacts

New only:
- \`tests/building-pool/roadmap-2a/roadmap-a-pack5-original-game-rotated-edge-browser.mjs\`: genuine original-game edge/source census, rendered real screenshot comparison and original MINE controls, result staged JSON/PNG hashes, no browser setup outside this test
- \`tests/building-pool/roadmap-2a/roadmap-a-pack5-original-game-rotated-edge-preflight.test.mjs\`: eight scoped original-repo Node safety/source contract checks
- This documentation

One newly isolated CI-only child of the exact source engineering commit must run Node 22.16.0 syntax and only those eight preflight tests, install exactly the earlier proven free CI dependencies \`playwright@1.58.2 pngjs@7.0.0\` and Chromium, then run only this new **single** actual original game browser test. No previously validated broad native/browser suite, no parallel duplicate Actions, no iPhone device testing claims. Always upload the true original-game before/after PNGs plus per-phase JSON outcome even on failure. If source triangle-only edge case isn't available from the real player pose, publish this as a **partial** edge gate, not a success claiming near-edge mismatch reproduction. Never weaken source selection, real GPU/pixel thresholds, real MINE result or schema1 saving constraints to turn the job green.

Previously verified checks reused without reruns: actual original-game default brick [Actions #45089024663], old targeted source framebuffer 9/9 #45084143116, warning classification 8/8 #45078516025, camera projector 7/7 #45076761838, staging 15/15 #45073277516, read-only gate 8/8 #45061280438, camera 7/7 #45057409771, Pack5 live adapter 6/6 #45055300060, triangle source 15/15 #45049471293, 40/40 original producer #45044721507, footprint 9/9+5/5, historic Pack5 24/24 and controlled V8 58/58. Historical old 88 warnings from different 3600-ray grid remain independent, and previous 12 player-center and 14 source pixel-center warning counts are not unique live-game bug counts.

Remaining: separately verified actual *precise source near-boundary* mismatch in real game if not reproduced, real iPhone Safari installed PWA and performance, all 79 original A5 material/yaw decisions, mixed Pack1–5 structural support, 213 unwritten Roadmap A original source designs. Roadmap A baseline remains **207/420 SOURCE ONLY**, other builder roadmaps and all five hourly automations untouched. No merge, deployment or CI cancellation.

## Authentic tested original repository results — R1/R2/R3 audit trail

This is a successful **real original-game** boundary test, not merely read-only geometry research. The three exact GitHub Actions checkpoints must remain individually attributable:

### R1 — narrowly scoped native test failure, browser not started

CI-only branch \`roadmap-a-pack5-original-rotated-edge-chromium-ci-20261122\` HEAD \`f6d3f1870c7961f046e14d23dedddd8638ed978e\`, original research implementation commit \`348200bac15b80235c86ce850b19f62d08580033\`. Original repository Node native preflight **7/8 PASS** in [Actions #45092305261](https://github.com/hdog960/Mythwrought/actions/runs/45092305261). The one failed test mistakenly expected literal \`source.place('pack5:080',...)\`, while the actual new browser script properly calls \`fixture.place(...)\`. This was a **new test assertion typo**, not an original Pack5/game implementation defect. Chromium was NOT executed in R1. Exact isolated fix to only that preflight test committed at \`38f58682368e926e805185ff8345f825530e0ef0\`.

### R2 — real nondefault original game visual/edit PASS; near-edge sample selection incomplete

CI-only branch \`roadmap-a-pack5-original-rotated-edge-chromium-r2-20261122\`, exact HEAD \`10570762bee1b0dae0dc22b9a75b803499df5f2f\`. [Original repository Actions #45092400516](https://github.com/hdog960/Mythwrought/actions/runs/45092400516): 8/8 targeted native tests PASS, one actual unchanged original \`main.mjs\` Chromium WebGL2 game PASS.

Real original game in one NEW disposable 844×390 context, actual \`#scene\` bitmap 540×335, **test-only original kiln-soldier-course variant yaw2** via unchanged real five-pack builder/physical Pack5 layer/seed sidecar: **1908 original real GPU vertices; 68,688 bytes resident; 1 GPU draw call; 14,202 strongly RGB-changed original scene pixels; 86 strong differences in a 9×9 crosshair-near neighborhood.** The actual original game MINE aimed AWAY retained the brick, MINE at its original camera center removed it, and private sidecar reload confirmed deletion.

**Crucial R2 limitation:** 2,430 genuine source ray probes from real player camera pose found **2 triangle-only hits** (authored/staged mesh hit but original detailed selection missed) plus **146 differing hit-distance warnings**. However, the browser harness stored only the first 20 warning examples. Both rare triangle-only rays appeared outside the retained sample slice; it accidentally chose an **ordinary differing-distance** warning for its first edge scene, so the real triangle-only source-predicted miss **was NOT exercised** by R2. The R2 result must not be cited as rare triangle-only edge-game acceptance. Artifact [#14781203823](https://github.com/hdog960/Mythwrought/actions/runs/45092400516/artifacts/14781203823) retains the R2 real game PNG/JSON.

### R3 — actual original-game triangle-only edge selected and real MINE result VERIFIED PASS

Fixed source-only test harness plus native preflight at **isolated implementation commit \`30e7bccb2c36f0ba47a860229ffec073f47bc182\`**. The fix **does not truncate rare warning candidate selection to the first 20 examples**: it independently retains the first original triangle-only, selection-only and hit-distance warning over ALL 2430 sampled original source rays; it FAILS if original triangle-only candidates were found but were not actually selected. The browser acceptance additionally REQUIRES at least one actual strongly changed original-canvas RGB pixel inside the 9×9 neighborhood around the crosshair while aimed at that exact edge. No original source authored geometry, shader, player, save, production code or previous workflows were changed.

**[Exact original repository Actions #45092582089](https://github.com/hdog960/Mythwrought/actions/runs/45092582089) COMPLETED SUCCESS** on dedicated CI-only branch \`roadmap-a-pack5-original-rotated-edge-chromium-r3-20261122\` exact HEAD \`ac1c2d96b4f37141a841da0611158c0bccd6f24a\`. **8/8 new native Node 22.16.0 preflight tests PASS, zero failed; actual original-game Chromium SwiftShader WebGL2 rare-edge pixel and original MINE PASS; no broad CI suite.** This real original game used one disposable 844×390 browser context and no player-owned saves.

Exact native original-game R3 test log:

\`\`\`json
{
  "result": "PASS",
  "viewport": [844,390],
  "canvas": [540,335],
  "variant": "kiln-soldier-course",
  "rotation": 2,
  "originalPoseSourceRayCount": 2430,
  "sourceTriangleOnly": 2,
  "sourceBothHitDistanceWarnings": 146,
  "selectionOnly": 0,
  "chosenEdgeClass": "triangle-only",
  "trueTriangleOnlyEdgeMineTested": true,
  "originalRealMineRetainedOnSourceTriangleOnlyEdge": true,
  "realGpuVertices": 1908,
  "realGpuBytes": 68688,
  "realGpuDrawCalls": 1,
  "strongChangedActualCanvasPixels": 10914,
  "center9x9StrongChangedPixels": 37,
  "trueEdgeMineRetainedIfSourceMiss": true,
  "aimAwayRetained": true,
  "actualGameMineRemoved": true,
  "temporaryReloadAbsent": true,
  "realIphoneSafari": false
}
\`\`\`

**What R3 actually demonstrates:** On one real original player/camera pose and research-only **kiln-soldier-course / yaw2** original physical brick, genuine source-staged triangle intersection predicted a hit while the original detailed selection ray MISSED. The original game was definitely running its actual WebGL2 renderer and drew source-backed Pack5 geometry (1,908 vertices / 68,688 bytes / 1 draw call). Two genuine original game canvas screenshots at that edge aim differed by 10,914 strong RGB pixels overall, including **37 strongly changed pixels in the 9×9 pixel cluster around the mathematical crosshair**. A REAL game MINE button press AT this particular source-predicted edge miss **left the same actual original game brick in place**, consistent with the source-selection miss. Aim-away MINE also preserved it. Moving aim to its center and pressing the REAL game MINE button removed the brick; disposable sidecar reload confirmed it was absent and editing OFF. **No original user world, user browser profile or installed PWA ever opened.** Real screenshots and original test JSON and hashes: [GitHub artifact #14782385585](https://github.com/hdog960/Mythwrought/actions/runs/45092582089/artifacts/14782385585), file size 129603 bytes, available at last verification.

**Interpret carefully:** This is now a **verified real-game near-edge rendering versus detailed-selection disparity** in ONE original source-authored variant/rotation, not a generic theorem that every source geometry edge fails. Actual neighboring pixels changed; this does not identify which GPU fragment covers the mathematical ray x=0,y=0 (the original 540×335 game canvas has an EVEN width and ODD height, so the exact mathematical center X is between two physical pixel centers). Screenshot temporal changes can contribute some RGB difference; the real original fixture was unquestionably GPU-resident and the source ray/MINE behavior was observed, but do not claim the single exact ray had actual raster pixel coverage or independently prove isolated occlusion from the screenshots alone. **No physical iPhone Safari, installed PWA, touchscreen, real-device GPU performance or FPS** was measured. The 12 warnings in the earlier 420 source camera grid, 14 source pixel samples and 88 warnings in another historical 3,600-ray grid remain separate; no sums are unique real in-game failures.

### Outstanding Roadmap A gates and protected production

Next engineering should analyze the physically honest cause of original rendered source triangles versus Pack5 detailed selection AABB edge gaps, including rotation mapping, Float32 conversion and tolerance, and develop an isolated proposed solution with source/actual-game RED/GREEN acceptance as needed. **Do NOT silently expand the original selection AABBs to cover empty air or weaken the game reach/terrain occlusion checks.** Any future original production code change requires an explicit owner-controlled integration review; no main or PR406 source movement in this session. Extend one research variant/yaw at a time. The original user has not chosen production A5 materials/yaw or certified structural load paths.

Roadmap A still **207/420 SOURCE ONLY (213 unwritten)**, original 79 A5 physical candidate designs, historic 128 commerce/345 industrial/315 government unchanged. Protected main \`7016e14cd6289f45eaf7fc6a79a362b47996df65\`, protected OPEN DRAFT PR406 code HEAD \`1d71f5e37891280a21c777e5189f0762014ed8a9\`, other builders, five hourly automations, shared workflows, schema1 real user saves, installed Home Screen PWA and locked v0.11 untouched. **No merge, deploy, other-developer edits, CI cancellations, real user-world writes, structural/creator approvals or production source modifications.**
