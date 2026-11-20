import test from 'node:test';
import assert from 'node:assert/strict';
import {makeShrubBreakFixture,SHRUB_FIXTURE_VERSION} from '../src/nonblock-scene48/shrub-break-fixture.mjs';
import {prepareNonblockDrawBatches} from '../src/nonblock-scene48/bounded-draw-batches.mjs';
const specs=[{anchor:[2,3,4],variant:1},{anchor:[8,3,4],variant:3}];
function guaranteedRay(obj){
 const p=obj.mesh.positions,a=obj.anchor;
 for(let i=0;i<p.length;i+=9){
  const v=[0,3,6].map(j=>[0,1,2].map(k=>p[i+j+k]+a[k]));
  const u=v[1].map((x,k)=>x-v[0][k]),w=v[2].map((x,k)=>x-v[0][k]);
  const n=[u[1]*w[2]-u[2]*w[1],u[2]*w[0]-u[0]*w[2],u[0]*w[1]-u[1]*w[0]];
  const len=Math.hypot(...n);if(len<1e-8)continue;
  const unit=n.map(x=>x/len),center=[0,1,2].map(k=>(v[0][k]+v[1][k]+v[2][k])/3);
  return {origin:center.map((x,k)=>x+unit[k]*.1),direction:unit.map(x=>-x)};
 }
 throw new Error('no nondegenerate triangle');
}
test('shrub exact triangle selection, break and reload exclude only removed instance',()=>{
 const f=makeShrubBreakFixture(91,specs);
 assert.equal(f.visible().length,2);
 const target=f.visible()[0],ray=guaranteedRay(target);
 assert.equal(f.pickRay(ray.origin,ray.direction,.5)?.instanceKey,target.instanceKey);
 assert.equal(f.breakRay(ray.origin,ray.direction,.5)?.instanceKey,target.instanceKey);
 assert.equal(f.breakByKey(target.instanceKey),false);
 const saved=JSON.parse(JSON.stringify(f.snapshot()));
 assert.equal(saved.contract,SHRUB_FIXTURE_VERSION);
 const restored=makeShrubBreakFixture(91,specs,saved);
 assert.deepEqual(restored.visible().map(x=>x.instanceKey),[f.visible()[0].instanceKey]);
 const batches=prepareNonblockDrawBatches(restored.visible(),[[-20,-20,-20],[20,20,20]]);
 assert.equal(batches.visibleCount,1);
 assert.equal(makeShrubBreakFixture(92,specs).visible().length,2);
});
test('shrub tombstones fail closed for foreign seed, unknown keys and duplicates',()=>{
 const f=makeShrubBreakFixture(91,specs);
 const key=f.visible()[0].instanceKey;
 const good={contract:SHRUB_FIXTURE_VERSION,seed:91,removed:[key]};
 assert.equal(makeShrubBreakFixture(91,specs,good).visible().length,1);
 for(const bad of [{...good,seed:92},{...good,removed:['unknown']},
  {...good,removed:[key,key]},{...good,contract:'wrong'},{...good,removed:null}]){
  assert.throws(()=>makeShrubBreakFixture(91,specs,bad),TypeError);
 }
 assert.throws(()=>makeShrubBreakFixture(91,[specs[0],specs[0]]),/duplicate/);
 assert.throws(()=>makeShrubBreakFixture(91,[{anchor:[2,3,4],variant:1},{anchor:[2,3,4],variant:2}]),/duplicate/);
 assert.equal(f.visible().length,2);
});
