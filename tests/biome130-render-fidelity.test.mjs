// Source-specific alpha-material validation for the actual Mythwrought engine.
import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,meshChunk} from '../src/voxel.mjs';
import {meshDepthSection} from '../src/depth-mesh.mjs';
import {biome130Block} from '../src/biome130-registry.mjs';
import {STORYBOOK_MATERIAL_FRAGMENT_SHADER} from '../src/storybook-materials.mjs';
import {prototypeSurfaceMesh} from '../src/shape-prototypes.mjs';
import {resolveBiome130BuilderAsset} from '../src/builder-assets/biome130.mjs';
import {BIOME130_ICE_BLOCK_IDS,BIOME130_LEAF_SOURCE_TINTS,biome130MaterialTag,
  biome130TriangleMaterialTag,
  splitBiome130Translucent,biome130TerrainFragmentShader} from '../src/biome130-render.mjs';

test('seven original ice opacities and nine foliage species have isolated tags',()=>{
  assert.deepEqual(BIOME130_ICE_BLOCK_IDS,[275,276,277,280,281,282,350]);
  const expectedAlpha=[.46,.78,.9,.72,.82,.68,.72];
  for(let i=0;i<BIOME130_ICE_BLOCK_IDS.length;i++){
    const id=BIOME130_ICE_BLOCK_IDS[i],material=biome130MaterialTag(id);
    assert.equal(biome130Block(id).opacity,expectedAlpha[i]);
    assert.equal(Math.floor(material),49);
    assert.ok(Math.abs(material-49-expectedAlpha[i])<1e-7);
    const builder=resolveBiome130BuilderAsset(biome130Block(id).symbol);
    assert.equal(builder.rendererFidelity,'alpha-blended');
    assert.equal(builder.alphaIntent,'blend');
    assert.equal(builder.transparentIntent,true);
  }
  assert.equal(biome130MaterialTag(349),0);
  assert.equal(biome130MaterialTag(351),0);
  assert.equal(biome130MaterialTag(21),0,'Pack 2 material 21 must remain reserved');
  for(let id=377;id<=385;id++){
    assert.equal(biome130MaterialTag(id),40+id-377);
    const swatches=biome130Block(id).palette;
    assert.deepEqual(BIOME130_LEAF_SOURCE_TINTS[id-377],
      swatches[Math.floor(swatches.length/2)],
      'Foliage tint must come from the actual M11 authored species palette');
    const asset=resolveBiome130BuilderAsset(biome130Block(id).symbol);
    assert.equal(asset.rendererFidelity,'alpha-cutout');
    assert.equal(asset.alphaIntent,'cutout');
    assert.equal(asset.transparentIntent,true);
    assert.equal(asset.solid,false);
  }
  assert.equal(resolveBiome130BuilderAsset('biome130:094').rendererFidelity,'opaque');
  const fallback=resolveBiome130BuilderAsset('biome130:040');
  assert.equal(fallback.rendererFidelity,'opaque-fallback');
  assert.equal(fallback.alphaIntent,'blend');
  assert.equal(fallback.transparentIntent,true);
});

test('authored stems remain opaque but original leaf lobe surfaces use cutouts at four yaws',()=>{
  let opaqueStems=0,cutoutLeaves=0;
  for(let id=377;id<=385;id++)for(let yaw=0;yaw<4;yaw++){
    const source=biome130Block(id,yaw);
    const mesh=prototypeSurfaceMesh({prototypeOnly:true,boxes:source.boxes});
    const originalTriangles=mesh.indices.length/3;
    let stems=0,leaves=0;
    for(let t=0;t<mesh.indices.length;t+=3){
      const material=biome130TriangleMaterialTag(
        id,yaw,mesh.positions,mesh.indices,t);
      assert.ok(material===0||material===40+id-377);
      if(material===0)stems++;else leaves++;
    }
    assert.equal(stems+leaves,originalTriangles,'Cannot add/cull M11 source triangles');
    assert.ok(leaves>0,'Missing source foliage leaves '+id+' yaw '+yaw);
    opaqueStems+=stems;cutoutLeaves+=leaves;
  }
  assert.ok(opaqueStems>0,'No original exposed twig faces survived');
  assert.ok(cutoutLeaves>opaqueStems,'Leaf lobes still dominate the silhouette');
  assert.equal(biome130TriangleMaterialTag(350,0,[],[],0),biome130MaterialTag(350));
});

test('all nine foliage source IDs keep real surface/deep stem and leaf material paths',()=>{
  const world=new VoxelWorld(179);
  for(const y of [18,-60]){
    for(let i=0;i<9;i++){
      const id=377+i,x=8994+i%5,z=8994+Math.floor(i/5)*2;
      assert.equal(world.set(x,y,z,id,i%4),true);
    }
    const mesh=y>0?meshChunk(world,562,562):
      meshDepthSection(world,562,562,-4);
    assert.ok(mesh instanceof Float32Array);
    assert.equal(mesh.length%9,0);
    assert.ok(mesh.every(Number.isFinite));
    const leafIds=new Set(),stemIds=new Set();
    for(let v=0;v<mesh.length;v+=27){
      const tag=mesh[v+8];
      if(tag>=40&&tag<=48)leafIds.add(tag-40+377);
      if(tag!==0)continue;
      for(let k=0;k<9;k++){
        const id=377+k,x=8994+k%5,z=8994+Math.floor(k/5)*2;
        const stem=biome130Block(id,k%4).boxes[0];
        let inside=true;
        for(let t=0;t<3&&inside;t++){
          const offset=v+t*9;
          const point=[mesh[offset]-x,mesh[offset+1]-y,mesh[offset+2]-z];
          for(let a=0;a<3;a++)
            if(point[a]<stem[a]-1e-5||point[a]>stem[a+3]+1e-5){inside=false;break;}
        }
        if(inside)stemIds.add(id);
      }
    }
    assert.deepEqual([...leafIds].sort((a,b)=>a-b),
      Array.from({length:9},(_,i)=>377+i),'Every foliage leaf must render in '+y);
    assert.ok(stemIds.size>0,'Source opaque stems missing in '+y+' section');
  }
  const saved=world.save();
  assert.equal(saved.schema,1);
  assert.deepEqual(VoxelWorld.restore(saved).save(),saved);
});

