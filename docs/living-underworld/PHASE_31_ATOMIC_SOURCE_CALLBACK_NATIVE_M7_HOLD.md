# Living Underworld Phase 31 — atomic original source callbacks and permanent refusal

## Verified isolated ancestry

New isolated Cave Dev research branch **dev/living-underworld-phase31-atomic-source-read-20261123** derived only from exact Phase30 HEAD **9a2c95f4215165bad21e2ad9f7ed7afda37a476f**. FIRST read the Phase30 handoff: docs/living-underworld/PHASE_30_STRICT_PRE_READ_M7_SOURCE_BUDGET_HANDOFF.md.

Protected GitHub refs verified at entry:
- Main **db4bbcc32156e5df311f733bcaa53d559c17313b**, external Desert Phase3 PR463 release; NEVER reset or rebase.
- Cave Phase20 **13d4f2da6833dc237005dbe8719b5edc23580304**; Phase21 **3f5190d36f65b69ee085fa7339e5043642c7fe82**; Phase22 **2ee6e13789115a686b482b07f2f126de3eb8189a**; Phase23 **561dc28498c439f6a15b9d7830f660f95cd65fcf**; Phase24 **00d3c590f106340a70fa98b1cefffddb354f985d**; Phase25 **dce954b337e06a818ce71c224959ac33500d6df1**; Phase26 **7ce7c9c276e4da4dd7d0be7afc5f2cf15de4da78**; Phase27 **791513b0af3e795cdd53041c099a744e8d9b7572**; Phase28 **23ab6c21ef769acede6684fc9d35a116a108d01d**; Phase29 **dcd08855beca25afa7f72d7942b67acf808425fa**; Phase30 **9a2c95f4215165bad21e2ad9f7ed7afda37a476f**.
- OPEN DRAFT PR367 HEAD **f7de8cfe6c4e055e94bf1ce2398ad7aa97e588e0**, not merged.

Only isolated Cave Dev original-source proof module, focused tests, native original-world read-only report, triplet classifier and this handoff were changed. No protected parent/main/PR, Desert or other developer work, hourly automations, settlement, original voxel or physics, saves, PWA, shared GitHub workflow, merge, deployment, CI cancellation or dispatch was changed.

## Engineering: original source reader atomicity and hard failures

**Issue:** Phase30 enforced pre-read total/per-role voxel budgets, but an underlying caller-provided original FourRegionWorld source callback could synchronously THROW or recursively enter another wrapped source reader. Previously a caller could catch the error and continue, or nested callbacks could run before the outer read was charged, weakening the integrity of later original source admission even if a final report refused.

**Phase31 source change**: src/living-underworld/source-cross-audit-ledger.mjs.
- Maintains all prior exact function binding, source visit caps, old-world primitive role types, original geography/edit/landmark return tracking, and no writes.
- Reserves the permitted original source callback invocation in actual source counters BEFORE calling the underlying function. Source call totals remain honest if that function fails.
- A new originalCallbackActive guard blocks any synchronous reentrant invocation of ANY wrapped role, before the nested original-world callback can execute. Failure: ORIGINAL_SOURCE_REENTRANT_CALLBACK; sticky full-ledger seal.
- An underlying source exception marks ORIGINAL_SOURCE_CALLBACK_THROWN with first role, voxel, phase and error type. No subsequent original-world callback may run even if a caller catches the exception. The thrown wrapper error has a stable code.
- If the underlying callback catches/suppresses its own nested-ledger error and returns an apparently valid material, the OUTER read still rejects that return because the sticky refusal persists. No fabricated safe source observations.
- Immutable report adds sourceCallbackFailures, sourceReadReentrancyGuardEnforced and sourceCallbackInvocationsReservedBeforeCall. Original pre-read hard caps remain exactly max 160000 distinct voxels per role and 1200000 total source callbacks by default.
- This is strictly read-only source engineering. It does NOT authenticate original M7 world identity or claim native M7 walking proof.

**Original M7 script/report**: scripts/underworld/audit-m7-original-city-terrace-source.mjs now exposes explicit callback failure count, atomic reservation and reentrancy flags in both genuine original seed179 (2,0), (2,1) read-only research site rows. An exception may abort the script rather than return a report; this is a legitimate HARD HOLD. The script still uses the existing three-M7-script research program and adds no source queries.

**Independent report gate**: src/living-underworld/m7-triplet-readonly-admission.mjs requires both original M7 city report rows to prove zero underlying source callback failures, explicit atomic reservation and reentrancy protection, as well as all earlier source geometry, ore/AIR/edit/landmark, old source value stability, 7-grade and full walking, source cap and nonrelease gates. Missing, forged or nonzero data holds under RARE_CITY_UNDERPASS_PRIOR_TO_BRIDGE_SOURCE_VALUE_HOLD.

