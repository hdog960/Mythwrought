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

test('authentic source reason grid separates protected-air, protected-solid and safe cliffs',()=>{
  // Three signed steep horizontal edges, one protected AIR, one landmark
  // solid, one unprotected; exact physical height changes persist.
  const grid=[[1,4],[2,5],[3,6]];
  const legacy=[[1,2],[2,3],[3,4]];
  const protectedColumns=[[true,false],[false,true],[false,false]];
  const protectionReasons=[['air','none'],['none','solid'],['none','none']];
  const result=detectHeightShelfRuns(grid,{
    legacy,protectedColumns,protectionReasons});
  assert.equal(result.edgeCensus.totalSteepEdges,3);
  assert.equal(result.edgeCensus.protectedEdges,2);
  assert.equal(result.edgeCensus.protectedAirEdges,1);
  assert.equal(result.edgeCensus.protectedSolidEdges,1);
  assert.equal(result.edgeCensus.unprotectedEdges,1);
  assert.equal(result.edgeCensus.unprotectedSourceAmplifiedEdges,1);
  assert.equal(result.edgeCensus.unprotectedMaxStep,3);
  assert.equal(result.edgeCensus.unprotectedStepCounts['3'],1);
  assert.equal(result.longest[0].protectedTouches,2);
  assert.equal(result.longest[0].unprotectedEdges,1);
  assert.equal(result.longest[0].protectedAirEdges,1);
  assert.equal(result.longest[0].protectedSolidEdges,1);
});

test('unprotected continuous cliffs are ranked separately, not hidden by protected cliffs',()=>{
  const grid=[[1,4,5,8],[2,5,6,9],[3,6,7,10]];
  const protectedColumns=[[true,true,false,false],
    [true,true,false,false],[true,true,false,false]];
  const protectionReasons=protectedColumns.map(row=>row.map(b=>b?'air':'none'));
  const result=detectHeightShelfRuns(grid,{protectedColumns,protectionReasons});
  assert.equal(result.longestUnprotected[0].length,3);
  assert.equal(result.longestUnprotected[0].protectedTouches,0);
  assert.ok(result.longest.some(run=>run.protectedTouches>0));
});

test('malformed source protection reason grids fail closed',()=>{
  const grid=[[1,4],[2,5]];
  const protectedColumns=[[true,false],[false,false]];
  assert.throws(()=>detectHeightShelfRuns(grid,{
    protectedColumns,protectionReasons:[['none','none'],['none','none']]}));
  assert.throws(()=>detectHeightShelfRuns(grid,{
    protectedColumns,protectionReasons:[['air','none'],['cave','none']]}));
  assert.throws(()=>detectHeightShelfRuns(grid,{
    protectionReasons:[['air'],['none','none']]}));
});

test('protected apertures cannot be counted as unprotected clifflines',()=>{
  const grid=[[1,4],[null,5],[4,7],[4,7]];
  const protectedColumns=[[true,false],[true,false],[false,false],[false,false]];
  const protectionReasons=[['air','none'],['air','none'],
    ['none','none'],['none','none']];
  const result=detectHeightShelfRuns(grid,{protectedColumns,protectionReasons});
  // The right-hand column also contains one genuine perpendicular
  // 5→7 elevation, so four steep edges exist, not just the three x-edges.
  assert.equal(result.edgeCensus.totalSteepEdges,4);
  assert.equal(result.edgeCensus.protectedEdges,1);
  assert.equal(result.edgeCensus.unprotectedEdges,3);
  assert.equal(result.longestUnprotected[0].length,2);
  assert.ok(result.longestUnprotected.some(run=>run.axis==='z'&&run.length===1));
});

test('unprotected subsections inside long mixed-protection cliffs must not disappear',()=>{
  const grid=[[1,4],[2,5],[3,6],[4,7],[5,8]];
  const protectionReasons=[['none','none'],['none','none'],
    ['air','none'],['none','none'],['none','none']];
  const protectedColumns=protectionReasons.map(row=>row.map(k=>k!=='none'));
  const r=detectHeightShelfRuns(grid,{protectedColumns,protectionReasons});
  assert.equal(r.longest[0].length,5);
  assert.equal(r.longest[0].protectedTouches,1);
  assert.equal(r.edgeCensus.protectedEdges,1);
  assert.equal(r.edgeCensus.unprotectedEdges,4);
  assert.equal(r.longestUnprotected.length,2);
  assert.deepEqual(r.longestUnprotected.map(s=>s.length),[2,2]);
  assert.deepEqual(r.longestUnprotected.map(s=>s.start.z),[0,3]);
});
