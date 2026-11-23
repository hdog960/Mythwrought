import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
 from '../../src/manual-biomes/profile-world.mjs';
import {examineOriginalM7UpperOverlappedFloor}
 from '../../src/manual-biomes/enchanted-original-upper-overlap-diagnostic.mjs';
const seed=-88;
const original=trees=>new FourRegionWorld(seed,
 fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR),
 trees?{experimentalEnchantedTrees:true}:{});
test('original seed -88 upper owner step114 source floor height vs authentic formed lateral gallery, never infer bridge',()=>{
 const a=original(false),b=original(true),records=[];
 for(const name of ['upper24-windcut','upper24-hollowbend']){
  const observed=examineOriginalM7UpperOverlappedFloor(a,name,{step:114});
  const proto=examineOriginalM7UpperOverlappedFloor(b,name,{step:114});
  assert.deepEqual(observed.canonicalExpected,proto.canonicalExpected);
  assert.deepEqual(observed.actualOriginalFloorCandidates,
    proto.actualOriginalFloorCandidates);
  assert.equal(observed.originalSourceOnly,true);
  assert.equal(observed.authorGeometryModified,false);
  assert.equal(observed.physicalBridgeClaimed,false);
  const eligible=observed.actualOriginalFloorCandidates.filter(
    c=>c.ownerAuthoredSolidFloor&&c.ownerAuthoredThreeHeadAIR&&
      c.originalSourcePhysicalCap);
  records.push({name,expected:observed.canonicalExpected,
   sourceFloorCandidates:observed.actualOriginalFloorCandidates,
   eligibleOriginalAuthorOwnedAlternatives:eligible.map(c=>c.y)});
 }
 console.log('# ENCHANTED ORIGINAL M7 UPPER SOURCE STEP114 TRUE ORIGINAL COLUMN OVERLAP '+JSON.stringify({
  records,sourceModified:false,playerPhysicsUnprovenAt114:true,
  noInventedLandmarkCaveOrSyntheticFloor:true}));
 assert.equal(records.length,2);
 assert.deepEqual(a.save(),{schema:1,seed,edits:[]});
 assert.throws(()=>b.save(),/cannot be saved as historical M7/);
});
