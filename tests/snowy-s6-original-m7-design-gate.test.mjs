// Source-real M7 S6 design PREVIEW, never registration or gameplay activation.
// Run only in the complete original repository: all dependencies are authentic.
import assert from 'node:assert/strict';
import test from 'node:test';
import {VoxelWorld,BLOCK,terrainHeight,collides} from '../src/voxel.mjs';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR,
  restoreFourRegionWorld} from '../src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
import {proposedSnowTree}
  from '../src/manual-biomes/snowy-s3-tree-prototypes.mjs';
import {planEnvironmentalScenery} from '../src/nonblock/staged-habitats.mjs';
import {describeCandidateObject} from '../src/nonblock/candidate-scene.mjs';
import {previewSnowS6FreshWorldTile}
  from '../src/manual-biomes/snowy-s6-fresh-world-design-preview.mjs';
import {SNOW_S6_CANDIDATE_PROFILE}
  from '../src/manual-biomes/snowy-s6-winter-tone-proposal.mjs';

test('real seed179/2026 S6 draft adds no old-profile registration and no world edits',()=>{
  assert.throws(()=>fourRegionProfile(179,SNOW_S6_CANDIDATE_PROFILE),
    /Unknown biome generator/);
  for(const seed of [179,2026]){
    const profile=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR);
    const world=new FourRegionWorld(seed,profile);
    const save=JSON.stringify(world.save());
    const deps={biomeAt:v6BiomeAt,terrainHeight,
      legacyNatural:(x,y,z)=>
        VoxelWorld.prototype.naturalAndLandmarkBlock.call(world,x,y,z),
      proposedSnowTree,planScenery:planEnvironmentalScenery,
      describeScene:describeCandidateObject,collides};
    const request={profileProposal:SNOW_S6_CANDIDATE_PROFILE,
      intent:'fresh-new-world-research-only',allowM7SaveMigration:false};
    const summary=[];
    for(const rectangle of [
      {x:-16,z:512,width:8,height:8},
      {x:-104,z:360,width:8,height:8}
    ]){
      const a=previewSnowS6FreshWorldTile(world,rectangle,deps,request);
      assert.equal(a.proposedProfile,SNOW_S6_CANDIDATE_PROFILE);
      assert.equal(a.profileRegistered,false);
      assert.equal(a.saveMigrationAllowed,false);
      assert.equal(a.writerEnabled,false);
      assert.equal(a.originalWorldUnchanged,true);
      assert.equal(a.multiOwnerWholeWorldPathAccepted,false);
      assert.equal(a.sourceChunk[0],Math.floor(rectangle.x/16));
      assert.equal(a.sourceChunk[1],Math.floor(rectangle.z/16));
      assert.ok(a.palette.length<=64);
      assert.ok(a.sourceOwnerReviews<=9);
      assert.ok(a.physicalTrees.length<=640);
      assert.ok(a.possibleStyles.length===4);
      assert.ok(Object.isFrozen(a.palette)&&Object.isFrozen(a.physicalTrees));
      for(const p of a.palette){
        assert.ok([272,276,279].includes(p.sourceCapId));
        const column=world._columnPlan(p.x,p.z);
        const top=Math.max(...column.keys());
        assert.equal(world.get(p.x,top,p.z),p.sourceCapId);
        assert.equal(world.edits.has(p.x+','+top+','+p.z),false);
        assert.ok(p.proposedLinearRgb.every(n=>n>0&&n<1));
      }
      for(const [x,y,z,id] of a.physicalTrees){
        assert.ok([4,406,407].includes(id));
        assert.equal(world.get(x,y,z),BLOCK.AIR);
        assert.equal(world.environmentCaves.get(x,y,z),undefined);
        assert.equal(world.edits.has(x+','+y+','+z),false);
      }
      assert.ok(a.edgeReferrals.every(p=>p.authorizingTerrainWrites===false));
      assert.equal(JSON.stringify(world.save()),save);
      summary.push({rectangle,originalSnowPalette:a.palette.length,
        originalProtectedGrass:a.sourceProtectedGrass,
        oldLowBlendGrass:a.sourceEdgeGrass,
        guardedEdgeReferrals:a.edgeReferrals.length,
        approvedPhysicalConiferCells:a.physicalTrees.length,
        originalOwnerReviews:a.sourceOwnerReviews});
    }
    assert.equal(world.get(-104,terrainHeight(-104,360,seed),360),BLOCK.GRASS);
    assert.equal(world.edits.size,0);
    assert.deepEqual(restoreFourRegionWorld(world.save(),profile).save(),world.save());
    console.log('SNOW_S6_REAL_M7_DRY_RUN',JSON.stringify({seed,summary}));
  }
});
