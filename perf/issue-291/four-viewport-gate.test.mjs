import test from 'node:test';
import assert from 'node:assert/strict';
import {evaluateIssue291FourViewportAB,ISSUE291_MIN_DEEP_MINES,
  ISSUE291_REQUIRED_IMPROVEMENT,ISSUE291_MAX_UPLOAD_P95_MS
} from './four-viewport-gate.mjs';
const viewports=[[956,440],[932,430],[844,390],[916,412]];
function sample(viewport,mode='original-control'){
  const isVao=mode==='experimental-vao';
  return {
    protocol:'291-local-4viewport-v4',mode,viewportCss:[...viewport],
    viewportPixels:[...viewport],seed:2026,playerFeet:-38,
    trueSavedDeepMines:100,
    // Hypothetical test-only fixture. Real measurements must come from the
    // original source and are NEVER supplied by this test generator.
    mineWitness:Array.from({length:100},(_,i)=>[i,-20,0,3,0]),
    mineWitnessOverflow:false,mineWitnessInvalid:false,
    miningActionP95Ms:isVao?85:100,
    frameGapsRecorded:400,rollingFrameCount:400,
    rollingFrameP95Ms:isVao?18:22,
    rollingSlowFrames:isVao?1:2,
    // These are hypothetical *mining-bound* frame windows; the candidate
    // renders more frames in the same 100 original voxel edit actions.
    mineFrameWindow:{phase:'complete',savedMines:100,
      frameGapsRecorded:isVao?430:400,frameP95Ms:isVao?18:22,
      slowFrames:isVao?1:2,elapsedMs:isVao?7000:9000,
      successfulGuardedUploads:224,successfulGuardedUploadP95Ms:isVao?22:28,
      maxUploadSamples:4096,uploadOverflow:false,uploadFaults:0,
      maxFrameSamples:16384,overflow:false,invalid:false,interrupted:false,
      editPending:false,invalidReason:null},
    successfulGuardedUploads:224,rollingSuccessfulUploadP95Ms:isVao?22:28,
    fatal:false,graphicsLost:false,pageSuspended:false,
    continuousForegroundRun:true,interruptionCount:0,
    readOnly:true,releaseCertified:false,nativeGpuRollbackProven:false,
    browserPixelParityProven:false,
    nearStatus:isVao?{phase:'ready',cache:{vaoSupported:true}}:null
  };
}
const make=()=>({expectedViewports:viewports.map(v=>[...v]),
  pairs:viewports.map(v=>({control:sample(v),candidate:sample(v,'experimental-vao')}))});
