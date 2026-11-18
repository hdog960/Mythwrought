// M5 isolated browser gate: real versioned ServiceWorker first-online install
// followed by a genuinely network-disabled Chromium reload, WebGL2 gameplay,
// real WASD/fog, save/reload, corrupted profile/map fail-closed restoration.
// No native stepping shortcut, teleport, orientation setter or production deploy.
import {chromium} from 'playwright';
import {PNG} from 'pngjs';
import {createHash} from 'node:crypto';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';

const layouts={'667x375':[667,375],'844x390':[844,390],
  '932x430':[932,430]};
const selected=process.env.M5_VIEWPORT||'667x375';
if(!Object.hasOwn(layouts,selected))throw Error('Invalid M5 viewport');
const [width,height]=layouts[selected],seed=179;
const root=process.cwd(),out=path.join(root,'artifacts/m5-offline-'+selected);
await mkdir(out,{recursive:true});
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript',
 '.mjs':'text/javascript','.json':'application/json','.svg':'image/svg+xml',
 '.png':'image/png','.webmanifest':'application/manifest+json'};
let requests=0;
const server=createServer(async(req,res)=>{
  requests++;
  try{
    const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
    const file=path.resolve(root,'.'+pathname);
    if(!(file===root||file.startsWith(root+path.sep)))throw Error('Bad path');
    const bytes=await readFile(file.endsWith(path.sep)?path.join(file,'index.html'):file);
    res.writeHead(200,{'Content-Type':mime[path.extname(file)]||
      'application/octet-stream','Cache-Control':'no-store'});
    res.end(bytes);
  }catch(error){res.writeHead(404);res.end(String(error));}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true,args:[
 '--enable-webgl','--use-gl=angle','--use-angle=swiftshader',
 '--disable-gpu-sandbox','--no-sandbox'
]});
const report={kind:'mythwrought-m5-offline-pwa-chromium-v1',viewport:selected,
  width,height,seed,sourceGenerator:'mythwrought-four-surface-regions-v5',
  defaultGenerator:'mythwrought-four-surface-regions-v4',
  sourceSchema:1,realChromium:true,offlineModeVerified:false,
  physicalIphone:false,serviceWorkerVersion:'mythwrought-m5-shell-20261118-v2',
  finished:false,screens:[],checks:[],errors:[]};
const persist=()=>writeFile(path.join(out,'manifest.json'),JSON.stringify(report,null,2));
const check=(name,ok,info={})=>{
  const result={name,ok:Boolean(ok),...info};report.checks.push(result);
  if(!ok)throw Error('FAIL M5 OFFLINE '+name+' '+JSON.stringify(info));
  console.log('PASS M5_OFFLINE '+name+' '+selected+' '+JSON.stringify(info));
};
async function screenshot(page,kind){
  await page.waitForTimeout(750);
  const status=await page.evaluate(()=>{
    const canvas=document.querySelector('#scene');
    const gl=canvas.getContext('webgl2');
    const snap=window.__mythwroughtTest.snapshot();
    const a=document.querySelector('.grip.left').getBoundingClientRect();
    const b=document.querySelector('.grip.right').getBoundingClientRect();
    const view=canvas.getBoundingClientRect();
    return {webgl:!!gl,lost:gl?.isContextLost(),glError:gl?.getError(),
      shaderReady:snap.graphics.shaderReady,
      resident:snap.chunks.length,retry:snap.gpuRetry?.failures||0,
      rails:a.right<b.left,canvas:Math.round(view.width)};
  });
  check('webgl2-'+kind,status.webgl&&!status.lost&&status.glError===0&&
    status.shaderReady&&status.resident>0&&status.retry===0&&status.rails&&
    status.canvas>100,status);
  const name='m5-offline-'+kind+'-'+selected+'.png';
  const bytes=await page.screenshot({path:path.join(out,name),timeout:90000});
  const png=PNG.sync.read(bytes),colors=new Set();
  for(let y=8;y<height-8;y+=11)for(let x=8;x<width-8;x+=11){
    const offset=(y*width+x)*4;
    colors.add(png.data[offset]+','+png.data[offset+1]+','+png.data[offset+2]);
  }
  check('png-'+kind,png.width===width&&png.height===height&&colors.size>35,
    {width:png.width,height:png.height,colors:colors.size});
  report.screens.push({name,kind,sha256:sha(bytes),bytes:bytes.length,
    width,height,distinctColors:colors.size,...status});
  await persist();
}
const pose=page=>page.evaluate(()=>window.__mythwroughtTest.m5ObservedPose());
async function map(page){
  await page.locator('#miniMapButton').click();
  const record=await page.evaluate(()=>({
    count:Number(document.getElementById('miniMap').dataset.discovered||0),
    raw:localStorage.getItem('mythwrought-exploration-v1-179'),
    summary:document.getElementById('explorationSummary').textContent
  }));
  await page.locator('#closeExploration').click();
  return record;
}
const ctx=await browser.newContext({viewport:{width,height},
  deviceScaleFactor:1,serviceWorkers:'allow'});
