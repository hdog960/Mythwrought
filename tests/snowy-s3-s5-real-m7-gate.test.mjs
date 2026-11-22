// GENUINE ORIGINAL GAME acceptance gate. NOT RUN in the partial local checkout.
// Execute ONLY from the complete source checkout with the real cave/runtime,
// source save reader, biome profiler and nonblock scene host installed.
import assert from 'node:assert/strict';
import test from 'node:test';
import {VoxelWorld,terrainHeight,collides} from '../src/voxel.mjs';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR,
  restoreFourRegionWorld} from '../src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
import {proposedSnowTree} from '../src/manual-biomes/snowy-s3-tree-prototypes.mjs';
import {reviewSnowS3WorldChunk} from '../src/manual-biomes/snowy-s3-world-review.mjs';
import {auditSnowS3Walkway} from '../src/manual-biomes/snowy-s3-walkway-audit.mjs';
import {planEnvironmentalScenery} from '../src/nonblock/staged-habitats.mjs';
import {describeCandidateObject} from '../src/nonblock/candidate-scene.mjs';
import {reviewSnowS3SafeChunk} from '../src/manual-biomes/snowy-s3-integrated-admission.mjs';
import {reviewSnowS3PlayerApprovedChunk}
  from '../src/manual-biomes/snowy-s3-player-approved-chunk.mjs';
import {surveySnowS4ChunkSeams} from '../src/manual-biomes/snowy-s4-seam-evidence.mjs';
import {reviewSnowS5Scenery} from '../src/manual-biomes/snowy-s5-existing-scenery-audit.mjs';

// One focused source-backed smoke test, not a duplicate full WebGL2 run.
test('real M7 two-seed S3 walking and S5 scenery read-only provenance',()=>{
  for(const seed of [179,2026]){
    const profile=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR);
    const world=new FourRegionWorld(seed,profile),before=JSON.stringify(world.save());
    const deps={biomeAt:v6BiomeAt,terrainHeight,proposedSnowTree,
      legacyNatural:(x,y,z)=>VoxelWorld.prototype.naturalAndLandmarkBlock.call(world,x,y,z)};
    let audited=0;
    // Eight neighboring original chunks per seed, overlapping candidate
    // sites that share actual underlying M7 cave and saved-world readers.
    for(let cx=-2;cx<=1;cx++)for(let cz=31;cz<=32;cz++){
      const survey=reviewSnowS3WorldChunk(world,cx,cz,deps);
      assert.ok(survey.checked<=24);
      for(const p of survey.proposals){
        const result=auditSnowS3Walkway(world,p);
        assert.equal(result.kind,'detached-s3-original-voxel-walking-proxy');
        // Rejection is legitimate when a real cave, edit or walking corridor
        // would be impacted; do not erase such protection to meet quotas.
        if(result.safe)assert.equal(result.originalM7Unchanged,true);
        audited++;
      }
    }
    // One bounded, complete original-game integrated S3/S5 preview per seed.
    // Reuse the already constructed world and the exact original non-block
    // scene host (not a synthetic scene descriptor or duplicate browser run).
    const integrated=reviewSnowS3SafeChunk(world,0,32,{
      ...deps,planScenery:planEnvironmentalScenery,
      describeScene:describeCandidateObject
    });
    assert.equal(integrated.safe,true,
      'Original-world S3/S5 admission needs source repair: '+integrated.reason);
    assert.equal(integrated.sourceWorldUnchanged,true);
    // Actual original voxel.collides + BODY_RADIUS/BODY_HEIGHT against the
    // already checked source world; this is a STRICT extra headroom gate,
    // not a stand-in for original stepPlayer or Home Screen acceptance.
    const body=reviewSnowS3PlayerApprovedChunk(world,0,32,{
      ...deps,planScenery:planEnvironmentalScenery,
      describeScene:describeCandidateObject,collides
    });
    assert.equal(body.safe,true,
      'Original source-body collision gate failed: '+body.reason);
    assert.equal(body.sourceAdmitted,integrated.admitted.length);
    assert.equal(body.sourceWorldUnchanged,true);
    assert.ok(body.admitted.length<=integrated.admitted.length);
    const seam=surveySnowS4ChunkSeams(world,
      {x:13,z:508,width:6,height:6},{biomeAt:v6BiomeAt,terrainHeight});
    assert.equal(seam.sampled,36);
    assert.equal(seam.state,'read-only-no-generator-activation');
    const scenery=reviewSnowS5Scenery(world,0,32,{
      planScenery:planEnvironmentalScenery,biomeAt:v6BiomeAt
    });
    assert.equal(scenery.state,'read-only-reuse-existing-families-no-automation-edits');
    assert.ok(scenery.summary.all<=48);
    assert.ok(scenery.summary.sourceWinter<=scenery.summary.all);
    assert.equal(JSON.stringify(world.save()),before,
      'S3 walking or original S5 non-block planning changed schema-1 deltas');
    const restore=restoreFourRegionWorld(world.save(),profile);
    assert.deepEqual(restore.save(),world.save());
    console.log('SNOWY_S3_S5_REAL_M7',JSON.stringify({seed,walkingAudited:audited,
      scenery:scenery.summary,
      admission:{checked:integrated.checked,sourceCandidates:integrated.sourceCandidates,
        admitted:integrated.admitted.length,rejected:integrated.rejected},
      body:{sourceAdmitted:body.sourceAdmitted,playerBodyApproved:body.admitted.length,
        collisionProbes:body.collisionProbes,protectedPortalPairs:body.preservedPortalConnections},
      seam:seam.counts}));
  }
});
