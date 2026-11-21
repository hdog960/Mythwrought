// MYTHWROUGHT issue #291: original-game source-UNMODIFIED CPU-side chunk draw census.
// Read actual lexical 'chunks' Map through a one-shot Chrome DevTools debugger
// snapshot at the authentic original draw loop. Never call gl.getError;
// do not monkeypatch any WebGL call, alter buffers or renderer, or fake frames.
import assert from 'node:assert/strict';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright';

const REPO='hdog960/Mythwrought';
const PR='82f8828945b464acf0a71faddfe2d18ffa4df245';
const MAIN='8de40ca8451b6268cfdfefaa5d9a66b72caca799';
const expected=[
 '.github/workflows/iphone-chunk-draw-debugger-census.yml',
 'scripts/ci/iphone-chunk-draw-debugger-census.mjs'
];
const dir='artifacts/iphone-chunk-draw-census';
await mkdir(dir,{recursive:true});
assert.equal(execFileSync('git',['rev-parse','HEAD^'],{encoding:'utf8'}).trim(),PR);
assert.deepEqual(execFileSync('git',['diff','--name-only',PR,'HEAD'],{encoding:'utf8'})
 .trim().split('\n').sort(),expected);
assert.equal(execFileSync('git',['-C','baseline-main','rev-parse','HEAD'],{encoding:'utf8'}).trim(),MAIN);
const hash=async path=>createHash('sha256').update(await readFile(path)).digest('hex');
const data={kind:'ORIGINAL_UNMODIFIED_WEBGL_RENDERER_DEBUGGER_READ_ONLY_CPU_CHUNK_COUNTS',
 pr:PR,main:MAIN,sourceHash:await hash('src/main.mjs'),
 depthHash:await hash('src/depth.mjs'),cameraHash:await hash('src/camera.mjs'),
 gpuSourceHash:await hash('src/gpu-recovery.mjs'),
 note:'Actual c.count per original drawArrays, not a proxy from loaded/resident count. One-shot debugger reads CPU lexical Maps before original draw command, with no WebGL interception.',
 originalGLMethodsUntouched:true,originalPrePostErrorChecksUntouched:true,
 originalRendererByteIdentical:true,physicalIphone:false,acceptance:false,
 views:[],errors:[],complete:false};
