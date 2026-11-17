// Candidate-only source-driven sample harness. Caller must independently pin source hashes.
const fail=reason=>Object.freeze({ok:false,status:'NOT_VERIFIED',reason,integrationVerified:false,browserVerified:false});
const safe=Number.isSafeInteger;
const point=p=>p&&[p.x,p.y,p.z].every(safe);
const key=p=>`${p.x},${p.y},${p.z}`;
/** surface(seed,x,z)->{height,blockId}; cave(seed,x,y,z)->{solid}; objects(seed,x,z)->[{id,anchor,footprint}].
 * sourceVerified is an externally established claim, not verified by this module.
 */
export function inspectProducerSamples({seed,columns,bounds,registry,surface,cave,objects,sourceVerified=false,maxSamples=128}={}) {
 if(!sourceVerified)return fail('producer-source-unverified');
 if(!safe(seed)||!safe(maxSamples)||maxSamples<1||!Array.isArray(columns)||!columns.length||columns.length>maxSamples)return fail('invalid-sample-plan');
 if(!bounds||!safe(bounds.minY)||!safe(bounds.maxY)||bounds.minY>=bounds.maxY)return fail('invalid-depth-bounds');
 if(!Array.isArray(registry)||!registry.length||registry.some(id=>!safe(id)||id<0)||new Set(registry).size!==registry.length)return fail('invalid-material-registry');
 if(![surface,cave,objects].every(fn=>typeof fn==='function'))return fail('missing-producer-api');
 const known=new Set(registry),seen=new Set(),samples=[];
 for(const c of columns){
  if(!c||!safe(c.x)||!safe(c.z))return fail('invalid-column');
  const k=`${c.x},${c.z}`;if(seen.has(k))return fail('duplicate-column');seen.add(k);
  let a,b;try{
   a=[surface(seed,c.x,c.z),cave(seed,c.x,bounds.minY,c.z),objects(seed,c.x,c.z)];
   b=[surface(seed,c.x,c.z),cave(seed,c.x,bounds.minY,c.z),objects(seed,c.x,c.z)];
  }catch{return fail('producer-exception')}
  if(JSON.stringify(a)!==JSON.stringify(b))return fail('nondeterministic-producer-output');
  const [s,deep,placed]=a;
  if(!s||!safe(s.height)||s.height<bounds.minY||s.height>bounds.maxY||!known.has(s.blockId))return fail('invalid-surface');
  if(!deep||typeof deep.solid!=='boolean')return fail('invalid-cave-cell');
  if(!Array.isArray(placed)||placed.length>64)return fail('invalid-object-list');
  const occupied=new Set(),ids=new Set();
  for(const obj of placed){
   if(!obj||typeof obj.id!=='string'||!/^[a-z][a-z0-9-]*:[a-z][a-z0-9-]*$/.test(obj.id)||ids.has(obj.id))return fail('invalid-object-identity');
   ids.add(obj.id);
   if(!point(obj.anchor)||obj.anchor.y<bounds.minY||obj.anchor.y>bounds.maxY||!Array.isArray(obj.footprint)||!obj.footprint.length||obj.footprint.length>256)return fail('invalid-object-footprint');
   for(const p of obj.footprint){
    if(!point(p)||p.y<bounds.minY||p.y>bounds.maxY)return fail('invalid-footprint-cell');
    const pk=key(p);if(occupied.has(pk))return fail('overlapping-object-footprints');occupied.add(pk);
    let cell;try{cell=cave(seed,p.x,p.y,p.z)}catch{return fail('producer-exception')}
    if(!cell||typeof cell.solid!=='boolean')return fail('invalid-cave-cell');
    if(cell.solid)return fail('object-intersects-cave-solid');
   }
  }
  samples.push(Object.freeze({column:k,height:s.height,objectCount:placed.length}));
 }
 return Object.freeze({ok:true,status:'SOURCE_SAMPLED_CONTRACT_ONLY',samples:Object.freeze(samples),integrationVerified:false,browserVerified:false,saveVerified:false});
}
