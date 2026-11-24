// Exact prior production -> compact menu, same installed worker and save.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,mkdir} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
import {chromium} from 'playwright';
import {ENCHANTED_P2_GENERATOR} from '../src/manual-biomes/profile-world.mjs';
const base='6aa44c880c36d1b7c3ec489267d56edaf7cb4f72';
const oldRelease='20261124-enchanted-p2-v1',release='20261124-compact-menu-v1';
const oldCache='mythwrought-m5-shell-'+oldRelease,newCache='mythwrought-m5-shell-'+release;
const oldFiles=new Map(['index.html','styles.css','src/main.mjs','src/app-update.mjs','sw-m5.js'].map(p=>[p,execFileSync('git',['show',base+':'+p])]));
let deploy='old',requests=0;
const server=createServer(async(req,res)=>{
 const url=new URL(req.url,'http://127.0.0.1:4173');
 const file=url.pathname==='/'?'index.html':decodeURIComponent(url.pathname.slice(1));
 if(file.includes('..')){res.writeHead(403);res.end();return;}
 requests++;
 try{
  const content=deploy==='old'&&oldFiles.has(file)?oldFiles.get(file):await readFile(path.resolve(file));
  const type=file.endsWith('.mjs')||file.endsWith('.js')?'text/javascript':
    file.endsWith('.css')?'text/css':file.endsWith('.html')?'text/html':
    file.endsWith('.svg')?'image/svg+xml':file.endsWith('.json')||file.endsWith('.webmanifest')?'application/json':'application/octet-stream';
  res.writeHead(200,{'Content-Type':type,'Cache-Control':'no-store','X-MW-Build':deploy});res.end(content);
 }catch(e){res.writeHead(404);res.end(String(e));}
});
await new Promise(resolve=>server.listen(4173,'127.0.0.1',resolve));
const browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:956,height:440},deviceScaleFactor:1,hasTouch:true,isMobile:true,serviceWorkers:'allow'});
const page=await context.newPage(),errors=[];
page.on('pageerror',error=>errors.push(error.message));
const root='http://127.0.0.1:4173/';
async function wait(predicate,arg,timeout=180000){
 const end=Date.now()+timeout;
 while(Date.now()<end){if(await page.evaluate(predicate,arg))return;await page.waitForTimeout(250);}
 throw Error('Timed out awaiting verified same-install state');
}
async function cacheReady(name,marker){
 await wait(async({name,marker})=>{
  if(!(await caches.keys()).includes(name))return false;
  const cache=await caches.open(name),keys=await cache.keys();
  const html=await cache.match(new URL('index.html',location.href).href);
  return keys.length>=308&&Boolean(html)&& (await html.text()).includes('data-mw-release="'+marker+'"')&&Boolean(navigator.serviceWorker.controller);
 },{name,marker});
}
try{
 await page.goto(root,{waitUntil:'networkidle',timeout:60000});
 await page.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.loadedChunks)>0,null,{timeout:60000});
 assert.equal(await page.locator('meta[name="mythwrought-release"]').getAttribute('content'),oldRelease);
 await page.locator('#menu').click();
 await page.locator('#save').click();
 await page.locator('#closeHelp').click();
 const saved=await page.evaluate(()=>{
  const seed=localStorage.getItem('mythwrought-v002-selected-seed');
  return {seed,raw:localStorage.getItem('mythwrought-v002-world-'+seed)};
 });
 assert.ok(saved.seed&&saved.raw?.includes('"schema":1'));
 await page.evaluate(()=>navigator.serviceWorker.register('./sw-m5.js',{scope:'/',updateViaCache:'none'}));
 await cacheReady(oldCache,oldRelease);
 await page.reload({waitUntil:'networkidle',timeout:60000});
 assert.equal(await page.locator('#newWorld').count(),0);
 deploy='new';
 await page.evaluate(()=>{window.__menuWorkerChanged=false;navigator.serviceWorker.addEventListener('controllerchange',()=>{window.__menuWorkerChanged=true},{once:true});});
 await page.evaluate(async()=>{const r=await navigator.serviceWorker.getRegistration('/');if(!r)throw Error('Missing old same-scope worker');await r.update();});
 await wait(()=>window.__menuWorkerChanged===true,null);
 await cacheReady(newCache,release);
 const counts=await page.evaluate(async({oldCache,newCache})=>({old:(await (await caches.open(oldCache)).keys()).length,new:(await (await caches.open(newCache)).keys()).length}),{oldCache,newCache});
 assert.equal(counts.new,counts.old,'Menu release must preserve the exact cached URL inventory');
 await page.reload({waitUntil:'networkidle',timeout:60000});
 await page.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.loadedChunks)>0,null,{timeout:60000});
 assert.equal(await page.locator('meta[name="mythwrought-release"]').getAttribute('content'),release);
 assert.equal(await page.evaluate(seed=>localStorage.getItem('mythwrought-v002-world-'+seed),saved.seed),saved.raw);
 await page.locator('#g2bFlightEnable').check();
 assert.ok(await page.locator('#g2bFlightEnable').isChecked());
 await page.locator('#menu').click();
 const layout=await page.evaluate(()=>{
  const el=document.querySelector('.compact-menu'),b=el.getBoundingClientRect();
  return {height:el.clientHeight,scroll:el.scrollHeight,advanced:document.querySelector('#advancedMenu').open,
    buttons:['#closeHelp','#skySetDay','#skySetNight','#newWorld','#seedInput','#switchWorld','#advancedMenu > summary'].map(q=>{
      const a=document.querySelector(q).getBoundingClientRect();return a.height>0&&a.top>=b.top-1&&a.bottom<=b.bottom+1;
    })};
 });
 assert.equal(layout.advanced,false);assert.ok(layout.scroll<=layout.height+1&&layout.buttons.every(Boolean),JSON.stringify(layout));
 assert.equal(await page.locator('#runAudit').isVisible(),false);
 assert.equal(await page.locator('#createBalancedV6World').isVisible(),false);
 assert.equal(await page.locator('#g2bFlightProfile').count(),0);
 await mkdir('artifacts/compact-menu',{recursive:true});
 await page.screenshot({path:'artifacts/compact-menu/installed-956x440.png'});
 await page.locator('#advancedMenu > summary').click();
 assert.ok(await page.locator('#checkGameUpdate').isVisible());
 assert.ok(await page.locator('#vaultBackup').isVisible());
 await page.locator('#closeHelp').click();
 await page.locator('#menu').click();
 assert.equal(await page.locator('#advancedMenu').evaluate(e=>e.open),false);
 page.once('dialog',d=>d.dismiss());
 await page.locator('#newWorld').click();
 assert.equal(await page.evaluate(()=>localStorage.getItem('mythwrought-v002-selected-seed')),saved.seed);
 page.once('dialog',d=>d.accept());
 await page.locator('#newWorld').click();
 await page.waitForFunction(seed=>localStorage.getItem('mythwrought-v002-selected-seed')!==seed,saved.seed,{timeout:60000});
 const fresh=await page.evaluate(()=>{
  const seed=localStorage.getItem('mythwrought-v002-selected-seed');
  const profile=JSON.parse(localStorage.getItem('mythwrought-v002-world-'+seed+'-four-biomes-profile-v1'));
  return {seed,generator:JSON.parse(profile.raw).generator};
 });
 assert.equal(fresh.generator,ENCHANTED_P2_GENERATOR);
 assert.equal(await page.evaluate(seed=>localStorage.getItem('mythwrought-v002-world-'+seed),saved.seed),saved.raw);
 await page.locator('#closeHelp').click();
 const beforeOffline=requests;
 await context.setOffline(true);
 await page.reload({waitUntil:'load',timeout:60000});
 await page.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.loadedChunks)>0,null,{timeout:60000});
 assert.equal(await page.locator('meta[name="mythwrought-release"]').getAttribute('content'),release);
 assert.equal(await page.evaluate(()=>localStorage.getItem('mythwrought-v002-selected-seed')),fresh.seed);
 await page.locator('#menu').click();
 assert.ok(await page.locator('#newWorld').isVisible());
 assert.equal(await page.locator('#advancedMenu').evaluate(e=>e.open),false);
 assert.equal(requests,beforeOffline,'Offline boot contacted origin');
 await page.screenshot({path:'artifacts/compact-menu/offline-956x440.png'});
 assert.deepEqual(errors,[]);
 console.log('COMPACT MENU ACCEPTANCE '+JSON.stringify({base,release,layout,counts,sameInstall:true,oldSavePreserved:true,latest:fresh,offline:true,errors}));
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
