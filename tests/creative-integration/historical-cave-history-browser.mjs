// Real historical cave owner, genuine original game UI, isolated local storage.
// Camera positioning uses the existing localhost fixture; edits use only UI.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {BLOCK,VoxelWorld,collides,raycast} from '../../src/voxel.mjs';
import {worldSlotKey,DEFAULT_WORLD_SEED,SELECTED_SEED_KEY} from '../../src/seeds.mjs';
import {saveWorldSafe} from '../../src/persistence.mjs';
import {caveProfileStorageKey} from '../../src/manual-caves/profile-store.mjs';
import {prepareExplicitCaveWorld,saveExplicitCaveWorld} from '../../src/manual-caves/game-startup-contract.mjs';
import {descentRoute} from '../../src/underground-switchback-descent.mjs';
const seed=2026,key=caveProfileStorageKey(seed),oldKey=worldSlotKey(seed),origin='http://127.0.0.1:4174';
const OUT='artifacts/historical-cave-history';await mkdir(OUT,{recursive:true});
const sha=s=>createHash('sha256').update(s).digest('hex');
const report={head:process.env.GITHUB_SHA??null,seed,complete:false,physicalIphone:false,errors:[],screenshots:[]};
const records=new Map(),storage={getItem:k=>records.get(k)??null,setItem:(k,v)=>records.set(k,String(v)),removeItem:k=>records.delete(k),key:i=>[...records.keys()][i]??null,get length(){return records.size;}};
// Pin an authentic existing ordinary world before the historical-load test.
 // Otherwise production startup can create a random isolated V8 world, which
 // intentionally prohibits historical Cave World selection in that session.
