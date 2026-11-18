import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,worldKey} from '../../src/voxel.mjs';
import {WORLD_MIN_Y} from '../../src/depth.mjs';
import {descentCells,descentRoute,descentWorld} from '../../src/underground-switchback-descent.mjs';

const origin={x:192,z:192},depth=-202;
const anchor=descentRoute(origin).find(p=>p.floor===depth);
assert.ok(anchor,'bedrock-margin route anchor exists');
const lx=anchor.x-origin.x,lz=anchor.z-origin.z;
const outward=lz===0?[0,-1]:lz===28?[0,1]:lx===0?[-1,0]:[1,0];
const tangent=[outward[1],-outward[0]];
const pos=(d,t,y)=>[anchor.x+outward[0]*d+tangent[0]*t,y,anchor.z+outward[1]*d+tangent[1]*t];
const read=(cells,d,t,y)=>cells.get(worldKey(...pos(d,t,y)));

for(const seed of [179,1,2026,-77]){
  test('bedrock-margin whisper gallery physical twin lobes seed '+seed,()=>{
    assert.ok(depth>WORLD_MIN_Y+1,'bedrock safety margin');
    const cells=descentCells(origin);
    for(const [d,t] of [[8,-8],[20,-18],[35,-18],[39,-31],[43,-17],[41,-24]]){
      assert.equal(read(cells,d,t,depth),BLOCK.DEEPSTONE,'support '+d+','+t);
      for(let h=1;h<=4;h++)
        assert.equal(read(cells,d,t,depth+h),BLOCK.AIR,'headroom '+d+','+t+','+h);
    }
    const edits=new Map();
    const world={seed,edits,get(x,y,z){return edits.get(worldKey(x,y,z))??BLOCK.STONE;}};
    const reader=descentWorld(world,origin);
    const [x,y,z]=pos(39,-31,depth+1);
    assert.equal(reader.get(x,y,z),BLOCK.AIR);
    edits.set(worldKey(x,y,z),BLOCK.STONE);
    assert.equal(reader.get(x,y,z),BLOCK.STONE,'saved edit overrides gallery');
    edits.delete(worldKey(x,y,z));
    assert.equal(reader.get(x,y,z),BLOCK.AIR);
    assert.equal(reader.get(x,depth-1,z),BLOCK.STONE,'no carve below authored floor');
  });
}
