// MYTHWROUGHT issue #291 — original-source Chromium / ANGLE GPU process trace.
// Strictly read-only: no intercepted WebGL calls, NO added gl.getError,
// no game source, shader, saved-world, buffer, rollback or CI acceptance edits.
// Diagnostic profiles are native original settings and original DPR contexts.
import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {gzipSync} from 'node:zlib';
import {execFileSync} from 'node:child_process';
import {chromium} from 'playwright';

const PR='82f8828945b464acf0a71faddfe2d18ffa4df245';
const MAIN='8de40ca8451b6268cfdfefaa5d9a66b72caca799';
const DIR='artifacts/iphone-angle-trace';
await mkdir(DIR,{recursive:true});
assert.equal(execFileSync('git',['rev-parse','HEAD^'],{encoding:'utf8'}).trim(),PR);
assert.equal(execFileSync('git',['-C','baseline-main','rev-parse','HEAD'],{encoding:'utf8'}).trim(),MAIN);
assert.deepEqual(execFileSync('git',['diff','--name-only',PR,'HEAD'],{encoding:'utf8'})
 .trim().split('\n').sort(),[
 '.github/workflows/iphone-angle-shader-trace.yml',
 'scripts/ci/iphone-angle-shader-trace.mjs']);
const hash=x=>createHash('sha256').update(x).digest('hex');
const srcMain=await readFile('src/main.mjs'),srcShader=await readFile('src/storybook-materials.mjs'),
 srcGpu=await readFile('src/gpu-recovery.mjs');
const proof={kind:'ORIGINAL_GAME_CHROME_ANGLE_GPU_FRAGMENT_SHADER_TRACE_DIAGNOSTIC_NOT_RELEASE',
 prHead:PR,productionMain:MAIN,
 hashes:{main:hash(srcMain),shader:hash(srcShader),gpu:hash(srcGpu)},
 publishedGameSourceChanged:false,rendererWebglMethodsIntercepted:false,
 shaderModified:false,mandatoryGlErrorChecksUntouched:true,
 genuineWebGL2:true,actualIphone:false,releaseCertification:false,
 note:'Original battery preserves painted detail; economy changes shader only when DPR=.65 in matched-geometry comparison. Chrome trace adds measurement overhead and is NOT strict p95 acceptance.',
 cases:[],complete:false,errors:[]};
const cases=[
 {name:'balanced-native',preset:'balanced',dpr:1},
 {name:'battery-native',preset:'battery',dpr:1},
 {name:'painted-matched',preset:'balanced',dpr:.65},
 {name:'economy-matched',preset:'economy',dpr:.65}
];
const browser=await chromium.launch({headless:true,args:[
 '--enable-webgl','--use-gl=angle','--use-angle=swiftshader',
 '--enable-unsafe-swiftshader']});
