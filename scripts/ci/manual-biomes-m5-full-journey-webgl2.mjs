// M5 draft hard gate: genuine full-distance WASD in the running Chromium game.
// The only test-only actor accessor is READ-ONLY; no teleport, yaw setter, edit
// injection, fake frame advancement or prefilled exploration map.
import {chromium} from 'playwright';
import {PNG} from 'pngjs';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {Pack2LiveWorld} from '../../src/pack2-world.mjs';
import {FourRegionWorld,fourRegionProfile,FOUR_REGION_GENERATOR,
  M5_EXPERIMENTAL_GENERATOR} from '../../src/manual-biomes/profile-world.mjs';
import {planM5NaturalOverland,M5_OVERLAND_TARGETS} from
  '../../src/manual-biomes/overland-walk-m5.mjs';
import {surfaceBiomeAt} from '../../src/surface-regions/regions.mjs';

const dims={'667x375':[667,375],'844x390':[844,390],'932x430':[932,430]};
const viewport=process.env.M5_VIEWPORT||'667x375';
if(!Object.hasOwn(dims,viewport))throw Error('Unsupported viewport');
const [width,height]=dims[viewport],seed=179;
const root=process.cwd(),out=path.join(root,'artifacts/manual-biomes-m5-long-'+viewport);
await mkdir(out,{recursive:true});
const sha256=bytes=>createHash('sha256').update(bytes).digest('hex');
const savedKey='mythwrought-v002-world-'+seed;
const world=new Pack2LiveWorld(new FourRegionWorld(seed,
  fourRegionProfile(seed,M5_EXPERIMENTAL_GENERATOR)));
if(world.base.generationProfile.generator!==M5_EXPERIMENTAL_GENERATOR||
   new FourRegionWorld(seed).generationProfile.generator!==FOUR_REGION_GENERATOR)
  throw Error('Historical default v4 or explicit v5 generator changed');
const routes=M5_OVERLAND_TARGETS.map(target=>{
  const p=planM5NaturalOverland(world,{target:target.name});
  if(!p.ok||!p.withoutTerrainEdits||p.path.length<450)
    throw Error('Source natural route is not certified '+target.name);
  const segments=[];
  for(let i=1;i<p.path.length;i++){
    const a=p.path[i-1],b=p.path[i],dx=b.x-a.x,dz=b.z-a.z;
    if(Math.abs(dx)+Math.abs(dz)!==1)throw Error('Fabricated route step');
    const key=dx===1?'a':dx===-1?'d':dz===1?'s':'w';
    if(segments.at(-1)?.key===key)segments.at(-1).end=b;
    else segments.push({key,end:b});
  }
  return {name:target.name,plan:p,segments,
    hash:sha256(Buffer.from(JSON.stringify(p.path)))};
});
const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript',
  '.mjs':'text/javascript','.json':'application/json','.png':'image/png',
  '.svg':'image/svg+xml','.webmanifest':'application/manifest+json'};
const server=createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,'http://127.0.0.1');
    const f=path.resolve(root,'.'+decodeURIComponent(url.pathname));
    if(!(f===root||f.startsWith(root+path.sep)))throw Error('Unsafe path');
    const b=await readFile(f.endsWith(path.sep)?path.join(f,'index.html'):f);
    res.writeHead(200,{'Content-Type':mime[path.extname(f)]||
      'application/octet-stream','Cache-Control':'no-store'});res.end(b);
  }catch(e){res.writeHead(404);res.end(String(e));}
});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader',
  '--disable-gpu-sandbox','--no-sandbox']});
const report={kind:'m5-full-distance-real-game-keyboard-v1',
  viewport,width,height,seed,profile:M5_EXPERIMENTAL_GENERATOR,
  defaultV4Preserved:true,teleportUsed:false,directPlayerMutation:false,
  syntheticFrameClock:false,physicalIphone:false,
  complete:false,journeys:[],screenshots:[],errors:[]};
