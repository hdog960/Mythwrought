// M4 genuine source-specific Chromium WebGL2 geology acceptance.
// Runs actual game's new-world UI and authoritative edit/save/reload, not a
// static presentation or detached, read-only biome preview.
import {chromium} from 'playwright';
import {PNG} from 'pngjs';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {FourRegionWorld,FOUR_REGION_GENERATOR} from '../../src/manual-biomes/profile-world.mjs';
import {m4PhysicalTerrainHeight,M4_PHYSICAL_MATERIALS}
  from '../../src/manual-biomes/three-regions-m4.mjs';

const root=process.cwd(),out=path.join(root,'artifacts/manual-biomes-m4-live');
await mkdir(out,{recursive:true});
const sha=raw=>createHash('sha256').update(raw).digest('hex');
const [worldSource,m4Source]=await Promise.all([
  readFile(path.join(root,'src/manual-biomes/profile-world.mjs')),
  readFile(path.join(root,'src/manual-biomes/three-regions-m4.mjs'))
]);
const exactSource=Object.freeze({
  profileWorldSHA256:sha(worldSource),m4TerrainSHA256:sha(m4Source),
  gitSourceCommit:process.env.GITHUB_SHA||null
});
const definitions=[
  {name:'snow',x:0,z:512,prior:M4_PHYSICAL_MATERIALS.snow.cap},
  {name:'mountain',x:-512,z:0,prior:M4_PHYSICAL_MATERIALS.mountain.cap},
  {name:'enchanted',x:0,z:-512,prior:M4_PHYSICAL_MATERIALS.enchanted.cap}
];
const baseline=new FourRegionWorld(179),anchors=[];
for(const region of definitions){
  let found=null;
  // Seek a *genuinely changed* visible material, not the unchanged canonical
  // anchor or a metadata-only generator-version difference.
  for(let dx=-29;dx<=29&&!found;dx+=2)
    for(let dz=-29;dz<=29;dz+=2){
      const x=region.x+dx,z=region.z+dz,y=m4PhysicalTerrainHeight(x,z,179);
      if(y===null)continue;
      const block=baseline.get(x,y,z);
      if(block!==region.prior&&block!==0&&
         Object.values(M4_PHYSICAL_MATERIALS[region.name]).includes(block)){
        found={name:region.name,x,y,z,id:block,priorSurface:region.prior};
        break;
      }
    }
  if(!found)throw Error('M4 '+region.name+' has no authentic authored surface variant');
  anchors.push(Object.freeze(found));
}
const types={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript',
  '.css':'text/css','.json':'application/json','.svg':'image/svg+xml',
  '.png':'image/png','.webmanifest':'application/manifest+json'};
