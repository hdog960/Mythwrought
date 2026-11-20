import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK} from '../src/voxel.mjs';
import {descentRoute,descentWorld,descentConnectivity} from '../src/underground-switchback-descent.mjs';

for(const seed of [179,1,2026,-77]){
  test('upper windcut fork has supported arms, lookout, and preserved edits '+seed,()=>{
    const world=new VoxelWorld(seed);
    const anchor=descentRoute().find(p=>p.floor===-20);
    assert.ok(anchor,'missing upper-band anchor');
    const lx=anchor.x-192,lz=anchor.z-192;
    const outward=lz===0?[0,-1]:lz===28?[0,1]:lx===0?[-1,0]:[1,0];
    const tangent=[outward[1],-outward[0]];
    const at=(d,t,y)=>[anchor.x+outward[0]*d+tangent[0]*t,y,
      anchor.z+outward[1]*d+tangent[1]*t];
    const reader=descentWorld(world);
    for(const d of [0,8,15,20,25,30,35,40,45]){
      const bend=d<=15?0:Math.round(8*Math.sin(Math.PI*(d-15)/30));
      for(const t of [...new Set([-bend,bend])]){
        const [x,y,z]=at(d,t,-20);
        assert.equal(reader.get(x,y,z),BLOCK.DEEPSTONE,'floor '+d+','+t);
        for(let h=1;h<=4;h++)
          assert.equal(reader.get(x,y+h,z),BLOCK.AIR,'clearance '+d+','+t+' '+h);
      }
    }
    for(const [d,t] of [[51,-2],[32,-12]]){
      const [x,y,z]=at(d,t,-20);
      assert.equal(reader.get(x,y,z),BLOCK.DEEPSTONE);
      for(let h=1;h<=4;h++)assert.equal(reader.get(x,y+h,z),BLOCK.AIR);
    }
    const [x,y,z]=at(51,-2,-19);
    assert.equal(world.set(x,y,z,BLOCK.WOOD),true);
    const saved=world.save(),restored=VoxelWorld.restore(saved);
    assert.equal(descentWorld(restored).get(x,y,z),BLOCK.WOOD);
    assert.deepEqual(restored.save(),saved);
    assert.equal(descentConnectivity(restored).connected,true);
  });
}
