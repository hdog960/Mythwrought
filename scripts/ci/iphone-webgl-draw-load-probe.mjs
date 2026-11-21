// Issue #291: REAL MYTHWROUGHT WebGL draw-load vs mandatory GPU-query timing.
// Diagnostic ONLY. No monkeypatching. Never calls gl.getError, consumes errors,
// alters GPU checks, renders fake frames, or modifies original source files.
import assert from 'node:assert/strict';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {chromium} from 'playwright';
const REPO='hdog960/Mythwrought';
const ORIGINAL='82f8828945b464acf0a71faddfe2d18ffa4df245';
const MAIN='8de40ca8451b6268cfdfefaa5d9a66b72caca799';
assert.equal(execFileSync('git',['rev-parse','HEAD~2'],{encoding:'utf8'}).trim(),ORIGINAL);
assert.deepEqual(execFileSync('git',['diff','--name-only',ORIGINAL,'HEAD'],{encoding:'utf8'}).trim().split('\n').sort(),[
  '.github/workflows/iphone-webgl-draw-load-probe.yml',
  'scripts/ci/iphone-webgl-draw-load-probe.mjs'
]);
assert.equal(execFileSync('git',['-C','baseline-main','rev-parse','HEAD'],{encoding:'utf8'}).trim(),MAIN);
const baseGameHash=createHash('sha256').update(await readFile('src/main.mjs')).digest('hex');
const gpuHash=createHash('sha256').update(await readFile('src/gpu-recovery.mjs')).digest('hex');
const outdir='artifacts/iphone-webgl-draw-load';
await mkdir(outdir,{recursive:true});
const report={kind:'SOURCE_EXACT_RENDER_DRAW_LOAD_VS_QUERY_OVERHEAD_DIAGNOSTIC_NOT_RELEASE',
  prHead:ORIGINAL,productionMain:MAIN,sourceGameSHA256:baseGameHash,gpuRecoverySHA256:gpuHash,
  actualPhysicalIphone:false,changedProduction:false,originalStrictGateUnchanged:true,
  variants:['balanced-foreground','economy-foreground','hidden-pause'],
  unsupportedConditions:[],
  conditions:'No added WebGL getError, no fake browser frames, original staged GPU buffers/error rollback/save',
  cases:[],errors:[],complete:false};
const vpList=[[844,390],[956,440]],modes=['balanced-foreground','economy-foreground','hidden-pause'];
const quant=(items,percent)=>{const a=items.filter(x=>Number.isFinite(x)).sort((x,y)=>x-y);
  return a.length?Math.round(a[Math.floor((a.length-1)*percent)]*100)/100:null;};
