import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,worldKey,VoxelWorld,collides} from '../src/voxel.mjs';
import {WORLD_MIN_Y,LEGACY_WORLD_MIN_Y} from '../src/depth.mjs';
import {descentRoute,descentCells} from '../src/underground-switchback-descent.mjs';
import {deepCaveCells} from '../src/deep-cave-network.mjs';
import {deepVaultCells} from '../src/deep-vault-galleries.mjs';
import {CAVE_PROFILE_KIND,CaveVoxelWorld,checkNewCaveWorldAdmission} from '../src/manual-caves/cave-voxel-world.mjs';
import {auditCaveSourceCells,CAVE_SOURCE_CELL_LIMIT} from '../src/manual-caves/source-composition.mjs';

const storage=(records={})=>({
  getItem:k=>Object.prototype.hasOwnProperty.call(records,k)?records[k]:null,
  key:i=>Object.keys(records)[i]??null,
  get length(){return Object.keys(records).length}
});
test('new caves require explicit opt-in and reject existing schema-1/save backups',()=>{
  assert.equal(checkNewCaveWorldAdmission(storage(),179).reason,'EXPLICIT_NEW_WORLD_SELECTION_REQUIRED');
  assert.equal(checkNewCaveWorldAdmission(storage({'mythwrought.world.seed.179':'old'}),179,{approved:true}).ok,false);
  assert.throws(()=>new CaveVoxelWorld(179),/EXPLICIT_NEW_WORLD_SELECTION_REQUIRED/);
  assert.equal(CAVE_PROFILE_KIND,'mythwrought-new-caves-v1');
  assert.equal(checkNewCaveWorldAdmission(storage(),179,{approved:true}).ok,true);
});
test('source exports use detached snapshots, not mutation of canonical cached geometry',()=>{
  const deep=deepCaveCells(),first=deep.keys().next().value;
  assert.ok(deep.size>1000);
  deep.clear();
  assert.ok(deepCaveCells().has(first));
  const vault=deepVaultCells(179),k=vault.keys().next().value;
  assert.ok(vault.size>1000);
  vault.clear();assert.ok(deepVaultCells(179).has(k));
});
for(const seed of [179,1,2026,-77]){
  test('C3/C4 source-exact cave audit and preservation seed '+seed,()=>{
    const audit=auditCaveSourceCells(seed);
    assert.equal(audit.worldRange.minY,WORLD_MIN_Y);
    assert.ok(audit.cells.size>1000);
    assert.ok(audit.cells.size<=CAVE_SOURCE_CELL_LIMIT);
    assert.equal(audit.sourceCount,5,'all distinct source cave networks required');
    assert.ok(audit.sourceReports.every(r=>r.cells>1000&&r.air>0));
    assert.equal(audit.ok,true,JSON.stringify({reasons:audit.reasons,conflicts:audit.conflicts}));
    assert.equal(audit.entranceConnected,false,'do not claim old floor opened');
    for(const k of audit.cells.keys()){
      const [,y]=k.split(',').map(Number);
      assert.ok(y<WORLD_MIN_Y?false:y<LEGACY_WORLD_MIN_Y,'legacy surface touched '+k);
    }
    const old=new VoxelWorld(seed),raw=JSON.stringify(old.save());
    const world=new CaveVoxelWorld(seed,{approved:true});
    const point=descentRoute().find(p=>p.floor===-80);
    assert.ok(point);
    assert.equal(world.get(point.x,point.feet,point.z),BLOCK.AIR,'real :36 authored descent headroom');
    assert.equal(world.get(point.x,point.floor,point.z),BLOCK.DEEPSTONE,'real :36 stone support');
    assert.equal(collides(world,point.x+.5,point.feet,point.z+.5),false,'real gameplay body fits');
    assert.equal(world.set(point.x,point.feet,point.z,BLOCK.STONE),true);
    assert.equal(world.get(point.x,point.feet,point.z),BLOCK.STONE,'player block overrides cavern air');
    const recorded=world.save();
    assert.equal(recorded.schema,1);
    assert.equal(JSON.stringify(old.save()),raw,'opt-in cave modifies no legacy world');
    const restored=CaveVoxelWorld.restore(recorded,{approved:true});
    assert.equal(restored.get(point.x,point.feet,point.z),BLOCK.STONE,'saved player edit loads in cave mode');
    assert.equal(restored.set(point.x,point.feet,point.z,BLOCK.AIR),true);
    assert.equal(restored.get(point.x,point.feet,point.z),BLOCK.AIR,'removing placed stone restores source cavern');
    assert.equal(restored.edits.has(worldKey(point.x,point.feet,point.z)),false,
      'edit removal returns to cave baseline, not old natural rock');
    assert.equal(restored.get(0,-3,0),old.get(0,-3,0),'legacy floor unchanged');
    assert.equal(restored.cavePlanReport.entrancesConnected,false);
  });
}
