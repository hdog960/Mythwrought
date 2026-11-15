import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK} from '../src/voxel.mjs';
import {orientedParts,rotateCellOffset} from '../src/block-packs/pack-5/fixture.mjs';
import {PACK5_BUILDER_CATALOG,resolvePack5BuilderAsset} from '../src/pack5-integration/catalog.mjs';
import {createPack5ConstructionLayer} from '../src/pack5-integration/construction-layer.mjs';
import {createPack5GpuStream,PACK5_GPU_RESIDENT_BYTES,PACK5_GPU_PAGE_BYTES} from '../src/pack5-integration/terrain-buffer.mjs';
import {savePack5SidecarSafe,loadPack5SidecarSafe} from '../src/pack5-integration/sidecar-storage.mjs';
const key=v=>v.join(',');
function mixedSettlement(count=512){
  const support=new Set();
  const world={seed:917,get(...v){return support.has(key(v))?BLOCK.STONE:BLOCK.AIR;}};
  const layer=createPack5ConstructionLayer(world);
  for(let i=0;i<count;i++){
    const family=PACK5_BUILDER_CATALOG[i%18],variant=family.variants[Math.floor(i/18)%2];
    const rotation=i%4,anchor=[(i%24)*5,5,Math.floor(i/24)*5];
    const {descriptor}=resolvePack5BuilderAsset(family.symbolicId,variant);
    if(descriptor.attachment==='floor')
      for(const part of orientedParts(descriptor,rotation)){
        const p=part.cell.map((n,j)=>n+anchor[j]);
        support.add(key([p[0],p[1]-1,p[2]]));
      }
    else if(descriptor.attachment==='wall'){
      const backing=rotateCellOffset([0,0,-1],rotation);
      support.add(key(anchor.map((v,j)=>v+backing[j])));
    }else if(descriptor.attachment==='ceiling')
      support.add(key([anchor[0],anchor[1]+1,anchor[2]]));
    const outcome=layer.place(family.symbolicId,anchor,rotation,variant);
    assert.equal(outcome.ok,true,'Mixed settlement instance '+i+' '+family.symbolicId+': '+outcome.reason);
  }
  return {layer,world};
}
function fakeGl(){
  let allocated=0;
  const live=new Set(),uploads=[],draws=[];
  return {live,uploads,draws,ARRAY_BUFFER:34962,STATIC_DRAW:35044,FLOAT:5126,
    TRIANGLES:4,NO_ERROR:0,
    createBuffer(){const v={id:++allocated};live.add(v);return v;},
    deleteBuffer(v){assert.equal(live.delete(v),true,'GPU buffer deleted more than once');},
    getError(){return 0;},bindBuffer(){},
    bufferData(_target,v){uploads.push(v.byteLength);},
    vertexAttribPointer(){},drawArrays(_mode,_start,count){draws.push(count);}
  };
}
test('512 mixed physical furnishings preserve 36 variants across independent sidecar restore',()=>{
  const {world,layer}=mixedSettlement();
  assert.equal(layer.count(),512);
  const variants=new Set(layer.list().map(v=>v.symbolicId+'/'+v.variant));
  assert.equal(variants.size,36);
  const raw=JSON.stringify(layer.snapshot()),map=new Map();
  const storage={getItem:k=>map.has(k)?map.get(k):null,
    setItem(k,v){map.set(k,v);},removeItem(k){map.delete(k);}};
  assert.equal(savePack5SidecarSafe(storage,layer).count,512);
  assert.ok(raw.length<2*1024*1024,'512 mixed pieces exceed sidecar byte budget');
  const replacement=createPack5ConstructionLayer(world);
  assert.equal(loadPack5SidecarSafe(storage,replacement).count,512);
  assert.equal(JSON.stringify(replacement.snapshot()),raw);
  assert.equal(world.get(0,5,0),BLOCK.AIR,'No legacy voxel was ever registered or mutated');
});
test('moving camera through 512 mixed furnishings keeps page uploads, residency, draw calls and buffers bounded',()=>{
  const {layer}=mixedSettlement(),gl=fakeGl(),stream=createPack5GpuStream(gl,layer);
  const eyes=[[12,5,12],[45,5,22],[77,5,56],[110,5,90],[15,5,90]];
  let now=1000,seen=0,max=0;
  for(const eye of eyes){
    for(let i=0;i<25;i++)stream.refresh(eye,now+=1000);
    const s=stream.stats();seen+=s.instances;max=Math.max(max,s.instances);
    assert.ok(s.bytes<=PACK5_GPU_RESIDENT_BYTES);
    assert.ok(s.pages<=8&&s.pendingPages===0,'Mixed-family streaming did not settle');
    assert.ok(s.instances<=256);
    assert.ok(s.maxUploadedPageBytes<=PACK5_GPU_PAGE_BYTES);
    assert.equal(s.instances+s.budgetExcluded,s.visibleCandidates,
      'No mixed-family furnishing vanishes from GPU budget accounting');
    const vertices=stream.draw({atPos:0,atColor:1,atUv:2,atMat:3});
    assert.ok(vertices>0);
    assert.ok(stream.stats().drawCalls<=8);
    assert.ok(gl.live.size<=8,'GPU buffer count exceeded page ceiling');
  }
  assert.ok(seen>30&&max>0);
  assert.ok(gl.uploads.every(bytes=>bytes<=PACK5_GPU_PAGE_BYTES));
  stream.dispose();
  assert.equal(gl.live.size,0,'Renderer disposal leaked a physical mesh buffer');
  assert.equal(stream.stats().bytes,0);
});

