# MYTHWROUGHT Living Underworld Phase 30 — enforce original M7 source callback limits BEFORE each source read

## Protected ancestry and isolation

This is ONLY new isolated Cave Dev research branch dev/living-underworld-phase30-pre-read-source-budgets-20261123, created from exact verified Phase29 parent dcd08855beca25afa7f72d7942b67acf808425fa.

FIRST read preceding docs/living-underworld/PHASE_29_PRIOR_TO_UNDERPASS_SOURCE_RETURN_LEDGER_HANDOFF.md.

Verified starting GitHub refs:
- main db4bbcc32156e5df311f733bcaa53d559c17313b, external Desert Phase3 PR463 release (do NOT reset, rebase, merge or modify);
- Cave Phase20 13d4f2da6833dc237005dbe8719b5edc23580304;
- Cave Phase21 3f5190d36f65b69ee085fa7339e5043642c7fe82;
- Cave Phase22 2ee6e13789115a686b482b07f2f126de3eb8189a;
- Cave Phase23 561dc28498c439f6a15b9d7830f660f95cd65fcf;
- Cave Phase24 00d3c590f106340a70fa98b1cefffddb354f985d;
- Cave Phase25 dce954b337e06a818ce71c224959ac33500d6df1;
- Cave Phase26 7ce7c9c276e4da4dd7d0be7afc5f2cf15de4da78;
- Cave Phase27 791513b0af3e795cdd53041c099a744e8d9b7572;
- Cave Phase28 23ab6c21ef769acede6684fc9d35a116a108d01d;
- Cave Phase29 dcd08855beca25afa7f72d7942b67acf808425fa;
- OPEN DRAFT PR367 f7de8cfe6c4e055e94bf1ce2398ad7aa97e588e0, UNMERGED.

Only Cave-owned original-source proof module, targeted tests, existing original native-M7 read-only report script, source-report classifier and this handoff changed. No main/other developer/automation/settlement/save/PWA/physics/voxel/PR edits; no CI cancellation, dispatch, merge, deployment or force-push.

## Concrete Phase30 source safety defect fixed

Phase29 already independently compared real original-world geology, authored cave, edits, landmarks between prior deep-city and later bridge surveys. It did mark original source callback LIMIT violations as a hold, but invoked the underlying original-world reader FIRST, then incremented and checked the total. Therefore maxTotalCalls=4 would still invoke a fifth original callback; exceeding per-role distinct-cell limit would also invoke the unrecorded new voxel once. This was fail-closed at the REPORT level but NOT a real hard limit on underlying terrain-reader execution.

1. Updated src/living-underworld/source-cross-audit-ledger.mjs. It now checks the full source-role callback binding, exact total callback count and distinct coordinate budget BEFORE invoking any original source callback. When the NEXT read would exceed a cap it records first refusal, seals the ledger, and throws an error containing the exact stable reason BEFORE any new terrain callback. Even if a malicious or accidental caller catches this error, retrying any role is blocked; the ledger never silently resumes. The original role counts and voxel maps remain within bounds. Changed callback binding at prior-to-underpass phase boundary also seals ALL roles before any later source callback.
2. The default limits are unchanged: max 160000 distinct coordinates PER role and max 1200000 total original-role callbacks. A legal read at EXACTLY those limits is still allowed; only the subsequent over-limit attempted read is refused. Repeated calls to a previously recorded voxel do NOT spend another distinct-coordinate slot, but DO count against the total-call budget. No extra original-world queries or world writes are added.
3. The immutable result now explicitly records preReadHardCapsEnforced=true, blockedSourceCallbackAttempts, sourceCallbacksWithinHardCaps, maximumSourceCallbackCalls and maximumDistinctCoordinatesPerRole. Every previously existing Phase29 result/census and caller-only/non-real-M7 provenance remains. A pre-read refusal can raise a hard error in the original native research script, causing its pinned native run to fail closed, even when no final site report is emitted. Do NOT convert such an error into a synthetic PASS.
4. Updated tests/living-underworld-source-cross-audit-ledger.test.mjs from 14 to 18 focused native ESM tests. Existing tests now explicitly assert that the forbidden fifth callback or second distinct voxel is NOT invoked; retries remain sealed, changed callbacks seal the entire cohort, exact-cap legal reads pass, and repeated already-owned cells remain legal until total source-call cap. 
5. Updated existing scripts/underworld/audit-m7-original-city-terrace-source.mjs to include exact source hard-cap policy, blocked original callback attempts and ACTUAL per-role unique voxel counts in both genuine seed179 M7 site rows (2,0) and (2,1), without extra source queries or an extra research script.
6. Updated src/living-underworld/m7-triplet-readonly-admission.mjs with independent native M7 source evidence requirements: hard pre-read enforcement TRUE, zero blocked callback attempts for a success, successful bounded accounting, explicit configured maxTotalCalls===1200000 and maxCoordinatesPerRole===160000, actual total per-role distinct voxel counts safe and consistent with original prior and later source visit counts. A failed or fabricated budget proof continues to hard-refuse RARE_CITY_UNDERPASS_PRIOR_TO_BRIDGE_SOURCE_VALUE_HOLD. Existing source geometry/ore/authored AIR/player edits/landmarks, independent four-role voxels, prior-to-later old geology value consistency, hypothetical controller physics and non-release rules preserved.
7. Expanded original tests/living-underworld-m7-triplet-readonly-admission.test.mjs from 39 to 42 controlled source-body regression cases, rejecting forged policy flags, missing bounds, nonzero over-limit attempts, impossible actual unique voxel counts and missing fields on EITHER original M7 site.
8. Existing scripts/underworld/audit-m7-exact-head-triplet.mjs remains unchanged: EXACTLY 24 focused native Node test files and EXACTLY THREE original M7 source scripts. No duplicate full test or CI.

