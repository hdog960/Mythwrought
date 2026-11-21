// Source-only P0/P1 motion safety probe. No production imports or registration.
// Host supplies the actual voxel full-body collides(world,x,feet,z) reader.
export const MOVEMENT12_CONTRACT='movement12-swept-probe-v1';
const finite=n=>typeof n==='number'&&Number.isFinite(n);
const valid=p=>p&&['x','feet','z'].every(k=>finite(p[k]));
export function auditMotionSegment({world,from,to,collides,maxSegment=.10,maxSamples=4096}={}){
  if(!valid(from)||!valid(to))throw new TypeError('finite player feet coordinates required');
  if(typeof collides!=='function')throw new TypeError('real host collision reader required');
  if(!finite(maxSegment)||maxSegment<=0||maxSegment>.25||!Number.isSafeInteger(maxSamples)||maxSamples<1)
    throw new RangeError('invalid sampling budget');
  const distance=Math.hypot(to.x-from.x,to.feet-from.feet,to.z-from.z);
  const count=Math.max(1,Math.ceil(distance/maxSegment));
  if(count>maxSamples)return Object.freeze({safe:false,reason:'budget-exceeded',samples:0,distance,firstBlocked:null,live:false});
  // Validate start too: recovery must not quietly treat an embedded body as clear.
  for(let i=0;i<=count;i++){
    const t=i/count;
    const p={x:from.x+(to.x-from.x)*t,feet:from.feet+(to.feet-from.feet)*t,z:from.z+(to.z-from.z)*t};
    const hit=collides(world,p.x,p.feet,p.z);
    if(typeof hit!=='boolean')throw new TypeError('host collision reader must return boolean');
    if(hit)return Object.freeze({safe:false,reason:i===0?'embedded-start':'collision',samples:i+1,
      distance,firstBlocked:Object.freeze({...p,t}),live:false});
  }
  return Object.freeze({safe:true,reason:'clear',samples:count+1,distance,firstBlocked:null,live:false});
}
export function auditMovementTrace({world,positions,collides,maxSegment=.10,maxSamples=4096}={}){
  if(!Array.isArray(positions)||positions.length<2||positions.length>4097)
    throw new RangeError('bounded trace with at least two positions required');
  let total=0;
  for(let i=1;i<positions.length;i++){
    const r=auditMotionSegment({world,from:positions[i-1],to:positions[i],collides,maxSegment,maxSamples:maxSamples-total});
    total+=r.samples;
    if(!r.safe)return Object.freeze({safe:false,segment:i-1,samples:total,reason:r.reason,firstBlocked:r.firstBlocked,live:false});
  }
  return Object.freeze({safe:true,segment:null,samples:total,reason:'clear',firstBlocked:null,live:false});
}
