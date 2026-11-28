// AV12 generic execution proposals; resource and skill authority injected.
export function createAbilityExecutor({registry,identity,policies,readContext,readSkills,admit,validateAim,authorizePulse}){
 const int=(x,a,b)=>Number.isSafeInteger(x)&&x>=a&&x<=b,id=x=>typeof x==='string'&&/^[A-Za-z0-9:._-]{1,128}$/.test(x),keys=['worldId','profileId','sourceId'];
 if(!registry||typeof registry.get!=='function'||!identity||!keys.every(k=>id(identity[k]))||typeof identity.fixture!=='boolean'||!policies||![readContext,readSkills,admit,validateAim,authorizePulse].every(f=>typeof f==='function'))throw Error('invalid executor');
 const scope=Object.freeze({...Object.fromEntries(keys.map(k=>[k,identity[k]])),fixture:identity.fixture}),catalog=new Map(),cooldowns=new Map();
 for(const [k,p] of Object.entries(policies)){
  const d=registry.get(k);
  if(!d||!['spell','ability','projectile'].includes(d.type)||(d.scope==='fixture')!==scope.fixture||!p||!['instant','charged','channel'].includes(p.mode)||!int(p.windupMs,0,60000)||!int(p.minChargeMs,0,60000)||!int(p.maxChargeMs,0,60000)||!int(p.pulseMs,0,60000)||!int(p.pulses,1,32)||!int(d.timing?.cooldownMs,0,600000))throw Error('invalid policy');
  if(p.mode==='charged'?(p.minChargeMs<1||p.maxChargeMs<p.minChargeMs||p.windupMs!==0):p.minChargeMs!==0||p.maxChargeMs!==0)throw Error('invalid charge');
  if(p.mode==='channel'?(d.delivery!=='channel'||p.pulseMs<100||p.windupMs+p.pulseMs*p.pulses>60000):d.delivery==='channel'||p.pulseMs!==0||p.pulses!==1)throw Error('invalid channel');
  catalog.set(k,{d,p:Object.freeze({...p})});
 }
 if(catalog.size>128)throw Error('capacity');
 let clock=0,highest=0,active=null,closed=false,busy=false;
 const snapshot=()=>Object.freeze({clock,highest,closed,active:active?Object.freeze({id:active.d.id,actionId:active.actionId,next:active.next,count:active.count}):null,cooldowns:Object.freeze(Object.fromEntries(cooldowns))});
 const out=(ok,reason,events=[])=>Object.freeze({ok,reason,events:Object.freeze(events),snapshot:snapshot()});
 const same=x=>x&&keys.every(k=>x[k]===scope[k])&&x.fixture===scope.fixture;
 function context(){const c=readContext();if(!same(c)||c.alive!==true){closed=true;active=null;return false;}if(c.playable!==true||c.combatMode!==true||c.creative!==false||c.readOnly!==false||c.mounted!==false){active=null;return false;}return true;}
 function unlocked(d){const s=readSkills(Object.freeze({...scope,definitionId:d.id}));return same(s)&&s.verified===true&&s.unlocked===true&&d.requirements.every(q=>int(s.levels?.[q.skillId],q.level,99));}
 function aim(d,input){
  if(d.delivery==='self')return Object.freeze({targetId:scope.sourceId});
  const a=validateAim(d,input,scope);if(a?.verified!==true)return null;
  if(d.delivery==='target')return id(a.targetId)&&a.targetId!==scope.sourceId?Object.freeze({targetId:a.targetId}):null;
  if(!Array.isArray(a.position)||a.position.length!==3||a.position.some(x=>typeof x!=='number'||!Number.isFinite(x)||Math.abs(x)>1e7)||a.position[1]<-210||a.position[1]>257)return null;
  return Object.freeze({position:Object.freeze([...a.position])});
 }
 function exclusive(fn){if(closed||busy)return out(false,'unavailable');busy=true;try{return fn();}catch{closed=true;active=null;return out(false,'authority-uncertain');}finally{busy=false;}}
 function emit(){
  const a=active;if(!a||!context()||!unlocked(a.d)){active=null;return out(false,'execution-denied');}
  const renewed=aim(a.d,a.aim);if(!renewed){active=null;return out(false,'aim-invalidated');}
  const pulse=Object.freeze({...scope,actionId:a.actionId,definitionId:a.d.id,ordinal:a.count+1,at:clock,delivery:a.d.delivery,aim:renewed,chargeFraction:a.fraction});
  if(authorizePulse(pulse)!==true){active=null;return out(false,'pulse-denied');}
  a.count++;if(a.count>=a.p.pulses)active=null;else a.next+=a.p.pulseMs;
  return out(true,'execution-proposed',[Object.freeze({type:'ability-execution-proposal',...pulse})]);
 }
 function start({definitionId,sequence,aim:input}={}){return exclusive(()=>{
  if(!context()||active)return out(false,'context-or-busy');
  if(!int(sequence,1,Number.MAX_SAFE_INTEGER)||sequence<=highest||clock>Number.MAX_SAFE_INTEGER-660000)return out(false,'stale-sequence');
  highest=sequence;const entry=catalog.get(definitionId);
  if(!entry||clock<(cooldowns.get(definitionId)??0)||!unlocked(entry.d))return out(false,'locked-or-cooldown');
  const target=aim(entry.d,input);if(!target)return out(false,'invalid-aim');
  const receipt=admit(Object.freeze({...scope,sequence,definitionId,cost:entry.d.cost,mode:entry.p.mode}));
  if(!same(receipt)||receipt.sequence!==sequence||receipt.definitionId!==definitionId||typeof receipt.accepted!=='boolean')throw Error('unknown admission');
  if(!receipt.accepted)return out(false,'admission-denied');if(!id(receipt.actionId))throw Error('invalid action identity');
  cooldowns.set(definitionId,clock+entry.d.timing.cooldownMs);
  active={...entry,actionId:receipt.actionId,aim:target,started:clock,next:entry.p.mode==='charged'?null:clock+entry.p.windupMs,count:0,fraction:1};
  return active.next===clock?emit():out(true,'admitted');
 });}
 function advance(ms){return exclusive(()=>{
  if(!context())return out(false,'context-blocked');
  if(!int(ms,0,1000)||clock>Number.MAX_SAFE_INTEGER-ms)return out(false,'invalid-delta');
  const end=clock+ms;
  if(active?.p.mode==='charged'&&end>active.started+active.p.maxChargeMs){clock=end;active=null;return out(false,'charge-expired');}
  if(active&&active.next!==null&&end>active.next)return out(false,'split-at-boundary');
  clock=end;return active&&active.next===clock?emit():out(true,'advanced');
 });}
 function release(){return exclusive(()=>{if(!context()||active?.p.mode!=='charged')return out(false,'no-charge');const held=clock-active.started;if(held<active.p.minChargeMs||held>active.p.maxChargeMs){active=null;return out(false,'invalid-charge');}active.fraction=held/active.p.maxChargeMs;return emit();});}
 return Object.freeze({start,advance,release,snapshot,cancel:()=>exclusive(()=>{active=null;return out(true,'cancelled');}),close:()=>{closed=true;active=null;return snapshot();}});
}
