import test from 'node:test';
import assert from 'node:assert/strict';
import {fixtureInstance,makeOptInBreakFixture,INTERACTION_FIXTURE_VERSION} from '../src/nonblock-scene48/opt-in-break-fixture.mjs';
const a={sceneId:'scene48:clover-clump',seed:12,anchor:[10,4,-2],variant:2};
test('deterministic anchored shaped mesh, mesh-derived selection and pass-through collision',()=>{
 const x=fixtureInstance(a),y=fixtureInstance(a);
 assert.equal(x.instanceKey,y.instanceKey);assert.ok(x.mesh.triangleCount>0);assert.equal(x.collision,'pass-through');
 for(let i=0;i<x.mesh.positions.length;i+=3)for(let k=0;k<3;k++){const v=x.mesh.positions[i+k]+x.anchor[k];assert.ok(v>=x.selectionAabb.min[k]-1e-6&&v<=x.selectionAabb.max[k]+1e-6);}
 assert.notEqual(x.instanceKey,fixtureInstance({...a,seed:13}).instanceKey);
});
test('pick, break, tombstone reload and no implicit respawn',()=>{
 const f=makeOptInBreakFixture([a]);const x=f.visible()[0],center=x.selectionAabb.min.map((v,i)=>(v+x.selectionAabb.max[i])/2);
 assert.equal(f.pickPoint(center)?.instanceKey,x.instanceKey);assert.equal(f.breakByKey(x.instanceKey),true);assert.equal(f.breakByKey(x.instanceKey),false);assert.equal(f.pickPoint(center),null);
 const side=f.tombstoneSidecar();assert.equal(side.version,INTERACTION_FIXTURE_VERSION);assert.deepEqual(makeOptInBreakFixture([a],side.removed).visible(),[]);
});
test('reject duplicate identities and malformed object descriptors',()=>{
 assert.throws(()=>makeOptInBreakFixture([a,a]),/duplicate/);
 assert.throws(()=>fixtureInstance({...a,anchor:[1.2,0,0]}),/invalid/);
 assert.throws(()=>fixtureInstance({...a,sceneId:'pack4:001'}),/invalid/);
});
