import test from 'node:test';
import assert from 'node:assert/strict';
import {verifyProducerSnapshots} from '../../src/auto-integration-support/producer-snapshots.mjs';
const base=()=>({seed:42,surface:[{x:1,y:8,z:2}],caves:[{entrance:{x:1,y:8,z:2},path:[{x:1,y:8,z:2},{x:1,y:7,z:2}]}],objects:[{id:'object:tree',anchor:{x:1,y:9,z:2}}]});
test('accepts coherent three-lane snapshots without claiming source execution',()=>{const r=verifyProducerSnapshots(base());assert.equal(r.ok,true);assert.match(r.status,/NOT-SOURCE-VERIFIED/)});
test('rejects cave entrances above producer surface and missing columns',()=>{const a=base();a.caves[0].entrance.y=9;assert.ok(verifyProducerSnapshots(a).errors.includes('cave:entrance-above-surface'));a.caves[0].entrance.x=3;assert.ok(verifyProducerSnapshots(a).errors.includes('cave:unknown-surface-column'))});
test('rejects object anchor omissions and duplicate object identities',()=>{const a=base();a.objects.push({...a.objects[0]});assert.ok(verifyProducerSnapshots(a).errors.includes('object:duplicate-id'));a.objects[0].anchor.x=99;assert.ok(verifyProducerSnapshots(a).errors.includes('object:unknown-anchor-column'))});
test('rejects duplicated columns and malformed seed',()=>{const a=base();a.surface.push({...a.surface[0]});assert.ok(verifyProducerSnapshots(a).errors.includes('surface:duplicate-column'));a.seed=1.5;assert.throws(()=>verifyProducerSnapshots(a),TypeError)});
