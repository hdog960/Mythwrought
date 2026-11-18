import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,worldKey} from '../src/voxel.mjs';
import {descentRoute,descentWorld,descentConnectivity} from '../src/underground-switchback-descent.mjs';

// Source-derived orientation: tests all four possible perimeter sides without
// assuming the cave's global X/Z direction.
function frame(){
  const origin={x:192,z:192},anchor=descentRoute(origin).find(p=>p.floor===-35);
  assert.ok(anchor,'upper-band anchor');
  const side=28,lx=anchor.x-origin.x,lz=anchor.z-origin.z;
  const outward=lz===0?[0,-1]:lz===side?[0,1]:lx===0?[-1,0]:[1,0];
  const tangent=[outward[1],-outward[0]];
  return (d,t,y)=>[anchor.x+outward[0]*d+tangent[0]*t,y,anchor.z+outward[1]*d+tangent[1]*t];
}
const at=frame();
for(const seed of [179,1,2026,-77]){
  test('broken-column grotto has two accessible arms, floor and cavern '+seed,()=>{
    const world=new VoxelWorld(seed),read=descentWorld(world);
    for(const [d,t] of [[8,0],[22,-8],[22,8],[50,0],[57,12],[37,-13]]){
      const [x,y,z]=at(d,t,-35);
      assert.equal(read.get(x,y,z),BLOCK.DEEPSTONE,'supported floor '+d+','+t);
      for(let h=1;h<=4;h++)
        assert.equal(read.get(x,y+h,z),BLOCK.AIR,'standing clearance '+d+','+t+','+h);
    }
    for(const [d,t] of [[54,-7],[59,5],[65,-3]]){
      const [x,y,z]=at(d,t,-35);
      assert.equal(read.get(x,y+3,z),BLOCK.DEEPSTONE,'retained column');
    }
    assert.equal(descentConnectivity(world).connected,true,'main descent remains passable');
    const [x,y,z]=at(57,12,-34),key=worldKey(x,y,z);
    world.edits.set(key,BLOCK.STONE);
    assert.equal(read.get(x,y,z),BLOCK.STONE,'saved edit overrides new cave air');
    world.edits.delete(key);
    assert.equal(read.get(x,y,z),BLOCK.AIR,'removing edit restores cave geometry');
  });
}
