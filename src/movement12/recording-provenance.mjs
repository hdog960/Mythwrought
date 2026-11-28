// Source-only, fail-closed acceptance of movement recording provenance.
export const MOVEMENT_PROVENANCE_V1='movement12-recording-provenance-v1';
const finite=n=>typeof n==='number'&&Number.isFinite(n);
export function auditRecordingProvenance({recordings,expectedSourceSha,expectedWorldSeed,expectedMode='survival',expectedScenario}={}){
 if(!Array.isArray(recordings)||recordings.length!==3||!['30','60','120'].every(h=>recordings.some(r=>r?.hz===Number(h))))throw new TypeError('three distinct cadence recordings required');
 if(typeof expectedSourceSha!=='string'||!/^[0-9a-f]{40}$/.test(expectedSourceSha)||typeof expectedWorldSeed!=='string'||!expectedWorldSeed||!['survival','creative'].includes(expectedMode)||typeof expectedScenario!=='string'||!expectedScenario)throw new TypeError('invalid provenance contract');
 const seen=new Set(),summaries=[];
 for(const run of recordings){
  const p=run?.provenance;
  if(!p||seen.has(run.hz)||p.contract!==MOVEMENT_PROVENANCE_V1||p.sourceSha!==expectedSourceSha||p.worldSeed!==expectedWorldSeed||p.mode!==expectedMode||p.scenario!==expectedScenario||p.synthetic!==false||p.productionEnabled!==false)throw new TypeError('missing, duplicated or mismatched source evidence');
  if(!finite(run.duration)||run.duration<=0||!Number.isSafeInteger(run.hz)||!Number.isSafeInteger(p.frameCount)||p.frameCount!==Math.round(run.duration*run.hz)||!Array.isArray(run.samples)||run.samples.length!==p.frameCount+1)throw new RangeError('incomplete cadence evidence');
  if(!Array.isArray(run.events)||run.events.length!==p.frameCount||run.samples.some((s,i)=>!finite(s?.time)||Math.abs(s.time-i/run.hz)>1e-7||!s.position||!['x','feet','z'].every(k=>finite(s.position[k]))))throw new TypeError('invalid recorded physics evidence');
  seen.add(run.hz);summaries.push(Object.freeze({hz:run.hz,frames:p.frameCount}));
 }
 if(new Set(recordings.map(r=>r.duration)).size!==1)throw new RangeError('duration mismatch');
 return Object.freeze({accepted:true,live:false,sourceSha:expectedSourceSha,worldSeed:expectedWorldSeed,scenario:expectedScenario,cadences:Object.freeze(summaries)});
}
