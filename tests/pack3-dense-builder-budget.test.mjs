// Pack 3 dense-construction acceptance for the coordinated five-pack builder.
// Test the REAL Pack 3 physical source AABB triangulation and per-chunk GPU cap,
// not synthetic voxel placeholders or unbounded memory / full-cube proxies.
import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK} from '../src/voxel.mjs';
import {PACK3_BUILDER_SYMBOLS,PACK3_BUILDER_IDS} from '../src/builder-assets/pack3.mjs';
import {createPack3RuntimeStage,meshPack3PhysicalAsset,PACK3_RUNTIME_CHUNK_VERTEX_LIMIT,
 PACK3_RUNTIME_LIMIT} from '../src/builder-assets/pack3-runtime.mjs';
import {PACK3_MAX_ADDED_VERTICES_PER_CHUNK} from '../src/builder-assets/pack3-live.mjs';
const world=seed=>({seed,edits:new Map(),get:()=>BLOCK.AIR});
const yawFor=(id,i)=>id<=112?0:i%4;
test('256 real shaped blueprint voxels compile across 64 separate chunks with bounded GPU uploads and exact restore',()=>{
 const w=world(179),rt=createPack3RuntimeStage(w,{worldId:'seed-179'});
 const records=[];
 for(let cz=0;cz<8;cz++)for(let cx=0;cx<8;cx++)for(let p=0;p<4;p++){
  const i=records.length,id=PACK3_BUILDER_IDS[i%17],symbol=PACK3_BUILDER_SYMBOLS[i%17];
  records.push({asset:symbol,orientation:yawFor(id,i),
   at:[cx*16+(p%2),10,cz*16+Math.floor(p/2)]});
 }
 assert.equal(records.length,256);
 assert.equal(PACK3_RUNTIME_LIMIT,4096);
 assert.equal(PACK3_MAX_ADDED_VERTICES_PER_CHUNK,PACK3_RUNTIME_CHUNK_VERTEX_LIMIT);
 assert.equal(rt.placeMany(records),256);
 assert.equal(rt.size(),256);
 const bytes=rt.serialize();
 const same=createPack3RuntimeStage(world(179),{worldId:'seed-179'});
 assert.equal(same.restore(bytes),256);
 assert.equal(same.serialize(),bytes,'Dense blueprint save must roundtrip byte-exactly');
 let totalVertices=0;
 for(let cz=0;cz<8;cz++)for(let cx=0;cx<8;cx++){
  const mesh=rt.chunkMesh(cx,cz,0,{maxVertices:PACK3_RUNTIME_CHUNK_VERTEX_LIMIT});
  const reloaded=same.chunkMesh(cx,cz,0,{maxVertices:PACK3_RUNTIME_CHUNK_VERTEX_LIMIT});
  assert.deepEqual(mesh,reloaded,'Reload must retain precisely shaped mesh geometry');
  assert.ok(mesh.length>0&&mesh.length%9===0);
  assert.ok(mesh.length/9<=PACK3_RUNTIME_CHUNK_VERTEX_LIMIT);
  totalVertices+=mesh.length/9;
 }
 assert.ok(totalVertices>256*24,'Dense structures contain actual multi-part physical geometry');
 assert.equal(rt.chunkMesh(-1,0,0).length,0);
 assert.equal(w.edits.size,0,'No canonical schema-1 world edits');
});
test('over-budget offscreen structure cannot be accepted or serialized, even without a GPU renderer',()=>{
 const rt=createPack3RuntimeStage(world(83),{worldId:'seed-83'});
 const symbol='pack3:069',yaw=1,perBlock=meshPack3PhysicalAsset(symbol,yaw).vertexCount;
 const count=Math.floor(PACK3_RUNTIME_CHUNK_VERTEX_LIMIT/perBlock)+1;
 assert.ok(count>=2&&count<=256);
 const cells=Array.from({length:count},(_,i)=>({
  asset:symbol,orientation:yaw,at:[i%16,10,Math.floor(i/16)]
 }));
 const empty=rt.serialize();
 assert.throws(()=>rt.placeMany(cells),/GPU budget/);
 assert.equal(rt.size(),0,'Rejected placement must be atomic');
 assert.equal(rt.serialize(),empty,'A rejected structure cannot become saved state');
 assert.equal(rt.placeMany(cells.slice(0,count-1)),count-1);
 const existing=rt.serialize();
 assert.throws(()=>rt.placeMany(cells.slice(count-1)),/GPU budget/);
 assert.equal(rt.size(),count-1);
 assert.equal(rt.serialize(),existing);
 assert.ok(rt.chunkMesh(0,0,0,{maxVertices:PACK3_RUNTIME_CHUNK_VERTEX_LIMIT}).length>0);
});
test('physical chunk cap is independently enforced in underground sections',()=>{
 const rt=createPack3RuntimeStage(world(92),{worldId:'seed-92'});
 const surface=Array.from({length:8},(_,i)=>({
  asset:'pack3:069',orientation:1,at:[i,10,0]
 }));
 const depth=Array.from({length:8},(_,i)=>({
  asset:'pack3:069',orientation:2,at:[i,-5,0]
 }));
 assert.equal(rt.placeMany([...surface,...depth]),16);
 const top=rt.chunkMesh(0,0,0,{maxVertices:PACK3_RUNTIME_CHUNK_VERTEX_LIMIT});
 const below=rt.chunkMesh(0,0,-1,{maxVertices:PACK3_RUNTIME_CHUNK_VERTEX_LIMIT});
 assert.ok(top.length>0&&below.length>0);
 assert.ok(top.length/9<=PACK3_RUNTIME_CHUNK_VERTEX_LIMIT);
 assert.ok(below.length/9<=PACK3_RUNTIME_CHUNK_VERTEX_LIMIT);
 assert.equal(rt.chunkMesh(0,0,-2).length,0);
});
test('bulk plan rejects any edited legacy or biome world cell without partly registering its other shapes',()=>{
 const w=world(147),rt=createPack3RuntimeStage(w,{worldId:'seed-147'});
 w.edits.set('2,10,2',BLOCK.AIR);
 const before=rt.serialize();
 assert.throws(()=>rt.placeMany([
  {asset:'pack3:069',orientation:0,at:[1,10,2]},
  {asset:'pack3:070',orientation:1,at:[2,10,2]}
 ]),/Occupied/);
 assert.equal(rt.serialize(),before);
 assert.equal(rt.size(),0);
});