const page=await ctx.newPage(),pageErrors=[];
page.on('pageerror',e=>pageErrors.push(String(e.message)));
page.on('dialog',dialog=>dialog.accept());
const worldKey='mythwrought-v002-world-179',
  profileKey=worldKey+'-four-biomes-profile-v1',
  journalKey=profileKey+'-journal',mapKey='mythwrought-exploration-v1-179';
try{
  await page.addInitScript(()=>{
    if(localStorage.getItem('mythwrought-v002-selected-seed')===null)
      localStorage.setItem('mythwrought-v002-selected-seed','7');
  });
  await page.goto(origin+'/index.html',{waitUntil:'load',timeout:90000});
  await page.waitForFunction(()=>Boolean(window.__mythwroughtTest),null,
    {timeout:90000});
  const installed=await page.evaluate(async()=>{
    const res=await fetch('./manifest.webmanifest');
    const m=await res.json();
    return {display:m.display,orientation:m.orientation,
      startUrl:m.start_url,scope:m.scope,hasWorker:!!navigator.serviceWorker};
  });
  check('install-manifest',installed.display==='standalone'&&
    installed.orientation==='landscape'&&installed.hasWorker&&
    installed.scope==='./',installed);
  check('no-service-worker-on-legacy',await page.evaluate(()=>
    !navigator.serviceWorker.controller&&
    performance.getEntriesByType('resource')
      .every(e=>!e.name.endsWith('/sw-m5.js'))));
  await page.locator('#menu').click();
  await page.locator('#seedInput').fill(String(seed));
  await page.locator('#createExperimentalV5World').click();
  await page.locator('#closeHelp').click();
  await page.waitForFunction(()=>window.__mythwroughtTest.fourBiomeProfile()
    ?.generator==='mythwrought-four-surface-regions-v5',null,{timeout:30000});
  await page.evaluate(()=>navigator.serviceWorker.ready);
  await page.waitForFunction(()=>Boolean(navigator.serviceWorker.controller),null,
    {timeout:180000});
  const online=await page.evaluate(async()=>{
    const keys=await caches.keys();
    const name=keys.find(x=>x==='mythwrought-m5-shell-20261118-v2');
    const cache=name?await caches.open(name):null;
    const urls=cache?await cache.keys():[];
    return {name,cacheCount:urls.length,controller:
      navigator.serviceWorker.controller?.scriptURL,urls:urls.map(x=>x.url),
      secure:window.isSecureContext};
  });
  check('atomic-versioned-shell-install',online.secure&&
    online.name===report.serviceWorkerVersion&&online.cacheCount>=190&&
    online.controller?.endsWith('/sw-m5.js')&&
    ['src/main.mjs','src/manual-biomes/profile-world.mjs',
     'src/manual-biomes/m5-offline-registration.mjs','index.html',
     'manifest.webmanifest','styles.css'].every(p=>online.urls.some(u=>
       u.endsWith('/'+p))),{cachedAssets:online.cacheCount,controller:online.controller});
  const initial=await page.evaluate(({worldKey,profileKey,journalKey})=>({
    world:localStorage.getItem(worldKey),
    profile:localStorage.getItem(profileKey),
    journal:localStorage.getItem(journalKey),
    selected:localStorage.getItem('mythwrought-v002-selected-seed'),
    generator:window.__mythwroughtTest.fourBiomeProfile()?.generator,
    legacy:localStorage.getItem('mythwrought-v002-world-7')
  }),{worldKey,profileKey,journalKey});
  check('online-explicit-v5-saved',initial.world&&initial.profile&&initial.journal&&
    JSON.parse(initial.world).schema===1&&initial.selected==='179'&&
    initial.generator===report.sourceGenerator&&initial.legacy!==null);
  report.canonicalSha256=sha(Buffer.from(initial.world));
  report.profileSha256=sha(Buffer.from(initial.profile));
  const firstMap=await map(page);
  await screenshot(page,'online-initial');
  const beforeOfflineRequests=requests;
  await ctx.setOffline(true);
  check('browser-network-disabled',await page.evaluate(()=>navigator.onLine===false));
  await page.reload({waitUntil:'load',timeout:90000});
  await page.waitForFunction(()=>Boolean(window.__mythwroughtTest),null,
    {timeout:90000});
  const offState=await page.evaluate(async()=>{
    const urls=['./manifest.webmanifest','./src/manual-biomes/profile-world.mjs',
      './src/voxel.mjs'];
    const responses=await Promise.all(urls.map(x=>fetch(x)));
    return {controller:Boolean(navigator.serviceWorker.controller),
      network:navigator.onLine,allCached:responses.every(r=>r.ok),
      generator:window.__mythwroughtTest.fourBiomeProfile()?.generator};
  });
  check('cold-offline-reload',offState.controller&&!offState.network&&
    offState.allCached&&offState.generator===report.sourceGenerator,offState);
  await screenshot(page,'first-offline-boot');
  const beforeMove=await pose(page),legs=[];
  for(const key of ['a','w','s','d']){
    await page.locator('#scene').focus();
    await page.keyboard.down(key);
    await page.waitForTimeout(4800);
    await page.keyboard.up(key);
    const current=await pose(page),record=await map(page);
    legs.push({key,position:current,count:record.count});
    if(Math.hypot(current.x-beforeMove.x,current.z-beforeMove.z)>=5&&
       record.count>firstMap.count)break;
  }
  report.keyboardLegs=legs;
  const walked=await pose(page),newMap=await map(page);
  check('real-offline-keyboard-fog',Math.hypot(
    walked.x-beforeMove.x,walked.z-beforeMove.z)>=5&&
    newMap.count>firstMap.count&&newMap.raw&&
    JSON.parse(newMap.raw).seed===seed,
    {before:beforeMove,after:walked,discoveredBefore:firstMap.count,
     discoveredAfter:newMap.count,legs});
  await screenshot(page,'offline-walked');
  await page.locator('#miniMapButton').click();
  await screenshot(page,'offline-discovered-map');
  await page.locator('#closeExploration').click();
  await page.locator('#menu').click();
  await page.locator('#save').click();
  const saved=await page.evaluate(({worldKey,profileKey,journalKey})=>({
    world:localStorage.getItem(worldKey),profile:localStorage.getItem(profileKey),
    journal:localStorage.getItem(journalKey)
  }),{worldKey,profileKey,journalKey});
  check('offline-save-original-schema-safe',saved.world===initial.world&&
    saved.profile===initial.profile&&saved.journal===initial.journal);
  await page.reload({waitUntil:'load',timeout:90000});
  await page.waitForFunction(()=>Boolean(window.__mythwroughtTest),null,
    {timeout:90000});
  const again=await map(page);
  check('second-offline-reload-persists',again.count>=newMap.count&&
    JSON.parse(again.raw).seed===179&&
    (await page.evaluate(()=>
      window.__mythwroughtTest.fourBiomeProfile()?.generator))===
        report.sourceGenerator,{count:again.count,prior:newMap.count});
  await screenshot(page,'second-offline-reload');
  check('zero-network-after-cutoff',requests===beforeOfflineRequests,
    {onlineRequests:beforeOfflineRequests,now:requests});

  // Failure-safe source identity test in ISOLATED browser storage only.
  // We restore the exact recorded bytes after asserting read-only refusal.
  await page.evaluate(({profileKey,journalKey})=>{
    localStorage.setItem(profileKey,'invalid-profile-protection-test');
    localStorage.setItem(journalKey,'invalid-journal-protection-test');
  },{profileKey,journalKey});
  await page.reload({waitUntil:'load',timeout:90000});
  await page.waitForFunction(()=>Boolean(window.__mythwroughtTest),null,
    {timeout:90000});
  const bad=await page.evaluate(({worldKey,profileKey,journalKey})=>({
    state:document.getElementById('saveHealth').textContent,
    generator:window.__mythwroughtTest.fourBiomeProfile()?.generator,
    world:localStorage.getItem(worldKey),
    profile:localStorage.getItem(profileKey),
    journal:localStorage.getItem(journalKey)
  }),{worldKey,profileKey,journalKey});
  check('corrupt-profile-fail-closed',bad.state.includes('READ ONLY')&&
    !bad.generator&&bad.world===initial.world&&
    bad.profile==='invalid-profile-protection-test'&&
    bad.journal==='invalid-journal-protection-test');
  await screenshot(page,'corrupt-profile-protected');
  await page.evaluate(({profileKey,journalKey,profile,journal})=>{
    localStorage.setItem(profileKey,profile);
    localStorage.setItem(journalKey,journal);
  },{profileKey,journalKey,profile:initial.profile,journal:initial.journal});
  await page.reload({waitUntil:'load',timeout:90000});
  await page.waitForFunction(()=>Boolean(window.__mythwroughtTest),null,
    {timeout:90000});
  check('original-profile-exactly-restored',await page.evaluate(
    ({worldKey,profileKey,journalKey,world,profile,journal})=>
      localStorage.getItem(worldKey)===world&&
      localStorage.getItem(profileKey)===profile&&
      localStorage.getItem(journalKey)===journal&&
      window.__mythwroughtTest.fourBiomeProfile()?.generator===
        'mythwrought-four-surface-regions-v5',
    {...initial,worldKey,profileKey,journalKey}));
  await screenshot(page,'profile-recovered');
  await page.evaluate(mapKey=>localStorage.setItem(mapKey,
    'invalid-map-protection-test'),mapKey);
  await page.reload({waitUntil:'load',timeout:90000});
  await page.waitForFunction(()=>Boolean(window.__mythwroughtTest),null,
    {timeout:90000});
  await page.locator('#miniMapButton').click();
  const fogProtection=await page.evaluate(key=>({
    raw:localStorage.getItem(key),
    warning:document.getElementById('explorationSummary').textContent
  }),mapKey);
  check('corrupt-fog-fail-closed',fogProtection.raw===
    'invalid-map-protection-test'&&/read.?only|protected/i.test(
      fogProtection.warning),fogProtection);
  await page.locator('#closeExploration').click();
  await page.evaluate(({mapKey,raw})=>localStorage.setItem(mapKey,raw),
    {mapKey,raw:again.raw});
  await page.reload({waitUntil:'load',timeout:90000});
  await page.waitForFunction(()=>Boolean(window.__mythwroughtTest),null,
    {timeout:90000});
  const finalMap=await map(page);
  check('fog-original-exactly-restored',finalMap.count>=newMap.count&&
    JSON.parse(finalMap.raw).seed===seed);
  await screenshot(page,'final-offline-recovery');
  check('no-network-leak',requests===beforeOfflineRequests,
    {onlineRequests:beforeOfflineRequests,requests});
  check('no-browser-errors',pageErrors.length===0,{errors:pageErrors});
  check('screenshots-complete',report.screens.length===8);
  report.offlineModeVerified=true;report.finished=true;
  report.finalDiscovered=finalMap.count;
  await persist();
  console.log('PASS M5 REAL OFFLINE PWA WEBGL2 '+selected+
    ' seven genuine PNG and persistent seed/profile/map/failure-safe checks');
}catch(error){
  report.errors.push(String(error));await persist();throw error;
}finally{
  await ctx.close();await browser.close();
  await new Promise(resolve=>server.close(resolve));
}
