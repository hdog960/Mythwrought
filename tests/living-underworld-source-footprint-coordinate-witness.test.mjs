import test from 'node:test';
import assert from 'node:assert/strict';
import {deriveExpectedUnderpassSourceCoordinates as derive}
 from '../src/living-underworld/source-footprint-coordinate-witness.mjs';
const p=(x,y,z)=>({x,y,z});
const route=(...pts)=>({ok:true,segments:pts.slice(1).map((b,i)=>({a:p(...pts[i]),b:p(...b),radius:3.8}))});
const check=(bridge,pad,floorY)=>derive({bridgeProposal:bridge,centerSidePad:pad,floorY});
test('original 3-wide ten-step bridge has exact support, clearance and full-depth landing sets',()=>{
 const r=check(route([0,-10,0],[10,-10,0]),p(10,-10,0),-11);
 assert.equal(r.ok,true);
 assert.equal(r.bridgeSupportCells,33);
 assert.equal(r.bridgeAirCells,99);
 assert.equal(r.bridgeCells,132);
 assert.equal(r.padCells,135);
 assert.equal(r.expectedOverlapCells,24);
 assert.equal(r.expectedCombinedUniqueCells,243);
 assert.equal(new Set(r.bridgeCoordinates).size,132);
 assert.equal(new Set(r.padCoordinates).size,135);
 assert.equal(r.originalM7WorldAuthenticated,false);
});
test('original seven-grade synthetic route yields 852 bridge cells and 24 reused pad coordinates',()=>{
 const r=check(route([10,-60,0],[80,-53,0]),p(80,-53,0),-54);
 assert.equal(r.ok,true);
 assert.equal(r.bridgeCells,852);
 assert.equal(r.padCells,135);
 assert.equal(r.expectedOverlapCells,24);
 assert.equal(r.expectedCombinedUniqueCells,963);
 assert.equal(r.centerlineSteps,71);
});
test('diagonal and right-angle centerlines are independently rasterized without missing stair support',()=>{
 for(const [path,pad,floor] of [
  [route([0,-20,0],[10,-19,10]),p(10,-19,10),-20],
  [route([0,-20,0],[10,-20,0],[10,-20,10]),p(10,-20,10),-21]
 ]){
  const r=check(path,pad,floor);
  assert.equal(r.ok,true);
  assert.equal(r.bridgeCells,r.bridgeSupportCells+r.bridgeAirCells);
  assert.ok(r.bridgeCells>0);
  assert.ok(r.expectedOverlapCells>=0);
 }
});
test('invalid requested sources and impossible pad coordinates cannot pass',()=>{
 assert.throws(()=>derive(),/Invalid independent underpass/);
 assert.throws(()=>derive({bridgeProposal:route([0,-10,0],[5,-10,0]),
  centerSidePad:p(5,-10,0),floorY:-9}),/Invalid independent underpass/);
 assert.throws(()=>derive({bridgeProposal:route([0,-10,0],[5,-10,0]),
  centerSidePad:p(5,-10,0),floorY:-11,maxCells:134}),/Invalid independent underpass/);
});
test('unsupported rise and vertical-only centerlines refuse without M7 source queries',()=>{
 const tooSteep=check(route([0,-20,0],[2,-15,0]),p(2,-15,0),-16);
 assert.equal(tooSteep.ok,false);
 assert.equal(tooSteep.reason,'EXPECTED_BRIDGE_UNSUPPORTED_GRADE');
 const vertical=check(route([0,-20,0],[0,-19,0]),p(0,-19,0),-20);
 assert.equal(vertical.ok,false);
 assert.equal(vertical.reason,'EXPECTED_BRIDGE_UNSUPPORTED_GRADE');
});
test('unsupported overlap between future bridge supports and headroom refuses',()=>{
 const r=check(route([0,-20,0],[10,-20,0],[0,-18,0]),p(0,-18,0),-19);
 assert.equal(r.ok,false);
 assert.equal(r.reason,'EXPECTED_BRIDGE_SUPPORT_AIR_CONFLICT');
});
test('world bounds and coordinate overflow refuse, not wrap',()=>{
 const world=check(route([0,-209,0],[10,-209,0]),p(10,-209,0),-210);
 assert.equal(world.ok,false);
 assert.equal(world.reason,'EXPECTED_PAD_OUTSIDE_WORLD_BOUNDS');
 const overflow=check(route([Number.MAX_SAFE_INTEGER,-10,0],[Number.MAX_SAFE_INTEGER,-10,10]),
  p(Number.MAX_SAFE_INTEGER,-10,10),-11);
 assert.equal(overflow.ok,false);
 assert.equal(overflow.reason,'EXPECTED_BRIDGE_COORDINATE_OVERFLOW');
});
test('unsupported segments and empty route fail closed',()=>{
 assert.throws(()=>check({ok:true,segments:[]},p(0,-10,0),-11),
  /Invalid independent underpass/);
});
test('immutable output arrays never authorize write, M7 identity, or real walking',()=>{
 const r=check(route([0,-10,0],[10,-10,0]),p(10,-10,0),-11);
 assert.equal(Object.isFrozen(r),true);
 assert.equal(Object.isFrozen(r.bridgeCoordinates),true);
 assert.equal(r.noWorldWrites,true);
 assert.equal(r.worldChanged,false);
 assert.equal(r.sourceReaderIdentityCallerOnly,true);
 assert.throws(()=>r.bridgeCoordinates.push('99,0,99'),TypeError);
});
