// Real original game smoke on isolated loopback origin, not a hardware benchmark.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,sep,extname} from 'node:path';
import {createHash} from 'node:crypto';
const root=resolve('artifacts/physical-mining-package');
const meta=JSON.parse(await readFile(resolve(root,'diagnostic-assets.json'),'utf8'));
const out=resolve('artifacts/physical-mining-smoke');await mkdir(out,{recursive:true});
const sha=b=>createHash('sha256').update(b).digest('hex');
const report={source:meta.source,baseline:meta.baseline,diagnosticOnly:true,physicalIphone:false,published:false,complete:false,errors:[],events:[]};
const mime={'.html':'text/html','.mjs':'text/javascript','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.svg':'image/svg+xml'};
const requests=[];let missing=[];
const server=createServer(async(req,res)=>{
 try{
  const path=new URL(req.url,'http://localhost').pathname;
  if(path==='/fixture-bootstrap')return res.writeHead(200,{'Content-Type':'text/html'}).end('<!doctype html><title>Fixture</title>');
  const rel=path==='/'?'index.html':decodeURIComponent(path.slice(1)),file=resolve(root,rel);
  if(!file.startsWith(root+sep))return res.writeHead(403).end();
  if(!Object.hasOwn(meta.assets,rel)&&rel!=='diagnostic-assets.json'){missing.push(rel);return res.writeHead(404).end();}
  const bytes=await readFile(file);if(meta.assets[rel])assert.equal(sha(bytes),meta.assets[rel]);
  requests.push(rel);res.writeHead(200,{'Content-Type':mime[extname(file)]??'application/octet-stream','Cache-Control':'no-store'}).end(bytes);
 }catch(e){res.writeHead(500).end(String(e));}
});
await new Promise(r=>server.listen(4173,'127.0.0.1',r));
const wrong=createServer(async(req,res)=>{
 const path=new URL(req.url,'http://localhost').pathname;
 if(path==='/fixture-bootstrap')return res.writeHead(200,{'Content-Type':'text/html'}).end('<!doctype html><title>Sentinel</title>');
 const rel=path==='/'?'index.html':path.slice(1);
 if(!['index.html','diagnostic-bootstrap.mjs','styles.css','assets/icon.svg'].includes(rel))return res.writeHead(404).end();
 res.writeHead(200,{'Content-Type':mime[extname(rel)]??'application/octet-stream'}).end(await readFile(resolve(root,rel)));
});
await new Promise(r=>wrong.listen(4174,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const ctx=await browser.newContext({viewport:{width:956,height:440},deviceScaleFactor:1,hasTouch:true,isMobile:true,serviceWorkers:'allow'});
const page=await ctx.newPage();page.on('pageerror',e=>report.errors.push(String(e)));
const origin=meta.allowedOrigin,wrongOrigin='http://127.0.0.1:4174';
const ready=()=>page.waitForFunction(()=>window.__mythwroughtTest?.fourBiomeProfile()?.generator==='mythwrought-five-surface-regions-mountain-v8'&&Number(document.querySelector('#scene').dataset.pendingChunks)===0&&Number(document.querySelector('#scene').dataset.loadedChunks)>=20&&document.querySelector('#notice').hidden,null,{timeout:120000});
const saves=()=>page.evaluate(async()=>{
 const {mountainV8Storage}=await import('/src/manual-biomes/mountain-v8-isolated-storage.mjs');
 const scoped=mountainV8Storage(localStorage),key='mythwrought-v002-world-2026';
 return {world:scoped.getItem(key),profile:scoped.getItem(key+'-four-biomes-profile-v1'),pack2:scoped.getItem(key+'-pack2-live-v1'),legacy:localStorage.getItem(key)};
});
try{
 await page.goto(wrongOrigin+'/fixture-bootstrap');await page.evaluate(()=>localStorage.setItem('sentinel','production-like-save'));
 await page.goto(wrongOrigin+'/');await page.waitForFunction(()=>document.documentElement.dataset.diagnosticBlocked==='true');
 assert.equal(await page.evaluate(()=>localStorage.getItem('sentinel')),'production-like-save');
 assert.equal(await page.evaluate(()=>typeof window.__mythwroughtTest),'undefined');
 report.events.push({stage:'wrong origin refused before game import'});
 await page.goto(origin+'/fixture-bootstrap');
 assert.equal(await page.evaluate(()=>localStorage.getItem('sentinel')),null);
 const fixture=await page.evaluate(async()=>{
  const {createMountainV8IsolatedWorld}=await import('/src/manual-biomes/mountain-v8-new-world-admission.mjs');
  const {mountainV8Storage,setMountainV8Active}=await import('/src/manual-biomes/mountain-v8-isolated-storage.mjs');
  const {saveM2World}=await import('/src/manual-biomes/m2-runtime-bridge.mjs');
  const {SELECTED_SEED_KEY}=await import('/src/seeds.mjs');
  const result=await createMountainV8IsolatedWorld('2026',{confirmed:true,storage:localStorage});
  const scoped=mountainV8Storage(localStorage);
  const set=(x,y,z,id)=>{if(result.world.get(x,y,z)!==id&&!result.world.set(x,y,z,id))throw Error('Setup rejected '+[x,y,z,id]);if(result.world.get(x,y,z)!==id)throw Error('Setup mismatch');};
  for(let x=-1;x<=4;x++)for(let z=0;z<=2;z++){set(x,-79,z,3);for(let y=-78;y<=-76;y++)set(x,y,z,0);}
  for(const x of [0,2])set(x,-77,3,3);
  if(!saveM2World(scoped,result.world).ok)throw Error('Fixture save failed');
  scoped.setItem(SELECTED_SEED_KEY,'2026');setMountainV8Active(localStorage,true);
  return result.base.generationProfile.generator;
 });assert.equal(fixture,'mythwrought-five-surface-regions-mountain-v8');
 await page.goto(origin+'/');await ready();
 if(await page.locator('#help').isVisible())await page.locator('#closeHelp').click();
 assert.equal(await page.locator('html').getAttribute('data-diagnostic-source'),meta.source);
 const original=await saves();assert.ok(original.world&&original.profile);assert.equal(original.legacy,null);
 const surface=await page.locator('#scene').screenshot({path:out+'/surface.png'});
 report.events.push({stage:'actual source surface',sha:sha(surface)});
 for(const x of [0,2]){
  const cell=[x,-77,3],pose=[x,-78,1];
  await page.evaluate(({cell,pose})=>{const t=window.__mythwroughtTest;t.teleportCave(...pose);t.aimAt(...cell);},{cell,pose});
  await page.waitForFunction(cell=>{const c=document.querySelector('#scene');return +c.dataset.pendingChunks===0&&+c.dataset.loadedChunks===27&&c.dataset.targetBlock===cell.join(',')&&c.dataset.playerGrounded==='true'&&c.dataset.playerColliding==='false';},cell,{timeout:120000});
  const before=await page.evaluate(()=>window.__mythwroughtTest.snapshot().editMeshBatches);
  await page.locator('#dig').tap({force:true});
  await page.waitForFunction(({cell,before})=>window.__mythwroughtTest.block(...cell)===0&&window.__mythwroughtTest.snapshot().editMeshBatches===before+1,{cell,before},{timeout:30000});
  assert.match(await page.locator('#status').textContent(),/Removed .* · saved/);
  await page.waitForTimeout(300);
 }
 const deep=await page.locator('#scene').screenshot({path:out+'/deep.png'});report.events.push({stage:'actual underground edits',sha:sha(deep)});
 await page.locator('#menu').tap();await page.locator('#advancedMenu').evaluate(e=>e.open=true);
 await page.locator('#runAudit').click();
 await page.waitForFunction(()=>document.querySelector('#auditReport').value.includes('MINING TRACE v1'),null,{timeout:30000});
 const raw=await page.locator('#auditReport').inputValue();
 const trace=JSON.parse(raw.split('\n').at(-1));
 assert.equal(trace.baselineSource,meta.baseline);assert.ok(trace.moduleUrl.includes('mw-probe='+meta.source));
 const edits=trace.edits.filter(e=>e.outcome==='voxelSaved');
 assert.equal(edits.length,2);
 for(const e of edits){assert.ok(e.meshOwners.length>0&&e.phases.cpuOpaqueMesh.count>0&&e.phases.glPreGetError.count>0&&e.phases.glPostGetError.count>0&&e.phases.saveAndExistingReadback.count===1&&Number.isFinite(e.nextDrawEndMs));}
 assert.ok(trace.frames.some(f=>f.phases.stream)&&trace.frames.some(f=>f.editIds.length));
 await writeFile(resolve(out,'device-report.txt'),raw);
 const final=await saves();assert.notEqual(final.world,original.world);assert.equal(final.profile,original.profile);
 await page.reload();await ready();assert.deepEqual(await saves(),final);
 assert.deepEqual(await page.evaluate(()=>[0,2].map(x=>window.__mythwroughtTest.block(x,-77,3))),[0,0]);
 const storage=await page.evaluate(async()=>({registrations:(await navigator.serviceWorker.getRegistrations()).length,controller:!!navigator.serviceWorker.controller,caches:await caches.keys(),sentinel:localStorage.getItem('sentinel')}));
 assert.deepEqual(storage,{registrations:0,controller:false,caches:[],sentinel:null});
 assert.ok(!requests.some(p=>/^sw-/.test(p)));
 assert.deepEqual(missing.filter(p=>p!=='favicon.ico'),[]);
 report.events.push({stage:'trace and cold save reload',editIds:edits.map(e=>e.id),frameCount:trace.frameCount,saveSHA256:sha(final.world),storage,uniqueRequests:new Set(requests).size});
 await page.goto(wrongOrigin+'/fixture-bootstrap');assert.equal(await page.evaluate(()=>localStorage.getItem('sentinel')),'production-like-save');
 assert.deepEqual(report.errors,[]);report.complete=true;
}catch(e){report.errors.push(String(e.stack??e));process.exitCode=1;}
finally{await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2)+'\n');console.log('PHYSICAL MINING SMOKE',JSON.stringify(report));await ctx.close();await browser.close();await Promise.all([new Promise(r=>server.close(r)),new Promise(r=>wrong.close(r))]);}
