// MYTHWROUGHT #291. Integrated-main REAL WebGL2 error-query trace.
// NO gl.getError calls in this harness. No source responses, GL API, shaders,
// pixel/quality presets, error queue, atomic saves, or game source modified.
// Chrome GPU/renderer tracing observational only, not release certification.
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {gzipSync} from 'node:zlib';
import {execFileSync} from 'node:child_process';
import {chromium} from 'playwright';

const MAIN='7016e14cd6289f45eaf7fc6a79a362b47996df65';
const DIR='artifacts/iphone-integrated-gpu-query-trace';
await mkdir(DIR,{recursive:true});
assert.equal(execFileSync('git',['rev-parse','HEAD^'],{encoding:'utf8'}).trim(),MAIN,
 'Current integrated main must be exact parent');
assert.deepEqual(execFileSync('git',['diff','--name-only',MAIN,'HEAD'],{encoding:'utf8'})
 .trim().split('\n').sort(),[
 '.github/workflows/iphone-integrated-gpu-query-trace.yml',
 'scripts/ci/iphone-integrated-gpu-query-trace.mjs'
]);
const sha=x=>createHash('sha256').update(x).digest('hex');
const [srcMain,srcGpu,srcArt]=await Promise.all([
 readFile('src/main.mjs'),readFile('src/gpu-recovery.mjs'),readFile('src/storybook-materials.mjs')]);
