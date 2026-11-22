import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SKY_MESH_FLOATS_PER_VERTEX,SKY_MESH_VERTEX_BYTES,SKY_MESH_MAX_VERTICES,
  createSkyIslandSourceView,meshSkyIslandSection,prepareSkyIslandSectionBatch
} from '../../src/floating-islands/sky-source-mesh.mjs';
const key=(x,y,z)=>`${x},${y},${z}`;
const color=[.55,.68,.36];
const shapeFor=id=>({cube:true,opaque:id!==7});
const appearanceFor=id=>({color,mat:id});
const makeHost=(blocks=new Map(),edits=new Map())=>{
  const reads={ground:0,sky:0};
  const source=createSkyIslandSourceView({
    groundGet(x,y,z){reads.ground++;return y===19?3:0;},
    skyGet(x,y,z){reads.sky++;return blocks.get(key(x,y,z))??0;},
    skyEdits:edits
  });
  return {reads,source,shapeFor,appearanceFor};
};
const cube=(x,y,z,id=3)=>new Map([[key(x,y,z),id]]);
const mesh=(host,cx=0,cz=0,section=0)=>meshSkyIslandSection({...host,cx,cz,section});

test('single physical cube renders six faces using unchanged WebGL2 36-byte stride',()=>{
  const r=mesh(makeHost(cube(3,21,4)));
  assert.equal(r.solidCount,1);assert.equal(r.exposedFaces,6);
  assert.equal(r.vertexCount,36);assert.equal(r.triangles,12);
  assert.equal(r.bytes,36*SKY_MESH_VERTEX_BYTES);
  assert.equal(r.vertices.length,36*SKY_MESH_FLOATS_PER_VERTEX);
  assert.equal(r.vertices[8],3);
  assert.equal(r.stagedOnly,true);assert.equal(r.sourceAuthoritative,true);
});

test('horizontal chunk seam occludes internal faces on both sides',()=>{
  const cells=new Map([[key(15,24,5),3],[key(16,24,5),3]]);
  const host=makeHost(cells);
  const west=mesh(host,0,0,0),east=mesh(host,1,0,0);
  assert.equal(west.exposedFaces,5);assert.equal(east.exposedFaces,5);
  assert.equal(west.vertexCount+east.vertexCount,60);
});

test('vertical Y35/36 seam hides internal faces across two sky sections',()=>{
  const host=makeHost(new Map([[key(5,35,7),3],[key(5,36,7),3]]));
  const lower=mesh(host,0,0,0),upper=mesh(host,0,0,1);
  assert.equal(lower.exposedFaces,5);assert.equal(upper.exposedFaces,5);
  assert.equal(lower.section,0);assert.equal(upper.section,1);
});

test('original world Y19 surface authority occludes upper Y20 cube bottom',()=>{
  const host=makeHost(cube(5,20,5));
  const upper=mesh(host);
  assert.equal(upper.exposedFaces,5);assert.ok(host.reads.ground>0);
});

test('upper edit AIR=0 wins over original seed without altering ground or input map',()=>{
  const cells=cube(5,24,5),edits=new Map([[key(5,24,5),0]]);
  const host=makeHost(cells,edits);
  assert.equal(host.source.get(5,24,5),0);assert.equal(host.source.get(5,19,5),3);
  assert.equal(mesh(host).vertexCount,0);
  assert.equal(cells.get(key(5,24,5)),3);assert.equal(edits.get(key(5,24,5)),0);
});

test('upper edit placement becomes visible and remains identical on remesh',()=>{
  const host=makeHost(new Map(),new Map([[key(-1,140,-1),7]]));
  const a=mesh(host,-1,-1,7),b=mesh(host,-1,-1,7);
  assert.deepEqual(a.vertices,b.vertices);
  assert.equal(a.vertexCount,36);assert.equal(a.bytes,b.bytes);
});

