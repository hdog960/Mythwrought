import test from 'node:test';
import assert from 'node:assert/strict';
import {CARVED_MASONRY_GLSL, CARVED_MASONRY_RENDER_TAG, CARVED_MASONRY_RULES} from '../src/carved-masonry.mjs';
import {STORYBOOK_MATERIAL_FRAGMENT_SHADER as FS, STORYBOOK_ART_RULES} from '../src/storybook-materials.mjs';
import {BLOCK,VoxelWorld} from '../src/voxel.mjs';

test('architectural ashlar is a render tag, not a new editable block ID',()=>{
  assert.equal(CARVED_MASONRY_RENDER_TAG,15);
  assert.equal(CARVED_MASONRY_RULES.placeableBlockId,null);
  assert.equal(CARVED_MASONRY_RULES.extraTextures,0);
  assert.equal(CARVED_MASONRY_RULES.extraDrawCalls,0);
  assert.equal(CARVED_MASONRY_RULES.saveSchemaChanged,false);
  assert.deepEqual(STORYBOOK_ART_RULES.renderOnlyArchitecturalMaterials,[15,16]);
  const world=new VoxelWorld(179);
  assert.equal(world.set(2,10,2,15),false);
  assert.equal(world.set(2,10,2,BLOCK.WOOD),true);
  assert.equal(VoxelWorld.restore(world.save()).get(2,10,2),BLOCK.WOOD);
  assert.equal(world.save().schema,1);
});

test('carved masonry uses staggered large-scale opaque courses and sparse rune marks',()=>{
  assert.equal(CARVED_MASONRY_RULES.courseRows,4);
  assert.equal(CARVED_MASONRY_RULES.courseColumns,3);
  for(const token of ['mod(row,2.0)*.5','mortar=','bevel=','blockVariation=','chip=','runeCell=','runeInk=','shade=','base=mix'])
    assert.ok(CARVED_MASONRY_GLSL.includes(token),token);
  assert.doesNotMatch(CARVED_MASONRY_GLSL,/sampler2D|texture\(|discard;|gl_FragDepth/i);
  const start=FS.indexOf('}else if(vMat==15)');
  const end=FS.indexOf('}else if(vMat==13||vMat==14)',start);
  assert.ok(start>0&&end>start,'architectural render tag has an isolated shader branch');
  assert.ok(FS.slice(start,end).includes(CARVED_MASONRY_GLSL.trim()));
  assert.ok(FS.indexOf('return;')<start,'economy mode bypasses masonry detail');
  assert.match(FS,/outColor=vec4\(mix\(colored,uFog,fog\),1\.0\)/);
});