const verify=(mutate,pattern)=>{
  const a=make();mutate(a);const r=evaluateIssue291FourViewportAB(a);
  assert.equal(r.metricGatesPassed,false);
  assert.equal(r.releaseCertified,false);
  assert.ok(r.failures.some(f=>pattern.test(f)),r.failures.join('; '));
};
test('four exact real-game numeric gates pass; never release certified',()=>{
  const r=evaluateIssue291FourViewportAB(make());
  assert.equal(r.metricGatesPassed,true);
  assert.equal(r.releaseCertified,false);
  assert.deepEqual(r.failures,[]);
  assert.equal(r.comparisons.length,4);
  assert.equal(r.comparisons[0].actionImprovementPct,15);
  assert.equal(r.comparisons[0].frameImprovementPct,18.18);
  assert.ok(r.externalProofsStillRequired.length>=5);
  assert.equal(Object.isFrozen(r),true);
});
test('missing and duplicate viewports fail closed',()=>{
  verify(x=>x.expectedViewports.pop(),/Four distinct/);
  verify(x=>x.expectedViewports[3]=[...x.expectedViewports[0]],/Four distinct/);
});
test('empty and incomplete runs fail',()=>{
  verify(x=>x.pairs.pop(),/Exactly four/);
  verify(x=>x.pairs[2]={control:null,candidate:null},/Both source-original/);
});
test('renderer identity and protocol are verified',()=>{
  verify(x=>x.pairs[1].candidate.mode='original-control',/renderer identity/);
  verify(x=>x.pairs[1].control.protocol='unknown',/protocol/);
});
test('VAO cache must genuinely support VAOs, not the fallback renderer',()=>{
  verify(x=>x.pairs[0].candidate.nearStatus.cache.vaoSupported=false,/active WebGL2 VAO/);
  verify(x=>x.pairs[0].candidate.nearStatus.phase='blocked',/active WebGL2 VAO/);
  verify(x=>x.pairs[0].control.nearStatus={phase:'ready'},/Original-control/);
});
test('all four CSS and backing pixel viewports must match',()=>{
  verify(x=>x.pairs[1].candidate.viewportCss=[700,400],/CSS viewport/);
  verify(x=>x.pairs[1].candidate.viewportPixels=[800,400],/physical rendering viewport/);
  verify(x=>x.pairs[1].candidate.viewportPixels=[0,0],/physical buffer viewport/);
});
test('only equal seed and genuine edit count runs compare',()=>{
  verify(x=>x.pairs[1].candidate.seed=4021,/seed differs/);
  verify(x=>x.pairs[2].control.seed=4021,/seed differs/);
  verify(x=>x.pairs[2].candidate.trueSavedDeepMines=99,/exactly 100 saved deep MINE actions/);
  verify(x=>x.pairs[2].candidate.trueSavedDeepMines=111,
    /exactly 100 saved deep MINE actions/);
});
test('only complete 100-edit mining frame windows count, not idle RAF diagnostics',()=>{
  verify(x=>x.pairs[1].candidate.mineFrameWindow.frameGapsRecorded=99,
    /real mining-frame trial/);
  verify(x=>x.pairs[1].candidate.mineFrameWindow.maxFrameSamples=0,
    /real mining-frame trial/);
  const value=make();
  value.pairs[1].candidate.frameGapsRecorded=2;
  value.pairs[1].candidate.rollingFrameP95Ms=240;
  const outcome=evaluateIssue291FourViewportAB(value);
  assert.equal(outcome.metricGatesPassed,true);
  assert.equal(outcome.releaseCertified,false);
});
test('no slow-frame regression in 100 authentic edits, and valid frame counters',()=>{
  verify(x=>x.pairs[3].candidate.mineFrameWindow.slowFrames=3,/slow-frame regression/);
  verify(x=>x.pairs[3].candidate.mineFrameWindow.slowFrames=500,
    /real mining-frame trial/);
});
test('10 percent action improvement AND 10 percent frame improvement required each',()=>{
  verify(x=>x.pairs[2].candidate.miningActionP95Ms=91,/action p95/);
  verify(x=>x.pairs[2].candidate.mineFrameWindow.frameP95Ms=21,/frame p95/);
  verify(x=>x.pairs[2].control.miningActionP95Ms=0,/finite positive original saved-MINE action/);
});
test('guarded upload p95 bound applies to both runs at every viewport',()=>{
  verify(x=>x.pairs[2].candidate.mineFrameWindow.successfulGuardedUploadP95Ms=33.1,
    /mining-bound guarded upload p95/);
  verify(x=>x.pairs[2].control.mineFrameWindow.successfulGuardedUploadP95Ms=33.1,
    /mining-bound guarded upload p95/);
  verify(x=>x.pairs[2].control.mineFrameWindow.successfulGuardedUploads=0,
    /complete fault-free mining-bound guarded GPU uploads/);
});
test('fatal graphics, hidden page, and lost context must not count',()=>{
  verify(x=>x.pairs[0].candidate.fatal=true,/fatal\/suspended/);
  verify(x=>x.pairs[0].control.graphicsLost=true,/fatal\/suspended/);
  verify(x=>x.pairs[0].candidate.pageSuspended=true,/fatal\/suspended/);
});
test('never trust snapshots that claim release/rollback/pixel certification',()=>{
  verify(x=>x.pairs[2].control.releaseCertified=true,/must not claim/);
  verify(x=>x.pairs[2].candidate.nativeGpuRollbackProven=true,/must not claim/);
  verify(x=>x.pairs[2].candidate.browserPixelParityProven=true,/must not claim/);
});
test('required public thresholds are explicit and stable',()=>{
  assert.equal(ISSUE291_MIN_DEEP_MINES,100);
  assert.equal(ISSUE291_REQUIRED_IMPROVEMENT,.10);
  assert.equal(ISSUE291_MAX_UPLOAD_P95_MS,33);
});
test('missing/fabricated input cannot trigger metric pass or full release',()=>{
  for(const input of [null,undefined,{},'fake',[],{expectedViewports:[],pairs:[]}]){
    const r=evaluateIssue291FourViewportAB(input??{});
    assert.equal(r.metricGatesPassed,false);
    assert.equal(r.releaseCertified,false);
  }
});

