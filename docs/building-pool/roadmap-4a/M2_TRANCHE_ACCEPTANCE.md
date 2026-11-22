# Mythwrought — Builder 4A M2 fourth original cohort (8 new civic/guild designs)

## Source-authored candidate roster

- `r4:civic-hall:desert:small:02` — Desert judicial triptych with tax ledger and shaded petitions
- `r4:civic-hall:snow:large:02` — Snow large winter senate with two hearing wings and protected records vault
- `r4:civic-hall:enchanted-forest:medium:02` — Enchanted-forest medium oath and ancient records pavilions
- `r4:civic-hall:mountain:large:02` — Mountain large clan-council with eastern audit terrace and charter vault
- `r4:guildhall:temperate:large:01` — Temperate large guild with internal roof court and three trades/work wings
- `r4:guildhall:desert:medium:01` — Desert medium caravan dyers guild with escrow, ledger and work court
- `r4:guildhall:enchanted-forest:large:01` — Enchanted-forest large six-arm canopy guild, weavers workshop and spore gallery
- `r4:guildhall:mountain:large:01` — Mountain large asymmetric masons guild with separate craft terraces and northern charter wing

**Current theoretical candidate counts (not final approved):** 52/315 total, inherited source-exact original 30, newly authored 22, remaining 263, creator-approved 0, deployed/integrated 0. Civic hall 26/75, guildhall 11/60, castle palace 15/45. Earlier 44 candidate generator bytes, PR #123 and main are unchanged. New owned module `m2-tranche.mjs` source Git blob `3fb675eef7ed022c986739ae6e97bed0f9d60658`.

Eight full 3D coordinate designs include 27,068 occupied voxel cells, 6,519 conceptual navigation coordinates and 35 individually named interior rooms; all 52 pass current V8 schema and full D4 uniqueness preflight (source-level, **not** a substitute for native CI). Includes occupied floor/walls/roof, actual open entrance/window voxels, supported raised regional ridges and short purlin spans.

`m2-tranche-webgl2-cdp-gallery.mjs` captures **48** source-authored diagnostic WebGL2 images (8 designs × exterior/cutaway × 667×375, 844×390, 932×430). Native Chromium must check ID, screenshot PNG dimensions/hash, `gl.finish`, GL errors and context loss; images need visual inspection after exact-head CI succeeds. The visual probe uses **candidate geometry/partial-box proxies**, not final physical-family voxel meshes or the live game. The merged 96-family/106-variant block catalog is read-only; numeric IDs, physical oriented window/roof collision+support, rotation/save compatibility, biome130 registration and world height remain blockers. No physical iPhone, premium-art or creator signoff claimed.

**CI status on this prospective commit: PENDING.** Do not claim test success or visual approval until exact-head Actions passes. No shared, sibling, automation, original draft PR, runtime, save, Gate A or v0.11 edits. Remains draft and undeployed.