test('transparent split retains exact vertex ABI, source alpha and opaque order',()=>{
  const input=new Float32Array([
    1,2,3,.5,.6,.7,0,1,40,
    4,5,6,.7,.8,.9,1,0,49.46,
    7,8,9,.1,.2,.3,.5,.5,21,
    10,11,12,.3,.4,.5,0,0,49.72
  ]);
  const {opaque,translucent}=splitBiome130Translucent(input);
  assert.deepEqual([...opaque],[...input.subarray(0,9),...input.subarray(18,27)]);
  assert.deepEqual([...translucent],[...input.subarray(9,18),...input.subarray(27,36)]);
  assert.equal(Math.floor(translucent[8]),49);
  assert.equal(Math.floor(translucent[17]),49);
  const iceFree=new Float32Array([0,0,0,1,1,1,0,0,21]);
  assert.equal(splitBiome130Translucent(iceFree).opaque,iceFree,
    'Avoid opaque copy or extra GPU buffer in ice-free chunks');
  assert.throws(()=>splitBiome130Translucent(new Float32Array(8)),TypeError);
});

test('every ice alpha survives actual surface and deep meshing and save/restore',()=>{
  const world=new VoxelWorld(179);
  for(const [y,section] of [[18,0],[-60,-4]]){
    for(let i=0;i<BIOME130_ICE_BLOCK_IDS.length;i++){
      assert.equal(world.set(9000+i,y,9000,BIOME130_ICE_BLOCK_IDS[i],i%4),true);
    }
    assert.equal(world.set(9007,y,9000,377,2),true);
    const mesh=section===0?meshChunk(world,562,562):meshDepthSection(world,562,562,section);
    assert.equal(mesh.length%9,0);
    assert.ok(mesh.every(Number.isFinite));
    const split=splitBiome130Translucent(mesh);
    assert.ok(split.translucent.length>0);
    const alphaSeen=new Set(),tags=new Set();
    for(let i=8;i<split.translucent.length;i+=9){
      const tag=split.translucent[i];
      assert.equal(Math.floor(tag),49);
      alphaSeen.add(Math.round((tag-49)*100));
    }
    for(let i=8;i<split.opaque.length;i+=9){
      assert.notEqual(Math.floor(split.opaque[i]),49);
      tags.add(split.opaque[i]);
    }
    assert.deepEqual([...alphaSeen].sort((a,b)=>a-b),[46,68,72,78,82,90]);
    assert.ok(tags.has(40),'Source foliage cutout lost on section '+section);
  }
  const saved=world.save();
  assert.equal(saved.schema,1);
  assert.deepEqual(VoxelWorld.restore(saved).save(),saved);
});

test('real shader preserves water 20, opaque Pack 2 21, ice 49.x, both quality settings',()=>{
  const shader=biome130TerrainFragmentShader(STORYBOOK_MATERIAL_FRAGMENT_SHADER);
  assert.match(shader,/vMat==20/);
  assert.match(shader,/outColor=vec4\(mix\(vColor,uFog,f\),vPack2Alpha\)/);
  assert.match(shader,/vMat==49/);
  assert.match(shader,/outColor=vec4\(mix\(glacial,uFog,f\),vPack2Alpha\)/);
  assert.match(shader,/vMat>=40&&vMat<=48/);
  assert.match(shader,/vec3 pigment=mix\(vColor,leafTint,\.42\)/);
  for(let i=0;i<9;i++){
    const c=BIOME130_LEAF_SOURCE_TINTS[i].map(v=>v.toFixed(5)).join(',');
    assert.ok(shader.includes('vMat=='+(40+i)+'?vec3('+c+')'),
      'Missing exact palette-based GLSL color for species '+i);
  }
  assert.match(shader,/bool needles=vMat==42\|\|vMat==43\|\|vMat==46/);
  assert.match(shader,/bool hanging=vMat==44\|\|vMat==48/);
  assert.ok(shader.includes('vec2 p=vUv*(needles?6.0:7.0)'),
    'Fewer, larger conifer needles at iPhone scale');
  assert.ok(shader.includes('float width=needles?.18:'),
    'Prevent subpixel-thin conifer needle cutouts');
  assert.match(shader,/lengthRatio>1\.0\|\|abs\(leaf\.x\)>edge\)discard/);
  assert.match(shader,/sqrt\(max\(0\.0,1\.0-lengthRatio\*lengthRatio\)\)/);
  assert.doesNotMatch(shader,/vUv\*12\.0/, 'Reject old checker-perforation shader');
  assert.doesNotMatch(shader,/vMat==21(?:[^0-9]|$)/);
  assert.ok(shader.indexOf('discard;')<shader.indexOf('if(uArtQuality<.5)'));
  assert.equal(shader.split('void main(){').length,2);
});
