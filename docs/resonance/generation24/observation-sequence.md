# :24 G4 sequential environmental evidence fixture
Contract: `resonance-generation-sequence-v1`, layered on `resonance-generation-observation-v1` and `resonance-power-v1`.
Run: `node --test tests/resonance-generation24-observation-sequence.mjs`.
All tick observations must be externally verified, source-bound and exact-tick. No extrapolation or offline catch-up without evidence. Duplicate identities and missing ticks fail the entire batch. `generatedCandidate` is **not delivered energy**; `fuelRequiredCandidate` is **not withdrawn fuel**. :36/:48 must not treat this as an authorized network transfer. Requires independent external fuel authorization and authoritative world API before integration. No production registration or browser proof is claimed.
