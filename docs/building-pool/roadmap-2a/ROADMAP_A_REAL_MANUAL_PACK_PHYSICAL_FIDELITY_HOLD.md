# MYTHWROUGHT Roadmap A — true Manual Five-Pack material / geometry audit (source-only)

## Purpose and scope

This *separate* DRAFT is downstream of protected PR #381 (`1a088c9ce734f7b9f5a101d83334bc3e98375bd5`) and has **no gameplay, source-blueprint or world placement code**. It imports the existing Wave01–07 **79 source candidates**, the actual immutable `MANUAL_FIVE_PACK_CATALOG`, the real Pack5 physical geometry/catalog and `resolveManualFivePackAsset` producer. This is the missing difference between a source-cube gallery and real installed shape and collision. Exact product and physics semantics are read from the source rather than guessed.

The current Roadmap 2A gallery colors cubes only by `kind` (wall, floor, roof, window, etc.), so it cannot certify material appearance, partial voxel AABB support, clearance or GPU uploads. These are **not** final installed Manual Pack meshes. No synthetic roof-recolor, guessed fallback, or 3D visual approval.

## Known verified producer incompatibilities to measure across all 79

- `pack5:079` is **Plaster & Stucco**. Actual Pack 5 source variants are `chalk-lime` and `hand-troweled`, and the producer labels it **wall-mounted**, with explicit wall-backing support offsets and **thin Z collision**. Some 2A blueprints use this as an entire structural `kind:'wall'` weather wall. That wall cannot be certified as load-bearing solely from the source-cube screenshot.
- `pack5:080` is **Fired Brick Masonry**, variants `hearth-running-bond` and `kiln-soldier-course`, with a real **full-cube collider**. Several 2A blueprints label this as `kind:'roof'` and stack it in roof columns. It is physically brick masonry, not the shaped clay roof profiles from Pack 3. Avoid false claims of actual pitched ceramic roofing or runtime savings.
- `pack5:081` is **Ceramic Interior Floor Tiles**, variants `sunburst-encaustic` and `moonwoven-glaze`; the actual producer gives **thin floor collision** and requires support below. The 2A gallery depicts these as full cubes.
- Every Pack5 physical instance must select an **explicit exact authored variant**. Existing 2A source wall/floor/roof cells mostly do not, although the source dependency manifest explicitly admits producer dimensions and support remain unresolved. The diagnostic reports these cells without inventing a default. The report's two real example variants for each Pack5 family are **producer demonstrations**, NEVER chosen assignments for the 79 blueprints.
- Source-created elevated roof cells have continuous vertical source columns, but bottom roof plates frequently stand over air unless proper world-bearing beams and Pack support are installed. The report counts underside roof positions without immediately underlying wall; a spanning roof is **not thereby wrong** but requires actual engineering validation.
- The combined `planManualFivePackBlueprint` dry-run max defaults to 4096 **instances** and does not certify a mixed-pack atomic settlement transaction. This report flags source designs exceeding 4096 *source voxel cells*, explicitly conditional on one instance per source voxel, and does not claim they necessarily exceed an optimized packed-mesh budget.

## Exact-head acceptance contracts

The new Node suite:
1. Imports every actual 79 source design from the protected chain and the real 106 numeric variant / 96 symbolic family five-pack catalog, crosschecks every *used* material against a live source family, all six professions and five biomes; no artificial material aliases.
2. Demonstrates both real physical Pack5 variants for plaster (wall-backed partial), brick (full cube) and tiles (supported thin), using the actual producer's visible/selection/collision AABBs and source color-material palette. It asserts **missing variant** is rejected rather than silently assigning one to a blueprint.
3. Counts all actual source-voxel kinds/materials; source roof bottom over air / not directly over wall; physical variant omissions; actual source symbolic doors not physically inserted; per-building source counts, 4096 conditional flags and unresolved roof/structural/creator-art gates.
4. Exports `artifacts/roadmap-a-producer-fidelity/ROADMAP_A_ALL79_REAL_MANUAL_PACK_PRODUCER_RISK.json` with full 79-design row data, no world or PWA changes.

## Gates deliberately NOT passed

This is **not** a real iPhone FPS test, full runtime material-render screenshot, GPU upload measurement, structural-bearing solution, save transaction, world construction, new rooftop placement, player collision certification or creator-art approval. It does not make the 207 A5 planning manifest live. None of the original 128 commerce, 345 industrial, 315 government or other builders / 5 automations may be edited. Preserve protected main `7016e14cd6289f45eaf7fc6a79a362b47996df65` and schema-1/v0.11 lock. Do not merge or deploy.

If a real producer family or explicit source variant is missing, report it as an authentic unresolved gate. Do not weaken tests or pretend a preferred fallback exists.
