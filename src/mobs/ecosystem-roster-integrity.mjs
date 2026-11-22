// Isolated, read-only original MobEngine.all() snapshot integrity boundary.
// Bounded to the original engine's 128-entity maximum. This does not mutate
// any engine, world, save, or spawn state and does not infer hidden away data.
const certificates=new WeakSet();
const MAX_ORIGINAL_ENGINE_ENTITIES=128;
const scalars=Object.freeze([
  'id','species','yaw','state','health','grounded','homeChunk',
  'important','juvenile','motionMode'
]);
const vectors=Object.freeze(['position','velocity','origin']);

function copySnapshot(entity){
  if(!entity||typeof entity.id!=='string'||!entity.id||
     !entity.species||typeof entity.species.id!=='string')
    throw new TypeError('Invalid original MobEngine snapshot identity');
  const result={};
  for(const field of scalars){
    if(!(field in entity))
      throw new TypeError('Incomplete original MobEngine snapshot');
    result[field]=entity[field];
  }
  for(const field of vectors){
    const vector=entity[field];
    if(!Array.isArray(vector)||vector.length!==3||
       !vector.every(Number.isFinite))
      throw new TypeError('Invalid original MobEngine position or motion');
    result[field]=Object.freeze([...vector]);
  }
  return Object.freeze(result);
}

function checkedRoster(entities){
  if(!Array.isArray(entities)||entities.length>MAX_ORIGINAL_ENGINE_ENTITIES)
    throw new TypeError('Invalid original MobEngine roster size');
  const ids=new Set();
  return Object.freeze(entities.map(entity=>{
    const snapshot=copySnapshot(entity);
    if(ids.has(snapshot.id))
      throw new TypeError('Duplicate original MobEngine identity');
    ids.add(snapshot.id);
    return snapshot;
  }));
}

export function captureOriginalMobRoster(entities){
  const ticket=Object.freeze({entries:checkedRoster(entities)});
  certificates.add(ticket);
  return ticket;
}

export function assertOriginalMobRosterUnchanged(ticket,after){
  if(!ticket||!certificates.has(ticket))
    throw new TypeError('Uncertified original mob roster snapshot');
  const current=checkedRoster(after),before=ticket.entries;
  if(before.length!==current.length)
    throw new TypeError('Original MobEngine roster changed during inspection');
  for(let i=0;i<before.length;i++){
    for(const field of scalars){
      if(!Object.is(before[i][field],current[i][field]))
        throw new TypeError('Original MobEngine roster changed during inspection');
    }
    for(const field of vectors){
      if(before[i][field].some((v,j)=>!Object.is(v,current[i][field][j])))
        throw new TypeError('Original MobEngine roster changed during inspection');
    }
  }
  return true;
}
