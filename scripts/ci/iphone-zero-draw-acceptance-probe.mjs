// Mythwrought issue #291: test-only zero-vertex opaque draw elision.
// The repo gameplay source remains BYTE IDENTICAL to protected PR #294.
// Only this isolated test browser optionally receives one exact in-memory
// source transformation: skip gl.drawArrays when c.count === 0. No WebGL
// methods are monkeypatched, and zero vertices produce zero primitives.
// GPU gl.getError guards, staging, rollback, saving, shaders and sky unchanged.
// Diagnostic NOT original strict 4x100, physical iPhone or release certification.
import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {chromium} from 'playwright';

const PR='82f8828945b464acf0a71faddfe2d18ffa4df245';
const MAIN='8de40ca8451b6268cfdfefaa5d9a66b72caca799';
const dir='artifacts/iphone-zero-draw';
await mkdir(dir,{recursive:true});
assert.equal(execFileSync('git',['rev-parse','HEAD^'],{encoding:'utf8'}).trim(),PR);
assert.equal(execFileSync('git',['-C','baseline-main','rev-parse','HEAD'],{encoding:'utf8'}).trim(),MAIN);
assert.deepEqual(execFileSync('git',['diff','--name-only',PR,'HEAD'],{encoding:'utf8'})
 .trim().split('\n').sort(),[
 '.github/workflows/iphone-zero-draw-acceptance-probe.yml',
 'scripts/ci/iphone-zero-draw-acceptance-probe.mjs']);
const sha=x=>createHash('sha256').update(x).digest('hex');
const originalSource=await readFile('src/main.mjs','utf8');
const anchor='      for(const c of chunks.values()){\n        gl.bindBuffer(gl.ARRAY_BUFFER,c.buffer);';
const replacement='      for(const c of chunks.values()){\n        if(c.count===0)continue;\n        gl.bindBuffer(gl.ARRAY_BUFFER,c.buffer);';
assert.equal(originalSource.split(anchor).length,2,
 'Exactly one original opaque draw loop must match');
const modifiedSource=originalSource.replace(anchor,replacement);
assert.equal(modifiedSource.replace(replacement,anchor),originalSource,
 'Only one zero-count test condition may differ in the in-memory HTTP response');
assert.ok(!replacement.includes('getError')&&!replacement.includes('save('));
const proof={
 kind:'ORIGINAL_SOURCE_ZERO_VERTEX_DRAW_IN_MEMORY_DIAGNOSTIC_NOT_RELEASE',
 protectedPr:PR,productionMain:MAIN,
 sourceOnGitUnmodified:true,originalSourceSHA256:sha(originalSource),
 testOnlyResponseSHA256:sha(modifiedSource),
 exactPatch:{old:anchor,new:replacement},
 noAdditionalGlErrorCalls:true,renderOutputMathematicallyEquivalentForZeroVertexDraws:true,
 releasePixelParityAcceptance:false,originalPerformanceGateUnchanged:true,
 conditions:['original','skip-zero-count'],
 realIphone:false,complete:false,cases:[],errors:[]
};
const quant=(arr,q)=>{const x=arr.filter(Number.isFinite).sort((a,b)=>a-b);
 return x.length?Math.round(x[Math.floor((x.length-1)*q)]*100)/100:null;};
