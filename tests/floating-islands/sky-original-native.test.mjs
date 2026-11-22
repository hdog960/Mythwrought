// Native original Mythwrought-source acceptance: intentionally UNRUN until
// a complete source checkout with all registry dependencies is available.
import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld} from '../../src/voxel.mjs';
import {createOriginalSkyPhysicalHost,originalSkyMaterials} from '../../src/floating-islands/sky-original-host.mjs';

test('original biome130 registry exposes exact registered pine/moonwillow/blackwood and star moss IDs',()=>{
  for(const [kind,role,id] of [
    ['windbent-pine','trunk',370],['windbent-pine','leaves',379],
    ['cloudleaf-tree','trunk',376],['cloudleaf-tree','leaves',385],
    ['starbloom-tree','trunk',375],['starbloom-tree','leaves',384],
    ['glowmoss','ground-cover',287]])
    assert.equal(originalSkyMaterials.assetFor(kind,role),id);
  assert.equal(originalSkyMaterials.assetFor('windgrass-tuft','ground-cover'),null);
});

test('true original player physics, physical raycast and shaped GPU vertex source share sky cells',()=>{
  const original=new VoxelWorld(179),skyEdits=new Map();
  const originalSave=JSON.stringify(original.save());
  const host=createOriginalSkyPhysicalHost({groundWorld:original,skyEdits,
    skyGet:(x,y,z)=>x===3&&y===70&&z===4?370:0});
  assert.equal(host.world.get(3,70,4),370);
  assert.equal(host.physical.isBodyClear({x:3.5,y:70,z:4.5}),false);
  const hit=host.physical.raycast([3.5,70.5,7],[0,0,-1],7);
  assert.deepEqual(hit?.hit,[3,70,4]);
  const mesh=host.meshSection(0,0,3);
  assert.ok(mesh.shapedTriangles>0&&mesh.vertexCount>0&&mesh.vertexCount<=24576);
  assert.equal(mesh.vertices.length%9,0);
  skyEdits.set('3,70,4',0);
  assert.equal(host.world.get(3,70,4),0);
  assert.equal(host.meshSection(0,0,3).vertexCount,0);
  assert.equal(JSON.stringify(original.save()),originalSave);
  assert.equal(original.get(3,70,4),0);
});

test('registered nonsolid pine needle clusters target physically but allow player traversal',()=>{
  const original=new VoxelWorld(2026);
  const host=createOriginalSkyPhysicalHost({groundWorld:original,
    skyGet:(x,y,z)=>x===0&&y===70&&z===0?379:0});
  assert.equal(originalSkyMaterials.shapeFor(379).opaque,false);
  assert.equal(host.physical.isBodyClear({x:.5,y:70,z:.5}),true);
  const mesh=host.meshSection(0,0,3);
  assert.ok(mesh.shapedTriangles>0);
});
