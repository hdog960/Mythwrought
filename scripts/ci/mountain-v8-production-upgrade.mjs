// Real old production -> new release on the SAME origin and Pages subpath.
// The previous source is checked out at its immutable production commit.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {chromium} from 'playwright';
const prior=path.resolve('prior-production'),current=process.cwd(),prefix='/Mythwrought/';
const oldRelease='20261124-compact-menu-v1',release='20261124-mountain-v8-v1',profile='mythwrought-five-surface-regions-mountain-v8';
const out=path.resolve('artifacts/mountain-v8-production');await mkdir(out,{recursive:true});
const evidence={oldRelease,release,physicalIphone:false,checks:[]};
function check(name,value,details={}){evidence.checks.push({name,ok:Boolean(value),...details});console.log('MOUNTAIN RELEASE',name,JSON.stringify({ok:Boolean(value),...details}));assert.ok(value,name);}
let deployment=prior,requests=0;
const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webmanifest':'application/manifest+json'};
const server=createServer(async(req,res)=>{requests++;try{
 const u=new URL(req.url,'http://127.0.0.1');if(!u.pathname.startsWith(prefix))throw Error('outside Pages scope');
 const f=decodeURIComponent(u.pathname.slice(prefix.length))||'index.html';
 const file=path.resolve(deployment,f);if(!file.startsWith(deployment+path.sep))throw Error('bad path');
 const bytes=await readFile(file);res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(bytes);
}catch(e){res.writeHead(404);res.end(String(e));}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin='http://127.0.0.1:'+server.address().port+prefix;
let browser,context;
try{
 browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--no-sandbox']});
 context=await browser.newContext({viewport:{width:956,height:440},deviceScaleFactor:1,hasTouch:true,isMobile:true,serviceWorkers:'allow'});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e)));
 const waitGame=()=>page.waitForFunction(()=>window.__mythwroughtTest&&Number(document.querySelector('#scene')?.dataset.loadedChunks)>0,null,{timeout:180000});
 const waitCache=marker=>page.waitForFunction(async({marker,prefix})=>{
  const key='mythwrought-m5-shell-'+marker;
  if(!(await caches.keys()).includes(key)||!navigator.serviceWorker.controller)return false;
  const c=await caches.open(key),html=await c.match(location.origin+prefix+'index.html');
  return Boolean(html)&&(await html.text()).includes('data-mw-release="'+marker+'"');
 },{marker,prefix},{timeout:180000});
 const state=()=>page.evaluate(async()=>{
  const t=window.__mythwroughtTest,k='mythwrought-v002-selected-seed',oldSeed=localStorage.getItem(k),p='mythwrought-mountain-v8-isolated-v1:',scopedSeed=localStorage.getItem(p+k);
  return {release:document.querySelector('meta[name="mythwrought-release"]').content,profile:t.fourBiomeProfile()?.generator??null,
   seed:t.snapshot().seed,oldSeed,oldRaw:localStorage.getItem('mythwrought-v002-world-'+oldSeed),
   scopedSeed,scopedRaw:localStorage.getItem(p+'mythwrought-v002-world-'+scopedSeed),active:localStorage.getItem('mythwrought-mountain-v8-active-v1'),
   chunks:t.snapshot().chunks.length,glError:document.querySelector('#scene').getContext('webgl2').getError()};
 });
 await page.goto(origin,{waitUntil:'load',timeout:90000});await waitGame();
 await page.locator('#menu').click();await page.locator('#advancedMenu > summary').click();await page.locator('#save').click();await page.locator('#closeHelp').click();
 await waitCache(oldRelease);
 const old=await state();check('old installed shell and save',old.release===oldRelease&&old.oldSeed&&old.oldRaw&&!old.active,old);
 // Existing worker and installed page remain on exactly the same origin.
 deployment=current;
 await page.evaluate(()=>{window.__mwChanged=false;navigator.serviceWorker.addEventListener('controllerchange',()=>{window.__mwChanged=true},{once:true});});
 await page.evaluate(async()=>{const r=await navigator.serviceWorker.getRegistration();if(!r)throw Error('Missing existing worker');await r.update();});
 await page.waitForFunction(()=>window.__mwChanged===true,null,{timeout:180000});await waitCache(release);
 await page.reload({waitUntil:'load',timeout:90000});await waitGame();
 const updated=await state();check('same install upgraded, historical bytes exact',updated.release===release&&updated.oldSeed===old.oldSeed&&updated.oldRaw===old.oldRaw&&updated.profile===old.profile&&!updated.active,updated);
 await page.locator('#menu').click();page.once('dialog',d=>d.dismiss());await page.locator('#newWorld').click();
 check('cancel preserves selected ordinary world',(await state()).oldRaw===old.oldRaw&&!(await state()).active);
 page.once('dialog',d=>d.accept());await page.locator('#newWorld').click();
 await page.waitForFunction(profile=>window.__mythwroughtTest?.fourBiomeProfile()?.generator===profile,profile,{timeout:180000});await waitGame();
 const fresh=await state();check('latest NEW WORLD creates isolated V8 without overwriting ordinary',fresh.profile===profile&&fresh.active==='1'&&fresh.scopedSeed===String(fresh.seed)&&fresh.scopedRaw&&fresh.oldRaw===old.oldRaw&&fresh.oldSeed===old.oldSeed&&fresh.glError===0,fresh);
 await page.screenshot({path:path.join(out,'new-world-956x440.png')});
 // Real dedicated edit plus explicit save, then exact offline reload.
 await page.evaluate(()=>{const t=window.__mythwroughtTest,p=t.m5ObservedPose();t.placeFixture(Math.floor(p.x),-100,Math.floor(p.z),503);});
 await page.locator('#menu').click();await page.locator('#advancedMenu > summary').click();await page.locator('#save').click();await page.locator('#closeHelp').click();
 const saved=await state();check('dedicated edit saved in isolated namespace',JSON.parse(saved.scopedRaw).edits.some(row=>row[3]===503)&&saved.oldRaw===old.oldRaw);
 const cutoff=requests;await context.setOffline(true);await page.reload({waitUntil:'load',timeout:90000});await waitGame();
 const cold=await state();check('cold offline same shortcut exact source and save',cold.release===release&&cold.profile===profile&&cold.seed===saved.seed&&cold.scopedRaw===saved.scopedRaw&&cold.oldRaw===old.oldRaw&&cold.glError===0&&requests===cutoff,cold);
 await page.screenshot({path:path.join(out,'offline-956x440.png')});
 check('zero page errors',errors.length===0,{errors});evidence.finished=true;
}finally{await writeFile(path.join(out,'manifest.json'),JSON.stringify(evidence,null,2));await context?.close();await browser?.close();await new Promise(r=>server.close(r));}
