import test from 'node:test';
import assert from 'node:assert/strict';
import {createOriginalM7ReadOnlySource as create,
 inspectOriginalM7ReadOnlySource as inspect}
 from '../src/living-underworld/original-m7-reader-provenance.mjs';

const source=create(179);
test('native original FourRegionWorld and VoxelWorld modules issue an attested frozen reader cohort',()=>{
 const r=inspect(source,{seed:179});
 assert.equal(r.ok,true);
 assert.equal(r.originalWorldConstructorVerified,true);
 assert.equal(r.originalWorldClassExact,true);
 assert.equal(r.originalLegacyWorldClassExact,true);
 assert.equal(r.originalM7ProfileGeneratorExact,true);
 assert.equal(r.originalM7SeedExact,true);
 assert.equal(r.fourNativeReaderFunctionsFactoryIssued,true);
 assert.equal(r.originalWorldSourceQueriesDuringAttestation,0);
 assert.equal(r.actualOriginalWorldSiteSafetyVerified,false);
 assert.equal(r.worldChanged,false);
 assert.equal(r.noWorldWrites,true);
});
test('an unissued copied source wrapper never inherits native original-M7 provenance',()=>{
 const borrowed={...source};
 const r=inspect(borrowed,{seed:179});
 assert.equal(r.ok,false);
 assert.equal(r.reason,'ORIGINAL_M7_SOURCE_NOT_ISSUED_BY_NATIVE_FACTORY');
});
test('a valid issued source cannot certify a different original-world seed',()=>{
 const r=inspect(source,{seed:2026});
 assert.equal(r.ok,false);
 assert.equal(r.reason,'ORIGINAL_M7_SOURCE_SEED_MISMATCH');
});
test('invalid seed forms and nonexistent native sources fail closed',()=>{
 for(const seed of [NaN,1.2,2**32,Infinity,-Infinity,'179',null])
  assert.throws(()=>create(seed),/Invalid original M7 source seed/);
 assert.equal(inspect(null,{seed:179}).reason,
  'ORIGINAL_M7_SOURCE_OBJECT_INVALID');
 assert.equal(inspect({naturalAt:()=>1},{seed:179}).reason,
  'ORIGINAL_M7_SOURCE_NOT_ISSUED_BY_NATIVE_FACTORY');
});
test('issued original native source functions cannot be replaced after construction',()=>{
 assert.equal(Object.isFrozen(source),true);
 assert.deepEqual(Object.keys(source).sort(),
  ['authoredAt','editedAt','naturalAt','protectedAt']);
 assert.throws(()=>{source.naturalAt=()=>1},TypeError);
 assert.equal(inspect(source,{seed:179}).ok,true);
});
test('fresh original M7 world reports no player edit and consistent reader types',()=>{
 assert.equal(source.editedAt(625,-132,133),false);
 const value=source.authoredAt(625,-132,133);
 assert.equal(value===undefined||Number.isSafeInteger(value)&&value>=0,true);
 assert.equal(typeof source.protectedAt(625,-132,133),'boolean');
 assert.equal(inspect(source,{seed:179}).ok,true);
});
test('actual original game native geology reader can sample without granting world construction authority',()=>{
 const material=source.naturalAt(625,-132,133);
 assert.equal(Number.isSafeInteger(material),true);
 assert.ok(material>=0);
 const r=inspect(source,{seed:179});
 assert.equal(r.ok,true);
 assert.equal(r.syntheticFuturePlayerMotionIsNotLiveWalking,true);
 assert.equal(r.actualOriginalWorldSiteSafetyVerified,false);
});
test('independent original M7 reader cohorts are distinct frozen instances with same seed',()=>{
 const another=create(179);
 assert.notStrictEqual(another,source);
 assert.notStrictEqual(another.naturalAt,source.naturalAt);
 assert.equal(inspect(another,{seed:179}).ok,true);
 assert.equal(inspect(source,{seed:179}).ok,true);
});
