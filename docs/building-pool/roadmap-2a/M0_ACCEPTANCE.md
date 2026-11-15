# Mythwrought — Roadmap 2A M0 candidate preservation (in progress)

- Source: creator-provided `2A.md`, 2026-11-15 infrastructure revision A. **No release, merge or production behavior.**
- Baseline `main`: `e6bd7c173a4531ba7efc153e5f2eb89870c3b9db` (merged infrastructure PR #178; exact PR-head full 20-script CI successful; merged-main CI successful).
- Integration ledger: main `docs/INTEGRATION_CHECKPOINTS.md`, latest written checkpoint 009; manual five packs were later integrated via PR #174. Do not alter this shared ledger.
- Original draft PR #124 at **exact HEAD `07c45d27bd36f4f3aa3197bba0e4f49ce2a58c68`**, remains **open/draft/read-only**. Its 15 `r2:general-store:<biome>:<size>:01` theoretical candidates are externally authored, **not yet locally imported or geometry-parity verified**. All 15 original IDs and exact blob provenance appear in `manifest.json`. The 15 temple candidates in PR #124 belong exclusively to 2B and are deliberately excluded.
- This isolated M0 commit reserves exactly **420 theoretical IDs**: 75 general stores, 75 pet shops, 75 magic shops, 75 potion shops, 75 bakeries and 45 banks; five biomes × three sizes. 15 legacy source candidates; 405 new designs still needed. **0 locally migrated; 0 newly authored; 0 creator accepted; 0 placed/integrated.** A reserved ID is not counted as a blueprint.
- Owner paths: `src/building-pool/roadmap-2a/`, `tests/building-pool/roadmap-2a/`, `docs/building-pool/roadmap-2a/` ONLY. Zero production ID, save, runtime, worldgen, CI, main, original PR or other lane edits.
- Source-exact extraction is **M0's remaining task / M1 entry gate**: selectively rehome the 15 complete general stores (including M0 Temperate Small Store with 685 physical coordinate voxels), preserving openings, 16 original window-kind cells, window registry, room/connectivity/support, geometry and IDs. Compute genuine per-blueprint structural fingerprints and independent native Node/browser checks on the new lane. Do not claim completion from source-blob SHA alone, repeat shared original implementation wholesale, or copy the temple half.
- Physical manual builder catalog: 96 integrated family symbols / 106 physical variants; future biome130 dependencies must be checked individually, otherwise stay symbolic. Geometry source documents retain pre-integration ABI concerns; actual live placements, windows/facing/collisions, creator art and physical-iPhone review are separate gates.

## Repeatable native M0 check

```sh
node --test tests/building-pool/roadmap-2a/*.test.mjs
```

Not an art/geometry acceptance or true WebGL2 test. Gate A v0.10 OPEN, v0.11 LOCKED. No merge or deployment authorized.
