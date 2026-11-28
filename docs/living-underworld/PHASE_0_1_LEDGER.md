# The Living Underworld — isolated Phase 0/1 foundation

## Source baseline (2026-11-21)

Production main checked at 7016e14cd6289f45eaf7fc6a79a362b47996df65.
This development lane starts from that exact commit and does not change production, established cave profiles, user saves, other branches, or the five hourly automations.

### Verified architecture

- New unused-seed worlds use M7_ENVIRONMENT_GENERATOR via src/main.mjs and src/manual-biomes/profile-world.mjs.
- Deep native src/voxel.mjs::baseBlock is solid stone/deepstone for Y<-3 absent an overlay.
- M7's cave overlay calls combinedEnvironmentCaves(seed) from src/manual-caves/opt-in-runtime.mjs. This constructs and caches authored cave cells, rather than sampling a worldwide cave field.
- src/manual-caves/source-composition.mjs combines five named sources. Hardcoded sites include deep route origin (64,64), switchback descent (192,192), Windcut Gallery (64,-96) and Hollowbend Loop (-112,64).
- Existing protected cave entry system proposes four named entrance anchors, not an unbounded distribution.
- src/nonblock/candidate-scene.mjs exposes physical non-block scene identities and removal sidecars; cave formations are authored in src/nonblock-environments24/cave-formations.mjs. They require a dedicated underworld integration and persistence audit in later phases.
- Deep streaming currently limits underground sections to a 3x3 view and up to 27 resident GPU buffers (src/depth.mjs). Altering the producer without revisiting visibility/meshing would not prove mobile performance.

### Phase 1 assets delivered on this isolated branch

- src/living-underworld/density-audit.mjs: read-only deterministic stratified natural-voxel sampler; reports overall, four depth bands, biome and far-region air ratios. It marks connectivity, entrances and cavern sizes explicitly NOT_MEASURED.
- scripts/underworld/audit-m7-density.mjs: measures the real existing M7 generator, not a mocked cave count. Run node scripts/underworld/audit-m7-density.mjs 179 8 on a checked-out branch. Use different seeds to establish a representative baseline.
- tests/living-underworld-foundation.test.mjs: pure native deterministic tests for sampling, depth bounds, validation and the detached worldwide candidate.
- src/living-underworld/procedural-core.mjs: first detached prototype of a coordinate-based cavern query. It has no integration import into playable world code. Its density, connectivity, city-sized volumes, visual design and entrance coverage are not certified.

## Known limits / blocking work

1. Complete actual M7 baseline across >=20 seeds, far regions and every biome; keep checked-out SHA with the report. No percentage claim before results.
2. Add regional connected-component topology and natural entrance coverage measurement, not just voxel air ratio.
3. Expand the worldwide candidate with traversable network graphs, natural entrances and multi-scale civilization-sized caverns.
4. Tune / validate 35–40% actual deep cavern air, count air from real eligible natural voxels only.
5. Integrate a new versioned generator only after performance, save and cross-workstream compatibility reviews. Do not change existing M7 worlds' natural baseline.
6. Verify physical non-block removal persistence and iPhone rendering before production selection.

Status: development started, Phase 0 source baseline established, Phase 1 instrumentation authored, Phase 2 candidate unintegrated and unaccepted. No merge, deployment or release authority implied.
