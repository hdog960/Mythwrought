import test from 'node:test';
import assert from 'node:assert/strict';
import {STORYBOOK_ROOF_GLSL,STORYBOOK_ROOF_RENDER_TAG,STORYBOOK_ROOF_RULES} from '../src/storybook-roof.mjs';
import {STORYBOOK_MATERIAL_FRAGMENT_SHADER as FS,STORYBOOK_ART_RULES} from '../src/storybook-materials.mjs';
import {VoxelWorld,BLOCK} from '../src/voxel.mjs';

test('roofing is a reserved render-only tag, never a saved block',()=>{
  assert.equal(STORYBOOK_ROOF_RENDER_TAG,16);
  assert.equal(STORYBOOK_ROOF_RULES.placeableBlockId,null);
  assert.deepEqual(STORYBOOK_ART_RULES.renderOnlyArchitecturalMaterials,[15,16]);
  assert.equal(STORYBOOK_ROOF_RULES.extraTextures,0);
  assert.equal(STORYBOOK_ROOF_RULES.extraDrawCalls,0);
  assert.equal(STORYBOOK_ROOF_RULES.saveSchemaChanged,false);
  const world=new VoxelWorld(179);
  assert.equal(world.set(2,10,2,16),false);
  assert.equal(world.set(2,10,2,BLOCK.WOOD),true);
  assert.equal(VoxelWorld.restore(world.save()).get(2,10,2),BLOCK.WOOD);
  assert.equal(world.save().schema,1);
});

test('roof shader renders staggered scalloped opaque shingles without sampling textures',()=>{
  for(const token of ['mod(roofRow,2.0)*.5','roofSeam=','roofLap=','roofScallop=','roofGlaze=','shade=','base=mix'])
    assert.ok(STORYBOOK_ROOF_GLSL.includes(token),token);
  assert.doesNotMatch(STORYBOOK_ROOF_GLSL,/sampler2D|texture\(|discard;|gl_FragDepth/i);
  const start=FS.indexOf('}else if(vMat==16)');
  const end=FS.indexOf('}else if(vMat==13||vMat==14)',start);
  assert.ok(start>0&&end>start);
  assert.ok(FS.slice(start,end).includes(STORYBOOK_ROOF_GLSL.trim()));
  assert.ok(FS.indexOf('return;')<start);
  assert.match(FS,/outColor=vec4\(mix\(colored,uFog,fog\),1\.0\)/);
});
