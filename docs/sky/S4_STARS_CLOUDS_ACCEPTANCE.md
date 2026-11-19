# MYTHWROUGHT — SKY S4 STARS, TWILIGHT GLOW, AND CLOUD FLOW

**Protected parent:** formally accepted S3 `01bf9edad81f8cdaa2a9cbef6bf5be2adcd394c2`.
**Branch/PR:** isolated `sky/roadmap-s0-baseline-20261118`, DRAFT PR #269.
**Status:** staged. Final acceptance must be exact-head green and independently screenshot/manifest audited.

## Original star artwork
A fixed 384×192 celestial panoramic lattice yields **10,295** deterministic virtual stars. Pixel-local procedural hash is source-independent, inexpensive and sidecar-free: no drawn star meshes, GPU buffers, PNG textures, extra passes, calls to `Math.random()`, save schema change, persistent state, or per-star animation loops. Warm gold, moonstone blue and pale lavender pigments vary by individual star; depth comes from a soft narrow glimmer kernel and a restrained violet celestial band. Stars vanish naturally under daylight and brighten on nights. Star positions move relative to camera yaw/pitch, not across the screen as a HUD.

## Clouds and sky rhythm
The original S2 ovals, wispy foreground stroke and S3 moon art remain in the one fullscreen-triangle shader. S4 adds a second translucent veil for a total of four cloud features. Two independent, smooth periodic vector offsets sample the authoritative 24-minute S1 clock. No new timer or accumulated floating-point drift, no S1 save mutation; cloud positions repeat exactly after 24 minutes and change as time advances. The original cloud palette and S2 ambient/fog remain authoritative. The THREE distinct S3 moon orbits/phases persist unchanged, with moon discs composited above stars and cloud layers.

## Required acceptance and ownership
1. Pure native verifies **10,295** generated star cells, bounded density, deterministic stable positions and 3 pigment families; 24-minute cloud drift and seam continuity; day/night star fade; no additional draw calls/textures, no storage, no weather, no S5 events or S6 biome variations.
2. Real original game Chromium WebGL2 at **667×375, 844×390, 932×430**, genuine DAY/NIGHT controls, real camera pitch/yaw, 25 resident chunks, zero GL/page/resource errors, 3 intact S3 moons. Count isolated bright star pixels in real GPU screenshots, verify moon visibility and night/day contrast, change only S1 clock sidecar to 04:00 with same nighttime lighting and prove real moving cloud pixels and independently updated offsets. Original canonical schema-1 and non-sky storage unchanged.
3. Screenshot manifest includes source HEAD, real PNG bytes SHA256/dimensions, 3 viewport result records, measured star peaks/motion, actual WebGL2 state, no network errors. Verify all screenshot bytes after downloading artifact and visually inspect day/night/cloud framing at all sizes.
4. Rerun **unmodified** S3 3-moon/lunar phase, S2 sun/fog and S1 clock/menu/save real browser acceptance. Independent archive and screenshot validation for all.
5. Same-run S3 vs S4 paired ABBA/BAAB at three iPhone landscape dimensions on Chromium SwiftShader; preserve existing explicit >20% FPS regression and severe p95 guard. Report measured ratios, never confuse software Chromium numbers with physical iPhone FPS. Repair S4-only sources if budget breaks; don't weaken acceptance.
6. Full **12/12 CI contracts**, full repository native, all **20 original Chromium WebGL2 scripts**, Pack 3, Manual Five Pack and 10× depth green at **one exact HEAD**. No changes to sibling builder, biome, cave, automation or Creative work.
7. Keep PR draft/unmerged; no rebase, merge, production, deployment, new repository, schema-1 migration, unlock of v0.11 or weather/stars world save writes. S5 rare events, S6 biome variant skies, S7 physical iPhone Safari offline/Home Screen/thermal checks remain deferred.

**Manual S4 acceptance requires all gates above, screenshot inspection, provenance and verified production preservation.**
