/** :12 opt-in key/rotation preflight. No production imports or registration. */
export function auditKeyBijection({objects, encode, decode, save, reload, remove}) {
  const errors=[];
  if (!Array.isArray(objects) || !objects.length) errors.push('objects-required');
  for(const [name,fn] of Object.entries({encode,decode,save,reload,remove})) if(typeof fn!=='function') errors.push(`missing-${name}`);
  if(errors.length) return {ok:false,errors,live:false};
  const seen=new Set(), keys=new Map();
  for(const obj of objects){
    if(!obj || typeof obj.id!=='string' || !obj.id.includes(':') || !Number.isInteger(obj.orientation) || obj.orientation<0 || obj.orientation>3 || typeof obj.seed!=='string' || !obj.seed) {errors.push('invalid-descriptor');continue;}
    const key=encode(obj);
    if(typeof key!=='string'||!key.includes(':')) {errors.push(`invalid-key:${obj.id}`);continue;}
    if(seen.has(key)) errors.push(`duplicate-key:${key}`);
    seen.add(key);
    const back=decode(key);
    if(!back || back.id!==obj.id || back.seed!==obj.seed || back.orientation!==obj.orientation) errors.push(`nonbijective:${obj.id}`);
    keys.set(obj,key);
  }
  if(errors.length) return {ok:false,errors,live:false};
  // Injected fixture callbacks only. Never claims actual schema-1.
  const before=save(objects);
  if(!before || typeof before!=='object') return {ok:false,errors:['invalid-snapshot'],live:false};
  const victim=objects[0], victimKey=keys.get(victim);
  const after=remove(before,victimKey);
  if(!after || typeof after!=='object') return {ok:false,errors:['invalid-removal'],live:false};
  const restored=reload(after);
  if(!Array.isArray(restored)) return {ok:false,errors:['invalid-reload'],live:false};
  const active=new Set(restored.map(o=>encode(o)));
  if(active.has(victimKey)) errors.push('removed-object-respawned');
  for(const obj of objects.slice(1)) if(!active.has(keys.get(obj))) errors.push(`neighbor-lost:${obj.id}`);
  return {ok:errors.length===0,errors,live:false,breakabilityReady:false,fixtureOnly:true};
}