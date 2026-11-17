import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,worldKey} from '../src/voxel.mjs';
import {descentCells,descentRoute,descentWorld} from '../src/underground-switchback-descent.mjs';

const origin={x:192,z:192};
const anchor=descentRoute(origin).find(p=>p.floor===-125);
assert.ok(anchor,'lower-band anchor must exist');
const lx=anchor.x-origin.x,lz=anchor.z-origin.z;
const SIDE=28;
const outward=lz===0?[0,-1]:lz===SIDE?[0,1]:lx===0?[-1,0]:[1,0];
const tangent=[outward[1],-outward[0]];
const pos=(d,t,y)=>[anchor.x+outward[0]*d+tangent[0]*t,y,anchor.z+outward[1]*d+tangent[1]*t];
const read=(cells,d,t,y)=>cells.get(worldKey(...pos(d,t,y)));

for(const seed of [179,1,2026,-77]){
  test('stone fan physical floor and headroom seed '+seed,()=>{
    const cells=descentCells(origin);
    for(const [d,t] of [[25,0],[38,0],[44,-13],[45,13],[55,-6],[56,8],[44,0]]){
      assert.equal(read(cells,d,t,-125),BLOCK.DEEPSTONE,'floor at '+d+','+t);
      for(let h=1;h<=4;h++)assert.equal(read(cells,d,t,-125+h),BLOCK.AIR,'headroom '+d+','+t+','+h);
    }
    const edits=new Map(),world={seed,edits,get(x,y,z){return edits.get(worldKey(x,y,z))??BLOCK.STONE;}};
    const reader=descentWorld(world,origin);
    const [x,y,z]=pos(44,0,-124);
    assert.equal(reader.get(x,y,z),BLOCK.AIR);
    edits.set(worldKey(x,y,z),BLOCK.STONE);
    assert.equal(reader.get(x,y,z),BLOCK.STONE,'saved player edit wins');
    edits.delete(worldKey(x,y,z));
    assert.equal(reader.get(x,y,z),BLOCK.AIR,'removing edit restores cave air');
  });
}
