// Targeted original-game Creative history acceptance. Source-generated saved
// fixtures and local camera positioning only; all edits/replay use actual UI.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {VoxelWorld,collides,raycast,BLOCK} from '../../src/voxel.mjs';
import {Pack2LiveWorld,pack2StorageKey} from '../../src/pack2-world.mjs';
import {FourRegionWorld,fourRegionProfile,M2_FOUR_REGION_GENERATOR,M7_ENVIRONMENT_GENERATOR,ENCHANTED_P2_GENERATOR,SNOW_P1_GENERATOR} from '../../src/manual-biomes/profile-world.mjs';
import {mountainV8Storage,V8_ACTIVE_KEY,V8_STORAGE_PREFIX} from '../../src/manual-biomes/mountain-v8-isolated-storage.mjs';
import {saveM2World,openM2World,planM2WorldChoice} from '../../src/manual-biomes/m2-runtime-bridge.mjs';
import {BIOME_PROFILE_SUFFIX} from '../../src/manual-biomes/profile-storage.mjs';
import {saveFingerprint} from '../../src/persistence.mjs';
import {worldSlotKey} from '../../src/seeds.mjs';
const seed=179,key=worldSlotKey(seed),profileKey=key+BIOME_PROFILE_SUFFIX;
const OUT='artifacts/creative-single-profile-history';await mkdir(OUT,{recursive:true});
const sha=s=>createHash('sha256').update(s).digest('hex');
const report={head:process.env.GITHUB_SHA??null,sourceFixtureSeed:seed,tests:{},screenshots:[],errors:[],complete:false,physicalIphone:false};
const persist=()=>writeFile(OUT+'/manifest.json',JSON.stringify(report,null,2)+'\n');
function memory(){
 const m=new Map();return {get length(){return m.size;},key:i=>[...m.keys()][i]??null,getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k),entries:()=>[...m]};
}
const generators=[M2_FOUR_REGION_GENERATOR,M7_ENVIRONMENT_GENERATOR,ENCHANTED_P2_GENERATOR,SNOW_P1_GENERATOR];
function fixture(generator){
 const raw=memory(),storage=raw,profile=fourRegionProfile(seed,generator);
 const base=new FourRegionWorld(seed,profile),world=new Pack2LiveWorld(base);
 const p=JSON.stringify(profile),rec=JSON.stringify({version:1,checksum:saveFingerprint(p),raw:p});
 storage.setItem(profileKey,rec);storage.setItem(profileKey+'-journal',rec);
 assert.equal(base.hasHistoricalXericCascade(),false);
 for(let x=15;x<=17;x++)for(let z=-1;z<=3;z++)for(let y=16;y<=19;y++)
  if(world.get(x,y,z)!==0)assert.ok(world.set(x,y,z,0));
 assert.ok(world.set(16,15,0,BLOCK.STONE));assert.ok(world.set(16,17,3,BLOCK.STONE));
 const saved=saveM2World(storage,world);assert.ok(saved.ok,JSON.stringify(saved));
 assert.deepEqual(openM2World(storage,planM2WorldChoice(String(seed))).world.save(),world.save());
 return {raw,storage,world,prefix:''};
}
const url='http://127.0.0.1:4174/?production-ui=1';
const browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
async function open(f){
 const ctx=await browser.newContext({viewport:{width:956,height:440},hasTouch:true,isMobile:true,deviceScaleFactor:1,serviceWorkers:'block',
  storageState:{cookies:[],origins:[{origin:'http://127.0.0.1:4174',localStorage:f.raw.entries().map(([name,value])=>({name,value}))}]}});
 const page=await ctx.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(String(e)));page.on('dialog',d=>d.accept());
 await page.goto(url,{waitUntil:'domcontentloaded',timeout:120000});await ready(page);
 return {ctx,page,errors};
}
async function ready(page){
 await page.waitForFunction(()=>window.__mythwroughtTest?.snapshot().seed===179&&
  Number(document.querySelector('#scene')?.dataset.loadedChunks)>=25&&
  Number(document.querySelector('#scene')?.dataset.pendingChunks)===0&&document.querySelector('#notice').hidden,
  null,{timeout:180000});
}
const btn=(p,d)=>p.locator('#creativeQuickbar [data-history="'+d+'"]');
async function read(page,f,cells){
 return page.evaluate(({prefix,key,profileKey,pack2,cells})=>{
  const t=window.__mythwroughtTest,s=t.snapshot();
  return {ids:cells.map(c=>t.block(...c)),raw:localStorage.getItem(prefix+key),profile:localStorage.getItem(prefix+profileKey),
   pack2:localStorage.getItem(prefix+pack2),batches:s.editMeshBatches,graphics:s.graphics,gpuRetry:s.gpuRetry};
 },{prefix:f.prefix,key,profileKey,pack2:pack2StorageKey(seed),cells});
}
function assertState(actual,expected,ids,original){
 assert.deepEqual(actual.ids,ids);assert.equal(actual.raw,expected);
 assert.equal(actual.profile,original.profile);assert.equal(actual.pack2,original.pack2);
 assert.equal(actual.graphics.lost,false);assert.equal(actual.gpuRetry.failures,0);
}
async function shot(page,name){
 const bytes=await page.screenshot({path:OUT+'/'+name+'.png'});report.screenshots.push({name:name+'.png',sha256:sha(bytes),bytes:bytes.length});await persist();
}
async function camera(page,pose,target,placement=false){
 await page.evaluate(({pose,target})=>{const t=window.__mythwroughtTest;t.teleportCave(...pose);t.aimAt(...target);},{pose,target});
 await page.waitForFunction(({target,placement})=>{
  const c=document.querySelector('#scene');
  return c.dataset[placement?'targetPlace':'targetBlock']===target.join(',')&&
   Number(c.dataset.pendingChunks)===0&&c.dataset.playerGrounded==='true'&&c.dataset.playerColliding==='false';
 },{target:placement?[target[0],target[1]+1,target[2]]:target,placement},{timeout:90000});
}
async function enable(page){
 await page.locator('#g2bFlightEnable').check();
 await page.waitForFunction(()=>!document.querySelector('#creativeQuickbar').hidden);
}
async function choose(page,id){
 await page.locator('#creativeInventoryToggle').click();await page.locator('.mw-inventory-search').fill('block:'+id);
 await page.locator('.mw-inventory-item[data-key="block:'+id+'"]').click();await page.locator('.mw-inventory-close').click();
 assert.equal(await page.locator('#creativeQuickbar .mw-inventory-slot[aria-current="true"]').getAttribute('data-key'),'block:'+id);
}
async function reopen(page){
 await page.reload({waitUntil:'domcontentloaded',timeout:120000});await ready(page);
 assert.equal(await page.locator('#creativeQuickbar').isVisible(),false);
}
async function singleProfile(generator){
 const f=fixture(generator),{ctx,page,errors}=await open(f);const cell=[16,16,0],cells=[cell];
 const label=generator;
 try{
  assert.equal(await page.evaluate(()=>window.__mythwroughtTest.fourBiomeProfile()?.generator),generator);
  await enable(page);await choose(page,4);await camera(page,[16,18,3],[16,15,0],true);
  const before=await read(page,f,cells);assert.deepEqual(before.ids,[0]);assert.equal(before.raw,JSON.stringify(f.world.save()));
  assert.ok(f.world.set(...cell,4));const placed=JSON.stringify(f.world.save());
  await page.locator('#place').tap();assertState(await read(page,f,cells),placed,[4],before);
  assert.equal(await btn(page,'undo').isEnabled(),true);
  await btn(page,'undo').tap();assertState(await read(page,f,cells),before.raw,[0],before);
  await btn(page,'redo').tap();assertState(await read(page,f,cells),placed,[4],before);
  await shot(page,label+'-redone');await reopen(page);assertState(await read(page,f,cells),placed,[4],before);
  assert.deepEqual(errors,[]);report.tests[generator]={complete:true,seed,cell,beforeSHA256:sha(before.raw),placedSHA256:sha(placed),coldReload:true};await persist();
 }finally{await ctx.close();}
}
try{
 for(const name of generators)try{await singleProfile(name);}catch(e){report.errors.push({name,error:String(e.stack??e)});await persist();}
 report.complete=report.errors.length===0&&generators.every(g=>report.tests[g]?.complete);
 console.log('CREATIVE SOURCE VOXEL HISTORY '+JSON.stringify(report));
 if(!report.complete)process.exitCode=1;
}finally{await persist();await browser.close();}
