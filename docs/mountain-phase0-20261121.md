# Mythwrought mountain Phase 0 — provenance and guarded-surface repair

Date: 2026-11-21
Authority: creator mountain-roadmap issue #356
Base: production `main` at `7016e14cd6289f45eaf7fc6a79a362b47996df65`
Scope: one isolated V7 mountain-only generation repair; not Codex or any hourly automation.

## Provenance in current source

- `src/manual-biomes/profile-world.mjs`: the M7-only `_columnPlan` uses `v6BiomeAt` and `planEnvironmentalColumn`. It supplies the protected environmental baseline, which has genuine cave/landmark content. Historical M2–M6 generators have separate code paths.
- `src/manual-biomes/environment-v7.mjs`: the old collision guard scans `oldTop - 2` through `WORLD_MAX_Y`. A protected original tree/landmark block at *any* height above the original grass surface aborts the entire V7 overlay, even if the mountain proposal would not touch it.
- `src/voxel.mjs`: the untouched legacy surface cap is `BLOCK.GRASS`. An empty mountain overlay exposes that cap, potentially making abruptly green columns beside mountain rock.
- `src/live-voxel-world.mjs`: legacy live districts include source-authored rectangular cave corridors and landmark envelopes. Those must not be erased while investigating the large rectangular formations in the video. Their exact relationship to the filmed cuts has **not** been proven.
- `src/manual-biomes/environment-v7.mjs`: existing mountain caps are chosen from slate/scree/gneiss with some ID 272 snow, not mountain-native grass. The current snow selection is periodic; native alpine meadows, natural snowlines and deposit clustering remain later phases.
- `src/depth.mjs`: maximum surface height is 19; environmental mountain tops are intentionally capped at 17. Do not change that cap without a separate stability/performance review.

## Reproduction

An independent Node source-formula mirror (not the full game) sampled a deterministic seed-179 mountain rectangle, x = -580..-444, z = -72..72, every 4 blocks (1,295 mountain samples).

- The original planner accepted all 1,295 ordinary unblocked synthetic surface columns.
- Original accepted sample caps: 0 mountain grass, 42 snowy caps, and 62 columns at the current y=17 ceiling.
- Injecting a protected wood cell at oldTop+1 caused full-column cancellation in 1,295/1,295 samples. The original grass was therefore visible on every such synthetic cancellation.
- The mountain-only guarded-cap proposal, when given the same obstruction, returned **exactly one replacement at oldTop** in 1,295/1,295 cases and left the wood and all mountain geometry untouched.
- All 1,295 unblocked mountain proposals stayed byte-for-byte equivalent in the independent mirror.
- All 1,295 artificial cave-support obstructions at oldTop-1 remained rejected.
- Three other-biome representative probes (desert, snow, enchanted) retained prior veto outputs.

**Interpretation limits:** artificial wood injection demonstrates a source-level failure mechanism, *not* its prevalence in a real loaded world or proof that it caused the exact video holes. Authentic `FourRegionWorld` / WebGL2 screenshot / real iPhone checks are still required.

## Implemented narrow fix

When a mountain overlay aborts because a protected block lies **above** the original surface, and the old surface is still supported original grass with stone/dirt beneath it, return a single material write on that original top voxel. Choose mountain rock from the existing V7 ground palette or the existing shared biome shoulder. Never change the column's height or any other y level. Do not alter the original guard for cave/support conflicts, and do not apply to desert/snow/enchanted/plains.

The implementation is in `src/manual-biomes/environment-v7.mjs`; native regression tests live in `tests/mountain-v7-guard.test.mjs`.

## Open findings, explicitly not repaired yet

1. Exact photographed rectangular openings: obtain in-game world seed and coordinates or reproduce matching cave/legacy district footprints before adjusting cavern geometry.
2. Independent alpine grasses/meadows: current V7 mountain caps lack that material and placement layer; plan dedicated mountain-only rules with slope/exposure and natural green.
3. Embedded stone deposits and boulders, snow irregularity, mountain tree slope/height gating, and non-block alpine flora remain phases 2–7.
4. No full source-native tests, head-specific Actions or physical iPhone screenshot certification at the time of this record. Track those separately before acceptance.

## Hard gates

Do not merge, deploy, modify player saves, change Codex, edit five automation branches, or alter cave-owned physical geometry. Any proposed mountain geometry repair must prove safe through exact seed/coordinate evidence and tests first.
