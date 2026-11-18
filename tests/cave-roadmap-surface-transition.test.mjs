import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,worldKey,collides} from '../src/voxel.mjs';
import {planSpiralSurfaceTransition,inspectSpiralSurfaceTransition}
  from '../src/manual-caves/surface-transition.mjs';
import {createStagedCaveRuntime} from '../src/manual-caves/opt-in-runtime.mjs';
import {deepCaveRoute} from '../src/deep-cave-network.mjs';
test('surface collar refuses implicit activation or arbitrary sources',()=>{
 assert.equal(planSpiralSurfaceTransition().ok,false);
 assert.equal(planSpiralSurfaceTransition({seed:179,approved:true}).ok,false);
});
for(const seed of [179,1,2026,-77]){
 test('actual -3 legacy protected transition into real deep spiral seed '+seed,()=>{
  const base=new VoxelWorld(seed),before=JSON.stringify(base.save());
  const staged=createStagedCaveRuntime(seed,null,{approved:true}),world=staged.world;
  assert.ok(world.base.cavePlanReport.surfaceTransitionConnected,
    'Must materialize original shallow-headroom connection in NEW cave profile');
  assert.ok(world.base.cavePlanReport.surfaceTransitionCells>12);
  const plan=planSpiralSurfaceTransition({seed,baseWorld:base,
    portals:staged.entrancePlan.cells,
    forbiddenCells:world.base.caveEastCells,approved:true});
  assert.equal(plan.ok,true,JSON.stringify(plan.conflicts??plan.reason));
  const inspection=inspectSpiralSurfaceTransition(world,plan);
  assert.equal(inspection.ok,true,JSON.stringify(inspection.bad));
  const route=deepCaveRoute();
  const start=route.filter(p=>p.floor+4>=-3);
  assert.equal(start.length,plan.sourceSteps);
  for(const p of start){
   for(let h=1;h<=4;h++)
    assert.equal(world.get(p.x,p.floor+h,p.z),BLOCK.AIR,
      'Uncarved original seam route at '+JSON.stringify(p));
   assert.ok(!collides(world,p.x+.5,p.feet,p.z+.5));
  }
  assert.equal(JSON.stringify(base.save()),before,'original world save mutated by source collar');
  assert.equal(staged.registeredInHomeScreen,false);
 });
}
test('explicit legacy player edit forbids the new-world collar from overwriting its value',()=>{
 const seed=179,base=new VoxelWorld(seed);
 const staged=createStagedCaveRuntime(seed,null,{approved:true});
 const first=deepCaveRoute()[0];
 base.set(first.x,first.floor+1,first.z,BLOCK.WOOD);
 assert.ok(base.edits.has(worldKey(first.x,first.floor+1,first.z)));
 const blocked=planSpiralSurfaceTransition({seed,baseWorld:base,
  portals:staged.entrancePlan.cells,forbiddenCells:staged.world.base.caveEastCells,
  approved:true});
 assert.equal(blocked.ok,false);
 assert.ok(blocked.conflicts?.some(x=>x.reason==='SAVED_PLAYER_EDIT'));
 assert.equal(base.get(first.x,first.floor+1,first.z),BLOCK.WOOD);
});
