// Genuine SW upgrade from an old cached REC-less game to the current full
// WebGL2 app: preserve original seed saves, same browser storage and offline.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,mkdir} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
import {chromium} from 'playwright';

const BASE_REC_LESS='474f6c2439865454f80b995af31120c024cdbc2d';
const BASE_CACHE_FIRST='edc6ceae728840bfc361cd8a6437e8a1fa674c42';
const OLD_CACHE='mythwrought-m5-shell-20261118-v5-recorder';
const NEW_CACHE='mythwrought-m5-shell-20261121-unified-environment-rc6';
const RELEASE='20261121-unified-environment-rc6';
const oldFiles={
 'index.html':execFileSync('git',['show',BASE_REC_LESS+':index.html'],{encoding:'utf8'}),
 'src/main.mjs':execFileSync('git',['show',BASE_REC_LESS+':src/main.mjs'],{encoding:'utf8'}),
 'sw-m5.js':execFileSync('git',['show',BASE_CACHE_FIRST+':sw-m5.js'],{encoding:'utf8'})
};
const root=process.cwd();
let deploy='old',requests=0,serverEpoch='a';
function mime(file){
 if(file.endsWith('.mjs')||file.endsWith('.js'))return 'text/javascript';
 if(file.endsWith('.css'))return 'text/css';
 if(file.endsWith('.json')||file.endsWith('.webmanifest'))return 'application/json';
 if(file.endsWith('.svg'))return 'image/svg+xml';
 if(file.endsWith('.html'))return 'text/html';
 return 'application/octet-stream';
}
const server=createServer(async(req,res)=>{
 const url=new URL(req.url||'/', 'http://127.0.0.1:4173');
 const relative=url.pathname==='/'?'index.html':decodeURIComponent(url.pathname.slice(1));
 if(relative.includes('..')){res.writeHead(403);res.end();return;}
 ++requests;
 try{
   const fromOld=deploy==='old'&&Object.prototype.hasOwnProperty.call(oldFiles,relative);
   const content=fromOld?oldFiles[relative]:await readFile(path.resolve(root,relative));
   res.writeHead(200,{'Content-Type':mime(relative),'Cache-Control':'no-store',
     'X-MW-Origin-Build':fromOld?'old':'new',
     'X-MW-Server-Epoch':serverEpoch});
   res.end(content);
 }catch(err){res.writeHead(404,{'Content-Type':'text/plain'});res.end(String(err));}
});
await new Promise(resolve=>server.listen(4173,'127.0.0.1',resolve));
const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader',
  '--enable-unsafe-swiftshader'
]});
const context=await browser.newContext({viewport:{width:932,height:430},
  deviceScaleFactor:1,isMobile:true,hasTouch:true,serviceWorkers:'allow'});
const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(e.message));
context.on('serviceworker',worker=>{
  worker.on('console',message=>{
    if(message.type()==='error')
      console.error('HOME SCREEN SERVICE WORKER ERROR',message.text());
  });
});
// Playwright waitForFunction can consider a returned Promise truthy before
// its asynchronous predicate settles. Poll through page.evaluate instead.
async function waitForAsyncCondition(page, predicate, argument, {timeout=30000}={}){
  const deadline=Date.now()+timeout;
  while(Date.now()<deadline){
    if(await page.evaluate(predicate,argument))return;
    await page.waitForTimeout(250);
  }
  const diagnostic=await page.evaluate(async()=>{
    const registration=await navigator.serviceWorker.getRegistration();
    const names=await caches.keys();
    const shellCaches=await Promise.all(names.filter(name=>
      name.startsWith('mythwrought-m5-shell-')).map(async name=>({
        name,assets:(await (await caches.open(name)).keys()).length
      })));
    return {controller:navigator.serviceWorker.controller?.scriptURL,
      active:registration?.active?.state,installing:registration?.installing?.state,
      waiting:registration?.waiting?.state,shellCaches};
  });
  throw Error('Verified asynchronous worker/cache condition timed out after '+
    timeout+'ms '+JSON.stringify(diagnostic));
}

