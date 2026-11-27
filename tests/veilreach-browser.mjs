import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {join} from 'node:path';
import {chromium} from 'playwright';
import {createSkylands} from '../src/veilreach/generation.mjs';
import {VEILREACH_GENERATOR} from '../src/environment-ground.mjs';
import {GAME_RELEASE} from '../src/app-update.mjs';

const origin=process.env.VEILREACH_ORIGIN??'http://127.0.0.1:4211/';
const out=process.env.VEILREACH_EVIDENCE??'artifacts/veilreach';
const seed=180;
const oldKey='mythwrought-v002-world-179';
const oldSave=JSON.stringify({schema:1,seed:179,edits:[[42,64,-42,3]]});
const terrain=createSkylands(seed),crown=terrain.region(0,0)[0];
const top=terrain.topAt(crown.x,crown.z);
const viewport={width:956,height:440};
const browser=await chromium.launch({args:['--enable-webgl','--use-gl=angle',
  '--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
await mkdir(out,{recursive:true});
const context=await browser.newContext({viewport,hasTouch:true,isMobile:true,deviceScaleFactor:1});
const page=await context.newPage();
page.setDefaultTimeout(20000);
const report={revision:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),
  seed,crown,viewport,checks:{},errors:[]};
const accept=(name,value)=>{report.checks[name]=value;console.log(name,JSON.stringify(value));};
const wait=(fn,arg,timeout=120000)=>page.waitForFunction(fn,arg,{timeout,polling:80});
const flight=()=>page.evaluate(()=>window.__mythwroughtTest.flightInfo());
const snapshot=()=>page.evaluate(()=>window.__mythwroughtTest.snapshot());
const stats=()=>page.locator('#scene').evaluate(({dataset:d})=>({
  chunks:Number(d.loadedChunks),distanceVertices:Number(d.veilreachDistanceVertices),
  upperVertices:Number(d.upperMeshVertices),upperBytes:Number(d.upperGpuBytes),
  upperOwners:Number(d.upperGpuOwners),daylight:Number(d.skyDaylight),
  ambient:d.skyAmbient,moons:Number(d.skyMoonCount)
}));
const aim=(x,y,z)=>page.evaluate(args=>window.__mythwroughtTest.aimAt(...args),[x,y,z]);
const shot=name=>page.screenshot({path:join(out,name)});
const start=()=>wait(()=>Boolean(window.__mythwroughtTest)&&
  Number(document.querySelector('#scene').dataset.loadedChunks)>15);
const openMenu=()=>page.locator('#menu').click();
const closeMenu=()=>page.locator('#closeHelp').click();
const hold=async(key,condition,arg)=>{
  await page.keyboard.down(key);
  try{await wait(condition,arg);}finally{await page.keyboard.up(key);}
};
page.on('pageerror',e=>{console.error(e);report.errors.push(e.message);});
page.on('dialog',d=>d.accept());
try{
  await page.addInitScript(({key,save,seed})=>{
    if(localStorage.getItem(key)===null)localStorage.setItem(key,save);
    // Supply a repeatable random seed to the actual NEW WORLD pathway.
    const get=crypto.getRandomValues.bind(crypto);
    crypto.getRandomValues=array=>{
      if(array instanceof Int32Array&&array.length===1){array[0]=seed;return array;}
      return get(array);
    };
  },{key:oldKey,save:oldSave,seed});
  await page.goto(new URL('?production-ui=1',origin).href,{waitUntil:'domcontentloaded'});
  await start();
  await openMenu();
  await page.locator('#skySetDay').click();
  await closeMenu();
  await wait(()=>Number(document.querySelector('#scene').dataset.skyDaylight)===1);
  const legacy=await stats();
  assert.equal(legacy.distanceVertices,0);
  await openMenu();
  await page.locator('#newWorld').click();
  await wait(g=>window.__mythwroughtTest?.fourBiomeProfile()?.generator===g,VEILREACH_GENERATOR);
  await start();
  const oldAfterAdmission=await page.evaluate(key=>localStorage.getItem(key),oldKey);
  assert.equal(oldAfterAdmission,oldSave);
  accept('normalNewWorld',{profile:await page.evaluate(()=>window.__mythwroughtTest.fourBiomeProfile()),
    historicalSaveUnchanged:true});
  await openMenu();
  await page.locator('#skySetDay').click();
  await closeMenu();
  await page.locator('#g2bFlightEnable').check();
  await aim(crown.x,crown.y-15,crown.z);
  await wait(()=>Number(document.querySelector('#scene').dataset.veilreachDistanceVertices)>0&&
    Number(document.querySelector('#scene').dataset.skyDaylight)===1&&
    window.__mythwroughtTest.flightInfo().resident);
  const ground=await stats();
  assert.equal(ground.daylight,legacy.daylight);
  assert.equal(ground.ambient,legacy.ambient);
  assert.equal(ground.moons,3);
  assert.equal(ground.upperBytes,0);
  accept('ground',ground);
  await shot('01-distant.png');

  const cdp=await context.newCDPSession(page);
  const doubleTap=async()=>{
    const b=await page.locator('#jump').boundingBox(),t=Date.now()/1000;
    for(let i=0;i<2;i++){
      await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',
        touchPoints:[{x:b.x+b.width/2,y:b.y+b.height/2,id:i+1}],timestamp:t+i*.3});
      await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[],timestamp:t+i*.3+.075});
    }
  };
  await doubleTap();
  await wait(()=>window.__mythwroughtTest.flightInfo().active);
  await page.locator('#scene').focus();
  const flyTo=async(x,z,y)=>{
    await aim(x,y,z);
    await hold('w',([x,z])=>{
      const p=window.__mythwroughtTest.flightInfo().position;
      return Math.hypot(p.x-x,p.z-z)<.72;
    },[x+.5,z+.5]);
  };
  await hold('e',height=>window.__mythwroughtTest.flightInfo().position.y>=height,77);
  await flyTo(42,28,77);
  await aim(crown.x,103,crown.z);
  await wait(()=>Number(document.querySelector('#scene').dataset.upperMeshVertices)>0);
  accept('underside',{position:(await flight()).position,...await stats()});
  await shot('02-underside.png');
  await flyTo(0,0,77);
  await hold('e',height=>window.__mythwroughtTest.flightInfo().position.y>=height,top+11);
  accept('ascent',await flight());
  await flyTo(crown.x,crown.z,top);
  await wait(()=>window.__mythwroughtTest.flightInfo().resident&&
    Number(document.querySelector('#scene').dataset.upperMeshVertices)>0);
  const approach=await stats();
  assert.ok(approach.chunks<=25&&approach.upperOwners<=8&&approach.upperBytes<=7077888);
  accept('approach',{position:(await flight()).position,...approach});
  await aim(crown.x+4,top-4,crown.z+3);
  await shot('03-close-range.png');

  await doubleTap();
  await wait(()=>!window.__mythwroughtTest.flightInfo().active&&window.__mythwroughtTest.m5ObservedPose().onGround);
  const landing=(await flight()).position;
  assert.ok(landing.y>100);
  await page.locator('#scene').focus();
  await aim(crown.x+4,landing.y,crown.z);
  await hold('w',p=>{
    const n=window.__mythwroughtTest.flightInfo().position;
    return Math.hypot(p.x-n.x,p.z-n.z)>.65;
  },landing);
  const standing=(await flight()).position;
  accept('landAndWalk',{landing,standing});
  await aim(crown.x-12,top+1,crown.z-14);
  await shot('04-surface.png');

  const target=()=>page.evaluate(()=>window.__mythwroughtTest.heightTarget());
  const chooseTarget=async(placing,excluded=null)=>{
    const {x,y,z}=(await flight()).position;
    for(const [dx,dz] of [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]]){
      const tx=Math.floor(x)+dx,tz=Math.floor(z)+dz;
      const floor=terrain.topAt(tx,tz)??Math.floor(y)-1;
      for(const ty of [floor,floor-1,floor+1]){
        await aim(tx,ty,tz);
        const result=await target();
        if(placing&&result.canPlace&&result.adjacent[1]>100&&
          result.adjacent.join(',')!==excluded.join(','))return result;
        if(!placing&&result.canMine&&result.hit[1]>100&&
          Math.hypot(result.hit[0]+.5-x,result.hit[2]+.5-z)>1.1)return result;
      }
    }
    throw Error('No reachable '+(placing?'placement':'mining')+' target at current stance');
  };
  const before=await chooseTarget(false);
  await page.locator('#dig').tap();
  await wait(hit=>window.__mythwroughtTest.block(...hit)===0,before.hit);
  accept('mined',{cell:before.hit});
  const placement=await chooseTarget(true,before.hit);
  await page.locator('#place').tap();
  await wait(hit=>window.__mythwroughtTest.block(...hit)===3,placement.adjacent);
  const edited=await snapshot();
  assert.ok(edited.lastEditMeshKeys.some(k=>k.startsWith('sky:')));
  accept('minedAndPlaced',{removed:before.hit,placed:placement.adjacent,owners:edited.lastEditMeshKeys});
  await shot('05-edited-crown.png');

  const hasLossExtension=await page.evaluate(()=>{
    const gl=document.querySelector('#scene').getContext('webgl2');
    const extension=gl.getExtension('WEBGL_lose_context');
    if(!extension)return false;
    window.__veilreachContextLoss=extension;
    extension.loseContext();
    return true;
  });
  assert.ok(hasLossExtension);
  await wait(()=>window.__mythwroughtTest.snapshot().graphics.lost);
  await page.evaluate(()=>window.__veilreachContextLoss.restoreContext());
  await wait(()=>window.__mythwroughtTest.snapshot().graphics.restoredCount>0&&
    Number(document.querySelector('#scene').dataset.upperMeshVertices)>0);
  assert.equal(await page.evaluate(cell=>window.__mythwroughtTest.block(...cell),before.hit),0);
  accept('contextRestored',await stats());

  await page.reload({waitUntil:'domcontentloaded'});
  await start();
  const verifyEdits=()=>page.evaluate(([removed,placed])=>
    [window.__mythwroughtTest.block(...removed),window.__mythwroughtTest.block(...placed)],
    [before.hit,placement.adjacent]);
  assert.deepEqual(await verifyEdits(),[0,3]);
  assert.equal(await page.evaluate(key=>localStorage.getItem(key),oldKey),oldSave);
  accept('reload',{edits:await verifyEdits(),historicalSaveUnchanged:true});
  await wait(()=>navigator.serviceWorker.controller!==null);
  const cached=await page.evaluate(async release=>{
    const cache=await caches.open('mythwrought-m5-shell-'+release);
    return (await cache.keys()).map(r=>new URL(r.url).pathname);
  },GAME_RELEASE);
  for(const name of ['distance','source','generation','flora'])assert.ok(cached.includes('/src/veilreach/'+name+'.mjs'));
  await context.setOffline(true);
  await page.reload({waitUntil:'domcontentloaded'});
  await start();
  assert.deepEqual(await verifyEdits(),[0,3]);
  await wait(()=>Number(document.querySelector('#scene').dataset.veilreachDistanceVertices)>0);
  accept('offlineColdBoot',{assets:cached.length,edits:await verifyEdits()});
  assert.deepEqual(report.errors,[]);
}finally{
  report.final=await flight().catch(()=>null);
  await writeFile(join(out,'report.json'),JSON.stringify(report,null,2)+'\n');
  await browser.close();
}