const browser=await chromium.launch({headless:true,args:[
 '--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'
]});
async function one(viewport,mode,round){
 const [width,height]=viewport;
 const ctx=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,
  isMobile:true,hasTouch:true});
 const page=await ctx.newPage(),pageErrors=[];
 let patchResponses=0,observedOriginalBytes=0;
 page.on('pageerror',e=>pageErrors.push(String(e)));
 page.on('response',r=>{if(r.status()>=400)pageErrors.push('HTTP '+r.status()+' '+r.url());});
 try{
  if(mode==='skip-zero-count'){
   await page.route('**/src/main.mjs?*',async route=>{
    const response=await route.fetch(),body=await response.text();
    assert.equal(sha(body),sha(originalSource),
     'Source server bytes differ from pinned protected PR main.js');
    patchResponses++;observedOriginalBytes+=body.length;
    await route.fulfill({response,body:modifiedSource,
      headers:{...response.headers(),'content-type':'text/javascript'}});
   });
  }
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle',timeout:30000});
  await page.waitForFunction(()=>window.__mythwroughtTest&&
   Number(document.querySelector('#scene')?.dataset.loadedChunks)>=25,null,{timeout:120000});
  const prepared=await page.evaluate(()=>{
   const t=window.__mythwroughtTest;
   for(let x=0;x<=2;x++)for(let z=0;z<=2;z++)
    for(let y=-78;y<=-76;y++)
     if(t.placeFixture(x,y,z,0)?.saved!==true)
      throw Error('Original deep shaft was not saved');
   t.teleportCave(1,-78,1);
   return {profile:t.fourBiomeMode(),seed:t.m5ObservedPose().seed};
  });
  await page.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.loadedChunks)===27,
   null,{timeout:120000});
  const q=await page.evaluate(async()=>{
   const t=window.__mythwroughtTest,c=document.querySelector('#scene');
   const samples=[],startRenderedFrames=Number(c.dataset.renderedFrames);
   for(let y=-79;y>=-102;y--){
    const before=performance.now(),v=t.placeFixture(1,y,1,0);
    if(!v?.saved||t.block(1,y,1)!==0)
     throw Error('Actual protected source GPU edit or schema-1 save failed at '+y);
    t.teleportCave(1,y,1);
    const actionMs=performance.now()-before,
     next=await new Promise(resolve=>requestAnimationFrame(resolve));
    const stages=v.gpuStageTimes||{};
    samples.push({y,actionMs,uploadMs:v.uploadMs,meshMs:v.meshMs,
     saveMs:v.saveMs,guardPreMs:stages.batchDrainErrorMs??0,
     guardPostMs:stages.batchCheckErrorMs??0,staleErrors:stages.preexistingErrors??0,
     bufferSubDataMs:stages.bufferSubDataMs??0,
     uploadBytes:stages.uploadBytes??0,
     gpuResident:Number(c.dataset.loadedChunks)});
   }
   return {samples,renderedFrames:Number(c.dataset.renderedFrames)-startRenderedFrames,
    frameBuffer:[c.width,c.height],preset:c.dataset.renderPreset,
    save:JSON.parse(localStorage.getItem('mythwrought-v002-world-179')||'{}'),
    playerFeet:t.m5ObservedPose().feet};
  });
  assert.equal(q.samples.length,24);
  assert.equal(q.preset,'balanced','Do not silently reduce quality to claim speed');
  assert.ok(q.renderedFrames>0,'Real WebGL renderer did not run');
  assert.equal(q.save.schema,1);
  assert.ok(q.samples.every(v=>v.gpuResident<=27&&v.gpuResident>0));
  assert.ok(q.playerFeet<-100);
  if(mode==='skip-zero-count')assert.ok(patchResponses>=1,'Test-only in-memory change never loaded');
  await page.screenshot({path:dir+'/'+mode+'-'+width+'x'+height+'-round'+round+'.png'});
  await page.reload({waitUntil:'networkidle',timeout:30000});
  await page.waitForFunction(()=>window.__mythwroughtTest,null,{timeout:60000});
  assert.equal(await page.evaluate(()=>window.__mythwroughtTest.block(1,-102,1)),0,
   'Original persistent deep edit was lost');
  assert.deepEqual(pageErrors,[],'Original game runtime errors');
  const stat=k=>({p50:quant(q.samples.map(v=>v[k]),.5),
   p95:quant(q.samples.map(v=>v[k]),.95)});
  const result={viewport:width+'x'+height,mode,round,
   originalSourceSHA256:proof.originalSourceSHA256,
   testOnlyPatchApplied:mode==='skip-zero-count',
   routeResponses:patchResponses,observedOriginalBytes,realEdits:24,
   nativeFrameCount:q.renderedFrames,frameBuffer:q.frameBuffer,
   profile:prepared.profile,worldSeed:prepared.seed,saveSchema:1,
   saveReloadVerified:true,maxResident:Math.max(...q.samples.map(v=>v.gpuResident)),
   action:stat('actionMs'),upload:stat('uploadMs'),
   drain:stat('guardPreMs'),post:stat('guardPostMs'),
   mesh:stat('meshMs'),save:stat('saveMs'),
   actualSourceGpuBytes:q.samples.reduce((n,v)=>n+v.uploadBytes,0),
   staleErrors:q.samples.reduce((n,v)=>n+v.staleErrors,0),
   samples:q.samples};
  proof.cases.push(result);
  await writeFile(dir+'/zero-draw-original-real-gl.json',JSON.stringify(proof,null,2)+'\n');
  console.log('REAL_ZERO_DRAW_SOURCE_CASE',JSON.stringify({
   viewport:result.viewport,mode,round,actionP95:result.action.p95,
   uploadP95:result.upload.p95,guardDrainP95:result.drain.p95,
   guardPostP95:result.post.p95,realFrames:result.nativeFrameCount,
   resident:result.maxResident,uploadedBytes:result.actualSourceGpuBytes,
   sourcePatchOnly:result.testOnlyPatchApplied}));
 }finally{await ctx.close();}
}
try{
 for(const vp of [[844,390],[956,440]])for(let round=0;round<2;round++)
  for(const mode of round===0?['original','skip-zero-count']:['skip-zero-count','original'])
   await one(vp,mode,round);
 proof.complete=true;
 proof.pooled=[];
 for(const vp of ['844x390','956x440'])for(const mode of proof.conditions){
  const cases=proof.cases.filter(c=>c.viewport===vp&&c.mode===mode);
  const samples=cases.flatMap(c=>c.samples);
  proof.pooled.push({viewport:vp,mode,replicates:cases.length,realEdits:samples.length,
   actionP95:quant(samples.map(s=>s.actionMs),.95),
   gpuUploadP95:quant(samples.map(s=>s.uploadMs),.95),
   guardedPreP95:quant(samples.map(s=>s.guardPreMs),.95),
   guardedPostP95:quant(samples.map(s=>s.guardPostMs),.95),
   sourceUploadedBytes:samples.reduce((n,s)=>n+s.uploadBytes,0),
   zeroStaleErrors:samples.every(s=>s.staleErrors===0)});
 }
 console.log('REAL_ZERO_DRAW_POOLED_DIAGNOSTIC',JSON.stringify(proof.pooled));
}catch(e){proof.errors.push(String(e?.stack||e));throw e;}
finally{
 await writeFile(dir+'/zero-draw-original-real-gl.json',JSON.stringify(proof,null,2)+'\n');
 await browser.close();
}
