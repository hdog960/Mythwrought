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
const dims=[[667,375],[844,390],[932,430]];
try{
  for(const [width,height] of dims){
    const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
    page.on('pageerror',e=>failures.push('pageerror '+width+'x'+height+': '+e.message));
    page.on('dialog',dialog=>dialog.accept());
    // Make the starting world a different seed (7), leaving canonical
    // original seed 179 completely unclaimed for explicit NEW-world creation.
    await page.addInitScript(()=>{
      if(localStorage.getItem('mythwrought-v002-selected-seed')===null)
        localStorage.setItem('mythwrought-v002-selected-seed','7');
    });
    await page.goto(url,{waitUntil:'load'});
    await page.waitForFunction(()=>Boolean(window.__mythwroughtTest),null,{timeout:20000});
    const webgl=await page.evaluate(()=>Boolean(document.getElementById('scene').getContext('webgl2')));
    if(!webgl)throw Error('Real WebGL2 context unavailable at '+width+'x'+height);
    await page.locator('#menu').click();
    await page.locator('#seedInput').fill('179');
    await page.locator('#createFourBiomeWorld').click();
    const mode=await page.evaluate(()=>window.__mythwroughtTest.fourBiomeMode());
    if(mode!=='four-regions')throw Error('Creator new-world UI failed for '+width+'x'+height+': '+mode);
    await page.locator('#closeHelp').click();
    for(const anchor of anchors){
      const actual=await page.evaluate(({x,z})=>{
        const test=window.__mythwroughtTest;
        test.teleport(x,z);
        let y=19,block=0;
        for(;y>=-3;y--){block=test.block(x,y,z);if(block!==0)break;}
        test.aimAt(x+5,Math.max(-2,y),z+5);
        return {y,block,mode:test.fourBiomeMode(),profile:test.fourBiomeProfile()};
      },anchor);
      if(actual.block!==anchor.surface||actual.mode!=='four-regions')
        throw Error('Wrong physical '+anchor.name+' terrain '+JSON.stringify(actual));
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
      scenes.push({file,width,height,name:anchor.name,seed:179,
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
    const snow=anchors[1],sample=scenes.at(-3)?.name===snow.name?
      scenes.at(-3):scenes.find(s=>s.width===width&&s.name===snow.name);
    if(!sample)throw Error('Missing snow capture sample');
    const didEdit=await page.evaluate(({x,y,z})=>
      window.__mythwroughtTest.editBiomeCell(x,y,z,0),
      {x:snow.x,y:sample.y,z:snow.z});
    if(!didEdit)throw Error('Actual biome terrain edit refused');
    await page.locator('#menu').click();
    await page.locator('#save').click();
    await page.reload({waitUntil:'load'});
    await page.waitForFunction(()=>Boolean(window.__mythwroughtTest),null,{timeout:20000});
    const persisted=await page.evaluate(({x,y,z})=>({
      mode:window.__mythwroughtTest.fourBiomeMode(),
      block:window.__mythwroughtTest.block(x,y,z),
      profile:window.__mythwroughtTest.fourBiomeProfile()
    }),{x:snow.x,y:sample.y,z:snow.z});
    if(persisted.mode!=='four-regions'||persisted.block!==0||
       persisted.profile?.generator!=='mythwrought-four-surface-regions-v2')
      throw Error('Actual WebGL game biome edit/save/reload failed: '+JSON.stringify(persisted));
    const profileInStorage=await page.evaluate(()=>[
      localStorage.getItem('mythwrought-v002-world-179-four-biomes-profile-v1')!==null,
      localStorage.getItem('mythwrought-v002-world-7-four-biomes-profile-v1')===null
    ]);
    if(!profileInStorage.every(Boolean))throw Error('Legacy world was accidentally profiled');
    await page.close();
  }
  if(scenes.length!==12||new Set(scenes.map(s=>s.sha256)).size<10)
    throw Error('Missing source-specific or visually repeated biome screenshots');
  await writeFile(path.join(out,'manifest.json'),JSON.stringify({
    kind:'mythwrought-real-m2-four-biome-chromium-acceptance',seed:179,
    renderedInActualGame:true,physicalIphone:false,
    scenes,failures},null,2));
  if(failures.length)throw Error('Page JS errors: '+failures.join(' | '));
  process.stdout.write('PASS M2 REAL Chromium WebGL2 four-biome capture: '+
    scenes.length+' landscape images, actual mining/save/reload, no legacy profile drift\n');
}catch(error){
  await writeFile(path.join(out,'failure.json'),JSON.stringify({
    error:String(error),scenes,failures},null,2));
  throw error;
}finally{
  await browser.close();
  await new Promise(resolve=>server.close(resolve));
}
