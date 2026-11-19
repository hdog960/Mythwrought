# MYTHWROUGHT SKY S6 — FOUR BIOME ATMOSPHERIC CHARACTER

**Staged candidate only. Not formally S6-accepted.**

Source exact protected S5 parent: `37fe30fe11652dce2a967280823ee3937bbd6505`.
Manual four-biome M5 authority: **DRAFT PR #265**, HEAD `0140db9ad5e599ac84850fdb17529b7f4d96e4f4`. Its only eligible biome sampler is `src/surface-regions/regions.mjs::surfaceBiomeAt(x,z,seed)`, with immutable `FourRegionWorld.generationProfile` version 1 (generators v2/v3/v4/v5). Original source is verified with an external, read-only Git archive and executed in CI, not copied or altered.

## Implemented, sky-owned only
- `src/sky-biome-adapter.mjs`: fail-closed, pure, deterministic and zero-I/O resolver for four actual M5 source regions, with gentle fog/zenith/horizon/cloud/ridge color changes. Source anchor positions are actual M5 source: Desert (+512,0), Snow (0,+512), Mountains (-512,0), Enchanted Forest (0,-512).
- Desert: warm apricot and sand haze; Snow: crisp soft icy blue and pearl cloud; Mountains: muted slate/teal atmospheric layers; Enchanted: restrained lavender/green mystical tone. All are gentle additions to the globally shared S0–S5 sky, not separate day/night cycles or skyboxes. S1 24-min world clock, S2 sun/lighting, S3 three moons and persistence, S4 stars/cloud motion, S5 events unchanged.
- `src/main.mjs` read-only bridge: only attempts import of original `./surface-regions/regions.mjs` if a **validated original M5 profile** exists. The file is **not present in the S5 sky branch**, so the current legacy game has the exact S5 atmospheric object, zero new source requests, zero palette effects, and no save changes. Invalid/missing profile or source returns null; no synthetic terrain, fake biome center or injected test world.
- Existing original sky fragment + GPU pipeline source unchanged; no new draw call, texture, save keys, save schema, terrain/generator edit, default v4 edit, experimental v5 edit or weather.

## What the evidence proves
1. Pure S6 native tests: four genuinely different bounded palette accents, smooth source-weight threshold .35..95 blending, failure on forged profile, no-time/no-save changes and unchanged S0–S5 celestial data.
2. Exact real M5 authority from PR #265 source: unpack Git archive in CI, import original `FourRegionWorld`, original `Pack2LiveWorld`, and original `surfaceBiomeAt`; exercise each of four centers, seed 179, all four versioned profiles; assert source region identity and no world edits. **This is source-proven biome identity, not an actual combined browser scene.**
3. Authentic current S5 original-game Chromium WebGL2 at 667×375, 844×390 and 932×430: NIGHT and DAY, screenshots, original saves, real 25 chunks, three moons and stars, no GL errors. Each image must be explicitly labeled **legacy**, not authentic four-biome terrain; four-biome mood remains disabled in these scenes.
4. Rerun all original S1–S5 browser regressions and original source native, guarded same-run S5-vs-S6 performance on all three landscapes. Require full root 12 CI contracts, complete native and 20 real WebGL2 scripts, depth, Pack 3 and Manual Five Pack green at one exact staging HEAD.
5. Independently audit authentic screenshots (SHA256, dimensions, correct source, original saves, image framing). Zero fake source/profile injection or scripted teleport qualifies as four-biome proof.

## Explicit blocker to FULL S6 acceptance
**Actual real-game sky over four physically generated biomes is not testable from this isolated sky branch** because PR #265's world-profile modules, four-biome source and biome startup path are still draft and not incorporated. The read-only bridge alone cannot make that world active, and the user prohibits modifying biome owners, deploying, merging or registering production. A true combined acceptance needs a separately authorized integration or sandbox preview of the existing repo featuring an actual M5 `FourRegionWorld` AND S6 original sky, with full real-game 3-size day/night screenshots and genuine walking/biome identity. Until then report **S6 ADAPTER STAGED / FULL S6 BLOCKED**, not formal S6 accepted.

S7 physical iPhone Safari, Home Screen cold offline, battery and thermals remain separately untested. No production merge, rebase, deployment, new repository, save migration, v0.11 unlock or weather authorized.
