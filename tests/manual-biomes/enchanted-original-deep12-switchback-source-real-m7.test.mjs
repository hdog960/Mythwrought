// Changed-only original M7 deep :24 and cross-owner :36 source research.
// Earlier 3/3 complete-anchor native results are reused, never rerun.
import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK} from '../../src/voxel.mjs';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../../src/manual-biomes/profile-world.mjs';
import {DEEP_CAVE_ORIGIN,deepCaveRoute}
  from '../../src/deep-cave-network.mjs';
import {planFullOriginalM7CaveAnchorWalk,
  replayFullOriginalM7CaveAnchorWalk}
  from '../../src/manual-biomes/enchanted-original-full-anchor-continuity.mjs';
import {surveyOriginalM7SwitchbackAnchorTo36}
  from '../../src/manual-biomes/enchanted-original-crossowner-network-audit.mjs';
import {originalM7AuthoredCaveFloorCap}
  from '../../src/manual-biomes/enchanted-original-cave-descent-evidence.mjs';

const seed=-88;
const old=()=>new FourRegionWorld(seed,
  fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
const candidate=()=>new FourRegionWorld(seed,
  fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR),
  {experimentalEnchantedTrees:true});

test('original M7 deep24 source actually walks twelve original-spiral steps from surface with no player reset',()=>{
 const a=old(),b=candidate();
 const s=planFullOriginalM7CaveAnchorWalk(a,'old-deep24',{spiralSteps:12});
 const t=planFullOriginalM7CaveAnchorWalk(b,'old-deep24',{spiralSteps:12});
 assert.equal(s.ok,true,JSON.stringify(s));
 assert.equal(t.ok,true,JSON.stringify(t));
 assert.deepEqual(s.path.map(p=>[p.x,p.surface,p.z]),
   t.path.map(p=>[p.x,p.surface,p.z]));
 const original=replayFullOriginalM7CaveAnchorWalk(a,s);
 const prototype=replayFullOriginalM7CaveAnchorWalk(b,t);
 const route=deepCaveRoute(DEEP_CAVE_ORIGIN);
 const end=route[12];
 console.log('# ENCHANTED ORIGINAL M7 DEEP24 TWELVE CONTINUOUS SPIRAL STEPS '+JSON.stringify({
   sourceAnchor:s.completedSourceAnchor,
   originalEnd:[end.x,end.floor,end.z],
   original:{ok:original.ok,walkedLegs:original.walkedLegs,
     ticks:original.ticks,actualPlayerFeetDrop:original.actualPlayerFeetDrop,
     originalDeepSpiralPhysicallyReached:original.originalDeepSpiralPhysicallyReached,
     actualDeepSpiralStepsWalked:original.actualDeepSpiralStepsWalked},
   prototype:{ok:prototype.ok,ticks:prototype.ticks,
     physicalDeepSpiralSteps:prototype.actualDeepSpiralStepsWalked},
   wholeDeepNetworkAcceptance:false}));
 assert.equal(original.ok,true,'cannot certify more deep steps from source data alone');
 assert.equal(prototype.ok,true);
 assert.equal(original.ticks,prototype.ticks);
 assert.equal(original.walkedLegs,s.path.length-1);
 assert.equal(original.actualDeepSpiralStepsWalked,12);
 assert.equal(original.sourceAnchorActuallyWalked,true);
 assert.deepEqual([s.path.at(-1).x,s.path.at(-1).surface,s.path.at(-1).z],
   [end.x,end.floor,end.z]);
 assert.equal(original.fullDeepNetworkAccepted,false);
 assert.deepEqual(a.save(),{schema:1,seed,edits:[]});
 assert.throws(()=>b.save(),/cannot be saved as historical M7/);
});

test('original :36 cross-owner switchback seam differentiates actual source AIR/floors from a physically walked path',()=>{
 const a=old(),b=candidate();
 const x=surveyOriginalM7SwitchbackAnchorTo36(a,{routeSteps:8});
 const y=surveyOriginalM7SwitchbackAnchorTo36(b,{routeSteps:8});
 assert.equal(x.ok,true);assert.equal(y.ok,true);
 assert.deepEqual(x.anchor,[192,-4,188]);
 assert.equal(x.proposedOriginalOwnerSteps,12);
 assert.equal(x.sourceObservations.length>=1,true);
 assert.deepEqual(x.sourceObservations.map(p=>p.source),
   y.sourceObservations.map(p=>p.source));
 assert.equal(x.entireNetworkProven,false);
 assert.equal(x.inferredOrFilledOriginalTerrain,false);
 assert.equal(y.entireNetworkProven,false);
 assert.equal(x.actualJoinedPhysicsAccepted,x.actualFullJoinedPhysicsAttempt?.ok===true);
 if(x.actualJoinedPhysicsAccepted){
  assert.equal(x.sourceAuthenticatedSteps,12);
  assert.equal(x.actualFullJoinedPhysicsAttempt.sourceAnchorActuallyWalked,true);
  assert.equal(x.actualFullJoinedPhysicsAttempt.walkedLegs,33);
  assert.equal(y.actualJoinedPhysicsAccepted,true);
  assert.equal(x.actualFullJoinedPhysicsAttempt.ticks,
    y.actualFullJoinedPhysicsAttempt.ticks);
 }else assert.ok(x.sourceAuthenticatedSteps<12||
     x.actualFullJoinedPhysicsAttempt?.ok===false,
   'a source-only partial approach must never mint physics acceptance');
 console.log('# ENCHANTED ORIGINAL M7 SWITCHBACK36 SOURCE/PHYSICS OWNER HANDOFF '+
  JSON.stringify({original:x,prototype:{
    sourceAuthenticatedSteps:y.sourceAuthenticatedSteps,
    realPhysicsAccepted:y.actualJoinedPhysicsAccepted,
    originalGroundUnchanged:true},zeroConstructedSource:true}));
 assert.deepEqual(a.save(),{schema:1,seed,edits:[]});
 assert.throws(()=>b.save(),/cannot be saved as historical M7/);
});

test('mining the actual twelfth original deep spiral floor forbids any precomputed full-route replay',()=>{
 const world=old();
 const plan=planFullOriginalM7CaveAnchorWalk(world,'old-deep24',{spiralSteps:12});
 assert.equal(plan.ok,true);
 const p=plan.path.at(-1);
 assert.equal(p.spiralStep,12);
 assert.equal(world.set(p.x,p.surface,p.z,BLOCK.AIR),true);
 assert.equal(originalM7AuthoredCaveFloorCap(world,p.x,p.surface,p.z),null);
 const result=replayFullOriginalM7CaveAnchorWalk(world,plan);
 assert.equal(result.ok,false);
 assert.equal(result.reason,'original-authored-source-was-edited');
 assert.equal(result.ticks,0);
 console.log('# ENCHANTED ORIGINAL M7 TWELFTH SPIRAL MINED FLOOR VETO '+JSON.stringify({
  source:[p.x,p.surface,p.z],originalPlayerTicksAfterEdit:result.ticks,
  sourceIntegrityPreserved:true,realUserSavesUnchanged:true}));
});
