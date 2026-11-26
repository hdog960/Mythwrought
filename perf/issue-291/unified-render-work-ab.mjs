// #291 isolated frame admission A/B. Not a release acceptance gate.
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright';
import {PNG} from 'pngjs';
const frozen='f48c42e85c979dd66d8b42db0e8b01dd531b0fe6',old='84bcf874566ea6404d1b377128e0943c185bfa30';
const git=(...args)=>execFileSync('git',args,{encoding:'utf8',maxBuffer:16*1024*1024}).trimEnd();
const sha=x=>createHash('sha256').update(x).digest('hex');
const src=await readFile('src/main.mjs','utf8');
assert.equal(git('hash-object','src/main.mjs'),git('rev-parse','HEAD:src/main.mjs'));
assert.equal(git('hash-object','src/gpu-recovery.mjs'),'0613b2c65227068c8d7fcc5c518c632d4deaf18c');
assert.equal(git('rev-parse','HEAD^'),frozen);
// Exact frozen control source, instrument only original draw boundary.
const frozenMain=git('show',frozen+':src/main.mjs');
assert.equal(git('rev-parse',frozen+':src/main.mjs'),'3d8ff44d2cf7de9125bc4eda8e07983511e10d53');
const anchor="now=>gpuFrameAdmission.run(now,draw)";
const controlAnchor="id=>cancelAnimationFrame(id),draw";
const note="const measured=t=>{draw(t);if(window.__gpuRealFrames&&window.__gpuRealFrames.length<16385)window.__gpuRealFrames.push(performance.now());};";
const wrap="now=>{"+note+"return gpuFrameAdmission.run(now,measured);}";
const controlWrap="id=>cancelAnimationFrame(id),now=>{"+note+"return measured(now);}";
assert.equal(src.split(anchor).length,2);assert.equal(frozenMain.split(controlAnchor).length,2);
const candidate=src.replace(anchor,wrap),control=frozenMain.replace(controlAnchor,controlWrap);
assert.equal(candidate.replace(wrap,anchor),src);
assert.equal(control.replace(controlWrap,controlAnchor),frozenMain);
const [width,height]=String(process.env.AB_VIEWPORT).split('x').map(Number);
assert.ok([[667,375],[844,390],[932,430],[956,440]].some(v=>v[0]===width&&v[1]===height));
const modes=['candidate','control'];
const seed=179,key='mythwrought-v002-world-179',url='http://127.0.0.1:4173/';
const opts={viewport:{width,height},deviceScaleFactor:1,hasTouch:true,isMobile:true,serviceWorkers:'block'};
const plan=Array.from({length:50},(_,x)=>[-77,-78].map(y=>({
 pose:[x,-78,1],cell:[x,y,3],previous:(x+y)%2===0?3:8}))).flat();
assert.equal(new Set(plan.map(p=>p.cell.join(','))).size,100);
const out='artifacts/unified-render-work/'+width+'x'+height;await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const report={protocol:'291-opaque-render-work-and-frame-admission-v1',source:frozen,head:git('rev-parse','HEAD'),
 sourceMainSHA256:sha(src),candidateMainSHA256:sha(candidate),controlMainSHA256:sha(control),experimental:true,
 width,height,seed,modes,plan,browser:browser.version(),runs:{},failures:[],physicalIPhoneProven:false,releaseCertified:false};
const persist=()=>writeFile(out+'/report.json',JSON.stringify(report,null,2)+'\n');
const save=page=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)||'null'),key);
const ready=page=>page.waitForFunction(()=>window.__mythwroughtTest&&
 +document.querySelector('#scene')?.dataset.loadedChunks===25&&
 +document.querySelector('#scene')?.dataset.pendingChunks===0&&document.querySelector('#notice').hidden&&!document.hidden,null,{timeout:90000});
