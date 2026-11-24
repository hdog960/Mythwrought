// Real original M7 third rest room is a source-verified 3-cell physical
// detour and RETURN, not a floor-depth statistic or generated bridge.
import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../../src/manual-biomes/profile-world.mjs';
import {BLOCK} from '../../src/voxel.mjs';
import {originalM7AuthoredCaveFloorCap}
  from '../../src/manual-biomes/enchanted-original-cave-descent-evidence.mjs';
import {replayFullOriginalM7CaveAnchorWalk}
  from '../../src/manual-biomes/enchanted-original-full-anchor-continuity.mjs';
import {planOriginalM7ThirdChamberRoundTrip,
  surveyOriginalM7ThirdChamberPhysicalReturn,
  M7_THIRD_REST_CHAMBER}
  from '../../src/manual-biomes/enchanted-original-third-chamber-roundtrip.mjs';
const seed=-88;
const world=trees=>new FourRegionWorld(seed,
  fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR),
  trees?{experimentalEnchantedTrees:true}:{});
const info=s=>({
  ok:s.ok,reason:s.reason??null,
  realSpoke:s.plan?.originalThirdChamberSpoke.map(p=>
   [p.x,p.surface,p.z])??null,
  direction:s.plan?.originalThirdChamberDirection??null,
  originalSourceRejections:s.originalSourceDirections??null,
  sourceBackedPhysicalTrials:s.attempts??null,
  ticks:s.replay?.ticks??0,
  routeResumed:s.replay?.actualDeepSpiralStepsWalked??0,
  originalChamberEntirelyWalked:false
});
test('original M7 continuous surface-to-third -130 chamber 3-cell spoke out/back then continue spiral 520',()=>{
 const a=world(false),b=world(true);
 const old=surveyOriginalM7ThirdChamberPhysicalReturn(a);
 const candidate=surveyOriginalM7ThirdChamberPhysicalReturn(b);
 console.log('# ENCHANTED ORIGINAL M7 PHYSICALLY ENTER AND RETURN THIRD -130 REST ROOM '+
  JSON.stringify({historical:info(old),experimental:info(candidate),
    floor:-130,disallowedInventedSource:true}));
 assert.equal(old.ok,true,'actual original M7 must authentically enter third room');
 assert.equal(candidate.ok,true,'candidate original cave physics cannot be fabricated');
 assert.deepEqual(old.plan.originalThirdChamberDirection,
   candidate.plan.originalThirdChamberDirection);
 assert.deepEqual(old.plan.originalThirdChamberSpoke.map(p=>[p.x,p.surface,p.z]),
   candidate.plan.originalThirdChamberSpoke.map(p=>[p.x,p.surface,p.z]));
 assert.equal(old.plan.originalThirdChamberOutAndBackSteps,6);
 assert.equal(old.replay.ticks,candidate.replay.ticks);
 assert.equal(old.replay.actualDeepSpiralStepsWalked,520);
 assert.equal(old.replay.walkedLegs,old.plan.path.length-1);
 assert.equal(old.physicallyReturnedToOriginalSpiral,true);
 assert.equal(old.fullThirdChamberNotClaimed,true);
 assert.equal(old.deepNetworkComplete,false);
 assert.deepEqual(a.save(),{schema:1,seed,edits:[]});
 assert.throws(()=>b.save(),/cannot be saved as historical M7/);
});
test('original third room AIR edit to an authentic authored interior floor vetoes EVERY precomputed player tick',()=>{
 const a=world(false),source=planOriginalM7ThirdChamberRoundTrip(a);
 assert.equal(source.ok,true,'real original source-author must own selected third room floor');
 const plan=source.candidates[0],far=plan.originalThirdChamberSpoke.at(-1);
 assert.ok(originalM7AuthoredCaveFloorCap(a,far.x,far.surface,far.z));
 assert.equal(a.set(far.x,far.surface,far.z,BLOCK.AIR),true);
 assert.equal(originalM7AuthoredCaveFloorCap(a,far.x,far.surface,far.z),null);
 const denied=replayFullOriginalM7CaveAnchorWalk(a,plan);
 assert.equal(denied.ok,false);
 assert.equal(denied.reason,'original-authored-source-was-edited');
 assert.equal(denied.ticks,0);
 assert.equal(M7_THIRD_REST_CHAMBER.floor,-130);
 console.log('# ENCHANTED ORIGINAL M7 THIRD CHAMBER SOURCE FLOOR MINING VETO '+
  JSON.stringify({trueOriginalMinedCell:[far.x,far.surface,far.z],
   acceptedPhysicsAfterAIR:0,realUserWorldUntouched:true}));
});
