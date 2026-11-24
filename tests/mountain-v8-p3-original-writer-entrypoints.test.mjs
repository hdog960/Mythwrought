// Exact original source writer census and genuine owner rollback probes.
// No production imports of this test, persistent storage, actual GL or V8 IDs.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const root=process.env.MYTHWROUGHT_P3_MAIN_ROOT;
if(!root)throw Error('Pinned original main checkout required');
const manifest=JSON.parse(readFileSync(new URL('../docs/mountain-v8/V8_P3_ORIGINAL_WRITER_ENTRYPOINTS_MANIFEST_20261123.json',import.meta.url),'utf8'));
const read=p=>readFileSync(path.join(root,p),'utf8');
const blob=s=>createHash('sha1').update('blob '+Buffer.byteLength(s)+'\0').update(s).digest('hex');
const main=p=>import(pathToFileURL(path.join(root,p)).href);
const [{VoxelWorld,BLOCK},{Pack2LiveWorld},{pack2NormalizeState},
 {createPack3LiveBridge},{PACK3_BUILDER_IDS},
 {createManual14SavedBridge},{MANUAL_FIVE_PACK_CATALOG,resolveManualFivePackAsset},
 {GpuUploadRetry,uploadChunkBuffer,MAX_CHUNK_UPLOAD_BYTES}]=await Promise.all([
 main('src/voxel.mjs'),main('src/pack2-world.mjs'),main('src/pack2-integration.mjs'),
 main('src/builder-assets/pack3-live.mjs'),main('src/builder-assets/pack3.mjs'),
 main('src/builder-assets/manual14-layer.mjs'),main('src/builder-assets/manual-five-pack.mjs'),
 main('src/gpu-recovery.mjs')]);
