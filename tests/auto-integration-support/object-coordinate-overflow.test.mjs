import test from 'node:test';
import assert from 'node:assert/strict';
import {validateObjectAnchors} from '../../src/auto-integration-support/contracts.mjs';

const object=(anchor,footprint=[{x:0,y:0,z:0}])=>({
  id:'object:anchor-test',anchor,footprint,triangles:12,alphaMode:'cutout'
});
test('rejects unsafe positive and negative anchor-plus-offset coordinates',()=>{
  const max=Number.MAX_SAFE_INTEGER;
  assert.deepEqual(validateObjectAnchors([object({x:max,y:0,z:0},[{x:1,y:0,z:0}])]).reason,'footprint-coordinate-overflow');
  assert.deepEqual(validateObjectAnchors([object({x:-max,y:0,z:0},[{x:-1,y:0,z:0}])]).reason,'footprint-coordinate-overflow');
  assert.deepEqual(validateObjectAnchors([object({x:0,y:max,z:0},[{x:0,y:1,z:0}])]).reason,'footprint-coordinate-overflow');
  assert.deepEqual(validateObjectAnchors([object({x:0,y:0,z:-max},[{x:0,y:0,z:-1}])]).reason,'footprint-coordinate-overflow');
});
test('safe boundary cells and ordinary negative world-depth anchors remain valid',()=>{
  const max=Number.MAX_SAFE_INTEGER;
  assert.equal(validateObjectAnchors([object({x:max-1,y:-210,z:0},[{x:1,y:0,z:0}])]).ok,true);
  assert.equal(validateObjectAnchors([object({x:-16,y:-210,z:8})]).ok,true);
});
test('overlapping offsets remain rejected without mutating source descriptors',()=>{
  const o=object({x:1,y:2,z:3},[{x:0,y:0,z:0},{x:0,y:0,z:0}]);
  const before=JSON.stringify(o);
  assert.equal(validateObjectAnchors([o]).reason,'occupied-footprint');
  assert.equal(JSON.stringify(o),before);
});
