import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const dir='artifacts/snow-p1-release';
await mkdir(dir,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:956,height:440},deviceScaleFactor:1,isMobile:true,hasTouch:true,serviceWorkers:'allow'});
const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(String(e.message??e)));
page.on('dialog',d=>d.accept());
const profile='mythwrought-five-surface-regions-v7-snow-p1';
const seed=2026;
const waitGame=()=>page.waitForFunction(()=>window.__mythwroughtTest&&Number(document.querySelector('#scene').dataset.loadedChunks)>=25&&Number(document.querySelector('#scene').dataset.pendingChunks)===0,null,{timeout:120000});
const openMenu=async()=>{if(await page.locator('#help').evaluate(e=>e.hidden))await page.locator('#menu').click();};
const closeMenu=async()=>{if(!await page.locator('#help').evaluate(e=>e.hidden))await page.locator('#closeHelp').click();};
try{
 await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
 await waitGame();
 const original=await page.evaluate(()=>({seed:window.__mythwroughtTest.snapshot().seed,profile:window.__mythwroughtTest.fourBiomeProfile()}));
 assert.notEqual(original.seed,seed);
 await openMenu();
 await page.locator('#seedInput').fill(String(seed));
 await page.locator('#newSnowWorld').click();
 await page.waitForFunction(p=>window.__mythwroughtTest.fourBiomeProfile()?.generator===p,profile,{timeout:90000});
 await closeMenu();await waitGame();
 // Use genuine registered source and existing local regression camera only.
 // Actual DIG/PLACE buttons execute the production action+mesh+save path.
 const setup=await page.evaluate(async seed=>{
  const {FourRegionWorld,fourRegionProfile,SNOW_P1_GENERATOR}=await import('/src/manual-biomes/profile-world.mjs');
  const {collides}=await import('/src/voxel.mjs');
  const {inspectBlockTarget}=await import('/src/blocks.mjs');
  const w=new FourRegionWorld(seed,fourRegionProfile(seed,SNOW_P1_GENERATOR));
  const mine=[-44,11,499];
  if(w.get(...mine)!==407)throw Error('Accepted natural needle missing');
  function find(target,mode){
   for(const radius of [3,4,5])for(const [dx,dz] of [[0,1],[0,-1],[1,0],[-1,0],[1,1],[-1,-1],[1,-1],[-1,1]]){
    const x=target[0]+dx*radius,z=target[2]+dz*radius;
    for(let y=18;y>=3;y--){
     if(collides(w,x+.5,y+.01,z+.5)||!collides(w,x+.5,y-.055,z+.5))continue;
     const p={x:x+.5,z:z+.5,feet:y+.01},eye=[p.x,p.feet+1.55,p.z],direction=target.map((v,i)=>v+.5-eye[i]);
     const r=inspectBlockTarget(w,eye,direction,3,p);
     if(!r.hit?.every((v,i)=>v===target[i]))continue;
     if(mode==='mine'&&r.canMine)return {position:[x,y,z],aim:target,cell:r.hit};
     if(mode==='place'&&r.canPlace&&r.adjacent&&!r.adjacent.every((v,i)=>v===mine[i]))return {position:[x,y,z],aim:target,cell:r.adjacent};
    }
   }
  }
  const m=find(mine,'mine');if(!m)throw Error('No genuine reachable mining camera');
  w.set(...mine,0);
  let b;
  outer:for(let x=mine[0]-5;x<=mine[0]+5;x++)for(let z=mine[2]-5;z<=mine[2]+5;z++){
   const p=w._columnPlan(x,z),y=p.size?Math.max(...p.keys()):null;
   if(y===null)continue;
   b=find([x,y,z],'place');if(b)break outer;
  }
  if(!b)throw Error('No genuine reachable stone placement camera');
  return {mine:m,build:b};
 },seed);
 async function aim(c){
  await page.evaluate(c=>{const api=window.__mythwroughtTest;api.teleportCave(...c.position);api.aimAt(...c.aim);},c);
  await waitGame();
  await page.evaluate(c=>window.__mythwroughtTest.aimAt(...c.aim),c);
 }
 await aim(setup.mine);
 assert.equal(await page.evaluate(c=>window.__mythwroughtTest.block(...c),setup.mine.cell),407);
 await page.locator('#dig').click();
 await page.waitForFunction(c=>window.__mythwroughtTest.block(...c)===0,setup.mine.cell,{timeout:15000});
 await aim(setup.build);
 assert.equal(await page.evaluate(c=>window.__mythwroughtTest.block(...c),setup.build.cell),0);
 await page.locator('#place').click();
 await page.waitForFunction(c=>window.__mythwroughtTest.block(...c)===3,setup.build.cell,{timeout:15000});
 await page.waitForFunction(()=>{const c=document.querySelector('#scene');return Number(c.dataset.nonblockInstances)>0&&Number(c.dataset.mobSpecies)===40&&Number(c.dataset.mobTotal)>0;},null,{timeout:60000});
 const gameplay=await page.evaluate(()=>{const c=document.querySelector('#scene');return {mobs:window.__mythwroughtTest.mobStatus(),scenery:Number(c.dataset.nonblockInstances),mobActors:Number(c.dataset.mobActors),gl:c.getContext('webgl2')?.getParameter(c.getContext('webgl2').VERSION),loaded:Number(c.dataset.loadedChunks),pending:Number(c.dataset.pendingChunks)};});
 assert.ok(gameplay.gl?.includes('WebGL 2'));
 const png=await page.screenshot({path:dir+'/snow-p1-gameplay.png'});
 await openMenu();
 await page.locator('#seedInput').fill(String(seed));
 await page.locator('#newSnowWorld').click();
 await page.waitForFunction(()=>document.getElementById('seedMessage').textContent.includes('refused'));
 assert.equal(await page.evaluate(()=>window.__mythwroughtTest.fourBiomeProfile().generator),profile);
 await closeMenu();
 await page.evaluate(async()=>{await navigator.serviceWorker.ready;});
 await page.waitForFunction(()=>navigator.serviceWorker.controller!==null,null,{timeout:120000});
 const cached=await page.evaluate(async()=>{const names=await caches.keys(),name=names.find(n=>n.includes('snow-p1-v1')&&n.includes('m5-shell'));if(!name)throw Error('Snow shell missing');return {name,assets:(await (await caches.open(name)).keys()).length};});
 await context.setOffline(true);
 await page.reload({waitUntil:'domcontentloaded',timeout:90000});
 await waitGame();
 const reopened=await page.evaluate(({mine,build})=>({profile:window.__mythwroughtTest.fourBiomeProfile(),mine:window.__mythwroughtTest.block(...mine),build:window.__mythwroughtTest.block(...build),offline:navigator.onLine===false,controlled:Boolean(navigator.serviceWorker.controller)}),{mine:setup.mine.cell,build:setup.build.cell});
 assert.equal(reopened.profile.generator,profile);assert.equal(reopened.profile.seed,seed);
 assert.equal(reopened.mine,0);assert.equal(reopened.build,3);assert.equal(reopened.offline,true);assert.equal(reopened.controlled,true);
 assert.deepEqual(errors,[]);
 const report={original,setup,gameplay,cached,reopened,gameplayPngSha256:createHash('sha256').update(png).digest('hex'),pageErrors:errors,realIphoneAcceptance:false};
 console.log('SNOW_P1_ACTUAL_GAME_OFFLINE '+JSON.stringify(report));
 await writeFile(dir+'/report.json',JSON.stringify(report,null,2));
}finally{await browser.close()}
