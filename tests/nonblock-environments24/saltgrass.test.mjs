import test from 'node:test';
import assert from 'node:assert/strict';
import {makeSaltgrass,validateSaltgrass,SALTGRASS_SCENE_ID} from '../../src/nonblock-environments24/saltgrass.mjs';
test('saltgrass four variants are bounded original triangle meshes',()=>{
 for(let v=0;v<4;v++){const o=makeSaltgrass({seed:179,anchor:[12,64,-8],variant:v});
 assert.equal(o.sceneId,SALTGRASS_SCENE_ID);assert.equal(o.mesh.triangleCount,(5+v*2)*6);
 assert.ok(o.mesh.triangleCount<=o.render.maxTrianglesPerInstance);
 assert.equal(o.selectionAabbs.length,5+v*2);
 assert.ok(o.mesh.positions.every(Number.isFinite));
 for(const b of o.selectionAabbs)assert.ok(b.min.every((n,i)=>n<=b.max[i]));
 assert.equal(validateSaltgrass(o),true);}
});
test('saltgrass identity and external tombstone contract are stable',()=>{
 const a=makeSaltgrass({seed:179,anchor:[12,64,-8],variant:2}),b=makeSaltgrass({seed:179,anchor:[12,64,-8],variant:2});
 assert.deepEqual(a,b);assert.equal(a.breakIntent.targetKey,a.persistence.key);
 assert.equal(a.spawn,'explicit-opt-in-only');assert.equal(a.attachment.supportOffset[1],-1);
 assert.notEqual(a.instanceKey,makeSaltgrass({seed:180,anchor:[12,64,-8],variant:2}).instanceKey);
});
test('saltgrass rejects forged mesh, key, and invalid identities',()=>{
 assert.throws(()=>makeSaltgrass({seed:1,anchor:[0,0,0],variant:4}));
 assert.throws(()=>makeSaltgrass({seed:1,anchor:[.5,0,0]}));
 const a=makeSaltgrass({seed:1,anchor:[0,0,0]});
 assert.throws(()=>validateSaltgrass({...a,instanceKey:'forged'}));
 assert.throws(()=>validateSaltgrass({...a,mesh:{...a.mesh,positions:[...a.mesh.positions.slice(0,-1),99]}}));
});
