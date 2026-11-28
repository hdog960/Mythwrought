// Source-only deterministic trajectory time-alignment gate. Never installs into production.
import {auditBoundedTrace} from './trace-budget.mjs';
export const TIME_ALIGNMENT_CONTRACT='movement12-time-alignment-v1';
const finitePoint=p=>p&&['x','feet','z'].every(k=>Number.isFinite(p[k]));
function interpolate(samples,t){
 if(t<=samples[0].time)return samples[0].position;
 for(let i=1;i<samples.length;i++){
  const a=samples[i-1],b=samples[i];
  if(t<=b.time){
   const u=(t-a.time)/(b.time-a.time);
   return {x:a.position.x+(b.position.x-a.position.x)*u,feet:a.position.feet+(b.position.feet-a.position.feet)*u,z:a.position.z+(b.position.z-a.position.z)*u};
  }
 }
 return samples.at(-1).position;
}
export function auditTimeAlignedMovement({world,runs,collides,checkpointCount=32,maxSegment=.1,maxSamples=4096,tolerance=.04}={}){
 if(!Array.isArray(runs)||runs.length<2||runs.length>6)throw new RangeError('2..6 runs required');
 if(!Number.isSafeInteger(checkpointCount)||checkpointCount<2||checkpointCount>128)throw new RangeError('invalid checkpoint count');
 if(!Number.isFinite(tolerance)||tolerance<0||tolerance>.5)throw new RangeError('invalid tolerance');
 const durations=[];
 for(const run of runs){
  if(!Array.isArray(run)||run.length<2||run.length>4097)throw new TypeError('bounded samples required');
  for(let i=0;i<run.length;i++){
   const s=run[i];
   if(!s||!Number.isFinite(s.time)||s.time<0||!finitePoint(s.position)||i>0&&s.time<=run[i-1].time)throw new TypeError('strictly increasing finite samples required');
  }
  if(run[0].time!==0)throw new RangeError('run must start at t=0');
  durations.push(run.at(-1).time);
 }
 const duration=durations[0];
 if(!(duration>0&&duration<=120)||durations.some(d=>Math.abs(d-duration)>1e-8))throw new RangeError('runs must share duration');
 const traces=runs.map(run=>Array.from({length:checkpointCount+1},(_,i)=>interpolate(run,duration*i/checkpointCount)));
 const audits=traces.map(positions=>auditBoundedTrace({world,positions,collides,maxSegment,maxSamples}));
 let worst=0,at=0;
 for(let i=0;i<=checkpointCount;i++)for(let j=1;j<traces.length;j++){
  const a=traces[0][i],b=traces[j][i],d=Math.hypot(a.x-b.x,a.feet-b.feet,a.z-b.z);
  if(d>worst){worst=d;at=i;}
 }
 const collisionFree=audits.every(a=>a.safe);
 return Object.freeze({safe:collisionFree&&worst<=tolerance,reason:!collisionFree?'collision-or-budget':worst>tolerance?'trajectory-divergence':'consistent',worstDivergence:worst,atTime:duration*at/checkpointCount,collisionAudits:Object.freeze(audits),live:false});
}
