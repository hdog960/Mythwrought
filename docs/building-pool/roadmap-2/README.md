# MYTHWROUGHT — Building Roadmap 2: Commerce & Culture

Exclusive paths: src/building-pool/roadmap-2/, tests/building-pool/roadmap-2/, docs/building-pool/roadmap-2/. Never merge or deploy. v0.10 Gate A OPEN; v0.11 LOCKED.

## 840-target accounting

13 categories, five biomes, three sizes, three-to-five distinct plans per category = 840 design slots. Milestone totals: M2 first five shops 375, M3 markets and specialists 300, M4 banks/temples/theaters 165. The 840 IDs are PLANNED, not authored. M0 has ONE coordinate-authored candidate, ZERO accepted and ZERO world-placed.

## Reference architecture

Hearthlane Two-Room Provisioner: Temperate small general store, 13 × 11 conceptual grid with 685 occupied xyz cells. Physical coordinate foundation, timber floor, walls, steep roof, street and side windows, entry opening, customer-facing counter, shelving, storage partition, offset doorway, storage crates and lantern placements. Conceptual circulation from entrance to both rooms is tested. This is a theoretical model: actual asset dimensions, orientation, support, glazing and door behavior remain unresolved.

The catalog preserves all 840 slots and category-required room uses. Schema validation checks occupancy, full shell, rooms, entrances, circulation and valid symbolic roster references. The geometry fingerprint rejects material-only, reflection and rotation duplicate architecture. It does not prove aesthetic uniqueness; human review remains mandatory.

## Dependencies and scope

Pack 1-5 material symbols such as pack5:086 and biome130 symbols represent ROSTER positions, not live persistent block IDs. All physical interfaces and candidate assets must be checked before any possible future handoff. Read GitHub main, incorporation checkpoints, Issues #109/#117, Pack PRs #113/#114/#112/#115/#119 and biome PR #118 on every session. At M0 PR #120 checkpoint 007 was pending and excluded. No touches to any other roadmap, automation, packs, engine, saves, UI, renderer, world generation, seed, offline PWA, control rails or gameplay.

## Validation

Dedicated native command from a complete checkout: node --test tests/building-pool/roadmap-2/schema.test.mjs.

Standalone conceptual browser source: tests/building-pool/roadmap-2/preview.html. It uses Canvas2D, NOT playable-game WebGL2. Genuine Chromium screenshots should be attempted at 667×375, 844×390, 932×430 and inspected. Never count nonexistent screenshots.

### Category-specific circulation acceptance
The M0 schema now requires each named room to be reachable from the exterior via a graph of its declared room uses, rather than assuming every category contains a shop storeroom. Test-only temple schema fixtures are NOT authored temple blueprints. Entrance clearance verifies all declared vertical cells; window apertures must exist as actual `window` geometry.

For genuine screenshots after the browser environment is operational, run `python3 tests/building-pool/roadmap-2/gallery-browser.py` with free Playwright Chromium installed. Six actual canvas screenshots (exterior/cutaway at three iPhone landscape widths) must be manually inspected before M0 approval. This is conceptual Canvas2D, not native game WebGL2.

### No-network Chromium fallback (genuine browser rendering)
Where localhost navigation is blocked, `python3 tests/building-pool/roadmap-2/gallery-offline-browser.py` runs the original concept-gallery materials inside actual headless Chromium using browser `set_content` and inline module bundling, without HTTP or alternate fake image generation. Produces three full-frame landscape screenshots at 667×375, 844×390, 932×430 plus six focused exterior/cutaway canvases. These do **not** certify production-game WebGL2 or iPhone hardware.
