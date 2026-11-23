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
      if (run.protocol !== '291-local-4viewport-v1') fail(label + ' protocol is not certified for comparison');
      if (viewportKey(run.viewportCss) !== target) fail(label + ' CSS viewport differs from expected');
      if (!viewportKey(run.viewportPixels)) fail(label + ' physical buffer viewport is not landscape');
      if (run.fatal !== false || run.graphicsLost !== false || run.pageSuspended !== false)
        fail(label + ' has a fatal/suspended graphics state');
      if (!validCount(run.trueSavedDeepMines) || run.trueSavedDeepMines < ISSUE291_MIN_DEEP_MINES)
        fail(label + ' has fewer than 100 actual saved deep MINE actions');
      if (!validCount(run.frameGapsRecorded) || run.frameGapsRecorded < 100 ||
          !validCount(run.rollingFrameCount) || run.rollingFrameCount !==
          Math.min(run.frameGapsRecorded,2048)) fail(label + ' lacks a consistent real foreground frame window');
      if (!validCount(run.rollingSlowFrames) || run.rollingSlowFrames > run.rollingFrameCount)
        fail(label + ' has inconsistent slow-frame evidence');
      if (!validCount(run.successfulGuardedUploads) || !run.successfulGuardedUploads)
        fail(label + ' has no successful original guarded GPU upload');
      if (!validPositive(run.miningActionP95Ms) || !validPositive(run.rollingFrameP95Ms))
        fail(label + ' lacks finite positive action/frame p95 values');
      if (!validNumber(run.rollingSuccessfulUploadP95Ms) ||
          run.rollingSuccessfulUploadP95Ms > ISSUE291_MAX_UPLOAD_P95_MS)
        fail(label + ' guarded upload p95 exceeds 33ms or is missing');
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
    if (control.trueSavedDeepMines !== candidate.trueSavedDeepMines)
      fail('Control and VAO saved deep-MINE counts are unequal');
    if (control.frameGapsRecorded !== candidate.frameGapsRecorded)
      fail('Control and VAO frame observation counts are unequal');
    if (validCount(control.rollingSlowFrames) && validCount(candidate.rollingSlowFrames) &&
        candidate.rollingSlowFrames > control.rollingSlowFrames)
      fail('VAO slow-frame regression compared with original control');
    const actionGain = validPositive(control.miningActionP95Ms) && validPositive(candidate.miningActionP95Ms)
      ? 1 - candidate.miningActionP95Ms/control.miningActionP95Ms : null;
    const frameGain = validPositive(control.rollingFrameP95Ms) && validPositive(candidate.rollingFrameP95Ms)
      ? 1 - candidate.rollingFrameP95Ms/control.rollingFrameP95Ms : null;
    if (actionGain === null || actionGain + 1e-12 < ISSUE291_REQUIRED_IMPROVEMENT)
      fail('Deep MINE action p95 has not improved by at least 10%');
    if (frameGain === null || frameGain + 1e-12 < ISSUE291_REQUIRED_IMPROVEMENT)
      fail('Foreground frame p95 has not improved by at least 10%');
    comparisons.push(Object.freeze({viewport:target,seed:control.seed,
      controlMines:control.trueSavedDeepMines,candidateMines:candidate.trueSavedDeepMines,
      actionImprovementPct:actionGain===null?null:Math.round(actionGain*10000)/100,
      frameImprovementPct:frameGain===null?null:Math.round(frameGain*10000)/100,
      controlUploadP95Ms:control.rollingSuccessfulUploadP95Ms,
      candidateUploadP95Ms:candidate.rollingSuccessfulUploadP95Ms,
      controlSlowFrames:control.rollingSlowFrames,candidateSlowFrames:candidate.rollingSlowFrames}));
  }
  return Object.freeze({metricGatesPassed:failures.length===0,releaseCertified:false,
    failures:Object.freeze(failures),comparisons:Object.freeze(comparisons),externalProofsStillRequired});
}
