// One real game browser path: explicit LOCAL candidate UI, genuine WebGL2,
// atomic service worker shell, cold offline reopen and actual save. No teleport.
import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=process.cwd(),out=path.join(root,'artifacts/mountain-v8-offline');
await mkdir(out,{recursive:true});
const release='20261124-mountain-v8-candidate-04',seed=20811;
const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webmanifest':'application/manifest+json'};
let requests=0,offline=false;
const afterCutoff=[];
const server=createServer(async(req,res)=>{
 requests++;if(offline)afterCutoff.push(req.url);
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
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
 page.on('dialog',d=>d.accept());
 await page.addInitScript(()=>{if(localStorage.getItem('mythwrought-v002-selected-seed')===null)localStorage.setItem('mythwrought-v002-selected-seed','7');});
 await page.goto(origin+'/index.html',{waitUntil:'load',timeout:90000});
 await page.waitForFunction(()=>Boolean(window.__mythwroughtTest),null,{timeout:90000});
 await page.locator('#menu').click();
 await page.locator('#seedInput').fill(String(seed));
 await page.locator('#createMountainV8Candidate').click();
 await page.waitForFunction(()=>window.__mythwroughtTest.fourBiomeProfile()?.generator==='mythwrought-five-surface-regions-mountain-v8',null,{timeout:60000});
 await page.locator('#closeHelp').click();
 const initial=await page.evaluate(seed=>{
  const key='mythwrought-v002-world-'+seed,p=key+'-four-biomes-profile-v1';
  return {world:localStorage.getItem(key),profile:localStorage.getItem(p),journal:localStorage.getItem(p+'-journal'),selected:localStorage.getItem('mythwrought-v002-selected-seed'),legacy:localStorage.getItem('mythwrought-v002-world-7')};
 },seed);
 check('explicit-local-ui-new-world',initial.world&&initial.profile&&initial.journal&&initial.legacy&&initial.selected===String(seed)&&JSON.parse(initial.world).schema===1);
 await page.waitForFunction(()=>Boolean(navigator.serviceWorker.controller),null,{timeout:180000});
 const cache=await page.evaluate(async release=>{
  const name='mythwrought-m5-shell-'+release,keys=await caches.keys();
  const c=keys.includes(name)?await caches.open(name):null;
  const urls=c?(await c.keys()).map(r=>r.url):[];
  return {name,keys,urls,controller:navigator.serviceWorker.controller?.scriptURL};
 },release);
 check('actual-atomic-shell-install',cache.keys.includes(cache.name)&&cache.controller?.endsWith('/sw-m5.js')&&cache.urls.filter(x=>x.includes('/mountain-v8-')).length===7,{assets:cache.urls.length});
 async function capture(kind){
  await page.waitForFunction(()=>window.__mythwroughtTest?.snapshot().chunks.length>0,null,{timeout:90000});
  const state=await page.evaluate(()=>{
   const gl=document.querySelector('#scene').getContext('webgl2'),snap=window.__mythwroughtTest.snapshot();
   return {webgl:!!gl,lost:gl?.isContextLost(),glError:gl?.getError(),shaderReady:snap.graphics.shaderReady,chunks:snap.chunks.length,retry:snap.gpuRetry?.failures||0,profile:window.__mythwroughtTest.fourBiomeProfile()?.generator,seed:snap.seed};
  });
  check('webgl2-'+kind,state.webgl&&!state.lost&&state.glError===0&&state.shaderReady&&state.chunks>0&&state.retry===0&&state.seed===seed&&state.profile==='mythwrought-five-surface-regions-mountain-v8',state);
  const file=kind+'.png',png=await page.screenshot({path:path.join(out,file),timeout:90000});
  report.screens.push({file,bytes:png.length,sha256:createHash('sha256').update(png).digest('hex')});
  await persist();
 }
 await capture('online');
 // Real browser API writes by a stale candidate-build legacy world must
 // fail before touching canonical or Pack2 storage.
 const stale=await page.evaluate(async seed=>{
  const {VoxelWorld}=await import('/src/voxel.mjs'),{Pack2LiveWorld,savePack2LiveWorld}=await import('/src/pack2-world.mjs'),{saveWorldSafe}=await import('/src/persistence.mjs');
  const before=JSON.stringify(Object.entries(localStorage).sort());
  const old=new VoxelWorld(seed);
  const a=saveWorldSafe(localStorage,old),b=savePack2LiveWorld(localStorage,new Pack2LiveWorld(old));
  return {canonicalRefused:!a.ok,pack2Refused:!b.ok,unchanged:before===JSON.stringify(Object.entries(localStorage).sort())};
 },seed);
 check('same-build-stale-legacy-writer-refusal',stale.canonicalRefused&&stale.pack2Refused&&stale.unchanged,stale);
 const cutoff=requests;offline=true;await ctx.setOffline(true);
 await page.reload({waitUntil:'load',timeout:90000});
 await page.waitForFunction(()=>Boolean(window.__mythwroughtTest),null,{timeout:90000});
 const state=await page.evaluate(async()=>{
  const res=await fetch('./src/manual-biomes/mountain-v8-runtime-conifers.mjs');
  return {offline:!navigator.onLine,controller:!!navigator.serviceWorker.controller,sourceCached:res.ok};
 });
 check('offline-real-source-reopen',state.offline&&state.controller&&state.sourceCached,state);
 await capture('offline');
 await page.locator('#menu').click();await page.locator('#save').click();await page.locator('#closeHelp').click();
 const final=await page.evaluate(seed=>{
  const key='mythwrought-v002-world-'+seed,p=key+'-four-biomes-profile-v1';
  return {world:localStorage.getItem(key),profile:localStorage.getItem(p),journal:localStorage.getItem(p+'-journal'),selected:localStorage.getItem('mythwrought-v002-selected-seed'),legacy:localStorage.getItem('mythwrought-v002-world-7')};
 },seed);
 check('offline-original-profile-and-schema-preserved',JSON.stringify(final)===JSON.stringify(initial));
 check('zero-network-after-cutoff',requests===cutoff,{cutoff,requests,afterCutoff});
 check('no-browser-errors',errors.length===0,{errors});
 report.finished=true;await persist();
}catch(e){report.errors.push(String(e));report.afterCutoff=afterCutoff;await persist();throw e;}
finally{await ctx?.close();await browser?.close();await new Promise(r=>server.close(r));}
