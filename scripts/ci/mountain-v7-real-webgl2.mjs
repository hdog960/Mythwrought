// MOUNTAIN V7 isolated REAL ORIGINAL GAME screenshot proof. No fake renders.
// The scene is actual index.html/src/main.mjs + M7 physical FourRegionWorld.
// Test-only camera relocation, explicitly NOT an authentic walking journey.
// Outputs original Chromium WebGL2 PNG bytes and source/viewport manifest.
import {chromium} from 'playwright';
import {PNG} from 'pngjs';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../../src/manual-biomes/profile-world.mjs';
import {planEnvironmentalColumn} from '../../src/manual-biomes/environment-v7.mjs';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import {terrainHeight,BLOCK} from '../../src/voxel.mjs';
import {ENVIRONMENT_GROUND as G} from '../../src/environment-ground.mjs';

const root=process.cwd(),out=path.join(root,'artifacts/mountain-v7-real');
await mkdir(out,{recursive:true});
const seed=179,world=new FourRegionWorld(seed,
  fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
const digest=x=>createHash('sha256').update(x).digest('hex');
const mime={'.html':'text/html','.js':'text/javascript',
  '.mjs':'text/javascript','.css':'text/css','.json':'application/json',
  '.svg':'image/svg+xml','.png':'image/png','.webmanifest':'application/manifest+json'};

function anchors(){
  const grass=[],stone=[];
  for(let z=-80;z<=80;z+=4)for(let x=-592;x<=-432;x+=4){
    const biome=v6BiomeAt(x,z,seed);
    if(biome?.name!=='mountain'||biome.weight<.92)continue;
    const plan=planEnvironmentalColumn(x,z,seed,(a,b,c)=>
      world._environmentBaseline(a,b,c),biome);
    if(!plan.size)continue;
    const y=Math.max(...plan.keys()),id=world.get(x,y,z);
    if(id===BLOCK.GRASS&&y>=5&&y<=11&&world.get(x,y+1,z)===BLOCK.AIR)
      grass.push({x,y,z,id,kind:'native-alpine-grass'});
    if([G.slate,G.scree,G.gneiss,272].includes(id)&&y>=10&&
      world.get(x,y+1,z)===BLOCK.AIR)
      stone.push({x,y,z,id,kind:'original-mountain-rock'});
  }
  const first=grass[0],second=grass.find(p=>
    first&&Math.hypot(p.x-first.x,p.z-first.z)>26);
  const rock=stone.find(p=>
    first&&Math.hypot(p.x-first.x,p.z-first.z)<48)??stone[0];
  if(!first||!second||!rock)throw Error('Real V7 source lacks separate visible alpine meadows and rock');
  return [first,second,rock];
}
const sites=anchors();
const server=createServer(async(req,res)=>{
  try{
    const name=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
    const file=path.resolve(root,'.'+name);
    if(!(file===root||file.startsWith(root+path.sep)))throw Error('unsafe');
    const target=file===root?path.join(root,'index.html'):file;
    const bytes=await readFile(target);
    res.writeHead(200,{'Content-Type':mime[path.extname(target)]||
      'application/octet-stream','Cache-Control':'no-store'});
    res.end(bytes);
  }catch(e){res.writeHead(404);res.end(String(e));}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader',
  '--disable-gpu-sandbox','--no-sandbox'
]});
const sizes=[[667,375],[932,430],[956,440]];
const frames=[],errors=[],gpu=[];
try{
  for(const [width,height] of sizes){
    const context=await browser.newContext({viewport:{width,height},
      deviceScaleFactor:1});
    const page=await context.newPage();
    page.on('pageerror',e=>errors.push(width+'x'+height+': '+e.message));
    page.on('dialog',dialog=>dialog.accept());
    // Start on a separate untouched seed. The original game's explicit
    // SWITCH WORLD action activates an unused seed as a genuine M7 profile.
    // Starting with seed 179 already selected would intentionally fail the
    // original isUnclaimedWorldSeed guard and load a legacy world instead.
    await page.addInitScript(()=>localStorage.setItem(
      'mythwrought-v002-selected-seed','7'));
    await page.goto('http://127.0.0.1:'+server.address().port+'/index.html',
      {waitUntil:'load',timeout:90000});
    await page.waitForFunction(()=>Boolean(window.__mythwroughtTest),null,
      {timeout:90000});
    await page.locator('#menu').click();
    await page.locator('#seedInput').fill(String(seed));
    await page.locator('#switchWorld').click();
    const activated=await page.evaluate(()=>({
      generator:window.__mythwroughtTest.fourBiomeProfile()?.generator,
      webgl2:Boolean(document.getElementById('scene')?.getContext('webgl2')),
      status:document.getElementById('seedMessage')?.textContent??null
    }));
    if(activated.generator!==M7_ENVIRONMENT_GENERATOR||!activated.webgl2)
      throw Error('Original-game M7 physical profile did not activate '+
        JSON.stringify({width,height,activated}));
    // The original Switch World workflow leaves the settings modal open.
    // Close it through the real RETURN control before any original-game image.
    // Never accept modal-covered images as distinct mountain scene evidence.
    await page.locator('#closeHelp').click();
    await page.waitForFunction(()=>document.getElementById('help')?.hidden===true,
      null,{timeout:15000});
    const before=await page.evaluate(()=>localStorage.getItem(
      'mythwrought-v002-world-179'));
    for(const site of sites){
      // A real source block ID does not establish that the original camera
      // can SEE it. Earlier frames looked into an intervening gray wall or
      // empty skyline. Sample actual live block occlusion before recording.
      // Keep all camera movement in the localhost-only diagnostic interface.
      const observed=await page.evaluate(({x,y,z})=>{
        const api=window.__mythwroughtTest;
        const offsets=[[-10,-10],[10,10],[-10,10],[10,-10],
          [-14,0],[14,0],[0,-14],[0,14],
          [-18,-8],[18,8],[-8,18],[8,-18]];
        const attempts=[];
        for(const [dx,dz] of offsets){
          const camera=api.teleport(x+dx,z+dz);
          const distance=Math.hypot(x+.5-camera.x,z+.5-camera.z);
          if(distance<6||distance>30)continue;
          const start=[camera.x,camera.feet+1.55,camera.z];
          const end=[x+.5,y+1.02,z+.5];
          const length=Math.hypot(...end.map((v,i)=>v-start[i]));
          let obstruction=null;
          for(let d=.7;d<length-1.1;d+=.4){
            const t=d/length;
            const bx=Math.floor(start[0]+t*(end[0]-start[0]));
            const by=Math.floor(start[1]+t*(end[1]-start[1]));
            const bz=Math.floor(start[2]+t*(end[2]-start[2]));
            const block=api.block(bx,by,bz);
            if(block!==0){obstruction={x:bx,y:by,z:bz,id:block};break;}
          }
          attempts.push({camera,distance,obstruction});
        }
        const clear=attempts.filter(a=>!a.obstruction)
          .sort((a,b)=>Math.abs(a.distance-13)-Math.abs(b.distance-13));
        if(!clear.length)return {id:api.block(x,y,z),
          generator:api.fourBiomeProfile()?.generator,
          sightlineVerified:false,attempts};
        const chosen=clear[0];
        api.teleport(chosen.camera.x,chosen.camera.z);
        api.aimAt(x,y,z);
        return {id:api.block(x,y,z),camera:chosen.camera,
          generator:api.fourBiomeProfile()?.generator,
          sightlineVerified:true,clearCandidates:clear.length,
          sightlineDistance:chosen.distance};
      },site);
      if(observed.id!==site.id||
        observed.generator!==M7_ENVIRONMENT_GENERATOR||
        !observed.sightlineVerified)
        throw Error('Source/world or visible-target mismatch '+JSON.stringify({site,observed}));
      await page.waitForFunction(()=>window.__mythwroughtTest.snapshot().chunks.length>=4,
        null,{timeout:120000});
      await page.waitForTimeout(1250);
      const file='mountain-v7-'+site.kind+'-'+site.x+'-'+site.z+'-'+
        width+'x'+height+'.png';
      const bytes=await page.screenshot({path:path.join(out,file),timeout:90000});
      const img=PNG.sync.read(bytes);
      if(img.width!==width||img.height!==height)
        throw Error('PNG dimensions invalid '+file);
      const colors=new Set();
      for(let py=Math.floor(height*.25);py<Math.floor(height*.8);py+=7)
        for(let px=Math.floor(width*.2);px<Math.floor(width*.8);px+=7){
          const at=(py*width+px)*4;
          colors.add([0,1,2].map(c=>img.data[at+c]>>4).join(','));
        }
      const state=await page.evaluate(()=>({
        snapshot:window.__mythwroughtTest.snapshot(),
        faults:window.__mythwroughtTest.gpuUploadFaults(),
        glError:document.getElementById('scene').getContext('webgl2').getError()
      }));
      if(colors.size<16||state.glError||state.faults.length||
        state.snapshot.gpuRetry.failures||
        state.snapshot.chunks.length<4)
        throw Error('Real M7 screenshot GPU failure '+
          JSON.stringify({file,colors:colors.size,state}));
      frames.push({file,width,height,site,cameraTestOnly:true,
        camera:observed.camera,sourceSightlineVerified:observed.sightlineVerified,
        clearCameraCandidates:observed.clearCandidates,
        actualWalking:false,realChromiumWebGL2:true,
        sha256:digest(bytes),colorBuckets:colors.size,
        residentChunks:state.snapshot.chunks.length,
        glError:state.glError});
    }
    const after=await page.evaluate(()=>localStorage.getItem(
      'mythwrought-v002-world-179'));
    if(before!==after)throw Error('Original world storage changed during screenshot acceptance');
    gpu.push({width,height,chunks:frames.at(-1).residentChunks,
      schema1SaveBytesUnchanged:true});
    await context.close();
  }
  if(frames.length!==9||
    new Set(frames.map(f=>f.sha256)).size!==9||errors.length)
    throw Error('Incomplete M7 authentic visual evidence '+JSON.stringify({count:frames.length,errors}));
  await writeFile(path.join(out,'manifest.json'),JSON.stringify({
    kind:'mythwrought-mountain-v7-original-game-alpine',
    generator:M7_ENVIRONMENT_GENERATOR,seed,sites,frames,gpu,
    originalIndexMain:true,viewportSimulationNotPhysicalIphone:true,
    cameraRelocationNotWalking:true,errors
  },null,2)+'\n');
  console.log('MOUNTAIN V7 ACTUAL ORIGINAL GAME WEBGL2 9/9 PNG PASS '+
    JSON.stringify({sites:sites.length,viewports:sizes.length,gpu}));
}catch(e){
  await writeFile(path.join(out,'failure.json'),JSON.stringify({
    error:String(e),sites,frames,gpu,errors
  },null,2)+'\n');
  throw e;
}finally{
  await browser.close();
  await new Promise(resolve=>server.close(resolve));
}
