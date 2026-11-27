// Isolated current-engine composite source fixture. This is NOT a production
// generator registration or a migration. Only the existing two surveyed
// groups are admitted; a normal-world procedural site policy is still needed.
import {prepareP0MixedGroup,p0MixedAuditEnvelope} from './forgotten-sands-mixed-mesh-audit.mjs';
export const P0_COMPOSITE_ID='mythwrought-forgotten-sands-composite-research-v1';
export const P0_CURRENT_BASE='7b04720b4d8d68209e7e47837fbc71e1d26a9b51';
const sha=async value=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(value)))),v=>v.toString(16).padStart(2,'0')).join('');
const key=(x,y,z)=>[x,y,z].join(',');
export async function openP0CompositeFixture(index,{P,H,N,reserved,revision}={}){
 if(![1,3].includes(index)||!P||!H||!N||typeof reserved!=='function'||typeof revision!=='function')throw Error('Invalid detached fixture authority');
 const epoch=revision();if(typeof epoch!=='string'||!epoch||epoch.length>256)throw Error('Invalid detached revision');
 const {world:historical,spec,group}=prepareP0MixedGroup(index),env=p0MixedAuditEnvelope(spec);
 const profile=P.fourRegionProfile(spec.seed,P.M8_MOUNTAIN_GENERATOR),base=new P.FourRegionWorld(spec.seed,profile);
 const lower=new Map(),upper=new Map(),occupied=new Set(),rows=[];
 for(let x=env.minX;x<=env.maxX;x++)for(let z=env.minZ;z<=env.maxZ;z++)for(let y=0;y<=46;y++){
  const original=historical.get(x,y,z),id=group.view.get(x,y,z);
  if(id===original)continue;
  if(original!==0||id===0||base.get(x,y,z)!==0||base.environmentCaves?.get(x,y,z)!==undefined||reserved(x,z)!==false||revision()!==epoch)throw Error('Current source or reservation veto');
  const map=y<20?lower:upper;map.set(key(x,y,z),id);rows.push([x,y,z,id]);
  if(y>=20)occupied.add(H.physicalRegionAt(x,y,z).key);
  if(rows.length>40000)throw Error('Composite fixture cell cap');
 }
 if(rows.length!==group.proposedCells||!group.snapshotCurrent())throw Error('Incomplete source proposal');
 const identity=Object.freeze({kind:P0_COMPOSITE_ID,version:1,base:P0_CURRENT_BASE,index,baseProfile:profile,revision:epoch,geometrySha:await sha(rows),cells:rows.length});
 const upperIdentity={kind:'mythwrought-upper-source-profile',version:1,seed:spec.seed,generator:'mythwrought-upper-forgotten-sands-composite-research-v1',sourceVersion:identity.geometrySha};
 const registry=N.createUpperNaturalRegistry();
 registry.register(upperIdentity.generator,upperIdentity.sourceVersion,p=>({seed:p.seed,generator:p.generator,sourceVersion:p.sourceVersion,
  get:(x,y,z)=>upper.get(key(x,y,z))??0,occupied:k=>occupied.has(k),revision:()=>0}));
 const provider=registry.open(upperIdentity);
 if(revision()!==epoch)throw Error('Stale fixture source');
 class Composite extends P.FourRegionWorld{
  constructor(){super(spec.seed,profile);}
  naturalAndLandmarkBlock(x,y,z){
   if(y>=20)return provider.get(x,y,z);
   return lower.get(key(x,y,z))??super.naturalAndLandmarkBlock(x,y,z);
  }
  upperNaturalOccupied(k){return provider.occupied(k);}
  get upperNaturalRevision(){return provider.revision();}
 }
 const fixture=new Composite();
 // Keep the composite identity external to the inherited M8 profile. Raw
 // schema-1 bytes are NOT valid standalone M8 save data for this fixture.
 const portable=()=>({identity,world:fixture.save()});
 const restore=payload=>{
  if(!payload||Object.keys(payload).sort().join(',')!=='identity,world'||JSON.stringify(payload.identity)!==JSON.stringify(identity)||revision()!==epoch)
   throw Error('Composite identity or revision mismatch');
  const w=payload.world;
  if(!w||w.schema!==1||w.seed!==spec.seed||!Array.isArray(w.edits)||w.edits.length>10000||Object.keys(w).some(k=>!['schema','seed','edits','rotations'].includes(k)))throw Error('Invalid composite fixture save');
  const out=new Composite(),seen=new Set(),rotations=new Map();
  for(const r of w.rotations??[]){
   if(!Array.isArray(r)||r.length!==4||!r.every(Number.isSafeInteger)||r[3]<1||r[3]>3||rotations.has(key(...r.slice(0,3))))throw Error('Invalid fixture rotation');
   rotations.set(key(...r.slice(0,3)),r[3]);
  }
  for(const r of w.edits){
   if(!Array.isArray(r)||r.length!==4||!r.every(Number.isSafeInteger))throw Error('Invalid fixture edit');
   const k=key(...r.slice(0,3));if(seen.has(k)||!out.set(...r,rotations.get(k)??0)||!out.edits.has(k))throw Error('Noncanonical fixture edit');
   seen.add(k);rotations.delete(k);
  }
  if(rotations.size||JSON.stringify(out.save())!==JSON.stringify(w))throw Error('Fixture save replay mismatch');
  return out;
 };
 return Object.freeze({world:fixture,identity,portable,restore,placementAuthority:false,
  witness:Object.freeze({lower:rows.find(r=>r[1]<20),upper:rows.find(r=>r[1]>=20)}),counts:Object.freeze({lower:lower.size,upper:upper.size,upperOwners:occupied.size})});
}
