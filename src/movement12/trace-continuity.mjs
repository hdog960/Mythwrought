// Source-only, fail-closed movement trace continuity gate. No production hooks.
export function auditTraceContinuity(record,{maxHorizontalSpeed=20,maxVerticalSpeed=40,maxGapSeconds=0.1}={}){
 const fail=(reason,index=-1)=>({safe:false,reason,index});
 if(!record||!Array.isArray(record.samples)||record.samples.length<2)return fail('missing-samples');
 if(![maxHorizontalSpeed,maxVerticalSpeed,maxGapSeconds].every(v=>Number.isFinite(v)&&v>0))return fail('invalid-limits');
 let previous=null;
 for(let i=0;i<record.samples.length;i++){
  const sample=record.samples[i],p=sample?.position;
  if(!p||![sample.time,p.x,p.z,p.feet].every(Number.isFinite))return fail('nonfinite-frame',i);
  if(previous){
   const dt=sample.time-previous.time;
   if(!(dt>0))return fail('nonmonotonic-time',i);
   if(dt>maxGapSeconds)return fail('missing-interval',i);
   const h=Math.hypot(p.x-previous.position.x,p.z-previous.position.z)/dt;
   const v=Math.abs(p.feet-previous.position.feet)/dt;
   if(h>maxHorizontalSpeed+1e-9)return fail('horizontal-discontinuity',i);
   if(v>maxVerticalSpeed+1e-9)return fail('vertical-discontinuity',i);
  }
  previous=sample;
 }
 return {safe:true,reason:'continuous',index:-1};
}
