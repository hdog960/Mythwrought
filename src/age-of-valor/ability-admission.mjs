// Trusted registry adapter to the existing private scheduler/resource ledger.
export function createAbilityAdmission({controller,identity,registry,policies}){
 const keys=['worldId','profileId','sourceId'],same=x=>x&&keys.every(k=>x[k]===identity[k])&&x.fixture===identity.fixture;
 if(!controller||typeof controller.requestAbility!=='function'||!identity||!registry||typeof registry.get!=='function'||!policies)throw Error('invalid admission adapter');
 let highest=0,active=null;
 function admit(q){
  if(!same(q)||!Number.isSafeInteger(q.sequence)||q.sequence<=highest)return Object.freeze({...q,accepted:false});
  highest=q.sequence;const d=registry.get(q.definitionId),p=policies[q.definitionId];
  if(!d||!p||q.mode!==p.mode||(d.scope==='fixture')!==identity.fixture||q.cost?.stamina!==d.cost.stamina||q.cost?.mana!==d.cost.mana)return Object.freeze({...q,accepted:false});
  const span=p.mode==='charged'?p.maxChargeMs:p.mode==='channel'?p.windupMs+p.pulseMs*(p.pulses-1):p.windupMs;
  // Keep casting owned at the exact execution boundary; recovery holds the scheduler afterwards.
  const durationMs=span+Math.max(1,d.timing.recoveryMs);
  if(!Number.isSafeInteger(durationMs)||durationMs<1||durationMs>60000)return Object.freeze({...q,accepted:false});
  const v=controller.requestAbility({definitionId:d.id,durationMs,cost:{stamina:Math.round(d.cost.stamina*1000),mana:Math.round(d.cost.mana*1000)}});
  if(!v.ok)return Object.freeze({...q,accepted:false});
  active=Object.freeze({id:String(v.state.scheduler.actionId),definitionId:d.id,sequence:q.sequence,recoveryMs:Math.max(1,d.timing.recoveryMs)});
  return Object.freeze({...q,accepted:true,actionId:active.id});
 }
 function authorizePulse(p){const s=controller.state().scheduler;const valid=!!(same(p)&&active&&p.actionId===active.id&&p.definitionId===active.definitionId&&s.state==='casting'&&String(s.actionId)===active.id&&s.clock===p.at);if(!valid)return false;if(p.final===true){if(typeof controller.finishAbility!=='function'||!controller.finishAbility(s.actionId,active.recoveryMs).ok)return false;active=null;}return true;}
 return Object.freeze({admit,authorizePulse});
}
