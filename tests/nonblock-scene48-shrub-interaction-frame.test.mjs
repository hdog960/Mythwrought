import test from 'node:test';
import assert from 'node:assert/strict';
import {createShrubInteractionFrame} from '../src/nonblock-scene48/shrub-interaction-frame.mjs';
const placements=[{anchor:[0,0,0],variant:1},{anchor:[5,0,0],variant:2},{anchor:[10,0,0],variant:3}];
const view=[[-2,-2,-2],[15,4,3]];
function ray(obj){
 const p=obj.mesh.positions,a=obj.anchor;
 for(let i=0;i<p.length;i+=9){
  const v=[0,3,6].map(j=>[0,1,2].map(k=>p[i+j+k]+a[k]));
  const u=v[1].map((n,k)=>n-v[0][k]),w=v[2].map((n,k)=>n-v[0][k]);
  const n=[u[1]*w[2]-u[2]*w[1],u[2]*w[0]-u[0]*w[2],u[0]*w[1]-u[1]*w[0]];
  const len=Math.hypot(...n);if(len<1e-8)continue;
  const direction=n.map(x=>-x/len);
  return {origin:[0,1,2].map(k=>(v[0][k]+v[1][k]+v[2][k])/3-n[k]/len*.1),direction};
 }
 throw new Error('no pickable triangle');
}
test('interactive frame removes exact picked shrub from subsequent draw and reload',()=>{
 const frame=createShrubInteractionFrame(179,placements,view);
 assert.equal(frame.draw().visibleCount,3);
 const target=frame.visible()[1],r=ray(target);
 assert.equal(frame.pickRay(r.origin,r.direction,.5)?.instanceKey,target.instanceKey);
 assert.equal(frame.breakRay(r.origin,r.direction,.5)?.instanceKey,target.instanceKey);
 assert.equal(frame.pickRay(r.origin,r.direction,.5),null);
 assert.equal(frame.draw().visibleCount,2);
 assert.equal(frame.draw().batches.flatMap(b=>b.instances).some(x=>x.instanceKey===target.instanceKey),false);
 const restored=createShrubInteractionFrame(179,placements,view,JSON.parse(JSON.stringify(frame.snapshot())));
 assert.equal(restored.draw().visibleCount,2);
 assert.equal(restored.pickRay(r.origin,r.direction,.5),null);
 assert.equal(createShrubInteractionFrame(180,placements,view).draw().visibleCount,3);
});
test('interaction frame fails closed for foreign sidecars and impossible budgets',()=>{
 const frame=createShrubInteractionFrame(179,placements,view);
 assert.throws(()=>createShrubInteractionFrame(180,placements,view,frame.snapshot()),/sidecar/);
 assert.throws(()=>createShrubInteractionFrame(179,placements,view,undefined,{maxTriangles:1,maxBatchTriangles:1}),/oversized|budget/);
});
