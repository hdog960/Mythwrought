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
