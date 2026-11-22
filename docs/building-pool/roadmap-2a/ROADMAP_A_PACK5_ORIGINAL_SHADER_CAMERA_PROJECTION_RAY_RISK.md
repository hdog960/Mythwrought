# Roadmap A Pack5 — original main-game shader camera-center projection and selection-edge risk

## Source-only scope

This checkpoint isolates the **next real acceptance boundary**: before any authorized in-game Pack5 disposable world/pixel test, determine whether the ORIGINAL physical source triangle-ray and original **main game's terrain vertex shader perspective projection** mathematically identify the same center-screen intersection for the original fired-brick geometry. This is deliberately NOT an original game browser run: GLSL shader formulas are read from original \`src/main.mjs\` and evaluated analytically in Node, using genuine original Pack5 Float32 staged triangle positions. **No GL shader executes, no browser/game/world/player/sidecar is mutated, and no A5 source material/yaw is chosen.**

Prior original-source work proves the indexed physical source triangles and its actual 9-float source staging are position-identical for these fixtures (new source native 15/15 Actions #45073277516; 432 source ray probes, zero source-vs-staged triangle ray disagreements). Yet an earlier fixed 3,600-ray source grid revealed **88 source selection-box versus authored triangle boundary grazing warnings**, not verified as gameplay bugs. The source shader's projection/near-depth/double-sided rendering is the next independently checkable point in the renderer/selection chain.

## Original exact production contracts authenticated (fail-closed)

The new \`src/building-pool/roadmap-2a/roadmap-a-pack5-game-camera-projection-producer.mjs\` reads the unchanged **real** original files and rejects drift from all of:

- \`main.mjs\` actual \`eye=()=>[player.x,player.feet+1.55,player.z]\`, \`facing=()=>forwardVector(player.yaw,player.pitch)\`.
- Exact original terrain vertex shader \`x=dot(aPos-uEye,uRight)\`, \`y=dot(aPos-uEye,uUp)\`, \`z=dot(aPos-uEye,uForward)\`, \`gl_Position=vec4(x/(uAspect*uTan),y/uTan,1.0015*z-0.1501,z)\`.
- Actual original shader uniforms: \`uEye\`, \`uForward\`, game-calculated yaw/pitch right/up, \`uAspect=w/h\`, \`uTan=tan(72°/2)\`; the same program renders terrain AND Pack5 source triangles.
- Actual original \`gpu-pipeline.mjs\`: depth test enabled, GL_LEQUAL, face culling disabled.
- Actual original \`terrain-buffer.mjs\`: 9×Float32 per uploaded vertex, original 36-byte interleaved stride, attribute 0 position and material at byte 32, GL_TRIANGLES.
- Original \`main.mjs\` Pack5 stream draw only after the world terrain draw, so **even a matching projected Pack5 source triangle does not prove visibility or pickability through in-game terrain**. Live game pixel depth/occlusion remains untested.

The new code uses these EXACT mathematical expressions in pure functions \`originalGameProjectVertex()\` and \`originalShaderCenterTriangleDistance()\`. A projected triangle center hit is computed in screen normalized coordinates using 2D triangle barycentrics; perspective-correct camera depth is recovered as \`z_hit = 1/sum(lambda_i/z_i)\`. The original game's perspective depth \`1.0015 - 0.1501/z_hit\` is verified. Original \`sourceRayTriangleDistance()\` acts as an independent world-ray comparison. **These are double-precision JavaScript arithmetic projections of the source GLSL formulas using real Float32 source vertex input, not actual GPU highp precision or raster edge rules.**

## Original physical geometry / source-cam matrix

Use original \`pack5:080\` fired-brick physical source \`resolvePack5BuilderAsset()\`, original \`pack5TerrainVertices()\` output, and original \`makePack5Fixture()\` selection. This is **only** isolated in-memory source test geometry; no real creator building, settled structure, gameplay world or sidecar.

For two existing genuine source fired-brick variants × yaw 2/3 = **4 research-only alternatives**, sample **7** eye-X coordinates \`[0.01999995, 0.02, 0.02000005, 0.5, 0.97999995, 0.98, 0.98000005]\`; **5** original \`clampLook()\` horizontal input deltas [-2,-1,0,1,2]; and **3** original vertical look input deltas [-2,0,2]. Original camera \`forwardVector()\` produces a unit ray at the center pixel. Test-only eye world-Y 0.5 comes from original **player.feet +1.55** with hypothetical feet=-1.05; this is NOT a valid real-world player standing/collision proof. Camera/world position is an analytical abstraction only. Original target variant+orientation is never assigned to Roadmap A A5 buildings.

Total: **4 × 7 × 5 × 3 = 420 source-only original camera center-ray probes**. For every ray:

1. Genuine staged source triangle intersection from 3D original-source ray.
2. Same genuine original staged triangle projected by unchanged main's source-authenticated GLSL camera math, then tested at normalized center screen x=0,y=0.
3. Genuine original Pack5 fixture detailed selection ray.
4. Record original source vs projected-center differences separately from selection vs projected-center warnings, and preserve up to 24 explicit bounded witnesses. Count projected triangle edge proximity, with conservative NDC barycentric edge threshold 0.00002.

**No assumption of zero mismatches is built into acceptance**: the new test retains real counts, prints their totals to CI, and reports every disagreement category honestly. Source ray vs source shader could disagree near numerical 2D triangle edge rules: that would require a real game/GPU result before calling it a gameplay defect. A source-shader agreement cannot prove what the physical GPU actually rasterizes or what voxel occlusion will hide.

## Focused native tests (new only)

\`tests/building-pool/roadmap-2a/roadmap-a-pack5-game-camera-projection.test.mjs\`:
- Exact original source shader/draw/depth contracts.
- Main-camera forward unit vector projects to **center screen** for different yaw/pitch orientations.
- Known native 3D triangle intersection and perspective-correct shader projected intersection agree in a non-grazing interior case.
- Behind-camera and invalid projection inputs fail closed.
- 420 original Pack5 staged mesh camera screen-center rays across all 4 physical research alternatives.
- Preserve differences and bounded triangle-edge witnesses; print native source counts.
- Explicitly reject game/browser/GPU/collision/structural/creator acceptance claims.

Use one one-time CI-only branch based on this precise source-only commit, Node 22.16.0; run **only seven new native tests** and own-lane syntax checks. Reuse older native tests: staged-mesh 15/15 Actions #45073277516, earlier browser readiness 8/8 #45061280438, original camera 7/7 #45057409771, original Pack5 live adapter 6/6 #45055300060, earlier original analytical rays 15/15 #45049471293, 40/40 #45044721507 original producer, footprint 9/9 + 5/5, earlier original Pack5 24/24 and controlled-source V8 58/58. No duplicate broad CI/browser or runtime installation.

## Strict engineering and release holds

No original game source changes; no actual GL shader/renderer/browser run, no pixel screenshots, no world placement, no saved sidecar, no A5 authored source variant/yaw changes, no actual in-game player camera/inputs, no physics, no mixed Pack1–5 structural support or creator approval. Original viewport 844×390 is a **source analytical shader aspect**, not a measured iPhone render. The earlier read-only game browser pilot remains **unexecuted**.

Protected main: \`7016e14cd6289f45eaf7fc6a79a362b47996df65\`; protected OPEN DRAFT PR406 code HEAD: \`1d71f5e37891280a21c777e5189f0762014ed8a9\`. Roadmap A remains **207/420 SOURCE ONLY, 213 unwritten**, historic 128 commerce, 345 industrial, 315 government; all other builders, five hourly automations, shared workflows, schema1 saves, Home Screen PWA, locked v0.11 untouched. No merge/deploy/cancel.
