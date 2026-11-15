// Real iPhone-sized browser flow for Pack 3's distinct portable backup UI.
// Uses the actual HTML settings panel, download, file import and page reload.
import assert from 'node:assert/strict';
import {readFile,mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';
import pngjs from 'pngjs';
const {PNG}=pngjs;
const browser=await chromium.launch({headless:true,
 args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:844,height:390},hasTouch:true,
 isMobile:true,deviceScaleFactor:1,acceptDownloads:true});
const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('dialog',d=>d.accept());
try{
 await mkdir('artifacts/pack3-live',{recursive:true});
 await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
 await page.waitForFunction(()=>window.__mythwroughtTest&&
  Number(document.querySelector('#scene')?.dataset.loadedChunks)===25,null,{timeout:60000});
 const original=await page.evaluate(()=>localStorage.getItem('mythwrought-v002-world-179'));
 // Pick a world cell above the terrain that isn't a legacy or landmark solid.
 const cell=await page.evaluate(()=>{
  const t=window.__mythwroughtTest;
  for(let z=0;z<15;z++)for(let x=10;x<28;x++){
   if(t.block(x,19,z)!==0)continue;
   t.placePack3Fixture(x,19,z,116,1);
   return [x,19,z];
  }
  throw Error('No suitable physical construction cell');
 });
 await page.locator('#menu').click();
 assert.equal(await page.locator('#pack3Export').count(),1);
 assert.equal(await page.locator('#pack3Import').count(),1);
 const downloading=page.waitForEvent('download');
 await page.locator('#pack3Export').click();
 const file=await downloading,raw=await readFile(await file.path(),'utf8');
 assert.match(file.suggestedFilename(),/mythwrought-pack3-seed-179\.json/);
 assert.equal(JSON.parse(raw).overlay.entries.length,1);
 assert.equal(JSON.parse(raw).overlay.entries[0].orientation,1);
 await page.evaluate(([x,y,z])=>window.__mythwroughtTest.removePack3Fixture(x,y,z),cell);
 assert.equal(await page.evaluate(coords=>window.__mythwroughtTest.pack3Block(...coords),cell),null);
 assert.equal(await page.evaluate(()=>localStorage.getItem('mythwrought-v002-world-179')),original);
 const damaged=JSON.parse(raw);damaged.seed=219;
 await page.locator('#pack3ImportFile').setInputFiles({
   name:'foreign-seed-pack3.json',mimeType:'application/json',
   buffer:Buffer.from(JSON.stringify(damaged))
 });
 await page.waitForFunction(()=>document.querySelector('#pack3BackupStatus')?.textContent?.includes('rejected'));
 assert.equal(await page.evaluate(coords=>window.__mythwroughtTest.pack3Block(...coords),cell),null);
 await page.locator('#pack3ImportFile').setInputFiles({
   name:'verified-pack3.json',mimeType:'application/json',buffer:Buffer.from(raw)
 });
 // On approved import the app reloads; the previous test hook disappears.
 await page.waitForFunction(coords=>window.__mythwroughtTest?.pack3Block(...coords)?.id===116,
   cell,{timeout:60000});
 const state=await page.evaluate(coords=>({
  entry:window.__mythwroughtTest.pack3Block(...coords),
  schema:localStorage.getItem('mythwrought-v002-world-179'),
  saved:localStorage.getItem('mythwrought-pack3-construction-v1:179'),
  preImport:localStorage.getItem('mythwrought-pack3-construction-v1:179:pre-import'),
  gpu:!!document.querySelector('#scene').getContext('webgl2')
 }),cell);
 assert.equal(state.entry.id,116);assert.equal(state.entry.yaw,1);
 assert.equal(state.schema,original);assert.ok(state.gpu);
 assert.ok(state.saved?.includes('pack3:069'));
 assert.ok(state.preImport!==null);
 const png=PNG.sync.read(await page.screenshot({path:'artifacts/pack3-live/pack3-portable-import-844x390.png'}));
 assert.equal(png.width,844);assert.equal(png.height,390);
 assert.deepEqual(errors,[]);
 console.log('PASS Pack3 separate download + foreign reject + approved restore + WebGL2 reload',JSON.stringify({id:state.entry.id,yaw:state.entry.yaw,width:844,height:390,canonicalSaveUnchanged:true}));
}finally{await context.close();await browser.close();}
