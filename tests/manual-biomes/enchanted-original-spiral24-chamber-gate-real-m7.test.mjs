// New isolated original M7 *source-authentic* deep exploration beyond
// previously certified 12 steps. Reuses historical green results exactly.
// Test dispositions distinguish verified physical walks from blocked source.
// No physics, cave, migration, PWA or player-save changes.
import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../../src/manual-biomes/profile-world.mjs';
import {deepCaveRoute,DEEP_CAVE_ORIGIN}
  from '../../src/deep-cave-network.mjs';
import {originalM7AuthoredCaveFloorCap}
  from '../../src/manual-biomes/enchanted-original-cave-descent-evidence.mjs';
import {planFullOriginalM7CaveAnchorWalk,replayFullOriginalM7CaveAnchorWalk,
  M7_FULL_SOURCE_WALK_BOUNDS}
  from '../../src/manual-biomes/enchanted-original-full-anchor-continuity.mjs';
import {BLOCK} from '../../src/voxel.mjs';
const SEED=-88;
const world=prototype=>new FourRegionWorld(SEED,
  fourRegionProfile(SEED,M7_ENVIRONMENT_GENERATOR),
  prototype?{experimentalEnchantedTrees:true}:{});
const sourceEnd=(plan)=>{const p=plan.path.at(-1);return [p.x,p.surface,p.z];};
function verified(world,steps){
 const plan=planFullOriginalM7CaveAnchorWalk(world,'old-deep24',
  {spiralSteps:steps});
 const walk=plan.ok?replayFullOriginalM7CaveAnchorWalk(world,plan):null;
 return {plan,walk};
}
test('real original M7 physical walk passes 24 original deep-spiral steps from the OUTSIDE surface in one player state',()=>{
 const original=world(false),candidate=world(true);
 const a=verified(original,24),b=verified(candidate,24);
 const step=deepCaveRoute(DEEP_CAVE_ORIGIN)[24];
 assert.equal(a.plan.ok,true,'original source must really own all 24 spiral steps');
 assert.equal(b.plan.ok,true,'candidate source must actually own same cave source');
 assert.deepEqual(sourceEnd(a.plan),[step.x,step.floor,step.z]);
 assert.deepEqual(a.plan.path.map(p=>[p.x,p.feet,p.z]),
   b.plan.path.map(p=>[p.x,p.feet,p.z]));
 assert.equal(a.walk.ok,true,'original REAL stepPlayer must finish entire 24-step route');
 assert.equal(b.walk.ok,true,'candidate REAL stepPlayer must finish entire 24-step route');
 assert.equal(a.walk.sourceAnchorActuallyWalked,true);
 assert.equal(a.walk.actualDeepSpiralStepsWalked,24);
 assert.equal(a.walk.walkedLegs,a.plan.path.length-1);
 assert.equal(a.walk.ticks,b.walk.ticks);
 assert.ok(a.walk.deepestPlayerFeet<-8);
 assert.equal(a.walk.fullDeepNetworkAccepted,false);
 console.log('# ENCHANTED ORIGINAL M7 TWENTYFOUR DEEP SPIRAL PHYSICS '+
 JSON.stringify({end:sourceEnd(a.plan),originalTicks:a.walk.ticks,
 candidateTicks:b.walk.ticks,legs:a.walk.walkedLegs,
 reachedSteps:a.walk.actualDeepSpiralStepsWalked,
 actualFeetDrop:a.walk.actualPlayerFeetDrop,
 trueSourceOnly:true,fullNetworkAcceptance:false}));
 assert.deepEqual(original.save(),{schema:1,seed:SEED,edits:[]});
 assert.throws(()=>candidate.save(),/cannot be saved as historical M7/);
});

test('bounded original M7 deeper route survey checks real spiral turning, first -30 chamber and exact physical blocker if present',()=>{
 const original=world(false),candidate=world(true),route=deepCaveRoute(DEEP_CAVE_ORIGIN);
 assert.equal(M7_FULL_SOURCE_WALK_BOUNDS.spiralSteps,112);
 const observed=[];
 for(const steps of [40,48,64,104,112]){
  const a=verified(original,steps),b=verified(candidate,steps);
  assert.equal(a.plan.ok,b.plan.ok,
    'prototype can never create cave-authored source absent from history');
  if(a.plan.ok)assert.deepEqual(sourceEnd(a.plan),
    [route[steps].x,route[steps].floor,route[steps].z]);
  if(a.walk?.ok||b.walk?.ok){
   assert.equal(a.walk?.ok,b.walk?.ok,
      'only identical original and candidate actual stepPlayer success accepted');
   assert.equal(a.walk.ticks,b.walk.ticks);
   assert.equal(a.walk.actualDeepSpiralStepsWalked,steps);
   assert.equal(a.walk.sourceAnchorActuallyWalked,true);
  }
  observed.push({steps,canonicalSource:[route[steps].x,
   route[steps].floor,route[steps].z],
   originalSourceOk:a.plan.ok,
   originalReason:a.plan.ok?null:a.plan.reason,
   originalBlockedCell:a.plan.ok?null:(a.plan.position??a.plan.to??null),
   originalPhysicalOk:a.walk?.ok??false,
   originalPhysicalReason:a.walk?.ok?null:a.walk?.reason??'source-blocked',
   originalActuallyWalkedSteps:a.walk?.ok?a.walk.actualDeepSpiralStepsWalked:0,
   trueOriginalTicks:a.walk?.ticks??0,
   candidateSourceOk:b.plan.ok,
   candidatePhysicalOk:b.walk?.ok??false});
 }
 assert.ok(observed.some(x=>x.steps>=40),'source survey must actually examine original corner');
 console.log('# ENCHANTED ORIGINAL M7 REAL SPIRAL CORNER AND FIRST CHAMBER SOURCE/PHYSICS SURVEY '+
 JSON.stringify({observed,accepted:observed.filter(o=>o.originalPhysicalOk),
  firstChamberDepth:-30,firstChamberTargetSpiralStep:104,
  caveGeneratorModified:false,unreachedNotClaimed:true}));
 assert.deepEqual(original.save(),{schema:1,seed:SEED,edits:[]});
 assert.throws(()=>candidate.save(),/cannot be saved as historical M7/);
});

test('original deep24 support mining at spiral step 24 refuses route BEFORE ANY controller integration',()=>{
 const w=world(false),plan=planFullOriginalM7CaveAnchorWalk(w,'old-deep24',
 {spiralSteps:24});
 assert.equal(plan.ok,true);
 const end=plan.path.at(-1);
 assert.equal(end.spiralStep,24);
 assert.ok(originalM7AuthoredCaveFloorCap(w,end.x,end.surface,end.z));
 assert.equal(w.set(end.x,end.surface,end.z,BLOCK.AIR),true);
 assert.equal(originalM7AuthoredCaveFloorCap(w,end.x,end.surface,end.z),null);
 const replay=replayFullOriginalM7CaveAnchorWalk(w,plan);
 assert.equal(replay.ok,false);
 assert.equal(replay.reason,'original-authored-source-was-edited');
 assert.equal(replay.ticks,0);
 console.log('# ENCHANTED ORIGINAL M7 SPIRAL STEP24 REAL MINING VETO '+JSON.stringify({
  originalFloor:[end.x,end.surface,end.z],
  acceptedPhysicsAfterMining:replay.ok,
  actualTicksAfterMining:replay.ticks,
  disposableWorldOnly:true}));
});
