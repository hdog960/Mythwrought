# MYTHWROUGHT — Enchanted Forest Phase 2: Four Real Source Anchors, Deep24 Spiral and Switchback Blocker

**2026-11-23 isolated original-source engineering checkpoint. No merge, release, deployment, source-cave edit, gameplay/physics modification, generator migration, saved world change or installed PWA acceptance.**

## Start, exact ancestry and protected refs

- FIRST read `docs/enchanted-forest/PHASE2_TWELVE_CAVE_AND_ORIGINAL_LANDMARK_NATIVE_HANDOFF_20261123.md` at requested existing branch HEAD `136cedc89dd288185856a6c23a9cb2eac1b7aa77`, original blob `154a50f51a2293c24d2f165f1e3d8cc996207168`.
- Verified original `research/enchanted-p2-deeper-source-landmark-walk-20261123` identical to `136cedc89dd288185856a6c23a9cb2eac1b7aa77` and left it unchanged.
- Checked protected main against expected `7016e14cd6289f45eaf7fc6a79a362b47996df65` ONCE: **main was externally ahead by one commit**. Do not reset/rebase/rewrite this external main movement; do not claim the old expected SHA is still current. Protected `dev/enchanted-forest-overhaul-20261121-phase0` matched exact `db8cad02387050579c75cbdcdea3e94a9f6d6bee` at that one-time check. Neither protected ref was changed.
- Created NEW isolated child `research/enchanted-p2-full-authored-anchors-20261123` at exact entry `136cedc89dd288185856a6c23a9cb2eac1b7aa77`. No other developer branches, hourly automations or Codex work touched.

## Resolved two native statuses that were previously missing

