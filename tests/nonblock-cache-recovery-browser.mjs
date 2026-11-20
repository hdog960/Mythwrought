import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import {extname,resolve,sep} from 'node:path';
import {chromium} from 'playwright';
import {describeCandidateObject} from '../src/nonblock/candidate-scene.mjs';

const root=process.cwd();
const prefix='mythwrought-nonblock-stage-shell-';
const manifestPath='nonblock-stage-assets.json';
const directory='artifacts/nonblock-cache-recovery';
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const originalWorker=await readFile('sw-m5.js','utf8');
const originalManifest=JSON.parse(await readFile(manifestPath,'utf8'));
const version=originalManifest.version;
const next=version.replace(/v(\d+)$/,(_,n)=>'v'+(Number(n)+1));
const updateWorker=originalWorker
  .replace(new RegExp("const STAGE_PREVIOUS_VERSION='[^']+'"),"const STAGE_PREVIOUS_VERSION='"+version+"'")
  .replace("const STAGE_VERSION='"+version+"'","const STAGE_VERSION='"+next+"'");
assert.notEqual(updateWorker,originalWorker);
const repairedWorker=updateWorker+`
self.addEventListener('message',event=>{
  if(event.data==='verify-staged-recovery-controller')event.ports[0]?.postMessage(STAGE_VERSION);
});
`;
const updateManifest=body=>({version:next,assets:{...originalManifest.assets,'./sw-m5.js':digest(body)}});
const contentTypes={'.html':'text/html','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript',
  '.json':'application/json','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.png':'image/png'};
