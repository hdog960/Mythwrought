// One REAL MYTHWROUGHT localhost WebGL2 edit-refresh exercise.
// Uses the existing original localhost-only UI hooks; no new test hooks
// or synthetic game worlds, no production source or shared workflow edits.
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR as M7}
 from '../src/manual-biomes/profile-world.mjs';
import {desertSeamEditAffectedChunks}
 from '../src/manual-biomes/desert-seam-invalidation.mjs';
import {depthMeshKey} from '../src/depth.mjs';

const x=-786,y=4,z=-1774,seed=179,oldId=401,newId=400;
const original=new FourRegionWorld(seed,fourRegionProfile(seed,M7));
assert.equal(original.get(x,y,z),oldId);
const affected=desertSeamEditAffectedChunks(original,x,z,y)
 .map(({cx,cz})=>depthMeshKey(cx,cz,0));
assert.ok(affected.length>=2);
assert.ok(affected.includes(depthMeshKey(-50,-112,0)));
const output=process.env.DESERT_RUNTIME_WEBGL_OUTPUT??'artifacts/desert-runtime-gpu';
await mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,args:[
 '--enable-webgl','--use-gl=angle','--use-angle=swiftshader',
 '--enable-unsafe-swiftshader'
]});
const report={seed,originalCell:[x,y,z],expectedAffected:affected,
 browserErrors:[],gpu:'actual Chromium WebGL2 SwiftShader (NOT physical iPhone)'};
