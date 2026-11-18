import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,VoxelWorld,worldKey} from '../src/voxel.mjs';
import {auditCaveSourceCells} from '../src/manual-caves/source-composition.mjs';
import {VAULT_LEVELS,VAULT_JUNCTION} from '../src/deep-vault-galleries.mjs';
import {planDeepVaultConnections,auditBridgePlayerClearance} from '../src/manual-caves/deep-vault-bridges.mjs';

test('vault bridge fail-closed without actual immutable source geometry',()=>{
 assert.equal(planDeepVaultConnections().ok,false);
 assert.equal(planDeepVaultConnections({sourceCells:new Map(),seed:2**35}).ok,false);
});
for(const seed of [179,1,2026,-77]){
 test('four true spiral-to-vault walking connections across real cave source seed '+seed,()=>{
  const old=new VoxelWorld(seed),before=JSON.stringify(old.save());
  const originals=auditCaveSourceCells(seed);
  assert.equal(originals.ok,true,JSON.stringify(originals.reasons));
  const plan=planDeepVaultConnections({sourceCells:originals.cells,seed});
  assert.equal(plan.ok,true,JSON.stringify(plan.failures));
  assert.deepEqual(plan.bridges.map(b=>b.floor),VAULT_LEVELS);
  assert.equal(plan.sourceConnected,true);
  assert.equal(plan.runtimeEnabled,false);
  assert.ok(plan.cells.size>100,'bridges must add real authored AIR/stone cells');
  const world={seed,edits:old.edits,get(x,y,z){
   const k=worldKey(x,y,z);
   return old.edits.get(k)??plan.cells.get(k)??originals.cells.get(k)??old.get(x,y,z);
  }};
  for(const b of plan.bridges){
   assert.ok(b.route.length>=2,'Not a real connection from spiral to vault');
   assert.equal(b.route.at(-1).x,VAULT_JUNCTION.x);
   assert.equal(b.route.at(-1).z,VAULT_JUNCTION.z);
   for(const p of b.route){
    assert.equal(world.get(p.x,p.floor,p.z),BLOCK.DEEPSTONE);
    for(let h=1;h<=4;h++)assert.equal(world.get(p.x,p.floor+h,p.z),BLOCK.AIR);
   }
  }
  const physical=auditBridgePlayerClearance(world,plan);
  assert.equal(physical.ok,true,JSON.stringify(physical.problems));
  assert.ok(physical.sampleCount>10);
  assert.equal(JSON.stringify(old.save()),before,'source connection mutated prior world');
 });
}
