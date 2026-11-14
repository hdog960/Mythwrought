// Pack 4 only. Genuine Chromium opt-in inspection; not part of root CI's
// current test glob. Run with installed Playwright and Chromium, from repo root:
// node tests/block-packs/pack-4/gallery-browser.mjs
// Never opens/changes the live world or GitHub Pages.
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';

const root=resolve(fileURLToPath(new URL('../../../',import.meta.url)));
const port=0; // OS-chosen isolated ephemeral port
const allowed=new Set([
 '/tests/block-packs/pack-4/gallery.html',
 '/tests/block-packs/pack-4/gallery.mjs',
 '/src/block-packs/pack-4/windows.mjs',
 '/src/block-packs/pack-4/lighting.mjs',
 '/src/block-packs/pack-4/furnishings.mjs'
]);
const mime={'.html':'text/html; charset=utf-8','.mjs':'text/javascript; charset=utf-8'};
const server=createServer(async (req,res)=>{
 try{
  const url=new URL(req.url,'http://127.0.0.1');
  if(!allowed.has(url.pathname)){res.writeHead(404);res.end('Not in isolated Pack 4 allowlist');return}
  const bytes=await readFile(resolve(root,url.pathname.slice(1)));
  res.writeHead(200,{'content-type':mime[extname(url.pathname)]||'text/plain',
   'cache-control':'no-store'});res.end(bytes);
 }catch(error){res.writeHead(500);res.end(String(error))}
});
let browser,passed=0;
const sizes=[[667,375],[844,390],[932,430]];
try{
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',resolve)});
 const url='http://127.0.0.1:'+server.address().port+
  '/tests/block-packs/pack-4/gallery.html';
 browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader',
  '--enable-unsafe-swiftshader','--no-sandbox']});
 for(const [width,height] of sizes){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1,
   isMobile:true,hasTouch:true});
  const errors=[];
  page.on('pageerror',e=>errors.push(String(e)));
  await page.goto(url,{waitUntil:'load'});
  await page.waitForFunction(()=>window.__PACK4_GALLERY_RESULT?.ready,{timeout:20000});
  const report=await page.evaluate(()=>window.__PACK4_GALLERY_RESULT);
  if(report.success!==17||report.results.length!==17||!report.sharedWebglSurface||
     report.results.some(x=>!x.ok)||
     report.allIds.join(',')!==Array.from({length:17},(_,i)=>159+i).join(','))
    throw Error('Pack4 WebGL2 source rendering failed: '+JSON.stringify(report));
  if(errors.length)throw Error('Pack4 browser page errors: '+errors.join(' | '));
  const selector=page.locator('select').last();
  await selector.selectOption('3');
  await page.waitForTimeout(80);
  const allCanvases=await page.locator('#gallery canvas').count();
  if(allCanvases!==17)throw Error('Expected 17 reviewable candidate cards');
  const warning=await page.locator('.warning').innerText();
  if(!warning.includes('UNMERGED CANDIDATE'))throw Error('Missing mandatory candidate watermark');
  const directory=resolve(root,'artifacts/pack-4');
  await mkdir(directory,{recursive:true});
  await page.screenshot({path:resolve(directory,'pack4-UNMERGED-'+width+'x'+height+'.png'),fullPage:true});
  passed++;
  await page.close();
 }
 console.log(JSON.stringify({result:'PASS',browser:'Chromium/WebGL2',landscapeSizes:passed,
  candidateIDs:'159–175',screenshots:'artifacts/pack-4/pack4-UNMERGED-*.png',
  warning:'Isolated gallery ONLY, no live world or physical iPhone validation'}));
}finally{
 await browser?.close();
 await new Promise(resolve=>server.close(resolve));
}
