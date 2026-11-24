// #291 isolated native original-vs-experimental mesh byte parity.
// Run only after authentic repository checkout: node --test perf/issue-291/depth-face-parity.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK} from '../../src/voxel.mjs';
import {sectionBounds} from '../../src/depth.mjs';
import {meshDepthSection} from '../../src/depth-mesh.mjs';
import {meshDepthSection291} from '../../src/depth-mesh-291.mjs';
import {ENVIRONMENT_GROUND,environmentGround} from '../../src/environment-ground.mjs';
import {BIOME130_REGISTERED_IDS,isBiome130BlockId} from '../../src/biome130-registry.mjs';
import {pack2NormalizeState,isPack2LiveId} from '../../src/pack2-integration.mjs';

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


test('direct halo indices preserve six axial neighbors at both ends of trimmed bottom section',()=>{
  const {minY,maxY}=sectionBounds(-13);
  for(const [cx,cz] of [[0,0],[-3,2],[-2,-4]]){
    const traceA=[],traceB=[],x0=cx*16,z0=cz*16;
    const fixture=trace=>({get(x,y,z){
      trace.push([x,y,z]);
      return (x===x0||x===x0+15)&&(z===z0||z===z0+15)&&
        (y===minY||y===maxY)?BLOCK.DEEPSTONE:BLOCK.AIR;
    }});
    parity(fixture(traceA),fixture(traceB),cx,cz,-13);
    assert.deepEqual(traceB,traceA);
    for(const [x,y,z] of traceB){
      assert.ok(x>=x0-1&&x<=x0+16&&z>=z0-1&&z<=z0+16);
      assert.ok(y>=minY-1&&y<=maxY+1);
    }
  }
});
test('solid negative chunk with one mined boundary cell preserves lazy source read order',()=>{
  const {minY,maxY}=sectionBounds(-2),cx=-2,cz=-3;
  for(const target of [[-32,minY,-48],[-17,maxY,-33],[-24,minY+5,-40]]){
    const traceA=[],traceB=[];
    const fixture=trace=>({get(x,y,z){
      trace.push([x,y,z]);
      return x===target[0]&&y===target[1]&&z===target[2]?BLOCK.AIR:BLOCK.STONE;
    }});
    parity(fixture(traceA),fixture(traceB),cx,cz,-2);
    assert.deepEqual(traceB,traceA);
  }
});
test('direct index cache retains original Uint16 sentinel and first-read coercion behavior',()=>{
  // Deliberately non-production IDs stress the original cache contract:
  // sentinel rereads and Uint16 truncation on later cache hits.
  const traceA=[],traceB=[];
  const ids=[0,3,8,65535,65536];
  const fixture=trace=>({get(x,y,z){
    trace.push([x,y,z]);
    return ids[Math.abs(x*19+y*17+z*23)%ids.length];
  }});
  parity(fixture(traceA),fixture(traceB),-1,2,-1);
  assert.deepEqual(traceB,traceA);
});
test('cache miss exception propagates at identical axial source read without retry',()=>{
  const {minY}=sectionBounds(-1);
  const target=[1,minY,0],marker=new Error('original source read failure');
  const traces=[[],[]];
  for(const [i,mesh] of [meshDepthSection,meshDepthSection291].entries()){
    const world={get(x,y,z){
      traces[i].push([x,y,z]);
      if(x===target[0]&&y===target[1]&&z===target[2])throw marker;
      return BLOCK.STONE;
    }};
    assert.throws(()=>mesh(world,0,0,-1),error=>error===marker);
  }
  assert.deepEqual(traces[1],traces[0]);
  assert.deepEqual(traces[1].at(-1),target);
});


test('actual rock registry contract disjoint from Pack2 biome and environment IDs',()=>{
  for(const id of [BLOCK.STONE,BLOCK.DEEPSTONE]){
    assert.equal(isPack2LiveId(id),false);
    assert.equal(isBiome130BlockId(id),false);
    assert.equal(environmentGround(id),undefined);
  }
});
test('hot rock path preserves source reads for solid and mined stone/deepstone',()=>{
  for(const id of [BLOCK.STONE,BLOCK.DEEPSTONE]){
    for(const s of [-1,-13]){
      const {minY,maxY}=sectionBounds(s),cx=-1,cz=1;
      for(const cavity of [false,true]){
        const traces=[[],[]];
        const fixture=trace=>({get(x,y,z){
          trace.push([x,y,z]);
          return cavity&&((x+y+z)%7===0||y===minY||y===maxY)?BLOCK.AIR:id;
        }});
        parity(fixture(traces[0]),fixture(traces[1]),cx,cz,s);
        assert.deepEqual(traces[1],traces[0]);
      }
    }
  }
});
test('rock next to actual water and environment ground preserves material faces and reads',()=>{
  const ids=[BLOCK.STONE,BLOCK.DEEPSTONE,BLOCK.AIR,76,ENVIRONMENT_GROUND.slate];
  for(const [cx,cz,s] of [[0,0,-1],[-2,3,-13]]){
    const traces=[[],[]];
    const fixture=trace=>({get(x,y,z){
      trace.push([x,y,z]);
      return ids[Math.abs(x*19+y*17+z*23)%ids.length];
    }});
    parity(fixture(traces[0]),fixture(traces[1]),cx,cz,s);
    assert.deepEqual(traces[1],traces[0]);
  }
});
