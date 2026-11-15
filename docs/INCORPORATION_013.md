# Incorporation 013 — creator-commanded automation-only intake

Baseline: main c512fcb9e6e82697cff0c5d26f073e503d51e4a5 (Incorporation 012).
Source: :12 biome130 candidate PR #167 exact head b672fd0f8c27cb38f316e23b578e700549f7405b.

## Included
- Ten independently authored ancient-ruin physical voxel families biome130:061–070 with live numeric IDs 316–325, preserved source geometry/material palettes, four-way rotation.
- Same live world registry, player builder palette and settlement-builder adapter as the 60 previously integrated automation-owned families.
- Three original focused suite files are included and executed from the root npm test gate.
- New native registry/rotation/schema-1/edit rollback and builder evidence, with an actual browser mine/place/save/reload acceptance for ID 325.
- No default terrain placement: these are available for player construction, not automatically spawned ancient ruins.

## Deliberately excluded
- Manual Block Packs 1–5, all manual Building Roadmaps and theoretical building pools.
- :24 unfinished deep caves until actual surface-to-depth traversal, deep band tests and visibility are proven.
- :00/:36/:48 newer draft-only work until focused verification and placement-quality gates are satisfied.
- No mobs, crafting, schema migration, new Gate A approval, or v0.11 unlock.

## Required release gate
Merge only after exact-head full-game native and genuine Chromium/WebGL2 smoke passes; post-merge main CI + Pages publication must be confirmed separately.
