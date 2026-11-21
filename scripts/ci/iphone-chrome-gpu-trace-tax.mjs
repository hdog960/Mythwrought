// MYTHWROUGHT #291 — quantify Chrome detailed GPU tracing tax on original guarded source upload.
// Diagnostic browser response only. Checked-in game sources and CI unchanged.
// Original gl.getError() remains twice in source in the same control-flow order:
// one inside original 8-bound predrain, one mandatory post-upload error check.
// Timestamp wrappers return each native GL result unmodified. NO added GL calls.
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {gzipSync} from 'node:zlib';
import {execFileSync} from 'node:child_process';
import {PNG} from 'pngjs';
import {chromium} from 'playwright';

const MAIN='7016e14cd6289f45eaf7fc6a79a362b47996df65';
const DIR='artifacts/iphone-chrome-gpu-trace-tax';
await mkdir(DIR,{recursive:true});
assert.equal(execFileSync('git',['rev-parse','HEAD^'],{encoding:'utf8'}).trim(),MAIN);
assert.deepEqual(execFileSync('git',['diff','--name-only',MAIN,'HEAD'],{encoding:'utf8'}).trim().split('\n').sort(),[
 '.github/workflows/iphone-chrome-gpu-trace-tax.yml',
 'scripts/ci/iphone-chrome-gpu-trace-tax.mjs'
]);
const sha=x=>createHash('sha256').update(x).digest('hex');
const [source,game,shader]=await Promise.all([
 readFile('src/gpu-recovery.mjs','utf8'),readFile('src/main.mjs','utf8'),readFile('src/storybook-materials.mjs','utf8')
]);
assert.ok(game.includes('function refreshEditedMeshes(x,z,y=0)'));
assert.ok(shader.includes('uArtQuality<.5'));
const replaceOnce=(str,old,newValue)=>{
 assert.equal(str.split(old).length,2,'Original GPU source anchor mismatch '+old);
 return str.replace(old,newValue);
};
const instrumentation=[
'  const __mw291Start=performance.now();',
'  const __mw291Recording=globalThis.__mw291UploadActive===true;',
'  const __mw291Row=__mw291Recording?{bytes:vertices.byteLength,preErrorReads:0,postErrorReads:0,createMs:0,drainMs:0,bindMs:0,dataMs:0,checkMs:0,totalMs:0}:null;',
'  const __mw291Time=(phase,operation)=>{',
'    if(!__mw291Row)return operation();',
'    const started=performance.now();',
'    try{return operation();}',
'    finally{__mw291Row[phase]+=performance.now()-started;',
'      if(phase==="drainMs")__mw291Row.preErrorReads++;',
'      if(phase==="checkMs")__mw291Row.postErrorReads++;}',
'  };'
].join('\n');
let variant=replaceOnce(source,
 'export function uploadChunkBuffer(gl,vertices){',
 'export function uploadChunkBuffer(gl,vertices){\n'+instrumentation);
variant=replaceOnce(variant,'  const buffer=gl.createBuffer();',
 '  const buffer=__mw291Time("createMs",()=>gl.createBuffer());');
variant=replaceOnce(variant,'      if(gl.getError()===gl.NO_ERROR){cleared=true;break;}',
 '      if(__mw291Time("drainMs",()=>gl.getError())===gl.NO_ERROR){cleared=true;break;}');
variant=replaceOnce(variant,'    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);',
 '    __mw291Time("bindMs",()=>gl.bindBuffer(gl.ARRAY_BUFFER,buffer));');
variant=replaceOnce(variant,'    gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);',
 '    __mw291Time("dataMs",()=>gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW));');
variant=replaceOnce(variant,'    const error=gl.getError();',
 '    const error=__mw291Time("checkMs",()=>gl.getError());');
variant=replaceOnce(variant,'  }catch(error){gl.deleteBuffer(buffer);throw error;}\n}',
 '  }catch(error){gl.deleteBuffer(buffer);throw error;}\n'+
 '  finally{if(__mw291Row){__mw291Row.totalMs=performance.now()-__mw291Start;\n'+
 '    (globalThis.__mw291UploadRecords??=[]).push(__mw291Row);}}\n}');
