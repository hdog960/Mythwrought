import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,worldKey} from '../src/voxel.mjs';
import {descentCells,descentRoute,descentWorld} from '../src/underground-switchback-descent.mjs';

const origin={x:192,z:192};
const anchor=descentRoute(origin).find(p=>p.floor===-190);
assert.ok(anchor,'deepest-band amphitheater anchor must exist');
const lx=anchor.x-origin.x,lz=anchor.z-origin.z;
const outward=lz===0?[0,-1]:lz===28?[0,1]:lx===0?[-1,0]:[1,0];
const tangent=[outward[1],-outward[0]];
const pos=(d,t,y)=>[anchor.x+outward[0]*d+tangent[0]*t,y,anchor.z+outward[1]*d+tangent[1]*t];
const read=(cells,d,t,y)=>cells.get(worldKey(...pos(d,t,y)));

for(const seed of [179,1,2026,-77]){
  test('folded-fault amphitheater supports both routes and destination seed '+seed,()=>{
    const cells=descentCells(origin);
    for(const [d,t] of [[8,0],[14,0],[24,-9],[24,9],[34,13],[54,0],[63,3],[70,3],[35,-32]]){
      assert.equal(read(cells,d,t,-190),BLOCK.DEEPSTONE,'floor at '+d+','+t);
      for(let h=1;h<=4;h++)
        assert.equal(read(cells,d,t,-190+h),BLOCK.AIR,'headroom '+d+','+t+','+h);
    }
    // The older Crescent Refuge occupies the -190 plane here: this is
    // protected standing AIR, not an amphitheater floor. A later cavern
    // must not fill it merely to satisfy its own floor witness.
    assert.equal(read(cells,34,-13,-190),BLOCK.AIR,
      'older refuge headroom must remain AIR at the shared coordinate');
    const edits=new Map();
    const world={seed,edits,get(x,y,z){return edits.get(worldKey(x,y,z))??BLOCK.STONE;}};
    const reader=descentWorld(world,origin);
    const [x,y,z]=pos(63,3,-189);
    assert.equal(reader.get(x,y,z),BLOCK.AIR);
    edits.set(worldKey(x,y,z),BLOCK.STONE);
    assert.equal(reader.get(x,y,z),BLOCK.STONE,'saved edit must win');
    edits.delete(worldKey(x,y,z));
    assert.equal(reader.get(x,y,z),BLOCK.AIR,'clearing edit restores cave');
  });
}
