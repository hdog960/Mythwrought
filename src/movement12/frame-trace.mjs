// Source-only frame-rate comparison of supplied movement trajectories; no production hookup.
import {auditBoundedTrace} from './trace-budget.mjs';
export const FRAME_TRACE_CONTRACT='movement12-frame-trace-v1';
const valid=p=>p&&['x','feet','z'].every(k=>Number.isFinite(p[k]));
export function compareFrameTraces({world,trajectories,collides,maxSegment=.1,maxSamples=4096,endpointTolerance=.02}={}){
 if(!Array.isArray(trajectories)||trajectories.length<2||trajectories.length>8)throw new RangeError('2..8 trajectories required');
 if(!(Number.isFinite(endpointTolerance)&&endpointTolerance>=0&&endpointTolerance<=.25))throw new RangeError('invalid endpoint tolerance');
 const results=trajectories.map((trace,index)=>{
  if(!trace||!Number.isFinite(trace.dt)||trace.dt<=0||trace.dt>1/15||!Array.isArray(trace.positions)||!trace.positions.every(valid))throw new TypeError('finite sampled trajectory and dt required');
  const audit=auditBoundedTrace({world,positions:trace.positions,collides,maxSegment,maxSamples});
  return {index,dt:trace.dt,audit,endpoint:trace.positions.at(-1)};
 });
 const reference=results[0].endpoint;
 const divergences=results.map(r=>Math.hypot(r.endpoint.x-reference.x,r.endpoint.feet-reference.feet,r.endpoint.z-reference.z));
 const safe=results.every(r=>r.audit.safe)&&divergences.every(d=>d<=endpointTolerance);
 return Object.freeze({safe,reason:results.some(r=>!r.audit.safe)?'collision-or-budget':safe?'consistent':'endpoint-divergence',divergences:Object.freeze(divergences),results:Object.freeze(results),live:false});
}
