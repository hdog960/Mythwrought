import test from 'node:test';
import assert from 'node:assert/strict';
import {CARVED_TRIM_GLSL,CARVED_TRIM_RENDER_TAG,CARVED_TRIM_RULES} from '../src/carved-trim.mjs';
import {STORYBOOK_MATERIAL_FRAGMENT_SHADER as FS,STORYBOOK_ART_RULES} from '../src/storybook-materials.mjs';
import {VoxelWorld,BLOCK} from '../src/voxel.mjs';

test('carved trim is an opaque render-only tag without saved voxel IDs',()=>{
  assert.equal(CARVED_TRIM_RENDER_TAG,17);
  assert.equal(CARVED_TRIM_RULES.placeableBlockId,null);
  assert.deepEqual(STORYBOOK_ART_RULES.renderOnlyArchitecturalMaterials,[15,16,17]);
  assert.equal(CARVED_TRIM_RULES.extraTextures,0);
  assert.equal(CARVED_TRIM_RULES.extraDrawCalls,0);
  assert.equal(CARVED_TRIM_RULES.saveSchemaChanged,false);
  const world=new VoxelWorld(179);
  assert.equal(world.set(2,10,2,17),false);
  assert.equal(world.set(2,10,2,BLOCK.WOOD),true);
  assert.equal(VoxelWorld.restore(world.save()).get(2,10,2),BLOCK.WOOD);
  assert.equal(world.save().schema,1);
});

test('trim provides carved bands and sparse rosettes inside existing opaque pass',()=>{
  for(const token of ['trimUpper=','trimLower=','trimInnerUpper=','trimInnerLower=',
    'trimJoint=','trimRosetteSeed=','trimRing=','trimPetals=','trimWear=','shade=','base=mix'])
    assert.ok(CARVED_TRIM_GLSL.includes(token),token);
  assert.doesNotMatch(CARVED_TRIM_GLSL,/sampler2D|texture\(|discard;|gl_FragDepth/i);
  const start=FS.indexOf('}else if(vMat==17)');
  const end=FS.indexOf('}else if(vMat==13||vMat==14)',start);
  assert.ok(start>0&&end>start);
  assert.ok(FS.slice(start,end).includes(CARVED_TRIM_GLSL.trim()));
  assert.ok(FS.indexOf('return;')<start);
});