// Every approved variant at every rotation must fit a single page.
test('all 144 authored variants and rotations fit the mobile GPU page limit',async()=>{
  const {pack5TerrainVertices}=await import('../src/pack5-integration/terrain-buffer.mjs');
  let maximum=0;
  for(const family of PACK5_BUILDER_CATALOG)for(const variant of family.variants)
    for(let rot=0;rot<4;rot++){
      const asset=resolvePack5BuilderAsset(family.symbolicId,variant);
      const bytes=pack5TerrainVertices(asset.mesh(asset.descriptor,{rotation:rot})).byteLength;
      maximum=Math.max(maximum,bytes);
      assert.ok(bytes>0&&bytes<=PACK5_GPU_PAGE_BYTES,
        family.symbolicId+'/'+variant+'/'+rot+' requires '+bytes+' bytes');
    }
  assert.ok(maximum>0);
});
test('oversize under reduced page budget is accounted without exceeding upload limit',()=>{
  const {layer}=mixedSettlement(1),gl=fakeGl();
  const stream=createPack5GpuStream(gl,layer,{pageBytes:1024});
  stream.refresh([.5,5,.5],1000);
  const s=stream.stats();
  assert.equal(s.instances,0);
  assert.equal(s.oversizedInstances,1);
  assert.equal(s.visibleCandidates,1);
  assert.equal(s.budgetExcluded,1);
  assert.equal(s.bytes,0);
  assert.equal(s.pendingPages,0);
  assert.equal(gl.uploads.length,0);
  assert.equal(layer.count(),1);
  stream.dispose();
});
test('GPU replacement never transiently allocates past the resident byte budget',()=>{
  const {layer}=mixedSettlement(64);
  const live=new Map(),bound={current:null},gl={
    ARRAY_BUFFER:34962,STATIC_DRAW:35044,FLOAT:5126,TRIANGLES:4,NO_ERROR:0,
    createBuffer(){const ref={};live.set(ref,0);return ref;},
    deleteBuffer(ref){assert.ok(live.delete(ref));},
    getError(){return 0;},
    bindBuffer(_target,ref){bound.current=ref;},
    bufferData(_target,data){
      live.set(bound.current,data.byteLength);
      const occupied=[...live.values()].reduce((a,b)=>a+b,0);
      assert.ok(occupied<=PACK5_GPU_RESIDENT_BYTES,'Peak live GPU bytes exceeded cap: '+occupied);
    },
    vertexAttribPointer(){},drawArrays(){}
  };
  const stream=createPack5GpuStream(gl,layer);
  for(let i=0;i<30;i++)stream.refresh([12,5,12],1000+i*1000);
  const first=layer.list()[0];
  assert.equal(layer.remove(first.anchor),true);
  // Rotating this furnishing might require backing that was never authored.
  // Exercise a genuine page replacement by removing and then restoring the
  // same supported source geometry, with a refresh between those changes.
  for(let i=0;i<20;i++)stream.refresh([12,5,12],40000+i*1000);
  assert.equal(layer.place(first.symbolicId,first.anchor,first.rotation,first.variant).ok,true);
  for(let i=0;i<20;i++)stream.refresh([12,5,12],70000+i*1000);
  assert.ok(stream.stats().bytes<=PACK5_GPU_RESIDENT_BYTES);
  stream.dispose();
  assert.equal(live.size,0);
});