const server=createServer(async(req,res)=>{
  try{
    const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
    const target=path.resolve(root,'.'+pathname);
    if(!(target===root||target.startsWith(root+path.sep)))
      throw Error('Unsafe repository path');
    const content=await readFile(target.endsWith(path.sep)?
      path.join(target,'index.html'):target);
    res.writeHead(200,{'Content-Type':types[path.extname(target)]||
      'application/octet-stream','Cache-Control':'no-store'});
    res.end(content);
  }catch(error){res.writeHead(404);res.end(String(error));}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const url='http://127.0.0.1:'+server.address().port+'/index.html';
const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader',
  '--disable-gpu-sandbox','--no-sandbox'
]});
const scenes=[],jsErrors=[],dims=[[667,375],[844,390],[932,430]];
try{
  for(const [width,height] of dims){
    const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
    page.on('pageerror',e=>jsErrors.push(width+'x'+height+': '+e.message));
    page.on('dialog',dialog=>dialog.accept());
    await page.addInitScript(()=>{
      if(localStorage.getItem('mythwrought-v002-selected-seed')===null)
        localStorage.setItem('mythwrought-v002-selected-seed','7');
    });
    await page.goto(url,{waitUntil:'load'});
    await page.waitForFunction(()=>Boolean(window.__mythwroughtTest),null,{timeout:25000});
    const gl=await page.evaluate(()=>
      Boolean(document.getElementById('scene').getContext('webgl2')));
    if(!gl)throw Error('Actual M4 game WebGL2 unavailable');
    await page.locator('#menu').click();
    await page.locator('#seedInput').fill('179');
    await page.locator('#createFourBiomeWorld').click();
    if(await page.evaluate(()=>window.__mythwroughtTest.fourBiomeProfile()?.generator)!==
        FOUR_REGION_GENERATOR)
      throw Error('M4 explicitly new world did not activate v4 immutable profile');
    await page.locator('#closeHelp').click();
    const capture=async(point,kind)=>{
      const actual=await page.evaluate(({x,y,z,kind,name})=>{
        const t=window.__mythwroughtTest;
        if(kind==='cutaway'){
          t.teleport(x-6,z-6);
          t.aimAt(x,y,z);
        }else if(name==='enchanted'){
          // Previous source-specific Enchanted exterior aimed OUT of the
          // biome at the empty sky; frame from a safe outward shoulder and
          // look INWARD across real glade stone and legacy canopy.
          t.teleport(x,z+7);
          t.aimAt(x+4,Math.max(2,y),z-11);
        }else{
          t.teleport(x,z);
          t.aimAt(x+6,Math.max(2,y),z+6);
        }
        return {value:t.block(x,y,z),profile:t.fourBiomeProfile()?.generator,
          mode:t.fourBiomeMode()};
      },{...point,kind});
      if(actual.value!==(kind==='cutaway'?0:point.id)||
         actual.profile!==FOUR_REGION_GENERATOR||actual.mode!=='four-regions')
        throw Error('Actual M4 '+point.name+' terrain not source-exact '+JSON.stringify(actual));
      await page.waitForTimeout(1600);
      const file='m4-'+point.name+'-'+kind+'-'+width+'x'+height+'.png';
      const png=await page.screenshot({path:path.join(out,file),timeout:90000});
      const decoded=PNG.sync.read(png);
      if(decoded.width!==width||decoded.height!==height)
        throw Error('M4 PNG size mismatch '+file);
      const colors=new Set();
      for(let x=Math.floor(width*.28);x<Math.floor(width*.66);x+=7)
        for(let y=Math.floor(height*.27);y<Math.floor(height*.75);y+=7){
          const p=(y*width+x)*4;
          colors.add(((decoded.data[p]/16)|0)+','+
            ((decoded.data[p+1]/16)|0)+','+
            ((decoded.data[p+2]/16)|0));
        }
      const diag=await page.evaluate(()=>({
        snapshot:window.__mythwroughtTest.snapshot(),
        faults:window.__mythwroughtTest.gpuUploadFaults()
      }));
      // A few colorful UI pixels and a sky gradient are not convincing
      // proof of a visible biome. Reject horizon-only exterior frames.
      const minColors=kind==='exterior'?28:24;
      if(colors.size<minColors||diag.snapshot.chunks.length<5||
         diag.snapshot.gpuRetry.failures>0||diag.faults.length)
        throw Error('M4 '+file+' blank or GPU upload failure '+JSON.stringify({
          colors:colors.size,diag
        }));
      const sample={file,width,height,region:point.name,kind,seed:179,
        sourceBlock:point.id,observedBlock:actual.value,
        worldX:point.x,worldY:point.y,worldZ:point.z,
        shaderContext:'genuine-WebGL2',bytes:png.length,sha256:sha(png),
        visibleColorBuckets:colors.size,
        residentGpuChunks:diag.snapshot.chunks.length,
        gpuRetry:diag.snapshot.gpuRetry,source:exactSource};
      scenes.push(sample);
      console.log('PASS M4 actual '+point.name+' '+kind+' '+width+'x'+height+
        ' solid '+point.id+' GPU '+sample.residentGpuChunks);
    };
    for(const point of anchors){
      await capture(point,'exterior');
      const edited=await page.evaluate(({x,y,z})=>
        window.__mythwroughtTest.editBiomeCell(x,y,z,0),point);
      if(!edited)throw Error('M4 actual game cannot mine '+point.name);
      await capture(point,'cutaway');
    }
    await page.locator('#menu').click();
    await page.locator('#save').click();
    await page.reload({waitUntil:'load'});
    await page.waitForFunction(()=>Boolean(window.__mythwroughtTest),null,{timeout:25000});
    const restored=await page.evaluate(points=>({
      blocks:points.map(p=>window.__mythwroughtTest.block(p.x,p.y,p.z)),
      profile:window.__mythwroughtTest.fourBiomeProfile()?.generator,
      oldSeedUnprofiled:localStorage.getItem(
        'mythwrought-v002-world-7-four-biomes-profile-v1')===null,
      newSeedProfiled:localStorage.getItem(
        'mythwrought-v002-world-179-four-biomes-profile-v1')!==null
    }),anchors);
    if(restored.blocks.some(x=>x!==0)||restored.profile!==FOUR_REGION_GENERATOR||
       !restored.oldSeedUnprofiled||!restored.newSeedProfiled)
      throw Error('M4 genuine all-three-region edit/save/reload failed '+
        JSON.stringify(restored));
    await page.close();
  }
  if(scenes.length!==18||new Set(scenes.map(x=>x.sha256)).size!==18)
    throw Error('M4 expected 18 distinct source-specific actual browser scenes');
  if(jsErrors.length)throw Error('Actual game JS errors '+jsErrors.join('; '));
  await writeFile(path.join(out,'manifest.json'),JSON.stringify({
    kind:'mythwrought-manual-m4-registered-terrain-physical',
    generator:FOUR_REGION_GENERATOR,source:exactSource,
    seedsPreserved:true,creatorIphoneTested:false,published:false,
    anchors,scenes,jsErrors
  },null,2));
  console.log('PASS M4 18/18 genuine Snow, Mountain and Enchanted exterior/cutaway WebGL2 captures');
}catch(e){
  await writeFile(path.join(out,'failure.json'),JSON.stringify({
    error:String(e),source:exactSource,anchors,scenes,jsErrors
  },null,2));
  throw e;
}finally{
  await browser.close();
  await new Promise(resolve=>server.close(resolve));
}