const srcNativeCalls=s=>[...s.matchAll(/gl\.getError\(\)/g)].length;
assert.equal(srcNativeCalls(source),2);
assert.equal(srcNativeCalls(variant),2);
assert.ok(variant.includes('for(let i=0;i<8;i++)'));
assert.ok(variant.includes('if(__mw291Time("drainMs",()=>gl.getError())===gl.NO_ERROR)'));
assert.ok(variant.includes('const error=__mw291Time("checkMs",()=>gl.getError());'));
assert.ok(variant.includes('if(error!==gl.NO_ERROR)'));
assert.ok(variant.includes('catch(error){gl.deleteBuffer(buffer);throw error;}'));
const proof={
 kind:'CURRENT_INTEGRATED_SOURCE_IDENTICAL_GPU_TRACING_INSTRUMENTATION_TAX',
 exactMainSHA:MAIN,
 sourceSHA256:{gpu:sha(source),game:sha(game),shader:sha(shader),testOnlyGpuInstrumented:sha(variant)},
 currentMainGameSourceCommittedChanges:false,
 currentMainShaderAndMaterialsUnchanged:true,
 glGetErrorNativeExpressionCountAndOrderPreserved:true,
 original8BoundErrorDrainAndMandatoryPostCheckPreserved:true,
 exactSameOriginalSourceApartFromTestOnlyTimestamps:true,
 caveat:'Both conditions have identical native original WebGL calls and identical timing wrappers. Only Chrome detailed GPU process tracing differs. Instrumentation can alter measured timings, not a fix or strict four-by-100/iPhone acceptance.',
 cases:[],pixelChecks:[],errors:[],complete:false
};
const p95=x=>{const a=x.filter(Number.isFinite).sort((x,y)=>x-y);return a.length?+a[Math.floor((a.length-1)*.95)].toFixed(3):null};
const browser=await chromium.launch({headless:true,args:[
 '--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'
]});

// Browser-only detailed GPU tracing; NOT a WebGL instrumentation or call.
// This deliberately enables the same GPU service tracing categories as
// prior evidence, to QUANTIFY their measurement overhead on identical source.
async function captureOriginalGpuTrace(session,operation,dest){
 let resolveEnd,rejectEnd;
 const ended=new Promise((ok,bad)=>{resolveEnd=ok;rejectEnd=bad});
 const chunks=[];let total=0;const CAP=80*1024*1024;
 session.once('Tracing.tracingComplete',async event=>{
  try{
   assert.ok(event.stream,'Native Chrome trace stream absent');
   for(;;){
    const part=await session.send('IO.read',{handle:event.stream,size:1024*1024});
    const piece=part.base64Encoded?Buffer.from(part.data,'base64'):Buffer.from(part.data,'utf8');
    chunks.push(piece);total+=piece.byteLength;
    assert.ok(total<CAP,'GPU trace too large for bounded diagnostic');
    if(part.eof)break;
   }
   await session.send('IO.close',{handle:event.stream});
   resolveEnd();
  }catch(e){rejectEnd(e)}
 });
 await session.send('Tracing.start',{transferMode:'ReturnAsStream',
  categories:'toplevel,devtools.timeline,disabled-by-default-devtools.timeline,gpu,disabled-by-default-gpu.service,disabled-by-default-gpu.device,cc,blink,renderer.scheduler'});
 let err=null;
 try{await operation()}catch(e){err=e}
 await session.send('Tracing.end');
 let h;
 try{
  await Promise.race([ended,new Promise((_,reject)=>{
   h=setTimeout(()=>reject(Error('Original GPU tracing timeout')),55000)})]);
 }finally{clearTimeout(h)}
 if(err)throw err;
 const raw=Buffer.concat(chunks),obj=JSON.parse(raw.toString('utf8'));
 assert.ok(Array.isArray(obj.traceEvents)&&obj.traceEvents.length>1000,'No native GPU trace');
 const proc=new Map();
 for(const e of obj.traceEvents)if(e.ph==='M'&&e.name==='process_name')
  proc.set(e.pid,e.args?.name??'unknown');
 const tally=new Map();
 for(const e of obj.traceEvents){
  if(e.ph!=='X'||!Number.isFinite(e.dur))continue;
  const key=proc.get(e.pid)+' | '+String(e.name);
  const cur=tally.get(key)||{count:0,ms:0,maxMs:0};
  cur.count++;cur.ms+=e.dur/1000;cur.maxMs=Math.max(cur.maxMs,e.dur/1000);
  tally.set(key,cur);
 }
 const get=(name)=>[...tally].filter(([k])=>k.includes(name))
  .map(([event,v])=>({event,count:v.count,totalMs:+v.ms.toFixed(2),maxMs:+v.maxMs.toFixed(2)}));
 const gpuTracers=get('GPUTracer::ProcessTraces').filter(q=>q.event.startsWith('GPU Process |'));
 const makes=get('GLContextEGL::MakeCurrent').filter(q=>q.event.startsWith('GPU Process |'));
 const glErrors=get('GLES2::GetGLError').filter(q=>q.event.startsWith('Renderer |'));
 const result={rawOriginalTraceSHA256:sha(raw),rawBytes:raw.length,
  rawTraceEvents:obj.traceEvents.length,allGpuProcessNames:[...proc.values()],
  gpuTracerEvents:gpuTracers.reduce((a,b)=>a+b.count,0),
  gpuTracerInclusiveMs:gpuTracers.reduce((a,b)=>a+b.totalMs,0),
  gpuContextMakeCurrentEvents:makes.reduce((a,b)=>a+b.count,0),
  gpuContextMakeCurrentInclusiveMs:makes.reduce((a,b)=>a+b.totalMs,0),
  rendererGlGetErrorEvents:glErrors.reduce((a,b)=>a+b.count,0),
  rendererGlGetErrorInclusiveMs:glErrors.reduce((a,b)=>a+b.totalMs,0),
  warning:'ALL these are inclusive overlapping Chrome instrumentation costs. Do not sum nested durations or claim untraced GPU work.'};
 assert.ok(result.gpuTracerEvents>100,'Detailed GPU Process trace did not instrument tracer');
 assert.ok(result.rendererGlGetErrorEvents>0,'Native renderer GL error events not traced');
 const zipped=gzipSync(raw,{level:5});
 await writeFile(dest,zipped);
 result.rawGzipSHA256=sha(zipped);result.rawTracePath=dest;
 return result;
}

