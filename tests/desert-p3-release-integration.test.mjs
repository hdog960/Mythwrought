// Release-composition test: actual original M7 game meshes compared with
// immutable accepted-gameplay source, not an independent mock renderer.
// Requires ../accepted checkout at 2bd0395d3ef163e9fdc491ab5119b1ee80844194.
import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,
 M7_ENVIRONMENT_GENERATOR as M7} from '../src/manual-biomes/profile-world.mjs';
import {meshChunk,BLOCK,chunkCoord} from '../src/voxel.mjs';
import {meshChunk as acceptedMesh} from '../../accepted/src/voxel.mjs';
import {desertSeamEditAffectedChunks} from '../src/manual-biomes/desert-seam-invalidation.mjs';
import {editAffectedChunks} from '../src/chunks.mjs';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
const originals=[{seed:179,cx:-50,cz:-111,x:-786,y:4,z:-1774,original:401},
 {seed:2026,cx:-178,cz:-49,x:-2848,y:7,z:-774,original:401}];
const excluded=[{seed:179,x:128,z:-2304,name:'snow'},
 {seed:179,x:-1536,z:-2304,name:'enchanted'},
 {seed:179,x:-2304,z:-2304,name:'plains'},
 {seed:179,x:512,z:-2304,name:'mountain'},
 {seed:179,x:40,z:64,name:'cave entrance'}];
function compare(a,b,{expectExact=false}={}){
 assert.equal(a.length,b.length);
 let warmVertices=0;
 for(let i=0;i<a.length;i+=9){
  for(const j of [0,1,2,6,7,8])
   assert.equal(b[i+j],a[i+j],
    'Release M7 may ONLY alter original RGB: XYZ UV material must be identical');
  const different=[3,4,5].some(j=>b[i+j]!==a[i+j]);
  if(different){
   warmVertices++;
   assert.ok(b[i+8]===40||b[i+8]===42,
    'Only original Desert hardpan 40 or scree 42 may receive bilateral RGB');
  }
 }
 if(expectExact)assert.equal(warmVertices,0,
  'Unrelated original climate/cave must stay bit-identical to accepted gameplay');
 return warmVertices;
}
test('combined release branch authentic Desert scene changes only permitted RGB with original geometry',()=>{
 const evidence=[];
 for(const loc of originals){
  const w=new FourRegionWorld(loc.seed,fourRegionProfile(loc.seed,M7));
  assert.equal(w.get(loc.x,loc.y,loc.z),loc.original);
  assert.equal(v6BiomeAt(loc.x,loc.z,loc.seed)?.name,'desert');
  let modifications=0,vertices=0;
  for(const [dx,dz] of [[0,0],[1,0],[-1,0],[0,1],[0,-1]]){
   const cx=loc.cx+dx,cz=loc.cz+dz;
   const original=acceptedMesh(w,cx,cz),candidate=meshChunk(w,cx,cz);
   modifications+=compare(original,candidate);
   vertices+=candidate.length/9;
  }
  assert.ok(modifications>0,'Real accepted-world Desert border requires actual bilateral color changes');
  assert.deepEqual(w.save().edits,[]);
  assert.ok(w.cachedBiomeColumns<=1024);
  evidence.push({seed:loc.seed,chunks:5,vertices,changedRGBVertices:modifications});
 }
 console.log('DESERT_RELEASE_ACCEPTED_M7_COLOR_DELTA '+JSON.stringify(evidence));
});
test('combined release branch excludes genuine Snow Enchanted Plains far Mountain and original cave chunks',()=>{
 let vertices=0,checked=0;
 for(const loc of excluded){
  const w=new FourRegionWorld(loc.seed,fourRegionProfile(loc.seed,M7));
  const cx=chunkCoord(loc.x),cz=chunkCoord(loc.z);
  if(loc.name!=='cave entrance')
   assert.equal(v6BiomeAt(loc.x,loc.z,loc.seed)?.name??'plains',loc.name==='mountain'?'mountain':loc.name);
  const a=acceptedMesh(w,cx,cz),b=meshChunk(w,cx,cz);
  compare(a,b,{expectExact:true});
  vertices+=a.length/9;checked++;
  assert.deepEqual(w.save().edits,[]);
 }
 console.log('DESERT_RELEASE_NON_DESERT_PARITY '+JSON.stringify({chunks:checked,vertices,allNineFloatFieldsIdentical:true}));
});
test('combined release uses original M7 source top edits to refresh previously stale adjacent RGB, not protected caves',()=>{
 const w=new FourRegionWorld(179,fourRegionProfile(179,M7));
 const x=-786,y=4,z=-1774,neighbor={cx:-50,cz:-112};
 assert.equal(w.get(x,y,z),401);
 const previous=editAffectedChunks(x,z);
 const next=desertSeamEditAffectedChunks(w,x,z,y);
 assert.ok(!previous.some(p=>p.cx===neighbor.cx&&p.cz===neighbor.cz));
 assert.ok(next.some(p=>p.cx===neighbor.cx&&p.cz===neighbor.cz));
 assert.ok(next.length<=5);
 const before=meshChunk(w,neighbor.cx,neighbor.cz);
 assert.ok(w.set(x,y,z,400));
 const after=meshChunk(w,neighbor.cx,neighbor.cz);
 assert.equal(before.length,after.length);
 let rgb=0;
 for(let i=0;i<before.length;i+=9){
  for(const j of [0,1,2,6,7,8])assert.equal(before[i+j],after[i+j]);
  if([3,4,5].some(j=>before[i+j]!==after[i+j]))rgb++;
 }
 assert.equal(rgb,6,'Reassembled production scene must preserve six real refreshed RGB vertices');
 assert.ok(w.set(x,y,z,401));
 assert.deepEqual(w.save().edits,[]);
 assert.deepEqual(meshChunk(w,neighbor.cx,neighbor.cz),before);
 // Real protected original source cave cell from validated 12 entrance set.
 const cave=[40,9,63],key=cave.join(',');
 assert.equal(w.get(...cave),BLOCK.AIR);
 assert.equal(w._columnPlan(cave[0],cave[2]).size,0);
 assert.deepEqual(desertSeamEditAffectedChunks(w,cave[0],cave[2],cave[1]),
  editAffectedChunks(cave[0],cave[2]));
 console.log('DESERT_RELEASE_EDIT_AND_CAVE '+JSON.stringify({boundary:[x,y,z],neighbor,
  rgbChanged:rgb,cave,protectedPlanEmpty:true,restoredSavedRows:0}));
});
