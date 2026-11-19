/** :12 opt-in cross-lane provenance and orientation gate; never registers or spawns objects. */
import {createHash} from 'node:crypto';
const owners=Object.freeze({scene48:'src/nonblock-scene48/',environments24:'src/nonblock-environments24/',fittings36:'src/nonblock-fittings36/'});
const hex=/^[0-9a-f]{40}$/;
export function gitBlob(text){const bytes=Buffer.from(text,'utf8');return createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');}
export function auditCrosslaneWitness({producers,instances,treeWitnesses,interaction}={}){
 const errors=[], seen=new Set(), locations=new Map();
 for(const [owner,prefix] of Object.entries(owners)){
  const p=producers?.[owner], w=treeWitnesses?.[owner];
  if(!p||!hex.test(p.head||'')||!Array.isArray(p.files)||!p.files.length){errors.push(owner+':missing-producer');continue;}
  if(!w||w.head!==p.head||w.independentlyVerified!==true){errors.push(owner+':tree-membership-unverified');continue;}
  const members=new Map((Array.isArray(w.files)?w.files:[]).map(f=>[f.path,f.blob]));
  for(const f of p.files){
   if(typeof f.path!=='string'||!f.path.startsWith(prefix)||f.path.includes('..')||typeof f.text!=='string'||!hex.test(f.blob||'')||gitBlob(f.text)!==f.blob||members.get(f.path)!==f.blob)errors.push(owner+':source-mismatch');
  }
 }
 if(!Array.isArray(instances)||!instances.length)errors.push('missing-instances');
 else for(const i of instances){
  if(!i||!owners[i.owner]||typeof i.key!=='string'||!i.key.includes(':')||seen.has(i.key)){errors.push('duplicate-or-invalid-key');continue;}
  seen.add(i.key);
  if(!Number.isSafeInteger(i.seed)||!Array.isArray(i.anchor)||i.anchor.length!==3||!i.anchor.every(Number.isSafeInteger))errors.push(i.key+':invalid-anchor');
  else {const loc=i.seed+':'+i.anchor.join(',');if(locations.has(loc)&&!i.explicitSharedAnchor)errors.push(i.key+':anchor-overlap');locations.set(loc,i.key);}
  if(i.numericBlockId!==undefined||i.defaultSpawn===true||i.pickable!==true||i.breakable!==true||i.removable!==true||i.tombstoneKey!==i.key)errors.push(i.key+':not-removable');
  for(const field of ['selectionAabb','collisionAabb']){
   const a=i[field];if(!Array.isArray(a)||a.length!==6||!a.every(Number.isFinite)||a.some((v,n)=>n<3&&v>=a[n+3]))errors.push(i.key+':invalid-'+field);
  }
  if(i.owner==='fittings36'){
   if(!Number.isInteger(i.rotation)||i.rotation<0||i.rotation>3||!i.key.endsWith(':r'+i.rotation)||i.tombstoneKey!==i.key)errors.push(i.key+':rotation-not-preserved');
  }
  if(i.protectedEdit||i.seedMismatch||i.worldEditMutation)errors.push(i.key+':protected-world-edit');
  if(i.kind==='fx'&&!i.ambient&&!(i.parentKey&&i.parentRemovalAware))errors.push(i.key+':orphan-fx');
  if(!Number.isInteger(i.triangles)||i.triangles<0||i.triangles>10000||!Number.isInteger(i.lod)||i.lod<0||i.lod>3||!Number.isInteger(i.batchCount)||i.batchCount<1||i.batchCount>64)errors.push(i.key+':unbounded-render-budget');
 }
 for(const name of ['pick','remove','snapshot','restore'])if(typeof interaction?.[name]!=='function')errors.push('missing-hook:'+name);
 return {ok:errors.length===0,errors,fixtureOnly:true,live:false,schema1Verified:false,real00Verified:false};
}
