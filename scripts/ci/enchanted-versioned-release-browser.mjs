// Single finite release-delta acceptance. Real prior-production -> candidate
// service worker upgrade, explicit new version, real edit and cold offline boot.
// No original-route retests, screenshot duplicates or source-response rewriting.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR,ENCHANTED_P2_GENERATOR} from '../../src/manual-biomes/profile-world.mjs';
import {M2_WORLD_MODE,planM2WorldChoice,openM2World,saveM2World} from '../../src/manual-biomes/m2-runtime-bridge.mjs';
import {worldSlotKey} from '../../src/seeds.mjs';
import {BLOCK,chunkCoord} from '../../src/voxel.mjs';
const root=process.cwd(),previous=path.resolve(process.env.ENCHANTED_PREVIOUS_ROOT);
const out=path.join(root,'artifacts/enchanted-versioned-release');
await mkdir(out,{recursive:true});
const OLD='mythwrought-m5-shell-20261123-desert-p3-v1',NEW='mythwrought-m5-shell-20261124-enchanted-p2-v1';
async function shellCount(base){
 const source=await readFile(path.join(base,'sw-m5.js'),'utf8');
 const paths=[...source.match(/const SOURCE_ASSETS=\[([\s\S]*?)\];/)[1].matchAll(/^\s*"([.]\/[^"]*)",?$/gm)].map(m=>m[1]);
 return new Set(paths.map(p=>new URL(p,'http://localhost/').href)).size;
}
const counts={[OLD]:await shellCount(previous),[NEW]:await shellCount(root)};
const seed=179,oldSeed=7,oldPrefix=worldSlotKey(oldSeed),prefix=worldSlotKey(seed);
const map=new Map(),storage={get length(){return map.size;},key:i=>[...map.keys()][i]??null,
 getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,String(v)),removeItem:k=>map.delete(k)};
const old=openM2World(storage,planM2WorldChoice(String(oldSeed),M2_WORLD_MODE.CREATE_ENVIRONMENT_V7,{confirmed:true}));
assert.equal(saveM2World(storage,old.world).ok,true);
const fixture=[...map],protectedBytes=fixture.filter(([k])=>k.startsWith(oldPrefix)).sort((a,b)=>a[0].localeCompare(b[0]));
const historic=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
const forest=new FourRegionWorld(seed,fourRegionProfile(seed,ENCHANTED_P2_GENERATOR));
forest._environmentTreeAt(-48,19,-528);
const witness=[...forest._environmentTreeChunks.get('-3,-33')].find(([k,id])=>{
 const p=k.split(',').map(Number);return forest.get(...p)===id&&historic.get(...p)!==id;
});
assert.ok(witness);
const cell=witness[0].split(',').map(Number),id=witness[1];
const mime={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css',
 '.json':'application/json','.png':'image/png','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'};
let serving=previous,requests=0,offline=false;const afterCutoff=[];
const server=createServer(async(req,res)=>{
 ++requests;if(offline)afterCutoff.push(req.url);
 try{
  const uri=new URL(req.url,'http://127.0.0.1'),rel=decodeURIComponent(uri.pathname);
  const base=serving,absolute=path.resolve(base,'.'+rel);
  if(absolute!==base&&!absolute.startsWith(base+path.sep))throw Error('outside checkout');
  const file=absolute===base?path.join(base,'index.html'):absolute;
  const bytes=await readFile(file);
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream',
   'Cache-Control':rel==='/sw-m5.js'?'public,max-age=300':'no-store',
   'X-MW-Source':base===root?'candidate':'historical'});
  res.end(bytes);
 }catch(e){res.writeHead(404);res.end(String(e));}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin='http://127.0.0.1:'+server.address().port;
const report={head:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),
 previousHead:execFileSync('git',['-C',previous,'rev-parse','HEAD'],{encoding:'utf8'}).trim(),
 generator:ENCHANTED_P2_GENERATOR,cell,id,checks:[],errors:[],workerErrors:[],physicalIphone:false,
 actualOriginalGame:true,sourceRewrite:false,desktopChromiumSwiftShader:true};
