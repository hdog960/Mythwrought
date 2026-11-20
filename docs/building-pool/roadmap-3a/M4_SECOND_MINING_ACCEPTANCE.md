# Builder 3A M4 — Mining pithead second variants (source handoff)

Status: **theoretical only**. Fifteen original source-coordinate mining-workshop variant-2 models have been authored across Temperate, Desert, Snow, Enchanted Forest, Mountain × small/medium/large. Existing 300 models remain unmodified. No deployment, integration, creative registry, resources, save or world changes.

## Original authored pithead geometry
- Source: `src/building-pool/roadmap-3a/m4-mining-second-variants.mjs`; exports `createM4MiningSecondPool()` and `createM4MiningSecondVariant(biome,size)`.
- Fifteen independent region/size site briefs produce **110,624** integer voxel-cell records with real foundations, floors, perimeter walls, roof profiles, purlins, support piers and two unpowered physically rooted Pack1–5 fixture instances in each.
- Physical layout: north cold ore-grade work hall, south mineral dispatch, central full-height roofed two-wide oreway, three unequal west ore transfer wings, two distinct east assay/work bays, carved-out negative-space courtyards, one open orehead loading court and irregular bay corner returns. These are distinctly different from inherited first-variant mining workshops. No fictional powered equipment or operating extraction system.
- Genuine width-two, headroom-three source corridors join 7 named distinct usable work spaces through 8 navigation nodes; actual coordinates and occupancy not merely metadata.
- Proposed 315/345 theoretical candidate inventory: 75 blacksmiths, 75 armorers, 75 carpenters, 60 stonemasons, 30 mining workshops. **30 remain unauthored**: mining variants 3 and 4 (each 15).

## Validation & evidence
- `tests/building-pool/roadmap-3a/m4-mining-second-variants.test.mjs`: original 15 source programme inventory, source occupancy/no overlap, walkable 2×3 routes, 7 physical zones, 315-way full-source D4 uniqueness, preservation of original PR #122 blacksmith geometry fingerprints; 105 normalized source-foundation D4 near-similarity comparisons **strict IoU <0.94** (source-local initial peak 0.908597).
- Source-local roof witness sample: **3,983** actual roof positions, **0** without nearby sourced bearing. Witnesses do not certify roof loading, full-span structure, climate, drainage, waterproofing or environmental durability.
- `src/building-pool/roadmap-3a/m4-mining-second-physical-aabb-audit.mjs` with dedicated native test resolves actual existing manual Pack1–5 producer fixture colliders/supportOffsets/multi-cell occupancy, source-route collision checks, inherited Pack4 mount warnings. No invented runtime IDs or digital inventory.
- `tests/building-pool/roadmap-3a/preview-m4-second.html` and `m4-second-source-cdp.mjs` generate **90 actual Chromium/WebGL2 images** once executed: 15 original designs × exterior/cutaway × 667×375, 844×390, 932×430. The separate `m4-second-cdp.test.mjs` fails CI if any source-driven real browser shot is missing, blank, or GL errors. Screenshots are diagnostic *unit-cube envelopes*, not approved Pack partial geometry.
- **No claims of successful exact HEAD CI or browser evidence until the actual run finishes and artifacts are inspected.** Artifact manifests may expose GitHub Actions temporary pull-request merge SHA, distinguish that from PR branch HEAD.

## Permanent blockers / boundaries
- Preserve 30 legacy PR #122 blacksmith Pack4 mount blockers, inherited M2/M3 bearing witness warnings and prior finished geometry.
- World-integrated actual Pack physical mesh, roof/span/hydrology/heat engineering, approved original art, physical iPhone landscape gameplay, schema1 safety and creator signoff remain unresolved.
- Changes only under Builder 3A-owned `src/building-pool/roadmap-3a/`, `tests/building-pool/roadmap-3a/`, `docs/building-pool/roadmap-3a/`. Seven sibling builders, shared adapters, manual Packs, biome130, five automations and live v0.10/v0.11 unchanged. **Do not merge or deploy.**

## Next M4
Author the 15 mining **third-variant** designs with materially different 3D plans, then the 15 fourth-variants. Keep full D4 uniqueness and normalized floor IoU below 0.94, Pack producer collision/roof audits, genuine source Chromium evidence and strict isolated CI.
