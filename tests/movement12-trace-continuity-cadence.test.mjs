import test from 'node:test';
import assert from 'node:assert/strict';
import { auditTraceContinuity } from '../src/movement12/trace-continuity.mjs';

const record = (fps, seconds=1, speed=4) => ({
  samples: Array.from({length: Math.round(fps*seconds)+1}, (_, i) => ({
    time: i/fps,
    position: {x: speed*i/fps, z: 0, feet: 1}
  }))
});

for (const fps of [30,60,120]) {
  test(`continuous frame-rate proxy at ${fps} FPS`, () => {
    const result = auditTraceContinuity(record(fps));
    assert.deepEqual(result, {safe:true,reason:'continuous',index:-1});
  });
  test(`intermediate teleport detected at ${fps} FPS even when endpoint recovers`, () => {
    const data=record(fps);
    const index=Math.floor(data.samples.length/2);
    data.samples[index].position.x+=10;
    const result=auditTraceContinuity(data);
    assert.equal(result.safe,false);
    assert.equal(result.reason,'horizontal-discontinuity');
    assert.equal(result.index,index);
    assert.equal(data.samples.at(-1).position.x,4);
  });
}
test('diagonal movement uses Euclidean horizontal speed',()=>{
  const samples=[{time:0,position:{x:0,z:0,feet:1}},{time:.05,position:{x:.8,z:.8,feet:1}}];
  const result=auditTraceContinuity({samples});
  assert.equal(result.reason,'horizontal-discontinuity');
  assert.equal(result.index,1);
});
test('valid negative-coordinate travel is accepted',()=>{
  const samples=[{time:0,position:{x:-10,z:-10,feet:-2}},{time:.05,position:{x:-10.1,z:-10.1,feet:-2.1}}];
  assert.equal(auditTraceContinuity({samples}).safe,true);
});
test('nonfinite z is rejected with offending index',()=>{
  const data=record(60);
  data.samples[7].position.z=Infinity;
  assert.deepEqual(auditTraceContinuity(data),{safe:false,reason:'nonfinite-frame',index:7});
});
test('time gaps are rejected independently of displacement',()=>{
  const data=record(60);
  data.samples[1].time=.5;
  assert.deepEqual(auditTraceContinuity(data),{safe:false,reason:'missing-interval',index:1});
});
