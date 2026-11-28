// AV7 exact-boundary held guard charging; host must split simulation at next pulse.
export function createGuardDrain({intervalMs,cost,breakMs,readState,charge}){
 const int=(v,a,b)=>Number.isSafeInteger(v)&&v>=a&&v<=b;
 if(!int(intervalMs,100,60000)||!int(cost,1,100000000)||!int(breakMs,1,60000)||typeof readState!=='function'||typeof charge!=='function')throw Error('invalid hold drain');
 let action=null,next=null,last=0,closed=false,busy=false;
 function synchronize(){
  if(closed||busy)return Object.freeze({ok:false,reason:'unavailable'});
  busy=true;try{
   const s=readState();
   if(!s||!int(s.clock,last,Number.MAX_SAFE_INTEGER-60000))throw Error('invalid clock');
   last=s.clock;
   if(s.state!=='blocking'){action=null;next=null;return Object.freeze({ok:true,reason:'idle',next});}
   if(!int(s.actionId,1,Number.MAX_SAFE_INTEGER))throw Error('invalid action');
   if(action!==s.actionId){action=s.actionId;next=s.clock+intervalMs;}
   if(s.clock>next)throw Error('missed guard boundary');
   if(s.clock===next){const paid=charge({actionId:action,cost,breakMs});if(paid?.ok===true&&paid.reason==='guard-paid')next+=intervalMs;else if(paid?.reason==='guard-broken'){action=null;next=null;return Object.freeze({ok:false,reason:'guard-broken',next});}else throw Error('uncertain charge');}
   return Object.freeze({ok:true,reason:'scheduled',next});
  }catch{closed=true;return Object.freeze({ok:false,reason:'authority-uncertain'});}finally{busy=false;}
 }
 return Object.freeze({synchronize,close:()=>{closed=true}});
}
