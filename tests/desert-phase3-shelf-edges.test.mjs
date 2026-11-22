import assert from 'node:assert/strict';
import {test} from 'node:test';
import {detectHeightShelfRuns} from '../scripts/ci/desert-v7-shelf-edges.mjs';

test('long shelf with changing absolute heights stays one connected edge',()=>{
  const grid=[[1,4],[2,5],[3,6],[4,7],[5,8]];
  const result=detectHeightShelfRuns(grid);
  const longest=result.longest[0];
  assert.equal(longest.axis,'x');
  assert.equal(longest.length,5);
  assert.equal(longest.meanStep,3);
  assert.equal(longest.maxStep,3);
  assert.deepEqual(longest.start,{x:0,z:0});
  assert.deepEqual(longest.end,{x:0,z:4});
});

test('signed cliff direction changes split edge runs, rather than canceling',()=>{
  const grid=[[1,4],[2,5],[4,1],[5,2]];
  const result=detectHeightShelfRuns(grid);
  assert.equal(result.longest[0].length,2);
  assert.ok(result.longest.some(r=>r.axis==='x'&&r.sign===1&&r.length===2));
  assert.ok(result.longest.some(r=>r.axis==='x'&&r.sign===-1&&r.length===2));
});

test('orthogonal z-directed cliff is detected along the x coordinate',()=>{
  const grid=[[2,3,4,5],[5,6,7,8]];
  const result=detectHeightShelfRuns(grid);
  assert.ok(result.longest.some(r=>r.axis==='z'&&r.length===4&&r.maxStep===3));
});

test('one-block cliffs are excluded at threshold two, included at threshold one',()=>{
  const grid=[[1,2],[1,2],[1,2]];
  assert.equal(detectHeightShelfRuns(grid,{minStep:2}).allRunCount,0);
  const result=detectHeightShelfRuns(grid,{minStep:1});
  assert.equal(result.longest[0].length,3);
  assert.equal(result.longest[0].meanStep,1);
});

test('source elevation amplification and protected-veto contacts are reported',()=>{
  const grid=[[1,4],[2,5],[3,6]];
  const legacy=[[1,2],[2,3],[3,4]];
  const protectedColumns=[[false,false],[true,false],[false,false]];
  const longest=detectHeightShelfRuns(grid,{legacy,protectedColumns}).longest[0];
  assert.equal(longest.length,3);
  assert.equal(longest.sourceAmplifiedEdges,3);
  assert.equal(longest.protectedTouches,1);
});

test('invalid mismatched grids and threshold fail closed',()=>{
  assert.throws(()=>detectHeightShelfRuns([[1,2],[3]],{}));
  assert.throws(()=>detectHeightShelfRuns([[1,2],[3,4]],{legacy:[[1,2]]}));
  assert.throws(()=>detectHeightShelfRuns([[1,2],[3,4]],{minStep:0}));
});

test('real cave-air aperture breaks a shelf without fabricating a zero-height floor',()=>{
  const grid=[[1,4],[null,5],[3,6],[4,7]];
  const legacy=[[1,2],[2,3],[3,4],[4,5]];
  const result=detectHeightShelfRuns(grid,{legacy});
  assert.equal(result.longest[0].length,2);
  assert.ok(result.longest.every(run=>run.length<=2));
  assert.deepEqual(result.longest[0].start,{x:0,z:2});
  assert.throws(()=>detectHeightShelfRuns(grid,{legacy:[[1,2],[2,null],[3,4],[4,5]]}));
});
