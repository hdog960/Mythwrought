import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,worldKey,baseBlock} from '../src/voxel.mjs';
import {descentEntranceApproach,descentRoute} from '../src/underground-switchback-descent.mjs';
import {FourRegionWorld,fourRegionProfile,restoreFourRegionWorld,M7_ENVIRONMENT_GENERATOR} from '../src/manual-biomes/profile-world.mjs';
import {CaveVoxelWorld} from '../src/manual-caves/cave-voxel-world.mjs';
import {VoxelWorld} from '../src/voxel.mjs';
import {planNewCaveEntrances} from '../src/manual-caves/entrance-preflight.mjs';
import {planRetainedOriginalDescent,traverseRetainedDescent} from '../src/living-underworld/retained-switchback-descent-route.mjs';
const nominal=descentRoute();
for(const seed of [8675309,13579]){
 test('native actual M7 retained descent route '+seed,()=>{
  const profile=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR);
  const world=new FourRegionWorld(seed,profile),before=JSON.stringify(world.save());
  const cave=new CaveVoxelWorld(seed,{approved:true});
  const plan=planNewCaveEntrances({world:new VoxelWorld(seed),sourceCells:cave.caveCellMap,
   additionalSourceMaps:[cave.caveConnectorCells,cave.caveEastCells],approved:true});
  assert.ok(plan.ok,JSON.stringify(plan.failures));
  const entry=plan.entrances.find(e=>e.name==='switchback36');
  const result=planRetainedOriginalDescent(world,{maxStations:nominal.length});
  const route=[...entry.route].reverse().concat(descentEntranceApproach().slice(1),result.route.slice(1));
  const joinedForward=traverseRetainedDescent(world,route);
  const joinedReverse=traverseRetainedDescent(world,[...route].reverse());
  const {route:points,...summary}=result;
  console.log(JSON.stringify({seed,...summary,joinedForward,joinedReverse,joinedStations:route.length,
   firstOffset:points.find(p=>p.offsetCost>0)??null}));
  assert.equal(JSON.stringify(world.save()),before);
  assert.equal(result.constructedSupportCells,0);
  assert.equal(result.worldChanged,false);
  assert.equal(result.liveWalkingVerified,false);
  assert.ok(result.verifiedPrefixStations>=32,'At least 32 retained descent stations required');
  assert.ok(result.forward?.ok,'selected prefix must replay continuously forward');
  assert.ok(result.reverse?.ok,'selected prefix must replay continuously reverse');
  assert.ok(joinedForward.ok&&joinedReverse.ok,'actual joined surface-to-prefix replay must pass both directions');
  if(result.ok)assert.equal(result.verifiedPrefixStations,nominal.length);
  for(let i=0;i<points.length;i++){
   const p=points[i],n=nominal[i];
   assert.ok(Math.abs(p.x-n.x)<=1&&Math.abs(p.z-n.z)<=1);
   assert.ok(p.feet>=n.feet-2&&p.feet<=n.feet+1);
   assert.equal(world.environmentCaves.get(p.x,p.feet,p.z),BLOCK.AIR);
  }
 });
}
for(const seed of [179,8675309,13579]){
 test('native in-memory M7 authored AIR edit round trip '+seed,()=>{
  const profile=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR);
  const world=new FourRegionWorld(seed,profile);
  const p=nominal[24],x=p.x,y=p.feet,z=p.z,k=worldKey(x,y,z);
  assert.equal(world.get(x,y,z),BLOCK.AIR);
  const id=baseBlock(x,y,z,seed);
  assert.notEqual(id,BLOCK.AIR);
  assert.ok(world.set(x,y,z,id));
  assert.equal(world.edits.get(k),id);
  const payload=world.save(),snapshot=JSON.stringify(payload);
  const restored=restoreFourRegionWorld(payload,profile);
  assert.equal(restored.get(x,y,z),id);
  assert.equal(restored.edits.get(k),id);
  assert.deepEqual(restored.save(),payload);
  assert.deepEqual(restored.generationProfile,profile);
  assert.equal(JSON.stringify(payload),snapshot);
  assert.equal(restored.environmentCaves.get(x,y,z),BLOCK.AIR);
  assert.throws(()=>restoreFourRegionWorld(payload,fourRegionProfile(seed===179?2026:179,M7_ENVIRONMENT_GENERATOR)));
  console.log(JSON.stringify({seed,roundTrip:true,originalAuthoredAirPreserved:true,explicitEditId:id,wrongSeedRefused:true}));
 });
}
test('retained-route bounds cannot be increased past original authored station count',()=>{
 const world=new FourRegionWorld(179,fourRegionProfile(179,M7_ENVIRONMENT_GENERATOR));
 assert.throws(()=>planRetainedOriginalDescent(world,{maxStations:nominal.length+1}),TypeError);
 assert.throws(()=>planRetainedOriginalDescent(world,{beamWidth:7}),TypeError);
});
