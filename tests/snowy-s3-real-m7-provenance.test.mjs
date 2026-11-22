// MILESTONE GATE ONLY. Requires the full unmodified MYTHWROUGHT checkout.
// Not part of live game or existing CI and not a replacement for Chromium,
// save/load, genuine collision and iPhone acceptance. Run explicitly when
// detached S3 candidate provenance is ready for source-level acceptance.
import assert from 'node:assert/strict';
import test from 'node:test';
import {VoxelWorld,BLOCK,terrainHeight} from '../src/voxel.mjs';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR,
  restoreFourRegionWorld} from '../src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
import {proposedSnowTree} from '../src/manual-biomes/snowy-s3-tree-prototypes.mjs';
import {reviewSnowS3WorldChunk} from '../src/manual-biomes/snowy-s3-world-review.mjs';

const sourceDeps=(world)=>({
  biomeAt:v6BiomeAt,terrainHeight,proposedSnowTree,
  legacyNatural:(x,y,z)=>VoxelWorld.prototype.naturalAndLandmarkBlock.call(world,x,y,z)
});
const sourceSurvey=(world)=>{
  const proposals=new Map(),checks=new Map(),deps=sourceDeps(world);
  // 48 real chunks spanning the familiar southern snow interior, plus
  // overlaps to prove chunk-order-independent preview candidates.
  for(let cx=-3;cx<=2;cx++)for(let cz=28;cz<=35;cz++){
    const row=reviewSnowS3WorldChunk(world,cx,cz,deps);
    assert.ok(row.checked<=24,'Excessive per-chunk tree source cost');
    checks.set(cx+','+cz,row.checked);
    for(const p of row.proposals){
      if(proposals.has(p.key))
        assert.deepEqual(p,proposals.get(p.key),'Chunk seam changed a physical S3 site');
      proposals.set(p.key,p);
    }
  }
  return {proposals,checks};
};
test('real M7 seeds 179/2026: physical S3 remains detached, source-authentic and save-inert',()=>{
  for(const seed of [179,2026]){
    const profile=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR);
    const world=new FourRegionWorld(seed,profile);
    const old=new VoxelWorld(seed);
    const snapshot=JSON.stringify(world.save());
    const a=sourceSurvey(world),b=sourceSurvey(world);
    assert.deepEqual([...a.proposals],[...b.proposals],
      'Original M7 source reader changed on repeat');
    assert.ok(a.proposals.size>0,
      'All S3 sites rejected: real snow tree diversification needs more development');
    for(const p of a.proposals.values()){
      assert.ok(['compact-fir','layered-spruce','highland-pine','windswept-alpine'].includes(p.style));
      assert.ok(p.voxelCount>15&&p.voxelCount<=119);
      // No physical player edit exists after planning. Proposals must not
      // erase genuine old source cave/landmark/grove cells.
      const tree=proposedSnowTree(p.style,p.x,p.floor,p.z,{wind:p.wind});
      assert.equal(tree.cells.length,p.voxelCount);
      for(const [x,y,z] of tree.cells){
        assert.equal(world.get(x,y,z),BLOCK.AIR);
        assert.equal(world.environmentCaves.get(x,y,z),undefined);
        assert.equal(VoxelWorld.prototype.naturalAndLandmarkBlock.call(world,x,y,z),BLOCK.AIR);
        assert.equal(world.edits.has(x+','+y+','+z),false);
      }
    }
    assert.equal(JSON.stringify(world.save()),snapshot,'Read-only planning wrote schema-1 edits');
    assert.deepEqual(restoreFourRegionWorld(world.save(),profile).save(),world.save());
    // Protected old-source witness: will be kept until separate versioned
    // generator and cave/source-owner acceptance, never hidden by planner.
    const witness=seed===179?[-104,15,456]:[-104,10,360];
    assert.equal(world.get(...witness),old.get(...witness));
  }
});
