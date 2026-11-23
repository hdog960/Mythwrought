// Enchanted Phase 2 deep-cave continuation — original M7 ONLY.
// No synthetic floors, invented entrances, physics bypass, new world profile,
// live game changes or save migration. Earlier 112-step native run reused.
import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../../src/manual-biomes/profile-world.mjs';
import {BLOCK} from '../../src/voxel.mjs';
import {DEEP_CAVE_ORIGIN,deepCaveRoute}
  from '../../src/deep-cave-network.mjs';
import {originalM7AuthoredCaveFloorCap}
  from '../../src/manual-biomes/enchanted-original-cave-descent-evidence.mjs';
import {M7_FULL_SOURCE_WALK_BOUNDS,planFullOriginalM7CaveAnchorWalk,
  replayFullOriginalM7CaveAnchorWalk}
  from '../../src/manual-biomes/enchanted-original-full-anchor-continuity.mjs';
const seed=-88;
const world=experimental=>new FourRegionWorld(seed,
 fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR),
 experimental?{experimentalEnchantedTrees:true}:{});
const route=deepCaveRoute(DEEP_CAVE_ORIGIN);
function verify(world,steps){
 const source=planFullOriginalM7CaveAnchorWalk(world,'old-deep24',
   {spiralSteps:steps});
 const actual=source.ok?replayFullOriginalM7CaveAnchorWalk(world,source):null;
 return {source,actual};
}
const details=(n,r)=>({
 sourceStep:n,expectedOriginal:[route[n].x,route[n].floor,route[n].z],
 authoredSourceAccepted:r.source.ok,
 sourceReject:r.source.ok?null:{
   reason:r.source.reason,spiralStep:r.source.spiralStep??null,
   location:r.source.position??r.source.to??null},
 actualPhysicsAccepted:r.actual?.ok===true,
 playerReason:r.actual?.ok?null:r.actual?.reason??'source-not-authored',
 actualTicks:r.actual?.ticks??0,actuallyWalkedSpiralSteps:
 r.actual?.ok?r.actual.actualDeepSpiralStepsWalked:0,
 actualNetFeetDrop:r.actual?.ok?r.actual.actualPlayerFeetDrop:null,
 actualChunkSeams:r.actual?.ok?r.actual.realChunkSeams:0
});

test('original seed -88 surface-to-spiral step 168 crosses -46 depth band with ONE original player state',()=>{
 const a=world(false),b=world(true);
 const one=verify(a,168),two=verify(b,168);
 console.log('# ENCHANTED ORIGINAL M7 DEEP SECOND-BAND PHYSICAL GATE '+
   JSON.stringify({original:details(168,one),prototype:details(168,two)}));
 assert.equal(one.source.ok,true,'actual original cave floor/AIR must support every step');
 assert.equal(two.source.ok,true,'candidate trees may not fabricate cave source');
 assert.equal(one.actual.ok,true,'real original stepPlayer must physically reach second depth band');
 assert.equal(two.actual.ok,true,'real candidate stepPlayer must reach second depth band');
 assert.equal(one.actual.ticks,two.actual.ticks);
 assert.equal(one.actual.actualDeepSpiralStepsWalked,168);
 assert.equal(one.actual.sourceAnchorActuallyWalked,true);
 assert.equal(route[168].floor,-46);
 assert.equal(one.actual.fullDeepNetworkAccepted,false);
 assert.deepEqual(a.save(),{schema:1,seed,edits:[]});
 assert.throws(()=>b.save(),/cannot be saved as historical M7/);
});

test('genuine source and actual original/candidate second chamber route: classify 224, 280, 284, 300, 320 with no synthetic success',()=>{
 const a=world(false),b=world(true),record=[];
 assert.equal(M7_FULL_SOURCE_WALK_BOUNDS.spiralSteps,320);
 for(const n of [224,280,284,300,320]){
  const old=verify(a,n),experimental=verify(b,n);
  assert.equal(old.source.ok,experimental.source.ok,
   'experimental vegetation cannot mint an absent original cave floor');
  if(old.source.ok){
   assert.deepEqual(old.source.path.map(p=>[p.x,p.surface,p.z]),
     experimental.source.path.map(p=>[p.x,p.surface,p.z]));
   assert.deepEqual([old.source.path.at(-1).x,
      old.source.path.at(-1).surface,old.source.path.at(-1).z],
     [route[n].x,route[n].floor,route[n].z]);
  }
  assert.equal(old.actual?.ok??false,experimental.actual?.ok??false,
    'only true original physics and candidate physics parity accepted');
  if(old.actual?.ok){
   assert.equal(old.actual.ticks,experimental.actual.ticks);
   assert.equal(old.actual.actualDeepSpiralStepsWalked,n);
   assert.equal(old.actual.walkedLegs,old.source.path.length-1);
   assert.equal(old.actual.fullDeepNetworkAccepted,false);
  }
  record.push(details(n,old));
 }
 assert.equal(route[284].floor,-75,
  'second canonical deep rest chamber is exactly source floor -75');
 console.log('# ENCHANTED ORIGINAL M7 SECOND -75 CHAMBER ORIGINAL SOURCE AND PLAYER SURVEY '+
   JSON.stringify({secondChamberOriginalStep:284,records:record,
   genuinePhysicalPasses:record.filter(r=>r.actualPhysicsAccepted).length,
   completeNetworkAccepted:false,caveWrites:0}));
 assert.deepEqual(a.save(),{schema:1,seed,edits:[]});
 assert.throws(()=>b.save(),/cannot be saved as historical M7/);
});

test('real original second depth-band authored support AIR edit refuses any accepted cave-player physics',()=>{
 const original=world(false);
 const proof=planFullOriginalM7CaveAnchorWalk(original,'old-deep24',
   {spiralSteps:168});
 assert.equal(proof.ok,true);
 const target=proof.path.at(-1);
 assert.ok(originalM7AuthoredCaveFloorCap(original,
   target.x,target.surface,target.z));
 assert.equal(original.set(target.x,target.surface,target.z,BLOCK.AIR),true);
 assert.equal(originalM7AuthoredCaveFloorCap(original,
   target.x,target.surface,target.z),null);
 const denied=replayFullOriginalM7CaveAnchorWalk(original,proof);
 assert.equal(denied.ok,false);
 assert.equal(denied.reason,'original-authored-source-was-edited');
 assert.equal(denied.ticks,0);
 console.log('# ENCHANTED ORIGINAL M7 SECOND-BAND MINED REAL FLOOR VETO '+
 JSON.stringify({mined:[target.x,target.surface,target.z],
  originalPhysicsTicksAfterSourceEdit:denied.ticks,
  protectedOldPlayerSaves:true}));
});
