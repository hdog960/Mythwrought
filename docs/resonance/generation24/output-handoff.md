# :24 generation-output-v1 handoff (candidate)
Read-only producer descriptor for :36 networks and :48 devices; not an integration approval.
Source: `output-handoff.mjs`, `exportGeneratorOutput`, `validateGeneratorOutputs`.
Each output has exact observed tick, stable instance key, status, bounded capacity and available units per 1000ms tick. Inputs require an external verified observation, but the producer cannot authenticate that authority. A blocked source reports zero. Duplicate sources, stale tick, malformed signatures and output overflow fail closed.
Fuel authorization remains **external-required**: output is a proposal, never an inventory withdrawal or a promise of committed energy. No network transfer, storage, save mutation or production renderer access.
Consumers must pin the exact source SHA after commit, compare descriptor signature `resonance-generation-output-v1`, and refuse incompatible versions. This prototype has no real-world adapter; manual integration and independent iPhone/WebGL2 validation remain mandatory.
Run `node --test tests/resonance-generation24-output-handoff.mjs`.
