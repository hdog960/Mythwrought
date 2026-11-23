// MYTHWROUGHT issue #291 — research-only, original-game A/B evidence gate.
// Pure/read-only: no WebGL, DOM, saves, GitHub Actions or production imports.
// This can judge measured numeric gates, NEVER release/pixel/rollback approval.
export const ISSUE291_MIN_DEEP_MINES = 100;
export const ISSUE291_MAX_UPLOAD_P95_MS = 33;
export const ISSUE291_REQUIRED_IMPROVEMENT = 0.10;
export const ISSUE291_EXPECTED_VIEWPORT_COUNT = 4;
const validNumber = n => typeof n === 'number' && Number.isFinite(n) && n >= 0;
const validPositive = n => validNumber(n) && n > 0;
const validCount = n => Number.isSafeInteger(n) && n >= 0;
const viewportKey = v => Array.isArray(v) && v.length === 2 &&
  v.every(Number.isSafeInteger) && v[0] > v[1] && v[1] >= 200 ? v.join('x') : null;

export function evaluateIssue291FourViewportAB({expectedViewports, pairs} = {}) {
  const failures = [], comparisons = [];
  const externalProofsStillRequired = Object.freeze([
    'Original-game WebGL2 screenshot and physical pixel parity',
    'Native schema-1 near/far/save and GPU buffer rollback',
    'Twelve genuine MINE + gravity tests and original world-system compatibility',
    'Physical installed iPhone 17 Pro Max Home Screen acceptance',
    'Verified identical deep-edit plan and render conditions between runs'
  ]);
  if (!Array.isArray(expectedViewports) ||
      expectedViewports.length !== ISSUE291_EXPECTED_VIEWPORT_COUNT ||
      !expectedViewports.every(v => viewportKey(v) !== null) ||
      new Set(expectedViewports.map(viewportKey)).size !== ISSUE291_EXPECTED_VIEWPORT_COUNT) {
    failures.push('Four distinct explicit landscape CSS viewports are required');
  }
  if (!Array.isArray(pairs) || pairs.length !== ISSUE291_EXPECTED_VIEWPORT_COUNT) {
    failures.push('Exactly four original-control/experimental-VAO pairs are required');
  }
  if (failures.length) return Object.freeze({metricGatesPassed:false, releaseCertified:false,
    failures:Object.freeze(failures), comparisons:Object.freeze(comparisons), externalProofsStillRequired});
  let commonSeed = null;
  for (let i = 0; i < ISSUE291_EXPECTED_VIEWPORT_COUNT; i++) {
    const target = viewportKey(expectedViewports[i]);
    const pair = pairs[i];
    const fail = reason => failures.push(target + ': ' + reason);
    const control = pair?.control, candidate = pair?.candidate;
    if (!control || !candidate || typeof control !== 'object' || typeof candidate !== 'object') {
      fail('Both source-original control and local VAO snapshots are required');
      continue;
    }
    for (const [label,run,mode] of [['control',control,'original-control'],
                                    ['candidate',candidate,'experimental-vao']]) {
      if (run.mode !== mode) fail(label + ' renderer identity is incorrect');
      if (run.protocol !== '291-local-4viewport-v5') fail(label + ' protocol is not certified for comparison');
      if (viewportKey(run.viewportCss) !== target) fail(label + ' CSS viewport differs from expected');
      if (!viewportKey(run.viewportPixels)) fail(label + ' physical buffer viewport is not landscape');
      if (run.fatal !== false || run.graphicsLost !== false || run.pageSuspended !== false)
        fail(label + ' has a fatal/suspended graphics state');
      if (run.continuousForegroundRun !== true ||
          !validCount(run.interruptionCount) || run.interruptionCount !== 0)
        fail(label + ' was hidden, suspended or context-lost during the observed A/B run');
      if (!validCount(run.trueSavedDeepMines) || run.trueSavedDeepMines !== ISSUE291_MIN_DEEP_MINES)
        fail(label + ' must capture exactly 100 saved deep MINE actions in the comparison window');
      // Count/seed alone is not proof that the same voxels were mined.
      // This is a fully ordered source-original trace of actual successful
      // saved MINE results; fail closed for missing, truncated or forged rows.
      const witness=run.mineWitness;
      if (!Array.isArray(witness) || witness.length !== run.trueSavedDeepMines ||
          run.mineWitnessOverflow !== false || run.mineWitnessInvalid !== false ||
          !witness.every(row=>Array.isArray(row) && row.length===5 &&
            row.every(Number.isSafeInteger) && row[1]<-5 &&
            row[3]>0 && row[4]===0) ||
          new Set(witness.map(row=>row.slice(0,3).join(','))).size !== witness.length)
        fail(label + ' lacks a complete unique ordered source-saved deep MINE witness');
      // The measured p95 MUST come from frames spanning the exact 100
      // saved source-real mines, not idle screen frames before or after.
      // Faster rendering naturally changes frame count; equality of total
      // frame count is NOT a valid A/B constraint.
      const trial=run.mineFrameWindow;
      const render=trial?.renderIdentity;
      if (!Array.isArray(render) || render.length!==4 ||
          !viewportKey(render.slice(0,2)) ||
          render[0]!==run.viewportPixels?.[0] ||
          render[1]!==run.viewportPixels?.[1] ||
          typeof render[2]!=='string' || render[2].length===0 ||
          !validPositive(render[3]))
        fail(label + ' lacks a stable original physical canvas/preset/DPR profile');
      if (!trial || trial.phase!=='complete' || trial.savedMines!==100 ||
          trial.overflow!==false || trial.invalid!==false ||
          trial.interrupted!==false || trial.editPending!==false ||
          trial.invalidReason!==null ||
          !validCount(trial.frameGapsRecorded) || trial.frameGapsRecorded<101 ||
          trial.maxFrameSamples!==16384 ||
          trial.frameGapsRecorded>trial.maxFrameSamples ||
          !validCount(trial.slowFrames) || trial.slowFrames>trial.frameGapsRecorded ||
          !validPositive(trial.elapsedMs) || !validPositive(trial.frameP95Ms))
        fail(label + ' lacks a complete bounded uninterrupted real mining-frame trial');
      // Original successful guarded native uploads are measured within the
      // exact same 100 source-saved MINE trial, including the first edit and
      // both final draw gaps. General rolling GPU history is NOT admissible.
      if (!trial || !validCount(trial.successfulGuardedUploads) ||
          trial.successfulGuardedUploads===0 ||
          trial.maxUploadSamples!==4096 ||
          trial.successfulGuardedUploads>trial.maxUploadSamples ||
          trial.uploadOverflow!==false || !validCount(trial.uploadFaults) ||
          trial.uploadFaults!==0)
        fail(label + ' lacks complete fault-free mining-bound guarded GPU uploads');
      if (!validPositive(run.miningActionP95Ms))
        fail(label + ' lacks finite positive original saved-MINE action p95');
      if (!validNumber(trial?.successfulGuardedUploadP95Ms) ||
          trial.successfulGuardedUploadP95Ms > ISSUE291_MAX_UPLOAD_P95_MS)
        fail(label + ' mining-bound guarded upload p95 exceeds 33ms or is missing');
      if (run.readOnly !== true || run.releaseCertified !== false ||
          run.nativeGpuRollbackProven !== false || run.browserPixelParityProven !== false)
        fail(label + ' diagnostic evidence must not claim release or rollback certification');
    }
    if (control.nearStatus !== null) fail('Original-control run must not have a VAO adapter');
    if (candidate.nearStatus?.phase !== 'ready' ||
        candidate.nearStatus?.cache?.vaoSupported !== true)
      fail('Experimental run has not demonstrated an active WebGL2 VAO adapter');
    if (!validCount(control.seed) || control.seed !== candidate.seed)
      fail('World seed differs between control and VAO');
    if (commonSeed !== null && control.seed !== commonSeed)
      fail('World seed differs across landscape viewports');
    if (commonSeed === null && validCount(control.seed)) commonSeed = control.seed;
    if (JSON.stringify(control.viewportPixels) !== JSON.stringify(candidate.viewportPixels))
      fail('Original physical rendering viewport differs between control and VAO');
    if (JSON.stringify(control.mineFrameWindow?.renderIdentity) !==
        JSON.stringify(candidate.mineFrameWindow?.renderIdentity))
      fail('Control and VAO original physical render preset/DPR differ');
    if (control.trueSavedDeepMines !== candidate.trueSavedDeepMines)
      fail('Control and VAO saved deep-MINE counts are unequal');
    if (JSON.stringify(control.mineWitness) !== JSON.stringify(candidate.mineWitness))
      fail('Control and VAO saved deep-MINE cell/previous-ID order differs');
    // Identical 100 source-real edits can take differing frame counts at
    // different FPS; compare the same bounded *work interval* instead.
    if (validCount(control.mineFrameWindow?.slowFrames) &&
        validCount(candidate.mineFrameWindow?.slowFrames) &&
        candidate.mineFrameWindow.slowFrames > control.mineFrameWindow.slowFrames)
      fail('VAO slow-frame regression during matched 100 deep mines');
    // Differing trial frame counts can hide a worse proportion of late
    // frames despite equal/fewer absolute late frames. Cross-multiply
    // bounded integer samples without rounding; preserve the count veto.
    const controlWindow=control.mineFrameWindow, candidateWindow=candidate.mineFrameWindow;
    if (validCount(controlWindow?.slowFrames) &&
        validCount(candidateWindow?.slowFrames) &&
        validCount(controlWindow?.frameGapsRecorded) &&
        validCount(candidateWindow?.frameGapsRecorded) &&
        controlWindow.frameGapsRecorded>0 && candidateWindow.frameGapsRecorded>0 &&
        candidateWindow.slowFrames * controlWindow.frameGapsRecorded >
          controlWindow.slowFrames * candidateWindow.frameGapsRecorded)
      fail('VAO slow-frame rate regression during matched 100 deep mines');
    const actionGain = validPositive(control.miningActionP95Ms) && validPositive(candidate.miningActionP95Ms)
      ? 1 - candidate.miningActionP95Ms/control.miningActionP95Ms : null;
    const frameGain = validPositive(control.mineFrameWindow?.frameP95Ms) &&
      validPositive(candidate.mineFrameWindow?.frameP95Ms)
      ? 1 - candidate.mineFrameWindow.frameP95Ms/control.mineFrameWindow.frameP95Ms : null;
    if (actionGain === null || actionGain + 1e-12 < ISSUE291_REQUIRED_IMPROVEMENT)
      fail('Deep MINE action p95 has not improved by at least 10%');
    if (frameGain === null || frameGain + 1e-12 < ISSUE291_REQUIRED_IMPROVEMENT)
      fail('Foreground frame p95 has not improved by at least 10%');
    comparisons.push(Object.freeze({viewport:target,seed:control.seed,
      witnessedMineActions:Array.isArray(control.mineWitness)?control.mineWitness.length:0,
      controlMines:control.trueSavedDeepMines,candidateMines:candidate.trueSavedDeepMines,
      actionImprovementPct:actionGain===null?null:Math.round(actionGain*10000)/100,
      frameImprovementPct:frameGain===null?null:Math.round(frameGain*10000)/100,
      controlUploadP95Ms:control.mineFrameWindow?.successfulGuardedUploadP95Ms??null,
      candidateUploadP95Ms:candidate.mineFrameWindow?.successfulGuardedUploadP95Ms??null,
      controlTrialUploads:control.mineFrameWindow?.successfulGuardedUploads??null,
      candidateTrialUploads:candidate.mineFrameWindow?.successfulGuardedUploads??null,
      renderIdentity:Array.isArray(control.mineFrameWindow?.renderIdentity)?
        Object.freeze([...control.mineFrameWindow.renderIdentity]):null,
      controlTrialFrames:control.mineFrameWindow?.frameGapsRecorded??null,
      candidateTrialFrames:candidate.mineFrameWindow?.frameGapsRecorded??null,
      controlTrialElapsedMs:control.mineFrameWindow?.elapsedMs??null,
      candidateTrialElapsedMs:candidate.mineFrameWindow?.elapsedMs??null,
      controlSlowFrames:control.mineFrameWindow?.slowFrames??null,
      candidateSlowFrames:candidate.mineFrameWindow?.slowFrames??null,
      controlSlowFrameRate:validCount(controlWindow?.slowFrames)&&
        validCount(controlWindow?.frameGapsRecorded)&&controlWindow.frameGapsRecorded>0?
        controlWindow.slowFrames/controlWindow.frameGapsRecorded:null,
      candidateSlowFrameRate:validCount(candidateWindow?.slowFrames)&&
        validCount(candidateWindow?.frameGapsRecorded)&&candidateWindow.frameGapsRecorded>0?
        candidateWindow.slowFrames/candidateWindow.frameGapsRecorded:null}));
  }
  return Object.freeze({metricGatesPassed:failures.length===0,releaseCertified:false,
    failures:Object.freeze(failures),comparisons:Object.freeze(comparisons),externalProofsStillRequired});
}
