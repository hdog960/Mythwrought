# Desert P3 original M7 vertex RGB seam research — 2026-11-22

## Exact inherited evidence and branch boundary
- Protected accepted Desert original gameplay baseline: `2bd0395d3ef163e9fdc491ab5119b1ee80844194`.
- Previous source-only contiguous rock proposal research HEAD `78d6cd1a62598420ea94f306d817090e28752199`, Actions #45055019614 original source 2/2 PASS; categorical 258/401 seams 44→0 but all material contacts 114→156, therefore **not integrated**. Previous sparse-spot gameplay experiment original WebGL2 #45049368729 also rejected as insufficient aesthetic polish.
- This is a **new parallel isolated** branch `research/desert-p3-vertex-color-seam-20261122` based directly on accepted gameplay baseline; no prior rejected gameplay source inherited. No merge, deployment or changes to any protected refs, other developers, automations, saves, sky, caves or shared workflows.

## Original renderer engineering findings
- `src/voxel.mjs::meshChunk` already authors a 9×Float32 vertex format: XYZ, RGB, UV, material. `src/main.mjs` uses a 36-byte vertex stride with existing `aColor` consumed by the current terrain shader.
- At V7, biome130 hardpan 258 uses the natural averaged palette and original physically mineable block, and mountain scree 401 uses original RGB [.46,.43,.40] and material 42. Exposed-face mesh staging already caches world.get through a bounded one-cell horizontal chunk halo.
- **No new GPU vertex attribute, extra draw call, material ID, terrain height, texture, block type, edit format or per-frame shader world sampling is necessary** for a proposed visual blend. The work happens only during chunk rebuild. Existing pre-merge 25 resident surface chunks and all performance gates remain unchanged but actual iPhone FPS/GPU budgets must still be measured before any release.
- Original full `meshChunk` uses per-vertex RGB for both terrain art and biome meshes, so this option preserves exact physics and storage identity while making the edge visually softer.

## New isolated prototype
- `src/manual-biomes/desert-seam-vertex-tint.mjs`: pure deterministic helper that mixes natural hardpan RGB toward existing scree palette at **contacting face corners only**. Opposite corners retain natural original color. No hashing, extra block border, world-state mutation or randomness.
- `src/voxel.mjs` only: original M7 hardpan 258 when no player edit and original V6 says Desert detects actual unedited cardinal scree 401 within y±1 using existing cached chunk cell reader. Captures four cardinal contacts once per natural hardpan voxel, only when building a chunk mesh; supplies the same existing RGB to the original 9-float writer. Every non-Desert, edited, Mountain scree, Snow/Enchanted and other block remains identical by intent.
- New exact-source `tests/desert-p3-vertex-seam-source.test.mjs` imports BOTH original and isolated candidate real original `FourRegionWorld` and `meshChunk`; checks vertex count, XYZ, UV, material and actual physical save untouched at two real seed179/2026 junction chunks. Only bounded RGB diffs are allowed; shader untouched. No broad test reruns.

## Focused original-game acceptance
- Isolated `.github/workflows/desert-p3-vertex-rgb-isolated.yml` source-scope checks only new files, checks out immutable original `2bd0395d...` and triggering candidate SHA, then runs exact original-mesh native test. Only if native gate passes it runs two same-camera original-game WebGL2 captures per source via byte-identical previously validated browser harness `641726d...`, 932×430 daylight1, actual loaded destination chunk25, original top scree401, no browser exceptions. Genuine PNG SHA256 and pixel-change counts get logged, ZIP artifacts uploaded for independent inspection.
- Script is **not** intended for production inclusion, and a successful source/webgl check does not mean visual polish has been accepted. Inspect all four genuine images; reject if color transition looks unnatural or offers insufficient improvement. Physical iPhone performance and Home Screen PWA remain separate release gates.

## Status at authoring
Workflow for this research prototype was committed at `3ad1e7c0b17833407d0fed4d65d6ce2d19bb7f13`, and authentic workflow run [#45057222621](https://github.com/hdog960/Mythwrought/actions/runs/45057222621) appeared in progress. **No result, PNG, actual RGB difference, iPhone performance, visual acceptance, merge or deployment is asserted until authentic logs and artifacts are inspected.** Previous 20/20 native, five-seed original source census, #45044303938 original game and #45049368729 prior rejected material spot screenshots reused, not rerun.
