/** :12 opt-in evidence boundary. Never imports producer branches or registers objects. */
import {createHash} from 'node:crypto';
export const blobId = text => {const b=Buffer.from(text,'utf8');return createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex');};
const owners={scene48:'src/nonblock-scene48/',environments24:'src/nonblock-environments24/',fittings36:'src/nonblock-fittings36/'};
const sha=/^[a-f0-9]{40}$/;
export function auditAuthenticatedBoundary({sources,objects,callbacks}={}) {
 const errors=[], fingerprints=new Set(), keys=new Set(), anchors=new Map();
 for(const [owner,prefix] of Object.entries(owners)){
  const p=sources?.[owner];
  if(!p||!sha.test(p.head||'')||!Array.isArray(p.files)||!p.files.length){errors.push(owner+':missing-source');continue;}
  for(const f of p.files){
   if(typeof f.path!=='string'||!f.path.startsWith(prefix)||f.path.includes('..')||typeof f.text!=='string'||!sha.test(f.blob||'')||blobId(f.text)!==f.blob)errors.push(owner+':unauthenticated-file');
   const identity=owner+':'+f.path;
   if(fingerprints.has(identity))errors.push(owner+':duplicate-file');
   fingerprints.add(identity);
  }
 }
 if(!Array.isArray(objects)||!objects.length)errors.push('missing-objects');
 else for(const o of objects){
  if(!o||!owners[o.owner]||typeof o.key!=='string'||!o.key.includes(':')||keys.has(o.key)){errors.push('invalid-or-duplicate-key');continue;}
  keys.add(o.key);
  if(o.numericBlockId!==undefined||o.defaultSpawn===true||o.pickable!==true||o.breakable!==true||o.removable!==true||o.tombstoneKey!==o.key)errors.push(o.key+':not-individually-removable');
  if(!Array.isArray(o.anchor)||o.anchor.length!==3||!o.anchor.every(Number.isSafeInteger)||!Number.isSafeInteger(o.seed))errors.push(o.key+':invalid-anchor');
  else {
   const location=o.seed+':'+o.anchor.join(',');
   const previous=anchors.get(location);
   if(previous&&!o.explicitSharedAnchor)errors.push(o.key+':overlapping-anchor:'+previous);
   anchors.set(location,o.key);
  }
  const b=o.selectionAabb;
  if(!Array.isArray(b)||b.length!==6||!b.every(Number.isFinite)||b.some((v,i)=>i<3&&v>=b[i+3]))errors.push(o.key+':invalid-aabb');
  if(o.protectedEdit||o.worldSeedMismatch)errors.push(o.key+':protected-world-edit');
  if(o.kind==='fx'&&!o.ambient&&!(o.parentKey&&o.parentRemovalAware))errors.push(o.key+':orphan-fx');
 }
 for(const method of ['pick','remove','snapshot','restore'])if(typeof callbacks?.[method]!=='function')errors.push('missing-real-hook:'+method);
 // An injected callback is not proof that :00 owns it or that schema-1 reloads correctly.
 return {ok:errors.length===0,errors,fixtureOnly:true,live:false,breakabilityReady:false,real00Verified:false};
}
