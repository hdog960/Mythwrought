// Fail-closed, same-run performance acceptance. Benchmark completion is NOT
// proof of a lag fix; the prior candidate passed CI while its frame p95 regressed.
// Software Chromium/SwiftShader is a repeatable relative gate, not iPhone
// certification. Physical iPhone measurements retain their separate release gate.
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';

export const DIG_VIEWPORTS=['667x375','844x390','932x430','956x440'];
export const MIN_RELATIVE_P95_GAIN=0.10;
export const MAX_CANDIDATE_UPLOAD_P95_MS=33;

export function assessDigPerformance(baseline,candidate){
  const errors=[],rows=[];
  const byViewport=(items,label)=>{
    if(!Array.isArray(items)||items.length!==DIG_VIEWPORTS.length){
      errors.push(label+' must contain exactly four landscape records');
      return new Map();
    }
    const m=new Map();
    for(const item of items){
      if(!DIG_VIEWPORTS.includes(item?.viewport)||m.has(item.viewport)){
        errors.push(label+' has a duplicate or unknown viewport');
        continue;
      }
      m.set(item.viewport,item);
      if(item.label!==label)errors.push(label+' has an invalid label '+item.viewport);
      if(item.count!==100)errors.push(label+' lacks 100 real edits at '+item.viewport);
      if(!Number.isFinite(item.finalFeet)||item.finalFeet>=-175)
        errors.push(label+' did not reach actual deep Y at '+item.viewport);
      if(!Number.isInteger(item.maxResident)||item.maxResident>27||item.maxResident<1)
        errors.push(label+' violated the deep GPU resident budget at '+item.viewport);
      for(const metric of ['action','frame'])
        if(!Number.isFinite(item[metric]?.p95)||item[metric].p95<=0)
          errors.push(label+' lacks valid '+metric+' p95 at '+item.viewport);
      if(!Number.isInteger(item.framesOver33)||item.framesOver33<0||
         item.framesOver33>100)
        errors.push(label+' lacks valid missed-frame count at '+item.viewport);
    }
    return m;
  };
  const b=byViewport(baseline,'baseline'),c=byViewport(candidate,'candidate');
  for(const vp of DIG_VIEWPORTS){
    const before=b.get(vp),after=c.get(vp);
    if(!before||!after){errors.push('Missing same-run paired viewport '+vp);continue;}
    if(before.profile!==after.profile)
      errors.push('World generation profile differs between paired runs at '+vp);
    if(after.allCandidateSavesVerified!==true)
      errors.push('Candidate save verification missing at '+vp);
    for(const name of ['mesh','upload','save'])
      if(!Number.isFinite(after[name]?.p95)||after[name].p95<0)
        errors.push('Candidate '+name+' p95 instrumentation missing at '+vp);
    if(!Number.isInteger(after.totalReusedGpuBuffers)||after.totalReusedGpuBuffers<0)
      errors.push('GPU reuse evidence absent at '+vp);
    const actionBefore=before.action?.p95,actionAfter=after.action?.p95;
    const frameBefore=before.frame?.p95,frameAfter=after.frame?.p95;
    if(Number.isFinite(actionBefore)&&Number.isFinite(actionAfter)&&
       !(actionAfter<=actionBefore*(1-MIN_RELATIVE_P95_GAIN)))
      errors.push('Action p95 did not improve by 10% at '+vp+': '+actionBefore+' → '+actionAfter);
    if(Number.isFinite(frameBefore)&&Number.isFinite(frameAfter)&&
       !(frameAfter<=frameBefore*(1-MIN_RELATIVE_P95_GAIN)))
      errors.push('Frame p95 did not improve by 10% at '+vp+': '+frameBefore+' → '+frameAfter);
    if(Number.isFinite(after.upload?.p95)&&after.upload.p95>MAX_CANDIDATE_UPLOAD_P95_MS)
      errors.push('Candidate GPU upload p95 exceeds 33 ms at '+vp+': '+after.upload.p95);
    if(Number.isFinite(before.framesOver33)&&Number.isFinite(after.framesOver33)&&
       after.framesOver33>before.framesOver33)
      errors.push('More >33ms frame intervals than baseline at '+vp);
    rows.push({viewport:vp,baselineActionP95:actionBefore,candidateActionP95:actionAfter,
      baselineFrameP95:frameBefore,candidateFrameP95:frameAfter,
      candidateUploadP95:after.upload?.p95??null,
      baselineOver33:before.framesOver33,candidateOver33:after.framesOver33,
      GPUReuse:after.totalReusedGpuBuffers});
  }
  return {passed:errors.length===0,gate:'chromium-relative-not-physical-iphone',
    thresholds:{requiredP95Gain:MIN_RELATIVE_P95_GAIN,
      maxUploadP95Ms:MAX_CANDIDATE_UPLOAD_P95_MS},
    rows,errors};
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  const baseline=JSON.parse(readFileSync('artifacts/rapid-dig-baseline-metrics.json','utf8'));
  const candidate=JSON.parse(readFileSync('artifacts/rapid-dig-candidate-metrics.json','utf8'));
  const report=assessDigPerformance(baseline,candidate);
  writeFileSync('artifacts/rapid-dig-performance-gate.json',JSON.stringify(report,null,2)+'\n');
  console.log('RAPID_DIG_PERFORMANCE_GATE',JSON.stringify(report));
  if(!report.passed){
    console.error('FAIL: Chromium relative performance gate (NOT physical iPhone certification)');
    process.exitCode=1;
  }else{
    console.log('PASS: Chromium relative improvement and upload budget; physical iPhone gate remains separate');
  }
}