async function one([w,h],traced,round){
 const instrumented=true;
 const session=traced?await browser.newBrowserCDPSession():null;
 const ctx=await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:1,isMobile:true,hasTouch:true});
 const page=await ctx.newPage(),errors=[];let intercepted=0;
 if(instrumented)await page.route('**/src/gpu-recovery.mjs*',async route=>{
   const res=await route.fetch(),actual=await res.text();
   assert.equal(sha(actual),sha(source),'Original WebGL upload source changed under us');
   intercepted++;
   await route.fulfill({response:res,body:variant,contentType:'text/javascript'});
 });
 page.on('pageerror',e=>errors.push(String(e)));
 page.on('response',res=>{if(res.status()>=400)errors.push('HTTP '+res.status()+' '+res.url())});
 try{
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle',timeout:30000});
  await page.waitForFunction(()=>window.__mythwroughtTest&&Number(document.querySelector('#scene')?.dataset.loadedChunks)>=25,
   null,{timeout:120000});
  const setup=await page.evaluate(()=>{
    const t=window.__mythwroughtTest,scene=document.querySelector('#scene');
    if(document.querySelector('#renderPreset')?.value!=='balanced')throw Error('Not original balanced visual preset');
    const profile=t.fourBiomeMode(),seed=t.m5ObservedPose().seed;
    for(let x=0;x<=2;x++)for(let z=0;z<=2;z++)for(let y=-78;y<=-76;y++){
     t.placeFixture(x,y,z,0);
     if(t.block(x,y,z)!==0)throw Error('Original 3D excavation failed');
    }
    t.teleportCave(1,-78,1);
    return {profile,seed};
  });
  await page.waitForFunction(()=>Number(document.querySelector('#scene').dataset.loadedChunks)>=18&&
   Number(document.querySelector('#scene').dataset.loadedChunks)<=27,null,{timeout:120000});
  let sample=null;
  const perform=async()=>{sample=await page.evaluate(async({instrumented})=>{
   const t=window.__mythwroughtTest,scene=document.querySelector('#scene'),
    raf=()=>new Promise(resolve=>requestAnimationFrame(resolve));
   let last=await raf();const rows=[];
   for(let y=-79;y>=-102;y--){
     if(instrumented){globalThis.__mw291UploadRecords=[];globalThis.__mw291UploadActive=true;}
     let result,actionMs;
     try{
       const start=performance.now();
       result=t.placeFixture(1,y,1,0);
       actionMs=performance.now()-start;
     }finally{if(instrumented)globalThis.__mw291UploadActive=false;}
     if(result!==undefined)throw Error('Current original main fixture ABI changed');
     if(t.block(1,y,1)!==0)throw Error('Real original deep edit failed at '+y);
     const uploads=instrumented?globalThis.__mw291UploadRecords.map(x=>({...x})):[];
     t.teleportCave(1,y,1);
     const next=await raf();
     const snapshot=t.snapshot();
     rows.push({y,actionMs,frameMs:next-last,
       resident:Number(scene.dataset.loadedChunks),
       gpuFailures:snapshot.gpuRetry.failures,
       changedMeshKeys:snapshot.lastEditMeshKeys.length,
       uploads});
     last=next;
   }
   for(let i=0;i<3;i++)await raf();
   return {rows,framebuffer:[scene.width,scene.height],
    art:scene.dataset.storybookQuality,preset:scene.dataset.renderPreset,
    feet:t.m5ObservedPose().feet,schema:t.snapshot().seed,
    graphics:t.snapshot().graphics};
  },{instrumented});};
  const trace=traced?await captureOriginalGpuTrace(session,perform,DIR+'/trace-'+w+'x'+h+'-round'+round+'.json.gz'):(await perform(),null);
  assert.equal(sample.rows.length,24);
  assert.ok(sample.feet<-100);
  assert.equal(sample.art,'painted-materials');
  assert.equal(sample.preset,'balanced');
  assert.equal(sample.schema,setup.seed);
  assert.ok(sample.graphics.shaderReady);
  assert.ok(sample.rows.every(e=>e.resident>0&&e.resident<=27&&e.gpuFailures===0));
  if(instrumented){
   assert.equal(intercepted,1,'Exactly one original GPU module response was instrumented');
   assert.ok(sample.rows.some(e=>e.uploads.length),'Timed original code reported zero uploads');
   assert.ok(sample.rows.flatMap(e=>e.uploads).every(x=>x.preErrorReads>=1&&x.preErrorReads<=8&&x.postErrorReads===1&&x.totalMs>=x.checkMs),'Native original pre/post error checks changed');
  }
  const image=DIR+'/'+w+'x'+h+'-'+(traced?'gpu-trace':'no-trace')+'-round'+round+'.png';
  await page.locator('#scene').screenshot({path:image});
  await page.reload({waitUntil:'networkidle',timeout:30000});
  await page.waitForFunction(()=>window.__mythwroughtTest,null,{timeout:60000});
  assert.equal(await page.evaluate(()=>window.__mythwroughtTest.block(1,-102,1)),0,'Original deep edits not saved across real reload');
  assert.deepEqual(errors,[],'Original integrated browser runtime faults');
  const uploads=sample.rows.flatMap(e=>e.uploads);
  const uploadGroups=sample.rows.map(e=>e.uploads.reduce((sum,u)=>sum+u.totalMs,0));
  const row={viewport:w+'x'+h,round,traced,instrumented,trace,realWebGL2:true,
   originalCurrentMain:MAIN,realEdits:24,sourceWorldProfile:setup.profile,
   originalFullPainted:true,originalSchema1Reload:true,
   framebuffer:sample.framebuffer,
   maxResident:Math.max(...sample.rows.map(e=>e.resident)),
   actionP95:p95(sample.rows.map(e=>e.actionMs)),
   frameP95:p95(sample.rows.map(e=>e.frameMs)),
   nativeOriginalGpuUploads:uploads.length,
   sourceReportedChangedChunks:sample.rows.reduce((n,e)=>n+e.changedMeshKeys,0),
   perBufferGuardedUploadP95:instrumented?p95(uploads.map(u=>u.totalMs)):null,
   perEditGuardedUploadP95:instrumented?p95(uploadGroups):null,
   perBufferErrorDrainP95:instrumented?p95(uploads.map(u=>u.drainMs)):null,
   perBufferErrorPostCheckP95:instrumented?p95(uploads.map(u=>u.checkMs)):null,
   perBufferGpuBufferDataP95:instrumented?p95(uploads.map(u=>u.dataMs)):null,
   totalUploadsBytes:uploads.reduce((n,u)=>n+u.bytes,0),
   totalPreErrorReads:uploads.reduce((n,u)=>n+u.preErrorReads,0),
   totalPostErrorReads:uploads.reduce((n,u)=>n+u.postErrorReads,0),
   originalGLFaults:sample.rows.at(-1).gpuFailures,
   screenshot:image,allRawEditSamples:sample.rows};
  proof.cases.push(row);
  await writeFile(DIR+'/original-gpu-trace-overhead.json',JSON.stringify(proof,null,2)+'\n');
  console.log('MYTHWROUGHT_GPU_TRACING_TAX_CASE',JSON.stringify({
   viewport:row.viewport,round,traced,instrumented,realEdits:24,
   actionP95:row.actionP95,frameP95:row.frameP95,
   perEditUploadP95:row.perEditGuardedUploadP95,
   perBufferUploadP95:row.perBufferGuardedUploadP95,
   preErrorDrainP95:row.perBufferErrorDrainP95,
   postErrorCheckP95:row.perBufferErrorPostCheckP95,
   bufferDataP95:row.perBufferGpuBufferDataP95,
   actualUploads:row.nativeOriginalGpuUploads,
   originalQuality:row.originalFullPainted,saveReload:true}));
 }finally{if(session)await session.detach().catch(()=>{});await ctx.close();}
}
try{
 for(const size of [[844,390],[956,440]])for(let round=0;round<2;round++){
  const order=round===0?[false,true]:[true,false];
  for(const mode of order)await one(size,mode,round);
  const file=mode=>DIR+'/'+size[0]+'x'+size[1]+'-'+(mode?'gpu-trace':'no-trace')+'-round'+round+'.png';
  const a=PNG.sync.read(await readFile(file(false))),b=PNG.sync.read(await readFile(file(true)));
  assert.equal(a.width,b.width);assert.equal(a.height,b.height);
  let diff=0,maxDiff=0;
  for(let i=0;i<a.data.length;i+=4){
   let pixelDiff=false;
   for(let k=0;k<4;k++){const d=Math.abs(a.data[i+k]-b.data[i+k]);
    if(d){pixelDiff=true;maxDiff=Math.max(maxDiff,d);}}
   if(pixelDiff)diff++;
  }
  const row={viewport:size[0]+'x'+size[1],round,changedPixels:diff,
   totalPixels:a.width*a.height,maxChannelDiff:maxDiff,
   exactFramebufferPixelParity:diff===0};
  proof.pixelChecks.push(row);
  console.log('MYTHWROUGHT_GPU_TRACING_TAX_PIXEL_CHECK',JSON.stringify(row));
 }
 proof.pooled=[];
 for(const viewport of ['844x390','956x440'])for(const mode of [false,true]){
  const sessions=proof.cases.filter(s=>s.viewport===viewport&&s.traced===mode);
  const edits=sessions.flatMap(s=>s.allRawEditSamples);
  const allBuffers=edits.flatMap(e=>e.uploads);
  const perEdit=edits.map(e=>e.uploads.reduce((sum,u)=>sum+u.totalMs,0));
  proof.pooled.push({viewport,traced:mode,instrumented:true,sessions:sessions.length,realEdits:edits.length,
   gpuTraceEvents:mode?sessions.reduce((v,c)=>v+(c.trace?.gpuTracerEvents??0),0):0,
   cpuGpuContextMakeCurrentEvents:mode?sessions.reduce((v,c)=>v+(c.trace?.gpuContextMakeCurrentEvents??0),0):0,
   actionP95:p95(edits.map(e=>e.actionMs)),frameP95:p95(edits.map(e=>e.frameMs)),
   sourceNativeBufferUploads:allBuffers.length,
   perBufferTotalGuardedUploadP95:p95(allBuffers.map(e=>e.totalMs)),
   perEditTotalGuardedUploadP95:p95(perEdit),
   perBufferOriginalPreErrorDrainP95:p95(allBuffers.map(e=>e.drainMs)),
   perBufferOriginalPostErrorCheckP95:p95(allBuffers.map(e=>e.checkMs)),
   perBufferOriginalGpuBufferDataP95:p95(allBuffers.map(e=>e.dataMs)),
   totalPreExistingGlGetErrorReads:allBuffers.reduce((sum,x)=>sum+x.preErrorReads+x.postErrorReads,0)});
 }
 proof.complete=true;
 console.log('MYTHWROUGHT_GPU_TRACING_TAX_POOLED',JSON.stringify({
  pooled:proof.pooled,
  pixelParityAllTestedFrames:proof.pixelChecks.every(c=>c.exactFramebufferPixelParity)}));
}catch(e){proof.errors.push(String(e?.stack||e));throw e;}
finally{
 await writeFile(DIR+'/original-gpu-trace-overhead.json',JSON.stringify(proof,null,2)+'\n');
 await browser.close();
}
