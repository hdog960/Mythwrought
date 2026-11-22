// Floating Islands: bounded G2-compatible swept-flight admission, source-only.
// The caller supplies the existing dual-world physical authority. This never
// advances a player or invokes GPU work; original G2 must ALSO approve motion.
export const SKY_SWEEP_MAX_METERS=.750001; // 15 blocks/sec * 50ms, plus FP tolerance
export const SKY_SWEEP_STEP=.25;
const valid=n=>typeof n==='number'&&Number.isFinite(n);
const point=p=>p&&['x','y','z'].every(k=>valid(p[k]));
const token=s=>typeof s==='string'&&s.length>0&&s.length<=128;
const fail=m=>{throw new TypeError('Sky flight sweep: '+m);};
const frozen=p=>Object.freeze({x:p.x,y:p.y,z:p.z});
const held=(at,reason,samples)=>Object.freeze({approved:false,
  position:frozen(at),reason,samples,changed:false});
export function planSweptSkyFlight({from,to,worldToken,expectedWorldToken,
  certifyPoint,readCurrentWorldToken,step=SKY_SWEEP_STEP}={}){
  if(!point(from)||!point(to)||!token(worldToken)||!token(expectedWorldToken)||
     typeof certifyPoint!=='function'||
     (readCurrentWorldToken!==undefined&&typeof readCurrentWorldToken!=='function')||
     !valid(step)||step<=0||step>SKY_SWEEP_STEP)
    fail('finite coordinates, world identity and authoritative verifier required');
  if(worldToken!==expectedWorldToken)
    return held(from,'World changed; movement refused before sampling',0);
  const distance=Math.hypot(to.x-from.x,to.y-from.y,to.z-from.z);
  if(distance>SKY_SWEEP_MAX_METERS)
    return held(from,'Frame movement exceeds original G2 travel budget',0);
  // Include the starting point, not only the destination. This guards a
  // resumed-flight body after mine/PLACE or a world edit under the player.
  const segments=Math.max(1,Math.ceil(distance/step));
  for(let i=0;i<=segments;i++){
    if(readCurrentWorldToken&&readCurrentWorldToken()!==expectedWorldToken)
      return held(from,'World changed during swept flight',i);
    const t=i/segments,p={x:from.x+(to.x-from.x)*t,
      y:from.y+(to.y-from.y)*t,z:from.z+(to.z-from.z)*t};
    let result;
    try{result=certifyPoint(p);}catch(_){return held(from,'Physical source threw; flight refused',i+1);}
    if(readCurrentWorldToken&&readCurrentWorldToken()!==expectedWorldToken)
      return held(from,'World changed during swept flight',i+1);
    if(!result||result.safe!==true)
      return held(from,typeof result?.reason==='string'&&result.reason.length?
        result.reason:'Unverified loaded physical region',i+1);
  }
  return Object.freeze({approved:true,position:frozen(to),
    reason:'Every swept body checkpoint certified',samples:segments+1,
    changed:distance>0});
}
