import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,worldKey} from '../src/voxel.mjs';
import {descentRoute,descentWorld,descentConnectivity} from '../src/underground-switchback-descent.mjs';

const origin={x:192,z:192};
const anchor=descentRoute(origin).find(p=>p.floor===-150);
assert.ok(anchor,'lower-band anchor exists');
const lx=anchor.x-origin.x,lz=anchor.z-origin.z;
const outward=lz===0?[0,-1]:lz===28?[0,1]:lx===0?[-1,0]:[1,0];
const tangent=[outward[1],-outward[0]];
const at=(d,t,y)=>[anchor.x+outward[0]*d+tangent[0]*t,y,
                     anchor.z+outward[1]*d+tangent[1]*t];
const spread=d=>Math.round(11*Math.sin(Math.PI*(d-17)/41));
const floor=d=>-150-(d>=43?3:d>=29?2:d>=12?1:0);
for(const seed of [179,1,2026,-77]){
  test('ribbed fault canyon supported split route and basin '+seed,()=>{
    const world=new VoxelWorld(seed),read=descentWorld(world);
    for(const d of [0,8,12,17,22,29,35,43,47,55,58]){
      const arms=d<=17?[0]:[-spread(d),spread(d)];
      for(const t of arms){
        const y=floor(d),[x,,z]=at(d,t,y);
        assert.equal(read.get(x,y,z),BLOCK.DEEPSTONE,'support at '+d+','+t);
        for(let h=1;h<=4;h++)
          assert.equal(read.get(x,y+h,z),BLOCK.AIR,'clearance '+d+','+t+','+h);
      }
    }
    for(const [d,t] of [[58,-10],[58,10],[67,2],[75,2]]){
      const [x,y,z]=at(d,t,-153);
      assert.equal(read.get(x,y,z),BLOCK.DEEPSTONE,'basin floor');
      for(let h=1;h<=4;h++)assert.equal(read.get(x,y+h,z),BLOCK.AIR,'basin clearance');
    }
    assert.equal(descentConnectivity(world).connected,true,'main descent preserved');
    const [x,y,z]=at(67,2,-151),key=worldKey(x,y,z);
    assert.equal(read.get(x,y,z),BLOCK.AIR);
    world.edits.set(key,BLOCK.STONE);
    assert.equal(read.get(x,y,z),BLOCK.STONE,'saved edit wins');
    world.edits.delete(key);
    assert.equal(read.get(x,y,z),BLOCK.AIR,'candidate returns after edit removal');
  });
}
