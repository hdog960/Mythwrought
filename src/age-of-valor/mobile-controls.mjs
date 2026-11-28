// AV14 detached intent ownership and read-only HUD projection; no DOM or movement writes.
export function createMobileCombatInput({worldEpoch,readContext,holdMs=350,maxHoldMs=3000}){
 const int=(n,a,b)=>Number.isSafeInteger(n)&&n>=a&&n<=b;
 if(!int(worldEpoch,0,Number.MAX_SAFE_INTEGER)||typeof readContext!=='function'||!int(holdMs,100,2000)||!int(maxHoldMs,holdMs,10000))throw Error('invalid input policy');
 const actions=new Set(['attack','block','parry','dodge','target','next-target','previous-target','ability']);
 let mode='exploration',pending=null,clock=0,generation=0,capture=0,seq=0,retired=false,busy=false;const pointers=new Map();
 const snapshot=()=>Object.freeze({mode,pending,clock,generation,retired,pointers:Object.freeze([...pointers].map(([id,p])=>Object.freeze({id,zone:p.zone,started:p.started,captureToken:p.token})))});
 const result=(handled,intents=[])=>Object.freeze({handled,intents:Object.freeze(intents),snapshot:snapshot()});
 function intent(kind,extra={}){if(seq>=Number.MAX_SAFE_INTEGER)throw Error('input sequence exhausted');return Object.freeze({version:1,kind,worldEpoch,generation,sequence:++seq,at:clock,...extra});}
 function clear(reason){pointers.clear();pending=null;generation++;return [intent('cancel-combat-input',{reason})];}
 function gate(){
  let c;try{c=readContext();}catch{}
  if(!c||c.worldEpoch!==worldEpoch||c.alive!==true){retired=true;return false;}
  return c.playable===true&&c.landscape===true&&c.creative===false&&c.mounted===false&&c.readOnly===false&&c.overlay===false&&c.graphicsLost===false;
 }
 function dispatch(e){
  if(retired||busy||!e||typeof e.type!=='string')return result(false);
  busy=true;try{
   const lifecycle=['blur','hidden','orientationchange','pointercancelall','contextlost','overlay-open','worldchange','death','pagehide'];
   if(lifecycle.includes(e.type)){const active=mode==='combat'||pending!==null||pointers.size>0;if(['worldchange','death'].includes(e.type))retired=true;mode='exploration';return result(active,active?clear(e.type):[]);}
   if(!gate()){const active=mode==='combat'||pending!==null||pointers.size>0;mode='exploration';return result(active,active?clear('context-blocked'):[]);}
   if(!int(e.at,clock,Number.MAX_SAFE_INTEGER))return result(false);
   clock=e.at;
   if(e.type==='mode'){if(!['exploration','combat'].includes(e.mode)||mode===e.mode&&!pending)return result(false);const events=clear('mode-change');mode='exploration';pending=e.mode;return result(true,[...events,intent('mode-request',{mode:pending})]);}
   if(e.type==='mode-ack'){if(!pending||e.generation!==generation||e.mode!==pending)return result(false);let c;try{c=readContext();}catch{}if(c?.worldEpoch!==worldEpoch||c.combatMode!==(pending==='combat'))return result(false);mode=pending;pending=null;return result(true);}
   if(mode!=='combat'||pending)return result(false);
   if(readContext()?.combatMode!==true){mode='exploration';return result(true,clear('host-mode-lost'));}
   if(!int(e.id,0,Number.MAX_SAFE_INTEGER))return result(false);
   if(e.type==='pointerdown'){
    if(e.existingOwner!==false||!actions.has(e.zone)||pointers.has(e.id)||[...pointers.values()].some(p=>p.zone===e.zone)||pointers.size>=8)return result(false);
    if(e.zone==='ability'&&(typeof e.abilityId!=='string'||!/^[a-z][a-z0-9_-]{0,31}:[a-z0-9][a-z0-9._-]{0,63}$/.test(e.abilityId)))return result(false);
    let direction=null;if(e.zone==='dodge'){if(!Array.isArray(e.direction)||e.direction.length!==2||e.direction.some(x=>!Number.isFinite(x)||Math.abs(x)>1)||Math.abs(Math.hypot(...e.direction)-1)>.001)return result(false);direction=Object.freeze([...e.direction]);}
    const p={zone:e.zone,started:clock,token:++capture,abilityId:e.abilityId};pointers.set(e.id,p);
    const kinds={block:'block-start',parry:'parry-request',dodge:'dodge-request',target:'target-toggle','next-target':'target-next','previous-target':'target-previous',ability:'ability-start'};
    return result(true,kinds[e.zone]?[intent(kinds[e.zone],{pointerId:e.id,...(direction?{direction}:{}),...(e.zone==='ability'?{abilityId:e.abilityId}:{})})]:[]);
   }
   if(!['pointerup','pointercancel','lostpointercapture'].includes(e.type))return result(false);
   const p=pointers.get(e.id);if(!p||e.captureToken!==p.token)return result(false);
   pointers.delete(e.id);
   if(e.type!=='pointerup')return result(true,[intent('cancel-pointer',{pointerId:e.id,zone:p.zone})]);
   const held=clock-p.started;
   if(p.zone==='attack')return result(true,held>maxHoldMs?[intent('cancel-pointer',{pointerId:e.id,zone:p.zone})]:[intent(held>=holdMs?'heavy-request':'light-request',{pointerId:e.id,heldMs:held})]);
   if(p.zone==='block')return result(true,[intent('block-release',{pointerId:e.id})]);
   if(p.zone==='ability')return result(true,[intent('ability-release',{pointerId:e.id,abilityId:p.abilityId})]);
   return result(true);
  }finally{busy=false;}
 }
 return Object.freeze({dispatch,snapshot});
}
export function projectCombatHud({health,resources,mode,clock,ability,target,status}){
 const ratio=(current,max)=>{if(!Number.isFinite(current)||!Number.isFinite(max)||max<=0||current<0||current>max)throw Error('invalid HUD authority');return Object.freeze({current,max,fraction:current/max});};
 if(!['exploration','combat'].includes(mode)||!Number.isSafeInteger(clock)||clock<0||!health||!resources||!Array.isArray(status)||status.length>32)throw Error('invalid HUD snapshot');
 const bars=Object.freeze({health:ratio(health.current,health.max),stamina:ratio(resources.stamina,resources.maxStamina),mana:ratio(resources.mana,resources.maxMana)});
 const effects=Object.freeze(status.map(e=>{if(typeof e.id!=='string'||!Number.isSafeInteger(e.stacks)||e.stacks<1||e.stacks>8||!Number.isSafeInteger(e.expires)||e.expires<clock)throw Error('invalid HUD status');return Object.freeze({id:e.id,stacks:e.stacks,remainingMs:e.expires-clock});}));
 const cd=Object.entries(ability?.cooldowns??{});if(cd.length>128||cd.some(([k,v])=>typeof k!=='string'||!Number.isSafeInteger(v)||v<0))throw Error('invalid HUD cooldowns');
 const locked=target?.visible===true&&typeof target.targetId==='string'?Object.freeze({id:target.targetId,health:target.health?ratio(target.health.current,target.health.max):null,boss:target.boss===true}):null;
 return Object.freeze({version:1,mode,bars,target:locked,effects,cooldowns:Object.freeze(cd.map(([id,at])=>Object.freeze({id,remainingMs:Math.max(0,at-clock)})))});
}