const browser=await chromium.launch({headless:true,
 args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
function definitelyOffscreen(ch,cam,pad=4){
 const eye=[cam.x,cam.feet+1.55,cam.z],yaw=cam.yaw,pitch=cam.pitch,
 aspect=cam.w/cam.h,tan=Math.tan(72*Math.PI/360);
 const forward=[Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),Math.cos(yaw)*Math.cos(pitch)],
  right=[-Math.cos(yaw),0,Math.sin(yaw)],
  up=[-Math.sin(pitch)*Math.sin(yaw),Math.cos(pitch),-Math.sin(pitch)*Math.cos(yaw)];
 const minY=ch.section===0?-3:-3+ch.section*16,
  maxY=ch.section===0?19:-3+(ch.section+1)*16-1;
 const corners=[];
 for(const x of [ch.cx*16-pad,ch.cx*16+16+pad])
  for(const y of [minY-pad,maxY+1+pad])
   for(const z of [ch.cz*16-pad,ch.cz*16+16+pad]){
    const d=[x-eye[0],y-eye[1],z-eye[2]];
    corners.push([dot(d,right),dot(d,up),dot(d,forward)]);
   }
 const planes=[
  ([x,y,z])=>x+z*aspect*tan,([x,y,z])=>-x+z*aspect*tan,
  ([x,y,z])=>y+z*tan,([x,y,z])=>-y+z*tan,
  ([x,y,z])=>2.0015*z-.1501,([x,y,z])=>.1501-.0015*z
 ];
 return planes.some(plane=>corners.every(c=>plane(c)<-1e-5));
}
async function inspect(page,cdp,viewport,label,yaw,pitch){
 await page.evaluate(({yaw,pitch})=>window.__mythwroughtTest.setOrientation(yaw,pitch),
  {yaw,pitch});
 await page.waitForTimeout(85); // genuine browser frame proceeds unmodified
 const promise=new Promise((resolve,reject)=>{
  let done=false,id='';
  const timeout=setTimeout(async()=>{
   if(done)return;done=true;
   try{if(id)await cdp.send('Debugger.removeBreakpoint',{breakpointId:id});}catch(_){}
   try{await cdp.send('Debugger.resume');}catch(_){}
   reject(new Error('Original draw-loop source breakpoint did not fire in 15s'));
  },15000);
  const onPaused=async event=>{
   if(done)return;done=true;clearTimeout(timeout);
   try{
    if(id)await cdp.send('Debugger.removeBreakpoint',{breakpointId:id});
    const frame=event.callFrames.find(f=>f.functionName==='draw')??event.callFrames[0];
    const expression="JSON.stringify({frame,cam:{x:player.x,z:player.z,feet:player.feet,yaw:player.yaw,pitch:player.pitch,w:canvas.width,h:canvas.height},chunks:[...chunks.values()].map(c=>({cx:c.x,cz:c.z,section:c.section,count:c.count,waterCount:c.waterCount||0,bufferResident:!!c.buffer,waterResident:!!c.waterBuffer}))})";
    const reply=await cdp.send('Debugger.evaluateOnCallFrame',{
      callFrameId:frame.callFrameId,expression,returnByValue:true,
      silent:true
    });
    if(reply.exceptionDetails||reply.result.type!=='string')
      throw Error('Read-only lexical inspection denied '+JSON.stringify(reply.exceptionDetails??reply.result));
    resolve(JSON.parse(reply.result.value));
   }catch(error){reject(error)}
   finally{try{await cdp.send('Debugger.resume');}catch(_){}}
  };
  cdp.once('Debugger.paused',onPaused);
  void cdp.send('Debugger.setBreakpointByUrl',{
   url:'http://127.0.0.1:4173/src/main.mjs',
   lineNumber:1384,columnNumber:0
  }).then(b=>{
   id=b.breakpointId;
   if(!b.locations?.length)throw Error('Source line breakpoint unresolved for original draw');
  }).catch(e=>{clearTimeout(timeout);if(!done){done=true;reject(e);}});
 });
 const snap=await promise;
 assert.equal(snap.cam.yaw,yaw,'Original game camera yaw changed during snapshot');
 assert.equal(snap.cam.pitch,pitch,'Original game camera pitch changed during snapshot');
 const counted=snap.chunks.map(c=>({
  ...c,conservativeOffscreen:definitelyOffscreen(c,snap.cam)
 }));
 const off=counted.filter(c=>c.conservativeOffscreen);
 const positive=counted.filter(c=>c.count>0),outsidePositive=off.filter(c=>c.count>0);
 const allVerts=counted.reduce((s,c)=>s+c.count,0);
 const out={
  viewport:viewport.join('x'),label,cam:snap.cam,
  drawFrame:snap.frame,resident:counted.length,
  actualOpaqueDrawCommands:counted.length,
  countZeroDrawCommands:counted.filter(c=>c.count===0).length,
  nonemptyOpaqueDrawCommands:positive.length,
  opaqueVertices:allVerts,
  opaqueOffscreenCommands:off.length,
  nonemptyOffscreenCommands:outsidePositive.length,
  offscreenTriangleVertices:outsidePositive.reduce((s,c)=>s+c.count,0),
  maxPotentialOpaqueVertexReductionPct:allVerts>0?
   100*outsidePositive.reduce((s,c)=>s+c.count,0)/allVerts:0,
  chunks:counted
 };
 data.views.push(out);
 console.log('ORIGINAL_DRAW_CHUNK_CENSUS',JSON.stringify({
  viewport:out.viewport,label,opaqueDrawCalls:out.actualOpaqueDrawCommands,
  nonemptyDraws:out.nonemptyOpaqueDrawCommands,zeroDraws:out.countZeroDrawCommands,
  opaqueVertices:out.opaqueVertices,potentialOffscreenDrawCalls:out.opaqueOffscreenCommands,
  nonemptyOffscreen:out.nonemptyOffscreenCommands,
  potentiallySavedVertices:out.offscreenTriangleVertices}));
 await writeFile(dir+'/original-source-chunk-counts.json',JSON.stringify(data,null,2)+'\n');
}
async function run(width,height){
 const vp=[width,height];
 const ctx=await browser.newContext({viewport:{width,height},
  deviceScaleFactor:1,isMobile:true,hasTouch:true});
 const page=await ctx.newPage(),errors=[];const cdp=await ctx.newCDPSession(page);
 page.on('pageerror',e=>errors.push(String(e)));
 try{
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle',timeout:30000});
  await page.waitForFunction(()=>window.__mythwroughtTest&&
   Number(document.querySelector('#scene')?.dataset.loadedChunks)>=25,
   null,{timeout:120000});
  await page.evaluate(()=>{
   const t=window.__mythwroughtTest;
   for(let x=0;x<=2;x++)for(let z=0;z<=2;z++)for(let y=-78;y<=-76;y++)
    if(!t.placeFixture(x,y,z,0).saved)throw Error('Original chamber not saved');
   t.teleportCave(1,-78,1);
  });
  await page.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.loadedChunks)===27,
   null,{timeout:120000});
  await cdp.send('Debugger.enable');
  // Snapshot at original deep chamber before digging, across real camera views.
  for(const [label,yaw,pitch] of [
   ['north',0,0],['east',Math.PI/2,0],['south',Math.PI,0],
   ['west',-Math.PI/2,0],['down',0,-.9],['up',0,.9]])
    await inspect(page,cdp,vp,'initial-'+label,yaw,pitch);
  await cdp.send('Debugger.disable');
  // Original source: perform actual in-game world.set, atomic GPU staging and save.
  const editProof=await page.evaluate(async()=>{
   const t=window.__mythwroughtTest,scene=document.querySelector('#scene');
   const edits=[];
   for(let y=-79;y>=-102;y--){
    const r=t.placeFixture(1,y,1,0);
    if(!r.saved||t.block(1,y,1)!==0)throw Error('Real edit failure '+y);
    t.teleportCave(1,y,1);
    edits.push({y,upload:r.uploadMs,mesh:r.meshMs,save:r.saveMs,
      resident:Number(scene.dataset.loadedChunks)});
    await new Promise(resolve=>requestAnimationFrame(resolve));
   }
   return {edits,save:JSON.parse(localStorage.getItem('mythwrought-v002-world-179')||'{}'),
    feet:t.m5ObservedPose().feet};
  });
  assert.equal(editProof.edits.length,24);
  assert.equal(editProof.save.schema,1);
  assert.ok(editProof.edits.every(x=>x.resident<=27));
  await cdp.send('Debugger.enable');
  for(const [label,yaw,pitch] of [
   ['north',0,0],['east',Math.PI/2,0],['south',Math.PI,0],
   ['west',-Math.PI/2,0],['down',0,-.9],['up',0,.9]])
    await inspect(page,cdp,vp,'deep-'+label,yaw,pitch);
  await cdp.send('Debugger.disable');
  await page.screenshot({path:dir+'/unmodified-original-'+width+'x'+height+'.png'});
  await page.reload({waitUntil:'networkidle'});
  await page.waitForFunction(()=>window.__mythwroughtTest,null,{timeout:60000});
  assert.equal(await page.evaluate(()=>window.__mythwroughtTest.block(1,-102,1)),0,
   'Original deep save failed browser reload');
  assert.deepEqual(errors,[],'Original-game JS page errors');
  const rv=data.views.filter(v=>v.viewport===width+'x'+height);
  data['viewport-'+width+'x'+height]={views:rv.length,actualEdits:editProof.edits.length,
    saveSchema:editProof.save.schema,saveReloadVerified:true,finalFeet:editProof.feet,
    maxResident:Math.max(...editProof.edits.map(x=>x.resident)),
    maxNonemptyDrawCalls:Math.max(...rv.map(x=>x.nonemptyOpaqueDrawCommands)),
    maxOffscreenNonempty:Math.max(...rv.map(x=>x.nonemptyOffscreenCommands)),
    uploadP95:editProof.edits.map(x=>x.upload).sort((a,b)=>a-b)[22]};
 }finally{
  try{await cdp.send('Debugger.disable');}catch(_){}
  await ctx.close();
 }
}
try{
 for(const [w,h] of [[844,390],[956,440]])await run(w,h);
 data.complete=true;
}catch(e){data.errors.push(String(e?.stack||e));throw e;}
finally{
 await writeFile(dir+'/original-source-chunk-counts.json',JSON.stringify(data,null,2)+'\n');
 await browser.close();
}
