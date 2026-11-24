// Enchanted P2: new and ONLY deep THIRD-band exact native checks.
// Real original M7 original + optional-tree candidate, actual author cells,
// no player restart across the source-owned spiral; mined AIR veto.
// Inherited <=320 and -75 suites are intentionally NOT rerun.
import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR} from '../../src/manual-biomes/profile-world.mjs';
import {DEEP_CAVE_ORIGIN,deepCaveRoute} from '../../src/deep-cave-network.mjs';
import {BLOCK} from '../../src/voxel.mjs';
import {originalM7AuthoredCaveFloorCap} from '../../src/manual-biomes/enchanted-original-cave-descent-evidence.mjs';
import {M7_FULL_SOURCE_WALK_BOUNDS,planFullOriginalM7CaveAnchorWalk,replayFullOriginalM7CaveAnchorWalk} from '../../src/manual-biomes/enchanted-original-full-anchor-continuity.mjs';
const seed=-88;
const world=(trees=false)=>new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR),
 trees?{experimentalEnchantedTrees:true}:{});
const route=deepCaveRoute(DEEP_CAVE_ORIGIN);
function assess(w,n){
 const source=planFullOriginalM7CaveAnchorWalk(w,'old-deep24',{spiralSteps:n});
 const real=source.ok?replayFullOriginalM7CaveAnchorWalk(w,source):null;
 return {source,real};
}
function summary(n,x){return {step:n,originalTarget:[route[n].x,route[n].floor,route[n].z],
 sourced:x.source.ok,sourceReason:x.source.ok?null:x.source.reason,
 sourceBlockedAt:x.source.position??null,
 physicallyReached:x.real?.ok===true,physicsReason:x.real?.ok?null:x.real?.reason??'source-blocked',
 actualTicks:x.real?.ticks??0,actualWalkingLegs:x.real?.walkedLegs??0,
 actualFeetDrop:x.real?.actualPlayerFeetDrop??null,
 signedChunkSeams:x.real?.realChunkSeams??0,
 acceptedSpiralSteps:x.real?.ok?x.real.actualDeepSpiralStepsWalked:0};}
test('authentic old-M7 uninterrupted player reaches third depth band at original spiral step 388 (floor -101)',()=>{
 const old=world(),candidate=world(true),n=388;
 const a=assess(old,n),b=assess(candidate,n);
 console.log('# ENCHANTED P2 TRUE ORIGINAL M7 THIRD DEPTH BAND ENTRY '+JSON.stringify({original:summary(n,a),candidate:summary(n,b)}));
 assert.equal(M7_FULL_SOURCE_WALK_BOUNDS.spiralSteps,548);
 assert.equal(route[n].floor,-101);
 assert.equal(a.source.ok,true,'No original source AIR/floor bridge may be invented');
 assert.equal(b.source.ok,true);
 assert.deepEqual(a.source.path.map(p=>[p.x,p.surface,p.z]),b.source.path.map(p=>[p.x,p.surface,p.z]));
 assert.equal(a.real.ok,true,'Actual unchanged original stepPlayer must finish to the -101 depth band');
 assert.equal(b.real.ok,true);
 assert.equal(a.real.ticks,b.real.ticks);
 assert.equal(a.real.actualDeepSpiralStepsWalked,n);
 assert.equal(a.real.sourceAnchorActuallyWalked,true);
 assert.equal(a.real.fullDeepNetworkAccepted,false);
 assert.deepEqual(old.save(),{schema:1,seed,edits:[]});
 assert.throws(()=>candidate.save(),/cannot be saved as historical M7/);
});
test('real original source-owned spiral around third -130 rest chamber and farther; honest per-endpoint source/physics dispositions',()=>{
 const a=world(),b=world(true),probes=[];
 for(const n of [408,448,488,504,528,548]){
  const left=assess(a,n),right=assess(b,n);
  assert.equal(left.source.ok,right.source.ok,'Experimental trees cannot manufacture a missing cave floor');
  if(left.source.ok){
   assert.deepEqual([left.source.path.at(-1).x,left.source.path.at(-1).surface,left.source.path.at(-1).z],
    [route[n].x,route[n].floor,route[n].z]);
   assert.deepEqual(left.source.path.map(p=>[p.x,p.surface,p.z]),right.source.path.map(p=>[p.x,p.surface,p.z]));
  }
  assert.equal(left.real?.ok??false,right.real?.ok??false,'No unmatched original and candidate physical admission');
  if(left.real?.ok){
   assert.equal(left.real.ticks,right.real.ticks);
   assert.equal(left.real.actualDeepSpiralStepsWalked,n);
   assert.equal(left.real.walkedLegs,left.source.path.length-1);
  }
  probes.push(summary(n,left));
 }
 assert.equal(route[504].floor,-130,'third ORIGINAL source room floor must be -130');
 console.log('# ENCHANTED P2 ORIGINAL M7 THIRD ROOM AND ROUTE LONG PHYSICS SURVEY '+JSON.stringify({probes,
  genuinelyPhysicallyReached:probes.filter(q=>q.physicallyReached).length,
  noSourceWrites:true,notEntireDeepNetwork:true}));
 assert.deepEqual(a.save(),{schema:1,seed,edits:[]});
 assert.throws(()=>b.save(),/cannot be saved as historical M7/);
});
test('mining original third-band authored support rejects original 388-step replay before physics',()=>{
 const w=world(),p=planFullOriginalM7CaveAnchorWalk(w,'old-deep24',{spiralSteps:388});
 assert.equal(p.ok,true);
 const last=p.path.at(-1);
 assert.ok(originalM7AuthoredCaveFloorCap(w,last.x,last.surface,last.z));
 assert.equal(w.set(last.x,last.surface,last.z,BLOCK.AIR),true);
 assert.equal(originalM7AuthoredCaveFloorCap(w,last.x,last.surface,last.z),null);
 const denied=replayFullOriginalM7CaveAnchorWalk(w,p);
 assert.equal(denied.ok,false);
 assert.equal(denied.reason,'original-authored-source-was-edited');
 assert.equal(denied.ticks,0);
 console.log('# ENCHANTED P2 ORIGINAL THIRD-BAND FLOOR REAL MINING VETO '+JSON.stringify({
  originalSource:[last.x,last.surface,last.z],authenticControllerTicks:denied.ticks,
  userSavesUnchanged:true}));
});
