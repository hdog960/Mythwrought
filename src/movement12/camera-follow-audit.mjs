// Source-only camera-follow trace auditor; maxJerk is the historical acceleration limit.
export function auditCameraFollowTrace(samples,{maxLag=0.5,maxJerk=250,maxGapSeconds=0.1}={}){
 const fail=(reason,index=-1)=>({safe:false,reason,index});
 if(!Array.isArray(samples)||samples.length<3)return fail('missing-samples');
 if(![maxLag,maxJerk,maxGapSeconds].every(v=>Number.isFinite(v)&&v>0))return fail('invalid-limits');
 let prev=null,previousVelocity=null,previousDt=null;
 for(let i=0;i<samples.length;i++){
  const s=samples[i];
  if(!s||!Number.isFinite(s.time)||!s.player||!s.camera||
     ![s.player.x,s.player.y,s.player.z,s.camera.x,s.camera.y,s.camera.z].every(Number.isFinite))return fail('nonfinite-frame',i);
  if(prev){
   const dt=s.time-prev.time;
   if(!(dt>0))return fail('nonmonotonic-time',i);
   if(dt>maxGapSeconds)return fail('missing-interval',i);
  }
  const lag=Math.hypot(s.player.x-s.camera.x,s.player.y-s.camera.y,s.player.z-s.camera.z);
  if(lag>maxLag+1e-9)return fail('camera-lag',i);
  if(prev){
   const dt=s.time-prev.time;
   const velocity=['x','y','z'].map(k=>(s.camera[k]-prev.camera[k])/dt);
   if(previousVelocity){
    const midpointDt=(previousDt+dt)/2;
    const acceleration=Math.hypot(...velocity.map((v,j)=>(v-previousVelocity[j])/midpointDt));
    if(!Number.isFinite(acceleration)||acceleration>maxJerk+1e-9)return fail('camera-acceleration-spike',i);
   }
   previousVelocity=velocity;
   previousDt=dt;
  }
  prev=s;
 }
 return {safe:true,reason:'smooth',index:-1};
}
