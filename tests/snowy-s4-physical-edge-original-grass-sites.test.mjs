// Native original M7 positive grass witnesses from previously authenticated
// Snow S0 Actions #44980094211, not synthetic climate/ground fixtures.
// Reads original physical source and preserves all saved/cave cells.
import assert from 'node:assert/strict';
import test from 'node:test';
import {VoxelWorld,BLOCK,terrainHeight} from '../src/voxel.mjs';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
import {inspectSnowS4OriginalTransitionHolds}
  from '../src/manual-biomes/snowy-s4-transition-source-check.mjs';
import {previewSnowS4PhysicalEdge}
  from '../src/manual-biomes/snowy-s4-physical-edge-preview.mjs';

test('source-authenticated real retained-grass cells are physically vetoed or reviewed, never repainted',()=>{
  // Both coordinate witnesses were present in BOTH seed source summaries.
  const sites=[{x:-104,z:360,old:9},{x:-88,z:536,old:7}];
  for(const seed of [179,2026]){
    const world=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
    const deps={biomeAt:v6BiomeAt,terrainHeight,
      legacyNatural:(x,y,z)=>VoxelWorld.prototype.naturalAndLandmarkBlock.call(world,x,y,z)};
    const originalSave=JSON.stringify(world.save());
    for(const site of sites){
      assert.equal(terrainHeight(site.x,site.z,seed),site.old);
      assert.equal(v6BiomeAt(site.x,site.z,seed).name,'snow');
      assert.equal(world.get(site.x,site.old,site.z),BLOCK.GRASS,
        'Authentic prior retained-grass witness no longer matches M7');
      const rectangle={x:site.x-2,z:site.z-2,width:5,height:5};
      const classification=inspectSnowS4OriginalTransitionHolds(world,rectangle,deps);
      const observed=classification.cells.find(r=>r.x===site.x&&r.z===site.z);
      assert.ok(observed,'Original retained grass missing from diagnostic');
      assert.ok(['original-physical-source-veto','original-low-blend-without-shoulder',
        'unexplained-empty-M7-source-column'].includes(observed.diagnosis));
      const preview=previewSnowS4PhysicalEdge(world,classification,deps);
      assert.equal(preview.originalSourceUnchanged,true);
      assert.equal(preview.examined,classification.grassCells);
      assert.equal(preview.proposed.length+preview.rejected.length,preview.examined);
      assert.equal(preview.writerEnabled,false);
      assert.ok(preview.proposed.every(p=>p.authorizingTerrainWrites===false));
      assert.equal(JSON.stringify(world.save()),originalSave);
      assert.equal(world.get(site.x,site.old,site.z),BLOCK.GRASS);
      console.log('SNOW_S4_REAL_GRASS_WITNESS',JSON.stringify({
        seed,site,observedDiagnosis:observed.diagnosis,
        observedGuard:observed.guardCategory,
        sampled:classification.sampled,retainedGrass:classification.grassCells,
        sourceReasons:classification.counts,proposed:preview.proposed.length,
        rejected:preview.rejected.length,
        atTarget:preview.proposed.some(p=>p.x===site.x&&p.z===site.z)?
          'research-only-future-profile-review':'strictly-rejected',
        untouched:true}));
    }
  }
});
