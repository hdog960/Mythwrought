// Forked basalt sanctuary: source-coordinate physical occupancy and save precedence.
import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK} from '../src/voxel.mjs';
import {descentRoute,descentWorld,descentCells,descentConnectivity} from '../src/underground-switchback-descent.mjs';
const SIDE=28;
for(const seed of [179,1,2026,-77]){
  test('forked basalt sanctuary has connected physical arms and edit precedence '+seed,()=>{
    const world=new VoxelWorld(seed);
    const anchor=descentRoute().find(p=>p.floor===-160);
    assert.ok(anchor,'missing -160 anchor');
    const lx=anchor.x-192,lz=anchor.z-192;
    const outward=lz===0?[0,-1]:lz===SIDE?[0,1]:lx===0?[-1,0]:[1,0];
    const tangent=[outward[1],-outward[0]];
    const at=(d,t,y)=>[
      anchor.x+outward[0]*d+tangent[0]*t,
      y,
      anchor.z+outward[1]*d+tangent[1]*t
    ];
    const reader=descentWorld(world);
    const cells=descentCells();
    assert.ok(cells.size>1000);
    // Two diverging arms, common throat and terminal chamber.
    for(const [d,t] of [[0,0],[12,0],[22,-7],[22,7],[30,-9],[30,9],[46,0],[51,2],[60,2],[32,13]]){
      const [x,y,z]=at(d,t,-160);
      assert.equal(reader.get(x,y,z),BLOCK.DEEPSTONE,'missing footing '+d+','+t);
      for(let h=1;h<=4;h++)
        assert.equal(reader.get(x,y+h,z),BLOCK.AIR,'missing headroom '+d+','+t+' h'+h);
    }
    const [x,y,z]=at(51,2,-159);
    assert.equal(world.set(x,y,z,BLOCK.WOOD),true);
    const saved=world.save(),restored=VoxelWorld.restore(saved);
    assert.equal(descentWorld(restored).get(x,y,z),BLOCK.WOOD);
    assert.deepEqual(restored.save(),saved);
    assert.equal(descentConnectivity(restored).connected,true,'side-chamber edit must not overwrite or alter main descent');
  });
}