## Actually executed tests — do not conflate scopes

TRUE native Node v22.16.0 targeted execution of the EXACT Phase30 source module:
- The source module was copied to a minimal local two-file native project, and node --check passed. Git hash-object of that exact locally executed source file equals the GitHub-verified blob eda5cb90bde31911f338cc78cf8794d5a605610e BYTE FOR BYTE.
- A local, targeted 10-case native node:test smoke suite (not committed, not the full original test file) executed the EXACT source helper and passed 10/10. It independently counted original callbacks for exact total bound, refusal before a ninth callback, per-role distinct-cell bound, blocked retry, changed callback identity, legitimate repeated reads, source value changes, invalid coordinates, invalid geology type and immutability/non-live-M7 provenance.
- The committed original 18-case ledger test source body with Git blob 6b4efb2e03fca9dd23f53ca05d3427db916fcf53 executed in controlled strict V8 test harness with EXACT current source body: 18/18 PASS, zero failed. This 18/18 is NOT a complete native original M7 Node ESM import or all-repository suite.
- Updated original triplet report accounting/classifier/42-case focused test bodies executed in controlled strict V8: 42/42 PASS. No true M7 instantiated; no new source read beyond the synthetic test harness.
- No changes to native original game stepPlayer or collides functions and no attempt to re-run the unchanged broad synthetic physics suite redundantly. Previous Phase29 controlled ARTIFICIAL route with original unchanged function bodies did 7 forward and 7 reverse elevation checks plus 2398 frames, but this is HISTORICAL controlled V8, NOT new Phase30 original world or fresh physics evidence.

## Native M7 blocker still open, without false claims

- Local git ls-remote https://github.com/hdog960/Mythwrought.git HEAD still fails GitHub DNS (Could not resolve host github.com). Connected MSI Remote Desktop Commander machine remained OFFLINE. The authentic complete clean full-repository original-M7 checkout was NOT obtained.
- Thus the two genuine seed179 original M7 world site source reports (2,0) and (2,1), original true seven-grade bidirectional original stepPlayer and full continuous walking, old ore/AIR/edits/landmarks, original 80 gallery source census and 24-native-test / 3-original-script pinned suite remain UNRUN at this child commit. NEVER classify synthetic original-function V8 or native standalone helper testing as native original M7 acceptance.
- A source budget error encountered during future authentic native execution is an explicit HOLD, not permission to weaken the cap or start a duplicate broad CI run.

## Next mandatory phase

1. Verify exact Phase30 child HEAD, production main, all protected Phase20–29 refs and OPEN DRAFT PR367; FIRST read this handoff.
2. On COMPLETE CLEAN authenticated original repository at exact child SHA, execute ONCE:
   node scripts/underworld/audit-m7-exact-head-triplet.mjs [verified-exact-40hex-Phase30-head]
   It will run the SAME 24 focused native Node test files and EXACTLY THREE genuine original M7 read-only source scripts. Preserve actual exit code, stdout/stderr and source SHA; every refused original source role, geometry/grade/player step or budget must hard HOLD. Do not duplicate broad CI or weaken tests.
3. Still independently require genuine as-built 80 galleries, original world constructor fault seeds 8675309 and 13579, live generated-M7 placement and Pack2/130/Pack3/Pack5/nonblock collision overlays, chunk core/halo GPU, iPhone WebGL2/perf, saves and installed Home Screen offline PWA. The historical whole city ellipse remains REJECTED; no settlements or game release approved.
4. No protected ref/main/Desert edits, rebase/merge/deploy, other developer or automations interference, CI cancellation or settlement development without explicit creator authorization.
