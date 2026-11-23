import test from 'node:test';
import assert from 'node:assert/strict';
import {evaluateIssue291FourViewportAB,ISSUE291_MIN_DEEP_MINES,
  ISSUE291_REQUIRED_IMPROVEMENT,ISSUE291_MAX_UPLOAD_P95_MS
} from './four-viewport-gate.mjs';
const viewports=[[956,440],[932,430],[844,390],[916,412]];
function sample(viewport,mode='original-control'){
  const isVao=mode==='experimental-vao';
  return {
    protocol:'291-local-4viewport-v1',mode,viewportCss:[...viewport],
    viewportPixels:[...viewport],seed:2026,playerFeet:-38,
    trueSavedDeepMines:100,miningActionP95Ms:isVao?85:100,
    frameGapsRecorded:400,rollingFrameCount:400,
    rollingFrameP95Ms:isVao?18:22,
    rollingSlowFrames:isVao?1:2,
    successfulGuardedUploads:224,rollingSuccessfulUploadP95Ms:isVao?22:28,
    fatal:false,graphicsLost:false,pageSuspended:false,
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
  verify(x=>x.pairs[2].candidate.trueSavedDeepMines=99,/fewer than 100/);
  verify(x=>x.pairs[2].candidate.trueSavedDeepMines=111,/counts are unequal/);
});
test('frame window count and parity are required',()=>{
  verify(x=>x.pairs[1].candidate.frameGapsRecorded=99,/real foreground frame window/);
  verify(x=>x.pairs[1].candidate.frameGapsRecorded=399,/observation counts are unequal/);
  verify(x=>x.pairs[1].candidate.rollingFrameCount=0,/real foreground frame window/);
});
test('no slow-frame regression or invalid slow-frame counts',()=>{
  verify(x=>x.pairs[3].candidate.rollingSlowFrames=3,/slow-frame regression/);
  verify(x=>x.pairs[3].candidate.rollingSlowFrames=401,/inconsistent slow-frame/);
});
test('10 percent action improvement AND 10 percent frame improvement required each',()=>{
  verify(x=>x.pairs[2].candidate.miningActionP95Ms=91,/action p95/);
  verify(x=>x.pairs[2].candidate.rollingFrameP95Ms=21,/frame p95/);
  verify(x=>x.pairs[2].control.miningActionP95Ms=0,/finite positive action/);
});
test('guarded upload p95 bound applies to both runs at every viewport',()=>{
  verify(x=>x.pairs[2].candidate.rollingSuccessfulUploadP95Ms=33.1,/guarded upload p95/);
  verify(x=>x.pairs[2].control.rollingSuccessfulUploadP95Ms=33.1,/guarded upload p95/);
  verify(x=>x.pairs[2].control.successfulGuardedUploads=0,/no successful/);
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
