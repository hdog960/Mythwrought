// M5 genuine Chromium: actual keyboard-controlled player moves from
// legacy spawn in a fresh v4 four-biome WORLD. No debug teleport, no direct
// player-position edit, no fake map prefill. This is a SHORT walking segment,
// deliberately NOT proof of the 512-block distant biome journey.
import {chromium} from 'playwright';
import {PNG} from 'pngjs';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';

const root=process.cwd(),out=path.join(root,'artifacts/manual-biomes-m5-spawn');
await mkdir(out,{recursive:true});
const sha=b=>createHash('sha256').update(b).digest('hex');
const mime={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript',
 '.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png',
 '.webmanifest':'application/manifest+json'};
const server=createServer(async(req,res)=>{
 try{
   const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
   const file=path.resolve(root,'.'+pathname);
   if(!(file===root||file.startsWith(root+path.sep)))throw Error('unsafe path');
   const bytes=await readFile(file.endsWith(path.sep)?path.join(file,'index.html'):file);
   res.writeHead(200,{'Content-Type':mime[path.extname(file)]||
     'application/octet-stream','Cache-Control':'no-store'});res.end(bytes);
 }catch(e){res.writeHead(404);res.end(String(e));}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const browser=await chromium.launch({headless:true,args:[
 '--enable-webgl','--use-gl=angle','--use-angle=swiftshader',
 '--disable-gpu-sandbox','--no-sandbox'
]});
const sizes=[[667,375],[844,390],[932,430]],scenes=[],errors=[],journeys=[];
try{
 for(const [width,height] of sizes){
   const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
   page.on('pageerror',e=>errors.push(width+'x'+height+': '+e.message));
   page.on('dialog',dialog=>dialog.accept());
   await page.addInitScript(()=>{
     if(localStorage.getItem('mythwrought-v002-selected-seed')===null)
       localStorage.setItem('mythwrought-v002-selected-seed','7');
   });
   await page.goto('http://127.0.0.1:'+server.address().port+'/index.html',
     {waitUntil:'load'});
   await page.waitForFunction(()=>Boolean(window.__mythwroughtTest),null,{timeout:30000});
   if(!await page.evaluate(()=>Boolean(
       document.getElementById('scene').getContext('webgl2'))))
     throw Error('Real WebGL2 unavailable in physical walking test');
   await page.locator('#menu').click();
   await page.locator('#seedInput').fill('179');
   await page.locator('#createFourBiomeWorld').click();
   if(await page.evaluate(()=>window.__mythwroughtTest.fourBiomeProfile()?.generator)
       !=='mythwrought-four-surface-regions-v4')
     throw Error('New profile world selection failed');
   await page.locator('#closeHelp').click();
   const checkPosition=async()=>{
     await page.locator('#miniMapButton').click();
     const text=await page.locator('#explorationCoordinates').innerText();
     const match=text.match(/X\s+(-?\d+)\s*·\s*Z\s+(-?\d+)\s*·\s*Seed\s+(-?\d+)/);
     if(!match||Number(match[3])!==179)
       throw Error('Authentic map coordinates unavailable: '+text);
     const found=await page.evaluate(()=>Number(
       document.getElementById('miniMap').dataset.discovered||'0'));
     await page.locator('#closeExploration').click();
     return {x:Number(match[1]),z:Number(match[2]),discovered:found};
   };
   const original=await checkPosition();
   const shot=async(kind,record)=>{
     await page.waitForTimeout(1400);
     const name='m5-actual-player-'+kind+'-'+width+'x'+height+'.png';
     const bytes=await page.screenshot({path:path.join(out,name),timeout:90000});
     const png=PNG.sync.read(bytes);
     if(png.width!==width||png.height!==height)
       throw Error('Bad M5 screenshot dimensions '+name);
     const snap=await page.evaluate(()=>window.__mythwroughtTest.snapshot());
     if(snap.gpuRetry?.failures||!snap.chunks?.length)
       throw Error('Actual M5 world not resident or GPU retry failed');
     scenes.push({name,kind,width,height,position:record,
       bytes:bytes.length,sha256:sha(bytes),
       realGameInput:true,teleportUsed:false,
       residentChunks:snap.chunks.length,gpuRetry:snap.gpuRetry});
     console.log('PASS M5 physical keyboard '+kind+' '+width+'x'+height);
   };
   await shot('spawn',original);
   let current=original,events=[];
   // Native keyboard events, not source-injected player movement. Try all
   // directions if a real protected landmark/collision blocks a short leg.
   // Never move the player directly or alter the world's terrain.
   for(const key of ['w','a','d','s']){
     await page.locator('#scene').focus();
     await page.keyboard.down(key);
     await page.waitForTimeout(2400);
     await page.keyboard.up(key);
     const next=await checkPosition();
     const progress=Math.hypot(next.x-original.x,next.z-original.z);
     events.push({key,after:next,metersFromStart:progress});
     current=next;
     if(progress>=5&&next.discovered>original.discovered)break;
   }
   const travel=Math.hypot(current.x-original.x,current.z-original.z);
   if(travel<5||current.discovered<=original.discovered)
     throw Error('Actual input from legacy spawn did not move >=5 blocks and discover new map tiles: '+
       JSON.stringify({original,events}));
   await shot('walked-with-keys',current);
   await page.reload({waitUntil:'load'});
   await page.waitForFunction(()=>Boolean(window.__mythwroughtTest),null,{timeout:30000});
   const after=await checkPosition();
   const storage=await page.evaluate(()=>({
     map:localStorage.getItem('mythwrought-exploration-v1-179'),
     legacyMap:localStorage.getItem('mythwrought-exploration-v1-7'),
     legacyProfile:localStorage.getItem('mythwrought-v002-world-7-four-biomes-profile-v1'),
     currentProfile:window.__mythwroughtTest.fourBiomeProfile()?.generator
   }));
   if(!storage.map||storage.legacyMap||storage.legacyProfile||
      storage.currentProfile!=='mythwrought-four-surface-regions-v4'||
      JSON.parse(storage.map).seed!==179||
      after.discovered<current.discovered)
     throw Error('M5 map cold reload leaked fog or seed identity '+JSON.stringify({
       after,current,hasMap:!!storage.map,hasLegacy:!!storage.legacyMap,
       legacyProfile:!!storage.legacyProfile,currentProfile:storage.currentProfile}));
   journeys.push({width,height,spawn:original,lastPosition:current,
     physicalTravelFromSpawn:travel,keyboardLegs:events,
     persistentDiscoveredTiles:after.discovered,coldReload:true});
   await page.close();
 }
 if(scenes.length!==6||new Set(scenes.map(x=>x.sha256)).size!==6)
   throw Error('M5 missing one of the six genuine input screenshot witnesses');
 if(errors.length)throw Error('Actual game JavaScript errors '+errors.join('; '));
 await writeFile(path.join(out,'manifest.json'),JSON.stringify({
   kind:'mythwrought-m5-actual-keyboard-spawn-walk',
   complete512BlockJourneys:false,
   guarantee:'No debug teleport, no player-position writes, actual keyboard input',
   legacyWorldPreserved:true,realChromium:true,
   screens:scenes,journeys,errors
 },null,2));
 console.log('PASS M5 6 authentic Chromium spawn/input/fog screenshots; '+
   'long-distance four-biome overland certification remains separate');
}catch(error){
 await writeFile(path.join(out,'failure.json'),JSON.stringify({
   error:String(error),screens:scenes,journeys,errors
 },null,2));throw error;
}finally{
 await browser.close();
 await new Promise(resolve=>server.close(resolve));
}
