// Source-only analysis of genuine stepPlayer event streams. No production hook.
export const STEP_EVENT_AUDIT_CONTRACT='movement12-step-event-audit-v1';
const finite=n=>typeof n==='number'&&Number.isFinite(n);
export function auditStepEvents(recording,{maxRise=1.1,maxDrop=100,epsilon=1e-6}={}){
 if(!recording||!Array.isArray(recording.samples)||!Array.isArray(recording.events)||recording.samples.length!==recording.events.length+1||recording.events.length===0)throw new TypeError('complete real trace required');
 if(![maxRise,maxDrop,epsilon].every(finite)||maxRise<=0||maxDrop<=0||epsilon<0)throw new RangeError('invalid limits');
 const findings=[];let steps=0,walls=0,falls=0;
 for(let i=0;i<recording.events.length;i++){
  const a=recording.samples[i],b=recording.samples[i+1],e=recording.events[i];
  if(!a||!b||!e||typeof e!=='object'||!finite(a.time)||!finite(b.time)||b.time<=a.time)throw new TypeError('invalid frame timeline');
  for(const p of [a.position,b.position])if(!p||!['x','feet','z'].every(k=>finite(p[k])))throw new TypeError('invalid position');
  const rise=b.position.feet-a.position.feet;
  if(rise>maxRise+epsilon)findings.push({frame:i,kind:'excessive-rise',rise});
  if(rise< -maxDrop-epsilon)findings.push({frame:i,kind:'excessive-drop',drop:-rise});
  if(e.stepped){steps++;if(rise<=epsilon)findings.push({frame:i,kind:'step-without-rise',rise});}
  if(e.hitWall)walls++;
  if(rise< -epsilon)falls++;
 }
 return Object.freeze({ok:findings.length===0,findings,frames:recording.events.length,steps,walls,descendingFrames:falls,live:false,productionHooked:false});
}
