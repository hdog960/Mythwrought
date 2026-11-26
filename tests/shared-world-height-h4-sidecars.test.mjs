import test from 'node:test';import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,collides,raycast} from '../src/voxel.mjs';
import {Pack2LiveWorld} from '../src/pack2-world.mjs';
import {createPack3LiveBridge,combinePack3ChunkMesh} from '../src/builder-assets/pack3-live.mjs';
import {createManual14SavedBridge} from '../src/builder-assets/manual14-layer.mjs';
import {meshManual14Chunk} from '../src/builder-assets/manual14-mesh.mjs';
import {MANUAL_FIVE_PACK_CATALOG} from '../src/builder-assets/manual-five-pack.mjs';
import {upperOccupancy,upperOccupancyRevision,runtimeMeshKey} from '../src/world-height.mjs';
import {validateUpperSectionGeometry,UPPER_SECTION_BYTES} from '../src/world-height-budget.mjs';
function storage(){const m=new Map();return {getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)};}
function host(base=new VoxelWorld(179),s=storage()){const w=new Pack2LiveWorld(base),p=createPack3LiveBridge(w,s),m=createManual14SavedBridge(w,s);w.manual14Layer=m.layer;w.manual14Collision=box=>m.collision(box);return {w,p,m,s};}
test('reproduce exact real game cross-pack ceiling exception and fix without bypass',()=>{
 const {w,p,m}=host();
 assert.equal(p.getAt(0,252,0),null);assert.equal(p.getAt(0,257,0),null);
 assert.equal(w.set(0,252,0,3),true);assert.equal(w.set(0,256,0,3),true);
 assert.equal(w.set(0,257,0,3),false);assert.equal(m.supportsLegacyCell([0,256,0]),false);
});
test('actual Pack3 upper shape uses correct signed owner, collision, ray, storage and rollback',()=>{
 const {w,p,s}=host();const cell=[-16,256,0],key='sky:-1,0,14';
 const before=upperOccupancyRevision(w);
 const player={x:30,feet:250,z:30},rebuild=()=>{};
 assert.ok(p.mutate({mode:'place',cell,id:116,orientation:0,player,rebuild}).ok);
 assert.ok(upperOccupancy(w,key));assert.notEqual(upperOccupancyRevision(w),before);
 assert.ok(p.runtime.chunkMesh(-1,0,15).length>0);assert.equal(p.runtime.chunkMesh(-1,0,0).length,0);
 assert.equal(w.set(...cell,3),false);assert.deepEqual(raycast(w,[-15.5,256.1,-2],[0,0,1]).hit,cell);
 const raw=s.getItem(p.key);const cold=host(VoxelWorld.restore(w.save()),s);
 assert.equal(cold.p.getAt(...cell).id,116);assert.ok(upperOccupancy(cold.w,key));
 assert.deepEqual(cold.p.runtime.chunkMesh(-1,0,15),p.runtime.chunkMesh(-1,0,15));
 const failed=p.mutate({mode:'mine',cell,rebuild:()=>{throw Error('GPU refused');}});
 assert.equal(failed.ok,false);assert.equal(s.getItem(p.key),raw);assert.ok(upperOccupancy(w,key));
 assert.ok(p.mutate({mode:'mine',cell,rebuild}).ok);assert.equal(upperOccupancy(w,key),false);
});
test('original Pack1 and Pack4 upper sidecars mesh and restore, enforce support and ceiling',()=>{
 const {w,m,s}=host(),a=MANUAL_FIVE_PACK_CATALOG.find(x=>x.numericId===9),b=MANUAL_FIVE_PACK_CATALOG.find(x=>x.numericId===163),glass=MANUAL_FIVE_PACK_CATALOG.find(x=>x.numericId===159);
 assert.ok(w.set(-12,256,1,3));
 const rows=[{asset:a.symbol,numericId:9,at:[-16,256,0]},{asset:b.symbol,numericId:163,at:[-12,256,0],orientation:0},{asset:glass.symbol,numericId:159,at:[-10,256,0],orientation:0}];
 assert.ok(m.placeMany(rows).ok);
 const key='sky:-1,0,14';assert.ok(upperOccupancy(w,key));assert.ok(m.supportsLegacyCell([-12,256,1]));
 const mesh=meshManual14Chunk(m.layer,-1,0,15);assert.equal(mesh.instances,3);
 assert.ok(mesh.opaque.length>0);assert.ok(mesh.transparent.length>0);
 assert.equal(w.set(-16,256,0,3),false);
 const cold=host(VoxelWorld.restore(w.save()),s);assert.equal(cold.m.layer.size(),3);
 assert.deepEqual(meshManual14Chunk(cold.m.layer,-1,0,15),mesh);
 assert.equal(m.placeMany([{asset:a.symbol,numericId:9,at:[-16,257,0]}]).ok,false);
});
test('combined section geometry cap includes water and shaped assets',()=>{
 const a=new Float32Array(UPPER_SECTION_BYTES/4),b=new Float32Array(9);
 assert.equal(validateUpperSectionGeometry(a,new Float32Array()),UPPER_SECTION_BYTES);
 assert.throws(()=>validateUpperSectionGeometry(a,b),/864 KiB/);
});
