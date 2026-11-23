// Native original-repository cave source tests ONLY: read real M7 cave
// entrances as source facts and reject near-AIR false walking claims.
// No fabricated caves, terrain edits, save migration or user-world mutation.
import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../../src/manual-biomes/profile-world.mjs';
import {BLOCK} from '../../src/voxel.mjs';
import {originalM7PhysicalGroundCap}
  from '../../src/manual-biomes/enchanted-original-standing-diagnostic.mjs';
import {inspectOriginalM7AuthoredCaveMouth,
  inspectAllOriginalM7AuthoredCaveMouths,
  witnessOriginalM7AuthoredMouthWaypoint,
  surveyOriginalM7MouthWaypointPhysics}
  from '../../src/manual-biomes/enchanted-original-authored-mouth-audit.mjs';

const seed=-88;
const original=()=>new FourRegionWorld(seed,
  fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
const prototype=()=>new FourRegionWorld(seed,
  fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR),
  {experimentalEnchantedTrees:true});

test('original seed -88 M7 cave mouths have named canonical authored solid floor and AIR but are NOT assumed walked',()=>{
 const history=original(),candidate=prototype();
 const originalMouths=inspectAllOriginalM7AuthoredCaveMouths(history);
 const candidateMouths=inspectAllOriginalM7AuthoredCaveMouths(candidate);
 assert.equal(originalMouths.length,4);
 assert.equal(candidateMouths.length,4);
 assert.equal(new Set(originalMouths.map(m=>m.name)).size,4);
 const facts=[];
 for(let i=0;i<originalMouths.length;i++){
  const a=originalMouths[i],b=candidateMouths[i];
  assert.equal(a.name,b.name);
  assert.equal(a.sourceFloorSolid,true,
    'the authored cave floor must be real source, not inferred legacy ground');
  assert.equal(a.sourceHeadAIR,true,
    'the real authored cave entrance must own all three AIR headroom cells');
  assert.equal(a.worldSourceMatches,true,
    'original physical world.get must actually expose original cave source');
  assert.equal(a.fullMouthSource,true);
  assert.notEqual(a.sourceFloor,BLOCK.AIR);
  assert.deepEqual(a.sourceHead,[BLOCK.AIR,BLOCK.AIR,BLOCK.AIR]);
  assert.equal(a.physicallyWalked,false,
    'authored source is NOT original stepPlayer cave crossing');
  assert.equal(a.caveDescentWalked,false);
  assert.equal(a.sourceFloor,b.sourceFloor);
  assert.deepEqual(a.sourceHead,b.sourceHead);
  assert.equal(a.x,b.x);assert.equal(a.y,b.y);assert.equal(a.z,b.z);
  assert.deepEqual(inspectOriginalM7AuthoredCaveMouth(history,a.name),a);
  facts.push({name:a.name,at:[a.x,a.y,a.z],
    authoredFloor:a.sourceFloor,
    realPlayerBodyClear:a.physicalBodyClear,
    actualGroundProbe:a.actualGroundProbe,
    originalPhysicalCapFeet:a.legacyCapFeet,
    candidatePhysicalCapFeet:b.legacyCapFeet,
    originalCanStandAtMouth:a.playerBodySupportedAtMouth,
    candidateCanStandAtMouth:b.playerBodySupportedAtMouth});
 }
 assert.throws(()=>inspectOriginalM7AuthoredCaveMouth(history,'invented-mouth'),
   /Unknown original M7 authored cave mouth/);
 assert.deepEqual(history.save(),{schema:1,seed,edits:[]});
 assert.throws(()=>candidate.save(),/cannot be saved as historical M7/);
 console.log('# ENCHANTED ORIGINAL M7 FOUR ACTUAL AUTHORED CAVE MOUTHS '+JSON.stringify({
  facts,sourceAuthoredMouths:4,physicalMouthWalksClaimed:0,
  fullCaveDescentClaimed:false,noPlayerEdits:true}));
});

test('named mouth path gate requires real interior player physics; conservatively surveys only authentic source',()=>{
 const history=original();
 const sites=inspectAllOriginalM7AuthoredCaveMouths(history);
 const at=[[-273,-588],[-274,-588],[-275,-588]].map(([x,z])=>
   originalM7PhysicalGroundCap(history,x,z));
 assert.ok(at.every(Boolean),'reuse actual verified original border cells');
 const surveys=[];
 for(const m of sites){
  const falseWitness=witnessOriginalM7AuthoredMouthWaypoint(history,at,m.name);
  assert.equal(falseWitness.ok,false,
    'a real short Enchanted/Plains walk does not certify unrelated cave mouths');
  assert.notEqual(falseWitness.reason,undefined);
  const check=surveyOriginalM7MouthWaypointPhysics(history,m.name);
  assert.ok(check.attempts>=0&&check.attempts<=4);
  assert.equal(check.caveDescentWalked,false,
    'a local doorway physics test is never a cave descent claim');
  for(const witness of check.witnesses){
    assert.equal(witness.legs,2);
    assert.ok(witness.ticks>0);
    assert.equal(witness.class,
      'source-authored-mouth-waypoint-physically-replayed');
  }
  surveys.push({name:m.name,attempts:check.attempts,
    witnessedPhysicalDoorwayWaypoints:check.witnesses.length,
    candidateReasons:check.reasons,
    fullCaveDescentAccepted:false});
 }
 assert.deepEqual(history.save(),{schema:1,seed,edits:[]});
 console.log('# ENCHANTED ORIGINAL M7 ACTUAL MOUTH PHYSICS GATE '+JSON.stringify({
  surveys,originalSourceOnly:true,uninterruptedStepPlayerRequired:true,
  caveMouthDescentAccepted:false,installedIphoneAcceptance:false}));
});
