// :48 isolated exact-triangle interaction coverage for every shrub variant.
// No production renderer, saves or interaction APIs are modified.
import test from 'node:test';
import assert from 'node:assert/strict';
import {makeShrubBreakFixture} from '../src/nonblock-scene48/shrub-break-fixture.mjs';
import {prepareNonblockDrawBatches} from '../src/nonblock-scene48/bounded-draw-batches.mjs';

function surfaceRay(object){
 const p=object.mesh.positions, a=object.anchor;
 for(let i=0;i<p.length;i+=9){
  const v=[0,3,6].map(offset=>[0,1,2].map(axis=>p[i+offset+axis]+a[axis]));
  const u=v[1].map((n,k)=>n-v[0][k]),w=v[2].map((n,k)=>n-v[0][k]);
  const n=[u[1]*w[2]-u[2]*w[1],u[2]*w[0]-u[0]*w[2],u[0]*w[1]-u[1]*w[0]];
  const magnitude=Math.hypot(...n);
  if(magnitude<1e-8)continue;
  const unit=n.map(x=>x/magnitude);
  const center=[0,1,2].map(k=>(v[0][k]+v[1][k]+v[2][k])/3);
  return {origin:center.map((x,k)=>x+unit[k]*0.1),direction:unit.map(x=>-x)};
 }
 throw new Error('shrub has no pickable triangle');
}
const placements=[1,2,3].map((variant,i)=>({anchor:[i*12,0,0],variant}));
const view=[[-5,-5,-5],[35,10,5]];
test('all three shaped shrub variants support actual ray break, tombstones and reload',()=>{
 const fixture=makeShrubBreakFixture(179,placements);
 const initial=fixture.visible();
 assert.equal(initial.length,3);
 const rays=initial.map(surfaceRay);
 for(let i=0;i<3;i++){
  const ray=rays[i];
  assert.equal(fixture.pickRay(ray.origin,ray.direction,0.5)?.instanceKey,initial[i].instanceKey);
  assert.equal(fixture.breakRay(ray.origin,ray.direction,0.5)?.instanceKey,initial[i].instanceKey);
  assert.equal(fixture.pickRay(ray.origin,ray.direction,0.5),null);
  assert.equal(fixture.breakByKey(initial[i].instanceKey),false);
  assert.equal(fixture.visible().length,2-i);
  const restored=makeShrubBreakFixture(179,placements,JSON.parse(JSON.stringify(fixture.snapshot())));
  assert.deepEqual(restored.visible().map(x=>x.instanceKey),fixture.visible().map(x=>x.instanceKey));
  assert.equal(prepareNonblockDrawBatches(restored.visible(),view).visibleCount,2-i);
 }
 const restored=makeShrubBreakFixture(179,placements,JSON.parse(JSON.stringify(fixture.snapshot())));
 assert.equal(restored.visible().length,0);
 assert.equal(prepareNonblockDrawBatches(restored.visible(),view).visibleCount,0);
 assert.equal(makeShrubBreakFixture(180,placements).visible().length,3);
});