const q95=(items,q=.95)=>{
 const a=items.filter(Number.isFinite).sort((x,y)=>x-y);
 return a.length?Math.round(a[Math.floor((a.length-1)*q)]*100)/100:null;
};
async function recordChromeTrace(session,run,saveTracePath){
 const chunks=[];let total=0,readError=null;
 const done=new Promise((resolve,reject)=>{
  const timeout=setTimeout(()=>reject(new Error('Chrome tracingComplete timeout')),45000);
  session.once('Tracing.tracingComplete',async event=>{
   clearTimeout(timeout);
   try{
    assert.ok(event.stream,'Missing authentic Chrome trace stream');
    let doneReading=false;
    while(!doneReading){
     const part=await session.send('IO.read',{handle:event.stream,size:1024*1024});
     const bytes=part.base64Encoded?Buffer.from(part.data,'base64'):Buffer.from(part.data,'utf8');
     chunks.push(bytes);total+=bytes.byteLength;doneReading=part.eof;
     if(total>75*1024*1024)throw Error('Unbounded trace; enforcing 75MiB case limit');
    }
    await session.send('IO.close',{handle:event.stream});
    resolve();
   }catch(e){readError=e;reject(e);}
  });
 });
 await session.send('Tracing.start',{
  transferMode:'ReturnAsStream',
  categories:'toplevel,devtools.timeline,disabled-by-default-devtools.timeline,gpu,disabled-by-default-gpu.service,disabled-by-default-gpu.device,cc,blink,renderer.scheduler'
 });
 let execErr=null;
 try{await run();}catch(e){execErr=e;}
 await session.send('Tracing.end');
 await done;
 if(readError)throw readError;
 const buf=Buffer.concat(chunks),json=JSON.parse(buf.toString('utf8'));
 const events=json.traceEvents??[];
 const processNames=new Map();
 for(const e of events){
  if(e.ph==='M'&&e.name==='process_name')processNames.set(e.pid,e.args?.name??'');
 }
 const accum=new Map(),hist=new Map();
 let gpuEvents=0,totalGpuDurationUs=0,rendererEvents=0;
 for(const e of events){
  if(e.ph!=='X'||typeof e.dur!=='number')continue;
  const proc=processNames.get(e.pid)??'unknown';
  const category=String(e.cat||'');
  const key=proc+' / '+e.name;
  const row=accum.get(key)||{process:proc,event:e.name,category,count:0,durationMs:0,maxMs:0};
  row.count++;row.durationMs+=e.dur/1000;
  row.maxMs=Math.max(row.maxMs,e.dur/1000);
  accum.set(key,row);
  if(/gpu/i.test(proc)||/\bgpu\b/i.test(category)){gpuEvents++;totalGpuDurationUs+=e.dur;}
  if(/renderer/i.test(proc))rendererEvents++;
 }
 const relevant=[...accum.values()].filter(e=>/gpu|angle|raster|draw|shader|commandbuffer|glerror|glgeterror|swap|flush|finish|runTask|update|frame/i.test(e.event+' '+e.process+' '+e.category));
 relevant.sort((a,b)=>b.durationMs-a.durationMs);
 const summary={traceSHA256:hash(buf),traceBytes:buf.length,traceEvents:events.length,
  traceGpuXEvents:gpuEvents,traceRendererXEvents:rendererEvents,
  gpuInstrumentedEventTimeMs:Math.round(totalGpuDurationUs/1000),
  processNames:[...processNames].map(([pid,name])=>({pid,name})),
  topGpuRelatedEvents:relevant.slice(0,35).map(v=>({
   ...v,durationMs:+v.durationMs.toFixed(2),maxMs:+v.maxMs.toFixed(2)})),
  errorQueryNamedEvents:relevant.filter(e=>/geterror|glerror|errorquery/i.test(e.event)).slice(0,15)
 };
 if(saveTracePath){
  const zip=gzipSync(buf,{level:6});
  await writeFile(saveTracePath,zip);
  summary.savedRawTraceGzip=saveTracePath;
  summary.rawTraceGzipSHA256=hash(zip);
 }
 return summary;
}
async function one(viewport,cond,round){
 const [width,height]=viewport;
 const ctx=await browser.newContext({viewport:{width,height},
  deviceScaleFactor:cond.dpr,isMobile:true,hasTouch:true});
 const page=await ctx.newPage(),errors=[];
 page.on('pageerror',error=>errors.push(String(error)));
 page.on('response',r=>{if(r.status()>=400)errors.push('HTTP '+r.status()+' '+r.url());});
 const session=await browser.newBrowserCDPSession();
 try{
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle',timeout:30000});
  await page.waitForFunction(()=>window.__mythwroughtTest&&
   Number(document.querySelector('#scene')?.dataset.loadedChunks)>=25,
   null,{timeout:120000});
  const profile=await page.evaluate(({preset})=>{
   const t=window.__mythwroughtTest;
   const select=document.querySelector('#renderPreset');
   assertGame:
   if(![...select.options].some(o=>o.value===preset))
    throw Error('Original game preset missing '+preset);
   select.value=preset;select.dispatchEvent(new Event('change',{bubbles:true}));
   for(let x=0;x<=2;x++)for(let z=0;z<=2;z++)
    for(let y=-78;y<=-76;y++)
     if(t.placeFixture(x,y,z,0)?.saved!==true)
      throw Error('Original source deep chamber creation/save failed');
   t.teleportCave(1,-78,1);
   return t.fourBiomeMode();
  },cond);
  await page.waitForFunction(p=>document.querySelector('#scene')?.dataset.renderPreset===p &&
   Number(document.querySelector('#scene').dataset.loadedChunks)>=18 &&
   Number(document.querySelector('#scene').dataset.loadedChunks)<=27,
   cond.preset,{timeout:120000});
  const before=await page.evaluate(()=>({
   scene:[document.querySelector('#scene').width,document.querySelector('#scene').height],
   preset:document.querySelector('#scene').dataset.renderPreset,
   art:document.querySelector('#scene').dataset.storybookQuality,
   resident:Number(document.querySelector('#scene').dataset.loadedChunks)
  }));
  assert.equal(before.preset,cond.preset);
  assert.equal(before.art,cond.preset==='economy'?'base-colors':'painted-materials');
  const rawPath=(width===956&&round===0&&['balanced-native','painted-matched','economy-matched'].includes(cond.name))?
   DIR+'/raw-trace-'+cond.name+'-'+width+'x'+height+'.json.gz':null;
  let samples=null;
  const trace=await recordChromeTrace(session,async()=>{
   samples=await page.evaluate(async()=>{
    const t=window.__mythwroughtTest,c=document.querySelector('#scene');
    const samples=[],raf=()=>new Promise(ok=>requestAnimationFrame(ok));
    let previous=await raf();
    for(let y=-79;y>=-102;y--){
     const start=performance.now(),result=t.placeFixture(1,y,1,0);
     if(result?.saved!==true||t.block(1,y,1)!==0)
      throw Error('Authentic original-world source deep edit did not save '+y);
     t.teleportCave(1,y,1);
     const actionMs=performance.now()-start,frame=await raf(),stage=result.gpuStageTimes||{};
     samples.push({y,actionMs,frameIntervalMs:frame-previous,
      uploadMs:result.uploadMs,meshMs:result.meshMs,saveMs:result.saveMs,
      preErrorMs:stage.batchDrainErrorMs??0,
      postErrorMs:stage.batchCheckErrorMs??0,
      bufferSubDataMs:stage.bufferSubDataMs??0,
      uploadBytes:stage.uploadBytes??0,
      staleGLErrors:stage.preexistingErrors??0,
      resident:Number(c.dataset.loadedChunks)});
     previous=frame;
    }
    return {samples,save:JSON.parse(localStorage.getItem('mythwrought-v002-world-179')||'{}'),
     finalFeet:t.m5ObservedPose().feet,renderedFrames:Number(c.dataset.renderedFrames)};
   });
  },rawPath);
  assert.equal(samples.samples.length,24);
  assert.equal(samples.save.schema,1);
  assert.ok(samples.samples.every(v=>v.resident<=27&&v.resident>0));
  assert.ok(samples.finalFeet<-100);
  assert.ok(samples.renderedFrames>0);
  await page.screenshot({path:DIR+'/'+cond.name+'-'+width+'x'+height+'-round'+round+'.png'});
  await page.reload({waitUntil:'networkidle',timeout:30000});
  await page.waitForFunction(()=>window.__mythwroughtTest,null,{timeout:60000});
  assert.equal(await page.evaluate(()=>window.__mythwroughtTest.block(1,-102,1)),
   0,'Original deep edit not persisted across reload');
  assert.deepEqual(errors,[],'Original real WebGL source emitted runtime errors');
  const x=samples.samples;
  const summary={viewport:width+'x'+height,mode:cond.name,
   preset:cond.preset,deviceScaleFactor:cond.dpr,round,
   realBrowser:true,realEdits:x.length,worldProfile:profile,
   actualFramebuffer:before.scene,artQuality:before.art,
   saveSchema:1,saveReloadVerified:true,
   maxResident:Math.max(...x.map(s=>s.resident)),
   actionP95:q95(x.map(s=>s.actionMs)),
   frameP95:q95(x.map(s=>s.frameIntervalMs)),
   uploadP95:q95(x.map(s=>s.uploadMs)),
   preErrorP95:q95(x.map(s=>s.preErrorMs)),
   postErrorP95:q95(x.map(s=>s.postErrorMs)),
   meshP95:q95(x.map(s=>s.meshMs)),
   nativeGPUUploadedBytes:x.reduce((n,s)=>n+s.uploadBytes,0),
   totalStaleErrors:x.reduce((n,s)=>n+s.staleGLErrors,0),
   trace,rawEdits:x
  };
  proof.cases.push(summary);
  await writeFile(DIR+'/angle-shader-trace-samples.json',JSON.stringify(proof,null,2)+'\n');
  console.log('SOURCE_EXACT_ANGLE_CASE',JSON.stringify({
   viewport:summary.viewport,mode:summary.mode,round,
   framebuffer:summary.actualFramebuffer,art:summary.artQuality,
   p95Action:summary.actionP95,p95Frame:summary.frameP95,
   p95Upload:summary.uploadP95,p95ErrorPre:summary.preErrorP95,
   p95ErrorPost:summary.postErrorP95,stale:summary.totalStaleErrors,
   gpuTraceEvents:trace.traceGpuXEvents,traceEvents:trace.traceEvents,
   sourceUploadBytes:summary.nativeGPUUploadedBytes}));
 }finally{await session.detach().catch(()=>{});await ctx.close();}
}
try{
 for(const vp of [[844,390],[956,440]])
  for(let round=0;round<2;round++)
   for(const cond of (round===0?cases:[...cases].reverse()))
    await one(vp,cond,round);
 proof.complete=true;
 proof.pooled=[];
 for(const vp of ['844x390','956x440'])
  for(const cond of cases){
   const matching=proof.cases.filter(c=>c.viewport===vp&&c.mode===cond.name);
   const edits=matching.flatMap(c=>c.rawEdits);
   const p={viewport:vp,mode:cond.name,replicates:matching.length,
    totalOriginalEdits:edits.length,
    framebuffers:matching.map(c=>c.actualFramebuffer),
    sourceArt:matching.map(c=>c.artQuality),
    actionP95:q95(edits.map(e=>e.actionMs)),
    frameP95:q95(edits.map(e=>e.frameIntervalMs)),
    gpuUploadP95:q95(edits.map(e=>e.uploadMs)),
    preErrorP95:q95(edits.map(e=>e.preErrorMs)),
    postErrorP95:q95(edits.map(e=>e.postErrorMs)),
    uploadedBytes:edits.reduce((n,e)=>n+e.uploadBytes,0),
    preexistingGLErrors:edits.reduce((n,e)=>n+e.staleGLErrors,0)};
   proof.pooled.push(p);
  }
 console.log('SOURCE_EXACT_ANGLE_POOLED',JSON.stringify(proof.pooled));
}catch(e){proof.errors.push(String(e?.stack||e));throw e;}
finally{
 await writeFile(DIR+'/angle-shader-trace-samples.json',JSON.stringify(proof,null,2)+'\n');
 await browser.close();
}
