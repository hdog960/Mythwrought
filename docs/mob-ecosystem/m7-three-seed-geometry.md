# Three-seed genuine M7 geometry-comparison candidate

Detached only. The original M7 terrain/Pack2 world reader is compared against the separate, immutable mob collision compatibility reader. Neither query injects mobs, changes the original game, changes terrain or edits saves.

Sources: genuine FourRegionWorld M7 for seeds 179,379,1001; v6BiomeAt at the five source-backed cardinal locations; authored historical deepCaveRoute floors -30 and -80; original mob supportedPosition and spawnEligible, and real source body definitions.

For each of 21 biome/seed/depth observations, use 24 deterministic habitat-first proposals with exactly the same species and X/Z positions in both readers. Log valid candidates and physically located ground, distinguish source original and compatible proposed reader. Do not claim proposals are actual natural births. Require every originally valid candidate to remain valid; fail closed if the compatibility layer causes a regression. Require deep-cave eligibility parity since the M7 reader only changes distinct surface environment blocks. Verify no schema-1 save bytes change.

CI result not yet available; the detached commit must remain unpushed while PR #380 exact-head verification #44965461566/#44965461561 is queued or executing. On completion, review actual logs and only then consider protected draft advancement. Do not merge or deploy.
