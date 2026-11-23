// Exact original-M7 loaded composited GPU source test.
// Uses real V7 world, Pack2, Pack3 and Manual14 adapters and EXECUTES original
// main.mjs function text with an instrumented WebGL buffer driver only.
// This does not simulate/claim physical iPhone hardware or production edits.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR as M7} from '../src/manual-biomes/profile-world.mjs';
import {Pack2LiveWorld} from '../src/pack2-world.mjs';
import {meshChunk,BLOCK} from '../src/voxel.mjs';
import {createPack3RuntimeStage} from '../src/builder-assets/pack3-runtime.mjs';
import {PACK3_BUILDER_SYMBOLS} from '../src/builder-assets/pack3.mjs';
import {combinePack3ChunkMesh} from '../src/builder-assets/pack3-live.mjs';
import {createManual14Layer} from '../src/builder-assets/manual14-layer.mjs';
import {meshManual14Chunk} from '../src/builder-assets/manual14-mesh.mjs';
import {pack2WaterSectionVertices} from '../src/pack2-integration.mjs';
import {depthMeshKey,verticalEditSections} from '../src/depth.mjs';
import {desertSeamEditAffectedChunks} from '../src/manual-biomes/desert-seam-invalidation.mjs';
import {uploadChunkBuffer} from '../src/gpu-recovery.mjs';
import {isBiome130BlockId} from '../src/biome130-registry.mjs';

const main=readFileSync(new URL('../src/main.mjs',import.meta.url),'utf8');
const blockSource=readFileSync(new URL('../src/blocks.mjs',import.meta.url),'utf8');
function sourceFunction(source,name){
 const marker='function '+name+'(',start=source.indexOf(marker);
 assert.ok(start>=0,'Missing real original function '+name);
 assert.ok(source.indexOf(marker,start+1)<0);
 const brace=source.indexOf('){',start)+1;
 assert.ok(brace>start&&source[brace]==='{');
 let depth=0;
 for(let i=brace;i<source.length;i++){
  if(source[i]==='{')depth++;
  else if(source[i]==='}'&&!--depth)return source.slice(start,i+1);
 }
 throw Error('Unterminated original game function '+name);
}
const originalMainFns=['deleteChunkBuffers','uploadPack2Chunk','manual14AtChunk',
 'combineVertices','meshPlayableChunk','meshPlayableWater','refreshEditedMeshes']
 .map(n=>sourceFunction(main,n)).join('\n');
