// Pack 2 — OPTIONAL REAL-PRODUCTION BOUNDARY GATE (never a fixture substitute).
// Run only from a complete Mythwrought source checkout with the *actual*
// src/voxel.mjs and every dependency. No test-specific VoxelWorld facade.
// This does not register candidate IDs or modify the live game/save schema.
import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,VoxelWorld,WORLD_MIN_Y,WORLD_MAX_Y} from '../../../src/voxel.mjs';
import {WORLD_MIN_Y as ENGINE_WORLD_MIN_Y} from '../../../src/depth.mjs';
import {PACK_2_FIXTURE_IDS,Pack2Fixture} from './fixture.mjs';

test('real production VoxelWorld implementation is loaded, not a test-only ID facade',()=>{
  assert.equal(typeof VoxelWorld.prototype.naturalAndLandmarkBlock,'function');
  assert.equal(typeof VoxelWorld.prototype.legacyBlockAt,'function');
  assert.equal(typeof VoxelWorld.prototype.get,'function');
  assert.equal(typeof VoxelWorld.prototype.save,'function');
  assert.equal(typeof VoxelWorld.restore,'function');
  assert.equal(WORLD_MIN_Y,-3);
  assert.ok(ENGINE_WORLD_MIN_Y<WORLD_MIN_Y,
    'production editable depth extends below the unchanged legacy world floor');
  assert.ok(WORLD_MAX_Y>=19);
  assert.deepEqual(Object.values(BLOCK).sort((a,b)=>a-b),
    Array.from({length:9},(_,i)=>i));
});

test('all 18 provisional Pack 2 IDs are rejected without altering a real save',()=>{
  const world=new VoxelWorld(179);
  const initial=world.save();
  assert.equal(initial.schema,1);
  assert.equal(initial.seed,179);
  assert.deepEqual(PACK_2_FIXTURE_IDS,Array.from({length:18},(_,i)=>59+i));
  for(const id of PACK_2_FIXTURE_IDS)
    assert.equal(world.set(8,1,0,id),false,'candidate ID '+id+' must not be live');
  assert.deepEqual(world.save(),initial,'rejected IDs mutated legacy schema-1 save');
});

test('a real existing valid legacy edit survives schema-1 JSON round-trip',()=>{
  const world=new VoxelWorld(179);
  assert.equal(world.set(10,17,12,BLOCK.CRYSTAL),true);
  const snapshot=world.save();
  const restored=VoxelWorld.restore(JSON.parse(JSON.stringify(snapshot)));
  assert.equal(restored.seed,world.seed);
  assert.equal(restored.get(10,17,12),BLOCK.CRYSTAL);
  assert.deepEqual(restored.save(),snapshot);
});

test('production restore rejects malformed or candidate-containing saves',()=>{
  const invalid=[
    null,{schema:2,seed:179,edits:[]},{schema:1,seed:179,edits:null},
    {schema:1,seed:179,edits:[[8,1,0,76]]},
    {schema:1,seed:179,edits:[[8,1,0,59]]},
    {schema:1,seed:179,edits:[[8,1,0,255]]},
    {schema:1,seed:179,edits:[[8,1,0,1,0]]},
    {schema:1,seed:179.5,edits:[]}
  ];
  for(const payload of invalid)
    assert.throws(()=>VoxelWorld.restore(payload),Error);
});

test('Pack 2 preview snapshots cannot be mistaken for production schema-1 data',()=>{
  const fixture=new Pack2Fixture();
  fixture.select(59);assert.equal(fixture.place([1,1,1]),true);
  fixture.select(76);fixture.setWaterSelection({level:5,flow:'east'});
  assert.equal(fixture.place([2,1,1]),true);
  const local=fixture.serialize();
  assert.throws(()=>VoxelWorld.restore(local),Error);
  const world=new VoxelWorld(179);
  assert.deepEqual(world.save(),{schema:1,seed:179,edits:[]});
});

test('live invalid coordinate and non-integer IDs cannot create legacy edits',()=>{
  const world=new VoxelWorld(179);
  for(const [x,y,z,id] of [
    [1,WORLD_MAX_Y+1,1,BLOCK.WOOD],
    [1,ENGINE_WORLD_MIN_Y-1,1,BLOCK.STONE],
    [1,WORLD_MIN_Y-1,1,76], // Deep edit height is valid; provisional ID still is not.
    [1,1,1,76],[1,1,1,255],[1,1,1,-1],[1,1,1,2.5],
    [1.5,1,1,BLOCK.WOOD]
  ])assert.equal(world.set(x,y,z,id),false);
  assert.deepEqual(world.save(),{schema:1,seed:179,edits:[]});
});
