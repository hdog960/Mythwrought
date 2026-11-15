# Integration candidate 009 — automation-only incorporation (UNMERGED)

Creator command: "Incorporate now" — all five automated Mythwrought lanes, retaining fifth :00 contributions from before shutdown. Baseline `main` 971e32911984a3cdbb831e143b249ae5d780ed72, checkpoint 008. Do not replay existing checkpoint 007/008 contributions.

## Source cutoffs, exact PR heads
- :00 generic interactions/collision/save: PR #106 `9df6c2eeab05fb4cbcbf3d6812d396c4fef3f4c5` already incorporated by checkpoint 007 and retained on main. No new :00 source PR after that verified; its work remains included, not duplicated.
- :12 biome130: PR #127 `b05aec1be225d9e0270bb68681d1f140fc8ea432` (#013–015), PR #129 `25442fc974a6f9683f994b92445575f47a30b8be` (#016–018), PR #133 `47397d8fc0a2b479c0b13fc8aaa2765873576ba9` (#019–024), PR #137 `8d79e7c3f0b4bc17d232a2155294f228e243a672` (#025–027). Prior #001–012 were already incorporated at checkpoint 007.
- :24 terrain/caves: PR #130 `fc7216e79dde6b1530b1cf6e37d1e6e874635fc2`, south gallery opt-in.
- :36 structures/landmarks: PR #125 `2acb6f90bb754ace48c2cc7ecb0a36be0b3f0565` optional court survey; PR #131 `28e39d31b6fa485c736e2c3d2abb4fe824af1f57` optional physical rotunda.
- :48 world atmosphere: PR #132 `775edbb1d97c6240734370667b1b34042a2057bc` optional twinwood forest arch.

All 18 imported source/test paths are new relative to the base main tree and retain their source exact blob SHAs. The only changed existing path is `tests/auto-biome130.test.mjs`, extending the established root native test bridge to execute all five new nested :12 suites. No shared engine, registry, worldgen, control, save, minimap, workflow, release, or roadmap files modified. No manual Block Pack 1–5 files or Building Roadmap 1–4 files imported.

## Non-negotiable integration/acceptance gates
This PR is a **candidate**, not an automatic authorization to register/spawn new blocks, modify saves or claim all new scenery visible. `biome130:013`–`027` are symbolic future IDs only; proposed numeric IDs 268–282 must not be registered or saved until Issue #117 widened persistent-ID and shape ABI is safe. The optional cave/rotunda/court/twinwood modules are present only as source/test assets; the current seeded world has not been modified to invoke them. New in-game visibility is a separate source-authentic and player-save-safe activation gate.

Require exact-head green root Node + genuine Chromium WebGL2 regression before merging; inspect actual CI logs and representative screenshots. Only after a verified successful merge update the checkpoint ledger truthfully and verify main/Pages. Preserve v0.10 Gate A OPEN, v0.11 LOCKED, schema-1 saves, iPhone side-grip layout, offline PWA, no claims of physical iPhone testing or creator sign-off. Do not touch PR #134/#136 or any of nine manual roadmap branches.
