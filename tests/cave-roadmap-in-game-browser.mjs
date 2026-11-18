// Roadmap #240 C5: REAL original Mythwrought game, index.html/main.mjs,
// production UI, original player, meshes, controller and iPhone landscape rails.
// NO fake cave preview. This runs only in a new isolated Chromium test storage.
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,sep,extname,join} from 'node:path';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright';
import pngjs from 'pngjs';
import {deepCaveRoute} from '../src/deep-cave-network.mjs';
import {descentRoute} from '../src/underground-switchback-descent.mjs';
import {caveRoute} from '../src/experimental-cave-route.mjs';
const {PNG}=pngjs;
const head=process.env.CAVE_EXPECTED_HEAD||'';
assert.match(head,/^[0-9a-f]{40}$/,'Actual game source exact checkout required');
assert.equal(execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),head);
const sizes=[[667,375],[844,390],[932,430]],seed=314159;
const folder=resolve('artifacts/cave-roadmap-actual-game');
await mkdir(folder,{recursive:true});
const report={status:'UNVERIFIED',kind:'ACTUAL_INDEX_MAIN_GAME_WEBGL2',
 head,productionDeployed:false,actualIPhone:false,
 preservesLegacySave:true,sizes,images:[],errors:[]};
const root=resolve('.'),mimes={'.mjs':'text/javascript; charset=utf-8',
 '.js':'text/javascript; charset=utf-8','.html':'text/html; charset=utf-8',
 '.json':'application/json','.css':'text/css; charset=utf-8',
 '.svg':'image/svg+xml','.png':'image/png','.webmanifest':'application/manifest+json'};
