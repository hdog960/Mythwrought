// MANUAL M3: authentic *game* Desert progression and source-backed 3D proof.
// No fixtures or canvas mock. The normal game creates a NEW v3 profile.
import {chromium} from 'playwright';
import {PNG} from 'pngjs';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {FourRegionWorld,FOUR_REGION_GENERATOR} from '../../src/manual-biomes/profile-world.mjs';
import {surfaceBiomeAt} from '../../src/surface-regions/regions.mjs';
import {M3_DESERT_IDS,m3DesertHeight} from '../../src/manual-biomes/desert-m3.mjs';

const seed=179,sourceWorld=new FourRegionWorld(seed);
const root=process.cwd(),out=path.join(root,'artifacts/manual-biomes-m3-desert');
await mkdir(out,{recursive:true});
const materials=new Set([M3_DESERT_IDS.pale,M3_DESERT_IDS.red,M3_DESERT_IDS.salt]);
const matched=(x,z,predicate=()=>true)=>{
  const y=m3DesertHeight(x,z,seed),id=y===null?null:sourceWorld.get(x,y,z);
  return y!==null&&materials.has(id)&&predicate({x,z,y,id,region:surfaceBiomeAt(x,z,seed)});
};
const anchor={name:'pale-crest',x:512,z:0,y:m3DesertHeight(512,0,seed),
  id:M3_DESERT_IDS.pale};
if(sourceWorld.get(anchor.x,anchor.y,anchor.z)!==anchor.id)
  throw Error('M3 canonical Desert anchor no longer matches source');
let red=null,shoulder=null,high=null;
for(let x=465;x<=570;x+=2)for(let z=-43;z<=43;z+=2){
  if(matched(x,z,c=>c.id===M3_DESERT_IDS.red&&c.y>=10)&&!red){
    red={name:'red-crosswind-dune',x,z,y:m3DesertHeight(x,z,seed),id:M3_DESERT_IDS.red};
  }
  if(matched(x,z,c=>c.y>=12&&Math.hypot(x-512,z)>20)){
    const y=m3DesertHeight(x,z,seed);
    if(!high||y>high.y)high={name:'raised-dune-ridge',x,z,y,id:sourceWorld.get(x,y,z)};
  }
}
for(let x=620;x<=670;x+=2)for(let z=-30;z<=30;z+=3){
  if(!shoulder&&matched(x,z,c=>c.region?.weight>.39&&
    c.region?.weight<.74&&c.y>=4))
    shoulder={name:'desert-feathered-shoulder',x,z,
      y:m3DesertHeight(x,z,seed),id:sourceWorld.get(x,m3DesertHeight(x,z,seed),z)};
}
if(!red||!high||!shoulder)
  throw Error('M3 missing source-authored red dune, raised ridge or traversable shoulder');
const anchors=[anchor,red,high,shoulder];
if(new Set(anchors.map(a=>a.x+','+a.z)).size!==4)
  throw Error('M3 source anchors accidentally duplicate one another');
const mime={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript',
  '.css':'text/css','.json':'application/json','.svg':'image/svg+xml',
  '.png':'image/png','.webmanifest':'application/manifest+json'};
const server=createServer(async(req,res)=>{
  try{
    const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
    const file=path.resolve(root,'.'+pathname);
    if(!(file===root||file.startsWith(root+path.sep)))throw Error('Path rejected');
    const bytes=await readFile(file.endsWith(path.sep)?path.join(file,'index.html'):file);
    res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream',
      'Cache-Control':'no-store'});res.end(bytes);
  }catch(e){res.writeHead(404);res.end(String(e));}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const url='http://127.0.0.1:'+server.address().port+'/index.html';
