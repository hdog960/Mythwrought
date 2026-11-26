// Diagnostic only: exact frozen source with reversible phase markers.
// Serial gl.finish isolates work; numbers are NOT normal FPS or acceptance.
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
const out='artifacts/unified-gpu-phase-cost';await mkdir(out,{recursive:true});
const report={source:frozen,sourceSHA256:hash(source),instrumentedSHA256:hash(instrumented),head:process.env.GITHUB_SHA,diagnosticOnly:true,physicalIphone:false,complete:false,scenes:{},errors:[]};
const browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:956,height:440},deviceScaleFactor:1,hasTouch:true,isMobile:true,serviceWorkers:'block'});
const page=await context.newPage();page.on('pageerror',e=>report.errors.push(String(e)));
await context.route('**/src/main.mjs*',r=>r.fulfill({status:200,contentType:'text/javascript',body:instrumented}));
await page.addInitScript(()=>{
 const p={active:false,frames:[],current:null,last:0,remaining:0,
 begin(gl){
  gl.finish();this.current={phases:[],start:performance.now()};
  this.last=this.current.start;
 },
 mark(gl,name){
  if(!this.current)return;
  const cpu=performance.now();gl.finish();const done=performance.now();
  this.current.phases.push({name,submitMs:cpu-this.last,drainMs:done-cpu,totalMs:done-this.last});
  this.last=done;
 },
 end(gl){
  if(!this.current)return;
  this.current.wallMs=performance.now()-this.current.start;
  this.current.lost=gl.isContextLost();this.frames.push(this.current);this.current=null;
  if(--this.remaining<=0)this.active=false;
 }};
 Object.defineProperty(window,'__phaseCost',{value:p});
});
const ready=()=>page.waitForFunction(()=>window.__mythwroughtTest&&Number(document.querySelector('#scene').dataset.pendingChunks)===0&&Number(document.querySelector('#scene').dataset.loadedChunks)>=25&&document.querySelector('#notice').hidden,null,{timeout:120000});
async function capture(name){
 await ready();
 const identity=await page.evaluate(()=>{const c=document.querySelector('#scene'),gl=c.getContext('webgl2'),e=gl.getExtension('WEBGL_debug_renderer_info');return {renderer:e?gl.getParameter(e.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER),pixels:[c.width,c.height],preset:c.dataset.renderPreset,pose:window.__mythwroughtTest.m5ObservedPose(),vertices:c.dataset.renderedMeshVertices,far:c.dataset.c6FarDrawn,scenery:c.dataset.nonblockVertices,actors:c.dataset.mobActors};});
 await page.evaluate(()=>{const p=window.__phaseCost;p.frames=[];p.remaining=8;p.active=true;});
 await page.waitForFunction(()=>window.__phaseCost.frames.length===8&&!window.__phaseCost.active,null,{timeout:90000});
 const frames=await page.evaluate(()=>window.__phaseCost.frames);
 assert.ok(frames.every(f=>!f.lost&&f.phases.length===12&&f.phases.every(p=>Number.isFinite(p.totalMs)&&p.totalMs>=0)));
 const phases=Object.fromEntries(anchors.map(([name])=>{const v=frames.map(f=>f.phases.find(p=>p.name===name).totalMs).sort((a,b)=>a-b);return [name,{median:v[3],worst:v.at(-1)}];}));
 report.scenes[name]={identity,frames,phases};
 const image=await page.locator('#scene').screenshot({path:out+'/'+name+'.png'});report.scenes[name].imageSHA256=hash(image);
 console.log('PHASE COST',name,JSON.stringify({identity,phases}));await writeFile(out+'/report.json',JSON.stringify(report,null,2));
}
try{
 await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});await ready();
 await capture('surface');
 await page.evaluate(()=>{const t=window.__mythwroughtTest;for(let x=-1;x<=1;x++)for(let z=0;z<=3;z++){t.editBiomeCell(x,-79,z,3);for(let y=-78;y<=-76;y++)t.editBiomeCell(x,y,z,0);}t.placeFixture(0,-77,3,3);t.teleportCave(0,-78,1);t.aimAt(0,-77,3);});
 await page.waitForFunction(()=>{const c=document.querySelector('#scene');return Number(c.dataset.pendingChunks)===0&&c.dataset.targetBlock==='0,-77,3'&&Number(c.dataset.playerFeet)<-77;},null,{timeout:120000});
 await capture('deep');
 assert.deepEqual(report.errors,[]);report.complete=true;
}catch(e){report.errors.push(String(e.stack??e));process.exitCode=1;}
finally{await writeFile(out+'/report.json',JSON.stringify(report,null,2));await browser.close();}
