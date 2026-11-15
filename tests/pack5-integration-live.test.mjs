import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,collides} from '../src/voxel.mjs';
import {createPack5ConstructionLayer} from '../src/pack5-integration/construction-layer.mjs';
import {createPack5LiveAdapter} from '../src/pack5-integration/live-adapter.mjs';
import {pack5TerrainVertices,createPack5GpuStream} from '../src/pack5-integration/terrain-buffer.mjs';
import {pack5SidecarKey,loadPack5SidecarSafe,savePack5SidecarSafe} from '../src/pack5-integration/sidecar-storage.mjs';
const store=()=>{const m=new Map();return {m,getItem:k=>m.has(k)?m.get(k):null,setItem(k,v){m.set(k,v);}};};
const plainWorld=(seed=7)=>{const m=new Map();return {seed,get(x,y,z){return m.get([x,y,z].join(','))??0;},
  set(x,y,z,id){m.set([x,y,z].join(','),id);return true;}};};
function mockGl(){
  const deleted=[],draws=[],uploads=[];
  return {ARRAY_BUFFER:34962,STATIC_DRAW:35044,FLOAT:5126,TRIANGLES:4,NO_ERROR:0,
    deleted,draws,uploads,createBuffer(){return {};},deleteBuffer(v){deleted.push(v);},
    getError(){return 0;},bindBuffer(){},bufferData(_target,data){uploads.push(data);},
    vertexAttribPointer(){},drawArrays(...args){draws.push(args);}};
}
test('production 9-float pipeline packs authentic indexed shape triangles without cube impostors',()=>{
  const layer=createPack5ConstructionLayer(plainWorld());
  assert.equal(layer.place('pack5:080',[0,4,0]).ok,true);
  const mesh=layer.meshAt([0,4,0]),packed=pack5TerrainVertices(mesh);
  assert.equal(packed.length,mesh.indices.length*9);
  for(let i=0;i<mesh.indices.length;i++){
    const index=mesh.indices[i],a=index*3,b=i*9;
    assert.deepEqual([...packed.slice(b,b+3)],[...mesh.positions.slice(a,a+3)]);
    assert.equal(packed[b+8],0);
  }
  assert.throws(()=>pack5TerrainVertices({...mesh,indices:[99999,2,3]}));
  assert.throws(()=>pack5TerrainVertices({...mesh,positions:new Float32Array([NaN,0,0])}));
});
test('bounded GL overlay uses one game-pipeline draw and does not reupload unchanged geometry',()=>{
  const gl=mockGl(),layer=createPack5ConstructionLayer(plainWorld());
  layer.place('pack5:080',[0,4,0]);
  layer.place('pack5:080',[100,4,0]);
  const stream=createPack5GpuStream(gl,layer,{maxInstances:2,maxDistance:40});
  assert.equal(stream.refresh([.5,4,3]),true);
  assert.equal(stream.stats().instances,1);
  assert.equal(gl.uploads.length,1);
  assert.equal(stream.refresh([.5,4,3]),false);
  const n=stream.draw({atPos:0,atColor:1,atUv:2,atMat:3});
  assert.ok(n>0);
  assert.equal(gl.draws.length,1);
  assert.equal(gl.draws[0][0],gl.TRIANGLES);
  layer.place('pack5:080',[2,4,0]);
  assert.equal(stream.refresh([.5,4,3]),true);
  assert.equal(stream.stats().instances,2);
  assert.equal(gl.deleted.length,1);
  stream.dispose();
  assert.equal(gl.deleted.length,2);
  assert.equal(stream.stats().vertices,0);
});
test('independent Pack 5 checksum sidecar survives new world/session without touching schema-1 saves',()=>{
  const storage=store(),w=new VoxelWorld(179),before=JSON.stringify(w.save());
  const first=createPack5ConstructionLayer(w);
  assert.equal(first.place('pack5:080',[0,19,0]).ok,true);
  const saved=savePack5SidecarSafe(storage,first),key=pack5SidecarKey(w.seed);
  assert.equal(saved.count,1);
  assert.ok(storage.getItem(key+'.journal'));
  const next=createPack5ConstructionLayer(w);
  assert.equal(loadPack5SidecarSafe(storage,next).count,1);
  assert.deepEqual(next.snapshot(),first.snapshot());
  assert.equal(JSON.stringify(w.save()),before);
  assert.equal(w.save().schema,1);
  assert.ok([...storage.m.keys()].every(k=>k.startsWith(key)));
});
test('malformed and cross-seed sidecars fail closed and do not destroy original or current placements',()=>{
  const s=store(),a=createPack5ConstructionLayer(plainWorld());
  a.place('pack5:080',[0,4,0]);
  savePack5SidecarSafe(s,a);
  const key=pack5SidecarKey(7),raw=s.getItem(key);
  const b=createPack5ConstructionLayer(plainWorld(8));
  assert.equal(loadPack5SidecarSafe(s,b).count,0);
  assert.deepEqual(b.snapshot().entries,[]);
  s.setItem(key,'{invalid');
  assert.throws(()=>savePack5SidecarSafe(s,a));
  assert.equal(s.getItem(key),'{invalid');
  assert.equal(a.count(),1);
  s.setItem(key+'.journal','bad-checksum');
  assert.throws(()=>loadPack5SidecarSafe(s,createPack5ConstructionLayer(plainWorld())));
  s.setItem(key,raw);
});
test('live action mode never mines legacy ID 0–8 voxels, and refuses placement inside player',()=>{
  const w=plainWorld();
  w.set(0,3,0,BLOCK.STONE);
  const a=createPack5LiveAdapter(w);
  const eye=[.5,4.5,2],aim=[0,-1,-2];
  assert.equal(a.removeFacing(eye,aim).ok,false);
  assert.equal(w.get(0,3,0),BLOCK.STONE);
  const inspect=a.inspect([.5,5.5,.5],[0,-1,0]);
  assert.deepEqual(inspect.adjacent,[0,4,0]);
  const blocked=a.placeFacing([.5,5.5,.5],[0,-1,0],'pack5:080',0,null,{x:.5,feet:4,z:.5});
  assert.equal(blocked.ok,false);
  assert.equal(a.layer.count(),0);
  const placed=a.placeFacing([.5,5.5,.5],[0,-1,0],'pack5:080',0,null,{x:5,feet:4,z:5});
  assert.equal(placed.ok,true);
  assert.equal(w.get(0,4,0),BLOCK.AIR);
  assert.equal(a.layer.count(),1);
});
test('save failure rolls back Pack 5 placement without editing base world bytes',()=>{
  const s=store(),w=plainWorld();
  w.set(0,3,0,BLOCK.STONE);
  const a=createPack5LiveAdapter(w,{storage:s});
  s.setItem(pack5SidecarKey(7),'CORRUPT');
  const res=a.placeFacing([.5,5.5,.5],[0,-1,0],'pack5:080',0,null,{x:5,feet:4,z:5});
  assert.equal(res.ok,false);
  assert.equal(a.layer.count(),0);
  assert.equal(w.get(0,3,0),BLOCK.STONE);
  assert.equal(s.getItem(pack5SidecarKey(7)),'CORRUPT');
});

