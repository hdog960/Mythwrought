// MYTHWROUGHT issue #291: diagnostic ONLY, not release or performance acceptance.
// Production source WebGL2 / SwiftShader deep edits; native fail-closed GL checks
// are left entirely untouched. No monkeypatches, fake timings, or relaxed gates.
import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright';

const CANDIDATE='82f8828945b464acf0a71faddfe2d18ffa4df245';
const BASELINE='8de40ca8451b6268cfdfefaa5d9a66b72caca799';
const sha=dir=>execFileSync('git',['-C',dir,'rev-parse','HEAD'],{encoding:'utf8'}).trim();
assert.equal(execFileSync('git',['rev-parse','HEAD^'],{encoding:'utf8'}).trim(),CANDIDATE,
  'Probe MUST be direct child of exact protected PR source');
assert.equal(sha('baseline-main'),BASELINE,'Baseline MUST be exact pinned main');
const artifactDir='artifacts/iphone-gpu-phase';
await mkdir(artifactDir,{recursive:true});
const sourceSha=createHash('sha256').update(await readFile('src/gpu-recovery.mjs')).digest('hex');
const phases=['raf-immediate','raf-timer0','raf-timer8'];
const viewports=[[844,390],[956,440]];
const cases=[];
const output={kind:'DIAGNOSTIC_ONLY_REAL_GL_SOURCE_PHASE_291',
  candidate:CANDIDATE,baseline:BASELINE,sourceGpuRecoverySHA256:sourceSha,
  actualPhysicalIphone:false,releaseAcceptance:false,hardGateChanged:false,
  phaseDefinitions:{'raf-immediate':'edit in task resumed directly after genuine RAF',
    'raf-timer0':'edit in zero-delay timer task after genuine RAF',
    'raf-timer8':'edit in 8-ms timer task after genuine RAF'},
  cases,errors:[]};
