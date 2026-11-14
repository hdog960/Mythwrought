# Pack 5 milestone ledger

- Gate: v0.10 Gate A (OPEN); v0.11 locked.
- Baseline verified: `main` `f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84`, checkpoint 006.
- Coordinated: #109 manual packs, #117 biome130, their active unmerged candidate PRs.
- Stage: M0 framework; physical candidate families 0/18, integrated families 0/18.
- Numeric IDs: none allocated; 255 sentinel avoided.
- Fixtures: test-only symbolic shape, shape raycast, multi-cell occupancy, support, collision, independent snapshots.
- Native Node: 16/16 focused isolated test cases PASSED on locally authored files; verify GitHub source blob parity separately.
- Chromium/WebGL2: local headless execution TIMED OUT with EGL/GPU initialization errors; not verified. Browser harness source is included but no screenshot proof.
- Root CI: standard `npm test` does not discover nested Pack 5 tests. Exact-head CI must be inspected separately.
- Next: Milestone 1 (79 plaster/stucco; 80 fired bricks; 81 interior ceramic tiles) AFTER M0 acceptance.
- No main/engine/other pack/checkpoint/UI/CI/worldgen/deployment modifications.
