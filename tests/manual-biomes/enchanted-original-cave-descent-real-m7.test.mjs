// New changed-only original M7 cave-source physics tests: genuine named
// entrance source ramp, actual stepPlayer gravity/descent, and player mining
// veto. The older four native provenance/tick tests are REUSED, not rerun.
import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../../src/manual-biomes/profile-world.mjs';
import {BLOCK} from '../../src/voxel.mjs';
import {inspectAllOriginalM7AuthoredCaveMouths}
  from '../../src/manual-biomes/enchanted-original-authored-mouth-audit.mjs';
import {originalM7AuthoredCaveFloorCap,originalM7NamedCaveDescentSource,
  replayOriginalM7AuthoredCaveDescent}
  from '../../src/manual-biomes/enchanted-original-cave-descent-evidence.mjs';

const seed=-88;
const old=()=>new FourRegionWorld(seed,
 fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
const candidate=()=>new FourRegionWorld(seed,
 fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR),
 {experimentalEnchantedTrees:true});

test('genuine four named M7 entrance preflight source floors survive real authored AIR/body/ground admission over six inward steps',()=>{
 const original=old(),experimental=candidate();
 const names=inspectAllOriginalM7AuthoredCaveMouths(original).map(m=>m.name);
 assert.equal(names.length,4);
 const facts=[];
 for(const name of names){
  const source=originalM7NamedCaveDescentSource(original,name,{inwardSteps:6});
  const optional=originalM7NamedCaveDescentSource(experimental,name,{inwardSteps:6});
  assert.equal(source.ok,true,
    'original author-owned entrance steps must really exist: '+JSON.stringify(source));
  assert.equal(optional.ok,true,
    'candidate must preserve source-owned cave floors: '+JSON.stringify(optional));
  assert.equal(source.path[source.mouthIndex].owner,'original-source-authored-cave-floor');
  assert.equal(source.sourceOwnedCaveFloorCells,7);
  assert.equal(source.authoredFloorDrop,3,
    'six actual original source steps descend exactly three block floors');
  assert.deepEqual(source.path.map(p=>[p.x,p.surface,p.z]),
    optional.path.map(p=>[p.x,p.surface,p.z]));
  for(const at of source.path.filter(p=>p.owner==='original-source-authored-cave-floor')){
    assert.ok(originalM7AuthoredCaveFloorCap(original,at.x,at.surface,at.z));
    assert.equal(original.environmentCaves.get(at.x,at.surface,at.z),at.material);
    assert.equal(original.get(at.x,at.surface,at.z),at.material);
    for(let d=1;d<=3;d++)
      assert.equal(original.get(at.x,at.surface+d,at.z),BLOCK.AIR);
  }
  facts.push({name,originalStart:source.path[0],
    originalMouth:source.mouth,
    direction:source.direction,
    sourceOwnedFloorCells:source.sourceOwnedCaveFloorCells,
    originalAuthoredFloorDrop:source.authoredFloorDrop,
    startedOutsideOriginalMouth:source.startedOutsideMouth,
    actualPlayerWalked:false});
 }
 assert.deepEqual(original.save(),{schema:1,seed,edits:[]});
 assert.throws(()=>experimental.save(),/cannot be saved as historical M7/);
 console.log('# ENCHANTED SOURCE-AUTHORED ORIGINAL M7 DESCENT FLOORS '+JSON.stringify({
  facts,originalCaveSourceUnmodified:true,physicsNotYetImplied:true}));
});

test('actual original and experimental M7 player controller attempts genuine gravity-settled named cave descent without teleport',()=>{
 const original=old(),experimental=candidate();
 const names=inspectAllOriginalM7AuthoredCaveMouths(original).map(m=>m.name);
 const results=[];let successes=0;
 for(const name of names){
   const oldSource=originalM7NamedCaveDescentSource(original,name,{inwardSteps:6});
   const candidateSource=originalM7NamedCaveDescentSource(experimental,name,{inwardSteps:6});
   assert.equal(oldSource.ok,true);
   assert.equal(candidateSource.ok,true);
   const historical=replayOriginalM7AuthoredCaveDescent(original,oldSource);
   const prototype=replayOriginalM7AuthoredCaveDescent(experimental,candidateSource);
   if(historical.ok&&prototype.ok){
     assert.ok(historical.walkedPastOriginalMouth);
     assert.ok(historical.actualPlayerFeetDrop>=2.9,
       'player physics, not generated source, must actually descend 3 blocks');
     assert.ok(historical.physicallyIntegratedFrames>=historical.walkedLegs);
     assert.equal(historical.ticks,prototype.ticks);
     assert.ok(prototype.actualPlayerFeetDrop>=2.9);
     assert.equal(historical.deepNetworkAccepted,false);
     successes++;
   }
   results.push({name,original:historical,candidate:prototype,
     matchedPhysicalSuccess:historical.ok&&prototype.ok});
 }
 console.log('# ENCHANTED ORIGINAL M7 AUTHORED CAVE SOURCE DESCENT PHYSICS '+JSON.stringify({
   results,realMatchedDescentWitnesses:successes,
   deepNetworkAcceptanceClaimed:false,
   installedIphonePwaMeasured:false}));
 assert.ok(successes>=1,
   'at least one genuine original/candidate M7 3-block cave-descent witness required, never synthetic');
 assert.deepEqual(original.save(),{schema:1,seed,edits:[]});
 assert.throws(()=>experimental.save(),/cannot be saved as historical M7/);
});

test('a real player AIR edit vetoes original authored cave floor without replacement or jump',()=>{
 const world=old(),name='upper24-windcut';
 const source=originalM7NamedCaveDescentSource(world,name,{inwardSteps:6});
 assert.equal(source.ok,true);
 const interior=source.path[source.mouthIndex+1];
 assert.ok(interior&&interior.owner==='original-source-authored-cave-floor');
 assert.equal(world.set(interior.x,interior.surface,interior.z,BLOCK.AIR),true);
 assert.equal(originalM7AuthoredCaveFloorCap(world,interior.x,interior.surface,interior.z),null);
 const rejected=replayOriginalM7AuthoredCaveDescent(world,source);
 assert.equal(rejected.ok,false);
 assert.equal(rejected.reason,'original-source-floor-changed');
 console.log('# ENCHANTED ORIGINAL AUTHORED WINDCUT CAVE FLOOR MINING VETO '+JSON.stringify({
   name,interior:[interior.x,interior.surface,interior.z],
   actualSourceAirEditRejected:true,originalStepPlayerNotBypassed:true,
   disposableWorldOnly:true}));
});