**Focused tests**: tests/living-underworld-source-cross-audit-ledger.test.mjs now contains **26** cases (8 new) for callback exceptions in both source phases, recursive reads, swallowed nested errors, reserved source call counts for throwing readers, and unaffected legal paths. tests/living-underworld-m7-triplet-readonly-admission.test.mjs now has **45** cases (3 new) for missing or forged callback exception/atomic/reentrancy reports on either site. The pinned read-only scripts/underworld/audit-m7-exact-head-triplet.mjs remains EXACTLY **24 focused native Node test files** and EXACTLY **three original M7 source scripts**; NO new Actions or broad duplicated tests.

## Actual test evidence and strict scope

**Native Node v22.16.0 targeted isolated source tests, NOT full original M7:**
- Local exact source copy at /mnt/data/phase31-native/src/living-underworld/source-cross-audit-ledger.mjs, patched from the verified Phase30 Git blob and checked using native git hash-object. Git SHA-1 of the exact executed module is **4b87573ef6d4d78781b431b696413c636968df68**, identical to authenticated committed GitHub Phase31 source.
- Native node --check succeeded. Native node --test on two local targeted smoke files succeeded **22/22**, zero failures: 10 earlier pre-read hard-budget tests + 12 new Phase31 recursive/exception/caught-refusal/read-count tests. These smoke files are not the full committed 26-case test file or the complete original M7 checkout.
- Tests confirm no second source callback after caught failure, reserved original callback count, no nested role invocation, failure despite a source callback catching a nested error, exactly-one source invocation for a thrown read, unaffected legal limit paths and unchanged source value checks.

**Controlled exact committed GitHub source-body V8, NOT native M7:**
- Exact Phase31 source blob **4b87573ef6d4d78781b431b696413c636968df68**, 26-case committed test blob **7ed774253d76a992c127bef4988267df709fa7d5**: **26/26 PASS** in strict V8 with ESM imports removed.
- Current original triplet accounting, classifier and committed 45-case classifier test blob **866d5ba7b318ee5a2fd205eb526885f06ec937cf**: **45/45 PASS** in controlled source-body V8.
- The unchanged original source-body original stepPlayer/voxel collides synthetic grade/continuous physics work was NOT rerun redundantly. The earlier ARTIFICIAL seven-grade stone corridor had seven forward and seven reverse original controller elevation grades and 2398 frames, but that is historical synthetic V8 evidence, NOT an original M7 site, Phase31 full physics result or live world approval.

## Genuine original M7 native gate remains UNRUN

A complete clean authenticated original MYTHWROUGHT checkout remains inaccessible: local git ls-remote HTTPS fails DNS for github.com; MSI connected desktop was previously offline. The genuine original FourRegionWorld/M7 seed179 sites (2,0) and (2,1), original four source roles, ore/authored AIR/edits/landmarks, seven-grade bidirectional original stepPlayer and uninterrupted actual physical walking, 80 original galleries, and pinned 24-native-file/three-original-M7-script exact-head run have NOT executed at this Phase31 SHA. Native isolated ledger tests and controlled V8 do NOT constitute authentic M7 acceptance.

## Mandatory next phase

1. Verify this final Phase31 isolated GitHub HEAD and protected refs/OPEN DRAFT PR367, read this handoff FIRST.
2. When a COMPLETE CLEAN authenticated original repository is accessible at exact Phase31 HEAD run ONCE:
   node scripts/underworld/audit-m7-exact-head-triplet.mjs [verified exact 40-hex Phase31 HEAD]
   Preserve true native exit status, source hashes, original M7 witness reports, 24 focused test results and EXACTLY THREE original M7 scripts. Every error/failed original world-source/ore/cave/landmark/grade/physics/callback budget gate stays a hard research HOLD; do NOT weaken it or duplicate broad CI.
3. Also require real 80-gallery as-built provenance, M7 constructor faults seeds 8675309 and 13579, actual generated world construction, real Pack2/130/Pack3/Pack5/nonblock collision overlays, GPU chunk core+halo, iPhone WebGL2 perf, saves and installed Home Screen offline PWA prior to ANY release or gameplay integration. Historic whole-city ellipse still rejected; no settlements or speculative worldwide deep AIR density.
4. No unauthorized merges, deployments, protected ref moves, rebase/reset, CI cancellation or dispatch, Desert or other developer branch edits, hourly automation/settlement work, original physics/voxel changes or shared workflow mutations.