test('full dense section stays within safe byte budget and hides internal faces',()=>{
  const source={get(x,y,z){return x>=0&&x<16&&z>=0&&z<16&&y>=21&&y<=35?3:0;}};
  const result=mesh({source,shapeFor,appearanceFor});
  // 16x16x15 rectangular block; six surfaces, only exterior quads.
  assert.equal(result.solidCount,16*16*15);
  assert.equal(result.exposedFaces,2*16*16+4*16*15);
  assert.equal(result.vertexCount,result.exposedFaces*6);
  assert.ok(result.bytes<SKY_MESH_MAX_VERTICES*SKY_MESH_VERTEX_BYTES);
  assert.ok(result.sourceReads<=18*18*18);
});

test('world-coordinate mesh deterministic beyond 10k, independent of load order',()=>{
  const host=makeHost(new Map([[key(12005,70,-12801),3],[key(12006,70,-12801),7]]));
  const a=mesh(host,750,-801,3),b=mesh(host,750,-801,3);
  assert.equal(a.solidCount,2);
  assert.deepEqual(a.vertices,b.vertices);
});

test('fail closed on invalid world IDs and unsupported shaped blocks',()=>{
  const source={get:()=>65535};
  assert.throws(()=>mesh({source,shapeFor,appearanceFor}),/invalid voxel ID/);
  const host=makeHost(cube(6,24,6,9));
  assert.throws(()=>mesh({...host,shapeFor:id=>({cube:id!==9,opaque:true})}),/shaped-geometry/);
});

test('fail closed on malformed color/material and unsafe chunk coordinates',()=>{
  const host=makeHost(cube(6,24,6));
  assert.throws(()=>mesh({...host,appearanceFor:()=>({color:[1,-.1,0],mat:3})}),/appearance/);
  assert.throws(()=>meshSkyIslandSection({...host,cx:Number.MAX_SAFE_INTEGER,cz:0,section:0}),/unsafe/);
});

test('no fragmentary mesh returned when configured vertex budget exceeded',()=>{
  const host=makeHost(cube(6,24,6));
  assert.throws(()=>meshSkyIslandSection({...host,cx:0,cz:0,section:0,maxVertices:6}),/budget/);
});

test('two genuine source meshes staged as one atomic read-only batch',()=>{
  const host=makeHost(new Map([[key(5,22,5),3],[key(21,22,5),3]]));
  const r=prepareSkyIslandSectionBatch({...host,jobs:[
    {cx:0,cz:0,section:0},{cx:1,cz:0,section:0}]});
  assert.equal(r.meshes.length,2);assert.equal(r.totalBytes,2*36*36);
  assert.equal(r.published,false);assert.equal(r.requiresAtomicGpuCommit,true);
});

test('batch rejects second-stage over-budget without exposing partial result',()=>{
  const host=makeHost(new Map([[key(5,22,5),3],[key(21,22,5),3]]));
  assert.throws(()=>prepareSkyIslandSectionBatch({...host,jobs:[
    {cx:0,cz:0,section:0},{cx:1,cz:0,section:0}],maxBatchBytes:2000}),/staging bytes/);
  assert.throws(()=>prepareSkyIslandSectionBatch({...host,jobs:[
    {cx:0,cz:0,section:0},{cx:0,cz:0,section:0}]}),/duplicate/);
  assert.throws(()=>prepareSkyIslandSectionBatch({...host,jobs:[
    {cx:0,cz:0,section:0},{cx:1,cz:0,section:0},{cx:2,cz:0,section:0}]}),/at most two/);
});

test('no fake ground shadow work or GPU allocations when preparing source meshes',()=>{
  const host=makeHost(cube(3,21,4));
  const res=mesh(host);
  assert.ok(!Object.hasOwn(res,'shadowBuffer'));
  assert.ok(!Object.hasOwn(res,'gpuBuffer'));
  assert.ok(!Object.hasOwn(res,'commit'));
});
