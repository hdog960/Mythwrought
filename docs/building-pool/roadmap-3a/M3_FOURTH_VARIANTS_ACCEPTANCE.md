# Builder 3A M3 — Fourth-variant perimeter-court candidate handoff

Status: DRAFT theoretical sources only. Nothing is merged, registered, integrated, deployed, or physically iPhone-tested.

## Source additions
- 30 original authored fourth variants, 15 carpenter + 15 stonemason, five biomes and three sizes. Distinct human-readable original programmes and cell-level source layout per slot.
- Module: src/building-pool/roadmap-3a/m3-craft-fourth-variants.mjs, exports createM3CraftFourthVariant and createM3CraftFourthPool. Slot suffix :4 in the existing Builder 3A roster.
- Actual hollow perimeter/U courtyard footprint, north transverse workshop, long west stock/shop wing, shorter east working wing, front commission gallery, narrow roofless longitudinal route, open court crossing and asymmetrical roof zones. These differ from second long-nave and third H plan source programmes, not palette-only renames.
- Carpenter: authored timber drying racks, joinery work support, rear assembly. Stonemason: cold column stock, measured ashlar plinths, rear vault and setting area. Both use two existing manually merged Pack 1–5 source family fixtures (unpowered, no crafting or storage logic).
- Total authored candidate census: 285/345 = 75 blacksmiths, 75 armorers, 60 carpenters, 60 stonemasons, 15 mining workshops. Remaining 60 are 15 carpenter fifth variants and 45 mining workshop variants 2–4. Zero creator-approved and zero integrated.

## Evidence and bounds
- tests/building-pool/roadmap-3a/m3-craft-fourth-variants.test.mjs covers occupancy, actual 2x3 clear routes, roof bearing-witness diagnostics, D4 full geometry across all 285 source candidates, D4 normalized near-duplicate IoU less than 0.94, and honest counts.
- The isolated Pack AABB physical audit resolves producer physical family collision, reservation and support offsets. Witnesses are not load/roof span/thermal or weather engineering certification.
- Optional source-driven software Chromium/WebGL2 capture runner: tests/building-pool/roadmap-3a/preview-m3-fourth-browser.mjs. It demands 180 real exterior/cutaway screenshots at 667x375, 844x390 and 932x430, with working readback and no GL errors. Only claim browser PASS if it was actually executed and reviewed. Renderer draws authored voxel cube proxies; no assertion of integrated Pack partial meshes or live-game iPhone acceptance.
- Scope exclusively src/building-pool/roadmap-3a, tests/building-pool/roadmap-3a, docs/building-pool/roadmap-3a.
- Legacy 30 Pack4 fireplace/chimney mounts; prior roof-bearing warnings; weather, drainage, roof engineering and premium artwork still remain separate blockers. Physical iPhone, schema1, saves and full integration not tested.
- Nothing alters the seven sibling builder drafts, Pack catalogues, biome130, automations, shared runtime, GitHub Pages or locked v0.11.

## Next
Finish 15 original carpenter fifth variants, then 45 remaining mining-workshop M4 source blueprints. Preserve current original geometry; do not merge or deploy without explicit creator approval.
