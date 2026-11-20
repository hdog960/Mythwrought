import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK} from '../src/voxel.mjs';
import {descentRoute,descentWorld,descentConnectivity} from '../src/underground-switchback-descent.mjs';

for(const seed of [179,1,2026,-77]){
  test('shattered shelf is supported, connected and edit-safe '+seed,()=>{
    const world=new VoxelWorld(seed);
    const anchor=descentRoute().find(p=>p.floor===-145);
    assert.ok(anchor,'missing -145 descent anchor');
    const lx=anchor.x-192,lz=anchor.z-192;
    const outward=lz===0?[0,-1]:lz===28?[0,1]:lx===0?[-1,0]:[1,0];
    const tangent=[outward[1],-outward[0]];
    const at=(d,t,y)=>[anchor.x+outward[0]*d+tangent[0]*t,y,
      anchor.z+outward[1]*d+tangent[1]*t];
    const reader=descentWorld(world);
    let previous=null;
    for(let d=0;d<=56;d++){
      const floor=-145-(d>=38?2:d>=19?1:0);
      const bend=d<18?0:d<37?Math.floor((d-18)/4):4-Math.floor((d-37)/5);
      const [x,y,z]=at(d,bend,floor);
      assert.equal(reader.get(x,y,z),BLOCK.DEEPSTONE,'support '+d);
      for(let h=1;h<=4;h++)
        assert.equal(reader.get(x,y+h,z),BLOCK.AIR,'clearance '+d+' '+h);
      if(previous){
        assert.ok(Math.abs(previous[1]-y)<=1,'unsafe vertical transition '+d);
        assert.ok(Math.abs(previous[0]-x)+Math.abs(previous[2]-z)<=2,
          'disconnected shelf '+d);
      }
      previous=[x,y,z];
    }
    for(const [d,t] of [[59,0],[66,15],[66,8]]){
      const [x,y,z]=at(d,t,-147);
      assert.equal(reader.get(x,y,z),BLOCK.DEEPSTONE);
      for(let h=1;h<=4;h++)assert.equal(reader.get(x,y+h,z),BLOCK.AIR);
    }
    const [x,y,z]=at(59,0,-146);
    assert.equal(world.set(x,y,z,BLOCK.WOOD),true);
    const saved=world.save(),restored=VoxelWorld.restore(saved);
    assert.equal(descentWorld(restored).get(x,y,z),BLOCK.WOOD);
    assert.deepEqual(restored.save(),saved);
    assert.equal(descentConnectivity(restored).connected,true);
  });
}
