// One real game browser path: explicit LOCAL candidate UI, genuine WebGL2,
// atomic service worker shell, cold offline reopen and actual save. No teleport.
import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=process.cwd(),out=path.join(root,'artifacts/mountain-v8-renderer');
await mkdir(out,{recursive:true});
const release='20261124-mountain-v8-candidate-08',seed=179;
const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webmanifest':'application/manifest+json'};
let requests=0,offline=false;
const afterCutoff=[];
const server=createServer(async(req,res)=>{
 requests++;if(offline)afterCutoff.push(req.url);
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
  if(pathname==='/fixture'){res.writeHead(200,{'Content-Type':'text/html'});res.end('<!doctype html><title>isolated fixture</title>');return;}
  const resolved=path.resolve(root,'.'+pathname);
  if(resolved!==root&&!resolved.startsWith(root+path.sep))throw Error('bad path');
  const file=resolved===root?path.join(root,'index.html'):resolved;
  const bytes=await readFile(file);
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream',
    'Cache-Control':pathname==='/sw-m5.js'?'public, max-age=300':'no-store'});res.end(bytes);
 }catch(e){res.writeHead(404);res.end(String(e));}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin='http://127.0.0.1:'+server.address().port;
let browser,ctx;
const report={release,seed,realChromium:true,physicalIphone:false,softwareWebGL2:true,checks:[],screens:[],errors:[],finished:false};
const persist=()=>writeFile(path.join(out,'manifest.json'),JSON.stringify(report,null,2));
const check=(name,ok,info={})=>{report.checks.push({name,ok:Boolean(ok),...info});console.log('V8 '+name,JSON.stringify({ok:Boolean(ok),...info}));assert.ok(ok,name);};
try{
 browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox','--no-sandbox']});
 ctx=await browser.newContext({viewport:{width:844,height:390},deviceScaleFactor:1,serviceWorkers:'allow'});
 const page=await ctx.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(String(e)));
 // Isolated existing V8 fixture at historically known seed179. This is
 // explicitly not public new-world admission and never uses real user storage.
 await page.goto(origin+'/fixture');
 await page.evaluate(async()=>{
  const {FourRegionWorld,fourRegionProfile,M8_MOUNTAIN_GENERATOR}=await import('/src/manual-biomes/profile-world.mjs');
  const {saveFingerprint,saveWorldSafe}=await import('/src/persistence.mjs');
  const {worldSlotKey}=await import('/src/seeds.mjs');
  const profile=fourRegionProfile(179,M8_MOUNTAIN_GENERATOR),raw=JSON.stringify(profile);
  const record=JSON.stringify({version:1,checksum:saveFingerprint(raw),raw});
  const key=worldSlotKey(179)+'-four-biomes-profile-v1';
  localStorage.setItem(key,record);localStorage.setItem(key+'-journal',record);
  const result=saveWorldSafe(localStorage,new FourRegionWorld(179,profile));
  if(!result.ok)throw Error(JSON.stringify(result));
 });
 await page.goto(origin+'/index.html',{waitUntil:'load',timeout:90000});
 await page.waitForFunction(()=>window.__mythwroughtTest?.fourBiomeProfile()?.generator==='mythwrought-five-surface-regions-mountain-v8',null,{timeout:90000});
 const site=await page.evaluate(async()=>{
  const t=window.__mythwroughtTest,{FourRegionWorld,fourRegionProfile,M8_MOUNTAIN_GENERATOR}=await import('/src/manual-biomes/profile-world.mjs');
  const {raycast}=await import('/src/voxel.mjs');
  const {MOUNTAIN_V8_PLANT_PATTERNS}=await import('/src/manual-biomes/mountain-v8-vegetation-cells.mjs');
  const world=new FourRegionWorld(179,fourRegionProfile(179,M8_MOUNTAIN_GENERATOR));
  const cells=MOUNTAIN_V8_PLANT_PATTERNS['dwarf-conifer'].map(([dx,dy,dz])=>[-470+dx,12+dy,5+dz]);
  if(cells.some(c=>![370,379].includes(t.block(...c))))throw Error('Known tree missing');
  let pose=null,target=null;
  for(const [dx,dz] of [[-3,0],[3,0],[0,-3],[0,3],[-2,0],[2,0],[0,-2],[0,2],[-3,-2],[3,2]]){
   const p=t.teleport(-470.0+dx+.5,5.0+dz+.5);
   for(const y of [13,14,15]){
    const eye=[p.x,p.feet+1.55,p.z],d=[-469.5-eye[0],y+.5-eye[1],5.5-eye[2]],len=Math.hypot(...d);
    const hit=raycast(world,eye,d.map(v=>v/len),6);
    if(hit?.hit?.join(',')===[-470,y,5].join(',')){pose=p;target=[-470,y,5];break;}
   }
   if(pose)break;
  }
  if(!pose)throw Error('No safe genuine terrain camera with trunk ray');
  t.aimAt(...target);
  return {pose,target,cells};
 });
 check('actual-natural-tree-and-safe-local-camera',site.cells.length===13,site);
 await page.waitForFunction(()=>window.__mythwroughtTest.snapshot().chunks.includes('-30,0'),null,{timeout:90000});
 const capture=async(kind)=>{
  const data=await page.evaluate(()=>{
   const t=window.__mythwroughtTest,s=t.snapshot(),gl=document.querySelector('#scene').getContext('webgl2');
   return {pose:t.m5ObservedPose(),graphics:s.graphics,chunks:s.chunks.length,glError:gl.getError(),lost:gl.isContextLost(),retries:s.gpuRetry};
  });
  check(kind+'-real-webgl2',data.graphics.shaderReady&&data.chunks>0&&!data.lost&&data.glError===0,data);
  const file=kind+'.png',png=await page.screenshot({path:path.join(out,file),timeout:90000});
  report.screens.push({file,bytes:png.length,sha256:createHash('sha256').update(png).digest('hex')});await persist();
 };
 await capture('core-before');
 // Real Pack2 water in a separate natural AIR cell within the same chunk.
 const water=await page.evaluate(()=>{
  const t=window.__mythwroughtTest;
  for(let x=-480;x<=-477;x++)for(let z=10;z<=14;z++)
   for(let y=17;y>=14;y--)if(t.block(x,y,z)===0){
    t.placeFixture(x,y,z,76);
    if(t.block(x,y,z)===76)return [x,y,z];
   }
  throw Error('No water fixture');
 });
 const fault=await page.evaluate(({site,water})=>{
  const t=window.__mythwroughtTest,gl=document.querySelector('#scene').getContext('webgl2');
  const key='mythwrought-v002-world-179',before=localStorage.getItem(key),snap=t.snapshot();
  const create=gl.createBuffer.bind(gl),del=gl.deleteBuffer.bind(gl),upload=gl.bufferData.bind(gl);
  const made=[],deleted=[];let calls=0;
  gl.createBuffer=function(){const h=create();made.push(h);return h;};
  gl.deleteBuffer=function(h){deleted.push(h);return del(h);};
  gl.bufferData=function(...a){calls++;if(calls===2)throw Error('injected second-buffer failure on actual browser renderer');return upload(...a);};
  try{t.aimAt(...site.target);document.querySelector('#dig').click();}
  finally{gl.createBuffer=create;gl.deleteBuffer=del;gl.bufferData=upload;}
  return {calls,created:made.length,deleted:deleted.length,onlyCandidateDeleted:deleted.every(h=>made.includes(h)),
   treeIntact:site.cells.every(c=>[370,379].includes(t.block(...c))),water:t.block(...water),
   saveUnchanged:before===localStorage.getItem(key),batchUnchanged:snap.editMeshBatches===t.snapshot().editMeshBatches};
 },{site,water});
 check('injected-second-upload-real-renderer-rollback',fault.calls===2&&fault.created===2&&fault.deleted===2&&fault.onlyCandidateDeleted&&fault.treeIntact&&fault.water===76&&fault.saveUnchanged&&fault.batchUnchanged,fault);
 const mined=await page.evaluate(({site,water})=>{
  const t=window.__mythwroughtTest,before=t.snapshot().editMeshBatches;
  t.aimAt(...site.target);document.querySelector('#dig').click();
  const save=JSON.parse(localStorage.getItem('mythwrought-v002-world-179'));
  return {removed:site.cells.filter(c=>t.block(...c)===0).length,water:t.block(...water),
    batches:t.snapshot().editMeshBatches-before,dirty:t.snapshot().lastEditMeshKeys,editRows:save.edits.length,schema:save.schema};
 },{site,water});
 check('actual-mine-ui-tree-batch',mined.removed===13&&mined.water===76&&mined.batches===1&&mined.dirty.includes('-30,0')&&mined.editRows===13&&mined.schema===1,mined);
 await capture('core-after');
 const saved=await page.evaluate(()=>localStorage.getItem('mythwrought-v002-world-179'));
 await page.evaluate(()=>{
  const gl=document.querySelector('#scene').getContext('webgl2'),ext=gl.getExtension('WEBGL_lose_context');
  if(!ext)throw Error('actual context loss extension unavailable');window.__mountainLoseContext=ext;ext.loseContext();
 });
 await page.waitForFunction(()=>window.__mythwroughtTest.snapshot().graphics.lost,null,{timeout:30000});
 const lost=await page.evaluate(()=>({graphics:window.__mythwroughtTest.snapshot().graphics,lost:document.querySelector('#scene').getContext('webgl2').isContextLost()}));
 check('real-context-loss-event',lost.graphics.lost&&lost.lost&&lost.graphics.lossCount===1,lost);
 await page.evaluate(()=>window.__mountainLoseContext.restoreContext());
 await page.waitForFunction(()=>{const s=window.__mythwroughtTest.snapshot();return !s.graphics.lost&&s.graphics.restoredCount===1&&s.chunks.includes('-30,0');},null,{timeout:90000});
 const restored=await page.evaluate(({site,water,saved})=>{
  const t=window.__mythwroughtTest;
  return {treeRemoved:site.cells.every(c=>t.block(...c)===0),water:t.block(...water),saveUnchanged:localStorage.getItem('mythwrought-v002-world-179')===saved,graphics:t.snapshot().graphics};
 },{site,water,saved});
 check('real-context-restoration-and-source-preservation',restored.treeRemoved&&restored.water===76&&restored.saveUnchanged&&restored.graphics.restoredCount===1,restored);
 await capture('core-restored');
 await page.evaluate(()=>{const t=window.__mythwroughtTest;t.teleport(-270,-180);t.setOrientation(Math.PI/2,-.14);});
 await page.waitForFunction(()=>window.__mythwroughtTest.snapshot().chunks.includes('-17,-12'),null,{timeout:90000});
 await capture('shoulder');
 check('no-browser-errors',errors.length===0,{errors});
 report.finished=true;await persist();
}catch(e){report.errors.push(String(e));await persist();throw e;}
finally{await ctx?.close();await browser?.close();await new Promise(r=>server.close(r));}
