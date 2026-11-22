# MYTHWROUGHT Floating Islands — Session 3 isolated physical/flight/ecology checkpoint (2026-11-22)

## Protected source references and Codex handoff

- Protected production `main`: `7016e14cd6289f45eaf7fc6a79a362b47996df65`.
- Verified Floating Islands Session 2 parent: `719a4550278ce2bac9d7670ae04a91e3042792e8`.
- At the start of Session 3, GitHub branch/PR/commit searches showed **no newly pushed Codex floating-islands generator**. The Codex screenshot's assertions about Y256 world generation, edited sky saves, seams, mining, and 10,000-block reproducibility remain **unverified by this research branch**.
- All source edits are **isolated** on `research/floating-islands-sky-runtime-adapter-20261122`. No production renderer, worldgen, G2 native controller, original biome assets, saves, PRs, other developer branches, workflows, or Pages deployment were modified.

## Source engineering

1. **`src/floating-islands/sky-source-mesh.mjs`** now accepts original-shape-surface producer callbacks `surfaceMeshFor(id,rotation)`, `rotationFor(x,y,z,id)`, and `shapeFor(id)` rather than rejecting all partial shapes. Input geometry is the existing `prototypeSurfaceMesh` ABI (Float32 positions/normals, integer triangle indices; local unit-box bounds). Non-cubes are never fabricated as full cubes. Original full opaque neighbors cull boundary-only faces, but partial neighboring geometry cannot erase an entire side. Full voxel face behavior, existing 9-float / 36-byte layout, bounded 24,576 vertices / 884,736-byte section budget, original material callback and separate upper AIR edit overrides are preserved. A missing/malformed shape surface fails closed.
2. **`src/floating-islands/sky-creative-bridge.mjs`** adds source-only dual-world Creative-flight admission. Ground and sky body-clearance authorities are distinct; the full 0.28-radius / 1.78-height body must find all overlapping loaded upper sections. Sky sections are strictly namespaced `sky:cx,cz,section` and **never passed to original G2's nonpositive-only section indices as aliases**. A separate bounded request planner (2 new / 6 pending / 8 input points) supports stale world, intent reversal, completion, and flight interruption cancellation. The original G2 flight movement/controls are **not** connected or modified; future integration must coordinate two streams without bypassing any G2 safety gate.
3. **`src/floating-islands/sky-vegetation-physical.mjs`** transforms previously proposed *semantic* canopy and ground-cover descriptors into **source-authorized real voxel-cell proposals**, not render-only visuals. Tree silhouettes include bounded windbent pine, cloudleaf, and starbloom trunk/foliage variants. Host must provide existing registered physical IDs and a source reader including sky edit deltas. It checks real base support, protected sites, complete headroom/crown collision, and rejects an entire tree rather than partially overriding terrain, caves, edits or assets. Max 64 input anchors and 512 proposed voxels, all Y20..256. Outputs are **read-only proposals**: zero world writes, save writes or GPU meshes. No claim that exact named materials already map to supported production IDs.

## Tests and evidence

- Local Node `v22.16.0`: `node --test tests/floating-islands/*.test.mjs` **75/75 passed**; source modules passed syntax checks.
- Prior exactly unchanged 47 focused tests were reused; **28 new tests** covered original-format shaped vertices/rotations/side occlusion, malformed surface fail-closed behavior, split physical flight readiness and bounded sky queue cancellation, and authentic-voxel-ID-required canopy planning, full-tree rollback, support edits, protected ground, global-coordinate determinism, 512-cell bounds and zero world writes.
- All six source/test Git blob SHAs verified equal to exact locally tested files. No redundant native CI runs or browser/iPhone jobs were launched. Synthetic/local fixtures are **not** original-game WebGL2 or Codex generator acceptance.

## Pending short-term engineering, no approval requested

- Obtain the *actual* Codex floating-island source/branch and saved edit format. Verify section boundaries before connecting this provisional adapter.
- Connect original biome130 / legacy physical material and `prototypeSurfaceMesh` producers, real collision/raycast, and validated physical foliage asset IDs. Never silently map unsupported assets.
- Renderer-owned atomic GPU uploads, residency and disposal; no GPU allocation outside original runtime; no ground-darkening shadow pass and no change to the 24-minute global day/night.
- Original G2 0/negative section stream must continue unchanged until upper world streaming can be coordinated. Check a real swept flight through loaded / missing sky and caves/ground boundary before raising production flight limit.
- Original island terrain and vegetation placement through native source, mining/edit sidecar, genuine worldwide seed179/2026 loads at +/-10,000 cells, light/no-permanent-shadow screenshots, iPhone WebGL2 frame-time/gpu bounds and installed PWA test.
- **Long-term floating-island structures/mobs remain deferred**.

## Anti-clogging policy

Maintain branch isolation, one-time ref verification and exact-commit evidence reuse. Focused new tests only until real integration warrants browser or full release gates. No merges, deployments, CI cancellations, changes to shared workflows, or modifications to the other developers' work without authorization. This checkpoint is not playable-release approval.
