import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
mkdirSync('artifacts/world-height',{recursive:true});
try{
 const page=await browser.newPage({viewport:{width:956,height:440},hasTouch:true,isMobile:true,deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{if(!localStorage.getItem('mythwrought-v002-world-179'))localStorage.setItem('mythwrought-v002-world-179',JSON.stringify({schema:1,seed:179,edits:[]}));});
 await page.goto('http://127.0.0.1:4174/',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.__mythwroughtTest&&Number(document.querySelector('#scene').dataset.loadedChunks)>=25,undefined,{timeout:60000});
 const f=await page.evaluate(()=>window.__mythwroughtTest.heightFixture());
 const info=()=>page.evaluate(()=>window.__mythwroughtTest.flightInfo());
 const cdp=await page.context().newCDPSession(page);
 const doubleTap=async()=>{const b=await page.locator('#jump').boundingBox(),t=Date.now()/1000;
  for(let i=0;i<2;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:b.x+b.width/2,y:b.y+b.height/2,id:i+1}],timestamp:t+i*.3});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[],timestamp:t+i*.3+.075});}
 };
 await page.locator('#g2bFlightEnable').check();await doubleTap();
 await page.waitForFunction(()=>window.__mythwroughtTest.flightInfo().active,undefined,{timeout:10000});
 await page.locator('#scene').focus();
 // The real platform is an intentional obstruction. Ascend beneath it,
 // fly around its edge using actual controls, then return above it.
 const holdUntil=async(key,fn,arg,timeout=180000)=>{await page.keyboard.down(key);try{await page.waitForFunction(fn,arg,{timeout,polling:100});}finally{await page.keyboard.up(key);}};
 await holdUntil('e',()=>{const p=window.__mythwroughtTest.flightInfo();return p.position.y>=249&&p.blocked&&p.reason.includes('Physical collision');});
 const obstruction=await info();console.log('HEIGHT PLATFORM OBSTRUCTION',JSON.stringify(obstruction));assert.ok(obstruction.position.y<251);
 await holdUntil('a',x=>window.__mythwroughtTest.flightInfo().position.x>=x+3.6,f.x,25000);
 await holdUntil('e',()=>window.__mythwroughtTest.flightInfo().position.y>=254.5,undefined,25000);
 await holdUntil('d',x=>window.__mythwroughtTest.flightInfo().position.x<=x+1,f.x,25000);
 let top=await info();console.log('HEIGHT TOP',JSON.stringify(top));
 assert.ok(top.active&&top.resident&&top.bodyClear&&top.position.y<=255.22+1e-8);
 assert.ok(top.position.y>=254.5);assert.ok(top.residentChunks<=25);
 await page.screenshot({path:'artifacts/world-height/upper-obstruction-route.png'});
 await page.screenshot({path:'artifacts/world-height/flight-ceiling.png'});
 await doubleTap();
 await page.waitForFunction(()=>!window.__mythwroughtTest.flightInfo().active,undefined,{timeout:15000});
 const landed=await info();assert.ok(Math.abs(landed.position.y-253)<.1,JSON.stringify(landed));
 await page.evaluate(t=>window.__mythwroughtTest.aimAt(...t),f.target);
 const target=await page.evaluate(()=>window.__mythwroughtTest.heightTarget());
 console.log('HEIGHT TARGET',JSON.stringify(target));assert.deepEqual(target.hit,f.target);assert.ok(target.canMine&&target.canPlace);assert.equal(target.adjacent[1],256);
 await page.locator('#place').tap();
 await page.waitForFunction(t=>window.__mythwroughtTest.block(...t)===3,target.adjacent,{timeout:15000});
 await page.screenshot({path:'artifacts/world-height/placed-at-ceiling.png'});
 await page.evaluate(t=>window.__mythwroughtTest.aimAt(...t),target.adjacent);
 await page.locator('#dig').tap();await page.waitForFunction(t=>window.__mythwroughtTest.block(...t)===0,target.adjacent,{timeout:15000});
 await page.evaluate(t=>window.__mythwroughtTest.aimAt(...t),f.target);
 await page.locator('#dig').tap();
 await page.waitForFunction(t=>window.__mythwroughtTest.block(...t)===0,f.target,{timeout:15000});
 const after=await page.evaluate(()=>({snapshot:window.__mythwroughtTest.snapshot(),data:{...document.querySelector('#scene').dataset}}));
 assert.ok(after.snapshot.lastEditMeshKeys.some(k=>k.startsWith('sky:')));
 assert.ok(Number(after.data.upperGpuBytes)<=7077888);assert.ok(Number(after.data.upperGpuOwners)<=8);
 await page.screenshot({path:'artifacts/world-height/after-mine.png'});
 // Actual context loss/recovery, not synthetic JS event.
 const lost=await page.evaluate(()=>{const gl=document.querySelector('#scene').getContext('webgl2');const ext=gl.getExtension('WEBGL_lose_context');if(!ext)return false;window.__heightLost=ext;ext.loseContext();return true;});
 assert.ok(lost);await page.waitForFunction(()=>window.__mythwroughtTest.snapshot().graphics.lost);
 await page.evaluate(()=>window.__heightLost.restoreContext());
 await page.waitForFunction(()=>{const s=window.__mythwroughtTest.snapshot();return !s.graphics.lost&&s.graphics.restoredCount>0&&Number(document.querySelector('#scene').dataset.upperReadySections)>0;},undefined,{timeout:60000});
 assert.equal(await page.evaluate(t=>window.__mythwroughtTest.block(...t),f.target),0);
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.__mythwroughtTest&&Number(document.querySelector('#scene').dataset.loadedChunks)>0,undefined,{timeout:60000});
 assert.equal(await page.evaluate(t=>window.__mythwroughtTest.block(...t),f.target),0);
 assert.equal(await page.evaluate(({x,z})=>window.__mythwroughtTest.block(x,252,z),f),3);
 // Explicit original shell install for this legacy qualification seed.
 await page.evaluate(async()=>{const {ensureM5OfflineCache}=await import('/src/manual-biomes/m5-offline-registration.mjs');await ensureM5OfflineCache();});
 await page.waitForFunction(()=>!!navigator.serviceWorker.controller,undefined,{timeout:120000});
 const cached=await page.evaluate(async()=>{const name='mythwrought-m5-shell-20261125-shared-height-v1',cache=await caches.open(name),urls=(await cache.keys()).map(r=>r.url);return {count:urls.length,all:['world-height.mjs','world-height-mesh-pages.mjs','world-height-budget.mjs','upper-sections.mjs','sky-runtime-adapter.mjs','sky-source-mesh.mjs'].every(p=>urls.some(u=>u.endsWith('/'+p)))};});
 assert.ok(cached.all&&cached.count>263,JSON.stringify(cached));
 await page.context().setOffline(true);
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.__mythwroughtTest&&Number(document.querySelector('#scene').dataset.loadedChunks)>0,undefined,{timeout:60000});
 assert.equal(await page.evaluate(()=>navigator.onLine),false);
 assert.equal(await page.evaluate(({x,z})=>window.__mythwroughtTest.block(x,252,z),f),3);
 assert.equal(await page.evaluate(t=>window.__mythwroughtTest.block(...t),f.target),0);
 assert.equal(await page.evaluate(()=>document.querySelector('#scene').getContext('webgl2').getError()),0);
 await page.screenshot({path:'artifacts/world-height/cold-offline.png'});
 console.log('HEIGHT OFFLINE PASS',JSON.stringify(cached));
 assert.deepEqual(errors,[]);
 console.log('HEIGHT actual game full flight, obstruction refusal, top placement/mining, GPU recovery, cold reopen PASS');
}finally{await browser.close();}
