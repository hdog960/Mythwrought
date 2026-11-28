# Liquid integration queue — Water A coordination
Status 2026-11-27: source-only isolated development. Current observed main 8400d13a6f5521901cbf0909a0c4f6e2e79c1629 (release loading #516); liquid branch development base remains 222b0a8acd736a6502d85c5797f77f0d4f38a861. Unified release PR #503 and all existing Personal assignments remain protected; no production integration slot reserved.

| Candidate owner | Branch | Exclusive proposed source |
|---|---|---|
| Water A | business/liquids/water-core | src/liquids/core/**; water/physics/**; contract; this queue |
| Lava A | business/liquids/lava-physics | src/liquids/lava/physics/** |
| Acid A | business/liquids/acid-physics | src/liquids/acid/physics/** |
| Amber Sap A | business/liquids/amber-sap-physics | src/liquids/amber-sap/physics/** |
| Liquid Resonance A | business/liquids/resonance-physics | src/liquids/liquid-resonance/physics/** |
| Water B | business/liquids/water-content | shared presentation; water content |
| Lava B | business/liquids/lava-content | lava content/presentation |
| Acid B | business/liquids/acid-content | acid content/presentation |
| Amber Sap B | business/liquids/amber-sap-content | Amber Sap content/presentation |
| Liquid Resonance B | business/liquids/resonance-content | Liquid Resonance content/presentation |

All rows are assigned scope, not claims that branches exist. Read contract on Water A branch and pin exact commit when consuming. Each lane retains its own tests/checkpoint. Shared runtime, save, asset registry, movement, biomes and Resonance integration remain outside current write permission. Propose adapters in lane scope; do not copy entire shared engine into other branches. Do not run broad CI for unchanged work. Candidate entries must eventually record exact base/head, impacted owners, dependency digest, targeted evidence, pending integration tests, agreement from current release owner, and explicit creator approval. No merge/deploy or force push authorized. No queue entry implies release acceptance.
