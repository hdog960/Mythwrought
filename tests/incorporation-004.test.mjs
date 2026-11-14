import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,meshChunk,BLOCK} from '../src/voxel.mjs';
import {STORYBOOK_MATERIAL_FRAGMENT_SHADER,STORYBOOK_ART_RULES} from '../src/storybook-materials.mjs';
test('checkpoint-004 retains schema-1 world edits and deterministic mesh roundtrip',()=>{
  const world=new VoxelWorld(179);
  assert.deepEqual(Object.values(BLOCK).slice(0,7),[0,1,2,3,4,5,6], 'Checkpoint 004 physical IDs are immutable');
  assert.deepEqual(Object.values(BLOCK).slice(7),[7,8], 'Checkpoint 005 adds distinct physical leaf/deepstone IDs');
  assert.equal(world.set(1,4,1,BLOCK.CRYSTAL),true);
  assert.equal(world.save().schema,1);
  assert.deepEqual(meshChunk(VoxelWorld.restore(world.save()),0,0),meshChunk(world,0,0));
});
test('natural and architectural shaders coexist without unresolved interpolation',()=>{
  const shader=STORYBOOK_MATERIAL_FRAGMENT_SHADER;
  for(const key of ['vMat==1','vMat==2','vMat==3','vMat==4','vMat==5','vMat==6','vMat==15','vMat==16'])assert.ok(shader.includes(key),key);
  assert.ok(!shader.includes('${'),'shader interpolation must be resolved');
  assert.deepEqual([...STORYBOOK_ART_RULES.renderOnlyArchitecturalMaterials].slice(0,2),[15,16]);
  assert.deepEqual([...STORYBOOK_ART_RULES.renderOnlyArchitecturalMaterials],[15,16,17]);
  assert.deepEqual(STORYBOOK_ART_RULES.physicalNaturalMaterials,{leaves:{blockId:7,shaderTag:18},deepstone:{blockId:8,shaderTag:19}});
  assert.equal(STORYBOOK_ART_RULES.newTextures,0);
  assert.equal(STORYBOOK_ART_RULES.newDrawCalls,0);
});
