# Roadmap A Pack5 — ORIGINAL framebuffer pixel-center versus player center-ray source acceptance

## Engineering question

Previous original-source Pack5 engineering verified both authored fired-brick source variants/yaw 2–3 against the exact original \`main.mjs\` analytic terrain shader projector: 420 player **mathematical center** camera rays, original staged triangle and projected-center geometry identical in tested arithmetic, but 12 original selection-vs-projection warnings (6 staged-triangle-only, 6 differing distances), all authored seam-sensitive; an unrelated 3,600-ray old grid retains 88 separate raw warnings. These are **not** real mobile GPU or player-visible failures.

One important omitted detail: Mythwrought renders into an actual framebuffer using \`bufferDimensions(canvas.clientWidth,canvas.clientHeight,renderPreset,devicePixelRatio||1)\`. Pixel centers need **not** coincide with the player's mathematical \`forwardVector()\` ray. For **even** framebuffer width/height, a crosshair at NDC (0,0) is BETWEEN the nearest pixel centers. Rasterizing just beside a selection boundary may show nearby fragments even if mathematically centered source shape selection misses. This study uses **unchanged authentic original source** to classify that ambiguity without touching actual worlds, renderers or browser storage.

## New original-source-only producer

\`src/building-pool/roadmap-2a/roadmap-a-pack5-framebuffer-pixel-risk-producer.mjs\` imports only the unchanged originals and previously authenticated Roadmap A source-only analyses:

- Original \`src/main.mjs\` 10 exact rendering/forward-eye/Pack5-ray contracts, original \`src/render-budget.mjs\` full \`bufferDimensions()\` and \`pixelBudget()\`, original \`src/camera.mjs\` \`clampLook()\` and \`forwardVector()\`.
- Actual original Pack5 \`resolvePack5BuilderAsset\`, \`makePack5Fixture\` and \`pack5TerrainVertices\` source geometry (9-float Float32 triangle staging). For each of the EXACT 12 existing 420-ray camera warning witnesses, original selected variant/yaw is temporary RESEARCH-ONLY; no A5 asset decision or real placed object.
- Original main shader 72-degree tan-based projection; for a physical framebuffer pixel with top-left index \`(i,j)\`, its **center** is NDC \`x=2*(i+.5)/width-1\`, \`y=1-2*(j+.5)/height\`. The corresponding source-only camera ray is the NORMALIZED \`forward + right*x*aspect*tan(36°) + up*y*tan(36°)\`. Compare real source indexed/staged triangle ray hit vs mathematical triangle projected to that exact sample NDC; recover correct perspective distance using \`z=1/sum(lambda_i/z_i)\` and the ray's forward dot product. Separately intersect original detailed physical selection ray at the same pixel-center ray. **No actual GPU fragment, depth buffer, triangle raster rules or texture pixel is measured**.
- Four original CSS \`844×390\` original render-budget alternatives, preserving original DPR and render presets rather than inventing a framebuffer size:

| Original mode / DPR | Authentic buffer from original \`bufferDimensions\` | Nearest central pixel count | Does player center ray coincide with an exact pixel center? |
|---|---:|---:|---|
| Balanced / 1 | 844×390 | 4 | No |
| Balanced / 3 | 1266×585 | 2 | No |
| Battery / 3 | 717×331 | 1 | Yes |
| Economy / 3 | 548×253 | 2 | No |

The framebuffer dimensions are **source-math outputs for hypothetical DPRs**, not observations on real user's installed iPhone or any captured WebGL framebuffer.

Each original warning gets **nine** nearest-center source sampling rays across the four profiles, **12 × 9 = 108 source-only pixel-center rays**. Every sample records genuine original Pack5 source-triangle hit, analytical shader projection hit, and original detailed selection hit. The original *mathematical center selection* result is preserved separately: a real player's active original selection ray remains the forward vector, **not** an arbitrary nearest pixel-center ray. The odd×odd 717×331 battery profile is a useful exact-center control; its one central pixel is at NDC (0,0). Zero source triangle vs mathematical projection differences is an enforced gate in this bounded sample, not a claim of GPU pixel coverage.

The producer refuses baseline drift from the previous **12 actual warnings**, original source/shader projection mismatch, altered main rendering/Pack5 editor contract, changed pixel-budget sizes or unexpected source-to-projected ray divergence. Returns bounded per-warning/profile/pixel evidence and separately counts source-only potential selection/pixel disagreements. It never writes the original world or Pack5 saved sidecar.

## Focused targeted original-repo native tests

\`tests/building-pool/roadmap-2a/roadmap-a-pack5-framebuffer-pixel-risk.test.mjs\` covers:

1. Original \`main.mjs\`, original \`render-budget.mjs\` and original \`camera.mjs\` source-authenticated.
2. All four authentic original render-budget dimensions and exact 9 nearest pixel samples.
3. 844×390 mathematical center lies *between* pixel centers; 717×331 center aligns exactly.
4. Source pixel camera ray is original forward vector at exact center across multiple yaw/pitch.
5. Original GLSL projected source triangle perspective distance equals independent analytical ray distance in a known off-axis planar example.
6. All exactly twelve previous original Pack5 source warnings checked against 108 new pixel-center sample rays; no phantom extra/missing warnings.
7. Preserve mathematical center player ray distinct from nearest pixel and print precise source-only totals, with original projected source triangle parity.
8. Reject invalid framebuffer indices, fake infinite camera eye, invalid sample rays.
9. Explicit no GPU, no actual game player/HUD/interaction, world/edit/save, iPhone/PWA, structural load or creator art/material/yaw approval.

Run a **new one-time original-repo Node 22.16.0 CI-only child** on the source commit; syntax-check only own-lane source/test and run the nine new native tests. No broad browser/Chromium/pixel captures, no duplicate historical CI, no original production source alterations. If source parity fails on the new samples, preserve numerical discrepancy as risk rather than claiming the game is fixed; only isolated source/test code may change.

Previously verified and reused: original 8/8 exact 12-warning source classifier Actions #45078516025; authentic original 7/7 main shader projection #45076761838; 15/15 original source vs staged mesh #45073277516; 8/8 browser readiness #45061280438; 7/7 original camera sparse/dense #45057409771; original Pack5/legacy occlusion 6/6 #45055300060; 15/15 source mesh #45049471293; old 40/40 original producer #45044721507; 9/9 footprint core + 5/5 physical producer; historic original 24/24 Pack5 and controlled-source V8 58/58.

## Explicit unfinished acceptance and protected refs

Actual original game renderer may produce no fragments, sample pixel centers differently due to GPU coverage/precision/clipping/depth/fog, or terrain may occlude Pack5. Nearest source pixel ray is **not** original player's own mine/place target; only a separately authorized disposable original-game Pack5 fixture + WebGL2 actual image/depth/picking/HUD interaction can verify that. A physical iPhone Safari Home Screen PWA acceptance is a separate device gate. The previous optional read-only main-game boot/browser pilot is still unrun, and does NOT place a Pack5 fixture if run.

No real A5 designs, author material/yaw choices, mixed Pack1–5 wall/floor/roof support, structural load, actual physics or creator acceptance. Roadmap A remains **207/420 SOURCE ONLY with 213 unwritten**; historic 128 commerce / 345 industrial / 315 government, original 79 A5 candidates all untouched. Protected main \`7016e14cd6289f45eaf7fc6a79a362b47996df65\`; protected OPEN DRAFT PR406 CODE HEAD \`1d71f5e37891280a21c777e5189f0762014ed8a9\`. Other builders, five hourly automations, preexisting shared workflows, schema1 saves, installed iPhone PWA and locked v0.11 untouched. No merges, deploys, CI cancellations, source/gameplay/world edits or approval.

## Actual authenticated source-native checkpoint — November 22, 2026

Source-only engineering commit \`6a38fd57fd8e19a81e326ad98789c0ee09809686\` is a direct child of the previous exact isolated \`384067cac7479bdc6fea989b92b4d74a3901dd46\`. A **separate CI-only child** \`roadmap-a-pack5-framebuffer-pixel-native-ci-20261122\` exact HEAD \`ae3c4cf13fd5518a91983d31e144130044d261ed\` contains identical source code and only a one-time branch-exclusive workflow file. Native original-repository GitHub Actions [#45084143116](https://github.com/hdog960/Mythwrought/actions/runs/45084143116) **COMPLETED SUCCESS — nine focused Node 22.16.0 tests PASS, zero fail**, with new source/test syntax checks passing. No full CI, browser, actual GPU or other developer runs executed.

**Exact source-only native diagnostic:** original **12 exact warning witnesses**, **108** independently sampled nearest framebuffer pixel-center mathematical rays across four unchanged original frame-buffer size profiles; **103** genuine source staged-triangle ray intersections; **97** original source detailed Pack5 selection-box ray intersections; **0** original staged-triangle ray versus main shader analytically projected triangle discrepancies; **14** source selection-versus-projected-triangle warnings across these 108 mathematical sample points. **12/12 warning witnesses had at least one nearby mathematical source triangle hit; zero witnesses had no nearby triangle hit.** The original player center-ray warnings remained **12**. The 717×331 (battery, DPR 3) profile is the unique odd×odd source-profile test with a pixel mathematically centered on the crosshair for all twelve witnesses; 844×390 (balanced, DPR 1) has **four** nearby pixel centers, none precisely at (0,0).

Original fixed source profile and count report:

\`\`\`json
{
 "profileSizes":[
  {"preset":"balanced","dpr":1,"framebuffer":[844,390],"crosshairAtPixelCenter":false},
  {"preset":"balanced","dpr":3,"framebuffer":[1266,585],"crosshairAtPixelCenter":false},
  {"preset":"battery","dpr":3,"framebuffer":[717,331],"crosshairAtPixelCenter":true},
  {"preset":"economy","dpr":3,"framebuffer":[548,253],"crosshairAtPixelCenter":false}
 ],
 "totals":{
  "originalWarningWitnesses":12,"actualFramePixelSamples":108,
  "pixelSourceTriangleHits":103,"pixelSourceSelectionHits":97,
  "pixelSourceVsProjectedTriangleDisagreements":0,
  "selectionVsProjectedPixelTriangleWarnings":14,
  "sourceOriginalCenterRayWarningRemains":12,
  "warningsWithAnyNearPixelSourceTriangleHit":12,
  "warningsWithNoNearPixelSourceTriangleHit":0,
  "originalCenterCrosshairAtPixelCenterProfiles":12
 },
 "priorIndependent3600SourceGridWarnings":88,"realGpuPixelsObserved":false
}
\`\`\`

**Interpretation boundary:** The word "pixel" refers here ONLY to evaluating source authored geometry at hypothetical *pixel-center coordinates output by the unchanged original render-budget math*. No fragment shader was run. A source triangle can mathematically intersect a pixel-center camera ray yet still be occluded, clipped, blended, culled by a different rule, absent from a loaded GPU page, or fail actual WebGL2 raster coverage. Even the mathematically center-aligned battery framebuffer is **not** physical iPhone evidence. The 14 warnings are separate samples from the previous 12 original center warnings and the earlier **88** warnings in a different 3,600-source-ray grid; they are **not** counts of unique on-screen failures, and their populations must not be added.

The original game uses the forward-vector center ray for actual player edits, not any pixel-center ray. Actual original viewport scaling and graphics depth, Pack5 page residency, world terrain occlusion, HUD target, mobile controls and game playback remain untested. A separate authorized disposable-game real Pack5 fixture acceptance test, with authentic pixel readback and original player interaction, is still necessary. Future live test design should check source camera precision and the actual game render framebuffer together without writing a user save. No source shape hitbox or GPU shader was changed in this checkpoint.

**Preservation:** protected main \`7016e14cd6289f45eaf7fc6a79a362b47996df65\`; OPEN DRAFT PR406 code HEAD \`1d71f5e37891280a21c777e5189f0762014ed8a9\`; Roadmap A **207/420 SOURCE ONLY with 213 unwritten**, historic 128 commerce/345 industrial/315 government and original 79 A5 source candidates, other builders, five automations, all shared CI, schema1 saved worlds, installed PWA and locked v0.11 untouched. No real A5 material/yaw choices, structural approval, merge, deploy, CI cancellation, actual world edits or source gameplay changes.
