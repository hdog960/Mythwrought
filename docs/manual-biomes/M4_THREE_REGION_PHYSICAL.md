# MYTHWROUGHT M4 — Snow / Mountains / Enchanted Forest (isolated manual draft)

## Scope

New child of M3 traversal PR #262 HEAD `0b165fb5c6308d919270ba3b9e0120367adec73e`, itself child of fully accepted manual M3 Desert PR #251 HEAD `e7e7d665f776efc9f4d42f3fd2884a1b670d7d2e`. All parent PRs remain unmerged/draft. Main remains independently modified only by earlier geometry-removal at `e9223217ef1e91d282900c3fc13a21eeda316b63`, no rebase or deployment.

M4 introduces new explicitly selected profile **`mythwrought-four-surface-regions-v4`**, preserving original v2 and v3 generation baselines as strictly loadable, versioned identities. v3 Desert terrain, supported xeric geology and traversable shoulder are unchanged; **only three biome interiors** receive v4 geology.

Source-owned `src/manual-biomes/three-regions-m4.mjs` composes protected fresh-world terrain at real world coordinates:
- **Snow**: solid registered 272 compacted snowpack, 277 packed glacier, 278 permafrost and restrained 279 rime-coated stone. Natural ice/snow bands and one-block drifts, no paint-only white quads or non-solid powder.
- **Mountains**: solid registered 302 fractured cliffstone, 303 layered stone and 307 rust-streaked geological material with sparse narrow one-block crests. Keep the accepted *physical hidden-stone fill* and unchanged per-chunk **8 MiB** limit; do not regress the prior Mountain blank-render issue.
- **Enchanted Forest**: real registered 286 aether soil and 293 glade stone with short root-like solid ground rises. No new trees, glowing fake foliage or non-block flora imported from :48 automation.

All materials are already registered and physically collidable/mineable; each proposal runs the complete original legacy/landmark/cave headroom gate *before* changing any block. The shoulder fade returns the original source plan, not a new cliff at region boundaries. If any object, saved edit, cave air or landmark is encountered in the full envelope, the entire column is rejected. No block ID additions, changes to core renderer, production saves or automation owner paths.

## Acceptance and remaining gates

Root native tests must execute exact v2/v3 profile stability, registered-solid material variety across real multi-chunk 3D terrain, protected caves/trees/old edits, low-headroom blocking, real Pack2 mining/placement, schema-1 save/reload and profile-safe portable import/export, plus 25-chunk × three new regions budget. Independent genuine Chromium actual-game screenshot captures at **667×375 / 844×390 / 932×430** must include three source-authored regions exterior and real mined cutaway, exact file dimensions, SHA256, source coordinates, GPU state, visible geometry, no context loss or JS errors. Inherited 12-image four-biome and 15-image M3 Desert browser gates must also stay green, as must full native/12 CI contracts, full 20 WebGL2 scripts, Creative flight/depth and full 100-chunk 8 MiB budget.

Separate later milestones: naturally walking all 512 blocks from spawn to distant biomes, map/fog correctness, cave entrance routing and cave-system staging, non-block flora replacement/foliage cleanup (automations own those), finished lighting/art and 60 FPS iPhone Safari/Home Screen/offline PWA. Existing profile-world vault/mirror backups are intentionally unsupported and fail closed; portable WORLD EXPORT is profile-safe. Reconciliation with newer production geometry and final deployment each require **separate explicit creator approval**. No merges, rebases, Pages deployment, automations or builder edits, old save migration or v0.11 unlock.
