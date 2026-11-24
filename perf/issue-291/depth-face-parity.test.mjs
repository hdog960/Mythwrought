// #291 isolated native original-vs-experimental mesh byte parity.
// Run only after authentic repository checkout: node --test perf/issue-291/depth-face-parity.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK} from '../../src/voxel.mjs';
import {sectionBounds} from '../../src/depth.mjs';
import {meshDepthSection} from '../../src/depth-mesh.mjs';
import {meshDepthSection291} from '../../src/depth-mesh-291.mjs';
import {ENVIRONMENT_GROUND} from '../../src/environment-ground.mjs';
import {BIOME130_REGISTERED_IDS} from '../../src/biome130-registry.mjs';
import {pack2NormalizeState} from '../../src/pack2-integration.mjs';

function parity(a,b,cx,cz,section){
  const expected=meshDepthSection(a,cx,cz,section);
  const actual=meshDepthSection291(b,cx,cz,section);
  assert.equal(actual.length,expected.length);
  assert.deepEqual(Buffer.from(actual.buffer,actual.byteOffset,actual.byteLength),
    Buffer.from(expected.buffer,expected.byteOffset,expected.byteLength));
}
test('original actual VoxelWorld two seeds and deep seams match byte-for-byte',()=>{
  for(const seed of [179,2026]){
    const world=new VoxelWorld(seed);
    for(const [cx,cz,s] of [[0,0,-1],[-1,1,-2],[1,-1,-13]])
      parity(world,world,cx,cz,s);
  }
});
test('original actual VoxelWorld with explicit deep AIR edits matches',()=>{
  for(const seed of [179,2026]){
    const world=new VoxelWorld(seed);
    for(const [x,y,z] of [[0,-20,0],[-1,-19,0],[0,-21,-1]]){
      assert.equal(world.set(x,y,z,BLOCK.AIR),true);
    }
    for(const [cx,cz,s] of [[0,0,-1],[0,0,-2],[-1,0,-1],[0,-1,-2]])
      parity(world,world,cx,cz,s);
  }
});
test('real source dependencies mixed material fixture preserves ordered voxel reads',()=>{
  const ground=Object.values(ENVIRONMENT_GROUND);
  const ids=[0,0,1,2,3,4,5,6,7,8,60,76,...ground,...BIOME130_REGISTERED_IDS.slice(0,4)];
  for(const seed of [179,2026]){
    const traceA=[],traceB=[];
    const fixture=trace=>({
      get(x,y,z){
        trace.push([x,y,z]);
        return ids[Math.abs((x*73856093^y*19349663^z*83492791^seed)|0)%ids.length];
      },
      getPack2State(){return pack2NormalizeState(60);},
      rotationAt(){return 0;}
    });
    parity(fixture(traceA),fixture(traceB),-1,1,-2);
    assert.deepEqual(traceB,traceA);
  }
});
test('empty, solid and single exposed cells use original byte layout',()=>{
  const {minY,maxY}=sectionBounds(-1);
  for(const kind of ['empty','solid','single','seam']){
    const world={get:(x,y,z)=>{
      if(kind==='empty')return 0;
      if(kind==='solid')return 3;
      if(kind==='single')return x===0&&y===minY&&z===0?3:0;
      return x===15&&y===maxY&&z===15?8:0;
    }};
    parity(world,world,0,0,-1);
  }
});
test('invalid deep requests retain original exception contract',()=>{
  for(const args of [[null,0,0,-1],[{get:()=>0},0,0,0],[{get:()=>0},.5,0,-1]]){
    assert.throws(()=>meshDepthSection(...args));
    assert.throws(()=>meshDepthSection291(...args));
  }
});