const originalAction=sourceFunction(blockSource,'applyBlockAction');
function makeOriginalGame(){
 const base=new FourRegionWorld(179,fourRegionProfile(179,M7));
 const world=new Pack2LiveWorld(base);
 const pack3Runtime=createPack3RuntimeStage(world,{worldId:'desert-composed-rollback-authentic-original'});
 world.pack3Runtime=pack3Runtime;
 const manualLayer=createManual14Layer(world);
 world.manual14Layer=manualLayer;
 const target=[-786,4,-1774];
 assert.equal(world.get(...target),401);
 // All source-authored coordinates originally AIR; original sidecars only.
 assert.equal(world.get(-783,15,-1772),BLOCK.AIR);
 assert.ok(world.set(-783,15,-1772,61));
 assert.equal(manualLayer.placeMany([{
  at:[-783,16,-1772],asset:'pack1:001',numericId:9,orientation:0,variant:'lower'
 }]),1);
 assert.equal(pack3Runtime.placeMany([{
  at:[-785,18,-1773],asset:PACK3_BUILDER_SYMBOLS[0],orientation:'north'
 }]),1);
 assert.ok(world.set(-786,17,-1773,76));
 const selection=desertSeamEditAffectedChunks(world,target[0],target[2],target[1]);
 assert.equal(selection.length,4);
 const keys=selection.map(({cx,cz})=>depthMeshKey(cx,cz,0));
 assert.deepEqual(keys,['-50,-111','-50,-112','-49,-112','-49,-111']);
 assert.deepEqual(base.save().edits,[]);
 return {world,base,pack3Runtime,manualLayer,target,selection,keys};
}
function driver(){
 let nextId=0,bound=null,dataCount=0,failAt=Infinity,error=0;
 const live=new Set(),deleted=new Set(),events=[];
 const gl={
  ARRAY_BUFFER:34962,STATIC_DRAW:35044,NO_ERROR:0,
  createBuffer(){const b={id:++nextId};live.add(b);events.push(['new',b.id]);return b;},
  bindBuffer(target,b){assert.equal(target,gl.ARRAY_BUFFER);assert.ok(live.has(b));bound=b;},
  bufferData(target,vertices,usage){
   assert.equal(target,gl.ARRAY_BUFFER);assert.equal(usage,gl.STATIC_DRAW);
   assert.ok(bound&&live.has(bound)&&vertices instanceof Float32Array);
   assert.equal(vertices.length%9,0);
   dataCount++;events.push(['data',bound.id,vertices.byteLength]);
   if(dataCount===failAt){error=1285;return;}
   bound.bytes=vertices.byteLength;
  },
  getError(){const e=error;error=0;return e;},
  deleteBuffer(b){
   assert.ok(b&&live.has(b),'No double deletion or foreign buffer');
   live.delete(b);deleted.add(b);events.push(['del',b.id]);
  },
  get live(){return live;},get deleted(){return deleted;},
  get events(){return events;},get dataCount(){return dataCount;},
  failNthFutureUpload(n){failAt=dataCount+n;},
  noFault(){failAt=Infinity;error=0;}
 };
 return gl;
}
function instantiate(game){
 const {world,pack3Runtime,manualLayer,selection}=game;
 const gl=driver(),chunks=new Map();
 const context={
  gl,uploadChunkBuffer,world,depthMeshKey,verticalEditSections,
  desertSeamEditAffectedChunks,meshChunk,meshDepthSection:()=>{throw Error('unexpected deep edit');},
  combinePack3ChunkMesh,meshManual14Chunk,pack2WaterSectionVertices,
  pack3:{runtime:pack3Runtime},manual14:{layer:manualLayer},chunks,
  manual14MeshCache:new Map(),caveSession:null,combinedWorld:()=>false,
  caveFarGpu:{invalidate(){throw Error('No far GPU rebuild needed');}}
 };
 const script='let editMeshBatches=0,lastEditMeshKeys=[];\n'+originalMainFns+
  '\n({meshPlayableChunk,meshPlayableWater,uploadPack2Chunk,refreshEditedMeshes,'+
  'telemetry:()=>({editMeshBatches,lastEditMeshKeys})})';
 const gameFns=vm.runInNewContext(script,context,{timeout:1800});
 let composedOld=0,waterOld=0;
 for(const {cx,cz} of selection){
  const key=depthMeshKey(cx,cz,0);
  const solid=gameFns.meshPlayableChunk(cx,cz,0);
  const fluid=gameFns.meshPlayableWater(cx,cz,0);
  const buffers=gameFns.uploadPack2Chunk(solid,fluid);
  composedOld+=solid.byteLength;waterOld+=fluid.byteLength;
  chunks.set(key,{x:cx,z:cz,section:0,...buffers});
 }
 assert.ok(waterOld>0);
 assert.ok(composedOld>0);
 const action=vm.runInNewContext('('+originalAction+')',{
  inspectBlockTarget:()=>({hit:game.target,adjacent:[-786,5,-1774],canMine:true,canPlace:true,reason:''}),
  manual14Ids:new Set(),manualPack3SymbolById:new Map(),
  isBiome130BlockId,BLOCK
 },{timeout:1200});
 return {gl,chunks,gameFns,action,composedOld,waterOld};
}
function describeBuffers(chunks){return [...chunks].map(([k,v])=>({
 key:k,solid:v.buffer,fluid:v.waterBuffer,solidVertices:v.count,waterVertices:v.waterCount
}));}
for(const failingOrdinal of [2,4,5]){
 test('real composed M7 source uploader rolls back atomic batch on staged upload '+failingOrdinal,()=>{
  const g=makeOriginalGame(),s=instantiate(g);
  const old=describeBuffers(s.chunks),oldLive=new Set(s.gl.live);
  const starting=s.gl.dataCount,priorTelemetry=s.gameFns.telemetry();
  s.gl.failNthFutureUpload(failingOrdinal);
  const result=s.action(g.world,[],[],'mine',0,{},s.gameFns.refreshEditedMeshes);
  assert.equal(result.ok,false);
  assert.match(result.reason,/Block update failed/);
  assert.equal(g.world.get(...g.target),401);
  assert.deepEqual(g.base.save().edits,[]);
  assert.equal(s.gl.dataCount-starting,failingOrdinal);
  assert.equal(s.gl.live.size,oldLive.size);
  for(const p of old) {
   const current=s.chunks.get(p.key);
   assert.equal(current.buffer,p.solid);
   assert.equal(current.waterBuffer,p.fluid);
   assert.ok(s.gl.live.has(p.solid));
   if(p.fluid)assert.ok(s.gl.live.has(p.fluid));
  }
  assert.equal(s.gameFns.telemetry().editMeshBatches,priorTelemetry.editMeshBatches);
  assert.deepEqual(Array.from(s.gameFns.telemetry().lastEditMeshKeys),
   Array.from(priorTelemetry.lastEditMeshKeys));
  // All newly made buffers must be gone; no published buffers removed.
  assert.ok([...oldLive].every(b=>!s.gl.deleted.has(b)));
  assert.equal(s.gl.deleted.size,failingOrdinal);
  s.gl.noFault();
  const successful=s.action(g.world,[],[],'mine',0,{},s.gameFns.refreshEditedMeshes);
  assert.equal(successful.ok,true);
  assert.equal(g.world.get(...g.target),BLOCK.AIR);
  assert.equal(g.base.save().edits.length,1);
  assert.equal(s.gameFns.telemetry().editMeshBatches,1);
  assert.deepEqual(Array.from(s.gameFns.telemetry().lastEditMeshKeys),g.keys);
  assert.equal(s.gl.live.size,oldLive.size);
  for(const p of old){
   const v=s.chunks.get(p.key);
   assert.notEqual(v.buffer,p.solid);
   assert.ok(!s.gl.live.has(p.solid));
   if(p.fluid){assert.notEqual(v.waterBuffer,p.fluid);assert.ok(!s.gl.live.has(p.fluid));}
  }
  assert.equal(g.pack3Runtime.size(),1);
  assert.equal(g.manualLayer.size(),1);
  assert.equal(g.world.get(-786,17,-1773),76);
  assert.equal(g.world.get(-783,15,-1772),61);
  const bytes=[...s.chunks.values()].reduce((t,c)=>t+
   (c.buffer?.bytes||0)+(c.waterBuffer?.bytes||0),0);
  console.log('DESERT_P3_ALL_PACKS_GPU_ROLLBACK '+JSON.stringify({
   failureOrdinal:failingOrdinal,initialLiveGpuBuffers:oldLive.size,
   originalFourChunkOpaqueBytes:s.composedOld,originalWaterBytes:s.waterOld,
   failedCreatedAndDeletedBuffers:failingOrdinal,
   saveRolledBack:true,allPreviousBuffersPreserved:true,
   retryPublishedFourChunks:g.keys,retryResidentSourceBytes:bytes,
   originalPack2WaterIntact:true,originalPack3Intact:true,originalManual14Intact:true,
   driver:'controlled WebGL fake, actual source upload functions; NOT physical iPhone'
  }));
 });
}