test('equal mine count but different original block coordinates fails closed',()=>{
  verify(x=>x.pairs[1].candidate.mineWitness[29][0]=999,
    /saved deep-MINE cell\/previous-ID order differs/);
});
test('same mine cells but different previous block material fails closed',()=>{
  verify(x=>x.pairs[0].candidate.mineWitness[17][3]=8,
    /saved deep-MINE cell\/previous-ID order differs/);
});
test('same blocks but different original mining order fails closed',()=>{
  verify(x=>{
    const a=x.pairs[2].candidate.mineWitness;
    [a[0],a[99]]=[a[99],a[0]];
  },/saved deep-MINE cell\/previous-ID order differs/);
});
test('missing or incomplete original source mine trace cannot pass by count alone',()=>{
  verify(x=>delete x.pairs[2].candidate.mineWitness,/complete unique ordered/);
  verify(x=>x.pairs[2].candidate.mineWitness.pop(),/complete unique ordered/);
  verify(x=>x.pairs[2].candidate.mineWitnessOverflow=true,/complete unique ordered/);
  verify(x=>x.pairs[2].candidate.mineWitnessInvalid=true,/complete unique ordered/);
});
test('duplicate saved mine cells are not accepted as 100 distinct deep edits',()=>{
  verify(x=>x.pairs[3].control.mineWitness[99]=[...x.pairs[3].control.mineWitness[0]],
    /complete unique ordered/);
});
test('invalid deep cell coordinates, previous IDs and non-AIR next reject evidence',()=>{
  verify(x=>x.pairs[1].control.mineWitness[2][1]=0,/complete unique ordered/);
  verify(x=>x.pairs[1].control.mineWitness[2][0]=NaN,/complete unique ordered/);
  verify(x=>x.pairs[1].control.mineWitness[2][3]=0,/complete unique ordered/);
  verify(x=>x.pairs[1].control.mineWitness[2][4]=3,/complete unique ordered/);
});
test('more than 128 saved deep edits require new run, not a truncated witness',()=>{
  verify(x=>{
    for(const run of [x.pairs[0].control,x.pairs[0].candidate]){
      run.trueSavedDeepMines=129;
      run.mineWitnessOverflow=true;
    }
  },/complete unique ordered/);
});
test('positive hypothetical fixture reports 100 exact witnesses but no certification',()=>{
  const r=evaluateIssue291FourViewportAB(make());
  assert.equal(r.metricGatesPassed,true);
  assert.equal(r.releaseCertified,false);
  for(const row of r.comparisons)assert.equal(row.witnessedMineActions,100);
});

test('recovered WebGL context cannot erase original run interruption history',()=>{
  verify(x=>{
    const run=x.pairs[1].candidate;
    run.graphicsLost=false;run.pageSuspended=false;run.fatal=false;
    run.interruptionCount=1;
    run.continuousForegroundRun=false;
  },/hidden, suspended or context-lost/);
});
test('missing or forged continuous foreground proof fails closed',()=>{
  verify(x=>delete x.pairs[1].candidate.interruptionCount,/hidden, suspended or context-lost/);
  verify(x=>x.pairs[1].control.interruptionCount=-1,/hidden, suspended or context-lost/);
  verify(x=>x.pairs[3].candidate.continuousForegroundRun=false,/hidden, suspended or context-lost/);
  verify(x=>x.pairs[2].candidate.interruptionCount=1,/hidden, suspended or context-lost/);
});

