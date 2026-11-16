# Biome130 transparency fidelity (isolated draft)

Baseline: incorporation 015 `1f67efc9805e83866549515ffdad4dc7e225b234`, all 130 registered IDs 256–385.

## Source-backed renderer change
- Natural leaf families 122–130, IDs 377–385, retain their non-solid source union geometry and gain nine procedural alpha cutout material tags 40–48. The fragment discard is active in balanced **and** economy graphics presets; no extra textures or GPU draw calls.
- Seven ice families 020, 021, 022, 025, 026, 027, 095 (IDs 275, 276, 277, 280, 281, 282, 350) use their registered source opacities 0.46, 0.78, 0.90, 0.72, 0.82, 0.68, 0.72. Existing material 49.x encodes precise alpha in the current nine-float GPU ABI, routes all ice to the existing transparent-water buffer and draws after solids with blending enabled/depth writes disabled.
- Water material 20 and existing Pack 2 state remain unchanged. No new buffer/upload in chunks without ice. Renderer and builder use the same actual family IDs. `#scene.dataset.biome130IceVertices` exposes live GPU ice geometry.
- The CPU route preserves the original nine-float shader/GPU vertex ABI and stable triangle order.

## Limits and acceptance
- Transparency is still sorted *by chunk*, not by transparent face, and overlapping ice/water within a chunk may show ordering artifacts.
- Leaf silhouettes are procedural cutout patterns, not final hand-authored leaf textures; thin stems are also cut out. Physical-iPhone art/performance approval is **not** claimed.
- All eight builder PRs, all five manual Block Packs, control rails, world generation, saves/schema 1, and v0.11 lock are unchanged.
- A dedicated isolated workflow runs source-native tests and three genuine Chromium WebGL2 viewport captures (667x375, 844x390, 932x430), checks save/reload and uploads actual screenshots. Preserve draft PR; do not merge without verification/authorization.

## Deliberately outstanding alpha families

Other enchanted foliage and glow intents (for example family 040) remain opaque-fallback. Only these seven source-backed ice materials and nine natural-leaf cutouts gain alpha fidelity. All 40-48 and 49.x material tags are separate from Pack 2 opaque material 21 and blended water material 20.
