# :12 biome130 isolated candidate ledger — checkpoint 006 baseline
Source of truth: Issue #117. Manual packs reserved in Issue #109. Never write IDs to live world.
M0: previous shape prototype PR #108 preserved independently, not rebased/merged.
M1 desert: #001 Pale dune sand, #002 Red dune sand, #003 Desert hardpan, #004 Cracked salt-flat crust — CANDIDATE; ENGINE BLOCKED for live placement. Symbolic biome130:001..004; prospective 256..259 ONLY after widened-ID support.
#005–#015 desert: NOT STARTED. #016–#130: NOT STARTED.
Each candidate has deterministic 6-face 4×4 indexed material, full-cell bounds, selection/solidity flags, isolated reversible place/remove fixture. No in-game registration.
Dependency: :00 widened-ID registry/cache/mesher and schema-1 safe save/selection ABI, plus creator manual incorporation. No manual pack IDs 9–208 touched.
Next: #005 Sunbaked mud, #006 Wind-carved sandstone, #007 Banded desert rock and distinct non-cubic shapes as appropriate.
