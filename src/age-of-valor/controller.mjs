// AV1/AV6 isolated synchronous admission; factories must be trusted and private.
export function createActionController({makeScheduler,makeLedger,resourceOptions,definitions,readContext,authorize,worldEpoch}){
 if(![makeScheduler,makeLedger,readContext,authorize].every(f=>typeof f==='function')||!Number.isSafeInteger(worldEpoch)||worldEpoch<0||!definitions||typeof definitions!=='object')throw Error('invalid controller');
 const scheduler=makeScheduler(),ledger=makeLedger(resourceOptions),catalog=new Map();
 const integer=(x,a,b)=>Number.isSafeInteger(x)&&x>=a&&x<=b;
 for(const [kind,d] of Object.entries(definitions)){
  if(!['light','heavy','block','parry','dodge','cast'].includes(kind)||!d||!integer(d.cost?.stamina,0,100000000)||!integer(d.cost?.mana,0,100000000))throw Error('invalid action');
  const timing={kind};
  if(['light','heavy'].includes(kind)){for(const k of ['windupMs','activeMs','recoveryMs']){if(!integer(d[k],1,60000))throw Error('invalid timing');timing[k]=d[k];}}
  else if(kind!=='block'){if(!integer(d.durationMs,1,60000))throw Error('invalid timing');timing.durationMs=d.durationMs;}
  catalog.set(kind,Object.freeze({timing:Object.freeze(timing),cost:Object.freeze({stamina:d.cost.stamina,mana:d.cost.mana})}));
 }
 let retired=false,busy=false;
 const state=()=>Object.freeze({scheduler:scheduler.snapshot(),resources:ledger.snapshot(),retired});
 const result=(ok,reason,events=[])=>Object.freeze({ok,reason,events:Object.freeze([...events]),state:state()});
 function gate(){
  let c;try{c=readContext();}catch{}
  if(c&&Number.isSafeInteger(c.worldEpoch)&&c.worldEpoch!==worldEpoch)retired=true;
  if(retired){scheduler.abortForLifecycle();ledger.close();return 'retired';}
  if(c?.worldEpoch===worldEpoch&&c.alive===false){scheduler.interrupt('dead');return 'dead';}
  if(c?.worldEpoch!==worldEpoch||c.alive!==true||c.playable!==true||c.combatMode!==true||c.creative!==false||c.mounted!==false||c.readOnly!==false){scheduler.abortForLifecycle();return 'blocked';}
  return null;
 }
 function exclusive(fn){if(busy)return result(false,'busy');busy=true;try{return fn();}finally{busy=false;}}
 function debit(cost){
  const s=ledger.snapshot();
  return ledger.consume({sequence:s.highest+1,expectedRevision:s.revision,cost});
 }
 function request(kind){return exclusive(()=>{
  const denied=gate();if(denied)return result(false,denied);
  if(scheduler.snapshot().state!=='idle')return result(false,'not-idle');
  const d=catalog.get(kind);if(!d)return result(false,'undefined-action');
  let permitted=false;try{permitted=authorize(d,scheduler.snapshot())===true;}catch{}
  if(!permitted)return result(false,'not-authorized');
  const second=gate();if(second)return result(false,second);
  // Both engines are private, synchronous and have no callbacks during mutation.
  // Provisional start is never published unless debit succeeds.
  const started=scheduler.begin(d.timing);if(!started.ok)return result(false,started.reason);
  const charged=debit(d.cost);
  if(!charged.ok){scheduler.abortForLifecycle();return result(false,charged.reason);}
  return result(true,'admitted',started.events);
 });}
 function advance(ms){return exclusive(()=>{
  const denied=gate();if(denied)return result(false,denied);
  const a=scheduler.snapshot(),b=ledger.snapshot();
  if(!integer(ms,0,60000)||a.clock!==b.clock||a.clock>Number.MAX_SAFE_INTEGER-ms||b.revision>=Number.MAX_SAFE_INTEGER||b.closed)return result(false,'invalid-advance');
  const next=scheduler.advance(ms);if(!next.ok)return result(false,next.reason);
  const regen=ledger.advance(ms,'combat');if(!regen.ok){retired=true;ledger.close();scheduler.abortForLifecycle();return result(false,'resource-clock-fault');}
  return result(true,'advanced',next.events);
 });}
 function guardCharge({actionId,cost,breakMs}={}){return exclusive(()=>{
  const denied=gate();if(denied)return result(false,denied);
  const s=scheduler.snapshot();
  if(!['blocking','parrying'].includes(s.state)||s.actionId!==actionId||!integer(cost,0,100000000)||!integer(breakMs,1,60000)||s.clock>Number.MAX_SAFE_INTEGER-breakMs)return result(false,'invalid-guard');
  const charged=debit({stamina:cost,mana:0});
  if(charged.ok)return result(true,'guard-paid');
  if(charged.reason!=='insufficient'){retired=true;ledger.close();scheduler.abortForLifecycle();return result(false,'resource-fault');}
  const broken=scheduler.interrupt('stagger',breakMs);
  return result(false,'guard-broken',broken.events);
 });}
 function requestAbility({definitionId,durationMs,cost}={}){return exclusive(()=>{
  const denied=gate();if(denied)return result(false,denied);
  if(scheduler.snapshot().state!=='idle'||typeof definitionId!=='string'||!/^[a-z][a-z0-9_-]{0,31}:[a-z0-9][a-z0-9._-]{0,63}$/.test(definitionId)||!integer(durationMs,1,60000)||!integer(cost?.stamina,0,100000000)||!integer(cost?.mana,0,100000000))return result(false,'invalid-or-busy');
  const d=Object.freeze({definitionId,timing:Object.freeze({kind:'cast',durationMs}),cost:Object.freeze({stamina:cost.stamina,mana:cost.mana})});
  let permitted=false;try{permitted=authorize(d,scheduler.snapshot())===true;}catch{}if(!permitted)return result(false,'not-authorized');
  const second=gate();if(second)return result(false,second);
  const started=scheduler.begin(d.timing);if(!started.ok)return result(false,started.reason);
  const charged=debit(d.cost);if(!charged.ok){scheduler.abortForLifecycle();return result(false,charged.reason);}
  return result(true,'admitted',started.events);
 });}
 return Object.freeze({state,request,requestAbility,advance,guardCharge,releaseBlock:id=>exclusive(()=>{const g=gate();if(g)return result(false,g);const x=scheduler.releaseBlock(id);return result(x.ok,x.reason,x.events);}),cancel:()=>exclusive(()=>{const x=scheduler.abortForLifecycle();return result(x.ok,x.reason,x.events);})});
}