const write=()=>writeFile(path.join(out,'manifest.json'),JSON.stringify(report,null,2));
const pose=page=>page.evaluate(()=>window.__mythwroughtTest.m5ObservedPose());
const snap=page=>page.evaluate(()=>window.__mythwroughtTest.snapshot());
async function screen(page,route,kind,observed){
  await page.waitForTimeout(900);
  const state=await snap(page);
  if(!state.chunks?.length||state.graphics?.lost||
     !state.graphics?.shaderReady||state.gpuRetry?.failures)
    throw Error('Invalid real WebGL2 frame or GPU fault');
  const bounds=await page.evaluate(()=>({
    l:document.querySelector('.left')?.getBoundingClientRect().toJSON(),
    r:document.querySelector('.right')?.getBoundingClientRect().toJSON(),
    c:document.getElementById('scene')?.getBoundingClientRect().toJSON()
  }));
  if(!bounds.l||!bounds.r||!bounds.c||
     bounds.l.width<10||bounds.r.width<10||bounds.c.width<100||
     bounds.l.right>bounds.r.left)throw Error('Landscape thumb rails failed');
  const name='m5-full-'+route.name+'-'+kind+'-'+viewport+'.png';
  const bytes=await page.screenshot({path:path.join(out,name),timeout:90000});
  const png=PNG.sync.read(bytes);
  if(png.width!==width||png.height!==height)throw Error('PNG size mismatch');
  const colors=new Set();
  for(let y=8;y<height-8;y+=9)for(let x=8;x<width-8;x+=9){
    const at=(y*width+x)*4;
    colors.add(png.data[at]+','+png.data[at+1]+','+png.data[at+2]);
  }
  if(colors.size<35)throw Error('Blank/unrendered real-game screenshot');
  report.screenshots.push({name,biome:route.name,kind,width,height,
    sha256:sha256(bytes),bytes:bytes.length,distinctColors:colors.size,
    observed,sourceRouteSha256:route.hash,realWebGL2:true,
    residentChunks:state.chunks.length});
  await write();
}
async function exploration(page){
  await page.locator('#miniMapButton').click();
  const map=await page.evaluate(()=>({
    size:Number(document.getElementById('miniMap').dataset.discovered||0),
    raw:localStorage.getItem('mythwrought-exploration-v1-179'),
    text:document.getElementById('explorationCoordinates').textContent
  }));
  await page.locator('#closeExploration').click();
  return map;
}
async function liveSegment(page,segment,route,progress){
  const axis='ad'.includes(segment.key)?'x':'z';
  const sign='as'.includes(segment.key)?1:-1;
  const target=segment.end[axis]+.5;
  let last=await pose(page),remain=(target-last[axis])*sign;
  if(remain<-.6)throw Error('Already overshot physical route segment');
  if(remain<=.2)return;
  const began=Date.now(),budget=18000+Math.ceil(remain/4.25*8000);
  let recent=began,prior=remain,checks=0;
  await page.locator('#scene').focus();
  await page.keyboard.down(segment.key);
  try{
    while(remain>.2){
      await page.waitForTimeout(remain>6?450:remain>2?150:45);
      const p=await pose(page);checks++;
      if(p.seed!==seed||p.creative||!Number.isFinite(p.feet))
        throw Error('Actor seed/creative or finite-body invariant failed');
      const orthogonal=axis==='x'?'z':'x';
      if(Math.abs(p[orthogonal]-(segment.end[orthogonal]+.5))>.65)
        throw Error('Actual actor left safe route corridor');
      remain=(target-p[axis])*sign;
      if(remain<-.6)throw Error('Actual actor overshot safe route');
      if(prior-remain>.035)recent=Date.now();
      prior=remain;
      if(Date.now()-recent>12000||Date.now()-began>budget)
        throw Error('Stalled physical walk '+JSON.stringify({
          biome:route.name,segment,p,remain,ms:Date.now()-began}));
    }
  }finally{await page.keyboard.up(segment.key)}
  await page.waitForTimeout(80);
  last=await pose(page);
  if(Math.hypot(last.x-(segment.end.x+.5),
     last.z-(segment.end.z+.5))>.7)
    throw Error('Ended off certified natural route '+route.name);
  progress.push({key:segment.key,to:[segment.end.x,segment.end.z],
    observed:[last.x,last.z],checks,ms:Date.now()-began});
}
try{
  for(const route of routes){
    const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('dialog',d=>d.accept());
    await page.addInitScript(()=>{
      if(localStorage.getItem('mythwrought-v002-selected-seed')===null)
        localStorage.setItem('mythwrought-v002-selected-seed','7');
    });
    try{
      await page.goto('http://127.0.0.1:'+server.address().port+'/index.html',
        {waitUntil:'load',timeout:90000});
      await page.waitForFunction(()=>Boolean(window.__mythwroughtTest),null,
        {timeout:90000});
      if(!await page.evaluate(()=>Boolean(
        document.getElementById('scene').getContext('webgl2'))))
        throw Error('Genuine WebGL2 context unavailable');
      await page.locator('#menu').click();
      await page.locator('#seedInput').fill(String(seed));
      await page.locator('#createExperimentalV5World').click();
      await page.locator('#closeHelp').click();
      const first=await pose(page);
      if(first.seed!==seed||first.creative||Math.abs(first.yaw-Math.PI)>.001||
         Math.hypot(first.x-(route.plan.start.x+.5),
           first.z-(route.plan.start.z+.5))>.6)
        throw Error('Wrong real-game spawn or yaw; no debug camera steering');
      if(await page.evaluate(()=>
        window.__mythwroughtTest.fourBiomeProfile()?.generator)!==
        M5_EXPERIMENTAL_GENERATOR)throw Error('Explicit v5 UI activation failed');
      const rawBefore=await page.evaluate(k=>localStorage.getItem(k),savedKey);
      if(!rawBefore)throw Error('Missing new world canonical save');
      const mapBefore=await exploration(page);
      const entry={biome:route.name,sourceRouteSha256:route.hash,
        plannedSteps:route.plan.path.length-1,
        plannedSegments:route.segments.length,spawn:first,
        initiallyDiscovered:mapBefore.size,segments:[],arrived:false};
      report.journeys.push(entry);await write();
      const begin=Date.now();
      for(const s of route.segments){
        await liveSegment(page,s,route,entry.segments);
        if(entry.segments.length%4===0||
           entry.segments.length===route.segments.length){
          console.log('M5_ACTUAL_WASD_PROGRESS '+JSON.stringify({
            biome:route.name,viewport,
            done:entry.segments.length,total:route.segments.length,
            last:entry.segments.at(-1).observed,
            wallSeconds:Math.round((Date.now()-begin)/1000)}));
          await write();
        }
      }
      const at=await pose(page),lastCell=route.plan.path.at(-1);
      if(Math.hypot(at.x-(lastCell.x+.5),at.z-(lastCell.z+.5))>.7)
        throw Error('Real player failed to reach natural biome interior');
      const region=surfaceBiomeAt(at.x,at.z,seed);
      if(region?.name!==route.name||region.weight<.72)
        throw Error('Real browser actor not inside requested source biome');
      entry.arrived=true;entry.arrival=at;
      entry.actualWallSeconds=(Date.now()-begin)/1000;
      await screen(page,route,'interior',at);
      await page.locator('#miniMapButton').click();
      const seen=await page.evaluate(()=>({
        size:Number(document.getElementById('miniMap').dataset.discovered||0),
        raw:localStorage.getItem('mythwrought-exploration-v1-179')
      }));
      await screen(page,route,'map',at);
      await page.locator('#closeExploration').click();
      const cell=Math.floor(at.x/4)+','+Math.floor(at.z/4);
      if(!seen.raw||seen.size<=mapBefore.size||
         !JSON.parse(seen.raw).cells.includes(cell))
        throw Error('No authentic location-specific physical map discovery');
      await page.locator('#menu').click();
      await page.locator('#save').click();
      const saved=await page.evaluate(k=>({
        raw:localStorage.getItem(k),
        priorMap:localStorage.getItem('mythwrought-exploration-v1-7'),
        priorProfile:localStorage.getItem(
          'mythwrought-v002-world-7-four-biomes-profile-v1')
      }),savedKey);
      if(saved.raw!==rawBefore||saved.priorMap||saved.priorProfile)
        throw Error('Save changed canonical world/other seed source records');
      await page.reload({waitUntil:'load',timeout:90000});
      await page.waitForFunction(()=>Boolean(window.__mythwroughtTest),null,
        {timeout:90000});
      if(await page.evaluate(()=>
        window.__mythwroughtTest.fourBiomeProfile()?.generator)!==
        M5_EXPERIMENTAL_GENERATOR)
        throw Error('Cold reload selected a different terrain generator');
      const mapAfter=await exploration(page);
      if(mapAfter.size<seen.size||!JSON.parse(mapAfter.raw).cells.includes(cell))
        throw Error('Fog save/cold reload lost the actual distant walked cells');
      const restarted=await pose(page);
      if(restarted.seed!==seed||Math.hypot(restarted.x,restarted.z)>11)
        throw Error('Cold reload did not spawn correctly');
      await screen(page,route,'reloaded',restarted);
      const afterSave=await page.evaluate(k=>localStorage.getItem(k),savedKey);
      if(afterSave!==rawBefore||errors.length)
        throw Error('World write drift or browser page errors '+JSON.stringify(errors));
      entry.savedAndReloaded=true;entry.discoveryAfter=mapAfter.size;
      entry.canonicalSha256=sha256(Buffer.from(rawBefore));
      await write();
      console.log('PASS M5 FULL REAL CHROMIUM KEYBOARD '+JSON.stringify({
        viewport,biome:route.name,steps:entry.plannedSteps,
        sec:entry.actualWallSeconds,discoveries:entry.discoveryAfter}));
    }finally{await page.close()}
  }
  if(report.journeys.length!==4||report.screenshots.length!==12||
     report.journeys.some(j=>!j.arrived||!j.savedAndReloaded)||
     new Set(report.screenshots.filter(s=>s.kind==='interior').map(s=>s.sha256)).size!==4||
     new Set(report.screenshots.filter(s=>s.kind==='map').map(s=>s.sha256)).size!==4)
    throw Error('All 4 genuine routes and 12 unique images are mandatory');
  report.complete=true;await write();
  console.log('PASS M5 FOUR COMPLETE ACTUAL-GAME WASD BIOME ROUTES '+viewport);
}catch(e){report.errors.push(String(e));await write();throw e;}
finally{
  await browser.close();
  await new Promise(ok=>server.close(ok));
}
