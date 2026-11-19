// MYTHWROUGHT V6 protected real-game screenshot/offline proof.
// Test-only camera relocation is explicitly recorded; NEVER present this as
// natural foot traversal. Physical terrain comes from the actual V6 world.
// Legacy V2-V5 baseline and player saves are not mutated by screenshot proof.
import {chromium} from 'playwright';
import {PNG} from 'pngjs';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {FourRegionWorld,fourRegionProfile,M6_BALANCED_GENERATOR}
  from '../../src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import {BLOCK} from '../../src/voxel.mjs';
import {WORLD_MAX_Y} from '../../src/depth.mjs';

const root=process.cwd(),out=path.join(root,'artifacts/sky-s6-v6-live');
await mkdir(out,{recursive:true});
const seed=179,sourceWorld=new FourRegionWorld(seed,
  fourRegionProfile(seed,M6_BALANCED_GENERATOR));
const registered={
  plains:new Set([BLOCK.GRASS]),
  desert:new Set([256,257,258,259,260,261,262,263,264,266]),
  snow:new Set([272,277,278,279]),
  mountain:new Set([302,303,305,307]),
  enchanted:new Set([286,293,294,289])
};
const centers={plains:[0,0],desert:[512,0],snow:[0,512],
  mountain:[-512,0],enchanted:[0,-512]};
function findNaturalPhysicalAnchor(name,[cx,cz]){
  // Prefer a representative biome INTERIOR over the previous first corner
  // match, which generated authentic but unusably close cliff screenshots.
  for(let radius=0;radius<=48;radius+=8){
    for(let dx=-radius;dx<=radius;dx+=8){
      for(let dz=-radius;dz<=radius;dz+=8){
        if(Math.max(Math.abs(dx),Math.abs(dz))!==radius)continue;
        const x=cx+dx,z=cz+dz;
        if((v6BiomeAt(x,z,seed)?.name||'plains')!==name)continue;
        for(let y=WORLD_MAX_Y-1;y>=0;y--){
          const id=sourceWorld.get(x,y,z);
          if(registered[name].has(id)&&sourceWorld.get(x,y+1,z)===BLOCK.AIR)
            return {name,x,y,z,id};
        }
      }
    }
  }
  throw Error('V6 '+name+' has no visible true solid source anchor around '+cx+','+cz);
}
const anchors=Object.entries(centers).map(([name,center])=>
  findNaturalPhysicalAnchor(name,center));
const sha=b=>createHash('sha256').update(b).digest('hex');
const mime={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript',
  '.css':'text/css','.json':'application/json','.svg':'image/svg+xml',
  '.png':'image/png','.webmanifest':'application/manifest+json'};
