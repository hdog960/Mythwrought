import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import {extname,resolve,sep} from 'node:path';
import {chromium} from 'playwright';
import {activateFourRegionProfile} from '../src/manual-biomes/profile-storage.mjs';
import {M5_EXPERIMENTAL_GENERATOR} from '../src/manual-biomes/profile-world.mjs';
import {saveM2World} from '../src/manual-biomes/m2-runtime-bridge.mjs';
import {Pack2LiveWorld,PACK2_SIDECAR_SUFFIX} from '../src/pack2-world.mjs';
import {SAVE_BACKUP_SUFFIX} from '../src/persistence.mjs';
import {SELECTED_SEED_KEY,worldSlotKey} from '../src/seeds.mjs';
import {RENDER_PREF} from '../src/render-budget.mjs';
import {describeCandidateObject} from '../src/nonblock/candidate-scene.mjs';

const baseline=process.env.NONBLOCK_PRODUCTION_DIR;
const baselineRevision=process.env.NONBLOCK_PRODUCTION_SHA;
if(!baseline||!/^[a-f0-9]{40}$/.test(baselineRevision??'')){
  throw Error('Expected an exact production archive directory and commit');
}
const candidate=process.cwd();
const appPath='/Mythwrought/';
const directory='artifacts/nonblock-install-rehearsal';
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const identityFiles=['index.html','manifest.webmanifest','assets/icon.svg','sw-m5.js','src/main.mjs'];
const baselineSha256={};
for(const file of identityFiles){
  const bytes=await readFile(resolve(baseline,file));
  assert.deepEqual(bytes,execFileSync('git',['show',baselineRevision+':'+file]),'Baseline source '+file);
  baselineSha256[file]=digest(bytes);
  if(file==='manifest.webmanifest'||file==='assets/icon.svg'){
    assert.deepEqual(bytes,await readFile(file),'Same installation identity '+file);
  }
}
const manifest=JSON.parse(await readFile('manifest.webmanifest','utf8'));
assert.equal(manifest.start_url,'./');
assert.equal(manifest.scope,'./');
assert.equal(manifest.orientation,'landscape');
assert.equal(manifest.display,'standalone');

const seed=179, edit=[100,12,100], physical=[102,12,100], physicalId=67;
const records=new Map();
const storage={
  getItem:key=>records.get(key)??null,setItem:(key,value)=>records.set(key,value),
  removeItem:key=>records.delete(key),key:index=>[...records.keys()][index],
  get length(){return records.size;}
};
const base=activateFourRegionProfile(storage,seed,{
  explicitNewWorld:true,generator:M5_EXPERIMENTAL_GENERATOR
});
const world=new Pack2LiveWorld(base);
assert.equal(world.set(...edit,2),true);
assert.equal(world.placePack2(...physical,physicalId,{orientation:0,open:false}),true);
assert.equal(saveM2World(storage,world).ok,true);
assert.equal(world.set(...edit,3),true);
assert.equal(world.updatePack2State(...physical,{orientation:1,open:true}),true);
assert.equal(saveM2World(storage,world).ok,true);
const worldKey=worldSlotKey(seed);
assert.deepEqual(JSON.parse(records.get(worldKey)).edits,[[...edit,3]]);
assert.ok(records.get(worldKey+SAVE_BACKUP_SUFFIX));
assert.ok(records.get(worldKey+PACK2_SIDECAR_SUFFIX+'-backup'));
records.set(SELECTED_SEED_KEY,String(seed));
records.set(RENDER_PREF,'economy');
const expected=[...records];
const layout=[{sceneId:'scene48:single-wildflower',anchor:[10,9,7]}];
const victim=describeCandidateObject(seed,layout[0]).instanceKey;
const tombstoneKey='mythwrought:nonblock-stage:v1:'+M5_EXPERIMENTAL_GENERATOR+':'+seed;

const contentTypes={'.html':'text/html','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript',
  '.json':'application/json','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.png':'image/png'};
