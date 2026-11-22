# Floating Islands — isolated upper-world runtime handoff (2026-11-22)

## Source checkpoint

- Branch: `research/floating-islands-sky-runtime-adapter-20261122`
- Base: production `main` `7016e14cd6289f45eaf7fc6a79a362b47996df65`
- Scope: **source-only** compatibility adapter and targeted tests; **not integrated** into live `src/main.mjs`, WebGL2, or Creative flight.
- Codex screenshot is not a source checkout. No floating-islands GitHub branch/PR/commit was found in the initial searches; Codex's reportedly completed generator and saves are **not verified here**.
- Other development lanes, workflows, production main, user saves, and deployed PWA are unchanged by this isolated branch.

## What is now authored

1. `src/floating-islands/sky-runtime-adapter.mjs` maps upper positions from Y=20 through Y=256 into **15** coherent 16-block sections, with a final partial section.
2. Namespaces upper mesh keys as `sky:cx,cz,section`, separate from `cx,cz` surface and `cx,cz,-section` underground keys.
3. Checks full player-body overlap across horizontal and vertical section seams before allowing upper-area flight. Readiness and collision must come from real authoritative production callbacks.
4. Produces **plans only** for a combined ground/sky GPU residency budget, defaulting to **25 total** slots, no more than **six sky slots**, and at most **two new sky mesh jobs per frame**. Retains a nearby 3x3 ground priority when player feet are Y<=52. Max visible upper candidate search radius is six 16-block chunks.
5. Records an explicit lighting contract: floating geometry must not cast enormous ground-darkening shadows, use a new shadow pass, or override the 24-minute day/night atmosphere. This is a **declaration**, NOT proof that a live shader implements it.

## Focused validation

- Native Node v22 test execution: **15 / 15 passing**; module syntax passed.
- Tests cover contiguous Y20..256 limits, negative chunk coordinates, vertical and horizontal seams, collision/readiness refusal, ground/surface ownership, stable coordinate handling beyond 10,000 blocks, deterministic candidate ordering, input caps, deduplication, 25-slot ground-plus-sky budget, upper candidate distance bounds, at-most-two mesh requests, and the non-shadow policy.
- No original-game WebGL2 screenshot, original island generator, iPhone gameplay, app cache refresh, save migration, or CI run is claimed validated.
- Test invocation: `node --test tests/floating-islands/sky-runtime-adapter.test.mjs`.
- This file is **not** included by `npm test` at base `main`, which uses `node --test tests/*.test.mjs`. The focused command above is therefore required until CI wiring is explicitly approved.

## Verified integration blockers in current production source

- `src/depth.mjs` supports section IDs 0 and negative underground sections, with `WORLD_MAX_Y=19`.
- `src/creative-integration/g2-streaming.mjs` rejects a positive vertical section ID. **Do not** map sky IDs to negative underground section IDs; this would collide with existing keys.
- `src/main.mjs` currently limits Creative flight to `WORLD_MAX_Y+48` and streams only surface/negative sections. Simply raising the cap is unsafe before an actual sky resident-and-collision bridge exists.
- `src/gpu-pipeline.mjs` and `src/main.mjs` own active WebGL buffers/shaders. This adapter never creates or commits GPU resources.
- Current long-distance reproducibility is a screenshot report only; **do not** state the unpushed Codex generator was independently exercised.

## Next engineering

1. Acquire and verify Codex's actual latest generator source, commit IDs, upper edit sidecar, and native tests (possibly from a later pushed branch); retain both branch histories.
2. Adapt to the generator's real height/section index metadata; do not silently assume it uses this provisional naming convention.
3. Integrate through a fresh isolated branch with production renderer-owned chunk queue, atomic GPU staging/rollback, bounded ground-plus-sky residency, and actual meshing/collision/mining witnesses.
4. Refactor G2 streaming to accept disjoint upper-region keys safely, preserving underground 0/negative contracts; raise verified flight bounds only after this works.
5. Test daylight under islands (no night-like ground shadow), world-scale generation at distant positive/negative chunks, real island ecology/vegetation, caves/saves coexistence, 3-second/10-second recorder safety, and installed iPhone PWA performance using *targeted* original-game WebGL2 jobs.
6. Keep the long-term floating-islands content roadmap deferred; mobs, settlements, and island structures are not part of this pass.

## CI and branch guard

- Source-only work is on a separate research branch, without opening a pull request, merge, deployment, cancellation, or manual workflow run.
- Reuse exact-commit evidence. Never launch duplicate expensive browser suites without a substantive new integration revision.
- This handoff is not release approval.
