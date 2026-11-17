# Biome130 transparency fidelity (isolated draft)

Baseline: incorporation 015 `1f67efc9805e83866549515ffdad4dc7e225b234`, all 130 registered IDs 256–385.

## Source-backed renderer change
- Natural leaf families 122–130, IDs 377–385, retain their non-solid source union geometry. The exposed source-authored first-box stems remain opaque terrain geometry, while the existing leaf lobes gain the nine procedural alpha cutout material tags 40–48. The fragment discard is active in balanced **and** economy graphics presets; no extra textures or GPU draw calls.
- Seven ice families 020, 021, 022, 025, 026, 027, 095 (IDs 275, 276, 277, 280, 281, 282, 350) use their registered source opacities 0.46, 0.78, 0.90, 0.72, 0.82, 0.68, 0.72. Existing material 49.x encodes precise alpha in the current nine-float GPU ABI, routes all ice to the existing transparent-water buffer and draws after solids with blending enabled/depth writes disabled.
- Builder-facing alpha intent and transparency flags reflect the actual authored ice opacity or foliage cutout, while unfinished enchanted alpha effects remain explicitly marked opaque-fallback.
- Water material 20 and existing Pack 2 state remain unchanged. No new buffer/upload in chunks without ice. Renderer and builder use the same actual family IDs. `#scene.dataset.biome130IceVertices` exposes live GPU ice geometry.
- The CPU route preserves the original nine-float shader/GPU vertex ABI and stable triangle order. Stem recognition is based on the physically authored first box in each rotated leaf block (at most 36 cached box descriptors); no additional world cells, triangles, raycast shapes, alpha passes or save fields are created.

## Limits and acceptance
- Transparency is still sorted *by chunk*, not by transparent face, and overlapping ice/water within a chunk may show ordering artifacts.
- Foliage now uses tapered broadleaf/pinneedle/pendant leaf-shape cutouts and small procedural veins in the existing shader, replacing the original square-perforation mask. Pine/cedar/cypress leaf masks now draw 6 rather than 9 longitudinal cells per source face and widen needle half-width from 0.13 to 0.18 UV units to avoid subpixel fragment sparsity on iPhone-sized views; the other six species and all authored geometry stay identical. Each species' new soft tint is pulled directly from the middle swatch of its approved source palette and blended at 42% with the original face color; no new texture, mesh or ad-hoc palette is introduced. UV silhouettes are still procedural; exposed source stems stay connected without cutout, they are not final hand-authored leaf textures. Physical-iPhone art/performance approval is **not** claimed.
- All eight builder PRs, all five manual Block Packs, control rails, world generation, saves/schema 1, and v0.11 lock are unchanged.
- Focused source native tests now assert that **all nine species** keep real cutout leaves and visible opaque stem triangles through actual surface and deep section mesh generation, with schema-1 save/restore and unmodified nine-float vertex ABI.
- A dedicated isolated workflow runs source-native tests and genuine Chromium WebGL2 viewport captures (667x375, 844x390, 932x430), including nine individually labeled foliage captures **per** viewport with off-target, outline-free pixel A/B checks against the same camera/empty voxel. The suite checks save/reload, verifies a maximum of 25 surface GPU chunks during progressive streaming (and an initial fully-loaded 25-chunk baseline), and uploads screenshots. Preserve draft PR; do not merge without verification/authorization.


## Real WebGL2 water × ice overlap audit

The isolated browser suite now captures both occlusion orders using genuine live
Pack 2 water ID 76 and M11 ice ID 275, in adjacent cells of the **same chunk**,
at each of the three landscape viewports. For each camera-stable order it saves
empty, near-only, far-only and combined screenshots, checks source block IDs
and verifies that both materials contribute to real framebuffer pixels. JSON
records source-specific A/B differences, positive GPU ice vertex residency
and the known chunk-sort limitation. It does **not** pretend that raw pixel
differences mathematically prove correct compositing order.

The focused native test additionally checks real water's four authored alpha
values (.11/.25/.37/.58) and all six distinct authored ice alpha values
(.46/.68/.72/.78/.82/.90, seven families), their nine-float vertex contract
and the current water-before-ice concatenation. Changing the blending
algorithm without mobile GPU evidence remains outside this acceptance.

## Deliberately outstanding alpha families

Other enchanted foliage and glow intents (for example family 040) remain opaque-fallback. Only these seven source-backed ice materials and nine natural-leaf cutouts gain alpha fidelity. All 40-48 and 49.x material tags are separate from Pack 2 opaque material 21 and blended water material 20.
