# Resonance :48 advisory pulse descriptor v1

Source-only D5 handoff. `describeResonancePulse(previous,current)` consumes the :48 `resonance48-status-descriptor-v1` shape, not authoritative :36 allocations. `previous` is null for the first tick, otherwise a contiguous previous tick in the same world. All output is frozen, deterministic and capped to a single descriptor per tick.

`palette`: `none`, `rune-blue`, `rune-gold`, or `rune-dim`; `intensity`: integer 0–2; `kind`: `status-change` or `steady`. Blue means **observed** satisfaction, not authenticated power. No lights, particles, mesh uploads, physics, block IDs, saves, or inventory are touched. The renderer must not infer activation from these descriptors. Every descriptor declares `advisoryOnly:true`, `authoritativeDelivery:false`, `energized:false`, `movementAuthorized:false`, `productionBound:false`.

Integration dependency: read-only versioned :36 allocation/delivery contract with provenance and actual engine owner approval. Until then there is no real energized device. D6 three-size genuine WebGL2 evidence and iPhone PWA regression remain pending. No settlement work.
