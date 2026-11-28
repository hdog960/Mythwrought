import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
const root=resolve(process.env.CANDIDATE_ROOT||'.');
const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webmanifest':'application/manifest+json'};
const server=createServer(async(req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const file=resolve(root,'.'+(pathname==='/'?'/index.html':pathname));if(!file.startsWith(root+sep))throw Error('path');res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(await readFile(file));}catch(e){res.end(String(e));}});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
const browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:667,height:375},deviceScaleFactor:1});
const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());
const keys=seed=>['mythwrought-v002-world-'+seed,'mythwrought-v002-world-'+seed+'-four-biomes-profile-v1','mythwrought-exploration-v1-'+seed,'mythwrought-navigation00-observations-v1-'+seed];
const bytes=seed=>page.evaluate(ks=>ks.map(k=>localStorage.getItem(k)),keys(seed));
const pose=()=>page.evaluate(()=>window.__mythwroughtTest.m5ObservedPose());
const count=()=>page.evaluate(()=>Number(document.getElementById('miniMap').dataset.discovered||0));
async function flush(){await page.locator('#miniMapButton').click();await page.locator('#closeExploration').click();}
try{
 await page.addInitScript(()=>{if(localStorage.getItem('mythwrought-v002-selected-seed')===null)localStorage.setItem('mythwrought-v002-selected-seed','7');});
 await page.goto('http://127.0.0.1:'+server.address().port+'/index.html',{waitUntil:'load'});
 await page.waitForFunction(()=>window.__mythwroughtTest&&Number(document.getElementById('miniMap').dataset.discovered)>0,null,{timeout:120000});
 assert.equal((await pose()).seed,7);await flush();const before7=await bytes(7);assert.ok(before7[2]);assert.equal(JSON.parse(before7[2]).seed,7);
 await page.locator('#menu').click();await page.locator('#advancedMenu > summary').click();await page.locator('#seedInput').fill('179');await page.locator('#createExperimentalV5World').click();await page.locator('#closeHelp').click();
 assert.equal((await pose()).seed,179);assert.equal(await page.evaluate(()=>window.__mythwroughtTest.fourBiomeProfile()?.generator),'mythwrought-four-surface-regions-v5');
 await flush();const baseline7=await bytes(7),before179=await bytes(179);assert.ok(before179[0]);assert.equal(baseline7[0],before7[0]);assert.equal(baseline7[1],before7[1]);assert.ok(JSON.parse(before7[2]).cells.every(k=>JSON.parse(baseline7[2]).cells.includes(k)));
 const start=await pose(),n=await count();let travel=0;
 for(const k of ['w','a','d','s']){await page.locator('#scene').focus();await page.keyboard.down(k);await page.waitForTimeout(4800);await page.keyboard.up(k);const p=await pose();travel=Math.hypot(p.x-start.x,p.z-start.z);if(travel>=5&&await count()>n)break;}
 assert.ok(travel>=5&&await count()>n,'real movement and discovery');await flush();const walked=await bytes(179);assert.equal(JSON.parse(walked[2]).seed,179);assert.deepEqual(await bytes(7),baseline7,'inactive seed changed during active world exploration');
 await page.locator('#menu').click();await page.locator('#advancedMenu > summary').click();await page.locator('#save').click();
 assert.equal((await bytes(179))[0],before179[0],'canonical seed179 edited without block changes');assert.equal((await bytes(179))[1],before179[1]);assert.deepEqual(await bytes(7),baseline7,'inactive seed changed during save');
 await page.reload({waitUntil:'load'});await page.waitForFunction(()=>window.__mythwroughtTest?.m5ObservedPose().seed===179,null,{timeout:120000});await page.waitForFunction(()=>Number(document.getElementById('miniMap').dataset.discovered)>0,null,{timeout:120000});
 await flush();const after=await bytes(179);assert.equal(after[0],before179[0]);assert.equal(after[1],before179[1]);assert.ok(JSON.parse(walked[2]).cells.every(k=>JSON.parse(after[2]).cells.includes(k)));assert.deepEqual(await bytes(7),baseline7);assert.deepEqual(errors,[]);
 console.log('PASS legacy isolation actual prior seed observed and preserved, canonical bytes stable, active seed discovery persists',JSON.stringify({legacyCells:JSON.parse(baseline7[2]).cells.length,walkedCells:JSON.parse(walked[2]).cells.length,reloadedCells:JSON.parse(after[2]).cells.length,travel,errors}));
}finally{await browser.close();await new Promise(ok=>server.close(ok));}
