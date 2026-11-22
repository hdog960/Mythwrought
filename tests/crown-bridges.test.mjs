import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,baseBlock,CHUNK_SIZE,meshChunk} from '../src/voxel.mjs';
import {planCrownBridge,placeCrownBridge} from '../src/crown-bridges.mjs';
function fixture(seed=179){
 const w=new VoxelWorld(seed),y=16;
 // Find a genuinely empty span including rails and two-block head clearance.
 for(let z=-32;z<32;z++)for(let x=-32;x<25;x++){
  const a=[x,y,z],b=[x+6,y,z];
  if([a,b].some(([px,py,pz])=>baseBlock(px,py,pz,seed)!==BLOCK.AIR))continue;
  if(!w.set(...a,BLOCK.WOOD)||!w.set(...b,BLOCK.WOOD))continue;
  const plan=planCrownBridge(w,a,b);
  if(plan)return {w,a,b,plan};
  w.set(...a,BLOCK.AIR);w.set(...b,BLOCK.AIR);
 }
 throw Error('No clear elevated bridge fixture');
}
test('physical connector has timber deck, leaf railings, and no duplicated voxels',()=>{
 for(const seed of [179,917,-184]){
  const {w,a,b,plan}=fixture(seed);
  assert.equal(plan.blockCount,15);
  assert.equal(new Set(plan.cells.map(c=>c.slice(0,3).join(','))).size,15);
  assert.equal(plan.cells.filter(c=>c[3]===BLOCK.WOOD).length,5);
  assert.equal(plan.cells.filter(c=>c[3]===BLOCK.LEAVES).length,10);
  assert.deepEqual(planCrownBridge(w,a,b),plan);
  assert.equal(placeCrownBridge(w,plan),true);
  for(const c of plan.cells)assert.equal(w.get(...c.slice(0,3)),c[3]);
  const restored=VoxelWorld.restore(w.save());
  for(const c of plan.cells)assert.equal(restored.get(...c.slice(0,3)),c[3]);
  assert.equal(placeCrownBridge(w,plan),false);
 }
});
test('rejects unsupported endpoints, blocked walkways, and tampered plans',()=>{
 const {w,a,b,plan}=fixture();
 const fake=structuredClone(plan);fake.cells[0][3]=BLOCK.STONE;
 assert.equal(placeCrownBridge(w,fake),false);
 const [x,y,z]=plan.cells[0];
 w.set(x,y,z,BLOCK.CRYSTAL);
 assert.equal(placeCrownBridge(w,plan),false);
 assert.equal(w.get(x,y,z),BLOCK.CRYSTAL);
 w.set(x,y,z,BLOCK.AIR);
 w.set(...a,BLOCK.AIR);
 assert.equal(planCrownBridge(w,a,b),null);
 assert.equal(placeCrownBridge(w,plan),false);
});
test('rejected writes roll back without losing preexisting edits',()=>{
 const {w,plan}=fixture(917),before=w.save();
 let n=0;
 const guarded={seed:w.seed,get:(...a)=>w.get(...a),set:(x,y,z,id)=>{
  if(id!==BLOCK.AIR&&++n===8)return false;
  return w.set(x,y,z,id);
 }};
 assert.equal(placeCrownBridge(guarded,plan),false);
 assert.deepEqual(w.save(),before);
 assert.equal(placeCrownBridge(w,plan),true);
});
test('cross-chunk bridge cells are ordinary meshable and individually removable',()=>{
 const {w,plan}=fixture(-184);
 assert.equal(placeCrownBridge(w,plan),true);
 const cell=plan.cells[0],cx=Math.floor(cell[0]/CHUNK_SIZE),cz=Math.floor(cell[2]/CHUNK_SIZE);
 assert.ok(meshChunk(w,cx,cz).length>0);
 assert.equal(w.set(...cell.slice(0,3),BLOCK.AIR),true);
 assert.equal(VoxelWorld.restore(w.save()).get(...cell.slice(0,3)),BLOCK.AIR);
});