let browser,ctx;
const check=(name,info)=>{report.checks.push({name,...info});console.log('ENCHANTED VERSION BROWSER '+name+' '+JSON.stringify(info));};
try{
 browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox','--no-sandbox']});
 ctx=await browser.newContext({viewport:{width:932,height:430},deviceScaleFactor:1,isMobile:true,hasTouch:true,serviceWorkers:'allow'});
 await ctx.addInitScript(({fixture})=>{
  if(localStorage.getItem('mythwrought-v002-selected-seed')===null)
   for(const [k,v] of fixture)localStorage.setItem(k,v);
 },{fixture});
 ctx.on('serviceworker',w=>w.on('console',m=>{if(m.type()==='error')report.workerErrors.push(m.text());}));
 const page=await ctx.newPage();
 page.on('pageerror',e=>report.errors.push(e.message));page.on('dialog',d=>d.accept());
 const readSlot=p=>page.evaluate(p=>Object.keys(localStorage).filter(k=>k.startsWith(p)).sort((a,b)=>a.localeCompare(b)).map(k=>[k,localStorage.getItem(k)]),p);
 const waitProfile=(seed,generator)=>page.waitForFunction(({seed,generator})=>
  window.__mythwroughtTest?.snapshot()?.seed===seed&&window.__mythwroughtTest?.fourBiomeProfile()?.generator===generator,
  {seed,generator},{timeout:90000});
 async function cacheReady(name){
  const deadline=Date.now()+150000;
  while(Date.now()<deadline){
   const status=await page.evaluate(async ({name,count})=>{
    if(!navigator.serviceWorker.controller||!(await caches.keys()).includes(name))return null;
    const c=await caches.open(name),keys=await c.keys();
    const index=await c.match(new URL('/index.html',location.href).href);
    return keys.length===count&&index?{keys:keys.map(x=>x.url),source:index.headers.get('X-MW-Source')}:null;
   },{name,count:counts[name]});
   if(status)return status;await page.waitForTimeout(350);
  }
  throw Error('Worker cache did not become complete '+name);
 }
 await page.goto(origin+'/',{waitUntil:'domcontentloaded',timeout:90000});
 await waitProfile(oldSeed,M7_ENVIRONMENT_GENERATOR);
 const oldCache=await cacheReady(OLD);
 assert.equal(oldCache.source,'historical');assert.deepEqual(await readSlot(oldPrefix),protectedBytes);
 check('actual-prior-production-worker',{assets:oldCache.keys.length,oldBytesUnchanged:true});
 // Install genuine new shell over old controlling worker. The older worker
 // must not be able to supply stale bytes to the fresh query install.
 serving=root;
 await page.evaluate(async()=>{window.__forestControllerChanged=false;navigator.serviceWorker.addEventListener('controllerchange',()=>{window.__forestControllerChanged=true;},{once:true});const reg=await navigator.serviceWorker.getRegistration('/');if(!reg)throw Error('Missing prior worker');await reg.update();});
 const nextCache=await cacheReady(NEW);
 assert.equal(nextCache.source,'candidate');
 const required=['enchanted-tree-candidates','enchanted-tree-footings','enchanted-tree-overlap',
  'enchanted-tree-site-biome-cache','enchanted-tree-source-cache','enchanted-tree-walking-clearance'];
 for(const file of required)assert.ok(nextCache.keys.some(url=>url.endsWith('/src/manual-biomes/'+file+'.mjs')),file);
 assert.ok(await page.evaluate(async old=>(await caches.keys()).includes(old),OLD));
 // Wait for the new worker's actual control and verified candidate HTML.
 await page.waitForFunction(()=>window.__forestControllerChanged===true&&navigator.serviceWorker.controller?.state==='activated',null,{timeout:90000});
 const response=await page.reload({waitUntil:'domcontentloaded',timeout:90000});
 assert.equal(response.headers()['x-mw-source'],'candidate');
 await waitProfile(oldSeed,M7_ENVIRONMENT_GENERATOR);
 assert.deepEqual(await readSlot(oldPrefix),protectedBytes);
 check('real-worker-upgrade',{newAssets:nextCache.keys.length,oldAssets:oldCache.keys.length,requiredModules:required.length,historicalBytesUnchanged:true});
 if(await page.locator('#closeHelp').isVisible())await page.locator('#closeHelp').click();
 await page.locator('#menu').click();await page.locator('#seedInput').fill(String(seed));
 await page.locator('#createEnchantedP2World').click();
 await waitProfile(seed,ENCHANTED_P2_GENERATOR);
 if(await page.locator('#closeHelp').isVisible())await page.locator('#closeHelp').click();
 assert.deepEqual(await readSlot(oldPrefix),protectedBytes);
 const position=await page.evaluate(()=>{const a=window.__mythwroughtTest,pos=a.teleport(-49,-540);a.aimAt(-38,13,-525);return pos;});
 const center=chunkCoord(position.x)+','+chunkCoord(position.z);
 async function live(){
  await page.waitForFunction(center=>{const d=document.querySelector('#scene').dataset;
   return d.chunkCenter===center&&Number(d.loadedChunks)===25&&Number(d.pendingChunks)===0&&Number(d.renderedMeshVertices)>0;
  },center,{timeout:150000});
  const row=await page.evaluate(()=>{const a=window.__mythwroughtTest,c=document.querySelector('#scene'),d=c.dataset,gl=c.getContext('webgl2');
   return {webgl2:!!gl,lost:gl.isContextLost(),gpuFaults:a.gpuUploadFaults(),graphics:a.snapshot().graphics,
    loaded:Number(d.loadedChunks),scenery:Number(d.nonblockInstances),sceneryBytes:Number(d.nonblockGpuBytes),
    biome:d.skyS6WorldBiomeName,scene:d.nonblockSaveState,vertices:Number(d.renderedMeshVertices)};});
  assert.equal(row.webgl2,true);assert.equal(row.lost,false);assert.deepEqual(row.gpuFaults,[]);
  assert.equal(row.graphics.shaderReady,true);assert.equal(row.loaded,25);assert.equal(row.biome,'enchanted');
  assert.equal(row.scene,'ready');assert.ok(row.scenery>0&&row.sceneryBytes>0);
  return row;
 }
 const online=await live();
 assert.equal(await page.evaluate(p=>window.__mythwroughtTest.block(...p),cell),id);
 await page.evaluate(p=>window.__mythwroughtTest.placeFixture(...p,0),cell);
 assert.equal(await page.evaluate(p=>window.__mythwroughtTest.block(...p),cell),BLOCK.AIR);
 const saved=await readSlot(prefix),raw=saved.find(([k])=>k===prefix)?.[1];
 assert.ok(JSON.parse(raw).edits.some(row=>JSON.stringify(row)===JSON.stringify([...cell,0])));
 check('explicit-new-version-real-game-save',{online,cell,id,editSaved:true});
 const cutoff=requests;offline=true;await ctx.setOffline(true);
 await page.reload({waitUntil:'domcontentloaded',timeout:90000});await waitProfile(seed,ENCHANTED_P2_GENERATOR);
 assert.equal(await page.evaluate(()=>navigator.onLine),false);
 if(await page.locator('#closeHelp').isVisible())await page.locator('#closeHelp').click();
 const offlinePosition=await page.evaluate(()=>{const a=window.__mythwroughtTest,pos=a.teleport(-49,-540);a.aimAt(-38,13,-525);return pos;});
 assert.equal(chunkCoord(offlinePosition.x)+','+chunkCoord(offlinePosition.z),center);
 const off=await live();
 assert.equal(await page.evaluate(p=>window.__mythwroughtTest.block(...p),cell),BLOCK.AIR);
 assert.deepEqual(await readSlot(prefix),saved);assert.deepEqual(await readSlot(oldPrefix),protectedBytes);
 assert.equal(requests,cutoff,'Unexpected origin requests after offline cutoff');
 assert.deepEqual(report.errors,[]);assert.deepEqual(report.workerErrors,[]);
 check('cold-offline-versioned-reopen',{offline:off,editedTreeStillAir:true,versionedBytesUnchanged:true,historicalBytesUnchanged:true,originRequestsAfterCutoff:requests-cutoff});
 report.success=true;
}catch(e){report.error=String(e);report.stack=e.stack;throw e;}
finally{report.afterCutoffRequests=afterCutoff;await writeFile(path.join(out,'manifest.json'),JSON.stringify(report,null,2)+'\n');if(ctx)await ctx.close();if(browser)await browser.close();await new Promise(r=>server.close(r));}
