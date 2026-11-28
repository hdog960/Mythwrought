// AV6 fixed-point session-local stamina/mana ledger; no persistence or health.
export function createResourceLedger({maximum,initial,regeneration,delayMs,restored=null}){
 // Fixed-point thousandths; all rates expressed in thousandths/second.
 const int=(x,min,max)=>Number.isSafeInteger(x)&&x>=min&&x<=max;
 const pair=(p,min,max)=>p&&int(p.stamina,min,max)&&int(p.mana,min,max);
 if(!pair(maximum,1,100000000)||!pair(initial,0,100000000)||initial.stamina>maximum.stamina||initial.mana>maximum.mana||!pair(regeneration?.combat,0,10000000)||!pair(regeneration?.exploration,0,10000000)||!pair(delayMs,0,600000))throw Error('invalid resource definition');
 const max={...maximum},rates={combat:{...regeneration.combat},exploration:{...regeneration.exploration}},delay={...delayMs};
 const keys=['stamina','mana'],balance={...initial},remainder={stamina:0,mana:0},ready={stamina:0,mana:0};
 let clock=0,highest=0,revision=0,closed=false;
 if(restored!==null){if(restored.version!==1||!pair(restored.remainingDelay,0,600000)||!pair(restored.remainder,0,999)||!int(restored.highest,0,Number.MAX_SAFE_INTEGER-1)||!int(restored.revision,0,Number.MAX_SAFE_INTEGER-1)||keys.some(k=>restored.remainingDelay[k]>delay[k]||initial[k]===max[k]&&restored.remainder[k]!==0))throw Error('invalid restored resources');for(const k of keys){ready[k]=restored.remainingDelay[k];remainder[k]=restored.remainder[k];}highest=restored.highest;revision=restored.revision;}
 const checkpoint=()=>{if(closed)throw Error('closed ledger');return Object.freeze({version:1,highest,revision,remainingDelay:Object.freeze(Object.fromEntries(keys.map(k=>[k,Math.max(0,ready[k]-clock)]))),remainder:Object.freeze({...remainder})});};
 const snapshot=()=>Object.freeze({version:1,clock,revision,highest,closed,stamina:balance.stamina,mana:balance.mana,maxStamina:max.stamina,maxMana:max.mana});
 const result=(ok,reason)=>Object.freeze({ok,reason,snapshot:snapshot()});
 function consume({sequence,cost,expectedRevision}={}){
  if(closed)return result(false,'closed');
  if(!int(sequence,1,Number.MAX_SAFE_INTEGER)||sequence<=highest||expectedRevision!==revision||!pair(cost,0,100000000)||clock>Number.MAX_SAFE_INTEGER-600000||revision>=Number.MAX_SAFE_INTEGER)return result(false,'stale-or-invalid');
  highest=sequence;revision++;
  if(keys.some(k=>cost[k]>balance[k]))return result(false,'insufficient');
  for(const k of keys)if(cost[k]>0){balance[k]-=cost[k];ready[k]=clock+delay[k];remainder[k]=0;}
  return result(true,'charged');
 }
 function advance(ms,mode){
  if(closed||!int(ms,0,60000)||!['combat','exploration','paused'].includes(mode)||clock>Number.MAX_SAFE_INTEGER-ms||revision>=Number.MAX_SAFE_INTEGER)return result(false,'invalid-advance');
  if(mode==='paused'||ms===0)return result(true,'paused-or-zero');
  const end=clock+ms;
  for(const k of keys){
   const elapsed=Math.max(0,end-Math.max(clock,ready[k]));
   const numerator=elapsed*rates[mode][k]+remainder[k];
   const gain=Math.floor(numerator/1000);
   balance[k]=Math.min(max[k],balance[k]+gain);remainder[k]=balance[k]===max[k]?0:numerator%1000;
  }
  clock=end;revision++;return result(true,'advanced');
 }
 return Object.freeze({snapshot,checkpoint,consume,advance,close:()=>{closed=true;return snapshot()}});
}
