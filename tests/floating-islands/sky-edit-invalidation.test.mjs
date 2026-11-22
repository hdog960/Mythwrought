import test from 'node:test';
import assert from 'node:assert/strict';
import {planSkyIslandEditInvalidation as plan} from '../../src/floating-islands/sky-edit-invalidation.mjs';
const sky=(...s)=>new Set(s.map(([cx,cz,i])=>`sky:${cx},${cz},${i}`));
const ground=(...s)=>new Set(s.map(([cx,cz])=>`${cx},${cz}`));

test('Y35/36 edits invalidate both adjacent upper sections',()=>{
  const loadedSkyKeys=sky([0,0,0],[0,0,1]);
  for(const y of [35,36])
    assert.deepEqual(plan({x:4,y,z:4,loadedSkyKeys,loadedGroundKeys:ground()}).skyKeys,
      ['sky:0,0,0','sky:0,0,1']);
});
test('negative horizontal chunk boundary invalidates only real face-adjacent chunks',()=>{
  const loadedSkyKeys=sky([-1,-1,3],[0,-1,3],[-1,0,3],[0,0,3]);
  const r=plan({x:0,y:70,z:0,loadedSkyKeys,loadedGroundKeys:ground()});
  assert.deepEqual(r.skyKeys,['sky:0,0,3','sky:-1,0,3','sky:0,-1,3']);
});
test('sky Y20 and ground Y19 edit retain original surface seam correctness',()=>{
  const loadedSkyKeys=sky([0,0,0]),loadedGroundKeys=ground([0,0]);
  for(const y of [19,20]){
    const r=plan({x:5,y,z:5,loadedSkyKeys,loadedGroundKeys});
    assert.deepEqual(r.skyKeys,['sky:0,0,0']);
    assert.deepEqual(r.groundKeys,['0,0']);
  }
});
test('no upper mesh invalidation for unsupported outside upper-world edits',()=>{
  for(const y of [-150,18,257,700]){
    const r=plan({x:1,y,z:1,loadedSkyKeys:sky([0,0,0]),loadedGroundKeys:ground([0,0])});
    assert.deepEqual(r.skyKeys,[]);assert.deepEqual(r.groundKeys,[]);
  }
});
test('only resident mesh keys returned for far away coordinates and chunk seams',()=>{
  const r=plan({x:12000,y:244,z:-12800,loadedSkyKeys:sky([750,-800,14]),loadedGroundKeys:ground()});
  assert.deepEqual(r.skyKeys,['sky:750,-800,14']);
  assert.equal(new Set(r.skyKeys).size,1);
});
test('invalid or forged inputs are rejected without mutation',()=>{
  assert.throws(()=>plan({x:NaN,y:20,z:1,loadedSkyKeys:new Set(),loadedGroundKeys:new Set()}));
  assert.throws(()=>plan({x:1,y:20,z:1,loadedSkyKeys:['sky:0,0,0'],loadedGroundKeys:new Set()}));
});
