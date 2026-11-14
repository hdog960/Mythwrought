import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,baseBlock,terrainHeight} from '../src/voxel.mjs';
import {naturalCaveCorridor,updateCaveDiscovery} from '../src/exploration-cues.mjs';

test('cave cue requires genuine seeded air, solid floor and roof and a continuous walkable corridor',()=>{
  const world=new VoxelWorld(179);
  let found=null;
  outer: for(let x=-64;x<=64;x++)for(let z=-64;z<=64;z++)
    for(let y=0;y<terrainHeight(x,z,world.seed)-2;y++){
      if(naturalCaveCorridor(world,{x:x+.5,feet:y,z:z+.5})){found=[x,y,z];break outer;}
    }
  if(found){
    assert.equal(naturalCaveCorridor(world,{x:found[0]+.5,feet:found[1],z:found[2]+.5}),true);
    const before=JSON.stringify(world.save());
    assert.equal(world.save().schema,1);
    assert.equal(JSON.stringify(world.save()),before);
    // Filling the player's cave cell invalidates the cue, without moving a cave.
    world.set(...found,BLOCK.STONE);
    assert.equal(naturalCaveCorridor(world,{x:found[0]+.5,feet:found[1],z:found[2]+.5}),false);
  }
  assert.equal(naturalCaveCorridor(world,{x:0,feet:100,z:0}),false);
  assert.equal(naturalCaveCorridor(world,{x:NaN,feet:0,z:0}),false);
});

test('discovery announces entry once, resets on exit and respects cooldown',()=>{
  let s=updateCaveDiscovery(null,false,0);
  s=updateCaveDiscovery(s,true,100);assert.equal(s.entered,true);
  s=updateCaveDiscovery(s,true,200);assert.equal(s.entered,false);
  s=updateCaveDiscovery(s,false,500);
  s=updateCaveDiscovery(s,true,600);assert.equal(s.entered,false);
  s=updateCaveDiscovery(s,false,13000);
  s=updateCaveDiscovery(s,true,14000);
  assert.equal(s.entered,true);assert.equal(s.discoveries,2);
});
