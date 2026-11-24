import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld} from '../src/voxel.mjs';
import {FourRegionWorld} from '../src/manual-biomes/profile-world.mjs';
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


test('Phase33 original FourRegionWorld inherits the exact VoxelWorld baseline',()=>{
 assert.strictEqual(Object.getPrototypeOf(FourRegionWorld.prototype),
  VoxelWorld.prototype);
 const witness=inspect(source,{seed:179});
 assert.equal(witness.ok,true);
 assert.equal(witness.originalInheritedVoxelBaselineMethodsStable,true);
 assert.equal(witness.originalFourRegionSuperclassExact,true);
});
test('Phase33 changed inherited naturalAndLandmarkBlock refuses even when four outer readers remain unchanged',()=>{
 const previous=VoxelWorld.prototype.naturalAndLandmarkBlock;
 try{
  VoxelWorld.prototype.naturalAndLandmarkBlock=function(){return 1};
  const proof=inspect(source,{seed:179});
  assert.equal(proof.ok,false);
  assert.equal(proof.reason,'ORIGINAL_M7_INHERITED_SOURCE_METHOD_CHANGED');
  assert.equal(proof.originalWorldSourceQueriesDuringAttestation,0);
 }finally{
  VoxelWorld.prototype.naturalAndLandmarkBlock=previous;
 }
 assert.equal(inspect(source,{seed:179}).ok,true);
});
test('Phase33 changed inherited legacyBlockAt refuses without reading any original-world voxel',()=>{
 const previous=VoxelWorld.prototype.legacyBlockAt;
 try{
  VoxelWorld.prototype.legacyBlockAt=function(){return 1};
  const proof=inspect(source,{seed:179});
  assert.equal(proof.ok,false);
  assert.equal(proof.reason,'ORIGINAL_M7_INHERITED_SOURCE_METHOD_CHANGED');
  assert.equal(proof.originalWorldSourceQueriesDuringAttestation,0);
 }finally{
  VoxelWorld.prototype.legacyBlockAt=previous;
 }
 assert.equal(inspect(source,{seed:179}).ok,true);
});
test('Phase33 original seed179 city site anchors have repeatable source values without edits',()=>{
 // Genuine research anchors. This proves only repeatable readback at TWO
 // coordinates, NOT the whole grade route, gallery, overlay or true walking.
 for(const [x,y,z] of [[625,-132,133],[649,-182,396]]){
  for(const role of ['naturalAt','authoredAt','editedAt','protectedAt']){
   const first=source[role](x,y,z);
   assert.equal(Object.is(source[role](x,y,z),first),true,
    role+' changed at original seed179 research anchor');
  }
 }
 assert.equal(inspect(source,{seed:179}).ok,true);
 assert.equal(inspect(source,{seed:179}).actualOriginalWorldSiteSafetyVerified,false);
});
