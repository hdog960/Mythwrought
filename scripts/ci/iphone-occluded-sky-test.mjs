// #291: isolated test-only CURRENT-MAIN hidden sky draw diagnosis.
// Never modifies checked-in game source, shader, save, GL error checks, or other lanes.
// Only substitute one exact in-memory JS network response for this diagnostic.
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {PNG} from 'pngjs';
import {chromium} from 'playwright';

const MAIN='7016e14cd6289f45eaf7fc6a79a362b47996df65';
const DIR='artifacts/iphone-occluded-sky-probe';
await mkdir(DIR,{recursive:true});
assert.equal(execFileSync('git',['rev-parse','HEAD^'],{encoding:'utf8'}).trim(),MAIN);
assert.deepEqual(execFileSync('git',['diff','--name-only',MAIN,'HEAD'],{encoding:'utf8'}).trim().split('\n').sort(),[
 '.github/workflows/iphone-occluded-sky-test.yml',
 'scripts/ci/iphone-occluded-sky-test.mjs'
]);
const SHA=b=>createHash('sha256').update(b).digest('hex');
const main=await readFile('src/main.mjs','utf8');
const shader=await readFile('src/storybook-materials.mjs');
const gpu=await readFile('src/gpu-recovery.mjs');
const from=['if(caveShade<1){','        gl.disable(gl.DEPTH_TEST);'].join('\n');
const to=['if(caveShade<1&&player.feet>=-70){','        gl.disable(gl.DEPTH_TEST);'].join('\n');
assert.equal(main.split(from).length,2,'Original integrated sky gate changed; cannot continue');
const candidate=main.replace(from,to);
assert.equal(candidate.split('gl.getError()').length,main.split('gl.getError()').length);
assert.equal(candidate.split('uploadPack2Chunk(').length,main.split('uploadPack2Chunk(').length);
const proof={
 kind:'ORIGINAL_INTEGRATED_SOURCE_TEST_ONLY_FOUR_REGION_SHAFT_SKY_GPU_COST',
 mainSHA:MAIN,originalSourceSHA256:SHA(main),diagnosticSourceSHA256:SHA(candidate),
 materialSHA256:SHA(shader),gpuRecoverySHA256:SHA(gpu),
 gitGameSourceChanged:false,glGetErrorCallsUnchanged:true,shaderAndMaterialsUnchanged:true,
 fullOriginalBalancedPixelSize:true,
 warning:'Omitting sky draw at depth in temporary browser is NOT a universally safe geometry occlusion rule. Never merge without visual coverage proof for entrances, caves, transitions and all game worlds.',
 sessions:[],pixelChecks:[],complete:false,errors:[]
};
const p95=x=>{const a=x.filter(Number.isFinite).sort((x,y)=>x-y);return a.length?+a[Math.floor((a.length-1)*.95)].toFixed(3):null};
const browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
async function one(size,mode,round){
 const [w,h]=size;
 const ctx=await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:1,isMobile:true,hasTouch:true});
 const page=await ctx.newPage(),errors=[];let patched=0;
 if(mode==='test')await page.route('**/src/main.mjs*',async route=>{
   const original=await route.fetch(),body=await original.text();
   assert.equal(SHA(body),SHA(main),'Actual original response SHA mismatch');
   patched++;
   await route.fulfill({response:original,body:candidate,contentType:'text/javascript'});
 });
 page.on('pageerror',e=>errors.push(String(e)));
 page.on('response',r=>{if(r.status()>=400)errors.push('HTTP '+r.status()+' '+r.url())});
 try{
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle',timeout:30000});
  await page.waitForFunction(()=>window.__mythwroughtTest&&Number(document.querySelector('#scene')?.dataset.loadedChunks)>=25,null,{timeout:120000});
  const p=await page.evaluate(()=>{
   const t=window.__mythwroughtTest,profile=t.fourBiomeMode();
   if(profile!=='four-regions')throw Error('Sky test requires four-regions original world');
   if(document.querySelector('#renderPreset').value!=='balanced')throw Error('Original painted preset not active');
   for(let x=0;x<=2;x++)for(let z=0;z<=2;z++)for(let y=-78;y<=-76;y++){
    t.placeFixture(x,y,z,0);
    if(t.block(x,y,z)!==0)throw Error('Real original voxel excavation failed');
   }
   t.teleportCave(1,-78,1);
   return profile;
  });
  await page.waitForFunction(()=>Number(document.querySelector('#scene').dataset.loadedChunks)>=18&&Number(document.querySelector('#scene').dataset.loadedChunks)<=27,null,{timeout:120000});
  const data=await page.evaluate(async()=>{
   const t=window.__mythwroughtTest,s=document.querySelector('#scene');
   const raf=()=>new Promise(resolve=>requestAnimationFrame(resolve));
   let previous=await raf();const rows=[];
   for(let y=-79;y>=-102;y--){
    const begin=performance.now();t.placeFixture(1,y,1,0);
    const actionMs=performance.now()-begin;
    if(t.block(1,y,1)!==0)throw Error('Original deep edit failed');
    t.teleportCave(1,y,1);
    const next=await raf(),snapshot=t.snapshot();
    rows.push({y,actionMs,frameMs:next-previous,resident:Number(s.dataset.loadedChunks),
     gpuFaults:snapshot.gpuRetry.failures});
    previous=next;
   }
   for(let i=0;i<3;i++)await raf();
   return {rows,feet:t.m5ObservedPose().feet,
    framebuffer:[s.width,s.height],quality:s.dataset.storybookQuality,
    renderPreset:s.dataset.renderPreset,backdrop:s.dataset.skyBackdrop};
  });
  assert.equal(data.rows.length,24);
  assert.ok(data.feet<-100);
  assert.equal(data.quality,'painted-materials');
  assert.equal(data.renderPreset,'balanced');
  assert.ok(data.rows.every(x=>x.resident>0&&x.resident<=27&&x.gpuFaults===0));
  if(mode==='test')assert.equal(patched,1);
  const image=DIR+'/'+w+'x'+h+'-'+mode+'-round'+round+'.png';
  await page.locator('#scene').screenshot({path:image});
  await page.reload({waitUntil:'networkidle',timeout:30000});
  await page.waitForFunction(()=>window.__mythwroughtTest,null,{timeout:60000});
  assert.equal(await page.evaluate(()=>window.__mythwroughtTest.block(1,-102,1)),0);
  assert.deepEqual(errors,[],'Unexpected original browser page errors');
  const item={viewport:w+'x'+h,mode,round,patchedResponses:patched,originalProfile:p,
   editCount:24,saveReload:true,pixels:image,framebuffer:data.framebuffer,
   skyBackdrop:data.backdrop,actionP95:p95(data.rows.map(x=>x.actionMs)),
   frameP95:p95(data.rows.map(x=>x.frameMs)),rawEdits:data.rows};
  proof.sessions.push(item);
  await writeFile(DIR+'/original-sky-occlusion-diagnostic.json',JSON.stringify(proof,null,2)+'\n');
  console.log('ORIGINAL_INTEGRATED_SKY_TEST_CASE',JSON.stringify({viewport:item.viewport,mode,round,
   edits:item.editCount,backdrop:item.skyBackdrop,actionP95:item.actionP95,frameP95:item.frameP95,verifiedSave:true}));
 }finally{await ctx.close();}
}
try{
 for(const dims of [[844,390],[956,440]])for(let round=0;round<2;round++){
  const modes=round===0?['control','test']:['test','control'];
  for(const m of modes)await one(dims,m,round);
  const path=m=>DIR+'/'+dims[0]+'x'+dims[1]+'-'+m+'-round'+round+'.png';
  const a=PNG.sync.read(await readFile(path('control')));
  const b=PNG.sync.read(await readFile(path('test')));
  assert.equal(a.width,b.width);assert.equal(a.height,b.height);
  let changed=0,maxChannel=0;
  for(let i=0;i<a.data.length;i+=4){
   let mismatch=false;
   for(let k=0;k<4;k++){const delta=Math.abs(a.data[i+k]-b.data[i+k]);
    if(delta){mismatch=true;maxChannel=Math.max(maxChannel,delta)}}
   if(mismatch)changed++;
  }
  const result={viewport:dims[0]+'x'+dims[1],round,matchingPixels:a.width*a.height-changed,
   totalPixels:a.width*a.height,differentPixels:changed,maxChannelDelta:maxChannel,
   pixelExact:changed===0};
  proof.pixelChecks.push(result);
  console.log('ORIGINAL_INTEGRATED_SKY_PIXEL_PARITY',JSON.stringify(result));
 }
 proof.complete=true;
 proof.pooled=[];
 for(const v of ['844x390','956x440'])for(const mode of ['control','test']){
  const rows=proof.sessions.filter(x=>x.viewport===v&&x.mode===mode).flatMap(x=>x.rawEdits);
  proof.pooled.push({viewport:v,mode,edits:rows.length,
   actionP95:p95(rows.map(x=>x.actionMs)),frameP95:p95(rows.map(x=>x.frameMs))});
 }
 proof.testedPixelsAllExact=proof.pixelChecks.every(x=>x.pixelExact);
 console.log('ORIGINAL_INTEGRATED_SKY_TEST_POOLED',JSON.stringify({pooled:proof.pooled,exactPixelsInTestedShaft:proof.testedPixelsAllExact}));
}catch(e){proof.errors.push(String(e?.stack||e));throw e;}
finally{
 await writeFile(DIR+'/original-sky-occlusion-diagnostic.json',JSON.stringify(proof,null,2)+'\n');
 await browser.close();
}
