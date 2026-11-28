// AV15 owner-confirmed lifecycle and detached versioned data codec; no storage writes.
export function createCombatLifecycle({identity,readOwner,retireSession,requestRespawn,createSession}){
 const keys=['worldId','profileId','sourceId'];
 if(!identity||!keys.every(k=>typeof identity[k]==='string'&&identity[k].length>0&&identity[k].length<=128)||!Number.isSafeInteger(identity.worldEpoch)||typeof identity.fixture!=='boolean'||![readOwner,retireSession,requestRespawn,createSession].every(f=>typeof f==='function'))throw Error('invalid lifecycle');
 const scope=Object.freeze({...identity});let phase='alive',revision=-1,deathRevision=null,busy=false;
 const snapshot=()=>Object.freeze({phase,revision,deathRevision});
 function observe(){
  if(busy||phase==='retired'||phase==='uncertain')return snapshot();
  busy=true;try{const v=readOwner();if(!v||!keys.every(k=>v[k]===scope[k])||v.worldEpoch!==scope.worldEpoch||v.fixture!==scope.fixture){phase='retired';retireSession();return snapshot();}if(!Number.isSafeInteger(v.revision)||v.revision<revision||typeof v.alive!=='boolean')throw Error('invalid health owner');revision=v.revision;if(!v.alive&&phase==='alive'){phase='dead';deathRevision=revision;retireSession();}else if(v.alive&&phase==='dead')throw Error('unacknowledged respawn');return snapshot();}catch{phase='uncertain';return snapshot();}finally{busy=false;}
 }
 function respawn(){
  if(busy||phase!=='dead')return snapshot();busy=true;
  try{phase='respawn-requested';const q=Object.freeze({...scope,deathRevision});const v=requestRespawn(q);if(!v||!keys.every(k=>v[k]===scope[k])||v.worldEpoch!==scope.worldEpoch||v.fixture!==scope.fixture||v.deathRevision!==deathRevision||v.accepted!==true||v.alive!==true||v.safePlacement!==true||!Number.isSafeInteger(v.revision)||v.revision<=deathRevision)throw Error('unconfirmed respawn');const owner=readOwner();if(!owner||!keys.every(k=>owner[k]===scope[k])||owner.worldEpoch!==scope.worldEpoch||owner.fixture!==scope.fixture||owner.revision!==v.revision||owner.alive!==true)throw Error('owner mismatch');if(createSession(v)!==true)throw Error('session activation failed');revision=v.revision;phase='alive';deathRevision=null;return snapshot();}catch{phase='uncertain';return snapshot();}finally{busy=false;}
 }
 return Object.freeze({observe,respawn,snapshot});
}
export function encodeCombatSave({identity,revision,resources,clock,cooldowns,settings}){
 const int=(x,a,b)=>Number.isSafeInteger(x)&&x>=a&&x<=b,id=x=>typeof x==='string'&&/^[A-Za-z0-9:._-]{1,128}$/.test(x);
 if(!identity||!['worldId','profileId','sourceId'].every(k=>id(identity[k]))||identity.fixture!==false||!int(revision,0,Number.MAX_SAFE_INTEGER)||!int(clock,0,Number.MAX_SAFE_INTEGER)||!resources||!int(resources.stamina,0,100000000)||!int(resources.mana,0,100000000)||!int(resources.maxStamina,1,100000000)||!int(resources.maxMana,1,100000000)||resources.stamina>resources.maxStamina||resources.mana>resources.maxMana||!settings||!int(settings.holdMs,100,2000)||typeof settings.leftHanded!=='boolean'||!cooldowns||typeof cooldowns!=='object')throw Error('invalid combat save');
 const cd=Object.entries(cooldowns).sort(([a],[b])=>a<b?-1:a>b?1:0);if(cd.length>128||cd.some(([k,v])=>!id(k)||!int(v,0,Number.MAX_SAFE_INTEGER)||Math.max(0,v-clock)>600000))throw Error('invalid cooldown');
 return Object.freeze({version:1,worldId:identity.worldId,profileId:identity.profileId,sourceId:identity.sourceId,revision,resources:Object.freeze({stamina:resources.stamina,mana:resources.mana,maxStamina:resources.maxStamina,maxMana:resources.maxMana}),cooldowns:Object.freeze(cd.filter(([,v])=>v>clock).map(([id,v])=>Object.freeze({id,remainingMs:v-clock}))),settings:Object.freeze({holdMs:settings.holdMs,leftHanded:settings.leftHanded})});
}
export function decodeCombatSave(record,identity){
 if(record===null||record===undefined)return Object.freeze({status:'legacy-absent',record:null});
 if(!record||record.version!==1||!identity||identity.fixture!==false||!['worldId','profileId','sourceId'].every(k=>record[k]===identity[k]))return Object.freeze({status:'blocked',record:null});
 try{if(Object.keys(record).sort().join(',')!=='cooldowns,profileId,resources,revision,settings,sourceId,version,worldId'||!Array.isArray(record.cooldowns)||record.cooldowns.length>128||new Set(record.cooldowns.map(x=>x.id)).size!==record.cooldowns.length)throw Error('invalid record');
 const normalized=encodeCombatSave({identity,revision:record.revision,resources:record.resources,clock:0,cooldowns:Object.fromEntries(record.cooldowns.map(x=>{if(!Number.isSafeInteger(x.remainingMs)||x.remainingMs<1||x.remainingMs>600000)throw Error('invalid duration');return[x.id,x.remainingMs]})),settings:record.settings});
 return Object.freeze({status:'restored-data',record:normalized});}catch{return Object.freeze({status:'blocked',record:null});}
}