const p95=a=>a.slice().sort((a,b)=>a-b)[Math.ceil(a.length*.95)-1];
const stats=a=>({count:a.length,p50:a.slice().sort((a,b)=>a-b)[Math.ceil(a.length*.5)-1],p95:p95(a),worst:Math.max(...a)});
const routeSource=async(ctx,source)=>ctx.route('**/src/main.mjs*',route=>route.fulfill({status:200,contentType:'text/javascript',body:source}));
async function setup(){
 const ctx=await browser.newContext(opts);const page=await ctx.newPage();const errors=[];
 page.on('pageerror',e=>errors.push(String(e)));
 try{
  await routeSource(ctx,frozenMain);await page.goto(url,{waitUntil:'domcontentloaded'});await ready(page);
  assert.equal(await page.evaluate(()=>window.__mythwroughtTest.m5ObservedPose().seed),seed);
  await page.evaluate(plan=>{
   const t=window.__mythwroughtTest;
   const set=(x,y,z,id)=>{if(t.block(x,y,z)!==id&&!t.editBiomeCell(x,y,z,id))throw Error('Setup rejected '+[x,y,z,id]);if(t.block(x,y,z)!==id)throw Error('Setup readback mismatch');};
   for(let x=-1;x<=50;x++)for(let z=0;z<=2;z++){set(x,-79,z,3);for(let y=-78;y<=-76;y++)set(x,y,z,0);}
   for(const p of plan)set(...p.cell,p.previous);
   const last=plan.at(-1);t.placeFixture(...last.cell,last.previous);
  },plan);
  await page.reload({waitUntil:'domcontentloaded'});await ready(page);
  const original=await save(page);assert.equal(original.schema,1);assert.equal(original.seed,seed);
  assert.deepEqual(await page.evaluate(plan=>plan.map(p=>window.__mythwroughtTest.block(...p.cell)),plan),plan.map(p=>p.previous));
  assert.deepEqual(errors,[]);return {state:await ctx.storageState(),original};
 }finally{await ctx.close();}
}
async function traceInit(page){
 await page.addInitScript(()=>{
  Object.defineProperty(window,'__gpuRealFrames',{value:[]});
  const state={armed:false,active:null,events:[],overflow:false,frames:[],frameLast:null,started:false,finish:0,complete:false,interrupted:false,identity:null,identityChanged:false};
  Object.defineProperty(window,'__unifiedABTrace',{value:state});
  const proto=WebGL2RenderingContext.prototype;
  for(const name of ['createBuffer','bindBuffer','bufferData','getError','deleteBuffer','isContextLost','bufferSubData']){
   const native=proto[name];if(typeof native!=='function')throw Error('Missing native '+name);
   Object.defineProperty(proto,name,{configurable:true,writable:true,value:function(...args){
    if(!state.active)return Reflect.apply(native,this,args);
    const at=performance.now();let value,failed=false;
    try{value=Reflect.apply(native,this,args);return value;}catch(e){failed=true;throw e;}
    finally{const duration=performance.now()-at;
     if(state.active.calls.length>=256)state.overflow=true;
     else state.active.calls.push({name,at,duration,failed,code:name==='getError'?value:null,
      bytes:name==='bufferData'?(typeof args[1]==='number'?args[1]:args[1]?.byteLength??null):null});
    }
   }});
  }
  const identity=()=>{const c=document.querySelector('#scene');return c?[c.width,c.height,c.clientWidth,c.clientHeight,c.dataset.renderPreset,devicePixelRatio]:null;};
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&state.started&&!state.complete)state.interrupted=true;});
  document.addEventListener('webglcontextlost',()=>{if(state.started&&!state.complete)state.interrupted=true;},true);
  for(const type of ['pointerdown','click']){
   document.addEventListener(type,e=>{
    if(!state.armed||e.target?.closest?.('#dig')?.id!=='dig')return;
    if(!state.started){state.started=true;state.identity=identity();}
    state.active={type,start:performance.now(),calls:[]};
   },true);
   document.addEventListener(type,e=>{
    if(!state.active||state.active.type!==type)return;
    state.events.push({...state.active,eventMs:performance.now()-state.active.start});state.active=null;
   });
  }
  const frame=now=>{
   if(state.started&&!state.complete){
    if(JSON.stringify(identity())!==JSON.stringify(state.identity))state.identityChanged=true;
    if(state.frameLast!==null){if(state.frames.length>=16384)state.overflow=true;else state.frames.push(now-state.frameLast);}
    if(state.finish>0&&--state.finish===0)state.complete=true;
   }
   state.frameLast=now;if(!state.complete)requestAnimationFrame(frame);
  };requestAnimationFrame(frame);
 });
}
const settle=async(page,item)=>{
 await page.evaluate(({pose,cell})=>{const t=window.__mythwroughtTest;t.teleportCave(...pose);t.aimAt(...cell);},item);
 await page.waitForFunction(({pose,cell})=>{const c=document.querySelector('#scene'),t=window.__mythwroughtTest,p=t.m5ObservedPose();
  return c.dataset.targetBlock===cell.join(',')&&c.dataset.chunkCenter.startsWith(Math.floor(pose[0]/16)+',0|')&&
   +c.dataset.loadedChunks===27&&+c.dataset.pendingChunks===0&&c.dataset.playerGrounded==='true'&&c.dataset.playerColliding==='false'&&
   Math.abs(p.feet-pose[1])<.1&&Math.abs(p.x-pose[0]-.5)<.05&&Math.abs(p.z-pose[2]-.5)<.05&&!p.creative;
 },item,{timeout:90000});
};
async function run(mode,fixture){
 const ctx=await browser.newContext({...opts,storageState:fixture.state});const page=await ctx.newPage(),errors=[],missing=[];
 const row=report.runs[mode]={samples:[],errors,missing,completed:false};
 page.on('pageerror',e=>errors.push(String(e)));page.on('response',r=>{if(r.status()>=400)missing.push([r.url(),r.status()]);});
 try{
  await routeSource(ctx,mode==='control'?control:candidate);await traceInit(page);
  await page.goto(url,{waitUntil:'domcontentloaded'});await ready(page);
  assert.deepEqual(await save(page),fixture.original,'Starting exact schema-1 save differs');
  assert.deepEqual(await page.evaluate(plan=>plan.map(p=>window.__mythwroughtTest.block(...p.cell)),plan),plan.map(p=>p.previous));
  await settle(page,plan[0]);
  row.identity=await page.evaluate(()=>{const c=document.querySelector('#scene'),gl=c.getContext('webgl2'),e=gl.getExtension('WEBGL_debug_renderer_info');return {renderer:e?gl.getParameter(e.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER),css:[c.clientWidth,c.clientHeight],pixels:[c.width,c.height],preset:c.dataset.renderPreset,dpr:devicePixelRatio,seed:window.__mythwroughtTest.m5ObservedPose().seed};});
  await page.locator('#scene').screenshot({path:out+'/'+mode+'-before.png'});
  // Equal wall-clock passive sample, actual draws rather than RAF callbacks.
  await page.evaluate(()=>window.__gpuRealFrames.length=0);
  await page.waitForTimeout(5000);
  const idle=await page.evaluate(()=>window.__gpuRealFrames.slice());
  assert.ok(idle.length>=10&&idle.length<16385);
  const gaps=idle.slice(1).map((t,i)=>t-idle[i]);row.passive={...stats(gaps),slowFrames:gaps.filter(x=>x>33).length};
  await page.evaluate(()=>window.__gpuRealFrames.length=0);
  for(const [i,item] of plan.entries()){
   if(i)await settle(page,item);
   const before=await page.evaluate(({cell,key})=>({id:window.__mythwroughtTest.block(...cell),raw:localStorage.getItem(key),batch:window.__mythwroughtTest.snapshot().editMeshBatches}),{cell:item.cell,key});
   assert.equal(before.id,item.previous);
   const requested=await page.evaluate(()=>{
     const s=window.__unifiedABTrace;s.events=[];s.active=null;s.armed=true;
     return performance.now();
   });
   await page.locator('#dig').tap({timeout:30000,force:true});
   const observed=await page.evaluate(({cell,key})=>{
    const s=window.__unifiedABTrace,t=window.__mythwroughtTest;s.armed=false;
    return {now:performance.now(),events:s.events,overflow:s.overflow,active:s.active!==null,block:t.block(...cell),raw:localStorage.getItem(key),status:document.querySelector('#status').textContent,snapshot:t.snapshot()};
   },{cell:item.cell,key});
   assert.equal(observed.block,0);assert.match(observed.status,/Removed .* · saved/);
   assert.equal(observed.overflow,false);assert.equal(observed.active,false);
   assert.equal(JSON.parse(observed.raw).schema,1);assert.notEqual(observed.raw,before.raw);
   assert.equal(observed.snapshot.editMeshBatches,before.batch+1,'Actual edit did not publish exactly one mesh batch');
   assert.equal(observed.snapshot.graphics.lost,false);assert.equal(observed.snapshot.gpuRetry.failures,0);
   const events=observed.events.filter(e=>e.calls.some(c=>c.name==='bufferData'));
   assert.equal(events.length,1,'Exactly one actual mining upload event required');
   const calls=events[0].calls,uploads=calls.filter(c=>c.name==='bufferData'),checks=calls.filter(c=>c.name==='getError');
   assert.ok(calls.every(c=>!c.failed&&(c.name!=='getError'||c.code===0)));
   assert.ok(uploads.length>0&&uploads.length<=8);
   assert.equal(checks.length,2,'Unexpected exact native error-check count');
   const first=calls.find(c=>c.name==='createBuffer'||c.name==='getError'),last=checks.at(-1);
   const sample={i:i+1,witness:[...item.cell,item.previous,0],eventMs:events[0].eventMs,
    requestToReadbackMs:observed.now-requested,preCheckMs:checks[0].duration,postCheckMs:checks.at(-1).duration,
    guardedBatchMs:last.at+last.duration-first.at,checkMs:checks.reduce((n,c)=>n+c.duration,0),
    checkCount:checks.length,uploadBytes:uploads.map(c=>c.bytes),meshKeys:observed.snapshot.lastEditMeshKeys,calls};
   // Preserve first twelve diagnostic samples and full ordered action witnesses.
   // Retain every raw GL call for this small causal diagnostic.
   row.samples.push(sample);
   if((i+1)%10===0){console.log('UNIFIED GPU AB',mode,i+1,JSON.stringify(sample));await persist();}
  }
  await page.evaluate(()=>{window.__unifiedABTrace.finish=2;});
  await page.waitForFunction(()=>window.__unifiedABTrace.complete,null,{timeout:30000});
  const frame=await page.evaluate(()=>{const s=window.__unifiedABTrace;return {frames:s.frames,interrupted:s.interrupted,overflow:s.overflow,identityChanged:s.identityChanged};});
  assert.equal(frame.interrupted,false);assert.equal(frame.overflow,false);assert.equal(frame.identityChanged,false);assert.ok(frame.frames.length>=101&&frame.frames.length<=16384);
  row.callbackGaps=frame.frames;
  const submitted=await page.evaluate(()=>window.__gpuRealFrames.slice());
  assert.ok(submitted.length>=101&&submitted.length<=16384,'Actual rendered frames missing or trace overflow');
  row.frameGaps=submitted.slice(1).map((t,i)=>t-submitted[i]);row.slowFrames=row.frameGaps.filter(ms=>ms>33).length;
  row.event=stats(row.samples.map(s=>s.eventMs));row.guardedBatch=stats(row.samples.map(s=>s.guardedBatchMs));row.frame=stats(row.frameGaps);
  row.totalChecks=row.samples.reduce((n,s)=>n+s.checkCount,0);row.totalUploads=row.samples.reduce((n,s)=>n+s.uploadBytes.length,0);
  await page.locator('#scene').screenshot({path:out+'/'+mode+'-after.png'});
  row.finalSave=await save(page);await page.reload({waitUntil:'domcontentloaded'});await ready(page);
  assert.deepEqual(await save(page),row.finalSave);
  assert.deepEqual(await page.evaluate(plan=>plan.map(p=>window.__mythwroughtTest.block(...p.cell)),plan),Array(100).fill(0));
  assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);row.reloadReadback=100;row.completed=true;
 }catch(e){row.error=String(e?.stack??e);throw e;}finally{await persist();await ctx.close();}
}
try{
 const fixture=await setup();report.startingSaveSHA256=sha(JSON.stringify(fixture.original));await persist();
 // Counterbalance order across the four viewport jobs. Both arms use the
 // same source-created fixture, browser binary, renderer and complete source.
 for(const mode of modes)try{await run(mode,fixture);}catch(e){report.failures.push(mode+': '+String(e));}
 const a=report.runs.control,b=report.runs.candidate;
 if(a?.completed&&b?.completed){
  assert.deepEqual(a.identity,b.identity,'Diagnostic render identity mismatch');
  assert.deepEqual(a.samples.map(s=>[s.witness,s.uploadBytes,s.meshKeys]),b.samples.map(s=>[s.witness,s.uploadBytes,s.meshKeys]));
  assert.deepEqual(a.finalSave,b.finalSave);
  for(const stage of ['before','after']){
    const p=PNG.sync.read(await readFile(out+'/control-'+stage+'.png')),q=PNG.sync.read(await readFile(out+'/candidate-'+stage+'.png'));
    assert.deepEqual([p.width,p.height],[q.width,q.height]);
    const same=p.data.equals(q.data);report[stage+'PixelParity']=same;
    if(!same)report.failures.push('Actual '+stage+' canvas pixels differ (investigate clock/geometry)');
  }
  const fields=['eventMs','requestToReadbackMs','preCheckMs','postCheckMs','guardedBatchMs'];
  report.comparison=Object.fromEntries(fields.map(k=>[k,{control:stats(a.samples.map(s=>s[k])),candidate:stats(b.samples.map(s=>s[k]))}]));
  const actionGain=1-b.event.p95/a.event.p95,frameGain=1-b.frame.p95/a.frame.p95,totalGain=1-report.comparison.requestToReadbackMs.candidate.p95/report.comparison.requestToReadbackMs.control.p95;
  Object.assign(report.comparison,{actionGain,frameGain,totalGain});
  if(actionGain<.10)report.failures.push('Action p95 gain below 10%');
  if(b.frame.p50>a.frame.p50)report.failures.push('Median rendered frame interval regressed');
  if(b.passive.p50>a.passive.p50||b.passive.p95>a.passive.p95||b.passive.slowFrames*a.passive.count>a.passive.slowFrames*b.passive.count)report.failures.push('Equal-duration passive frame cadence regressed');
  if(frameGain<.10)report.failures.push('Actual rendered frame p95 gain below 10%');
  if(totalGain<.10)report.failures.push('Request-to-readback p95 gain below 10%');
  if(b.guardedBatch.p95>33)report.failures.push('Candidate guarded upload p95 above 33ms');
  if(b.slowFrames>a.slowFrames||b.slowFrames*a.frame.count>a.slowFrames*b.frame.count)report.failures.push('Actual slow frame count or rate regressed');
  if(report.comparison.requestToReadbackMs.candidate.worst>report.comparison.requestToReadbackMs.control.worst)report.failures.push('Worst total request latency regressed');
  report.priorStrictBothArms33ms=a.guardedBatch.p95<=33&&b.guardedBatch.p95<=33;
 }
 report.experimentalMetricGatesPassed=report.failures.length===0&&a?.completed===true&&b?.completed===true;
 report.metricGatesPassed=false;report.releaseCertified=false;
 console.log('GPU FRAME ADMISSION EXPERIMENT',JSON.stringify({comparison:report.comparison,failures:report.failures,experimentalMetricGatesPassed:report.experimentalMetricGatesPassed}));
 if(!report.experimentalMetricGatesPassed)process.exitCode=1;
}catch(e){report.failures.push(String(e?.stack??e));process.exitCode=1;}
finally{await persist();await browser.close();}