const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'
]});
const clock=()=>Date.now();
async function one(viewport,mode,round){
  const [width,height]=viewport;
  const ctx=await browser.newContext({viewport:{width,height},
    deviceScaleFactor:1,isMobile:true,hasTouch:true});
  const page=await ctx.newPage(),pageErrors=[];
  let backgroundTab=null;
  page.on('pageerror',error=>pageErrors.push(String(error)));
  page.on('response',response=>{if(response.status()>=400)
    pageErrors.push('HTTP '+response.status()+' '+response.url());});
  try{
    await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle',timeout:30000});
    await page.waitForFunction(()=>window.__mythwroughtTest&&
      Number(document.querySelector('#scene')?.dataset.loadedChunks)>=25,null,{timeout:120000});
    const fixture=await page.evaluate(()=>{
      const t=window.__mythwroughtTest;
      for(let x=0;x<=2;x++)for(let z=0;z<=2;z++)
        for(let y=-78;y<=-76;y++)t.placeFixture(x,y,z,0);
      t.teleportCave(1,-78,1);
      return {profile:t.fourBiomeMode()};
    });
    await page.waitForFunction(()=>{
      const c=document.querySelector('#scene');
      return Number(c.dataset.loadedChunks)>=18&&Number(c.dataset.loadedChunks)<=27&&
        Number(c.dataset.playerFeet)<-70;
    },null,{timeout:120000});
    const selected=mode==='economy-foreground'?'economy':'balanced';
    await page.evaluate(renderPreset=>{
      const el=document.getElementById('renderPreset');
      if(!el||![...el.options].some(option=>option.value===renderPreset))
        throw Error('Original game has no selectable '+renderPreset+' preset');
      el.value=renderPreset;
      el.dispatchEvent(new Event('change',{bubbles:true}));
    },selected);
    await page.waitForFunction(sel=>document.querySelector('#scene')?.dataset.renderPreset===sel,
      selected,{timeout:30000});
    const before=await page.evaluate(()=>{
      const c=document.querySelector('#scene');
      return {preset:c.dataset.renderPreset,frame:Number(c.dataset.renderedFrames),
        width:c.width,height:c.height,chunks:Number(c.dataset.loadedChunks),
        hidden:document.hidden};
    });
    assert.equal(before.hidden,false,'Preparation must run visible');
    assert.ok(before.width>0&&before.height>0);
    await page.screenshot({path:outdir+'/'+mode+'-'+width+'x'+height+'-round'+round+'.png'});
    if(mode==='hidden-pause'){
      // Real Chromium tab transition only. Never override document.hidden or
      // synthetic rAF/time; headless Chromium may keep every tab visible.
      backgroundTab=await ctx.newPage();
      await backgroundTab.goto('about:blank');
      await backgroundTab.bringToFront();
      await page.waitForTimeout(250);
      const actualHidden=await page.evaluate(()=>document.hidden);
      if(!actualHidden){
        report.unsupportedConditions.push({viewport:width+'x'+height,
          mode,round,reason:'Chromium keeps background tab visible in this headless driver'});
        console.log('SOURCE_REAL_DRAW_LOAD_UNSUPPORTED',JSON.stringify(
          report.unsupportedConditions.at(-1)));
        await writeFile(outdir+'/draw-load-probe.json',JSON.stringify(report,null,2)+'\n');
        return;
      }
      await page.waitForFunction(()=>document.hidden===true,null,{polling:100,timeout:15000});
      const framesBefore=await page.evaluate(()=>Number(document.querySelector('#scene').dataset.renderedFrames));
      await page.waitForTimeout(350);
      const framesAfter=await page.evaluate(()=>Number(document.querySelector('#scene').dataset.renderedFrames));
      assert.equal(framesAfter,framesBefore,
        'Original renderer did not suspend after browser visibility change');
    }
    const metrics=await page.evaluate(async({mode})=>{
      const t=window.__mythwroughtTest,c=document.querySelector('#scene');
      const sleep=n=>new Promise(resolve=>setTimeout(resolve,n));
      const startFrames=Number(c.dataset.renderedFrames);
      let lastStart=performance.now();
      const samples=[];
      for(let y=-79;y>=-102;y--){
        // Identical timer-driven cadence in both active and hidden versions:
        // no virtual timestamps, RAF substitution, monkeypatches or GL calls.
        await sleep(85);
        const now=performance.now(),cadenceMs=now-lastStart;
        lastStart=now;
        const startFramesAction=Number(c.dataset.renderedFrames);
        const start=performance.now();
        const result=t.placeFixture(1,y,1,0);
        const actionMs=performance.now()-start;
        if(!result||result.saved!==true||t.block(1,y,1)!==0)
          throw Error('Original source real edit+schema-1 save failed at Y='+y);
        t.teleportCave(1,y,1);
        const stages=result.gpuStageTimes||{};
        samples.push({y,actionMs,cadenceMs,
          renderFrame:Number(c.dataset.renderedFrames),
          framesDuringAction:Number(c.dataset.renderedFrames)-startFramesAction,
          resident:Number(c.dataset.loadedChunks),pending:Number(c.dataset.pendingChunks),
          uploadMs:result.uploadMs,meshMs:result.meshMs,saveMs:result.saveMs,
          drainMs:stages.batchDrainErrorMs??0,
          postMs:stages.batchCheckErrorMs??0,
          bufferSubDataMs:stages.bufferSubDataMs??0,
          uploadedBytes:stages.uploadBytes??0,
          preexistingErrors:stages.preexistingErrors??0});
      }
      const saved=JSON.parse(localStorage.getItem('mythwrought-v002-world-179')||'{}');
      if(saved.schema!==1)throw Error('Canonical schema-1 save missing');
      const endFrames=Number(c.dataset.renderedFrames);
      return {samples,startFrames,endFrames,renderDelta:endFrames-startFrames,
        hidden:document.hidden,profile:c.dataset.renderPreset,
        frameBuffer:[c.width,c.height],finalFeet:Number(c.dataset.playerFeet),
        schema:saved.schema,maxResident:Math.max(...samples.map(s=>s.resident))};
    },{mode});
    assert.equal(metrics.samples.length,24,'24 real deep edits mandatory per condition');
    assert.ok(metrics.finalFeet<-100,'Real gameplay depth was not reached');
    assert.ok(metrics.maxResident<=27&&metrics.maxResident>0,'Resident GPU budget violated');
    if(mode==='hidden-pause'){
      assert.equal(metrics.hidden,true);
      assert.equal(metrics.renderDelta,0,
        'Renderer must not draw any frames during hidden diagnostic');
    }else{
      assert.equal(metrics.hidden,false);
      assert.ok(metrics.renderDelta>=1,'Foreground mode did not actually render');
    }
    // Resume visibility via the original handler, without reloading before save.
    if(mode==='hidden-pause'){
      await page.bringToFront();
      await page.waitForFunction(()=>document.hidden===false,null,{timeout:15000});
      await page.waitForFunction(previous=>Number(document.querySelector('#scene').dataset.renderedFrames)>
        previous,metrics.endFrames,{timeout:45000});
    }
    await page.reload({waitUntil:'networkidle',timeout:30000});
    await page.waitForFunction(()=>window.__mythwroughtTest,null,{timeout:60000});
    assert.equal(await page.evaluate(()=>window.__mythwroughtTest.block(1,-102,1)),
      0,'Actual deepest terrain edit lost on original reload');
    assert.deepEqual(pageErrors,[],'Genuine WebGL browser runtime errors');
    const stat=key=>({p50:quant(metrics.samples.map(x=>x[key]),0.5),
      p95:quant(metrics.samples.map(x=>x[key]),0.95)});
    const row={viewport:width+'x'+height,mode,round,worldProfile:fixture.profile,
      source:ORIGINAL,realEdits:metrics.samples.length,schema:metrics.schema,
      maxResident:metrics.maxResident,renderedFrames:metrics.renderDelta,
      hidden:metrics.hidden,frameBuffer:metrics.frameBuffer,saveReloadVerified:true,
      action:stat('actionMs'),upload:stat('uploadMs'),mesh:stat('meshMs'),
      save:stat('saveMs'),drain:stat('drainMs'),post:stat('postMs'),
      cadence:stat('cadenceMs'),samples:metrics.samples};
    report.cases.push(row);
    await writeFile(outdir+'/draw-load-probe.json',JSON.stringify(report,null,2)+'\n');
    console.log('SOURCE_REAL_DRAW_LOAD_CASE',JSON.stringify({
      viewport:row.viewport,mode,round,realEdits:row.realEdits,
      frames:row.renderedFrames,frameBuffer:row.frameBuffer,hidden:row.hidden,
      actionP95:row.action.p95,uploadP95:row.upload.p95,
      preErrorP95:row.drain.p95,postErrorP95:row.post.p95,
      cadenceP95:row.cadence.p95,resident:row.maxResident}));
  }finally{
    try{await page.bringToFront();}catch(_){}
    try{await backgroundTab?.close();}catch(_){}
    await ctx.close();
  }
}
try{
  for(const vp of vpList)for(let round=0;round<2;round++)
    for(const mode of round===0?modes:[...modes].reverse())
      await one(vp,mode,round);
  report.complete=true;
  report.pooled=[];
  for(const [w,h] of vpList)for(const mode of modes){
    const group=report.cases.filter(c=>c.viewport===w+'x'+h&&c.mode===mode);
    const samples=group.flatMap(c=>c.samples);
    if(group.length===0)continue;
    report.pooled.push({viewport:w+'x'+h,mode,replicates:group.length,
      edits:samples.length,frames:group.reduce((sum,c)=>sum+c.renderedFrames,0),
      frameBuffers:group.map(c=>c.frameBuffer),
      actionP95:quant(samples.map(s=>s.actionMs),.95),
      uploadP95:quant(samples.map(s=>s.uploadMs),.95),
      drainP95:quant(samples.map(s=>s.drainMs),.95),
      postP95:quant(samples.map(s=>s.postMs),.95),
      cadenceP95:quant(samples.map(s=>s.cadenceMs),.95),
      meanAction:samples.reduce((sum,s)=>sum+s.actionMs,0)/samples.length});
  }
  console.log('SOURCE_REAL_DRAW_LOAD_POOLED_DIAGNOSTIC',JSON.stringify(report.pooled));
}catch(e){report.errors.push(String(e?.stack||e));throw e;}
finally{
  await writeFile(outdir+'/draw-load-probe.json',JSON.stringify(report,null,2)+'\n');
  await browser.close();
}
