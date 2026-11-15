# Builder 3A — M0 setup and preservation checkpoint (2026-11-15)

**DRAFT THEORETICAL SOURCE ONLY. NO LIVE BUILDINGS, INCORPORATION, MERGE OR DEPLOY.**

## Infrastructure / source locks
- PR #178 merged into main as `e6bd7c173a4531ba7efc153e5f2eb89870c3b9db`.
- Exact infrastructure candidate `7f7431f97a137c89d900735758b3cd2d183ea47b` passed Actions run #43762245025, including the full 20-script gate.
- New 3A branch starts from that main commit; no older legacy building branch is used as base.
- Read-only original PR #122 at `e35b8eca644f6de06e76ab946103ce64a6b7fb91`, still open and draft at initial inspection.
- Current original `src/building-pool/roadmap-3/m1.mjs` Git blob `189ac4deb11042534743045b5087a7a7525e3bf1` and `docs/building-pool/roadmap-3/M1_MANIFEST.json` Git blob `deab2505c5be9ad752ab9f01c0f6cc776b19fc66`. **Refresh these before M1 migration.**
- Main checkpoint file `docs/INTEGRATION_CHECKPOINTS.md` Git blob `3d25b0a3451dae958769d226a9edfc7abefb7133` at inspection; separate v0.10 Gate A/open, v0.11 locked.

## Ownership, quotas and 15 legacy candidates
Only `src/building-pool/roadmap-3a/`, `tests/building-pool/roadmap-3a/`, `docs/building-pool/roadmap-3a/`.
Exclusive categories: blacksmith 75; armorer 75; carpenter 75; stonemason 60; mining-workshop 60. Exactly 345 across 5 biomes × 3 sizes. No watchtowers: all fortification and other factory categories belong to 3B.

The 15 original blacksmith M1 identities from PR #122 remain allocated **once**, as `r3:blacksmith:<biome>:<size>:1`. The other 330 are `r3a:` identities. The 15 original legacy designs are already coordinate-authored in the **unmerged original source**, not yet copied or verified as geometry-equivalent in the new branch. `LEGACY_BLACKSMITHS.json` captures all 15 original IDs, envelopes, source blobs and occupied-cell counts. That manifest is **provenance**, not a substitution for coordinate-authored blueprints. The new branch has **0 migrated authored models and 0 new models** as of this M0 checkpoint; legacy candidates 15/345 remain preserved in #122, and 330 remain unauthored.

## Work done at M0
- Independent 3A slot generator with enforced five-category quotas, stable inherited IDs, no 3B duplication.
- New strict theoretical design validator: fails closed on metadata-only plans, coordinate conflicts, missing structure, nonexistent family syntax and disconnected navigation; cannot register persistent block IDs.
- Real nested native Node test suite in `tests/building-pool/roadmap-3a/m0.test.mjs`. No claims that tests were run before exact branch CI has completed.
- Native GitHub CI must be reviewed at exact proposed PR HEAD after pushing; original PR CI is not a substitute for this lane's suite.

## Still open
1. M0 migration parity: selectively extract all 15 blacksmith models, exact original identity → new module → *geometry* fingerprint, unchanged occupancy/roof/forge/anvil/stock/chimney/nav; rerun **new lane** tests and genuine Chromium.
2. Verify authoritative `src/builder-assets/manual-five-pack.mjs` physical resolution for 96 family symbols/106 numeric variants. These are integrated manual sources, not all speculative candidates. Do not invent numeric IDs or final AABBs; biome130 pending assets remain symbolic.
3. M1: design representative all-category physical coordinate plans, resolve source-only QA. Genuine WebGL2 preview + 667×375 / 844×390 / 932×430 device-like viewports; iPhone hardware/creator art acceptance separately.
4. Keep PR #122 and all seven sibling lanes unchanged, draft unmerged. Central integrator alone can later approve placement, saves and settlement assembly.

**No Gate A approval, no v0.11 unlock.**