const server=createServer(async(req,res)=>{
 try{
  const request=new URL(req.url,'http://127.0.0.1'),p=request.pathname==='/'?'/index.html':request.pathname;
  const file=resolve(root,'.'+decodeURIComponent(p));
  if(!file.startsWith(root+sep)||!mimes[extname(file)])throw Error('Request blocked');
  const bytes=await readFile(file);
  res.writeHead(200,{'Content-Type':mimes[extname(file)],'Cache-Control':'no-store'});
  res.end(bytes);
 }catch{res.writeHead(404);res.end('Not found');}
});
let browser=null;
function inspect(raw,w,h){
 const png=PNG.sync.read(raw);
 assert.equal(png.width,w);assert.equal(png.height,h);
 const values=new Set();let pixelCount=0;
 for(let y=Math.floor(h*.27);y<Math.floor(h*.77);y+=7)
  for(let x=Math.floor(w*.22);x<Math.floor(w*.78);x+=7){
   const i=(y*w+x)*4;values.add([png.data[i]>>4,png.data[i+1]>>4,png.data[i+2]>>4].join(','));
   if(png.data[i]>35||png.data[i+1]>35||png.data[i+2]>35)pixelCount++;
  }
 return {width:w,height:h,paletteBins:values.size,litSamples:pixelCount,
  sha256:createHash('sha256').update(raw).digest('hex')};
}
function locators(reportFromGame){
 const original=deepCaveRoute(),i=original.findIndex(p=>p.floor===-80);
 const desc=descentRoute(),j=desc.findIndex(p=>p.floor===-80);
 const east=reportFromGame.sourceCounts.eastGalleryOrigin;
 const a=east.length-9,f=caveRoute(seed,east).floorAt(a);
 const entrance=reportFromGame.entranceSites[0].mouth;
 return [
  {name:'surface-entry',surface:true,at:{x:entrance.x,z:entrance.z}},
  {name:'original-deep-spiral',at:{x:original[i].x,y:original[i].floor+1,z:original[i].z},
   to:{x:original[i+7].x,y:original[i+7].floor+2,z:original[i+7].z}},
  {name:'switchback-80',at:{x:desc[j].x,y:desc[j].floor+1,z:desc[j].z},
   to:{x:desc[j+7].x,y:desc[j+7].floor+2,z:desc[j+7].z}},
  {name:'historic-east-gallery',at:{x:east.x+a+3,y:f+1,z:east.z+8},
   to:{x:east.x+a+7,y:f+2,z:east.z+8}}
 ];
}
async function waitRealMesh(page,x,z,depth=false){
 await page.waitForFunction(({x,z,depth})=>{
  const el=document.querySelector('#scene'),v=el?.dataset;
  if(!v||!window.__mythwroughtTest)return false;
  const key=Math.floor(x/16)+','+Math.floor(z/16);
  return v.chunkCenter?.startsWith(key) &&
   Number(v.renderedMeshVertices)>800 &&
   Number(v.loadedChunks)>10 && Number(v.pendingChunks)===0 &&
   (!depth||Number(v.playerFeet)<-10);
 },{x,z,depth},{timeout:90000});
 await page.waitForTimeout(180);
}
try{
 await new Promise((ok,fail)=>{server.once('error',fail);server.listen(0,'127.0.0.1',ok)});
 browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader',
  '--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
 const origin='http://127.0.0.1:'+server.address().port;
 for(const [width,height] of sizes){
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,
   hasTouch:true,isMobile:true,serviceWorkers:'block'});
  const page=await context.newPage(),errors=[];
  page.on('dialog',dialog=>dialog.accept());
  page.on('pageerror',err=>errors.push('JS: '+err.message));
  page.on('response',r=>{if(r.status()>=400)errors.push('HTTP '+r.status()+' '+r.url())});
  page.on('requestfailed',r=>errors.push('FAILED '+r.url()));
  try{
   assert.equal((await page.goto(origin+'/',{waitUntil:'domcontentloaded',timeout:30000}))?.status(),200);
   await page.waitForFunction(()=>window.__mythwroughtTest &&
     Number(document.querySelector('#scene')?.dataset.loadedChunks)>=25,
     null,{timeout:80000});
   const original=await page.evaluate(()=>localStorage.getItem('mythwrought-v002-world-179'));
   assert.equal(await page.evaluate(()=>window.__mythwroughtTest.caveMode().enabled),false);
   assert.ok(await page.locator('#scene').evaluate(el=>!!el.getContext('webgl2')));
   assert.equal(await page.locator('#dig').textContent(),'MINE');
   assert.equal(await page.locator('#jump').textContent(),'JUMP');
   await page.evaluate(()=>document.getElementById('menu').click());
   await page.locator('#seedInput').fill(String(seed));
   await page.evaluate(()=>document.getElementById('caveCreateWorld').click());
   await page.waitForFunction(()=>window.__mythwroughtTest.caveMode().enabled,
    null,{timeout:90000});
   const status=await page.evaluate(()=>window.__mythwroughtTest.caveMode());
   assert.equal(status.seed,seed);
   assert.equal(status.saveIsolation,true);
   assert.equal(status.sourceCounts.vaultBridgeConnected,true);
   assert.equal(status.sourceCounts.eastGalleryConnected,true);
   assert.equal(status.sourceCounts.entrancesConnected,true);
   assert.equal(status.entranceSites.length,4);
   assert.equal(await page.evaluate(()=>localStorage.getItem('mythwrought-v002-world-'+314159)),null);
   assert.ok(await page.evaluate(()=>localStorage.getItem('mythwrought-caves-v1-seed-'+314159)));
   await page.evaluate(()=>document.getElementById('closeHelp').click());
   const shots=locators(status),hashes=new Set();
   for(const shot of shots){
    if(shot.surface){
     const s=await page.evaluate(({x,z})=>window.__mythwroughtTest.teleport(x,z),shot.at);
     await waitRealMesh(page,shot.at.x,shot.at.z,false);
    }else{
     await page.evaluate(({at,to})=>{
      window.__mythwroughtTest.teleportCave(at.x,at.y,at.z);
      window.__mythwroughtTest.aimAt(to.x,to.y,to.z);
     },shot);
     await waitRealMesh(page,shot.at.x,shot.at.z,shot.at.y<-10);
    }
    const snapshot=await page.evaluate(()=>{
     const el=document.querySelector('#scene'),t=window.__mythwroughtTest;
     return {mode:t.caveMode(),center:el.dataset.chunkCenter,
      verts:Number(el.dataset.renderedMeshVertices),
      chunks:Number(el.dataset.loadedChunks),
      playerFeet:Number(el.dataset.playerFeet),
      gl:!!el.getContext('webgl2'),
      noticeHidden:document.querySelector('#notice').hidden};
    });
    assert.equal(snapshot.mode.enabled,true);
    assert.equal(snapshot.noticeHidden,true);
    assert.ok(snapshot.gl&&snapshot.verts>800);
    const raw=await page.screenshot({
     path:join(folder,'realgame-'+shot.name+'-'+width+'x'+height+'.png'),fullPage:true});
    const stats=inspect(raw,width,height);
    assert.ok(stats.paletteBins>=3,'Actual WebGL2 game cave screenshot appears blank: '+shot.name);
    hashes.add(stats.sha256);
    report.images.push({scene:shot.name,...stats,renderedVertices:snapshot.verts,
     loadedChunks:snapshot.chunks,playerFeet:snapshot.playerFeet,sourceHead:head,
     actualIndexMain:true});
   }
   assert.equal(hashes.size,shots.length,'Distinct original game scenes did not render distinctly');
   if(width===667){
    const cell=shots.find(x=>x.name==='switchback-80').at;
    const before=await page.evaluate(([x,y,z])=>window.__mythwroughtTest.block(x,y,z),
      [cell.x,cell.y,cell.z]);
    assert.equal(before,0,'Actual game cave air must exist to place saved block');
    await page.evaluate(([x,y,z])=>window.__mythwroughtTest.placeFixture(x,y,z,8),
      [cell.x,cell.y,cell.z]);
    assert.equal(await page.evaluate(([x,y,z])=>window.__mythwroughtTest.block(x,y,z),
      [cell.x,cell.y,cell.z]),8);
    assert.equal(await page.evaluate(()=>localStorage.getItem('mythwrought-v002-world-'+314159)),null);
    const previousCave=await page.evaluate(()=>localStorage.getItem('mythwrought-caves-v1-seed-'+314159));
    assert.ok(previousCave);
    await page.reload({waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>window.__mythwroughtTest,null,{timeout:70000});
    assert.equal(await page.evaluate(()=>window.__mythwroughtTest.caveMode().enabled),false,
      'Caves must never silently auto-enable on ordinary startup');
    await page.evaluate(()=>document.getElementById('menu').click());
    await page.locator('#seedInput').fill(String(seed));
    await page.evaluate(()=>document.getElementById('caveLoadWorld').click());
    await page.waitForFunction(()=>window.__mythwroughtTest.caveMode().enabled,
      null,{timeout:90000});
    assert.equal(await page.evaluate(([x,y,z])=>window.__mythwroughtTest.block(x,y,z),
      [cell.x,cell.y,cell.z]),8,'Block placement in real main.mjs cave was not preserved by reload');
    assert.equal(await page.evaluate(()=>localStorage.getItem('mythwrought-v002-world-'+314159)),null);
   }
   assert.equal(await page.evaluate(()=>localStorage.getItem('mythwrought-v002-world-179')),original,
    'Existing normal-world canonical save bytes changed while exploring caves');
   assert.deepEqual(errors,[],'Actual game browser errors '+width+'x'+height);
   console.log('CAVE ACTUAL GAME PASS '+width+'x'+height+' · '+shots.length+
     ' authentic index.html/main.mjs WebGL2 screenshots; '+hashes.size+' unique SHA256');
  }finally{await context.close()}
 }
 assert.equal(report.images.length,12);
 report.status='ACTUAL_GAME_WEBGL2_STAGING_PASS';
}catch(e){
 report.status='BLOCKED';report.errors.push(String(e.stack||e));
 console.error('REAL CAVE GAME ACCEPTANCE BLOCKED',String(e.stack||e));
 process.exitCode=1;
}finally{
 await writeFile(join(folder,'manifest.json'),JSON.stringify(report,null,2)+'\n');
 if(browser)await browser.close();
 await new Promise(done=>server.close(done));
}
