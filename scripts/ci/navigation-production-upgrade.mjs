// Frozen production checkout -> exact candidate on the same Pages scope.
// Uses real normal NEW WORLD UI, original owners, original worker and actual WebGL2.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {chromium} from 'playwright';
const prior=path.resolve('prior-production'),current=process.cwd(),prefix='/Mythwrought/';
const oldRelease='20261127-veilreach-v1',release='20261127-unified-veilreach-v1',profile='mythwrought-five-surface-regions-mountain-v8',latestProfile='mythwrought-upper-veilreach-v1';
const assetPaths=async root=>Object.keys(JSON.parse(await readFile(path.join(root,'nonblock-stage-assets.json'),'utf8')).assets).filter(p=>!['./src/nonblock/stage-offline.mjs','./sw-nonblock-stage.js'].includes(p)).map(p=>p==='./'?prefix:prefix+p.slice(2)).sort();
const [priorPaths,currentPaths]=await Promise.all([assetPaths(prior),assetPaths(current)]);
assert.equal(new Set(priorPaths).size,priorPaths.length);assert.equal(new Set(currentPaths).size,currentPaths.length);
const out=path.resolve('artifacts/navigation-upgrade');await mkdir(out,{recursive:true});
const evidence={oldRelease,release,physicalIphone:false,checks:[]};
function check(name,value,details={}){evidence.checks.push({name,ok:Boolean(value),...details});console.log('HEIGHT UPGRADE',name,JSON.stringify({ok:Boolean(value),...details}));assert.ok(value,name);}
let deployment=prior,requests=0;const requestFailures=[];
const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webmanifest':'application/manifest+json'};
const server=createServer(async(req,res)=>{requests++;try{
 const u=new URL(req.url,'http://127.0.0.1');if(!u.pathname.startsWith(prefix))throw Error('outside Pages scope');
 // A blank same-origin bootstrap document creates a real prior-production
 // saved world through the old admission and save authorities, not fake rows.
 if(deployment===prior&&u.pathname===prefix+'__height_prior_bootstrap.html'){
  res.writeHead(200,{'Content-Type':'text/html','Cache-Control':'no-store'});res.end('<!doctype html><title>Prior production source bootstrap</title>');return;
 }
 const f=decodeURIComponent(u.pathname.slice(prefix.length))||'index.html',file=path.resolve(deployment,f);
 if(!file.startsWith(deployment+path.sep))throw Error('bad path');
 const bytes=await readFile(file);
 res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(bytes);
}catch(e){if(requestFailures.length<80)requestFailures.push({url:req.url,error:String(e)});if(!res.headersSent)res.writeHead(404);res.end(String(e));}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port+prefix;
let browser,context;
try{
 browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--no-sandbox']});
 context=await browser.newContext({viewport:{width:956,height:440},deviceScaleFactor:1,hasTouch:true,isMobile:true,serviceWorkers:'allow'});
 const page=await context.newPage(),errors=[],consoleErrors=[];
 page.on('pageerror',e=>{errors.push(String(e));console.error('HEIGHT PAGE ERROR',String(e));});
 page.on('console',m=>{if(m.type()==='error'&&consoleErrors.length<80)consoleErrors.push(m.text());});
 evidence.errors=errors;evidence.consoleErrors=consoleErrors;evidence.requestFailures=requestFailures;
 const waitGame=()=>page.waitForFunction(()=>window.__mythwroughtTest&&Number(document.querySelector('#scene')?.dataset.loadedChunks)>0,null,{timeout:180000});
 // Do not pass an async predicate to waitForFunction: the H10 gate
 // advanced with only 75 assets, no controllerchange and worker installing.
 // Await every observed snapshot in the Node process, accept strict boolean
 // evidence only, and bound polling by an explicit deadline.
 const poll=async(label,observe,accept,timeout=180000)=>{
  const deadline=Date.now()+timeout;let last=null;
  do{
   last=await observe();
   if(accept(last)===true)return last;
   await new Promise(resolve=>setTimeout(resolve,250));
  }while(Date.now()<deadline);
  throw Error(label+' timed out: '+JSON.stringify(last));
 };
 const cacheState=marker=>page.evaluate(async({marker,prefix})=>{
  const key='mythwrought-m5-shell-'+marker,exists=(await caches.keys()).includes(key);
  const c=exists?await caches.open(key):null;
  const html=c?await c.match(location.origin+prefix+'index.html'):null;
  return {exists,count:c?(await c.keys()).length:0,paths:c?(await c.keys()).map(r=>new URL(r.url).pathname).sort():[],exact:!!html&&(await html.text()).includes('data-mw-release="'+marker+'"'),controller:navigator.serviceWorker.controller?.state??null};
 },{marker,prefix});
 const waitCache=marker=>poll('complete '+marker+' cache',()=>cacheState(marker),s=>s.exists&&s.count===(marker===release?currentPaths.length:priorPaths.length)&&JSON.stringify(s.paths)===JSON.stringify(marker===release?currentPaths:priorPaths)&&s.exact&&s.controller==='activated');
 const settled=()=>poll('settled surface owner window',()=>page.evaluate(()=>{
  const t=window.__mythwroughtTest,s=t.snapshot(),p=t.m5ObservedPose(),cx=Math.floor(p.x/16),cz=Math.floor(p.z/16),core=[];
  for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++)core.push((cx+dx)+','+(cz+dz));
  return {chunks:s.chunks.length,pending:s.pending.length,core:core.every(k=>s.chunks.includes(k)),glError:document.querySelector('#scene').getContext('webgl2').getError()};
 }),s=>s.chunks===25&&s.pending===0&&s.core&&s.glError===0);
 const exportPack5=async()=>{
  await page.locator('#menu').click();await page.locator('#advancedMenu > summary').click();
  const [download]=await Promise.all([page.waitForEvent('download'),page.locator('#pack5Export').click()]);
  const data=JSON.parse(await readFile(await download.path(),'utf8'));
  await page.locator('#closeHelp').click();return data;
 };
 const state=()=>page.evaluate(()=>{
  const t=window.__mythwroughtTest,p='mythwrought-mountain-v8-isolated-v1:',seed=t.snapshot().seed;
  return {release:document.querySelector('meta[name="mythwrought-release"]').content,profile:t.fourBiomeProfile()?.generator??null,seed,
    raw:localStorage.getItem(p+'mythwrought-v002-world-'+seed),
    active:localStorage.getItem('mythwrought-mountain-v8-active-v1'),glError:document.querySelector('#scene').getContext('webgl2').getError()};
 });
 // The previous H8 run timed out before *any* prior-game assertions.
 // Establish a deterministic existing prior save with unchanged actual old
 // source, then launch the actual old public game and install its worker.
 await page.goto(origin+'__height_prior_bootstrap.html',{waitUntil:'load',timeout:30000});
 const prepared=await page.evaluate(async()=>{
  const {createMountainV8IsolatedWorld}=await import('./src/manual-biomes/mountain-v8-new-world-admission.mjs');
  const {mountainV8Storage,setMountainV8Active}=await import('./src/manual-biomes/mountain-v8-isolated-storage.mjs');
  const {saveM2World}=await import('./src/manual-biomes/m2-runtime-bridge.mjs');
  const result=await createMountainV8IsolatedWorld('2026',{confirmed:true,storage:localStorage});
  if(!result.world.set(4,-100,4,3)||!result.world.set(4,36,4,3))throw Error('Prior historical or upper source edit refused');
  const scoped=mountainV8Storage(localStorage),saved=saveM2World(scoped,result.world);
  if(!saved.ok)throw Error('Prior actual source save failed: '+saved.reason);
  setMountainV8Active(localStorage,true);
  return {seed:result.world.seed,raw:scoped.getItem('mythwrought-v002-world-2026')};
 });
 check('prior existing world created by frozen source',prepared.seed===2026&&JSON.parse(prepared.raw).edits.some(row=>row[0]===4&&row[1]===-100&&row[2]===4&&row[3]===3));
 await page.goto(origin+'?production-ui=1',{waitUntil:'load',timeout:90000});
 try{await waitGame();await waitCache(oldRelease);}catch(error){
  evidence.startup=await page.evaluate(async()=>({text:document.body.innerText.slice(0,4000),url:location.href,ready:document.readyState,cacheNames:await caches.keys(),worker:(await navigator.serviceWorker.getRegistration())?.active?.scriptURL,loaded:document.querySelector('#scene')?.dataset.loadedChunks,hasGame:!!window.__mythwroughtTest}));
  await page.screenshot({path:path.join(out,'prior-startup-failure.png')}).catch(()=>{});
  console.error('HEIGHT PRIOR STARTUP',JSON.stringify(evidence.startup));throw error;
 }
 const old=await state();check('exact previous production installed',old.release===oldRelease&&old.profile===profile&&old.seed===prepared.seed&&old.raw===prepared.raw&&old.active==='1',old);
 await page.waitForFunction(()=>Number(document.getElementById('miniMap').dataset.discovered)>0,null,{timeout:60000});
 await page.locator('#miniMapButton').tap();await page.locator('#closeExploration').tap();
 const priorFog=await page.evaluate(()=>localStorage.getItem('mythwrought-mountain-v8-isolated-v1:mythwrought-exploration-v1-2026'));
 check('prior real exploration persisted',!!priorFog&&JSON.parse(priorFog).cells.length>0);
 const priorKey='mythwrought-mountain-v8-isolated-v1:mythwrought-v002-world-'+old.seed;
 const historical=()=>page.evaluate(k=>localStorage.getItem(k),priorKey);
 const priorCache=await page.evaluate(async({prefix,oldRelease})=>{const c=await caches.open('mythwrought-m5-shell-'+oldRelease);return (await c.match(location.origin+prefix+'index.html')).text();},{prefix,oldRelease});
 await page.waitForFunction(()=>navigator.serviceWorker.controller?.state==='activated',null,{timeout:60000});
 await page.screenshot({path:path.join(out,'prior-installed-956x440.png')});
 deployment=current;
 // A controllerchange or the presence of the new cache alone is insufficient:
 // require the replaced, activated controller AND a cache-served version witness.
 await page.evaluate(()=>{
  const sw=navigator.serviceWorker;window.__heightPriorController=sw.controller;
  window.__heightWorkerEvents=[];
  sw.addEventListener('controllerchange',()=>window.__heightWorkerEvents.push({state:sw.controller?.state,changed:sw.controller!==window.__heightPriorController}));
 });
 await page.evaluate(async()=>{const r=await navigator.serviceWorker.getRegistration();if(!r)throw Error('Missing worker');await r.update();});
 try{
  const transition=await poll('new activated controlling worker',()=>page.evaluate(async()=>{
   const sw=navigator.serviceWorker,r=await sw.getRegistration();
   return {changed:!!sw.controller&&sw.controller!==window.__heightPriorController,activeMatch:!!sw.controller&&sw.controller===r?.active,state:sw.controller?.state??null,installing:r?.installing?.state??null,waiting:r?.waiting?.state??null,events:[...window.__heightWorkerEvents]};
  }),s=>s.changed&&s.activeMatch&&s.state==='activated'&&s.installing===null&&s.waiting===null&&s.events.some(e=>e.changed===true));
  check('distinct activated controller observed',true,transition);
  await waitCache(release);
  const controlled=await page.evaluate(async({prefix,release})=>{
   const key='mythwrought-m5-shell-'+release,c=await caches.open(key);
   const cacheCount=(await c.keys()).length;
   const response=await fetch(prefix+'index.html');
   const html=await response.text();
   return {cacheCount,controlledRelease:html.includes('data-mw-release="'+release+'"'),events:window.__heightWorkerEvents,controller:navigator.serviceWorker.controller?.state};
  },{prefix,release});
  check('new worker controls canonical cached source',controlled.cacheCount===currentPaths.length&&controlled.controlledRelease&&controlled.controller==='activated'&&controlled.events.some(e=>e.changed===true),controlled);
 }catch(error){
  evidence.upgradeWorker=await page.evaluate(async()=>{const sw=navigator.serviceWorker,r=await sw.getRegistration();return {controller:sw.controller?.state,changed:sw.controller!==window.__heightPriorController,active:r?.active?.state,installing:r?.installing?.state,waiting:r?.waiting?.state,events:window.__heightWorkerEvents,cacheNames:await caches.keys()};});
  console.error('HEIGHT WORKER DIAGNOSTICS',JSON.stringify(evidence.upgradeWorker));throw error;
 }
 // Actual navigation, not a direct network bypass or synthetic version marker.
 await page.goto(origin+'?production-ui=1',{waitUntil:'load',timeout:90000});await waitGame();
 const upgraded=await state();check('settled upgraded ground owners',true,await settled());await page.screenshot({path:path.join(out,'upgraded-installed-956x440.png')});check('same installation exact historical world',upgraded.release===release&&upgraded.seed===old.seed&&upgraded.raw===old.raw&&upgraded.profile===profile,upgraded);
 const upgradedFog=await page.evaluate(()=>localStorage.getItem('mythwrought-mountain-v8-isolated-v1:mythwrought-exploration-v1-2026'));
 check('prior discovery retained',JSON.parse(priorFog).cells.every(x=>JSON.parse(upgradedFog).cells.includes(x)));
 check('prior upper edit retained',JSON.parse(upgraded.raw).edits.some(row=>row[0]===4&&row[1]===36&&row[2]===4&&row[3]===3));
 await page.locator('#miniMapButton').tap();
 await page.locator('#navMarkerHere').tap();await page.locator('#navMarkerName').fill('Historical camp');await page.locator('#navMarkerAdd').tap();
 check('actual waypoint added',await page.locator('#navMarkerList option').count()===2);
 await page.locator('#closeExploration').tap();
 await context.setOffline(true);await page.reload({waitUntil:'load',timeout:90000});await waitGame();
 await page.locator('#miniMapButton').tap();check('cold offline historical waypoint restored',await page.locator('#navMarkerList option').count()===2);await page.locator('#closeExploration').tap();
 check('cold historical upper save retained',(await state()).raw===old.raw);
 await context.setOffline(false);
 const priorPreserved=await page.evaluate(async({prefix,oldRelease})=>{const c=await caches.open('mythwrought-m5-shell-'+oldRelease);return (await c.match(location.origin+prefix+'index.html')).text();},{prefix,oldRelease});
 check('previous shell preserved',priorPreserved===priorCache);
 const ui=await page.evaluate(()=>({ordinary:document.querySelectorAll('#newWorld').length,alternate:['newSnowWorld','createFourBiomeWorld','createExperimentalV5World','createBalancedV6World','createEnchantedP2World','createMountainV8Candidate','caveCreateWorld'].filter(id=>document.getElementById(id))}));
 check('creator rule 492 ordinary creation control',ui.ordinary===1&&ui.alternate.length===0,ui);
 await page.locator('#menu').click();page.once('dialog',d=>d.dismiss());await page.locator('#newWorld').click();
 check('cancel does not replace old world',(await state()).seed===old.seed&&await historical()===old.raw);
 page.once('dialog',d=>d.accept());await page.locator('#newWorld').click();
 await page.waitForFunction(seed=>window.__mythwroughtTest?.snapshot().seed!==seed,old.seed,{timeout:180000});await waitGame();
 const fresh=await state();check('normal NEW WORLD uses current combined profile',fresh.release===release&&fresh.seed!==old.seed&&fresh.profile===latestProfile&&fresh.raw&&await historical()===old.raw,fresh);
 // Use localhost-only source-owned fixture actions, not a simulated mesh.
 // Full real player-controlled ceiling flight is already H7 accepted.
 const cells=await page.evaluate(()=>{
  const t=window.__mythwroughtTest,p=t.m5ObservedPose(),x=Math.floor(p.x)+4,z=Math.floor(p.z),y=36;
  const base=[x,y-1,z],core=[x,y,z],p1=[x,y,z+1],p2=[x,y,z+2],p3=[x,y,z+3],p4=[x,y,z+4],p5=[x,y,z+5];
  for(let dz=0;dz<=5;dz++)t.placeFixture(x,y-1,z+dz,3);
  t.placeFixture(...core,3);t.placeManual14Fixture(...p1,9);t.placeFixture(...p2,76);t.placePack3Fixture(...p3,116,0);t.placeManual14Fixture(...p4,159);
  return {base,core,p1,p2,p3,p4,p5};
 });
 await page.locator('#menu').click();await page.locator('#advancedMenu > summary').click();await page.locator('#pack5Enabled').check();
 await page.waitForFunction(()=>document.getElementById('pack5Status').textContent.includes('Pack 5 ON'),null,{timeout:30000});
 await page.locator('#closeHelp').click();
 const furnishing=await page.evaluate(p=>window.__mythwroughtTest.placePack5TestFixture(...p),cells.p5);
 check('Pack5 actual owner placement',furnishing.ok&&furnishing.worldSchema===1,furnishing);
 const inspect=()=>page.evaluate(c=>{const t=window.__mythwroughtTest;return {ids:[c.core,c.p1,c.p2,c.p3,c.p4].map(p=>t.block(...p)),snap:t.snapshot(),data:{...document.querySelector('#scene').dataset}}},cells);
 const initial=await inspect();check('all upper physical owner IDs',JSON.stringify(initial.ids)===JSON.stringify([3,9,76,116,159])&&initial.snap.pack3PhysicalBlocks>=1&&initial.snap.manual14PhysicalBlocks>=2,initial.ids);
 // Fly to the upper construction section using real controls. Camera aim is test-only.
 await page.locator('#g2bFlightEnable').check();
 const cdp=await context.newCDPSession(page),jump=await page.locator('#jump').boundingBox(),time=Date.now()/1000;
 for(let i=0;i<2;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:jump.x+jump.width/2,y:jump.y+jump.height/2,id:i+1}],timestamp:time+i*.3});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[],timestamp:time+i*.3+.075});}
 await page.waitForFunction(()=>window.__mythwroughtTest.flightInfo().active,null,{timeout:15000});await page.locator('#scene').focus();
 await page.keyboard.down('e');try{await page.waitForFunction(()=>window.__mythwroughtTest.flightInfo().position.y>=36.5,null,{timeout:60000});}finally{await page.keyboard.up('e');}
 await page.evaluate(p=>window.__mythwroughtTest.aimAt(...p),cells.p3);
 await page.waitForFunction(()=>Number(document.querySelector('#scene').dataset.upperMeshVertices)>0,null,{timeout:60000});
 const rendered=await inspect();check('actual upper render bounded',Number(rendered.data.upperGpuBytes)>0&&Number(rendered.data.upperGpuBytes)<=7077888&&Number(rendered.data.upperGpuOwners)<=8,{vertices:rendered.data.upperMeshVertices,bytes:rendered.data.upperGpuBytes,owners:rendered.data.upperGpuOwners});
 await page.screenshot({path:path.join(out,'upper-all-packs-956x440.png')});
 const beforeFurniture=await exportPack5();check('actual Pack5 live exported anchor and material',beforeFurniture.entries.some(row=>row.slice(0,3).every((n,i)=>n===cells.p5[i])&&row[3]==='pack5:080'),{entries:beforeFurniture.entries});
 const saved=await state();check('upper canonical edit saved',JSON.parse(saved.raw).edits.some(row=>row[1]===36&&row[3]===3)&&await historical()===old.raw);
 await context.setOffline(true);await page.reload({waitUntil:'load',timeout:90000});await waitGame();
 await page.waitForFunction(()=>document.getElementById('pack5Status').textContent.includes('restored'),null,{timeout:60000});
 const cold=await state(),restored=await inspect();check('cold offline new-world and all original owners restored',cold.release===release&&cold.profile===latestProfile&&cold.raw===saved.raw&&cold.glError===0&&JSON.stringify(restored.ids)===JSON.stringify(initial.ids)&&await historical()===old.raw,cold);
 const afterFurniture=await exportPack5();check('actual cold Pack5 owner export byte-equivalent',JSON.stringify(afterFurniture)===JSON.stringify(beforeFurniture),{entries:afterFurniture.entries});
 check('settled offline ground owners',true,await settled());
 await page.screenshot({path:path.join(out,'offline-new-world-956x440.png')});check('zero page errors',errors.length===0,{errors});