test('failed canonical write is compensated so next reload cannot resurrect rejected furniture',()=>{
  const s=store(),w=plainWorld(),layer=createPack5ConstructionLayer(w);
  s.removeItem=k=>s.m.delete(k);
  layer.place('pack5:080',[0,4,0]);
  savePack5SidecarSafe(s,layer);
  const key=pack5SidecarKey(7),old=JSON.stringify(layer.snapshot()),oldJournal=s.getItem(key+'.journal');
  layer.place('pack5:080',[4,4,0]);
  const originalSet=s.setItem;let fail=true;
  s.setItem=(k,v)=>{
    if(k===key&&fail){fail=false;throw Error('Injected primary write failure');}
    return originalSet(k,v);
  };
  assert.throws(()=>savePack5SidecarSafe(s,layer),/previous sidecar and journal verified intact/);
  assert.equal(s.getItem(key),old);
  assert.equal(s.getItem(key+'.journal'),oldJournal);
  const restored=createPack5ConstructionLayer(w);
  assert.equal(loadPack5SidecarSafe(s,restored).count,1);
  assert.equal(JSON.stringify(restored.snapshot()),old);
});
test('explicit Pack 5 import rejects cross-seed and conflict without consent, preserves backup',()=>{
  const s=store(),w=plainWorld(),a=createPack5LiveAdapter(w,{storage:s});
  a.layer.place('pack5:080',[0,4,0]);
  a.save();
  const old=JSON.stringify(a.snapshot()),key=pack5SidecarKey(7);
  const fixture=createPack5ConstructionLayer(w);
  fixture.place('pack5:080',[4,4,0],2);
  const raw=JSON.stringify(fixture.snapshot());
  assert.throws(()=>a.importJson(raw),/confirmation/);
  assert.throws(()=>a.importJson(JSON.stringify({...fixture.snapshot(),seed:8}),{confirmReplace:true}),/sidecar/);
  assert.throws(()=>a.importJson(raw,{confirmReplace:true,playerBox:[4,4,0,5,6,1]}),/overlaps/);
  assert.equal(JSON.stringify(a.snapshot()),old);
  const accepted=a.importJson(raw,{confirmReplace:true});
  assert.equal(accepted.count,1);
  assert.deepEqual(a.snapshot(),fixture.snapshot());
  assert.equal(s.getItem(key+'.backup'),old);
  assert.equal(loadPack5SidecarSafe(s,createPack5ConstructionLayer(w)).count,1);
});

test('2048 placed physical objects retain bounded draw budgets and shape selection',()=>{
  const w=plainWorld(7),layer=createPack5ConstructionLayer(w);
  const total=2048;
  for(let i=0;i<total;i++){
    const at=[(i%64)*3,4,Math.floor(i/64)*3];
    assert.equal(layer.place('pack5:080',at,i%4).ok,true,'position '+i);
  }
  assert.equal(layer.count(),total);
  const snapshot=layer.snapshot();
  assert.equal(snapshot.entries.length,total);
  const restored=createPack5ConstructionLayer(w);
  assert.equal(restored.restore(snapshot),true);
  assert.equal(restored.count(),total);
  const ray=restored.raycast([.5,4.5,2],[0,0,-4],6);
  assert.equal(ray?.symbolicId,'pack5:080');
  assert.ok(ray.distance>=1&&ray.distance<=2);
  assert.equal(restored.collidesPack5([.45,4.4,.45,.55,4.6,.55]),true);
  assert.equal(restored.collidesPack5([500,4,500,500.2,4.2,500.2]),false);
  const gl=mockGl(),stream=createPack5GpuStream(gl,restored);
  assert.equal(stream.refresh([.5,4.5,2]),true);
  assert.ok(stream.stats().instances>0&&stream.stats().instances<=16);
  assert.ok(stream.stats().bytes<=2*1024*1024);
  assert.equal(gl.uploads.length,1);
  assert.ok(stream.draw({atPos:0,atColor:1,atUv:2,atMat:3})>0);
  stream.dispose();
  assert.equal(gl.deleted.length,1);
});
