import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK} from '../../../../src/voxel.mjs';
import {makeOrientationSidecar,restoreOrientationSidecar}
 from '../../../../src/voxel-orientation-sidecar.mjs';
import {PACK4_BUILDER_CATALOG} from '../../../../src/block-packs/pack-4/builder-handoff.mjs';
import {createPack4Fixture,pack4MountOffset}
 from '../../../../src/block-packs/pack-4/fixture.mjs';
import {pack4FixtureToSidecarSnapshot,pack4SidecarToFixtureSnapshot}
 from '../../../../src/block-packs/pack-4/interaction-handoff.mjs';

// Exact-main source is loaded by Pack4's disposable CI overlay. No persistent
// world, file, localStorage, legacy schema or production registry is mutated.
test('legacy schema-1 world bytes survive isolated 23-candidate fixture and sidecar recovery',()=>{
 const legacy=new VoxelWorld(179);
 assert.equal(legacy.set(2,14,3,BLOCK.STONE),true);
 assert.equal(legacy.set(-4,14,-3,BLOCK.WOOD),true);
 const saved=JSON.stringify(legacy.save());
 const restoredLegacy=VoxelWorld.restore(JSON.parse(saved));
 assert.equal(JSON.stringify(restoredLegacy.save()),saved);
 const rows=PACK4_BUILDER_CATALOG.map((x,i)=>({
  id:x.id,rotation:i%4,cell:[2000+i*3,14,1000]
 }));
 const supports=rows.map(p=>{
  const offset=pack4MountOffset(p.id,p.rotation);
  return offset?p.cell.map((v,i)=>v+offset[i]):null;
 }).filter(Boolean);
 const fixture=createPack4Fixture(supports);
 for(const p of rows)
  assert.equal(fixture.place(p.cell,p.id,p.rotation).ok,true,'fixture '+p.id);
 const staged=pack4FixtureToSidecarSnapshot(fixture.save());
 const read=(x,y,z)=>fixture.get([x,y,z])?.id??0;
 const independent=makeOrientationSidecar(staged);
 const serialized=JSON.parse(JSON.stringify(independent.snapshot(read)));
 const recovered=restoreOrientationSidecar(serialized,read);
 assert.equal(recovered.size(),23);
 const recoveredFixture=createPack4Fixture(supports);
 assert.equal(recoveredFixture.restore(pack4SidecarToFixtureSnapshot(serialized)),23);
 assert.deepEqual(recoveredFixture.save(),fixture.save());
 for(const p of rows)assert.equal(recovered.get(p.cell,p.id),p.rotation);
 // An isolated candidate fixture does not add a new key or ID to schema-1.
 assert.equal(JSON.stringify(legacy.save()),saved);
 assert.equal(JSON.stringify(restoredLegacy.save()),saved);
 assert.deepEqual(Object.keys(legacy.save()).sort(),['edits','schema','seed']);
 for(const row of legacy.save().edits)assert.ok(row[3]>=0&&row[3]<=8);
});

test('atomic candidate rollback rejects stale state without losing legacy or valid fixture cells',()=>{
 const legacy=new VoxelWorld(181);
 assert.equal(legacy.set(1,14,1,BLOCK.CRYSTAL),true);
 const legacyBefore=JSON.stringify(legacy.save());
 const fixture=createPack4Fixture([[1,1,1]]);
 assert.equal(fixture.place([1,2,1],165,2).ok,true);
 const fixtureBefore=JSON.stringify(fixture.save());
 const snap=JSON.parse(fixtureBefore);
 for(const bad of [
  {...snap,cells:[{cell:[1,2,1],id:165,rotation:undefined}]},
  {...snap,cells:[{cell:[1,2,1],id:255,rotation:1}]},
  {...snap,cells:[{cell:[1,2,1],id:165,rotation:4}]},
  {...snap,cells:[{cell:[1,2,1],id:165,rotation:2},{cell:[1,2,1],id:165,rotation:2}]}
 ]){
  assert.throws(()=>fixture.restore(bad));
  assert.equal(JSON.stringify(fixture.save()),fixtureBefore);
  assert.equal(JSON.stringify(legacy.save()),legacyBefore);
 }
 const staged=pack4FixtureToSidecarSnapshot(fixture.save());
 assert.throws(()=>pack4SidecarToFixtureSnapshot([
  {cell:[1,2,1],blockId:165,turns:undefined}
 ]));
 const reader=()=>0; // simulated edited/removed world cell
 assert.equal(restoreOrientationSidecar(staged,reader).size(),0,
  'candidate rotation must not restore onto stale or differently typed cells');
 assert.equal(JSON.stringify(legacy.save()),legacyBefore);
});
