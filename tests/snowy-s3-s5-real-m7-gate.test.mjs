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
import {previewSnowS3CanonicalOwnerChunk}
  from '../src/manual-biomes/snowy-s3-owner-chunk-preview.mjs';
import {stepPlayer} from '../src/physics.mjs';
import {surveySnowS4ChunkSeams} from '../src/manual-biomes/snowy-s4-seam-evidence.mjs';
import {surveySnowS4LegacyGrassIslands}
  from '../src/manual-biomes/snowy-s4-legacy-grass-islands.mjs';
import {auditSnowS4GrassSourceAttribution}
  from '../src/manual-biomes/snowy-s4-grass-source-attribution.mjs';
import {inspectSnowS4OriginalTransitionHolds}
  from '../src/manual-biomes/snowy-s4-transition-source-check.mjs';
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
    // Original deterministic owner semantics: overlapping original 16x16
    // chunk requests must not produce two different approvals for the same
    // tree stem, regardless of which chunk was requested first.
    const ownerOpts={...deps,planScenery:planEnvironmentalScenery,
      describeScene:describeCandidateObject,collides};
    const western=previewSnowS3CanonicalOwnerChunk(world,-1,32,ownerOpts);
    const eastern=previewSnowS3CanonicalOwnerChunk(world,0,32,ownerOpts);
    assert.equal(western.safe,true,'Original owner West: '+western.reason);
    assert.equal(eastern.safe,true,'Original owner East: '+eastern.reason);
    const intersection=new Set(western.cells.map(c=>c.slice(0,3).join(',')));
    for(const cell of eastern.cells){
      assert.equal(Math.floor(cell[0]/16),0);
      assert.ok(!intersection.has(cell.slice(0,3).join(',')),
        'Duplicated physical voxel across original negative/positive chunks');
    }
    // One source-real stepPlayer test only if there is a physically admitted
    // tree with an authentic free starting position. Never synthesize a
    // cleared baseline or weaken the strict source/cave tests above.
    let playerSteps=0;
    if(body.admitted.length){
      const first=body.admitted[0],near={
        x:first.x+.5,z:first.z-2.5,feet:first.floor+1,
        yaw:0,pitch:0,vX:0,vY:0,vZ:0,onGround:true,coyote:.09,jumpBuffer:0
      };
      if(!collides(world,near.x,near.feet,near.z)){
        const stagedCells=new Map(first.cells.map(c=>[c.slice(0,3).join(','),c[3]]));
        const staged=Object.create(world);
        staged.get=(x,y,z)=>stagedCells.get(x+','+y+','+z)??world.get(x,y,z);
        if(!collides(staged,near.x,near.feet,near.z)){
          for(let i=0;i<45;i++){
            stepPlayer(staged,near,{forward:1,strafe:0,jump:false},1/60);
            assert.equal(collides(staged,near.x,near.feet,near.z),false,
              'Original stepPlayer penetrated a source-approved physical tree');
            playerSteps++;
          }
        }
      }
    }
    const seam=surveySnowS4ChunkSeams(world,
      {x:13,z:508,width:6,height:6},{biomeAt:v6BiomeAt,terrainHeight});
    assert.equal(seam.sampled,36);
    assert.equal(seam.state,'read-only-no-generator-activation');
    // Source-real original grass patch census, fenced to 36 M7 columns.
    // No removal, recolor or regeneration; respect original caves and edits.
    const grass=surveySnowS4LegacyGrassIslands(world,
      {x:13,z:508,width:6,height:6},{biomeAt:v6BiomeAt,terrainHeight});
    assert.equal(grass.sampled,36);
    assert.equal(grass.greenCells,
      grass.components.reduce((sum,component)=>sum+component.cellCount,0));
    assert.ok(grass.components.every(component=>
      component.disposition==='retain-original-until-proven-safe'));
    assert.equal(grass.originalSaveUnchanged,true);
    assert.equal(grass.sampledCaveAndPlanWitnessUnchanged,true);
    // Replay the ORIGINAL environment-v7 source preservation guard for
    // observed green cells; never infer any authorization to change terrain.
    const attribution=auditSnowS4GrassSourceAttribution(world,
      {x:13,z:508,width:6,height:6},deps);
    assert.equal(attribution.sampled,36);
    assert.equal(attribution.grassCells,grass.greenCells);
    assert.equal(attribution.summary.guardVeto+
      attribution.summary.noGuardVeto,grass.greenCells);
    assert.equal(attribution.originalSourcesUnchanged,true);
    assert.ok(attribution.rows.every(row=>
      row.disposition==='source-investigation-only-no-terrain-changes'));
    // Exact original M7 low-blend/shared-shoulder branch diagnosis, not an
    // activation of new terrain painting. Retained grass must have a source
    // guard veto OR satisfy the original legitimate low-blend early return.
    const transition=inspectSnowS4OriginalTransitionHolds(world,
      {x:13,z:508,width:6,height:6},deps);
    assert.equal(transition.sampled,36);
    assert.equal(transition.grassCells,attribution.grassCells);
    assert.equal(transition.counts.protectedOriginalSource,
      attribution.summary.guardVeto);
    assert.equal(transition.counts.unexplainedEmptyPlan,0,
      'A retained grass column lacks a reproducible original M7 empty-plan cause');
    assert.equal(transition.writerEnabled,false);
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
      seam:seam.counts,playerSteps,owner:{west:western.physicalCells,east:eastern.physicalCells}}));
  }
});
