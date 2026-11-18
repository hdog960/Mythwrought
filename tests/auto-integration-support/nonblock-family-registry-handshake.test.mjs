import test from 'node:test';
import assert from 'node:assert/strict';
import {auditNonblockFamilyAllocations as audit} from '../../src/auto-integration-support/nonblock-family-registry-handshake.mjs';
const sha={scene48:'a'.repeat(40),scene24:'b'.repeat(40),scene36:'c'.repeat(40)};
const registries=()=>({
 scene48:[{sceneId:'scene48:low-grass',breakable:true,individualPick:true,tombstone:true}],
 scene24:[{sceneId:'scene24:crystal',familyNumber:37,breakable:true,individualPick:true,tombstone:true}],
 scene36:[{sceneId:'scene36:chain',familyNumber:61,breakable:true,individualPick:true,tombstone:true}]
});
const check=(r=registries(),s=sha,fxPolicy)=>audit({registries:r,sources:s,fxPolicy});
test('valid declared registries are not called authenticated',()=>{const x=check();assert.equal(x.ok,true);assert.match(x.status,/DECLARED_REGISTRIES_ONLY/);});
test('source SHA missing fails closed',()=>assert.ok(check(registries(),{}).errors.includes('MISSING_SOURCE_SHA_scene48')));
test('future scene48 family without arbitrary slot is accepted',()=>{const r=registries();r.scene48.push({sceneId:'scene48:clover-patch',breakable:true,individualPick:true,tombstone:true});assert.equal(check(r).ok,true);});
test('scene48 numeric slot assumption is rejected',()=>{const r=registries();r.scene48[0].familyNumber=1;assert.ok(check(r).errors.includes('SCENE48_NUMERIC_ALLOCATION_UNAUTHENTICATED'));});
test('cross-owner duplicate family slot rejected',()=>{const r=registries();r.scene36[0].familyNumber=37;assert.ok(check(r).errors.includes('OUT_OF_OWNER_RANGE'));assert.ok(check(r).errors.includes('DUPLICATE_FAMILY_SLOT'));});
test('wrong namespace rejected',()=>{const r=registries();r.scene24[0].sceneId='scene36:crystal';assert.ok(check(r).errors.includes('INVALID_NAMESPACE'));});
test('visual-only object rejected',()=>{const r=registries();r.scene24[0].tombstone=false;assert.ok(check(r).errors.includes('NONBREAKABLE_OBJECT'));});
test('FX H must declare removal mode and policy',()=>{const r=registries();r.scene48.push({sceneId:'scene48:glow',kind:'fx',removalMode:'ambient'});assert.ok(check(r).errors.includes('INVALID_FX_REMOVAL'));assert.equal(check(r,sha,'explicit-ambient-or-parent-linked').ok,true);});
test('parent-linked FX requires parent identity',()=>{const r=registries();r.scene48.push({sceneId:'scene48:sparks',kind:'fx',removalMode:'parent-linked'});assert.ok(check(r,sha,'explicit-ambient-or-parent-linked').errors.includes('MISSING_FX_PARENT'));});
test('empty producer registry fails closed',()=>{const r=registries();r.scene36=[];assert.ok(check(r).errors.includes('MISSING_REGISTRY_scene36'));});
