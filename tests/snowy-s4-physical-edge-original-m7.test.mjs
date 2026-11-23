// Genuine full original-M7 checkout acceptance — no synthetic ground here.
// This checks only detached S4 source review; no active generator or save change.
import assert from 'node:assert/strict';
import test from 'node:test';
import {VoxelWorld,terrainHeight,BLOCK} from '../src/voxel.mjs';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR,
  restoreFourRegionWorld} from '../src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
import {inspectSnowS4OriginalTransitionHolds}
  from '../src/manual-biomes/snowy-s4-transition-source-check.mjs';
import {previewSnowS4PhysicalEdge}
  from '../src/manual-biomes/snowy-s4-physical-edge-preview.mjs';

test('real M7 two-seed snow edge survey preserves caves, edits and saved source',()=>{
  for(const seed of [179,2026]){
    const profile=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR);
    const world=new FourRegionWorld(seed,profile);
    const deps={biomeAt:v6BiomeAt,terrainHeight,
      legacyNatural:(x,y,z)=>VoxelWorld.prototype.naturalAndLandmarkBlock.call(world,x,y,z)};
    const before=JSON.stringify(world.save()),totals=[];
    // Original S4 narrow snow sample plus one adjacent 16-cell chunk boundary.
    for(const rectangle of [
      {x:13,z:508,width:6,height:6},
      {x:-18,z:508,width:6,height:6}
    ]){
      const classification=inspectSnowS4OriginalTransitionHolds(world,rectangle,deps);
      const result=previewSnowS4PhysicalEdge(world,classification,deps);
      assert.equal(result.kind,'detached-S4-physical-snow-edge-source-preview');
      assert.equal(result.originalSourceUnchanged,true);
      assert.equal(result.writerEnabled,false);
      assert.equal(result.notCurrentM7,true);
      assert.equal(result.examined,classification.grassCells);
      assert.equal(result.examined,result.proposed.length+result.rejected.length);
      assert.ok(result.sourceFootprintColumns<=result.examined*5);
      assert.equal(JSON.stringify(world.save()),before);
      for(const candidate of result.proposed){
        assert.equal(candidate.authorizingTerrainWrites,false);
        assert.equal(candidate.futureProfileReviewOnly,true);
        assert.equal(candidate.surroundingAuthoredSnow,4);
        assert.equal(world.get(candidate.x,candidate.oldTop,candidate.z),BLOCK.GRASS);
        assert.equal(world.edits.has(candidate.x+','+candidate.oldTop+','+candidate.z),false);
        assert.equal(world.environmentCaves.get(candidate.x,candidate.oldTop,candidate.z),undefined);
      }
      totals.push({rectangle,grass:classification.grassCells,
        causes:classification.counts,physicalReviewSites:result.proposed.length,
        physicalRejections:result.rejected.length});
    }
    assert.deepEqual(restoreFourRegionWorld(world.save(),profile).save(),world.save());
    console.log('SNOW_S4_ORIGINAL_M7_PHYSICAL_EDGE',JSON.stringify({seed,totals}));
  }
});
