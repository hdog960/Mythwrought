// Genuine current-production Living Ecosystem -> Unified Creative/Navigation/Performance same-origin
// service-worker upgrade and rollback. Uses actual old checkout, new checkout,
// original isolated save API and original live-game Mob acceptance fixture.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,sep,extname} from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {chromium} from 'playwright';
import {buildStageCacheManifest} from '../scripts/ci/build-stage-cache-manifest.mjs';
const oldRoot=resolve(process.env.UNIFIED_PREVIOUS_ROOT??'');
const root=resolve('.');
const oldHead='8400d13a6f5521901cbf0909a0c4f6e2e79c1629';
assert.equal(execFileSync('git',['-C',oldRoot,'rev-parse','HEAD'],{encoding:'utf8'}).trim(),oldHead);
assert.notEqual(oldRoot,root);
const release='20261128-unified-veilreach-v2',prior='20261128-veilreach-launch-v2';
const oldCache='mythwrought-m5-shell-'+prior,newCache='mythwrought-m5-shell-'+release;
const out=resolve('artifacts/unified-history-upgrade');
const publicAssets=m=>Object.entries(m.assets).filter(([p])=>!['./src/nonblock/stage-offline.mjs','./sw-nonblock-stage.js'].includes(p));
const oldManifest=JSON.parse(await readFile(resolve(oldRoot,'nonblock-stage-assets.json'),'utf8'));
assert.deepEqual(oldManifest,await buildStageCacheManifest(oldRoot));
const manifest=JSON.parse(await readFile('nonblock-stage-assets.json','utf8'));
assert.deepEqual(manifest,await buildStageCacheManifest(root));
await mkdir(out,{recursive:true});
const sha=x=>createHash('sha256').update(x).digest('hex');
const report={source:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),oldHead,
 release,profile:'mythwrought-five-surface-regions-mountain-v8',seed:2026,
 status:'BLOCKED',physicalIphone:false,productionPublished:false,events:[],errors:[]};
const mimes={'.html':'text/html; charset=utf-8','.mjs':'text/javascript; charset=utf-8',
 '.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8',
 '.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webmanifest':'application/manifest+json'};
