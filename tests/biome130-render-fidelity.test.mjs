import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,meshChunk} from '../src/voxel.mjs';
import {meshDepthSection} from '../src/depth-mesh.mjs';
import {STORYBOOK_MATERIAL_FRAGMENT_SHADER} from '../src/storybook-materials.mjs';
import {resolveBiome130BuilderAsset} from '../src/builder-assets/biome130.mjs';
import {biome130MaterialTag,splitBiome130Translucent,
  biome130TerrainFragmentShader} from '../src/biome130-render.mjs';

test('only source-backed ice 095 and foliage 122–130 change render materials',()=>{
  assert.equal(biome130MaterialTag(350),49);
  assert.equal(biome130MaterialTag(349),0);
  assert.equal(biome130MaterialTag(351),0);
  assert.equal(biome130MaterialTag(255),0);
  assert.equal(biome130MaterialTag(21),0,'Pack 2 material 21 must not be claimed');
  for(let id=377;id<=385;id++){
    assert.equal(biome130MaterialTag(id),40+id-377);
    const asset=resolveBiome130BuilderAsset('biome130:'+String(id-255).padStart(3,'0'));
    assert.equal(asset.rendererFidelity,'alpha-cutout');
    assert.equal(asset.solid,false);
  }
  assert.equal(resolveBiome130BuilderAsset('biome130:095').rendererFidelity,'alpha-blended');
  assert.equal(resolveBiome130BuilderAsset('biome130:094').rendererFidelity,'opaque');
});

test('transparent router preserves all original 9-float vertices and stable ordering',()=>{
  const input=new Float32Array([
    1,2,3,.5,.6,.7,0,1,40,
    4,5,6,.7,.8,.9,1,0,49,
    7,8,9,.1,.2,.3,.5,.5,0,
    10,11,12,.3,.4,.5,0,0,49
  ]);
  const {opaque,translucent}=splitBiome130Translucent(input);
  assert.deepEqual([...opaque],[...input.subarray(0,9),...input.subarray(18,27)]);
  assert.deepEqual([...translucent],[...input.subarray(9,18),...input.subarray(27,36)]);
  const none=new Float32Array([0,0,0,1,1,1,0,0,40]);
  assert.equal(splitBiome130Translucent(none).opaque,none,'No allocation of opaque copy without ice');
  assert.throws(()=>splitBiome130Translucent(new Float32Array(8)),TypeError);
});

test('surface and deep real voxel meshes emit separate ice and cutout leaf materials',()=>{
  const world=new VoxelWorld(179);
  for(const [y,section] of [[18,0],[-60,-4]]){
    assert.equal(world.set(9000,y,9000,350,1),true);
    assert.equal(world.set(9001,y,9001,377,2),true);
    const vertices=section===0?meshChunk(world,562,562):meshDepthSection(world,562,562,section);
    assert.equal(vertices.length%9,0);
    assert.ok(vertices.every(Number.isFinite));
    const tags=[];
    for(let i=8;i<vertices.length;i+=9)tags.push(vertices[i]);
    assert.ok(tags.includes(49),'Ice missing from physical section '+section);
    assert.ok(tags.includes(40),'Oak cutout missing from physical section '+section);
    const split=splitBiome130Translucent(vertices);
    assert.ok(split.translucent.length>0);
    for(let i=8;i<split.translucent.length;i+=9)assert.equal(split.translucent[i],49);
    for(let i=8;i<split.opaque.length;i+=9)assert.notEqual(split.opaque[i],49);
  }
});

test('fragment source keeps water material 20 and cutout before economy early return',()=>{
  const fs=biome130TerrainFragmentShader(STORYBOOK_MATERIAL_FRAGMENT_SHADER);
  assert.match(fs,/vMat==20/);
  assert.match(fs,/vPack2Alpha/);
  assert.match(fs,/vMat==49/);
  assert.match(fs,/\.72\);return;/);
  assert.match(fs,/vMat>=40&&vMat<=48/);
  assert.doesNotMatch(fs,/vMat==21(?:[^0-9]|$)/,'Never override Pack 2 opaque material 21');
  assert.match(fs,/discard;/);
  assert.ok(fs.indexOf('discard;')<fs.indexOf('if(uArtQuality<.5)'));
  assert.equal(fs.split('void main(){').length,2);
});
