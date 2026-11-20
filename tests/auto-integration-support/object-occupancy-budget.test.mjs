import test from 'node:test';
import assert from 'node:assert/strict';
import {validateObjectAnchors} from '../../src/auto-integration-support/contracts.mjs';

const fern = (id, x, triangles = 3) => ({
  id: 'object:' + id, anchor:{x,y:0,z:0},
  footprint:[{x:0,y:0,z:0}], triangles, alphaMode:'cutout'
});

test('reject malformed producer occupancy rather than coercing coordinates', () => {
  for (const occupied of [
    [{x:NaN,y:0,z:0}], [{x:0.5,y:0,z:0}],
    [{x:Number.MAX_SAFE_INTEGER+1,y:0,z:0}],
    [null], [{x:0,y:0}]
  ]) {
    assert.equal(validateObjectAnchors([fern('fern',0)],{occupiedCells:occupied}).reason,'invalid-occupied-cell');
  }
});

test('valid occupied world cells still prevent collisions', () => {
  assert.equal(validateObjectAnchors([fern('fern',4)],{
    occupiedCells:[{x:4,y:0,z:0}]
  }).reason,'occupied-footprint');
  assert.deepEqual(validateObjectAnchors([fern('fern',4)],{
    occupiedCells:[{x:3,y:0,z:0}],maxTriangles:3
  }),{ok:true,triangles:3,objectCount:1});
});

test('triangle sums fail exactly at budget boundary without overflow', () => {
  const max=Number.MAX_SAFE_INTEGER;
  assert.deepEqual(validateObjectAnchors([fern('large',0,max-1),fern('tiny',1,1)],{
    maxTriangles:max
  }),{ok:true,triangles:max,objectCount:2});
  assert.equal(validateObjectAnchors([fern('large',0,max),fern('tiny',1,1)],{
    maxTriangles:max
  }).reason,'triangle-budget');
  assert.equal(validateObjectAnchors([fern('large',0,5)],{
    maxTriangles:4
  }).reason,'triangle-budget');
});