GitHub REST original `actions/runs?head_sha=...` (the connector's previous commit-workflow-run shortcut only shows PR-triggered runs) exposed genuine completed original Node22 **push** jobs:

1. [Actions #45208482801](https://github.com/hdog960/Mythwrought/actions/runs/45208482801), exact workflow source commit `6c49c6d651aa378e082dba2fbd1c94b6f9d2f71e`, job `137810587281`: **native 2/2 PASS**, zero Node test failures. All four original M7 author-owned ramps have real outside→mouth→12-inward-step continuous player walks: 13 total legs, **203 original / 203 experimental ticks** for each cave. Historical authored source drop six blocks, Windcut's net player drop five due outside entry elevation. Deep mined floor veto PASS.
2. [Actions #45209172325](https://github.com/hdog960/Mythwrought/actions/runs/45209172325), exact workflow source commit `1b9167ba123d45d80468125eb067fb99155b6fa5`, job `137812981919`: **native 2/2 PASS**, zero Node test failures. Original deterministic Enchanted **waystone** center `[-105,-280]`, source chunk `[-7,-18]`, eight preserved historical voxels; actual unmodified two-leg player approach path `[-103,9,-283]`→`[-104,9,-283]`→`[-105,9,-283]`, **19 original / 19 experimental ticks**, near original stone voxel `[-105,8,-281]`; actual AIR-mining of source voxel invalidates historical source-identity claim.

**Why both overall workflows are red:** after all native cases had passed, the optional status publication step invoked `curl --fail-with-body -fsS` (simultaneous incompatible `--fail-with-body` and `-f`), exiting with code 2. This is an isolated **reporting-command** failure, not a physics failure. The original historical workflow conclusions stay failure. This child branch repairs only the two inherited workflow-file reporting commands to `curl --fail-with-body --silent --show-error`, new blobs `c324a385d6fba8c67ac5b0548a6ce0166a8f6476` and `78c2ce3fb4a0a6ddc05f4b964c86fdaca6e18984` respectively. **No repeat of their unchanged native tests or retroactive green claim.** New targeted workflows do not depend on custom status publishing, so their complete authentic GitHub Actions conclusions can be checked directly.

## Substantial new isolated original-source engineering

| New file | Git blob | Scope |
|---|---|---|
| `src/manual-biomes/enchanted-original-full-anchor-continuity.mjs` | `17fb68a80986aee4d8a970a7929f69a374d050a3` | Derive real FULL 4 author-owned entrance paths from `originalCaveEntranceSites` and actual original M7 cave mouth `approachSteps`, never hypothetical ground. Independently verify every original cave floor against genuine `environmentCaves.get`, physical `world.get`, three headroom AIR blocks, whole-body AABB and ground probe, preserve actual original standing before mouth; optional truly source-owned old-deep24 `deepCaveRoute` continuation. Replay entire source path using original 25ms `stepPlayer`, inherited velocity/feet/gravity with NO per-window state resets or teleports. Strict 64 author steps, 12 spiral steps, 80 waypoints, 48 ticks per leg, 3840 total physics ticks. Never changes generator, source, player physics or saves. |
| `tests/manual-biomes/enchanted-original-full-anchor-deep24-real-m7.test.mjs` | `616bd2e2cc33a3bdcc1129570540b3642b7ae6fb` | Three new authentic source tests: all four full outside-to-authored-anchor continuous original/candidate walks; old-deep24 anchor + eight actual original :24 deep spiral steps with uninterrupted original player; actual mined last deep source AIR veto before physics. |
| `.github/workflows/enchanted-p2-full-anchor-deep24-native.yml` | `7dfd6cbe0fa411ffe6f533ea45387763de6bd2fc` | Changed-only original Node22 3-case test with protected source Git blob authentication. |
| `src/manual-biomes/enchanted-original-crossowner-network-audit.mjs` | `bd3cafe19b427ce023e5c33230949b0449077c46` | REAL original `:36` switchback source owner handoff audit: exact documented `descentEntranceApproach` and `descentRoute` coordinates, source-owned floor and headroom, original AABB and ground probe. Only attempts continuous original M7 `stepPlayer` if every joining cell is physically supported; rejects missing AIR instead of carving cave terrain. |
| `tests/manual-biomes/enchanted-original-deep12-switchback-source-real-m7.test.mjs` | `099fcf8dc6a6e3e2f124575d4772e6d64447918b` | Three more new exact-original Node22 cases: Old Deep24 first twelve deep spiral steps physically walked, canonical Switchback36 first source handoff admission classified, and deep spiral real AIR-mining veto. |
| `.github/workflows/enchanted-p2-deep12-switchback-native.yml` | `daceccdebc494cffc0b539f529a0a113eb164072` | Focused Node22 3-case new source workflow, no duplicate accepted tests or custom status publishing. |

**Unchanged:** Original game `src/physics.mjs` blob `199cab89fc1e6ab67d12a56c62795ef0ac4b50d7`, original :24 `src/deep-cave-network.mjs` `3c0d2e2ced0ed23a9991da521639e0a4068fb846`, original cave/source generator and original :36 descent, historical M7 ground caps, voxel landmark source, all experimental placement defaults, historical schema-1 saves, PWA, developer lanes and protected refs.

## New successful authentic native Node22 logs

### [Actions #45223663181](https://github.com/hdog960/Mythwrought/actions/runs/45223663181)

- Exact CI-only test HEAD `de0f954cf04a8f64d2bf8a0defa107e459806555`; original job `137864311793` **SUCCESS** with full original Node 22 job logs. **3/3 PASS, 0 failures.**
- True source-authored **full entry-to-anchor** original and experimental player routes:
  - `old-deep24`: 15 uninterrupted legs, **235/235** original/candidate ticks; original anchor `[64,-4,64]`, net player drop 7.
  - `switchback36`: 21 legs, **332/332** ticks; true anchor `[192,-4,188]`, net drop 10.
  - `upper24-windcut`: 33 legs, **525/525** ticks; true anchor `[64,-8,-96]`, net drop 15.
  - `upper24-hollowbend`: 27 legs, **428/428** ticks; true anchor `[-112,-8,64]`, net drop 13.
- True `old-deep24` original surface→anchor→original deep spiral **8** authored deep-route steps in the SAME player state, **23 legs, 336 original/336 experimental physics ticks**, net real player drop 9, final original authored `[72,-6,64]`. Real chunk seam and ground contact preserved; no fresh player spawn between cave and deeper network. Real mined support block veto gives `0` accepted ticks.
- **Not** full deep-network traversal, chamber acceptance, every-seed cave acceptance, home-screen iPhone performance or production integration.

### [Actions #45224368112](https://github.com/hdog960/Mythwrought/actions/runs/45224368112)

- Exact CI-only HEAD `46e1876cfa73182f54940075f6e42217eca6a80d`, job `137866784391` **SUCCESS**, genuine changed-only original Node22 **3/3 PASS**.
- Continued true `old-deep24` original surface→anchor→**12 authored original deep-spiral steps** in ONE player integration: **27 uninterrupted legs, 387 original/387 experimental ticks, 10-block net player drop**. Final actually walked original deep coordinate `[76,-7,64]`, real player feet approximately `-6`. Real author-floor edit at `[76,-7,64]` to AIR returns fail-closed zero physical ticks.
- **Important NEW bounded negative original-source finding**: The exact original `:36` switchback36 anchor at `[192,-4,188]` **has no physically admitted next source cell**. The original `descentEntranceApproach()[1]` is `[192,-5,189]`, real authored floor ID **8 DEEPSTONE** and world.get matching ID8, with cave source headroom values `[0, undefined, undefined]` at Y `[-4,-3,-2]`. Therefore two of the required three authoritative AIR headroom cells are NOT authored, and original M7 whole-body collision reports **blocked**. The original cap correctly returns null; source-authenticated additional steps = **0**, original/candidate physics continuation NOT attempted. This is not a synthetic impossibility proof about every route or Cave Dev's future changes. Do not bridge or fill the missing headroom, spoof collision, or edit :36 owner source without explicit coordination/authorization. Record this as a precise **cross-owner cave-source integration blocker**.
- This blocker does NOT diminish the separately proven Switchback36 outside→actual anchor 21-leg physics. Its lower-network continuation simply remains unaccepted.

## Previously accepted evidence REUSED without repeat

- Source native [#45192357135](https://github.com/hdog960/Mythwrought/actions/runs/45192357135) 4/4, [#45193982272](https://github.com/hdog960/Mythwrought/actions/runs/45193982272) 3/3, [#45194212945](https://github.com/hdog960/Mythwrought/actions/runs/45194212945) 2/2.
- Four genuine original/candidate 9–10-leg seed -88 Enchanted↔Plains walking routes with unchanged 16-block seams, overlay→legacy-ground source and real terrain relief; 52 real original legacy-ground false-negative diagnoses; earlier 2–4-leg border paths; Desert default mode parity; minable edit veto.
- 288 original tree-source chunks; bounded 128 classification cache/1024 canopy cache; original engine GPU and Moonwillow WebGL2 accepted evidence for untouched source.
- **Executed** this turn: source-native **2/2+2/2** recovered log evidence (original two overall workflow-report failures) and two newly launched, genuinely completed **3/3+3/3** native jobs. All **ten** newly reviewed Node22 case bodies passed, though the first two historical workflow conclusions remain failure due solely the optional curl reporting flags. Reused three prior accepted native jobs without rerunning.

## Deliberately avoided and outstanding

- Avoided unrelated tests, broad CI, repeated unchanged native cases, Chromium/PWA screenshot benchmarking, native iPhone performance claims, CI cancellation, main rebase, merges, deployment and any save/schema modification.
- Still unverified: physically walking through the remainder of the original `:24` deep network, chambers/four bands, complete `:36` switchback continuation (blocked at exact source AIR headroom), upper gallery junctions beyond anchors, installed iPhone 17 Pro Max Home Screen PWA FPS/p95/heap/GPU/thermal/offline/saves, and new-generator-version safe migration.
- Next isolated-source priorities: independently extend old `:24` true physical deep spiral farther with distinct evidence (not restating these accepted 12 steps); inspect original `:36` missing Y=-3/-2 AIR as a cave-owner coordination item **without changing source**; separately attempt physically walked upper named network junctions if genuine original source admission allows. Maintain user restrictions and exact ref identity with a one-time check next session.

**Production guard:** Experimental enchanted trees remain OFF by default, research-only, and cannot be saved as historical M7. No new release or merge was authorized.

**This file is the exact handoff from this isolated child.**
