// Physical four-seed lower-band confluence acceptance; no runtime claim.
import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK} from '../src/voxel.mjs';
import {descentRoute,descentWorld,descentConnectivity} from '../src/underground-switchback-descent.mjs';

for(const seed of [179,1,2026,-77]){
  test('stepped confluence has two supported branches and saved-edit precedence '+seed,()=>{
    const world=new VoxelWorld(seed);
    const anchor=descentRoute().find(p=>p.floor===-110);
    assert.ok(anchor,'missing lower-band anchor');
    const lx=anchor.x-192,lz=anchor.z-192;
    const outward=lz===0?[0,-1]:lz===28?[0,1]:lx===0?[-1,0]:[1,0];
    const tangent=[outward[1],-outward[0]];
    const at=(d,t,y)=>[
      anchor.x+outward[0]*d+tangent[0]*t,y,
      anchor.z+outward[1]*d+tangent[1]*t
    ];
    const reader=descentWorld(world);
    for(const d of [0,8,14,20,25,26,30,37,38,42,48,54]){
      const floor=-110-(d>=38?2:d>=26?1:0);
      const spread=d<14?0:Math.round(9*Math.sin(Math.PI*(d-14)/40));
      for(const t of [...new Set([-spread,spread])]){
        const [x,y,z]=at(d,t,floor);
        assert.equal(reader.get(x,y,z),BLOCK.DEEPSTONE,'floor '+d+','+t);
        for(let h=1;h<=4;h++)
          assert.equal(reader.get(x,y+h,z),BLOCK.AIR,'headroom '+d+','+t+' h'+h);
      }
    }
    const [x,y,z]=at(59,0,-112);
    assert.equal(reader.get(x,y,z),BLOCK.DEEPSTONE);
    for(let h=1;h<=4;h++)assert.equal(reader.get(x,y+h,z),BLOCK.AIR);
    const [ex,ey,ez]=at(59,0,-111);
    assert.equal(world.set(ex,ey,ez,BLOCK.WOOD),true);
    const saved=world.save(),restored=VoxelWorld.restore(saved);
    assert.equal(descentWorld(restored).get(ex,ey,ez),BLOCK.WOOD);
    assert.deepEqual(restored.save(),saved);
    assert.equal(descentConnectivity(restored).connected,true,
      'side cavern edits must not change the main descent');
  });
}
