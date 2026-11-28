// AV7 directional guard and timed parry, no health writes.
export function createGuardResolver({readState,charge,worldEpoch,policy}){
 const int=(x,a,b)=>Number.isSafeInteger(x)&&x>=a&&x<=b;
 const finite=(x,a,b)=>typeof x==='number'&&Number.isFinite(x)&&x>=a&&x<=b;
 if(typeof readState!=='function'||typeof charge!=='function'||!int(worldEpoch,0,Number.MAX_SAFE_INTEGER)||!policy||!finite(policy.minimumDot,0,1)||!int(policy.parryWindowMs,1,60000)||!int(policy.blockBase,0,100000000)||!finite(policy.costPerDamage,0,1000000)||!int(policy.parryCost,0,100000000)||!int(policy.breakMs,1,60000)||!finite(policy.blockReduction,0,1))throw Error('invalid guard policy');
 const p=Object.freeze({...policy});let highest=0,busy=false,closed=false;
 function evaluate(impact){
  const out=(guard,reason,extra={})=>Object.freeze({guard,reason,blockReduction:guard==='block'?p.blockReduction:0,...extra});
  if(closed||busy)return out('none','unavailable');
  if(!impact||impact.worldEpoch!==worldEpoch||!int(impact.sequence,1,Number.MAX_SAFE_INTEGER)||impact.sequence<=highest||!int(impact.at,0,Number.MAX_SAFE_INTEGER)||!finite(impact.amount,0,100000)||typeof impact.blockable!=='boolean'||typeof impact.parryable!=='boolean')return out('none','invalid-or-stale');
  const vector=v=>Array.isArray(v)&&v.length===2&&v.every(x=>finite(x,-1,1))&&Math.abs(Math.hypot(...v)-1)<.001;
  if(!vector(impact.towardAttacker))return out('none','invalid-direction');
  busy=true;highest=impact.sequence;
  try{
   const s=readState();
   if(!s||s.worldEpoch!==worldEpoch||s.active!==true||s.clock!==impact.at||!vector(s.forward)||!int(s.actionId,1,Number.MAX_SAFE_INTEGER)||!int(s.startedAt,0,s.clock))return out('none','no-authoritative-guard');
   if(s.forward[0]*impact.towardAttacker[0]+s.forward[1]*impact.towardAttacker[1]<p.minimumDot)return out('none','outside-guard-arc');
   let guard,cost;
   if(s.state==='parrying'&&impact.parryable&&s.clock-s.startedAt<p.parryWindowMs){guard='parry';cost=p.parryCost;}
   else if(s.state==='blocking'&&impact.blockable){guard='block';cost=Math.min(100000000,p.blockBase+Math.ceil(impact.amount*p.costPerDamage));}
   else return out('none','ineligible');
   const paid=charge(Object.freeze({actionId:s.actionId,cost,breakMs:p.breakMs}));
   if(paid?.ok===true&&paid.reason==='guard-paid')return out(guard,'paid',{cost});
   if(paid?.ok===false&&paid.reason==='guard-broken')return out('none','guard-broken');
   closed=true;return out('none','authority-uncertain');
  }catch{closed=true;return out('none','authority-uncertain');}finally{busy=false;}
 }
 return Object.freeze({evaluate,close:()=>{closed=true}});
}
