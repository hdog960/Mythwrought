import test from 'node:test';import assert from 'node:assert/strict';
import {UpperMeshPages,UPPER_PAGE_BYTES} from '../src/world-height-mesh-pages.mjs';
import {UPPER_SECTION_BYTES,UPPER_STAGE_BYTES,createUpperBatchBuilder} from '../src/world-height-budget.mjs';
import {physicalBodyRegions} from '../src/world-height.mjs';
import {VoxelWorld,meshChunk} from '../src/voxel.mjs';
test('four triangle-aligned source pages retain exact order and original section cap',()=>{
 const pages=new UpperMeshPages(),total=UPPER_SECTION_BYTES/36;
 for(let i=0;i<total;i++)pages.append(i,256,-i,1,.5,0,0,1,3);
 assert.equal(pages.pageCount,4);assert.equal(pages.vertexCount,total);
 assert.throws(()=>pages.append(0,256,0,0,0,0,0,0,3),/budget/);
 const out=pages.finish();assert.equal(out.byteLength,UPPER_SECTION_BYTES);
 for(let i=0;i<total;i++)assert.deepEqual([...out.subarray(i*9,i*9+9)],[i,256,-i,1,.5,0,0,1,3]);
 assert.equal(UPPER_PAGE_BYTES,221184);
});
test('resident staging rejects overflow before retaining third owner',()=>{
 const stage=createUpperBatchBuilder(k=>k!=='unloaded'),verts=new Float32Array(UPPER_SECTION_BYTES/4),water=new Float32Array();
 for(const key of ['a','unloaded','b'])stage.add({key,section:1,vertices:verts,water});
 assert.equal(stage.staged,2*UPPER_SECTION_BYTES);assert.equal(stage.finish().length,2);
 assert.throws(()=>stage.add({key:'c',section:1,vertices:verts,water}),/staging budget/);
 assert.equal(stage.finish().length,2);assert.ok(stage.staged<=UPPER_STAGE_BYTES);
});
test('unsafe horizontal extent fails closed and dense geometry cannot bypass cap',()=>{
 assert.equal(physicalBodyRegions({x:1e30,z:0,feet:20}),null);
 const w=new VoxelWorld(179);
 for(let x=0;x<16;x++)for(let z=0;z<16;z++)for(let y=20;y<36;y++)if((x+y+z)%2===0)w.set(x,y,z,3);
 assert.throws(()=>meshChunk(w,0,0,1),/budget/);
});
