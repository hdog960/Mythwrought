// Actual diagnostic production -> save-replay candidate same-origin
// service-worker upgrade and rollback. Uses actual old checkout, new checkout,
// original isolated save API and original live-game Mob acceptance fixture.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,sep,extname} from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {chromium} from 'playwright';
const oldRoot=resolve(process.env.DIAGNOSTIC_PREVIOUS_ROOT??'');
const root=resolve('.');
const oldHead='18d0ff83df918f72d6ffaff1755998e680ef149e';
assert.equal(execFileSync('git',['-C',oldRoot,'rev-parse','HEAD'],{encoding:'utf8'}).trim(),oldHead);
assert.notEqual(oldRoot,root);
const release='20261127-mining-save-replay-v1',prior='20261126-mining-diagnostic-v1';
const oldCache='mythwrought-m5-shell-'+prior,newCache='mythwrought-m5-shell-'+release;
const out=resolve('artifacts/mining-save-replay-upgrade');
await mkdir(out,{recursive:true});
const sha=x=>createHash('sha256').update(x).digest('hex');
const report={source:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),oldHead,
 release,profile:'mythwrought-five-surface-regions-mountain-v8',seed:566928984,
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
  if(publish==='broken'&&pathname==='/src/mining-trace.mjs'){
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
 const s=mountainV8Storage(localStorage),key='mythwrought-v002-world-566928984';
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
const audit=async()=>{
 await page.locator('#menu').tap();await page.locator('#advancedMenu').evaluate(e=>e.open=true);
 await page.locator('#runAudit').click();
 await page.waitForFunction(()=>document.querySelector('#auditReport').value.includes('MYTHWROUGHT'),null,{timeout:30000});
 return page.locator('#auditReport').inputValue();
};
async function mineTargets(xs,label){
 const off=await audit();assert.ok(!off.includes('MINING TRACE v1'));
 await page.locator('#startMiningTrace').click();await page.locator('#closeHelp').tap();
 for(const x of xs){
  const cell=[x,-140,-173],pose=[x,-141,-175];
  await page.evaluate(({cell,pose})=>{const t=window.__mythwroughtTest;t.teleportCave(...pose);t.aimAt(...cell);},{cell,pose});
  await page.waitForFunction(cell=>{const c=document.querySelector('#scene');return +c.dataset.pendingChunks===0&&+c.dataset.loadedChunks===27&&c.dataset.targetBlock===cell.join(',')&&c.dataset.playerGrounded==='true'&&c.dataset.playerColliding==='false';},cell,{timeout:120000});
  const before=await page.evaluate(()=>window.__mythwroughtTest.snapshot().editMeshBatches);
  await page.locator('#dig').tap({force:true});
  await page.waitForFunction(({cell,before})=>window.__mythwroughtTest.block(...cell)===0&&window.__mythwroughtTest.snapshot().editMeshBatches===before+1,{cell,before},{timeout:30000});
  assert.match(await page.locator('#status').textContent(),/Removed .* · saved/);
  await page.waitForTimeout(300);
 }
 const raw=await audit(),trace=JSON.parse(raw.split('\n').at(-1));
 await writeFile(resolve(out,label+'-device-report.txt'),raw);
 const edits=trace.edits.filter(e=>e.outcome==='voxelSaved');assert.equal(edits.length,xs.length);
 assert.ok(edits.every(e=>e.phases.saveAndExistingReadback.count===1&&Number.isFinite(e.phases.saveAndExistingReadback.totalMs)));
 assert.match(await page.locator('#miningTraceStatus').textContent(),/Recording is off/);
 await page.locator('#closeHelp').tap();
 return {raw,trace,edits};
}
try{
 await page.goto(origin+'/mob-final-bootstrap');
 const boot=await page.evaluate(async()=>{
  const {createMountainV8IsolatedWorld}=await import('/src/manual-biomes/mountain-v8-new-world-admission.mjs');
  const {mountainV8Storage,setMountainV8Active}=await import('/src/manual-biomes/mountain-v8-isolated-storage.mjs');
  const {saveM2World}=await import('/src/manual-biomes/m2-runtime-bridge.mjs');
  const {SELECTED_SEED_KEY}=await import('/src/seeds.mjs');
  const result=await createMountainV8IsolatedWorld('566928984',{confirmed:true,storage:localStorage});
  if(!result.world.set(500,-20,500,3)||!result.world.set(500,256,500,3))throw Error('Prior lower/upper fixture edit refused');
  const set=(x,y,z,id)=>{if(result.world.get(x,y,z)!==id&&!result.world.set(x,y,z,id))throw Error('Setup rejected '+[x,y,z,id]);if(result.world.get(x,y,z)!==id)throw Error('Setup mismatch');};
  // Synthetic prior shafts, including surface edits, for the creator's actual
  // seed and remote column. Not a reconstruction of the creator's entire save.
  for(let y=14;y>=-138;y--)set(-11,y,-175,0);
  for(let y=14;y>=-80;y--)set(0,y,0,0);
  for(let x=-12;x<=4;x++)for(let z=-176;z<=-174;z++){set(x,-142,z,3);for(let y=-141;y<=-139;y++)set(x,y,z,0);}
  for(const x of [-11,-9,-7,-5,-3,-1,1,3])set(x,-140,-173,3);
  const scoped=mountainV8Storage(localStorage);
  if(!saveM2World(scoped,result.world).ok)throw Error('Original save failed');
  scoped.setItem(SELECTED_SEED_KEY,'566928984');
  setMountainV8Active(localStorage,true);
  return result.base.generationProfile;
 });
 assert.equal(boot.generator,report.profile);
 await page.goto(origin+'/');await ready();
 const initial=await readSaves();assert.ok(initial.world&&initial.profile);assert.equal(initial.legacy,null);
 assert.ok(JSON.parse(initial.world).edits.some(row=>row[0]===500&&row[1]===256&&row[2]===500&&row[3]===3),'Prior ceiling edit missing from original saved bytes');
 await wait(async cache=>Boolean(navigator.serviceWorker.controller)&&await caches.has(cache),oldCache);
 const oldBank=await bank(oldCache);assert.ok(oldBank.html.includes('data-mw-release="'+prior+'"'));const oldManifest=JSON.parse(await readFile(resolve(oldRoot,'nonblock-stage-assets.json'),'utf8'));
 assert.equal(oldBank.count,Object.keys(oldManifest.assets).length-2);
 report.events.push({stage:'old exact current production',assets:oldBank.count});
 const before=await mineTargets([-11,-9,-7,-5],'baseline');
 assert.equal(before.trace.release,prior);
 const original=await readSaves();assert.notEqual(original.world,initial.world);assert.equal(original.profile,initial.profile);
 report.events.push({stage:'baseline real remote touch mining',saveMs:before.edits.map(e=>e.phases.saveAndExistingReadback.totalMs)});
 publish='broken';
 assert.equal(await trigger(),'redundant');assert.ok(brokenRequests>0);
 assert.equal(await bank(newCache),null);
 const retained=await bank(oldCache);assert.deepEqual(retained,oldBank);
 await ctx.setOffline(true);
 const rollback=await page.reload({waitUntil:'load'});assert.equal(rollback.fromServiceWorker(),true);
 await ready();assert.deepEqual(await readSaves(),original);
 assert.equal(await page.locator('meta[name="mythwrought-release"]').getAttribute('data-mw-release'),prior);
 report.events.push({stage:'rejected missing mining trace dependency; previous-good offline reboot',brokenRequests});
 publish='new';await ctx.setOffline(false);
 assert.equal(await trigger(),'activated');
 await wait(async cache=>Boolean(navigator.serviceWorker.controller)&&await caches.has(cache),newCache);
 const manifest=JSON.parse(await readFile('nonblock-stage-assets.json','utf8'));
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
 assert.equal(checked,Object.keys(oldManifest.assets).length-2);assert.equal(checked,expected.length);
 report.events.push({stage:'new complete exact-byte shell installed; old bank preserved',assets:checked});
 await ctx.setOffline(true);
 const response=await page.reload({waitUntil:'load'});assert.equal(response.fromServiceWorker(),true);
 await ready();assert.equal(await page.locator('meta[name="mythwrought-release"]').getAttribute('data-mw-release'),release);
 assert.deepEqual(await readSaves(),original);
 // Same installed offline app: trace OFF by default, enable with actual menu button.
 const candidate=await mineTargets([-3,-1,1,3],'candidate');
 const {raw,trace}=candidate;
 // Preserve real diagnostic evidence even if a subsequent identity assertion fails.
 await writeFile(resolve(out,'device-report.txt'),raw);
 // CacheStorage retains the fetched Response URL (mw-cache-install=bank).
 // Chromium may report that URL as import.meta.url for the pinned module.
 // Accept only the exact shell request or exact verified cached Response URL,
 // on the same origin and canonical module path; never accept an arbitrary URL.
 const identity=await page.evaluate(async name=>{
   const requested=document.querySelector('script[type="module"][src*="src/main.mjs"]').src;
   const cache=await caches.open(name);
   const canonical=new URL('src/main.mjs',location.href).href;
   const response=await cache.match(canonical);
   if(!response)throw Error('Verified main module missing');
   const digest=[...new Uint8Array(await crypto.subtle.digest('SHA-256',await response.arrayBuffer()))].map(x=>x.toString(16).padStart(2,'0')).join('');
   return {requested,canonical,cachedResponseUrl:response.url,digest};
 },newCache);
 report.events.push({stage:'actual module identity',reported:trace.moduleUrl,...identity});
 const pinned=new URL(identity.canonical);pinned.searchParams.set('mw-release',release);
 const fetched=new URL(identity.canonical);fetched.searchParams.set('mw-cache-install',newCache);
 assert.equal(identity.requested,pinned.href);
 assert.equal(identity.cachedResponseUrl,fetched.href);
 assert.equal(identity.digest,manifest.assets['./src/main.mjs']);
 assert.equal(trace.release,release);
 assert.equal(trace.baselineSource,oldHead);
 assert.ok([pinned.href,fetched.href].includes(trace.moduleUrl),'Unexpected actual module URL '+trace.moduleUrl);
 const edits=trace.edits.filter(e=>e.outcome==='voxelSaved');assert.equal(edits.length,4);
 for(const e of edits)assert.ok(e.meshOwners.length&&e.phases.cpuOpaqueMesh.count&&e.phases.glPreGetError.count&&e.phases.glPostGetError.count&&e.phases.saveAndExistingReadback.count===1&&Number.isFinite(e.nextDrawEndMs));
 assert.ok(trace.frames.some(f=>f.phases.stream)&&trace.frames.some(f=>f.editIds.length));
 await writeFile(resolve(out,'device-report.txt'),raw);
 const png=await page.locator('#scene').screenshot();await writeFile(resolve(out,'offline-deep.png'),png);
 const final=await readSaves();assert.notEqual(final.world,original.world);assert.equal(final.profile,original.profile);
 await page.reload();await ready();assert.deepEqual(await readSaves(),final);
 assert.deepEqual(await page.evaluate(()=>[-11,-9,-7,-5,-3,-1,1,3].map(x=>window.__mythwroughtTest.block(x,-140,-173))),Array(8).fill(0));
 assert.ok(!(await audit()).includes('MINING TRACE v1'));
 const median=arr=>[...arr].sort((a,b)=>a-b)[Math.floor(arr.length/2)];
 const baseMs=before.edits.map(e=>e.phases.saveAndExistingReadback.totalMs),newMs=edits.map(e=>e.phases.saveAndExistingReadback.totalMs);
 report.events.push({stage:'offline touch mining, opt-in trace, stop and cold save reload',edits:edits.map(e=>e.id),frames:trace.frameCount,saveSHA256:sha(final.world),pngSHA256:sha(png),baselineSaveMs:baseMs,candidateSaveMs:newMs,baselineWarmMedianMs:median(baseMs.slice(1)),candidateWarmMedianMs:median(newMs.slice(1))});
 // Software browser wall times are reported, not a physical-device FPS gate.
 assert.deepEqual(report.errors,[]);
 report.status='PASS';
}catch(error){report.error=String(error?.stack??error);throw error;}
finally{
 await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2)+'\n');
 console.log('MINING_DIAGNOSTIC_UPGRADE '+JSON.stringify(report));
 await ctx.close();await browser.close();await new Promise(r=>server.close(r));
}