let publish='original';
let alteredResponseCount=0;
const server=createServer(async(req,res)=>{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const file=resolve(root,pathname==='/'?'index.html':'.'+pathname);
  if(!file.startsWith(root+sep)){res.writeHead(403).end();return;}
  try{
    let body=await readFile(file);
    if(publish!=='original'){
      const worker=publish==='broken'?updateWorker:repairedWorker;
      if(pathname==='/sw-m5.js')body=Buffer.from(worker);
      if(pathname==='/'+manifestPath)body=Buffer.from(JSON.stringify(updateManifest(worker))+'\n');
      if(publish==='broken'&&pathname==='/src/nonblock/candidate-effects.mjs'){
        body=Buffer.concat([body,Buffer.from('\n/* deliberately mismatched staged publish bytes */\n')]);
        alteredResponseCount++;
      }
    }
    res.writeHead(200,{'Content-Type':contentTypes[extname(file)]??'application/octet-stream',
      'Cache-Control':'no-store'}).end(body);
  }catch{
    res.writeHead(404).end();
  }
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin='http://127.0.0.1:'+server.address().port;
const layout=[
  {sceneId:'scene48:single-wildflower',anchor:[10,9,7]},
  {sceneId:'scene36:rope-coil',anchor:[11,9,8],variant:1}
];
const victim=describeCandidateObject(179,layout[0]).instanceKey;
const route=origin+'/?nonblock-stage='+encodeURIComponent(JSON.stringify(layout))+'&nonblock-offline=1';
const worldKey='mythwrought-v002-world-179';
const saved=JSON.stringify({schema:1,seed:179,edits:[[100,12,100,3]]});
const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'
]});
const captures=[];
try{
  const context=await browser.newContext({
    viewport:{width:932,height:430},hasTouch:true,isMobile:true,deviceScaleFactor:1,serviceWorkers:'allow'
  });
  await context.addInitScript(({worldKey,saved})=>{
    if(localStorage.getItem(worldKey)===null)localStorage.setItem(worldKey,saved);
  },{worldKey,saved});
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(route);
  const count=(tab,n)=>tab.waitForFunction(value=>{
    const c=document.querySelector('#scene').dataset;
    return Number(c.nonblockInstances)===value&&Number(c.loadedChunks)===25;
  },n,{timeout:45000});
  await count(page,2);
  await page.waitForFunction(()=>navigator.serviceWorker.controller?.scriptURL.endsWith(
    '/sw-m5.js?nonblock-staging=1'),null,{timeout:45000});
  await page.evaluate(()=>{
    window.__mythwroughtTest.teleport(10.5,5.5);
    window.__mythwroughtTest.aimAtStagedPoint(10.58387,9.6238,7.5254);
  });
  await page.waitForFunction(key=>document.querySelector('#scene').dataset.nonblockTarget===key,victim);
  await page.locator('#dig').tap();
  await count(page,1);
  const originalTombstone=await page.evaluate(()=>localStorage.getItem('mythwrought:nonblock-stage:v1:legacy:179'));
  assert.deepEqual(JSON.parse(originalTombstone).tombstones,[victim]);
  const banks=tab=>tab.evaluate(prefix=>caches.keys().then(keys=>
    keys.filter(key=>key.startsWith(prefix)).sort()),prefix);
  const oldBank=prefix+version,newBank=prefix+next;
  assert.deepEqual(await banks(page),[oldBank]);
  async function triggerUpdate(tab){
    return tab.evaluate(async()=>{
      const registration=await navigator.serviceWorker.getRegistration();
      return new Promise((resolve,reject)=>{
        const timer=setTimeout(()=>reject(new Error('Timed out waiting for an update state')),40000);
        registration.addEventListener('updatefound',()=>{
          const candidate=registration.installing;
          const status=()=>{
            if(candidate.state==='activated'||candidate.state==='redundant'){
              clearTimeout(timer);
              resolve(candidate.state);
            }
          };
          candidate.addEventListener('statechange',status);
          status();
        },{once:true});
        registration.update().catch(error=>{clearTimeout(timer);reject(error);});
      });
    });
  }
  publish='broken';
  assert.equal(await triggerUpdate(page),'redundant');
  assert.ok(alteredResponseCount>0);
  assert.deepEqual(await banks(page),[oldBank]);
  await page.close();

  await context.setOffline(true);
  const retained=await context.newPage();
  retained.on('pageerror',error=>errors.push(error.message));
  assert.equal((await retained.goto(route)).fromServiceWorker(),true);
  await count(retained,1);
  assert.equal(await retained.evaluate(key=>localStorage.getItem(key),worldKey),saved);
  await retained.evaluate(()=>{
    window.__mythwroughtTest.teleport(11.5,6.5);
    window.__mythwroughtTest.aimAtStagedPoint(11.6,9.11,8.53);
  });
  await mkdir(directory,{recursive:true});
  const file=directory+'/previous-good-offline-932x430.png';
  const bytes=await retained.screenshot({path:file});
  assert.deepEqual([bytes.readUInt32BE(16),bytes.readUInt32BE(20)],[932,430]);
  captures.push({file,sha256:digest(bytes),width:932,height:430});
  assert.equal(await retained.evaluate(()=>localStorage.getItem('mythwrought:nonblock-stage:v1:legacy:179')),originalTombstone);

  publish='updated';
  await context.setOffline(false);
  // The browser may already check for an update when the network returns.
  // Query the controlling worker itself instead of requiring a transient event.
  await retained.evaluate(async()=>{
    const registration=await navigator.serviceWorker.getRegistration();
    await registration.update();
  });
  await retained.waitForFunction(expected=>new Promise(resolve=>{
    const worker=navigator.serviceWorker.controller;
    if(!worker){resolve(false);return;}
    const channel=new MessageChannel();
    const finish=version=>{clearTimeout(timer);channel.port1.close();resolve(version===expected);};
    const timer=setTimeout(finish,750);
    channel.port1.onmessage=event=>finish(event.data);
    worker.postMessage('verify-staged-recovery-controller',[channel.port2]);
  }),next,{timeout:90000,polling:300});
  assert.deepEqual(await banks(retained),[oldBank,newBank].sort());
  assert.equal(await retained.evaluate(key=>localStorage.getItem(key),worldKey),saved);
  assert.deepEqual(errors,[]);
  await context.close();
}finally{
  await browser.close();
  await new Promise(resolve=>server.close(resolve));
}
const paths=['sw-m5.js',manifestPath,'tests/nonblock-cache-recovery-browser.mjs'];
const sourceSha256=Object.fromEntries(await Promise.all(paths.map(async path=>[path,digest(await readFile(path))])));
await writeFile(directory+'/manifest.json',JSON.stringify({
  version,attemptedVersion:next,rejectedMismatchedAsset:true,previousShellOpenedOffline:true,
  retainedTwoVerifiedBanks:true,schema1SaveBytesUnchanged:true,captures,sourceSha256
},null,2)+'\n');
console.log('PASS stale asset blocked activation, the prior shell opened offline, and a valid update retained both banks');
