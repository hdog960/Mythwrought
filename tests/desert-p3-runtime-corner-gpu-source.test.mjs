// Authentic accepted V7 terrain + exact live main.mjs source excerpts.
// GPU is deliberately a deterministic instrumented WebGL mock, NOT a
// physical iPhone or Chromium GPU driver.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR as M7,
  M6_BALANCED_GENERATOR as M6} from '../src/manual-biomes/profile-world.mjs';
import {meshChunk,BLOCK,chunkCoord} from '../src/voxel.mjs';
import {depthMeshKey,verticalEditSections} from '../src/depth.mjs';
import {editAffectedChunks} from '../src/chunks.mjs';
import {uploadChunkBuffer} from '../src/gpu-recovery.mjs';
import {desertSeamEditAffectedChunks,DESERT_SEAM_VISUAL_RADIUS}
  from '../src/manual-biomes/desert-seam-invalidation.mjs';
import {isBiome130BlockId} from '../src/biome130-registry.mjs';

const priorMain=fs.readFileSync(new URL('../../baseline/src/main.mjs',import.meta.url),'utf8');
const candidateMain=fs.readFileSync(new URL('../src/main.mjs',import.meta.url),'utf8');
const actualBlocks=fs.readFileSync(new URL('../src/blocks.mjs',import.meta.url),'utf8');
const acceptedShader=fs.readFileSync(new URL('../../baseline/src/storybook-materials.mjs',import.meta.url));
const candidateShader=fs.readFileSync(new URL('../src/storybook-materials.mjs',import.meta.url));

// Only the named source block is executed; do not recreate its logic.
function exactFunction(source,name){
 const marker='function '+name+'(';
 const found=source.indexOf(marker);
 assert.ok(found>=0,'Original source function missing: '+name);
 assert.equal(source.indexOf(marker,found+1),-1,'Ambiguous source function: '+name);
 const start=found,body=source.indexOf('{',found);
 assert.ok(body>found);
 let level=0;
 for(let i=body;i<source.length;i++){
  if(source[i]==='{')level++;
  if(source[i]==='}'){
   level--;
   if(level===0)return source.slice(start,i+1);
  }
 }
 throw Error('Unclosed exact source function '+name);
}
const mainGPUCode=[
 exactFunction(candidateMain,'deleteChunkBuffers'),
 exactFunction(candidateMain,'uploadPack2Chunk'),
 exactFunction(candidateMain,'refreshEditedMeshes')
].join('\n');

