import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {BIOMES,SIZES,plannedSlots} from '../../../src/building-pool/roadmap-2a/catalog.mjs';
import {SCHEMA,validateBlueprint,assertDistinctArchitecture,structuralFingerprint} from '../../../src/building-pool/roadmap-2a/schema.mjs';
import {TEMPERATE_SMALL_GENERAL_STORE} from '../../../src/building-pool/roadmap-2a/temperate-store.mjs';
import {M1_GENERAL_STORES,M1_COUNTS,checkM1Architectures} from '../../../src/building-pool/roadmap-2a/m1-general-stores.mjs';
const manifest=JSON.parse(readFileSync(new URL('../../../src/building-pool/roadmap-2a/manifest.json',import.meta.url),'utf8'));
const byID=new Map(M1_GENERAL_STORES.map(x=>[x.id,x]));
const refs=new Map(manifest.legacyCandidates.map(x=>[x.id,x]));
const sha256=text=>createHash('sha256').update(text).digest('hex');
const occupied=bp=>new Map(bp.voxels.map(v=>[[v.x,v.y,v.z].join(','),v]));
test('exact 15 original store IDs, all biome-size combinations, ZERO temples or duplicate IDs',()=>{
 assert.deepEqual(M1_COUNTS,{total:15,stores:15});
 assert.equal(M1_GENERAL_STORES.length,15);
 assert.equal(byID.size,15);
 assert.equal(refs.size,15);
 assert.equal(byID.get('r2:general-store:temperate:small:01'),TEMPERATE_SMALL_GENERAL_STORE);
 for(const biome of BIOMES)for(const size of SIZES){const id=`r2:general-store:${biome}:${size}:01`;
  assert(byID.has(id),id);assert(plannedSlots().some(x=>x.id===id&&x.authoredHere),id);}
 assert(M1_GENERAL_STORES.every(bp=>bp.category==='general-store'&&!bp.id.includes(':temple:')));
});
test('all 15 full inherited coordinate blueprints match independently pinned source-PR SHA256 golden references',()=>{
 assert.equal(manifest.sourceHead,'07c45d27bd36f4f3aa3197bba0e4f49ce2a58c68');
 assert.equal(manifest.handAuthoredStoreBlob,'7211223b2cc51290b89f5f886c1cbb59cc495747');
 assert.equal(manifest.sourceModuleBlob,'4cc1ccc4cedfb927f510c6a85c8c4aa11290eccc');
 for(const bp of M1_GENERAL_STORES){
  const original=refs.get(bp.id);
  assert(original,bp.id);
  assert.equal(sha256(JSON.stringify(bp)),original.fullBlueprintSHA256,bp.id+' source parity');
  assert.equal(sha256(structuralFingerprint(bp)),original.geometryFingerprint,bp.id+' geometric parity');
  assert.equal(sha256(JSON.stringify(bp.openings.filter(o=>o.type==='window'))),original.windowRegistrySHA256,bp.id+' window ABI parity');
  assert.equal(sha256(JSON.stringify({rooms:bp.rooms,circulation:bp.circulation})),original.roomAndCirculationSHA256,bp.id+' room/circulation parity');
  assert.equal(bp.voxels.length,original.voxelCount,bp.id);
  assert.equal(bp.voxels.filter(v=>v.kind==='window').length,original.windowCount,bp.id);
  assert.equal(bp.openings.length,original.openingCount,bp.id);
  assert.equal(bp.rooms.length,original.roomCount,bp.id);
  assert.equal(bp.schema,SCHEMA,bp.id);
 }
});
test('all migrated buildings pass real native validator and match physical-cell window registry exactly',()=>{
 let count=0;
 for(const bp of M1_GENERAL_STORES){
  const result=validateBlueprint(bp);
  assert(result.valid&&result.uniqueCells===bp.voxels.length,bp.id);
  const cells=occupied(bp),listed=bp.openings.filter(o=>o.type==='window'),windowCells=bp.voxels.filter(v=>v.kind==='window');
  assert.equal(listed.length,windowCells.length,bp.id);
  for(const w of listed){const v=cells.get([w.x,w.y,w.z].join(','));assert(v?.kind==='window'&&v.material===w.material,bp.id);}
  assert(bp.rooms.some(r=>r.uses.includes('sales-floor'))&&bp.rooms.some(r=>r.uses.includes('storage')),bp.id);
  assert(bp.openings.some(o=>o.type==='entrance')&&bp.openings.some(o=>o.type==='internal-doorway'),bp.id);
  assert(bp.unresolvedDependencies.length>0&&!bp.worldPlaced&&!bp.numericIdsAssigned&&bp.isolated,bp.id);
  count+=listed.length;
 }
 assert.equal(count,184);
 assert.equal(TEMPERATE_SMALL_GENERAL_STORE.voxels.length,685);
 assert.equal(TEMPERATE_SMALL_GENERAL_STORE.voxels.filter(v=>v.kind==='window').length,16);
});
test('15 distinct source geometries under mirror/rotation normalization, not only palette recolors',()=>{
 assert.deepEqual(checkM1Architectures(),{authored:15,distinctArchitectures:15});
 assert.equal(new Set(M1_GENERAL_STORES.map(structuralFingerprint)).size,15);
});
test('negative geometry tests catch missing, duplicated and wrong-material windows, door obstruction and absent material dependencies',()=>{
 for(const bp of [M1_GENERAL_STORES[0],M1_GENERAL_STORES[7],M1_GENERAL_STORES[14]]){
  const w=bp.openings.find(o=>o.type==='window'),entry=bp.openings.find(o=>o.type==='entrance');
  assert.throws(()=>validateBlueprint({...bp,openings:bp.openings.filter(o=>o!==w)}),/unregistered physical window cells/);
  assert.throws(()=>validateBlueprint({...bp,openings:bp.openings.map(o=>o===w?{...o,material:'pack1:001'}:o)}),/window material mismatch/);
  assert.throws(()=>validateBlueprint({...bp,openings:[...bp.openings,{...w}]}),/duplicate window opening metadata/);
  assert.throws(()=>validateBlueprint({...bp,voxels:[...bp.voxels,{x:entry.x,y:entry.y,z:entry.z,kind:'wall',material:bp.voxels[0].material}]}),/blocked entrance/);
  assert.throws(()=>validateBlueprint({...bp,voxels:[...bp.voxels,bp.voxels[0]]}),/overlapping voxel/);
  const missing=bp.voxels[0].material;
  assert.throws(()=>validateBlueprint({...bp,unresolvedDependencies:bp.unresolvedDependencies.filter(d=>d.ref!==missing)}),/missing symbolic material dependency/);
 }
});
test('every storefront reaches the stockroom through a real three-cell-clear floor corridor',()=>{
 for(const bp of M1_GENERAL_STORES){
  const cells=occupied(bp),entry=bp.openings.find(o=>o.type==='entrance'),door=bp.openings.find(o=>o.type==='internal-doorway'&&!o.role);
  assert(door,bp.id);
  const floor=(x,z)=>cells.get([x,1,z].join(','))?.kind==='floor';
  const clear=(x,z)=>[2,3,4].every(y=>!cells.has([x,y,z].join(',')));
  const queue=[[entry.x,1]],seen=new Set();
  for(let i=0;i<queue.length;i++){
   const [x,z]=queue[i],key=x+','+z;
   if(seen.has(key)||x<1||z<1||x>=bp.extents.x-1||z>=bp.extents.z-1||!floor(x,z)||!clear(x,z))continue;
   seen.add(key);
   for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]])queue.push([x+dx,z+dz]);
  }
  assert(seen.has(door.x+','+(door.z+1)),bp.id+' inaccessible rear room');
 }
});
