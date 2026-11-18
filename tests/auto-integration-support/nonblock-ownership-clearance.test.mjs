import test from 'node:test';
import assert from 'node:assert/strict';
import {inspectNonblockOwnership} from '../../src/auto-integration-support/nonblock-ownership-clearance.mjs';
const sha='a'.repeat(40);
function object(ns,x){const sceneId=ns+':sample',key='nb1:'+encodeURIComponent(sceneId)+':17:'+x+',0,0:0';return {contract:'nonblock-object-v1',sceneId,seed:17,anchor:[x,0,0],variant:0,instanceKey:key,selectionAabbs:[{min:[x-.25,0,-.25],max:[x+.25,1,.25]}],breakIntent:{action:'remove-object',targetKey:key,requiresOwner:':00'},persistence:{kind:'schema1-external-tombstone-sidecar',key},render:{triangleCount:12,instanced:true,maxInstancesPerBatch:512}}}
function fixture(){return {seed:17,producers:[{namespace:'scene48',owner:':48',head:sha,sourceAuthenticated:true,objects:[object('scene48',0)]},{namespace:'environment24',owner:':24',head:sha,sourceAuthenticated:true,objects:[object('environment24',2)]},{namespace:'fittings36',owner:':36',head:sha,sourceAuthenticated:true,objects:[object('fittings36',4)]}]}}
test('fixture is not runtime integration proof',()=>assert.equal(inspectNonblockOwnership(fixture()).level,'DECLARED_SOURCE_FIXTURE_ONLY'));
test('unauthenticated source fails closed',()=>{const f=fixture();f.producers[1].sourceAuthenticated=false;assert.equal(inspectNonblockOwnership(f).ok,false)});
test('wrong producer owner rejected',()=>{const f=fixture();f.producers[1].owner=':48';assert.equal(inspectNonblockOwnership(f).ok,false)});
test('duplicate producer namespace rejected',()=>{const f=fixture();f.producers[1].namespace='scene48';assert.equal(inspectNonblockOwnership(f).ok,false)});
test('wrong family namespace rejected',()=>{const f=fixture();f.producers[1].objects[0].sceneId='scene48:sample';assert.equal(inspectNonblockOwnership(f).ok,false)});
test('overlapping object boxes rejected',()=>{const f=fixture();f.producers[1].objects[0].selectionAabbs=[{min:[-.1,0,-.1],max:[.1,1,.1]}];assert.match(inspectNonblockOwnership(f).reason,/overlapping/)});
test('protected geometry rejected',()=>{const f=fixture();f.protectedBoxes=[{min:[1.9,-1,-1],max:[2.1,2,1]}];assert.match(inspectNonblockOwnership(f).reason,/protected/)});
test('render-only object rejected',()=>{const f=fixture();delete f.producers[2].objects[0].breakIntent;assert.match(inspectNonblockOwnership(f).reason,/removal/)});
test('invalid source head rejected',()=>{const f=fixture();f.producers[0].head='unknown';assert.equal(inspectNonblockOwnership(f).ok,false)});
test('scene triangle budget enforced',()=>assert.match(inspectNonblockOwnership({...fixture(),maxTotalTriangles:20}).reason,/budget/));
test('seed mismatch rejected',()=>{const f=fixture();f.producers[0].objects[0].seed=18;assert.equal(inspectNonblockOwnership(f).ok,false)});
test('adjacent non-overlapping objects accepted',()=>{const f=fixture();f.producers[1].objects[0].selectionAabbs=[{min:[.25,0,-.25],max:[.75,1,.25]}];assert.equal(inspectNonblockOwnership(f).ok,true)});
