// Diagnostic only: exact frozen source with reversible phase markers.
// Match the real mining fixture and compare full-frame readback with phase-local error barriers.
// Measurements deliberately synchronize rendering; never use these as gameplay FPS.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const frozen='f48c42e85c979dd66d8b42db0e8b01dd531b0fe6';
const source=execFileSync('git',['show',frozen+':src/main.mjs'],{encoding:'utf8',maxBuffer:16*1024*1024});
const hash=s=>createHash('sha256').update(s).digest('hex');
const start='  function draw(now){';
const end='  const frameDriver=new ForegroundFrameDriver(';
const a=source.indexOf(start),b=source.indexOf(end,a);assert.ok(a>0&&b>a);
let draw=source.slice(a,b);
const begin="    if(!document.hidden&&!graphicsLost){\n";
const marker=(name)=>"      if(window.__phaseCost?.active)window.__phaseCost.mark(gl,'"+name+"');\n";
const anchors=[
 ['simulation','      const buffer=bufferDimensions'],
 ['sky','      gl.enable(gl.DEPTH_TEST);'],
 ['terrain-setup','      stream();'],
 ['stream-mobs-far-update','      for(const c of chunks.values()){\n        if(!c.buffer||!c.count)continue;'],
 ['near-opaque','      // Original source-composed far-rock opaque pass'],
 ['far-opaque','      // Pack 5 uses the EXISTING game terrain program'],
 ['pack5','      if(nonblockWorld&&!hasLiveScenery())'],
 ['scenery','      // Real depth-tested 40-model instancing'],
 ['mobs','      // Genuine transparent-water pass'],
 ['water','      const effects=nonblockStage?.effects??worldEffects;'],
 ['effects','      // A faint world-space targeted-block outline'],
 ['outline-hud','      canvas.dataset.precision=String(precisionHeld||keys.has('+"'ShiftLeft'"+')||keys.has('+"'ShiftRight'"+'));\n']
];
assert.equal(draw.split(begin).length,2);
draw=draw.replace(begin,begin+"      if(window.__phaseCost?.active)window.__phaseCost.begin(gl);\n");
for(const [name,anchor] of anchors){
 assert.equal(draw.split(anchor).length,2,'Missing unique phase '+name);
 draw=name==='outline-hud'?draw.replace(anchor,anchor+marker(name)+"      if(window.__phaseCost?.active)window.__phaseCost.end(gl);\n"):draw.replace(anchor,marker(name)+anchor);
}
const instrumented=source.slice(0,a)+draw+source.slice(b);
const out='artifacts/unified-gpu-barrier-attribution';await mkdir(out,{recursive:true});
const report={source:frozen,sourceSHA256:hash(source),instrumentedSHA256:hash(instrumented),head:process.env.GITHUB_SHA,diagnosticOnly:true,physicalIphone:false,complete:false,scenes:{},errors:[]};
const browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:956,height:440},deviceScaleFactor:1,hasTouch:true,isMobile:true,serviceWorkers:'block'});
const page=await context.newPage();page.on('pageerror',e=>report.errors.push(String(e)));
await context.route('**/src/main.mjs*',r=>r.fulfill({status:200,contentType:'text/javascript',body:instrumented}));
await page.addInitScript(()=>{
 const p={active:false,frames:[],current:null,last:0,remaining:0,mode:'ordinary',draws:0,vertices:0,pixels:null,
 check(gl){
  const t=performance.now(),error=gl.getError(),elapsed=performance.now()-t;
  if(error!==gl.NO_ERROR||gl.isContextLost())throw Error('Real diagnostic GPU error '+error);
  return elapsed;
 },
 read(gl){
  const w=gl.drawingBufferWidth,h=gl.drawingBufferHeight;
  if(!w||!h||w*h>2e6)throw Error('Unexpected framebuffer size');
  if(!this.pixels||this.pixels.length!==w*h*4)this.pixels=new Uint8Array(w*h*4);
  const t=performance.now();
  gl.readPixels(0,0,w,h,gl.RGBA,gl.UNSIGNED_BYTE,this.pixels);
  const elapsed=performance.now()-t,errorCheckMs=this.check(gl);
  // Hash sampled actual framebuffer bytes, rather than counting calls alone.
  let hash=2166136261,alpha=0;
  for(let i=0;i<this.pixels.length;i+=64){hash=Math.imul(hash^this.pixels[i],16777619);alpha+=this.pixels[i+3];}
  if(!alpha)throw Error('No actual opaque framebuffer evidence');
  return {elapsed,errorCheckMs,hash:hash>>>0,bytes:this.pixels.length};
 },
 begin(gl){
  const start=performance.now();
  // Ordinary mode adds no GPU calls until the real render has completed.
  // Phase mode explicitly serializes with the same API implicated in edits.
  const previousCheckMs=this.mode==='phase-check'?this.check(gl):null;
  this.current={phases:[],start,previousCheckMs};
  this.last=performance.now();this.draws=0;this.vertices=0;
 },
 mark(gl,name){
  if(!this.current)return;
  const cpu=performance.now(),checkMs=this.mode==='phase-check'?this.check(gl):null,done=performance.now();
  this.current.phases.push({name,submitMs:cpu-this.last,checkMs,draws:this.draws,vertices:this.vertices});
  this.last=done;this.draws=0;this.vertices=0;
 },
 end(gl){
  if(!this.current)return;
  this.current.submitWallMs=performance.now()-this.current.start;
  this.current.readback=this.read(gl);
  this.current.totalWallMs=performance.now()-this.current.start;
  this.current.lost=gl.isContextLost();this.frames.push(this.current);this.current=null;
  if(--this.remaining<=0)this.active=false;
 }};
 Object.defineProperty(window,'__phaseCost',{value:p});
 const proto=WebGL2RenderingContext.prototype;
 for(const [name,countIndex,instanceIndex] of [['drawArrays',2,null],['drawElements',1,null],['drawArraysInstanced',2,3],['drawElementsInstanced',1,4]]){
  const original=proto[name];if(typeof original!=='function')throw Error('Missing '+name);
  Object.defineProperty(proto,name,{configurable:true,writable:true,value:function(...args){
   if(p.current){p.draws++;p.vertices+=args[countIndex]*(instanceIndex===null?1:args[instanceIndex]);}
   return Reflect.apply(original,this,args);
  }});
 }
});
const ready=()=>page.waitForFunction(()=>window.__mythwroughtTest&&Number(document.querySelector('#scene').dataset.pendingChunks)===0&&Number(document.querySelector('#scene').dataset.loadedChunks)>=25&&document.querySelector('#notice').hidden,null,{timeout:120000});
async function capture(name){
 await ready();
 const identity=await page.evaluate(()=>{const c=document.querySelector('#scene'),gl=c.getContext('webgl2'),e=gl.getExtension('WEBGL_debug_renderer_info');return {renderer:e?gl.getParameter(e.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER),pixels:[c.width,c.height],preset:c.dataset.renderPreset,pose:window.__mythwroughtTest.m5ObservedPose(),vertices:c.dataset.renderedMeshVertices,far:c.dataset.c6FarDrawn,scenery:c.dataset.nonblockVertices,actors:c.dataset.mobActors,owners:window.__mythwroughtTest.snapshot().chunks};});
 const modes={};
 for(const mode of ['ordinary','phase-check']){
  await page.evaluate(mode=>{const p=window.__phaseCost;p.frames=[];p.remaining=8;p.mode=mode;p.active=true;},mode);
  await page.waitForFunction(()=>window.__phaseCost.frames.length===8&&!window.__phaseCost.active,null,{timeout:90000});
  const frames=await page.evaluate(()=>window.__phaseCost.frames);
  assert.ok(frames.every(f=>!f.lost&&f.phases.length===12&&f.readback.bytes===identity.pixels[0]*identity.pixels[1]*4&&f.readback.elapsed>=0&&f.phases.some(p=>p.draws>0)));
  const median=values=>values.slice().sort((a,b)=>a-b)[3];
  modes[mode]={frames,medianFullReadbackMs:median(frames.map(f=>f.readback.elapsed)),medianTotalWallMs:median(frames.map(f=>f.totalWallMs)),phases:Object.fromEntries(anchors.map(([name])=>{const p=frames.map(f=>f.phases.find(p=>p.name===name));return [name,{medianSubmitMs:median(p.map(x=>x.submitMs)),medianCheckMs:mode==='phase-check'?median(p.map(x=>x.checkMs)):null,drawCounts:p.map(x=>x.draws),vertexCounts:p.map(x=>x.vertices)}];}))};
 }
 report.scenes[name]={identity,modes};
 const image=await page.locator('#scene').screenshot({path:out+'/'+name+'.png'});report.scenes[name].imageSHA256=hash(image);
 console.log('BARRIER ATTRIBUTION',name,JSON.stringify({identity,modes:Object.fromEntries(Object.entries(modes).map(([k,v])=>[k,{medianFullReadbackMs:v.medianFullReadbackMs,medianTotalWallMs:v.medianTotalWallMs,phases:v.phases}]))}));await writeFile(out+'/report.json',JSON.stringify(report,null,2));
}
try{
 await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});await ready();
 await capture('surface');
 const plan=Array.from({length:50},(_,x)=>[-77,-78].map(y=>({pose:[x,-78,1],cell:[x,y,3],previous:(x+y)%2===0?3:8}))).flat();
 await page.evaluate(plan=>{
  const t=window.__mythwroughtTest;
  const set=(x,y,z,id)=>{if(t.block(x,y,z)!==id&&!t.editBiomeCell(x,y,z,id))throw Error('Setup rejected '+[x,y,z,id]);if(t.block(x,y,z)!==id)throw Error('Setup readback mismatch');};
  for(let x=-1;x<=50;x++)for(let z=0;z<=2;z++){set(x,-79,z,3);for(let y=-78;y<=-76;y++)set(x,y,z,0);}
  for(const p of plan)set(...p.cell,p.previous);
  const last=plan.at(-1);t.placeFixture(...last.cell,last.previous);
 },plan);
 await page.reload({waitUntil:'domcontentloaded'});await ready();
 report.initialSave=await page.evaluate(()=>localStorage.getItem('mythwrought-v002-world-179'));
 assert.equal(JSON.parse(report.initialSave).schema,1);
 for(const index of [0,32,64,98]){
  const item=plan[index];
  await page.evaluate(({pose,cell})=>{const t=window.__mythwroughtTest;t.teleportCave(...pose);t.aimAt(...cell);},item);
  await page.waitForFunction(cell=>{const c=document.querySelector('#scene');return Number(c.dataset.pendingChunks)===0&&Number(c.dataset.loadedChunks)===27&&c.dataset.targetBlock===cell.join(',')&&c.dataset.playerGrounded==='true'&&c.dataset.playerColliding==='false';},item.cell,{timeout:120000});
  await capture('mine-'+index);
  const before=await page.evaluate(()=>window.__mythwroughtTest.snapshot().editMeshBatches);
  await page.locator('#dig').tap({force:true});
  const witness=await page.evaluate(({cell})=>({block:window.__mythwroughtTest.block(...cell),batches:window.__mythwroughtTest.snapshot().editMeshBatches,status:document.querySelector('#status').textContent,raw:localStorage.getItem('mythwrought-v002-world-179')}),item);
  assert.equal(witness.block,0);assert.equal(witness.batches,before+1);assert.match(witness.status,/Removed .* · saved/);
  report.scenes['mine-'+index].editWitness={cell:item.cell,savedSHA256:hash(witness.raw),actualMeshBatch:true};
 }
 const final=await page.evaluate(()=>localStorage.getItem('mythwrought-v002-world-179'));await page.reload({waitUntil:'domcontentloaded'});await ready();
 assert.equal(await page.evaluate(()=>localStorage.getItem('mythwrought-v002-world-179')),final);
 assert.deepEqual(await page.evaluate(cells=>cells.map(c=>window.__mythwroughtTest.block(...c)),[0,32,64,98].map(i=>plan[i].cell)),[0,0,0,0]);
 report.finalSaveSHA256=hash(final);report.coldReload=true;
 assert.deepEqual(report.errors,[]);report.complete=true;
}catch(e){report.errors.push(String(e.stack??e));process.exitCode=1;}
finally{await writeFile(out+'/report.json',JSON.stringify(report,null,2));await browser.close();}
