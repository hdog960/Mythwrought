import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,worldKey,collides,meshChunk} from '../src/voxel.mjs';
import {Pack2LiveWorld} from '../src/pack2-world.mjs';
import {sectionForY} from '../src/depth.mjs';
import {meshDepthSection} from '../src/depth-mesh.mjs';
import {CAVE_PROFILE_KIND} from '../src/manual-caves/cave-voxel-world.mjs';
import {createStagedCaveRuntime,restoreStagedCaveRuntime} from '../src/manual-caves/opt-in-runtime.mjs';
import {descentRoute} from '../src/underground-switchback-descent.mjs';

test('opt-in cave runtime refuses implicit activation or a legacy restore',()=>{
  assert.throws(()=>createStagedCaveRuntime(179,null),/EXPLICIT_NEW_WORLD_SELECTION_REQUIRED/);
  assert.throws(()=>restoreStagedCaveRuntime(new VoxelWorld(179).save(),{approved:true}),
    /explicit matching new-world marker/);
});
for(const seed of [179,1,2026,-77]){
  test('real Pack2/voxel cave entry runtime, deep mesh and schema-1 save seed '+seed,()=>{
    const old=new VoxelWorld(seed),oldSave=JSON.stringify(old.save());
    const runtime=createStagedCaveRuntime(seed,null,{approved:true});
    const world=runtime.world;
    assert.ok(world instanceof Pack2LiveWorld,'use real game-facing Pack2 world wrapper');
    assert.equal(runtime.registeredInHomeScreen,false);
    assert.equal(world.base.cavePlanReport.entrancesConnected,true);
    assert.equal(world.base.cavePlanReport.vaultBridgeConnected,true);
    assert.ok(world.base.cavePlanReport.vaultBridgeCells>100);
    assert.equal(world.base.cavePlanReport.vaultBridgeSteps.length,4);
    assert.equal(runtime.entrancePlan.entrances.length,4);
    for(const entry of runtime.entrancePlan.entrances){
      for(const p of entry.route){
        assert.notEqual(world.get(p.x,p.floor,p.z),BLOCK.AIR,'entry stone missing');
        for(let h=1;h<=4;h++)
          assert.equal(world.get(p.x,p.floor+h,p.z),BLOCK.AIR,'entry blocked: '+entry.name);
        assert.equal(collides(world,p.x+.5,p.feet,p.z+.5),false,
          'real game wrapper player body cannot enter '+entry.name);
      }
    }
    const mouth=runtime.entrancePlan.entrances[0].mouth;
    const surface=meshChunk(world,Math.floor(mouth.x/16),Math.floor(mouth.z/16));
    assert.ok(surface.length>0&&surface.every(Number.isFinite),
      'production surface mesher must recognize physical new-cave entrance');
    const deep=descentRoute().find(p=>p.floor===-80);
    assert.ok(deep);
    const verts=meshDepthSection(world,Math.floor(deep.x/16),Math.floor(deep.z/16),
      sectionForY(deep.floor));
    assert.ok(verts.length>0&&verts.every(Number.isFinite),
      'production deep mesher must recognize authored cave at depth');
    // This is a player-created block, equal to the OLD natural rock.
    // It must persist inside the new source-authored AIR and remain mineable.
    assert.equal(world.set(deep.x,deep.feet,deep.z,BLOCK.DEEPSTONE),true);
    assert.equal(world.get(deep.x,deep.feet,deep.z),BLOCK.DEEPSTONE);
    const raw=world.save();assert.equal(raw.schema,1);
    const restored=restoreStagedCaveRuntime(raw,{approved:true,profile:CAVE_PROFILE_KIND});
    assert.equal(restored.world.get(deep.x,deep.feet,deep.z),BLOCK.DEEPSTONE);
    assert.equal(restored.world.set(deep.x,deep.feet,deep.z,BLOCK.AIR),true);
    assert.equal(restored.world.get(deep.x,deep.feet,deep.z),BLOCK.AIR);
    assert.equal(restored.world.base.edits.has(worldKey(deep.x,deep.feet,deep.z)),false);
    assert.equal(JSON.stringify(old.save()),oldSave,'old-world save changed');
    assert.equal(restored.registeredInHomeScreen,false);
  });
}
