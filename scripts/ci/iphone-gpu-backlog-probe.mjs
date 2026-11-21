// MYTHWROUGHT issue #291 — read-only source-authentic GPU queue probe.
// NO PRODUCTION CHANGES. Never calls gl.getError or modifies upload behavior.
// gl.finish() / gl.flush() here are diagnostic pre-edit calls only and are
// explicitly included in total action timing, not proposed release fixes.
import assert from 'node:assert/strict';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {chromium} from 'playwright';

const PR='82f8828945b464acf0a71faddfe2d18ffa4df245';
const MAIN='8de40ca8451b6268cfdfefaa5d9a66b72caca799';
const tree=execFileSync('git',['rev-parse','HEAD^'],{encoding:'utf8'}).trim();
assert.equal(tree,PR,'Diagnostic commit must be a direct child of protected PR HEAD');
assert.equal(execFileSync('git',['-C','baseline-main','rev-parse','HEAD'],{encoding:'utf8'}).trim(),MAIN);
assert.deepEqual(execFileSync('git',['diff','--name-only',PR,'HEAD'],{encoding:'utf8'})
  .trim().split('\n').sort(),[
    '.github/workflows/iphone-gpu-backlog-probe.yml',
    'scripts/ci/iphone-gpu-backlog-probe.mjs'
  ]);
const gpuSourceSha=createHash('sha256').update(await readFile('src/gpu-recovery.mjs')).digest('hex');
const SAVE='mythwrought-v002-world-179';
const DIR='artifacts/iphone-gpu-backlog';
await mkdir(DIR,{recursive:true});
const info={kind:'SOURCE_AUTHENTIC_GPU_SYNC_BACKLOG_DIAGNOSTIC_NOT_RELEASE_ACCEPTANCE',
  pr:PR,main:MAIN,gpuSourceSha,
  checks:['no new gl.getError calls','all original pre-drain and postcheck remain',
    '24 original deep edits each','schema-1 save/reload','max 27 resident GPU chunks',
    'gl.finish and gl.flush time included in elapsed action'],
  realIphone:false,releaseAcceptance:false,cases:[],complete:false,errors:[]};
const viewportList=[[844,390],[956,440]],variants=[
  {build:'baseline',mode:'control'},
  {build:'candidate',mode:'control'},
  {build:'candidate',mode:'finish-before'},
  {build:'candidate',mode:'flush-before'}
];
const p=(a,q)=>{let x=a.filter(Number.isFinite).sort((x,y)=>x-y);
  return x.length?Math.round(x[Math.floor((x.length-1)*q)]*100)/100:null;};
