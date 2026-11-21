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
const originalWorker=await readFile('sw-nonblock-stage.js','utf8');
const originalManifest=JSON.parse(await readFile(manifestPath,'utf8'));
const version=originalManifest.version;
const increment=(release,offset)=>release.replace(/v(\d+)$/,(_,n)=>'v'+(Number(n)+offset));
const rejectedVersion=increment(version,1),next=increment(version,2);
const futureBank=prefix+increment(version,3);
function updateWorker(target){
  return originalWorker
    .replace(/const STAGE_PREVIOUS_VERSION='[^']+'/, "const STAGE_PREVIOUS_VERSION='"+version+"'")
    .replace("const STAGE_VERSION='"+version+"'","const STAGE_VERSION='"+target+"'");
}
const reusedWorker=originalWorker+'\n/* another worker under the published version */\n';
const brokenWorker=updateWorker(rejectedVersion);
const repairedWorker=updateWorker(next)+`
self.addEventListener('message',event=>{
  if(event.data==='verify-staged-recovery-controller')event.ports[0]?.postMessage(STAGE_VERSION);
});
`;
const releases={
  reused:{version,worker:reusedWorker},
  broken:{version:rejectedVersion,worker:brokenWorker},
  updated:{version:next,worker:repairedWorker}
};
const updateManifest=({version:release,worker})=>({
  version:release,assets:{...originalManifest.assets,'./sw-nonblock-stage.js':digest(worker)}
});
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
      const release=releases[publish];
      if(pathname==='/sw-nonblock-stage.js')body=Buffer.from(release.worker);
      if(pathname==='/'+manifestPath)body=Buffer.from(JSON.stringify(updateManifest(release))+'\n');
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
    viewport:{width:932,height:430},hasTouch:true,isMobile:true,deviceScaleFactor:1,serviceWorkers:'allow',
    storageState:{cookies:[],origins:[{origin,localStorage:[{name:worldKey,value:saved}]}]}
  });
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  // A newer installation can have started filling a bank while an older
  // worker still owns the scope. Activation may only prune superseded banks.
  await page.goto(origin+'/'+manifestPath);
  await page.evaluate(async key=>{
    const bank=await caches.open(key);
    await bank.put(new URL('/__future-bank',location.href),new Response('pending'));
  },futureBank);
  await page.goto(route);
  const count=(tab,n)=>tab.waitForFunction(value=>{
    const c=document.querySelector('#scene').dataset;
    return Number(c.nonblockInstances)===value&&Number(c.loadedChunks)===25;
  },n,{timeout:45000});
  await count(page,2);
  await page.waitForFunction(()=>navigator.serviceWorker.controller?.scriptURL.endsWith(
    '/sw-nonblock-stage.js?nonblock-staging=1'),null,{timeout:45000});
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
  async function verifyCompleteBanks(tab,expected){
    const cached=await tab.evaluate(async({expected,path})=>{
      const results=[];
      for(const {key,version} of expected){
        if(!await caches.has(key))throw new Error('Missing installed bank '+key);
        const bank=await caches.open(key);
        const manifestUrl=new URL(path,location.href);
        const asset=await bank.match(manifestUrl);
        const artifact=await asset?.json();
        const worker=await bank.match(new URL('sw-nonblock-stage.js',location.href));
        const hash=worker&&new Uint8Array(await crypto.subtle.digest('SHA-256',await worker.arrayBuffer()));
        const sha=hash&&[...hash].map(value=>value.toString(16).padStart(2,'0')).join('');
        const entries=new Set((await bank.keys()).map(request=>request.url));
        const assets=Object.keys(artifact?.assets??{});
        const completeShell=entries.delete(manifestUrl.href)&&entries.size===assets.length&&
          assets.every(assetPath=>entries.has(new URL(assetPath,location.href).href));
        if(artifact?.version!==version||!completeShell)
          throw new Error('Incomplete installed bank '+key+' ('+entries.size+' assets, '+(artifact?.version??'missing manifest')+')');
        results.push({key,version:artifact.version,workerMatchesManifest:sha===artifact.assets['./sw-nonblock-stage.js']});
      }
      return results;
    },{expected,path:manifestPath});
    assert.deepEqual(cached,expected.map(bank=>({...bank,workerMatchesManifest:true})));
  }
  assert.deepEqual(await banks(page),[oldBank,futureBank].sort());
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
  publish='reused';
  assert.equal(await triggerUpdate(page),'redundant');
  assert.deepEqual(await banks(page),[oldBank,futureBank].sort());
  assert.equal(await page.evaluate(async({key,path})=>{
    const cache=await caches.open(key);
    const artifact=await cache.match(new URL(path,location.href));
    return (await artifact?.json())?.version;
  },{key:oldBank,path:manifestPath}),version);
  publish='broken';
  assert.equal(await triggerUpdate(page),'redundant');
  assert.ok(alteredResponseCount>0);
  assert.deepEqual(await banks(page),[oldBank,futureBank].sort());
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
  const waitForController=tab=>tab.evaluate(async expected=>{
    // waitForFunction tests the returned Promise object for truthiness, before
    // its reply resolves. Poll the actual version reported by the controller.
    const deadline=performance.now()+90000;
    while(performance.now()<deadline){
      const worker=navigator.serviceWorker.controller;
      if(worker?.state==='activated'){
        const version=await new Promise(resolve=>{
          const channel=new MessageChannel();
          const finish=reply=>{clearTimeout(timer);channel.port1.close();resolve(reply);};
          const timer=setTimeout(finish,750);
          channel.port1.onmessage=event=>finish(event.data);
          worker.postMessage('verify-staged-recovery-controller',[channel.port2]);
        });
        if(version===expected&&navigator.serviceWorker.controller===worker)return;
      }
      await new Promise(resolve=>setTimeout(resolve,300));
    }
    throw new Error('Controlling staged worker did not report '+expected);
  },next);
  await waitForController(retained);
  assert.deepEqual(await banks(retained),[oldBank,newBank,futureBank].sort());
  const expectedBanks=[{key:oldBank,version},{key:newBank,version:next}];
  await verifyCompleteBanks(retained,expectedBanks);
  await retained.close();
  await context.setOffline(true);
  const updated=await context.newPage();
  updated.on('pageerror',error=>errors.push(error.message));
  assert.equal((await updated.goto(route)).fromServiceWorker(),true);
  await count(updated,1);
  await waitForController(updated);
  assert.deepEqual(await banks(updated),[oldBank,newBank,futureBank].sort());
  assert.equal(await updated.evaluate(async key=>{
    const response=await caches.match(new URL('/__future-bank',location.href),{cacheName:key});
    return response?.text();
  },futureBank),'pending');
  await verifyCompleteBanks(updated,expectedBanks);
  assert.equal(await updated.evaluate(key=>localStorage.getItem(key),worldKey),saved);
  assert.equal(await updated.evaluate(()=>localStorage.getItem('mythwrought:nonblock-stage:v1:legacy:179')),originalTombstone);
  assert.deepEqual(errors,[]);
  await context.close();
}finally{
  await browser.close();
  await new Promise(resolve=>server.close(resolve));
}
const paths=['sw-nonblock-stage.js',manifestPath,'tests/nonblock-cache-recovery-browser.mjs'];
const sourceSha256=Object.fromEntries(await Promise.all(paths.map(async path=>[path,digest(await readFile(path))])));
await writeFile(directory+'/manifest.json',JSON.stringify({
  version,attemptedVersion:rejectedVersion,repairedVersion:next,rejectedVersionReuse:true,rejectedMismatchedAsset:true,previousShellOpenedOffline:true,
  retainedTwoVerifiedBanks:true,preservedFutureBank:true,repairedShellOpenedOffline:true,schema1SaveBytesUnchanged:true,captures,sourceSha256
},null,2)+'\n');
console.log('PASS staged cache rejected version reuse and invalid assets; both verified banks opened offline');
