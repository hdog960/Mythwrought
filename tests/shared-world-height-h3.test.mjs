import test from 'node:test';import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,meshChunk,chunkWindow} from '../src/voxel.mjs';
import {Pack2LiveWorld,validatePack2Snapshot} from '../src/pack2-world.mjs';
import {pack2WaterSectionVertices} from '../src/pack2-integration.mjs';
import {UpperIndexedMap,runtimeMeshKey,runtimeSectionForY,upperOccupancy,upperOccupancyRevision,physicalBodyRegions} from '../src/world-height.mjs';
import {planHeightStream} from '../src/world-height-stream.mjs';
import {applyBlockAction} from '../src/blocks.mjs';
import {g2RegionKey} from '../src/creative-integration/g2-streaming.mjs';
test('actual wrapper, original edit action and signed sparse map occupancy',()=>{
 const w=new Pack2LiveWorld(new VoxelWorld(2026));const x=-17,z=32,k='sky:-2,2,14';
 assert.equal(w.set(x,256,z,BLOCK.STONE),true);assert.ok(upperOccupancy(w,k));
 assert.equal(w.set(Number.MAX_SAFE_INTEGER+1,256,z,BLOCK.STONE),false);
 const player={x:x+3,feet:253,z:z+.5};
 const mine=applyBlockAction(w,[x+.5,254.5,z+.5],[0,1,0],'mine',BLOCK.STONE,player,()=>{});
 assert.ok(mine.ok,mine.reason);assert.equal(upperOccupancy(w,k),false);
 w.edits.set(x+',256,'+z,3);assert.ok(upperOccupancy(w,k));w.edits.clear();assert.equal(upperOccupancy(w,k),false);
});
test('native original surface mesher emits upper geometry and culls crossing sections',()=>{
 const w=new Pack2LiveWorld(new VoxelWorld(2026));w.set(0,35,0,3);w.set(0,36,0,3);
 assert.equal(meshChunk(w,0,0,1).length,270);assert.equal(meshChunk(w,0,0,2).length,270);
 w.set(0,36,0,0);assert.equal(meshChunk(w,0,0,1).length,324);
 w.set(0,256,0,3);assert.equal(meshChunk(w,0,0,15).length,324);
});
test('original Pack2 transparent water index, horizontal seam and cold sidecar',()=>{
 const w=new Pack2LiveWorld(new VoxelWorld(2026));assert.ok(w.set(0,256,0,76));assert.ok(w.set(1,256,0,76));
 const a=pack2WaterSectionVertices(w,0,0,15);assert.ok(a.length>0);assert.equal(meshChunk(w,0,0,15).length,0);
 assert.equal(pack2WaterSectionVertices(w,0,0,0).length,0);
 const cold=new Pack2LiveWorld(VoxelWorld.restore(w.save()),w.pack2Snapshot().cells);
 assert.deepEqual(pack2WaterSectionVertices(cold,0,0,15),a);assert.ok(upperOccupancy(cold,'sky:0,0,14'));
});
test('bounded stream includes body seam owners and preserves untouched underground',()=>{
 const w=new Pack2LiveWorld(new VoxelWorld(2026)),legacy=chunkWindow(0,0,2).map(c=>({...c,section:0}));
 assert.deepEqual(planHeightStream(w,{x:0,feet:10,z:0},legacy),legacy);
 for(const feet of [19,20,35,36,99,255.2]){
  const pose={x:0,feet,z:0},p=planHeightStream(w,pose,legacy),keys=new Set(p.map(c=>runtimeMeshKey(c.cx,c.cz,c.section)));
  assert.ok(keys.size<=25);for(const r of physicalBodyRegions(pose))assert.ok(keys.has(r.key),r.key);
 }
 assert.equal(planHeightStream(w,{x:0,feet:-20,z:0},legacy),legacy);
 assert.equal(g2RegionKey({x:0,y:256,z:0},runtimeSectionForY),'0,0,15');
});
