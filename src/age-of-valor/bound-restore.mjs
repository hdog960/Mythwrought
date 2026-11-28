// AV15 version3 owner-bound data; no storage writes or live authorization.
export function canonicalCombatDefinition(value){
 let count=0;
 function visit(v,depth){if(++count>20000||depth>16)throw Error('definition limit');if(v===null||typeof v==='boolean'||typeof v==='string')return v;if(typeof v==='number'&&Number.isFinite(v))return v;if(Array.isArray(v))return v.map(x=>visit(x,depth+1));if(!v||typeof v!=='object'||Object.getPrototypeOf(v)!==Object.prototype)throw Error('invalid definition');const pairs=Object.keys(v).sort().map(k=>[k,visit(v[k],depth+1)]);return Object.fromEntries(pairs);}
 const raw=JSON.stringify(visit(value,0));if(raw.length>1048576)throw Error('definition too large');return raw;
}
export async function combatDefinitionDigest(config,digest){
 if(typeof digest!=='function')throw Error('trusted SHA256 missing');
 const result=await digest(canonicalCombatDefinition(config));if(typeof result!=='string'||!/^sha256:[a-f0-9]{64}$/.test(result))throw Error('invalid SHA256');return result;
}
export async function bindCombatRestore({identity,revision,config,digest,ledger,status,ability,settings,quiescent,makeEnvelope}){
 if(quiescent!==true||typeof makeEnvelope!=='function')throw Error('not quiescent');
 const r=ledger.snapshot(),s=status.snapshot(),a=ability.snapshot();
 if(r.closed||s.closed||a.closed||a.active||r.clock!==s.clock||r.clock!==a.clock)throw Error('nonquiescent clocks');
 const saved={stamina:r.stamina,mana:r.mana,maxStamina:r.maxStamina,maxMana:r.maxMana};
 const core=makeEnvelope({identity,revision,definitionVersion:'bound:v3',resource:ledger.checkpoint(),status:status.checkpoint(),ability:ability.checkpoint(),settings,quiescent:true});
 const definitionDigest=await combatDefinitionDigest(config,digest);
 if(ledger.snapshot().revision!==r.revision||status.snapshot().clock!==s.clock||status.snapshot().highest!==s.highest||ability.snapshot().clock!==a.clock||ability.snapshot().highest!==a.highest)throw Error('changed while hashing');
 return Object.freeze({version:3,definitionDigest,core,balances:Object.freeze(saved)});
}
export async function restoreBoundCombat({record,identity,config,digest,minimumRevision=0,restoreParts,options}){
 try{
  if(record==null)return Object.freeze({status:'legacy-absent'});
  if(record.version!==3||!record.core||record.core.revision<minimumRevision||record.definitionDigest!==await combatDefinitionDigest(config,digest)||typeof restoreParts!=='function')throw Error('invalid version/digest/revision');
  const b=record.balances,m=options.resourceOptions.maximum;
  if(!b||![b.stamina,b.mana,b.maxStamina,b.maxMana].every(Number.isSafeInteger)||b.maxStamina!==m.stamina||b.maxMana!==m.mana||b.stamina<0||b.mana<0||b.stamina>b.maxStamina||b.mana>b.maxMana)throw Error('invalid balances');
  return restoreParts({...options,record:record.core,identity,definitionVersion:'bound:v3',resourceOptions:{...options.resourceOptions,initial:{stamina:b.stamina,mana:b.mana}}});
 }catch{return Object.freeze({status:'blocked'});}
}
export async function migrateCombatV1({record,identity,config,digest,decode,makeEnvelope,ownerApprovedFreshEpoch}){
 if(ownerApprovedFreshEpoch!==true)throw Error('owner approval required');
 const v=decode(record,identity);if(v.status!=='restored-data')throw Error('invalid historical record');
 const x=v.record;
 const core=makeEnvelope({identity,revision:x.revision,definitionVersion:'bound:v3',quiescent:true,settings:x.settings,resource:{version:1,highest:0,revision:0,remainingDelay:{stamina:0,mana:0},remainder:{stamina:0,mana:0}},status:{version:1,targetId:identity.sourceId,fixture:false,highest:0,serial:0,effects:[]},ability:{version:1,highest:0,cooldowns:x.cooldowns}});
 return Object.freeze({version:3,definitionDigest:await combatDefinitionDigest(config,digest),core,balances:x.resources});
}
