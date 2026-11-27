import test from 'node:test';
import assert from 'node:assert/strict';
import {buildResonanceVisualBatch as build,RESONANCE_VISUAL} from '../../../src/liquids/liquid-resonance/content/visuals.mjs';
const cell=(x,y,z,units=8,energy=units*1024)=>Object.freeze({x,y,z,id:'liquid-resonance',units,quantities:Object.freeze(energy?{'resonance-energy':energy}:{})});
// Fixture reader implements only the pinned A validator's public return contract.
const opts=(over={})=>({candidates:[[0,0,0]],origin:[0,0,0],readCell:cell,readResonanceCell:c=>c,isLoaded:()=>true,isOpen:()=>true,...over});
test('distinct material and deterministic animated internal geometry',()=>{
  const a=build(opts()),b=build(opts()),c=build(opts({phase:.25}));
  assert.equal(RESONANCE_VISUAL.id,'liquid-resonance');assert.equal(a.segmentCount,8);assert.equal(a.particleCount,2);
  assert.deepEqual(a.segments,b.segments);assert.deepEqual(a.particles,b.particles);assert.notDeepEqual(a.segments,c.segments);
});
test('partial fill contains every filament endpoint and mote',()=>{
  for(let units=1;units<=8;units++){
    const r=build(opts({readCell:(x,y,z)=>cell(x,y,z,units),phase:.89}));
    for(let i=0;i<r.segments.length;i+=7)for(const j of [i,i+3]){
      assert.ok(r.segments[j]>0&&r.segments[j]<1);assert.ok(r.segments[j+1]>0&&r.segments[j+1]<units/8);assert.ok(r.segments[j+2]>0&&r.segments[j+2]<1);
    }
    for(let i=0;i<r.particles.length;i+=5){const [x,y,z,radius]=r.particles.subarray(i,i+5);assert.ok(x-radius>0&&x+radius<1&&z-radius>0&&z+radius<1&&y-radius>0&&y+radius<units/8);}
  }
});
test('foreign, unloaded, obstructed and out-of-range records never render',()=>{
  const visited=[];const r=build(opts({candidates:[[0,0,0],[1,0,0],[2,0,0],[3,0,0],[3000,0,0]],isLoaded:x=>x!==1,isOpen:x=>x!==2,
    readCell:(x,y,z)=>{visited.push(x);return x===3?{id:'water'}:cell(x,y,z);}}));
  assert.deepEqual(visited,[0,3]);assert.equal(r.cells,1);
});
test('budget caps, unique candidates, and no allocation beyond caps',()=>{
  const candidates=Array.from({length:50},(_,i)=>[i,0,0]);candidates.unshift([0,0,0]);
  const r=build(opts({candidates,maxCells:3,maxSegments:5,maxParticles:3}));
  assert.equal(r.cells,2);assert.equal(r.segmentCount,4);assert.equal(r.particleCount,3);assert.equal(r.segments.buffer.byteLength,5*7*4);assert.equal(r.particles.buffer.byteLength,3*5*4);
  assert.equal(build(opts({maxCells:0})).cells,0);assert.throws(()=>build(opts({candidates:Array(2049).fill([0,0,0])})),RangeError);
});
test('zero energy is still resonance, with no motes or invented charge',()=>{
  const c=cell(0,0,0,4,0),r=build(opts({readCell:()=>c}));
  assert.equal(r.segmentCount,8);assert.equal(r.particleCount,0);assert.ok(r.segments[6]<.13);assert.deepEqual(c.quantities,{});
});
test('invalid peer record or validator failure is isolated',()=>{
  const r=build(opts({candidates:[[0,0,0],[1,0,0],[2,0,0],[0,257,0]],readCell:(x,y,z)=>x===1?cell(x,y,z,1,1025):cell(x,y,z),
    readResonanceCell:c=>{if(c.x===0)throw Error('invalid');return c;}}));
  assert.equal(r.invalid,3);assert.equal(r.cells,1);
});
test('origin-relative precision and physical envelope',()=>{
  const origin=[2**40,256,-(2**40)],r=build(opts({origin,candidates:[origin,[origin[0],257,origin[2]]]}));
  assert.equal(r.cells,1);assert.equal(r.invalid,1);assert.ok(r.segments[0]>0&&r.segments[0]<1);
  assert.throws(()=>build(opts({phase:1})),RangeError);assert.throws(()=>build(opts({maxParticles:513})),RangeError);
});
