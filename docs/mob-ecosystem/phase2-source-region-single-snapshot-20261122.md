# Living Ecosystem Phase 2 — stable original source-region selection

Date: 2026-11-22. Status: isolated detached research, no live PopulationManager/MobEngine/world changes or production release authorization.

## Lineage

New direct-child research commit of unreferenced, unpushed detached `4c2602bd047ba2ab8ce86295c6654ddd14677a9c` (Git tree `3a7de8e509f8fe152456ecad68f711962e48e1bf`). Protected main remains `7016e14cd6289f45eaf7fc6a79a362b47996df65`; OPEN DRAFT PR #380 HEAD remains `508209c5473d3d78668dd394eb6bcdf9e6bcff84`; neither is touched by this commit.

## Original authenticated RED defect

Original detached `src/mobs/ecosystem-selection-preview.mjs` blob `d3dc62ee8ff11b12b228828fe7b9f49b2027410f` was fetched and byte-identical to the local file used with Node v22.16.0 (`git hash-object` equality). Original global-clock validRegion reads caller region.cx twice; original selection reader then reads it again for key and again for returned region. Native original module RED case: a periodic getter yields 0,0,0,1 and source chooses key `0,0,0` while returning `region.cx=1` without throwing. Separate original module RED case: a getter supplies `feet=4` for original validator, then `feet=999` for output. This could send regional poll evaluation into a different chunk or physical floor than the source-selected record. **2/2 old-source regression reproductions confirmed** using actual unmodified selection module and a source-equivalent `validRegion`.

A previously independent global census/observer fence cannot catch these values when repeated source selections each return the *same* inconsistent key and region. The fix is within the isolated selection preview, not live world terrain or original `PopulationManager`.

## New isolated source

`src/mobs/ecosystem-selection-preview.mjs` now captures the selected region's four fields once into a frozen snapshot **before** source validation. The original `isValidRegion` now validates that same frozen snapshot. Key, returned region and record lookup all reuse it; no later rereads used for output. Two read-only all-field source identity assertions detect caller mutation after validation and immediately before selected/capacity response, including changes by ledger stale-item getters. Uses strict `Object.is`, preserving signed-zero differences. A write-and-undo ABA change between checks remains beyond this read-only method; no new enforcement or locks on caller objects.

The earlier auth-certificate/global preflight and world/roster fences remain unchanged. Because a valid selected region now needs **three** (capture + two checks), not the previous **four** source cx getter reads, existing dependent `tests/mob-ecosystem-global-observer-boundary.test.mjs` updates three expectations and its would-be fourth-selection threshold without reducing its assertion strength. Unchanged original first-64 selection and cursor advancement, ledger-order eviction, 12-second staleness rule, capacity refusal, and invalid-region selection semantics are preserved.

Added `tests/mob-ecosystem-selection-snapshot-safety.test.mjs` with nine original-source native cases: changing chunk; former four-read periodic mismatch; changing feet; mutating stale-ledger getter; mutating non-stale capacity getter; validator side-effect mutation; single frozen output with three bounded reads; unverified validation; stable invalid/empty cursor semantics.

## Actual executed checks

- Local Node **v22.16.0 native `node --test`: 7/7 PASS** from the EXACT original existing `tests/mob-ecosystem-selection-preview.test.mjs` (Git blob `b18ef56909950cd5e1d77a737b4fb438d1bf4712`) against new source. Existing file remained unchanged.
- New exact-source native **9/9 PASS** `tests/mob-ecosystem-selection-snapshot-safety.test.mjs` against the same new source. Overall **16/16 native direct-module tests green** (no controlled replacement dependencies in this original selection module).
- Local new source Git hash `2c5be6d624e5f6b386c2c8833bc36cd5571aabf9`; new test blob `9315e1ffd200f72101ddc8b4324c14b23f34f639`. Both matched GitHub Git blob objects verbatim. The source and test parsed under Node 22.
- **2/2 historical old-source bug demonstrations passed** before the fix, separately from the 16 green new-source tests.
- Adjusted `tests/mob-ecosystem-global-observer-boundary.test.mjs` source syntax is preserved but its **real full original MobEngine import graph is UNEXECUTED**. The earlier 22/22 focused controlled Node fence tests belong to the PARENT commit and must not be misrepresented as rerun on this HEAD.

## Authentic release HOLD

The complete original MYTHWROUGHT checkout remains unavailable locally because `github.com` DNS cannot resolve; connected original MSI Desktop Commander is offline. Thus no full original `node --test` import-graph suite, genuinely generated three-seed/21-site M7 physical biome/cave comparison, source natural births/PopulationManager private six-second `#away` acceptance, iPhone landscape WebGL2/performance, Schema-1 + Pack2 saves, or installed offline Home Screen PWA are claimed here. Prior root CI worker-version blocker remains a separate mandatory gate.

No GitHub Actions/Chromium, PWA/workflow/worker changes, protected branch ref moves, merges, deployments, job cancellations, other developers, Codex, settlements, builders or five hourly automations touched. **Research-only; keep PR #380 draft.**