const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'
]});
const p95=values=>{
  const v=values.filter(Number.isFinite).sort((a,b)=>a-b);
  return v.length?Math.round(v[Math.floor((v.length-1)*.95)]*100)/100:null;
};
const p50=values=>{
  const v=values.filter(Number.isFinite).sort((a,b)=>a-b);
  return v.length?Math.round(v[Math.floor((v.length-1)*.5)]*100)/100:null;
};
async function capture(label,viewport,phase,round){
  const [width,height]=viewport;
  const ctx=await browser.newContext({viewport:{width,height},
    deviceScaleFactor:1,isMobile:true,hasTouch:true});
  const page=await ctx.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(String(e)));
  page.on('response',r=>{if(r.status()>=400)errors.push('HTTP '+r.status()+' '+r.url());});
  try{
    await page.goto('http://127.0.0.1:'+(label==='candidate'?4173:4174)+'/',
      {waitUntil:'networkidle',timeout:30000});
    await page.waitForFunction(()=>window.__mythwroughtTest&&
      Number(document.querySelector('#scene')?.dataset.loadedChunks)>=25,
      null,{timeout:120000});
    const fixture=await page.evaluate(()=>{
      const t=window.__mythwroughtTest;
      for(let x=0;x<=2;x++)for(let z=0;z<=2;z++)
        for(let y=-78;y<=-76;y++)t.placeFixture(x,y,z,0);
      t.teleportCave(1,-78,1);
      return {generationProfile:t.fourBiomeMode()};
    });
    await page.waitForFunction(()=>{
      const scene=document.querySelector('#scene');
      return Number(scene.dataset.loadedChunks)<=27&&
        Number(scene.dataset.loadedChunks)>=18&&
        Number(scene.dataset.playerFeet)<-70;
    },null,{timeout:120000});
    const raw=await page.evaluate(async ({phase})=>{
      const t=window.__mythwroughtTest,scene=document.querySelector('#scene');
      const raf=()=>new Promise(resolve=>requestAnimationFrame(resolve));
      let prev=await raf(),passive=[];
      for(let i=0;i<24;i++){
        const next=await raf();
        passive.push(next-prev);prev=next;
      }
      const samples=[];
      for(let y=-79;y>=-102;y--){
        const startRaf=await raf();
        if(phase==='raf-timer0')
          await new Promise(resolve=>setTimeout(resolve,0));
        else if(phase==='raf-timer8')
          await new Promise(resolve=>setTimeout(resolve,8));
        const start=performance.now(),framePhaseDelay=start-startRaf;
        const result=t.placeFixture(1,y,1,0);
        if(t.block(1,y,1)!==0||result?.saved!==true)
          throw Error('Real deep edit or original schema save failed at Y '+y);
        t.teleportCave(1,y,1);
        const actionMs=performance.now()-start,after=await raf();
        const timing=result.gpuStageTimes||{};
        samples.push({y,phase,framePhaseDelay,actionMs,
          meshMs:result.meshMs,uploadMs:result.uploadMs,saveMs:result.saveMs,
          preErrorMs:timing.batchDrainErrorMs??timing.drainErrorMs??0,
          postErrorMs:timing.batchCheckErrorMs??timing.checkErrorMs??0,
          bufferSubDataMs:timing.bufferSubDataMs??0,
          gpuBytes:timing.uploadBytes??0,
          renderFrameMs:after-startRaf,
          loadedChunks:Number(scene.dataset.loadedChunks),
          pendingChunks:Number(scene.dataset.pendingChunks),
          reusedGpuBuffers:result.reusedGpuBuffers??0});
      }
      const saved=JSON.parse(localStorage.getItem('mythwrought-v002-world-179')||'{}');
      if(saved.schema!==1)throw Error('Canonical schema-1 was not retained');
      return {passive,samples,saveSchema:saved.schema,
        maxResident:Math.max(...samples.map(s=>s.loadedChunks)),
        maxPending:Math.max(...samples.map(s=>s.pendingChunks)),
        finalFeet:Number(scene.dataset.playerFeet)};
    },{phase});
    assert.equal(raw.samples.length,24);
    assert.ok(raw.maxResident<=27,'Exceeded original 27 resident GPU budget');
    assert.ok(raw.finalFeet<-100,'Did not cross actual deep section seam');
    if(round===0)
      await page.screenshot({path:artifactDir+'/'+label+'-'+width+'x'+height+'-'+phase+'.png'});
    await page.reload({waitUntil:'networkidle'});
    await page.waitForFunction(()=>window.__mythwroughtTest,null,{timeout:60000});
    assert.equal(await page.evaluate(()=>window.__mythwroughtTest.block(1,-102,1)),0,
      'Actual edited deep world was not preserved across reload');
    assert.deepEqual(errors,[],'Original gameplay or resource page errors');
    const samples=raw.samples;
    const stat=key=>({p50:p50(samples.map(s=>s[key])),
      p95:p95(samples.map(s=>s[key]))});
    const data={label,viewport:width+'x'+height,phase,round,
      count:samples.length,generationProfile:fixture.generationProfile,
      passiveFrameP95:p95(raw.passive),passiveFrameP50:p50(raw.passive),
      action:stat('actionMs'),frame:stat('renderFrameMs'),upload:stat('uploadMs'),
      preError:stat('preErrorMs'),postError:stat('postErrorMs'),
      phaseDelay:stat('framePhaseDelay'),mesh:stat('meshMs'),
      save:stat('saveMs'),bufferSubData:stat('bufferSubDataMs'),
      over33:samples.filter(s=>s.renderFrameMs>33).length,
      maxResident:raw.maxResident,maxPending:raw.maxPending,
      totalGpuBytes:samples.reduce((acc,s)=>acc+s.gpuBytes,0),
      realEditedBlocks:24,saveSchema:raw.saveSchema,saveReloadVerified:true,
      samples};
    cases.push(data);
    console.log('REAL_GL_PHASE_DIAGNOSTIC',JSON.stringify({
      label,viewport:data.viewport,phase,round,actionP95:data.action.p95,
      frameP95:data.frame.p95,uploadP95:data.upload.p95,
      preErrorP95:data.preError.p95,postErrorP95:data.postError.p95,
      passiveFrameP95:data.passiveFrameP95,maxResident:data.maxResident}));
    await writeFile(artifactDir+'/phase-samples.json',JSON.stringify(output,null,2)+'\n');
  }finally{await ctx.close();}
}
try{
  for(const viewport of viewports){
    for(let round=0;round<2;round++){
      const order=round===0?phases:[...phases].reverse();
      for(const phase of order){
        const labels=round===0?['baseline','candidate']:['candidate','baseline'];
        for(const label of labels)await capture(label,viewport,phase,round);
      }
    }
  }
  output.complete=true;
  const groups={};
  for(const row of cases){
    const key=row.label+' '+row.viewport+' '+row.phase;
    (groups[key]??=[]).push(row);
  }
  output.summary=Object.entries(groups).map(([key,items])=>({
    key,replicates:items.length,
    actionP95MedianOfReplicates:p50(items.map(x=>x.action.p95)),
    uploadP95MedianOfReplicates:p50(items.map(x=>x.upload.p95)),
    preErrorP95MedianOfReplicates:p50(items.map(x=>x.preError.p95)),
    postErrorP95MedianOfReplicates:p50(items.map(x=>x.postError.p95)),
    frameP95MedianOfReplicates:p50(items.map(x=>x.frame.p95)),
    over33Total:items.reduce((sum,x)=>sum+x.over33,0)
  }));
  console.log('PHASE_PROBE_SUMMARY_DIAGNOSTIC_ONLY',JSON.stringify(output.summary));
}catch(e){
  output.errors.push(String(e?.stack||e));
  throw e;
}finally{
  await writeFile(artifactDir+'/phase-samples.json',JSON.stringify(output,null,2)+'\n');
  await browser.close();
}