test('a genuine faster VAO with DIFFERENT frame counts must not be rejected',()=>{
  const data=make();
  const pair=data.pairs[0];
  pair.control.mineFrameWindow.frameGapsRecorded=340;
  pair.candidate.mineFrameWindow.frameGapsRecorded=480;
  pair.control.mineFrameWindow.slowFrames=2;
  pair.candidate.mineFrameWindow.slowFrames=1;
  const result=evaluateIssue291FourViewportAB(data);
  assert.equal(result.metricGatesPassed,true);
  assert.equal(result.releaseCertified,false);
  assert.equal(result.comparisons[0].controlTrialFrames,340);
  assert.equal(result.comparisons[0].candidateTrialFrames,480);
});
test('idle smooth frames cannot manufacture a 10 percent mining-frame improvement',()=>{
  verify(x=>{
    x.pairs[0].candidate.rollingFrameP95Ms=5;
    x.pairs[0].candidate.mineFrameWindow.frameP95Ms=21;
  },/frame p95/);
});
test('pre-mine jank in diagnostic history does not invalidate bounded mining window',()=>{
  const d=make();
  d.pairs[1].control.rollingFrameP95Ms=900;
  d.pairs[1].candidate.rollingFrameP95Ms=1000;
  assert.equal(evaluateIssue291FourViewportAB(d).metricGatesPassed,true);
});
test('incomplete, unclosed or overflowed 100-mine windows fail closed',()=>{
  verify(x=>delete x.pairs[0].candidate.mineFrameWindow,/real mining-frame trial/);
  verify(x=>x.pairs[0].candidate.mineFrameWindow.phase='active',/real mining-frame trial/);
  verify(x=>x.pairs[0].candidate.mineFrameWindow.savedMines=99,/real mining-frame trial/);
  verify(x=>x.pairs[0].candidate.mineFrameWindow.overflow=true,/real mining-frame trial/);
  verify(x=>x.pairs[0].candidate.mineFrameWindow.invalid=true,/real mining-frame trial/);
  verify(x=>x.pairs[0].candidate.mineFrameWindow.interrupted=true,/real mining-frame trial/);
  verify(x=>x.pairs[0].candidate.mineFrameWindow.elapsedMs=0,/real mining-frame trial/);
  verify(x=>x.pairs[0].candidate.mineFrameWindow.frameP95Ms=NaN,/real mining-frame trial/);
});
test('frame counts may differ; missed-frame count still cannot increase for 100 edits',()=>{
  verify(x=>{
    x.pairs[0].candidate.mineFrameWindow.frameGapsRecorded=540;
    x.pairs[0].candidate.mineFrameWindow.slowFrames=3;
  },/slow-frame regression/);
});

test('both post-save RAF gaps are required before numerical acceptance',()=>{
  verify(x=>{
    x.pairs[0].candidate.mineFrameWindow.frameGapsRecorded=100;
  },/real mining-frame trial/);
  const data=make();
  data.pairs[0].candidate.mineFrameWindow.frameGapsRecorded=101;
  const result=evaluateIssue291FourViewportAB(data);
  assert.equal(result.metricGatesPassed,true);
  assert.equal(result.releaseCertified,false);
});

test('bad idle GPU history cannot replace real mining-bound guarded upload p95',()=>{
  const x=make();
  x.pairs[0].control.rollingSuccessfulUploadP95Ms=2000;
  x.pairs[0].candidate.rollingSuccessfulUploadP95Ms=0.5;
  assert.equal(evaluateIssue291FourViewportAB(x).metricGatesPassed,true);
  verify(d=>{
    d.pairs[0].candidate.rollingSuccessfulUploadP95Ms=0.1;
    d.pairs[0].candidate.mineFrameWindow.successfulGuardedUploadP95Ms=35;
  },/mining-bound guarded upload p95/);
});
test('one genuine original source GPU failure poisons trial even with good successful p95',()=>{
  verify(x=>x.pairs[0].candidate.mineFrameWindow.uploadFaults=1,
    /complete fault-free mining-bound guarded GPU uploads/);
  verify(x=>x.pairs[2].control.mineFrameWindow.uploadOverflow=true,
    /complete fault-free mining-bound guarded GPU uploads/);
});
test('missing, invalid and malformed mining-native upload window cannot pass',()=>{
  verify(x=>delete x.pairs[0].candidate.mineFrameWindow.successfulGuardedUploads,
    /complete fault-free mining-bound guarded GPU uploads/);
  verify(x=>x.pairs[0].candidate.mineFrameWindow.maxUploadSamples=0,
    /complete fault-free mining-bound guarded GPU uploads/);
  verify(x=>x.pairs[0].candidate.mineFrameWindow.successfulGuardedUploads=4097,
    /complete fault-free mining-bound guarded GPU uploads/);
  verify(x=>x.pairs[0].candidate.mineFrameWindow.uploadFaults=NaN,
    /complete fault-free mining-bound guarded GPU uploads/);
  verify(x=>x.pairs[0].candidate.mineFrameWindow.successfulGuardedUploadP95Ms=NaN,
    /mining-bound guarded upload p95/);
});
test('strict v4 source protocol rejects stale v2 mined frame snapshots',()=>{
  verify(x=>x.pairs[1].control.protocol='291-local-4viewport-v2',/protocol/);
});
test('numeric summary uses trial uploads, never unrelated rolling upload counters',()=>{
  const x=make();
  x.pairs[1].control.rollingSuccessfulUploadP95Ms=900;
  x.pairs[1].candidate.rollingSuccessfulUploadP95Ms=1;
  const r=evaluateIssue291FourViewportAB(x);
  assert.equal(r.metricGatesPassed,true);
  assert.equal(r.releaseCertified,false);
  assert.equal(r.comparisons[1].controlUploadP95Ms,28);
  assert.equal(r.comparisons[1].candidateUploadP95Ms,22);
  assert.equal(r.comparisons[1].controlTrialUploads,224);
  assert.equal(r.comparisons[1].candidateTrialUploads,224);
});

