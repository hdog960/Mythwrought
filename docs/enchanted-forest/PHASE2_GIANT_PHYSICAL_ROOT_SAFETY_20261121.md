# MYTHWROUGHT Enchanted Forest — Phase 2 Physical Giant Roots, Isolated Development Checkpoint

**Development-only source branch** `research/enchanted-p2-physical-root-safety-20261121`, created from the unchanged protected enchanted parent `db8cad02387050579c75cbdcdea3e94a9f6d6bee`. Production `main` at session verification: `7016e14cd6289f45eaf7fc6a79a362b47996df65`. **Do not merge or deploy.** Do not change other biomes, builders, settlements, automations, original iPhone/PWA or save versions.

## Fresh CI evidence checked once (not rerun)

- Existing same-source native tree proof: [run 44965659979](https://github.com/hdog960/Mythwrought/actions/runs/44965659979), 34/34 tests, 174 eligible prototype trees across 3 seeds, Y19 bounded, six-chunk original GPU budget green.
- Existing original-engine test-only instrumentation: [run 44972193017](https://github.com/hdog960/Mythwrought/actions/runs/44972193017), source-only historical vs experimental tree proof, 12 original-engine images at 2 viewports. Giant camera positions were different in that run and this limitation was documented.
- Focused real-game Ancient Giant camera-locked [run 44980183092](https://github.com/hdog960/Mythwrought/actions/runs/44980183092) at `d98f00b83fbcc025c2240566b7a5b1683ac36448`: **SUCCESS** as confirmed by exact-head workflow and successful job step results; artifact `14737891203` exists. **No claim of independent post-run image/ZIP authentication in this session.**
- All of the above used the **previous candidate source**. They cannot certify the modified Ancient Giant root algorithm here; unchanged Starspire/Moonwillow code and historical default path may reuse corresponding unchanged evidence. Do not rerun broad browser/WebGL2/whole-repo gates merely for minor source iteration.

## Actual new source engineering

An old experimental Ancient Giant checked whether each corner had a non-AIR block at its level and whether the voxel immediately above was AIR. This could accept a **solid landmark roof with missing real M7 ground-plan provenance** or a **cave void just below one of the other three roots**. This violates the aim for physically grounded two-by-two mineable trees.

New `src/manual-biomes/enchanted-tree-footings.mjs` pure fail-closed validator:
- reads all four physical root cells (including a 16-block chunk seam);
- requires a matching genuine M7 cap entry `readColumn(px,pz).get(floor)` and the actual authoritative source reader to agree;
- requires non-AIR subsoil directly under *every* root, and AIR immediately above each root;
- rejects raised terrain and preexisting landmark geometry rather than burying them under trunks;
- never writes saves, schedules jobs, changes source seed/density rolls or moves the Y19 ceiling.

`src/manual-biomes/environment-v7.mjs` invokes the validator only when an **experimental** candidate has more than one root. Historical M7 trees continue their original exact branch, and Starspire and Moonwillow single-root placement retains the original checks. The prototype remains **explicitly opt-in and unsaveable under historical M7 generator identity**.

## Real focused tests

- `tests/manual-biomes/enchanted-tree-footings.test.mjs`: four localized tests for valid 2×2 root and real 16-cell seam, missing cave subsoil at each of four corners, landmark roof/occupied overhead or missing neighboring cap, no accidental mutation and invalid-input rejection.
- Locally executed `node --check` and `node --test` on the new helper and four direct source-unit tests: **4/4 PASS**, 0 failures. The local helper file's `git hash-object` = **`af249ab68db124618ce8e8cbb46eeaffbc0375c7`**, matching the independently fetched GitHub branch blob SHA. The locally executed test harness has equivalent assertions to the GitHub test but should not be misrepresented as an exact full repository CI run.
- `tests/manual-biomes/enchanted-tree-footings-real-m7.test.mjs` exercises authentic seeded M7 generation, tests physically supported natural Giant footprints and every-root provenance, inserts a synthetic underground cavity under a rear root, and demands that the **entire Giant** be rejected. It also preserves prototype historical-M7 save refusal. This integration test is **committed but not yet executed**; do not claim it passed.
- Existing Phase 1 accepted source, sky, saves, caves, other biomes, production main, original M7 generator, or 5 hourly automations were not changed.

## CI efficiency / remaining gates

- **Executed:** 4/4 focused pure native unit tests and helper syntax on byte-exact source file.
- **Reused:** existing old-source native and original-engine browser evidence (strictly scoped to unchanged code).
- **Avoided:** all duplicate 34-test native runs, full WebGL2 12-capture suites, other developer CI, repeated queue audits.
- **Outstanding:** run actual current-branch integrated real M7 tree-root test and source regressions in a focused environment; reassess natural Giant spawn count after stricter four-foot support; verify canonical source cross-chunk seams; at future visual milestone update authentic Ancient Giant screenshots because the tree placements can change; versioned save migration and physical iPhone installed PWA release gates still outstanding.
- **Congestion:** runner/queue impact minimized by developing on a source child branch not named under the existing `dev/enchanted-forest-overhaul-*` auto-WebGL2 pattern. No new expensive browser run was requested. No workflow cancellation, merge, deployment or shared workflow edit.

This source work is **provisional**, not final visual acceptance or release approval.