assert.ok(srcGpu.toString().includes('if(gl.getError()===gl.NO_ERROR)'));
assert.ok(srcGpu.toString().includes('const error=gl.getError();'));
assert.ok(srcMain.toString().includes('function refreshEditedMeshes(x,z,y=0)'));
assert.ok(srcArt.toString().includes('uArtQuality<.5'));
const evidence={
 kind:'REAL_INTEGRATED_MAIN_UNMODIFIED_RENDERER_ERROR_QUERY_GPU_TRACE_DIAGNOSTIC',
 mainHead:MAIN,originalSourceSha256:{main:sha(srcMain),gpuRecovery:sha(srcGpu),storybook:sha(srcArt)},
 browser:'Chromium ANGLE SwiftShader WebGL2',physicalIphone:false,
 glGetErrorCallsAddedRemovedDeferredOrConsumed:false,sourceOrShaderChanged:false,
 originalVisualQuality:'balanced painted-materials only',
 note:'Original WebGL2 and source-authoritative browser stats; trace instrumentation changes timing. Single source version: traced vs untraced affects observer overhead only. Not 4x100 acceptance, not a certified fix.',
 cases:[],errors:[],complete:false
};
const p95=(a,q=.95)=>{
 const x=a.filter(Number.isFinite).sort((a,b)=>a-b);
 return x.length?+(x[Math.floor((x.length-1)*q)].toFixed(3)):null;
};
const browser=await chromium.launch({headless:true,args:[
 '--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'
]});
async function traceAround(session,operation,rawTarget){
 const rawParts=[];let bytes=0;
 let endResolve,endReject;
 const ended=new Promise((resolve,reject)=>{endResolve=resolve;endReject=reject;});
 let timeout=null;
 const finished=async event=>{
  try{
   assert.ok(event.stream,'No genuine browser trace stream returned');
   let eof=false;
   while(!eof){
    const part=await session.send('IO.read',{handle:event.stream,size:1048576});
    const chunk=part.base64Encoded?Buffer.from(part.data,'base64'):Buffer.from(part.data,'utf8');
    rawParts.push(chunk);bytes+=chunk.byteLength;
    if(bytes>80*1024*1024)throw Error('Trace exceeded 80MiB diagnostic safety cap');
    eof=part.eof;
   }
   await session.send('IO.close',{handle:event.stream});
   endResolve();
  }catch(e){endReject(e)}
 };
 session.once('Tracing.tracingComplete',finished);
 await session.send('Tracing.start',{
  transferMode:'ReturnAsStream',
  categories:'toplevel,devtools.timeline,disabled-by-default-devtools.timeline,gpu,disabled-by-default-gpu.service,disabled-by-default-gpu.device,cc,blink,renderer.scheduler,blink.user_timing'
 });
 let issue=null;
 try{await operation()}catch(e){issue=e}
 await session.send('Tracing.end');
 timeout=setTimeout(()=>endReject(Error('Chrome original GPU trace did not finalize')),55000);
 try{await ended}finally{clearTimeout(timeout)}
 if(issue)throw issue;
 const raw=Buffer.concat(rawParts),obj=JSON.parse(raw.toString('utf8'));
 assert.ok(Array.isArray(obj.traceEvents)&&obj.traceEvents.length>100,
  'Tracing produced no genuine Chrome source events');
 const proc=new Map();
 for(const e of obj.traceEvents)if(e.ph==='M'&&e.name==='process_name')
  proc.set(e.pid,e.args?.name??'unknown');
 const agg=new Map(),queryEvents=[];
 for(const e of obj.traceEvents){
  if(e.ph!=='X'||!Number.isFinite(e.dur))continue;
  const name=String(e.name||''),process=proc.get(e.pid)||'unknown';
  const key=process+' | '+name;
  let row=agg.get(key);
  if(!row){row={process,name,count:0,totalDurationMs:0,maxDurationMs:0,durations:[]};agg.set(key,row)}
  const duration=e.dur/1000;row.count++;row.totalDurationMs+=duration;
  row.maxDurationMs=Math.max(row.maxDurationMs,duration);
  if(/GetGLError/i.test(name))queryEvents.push({process,durationMs:duration});
  if(row.durations.length<1000)row.durations.push(duration);
 }
 const named=[...agg.values()].filter(x=>/GetGLError|BufferData|BufferSubData|CommandBuffer|Flush|SwapBuffers|DrawArrays|Gpu/i.test(x.name));
 named.sort((a,b)=>b.totalDurationMs-a.totalDurationMs);
 const simplify=x=>({
  process:x.process,event:x.name,count:x.count,
  totalDurationMs:+x.totalDurationMs.toFixed(3),
  maxDurationMs:+x.maxDurationMs.toFixed(3),
  p95DurationMs:p95(x.durations)
 });
 const queryRows=named.filter(x=>/GetGLError/i.test(x.name));
 if(!queryRows.length)throw Error('No original Chrome renderer GLES2::GetGLError trace events: cannot claim GPU sync evidence');
 const totals=queryEvents.map(x=>x.durationMs);
 if(rawTarget){
  const compressed=gzipSync(raw,{level:5});
  await writeFile(rawTarget,compressed);
 }
 return {rawTraceSHA256:sha(raw),traceEvents:obj.traceEvents.length,
  traceBytes:raw.length,rawSaved:rawTarget||null,
  processNames:[...proc.entries()].map(([pid,name])=>({pid,name})),
  totalOriginalQueryEvents:queryEvents.length,originalQueryTotalDurationMs:+totals.reduce((a,b)=>a+b,0).toFixed(3),
  originalQueryP95Ms:p95(totals),originalQueryMaxMs:totals.length?+Math.max(...totals).toFixed(3):null,
  namedErrorQueries:queryRows.map(simplify),
  relatedGpuAndRendererEvents:named.slice(0,28).map(simplify)};
}
async function one([width,height],traced,round){
 const ctx=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,isMobile:true,hasTouch:true});
 const page=await ctx.newPage(),errors=[];
 const tag=width+'x'+height+'-'+(traced?'trace':'control')+'-'+round;
 const session=traced?await browser.newBrowserCDPSession():null;
 page.on('pageerror',e=>errors.push(String(e)));
 page.on('response',r=>{if(r.status()>=400)errors.push('HTTP '+r.status()+' '+r.url())});
 try{
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle',timeout:30000});
  await page.waitForFunction(()=>window.__mythwroughtTest&&
   Number(document.querySelector('#scene')?.dataset.loadedChunks)>=25,
   null,{timeout:120000});
  const prepared=await page.evaluate(()=>{
   const t=window.__mythwroughtTest,s=document.querySelector('#scene');
   if(document.querySelector('#renderPreset')?.value!=='balanced')
    throw Error('Original main not in balanced painted shader mode');
   const pose=t.m5ObservedPose(),profile=t.fourBiomeMode();
   for(let x=0;x<=2;x++)for(let z=0;z<=2;z++)for(let y=-78;y<=-76;y++){
    t.placeFixture(x,y,z,0); // real unmodified main has void return
    if(t.block(x,y,z)!==0)throw Error('Original source cave excavation failed');
   }
   t.teleportCave(1,-78,1);
   return {seed:pose.seed,profile};
  });
  await page.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.loadedChunks)>=18 &&
   Number(document.querySelector('#scene')?.dataset.loadedChunks)<=27,null,{timeout:120000});
  let samples=null;
  const perform=async()=>{
   samples=await page.evaluate(async()=>{
    const t=window.__mythwroughtTest,scene=document.querySelector('#scene');
    const raf=()=>new Promise(resolve=>requestAnimationFrame(resolve));
    const rows=[],baselineFrame=Number(scene.dataset.renderedFrames);
    let last=await raf();
    for(let y=-79;y>=-102;y--){
     const start=performance.now();t.placeFixture(1,y,1,0);
     const elapsed=performance.now()-start;
     if(t.block(1,y,1)!==0)throw Error('Real original deep edit failed '+y);
     t.teleportCave(1,y,1);
     const next=await raf(),snapshot=t.snapshot();
     rows.push({y,actionMs:elapsed,frameIntervalMs:next-last,
      sourceMeshEditedChunks:snapshot.lastEditMeshKeys.length,
      resident:Number(scene.dataset.loadedChunks),
      nonblockGpuBytes:Number(scene.dataset.nonblockGpuBytes||0),
      caveFarDrawn:Number(scene.dataset.c6FarDrawn||0),
      gpuRetryFailures:snapshot.gpuRetry.failures});
     last=next;
    }
    return {rows,renderedFrames:Number(scene.dataset.renderedFrames)-baselineFrame,
     schema:JSON.parse(localStorage.getItem('mythwrought-v002-world-179')||'{}')?.schema,
     position:t.m5ObservedPose().feet,
     graphics:t.snapshot().graphics,
     framebuffer:[scene.width,scene.height],
     quality:scene.dataset.storybookQuality,
     preset:scene.dataset.renderPreset,
     mobSpecies:scene.dataset.mobSpecies};
   });
  };
  const rawTarget=traced&&round===0?DIR+'/chrome-original-main-trace-'+width+'x'+height+'.json.gz':null;
  const trace=traced?await traceAround(session,perform,rawTarget): (await perform(),null);
  assert.equal(samples.rows.length,24);
  assert.ok(samples.rows.every(x=>x.resident>0&&x.resident<=27));
  assert.ok(samples.position<-100);
  assert.equal(samples.schema,1);
  assert.equal(samples.preset,'balanced');
  assert.equal(samples.quality,'painted-materials');
  assert.ok(samples.renderedFrames>=24,'Source original WebGL2 renderer did not advance real frames');
  assert.ok(samples.graphics?.shaderReady,'Original source shader pipeline did not initialize');
  await page.screenshot({path:DIR+'/original-main-'+tag+'.png'});
  await page.reload({waitUntil:'networkidle',timeout:30000});
  await page.waitForFunction(()=>window.__mythwroughtTest,null,{timeout:60000});
  assert.equal(await page.evaluate(()=>window.__mythwroughtTest.block(1,-102,1)),0,
   'Original integrated main schema-1 real edit not persisted');
  assert.deepEqual(errors,[],'Original game produced runtime/page errors');
  const row={viewport:width+'x'+height,round,traced,originalMainSHA:MAIN,
   sourceOriginal:true,realEdits:24,realSaveReload:true,originalSchema1:true,
   wholeWorldSeed:prepared.seed,sourceWorldMode:prepared.profile,
   frameBuffer:samples.framebuffer,artQuality:samples.quality,
   originalPainted:true,mobSpecies:samples.mobSpecies,
   maxResident:Math.max(...samples.rows.map(x=>x.resident)),
   totalObservedResidentEditChunks:samples.rows.reduce((a,b)=>a+b.sourceMeshEditedChunks,0),
   actualActionP95:p95(samples.rows.map(x=>x.actionMs)),
   actualFrameP95:p95(samples.rows.map(x=>x.frameIntervalMs)),
   observedNativeGpuUploadP95:null,
   observedGPUFaultCountEnd:samples.rows.at(-1)?.gpuRetryFailures,
   trace,rawSamples:samples.rows
  };
  evidence.cases.push(row);
  await writeFile(DIR+'/gpu-error-query-original-source.json',JSON.stringify(evidence,null,2)+'\n');
  console.log('SOURCE_REAL_INTEGRATED_GPU_QUERY_CASE',JSON.stringify({
   viewport:row.viewport,round,traced,actionP95:row.actualActionP95,
   frameP95:row.actualFrameP95,
   queryEvents:trace?.totalOriginalQueryEvents??null,
   queryTotalMs:trace?.originalQueryTotalDurationMs??null,
   queryP95:trace?.originalQueryP95Ms??null,
   sourceEditChunkCount:row.totalObservedResidentEditChunks,
   trueEdits:row.realEdits,art:row.artQuality,bytes:row.frameBuffer,
   mainHead:MAIN}));
 }finally{
  if(session)await session.detach().catch(()=>{});
  await ctx.close();
 }
}
try{
 for(const size of [[844,390],[956,440]])for(let round=0;round<2;round++){
  const order=round===0?[false,true]:[true,false];
  for(const tracing of order)await one(size,tracing,round);
 }
 evidence.complete=true;
 evidence.pooled=[];
 for(const viewport of ['844x390','956x440'])for(const traced of [false,true]){
  const cases=evidence.cases.filter(x=>x.viewport===viewport&&x.traced===traced);
  const edits=cases.flatMap(c=>c.rawSamples);
  evidence.pooled.push({viewport,traced,replicates:cases.length,originalWorldEdits:edits.length,
   originalSourceActionP95:p95(edits.map(x=>x.actionMs)),
   originalRafFrameP95:p95(edits.map(x=>x.frameIntervalMs)),
   originalTotalEditedChunkUploads:edits.reduce((a,b)=>a+b.sourceMeshEditedChunks,0),
   caveat:'Chrome traces alter observed timing; not strict original 4x100 release performance'});
 }
 console.log('SOURCE_REAL_INTEGRATED_GPU_QUERY_POOLED',JSON.stringify(evidence.pooled));
}catch(e){evidence.errors.push(String(e?.stack||e));throw e;}
finally{
 await writeFile(DIR+'/gpu-error-query-original-source.json',JSON.stringify(evidence,null,2)+'\n');
 await browser.close();
}
