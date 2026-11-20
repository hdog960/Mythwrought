import test from 'node:test';
import assert from 'node:assert/strict';
import {assessDigPerformance,DIG_VIEWPORTS} from './rapid-dig-performance-gate.mjs';
function fixtures(){
  const baseline=DIG_VIEWPORTS.map(viewport=>({label:'baseline',viewport,count:100,
    profile:'legacy',finalFeet:-177.99,maxResident:27,framesOver33:50,
    action:{p95:100},frame:{p95:100}}));
  const candidate=DIG_VIEWPORTS.map(viewport=>({label:'candidate',viewport,count:100,
    profile:'legacy',finalFeet:-177.99,maxResident:27,framesOver33:20,
    action:{p95:80},frame:{p95:80},mesh:{p95:0.3},upload:{p95:20},
    save:{p95:0.5},allCandidateSavesVerified:true,totalReusedGpuBuffers:14}));
  return {baseline,candidate};
}
test('real metrics with four 100-edit improved viewports satisfy relative gate',()=>{
  const {baseline,candidate}=fixtures();
  const result=assessDigPerformance(baseline,candidate);
  assert.equal(result.passed,true,JSON.stringify(result.errors));
  assert.equal(result.rows.length,4);
  assert.equal(result.gate,'chromium-relative-not-physical-iphone');
});
for(const [title,alter,expected] of [
  ['action p95 regressions',r=>r.action.p95=102,'Action p95'],
  ['frame p95 regressions',r=>r.frame.p95=102,'Frame p95'],
  ['GPU upload stalls',r=>r.upload.p95=102,'GPU upload p95'],
  ['missing genuine save verification',r=>r.allCandidateSavesVerified=false,'save verification'],
  ['deep resident overflow',r=>r.maxResident=28,'resident budget'],
  ['missing hardware reuse instrumentation',r=>delete r.totalReusedGpuBuffers,'reuse evidence'],
  ['too many stutter intervals',r=>r.framesOver33=70,'frame intervals'],
  ['missing frame stats',r=>delete r.frame,'frame p95'],
  ['wrong deep position',r=>r.finalFeet=-70,'deep Y'],
]){
  test('fail closed on '+title,()=>{
    const {baseline,candidate}=fixtures();
    alter(candidate[3]);
    const result=assessDigPerformance(baseline,candidate);
    assert.equal(result.passed,false);
    assert.ok(result.errors.some(e=>e.includes(expected)),JSON.stringify(result.errors));
  });
}
test('disallow missing, duplicated and mismatched paired viewports',()=>{
  const {baseline,candidate}=fixtures();
  candidate[3]={...candidate[2]};
  const result=assessDigPerformance(baseline,candidate);
  assert.equal(result.passed,false);
  assert.ok(result.errors.some(e=>/duplicate|Missing/.test(e)));
});
test('disallow benchmark completion without candidate instrumentation',()=>{
  const {baseline,candidate}=fixtures();
  delete candidate[0].upload;
  assert.equal(assessDigPerformance(baseline,candidate).passed,false);
});
test('disallow baseline and candidate with nonidentical generation modes',()=>{
  const {baseline,candidate}=fixtures();
  candidate[0].profile='four-regions';
  const result=assessDigPerformance(baseline,candidate);
  assert.equal(result.passed,false);
  assert.ok(result.errors.some(e=>e.includes('profile differs')));
});
