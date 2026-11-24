// Current isolated candidate: complete surface streaming and shared shaped renderer.
import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=process.cwd(),out=path.join(root,'artifacts/mountain-v8-final-crown');
await mkdir(out,{recursive:true});
const release='20261124-mountain-v8-candidate-14',seed=179;
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
 page.on('pageerror',e=>errors.push(String(e)));page.on('dialog',d=>d.accept());
 // Isolated existing V8 fixture at historically known seed179. This is
 // explicitly not public new-world admission and never uses real user storage.
 await page.goto(origin+'/fixture');
 await page.evaluate(async()=>{
  const {FourRegionWorld,fourRegionProfile,M8_MOUNTAIN_GENERATOR}=await import('/src/manual-biomes/profile-world.mjs');
  const {saveFingerprint,saveWorldSafe}=await import('/src/persistence.mjs');
  const {worldSlotKey}=await import('/src/seeds.mjs');
  const {mountainV8Storage,setMountainV8Active}=await import('/src/manual-biomes/mountain-v8-isolated-storage.mjs');
  const store=mountainV8Storage(localStorage);
  const profile=fourRegionProfile(179,M8_MOUNTAIN_GENERATOR),raw=JSON.stringify(profile);
  const record=JSON.stringify({version:1,checksum:saveFingerprint(raw),raw});
  const key=worldSlotKey(179)+'-four-biomes-profile-v1';
  store.setItem(key,record);store.setItem(key+'-journal',record);
  const result=saveWorldSafe(store,new FourRegionWorld(179,profile));
  setMountainV8Active(localStorage,true);
  if(!result.ok)throw Error(JSON.stringify(result));
 });
 await page.goto(origin+'/index.html',{waitUntil:'load',timeout:90000});
 await page.waitForFunction(()=>window.__mythwroughtTest?.fourBiomeProfile()?.generator==='mythwrought-five-surface-regions-mountain-v8',null,{timeout:90000});

 // Never infer completeness from a single resident chunk or a count alone.
 // The source stream() surface contract is exactly the 5x5 window.
 const fullyStreamed=async(label)=>{
  const getExpected=()=>page.evaluate(async()=>{
   const t=window.__mythwroughtTest,p=t.m5ObservedPose();
   const {chunkWindow}=await import('/src/voxel.mjs');
   const {sectionWindow,sectionChunkRadius,depthMeshKey}=await import('/src/depth.mjs');
   if(sectionWindow(p.feet,false).join(',')!=='0')throw Error('Camera is not in surface section');
   return chunkWindow(p.x,p.z,sectionChunkRadius(0,0)).map(c=>depthMeshKey(c.cx,c.cz,0)).sort();
  });
  const expected=await getExpected();
  assert.equal(expected.length,25,'Original surface window');
  await page.waitForFunction(expected=>{
   const t=window.__mythwroughtTest,s=t.snapshot();
   return s.graphics.shaderReady&&!s.graphics.lost&&s.pending.length===0&&
    s.gpuRetry.pendingRetries===0&&s.chunks.slice().sort().join('|')===expected.join('|');
  },expected,{timeout:180000,polling:250});
  // Two completed animation frames after publication, then recheck exact keys.
  await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  const data=await page.evaluate(()=>{
   const t=window.__mythwroughtTest,s=t.snapshot(),gl=document.querySelector('#scene').getContext('webgl2');
   return {pose:t.m5ObservedPose(),chunks:s.chunks.slice().sort(),pending:s.pending,
    graphics:s.graphics,retries:s.gpuRetry,glError:gl.getError(),
    renderedFrames:Number(document.querySelector('#scene').dataset.renderedFrames)};
  });
  check(label+'-full-surface-window',JSON.stringify(data.chunks)===JSON.stringify(expected)&&
   JSON.stringify(await getExpected())===JSON.stringify(expected)&&data.pending.length===0&&
   data.retries.failures===0&&data.retries.pendingRetries===0&&data.glError===0&&
   data.graphics.shaderReady&&!data.graphics.lost&&data.renderedFrames>0,data);
  const file=label+'.png',png=await page.screenshot({path:path.join(out,file),timeout:90000});
  report.screens.push({file,bytes:png.length,sha256:createHash('sha256').update(png).digest('hex')});
  await persist();
 };
 // Real seed179 source, no artificial geometry in the landscape screenshots.
 const core=await page.evaluate(()=>{
  const t=window.__mythwroughtTest,p=t.teleport(-473.5,5.5);
  t.aimAt(-470,15,5);
  return {p,tree:[13,14,15].map(y=>t.block(-470,y,5))};
 });
 check('natural-core-source',core.tree.every(id=>id===511),core);
 await fullyStreamed('core-natural');
 await page.evaluate(()=>{const t=window.__mythwroughtTest;t.teleport(-270,-180);t.setOrientation(Math.PI/2,-.14);});
 await fullyStreamed('shoulder-natural');
 // Revised crown only: retain accepted flower/heather, shared overlay and
 // portable-import results from the previous exact source, without reruns.
 await page.evaluate(()=>{const t=window.__mythwroughtTest;t.teleport(-470.5,1.5);t.aimAt(-470,15,5);});
 await fullyStreamed('core-second-angle');
 await page.waitForFunction(()=>Boolean(navigator.serviceWorker.controller),null,{timeout:180000});
 const cache=await page.evaluate(async release=>{
  const name='mythwrought-m5-shell-'+release,keys=await caches.keys();
  const c=keys.includes(name)?await caches.open(name):null;
  const urls=c?(await c.keys()).map(r=>r.url):[];
  return {name,keys,urls,controller:navigator.serviceWorker.controller?.scriptURL};
 },release);
 check('candidate14-shell-closure',cache.keys.includes(cache.name)&&cache.controller?.endsWith('/sw-m5.js')&&cache.urls.filter(x=>x.includes('/mountain-v8-')).length===9,{assets:cache.urls.length});
 const original=await page.evaluate(async()=>{
  const {mountainV8Storage}=await import('/src/manual-biomes/mountain-v8-isolated-storage.mjs');
  const store=mountainV8Storage(localStorage),key='mythwrought-v002-world-179';
  return [store.getItem(key),store.getItem(key+'-four-biomes-profile-v1'),store.getItem(key+'-four-biomes-profile-v1-journal'),store.getItem('mythwrought-v002-selected-seed')];
 });
 const cutoff=requests;offline=true;await ctx.setOffline(true);
 await page.reload({waitUntil:'load',timeout:90000});
 await page.waitForFunction(()=>window.__mythwroughtTest?.fourBiomeProfile()?.seed===179,null,{timeout:90000});
 const offlineState=await page.evaluate(async()=>{
  const {mountainV8Storage}=await import('/src/manual-biomes/mountain-v8-isolated-storage.mjs');
  const store=mountainV8Storage(localStorage),key='mythwrought-v002-world-179';
  const t=window.__mythwroughtTest;
  t.teleport(-473.5,5.5);t.aimAt(-470,15,5);
  return {offline:!navigator.onLine,profile:t.fourBiomeProfile()?.generator,tree:[13,14,15].map(y=>t.block(-470,y,5)),bytes:[store.getItem(key),store.getItem(key+'-four-biomes-profile-v1'),store.getItem(key+'-four-biomes-profile-v1-journal'),store.getItem('mythwrought-v002-selected-seed')]};
 });
 check('offline-exact-scoped-profile-and-crown',offlineState.offline&&offlineState.profile==='mythwrought-five-surface-regions-mountain-v8'&&offlineState.tree.every(id=>id===511)&&JSON.stringify(offlineState.bytes)===JSON.stringify(original),offlineState);
 await fullyStreamed('core-offline');
 check('zero-network-after-cutoff',requests===cutoff,{cutoff,requests,afterCutoff});
 check('no-browser-errors',errors.length===0,{errors});
 report.finished=true;await persist();
}catch(e){report.errors.push(String(e));await persist();throw e;}
finally{await ctx?.close();await browser?.close();await new Promise(r=>server.close(r));}