const ordinaryKey=worldSlotKey(DEFAULT_WORLD_SEED),ordinaryWorld=new VoxelWorld(DEFAULT_WORLD_SEED);
assert.ok(ordinaryWorld.set(0,17,0,BLOCK.STONE));
const ordinarySaved=saveWorldSafe(storage,ordinaryWorld);
assert.ok(ordinarySaved.ok,JSON.stringify(ordinarySaved));
assert.equal(storage.getItem(SELECTED_SEED_KEY),String(DEFAULT_WORLD_SEED));
const ordinaryRaw=storage.getItem(ordinaryKey);
const chosen=prepareExplicitCaveWorld(storage,seed,{action:'create',approved:true}),world=chosen.world;
const route=descentRoute();
let fixture=null;
for(const p of route.filter(p=>p.floor<=-75&&p.floor>=-85)){
 const pos=[p.x,p.feet,p.z],eye=[p.x+.5,p.feet+.01+1.55,p.z+.5];
 if(collides(world,p.x+.5,p.feet+.01,p.z+.5))continue;
 for(const q of route){
  const target=[q.x,q.feet+1,q.z],d=target.map((v,i)=>v+.5-eye[i]);
  if(Math.hypot(...d)<2||Math.hypot(...d)>4.5||world.get(...target)!==BLOCK.AIR)continue;
  if(!world.set(...target,BLOCK.STONE))continue;
  const hit=raycast(world,eye,d,6);
  if(hit?.hit.join(',')===target.join(',')&&!collides(world,p.x+.5,p.feet+.01,p.z+.5)){fixture={pos,target};break;}
  assert.ok(world.set(...target,BLOCK.AIR));
 }
 if(fixture)break;
}
assert.ok(fixture,'Need real supported deep cave camera and visible fixture voxel');
assert.ok(saveExplicitCaveWorld(storage,chosen,{approved:true}).ok);
const initial=world.save(),{pos,target}=fixture;assert.ok(world.set(...target,BLOCK.AIR));const mined=world.save();
const browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
const ctx=await browser.newContext({viewport:{width:956,height:440},hasTouch:true,isMobile:true,deviceScaleFactor:1,serviceWorkers:'block',storageState:{cookies:[],origins:[{origin,localStorage:[...records].map(([name,value])=>({name,value}))}]}});
const page=await ctx.newPage();page.on('pageerror',e=>report.errors.push(String(e)));page.on('dialog',d=>d.accept());
const btn=d=>page.locator('#creativeQuickbar [data-history="'+d+'"]');
const read=()=>page.evaluate(({key,oldKey,ordinaryKey,target})=>{const raw=localStorage.getItem(key),journal=localStorage.getItem(key+'.journal');return {id:window.__mythwroughtTest.block(...target),raw,journal,ordinary:localStorage.getItem(oldKey),otherWorld:localStorage.getItem(ordinaryKey),world:JSON.parse(JSON.parse(raw).raw).world};},{key,oldKey,ordinaryKey,target});
const state=async(expected,id)=>{const s=await read();assert.equal(s.id,id);assert.deepEqual(s.world,expected);assert.equal(s.ordinary,null);assert.equal(s.otherWorld,ordinaryRaw);assert.equal(s.journal,null);return s;};
async function load(){
 await page.goto(origin+'/?production-ui=1',{waitUntil:'domcontentloaded',timeout:120000});
 report.stage='ordinary-startup';
 await page.waitForFunction(seed=>window.__mythwroughtTest?.snapshot().seed===seed&&
  !window.__mythwroughtTest.caveMode().enabled&&Number(document.querySelector('#scene').dataset.loadedChunks)>=25&&
  document.querySelector('#notice').hidden,DEFAULT_WORLD_SEED,{timeout:90000});
 assert.equal(await page.evaluate(()=>window.__mythwroughtTest.fourBiomeMode()),'legacy');
 report.stage='historical-load';
 await page.locator('#menu').click();
 await page.evaluate(seed=>{document.getElementById('advancedMenu').open=true;const input=document.getElementById('seedInput');input.value=String(seed);document.getElementById('caveLoadWorld').click();},seed);
 await page.waitForFunction(seed=>window.__mythwroughtTest.caveMode().enabled&&window.__mythwroughtTest.caveMode().seed===seed,seed,{timeout:90000});
 await page.locator('#closeHelp').click();
 report.stage='deep-region';
 await page.evaluate(({pos,target})=>{const t=window.__mythwroughtTest;t.teleportCave(...pos);t.aimAt(...target);},fixture);
 await page.waitForFunction(({pos})=>{const c=document.querySelector('#scene');return Number(c.dataset.pendingChunks)===0&&Number(c.dataset.loadedChunks)>10&&Math.abs(Number(c.dataset.playerFeet)-pos[1])<.2&&c.dataset.playerColliding==='false';},fixture,{timeout:120000});
}
async function shot(name){const b=await page.screenshot({path:OUT+'/'+name+'.png'});report.screenshots.push({name:name+'.png',sha256:sha(b),bytes:b.length});}
try{
 await load();await state(initial,BLOCK.STONE);
 report.stage='mine-undo-redo';
 await page.locator('#g2bFlightEnable').check();await page.waitForFunction(()=>!document.querySelector('#creativeQuickbar').hidden);
 await page.waitForFunction(t=>document.querySelector('#scene').dataset.targetBlock===t.join(','),target,{timeout:90000});
 await page.locator('#dig').tap();await state(mined,BLOCK.AIR);assert.equal(await btn('undo').isEnabled(),true);
 await btn('undo').tap();await state(initial,BLOCK.STONE);
 await btn('redo').tap();await state(mined,BLOCK.AIR);await shot('cave-redone');
 // Cold load the successfully restored block; session history must reset.
 await btn('undo').tap();await state(initial,BLOCK.STONE);
 await load();await state(initial,BLOCK.STONE);assert.equal(await page.locator('#creativeQuickbar').isVisible(),false);
 await page.locator('#g2bFlightEnable').check();await page.waitForFunction(()=>!document.querySelector('#creativeQuickbar').hidden);
 assert.equal(await btn('undo').isEnabled(),false);
 await page.waitForFunction(t=>document.querySelector('#scene').dataset.targetBlock===t.join(','),target,{timeout:90000});
 await page.locator('#dig').tap();const beforeFault=await state(mined,BLOCK.AIR);
 // Fault at the genuine primary write, after the cave owner commits its
 // recoverable journal. The actual history button must fail closed.
 await page.evaluate(key=>{const original=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k===key)throw Error('Injected cave primary refusal');return original.call(this,k,v);};},key);
 await btn('undo').tap();
 const failed=await read();assert.equal(failed.raw,beforeFault.raw);assert.ok(failed.journal);
 assert.deepEqual(JSON.parse(JSON.parse(failed.journal).raw).world,initial);
 assert.equal(await btn('undo').isEnabled(),false);assert.equal(await btn('redo').isEnabled(),false);
 await page.locator('#dig').tap();const protectedState=await read();
 assert.equal(protectedState.raw,failed.raw);assert.equal(protectedState.journal,failed.journal);
 // Reopening via the actual historical load selector must recover the
 // pending transaction without inventing an ordinary-world save.
 await load();const recovered=await read();assert.equal(recovered.id,BLOCK.STONE);
 assert.equal(recovered.raw,failed.raw);assert.equal(recovered.journal,failed.journal);assert.equal(recovered.ordinary,null);assert.equal(recovered.otherWorld,ordinaryRaw);
 assert.equal(await page.locator('#creativeQuickbar').isVisible(),false);
 report.complete=true;report.fixture=fixture;report.coldReload=true;report.primaryFaultRecovered=true;report.initialSHA256=sha(JSON.stringify(initial));report.minedSHA256=sha(JSON.stringify(mined));
 assert.deepEqual(report.errors,[]);
}catch(e){report.errors.push(String(e.stack??e));report.complete=false;process.exitCode=1;
 report.failure=await page.evaluate(()=>({notice:document.querySelector('#notice')?.textContent,noticeHidden:document.querySelector('#notice')?.hidden,status:document.querySelector('#status')?.textContent,caveStatus:document.querySelector('#caveWorldStatus')?.textContent,scene:{...document.querySelector('#scene')?.dataset},cave:window.__mythwroughtTest?.caveMode(),seed:window.__mythwroughtTest?.snapshot().seed})).catch(()=>null);
 await shot('failure').catch(()=>{});
}
finally{await writeFile(OUT+'/manifest.json',JSON.stringify(report,null,2)+'\n');console.log('HISTORICAL_CAVE_HISTORY '+JSON.stringify(report));await ctx.close();await browser.close();}
