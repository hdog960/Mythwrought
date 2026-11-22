# Roadmap A — Original Pack5 player-ray selection / collider occlusion crosswalk

## Engineering scope (source-only)

The preceding original Pack5 analytical mesh/selection ray witness established **88 source ray disagreements** in 3,600 deterministic samples, all from the two fired-brick variants at yaw 2/3 and classified as near source-authored geometry boundaries. Those must not be confused with demonstrated live player targeting bugs. The actual game/opt-in Pack5 paths have independent contracts that the previous geometric ray did **not** test.

This checkpoint runs the exact original repository implementation at four targeted levels **without** changing a production source file or entering a real world:

1. **Original Pack5 fixture targeting:** \`makePack5Fixture(PACK5_BUILDER_FAMILIES).raycast()\` physically uses the original detail-visible source boxes, not the full brick collision box.
2. **Canonical voxel-shape targeting:** \`src/voxel-shape-interactions.mjs\` \`raycastShapes()\` accepts a **maximum of 32 boxes per registered voxel**. The original highly detailed Pack5 brick selection has **more than 32 original boxes** and must NOT be illicitly passed as a canonical regular voxel shape. Instead this diagnostic computes the canonical **original full-cube brick COLLIDER** ray separately. The real Pack5 opt-in sidecar uses its own source targeting path.
3. **Actual unchanged authored triangles:** original \`surfaceBoxMesh\` / original builder mesh for the explicit fired-brick variant and yaw, with ray/triangle intersection; this is a source-only surface intersection, not a GPU renderer.
4. **Original optional live adapter, original sidecar, original terrain voxel raycast:** \`createPack5LiveAdapter\` + \`createPack5ConstructionLayer\` + original \`voxel.raycast\` in a sealed **read-only in-memory fake world** (seed 179, only \`get\`, no \`set\`, storage, saves or actual game). Original Pack5 in-memory temporary fixture is used only to ask read-only player-facing \`inspect()\` questions. The fixture is destroyed with the Node test; no real building placement occurs. Cases: unobstructed front relief target, brick relief in front of more distant legacy stone, original legacy stone occluding rear approach, legacy stone front-face occlusion at a distance tie.

### New files

- \`src/building-pool/roadmap-2a/roadmap-a-pack5-native-ray-crosswalk-producer.mjs\`
- \`src/building-pool/roadmap-2a/roadmap-a-pack5-native-ray-occlusion-producer.mjs\`
- \`tests/building-pool/roadmap-2a/roadmap-a-pack5-native-ray-contract.test.mjs\`
- This engineering and verification handoff

### Bounded, predetermined new study

For each of the two original Pack5 fired-brick variants at **only** yaws 2 and 3 (4 explicitly enumerated **test alternatives**, NOT Roadmap A material selections), shoot **108** independent face rays:

6 axial faces x [0.01999995, 0.02, 0.02000005, 0.97999995, 0.98, 0.98000005] x [0.1,0.5,0.9] = **432 targeted tests of original Pack5 fixture vs original full-cube collision shape vs exact original triangles**.

The 0.00000005-block shifts probe either side of the previously identified Float64 original rotated-box / Float32 triangle-edge ambiguity. 144 rays use the exact 0.02 or 0.98 sample coordinates; 288 are slightly perturbed. Samples are deterministic and bounded. Report counts independently, preserve all disagreement witnesses and never assert unsupported zero-discrepancy assumptions. A disagreement between full-cube collider ray and detailed source selection is **expected**, not automatically a bug, because the collider deliberately fills space where art is inset.

The opt-in original adapter cases test **actual source semantics**, but only with a minimal synthetic \`world.get\` stub. They are not an actual Mythwrought live world, actual iPhone landscape touch controls, continuous body physics, source A5 buildings, mixed Pack1–5 support, WebGL2 occlusion, real NPCs or save persistence. No global runtime wiring, official gameplay raycast or full build is edited.

### Strict no-change gate

Production \`main\` \`7016e14cd6289f45eaf7fc6a79a362b47996df65\`, protected OPEN DRAFT PR #406 HEAD \`1d71f5e37891280a21c777e5189f0762014ed8a9\`, original source-only Roadmap A 207/420, 213 unwritten, older 79 A5 designs, 128 commerce, 345 industrial, 315 government, all five automations, other builders, PWA, schema1 saves, locked v0.11, original Pack5 sources, original \`src/voxel.mjs\`, main input loop and existing CI workflows remain unchanged. Original assets may appear in isolated test fixtures but NO real source variants/yaws are chosen and no buildings, structures or world voxels are placed.

Reuse exact original-repository native Node 22.16.0 evidence: previous 15/15 new ray tests Actions #45049471293, earlier 40/40 original producer tests Actions #45044721507, original 9/9 footprint core and 5/5 footprint producer, historic 24/24 Pack5 and 58/58 controlled V8. Execute ONLY new focused original-repo native tests on an isolated CI-only child once, no browser/full-suite/no queue hunting.

### Still required for a real release

Actual game player ray/selection and collision at adversarial camera angles; original authored triangle/renderer visibility proof; true mixed-pack wall/floor/roof bearing; explicit creator-approved A5 variant and yaw assignments, genuine iPhone WebGL2 acceptance and Creator art/physical approval. Neither current source-only study nor a passing native suite can supply these.