try{
 const context=await browser.newContext({viewport:{width:932,height:430},
  deviceScaleFactor:1,isMobile:true,hasTouch:true,serviceWorkers:'block'});
 const page=await context.newPage();
 page.on('pageerror',e=>report.browserErrors.push(e.message));
 page.on('dialog',d=>d.accept());
 await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded',timeout:90000});
 const wait=(fn,arg)=>page.waitForFunction(fn,arg,{timeout:90000});
 await wait(()=>Boolean(window.__mythwroughtTest?.snapshot));
 if((await page.evaluate(()=>window.__mythwroughtTest.snapshot().seed))!==seed){
  await page.locator('#menu').click();
  await page.locator('#seedInput').fill(String(seed));
  await page.locator('#switchWorld').click();
  await wait(s=>window.__mythwroughtTest.snapshot().seed===s,seed);
  await page.locator('#closeHelp').click();
 }
 const profile=await page.evaluate(()=>window.__mythwroughtTest.fourBiomeProfile());
 assert.equal(profile?.generator,M7,'Actual game must have unchanged original V7 generator');
 await page.evaluate(([x,z])=>window.__mythwroughtTest.teleport(x,z),[x,z]);
 await wait(expected=>{
  const snap=window.__mythwroughtTest.snapshot();
  return expected.every(key=>snap.chunks.includes(key))&&snap.pending.length===0;
 },affected);
 const before=await page.evaluate(({x,y,z})=>{
  const api=window.__mythwroughtTest;
  return {snapshot:api.snapshot(),block:api.block(x,y,z)};
 },{x,y,z});
 assert.equal(before.block,oldId);
 for(const key of affected)assert.ok(before.snapshot.chunks.includes(key));
 report.before={chunks:before.snapshot.chunks.length,
  meshEditBatches:before.snapshot.editMeshBatches,block:before.block};
 // An injected *real WebGL method exception* (not simulated GPU context
 // loss) forces the original uploadChunkBuffer and uploadPack2Chunk cleanup.
 report.injected=await page.evaluate(({x,y,z,newId})=>{
  const api=window.__mythwroughtTest,gl=document.getElementById('scene').getContext('webgl2');
  if(!gl||gl.isContextLost())throw Error('Original real WebGL2 context unavailable');
  const old={
   createBuffer:gl.createBuffer,bufferData:gl.bufferData,deleteBuffer:gl.deleteBuffer
  };
  const made=[],freed=[],events=[];
  let uploads=0,error='';
  gl.createBuffer=function(...args){
   const buffer=old.createBuffer.apply(gl,args);made.push(buffer);return buffer;
  };
  gl.deleteBuffer=function(buffer){
   freed.push(buffer);return old.deleteBuffer.call(gl,buffer);
  };
  gl.bufferData=function(...args){
   uploads++;events.push('upload:'+uploads);
   if(uploads===2)throw Error('INJECTED_DESERT_GPU_SECOND_UPLOAD_FAILURE');
   return old.bufferData.apply(gl,args);
  };
  try{api.placeFixture(x,y,z,newId);}
  catch(e){error=String(e);}
  finally{
   gl.createBuffer=old.createBuffer;gl.bufferData=old.bufferData;
   gl.deleteBuffer=old.deleteBuffer;
  }
  const after=api.snapshot();
  return {error,uploads,created:made.length,deleted:freed.length,
   allNewDeleted:made.every(b=>freed.includes(b)),
   block:api.block(x,y,z),snapshot:after,
   contextLost:gl.isContextLost(),events};
 },{x,y,z,newId});
 assert.match(report.injected.error,/INJECTED_DESERT_GPU_SECOND_UPLOAD_FAILURE/);
 assert.equal(report.injected.uploads,2);
 assert.equal(report.injected.created,2);
 assert.equal(report.injected.deleted,2);
 assert.equal(report.injected.allNewDeleted,true);
 assert.equal(report.injected.block,oldId,'WebGL exception must roll back real M7 source edit');
 assert.equal(report.injected.contextLost,false);
 assert.equal(report.injected.snapshot.editMeshBatches,before.snapshot.editMeshBatches);
 assert.deepEqual(report.injected.snapshot.lastEditMeshKeys,before.snapshot.lastEditMeshKeys);
 assert.deepEqual(report.injected.snapshot.chunks,before.snapshot.chunks,
  'All previously published loaded chunks remain referenced after failure');
 report.success=await page.evaluate(({x,y,z,newId})=>{
  const api=window.__mythwroughtTest,gl=document.getElementById('scene').getContext('webgl2');
  const old={createBuffer:gl.createBuffer,bufferData:gl.bufferData,
   deleteBuffer:gl.deleteBuffer};
  const made=[],freed=[];let uploads=0;
  gl.createBuffer=function(...args){
   const b=old.createBuffer.apply(gl,args);made.push(b);return b;
  };
  gl.deleteBuffer=function(buffer){
   freed.push(buffer);return old.deleteBuffer.call(gl,buffer);
  };
  gl.bufferData=function(...args){
   uploads++;return old.bufferData.apply(gl,args);
  };
  let thrown='';
  try{api.placeFixture(x,y,z,newId);}
  catch(e){thrown=String(e);}
  finally{
   gl.createBuffer=old.createBuffer;gl.bufferData=old.bufferData;
   gl.deleteBuffer=old.deleteBuffer;
  }
  return {thrown,uploads,created:made.length,deleted:freed.length,
   leakedNew:made.some(b=>freed.includes(b)),block:api.block(x,y,z),
   snapshot:api.snapshot(),contextLost:gl.isContextLost(),glError:gl.getError()};
 },{x,y,z,newId});
 assert.equal(report.success.thrown,'');
 assert.equal(report.success.block,newId);
 assert.equal(report.success.uploads,affected.length);
 assert.equal(report.success.created,affected.length);
 assert.equal(report.success.deleted,affected.length);
 assert.equal(report.success.leakedNew,false);
 assert.equal(report.success.contextLost,false);
 assert.equal(report.success.glError,0);
 assert.equal(report.success.snapshot.editMeshBatches,before.snapshot.editMeshBatches+1);
 assert.deepEqual(report.success.snapshot.lastEditMeshKeys,affected);
 assert.deepEqual(report.success.snapshot.chunks,before.snapshot.chunks);
 await wait(()=>Number(document.getElementById('scene').dataset.renderedFrames||0)>5);
 await page.screenshot({path:output+'/real-webgl2-after-neighbor-edit.png'});
 const restored=await page.evaluate(({x,y,z,oldId})=>{
  const api=window.__mythwroughtTest;
  api.placeFixture(x,y,z,oldId);
  return {block:api.block(x,y,z),snapshot:api.snapshot()};
 },{x,y,z,oldId});
 assert.equal(restored.block,oldId);
 assert.equal(restored.snapshot.editMeshBatches,report.success.snapshot.editMeshBatches+1);
 assert.deepEqual(restored.snapshot.lastEditMeshKeys,affected);
 assert.deepEqual(report.browserErrors,[]);
 console.log('DESERT_REAL_WEBGL2_GPU_EDIT '+JSON.stringify({
  seed,edit:[x,y,z],oldId,newId,expectedAffected:affected,
  failureUploads:report.injected.uploads,failedNewBuffersCleaned:report.injected.allNewDeleted,
  previousResidentChunksRetained:report.injected.snapshot.chunks.length,
  rolledBackBlock:report.injected.block,
  publishedGpuUploads:report.success.uploads,
  returnedToSourceBlock:restored.block,
  contextLost:false,browserErrors:0,
  gpu:'real Chromium WebGL2 SwiftShader, not physical iPhone'
 }));
 report.final={restoredBlock:restored.block,
  meshEditBatches:restored.snapshot.editMeshBatches,keys:restored.snapshot.lastEditMeshKeys};
 await writeFile(output+'/manifest.json',JSON.stringify(report,null,2));
}finally{await browser.close();}
