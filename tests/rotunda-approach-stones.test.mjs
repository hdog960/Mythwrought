import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,worldKey} from '../src/voxel.mjs';
import {planStoneRotunda} from '../src/stone-rotunda.mjs';
import {planRotundaApproachStones,placeRotundaApproachStones} from '../src/rotunda-approach-stones.mjs';

function site(world){
  for(let z=-160;z<=160;z+=4)for(let x=-160;x<=160;x+=4){
    const rotunda=planStoneRotunda(world,x,z);
    if(!rotunda)continue;
    const approach=planRotundaApproachStones(world,rotunda);
    if(approach)return {rotunda,approach};
  }
  return null;
}
test('eight paired physical cairns preserve cardinal walking lanes and never auto-place',()=>{
  const world=new VoxelWorld(179),before=world.save(),found=site(world);
  assert.ok(found,'fixed seed should contain a flat rotunda with surrounding marker sites');
  const {rotunda,approach}=found;
  assert.equal(approach.blockCount,16);
  assert.deepEqual(approach.materialIds,[BLOCK.STONE]);
  assert.deepEqual(world.save(),before);
  const [x,h,z]=rotunda.origin;
  for(const [px,py,pz,id] of approach.cells){
    assert.equal(id,BLOCK.STONE);
    assert.equal(Math.abs(px-x)===6||Math.abs(pz-z)===6,true);
    assert.ok(py===h+1||py===h+2);
    assert.notEqual(px===x||pz===z,true,'cardinal centerlines remain clear');
  }
  assert.equal(placeRotundaApproachStones(world,rotunda,approach),true);
  for(const [px,py,pz,id] of approach.cells)assert.equal(world.get(px,py,pz),id);
  assert.equal(world.set(...approach.cells[0].slice(0,3),BLOCK.AIR),true);
  assert.equal(world.get(...approach.cells[0].slice(0,3)),BLOCK.AIR);
});
test('stale plans and player-owned matching-baseline edits cannot be overwritten',()=>{
  const world=new VoxelWorld(179),found=site(world);
  assert.ok(found);
  const {rotunda,approach}=found;
  const [x,y,z]=approach.cells[0];
  world.edits.set(worldKey(x,y,z),BLOCK.AIR);
  assert.equal(planRotundaApproachStones(world,rotunda),null);
  assert.equal(placeRotundaApproachStones(world,rotunda,approach),false);
  assert.equal(world.edits.get(worldKey(x,y,z)),BLOCK.AIR);
});
test('partial rejected writes restore schema-1 edits exactly',()=>{
  const world=new VoxelWorld(179),found=site(world);
  assert.ok(found);
  const before=world.save(),set=world.set.bind(world);
  let count=0;
  world.set=(...args)=>++count===6?false:set(...args);
  assert.equal(placeRotundaApproachStones(world,found.rotunda,found.approach),false);
  assert.deepEqual(world.save(),before);
});
