import test from 'node:test';
import assert from 'node:assert/strict';
import {makeWoodlandMixedFixture} from '../src/nonblock-scene48/woodland-mixed-fixture.mjs';
import {FOREST_CANDIDATES} from '../src/nonblock-scene48/forest-phase1-candidates.mjs';

// Deterministic, guaranteed triangle-intersection ray, unlike a conditional
// downward ray that may miss a vertical or sloped first triangle.
function surfaceRay(obj){
 const p=obj.mesh.positions;
 for(let i=0;i<p.length;i+=9){
  const a=[p[i],p[i+1],p[i+2]],b=[p[i+3],p[i+4],p[i+5]],c=[p[i+6],p[i+7],p[i+8]];
  const u=b.map((v,k)=>v-a[k]),v=c.map((x,k)=>x-a[k]);
  const n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
  const mag=Math.hypot(...n);
  if(mag<1e-6)continue;
  const normal=n.map(x=>x/mag);
  const center=a.map((x,k)=>(x+b[k]+c[k])/3+obj.anchor[k]);
  return {origin:center.map((x,k)=>x+normal[k]*0.25),direction:normal.map(x=>-x)};
 }
 throw new Error('no nondegenerate triangles');
}
const seed=54321;
const forest=[{sceneId:FOREST_CANDIDATES[0],anchor:[0,0,0]}];
const saplings=[{anchor:[20,0,0],variant:1}];
test('guaranteed surface rays remove forest and sapling independently, then persist',()=>{
 const scene=makeWoodlandMixedFixture(seed,forest,saplings);
 const objects=scene.visible();
 assert.equal(objects.length,2);
 for(const obj of objects){
  const ray=surfaceRay(obj);
  const hit=scene.pickRay(ray.origin,ray.direction,2);
  assert.ok(hit,'actual triangle must be pickable');
  assert.equal(hit.instanceKey,obj.instanceKey);
  const broken=scene.breakRay(ray.origin,ray.direction,2);
  assert.equal(broken?.instanceKey,obj.instanceKey);
  assert.equal(scene.breakByKey(obj.instanceKey),false);
 }
 assert.equal(scene.visible().length,0);
 const restored=makeWoodlandMixedFixture(seed,forest,saplings,scene.snapshot());
 assert.equal(restored.visible().length,0);
 assert.equal(makeWoodlandMixedFixture(seed,forest,saplings).visible().length,2);
});
test('mixed woodland rejects stale seed and duplicate placements without partial mutation',()=>{
 const scene=makeWoodlandMixedFixture(seed,forest,saplings);
 const snapshot=scene.snapshot();
 assert.throws(()=>makeWoodlandMixedFixture(seed+1,forest,saplings,snapshot),TypeError);
 assert.throws(()=>makeWoodlandMixedFixture(seed,[...forest,...forest],saplings),TypeError);
 assert.throws(()=>makeWoodlandMixedFixture(seed,forest,[...saplings,...saplings]),TypeError);
 assert.equal(scene.visible().length,2);
});
