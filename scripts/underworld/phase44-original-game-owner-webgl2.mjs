import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,sep,extname} from 'node:path';
import assert from 'node:assert/strict';
const root=process.cwd(),out=resolve(process.env.RUNNER_TEMP??'artifacts','phase44');
await mkdir(out,{recursive:true});
const types={'.mjs':'text/javascript','.js':'text/javascript','.html':'text/html','.css':'text/css','.json':'application/json','.png':'image/png','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'};
const server=createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost'),path=url.pathname==='/'?'/index.html':decodeURIComponent(url.pathname);
  const p=resolve(root,'.'+path);
  if(!p.startsWith(root+sep))throw Error('path');
  const body=await readFile(p);
  res.writeHead(200,{'Content-Type':types[extname(p)]??'application/octet-stream','Cache-Control':'no-store'});res.end(body);
 }catch{res.writeHead(404);res.end();}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
let browser,page,report={status:'INCOMPLETE',errors:[],consoleErrors:[],failedRequests:[],httpErrors:[]};
try{
 browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const context=await browser.newContext({viewport:{width:844,height:390},serviceWorkers:'block'});
 await context.addInitScript(()=>{
  // Track native buffer object lifetime and query actual BUFFER_SIZE after
  // bufferData; no simulated GL and no replacement of the renderer.
  const proto=WebGL2RenderingContext.prototype,states=new Map();
  const native={create:proto.createBuffer,del:proto.deleteBuffer,data:proto.bufferData};
  const sample=s=>{
   s.bytes=[...s.live.values()].reduce((n,b)=>n+b,0);
   s.peakBytes=Math.max(s.peakBytes,s.bytes);s.peakBuffers=Math.max(s.peakBuffers,s.live.size);
  };
  const get=gl=>{if(!states.has(gl))states.set(gl,{live:new Map(),bytes:0,peakBytes:0,peakBuffers:0,uploads:0,deletes:0,unknownTargets:0});return states.get(gl);};
  proto.createBuffer=function(...args){const b=native.create.apply(this,args);if(b){const s=get(this);s.live.set(b,0);sample(s);}return b;};
  proto.deleteBuffer=function(b){const s=get(this),r=native.del.call(this,b);if(s.live.delete(b))s.deletes++;sample(s);return r;};
  proto.bufferData=function(target,...args){
   const r=native.data.call(this,target,...args),s=get(this);
   const binding=new Map([[this.ARRAY_BUFFER,this.ARRAY_BUFFER_BINDING],[this.ELEMENT_ARRAY_BUFFER,this.ELEMENT_ARRAY_BUFFER_BINDING],
    [this.COPY_READ_BUFFER,this.COPY_READ_BUFFER_BINDING],[this.COPY_WRITE_BUFFER,this.COPY_WRITE_BUFFER_BINDING],
    [this.PIXEL_PACK_BUFFER,this.PIXEL_PACK_BUFFER_BINDING],[this.PIXEL_UNPACK_BUFFER,this.PIXEL_UNPACK_BUFFER_BINDING],
    [this.UNIFORM_BUFFER,this.UNIFORM_BUFFER_BINDING],[this.TRANSFORM_FEEDBACK_BUFFER,this.TRANSFORM_FEEDBACK_BUFFER_BINDING]]).get(target);
   if(binding===undefined){s.unknownTargets++;return r;}
   const b=this.getParameter(binding);
   if(b){s.live.set(b,this.getBufferParameter(target,this.BUFFER_SIZE));s.uploads++;sample(s);}
   return r;
  };
  window.__underworldGlStats=()=>[...states.values()].map(({live,...s})=>({...s,buffers:live.size}));
 });
 page=await context.newPage();
 page.on('pageerror',e=>report.errors.push(String(e.stack??e)));
 page.on('console',m=>{if(m.type()==='error')report.consoleErrors.push(m.text());});
 page.on('requestfailed',r=>report.failedRequests.push({url:r.url(),reason:r.failure()?.errorText}));
 page.on('response',r=>{if(r.status()>=400)report.httpErrors.push({url:r.url(),status:r.status()});});
 await page.goto('http://127.0.0.1:'+server.address().port+'/?underworld-acceptance=phase44');
 await page.waitForFunction(()=>Boolean(window.__mythwroughtTest)||window.__underworldAcceptanceBoot?.stage==='failed'||(()=>{const n=document.getElementById('notice');return n&&!n.hidden&&n.textContent.includes('renderer');})(),{},{timeout:120000});
 report.boot=await page.evaluate(()=>({state:window.__underworldAcceptanceBoot??null,notice:document.getElementById('notice')?.textContent,status:document.getElementById('status')?.textContent,hook:Boolean(window.__mythwroughtTest)}));
 assert.ok(report.boot.hook&&report.boot.state?.stage==='ready','GAME_BOOT_FAILED: '+JSON.stringify(report.boot));
 const first=await page.evaluate(()=>{
  const t=window.__mythwroughtTest,r=t.underworldGalleryInfo();
  t.teleportCave(...r.camera);t.setOrientation(0,0);
  const help=document.getElementById('help');if(help)help.hidden=true;
  return r;
 });
 const wait=()=>page.waitForFunction(()=>{const r=window.__mythwroughtTest.underworldGalleryInfo();return r.residentKeys.length===27&&r.pending===0;},{},{timeout:120000});
 await wait();
 const sample=()=>page.evaluate(()=>({game:window.__mythwroughtTest.underworldGalleryInfo(),gpu:window.__underworldGlStats(),
  dataset:{...document.getElementById('scene').dataset}}));
 const before=await sample();
 const overlays=await page.evaluate(()=>window.__mythwroughtTest.underworldGalleryOverlays());
 await page.waitForFunction(()=>Number(document.getElementById('scene').dataset.pack5MeshVertices)>0,{},{timeout:60000});
 await wait();
 const withOverlays=await sample();
 const cells=[[-625,-36,-2160],[-625,-35,-2160]];
 const stages=await page.evaluate(cells=>{
  const t=window.__mythwroughtTest,failed=t.underworldGalleryRestage(cells,2),success=t.underworldGalleryRestage(cells);
  return {failed,success};
 },cells);
 await wait();
 const after=await sample();
 await page.screenshot({path:resolve(out,'actual-game-gallery.png')});
 // Complete native original mask overlap diagnostic on this SAME projection,
 // without any new geometry construction or additional source census.
 const future=await page.evaluate(()=>window.__mythwroughtTest.underworldFutureMaskAudit());
 // Move to the historical original authored cave and back, using original
 // main renderer residency and retirement rather than a second GL context.
 const transition=await page.evaluate(()=>window.__mythwroughtTest.teleportCave(204,-124,136));
 await wait();
 const authored=await sample();
 await page.evaluate(camera=>window.__mythwroughtTest.teleportCave(...camera),first.camera);
 await wait();
 const returned=await sample();
 report={...report,status:'COMPLETE_LOCAL_GAME_WITNESS',first,before,overlays,withOverlays,stages,after,future,transition,authored,returned,
  productionDeployed:false,actualIPhone:false,constructionAdmission:false};
 console.log(JSON.stringify({camera:first.camera,projectedCuts:first.projectedCuts,sourceChecks:first.sourceChecks,overlays,
  resident:after.game.residentKeys.length,stage:after.game.stage,stages,nearBytes:after.game.nearBytes,
  pack5:after.game.pack5,sceneryBytes:after.game.sceneryBytes,effectBytes:after.game.effectAllocatedBytes,far:after.game.far,
  gpu:returned.gpu,authoredFar:authored.game.far,future,sourceSaveUnchanged:returned.game.sourceSaveUnchanged,
  errors:report.errors}));
 assert.equal(first.projectedCuts,18390);
 assert.equal(first.sourceChecks,24768);
 assert.equal(after.game.residentKeys.length,27);
 assert.equal(stages.failed.ok,false);assert.equal(stages.failed.reason,'UNDERWORLD_INJECTED_STAGE_FAILURE');
 assert.equal(stages.failed.preserved,true);assert.equal(stages.success.ok,true);
 assert.equal(stages.success.keys.length,6);
 assert.ok(after.game.stage.maxSourceCalls<=40000);
 assert.ok(after.game.pack5.bytes>0);
 assert.ok(Number(withOverlays.dataset.pack3PhysicalCount)>0);
 assert.ok(Number(withOverlays.dataset.manual14PhysicalCount)>0);
 assert.ok(Number(withOverlays.dataset.waterSections)>0);
 assert.ok(returned.gpu.some(s=>s.peakBytes>0&&s.uploads>0&&s.deletes>0&&s.unknownTargets===0));
 assert.equal(returned.game.sourceSaveUnchanged,true);
 assert.equal(future.constructionAdmission,false);
 assert.deepEqual(report.errors,[]);
} catch(e){
 report.errors.push(String(e.stack??e));
 if(page){
  try{report.failureState=await page.evaluate(()=>({boot:window.__underworldAcceptanceBoot??null,notice:document.getElementById('notice')?.textContent,status:document.getElementById('status')?.textContent,hook:Boolean(window.__mythwroughtTest),dataset:{...document.getElementById('scene')?.dataset}}));}catch(d){report.errors.push('failure-state: '+String(d));}
  try{await page.screenshot({path:resolve(out,'failure.png'),timeout:10000});}catch(d){report.errors.push('failure-screenshot: '+String(d));}
 }
 console.error(JSON.stringify(report));console.error(e);throw e;
}
finally{await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2));await browser?.close();server.close();}
