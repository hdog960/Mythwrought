// Opt-in, source-only timing gate. Does not approve physical movement.
export function auditReplayTiming({frames, maxFrames=256, maxGapSeconds=0.1, maxSpeed=20}={}) {
 const fail=(index,reason)=>({ok:false,index,reason});
 if(!Array.isArray(frames)||frames.length===0||!Number.isInteger(maxFrames)||maxFrames<1||maxFrames>1024||frames.length>maxFrames||!Number.isFinite(maxGapSeconds)||maxGapSeconds<=0||!Number.isFinite(maxSpeed)||maxSpeed<=0)return fail(0,'invalid-contract');
 for(let i=0;i<frames.length;i++){
  const f=frames[i];
  if(!f||!Number.isFinite(f.time)||!f.start||!f.end||['x','y','z'].some(k=>!Number.isFinite(f.start[k])||!Number.isFinite(f.end[k])))return fail(i,'invalid-frame');
  if(i===0){
   if(Math.hypot(...['x','y','z'].map(k=>f.end[k]-f.start[k]))>1e-8)return fail(i,'unbounded-first-frame');
   continue;
  }
  const prev=frames[i-1],dt=f.time-prev.time;
  if(!Number.isFinite(dt)||dt<=0||dt>maxGapSeconds)return fail(i,'invalid-cadence');
  if(['x','y','z'].some(k=>Math.abs(f.start[k]-prev.end[k])>1e-8))return fail(i,'discontinuous');
  const distance=Math.hypot(...['x','y','z'].map(k=>f.end[k]-f.start[k]));
  if(distance/dt>maxSpeed+1e-9)return fail(i,'speed-budget');
 }
 return {ok:true,framesAudited:frames.length};
}
