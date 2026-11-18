import test from 'node:test';
import assert from 'node:assert/strict';
import {pickExactMeshRay,breakExactMeshRay} from '../src/nonblock-scene48/exact-mesh-ray-fixture.mjs';
function object(key,z=2){
 const positions=new Float32Array([-1,-1,0,1,-1,0,0,1,0]);
 return {instanceKey:key,sceneId:'scene48:test',anchor:[0,0,z],mesh:{positions},selectionAabb:{min:[-1,-1,z],max:[1,1,z]}};
}
function fixture(items){
 const removed=new Set();
 return {visible:()=>items.filter(o=>!removed.has(o.instanceKey)),breakByKey:key=>{if(removed.has(key))return false;removed.add(key);return true;},tombstones:()=>[...removed]};
}
test('triangle narrowphase rejects an AABB corner without a triangle',()=>{
 const f=fixture([object('a')]);
 assert.equal(pickExactMeshRay(f,{origin:[.9,.9,0],direction:[0,0,1]}),null);
 assert.equal(pickExactMeshRay(f,{origin:[0,0,0],direction:[0,0,4]})?.instanceKey,'a');
});
test('nearest exact triangle breaks and remains absent after tombstone replay',()=>{
 const f=fixture([object('far',4),object('near',2)]);
 const ray={origin:[0,0,0],direction:[0,0,1],maxDistance:6};
 assert.equal(breakExactMeshRay(f,ray)?.instanceKey,'near');
 assert.deepEqual(f.tombstones(),['near']);
 assert.equal(pickExactMeshRay(f,ray)?.instanceKey,'far');
 const reloaded=fixture([object('far',4)]);
 assert.equal(pickExactMeshRay(reloaded,ray)?.instanceKey,'far');
});
test('reach, invalid rays and malformed geometry fail closed',()=>{
 const f=fixture([object('a')]);
 assert.equal(pickExactMeshRay(f,{origin:[0,0,0],direction:[0,0,1],maxDistance:1}),null);
 assert.throws(()=>pickExactMeshRay(f,{origin:[0,0,0],direction:[0,0,0]}),TypeError);
 const broken=object('bad');broken.mesh.positions=new Float32Array([NaN,0,0,0,0,0,0,1,0]);
 assert.throws(()=>pickExactMeshRay(fixture([broken]),{origin:[0,0,0],direction:[0,0,1]}),TypeError);
});
