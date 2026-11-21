// MYTHWROUGHT #291 actual integrated-current-main vs protected draft (READ ONLY).
// Two completely unmodified real game distributions served from separate ports.
// No gl.getError calls, shader interception, WebGL monkeypatching, or changes to
// any original graphics, buffered rollback, world saves or strict CI thresholds.
import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {chromium} from 'playwright';
const MAIN='7016e14cd6289f45eaf7fc6a79a362b47996df65';
const DRAFT='82f8828945b464acf0a71faddfe2d18ffa4df245';
const DIR='artifacts/iphone-integrated-main-original-digging';
await mkdir(DIR,{recursive:true});
const diff=execFileSync('git',['diff','--name-only',MAIN,'HEAD'],{encoding:'utf8'}).trim().split('\n').sort();
assert.deepEqual(diff,[
 '.github/workflows/iphone-new-main-digging-observation.yml',
 'scripts/ci/iphone-new-main-digging-observation.mjs']);
assert.equal(execFileSync('git',['rev-parse','HEAD^'],{encoding:'utf8'}).trim(),MAIN);
assert.equal(execFileSync('git',['-C','baseline-draft','rev-parse','HEAD'],{encoding:'utf8'}).trim(),DRAFT);
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const originalSources={
 main:{gpu:hash(await readFile('src/gpu-recovery.mjs')),
       engine:hash(await readFile('src/main.mjs')),
       shader:hash(await readFile('src/storybook-materials.mjs'))},
 draft:{gpu:hash(await readFile('baseline-draft/src/gpu-recovery.mjs')),
        engine:hash(await readFile('baseline-draft/src/main.mjs')),
        shader:hash(await readFile('baseline-draft/src/storybook-materials.mjs'))}
};
const proof={
 kind:'SOURCE_EXACT_WEBGL2_INTEGRATED_MAIN_VS_FROZEN_DRAFT_DIAGNOSTIC',
 actualMainSHA:MAIN,protectedDraftSHA:DRAFT,
 sources:originalSources,
 compareCaveat:'Two different real game versions. Comparison is observational only, not a causal isolated performance optimization, not current iPhone acceptance.',
 noAddedOrRemovedGlErrors:true,noAlteredGameSource:true,originalPaintedMaterials:true,
 cases:[],errors:[],complete:false
};
const p95=a=>{const arr=a.filter(Number.isFinite).sort((x,y)=>x-y);return arr.length?Math.round(arr[Math.floor((arr.length-1)*.95)]*100)/100:null;};
const browser=await chromium.launch({headless:true,args:[
 '--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
async function one([width,height],kind,round){
 const port=kind==='integrated-main'?4173:4174;
 const ctx=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,isMobile:true,hasTouch:true});
 const page=await ctx.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(String(e)));
 page.on('response',r=>{if(r.status()>=400)errors.push('HTTP '+r.status()+' '+r.url());});
 try{
  await page.goto('http://127.0.0.1:'+port+'/',{waitUntil:'networkidle',timeout:30000});
  await page.waitForFunction(()=>window.__mythwroughtTest&&
   Number(document.getElementById('scene')?.dataset.loadedChunks)>=25,
   null,{timeout:120000});
  const profile=await page.evaluate(()=>{
   const test=window.__mythwroughtTest;
   const startProfile=test.fourBiomeMode(),pose=test.m5ObservedPose();
   for(let x=0;x<=2;x++)for(let z=0;z<=2;z++)
    for(let y=-78;y<=-76;y++){
     test.placeFixture(x,y,z,0); // original current main returns void, draft returns timing
     if(test.block(x,y,z)!==0)throw Error('Original source created no chamber');
    }
   test.teleportCave(1,-78,1);
   return {profile:startProfile,seed:pose.seed};
  });
  await page.waitForFunction(()=>Number(document.getElementById('scene')?.dataset.loadedChunks)>=18 &&
   Number(document.getElementById('scene').dataset.loadedChunks)<=27,
   null,{timeout:120000});
  const sample=await page.evaluate(async()=>{
   const test=window.__mythwroughtTest,canvas=document.getElementById('scene');
   const raf=()=>new Promise(r=>requestAnimationFrame(r));
   let last=await raf();
   const edits=[];
   for(let y=-79;y>=-102;y--){
    const begin=performance.now(),ret=test.placeFixture(1,y,1,0),
     actionMs=performance.now()-begin;
    if(test.block(1,y,1)!==0)throw Error('Original in-game deep edit was not applied');
    test.teleportCave(1,y,1);
    const next=await raf();
    const snap=test.snapshot();
    edits.push({y,actionMs,frameIntervalMs:next-last,
     resident:Number(canvas.dataset.loadedChunks),
     meshKeys:snap.lastEditMeshKeys,
     draftTimedUploadMs:ret&&typeof ret==='object'?ret.uploadMs:null,
     draftTimedMeshMs:ret&&typeof ret==='object'?ret.meshMs:null,
     draftTimedSaveMs:ret&&typeof ret==='object'?ret.saveMs:null});
    last=next;
   }
   return {edits,finalFeet:test.m5ObservedPose().feet,profile:canvas.dataset.renderPreset,
    art:canvas.dataset.storybookQuality,
    framebuffer:[canvas.width,canvas.height]};
  });
  assert.equal(sample.edits.length,24);
  assert.ok(sample.finalFeet<-100);
  assert.equal(sample.profile,'balanced');
  assert.equal(sample.art,'painted-materials');
  assert.ok(sample.edits.every(s=>s.resident<=27&&s.resident>0));
  await page.screenshot({path:DIR+'/'+kind+'-'+width+'x'+height+'-round'+round+'.png'});
  await page.reload({waitUntil:'networkidle',timeout:30000});
  await page.waitForFunction(()=>window.__mythwroughtTest,null,{timeout:60000});
  assert.equal(await page.evaluate(()=>window.__mythwroughtTest.block(1,-102,1)),0,
   'Original browser schema-1 world data not restored');
  assert.deepEqual(errors,[],'Original WebGL2 browser runtime error');
  const out={sourceBranch:kind,sourceSHA:kind==='integrated-main'?MAIN:DRAFT,
   viewport:width+'x'+height,round,profile:profile.profile,
   seed:profile.seed,edits:sample.edits.length,
   saveReloadVerified:true,balancedFullPaint:true,
   maxResident:Math.max(...sample.edits.map(x=>x.resident)),
   actualFrameBuffer:sample.framebuffer,
   actualActionP95:p95(sample.edits.map(x=>x.actionMs)),
   originalRafFrameP95:p95(sample.edits.map(x=>x.frameIntervalMs)),
   draftGpuUploadP95:p95(sample.edits.map(x=>x.draftTimedUploadMs)),
   draftCpuMeshP95:p95(sample.edits.map(x=>x.draftTimedMeshMs)),
   realEdits:sample.edits};
  proof.cases.push(out);
  await writeFile(DIR+'/new-main-original-vs-draft.json',JSON.stringify(proof,null,2)+'\n');
  console.log('REAL_ORIGINAL_GAME_INTEGRATION_SOURCE_PERF',JSON.stringify({
   viewport:out.viewport,kind,round,originalActionP95:out.actualActionP95,
   originalFrameP95:out.originalRafFrameP95,
   draftGpuUploadP95:out.draftGpuUploadP95,sourceSHA:out.sourceSHA,
   trueDeepEdits:out.edits,saveReloadVerified:out.saveReloadVerified}));
 }finally{await ctx.close();}
}
try{
 for(const viewport of [[844,390],[956,440]])
  for(let round=0;round<2;round++)
   for(const kind of round===0?['integrated-main','protected-draft']:['protected-draft','integrated-main'])
    await one(viewport,kind,round);
 proof.complete=true;
 proof.pooled=[];
 for(const viewport of ['844x390','956x440'])
  for(const kind of ['integrated-main','protected-draft']){
   const rows=proof.cases.filter(x=>x.viewport===viewport&&x.sourceBranch===kind);
   const edits=rows.flatMap(r=>r.realEdits);
   proof.pooled.push({viewport,kind,replicates:rows.length,actualEditCount:edits.length,
    actionP95:p95(edits.map(e=>e.actionMs)),
    frameP95:p95(edits.map(e=>e.frameIntervalMs)),
    gpuUploadP95WhenDraft:p95(edits.map(e=>e.draftTimedUploadMs)),
    caution:'Different source versions, no production GPU upload stage telemetry; not original strict performance gate'});
  }
 console.log('REAL_ORIGINAL_GAME_MERGED_MAIN_VS_DRAFT_POOLED',JSON.stringify(proof.pooled));
}catch(e){proof.errors.push(String(e?.stack||e));throw e;}
finally{
 await writeFile(DIR+'/new-main-original-vs-draft.json',JSON.stringify(proof,null,2)+'\n');
 await browser.close();
}
