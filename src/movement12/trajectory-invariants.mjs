// Opt-in movement12 trace invariant auditor. Does not register production hooks.
export const TRACE_INVARIANTS_CONTRACT = 'movement12-trace-invariants-v1';
const finite = n => typeof n === 'number' && Number.isFinite(n);
export function auditTraceInvariants({samples,events,world,collides,maxSpeed=40,maxVerticalSpeed=40,maxSamples=2400,epsilon=1e-7}={}){
  if(!Array.isArray(samples)||samples.length<2||samples.length>maxSamples)throw new RangeError('bounded samples required');
  if(!Array.isArray(events)||events.length!==samples.length-1)throw new RangeError('one event per interval required');
  if(typeof collides!=='function'||!world||!finite(maxSpeed)||maxSpeed<=0||!finite(maxVerticalSpeed)||maxVerticalSpeed<=0||!finite(epsilon)||epsilon<0)throw new TypeError('invalid trace contract');
  const failures=[],segments=[];
  for(let i=0;i<samples.length;i++){
    const s=samples[i],p=s?.position;
    if(!finite(s?.time)||!p||!['x','feet','z'].every(k=>finite(p[k])))throw new TypeError('nonfinite trace sample '+i);
    if(i&&s.time<=samples[i-1].time)throw new RangeError('timestamps must increase');
    if(collides(world,p.x,p.feet,p.z))failures.push({index:i,reason:'body-penetration'});
    if(!i)continue;
    const a=samples[i-1],dt=s.time-a.time,dx=p.x-a.position.x,dz=p.z-a.position.z,dy=p.feet-a.position.feet;
    const horizontal=Math.hypot(dx,dz)/dt,vertical=Math.abs(dy)/dt;
    if(horizontal>maxSpeed+epsilon)failures.push({index:i,reason:'horizontal-speed'});
    if(vertical>maxVerticalSpeed+epsilon)failures.push({index:i,reason:'vertical-speed'});
    segments.push({index:i,dt,horizontal,vertical});
  }
  return Object.freeze({contract:TRACE_INVARIANTS_CONTRACT,pass:failures.length===0,failures,segments,sourceOnly:true,live:false});
}
