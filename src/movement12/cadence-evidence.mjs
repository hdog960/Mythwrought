// Opt-in cadence evidence gate. Does not install or alter production movement.
import {recordRealStepTrace} from './real-step-trace.mjs';
export const CADENCE_EVIDENCE_CONTRACT='movement12-cadence-evidence-v1';
const finite=n=>typeof n==='number'&&Number.isFinite(n);
export function auditCadenceEvidence({recordings,positionTolerance=.08,velocityTolerance=2,requiredHz=[30,60,120]}={}){
 if(!Array.isArray(recordings)||recordings.length!==requiredHz.length||!Number.isFinite(positionTolerance)||positionTolerance<0||!Number.isFinite(velocityTolerance)||velocityTolerance<0)throw new TypeError('invalid cadence contract');
 const byHz=new Map();
 for(const run of recordings){
  if(!run||!Number.isSafeInteger(run.hz)||byHz.has(run.hz)||!Array.isArray(run.samples)||run.samples.length<2||!Array.isArray(run.events)||run.events.length!==run.samples.length-1)throw new TypeError('invalid or duplicate recording');
  if(run.samples.length!==Math.round(run.duration*run.hz)+1)throw new RangeError('incomplete frame evidence');
  for(let i=0;i<run.samples.length;i++){
   const s=run.samples[i],p=s?.position;
   if(!finite(s?.time)||!p||!['x','feet','z'].every(k=>finite(p[k]))||Math.abs(s.time-i/run.hz)>1e-7)throw new TypeError('invalid frame timestamp or position');
  }
  byHz.set(run.hz,run);
 }
 if(requiredHz.some(hz=>!byHz.has(hz))||new Set(requiredHz).size!==requiredHz.length)throw new RangeError('missing required cadence');
 const runs=requiredHz.map(hz=>byHz.get(hz)),duration=runs[0].duration;
 if(!finite(duration)||duration<=0||runs.some(r=>Math.abs(r.duration-duration)>1e-8))throw new RangeError('mismatched durations');
 const interpolate=(samples,t)=>{
  const hz=1/(samples[1].time-samples[0].time),at=Math.min(samples.length-1,t*hz),i=Math.floor(at),j=Math.min(i+1,samples.length-1),u=at-i,a=samples[i].position,b=samples[j].position;
  return {x:a.x+(b.x-a.x)*u,feet:a.feet+(b.feet-a.feet)*u,z:a.z+(b.z-a.z)*u};
 };
 let worstPosition=0,worstVelocity=0,atTime=0;
 const checkpoints=Math.min(240,Math.max(...requiredHz)*duration);
 for(let k=0;k<=checkpoints;k++){
  const t=duration*k/checkpoints,points=runs.map(r=>interpolate(r.samples,t));
  for(let j=1;j<points.length;j++){
   const d=Math.hypot(points[j].x-points[0].x,points[j].feet-points[0].feet,points[j].z-points[0].z);
   if(d>worstPosition){worstPosition=d;atTime=t;}
  }
  if(k===0)continue;
  const prevT=duration*(k-1)/checkpoints,prev=runs.map(r=>interpolate(r.samples,prevT)),dt=t-prevT;
  for(let j=1;j<points.length;j++){
   const vx=(points[j].x-prev[j].x-points[0].x+prev[0].x)/dt,vy=(points[j].feet-prev[j].feet-points[0].feet+prev[0].feet)/dt,vz=(points[j].z-prev[j].z-points[0].z+prev[0].z)/dt;
   worstVelocity=Math.max(worstVelocity,Math.hypot(vx,vy,vz));
  }
 }
 return Object.freeze({safe:worstPosition<=positionTolerance&&worstVelocity<=velocityTolerance,worstPosition,worstVelocity,atTime,requiredHz:Object.freeze([...requiredHz]),live:false});
}
export function captureCadenceEvidence({world,initial,inputAt,duration=2}={}){
 return [30,60,120].map(hz=>recordRealStepTrace({world,initial,inputAt,hz,duration}));
}