function fakeGl(){
 let index=0,error=0,dataCount=0,failOn=0,bound=null;
 const live=new Set(),deleted=new Set(),events=[];
 const gl={
  ARRAY_BUFFER:34962,STATIC_DRAW:35044,NO_ERROR:0,
  createBuffer(){
   const buffer={id:++index};live.add(buffer);
   events.push(['create',buffer.id]);return buffer;
  },
  bindBuffer(target,buffer){
   assert.equal(target,gl.ARRAY_BUFFER);assert.ok(live.has(buffer));
   bound=buffer;
  },
  bufferData(target,bytes,usage){
   assert.equal(target,gl.ARRAY_BUFFER);assert.equal(usage,gl.STATIC_DRAW);
   assert.ok(bound&&live.has(bound));
   assert.ok(bytes instanceof Float32Array);
   assert.equal(bytes.length%9,0);
   dataCount++;events.push(['upload',bound.id,bytes.byteLength]);
   if(dataCount===failOn){error=1285;return;}
   bound.byteLength=bytes.byteLength;
  },
  getError(){const result=error;error=0;return result;},
  deleteBuffer(buffer){
   assert.ok(buffer&&live.has(buffer),'double delete or foreign GPU buffer');
   live.delete(buffer);deleted.add(buffer);events.push(['delete',buffer.id]);
  },
  get live(){return live;},get deleted(){return deleted;},
  get events(){return events;},get dataCount(){return dataCount;},
  failNextOn(n){assert.ok(Number.isInteger(n)&&n>=1);failOn=dataCount+n;},
  clearFault(){failOn=0;error=0;}
 };
 return gl;
}
function buildRuntime(world,loaded){
 const gl=fakeGl(),chunks=new Map();
 for(const {cx,cz} of loaded){
  const section=0,key=depthMeshKey(cx,cz,section),vertices=meshChunk(world,cx,cz);
  const buffer=uploadChunkBuffer(gl,vertices);
  chunks.set(key,{x:cx,z:cz,section,buffer,count:vertices.length/9,
    waterBuffer:null,waterCount:0});
 }
 const context={
  gl,uploadChunkBuffer,chunks,depthMeshKey,verticalEditSections,
  desertSeamEditAffectedChunks,world,
  meshPlayableChunk:(cx,cz,section)=>{
   assert.equal(section,0,'Original V7 surface edit witness must be surface section');
   return meshChunk(world,cx,cz);
  },
  meshPlayableWater:()=>new Float32Array(0),
  caveSession:null,combinedWorld:()=>false,caveFarGpu:{invalidate(){}}
 };
 const suite='let editMeshBatches=0,lastEditMeshKeys=[];\n'+mainGPUCode+
  '\n({refreshEditedMeshes,telemetry:()=>({editMeshBatches,lastEditMeshKeys})})';
 const runtime=vm.runInNewContext(suite,context,{timeout:1500});
 const actionContext={
  inspectBlockTarget:()=>({hit:[-786,4,-1774],adjacent:[-786,5,-1774],
   canMine:true,canPlace:true,reason:''}),
  isBiome130BlockId,manual14Ids:new Set(),manualPack3SymbolById:new Map(),BLOCK
 };
 const action=vm.runInNewContext('('+exactFunction(actualBlocks,'applyBlockAction')+')',
  actionContext,{timeout:1500});
 return {gl,chunks,runtime,action};
}
function coordinateSet(items){return new Set(items.map(({cx,cz})=>cx+','+cz));}
test('true circular RGB halo excludes geometrically impossible diagonals, never legacy neighbors',()=>{
 const mkWorld={seed:179,generationProfile:{generator:M7},
  _columnPlan:()=>new Map([[7,401]])};
 assert.equal(DESERT_SEAM_VISUAL_RADIUS,3);
 let samples=0,skippedDiagonal=0,keptDiagonal=0;
 for(let cx=-2;cx<=1;cx++)for(let cz=-2;cz<=1;cz++)
  for(let lx=0;lx<16;lx++)for(let lz=0;lz<16;lz++){
   const x=cx*16+lx,z=cz*16+lz;
   const old=editAffectedChunks(x,z),newList=desertSeamEditAffectedChunks(mkWorld,x,z,7);
   const set=coordinateSet(newList);
   assert.equal(set.size,newList.length);
   assert.ok(newList.length<=5,'bounded seam-aware original upload batch');
   for(const p of old)assert.ok(set.has(p.cx+','+p.cz));
   const possibleX=[cx-1,cx+1],possibleZ=[cz-1,cz+1];
   for(const ax of possibleX)for(const az of possibleZ){
    const centerX=x+.5,centerZ=z+.5;
    const nearestX=Math.max(ax*16,Math.min(centerX,(ax+1)*16));
    const nearestZ=Math.max(az*16,Math.min(centerZ,(az+1)*16));
    const dist2=(nearestX-centerX)**2+(nearestZ-centerZ)**2;
    const already=old.some(p=>p.cx===ax&&p.cz===az);
    const included=set.has(ax+','+az);
    if(!already&&dist2>=9){assert.ok(!included);skippedDiagonal++;}
    if(!already&&dist2<9){assert.ok(included);keptDiagonal++;}
   }
   assert.deepEqual(desertSeamEditAffectedChunks(mkWorld,x,z,6),old);
   samples++;
  }
 for(const [x,z,expected] of [[13,13,false],[14,14,true],
   [2,2,false],[1,1,true],[-3,-3,false],[-2,-2,true]]){
  const cx=chunkCoord(x),cz=chunkCoord(z),toward=x-cx*16<=2?-1:1,
    vert=z-cz*16<=2?-1:1;
  assert.equal(desertSeamEditAffectedChunks(mkWorld,x,z,7)
    .some(p=>p.cx===cx+toward&&p.cz===cz+vert),expected);
 }
 const legacy=new FourRegionWorld(179,fourRegionProfile(179,M6));
 assert.deepEqual(desertSeamEditAffectedChunks(legacy,14,14,7),editAffectedChunks(14,14));
 assert.ok(skippedDiagonal>0&&keptDiagonal>0);
 console.log('DESERT_GPU_CIRCLE_EXACT '+JSON.stringify({
  samples,skippedDiagonal,keptDiagonal,radius:DESERT_SEAM_VISUAL_RADIUS,
  maxAllowedChunks:5
 }));
});
test('authentic original M7 source caps at corners have bounded diagonal candidates and vetoes',()=>{
 const seeds=[[179,-50,-111],[2026,-178,-49]];
 let eligible=0,expanded=0,diagonal=0,pruned=0,veto=0;
 for(const [seed,centerCx,centerCz] of seeds){
  const world=new FourRegionWorld(seed,fourRegionProfile(seed,M7));
  for(let dcx=-1;dcx<=1;dcx++)for(let dcz=-1;dcz<=1;dcz++){
   const cx=centerCx+dcx,cz=centerCz+dcz;
   for(const lx of [1,2,13,14])for(const lz of [1,2,13,14]){
    const x=cx*16+lx,z=cz*16+lz;
    const plan=world._columnPlan(x,z);
    if(!plan.size){veto++;continue;}
    const y=Math.max(...plan.keys()),id=plan.get(y);
    if(id!==401&&id!==258)continue;
    const previous=editAffectedChunks(x,z);
    const updated=desertSeamEditAffectedChunks(world,x,z,y);
    for(const p of previous)assert.ok(coordinateSet(updated).has(p.cx+','+p.cz));
    assert.ok(updated.length<=5);
    eligible++;
    if(updated.length>previous.length)expanded++;
    const cxDiag=cx+(lx<=2?-1:1),czDiag=cz+(lz<=2?-1:1);
    const has=updated.some(p=>p.cx===cxDiag&&p.cz===czDiag);
    const minX=Math.max(cxDiag*16,Math.min(x+.5,(cxDiag+1)*16));
    const minZ=Math.max(czDiag*16,Math.min(z+.5,(czDiag+1)*16));
    const within=((x+.5-minX)**2+(z+.5-minZ)**2)<9;
    if(has)diagonal++;
    if(!has)pruned++;
    assert.equal(has,within,'Real M7 edit radius matches corner geometry');
    assert.deepEqual(desertSeamEditAffectedChunks(world,x,z,y-1),previous);
   }
  }
  assert.ok(world.cachedBiomeColumns<=1024);
 }
 assert.ok(eligible>0&&expanded>0&&diagonal>0&&pruned>0);
 console.log('DESERT_GPU_ORIGINAL_CORNERS '+JSON.stringify({
  eligible,expanded,diagonal,pruned,veto,source:'actual original guarded M7 plans'
 }));
});
test('original main.mjs GPU upload stages all actual loaded color-recipient chunks and publishes atomically',()=>{
 const world=new FourRegionWorld(179,fourRegionProfile(179,M7));
 const edit={x:-786,y:4,z:-1774};
 assert.equal(world.get(edit.x,edit.y,edit.z),401);
 const affected=desertSeamEditAffectedChunks(world,edit.x,edit.z,edit.y);
 const expected=affected.map(p=>depthMeshKey(p.cx,p.cz,0));
 assert.ok(expected.includes(depthMeshKey(-50,-112,0)));
 assert.ok(!coordinateSet(editAffectedChunks(edit.x,edit.z)).has('-50,-112'));
 const setup=buildRuntime(world,affected);
 assert.equal(setup.chunks.size,affected.length);
 const originalBuffers=new Map([...setup.chunks].map(([key,entry])=>[key,entry.buffer]));
 const initialLive=new Set(setup.gl.live),startCount=setup.gl.dataCount;
 const result=setup.action(world,[],[],'mine',0,{},setup.runtime.refreshEditedMeshes);
 assert.equal(result.ok,true);
 assert.equal(world.get(edit.x,edit.y,edit.z),BLOCK.AIR);
 assert.equal(world.save().edits.length,1);
 assert.deepEqual(Array.from(setup.runtime.telemetry().lastEditMeshKeys),expected);
 assert.equal(setup.runtime.telemetry().editMeshBatches,1);
 assert.equal(setup.gl.dataCount-startCount,affected.length,
  'Exactly one original GPU terrain buffer upload per affected loaded surface chunk');
 assert.equal(setup.gl.live.size,setup.chunks.size);
 for(const [key,prior] of originalBuffers){
  assert.notEqual(setup.chunks.get(key).buffer,prior);
  assert.ok(!setup.gl.live.has(prior),'Old source GPU buffer retired after publication');
  assert.ok(setup.gl.live.has(setup.chunks.get(key).buffer));
 }
 for(const buffer of initialLive)assert.ok(setup.gl.deleted.has(buffer));
 assert.ok(setup.gl.events.filter(row=>row[0]==='upload').length>=2);
 console.log('DESERT_GPU_ATOMIC_PUBLISH '+JSON.stringify({
  affected:expected,loaded:setup.chunks.size,oldBuffersRetired:initialLive.size,
  newLiveBuffers:setup.gl.live.size,uploads:setup.gl.dataCount-startCount,
  saveRows:world.save().edits.length,
  originalSourceExtract:true,
  gpu:'instrumented original uploader, NOT physical WebGL2'
 }));
});
test('original main.mjs GPU upload failure keeps every old loaded chunk and rolls back real edit',()=>{
 const world=new FourRegionWorld(179,fourRegionProfile(179,M7));
 const edit={x:-786,y:4,z:-1774},affected=desertSeamEditAffectedChunks(world,edit.x,edit.z,edit.y);
 assert.ok(affected.length>=2);
 const setup=buildRuntime(world,affected);
 const oldBuffers=new Map([...setup.chunks].map(([key,entry])=>[key,entry.buffer]));
 const liveBefore=new Set(setup.gl.live),started=setup.gl.dataCount;
 setup.gl.failNextOn(2);
 const result=setup.action(world,[],[],'mine',0,{},setup.runtime.refreshEditedMeshes);
 assert.equal(result.ok,false);
 assert.match(result.reason,/Block update failed/);
 assert.equal(world.get(edit.x,edit.y,edit.z),401,'Original physical edit rolled back');
 assert.deepEqual(world.save().edits,[],'No partially persisted world edit rows');
 assert.equal(setup.runtime.telemetry().editMeshBatches,0);
 assert.equal(setup.gl.live.size,liveBefore.size);
 for(const [key,old] of oldBuffers){
  assert.equal(setup.chunks.get(key).buffer,old,'Old buffer must still be published');
  assert.ok(setup.gl.live.has(old));
 }
 assert.equal(setup.gl.dataCount-started,2);
 assert.equal(setup.gl.deleted.size,2,
  'Failed current upload and previously staged new buffer deleted exactly once');
 const beforeRecovery=setup.gl.dataCount;
 setup.gl.clearFault();
 const retry=setup.action(world,[],[],'mine',0,{},setup.runtime.refreshEditedMeshes);
 assert.equal(retry.ok,true,'An edit may retry cleanly after transient GL error');
 assert.equal(setup.gl.dataCount-beforeRecovery,affected.length);
 assert.equal(setup.gl.live.size,affected.length);
 assert.equal(world.get(edit.x,edit.y,edit.z),BLOCK.AIR);
 assert.equal(world.save().edits.length,1);
 console.log('DESERT_GPU_ROLLBACK_AND_RETRY '+JSON.stringify({
  uploadFailureOnSecondChunk:true,
  failedUploadCount:2,previousLiveBuffersPreserved:liveBefore.size,
  rollbackSaveRows:0,retryUploads:affected.length,
  finalSaveRows:world.save().edits.length,
  originalSourceExtract:true,
  gpu:'instrumented original uploader, NOT physical WebGL2'
 }));
});
test('accepted shader and terrain generators remain exact; no rejected texture shader imported',()=>{
 const acceptedMain=priorMain;
 assert.ok(candidateMain.includes('desertSeamEditAffectedChunks(world,x,z,y)'));
 assert.ok(candidateMain.includes('const affected=desertSeamEditAffectedChunks(world,x,z,y);'));
 assert.ok(!candidateMain.includes('withDesertSeamTextureBlend'));
 assert.deepEqual(fs.readFileSync(new URL('../src/storybook-materials.mjs',import.meta.url)),
  acceptedShader);
 assert.deepEqual(candidateShader,acceptedShader);
 for(const path of ['src/manual-biomes/profile-world.mjs',
  'src/manual-biomes/environment-v7.mjs']){
  assert.deepEqual(fs.readFileSync(new URL('../'+path,import.meta.url)),
   fs.readFileSync(new URL('../../baseline/'+path,import.meta.url)));
 }
 assert.equal(fs.existsSync(new URL('../src/manual-biomes/desert-seam-shader.mjs',import.meta.url)),false);
});
