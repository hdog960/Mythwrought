// AV9 bounded poise and non-extendable stagger proposals; host owns interruption.
export function createPoiseTracker({worldEpoch,maximum,regenPerSecond,regenDelayMs,staggerMs,immunityMs,criticalMultiplier}){
 const int=(v,a,b)=>Number.isSafeInteger(v)&&v>=a&&v<=b;
 if(!int(worldEpoch,0,Number.MAX_SAFE_INTEGER)||!int(maximum,1,100000000)||!int(regenPerSecond,0,10000000)||!int(regenDelayMs,0,600000)||!int(staggerMs,1,60000)||!int(immunityMs,1,600000)||!Number.isFinite(criticalMultiplier)||criticalMultiplier<1||criticalMultiplier>4)throw Error('invalid poise policy');
 let clock=0,poise=maximum,ready=0,remainder=0,protectedUntil=0,highest=0,closed=false;
 const snapshot=()=>Object.freeze({clock,poise,maximum,protectedUntil,highest,closed});
 const out=(kind,extra={})=>Object.freeze({kind,...extra,snapshot:snapshot()});
 function advance(ms,paused=false){
  if(closed||!int(ms,0,60000)||typeof paused!=='boolean'||clock>Number.MAX_SAFE_INTEGER-ms)return out('invalid');
  if(paused)return out('paused');
  const end=clock+ms,elapsed=Math.max(0,end-Math.max(clock,ready));
  const total=elapsed*regenPerSecond+remainder;
  poise=Math.min(maximum,poise+Math.floor(total/1000));remainder=poise===maximum?0:total%1000;
  clock=end;return out('advanced');
 }
 function impact(v){
  if(closed||!v||v.worldEpoch!==worldEpoch||v.at!==clock||!int(v.sequence,1,Number.MAX_SAFE_INTEGER)||v.sequence<=highest||v.accepted!==true||!int(v.force,0,100000000)||typeof v.critical!=='boolean'||!Number.isFinite(v.resistance)||v.resistance<0||v.resistance>1||clock>Number.MAX_SAFE_INTEGER-660000)return out('invalid');
  highest=v.sequence;
  if(clock<protectedUntil)return out('protected');
  const loss=Math.min(maximum,Math.ceil(v.force*(v.critical?criticalMultiplier:1)*(1-v.resistance)));
  if(loss===0)return out('resisted');
  poise=Math.max(0,poise-loss);remainder=0;ready=clock+regenDelayMs;
  if(poise>0)return out('absorbed',{loss});
  // A break starts one non-extendable protected interval including recovery.
  poise=maximum;protectedUntil=clock+staggerMs+immunityMs;ready=Math.max(ready,protectedUntil);
  return out('stagger-proposal',{loss,durationMs:staggerMs,until:clock+staggerMs});
 }
 return Object.freeze({snapshot,advance,impact,close:()=>{closed=true;return snapshot()}});
}