const source=read('src/main.mjs').split('\n');
const range=(a,b)=>source.slice(a-1,b).join('\n');
const store=()=>{const data=new Map();return {data,getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v)),removeItem:k=>data.delete(k)};};
const ordered=(s,parts)=>{let i=-1;for(const p of parts){const next=s.indexOf(p,i+1);assert.ok(next>i,'Missing ordered source anchor: '+p);i=next;}};
test('nine exact original Git blobs and 28 source ranges authenticate without executing main',()=>{
 assert.equal(manifest.sourceHead,'db4bbcc32156e5df311f733bcaa53d559c17313b');
 assert.equal(manifest.safeToIntegrate,false);
 assert.equal(manifest.files.length,9);
 assert.equal(manifest.files.reduce((n,f)=>n+f.ranges.length,0),28);
 for(const f of manifest.files){
  const body=read(f.path),lines=body.split('\n');
  assert.equal(blob(body),f.gitBlob,f.path);
  assert.equal(lines.length,f.lineCount);
  for(const r of f.ranges){assert.equal(lines[r.start-1],r.first,f.path);assert.equal(lines[r.end-1],r.last,f.path);}
 }
});
test('all direct main chunk-map, world assignment, context and retry pattern sites match pinned census',()=>{
 for(const [key,record] of Object.entries(manifest.mainObserved)){
  const actual=source.flatMap((s,i)=>new RegExp(record.pattern).test(s)?[{line:i+1,source:s}]:[]);
  assert.deepEqual(actual,record.sites,key);
 }
 assert.equal(manifest.mainObserved.chunkMap.sites.length,13);
 assert.equal(manifest.mainObserved.worldReplacement.sites.length,8);
 assert.equal(manifest.mainObserved.contextEvents.sites.length,2);
 assert.equal(manifest.mainObserved.retry.sites.length,10);
});
test('a changed writer source blob is not accepted even if selected anchors survive',()=>{
 const f=manifest.files.find(f=>f.path==='src/main.mjs');
 assert.notEqual(blob(read(f.path)+'\n// changed'),f.gitBlob);
});
test('original terrain and Manual14 batches stage before chunk replacement and old deletion',()=>{
 for(const [a,b] of [[976,1012],[1027,1063]]){
  ordered(range(a,b),['uploadPack2Chunk(', 'catch(', 'deleteChunkBuffers(item)', 'chunks.set(', 'deleteChunkBuffers(old)']);
 }
 ordered(range(1013,1026),['uploadPack2Chunk(', 'chunks.set(', 'deleteChunkBuffers(old)']);
 assert.match(range(976,1012),/desertSeamEditAffectedChunks\(world,x,z,y\)/);
 assert.match(range(967,975),/pack2WaterSectionVertices/);
});
test('original context loss and restore order invalidates all old caches before resume, with fail-closed recovery',()=>{
 ordered(range(3063,3101),['graphicsLost=true','frameDriver.pause()','webglcontextrestored','initializeGpuPipeline()','restartMobRenderer()','chunks.clear()','gpuRetry.clear()','graphicsLost=false','frameDriver.resume()','catch(error)','graphicsLost=true','frameDriver.pause()']);
 assert.doesNotMatch(range(3063,3101),/\bworld\.set\(|\bsave\(\)|storage\.setItem\(/);
});
test('genuine original Pack2 live water index follows update and removal at negative deep seam',()=>{
 const base=new VoxelWorld(179),w=new Pack2LiveWorld(base),x=-16,y=-20,z=-1;
 assert.equal(base.set(x,y,z,BLOCK.AIR),true);
 const original=JSON.stringify(base.save());
 assert.equal(w.placePack2(x,y,z,76,{level:3,flow:'still'}),true);
 const bucket=[...w.pack2WaterSectionEntries(-1,-1,-2)];
 assert.equal(bucket.length,1);
 assert.equal(w.updatePack2State(x,y,z,{level:7,flow:'still'}),true);
 assert.equal([...w.pack2WaterSectionEntries(-1,-1,-2)][0][1].level,7);
 assert.equal(w.set(x,y,z,BLOCK.AIR),true);
 assert.equal([...w.pack2WaterSectionEntries(-1,-1,-2)].length,0);
 assert.equal(JSON.stringify(base.save()),original);
});
test('original Pack3 live bridge genuine failed rebuild rolls back source overlay and in-memory sidecar',()=>{
 const world=new VoxelWorld(179),storage=store(),bridge=createPack3LiveBridge(world,storage);
 const before=bridge.runtime.serialize(),base=JSON.stringify(world.save());
 // At 19, choose genuine unedited AIR without fabricating a world reader.
 let cell=null;
 for(let x=-710;x<-690&&!cell;x++)for(let z=190;z<200&&!cell;z++)
  if(world.get(x,19,z)===BLOCK.AIR)cell=[x,19,z];
 assert.ok(cell);
 let calls=0;
 const r=bridge.mutate({mode:'place',cell,id:PACK3_BUILDER_IDS[0],orientation:0,player:{x:cell[0]+8.5,z:cell[2]+8.5,feet:19},rebuild(){calls++;throw Error('in-memory rebuild fault');}});
 assert.equal(calls,1,r.reason);
 assert.match(r.reason,/in-memory rebuild fault/);
 assert.equal(r.ok,false);
 assert.equal(bridge.runtime.serialize(),before);
 assert.equal(storage.getItem(bridge.key),null);
 assert.equal(JSON.stringify(world.save()),base);
});
test('original Manual14 saved bridge restores exact in-memory source and primary on failed rebuild',()=>{
 const world=new VoxelWorld(179),storage=store();
 const item=MANUAL_FIVE_PACK_CATALOG.find(r=>r.pack===4&&r.numericId===160);
 assert.ok(item);
 const at=[-699,12,196],shape=resolveManualFivePackAsset(item.symbol,{numericId:item.numericId,orientation:0,variant:null});
 assert.equal(world.set(...at,BLOCK.AIR),true);
 for(const offset of shape.supportOffsets){
  const cell=at.map((v,i)=>v+offset[i]);assert.equal(world.set(...cell,BLOCK.STONE),true);
 }
 let rebuilds=0;
 const bridge=createManual14SavedBridge(world,storage,{rebuild(){if(++rebuilds===1)throw Error('in-memory upload fault');}});
 const before=JSON.stringify(bridge.snapshot()),base=JSON.stringify(world.save());
 const result=bridge.placeMany([{at,asset:item.symbol,numericId:item.numericId,orientation:0}]);
 assert.equal(result.ok,false);
 assert.equal(rebuilds,2);
 assert.equal(JSON.stringify(bridge.snapshot()),before);
 assert.equal(storage.getItem(bridge.key),null);
 assert.equal(JSON.stringify(world.save()),base);
});
test('original GPU retry and mock upload failure retain prior handle and delete only new candidate',()=>{
 const retry=new GpuUploadRetry(),old={old:true},created=[],deleted=[];
 let errors=[0,1285];
 const fake={NO_ERROR:0,ARRAY_BUFFER:34962,STATIC_DRAW:35044,createBuffer(){const h={candidate:true};created.push(h);return h;},bindBuffer(){},bufferData(){},getError(){return errors.shift()??0;},deleteBuffer(h){deleted.push(h);}};
 assert.equal(MAX_CHUNK_UPLOAD_BYTES,8*1024*1024);
 assert.throws(()=>uploadChunkBuffer(fake,new Float32Array(9)));
 assert.deepEqual(deleted,created);assert.ok(!deleted.includes(old));
 retry.fail('-1,-1,-2',100,'mock loss');
 assert.equal(retry.ready('-1,-1,-2',101),false);
 retry.clear();assert.equal(retry.ready('-1,-1,-2',101),true);
});
test('source map explicitly leaves uninspected owners and browser atomicity held',()=>{
 assert.equal(manifest.safeToIntegrate,false);
 for(const k of ['cave','mob','vault','mirror','pack5','cross-tab persistence','creative registry'])assert.ok(manifest.heldOwners.includes(k));
 assert.match(manifest.coverage,/not exhaustive/);
});
