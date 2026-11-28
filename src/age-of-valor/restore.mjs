// Detached v2 restoration envelope. Trusted host must bind balances and configuration.
export function makeCombatRestoreEnvelope({identity,revision,definitionVersion,resource,status,ability,settings,quiescent}){
 const id=x=>typeof x==='string'&&/^[A-Za-z0-9:._-]{1,128}$/.test(x);
 if(!identity||!['worldId','profileId','sourceId'].every(k=>id(identity[k]))||identity.fixture!==false||!id(definitionVersion)||!Number.isSafeInteger(revision)||revision<0||quiescent!==true||resource?.version!==1||status?.version!==1||ability?.version!==1||status.targetId!==identity.sourceId||status.fixture!==false||!settings||typeof settings.leftHanded!=='boolean'||!Number.isSafeInteger(settings.holdMs)||settings.holdMs<100||settings.holdMs>2000)throw Error('invalid restore envelope');
 const data={version:2,worldId:identity.worldId,profileId:identity.profileId,sourceId:identity.sourceId,revision,definitionVersion,resource,status,ability,settings:{leftHanded:settings.leftHanded,holdMs:settings.holdMs}};
 const raw=JSON.stringify(data);if(raw.length>65536)throw Error('restore envelope too large');
 const freeze=x=>{if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;};
 return freeze(JSON.parse(raw));
}
export function restoreCombatParts({record,identity,definitionVersion,resourceOptions,makeLedger,makeStatus,makeAbility,statusOptions,abilityOptions}){
 if(record==null)return Object.freeze({status:'legacy-absent'});
 if(record.version!==2||!identity||identity.fixture!==false||record.definitionVersion!==definitionVersion||!['worldId','profileId','sourceId'].every(k=>record[k]===identity[k]))return Object.freeze({status:'blocked'});
 try{
  const clean=makeCombatRestoreEnvelope({...record,identity,quiescent:true});
  if(clean.status.targetId!==identity.sourceId||clean.status.fixture!==false||statusOptions.targetId!==identity.sourceId||statusOptions.fixture!==false||!['worldId','profileId','sourceId','fixture'].every(k=>abilityOptions.identity[k]===identity[k]))throw Error('scope mismatch');
  const ledger=makeLedger({...resourceOptions,restored:clean.resource});
  const status=makeStatus({...statusOptions,restored:clean.status});
  const ability=makeAbility({...abilityOptions,restored:clean.ability});
  return Object.freeze({status:'restored',revision:clean.revision,ledger,effects:status,ability,settings:clean.settings});
 }catch{return Object.freeze({status:'blocked'});}
}
