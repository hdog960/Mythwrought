import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
import {describeCandidateObject} from '../src/nonblock/candidate-scene.mjs';

const origin=process.env.NONBLOCK_OFFLINE_ORIGIN||'http://127.0.0.1:4173';
const options=[
  {sceneId:'scene48:single-wildflower',anchor:[10,9,7]},
  {sceneId:'scene36:rope-coil',anchor:[11,9,8],variant:1}
];
const seed=179;
const wildflower=describeCandidateObject(seed,options[0]).instanceKey;
const rope=describeCandidateObject(seed,options[1]).instanceKey;
const route=origin+'/?nonblock-stage='+encodeURIComponent(JSON.stringify(options))+'&nonblock-offline=1';
const stageKey='mythwrought:nonblock-stage:v1:legacy:179';
const backupKey=stageKey+':previous-good';
const worldKey='mythwrought-v002-world-179';
const saved=JSON.stringify({schema:1,seed,edits:[[100,12,100,3]]});
const directory='artifacts/nonblock-offline';
const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'
]});
const errors=[];
let screenshotSha256,cachedAssets;
try{
  const context=await browser.newContext({
    viewport:{width:932,height:430},hasTouch:true,isMobile:true,deviceScaleFactor:1,serviceWorkers:'allow'
  });
  await context.addInitScript(({worldKey,saved})=>{
    if(localStorage.getItem(worldKey)===null)localStorage.setItem(worldKey,saved);
  },{worldKey,saved});
  const page=await context.newPage();
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(route);
  const count=(tab,n)=>tab.waitForFunction(value=>
    Number(document.querySelector('#scene').dataset.nonblockInstances)===value,n,{timeout:30000});
  await count(page,2);
  await page.waitForFunction(()=>navigator.serviceWorker.controller?.scriptURL.endsWith(
    '/sw-m5.js?nonblock-staging=1'),null,{timeout:12000});
  cachedAssets=await page.evaluate(async()=>{
    const cacheKeys=(await caches.keys()).filter(key=>key.startsWith('mythwrought-nonblock-stage-shell-'));
    if(cacheKeys.length!==1)throw Error('Missing dedicated versioned stage cache');
    const cache=await caches.open(cacheKeys[0]);
    return Object.fromEntries(await Promise.all((await cache.keys()).map(async request=>{
      const bytes=await (await cache.match(request)).arrayBuffer();
      const hash=new Uint8Array(await crypto.subtle.digest('SHA-256',bytes));
      return [new URL(request.url).pathname,[...hash].map(byte=>byte.toString(16).padStart(2,'0')).join('')];
    })));
  });
  assert.ok(cachedAssets['/src/nonblock/candidate-scene.mjs']);
  assert.ok(cachedAssets['/src/nonblock-environments24/cave-formations.mjs']);
  for(const [path,expected] of Object.entries(cachedAssets)){
    const file=path==='/'?'index.html':path.slice(1);
    assert.equal(createHash('sha256').update(await readFile(file)).digest('hex'),expected,file);
  }
  const untouched=await page.evaluate(key=>localStorage.getItem(key),worldKey);
  assert.equal(untouched,saved);
  await page.evaluate(()=>{
    window.__mythwroughtTest.teleport(10.5,5.5);
    window.__mythwroughtTest.aimAtStagedPoint(10.58387,9.6238,7.5254);
  });
  await page.waitForFunction(key=>document.querySelector('#scene').dataset.nonblockTarget===key,wildflower);
  await page.locator('#dig').tap();
  await count(page,1);
  const removed=await page.evaluate(key=>localStorage.getItem(key),stageKey);
  assert.deepEqual(JSON.parse(removed).tombstones,[wildflower]);
  assert.equal(await page.evaluate(key=>localStorage.getItem(key),backupKey),removed);

  await page.close();
  await context.setOffline(true);
  const offline=await context.newPage();
  offline.on('pageerror',error=>errors.push(error.message));
  const served=await offline.goto(route);
  assert.equal(served.fromServiceWorker(),true);
  await count(offline,1);
  assert.equal(await offline.evaluate(key=>localStorage.getItem(key),stageKey),removed);
  assert.equal(await offline.evaluate(key=>localStorage.getItem(key),worldKey),untouched);
  await offline.evaluate(()=>{
    window.__mythwroughtTest.teleport(11.5,6.5);
    window.__mythwroughtTest.aimAtStagedPoint(11.6,9.11,8.53);
  });
  await offline.waitForFunction(()=>Number(document.querySelector('#scene').dataset.loadedChunks)===25);
  await mkdir(directory,{recursive:true});
  const image=await offline.screenshot({path:directory+'/cold-offline-932x430.png'});
  assert.deepEqual([image.readUInt32BE(16),image.readUInt32BE(20)],[932,430]);
  screenshotSha256=createHash('sha256').update(image).digest('hex');
  const damaged='{"version":"interrupted';
  await offline.evaluate(({stageKey,damaged})=>localStorage.setItem(stageKey,damaged),{stageKey,damaged});
  await offline.close();
  const recovered=await context.newPage();
  recovered.on('pageerror',error=>errors.push(error.message));
  assert.equal((await recovered.goto(route)).fromServiceWorker(),true);
  await count(recovered,1);
  assert.equal(await recovered.locator('#scene').getAttribute('data-nonblock-save-state'),'recovered');
  await recovered.evaluate(()=>{
    window.__mythwroughtTest.teleport(11.5,7.5);
    window.__mythwroughtTest.aimAtStagedPoint(11.64314,9.10556,8.54205);
  });
  await recovered.waitForFunction(key=>document.querySelector('#scene').dataset.nonblockTarget===key,rope);
  await recovered.locator('#dig').tap();
  assert.match(await recovered.locator('#status').textContent(),/recovered from backup/);
  await count(recovered,1);
  const recoveredBytes=await recovered.evaluate(keys=>keys.map(key=>localStorage.getItem(key)),
    [stageKey,backupKey,worldKey]);
  assert.deepEqual(recoveredBytes,[damaged,removed,untouched]);
  const plain=await recovered.goto(origin+'/');
  assert.equal(plain.fromServiceWorker(),true);
  await recovered.waitForFunction(()=>window.__mythwroughtTest&&Number(document.querySelector('#scene').dataset.loadedChunks)===25);
  assert.equal(await recovered.locator('#scene').getAttribute('data-nonblock-instances'),null);
  assert.deepEqual(errors,[]);
  await context.close();
}finally{
  await browser.close();
}
const sourceSha256=Object.fromEntries(await Promise.all(
  ['sw-m5.js','src/main.mjs','src/nonblock/stage-offline.mjs','tests/nonblock-offline-browser.mjs']
    .map(async file=>[file,createHash('sha256').update(await readFile(file)).digest('hex')])
));
await writeFile(directory+'/manifest.json',JSON.stringify({
  cachedAssets,sourceSha256,screenshotSha256,removed:[wildflower],schema1SaveBytesUnchanged:true,
  damagedSidecarRecoveredOffline:true,recoveredSidecarReadOnly:true
},null,2)+'\n');
console.log('PASS staged offline cold-open retained removal after sidecar damage and preserved both records and the schema-1 save.');