let serverRoot=resolve(baseline);
const server=createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,'http://localhost');
    if(!url.pathname.startsWith(appPath)){res.writeHead(404).end();return;}
    const filename=decodeURIComponent(url.pathname.slice(appPath.length))||'index.html';
    const file=resolve(serverRoot,filename);
    if(!file.startsWith(serverRoot+sep)){res.writeHead(403).end();return;}
    const bytes=await readFile(file);
    res.writeHead(200,{'Content-Type':contentTypes[extname(file)]??'application/octet-stream',
      'Cache-Control':'no-store'}).end(bytes);
  }catch{res.writeHead(404).end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin='http://127.0.0.1:'+server.address().port;
const app=origin+appPath;
const stage=app+'?nonblock-stage='+encodeURIComponent(JSON.stringify(layout))+'&nonblock-offline=1';
const worker='sw-m5.js',stagingWorker=worker+'?nonblock-staging=1';
const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'
]});
const captures=[];
try{
  const context=await browser.newContext({viewport:{width:932,height:430},hasTouch:true,isMobile:true,
    deviceScaleFactor:1,serviceWorkers:'allow',
    storageState:{cookies:[],origins:[{origin,localStorage:expected.map(([name,value])=>({name,value}))}]}
  });
  const errors=[];
  const page=async()=>{
    const tab=await context.newPage();
    tab.on('pageerror',error=>errors.push(error.message));
    return tab;
  };
  const controlled=(tab,script)=>tab.waitForFunction(path=>navigator.serviceWorker.controller?.scriptURL===path,
    app+script,{timeout:90000,polling:250});
  const preserved=async tab=>{
    await tab.waitForFunction(()=>Boolean(window.__mythwroughtTest),null,{timeout:45000});
    const actual=await tab.evaluate(({keys,edit,physical})=>({
      storage:keys.map(key=>localStorage.getItem(key)),
      edits:[window.__mythwroughtTest.block(...edit),window.__mythwroughtTest.block(...physical)],
      generator:window.__mythwroughtTest.fourBiomeProfile()?.generator
    }),{keys:expected.map(([key])=>key),edit,physical});
    assert.deepEqual(actual.storage,expected.map(([,value])=>value));
    assert.deepEqual(actual.edits,[3,physicalId]);
    assert.equal(actual.generator,M5_EXPERIMENTAL_GENERATOR);
  };
  const selectWorker=(tab,script)=>tab.evaluate(async({script,scope})=>{
    await navigator.serviceWorker.register(script,{scope,updateViaCache:'none'});
  },{script:app+script,scope:appPath});
  const openCached=async(url,script)=>{
    const tab=await page();
    assert.equal((await tab.goto(url)).fromServiceWorker(),true);
    await controlled(tab,script);
    await preserved(tab);
    const installation=await tab.evaluate(async()=>Promise.all(['manifest.webmanifest','assets/icon.svg']
      .map(async path=>{
        const response=await fetch(path);
        if(!response.ok)throw Error('Offline installation asset missing '+path);
        return response.text();
      })));
    assert.deepEqual(installation.map(digest),[baselineSha256['manifest.webmanifest'],baselineSha256['assets/icon.svg']]);
    return tab;
  };
  const capture=async(tab,name)=>{
    await tab.waitForFunction(()=>Number(document.querySelector('#scene').dataset.loadedChunks)===25,
      null,{timeout:60000});
    const file=directory+'/'+name+'.png';
    const image=await tab.screenshot({path:file});
    assert.deepEqual([image.readUInt32BE(16),image.readUInt32BE(20)],[932,430]);
    captures.push({file,width:932,height:430,sha256:digest(image)});
  };
  await mkdir(directory,{recursive:true});
  const installed=await page();
  await installed.goto(app);
  await controlled(installed,worker);
  await preserved(installed);
  const originalBank=(await installed.evaluate(()=>caches.keys())).find(key=>key.startsWith('mythwrought-m5-shell-'));
  assert.ok(originalBank);
  await installed.close();
  await context.setOffline(true);
  const original=await openCached(app,worker);
  await capture(original,'original-offline');
  console.log('PASS original installation scope and real saved world cold-opened offline');

  serverRoot=candidate;
  await context.setOffline(false);
  await selectWorker(original,stagingWorker);
  await controlled(original,stagingWorker);
  assert.ok((await original.evaluate(()=>caches.keys())).includes(originalBank));
  await original.goto(stage);
  await preserved(original);
  await original.evaluate(()=>{
    window.__mythwroughtTest.teleport(10.5,5.5);
    window.__mythwroughtTest.aimAtStagedPoint(10.58387,9.6238,7.5254);
  });
  await original.waitForFunction(key=>document.querySelector('#scene').dataset.nonblockTarget===key,victim,{timeout:30000});
  await capture(original,'stage-before-mining');
  await original.locator('#dig').tap();
  await original.waitForFunction(()=>Number(document.querySelector('#scene').dataset.nonblockInstances)===0,
    null,{timeout:30000});
  const stagedBytes=await original.evaluate(key=>localStorage.getItem(key),tombstoneKey);
  assert.deepEqual(JSON.parse(stagedBytes).tombstones,[victim]);
  await original.close();
  await context.setOffline(true);
  const updated=await openCached(stage,stagingWorker);
  await updated.waitForFunction(()=>Number(document.querySelector('#scene').dataset.nonblockInstances)===0,
    null,{timeout:30000});
  assert.equal(await updated.evaluate(key=>localStorage.getItem(key),tombstoneKey),stagedBytes);
  console.log('PASS candidate cached on the same scope and retained physical and scenery state');

  serverRoot=resolve(baseline);
  await context.setOffline(false);
  await selectWorker(updated,worker);
  await controlled(updated,worker);
  await updated.close();
  await context.setOffline(true);
  const rolledBack=await openCached(app,worker);
  assert.equal(await rolledBack.locator('#scene').getAttribute('data-nonblock-instances'),null);
  assert.equal(await rolledBack.evaluate(key=>localStorage.getItem(key),tombstoneKey),stagedBytes);
  await capture(rolledBack,'rollback-offline');
  assert.deepEqual(errors,[]);
  await context.close();
  console.log('PASS rollback restored the original offline shortcut scope and retained both save owners');
}finally{
  await browser.close();
  await new Promise(resolve=>server.close(resolve));
}
const paths=[...identityFiles,'nonblock-stage-assets.json','tests/nonblock-install-rehearsal-browser.mjs'];
const sourceSha256=Object.fromEntries(await Promise.all(paths.map(async path=>[path,digest(await readFile(path))])));
await writeFile(directory+'/manifest.json',JSON.stringify({
  baselineRevision,baselineSha256,sourceSha256,appPath,
  manifestAndIconEqual:true,ordinaryAndPhysicalBytesUnchanged:true,previousGoodBackupsUnchanged:true,
  stagedRemovalRetainedAfterRollback:true,
  captures
},null,2)+'\n');
