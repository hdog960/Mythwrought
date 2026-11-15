import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK} from '../src/voxel.mjs';
import {orientedParts,rotateCellOffset} from '../src/block-packs/pack-5/fixture.mjs';
import {PACK5_BUILDER_CATALOG,resolvePack5BuilderAsset} from '../src/pack5-integration/catalog.mjs';
import {createPack5ConstructionLayer} from '../src/pack5-integration/construction-layer.mjs';
import {createPack5GpuStream,PACK5_GPU_RESIDENT_BYTES,PACK5_GPU_PAGE_BYTES} from '../src/pack5-integration/terrain-buffer.mjs';
const key=c=>c.join(',');
function mixedRoom(){
  const blocks=new Set(),world={seed:853,get(...p){return blocks.has(key(p))?BLOCK.STONE:BLOCK.AIR;}};
  const layer=createPack5ConstructionLayer(world);
  for(let i=0;i<36;i++){
    const family=PACK5_BUILDER_CATALOG[Math.floor(i/2)];
    const variant=family.variants[i%2],rotation=i%4;
    const anchor=[(i%6)*4,5,Math.floor(i/6)*4];
    const {descriptor}=resolvePack5BuilderAsset(family.symbolicId,variant);
    const parts=orientedParts(descriptor,rotation);
    if(descriptor.attachment==='floor')
      for(const part of parts)blocks.add(key([anchor[0]+part.cell[0],4+part.cell[1],anchor[2]+part.cell[2]]));
    else if(descriptor.attachment==='wall'){
      const back=rotateCellOffset([0,0,-1],rotation);
      blocks.add(key(anchor.map((v,j)=>v+back[j])));
    }else if(descriptor.attachment==='ceiling')blocks.add(key([anchor[0],anchor[1]+1,anchor[2]]));
    const result=layer.place(family.symbolicId,anchor,rotation,variant);
    assert.equal(result.ok,true,'mixed placement '+i+' '+family.symbolicId+' '+variant+': '+result.reason);
  }
  return {world,layer};
}
function glMock(){
  const uploads=[],draws=[],deleted=[];
  return {uploads,draws,deleted,ARRAY_BUFFER:34962,STATIC_DRAW:35044,FLOAT:5126,
    TRIANGLES:4,NO_ERROR:0,createBuffer(){return {};},deleteBuffer(b){deleted.push(b);},
    getError(){return 0;},bindBuffer(){},bufferData(_t,data){uploads.push(data.byteLength);},
    vertexAttribPointer(){},drawArrays(_t,_start,count){draws.push(count);}};
}
test('all 36 real variants fit a dense mixed room and keep GPU residency/page upload strictly bounded',()=>{
  const {layer}=mixedRoom(),gl=glMock();
  assert.equal(layer.count(),36);
  const stream=createPack5GpuStream(gl,layer);
  for(let i=0;i<40;i++)stream.refresh([11,5,11],1000+i*1000);
  const s=stream.stats();
  assert.ok(s.instances>0&&s.instances<=36);
  assert.equal(s.visibleCandidates,36,'All authored families were in draw range');
  assert.equal(s.pendingPages,0,'Selected pages must finish streaming');
  assert.equal(s.uploadFailures,0);
  assert.ok(s.bytes<=PACK5_GPU_RESIDENT_BYTES);
  assert.ok(s.pages<=8);
  assert.ok(s.maxUploadedPageBytes<=PACK5_GPU_PAGE_BYTES,
    'An oversized individual source model must not bypass the per-page budget');
  assert.ok(gl.uploads.every(b=>b<=PACK5_GPU_PAGE_BYTES));
  assert.equal(s.instances+s.budgetExcluded,36);
  const n=stream.draw({atPos:0,atColor:1,atUv:2,atMat:3});
  assert.ok(n>0&&stream.stats().drawCalls<=8);
  const uploads=gl.uploads.length;
  stream.refresh([11.1,5,11.1],45000);
  assert.equal(gl.uploads.length,uploads,'Same mixed room must keep cached buffers');
  stream.dispose();
});
