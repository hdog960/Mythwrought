import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,createWorld,worldKey} from '../src/voxel.mjs';
import {descentRoute,descentWorld,descentCells,DESCENT_ORIGIN} from '../src/underground-switchback-descent.mjs';

function point(d,t,anchor){
  const lx=anchor.x-DESCENT_ORIGIN.x,lz=anchor.z-DESCENT_ORIGIN.z;
  const outward=lz===0?[0,-1]:lz===28?[0,1]:lx===0?[-1,0]:[1,0];
  const tangent=[outward[1],-outward[0]];
  return [anchor.x+outward[0]*d+tangent[0]*t,anchor.z+outward[1]*d+tangent[1]*t];
}
for(const seed of [179,1,2026,-77]){
  test('deepest margin labyrinth physical paths seed '+seed,()=>{
    const world=createWorld(seed),reader=descentWorld(world);
    const anchor=descentRoute().find(p=>p.floor===-200);
    assert.ok(anchor,'route must reach -200');
    for(const [d,t] of [[0,0],[8,0],[16,0],[25,8],[25,-8],
      [37,12],[37,-12],[58,0],[58,5],[58,-5],[62,-12],
      [67,12],[70,0],[79,0]]){
      const [x,z]=point(d,t,anchor);
      assert.equal(reader.get(x,-200,z),BLOCK.DEEPSTONE,'floor '+d+','+t);
      for(let h=1;h<=4;h++)
        assert.equal(reader.get(x,-200+h,z),BLOCK.AIR,'headroom '+d+','+t+','+h);
    }
    const cells=descentCells();
    const [x,z]=point(79,0,anchor);
    assert.equal(cells.get(worldKey(x,-199,z)),BLOCK.AIR);
    assert.equal(world.edits.size,0,'candidate must not write player edits');
  });
}
