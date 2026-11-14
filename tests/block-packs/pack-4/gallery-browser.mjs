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
 '/src/block-packs/pack-4/furnishings.mjs',
 '/src/block-packs/pack-4/hearth-civic.mjs',
 '/src/block-packs/pack-4/preview-utils.mjs'
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
  if(report.success!==23||report.results.length!==23||!report.sharedWebglSurface||
     report.results.some(x=>!x.ok)||
     report.allIds.join(',')!==Array.from({length:23},(_,i)=>159+i).join(','))
    throw Error('Pack4 WebGL2 source rendering failed: '+JSON.stringify(report));
  if(errors.length)throw Error('Pack4 browser page errors: '+errors.join(' | '));
  // All 23 actual WebGL2 card snapshots are required at four orientations.
  const scan=()=>page.locator('#gallery canvas').evaluateAll(canvases=>
    canvases.map(canvas=>{
      const data=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;
      const background=[data[0],data[1],data[2]];
      let hash=2166136261,foreground=0;
      for(let i=0;i<data.length;i+=4){
        hash=Math.imul(hash ^ data[i],16777619)>>>0;
        hash=Math.imul(hash ^ data[i+1],16777619)>>>0;
        hash=Math.imul(hash ^ data[i+2],16777619)>>>0;
        if(Math.abs(data[i]-background[0])+
           Math.abs(data[i+1]-background[1])+
           Math.abs(data[i+2]-background[2])>=24)foreground++;
      }
      return {hash,foreground};
    })
  );
  const rotationHashes=[];
  const directory=resolve(root,'artifacts/pack-4');
  await mkdir(directory,{recursive:true});
  if(await page.locator('#gallery canvas').count()!==23||
     await page.locator('#gallery select').count()!==23)
    throw Error('Expected 23 independent canvases and rotation selectors');
  const warning=await page.locator('.warning').innerText();
  if(!warning.includes('UNMERGED CANDIDATE'))
    throw Error('Missing mandatory unmerged review watermark');
  for(let rotation=0;rotation<4;rotation++){
    if(rotation>0){
      await page.locator('#gallery select').evaluateAll((selectors,r)=>{
        for(const selector of selectors){
          selector.value=String(r);
          selector.dispatchEvent(new Event('change',{bubbles:true}));
        }
      },rotation);
    }
    const fingerprints=await scan();
    if(fingerprints.length!==23||
       fingerprints.some(x=>x.foreground<700))
      throw Error('Blank or low-contrast candidate at rotation '+rotation+': '+
        JSON.stringify(fingerprints));
    if(rotation===0&&new Set(fingerprints.map(x=>x.hash)).size!==23)
      throw Error('Initial 23 candidate images are not visually distinct');
    const descriptions=await page.locator('#gallery article p').allTextContents();
    if(descriptions.some(x=>/^\s*(Error|TypeError|RangeError):/.test(x)))
      throw Error('Candidate rotation error '+rotation+': '+
        descriptions.filter(x=>/^\s*(Error|TypeError|RangeError):/.test(x)).join(' | '));
    rotationHashes.push(fingerprints.map(x=>x.hash));
    await page.screenshot({path:resolve(directory,
      'pack4-UNMERGED-'+width+'x'+height+'-r'+rotation+'.png'),
      fullPage:true});
  }
  // Replay the zero-degree view after 69 later draws (23 models × 3 rotations).
  // Catches GPU-state leaks, stale WebGL buffers and non-deterministic snapshots
  // that a single initial screenshot would miss.
  await page.locator('#gallery select').evaluateAll(selectors=>{
    for(const selector of selectors){
      selector.value='0';
      selector.dispatchEvent(new Event('change',{bubbles:true}));
    }
  });
  const replayFingerprints=await scan();
  const baseline=rotationHashes[0];
  if(replayFingerprints.length!==23||
     replayFingerprints.some((x,i)=>x.hash!==baseline[i]||x.foreground<700))
    throw Error('Pack4 WebGL2 orientation-reset replay differs from original '+
      width+'x'+height+' zero-degree render: '+JSON.stringify(replayFingerprints));
  const replayErrors=await page.locator('#gallery article p').allTextContents();
  if(replayErrors.some(x=>/^(Error|TypeError|RangeError):/.test(x.trimStart())))
    throw Error('Pack4 reset render failed: '+replayErrors.filter(x=>
      /^(Error|TypeError|RangeError):/.test(x.trimStart())).join(' | '));
  for(const id of [177,181]){
    if(new Set(rotationHashes.map(row=>row[id-159])).size<2)
      throw Error('Asymmetric candidate '+id+' has no visible rotation');
  }
  if(errors.length)throw Error('Pack4 browser page errors: '+errors.join(' | '));
  passed++;
  await page.close();
 }
 console.log(JSON.stringify({result:'PASS',browser:'Chromium/WebGL2',landscapeSizes:passed,assets:23,rotationsPerAsset:4,
  candidateIDs:'159–181',screenshots:'artifacts/pack-4/pack4-UNMERGED-*-r0..r3.png',
  warning:'Isolated gallery ONLY, no live world or physical iPhone validation'}));
}finally{
 await browser?.close();
 await new Promise(resolve=>server.close(resolve));
}