const server=createServer(async(req,res)=>{
  try{
    const name=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
    const file=path.resolve(root,'.'+name);
    if(!(file===root||file.startsWith(root+path.sep)))throw Error('unsafe path');
    // SW precaches './' as well as index.html; path.resolve() strips the
    // trailing slash, so resolve the project root explicitly to index.html.
    const target=file===root?path.join(root,'index.html'):file;
    const bytes=await readFile(target);
    res.writeHead(200,{'Content-Type':mime[path.extname(target)]||
      'application/octet-stream','Cache-Control':'no-store'});res.end(bytes);
  }catch(e){res.writeHead(404);res.end(String(e));}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader',
  '--disable-gpu-sandbox','--no-sandbox'
]});
const frames=[],checks=[],errors=[],sizes=[[667,375],[844,390],[932,430]];
try{
  for(const [width,height] of sizes){
    const context=await browser.newContext({
      viewport:{width,height},deviceScaleFactor:1});
    const page=await context.newPage();
    page.on('pageerror',e=>errors.push(width+'x'+height+': '+e.message));
    page.on('dialog',d=>d.accept());
    await page.addInitScript(()=>{
      if(localStorage.getItem('mythwrought-v002-selected-seed')===null)
        localStorage.setItem('mythwrought-v002-selected-seed','7');
    });
    const url='http://127.0.0.1:'+server.address().port+'/index.html';
    await page.goto(url,{waitUntil:'load'});
    await page.waitForFunction(()=>Boolean(window.__mythwroughtTest),null,
      {timeout:30000});
    if(!await page.evaluate(()=>
      Boolean(document.getElementById('scene').getContext('webgl2'))))
      throw Error('V6 actual Chromium WebGL2 missing at '+width+'x'+height);
    await page.locator('#menu').click();
    await page.locator('#seedInput').fill(String(seed));
    if(await page.locator('#createBalancedV6World').count()!==1)
      throw Error('V6 real-game UI action missing');
    await page.locator('#createBalancedV6World').click();
    const profile=await page.evaluate(()=>
      window.__mythwroughtTest.fourBiomeProfile()?.generator);
    if(profile!==M6_BALANCED_GENERATOR)
      throw Error('V6 real-game profile did not activate: '+profile);
    await page.locator('#closeHelp').click();
    for(const anchor of anchors){
      const observed=await page.evaluate(({x,y,z})=>{
        const test=window.__mythwroughtTest;
        // Inspect the TRUE cap from 24 blocks away, never from inside
        // its own wall. Test-only viewpoint is disclosed, not foot travel.
        const camera=test.teleport(x-24,z-24);
        test.aimAt(x,Math.max(y,2),z);
        return {id:test.block(x,y,z),generator:test.fourBiomeProfile()?.generator,
          camera};
      },anchor);
      if(observed.id!==anchor.id||observed.generator!==M6_BALANCED_GENERATOR)
        throw Error('V6 real-game geometry/profiling mismatch '+JSON.stringify({
          anchor,observed}));
      await page.waitForFunction(()=>
        window.__mythwroughtTest.snapshot().chunks.length>=4,null,{timeout:90000});
      await page.waitForTimeout(1500);
      const name='v6-real-'+anchor.name+'-'+width+'x'+height+'.png';
      const bytes=await page.screenshot({path:path.join(out,name),timeout:90000});
      const image=PNG.sync.read(bytes);
      if(image.width!==width||image.height!==height)
        throw Error('Bad V6 real PNG '+name);
      const colors=new Set();
      for(let y=Math.floor(height*.28);y<Math.floor(height*.74);y+=7)
        for(let x=Math.floor(width*.27);x<Math.floor(width*.70);x+=7){
          const p=(y*width+x)*4;
          colors.add(Math.floor(image.data[p]/16)+','+
            Math.floor(image.data[p+1]/16)+','+
            Math.floor(image.data[p+2]/16));
        }
      const diag=await page.evaluate(()=>({
        snapshot:window.__mythwroughtTest.snapshot(),
        faults:window.__mythwroughtTest.gpuUploadFaults()
      }));
      if(colors.size<16||diag.snapshot.chunks.length<4||
        diag.snapshot.gpuRetry.failures>0||diag.faults.length)
        throw Error('V6 blank/error GPU proof '+JSON.stringify({name,colors:colors.size,
          chunks:diag.snapshot.chunks.length,faults:diag.faults}));
      frames.push({name,width,height,anchor,observed,phase:'physical',cameraMovedForEvidence:true,
        actualPlayerWalkingProof:false,realChromium:true,webgl2:true,
        sourceGenerator:M6_BALANCED_GENERATOR,sha256:sha(bytes),
        bytes:bytes.length,colorBuckets:colors.size,
        residentChunks:diag.snapshot.chunks.length});
      // NEW: genuine live five-biome sky proof, not inferred from native swatches.
      // The same authentic source anchor is observed in real Chromium WebGL2
      // at day and night. Camera relocation is explicitly labeled as such.
      for(const phase of ['day','night']){
        await page.locator('#menu').click();
        await page.locator(phase==='day'?'#skySetDay':'#skySetNight').click();
        await page.locator('#closeHelp').click();
        await page.waitForFunction(({name,generator,night})=>{
          const canvas=document.querySelector('#scene');
          if(!canvas||canvas.dataset.skyS6SourceStatus!=='authoritative-v6-biome-source'||
             canvas.dataset.skyS6WorldBiomeName!==name||
             canvas.dataset.skyS6WorldBiomeCount!=='5')return false;
          if(name==='plains'){
            if(canvas.dataset.skyS6BiomeName!=='none'||canvas.dataset.skyS6Profile!=='none')
              return false;
          }else if(canvas.dataset.skyS6BiomeName!==name||
              canvas.dataset.skyS6Profile!==generator||
              Number(canvas.dataset.skyS6BiomeStrength)<.6)return false;
          return night?(+canvas.dataset.skyDaylight<.01&&
            +canvas.dataset.skyS4StarVisibility>.8):
            (+canvas.dataset.skyDaylight>.99&&
              +canvas.dataset.skyS4StarVisibility===0);
        },{name:anchor.name,generator:M6_BALANCED_GENERATOR,night:phase==='night'},
        {timeout:30000});
        await page.waitForTimeout(800);
        const skyStatus=await page.evaluate(()=>{
          const canvas=document.querySelector('#scene');
          const gl=canvas.getContext('webgl2');
          const frame=window.__mythwroughtTest.snapshot();
          return {worldBiome:canvas.dataset.skyS6WorldBiomeName,
            source:canvas.dataset.skyS6SourceStatus,
            biome:canvas.dataset.skyS6BiomeName,
            strength:Number(canvas.dataset.skyS6BiomeStrength),
            generator:canvas.dataset.skyS6Profile,
            horizon:JSON.parse(canvas.dataset.skyS6Horizon),
            fog:JSON.parse(canvas.dataset.skyFog),
            daylight:Number(canvas.dataset.skyDaylight),
            stars:Number(canvas.dataset.skyS4StarVisibility),
            moonCount:Number(canvas.dataset.skyMoonCount),
            chunks:frame.chunks.length,
            glError:gl.getError(),glNoError:gl.NO_ERROR,
            gpuRetry:frame.gpuRetry?.failures||0};
        });
        if(skyStatus.worldBiome!==anchor.name||
          skyStatus.source!=='authoritative-v6-biome-source'||
          skyStatus.moonCount!==3||skyStatus.chunks<4||
          skyStatus.glError!==skyStatus.glNoError||skyStatus.gpuRetry!==0)
          throw Error('V6 genuine sky renderer/source mismatch '+JSON.stringify({anchor,phase,skyStatus}));
        if(anchor.name==='plains'&&
          (skyStatus.biome!=='none'||skyStatus.generator!=='none'))
          throw Error('Plains cannot inherit a special-biome sky');
        const picture='v6-sky-'+anchor.name+'-'+phase+'-'+width+'x'+height+'.png';
        const imageBytes=await page.screenshot({path:path.join(out,picture),timeout:90000});
        const parsed=PNG.sync.read(imageBytes);
        if(parsed.width!==width||parsed.height!==height||imageBytes.length<15000)
          throw Error('V6 actual sky image invalid '+picture);
        frames.push({name:picture,phase,width,height,anchor,
          atmosphere:skyStatus,originalGame:true,realChromium:true,
          cameraMovedForEvidence:true,actualPlayerWalkingProof:false,
          sourceGenerator:M6_BALANCED_GENERATOR,
          sha256:sha(imageBytes),bytes:imageBytes.length});
      }
    }
    // Explicitly verify real source-cache completion with the new V6 JS,
    // then cold reload with the actual Chromium network entirely disabled.
    await page.waitForFunction(async()=>{
      const keys=await caches.keys();
      return keys.includes('mythwrought-m5-shell-20261119-v6-s6-recorder-v1');
    },null,{timeout:180000});
    const before=await page.evaluate(async()=>{
      const name='mythwrought-m5-shell-20261119-v6-s6-recorder-v1';
      const cache=await caches.open(name);
      const files=(await cache.keys()).map(x=>x.url);
      const requiredSky=['sky-atmosphere.mjs','sky-biome-adapter.mjs',
        'sky-v6-adapter.mjs','sky-moons.mjs','sky-stars.mjs','sky-events.mjs',
        'world-clock.mjs'].every(name=>files.some(uri=>uri.endsWith('/src/'+name)));
      return {assets:files.length,requiredSky,hasV6:files.some(x=>
        x.endsWith('/src/manual-biomes/v6-balanced-biomes.mjs')),
        hasMain:files.some(x=>x.endsWith('/src/main.mjs')),
        controlled:Boolean(navigator.serviceWorker.controller),
        save:localStorage.getItem('mythwrought-v002-world-179')};
    });
    if(!before.requiredSky||!before.hasV6||!before.hasMain||before.assets<217||
       !before.controlled||!before.save)
      throw Error('V6 online atomic cache missing '+JSON.stringify(before));
    await context.setOffline(true);
    await page.reload({waitUntil:'load',timeout:90000});
    await page.waitForFunction(()=>Boolean(window.__mythwroughtTest),
      null,{timeout:90000});
    await page.waitForTimeout(750);
    const after=await page.evaluate(()=>({
      generator:window.__mythwroughtTest.fourBiomeProfile()?.generator,
      webgl2:Boolean(document.getElementById('scene').getContext('webgl2')),
      chunks:window.__mythwroughtTest.snapshot().chunks.length,
      save:localStorage.getItem('mythwrought-v002-world-179')
    }));
    if(after.generator!==M6_BALANCED_GENERATOR||!after.webgl2||
      after.chunks<4||after.save!==before.save)
      throw Error('V6 network-disabled cold reload failed '+
        JSON.stringify({width,height,before,after}));
    checks.push({width,height,realChromium:true,sourceVersion:profile,
      savedWorldBytesUnchanged:true,offlineCacheAssets:before.assets,
      offlineCacheIncludesV6:true,offlineCacheIncludesSevenSkySources:true,offlineColdReload:true,
      offlineWebGL2:true,realWorldResidentChunks:after.chunks});
    await context.close();
  }
  if(frames.length!==45||new Set(frames.map(x=>x.sha256)).size!==45||
     checks.length!==3||errors.length)
    throw Error('V6 incomplete real screenshot/offline evidence '+JSON.stringify({
      frames:frames.length,checks:checks.length,errors}));
  await writeFile(path.join(out,'manifest.json'),JSON.stringify({
    kind:'mythwrought-s6-v6-real-chromium-five-biome-day-night',seed,
    generator:M6_BALANCED_GENERATOR,physicalIphone:false,
    simulatedOfflineHomeScreenNotPhysicalIphone:true,
    cameraRelocationOnlyForVisualEvidence:true,realFootJourneyEvidence:false,
    anchors,frames,checks,errors
  },null,2));
  for(const phase of ['day','night']){
    const states=frames.filter(f=>f.phase===phase);
    if(states.length!==15)throw Error('Missing fifteen '+phase+' V6 sky states');
    for(const [w,h] of sizes){
      const same=states.filter(s=>s.width===w&&s.height===h);
      if(same.length!==5||new Set(same.map(s=>s.atmosphere.worldBiome)).size!==5)
        throw Error('Five original-game '+phase+' V6 biome states missing '+w+'x'+h);
      const special=same.filter(s=>s.atmosphere.worldBiome!=='plains');
      if(new Set(special.map(s=>JSON.stringify(s.atmosphere.horizon))).size!==4||
        new Set(special.map(s=>JSON.stringify(s.atmosphere.fog))).size!==4)
        throw Error('Original S6 palettes not distinct on V6 '+phase+' '+w+'x'+h);
    }
  }
  console.log('PASS V6+S6 real-world 45/45 WebGL2 PNGs incl 30 day/night sky and 3/3 network-disabled cold reloads');
}catch(error){
  await writeFile(path.join(out,'failure.json'),JSON.stringify({
    error:String(error),anchors,frames,checks,errors
  },null,2));
  throw error;
}finally{
  await browser.close();
  await new Promise(resolve=>server.close(resolve));
}
