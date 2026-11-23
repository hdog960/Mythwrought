// Real original M7 chamber interior, not merely reaching floor -30
// on the main spiral. Out-and-back must stay within author-owned original
// cave AIR/floor and the unchanged physical player, then continue deeper.
import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
 from '../../src/manual-biomes/profile-world.mjs';
import {BLOCK} from '../../src/voxel.mjs';
import {originalM7AuthoredCaveFloorCap}
 from '../../src/manual-biomes/enchanted-original-cave-descent-evidence.mjs';
import {replayFullOriginalM7CaveAnchorWalk}
 from '../../src/manual-biomes/enchanted-original-full-anchor-continuity.mjs';
import {planOriginalM7FirstChamberRoundTrip,
 surveyOriginalM7FirstChamberPhysicalRoundTrip}
 from '../../src/manual-biomes/enchanted-original-first-chamber-roundtrip.mjs';
const seed=-88;
const world=trees=>new FourRegionWorld(seed,
 fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR),
 trees?{experimentalEnchantedTrees:true}:{});

test('original and candidate walk from outside to author-owned -30 chamber interior, reverse, return and continue deep24',()=>{
 const a=world(false),b=world(true);
 const original=surveyOriginalM7FirstChamberPhysicalRoundTrip(a,{spoke:3});
 const prototype=surveyOriginalM7FirstChamberPhysicalRoundTrip(b,{spoke:3});
 const brief=o=>({ok:o.ok,reason:o.reason??null,
  sourceFloorEvidence:o.sourcePlan?.chamberActualSpokeCells.map(p=>
    [p.x,p.surface,p.z])??null,
  authorOwnedSourceVisited:o.physicallyVisitedOriginalChamberInterior??false,
  originalSpiralResumed:o.continuedOriginalDeepSpiralSteps??0,
  originalTicks:o.replay?.ticks??0,
  fullDeepNetworkAccepted:o.wholeDeepNetworkAccepted??false,
  attempts:o.attempts?.map(r=>({direction:r.direction,
    physicalSuccess:r.physicalSuccess,reason:r.reason}))??null});
 console.log('# ENCHANTED ORIGINAL M7 TRUE DEEP24 -30 CHAMBER INTERIOR RETURN PHYSICS '+
  JSON.stringify({historical:brief(original),experimental:brief(prototype),
    entireChamberInteriorClaimed:false,noInventedFloor:true}));
 assert.equal(original.ok,true,'an actual original-source chamber interior round trip must be physics proven');
 assert.equal(prototype.ok,true,'optional trees may not break real cave source physics');
 assert.deepEqual(original.sourcePlan.chamberDirection,
  prototype.sourcePlan.chamberDirection);
 assert.equal(original.replay.ticks,prototype.replay.ticks);
 assert.equal(original.sourcePlan.chamberOutAndBackSteps,6);
 assert.equal(original.replay.sourceAnchorActuallyWalked,true);
 assert.equal(original.continuedOriginalDeepSpiralSteps,112);
 assert.equal(original.replay.actualDeepSpiralStepsWalked,112);
 assert.equal(original.replay.walkedLegs,original.sourcePlan.path.length-1);
 assert.equal(original.completeFirstChamberAccepted,false);
 assert.equal(original.wholeDeepNetworkAccepted,false);
 assert.deepEqual(a.save(),{schema:1,seed,edits:[]});
 assert.throws(()=>b.save(),/cannot be saved as historical M7/);
});

test('a user AIR edit to original chamber interior support fails BEFORE original full-player movement',()=>{
 const a=world(false);
 const source=planOriginalM7FirstChamberRoundTrip(a,{spoke:3});
 assert.equal(source.ok,true,
   'real original chamber author must own at least one genuine interior spoke');
 const plan=source.candidatePlans[0];
 const interior=plan.chamberActualSpokeCells.at(-1);
 assert.ok(originalM7AuthoredCaveFloorCap(a,
  interior.x,interior.surface,interior.z));
 assert.equal(a.set(interior.x,interior.surface,interior.z,BLOCK.AIR),true);
 assert.equal(originalM7AuthoredCaveFloorCap(a,
  interior.x,interior.surface,interior.z),null);
 const denied=replayFullOriginalM7CaveAnchorWalk(a,plan);
 assert.equal(denied.ok,false);
 assert.equal(denied.reason,'original-authored-source-was-edited');
 assert.equal(denied.ticks,0);
 console.log('# ENCHANTED ORIGINAL M7 REAL -30 CHAMBER INTERIOR AIR EDIT VETO '+
  JSON.stringify({sourcePosition:[interior.x,interior.surface,interior.z],
   authorizedOriginalPhysicsTicks:denied.ticks,
   userWorldFilesUntouched:true}));
});
