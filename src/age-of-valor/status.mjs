// AV10 bounded status definitions and simulation; events are proposals, not health writes.
export function createStatusRegistry(definitions){
 const kinds=['burning','bleeding','poison','chilling','freezing','shock','weakening','fortification','regeneration','slowing'];
 const families=['slashing','piercing','crushing','fire','frost','lightning','poison','arcane','resonance'];
 const id=x=>typeof x==='string'&&/^[a-z][a-z0-9_-]{0,31}:[a-z0-9][a-z0-9._-]{0,63}$/.test(x);
 const int=(x,a,b)=>Number.isSafeInteger(x)&&x>=a&&x<=b;
 const allowed=['physicalAttack','magicalAttack','mitigation','accuracy','actionEfficiency','staminaRegen','manaRegen','movementMultiplier'];
 if(!Array.isArray(definitions)||definitions.length>128)throw Error('invalid status list');
 const map=new Map();
 for(const d of definitions){
  if(!d||!id(d.id)||d.version!==1||!['fixture','content'].includes(d.scope)||!kinds.includes(d.kind)||map.has(d.id)||!int(d.durationMs,100,600000)||!['refresh','stack','replace'].includes(d.stacking)||!int(d.maxStacks,1,8)||(d.stacking!=='stack'&&d.maxStacks!==1)||!families.includes(d.resistanceFamily)||!['damage','heal','resource','none'].includes(d.tickKind)||!int(d.tickAmount,0,1000000)||!int(d.tickMs,0,600000)||(d.tickKind==='none'?(d.tickMs!==0||d.tickAmount!==0):(d.tickMs<100||d.tickMs>d.durationMs||d.tickAmount===0))||!Array.isArray(d.modifiers)||d.modifiers.length>8)throw Error('invalid status definition');
  const seen=new Set(),mods=d.modifiers.map(m=>{
   if(!m||!allowed.includes(m.stat)||seen.has(m.stat)||!Number.isFinite(m.delta)||Math.abs(m.delta)>100000)throw Error('invalid status modifier');seen.add(m.stat);return Object.freeze({stat:m.stat,delta:m.delta});
  });
  if(d.tickKind==='resource'&&!['stamina','mana'].includes(d.resource)||d.tickKind!=='resource'&&d.resource!==null)throw Error('invalid resource effect');
  map.set(d.id,Object.freeze({id:d.id,version:1,scope:d.scope,kind:d.kind,durationMs:d.durationMs,stacking:d.stacking,maxStacks:d.maxStacks,resistanceFamily:d.resistanceFamily,tickKind:d.tickKind,tickAmount:d.tickAmount,tickMs:d.tickMs,resource:d.resource,modifiers:Object.freeze(mods)}));
 }
 return Object.freeze({get:id=>map.get(id)??null,list:()=>Object.freeze([...map.values()])});
}
export function createStatusSession({registry,worldEpoch,targetId,fixture}){
 const int=(x,a,b)=>Number.isSafeInteger(x)&&x>=a&&x<=b;
 const id=x=>typeof x==='string'&&/^[A-Za-z0-9:._-]{1,128}$/.test(x);
 if(!registry||typeof registry.get!=='function'||!int(worldEpoch,0,Number.MAX_SAFE_INTEGER)||!id(targetId)||typeof fixture!=='boolean')throw Error('invalid status session');
 let clock=0,highest=0,serial=0,closed=false;const effects=new Map();
 const ordered=()=>[...effects.values()].sort((a,b)=>a.key<b.key?-1:a.key>b.key?1:0);
 const snapshot=()=>Object.freeze({clock,highest,closed,effects:Object.freeze(ordered().map(e=>Object.freeze({id:e.d.id,sourceId:e.sourceId,instance:e.instance,stacks:e.stacks,expires:e.expires,next:e.next})))});
 const out=(ok,reason,events=[])=>Object.freeze({ok,reason,events:Object.freeze(events),snapshot:snapshot()});
 function apply(v){
  if(closed||!v||v.worldEpoch!==worldEpoch||v.targetId!==targetId||v.at!==clock||v.verified!==true||!id(v.sourceId)||!int(v.sequence,1,Number.MAX_SAFE_INTEGER)||v.sequence<=highest||!Number.isFinite(v.resistance)||v.resistance<0||v.resistance>1||clock>Number.MAX_SAFE_INTEGER-1200000)return out(false,'invalid-or-stale');
  const d=registry.get(v.effectId);if(!d||(d.scope==='fixture')!==fixture)return out(false,'unknown-or-wrong-scope');
  highest=v.sequence;
  const duration=Math.floor(d.durationMs*(1-v.resistance));if(duration<100)return out(false,'resisted');
  const key=d.id+'|'+v.sourceId,old=effects.get(key);
  if(!old&&effects.size>=32)return out(false,'capacity');
  if(old&&d.stacking!=='replace'){
   old.expires=Math.max(old.expires,clock+duration);
   if(d.stacking==='stack')old.stacks=Math.min(d.maxStacks,old.stacks+1);
  }else{
   if(serial===Number.MAX_SAFE_INTEGER)return out(false,'identity-limit');
   effects.set(key,{key,d,sourceId:v.sourceId,instance:++serial,stacks:1,expires:clock+duration,next:d.tickMs?clock+d.tickMs:null,tickIndex:0});
  }
  return out(true,'applied');
 }
 function advance(ms,{paused=false,alive=true,epoch=worldEpoch}={}){
  if(closed)return out(false,'closed');
  if(epoch!==worldEpoch||alive===false){closed=true;effects.clear();return out(true,'retired');}
  if(typeof paused!=='boolean'||alive!==true||!int(ms,0,1000)||clock>Number.MAX_SAFE_INTEGER-ms-600000)return out(false,'invalid-delta');
  if(paused)return out(true,'paused');
  const end=clock+ms,events=[];
  // At most 32 instances * 10 ticks plus 32 expirations in a 1000ms step.
  for(const e of ordered()){
   while(e.next!==null&&e.next<=end&&e.next<=e.expires){
    events.push(Object.freeze({type:'tick-proposal',worldEpoch,targetId,sourceId:e.sourceId,fixture,effectId:e.d.id,instance:e.instance,tickIndex:++e.tickIndex,at:e.next,kind:e.d.tickKind,resource:e.d.resource,family:e.d.resistanceFamily,amount:e.d.tickAmount*e.stacks}));
    e.next+=e.d.tickMs;
   }
   if(e.expires<=end){events.push(Object.freeze({type:'expired',effectId:e.d.id,sourceId:e.sourceId,instance:e.instance,at:e.expires}));effects.delete(e.key);}
  }
  events.sort((a,b)=>a.at-b.at||Number(a.type==='expired')-Number(b.type==='expired')||a.instance-b.instance);
  clock=end;return out(true,'advanced',events);
 }
 function modifiers(){
  return Object.freeze(ordered().flatMap(e=>e.d.modifiers.map((m,i)=>Object.freeze({id:'status:'+e.instance+':'+i,stat:m.stat,delta:m.delta*e.stacks}))));
 }
 return Object.freeze({snapshot,apply,advance,modifiers,close:()=>{closed=true;effects.clear();return snapshot()}});
}
