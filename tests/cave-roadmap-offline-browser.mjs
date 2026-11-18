// Real Mythwrought original main.mjs cave service-worker offline test.
// Runs only in Chromium on the unmerged, user-authorized isolated staging PR.
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import {resolve,sep,extname} from 'node:path';
import {chromium} from 'playwright';
const head=process.env.CAVE_EXPECTED_HEAD||'';
assert.match(head,/^[0-9a-f]{40}$/);
assert.equal(execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),head);
const root=resolve('.'),mime={'.mjs':'text/javascript','.js':'text/javascript',
 '.html':'text/html','.css':'text/css','.json':'application/json',
 '.svg':'image/svg+xml','.webmanifest':'application/manifest+json'};
const server=createServer(async(req,res)=>{
 try{
  const target=new URL(req.url,'http://127.0.0.1'),name=target.pathname==='/'?'/index.html':target.pathname;
  const path=resolve(root,'.'+decodeURIComponent(name));
  if(!path.startsWith(root+sep)||!mime[extname(path)])throw Error('Disallowed');
  const raw=await readFile(path);
  res.writeHead(200,{'Content-Type':mime[extname(path)],'Cache-Control':'no-store'});
  res.end(raw);
 }catch{res.writeHead(404);res.end('Not found');}
});
let browser;
try{
 await new Promise((ok,fail)=>{server.once('error',fail);server.listen(0,'127.0.0.1',ok)});
 browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-gl=angle',
  '--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
 const ctx=await browser.newContext({viewport:{width:667,height:375},deviceScaleFactor:1,
  hasTouch:true,isMobile:true,serviceWorkers:'allow'});
 const page=await ctx.newPage(),failures=[];
 page.on('dialog',d=>d.accept());
 page.on('pageerror',e=>failures.push('JS: '+e.message));
 const seed=319731,origin='http://127.0.0.1:'+server.address().port;
 await page.goto(origin+'/',{waitUntil:'domcontentloaded',timeout:30000});
 await page.waitForFunction(()=>window.__mythwroughtTest &&
  Number(document.querySelector('#scene')?.dataset.loadedChunks)>=25,
   null,{timeout:90000});
 assert.equal(await page.evaluate(()=>navigator.serviceWorker.controller),null,
  'Ordinary default world unexpectedly auto-registered cave-only service worker');
 const before=await page.evaluate(()=>localStorage.getItem('mythwrought-v002-world-179'));
 await page.evaluate(()=>document.querySelector('#menu').click());
 await page.locator('#seedInput').fill(String(seed));
 await page.evaluate(()=>document.querySelector('#caveCreateWorld').click());
 await page.waitForFunction(()=>window.__mythwroughtTest.caveMode().enabled,
  null,{timeout:90000});
 assert.equal(await page.evaluate(()=>localStorage.getItem('mythwrought-v002-world-'+319731)),null);
 // Playwright polling does not guarantee that an async function's
 // Promise has resolved. Wait for the actual SERVICE WORKER COMPLETION
 // MESSAGE surfaced by the production UI; never accept a pending Promise
 // as proof that the app's files are cached.
 await page.waitForFunction(()=>document.getElementById('caveWorldStatus')?.
  textContent.includes('OFFLINE ASSETS VERIFIED'),null,{timeout:160000});
 const verified=await page.evaluate(async()=>{
  const r=await caches.match(new URL('./cave-offline-ready.json',location.href));
  if(!r)throw Error('Worker claimed success but cache-complete marker is absent');
  return r.json();
 });
 const indexedShell=await page.evaluate(async()=>Boolean(await caches.match(
  new URL('./index.html',location.href))));
 assert.equal(indexedShell,true,'Offline startup requires the saved real index.html shell');

 assert.ok(verified.count>=200,'A few cached files do NOT make a complete offline game');
 const sourceCached=await page.evaluate(async()=>Boolean(await caches.match(
   new URL('./src/manual-caves/cave-voxel-world.mjs',location.href))));
 assert.equal(sourceCached,true,'Cannot load cave voxel module without the network');
 await ctx.setOffline(true);
 await page.reload({waitUntil:'domcontentloaded',timeout:45000});
 await page.waitForFunction(()=>window.__mythwroughtTest &&
  Number(document.querySelector('#scene')?.dataset.loadedChunks)>=25,
  null,{timeout:90000});
 assert.equal(await page.evaluate(()=>window.__mythwroughtTest.caveMode().enabled),false,
  'Do not silently activate a cave save during an offline ordinary-world boot');
 await page.evaluate(()=>document.querySelector('#menu').click());
 await page.locator('#seedInput').fill(String(seed));
 await page.evaluate(()=>document.querySelector('#caveLoadWorld').click());
 await page.waitForFunction(()=>window.__mythwroughtTest.caveMode().enabled,
  null,{timeout:90000});
 // Explicit world selection clears GPU chunks before source-authored cave
 // meshes can stream in. Require authentic completed rendering, not a stale
 // frame from the previously loaded ordinary world or a timing assumption.
 await page.waitForFunction(()=>{
  const scene=document.querySelector('#scene'),state=scene?.dataset;
  return window.__mythwroughtTest?.caveMode().enabled&&
    !!scene.getContext('webgl2')&&Number(state.loadedChunks)>=25&&
    Number(state.renderedMeshVertices)>1000&&Number(state.pendingChunks)===0;
 },null,{timeout:90000});
 const actual=await page.evaluate(()=>({
  saveIsolation:window.__mythwroughtTest.caveMode().saveIsolation,
  cave:window.__mythwroughtTest.caveMode().sourceCounts,
  gl:!!document.querySelector('#scene').getContext('webgl2'),
  chunks:Number(document.querySelector('#scene').dataset.loadedChunks),
  profile:localStorage.getItem('mythwrought-caves-v1-seed-'+319731),
  legacy:localStorage.getItem('mythwrought-v002-world-'+319731)
 }));
 assert.ok(actual.gl&&actual.chunks>=25);
 assert.equal(actual.saveIsolation,true);
 assert.equal(actual.cave.vaultBridgeConnected,true);
 assert.equal(actual.cave.eastGalleryConnected,true);
 assert.ok(actual.profile);
 assert.equal(actual.legacy,null,'Offline cave mode wrote ordinary canonical save');
 assert.equal(await page.evaluate(()=>localStorage.getItem('mythwrought-v002-world-179')),
  before,'Offline cave load overwrote the ordinary saved world');
 assert.deepEqual(failures,[],'Offline browser errors');
 await ctx.setOffline(false);
 await ctx.close();
 console.log('PASS ACTUAL MYTHWROUGHT CAVE GAME OFFLINE',head,verified.count,
  'cached original game + real WebGL2 + explicit cave load + old schema1 unchanged');
}catch(error){
 console.error('CAVE_OFFLINE_ACTUAL_GAME_BLOCKED',String(error.stack||error));
 process.exitCode=1;
}finally{if(browser)await browser.close();await new Promise(done=>server.close(done));}
