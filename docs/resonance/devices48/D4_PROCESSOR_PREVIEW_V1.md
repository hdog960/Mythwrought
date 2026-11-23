# :48 D4 Processor preview v1 (source-only)

Pure deterministic planning API: `previewProcessing(request)`. Only explicit fixture-owned opt-in drops can be considered. Validates world, owner, provenance, recipe, bounded energy and output capacity. Consumption is deterministic by item ID. No inventory writes, voxel edits, harvesting, production registration, save changes, or actual :36 power receipt. Every result has `canActuate:false`. The energy number is only a proposed budget, never authoritative allocation. A game-owned inventory transaction and :36 authenticated delivered-power contract are required before integration.

Focused native tests: `node --test tests/resonance-devices48-processor-preview-v1.test.mjs`. No WebGL2 or iPhone capture claimed.
