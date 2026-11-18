import test from 'node:test';
import assert from 'node:assert/strict';
import {makeForestExactBreakFixture} from '../src/nonblock-scene48/forest-exact-break-fixture.mjs';

const specs=[
 {sceneId:'scene48:exposed-root',seed:179,anchor:[0,0,0]},
 {sceneId:'scene48:fallen-branch',seed:179,anchor:[5,0,0]}
];
function surfaceRay(obj){
 const p=obj.mesh.positions, a=obj.anchor;
 const v=[0,3,6].map(i=>[p[i]+a[0],p[i+1]+a[1],p[i+2]+a[2]]);
 const e=v[1].map((n,i)=>n-v[0][i]),f=v[2].map((n,i)=>n-v[0][i]);
 const n=[e[1]*f[2]-e[2]*f[1],e[2]*f[0]-e[0]*f[2],e[0]*f[1]-e[1]*f[0]];
 const length=Math.hypot(...n);assert.ok(length>1e-8);
 const unit=n.map(x=>x/length);
 const center=[0,1,2].map(i=>(v[0][i]+v[1][i]+v[2][i])/3);
 return {origin:center.map((x,i)=>x+unit[i]*0.04),direction:unit.map(x=>-x),maxDistance:0.1};
}
test('both B-family shaped meshes can be triangle-picked and broken, with tombstone reload',()=>{
 const fixture=makeForestExactBreakFixture(specs);
 for(const obj of [...fixture.visible()]){
  const ray=surfaceRay(obj),hit=fixture.pickRay(ray.origin,ray.direction,ray.maxDistance);
  assert.equal(hit?.instanceKey,obj.instanceKey);
  assert.equal(fixture.breakRay(ray.origin,ray.direction,ray.maxDistance)?.instanceKey,obj.instanceKey);
  assert.equal(fixture.pickRay(ray.origin,ray.direction,ray.maxDistance),null);
 }
 assert.equal(fixture.visible().length,0);
 const restored=makeForestExactBreakFixture(specs,fixture.tombstoneSidecar());
 assert.equal(restored.visible().length,0);
});
test('exact mesh adapter preserves seed identity and rejects invalid rays',()=>{
 const a=makeForestExactBreakFixture(specs);
 const b=makeForestExactBreakFixture(specs.map(s=>({...s,seed:180})));
 assert.notEqual(a.visible()[0].instanceKey,b.visible()[0].instanceKey);
 assert.throws(()=>a.pickRay([0,0,0],[0,0,0]),TypeError);
 assert.throws(()=>a.breakRay([0,0,0],[1,0,0],-1),TypeError);
});
