import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,baseBlock,terrainHeight} from '../src/voxel.mjs';
import {planStoneRotunda,placeStoneRotunda} from '../src/stone-rotunda.mjs';

function findSite(world){
  // Deterministic bounded fixture scan; never edits the world.
  for(let z=-128;z<=128;z+=4)for(let x=-128;x<=128;x+=4){
    const plan=planStoneRotunda(world,x,z);
    if(plan)return plan;
  }
  return null;
}

test('rotunda is an opt-in physical template with four clear entries and open center',()=>{
  const world=new VoxelWorld(179),before=world.save();
  const plan=findSite(world);
  if(!plan){ assert.deepEqual(world.save(),before);return; }
  assert.equal(plan.optIn,true);
  assert.deepEqual(plan.materialIds,[BLOCK.STONE]);
  assert.equal(plan.blockCount,plan.cells.length);
  assert.ok(plan.cells.length>50);
  const occupied=new Set(plan.cells.map(([x,y,z])=>[x,y,z].join(',')));
  assert.equal(occupied.size,plan.cells.length);
  for(const [x,y,z] of [...plan.entrances,plan.center]){
    for(let dy=0;dy<=2;dy++)assert.equal(occupied.has([x,y+dy,z].join(',')),false);
  }
  assert.deepEqual(world.save(),before);
});

test('no construction occurs on import, invalid plans or edited terrain',()=>{
  const world=new VoxelWorld(179),before=world.save();
  assert.equal(placeStoneRotunda(world,{kind:'stone-rotunda',optIn:true,origin:[0,0,0],cells:[]}),false);
  assert.equal(planStoneRotunda(world,Number.NaN,0),null);
  assert.equal(planStoneRotunda(world,0,Number.POSITIVE_INFINITY),null);
  assert.deepEqual(world.save(),before);
  const plan=findSite(world);
  if(!plan)return;
  const [x,h,z]=plan.origin;
  assert.equal(world.set(x,h+1,z,BLOCK.STONE),true);
  assert.equal(planStoneRotunda(world,x,z),null);
  assert.equal(placeStoneRotunda(world,plan),false);
  assert.equal(world.get(x,h+1,z),BLOCK.STONE);
});

test('failed construction rolls back all schema-1 edits',()=>{
  const world=new VoxelWorld(179);
  const plan=findSite(world);
  if(!plan)return;
  const before=world.save(),originalSet=world.set.bind(world);
  let writes=0;
  world.set=(...args)=>{if(++writes===12)return false;return originalSet(...args);};
  assert.equal(placeStoneRotunda(world,plan),false);
  assert.deepEqual(world.save(),before);
});

test('placement creates real selectable and removable stone voxels',()=>{
  const world=new VoxelWorld(179);
  const plan=findSite(world);
  if(!plan)return;
  assert.equal(placeStoneRotunda(world,plan),true);
  const [x,y,z]=plan.cells[0];
  assert.equal(world.get(x,y,z),BLOCK.STONE);
  assert.equal(world.set(x,y,z,BLOCK.AIR),true);
  assert.equal(world.get(x,y,z),BLOCK.AIR);
});
