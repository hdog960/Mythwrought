// Exact original M7 cross-owner source, original voxel.collides, source
// nonblock scene and save readers; NO mock physics or fake trees.
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
import {auditSnowS6CrossOwnerForest}
  from '../src/manual-biomes/snowy-s6-cross-owner-forest-audit.mjs';

test('original seeds 179/2026: exact neighbor-owner conifer style, body and cave parity',()=>{
  for(const seed of [179,2026]){
    const world=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
    const save=JSON.stringify(world.save());
    const deps={biomeAt:v6BiomeAt,terrainHeight,proposedSnowTree,
      legacyNatural:(x,y,z)=>
        VoxelWorld.prototype.naturalAndLandmarkBlock.call(world,x,y,z),
      planScenery:planEnvironmentalScenery,describeScene:describeCandidateObject,
      collides};
    const p=auditSnowS6CrossOwnerForest(world,-1,32,deps);
    assert.equal(p.safe,true,'Original aggregate cross-owner rejection: '+p.reason);
    assert.equal(p.chunks.length,4);
    assert.equal(p.readOnly,true);
    assert.equal(p.notLiveM7,true);
    assert.equal(p.noWholeWorldApproval,true);
    assert.equal(p.writerEnabled,false);
    assert.equal(p.distinctAcceptedTrees,p.trees.length);
    assert.equal(Object.values(p.styleCounts).reduce((sum,n)=>sum+n,0),
      p.distinctAcceptedTrees);
    assert.ok(p.physicalCells<=4*640);
    assert.ok(p.distinctOwnerReviews<=24);
    assert.ok(p.bodyProbes<=p.distinctAcceptedTrees*6000);
    for(const tree of p.trees){
      assert.ok(['compact-fir','layered-spruce','highland-pine',
        'windswept-alpine'].includes(tree.style));
      assert.ok(tree.physicalCells>=16&&tree.physicalCells<=119);
      assert.equal(tree.owner,Math.floor(tree.x/16)+','+Math.floor(tree.z/16));
    }
    // Reordering consumer chunk loading must not alter the full original
    // tree owner, voxel union, style or player body connectivity.
    const reverse=auditSnowS6CrossOwnerForest(world,-1,32,deps,{reverse:true});
    assert.equal(reverse.safe,true,reverse.reason);
    assert.deepEqual(reverse,p);
    assert.equal(JSON.stringify(world.save()),save);
    assert.deepEqual(restoreFourRegionWorld(world.save(),
      fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR)).save(),world.save());
    console.log('SNOW_S6_REAL_CROSS_OWNER',JSON.stringify({
      seed,ownerReviews:p.distinctOwnerReviews,
      distinctTrees:p.distinctAcceptedTrees,styles:p.styleCounts,
      physicalCells:p.physicalCells,bodyProbes:p.bodyProbes,
      protectedDirectedPortalPairs:p.protectedDirectedPortalPairs,
      perChunk:p.chunks.map(c=>[c.cx,c.cz,c.physicalCells,c.accepted]),
      sourceAndSaveUntouched:true}));
  }
});
