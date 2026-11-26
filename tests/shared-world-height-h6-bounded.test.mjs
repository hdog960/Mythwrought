import test from 'node:test';import assert from 'node:assert/strict';
import {Pack5UpperIndex,pack5UpperRecord,buildPack5UpperSections} from '../src/pack5-integration/upper-sections.mjs';
import {PACK5_BUILDER_CATALOG,resolvePack5BuilderAsset} from '../src/pack5-integration/catalog.mjs';
import {orientedParts} from '../src/block-packs/pack-5/fixture.mjs';
import {createUpperNaturalRegistry} from '../src/world-height-natural-contract.mjs';
import {VersionedUpperWorld} from '../src/world-height-profile-world.mjs';
import {VoxelWorld,meshChunk} from '../src/voxel.mjs';
import {Pack2LiveWorld} from '../src/pack2-world.mjs';
import {upperOccupancy} from '../src/world-height.mjs';
test('incremental Pack5 index reconstructs touched owners and preserves exact source triangles',()=>{
 let a=new Pack5UpperIndex();
 const r1=[-16,255,-1,'pack5:082',0,null],r2=[48,256,48,'pack5:080',0,null];
 const u=a.withAdded(r1);assert.equal(a.size,0);assert.equal(u.affected.size,2);
 const v=u.index.withAdded(r2);assert.equal(v.affected.size,1);assert.equal(v.index.rowCount,2);
 for(const [k,m] of pack5UpperRecord(r1))assert.deepEqual(v.index.get(k),m);
 const cold=buildPack5UpperSections([r2,r1]);for(const k of v.index.keys())assert.deepEqual(cold.get(k),v.index.get(k));
 const removed=v.index.withRemoved(r1);assert.equal(removed.affected.size,2);assert.equal(removed.index.rowCount,1);
 assert.equal(v.index.rowCount,2);assert.equal(removed.index.size,1);
});
test('all original Pack5 variant rotations audit the historical boundary',()=>{
 let count=0,vertical=0;
 for(const entry of PACK5_BUILDER_CATALOG)for(const variant of entry.variants)for(let r=0;r<4;r++){
  const parts=orientedParts(resolvePack5BuilderAsset(entry.symbolicId,variant).descriptor,r);
  assert.ok(parts.length);if(parts.some(p=>p.cell[1]!==0))vertical++;count++;
 }
 assert.equal(count,144);console.log('PACK5 VERTICAL FOOTPRINT CASES',vertical);
});
test('versioned natural source preserves canonical AIR removal and cold mesh bytes',()=>{
 const registry=createUpperNaturalRegistry(),generator='mythwrought-upper-test-only',profile={kind:'mythwrought-upper-source-profile',version:1,generator,seed:179,sourceVersion:'test-v1'};
 registry.register(generator,'test-v1',p=>({seed:p.seed,generator:p.generator,sourceVersion:p.sourceVersion,get:(x,y,z)=>x===-16&&z===0&&y===256?3:0,occupied:k=>k==='sky:-1,0,14',revision:()=>0}));
 const base=new VersionedUpperWorld(registry,profile),w=new Pack2LiveWorld(base);
 assert.equal(w.get(-16,256,0),3);assert.equal(new VoxelWorld(179).get(-16,256,0),0);
 assert.ok(upperOccupancy(w,'sky:-1,0,14'));assert.ok(meshChunk(w,-1,0,15).length>0);
 assert.ok(w.set(-16,256,0,0));assert.deepEqual(base.save().edits,[[-16,256,0,0]]);
 assert.ok(w.set(-15,256,0,3));const mesh=meshChunk(w,-1,0,15);
 const cold=new Pack2LiveWorld(VersionedUpperWorld.restorePortable(registry,JSON.parse(JSON.stringify(base.portable()))));
 assert.equal(cold.get(-16,256,0),0);assert.equal(cold.get(-15,256,0),3);assert.deepEqual(meshChunk(cold,-1,0,15),mesh);
 assert.throws(()=>VersionedUpperWorld.restorePortable(registry,{...base.portable(),profile:{...profile,sourceVersion:'wrong'}}),/exact upper source/);
 assert.throws(()=>registry.register('mythwrought-five-surface-regions-mountain-v8','1',()=>{}));
});
