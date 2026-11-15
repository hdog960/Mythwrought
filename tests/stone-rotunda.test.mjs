import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,baseBlock,terrainHeight,worldKey} from '../src/voxel.mjs';
import {planStoneRotunda,placeStoneRotunda,findStoneRotundaSite} from '../src/stone-rotunda.mjs';

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
  assert.ok(plan,'seed 179 must contain an eligible rotunda site within survey bounds');
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
  assert.ok(plan,'expected an eligible fixed-seed site');
  const [x,h,z]=plan.origin;
  assert.equal(world.set(x,h+1,z,BLOCK.STONE),true);
  assert.equal(planStoneRotunda(world,x,z),null);
  assert.equal(placeStoneRotunda(world,plan),false);
  assert.equal(world.get(x,h+1,z),BLOCK.STONE);
});

test('failed construction rolls back all schema-1 edits',()=>{
  const world=new VoxelWorld(179);
  const plan=findSite(world);
  assert.ok(plan,'expected an eligible fixed-seed site');
  const before=world.save(),originalSet=world.set.bind(world);
  let writes=0;
  world.set=(...args)=>{if(++writes===12)return false;return originalSet(...args);};
  assert.equal(placeStoneRotunda(world,plan),false);
  assert.deepEqual(world.save(),before);
});

test('placement creates real selectable and removable stone voxels',()=>{
  const world=new VoxelWorld(179);
  const plan=findSite(world);
  assert.ok(plan,'expected an eligible fixed-seed site');
  assert.equal(placeStoneRotunda(world,plan),true);
  const [x,y,z]=plan.cells[0];
  assert.equal(world.get(x,y,z),BLOCK.STONE);
  assert.equal(world.set(x,y,z,BLOCK.AIR),true);
  assert.equal(world.get(x,y,z),BLOCK.AIR);
});


test('explicit player edit equal to natural terrain still reserves construction volume',()=>{
  const world=new VoxelWorld(179);
  const plan=findSite(world);
  assert.ok(plan,'expected an eligible fixed-seed site');
  const [x,h,z]=plan.origin;
  const key=worldKey(x,h+1,z);
  const natural=baseBlock(x,h+1,z,world.seed);
  assert.equal(natural,BLOCK.AIR);
  world.edits.set(key,natural);
  assert.equal(world.get(x,h+1,z),natural);
  assert.equal(planStoneRotunda(world,x,z),null);
  assert.equal(placeStoneRotunda(world,plan),false);
  assert.equal(world.edits.get(key),natural);
});


test('weathered buttresses and asymmetric crown are real editable voxels without closing gateways',()=>{
  const world=new VoxelWorld(179),plan=findSite(world);
  assert.ok(plan,'expected a buildable site');
  const [x,h,z]=plan.origin;
  const cells=new Set(plan.cells.map(([px,py,pz])=>[px,py,pz].join(',')));
  for(const [sx,sz] of [[-1,-1],[-1,1],[1,-1],[1,1]]){
    for(const [dx,dz] of [[sx*4,sz*3],[sx*3,sz*4]]){
      assert.ok(cells.has([x+dx,h+1,z+dz].join(',')),'buttress must be physical stone');
    }
  }
  for(const [dx,dz] of [[-3,-2],[-3,-1],[-2,-3],[3,1],[3,2],[2,3]])
    assert.ok(cells.has([x+dx,h+6,z+dz].join(',')),'broken crown must be physical stone');
  for(const [px,py,pz] of [...plan.entrances,plan.center])
    for(let dy=0;dy<3;dy++)assert.equal(cells.has([px,py+dy,pz].join(',')),false);
  assert.equal(placeStoneRotunda(world,plan),true);
  assert.equal(world.get(x-4,h+1,z-3),BLOCK.STONE);
  assert.equal(world.set(x-4,h+1,z-3,BLOCK.AIR),true);
  assert.equal(world.get(x-4,h+1,z-3),BLOCK.AIR);
});


test('every supported footprint column has solid subfloor at both depths',()=>{
  const world=new VoxelWorld(179),plan=findSite(world);
  assert.ok(plan,'expected a buildable site with two supporting layers');
  const [x,h,z]=plan.origin;
  for(let dx=-4;dx<=4;dx++)for(let dz=-4;dz<=4;dz++){
    for(const dy of [-1,-2]){
      assert.notEqual(baseBlock(x+dx,h+dy,z+dz,world.seed),BLOCK.AIR,
        'a cave under the floor must invalidate the entire footprint');
    }
  }
});

test('all four exterior approaches are traversable and player-owned approach edits block construction',()=>{
  const world=new VoxelWorld(179),plan=findSite(world);
  assert.ok(plan,'seed 179 needs an accessible four-way rotunda site');
  const [x,h,z]=plan.origin;
  for(const [dx,dz] of [[0,-5],[0,5],[-5,0],[5,0]]){
    assert.equal(terrainHeight(x+dx,z+dz,world.seed),h);
    assert.notEqual(baseBlock(x+dx,h,z+dz,world.seed),BLOCK.AIR);
    for(const dy of [1,2])
      assert.equal(world.get(x+dx,h+dy,z+dz),BLOCK.AIR);
  }
  const key=worldKey(x+5,h+1,z);
  world.edits.set(key,BLOCK.AIR); // explicit edit matching baseline still belongs to player
  assert.equal(planStoneRotunda(world,x,z),null);
  assert.equal(placeStoneRotunda(world,plan),false);
});

test('bounded closest-first discovery is deterministic, read-only and validates arguments',()=>{
  const world=new VoxelWorld(179),before=world.save();
  const first=findStoneRotundaSite(world,0,0,{radius:128,step:4});
  const second=findStoneRotundaSite(world,0,0,{radius:128,step:4});
  assert.deepEqual(second,first);
  assert.ok(first,'seed 179 must yield a reachable, supported site in bounded search');
  assert.equal(first.optIn,true);
  assert.deepEqual(world.save(),before);
  assert.equal(findStoneRotundaSite(world,0,0,{radius:-1}),null);
  assert.equal(findStoneRotundaSite(world,0,0,{step:0}),null);
  assert.equal(findStoneRotundaSite(world,0.5,0),null);
});

test('exterior approach rejects untracked world modifications without changing saves',()=>{
  const world=new VoxelWorld(179),plan=findSite(world);
  assert.ok(plan,'expected an eligible fixed-seed site');
  const [x,h,z]=plan.origin,originalGet=world.get.bind(world);
  world.get=(px,py,pz)=>px===x+5&&py===h+1&&pz===z?BLOCK.STONE:originalGet(px,py,pz);
  assert.equal(planStoneRotunda(world,x,z),null);
  assert.equal(placeStoneRotunda(world,plan),false);
});
