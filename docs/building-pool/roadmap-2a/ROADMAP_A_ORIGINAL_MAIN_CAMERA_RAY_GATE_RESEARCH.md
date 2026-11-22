# Roadmap A Pack5 — Original game camera + source target edit guard research

## Scope of this isolated original-source engineering

This checkpoint extends native original Pack5 ray diagnostics to the actual source-defined **player camera / iPhone pointer math / original legacy block-target inspector / live Pack5 adapter** and the physical shape selection's two distinct native density branches. It does NOT import or execute original \`src/main.mjs\` in Node because that is a DOM/WebGL2 runtime requiring original game initialization. Instead a conservative source-presence guard reads the **unchanged original** \`src/main.mjs\` and checks its exact camera, opt-in edit, and normal-mode safety-guard expressions before any test-only evaluation. The camera/ray helpers are imported and ACTUALLY executed from their original source files.

Source anchors (must be present, or the new audit fails closed):

- \`eye() => [player.x,player.feet+1.55,player.z]\`
- \`facing() => forwardVector(player.yaw,player.pitch)\`
- original closed-menu, hidden-app, GPU-loss and Creative movement edit blocker
- original \`pack5Mode && pack5Builder\` early opt-in place/remove path
- original normal-mode \`inspectBlockTarget\` and \`pack5Builder.layer.raycast\` precedence with a **1e-6 block-unit** comparison bias
- original legacy-support mining protection and occupied-cell placement protection.

New source-only modules:

- \`src/building-pool/roadmap-2a/roadmap-a-pack5-camera-gate-producer.mjs\` — imports ORIGINAL \`src/camera.mjs\`, \`src/input.mjs\`, \`src/blocks.mjs\`, \`src/pack5-integration/live-adapter.mjs\`, \`src/voxel.mjs\`, reads (does NOT execute) \`src/main.mjs\`, and uses only temporary source-only Pack5 builder instances in an immutable synthetic \`world.get\` host.
- \`tests/building-pool/roadmap-2a/roadmap-a-pack5-camera-gate-producer.test.mjs\` — seven focused original-source native tests.
- This exact source-research record.

### Authentic, bounded camera / branch matrix

For explicit original Pack5 **preview-only** fired-brick \`pack5:080\` material alternatives (both variants) x yaws 2 and 3, test camera eye/player positions at six original near-boundary X coordinates \`[0.01999995, 0.02, 0.02000005, 0.97999995, 0.98, 0.98000005]\`, using ORIGINAL \`safePointerDelta(-1/0/+1,0)\` and \`clampLook\`/ \`forwardVector\`. The actual player's source eye offset of **1.55** is preserved, with synthetic feet 0.95, eye world y=2.5. All input variants are **test-only hypothetical camera positions and yaws** and never assigned to real A5 structures. No camera/controls or world modifications.

Exercise three original terrain situations per ray: no other legacy voxel, an original legacy STONE cell in front of the Pack5 brick, and a STONE cell behind it (not assuming every offset yaw ray must actually intersect that distant voxel). Evaluate **both original opt-in Pack5 selection paths**: a low-density single temporary object (\`<=64\` reference fixture path) and an ephemeral **65-object** test-only scene (one target + 64 distant bricks, triggering original spatial source ray branch). The 65 temporary in-memory objects do **not** represent a real settlement, actual world placement, a saved sidecar or a player inventory.

Total **432 source camera/ray comparisons**: 2 variants x 2 yaws x 2 densities x 3 terrain conditions x 6 X coordinates x 3 original mouse-look deltas. Record actual original source \`inspectBlockTarget()\`, Pack5 detailed shape \`layer.raycast()\`, original \`createPack5LiveAdapter.inspect()\`, and interpret the unchanged normal-mode main.js safety-guard conditional. Record native original closer-shape versus legacy-tile priority, canonical terrain occlusion, direct versus dense selection discrepancies, and bounded original edge warnings without editing gameplay.

### Invariants / limitations

- \`src/main.mjs\` actual DOM/game edit-loop **NOT executed**; its source strings are cross-authenticated but the callback/UI and real player movement are not a native test.
- Original \`src/camera.mjs\`, \`src/input.mjs\`, \`src/blocks.mjs\`, original Pack5 live adapter / construction layer and original \`voxel.raycast()\` **ARE** invoked as actual imports in the original repository.
- Synthetic world is frozen with a read-only \`get()\` method, no \`set\`, \`save\`, storage, gpu, DOM or persistence. Temporary opt-in Pack5 fixture instances only; the 65-instance simulation is **not** actual long-lived world settlement content.
- Actual original WebGL2/iPhone shader pixel visibility, gameplay physics/collision, GPU performance, arbitrary-angle camera distributions, mixed Pack1-5 real structural support and true creator material/yaw acceptance still unproven.
- Previous exact original evidence reused, never bulk rerun: native 6/6 source ray/terrain #45055300060, 15/15 analytic rays #45049471293 (88 source boundary-grazing warnings), 40/40 original producer #45044721507, 9/9 and 5/5 footprint source-native and historical 24/24 original Pack5, 58/58 controlled V8.

Unchanged production \`main\` \`7016e14cd6289f45eaf7fc6a79a362b47996df65\`, OPEN DRAFT PR406 code HEAD \`1d71f5e37891280a21c777e5189f0762014ed8a9\`, original Roadmap A source-only 207/420 (213 unwritten), historic 128 commerce / 345 industry / 315 government, unchanged A5 buildings, 5 hourly automations, other developers, schema1 saves, locked v0.11, installed Home Screen PWA and existing CI. **No merge, production deployment, source variant/yaw choice, original gameplay edit, actual physical construction, CI cancellation or structural/creator approval.**
