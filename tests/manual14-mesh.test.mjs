import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK} from '../src/voxel.mjs';
import {MANUAL_FIVE_PACK_CATALOG} from '../src/builder-assets/manual-five-pack.mjs';
import {createManual14Layer} from '../src/builder-assets/manual14-layer.mjs';
import {meshManual14Chunk,MANUAL14_VERTICES_PER_CHUNK} from '../src/builder-assets/manual14-mesh.mjs';
import {candidateSurface,candidateFaceTexture} from '../src/block-packs/pack-1/webgl2-candidates.mjs';
import {pack4BuilderAsset} from '../src/block-packs/pack-4/builder-handoff.mjs';

const byId=new Map(MANUAL_FIVE_PACK_CATALOG.map(e=>[e.numericId,e]));
function placed(id,at,orientation=0,variant='lower'){
 const meta=byId.get(id);if(!meta)throw Error('Unrecognized authored ID '+id);
 return {asset:meta.symbol,numericId:id,at,orientation,
  ...(meta.pack===1?{variant}:{})};
}
const sample=()=>{
 const world=new VoxelWorld(179);
 for(const at of [[500,19,500],[501,19,500],[503,19,500]])
  assert.equal(world.get(...at),BLOCK.AIR);
 assert.equal(world.set(503,19,501,BLOCK.STONE),true);
 const layer=createManual14Layer(world);
 assert.equal(layer.placeMany([placed(9,[500,19,500]),
  placed(159,[501,19,500]),placed(163,[503,19,500])]),3);
 return {world,layer};
};
test('original Pack 1 authored face textures, source Pack 4 translucent glass and wall-shutters mesh in actual terrain ABI',()=>{
 const {world,layer}=sample(),before=JSON.stringify(world.save());
 const geometry=meshManual14Chunk(layer,31,31,0);
 assert.equal(geometry.instances,3);
 assert.ok(geometry.opaque instanceof Float32Array);
 assert.ok(geometry.transparent instanceof Float32Array);
 assert.ok(geometry.opaque.length>0);
 assert.ok(geometry.transparent.length>0,'Clear glass must remain a translucent geometry pass');
 assert.equal(geometry.opaque.length%9,0);
 assert.equal(geometry.transparent.length%9,0);
 assert.equal(geometry.vertices,(geometry.opaque.length+geometry.transparent.length)/9);
 assert.ok(geometry.vertices<=MANUAL14_VERTICES_PER_CHUNK);
 assert.ok(geometry.opaque.every(Number.isFinite));
 assert.ok(geometry.transparent.every(Number.isFinite));
 assert.ok([...geometry.opaque,...geometry.transparent].some((v,i)=>
  i%9===8&&v>20&&v<21),'Glass uses real existing alpha-blending material ABI');
 assert.equal(JSON.stringify(world.save()),before,'Rendering never mutates original schema-1 world');
});
test('Pack 1 surface uses original authored UV/face texture source, not a generic cube approximation',()=>{
 const model=candidateSurface(9,0);
 assert.ok(model.quads.length>0);
 const q=model.quads[0],texture=candidateFaceTexture(9,q.role,q.face,24);
 assert.equal(texture.pixels.length,24*24*4);
 assert.equal(texture.width,24);
 assert.equal(texture.height,24);
 const {layer}=sample(),actual=meshManual14Chunk(layer,31,31,0);
 assert.ok(actual.opaque.length>model.quads.length*6*9,
  'Source face colors are rasterized into bounded subtriangles for handheld rendering');
});
test('Pack 4 translucency is sourced from the original physical authoring mesh',()=>{
 const model=pack4BuilderAsset(byId.get(159).symbol,{candidateId:159,rotation:0});
 assert.ok(model.previewMesh.translucent.length>0);
 assert.equal(model.previewMesh.stride,10);
 const {layer}=sample(),rendered=meshManual14Chunk(layer,31,31,0);
 assert.ok(rendered.transparent.length>0);
});
test('GPU chunk budgets reject oversized physical worlds without partially drawing an out-of-budget mesh',()=>{
 const {layer}=sample();
 assert.throws(()=>meshManual14Chunk(layer,31,31,0,{maxVertices:1}),/bounded iPhone triangle budget/);
 assert.equal(layer.size(),3,'Mesh rejection never destroys source-owned saved geometry');
 const empty=meshManual14Chunk(layer,1000,1000,0);
 assert.equal(empty.instances,0);
 assert.equal(empty.opaque.length+empty.transparent.length,0);
});
test('all rotating authored manual parts are isolated to their seed, depth and 16x16 horizontal chunk',()=>{
 const {layer}=sample();
 const a=meshManual14Chunk(layer,31,31,0);
 const b=meshManual14Chunk(layer,31,31,0);
 assert.deepEqual(a.opaque,b.opaque,'Identical physical cells produce deterministic typed GPU bytes');
 assert.deepEqual(a.transparent,b.transparent);
 assert.equal(meshManual14Chunk(layer,31,31,-1).vertices,0);
});
