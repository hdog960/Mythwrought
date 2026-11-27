// Serve the current candidate and the exact preceding app in one installation.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {chromium} from 'playwright';
import {GAME_RELEASE} from '../src/app-update.mjs';
import {VEILREACH_GENERATOR,M8_MOUNTAIN_GENERATOR} from '../src/environment-ground.mjs';

assert.ok(process.env.VEILREACH_PREVIOUS_ROOT,'Exact previous app checkout is required');
const prior=resolve(process.env.VEILREACH_PREVIOUS_ROOT);
const candidate=process.cwd();
const marker=html=>html.match(/data-mw-release="([^"]+)"/)?.[1];
const priorRelease=marker(await readFile(resolve(prior,'index.html'),'utf8'));
assert.ok(priorRelease&&priorRelease!==GAME_RELEASE);
const mime={'.html':'text/html','.mjs':'text/javascript','.js':'text/javascript',
  '.css':'text/css','.json':'application/json','.webmanifest':'application/manifest+json',
  '.svg':'image/svg+xml','.png':'image/png'};
let source=prior;
const server=createServer(async(req,res)=>{
  try{
    const path=new URL(req.url,'http://localhost').pathname;
    const file=resolve(source,path==='/'?'index.html':'.'+decodeURIComponent(path));
    if(!file.startsWith(source+sep))return res.writeHead(404).end();
    const bytes=await readFile(file);
    res.writeHead(200,{'Content-Type':mime[extname(file)]??'application/octet-stream',
      'Cache-Control':'no-store'}).end(bytes);
  }catch{res.writeHead(404).end();}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({args:['--enable-webgl','--use-gl=angle',
  '--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
const context=await browser.newContext({viewport:{width:956,height:440},isMobile:true,hasTouch:true});
const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('dialog',dialog=>dialog.accept());
const state=()=>page.evaluate(()=>window.__mythwroughtTest.fourBiomeProfile());
const settle=()=>page.waitForFunction(()=>
  Number(document.querySelector('#scene')?.dataset.loadedChunks)>=18,undefined,{timeout:120000});
const reload=async()=>{
  const response=await page.reload({waitUntil:'domcontentloaded'});
  assert.ok(response.fromServiceWorker());
  await settle();
};
const cacheInventory=release=>page.evaluate(async release=>{
  const name='mythwrought-m5-shell-'+release;
  if(!await caches.has(name))return [];
  return (await (await caches.open(name)).keys()).map(r=>new URL(r.url).pathname).sort();
},release);
const oldSave=()=>page.evaluate(async()=>{
  const {mountainV8Storage}=await import('/src/manual-biomes/mountain-v8-isolated-storage.mjs');
  const storage=mountainV8Storage(localStorage),slot='mythwrought-v002-world-2026';
  return [storage.getItem(slot),storage.getItem(slot+'-four-biomes-profile-v1')];
});
try{
  await page.addInitScript(()=>{
    const original=crypto.getRandomValues.bind(crypto);
    globalThis.__releaseFixtureSeed=2026;
    crypto.getRandomValues=a=>{
      if(a instanceof Int32Array&&a.length===1){
        a[0]=globalThis.__releaseFixtureSeed;
        return a;
      }
      return original(a);
    };
  });
  await page.goto(origin+'/?production-ui=1',{waitUntil:'domcontentloaded'});
  await settle();
  assert.equal((await state()).generator,M8_MOUNTAIN_GENERATOR);
  assert.equal(await page.evaluate(()=>{
    const game=window.__mythwroughtTest;
    return game.editBiomeCell(450,-80,450,0)&&game.editBiomeCell(450,256,450,3);
  }),true);
  await page.locator('#menu').click();
  await page.locator('#advancedMenu > summary').click();
  await page.locator('#save').click();
  await page.locator('#closeHelp').click();
  const saved=await oldSave();
  assert.ok(saved.every(Boolean));
  assert.ok(JSON.parse(saved[0]).edits.some(row=>row.join(',')==='450,256,450,3'));
  await page.waitForFunction(()=>Boolean(navigator.serviceWorker.controller),undefined,{timeout:120000});
  const priorFiles=await cacheInventory(priorRelease);
  assert.ok(priorFiles.length>320);
  await reload();
  assert.equal(await page.locator('meta[data-mw-release]').getAttribute('data-mw-release'),priorRelease);
  console.log('Prior Home Screen shell ready',priorRelease,priorFiles.length);

  // A normal launch boots the old shell first. The game's startup check
  // requests an update, then the next launch uses the activated worker.
  source=candidate;
  await page.reload({waitUntil:'domcontentloaded'});
  // A new script byte starts the install while this launch can still render
  // the previous shell. Wait for the candidate cache, then cold-open it.
  const manifest=JSON.parse(await readFile('nonblock-stage-assets.json','utf8'));
  const entries=Object.entries(manifest.assets).filter(([name])=>
    !['./src/nonblock/stage-offline.mjs','./sw-nonblock-stage.js'].includes(name));
  const deadline=Date.now()+120000;
  let verified=0;
  while(Date.now()<deadline){
    const inventory=await cacheInventory(GAME_RELEASE);
    const workerReady=await page.evaluate(async()=>{
      const r=await navigator.serviceWorker.getRegistration();
      return Boolean(navigator.serviceWorker.controller&&r?.active&&!r.installing&&!r.waiting);
    });
    if(inventory.length===entries.length&&workerReady){
      verified=await page.evaluate(async({release,entries})=>{
        const cache=await caches.open('mythwrought-m5-shell-'+release);
        for(const [name,digest] of entries){
          const hit=await cache.match(new URL(name,location.href));
          if(!hit)throw Error('Missing cached '+name);
          const bytes=await crypto.subtle.digest('SHA-256',await hit.arrayBuffer());
          const hex=Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('');
          if(hex!==digest)throw Error('Cached asset mismatch '+name);
        }
        return entries.length;
      },{release:GAME_RELEASE,entries});
      break;
    }
    await page.waitForTimeout(450);
  }
  assert.equal(verified,entries.length);
  assert.deepEqual(await cacheInventory(priorRelease),priorFiles);
  await context.setOffline(true);
  await reload();
  assert.equal(await page.locator('meta[data-mw-release]').getAttribute('data-mw-release'),GAME_RELEASE);
  assert.deepEqual(await oldSave(),saved);
  assert.equal((await state()).generator,M8_MOUNTAIN_GENERATOR);
  console.log('Upgraded same installation and preserved historical edit bytes offline',verified);

  await context.setOffline(false);
  await page.evaluate(()=>{globalThis.__releaseFixtureSeed=180;});
  await page.locator('#menu').click();
  await page.locator('#newWorld').click();
  await page.waitForFunction(g=>window.__mythwroughtTest?.fourBiomeProfile()?.generator===g,
    VEILREACH_GENERATOR,{timeout:120000});
  await settle();
  assert.equal((await state()).seed,180);
  const visible=await page.evaluate(()=>{
    const d=document.querySelector('#scene').dataset;
    return [+d.veilreachDistanceVertices,+d.upperMeshVertices];
  });
  assert.ok(visible[0]>0&&visible[1]===0);
  assert.deepEqual(await oldSave(),saved);
  await context.setOffline(true);
  await reload();
  assert.equal((await state()).generator,VEILREACH_GENERATOR);
  assert.deepEqual(await oldSave(),saved);
  assert.deepEqual(errors,[]);
  console.log('PASS Veilreach from normal New World and offline Home Screen reload',visible);
}finally{
  await browser.close();
  await new Promise(r=>server.close(r));
}
