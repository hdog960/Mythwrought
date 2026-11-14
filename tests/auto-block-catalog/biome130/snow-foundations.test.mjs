import test from 'node:test';
import assert from 'node:assert/strict';
import {SNOW_IDS,snowCandidate,snowFaceSample,snowFixture} from '../../../src/auto-block-catalog/biome130/snow-foundations.mjs';
test('stable symbolic identities, future-only IDs, and physical targeting',()=>{
 assert.deepEqual(SNOW_IDS,['biome130:016','biome130:017','biome130:018']);
 for(let i=0;i<3;i++){const d=snowCandidate(SNOW_IDS[i]);assert.equal(d.proposedFutureId,271+i);assert.equal(d.physical.targetable,true);
  assert.equal(d.physical.removable,true);assert.equal(d.status,'BLOCKED BY ENGINE');
  for(const b of d.shape.boxes){assert.equal(b.length,6);for(const v of b)assert.ok(v>=0&&v<=1);assert.ok(b[0]<b[3]&&b[1]<b[4]&&b[2]<b[5]);}}
 assert.equal(snowCandidate(SNOW_IDS[1]).physical.solid,true);
 assert.equal(snowCandidate(SNOW_IDS[0]).physical.solid,false);
});
test('all four rotations are bounded and reversible',()=>{
 for(const id of SNOW_IDS){const a=snowCandidate(id,0);
  for(let r=0;r<4;r++){const d=snowCandidate(id,r);assert.equal(d.shape.boxes.length,a.shape.boxes.length);assert.ok(d.shape.bounds.every(v=>v>=0&&v<=1));}
  assert.deepEqual(snowCandidate(id,0),snowCandidate(id,0));}
 assert.throws(()=>snowCandidate(SNOW_IDS[0],4),RangeError);
});
test('six-face deterministic material sampling with differentiated surfaces',()=>{
 for(const id of SNOW_IDS){for(let face=0;face<6;face++){const a=snowFaceSample(id,face,.32,.76,11);
 assert.equal(a,snowFaceSample(id,face,.32,.76,11));assert.ok(snowCandidate(id).material.palette.includes(a));}}
 assert.notEqual(snowCandidate(SNOW_IDS[0]).material.texture,snowCandidate(SNOW_IDS[1]).material.texture);
});
test('independent select, remove and reversible isolated snapshot',()=>{
 const a=snowFixture();assert.equal(a.place(0,2,-1,SNOW_IDS[0],2),true);
 assert.equal(a.place(0,2,-1,SNOW_IDS[1]),false);assert.equal(a.place(1,2,-1,SNOW_IDS[2],3),true);
 const snapshot=a.snapshot(),b=snowFixture();b.restore(snapshot);assert.equal(b.snapshot(),snapshot);
 assert.deepEqual(b.select(0,2,-1),{id:SNOW_IDS[0],rotation:2});
 assert.deepEqual(b.remove(0,2,-1),{id:SNOW_IDS[0],rotation:2});assert.equal(b.select(0,2,-1),null);
 assert.throws(()=>b.place(.5,0,0,SNOW_IDS[0]),TypeError);
 assert.throws(()=>b.restore('[["0,0,0",{"id":"biome130:999","rotation":0}]]'),RangeError);
});
