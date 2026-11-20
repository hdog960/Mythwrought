import test from 'node:test';
import assert from 'node:assert/strict';
import {makeWitnessObjects} from '../../src/nonblock-fittings36/browser-interaction-witness.mjs';
import {flattenFittingTriangles} from '../../src/nonblock-fittings36/webgl2-interactive-fixture.mjs';

test('selected real shaped mesh changes color, not geometry or GPU allocation',()=>{
 const objects=makeWitnessObjects(36);
 const plain=flattenFittingTriangles(objects);
 const selected=flattenFittingTriangles(objects,{selectedKey:objects[0].instanceKey});
 assert.deepEqual(selected.positions,plain.positions);
 assert.equal(selected.triangleCount,plain.triangleCount);
 assert.equal(selected.uploadBytes,plain.uploadBytes);
 assert.notDeepEqual(selected.rgb,plain.rgb);
 assert.ok(selected.uploadBytes<=4*1024*1024);
});
test('selection tint fails closed for absent instance keys',()=>{
 const objects=makeWitnessObjects(36);
 assert.throws(()=>flattenFittingTriangles(objects,{selectedKey:'missing'}),/selected object must be visible/);
});