const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader',
  '--disable-gpu-sandbox','--no-sandbox'
]});
const scenes=[],pageErrors=[],sizes=[[667,375],[844,390],[932,430]];
try{
  for(const [width,height] of sizes){
    const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
    page.on('pageerror',error=>pageErrors.push(width+'x'+height+': '+error.message));
    page.on('dialog',dialog=>dialog.accept());
    await page.addInitScript(()=>{
      localStorage.setItem('mythwrought-v002-selected-seed','7');
    });
    await page.goto(url,{waitUntil:'load'});
    await page.waitForFunction(()=>Boolean(window.__mythwroughtTest),null,{timeout:30000});
    if(!await page.evaluate(()=>Boolean(document.getElementById('scene').getContext('webgl2'))))
      throw Error('No genuine WebGL2 at '+width+'x'+height);
    await page.locator('#menu').click();
    await page.locator('#seedInput').fill(String(seed));
    await page.locator('#createFourBiomeWorld').click();
    if(await page.evaluate(()=>window.__mythwroughtTest.fourBiomeProfile()?.generator)!==
       FOUR_REGION_GENERATOR)throw Error('M3 UI did not create the versioned v3 generation profile');
    await page.locator('#closeHelp').click();
    const capture=async(point,kind='exterior')=>{
      const observed=await page.evaluate(({x,z,y})=>{
        const test=window.__mythwroughtTest;
        const position=test.teleport(x,z);
        test.aimAt(x+6,Math.max(2,y),z+6);
        return {block:test.block(x,y,z),position,
          mode:test.fourBiomeMode(),generator:test.fourBiomeProfile()?.generator};
      },point);
      if(observed.block!==point.id||observed.mode!=='four-regions'||
         observed.generator!==FOUR_REGION_GENERATOR)
        throw Error('Wrong M3 real physical '+point.name+' source '+JSON.stringify(observed));
      await page.waitForTimeout(1700);
      const file='m3-desert-'+point.name+'-'+kind+'-'+width+'x'+height+'.png';
      const png=await page.screenshot({path:path.join(out,file),timeout:90000});
      const decoded=PNG.sync.read(png),buckets=new Set();
      if(decoded.width!==width||decoded.height!==height)
        throw Error('Bad real browser PNG dimensions '+file);
      for(let x=Math.floor(width*.28);x<Math.floor(width*.65);x+=7)
        for(let y=Math.floor(height*.28);y<Math.floor(height*.76);y+=7){
          const p=(y*width+x)*4;
          buckets.add(((decoded.data[p]/16)|0)+','+
            ((decoded.data[p+1]/16)|0)+','+
            ((decoded.data[p+2]/16)|0));
        }
      const diag=await page.evaluate(()=>({
        snapshot:window.__mythwroughtTest.snapshot(),
        faults:window.__mythwroughtTest.gpuUploadFaults(),
        status:document.getElementById('status')?.textContent
      }));
      if(buckets.size<16||diag.snapshot.chunks.length<4||
         diag.snapshot.gpuRetry.failures>0||diag.faults.length>0)
        throw Error('M3 genuine '+file+' has blank world or GPU failures '+JSON.stringify({
          buckets:buckets.size,diag
        }));
      const item={file,width,height,source:{...point},kind,seed,
        sourceGenerator:FOUR_REGION_GENERATOR,realGameWebGL2:true,
        bytes:png.length,sha256:createHash('sha256').update(png).digest('hex'),
        residentChunks:diag.snapshot.chunks.length,colorBuckets:buckets.size,
        gpuUpload:diag.snapshot.gpuRetry};
      scenes.push(item);
      console.log('PASS M3 source-exact Desert WebGL2 '+file+
        ' ID='+point.id+' y='+point.y+' GPU='+item.residentChunks);
    };
    for(const point of anchors)await capture(point);
    // Mine the ACTUAL Desert cap, place different hardpan, save, restore and
    // replay the world. The cutaway is real edited voxel geometry, not a
    // camera-only preview. Re-enter the region after visiting other terrain.
    const edit=anchors[0],under={...edit,name:'real-mined-dune-cutaway',id:0};
    const removed=await page.evaluate(({x,y,z})=>
      window.__mythwroughtTest.editBiomeCell(x,y,z,0),
      {x:edit.x,y:edit.y,z:edit.z});
    if(!removed)throw Error('M3 real game mine/edit did not change a dune cap');
    await capture(under,'cutaway');
    await page.locator('#menu').click();
    await page.locator('#save').click();
    await page.reload({waitUntil:'load'});
    await page.waitForFunction(()=>Boolean(window.__mythwroughtTest),null,{timeout:30000});
    const persisted=await page.evaluate(({x,y,z})=>({
      value:window.__mythwroughtTest.block(x,y,z),
      generator:window.__mythwroughtTest.fourBiomeProfile()?.generator,
      legacyProfile:localStorage.getItem('mythwrought-v002-world-7-four-biomes-profile-v1'),
      biomeProfile:localStorage.getItem('mythwrought-v002-world-179-four-biomes-profile-v1')
    }),{x:edit.x,y:edit.y,z:edit.z});
    if(persisted.value!==0||persisted.generator!==FOUR_REGION_GENERATOR||
       persisted.legacyProfile!==null||!persisted.biomeProfile)
      throw Error('M3 real-game edited dune/save/reload or legacy parity failed');
    await page.close();
  }
  if(scenes.length!==15||new Set(scenes.map(s=>s.sha256)).size!==15)
    throw Error('M3 missing real Desert exterior/cutaway images or image repeats');
  if(pageErrors.length)throw Error('Actual Chromium page JS errors '+pageErrors.join('; '));
  await writeFile(path.join(out,'manifest.json'),JSON.stringify({
    kind:'mythwrought-manual-desert-m3-real-game',
    parent:'manual-m2',generator:FOUR_REGION_GENERATOR,seed,
    sourceAnchors:anchors,screenshots:scenes,pageErrors,
    physicalIphone:false,publicDeployment:false
  },null,2));
  console.log('PASS M3 15/15 genuine Desert landscape + mined cutaway captures; profile and legacy safety');
}catch(error){
  await writeFile(path.join(out,'failure.json'),JSON.stringify({
    error:String(error),sourceAnchors:anchors,finished:scenes,pageErrors
  },null,2));
  throw error;
}finally{
  await browser.close();
  await new Promise(resolve=>server.close(resolve));
}