const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
async function one({build,mode},[width,height],round){
  const ctx=await browser.newContext({viewport:{width,height},
    deviceScaleFactor:1,isMobile:true,hasTouch:true});
  const page=await ctx.newPage(),pageErrors=[];
  page.on('pageerror',e=>pageErrors.push(String(e)));
  page.on('response',r=>{if(r.status()>=400)pageErrors.push('HTTP '+r.status()+' '+r.url());});
  try{
    await page.goto('http://127.0.0.1:'+(build==='baseline'?4174:4173)+'/',
      {waitUntil:'networkidle',timeout:30000});
    await page.waitForFunction(()=>window.__mythwroughtTest&&
      Number(document.querySelector('#scene')?.dataset.loadedChunks)>=25,
      null,{timeout:120000});
    const setup=await page.evaluate(()=>{
      const t=window.__mythwroughtTest;
      for(let x=0;x<=2;x++)for(let z=0;z<=2;z++)
        for(let y=-78;y<=-76;y++)t.placeFixture(x,y,z,0);
      t.teleportCave(1,-78,1);
      return {profile:t.fourBiomeMode()};
    });
    await page.waitForFunction(()=>{
      const c=document.querySelector('#scene');
      return Number(c.dataset.loadedChunks)>=18&&
        Number(c.dataset.loadedChunks)<=27&&Number(c.dataset.playerFeet)<-70;
    },null,{timeout:120000});
    const raw=await page.evaluate(async({build,mode})=>{
      const t=window.__mythwroughtTest;
      const scene=document.querySelector('#scene'),gl=scene.getContext('webgl2');
      if(!gl||gl.isContextLost())throw Error('Real WebGL2 driver unavailable');
      const raf=()=>new Promise(resolve=>requestAnimationFrame(resolve));
      let last=await raf(),passive=[];
      for(let i=0;i<18;i++){const f=await raf();passive.push(f-last);last=f;}
      const samples=[];
      for(let y=-79;y>=-102;y--){
        const beforeRaf=await raf();
        const beforeSync=performance.now();
        // These are ordinary WebGL commands and do not read/consume GL errors.
        if(mode==='finish-before')gl.finish();
        if(mode==='flush-before')gl.flush();
        const syncMs=performance.now()-beforeSync;
        if(gl.isContextLost())throw Error('GPU context lost during queue probe');
        const actionStart=performance.now();
        const result=t.placeFixture(1,y,1,0);
        if(t.block(1,y,1)!==0)throw Error('Real world edit did not remove Y '+y);
        if(build==='candidate'&&result?.saved!==true)
          throw Error('Original candidate save failed Y '+y);
        t.teleportCave(1,y,1);
        const actionMs=performance.now()-actionStart;
        const next=await raf(),tim=result?.gpuStageTimes||{};
        samples.push({y,mode,preSyncMs:syncMs,actionMs,
          totalMs:syncMs+actionMs,frameIntervalMs:next-beforeRaf,
          uploadMs:result?.uploadMs??null,
          meshMs:result?.meshMs??null,saveMs:result?.saveMs??null,
          batchDrainErrorMs:result?tim.batchDrainErrorMs??null:null,
          batchCheckErrorMs:result?tim.batchCheckErrorMs??null:null,
          bufferSubDataMs:result?tim.bufferSubDataMs??null:null,
          uploadBytes:result?tim.uploadBytes??null:null,
          preexistingErrors:result?tim.preexistingErrors??0:null,
          gpuResident:Number(scene.dataset.loadedChunks)});
      }
      const save=JSON.parse(localStorage.getItem('mythwrought-v002-world-179')||'{}');
      if(save.schema!==1)throw Error('Original schema-1 save not present');
      return {samples,passive,schema:save.schema,
        maxResident:Math.max(...samples.map(s=>s.gpuResident)),
        finalFeet:Number(scene.dataset.playerFeet)};
    },{build,mode});
    assert.equal(raw.samples.length,24,'Required 24 authentic deep edits');
    assert.ok(raw.maxResident<=27&&raw.maxResident>=1,'GPU resident budget');
    assert.ok(raw.finalFeet<-100,'Did not reach authentic depth');
    await page.reload({waitUntil:'networkidle',timeout:30000});
    await page.waitForFunction(()=>window.__mythwroughtTest,null,{timeout:60000});
    assert.equal(await page.evaluate(()=>window.__mythwroughtTest.block(1,-102,1)),0,
      'Original-world block edit did not survive reload');
    assert.deepEqual(pageErrors,[],'Real-game browser errors');
    if(round===0)await page.screenshot({path:DIR+'/'+build+'-'+mode+'-'+width+'x'+height+'.png'});
    const s=raw.samples;
    const stat=k=>({p50:p(s.map(x=>x[k]),0.5),p95:p(s.map(x=>x[k]),0.95)});
    const out={build,mode,viewport:width+'x'+height,round,
      profile:setup.profile,count:24,schema:raw.schema,
      maxResident:raw.maxResident,saveReloadVerified:true,
      passiveFrameP95:p(raw.passive,0.95),action:stat('actionMs'),
      total:stat('totalMs'),preSync:stat('preSyncMs'),frame:stat('frameIntervalMs'),
      upload:stat('uploadMs'),mesh:stat('meshMs'),save:stat('saveMs'),
      preError:stat('batchDrainErrorMs'),postError:stat('batchCheckErrorMs'),
      subData:stat('bufferSubDataMs'),
      over33:s.filter(x=>x.frameIntervalMs>33).length,samples:s};
    info.cases.push(out);
    await writeFile(DIR+'/driver-backlog-probe.json',JSON.stringify(info,null,2)+'\n');
    console.log('REAL_GPU_BACKLOG_CASE',JSON.stringify({build,mode,viewport:out.viewport,round,
      actionP95:out.action.p95,syncP95:out.preSync.p95,
      totalP95:out.total.p95,frameP95:out.frame.p95,
      uploadP95:out.upload.p95,drainP95:out.preError.p95,
      postP95:out.postError.p95,meshP95:out.mesh.p95,
      maxResident:out.maxResident}));
  }finally{await ctx.close();}
}
try{
  for(const viewport of viewportList)
    for(let round=0;round<2;round++)
      for(const variant of round===0?variants:[...variants].reverse())
        await one(variant,viewport,round);
  info.complete=true;
  info.pooled=[];
  for(const [width,height] of viewportList)
    for(const v of variants){
      const rows=info.cases.filter(c=>c.viewport===width+'x'+height&&
        c.build===v.build&&c.mode===v.mode);
      const vals=rows.flatMap(c=>c.samples);
      info.pooled.push({viewport:width+'x'+height,build:v.build,mode:v.mode,
        realEdits:vals.length,
        actionP95:p(vals.map(x=>x.actionMs),0.95),
        uploadP95:p(vals.map(x=>x.uploadMs),0.95),
        preSyncP95:p(vals.map(x=>x.preSyncMs),0.95),
        totalP95:p(vals.map(x=>x.totalMs),0.95),
        frameP95:p(vals.map(x=>x.frameIntervalMs),0.95),
        drainP95:p(vals.map(x=>x.batchDrainErrorMs),0.95),
        postP95:p(vals.map(x=>x.batchCheckErrorMs),0.95),
        over33:vals.filter(x=>x.frameIntervalMs>33).length});
    }
  console.log('REAL_GPU_BACKLOG_POOLED_DIAGNOSTIC',JSON.stringify(info.pooled));
}catch(e){info.errors.push(String(e?.stack||e));throw e;}
finally{
  await writeFile(DIR+'/driver-backlog-probe.json',JSON.stringify(info,null,2)+'\n');
  await browser.close();
}
