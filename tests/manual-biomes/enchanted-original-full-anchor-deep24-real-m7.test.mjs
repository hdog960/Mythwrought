// Source-native original M7 full entrance-to-anchor and old :24 deep
// spiral integration RESEARCH. No production integration or fake terrain.
// Every accepted route uses unchanged actual stepPlayer with retained
// velocity, gravity, original cave AIR, head/body and ground contact.
import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK} from '../../src/voxel.mjs';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../../src/manual-biomes/profile-world.mjs';
import {originalCaveEntranceSites}
  from '../../src/manual-caves/entrance-preflight.mjs';
import {deepCaveRoute,DEEP_CAVE_ORIGIN}
  from '../../src/deep-cave-network.mjs';
import {originalM7AuthoredCaveFloorCap}
  from '../../src/manual-biomes/enchanted-original-cave-descent-evidence.mjs';
import {planFullOriginalM7CaveAnchorWalk,replayFullOriginalM7CaveAnchorWalk}
  from '../../src/manual-biomes/enchanted-original-full-anchor-continuity.mjs';

const seed=-88;
const historical=()=>new FourRegionWorld(seed,
  fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
const experimental=()=>new FourRegionWorld(seed,
  fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR),
  {experimentalEnchantedTrees:true});
const names=['old-deep24','switchback36','upper24-windcut',
 'upper24-hollowbend'];

test('four named original M7 mouths reach ORIGINAL author-owned cave anchors in one continuous real player state',()=>{
 const original=historical(),candidate=experimental(),proofs=[];
 for(const name of names){
  const author=originalCaveEntranceSites().find(s=>s.name===name);
  assert.ok(author,'canonical original authored entrance anchor');
  const a=planFullOriginalM7CaveAnchorWalk(original,name);
  const b=planFullOriginalM7CaveAnchorWalk(candidate,name);
  assert.equal(a.ok,true,name+' original source rejection '+JSON.stringify(a));
  assert.equal(b.ok,true,name+' prototype source rejection '+JSON.stringify(b));
  assert.deepEqual(a.completedSourceAnchor,
    [author.x,author.floor,author.z]);
  assert.equal(a.path.length,a.sourceApproachSteps+2);
  assert.deepEqual(a.path.map(p=>[p.x,p.surface,p.z]),
    b.path.map(p=>[p.x,p.surface,p.z]));
  assert.equal(a.sourceOwnedDeepSpiralCells,0);
  const oldRun=replayFullOriginalM7CaveAnchorWalk(original,a);
  const newRun=replayFullOriginalM7CaveAnchorWalk(candidate,b);
  proofs.push({name,sourceStepCount:a.sourceApproachSteps,
    canonicalAnchor:a.completedSourceAnchor,
    oldRun,newRun});
  if(!oldRun.ok||!newRun.ok)continue;
  assert.equal(oldRun.walkedLegs,a.sourceApproachSteps+1);
  assert.equal(oldRun.sourceAnchorActuallyWalked,true);
  assert.equal(oldRun.ticks,newRun.ticks);
  assert.ok(Math.abs(oldRun.actualPlayerFeetDrop-
    (a.path[0].feet-a.path.at(-1).feet))<.1);
  assert.ok(oldRun.groundContactTicks>0);
  assert.equal(oldRun.fullDeepNetworkAccepted,false);
 }
 console.log('# ENCHANTED FOUR ORIGINAL M7 FULL AUTHORED ANCHOR PHYSICS '+
   JSON.stringify({proofs,completed:proofs.filter(p=>p.oldRun.ok&&p.newRun.ok).length,
     sourceOnly:true,deepNetworkNotGloballyAccepted:true}));
 assert.equal(proofs.filter(p=>p.oldRun.ok&&p.newRun.ok).length,4,
   'never claim all four original cave anchors without real full physics');
 assert.deepEqual(original.save(),{schema:1,seed,edits:[]});
 assert.throws(()=>candidate.save(),/cannot be saved as historical M7/);
});