// Fresh, empty browser storage must also enter the released combined
 // generator through production startup, not a developer-only fixture.
 const empty=await browser.newContext({viewport:{width:956,height:440},deviceScaleFactor:1,hasTouch:true,isMobile:true,serviceWorkers:'block'});
 try{
  const first=await empty.newPage(),firstErrors=[];first.on('pageerror',e=>firstErrors.push(String(e)));
  await first.goto(origin+'?production-ui=1',{waitUntil:'domcontentloaded',timeout:90000});
  try{
   await first.waitForFunction(()=>window.__mythwroughtTest&&Number(document.querySelector('#scene')?.dataset.loadedChunks)>0&&document.querySelector('#notice').hidden,null,{timeout:180000});
  }catch(error){
   evidence.freshStartupFailure=await first.evaluate(()=>({notice:document.querySelector('#notice')?.textContent,status:document.querySelector('#status')?.textContent,scene:{...document.querySelector('#scene')?.dataset},errors:document.body.innerText.slice(0,1000)}));
   await first.screenshot({path:path.join(out,'fresh-startup-failure.png')}).catch(()=>{});throw error;
  }
  const firstState=await first.evaluate(()=>{
   const t=window.__mythwroughtTest,seed=t.snapshot().seed,p='mythwrought-mountain-v8-isolated-v1:',raw=localStorage.getItem(p+'mythwrought-v002-world-'+seed);
   return {seed,profile:t.fourBiomeProfile()?.generator,release:document.querySelector('meta[name="mythwrought-release"]').content,raw,active:localStorage.getItem('mythwrought-mountain-v8-active-v1'),ordinary:localStorage.getItem('mythwrought-v002-world-'+seed),newWorld:document.querySelectorAll('#newWorld').length,caveCreate:!!document.getElementById('caveCreateWorld'),glError:document.querySelector('#scene').getContext('webgl2').getError()};
  });
  check('empty-storage production startup uses combined profile',firstState.profile===latestProfile&&firstState.release===release&&Number.isInteger(firstState.seed)&&firstState.seed!==179&&firstState.active==='1'&&!!firstState.raw&&JSON.parse(firstState.raw).seed===firstState.seed&&firstState.ordinary===null&&firstState.newWorld===1&&!firstState.caveCreate&&firstState.glError===0&&firstErrors.length===0,{...firstState,firstErrors});
  await first.screenshot({path:path.join(out,'fresh-startup-956x440.png')});
 }finally{await empty.close();}
 evidence.finished=true;
}finally{await writeFile(path.join(out,'manifest.json'),JSON.stringify(evidence,null,2));await context?.close();await browser?.close();await new Promise(r=>server.close(r));}
