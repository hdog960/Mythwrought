import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,terrainHeight} from '../src/voxel.mjs';
import {planCanopyGate,placeCanopyGate} from '../src/voxel-canopy-gate.mjs';
function find(world,axis='x'){
 for(let x=-128;x<=128;x+=2)for(let z=-128;z<=128;z+=2){
  const plan=planCanopyGate(world,x,z,{axis});if(plan)return plan;
 }
 return null;
}
test('canopy gate is deterministic, opt-in and composed only of editable physical voxels',()=>{
 for(const seed of [179,917,-184]){
  const world=new VoxelWorld(seed),before=world.save(),plan=find(world);
  assert.ok(plan,'expected a valid flat site');
  assert.deepEqual(plan,planCanopyGate(new VoxelWorld(seed),plan.origin[0],plan.origin[2]));
  assert.deepEqual(world.save(),before);
  assert.ok(plan.cells.some(c=>c[3]===BLOCK.WOOD));
  assert.ok(plan.cells.some(c=>c[3]===BLOCK.LEAVES));
  const [x,y,z]=plan.origin;
  for(let u=-2;u<=2;u++)for(let dy=1;dy<=3;dy++)
   assert.ok(!plan.cells.some(c=>c[0]===x+u&&c[1]===y+dy&&c[2]===z),'walkway must stay open');
  assert.equal(placeCanopyGate(world,plan),true);
  const restored=VoxelWorld.restore(world.save());
  for(const [a,b,c,id] of plan.cells)assert.equal(restored.get(a,b,c),id);
 }
});
test('canopy gate rotates its physical footprint and protects edited ground',()=>{
 const world=new VoxelWorld(179),plan=find(world,'z');
 assert.ok(plan);
 const [x,,z]=plan.origin;
 const a=x+3,c=z+6,h=terrainHeight(a,c,world.seed);
 assert.equal(world.set(a,h,c,BLOCK.STONE),true);
 assert.equal(planCanopyGate(world,x,z,{axis:'z'}),null);
 assert.equal(placeCanopyGate(world,plan),false);
 assert.equal(planCanopyGate(world,x,z,{axis:'diagonal'}),null);
});
test('canopy gate rejects altered plans and restores partial writes',()=>{
 const world=new VoxelWorld(179),plan=find(world),before=world.save();
 assert.ok(plan);
 const tampered=structuredClone(plan);tampered.cells[0][3]=BLOCK.STONE;
 assert.equal(placeCanopyGate(world,tampered),false);
 const set=world.set.bind(world);let count=0;
 world.set=(x,y,z,id)=>id!==BLOCK.AIR&&++count===12?false:set(x,y,z,id);
 assert.equal(placeCanopyGate(world,plan),false);
 assert.deepEqual(world.save(),before);
 world.set=set;
 assert.equal(placeCanopyGate(world,plan),true);
});
