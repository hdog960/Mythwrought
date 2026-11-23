// Full ORIGINAL M7 3x2 canonical conifer forest with actual original
// physics.stepPlayer and voxel.collides; test source is not a synthetic world.
// This is detached research, not a new active world generator or release.
import assert from 'node:assert/strict';
import test from 'node:test';
import {VoxelWorld,terrainHeight,collides} from '../src/voxel.mjs';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR,
  restoreFourRegionWorld} from '../src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
import {proposedSnowTree}
  from '../src/manual-biomes/snowy-s3-tree-prototypes.mjs';
import {planEnvironmentalScenery} from '../src/nonblock/staged-habitats.mjs';
import {describeCandidateObject} from '../src/nonblock/candidate-scene.mjs';
import {stepPlayer} from '../src/physics.mjs';
import {auditSnowS6CrossOwnerForest}
  from '../src/manual-biomes/snowy-s6-cross-owner-forest-audit.mjs';

test('real original seed179/2026 six-chunk source-owned forest preserves native stepPlayer passages',()=>{
 let totalTrees=0,totalSteps=0;
 for(const seed of [179,2026]){
  const profile=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR);
  const world=new FourRegionWorld(seed,profile),save=JSON.stringify(world.save());
  const deps={biomeAt:v6BiomeAt,terrainHeight,proposedSnowTree,
    legacyNatural:(x,y,z)=>VoxelWorld.prototype.naturalAndLandmarkBlock.call(world,x,y,z),
    planScenery:planEnvironmentalScenery,describeScene:describeCandidateObject,
    collides};
  const opts={width:3,height:2,stepPlayer};
  const result=auditSnowS6CrossOwnerForest(world,-2,32,deps,opts);
  assert.equal(result.safe,true,'Original 3x2 combined body+stepPlayer veto: '+result.reason);
  assert.deepEqual(result.window,[-2,32,3,2]);
  assert.equal(result.chunks.length,6);
  assert.equal(result.originalStepPlayerSourceUsed,true);
  assert.equal(result.originalStepFrames,result.originalWalkedTrees*45);
  assert.equal(result.walks.length,result.originalWalkedTrees);
  assert.ok(result.distinctAcceptedTrees<=96);
  assert.ok(result.bodyProbes<=result.distinctAcceptedTrees*6000);
  assert.equal(result.noWholeWorldApproval,true);
  assert.equal(result.writerEnabled,false);
  assert.equal(result.originalSourceUnchanged,true);
  assert.equal(result.readOnly,true);
  assert.equal(Object.values(result.styleCounts).reduce((a,b)=>a+b,0),
    result.distinctAcceptedTrees);
  // Every prior four-chunk owner slice must be byte-for-byte consistent
  // when visited as part of this larger six-chunk read-only forest.
  const four=auditSnowS6CrossOwnerForest(world,-1,32,deps);
  assert.equal(four.safe,true,'Original legacy 2x2 cross-owner contract: '+four.reason);
  for(const old of four.chunks){
    const expanded=result.chunks.find(c=>c.cx===old.cx&&c.cz===old.cz);
    assert.ok(expanded,'Six-chunk source lost original 2x2 chunk');
    assert.equal(expanded.physicalCells,old.physicalCells);
    assert.equal(expanded.accepted,old.accepted);
  }
  const reverse=auditSnowS6CrossOwnerForest(world,-2,32,deps,
    {...opts,reverse:true});
  assert.equal(reverse.safe,true,'Native reverse original physical source: '+reverse.reason);
  assert.deepEqual(reverse,result);
  assert.equal(JSON.stringify(world.save()),save);
  assert.deepEqual(restoreFourRegionWorld(world.save(),profile).save(),world.save());
  for(const walk of result.walks){
    assert.equal(walk.frames,45);
    assert.ok(walk.start.every(Number.isFinite));
    assert.ok(walk.end.every(Number.isFinite));
  }
  if(seed===179)assert.ok(result.originalStepFrames>=45,
    'Original previously walkable seed179 terrain lost every native player path');
  totalTrees+=result.distinctAcceptedTrees;
  totalSteps+=result.originalStepFrames;
  console.log('SNOW_S6_REAL_SIX_CHUNK_PLAYER_PHYSICS '+JSON.stringify({
    seed,window:result.window,distinctOwners:result.distinctOwnerReviews,
    sourceTrees:result.distinctAcceptedTrees,styles:result.styleCounts,
    realPhysicalTreeCells:result.physicalCells,
    bodyProbes:result.bodyProbes,
    preservedDirectedPortalPairs:result.protectedDirectedPortalPairs,
    actualOriginalStepPlayerFrames:result.originalStepFrames,
    originalWalkedTrees:result.originalWalkedTrees,
    clearStartCandidates:result.originalClearWalkStarts,
    perChunk:result.chunks.map(c=>[c.cx,c.cz,c.physicalCells,c.accepted]),
    saveCaveAndOriginalPhysicalSourceUnchanged:true}));
 }
 assert.ok(totalTrees>=1&&totalSteps>=45,
   'Native six-chunk source did not exercise a single real staged original tree walk');
});
