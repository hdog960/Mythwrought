import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,worldKey} from '../src/voxel.mjs';
import {WORLD_MIN_Y,LEGACY_WORLD_MIN_Y} from '../src/depth.mjs';
import {deepVaultWorld,deepVaultEvidence,VAULT_LEVELS} from '../src/deep-vault-galleries.mjs';
for(const seed of [179,1,2026,-77]){
  test('four distinct deep physical vaults and traversable horizontal approaches seed '+seed,()=>{
    const world=new VoxelWorld(seed),before=JSON.stringify(world.save());
    const evidence=deepVaultEvidence(world);
    assert.equal(evidence.length,4);
    for(const row of evidence){
      assert.ok(row.floor>=WORLD_MIN_Y&&row.floor<LEGACY_WORLD_MIN_Y);
      assert.ok(row.air>60,JSON.stringify(row));
      assert.ok(row.solid>60,JSON.stringify(row));
      assert.ok(row.approach>=15,JSON.stringify(row));
      assert.equal(row.failures,0,JSON.stringify(row));
    }
    assert.equal(JSON.stringify(world.save()),before);
    const second=deepVaultEvidence(new VoxelWorld(seed));
    assert.deepEqual(second,evidence);
  });
}
test('player edits win over generated cave air, survive schema-1 restore',()=>{
  const world=new VoxelWorld(179),x=118,y=VAULT_LEVELS[1]+2,z=89;
  assert.equal(deepVaultWorld(world).get(x,y,z),BLOCK.AIR);
  assert.equal(world.set(x,y,z,BLOCK.WOOD),true);
  assert.equal(deepVaultWorld(world).get(x,y,z),BLOCK.WOOD);
  const saved=world.save(),restored=VoxelWorld.restore(saved);
  assert.deepEqual(restored.save(),saved);
  assert.equal(deepVaultWorld(restored).get(x,y,z),BLOCK.WOOD);
});
test('legacy seeded envelope is byte-identical, no new IDs',()=>{
  const world=new VoxelWorld(179),reader=deepVaultWorld(world);
  for(let x=100;x<120;x+=3)for(let z=75;z<100;z+=4)
    for(let y=LEGACY_WORLD_MIN_Y;y<=19;y+=3)
      assert.equal(reader.get(x,y,z),world.get(x,y,z));
  assert.equal(reader.get(104,VAULT_LEVELS[0]+1,84),BLOCK.AIR);
  assert.equal(reader.get(104,VAULT_LEVELS[0],84),BLOCK.DEEPSTONE);
});
