// MYTHWROUGHT M2 independent authentic Chromium/WebGL2 biome acceptance.
// Runs against the ACTUAL game's index.html and editable terrain, never a
// mocked canvas or separate preview mesher. Only localhost has debug probes.
// This script never deploys or alters a public save.
import {chromium} from 'playwright';
import {PNG} from 'pngjs';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {FourRegionWorld,fourRegionProfile,FOUR_REGION_GENERATOR,M6_BALANCED_GENERATOR}
  from '../../src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import {WORLD_MAX_Y} from '../../src/depth.mjs';
import {BLOCK} from '../../src/voxel.mjs';

const root=process.cwd();
const out=path.join(root,'artifacts/manual-biomes-m2-live');
await mkdir(out,{recursive:true});
const types={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript',
  '.css':'text/css','.json':'application/json','.svg':'image/svg+xml',
  '.png':'image/png','.webmanifest':'application/manifest+json'};
const server=createServer(async(req,res)=>{
  try{
    const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
    const loc=path.resolve(root,'.'+pathname);
    if(!(loc===root||loc.startsWith(root+path.sep)))throw Error('Invalid path');
    const body=await readFile(loc.endsWith(path.sep)?path.join(loc,'index.html'):loc);
    res.writeHead(200,{'Content-Type':types[path.extname(loc)]||'application/octet-stream',
      'Cache-Control':'no-store'});res.end(body);
  }catch(e){res.writeHead(404);res.end(String(e));}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const url='http://127.0.0.1:'+server.address().port+'/index.html';
const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader',
  '--disable-gpu-sandbox','--no-sandbox'
]});
const scenes=[],failures=[];
const anchors=Object.freeze([
  {name:'desert',x:512,z:0,surface:256},
  {name:'snow',x:0,z:512,surface:272},
  {name:'mountain',x:-512,z:0,surface:302},
  {name:'enchanted-forest',x:0,z:-512,surface:286}
]);
// Preserve the exact original M2/V4 source IDs on their historical seed179
// WITHOUT ever opening its obsolete generator for actual player controls.
const legacySource=new FourRegionWorld(179,fourRegionProfile(179,FOUR_REGION_GENERATOR));
const historical=anchors.map(anchor=>{
  let observed=null,y=null;
  for(let at=WORLD_MAX_Y;at>=-3;at--){
    const id=legacySource.get(anchor.x,at,anchor.z);
    if(id!==BLOCK.AIR){observed=id;y=at;break;}
  }
  if(observed!==anchor.surface)
    throw Error('Original M2 source baseline changed '+JSON.stringify({anchor,observed,y}));
  return {...anchor,y,observed,generator:FOUR_REGION_GENERATOR,sourceVerified:true};
});
const registered={
  desert:new Set([256,257,258,259,260,261,262,263,264,266]),
  snow:new Set([272,277,278,279]),
  mountain:new Set([302,303,305,307]),
  enchanted:new Set([286,293,294,289])
};
function currentV6Anchor({name,x,z},sourceWorld,seed){
  const region=name==='enchanted-forest'?'enchanted':name;
  for(let radius=0;radius<=48;radius+=8)
    for(let dx=-radius;dx<=radius;dx+=8)
      for(let dz=-radius;dz<=radius;dz+=8){
        if(Math.max(Math.abs(dx),Math.abs(dz))!==radius)continue;
        const px=x+dx,pz=z+dz;
        if((v6BiomeAt(px,pz,seed)?.name||'plains')!==region)continue;
        for(let y=WORLD_MAX_Y-1;y>=0;y--){
          const id=sourceWorld.get(px,y,pz);
          if(registered[region].has(id)&&sourceWorld.get(px,y+1,pz)===BLOCK.AIR)
            return {name,x:px,z:pz,y,surface:id,region};
        }
      }
  throw Error('No original physical V6 '+region+' source anchor near '+x+','+z);
}
const dims=[[667,375],[844,390],[932,430]];
const archived=[];
try{
  for(const [width,height] of dims){
    const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
    page.on('pageerror',e=>failures.push('pageerror '+width+'x'+height+': '+e.message));
    page.on('dialog',dialog=>dialog.accept());
    // An old seed remains reserved and verifiable as a historical archive.
    // The only PLAYABLE seed must be one genuinely created as current V6.
    await page.addInitScript(()=>{
      if(localStorage.getItem('mythwrought-v002-selected-seed')===null)
        localStorage.setItem('mythwrought-v002-selected-seed','7');
    });
    await page.goto(url,{waitUntil:'load'});
    await page.waitForFunction(()=>Boolean(window.__mythwroughtTest),null,{timeout:20000});
    const webgl=await page.evaluate(()=>Boolean(document.getElementById('scene').getContext('webgl2')));
    if(!webgl)throw Error('Real WebGL2 context unavailable at '+width+'x'+height);
    // Write a checksummed, source-authentic V4 archival sample using the
    // ORIGINAL profile persistence API. Never select, enter, restore or
    // re-label this obsolete world as current playable terrain.
    const old=await page.evaluate(async generator=>{
      const persistence=await import('./src/manual-biomes/profile-storage.mjs');
      const world=persistence.activateFourRegionProfile(localStorage,179,
        {explicitNewWorld:true,generator});
      const saved=persistence.saveFourRegionWorld(localStorage,world);
      if(!saved.ok)throw Error('Original M2 archival baseline failed verified save');
      return {
        world:localStorage.getItem('mythwrought-v002-world-179'),
        profile:localStorage.getItem('mythwrought-v002-world-179-four-biomes-profile-v1'),
        journal:localStorage.getItem('mythwrought-v002-world-179-four-biomes-profile-v1-journal')
      };
    },FOUR_REGION_GENERATOR);
    if(!old.world||!old.profile||!old.journal)
      throw Error('Original M2 source archive lacks valid checked raw bytes');
    archived.push({width,height,old});
    // Enter through the actual visible creator-approved current-only button.
    await page.locator('#playerMenu').waitFor({state:'visible',timeout:30000});
    await page.getByRole('button',{name:/NEW WORLD/}).click();
    await page.locator('#help').waitFor({state:'hidden',timeout:45000});
    const entered=await page.evaluate(()=>{
      const t=window.__mythwroughtTest,seed=t.snapshot().seed;
      return {seed,profile:t.fourBiomeProfile()?.generator,
        raw:localStorage.getItem('mythwrought-v002-world-'+seed),
        old:localStorage.getItem('mythwrought-v002-world-179')};
    });
    if(entered.seed===179||entered.profile!==M6_BALANCED_GENERATOR||
       !entered.raw||entered.old!==old.world)
      throw Error('Creator admission did not protect original V4 archive: '+
        JSON.stringify({seed:entered.seed,profile:entered.profile,oldUnchanged:entered.old===old.world}));
    const sourceWorld=new FourRegionWorld(entered.seed,
      fourRegionProfile(entered.seed,M6_BALANCED_GENERATOR));
    const currentAnchors=anchors.map(anchor=>currentV6Anchor(anchor,sourceWorld,entered.seed));
    const mode=await page.evaluate(()=>window.__mythwroughtTest.fourBiomeMode());
    if(mode!=='four-regions')throw Error('Real current-V6 source did not mount');
    for(const anchor of currentAnchors){
      const actual=await page.evaluate(({x,y,z})=>{
        const test=window.__mythwroughtTest;
        const camera=test.teleport(x-24,z-24);
        test.aimAt(x,y,z);
        return {y,block:test.block(x,y,z),mode:test.fourBiomeMode(),
          profile:test.fourBiomeProfile(),camera};
      },anchor);
      if(actual.block!==anchor.surface||actual.mode!=='four-regions'||
        actual.profile?.generator!==M6_BALANCED_GENERATOR)
        throw Error('Wrong actual current V6 '+anchor.name+' terrain '+JSON.stringify({anchor,actual}));
      await page.waitForFunction(()=>window.__mythwroughtTest.snapshot().chunks.length>=4,
        null,{timeout:90000});
      await page.waitForTimeout(1600);
      const file='m2-'+anchor.name+'-'+width+'x'+height+'.png';
      // A full WebGL2 scene under parallel native/depth runners can take over
      // Playwright's default 30s capture deadline on CI software GPUs.
      // Require a REAL rendered PNG rather than skipping this size; extend
      // only the capture deadline. GPU faults/blank frames still fail below.
      const png=await page.screenshot({path:path.join(out,file),timeout:90000});
      const decoded=PNG.sync.read(png),colors=new Set();
      // Sample the unobstructed central WORLD viewport, not UI grips/map.
      // Blank pale-green or missing geometry must fail even if world.get()
      // reports correct underlying voxels. Mountain initially failed this.
      for(let x=Math.floor(width*.27);x<Math.floor(width*.65);x+=7)
        for(let y=Math.floor(height*.25);y<Math.floor(height*.75);y+=7){
          const p=(y*decoded.width+x)*4;
          colors.add(((decoded.data[p]/16)|0)+','+
            ((decoded.data[p+1]/16)|0)+','+
            ((decoded.data[p+2]/16)|0));
        }
      const diagnostics=await page.evaluate(()=>({
        snapshot:window.__mythwroughtTest.snapshot(),
        faults:window.__mythwroughtTest.gpuUploadFaults(),
        status:document.getElementById('status')?.textContent
      }));
      if(colors.size<12||diagnostics.snapshot.chunks.length===0)
        throw Error('INVISIBLE REAL '+anchor.name+' GPU scene at '+width+'x'+height+
          ' colors='+colors.size+' '+JSON.stringify(diagnostics));
      scenes.push({file,width,height,name:anchor.name,seed:entered.seed,
        legacySourceSeed:179,archivedGenerator:FOUR_REGION_GENERATOR,
        x:anchor.x,z:anchor.z,y:actual.y,block:actual.block,
        generator:actual.profile?.generator,
        sha256:createHash('sha256').update(png).digest('hex'),
        bytes:png.length,realWebgl2:webgl,sceneColorBuckets:colors.size,
        residentChunks:diagnostics.snapshot.chunks.length,
        gpuRetries:diagnostics.snapshot.gpuRetry});
      process.stdout.write('PASS M2 live biome '+file+' block '+actual.block+' y '+actual.y+'\n');
    }
    // Mine the actual snowy terrain via the localhost-only world edit hook,
    // SAVE via the ordinary game's UI, then reload to verify authoritative
    // profile-aware persistence, rather than only isolated Node fixtures.
    const sample=scenes.find(scene=>scene.width===width&&scene.name==='snow');
    if(!sample)throw Error('Missing real current V6 snow source capture sample');
    const didEdit=await page.evaluate(({x,y,z})=>
      window.__mythwroughtTest.editBiomeCell(x,y,z,BLOCK.AIR),
      {x:sample.x,y:sample.y,z:sample.z});
    if(!didEdit)throw Error('Actual current V6 biome physical edit refused');
    await page.locator('#menu').click();
    await page.locator('.player-menu-safety-link').click();
    await page.getByRole('button',{name:'SAVE CURRENT WORLD'}).click();
    await page.locator('.player-safety-back').click();
    await page.locator('.player-menu-close').click();
    const beforeReload=await page.evaluate(seed=>
      localStorage.getItem('mythwrought-v002-world-'+seed),entered.seed);
    if(!beforeReload||!JSON.parse(beforeReload).edits.length)
      throw Error('Original SAVE CURRENT WORLD failed to persist V6 mined cell');
    await page.reload({waitUntil:'load'});
    await page.waitForFunction(()=>Boolean(window.__mythwroughtTest),null,{timeout:30000});
    const persisted=await page.evaluate(({x,y,z,seed})=>({
      mode:window.__mythwroughtTest.fourBiomeMode(),
      block:window.__mythwroughtTest.block(x,y,z),
      seed:window.__mythwroughtTest.snapshot().seed,
      profile:window.__mythwroughtTest.fourBiomeProfile(),
      raw:localStorage.getItem('mythwrought-v002-world-'+seed),
      old:localStorage.getItem('mythwrought-v002-world-179'),
      oldProfile:localStorage.getItem('mythwrought-v002-world-179-four-biomes-profile-v1'),
      oldJournal:localStorage.getItem('mythwrought-v002-world-179-four-biomes-profile-v1-journal')
    }),{x:sample.x,y:sample.y,z:sample.z,seed:entered.seed});
    if(persisted.mode!=='four-regions'||persisted.block!==BLOCK.AIR||
       persisted.seed!==entered.seed||persisted.profile?.generator!==M6_BALANCED_GENERATOR||
       persisted.raw!==beforeReload)
      throw Error('Actual current V6 biome edit/save/reload failed: '+JSON.stringify(persisted));
    if(persisted.old!==old.world||persisted.oldProfile!==old.profile||
       persisted.oldJournal!==old.journal)
      throw Error('Current V6 live edit/reload corrupted original V4 schema-1/profile/journal bytes');
    const newProfile=await page.evaluate(seed=>
      localStorage.getItem('mythwrought-v002-world-'+seed+'-four-biomes-profile-v1'),entered.seed);
    if(!newProfile)throw Error('Real current-generation profile metadata missing');
    await page.close();
  }
  if(scenes.length!==12||new Set(scenes.map(s=>s.sha256)).size<10)
    throw Error('Missing source-specific or visually repeated biome screenshots');
  await writeFile(path.join(out,'manifest.json'),JSON.stringify({
    kind:'mythwrought-real-m2-four-biome-chromium-acceptance',
    historicalSeed:179,historicalSourceGenerator:FOUR_REGION_GENERATOR,
    historicalSourceCells:historical,archivedV4RawByteParity:true,
    playableGenerator:M6_BALANCED_GENERATOR,playableWorldIsAlwaysCurrentV6:true,
    renderedInActualGame:true,physicalIphone:false,
    scenes,failures},null,2));
  if(failures.length)throw Error('Page JS errors: '+failures.join(' | '));
  process.stdout.write('PASS M2 SOURCE-EXACT V4 archived + CURRENT V6 Chromium WebGL2 four-biome capture: '+
    scenes.length+' landscape images, actual V6 mining/save/reload and byte-exact old V4 protection\n');
}catch(error){
  await writeFile(path.join(out,'failure.json'),JSON.stringify({
    error:String(error),scenes,failures},null,2));
  throw error;
}finally{
  await browser.close();
  await new Promise(resolve=>server.close(resolve));
}