let publish='old',brokenRequests=0;
const server=createServer(async(req,res)=>{
 try{
  const pathname=new URL(req.url,'http://localhost').pathname;
  if(pathname==='/mob-final-bootstrap')return res.writeHead(200,{'Content-Type':'text/html','Cache-Control':'no-store'}).end('<!doctype html><title>Private integration test</title>');
  const origin=publish==='old'?oldRoot:root;
  const file=resolve(origin,pathname==='/'?'index.html':'.'+decodeURIComponent(pathname));
  if(!file.startsWith(origin+sep))return res.writeHead(403).end();
  if(publish==='broken'&&pathname==='/src/creative-integration/creative-voxel-batch.mjs'){
   brokenRequests++;return res.writeHead(404).end('intentional missing dependency');
  }
  const bytes=await readFile(file);
  res.writeHead(200,{'Content-Type':mimes[extname(file)]??'application/octet-stream','Cache-Control':'no-store'}).end(bytes);
 }catch{res.writeHead(404).end();}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const ctx=await browser.newContext({viewport:{width:932,height:430},deviceScaleFactor:1,isMobile:true,hasTouch:true,serviceWorkers:'allow'});
let page=await ctx.newPage();
function attach(tab){tab.on('pageerror',e=>report.errors.push(String(e)));}
attach(page);
const wait=async(fn,arg,timeout=120000)=>{
 const end=Date.now()+timeout;
 while(Date.now()<end){if(await page.evaluate(fn,arg))return;await page.waitForTimeout(250);}
 throw Error('Verified condition timed out '+JSON.stringify(arg));
};
const ready=async()=>{
 await page.waitForFunction(()=>window.__mythwroughtTest?.fourBiomeProfile()?.generator==='mythwrought-five-surface-regions-mountain-v8'&&
  +document.querySelector('#scene')?.dataset.loadedChunks>=20&&document.querySelector('#scene')?.dataset.skyDrawn==='true',null,{timeout:120000});
 if(await page.locator('#help').isVisible())await page.locator('#closeHelp').click();
};
const readSaves=()=>page.evaluate(async()=>{
 const {mountainV8Storage}=await import('/src/manual-biomes/mountain-v8-isolated-storage.mjs');
 const s=mountainV8Storage(localStorage),key='mythwrought-v002-world-2026';
 return {world:s.getItem(key),profile:s.getItem(key+'-four-biomes-profile-v1'),pack2:s.getItem(key+'-pack2-live-v1'),legacy:localStorage.getItem(key)};
});
async function bank(name){
 return page.evaluate(async name=>{
  if(!await caches.has(name))return null;
  const c=await caches.open(name);
  const files=await c.keys(),html=await c.match(new URL('/index.html',location.href));
  return {count:files.length,html:await html?.text(),names:files.map(x=>new URL(x.url).pathname).sort()};
 },name);
}
async function trigger(){
 return page.evaluate(async()=>{
  const reg=await navigator.serviceWorker.getRegistration('/');
  if(!reg)throw Error('Existing worker registration missing');
  return new Promise((resolve,reject)=>{
   const timer=setTimeout(()=>reject(Error('worker update terminal state timeout')),120000);
   reg.addEventListener('updatefound',()=>{
    const candidate=reg.installing;if(!candidate){clearTimeout(timer);reject(Error('no candidate'));return;}
    const state=()=>{if(['activated','redundant'].includes(candidate.state)){clearTimeout(timer);resolve(candidate.state);}};
    candidate.addEventListener('statechange',state);state();
   },{once:true});
   reg.update().catch(e=>{clearTimeout(timer);reject(e);});
  });
 });
}
try{
 await page.goto(origin+'/mob-final-bootstrap');
 const boot=await page.evaluate(async()=>{
  const {createMountainV8IsolatedWorld}=await import('/src/manual-biomes/mountain-v8-new-world-admission.mjs');
  const {mountainV8Storage,setMountainV8Active}=await import('/src/manual-biomes/mountain-v8-isolated-storage.mjs');
  const {saveM2World}=await import('/src/manual-biomes/m2-runtime-bridge.mjs');
  const {SELECTED_SEED_KEY}=await import('/src/seeds.mjs');
  const result=await createMountainV8IsolatedWorld('2026',{confirmed:true,storage:localStorage});
  if(!result.world.set(500,-20,500,3)||!result.world.set(500,256,500,3))throw Error('Prior lower/upper fixture edit refused');
  const scoped=mountainV8Storage(localStorage);
  if(!saveM2World(scoped,result.world).ok)throw Error('Original save failed');
  scoped.setItem(SELECTED_SEED_KEY,'2026');
  setMountainV8Active(localStorage,true);
  return result.base.generationProfile;
 });
 assert.equal(boot.generator,report.profile);
 await page.goto(origin+'/');await ready();
 const original=await readSaves();assert.ok(original.world&&original.profile);assert.equal(original.legacy,null);
 assert.ok(JSON.parse(original.world).edits.some(row=>row[0]===500&&row[1]===256&&row[2]===500&&row[3]===3),'Prior ceiling edit missing from original saved bytes');
 await wait(async cache=>Boolean(navigator.serviceWorker.controller)&&await caches.has(cache),oldCache);
 const oldBank=await bank(oldCache);assert.ok(oldBank.html.includes('data-mw-release="'+prior+'"'));assert.deepEqual(oldBank.names,publicAssets(oldManifest).map(([p])=>new URL(p,origin+'/').pathname).sort());assert.equal(oldBank.count,publicAssets(oldManifest).length);
 report.events.push({stage:'old exact current production',assets:oldBank.count});
 publish='broken';
 assert.equal(await trigger(),'redundant');assert.ok(brokenRequests>0);
 assert.equal(await bank(newCache),null);
 const retained=await bank(oldCache);assert.deepEqual(retained,oldBank);
 await ctx.setOffline(true);
 const rollback=await page.reload({waitUntil:'load'});assert.equal(rollback.fromServiceWorker(),true);
 await ready();assert.deepEqual(await readSaves(),original);
 assert.equal(await page.locator('meta[name="mythwrought-release"]').getAttribute('data-mw-release'),prior);
 report.events.push({stage:'rejected missing new voxel batch dependency; previous-good offline reboot',brokenRequests});
 publish='new';await ctx.setOffline(false);
 assert.equal(await trigger(),'activated');
 await wait(async cache=>Boolean(navigator.serviceWorker.controller)&&await caches.has(cache),newCache);
 const newBank=await bank(newCache);
 assert.ok(newBank.html.includes('data-mw-release="'+release+'"'));
 const expected=Object.keys(manifest.assets).filter(p=>!['./src/nonblock/stage-offline.mjs','./sw-nonblock-stage.js'].includes(p)).map(p=>new URL(p,origin+'/').pathname).sort();
 assert.deepEqual(newBank.names,expected);
 assert.deepEqual(await bank(oldCache),oldBank);
 // Check every installed canonical asset against the actual generated manifest.
 const checked=await page.evaluate(async({name,entries})=>{
  const cache=await caches.open(name);let n=0;
  for(const [p,expected] of entries){
   const hit=await cache.match(new URL(p,location.href));if(!hit)throw Error('Missing '+p);
   const digest=[...new Uint8Array(await crypto.subtle.digest('SHA-256',await hit.arrayBuffer()))].map(x=>x.toString(16).padStart(2,'0')).join('');
   if(digest!==expected)throw Error('Wrong actual cached bytes '+p);n++;
  }return n;
 },{name:newCache,entries:Object.entries(manifest.assets).filter(([p])=>!['./src/nonblock/stage-offline.mjs','./sw-nonblock-stage.js'].includes(p))});
 assert.equal(checked,publicAssets(manifest).length);assert.equal(checked,expected.length);
 report.events.push({stage:'new complete exact-byte shell installed; old bank preserved',assets:checked});
 await ctx.setOffline(true);
 const response=await page.reload({waitUntil:'load'});assert.equal(response.fromServiceWorker(),true);
 await ready();assert.equal(await page.locator('meta[name="mythwrought-release"]').getAttribute('data-mw-release'),release);
 assert.deepEqual(await readSaves(),original);
 // Cold offline import is a genuine cache dependency witness, in addition
 // to the actual main module importing the helper at boot.
 const helper=await page.evaluate(async()=>typeof (await import('/src/creative-integration/creative-voxel-batch.mjs')).replayCreativeVoxelBatch);
 assert.equal(helper,'function');
 await page.waitForFunction(()=>typeof window.__mythwroughtTest.mobSourceRevision==='function'&&+document.querySelector('#scene').dataset.mobSpecies===40,null,{timeout:120000});
 const fixture=await page.evaluate(()=>window.__mythwroughtTest.mobAcceptanceFixture('fox'));
 assert.equal(fixture.speciesId,'fox');assert.equal(fixture.worldSeed,2026);
 await page.waitForFunction(()=>+document.querySelector('#scene').dataset.mobActors===1,null,{timeout:45000});
 const snapshot=await page.evaluate(()=>window.__mythwroughtTest.mobAcceptanceSnapshot());
 assert.equal(snapshot.drawn,1);assert.equal(snapshot.glError,0);assert.equal(snapshot.contextLost,false);
 const png=await page.locator('#scene').screenshot();await writeFile(resolve(out,'offline-mountain-fox.png'),png);
 const witness=await page.evaluate(()=>{
  const t=window.__mythwroughtTest,prior=t.mobSourceRevision();
  const accepted=t.editBiomeCell(500,-20,500,0),next=t.mobSourceRevision();
  return {prior,next,accepted};
 });
 assert.equal(witness.accepted,true);assert.ok(witness.next>witness.prior);
 report.events.push({stage:'offline original game fixture and actual world revision',fixture,snapshot,witness,pngSHA256:sha(png)});
 assert.deepEqual(report.errors,[]);
 report.status='PASS';
}catch(error){report.error=String(error?.stack??error);throw error;}
finally{
 await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2)+'\n');
 console.log('UNIFIED_MOB_UPGRADE '+JSON.stringify(report));
 await ctx.close();await browser.close();await new Promise(r=>server.close(r));
}
