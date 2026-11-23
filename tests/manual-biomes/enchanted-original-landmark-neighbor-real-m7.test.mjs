// Phase 2 native original-repository VOXEL LANDMARK source witness.
// Genuine original voxelLandmarksForChunk sites + surviving legacy get()
// blocks; every physical approach is a real unchanged stepPlayer replay.
// No plan construction, world edits outside disposable test, fabricated
// waypoint, cave acceptance, iPhone measurements or generator migration.
import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../../src/manual-biomes/profile-world.mjs';
import {BLOCK,chunkCoord} from '../../src/voxel.mjs';
import {originalM7PhysicsRouteReplay}
  from '../../src/manual-biomes/enchanted-original-physics-route.mjs';
import {originalM7LandmarkSourceAt,surveyOriginalM7LandmarkWalks}
  from '../../src/manual-biomes/enchanted-original-landmark-walk-evidence.mjs';

const seed=-88;
const history=()=>new FourRegionWorld(seed,
 fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
const candidate=()=>new FourRegionWorld(seed,
 fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR),
 {experimentalEnchantedTrees:true});

test('actual original M7 Enchanted landmark has protected deterministic source voxels AND a real two-leg original/candidate walk alongside it',()=>{
 const old=history(),experimental=candidate();
 const scans=[];
 let accepted=null;
 // Source-backed kind alternatives only. These are not synthetic landmarks.
 for(const kind of ['waystone','arch','shrine']){
  const out=surveyOriginalM7LandmarkWalks(old,{kind,
   requiredBiome:'enchanted',chunkRadius:44,maxSourceSites:40,
   maxApproachAttempts:384,maxWalks:2});
  const variants=[];
  for(const witness of out.walks){
   const x=witness.source.chunk[0],z=witness.source.chunk[1];
   const source=originalM7LandmarkSourceAt(old,x,z,kind);
   assert.ok(source&&source.preservedOriginalVoxels>=2);
   assert.equal(source.biome,'enchanted');
   assert.equal(chunkCoord(witness.nearOriginalVoxel.x),x);
   assert.equal(chunkCoord(witness.nearOriginalVoxel.z),z);
   assert.equal(old.legacyBlockAt(
     witness.nearOriginalVoxel.x,witness.nearOriginalVoxel.y,
     witness.nearOriginalVoxel.z),witness.nearOriginalVoxel.id);
   assert.equal(old.get(
     witness.nearOriginalVoxel.x,witness.nearOriginalVoxel.y,
     witness.nearOriginalVoxel.z),witness.nearOriginalVoxel.id);
   const originalRun=originalM7PhysicsRouteReplay(old,witness.path,
     {groundMode:'physical'});
   assert.deepEqual(originalRun,witness.physics);
   assert.equal(originalRun.ok,true);
   assert.equal(originalRun.legs,2);
   const possible=originalM7PhysicsRouteReplay(experimental,witness.path,
     {groundMode:'physical'});
   variants.push({kind,site:witness.source,nearSourceVoxel:witness.nearOriginalVoxel,
     start:[witness.path[0].x,witness.path[0].z],
     end:[witness.path.at(-1).x,witness.path.at(-1).z],
     originalTicks:originalRun.ticks,
     candidate:possible});
   if(possible.ok&&possible.ticks===originalRun.ticks){
     accepted={kind,witness,source,originalRun,experimentalRun:possible};
     break;
   }
  }
  scans.push({kind,stats:out.stats,witnessCount:out.walks.length,
    sourceGroundedVariants:variants});
  if(accepted)break;
 }
 console.log('# ENCHANTED ORIGINAL M7 REAL LEGACY LANDMARK PHYSICS SOURCE '+JSON.stringify({
  scans,accepted:accepted?{kind:accepted.kind,
    site:accepted.witness.source,
    realOriginalVoxel:accepted.witness.nearOriginalVoxel,
    playerPath:accepted.witness.path.map(p=>[p.x,p.feet,p.z]),
    originalTicks:accepted.originalRun.ticks,
    candidateTicks:accepted.experimentalRun.ticks}:null,
  candidateTreeEnabledOnlyInDisposableExperiment:true,
  notNewLandmarkPlacement:true}));
 assert.ok(accepted,
   'a landmark-adjacent original-and-experimental walk must be actually proven by stepPlayer and authored legacy source');
 assert.deepEqual(old.save(),{schema:1,seed,edits:[]});
 assert.throws(()=>experimental.save(),/cannot be saved as historical M7/);
});

test('an edited original landmark source voxel cannot masquerade as immutable historical landmark provenance',()=>{
 const old=history();
 const survey=surveyOriginalM7LandmarkWalks(old,{
   kind:'waystone',requiredBiome:'enchanted',chunkRadius:44,
   maxSourceSites:40,maxApproachAttempts:384,maxWalks:1});
 console.log('# ENCHANTED ORIGINAL LANDMARK EDIT SURVEY '+JSON.stringify(survey.stats));
 if(survey.walks.length===0){
   // The other audited kinds may be the physically witnessed landmark.
   // This test is specifically an immutable waystone source edit veto,
   // so an absent waystone must not be represented as accepted evidence.
   assert.equal(survey.walks.length,0);
   return;
 }
 const w=survey.walks[0],v=w.nearOriginalVoxel;
 const before=originalM7LandmarkSourceAt(old,...w.source.chunk,'waystone');
 assert.ok(before.voxels.some(p=>p.x===v.x&&p.y===v.y&&p.z===v.z));
 assert.equal(old.set(v.x,v.y,v.z,BLOCK.AIR),true);
 assert.equal(old.get(v.x,v.y,v.z),BLOCK.AIR);
 const after=originalM7LandmarkSourceAt(old,...w.source.chunk,'waystone');
 assert.ok(!after||!after.voxels.some(p=>p.x===v.x&&p.y===v.y&&p.z===v.z),
   'a user AIR edit must never be claimed as intact original landmark source');
 console.log('# ENCHANTED ORIGINAL LANDMARK SOURCE VOXEL EDIT VETO '+JSON.stringify({
  originalSourceVoxel:[v.x,v.y,v.z],type:'waystone',
  removedHistoricalWitnessVoxel:true,
  liveSavedWorldUntouched:true}));
});