test('original old-deep24 surface -> authored anchor -> original :24 spiral is one uninterrupted gravity-grounded M7 walk',()=>{
 const original=historical(),candidate=experimental();
 const spiral=deepCaveRoute(DEEP_CAVE_ORIGIN);
 const a=planFullOriginalM7CaveAnchorWalk(original,'old-deep24',{
   spiralSteps:8});
 const b=planFullOriginalM7CaveAnchorWalk(candidate,'old-deep24',{
   spiralSteps:8});
 assert.equal(a.ok,true,'authentic original spiral source '+JSON.stringify(a));
 assert.equal(b.ok,true,'candidate exact spiral source '+JSON.stringify(b));
 assert.deepEqual(a.completedSourceAnchor,
   [spiral[0].x,spiral[0].floor,spiral[0].z]);
 assert.deepEqual(a.path.map(p=>[p.x,p.surface,p.z]),
   b.path.map(p=>[p.x,p.surface,p.z]));
 assert.equal(a.lastOriginalSpiralStep,8);
 const last=a.path.at(-1),step=spiral[8];
 assert.deepEqual([last.x,last.surface,last.z],[step.x,step.floor,step.z]);
 assert.equal(original.environmentCaves.get(step.x,step.floor,step.z),last.material);
 assert.ok(originalM7AuthoredCaveFloorCap(original,step.x,step.floor,step.z));
 const oldRun=replayFullOriginalM7CaveAnchorWalk(original,a);
 const newRun=replayFullOriginalM7CaveAnchorWalk(candidate,b);
 console.log('# ENCHANTED ORIGINAL M7 SURFACE-TO-TRUE-DEEP24 SPIRAL CONTINUOUS PHYSICS '+
   JSON.stringify({anchor:a.completedSourceAnchor,realDeepEnd:[step.x,step.floor,step.z],
     original:oldRun,prototype:newRun,sourceOnly:true,
     caveNetworkFullLengthNotAccepted:true}));
 assert.equal(oldRun.ok,true,'never claim original spiral physics without full walk');
 assert.equal(newRun.ok,true,'candidate may not change original deep spiral physical access');
 assert.equal(oldRun.ticks,newRun.ticks);
 assert.equal(oldRun.sourceAnchorActuallyWalked,true);
 assert.equal(oldRun.actualDeepSpiralStepsWalked,8);
 assert.equal(oldRun.walkedLegs,a.path.length-1);
 assert.ok(oldRun.deepestPlayerFeet<=-4.9);
 assert.ok(oldRun.groundContactTicks>0);
 assert.equal(oldRun.fullDeepNetworkAccepted,false);
 assert.deepEqual(original.save(),{schema:1,seed,edits:[]});
 assert.throws(()=>candidate.save(),/cannot be saved as historical M7/);
});

test('real AIR-mining deep original spiral support vetoes the entire precomputed route before any movement',()=>{
 const original=historical();
 const source=planFullOriginalM7CaveAnchorWalk(original,'old-deep24',{
  spiralSteps:8});
 assert.equal(source.ok,true);
 const at=source.path.at(-1);
 assert.ok(at.spiralStep===8&&at.owner==='original-source-authored-cave-floor');
 assert.equal(original.set(at.x,at.surface,at.z,BLOCK.AIR),true);
 assert.equal(original.get(at.x,at.surface,at.z),BLOCK.AIR);
 assert.equal(originalM7AuthoredCaveFloorCap(original,
   at.x,at.surface,at.z),null);
 const rejected=replayFullOriginalM7CaveAnchorWalk(original,source);
 assert.equal(rejected.ok,false);
 assert.equal(rejected.reason,'original-authored-source-was-edited');
 assert.equal(rejected.ticks,0);
 assert.deepEqual(rejected.position,[at.x,at.surface,at.z]);
 console.log('# ENCHANTED ORIGINAL M7 DEEP SPIRAL SOURCE-MINING VETO '+
   JSON.stringify({sourceAt:rejected.position,
     sourceAuthoredEditedAIR:true,physicsTicksAfterEdit:rejected.ticks,
     noProductionSaveWrites:true}));
});
