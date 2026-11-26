import test from 'node:test';
import assert from 'node:assert/strict';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {prepareP0MixedGroup,p0MixedAuditEnvelope} from '../src/manual-biomes/forgotten-sands-mixed-mesh-audit.mjs';
const root=process.env.P0_CURRENT_SOURCE;if(!root)throw Error('Exact current source checkout required');
const load=p=>import(pathToFileURL(resolve(root,p)).href);
const H=await load('src/world-height.mjs'),N=await load('src/world-height-natural-contract.mjs'),
 B=await load('src/world-height-budget.mjs'),S=await load('src/world-height-stream.mjs'),
 V=await load('src/voxel.mjs'),P=await load('src/manual-biomes/profile-world.mjs'),
 W=await load('src/world-height-profile-world.mjs');
test('actual shared height source registry and current M8 mesh/stream budget on detached real monument geometry',()=>{
 assert.equal(H.PHYSICAL_MAX_Y,256);assert.equal(H.LEGACY_GENERATION_MAX_Y,19);assert.equal(H.UPPER_SECTION_COUNT,15);
 assert.equal(B.UPPER_GPU_OWNERS,8);assert.equal(B.UPPER_SECTION_BYTES,884736);
 for(const index of [1,3]){
  const {world,spec,group}=prepareP0MixedGroup(index),env=p0MixedAuditEnvelope(spec);
  const current=new P.FourRegionWorld(spec.seed,P.fourRegionProfile(spec.seed,P.M8_MOUNTAIN_GENERATOR)),before=JSON.stringify(current.save());
  const identity={kind:'mythwrought-upper-source-profile',version:1,seed:spec.seed,generator:'mythwrought-upper-forgotten-sands-research-v1',sourceVersion:'original-m7-detached-mixed-v1'};
  const occupied=new Set();let upperCells=0,lowerCells=0;
  for(let x=env.minX;x<=env.maxX;x++)for(let z=env.minZ;z<=env.maxZ;z++){
   for(let y=-3;y<=19;y++){const old=world.get(x,y,z),actual=current.get(x,y,z);assert.equal(actual,old);if(group.view.get(x,y,z)!==old)lowerCells++;}
   for(let y=20;y<=46;y++)if(group.view.get(x,y,z)!==0){upperCells++;occupied.add(H.physicalRegionAt(x,y,z).key);}
  }
  const registry=N.createUpperNaturalRegistry();
  registry.register(identity.generator,identity.sourceVersion,p=>({seed:p.seed,generator:p.generator,sourceVersion:p.sourceVersion,
   get:(x,y,z)=>group.view.get(x,y,z),occupied:k=>occupied.has(k),revision:()=>0}));
  const provider=registry.open(identity);
  assert.throws(()=>registry.open({...identity,generator:P.M8_MOUNTAIN_GENERATOR}),/Unknown/);
  const upper=new W.VersionedUpperWorld(registry,identity);
  const first=env.coords.find(k=>k.s>0&&occupied.has(H.runtimeMeshKey(k.cx,k.cz,k.s)));assert.ok(first);
  let witness=null;
  for(let x=first.cx*16;x<first.cx*16+16&&!witness;x++)for(let z=first.cz*16;z<first.cz*16+16&&!witness;z++)
   for(let y=H.runtimeSectionBounds(first.s).minY;y<=H.runtimeSectionBounds(first.s).maxY;y++)if(provider.get(x,y,z)!==0){witness=[x,y,z];break;}
  assert.ok(witness);assert.equal(upper.get(...witness),provider.get(...witness));
  assert.equal(upper.set(...witness,0),true);const re=W.VersionedUpperWorld.restorePortable(registry,upper.portable());assert.equal(re.get(...witness),0);
  assert.equal(provider.get(...witness)>0,true);
  const view={seed:spec.seed,base:current,generationProfile:current.generationProfile,edits:current.edits,rotationAt:(...a)=>current.rotationAt(...a),
   get:(x,y,z)=>y>=20?provider.get(x,y,z):group.view.get(x,y,z),upperNaturalOccupied:k=>provider.occupied(k)};
  let meshes=0,peakSection=0;const meshBytes=new Map();
  for(const k of env.coords.filter(k=>k.s>0)){
   const key=H.runtimeMeshKey(k.cx,k.cz,k.s),v=V.meshChunk(view,k.cx,k.cz,k.s),bytes=B.validateUpperSectionGeometry(v,new Float32Array(0));
   assert.ok(v.every(Number.isFinite));assert.equal(v.length%27,0);meshBytes.set(key,bytes);meshes++;peakSection=Math.max(peakSection,bytes);
  }
  // Actual stream planner sees candidate occupancy through detached facade.
  // A spare slot is not presumed. Current renderer must admit far allocation
  // separately, including all other owners, before any production port.
  const mid=spec.modules[1],plans=[];
  for(const distance of [48,40,32,25,16]){
   const x=mid.x-distance,z=mid.z,cx=Math.floor(x/16),cz=Math.floor(z/16),legacy=[];
   for(let a=cx-2;a<=cx+2;a++)for(let b=cz-2;b<=cz+2;b++)legacy.push({cx:a,cz:b,section:0});
   const selected=S.planHeightStream({base:view,edits:current.edits},{x,feet:15,z},legacy);
   assert.ok(selected.length<=25);const nonempty=selected.filter(k=>k.section>0&&occupied.has(H.runtimeMeshKey(k.cx,k.cz,k.section))).length;assert.ok(nonempty<=8);
   plans.push({distance,owners:selected.length,nonempty,spareForFar:selected.length<25});
  }
  assert.equal(JSON.stringify(current.save()),before);assert.equal(group.publicationStatus().authorized,false);
  console.log('P0 SHARED HEIGHT',JSON.stringify({index,seed:spec.seed,upperCells,lowerCells,occupied:occupied.size,meshes,peakSection,plans,witness,physicalMax:H.PHYSICAL_MAX_Y,providerIdentity:identity.generator,placementAuthority:false}));
 }
});
