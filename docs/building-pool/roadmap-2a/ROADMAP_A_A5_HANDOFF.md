# MYTHWROUGHT Roadmap A — A5 settlement-ready metadata handoff (PROVISIONAL)

This separate protected draft inherits PR #302 exact source HEAD `0545db3342e2aadd6920030edc1584c885ab0ced`. It adds **metadata extraction and tests only**, without modifying any of the 147 source candidate blueprints, the 128 historical originals, main, other builders, gameplay, automations or saved worlds.

Run native `tests/building-pool/roadmap-2a/roadmap-a-a5-handoff.test.mjs` to generate `artifacts/roadmap-a-a5/A5_SETTLEMENT_HANDOFF_PROVISIONAL.json` with precisely **128 historical + 10 Wave01 provisional + 9 Wave02 provisional = 147** records and **273 yet-unwritten canonical commerce IDs**. Counts are source-authoring checkpoints, not production registration or creator visual acceptance.

Every building record supplies exact source module path, source SHA-256, geometry SHA-256, category/biome/size/variant, integer-cell footprint/envelope/height, local-axis public entrances and possible local road-facing, real rooms and route descriptors, windows, fixture locations, material/roof dependencies, resource/collision **source-cell proxy** budgets, and verified-vs-unverified screenshot status. Plot setbacks and nonflat terrain tolerance remain explicitly unknown rather than invented. Final Pack physical/collision performance, mounting orientations, iPhone renderer, settlement integration, premium art and schema-1 save compatibility remain gated.

Historical 768-image archive GitHub Actions artifact #14664251545 covers only the 128 inherited blueprints; the new 19 must pass their own 114-image gallery in #302. No release, village generator, building registration, merge or deployment is permitted in this PR.