test('full precision 33.04ms upload rejects rounded-looking 33ms native trial',()=>{
  verify(x=>{
    x.pairs[1].candidate.mineFrameWindow.successfulGuardedUploadP95Ms=33.04;
    x.pairs[1].candidate.rollingSuccessfulUploadP95Ms=1;
  },/mining-bound guarded upload p95/);
});
test('99.999 percent of strict ten-percent original action gain cannot be certified',()=>{
  verify(x=>{
    x.pairs[0].control.miningActionP95Ms=100;
    x.pairs[0].candidate.miningActionP95Ms=90.00005;
  },/action p95/);
});
test('near-ten-percent source frame p95 change cannot round into acceptance',()=>{
  verify(x=>{
    x.pairs[1].control.mineFrameWindow.frameP95Ms=22;
    x.pairs[1].candidate.mineFrameWindow.frameP95Ms=19.80005;
  },/frame p95/);
});
test('full precision legal boundary upload value of exactly 33ms is admissible',()=>{
  const x=make();
  x.pairs[2].control.mineFrameWindow.successfulGuardedUploadP95Ms=33;
  x.pairs[2].candidate.mineFrameWindow.successfulGuardedUploadP95Ms=33;
  const r=evaluateIssue291FourViewportAB(x);
  assert.equal(r.metricGatesPassed,true);
  assert.equal(r.releaseCertified,false);
});

test('strict v4 protocol rejects stale v3 source snapshots',()=>{
  verify(x=>x.pairs[0].candidate.protocol='291-local-4viewport-v3',/protocol/);
});
test('an original edit that never became a saved deep MINE blocks certification',()=>{
  verify(x=>x.pairs[0].control.mineFrameWindow.editPending=true,
    /real mining-frame trial/);
  verify(x=>delete x.pairs[2].candidate.mineFrameWindow.editPending,
    /real mining-frame trial/);
});
test('brief settings, blur or flight interruptions cannot be hidden by good final p95',()=>{
  verify(x=>x.pairs[1].candidate.mineFrameWindow.invalidReason='settings-opened',
    /real mining-frame trial/);
  verify(x=>x.pairs[1].candidate.mineFrameWindow.invalidReason='window-blur',
    /real mining-frame trial/);
  verify(x=>x.pairs[1].candidate.mineFrameWindow.invalidReason='creative-flight',
    /real mining-frame trial/);
});
test('an interrupted originally recorded edit never changes the release HOLD',()=>{
  const input=make();
  input.pairs[2].control.mineFrameWindow.invalidReason='unsaved-or-nondeep-edit';
  input.pairs[2].control.mineFrameWindow.editPending=false;
  const result=evaluateIssue291FourViewportAB(input);
  assert.equal(result.metricGatesPassed,false);
  assert.equal(result.releaseCertified,false);
  assert.ok(result.failures.some(x=>/real mining-frame trial/.test(x)));
});