const target='http://127.0.0.1:4173/';
const caches=()=>page.evaluate(async()=>await caches.keys());
try{
  await page.goto(target,{waitUntil:'networkidle',timeout:45000});
  await page.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.loadedChunks)===25,
    null,{timeout:45000});
  assert.equal(await page.locator('#captureToggle').count(),0,'Expected genuine REC-less historical shell');
  await page.evaluate(()=>localStorage.setItem('mythwrought-v002-selected-seed','11111222'));
  await page.reload({waitUntil:'networkidle'});
  await page.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.loadedChunks)===25,
    null,{timeout:45000});
  await page.locator('#menu').click();
  await page.locator('#save').click();
  await page.locator('#closeHelp').click();
  const saved=await page.evaluate(()=>localStorage.getItem('mythwrought-v002-world-11111222'));
  assert.ok(saved?.includes('"schema":1'),'Real original seed 11111222 did not save');
  await page.evaluate(()=>navigator.serviceWorker.register('./sw-m5.js',{
    scope:'/',updateViaCache:'none'
  }));
  await waitForAsyncCondition(page,async()=>{
    const keys=await caches.keys();
    return keys.includes('mythwrought-m5-shell-20261118-v5-recorder');
  },null,{timeout:100000});
  await page.waitForFunction(()=>Boolean(navigator.serviceWorker.controller),
    null,{timeout:45000});
  await page.reload({waitUntil:'networkidle'});
  assert.equal(await page.locator('#captureToggle').count(),0,
    'Historical cache-first worker should keep serving REC-less HTML');
  assert.equal(await page.evaluate(()=>localStorage.getItem('mythwrought-v002-world-11111222')),saved);
  const prior=await caches();
  assert.ok(prior.includes(OLD_CACHE),'Historical shell did not install');
  console.log('PASS OLD CACHE-FIRST APP NO REC',prior,'requests',requests);

  // Server publishes the exact proposed new files, not a mock screenshot.
  // A query request must bypass the OLD worker and return the NEW origin
  // before the new worker is permitted to install.
  deploy='new';
  const live=await page.evaluate(async release=>{
    const url=new URL('/index.html',location.href);
    url.searchParams.set('mw-cache-install',release);
    const response=await fetch(url.href,{cache:'no-store'});
    return {ok:response.ok,html:await response.text(),
      epoch:response.headers.get('X-MW-Server-Epoch'),
      origin:response.headers.get('X-MW-Origin-Build')};
  },NEW_CACHE);
  assert.equal(live.origin,'new','Versioned origin lookup still served the old app');
  assert.ok(live.html.includes('id="captureToggle"')&&
    live.html.includes('data-mw-release="'+RELEASE+'"'),
    'The live origin is not the current REC-capable version');
  // The old worker already has an active registration. A populated new
  // cache alone does not prove its worker took control of this installed app.
  await page.evaluate(()=>{
    window.__mwControllerChanged=false;
    navigator.serviceWorker.addEventListener('controllerchange',()=>{
      window.__mwControllerChanged=true;
    },{once:true});
  });
  await page.evaluate(async()=>{
    const reg=await navigator.serviceWorker.getRegistration('/');
    if(!reg)throw Error('Previous registration missing');
    await reg.update();
  });
  // The cache name is created BEFORE the 212 real file fetches complete.
  // A failed or in-flight installation must never count as an upgraded app.
  await waitForAsyncCondition(page,async({cacheName,release})=>{
    const names=await caches.keys();
    if(!window.__mwControllerChanged)return false;
    if(!names.includes(cacheName))return false;
    const cache=await caches.open(cacheName);
    const files=await cache.keys();
    if(files.length<200)return false;
    const index=new URL('/index.html',location.href).href;
    const response=await cache.match(index);
    if(!response||response.headers.get('X-MW-Origin-Build')!=='new')
      return false;
    const html=await response.text();
    return html.includes('data-mw-release="'+release+'"')&&
      html.includes('id="captureToggle"')&&
      Boolean((await navigator.serviceWorker.getRegistration('/'))?.active);
  },{cacheName:NEW_CACHE,release:RELEASE},{timeout:180000});
  const installed=await page.evaluate(async()=>{
    const cache=await caches.open('mythwrought-m5-shell-20261121-unified-environment-rc6');
    const index=new URL('/index.html',location.href).href;
    const response=await cache.match(index);
    const rootResponse=await cache.match(new URL('/',location.href).href);
    const keys=await cache.keys();
    const current=await navigator.serviceWorker.getRegistration('/');
    return {origin:response?.headers.get('X-MW-Origin-Build'),
      html:response?await response.text():null,
      rootOrigin:rootResponse?.headers.get('X-MW-Origin-Build'),
      cachedKeyCount:keys.length,
      sampleKeys:keys.slice(0,8).map(x=>x.url),
      indexFound:keys.some(x=>x.url===index),
      registration:{active:current?.active?.scriptURL,
        state:current?.active?.state,
        waiting:current?.waiting?.scriptURL},
      cacheNames:await caches.keys(),
      oldCacheAssetCount:(await (await caches.open('mythwrought-m5-shell-20261118-v5-recorder')).keys()).length};
  });
  if(installed.origin!=='new')console.error('HOME SCREEN CACHE DIAGNOSTIC',JSON.stringify(installed));
  assert.equal(installed.origin,'new',
    'The worker installation copied an old cached index instead of fresh origin source');
  assert.ok(installed.cacheNames.includes(OLD_CACHE)&&
    installed.oldCacheAssetCount>=190,
    'The original previous-good offline Home Screen cache was destroyed');
  assert.ok(installed.html.includes('id="captureToggle"')&&
    installed.html.includes('data-mw-release="'+RELEASE+'"'),
    'Verified offline shell is missing the actual REC release');
  // A normal boot MUST use only the new, atomically verified cache.
  // It was installed at epoch a and must now expose REC, not old HTML.
  serverEpoch='b';
  const refreshed=await page.reload({waitUntil:'networkidle',timeout:45000});
  assert.equal(refreshed.headers()['x-mw-server-epoch'],'a',
    'Ordinary boot fetched over network instead of using the verified shell');
  assert.equal(refreshed.headers()['x-mw-origin-build'],'new',
    'The upgraded cache did not contain current game HTML');
  await page.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.loadedChunks)===25,
    null,{timeout:45000});
  assert.equal(await page.locator('#captureToggle').count(),1,'REC did not appear after same-app worker update');
  assert.equal(await page.locator('#checkGameUpdate').count(),1,'Safe update action missing');
  assert.equal(await page.evaluate(()=>localStorage.getItem('mythwrought-v002-world-11111222')),saved,
    'Canonical world changed during service worker update');
  await mkdir('artifacts/pwa-safe-refresh',{recursive:true});
  await page.screenshot({path:'artifacts/pwa-safe-refresh/updated-game-932x430.png'});
  console.log('PASS ONLINE UPGRADE REC VISIBLE',await caches(),'saved seed 11111222 intact');

  await page.locator('#menu').click();
  const [onlineRefresh]=await Promise.all([
    page.waitForNavigation({waitUntil:'networkidle',timeout:45000}),
    page.locator('#checkGameUpdate').click()
  ]);
  assert.equal(onlineRefresh?.headers()['x-mw-server-epoch'],'b',
    'Explicit in-game update did not fetch a fresh document online');
  assert.equal(new URL(page.url()).searchParams.get('mw-refresh'),RELEASE);
  assert.equal(await page.locator('#captureToggle').count(),1);
  assert.equal(await page.evaluate(()=>localStorage.getItem('mythwrought-v002-world-11111222')),saved);
  console.log('PASS IN-APP UPDATE BUTTON SAME INSTALL',page.url());

  // The manifest start URL is the clean root; verify a clean root boot before
  // the STRICT no-network offline test (not a query left from an update).
  await page.goto(target,{waitUntil:'networkidle',timeout:45000});
  assert.equal(await page.locator('#captureToggle').count(),1);
  const beforeOfflineRequests=requests;
  await context.setOffline(true);
  await page.reload({waitUntil:'load',timeout:45000});
  await page.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.loadedChunks)>0,
    null,{timeout:45000});
  assert.equal(await page.locator('#captureToggle').count(),1);
  assert.equal(await page.evaluate(()=>localStorage.getItem('mythwrought-v002-world-11111222')),saved);
  const gl=await page.evaluate(()=>{
    const c=document.querySelector('#scene');const g=c.getContext('webgl2');
    return {gl:!!g,error:g?.getError(),w:c.width,h:c.height};
  });
  assert.ok(gl.gl&&gl.w>200&&gl.h>100&&!gl.error,'Offline WebGL2 broken');
  await page.screenshot({path:'artifacts/pwa-safe-refresh/offline-game-932x430.png'});
  assert.equal(requests,beforeOfflineRequests,
    'Offline Home Screen boot must make ZERO actual network requests');
  assert.deepEqual(errors,[],'Browser generated errors during same-app recovery');
  console.log('PASS OFFLINE AFTER SAME-APP RECOVERY',gl,'no network, no world save changes');
}finally{
  await browser.close();
  await new Promise(resolve=>server.close(resolve));
}
